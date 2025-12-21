/**
 * ISP Phase 3: The Living Station (Narrative Gravity)
 * 
 * "The Station pulls you towards your nature."
 * Calculates the 'Gravitational Weight' of a choice based on the character's biological state.
 */

import { NervousSystemState } from './emotions'
import { PatternType } from './patterns'
import { GameState } from './character-state'

export const GRAVITY_CONSTANTS = {
    BASE_WEIGHT: 1.0,
    ATTRACTION_MULTIPLIER: 1.5, // High gravity (pulled to top)
    REPULSION_MULTIPLIER: 0.6,  // Low gravity (sinks to bottom)
    NEUTRAL_MULTIPLIER: 1.0
} as const

/**
 * The Physics of Emotion: Mapping State -> Pattern Affinity
 */
const GRAVITY_MATRIX: Record<NervousSystemState, { attract: PatternType[], repel: PatternType[] }> = {
    'ventral_vagal': {
        // Safe/Social State attracts connection and curiosity
        attract: ['helping', 'exploring'],
        repel: [] // Flow state works with everything
    },
    'sympathetic': {
        // Mobilized/Anxious attracts Action (Fix it / Do something)
        // Repels Stillness (Patience) and vulnerability (Helping) is harder
        attract: ['analytical', 'building'],
        repel: ['patience', 'helping']
    },
    'dorsal_vagal': {
        // Shutdown/Collapse attracts withdrawal/stillness
        // Repels high-energy Action
        attract: ['patience'],
        repel: ['building', 'exploring', 'analytical']
    }
}

export interface GravityResult {
    weight: number // Multiplier for sorting order
    effect: 'attract' | 'repel' | 'neutral'
    description: string
}

/**
 * Calculates the gravitational pull of a choice based on the current bio-state.
 */
export function calculateGravity(
    pattern: PatternType | undefined,
    gameState: GameState,
    characterId: string
): GravityResult {
    // 1. Default Physics (Null pattern or invalid character)
    if (!pattern) return { weight: GRAVITY_CONSTANTS.BASE_WEIGHT, effect: 'neutral', description: 'Inert' }

    const character = gameState.characters.get(characterId)
    if (!character) return { weight: GRAVITY_CONSTANTS.BASE_WEIGHT, effect: 'neutral', description: 'Unknown Agent' }

    // 2. Identify State
    const state = character.nervousSystemState
    const physics = GRAVITY_MATRIX[state]

    // 3. Calculate Forces
    if (physics.attract.includes(pattern)) {
        return {
            weight: GRAVITY_CONSTANTS.ATTRACTION_MULTIPLIER,
            effect: 'attract',
            description: `${state} state pulls towards ${pattern}`
        }
    }

    if (physics.repel.includes(pattern)) {
        return {
            weight: GRAVITY_CONSTANTS.REPULSION_MULTIPLIER,
            effect: 'repel',
            description: `${state} state repels ${pattern}`
        }
    }

    return {
        weight: GRAVITY_CONSTANTS.NEUTRAL_MULTIPLIER,
        effect: 'neutral',
        description: 'Stable orbit'
    }
}
