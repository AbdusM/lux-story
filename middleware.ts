/**
 * Next.js Middleware - Route Protection & Auth Session Management
 * 1. Refreshes Supabase auth sessions automatically
 * 2. Protects /admin routes with authentication (legacy support)
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // First, refresh Supabase auth session
  // This must happen on every request to keep sessions alive
  const supabaseResponse = await updateSession(request)

  // If updateSession returned a redirect, respect it
  if (supabaseResponse.headers.get('Location')) {
    return supabaseResponse
  }

  const { pathname } = request.nextUrl

  // Admin route protection with session-based authentication
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Check for session token in cookie
    const authToken = request.cookies.get('admin_auth_token')?.value

    // If no session token, redirect to login
    // Actual token validation happens at API level via requireAdminAuth()
    if (!authToken) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Return the Supabase response (with refreshed session cookies)
  return supabaseResponse
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
