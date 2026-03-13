import type { SupabaseClient } from '@supabase/supabase-js'

import type { ActionPlanFollowUp } from '@/lib/action-plan/follow-up-status'

const FOLLOW_UP_EVENTS_TABLE = 'action_plan_follow_up_events'

type FollowUpEventRow = {
  user_id: string
  status: ActionPlanFollowUp['status']
  note: string | null
  updated_by_user_id: string | null
  updated_by_email: string | null
  updated_by_full_name: string | null
  created_at: string
}

export async function loadFollowUpEventsForUser(params: {
  supabase: SupabaseClient
  userId: string
  limit?: number
}): Promise<{ events: ActionPlanFollowUp[]; missingTable: boolean }> {
  const { data, error } = await params.supabase
    .from(FOLLOW_UP_EVENTS_TABLE)
    .select(`
      user_id,
      status,
      note,
      updated_by_user_id,
      updated_by_email,
      updated_by_full_name,
      created_at
    `)
    .eq('user_id', params.userId)
    .order('created_at', { ascending: false })
    .limit(params.limit ?? 50)

  if (!error) {
    return {
      events: ((data ?? []) as FollowUpEventRow[]).map((row) => ({
        status: row.status,
        updatedAt: row.created_at,
        ...(row.note ? { note: row.note } : {}),
        updatedBy: {
          userId: row.updated_by_user_id ?? 'unknown_admin',
          email: row.updated_by_email,
          fullName: row.updated_by_full_name,
        },
      })),
      missingTable: false,
    }
  }

  if (error.code === '42P01') {
    return { events: [], missingTable: true }
  }

  throw error
}

export async function insertFollowUpEvent(params: {
  supabase: SupabaseClient
  userId: string
  followUp: ActionPlanFollowUp
}): Promise<{ persisted: boolean; missingTable: boolean }> {
  const payload: FollowUpEventRow = {
    user_id: params.userId,
    status: params.followUp.status,
    note: typeof params.followUp.note === 'string' ? params.followUp.note : null,
    updated_by_user_id: params.followUp.updatedBy?.userId ?? null,
    updated_by_email: params.followUp.updatedBy?.email ?? null,
    updated_by_full_name: params.followUp.updatedBy?.fullName ?? null,
    created_at: params.followUp.updatedAt,
  }

  const { error } = await params.supabase
    .from(FOLLOW_UP_EVENTS_TABLE)
    .insert(payload)

  if (!error) {
    return { persisted: true, missingTable: false }
  }

  if (error.code === '42P01') {
    return { persisted: false, missingTable: true }
  }

  throw error
}
