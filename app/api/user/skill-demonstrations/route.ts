/**
 * Skill Demonstrations API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles individual skill demonstration records
 * Provides granular evidence for admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/user/skill-demonstrations
 * Insert individual skill demonstration record
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, skill_name, scene_id, scene_description, choice_text, context, demonstrated_at } = body

    // Simple validation - this is an internal API called by our code
    if (!user_id || !skill_name || !scene_id) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, skill_name, scene_id' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('skill_demonstrations')
      .insert({
        user_id,
        skill_name,
        scene_id,
        scene_description: scene_description || null,
        choice_text: choice_text || '',
        context: context || '',
        demonstrated_at: demonstrated_at || new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('[API:SkillDemonstrations] Supabase error:', {
        code: error.code,
        message: error instanceof Error ? error.message : "Unknown error"
      })
      return NextResponse.json(
        { error: 'Failed to insert skill demonstration' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      demonstration: data
    })
  } catch (error) {
    console.error('[SkillDemonstrations API] Unexpected error:', error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
