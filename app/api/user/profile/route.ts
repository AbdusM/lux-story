/**
 * Player Profile API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles player profile initialization
 * Ensures player profile exists before any skill/pattern tracking
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { logger } from '@/lib/logger'

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
      logger.error('Supabase upsert error', {
        operation: 'profile.create',
        errorCode: error.code,
        userId: user_id
      })
      return NextResponse.json(
        { error: 'Failed to create/update player profile' },
        { status: 500 }
      )
    }

    logger.debug('Profile ensured', {
      operation: 'profile.create',
      userId: user_id,
      existed: !!data
    })

    return NextResponse.json({
      success: true,
      profile: data
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    logger.error('Profile API unexpected error', { operation: 'profile.create' }, error instanceof Error ? error : undefined)

    // If it's a missing env var error, return success but log warning
    if (errorMessage.includes('Missing Supabase environment variables')) {
      logger.warn('Missing Supabase config - operation skipped', { operation: 'profile.create' })
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

    logger.debug('Profile GET request', { operation: 'profile.get', userId })

    if (!userId) {
      logger.warn('Missing userId parameter', { operation: 'profile.get' })
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
        logger.debug('Profile not found', { operation: 'profile.get', userId })
        return NextResponse.json({
          success: true,
          profile: null
        })
      }

      logger.error('Supabase error', {
        operation: 'profile.get',
        errorCode: error.code,
        userId
      })
      return NextResponse.json(
        { error: 'Failed to fetch player profile' },
        { status: 500 }
      )
    }

    logger.debug('Retrieved profile', { operation: 'profile.get', userId })

    return NextResponse.json({
      success: true,
      profile: data
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    logger.error('Profile GET unexpected error', { operation: 'profile.get' }, error instanceof Error ? error : undefined)

    // If it's a missing env var error, return null profile gracefully
    if (errorMessage.includes('Missing Supabase environment variables')) {
      logger.warn('Missing Supabase config - returning null', { operation: 'profile.get' })
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
