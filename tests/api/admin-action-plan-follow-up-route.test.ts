import { beforeEach, describe, expect, test, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

const mockRequireAdminAuth = vi.fn()
const mockGetAuthenticatedAdminContext = vi.fn()
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
        upsert: vi.fn(async (payload: { plan_data: Record<string, unknown> }) => {
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
  getAuthenticatedAdminContext: mockGetAuthenticatedAdminContext,
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

describe('admin action plan follow-up route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    store.userActionPlansTableMissing = false
    store.planData = null
    store.profilePlan = null
    store.noPlanRow = false
    mockRequireAdminAuth.mockResolvedValue(null)
    mockGetAuthenticatedAdminContext.mockResolvedValue([
      {
        userId: 'admin_123',
        email: 'counselor@example.com',
        fullName: 'Casey Counselor',
        role: 'educator',
      },
      null,
    ])
    mockRateLimitCheck.mockResolvedValue(undefined)
  })

  test('returns auth error when admin access is missing', async () => {
    mockRequireAdminAuth.mockResolvedValueOnce(
      NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    )

    const { GET } = await import('@/app/api/admin/action-plan-follow-up/route')
    const response = await GET(createRequest('http://localhost:3000/api/admin/action-plan-follow-up?userId=player_401'))

    expect(response.status).toBe(401)
  })

  test('GET returns existing follow-up status when present', async () => {
    store.planData = {
      followUpStatus: {
        status: 'follow_up_due',
        updatedAt: '2026-03-13T10:00:00.000Z',
        note: 'Check back after Friday.',
        updatedBy: {
          userId: 'admin_123',
          email: 'counselor@example.com',
          fullName: 'Casey Counselor',
        },
      },
    }

    const { GET } = await import('@/app/api/admin/action-plan-follow-up/route')
    const response = await GET(createRequest('http://localhost:3000/api/admin/action-plan-follow-up?userId=player_123'))

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.success).toBe(true)
    expect(body.followUp.status).toBe('follow_up_due')
    expect(body.followUp.note).toBe('Check back after Friday.')
    expect(body.followUp.updatedBy.userId).toBe('admin_123')
  })

  test('POST upserts follow-up status into user_action_plans plan_data', async () => {
    store.planData = { posture: 'balance' }

    const { POST } = await import('@/app/api/admin/action-plan-follow-up/route')
    const response = await POST(createRequest('http://localhost:3000/api/admin/action-plan-follow-up', {
      method: 'POST',
      body: {
        userId: 'player_123',
        followUp: {
          status: 'contacted',
          note: 'Reached out by email.',
        },
      },
    }))

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.success).toBe(true)
    expect(store.planData?.posture).toBe('balance')
    expect((store.planData as Record<string, unknown>).followUpStatus).toBeTruthy()
    expect((store.planData as Record<string, unknown>).followUpStatus).toMatchObject({
      status: 'contacted',
      note: 'Reached out by email.',
      updatedBy: {
        userId: 'admin_123',
        email: 'counselor@example.com',
        fullName: 'Casey Counselor',
      },
    })
  })
})
