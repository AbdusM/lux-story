/**
 * Relationship Progress API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles character relationship progress records
 * Tracks trust level, relationship status, and interaction history
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

const OPERATION_GET = 'relationship-progress.get'
const OPERATION_POST = 'relationship-progress.post'

const MAX_BODY_BYTES = 16_384

/**
 * POST /api/user/relationship-progress
 * Upsert relationship progress record
 */
export async function POST(request: NextRequest) {
  try {
    const session = requireUserSession(request)
    if (!session.ok) return session.response

    const parsed = await readJsonBody(request, { maxBytes: MAX_BODY_BYTES })
    if (!parsed.ok) return parsed.response
    const body = parsed.body as Record<string, unknown>
    const { user_id, character_name, trust_level, relationship_status, last_interaction, interaction_count } = body

    logger.debug('Relationship progress POST request', { operation: OPERATION_POST, userId: session.userId, character: character_name })

    // Validate required fields
    if (!character_name || trust_level === undefined) {
      logger.warn('Missing required fields', { operation: OPERATION_POST })
      return NextResponse.json({ error: 'Missing required fields: character_name, trust_level' }, { status: 400 })
    }

    const mismatch = ensureProvidedUserIdMatchesSession({
      provided: user_id,
      sessionUserId: session.userId,
      fieldName: 'user_id',
    })
    if (mismatch) return mismatch

    const skipResponse = checkSupabaseConfigured(OPERATION_POST)
    if (skipResponse) return skipResponse

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('relationship_progress')
      .upsert({
        user_id: session.userId,
        character_name,
        trust_level,
        relationship_status: relationship_status || 'stranger',
        last_interaction: last_interaction || new Date().toISOString(),
        interaction_count: interaction_count || 1
      }, {
        onConflict: 'user_id,character_name'
      })
      .select()
      .single()

    // PGRST204 = upsert succeeded but RLS prevents select
    if (error && error.code !== 'PGRST204') {
      return supabaseErrorResponse(OPERATION_POST, error.code, 'Failed to upsert relationship progress', session.userId)
    }

    logger.debug('Relationship progress upserted', { operation: OPERATION_POST, userId: session.userId, character: character_name })

    return NextResponse.json({ success: true, relationship: data })
  } catch (error) {
    return handleApiError(error, OPERATION_POST, 'POST')
  }
}

/**
 * GET /api/user/relationship-progress?userId=xxx
 * Retrieve all relationship records for a user
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
      .from('relationship_progress')
      .select('*')
      .eq('user_id', session.userId)
      .order('trust_level', { ascending: false })

    if (error) {
      return supabaseErrorResponse(OPERATION_GET, error.code, 'Failed to fetch relationship progress', session.userId)
    }

    return NextResponse.json({ success: true, relationships: data || [] })
  } catch (error) {
    return handleApiError(error, OPERATION_GET, 'GET', 'relationships')
  }
}
