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
  supabaseErrorResponse,
  handleApiError
} from '@/lib/api/api-utils'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { readJsonBody } from '@/lib/api/request-body'
import { ensureProvidedUserIdMatchesSession, requireUserSession } from '@/lib/api/user-session'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_GET = 'career-analytics.get'
const OPERATION_POST = 'career-analytics.post'

const MAX_BODY_BYTES = 16_384

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
  const session = requireUserSession(request)
  if (!session.ok) return session.response

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
    const { searchParams } = new URL(request.url)
    const requestedUserId = searchParams.get('userId')
    const mismatch = ensureProvidedUserIdMatchesSession({
      provided: requestedUserId,
      sessionUserId: session.userId,
      fieldName: 'userId',
    })
    if (mismatch) return mismatch

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('career_analytics')
      .select('*')
      .eq('user_id', session.userId)
      .single()

    if (error) {
      // If no data exists, return exists: false (not an error)
      if (error.code === 'PGRST116') {
        logger.debug('No data found for user', { operation: OPERATION_GET, userId: session.userId })
        return NextResponse.json({ exists: false })
      }
      return supabaseErrorResponse(OPERATION_GET, error.code, 'Failed to fetch career analytics', session.userId)
    }

    logger.debug('Retrieved career analytics', { operation: OPERATION_GET, userId: session.userId })

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
    const session = requireUserSession(request)
    if (!session.ok) return session.response

    const parsed = await readJsonBody(request, { maxBytes: MAX_BODY_BYTES })
    if (!parsed.ok) return parsed.response
    const body = parsed.body as Record<string, unknown>
    const { user_id, platforms_explored, career_interests, choices_made, time_spent_seconds, sections_viewed, birmingham_opportunities } = body

    logger.debug('Career analytics POST request', { operation: OPERATION_POST, userId: session.userId })

    const mismatch = ensureProvidedUserIdMatchesSession({
      provided: user_id,
      sessionUserId: session.userId,
      fieldName: 'user_id',
    })
    if (mismatch) return mismatch

    const supabase = getSupabaseServerClient()

    const { error } = await supabase
      .from('career_analytics')
      .upsert({
        user_id: session.userId,
        platforms_explored: platforms_explored || [],
        career_interests: career_interests || [],
        choices_made: choices_made || 0,
        time_spent_seconds: time_spent_seconds || 0,
        sections_viewed: sections_viewed || [],
        birmingham_opportunities: birmingham_opportunities || [],
        last_updated: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (error) {
      return supabaseErrorResponse(OPERATION_POST, error.code, 'Failed to save career analytics', session.userId)
    }

    logger.debug('Career analytics upsert successful', { operation: OPERATION_POST, userId: session.userId })

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error, OPERATION_POST, 'POST')
  }
}
