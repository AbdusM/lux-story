import { GameState, TimeState, PlatformState, GameStateUtils } from './character-state'
import { EvaluatedChoice } from './dialogue-graph'
import { calculatePatternGain } from './identity-system'
import { isValidPattern, getPatternSensation, PatternType } from './patterns'

/**
 * Result of processing a choice
 * Separate state mutations from side effects (events)
 */
export interface ChoiceProcessingResult {
    newState: GameState
    trustDelta: number
    patternSensation: string | null
    events: {
        playSound?: { type: 'pattern' | 'identity' | 'trust' | 'milestone', id?: string }
        earnOrb?: PatternType
        checkIdentityThreshold?: boolean
        updateSkills?: string[] // List of skills demonstrated
    }
}

/**
 * GameLogic - The Unified Calculator
 * 
 * This class contains all the pure logic for game rules, state transitions,
 * and mathematical calculations. It is DECOUPLED from the UI and Persistence.
 * 
 * Input: Current GameState + Action/Context
 * Output: Partial<GameState> (Changes to apply)
 */
export class GameLogic {

    /**
     * Calculate Platform Resonance based on Career Values and Patterns
     * Migrated from GrandCentralStateManager.updatePlatformResonance
     */
    static calculatePlatformResonance(state: GameState): Record<string, PlatformState> {
        const { careerValues, patterns, platforms } = state
        const newPlatforms = { ...platforms }

        // Helper to clamp resonance 0-10
        const clamp = (n: number) => Math.min(10, Math.max(0, n))

        // Platform 1 (Service & Impact) - directImpact + helping patterns
        if (newPlatforms.p1) {
            newPlatforms.p1 = {
                ...newPlatforms.p1, resonance: clamp(
                    (careerValues.directImpact * 1.5 + patterns.helping * 2 + patterns.patience) / 4.5
                )
            }
        }

        // Platform 3 (Systems & Operations) - systemsThinking + building patterns  
        if (newPlatforms.p3) {
            newPlatforms.p3 = {
                ...newPlatforms.p3, resonance: clamp(
                    (careerValues.systemsThinking * 1.5 + patterns.building * 2 + patterns.analytical) / 4.5
                )
            }
        }

        // Platform 7 (Information & Analysis) - dataInsights + analyzing patterns
        if (newPlatforms.p7) {
            newPlatforms.p7 = {
                ...newPlatforms.p7, resonance: clamp(
                    (careerValues.dataInsights * 1.5 + patterns.analytical * 2 + patterns.exploring) / 4.5
                )
            }
        }

        // Platform 9 (Emerging & Growth) - futureBuilding + patience patterns
        if (newPlatforms.p9) {
            newPlatforms.p9 = {
                ...newPlatforms.p9, resonance: clamp(
                    (careerValues.futureBuilding * 1.5 + patterns.patience * 2 + patterns.helping) / 4.5
                )
            }
        }

        // Forgotten Platform (Hybrid & Innovation) - independence value + independence patterns (using exploring as proxy if independence missing)
        // Note: 'independence' pattern might need to be added to PlayerPatterns if it was in GrandCentral but not here
        // For now using 'exploring' as closest proxy for independence if missing
        if (newPlatforms.forgotten) {
            newPlatforms.forgotten = {
                ...newPlatforms.forgotten, resonance: clamp(
                    (careerValues.independence * 1.5 + patterns.exploring * 2 + patterns.exploring) / 4.5
                )
            }
        }

        return newPlatforms
    }

    /**
     * updatePlatformAccessibility
     * Updates accessible and discovered flags based on Warmth
     */
    static updatePlatformAccessibility(platforms: Record<string, PlatformState>): Record<string, PlatformState> {
        const updated = { ...platforms }
        Object.keys(updated).forEach(key => {
            const plat = updated[key]
            if (plat.warmth < -3) {
                updated[key] = { ...plat, accessible: false }
            } else if (plat.warmth > 3) {
                updated[key] = { ...plat, accessible: true, discovered: true }
            }
        })
        return updated
    }

    /**
     * checkQuietHourTrigger
     * Determines if a Quiet Hour should be triggered
     */
    static checkQuietHourTrigger(state: GameState): { triggered: boolean, triggerType?: string, timeState?: TimeState } {
        const { patterns, items, quietHour, time } = state

        // Quiet Hour triggers if:
        // - High patience (>8) and low rushing (assuming 0 if not tracked) - increased threshold
        // - Helped 5+ people (helping > 6)
        // - Discovered 4+ platforms
        // - Sitting in contemplation with potential = true

        /* 
           Note: 'rushing' was in GrandCentral but not in GameState patterns. 
           We will assume rushing is low if patience is high.
        */

        const highPatience = patterns.patience > 8
        const helpedMany = patterns.helping > 6
        const explored = items.discoveredPaths.length >= 4

        if (quietHour.potential && (highPatience || helpedMany || explored)) {
            // Actually trigger if conditions are very strong
            if (highPatience && helpedMany && patterns.patience > 10) {
                return {
                    triggered: true,
                    triggerType: 'compassionate_patience',
                    timeState: { ...time, isStopped: true, flowRate: 0, currentDisplay: "TIME HOLDS ITS BREATH" }
                }
            } else if (explored && patterns.patience > 8 && helpedMany) {
                return {
                    triggered: true,
                    triggerType: 'patient_exploration',
                    timeState: { ...time, isStopped: true, flowRate: 0, currentDisplay: "TIME HOLDS ITS BREATH" }
                }
            }
        }

        return { triggered: false }
    }

    /**
     * calculateEndingPath
     * Determines the narrative conclusion based on aggregate stats
     */
    static calculateEndingPath(state: GameState): string {
        const { patterns, careerValues } = state

        // Service Guide: High directImpact + helping patterns
        if (careerValues.directImpact > 6 && patterns.helping > 8) {
            return 'service_guide'
        }

        // Systems Builder: High systemsThinking + building patterns
        if (careerValues.systemsThinking > 6 && patterns.building > 8) {
            return 'systems_builder'
        }

        // Data Analyst: High dataInsights + analyzing patterns
        if (careerValues.dataInsights > 6 && patterns.analytical > 8) {
            return 'data_analyst'
        }

        // Future Pioneer: High futureBuilding + exploring patterns
        if (careerValues.futureBuilding > 6 && patterns.exploring > 7) {
            return 'future_pioneer'
        }

        // Independent Creator: High independence value + patterns (using exploring as proxy)
        if (careerValues.independence > 6 && patterns.exploring > 7) {
            return 'independent_creator'
        }

        // Balanced Explorer: Moderate scores across multiple areas
        const values = Object.values(careerValues)
        const avgValues = values.reduce((a, b) => a + b, 0) / 5
        if (avgValues > 3 && Math.max(...values) - Math.min(...values) < 4) {
            return 'balanced_explorer'
        }

        return 'undetermined'
    }
    /**
     * processChoice
     * The Master Logic Function. Determines all consequences of a player's action.
     */
    static processChoice(state: GameState, evaluatedChoice: EvaluatedChoice): ChoiceProcessingResult {
        const choice = evaluatedChoice.choice
        let newState = state

        // 1. Apply explicit consequences (JSON-defined)
        if (choice.consequence) {
            newState = GameStateUtils.applyStateChange(newState, choice.consequence)
        }

        // 2. Apply Pattern Changes (Weighted Identity Math)
        let patternSensation: string | null = null
        if (choice.pattern) {
            const baseGain = 1
            const modifiedGain = calculatePatternGain(baseGain, choice.pattern, newState)
            newState = GameStateUtils.applyStateChange(newState, {
                patternChanges: { [choice.pattern]: modifiedGain }
            })

            // 30% chance of sensation
            if (isValidPattern(choice.pattern) && Math.random() < 0.3) {
                patternSensation = getPatternSensation(choice.pattern)
            }
        }

        // 3. Calculate Trust Delta (Post-consequence)
        const currentCharacterId = state.currentCharacterId // Assuming this is set correctly in state
        const trustBefore = state.characters.get(currentCharacterId)?.trust ?? 0
        const trustAfter = newState.characters.get(currentCharacterId)?.trust ?? 0
        const trustDelta = trustAfter - trustBefore

        // 4. Determine Side Effects/Events
        const events: ChoiceProcessingResult['events'] = {}

        if (choice.pattern && isValidPattern(choice.pattern)) {
            events.earnOrb = choice.pattern
            events.playSound = { type: 'pattern', id: choice.pattern }
            events.checkIdentityThreshold = true
        }

        if (choice.skills && choice.skills.length > 0) {
            events.updateSkills = choice.skills
        }

        return {
            newState,
            trustDelta,
            patternSensation,
            events
        }
    }
}
