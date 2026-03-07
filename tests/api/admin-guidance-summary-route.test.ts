import { beforeEach, describe, expect, test, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

import { buildGuidanceSnapshot, createEmptyGuidanceRecord } from '@/lib/guidance/engine'

const mockRequireAdminAuth = vi.fn()
const mockAuditLog = vi.fn()
const mockRateLimitCheck = vi.fn().mockResolvedValue(undefined)
const mockLoggerError = vi.fn()

const store = {
  planRows: [] as Array<{ user_id: string; plan_data: Record<string, unknown> | null }>,
  guidanceSnapshots: [] as Array<Record<string, unknown>>,
  guidanceTaskProgress: [] as Array<Record<string, unknown>>,
  missingGuidanceTables: false,
  interactionEvents: [] as Array<{
    user_id: string
    event_type: string
    occurred_at: string | null
    payload: unknown
  }>,
}

const mockSupabase = {
  from: vi.fn((table: string) => {
    if (table === 'user_action_plans') {
      return {
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              abortSignal: vi.fn(async () => ({
                data: store.planRows,
                error: null,
              })),
            })),
          })),
        })),
      }
    }

    if (table === 'interaction_events') {
      return {
        select: vi.fn(() => ({
          in: vi.fn(() => ({
            gte: vi.fn(() => ({
              order: vi.fn(() => ({
                limit: vi.fn(() => ({
                  abortSignal: vi.fn(async () => ({
                    data: store.interactionEvents,
                    error: null,
                  })),
                })),
              })),
            })),
          })),
        })),
      }
    }

    if (table === 'player_profiles') {
      return {
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              abortSignal: vi.fn(async () => ({
                data: [],
                error: null,
              })),
            })),
          })),
        })),
      }
    }

    if (table === 'guidance_trajectory_snapshots') {
      return {
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              abortSignal: vi.fn(async () => {
                if (store.missingGuidanceTables) {
                  return { data: null, error: { code: '42P01' } }
                }

                return { data: store.guidanceSnapshots, error: null }
              }),
            })),
          })),
        })),
      }
    }

    if (table === 'guidance_task_progress') {
      return {
        select: vi.fn(() => ({
          in: vi.fn(() => ({
            abortSignal: vi.fn(async () => {
              if (store.missingGuidanceTables) {
                return { data: null, error: { code: '42P01' } }
              }

              return { data: store.guidanceTaskProgress, error: null }
            }),
          })),
        })),
      }
    }

    throw new Error(`Unexpected table ${table}`)
  }),
}

vi.mock('@/lib/admin-supabase-client', () => ({
  requireAdminAuth: mockRequireAdminAuth,
  getAdminSupabaseClient: vi.fn(() => mockSupabase),
}))

vi.mock('@/lib/audit-logger', () => ({
  auditLog: mockAuditLog,
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: () => ({
    check: mockRateLimitCheck,
  }),
  getClientIp: vi.fn(() => '127.0.0.1'),
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    error: mockLoggerError,
  },
}))

vi.mock('@/lib/api-timing', () => ({
  createTimer: vi.fn(() => ({
    stop: () => ({ durationMs: 6 }),
  })),
}))

function createRequest(url: string): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost:3000'))
}

describe('admin guidance summary route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    store.planRows = []
    store.guidanceSnapshots = []
    store.guidanceTaskProgress = []
    store.missingGuidanceTables = false
    store.interactionEvents = []
    mockRequireAdminAuth.mockResolvedValue(null)
    mockRateLimitCheck.mockResolvedValue(undefined)
    delete process.env.NEXT_PUBLIC_FF_ADAPTIVE_GUIDANCE_V1_MODE
    delete process.env.NEXT_PUBLIC_FF_ADAPTIVE_GUIDANCE_V1_ROLLOUT
  })

  test('returns auth error when admin access is missing', async () => {
    mockRequireAdminAuth.mockResolvedValueOnce(
      NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    )

    const { GET } = await import('@/app/api/admin/guidance/summary/route')
    const response = await GET(createRequest('http://localhost:3000/api/admin/guidance/summary'))

    expect(response.status).toBe(401)
  })

  test('returns aggregated cohort summary for an authenticated admin', async () => {
    const adaptiveRecord = createEmptyGuidanceRecord(
      'adaptive',
      '2026-03-07T12:00:00.000Z',
    )
    const adaptiveSnapshot = buildGuidanceSnapshot(
      {
        playerId: 'player_adaptive',
        totalDemonstrations: 7,
        skillCount: 7,
        careerMatchCount: 2,
        nearReadyCareerCount: 1,
        unlockedOpportunityCount: 1,
        openReturnsCount: 1,
        hasJourneySave: true,
        currentCharacterLabel: 'Noor',
        dominantPatternLabel: 'Builder',
        taskProgress: adaptiveRecord.taskProgress,
        nowIso: '2026-03-07T12:00:00.000Z',
      },
      adaptiveRecord,
    )

    const controlRecord = createEmptyGuidanceRecord(
      'control',
      '2026-03-07T12:05:00.000Z',
    )
    const controlSnapshot = buildGuidanceSnapshot(
      {
        playerId: 'player_control',
        totalDemonstrations: 5,
        skillCount: 4,
        careerMatchCount: 2,
        nearReadyCareerCount: 1,
        unlockedOpportunityCount: 1,
        openReturnsCount: 1,
        hasJourneySave: true,
        currentCharacterLabel: 'Maya',
        dominantPatternLabel: 'Helping',
        taskProgress: controlRecord.taskProgress,
        nowIso: '2026-03-07T12:05:00.000Z',
      },
      controlRecord,
    )

    store.guidanceSnapshots = [
      {
        user_id: 'player_adaptive',
        schema_version: adaptiveSnapshot.schemaVersion,
        ontology_version: adaptiveSnapshot.ontologyVersion,
        recommendation_version: adaptiveSnapshot.recommendationVersion,
        assignment_version: '2026-03-v2-control',
        experiment_variant: adaptiveSnapshot.experimentVariant,
        dimensions: adaptiveSnapshot.dimensions,
        next_best_move: adaptiveSnapshot.nextBestMove,
        missed_doors: adaptiveSnapshot.missedDoors,
        shadow_artifacts: adaptiveSnapshot.shadowArtifacts,
        reachable_task_ids: adaptiveSnapshot.reachableTaskIds,
        friction_flags: adaptiveSnapshot.frictionFlags,
        updated_at: adaptiveRecord.updatedAt,
      },
      {
        user_id: 'player_control',
        schema_version: controlSnapshot.schemaVersion,
        ontology_version: controlSnapshot.ontologyVersion,
        recommendation_version: controlSnapshot.recommendationVersion,
        assignment_version: '2026-03-v2-control',
        experiment_variant: controlSnapshot.experimentVariant,
        dimensions: controlSnapshot.dimensions,
        next_best_move: controlSnapshot.nextBestMove,
        missed_doors: controlSnapshot.missedDoors,
        shadow_artifacts: controlSnapshot.shadowArtifacts,
        reachable_task_ids: controlSnapshot.reachableTaskIds,
        friction_flags: controlSnapshot.frictionFlags,
        updated_at: controlRecord.updatedAt,
      },
    ]
    store.guidanceTaskProgress = [
      ...Object.values(adaptiveRecord.taskProgress).map((progress) => ({
        user_id: 'player_adaptive',
        task_id: progress.taskId,
        capability_id: 'career_readiness',
        highest_progress_state: progress.highestProgressState,
        latest_assist_mode: progress.latestAssistMode,
        attempt_count: progress.attemptCount,
        abandon_count: progress.abandonCount,
        completion_count: progress.completionCount,
        evidence_count: progress.evidenceCount,
        last_touched_at: progress.lastTouchedAt,
        last_completed_at: progress.lastCompletedAt,
        last_dismissed_at: progress.lastDismissedAt,
        updated_at: adaptiveRecord.updatedAt,
      })),
      ...Object.values(controlRecord.taskProgress).map((progress) => ({
        user_id: 'player_control',
        task_id: progress.taskId,
        capability_id: 'career_readiness',
        highest_progress_state: progress.highestProgressState,
        latest_assist_mode: progress.latestAssistMode,
        attempt_count: progress.attemptCount,
        abandon_count: progress.abandonCount,
        completion_count: progress.completionCount,
        evidence_count: progress.evidenceCount,
        last_touched_at: progress.lastTouchedAt,
        last_completed_at: progress.lastCompletedAt,
        last_dismissed_at: progress.lastDismissedAt,
        updated_at: controlRecord.updatedAt,
      })),
    ]
    store.interactionEvents = [
      {
        user_id: 'player_adaptive',
        event_type: 'recommendation_shown',
        occurred_at: '2026-03-07T12:01:00.000Z',
        payload: {
          task_id: adaptiveSnapshot.nextBestMove?.taskId ?? 'review_career_matches',
          source_surface: 'careers',
        },
      },
      {
        user_id: 'player_adaptive',
        event_type: 'recommendation_clicked',
        occurred_at: '2026-03-07T12:01:10.000Z',
        payload: {
          task_id: adaptiveSnapshot.nextBestMove?.taskId ?? 'review_career_matches',
          source_surface: 'careers',
        },
      },
      {
        user_id: 'player_control',
        event_type: 'recommendation_shown',
        occurred_at: '2026-03-07T12:06:00.000Z',
        payload: {
          task_id: controlSnapshot.nextBestMove?.taskId ?? 'resume_waiting_route',
          source_surface: 'opportunities',
        },
      },
    ]

    const { GET } = await import('@/app/api/admin/guidance/summary/route')
    const response = await GET(
      createRequest('http://localhost:3000/api/admin/guidance/summary?days=30&limit=200'),
    )
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.summary.rollout.mode).toBe('experiment')
    expect(data.summary.totals.usersWithGuidance).toBe(2)
    expect(data.summary.cohorts.find((cohort: { cohort: string }) => cohort.cohort === 'adaptive')?.recommendationClicked).toBe(1)
    expect(mockAuditLog).toHaveBeenCalledWith('view_action_data', 'admin', undefined, expect.objectContaining({
      summary: true,
      days: 30,
      userLimit: 200,
    }))
  })
})
