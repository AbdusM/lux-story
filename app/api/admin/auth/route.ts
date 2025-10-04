/**
 * Admin Authentication API
 * Simple password-based authentication for admin dashboard
 *
 * Security considerations:
 * - Uses secure HTTP-only cookies
 * - Token-based authentication (not session-based)
 * - Rate limited to prevent brute force
 */

import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

// Rate limiter: 5 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500, // Max 500 IPs tracked
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

    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password required' },
        { status: 400 }
      )
    }

    // Verify password against environment variable
    const adminToken = process.env.ADMIN_API_TOKEN
    if (!adminToken) {
      console.error('[Admin Auth] ADMIN_API_TOKEN not configured')
      return NextResponse.json(
        { error: 'Authentication not configured' },
        { status: 500 }
      )
    }

    // Simple password check (in production, use proper hashing)
    if (password === adminToken) {
      // Create response with secure cookie
      const response = NextResponse.json({ success: true })

      // Set HTTP-only cookie with auth token
      response.cookies.set('admin_auth_token', adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return response
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('[Admin Auth] Error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

// Logout endpoint
export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true })

  // Clear auth cookie
  response.cookies.delete('admin_auth_token')

  return response
}
