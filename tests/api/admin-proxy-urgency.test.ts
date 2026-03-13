import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

const {
  mockRequireAdminAuth,
  mockCreateClient,
  mockLoggerError,
} = vi.hoisted(() => ({
  mockRequireAdminAuth: vi.fn(),
  mockCreateClient: vi.fn(),
  mockLoggerError: vi.fn(),
}))

vi.mock('@/lib/admin-supabase-client', () => ({
  requireAdminAuth: mockRequireAdminAuth,
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: mockCreateClient,
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    error: mockLoggerError,
  },
}))

import { GET, POST } from '@/app/api/admin-proxy/urgency/route'

function createRequest(
  url: string,
  options: {
    method?: string
    headers?: Record<string, string>
  } = {},
): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost:3000'), {
    method: options.method ?? 'GET',
    headers: options.headers,
  })
}

describe('admin-proxy urgency route', () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', mockFetch)
    vi.unstubAllEnvs()
    mockRequireAdminAuth.mockResolvedValue(null)
  })

  it('rejects unauthorized requests before proxying', async () => {
    mockRequireAdminAuth.mockResolvedValue(
      NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    )

    const response = await GET(createRequest('/api/admin-proxy/urgency?userId=player_123'))

    expect(response.status).toBe(401)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('proxies single-user urgency lookups with forwarded cookies', async () => {
    vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'https://internal.example')
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ user: { userId: 'player_123', urgencyLevel: 'high' } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const request = createRequest('/api/admin-proxy/urgency?userId=player_123', {
      headers: { cookie: 'sb-access-token=test-cookie' },
    })

    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.user).toEqual({ userId: 'player_123', urgencyLevel: 'high' })
    expect(mockFetch).toHaveBeenCalledWith(
      'https://internal.example/api/admin/urgency?userId=player_123',
      expect.objectContaining({
        headers: expect.objectContaining({
          Cookie: 'sb-access-token=test-cookie',
          'Content-Type': 'application/json',
        }),
      }),
    )
  })

  it('returns an empty student list when all-students mode lacks Supabase env', async () => {
    const response = await GET(createRequest('/api/admin-proxy/urgency?level=all-students'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.students).toEqual([])
    expect(mockCreateClient).not.toHaveBeenCalled()
  })

  it('returns direct Supabase student rows for all-students mode', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role-key')

    mockCreateClient.mockReturnValue({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(async () => ({
              data: [
                { user_id: 'player_1', last_activity: '2026-03-10T12:00:00.000Z' },
                { user_id: 'player_2', last_activity: null },
              ],
              error: null,
            })),
          })),
        })),
      })),
    })

    const response = await GET(createRequest('/api/admin-proxy/urgency?level=all-students'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.students).toHaveLength(2)
    expect(body.students[0]).toMatchObject({
      userId: 'player_1',
      urgencyLevel: 'pending',
      urgencyScore: 0,
    })
    expect(body.students[1].lastActivity).toBe(new Date(0).toISOString())
  })

  it('recalculates urgency through the upstream admin endpoint', async () => {
    vi.stubEnv('VERCEL_URL', 'lux-story.vercel.app')
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ success: true, recalculated: 12 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const request = createRequest('/api/admin-proxy/urgency', {
      method: 'POST',
      headers: { cookie: 'sb-access-token=test-cookie' },
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({ success: true, recalculated: 12 })
    expect(mockFetch).toHaveBeenCalledWith(
      'https://lux-story.vercel.app/api/admin/urgency',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Cookie: 'sb-access-token=test-cookie',
          'Content-Type': 'application/json',
        }),
      }),
    )
  })
})
