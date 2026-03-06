import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

import { GET, PUT } from '@/app/api/user/research-consent/route'
import {
  createUserSessionToken,
  USER_SESSION_COOKIE_NAME,
} from '@/lib/api/user-session'

const TEST_USER_ID = '11111111-1111-1111-1111-111111111111'

const {
  mockGetSupabaseServerClient,
} = vi.hoisted(() => ({
  mockGetSupabaseServerClient: vi.fn(),
}))

let mockTables: Record<string, Array<Record<string, unknown>>> = {}
let relationMissingTables = new Set<string>()

function relationMissingError(tableName: string) {
  return {
    code: '42P01',
    message: `relation "${tableName}" does not exist`,
  }
}

function createSupabaseMock() {
  return {
    from: (tableName: string) => ({
      select: () => ({
        eq: (column: string, value: unknown) => ({
          single: async () => {
            if (relationMissingTables.has(tableName)) {
              return { data: null, error: relationMissingError(tableName) }
            }

            const rows = mockTables[tableName] ?? []
            const row = rows.find((candidate) => candidate[column] === value) ?? null
            if (!row) {
              return {
                data: null,
                error: { code: 'PGRST116', message: 'No rows found' },
              }
            }

            return { data: row, error: null }
          },
        }),
      }),
      upsert: (row: Record<string, unknown>) => ({
        select: () => ({
          single: async () => {
            if (relationMissingTables.has(tableName)) {
              return { data: null, error: relationMissingError(tableName) }
            }

            const rows = mockTables[tableName] ?? []
            const keyField = 'user_id' in row
              ? 'user_id'
              : 'player_id' in row
                ? 'player_id'
                : null
            const keyValue = keyField ? row[keyField] : null
            const existingIndex =
              keyField && keyValue
                ? rows.findIndex((candidate) => candidate[keyField] === keyValue)
                : -1
            const nextRow =
              existingIndex >= 0
                ? { ...rows[existingIndex], ...row }
                : { ...row }

            if (existingIndex >= 0) {
              rows[existingIndex] = nextRow
            } else {
              rows.push(nextRow)
            }

            mockTables[tableName] = rows

            return { data: nextRow, error: null }
          },
        }),
      }),
    }),
  }
}

vi.mock('@/lib/supabase-server', () => ({
  getSupabaseServerClient: mockGetSupabaseServerClient,
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: () => ({
    check: vi.fn().mockResolvedValue(undefined),
  }),
  getClientIp: vi.fn(() => '127.0.0.1'),
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}))

function createRequest(
  url: string,
  options: {
    method?: 'GET' | 'PUT'
    body?: Record<string, unknown>
    userId?: string
  } = {}
): NextRequest {
  const request = new NextRequest(new URL(url, 'http://localhost:3000'), {
    method: options.method ?? 'GET',
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (options.userId) {
    request.cookies.set(
      USER_SESSION_COOKIE_NAME,
      createUserSessionToken(options.userId)
    )
  }

  return request
}

describe('User Research Consent API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    relationMissingTables = new Set<string>()
    mockTables = {
      player_profiles: [],
      research_participant_consents: [],
    }

    mockGetSupabaseServerClient.mockReturnValue(createSupabaseMock())
  })

  it('rejects unauthenticated consent reads', async () => {
    const request = createRequest('/api/user/research-consent')

    const response = await GET(request)

    expect(response.status).toBe(401)
  })

  it('returns null when no consent record exists', async () => {
    const request = createRequest(
      `/api/user/research-consent?userId=${TEST_USER_ID}`,
      { userId: TEST_USER_ID }
    )

    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.consent).toBeNull()
  })

  it('saves granted individual research consent and bootstraps the player profile', async () => {
    const request = createRequest('/api/user/research-consent', {
      method: 'PUT',
      userId: TEST_USER_ID,
      body: {
        user_id: TEST_USER_ID,
        consent_enabled: true,
        consent_scope: 'individual_research',
        guardian_required: false,
        guardian_verified: false,
      },
    })

    const response = await PUT(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.consent).toMatchObject({
      status: 'granted',
      scope: 'individual_research',
      selectedParticipation: 'individual_research',
      allowsIdentifiedExport: true,
      allowsLongitudinalExport: false,
    })
    expect(mockTables.player_profiles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ user_id: TEST_USER_ID }),
      ])
    )
  })

  it('stores pending consent when guardian verification is still required', async () => {
    const request = createRequest('/api/user/research-consent', {
      method: 'PUT',
      userId: TEST_USER_ID,
      body: {
        user_id: TEST_USER_ID,
        consent_enabled: true,
        consent_scope: 'full_research',
        guardian_required: true,
        guardian_verified: false,
      },
    })

    const response = await PUT(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.consent).toMatchObject({
      status: 'pending',
      scope: 'full_research',
      selectedParticipation: 'full_research',
      guardianRequired: true,
      guardianVerified: false,
      allowsIdentifiedExport: false,
      allowsLongitudinalExport: false,
    })
  })

  it('revokes consent when research sharing is disabled', async () => {
    mockTables.research_participant_consents = [
      {
        user_id: TEST_USER_ID,
        consent_status: 'granted',
        consent_scope: 'full_research',
        guardian_required: false,
        guardian_verified: false,
        consented_at: '2026-03-02T10:00:00.000Z',
        revoked_at: null,
      },
    ]

    const request = createRequest('/api/user/research-consent', {
      method: 'PUT',
      userId: TEST_USER_ID,
      body: {
        user_id: TEST_USER_ID,
        consent_enabled: false,
        consent_scope: 'cohort_only',
        guardian_required: false,
        guardian_verified: false,
      },
    })

    const response = await PUT(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.consent).toMatchObject({
      status: 'revoked',
      scope: 'cohort_only',
      selectedParticipation: 'none',
      allowsIdentifiedExport: false,
      allowsLongitudinalExport: false,
    })
    expect(body.consent.revokedAt).toEqual(expect.any(String))
  })

  it('rejects user_id mismatch', async () => {
    const request = createRequest('/api/user/research-consent', {
      method: 'PUT',
      userId: TEST_USER_ID,
      body: {
        user_id: '22222222-2222-2222-2222-222222222222',
        consent_enabled: true,
        consent_scope: 'cohort_only',
        guardian_required: false,
        guardian_verified: false,
      },
    })

    const response = await PUT(request)

    expect(response.status).toBe(403)
  })

  it('fails closed when the consent registry migration is unavailable', async () => {
    relationMissingTables.add('research_participant_consents')

    const request = createRequest(
      `/api/user/research-consent?userId=${TEST_USER_ID}`,
      { userId: TEST_USER_ID }
    )

    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(412)
    expect(body.error).toContain('consent registry migration')
  })
})
