/**
 * Admin Check Profile API Endpoint
 * Diagnostic endpoint to verify if a profile exists and when it was created
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth, getAdminSupabaseClient } from '@/lib/admin-supabase-client'
import { logger } from '@/lib/logger'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Rate limiter: 10 requests per minute
const checkProfileLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

/**
 * GET /api/admin/check-profile?userId=XXX
 * Check if a profile exists for a given user
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request)
  if (authError) return authError

  // Rate limiting: 10 requests per minute
  const ip = getClientIp(request)
  try {
    await checkProfileLimiter.check(ip, 10)
  } catch {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter required' },
        { status: 400 }
      )
    }

    const supabase = getAdminSupabaseClient()

    // Check if profile exists
    const { data: profile, error } = await supabase
      .from('player_profiles')
      .select('user_id, created_at, updated_at, last_activity, total_demonstrations, current_scene')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      logger.error('Supabase error checking profile', { operation: 'admin.check-profile', userId, code: error.code })
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      )
    }

    if (!profile) {
      return NextResponse.json({
        exists: false,
        userId,
        message: 'Profile does not exist in database'
      })
    }

    return NextResponse.json({
      exists: true,
      userId,
      profile: {
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        last_activity: profile.last_activity,
        total_demonstrations: profile.total_demonstrations,
        current_scene: profile.current_scene
      },
      age_seconds: Math.floor((Date.now() - new Date(profile.created_at).getTime()) / 1000)
    })
  } catch (error) {
    logger.error('Unexpected error in check-profile endpoint', { operation: 'admin.check-profile' }, error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: 'Internal error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
