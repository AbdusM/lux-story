import { beforeEach, describe, expect, test, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

const mockRequireAdminAuth = vi.fn()
const mockAuditLog = vi.fn()
const mockRateLimitCheck = vi.fn().mockResolvedValue(undefined)
const mockLoggerError = vi.fn()

const store = {
  userActionPlansTableMissing: false,
  planData: null as Record<string, unknown> | null,
  profilePlan: null as Record<string, unknown> | null,
  noPlanRow: false,
}

const mockSupabase = {
  from: vi.fn((table: string) => {
    if (table === 'user_action_plans') {
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(async () => {
              if (store.userActionPlansTableMissing) {
                return { data: null, error: { code: '42P01' } }
              }

              if (store.noPlanRow) {
                return { data: null, error: { code: 'PGRST116' } }
              }

              return {
                data: store.planData ? { plan_data: store.planData } : null,
                error: null,
              }
            }),
          })),
        })),
        upsert: vi.fn(async (payload: { plan_data: Record<string, unknown> }, _options?: unknown) => {
          store.planData = payload.plan_data
          return { error: null }
        }),
      }
    }

    if (table === 'player_profiles') {
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(async () => ({
              data: store.profilePlan ? { last_action_plan: store.profilePlan } : null,
              error: null,
            })),
          })),
        })),
        update: vi.fn((payload: { last_action_plan: Record<string, unknown> }) => ({
          eq: vi.fn(async () => {
            store.profilePlan = payload.last_action_plan
            return { error: null }
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

function createRequest(
  url: string,
  options: {
    method?: string
    body?: object
  } = {},
): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost:3000'), {
    method: options.method ?? 'GET',
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

describe('admin action plan review route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    store.userActionPlansTableMissing = false
    store.planData = null
    store.profilePlan = null
    store.noPlanRow = false
    mockRequireAdminAuth.mockResolvedValue(null)
    mockRateLimitCheck.mockResolvedValue(undefined)
  })

  test('returns auth error when admin access is missing', async () => {
    mockRequireAdminAuth.mockResolvedValueOnce(
      NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    )

    const { GET } = await import('@/app/api/admin/action-plan-review/route')
    const response = await GET(createRequest('http://localhost:3000/api/admin/action-plan-review?userId=player_401'))

    expect(response.status).toBe(401)
  })

  test('GET returns null review when no plan exists', async () => {
    store.noPlanRow = true

    const { GET } = await import('@/app/api/admin/action-plan-review/route')
    const response = await GET(createRequest('http://localhost:3000/api/admin/action-plan-review?userId=player_none'))

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.success).toBe(true)
    expect(body.review).toBeNull()
  })

  test('GET returns existing review when present', async () => {
    store.planData = {
      advisorReview: {
        status: 'needs_work',
        feedback: 'Tighten proof bullets',
        updatedAt: '2026-03-12T10:00:00.000Z',
      },
    }

    const { GET } = await import('@/app/api/admin/action-plan-review/route')
    const response = await GET(createRequest('http://localhost:3000/api/admin/action-plan-review?userId=player_123'))

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.success).toBe(true)
    expect(body.review.status).toBe('needs_work')
    expect(body.review.feedback).toBe('Tighten proof bullets')
  })

  test('POST upserts review into user_action_plans plan_data', async () => {
    store.planData = { posture: 'balance', thisWeekFocus: 'keep' }

    const { POST } = await import('@/app/api/admin/action-plan-review/route')
    const response = await POST(createRequest('http://localhost:3000/api/admin/action-plan-review', {
      method: 'POST',
      body: {
        userId: 'player_123',
        review: { status: 'approved', feedback: 'Ready to apply.' },
      },
    }))

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.success).toBe(true)
    expect(body.review.status).toBe('approved')
    expect(store.planData?.posture).toBe('balance')
    expect((store.planData as Record<string, unknown>).advisorReview).toBeTruthy()
  })

  test('POST falls back to player_profiles when user_action_plans is missing', async () => {
    store.userActionPlansTableMissing = true
    store.profilePlan = { legacyPlan: 'keep' }

    const { POST } = await import('@/app/api/admin/action-plan-review/route')
    const response = await POST(createRequest('http://localhost:3000/api/admin/action-plan-review', {
      method: 'POST',
      body: {
        userId: 'player_abc',
        review: { status: 'needs_work', feedback: 'Please fill out your week focus.' },
      },
    }))

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.success).toBe(true)
    expect(store.profilePlan?.legacyPlan).toBe('keep')
    expect((store.profilePlan as Record<string, unknown>).advisorReview).toBeTruthy()
  })
})

