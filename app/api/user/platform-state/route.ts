/**
 * Platform State API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles global game state synchronization
 * Tracks current scene, global flags, and behavioral patterns
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { validateUserId } from '@/lib/user-id-validation'
import { logger } from '@/lib/logger'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/user/platform-state
 * Upsert platform state record (update if exists, insert if new)
 *
 * Body: {
 *   user_id: string,
 *   current_scene?: string,
 *   global_flags?: string[],
 *   patterns?: {
 *     analytical: number,
 *     helping: number,
 *     building: number,
 *     patience: number,
 *     exploring: number
 *   },
 *   updated_at?: string (ISO date)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      user_id,
      current_scene,
      global_flags,
      patterns,
      updated_at
    } = body

    logger.debug('Platform state POST request', {
      operation: 'platform-state.post',
      userId: user_id
    })

    if (!user_id) {
      logger.warn('Missing user_id', { operation: 'platform-state.post' })
      return NextResponse.json(
        { error: 'Missing required field: user_id' },
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

    // Check if Supabase is configured before processing
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('placeholder')) {
      logger.warn('Supabase not configured - skipping platform state sync', {
        operation: 'platform-state.post',
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!serviceRoleKey
      })
      // Return success to prevent retry loops - data will be queued for later
      return NextResponse.json({
        success: true,
        message: 'Supabase not configured - sync skipped'
      })
    }

    const supabase = getSupabaseServerClient()

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {
      user_id,
      updated_at: updated_at || new Date().toISOString()
    }

    if (current_scene !== undefined) {
      updateData.current_scene = current_scene
    }

    if (global_flags !== undefined) {
      updateData.global_flags = global_flags
    }

    if (patterns !== undefined) {
      // Store patterns as JSONB
      updateData.patterns = patterns
    }

    // Upsert: update if user_id exists, otherwise insert
    const { data, error } = await supabase
      .from('platform_states')
      .upsert(updateData, {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (error) {
      logger.error('Supabase error', {
        operation: 'platform-state.post',
        errorCode: error.code,
        userId: user_id
      }, error instanceof Error ? error : undefined)
      return NextResponse.json(
        { error: 'Failed to upsert platform state' },
        { status: 500 }
      )
    }

    logger.debug('Platform state upserted', {
      operation: 'platform-state.post',
      userId: user_id
    })

    return NextResponse.json({
      success: true,
      state: data
    })
  } catch (error) {
    logger.error('Unexpected error in platform state POST', {
      operation: 'platform-state.post'
    }, error instanceof Error ? error : undefined)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

/**
 * GET /api/user/platform-state?userId=xxx
 * Retrieve platform state for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      logger.warn('Missing userId parameter', { operation: 'platform-state.get' })
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
      .from('platform_states')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      logger.error('Supabase error', {
        operation: 'platform-state.get',
        errorCode: error.code,
        userId
      }, error instanceof Error ? error : undefined)
      return NextResponse.json(
        { error: 'Failed to fetch platform state' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      state: data || null
    })
  } catch (error) {
    logger.error('Unexpected error in platform state GET', {
      operation: 'platform-state.get'
    }, error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
