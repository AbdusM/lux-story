import { beforeEach, describe, expect, test, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

const mockRequireAdminAuth = vi.fn()
const mockAuditLog = vi.fn()
const mockRateLimitCheck = vi.fn().mockResolvedValue(undefined)
const mockLoggerError = vi.fn()
const mockGetAdminSupabaseClient = vi.fn(() => ({}))

vi.mock('@/lib/admin-supabase-client', () => ({
  requireAdminAuth: mockRequireAdminAuth,
  getAdminSupabaseClient: mockGetAdminSupabaseClient,
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

describe('admin labor market signals route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRequireAdminAuth.mockResolvedValue(null)
    mockRateLimitCheck.mockResolvedValue(undefined)
    mockGetAdminSupabaseClient.mockReturnValue({})
  })

  test('returns auth error when admin access is missing', async () => {
    mockRequireAdminAuth.mockResolvedValueOnce(
      NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    )

    const { GET } = await import('@/app/api/admin/labor-market-signals/route')
    const response = await GET(createRequest('http://localhost:3000/api/admin/labor-market-signals'))

    expect(response.status).toBe(401)
  })

  test('returns labor market diagnostics for authenticated admins', async () => {
    const { GET } = await import('@/app/api/admin/labor-market-signals/route')
    const response = await GET(
      createRequest('http://localhost:3000/api/admin/labor-market-signals?warningThresholdDays=12'),
    )

    expect(response.status).toBe(200)

    const payload = await response.json()
    expect(payload.success).toBe(true)
    expect(payload.report.warningThresholdDays).toBe(12)
    expect(payload.report.datasets).toHaveLength(2)
    expect(payload.report.fallbackRisk.totalMissingCanonicalMatches).toBe(0)
    expect(mockAuditLog).toHaveBeenCalled()
    expect(mockGetAdminSupabaseClient).toHaveBeenCalled()
  })
})
