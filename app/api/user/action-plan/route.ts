import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { logger } from '@/lib/logger'
import { validateUserId } from '@/lib/user-id-validation'

export async function POST(request: NextRequest) {
  try {
    const { userId, plan } = await request.json()

    if (!userId || !plan) {
      return NextResponse.json(
        { success: false, error: 'Missing userId or plan data' },
        { status: 400 }
      )
    }

    const validation = validateUserId(userId)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    // Upsert action plan
    // Assuming a table 'action_plans' exists with columns: user_id (PK), plan_data (JSONB), updated_at
    // If not, we can store it in a metadata column of player_profiles or create the table.
    // For robustness, let's store it in a dedicated 'user_action_plans' table if possible, 
    // or fall back to 'player_profiles' metadata if we want to avoid schema changes.
    // Given "Schema First" isn't strictly enforced here, let's try to use a dedicated table 'user_action_plans'
    // which is a standard pattern.

    const supabase = getSupabaseServerClient()

    const { error } = await supabase
      .from('user_action_plans')
      .upsert({
        user_id: userId,
        plan_data: plan,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (error) {
      logger.error('Supabase error saving action plan', {
        operation: 'action-plan.save',
        userId,
        error: error instanceof Error ? error.message : String(error)
      }, error instanceof Error ? error : undefined)
      // Fallback: Try to save to player_profiles metadata if table doesn't exist
      if (error.code === '42P01') { // undefined_table
         const { error: profileError } = await supabase
          .from('player_profiles')
          .update({
            last_action_plan: plan,
            last_activity: new Date().toISOString()
          })
          .eq('user_id', userId)
        
        if (profileError) throw profileError
      } else {
        throw error
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Error saving action plan', {
      operation: 'action-plan.save',
      error: error instanceof Error ? error.message : String(error)
    }, error instanceof Error ? error : undefined)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
