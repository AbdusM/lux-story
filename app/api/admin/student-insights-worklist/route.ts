import { NextRequest, NextResponse } from 'next/server'

import { extractAdvisorReview } from '@/lib/action-plan/advisor-review'
import { extractOutcomeCheckIn } from '@/lib/action-plan/outcome-check-in'
import { getAdminSupabaseClient, requireAdminAuth } from '@/lib/admin-supabase-client'
import { auditLog } from '@/lib/audit-logger'
import { logger } from '@/lib/logger'
import {
  STUDENT_INSIGHTS_EVENT_TYPES,
  type StudentInsightsInteractionEventRow,
} from '@/lib/telemetry/admin-student-insights-helpers'
import { buildAdminStudentInsightsWorklist } from '@/lib/telemetry/admin-student-insights-worklist'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import type { AdminStudentInsightsWorklistResponse } from '@/lib/types/admin-api'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const worklistLimiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
})

const DEFAULT_DAYS = 30
const MIN_DAYS = 1
const MAX_DAYS = 90
const DEFAULT_LIMIT = 25
const MIN_LIMIT = 1
const MAX_LIMIT = 100
const EVENT_LIMIT = 5000

function clampInteger(value: string | null, fallback: number, min: number, max: number): number {
  const parsed = Number.parseInt(value ?? '', 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(Math.max(parsed, min), max)
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = []
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size))
  }
  return result
}

async function loadProfiles(options: {
  supabase: ReturnType<typeof getAdminSupabaseClient>
  userIds: string[]
}): Promise<Array<{ userId: string; email: string | null; fullName: string | null }>> {
  const profiles: Array<{ userId: string; email: string | null; fullName: string | null }> = []

  for (const group of chunk(options.userIds, 250)) {
    const { data, error } = await options.supabase
      .from('profiles')
      .select('user_id, email, full_name')
      .in('user_id', group)

    if (error) throw error

    for (const row of data ?? []) {
      profiles.push({
        userId: row.user_id,
        email: typeof row.email === 'string' ? row.email : null,
        fullName: typeof row.full_name === 'string' ? row.full_name : null,
      })
    }
  }

  return profiles
}

async function loadPlans(options: {
  supabase: ReturnType<typeof getAdminSupabaseClient>
  userIds: string[]
}): Promise<Array<{ userId: string; plan: Record<string, unknown> | null; updatedAt: string | null }>> {
  const plans: Array<{ userId: string; plan: Record<string, unknown> | null; updatedAt: string | null }> = []

  try {
    for (const group of chunk(options.userIds, 250)) {
      const { data, error } = await options.supabase
        .from('user_action_plans')
        .select('user_id, plan_data, updated_at')
        .in('user_id', group)

      if (error) throw error

      for (const row of data ?? []) {
        plans.push({
          userId: row.user_id,
          plan: isPlainObject(row.plan_data) ? row.plan_data : null,
          updatedAt: typeof row.updated_at === 'string' ? row.updated_at : null,
        })
      }
    }

    return plans
  } catch (error) {
    const code = isPlainObject(error) && typeof error.code === 'string' ? error.code : null
    if (code !== '42P01') throw error
  }

  for (const group of chunk(options.userIds, 250)) {
    const { data, error } = await options.supabase
      .from('player_profiles')
      .select('user_id, last_action_plan')
      .in('user_id', group)

    if (error) throw error

    for (const row of data ?? []) {
      const plan = isPlainObject(row.last_action_plan) ? row.last_action_plan : null
      const outcomeCheckIn = extractOutcomeCheckIn(plan)
      const advisorReview = extractAdvisorReview(plan)
      plans.push({
        userId: row.user_id,
        plan,
        updatedAt:
          typeof plan?.updatedAt === 'string'
            ? plan.updatedAt
            : outcomeCheckIn?.updatedAt ?? advisorReview?.updatedAt ?? null,
      })
    }
  }

  return plans
}

export async function GET(
  request: NextRequest,
): Promise<NextResponse<AdminStudentInsightsWorklistResponse | { error: string }>> {
  const authError = await requireAdminAuth(request)
  if (authError) {
    return authError as NextResponse<AdminStudentInsightsWorklistResponse | { error: string }>
  }

  const ip = getClientIp(request)
  try {
    await worklistLimiter.check(ip, 10)
  } catch {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } },
    )
  }

  const days = clampInteger(request.nextUrl.searchParams.get('days'), DEFAULT_DAYS, MIN_DAYS, MAX_DAYS)
  const limit = clampInteger(request.nextUrl.searchParams.get('limit'), DEFAULT_LIMIT, MIN_LIMIT, MAX_LIMIT)
  const sinceIso = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  try {
    const supabase = getAdminSupabaseClient()
    const { data, error } = await supabase
      .from('interaction_events')
      .select('user_id, event_type, payload, occurred_at')
      .in('event_type', [...STUDENT_INSIGHTS_EVENT_TYPES])
      .gte('occurred_at', sinceIso)
      .order('occurred_at', { ascending: false })
      .limit(EVENT_LIMIT)
      .abortSignal(AbortSignal.timeout(10_000))

    if (error) {
      if (error.code === '42P01') {
        const empty = buildAdminStudentInsightsWorklist({
          interactionEvents: [],
          days,
          limit,
        })

        return NextResponse.json(
          { success: true, worklist: empty, fetchedAt: new Date().toISOString() },
          { headers: { 'Cache-Control': 'private, max-age=30' } },
        )
      }

      throw error
    }

    const interactionEvents = (data ?? []) as StudentInsightsInteractionEventRow[]
    const userIds = [...new Set(interactionEvents.map((event) => event.user_id).filter(Boolean))]

    const [profiles, plans] = await Promise.all([
      userIds.length > 0 ? loadProfiles({ supabase, userIds }) : Promise.resolve([]),
      userIds.length > 0 ? loadPlans({ supabase, userIds }) : Promise.resolve([]),
    ])

    const worklist = buildAdminStudentInsightsWorklist({
      interactionEvents,
      profiles,
      plans,
      days,
      limit,
    })

    auditLog('view_action_data', 'admin', undefined, {
      studentInsightsWorklist: true,
      days,
      flaggedUsers: worklist.flaggedUsers,
      reporters: worklist.outcomeSnapshot.reporters,
    })

    return NextResponse.json(
      { success: true, worklist, fetchedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'private, max-age=30' } },
    )
  } catch (error) {
    logger.error(
      'Failed to build student insights worklist',
      { operation: 'admin.student-insights.worklist', days, limit },
      error instanceof Error ? error : undefined,
    )

    return NextResponse.json(
      { error: 'Unable to load student insights worklist' },
      { status: 500 },
    )
  }
}
