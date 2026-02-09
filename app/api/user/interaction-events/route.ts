/**
 * Interaction Events API Endpoint
 *
 * Canonical analytics telemetry sink (offline-first via lib/sync-queue.ts).
 *
 * Table: interaction_events
 * - payload stored as JSONB (schema validated softly via lib/telemetry/interaction-events-spec.ts)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { validateUserIdFromBody, handleApiError } from '@/lib/api/api-utils'
import { isInteractionEventType, validateInteractionEventPayload } from '@/lib/telemetry/interaction-events-spec'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_POST = 'interaction-events.post'

// Rate limiter: telemetry can be frequent, but keep a ceiling.
const writeLimiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 1000 })

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    try {
      await writeLimiter.check(ip, 240)
    } catch {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body = await request.json()
    const {
      user_id,
      session_id,
      event_type,
      node_id,
      character_id,
      ordering_variant,
      ordering_seed,
      payload,
      occurred_at,
    } = body ?? {}

    const validation = validateUserIdFromBody(user_id, OPERATION_POST)
    if (!validation.valid) return validation.response

    if (!session_id || !event_type || payload === undefined) {
      logger.warn('Missing required fields', { operation: OPERATION_POST })
      return NextResponse.json({ error: 'Missing required fields: session_id, event_type, payload' }, { status: 400 })
    }

    if (typeof session_id !== 'string' || typeof event_type !== 'string') {
      return NextResponse.json({ error: 'Invalid types for session_id or event_type' }, { status: 400 })
    }

    // Soft contract validation: add diagnostic to payload on mismatch (do not block gameplay).
    const payloadIssues = validateInteractionEventPayload(event_type, payload)
    const enrichedPayload = payloadIssues.length
      ? {
          ...(typeof payload === 'object' && payload !== null ? payload : { value: payload }),
          __gct_validation: {
            ok: false,
            issues: payloadIssues,
          },
        }
      : payload

    if (!isInteractionEventType(event_type)) {
      // Still store unknown types (so we can detect drift), but log loudly.
      logger.warn('Unknown interaction event_type', { operation: OPERATION_POST, event_type, user_id })
    }

    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from('interaction_events')
      .insert({
        user_id,
        session_id,
        event_type,
        node_id: node_id ?? null,
        character_id: character_id ?? null,
        ordering_variant: ordering_variant ?? null,
        ordering_seed: ordering_seed ?? null,
        payload: enrichedPayload,
        occurred_at: occurred_at || new Date().toISOString(),
      })
      .select()
      .single()

    // PGRST204 = insert succeeded but RLS prevents select (shouldn't happen for service role)
    if (error && error.code !== 'PGRST204') {
      logger.error('Failed to insert interaction event', { operation: OPERATION_POST, user_id, event_type, code: error.code })
      return NextResponse.json({ error: 'Failed to insert interaction event' }, { status: 500 })
    }

    return NextResponse.json({ success: true, event: data })
  } catch (error) {
    return handleApiError(error, OPERATION_POST, 'POST')
  }
}

