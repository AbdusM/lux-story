/**
 * Action Plan API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles saving user action plans
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { logger } from '@/lib/logger'
import { handleApiError } from '@/lib/api/api-utils'
import { readJsonBody } from '@/lib/api/request-body'
import { ensureProvidedUserIdMatchesSession, requireUserSession } from '@/lib/api/user-session'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_POST = 'action-plan.save'

export async function POST(request: NextRequest) {
  try {
    const session = requireUserSession(request)
    if (!session.ok) return session.response

    const parsed = await readJsonBody(request, { maxBytes: 32_768 })
    if (!parsed.ok) return parsed.response
    const { userId, plan } = parsed.body as { userId?: unknown; plan?: unknown }

    if (!plan) {
      return NextResponse.json({ success: false, error: 'Missing plan data' }, { status: 400 })
    }

    const mismatch = ensureProvidedUserIdMatchesSession({
      provided: userId,
      sessionUserId: session.userId,
      fieldName: 'userId',
    })
    if (mismatch) return mismatch

    const supabase = getSupabaseServerClient()

    const { error } = await supabase
      .from('user_action_plans')
      .upsert({
        user_id: session.userId,
        plan_data: plan,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (error) {
      logger.error('Supabase error saving action plan', { operation: OPERATION_POST, userId: session.userId }, error instanceof Error ? error : undefined)

      // Fallback: Try player_profiles if table doesn't exist
      if (error.code === '42P01') {
        const { error: profileError } = await supabase
          .from('player_profiles')
          .update({ last_action_plan: plan, last_activity: new Date().toISOString() })
          .eq('user_id', session.userId)
        if (profileError) throw profileError
      } else {
        throw error
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return handleApiError(error, OPERATION_POST, 'POST')
  }
}
