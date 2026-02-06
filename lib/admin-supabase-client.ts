/**
 * Centralized Admin Supabase Client
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Provides authenticated Supabase service client for admin operations.
 * Enforces authentication before providing access to service role.
 *
 * Security:
 * - Always checks admin role via Supabase auth before returning client
 * - Uses service role key (bypasses RLS) - handle with care
 * - Single source of truth for admin database access
 *
 * SECURITY FIX (Dec 25, 2025):
 * - Replaced plaintext password comparison with session validation
 *
 * EMERGENCY FALLBACK (Jan 15, 2026):
 * - Added ADMIN_API_TOKEN as emergency fallback when Supabase auth fails
 * - Heavily rate limited (1 per 5 minutes) and fully audited
 */

import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { getAdminAuthStatus, isTestAdminBypass } from '@/lib/admin-auth'

// Emergency token fallback rate limiter: 1 per 5 minutes
const emergencyTokenLimiter = rateLimit({
  interval: 5 * 60 * 1000, // 5 minutes
  uniqueTokenPerInterval: 100, // Lower pool for emergency access
})

/**
 * Verify admin authentication via user role
 *
 * Authentication flow:
 * 1. Primary: Supabase session cookies (admin/educator role check)
 * 2. Fallback: ADMIN_API_TOKEN header (emergency access, heavily rate limited)
 *
 * Returns error response if unauthorized, null if authorized
 */
export async function requireAdminAuth(request: NextRequest): Promise<NextResponse | null> {
  const ip = getClientIp(request)

  const userAgent = request.headers.get('user-agent') || ''
  const isPlaywright = userAgent.toLowerCase().includes('playwright')
  const canBypass = process.env.NODE_ENV !== 'production'

  // Non-production convenience: Playwright user-agent shortcut.
  // Production bypass must be token-based (see `isTestAdminBypass` below).
  if (canBypass && isPlaywright) {
    return null
  }

  const testAdminToken = request.headers.get('x-test-admin')
  const testAdminCookie = request.cookies.get('e2e_admin_bypass')?.value
  if (isTestAdminBypass(testAdminToken) || isTestAdminBypass(testAdminCookie)) {
    return null
  }

  // First, try emergency token fallback (header-based)
  // This provides disaster recovery when Supabase is unavailable
  const emergencyToken = request.headers.get('X-Admin-Token')
  const configuredToken = process.env.ADMIN_API_TOKEN

  if (emergencyToken && configuredToken) {
    // Emergency token provided - verify and rate limit
    try {
      await emergencyTokenLimiter.check(ip, 1) // 1 per 5 minutes
    } catch {
      logger.warn('Emergency token rate limit exceeded', {
        operation: 'admin.auth.emergency-fallback',
        ip,
        reason: 'rate_limited'
      })
      return NextResponse.json(
        { error: 'Too many emergency auth attempts. Try again in 5 minutes.' },
        { status: 429, headers: { 'Retry-After': '300' } }
      )
    }

    if (emergencyToken === configuredToken) {
      // Emergency access granted - log for audit
      logger.warn('Emergency admin token used', {
        operation: 'admin.auth.emergency-fallback',
        ip,
        reason: 'emergency_access_granted',
        userAgent: request.headers.get('user-agent')?.substring(0, 100)
      })
      return null // Auth passed via emergency token
    } else {
      // Invalid emergency token
      logger.error('Invalid emergency admin token', {
        operation: 'admin.auth.emergency-fallback',
        ip,
        reason: 'invalid_token'
      })
      return NextResponse.json(
        { error: 'Invalid emergency token' },
        { status: 401 }
      )
    }
  }

  // Primary auth: Supabase session cookies
  // Create Supabase client from request cookies
  const supabase = createSupabaseServerClient(request)

  const authStatus = await getAdminAuthStatus(supabase)

  if (!authStatus.authorized) {
    if (authStatus.status === 403) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Unauthorized - Please sign in' },
      { status: 401 }
    )
  }

  // Auth passed - user is admin or educator
  return null
}

/**
 * Create Supabase server client for API routes
 * Handles cookies from NextRequest
 */
function createSupabaseServerClient(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
  const authError = await requireAdminAuth(request)
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
