import { NextRequest, NextResponse } from 'next/server'

import { getAdminSupabaseClient, requireAdminAuth } from '@/lib/admin-supabase-client'
import { auditLog } from '@/lib/audit-logger'
import { buildAdminStudentInsightsFunnelSummary } from '@/lib/telemetry/admin-student-insights-summary'
import { STUDENT_INSIGHTS_EVENT_TYPES, type StudentInsightsInteractionEventRow } from '@/lib/telemetry/admin-student-insights-helpers'
import { logger } from '@/lib/logger'
import { getClientIp, rateLimit } from '@/lib/rate-limit'
import type { AdminStudentInsightsSummaryResponse } from '@/lib/types/admin-api'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const studentInsightsLimiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
})

const DEFAULT_DAYS = 30
const MIN_DAYS = 1
const MAX_DAYS = 90
const EVENT_LIMIT = 5000

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

export async function GET(
  request: NextRequest,
): Promise<NextResponse<AdminStudentInsightsSummaryResponse | { error: string }>> {
  const authError = await requireAdminAuth(request)
  if (authError) {
    return authError as NextResponse<AdminStudentInsightsSummaryResponse | { error: string }>
  }

  const ip = getClientIp(request)
  try {
    await studentInsightsLimiter.check(ip, 10)
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
        const emptySummary = buildAdminStudentInsightsFunnelSummary({
          interactionEvents: [],
          days,
          eventLimit: EVENT_LIMIT,
          truncated: false,
        })

        return NextResponse.json(
          { success: true, summary: emptySummary, fetchedAt: new Date().toISOString() },
          { headers: { 'Cache-Control': 'private, max-age=30' } },
        )
      }

      throw error
    }

    const interactionEvents = (data ?? []) as StudentInsightsInteractionEventRow[]
    const summary = buildAdminStudentInsightsFunnelSummary({
      interactionEvents,
      days,
      eventLimit: EVENT_LIMIT,
      truncated: interactionEvents.length >= EVENT_LIMIT,
    })

    const responseData: AdminStudentInsightsSummaryResponse = {
      success: true,
      summary,
      fetchedAt: new Date().toISOString(),
    }

    auditLog('view_action_data', 'admin', undefined, {
      studentInsights: true,
      days,
      users: summary.totals.uniqueUsers,
      recommendationsShown: summary.totals.counts.recommendationShown,
      plansCompleted: summary.totals.counts.taskCompleted,
      artifactsExported: summary.totals.counts.artifactExported,
    })

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'private, max-age=30',
      },
    })
  } catch (error) {
    logger.error(
      'Failed to build student insights funnel summary',
      { operation: 'admin.student-insights.summary', days },
      error instanceof Error ? error : undefined,
    )

    return NextResponse.json(
      { error: 'Unable to load student insights summary' },
      { status: 500 },
    )
  }
}
