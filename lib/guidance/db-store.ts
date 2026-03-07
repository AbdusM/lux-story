import type { SupabaseClient } from '@supabase/supabase-js'

import {
  GUIDANCE_ONTOLOGY_VERSION,
  GUIDANCE_RECOMMENDATION_VERSION,
  GUIDANCE_SCHEMA_VERSION,
  GuidanceSnapshotSchema,
  type GuidancePersistenceRecord,
  type GuidanceSnapshot,
  type GuidanceTaskProgress,
} from '@/lib/guidance/contracts'
import { GUIDANCE_ASSIGNMENT_VERSION } from '@/lib/guidance/rollout'
import { mergePlanWithGuidanceRecord } from '@/lib/guidance/storage'
import { GUIDANCE_TASK_MAP } from '@/lib/guidance/task-registry'

type GuidanceTaskProgressRow = {
  user_id: string
  task_id: string
  capability_id: string
  highest_progress_state: GuidanceTaskProgress['highestProgressState']
  latest_assist_mode: GuidanceTaskProgress['latestAssistMode']
  attempt_count: number
  abandon_count: number
  completion_count: number
  evidence_count: number
  last_touched_at: string
  last_completed_at: string | null
  last_dismissed_at: string | null
  updated_at: string
}

type GuidanceTrajectorySnapshotRow = {
  user_id: string
  schema_version: string
  ontology_version: string
  recommendation_version: string
  assignment_version: string | null
  experiment_variant: GuidancePersistenceRecord['experimentVariant']
  dimensions: unknown
  next_best_move: unknown
  missed_doors: unknown
  shadow_artifacts: unknown
  reachable_task_ids: unknown
  friction_flags: unknown
  updated_at: string
}

export type GuidanceDbState = {
  record: GuidancePersistenceRecord
  snapshot: GuidanceSnapshot | null
}

type GuidancePlanRow = {
  user_id: string
  plan_data: Record<string, unknown>
}

function normalizeIso(value: string | null | undefined, fallback?: string): string | null {
  if (!value) return fallback ?? null

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return fallback ?? null
  return parsed.toISOString()
}

function buildSnapshotFromRow(
  row: GuidanceTrajectorySnapshotRow | null,
): GuidanceSnapshot | null {
  if (!row) return null

  const result = GuidanceSnapshotSchema.safeParse({
    schemaVersion: row.schema_version,
    ontologyVersion: row.ontology_version,
    recommendationVersion: row.recommendation_version,
    experimentVariant: row.experiment_variant,
    dimensions: row.dimensions,
    nextBestMove: row.next_best_move ?? null,
    missedDoors: row.missed_doors ?? [],
    shadowArtifacts: row.shadow_artifacts ?? [],
    reachableTaskIds: row.reachable_task_ids ?? [],
    frictionFlags: row.friction_flags ?? [],
  })

  if (!result.success) return null
  return result.data
}

function buildRecordFromRows(
  rows: GuidanceTaskProgressRow[],
  snapshotRow: GuidanceTrajectorySnapshotRow | null,
): GuidancePersistenceRecord | null {
  if (!snapshotRow && rows.length === 0) return null

  const taskProgress: Record<string, GuidanceTaskProgress> = {}
  const dismissedAtByTaskId: Record<string, string> = {}
  let latestUpdatedAt = normalizeIso(snapshotRow?.updated_at) ?? new Date().toISOString()

  for (const row of rows) {
    const lastTouchedAt = normalizeIso(row.last_touched_at, latestUpdatedAt) ?? latestUpdatedAt
    const lastCompletedAt = normalizeIso(row.last_completed_at)
    const lastDismissedAt = normalizeIso(row.last_dismissed_at)
    const updatedAt = normalizeIso(row.updated_at, lastTouchedAt) ?? lastTouchedAt

    taskProgress[row.task_id] = {
      taskId: row.task_id,
      highestProgressState: row.highest_progress_state,
      latestAssistMode: row.latest_assist_mode ?? null,
      attemptCount: row.attempt_count ?? 0,
      abandonCount: row.abandon_count ?? 0,
      completionCount: row.completion_count ?? 0,
      evidenceCount: row.evidence_count ?? 0,
      lastTouchedAt,
      lastCompletedAt,
      lastDismissedAt,
    }

    if (lastDismissedAt) {
      dismissedAtByTaskId[row.task_id] = lastDismissedAt
    }

    if (new Date(updatedAt).getTime() > new Date(latestUpdatedAt).getTime()) {
      latestUpdatedAt = updatedAt
    }
  }

  return {
    schemaVersion: snapshotRow?.schema_version ?? GUIDANCE_SCHEMA_VERSION,
    ontologyVersion: snapshotRow?.ontology_version ?? GUIDANCE_ONTOLOGY_VERSION,
    recommendationVersion:
      snapshotRow?.recommendation_version ?? GUIDANCE_RECOMMENDATION_VERSION,
    assignmentVersion: snapshotRow?.assignment_version ?? GUIDANCE_ASSIGNMENT_VERSION,
    experimentVariant: snapshotRow?.experiment_variant ?? 'control',
    taskProgress,
    dismissedAtByTaskId,
    updatedAt: latestUpdatedAt,
  }
}

function buildTaskProgressRows(
  userId: string,
  record: GuidancePersistenceRecord,
): GuidanceTaskProgressRow[] {
  return Object.values(record.taskProgress).map((progress) => ({
    user_id: userId,
    task_id: progress.taskId,
    capability_id:
      GUIDANCE_TASK_MAP[progress.taskId]?.capabilityId ?? `guidance:${progress.taskId}`,
    highest_progress_state: progress.highestProgressState,
    latest_assist_mode: progress.latestAssistMode ?? null,
    attempt_count: progress.attemptCount,
    abandon_count: progress.abandonCount,
    completion_count: progress.completionCount,
    evidence_count: progress.evidenceCount,
    last_touched_at: progress.lastTouchedAt,
    last_completed_at: progress.lastCompletedAt ?? null,
    last_dismissed_at: progress.lastDismissedAt ?? null,
    updated_at: record.updatedAt,
  }))
}

function buildSnapshotRow(
  userId: string,
  record: GuidancePersistenceRecord,
  snapshot: GuidanceSnapshot,
): GuidanceTrajectorySnapshotRow {
  return {
    user_id: userId,
    schema_version: snapshot.schemaVersion,
    ontology_version: snapshot.ontologyVersion,
    recommendation_version: snapshot.recommendationVersion,
    assignment_version: record.assignmentVersion ?? GUIDANCE_ASSIGNMENT_VERSION,
    experiment_variant: snapshot.experimentVariant,
    dimensions: snapshot.dimensions,
    next_best_move: snapshot.nextBestMove,
    missed_doors: snapshot.missedDoors,
    shadow_artifacts: snapshot.shadowArtifacts,
    reachable_task_ids: snapshot.reachableTaskIds,
    friction_flags: snapshot.frictionFlags,
    updated_at: record.updatedAt,
  }
}

function buildGuidancePlanRow(
  userId: string,
  state: GuidanceDbState,
): GuidancePlanRow {
  return {
    user_id: userId,
    plan_data: mergePlanWithGuidanceRecord({}, state.record, state.snapshot ?? undefined),
  }
}

async function loadSnapshotRowForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ row: GuidanceTrajectorySnapshotRow | null; missingTables: boolean }> {
  const { data, error } = await supabase
    .from('guidance_trajectory_snapshots')
    .select(`
      user_id,
      schema_version,
      ontology_version,
      recommendation_version,
      assignment_version,
      experiment_variant,
      dimensions,
      next_best_move,
      missed_doors,
      shadow_artifacts,
      reachable_task_ids,
      friction_flags,
      updated_at
    `)
    .eq('user_id', userId)
    .maybeSingle()

  if (!error) {
    return {
      row: (data ?? null) as GuidanceTrajectorySnapshotRow | null,
      missingTables: false,
    }
  }

  if (error.code === '42P01') {
    return { row: null, missingTables: true }
  }

  if (error.code === 'PGRST116') {
    return { row: null, missingTables: false }
  }

  throw error
}

async function loadTaskProgressRowsForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ rows: GuidanceTaskProgressRow[]; missingTables: boolean }> {
  const { data, error } = await supabase
    .from('guidance_task_progress')
    .select(`
      user_id,
      task_id,
      capability_id,
      highest_progress_state,
      latest_assist_mode,
      attempt_count,
      abandon_count,
      completion_count,
      evidence_count,
      last_touched_at,
      last_completed_at,
      last_dismissed_at,
      updated_at
    `)
    .eq('user_id', userId)

  if (!error) {
    return {
      rows: (data ?? []) as GuidanceTaskProgressRow[],
      missingTables: false,
    }
  }

  if (error.code === '42P01') {
    return { rows: [], missingTables: true }
  }

  throw error
}

export async function loadGuidanceStateForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ state: GuidanceDbState | null; missingTables: boolean }> {
  const [snapshotResult, taskResult] = await Promise.all([
    loadSnapshotRowForUser(supabase, userId),
    loadTaskProgressRowsForUser(supabase, userId),
  ])

  if (snapshotResult.missingTables || taskResult.missingTables) {
    return { state: null, missingTables: true }
  }

  const snapshot = buildSnapshotFromRow(snapshotResult.row)
  const record = buildRecordFromRows(taskResult.rows, snapshotResult.row)

  if (!record && !snapshot) {
    return { state: null, missingTables: false }
  }

  return {
    state: {
      record: record ?? {
        schemaVersion: snapshot?.schemaVersion ?? GUIDANCE_SCHEMA_VERSION,
        ontologyVersion: snapshot?.ontologyVersion ?? GUIDANCE_ONTOLOGY_VERSION,
        recommendationVersion:
          snapshot?.recommendationVersion ?? GUIDANCE_RECOMMENDATION_VERSION,
        assignmentVersion: GUIDANCE_ASSIGNMENT_VERSION,
        experimentVariant: snapshot?.experimentVariant ?? 'control',
        taskProgress: {},
        dismissedAtByTaskId: {},
        updatedAt: new Date().toISOString(),
      },
      snapshot,
    },
    missingTables: false,
  }
}

export async function loadGuidancePlanRowsFromDb(
  supabase: SupabaseClient,
  limit: number,
): Promise<{ planRows: GuidancePlanRow[]; missingTables: boolean }> {
  const { data: snapshotData, error: snapshotError } = await supabase
    .from('guidance_trajectory_snapshots')
    .select(`
      user_id,
      schema_version,
      ontology_version,
      recommendation_version,
      assignment_version,
      experiment_variant,
      dimensions,
      next_best_move,
      missed_doors,
      shadow_artifacts,
      reachable_task_ids,
      friction_flags,
      updated_at
    `)
    .order('updated_at', { ascending: false })
    .limit(limit)
    .abortSignal(AbortSignal.timeout(10_000))

  if (snapshotError) {
    if (snapshotError.code === '42P01') {
      return { planRows: [], missingTables: true }
    }
    throw snapshotError
  }

  const snapshotRows = (snapshotData ?? []) as GuidanceTrajectorySnapshotRow[]
  const userIds = snapshotRows.map((row) => row.user_id)

  if (userIds.length === 0) {
    return { planRows: [], missingTables: false }
  }

  const { data: taskData, error: taskError } = await supabase
    .from('guidance_task_progress')
    .select(`
      user_id,
      task_id,
      capability_id,
      highest_progress_state,
      latest_assist_mode,
      attempt_count,
      abandon_count,
      completion_count,
      evidence_count,
      last_touched_at,
      last_completed_at,
      last_dismissed_at,
      updated_at
    `)
    .in('user_id', userIds)
    .abortSignal(AbortSignal.timeout(10_000))

  if (taskError) {
    if (taskError.code === '42P01') {
      return { planRows: [], missingTables: true }
    }
    throw taskError
  }

  const taskRows = (taskData ?? []) as GuidanceTaskProgressRow[]
  const taskRowsByUser = new Map<string, GuidanceTaskProgressRow[]>()
  for (const row of taskRows) {
    const current = taskRowsByUser.get(row.user_id) ?? []
    current.push(row)
    taskRowsByUser.set(row.user_id, current)
  }

  const planRows = snapshotRows.flatMap((snapshotRow) => {
    const snapshot = buildSnapshotFromRow(snapshotRow)
    const record = buildRecordFromRows(
      taskRowsByUser.get(snapshotRow.user_id) ?? [],
      snapshotRow,
    )

    if (!record && !snapshot) return []

    return [
      buildGuidancePlanRow(snapshotRow.user_id, {
        record: record ?? {
          schemaVersion: snapshot?.schemaVersion ?? GUIDANCE_SCHEMA_VERSION,
          ontologyVersion: snapshot?.ontologyVersion ?? GUIDANCE_ONTOLOGY_VERSION,
          recommendationVersion:
            snapshot?.recommendationVersion ?? GUIDANCE_RECOMMENDATION_VERSION,
          assignmentVersion: snapshotRow.assignment_version ?? GUIDANCE_ASSIGNMENT_VERSION,
          experimentVariant: snapshotRow.experiment_variant,
          taskProgress: {},
          dismissedAtByTaskId: {},
          updatedAt: normalizeIso(snapshotRow.updated_at) ?? new Date().toISOString(),
        },
        snapshot,
      }),
    ]
  })

  return { planRows, missingTables: false }
}

export async function persistGuidanceStateForUser(params: {
  supabase: SupabaseClient
  userId: string
  state: GuidanceDbState
  existingTaskIds?: string[]
}): Promise<void> {
  const { supabase, userId, state } = params
  if (!state.snapshot) {
    throw new Error('Guidance snapshot is required for dedicated persistence')
  }

  const snapshotRow = buildSnapshotRow(userId, state.record, state.snapshot)
  const { error: snapshotError } = await supabase
    .from('guidance_trajectory_snapshots')
    .upsert(snapshotRow, { onConflict: 'user_id' })

  if (snapshotError) throw snapshotError

  const taskRows = buildTaskProgressRows(userId, state.record)
  if (taskRows.length > 0) {
    const { error: upsertError } = await supabase
      .from('guidance_task_progress')
      .upsert(taskRows, { onConflict: 'user_id,task_id' })

    if (upsertError) throw upsertError
  }

  const currentTaskIds = new Set(Object.keys(state.record.taskProgress))
  const staleTaskIds = (params.existingTaskIds ?? []).filter(
    (taskId) => !currentTaskIds.has(taskId),
  )

  if (staleTaskIds.length > 0) {
    const { error: deleteError } = await supabase
      .from('guidance_task_progress')
      .delete()
      .eq('user_id', userId)
      .in('task_id', staleTaskIds)

    if (deleteError) throw deleteError
  }
}
