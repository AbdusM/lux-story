/**
 * Player Profile API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles player profile initialization
 * Ensures player profile exists before any skill/pattern tracking
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/user/profile
 * Create or ensure player profile exists
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, created_at } = body

    // Simple validation - this is an internal API
    if (!user_id) {
      return NextResponse.json(
        { error: 'Missing user_id' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServerClient()

    // Use upsert to create profile if it doesn't exist, or do nothing if it does
    const { data, error } = await supabase
      .from('player_profiles')
      .upsert({
        user_id,
        created_at: created_at || new Date().toISOString()
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false // Return existing record if already exists
      })
      .select()
      .single()

    if (error) {
      console.error('❌ [API:Profile] Supabase upsert error:', {
        code: error.code,
        message: error instanceof Error ? error.message : "Unknown error",
        userId: user_id
      })
      return NextResponse.json(
        { error: 'Failed to create/update player profile' },
        { status: 500 }
      )
    }

    console.log('✅ [API:Profile] Profile ensured:', {
      userId: user_id,
      existed: !!data
    })

    return NextResponse.json({
      success: true,
      profile: data
    })
  } catch (error) {
    console.error('[Profile API] Unexpected error:', error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"

    // If it's a missing env var error, return success but log warning
    if (errorMessage.includes('Missing Supabase environment variables')) {
      console.warn('⚠️ [Profile API] Missing Supabase config - operation skipped')
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

/**
 * GET /api/user/profile?userId=X
 * Fetch player profile
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    console.log('🔵 [API:Profile] GET request:', { userId })

    if (!userId) {
      console.error('❌ [API:Profile] Missing userId parameter')
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('player_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      // If profile doesn't exist, return null (not an error)
      if (error.code === 'PGRST116') {
        console.log('ℹ️ [API:Profile] Profile not found:', { userId })
        return NextResponse.json({
          success: true,
          profile: null
        })
      }

      console.error('❌ [API:Profile] Supabase error:', {
        code: error.code,
        message: error instanceof Error ? error.message : "Unknown error",
        userId
      })
      return NextResponse.json(
        { error: 'Failed to fetch player profile' },
        { status: 500 }
      )
    }

    console.log('✅ [API:Profile] Retrieved profile:', { userId })

    return NextResponse.json({
      success: true,
      profile: data
    })
  } catch (error) {
    console.error('[Profile API] Unexpected error:', error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"

    // If it's a missing env var error, return null profile gracefully
    if (errorMessage.includes('Missing Supabase environment variables')) {
      console.warn('⚠️ [Profile API] Missing Supabase config - returning null')
      return NextResponse.json({
        success: true,
        profile: null
      })
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
