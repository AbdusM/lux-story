/**
 * Career Explorations API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles POST for creating career exploration records
 * Converts user interaction data into career explorations
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { ensurePlayerProfile } from '@/lib/api/ensure-player-profile'
import {
  extractAndValidateUserIdFromQuery,
  validateUserIdFromBody,
  supabaseErrorResponse,
  handleApiError
} from '@/lib/api/api-utils'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_GET = 'career-explorations.get'
const OPERATION_POST = 'career-explorations.post'

// Rate limiter: 30 requests per minute per IP
const postLimiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
})

/**
 * POST /api/user/career-explorations
 * Create or update career exploration records
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request)
    try {
      await postLimiter.check(ip, 30)
    } catch {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body = await request.json()
    const { user_id, career_name, match_score, readiness_level, local_opportunities, education_paths } = body

    logger.debug('Career explorations POST request', { operation: OPERATION_POST, userId: user_id, careerName: career_name })

    // Validate required fields
    if (!career_name) {
      logger.warn('Missing career_name', { operation: OPERATION_POST })
      return NextResponse.json({ error: 'Missing career_name' }, { status: 400 })
    }

    const validation = validateUserIdFromBody(user_id, OPERATION_POST)
    if (!validation.valid) {
      return validation.response
    }

    // Ensure player profile exists BEFORE attempting to insert
    await ensurePlayerProfile(user_id, 'career-explorations')

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('career_explorations')
      .upsert({
        user_id,
        career_name,
        match_score: match_score || 0.5,
        readiness_level: readiness_level || 'exploratory',
        local_opportunities: local_opportunities || [],
        education_paths: education_paths || [],
        explored_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,career_name'
      })
      .select()

    if (error) {
      return supabaseErrorResponse(OPERATION_POST, error.code, 'Failed to save career exploration', user_id)
    }

    logger.debug('Career exploration upsert successful', { operation: OPERATION_POST, userId: user_id, careerName: career_name })

    return NextResponse.json({ success: true, careerExploration: data?.[0] })
  } catch (error) {
    return handleApiError(error, OPERATION_POST, 'POST')
  }
}

/**
 * GET /api/user/career-explorations?userId=X
 * Fetch career explorations for a user
 */
export async function GET(request: NextRequest) {
  try {
    const validation = extractAndValidateUserIdFromQuery(request, OPERATION_GET)
    if (!validation.valid) {
      return validation.response
    }
    const { userId } = validation

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('career_explorations')
      .select('*')
      .eq('user_id', userId)
      .order('match_score', { ascending: false })

    if (error) {
      return supabaseErrorResponse(OPERATION_GET, error.code, 'Failed to fetch career explorations', userId)
    }

    logger.debug('Retrieved career explorations', { operation: OPERATION_GET, userId, count: data?.length || 0 })

    return NextResponse.json({
      success: true,
      careerExplorations: data || []
    })
  } catch (error) {
    return handleApiError(error, OPERATION_GET, 'GET', 'careerExplorations')
  }
}
