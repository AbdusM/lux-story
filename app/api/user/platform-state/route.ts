/**
 * Platform State API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles global game state synchronization
 * Tracks current scene, global flags, and behavioral patterns
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { logger } from '@/lib/logger'
import {
  extractAndValidateUserIdFromQuery,
  validateUserIdFromBody,
  supabaseErrorResponse,
  handleApiError,
  checkSupabaseConfigured
} from '@/lib/api/api-utils'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_GET = 'platform-state.get'
const OPERATION_POST = 'platform-state.post'

/**
 * POST /api/user/platform-state
 * Upsert platform state record
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, platform_id, current_scene, global_flags, patterns, updated_at } = body
    const resolvedPlatformId = platform_id || 'core'

    logger.debug('Platform state POST request', { operation: OPERATION_POST, userId: user_id })

    const validation = validateUserIdFromBody(user_id, OPERATION_POST)
    if (!validation.valid) {
      return validation.response
    }

    const skipResponse = checkSupabaseConfigured(OPERATION_POST)
    if (skipResponse) return skipResponse

    const supabase = getSupabaseServerClient()

    // Ensure player profile exists (required by FK constraint on platform_states)
    // This upsert is idempotent - creates if missing, no-op if exists
    const { error: profileError } = await supabase
      .from('player_profiles')
      .upsert({ user_id, created_at: new Date().toISOString() }, {
        onConflict: 'user_id',
        ignoreDuplicates: true
      })

    if (profileError) {
      logger.error('Failed to ensure player profile', {
        operation: OPERATION_POST,
        userId: user_id,
        errorCode: profileError.code,
        errorMessage: profileError.message
      })
      return supabaseErrorResponse(OPERATION_POST, profileError.code, 'Failed to ensure player profile', user_id)
    }

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {
      user_id,
      platform_id: resolvedPlatformId,
      updated_at: updated_at || new Date().toISOString()
    }
    if (current_scene !== undefined) updateData.current_scene = current_scene
    if (global_flags !== undefined) updateData.global_flags = global_flags
    if (patterns !== undefined) updateData.patterns = patterns

    const { data, error } = await supabase
      .from('platform_states')
      .upsert(updateData, { onConflict: 'user_id,platform_id' })
      .select()
      .single()

    // PGRST204 = upsert succeeded but RLS prevents select
    if (error && error.code !== 'PGRST204') {
      logger.error('Failed to upsert platform state', {
        operation: OPERATION_POST,
        userId: user_id,
        errorCode: error.code,
        errorMessage: error.message
      })
      return supabaseErrorResponse(OPERATION_POST, error.code, 'Failed to upsert platform state', user_id)
    }

    logger.debug('Platform state upserted', { operation: OPERATION_POST, userId: user_id })

    return NextResponse.json({ success: true, state: data })
  } catch (error) {
    return handleApiError(error, OPERATION_POST, 'POST')
  }
}

/**
 * GET /api/user/platform-state?userId=xxx
 * Retrieve platform state for a user
 */
export async function GET(request: NextRequest) {
  try {
    const validation = extractAndValidateUserIdFromQuery(request, OPERATION_GET)
    if (!validation.valid) {
      return validation.response
    }
    const { userId } = validation
    const platformId = request.nextUrl.searchParams.get('platformId') || 'core'

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('platform_states')
      .select('*')
      .eq('user_id', userId)
      .eq('platform_id', platformId)
      .single()

    // PGRST116 = no rows returned (not an error)
    if (error && error.code !== 'PGRST116') {
      return supabaseErrorResponse(OPERATION_GET, error.code, 'Failed to fetch platform state', userId)
    }

    return NextResponse.json({ success: true, state: data || null })
  } catch (error) {
    return handleApiError(error, OPERATION_GET, 'GET')
  }
}
