import { beforeEach, describe, expect, test, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

import {
  STUDENT_INSIGHTS_ACTION_PLAN_SCHEMA_VERSION,
  STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
  STUDENT_INSIGHTS_ACTION_PLAN_TASK_ID,
} from '@/lib/telemetry/student-insights-constants'

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
  profiles: [] as Array<{
    user_id: string
    email: string | null
    full_name: string | null
  }>,
  plans: [] as Array<{
    user_id: string
    plan_data: Record<string, unknown> | null
    updated_at: string | null
  }>,
}

const mockSupabase = {
  from: vi.fn((table: string) => {
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

    if (table === 'profiles') {
      return {
        select: vi.fn(() => ({
          in: vi.fn(async () => ({
            data: store.profiles,
            error: null,
          })),
        })),
      }
    }

    if (table === 'user_action_plans') {
      return {
        select: vi.fn(() => ({
          in: vi.fn(async () => ({
            data: store.plans,
            error: null,
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

describe('admin student insights worklist route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRequireAdminAuth.mockResolvedValue(null)
    store.interactionEvents = [
      {
        user_id: 'player_1',
        event_type: 'task_completed',
        occurred_at: '2026-03-13T00:00:00.000Z',
        payload: {
          source_surface: STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
          task_id: STUDENT_INSIGHTS_ACTION_PLAN_TASK_ID,
          guidance_schema_version: STUDENT_INSIGHTS_ACTION_PLAN_SCHEMA_VERSION,
        },
      },
    ]
    store.profiles = [
      {
        user_id: 'player_1',
        email: 'player1@example.com',
        full_name: 'Player One',
      },
    ]
    store.plans = [
      {
        user_id: 'player_1',
        updated_at: '2026-03-13T00:01:00.000Z',
        plan_data: {
          updatedAt: '2026-03-13T00:01:00.000Z',
          followUpStatus: {
            status: 'follow_up_due',
            updatedAt: '2026-03-13T00:02:00.000Z',
            note: 'Review resume before next outreach.',
            updatedBy: {
              userId: 'admin_123',
              email: 'advisor@example.com',
              fullName: 'Avery Advisor',
            },
          },
          followUpHistory: [
            {
              status: 'follow_up_due',
              updatedAt: '2026-03-13T00:02:00.000Z',
              note: 'Review resume before next outreach.',
              updatedBy: {
                userId: 'admin_123',
                email: 'advisor@example.com',
                fullName: 'Avery Advisor',
              },
            },
          ],
        },
      },
    ]
  })

  test('returns auth error when admin access is missing', async () => {
    mockRequireAdminAuth.mockResolvedValueOnce(
      NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    )

    const { GET } = await import('@/app/api/admin/student-insights-worklist/route')
    const response = await GET(createRequest('http://localhost:3000/api/admin/student-insights-worklist'))

    expect(response.status).toBe(401)
  })

  test('returns a flagged worklist for authenticated admins', async () => {
    const { GET } = await import('@/app/api/admin/student-insights-worklist/route')
    const response = await GET(createRequest('http://localhost:3000/api/admin/student-insights-worklist?days=12&limit=10'))

    expect(response.status).toBe(200)

    const payload = await response.json()
    expect(payload.success).toBe(true)
    expect(payload.worklist.days).toBe(12)
    expect(payload.worklist.limit).toBe(10)
    expect(payload.worklist.flaggedUsers).toBe(1)
    expect(payload.worklist.items[0]?.userId).toBe('player_1')
    expect(payload.worklist.items[0]?.flags).toContain('needs_review')
    expect(payload.worklist.items[0]?.flags).toContain('needs_outcome_check_in')
    expect(payload.worklist.items[0]?.followUpNote).toBe('Review resume before next outreach.')
    expect(payload.worklist.items[0]?.followUpUpdatedBy?.userId).toBe('admin_123')
    expect(payload.worklist.items[0]?.followUpHistory).toHaveLength(1)
    expect(payload.worklist.followUpSummary.followUpDue).toBe(1)
    expect(mockAuditLog).toHaveBeenCalled()
  })
})
