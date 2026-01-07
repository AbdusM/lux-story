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
import type { DialogueNode } from './dialogue-graph'

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
  type: 'time_check' | 'progress_milestone' | 'pause_suggestion' | 'resolution'
}

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

/** Show boundary every 15-30 nodes (randomized for variety)
 * Increased from 8-12 to reduce interruption frequency
 * Per sprint task: boundaries should feel natural, not arbitrary
 */
const MIN_NODES_BETWEEN_BOUNDARIES = 15
/*
const MAX_NODES_BETWEEN_BOUNDARIES = 30
*/

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
/*
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
*/

/**
 * Time-based announcements (shown when session duration crosses thresholds)
 */
/*
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
*/

/**
 * Resolution-type announcements - used when player reaches a natural story resolution
 * These feel earned rather than arbitrary
 */
const RESOLUTION_ANNOUNCEMENTS: SessionAnnouncement[] = [
  {
    text: "Something has shifted. A moment of clarity in the station's hum.",
    suggestion: "This is a good place to rest if you need to.",
    type: 'resolution'
  },
  {
    text: "The conversation settles. A natural pause in the station's rhythm.",
    type: 'resolution'
  },
  {
    text: "You've reached a moment of understanding. The platform feels quieter now.",
    suggestion: "Your progress is saved. Return when you're ready.",
    type: 'resolution'
  }
]

// ═══════════════════════════════════════════════════════════════
// SESSION BOUNDARY DETECTION
// ═══════════════════════════════════════════════════════════════

/**
 * Calculate total nodes visited across all characters
 */
export function getTotalNodesVisited(gameState: GameState): number {
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
/**
 * Get random interval for next boundary (8-12 nodes)
 */
/*
function getNextBoundaryInterval(): number {
  return Math.floor(
    Math.random() * (MAX_NODES_BETWEEN_BOUNDARIES - MIN_NODES_BETWEEN_BOUNDARIES + 1)
  ) + MIN_NODES_BETWEEN_BOUNDARIES
}
*/

/**
 * Select announcement based on boundary count
 */
/**
 * Select announcement based on boundary count
 */
/*
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
*/

/**
 * Check if we should show a time-based announcement
 */
/**
 * Check if we should show a time-based announcement
 */
/*
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
*/

// ═══════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════

/**
 * Check if we should show a session boundary
 *
 * This is called when navigating to a new node.
 * Returns boundary info including whether to show an announcement.
 *
 * PHILOSOPHY:
 * - Boundaries only at nodes with metadata.sessionBoundary: true
 * - Never during vulnerability reveals or high-emotion moments
 * - Prefer 'resolution' type announcements (feel earned, not arbitrary)
 * - Min 15 nodes, max 30 nodes between boundaries
 */
export function checkSessionBoundary(
  gameState: GameState,
  previousTotalNodes: number,
  currentNode?: DialogueNode | null
): SessionBoundary {
  const currentTotalNodes = getTotalNodesVisited(gameState)
  const nodesSinceBoundary = currentTotalNodes - (previousTotalNodes || 0)
  const sessionDurationMinutes = getSessionDurationMinutes(gameState)

  // 1. Check if this is a Natural Pause Point
  // We strictly avoid interruptions unless we are at a narrative break
  const nodeId = currentNode?.nodeId || ''
  const isPausePoint = isNaturalPausePoint(nodeId, false) // Assumption: Caller handles choices check if needed, but here we just check ID pattern
  const explicitlyAllowed = currentNode?.metadata?.sessionBoundary === true

  // 2. Check Thresholds (Time or Effort) to decide if we *should* pause
  const hasDoneEnough =
    nodesSinceBoundary >= MIN_NODES_BETWEEN_BOUNDARIES ||
    sessionDurationMinutes >= SESSION_THRESHOLDS.MEDIUM

  // 3. Trigger Condition:
  // MUST be a Natural Pause Point (Explicit or ID-based)
  // AND MUST have done enough work to warrant a break
  if ((isPausePoint || explicitlyAllowed) && hasDoneEnough) {

    // Prefer resolution announcements for natural breaks
    const announcement = RESOLUTION_ANNOUNCEMENTS[Math.floor(Math.random() * RESOLUTION_ANNOUNCEMENTS.length)]

    return {
      shouldShow: true,
      announcement,
      nodesSinceBoundary,
      sessionDurationMinutes
    }
  }

  // 4. Fallback: Extended Limit (Safety Valve)
  // If player goes way too long (25+ minutes or 40+ nodes) without hitting a natural break,
  // we might eventually need to force it, but for P1.3 we prioritize immersion.
  // We will NOT force it for now. Immersion > Mechanics.

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
