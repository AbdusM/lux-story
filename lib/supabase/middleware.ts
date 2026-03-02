/**
 * Supabase Middleware for Next.js
 * Refreshes user sessions automatically
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const createResponse = () => {
    try {
      return NextResponse.next({ request: { headers: new Headers(request.headers) } })
    } catch {
      return NextResponse.next()
    }
  }

  // CI/local/dev can run without Supabase configured. Middleware must never hard-crash,
  // or Playwright/web server startup will fail.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const isSupabaseConfigured = Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseAnonKey.includes('placeholder')
  )

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isAdminLoginRoute = request.nextUrl.pathname === '/admin/login'

  // Admin routes must fail closed even when Supabase isn't configured (CI/local/dev).
  // This keeps the guardrails enforceable without requiring secrets in CI.
  if (isAdminRoute && !isAdminLoginRoute && !isSupabaseConfigured) {
    const loginUrl = new URL(request.url)
    loginUrl.pathname = '/admin/login'
    loginUrl.search = ''
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search)
    return NextResponse.redirect(loginUrl)
  }

  if (!isSupabaseConfigured) {
    return createResponse()
  }

  let supabaseResponse = createResponse()

  const configuredSupabaseUrl = supabaseUrl!
  const configuredSupabaseAnonKey = supabaseAnonKey!

  const supabase = createServerClient(
    configuredSupabaseUrl,
    configuredSupabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = createResponse()
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  // Protection for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow the informational login page to render without a Supabase session.
    if (isAdminLoginRoute) {
      return supabaseResponse
    }

    // Redirect to login if accessing admin routes without auth
    if (userError || !user) {
      const loginUrl = new URL(request.url)
      loginUrl.pathname = '/admin/login'
      loginUrl.search = ''
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search)
      return NextResponse.redirect(loginUrl)
    }

    // Role-gate admin pages (API routes also enforce this server-side).
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    const role = typeof (profile as { role?: unknown } | null)?.role === 'string'
      ? (profile as { role: string }).role
      : null

    if (!role || !['admin', 'educator'].includes(role)) {
      const loginUrl = new URL(request.url)
      loginUrl.pathname = '/admin/login'
      loginUrl.search = ''
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search)
      loginUrl.searchParams.set('forbidden', 'admin')
      return NextResponse.redirect(loginUrl)
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
