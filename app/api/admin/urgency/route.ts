/**
 * Admin Urgency API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Exposes urgent student data with Glass Box narrative justifications.
 *
 * Endpoints:
 * - GET /api/admin/urgency?level={all|high|critical}&limit=50
 * - POST /api/admin/urgency (triggers recalculation for all players)
 *
 * Authentication: Bearer token (ADMIN_API_TOKEN environment variable)
 *
 * TODO (Security): Replace Bearer token with proper OAuth/JWT before production
 * Current setup sufficient for pilot (internal network, ~3 admins)
 * Future: Implement Supabase Auth with admin role claims
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { UrgencyAPIResponse, RecalculationResponse, UrgencyLevel } from '@/lib/types/admin'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Simple auth helper - inline for MVP, easy to extract to middleware later
function requireAuth(request: NextRequest): NextResponse | null {
  const token = request.headers.get('Authorization')
  const expectedToken = `Bearer ${process.env.ADMIN_API_TOKEN}`

  if (!token || token !== expectedToken) {
    console.warn('[Admin API] Unauthorized access attempt from:', request.headers.get('x-forwarded-for') || 'unknown')
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 401 }
    )
  }

  return null // Auth passed
}

/**
 * GET /api/admin/urgency
 * Fetches urgent students from materialized view
 *
 * Query params:
 * - level: 'all' | 'low' | 'medium' | 'high' | 'critical' (default: 'all')
 * - limit: number (default: 50, max: 200)
 */
export async function GET(request: NextRequest): Promise<NextResponse<UrgencyAPIResponse>> {
  // Authentication check
  const authError = requireAuth(request)
  if (authError) return authError

  try {
    const searchParams = request.nextUrl.searchParams
    const levelParam = searchParams.get('level') || 'all'
    const limitParam = parseInt(searchParams.get('limit') || '50', 10)

    // Validate and cap limit
    const limit = Math.min(Math.max(limitParam, 1), 200)

    // Validate level
    const validLevels: UrgencyLevel[] = ['all', 'low', 'medium', 'high', 'critical']
    const level = validLevels.includes(levelParam as UrgencyLevel)
      ? (levelParam as UrgencyLevel)
      : 'all'

    console.log(`[Admin API] Fetching urgent students: level=${level}, limit=${limit}`)

    // Create service role client (bypasses RLS for admin access)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Query urgent_students materialized view
    let query = supabase
      .from('urgent_students')
      .select('*')
      .limit(limit)

    // Filter by level if not 'all'
    if (level !== 'all') {
      query = query.eq('urgency_level', level)
    }

    const { data, error } = await query

    if (error) {
      console.error('[Admin API] Database error:', error)
      return NextResponse.json(
        {
          students: [],
          count: 0,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }

    console.log(`[Admin API] Successfully fetched ${data?.length || 0} urgent students`)

    // Transform snake_case to camelCase for TypeScript frontend
    const students = (data || []).map((row: any) => ({
      userId: row.user_id,
      currentScene: row.current_scene,
      urgencyLevel: row.urgency_level,
      urgencyScore: row.urgency_score,
      urgencyNarrative: row.urgency_narrative,
      disengagementScore: row.disengagement_score,
      confusionScore: row.confusion_score,
      stressScore: row.stress_score,
      isolationScore: row.isolation_score,
      lastActivity: row.last_activity,
      totalChoices: row.total_choices,
      uniqueScenesVisited: row.unique_scenes_visited,
      relationshipsFormed: row.relationships_formed
    }))

    return NextResponse.json({
      students,
      count: students.length,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('[Admin API] Unexpected error:', error)
    return NextResponse.json(
      {
        students: [],
        count: 0,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/urgency
 * Triggers urgency recalculation for all players
 *
 * This is an expensive operation - should be run:
 * - On-demand by admin
 * - Scheduled (hourly/daily) via cron
 * - After bulk data imports
 */
export async function POST(request: NextRequest): Promise<NextResponse<RecalculationResponse>> {
  // Authentication check
  const authError = requireAuth(request)
  if (authError) return authError

  try {
    console.log('[Admin API] Starting urgency recalculation for all players...')

    // Create service role client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get all player IDs
    const { data: players, error: fetchError } = await supabase
      .from('player_profiles')
      .select('user_id')

    if (fetchError) {
      console.error('[Admin API] Error fetching players:', fetchError)
      return NextResponse.json(
        {
          message: 'Failed to fetch players',
          playersProcessed: 0,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }

    if (!players || players.length === 0) {
      console.warn('[Admin API] No players found in database')
      return NextResponse.json({
        message: 'No players found',
        playersProcessed: 0,
        timestamp: new Date().toISOString()
      })
    }

    console.log(`[Admin API] Calculating urgency for ${players.length} players...`)

    // Calculate urgency for each player
    // Note: This is sequential for simplicity. Could be parallelized with Promise.all
    // if we have performance issues with 100+ players.
    let successCount = 0
    let errorCount = 0

    for (const player of players) {
      try {
        const { error } = await supabase.rpc('calculate_urgency_score', {
          p_player_id: player.user_id
        })

        if (error) {
          console.error(`[Admin API] Failed to calculate urgency for ${player.user_id}:`, error)
          errorCount++
        } else {
          successCount++
        }
      } catch (error) {
        console.error(`[Admin API] Exception calculating urgency for ${player.user_id}:`, error)
        errorCount++
      }
    }

    console.log(`[Admin API] Urgency calculation complete: ${successCount} success, ${errorCount} errors`)

    // Refresh materialized view to reflect new scores
    console.log('[Admin API] Refreshing urgent_students materialized view...')
    const { error: refreshError } = await supabase.rpc('refresh_urgent_students_view')

    if (refreshError) {
      console.error('[Admin API] Failed to refresh materialized view:', refreshError)
      // Don't fail the request - calculations succeeded
    }

    return NextResponse.json({
      message: `Urgency calculation complete: ${successCount} players processed${errorCount > 0 ? `, ${errorCount} errors` : ''}`,
      playersProcessed: successCount,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('[Admin API] Unexpected error during recalculation:', error)
    return NextResponse.json(
      {
        message: 'Unexpected error during recalculation',
        playersProcessed: 0,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
