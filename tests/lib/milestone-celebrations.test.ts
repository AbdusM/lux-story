/**
 * D-038: Milestone Celebrations Tests
 */

import { describe, it, expect } from 'vitest'
import {
  CELEBRATION_DEFAULTS,
  PATTERN_CELEBRATION_MESSAGES,
  createFirstMeetingCelebration,
  createTrustMilestoneCelebration,
  createPatternCelebration,
  createArcCompletionCelebration,
  createAchievementCelebration,
  createIdentityCelebration,
  checkPatternCelebration,
  checkTrustCelebration,
  getReducedMotionEffect,
  getCelebrationWithMotionPreference,
  type CelebrationType,
  type MilestoneCelebration
} from '@/lib/milestone-celebrations'
import { PATTERN_TYPES, type PatternType } from '@/lib/patterns'
import type { MetaAchievement } from '@/lib/meta-achievements'

describe('Milestone Celebrations (D-038)', () => {
  describe('CELEBRATION_DEFAULTS', () => {
    const celebrationTypes: CelebrationType[] = [
      'first_meeting',
      'trust_milestone',
      'pattern_emerging',
      'pattern_flourishing',
      'arc_complete',
      'achievement',
      'full_trust',
      'identity_formed'
    ]

    it('should have defaults for all celebration types', () => {
      celebrationTypes.forEach(type => {
        expect(CELEBRATION_DEFAULTS[type]).toBeDefined()
        expect(CELEBRATION_DEFAULTS[type].effect).toBeDefined()
        expect(CELEBRATION_DEFAULTS[type].duration).toBeGreaterThan(0)
        expect(CELEBRATION_DEFAULTS[type].icon).toBeDefined()
      })
    })
  })

  describe('PATTERN_CELEBRATION_MESSAGES', () => {
    it('should have messages for all patterns', () => {
      PATTERN_TYPES.forEach((pattern: PatternType) => {
        expect(PATTERN_CELEBRATION_MESSAGES[pattern]).toBeDefined()
        expect(PATTERN_CELEBRATION_MESSAGES[pattern].emerging).toBeDefined()
        expect(PATTERN_CELEBRATION_MESSAGES[pattern].flourishing).toBeDefined()
      })
    })

    it('should have distinct messages for emerging vs flourishing', () => {
      PATTERN_TYPES.forEach((pattern: PatternType) => {
        expect(PATTERN_CELEBRATION_MESSAGES[pattern].emerging)
          .not.toBe(PATTERN_CELEBRATION_MESSAGES[pattern].flourishing)
      })
    })
  })

  describe('createFirstMeetingCelebration', () => {
    it('should create a valid first meeting celebration', () => {
      const celebration = createFirstMeetingCelebration('maya', 'Maya')

      expect(celebration.type).toBe('first_meeting')
      expect(celebration.title).toBe('New Connection')
      expect(celebration.message).toContain('Maya')
      expect(celebration.characterId).toBe('maya')
      expect(celebration.id).toContain('first_meeting')
    })
  })

  describe('createTrustMilestoneCelebration', () => {
    it('should create trust milestone for level 5', () => {
      const celebration = createTrustMilestoneCelebration('devon', 'Devon', 5)

      expect(celebration.type).toBe('trust_milestone')
      expect(celebration.title).toBe('Growing Trust')
      expect(celebration.message).toContain('Devon')
    })

    it('should create full trust celebration for level 10', () => {
      const celebration = createTrustMilestoneCelebration('samuel', 'Samuel', 10)

      expect(celebration.type).toBe('full_trust')
      expect(celebration.title).toBe('Deep Bond')
      expect(celebration.message).toContain('completely')
    })
  })

  describe('createPatternCelebration', () => {
    it('should create emerging pattern celebration', () => {
      const celebration = createPatternCelebration('analytical', 'emerging')

      expect(celebration.type).toBe('pattern_emerging')
      expect(celebration.patternType).toBe('analytical')
      expect(celebration.title).toContain('Emerging')
    })

    it('should create flourishing pattern celebration', () => {
      const celebration = createPatternCelebration('helping', 'flourishing')

      expect(celebration.type).toBe('pattern_flourishing')
      expect(celebration.patternType).toBe('helping')
      expect(celebration.title).toBe('The Harmonic') // Label from PATTERN_METADATA
    })

    it('should include pattern color', () => {
      const celebration = createPatternCelebration('building', 'flourishing')
      expect(celebration.color).toBeDefined()
    })
  })

  describe('createArcCompletionCelebration', () => {
    it('should create arc completion celebration', () => {
      const celebration = createArcCompletionCelebration('rohan', 'Rohan', 'Finding Truth')

      expect(celebration.type).toBe('arc_complete')
      expect(celebration.title).toBe('Journey Complete')
      expect(celebration.message).toContain('Rohan')
      expect(celebration.message).toContain('Finding Truth')
    })
  })

  describe('createAchievementCelebration', () => {
    const mockAchievement: MetaAchievement = {
      id: 'test_achievement',
      name: 'Test Achievement',
      description: 'This is a test',
      samuelQuote: 'Testing...',
      rarity: 'common',
      category: 'pattern',
      icon: '🎯'
    }

    it('should create achievement celebration', () => {
      const celebration = createAchievementCelebration(mockAchievement)

      expect(celebration.type).toBe('achievement')
      expect(celebration.title).toBe('Test Achievement')
      expect(celebration.message).toBe('This is a test')
      expect(celebration.icon).toBe('🎯')
      expect(celebration.achievementId).toBe('test_achievement')
    })
  })

  describe('createIdentityCelebration', () => {
    it('should create identity celebration', () => {
      const celebration = createIdentityCelebration('patience')

      expect(celebration.type).toBe('identity_formed')
      expect(celebration.patternType).toBe('patience')
      expect(celebration.title).toContain('The Anchor')
    })
  })

  describe('checkPatternCelebration', () => {
    it('should return emerging when crossing threshold 3', () => {
      expect(checkPatternCelebration(2, 3)).toBe('emerging')
      expect(checkPatternCelebration(2, 5)).toBe('emerging')
    })

    it('should return flourishing when crossing threshold 9', () => {
      expect(checkPatternCelebration(8, 9)).toBe('flourishing')
      expect(checkPatternCelebration(5, 10)).toBe('flourishing')
    })

    it('should prioritize flourishing over emerging', () => {
      // If jumping from 0 to 10, should return flourishing
      expect(checkPatternCelebration(0, 10)).toBe('flourishing')
    })

    it('should return null if no threshold crossed', () => {
      expect(checkPatternCelebration(3, 4)).toBeNull()
      expect(checkPatternCelebration(5, 8)).toBeNull()
    })
  })

  describe('checkTrustCelebration', () => {
    it('should return 5 when crossing threshold 5', () => {
      expect(checkTrustCelebration(4, 5)).toBe(5)
      expect(checkTrustCelebration(3, 7)).toBe(5)
    })

    it('should return 10 when crossing threshold 10', () => {
      expect(checkTrustCelebration(9, 10)).toBe(10)
      expect(checkTrustCelebration(7, 10)).toBe(10)
    })

    it('should prioritize 10 over 5', () => {
      // If jumping from 0 to 10, should return 10
      expect(checkTrustCelebration(0, 10)).toBe(10)
    })

    it('should return null if no milestone crossed', () => {
      expect(checkTrustCelebration(5, 7)).toBeNull()
      expect(checkTrustCelebration(1, 4)).toBeNull()
    })
  })

  describe('getReducedMotionEffect', () => {
    it('should simplify particle effects to glow', () => {
      expect(getReducedMotionEffect('confetti')).toBe('glow')
      expect(getReducedMotionEffect('sparkle')).toBe('glow')
      expect(getReducedMotionEffect('ripple')).toBe('glow')
    })

    it('should simplify shimmer to pulse', () => {
      expect(getReducedMotionEffect('shimmer')).toBe('pulse')
    })

    it('should keep simple effects unchanged', () => {
      expect(getReducedMotionEffect('glow')).toBe('glow')
      expect(getReducedMotionEffect('pulse')).toBe('pulse')
      expect(getReducedMotionEffect('none')).toBe('none')
    })
  })

  describe('getCelebrationWithMotionPreference', () => {
    const baseCelebration: MilestoneCelebration = {
      id: 'test',
      type: 'pattern_flourishing',
      effect: 'confetti',
      duration: 4000,
      title: 'Test',
      message: 'Test message'
    }

    it('should not modify celebration when reduced motion is false', () => {
      const result = getCelebrationWithMotionPreference(baseCelebration, false)
      expect(result.effect).toBe('confetti')
      expect(result.duration).toBe(4000)
    })

    it('should simplify effect when reduced motion is true', () => {
      const result = getCelebrationWithMotionPreference(baseCelebration, true)
      expect(result.effect).toBe('glow')
    })

    it('should cap duration when reduced motion is true', () => {
      const result = getCelebrationWithMotionPreference(baseCelebration, true)
      expect(result.duration).toBeLessThanOrEqual(2000)
    })
  })
})
