/**
 * Session Structure System
 *
 * Provides mobile-friendly session boundaries for 5-10 minute play sessions
 * Shows platform announcements every 8-12 nodes to create natural pause points
 *
 * PHILOSOPHY:
 * - Players need clear stopping points on mobile
 * - Sessions should feel complete, not interrupted
 * - Announcements add to immersion (train station metaphor)
 */

import type { GameState } from './character-state'

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface SessionBoundary {
  /** Should we show a boundary announcement? */
  shouldShow: boolean

  /** The announcement text to display */
  announcement?: SessionAnnouncement

  /** Nodes since last boundary */
  nodesSinceBoundary: number

  /** Total session time in minutes */
  sessionDurationMinutes: number
}

export interface SessionAnnouncement {
  /** Main announcement text */
  text: string

  /** Optional suggestion for what to do */
  suggestion?: string

  /** Type of announcement */
  type: 'time_check' | 'progress_milestone' | 'pause_suggestion'
}

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

/** Show boundary every 8-12 nodes (randomized for variety) */
const MIN_NODES_BETWEEN_BOUNDARIES = 8
const MAX_NODES_BETWEEN_BOUNDARIES = 12

/** Session duration thresholds (in minutes) */
const SESSION_THRESHOLDS = {
  SHORT: 5,
  MEDIUM: 10,
  LONG: 15,
  EXTENDED: 20
} as const

// ═══════════════════════════════════════════════════════════════
// BOUNDARY ANNOUNCEMENTS
// ═══════════════════════════════════════════════════════════════

/**
 * Platform announcements that fit the train station metaphor
 * Vary based on how many boundaries have been crossed
 */
const BOUNDARY_ANNOUNCEMENTS: Record<number, SessionAnnouncement[]> = {
  // First boundary (after 8-12 nodes)
  0: [
    {
      text: "The platform hums quietly. You've been here a little while now.",
      suggestion: "This might be a good place to pause if you need to.",
      type: 'time_check'
    },
    {
      text: "A gentle chime echoes through the station—time passes differently here.",
      type: 'time_check'
    }
  ],

  // Second boundary
  1: [
    {
      text: "You notice the platform clock. Time keeps moving, even in between.",
      suggestion: "You can always return later—your journey will wait.",
      type: 'pause_suggestion'
    },
    {
      text: "The station feels more familiar now. You're finding your rhythm.",
      type: 'progress_milestone'
    }
  ],

  // Third+ boundaries
  2: [
    {
      text: "The platform announcer whispers: 'All travelers—remember to rest when needed.'",
      suggestion: "Consider taking a break. The station will be here when you return.",
      type: 'pause_suggestion'
    },
    {
      text: "You've wandered deeper into the station's stories.",
      type: 'progress_milestone'
    },
    {
      text: "The tracks hum with possibilities. You're making real progress.",
      type: 'progress_milestone'
    }
  ]
}

/**
 * Time-based announcements (shown when session duration crosses thresholds)
 */
const TIME_ANNOUNCEMENTS: Record<keyof typeof SESSION_THRESHOLDS, SessionAnnouncement> = {
  SHORT: {
    text: "You've been on the platform for about 5 minutes.",
    type: 'time_check'
  },
  MEDIUM: {
    text: "Ten minutes have passed. The station holds many more stories.",
    suggestion: "This might be a natural place to pause.",
    type: 'pause_suggestion'
  },
  LONG: {
    text: "Fifteen minutes at Grand Central Terminus. You're really exploring now.",
    suggestion: "Consider saving your progress here.",
    type: 'pause_suggestion'
  },
  EXTENDED: {
    text: "Twenty minutes in the station. You've gone deep into these stories.",
    suggestion: "The platform will remember where you left off.",
    type: 'pause_suggestion'
  }
}

// ═══════════════════════════════════════════════════════════════
// SESSION BOUNDARY DETECTION
// ═══════════════════════════════════════════════════════════════

/**
 * Calculate total nodes visited across all characters
 */
function getTotalNodesVisited(gameState: GameState): number {
  let total = 0
  gameState.characters.forEach(char => {
    total += char.conversationHistory.length
  })
  return total
}

/**
 * Calculate session duration in minutes
 */
function getSessionDurationMinutes(gameState: GameState): number {
  const now = Date.now()
  const durationMs = now - gameState.sessionStartTime
  return Math.floor(durationMs / 60000) // Convert to minutes
}

/**
 * Get random interval for next boundary (8-12 nodes)
 */
function getNextBoundaryInterval(): number {
  return Math.floor(
    Math.random() * (MAX_NODES_BETWEEN_BOUNDARIES - MIN_NODES_BETWEEN_BOUNDARIES + 1)
  ) + MIN_NODES_BETWEEN_BOUNDARIES
}

/**
 * Select announcement based on boundary count
 */
function selectAnnouncement(boundaryCount: number): SessionAnnouncement {
  let pool: SessionAnnouncement[]

  if (boundaryCount === 0) {
    pool = BOUNDARY_ANNOUNCEMENTS[0]
  } else if (boundaryCount === 1) {
    pool = BOUNDARY_ANNOUNCEMENTS[1]
  } else {
    pool = BOUNDARY_ANNOUNCEMENTS[2]
  }

  // Random selection from pool
  const index = Math.floor(Math.random() * pool.length)
  return pool[index]
}

/**
 * Check if we should show a time-based announcement
 */
function checkTimeThreshold(
  durationMinutes: number,
  lastDuration: number
): SessionAnnouncement | null {
  // Check each threshold
  if (lastDuration < SESSION_THRESHOLDS.SHORT && durationMinutes >= SESSION_THRESHOLDS.SHORT) {
    return TIME_ANNOUNCEMENTS.SHORT
  }
  if (lastDuration < SESSION_THRESHOLDS.MEDIUM && durationMinutes >= SESSION_THRESHOLDS.MEDIUM) {
    return TIME_ANNOUNCEMENTS.MEDIUM
  }
  if (lastDuration < SESSION_THRESHOLDS.LONG && durationMinutes >= SESSION_THRESHOLDS.LONG) {
    return TIME_ANNOUNCEMENTS.LONG
  }
  if (lastDuration < SESSION_THRESHOLDS.EXTENDED && durationMinutes >= SESSION_THRESHOLDS.EXTENDED) {
    return TIME_ANNOUNCEMENTS.EXTENDED
  }

  return null
}

// ═══════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════

/**
 * Check if we should show a session boundary
 *
 * This is called when navigating to a new node.
 * Returns boundary info including whether to show an announcement.
 */
export function checkSessionBoundary(
  gameState: GameState,
  previousTotalNodes: number
): SessionBoundary {
  const currentTotalNodes = getTotalNodesVisited(gameState)
  const nodesSinceBoundary = currentTotalNodes - (previousTotalNodes || 0)
  const sessionDurationMinutes = getSessionDurationMinutes(gameState)

  // Determine if we should show a boundary
  const boundaryInterval = getNextBoundaryInterval()
  const shouldShowNodeBoundary = nodesSinceBoundary >= boundaryInterval

  // Check for time-based announcement (takes precedence)
  const timeAnnouncement = checkTimeThreshold(
    sessionDurationMinutes,
    0 // We'll need to track last announcement time in game state
  )

  if (timeAnnouncement) {
    return {
      shouldShow: true,
      announcement: timeAnnouncement,
      nodesSinceBoundary,
      sessionDurationMinutes
    }
  }

  // Show node-based boundary if threshold reached
  if (shouldShowNodeBoundary) {
    const announcement = selectAnnouncement(gameState.sessionBoundariesCrossed)

    return {
      shouldShow: true,
      announcement,
      nodesSinceBoundary,
      sessionDurationMinutes
    }
  }

  // No boundary to show
  return {
    shouldShow: false,
    nodesSinceBoundary,
    sessionDurationMinutes
  }
}

/**
 * Get formatted session duration string
 */
export function formatSessionDuration(durationMinutes: number): string {
  if (durationMinutes < 1) {
    return 'just started'
  } else if (durationMinutes === 1) {
    return '1 minute'
  } else if (durationMinutes < 60) {
    return `${durationMinutes} minutes`
  } else {
    const hours = Math.floor(durationMinutes / 60)
    const mins = durationMinutes % 60
    if (mins === 0) {
      return hours === 1 ? '1 hour' : `${hours} hours`
    }
    return `${hours}h ${mins}m`
  }
}

/**
 * Increment session boundary counter (call after showing boundary)
 */
export function incrementBoundaryCounter(gameState: GameState): GameState {
  return {
    ...gameState,
    sessionBoundariesCrossed: gameState.sessionBoundariesCrossed + 1
  }
}

/**
 * Reset session timer (call when starting new session)
 */
export function resetSessionTimer(gameState: GameState): GameState {
  return {
    ...gameState,
    sessionStartTime: Date.now(),
    sessionBoundariesCrossed: 0
  }
}

/**
 * Check if this is a good natural pause point
 * (End of character arc, major choice made, etc.)
 */
export function isNaturalPausePoint(nodeId: string, hasChoices: boolean): boolean {
  // No choices = end of current thread = good pause point
  if (!hasChoices) {
    return true
  }

  // Major milestone nodes (you can add specific node IDs here)
  const pauseNodePatterns = [
    /ending$/,           // Character arc endings
    /farewell$/,         // Goodbye nodes
    /reflection$/,       // Reflection moments
    /crossroads$/        // Major decision points
  ]

  return pauseNodePatterns.some(pattern => pattern.test(nodeId))
}
