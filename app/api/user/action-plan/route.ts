/**
 * Action Plan API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles saving user action plans
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { logger } from '@/lib/logger'
import { validateUserIdFromBody, handleApiError } from '@/lib/api/api-utils'

// Mark as dynamic for Next.js static export compatibility
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_POST = 'action-plan.save'

export async function POST(request: NextRequest) {
  try {
    const { userId, plan } = await request.json()

    if (!plan) {
      return NextResponse.json({ success: false, error: 'Missing plan data' }, { status: 400 })
    }

    const validation = validateUserIdFromBody(userId, OPERATION_POST)
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: 'Missing userId' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    const { error } = await supabase
      .from('user_action_plans')
      .upsert({
        user_id: userId,
        plan_data: plan,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (error) {
      logger.error('Supabase error saving action plan', { operation: OPERATION_POST, userId }, error instanceof Error ? error : undefined)

      // Fallback: Try player_profiles if table doesn't exist
      if (error.code === '42P01') {
        const { error: profileError } = await supabase
          .from('player_profiles')
          .update({ last_action_plan: plan, last_activity: new Date().toISOString() })
          .eq('user_id', userId)
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
