/**
 * Skill Demonstrations API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles individual skill demonstration records
 * Provides granular evidence for admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { validateUserId } from '@/lib/user-id-validation'
import { logger } from '@/lib/logger'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/user/skill-demonstrations
 * Insert individual skill demonstration record
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, skill_name, scene_id, scene_description, choice_text, context, demonstrated_at } = body

    // Simple validation - this is an internal API called by our code
    if (!user_id || !skill_name || !scene_id) {
      logger.warn('Missing required fields', { operation: 'skill-demonstrations.post' })
      return NextResponse.json(
        { error: 'Missing required fields: user_id, skill_name, scene_id' },
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

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('skill_demonstrations')
      .insert({
        user_id,
        skill_name,
        scene_id,
        scene_description: scene_description || null,
        choice_text: choice_text || '',
        context: context || '',
        demonstrated_at: demonstrated_at || new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      logger.error('Supabase error', {
        operation: 'skill-demonstrations.post',
        errorCode: error.code,
        userId: user_id
      }, error instanceof Error ? error : undefined)
      return NextResponse.json(
        { error: 'Failed to insert skill demonstration' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      demonstration: data
    })
  } catch (error) {
    logger.error('Unexpected error in skill demonstrations POST', {
      operation: 'skill-demonstrations.post'
    }, error instanceof Error ? error : undefined)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
