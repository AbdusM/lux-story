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
import { rateLimit, getClientIp } from '@/lib/rate-limit'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Rate limiter: 10 requests per minute
const skillDataLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

/**
 * GET /api/admin/skill-data?userId=X
 * Fetch complete skill profile for admin dashboard
 */
export async function GET(request: NextRequest) {
  // Authentication check - verify admin cookie
  const authError = await requireAdminAuth(request)
  if (authError) return authError

  // Rate limiting: 10 requests per minute
  const ip = getClientIp(request)
  try {
    await skillDataLimiter.check(ip, 10)
  } catch {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    logger.debug('GET request', { operation: 'admin.skill-data', userId: userId || undefined })

    if (!userId) {
      logger.warn('Missing userId parameter', { operation: 'admin.skill-data' })
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
      logger.warn('Career explorations query error', { operation: 'admin.skill-data.career', userId, code: careerError.code })
    } else if (careerExplorations && careerExplorations.length > 0) {
      logger.debug('Found career explorations', { operation: 'admin.skill-data.career-explorations', userId, count: careerExplorations.length })
      // Merge career explorations into profile
      if (profile) {
        profile.career_explorations = careerExplorations
      }
    }

    if (error) {
      logger.error('Supabase error fetching skill data', { operation: 'admin.skill-data', userId, code: error.code })
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
    logger.error('Unexpected error in skill data endpoint', { operation: 'admin.skill-data' }, error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: 'An error occurred fetching skill data' },
      { status: 500 }
    )
  }
}
