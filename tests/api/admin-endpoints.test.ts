/**
 * Admin API Endpoints Tests
 * Tests authentication, authorization, and data retrieval for admin routes
 */

import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock environment variables
const MOCK_ADMIN_TOKEN = 'test-admin-token-12345'

vi.stubEnv('ADMIN_API_TOKEN', MOCK_ADMIN_TOKEN)
vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-service-role-key')

// Mock Supabase client
const mockSupabaseResponse = {
  data: null as unknown,
  error: null as Error | null
}

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

// Mock rate limiter
vi.mock('@/lib/rate-limit', () => ({
  rateLimit: () => ({
    check: vi.fn().mockResolvedValue(undefined)
  })
}))

// Mock audit logger
vi.mock('@/lib/audit-logger', () => ({
  auditLog: vi.fn()
}))

// No need to mock admin-session anymore - using simple comparison

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

describe('Admin Auth API (/api/admin/auth)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabaseResponse.data = null
    mockSupabaseResponse.error = null
  })

  test('should reject login with missing password', async () => {
    const { POST } = await import('@/app/api/admin/auth/route')

    const request = createRequest('http://localhost:3000/api/admin/auth', {
      method: 'POST',
      body: {}
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    // Error message varies: "Password required" or "Invalid input: expected string"
    expect(data.error).toBeTruthy()
  })

  test('should reject login with wrong password', async () => {
    const { POST } = await import('@/app/api/admin/auth/route')

    const request = createRequest('http://localhost:3000/api/admin/auth', {
      method: 'POST',
      body: { password: 'wrong-password' }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Invalid password')
  })

  test('should accept login with correct password', async () => {
    const { POST } = await import('@/app/api/admin/auth/route')

    const request = createRequest('http://localhost:3000/api/admin/auth', {
      method: 'POST',
      body: { password: MOCK_ADMIN_TOKEN }
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)

    // Should set auth cookie
    const setCookie = response.headers.get('set-cookie')
    expect(setCookie).toContain('admin_auth_token')
  })

  test('should clear cookie on logout', async () => {
    const { DELETE } = await import('@/app/api/admin/auth/route')

    const request = createRequest('http://localhost:3000/api/admin/auth', {
      method: 'DELETE',
      cookies: { admin_auth_token: MOCK_ADMIN_TOKEN }
    })

    const response = await DELETE(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })
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

  test('should reject requests with invalid token', async () => {
    const { GET } = await import('@/app/api/admin/user-ids/route')

    const request = createRequest('http://localhost:3000/api/admin/user-ids', {
      cookies: { admin_auth_token: 'invalid-token' }
    })

    const response = await GET(request)

    expect(response.status).toBe(401)
  })

  test('should return user IDs for authenticated admin', async () => {
    const { GET } = await import('@/app/api/admin/user-ids/route')

    const request = createRequest('http://localhost:3000/api/admin/user-ids', {
      cookies: { admin_auth_token: MOCK_ADMIN_TOKEN }
    })

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.userIds).toEqual(['player_123', 'player_456'])
  })

  test('should handle database errors gracefully', async () => {
    mockSupabaseResponse.data = null
    mockSupabaseResponse.error = new Error('Database connection failed')

    const { GET } = await import('@/app/api/admin/user-ids/route')

    const request = createRequest('http://localhost:3000/api/admin/user-ids', {
      cookies: { admin_auth_token: MOCK_ADMIN_TOKEN }
    })

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBeTruthy()
  })
})

describe('Admin Auth Helper Functions', () => {
  test('requireAdminAuth should return null for valid token', async () => {
    const { requireAdminAuth } = await import('@/lib/admin-supabase-client')

    const request = createRequest('http://localhost:3000/api/admin/test', {
      cookies: { admin_auth_token: MOCK_ADMIN_TOKEN }
    })

    const result = requireAdminAuth(request)
    expect(result).toBeNull()
  })

  test('requireAdminAuth should return error response for missing token', async () => {
    const { requireAdminAuth } = await import('@/lib/admin-supabase-client')

    const request = createRequest('http://localhost:3000/api/admin/test')

    const result = requireAdminAuth(request)
    expect(result).not.toBeNull()
    expect(result?.status).toBe(401)
  })

  test('requireAdminAuth should return error response for invalid token', async () => {
    const { requireAdminAuth } = await import('@/lib/admin-supabase-client')

    const request = createRequest('http://localhost:3000/api/admin/test', {
      cookies: { admin_auth_token: 'wrong-token' }
    })

    const result = requireAdminAuth(request)
    expect(result).not.toBeNull()
    expect(result?.status).toBe(401)
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
    vi.clearAllMocks()
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
    const { GET } = await import('@/app/api/admin/check-profile/route')

    const request = createRequest('http://localhost:3000/api/admin/check-profile', {
      cookies: { admin_auth_token: MOCK_ADMIN_TOKEN }
    })

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('userId')
  })
})

describe('Rate Limiting', () => {
  test('should enforce rate limits on login attempts', async () => {
    // Mock rate limiter to throw (rate limit exceeded)
    vi.doMock('@/lib/rate-limit', () => ({
      rateLimit: () => ({
        check: vi.fn().mockRejectedValue(new Error('Rate limited'))
      })
    }))

    // Re-import to get new mock
    vi.resetModules()
    const { POST } = await import('@/app/api/admin/auth/route')

    const request = createRequest('http://localhost:3000/api/admin/auth', {
      method: 'POST',
      body: { password: 'any' }
    })

    const response = await POST(request)

    expect(response.status).toBe(429)
  })
})
