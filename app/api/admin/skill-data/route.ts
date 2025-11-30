/**
 * Admin Skill Data API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Server-side endpoint for admin dashboard to fetch skill data
 * Uses service role key to bypass RLS policies
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth, getAdminSupabaseClient } from '@/lib/admin-supabase-client'
import { auditLog } from '@/lib/audit-logger'
import { logger } from '@/lib/logger'

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

    logger.debug('GET request', { operation: 'admin.skill-data', userId: userId || undefined })

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
      .abortSignal(AbortSignal.timeout(10000))
      .single()

    // Also fetch career explorations separately to ensure we get all data
    const { data: careerExplorations, error: careerError } = await supabase
      .from('career_explorations')
      .select('*')
      .eq('user_id', userId)
      .order('match_score', { ascending: false })
      .abortSignal(AbortSignal.timeout(10000))

    if (careerError) {
      console.warn('❌ [Admin Skill Data API] Career explorations error:', careerError)
    } else if (careerExplorations && careerExplorations.length > 0) {
      logger.debug('Found career explorations', { operation: 'admin.skill-data.career-explorations', userId, count: careerExplorations.length })
      // Merge career explorations into profile
      if (profile) {
        profile.career_explorations = careerExplorations
      }
    }

    if (error) {
      console.error('❌ [Admin:SkillData] Supabase error:', {
        code: error.code,
        message: error instanceof Error ? error.message : "Unknown error",
        userId
      })
      return NextResponse.json(
        { error: 'Failed to fetch skill data' },
        { status: 500 }
      )
    }

    if (!profile) {
      logger.warn('No profile found for user', { operation: 'admin.skill-data.not-found', userId })
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    logger.debug('Retrieved profile', {
      operation: 'admin.skill-data.success',
      userId,
      skillSummaries: profile.skill_summaries?.length || 0,
      skillDemonstrations: profile.skill_demonstrations?.length || 0,
      careerExplorations: profile.career_explorations?.length || 0
    })

    // Audit log: Admin accessed student skill data
    auditLog('view_skill_data', 'admin', userId)

    return NextResponse.json({
      success: true,
      profile
    })
  } catch (error) {
    // Log detailed error server-side
    console.error('[Admin:SkillData] Unexpected error:', error)

    // Return generic error to client
    return NextResponse.json(
      { error: 'An error occurred fetching skill data' },
      { status: 500 }
    )
  }
}
