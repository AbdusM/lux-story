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
import { logger } from '@/lib/logger'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { createTimer } from '@/lib/api-timing'

// Rate limiters
const queryLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

const recalculateLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500,
})

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
  const authError = await requireAdminAuth(request)
  if (authError) return authError as NextResponse<UrgencyAPIResponse>

  // Rate limiting: 20 requests per minute
  const ip = getClientIp(request)
  try {
    await queryLimiter.check(ip, 20)
  } catch {
    return NextResponse.json(
      {
        students: [],
        count: 0,
        timestamp: new Date().toISOString(),
        error: 'Too many requests. Please try again later.'
      } as UrgencyAPIResponse,
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
    const searchParams = request.nextUrl.searchParams
    const userIdParam = searchParams.get('userId') // Single user lookup

    // Single user lookup - optimized path
    if (userIdParam) {
      logger.debug('Fetching urgency data for user', { operation: 'admin.urgency.single', userId: userIdParam })

      let data, error
      try {
        const result = await supabase
          .from('urgent_students')
          .select('*')
          .eq('user_id', userIdParam)
          .abortSignal(AbortSignal.timeout(10000)) // 10 second timeout
          .single()
        data = result.data
        error = result.error
      } catch (err) {
        // Check if timeout error
        if (err instanceof Error && err.name === 'AbortError') {
          logger.error('Query timeout for user', { operation: 'admin.urgency.single', userId: userIdParam })
          // @ts-expect-error - NextResponse type compatibility
          return NextResponse.json(
            {
              user: null,
              timestamp: new Date().toISOString(),
              error: 'Request timed out. The database may be under heavy load. Please try again.'
            },
            { status: 504 } // Gateway Timeout
          )
        }
        throw err // Re-throw non-timeout errors
      }

      if (error) {
        logger.error('Single user query error', { operation: 'admin.urgency.single', userId: userIdParam, code: error.code })
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

    logger.debug('Fetching urgent students', { operation: 'admin.urgency.list', level, limit })

    // Query urgent_students materialized view
    let query = supabase
      .from('urgent_students')
      .select('*')
      .limit(limit)

    // Filter by level if not 'all'
    if (level !== 'all') {
      query = query.eq('urgency_level', level)
    }

    let data, error
    try {
      const result = await query.abortSignal(AbortSignal.timeout(10000))
      data = result.data
      error = result.error
    } catch (err) {
      // Check if timeout error
      if (err instanceof Error && err.name === 'AbortError') {
        logger.error('Query timeout for urgency list', { operation: 'admin.urgency.list', level, limit })
        return NextResponse.json(
          {
            students: [],
            count: 0,
            timestamp: new Date().toISOString(),
            error: 'Request timed out. The database may be under heavy load. Please try again.'
          },
          { status: 504 } // Gateway Timeout
        )
      }
      throw err // Re-throw non-timeout errors
    }

    if (error) {
      logger.error('Database error fetching urgency list', { operation: 'admin.urgency.list', code: error.code })
      return NextResponse.json(
        {
          students: [],
          count: 0,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }

    logger.debug('Successfully fetched urgent students', { operation: 'admin.urgency.list-success', count: data?.length || 0 })

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
    logger.error('Unexpected error in urgency endpoint', { operation: 'admin.urgency' }, error instanceof Error ? error : undefined)

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
  const authError = await requireAdminAuth(request)
  if (authError) return authError as NextResponse<RecalculationResponse>

  // Rate limiting: 3 recalculations per 15 minutes (expensive operation)
  const ip = getClientIp(request)
  try {
    await recalculateLimiter.check(ip, 3)
  } catch {
    return NextResponse.json(
      {
        message: 'Too many recalculation requests. This is an expensive operation. Please try again in 15 minutes.',
        playersProcessed: 0,
        timestamp: new Date().toISOString()
      },
      {
        status: 429,
        headers: {
          'Retry-After': '900' // 15 minutes in seconds
        }
      }
    )
  }

  try {
    const recalcTimer = createTimer('admin.urgency.recalculate')
    logger.debug('Starting urgency recalculation for all players', { operation: 'admin.urgency.recalculate-start' })

    const supabase = getAdminSupabaseClient()

    // Get all player IDs
    let players, fetchError
    try {
      const result = await supabase
        .from('player_profiles')
        .select('user_id')
        .abortSignal(AbortSignal.timeout(10000))
      players = result.data
      fetchError = result.error
    } catch (err) {
      // Check if timeout error
      if (err instanceof Error && err.name === 'AbortError') {
        logger.error('Query timeout fetching players for recalculation', { operation: 'admin.urgency.recalculate' })
        return NextResponse.json(
          {
            message: 'Request timed out while fetching players. The database may be under heavy load. Please try again.',
            playersProcessed: 0,
            timestamp: new Date().toISOString()
          },
          { status: 504 } // Gateway Timeout
        )
      }
      throw err // Re-throw non-timeout errors
    }

    if (fetchError) {
      logger.error('Error fetching players for recalculation', { operation: 'admin.urgency.recalculate', code: fetchError.code })
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
      logger.warn('No players found in database', { operation: 'admin.urgency.recalculate' })
      return NextResponse.json({
        message: 'No players found',
        playersProcessed: 0,
        timestamp: new Date().toISOString()
      })
    }

    logger.debug('Calculating urgency for players', { operation: 'admin.urgency.recalculate', playerCount: players.length })

    // Calculate urgency for all players in parallel (100x faster for 100+ players)
    const results = await Promise.allSettled(
      players.map(player =>
        supabase.rpc('calculate_urgency_score', { p_player_id: player.user_id })
      )
    )

    // Count successes and log errors
    let successCount = 0
    let errorCount = 0

    results.forEach((result, index) => {
      const userId = players[index].user_id
      if (result.status === 'fulfilled' && !result.value.error) {
        successCount++
      } else {
        errorCount++
        if (result.status === 'rejected') {
          logger.error('Exception calculating urgency for player', { operation: 'admin.urgency.recalculate', userId }, result.reason instanceof Error ? result.reason : undefined)
        } else if (result.value.error) {
          logger.error('Failed to calculate urgency for player', { operation: 'admin.urgency.recalculate', userId, code: result.value.error.code })
        }
      }
    })

    logger.debug('Urgency calculation complete', { operation: 'admin.urgency.recalculate-complete', successCount, errorCount })

    // Refresh materialized view to reflect new scores
    logger.debug('Refreshing urgent_students materialized view', { operation: 'admin.urgency.refresh-view' })
    const { error: refreshError } = await supabase.rpc('refresh_urgent_students_view')

    if (refreshError) {
      logger.error('Failed to refresh materialized view', { operation: 'admin.urgency.refresh-view', code: refreshError.code })
      // Don't fail the request - calculations succeeded
    }

    const recalcTiming = recalcTimer.stop()

    // Audit log: Admin triggered urgency recalculation
    auditLog('recalculate_urgency', 'admin', undefined, {
      playersProcessed: successCount,
      errors: errorCount,
      durationMs: recalcTiming.durationMs
    })

    return NextResponse.json({
      message: `Urgency calculation complete: ${successCount} players processed${errorCount > 0 ? `, ${errorCount} errors` : ''}`,
      playersProcessed: successCount,
      durationMs: recalcTiming.durationMs,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    logger.error('Unexpected error during urgency recalculation', { operation: 'admin.urgency.recalculate' }, error instanceof Error ? error : undefined)

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
