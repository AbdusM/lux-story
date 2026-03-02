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
import { readJsonBody } from '@/lib/api/request-body'
import {
  supabaseErrorResponse,
  handleApiError,
  checkSupabaseConfigured
} from '@/lib/api/api-utils'
import { ensureProvidedUserIdMatchesSession, requireUserSession } from '@/lib/api/user-session'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_GET = 'platform-state.get'
const OPERATION_POST = 'platform-state.post'

const MAX_BODY_BYTES = 16_384

/**
 * POST /api/user/platform-state
 * Upsert platform state record
 */
export async function POST(request: NextRequest) {
  try {
    const session = requireUserSession(request)
    if (!session.ok) return session.response

    const parsed = await readJsonBody(request, { maxBytes: MAX_BODY_BYTES })
    if (!parsed.ok) return parsed.response
    const body = parsed.body as Record<string, unknown>
    const { user_id, current_scene, global_flags, patterns, updated_at } = body

    logger.debug('Platform state POST request', { operation: OPERATION_POST, userId: session.userId })

    const mismatch = ensureProvidedUserIdMatchesSession({
      provided: user_id,
      sessionUserId: session.userId,
      fieldName: 'user_id',
    })
    if (mismatch) return mismatch

    const skipResponse = checkSupabaseConfigured(OPERATION_POST)
    if (skipResponse) return skipResponse

    const supabase = getSupabaseServerClient()

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {
      user_id: session.userId,
      updated_at: updated_at || new Date().toISOString()
    }
    if (current_scene !== undefined) updateData.current_scene = current_scene
    if (global_flags !== undefined) updateData.global_flags = global_flags
    if (patterns !== undefined) updateData.patterns = patterns

    const { data, error } = await supabase
      .from('platform_states')
      .upsert(updateData, { onConflict: 'user_id' })
      .select()
      .single()

    // PGRST204 = upsert succeeded but RLS prevents select
    if (error && error.code !== 'PGRST204') {
      return supabaseErrorResponse(OPERATION_POST, error.code, 'Failed to upsert platform state', session.userId)
    }

    logger.debug('Platform state upserted', { operation: OPERATION_POST, userId: session.userId })

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
    const session = requireUserSession(request)
    if (!session.ok) return session.response

    const { searchParams } = new URL(request.url)
    const requestedUserId = searchParams.get('userId')
    const mismatch = ensureProvidedUserIdMatchesSession({
      provided: requestedUserId,
      sessionUserId: session.userId,
      fieldName: 'userId',
    })
    if (mismatch) return mismatch

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('platform_states')
      .select('*')
      .eq('user_id', session.userId)
      .single()

    // PGRST116 = no rows returned (not an error)
    if (error && error.code !== 'PGRST116') {
      return supabaseErrorResponse(OPERATION_GET, error.code, 'Failed to fetch platform state', session.userId)
    }

    return NextResponse.json({ success: true, state: data || null })
  } catch (error) {
    return handleApiError(error, OPERATION_GET, 'GET')
  }
}
