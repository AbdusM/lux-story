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
  supabaseErrorResponse,
  handleApiError,
  checkSupabaseConfigured
} from '@/lib/api/api-utils'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { readJsonBody } from '@/lib/api/request-body'
import { ensureProvidedUserIdMatchesSession, requireUserSession } from '@/lib/api/user-session'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_GET = 'skill-summaries.get'
const OPERATION_POST = 'skill-summaries.post'

const MAX_BODY_BYTES = 32_768

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
  const session = requireUserSession(request)
  if (!session.ok) return session.response

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
      .from('skill_summaries')
      .select('*')
      .eq('user_id', session.userId)
      .order('last_demonstrated', { ascending: false })

    if (error) {
      return supabaseErrorResponse(OPERATION_GET, error.code, 'Failed to fetch skill summaries', session.userId)
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
      userId: session.userId,
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
    const session = requireUserSession(request)
    if (!session.ok) return session.response

    const parsed = await readJsonBody(request, { maxBytes: MAX_BODY_BYTES })
    if (!parsed.ok) return parsed.response
    const body = parsed.body as Record<string, unknown>
    const { user_id, skill_name, demonstration_count, latest_context, scenes_involved, last_demonstrated } = body

    logger.debug('Skill summaries POST request', { operation: OPERATION_POST, userId: session.userId, skillName: skill_name })

    // Validate required fields
    if (!skill_name) {
      logger.warn('Missing skill_name', { operation: OPERATION_POST })
      return NextResponse.json({ error: 'Missing skill_name' }, { status: 400 })
    }

    const mismatch = ensureProvidedUserIdMatchesSession({
      provided: user_id,
      sessionUserId: session.userId,
      fieldName: 'user_id',
    })
    if (mismatch) return mismatch

    // Validate context length (should be 100-150 words)
    if (typeof latest_context === 'string' && latest_context) {
      const wordCount = latest_context.split(/\s+/).length
      if (wordCount < 50 || wordCount > 200) {
        logger.warn('Context length warning', { operation: OPERATION_POST, skillName: skill_name, wordCount, expected: '100-150 words' })
      }
    }

    // Check if Supabase is configured before processing
    const skipResponse = checkSupabaseConfigured(OPERATION_POST)
    if (skipResponse) return skipResponse

    // Ensure player profile exists BEFORE attempting to insert skill summary
    await ensurePlayerProfile(session.userId, 'skill-summaries')

    const supabase = getSupabaseServerClient()

    const { error } = await supabase
      .from('skill_summaries')
      .upsert({
        user_id: session.userId,
        skill_name,
        demonstration_count: demonstration_count || 0,
        latest_context: latest_context || '',
        scenes_involved: scenes_involved || [],
        last_demonstrated: last_demonstrated || new Date().toISOString()
      }, {
        onConflict: 'user_id,skill_name'
      })

    if (error) {
      return supabaseErrorResponse(OPERATION_POST, error.code, 'Failed to save skill summary', session.userId)
    }

    logger.debug('Skill summary upsert successful', { operation: OPERATION_POST, userId: session.userId, skillName: skill_name })

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error, OPERATION_POST, 'POST')
  }
}
