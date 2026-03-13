import { describe, expect, it } from 'vitest'

import { deriveCareerSignals } from '@/lib/labor-market/signals'
import type { CareerMatch, SkillGap, SkillProfile } from '@/lib/skill-profile-adapter'

function buildCareerMatch(overrides: Partial<CareerMatch> = {}): CareerMatch {
  return {
    id: 'career_1',
    name: 'Community Data Analyst',
    matchScore: 0.8,
    requiredSkills: {
      communication: { current: 0.6, required: 0.7, gap: 0.1 },
    },
    salaryRange: [45000, 65000],
    educationPaths: ['UAB Data Science'],
    localOpportunities: ['UAB Innovation Lab'],
    birminghamRelevance: 0.9,
    growthProjection: 'high',
    readiness: 'skill_gaps',
    ...overrides,
  }
}

function buildSkillGap(overrides: Partial<SkillGap> = {}): SkillGap {
  return {
    skill: 'leadership',
    currentLevel: 0.4,
    targetForTopCareers: 0.7,
    gap: 0.3,
    priority: 'high',
    developmentPath: 'Lead one small group effort this month.',
    ...overrides,
  }
}

function buildProfile(overrides: Partial<SkillProfile> = {}): SkillProfile {
  const careerMatches = overrides.careerMatches ?? [buildCareerMatch()]
  const skillGaps = overrides.skillGaps ?? [buildSkillGap()]

  return {
    userId: 'player_123',
    userName: 'Jordan',
    skillDemonstrations: {},
    careerMatches,
    skillEvolution: [],
    keySkillMoments: [],
    skillGaps,
    totalDemonstrations: 0,
    milestones: [],
    ...overrides,
  }
}

describe('labor market signals', () => {
  it('uses a conservative observed exposure heuristic (unknown by default)', () => {
    const profile = buildProfile()
    const career = buildCareerMatch({ name: 'Community Data Analyst' })

    const signals = deriveCareerSignals({ career, profile, nowIso: '2026-03-12T00:00:00.000Z' })

    expect(signals.observedExposure.level).toBe('unknown')
    expect(signals.observedExposure.confidence).toBe('low')
    expect(signals.updatedAtIso).toBe('2026-03-12T00:00:00.000Z')
    expect(signals.provenance.observedExposure).toContain('task-level observed adoption data is not connected yet')
  })

  it('flags obvious high-exposure lanes with low confidence (heuristic only)', () => {
    const profile = buildProfile()
    const career = buildCareerMatch({ name: 'Software Developer', readiness: 'near_ready' })

    const signals = deriveCareerSignals({ career, profile, nowIso: '2026-03-12T00:00:00.000Z' })

    expect(signals.observedExposure.level).toBe('high')
    expect(signals.observedExposure.confidence).toBe('low')
  })

  it('derives posture from entry friction and growth outlook (defend when friction is high)', () => {
    const profile = buildProfile({
      skillGaps: [buildSkillGap({ priority: 'high' })],
    })
    const career = buildCareerMatch({ readiness: 'skill_gaps', growthProjection: 'high' })

    const signals = deriveCareerSignals({ career, profile, nowIso: '2026-03-12T00:00:00.000Z' })

    expect(signals.entryFriction.level).toBe('high')
    expect(signals.recommendedPosture).toBe('defend')
  })

  it('recommends attack when friction is low and growth is high', () => {
    const profile = buildProfile({ skillGaps: [] })
    const career = buildCareerMatch({ readiness: 'near_ready', growthProjection: 'high' })

    const signals = deriveCareerSignals({ career, profile, nowIso: '2026-03-12T00:00:00.000Z' })

    expect(signals.entryFriction.level).toBe('low')
    expect(signals.recommendedPosture).toBe('attack')
  })
})
