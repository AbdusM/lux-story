/**
 * Pattern Profile API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Retrieves comprehensive pattern profile for a user
 * Provides decision style, pattern breakdown, diversity score, and correlations
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPatternProfile, getPatternSummaryQuick } from '@/lib/pattern-profile-adapter'
import { validateUserId } from '@/lib/user-id-validation'
import { logger } from '@/lib/logger'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/user/pattern-profile?userId=xxx
 * Retrieve pattern profile for a user
 *
 * Query params:
 * - userId: string (required)
 * - mode: 'full' | 'quick' (optional, default: 'full')
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const mode = searchParams.get('mode') || 'full'

    logger.debug('Pattern profile GET request', {
      operation: 'pattern-profile.get',
      userId: userId ?? undefined,
      mode
    })

    if (!userId) {
      logger.warn('Missing userId parameter', { operation: 'pattern-profile.get' })
      return NextResponse.json(
        { error: 'Missing required parameter: userId' },
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

    // Quick mode for lightweight requests
    if (mode === 'quick') {
      const summary = await getPatternSummaryQuick(userId)

      logger.debug('Quick summary retrieved', {
        operation: 'pattern-profile.get',
        userId,
        totalDemonstrations: summary.totalDemonstrations
      })

      return NextResponse.json({
        success: true,
        mode: 'quick',
        summary
      })
    }

    // Full mode - comprehensive profile
    const profile = await getPatternProfile(userId)

    logger.debug('Full profile retrieved', {
      operation: 'pattern-profile.get',
      userId,
      totalDemonstrations: profile.totalDemonstrations
    })

    return NextResponse.json({
      success: true,
      mode: 'full',
      profile
    })
  } catch (error) {
    logger.error('Unexpected error in pattern profile GET', {
      operation: 'pattern-profile.get'
    }, error instanceof Error ? error : undefined)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"

    // Handle Supabase connection errors gracefully
    if (errorMessage.includes('Missing Supabase environment variables')) {
      return NextResponse.json(
        {
          error: 'Database not configured',
          profile: null
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
