/**
 * God Mode Validation Utilities
 *
 * Input validation for God Mode API to prevent invalid state mutations
 */

import { CHARACTER_IDS, findCharacterForNode, type CharacterId, type NodeSearchResult } from '@/lib/graph-registry'
import { PATTERN_TYPES, type PatternType } from '@/lib/patterns'
import { MAX_TRUST, MIN_TRUST } from '@/lib/constants'
import { THOUGHT_REGISTRY } from '@/content/thoughts'
import { useGameStore } from '@/lib/game-store'

/**
 * Validate character ID exists in the game
 */
export function validateCharacterId(id: string): id is CharacterId {
  return CHARACTER_IDS.includes(id as CharacterId)
}

/**
 * Validate pattern type exists
 */
export function validatePattern(pattern: string): pattern is PatternType {
  return PATTERN_TYPES.includes(pattern as PatternType)
}

/**
 * Clamp trust value to valid range [0, 10]
 * @param value - Raw trust value
 * @returns Clamped value within valid range
 */
export function validateTrust(value: number): number {
  if (isNaN(value)) {
    console.warn('[God Mode] Invalid trust value (NaN), defaulting to 0')
    return MIN_TRUST
  }

  const clamped = Math.max(MIN_TRUST, Math.min(MAX_TRUST, value))

  if (clamped !== value) {
    console.warn(`[God Mode] Trust value ${value} clamped to valid range [${MIN_TRUST}, ${MAX_TRUST}]: ${clamped}`)
  }

  return clamped
}

/**
 * Clamp pattern level to valid range [0, 9]
 * @param level - Raw pattern level
 * @returns Clamped level within valid range
 */
export function validatePatternLevel(level: number): number {
  const MIN_PATTERN = 0
  const MAX_PATTERN = 9 // FLOURISHING threshold

  if (isNaN(level)) {
    console.warn('[God Mode] Invalid pattern level (NaN), defaulting to 0')
    return MIN_PATTERN
  }

  const clamped = Math.max(MIN_PATTERN, Math.min(MAX_PATTERN, level))

  if (clamped !== level) {
    console.warn(`[God Mode] Pattern level ${level} clamped to valid range [${MIN_PATTERN}, ${MAX_PATTERN}]: ${clamped}`)
  }

  return clamped
}

/**
 * Validate node ID exists in dialogue graphs
 * @param nodeId - Node to search for
 * @returns NodeSearchResult if found, null otherwise
 */
export function validateNodeId(nodeId: string): NodeSearchResult | null {
  const store = useGameStore.getState()

  if (!store.coreGameState) {
    console.error('[God Mode] Cannot validate node: game state not hydrated')
    return null
  }

  // findCharacterForNode requires GameState, but we have SerializableGameState
  // We can use getCoreGameStateHydrated() selector instead
  const hydratedState = store.getCoreGameStateHydrated()

  if (!hydratedState) {
    console.error('[God Mode] Cannot validate node: unable to hydrate game state')
    return null
  }

  const result = findCharacterForNode(nodeId, hydratedState)

  if (!result) {
    console.warn(`[God Mode] Node '${nodeId}' not found in any dialogue graph`)
  }

  return result
}

/**
 * Validate thought ID exists in thought registry
 * @param thoughtId - Thought to validate
 * @returns true if valid
 */
export function validateThoughtId(thoughtId: string): boolean {
  const isValid = thoughtId in THOUGHT_REGISTRY

  if (!isValid) {
    console.warn(`[God Mode] Thought '${thoughtId}' not found in THOUGHT_REGISTRY`)
  }

  return isValid
}

/**
 * Validate mystery setting and value
 * @param setting - Mystery setting key
 * @param value - Value to set
 * @returns true if valid combination
 */
export function validateMystery(setting: string, value: string): boolean {
  const validSettings = {
    letterSender: ['samuel', 'unknown', 'player', 'platform_seven'] as const,
    platformSeven: ['hidden', 'revealed', 'accessible', 'completed'] as const,
    samuelsPast: ['unknown', 'hinted', 'revealed'] as const,
    stationNature: ['mystery', 'liminal', 'metaphor', 'revealed'] as const
  }

  if (!(setting in validSettings)) {
    console.warn(`[God Mode] Invalid mystery setting '${setting}'. Valid: ${Object.keys(validSettings).join(', ')}`)
    return false
  }

  const validValues = validSettings[setting as keyof typeof validSettings]
  if (!validValues.includes(value as never)) {
    console.warn(`[God Mode] Invalid value '${value}' for mystery '${setting}'. Valid: ${validValues.join(', ')}`)
    return false
  }

  return true
}

/**
 * Check if game state is hydrated and ready for mutations
 * @returns true if ready, false otherwise
 */
export function checkGameStateHydrated(): boolean {
  const state = useGameStore.getState()

  if (!state.coreGameState) {
    console.error('[God Mode] Game state not hydrated yet. Start a game first.')
    return false
  }

  return true
}

/**
 * Validation result with error message
 */
export interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Comprehensive validation helper
 * @param checks - Array of validation checks
 * @returns First failed validation or success
 */
export function validate(...checks: Array<{ valid: boolean; error: string }>): ValidationResult {
  for (const check of checks) {
    if (!check.valid) {
      return { valid: false, error: check.error }
    }
  }
  return { valid: true }
}
