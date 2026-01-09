/**
 * Loyalty Experience Adapter
 *
 * Converts the NEW loyalty-experience.ts format (20 characters)
 * to the OLD experience-engine.ts format for UI compatibility.
 *
 * This adapter bridges:
 * - NEW: phases-based with introduction/successEnding/failureEnding
 * - OLD: steps-based with startStepId/onComplete
 */

import {
  LoyaltyExperience as NewLoyaltyExperience,
  LoyaltyExperienceType,
  LOYALTY_EXPERIENCES
} from './loyalty-experience'
import {
  LoyaltyExperience as OldLoyaltyExperience,
  ExperienceStep,
  ExperienceChoice,
  ExperienceId,
  registerExperience
} from './experience-engine'
import { GameState } from './character-state'

/**
 * Create a mapping from new experience IDs to old format IDs
 */
function getOldExperienceId(newId: LoyaltyExperienceType): ExperienceId {
  // Map new IDs to old format (underscore separated)
  const mapping: Partial<Record<LoyaltyExperienceType, ExperienceId>> = {
    'the_demo': 'maya_demo',
    'the_outage': 'devon_outage',
    'the_quiet_hour': 'samuel_quiet_hour'
  }

  // For unmapped experiences, create a new ID
  // The ExperienceId type will need to be expanded
  return mapping[newId] || (newId.replace('the_', '') + '_exp') as ExperienceId
}

/**
 * Convert a NEW loyalty experience to OLD format
 */
export function adaptLoyaltyExperience(newExp: NewLoyaltyExperience): OldLoyaltyExperience {
  const steps: Record<string, ExperienceStep> = {}

  // Create introduction step
  steps['intro'] = {
    id: 'intro',
    text: newExp.introduction,
    type: 'choice',
    choices: [{
      id: 'begin',
      text: 'Begin the experience',
      nextStepId: newExp.phases[0]?.phaseId || 'success'
    }]
  }

  // Convert each phase to a step
  newExp.phases.forEach((phase, _index) => {
    const choices: ExperienceChoice[] = phase.choices.map(choice => {
      // Determine next step
      let nextStepId: string
      if (!choice.nextPhaseId) {
        // Terminal choice - determine success/failure
        nextStepId = choice.outcome.isSuccess ? 'success' : 'failure'
      } else {
        nextStepId = choice.nextPhaseId
      }

      return {
        id: choice.choiceId,
        text: choice.text,
        requiredPattern: choice.pattern,
        patternLevel: choice.pattern ? 3 : undefined, // Default pattern requirement
        nextStepId,
        effect: choice.outcome.patternChanges || choice.outcome.trustChange
          ? (gameState: GameState) => {
            const updates: Partial<GameState> = {}

            // Apply pattern changes
            if (choice.outcome.patternChanges) {
              const newPatterns = { ...gameState.patterns }
              for (const [patternKey, change] of Object.entries(choice.outcome.patternChanges)) {
                const pattern = patternKey as keyof typeof newPatterns
                if (pattern in newPatterns) {
                  newPatterns[pattern] = (newPatterns[pattern] || 0) + (change as number)
                }
              }
              updates.patterns = newPatterns
            }

            // Trust changes are handled at completion level

            return updates
          }
          : undefined
      }
    })

    steps[phase.phaseId] = {
      id: phase.phaseId,
      text: phase.timeContext
        ? `${phase.situation}\n\n[${phase.timeContext}]`
        : phase.situation,
      type: phase.timeContext ? 'timed_challenge' : 'choice',
      duration: phase.timeContext ? 30000 : undefined, // 30 second default for timed
      choices
    }
  })

  // Create terminal steps
  steps['success'] = {
    id: 'success',
    text: newExp.successEnding.text,
    type: 'choice',
    choices: []
  }

  steps['failure'] = {
    id: 'failure',
    text: newExp.failureEnding.text,
    type: 'choice',
    choices: []
  }

  steps['mixed'] = {
    id: 'mixed',
    text: 'The outcome was mixed, but you learned from the experience.',
    type: 'choice',
    choices: []
  }

  return {
    id: getOldExperienceId(newExp.id),
    characterId: newExp.characterId,
    title: newExp.title,
    description: newExp.description,
    startStepId: 'intro',
    steps,
    onComplete: (result, gameState) => {
      const updates: Partial<GameState> = {
        globalFlags: new Set(gameState.globalFlags)
      }

      if (result === 'success') {
        // Add success flag
        (updates.globalFlags as Set<string>).add(newExp.successEnding.unlockedFlag)

        // Apply trust bonus (would need to be handled by calling code)
        // Trust changes are character-specific and need more context
      }

      return updates
    }
  }
}

/**
 * Register all 20 loyalty experiences from the new system
 */
export function registerAllLoyaltyExperiences(): void {
  for (const [_id, experience] of Object.entries(LOYALTY_EXPERIENCES)) {
    const adapted = adaptLoyaltyExperience(experience)
    registerExperience(adapted)
  }
}

/**
 * Extended ExperienceId type that includes all 20 experiences
 * Note: This should be merged into experience-engine.ts eventually
 */
export type ExtendedExperienceId =
  | ExperienceId
  // Extended 9
  | 'vigil_exp' | 'honest_course_exp' | 'inspection_exp'
  | 'launch_exp' | 'pattern_exp' | 'feral_lab_exp'
  | 'mural_exp' | 'memory_song_exp' | 'audit_exp'
  // Original 7 (already in ExperienceId or mapped)
  | 'breach_exp' | 'confrontation_exp' | 'first_class_exp' | 'crossroads_exp'
  // LinkedIn 2026
  | 'portfolio_exp' | 'real_pitch_exp' | 'whiteboard_exp' | 'site_visit_exp'

// Auto-initialize when imported
registerAllLoyaltyExperiences()
