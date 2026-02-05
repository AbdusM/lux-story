/**
 * Assessment Arc Module
 *
 * Naruto Chunin Exam-inspired multi-phase evaluation system.
 * Extends existing simulation system with formal assessment structure.
 *
 * @module lib/ranking/assessment-arc
 */

import type { PatternType } from '@/lib/patterns'
import { randomPick } from '@/lib/seeded-random'

// ═══════════════════════════════════════════════════════════════════════════
// ASSESSMENT TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Assessment phases - Chunin Exam inspired
 */
export type AssessmentPhase = 'written' | 'practical' | 'finals'

/**
 * All assessment phases in order
 */
export const ASSESSMENT_PHASES: AssessmentPhase[] = ['written', 'practical', 'finals']

/**
 * Question types
 */
export type AssessmentQuestionType = 'choice' | 'scenario' | 'reflection'

/**
 * Evaluation types per phase
 */
export type EvaluationType = 'knowledge' | 'decision' | 'synthesis'

// ═══════════════════════════════════════════════════════════════════════════
// ASSESSMENT STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Answer option for a question
 */
export interface AssessmentOption {
  id: string
  text: string
  score: number
  feedback: string
  patterns?: PatternType[]
}

/**
 * Individual assessment question
 */
export interface AssessmentQuestion {
  id: string
  prompt: string
  type: AssessmentQuestionType
  options: AssessmentOption[]
  evaluationCriteria: string[]
  maxScore: number
}

/**
 * Phase configuration
 */
export interface AssessmentPhaseConfig {
  phase: AssessmentPhase
  name: string
  description: string
  duration: number  // Expected minutes
  evaluationType: EvaluationType
  questions: AssessmentQuestion[]
  passingScore: number  // Percentage 0-100
}

/**
 * Unlock conditions for an assessment
 */
export interface AssessmentUnlockCondition {
  minPatternMasteryLevel?: number
  minCareerExpertiseLevel?: number
  requiredFlags?: string[]
  minCharactersMet?: number
}

/**
 * Reward for completing an assessment
 */
export interface AssessmentReward {
  patternBonus: number
  expertiseBonus: number
  specialFlag: string
  samuelDialogue: string
}

/**
 * Full assessment arc definition
 */
export interface AssessmentArc {
  id: string
  name: string
  description: string
  unlockCondition: AssessmentUnlockCondition
  phases: AssessmentPhaseConfig[]
  completionReward: AssessmentReward
}

// ═══════════════════════════════════════════════════════════════════════════
// ASSESSMENT STATE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Result for a single phase
 */
export interface PhaseResult {
  phase: AssessmentPhase
  score: number
  maxScore: number
  passed: boolean
  answers: Record<string, string>  // questionId → answerId
  completedAt: number
}

/**
 * Current assessment progress
 */
export interface CurrentAssessmentProgress {
  assessmentId: string
  currentPhase: AssessmentPhase
  phaseResults: Partial<Record<AssessmentPhase, PhaseResult>>
  startedAt: number
}

/**
 * Final result for a completed assessment
 */
export interface AssessmentResult {
  assessmentId: string
  finalScore: number
  maxScore: number
  passed: boolean
  phasesCompleted: number
  completedAt: number
}

/**
 * Full assessment state
 */
export interface AssessmentState {
  availableAssessments: string[]
  completedAssessments: string[]
  currentAssessment: CurrentAssessmentProgress | null
  assessmentHistory: AssessmentResult[]
}

// ═══════════════════════════════════════════════════════════════════════════
// DISPLAY INFO
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Phase display information
 */
export interface PhaseDisplayInfo {
  phase: AssessmentPhase
  name: string
  icon: string
  colorToken: string
}

export const PHASE_DISPLAY: Record<AssessmentPhase, PhaseDisplayInfo> = {
  written: {
    phase: 'written',
    name: 'Written',
    icon: 'scroll',
    colorToken: 'blue'
  },
  practical: {
    phase: 'practical',
    name: 'Practical',
    icon: 'zap',
    colorToken: 'amber'
  },
  finals: {
    phase: 'finals',
    name: 'Finals',
    icon: 'crown',
    colorToken: 'purple'
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SAMUEL MESSAGES
// ═══════════════════════════════════════════════════════════════════════════

export const SAMUEL_ASSESSMENT_MESSAGES = {
  start: {
    first_crossing: [
      "Your first formal test. Don't worry—it's not about passing or failing.",
      "The station is curious about you. This assessment will show us both what you've learned."
    ],
    crossroads_trial: [
      "The Crossroads Trial. This one matters more.",
      "You've grown since your first assessment. Let's see how much."
    ],
    masters_challenge: [
      "Few reach this point. The Master's Challenge awaits.",
      "This is the final assessment. Everything you've learned comes together here."
    ]
  },
  phaseComplete: {
    written: [
      "The written portion is complete. Knowledge is the foundation.",
      "You've shown what you know. Now show what you can do."
    ],
    practical: [
      "Decisions made. The practical phase reveals much.",
      "Under pressure, you chose. That's what matters."
    ],
    finals: [
      "The reflection is complete. Self-knowledge is the hardest kind.",
      "You've looked inward. That takes courage."
    ]
  },
  passed: [
    "You've passed. The station recognizes your growth.",
    "Well done. This milestone will not be forgotten."
  ],
  partial: [
    "Not a complete pass, but progress nonetheless.",
    "Every step forward counts, even incomplete ones."
  ],
  retry: [
    "You can try again when you're ready. There's no shame in growth.",
    "The assessment will be here. Take the time you need."
  ]
}

/**
 * Get Samuel's message for assessment start
 */
export function getSamuelAssessmentStartMessage(assessmentId: string): string {
  const messages = SAMUEL_ASSESSMENT_MESSAGES.start[assessmentId as keyof typeof SAMUEL_ASSESSMENT_MESSAGES.start]
  if (!messages) return "An assessment awaits. Show me what you've learned."
  return randomPick(messages)!
}

/**
 * Get Samuel's message for phase completion
 */
export function getSamuelPhaseCompleteMessage(phase: AssessmentPhase): string {
  const messages = SAMUEL_ASSESSMENT_MESSAGES.phaseComplete[phase]
  return randomPick(messages)!
}

/**
 * Get Samuel's message for assessment result
 */
export function getSamuelAssessmentResultMessage(passed: boolean, partial: boolean): string {
  if (passed) {
    const messages = SAMUEL_ASSESSMENT_MESSAGES.passed
    return randomPick(messages)!
  }
  if (partial) {
    const messages = SAMUEL_ASSESSMENT_MESSAGES.partial
    return randomPick(messages)!
  }
  const messages = SAMUEL_ASSESSMENT_MESSAGES.retry
  return randomPick(messages)!
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT STATE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create default (empty) assessment state
 */
export function createDefaultAssessmentState(): AssessmentState {
  return {
    availableAssessments: [],
    completedAssessments: [],
    currentAssessment: null,
    assessmentHistory: []
  }
}
