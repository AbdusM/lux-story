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
import { validateUserId } from '@/lib/user-id-validation'
import { logger } from '@/lib/logger'
import { ensurePlayerProfile } from '@/lib/api/ensure-player-profile'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/user/pattern-demonstrations
 * Insert individual pattern demonstration record
 *
 * Body: {
 *   user_id: string,
 *   pattern_name: 'analytical' | 'patience' | 'exploring' | 'helping' | 'building',
 *   choice_id: string,
 *   choice_text: string,
 *   scene_id: string,
 *   character_id: string,
 *   context: string,
 *   demonstrated_at?: ISO date string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      user_id,
      pattern_name,
      choice_id,
      choice_text,
      scene_id,
      character_id,
      context,
      demonstrated_at
    } = body

    logger.debug('Pattern demonstrations POST request', {
      operation: 'pattern-demonstrations.post',
      userId: user_id,
      patternName: pattern_name
    })

    if (!user_id || !pattern_name || !choice_id) {
      logger.warn('Missing required fields', { operation: 'pattern-demonstrations.post' })
      return NextResponse.json(
        { error: 'Missing required fields: user_id, pattern_name, choice_id' },
        { status: 400 }
      )
    }

    const validation = validateUserId(user_id)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Validate pattern_name against CHECK constraint
    if (!PATTERN_TYPES.includes(pattern_name)) {
      logger.warn('Invalid pattern name', {
        operation: 'pattern-demonstrations.post',
        patternName: pattern_name
      })
      return NextResponse.json(
        { error: `Invalid pattern_name. Must be one of: ${PATTERN_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    // Ensure player profile exists BEFORE attempting to insert pattern demonstration
    // This prevents foreign key violations (error 23503)
    await ensurePlayerProfile(user_id, 'pattern-demonstrations')

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('pattern_demonstrations')
      .insert({
        user_id,
        pattern_name,
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
      logger.error('Supabase error', {
        operation: 'pattern-demonstrations.post',
        errorCode: error.code,
        userId: user_id,
        patternName: pattern_name
      }, error instanceof Error ? error : undefined)
      return NextResponse.json(
        { error: 'Failed to insert pattern demonstration', details: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
      )
    }

    logger.debug('Pattern demonstration inserted', {
      operation: 'pattern-demonstrations.post',
      userId: user_id,
      patternName: pattern_name
    })

    return NextResponse.json({
      success: true,
      demonstration: data
    })
  } catch (error) {
    logger.error('Unexpected error in pattern demonstrations POST', {
      operation: 'pattern-demonstrations.post'
    }, error instanceof Error ? error : undefined)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
