import { NextRequest, NextResponse } from 'next/server'

/**
 * Server-side proxy for urgency API
 * Protects ADMIN_API_TOKEN from client bundle exposure
 *
 * Security: Only accessible to authenticated admin users
 */

// Simple auth helper to verify admin cookie
function requireAdminAuth(request: NextRequest): NextResponse | null {
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

export async function GET(request: NextRequest) {
  // Authentication check - verify admin cookie
  const authError = requireAdminAuth(request)
  if (authError) return authError
  // Extract query parameters
  const { searchParams } = new URL(request.url)
  const level = searchParams.get('level') || 'all'
  const limit = searchParams.get('limit') || '50'
  const userId = searchParams.get('userId') // Single user lookup

  // Single user lookup - optimized path
  if (userId) {
    try {
      const adminToken = process.env.ADMIN_API_TOKEN
      if (!adminToken) {
        return NextResponse.json(
          { error: 'Admin API not configured' },
          { status: 500 }
        )
      }

      // Query urgency API for single user
      const protocol = request.headers.get('x-forwarded-proto') || 'http'
      const host = request.headers.get('host') || 'localhost:3003'
      const apiUrl = `${protocol}://${host}/api/admin/urgency?userId=${encodeURIComponent(userId)}`

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({ user: data.user || data })
      } else {
        // If API fails, return null user (don't try localStorage in server context)
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
  const adminToken = process.env.ADMIN_API_TOKEN

  if (!adminToken) {
    return NextResponse.json(
      { error: 'Admin API not configured' },
      { status: 500 }
    )
  }

  // Forward request to actual urgency API with server-side token
  try {
    // Dynamic host detection - works in dev (localhost) and prod (Vercel)
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const host = request.headers.get('host') || 'localhost:3003'
    const apiUrl = `${protocol}://${host}/api/admin/urgency?level=${level}&limit=${limit}`

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
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
  // Authentication check - verify admin cookie
  const authError = requireAdminAuth(request)
  if (authError) return authError

  // Recalculate urgency scores
  const adminToken = process.env.ADMIN_API_TOKEN

  if (!adminToken) {
    return NextResponse.json(
      { error: 'Admin API not configured' },
      { status: 500 }
    )
  }

  try {
    // Dynamic host detection - works in dev (localhost) and prod (Vercel)
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const host = request.headers.get('host') || 'localhost:3003'
    const apiUrl = `${protocol}://${host}/api/admin/urgency`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
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
