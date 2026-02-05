/**
 * TD-005: Storage Migration Tests
 *
 * Tests for localStorage key migration from legacy to v2 format.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { migrateLocalStorageKeys, getLegacyKeysPresent, getStorageAudit } from '@/lib/persistence/storage-migration'
import { STORAGE_KEYS, LEGACY_KEY_MAP } from '@/lib/persistence/storage-keys'

describe('Storage Migration', () => {
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

  describe('migrateLocalStorageKeys', () => {
    it('migrates legacy key to new key', () => {
      // Set up legacy key
      mockStorage.set('lux_audio_muted', 'true')

      const result = migrateLocalStorageKeys()

      // Should migrate to new key
      expect(result.migrated).toContain('lux_audio_muted')
      expect(mockStorage.get(STORAGE_KEYS.AUDIO_MUTED)).toBe('true')
      expect(mockStorage.has('lux_audio_muted')).toBe(false)
    })

    it('skips migration if new key already exists', () => {
      // Set up both legacy and new key
      mockStorage.set('lux_audio_muted', 'false')
      mockStorage.set(STORAGE_KEYS.AUDIO_MUTED, 'true')

      const result = migrateLocalStorageKeys()

      // Should skip and keep new value
      expect(result.skipped).toContain('lux_audio_muted')
      expect(mockStorage.get(STORAGE_KEYS.AUDIO_MUTED)).toBe('true')
      expect(mockStorage.has('lux_audio_muted')).toBe(false) // Legacy removed
    })

    it('returns empty result when no legacy keys exist', () => {
      const result = migrateLocalStorageKeys()

      expect(result.migrated).toHaveLength(0)
      expect(result.skipped).toHaveLength(0)
      expect(result.failed).toHaveLength(0)
    })

    it('migrates multiple keys at once', () => {
      mockStorage.set('lux_audio_muted', 'true')
      mockStorage.set('lux_audio_volume', '0.75')

      const result = migrateLocalStorageKeys()

      expect(result.migrated).toContain('lux_audio_muted')
      expect(result.migrated).toContain('lux_audio_volume')
      expect(mockStorage.get(STORAGE_KEYS.AUDIO_MUTED)).toBe('true')
      expect(mockStorage.get(STORAGE_KEYS.AUDIO_VOLUME)).toBe('0.75')
    })

    it('is idempotent - safe to call multiple times', () => {
      mockStorage.set('lux_audio_muted', 'true')

      const result1 = migrateLocalStorageKeys()
      const result2 = migrateLocalStorageKeys()

      expect(result1.migrated).toContain('lux_audio_muted')
      expect(result2.migrated).toHaveLength(0) // Already migrated
    })
  })

  describe('getLegacyKeysPresent', () => {
    it('returns legacy keys that exist', () => {
      mockStorage.set('lux_audio_muted', 'true')
      mockStorage.set('grand-central-terminus-save', '{}')

      const legacyKeys = getLegacyKeysPresent()

      expect(legacyKeys).toContain('lux_audio_muted')
      expect(legacyKeys).toContain('grand-central-terminus-save')
    })

    it('returns empty array when no legacy keys exist', () => {
      mockStorage.set(STORAGE_KEYS.AUDIO_MUTED, 'true')

      const legacyKeys = getLegacyKeysPresent()

      expect(legacyKeys).toHaveLength(0)
    })
  })

  describe('getStorageAudit', () => {
    it('categorizes keys correctly', () => {
      // V2 keys
      mockStorage.set('lux_story_v2_audio_muted', 'true')
      mockStorage.set('lux_story_v2_game_store', '{}')

      // Legacy keys
      mockStorage.set('lux_audio_muted', 'false')

      // Unknown keys
      mockStorage.set('some_random_key', 'value')

      const audit = getStorageAudit()

      expect(audit.v2Keys).toContain('lux_story_v2_audio_muted')
      expect(audit.v2Keys).toContain('lux_story_v2_game_store')
      expect(audit.legacyKeys).toContain('lux_audio_muted')
      expect(audit.unknownKeys).toContain('some_random_key')
    })

    it('excludes dev/godMode keys from unknown', () => {
      mockStorage.set('godMode_showHiddenChoices', 'true')
      mockStorage.set('godMode_customSetting', 'value')

      const audit = getStorageAudit()

      expect(audit.unknownKeys).not.toContain('godMode_showHiddenChoices')
      expect(audit.unknownKeys).not.toContain('godMode_customSetting')
    })
  })
})
