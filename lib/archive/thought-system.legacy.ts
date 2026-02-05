import { GameState } from './character-state'
import { THOUGHT_REGISTRY, ThoughtDefinition } from '@/content/thoughts'
import { isIdentityThought } from './identity-system'


export interface ThoughtUnlockResult {
    unlockedThoughtIds: string[]
    updates: Partial<GameState>
}

/**
 * Check if the player qualifies for new thoughts based on current stats
 * This excludes IDENTITY thoughts (handled by `identity-system.ts`)
 * 
 * @param gameState Current game state
 * @returns Result object with valid unlock IDs and state updates, or null if nothing new
 */
export function checkThoughtTriggers(gameState: GameState): ThoughtUnlockResult | null {
    const existingThoughtIds = new Set(gameState.thoughts.map(t => t.id))
    const unlockedIds: string[] = []

    // Iterate through all defined thoughts
    Object.values(THOUGHT_REGISTRY).forEach(thought => {
        // 1. Skip if already unlocked
        if (existingThoughtIds.has(thought.id)) return

        // 2. Skip if it's an Identity thought (handled elsewhere)
        if (isIdentityThought(thought.id)) return

        // 3. Check trigger conditions
        if (evaluateThoughtCondition(thought, gameState)) {
            unlockedIds.push(thought.id)
        }
    })

    if (unlockedIds.length === 0) return null

    // Create state updates
    // let newState = { ...gameState }

    // Add new thoughts
    // Note: We use GameStateUtils usually, but for batch additions we can do it manually 
    // or construct the object.
    // Using GameStateUtils.applyStateChange allows singular add. 
    // Let's create the array of new ActiveThoughts manually to be safe.

    const additionalThoughts = unlockedIds.map(id => {
        const def = THOUGHT_REGISTRY[id]
        return {
            ...def,
            status: 'developing' as const, // Default start status
            progress: 0,
            addedAt: Date.now(),
            lastUpdated: Date.now()
        }
    })

    const newThoughtsArray = [...gameState.thoughts, ...additionalThoughts]

    return {
        unlockedThoughtIds: unlockedIds,
        updates: {
            thoughts: newThoughtsArray
        }
    }
}

/**
 * Helper to evaluate a single thought's unlock condition
 */
function evaluateThoughtCondition(thought: ThoughtDefinition, gameState: GameState): boolean {
    if (!thought.unlockCondition) return false // No auto-unlock for thoughts without conditions

    const { pattern } = thought.unlockCondition

    // Pattern Condition
    if (pattern) {
        const currentLevel = gameState.patterns[pattern.type] || 0
        if (currentLevel < pattern.min) return false
    }

    // Add more conditions here later (flags, etc.)

    return true
}
