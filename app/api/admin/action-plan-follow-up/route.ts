import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import {
  ActionPlanFollowUpStatusSchema,
  extractActionPlanFollowUp,
  extractActionPlanFollowUpHistory,
  withFollowUpStatus,
} from '@/lib/action-plan/follow-up-status'
import {
  insertFollowUpEvent,
  loadFollowUpEventsForUser,
} from '@/lib/action-plan/follow-up-event-store'
import { auditLog } from '@/lib/audit-logger'
import {
  getAdminSupabaseClient,
  getAuthenticatedAdminContext,
  requireAdminAuth,
} from '@/lib/admin-supabase-client'
import { readJsonBody } from '@/lib/api/request-body'
import { logger } from '@/lib/logger'
import { getClientIp, rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const limiter = rateLimit({
  interval: 60_000,
  uniqueTokenPerInterval: 500,
})

const FollowUpUpsertBodySchema = z.object({
  userId: z.string().min(1).max(160),
  followUp: z.object({
    status: ActionPlanFollowUpStatusSchema,
    note: z.string().max(2_000).optional(),
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
    const latestStoredFollowUp = extractActionPlanFollowUp(existing.plan)
    const storedHistory = extractActionPlanFollowUpHistory(existing.plan)
    const eventHistoryResult = await loadFollowUpEventsForUser({ supabase, userId })
    const history = eventHistoryResult.events.length > 0 ? eventHistoryResult.events : storedHistory
    const followUp = history[0] ?? latestStoredFollowUp

    auditLog('view_action_plan_follow_up', 'admin', userId)

    return NextResponse.json(
      { success: true, userId, followUp, history },
      { headers: { 'Cache-Control': 'private, max-age=30' } },
    )
  } catch (error) {
    logger.error(
      'Unexpected error in admin action-plan-follow-up endpoint',
      { operation: 'admin.action-plan-follow-up.get', userId },
      error instanceof Error ? error : undefined,
    )
    return NextResponse.json(
      { error: 'An error occurred fetching the action plan follow-up status' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  const [adminContext, authError] = await getAuthenticatedAdminContext(request)
  if (authError) return authError
  if (!adminContext) {
    return NextResponse.json({ error: 'Unauthorized - Please sign in' }, { status: 401 })
  }

  const ip = getClientIp(request)
  try {
    await limiter.check(ip, 10)
  } catch {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } },
    )
  }

  const parsed = await readJsonBody(request, { maxBytes: 16_384 })
  if (!parsed.ok) return parsed.response

  const body = FollowUpUpsertBodySchema.safeParse(parsed.body)
  if (!body.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const userId = body.data.userId
  const note = body.data.followUp.note?.trim() ?? ''
  const followUp = {
    status: body.data.followUp.status,
    updatedAt: new Date().toISOString(),
    ...(note.length > 0 ? { note } : {}),
    updatedBy: {
      userId: adminContext.userId,
      email: adminContext.email,
      fullName: adminContext.fullName,
    },
  }

  try {
    const supabase = getAdminSupabaseClient()
    const existing = await loadStoredPlan({ supabase, userId })
    const planWithFollowUp = withFollowUpStatus(existing.plan, followUp)

    if (existing.missingTable) {
      const { error } = await supabase
        .from('player_profiles')
        .update({ last_action_plan: planWithFollowUp })
        .eq('user_id', userId)

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('user_action_plans')
        .upsert(
          {
            user_id: userId,
            plan_data: planWithFollowUp,
            updated_at: followUp.updatedAt,
          },
          { onConflict: 'user_id' },
        )

      if (error) throw error
    }

    let eventLogStored = false
    try {
      const eventResult = await insertFollowUpEvent({ supabase, userId, followUp })
      eventLogStored = eventResult.persisted
    } catch (eventError) {
      logger.error(
        'Failed to persist counselor follow-up event',
        { operation: 'admin.action-plan-follow-up.event', userId },
        eventError instanceof Error ? eventError : undefined,
      )
    }

    let history = extractActionPlanFollowUpHistory(planWithFollowUp)
    try {
      const eventHistoryResult = await loadFollowUpEventsForUser({ supabase, userId })
      if (eventHistoryResult.events.length > 0) {
        history = eventHistoryResult.events
      }
    } catch (historyError) {
      logger.error(
        'Failed to load counselor follow-up event history',
        { operation: 'admin.action-plan-follow-up.history', userId },
        historyError instanceof Error ? historyError : undefined,
      )
    }

    auditLog('update_action_plan_follow_up', 'admin', userId, {
      status: followUp.status,
      hasNote: note.length > 0,
      updatedByUserId: adminContext.userId,
      eventLogStored,
    })

    return NextResponse.json({ success: true, userId, followUp, history })
  } catch (error) {
    logger.error(
      'Unexpected error in admin action-plan-follow-up endpoint',
      { operation: 'admin.action-plan-follow-up.save', userId },
      error instanceof Error ? error : undefined,
    )
    return NextResponse.json(
      { error: 'An error occurred saving the action plan follow-up status' },
      { status: 500 },
    )
  }
}
