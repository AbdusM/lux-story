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
 */

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Verify admin authentication via cookie
 * Returns error response if unauthorized, null if authorized
 */
export function requireAdminAuth(request: NextRequest): NextResponse | null {
  const authToken = request.cookies.get('admin_auth_token')?.value
  const expectedToken = process.env.ADMIN_API_TOKEN

  if (!authToken || !expectedToken || authToken !== expectedToken) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 401 }
    )
  }

  return null // Auth passed
}

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
