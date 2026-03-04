/**
 * Next.js Middleware - Route Protection & Auth Session Management
 * 1. Refreshes Supabase auth sessions automatically
 * 2. Protects /admin routes with authentication
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isProduction = process.env.NODE_ENV === 'production'
  const isDebugSurface =
    pathname === '/shadcn-preview' ||
    pathname === '/api/test-env' ||
    pathname.startsWith('/test-')

  if (isProduction && isDebugSurface) {
    return new NextResponse(null, { status: 404 })
  }

  // First, refresh Supabase auth session
  // This must happen on every request to keep sessions alive
  const supabaseResponse = await updateSession(request)

  // If updateSession returned a redirect, respect it
  if (supabaseResponse.headers.get('Location')) {
    return supabaseResponse
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
