import { NextRequest, NextResponse } from 'next/server'

import { auditLog } from '@/lib/audit-logger'
import { createTimer } from '@/lib/api-timing'
import { getAdminSupabaseClient, requireAdminAuth } from '@/lib/admin-supabase-client'
import { GUIDANCE_DIAGNOSTIC_EVENT_TYPES } from '@/lib/guidance/admin-diagnostics'
import { buildAdminGuidanceCohortSummary } from '@/lib/guidance/cohort-summary'
import { loadGuidancePlanRowsFromDb } from '@/lib/guidance/db-store'
import { getAdaptiveGuidanceRolloutConfig } from '@/lib/guidance/rollout'
import { logger } from '@/lib/logger'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import type { AdminGuidanceSummaryResponse } from '@/lib/types/admin-api'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const summaryLimiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
})

const DEFAULT_DAYS = 30
const MIN_DAYS = 7
const MAX_DAYS = 90
const DEFAULT_USER_LIMIT = 200
const MAX_USER_LIMIT = 500
const EVENT_LIMIT = 5000

type GuidancePlanSummaryRow = {
  user_id: string
  plan_data?: unknown
  last_action_plan?: unknown
}

type GuidanceSummaryEventRow = {
  user_id: string
  event_type: string
  occurred_at: string | null
  payload: unknown
}

function clampInteger(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
): number {
  const parsed = Number.parseInt(value ?? '', 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(Math.max(parsed, min), max)
}

async function loadPlanRows(
  limit: number,
  supabase: ReturnType<typeof getAdminSupabaseClient>,
): Promise<GuidancePlanSummaryRow[]> {
  const { data, error } = await supabase
    .from('user_action_plans')
    .select('user_id, plan_data')
    .order('updated_at', { ascending: false })
    .limit(limit)
    .abortSignal(AbortSignal.timeout(10_000))

  if (!error) {
    return (data ?? []) as GuidancePlanSummaryRow[]
  }

  if (error.code !== '42P01') {
    throw error
  }

  const fallback = await supabase
    .from('player_profiles')
    .select('user_id, last_action_plan')
    .order('last_activity', { ascending: false })
    .limit(limit)
    .abortSignal(AbortSignal.timeout(10_000))

  if (fallback.error) {
    if (fallback.error.code === '42P01') return []
    throw fallback.error
  }

  return (fallback.data ?? []) as GuidancePlanSummaryRow[]
}

async function loadInteractionEvents(
  sinceIso: string,
  supabase: ReturnType<typeof getAdminSupabaseClient>,
): Promise<GuidanceSummaryEventRow[]> {
  const { data, error } = await supabase
    .from('interaction_events')
    .select('user_id, event_type, payload, occurred_at')
    .in('event_type', [...GUIDANCE_DIAGNOSTIC_EVENT_TYPES])
    .gte('occurred_at', sinceIso)
    .order('occurred_at', { ascending: false })
    .limit(EVENT_LIMIT)
    .abortSignal(AbortSignal.timeout(10_000))

  if (!error) {
    return (data ?? []) as GuidanceSummaryEventRow[]
  }

  if (error.code === '42P01') {
    return []
  }

  throw error
}

export async function GET(
  request: NextRequest,
): Promise<NextResponse<AdminGuidanceSummaryResponse | { error: string }>> {
  const authError = await requireAdminAuth(request)
  if (authError) {
    return authError as NextResponse<AdminGuidanceSummaryResponse | { error: string }>
  }

  const ip = getClientIp(request)
  try {
    await summaryLimiter.check(ip, 10)
  } catch {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': '60' },
      },
    )
  }

  const days = clampInteger(
    request.nextUrl.searchParams.get('days'),
    DEFAULT_DAYS,
    MIN_DAYS,
    MAX_DAYS,
  )
  const userLimit = clampInteger(
    request.nextUrl.searchParams.get('limit'),
    DEFAULT_USER_LIMIT,
    1,
    MAX_USER_LIMIT,
  )
  const sinceIso = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  try {
    const supabase = getAdminSupabaseClient()
    const queryTimer = createTimer('admin.guidance.summary.queries', {
      days,
      userLimit,
    })

    const [dbPlanRowsResult, interactionEvents] = await Promise.all([
      loadGuidancePlanRowsFromDb(supabase, userLimit),
      loadInteractionEvents(sinceIso, supabase),
    ])

    const planRows = dbPlanRowsResult.missingTables
      ? await loadPlanRows(userLimit, supabase)
      : dbPlanRowsResult.planRows

    const queryTiming = queryTimer.stop()
    const summary = buildAdminGuidanceCohortSummary({
      planRows,
      interactionEvents,
      days,
      userLimit,
      rolloutConfig: getAdaptiveGuidanceRolloutConfig(),
      truncated:
        planRows.length >= userLimit ||
        interactionEvents.length >= EVENT_LIMIT ||
        (!dbPlanRowsResult.missingTables && dbPlanRowsResult.planRows.length >= userLimit),
    })

    const responseData: AdminGuidanceSummaryResponse = {
      success: true,
      summary,
      fetchedAt: new Date().toISOString(),
    }

    auditLog('view_action_data', 'admin', undefined, {
      summary: true,
      days,
      userLimit,
      usersWithGuidance: summary.totals.usersWithGuidance,
    })

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'private, max-age=30',
        'X-Query-Time-Ms': String(queryTiming.durationMs),
      },
    })
  } catch (error) {
    logger.error(
      'Failed to build admin guidance cohort summary',
      { operation: 'admin.guidance.summary', days, userLimit },
      error instanceof Error ? error : undefined,
    )
    return NextResponse.json(
      { error: 'Unable to load guidance cohort summary' },
      { status: 500 },
    )
  }
}
