/**
 * Session Tracker
 *
 * Tracks player sessions for returning player experience.
 * Shows brief recap when player returns after being away.
 *
 * PHILOSOPHY:
 * - Welcome returning players without being intrusive
 * - Brief recap helps re-establish context
 * - Progress reminder reinforces loop visibility
 */

import type { SerializableGameState, PlayerPatterns } from './character-state'
import { PATTERN_METADATA, type PatternType, getDominantPattern } from './patterns'

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

/** Minimum time away (in ms) to show returning player summary */
const MIN_TIME_AWAY = 60 * 60 * 1000 // 1 hour

/** LocalStorage key for last play timestamp */
const LAST_PLAY_KEY = 'lux-last-play-time'

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface SessionSummary {
  /** Time since last play in human-readable format */
  timeAway: string

  /** Characters met in last session (up to 3) */
  recentCharacters: string[]

  /** Dominant pattern name */
  dominantPattern: string | null

  /** Dominant pattern label */
  dominantPatternLabel: string | null

  /** Total trust earned across characters */
  totalTrust: number

  /** Number of characters with trust > 0 */
  charactersWithTrust: number

  /** Brief suggestion for what to do next */
  suggestion: string
}

// ═══════════════════════════════════════════════════════════════
// CORE FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Record current timestamp as last play time
 * Call this when player navigates away or closes app
 */
export function recordPlayTime(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(LAST_PLAY_KEY, Date.now().toString())
}

/**
 * Get time since last play in milliseconds
 * Returns 0 if no previous play time recorded
 */
export function getTimeSinceLastPlay(): number {
  if (typeof window === 'undefined') return 0

  const lastPlay = localStorage.getItem(LAST_PLAY_KEY)
  if (!lastPlay) return 0

  const lastPlayTime = parseInt(lastPlay, 10)
  if (isNaN(lastPlayTime)) return 0

  return Date.now() - lastPlayTime
}

/**
 * Check if player is returning after being away
 */
export function isReturningPlayer(): boolean {
  const timeSince = getTimeSinceLastPlay()
  return timeSince >= MIN_TIME_AWAY
}

/**
 * Format time duration in human-readable form
 */
export function formatTimeAway(ms: number): string {
  const hours = Math.floor(ms / (60 * 60 * 1000))
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return days === 1 ? '1 day' : `${days} days`
  }
  if (hours > 0) {
    return hours === 1 ? '1 hour' : `${hours} hours`
  }
  return 'a while'
}

/**
 * Get characters with trust in order of trust level
 */
function getCharactersWithTrust(characters: SerializableGameState['characters']): { name: string; trust: number }[] {
  return characters
    .filter(c => c.trust > 0)
    .sort((a, b) => b.trust - a.trust)
    .map(c => ({ name: c.characterId, trust: c.trust }))
}

/**
 * Generate a suggestion based on game state
 */
function generateSuggestion(gameState: SerializableGameState): string {
  // Check for characters with high trust that might have new content
  const highTrustChars = gameState.characters.filter(c => c.trust >= 5 && c.trust < 8)
  if (highTrustChars.length > 0) {
    const charName = highTrustChars[0].characterId.charAt(0).toUpperCase() + highTrustChars[0].characterId.slice(1)
    return `${charName} might have more to share with you.`
  }

  // Check for low-trust characters to suggest
  const unexploredChars = gameState.characters.filter(c => c.trust > 0 && c.trust < 3)
  if (unexploredChars.length > 0) {
    return "Continue exploring the station's stories."
  }

  // Default
  return "The station remembers your journey."
}

/**
 * Generate session summary for returning player
 */
export function generateSessionSummary(gameState: SerializableGameState | null): SessionSummary | null {
  const timeSince = getTimeSinceLastPlay()

  // Not a returning player or no game state
  if (timeSince < MIN_TIME_AWAY || !gameState) {
    return null
  }

  const charactersWithTrust = getCharactersWithTrust(gameState.characters)
  // Use threshold 1 to return any pattern with progress
  const dominantPattern = getDominantPattern(gameState.patterns, 1)

  // Calculate total trust
  const totalTrust = gameState.characters.reduce((sum, c) => sum + c.trust, 0)

  // Get recent character names (capitalize first letter)
  const recentCharacters = charactersWithTrust
    .slice(0, 3)
    .map(c => c.name.charAt(0).toUpperCase() + c.name.slice(1))

  return {
    timeAway: formatTimeAway(timeSince),
    recentCharacters,
    dominantPattern: dominantPattern ?? null,
    dominantPatternLabel: dominantPattern ? PATTERN_METADATA[dominantPattern].label : null,
    totalTrust,
    charactersWithTrust: charactersWithTrust.length,
    suggestion: generateSuggestion(gameState)
  }
}

/**
 * Hook to track play time on visibility change
 * Call this in a top-level component
 */
export function setupPlayTimeTracking(): () => void {
  if (typeof window === 'undefined') return () => {}

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      recordPlayTime()
    }
  }

  const handleBeforeUnload = () => {
    recordPlayTime()
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('beforeunload', handleBeforeUnload)

  // Initial record
  recordPlayTime()

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('beforeunload', handleBeforeUnload)
  }
}
