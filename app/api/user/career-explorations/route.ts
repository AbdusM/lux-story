/**
 * Career Explorations API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles POST for creating career exploration records
 * Converts user interaction data into career explorations
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Rate limiter: 30 requests per minute per IP
const postLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

// Server-side Supabase client with service role (bypasses RLS)
function getServiceClient() {
  // SECURITY: Use server-side variables only, never NEXT_PUBLIC_
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[Security] Missing server-side Supabase environment variables')
    throw new Error('Database configuration incomplete')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * POST /api/user/career-explorations
 * Create or update career exploration records
 *
 * Body: {
 *   user_id: string,
 *   career_name: string,
 *   match_score: number,
 *   readiness_level: string,
 *   local_opportunities: string[],
 *   education_paths: string[],
 *   evidence: {
 *     skill_demonstrations: string[],
 *     character_interactions: string[],
 *     scene_choices: string[],
 *     time_invested: number
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request)
    try {
      await postLimiter.check(ip, 30) // 30 requests per minute
    } catch {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()

    const {
      user_id,
      career_name,
      match_score,
      readiness_level,
      local_opportunities,
      education_paths,
      evidence
    } = body

    console.log('🔵 [API:CareerExplorations] POST request:', {
      userId: user_id,
      careerName: career_name,
      matchScore: match_score,
      readinessLevel: readiness_level
    })

    if (!user_id || !career_name) {
      console.error('❌ [API:CareerExplorations] Missing required fields')
      return NextResponse.json(
        { error: 'Missing user_id or career_name' },
        { status: 400 }
      )
    }

    const supabase = getServiceClient()

    // Upsert career exploration record
    const { data, error } = await supabase
      .from('career_explorations')
      .upsert({
        user_id,
        career_name,
        match_score: match_score || 0.5,
        readiness_level: readiness_level || 'exploratory',
        local_opportunities: local_opportunities || [],
        education_paths: education_paths || [],
        explored_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,career_name'
      })
      .select()

    if (error) {
      console.error('❌ [API:CareerExplorations] Supabase upsert error:', {
        code: error.code,
        message: error.message,
        userId: user_id,
        careerName: career_name
      })
      return NextResponse.json(
        { error: 'Failed to save career exploration' },
        { status: 500 }
      )
    }

    console.log('✅ [API:CareerExplorations] Upsert successful:', {
      userId: user_id,
      careerName: career_name,
      matchScore: match_score
    })

    return NextResponse.json({ 
      success: true, 
      careerExploration: data?.[0] 
    })
  } catch (error) {
    console.error('[CareerExplorations API] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/user/career-explorations?userId=X
 * Fetch career explorations for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    console.log('🔵 [API:CareerExplorations] GET request:', { userId })

    if (!userId) {
      console.error('❌ [API:CareerExplorations] Missing userId parameter')
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }

    const supabase = getServiceClient()

    const { data, error } = await supabase
      .from('career_explorations')
      .select('*')
      .eq('user_id', userId)
      .order('match_score', { ascending: false })

    if (error) {
      console.error('❌ [API:CareerExplorations] Supabase error:', {
        code: error.code,
        message: error.message,
        userId
      })
      return NextResponse.json(
        { error: 'Failed to fetch career explorations' },
        { status: 500 }
      )
    }

    console.log('✅ [API:CareerExplorations] Retrieved explorations:', {
      userId,
      count: data?.length || 0
    })

    return NextResponse.json({
      success: true,
      careerExplorations: data || []
    })
  } catch (error) {
    console.error('[CareerExplorations API] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
