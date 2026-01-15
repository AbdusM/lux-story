/**
 * Career Analytics API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles GET/POST for persistent career analytics data
 * Supabase-primary architecture: Database is source of truth
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { logger } from '@/lib/logger'
import {
  extractAndValidateUserIdFromQuery,
  validateUserIdFromBody,
  supabaseErrorResponse,
  handleApiError
} from '@/lib/api/api-utils'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_GET = 'career-analytics.get'
const OPERATION_POST = 'career-analytics.post'

// Rate limiter: 30 requests per minute
const careerAnalyticsLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

/**
 * GET /api/user/career-analytics?userId=X
 * Fetch career analytics for a user
 */
export async function GET(request: NextRequest) {
  // Rate limiting: 30 requests per minute
  const ip = getClientIp(request)
  try {
    await careerAnalyticsLimiter.check(ip, 30)
  } catch {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    const validation = extractAndValidateUserIdFromQuery(request, OPERATION_GET)
    if (!validation.valid) {
      return validation.response
    }
    const { userId } = validation

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('career_analytics')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      // If no data exists, return exists: false (not an error)
      if (error.code === 'PGRST116') {
        logger.debug('No data found for user', { operation: OPERATION_GET, userId })
        return NextResponse.json({ exists: false })
      }
      return supabaseErrorResponse(OPERATION_GET, error.code, 'Failed to fetch career analytics', userId)
    }

    logger.debug('Retrieved career analytics', { operation: OPERATION_GET, userId })

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
    return handleApiError(error, OPERATION_GET, 'GET')
  }
}

/**
 * POST /api/user/career-analytics
 * Upsert career analytics data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, platforms_explored, career_interests, choices_made, time_spent_seconds, sections_viewed, birmingham_opportunities } = body

    logger.debug('Career analytics POST request', { operation: OPERATION_POST, userId: user_id })

    const validation = validateUserIdFromBody(user_id, OPERATION_POST)
    if (!validation.valid) {
      return validation.response
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
      }, { onConflict: 'user_id' })

    if (error) {
      return supabaseErrorResponse(OPERATION_POST, error.code, 'Failed to save career analytics', user_id)
    }

    logger.debug('Career analytics upsert successful', { operation: OPERATION_POST, userId: user_id })

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error, OPERATION_POST, 'POST')
  }
}
