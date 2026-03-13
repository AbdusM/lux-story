/**
 * Admin Action Plan Review API Endpoint
 *
 * Counselors/admins can attach a review to a learner's nowcasting action plan.
 * Review data is stored inside the persisted plan record, but learners cannot
 * write this field via the /api/user/action-plan endpoint.
 *
 * GET  /api/admin/action-plan-review?userId=player_123
 * POST /api/admin/action-plan-review
 *   body: { userId: string, review: { status: 'draft'|'needs_work'|'approved', feedback?: string } }
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { AdvisorReviewStatusSchema, extractAdvisorReview, withAdvisorReview } from '@/lib/action-plan/advisor-review'
import { auditLog } from '@/lib/audit-logger'
import { getAdminSupabaseClient, requireAdminAuth } from '@/lib/admin-supabase-client'
import { readJsonBody } from '@/lib/api/request-body'
import { logger } from '@/lib/logger'
import { getClientIp, rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const limiter = rateLimit({
  interval: 60_000,
  uniqueTokenPerInterval: 500,
})

const ReviewUpsertBodySchema = z.object({
  userId: z.string().min(1).max(160),
  review: z.object({
    status: AdvisorReviewStatusSchema,
    feedback: z.string().max(8_000).optional(),
  }),
})

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

async function loadStoredPlan(options: {
  supabase: ReturnType<typeof getAdminSupabaseClient>
  userId: string
}): Promise<{ plan: Record<string, unknown> | null; missingTable: boolean }> {
  const { supabase, userId } = options

  const { data, error } = await supabase
    .from('user_action_plans')
    .select('plan_data')
    .eq('user_id', userId)
    .maybeSingle()

  if (!error) {
    return {
      plan: isPlainObject(data?.plan_data) ? data.plan_data : null,
      missingTable: false,
    }
  }

  if (error.code !== '42P01') {
    if (error.code === 'PGRST116') return { plan: null, missingTable: false }
    throw error
  }

  const { data: profileData, error: profileError } = await supabase
    .from('player_profiles')
    .select('last_action_plan')
    .eq('user_id', userId)
    .maybeSingle()

  if (profileError) {
    if (profileError.code === 'PGRST116') return { plan: null, missingTable: true }
    throw profileError
  }

  return {
    plan: isPlainObject(profileData?.last_action_plan) ? profileData.last_action_plan : null,
    missingTable: true,
  }
}

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request)
  if (authError) return authError

  const ip = getClientIp(request)
  try {
    await limiter.check(ip, 30)
  } catch {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } },
    )
  }

  const userId = request.nextUrl.searchParams.get('userId')
  if (!userId || userId.length > 160) {
    return NextResponse.json({ error: 'Invalid userId' }, { status: 400 })
  }

  try {
    const supabase = getAdminSupabaseClient()
    const existing = await loadStoredPlan({ supabase, userId })
    const review = extractAdvisorReview(existing.plan)

    auditLog('view_action_plan_review', 'admin', userId)

    return NextResponse.json(
      { success: true, userId, review },
      { headers: { 'Cache-Control': 'private, max-age=30' } },
    )
  } catch (error) {
    logger.error(
      'Unexpected error in admin action-plan-review endpoint',
      { operation: 'admin.action-plan-review.get', userId },
      error instanceof Error ? error : undefined,
    )
    return NextResponse.json(
      { error: 'An error occurred fetching the action plan review' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdminAuth(request)
  if (authError) return authError

  const ip = getClientIp(request)
  try {
    await limiter.check(ip, 10)
  } catch {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } },
    )
  }

  const parsed = await readJsonBody(request, { maxBytes: 32_768 })
  if (!parsed.ok) return parsed.response

  const body = ReviewUpsertBodySchema.safeParse(parsed.body)
  if (!body.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const userId = body.data.userId
  const updatedAtIso = new Date().toISOString()
  const review = {
    status: body.data.review.status,
    feedback: body.data.review.feedback?.trim() ?? '',
    updatedAt: updatedAtIso,
  }

  try {
    const supabase = getAdminSupabaseClient()
    const existing = await loadStoredPlan({ supabase, userId })
    const planWithReview = withAdvisorReview(existing.plan, review)

    if (existing.missingTable) {
      const { error } = await supabase
        .from('player_profiles')
        .update({ last_action_plan: planWithReview })
        .eq('user_id', userId)

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('user_action_plans')
        .upsert(
          {
            user_id: userId,
            plan_data: planWithReview,
            updated_at: updatedAtIso,
          },
          { onConflict: 'user_id' },
        )

      if (error) throw error
    }

    auditLog('update_action_plan_review', 'admin', userId, {
      status: review.status,
    })

    return NextResponse.json({ success: true, userId, review })
  } catch (error) {
    logger.error(
      'Unexpected error in admin action-plan-review endpoint',
      { operation: 'admin.action-plan-review.save', userId },
      error instanceof Error ? error : undefined,
    )
    return NextResponse.json(
      { error: 'An error occurred saving the action plan review' },
      { status: 500 },
    )
  }
}

