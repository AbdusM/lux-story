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
import { validateUserId } from '@/lib/user-id-validation'
import { logger } from '@/lib/logger'
import { ensurePlayerProfile } from '@/lib/api/ensure-player-profile'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Rate limiter: 30 requests per minute per IP
const postLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

/**
 * POST /api/user/career-explorations
 * Create or update career exploration records
 *
 * Body: {
 *   user_id: string,
 *   career_name: string,
 *   match_score: number,
 *   readiness_level: string,
 *   local_opportunities: string[],
 *   education_paths: string[],
 *   evidence: {
 *     skill_demonstrations: string[],
 *     character_interactions: string[],
 *     scene_choices: string[],
 *     time_invested: number
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request)
    try {
      await postLimiter.check(ip, 30) // 30 requests per minute
    } catch {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    const {
      user_id,
      career_name,
      match_score,
      readiness_level,
      local_opportunities,
      education_paths
    } = body

    logger.debug('Career explorations POST request', {
      operation: 'career-explorations.post',
      userId: user_id,
      careerName: career_name
    })

    if (!user_id || !career_name) {
      logger.warn('Missing required fields', { operation: 'career-explorations.post' })
      return NextResponse.json(
        { error: 'Missing user_id or career_name' },
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

    // Ensure player profile exists BEFORE attempting to insert career exploration
    // This prevents foreign key violations (error 23503)
    await ensurePlayerProfile(user_id, 'career-explorations')

    const supabase = getSupabaseServerClient()

    // Upsert career exploration record
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
      logger.error('Supabase upsert error', {
        operation: 'career-explorations.post',
        errorCode: error.code,
        userId: user_id,
        careerName: career_name
      }, error instanceof Error ? error : undefined)
      return NextResponse.json(
        { error: 'Failed to save career exploration' },
        { status: 500 }
      )
    }

    logger.debug('Career exploration upsert successful', {
      operation: 'career-explorations.post',
      userId: user_id,
      careerName: career_name
    })

    return NextResponse.json({ 
      success: true, 
      careerExploration: data?.[0] 
    })
  } catch (error) {
    logger.error('Unexpected error in career explorations POST', {
      operation: 'career-explorations.post'
    }, error instanceof Error ? error : undefined)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    
    // If it's a missing env var error, return success but log warning
    if (errorMessage.includes('Missing Supabase environment variables')) {
      logger.warn('Missing Supabase config - operation skipped', {
        operation: 'career-explorations.post'
      })
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

/**
 * GET /api/user/career-explorations?userId=X
 * Fetch career explorations for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    logger.debug('Career explorations GET request', { operation: 'career-explorations.get', userId: userId ?? undefined })

    if (!userId) {
      logger.warn('Missing userId parameter', { operation: 'career-explorations.get' })
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
      .from('career_explorations')
      .select('*')
      .eq('user_id', userId)
      .order('match_score', { ascending: false })

    if (error) {
      logger.error('Supabase error', {
        operation: 'career-explorations.get',
        errorCode: error.code,
        userId
      }, error instanceof Error ? error : undefined)
      return NextResponse.json(
        { error: 'Failed to fetch career explorations' },
        { status: 500 }
      )
    }

    logger.debug('Retrieved career explorations', {
      operation: 'career-explorations.get',
      userId,
      count: data?.length || 0
    })

    return NextResponse.json({
      success: true,
      careerExplorations: data || []
    })
  } catch (error) {
    logger.error('Unexpected error in career explorations GET', {
      operation: 'career-explorations.get'
    }, error instanceof Error ? error : undefined)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    
    // If it's a missing env var error, return empty data gracefully
    if (errorMessage.includes('Missing Supabase environment variables')) {
      logger.warn('Missing Supabase config - returning empty data', {
        operation: 'career-explorations.get'
      })
      return NextResponse.json({
        success: true,
        careerExplorations: []
      })
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
