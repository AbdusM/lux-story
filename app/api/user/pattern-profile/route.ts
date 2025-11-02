/**
 * Pattern Profile API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Retrieves comprehensive pattern profile for a user
 * Provides decision style, pattern breakdown, diversity score, and correlations
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPatternProfile, getPatternSummaryQuick } from '@/lib/pattern-profile-adapter'

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

    console.log('🔵 [API:PatternProfile] GET request:', {
      userId,
      mode
    })

    if (!userId) {
      console.error('❌ [API:PatternProfile] Missing userId parameter')
      return NextResponse.json(
        { error: 'Missing required parameter: userId' },
        { status: 400 }
      )
    }

    // Quick mode for lightweight requests
    if (mode === 'quick') {
      const summary = await getPatternSummaryQuick(userId)

      console.log('✅ [API:PatternProfile] Quick summary retrieved:', {
        userId,
        totalDemonstrations: summary.totalDemonstrations,
        decisionStyle: summary.decisionStyle
      })

      return NextResponse.json({
        success: true,
        mode: 'quick',
        summary
      })
    }

    // Full mode - comprehensive profile
    const profile = await getPatternProfile(userId)

    console.log('✅ [API:PatternProfile] Full profile retrieved:', {
      userId,
      totalDemonstrations: profile.totalDemonstrations,
      summariesCount: profile.summaries.length,
      hasDecisionStyle: !!profile.decisionStyle,
      diversityScore: profile.diversityScore.score
    })

    return NextResponse.json({
      success: true,
      mode: 'full',
      profile
    })
  } catch (error: any) {
    console.error('[PatternProfile API] Unexpected error:', error)
    const errorMessage = error?.message || 'Internal server error'

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
