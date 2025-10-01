/**
 * Skill Summaries API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles GET/POST for persistent skill summary data with rich contexts
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
 * GET /api/user/skill-summaries?userId=X
 * Fetch all skill summaries for a user
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
      .from('skill_summaries')
      .select('*')
      .eq('user_id', userId)
      .order('last_demonstrated', { ascending: false })

    if (error) {
      console.error('[SkillSummaries API] Error fetching data:', error)
      return NextResponse.json(
        { error: 'Failed to fetch skill summaries' },
        { status: 500 }
      )
    }

    // Transform database format to application format
    const summaries = (data || []).map(row => ({
      skillName: row.skill_name,
      demonstrationCount: row.demonstration_count,
      latestContext: row.latest_context,
      scenesInvolved: row.scenes_involved || [],
      lastDemonstrated: row.last_demonstrated
    }))

    return NextResponse.json({
      success: true,
      summaries
    })
  } catch (error) {
    console.error('[SkillSummaries API] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/user/skill-summaries
 * Upsert skill summary data
 *
 * Body: {
 *   user_id: string,
 *   skill_name: string,
 *   demonstration_count: number,
 *   latest_context: string (100-150 words),
 *   scenes_involved: string[],
 *   last_demonstrated: ISO date string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      user_id,
      skill_name,
      demonstration_count,
      latest_context,
      scenes_involved,
      last_demonstrated
    } = body

    if (!user_id || !skill_name) {
      return NextResponse.json(
        { error: 'Missing user_id or skill_name' },
        { status: 400 }
      )
    }

    // Validate context length (should be 100-150 words)
    if (latest_context) {
      const wordCount = latest_context.split(/\s+/).length
      if (wordCount < 50 || wordCount > 200) {
        console.warn(
          `[SkillSummaries API] Context length warning for ${skill_name}: ${wordCount} words (expected 100-150)`
        )
      }
    }

    const supabase = getServiceClient()

    const { error } = await supabase
      .from('skill_summaries')
      .upsert({
        user_id,
        skill_name,
        demonstration_count: demonstration_count || 0,
        latest_context: latest_context || '',
        scenes_involved: scenes_involved || [],
        last_demonstrated: last_demonstrated || new Date().toISOString()
      }, {
        onConflict: 'user_id,skill_name'
      })

    if (error) {
      console.error('[SkillSummaries API] Error upserting data:', error)
      return NextResponse.json(
        { error: 'Failed to save skill summary' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[SkillSummaries API] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
