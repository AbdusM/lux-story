/**
 * Admin User IDs API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Server-side endpoint for admin dashboard to fetch all user IDs
 * Uses service role key to bypass RLS policies
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth, getAdminSupabaseClient } from '@/lib/admin-supabase-client'
import { auditLog } from '@/lib/audit-logger'
import { logger } from '@/lib/logger'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Rate limiter: 30 requests per minute (lightweight query)
const userIdsLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

/**
 * GET /api/admin/user-ids
 * Fetch all user IDs for admin dashboard
 */
export async function GET(request: NextRequest) {
  // Authentication check - verify user role
  const authError = await requireAdminAuth(request)
  if (authError) return authError

  // Rate limiting: 30 requests per minute
  const ip = getClientIp(request)
  try {
    await userIdsLimiter.check(ip, 30)
  } catch {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': '60'
        }
      }
    )
  }

  try {
    const supabase = getAdminSupabaseClient()

    // Fetch all user IDs from player_profiles
    let profiles, error
    try {
      const result = await supabase
        .from('player_profiles')
        .select('user_id, last_activity')
        .order('last_activity', { ascending: false })
        .abortSignal(AbortSignal.timeout(10000))
      profiles = result.data
      error = result.error
    } catch (err) {
      // Check if timeout error
      if (err instanceof Error && err.name === 'AbortError') {
        logger.error('Query timeout fetching user IDs', { operation: 'admin.user-ids' })
        return NextResponse.json(
          { error: 'Request timed out. The database may be under heavy load. Please try again.' },
          { status: 504 } // Gateway Timeout
        )
      }
      throw err // Re-throw non-timeout errors
    }

    if (error) {
      logger.error('Supabase error fetching user IDs', { operation: 'admin.user-ids', code: error.code })
      return NextResponse.json(
        { error: 'Failed to fetch user IDs' },
        { status: 500 }
      )
    }

    const userIds = (profiles || []).map(p => p.user_id)

    logger.debug('Retrieved user IDs', { operation: 'admin.user-ids', count: userIds.length })

    // Audit log: Admin accessed user ID list
    auditLog('view_user_list', 'admin', undefined, { count: userIds.length })

    return NextResponse.json({
      success: true,
      userIds
    })
  } catch (error) {
    logger.error('Unexpected error in user-ids endpoint', { operation: 'admin.user-ids' }, error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: 'An error occurred fetching user IDs' },
      { status: 500 }
    )
  }
}

