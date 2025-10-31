/**
 * Admin Skill Data API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Server-side endpoint for admin dashboard to fetch skill data
 * Uses service role key to bypass RLS policies
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth, getAdminSupabaseClient } from '@/lib/admin-supabase-client'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/admin/skill-data?userId=X
 * Fetch complete skill profile for admin dashboard
 */
export async function GET(request: NextRequest) {
  // Authentication check - verify admin cookie
  const authError = requireAdminAuth(request)
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    console.log('🔵 [Admin:SkillData] GET request:', { userId })

    if (!userId) {
      console.error('❌ [Admin:SkillData] Missing userId parameter')
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }

    const supabase = getAdminSupabaseClient()

    // Fetch complete user profile with all related data
    const { data: profile, error } = await supabase
      .from('player_profiles')
      .select(`
        *,
        skill_demonstrations(*),
        skill_summaries(*),
        career_explorations(*),
        relationship_progress(*)
      `)
      .eq('user_id', userId)
      .single()

    // Also fetch career explorations separately to ensure we get all data
    const { data: careerExplorations, error: careerError } = await supabase
      .from('career_explorations')
      .select('*')
      .eq('user_id', userId)
      .order('match_score', { ascending: false })

    if (careerError) {
      console.warn('❌ [Admin Skill Data API] Career explorations error:', careerError)
    } else if (careerExplorations && careerExplorations.length > 0) {
      console.log(`✅ [Admin Skill Data API] Found ${careerExplorations.length} career explorations for ${userId}`)
      // Merge career explorations into profile
      if (profile) {
        profile.career_explorations = careerExplorations
      }
    }

    if (error) {
      console.error('❌ [Admin:SkillData] Supabase error:', {
        code: error.code,
        message: error.message,
        userId
      })
      return NextResponse.json(
        { error: 'Failed to fetch skill data' },
        { status: 500 }
      )
    }

    if (!profile) {
      console.log('⚠️ [Admin:SkillData] No profile found for user:', userId)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('✅ [Admin:SkillData] Retrieved profile:', {
      userId,
      skillSummaries: profile.skill_summaries?.length || 0,
      skillDemonstrations: profile.skill_demonstrations?.length || 0,
      careerExplorations: profile.career_explorations?.length || 0
    })

    return NextResponse.json({
      success: true,
      profile
    })
  } catch (error: any) {
    // Log detailed error server-side
    console.error('[Admin:SkillData] Unexpected error:', error)

    // Return generic error to client
    return NextResponse.json(
      { error: 'An error occurred fetching skill data' },
      { status: 500 }
    )
  }
}
