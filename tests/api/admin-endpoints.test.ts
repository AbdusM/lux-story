/**
 * Admin API Endpoints Tests
 * Tests authentication, authorization, and data retrieval for admin routes
 */

import { describe, test, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock environment variables
const MOCK_ADMIN_TOKEN = 'test-admin-token-12345'

vi.stubEnv('ADMIN_API_TOKEN', MOCK_ADMIN_TOKEN)
vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')
vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-service-role-key')

// Mock Supabase client
const mockSupabaseResponse = {
  data: null as unknown,
  error: null as Error | null
}

let mockAuthUser: { id: string } | null = null
let mockAuthError: Error | null = null
let mockProfileRole: string | null = null
let mockProfileError: Error | null = null

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          abortSignal: vi.fn(() => Promise.resolve(mockSupabaseResponse))
        })),
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve(mockSupabaseResponse)),
          abortSignal: vi.fn(() => Promise.resolve(mockSupabaseResponse))
        })),
        abortSignal: vi.fn(() => Promise.resolve(mockSupabaseResponse))
      })),
      upsert: vi.fn(() => ({
        select: vi.fn(() => Promise.resolve(mockSupabaseResponse))
      }))
    }))
  }))
}))

// Mock Supabase SSR client (used by admin-supabase-client.ts)
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: mockAuthUser }, error: mockAuthError }))
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: mockProfileRole ? { role: mockProfileRole } : null,
            error: mockProfileError
          }))
        }))
      }))
    }))
  }))
}))

// Mock rate limiter
vi.mock('@/lib/rate-limit', () => ({
  rateLimit: () => ({
    check: vi.fn().mockResolvedValue(undefined)
  }),
  getClientIp: vi.fn().mockReturnValue('127.0.0.1')
}))

// Mock audit logger
vi.mock('@/lib/audit-logger', () => ({
  auditLog: vi.fn()
}))

// Mock logger (used by admin-supabase-client for emergency token logging)
vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}))

// Helper to create request with cookies
function createRequest(
  url: string,
  options: {
    method?: string
    body?: object
    cookies?: Record<string, string>
    headers?: Record<string, string>
  } = {}
): NextRequest {
  const { method = 'GET', body, cookies = {}, headers = {} } = options

  const request = new NextRequest(new URL(url, 'http://localhost:3000'), {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  })

  // Add cookies
  Object.entries(cookies).forEach(([name, value]) => {
    request.cookies.set(name, value)
  })

  return request
}

beforeEach(() => {
  vi.clearAllMocks()
  mockAuthUser = null
  mockAuthError = null
  mockProfileRole = null
  mockProfileError = null
  mockSupabaseResponse.data = null
  mockSupabaseResponse.error = null
})

describe('Admin User IDs API (/api/admin/user-ids)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabaseResponse.data = [
      { user_id: 'player_123', last_activity: '2024-01-01' },
      { user_id: 'player_456', last_activity: '2024-01-02' }
    ]
    mockSupabaseResponse.error = null
  })

  test('should reject unauthenticated requests', async () => {
    const { GET } = await import('@/app/api/admin/user-ids/route')

    const request = createRequest('http://localhost:3000/api/admin/user-ids')

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toContain('Unauthorized')
  })

  test('should reject requests from non-admin users', async () => {
    mockAuthUser = { id: 'user-123' }
    mockProfileRole = 'student'

    const { GET } = await import('@/app/api/admin/user-ids/route')

    const request = createRequest('http://localhost:3000/api/admin/user-ids')

    const response = await GET(request)

    expect(response.status).toBe(403)
  })

  test('should return user IDs for authenticated admin', async () => {
    mockAuthUser = { id: 'admin-123' }
    mockProfileRole = 'admin'

    const { GET } = await import('@/app/api/admin/user-ids/route')

    const request = createRequest('http://localhost:3000/api/admin/user-ids')

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.userIds).toEqual(['player_123', 'player_456'])
  })

  test('should handle database errors gracefully', async () => {
    mockAuthUser = { id: 'admin-123' }
    mockProfileRole = 'admin'
    mockSupabaseResponse.data = null
    mockSupabaseResponse.error = new Error('Database connection failed')

    const { GET } = await import('@/app/api/admin/user-ids/route')

    const request = createRequest('http://localhost:3000/api/admin/user-ids')

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBeTruthy()
  })
})

describe('Admin Auth Helper Functions', () => {
  test('requireAdminAuth should return null for valid admin role', async () => {
    mockAuthUser = { id: 'admin-123' }
    mockProfileRole = 'admin'

    const { requireAdminAuth } = await import('@/lib/admin-supabase-client')

    const request = createRequest('http://localhost:3000/api/admin/test')

    const result = await requireAdminAuth(request)
    expect(result).toBeNull()
  })

  test('requireAdminAuth should return error response for missing user', async () => {
    const { requireAdminAuth } = await import('@/lib/admin-supabase-client')

    const request = createRequest('http://localhost:3000/api/admin/test')

    const result = await requireAdminAuth(request)
    expect(result).not.toBeNull()
    expect(result?.status).toBe(401)
  })

  test('requireAdminAuth should return error response for non-admin role', async () => {
    mockAuthUser = { id: 'user-123' }
    mockProfileRole = 'student'

    const { requireAdminAuth } = await import('@/lib/admin-supabase-client')

    const request = createRequest('http://localhost:3000/api/admin/test')

    const result = await requireAdminAuth(request)
    expect(result).not.toBeNull()
    expect(result?.status).toBe(403)
  })

  test('getAdminSupabaseClient should return client when env vars are set', async () => {
    const { getAdminSupabaseClient } = await import('@/lib/admin-supabase-client')

    const client = getAdminSupabaseClient()
    expect(client).toBeTruthy()
    expect(client.from).toBeDefined()
  })
})

describe('Admin Check Profile API (/api/admin/check-profile)', () => {
  beforeEach(() => {
    mockSupabaseResponse.data = { user_id: 'player_123', patterns: {} }
    mockSupabaseResponse.error = null
  })

  test('should reject unauthenticated requests', async () => {
    const { GET } = await import('@/app/api/admin/check-profile/route')

    const url = new URL('http://localhost:3000/api/admin/check-profile')
    url.searchParams.set('userId', 'player_123')
    const request = createRequest(url.toString())

    const response = await GET(request)

    expect(response.status).toBe(401)
  })

  test('should require userId parameter', async () => {
    mockAuthUser = { id: 'admin-123' }
    mockProfileRole = 'admin'

    const { GET } = await import('@/app/api/admin/check-profile/route')

    const request = createRequest('http://localhost:3000/api/admin/check-profile')

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('userId')
  })
})

describe('Rate Limiting', () => {
  test('should enforce rate limits on admin user list', async () => {
    // Mock rate limiter to throw (rate limit exceeded)
    vi.doMock('@/lib/rate-limit', () => ({
      rateLimit: () => ({
        check: vi.fn().mockRejectedValue(new Error('Rate limited'))
      }),
      getClientIp: vi.fn().mockReturnValue('127.0.0.1')
    }))

    // Re-import to get new mock
    vi.resetModules()
    mockAuthUser = { id: 'admin-123' }
    mockProfileRole = 'admin'

    const { GET } = await import('@/app/api/admin/user-ids/route')
    const request = createRequest('http://localhost:3000/api/admin/user-ids')

    const response = await GET(request)

    expect(response.status).toBe(429)
  })
})
