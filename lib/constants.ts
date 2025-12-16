/**
 * Canonical Constants - Single Source of Truth
 *
 * All magic numbers and thresholds should be defined here.
 * Import from this file rather than hardcoding values.
 */

// ═══════════════════════════════════════════════════════════════════════════
// ORB SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Maximum orb count per pattern type
 * Used for fill percentage calculations
 */
export const MAX_ORB_COUNT = 100

/**
 * Orb tier thresholds (for unlocks)
 */
export const ORB_TIER_THRESHOLDS = {
  nascent: 0,
  emerging: 10,
  developing: 30,
  flourishing: 60,
  mastered: 100
} as const

/**
 * Pattern unlock thresholds (percentage of max orbs)
 * Used for achievement milestones
 */
export const ORB_UNLOCK_THRESHOLDS = [10, 50, 85] as const

// ═══════════════════════════════════════════════════════════════════════════
// TRUST SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Maximum trust level with a character
 */
export const MAX_TRUST = 10

/**
 * Minimum trust level (can't go negative)
 */
export const MIN_TRUST = 0

/**
 * Initial trust level for new characters
 */
export const INITIAL_TRUST = 0

/**
 * Trust thresholds for relationship status changes
 */
export const TRUST_THRESHOLDS = {
  stranger: 0,
  acquaintance: 2,
  friendly: 4,
  trusted: 6,
  close: 8,
  bonded: 10
} as const

// ═══════════════════════════════════════════════════════════════════════════
// IDENTITY SYSTEM (Disco Elysium mechanic)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Pattern level when identity offering is triggered
 */
export const IDENTITY_THRESHOLD = 5

/**
 * Bonus multiplier for internalized patterns (+20%)
 */
export const INTERNALIZE_BONUS = 0.20

/**
 * No penalty for discarding identity
 */
export const DISCARD_PENALTY = 0

// ═══════════════════════════════════════════════════════════════════════════
// SESSION BOUNDARIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Minimum nodes before showing session boundary
 */
export const SESSION_BOUNDARY_MIN_NODES = 8

/**
 * Maximum nodes before forcing session boundary
 */
export const SESSION_BOUNDARY_MAX_NODES = 12

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Probability of showing pattern sensation on choice
 */
export const PATTERN_SENSATION_PROBABILITY = 0.3

/**
 * Dominant pattern threshold (for voice variations)
 */
export const DOMINANT_PATTERN_THRESHOLD = 5

// ═══════════════════════════════════════════════════════════════════════════
// UI CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Minimum height for choice container (pixels)
 */
export const CHOICE_CONTAINER_MIN_HEIGHT = 140

/**
 * Default typing speed for characters (ms per character)
 */
export const DEFAULT_TYPING_SPEED = 30

/**
 * Avatar size in pixels
 */
export const AVATAR_SIZE = 32

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION TIMINGS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Standard fade duration (ms)
 */
export const FADE_DURATION = 300

/**
 * Dialogue reveal speed (ms between lines)
 */
export const DIALOGUE_REVEAL_DELAY = 100

/**
 * Thinking indicator display time (ms)
 */
export const THINKING_INDICATOR_DURATION = 800

/**
 * Choice handler timeout - safety net for stuck states (ms)
 */
export const CHOICE_HANDLER_TIMEOUT_MS = 10000
