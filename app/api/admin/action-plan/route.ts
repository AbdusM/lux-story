/**
 * Admin Action Plan API Endpoint
 *
 * Returns the saved learner action plan (signals -> plan -> proof) so
 * counselors/admins can review what the learner is working on.
 *
 * GET /api/admin/action-plan?userId=player_123
 */

import { NextRequest, NextResponse } from 'next/server'

import { auditLog } from '@/lib/audit-logger'
import { getAdminSupabaseClient, requireAdminAuth } from '@/lib/admin-supabase-client'
import { logger } from '@/lib/logger'
import { getClientIp, rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const limiter = rateLimit({
  interval: 60_000,
  uniqueTokenPerInterval: 500,
})

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

async function loadStoredPlan(options: {
  supabase: ReturnType<typeof getAdminSupabaseClient>
  userId: string
}): Promise<Record<string, unknown> | null> {
  const { supabase, userId } = options

  const { data, error } = await supabase
    .from('user_action_plans')
    .select('plan_data')
    .eq('user_id', userId)
    .maybeSingle()

  if (!error) {
    return isPlainObject(data?.plan_data) ? data.plan_data : null
  }

  if (error.code !== '42P01') {
    if (error.code === 'PGRST116') return null
    throw error
  }

  const { data: profileData, error: profileError } = await supabase
    .from('player_profiles')
    .select('last_action_plan')
    .eq('user_id', userId)
    .maybeSingle()

  if (profileError) {
    if (profileError.code === 'PGRST116') return null
    throw profileError
  }

  return isPlainObject(profileData?.last_action_plan) ? profileData.last_action_plan : null
}

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request)
  if (authError) return authError

  const ip = getClientIp(request)
  try {
    await limiter.check(ip, 20)
  } catch {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } },
    )
  }

  const userId = request.nextUrl.searchParams.get('userId')
  if (!userId || userId.length > 160) {
    return NextResponse.json(
      { error: 'Invalid userId' },
      { status: 400 },
    )
  }

  try {
    const supabase = getAdminSupabaseClient()
    const plan = await loadStoredPlan({ supabase, userId })

    auditLog('view_action_plan', 'admin', userId)

    return NextResponse.json(
      { success: true, userId, plan },
      { headers: { 'Cache-Control': 'private, max-age=30' } },
    )
  } catch (error) {
    logger.error(
      'Unexpected error in admin action-plan endpoint',
      { operation: 'admin.action-plan', userId },
      error instanceof Error ? error : undefined,
    )

    return NextResponse.json(
      { error: 'An error occurred fetching the action plan' },
      { status: 500 },
    )
  }
}
