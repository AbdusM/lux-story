/**
 * Session Boundaries System
 *
 * Natural pause points every 10 nodes for mobile-optimized sessions.
 * Provides atmospheric platform announcements and auto-save functionality.
 */

import { DialogueNode } from './character-state'

export interface SessionBoundary {
  /** The nodeId where this boundary occurs */
  nodeId: string
  /** Session number (1, 2, 3, etc.) */
  sessionNumber: number
  /** Character this boundary belongs to */
  characterId: string
  /** Platform announcement to show */
  platformAnnouncement: string
  /** Act that's ending */
  actEnd?: 'introduction' | 'crossroads' | 'challenge' | 'insight'
  /** Whether to show save prompt */
  savePrompt: boolean
  /** Estimated duration to next boundary (minutes) */
  estimatedDuration: number
}

export interface SessionMetrics {
  /** Total sessions completed */
  totalSessions: number
  /** Average session duration in minutes */
  avgSessionDuration: number
  /** Number of boundaries crossed */
  boundariesCrossed: number
  /** Last boundary node visited */
  lastBoundaryNode: string | null
  /** When current session started */
  sessionStartTime: number
  /** Session durations history (in minutes) */
  sessionDurations: number[]
}

/**
 * Default session metrics for new players
 */
export const defaultSessionMetrics: SessionMetrics = {
  totalSessions: 0,
  avgSessionDuration: 0,
  boundariesCrossed: 0,
  lastBoundaryNode: null,
  sessionStartTime: Date.now(),
  sessionDurations: []
}

/**
 * Check if a node is marked as a session boundary
 */
export function isSessionBoundary(node: DialogueNode): boolean {
  return node.metadata?.sessionBoundary === true
}

/**
 * Get session boundary metadata from a node
 */
export function getBoundaryForNode(node: DialogueNode): SessionBoundary | null {
  if (!isSessionBoundary(node)) {
    return null
  }

  const metadata = node.metadata as any

  return {
    nodeId: node.nodeId,
    sessionNumber: metadata.sessionNumber || 1,
    characterId: metadata.characterId || 'unknown',
    platformAnnouncement: metadata.platformAnnouncement || '',
    actEnd: metadata.actEnd,
    savePrompt: true,
    estimatedDuration: metadata.estimatedDuration || 10
  }
}

/**
 * Get all session boundaries for a character's dialogue graph
 *
 * @param nodes - Array of dialogue nodes for a character
 * @returns Array of session boundaries in order
 */
export function getSessionBoundaries(nodes: DialogueNode[]): SessionBoundary[] {
  const boundaries: SessionBoundary[] = []

  for (const node of nodes) {
    const boundary = getBoundaryForNode(node)
    if (boundary) {
      boundaries.push(boundary)
    }
  }

  // Sort by session number
  return boundaries.sort((a, b) => a.sessionNumber - b.sessionNumber)
}

/**
 * Calculate session metrics based on current state
 *
 * @param metrics - Current session metrics
 * @param sessionEndTime - When the session ended (defaults to now)
 * @returns Updated session metrics
 */
export function updateSessionMetrics(
  metrics: SessionMetrics,
  sessionEndTime: number = Date.now()
): SessionMetrics {
  const sessionDuration = (sessionEndTime - metrics.sessionStartTime) / 1000 / 60 // Convert to minutes

  const newSessionDurations = [...metrics.sessionDurations, sessionDuration]
  const totalDuration = newSessionDurations.reduce((sum, dur) => sum + dur, 0)
  const avgDuration = newSessionDurations.length > 0
    ? totalDuration / newSessionDurations.length
    : 0

  return {
    ...metrics,
    totalSessions: metrics.totalSessions + 1,
    avgSessionDuration: Math.round(avgDuration * 10) / 10, // Round to 1 decimal
    boundariesCrossed: metrics.boundariesCrossed + 1,
    sessionDurations: newSessionDurations,
    sessionStartTime: sessionEndTime // Next session starts when this one ends
  }
}

/**
 * Reset session start time (called when player resumes)
 */
export function resetSessionStartTime(metrics: SessionMetrics): SessionMetrics {
  return {
    ...metrics,
    sessionStartTime: Date.now()
  }
}

/**
 * Get recommended session boundaries for a character arc
 * Returns standard boundary node numbers based on arc length
 *
 * @param totalNodes - Total nodes in character arc
 * @returns Array of node numbers where boundaries should be placed
 */
export function getRecommendedBoundaries(totalNodes: number): number[] {
  const boundaries: number[] = []

  // Session 1: Node 10 (end of Act 1: Introduction)
  if (totalNodes >= 10) boundaries.push(10)

  // Session 2: Node 20 (end of Act 2: Crossroads)
  if (totalNodes >= 20) boundaries.push(20)

  // Session 3: Node 30 (end of Act 3: Challenge)
  if (totalNodes >= 30) boundaries.push(30)

  // Session 4: Node 35+ (end of Act 4: Insight)
  if (totalNodes >= 35) boundaries.push(35)

  return boundaries
}

/**
 * Estimate session duration based on node count
 * Average: 30 seconds per node (reading + choice selection)
 *
 * @param nodeCount - Number of nodes until next boundary
 * @returns Estimated duration in minutes
 */
export function estimateSessionDuration(nodeCount: number): number {
  const secondsPerNode = 30
  const totalSeconds = nodeCount * secondsPerNode
  const minutes = totalSeconds / 60
  return Math.round(minutes)
}
