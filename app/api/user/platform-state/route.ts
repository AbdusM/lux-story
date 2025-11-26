/**
 * Platform State API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles global game state synchronization
 * Tracks current scene, global flags, and behavioral patterns
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'

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

    console.log('🔵 [API:PlatformState] POST request:', {
      userId: user_id,
      currentScene: current_scene,
      flagCount: global_flags?.length || 0,
      hasPatterns: !!patterns
    })

    if (!user_id) {
      console.error('❌ [API:PlatformState] Missing user_id')
      return NextResponse.json(
        { error: 'Missing required field: user_id' },
        { status: 400 }
      )
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
      console.error('❌ [API:PlatformState] Supabase error:', {
        code: error.code,
        message: error instanceof Error ? error.message : "Unknown error",
        userId: user_id
      })
      return NextResponse.json(
        { error: 'Failed to upsert platform state' },
        { status: 500 }
      )
    }

    console.log('✅ [API:PlatformState] Upserted:', {
      userId: user_id,
      currentScene: current_scene,
      flagCount: global_flags?.length || 0
    })

    return NextResponse.json({
      success: true,
      state: data
    })
  } catch (error) {
    console.error('[PlatformState API] Unexpected error:', error)
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
      return NextResponse.json(
        { error: 'Missing userId parameter' },
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
      console.error('❌ [API:PlatformState] Supabase error:', error)
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
    console.error('[PlatformState API] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
