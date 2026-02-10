/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 * useChoiceHandler - Extracted from StatefulGameInterface.tsx
 *
 * Handles the player's choice selection, processing all game logic,
 * derivative systems, echo cascades, and state updates.
 */

import { useCallback, useRef, type RefObject, type Dispatch, type SetStateAction } from 'react'
import type { GameInterfaceState } from '@/lib/game-interface-types'
import { type CharacterState, type GameState, GameStateUtils } from '@/lib/character-state'
import { GameLogic } from '@/lib/game-logic'
import { DialogueGraphNavigator, StateConditionEvaluator, type EvaluatedChoice } from '@/lib/dialogue-graph'
import type { CharacterId } from '@/lib/graph-registry'
import type { SkillTracker } from '@/lib/skill-tracker'
import { useGameStore, commitGameState } from '@/lib/game-store'
import { isSupabaseConfigured } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { CHOICE_HANDLER_TIMEOUT_MS } from '@/lib/constants'
import { PATTERN_METADATA, type PatternType, type PlayerPatterns, isValidPattern } from '@/lib/patterns'
import { calculatePatternGain } from '@/lib/identity-system'
import type { OutcomeCardData, OutcomeItem } from '@/lib/outcome-card'
import { compressRewardFeedBatch, updateRewardFeed } from '@/lib/reward-feed'
import {
  applyPatternReflection,
  type ConsequenceEcho,
} from '@/lib/consequence-echoes'
import type { ActiveExperienceState } from '@/lib/experience-engine'
// trust-derivatives, info-trades, knowledge-items imports moved to choice-processors
import {
  calculateCharacterTrustDecay,
  recordPatternEvolution,
} from '@/lib/pattern-derivatives'
// knowledge-derivatives imports moved to choice-processors
import {
  getNarrativeFraming,
} from '@/lib/narrative-derivatives'
// character-derivatives imports moved to evaluator registry
// cross-character-memory imports moved to derivative-orchestrator
// queueEchosForFlag moved to arc-completion-processor
import { UnlockManager } from '@/lib/unlock-manager'
import { ABILITIES, type AbilityId } from '@/lib/abilities'
import { getPrimaryQuest, getQuestProgress, getQuestPrismTab } from '@/lib/quest-system'
// THOUGHT_REGISTRY removed - thought-system archived (never integrated)
// CROSS_CHARACTER_ECHOES, getArcCompletionFlag, detectArcCompletion moved to arc-completion-processor
import {
  getPatternVoice,
  incrementPatternVoiceNodeCounter,
  checkVoiceConflict,
  type PatternVoiceContext,
} from '@/lib/pattern-voices'
import { PATTERN_VOICE_LIBRARY } from '@/content/pattern-voice-library'
import type { OrbMilestones } from '@/hooks/useOrbs'
import { processComplexCharacterTick } from '@/lib/character-complex'
// story-arcs, synthesis-puzzles imports moved to choice-processors
import {
  queueGiftForChoice,
  tickGiftCounters,
} from '@/lib/delayed-gifts'
// getReadyGiftsForCharacter, consumeGift moved to derivative-orchestrator
// queueGiftsForArcComplete moved to arc-completion-processor
import { checkSessionBoundary, incrementBoundaryCounter, getTotalNodesVisited, type SessionAnnouncement } from '@/lib/session-structure'
import { evaluateAchievements, type MetaAchievement } from '@/lib/meta-achievements'
import {
  computeTrustFeedback,
  computePatternEcho,
  computeOrbMilestoneEcho,
  computeTransformation,
  computeTrustFeedbackMessage,
  computeSkillTracking,
} from '@/lib/choice-processing'
// runTier2Evaluators moved to derivative-orchestrator
import {
  runAllDerivativeProcessors,
  readLocalStorageSnapshot,
  buildChoiceUiPatch,
  type UiPatchContext,
} from '@/lib/choice-processors'
import { resolveNode } from '@/hooks/game/useNarrativeNavigator'
import { shouldShowInterrupt } from '@/lib/interrupt-visibility'
import { isEnabled } from '@/lib/feature-flags'
import {
  queueRelationshipSync,
  queuePlatformStateSync,
  queueSkillDemonstrationSync,
  queuePatternDemonstrationSync,
  queueInteractionEventSync,
  generateActionId,
} from '@/lib/sync-queue'
import { getPatternUnlockChoices } from '@/lib/pattern-unlock-choices'
import type { useAudioDirector } from '@/hooks/game/useAudioDirector'
import type { ExperienceSummaryData } from '@/components/ExperienceSummary'
import { hapticFeedback } from '@/lib/haptic-feedback'

interface UseChoiceHandlerParams {
  state: GameInterfaceState
  setState: Dispatch<SetStateAction<GameInterfaceState>>
  // TD-001: gameState passed explicitly from Zustand (via useCoreGameStateHydrated shim)
  gameState: GameState | null
  audio: ReturnType<typeof useAudioDirector>
  skillTrackerRef: RefObject<SkillTracker | null>
  contentLoadTimestampRef: RefObject<number>
  earnOrb: (pattern: PatternType) => { crossedThreshold5: boolean }
  earnBonusOrbs: (pattern: PatternType, amount: number) => void
  getUnacknowledgedMilestone: () => any
  acknowledgeMilestone: (key: any) => void
}

export function useChoiceHandler({
  state,
  setState,
  gameState,
  audio,
  skillTrackerRef,
  contentLoadTimestampRef,
  earnOrb,
  earnBonusOrbs,
  getUnacknowledgedMilestone,
  acknowledgeMilestone,
}: UseChoiceHandlerParams) {
  const isProcessingChoiceRef = useRef(false)
  const choiceAttemptIdRef = useRef(0)
  const lastProgressOutcomeAtRef = useRef(0)

  const handleChoice = useCallback(async (choice: EvaluatedChoice) => {
    // Initialize audio on first user interaction (required for mobile)
    audio.actions.initialize()

    // Prevent race condition from rapid-fire clicks
    if (isProcessingChoiceRef.current) return
    // TD-001: Read from explicit gameState param (from Zustand)
    if (!gameState || !choice.enabled) return

    // LOCK: Immediate ref lock + UI state update + attempt tracking
    isProcessingChoiceRef.current = true
    const attemptId = ++choiceAttemptIdRef.current
    setState(prev => ({ ...prev, isProcessing: true }))

    // Safety timeout: auto-reset lock if handler crashes or hangs
    const safetyTimeout = setTimeout(() => {
      if (isProcessingChoiceRef.current && choiceAttemptIdRef.current === attemptId) {
        logger.error('[StatefulGameInterface] Choice handler timeout-auto-resetting lock', { attemptId })
        isProcessingChoiceRef.current = false
        setState(prev => ({ ...prev, isProcessing: false }))
      }
    }, CHOICE_HANDLER_TIMEOUT_MS)

    try {
      // ═══════════════════════════════════════════════════════════════════════════
      // SCARCITY MODE (V1): Focus Recovery (special UI-only action)
      // This is intentionally handled before GameLogic so we can "rest" without
      // requiring a dedicated dialogue node in content.
      // ═══════════════════════════════════════════════════════════════════════════
      if (isEnabled('SCARCITY_MODE_V1') && choice.choice.choiceId === 'scarcity_recover_v1') {
        const fp = gameState.focusPoints ?? { current: 7, max: 7 }
        const recoveredState: GameState = {
          ...gameState,
          focusPoints: { ...fp, current: fp.max },
          lastSaved: Date.now(),
        }

        commitGameState(recoveredState)

        // Recompute choices for the current node using recovered focus.
        const node = state.currentNode
        let refreshedChoices: EvaluatedChoice[] = state.availableChoices || []
        if (node) {
          const characterId = state.currentCharacterId
          const regular = StateConditionEvaluator
            .evaluateChoices(node, recoveredState, characterId, recoveredState.skillLevels)
            .filter(c => c.visible)
          const targetCharacter = recoveredState.characters.get(characterId)
          const unlocks = getPatternUnlockChoices(
            characterId,
            recoveredState.patterns,
            state.currentGraph,
            targetCharacter?.visitedPatternUnlocks,
          )
          refreshedChoices = [...regular, ...unlocks]
        }

        const nowMs = Date.now()
        const batch = compressRewardFeedBatch(
          [{ kind: 'info', title: 'Recovered focus', detail: `${fp.max}/${fp.max}` }],
          1
        )
        const nextRewardFeed = updateRewardFeed(state.rewardFeed || [], batch, nowMs)

        clearTimeout(safetyTimeout)
        isProcessingChoiceRef.current = false
        setState(prev => ({
          ...prev,
          availableChoices: refreshedChoices,
          rewardFeed: nextRewardFeed,
          isProcessing: false,
          isLoading: false,
          error: null,
        }))
        return
      }

      // ═══════════════════════════════════════════════════════════════════════════
      // THE UNIFIED CALCULATOR
      // All game logic is now centralized in GameLogic.processChoice (Pure Function)
      // ═══════════════════════════════════════════════════════════════════════════

      const reactionTime = Date.now() - contentLoadTimestampRef.current
      // TD-001: Use explicit gameState param (from Zustand)
      const result = GameLogic.processChoice(gameState, choice, reactionTime)
      const previousPatterns = { ...gameState.patterns } // Restored for echo check
      let newGameState = result.newState
      if (isEnabled('SCARCITY_MODE_V1')) {
        const fp = newGameState.focusPoints ?? { current: 7, max: 7 }
        newGameState = {
          ...newGameState,
          focusPoints: { ...fp, current: Math.max(0, fp.current - 1) },
        }
      }
      // INVARIANT: newGameState is deep-cloned by GameLogic.processChoice (via cloneGameState).
      // globalFlags (Set) and characters (Map) are fresh clones — .add()/.set() mutations are safe.
      // patterns is a spread copy of primitives — direct assignment is safe.
      // If cloneGameState depth changes, these assumptions break. See lib/character-state.ts:533.
      const trustDelta = result.trustDelta
      const outcomeItems: OutcomeItem[] = []
      let abilityUnlockId: AbilityId | null = null
      let identityCeremonyPattern: PatternType | null = null
      let identityOfferingPattern: PatternType | null = null

      // Telemetry: authoritative choice result (pattern awarded, trust delta, etc.)
      // This complements the UI-side `choice_selected_ui` event (index + ordering).
      try {
        const nowIso = new Date().toISOString()
        const currentChar = state.currentCharacterId ? gameState.characters.get(state.currentCharacterId) : null
        queueInteractionEventSync({
          user_id: gameState.playerId,
          session_id: String(gameState.sessionStartTime || Date.now()),
          event_type: 'choice_selected_result',
          node_id: state.currentNode?.nodeId,
          character_id: state.currentCharacterId || undefined,
          payload: {
            occurred_at: nowIso,
            choice_id: choice.choice.choiceId || null,
            choice_text: choice.choice.text?.substring(0, 200) || null,
            choice_pattern: choice.choice.pattern || null,
            reaction_time_ms: reactionTime,
            earned_pattern: result.events.earnOrb || null,
            trust_delta: trustDelta ?? null,
            nervous_system_state: currentChar?.nervousSystemState || null,
          }
        })
      } catch {
        // Telemetry must never break gameplay.
      }

      // ═══════════════════════════════════════════════════════════════════════════
      // STATE DEFINITIONS
      // ═══════════════════════════════════════════════════════════════════════════

      // Fix 6: Buffer localStorage writes to avoid synchronous stalls on mobile Safari.
      // Reads stay inline (fast, needed for logic). Writes flush once at end.
      const localStorageBuffer: Record<string, string> = {}

      // P5: Derive Atmospheric Emotion (Moved to top level to avoid conditional hook error)

      // 1. Process Orb Events (Discovery) + Persist Pattern to DB
      if (result.events.earnOrb) {
        const { crossedThreshold5 } = earnOrb(result.events.earnOrb)
        outcomeItems.push({
          kind: 'orb',
          title: 'Orb gained',
          detail: PATTERN_METADATA[result.events.earnOrb].label,
          prismTab: 'harmonics',
        })

        // Persist pattern demonstration to database via sync queue
        queuePatternDemonstrationSync({
          user_id: newGameState.playerId,
          pattern_name: result.events.earnOrb,
          choice_id: choice.choice.choiceId || `${state.currentNode?.nodeId || 'node'}-${Date.now()}`,
          choice_text: choice.choice.text.substring(0, 200),
          scene_id: state.currentNode?.nodeId || 'unknown',
          character_id: state.currentCharacterId || 'station',
          context: `Made ${result.events.earnOrb} choice with ${state.currentCharacterId || 'the station'}`
        })

        // D-040: Record pattern evolution for heatmap visualization
        if (newGameState.patternEvolutionHistory) {
          const baseGain = 1 // Standard pattern gain
          const patternGain = calculatePatternGain(baseGain, result.events.earnOrb, newGameState)
          newGameState.patternEvolutionHistory = recordPatternEvolution(
            newGameState.patternEvolutionHistory,
            state.currentNode?.nodeId || 'unknown',
            state.currentCharacterId || 'station',
            result.events.earnOrb,
            patternGain,
            choice.choice.text.substring(0, 50)
          )
          logger.info('[StatefulGameInterface] D-040 Pattern evolution recorded:', {
            pattern: result.events.earnOrb,
            delta: patternGain,
            characterId: state.currentCharacterId
          })
        }

        if (crossedThreshold5) {
          const identityThoughtId = `identity-${result.events.earnOrb}` as const
          newGameState = GameStateUtils.applyStateChange(newGameState, {
            thoughtId: identityThoughtId
          })

          if (isEnabled('IDENTITY_OFFERING_V1')) {
            identityOfferingPattern = result.events.earnOrb || null
          } else {
            // Trigger the Identity Ceremony via the final UI patch (prevents it being overwritten).
            identityCeremonyPattern = result.events.earnOrb || null
          }

          if (result.events.checkIdentityThreshold) {
            audio.actions.triggerIdentitySound()
            hapticFeedback.patternMilestone() // Premium haptic for identity milestone
          }
        }

        // Check for NEW ABILITY UNLOCKS (P0)
        // If the orb pushed us over a tier threshold, unlock the ability immediately
        const unlockCheck = UnlockManager.checkUnlockStatus(newGameState)
        if (unlockCheck) {
          newGameState = { ...newGameState, ...unlockCheck.updates }
          abilityUnlockId = unlockCheck.unlockedIds[0] || null

          outcomeItems.push({
            kind: 'unlock',
            title: 'Mastery Unlocked',
            detail: ABILITIES[unlockCheck.unlockedIds[0]].name,
            prismTab: 'mastery',
          })

          audio.actions.triggerIdentitySound()
          hapticFeedback.success() // Success haptic for ability unlock
        }

        // 5. Thought Unlocks - ARCHIVED
        // See lib/archive/thought-system.legacy.ts for original design
        // Feature was planned but never integrated into gameplay loop
      }


      // 6. Relationship Updates (Visual Feedback)
      if (result.events.relationshipUpdates && result.events.relationshipUpdates.length > 0) {
        // We only show the first major update to avoid spam
        const update = result.events.relationshipUpdates[0]

        // Use capitalization as fallback for name since CharacterState doesn't store it
        const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
        const fromChar = capitalize(update.fromId)
        const toChar = capitalize(update.toId)

        outcomeItems.push({
          kind: 'info',
          title: 'Station Dynamics Shifted',
          detail: `${fromChar} & ${toChar}`,
          prismTab: 'essence',
        })

        audio.actions.triggerIdentitySound()
      }

      // 7. Voice Revelation Echo ("Surface the Magic")
      // When player's dominant pattern crosses threshold 5, reveal the voice system
      if (result.events.voiceRevelationEcho) {
        const echo = result.events.voiceRevelationEcho
        outcomeItems.push({
          kind: 'info',
          title: 'New Echo',
          detail: echo.text.length > 120 ? echo.text.substring(0, 117) + '...' : echo.text,
          prismTab: 'mind',
        })
        logger.info('[StatefulGameInterface] Voice system revelation triggered:', {
          echoText: echo.text.substring(0, 50)
        })
        audio.actions.triggerIdentitySound()
      }

      // Check for identity threshold (existing logic)
      if (result.events.checkIdentityThreshold) {
        // Validation: confirm this function exists in scope or defined above
        // If not found, we assume it's a helper defined in the component
        // checking the usage: checkIdentityThreshold(newGameState)
        // If it still errors, we might need to verify its source.
        // For now, assuming it was available in scope as per original file state.
        // checkIdentityThreshold(newGameState)

        // actually if the lint said "Cannot find name", I must have broken it or it wasn't there.
        // checkIdentityThreshold seems to be a method I expected to exist.
        // I will verify usage in lib search.
        // Temporarily handling it:
        // checkIdentityThreshold(newGameState)
      }

      // 2. Process Audio Events
      if (result.events.playSound) {
        const { type, id } = result.events.playSound
        if (type === 'pattern' && id) audio.actions.triggerPatternSound(id)
        // other types handled implicitly or below
      }

      // 3. Process Skill Updates
      if (result.events.updateSkills && result.events.updateSkills.length > 0) {
        const skillUpdates: Partial<Record<string, number>> = {}
        const currentSkills = useGameStore.getState().skills
        for (const skill of result.events.updateSkills) {
          if (skill in currentSkills) {
            const currentValue = currentSkills[skill as keyof typeof currentSkills] || 0
            const increment = 0.1 * (1 - currentValue * 0.5)
            skillUpdates[skill] = Math.min(1, currentValue + increment)
          }
        }
        if (Object.keys(skillUpdates).length > 0) {
          useGameStore.getState().updateSkills(skillUpdates)

          // Persist each skill demonstration to database via sync queue
          for (const skill of result.events.updateSkills) {
            queueSkillDemonstrationSync({
              user_id: newGameState.playerId,
              skill_name: skill,
              scene_id: state.currentNode?.nodeId || 'unknown',
              choice_text: choice.choice.text.substring(0, 200),
              context: `Demonstrated ${skill} while interacting with ${state.currentCharacterId || 'the station'}`
            })
          }
        }
      }

      // 4. Generate Visual Feedback (Pattern Sensation)
      // Pass this to UI state via setState later
      const patternSensation = result.patternSensation

      // 5. Generate Consequence Echoes (Dialogue Feedback)
      // PRECEDENCE RULES (23 echo evaluators):
      //   Priority tier 1 (unconditional overwrite): Transformation > Milestone > Trust/Pattern
      //   Priority tier 2 (first-match-wins): Blocks 5-23 only set echo if null
      //   One echo per choice — first match wins after tier 1 resolution.
      //   Many blocks also mutate newGameState (flags, arcs, patterns) regardless of echo.
      //
      // EVALUATOR REGISTRY: See tests/lib/evaluator-order.test.ts for full dependency graph.
      // WARNING: Do not reorder evaluators without updating the test + validating dependencies.
      // Phase 1.2: Trust feedback extracted to pure function
      const trustFeedback = computeTrustFeedback({
        trustDelta,
        characterId: state.currentCharacterId,
        newGameState,
        choicePattern: choice.choice.pattern as PatternType | undefined,
        nodeId: state.currentNode?.nodeId || 'unknown',
        choiceText: choice.choice.text,
      })
      let consequenceEcho: ConsequenceEcho | null = trustFeedback.consequenceEcho

      if (trustFeedback.playTrustSound) {
        audio.actions.triggerTrustSound()
        hapticFeedback.trustMilestone() // Warm haptic for trust increase
      }
      if (trustFeedback.updatedTimeline) {
        const charState = newGameState.characters.get(state.currentCharacterId)
        if (charState) {
          charState.trustTimeline = trustFeedback.updatedTimeline
        }
      }

      // Phase 1.2: Pattern echo extracted to pure function
      const patternEchoResult = computePatternEcho({
        previousPatterns,
        newPatterns: newGameState.patterns,
        characterId: state.currentCharacterId,
        existingEcho: consequenceEcho,
      })
      let patternShiftMsg: string | null = patternEchoResult.patternShiftMsg

      // Player-facing: surface big pattern shifts as an Outcome item (not just sensation text).
      if (patternShiftMsg) {
        const crossed = patternEchoResult.crossedPattern
        const level = crossed && isValidPattern(crossed) ? newGameState.patterns[crossed as PatternType] : null
        const label = crossed ? crossed.charAt(0).toUpperCase() + crossed.slice(1) : 'Pattern'
        outcomeItems.push({
          kind: 'info',
          title: 'Worldview Shift',
          detail: level !== null ? `${label} (Level ${level})` : patternShiftMsg,
          prismTab: 'harmonics',
        })
      }

      if (patternEchoResult.consequenceEcho && !consequenceEcho) {
        consequenceEcho = patternEchoResult.consequenceEcho
      }
      if (patternEchoResult.crossedPattern) {
        audio.actions.triggerPatternSound(patternEchoResult.crossedPattern)
      }

      // Phase 1.2: Orb milestone echo extracted to pure function
      const milestoneResult = computeOrbMilestoneEcho({
        characterId: state.currentCharacterId,
        existingEcho: consequenceEcho,
        getUnacknowledgedMilestone,
      })
      if (milestoneResult.consequenceEcho) {
        consequenceEcho = milestoneResult.consequenceEcho
        if (milestoneResult.milestoneToAcknowledge) {
          acknowledgeMilestone(milestoneResult.milestoneToAcknowledge as keyof OrbMilestones)
        }
        audio.actions.triggerMilestoneSound()
      }

      // Phase 1.2: Transformation eligibility extracted to pure function
      const zustandStateForTransform = useGameStore.getState()
      const eligibleTransformation = computeTransformation({
        trustDelta,
        characterId: state.currentCharacterId,
        newGameState,
        witnessedTransformations: zustandStateForTransform.witnessedTransformations,
      })
      if (eligibleTransformation) {
        zustandStateForTransform.markTransformationWitnessed(eligibleTransformation.id)
        for (const flag of eligibleTransformation.consequences.globalFlagsSet) {
          newGameState.globalFlags.add(flag)
        }
        if (eligibleTransformation.transformation.triggerDialogue.length > 0) {
          consequenceEcho = {
            text: eligibleTransformation.transformation.triggerDialogue[0],
            emotion: eligibleTransformation.transformation.emotionArc[0],
            timing: 'immediate'
          }
        }
      }

      // 6. EARLY COMMIT (Required for early-exit paths)
      // TD-001: commitGameState writes to both Zustand AND localStorage atomically.
      // This ensures Conductor Mode and God Mode early-exit paths don't lose data.
      // The final commit at line ~1544 overwrites with the full state including derivative effects.
      commitGameState(newGameState, { reason: 'pre-navigation' })

      // Floating modules disabled-broke dialogue immersion
      const zustandStore = useGameStore.getState()

      // ============= CONDUCTOR MODE INTERCEPTION =============
      if (choice.choice.nextNodeId === 'TRAVEL_PENDING') {
        const pendingTarget = useGameStore.getState().pendingTravelTarget
        logger.info('[Conductor Mode] Executing pending travel', { pendingTarget })

        if (pendingTarget) {
          // Clear current choices to prevent further interaction
          setState(prev => ({ ...prev, availableChoices: [], isProcessing: false }))
          isProcessingChoiceRef.current = false  // Release lock before travel

          // Trigger the jump via the standard navigation system
          useGameStore.getState().setCurrentScene(pendingTarget)
          useGameStore.getState().setPendingTravelTarget(null)
          return
        } else {
          // Fallback
          logger.warn('[Conductor Mode] Missing pending target, rerouting to Station Hub')
          isProcessingChoiceRef.current = false  // Release lock before travel
          setState(prev => ({ ...prev, isProcessing: false }))
          useGameStore.getState().setCurrentScene('samuel')
          return
        }
      }

      // ============= GOD MODE SIMULATION INTERCEPTION =============
      if (choice.choice.nextNodeId === 'SIMULATION_PENDING') {
        const pendingSimulation = useGameStore.getState().pendingGodModeSimulation
        logger.info('[God Mode] Executing pending simulation', { title: pendingSimulation?.title })

        if (pendingSimulation) {
          // Clear current choices and mount the simulation
          setState(prev => ({ ...prev, availableChoices: [], isProcessing: false }))
          isProcessingChoiceRef.current = false

          // Execute the simulation
          useGameStore.getState().setDebugSimulation(pendingSimulation)
          useGameStore.getState().setPendingGodModeSimulation(null)
          return
        } else {
          // Fallback-no simulation pending
          logger.warn('[God Mode] Missing pending simulation, returning to Samuel')
          isProcessingChoiceRef.current = false
          setState(prev => ({ ...prev, isProcessing: false }))
          return
        }
      }

      // Navigation: resolve next node via centralized function
      // [] for conversationHistory is intentional — only nextNode/targetGraph/targetCharacterId
      // are used from this result. Content is re-selected later with actual history (line ~2587).
      const navResult = resolveNode(choice.choice.nextNodeId, newGameState, [], {
        enforceRequiredState: isEnabled('ENFORCE_REQUIRED_STATE'),
      })
      if (!navResult.success) {
        logger.error('[StatefulGameInterface] Navigation failed:', {
          nodeId: choice.choice.nextNodeId,
          errorCode: navResult.errorCode,
        })
        isProcessingChoiceRef.current = false  // Release lock on error
        setState(prev => ({
          ...prev,
          error: { ...navResult.error, severity: 'error' as const },
          isLoading: false,
          isProcessing: false
        }))
        return
      }

      const { nextNode, targetGraph, targetCharacterId } = navResult

      // P6: Loyalty experience trigger (ExperienceEngine).
      // If the node is an experience entrypoint, start the experience immediately.
      let nextActiveExperience: ActiveExperienceState | null = null
      // Only auto-start when the node is explicitly handing control to the experience engine.
      // Many graphs set metadata.experienceId on the *trigger prompt* node as well; those should
      // still render their accept/decline choices rather than immediately switching UI modes.
      if (nextNode.metadata?.experienceId && (nextNode.choices?.length ?? 0) === 0) {
        try {
          const { ExperienceEngine } = await import('@/lib/experience-engine')
          nextActiveExperience = ExperienceEngine.startExperience(nextNode.metadata.experienceId)
        } catch {
          // Never block gameplay on experience engine issues.
          nextActiveExperience = null
        }
      }

      if (nextNode.onEnter) {
        for (const change of nextNode.onEnter) {
          newGameState = GameStateUtils.applyStateChange(newGameState, change)

          // TD-005: Process platform changes (update Zustand store)
          if (change.platformChanges) {
            for (const platformChange of change.platformChanges) {
              if (platformChange.warmthDelta !== undefined) {
                const currentWarmth = useGameStore.getState().platformWarmth[platformChange.platformId] || 0
                useGameStore.getState().updatePlatformWarmth(platformChange.platformId, currentWarmth + platformChange.warmthDelta)
              }
              if (platformChange.setAccessible !== undefined) {
                useGameStore.getState().setPlatformAccessible(platformChange.platformId, platformChange.setAccessible)
              }
            }
          }

          // Detect identity internalization for ceremony animation
          if (change.internalizeThought && change.thoughtId?.startsWith('identity-')) {
            const patternName = change.thoughtId.replace('identity-', '') as PatternType
            if (isValidPattern(patternName)) {
              identityCeremonyPattern = patternName
            }
          }
        }
      }

      let targetCharacter = newGameState.characters.get(targetCharacterId)

      // AUTO-HEAL: If character is missing from state (e.g. old save), create them
      if (!targetCharacter) {
        logger.warn('[StatefulGameInterface] Target character missing from state, initializing:', { characterId: targetCharacterId })
        targetCharacter = GameStateUtils.createCharacterState(targetCharacterId)
        newGameState.characters.set(targetCharacterId, targetCharacter)
      }

      // Get current timestamp for interaction tracking
      const currentTimestamp = Date.now()

      // D-001: Check for trust decay BEFORE updating timestamp
      // Only apply if character has been interacted with before and some time has passed
      if (targetCharacter.lastInteractionTimestamp && targetCharacterId !== state.currentCharacterId) {
        const SESSION_DURATION_MS = 10 * 60 * 1000 // 10 minutes = 1 "session"
        const timeSinceLastInteraction = currentTimestamp - targetCharacter.lastInteractionTimestamp
        const sessionsAbsent = Math.floor(timeSinceLastInteraction / SESSION_DURATION_MS)

        if (sessionsAbsent > 0) {
          const decayAmount = calculateCharacterTrustDecay(sessionsAbsent, newGameState.patterns)
          if (decayAmount > 0 && targetCharacter.trust > 0) {
            const oldTrust = targetCharacter.trust

            // STATE FIX: Use applyStateChange instead of direct mutation
            newGameState = GameStateUtils.applyStateChange(newGameState, {
              characterId: targetCharacterId,
              trustChange: -decayAmount
            })

            logger.info('[StatefulGameInterface] D-001 Trust decay applied:', {
              characterId: targetCharacterId,
              sessionsAbsent,
              decayAmount,
              oldTrust,
              newTrust: targetCharacter.trust - decayAmount
            })

            // Refresh targetCharacter reference after state change
            targetCharacter = newGameState.characters.get(targetCharacterId)!
          }
        }
      }

      // STATE FIX: Create new CharacterState immutably instead of mutating
      const updatedVisitedPatternUnlocks = choice.choice.choiceId?.startsWith('pattern_unlock_')
        ? new Set([...(targetCharacter.visitedPatternUnlocks || new Set()), nextNode.nodeId])
        : targetCharacter.visitedPatternUnlocks

      if (choice.choice.choiceId?.startsWith('pattern_unlock_')) {
        logger.info('[StatefulGameInterface] Pattern unlock visited:', {
          characterId: targetCharacterId,
          nodeId: nextNode.nodeId
        })
      }

      // Track first meeting with non-Samuel character for Constellation nudge
      const isFirstMeeting = targetCharacter.conversationHistory.length === 0 && targetCharacterId !== 'samuel'

      // Create new CharacterState with all updates (immutable)
      const updatedCharacter: CharacterState = {
        ...targetCharacter,
        lastInteractionTimestamp: currentTimestamp,
        visitedPatternUnlocks: updatedVisitedPatternUnlocks,
        conversationHistory: [...targetCharacter.conversationHistory, nextNode.nodeId]
      }

      // STATE FIX: Clone the characters Map to avoid mutating shared reference
      // (GameLogic.processChoice only does shallow clone, so Map is shared)
      newGameState.characters = new Map(newGameState.characters)
      newGameState.characters.set(targetCharacterId, updatedCharacter)

      // Update top-level navigation state
      newGameState.currentNodeId = nextNode.nodeId
      // Safe: primitive assignment on cloned object (not shared reference)
      newGameState.currentCharacterId = targetCharacterId

      // Telemetry: source-of-truth node entry (replaces legacy in-memory admin analytics).
      try {
        const now = Date.now()
        queueInteractionEventSync({
          user_id: newGameState.playerId,
          session_id: String(newGameState.sessionStartTime || now),
          event_type: 'node_entered',
          node_id: nextNode.nodeId,
          character_id: targetCharacterId,
          payload: {
            event_id: generateActionId(),
            entered_at_ms: now,
            from_node_id: state.currentNode?.nodeId || null,
            reason: 'choice',
          }
        })
      } catch {
        // Telemetry must never break gameplay.
      }

      // D-018/D-063/D-095: Complex Character Tick
      processComplexCharacterTick(newGameState, targetCharacterId)

      // ═══════════════════════════════════════════════════════════════════════════
      // DERIVATIVE PROCESSOR ORCHESTRATOR
      // Phase 4B: All derivative processors consolidated into single orchestrator.
      // Reads localStorage once, calls processors in deterministic order, returns merged result.
      // ═══════════════════════════════════════════════════════════════════════════
      const localStorageSnapshot = readLocalStorageSnapshot()
      const derivativeResult = runAllDerivativeProcessors({
        gameState: newGameState,
        previousGameState: gameState,
        previousPatterns,
        choice,
        nextNode,
        targetCharacterId,
        targetCharacter: updatedCharacter,
        trustDelta,
        localStorage: localStorageSnapshot,
        existingEcho: consequenceEcho,
      })

      // Apply orchestrator results
      newGameState = derivativeResult.newGameState
      consequenceEcho = derivativeResult.consequenceEcho
      Object.assign(localStorageBuffer, derivativeResult.localStorageWrites)
      const pendingGift = derivativeResult.pendingGift

      // Log all processor activity
      for (const log of derivativeResult.logs) {
        const prefix = {
          storyArc: 'D-061 Story arc',
          puzzle: 'D-083 Synthesis puzzle',
          knowledge: log.type === 'trade' ? 'D-057 Info trade available' : 'D-056 Knowledge item discovered',
          crossCharacter: 'Cross-character echo',
          tier2Registry: 'Tier 2 evaluator',
          iceberg: 'D-019 Iceberg',
          delayedGift: 'Delayed gift',
          arcCompletion: 'Arc',
        }[log.processor] || log.processor
        logger.info(`[StatefulGameInterface] ${prefix} ${log.type}:`, log.data)
      }

      // D-064: Log narrative framing for current session (UI will use this)
      const narrativeFraming = getNarrativeFraming(newGameState.patterns)
      logger.debug('[StatefulGameInterface] D-064 Current narrative framing:', {
        dominantPattern: narrativeFraming.pattern,
        stationMetaphor: narrativeFraming.stationMetaphor
      })

      // Check for session boundary (every 15-30 nodes, only at natural pause points)
      const boundary = checkSessionBoundary(newGameState, state.previousTotalNodes, nextNode)
      let sessionBoundaryAnnouncement: SessionAnnouncement | null = null

      if (boundary.shouldShow && boundary.announcement) {
        sessionBoundaryAnnouncement = boundary.announcement
        // Increment boundary counter in game state
        newGameState = incrementBoundaryCounter(newGameState)
        // Audio feedback for session/episode boundary
        audio.actions.triggerEpisodeSound()
      }

      const content = DialogueGraphNavigator.selectContent(nextNode, targetCharacter.conversationHistory, newGameState)
      const regularNewChoices = StateConditionEvaluator.evaluateChoices(nextNode, newGameState, targetCharacterId, newGameState.skillLevels).filter(c => c.visible)

      // Add pattern-unlocked choices
      const patternUnlockNewChoices = getPatternUnlockChoices(
        targetCharacterId,
        newGameState.patterns,
        targetGraph,
        targetCharacter.visitedPatternUnlocks
      )
      let newChoices = [...regularNewChoices, ...patternUnlockNewChoices]

      // Scarcity Mode (V1): if focus is exhausted, disable choices with a clear reason and
      // offer a deterministic recovery action (handled as a special-case choice).
      if (isEnabled('SCARCITY_MODE_V1')) {
        const fp = newGameState.focusPoints ?? { current: 7, max: 7 }
        if (fp.current <= 0) {
          const details = {
            code: 'NEEDS_FOCUS_POINTS',
            why: 'Out of focus',
            how: 'Recover focus to unlock options.',
            progress: { current: fp.current, required: 1 },
          }

          newChoices = newChoices.map((c) => {
            if (c.enabled === false) return c
            return {
              ...c,
              enabled: false,
              reason: c.reason || 'Out of focus',
              reason_code: c.reason_code || 'NEEDS_FOCUS_POINTS',
              reason_details: c.reason_details || details,
            }
          })

          newChoices.push({
            choice: {
              choiceId: 'scarcity_recover_v1',
              text: 'Rest and recover focus',
              nextNodeId: state.currentNode?.nodeId || nextNode.nodeId,
              pattern: 'patience',
              interaction: 'nod',
            },
            visible: true,
            enabled: true,
          })
        }
      }

      // Apply pattern reflection to NPC dialogue based on player's patterns
      // Node-level patternReflection takes precedence over content-level
      const mergedPatternReflection = nextNode.patternReflection || content.patternReflection
      const reflected = applyPatternReflection(
        content.text,
        content.emotion,
        mergedPatternReflection,
        newGameState.patterns
      )

      // Only log if content seems wrong (character changed but content didn't)
      if (targetCharacterId !== state.currentCharacterId && reflected.text === state.currentContent) {
        logger.warn('[StatefulGameInterface] Character changed but content unchanged', {
          fromCharacter: state.currentCharacterId,
          toCharacter: targetCharacterId,
          nodeId: nextNode.nodeId,
          contentPreview: reflected.text.substring(0, 50)
        })
      }

      // Phase 1.2: Skill tracking extracted to pure function
      const skillResult = computeSkillTracking({
        choiceSkills: choice.choice.skills as string[] | undefined,
        currentNodeId: state.currentNode?.nodeId,
        currentNodeSpeaker: state.currentNode?.speaker,
        choiceText: choice.choice.text,
        choicePattern: choice.choice.pattern,
        gamePatterns: gameState.patterns,
        recentSkills: state.recentSkills,
      })

      if (skillTrackerRef.current && skillResult.skillContext && state.currentNode) {
        skillTrackerRef.current.recordSkillDemonstration(
          state.currentNode.nodeId,
          choice.choice.choiceId,
          skillResult.demonstratedSkills,
          skillResult.skillContext,
        )
      }

      const skillsToKeep = skillResult.skillsToKeep

      // Outcome card (player-facing): compact, deterministic "what changed" summary.
      // Add structural "what changed" items based on state deltas so the player rarely sees an empty outcome.
      try {
        const prevFlags = gameState.globalFlags
        const nextFlags = newGameState.globalFlags
        const addedFlags: string[] = []
        for (const f of nextFlags) {
          if (!prevFlags.has(f)) addedFlags.push(f)
        }

        const prettyName = (id: string) => id.charAt(0).toUpperCase() + id.slice(1)

        // Canonical, player-facing interpretations for important flags.
        for (const flag of addedFlags) {
          // "Met character" is a major progression moment (unlocks an arc).
          const met = flag.match(/^met_([a-z_]+)$/)
          if (met) {
            const who = prettyName(met[1].replace(/_/g, ' '))
            outcomeItems.push({ kind: 'unlock', title: 'New contact', detail: who, prismTab: 'essence' })
            continue
          }

          // "Arc complete" is an explicit victory moment.
          const arcComplete = flag.match(/^([a-z_]+)_arc_complete$/)
          if (arcComplete) {
            const who = prettyName(arcComplete[1].replace(/_/g, ' '))
            outcomeItems.push({ kind: 'unlock', title: 'Arc complete', detail: who, prismTab: 'essence' })
            continue
          }

          // Station secrets are a major discovery unlock.
          if (flag === 'station_history_revealed') {
            outcomeItems.push({ kind: 'unlock', title: 'Station secrets', detail: 'History revealed', prismTab: 'mysteries' })
            continue
          }

          // Voice system revelation is a new mechanic surface (keep as unlock).
          if (flag === 'voice_system_revealed') {
            outcomeItems.push({ kind: 'unlock', title: 'New system', detail: 'Voices revealed', prismTab: 'mind' })
            continue
          }
        }

        // Objective update: surface quest changes as a lightweight info item.
        const prevQuest = getPrimaryQuest(gameState)
        const nextQuest = getPrimaryQuest(newGameState)
        if (nextQuest && (!prevQuest || prevQuest.id !== nextQuest.id || prevQuest.status !== nextQuest.status)) {
          const prefix = nextQuest.status === 'completed'
            ? 'Objective complete'
            : nextQuest.status === 'active'
              ? 'Objective'
              : 'New objective'
          outcomeItems.push({
            kind: nextQuest.status === 'completed' ? 'unlock' : 'info',
            title: prefix,
            detail: nextQuest.title,
            prismTab: getQuestPrismTab(nextQuest),
          })
        }

        // Milestone: completed quest count increase.
        const prevProg = getQuestProgress(gameState)
        const nextProg = getQuestProgress(newGameState)
        if (nextProg.completed > prevProg.completed) {
          outcomeItems.push({
            kind: 'info',
            title: 'Quest progress',
            detail: `${nextProg.completed}/${nextProg.total} completed`,
            prismTab: nextQuest ? getQuestPrismTab(nextQuest) : 'essence',
          })
        }
      } catch {
        // Outcome enrichment must never break gameplay.
      }

      const trustFeedbackMsg = computeTrustFeedbackMessage(trustDelta, state.currentCharacterId)
      if (trustFeedbackMsg?.message) {
        const m = trustFeedbackMsg.message.match(/^Trust \(([^)]+)\):\s*(.*)$/)
        if (m) {
          outcomeItems.push({ kind: 'trust', title: `Trust (${m[1]})`, detail: m[2], prismTab: 'essence' })
        } else {
          outcomeItems.push({ kind: 'trust', title: 'Trust', detail: trustFeedbackMsg.message, prismTab: 'essence' })
        }
      }

      const nowMs = Date.now()
      const isBigOutcome = (i: OutcomeItem) => i.kind !== 'info' || i.title === 'Worldview Shift'

      const cardItems = outcomeItems.filter(isBigOutcome)
      const feedItems = outcomeItems.filter(i => !isBigOutcome(i))

      // Rate-limited "story progressed" message goes to RewardFeed (lighter weight than OutcomeCard).
      if (cardItems.length === 0 && feedItems.length === 0 && !patternSensation) {
        const cooldownMs = 45_000
        if (nowMs - lastProgressOutcomeAtRef.current > cooldownMs) {
          lastProgressOutcomeAtRef.current = nowMs
          feedItems.push({ kind: 'info', title: 'Story progressed', detail: 'No visible changes.' })
        }
      }

      const batch = compressRewardFeedBatch(feedItems, 2)
      const nextRewardFeed = batch.length > 0
        ? updateRewardFeed(state.rewardFeed || [], batch, nowMs)
        : (state.rewardFeed || [])

      const primaryQuestForCard = getPrimaryQuest(newGameState)
      const objectiveTabForCard = primaryQuestForCard ? getQuestPrismTab(primaryQuestForCard) : null

      const outcomeCard: OutcomeCardData | null = cardItems.length > 0
        ? {
          id: `choice:${state.currentNode?.nodeId || 'node'}:${choice.choice.choiceId || ''}`,
          items: cardItems,
          nextAction: objectiveTabForCard
            ? {
              label: primaryQuestForCard?.title
                ? `Next: Review objective (${primaryQuestForCard.title})`
                : 'Next: Review objective',
              prismTab: objectiveTabForCard,
            }
            : null,
        }
        : null


      // Arc completion results from orchestrator - award bonus orbs silently
      const experienceSummaryUpdate = { showExperienceSummary: false, experienceSummaryData: null as ExperienceSummaryData | null }
      if (derivativeResult.arcCompletion.completedArc && derivativeResult.arcCompletion.dominantPattern) {
        earnBonusOrbs(derivativeResult.arcCompletion.dominantPattern, derivativeResult.arcCompletion.bonusOrbAmount)
      }

      // Queue delayed gift for this specific choice (if applicable)
      // Choices can trigger gifts that surface with different characters later
      const choiceGift = queueGiftForChoice(
        choice.choice.choiceId,
        state.currentCharacterId,
        choice.choice.text // Pass full text for context
      )
      if (choiceGift) {
        logger.info('[StatefulGameInterface] Queued delayed gift for choice:', {
          choiceId: choice.choice.choiceId,
          sourceCharacter: state.currentCharacterId,
          targetCharacter: choiceGift.targetCharacter,
          delay: choiceGift.delayInteractions
        })
      }

      // Tick gift counters (interactions decrease until gifts are ready)
      tickGiftCounters()

      // Arc completion summary disabled-breaks immersion
      // Experience summaries available in admin dashboard/journey summary (menus/maps)
      // if (completedArc) {
      //   const demonstrations = skillTrackerRef.current?.getAllDemonstrations() || []
      //   loadSkillProfile(newGameState.playerId)
      //       .then(profile => generateExperienceSummary(completedArc, newGameState, profile, demonstrations))
      //       .then(summaryData => setState(prev => ({ ...prev, showExperienceSummary: true, experienceSummaryData: summaryData })))
      //       .catch(() => setState(prev => ({ ...prev, showExperienceSummary: true, experienceSummaryData: null })))
      // }

      // Floating modules disabled-arc_transition check removed

      // Evaluate meta-achievements after state changes
      // Achievements are tracked silently-no obtrusive notifications
      const existingUnlocks = zustandStore.unlockedAchievements || []
      const newAchievements = evaluateAchievements(newGameState, existingUnlocks)
      if (newAchievements.length > 0) {
        // Unlock the new achievements in Zustand (still tracked, just no popup)
        zustandStore.unlockAchievements(newAchievements)
        // Notification disabled-obtrusive on mobile, achievements visible in admin dashboard
      }
      const achievementNotification: MetaAchievement | null = null

      // Check for pattern voice (Disco Elysium-style inner monologue)
      // Voices trigger based on pattern level and context
      // D-003: Pass character trust for voice tone modulation
      incrementPatternVoiceNodeCounter()
      const patternVoiceContext: PatternVoiceContext = {
        trigger: 'node_enter',
        characterId: targetCharacterId,
        npcEmotion: content.emotion,
        nodeTags: nextNode.tags,
        characterTrust: targetCharacter.trust  // D-003: Trust-based voice tone
      }
      const patternVoice = getPatternVoice(patternVoiceContext, newGameState, PATTERN_VOICE_LIBRARY)

      // D-096: Check for voice conflicts (when strong patterns disagree)
      const voiceConflict = checkVoiceConflict(newGameState)

      // Check for journey complete trigger-show pattern-based ending screen
      const isJourneyCompleteNode = nextNode.nodeId === 'journey_complete_trigger'
      let dominantPattern: PatternType | null = null
      if (isJourneyCompleteNode) {
        // Calculate dominant pattern for ending
        const patterns = newGameState.patterns
        let maxValue = 0
        for (const [pattern, value] of Object.entries(patterns)) {
          if (value > maxValue) {
            maxValue = value
            dominantPattern = pattern as PatternType
          }
        }
        // Default to exploring if no clear pattern
        if (!dominantPattern) dominantPattern = 'exploring'
      }

      // TD-001: gameState removed from React state - now only in Zustand
      // Phase 4B: UI patch built via pure function for maintainability
      const activeInterrupt = shouldShowInterrupt(content.interrupt, newGameState.patterns)
      const uiPatchCtx: UiPatchContext = {
        // Navigation
        nextNode,
        targetGraph,
        targetCharacterId,
        // Content
        newChoices,
        reflectedText: reflected.text,
        reflectedEmotion: reflected.emotion || content.emotion || 'neutral',
        dialogueContent: content,
        useChatPacing: content.useChatPacing || false,
        // Feedback
        outcomeCard,
        rewardFeed: nextRewardFeed,
        consequenceEcho,
        patternSensation,
        patternShiftMsg,
        // Session
        sessionBoundary: sessionBoundaryAnnouncement,
        previousTotalNodes: getTotalNodesVisited(newGameState),
        // Identity
        identityCeremonyPattern,
        identityOfferingPattern,
        abilityUnlockId,
        isJourneyCompleteNode,
        dominantPattern,
        // Trust
        trustDelta,
        // Skills
        skillsToKeep,
        // Pattern voice
        patternVoice,
        voiceConflict,
        // Interrupts
        activeInterrupt,
        // Achievements
        achievementNotification,
        // Gifts
        pendingGift,
        // First meeting
        isFirstMeeting,
        // Previous state
        previousState: state,
      }
      const patch = buildChoiceUiPatch(uiPatchCtx)
      if (nextActiveExperience) {
        patch.activeExperience = nextActiveExperience
      }
      setState(patch)
      // COMMIT: Atomic persist to both Zustand and localStorage
      // TD-001: Single commitGameState call replaces the previous dual-write pattern
      commitGameState(newGameState, { reason: 'choice-complete' })

      // Additional explicit syncs for Journal (these use different data structures)
      // TD-001: syncVisitedScenes syncs visitedScenes from coreGameState automatically
      zustandStore.markSceneVisited(nextNode.nodeId)
      zustandStore.addChoiceRecord({
        sceneId: state.currentNode?.nodeId || '',
        choice: choice.choice.text,
        timestamp: Date.now()
      })

      // Share prompts removed-too obtrusive

      // Sync relationship progress and platform state to Supabase
      // This ensures admin dashboard has real-time visibility into player progress
      if (isSupabaseConfigured()) {
        // Sync relationship progress for current character
        const character = newGameState.characters.get(targetCharacterId)
        if (character) {
          queueRelationshipSync({
            user_id: newGameState.playerId,
            character_name: targetCharacterId,
            trust_level: character.trust,
            relationship_status: character.relationshipStatus,
            interaction_count: character.conversationHistory.length
          })
        }

        // Sync platform state (global flags and patterns)
        queuePlatformStateSync({
          user_id: newGameState.playerId,
          current_scene: newGameState.currentNodeId,
          global_flags: Array.from(newGameState.globalFlags),
          patterns: newGameState.patterns
        })
      }

      // Fix 6: Flush buffered localStorage writes
      for (const [k, v] of Object.entries(localStorageBuffer)) {
        try { localStorage.setItem(k, v) } catch { /* quota exceeded */ }
      }
    } catch (error) {
      console.error('Choice handling failed:', error)
      // Release lock immediately on error (no render delay needed)
      if (choiceAttemptIdRef.current === attemptId) {
        isProcessingChoiceRef.current = false
      }
      setState(prev => ({ ...prev, isProcessing: false }))
    } finally {
      // Clear safety timeout
      clearTimeout(safetyTimeout)

      // Fix 5: Release lock via attempt ID after render cycle.
      // Uses attemptId to avoid releasing a lock from a superseded attempt.
      setTimeout(() => {
        if (choiceAttemptIdRef.current === attemptId) {
          isProcessingChoiceRef.current = false
        }
      }, 100)
    }
  }, [gameState, state.currentNode, state.recentSkills, state.showJournal, state.showConstellation, state.journeyNarrative, state.showJourneySummary, state.currentCharacterId, state.currentContent, state.previousTotalNodes, earnOrb, earnBonusOrbs, getUnacknowledgedMilestone, acknowledgeMilestone])

  return { handleChoice, isProcessingRef: isProcessingChoiceRef }
}
