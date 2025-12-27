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

const OPERATION_GET = 'relationship-progress.get'
const OPERATION_POST = 'relationship-progress.post'

/**
 * POST /api/user/relationship-progress
 * Upsert relationship progress record
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, character_name, trust_level, relationship_status, last_interaction, interaction_count } = body

    logger.debug('Relationship progress POST request', { operation: OPERATION_POST, userId: user_id, character: character_name })

    // Validate required fields
    if (!character_name || trust_level === undefined) {
      logger.warn('Missing required fields', { operation: OPERATION_POST })
      return NextResponse.json({ error: 'Missing required fields: character_name, trust_level' }, { status: 400 })
    }

    const validation = validateUserIdFromBody(user_id, OPERATION_POST)
    if (!validation.valid) {
      return validation.response
    }

    const skipResponse = checkSupabaseConfigured(OPERATION_POST)
    if (skipResponse) return skipResponse

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('relationship_progress')
      .upsert({
        user_id,
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
      return supabaseErrorResponse(OPERATION_POST, error.code, 'Failed to upsert relationship progress', user_id)
    }

    logger.debug('Relationship progress upserted', { operation: OPERATION_POST, userId: user_id, character: character_name })

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
    const validation = extractAndValidateUserIdFromQuery(request, OPERATION_GET)
    if (!validation.valid) {
      return validation.response
    }
    const { userId } = validation

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('relationship_progress')
      .select('*')
      .eq('user_id', userId)
      .order('trust_level', { ascending: false })

    if (error) {
      return supabaseErrorResponse(OPERATION_GET, error.code, 'Failed to fetch relationship progress', userId)
    }

    return NextResponse.json({ success: true, relationships: data || [] })
  } catch (error) {
    return handleApiError(error, OPERATION_GET, 'GET', 'relationships')
  }
}
