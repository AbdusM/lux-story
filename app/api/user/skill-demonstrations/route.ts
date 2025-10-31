/**
 * Skill Demonstrations API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles individual skill demonstration records
 * Provides granular evidence for admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
 * POST /api/user/skill-demonstrations
 * Insert individual skill demonstration record
 *
 * Body: {
 *   user_id: string,
 *   skill_name: string,
 *   scene_id: string,
 *   choice_text: string,
 *   context: string,
 *   demonstrated_at: ISO date string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      user_id,
      skill_name,
      scene_id,
      choice_text,
      context,
      demonstrated_at
    } = body

    console.log('🔵 [API:SkillDemonstrations] POST request:', {
      userId: user_id,
      skillName: skill_name,
      sceneId: scene_id,
      contextLength: context?.length || 0
    })

    if (!user_id || !skill_name || !scene_id) {
      console.error('❌ [API:SkillDemonstrations] Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields: user_id, skill_name, scene_id' },
        { status: 400 }
      )
    }

    const supabase = getServiceClient()

    const { data, error } = await supabase
      .from('skill_demonstrations')
      .insert({
        user_id,
        skill_name,
        scene_id,
        choice_text: choice_text || '',
        context: context || '',
        demonstrated_at: demonstrated_at || new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('❌ [API:SkillDemonstrations] Supabase error:', {
        code: error.code,
        message: error.message,
        userId: user_id,
        skillName: skill_name
      })
      return NextResponse.json(
        { error: 'Failed to insert skill demonstration' },
        { status: 500 }
      )
    }

    console.log('✅ [API:SkillDemonstrations] Inserted:', {
      userId: user_id,
      skillName: skill_name,
      sceneId: scene_id
    })

    return NextResponse.json({
      success: true,
      demonstration: data
    })
  } catch (error: any) {
    console.error('[SkillDemonstrations API] Unexpected error:', error)
    const errorMessage = error?.message || 'Internal server error'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
