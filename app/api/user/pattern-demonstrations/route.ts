/**
 * Pattern Demonstrations API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles individual pattern demonstration records
 * Provides decision-making style analytics for admin dashboard and student insights
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { PATTERN_TYPES } from '@/lib/patterns'
import { logger } from '@/lib/logger'
import { ensurePlayerProfile } from '@/lib/api/ensure-player-profile'
import {
  supabaseErrorResponse,
  handleApiError
} from '@/lib/api/api-utils'
import { readJsonBody } from '@/lib/api/request-body'
import { ensureProvidedUserIdMatchesSession, requireUserSession } from '@/lib/api/user-session'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_POST = 'pattern-demonstrations.post'

const MAX_BODY_BYTES = 16_384

/**
 * POST /api/user/pattern-demonstrations
 * Insert individual pattern demonstration record
 */
export async function POST(request: NextRequest) {
  try {
    const session = requireUserSession(request)
    if (!session.ok) return session.response

    const parsed = await readJsonBody(request, { maxBytes: MAX_BODY_BYTES })
    if (!parsed.ok) return parsed.response
    const body = parsed.body as Record<string, unknown>
    const { user_id, pattern_name, choice_id, choice_text, scene_id, character_id, context, demonstrated_at } = body

    logger.debug('Pattern demonstrations POST request', { operation: OPERATION_POST, userId: session.userId, patternName: pattern_name })

    // Validate required fields
    if (!pattern_name || !choice_id) {
      logger.warn('Missing required fields', { operation: OPERATION_POST })
      return NextResponse.json({ error: 'Missing required fields: pattern_name, choice_id' }, { status: 400 })
    }

    const mismatch = ensureProvidedUserIdMatchesSession({
      provided: user_id,
      sessionUserId: session.userId,
      fieldName: 'user_id',
    })
    if (mismatch) return mismatch

    // Validate pattern_name against CHECK constraint
    if (typeof pattern_name !== 'string' || !PATTERN_TYPES.includes(pattern_name as (typeof PATTERN_TYPES)[number])) {
      logger.warn('Invalid pattern name', { operation: OPERATION_POST, patternName: pattern_name })
      return NextResponse.json({ error: `Invalid pattern_name. Must be one of: ${PATTERN_TYPES.join(', ')}` }, { status: 400 })
    }
    const patternName = pattern_name as (typeof PATTERN_TYPES)[number]

    // Ensure player profile exists BEFORE attempting to insert
    await ensurePlayerProfile(session.userId, 'pattern-demonstrations')

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('pattern_demonstrations')
      .insert({
        user_id: session.userId,
        pattern_name: patternName,
        choice_id,
        choice_text: choice_text || '',
        scene_id: scene_id || '',
        character_id: character_id || '',
        context: context || '',
        demonstrated_at: demonstrated_at || new Date().toISOString()
      })
      .select()
      .single()

    // PGRST204 means "no content" - insert succeeded but RLS prevents select
    if (error && error.code !== 'PGRST204') {
      return supabaseErrorResponse(OPERATION_POST, error.code, 'Failed to insert pattern demonstration', session.userId)
    }

    logger.debug('Pattern demonstration inserted', { operation: OPERATION_POST, userId: session.userId, patternName: pattern_name })

    return NextResponse.json({ success: true, demonstration: data })
  } catch (error) {
    return handleApiError(error, OPERATION_POST, 'POST')
  }
}
