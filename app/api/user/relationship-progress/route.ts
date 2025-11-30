/**
 * Relationship Progress API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles character relationship progress records
 * Tracks trust level, relationship status, and interaction history
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { validateUserId } from '@/lib/user-id-validation'
import { logger } from '@/lib/logger'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/user/relationship-progress
 * Upsert relationship progress record (update if exists, insert if new)
 *
 * Body: {
 *   user_id: string,
 *   character_name: string,
 *   trust_level: number (0-100),
 *   relationship_status: 'stranger' | 'acquaintance' | 'confidant',
 *   last_interaction?: string (ISO date),
 *   interaction_count?: number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      user_id,
      character_name,
      trust_level,
      relationship_status,
      last_interaction,
      interaction_count
    } = body

    logger.debug('Relationship progress POST request', {
      operation: 'relationship-progress.post',
      userId: user_id,
      character: character_name
    })

    if (!user_id || !character_name || trust_level === undefined) {
      logger.warn('Missing required fields', { operation: 'relationship-progress.post' })
      return NextResponse.json(
        { error: 'Missing required fields: user_id, character_name, trust_level' },
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

    // Upsert: update if user_id + character_name exists, otherwise insert
    const { data, error } = await supabase
      .from('relationship_progress')
      .upsert(
        {
          user_id,
          character_name,
          trust_level,
          relationship_status: relationship_status || 'stranger',
          last_interaction: last_interaction || new Date().toISOString(),
          interaction_count: interaction_count || 1
        },
        {
          onConflict: 'user_id,character_name'
        }
      )
      .select()
      .single()

    if (error) {
      logger.error('Supabase error', {
        operation: 'relationship-progress.post',
        errorCode: error.code,
        userId: user_id,
        character: character_name
      }, error instanceof Error ? error : undefined)
      return NextResponse.json(
        { error: 'Failed to upsert relationship progress' },
        { status: 500 }
      )
    }

    logger.debug('Relationship progress upserted', {
      operation: 'relationship-progress.post',
      userId: user_id,
      character: character_name
    })

    return NextResponse.json({
      success: true,
      relationship: data
    })
  } catch (error) {
    logger.error('Unexpected error in relationship progress POST', {
      operation: 'relationship-progress.post'
    }, error instanceof Error ? error : undefined)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

/**
 * GET /api/user/relationship-progress?userId=xxx
 * Retrieve all relationship records for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      logger.warn('Missing userId parameter', { operation: 'relationship-progress.get' })
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }

    const validation = validateUserId(userId)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('relationship_progress')
      .select('*')
      .eq('user_id', userId)
      .order('trust_level', { ascending: false })

    if (error) {
      logger.error('Supabase error', {
        operation: 'relationship-progress.get',
        errorCode: error.code,
        userId
      }, error instanceof Error ? error : undefined)
      return NextResponse.json(
        { error: 'Failed to fetch relationship progress' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      relationships: data || []
    })
  } catch (error) {
    logger.error('Unexpected error in relationship progress GET', {
      operation: 'relationship-progress.get'
    }, error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
