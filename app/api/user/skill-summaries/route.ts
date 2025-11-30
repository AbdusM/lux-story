/**
 * Skill Summaries API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles GET/POST for persistent skill summary data with rich contexts
 * Supabase-primary architecture: Database is source of truth
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { validateUserId } from '@/lib/user-id-validation'
import { logger } from '@/lib/logger'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Ensure player profile exists before inserting related records
 * Prevents foreign key violations (error 23503)
 */
async function ensurePlayerProfile(userId: string) {
  try {
    const supabase = getSupabaseServerClient()

    const { error } = await supabase
      .from('player_profiles')
      .upsert({
        user_id: userId,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: true
      })

    if (error) {
      logger.warn('Failed to ensure player profile', {
        operation: 'skill-summaries.ensure-profile',
        userId,
        error: error instanceof Error ? error.message : String(error)
      })
    } else {
      logger.debug('Player profile ensured', {
        operation: 'skill-summaries.ensure-profile',
        userId
      })
    }
  } catch (error) {
    logger.error('ensurePlayerProfile error', {
      operation: 'skill-summaries.ensure-profile'
    }, error instanceof Error ? error : undefined)
  }
}

/**
 * GET /api/user/skill-summaries?userId=X
 * Fetch all skill summaries for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    logger.debug('Skill summaries GET request', { operation: 'skill-summaries.get', userId: userId ?? undefined })

    if (!userId) {
      logger.warn('Missing userId parameter', { operation: 'skill-summaries.get' })
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }

    const validation = validateUserId(userId)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('skill_summaries')
      .select('*')
      .eq('user_id', userId)
      .order('last_demonstrated', { ascending: false })

    if (error) {
      logger.error('Supabase error fetching skill summaries', {
        operation: 'skill-summaries.get',
        errorCode: error.code,
        userId
      }, error instanceof Error ? error : undefined)
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

    logger.debug('Retrieved skill summaries', {
      operation: 'skill-summaries.get',
      userId,
      count: summaries.length
    })

    return NextResponse.json({
      success: true,
      summaries
    })
  } catch (error) {
    logger.error('Unexpected error in skill summaries GET', {
      operation: 'skill-summaries.get'
    }, error instanceof Error ? error : undefined)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    
    // If it's a missing env var error, return empty data gracefully
    if (errorMessage.includes('Missing Supabase environment variables')) {
      logger.warn('Missing Supabase config - returning empty data', {
        operation: 'skill-summaries.get'
      })
      return NextResponse.json({
        success: true,
        summaries: []
      })
    }
    
    return NextResponse.json(
      { error: errorMessage },
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

    logger.debug('Skill summaries POST request', {
      operation: 'skill-summaries.post',
      userId: user_id,
      skillName: skill_name
    })

    if (!user_id || !skill_name) {
      logger.warn('Missing required fields', { operation: 'skill-summaries.post' })
      return NextResponse.json(
        { error: 'Missing user_id or skill_name' },
        { status: 400 }
      )
    }

    const validation = validateUserId(user_id)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Validate context length (should be 100-150 words)
    if (latest_context) {
      const wordCount = latest_context.split(/\s+/).length
      if (wordCount < 50 || wordCount > 200) {
        console.warn('⚠️ [API:SkillSummaries] Context length warning:', {
          skillName: skill_name,
          wordCount,
          expected: '100-150 words'
        })
      }
    }

    // Ensure player profile exists BEFORE attempting to insert skill summary
    // This prevents foreign key violations (error 23503)
    await ensurePlayerProfile(user_id)

    const supabase = getSupabaseServerClient()

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
      logger.error('Supabase upsert error', {
        operation: 'skill-summaries.post',
        errorCode: error.code,
        userId: user_id,
        skillName: skill_name
      }, error instanceof Error ? error : undefined)
      return NextResponse.json(
        { error: 'Failed to save skill summary' },
        { status: 500 }
      )
    }

    logger.debug('Skill summary upsert successful', {
      operation: 'skill-summaries.post',
      userId: user_id,
      skillName: skill_name
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Unexpected error in skill summaries POST', {
      operation: 'skill-summaries.post'
    }, error instanceof Error ? error : undefined)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    
    // If it's a missing env var error, return success but log warning
    if (errorMessage.includes('Missing Supabase environment variables')) {
      logger.warn('Missing Supabase config - operation skipped', {
        operation: 'skill-summaries.post'
      })
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
