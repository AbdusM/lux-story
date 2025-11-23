/**
 * Pattern Demonstrations API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles individual pattern demonstration records
 * Provides decision-making style analytics for admin dashboard and student insights
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PATTERN_TYPES } from '@/lib/patterns'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Server-side Supabase client with service role (bypasses RLS)
function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    const missing = []
    if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL')
    if (!serviceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY')
    throw new Error(`Missing Supabase environment variables: ${missing.join(', ')}`)
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * POST /api/user/pattern-demonstrations
 * Insert individual pattern demonstration record
 *
 * Body: {
 *   user_id: string,
 *   pattern_name: 'analytical' | 'patience' | 'exploring' | 'helping' | 'building',
 *   choice_id: string,
 *   choice_text: string,
 *   scene_id: string,
 *   character_id: string,
 *   context: string,
 *   demonstrated_at?: ISO date string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      user_id,
      pattern_name,
      choice_id,
      choice_text,
      scene_id,
      character_id,
      context,
      demonstrated_at
    } = body

    console.log('🔵 [API:PatternDemonstrations] POST request:', {
      userId: user_id,
      patternName: pattern_name,
      sceneId: scene_id,
      characterId: character_id
    })

    if (!user_id || !pattern_name || !choice_id) {
      console.error('❌ [API:PatternDemonstrations] Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields: user_id, pattern_name, choice_id' },
        { status: 400 }
      )
    }

    // Validate pattern_name against CHECK constraint
    if (!PATTERN_TYPES.includes(pattern_name)) {
      console.error('❌ [API:PatternDemonstrations] Invalid pattern name:', pattern_name)
      return NextResponse.json(
        { error: `Invalid pattern_name. Must be one of: ${PATTERN_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    const supabase = getServiceClient()

    const { data, error } = await supabase
      .from('pattern_demonstrations')
      .insert({
        user_id,
        pattern_name,
        choice_id,
        choice_text: choice_text || '',
        scene_id: scene_id || '',
        character_id: character_id || '',
        context: context || '',
        demonstrated_at: demonstrated_at || new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('❌ [API:PatternDemonstrations] Supabase error:', {
        code: error.code,
        message: error instanceof Error ? error.message : "Unknown error",
        userId: user_id,
        patternName: pattern_name
      })
      return NextResponse.json(
        { error: 'Failed to insert pattern demonstration', details: error instanceof Error ? error.message : "Unknown error" },
        { status: 500 }
      )
    }

    console.log('✅ [API:PatternDemonstrations] Inserted:', {
      userId: user_id,
      patternName: pattern_name,
      sceneId: scene_id,
      characterId: character_id
    })

    return NextResponse.json({
      success: true,
      demonstration: data
    })
  } catch (error) {
    console.error('[PatternDemonstrations API] Unexpected error:', error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
