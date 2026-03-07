import { beforeEach, describe, expect, test, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

import { buildGuidanceSnapshot, createEmptyGuidanceRecord } from '@/lib/guidance/engine'

const mockRequireAdminAuth = vi.fn()
const mockAuditLog = vi.fn()
const mockRateLimitCheck = vi.fn().mockResolvedValue(undefined)
const mockLoggerError = vi.fn()

const store = {
  planData: null as Record<string, unknown> | null,
  guidanceSnapshot: null as Record<string, unknown> | null,
  guidanceTaskProgress: [] as Array<Record<string, unknown>>,
  missingGuidanceTables: false,
  interactionEvents: [] as Array<{
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
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(async () => ({
              data: store.planData ? { plan_data: store.planData } : null,
              error: null,
            })),
          })),
        })),
      }
    }

    if (table === 'interaction_events') {
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            in: vi.fn(() => ({
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
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(async () => ({
              data: null,
              error: null,
            })),
          })),
        })),
      }
    }

    if (table === 'guidance_trajectory_snapshots') {
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(async () => {
              if (store.missingGuidanceTables) {
                return { data: null, error: { code: '42P01' } }
              }

              if (!store.guidanceSnapshot) {
                return { data: null, error: { code: 'PGRST116' } }
              }

              return { data: store.guidanceSnapshot, error: null }
            }),
          })),
        })),
      }
    }

    if (table === 'guidance_task_progress') {
      return {
        select: vi.fn(() => ({
          eq: vi.fn(async () => {
            if (store.missingGuidanceTables) {
              return { data: null, error: { code: '42P01' } }
            }

            return { data: store.guidanceTaskProgress, error: null }
          }),
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
    stop: () => ({ durationMs: 4 }),
  })),
}))

function createRequest(url: string): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost:3000'))
}

describe('admin guidance route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    store.planData = null
    store.guidanceSnapshot = null
    store.guidanceTaskProgress = []
    store.missingGuidanceTables = false
    store.interactionEvents = []
    mockRequireAdminAuth.mockResolvedValue(null)
    mockRateLimitCheck.mockResolvedValue(undefined)
  })

  test('returns auth error when admin access is missing', async () => {
    mockRequireAdminAuth.mockResolvedValueOnce(
      NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    )

    const { GET } = await import('@/app/api/admin/guidance/[userId]/route')
    const response = await GET(createRequest('http://localhost:3000/api/admin/guidance/player_401'), {
      params: Promise.resolve({ userId: 'player_401' }),
    })

    expect(response.status).toBe(401)
  })

  test('returns guidance diagnostics for an authenticated admin', async () => {
    const record = createEmptyGuidanceRecord('adaptive', '2026-03-07T12:00:00.000Z')
    const snapshot = buildGuidanceSnapshot(
      {
        playerId: 'player_123',
        totalDemonstrations: 7,
        skillCount: 7,
        careerMatchCount: 2,
        nearReadyCareerCount: 1,
        unlockedOpportunityCount: 1,
        openReturnsCount: 1,
        hasJourneySave: true,
        currentCharacterLabel: 'Noor',
        dominantPatternLabel: 'Builder',
        taskProgress: record.taskProgress,
        nowIso: '2026-03-07T12:00:00.000Z',
      },
      record,
    )

    store.planData = { preserveMe: { ok: true } }
    store.guidanceSnapshot = {
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
    }
    store.guidanceTaskProgress = Object.values(record.taskProgress).map((progress) => ({
      user_id: 'player_123',
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
      updated_at: record.updatedAt,
    }))
    store.interactionEvents = [
      {
        event_type: 'recommendation_shown',
        occurred_at: '2026-03-07T12:01:00.000Z',
        payload: {
          task_id: snapshot.nextBestMove?.taskId ?? 'review_career_matches',
          source_surface: 'careers',
        },
      },
      {
        event_type: 'recommendation_clicked',
        occurred_at: '2026-03-07T12:01:10.000Z',
        payload: {
          task_id: snapshot.nextBestMove?.taskId ?? 'review_career_matches',
          source_surface: 'careers',
        },
      },
    ]

    const { GET } = await import('@/app/api/admin/guidance/[userId]/route')
    const response = await GET(createRequest('http://localhost:3000/api/admin/guidance/player_123'), {
      params: Promise.resolve({ userId: 'player_123' }),
    })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.guidance.experimentVariant).toBe('adaptive')
    expect(data.guidance.eventCounts.recommendationShown).toBe(1)
    expect(data.guidance.eventCounts.recommendationClicked).toBe(1)
    expect(data.guidance.reachableTaskCount).toBe(snapshot.reachableTaskIds.length)
    expect(mockAuditLog).toHaveBeenCalledWith('view_action_data', 'admin', 'player_123')
  })
})
