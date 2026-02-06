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

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_POST = 'interaction-events.post'

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function validateTelemetryPayload(eventType: string, payload: unknown): string[] {
  const errors: string[] = []
  if (!isRecord(payload)) return ['payload must be an object']

  const hasString = (k: string) => typeof payload[k] === 'string' && (payload[k] as string).trim().length > 0
  const hasNumber = (k: string) => typeof payload[k] === 'number' && Number.isFinite(payload[k] as number)
  const isNullOrString = (v: unknown) => v === null || typeof v === 'string'
  const isNullOrNumber = (v: unknown) => v === null || (typeof v === 'number' && Number.isFinite(v))

  if (eventType === 'choice_presented') {
    if (!hasString('event_id')) errors.push('choice_presented requires payload.event_id (string)')
    if (!hasNumber('presented_at_ms')) errors.push('choice_presented requires payload.presented_at_ms (number)')
    if (!Array.isArray(payload.choices)) errors.push('choice_presented requires payload.choices (array)')
    if (Array.isArray(payload.choices)) {
      // Keep this light: validate first few rows only.
      for (const [i, row] of payload.choices.slice(0, 6).entries()) {
        if (!isRecord(row)) {
          errors.push(`choice_presented payload.choices[${i}] must be an object`)
          continue
        }
        if (typeof row.index !== 'number') errors.push(`choice_presented payload.choices[${i}].index must be a number`)
        if (!isNullOrString(row.choice_id)) errors.push(`choice_presented payload.choices[${i}].choice_id must be string|null`)
        if (!(row.pattern === null || typeof row.pattern === 'string')) errors.push(`choice_presented payload.choices[${i}].pattern must be string|null`)
        if (!isNullOrNumber(row.gravity_weight)) errors.push(`choice_presented payload.choices[${i}].gravity_weight must be number|null`)
      }
    }
  } else if (eventType === 'choice_selected_ui') {
    if (!hasString('event_id')) errors.push('choice_selected_ui requires payload.event_id (string)')
    if (!('presented_event_id' in payload) || !(payload.presented_event_id === null || typeof payload.presented_event_id === 'string')) {
      errors.push('choice_selected_ui requires payload.presented_event_id (string|null)')
    }
    if (!hasString('selected_choice_id')) errors.push('choice_selected_ui requires payload.selected_choice_id (string)')
    if (!('selected_index' in payload) || !(payload.selected_index === null || typeof payload.selected_index === 'number')) {
      errors.push('choice_selected_ui requires payload.selected_index (number|null)')
    }
    if (!hasNumber('reaction_time_ms')) errors.push('choice_selected_ui requires payload.reaction_time_ms (number)')
  } else if (eventType === 'choice_selected_result') {
    // This is authoritative server-side (game logic) telemetry; keep validations permissive.
    if ('reaction_time_ms' in payload && !isNullOrNumber(payload.reaction_time_ms)) errors.push('choice_selected_result payload.reaction_time_ms must be number|null')
    if ('earned_pattern' in payload && !(payload.earned_pattern === null || typeof payload.earned_pattern === 'string')) errors.push('choice_selected_result payload.earned_pattern must be string|null')
    if ('trust_delta' in payload && !isNullOrNumber(payload.trust_delta)) errors.push('choice_selected_result payload.trust_delta must be number|null')
  }

  return errors
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

    const payloadErrors = validateTelemetryPayload(String(event_type), payload)
    if (payloadErrors.length > 0) {
      logger.warn('Interaction event payload validation warnings', {
        operation: `${OPERATION_POST}.validate`,
        userId: user_id,
        eventType: event_type,
        issues: payloadErrors.slice(0, 12)
      })
    }

    const supabase = getSupabaseServerClient()
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
        payload: isRecord(payloadErrors.length > 0 ? payload : payload)
          ? payloadErrors.length > 0
            ? {
              ...payload,
              __gct_validation: {
                version: 1,
                issues: payloadErrors.slice(0, 24)
              }
            }
            : payload
          : { __gct_validation: { version: 1, issues: ['payload was not an object'] } },
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
