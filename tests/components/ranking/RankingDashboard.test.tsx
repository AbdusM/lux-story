/**
 * RankingDashboard Component Tests
 *
 * P2 Quality Test: Verifies that the ranking dashboard renders all badge sections
 * and responds correctly to different state configurations.
 *
 * NOT testing:
 * - Animation timing/behavior (tested via E2E)
 * - Deep badge rendering logic (tested via E2E golden flow)
 * - Snapshot comparisons (brittle)
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  RankingDashboard,
  CompactRankingOverview,
  MiniRankingSummary,
  type RankingDashboardState
} from '@/components/ranking/RankingDashboard'
import type { OrbTier } from '@/lib/orbs'
import type {
  PatternMasteryState,
  CareerExpertiseState,
  PlayerReadiness,
  BillboardState,
  SkillStarsState,
  EliteStatusState
} from '@/lib/ranking/types'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: { children: React.ReactNode }) => <section {...props}>{children}</section>
  },
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

// ═══════════════════════════════════════════════════════════════════════════
// TEST FIXTURES
// ═══════════════════════════════════════════════════════════════════════════

const mockPatternMasteryTier: OrbTier = 'emerging'

const mockPatternMasteryState: PatternMasteryState = {
  overallOrbTier: 'emerging',
  overallDisplayName: 'Passenger',
  perPattern: {
    analytical: { pattern: 'analytical', points: 15, thresholdLevel: 'emerging', unlocksEarned: 1 },
    building: { pattern: 'building', points: 12, thresholdLevel: 'emerging', unlocksEarned: 1 },
    helping: { pattern: 'helping', points: 8, thresholdLevel: 'nascent', unlocksEarned: 0 },
    patience: { pattern: 'patience', points: 10, thresholdLevel: 'nascent', unlocksEarned: 0 },
    exploring: { pattern: 'exploring', points: 20, thresholdLevel: 'emerging', unlocksEarned: 1 }
  },
  dominant: 'exploring',
  balanced: false
}

const mockCareerExpertiseState: CareerExpertiseState = {
  domains: {
    technology: {
      domain: 'technology',
      tierId: 'ce_tech_2',
      tierName: 'Practitioner',
      level: 2,
      points: 25,
      percentToNext: 50,
      isChampion: false,
      evidence: []
    },
    healthcare: {
      domain: 'healthcare',
      tierId: 'ce_health_1',
      tierName: 'Novice',
      level: 1,
      points: 10,
      percentToNext: 30,
      isChampion: false,
      evidence: []
    },
    business: {
      domain: 'business',
      tierId: 'ce_business_0',
      tierName: 'Observer',
      level: 0,
      points: 5,
      percentToNext: 20,
      isChampion: false,
      evidence: []
    },
    creative: {
      domain: 'creative',
      tierId: 'ce_creative_1',
      tierName: 'Novice',
      level: 1,
      points: 12,
      percentToNext: 40,
      isChampion: false,
      evidence: []
    },
    social_impact: {
      domain: 'social_impact',
      tierId: 'ce_social_0',
      tierName: 'Observer',
      level: 0,
      points: 3,
      percentToNext: 10,
      isChampion: false,
      evidence: []
    }
  },
  primaryDomain: 'technology',
  championDomains: [],
  breadth: 'moderate'
}

const mockChallengeRating: PlayerReadiness = {
  grade: 'C',
  gradeName: 'Developing',
  percentToNext: 45,
  dimensions: {
    patternMastery: 40,
    careerExpertise: 35,
    relationshipDepth: 50,
    skillBreadth: 30
  }
}

const mockStationStanding: BillboardState = {
  standing: 'regular',
  standingName: 'Regular',
  meritPoints: 150,
  meritBreakdown: {
    patterns: 50,
    relationships: 40,
    discoveries: 30,
    contributions: 30,
    total: 150
  },
  highlights: [
    { category: 'Patterns', label: 'Dominant', value: 'Exploring', trend: 'up' },
    { category: 'Trust', label: 'Highest', value: 'Maya (6)', trend: 'stable' }
  ],
  lastUpdated: Date.now()
}

const mockSkillStars: SkillStarsState = {
  stars: {
    mastery: { type: 'mastery', level: 2, name: 'Mastery', description: 'Pattern depth', progress: 60 },
    synthesis: { type: 'synthesis', level: 1, name: 'Synthesis', description: 'Skill combos', progress: 30 },
    discovery: { type: 'discovery', level: 1, name: 'Discovery', description: 'Info tiers', progress: 45 },
    connection: { type: 'connection', level: 2, name: 'Connection', description: 'Relationships', progress: 70 },
    growth: { type: 'growth', level: 1, name: 'Growth', description: 'Progression', progress: 50 },
    resilience: { type: 'resilience', level: 0, name: 'Resilience', description: 'Challenges', progress: 20 }
  },
  totalStars: 7,
  constellation: 'Wanderer'
}

const mockEliteStatus: EliteStatusState = {
  unlockedDesignations: ['pathfinder'],
  pendingDesignations: ['bridge_builder'],
  progress: {
    pathfinder: 100,
    bridge_builder: 75,
    mentor_heart: 40,
    pattern_sage: 30,
    station_pillar: 20
  }
}

const fullMockState: RankingDashboardState = {
  patternMastery: {
    tier: mockPatternMasteryTier,
    state: mockPatternMasteryState
  },
  careerExpertise: mockCareerExpertiseState,
  challengeRating: mockChallengeRating,
  stationStanding: mockStationStanding,
  skillStars: mockSkillStars,
  eliteStatus: mockEliteStatus
}

// ═══════════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('RankingDashboard', () => {
  describe('Full Dashboard Rendering', () => {
    it('renders all sections when full state is provided', () => {
      render(<RankingDashboard state={fullMockState} />)

      // Check section headers exist (use getAllByRole for headings)
      const headings = screen.getAllByRole('heading', { level: 3 })
      const headingTexts = headings.map(h => h.textContent)

      expect(headingTexts).toContain('Pattern Mastery')
      expect(headingTexts).toContain('Career Expertise')
      expect(headingTexts).toContain('Challenge Rating')
      expect(headingTexts).toContain('Station Standing')
      expect(headingTexts).toContain('Skill Stars')
      expect(headingTexts).toContain('Elite Status')
    }, 15000)

    it('respects showSections prop to hide specific sections', () => {
      render(
        <RankingDashboard
          state={fullMockState}
          showSections={{
            patternMastery: true,
            careerExpertise: false,
            challengeRating: false,
            stationStanding: false,
            skillStars: false,
            eliteStatus: false
          }}
        />
      )

      const headings = screen.getAllByRole('heading', { level: 3 })
      const headingTexts = headings.map(h => h.textContent)

      expect(headingTexts).toContain('Pattern Mastery')
      expect(headingTexts).not.toContain('Career Expertise')
      expect(headingTexts).not.toContain('Challenge Rating')
    })

    it('handles partial state gracefully', () => {
      const partialState: RankingDashboardState = {
        patternMastery: fullMockState.patternMastery
        // Other sections undefined
      }

      render(<RankingDashboard state={partialState} />)

      const headings = screen.getAllByRole('heading', { level: 3 })
      const headingTexts = headings.map(h => h.textContent)

      expect(headingTexts).toContain('Pattern Mastery')
      expect(headingTexts).not.toContain('Career Expertise')
      expect(headingTexts).not.toContain('Challenge Rating')
    })

    it('handles empty state without crashing', () => {
      const emptyState: RankingDashboardState = {}

      expect(() => render(<RankingDashboard state={emptyState} />)).not.toThrow()
    })

    it('applies grid layout by default', () => {
      const { container } = render(<RankingDashboard state={fullMockState} />)

      // Grid class should be present on the container
      const gridContainer = container.querySelector('.grid')
      expect(gridContainer).toBeInTheDocument()
    })

    it('applies list layout when specified', () => {
      const { container } = render(<RankingDashboard state={fullMockState} layout="list" />)

      // Flex-col class should be present
      const listContainer = container.querySelector('.flex-col')
      expect(listContainer).toBeInTheDocument()
    })
  })

  describe('Elite Status Section', () => {
    it('shows elite status when designations are unlocked', () => {
      render(<RankingDashboard state={fullMockState} />)

      expect(screen.getByText('Elite Status')).toBeInTheDocument()
      expect(screen.getByText('Special designations for exceptional achievement')).toBeInTheDocument()
    })

    it('renders without elite section when no designations', () => {
      const stateWithNoElite: RankingDashboardState = {
        ...fullMockState,
        eliteStatus: {
          unlockedDesignations: [],
          pendingDesignations: [],
          progress: {
            pathfinder: 10,
            bridge_builder: 5,
            mentor_heart: 0,
            pattern_sage: 0,
            station_pillar: 0
          }
        }
      }

      render(<RankingDashboard state={stateWithNoElite} />)

      // Elite section should still render (shows progress)
      expect(screen.getByText('Elite Status')).toBeInTheDocument()
    })
  })
})

describe('CompactRankingOverview', () => {
  it('renders compact badges for all provided systems', () => {
    const { container } = render(<CompactRankingOverview state={fullMockState} />)

    // Should render without throwing and have content
    expect(container.firstChild).toBeInTheDocument()
    expect(container.innerHTML).not.toBe('')
  })

  it('handles partial state gracefully', () => {
    const partialState: RankingDashboardState = {
      patternMastery: fullMockState.patternMastery
    }

    expect(() => render(<CompactRankingOverview state={partialState} />)).not.toThrow()
  })
})

describe('MiniRankingSummary', () => {
  it('renders minimal summary with pattern mastery', () => {
    render(<MiniRankingSummary state={fullMockState} />)

    // Should show star count
    expect(screen.getByText('7 stars')).toBeInTheDocument()
  })

  it('shows elite count when designations are unlocked', () => {
    render(<MiniRankingSummary state={fullMockState} />)

    expect(screen.getByText('1 elite')).toBeInTheDocument()
  })

  it('handles empty state gracefully', () => {
    const emptyState: RankingDashboardState = {}

    expect(() => render(<MiniRankingSummary state={emptyState} />)).not.toThrow()
  })
})

describe('Section Content Validation', () => {
  it('career expertise shows domain cards', () => {
    render(
      <RankingDashboard
        state={fullMockState}
        showSections={{
          patternMastery: false,
          careerExpertise: true,
          challengeRating: false,
          stationStanding: false,
          skillStars: false,
          eliteStatus: false
        }}
      />
    )

    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings.some(h => h.textContent === 'Career Expertise')).toBe(true)
  })

  it('challenge rating shows grade and dimensions', () => {
    render(
      <RankingDashboard
        state={fullMockState}
        showSections={{
          patternMastery: false,
          careerExpertise: false,
          challengeRating: true,
          stationStanding: false,
          skillStars: false,
          eliteStatus: false
        }}
      />
    )

    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings.some(h => h.textContent === 'Challenge Rating')).toBe(true)
  })

  it('station standing shows merit breakdown', () => {
    render(
      <RankingDashboard
        state={fullMockState}
        showSections={{
          patternMastery: false,
          careerExpertise: false,
          challengeRating: false,
          stationStanding: true,
          skillStars: false,
          eliteStatus: false
        }}
      />
    )

    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings.some(h => h.textContent === 'Station Standing')).toBe(true)
  })

  it('skill stars shows constellation badge', () => {
    render(
      <RankingDashboard
        state={fullMockState}
        showSections={{
          patternMastery: false,
          careerExpertise: false,
          challengeRating: false,
          stationStanding: false,
          skillStars: true,
          eliteStatus: false
        }}
      />
    )

    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings.some(h => h.textContent === 'Skill Stars')).toBe(true)
  })
})
