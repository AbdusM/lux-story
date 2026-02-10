import { PatternType } from './patterns'
import { GameState } from './character-state'
import { CharacterId } from './graph-registry'

// ============================================================================
// TYPES
// ============================================================================

export type ExperienceId =
  // Original 3 (legacy format)
  | 'maya_demo' | 'devon_outage' | 'samuel_quiet_hour'
  // Original 7 (adapted from loyalty-experience.ts)
  | 'demo_exp' | 'outage_exp' | 'quiet_hour_exp'
  | 'breach_exp' | 'confrontation_exp' | 'first_class_exp' | 'crossroads_exp'
  // Extended 9
  | 'vigil_exp' | 'honest_course_exp' | 'inspection_exp'
  | 'launch_exp' | 'pattern_exp' | 'feral_lab_exp'
  | 'mural_exp' | 'memory_song_exp' | 'audit_exp'
  // LinkedIn 2026 Career Expansion
  | 'portfolio_exp' | 'real_pitch_exp' | 'whiteboard_exp' | 'site_visit_exp'

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

function resolveExperienceId(id: unknown): ExperienceId | null {
    if (typeof id !== 'string' || id.length === 0) return null

    // If it already exists, accept as-is.
    if (EXPERIENCE_REGISTRY[id as ExperienceId]) return id as ExperienceId

    // Support newer IDs used by dialogue nodes (e.g. metadata.experienceId = 'the_honest_course').
    // This matches lib/loyalty-adapter.ts's mapping so runtime doesn't depend on callers knowing engine IDs.
    const mapping: Record<string, ExperienceId> = {
        the_demo: 'maya_demo',
        the_outage: 'devon_outage',
        the_quiet_hour: 'samuel_quiet_hour',
    }

    const mapped = mapping[id]
    if (mapped && EXPERIENCE_REGISTRY[mapped]) return mapped

    if (id.startsWith('the_')) {
        const guess = (id.replace(/^the_/, '') + '_exp') as ExperienceId
        if (EXPERIENCE_REGISTRY[guess]) return guess
    }

    return null
}

// ============================================================================
// LOGIC
// ============================================================================

export class ExperienceEngine {
    static startExperience(id: ExperienceId | string): ActiveExperienceState | null {
        // Ensure content is loaded
        // In a real app we might lazy load this, but for now we rely on side-effects
        const resolved = resolveExperienceId(id)
        if (!resolved) return null

        const exp = EXPERIENCE_REGISTRY[resolved]
        if (!exp) return null

        return {
            experienceId: resolved,
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
