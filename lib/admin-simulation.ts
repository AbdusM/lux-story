/**
 * Admin Simulation System
 * Feature ID: D-094
 * 
 * Predictive modeling to simulate user path outcomes based on current state.
 */

import { GameState } from './character-state'
import { PatternType } from './patterns'

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SimulationResult {
    predictedTrust: Record<string, number>
    predictedPatterns: Record<PatternType, number>
    likelyOutcomes: string[] // IDs of likely future plot nodes
    churnProbability: number
}

// ═══════════════════════════════════════════════════════════════════════════
// LOGIC
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Simulate future state based on current trajectory
 */
export function simulateUserOutcome(
    currentState: GameState,
    stepsAhead: number = 5
): SimulationResult {
    // 1. Project Pattern Growth
    // (Simple linear projection based on current dominant pattern)
    const predictedPatterns = { ...currentState.patterns }
    const dominantPattern = getDominantPattern(predictedPatterns)

    if (dominantPattern) {
        predictedPatterns[dominantPattern] += (stepsAhead * 0.5) // Assume continued growth
    }

    // 2. Project Trust Growth
    // (Assume trust grows with characters player interacts with most)
    // Simplified: Add 1 trust to currently active character
    const predictedTrust = { ...getAllTrustValues(currentState) }
    if (currentState.currentCharacterId) {
        const currentTrust = predictedTrust[currentState.currentCharacterId] || 0
        predictedTrust[currentState.currentCharacterId] = Math.min(10, currentTrust + 1)
    }

    // 3. Predict Churn
    // (High churn if trust is low after many steps)
    const avgTrust = Object.values(predictedTrust).reduce((a, b) => a + b, 0) / (Object.keys(predictedTrust).length || 1)
    const churnProbability = avgTrust < 3 ? 0.7 : 0.1

    return {
        predictedPatterns,
        predictedTrust,
        likelyOutcomes: [], // Complex graph traversal omitted for MVP
        churnProbability
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function getDominantPattern(patterns: Record<PatternType, number>): PatternType | null {
    let max = -1
    let dominant: PatternType | null = null

    for (const [p, v] of Object.entries(patterns)) {
        if (v > max) {
            max = v
            dominant = p as PatternType
        }
    }
    return dominant
}

function getAllTrustValues(state: GameState): Record<string, number> {
    const trust: Record<string, number> = {}
    for (const [id, char] of state.characters.entries()) {
        trust[id] = char.trust
    }
    return trust
}
