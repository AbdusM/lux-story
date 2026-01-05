import { PatternType } from './patterns'
import { GameState } from './character-state'
import { CharacterId } from './graph-registry'

// ============================================================================
// TYPES
// ============================================================================

export type ExperienceId = 'maya_demo' | 'devon_outage' | 'samuel_quiet_hour'

export interface ExperienceStep {
    id: string
    text: string
    type: 'choice' | 'timed_challenge' | 'pattern_check'
    duration?: number // ms for timed challenge
    choices?: ExperienceChoice[]
    patternCheck?: {
        pattern: PatternType
        threshold: number
        successStepId: string
        failureStepId: string
    }
}

export interface ExperienceChoice {
    id: string
    text: string
    requiredPattern?: PatternType
    patternLevel?: number
    nextStepId: string // 'success', 'failure', or step ID
    effect?: (gameState: GameState) => Partial<GameState>
}

export interface LoyaltyExperience {
    id: ExperienceId
    characterId: CharacterId
    title: string
    description: string
    startStepId: string
    steps: Record<string, ExperienceStep>
    onComplete: (result: 'success' | 'failure' | 'mixed', gameState: GameState) => Partial<GameState>
}

export interface ActiveExperienceState {
    experienceId: ExperienceId
    currentStepId: string
    startTime: number
    history: string[] // Trace of steps/choices taken
}

// ============================================================================
// REGISTRY
// ============================================================================

export const EXPERIENCE_REGISTRY: Partial<Record<ExperienceId, LoyaltyExperience>> = {}

export function registerExperience(experience: LoyaltyExperience) {
    EXPERIENCE_REGISTRY[experience.id] = experience
}

// ============================================================================
// LOGIC
// ============================================================================

export class ExperienceEngine {
    static startExperience(id: ExperienceId): ActiveExperienceState | null {
        // Ensure content is loaded
        // In a real app we might lazy load this, but for now we rely on side-effects
        const exp = EXPERIENCE_REGISTRY[id]
        if (!exp) return null

        return {
            experienceId: id,
            currentStepId: exp.startStepId,
            startTime: Date.now(),
            history: []
        }
    }

    static getStep(state: ActiveExperienceState): ExperienceStep | null {
        const exp = EXPERIENCE_REGISTRY[state.experienceId]
        if (!exp) return null
        return exp.steps[state.currentStepId] || null
    }

    static processChoice(
        state: ActiveExperienceState,
        choiceId: string,
        gameState: GameState
    ): { newState: ActiveExperienceState, updates: Partial<GameState>, isComplete: boolean, result?: 'success' | 'failure' | 'mixed' } {
        const exp = EXPERIENCE_REGISTRY[state.experienceId]
        if (!exp) throw new Error("Experience not found: " + state.experienceId)

        const step = exp.steps[state.currentStepId]
        const choice = step.choices?.find(c => c.id === choiceId)

        if (!choice) throw new Error("Invalid choice: " + choiceId)

        // Apply immediate effects
        const immediateUpdates = choice.effect ? choice.effect(gameState) : {}

        // Determine next state
        const nextStepId = choice.nextStepId

        // Check for completion
        if (['success', 'failure', 'mixed'].includes(nextStepId)) {
            const finalUpdates = exp.onComplete(nextStepId as 'success' | 'failure' | 'mixed', { ...gameState, ...immediateUpdates })
            return {
                newState: { ...state, currentStepId: nextStepId, history: [...state.history, choiceId] },
                updates: { ...immediateUpdates, ...finalUpdates },
                isComplete: true,
                result: nextStepId as 'success' | 'failure' | 'mixed'
            }
        }

        return {
            newState: { ...state, currentStepId: nextStepId, history: [...state.history, choiceId] },
            updates: immediateUpdates,
            isComplete: false
        }
    }
}

// Side-effect imports removed to prevent circular dependency
// Import content in 'lib/init-experiences.ts' instead
