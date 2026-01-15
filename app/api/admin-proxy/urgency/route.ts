import { NextRequest, NextResponse } from 'next/server'

/**
 * Server-side proxy for urgency API
 * Protects ADMIN_API_TOKEN from client bundle exposure
 *
 * Security: Only accessible to authenticated admin users
 *
 * SECURITY FIX (Dec 25, 2025):
 * - Removed dynamic host header usage to prevent SSRF attacks
 * - Base URL now comes from environment variable only
 */

/**
 * Get the base URL for internal API calls
 * NEVER use request headers to construct URLs (SSRF risk)
 */
function getInternalBaseUrl(): string {
  // In production, use the configured URL
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }
  // In Vercel, use the VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  // Fallback for local development
  return 'http://localhost:3005'
}

import { requireAdminAuth } from '@/lib/admin-supabase-client'

export async function GET(request: NextRequest) {
  // Authentication check - verify user role
  const authError = await requireAdminAuth(request)
  if (authError) return authError

  // Extract query parameters
  const { searchParams } = new URL(request.url)
  const level = searchParams.get('level') || 'all'
  const limit = searchParams.get('limit') || '50'
  const userId = searchParams.get('userId') // Single user lookup

  // Get cookies to forward to internal API
  const cookieHeader = request.headers.get('cookie') || ''

  // Single user lookup - optimized path
  if (userId) {
    try {
      // Query urgency API for single user
      // SECURITY: Use hardcoded base URL, never trust request headers
      const baseUrl = getInternalBaseUrl()
      const apiUrl = `${baseUrl}/api/admin/urgency?userId=${encodeURIComponent(userId)}`

      const response = await fetch(apiUrl, {
        headers: {
          'Cookie': cookieHeader, // Forward session cookies
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({ user: data.user || data })
      } else {
        // If API fails, return null user
        return NextResponse.json({
          user: null,
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Single user urgency fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch user urgency data' },
        { status: 500 }
      )
    }
  }

  // Special case: "all-students" filter - use Supabase directly (not localStorage)
  if (level === 'all-students') {
    try {
      // Use Supabase service role client to get all users
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (!supabaseUrl || !supabaseServiceKey) {
        return NextResponse.json({ students: [] })
      }

      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      
      const { data: profiles, error } = await supabase
        .from('player_profiles')
        .select('user_id')
        .order('last_activity', { ascending: false })
        .limit(200)

      if (error) {
        console.error('Failed to fetch users from Supabase:', error)
        return NextResponse.json({ students: [] })
      }

      const students = (profiles || []).map(p => ({
        userId: p.user_id,
        urgencyLevel: 'pending' as const,
        urgencyScore: 0,
        urgencyNarrative: 'Student data available - urgency score pending calculation.',
        totalChoices: 0,
        uniqueScenesVisited: 0,
        relationshipsFormed: 0,
        disengagementScore: 0,
        confusionScore: 0,
        stressScore: 0,
        isolationScore: 0,
        lastActivity: p.user_id
      }))

      return NextResponse.json({ students })
    } catch (error) {
      console.error('Failed to fetch all students:', error)
      return NextResponse.json({ students: [] })
    }
  }

  // Standard urgency flow: forward to Supabase API
  try {
    // SECURITY: Use hardcoded base URL, never trust request headers
    const baseUrl = getInternalBaseUrl()
    const apiUrl = `${baseUrl}/api/admin/urgency?level=${level}&limit=${limit}`

    const response = await fetch(apiUrl, {
      headers: {
        'Cookie': cookieHeader, // Forward session cookies
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Urgency API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Admin proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch urgency data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Authentication check - verify user role
  const authError = await requireAdminAuth(request)
  if (authError) return authError

  // Get cookies to forward to internal API
  const cookieHeader = request.headers.get('cookie') || ''

  // Recalculate urgency scores
  try {
    // SECURITY: Use hardcoded base URL, never trust request headers
    const baseUrl = getInternalBaseUrl()
    const apiUrl = `${baseUrl}/api/admin/urgency`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Cookie': cookieHeader, // Forward session cookies
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Recalculation error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Recalculation proxy error:', error)
    return NextResponse.json(
      { error: 'Recalculation failed' },
      { status: 500 }
    )
  }
}
