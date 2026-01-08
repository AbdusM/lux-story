/**
 * Character Tiers Tests
 * Tests for the Narrative Resource Allocation System
 */

import { describe, it, expect } from 'vitest'
import {
  CHARACTER_TIERS,
  TIER_CONFIGS,
  CharacterTier,
  getCharacterTier,
  getCharacterTierConfig,
  getCharactersByTier,
  meetsDialogueTarget,
  meetsVoiceTarget,
  getExpansionPriority,
  getExpansionOrder,
  generateTierReport
} from '@/lib/character-tiers'
import { CharacterId } from '@/lib/graph-registry'

describe('Character Tiers System', () => {
  describe('TIER_CONFIGS', () => {
    it('should have configurations for all 4 tiers', () => {
      expect(TIER_CONFIGS[1]).toBeDefined()
      expect(TIER_CONFIGS[2]).toBeDefined()
      expect(TIER_CONFIGS[3]).toBeDefined()
      expect(TIER_CONFIGS[4]).toBeDefined()
    })

    it('should have decreasing targets by tier', () => {
      expect(TIER_CONFIGS[1].dialogueTarget).toBeGreaterThan(TIER_CONFIGS[2].dialogueTarget)
      expect(TIER_CONFIGS[2].dialogueTarget).toBeGreaterThan(TIER_CONFIGS[3].dialogueTarget)
      expect(TIER_CONFIGS[3].dialogueTarget).toBeGreaterThan(TIER_CONFIGS[4].dialogueTarget)
    })

    it('should have voice variation targets', () => {
      expect(TIER_CONFIGS[1].voiceVariationTarget).toBe(15)
      expect(TIER_CONFIGS[2].voiceVariationTarget).toBe(10)
      expect(TIER_CONFIGS[3].voiceVariationTarget).toBe(6)
      expect(TIER_CONFIGS[4].voiceVariationTarget).toBe(6)
    })
  })

  describe('CHARACTER_TIERS', () => {
    it('should assign all 16 main characters to tiers', () => {
      const characters: CharacterId[] = [
        'maya', 'devon', 'marcus', 'tess', 'rohan', 'elena',
        'alex', 'grace', 'jordan', 'kai', 'silas', 'yaquin',
        'asha', 'lira', 'zara', 'samuel'
      ]

      characters.forEach(charId => {
        expect(CHARACTER_TIERS[charId]).toBeDefined()
        expect([1, 2, 3, 4]).toContain(CHARACTER_TIERS[charId])
      })
    })

    it('should have Samuel in Tier 1 as hub character', () => {
      expect(CHARACTER_TIERS.samuel).toBe(1)
    })

    it('should have Maya and Devon in Tier 1 as flagship characters', () => {
      expect(CHARACTER_TIERS.maya).toBe(1)
      expect(CHARACTER_TIERS.devon).toBe(1)
    })

    it('should distribute characters across all tiers', () => {
      const tier1 = Object.values(CHARACTER_TIERS).filter(t => t === 1).length
      const tier2 = Object.values(CHARACTER_TIERS).filter(t => t === 2).length
      const tier3 = Object.values(CHARACTER_TIERS).filter(t => t === 3).length
      const tier4 = Object.values(CHARACTER_TIERS).filter(t => t === 4).length

      expect(tier1).toBeGreaterThan(0)
      expect(tier2).toBeGreaterThan(0)
      expect(tier3).toBeGreaterThan(0)
      expect(tier4).toBeGreaterThan(0)
    })
  })

  describe('getCharacterTier', () => {
    it('should return correct tier for known characters', () => {
      expect(getCharacterTier('samuel')).toBe(1)
      expect(getCharacterTier('marcus')).toBe(2)
      expect(getCharacterTier('grace')).toBe(3)
      expect(getCharacterTier('silas')).toBe(4)
    })

    it('should return tier 4 for unknown characters', () => {
      expect(getCharacterTier('unknown_char' as CharacterId)).toBe(4)
    })
  })

  describe('getCharacterTierConfig', () => {
    it('should return full config with tier number', () => {
      const config = getCharacterTierConfig('samuel')

      expect(config.tier).toBe(1)
      expect(config.dialogueTarget).toBe(80)
      expect(config.voiceVariationTarget).toBe(15)
      expect(config.description).toBeTruthy()
    })
  })

  describe('getCharactersByTier', () => {
    it('should return Tier 1 characters', () => {
      const tier1 = getCharactersByTier(1)

      expect(tier1).toContain('samuel')
      expect(tier1).toContain('maya')
      expect(tier1).toContain('devon')
    })

    it('should not include Tier 2 characters in Tier 1 result', () => {
      const tier1 = getCharactersByTier(1)

      expect(tier1).not.toContain('marcus')
      expect(tier1).not.toContain('tess')
    })

    it('should return correct count per tier', () => {
      expect(getCharactersByTier(1).length).toBe(3)  // samuel, maya, devon
      expect(getCharactersByTier(2).length).toBe(6)  // marcus, tess, rohan, kai, quinn, nadia
      expect(getCharactersByTier(3).length).toBe(6)  // grace, elena, alex, yaquin, dante, isaiah
      expect(getCharactersByTier(4).length).toBe(5)  // silas, asha, lira, zara, jordan
    })
  })

  describe('meetsDialogueTarget', () => {
    it('should return true when at or above target', () => {
      expect(meetsDialogueTarget('samuel', 80)).toBe(true)
      expect(meetsDialogueTarget('samuel', 100)).toBe(true)
    })

    it('should return false when below target', () => {
      expect(meetsDialogueTarget('samuel', 79)).toBe(false)
      expect(meetsDialogueTarget('samuel', 50)).toBe(false)
    })

    it('should use appropriate tier target', () => {
      // Tier 4 character with 25 nodes meets target
      expect(meetsDialogueTarget('silas', 25)).toBe(true)
      // Tier 1 character with 25 nodes does not
      expect(meetsDialogueTarget('samuel', 25)).toBe(false)
    })
  })

  describe('meetsVoiceTarget', () => {
    it('should return true when at or above target', () => {
      expect(meetsVoiceTarget('samuel', 15)).toBe(true)
      expect(meetsVoiceTarget('silas', 6)).toBe(true)
    })

    it('should return false when below target', () => {
      expect(meetsVoiceTarget('samuel', 14)).toBe(false)
    })
  })

  describe('getExpansionPriority', () => {
    it('should give higher priority to higher tiers', () => {
      // Same stats, different tiers
      const tier1Priority = getExpansionPriority('samuel', 50, 10)
      const tier4Priority = getExpansionPriority('silas', 50, 10)

      expect(tier1Priority).toBeGreaterThan(tier4Priority)
    })

    it('should give higher priority to bigger gaps', () => {
      // Same tier, different gaps
      const bigGap = getExpansionPriority('samuel', 20, 5)
      const smallGap = getExpansionPriority('samuel', 70, 12)

      expect(bigGap).toBeGreaterThan(smallGap)
    })

    it('should return 0 gap contribution when at target', () => {
      const atTarget = getExpansionPriority('silas', 25, 6)
      const aboveTarget = getExpansionPriority('silas', 30, 8)

      // Both should have same tier priority (gap is 0)
      // Tier 4 base = (5-4)*100 = 100
      expect(atTarget).toBe(100)
      expect(aboveTarget).toBe(100)
    })
  })

  describe('getExpansionOrder', () => {
    it('should order by priority (highest first)', () => {
      // Provide stats for ALL Tier 1 characters to make test deterministic
      // (characters without stats get 0/0 which creates max gap)
      const stats = new Map<CharacterId, { nodes: number; voiceVariations: number }>([
        ['samuel', { nodes: 50, voiceVariations: 10 }],  // Tier 1, big gap
        ['maya', { nodes: 80, voiceVariations: 15 }],    // Tier 1, at target
        ['devon', { nodes: 80, voiceVariations: 15 }],   // Tier 1, at target
        ['silas', { nodes: 25, voiceVariations: 6 }],    // Tier 4, at target
        ['marcus', { nodes: 30, voiceVariations: 5 }]    // Tier 2, medium gap
      ])

      const order = getExpansionOrder(stats)

      // Samuel should be first (Tier 1 with gap, others at target)
      expect(order[0]).toBe('samuel')
    })

    it('should include all characters', () => {
      const stats = new Map<CharacterId, { nodes: number; voiceVariations: number }>()
      const order = getExpansionOrder(stats)

      expect(order.length).toBe(20)  // 16 original + 4 new (quinn, dante, nadia, isaiah)
    })
  })

  describe('generateTierReport', () => {
    it('should generate markdown report', () => {
      const stats = new Map<CharacterId, { nodes: number; voiceVariations: number }>([
        ['samuel', { nodes: 100, voiceVariations: 15 }],
        ['maya', { nodes: 50, voiceVariations: 12 }]
      ])

      const report = generateTierReport(stats)

      expect(report).toContain('# Character Tier Progress Report')
      expect(report).toContain('Tier 1')
      expect(report).toContain('samuel')
      expect(report).toContain('✅') // At least one target met
    })

    it('should show warning for missed targets', () => {
      const stats = new Map<CharacterId, { nodes: number; voiceVariations: number }>([
        ['samuel', { nodes: 20, voiceVariations: 5 }]  // Below targets
      ])

      const report = generateTierReport(stats)

      expect(report).toContain('⚠️')
    })
  })
})
