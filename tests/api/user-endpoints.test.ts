/**
 * User API Endpoints Tests
 * Tests for user-facing data synchronization routes
 */

import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock environment variables
vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-service-role-key')

// Mock Supabase response
const mockSupabaseResponse = {
  data: null as unknown,
  error: null as Error | null
}

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve(mockSupabaseResponse)),
          order: vi.fn(() => Promise.resolve(mockSupabaseResponse)),
          abortSignal: vi.fn(() => Promise.resolve(mockSupabaseResponse))
        })),
        abortSignal: vi.fn(() => Promise.resolve(mockSupabaseResponse))
      })),
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve(mockSupabaseResponse))
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve(mockSupabaseResponse))
        }))
      }))
    }))
  }))
}))

// Helper to create NextRequest
function createRequest(
  url: string,
  options: {
    method?: string
    body?: object
  } = {}
): NextRequest {
  const { method = 'GET', body } = options

  return new NextRequest(new URL(url, 'http://localhost:3000'), {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

describe('Platform State API (/api/user/platform-state)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabaseResponse.data = {
      user_id: 'player_123',
      current_scene: 'samuel_intro',
      global_flags: ['met_samuel'],
      patterns: { analytical: 5, helping: 3 }
    }
    mockSupabaseResponse.error = null
  })

  describe('POST /api/user/platform-state', () => {
    test('should reject request without user_id', async () => {
      const { POST } = await import('@/app/api/user/platform-state/route')

      const request = createRequest('http://localhost:3000/api/user/platform-state', {
        method: 'POST',
        body: { current_scene: 'samuel_intro' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('user_id')
    })

    test('should upsert platform state with valid data', async () => {
      const { POST } = await import('@/app/api/user/platform-state/route')

      const request = createRequest('http://localhost:3000/api/user/platform-state', {
        method: 'POST',
        body: {
          user_id: 'player_123',
          current_scene: 'maya_introduction',
          global_flags: ['met_samuel', 'met_maya'],
          patterns: {
            analytical: 5,
            helping: 3,
            building: 2,
            patience: 4,
            exploring: 1
          }
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    test('should handle minimal payload (user_id only)', async () => {
      const { POST } = await import('@/app/api/user/platform-state/route')

      const request = createRequest('http://localhost:3000/api/user/platform-state', {
        method: 'POST',
        body: { user_id: 'player_123' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    test('should handle database errors gracefully', async () => {
      mockSupabaseResponse.data = null
      mockSupabaseResponse.error = new Error('Database connection failed')

      const { POST } = await import('@/app/api/user/platform-state/route')

      const request = createRequest('http://localhost:3000/api/user/platform-state', {
        method: 'POST',
        body: { user_id: 'player_123' }
      })

      const response = await POST(request)

      expect(response.status).toBe(500)
    })
  })

  describe('GET /api/user/platform-state', () => {
    test('should reject request without userId parameter', async () => {
      const { GET } = await import('@/app/api/user/platform-state/route')

      const request = createRequest('http://localhost:3000/api/user/platform-state')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('userId')
    })

    test('should return state for valid userId', async () => {
      const { GET } = await import('@/app/api/user/platform-state/route')

      const url = new URL('http://localhost:3000/api/user/platform-state')
      url.searchParams.set('userId', 'player_123')
      const request = createRequest(url.toString())

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    test('should return null for non-existent user', async () => {
      mockSupabaseResponse.data = null
      mockSupabaseResponse.error = { code: 'PGRST116' } as unknown as Error

      const { GET } = await import('@/app/api/user/platform-state/route')

      const url = new URL('http://localhost:3000/api/user/platform-state')
      url.searchParams.set('userId', 'non_existent_user')
      const request = createRequest(url.toString())

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.state).toBeNull()
    })
  })
})

describe('Relationship Progress API (/api/user/relationship-progress)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabaseResponse.data = {
      user_id: 'player_123',
      character_name: 'maya',
      trust_level: 5,
      relationship_status: 'acquaintance'
    }
    mockSupabaseResponse.error = null
  })

  describe('POST /api/user/relationship-progress', () => {
    test('should reject request without required fields', async () => {
      const { POST } = await import('@/app/api/user/relationship-progress/route')

      const request = createRequest('http://localhost:3000/api/user/relationship-progress', {
        method: 'POST',
        body: { user_id: 'player_123' } // missing character_name and trust_level
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeTruthy()
    })

    test('should upsert relationship with valid data', async () => {
      const { POST } = await import('@/app/api/user/relationship-progress/route')

      const request = createRequest('http://localhost:3000/api/user/relationship-progress', {
        method: 'POST',
        body: {
          user_id: 'player_123',
          character_name: 'maya',
          trust_level: 7,
          relationship_status: 'friend'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })

  describe('GET /api/user/relationship-progress', () => {
    test('should reject request without userId', async () => {
      const { GET } = await import('@/app/api/user/relationship-progress/route')

      const request = createRequest('http://localhost:3000/api/user/relationship-progress')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('userId')
    })

    test('should return relationships for valid userId', async () => {
      mockSupabaseResponse.data = [
        { user_id: 'player_123', character_name: 'maya', trust_level: 5 },
        { user_id: 'player_123', character_name: 'devon', trust_level: 3 }
      ]

      const { GET } = await import('@/app/api/user/relationship-progress/route')

      const url = new URL('http://localhost:3000/api/user/relationship-progress')
      url.searchParams.set('userId', 'player_123')
      const request = createRequest(url.toString())

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })
})

describe('Skill Demonstrations API (/api/user/skill-demonstrations)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabaseResponse.data = {
      id: '1',
      user_id: 'player_123',
      skill_name: 'Problem Solving',
      scene_id: 'maya_intro_01',
      demonstrated_at: new Date().toISOString()
    }
    mockSupabaseResponse.error = null
  })

  describe('POST /api/user/skill-demonstrations', () => {
    test('should reject request without required fields', async () => {
      const { POST } = await import('@/app/api/user/skill-demonstrations/route')

      const request = createRequest('http://localhost:3000/api/user/skill-demonstrations', {
        method: 'POST',
        body: { user_id: 'player_123' } // missing skill_name, scene_id
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('skill_name')
    })

    test('should insert skill demonstration with valid data', async () => {
      const { POST } = await import('@/app/api/user/skill-demonstrations/route')

      const request = createRequest('http://localhost:3000/api/user/skill-demonstrations', {
        method: 'POST',
        body: {
          user_id: 'player_123',
          skill_name: 'Problem Solving',
          scene_id: 'maya_intro_01',
          scene_description: 'First meeting with Maya',
          choice_text: 'Ask about her project',
          context: 'Showed curiosity about robotics'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })
})

describe('Profile API (/api/user/profile)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabaseResponse.data = {
      user_id: 'player_123',
      created_at: new Date().toISOString()
    }
    mockSupabaseResponse.error = null
  })

  describe('POST /api/user/profile', () => {
    test('should reject request without user_id', async () => {
      const { POST } = await import('@/app/api/user/profile/route')

      const request = createRequest('http://localhost:3000/api/user/profile', {
        method: 'POST',
        body: {}
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('user_id')
    })

    test('should create profile with valid user_id', async () => {
      const { POST } = await import('@/app/api/user/profile/route')

      const request = createRequest('http://localhost:3000/api/user/profile', {
        method: 'POST',
        body: { user_id: 'player_123' }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })

  describe('GET /api/user/profile', () => {
    test('should reject request without userId', async () => {
      const { GET } = await import('@/app/api/user/profile/route')

      const request = createRequest('http://localhost:3000/api/user/profile')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('userId')
    })

    test('should return profile for valid userId', async () => {
      const { GET } = await import('@/app/api/user/profile/route')

      const url = new URL('http://localhost:3000/api/user/profile')
      url.searchParams.set('userId', 'player_123')
      const request = createRequest(url.toString())

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    test('should return null profile for non-existent user', async () => {
      mockSupabaseResponse.data = null
      mockSupabaseResponse.error = { code: 'PGRST116' } as unknown as Error

      const { GET } = await import('@/app/api/user/profile/route')

      const url = new URL('http://localhost:3000/api/user/profile')
      url.searchParams.set('userId', 'non_existent')
      const request = createRequest(url.toString())

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.profile).toBeNull()
    })
  })
})
