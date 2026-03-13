import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

import type { SkillProfile } from '@/lib/skill-profile-adapter'

const {
  mockRequireAdminAuth,
  mockLimiterCheck,
  mockMessagesCreate,
  mockLoggerDebug,
  mockLoggerError,
} = vi.hoisted(() => ({
  mockRequireAdminAuth: vi.fn(),
  mockLimiterCheck: vi.fn(),
  mockMessagesCreate: vi.fn(),
  mockLoggerDebug: vi.fn(),
  mockLoggerError: vi.fn(),
}))

vi.mock('@/lib/admin-supabase-client', () => ({
  requireAdminAuth: mockRequireAdminAuth,
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: () => ({
    check: mockLimiterCheck,
  }),
  getClientIp: vi.fn(() => '127.0.0.1'),
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    debug: mockLoggerDebug,
    error: mockLoggerError,
  },
}))

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: mockMessagesCreate,
    },
  })),
}))

function createRequest(body: unknown): NextRequest {
  return new NextRequest(new URL('http://localhost:3000/api/advisor-briefing'), {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

function createProfile(): SkillProfile {
  return {
    userId: 'player_123',
    userName: 'Test Player',
    skillDemonstrations: {
      empathy: [
        {
          scene: 'maya_intro',
          choice: 'I hear what you are carrying.',
          context: 'Validated Maya before offering advice.',
          value: 1,
        },
      ],
      analytical_reasoning: [
        {
          scene: 'devon_debug',
          choice: 'Let me check the logs first.',
          context: 'Inspected the error trail before deciding.',
          value: 1,
        },
      ],
    },
    careerMatches: [
      {
        id: 'career_community_data',
        name: 'Community Data Analyst',
        matchScore: 0.84,
        requiredSkills: {
          leadership: {
            current: 0.2,
            required: 0.8,
            gap: 0.6,
          },
        },
        salaryRange: [42000, 68000],
        educationPaths: ['UAB Data Science'],
        localOpportunities: ['UAB Innovation Lab'],
        birminghamRelevance: 0.92,
        growthProjection: 'high',
        readiness: 'skill_gaps',
      },
    ],
    skillEvolution: [],
    keySkillMoments: [
      {
        scene: 'maya_intro',
        choice: 'I hear what you are carrying.',
        skillsDemonstrated: ['empathy'],
        insight: 'Built trust through reflective listening.',
      },
    ],
    skillGaps: [
      {
        skill: 'Leadership',
        currentLevel: 0.2,
        targetForTopCareers: 0.8,
        gap: 0.6,
        priority: 'high',
        developmentPath: 'Join the UAB mentoring cohort.',
      },
    ],
    totalDemonstrations: 2,
    milestones: [],
  }
}

async function loadRoute() {
  vi.resetModules()
  return import('@/app/api/advisor-briefing/route')
}

describe('advisor-briefing route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    mockRequireAdminAuth.mockResolvedValue(null)
    mockLimiterCheck.mockResolvedValue(undefined)
  })

  it('returns a generated briefing for authenticated admins', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-anthropic-key')
    mockMessagesCreate.mockResolvedValue({
      content: [{ type: 'text', text: '## 1. The Authentic Story\nGenerated briefing' }],
      usage: {
        input_tokens: 120,
        output_tokens: 45,
      },
    })

    const { POST } = await loadRoute()
    const response = await POST(createRequest({ profile: createProfile() }))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.briefing).toContain('## 1. The Authentic Story')
    expect(body.tokensUsed).toBe(165)
    expect(mockMessagesCreate).toHaveBeenCalledTimes(1)
  })

  it('returns 429 when the briefing limiter blocks the request', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-anthropic-key')
    mockLimiterCheck.mockRejectedValue(new Error('Rate limited'))

    const { POST } = await loadRoute()
    const response = await POST(createRequest({ profile: createProfile() }))
    const body = await response.json()

    expect(response.status).toBe(429)
    expect(body.error).toContain('Too many briefing generation requests')
    expect(mockMessagesCreate).not.toHaveBeenCalled()
  })

  it('fails with a configuration error when the Anthropic key is missing', async () => {
    const { POST } = await loadRoute()
    const response = await POST(createRequest({ profile: createProfile() }))
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error).toContain('ANTHROPIC_API_KEY not configured')
  })

  it('falls back to a data-driven briefing when Anthropic credits are exhausted', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-anthropic-key')
    mockMessagesCreate.mockRejectedValue(new Error('credit balance exhausted'))

    const { POST } = await loadRoute()
    const response = await POST(createRequest({ profile: createProfile() }))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.note).toContain('data-driven fallback')
    expect(body.briefing).toContain('UAB Innovation Lab')
    expect(body.briefing).toContain('Leadership')
  })

  it('returns the auth error without calling Anthropic', async () => {
    mockRequireAdminAuth.mockResolvedValue(
      NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    )
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-anthropic-key')

    const { POST } = await loadRoute()
    const response = await POST(createRequest({ profile: createProfile() }))

    expect(response.status).toBe(401)
    expect(mockMessagesCreate).not.toHaveBeenCalled()
  })
})
