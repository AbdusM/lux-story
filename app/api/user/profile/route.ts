/**
 * Player Profile API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles player profile initialization
 * Ensures player profile exists before any skill/pattern tracking
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
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

// Rate limiter: 30 writes per minute, 60 reads per minute
const writeLimiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 500 })
const readLimiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 500 })

/**
 * POST /api/user/profile
 * Create or ensure player profile exists
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request)
    try {
      await writeLimiter.check(ip, 30)
    } catch {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

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
    // Rate limiting
    const ip = getClientIp(request)
    try {
      await readLimiter.check(ip, 60)
    } catch {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

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
