/**
 * Skill Demonstrations API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles individual skill demonstration records
 * Provides granular evidence for admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { logger } from '@/lib/logger'
import {
  validateUserIdFromBody,
  supabaseErrorResponse,
  handleApiError
} from '@/lib/api/api-utils'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_POST = 'skill-demonstrations.post'

/**
 * POST /api/user/skill-demonstrations
 * Insert individual skill demonstration record
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, skill_name, scene_id, scene_description, choice_text, context, demonstrated_at } = body

    // Validate required fields
    if (!skill_name || !scene_id) {
      logger.warn('Missing required fields', { operation: OPERATION_POST })
      return NextResponse.json({ error: 'Missing required fields: skill_name, scene_id' }, { status: 400 })
    }

    const validation = validateUserIdFromBody(user_id, OPERATION_POST)
    if (!validation.valid) {
      return validation.response
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

    // PGRST204 = insert succeeded but RLS prevents select
    if (error && error.code !== 'PGRST204') {
      return supabaseErrorResponse(OPERATION_POST, error.code, 'Failed to insert skill demonstration', user_id)
    }

    return NextResponse.json({ success: true, demonstration: data })
  } catch (error) {
    return handleApiError(error, OPERATION_POST, 'POST')
  }
}
