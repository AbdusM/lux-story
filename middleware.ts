/**
 * Next.js Middleware - Route Protection
 * Protects /admin routes with authentication
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect all /admin routes (except login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Check for auth token in cookie
    const authToken = request.cookies.get('admin_auth_token')?.value
    const expectedToken = process.env.ADMIN_API_TOKEN

    // If no token or invalid token, redirect to login
    if (!authToken || !expectedToken || authToken !== expectedToken) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
