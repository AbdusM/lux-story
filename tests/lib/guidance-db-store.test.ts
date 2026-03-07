import { describe, expect, it } from 'vitest'

import {
  loadGuidancePlanRowsFromDb,
  loadGuidanceStateForUser,
  persistGuidanceStateForUser,
} from '@/lib/guidance/db-store'
import {
  applyGuidanceEvent,
  buildGuidanceSnapshot,
  createEmptyGuidanceRecord,
} from '@/lib/guidance/engine'
import { extractGuidancePlanEnvelope } from '@/lib/guidance/storage'

function createInput(taskProgress: Record<string, ReturnType<typeof createEmptyGuidanceRecord>['taskProgress'][string]>) {
  return {
    playerId: 'player_123',
    totalDemonstrations: 7,
    skillCount: 5,
    careerMatchCount: 2,
    nearReadyCareerCount: 1,
    unlockedOpportunityCount: 2,
    openReturnsCount: 1,
    hasJourneySave: true,
    currentCharacterLabel: 'Noor',
    dominantPatternLabel: 'Builder',
    taskProgress,
    nowIso: '2026-03-07T12:10:00.000Z',
  }
}

function createGuidanceState() {
  let record = createEmptyGuidanceRecord('adaptive', '2026-03-07T12:00:00.000Z')
  record = applyGuidanceEvent(record, {
    taskId: 'review_career_matches',
    kind: 'started',
    assistMode: 'manual',
    at: '2026-03-07T12:05:00.000Z',
  })
  record = applyGuidanceEvent(record, {
    taskId: 'review_career_matches',
    kind: 'completed',
    assistMode: 'manual',
    at: '2026-03-07T12:06:00.000Z',
  })

  const snapshot = buildGuidanceSnapshot(createInput(record.taskProgress), record)
  return { record, snapshot }
}

function createMockSupabase(store: {
  missingTables?: boolean
  snapshotRow?: Record<string, unknown> | null
  snapshotRows?: Array<Record<string, unknown>>
  taskRows?: Array<Record<string, unknown>>
}) {
  return {
    from: (table: string) => {
      if (table === 'guidance_trajectory_snapshots') {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => {
                if (store.missingTables) {
                  return { data: null, error: { code: '42P01' } }
                }

                if (!store.snapshotRow) {
                  return { data: null, error: { code: 'PGRST116' } }
                }

                return { data: store.snapshotRow, error: null }
              },
            }),
            order: () => ({
              limit: () => ({
                abortSignal: async () => {
                  if (store.missingTables) {
                    return { data: null, error: { code: '42P01' } }
                  }

                  return { data: store.snapshotRows ?? [], error: null }
                },
              }),
            }),
          }),
          upsert: async (payload: Record<string, unknown>) => {
            store.snapshotRow = payload
            return { error: null }
          },
        }
      }

      if (table === 'guidance_task_progress') {
        return {
          select: () => ({
            eq: async () => {
              if (store.missingTables) {
                return { data: null, error: { code: '42P01' } }
              }

              return { data: store.taskRows ?? [], error: null }
            },
            in: () => ({
              abortSignal: async () => {
                if (store.missingTables) {
                  return { data: null, error: { code: '42P01' } }
                }

                return { data: store.taskRows ?? [], error: null }
              },
            }),
          }),
          upsert: async (payload: Array<Record<string, unknown>>) => {
            store.taskRows = payload
            return { error: null }
          },
          delete: () => ({
            eq: () => ({
              in: async (_column: string, staleTaskIds: string[]) => {
                store.taskRows = (store.taskRows ?? []).filter(
                  (row) => !staleTaskIds.includes(String(row.task_id)),
                )
                return { error: null }
              },
            }),
          }),
        }
      }

      throw new Error(`Unexpected table ${table}`)
    },
  }
}

describe('guidance db store', () => {
  it('reconstructs guidance state from dedicated snapshot and task rows', async () => {
    const { record, snapshot } = createGuidanceState()
    const store = {
      snapshotRow: {
        user_id: 'player_123',
        schema_version: snapshot.schemaVersion,
        ontology_version: snapshot.ontologyVersion,
        recommendation_version: snapshot.recommendationVersion,
        assignment_version: '2026-03-v2-control',
        experiment_variant: snapshot.experimentVariant,
        dimensions: snapshot.dimensions,
        next_best_move: snapshot.nextBestMove,
        missed_doors: snapshot.missedDoors,
        shadow_artifacts: snapshot.shadowArtifacts,
        reachable_task_ids: snapshot.reachableTaskIds,
        friction_flags: snapshot.frictionFlags,
        updated_at: record.updatedAt,
      },
      taskRows: [
        {
          user_id: 'player_123',
          task_id: 'review_career_matches',
          capability_id: 'career_readiness',
          highest_progress_state: 'completed',
          latest_assist_mode: 'manual',
          attempt_count: 1,
          abandon_count: 0,
          completion_count: 1,
          evidence_count: 0,
          last_touched_at: '2026-03-07T12:06:00.000Z',
          last_completed_at: '2026-03-07T12:06:00.000Z',
          last_dismissed_at: null,
          updated_at: '2026-03-07T12:06:00.000Z',
        },
      ],
    }

    const result = await loadGuidanceStateForUser(
      createMockSupabase(store) as never,
      'player_123',
    )

    expect(result.missingTables).toBe(false)
    expect(result.state?.record.experimentVariant).toBe('adaptive')
    expect(result.state?.record.taskProgress.review_career_matches.attemptCount).toBe(1)
    expect(result.state?.snapshot?.dimensions.followThrough).toBe(snapshot.dimensions.followThrough)
  })

  it('returns a missingTables signal when the dedicated tables do not exist', async () => {
    const result = await loadGuidanceStateForUser(
      createMockSupabase({ missingTables: true }) as never,
      'player_123',
    )

    expect(result).toEqual({
      state: null,
      missingTables: true,
    })
  })

  it('builds synthesized plan rows for cohort aggregation from dedicated tables', async () => {
    const { record, snapshot } = createGuidanceState()
    const store = {
      snapshotRows: [
        {
          user_id: 'player_123',
          schema_version: snapshot.schemaVersion,
          ontology_version: snapshot.ontologyVersion,
          recommendation_version: snapshot.recommendationVersion,
          assignment_version: '2026-03-v2-control',
          experiment_variant: snapshot.experimentVariant,
          dimensions: snapshot.dimensions,
          next_best_move: snapshot.nextBestMove,
          missed_doors: snapshot.missedDoors,
          shadow_artifacts: snapshot.shadowArtifacts,
          reachable_task_ids: snapshot.reachableTaskIds,
          friction_flags: snapshot.frictionFlags,
          updated_at: record.updatedAt,
        },
      ],
      taskRows: [
        {
          user_id: 'player_123',
          task_id: 'review_career_matches',
          capability_id: 'career_readiness',
          highest_progress_state: 'completed',
          latest_assist_mode: 'manual',
          attempt_count: 1,
          abandon_count: 0,
          completion_count: 1,
          evidence_count: 0,
          last_touched_at: '2026-03-07T12:06:00.000Z',
          last_completed_at: '2026-03-07T12:06:00.000Z',
          last_dismissed_at: null,
          updated_at: '2026-03-07T12:06:00.000Z',
        },
      ],
    }

    const result = await loadGuidancePlanRowsFromDb(
      createMockSupabase(store) as never,
      20,
    )
    const envelope = extractGuidancePlanEnvelope(result.planRows[0]?.plan_data)

    expect(result.missingTables).toBe(false)
    expect(result.planRows).toHaveLength(1)
    expect(
      envelope?.adaptiveGuidance?.record.taskProgress.review_career_matches.completionCount,
    ).toBe(1)
    expect(envelope?.adaptiveGuidance?.snapshot?.experimentVariant).toBe('adaptive')
  })

  it('persists snapshot rows and prunes stale task rows', async () => {
    const { record, snapshot } = createGuidanceState()
    const store = {
      snapshotRow: null,
      taskRows: [
        {
          user_id: 'player_123',
          task_id: 'resume_waiting_route',
          capability_id: 'career_readiness',
          highest_progress_state: 'attempted',
          latest_assist_mode: 'augmented',
          attempt_count: 1,
          abandon_count: 0,
          completion_count: 0,
          evidence_count: 0,
          last_touched_at: '2026-03-07T12:01:00.000Z',
          last_completed_at: null,
          last_dismissed_at: null,
          updated_at: '2026-03-07T12:01:00.000Z',
        },
      ],
    }

    await persistGuidanceStateForUser({
      supabase: createMockSupabase(store) as never,
      userId: 'player_123',
      state: { record, snapshot },
      existingTaskIds: ['resume_waiting_route', 'review_career_matches'],
    })

    expect(store.snapshotRow).toMatchObject({
      user_id: 'player_123',
      experiment_variant: 'adaptive',
    })
    expect(store.taskRows).toHaveLength(1)
    expect(store.taskRows?.[0]).toMatchObject({
      task_id: 'review_career_matches',
      completion_count: 1,
    })
  })
})
