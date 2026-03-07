import path from 'node:path'

import { config as loadEnv } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

import { buildAdminGuidanceDiagnostics, GUIDANCE_DIAGNOSTIC_EVENT_TYPES } from '@/lib/guidance/admin-diagnostics'
import { buildAdminGuidanceCohortSummary } from '@/lib/guidance/cohort-summary'
import { loadGuidancePlanRowsFromDb, loadGuidanceStateForUser, persistGuidanceStateForUser } from '@/lib/guidance/db-store'
import {
  buildGuidanceValidationSeed,
  GUIDANCE_VALIDATION_USER_ID,
} from '@/lib/guidance/live-validation'
import { getAdaptiveGuidanceRolloutConfig } from '@/lib/guidance/rollout'
import { mergePlanWithGuidanceRecord } from '@/lib/guidance/storage'

type SupabaseClient = ReturnType<typeof createClient>

function fail(message: string): never {
  // eslint-disable-next-line no-console
  console.error(`[validate-live-guidance] ${message}`)
  process.exit(1)
}

async function clearValidationRows(supabase: SupabaseClient, userId: string): Promise<void> {
  const { error: eventDeleteError } = await supabase
    .from('interaction_events')
    .delete()
    .eq('user_id', userId)

  if (eventDeleteError) throw eventDeleteError

  const { error: taskDeleteError } = await supabase
    .from('guidance_task_progress')
    .delete()
    .eq('user_id', userId)

  if (taskDeleteError) throw taskDeleteError

  const { error: snapshotDeleteError } = await supabase
    .from('guidance_trajectory_snapshots')
    .delete()
    .eq('user_id', userId)

  if (snapshotDeleteError) throw snapshotDeleteError
}

async function ensureValidationProfile(
  supabase: SupabaseClient,
  profile: ReturnType<typeof buildGuidanceValidationSeed>['playerProfile'],
): Promise<void> {
  const { error } = await supabase
    .from('player_profiles')
    .upsert(profile, { onConflict: 'user_id' })

  if (error) throw error
}

async function loadGuidanceInteractionEvents(
  supabase: SupabaseClient,
  userId: string,
): Promise<Array<{
  event_type: string
  occurred_at: string | null
  payload: unknown
}>> {
  const { data, error } = await supabase
    .from('interaction_events')
    .select('event_type, occurred_at, payload')
    .eq('user_id', userId)
    .in('event_type', [...GUIDANCE_DIAGNOSTIC_EVENT_TYPES])
    .order('occurred_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Array<{
    event_type: string
    occurred_at: string | null
    payload: unknown
  }>
}

function assertCondition(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(message)
  }
}

async function main(): Promise<void> {
  loadEnv({ path: path.resolve(process.cwd(), '.env.local') })

  const userIdArg = process.argv.find((arg) => arg.startsWith('--user-id='))
  const userId = userIdArg?.split('=')[1] || GUIDANCE_VALIDATION_USER_ID
  const nowIso = new Date().toISOString()

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) fail('Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL')
  if (!serviceRoleKey) fail('Missing SUPABASE_SERVICE_ROLE_KEY')

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const seed = buildGuidanceValidationSeed({ userId, nowIso })

  await ensureValidationProfile(supabase, seed.playerProfile)
  await clearValidationRows(supabase, userId)

  await persistGuidanceStateForUser({
    supabase,
    userId,
    state: {
      record: seed.record,
      snapshot: seed.snapshot,
    },
    existingTaskIds: [],
  })

  const { error: interactionInsertError } = await supabase
    .from('interaction_events')
    .insert(seed.interactionEvents)

  if (interactionInsertError) throw interactionInsertError

  const guidanceState = await loadGuidanceStateForUser(supabase, userId)
  assertCondition(!guidanceState.missingTables, 'Dedicated guidance tables are unexpectedly missing')
  assertCondition(guidanceState.state?.snapshot, 'No guidance snapshot was loaded back from the database')

  const loadedRecord = guidanceState.state!.record
  const loadedSnapshot = guidanceState.state!.snapshot!
  const diagnostics = buildAdminGuidanceDiagnostics({
    plan: mergePlanWithGuidanceRecord({}, loadedRecord, loadedSnapshot),
    interactionEvents: await loadGuidanceInteractionEvents(supabase, userId),
  })

  const guidancePlanRows = await loadGuidancePlanRowsFromDb(supabase, 200)
  assertCondition(!guidancePlanRows.missingTables, 'Cohort summary fell back because guidance tables were not readable')

  const cohortInteractionEvents = await supabase
    .from('interaction_events')
    .select('user_id, event_type, occurred_at, payload')
    .in('event_type', [...GUIDANCE_DIAGNOSTIC_EVENT_TYPES])
    .gte('occurred_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('occurred_at', { ascending: false })
    .limit(5000)

  if (cohortInteractionEvents.error) throw cohortInteractionEvents.error

  const cohortSummary = buildAdminGuidanceCohortSummary({
    planRows: guidancePlanRows.planRows,
    interactionEvents: (cohortInteractionEvents.data ?? []) as Array<{
      user_id: string
      event_type: string
      occurred_at: string | null
      payload: unknown
    }>,
    days: 30,
    userLimit: 200,
    rolloutConfig: getAdaptiveGuidanceRolloutConfig(),
    includeInternalUsers: true,
  })

  assertCondition(
    diagnostics.completedTasks.some((task) => seed.expected.completedTaskIds.includes(task.taskId)),
    'Completed task did not appear in admin diagnostics',
  )
  assertCondition(
    diagnostics.stalledTasks.some((task) => seed.expected.stalledTaskIds.includes(task.taskId)),
    'Stalled task did not appear in admin diagnostics',
  )
  assertCondition(
    diagnostics.shadowArtifactCount >= seed.expected.shadowArtifactCount,
    'Shadow artifact count was lower than expected',
  )
  assertCondition(
    diagnostics.eventCounts.taskCompleted >= seed.expected.eventCounts.taskCompleted,
    'Task completion event count did not persist',
  )
  assertCondition(
    diagnostics.eventCounts.recommendationShown >= seed.expected.eventCounts.recommendationShown,
    'Recommendation shown event count did not persist',
  )
  assertCondition(
    cohortSummary.totals.usersWithGuidance >= 1,
    'Cohort summary did not include any guidance users',
  )
  assertCondition(
    cohortSummary.cohorts.some((cohort) => cohort.cohort === 'adaptive' && cohort.userCount >= 1),
    'Cohort summary did not include the adaptive validation user',
  )

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({
    validationUserId: userId,
    seededAt: nowIso,
    rolloutConfig: getAdaptiveGuidanceRolloutConfig(),
    rolloutPrep: {
      recommendedModeEnv: 'NEXT_PUBLIC_FF_ADAPTIVE_GUIDANCE_V1_MODE=experiment',
      recommendedRolloutEnv: 'NEXT_PUBLIC_FF_ADAPTIVE_GUIDANCE_V1_ROLLOUT=10',
      killSwitchEnv: 'NEXT_PUBLIC_FF_ADAPTIVE_GUIDANCE_V1_MODE=off',
    },
    loadedState: {
      experimentVariant: loadedRecord.experimentVariant,
      assignmentVersion: loadedRecord.assignmentVersion,
      taskIds: Object.keys(loadedRecord.taskProgress),
      nextBestMoveTaskId: loadedSnapshot.nextBestMove?.taskId ?? null,
      shadowArtifactCount: loadedSnapshot.shadowArtifacts.length,
      frictionFlags: loadedSnapshot.frictionFlags,
    },
    diagnostics: {
      completedTaskIds: diagnostics.completedTasks.map((task) => task.taskId),
      stalledTaskIds: diagnostics.stalledTasks.map((task) => task.taskId),
      eventCounts: diagnostics.eventCounts,
      currentRecommendationTaskId: diagnostics.currentRecommendation?.taskId ?? null,
    },
    cohortSummary: {
      totals: cohortSummary.totals,
      adaptiveCohort: cohortSummary.cohorts.find((cohort) => cohort.cohort === 'adaptive') ?? null,
      rollout: cohortSummary.rollout,
    },
  }, null, 2))
}

void main().catch((error) => fail(error instanceof Error ? error.message : String(error)))
