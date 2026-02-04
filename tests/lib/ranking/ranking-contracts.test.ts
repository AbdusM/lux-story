/**
 * Ranking System Contract Tests
 *
 * These tests validate invariants that must hold for the ranking system.
 * They ensure the registry is well-formed and functions behave correctly.
 */

import { describe, it, expect } from 'vitest'
import {
  RANK_REGISTRY,
  RANK_CATEGORIES,
  getTierForPoints,
  getTierById,
  calculateProgress,
  getNextTier,
  getTiersForCategory,
  wouldPromote,
  validateRegistry,
  CHARACTER_DOMAIN_MAP,
  EXCLUDED_CHARACTERS,
  CAREER_DOMAINS,
  calculateUnifiedDashboard,
  createDefaultDashboardInput,
  isRankCategory,
  isCareerDomain
} from '@/lib/ranking'
import {
  isDesignationUnlocked,
  getDesignationProgress,
  calculateEliteStatusState,
  getEliteTier,
  getNearestDesignation,
  hasDesignationNearUnlock,
  getPrimaryTitle,
  getAllTitles,
  getSamuelDesignationMessage,
  getSamuelEliteTierMessage,
  ELITE_DESIGNATIONS,
  DESIGNATION_DISPLAY,
  type EliteStatusInput
} from '@/lib/ranking/elite-status'
import {
  isResonanceActive,
  getActiveResonances,
  getResonanceMultiplier,
  getAllResonanceMultipliers,
  checkResonanceEvents,
  getResonanceEventById,
  calculateResonanceState,
  getResonanceDisplayInfo,
  getSamuelResonanceMessage,
  createDefaultResonanceInput,
  RESONANCE_BONUSES,
  RESONANCE_EVENTS,
  type ResonanceInput
} from '@/lib/ranking/resonance'
import {
  getCohortId,
  getCohortName,
  getCohortDates,
  createCohort,
  getQualitativeStanding,
  getStandingDescription,
  getStandingLabel,
  calculateLocalCohortComparison,
  getSamuelCohortMessage,
  getCohortDisplayInfo,
  formatPercentileDisplay,
  SPECIAL_COHORT_NAMES
} from '@/lib/ranking/cohorts'
import { ORB_TIERS } from '@/lib/orbs'
import { TRUST_THRESHOLDS } from '@/lib/constants'
import { CHARACTER_IDS } from '@/lib/graph-registry'

describe('Ranking System Contracts', () => {
  // ═══════════════════════════════════════════════════════════════════════════
  // REGISTRY INVARIANTS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Registry Invariants', () => {
    it('all categories have at least 2 tiers', () => {
      for (const category of RANK_CATEGORIES) {
        expect(RANK_REGISTRY[category].length).toBeGreaterThanOrEqual(2)
      }
    })

    it('tier thresholds are strictly increasing', () => {
      for (const category of RANK_CATEGORIES) {
        const tiers = RANK_REGISTRY[category]
        for (let i = 1; i < tiers.length; i++) {
          expect(tiers[i].threshold).toBeGreaterThan(tiers[i - 1].threshold)
        }
      }
    })

    it('tier levels are sequential starting at 0', () => {
      for (const category of RANK_CATEGORIES) {
        const tiers = RANK_REGISTRY[category]
        tiers.forEach((tier, i) => {
          expect(tier.level).toBe(i)
        })
      }
    })

    it('all tier IDs are unique across all categories', () => {
      const allIds = Object.values(RANK_REGISTRY).flat().map(t => t.id)
      expect(new Set(allIds).size).toBe(allIds.length)
    })

    it('all tiers have required fields', () => {
      for (const category of RANK_CATEGORIES) {
        for (const tier of RANK_REGISTRY[category]) {
          expect(tier.id).toBeDefined()
          expect(tier.category).toBe(category)
          expect(typeof tier.level).toBe('number')
          expect(tier.name).toBeDefined()
          expect(typeof tier.threshold).toBe('number')
          expect(tier.description).toBeDefined()
        }
      }
    })

    it('validateRegistry returns valid', () => {
      const result = validateRegistry()
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // THRESHOLD ALIGNMENT
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Threshold Alignment', () => {
    it('pattern_mastery thresholds match ORB_TIERS', () => {
      const pmTiers = RANK_REGISTRY.pattern_mastery

      expect(pmTiers[0].threshold).toBe(ORB_TIERS.nascent.minOrbs)     // 0
      expect(pmTiers[1].threshold).toBe(ORB_TIERS.emerging.minOrbs)    // 10
      expect(pmTiers[2].threshold).toBe(ORB_TIERS.developing.minOrbs)  // 30
      expect(pmTiers[3].threshold).toBe(ORB_TIERS.flourishing.minOrbs) // 60
      expect(pmTiers[4].threshold).toBe(ORB_TIERS.mastered.minOrbs)    // 100
    })

    it('career_expertise Champion threshold is achievable', () => {
      const ceTiers = RANK_REGISTRY.career_expertise
      const championTier = ceTiers.find(t => t.name === 'Champion')

      // Max achievable points per domain:
      // - 5 skills @ 10 points = 50
      // - 5 characters @ 3 points = 15
      // - 5 arcs @ 5 points = 25
      // Total: 90 max, realistic: ~36-40
      // Threshold must be <= 40 to be achievable
      expect(championTier?.threshold).toBeLessThanOrEqual(40)
    })

    it('station_standing has 4 tiers', () => {
      expect(RANK_REGISTRY.station_standing).toHaveLength(4)
    })

    it('skill_stars has 4 tiers (0-3 stars)', () => {
      expect(RANK_REGISTRY.skill_stars).toHaveLength(4)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // getTierForPoints
  // ═══════════════════════════════════════════════════════════════════════════

  describe('getTierForPoints', () => {
    it('returns lowest tier for 0 points', () => {
      const tier = getTierForPoints('pattern_mastery', 0)
      expect(tier.level).toBe(0)
      expect(tier.name).toBe('Traveler')
    })

    it('returns correct tier at exact threshold', () => {
      const tier = getTierForPoints('pattern_mastery', 10)
      expect(tier.level).toBe(1)
      expect(tier.name).toBe('Passenger')
    })

    it('returns correct tier just below threshold', () => {
      const tier = getTierForPoints('pattern_mastery', 9)
      expect(tier.level).toBe(0)
      expect(tier.name).toBe('Traveler')
    })

    it('returns highest tier at max points', () => {
      const tier = getTierForPoints('pattern_mastery', 100)
      expect(tier.level).toBe(4)
      expect(tier.name).toBe('Station Master')
    })

    it('returns highest tier for points above max', () => {
      const tier = getTierForPoints('pattern_mastery', 999)
      expect(tier.level).toBe(4)
      expect(tier.name).toBe('Station Master')
    })

    it('works for all categories', () => {
      for (const category of RANK_CATEGORIES) {
        const tier = getTierForPoints(category, 0)
        expect(tier.category).toBe(category)
        expect(tier.level).toBe(0)
      }
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // getTierById
  // ═══════════════════════════════════════════════════════════════════════════

  describe('getTierById', () => {
    it('finds tier by ID', () => {
      const tier = getTierById('pm_traveler')
      expect(tier).toBeDefined()
      expect(tier?.name).toBe('Traveler')
    })

    it('returns undefined for invalid ID', () => {
      const tier = getTierById('invalid_id')
      expect(tier).toBeUndefined()
    })

    it('finds tiers from any category', () => {
      expect(getTierById('pm_traveler')).toBeDefined()
      expect(getTierById('ce_curious')).toBeDefined()
      expect(getTierById('cr_d')).toBeDefined()
      expect(getTierById('ss_newcomer')).toBeDefined()
      expect(getTierById('sk_unstarred')).toBeDefined()
      expect(getTierById('es_none')).toBeDefined()
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // calculateProgress
  // ═══════════════════════════════════════════════════════════════════════════

  describe('calculateProgress', () => {
    it('returns 0 percent at tier start', () => {
      const progress = calculateProgress('pattern_mastery', 0)
      expect(progress.percent).toBe(0)
      expect(progress.toNext).toBe(10) // Next tier at 10
    })

    it('returns correct progress mid-tier', () => {
      // At 5 points, halfway between 0 and 10
      const progress = calculateProgress('pattern_mastery', 5)
      expect(progress.percent).toBe(50)
      expect(progress.toNext).toBe(5)
    })

    it('returns 100 percent at max tier', () => {
      const progress = calculateProgress('pattern_mastery', 100)
      expect(progress.percent).toBe(100)
      expect(progress.toNext).toBe(0)
    })

    it('handles above max points', () => {
      const progress = calculateProgress('pattern_mastery', 999)
      expect(progress.percent).toBe(100)
      expect(progress.toNext).toBe(0)
    })

    it('percent is always 0-100', () => {
      for (let points = 0; points <= 150; points += 5) {
        const progress = calculateProgress('pattern_mastery', points)
        expect(progress.percent).toBeGreaterThanOrEqual(0)
        expect(progress.percent).toBeLessThanOrEqual(100)
      }
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // getNextTier
  // ═══════════════════════════════════════════════════════════════════════════

  describe('getNextTier', () => {
    it('returns next tier when available', () => {
      const next = getNextTier('pattern_mastery', 'pm_traveler')
      expect(next).toBeDefined()
      expect(next?.name).toBe('Passenger')
    })

    it('returns null at max tier', () => {
      const next = getNextTier('pattern_mastery', 'pm_stationmaster')
      expect(next).toBeNull()
    })

    it('returns null for invalid tier ID', () => {
      const next = getNextTier('pattern_mastery', 'invalid_id')
      expect(next).toBeNull()
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // wouldPromote
  // ═══════════════════════════════════════════════════════════════════════════

  describe('wouldPromote', () => {
    it('returns true when crossing threshold', () => {
      const would = wouldPromote('pattern_mastery', 'pm_traveler', 10)
      expect(would).toBe(true)
    })

    it('returns false when staying in same tier', () => {
      const would = wouldPromote('pattern_mastery', 'pm_traveler', 5)
      expect(would).toBe(false)
    })

    it('returns false at max tier', () => {
      const would = wouldPromote('pattern_mastery', 'pm_stationmaster', 999)
      expect(would).toBe(false)
    })

    it('returns false for same tier at threshold', () => {
      const would = wouldPromote('pattern_mastery', 'pm_passenger', 10)
      expect(would).toBe(false)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // PERFORMANCE
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Performance', () => {
    it('getTierForPoints completes in <1ms', () => {
      const start = performance.now()
      for (let i = 0; i < 1000; i++) {
        getTierForPoints('pattern_mastery', Math.random() * 150)
      }
      const duration = performance.now() - start

      // 1000 calls should complete in <100ms (0.1ms average)
      expect(duration).toBeLessThan(100)
    })

    it('calculateProgress completes in <1ms', () => {
      const start = performance.now()
      for (let i = 0; i < 1000; i++) {
        calculateProgress('pattern_mastery', Math.random() * 150)
      }
      const duration = performance.now() - start

      expect(duration).toBeLessThan(100)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // DETERMINISM
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Determinism', () => {
    it('calculateUnifiedDashboard is deterministic with fixed timestamp', () => {
      const now = 1700000000000
      const input = {
        ...createDefaultDashboardInput(now - 86400000), // Created 1 day ago
        patternOrbs: { analytical: 15, patience: 10, exploring: 5, helping: 8, building: 12 },
        characterStates: [
          { characterId: 'maya', trust: 6, arcsCompleted: 1 },
          { characterId: 'marcus', trust: 4, arcsCompleted: 0 }
        ],
        demonstratedSkills: ['coding', 'analysis', 'communication'],
        totalOrbs: 50,
        charactersMet: 5,
        averageTrust: 5,
        arcsCompleted: 1,
        visitedScenes: 10,
        choicesMade: 25,
        sessionsPlayed: 3
      }

      const result1 = calculateUnifiedDashboard(input, now)
      const result2 = calculateUnifiedDashboard(input, now)

      // Core state should be identical
      expect(result1.patternMastery.overallOrbTier).toBe(result2.patternMastery.overallOrbTier)
      expect(result1.challengeRating.grade).toBe(result2.challengeRating.grade)
      expect(result1.stationStanding.standing).toBe(result2.stationStanding.standing)
      expect(result1.skillStars.totalStars).toBe(result2.skillStars.totalStars)
      expect(result1.overallProgression).toBe(result2.overallProgression)
      expect(result1.lastUpdated).toBe(result2.lastUpdated)
    })

    it('different timestamps produce different lastUpdated', () => {
      const input = createDefaultDashboardInput()
      const result1 = calculateUnifiedDashboard(input, 1000)
      const result2 = calculateUnifiedDashboard(input, 2000)

      expect(result1.lastUpdated).toBe(1000)
      expect(result2.lastUpdated).toBe(2000)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // CHARACTER-DOMAIN COVERAGE
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Character-Domain Coverage', () => {
    it('every CharacterId is assigned to exactly one domain or excluded', () => {
      const assignedChars = new Set(Object.keys(CHARACTER_DOMAIN_MAP))

      for (const charId of CHARACTER_IDS) {
        const isAssigned = assignedChars.has(charId)
        const isExcluded = EXCLUDED_CHARACTERS.has(charId)

        // Must be in exactly one: assigned XOR excluded
        expect(isAssigned || isExcluded).toBe(true)
        expect(isAssigned && isExcluded).toBe(false)
      }
    })

    it('all domains have at least one character', () => {
      for (const domain of CAREER_DOMAINS) {
        const chars = Object.entries(CHARACTER_DOMAIN_MAP)
          .filter(([_, d]) => d === domain)
          .map(([c]) => c)

        expect(chars.length).toBeGreaterThanOrEqual(1)
      }
    })

    it('excluded characters are hub/locations only', () => {
      const expectedExcluded = ['samuel', 'station_entry', 'grand_hall', 'market', 'deep_station']

      for (const charId of EXCLUDED_CHARACTERS) {
        expect(expectedExcluded).toContain(charId)
      }
    })

    it('CHARACTER_DOMAIN_MAP values are all valid CareerDomains', () => {
      for (const domain of Object.values(CHARACTER_DOMAIN_MAP)) {
        expect(CAREER_DOMAINS).toContain(domain)
      }
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // UNIFIED DASHBOARD PERFORMANCE
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Unified Dashboard Performance', () => {
    it('calculateUnifiedDashboard completes in <50ms', () => {
      const input = {
        ...createDefaultDashboardInput(),
        patternOrbs: { analytical: 25, patience: 20, exploring: 15, helping: 18, building: 22 },
        characterStates: [
          { characterId: 'maya', trust: 8, arcsCompleted: 2 },
          { characterId: 'marcus', trust: 6, arcsCompleted: 1 },
          { characterId: 'devon', trust: 7, arcsCompleted: 1 },
          { characterId: 'tess', trust: 5, arcsCompleted: 0 }
        ],
        demonstratedSkills: ['coding', 'analysis', 'communication', 'leadership', 'creativity'],
        totalOrbs: 100,
        charactersMet: 10,
        averageTrust: 6,
        arcsCompleted: 4,
        visitedScenes: 25,
        choicesMade: 50,
        sessionsPlayed: 8
      }

      const start = performance.now()
      for (let i = 0; i < 100; i++) {
        calculateUnifiedDashboard(input, Date.now())
      }
      const duration = performance.now() - start

      // 100 calculations should complete in <500ms (5ms average, target <50ms)
      expect(duration).toBeLessThan(500)
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // TYPE GUARDS
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Type Guards', () => {
    describe('isRankCategory', () => {
      it('returns true for all valid rank categories', () => {
        expect(isRankCategory('pattern_mastery')).toBe(true)
        expect(isRankCategory('career_expertise')).toBe(true)
        expect(isRankCategory('challenge_rating')).toBe(true)
        expect(isRankCategory('station_standing')).toBe(true)
        expect(isRankCategory('skill_stars')).toBe(true)
        expect(isRankCategory('elite_status')).toBe(true)
      })

      it('returns false for invalid categories', () => {
        expect(isRankCategory('invalid')).toBe(false)
        expect(isRankCategory('')).toBe(false)
        expect(isRankCategory('PatternMastery')).toBe(false)
        expect(isRankCategory('PATTERN_MASTERY')).toBe(false)
      })

      it('returns false for null/undefined', () => {
        expect(isRankCategory(null as unknown as string)).toBe(false)
        expect(isRankCategory(undefined as unknown as string)).toBe(false)
      })
    })

    describe('isCareerDomain', () => {
      it('returns true for all valid career domains', () => {
        expect(isCareerDomain('technology')).toBe(true)
        expect(isCareerDomain('healthcare')).toBe(true)
        expect(isCareerDomain('business')).toBe(true)
        expect(isCareerDomain('creative')).toBe(true)
        expect(isCareerDomain('social_impact')).toBe(true)
      })

      it('returns false for invalid domains', () => {
        expect(isCareerDomain('invalid')).toBe(false)
        expect(isCareerDomain('engineering')).toBe(false)
        expect(isCareerDomain('')).toBe(false)
        expect(isCareerDomain('TECHNOLOGY')).toBe(false)
      })
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // REGISTRY HELPERS - getTiersForCategory
  // ═══════════════════════════════════════════════════════════════════════════

  describe('getTiersForCategory', () => {
    it('returns all tiers for pattern_mastery', () => {
      const tiers = getTiersForCategory('pattern_mastery')
      expect(tiers).toHaveLength(5)
      expect(tiers[0].name).toBe('Traveler')
      expect(tiers[4].name).toBe('Station Master')
    })

    it('returns all tiers for career_expertise', () => {
      const tiers = getTiersForCategory('career_expertise')
      expect(tiers).toHaveLength(6)
      expect(tiers[0].name).toBe('Curious')
      expect(tiers[5].name).toBe('Champion')
    })

    it('tiers are returned in order by level', () => {
      for (const category of RANK_CATEGORIES) {
        const tiers = getTiersForCategory(category)
        for (let i = 0; i < tiers.length; i++) {
          expect(tiers[i].level).toBe(i)
        }
      }
    })

    it('returns same reference as RANK_REGISTRY', () => {
      for (const category of RANK_CATEGORIES) {
        expect(getTiersForCategory(category)).toBe(RANK_REGISTRY[category])
      }
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // ELITE STATUS UTILITIES
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Elite Status Utilities', () => {
    const emptyInput: EliteStatusInput = {
      firstDiscoveries: 0,
      specialistDomains: 0,
      maxTrustCharacters: 0,
      flourishingPatterns: 0,
      standingLevel: 0,
      totalOrbs: 0,
      arcsCompleted: 0
    }

    const fullInput: EliteStatusInput = {
      firstDiscoveries: 5,
      specialistDomains: 4,
      maxTrustCharacters: 7,
      flourishingPatterns: 5,
      standingLevel: 3,
      totalOrbs: 150,
      arcsCompleted: 10
    }

    describe('isDesignationUnlocked', () => {
      it('pathfinder requires 3+ first discoveries', () => {
        expect(isDesignationUnlocked('pathfinder', { ...emptyInput, firstDiscoveries: 2 })).toBe(false)
        expect(isDesignationUnlocked('pathfinder', { ...emptyInput, firstDiscoveries: 3 })).toBe(true)
        expect(isDesignationUnlocked('pathfinder', { ...emptyInput, firstDiscoveries: 5 })).toBe(true)
      })

      it('bridge_builder requires 3+ specialist domains', () => {
        expect(isDesignationUnlocked('bridge_builder', { ...emptyInput, specialistDomains: 2 })).toBe(false)
        expect(isDesignationUnlocked('bridge_builder', { ...emptyInput, specialistDomains: 3 })).toBe(true)
      })

      it('mentor_heart requires 5+ max trust characters', () => {
        expect(isDesignationUnlocked('mentor_heart', { ...emptyInput, maxTrustCharacters: 4 })).toBe(false)
        expect(isDesignationUnlocked('mentor_heart', { ...emptyInput, maxTrustCharacters: 5 })).toBe(true)
      })

      it('pattern_sage requires all 5 patterns flourishing', () => {
        expect(isDesignationUnlocked('pattern_sage', { ...emptyInput, flourishingPatterns: 4 })).toBe(false)
        expect(isDesignationUnlocked('pattern_sage', { ...emptyInput, flourishingPatterns: 5 })).toBe(true)
      })

      it('station_pillar requires standing level 3', () => {
        expect(isDesignationUnlocked('station_pillar', { ...emptyInput, standingLevel: 2 })).toBe(false)
        expect(isDesignationUnlocked('station_pillar', { ...emptyInput, standingLevel: 3 })).toBe(true)
      })
    })

    describe('getDesignationProgress', () => {
      it('returns 0 for empty input', () => {
        for (const designation of ELITE_DESIGNATIONS) {
          expect(getDesignationProgress(designation, emptyInput)).toBe(0)
        }
      })

      it('returns 100 for fully qualified input', () => {
        expect(getDesignationProgress('pathfinder', fullInput)).toBe(100)
        expect(getDesignationProgress('bridge_builder', fullInput)).toBe(100)
        expect(getDesignationProgress('mentor_heart', fullInput)).toBe(100)
        expect(getDesignationProgress('pattern_sage', fullInput)).toBe(100)
        expect(getDesignationProgress('station_pillar', fullInput)).toBe(100)
      })

      it('returns proportional progress', () => {
        expect(getDesignationProgress('pathfinder', { ...emptyInput, firstDiscoveries: 1 })).toBe(33)
        expect(getDesignationProgress('pathfinder', { ...emptyInput, firstDiscoveries: 2 })).toBe(67)
      })

      it('caps at 100', () => {
        expect(getDesignationProgress('pathfinder', { ...emptyInput, firstDiscoveries: 10 })).toBe(100)
      })
    })

    describe('calculateEliteStatusState', () => {
      it('returns empty state for empty input', () => {
        const state = calculateEliteStatusState(emptyInput)
        expect(state.unlockedDesignations).toHaveLength(0)
        expect(state.pendingDesignations).toHaveLength(0)
      })

      it('returns all unlocked for full input', () => {
        const state = calculateEliteStatusState(fullInput)
        expect(state.unlockedDesignations).toHaveLength(5)
      })

      it('shows pending for 33%+ progress', () => {
        const input = { ...emptyInput, firstDiscoveries: 1, specialistDomains: 1 }
        const state = calculateEliteStatusState(input)
        expect(state.pendingDesignations).toContain('pathfinder')
        expect(state.pendingDesignations).toContain('bridge_builder')
      })

      it('progress record contains all designations', () => {
        const state = calculateEliteStatusState(emptyInput)
        for (const designation of ELITE_DESIGNATIONS) {
          expect(state.progress[designation]).toBeDefined()
        }
      })
    })

    describe('getEliteTier', () => {
      it('returns Standard for 0 designations', () => {
        const tier = getEliteTier(0)
        expect(tier.name).toBe('Standard')
        expect(tier.level).toBe(0)
      })

      it('returns Recognized for 1 designation', () => {
        const tier = getEliteTier(1)
        expect(tier.name).toBe('Recognized')
        expect(tier.level).toBe(1)
      })

      it('returns Elite for 3 designations', () => {
        const tier = getEliteTier(3)
        expect(tier.name).toBe('Elite')
        expect(tier.level).toBe(2)
      })

      it('returns Legendary for 5 designations', () => {
        const tier = getEliteTier(5)
        expect(tier.name).toBe('Legendary')
        expect(tier.level).toBe(3)
      })
    })

    describe('getNearestDesignation', () => {
      it('returns null when all unlocked', () => {
        const state = calculateEliteStatusState(fullInput)
        expect(getNearestDesignation(state)).toBeNull()
      })

      it('returns designation with highest progress', () => {
        const input = { ...emptyInput, firstDiscoveries: 2, specialistDomains: 1 }
        const state = calculateEliteStatusState(input)
        expect(getNearestDesignation(state)).toBe('pathfinder')
      })
    })

    describe('hasDesignationNearUnlock', () => {
      it('returns false when no progress', () => {
        const state = calculateEliteStatusState(emptyInput)
        expect(hasDesignationNearUnlock(state)).toBe(false)
      })

      it('returns true at 80%+ progress', () => {
        const input = { ...emptyInput, firstDiscoveries: 2 } // 67%
        const state = calculateEliteStatusState(input)
        expect(hasDesignationNearUnlock(state, 65)).toBe(true)
        expect(hasDesignationNearUnlock(state, 70)).toBe(false)
      })
    })

    describe('getPrimaryTitle', () => {
      it('returns null when none unlocked', () => {
        const state = calculateEliteStatusState(emptyInput)
        expect(getPrimaryTitle(state)).toBeNull()
      })

      it('returns first unlocked title', () => {
        const input = { ...emptyInput, firstDiscoveries: 3 }
        const state = calculateEliteStatusState(input)
        expect(getPrimaryTitle(state)).toBe('The Pathfinder')
      })
    })

    describe('getAllTitles', () => {
      it('returns empty array when none unlocked', () => {
        const state = calculateEliteStatusState(emptyInput)
        expect(getAllTitles(state)).toHaveLength(0)
      })

      it('returns all unlocked titles', () => {
        const state = calculateEliteStatusState(fullInput)
        expect(getAllTitles(state)).toHaveLength(5)
        expect(getAllTitles(state)).toContain('The Pathfinder')
        expect(getAllTitles(state)).toContain('The Station Pillar')
      })
    })

    describe('Samuel messages', () => {
      it('getSamuelDesignationMessage returns string for all designations', () => {
        for (const designation of ELITE_DESIGNATIONS) {
          const message = getSamuelDesignationMessage(designation)
          expect(typeof message).toBe('string')
          expect(message.length).toBeGreaterThan(0)
        }
      })

      it('getSamuelEliteTierMessage returns string for all tier names', () => {
        const tierNames = ['Standard', 'Recognized', 'Elite', 'Legendary']
        for (const name of tierNames) {
          const message = getSamuelEliteTierMessage(name)
          expect(typeof message).toBe('string')
          expect(message.length).toBeGreaterThan(0)
        }
      })

      it('getSamuelEliteTierMessage returns fallback for unknown tier', () => {
        const message = getSamuelEliteTierMessage('Unknown')
        expect(message.toLowerCase()).toContain('growth')
      })
    })

    describe('DESIGNATION_DISPLAY', () => {
      it('all designations have display info', () => {
        for (const designation of ELITE_DESIGNATIONS) {
          const display = DESIGNATION_DISPLAY[designation]
          expect(display.name).toBeDefined()
          expect(display.title).toBeDefined()
          expect(display.description).toBeDefined()
          expect(display.requirement).toBeDefined()
          expect(display.iconVariant).toBeDefined()
          expect(display.colorToken).toBeDefined()
        }
      })
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // RESONANCE SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Resonance System', () => {
    describe('isResonanceActive', () => {
      const defaultInput = createDefaultResonanceInput()

      it('pattern_expertise activates at patternMasteryLevel >= 2', () => {
        const patternExpertiseBonus = RESONANCE_BONUSES.find(b => b.type === 'pattern_expertise')!
        expect(isResonanceActive(patternExpertiseBonus, { ...defaultInput, patternMasteryLevel: 1 })).toBe(false)
        expect(isResonanceActive(patternExpertiseBonus, { ...defaultInput, patternMasteryLevel: 2 })).toBe(true)
      })

      it('expertise_standing activates at maxExpertiseLevel >= 3', () => {
        const expertiseStandingBonus = RESONANCE_BONUSES.find(b => b.type === 'expertise_standing')!
        expect(isResonanceActive(expertiseStandingBonus, { ...defaultInput, maxExpertiseLevel: 2 })).toBe(false)
        expect(isResonanceActive(expertiseStandingBonus, { ...defaultInput, maxExpertiseLevel: 3 })).toBe(true)
      })

      it('challenge_stars requires both grade and challenge overcome', () => {
        const challengeStarsBonus = RESONANCE_BONUSES.find(b => b.type === 'challenge_stars')!
        expect(isResonanceActive(challengeStarsBonus, { ...defaultInput, challengeGradeIndex: 3, hasChallengeOvercome: false })).toBe(false)
        expect(isResonanceActive(challengeStarsBonus, { ...defaultInput, challengeGradeIndex: 2, hasChallengeOvercome: true })).toBe(false)
        expect(isResonanceActive(challengeStarsBonus, { ...defaultInput, challengeGradeIndex: 3, hasChallengeOvercome: true })).toBe(true)
      })

      it('stars_elite activates at totalStars >= 6', () => {
        const starsEliteBonus = RESONANCE_BONUSES.find(b => b.type === 'stars_elite')!
        expect(isResonanceActive(starsEliteBonus, { ...defaultInput, totalStars: 5 })).toBe(false)
        expect(isResonanceActive(starsEliteBonus, { ...defaultInput, totalStars: 6 })).toBe(true)
      })

      it('assessment_expertise activates when assessment complete', () => {
        const assessmentBonus = RESONANCE_BONUSES.find(b => b.type === 'assessment_expertise')!
        expect(isResonanceActive(assessmentBonus, { ...defaultInput, hasAssessmentComplete: false })).toBe(false)
        expect(isResonanceActive(assessmentBonus, { ...defaultInput, hasAssessmentComplete: true })).toBe(true)
      })

      it('cohort_standing activates only for leading cohort', () => {
        const cohortBonus = RESONANCE_BONUSES.find(b => b.type === 'cohort_standing')!
        expect(isResonanceActive(cohortBonus, { ...defaultInput, cohortStanding: 'ahead' })).toBe(false)
        expect(isResonanceActive(cohortBonus, { ...defaultInput, cohortStanding: 'leading' })).toBe(true)
      })
    })

    describe('getActiveResonances', () => {
      it('returns empty array for default input', () => {
        const resonances = getActiveResonances(createDefaultResonanceInput())
        expect(resonances).toHaveLength(0)
      })

      it('returns multiple resonances when qualified', () => {
        const input: ResonanceInput = {
          ...createDefaultResonanceInput(),
          patternMasteryLevel: 2,
          maxExpertiseLevel: 3,
          stationStandingLevel: 2
        }
        const resonances = getActiveResonances(input)
        expect(resonances.length).toBeGreaterThanOrEqual(2)
      })
    })

    describe('getResonanceMultiplier', () => {
      it('returns 1.0 with no active resonances', () => {
        const mult = getResonanceMultiplier('career_expertise', createDefaultResonanceInput())
        expect(mult).toBe(1.0)
      })

      it('returns correct multiplier with single resonance', () => {
        const input: ResonanceInput = {
          ...createDefaultResonanceInput(),
          patternMasteryLevel: 2
        }
        const mult = getResonanceMultiplier('career_expertise', input)
        expect(mult).toBe(1.15) // pattern_expertise bonus
      })

      it('multiplies stacking resonances', () => {
        const input: ResonanceInput = {
          ...createDefaultResonanceInput(),
          patternMasteryLevel: 2,
          hasAssessmentComplete: true
        }
        const mult = getResonanceMultiplier('career_expertise', input)
        // 1.15 * 1.15 = 1.3225
        expect(mult).toBeCloseTo(1.3225, 2)
      })
    })

    describe('getAllResonanceMultipliers', () => {
      it('returns multipliers for all categories', () => {
        const multipliers = getAllResonanceMultipliers(createDefaultResonanceInput())
        expect(multipliers.pattern_mastery).toBe(1.0)
        expect(multipliers.career_expertise).toBe(1.0)
        expect(multipliers.challenge_rating).toBe(1.0)
        expect(multipliers.station_standing).toBe(1.0)
        expect(multipliers.skill_stars).toBe(1.0)
        expect(multipliers.elite_status).toBe(1.0)
      })
    })

    describe('checkResonanceEvents', () => {
      it('returns empty array with no active resonances', () => {
        const events = checkResonanceEvents(createDefaultResonanceInput(), [])
        expect(events).toHaveLength(0)
      })

      it('returns assessment_amplification when assessment complete', () => {
        const input: ResonanceInput = {
          ...createDefaultResonanceInput(),
          hasAssessmentComplete: true
        }
        const events = checkResonanceEvents(input, [])
        const eventIds = events.map(e => e.id)
        expect(eventIds).toContain('assessment_amplification')
      })

      it('filters out completed events', () => {
        const input: ResonanceInput = {
          ...createDefaultResonanceInput(),
          hasAssessmentComplete: true
        }
        const events = checkResonanceEvents(input, ['assessment_amplification'])
        expect(events.find(e => e.id === 'assessment_amplification')).toBeUndefined()
      })
    })

    describe('getResonanceEventById', () => {
      it('finds existing event', () => {
        const event = getResonanceEventById('harmonic_convergence')
        expect(event).toBeDefined()
        expect(event?.name).toBe('Harmonic Convergence')
      })

      it('returns undefined for invalid id', () => {
        expect(getResonanceEventById('invalid')).toBeUndefined()
      })
    })

    describe('calculateResonanceState', () => {
      it('returns correct structure for empty input', () => {
        const state = calculateResonanceState(createDefaultResonanceInput())
        expect(state.activeResonances).toHaveLength(0)
        expect(state.pendingEvents).toHaveLength(0)
        expect(state.completedEventIds).toHaveLength(0)
        expect(state.totalMultiplier).toBe(1.0)
      })

      it('calculates total multiplier correctly', () => {
        const input: ResonanceInput = {
          ...createDefaultResonanceInput(),
          patternMasteryLevel: 2,
          maxExpertiseLevel: 3
        }
        const state = calculateResonanceState(input)
        // 1.15 * 1.20 = 1.38
        expect(state.totalMultiplier).toBeCloseTo(1.38, 2)
      })

      it('preserves completed event IDs', () => {
        const state = calculateResonanceState(createDefaultResonanceInput(), ['event1', 'event2'])
        expect(state.completedEventIds).toEqual(['event1', 'event2'])
      })
    })

    describe('getResonanceDisplayInfo', () => {
      it('returns display info for all bonuses', () => {
        for (const bonus of RESONANCE_BONUSES) {
          const info = getResonanceDisplayInfo(bonus)
          expect(info.name).toBeDefined()
          expect(info.description).toBeDefined()
          expect(info.bonusPercent).toBeGreaterThan(0)
          expect(info.sourceLabel).toBeDefined()
          expect(info.targetLabel).toBeDefined()
        }
      })

      it('calculates bonus percent correctly', () => {
        const bonus = RESONANCE_BONUSES.find(b => b.type === 'pattern_expertise')!
        const info = getResonanceDisplayInfo(bonus)
        expect(info.bonusPercent).toBe(15)
      })
    })

    describe('getSamuelResonanceMessage', () => {
      it('returns message for counts 0-4', () => {
        for (let i = 0; i <= 4; i++) {
          const message = getSamuelResonanceMessage(i)
          expect(typeof message).toBe('string')
          expect(message.length).toBeGreaterThan(0)
        }
      })

      it('clamps at 4 for higher counts', () => {
        const message = getSamuelResonanceMessage(10)
        expect(typeof message).toBe('string')
      })
    })

    describe('RESONANCE_BONUSES registry', () => {
      it('all bonuses have required fields', () => {
        for (const bonus of RESONANCE_BONUSES) {
          expect(bonus.type).toBeDefined()
          expect(bonus.sourceSystem).toBeDefined()
          expect(bonus.targetSystem).toBeDefined()
          expect(bonus.multiplier).toBeGreaterThan(1.0)
          expect(bonus.sourceMinLevel).toBeDefined()
          expect(bonus.description).toBeDefined()
        }
      })
    })

    describe('RESONANCE_EVENTS registry', () => {
      it('all events have required fields', () => {
        for (const event of RESONANCE_EVENTS) {
          expect(event.id).toBeDefined()
          expect(event.name).toBeDefined()
          expect(event.description).toBeDefined()
          expect(event.requiredResonances.length).toBeGreaterThan(0)
          expect(event.reward).toBeDefined()
          expect(event.samuelCommentary).toBeDefined()
        }
      })
    })
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // COHORT SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════

  describe('Cohort System', () => {
    describe('getCohortId', () => {
      it('generates correct format', () => {
        // Use mid-month timestamp to avoid timezone boundary issues
        const jan2026 = new Date(2026, 0, 15, 12, 0, 0).getTime()
        const id = getCohortId(jan2026)
        expect(id).toBe('2026-01')
      })

      it('pads single-digit months', () => {
        // Use mid-month timestamp to avoid timezone boundary issues
        // March 15, 2026 12:00:00 local time
        const march2026 = new Date(2026, 2, 15, 12, 0, 0).getTime()
        const id = getCohortId(march2026)
        expect(id).toBe('2026-03')
      })
    })

    describe('getCohortName', () => {
      it('returns special name for special cohorts', () => {
        expect(getCohortName('2026-01')).toBe('The Founders')
        expect(getCohortName('2026-02')).toBe('The Pioneers')
        expect(getCohortName('2026-03')).toBe('The Trailblazers')
      })

      it('returns default format for non-special cohorts', () => {
        expect(getCohortName('2026-04')).toBe('The April 2026 Travelers')
        expect(getCohortName('2026-12')).toBe('The December 2026 Travelers')
      })
    })

    describe('getCohortDates', () => {
      it('returns correct start and end dates', () => {
        const { startDate, endDate } = getCohortDates('2026-01')
        const start = new Date(startDate)
        const end = new Date(endDate)

        expect(start.getFullYear()).toBe(2026)
        expect(start.getMonth()).toBe(0)
        expect(start.getDate()).toBe(1)

        expect(end.getFullYear()).toBe(2026)
        expect(end.getMonth()).toBe(0)
        expect(end.getDate()).toBe(31)
      })
    })

    describe('createCohort', () => {
      it('creates full cohort object', () => {
        const cohort = createCohort('2026-01')
        expect(cohort.id).toBe('2026-01')
        expect(cohort.name).toBe('The Founders')
        expect(cohort.thematicName).toBe('The Founders')
        expect(cohort.startDate).toBeDefined()
        expect(cohort.endDate).toBeDefined()
      })

      it('no thematic name for regular cohorts', () => {
        const cohort = createCohort('2026-05')
        expect(cohort.thematicName).toBeUndefined()
      })
    })

    describe('getQualitativeStanding', () => {
      it('returns new for small cohort', () => {
        expect(getQualitativeStanding(90, 5)).toBe('new')
      })

      it('returns leading for 90+ percentile', () => {
        expect(getQualitativeStanding(95, 100)).toBe('leading')
        expect(getQualitativeStanding(90, 100)).toBe('leading')
      })

      it('returns ahead for 67-89 percentile', () => {
        expect(getQualitativeStanding(89, 100)).toBe('ahead')
        expect(getQualitativeStanding(67, 100)).toBe('ahead')
      })

      it('returns with_peers for 33-66 percentile', () => {
        expect(getQualitativeStanding(66, 100)).toBe('with_peers')
        expect(getQualitativeStanding(33, 100)).toBe('with_peers')
      })

      it('returns developing for <33 percentile', () => {
        expect(getQualitativeStanding(32, 100)).toBe('developing')
        expect(getQualitativeStanding(0, 100)).toBe('developing')
      })
    })

    describe('getStandingDescription', () => {
      it('returns description for all standings', () => {
        const standings = ['leading', 'ahead', 'with_peers', 'developing', 'new'] as const
        for (const standing of standings) {
          const desc = getStandingDescription(standing)
          expect(typeof desc).toBe('string')
          expect(desc.length).toBeGreaterThan(0)
        }
      })
    })

    describe('getStandingLabel', () => {
      it('returns label for all standings', () => {
        expect(getStandingLabel('leading')).toBe('Leading')
        expect(getStandingLabel('ahead')).toBe('Ahead')
        expect(getStandingLabel('with_peers')).toBe('With Peers')
        expect(getStandingLabel('developing')).toBe('Developing')
        expect(getStandingLabel('new')).toBe('New')
      })
    })

    describe('calculateLocalCohortComparison', () => {
      it('returns correct cohort info', () => {
        // Use mid-month timestamp to avoid timezone boundary issues
        const jan2026 = new Date(2026, 0, 15, 12, 0, 0).getTime()
        const result = calculateLocalCohortComparison(
          {
            createdAt: jan2026,
            totalOrbs: 50,
            charactersMet: 5,
            averageTrust: 5,
            arcsCompleted: 2,
            skillsDemonstrated: 10
          },
          2,
          3,
          Date.now()
        )

        expect(result.cohortId).toBe('2026-01')
        expect(result.cohortName).toBe('The Founders')
        expect(result.playerMetrics.overallPercentile).toBeGreaterThanOrEqual(0)
        expect(result.playerMetrics.overallPercentile).toBeLessThanOrEqual(100)
      })

      it('all percentiles are 0-100', () => {
        const result = calculateLocalCohortComparison(
          {
            createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 1 week ago
            totalOrbs: 100,
            charactersMet: 10,
            averageTrust: 8,
            arcsCompleted: 5,
            skillsDemonstrated: 20
          },
          3,
          4,
          Date.now()
        )

        expect(result.playerMetrics.patternMasteryPercentile).toBeGreaterThanOrEqual(0)
        expect(result.playerMetrics.patternMasteryPercentile).toBeLessThanOrEqual(100)
        expect(result.playerMetrics.careerExpertisePercentile).toBeGreaterThanOrEqual(0)
        expect(result.playerMetrics.careerExpertisePercentile).toBeLessThanOrEqual(100)
        expect(result.playerMetrics.stationStandingPercentile).toBeGreaterThanOrEqual(0)
        expect(result.playerMetrics.stationStandingPercentile).toBeLessThanOrEqual(100)
        expect(result.playerMetrics.engagementPercentile).toBeGreaterThanOrEqual(0)
        expect(result.playerMetrics.engagementPercentile).toBeLessThanOrEqual(100)
      })
    })

    describe('getSamuelCohortMessage', () => {
      it('returns message for all standings', () => {
        const standings = ['leading', 'ahead', 'with_peers', 'developing', 'new'] as const
        for (const standing of standings) {
          const message = getSamuelCohortMessage(standing)
          expect(typeof message).toBe('string')
          expect(message.length).toBeGreaterThan(0)
        }
      })
    })

    describe('getCohortDisplayInfo', () => {
      it('returns full display info for all standings', () => {
        const standings = ['leading', 'ahead', 'with_peers', 'developing', 'new'] as const
        for (const standing of standings) {
          const info = getCohortDisplayInfo(standing)
          expect(info.standing).toBe(standing)
          expect(info.label).toBeDefined()
          expect(info.description).toBeDefined()
          expect(info.colorToken).toBeDefined()
          expect(info.iconVariant).toBeDefined()
        }
      })
    })

    describe('formatPercentileDisplay', () => {
      it('formats percentiles correctly', () => {
        expect(formatPercentileDisplay(95)).toBe('Top 10%')
        expect(formatPercentileDisplay(90)).toBe('Top 10%')
        expect(formatPercentileDisplay(80)).toBe('Top 25%')
        expect(formatPercentileDisplay(75)).toBe('Top 25%')
        expect(formatPercentileDisplay(60)).toBe('Top Half')
        expect(formatPercentileDisplay(50)).toBe('Top Half')
        expect(formatPercentileDisplay(30)).toBe('Top 70%')
      })
    })

    describe('SPECIAL_COHORT_NAMES', () => {
      it('defines names for launch cohorts', () => {
        expect(SPECIAL_COHORT_NAMES['2026-01']).toBe('The Founders')
        expect(SPECIAL_COHORT_NAMES['2026-02']).toBe('The Pioneers')
        expect(SPECIAL_COHORT_NAMES['2026-03']).toBe('The Trailblazers')
      })
    })
  })
})
