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
import { readJsonBody } from '@/lib/api/request-body'
import {
  supabaseErrorResponse,
  handleApiError
} from '@/lib/api/api-utils'
import { ensureProvidedUserIdMatchesSession, requireUserSession } from '@/lib/api/user-session'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_GET = 'career-explorations.get'
const OPERATION_POST = 'career-explorations.post'

const MAX_BODY_BYTES = 16_384

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
    const session = requireUserSession(request)
    if (!session.ok) return session.response

    // Rate limiting
    const ip = getClientIp(request)
    try {
      await postLimiter.check(ip, 30)
    } catch {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const parsed = await readJsonBody(request, { maxBytes: MAX_BODY_BYTES })
    if (!parsed.ok) return parsed.response
    const body = parsed.body as Record<string, unknown>
    const { user_id, career_name, match_score, readiness_level, local_opportunities, education_paths } = body

    logger.debug('Career explorations POST request', { operation: OPERATION_POST, userId: session.userId, careerName: career_name })

    // Validate required fields
    if (!career_name) {
      logger.warn('Missing career_name', { operation: OPERATION_POST })
      return NextResponse.json({ error: 'Missing career_name' }, { status: 400 })
    }

    const mismatch = ensureProvidedUserIdMatchesSession({
      provided: user_id,
      sessionUserId: session.userId,
      fieldName: 'user_id',
    })
    if (mismatch) return mismatch

    // Ensure player profile exists BEFORE attempting to insert
    await ensurePlayerProfile(session.userId, 'career-explorations')

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('career_explorations')
      .upsert({
        user_id: session.userId,
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
      return supabaseErrorResponse(OPERATION_POST, error.code, 'Failed to save career exploration', session.userId)
    }

    logger.debug('Career exploration upsert successful', { operation: OPERATION_POST, userId: session.userId, careerName: career_name })

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
    const session = requireUserSession(request)
    if (!session.ok) return session.response

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
      .from('career_explorations')
      .select('*')
      .eq('user_id', session.userId)
      .order('match_score', { ascending: false })

    if (error) {
      return supabaseErrorResponse(OPERATION_GET, error.code, 'Failed to fetch career explorations', session.userId)
    }

    logger.debug('Retrieved career explorations', { operation: OPERATION_GET, userId: session.userId, count: data?.length || 0 })

    return NextResponse.json({
      success: true,
      careerExplorations: data || []
    })
  } catch (error) {
    return handleApiError(error, OPERATION_GET, 'GET', 'careerExplorations')
  }
}
