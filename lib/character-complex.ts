/**
 * Complex Character Systems
 * Feature IDs: D-018, D-063, D-095
 * 
 * Advanced character mechanics for memetic infection, archetype evolution,
 * and secret loyalties.
 */

import { GameState } from './character-state'
import { random } from './seeded-random'

// ═══════════════════════════════════════════════════════════════════════════
// D-018: MEMETIC INFECTION ("Idea Virus")
// ═══════════════════════════════════════════════════════════════════════════

export interface Meme {
    id: string
    name: string            // e.g., "The Station is Alive"
    originCharacterId: string
    potency: number         // 0-1, transmission chance
    infectedCharacters: Set<string>
    mutatedVariants: string[]
}

export const ACTIVE_MEMES = new Map<string, Meme>([
    ['station_alive_theory', {
        id: 'station_alive_theory',
        name: 'The Station is Alive',
        originCharacterId: 'rohan',
        potency: 0.3,
        infectedCharacters: new Set(['rohan']),
        mutatedVariants: ['station_dreams', 'station_chooses']
    }],
    ['time_is_circular', {
        id: 'time_is_circular',
        name: 'Time is a Loop',
        originCharacterId: 'samuel',
        potency: 0.2,
        infectedCharacters: new Set(['samuel', 'elena']),
        mutatedVariants: ['past_is_future', 'we_return']
    }],
    ['architects_watching', {
        id: 'architects_watching',
        name: 'The Architects are Watching',
        originCharacterId: 'zara',
        potency: 0.4,
        infectedCharacters: new Set(['zara', 'kai']),
        mutatedVariants: ['architect_test', 'architect_punishment']
    }]
])

export function infectCharacter(memeId: string, targetCharId: string): boolean {
    const meme = ACTIVE_MEMES.get(memeId)
    if (!meme) return false

    // Infection check - TD-007: Use seeded random for determinism
    if (random() < meme.potency) {
        meme.infectedCharacters.add(targetCharId)
        return true
    }
    return false
}

// ═══════════════════════════════════════════════════════════════════════════
// D-063: ARCHETYPE EVOLUTION
// ═══════════════════════════════════════════════════════════════════════════

export type Archetype = 'mentor' | 'rival' | 'ally' | 'shadow' | 'catalyst'

export interface ArchetypeEvolution {
    characterId: string
    currentArchetype: Archetype
    evolutionProgress: number // 0-100 towards next stage
    potentialNextStage: Archetype
}

const CHARACTER_ARCHETYPES = new Map<string, ArchetypeEvolution>([
    ['maya', {
        characterId: 'maya',
        currentArchetype: 'catalyst',
        evolutionProgress: 10,
        potentialNextStage: 'mentor'
    }],
    ['samuel', {
        characterId: 'samuel',
        currentArchetype: 'mentor',
        evolutionProgress: 50,
        potentialNextStage: 'shadow'
    }],
    ['devon', {
        characterId: 'devon',
        currentArchetype: 'ally',
        evolutionProgress: 20,
        potentialNextStage: 'rival'
    }],
    ['rohan', {
        characterId: 'rohan',
        currentArchetype: 'shadow',
        evolutionProgress: 5,
        potentialNextStage: 'catalyst'
    }]
])

export function evolveArchetype(
    charId: string,
    impactDelta: number
): void {
    const evo = CHARACTER_ARCHETYPES.get(charId)
    if (!evo) return

    evo.evolutionProgress += impactDelta

    if (evo.evolutionProgress >= 100) {
        // Evolve!
        evo.currentArchetype = evo.potentialNextStage
        evo.evolutionProgress = 0
        // Reset potential next stage (logic omitted for brevity)
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// D-095: SECRET LOYALTY
// ═══════════════════════════════════════════════════════════════════════════

export type Faction = 'preservation' | 'acceleration' | 'entropy'

export interface SecretLoyalty {
    characterId: string
    trueAllegiance: Faction
    publicAllegiance: Faction // The "mask"
    suspicionLevel: number    // 0-10, how close player is to finding out for the specific character
}

const LOYALTIES = new Map<string, SecretLoyalty>([
    ['samuel', {
        characterId: 'samuel',
        trueAllegiance: 'preservation',
        publicAllegiance: 'preservation',
        suspicionLevel: 0
    }],
    ['rohan', {
        characterId: 'rohan',
        trueAllegiance: 'entropy',
        publicAllegiance: 'preservation',
        suspicionLevel: 0
    }],
    ['elena', {
        characterId: 'elena',
        trueAllegiance: 'acceleration',
        publicAllegiance: 'preservation',
        suspicionLevel: 0
    }]
])

export function checkLoyaltyReveal(charId: string): SecretLoyalty | null {
    const loyalty = LOYALTIES.get(charId)
    if (!loyalty) return null

    if (loyalty.suspicionLevel >= 10) {
        return loyalty // Maximum suspicion reveals truth
    }
    return null
}

export function increaseSuspicion(charId: string, amount: number): void {
    const loyalty = LOYALTIES.get(charId)
    if (loyalty) {
        loyalty.suspicionLevel = Math.min(10, loyalty.suspicionLevel + amount)
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// INTEGRATION: MASTER TICK FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Process all complex character mechanics for a single turn
 * Called from StatefulGameInterface when a significant action occurs
 */
export function processComplexCharacterTick(
    gameState: GameState,
    activeCharacterId: string,
    actionImpact: number = 1 // Default impact of a conversation turn
): void {
    // 1. Attempt Meme Transmission (D-018)
    // If the active character has a meme, try to infect the player (or vice versa concept)
    // For now, simpler: random background transmission check
    ACTIVE_MEMES.forEach(meme => {
        if (meme.infectedCharacters.has(activeCharacterId)) {
            // Chance to mutate or spread to others (simulated)
        }
    })

    // 2. Evolution Progress (D-063)
    evolveArchetype(activeCharacterId, actionImpact)

    // 3. Loyalty Suspicion (D-095)
    // If player makes a suspicious choice (needs logic, simplified for now)
    // increaseSuspicion(activeCharacterId, 0.1) 
}
