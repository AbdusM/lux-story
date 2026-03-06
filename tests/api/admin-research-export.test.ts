import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/admin/research-export/route'

const {
  mockRequireAdminAuth,
  mockGetAdminSupabaseClient,
  mockAuditLog,
} = vi.hoisted(() => ({
  mockRequireAdminAuth: vi.fn(),
  mockGetAdminSupabaseClient: vi.fn(),
  mockAuditLog: vi.fn(),
}))

let mockTables: Record<string, Array<Record<string, unknown>>> = {}
let mockErrors: Record<string, { code: string; message: string }> = {}

function createSelectQuery(tableName: string) {
  const rows = mockTables[tableName] ?? []
  const error = mockErrors[tableName] ?? null

  return {
    eq: (column: string, value: unknown) =>
      Promise.resolve({
        data: error ? null : rows.filter((row) => row[column] === value),
        error,
      }),
    then: (
      resolve: (value: {
        data: Array<Record<string, unknown>> | null
        error: { code: string; message: string } | null
      }) => unknown
    ) =>
      Promise.resolve(
        resolve({
          data: error ? null : rows,
          error,
        })
      ),
  }
}

vi.mock('@/lib/admin-supabase-client', () => ({
  requireAdminAuth: mockRequireAdminAuth,
  getAdminSupabaseClient: mockGetAdminSupabaseClient,
}))

vi.mock('@/lib/audit-logger', () => ({
  auditLog: mockAuditLog,
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
  },
}))

describe('Admin Research Export API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockErrors = {}

    mockTables = {
      player_profiles: [
        {
          user_id: '11111111-1111-1111-1111-111111111111',
          created_at: '2026-03-01T09:00:00.000Z',
          updated_at: '2026-03-06T12:00:00.000Z',
          last_activity: '2026-03-06T12:00:00.000Z',
          total_demonstrations: 2,
        },
        {
          user_id: '22222222-2222-2222-2222-222222222222',
          created_at: '2026-03-02T09:00:00.000Z',
          updated_at: '2026-03-05T15:30:00.000Z',
          last_activity: '2026-03-05T15:30:00.000Z',
          total_demonstrations: 1,
        },
      ],
      player_behavioral_profiles: [
        {
          player_id: '11111111-1111-1111-1111-111111111111',
          response_speed: 'quick',
          stress_response: 'adaptive',
          social_orientation: 'collaborator',
          problem_approach: 'analytical',
          communication_style: 'thoughtful',
          cultural_alignment: 0.82,
          total_choices: 24,
          avg_response_time_ms: 4100,
          updated_at: '2026-03-06T12:00:00.000Z',
        },
        {
          player_id: '22222222-2222-2222-2222-222222222222',
          response_speed: 'moderate',
          stress_response: 'calm',
          social_orientation: 'helper',
          problem_approach: 'practical',
          communication_style: 'reserved',
          cultural_alignment: 0.73,
          total_choices: 11,
          avg_response_time_ms: 5300,
          updated_at: '2026-03-05T15:30:00.000Z',
        },
      ],
      pattern_demonstrations: [
        {
          user_id: '11111111-1111-1111-1111-111111111111',
          pattern_name: 'analytical',
          demonstrated_at: '2026-03-03T12:00:00.000Z',
          scene_id: 'maya_intro',
        },
        {
          user_id: '11111111-1111-1111-1111-111111111111',
          pattern_name: 'analytical',
          demonstrated_at: '2026-03-04T12:00:00.000Z',
          scene_id: 'devon_debug',
        },
        {
          user_id: '11111111-1111-1111-1111-111111111111',
          pattern_name: 'helping',
          demonstrated_at: '2026-03-06T12:00:00.000Z',
          scene_id: 'samuel_guidance',
        },
        {
          user_id: '22222222-2222-2222-2222-222222222222',
          pattern_name: 'helping',
          demonstrated_at: '2026-03-05T15:30:00.000Z',
          scene_id: 'maya_intro',
        },
      ],
      skill_demonstrations: [
        {
          user_id: '11111111-1111-1111-1111-111111111111',
          skill_name: 'criticalThinking',
          scene_id: 'maya_intro',
          scene_description: 'Maya intro scene',
          choice_text: 'Ask how the system works',
          context: 'Analyzed the system constraints',
          demonstrated_at: '2026-03-03T12:00:00.000Z',
        },
        {
          user_id: '11111111-1111-1111-1111-111111111111',
          skill_name: 'digitalLiteracy',
          scene_id: 'devon_debug',
          scene_description: 'Devon debug scene',
          choice_text: 'Inspect the error logs',
          context: 'Used digital tooling to diagnose the issue',
          demonstrated_at: '2026-03-06T12:00:00.000Z',
        },
        {
          user_id: '22222222-2222-2222-2222-222222222222',
          skill_name: 'communication',
          scene_id: 'maya_intro',
          scene_description: 'Maya intro scene',
          choice_text: 'Offer support',
          context: 'Built trust through active listening',
          demonstrated_at: '2026-03-05T15:30:00.000Z',
        },
      ],
      career_explorations: [
        {
          user_id: '11111111-1111-1111-1111-111111111111',
          career_name: 'Community Data Analyst',
          match_score: 0.84,
          readiness_level: 'near_ready',
          local_opportunities: ['City of Birmingham', 'UAB Research'],
          education_paths: ['UAB Data Science'],
          explored_at: '2026-03-04T14:00:00.000Z',
        },
        {
          user_id: '11111111-1111-1111-1111-111111111111',
          career_name: 'Cybersecurity Specialist',
          match_score: 0.58,
          readiness_level: 'emerging',
          local_opportunities: ['Regions Bank'],
          education_paths: ['UAB Computer Science'],
          explored_at: '2026-03-06T14:00:00.000Z',
        },
        {
          user_id: '22222222-2222-2222-2222-222222222222',
          career_name: 'Healthcare Technology Specialist',
          match_score: 0.42,
          readiness_level: 'emerging',
          local_opportunities: ['UAB Hospital'],
          education_paths: ['Jeff State Medical Technology'],
          explored_at: '2026-03-05T16:00:00.000Z',
        },
      ],
      research_participant_consents: [
        {
          user_id: '11111111-1111-1111-1111-111111111111',
          consent_status: 'granted',
          consent_scope: 'full_research',
          guardian_required: false,
          guardian_verified: false,
          consented_at: '2026-03-02T10:00:00.000Z',
          revoked_at: null,
        },
        {
          user_id: '22222222-2222-2222-2222-222222222222',
          consent_status: 'pending',
          consent_scope: 'cohort_only',
          guardian_required: true,
          guardian_verified: false,
          consented_at: null,
          revoked_at: null,
        },
      ],
    }

    mockRequireAdminAuth.mockResolvedValue(null)
    mockGetAdminSupabaseClient.mockReturnValue({
      from: (tableName: string) => ({
        select: () => createSelectQuery(tableName),
      }),
    })
  })

  it('returns pseudonymized cohort exports by default', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/research-export')

    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.mode).toBe('cohort')
    expect(body.scope).toBe('cohort_anonymized')
    expect(body.count).toBe(2)
    expect(body.summary.totalSkillDemonstrations).toBe(3)
    expect(body.data[0]).toMatchObject({
      identifierType: 'participant_id',
      participantId: expect.stringMatching(/^participant_[0-9a-f]{16}$/),
      metrics: {
        totalChoices: 24,
        strongAffinities: 2,
        topCareer: {
          name: 'Community Data Analyst',
          score: 84,
        },
      },
    })
    expect(body.data[0].playerId).toBe(body.data[0].participantId)
    expect(body.data[0].cognitiveResearch.userId).toBe(body.data[0].participantId)
  })

  it('rejects individual export when consent is not granted', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/admin/research-export?mode=individual&userId=22222222-2222-2222-2222-222222222222'
    )

    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(412)
    expect(body.error).toContain('requires granted individual research consent')
  })

  it('returns identified individual export when consent is granted', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/admin/research-export?mode=individual&userId=11111111-1111-1111-1111-111111111111'
    )

    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.mode).toBe('individual')
    expect(body.scope).toBe('individual_identified')
    expect(body.count).toBe(1)
    expect(body.data[0]).toMatchObject({
      identifierType: 'user_id',
      playerId: '11111111-1111-1111-1111-111111111111',
      consent: {
        status: 'granted',
        scope: 'full_research',
        guardianVerified: true,
      },
      metrics: {
        topCareer: {
          name: 'Community Data Analyst',
          score: 84,
        },
      },
    })
    expect(body.data[0].participantId).toMatch(/^participant_[0-9a-f]{16}$/)
    expect(body.data[0].cognitiveResearch.userId).toBe('11111111-1111-1111-1111-111111111111')
  })

  it('requires full research consent for identified longitudinal export', async () => {
    mockTables.research_participant_consents = [
      {
        user_id: '11111111-1111-1111-1111-111111111111',
        consent_status: 'granted',
        consent_scope: 'individual_research',
        guardian_required: false,
        guardian_verified: false,
        consented_at: '2026-03-02T10:00:00.000Z',
        revoked_at: null,
      },
    ]

    const request = new NextRequest(
      'http://localhost:3000/api/admin/research-export?mode=longitudinal&userId=11111111-1111-1111-1111-111111111111'
    )

    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(412)
    expect(body.error).toContain('requires granted full research consent')
  })

  it('returns identified longitudinal export when full research consent is granted', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/admin/research-export?mode=longitudinal&userId=11111111-1111-1111-1111-111111111111'
    )

    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.mode).toBe('longitudinal')
    expect(body.scope).toBe('individual_identified')
    expect(body.data[0].longitudinal.activityByDay).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          date: '2026-03-03',
          skillDemonstrations: 1,
          uniqueSkills: 1,
        }),
      ])
    )
  })

  it('returns longitudinal cohort exports with cohort timeline summary', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/admin/research-export?mode=longitudinal'
    )

    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.mode).toBe('longitudinal')
    expect(body.scope).toBe('cohort_anonymized')
    expect(body.cohortLongitudinal.activityByDay).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          date: '2026-03-03',
          participants: 1,
          skillDemonstrations: 1,
        }),
      ])
    )
    expect(body.data[0].longitudinal.activityByDay).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          date: '2026-03-03',
          skillDemonstrations: 1,
          uniqueSkills: 1,
        }),
      ])
    )
  })

  it('fails closed for identified export when the consent registry is unavailable', async () => {
    mockErrors.research_participant_consents = {
      code: '42P01',
      message: 'relation "research_participant_consents" does not exist',
    }

    const request = new NextRequest(
      'http://localhost:3000/api/admin/research-export?mode=individual&userId=11111111-1111-1111-1111-111111111111'
    )

    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(412)
    expect(body.error).toContain('consent registry migration')
  })
})
