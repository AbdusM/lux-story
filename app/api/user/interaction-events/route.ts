/**
 * Interaction Events API Endpoint
 * Grand Central Terminus - Telemetry for UI bias + engagement analysis
 *
 * Stores "what was shown" (choice ordering) and "what was selected" events.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { logger } from '@/lib/logger'
import { ensurePlayerProfile } from '@/lib/api/ensure-player-profile'
import {
  validateUserIdFromBody,
  supabaseErrorResponse,
  handleApiError
} from '@/lib/api/api-utils'
import { validateInteractionEventPayload } from '@/lib/telemetry/interaction-events-spec'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_POST = 'interaction-events.post'

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

export async function POST(request: NextRequest) {
  try {
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
      occurred_at
    } = body ?? {}

    logger.debug('Interaction events POST request', {
      operation: OPERATION_POST,
      userId: user_id,
      eventType: event_type,
      nodeId: node_id
    })

    if (!event_type || !session_id || !payload) {
      return NextResponse.json(
        { error: 'Missing required fields: session_id, event_type, payload' },
        { status: 400 }
      )
    }

    const validation = validateUserIdFromBody(user_id, OPERATION_POST)
    if (!validation.valid) {
      return validation.response
    }

    await ensurePlayerProfile(user_id, 'interaction-events')

    const payloadIssues = validateInteractionEventPayload(String(event_type), payload)
    if (payloadIssues.length > 0) {
      logger.warn('Interaction event payload validation warnings', {
        operation: `${OPERATION_POST}.validate`,
        userId: user_id,
        eventType: event_type,
        issues: payloadIssues.slice(0, 12)
      })
    }

    const supabase = getSupabaseServerClient()
    const payloadToStore = (() => {
      if (!isRecord(payload)) {
        return { __gct_validation: { version: 1, issues: ['payload was not an object'] } }
      }
      if (payloadIssues.length === 0) return payload
      return {
        ...payload,
        __gct_validation: {
          version: 1,
          issues: payloadIssues.slice(0, 24)
        }
      }
    })()

    const { data, error } = await supabase
      .from('interaction_events')
      .insert({
        user_id,
        session_id,
        event_type,
        node_id: node_id || null,
        character_id: character_id || null,
        ordering_variant: ordering_variant || null,
        ordering_seed: ordering_seed || null,
        payload: payloadToStore,
        occurred_at: occurred_at || new Date().toISOString()
      })
      .select()
      .single()

    if (error && error.code !== 'PGRST204') {
      return supabaseErrorResponse(OPERATION_POST, error.code, 'Failed to insert interaction event', user_id)
    }

    return NextResponse.json({ success: true, event: data })
  } catch (error) {
    return handleApiError(error, OPERATION_POST, 'POST')
  }
}
