import { beforeEach, describe, expect, test, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

const mockRequireAdminAuth = vi.fn()
const mockAuditLog = vi.fn()
const mockRateLimitCheck = vi.fn().mockResolvedValue(undefined)
const mockLoggerError = vi.fn()

const store = {
  interactionEvents: [] as Array<{
    user_id: string
    event_type: string
    occurred_at: string | null
    payload: unknown
  }>,
}

const mockSupabase = {
  from: vi.fn((table: string) => {
    if (table !== 'interaction_events') throw new Error(`Unexpected table ${table}`)
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

describe('admin student insights summary route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRequireAdminAuth.mockResolvedValue(null)
    store.interactionEvents = [
      {
        user_id: 'player_1',
        event_type: 'recommendation_shown',
        occurred_at: '2026-03-13T00:00:00.000Z',
        payload: { source_surface: 'student_insights_signals' },
      },
    ]
  })

  test('returns auth error when admin access is missing', async () => {
    mockRequireAdminAuth.mockResolvedValueOnce(
      NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    )

    const { GET } = await import('@/app/api/admin/student-insights-summary/route')
    const response = await GET(createRequest('http://localhost:3000/api/admin/student-insights-summary'))

    expect(response.status).toBe(401)
  })

  test('returns student insights summary for authenticated admins', async () => {
    const { GET } = await import('@/app/api/admin/student-insights-summary/route')
    const response = await GET(createRequest('http://localhost:3000/api/admin/student-insights-summary?days=12'))

    expect(response.status).toBe(200)

    const payload = await response.json()
    expect(payload.success).toBe(true)
    expect(payload.summary.days).toBe(12)
    expect(payload.summary.totals.counts.recommendationShown).toBe(1)
    expect(mockAuditLog).toHaveBeenCalled()
  })
})
