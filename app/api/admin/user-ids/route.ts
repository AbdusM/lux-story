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

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/admin/user-ids
 * Fetch all user IDs for admin dashboard
 */
export async function GET(request: NextRequest) {
  // Authentication check - verify admin cookie
  const authError = requireAdminAuth(request)
  if (authError) return authError

  try {
    const supabase = getAdminSupabaseClient()

    // Fetch all user IDs from player_profiles
    const { data: profiles, error } = await supabase
      .from('player_profiles')
      .select('user_id, last_activity')
      .order('last_activity', { ascending: false })
      .abortSignal(AbortSignal.timeout(10000))

    if (error) {
      console.error('❌ [Admin:UserIds] Supabase error:', {
        code: error.code,
        message: error instanceof Error ? error.message : "Unknown error",
      })
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
    // Log detailed error server-side
    console.error('[Admin:UserIds] Unexpected error:', error)

    // Return generic error to client
    return NextResponse.json(
      { error: 'An error occurred fetching user IDs' },
      { status: 500 }
    )
  }
}

