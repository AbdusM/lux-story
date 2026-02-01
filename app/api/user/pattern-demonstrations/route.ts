/**
 * Pattern Demonstrations API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles individual pattern demonstration records
 * Provides decision-making style analytics for admin dashboard and student insights
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { PATTERN_TYPES, normalizePatternName } from '@/lib/patterns'
import { logger } from '@/lib/logger'
import { ensurePlayerProfile } from '@/lib/api/ensure-player-profile'
import {
  validateUserIdFromBody,
  supabaseErrorResponse,
  handleApiError
} from '@/lib/api/api-utils'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_POST = 'pattern-demonstrations.post'

/**
 * POST /api/user/pattern-demonstrations
 * Insert individual pattern demonstration record
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, pattern_name, choice_id, choice_text, scene_id, character_id, context, demonstrated_at } = body

    logger.debug('Pattern demonstrations POST request', { operation: OPERATION_POST, userId: user_id, patternName: pattern_name })

    // Validate required fields
    if (!pattern_name || !choice_id) {
      logger.warn('Missing required fields', { operation: OPERATION_POST })
      return NextResponse.json({ error: 'Missing required fields: pattern_name, choice_id' }, { status: 400 })
    }

    const validation = validateUserIdFromBody(user_id, OPERATION_POST)
    if (!validation.valid) {
      return validation.response
    }

    const normalizedPattern = normalizePatternName(pattern_name)
    // Validate pattern_name against CHECK constraint
    if (!normalizedPattern || !PATTERN_TYPES.includes(normalizedPattern)) {
      logger.warn('Invalid pattern name', { operation: OPERATION_POST, patternName: pattern_name })
      return NextResponse.json({ error: `Invalid pattern_name. Must be one of: ${PATTERN_TYPES.join(', ')}` }, { status: 400 })
    }

    // Ensure player profile exists BEFORE attempting to insert
    await ensurePlayerProfile(user_id, 'pattern-demonstrations')

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('pattern_demonstrations')
      .insert({
        user_id,
        pattern_name: normalizedPattern,
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
      return supabaseErrorResponse(OPERATION_POST, error.code, 'Failed to insert pattern demonstration', user_id)
    }

    logger.debug('Pattern demonstration inserted', { operation: OPERATION_POST, userId: user_id, patternName: pattern_name })

    return NextResponse.json({ success: true, demonstration: data })
  } catch (error) {
    return handleApiError(error, OPERATION_POST, 'POST')
  }
}
