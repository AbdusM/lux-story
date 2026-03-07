import { NextRequest, NextResponse } from 'next/server'

import { auditLog } from '@/lib/audit-logger'
import { createTimer } from '@/lib/api-timing'
import { getAdminSupabaseClient, requireAdminAuth } from '@/lib/admin-supabase-client'
import {
  buildAdminGuidanceDiagnostics,
  GUIDANCE_DIAGNOSTIC_EVENT_TYPES,
} from '@/lib/guidance/admin-diagnostics'
import { loadGuidanceStateForUser } from '@/lib/guidance/db-store'
import { mergePlanWithGuidanceRecord, stripGuidanceFromPlan } from '@/lib/guidance/storage'
import { logger } from '@/lib/logger'
import { getClientIp, rateLimit } from '@/lib/rate-limit'

const guidanceCache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL_MS = 30 * 1000

const guidanceLimiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
})

type GuidanceEventRow = {
  event_type: string
  occurred_at: string | null
  payload: unknown
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

async function loadStoredPlan(
  userId: string,
  supabase: ReturnType<typeof getAdminSupabaseClient>,
): Promise<Record<string, unknown> | null> {
  const { data, error } = await supabase
    .from('user_action_plans')
    .select('plan_data')
    .eq('user_id', userId)
    .maybeSingle()

  if (!error) {
    return isPlainObject(data?.plan_data) ? data.plan_data : null
  }

  if (error.code !== '42P01') {
    throw error
  }

  const { data: profileData, error: profileError } = await supabase
    .from('player_profiles')
    .select('last_action_plan')
    .eq('user_id', userId)
    .maybeSingle()

  if (profileError) throw profileError
  return isPlainObject(profileData?.last_action_plan) ? profileData.last_action_plan : null
}

async function loadGuidancePlan(
  userId: string,
  supabase: ReturnType<typeof getAdminSupabaseClient>,
): Promise<Record<string, unknown> | null> {
  const [storedPlan, guidanceStateResult] = await Promise.all([
    loadStoredPlan(userId, supabase),
    loadGuidanceStateForUser(supabase, userId),
  ])

  if (guidanceStateResult.missingTables || !guidanceStateResult.state) {
    return storedPlan
  }

  return mergePlanWithGuidanceRecord(
    stripGuidanceFromPlan(storedPlan),
    guidanceStateResult.state.record,
    guidanceStateResult.state.snapshot ?? undefined,
  )
}

async function loadInteractionEvents(
  userId: string,
  supabase: ReturnType<typeof getAdminSupabaseClient>,
): Promise<GuidanceEventRow[]> {
  const { data, error } = await supabase
    .from('interaction_events')
    .select('event_type, payload, occurred_at')
    .eq('user_id', userId)
    .in('event_type', [...GUIDANCE_DIAGNOSTIC_EVENT_TYPES])
    .order('occurred_at', { ascending: false })
    .limit(500)
    .abortSignal(AbortSignal.timeout(10_000))

  if (!error) {
    return (data ?? []) as GuidanceEventRow[]
  }

  if (error.code === '42P01') {
    return []
  }

  throw error
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const authError = await requireAdminAuth(request)
  if (authError) return authError

  const ip = getClientIp(request)
  try {
    await guidanceLimiter.check(ip, 10)
  } catch {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': '60' },
      },
    )
  }

  const { userId } = await params
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  const cacheKey = `guidance:${userId}`
  const cached = guidanceCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data, {
      headers: { 'X-Cache': 'HIT', 'Cache-Control': 'private, max-age=30' },
    })
  }

  try {
    const supabase = getAdminSupabaseClient()
    const queryTimer = createTimer('admin.guidance.queries', { userId })

    const [plan, interactionEvents] = await Promise.all([
      loadGuidancePlan(userId, supabase),
      loadInteractionEvents(userId, supabase),
    ])

    const queryTiming = queryTimer.stop()
    const responseData = {
      success: true,
      userId,
      guidance: buildAdminGuidanceDiagnostics({
        plan,
        interactionEvents,
      }),
      fetchedAt: new Date().toISOString(),
      metadata: {
        queryTimeMs: queryTiming.durationMs,
        interactionEventCount: interactionEvents.length,
      },
    }

    auditLog('view_action_data', 'admin', userId)

    guidanceCache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now(),
    })

    if (guidanceCache.size > 100) {
      const cutoff = Date.now() - CACHE_TTL_MS
      for (const [key, entry] of guidanceCache.entries()) {
        if (entry.timestamp < cutoff) {
          guidanceCache.delete(key)
        }
      }
    }

    return NextResponse.json(responseData, {
      headers: { 'X-Cache': 'MISS', 'Cache-Control': 'private, max-age=30' },
    })
  } catch (error) {
    logger.error(
      'Unexpected error in guidance diagnostics endpoint',
      { operation: 'admin.guidance', userId },
      error instanceof Error ? error : undefined,
    )

    return NextResponse.json(
      { error: 'An error occurred fetching guidance diagnostics' },
      { status: 500 },
    )
  }
}
