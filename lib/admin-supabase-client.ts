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
 *
 * EMERGENCY FALLBACK (Jan 15, 2026):
 * - Historical note: this file previously supported token-based fallback auth.
 * - Current admin access is role-based (Supabase session + profiles.role).
 */

import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

const PLAYWRIGHT_ADMIN_BYPASS_COOKIE = 'lux-playwright-admin-bypass'

export interface AuthenticatedAdminContext {
  userId: string
  email: string | null
  fullName: string | null
  role: 'admin' | 'educator'
}

function hasPlaywrightAdminBypass(request: NextRequest): boolean {
  return (
    process.env.NODE_ENV !== 'production' &&
    process.env.PLAYWRIGHT_ADMIN_BYPASS === '1' &&
    request.cookies.get(PLAYWRIGHT_ADMIN_BYPASS_COOKIE)?.value === '1'
  )
}

async function authenticateAdminRequest(
  request: NextRequest
): Promise<[AuthenticatedAdminContext, null] | [null, NextResponse]> {
  // Playwright-only bypass for browser smoke tests. This mirrors the admin page
  // middleware bypass and stays off in production.
  if (hasPlaywrightAdminBypass(request)) {
    return [
      {
        userId: 'playwright-admin-bypass',
        email: null,
        fullName: 'Playwright Admin',
        role: 'admin',
      },
      null,
    ]
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    return [
      null,
      NextResponse.json(
        { error: 'Admin authentication is not configured' },
        { status: 503 }
      ),
    ]
  }

  const supabase = createSupabaseServerClient(request)
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return [
      null,
      NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      ),
    ]
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('user_id', user.id)
    .single()

  if (profileError || !profile) {
    return [
      null,
      NextResponse.json(
        { error: 'Unauthorized - Profile not found' },
        { status: 401 }
      ),
    ]
  }

  if (!['admin', 'educator'].includes(profile.role)) {
    return [
      null,
      NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      ),
    ]
  }

  return [
    {
      userId: user.id,
      email: typeof user.email === 'string' ? user.email : null,
      fullName: typeof profile.full_name === 'string' ? profile.full_name : null,
      role: profile.role,
    },
    null,
  ]
}

/**
 * Verify admin authentication via user role
 *
 * Authentication flow:
 * 1. Primary: Supabase session cookies (admin/educator role check)
 *
 * Returns error response if unauthorized, null if authorized
 */
export async function requireAdminAuth(request: NextRequest): Promise<NextResponse | null> {
  const [, authError] = await authenticateAdminRequest(request)
  return authError
}

export async function getAuthenticatedAdminContext(
  request: NextRequest
): Promise<[AuthenticatedAdminContext, null] | [null, NextResponse]> {
  return authenticateAdminRequest(request)
}

/**
 * Create Supabase server client for API routes
 * Handles cookies from NextRequest
 */
function createSupabaseServerClient(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase env vars for admin auth client')
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map(cookie => ({
            name: cookie.name,
            value: cookie.value
          }))
        },
        setAll(_cookiesToSet) {
          // Can't set cookies in API route GET requests
          // Middleware handles session refresh
        }
      }
    }
  )
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
export async function getAuthenticatedAdminClient(
  request: NextRequest
): Promise<[ReturnType<typeof getAdminSupabaseClient>, null] | [null, NextResponse]> {
  const [, authError] = await authenticateAdminRequest(request)
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
