import { GameState } from './character-state'
import { ABILITIES, Ability, AbilityId } from './abilities'
import { getOrbTier, ORB_TIERS } from './orbs'
import { logger } from './logger'

/**
 * Result of an unlock check
 * Returns any newly unlocked abilities to show notifications for
 */
export interface UnlockResult {
    unlockedIds: AbilityId[]
    updates: Partial<GameState>
}

export class UnlockManager {
    /**
     * Check if any new abilities should be unlocked based on current state
     * @param gameState Current game state
     * @returns UnlockResult with new abilities and state updates, or null if nothing changed
     */
    static checkUnlockStatus(gameState: GameState): UnlockResult | null {
        const totalOrbs = gameState.patterns.analytical +
            gameState.patterns.patience +
            gameState.patterns.exploring +
            gameState.patterns.helping +
            gameState.patterns.building

        // Determine current tier based on total Orbs
        // Note: getOrbTier returns 'nascent' | 'emerging' | ...
        // We need to check if we meet requirements for each ability
        const unlockedIds: AbilityId[] = []
        const currentUnlockedSet = new Set(gameState.unlockedAbilities || [])

        Object.values(ABILITIES).forEach((ability: Ability) => {
            // If already unlocked, skip
            if (currentUnlockedSet.has(ability.id)) return

            const tierMeta = ORB_TIERS[ability.tier]

            // P4 Logic: Pattern-specific check
            if (ability.pattern) {
                // Check specific pattern score
                const patternScore = gameState.patterns[ability.pattern] || 0
                if (patternScore >= tierMeta.minOrbs) {
                    unlockedIds.push(ability.id)
                }
            } else {
                // Fallback: Legacy global check (or general abilities)
                if (totalOrbs >= tierMeta.minOrbs) {
                    unlockedIds.push(ability.id)
                }
            }
        })

        if (unlockedIds.length === 0) {
            return null
        }

        logger.debug('New abilities unlocked', {
            operation: 'unlock-manager.check',
            abilities: unlockedIds
        })

        return {
            unlockedIds,
            updates: {
                unlockedAbilities: [...currentUnlockedSet, ...unlockedIds]
            }
        }
    }

    /**
     * Check if a specific ability is unlocked
     */
    static isAbilityUnlocked(gameState: GameState, abilityId: AbilityId): boolean {
        return gameState.unlockedAbilities?.includes(abilityId) || false
    }
}
