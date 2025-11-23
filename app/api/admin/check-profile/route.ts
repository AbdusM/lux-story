/**
 * Admin Check Profile API Endpoint
 * Diagnostic endpoint to verify if a profile exists and when it was created
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth, getAdminSupabaseClient } from '@/lib/admin-supabase-client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/admin/check-profile?userId=XXX
 * Check if a profile exists for a given user
 */
export async function GET(request: NextRequest) {
  const authError = requireAdminAuth(request)
  if (authError) return authError

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
      console.error('❌ [Admin:CheckProfile] Supabase error:', error)
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
    console.error('[Admin:CheckProfile] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
