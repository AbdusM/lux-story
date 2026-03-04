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

  test('/api/advisor-briefing rejects unauthenticated requests', async () => {
    const { POST } = await import('@/app/api/advisor-briefing/route')

    mockAdminUser = null
    mockAdminRole = null

    const req = new NextRequest(new URL('http://localhost:3000/api/advisor-briefing'), {
      method: 'POST',
      body: JSON.stringify({ profile: { totalDemonstrations: 1 } }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  test('/api/advisor-briefing returns 400 for malformed JSON payloads', async () => {
    const { POST } = await import('@/app/api/advisor-briefing/route')

    mockAdminUser = { id: '00000000-0000-0000-0000-000000000000', email: 'admin@example.com' }
    mockAdminRole = 'admin'

    const req = new NextRequest(new URL('http://localhost:3000/api/advisor-briefing'), {
      method: 'POST',
      body: '{"profile":',
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body?.error).toBe('Invalid JSON payload')
  })

  test('/api/samuel-dialogue rejects unauthenticated requests', async () => {
    const { POST } = await import('@/app/api/samuel-dialogue/route')

    const req = new NextRequest(new URL('http://localhost:3000/api/samuel-dialogue'), {
      method: 'POST',
      body: JSON.stringify({ nodeId: 'samuel_hub_initial' }),
      headers: { 'Content-Type': 'application/json' },
    })

    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  test('/api/samuel-dialogue returns 400 for malformed JSON payloads', async () => {
    const { POST } = await import('@/app/api/samuel-dialogue/route')

    const req = new NextRequest(new URL('http://localhost:3000/api/samuel-dialogue'), {
      method: 'POST',
      body: '{"nodeId":',
      headers: { 'Content-Type': 'application/json' },
    })
    req.cookies.set(USER_SESSION_COOKIE_NAME, createUserSessionToken('00000000-0000-0000-0000-000000000001'))

    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body?.error).toBe('Invalid JSON payload')
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

  test('middleware blocks debug test surfaces in production', async () => {
    const { middleware } = await import('@/middleware')

    const previous = process.env.NODE_ENV
    ;(process.env as any).NODE_ENV = 'production'
    try {
      const pageReq = new NextRequest(new URL('http://localhost:3000/test-env'))
      const pageRes = await middleware(pageReq)
      expect(pageRes.status).toBe(404)

      const apiReq = new NextRequest(new URL('http://localhost:3000/api/test-env'))
      const apiRes = await middleware(apiReq)
      expect(apiRes.status).toBe(404)
    } finally {
      ;(process.env as any).NODE_ENV = previous
    }
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

  test('/api/health/storage reports healthy server contract', async () => {
    const { GET } = await import('@/app/api/health/storage/route')
    const res = await GET()
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body?.status).toBe('healthy')
    expect(body?.checks?.clientStorage).toBe('deferred-to-client')
  })

  test('production CSP in next config excludes unsafe-eval', async () => {
    const previous = process.env.NODE_ENV
    ;(process.env as any).NODE_ENV = 'production'
    try {
      const nextConfigModule = await import('../../../next.config.js')
      const config = nextConfigModule.default as {
        headers?: () => Promise<Array<{ headers: Array<{ key: string; value: string }> }>>
      }

      expect(typeof config.headers).toBe('function')
      const headerSets = await config.headers!()
      const csp = headerSets[0]?.headers.find((header) => header.key === 'Content-Security-Policy')?.value ?? ''

      expect(csp).not.toContain("'unsafe-eval'")
    } finally {
      ;(process.env as any).NODE_ENV = previous
    }
  })

  test('/api/user write routes fail closed when Supabase is not configured', async () => {
    const { POST } = await import('@/app/api/user/platform-state/route')

    const prevPublicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const prevServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.SUPABASE_SERVICE_ROLE_KEY

    try {
      const req = new NextRequest(new URL('http://localhost:3000/api/user/platform-state'), {
        method: 'POST',
        body: JSON.stringify({ current_scene: 'samuel_introduction' }),
        headers: { 'Content-Type': 'application/json' },
      })
      req.cookies.set(USER_SESSION_COOKIE_NAME, createUserSessionToken('player_123'))

      const res = await POST(req)
      const body = await res.json()
      expect(res.status).toBe(503)
      expect(body?.code).toBe('SUPABASE_NOT_CONFIGURED')
    } finally {
      if (typeof prevPublicUrl === 'string') process.env.NEXT_PUBLIC_SUPABASE_URL = prevPublicUrl
      if (typeof prevServiceRole === 'string') process.env.SUPABASE_SERVICE_ROLE_KEY = prevServiceRole
    }
  })
})
