/**
 * Admin Interaction Events Endpoint
 *
 * Returns interaction_events telemetry for bias/engagement analysis.
 * Uses service role client (bypasses RLS) and requires admin auth.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth, getAdminSupabaseClientOrNull } from '@/lib/admin-supabase-client'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const telemetryLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

function clampInt(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min
  return Math.max(min, Math.min(max, value))
}

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request)
  if (authError) return authError

  const ip = getClientIp(request)
  try {
    await telemetryLimiter.check(ip, 120) // 120 req/min
  } catch {
    return NextResponse.json(
      { error: 'Too many telemetry requests. Try again in a minute.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  const supabase = getAdminSupabaseClientOrNull()
  if (!supabase) {
    return NextResponse.json({
      success: true,
      configured: false,
      meta: { reason: 'Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL', returned: 0 },
      events: [],
    })
  }

  const sp = request.nextUrl.searchParams
  const hours = clampInt(parseInt(sp.get('hours') || '24', 10), 1, 24 * 30)
  const limit = clampInt(parseInt(sp.get('limit') || '2000', 10), 1, 10000)
  const userId = sp.get('userId') || undefined
  const eventType = sp.get('eventType') || undefined

  const sinceIso = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

  try {
    let query = supabase
      .from('interaction_events')
      .select('id,user_id,session_id,event_type,node_id,character_id,ordering_variant,ordering_seed,payload,occurred_at')
      .gte('occurred_at', sinceIso)
      .order('occurred_at', { ascending: false })
      .limit(limit)

    if (userId) query = query.eq('user_id', userId)
    if (eventType) query = query.eq('event_type', eventType)

    const { data, error } = await query

    if (error) {
      logger.error('Failed to fetch interaction events', {
        operation: 'admin.interaction-events.get',
        code: error.code,
        hours,
        limit,
        userId,
        eventType,
      })
      return NextResponse.json({ error: 'Failed to fetch interaction events' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      configured: true,
      meta: { hours, limit, since: sinceIso, returned: data?.length || 0, userId: userId || null, eventType: eventType || null },
      events: data || [],
    })
  } catch (e) {
    logger.error('Unexpected error fetching interaction events', { operation: 'admin.interaction-events.get' }, e instanceof Error ? e : undefined)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

