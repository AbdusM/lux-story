/**
 * Player Profile API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles player profile initialization
 * Ensures player profile exists before any skill/pattern tracking
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { logger } from '@/lib/logger'
import {
  extractAndValidateUserIdFromQuery,
  validateUserIdFromBody,
  supabaseErrorResponse,
  handleApiError
} from '@/lib/api/api-utils'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_POST = 'profile.create'
const OPERATION_GET = 'profile.get'

/**
 * POST /api/user/profile
 * Create or ensure player profile exists
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, created_at } = body

    // Validate userId using shared helper
    const validation = validateUserIdFromBody(user_id, OPERATION_POST)
    if (!validation.valid) {
      return validation.response
    }

    const supabase = getSupabaseServerClient()

    // Use upsert to create profile if it doesn't exist, or do nothing if it does
    const { data, error } = await supabase
      .from('player_profiles')
      .upsert({
        user_id,
        created_at: created_at || new Date().toISOString()
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false // Return existing record if already exists
      })
      .select()
      .single()

    if (error) {
      return supabaseErrorResponse(OPERATION_POST, error.code, 'Failed to create/update player profile', user_id)
    }

    logger.debug('Profile ensured', {
      operation: OPERATION_POST,
      userId: user_id,
      existed: !!data
    })

    return NextResponse.json({
      success: true,
      profile: data
    })
  } catch (error) {
    return handleApiError(error, OPERATION_POST, 'POST')
  }
}

/**
 * GET /api/user/profile?userId=X
 * Fetch player profile
 */
export async function GET(request: NextRequest) {
  try {
    // Extract and validate userId using shared helper
    const validation = extractAndValidateUserIdFromQuery(request, OPERATION_GET)
    if (!validation.valid) {
      return validation.response
    }
    const { userId } = validation

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('player_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      // If profile doesn't exist, return null (not an error)
      if (error.code === 'PGRST116') {
        logger.debug('Profile not found', { operation: OPERATION_GET, userId })
        return NextResponse.json({
          success: true,
          profile: null
        })
      }

      return supabaseErrorResponse(OPERATION_GET, error.code, 'Failed to fetch player profile', userId)
    }

    logger.debug('Retrieved profile', { operation: OPERATION_GET, userId })

    return NextResponse.json({
      success: true,
      profile: data
    })
  } catch (error) {
    return handleApiError(error, OPERATION_GET, 'GET')
  }
}
