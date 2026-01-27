/**
 * choice-processing.ts — Pure computation functions extracted from handleChoice
 *
 * Phase 1.2: These functions contain zero side effects. They take game state
 * and return computed results. The orchestrator (useChoiceHandler) calls them
 * and applies their results.
 *
 * Contract:
 * - NO setState calls
 * - NO audio triggers
 * - NO localStorage access
 * - NO Zustand store access
 * - NO logging (caller logs)
 * - Returns values only
 */

import type { GameState } from '@/lib/character-state'
import { isValidPattern, type PatternType, type PlayerPatterns } from '@/lib/patterns'
import type { ConsequenceEcho } from '@/lib/consequence-echoes'
import {
  getConsequenceEcho,
  checkPatternThreshold as checkPatternEchoThreshold,
  getPatternRecognitionEcho,
  createResonanceEchoFromDescription,
  getOrbMilestoneEcho,
} from '@/lib/consequence-echoes'
import { calculateResonantTrustChange } from '@/lib/pattern-affinity'
import { getRelevantCrossCharacterEcho } from '@/lib/character-relationships'
import { recordTrustChange, type TrustTimeline } from '@/lib/trust-derivatives'
import { checkTransformationEligible, type TransformationMoment } from '@/lib/character-transformations'
import type { CharacterId } from '@/lib/graph-registry'

// ============================================================
// Trust Feedback Computation
// ============================================================

export interface TrustFeedbackResult {
  /** The consequence echo to display (if trust changed) */
  consequenceEcho: ConsequenceEcho | null
  /** Whether to play trust sound */
  playTrustSound: boolean
  /** Updated trust timeline (if applicable) */
  updatedTimeline: TrustTimeline | null
}

/**
 * Compute trust-related feedback from a choice.
 * Pure function — no side effects.
 */
export function computeTrustFeedback(params: {
  trustDelta: number
  characterId: string
  newGameState: GameState
  choicePattern: PatternType | undefined
  nodeId: string
  choiceText: string
}): TrustFeedbackResult {
  const { trustDelta, characterId, newGameState, choicePattern, nodeId, choiceText } = params

  if (trustDelta === 0) {
    return { consequenceEcho: null, playTrustSound: false, updatedTimeline: null }
  }

  let consequenceEcho: ConsequenceEcho | null = null
  const currentTrust = newGameState.characters.get(characterId)?.trust ?? 5

  // Check if pattern resonance affected this trust change
  const resonanceResult = calculateResonantTrustChange(
    trustDelta,
    characterId,
    newGameState.patterns,
    choicePattern
  )

  if (resonanceResult.resonanceTriggered && resonanceResult.resonanceDescription) {
    consequenceEcho = createResonanceEchoFromDescription(resonanceResult.resonanceDescription)
  } else {
    consequenceEcho = getConsequenceEcho(characterId, trustDelta)

    // P4: Cross-character echo fallback
    if (!consequenceEcho) {
      const crossEcho = getRelevantCrossCharacterEcho(characterId, newGameState)
      if (crossEcho) {
        consequenceEcho = {
          text: crossEcho.text,
          emotion: crossEcho.emotion,
          timing: 'immediate',
          trustAtEvent: currentTrust,
        }
      }
    }
  }

  // D-010: Add trust level for intensity-based display
  if (consequenceEcho) {
    consequenceEcho = { ...consequenceEcho, trustAtEvent: currentTrust }
  }

  // D-039: Record trust change in timeline
  let updatedTimeline: TrustTimeline | null = null
  const charState = newGameState.characters.get(characterId)
  if (charState?.trustTimeline) {
    updatedTimeline = recordTrustChange(
      charState.trustTimeline,
      charState.trust,
      trustDelta,
      nodeId,
      choiceText.substring(0, 50)
    )
  }

  return {
    consequenceEcho,
    playTrustSound: trustDelta > 0,
    updatedTimeline,
  }
}

// ============================================================
// Consequence Echo Computation (non-trust echoes)
// ============================================================

export interface PatternEchoResult {
  /** Pattern recognition echo (if threshold crossed) */
  consequenceEcho: ConsequenceEcho | null
  /** "Worldview Shift" message */
  patternShiftMsg: string | null
  /** Pattern that crossed threshold */
  crossedPattern: string | null
}

/**
 * Compute pattern-threshold echo feedback.
 * Pure function — no side effects.
 */
export function computePatternEcho(params: {
  previousPatterns: PlayerPatterns
  newPatterns: PlayerPatterns
  characterId: string
  existingEcho: ConsequenceEcho | null
}): PatternEchoResult {
  const { previousPatterns, newPatterns, characterId, existingEcho } = params

  const crossedPattern = checkPatternEchoThreshold(previousPatterns, newPatterns, 5)

  if (!crossedPattern) {
    return { consequenceEcho: null, patternShiftMsg: null, crossedPattern: null }
  }

  // Pattern recognition takes precedence only if no existing echo
  const consequenceEcho = !existingEcho
    ? getPatternRecognitionEcho(characterId, crossedPattern)
    : null

  const level = isValidPattern(crossedPattern) ? newPatterns[crossedPattern as PatternType] : 0
  const patternName = crossedPattern.charAt(0).toUpperCase() + crossedPattern.slice(1)
  const patternShiftMsg = `Worldview Shift: ${patternName} (Level ${level})`

  return { consequenceEcho, patternShiftMsg, crossedPattern }
}

/**
 * Compute orb milestone echo (Samuel-only).
 * Pure function aside from milestone state.
 */
export function computeOrbMilestoneEcho(params: {
  characterId: string
  existingEcho: ConsequenceEcho | null
  getUnacknowledgedMilestone: () => string | null
}): { consequenceEcho: ConsequenceEcho | null; milestoneToAcknowledge: string | null } {
  const { characterId, existingEcho, getUnacknowledgedMilestone } = params

  if (existingEcho || characterId !== 'samuel') {
    return { consequenceEcho: null, milestoneToAcknowledge: null }
  }

  const milestone = getUnacknowledgedMilestone()
  if (!milestone) {
    return { consequenceEcho: null, milestoneToAcknowledge: null }
  }

  const echo = getOrbMilestoneEcho(milestone)
  return {
    consequenceEcho: echo,
    milestoneToAcknowledge: echo ? milestone : null,
  }
}

/**
 * Compute transformation eligibility.
 * Pure function — caller applies side effects.
 */
export function computeTransformation(params: {
  trustDelta: number
  characterId: string
  newGameState: GameState
  witnessedTransformations: string[]
}): TransformationMoment | null {
  const { trustDelta, characterId, newGameState, witnessedTransformations } = params

  if (trustDelta <= 0) return null

  const characterData = newGameState.characters.get(characterId)
  if (!characterData) return null

  return checkTransformationEligible(characterId, {
    trust: characterData.trust,
    knowledgeFlags: characterData.knowledgeFlags,
    globalFlags: newGameState.globalFlags,
    patterns: newGameState.patterns,
    witnessedTransformations,
  })
}

// ============================================================
// Trust Feedback Message
// ============================================================

/**
 * Generate the trust change feedback toast message.
 */
export function computeTrustFeedbackMessage(
  trustDelta: number,
  characterId: string
): { message: string } | null {
  if (trustDelta === 0) return null

  const charName = characterId.charAt(0).toUpperCase() + characterId.slice(1)
  const sign = trustDelta > 0 ? '+' : ''
  return { message: `Trust (${charName}): ${sign}${trustDelta}` }
}

// ============================================================
// Skill Tracking Context
// ============================================================

export interface SkillTrackingResult {
  demonstratedSkills: string[]
  skillContext: string | null
  skillsToKeep: string[]
}

/**
 * Compute skill tracking data from a choice.
 * Pure function — caller records to skill tracker.
 */
export function computeSkillTracking(params: {
  choiceSkills: string[] | undefined
  currentNodeId: string | undefined
  currentNodeSpeaker: string | undefined
  choiceText: string
  choicePattern: string | undefined
  gamePatterns: PlayerPatterns | Record<string, number>
  recentSkills: string[]
}): SkillTrackingResult {
  const {
    choiceSkills,
    currentNodeId,
    currentNodeSpeaker,
    choiceText,
    choicePattern,
    gamePatterns,
    recentSkills,
  } = params

  if (!choiceSkills || choiceSkills.length === 0 || !currentNodeId) {
    return {
      demonstratedSkills: [],
      skillContext: null,
      skillsToKeep: recentSkills.slice(0, 8),
    }
  }

  const demonstratedSkills = choiceSkills
  const truncatedChoice = choiceText.length > 60
    ? choiceText.substring(0, 57) + '...'
    : choiceText
  const pattern = choicePattern || 'exploring'

  let context = `In conversation with ${currentNodeSpeaker}, `
  context += `the player chose "${truncatedChoice}" `
  context += `(${pattern} pattern), `
  context += `demonstrating ${demonstratedSkills.join(', ')}. `

  const dominantPattern = Object.entries(gamePatterns)
    .reduce((max, curr) => curr[1] > max[1] ? curr : max, ['exploring', 0])
  if (dominantPattern[1] >= 5) {
    context += `This aligns with their emerging ${dominantPattern[0]} identity. `
  }

  context += `[${currentNodeId}]`

  return {
    demonstratedSkills,
    skillContext: context,
    skillsToKeep: [...demonstratedSkills, ...recentSkills].slice(0, 10),
  }
}
