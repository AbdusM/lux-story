/**
 * Skill Demonstrations API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles individual skill demonstration records
 * Provides granular evidence for admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { readJsonBody } from '@/lib/api/request-body'
import {
  supabaseErrorResponse,
  handleApiError
} from '@/lib/api/api-utils'
import { ensureProvidedUserIdMatchesSession, requireUserSession } from '@/lib/api/user-session'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_POST = 'skill-demonstrations.post'

const MAX_BODY_BYTES = 16_384

// Rate limiter: 60 writes per minute (skill demos can be frequent)
const writeLimiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 500 })

/**
 * POST /api/user/skill-demonstrations
 * Insert individual skill demonstration record
 */
export async function POST(request: NextRequest) {
  try {
    const session = requireUserSession(request)
    if (!session.ok) return session.response

    // Rate limiting
    const ip = getClientIp(request)
    try {
      await writeLimiter.check(ip, 60)
    } catch {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const parsed = await readJsonBody(request, { maxBytes: MAX_BODY_BYTES })
    if (!parsed.ok) return parsed.response
    const body = parsed.body as Record<string, unknown>
    const { user_id, skill_name, scene_id, scene_description, choice_text, context, demonstrated_at } = body

    // Validate required fields
    if (!skill_name || !scene_id) {
      logger.warn('Missing required fields', { operation: OPERATION_POST })
      return NextResponse.json({ error: 'Missing required fields: skill_name, scene_id' }, { status: 400 })
    }

    const mismatch = ensureProvidedUserIdMatchesSession({
      provided: user_id,
      sessionUserId: session.userId,
      fieldName: 'user_id',
    })
    if (mismatch) return mismatch

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('skill_demonstrations')
      .insert({
        user_id: session.userId,
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
      return supabaseErrorResponse(OPERATION_POST, error.code, 'Failed to insert skill demonstration', session.userId)
    }

    return NextResponse.json({ success: true, demonstration: data })
  } catch (error) {
    return handleApiError(error, OPERATION_POST, 'POST')
  }
}
