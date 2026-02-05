/**
 * TD-005: localStorage Migration
 *
 * Migrates legacy localStorage keys to the new unified format.
 * This runs once on app initialization if legacy keys are found.
 *
 * Migration rules:
 * 1. If legacy key exists and new key doesn't: migrate value
 * 2. If both exist: keep new key value (already migrated)
 * 3. If only new key exists: nothing to do
 * 4. After migration: remove legacy keys
 */

import { STORAGE_KEYS, LEGACY_KEY_MAP, type StorageKey } from './storage-keys'
import { logger } from '@/lib/logger'

export interface MigrationResult {
  /** Keys that were successfully migrated */
  migrated: string[]
  /** Keys that were skipped (new key already exists) */
  skipped: string[]
  /** Keys that failed to migrate */
  failed: string[]
}

/**
 * Migrate all legacy localStorage keys to new unified format.
 * Safe to call multiple times - idempotent operation.
 *
 * @returns Migration result with lists of migrated, skipped, and failed keys
 */
export function migrateLocalStorageKeys(): MigrationResult {
  if (typeof window === 'undefined') {
    return { migrated: [], skipped: [], failed: [] }
  }

  const result: MigrationResult = {
    migrated: [],
    skipped: [],
    failed: []
  }

  for (const [legacyKey, newKeyName] of Object.entries(LEGACY_KEY_MAP)) {
    try {
      const legacyValue = localStorage.getItem(legacyKey)

      // No legacy value to migrate
      if (legacyValue === null) {
        continue
      }

      const newKey = STORAGE_KEYS[newKeyName as StorageKey]
      const existingValue = localStorage.getItem(newKey)

      if (existingValue !== null) {
        // New key already has data, skip migration but remove legacy
        result.skipped.push(legacyKey)
        localStorage.removeItem(legacyKey)
        continue
      }

      // Migrate value to new key
      localStorage.setItem(newKey, legacyValue)
      localStorage.removeItem(legacyKey)
      result.migrated.push(legacyKey)

    } catch (error) {
      logger.error('[Storage Migration] Failed to migrate key', {
        legacyKey,
        error
      })
      result.failed.push(legacyKey)
    }
  }

  // Log migration summary if anything happened
  if (result.migrated.length > 0 || result.skipped.length > 0) {
    logger.info('[Storage Migration] Migration complete', {
      migrated: result.migrated.length,
      skipped: result.skipped.length,
      failed: result.failed.length,
      migratedKeys: result.migrated
    })
  }

  return result
}

/**
 * Check if any legacy keys still exist (for debugging/verification)
 */
export function getLegacyKeysPresent(): string[] {
  if (typeof window === 'undefined') return []

  return Object.keys(LEGACY_KEY_MAP).filter(key =>
    localStorage.getItem(key) !== null
  )
}

/**
 * Get all storage keys currently in use (for debugging)
 */
export function getStorageAudit(): {
  v2Keys: string[]
  legacyKeys: string[]
  unknownKeys: string[]
} {
  if (typeof window === 'undefined') {
    return { v2Keys: [], legacyKeys: [], unknownKeys: [] }
  }

  const v2Prefix = 'lux_story_v2_'
  const knownLegacyKeys = new Set(Object.keys(LEGACY_KEY_MAP))
  const devKeys = new Set(['godMode_showHiddenChoices', 'godMode_skipAnimations'])

  const v2Keys: string[] = []
  const legacyKeys: string[] = []
  const unknownKeys: string[] = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key) continue

    if (key.startsWith(v2Prefix)) {
      v2Keys.push(key)
    } else if (knownLegacyKeys.has(key)) {
      legacyKeys.push(key)
    } else if (!devKeys.has(key) && !key.startsWith('godMode_')) {
      // Skip dev keys, but track unknown keys
      unknownKeys.push(key)
    }
  }

  return { v2Keys, legacyKeys, unknownKeys }
}
