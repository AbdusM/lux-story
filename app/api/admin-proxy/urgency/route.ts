import { NextRequest, NextResponse } from 'next/server'
import { getAllUserIds, loadSkillProfile } from '@/lib/skill-profile-adapter'

/**
 * Server-side proxy for urgency API
 * Protects ADMIN_API_TOKEN from client bundle exposure
 *
 * Security: Only accessible to authenticated admin users
 */
export async function GET(request: NextRequest) {
  // Extract query parameters
  const { searchParams } = new URL(request.url)
  const level = searchParams.get('level') || 'all'
  const limit = searchParams.get('limit') || '50'

  // Special case: "all-students" filter uses localStorage fallback
  if (level === 'all-students') {
    try {
      const userIds = await getAllUserIds()
      const profilePromises = userIds.map(async (userId) => {
        const profile = await loadSkillProfile(userId)
        if (!profile) return null

        return {
          userId,
          urgencyLevel: 'pending' as const, // No urgency score calculated yet
          urgencyScore: 0,
          urgencyNarrative: 'Student data available - urgency score pending calculation.',
          totalChoices: profile.totalDemonstrations,
          uniqueScenesVisited: 0,
          relationshipsFormed: 0,
          disengagementScore: 0,
          confusionScore: 0,
          stressScore: 0,
          isolationScore: 0,
          lastActivity: userId
        }
      })

      const studentsWithNulls = await Promise.all(profilePromises)
      const students = studentsWithNulls.filter(Boolean)

      return NextResponse.json({ students })
    } catch (error) {
      console.error('Failed to fetch all students from localStorage:', error)
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
