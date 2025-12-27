/**
 * API Utility Helpers
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Composable helpers for API routes to reduce boilerplate
 * while maintaining flexibility for route-specific logic.
 */

import { NextRequest, NextResponse } from 'next/server'
import { validateUserId } from '@/lib/user-id-validation'
import { logger } from '@/lib/logger'

// ============================================
// Response Helpers
// ============================================

/**
 * Standard error response for missing userId parameter
 */
export function missingUserIdResponse(operation: string): NextResponse {
  logger.warn('Missing userId parameter', { operation })
  return NextResponse.json(
    { error: 'Missing userId parameter' },
    { status: 400 }
  )
}

/**
 * Standard error response for invalid userId
 */
export function invalidUserIdResponse(error: string): NextResponse {
  return NextResponse.json(
    { error },
    { status: 400 }
  )
}

/**
 * Standard error response for Supabase errors
 */
export function supabaseErrorResponse(
  operation: string,
  errorCode: string | undefined,
  message: string,
  userId?: string
): NextResponse {
  logger.error(`Supabase error: ${message}`, {
    operation,
    errorCode,
    userId
  })
  return NextResponse.json(
    { error: message },
    { status: 500 }
  )
}

/**
 * Graceful response when Supabase is not configured
 * Returns empty data for GET, success for POST
 */
export function supabaseNotConfiguredResponse(
  operation: string,
  method: 'GET' | 'POST',
  emptyDataKey?: string
): NextResponse {
  logger.warn('Missing Supabase config - operation skipped', { operation })

  if (method === 'GET' && emptyDataKey) {
    return NextResponse.json({
      success: true,
      [emptyDataKey]: []
    })
  }

  return NextResponse.json({ success: true })
}

// ============================================
// Validation Helpers
// ============================================

type UserIdValidationResult =
  | { valid: true; userId: string }
  | { valid: false; response: NextResponse }

/**
 * Extract and validate userId from GET request searchParams
 */
export function extractAndValidateUserIdFromQuery(
  request: NextRequest,
  operation: string
): UserIdValidationResult {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  logger.debug(`${operation} request`, { operation, userId: userId ?? undefined })

  if (!userId) {
    return { valid: false, response: missingUserIdResponse(operation) }
  }

  const validation = validateUserId(userId)
  if (!validation.valid) {
    return { valid: false, response: invalidUserIdResponse(validation.error!) }
  }

  return { valid: true, userId }
}

/**
 * Validate userId from POST request body
 * Note: Does NOT extract - caller should parse body and pass user_id
 */
export function validateUserIdFromBody(
  userId: string | undefined,
  operation: string
): UserIdValidationResult {
  if (!userId) {
    logger.warn('Missing user_id in request body', { operation })
    return {
      valid: false,
      response: NextResponse.json(
        { error: 'Missing user_id' },
        { status: 400 }
      )
    }
  }

  const validation = validateUserId(userId)
  if (!validation.valid) {
    return { valid: false, response: invalidUserIdResponse(validation.error!) }
  }

  return { valid: true, userId }
}

// ============================================
// Error Handling Helpers
// ============================================

/**
 * Check if error is due to missing Supabase configuration
 */
export function isSupabaseConfigError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('Missing Supabase environment variables')
  }
  return false
}

/**
 * Handle catch-all errors with Supabase config check
 * Returns appropriate response based on error type and method
 */
export function handleApiError(
  error: unknown,
  operation: string,
  method: 'GET' | 'POST',
  emptyDataKey?: string
): NextResponse {
  const errorMessage = error instanceof Error ? error.message : 'Internal server error'

  logger.error(`Unexpected error in ${operation}`, { operation }, error instanceof Error ? error : undefined)

  if (isSupabaseConfigError(error)) {
    return supabaseNotConfiguredResponse(operation, method, emptyDataKey)
  }

  return NextResponse.json(
    { error: errorMessage },
    { status: 500 }
  )
}

// ============================================
// Supabase Config Check
// ============================================

/**
 * Check if Supabase is properly configured
 * Returns true if configured, false otherwise
 */
export function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  return !!(supabaseUrl && serviceRoleKey && !supabaseUrl.includes('placeholder'))
}

/**
 * Early return if Supabase is not configured
 * Use in POST handlers to skip database operations gracefully
 */
export function checkSupabaseConfigured(operation: string): NextResponse | null {
  if (!isSupabaseConfigured()) {
    logger.warn('Supabase not configured - skipping operation', { operation })
    return NextResponse.json({
      success: true,
      message: 'Supabase not configured - sync skipped'
    })
  }
  return null
}
