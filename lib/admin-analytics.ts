/**
 * Admin Analytics System
 * Feature IDs: D-011, D-012, D-014, D-015
 * 
 * Provides real-time insights, drop-off tracking, A/B testing, and cohort analysis.
 */

import { GameState } from './character-state'

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface AnalyticsEvent {
    id: string
    timestamp: number
    userId: string
    sessionId: string
    type: 'node_visit' | 'choice_made' | 'pattern_update' | 'trust_change'
    data: Record<string, unknown>
}

// ═══════════════════════════════════════════════════════════════════════════
// D-011: REAL-TIME FLOW TRACKING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Track active users on nodes
 */
export const ACTIVE_NODE_USERS = new Map<string, Set<string>>()

export function trackUserOnNode(userId: string, nodeId: string): void {
    // Remove from previous nodes if possible (simplified here)
    ACTIVE_NODE_USERS.forEach(users => users.delete(userId))

    if (!ACTIVE_NODE_USERS.has(nodeId)) {
        ACTIVE_NODE_USERS.set(nodeId, new Set())
    }
    ACTIVE_NODE_USERS.get(nodeId)!.add(userId)
}

export function getActiveUserCount(nodeId: string): number {
    return ACTIVE_NODE_USERS.get(nodeId)?.size || 0
}

// ═══════════════════════════════════════════════════════════════════════════
// D-012: DROP-OFF HEATMAP
// ═══════════════════════════════════════════════════════════════════════════

export interface DropOffMetrics {
    nodeId: string
    visits: number
    exits: number // People who stopped playing here
    dropOffRate: number
}

const EXIT_TRACKING = new Map<string, { visits: number, exits: number }>()

export function recordVisit(nodeId: string): void {
    const current = EXIT_TRACKING.get(nodeId) || { visits: 0, exits: 0 }
    EXIT_TRACKING.set(nodeId, { ...current, visits: current.visits + 1 })
}

export function recordExit(nodeId: string): void {
    const current = EXIT_TRACKING.get(nodeId) || { visits: 0, exits: 0 }
    EXIT_TRACKING.set(nodeId, { ...current, exits: current.exits + 1 })
}

export function getDropOffRate(nodeId: string): number {
    const data = EXIT_TRACKING.get(nodeId)
    if (!data || data.visits === 0) return 0
    return data.exits / data.visits
}

// ═══════════════════════════════════════════════════════════════════════════
// D-014: A/B TESTING FRAMEWORK
// ═══════════════════════════════════════════════════════════════════════════

export interface ABTest {
    id: string
    variants: string[]
    weights?: number[] // Defaults to equal split
}

export const ACTIVE_TESTS: Record<string, ABTest> = {}

export function assignVariant(testId: string, userId: string): string {
    const test = ACTIVE_TESTS[testId]
    if (!test) return 'control'

    // Simple deterministic hash assignment
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const index = hash % test.variants.length
    return test.variants[index]
}

// ═══════════════════════════════════════════════════════════════════════════
// D-015: COHORT ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════

export type CohortType = 'daily' | 'pattern' | 'completion'

export function getUserCohort(
    userState: GameState,
    type: CohortType
): string {
    switch (type) {
        case 'daily':
            const date = new Date(userState.sessionStartTime)
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

        case 'pattern':
            // Return dominant pattern
            let dominant = 'balanced'
            let maxVal = 0
            for (const [p, v] of Object.entries(userState.patterns)) {
                if ((v as number) > maxVal) {
                    maxVal = (v as number)
                    dominant = p
                }
            }
            return dominant

        case 'completion':
            const progress = userState.globalFlags.size // Proxy for progress
            if (progress > 100) return 'veteran'
            if (progress > 50) return 'regular'
            return 'novice'

        default:
            return 'unknown'
    }
}
