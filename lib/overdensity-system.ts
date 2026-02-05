import { random } from './seeded-random'

export const OVERDENSITY_CONSTANTS = {
    MIN_DENSITY: 0.0,
    MAX_DENSITY: 1.0,
    CRITICAL_THRESHOLD: 0.8, // "Riot" potential
    HIGH_DENSITY_THRESHOLD: 0.8, // Triggers "high_density" flag
    CLEAR_THRESHOLD: 0.6, // Clears "high_density" flag
    DEFAULT_MARKET_MULTIPLIER: 1.0,
    HIGH_DENSITY_MULTIPLIER: 1.5,
    FLUCTUATION_RATE: 0.1 // Max change per tick
}

export interface OverdensityState {
    currentDensity: number // 0.0 - 1.0
    trend: 'rising' | 'falling' | 'stable'
    lastUpdate: number
}

/**
 * Calculates the current price multiplier based on density
 */
export function calculateInflation(density: number): number {
    if (density < 0.5) return 1.0
    // Linear scaling from 1.0 to 1.5 between 0.5 and 1.0 density
    return 1.0 + (density - 0.5)
}

/**
 * Determines if a "Crowd Event" should trigger
 */
export function rollForCrowdEvent(density: number): 'none' | 'bump' | 'pickpocket' | 'overhear' {
    // TD-007: Use seeded random for testability
    const roll = random()

    if (density < 0.3) return 'none'

    // High density = higher chance of negative interaction
    if (density > 0.8 && roll < 0.2) return 'pickpocket'
    if (density > 0.6 && roll < 0.4) return 'bump'
    if (density > 0.4 && roll < 0.3) return 'overhear'

    return 'none'
}

/**
 * Simulates density fluctuation for a game turn
 * Returns the new density value (0.0 - 1.0)
 */
export function simulateDensityFluctuation(currentDensity: number): number {
    // Random walk: -0.05 to +0.08 (slight bias towards rising until it hits cap)
    // This simulates a market getting busier over time
    // TD-007: Use seeded random for testability
    const change = (random() * 0.13) - 0.05

    let newDensity = currentDensity + change

    // Clamp
    newDensity = Math.max(OVERDENSITY_CONSTANTS.MIN_DENSITY, Math.min(OVERDENSITY_CONSTANTS.MAX_DENSITY, newDensity))

    return Number(newDensity.toFixed(2))
}
