import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { userId, plan } = await request.json()

    if (!userId || !plan) {
      return NextResponse.json(
        { success: false, error: 'Missing userId or plan data' },
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

    const { error } = await supabase
      .from('user_action_plans')
      .upsert({
        user_id: userId,
        plan_data: plan,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (error) {
      console.error('Supabase error saving action plan:', error)
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
    console.error('Error saving action plan:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
