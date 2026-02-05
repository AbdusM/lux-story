/**
 * Tier 2 Evaluators - First-Match-Wins
 *
 * Phase 4B: Pure computation functions for Tier 2 consequence echo evaluators.
 * These only set consequenceEcho if none exists (first-match-wins).
 *
 * Contract:
 * - NO setState calls
 * - NO audio triggers
 * - NO localStorage access
 * - NO Zustand store access
 * - Returns values only
 *
 * NOTE: This file contains stub implementations. The actual logic remains
 * in useChoiceHandler until each evaluator is incrementally migrated.
 * This allows the registry infrastructure to be tested while avoiding
 * breaking changes.
 */

import type { EvaluatorContext, EvaluatorResult } from './evaluator-types'
import type { ConsequenceEcho } from '@/lib/consequence-echoes'
import { DISCOVERY_HINTS, getDiscoveryHint } from '@/lib/consequence-echoes'
import type { AsymmetryReaction } from '@/lib/trust-derivatives'
import { analyzeTrustAsymmetry, getAsymmetryComment } from '@/lib/trust-derivatives'
import {
  getPatternRecognitionComments,
  getUnlockedGates,
  PATTERN_TRUST_GATES,
  checkNewAchievements,
} from '@/lib/pattern-derivatives'
import { random } from '@/lib/seeded-random'
import { getNewlyAvailableCombinations } from '@/lib/knowledge-derivatives'
import {
  getActiveMagicalRealisms,
  getUnlockedMetaRevelations,
  getCascadeEffectsForFlag,
} from '@/lib/narrative-derivatives'
import {
  getActiveEnvironmentalEffects,
  getAvailableCrossCharacterExperiences,
} from '@/lib/character-derivatives'

/**
 * Evaluator: Trust Asymmetry
 * D-005: Character notices player trusts others differently
 * 15% chance per interaction
 *
 * STATUS: EXTRACTED (fully implemented)
 */
export function evaluateTrustAsymmetry(
  ctx: EvaluatorContext,
  currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  if (currentEcho) {
    return { consequenceEcho: null }
  }

  // 15% chance per interaction (TD-007: use seeded random)
  if (random() >= 0.15) {
    return { consequenceEcho: null }
  }

  const asymmetries = analyzeTrustAsymmetry(ctx.gameState.characters, ctx.characterId)
  const significantAsymmetry = asymmetries.find(
    a => a.asymmetry.level === 'notable' || a.asymmetry.level === 'major'
  )

  if (!significantAsymmetry) {
    return { consequenceEcho: null }
  }

  const reaction: AsymmetryReaction = significantAsymmetry.direction === 'higher'
    ? 'curiosity'
    : 'jealousy'

  const asymmetryText = getAsymmetryComment(ctx.characterId, reaction, ctx.gameState)

  if (!asymmetryText) {
    return { consequenceEcho: null }
  }

  return {
    consequenceEcho: {
      text: asymmetryText,
      timing: 'immediate',
      soundCue: undefined
    }
  }
}

/**
 * Stub evaluators for registry completeness.
 * Actual logic remains in useChoiceHandler until migrated.
 */

/**
 * Evaluator: Discovery Hint
 * Vulnerability foreshadowing for Maya/Devon
 * 20% chance per interaction, only if no other echo is active
 *
 * STATUS: EXTRACTED (fully implemented)
 */
export function evaluateDiscoveryHint(
  ctx: EvaluatorContext,
  currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  if (currentEcho) {
    return { consequenceEcho: null }
  }

  // Check if character has discovery hints defined
  if (!DISCOVERY_HINTS[ctx.characterId]) {
    return { consequenceEcho: null }
  }

  // 20% chance per interaction (TD-007: use seeded random)
  if (random() >= 0.20) {
    return { consequenceEcho: null }
  }

  const targetCharacter = ctx.gameState.characters.get(ctx.characterId)
  if (!targetCharacter) {
    return { consequenceEcho: null }
  }

  const vulnerabilities = DISCOVERY_HINTS[ctx.characterId]
  for (const vuln of vulnerabilities) {
    // Check if vulnerability not yet discovered
    const discoveryFlag = `${ctx.characterId}_${vuln.vulnerability}_revealed`
    if (!targetCharacter.knowledgeFlags.has(discoveryFlag)) {
      const hint = getDiscoveryHint(ctx.characterId, vuln.vulnerability, targetCharacter.trust)
      if (hint) {
        return { consequenceEcho: hint }
      }
    }
  }

  return { consequenceEcho: null }
}

/**
 * Evaluator: Pattern Recognition
 * D-004: Character notices player behavioral pattern
 * Characters notice and comment on player's developed patterns
 *
 * Deduplication: Uses shownPatternComments from context (passed by orchestrator).
 * Returns markPatternCommentsShown for orchestrator to persist.
 *
 * STATUS: EXTRACTED (fully implemented)
 */
export function evaluatePatternRecognition(
  ctx: EvaluatorContext,
  currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  if (currentEcho) {
    return { consequenceEcho: null }
  }

  const patternComments = getPatternRecognitionComments(
    ctx.characterId,
    ctx.gameState.patterns,
    ctx.shownPatternComments
  )

  if (patternComments.length === 0) {
    return { consequenceEcho: null }
  }

  const comment = patternComments[0]
  const commentKey = `${comment.characterId}_${comment.pattern}_${comment.threshold}`

  return {
    consequenceEcho: {
      text: `"${comment.comment}"`,
      emotion: comment.emotion,
      timing: 'immediate'
    },
    stateChanges: {
      markPatternCommentsShown: [commentKey]
    }
  }
}

/**
 * Evaluator: Knowledge Combination
 * D-006: When player has gathered enough knowledge pieces, they can make connections
 *
 * STATUS: EXTRACTED (fully implemented)
 */
export function evaluateKnowledgeCombination(
  ctx: EvaluatorContext,
  currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  if (currentEcho) {
    return { consequenceEcho: null }
  }

  // Get character knowledge map
  const characterKnowledge = new Map<string, Set<string>>()
  ctx.gameState.characters.forEach((char, charId) => {
    characterKnowledge.set(charId, char.knowledgeFlags)
  })

  // Check for new combinations (compare old vs new state)
  const oldGlobalFlags = ctx.previousGameState?.globalFlags || new Set<string>()
  const newCombinations = getNewlyAvailableCombinations(
    oldGlobalFlags,
    ctx.gameState.globalFlags,
    characterKnowledge
  )

  if (newCombinations.length === 0) {
    return { consequenceEcho: null }
  }

  const combo = newCombinations[0]
  return {
    consequenceEcho: {
      text: combo.discoveryText,
      emotion: 'revelation',
      timing: 'immediate'
    },
    stateChanges: {
      addGlobalFlags: [combo.unlocksFlag]
    }
  }
}

export function evaluateIcebergInvestigable(
  _ctx: EvaluatorContext,
  _currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  // Stub - logic in useChoiceHandler
  return { consequenceEcho: null }
}

/**
 * Evaluator: Pattern Trust Gate
 * D-002: Special content requires BOTH high trust AND specific pattern development
 *
 * STATUS: EXTRACTED (fully implemented)
 */
export function evaluatePatternTrustGate(
  ctx: EvaluatorContext,
  currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  if (currentEcho) {
    return { consequenceEcho: null }
  }

  const targetCharacter = ctx.gameState.characters.get(ctx.characterId)
  if (!targetCharacter) {
    return { consequenceEcho: null }
  }

  const prevCharacter = ctx.previousGameState?.characters.get(ctx.characterId)
  const prevUnlockedGates = ctx.previousGameState
    ? getUnlockedGates(ctx.characterId, prevCharacter?.trust || 0, ctx.previousGameState.patterns)
    : []
  const nowUnlockedGates = getUnlockedGates(ctx.characterId, targetCharacter.trust, ctx.gameState.patterns)
  const newlyUnlocked = nowUnlockedGates.filter(g => !prevUnlockedGates.includes(g))

  if (newlyUnlocked.length === 0) {
    return { consequenceEcho: null }
  }

  const gateId = newlyUnlocked[0]
  const gate = PATTERN_TRUST_GATES[gateId]
  if (!gate) {
    return { consequenceEcho: null }
  }

  return {
    consequenceEcho: {
      text: `Something shifts in ${ctx.characterId}'s demeanor... ${gate.description}`,
      emotion: 'intrigued',
      timing: 'immediate'
    },
    stateChanges: {
      addGlobalFlags: [`gate_unlocked_${gateId}`]
    }
  }
}

/**
 * Evaluator: Magical Realism
 * D-020: At high pattern levels, reality becomes more fluid
 *
 * Deduplication: Uses shownMagicalRealisms from context (passed by orchestrator).
 * Returns markMagicalRealismsShown for orchestrator to persist.
 *
 * STATUS: EXTRACTED (fully implemented)
 */
export function evaluateMagicalRealism(
  ctx: EvaluatorContext,
  currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  if (currentEcho) {
    return { consequenceEcho: null }
  }

  const prevManifestations = ctx.previousGameState
    ? getActiveMagicalRealisms(ctx.previousGameState.patterns)
    : []
  const nowManifestations = getActiveMagicalRealisms(ctx.gameState.patterns)

  // Find newly unlocked manifestations that haven't been shown
  const newlyActive = nowManifestations.filter(m =>
    !prevManifestations.some(p => p.id === m.id) &&
    !ctx.shownMagicalRealisms.has(m.id)
  )

  if (newlyActive.length === 0) {
    return { consequenceEcho: null }
  }

  const manifestation = newlyActive[0]
  return {
    consequenceEcho: {
      text: manifestation.manifestation,
      emotion: 'wonder',
      timing: 'immediate'
    },
    stateChanges: {
      addGlobalFlags: [`magical_${manifestation.id}`],
      markMagicalRealismsShown: [manifestation.id]
    }
  }
}

/**
 * Evaluator: Pattern Achievement
 * D-059: Check for newly earned pattern achievements
 *
 * STATUS: EXTRACTED (fully implemented)
 */
export function evaluatePatternAchievement(
  ctx: EvaluatorContext,
  currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  if (currentEcho) {
    return { consequenceEcho: null }
  }

  if (!ctx.previousGameState) {
    return { consequenceEcho: null }
  }

  const newAchievements = checkNewAchievements(ctx.previousGameState.patterns, ctx.gameState.patterns)

  if (newAchievements.length === 0) {
    return { consequenceEcho: null }
  }

  const achievement = newAchievements[0]
  return {
    consequenceEcho: {
      text: `${achievement.icon} ${achievement.name}: ${achievement.description}${achievement.reward ? `\n\n${achievement.reward}` : ''}`,
      emotion: 'triumph',
      timing: 'immediate'
    },
    stateChanges: {
      addGlobalFlags: [`achievement_${achievement.id}`]
    }
  }
}

/**
 * Evaluator: Environmental Effect
 * D-016: Trust level changes environment (newly active effects)
 *
 * STATUS: EXTRACTED (fully implemented)
 */
export function evaluateEnvironmentalEffect(
  ctx: EvaluatorContext,
  currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  if (currentEcho) {
    return { consequenceEcho: null }
  }

  if (!ctx.previousGameState) {
    return { consequenceEcho: null }
  }

  const prevEffects = getActiveEnvironmentalEffects(ctx.previousGameState)
  const nowEffects = getActiveEnvironmentalEffects(ctx.gameState)
  const newEffects = nowEffects.filter(e =>
    !prevEffects.some(p => p.effect === e.effect)
  )

  if (newEffects.length === 0) {
    return { consequenceEcho: null }
  }

  const effect = newEffects[0]
  return {
    consequenceEcho: {
      text: effect.visualDescription,
      emotion: 'wonder',
      timing: 'immediate'
    },
    stateChanges: {
      addGlobalFlags: [`env_${effect.effect}`]
    }
  }
}

/**
 * Evaluator: Cross-Character Experience
 * D-017: Check for newly available cross-character experiences
 *
 * STATUS: EXTRACTED (fully implemented)
 */
export function evaluateCrossCharacterExperience(
  ctx: EvaluatorContext,
  currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  if (currentEcho) {
    return { consequenceEcho: null }
  }

  if (!ctx.previousGameState) {
    return { consequenceEcho: null }
  }

  const prevExperiences = getAvailableCrossCharacterExperiences(ctx.previousGameState)
  const nowExperiences = getAvailableCrossCharacterExperiences(ctx.gameState)
  const newExperiences = nowExperiences.filter(e =>
    !prevExperiences.some(p => p.experienceId === e.experienceId)
  )

  if (newExperiences.length === 0) {
    return { consequenceEcho: null }
  }

  const exp = newExperiences[0]
  return {
    consequenceEcho: {
      text: `${exp.unlockHint}\n\n(New experience available: ${exp.experienceName})`,
      emotion: 'intrigued',
      timing: 'immediate'
    },
    stateChanges: {
      addGlobalFlags: [`exp_available_${exp.experienceId}`]
    }
  }
}

/**
 * Evaluator: Cascade Effect
 * D-062: Check for cascade effects triggered by new flags
 *
 * STATUS: EXTRACTED (fully implemented)
 */
export function evaluateCascadeEffect(
  ctx: EvaluatorContext,
  currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  if (currentEcho) {
    return { consequenceEcho: null }
  }

  if (!ctx.previousGameState) {
    return { consequenceEcho: null }
  }

  // Find flags that were just added
  const newFlags = [...ctx.gameState.globalFlags].filter(
    f => !ctx.previousGameState!.globalFlags.has(f)
  )

  for (const flag of newFlags) {
    const cascade = getCascadeEffectsForFlag(flag, ctx.characterId)
    if (cascade && cascade.chain.length > 0) {
      // Get the first degree effect
      const firstEffect = cascade.chain.find(c => c.degree === 1)
      if (firstEffect) {
        const flagsToAdd = [`cascade_${cascade.id}_triggered`]
        if (firstEffect.effect.flagSet) {
          flagsToAdd.push(firstEffect.effect.flagSet)
        }

        return {
          consequenceEcho: {
            text: firstEffect.description,
            emotion: 'knowing',
            timing: 'immediate'
          },
          stateChanges: {
            addGlobalFlags: flagsToAdd
          }
        }
      }
    }
  }

  return { consequenceEcho: null }
}

/**
 * Evaluator: Meta Revelation
 * D-065: Check for newly unlocked meta-narrative revelations
 *
 * STATUS: EXTRACTED (fully implemented)
 */
export function evaluateMetaRevelation(
  ctx: EvaluatorContext,
  currentEcho: ConsequenceEcho | null
): EvaluatorResult {
  if (currentEcho) {
    return { consequenceEcho: null }
  }

  if (!ctx.previousGameState) {
    return { consequenceEcho: null }
  }

  const prevRevelations = getUnlockedMetaRevelations(ctx.previousGameState.patterns)
  const nowRevelations = getUnlockedMetaRevelations(ctx.gameState.patterns)
  const newRevelations = nowRevelations.filter(r =>
    !prevRevelations.some(p => p.id === r.id) &&
    !ctx.gameState.globalFlags.has(`meta_${r.id}`)
  )

  if (newRevelations.length === 0) {
    return { consequenceEcho: null }
  }

  const revelation = newRevelations[0]
  const flagsToAdd = [
    `meta_${revelation.id}`,
    ...revelation.unlocksDialogue.map(nodeId => `dialogue_unlocked_${nodeId}`)
  ]

  return {
    consequenceEcho: {
      text: `${revelation.revelation}\n\n${revelation.characterAcknowledgement.dialogue}`,
      emotion: 'profound',
      timing: 'immediate'
    },
    stateChanges: {
      addGlobalFlags: flagsToAdd
    }
  }
}
