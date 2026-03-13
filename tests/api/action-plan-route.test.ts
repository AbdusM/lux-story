import { beforeEach, describe, expect, test, vi } from 'vitest'
import { NextRequest } from 'next/server'

import { createUserSessionToken, USER_SESSION_COOKIE_NAME } from '@/lib/api/user-session'
import { buildGuidanceSnapshot, createEmptyGuidanceRecord } from '@/lib/guidance/engine'

type StoreState = {
  missingActionPlanTable: boolean
  missingGuidanceTables: boolean
  userActionPlan: Record<string, unknown> | null
  profileActionPlan: Record<string, unknown> | null
  guidanceSnapshot: Record<string, unknown> | null
  guidanceTaskProgress: Array<Record<string, unknown>>
}

const store: StoreState = {
  missingActionPlanTable: false,
  missingGuidanceTables: false,
  userActionPlan: null,
  profileActionPlan: null,
  guidanceSnapshot: null,
  guidanceTaskProgress: [],
}

const mockSupabase = {
  from: vi.fn((table: string) => {
    if (table === 'user_action_plans') {
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(async () => {
              if (store.missingActionPlanTable) {
                return { data: null, error: { code: '42P01' } }
              }

              if (!store.userActionPlan) {
                return { data: null, error: { code: 'PGRST116' } }
              }

              return { data: { plan_data: store.userActionPlan }, error: null }
            }),
          })),
        })),
        upsert: vi.fn(async (payload: { plan_data: Record<string, unknown> }) => {
          store.userActionPlan = payload.plan_data
          return { error: null }
        }),
      }
    }

    if (table === 'player_profiles') {
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(async () => ({
              data: store.profileActionPlan ? { last_action_plan: store.profileActionPlan } : null,
              error: null,
            })),
          })),
        })),
        update: vi.fn((payload: { last_action_plan: Record<string, unknown> }) => ({
          eq: vi.fn(async () => {
            store.profileActionPlan = payload.last_action_plan
            return { error: null }
          }),
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
        upsert: vi.fn(async (payload: Record<string, unknown>) => {
          store.guidanceSnapshot = payload
          return { error: null }
        }),
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
        upsert: vi.fn(async (payload: Array<Record<string, unknown>>) => {
          store.guidanceTaskProgress = payload
          return { error: null }
        }),
        delete: vi.fn(() => ({
          eq: vi.fn(() => ({
            in: vi.fn(async (_column: string, staleTaskIds: string[]) => {
              store.guidanceTaskProgress = store.guidanceTaskProgress.filter(
                (row) => !staleTaskIds.includes(String(row.task_id)),
              )
              return { error: null }
            }),
          })),
        })),
      }
    }

    throw new Error(`Unexpected table ${table}`)
  }),
}

vi.mock('@/lib/supabase-server', () => ({
  getSupabaseServerClient: () => mockSupabase,
}))

function createRequest(
  url: string,
  options: {
    method?: string
    body?: object
    cookies?: Record<string, string>
  } = {},
): NextRequest {
  const request = new NextRequest(new URL(url, 'http://localhost:3000'), {
    method: options.method ?? 'GET',
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  Object.entries(options.cookies ?? {}).forEach(([name, value]) => {
    request.cookies.set(name, value)
  })

  return request
}

function sessionCookieFor(userId: string = 'player_123'): Record<string, string> {
  return {
    [USER_SESSION_COOKIE_NAME]: createUserSessionToken(userId),
  }
}

function buildValidGuidancePayload(options: {
  userId?: string
  experimentVariant?: 'control' | 'adaptive'
  updatedAt: string
}) {
  const userId = options.userId ?? 'player_123'
  const record = createEmptyGuidanceRecord(
    options.experimentVariant ?? 'adaptive',
    options.updatedAt,
  )
  const snapshot = buildGuidanceSnapshot(
    {
      playerId: userId,
      totalDemonstrations: 4,
      skillCount: 3,
      careerMatchCount: 2,
      nearReadyCareerCount: 1,
      unlockedOpportunityCount: 1,
      openReturnsCount: 1,
      hasJourneySave: true,
      currentCharacterLabel: 'Noor',
      dominantPatternLabel: 'Builder',
      taskProgress: record.taskProgress,
      nowIso: options.updatedAt,
    },
    record,
  )

  return {
    record,
    snapshot,
  }
}

describe('action-plan route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    store.missingActionPlanTable = false
    store.missingGuidanceTables = false
    store.userActionPlan = null
    store.profileActionPlan = null
    store.guidanceSnapshot = null
    store.guidanceTaskProgress = []
  })

  test('GET rejects unauthenticated requests', async () => {
    const { GET } = await import('@/app/api/user/action-plan/route')
    const response = await GET(createRequest('http://localhost:3000/api/user/action-plan'))

    expect(response.status).toBe(401)
  })

  test('GET returns the stored merged plan for the authenticated user', async () => {
    store.userActionPlan = {
      existingFocus: 'keep',
      followUpStatus: {
        status: 'contacted',
        updatedAt: '2026-03-08T12:00:00.000Z',
        note: 'Internal counselor note',
      },
      followUpHistory: [
        {
          status: 'contacted',
          updatedAt: '2026-03-08T12:00:00.000Z',
          note: 'Internal counselor note',
        },
      ],
    }
    store.guidanceSnapshot = {
      user_id: 'player_123',
      schema_version: '2026-03-v1',
      ontology_version: '2026-03-v1',
      recommendation_version: '2026-03-v1',
      assignment_version: '2026-03-v2-control',
      experiment_variant: 'adaptive',
      dimensions: {
        initiative: 40,
        followThrough: 55,
        assistedCompletion: 20,
        independentCompletion: 80,
        recoveryAfterFriction: 50,
      },
      next_best_move: null,
      missed_doors: [],
      shadow_artifacts: [],
      reachable_task_ids: ['review_career_matches'],
      friction_flags: [],
      updated_at: '2026-03-07T12:00:00.000Z',
    }
    store.guidanceTaskProgress = [
      {
        user_id: 'player_123',
        task_id: 'review_career_matches',
        capability_id: 'career_readiness',
        highest_progress_state: 'attempted',
        latest_assist_mode: 'manual',
        attempt_count: 1,
        abandon_count: 0,
        completion_count: 0,
        evidence_count: 0,
        last_touched_at: '2026-03-07T12:00:00.000Z',
        last_completed_at: null,
        last_dismissed_at: null,
        updated_at: '2026-03-07T12:00:00.000Z',
      },
    ]

    const { GET } = await import('@/app/api/user/action-plan/route')
    const request = createRequest(
      'http://localhost:3000/api/user/action-plan?userId=player_123',
      { cookies: sessionCookieFor() },
    )

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.plan.existingFocus).toBe('keep')
    expect(data.plan.followUpStatus).toBeUndefined()
    expect(data.plan.followUpHistory).toBeUndefined()
    expect(data.plan.adaptiveGuidance.record.taskProgress.review_career_matches.attemptCount).toBe(1)
  })

  test('POST merges new plan data and persists guidance into dedicated tables', async () => {
    store.userActionPlan = {
      existingFocus: 'keep',
      preserveMe: { ok: true },
    }
    const payload = buildValidGuidancePayload({
      updatedAt: '2026-03-07T12:10:00.000Z',
    })

    const { POST } = await import('@/app/api/user/action-plan/route')
    const request = createRequest('http://localhost:3000/api/user/action-plan', {
      method: 'POST',
      cookies: sessionCookieFor(),
      body: {
        userId: 'player_123',
        plan: {
          adaptiveGuidance: payload,
        },
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.plan.existingFocus).toBe('keep')
    expect(data.plan.preserveMe).toEqual({ ok: true })
    expect(data.plan.adaptiveGuidance.record.updatedAt).toBe('2026-03-07T12:10:00.000Z')
    expect(data.plan.adaptiveGuidance.snapshot.schemaVersion).toBe(payload.snapshot.schemaVersion)
    expect(store.userActionPlan).toEqual({
      existingFocus: 'keep',
      preserveMe: { ok: true },
    })
    expect(store.guidanceSnapshot).toMatchObject({
      user_id: 'player_123',
      updated_at: '2026-03-07T12:10:00.000Z',
    })
  })

  test('POST falls back to player_profiles when the action plan table is unavailable', async () => {
    store.missingActionPlanTable = true
    store.missingGuidanceTables = true
    store.profileActionPlan = { legacyPlan: 'keep' }
    const payload = buildValidGuidancePayload({
      updatedAt: '2026-03-07T12:20:00.000Z',
    })

    const { POST } = await import('@/app/api/user/action-plan/route')
    const request = createRequest('http://localhost:3000/api/user/action-plan', {
      method: 'POST',
      cookies: sessionCookieFor(),
      body: {
        userId: 'player_123',
        plan: {
          adaptiveGuidance: payload,
        },
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(store.profileActionPlan).toEqual({
      legacyPlan: 'keep',
      adaptiveGuidance: payload,
    })
  })

  test('POST strips advisorReview from learner write payload', async () => {
    store.userActionPlan = { existingFocus: 'keep' }

    const { POST } = await import('@/app/api/user/action-plan/route')
    const request = createRequest('http://localhost:3000/api/user/action-plan', {
      method: 'POST',
      cookies: sessionCookieFor(),
      body: {
        userId: 'player_123',
        plan: {
          existingFocus: 'keep',
          advisorReview: {
            status: 'approved',
            feedback: 'User should not be allowed to write this.',
            updatedAt: '2026-03-08T12:00:00.000Z',
          },
        },
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.plan.advisorReview).toBeUndefined()
    expect(store.userActionPlan).toEqual({ existingFocus: 'keep' })
  })

  test('POST strips follow-up admin fields from learner write payload', async () => {
    store.userActionPlan = { existingFocus: 'keep' }

    const { POST } = await import('@/app/api/user/action-plan/route')
    const request = createRequest('http://localhost:3000/api/user/action-plan', {
      method: 'POST',
      cookies: sessionCookieFor(),
      body: {
        userId: 'player_123',
        plan: {
          existingFocus: 'keep',
          followUpStatus: {
            status: 'contacted',
            updatedAt: '2026-03-08T12:00:00.000Z',
          },
          followUpHistory: [
            {
              status: 'follow_up_due',
              updatedAt: '2026-03-07T09:00:00.000Z',
              note: 'Learner should not be able to write this.',
            },
          ],
        },
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.plan.followUpStatus).toBeUndefined()
    expect(data.plan.followUpHistory).toBeUndefined()
    expect(store.userActionPlan).toEqual({ existingFocus: 'keep' })
  })
})
