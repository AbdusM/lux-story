/**
 * Career Analytics API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles GET/POST for persistent career analytics data
 * Supabase-primary architecture: Database is source of truth
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Server-side Supabase client with service role (bypasses RLS)
function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * GET /api/user/career-analytics?userId=X
 * Fetch career analytics for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }

    const supabase = getServiceClient()

    const { data, error } = await supabase
      .from('career_analytics')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      // If no data exists, return exists: false (not an error)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ exists: false })
      }

      console.error('[CareerAnalytics API] Error fetching data:', error)
      return NextResponse.json(
        { error: 'Failed to fetch career analytics' },
        { status: 500 }
      )
    }

    // Transform database format to application format
    return NextResponse.json({
      exists: true,
      analytics: {
        platformsExplored: data.platforms_explored || [],
        careerInterests: data.career_interests || [],
        choicesMade: data.choices_made || 0,
        timeSpent: data.time_spent_seconds || 0,
        sectionsViewed: data.sections_viewed || [],
        birminghamOpportunities: data.birmingham_opportunities || [],
        lastUpdated: data.last_updated
      }
    })
  } catch (error) {
    console.error('[CareerAnalytics API] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/user/career-analytics
 * Upsert career analytics data
 *
 * Body: {
 *   user_id: string,
 *   platforms_explored: string[],
 *   career_interests: string[],
 *   choices_made: number,
 *   time_spent_seconds: number,
 *   sections_viewed: string[],
 *   birmingham_opportunities: string[]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      user_id,
      platforms_explored,
      career_interests,
      choices_made,
      time_spent_seconds,
      sections_viewed,
      birmingham_opportunities
    } = body

    if (!user_id) {
      return NextResponse.json(
        { error: 'Missing user_id' },
        { status: 400 }
      )
    }

    const supabase = getServiceClient()

    const { error } = await supabase
      .from('career_analytics')
      .upsert({
        user_id,
        platforms_explored: platforms_explored || [],
        career_interests: career_interests || [],
        choices_made: choices_made || 0,
        time_spent_seconds: time_spent_seconds || 0,
        sections_viewed: sections_viewed || [],
        birmingham_opportunities: birmingham_opportunities || [],
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (error) {
      console.error('[CareerAnalytics API] Error upserting data:', error)
      return NextResponse.json(
        { error: 'Failed to save career analytics' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[CareerAnalytics API] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
