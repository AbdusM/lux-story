/**
 * Admin Authentication API
 * Secure password-based authentication for admin dashboard
 *
 * Security measures:
 * - HTTP-only secure cookies
 * - Rate limited to prevent brute force (5 attempts per 15 min)
 * - Audit logging for all attempts
 * - Constant-time password comparison (prevents timing attacks)
 * - Session tokens (password not stored in cookie)
 * - 4-hour session lifetime (reduced from 7 days)
 *
 * SECURITY FIX (Dec 25, 2025):
 * - Replaced plaintext password comparison with constant-time compare
 * - Session tokens instead of storing password in cookie
 * - Reduced session lifetime from 7 days to 4 hours
 */

import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { z } from 'zod'
import { auditLog } from '@/lib/audit-logger'
import { logger } from '@/lib/logger'
import {
  verifyAdminPassword,
  createSession,
  invalidateSession,
  SESSION_DURATION_SECONDS
} from '@/lib/auth-utils'

// Rate limiter: 5 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500, // Max 500 IPs tracked
})

// Input validation schema
const loginSchema = z.object({
  password: z.string().min(1, 'Password required').max(100, 'Password too long')
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    try {
      await loginLimiter.check(ip, 5) // 5 requests per interval
    } catch {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const result = loginSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      )
    }

    const { password } = result.data

    // Verify password using constant-time comparison
    // SECURITY: This prevents timing attacks
    if (verifyAdminPassword(password)) {
      // Audit log: Successful login
      auditLog('admin_login_success', 'admin', undefined, { ip })

      // Create session token (NOT the password!)
      const sessionToken = createSession('admin')

      // Create response with secure cookie
      const response = NextResponse.json({ success: true })

      // Set HTTP-only cookie with SESSION TOKEN (not password)
      // SECURITY FIX: Previously stored plaintext password in cookie
      response.cookies.set('admin_auth_token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: SESSION_DURATION_SECONDS, // 4 hours (reduced from 7 days)
        path: '/',
      })

      return response
    } else {
      // Audit log: Failed login attempt
      auditLog('admin_login_failed', 'unknown', undefined, { ip })

      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }
  } catch (error) {
    logger.error('Authentication error', { operation: 'admin.auth.login' }, error instanceof Error ? error : undefined)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

// Logout endpoint
export async function DELETE(request: NextRequest) {
  // Audit log: Logout
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  auditLog('admin_logout', 'admin', undefined, { ip })

  // Invalidate the session
  const sessionToken = request.cookies.get('admin_auth_token')?.value
  if (sessionToken) {
    invalidateSession(sessionToken)
  }

  const response = NextResponse.json({ success: true })

  // Clear auth cookie
  response.cookies.delete('admin_auth_token')

  return response
}
