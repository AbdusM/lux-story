/**
 * Centralized Admin Supabase Client
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Provides authenticated Supabase service client for admin operations.
 * Enforces authentication before providing access to service role.
 *
 * Security:
 * - Always checks admin cookie auth before returning client
 * - Uses service role key (bypasses RLS) - handle with care
 * - Single source of truth for admin database access
 *
 * SECURITY FIX (Dec 25, 2025):
 * - Replaced plaintext password comparison with session validation
 */

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth-utils'

/**
 * Verify admin authentication via session token
 * SECURITY FIX: Previously compared raw password, now validates session token
 * Returns error response if unauthorized, null if authorized
 */
export function requireAdminAuth(request: NextRequest): NextResponse | null {
  const sessionToken = request.cookies.get('admin_auth_token')?.value

  if (!sessionToken) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 401 }
    )
  }

  // Validate session token (not password comparison!)
  const userId = validateSession(sessionToken)
  if (!userId) {
    return NextResponse.json(
      { error: 'Session expired - Please log in again' },
      { status: 401 }
    )
  }

  return null // Auth passed
}

// Cache whether we've already logged the missing env var warning
let _missingEnvWarningLogged = false

/**
 * Get authenticated admin Supabase client
 *
 * IMPORTANT: Always call requireAdminAuth() before using this client!
 * This client uses service role key which bypasses all RLS policies.
 *
 * @throws Error if Supabase environment variables are missing
 */
export function getAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    const missing = []
    if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL')
    if (!serviceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY')
    throw new Error(`Missing Supabase environment variables: ${missing.join(', ')}`)
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * Get admin Supabase client or null if not configured
 * Use this for optional database operations that should gracefully degrade
 *
 * @returns Supabase client or null if env vars are missing
 */
export function getAdminSupabaseClientOrNull() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    // Only log warning once to prevent console spam
    if (!_missingEnvWarningLogged) {
      _missingEnvWarningLogged = true
      const missing = []
      if (!supabaseUrl) missing.push('SUPABASE_URL')
      if (!serviceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY')
      console.warn(`[AdminSupabase] Missing env vars: ${missing.join(', ')}. Database operations will be skipped.`)
    }
    return null
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * Combined helper: Verify auth AND get client in one call
 * Returns [client, null] if authorized
 * Returns [null, errorResponse] if unauthorized
 *
 * Usage:
 * ```typescript
 * const [supabase, authError] = getAuthenticatedAdminClient(request)
 * if (authError) return authError
 * // Use supabase safely
 * ```
 */
export function getAuthenticatedAdminClient(
  request: NextRequest
): [ReturnType<typeof getAdminSupabaseClient>, null] | [null, NextResponse] {
  const authError = requireAdminAuth(request)
  if (authError) {
    return [null, authError]
  }

  try {
    const client = getAdminSupabaseClient()
    return [client, null]
  } catch (_error) {
    return [null, NextResponse.json(
      { error: 'Database configuration error' },
      { status: 500 }
    )]
  }
}
