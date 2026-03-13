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

function createRequest(url: string): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost:3000'))
}

describe('admin action plan route', () => {
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

    const { GET } = await import('@/app/api/admin/action-plan/route')
    const response = await GET(createRequest('http://localhost:3000/api/admin/action-plan?userId=player_401'))

    expect(response.status).toBe(401)
  })

  test('returns stored action plan for an authenticated admin', async () => {
    store.planData = { posture: 'balance', proofText: 'hello world', updatedAt: '2026-03-12T12:00:00.000Z' }

    const { GET } = await import('@/app/api/admin/action-plan/route')
    const response = await GET(createRequest('http://localhost:3000/api/admin/action-plan?userId=player_123'))

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.success).toBe(true)
    expect(body.userId).toBe('player_123')
    expect(body.plan).toEqual(store.planData)
    expect(mockAuditLog).toHaveBeenCalled()
  })

  test('falls back to player_profiles when user_action_plans is missing', async () => {
    store.userActionPlansTableMissing = true
    store.profilePlan = { posture: 'defend', thisWeekFocus: 'Focus', proofText: 'proof' }

    const { GET } = await import('@/app/api/admin/action-plan/route')
    const response = await GET(createRequest('http://localhost:3000/api/admin/action-plan?userId=player_abc'))

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.success).toBe(true)
    expect(body.plan).toEqual(store.profilePlan)
  })

  test('returns null when no plan exists', async () => {
    store.noPlanRow = true

    const { GET } = await import('@/app/api/admin/action-plan/route')
    const response = await GET(createRequest('http://localhost:3000/api/admin/action-plan?userId=player_none'))

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.success).toBe(true)
    expect(body.plan).toBeNull()
  })
})

