/**
 * TD-004: Orb Migration Helper
 *
 * Migrates orb state from legacy localStorage keys to GameState.
 * This runs once during game initialization if legacy keys are found.
 */

import type { OrbState } from '@/lib/character-state'
import type { OrbBalance, OrbType } from '@/lib/orbs'
import { INITIAL_ORB_BALANCE } from '@/lib/orbs'
import { logger } from '@/lib/logger'

// Legacy localStorage keys
const LEGACY_KEYS = {
  BALANCE: 'lux-orb-balance',
  MILESTONES: 'lux-orb-milestones',
  LAST_VIEWED: 'lux-orb-last-viewed',
  LAST_VIEWED_BALANCE: 'lux-orb-last-viewed-balance',
  ACKNOWLEDGED: 'lux-orb-acknowledged'
} as const

/**
 * Check if legacy orb keys exist in localStorage
 */
export function hasLegacyOrbKeys(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(LEGACY_KEYS.BALANCE) !== null
}

/**
 * Migrate orb state from legacy localStorage keys to OrbState format.
 * Returns the migrated state, or null if no legacy keys found.
 *
 * IMPORTANT: This removes the legacy keys after successful migration!
 */
export function migrateOrbsFromLocalStorage(): OrbState | null {
  if (typeof window === 'undefined') return null

  // Check for legacy balance key
  const legacyBalanceStr = localStorage.getItem(LEGACY_KEYS.BALANCE)
  if (!legacyBalanceStr) return null

  try {
    // Parse legacy balance
    const legacyBalance: OrbBalance = JSON.parse(legacyBalanceStr)

    // Parse legacy milestones
    const legacyMilestonesStr = localStorage.getItem(LEGACY_KEYS.MILESTONES)
    const legacyMilestones = legacyMilestonesStr
      ? JSON.parse(legacyMilestonesStr)
      : {
          firstOrb: false,
          tierEmerging: false,
          tierDeveloping: false,
          tierFlourishing: false,
          tierMastered: false,
          streak3: false,
          streak5: false,
          streak10: false
        }

    // Parse last viewed timestamp
    const legacyLastViewedStr = localStorage.getItem(LEGACY_KEYS.LAST_VIEWED)
    const legacyLastViewed = legacyLastViewedStr ? parseInt(legacyLastViewedStr, 10) : 0

    // Parse last viewed balance
    const legacyLastViewedBalanceStr = localStorage.getItem(LEGACY_KEYS.LAST_VIEWED_BALANCE)
    const legacyLastViewedBalance: Partial<Record<OrbType, number>> = legacyLastViewedBalanceStr
      ? JSON.parse(legacyLastViewedBalanceStr)
      : {}

    // Parse acknowledged milestones
    const legacyAcknowledgedStr = localStorage.getItem(LEGACY_KEYS.ACKNOWLEDGED)
    const legacyAcknowledged: Partial<Record<string, boolean>> = legacyAcknowledgedStr
      ? JSON.parse(legacyAcknowledgedStr)
      : {}

    // Build the migrated OrbState
    const migratedOrbs: OrbState = {
      balance: {
        ...INITIAL_ORB_BALANCE,
        ...legacyBalance
      },
      milestones: legacyMilestones,
      lastViewed: legacyLastViewed,
      lastViewedBalance: legacyLastViewedBalance,
      acknowledged: legacyAcknowledged
    }

    // Remove legacy keys after successful migration
    localStorage.removeItem(LEGACY_KEYS.BALANCE)
    localStorage.removeItem(LEGACY_KEYS.MILESTONES)
    localStorage.removeItem(LEGACY_KEYS.LAST_VIEWED)
    localStorage.removeItem(LEGACY_KEYS.LAST_VIEWED_BALANCE)
    localStorage.removeItem(LEGACY_KEYS.ACKNOWLEDGED)

    logger.info('[Orb Migration] Migrated orb state from legacy localStorage', {
      totalEarned: migratedOrbs.balance.totalEarned,
      milestones: Object.entries(migratedOrbs.milestones)
        .filter(([, v]) => v)
        .map(([k]) => k)
    })

    return migratedOrbs

  } catch (error) {
    logger.error('[Orb Migration] Failed to migrate orb state', { error })
    return null
  }
}

/**
 * Get legacy orb keys that still exist (for debugging)
 */
export function getLegacyOrbKeys(): string[] {
  if (typeof window === 'undefined') return []

  return Object.values(LEGACY_KEYS).filter(key =>
    localStorage.getItem(key) !== null
  )
}
