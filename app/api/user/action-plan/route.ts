/**
 * Action Plan API Endpoint
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Handles reading and saving user action plans.
 */

import { NextRequest, NextResponse } from 'next/server'

import { handleApiError } from '@/lib/api/api-utils'
import { readJsonBody } from '@/lib/api/request-body'
import { ensureProvidedUserIdMatchesSession, requireUserSession } from '@/lib/api/user-session'
import { loadGuidanceStateForUser, persistGuidanceStateForUser } from '@/lib/guidance/db-store'
import {
  extractRemoteGuidanceRecord,
  extractRemoteGuidanceSnapshot,
  mergePlanWithGuidanceRecord,
  stripGuidanceFromPlan,
} from '@/lib/guidance/storage'
import { logger } from '@/lib/logger'
import { getSupabaseServerClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const OPERATION_GET = 'action-plan.get'
const OPERATION_POST = 'action-plan.save'

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

async function loadExistingPlan(
  userId: string,
): Promise<{ plan: Record<string, unknown> | null; missingTable: boolean }> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from('user_action_plans')
    .select('plan_data')
    .eq('user_id', userId)
    .maybeSingle()

  if (!error) {
    return {
      plan: isPlainObject(data?.plan_data) ? data.plan_data : null,
      missingTable: false,
    }
  }

  if (error.code === '42P01') {
    const { data: profileData, error: profileError } = await supabase
      .from('player_profiles')
      .select('last_action_plan')
      .eq('user_id', userId)
      .maybeSingle()

    if (profileError) throw profileError

    return {
      plan: isPlainObject(profileData?.last_action_plan) ? profileData.last_action_plan : null,
      missingTable: true,
    }
  }

  if (error.code === 'PGRST116') {
    return { plan: null, missingTable: false }
  }

  throw error
}

export async function GET(request: NextRequest) {
  try {
    const session = requireUserSession(request)
    if (!session.ok) return session.response

    const requestedUserId = request.nextUrl.searchParams.get('userId')
    const mismatch = ensureProvidedUserIdMatchesSession({
      provided: requestedUserId,
      sessionUserId: session.userId,
      fieldName: 'userId',
    })
    if (mismatch) return mismatch

    const supabase = getSupabaseServerClient()
    const [existing, guidanceStateResult] = await Promise.all([
      loadExistingPlan(session.userId),
      loadGuidanceStateForUser(supabase, session.userId),
    ])

    const basePlan = existing.plan
      ? stripGuidanceFromPlan(existing.plan)
      : null
    const mergedPlan = guidanceStateResult.missingTables || !guidanceStateResult.state
      ? existing.plan
      : mergePlanWithGuidanceRecord(
          basePlan,
          guidanceStateResult.state.record,
          guidanceStateResult.state.snapshot ?? undefined,
        )

    return NextResponse.json({ success: true, plan: mergedPlan })
  } catch (error) {
    return handleApiError(error, OPERATION_GET, 'GET')
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = requireUserSession(request)
    if (!session.ok) return session.response

    const parsed = await readJsonBody(request, { maxBytes: 32_768 })
    if (!parsed.ok) return parsed.response
    const { userId, plan } = parsed.body as { userId?: unknown; plan?: unknown }

    if (!isPlainObject(plan)) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid plan data' },
        { status: 400 },
      )
    }

    const mismatch = ensureProvidedUserIdMatchesSession({
      provided: userId,
      sessionUserId: session.userId,
      fieldName: 'userId',
    })
    if (mismatch) return mismatch

    const supabase = getSupabaseServerClient()
    const [existing, existingGuidanceState] = await Promise.all([
      loadExistingPlan(session.userId),
      loadGuidanceStateForUser(supabase, session.userId),
    ])

    const incomingGuidanceRecord = extractRemoteGuidanceRecord(plan)
    const incomingGuidanceSnapshot = extractRemoteGuidanceSnapshot(plan)
    const legacyStoredGuidanceRecord = extractRemoteGuidanceRecord(existing.plan)
    const legacyStoredGuidanceSnapshot = extractRemoteGuidanceSnapshot(existing.plan)
    const guidanceRecordToPersist = incomingGuidanceRecord ?? legacyStoredGuidanceRecord
    const guidanceSnapshotToPersist =
      incomingGuidanceSnapshot ?? legacyStoredGuidanceSnapshot
    const mergedPlan = {
      ...stripGuidanceFromPlan(existing.plan),
      ...stripGuidanceFromPlan(plan),
    }

    if (
      !existingGuidanceState.missingTables &&
      guidanceRecordToPersist &&
      guidanceSnapshotToPersist
    ) {
      await persistGuidanceStateForUser({
        supabase,
        userId: session.userId,
        state: {
          record: guidanceRecordToPersist,
          snapshot: guidanceSnapshotToPersist,
        },
        existingTaskIds: Object.keys(
          existingGuidanceState.state?.record.taskProgress ?? {},
        ),
      })
    }

    const responsePlan = guidanceRecordToPersist
      ? mergePlanWithGuidanceRecord(
          mergedPlan,
          guidanceRecordToPersist,
          guidanceSnapshotToPersist ?? undefined,
        )
      : mergedPlan
    const storagePlan = existingGuidanceState.missingTables
      ? responsePlan
      : mergedPlan

    if (existing.missingTable) {
      const { error } = await supabase
        .from('player_profiles')
        .update({ last_action_plan: storagePlan, last_activity: new Date().toISOString() })
        .eq('user_id', session.userId)

      if (error) {
        logger.error(
          'Supabase error saving fallback action plan',
          { operation: OPERATION_POST, userId: session.userId },
          error instanceof Error ? error : undefined,
        )
        throw error
      }
    } else {
      const { error } = await supabase
        .from('user_action_plans')
        .upsert(
          {
            user_id: session.userId,
            plan_data: storagePlan,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' },
        )

      if (error) {
        logger.error(
          'Supabase error saving action plan',
          { operation: OPERATION_POST, userId: session.userId },
          error instanceof Error ? error : undefined,
        )
        throw error
      }
    }

    return NextResponse.json({ success: true, plan: responsePlan })
  } catch (error) {
    return handleApiError(error, OPERATION_POST, 'POST')
  }
}
