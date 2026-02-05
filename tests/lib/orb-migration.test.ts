/**
 * TD-004: Orb Migration Tests
 *
 * Tests for orb state migration from legacy localStorage to GameState.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { migrateOrbsFromLocalStorage, hasLegacyOrbKeys, getLegacyOrbKeys } from '@/lib/migrations/orb-migration'
import type { OrbBalance } from '@/lib/orbs'

describe('Orb Migration', () => {
  // Mock localStorage
  let mockStorage: Map<string, string>

  beforeEach(() => {
    mockStorage = new Map()

    // Mock localStorage methods
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => mockStorage.get(key) ?? null,
      setItem: (key: string, value: string) => mockStorage.set(key, value),
      removeItem: (key: string) => mockStorage.delete(key),
      key: (index: number) => Array.from(mockStorage.keys())[index] ?? null,
      get length() { return mockStorage.size },
      clear: () => mockStorage.clear()
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('hasLegacyOrbKeys', () => {
    it('returns true when legacy balance key exists', () => {
      mockStorage.set('lux-orb-balance', '{}')

      expect(hasLegacyOrbKeys()).toBe(true)
    })

    it('returns false when no legacy keys exist', () => {
      expect(hasLegacyOrbKeys()).toBe(false)
    })
  })

  describe('migrateOrbsFromLocalStorage', () => {
    it('returns null when no legacy keys exist', () => {
      const result = migrateOrbsFromLocalStorage()

      expect(result).toBeNull()
    })

    it('migrates balance from legacy key', () => {
      const legacyBalance: OrbBalance = {
        analytical: 5,
        patience: 3,
        exploring: 2,
        helping: 4,
        building: 1,
        totalEarned: 15
      }
      mockStorage.set('lux-orb-balance', JSON.stringify(legacyBalance))

      const result = migrateOrbsFromLocalStorage()

      expect(result).not.toBeNull()
      expect(result?.balance.analytical).toBe(5)
      expect(result?.balance.patience).toBe(3)
      expect(result?.balance.totalEarned).toBe(15)
    })

    it('migrates milestones from legacy key', () => {
      mockStorage.set('lux-orb-balance', '{"analytical":0,"patience":0,"exploring":0,"helping":0,"building":0,"totalEarned":0}')
      mockStorage.set('lux-orb-milestones', JSON.stringify({
        firstOrb: true,
        tierEmerging: true,
        tierDeveloping: false
      }))

      const result = migrateOrbsFromLocalStorage()

      expect(result?.milestones.firstOrb).toBe(true)
      expect(result?.milestones.tierEmerging).toBe(true)
      expect(result?.milestones.tierDeveloping).toBe(false)
    })

    it('migrates lastViewed timestamp', () => {
      mockStorage.set('lux-orb-balance', '{"analytical":0,"patience":0,"exploring":0,"helping":0,"building":0,"totalEarned":0}')
      mockStorage.set('lux-orb-last-viewed', '1704067200000')

      const result = migrateOrbsFromLocalStorage()

      expect(result?.lastViewed).toBe(1704067200000)
    })

    it('removes legacy keys after migration', () => {
      mockStorage.set('lux-orb-balance', '{"analytical":5,"patience":0,"exploring":0,"helping":0,"building":0,"totalEarned":5}')
      mockStorage.set('lux-orb-milestones', '{}')
      mockStorage.set('lux-orb-last-viewed', '1000')
      mockStorage.set('lux-orb-last-viewed-balance', '{}')
      mockStorage.set('lux-orb-acknowledged', '{}')

      migrateOrbsFromLocalStorage()

      expect(mockStorage.has('lux-orb-balance')).toBe(false)
      expect(mockStorage.has('lux-orb-milestones')).toBe(false)
      expect(mockStorage.has('lux-orb-last-viewed')).toBe(false)
      expect(mockStorage.has('lux-orb-last-viewed-balance')).toBe(false)
      expect(mockStorage.has('lux-orb-acknowledged')).toBe(false)
    })

    it('provides defaults for missing optional keys', () => {
      // Only balance key exists
      mockStorage.set('lux-orb-balance', '{"analytical":1,"patience":0,"exploring":0,"helping":0,"building":0,"totalEarned":1}')

      const result = migrateOrbsFromLocalStorage()

      expect(result).not.toBeNull()
      expect(result?.lastViewed).toBe(0)
      expect(result?.milestones.firstOrb).toBe(false)
      expect(result?.lastViewedBalance).toEqual({})
      expect(result?.acknowledged).toEqual({})
    })

    it('handles malformed JSON gracefully', () => {
      mockStorage.set('lux-orb-balance', 'not valid json')

      const result = migrateOrbsFromLocalStorage()

      expect(result).toBeNull()
    })
  })

  describe('getLegacyOrbKeys', () => {
    it('returns list of existing legacy keys', () => {
      mockStorage.set('lux-orb-balance', '{}')
      mockStorage.set('lux-orb-milestones', '{}')

      const keys = getLegacyOrbKeys()

      expect(keys).toContain('lux-orb-balance')
      expect(keys).toContain('lux-orb-milestones')
      expect(keys).toHaveLength(2)
    })

    it('returns empty array when no legacy keys exist', () => {
      const keys = getLegacyOrbKeys()

      expect(keys).toHaveLength(0)
    })
  })
})
