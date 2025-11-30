/**
 * Career Analytics API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles GET/POST for persistent career analytics data
 * Supabase-primary architecture: Database is source of truth
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { validateUserId } from '@/lib/user-id-validation'
import { logger } from '@/lib/logger'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/user/career-analytics?userId=X
 * Fetch career analytics for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    logger.debug('Career analytics GET request', { operation: 'career-analytics.get', userId: userId ?? undefined })

    if (!userId) {
      logger.warn('Missing userId parameter', { operation: 'career-analytics.get' })
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
      .from('career_analytics')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      // If no data exists, return exists: false (not an error)
      if (error.code === 'PGRST116') {
        logger.debug('No data found for user', { operation: 'career-analytics.get', userId })
        return NextResponse.json({ exists: false })
      }

      logger.error('Supabase error', {
        operation: 'career-analytics.get',
        errorCode: error.code,
        userId
      }, error instanceof Error ? error : undefined)
      return NextResponse.json(
        { error: 'Failed to fetch career analytics' },
        { status: 500 }
      )
    }

    logger.debug('Retrieved career analytics', {
      operation: 'career-analytics.get',
      userId
    })

    // Transform database format to application format
    return NextResponse.json({
      exists: true,
      analytics: {
        platformsExplored: data.platforms_explored || [],
        careerInterests: data.career_interests || [],
        choicesMade: data.choices_made || 0,
        timeSpent: data.time_spent_seconds || 0,
        sectionsViewed: data.sections_viewed || [],
        birminghamOpportunities: data.birmingham_opportunities || [],
        lastUpdated: data.last_updated
      }
    })
  } catch (error) {
    logger.error('Unexpected error in career analytics GET', {
      operation: 'career-analytics.get'
    }, error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/user/career-analytics
 * Upsert career analytics data
 *
 * Body: {
 *   user_id: string,
 *   platforms_explored: string[],
 *   career_interests: string[],
 *   choices_made: number,
 *   time_spent_seconds: number,
 *   sections_viewed: string[],
 *   birmingham_opportunities: string[]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      user_id,
      platforms_explored,
      career_interests,
      choices_made,
      time_spent_seconds,
      sections_viewed,
      birmingham_opportunities
    } = body

    logger.debug('Career analytics POST request', {
      operation: 'career-analytics.post',
      userId: user_id
    })

    if (!user_id) {
      logger.warn('Missing user_id', { operation: 'career-analytics.post' })
      return NextResponse.json(
        { error: 'Missing user_id' },
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

    const { error } = await supabase
      .from('career_analytics')
      .upsert({
        user_id,
        platforms_explored: platforms_explored || [],
        career_interests: career_interests || [],
        choices_made: choices_made || 0,
        time_spent_seconds: time_spent_seconds || 0,
        sections_viewed: sections_viewed || [],
        birmingham_opportunities: birmingham_opportunities || [],
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (error) {
      logger.error('Supabase upsert error', {
        operation: 'career-analytics.post',
        errorCode: error.code,
        userId: user_id
      }, error instanceof Error ? error : undefined)
      return NextResponse.json(
        { error: 'Failed to save career analytics' },
        { status: 500 }
      )
    }

    logger.debug('Career analytics upsert successful', {
      operation: 'career-analytics.post',
      userId: user_id
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Unexpected error in career analytics POST', {
      operation: 'career-analytics.post'
    }, error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
