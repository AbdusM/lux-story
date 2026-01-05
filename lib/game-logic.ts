import { GameState, TimeState, PlatformState, GameStateUtils } from './character-state'
import { EvaluatedChoice } from './dialogue-graph'
import { calculatePatternGain } from './identity-system'
import { isValidPattern, getPatternSensation, PatternType, PATTERN_THRESHOLDS, PATTERN_SKILL_MAP } from './patterns'
import { detectRelationshipUpdates } from './character-relationships'
import { simulateDensityFluctuation, OVERDENSITY_CONSTANTS } from './overdensity-system'

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
        relationshipUpdates?: Array<{ fromId: string; toId: string; newType: string }>
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

        const highPatience = patterns.patience > PATTERN_THRESHOLDS.DEVELOPING
        const helpedMany = patterns.helping > PATTERN_THRESHOLDS.DEVELOPING
        const explored = items.discoveredPaths.length >= 4

        if (quietHour.potential && (highPatience || helpedMany || explored)) {
            // Actually trigger if conditions are very strong
            if (highPatience && helpedMany && patterns.patience > PATTERN_THRESHOLDS.FLOURISHING) {
                return {
                    triggered: true,
                    triggerType: 'compassionate_patience',
                    timeState: { ...time, isStopped: true, flowRate: 0, currentDisplay: "TIME HOLDS ITS BREATH" }
                }
            } else if (explored && patterns.patience > PATTERN_THRESHOLDS.DEVELOPING && helpedMany) {
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
        if (careerValues.directImpact > 6 && patterns.helping > PATTERN_THRESHOLDS.DEVELOPING) {
            return 'service_guide'
        }

        // Systems Builder: High systemsThinking + building patterns
        if (careerValues.systemsThinking > 6 && patterns.building > PATTERN_THRESHOLDS.DEVELOPING) {
            return 'systems_builder'
        }

        // Data Analyst: High dataInsights + analyzing patterns
        if (careerValues.dataInsights > 6 && patterns.analytical > PATTERN_THRESHOLDS.DEVELOPING) {
            return 'data_analyst'
        }

        // Future Pioneer: High futureBuilding + exploring patterns
        if (careerValues.futureBuilding > 6 && patterns.exploring > PATTERN_THRESHOLDS.DEVELOPING) {
            return 'future_pioneer'
        }

        // Independent Creator: High independence value + patterns (using exploring as proxy)
        if (careerValues.independence > 6 && patterns.exploring > PATTERN_THRESHOLDS.DEVELOPING) {
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
     * @param reactionTime Optional time in ms representing how long player lingered
     */
    static processChoice(state: GameState, evaluatedChoice: EvaluatedChoice, reactionTime?: number): ChoiceProcessingResult {
        const choice = evaluatedChoice.choice
        let newState = { ...state } // Clone ensuring we don't mutate input

        // Clean up previous transient timing flags
        newState.globalFlags = new Set(newState.globalFlags)
        newState.globalFlags.delete('temporary_hesitation')
        newState.globalFlags.delete('temporary_silence')
        newState.globalFlags.delete('temporary_decisive')

        // Apply new timing flags if time provided
        if (reactionTime !== undefined) {
            if (reactionTime > 15000) {
                newState.globalFlags.add('temporary_silence')
            } else if (reactionTime > 8000) {
                newState.globalFlags.add('temporary_hesitation')
            } else if (reactionTime < 1500) {
                newState.globalFlags.add('temporary_decisive')
            }
        }


        // Capture old flags for comparison
        const oldFlags = state.globalFlags

        // 1. Apply explicit consequences (JSON-defined)
        if (choice.consequence) {
            newState = GameStateUtils.applyStateChange(newState, choice.consequence)
        }

        // 1.5. Simulate Market Density (Sim-lite)
        // ONLY if in Market sector (optimization) or generically everywhere if desired for background calc
        // For now, running it globally as 'time passes'
        const newDensity = simulateDensityFluctuation(newState.overdensity)
        newState.overdensity = newDensity

        // Trigger Crowd Surge Logic
        if (newDensity >= OVERDENSITY_CONSTANTS.HIGH_DENSITY_THRESHOLD) {
            newState.globalFlags.add('high_density')
        } else if (newDensity <= OVERDENSITY_CONSTANTS.CLEAR_THRESHOLD) {
            newState.globalFlags.delete('high_density')
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

        // AUTO-DERIVE SKILLS from Pattern (Sprint AI)
        const derivedSkills = (choice.pattern && isValidPattern(choice.pattern))
            ? (PATTERN_SKILL_MAP[choice.pattern] || [])
            : []

        const explicitSkills = choice.skills || []
        const combinedSkills = Array.from(new Set([...derivedSkills, ...explicitSkills]))

        if (combinedSkills.length > 0) {
            events.updateSkills = combinedSkills
        }

        // 5. Detect Relationship Updates
        // Dynamic import to avoid circular dependency if possible, but for now assuming direct import is fine 
        // given how clean the architecture is. 
        // We need to import checkRelationshipEvolution from character-relationships, 
        // but wait, we need the new detection function.
        // Importing at top level is better.

        // Note: We need to import detectRelationshipUpdates at the top of the file
        // For now, I will assume it's imported.

        // Actually, to make this work with the tool, I need to add the import first or do it all in one go.
        // I will rely on a separate replace_file_content for the import if needed, 
        // or just use valid TS in this block if I can access the function.

        // Let's assume detectRelationshipUpdates is imported.
        // Wait, I haven't added the import yet. I should do that.

        // Since I can't do multiple disjoint edits easily without multi_replace, 
        // and I am in a replace_file_content call, I will add the logic here 
        // and then fix the import.

        // But I need access to detectRelationshipUpdates.
        // I will add the import in a subsequent step or use fully qualified if it were a module... 
        // It's a named export.

        // I'll proceed with adding the logic receiving the error about missing import, 
        // then fix the import.

        // Calculate new flags


        // This line will fail compilation until I add the import.
        // events.relationshipUpdates = detectRelationshipUpdates(oldFlags, newFlags)
        const relationshipUpdates = detectRelationshipUpdates(oldFlags, newState.globalFlags)
        if (relationshipUpdates.length > 0) {
            events.relationshipUpdates = relationshipUpdates
        }

        return {
            newState,
            trustDelta,
            patternSensation,
            events
        }
    }
}

