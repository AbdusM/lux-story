/**
 * Assessment Registry & State Management
 *
 * Registry of all assessment arcs and state management functions.
 *
 * @module lib/ranking/assessment-registry
 */

import type {
  AssessmentArc,
  AssessmentPhaseConfig,
  AssessmentState,
  AssessmentResult,
  CurrentAssessmentProgress,
  PhaseResult,
  AssessmentPhase
} from './assessment-arc'
import { ASSESSMENT_PHASES, createDefaultAssessmentState } from './assessment-arc'
import {
  FIRST_CROSSING_WRITTEN,
  FIRST_CROSSING_PRACTICAL,
  FIRST_CROSSING_FINALS,
  CROSSROADS_TRIAL_WRITTEN,
  CROSSROADS_TRIAL_PRACTICAL,
  CROSSROADS_TRIAL_FINALS,
  MASTERS_CHALLENGE_WRITTEN,
  MASTERS_CHALLENGE_PRACTICAL,
  MASTERS_CHALLENGE_FINALS
} from './assessment-questions'

// ═══════════════════════════════════════════════════════════════════════════
// ASSESSMENT REGISTRY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * All assessment arcs
 */
export const ASSESSMENT_ARCS: AssessmentArc[] = [
  {
    id: 'first_crossing',
    name: 'The First Crossing',
    description: 'Your first formal evaluation at the station',
    unlockCondition: {
      minPatternMasteryLevel: 1,  // Passenger rank
      minCharactersMet: 3
    },
    phases: [
      {
        phase: 'written',
        name: 'Station Orientation',
        description: 'Test your understanding of the station and its people',
        duration: 5,
        evaluationType: 'knowledge',
        questions: FIRST_CROSSING_WRITTEN,
        passingScore: 60
      },
      {
        phase: 'practical',
        name: 'The Conversation',
        description: 'Navigate a complex dialogue scenario',
        duration: 7,
        evaluationType: 'decision',
        questions: FIRST_CROSSING_PRACTICAL,
        passingScore: 50
      },
      {
        phase: 'finals',
        name: 'The Reflection',
        description: 'Demonstrate what you\'ve learned about yourself',
        duration: 5,
        evaluationType: 'synthesis',
        questions: FIRST_CROSSING_FINALS,
        passingScore: 40
      }
    ],
    completionReward: {
      patternBonus: 2,
      expertiseBonus: 5,
      specialFlag: 'first_crossing_complete',
      samuelDialogue: "You've crossed your first threshold. The station sees you differently now."
    }
  },
  {
    id: 'crossroads_trial',
    name: 'The Crossroads Trial',
    description: 'A deeper evaluation of your growing expertise',
    unlockCondition: {
      minPatternMasteryLevel: 2,  // Regular rank
      minCareerExpertiseLevel: 2,  // Apprentice in any domain
      requiredFlags: ['first_crossing_complete']
    },
    phases: [
      {
        phase: 'written',
        name: 'Deeper Understanding',
        description: 'Test your grasp of complex relationships',
        duration: 7,
        evaluationType: 'knowledge',
        questions: CROSSROADS_TRIAL_WRITTEN,
        passingScore: 55
      },
      {
        phase: 'practical',
        name: 'The Dilemma',
        description: 'Navigate scenarios with no easy answers',
        duration: 10,
        evaluationType: 'decision',
        questions: CROSSROADS_TRIAL_PRACTICAL,
        passingScore: 45
      },
      {
        phase: 'finals',
        name: 'Growth Reflection',
        description: 'Articulate how you\'ve changed',
        duration: 5,
        evaluationType: 'synthesis',
        questions: CROSSROADS_TRIAL_FINALS,
        passingScore: 40
      }
    ],
    completionReward: {
      patternBonus: 3,
      expertiseBonus: 10,
      specialFlag: 'crossroads_trial_complete',
      samuelDialogue: "At the crossroads, you chose. That's more than most ever do."
    }
  },
  {
    id: 'masters_challenge',
    name: "The Master's Challenge",
    description: 'The final assessment before true recognition',
    unlockCondition: {
      minPatternMasteryLevel: 3,  // Conductor rank
      minCareerExpertiseLevel: 4,  // Specialist in any domain
      requiredFlags: ['crossroads_trial_complete'],
      minCharactersMet: 10
    },
    phases: [
      {
        phase: 'written',
        name: 'Mastery Test',
        description: 'Demonstrate deep understanding',
        duration: 10,
        evaluationType: 'knowledge',
        questions: MASTERS_CHALLENGE_WRITTEN,
        passingScore: 50
      },
      {
        phase: 'practical',
        name: 'The Crisis',
        description: 'Handle a complex, high-stakes scenario',
        duration: 12,
        evaluationType: 'decision',
        questions: MASTERS_CHALLENGE_PRACTICAL,
        passingScore: 45
      },
      {
        phase: 'finals',
        name: 'Legacy Reflection',
        description: 'What will you carry forward?',
        duration: 7,
        evaluationType: 'synthesis',
        questions: MASTERS_CHALLENGE_FINALS,
        passingScore: 40
      }
    ],
    completionReward: {
      patternBonus: 5,
      expertiseBonus: 15,
      specialFlag: 'masters_challenge_complete',
      samuelDialogue: "There's nothing more I can teach you. But the station... it still has secrets."
    }
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRY HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get assessment arc by ID
 */
export function getAssessmentById(assessmentId: string): AssessmentArc | undefined {
  return ASSESSMENT_ARCS.find(arc => arc.id === assessmentId)
}

/**
 * Get phase config from arc
 */
export function getPhaseConfig(arc: AssessmentArc, phase: AssessmentPhase): AssessmentPhaseConfig | undefined {
  return arc.phases.find(p => p.phase === phase)
}

/**
 * Get next phase in assessment
 */
export function getNextPhase(currentPhase: AssessmentPhase): AssessmentPhase | null {
  const idx = ASSESSMENT_PHASES.indexOf(currentPhase)
  if (idx < 0 || idx >= ASSESSMENT_PHASES.length - 1) return null
  return ASSESSMENT_PHASES[idx + 1]
}

// ═══════════════════════════════════════════════════════════════════════════
// UNLOCK CHECK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Input for unlock check
 */
export interface UnlockCheckInput {
  patternMasteryLevel: number
  maxExpertiseLevel: number
  charactersMet: number
  globalFlags: Set<string> | string[]
}

/**
 * Check if an assessment is unlocked
 */
export function isAssessmentUnlocked(
  arc: AssessmentArc,
  input: UnlockCheckInput
): boolean {
  const condition = arc.unlockCondition
  const flags = input.globalFlags instanceof Set ? input.globalFlags : new Set(input.globalFlags)

  // Check pattern mastery level
  if (condition.minPatternMasteryLevel !== undefined) {
    if (input.patternMasteryLevel < condition.minPatternMasteryLevel) {
      return false
    }
  }

  // Check career expertise level
  if (condition.minCareerExpertiseLevel !== undefined) {
    if (input.maxExpertiseLevel < condition.minCareerExpertiseLevel) {
      return false
    }
  }

  // Check required flags
  if (condition.requiredFlags) {
    for (const flag of condition.requiredFlags) {
      if (!flags.has(flag)) {
        return false
      }
    }
  }

  // Check characters met
  if (condition.minCharactersMet !== undefined) {
    if (input.charactersMet < condition.minCharactersMet) {
      return false
    }
  }

  return true
}

/**
 * Get all available assessments
 */
export function getAvailableAssessments(
  input: UnlockCheckInput,
  completedAssessments: string[] = []
): AssessmentArc[] {
  return ASSESSMENT_ARCS.filter(arc => {
    // Not already completed
    if (completedAssessments.includes(arc.id)) return false
    // Check unlock condition
    return isAssessmentUnlocked(arc, input)
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// SCORING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate phase score
 */
export function calculatePhaseScore(
  phase: AssessmentPhaseConfig,
  answers: Record<string, string>,
  now: number = Date.now()
): PhaseResult {
  let score = 0
  let maxScore = 0

  for (const question of phase.questions) {
    maxScore += question.maxScore
    const answer = answers[question.id]
    const option = question.options?.find(o => o.id === answer)
    if (option) {
      score += option.score
    }
  }

  const percentScore = maxScore > 0 ? (score / maxScore) * 100 : 0
  const passed = percentScore >= phase.passingScore

  return {
    phase: phase.phase,
    score,
    maxScore,
    passed,
    answers,
    completedAt: now
  }
}

/**
 * Calculate total assessment score from phase results
 */
export function calculateAssessmentScore(
  phaseResults: Partial<Record<AssessmentPhase, PhaseResult>>
): { totalScore: number; maxScore: number; phasesPassed: number } {
  let totalScore = 0
  let maxScore = 0
  let phasesPassed = 0

  for (const result of Object.values(phaseResults)) {
    if (result) {
      totalScore += result.score
      maxScore += result.maxScore
      if (result.passed) phasesPassed++
    }
  }

  return { totalScore, maxScore, phasesPassed }
}

// ═══════════════════════════════════════════════════════════════════════════
// STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Start a new assessment
 */
export function startAssessment(
  state: AssessmentState,
  assessmentId: string,
  now: number = Date.now()
): AssessmentState {
  if (state.currentAssessment) {
    // Already have an assessment in progress
    return state
  }

  const arc = getAssessmentById(assessmentId)
  if (!arc) return state

  return {
    ...state,
    currentAssessment: {
      assessmentId,
      currentPhase: 'written',
      phaseResults: {},
      startedAt: now
    }
  }
}

/**
 * Complete current phase and advance
 */
export function completePhase(
  state: AssessmentState,
  phaseResult: PhaseResult,
  now: number = Date.now()
): AssessmentState {
  if (!state.currentAssessment) return state

  const arc = getAssessmentById(state.currentAssessment.assessmentId)
  if (!arc) return state

  const updatedResults = {
    ...state.currentAssessment.phaseResults,
    [phaseResult.phase]: phaseResult
  }

  const nextPhase = getNextPhase(phaseResult.phase)

  // If there's a next phase, continue
  if (nextPhase) {
    return {
      ...state,
      currentAssessment: {
        ...state.currentAssessment,
        currentPhase: nextPhase,
        phaseResults: updatedResults
      }
    }
  }

  // Assessment complete - calculate final result
  const { totalScore, maxScore, phasesPassed } = calculateAssessmentScore(updatedResults)
  const passed = phasesPassed >= 2 // Need to pass at least 2 of 3 phases

  const result: AssessmentResult = {
    assessmentId: state.currentAssessment.assessmentId,
    finalScore: totalScore,
    maxScore,
    passed,
    phasesCompleted: Object.keys(updatedResults).length,
    completedAt: now
  }

  return {
    ...state,
    currentAssessment: null,
    completedAssessments: passed
      ? [...state.completedAssessments, state.currentAssessment.assessmentId]
      : state.completedAssessments,
    assessmentHistory: [...state.assessmentHistory, result]
  }
}

/**
 * Abandon current assessment
 */
export function abandonAssessment(state: AssessmentState): AssessmentState {
  return {
    ...state,
    currentAssessment: null
  }
}

/**
 * Update available assessments based on input
 */
export function updateAvailableAssessments(
  state: AssessmentState,
  input: UnlockCheckInput
): AssessmentState {
  const available = getAvailableAssessments(input, state.completedAssessments)
  return {
    ...state,
    availableAssessments: available.map(a => a.id)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if player has any completed assessments
 */
export function hasCompletedAssessment(state: AssessmentState): boolean {
  return state.completedAssessments.length > 0
}

/**
 * Get the latest assessment result
 */
export function getLatestAssessmentResult(state: AssessmentState): AssessmentResult | null {
  if (state.assessmentHistory.length === 0) return null
  return state.assessmentHistory[state.assessmentHistory.length - 1]
}

/**
 * Check if a specific assessment is completed
 */
export function isAssessmentCompleted(state: AssessmentState, assessmentId: string): boolean {
  return state.completedAssessments.includes(assessmentId)
}

/**
 * Get assessment progress percentage
 */
export function getAssessmentProgress(state: AssessmentState): number {
  const total = ASSESSMENT_ARCS.length
  const completed = state.completedAssessments.length
  return Math.round((completed / total) * 100)
}

// Re-export default state creator
export { createDefaultAssessmentState }
