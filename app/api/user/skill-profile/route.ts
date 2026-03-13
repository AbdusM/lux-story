/**
 * User Skill Profile API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Returns the dashboard-shaped skill profile for the authenticated player.
 */

import { NextRequest, NextResponse } from 'next/server'

import { handleApiError, supabaseErrorResponse } from '@/lib/api/api-utils'
import { ensureProvidedUserIdMatchesSession, requireUserSession } from '@/lib/api/user-session'
import { convertSupabaseProfileToDashboard } from '@/lib/skill-profile-adapter'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_GET = 'user.skill-profile.get'
const readLimiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 500 })

export async function GET(request: NextRequest) {
  try {
    const session = requireUserSession(request)
    if (!session.ok) return session.response

    const ip = getClientIp(request)
    try {
      await readLimiter.check(ip, 30)
    } catch {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const requestedUserId = request.nextUrl.searchParams.get('userId')
    const mismatch = ensureProvidedUserIdMatchesSession({
      provided: requestedUserId,
      sessionUserId: session.userId,
      fieldName: 'userId',
    })
    if (mismatch) return mismatch

    const supabase = getSupabaseServerClient()
    const { data: profile, error } = await supabase
      .from('player_profiles')
      .select(`
        *,
        skill_demonstrations(*),
        skill_summaries(*),
        career_explorations(*),
        relationship_progress(*)
      `)
      .eq('user_id', session.userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        logger.debug('Skill profile not found', { operation: OPERATION_GET, userId: session.userId })
        return NextResponse.json({
          success: true,
          profile: null,
        })
      }

      return supabaseErrorResponse(
        OPERATION_GET,
        error.code,
        'Failed to fetch skill profile',
        session.userId,
      )
    }

    return NextResponse.json({
      success: true,
      profile: convertSupabaseProfileToDashboard((profile ?? {}) as Record<string, unknown>),
    })
  } catch (error) {
    return handleApiError(error, OPERATION_GET, 'GET')
  }
}
