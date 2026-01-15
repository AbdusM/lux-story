/**
 * Pattern Profile API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Retrieves comprehensive pattern profile for a user
 * Provides decision style, pattern breakdown, diversity score, and correlations
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPatternProfile, getPatternSummaryQuick } from '@/lib/pattern-profile-adapter'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import {
  extractAndValidateUserIdFromQuery,
  isSupabaseConfigError
} from '@/lib/api/api-utils'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_GET = 'pattern-profile.get'

// Rate limiter: 60 reads per minute
const readLimiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 500 })

/**
 * GET /api/user/pattern-profile?userId=xxx&mode=full|quick
 * Retrieve pattern profile for a user
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request)
    try {
      await readLimiter.check(ip, 60)
    } catch {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('mode') || 'full'

    const validation = extractAndValidateUserIdFromQuery(request, OPERATION_GET)
    if (!validation.valid) {
      return validation.response
    }
    const { userId } = validation

    logger.debug('Pattern profile GET request', { operation: OPERATION_GET, userId, mode })

    // Quick mode for lightweight requests
    if (mode === 'quick') {
      const summary = await getPatternSummaryQuick(userId)
      logger.debug('Quick summary retrieved', { operation: OPERATION_GET, userId, totalDemonstrations: summary.totalDemonstrations })
      return NextResponse.json({ success: true, mode: 'quick', summary })
    }

    // Full mode - comprehensive profile
    const profile = await getPatternProfile(userId)
    logger.debug('Full profile retrieved', { operation: OPERATION_GET, userId, totalDemonstrations: profile.totalDemonstrations })

    return NextResponse.json({ success: true, mode: 'full', profile })
  } catch (error) {
    logger.error('Unexpected error in pattern profile GET', { operation: OPERATION_GET }, error instanceof Error ? error : undefined)

    if (isSupabaseConfigError(error)) {
      return NextResponse.json({ error: 'Database not configured', profile: null }, { status: 503 })
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 })
  }
}
