/**
 * release:security:minimum
 *
 * Prover-style gate: asserts the minimum production safety properties are true.
 * This is intentionally small, deterministic, and evidence-based.
 */

import { describe, test, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'

import { createUserSessionToken, USER_SESSION_COOKIE_NAME } from '@/lib/api/user-session'
import { hasGodModeUrlParam } from '@/lib/godmode-access'

// Supabase middleware gate requires env vars to be present (even in tests).
vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')

// Use an explicit secret so session tokens are stable/deterministic in CI.
vi.stubEnv('USER_API_SESSION_SECRET', 'test-user-session-secret')

let mockAdminUser: any | null = null
let mockAdminRole: string | null = null

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: mockAdminUser }, error: null })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: mockAdminRole ? { role: mockAdminRole } : null, error: null })),
        })),
      })),
    })),
  })),
}))

describe('release:security:minimum', () => {
  test('/api/user/session rejects non-UUID user_id in production', async () => {
    const { POST } = await import('@/app/api/user/session/route')

    const previous = process.env.NODE_ENV
    ;(process.env as any).NODE_ENV = 'production'
    try {
      const req = new NextRequest(new URL('http://localhost:3000/api/user/session'), {
        method: 'POST',
        body: JSON.stringify({ user_id: 'player_123' }),
        headers: { 'Content-Type': 'application/json' },
      })
      const res = await POST(req)
      expect(res.status).toBe(400)
    } finally {
      ;(process.env as any).NODE_ENV = previous
    }
  })

  test('/api/user/* rejects unauthenticated requests', async () => {
    const { GET: profileGET, POST: profilePOST } = await import('@/app/api/user/profile/route')
    const { POST: interactionPOST } = await import('@/app/api/user/interaction-events/route')

    const profileGetReq = new NextRequest(new URL('http://localhost:3000/api/user/profile'))
    expect((await profileGET(profileGetReq)).status).toBe(401)

    const profilePostReq = new NextRequest(new URL('http://localhost:3000/api/user/profile'), {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    })
    expect((await profilePOST(profilePostReq)).status).toBe(401)

	    const interactionReq = new NextRequest(new URL('http://localhost:3000/api/user/interaction-events'), {
	      method: 'POST',
	      body: JSON.stringify({ session_id: 's', event_type: 'choice_presented', payload: {} }),
	      headers: { 'Content-Type': 'application/json' },
	    })
	    expect((await interactionPOST(interactionReq)).status).toBe(401)
	  })

  test('/api/user/* forbids cross-user writes (user_id mismatch)', async () => {
    const { POST: profilePOST } = await import('@/app/api/user/profile/route')

    const sessionUserId = 'player_123'
    const req = new NextRequest(new URL('http://localhost:3000/api/user/profile'), {
      method: 'POST',
      body: JSON.stringify({ user_id: 'player_9999999999' }),
      headers: { 'Content-Type': 'application/json' },
    })
    req.cookies.set(USER_SESSION_COOKIE_NAME, createUserSessionToken(sessionUserId))

    expect((await profilePOST(req)).status).toBe(403)
  })

  test('/admin/* rejects unauthenticated requests (middleware gate)', async () => {
    const { updateSession } = await import('@/lib/supabase/middleware')

    mockAdminUser = null
    mockAdminRole = null
    const req = new NextRequest(new URL('http://localhost:3000/admin/users'))
    const res = await updateSession(req)

    const location = res.headers.get('Location') || ''
    expect(location).toContain('/admin/login')
    expect(location).toContain('redirect=')
  })

  test('/admin/* rejects authenticated non-admin roles (middleware gate)', async () => {
    const { updateSession } = await import('@/lib/supabase/middleware')

    mockAdminUser = { id: '00000000-0000-0000-0000-000000000000', email: 'student@example.com' }
    mockAdminRole = 'student'
    const req = new NextRequest(new URL('http://localhost:3000/admin/users'))
    const res = await updateSession(req)

    expect(res.headers.get('Location')).toContain('forbidden=admin')
  })

  test('/admin/* allows authenticated admin roles (middleware gate)', async () => {
    const { updateSession } = await import('@/lib/supabase/middleware')

    mockAdminUser = { id: '00000000-0000-0000-0000-000000000000', email: 'admin@example.com' }
    mockAdminRole = 'admin'
    const req = new NextRequest(new URL('http://localhost:3000/admin/users'))
    const res = await updateSession(req)

    expect(res.headers.get('Location')).toBeNull()
  })

  test('godmode URL param is disabled in production', () => {
    expect(hasGodModeUrlParam({ nodeEnv: 'production', search: '?godmode=true' })).toBe(false)
    expect(hasGodModeUrlParam({ nodeEnv: 'development', search: '?godmode=true' })).toBe(true)
  })

  test('/api/log-error is not a public production ingest', async () => {
    const { POST } = await import('@/app/api/log-error/route')

    const previous = process.env.NODE_ENV
    ;(process.env as any).NODE_ENV = 'production'
    try {
      const req = new Request('http://localhost:3000/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'x' }),
      })
      const res = await POST(req)
      expect(res.status).toBe(404)
    } finally {
      ;(process.env as any).NODE_ENV = previous
    }
  })

  test('/api/log-error enforces payload caps in development', async () => {
    const { POST } = await import('@/app/api/log-error/route')

    const previous = process.env.NODE_ENV
    ;(process.env as any).NODE_ENV = 'development'
    try {
      const tooLarge = 'x'.repeat(40_000)
      const req = new Request('http://localhost:3000/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: tooLarge,
      })
      const res = await POST(req)
      expect(res.status).toBe(413)
    } finally {
      ;(process.env as any).NODE_ENV = previous
    }
  })

  test('/api/log-error enforces schema validation in development', async () => {
    const { POST } = await import('@/app/api/log-error/route')

    const previous = process.env.NODE_ENV
    ;(process.env as any).NODE_ENV = 'development'
    try {
      const req = new Request('http://localhost:3000/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '' }), // min(1) violation
      })
      const res = await POST(req)
      expect(res.status).toBe(400)
    } finally {
      ;(process.env as any).NODE_ENV = previous
    }
  })
})
