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
 * Authentication: Cookie-based (admin_auth_token)
 * Security: Uses centralized admin client with service role access
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth, getAdminSupabaseClient } from '@/lib/admin-supabase-client'
import type { UrgencyAPIResponse, RecalculationResponse, UrgencyLevel } from '@/lib/types/admin'
import { auditLog } from '@/lib/audit-logger'

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
  const authError = requireAdminAuth(request)
  if (authError) return authError as NextResponse<UrgencyAPIResponse>

  try {
    const supabase = getAdminSupabaseClient()
    const searchParams = request.nextUrl.searchParams
    const userIdParam = searchParams.get('userId') // Single user lookup

    // Single user lookup - optimized path
    if (userIdParam) {
      console.log(`[Admin API] Fetching urgency data for user: ${userIdParam}`)
      
      const { data, error } = await supabase
        .from('urgent_students')
        .select('*')
        .eq('user_id', userIdParam)
        .abortSignal(AbortSignal.timeout(10000)) // 10 second timeout
        .single()

      if (error) {
        console.error('[Admin API] Single user query error:', error)
    // @ts-expect-error - NextResponse type compatibility
        return NextResponse.json(
          {
            user: null,
            timestamp: new Date().toISOString()
          },
          { status: 404 }
        )
      }

      if (!data) {
    // @ts-expect-error - NextResponse type compatibility
        return NextResponse.json(
          {
            user: null,
            timestamp: new Date().toISOString()
          },
          { status: 404 }
        )
      }

      // Transform to camelCase
      const user = {
        userId: data.user_id,
        currentScene: data.current_scene,
        totalDemonstrations: data.total_demonstrations || 0,
        lastActivity: data.last_activity,
        urgencyScore: data.urgency_score,
        urgencyLevel: data.urgency_level,
        urgencyNarrative: data.urgency_narrative,
        disengagementScore: data.disengagement_score,
        confusionScore: data.confusion_score,
        stressScore: data.stress_score,
        isolationScore: data.isolation_score,
        uniqueScenesVisited: data.unique_scenes_visited || 0,
        relationshipsFormed: data.relationships_formed || 0
      }

      // Audit log: Admin accessed single user urgency data
      auditLog('view_urgency_single', 'admin', userIdParam)
  // @ts-expect-error - NextResponse type compatibility

      return NextResponse.json({
        user,
        timestamp: new Date().toISOString()
      })
    }

    // Multi-user query (original behavior)
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

    // Query urgent_students materialized view
    let query = supabase
      .from('urgent_students')
      .select('*')
      .limit(limit)

    // Filter by level if not 'all'
    if (level !== 'all') {
      query = query.eq('urgency_level', level)
    }

    const { data, error } = await query.abortSignal(AbortSignal.timeout(10000))

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
    const students = (data || []).map((row: Record<string, unknown>) => ({
      userId: row.user_id,
      currentScene: row.current_scene,
      totalDemonstrations: row.total_demonstrations || 0,
      lastActivity: row.last_activity,
      urgencyScore: row.urgency_score,
      urgencyLevel: row.urgency_level,
      urgencyNarrative: row.urgency_narrative,
      disengagementScore: row.disengagement_score,
      confusionScore: row.confusion_score,
      stressScore: row.stress_score,
      isolationScore: row.isolation_score,
      totalChoices: row.total_choices,
      uniqueScenesVisited: row.unique_scenes_visited,
      totalSceneVisits: row.total_scene_visits || 0,
      helpingPattern: row.helping_pattern,
      rushingPattern: row.rushing_pattern,
      exploringPattern: row.exploring_pattern,
      relationshipsFormed: row.relationships_formed,
      avgTrustLevel: row.avg_trust_level
    }))

    // Audit log: Admin accessed urgency list
    auditLog('view_urgency_list', 'admin', undefined, { level, count: students.length })

    return NextResponse.json({
      students,
      count: students.length,
      timestamp: new Date().toISOString()
    } as UrgencyAPIResponse)

  } catch (error) {
    // Log detailed error server-side
    console.error('[Admin API] Unexpected error:', error)

    // Return generic error to client (don't expose implementation details)
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
  const authError = requireAdminAuth(request)
  if (authError) return authError as NextResponse<RecalculationResponse>

  try {
    console.log('[Admin API] Starting urgency recalculation for all players...')

    const supabase = getAdminSupabaseClient()

    // Get all player IDs
    const { data: players, error: fetchError } = await supabase
      .from('player_profiles')
      .select('user_id')
      .abortSignal(AbortSignal.timeout(10000))

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

    // Audit log: Admin triggered urgency recalculation
    auditLog('recalculate_urgency', 'admin', undefined, {
      playersProcessed: successCount,
      errors: errorCount
    })

    return NextResponse.json({
      message: `Urgency calculation complete: ${successCount} players processed${errorCount > 0 ? `, ${errorCount} errors` : ''}`,
      playersProcessed: successCount,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    // Log detailed error server-side
    console.error('[Admin API] Unexpected error during recalculation:', error)

    // Return generic error to client
    return NextResponse.json(
      {
        message: 'An error occurred during recalculation',
        playersProcessed: 0,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
