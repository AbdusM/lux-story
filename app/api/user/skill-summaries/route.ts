/**
 * Skill Summaries API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles GET/POST for persistent skill summary data with rich contexts
 * Supabase-primary architecture: Database is source of truth
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { logger } from '@/lib/logger'
import { ensurePlayerProfile } from '@/lib/api/ensure-player-profile'
import {
  extractAndValidateUserIdFromQuery,
  validateUserIdFromBody,
  supabaseErrorResponse,
  handleApiError,
  checkSupabaseConfigured
} from '@/lib/api/api-utils'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_GET = 'skill-summaries.get'
const OPERATION_POST = 'skill-summaries.post'

// Rate limiter: 30 requests per minute
const skillSummariesLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

/**
 * GET /api/user/skill-summaries?userId=X
 * Fetch all skill summaries for a user
 */
export async function GET(request: NextRequest) {
  // Rate limiting: 30 requests per minute
  const ip = getClientIp(request)
  try {
    await skillSummariesLimiter.check(ip, 30)
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
      .from('skill_summaries')
      .select('*')
      .eq('user_id', userId)
      .order('last_demonstrated', { ascending: false })

    if (error) {
      return supabaseErrorResponse(OPERATION_GET, error.code, 'Failed to fetch skill summaries', userId)
    }

    // Transform database format to application format
    const summaries = (data || []).map(row => ({
      skillName: row.skill_name,
      demonstrationCount: row.demonstration_count,
      latestContext: row.latest_context,
      scenesInvolved: row.scenes_involved || [],
      lastDemonstrated: row.last_demonstrated
    }))

    logger.debug('Retrieved skill summaries', {
      operation: OPERATION_GET,
      userId,
      count: summaries.length
    })

    return NextResponse.json({
      success: true,
      summaries
    })
  } catch (error) {
    return handleApiError(error, OPERATION_GET, 'GET', 'summaries')
  }
}

/**
 * POST /api/user/skill-summaries
 * Upsert skill summary data
 *
 * Body: {
 *   user_id: string,
 *   skill_name: string,
 *   demonstration_count: number,
 *   latest_context: string (100-150 words),
 *   scenes_involved: string[],
 *   last_demonstrated: ISO date string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, skill_name, demonstration_count, latest_context, scenes_involved, last_demonstrated } = body

    logger.debug('Skill summaries POST request', { operation: OPERATION_POST, userId: user_id, skillName: skill_name })

    // Validate required fields
    if (!skill_name) {
      logger.warn('Missing skill_name', { operation: OPERATION_POST })
      return NextResponse.json({ error: 'Missing skill_name' }, { status: 400 })
    }

    const validation = validateUserIdFromBody(user_id, OPERATION_POST)
    if (!validation.valid) {
      return validation.response
    }

    // Validate context length (should be 100-150 words)
    if (latest_context) {
      const wordCount = latest_context.split(/\s+/).length
      if (wordCount < 50 || wordCount > 200) {
        logger.warn('Context length warning', { operation: OPERATION_POST, skillName: skill_name, wordCount, expected: '100-150 words' })
      }
    }

    // Check if Supabase is configured before processing
    const skipResponse = checkSupabaseConfigured(OPERATION_POST)
    if (skipResponse) return skipResponse

    // Ensure player profile exists BEFORE attempting to insert skill summary
    await ensurePlayerProfile(user_id, 'skill-summaries')

    const supabase = getSupabaseServerClient()

    const { error } = await supabase
      .from('skill_summaries')
      .upsert({
        user_id,
        skill_name,
        demonstration_count: demonstration_count || 0,
        latest_context: latest_context || '',
        scenes_involved: scenes_involved || [],
        last_demonstrated: last_demonstrated || new Date().toISOString()
      }, {
        onConflict: 'user_id,skill_name'
      })

    if (error) {
      return supabaseErrorResponse(OPERATION_POST, error.code, 'Failed to save skill summary', user_id)
    }

    logger.debug('Skill summary upsert successful', { operation: OPERATION_POST, userId: user_id, skillName: skill_name })

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error, OPERATION_POST, 'POST')
  }
}
