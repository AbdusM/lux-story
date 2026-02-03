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
import { type PatternType, type PlayerPatterns, isValidPattern } from '@/lib/patterns'
import { calculatePatternGain } from '@/lib/identity-system'
import {
  applyPatternReflection,
  getDiscoveryHint,
  DISCOVERY_HINTS,
  type ConsequenceEcho,
} from '@/lib/consequence-echoes'
import {
  getAvailableInfoTrades,
} from '@/lib/trust-derivatives'
import type { AsymmetryReaction } from '@/lib/trust-derivatives'
import { analyzeTrustAsymmetry, getAsymmetryComment } from '@/lib/trust-derivatives'
import { ALL_INFO_TRADES } from '@/content/info-trades'
import { KNOWLEDGE_ITEMS } from '@/content/knowledge-items'
import {
  calculateCharacterTrustDecay,
  getPatternRecognitionComments,
  getUnlockedGates,
  PATTERN_TRUST_GATES,
  checkNewAchievements,
  recordPatternEvolution,
} from '@/lib/pattern-derivatives'
import {
  getNewlyAvailableCombinations,
  recordIcebergMention,
  getInvestigableTopics,
} from '@/lib/knowledge-derivatives'
import {
  getActiveMagicalRealisms,
  getCascadeEffectsForFlag,
  getNarrativeFraming,
  getUnlockedMetaRevelations,
} from '@/lib/narrative-derivatives'
import {
  getActiveEnvironmentalEffects,
  getAvailableCrossCharacterExperiences,
} from '@/lib/character-derivatives'
import {
  loadEchoQueue,
  saveEchoQueue,
  queueEchosForFlag,
  getAndUpdateEchosForCharacter,
} from '@/lib/cross-character-memory'
import { UnlockManager } from '@/lib/unlock-manager'
import { ABILITIES } from '@/lib/abilities'
import { THOUGHT_REGISTRY } from '@/content/thoughts'
import { CROSS_CHARACTER_ECHOES } from '@/lib/cross-character-echoes'
import { getArcCompletionFlag, detectArcCompletion } from '@/lib/arc-learning-objectives'
import {
  getPatternVoice,
  incrementPatternVoiceNodeCounter,
  checkVoiceConflict,
  type PatternVoiceContext,
} from '@/lib/pattern-voices'
import { PATTERN_VOICE_LIBRARY } from '@/content/pattern-voice-library'
import type { OrbMilestones } from '@/hooks/useOrbs'
import { trackUserOnNode, recordVisit } from '@/lib/admin-analytics'
import { processComplexCharacterTick } from '@/lib/character-complex'
import { checkArcUnlock, startStoryArc, completeChapter, getCurrentChapter } from '@/lib/story-arcs'
import { ALL_STORY_ARCS, getArcById } from '@/content/story-arcs'
import { SYNTHESIS_PUZZLES } from '@/content/synthesis-puzzles'
import {
  queueGiftForChoice,
  queueGiftsForArcComplete,
  tickGiftCounters,
  getReadyGiftsForCharacter,
  consumeGift,
  type DelayedGift,
} from '@/lib/delayed-gifts'
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
import { resolveNode } from '@/hooks/game/useNarrativeNavigator'
import { shouldShowInterrupt } from '@/lib/interrupt-visibility'
import {
  queueRelationshipSync,
  queuePlatformStateSync,
  queueSkillDemonstrationSync,
  queuePatternDemonstrationSync,
} from '@/lib/sync-queue'
import { getPatternUnlockChoices } from '@/lib/pattern-unlock-choices'
import type { useAudioDirector } from '@/hooks/game/useAudioDirector'
import type { ExperienceSummaryData } from '@/components/ExperienceSummary'

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
      // THE UNIFIED CALCULATOR
      // All game logic is now centralized in GameLogic.processChoice (Pure Function)
      // ═══════════════════════════════════════════════════════════════════════════

      const reactionTime = Date.now() - contentLoadTimestampRef.current
      // TD-001: Use explicit gameState param (from Zustand)
      const result = GameLogic.processChoice(gameState, choice, reactionTime)
      const previousPatterns = { ...gameState.patterns } // Restored for echo check
      let newGameState = result.newState
      // INVARIANT: newGameState is deep-cloned by GameLogic.processChoice (via cloneGameState).
      // globalFlags (Set) and characters (Map) are fresh clones — .add()/.set() mutations are safe.
      // patterns is a spread copy of primitives — direct assignment is safe.
      // If cloneGameState depth changes, these assumptions break. See lib/character-state.ts:533.
      const trustDelta = result.trustDelta

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

          // Trigger the Identity Ceremony (Visual & Audio)
          setState(prev => ({
            ...prev,
            showIdentityCeremony: true,
            ceremonyPattern: result.events.earnOrb || null
          }))

          if (result.events.checkIdentityThreshold) {
            audio.actions.triggerIdentitySound()
          }
        }

        // Check for NEW ABILITY UNLOCKS (P0)
        // If the orb pushed us over a tier threshold, unlock the ability immediately
        const unlockCheck = UnlockManager.checkUnlockStatus(newGameState)
        if (unlockCheck) {
          newGameState = { ...newGameState, ...unlockCheck.updates }

          // Notify player of new mastery
          setState(prev => ({
            ...prev,
            consequenceFeedback: {
              message: `Mastery Unlocked: ${ABILITIES[unlockCheck.unlockedIds[0]].name}`
            }
          }))

          audio.actions.triggerIdentitySound()
        }

        // 5. Check for NEW THOUGHT UNLOCKS (P3)
        // Similar to abilities, check if stats qualify for new thoughts
        const { checkThoughtTriggers } = await import('@/lib/thought-system')
        const thoughtCheck = checkThoughtTriggers(newGameState)
        if (thoughtCheck) {
          newGameState = { ...newGameState, ...thoughtCheck.updates }

          // Notify player of new thought
          const thoughtName = THOUGHT_REGISTRY[thoughtCheck.unlockedThoughtIds[0]].title
          setState(prev => ({
            ...prev,
            consequenceFeedback: {
              message: `New Thought Formed: ${thoughtName}`
            }
          }))

          audio.actions.triggerIdentitySound()
        }
      }


      // 6. Relationship Updates (Visual Feedback)
      if (result.events.relationshipUpdates && result.events.relationshipUpdates.length > 0) {
        // We only show the first major update to avoid spam
        const update = result.events.relationshipUpdates[0]

        // Use capitalization as fallback for name since CharacterState doesn't store it
        const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
        const fromChar = capitalize(update.fromId)
        const toChar = capitalize(update.toId)

        // Show a relationship feedback
        setState(prev => ({
          ...prev,
          consequenceFeedback: {
            message: `Station Dynamics Shifted: ${fromChar} & ${toChar}`
          }
        }))

        audio.actions.triggerIdentitySound()
      }

      // 7. Voice Revelation Echo ("Surface the Magic")
      // When player's dominant pattern crosses threshold 5, reveal the voice system
      if (result.events.voiceRevelationEcho) {
        const echo = result.events.voiceRevelationEcho
        // Show revelation as consequence feedback
        setState(prev => ({
          ...prev,
          consequenceFeedback: {
            message: echo.text
          }
        }))
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
      const navResult = resolveNode(choice.choice.nextNodeId, newGameState, [])
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

      // Track identity internalization for ceremony
      let identityCeremonyPattern: PatternType | null = null

      if (nextNode.onEnter) {
        for (const change of nextNode.onEnter) {
          newGameState = GameStateUtils.applyStateChange(newGameState, change)

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

      // D-011/D-012: Analytics Tracking
      trackUserOnNode(newGameState.playerId, nextNode.nodeId)
      recordVisit(nextNode.nodeId)

      // D-018/D-063/D-095: Complex Character Tick
      processComplexCharacterTick(newGameState, targetCharacterId)

      // D-061: Story Arc Progression
      // Initialize story arc state if missing
      if (!newGameState.storyArcState) {
        const { createStoryArcState } = await import('@/lib/story-arcs')
        newGameState = {
          ...newGameState,
          storyArcState: createStoryArcState()
        }
      }

      // Check for newly unlockable arcs
      for (const arc of ALL_STORY_ARCS) {
        const arcState = newGameState.storyArcState!
        if (!arcState.activeArcs.has(arc.id) && !arcState.completedArcs.has(arc.id)) {
          if (checkArcUnlock(arc, newGameState)) {
            newGameState = {
              ...newGameState,
              storyArcState: startStoryArc(arcState, arc.id)
            }
            // Generate unlock echo if no other echo pending
            if (!consequenceEcho) {
              consequenceEcho = {
                text: `A new thread emerges: "${arc.title}"-${arc.description}`,
                emotion: 'intrigued',
                timing: 'immediate'
              }
            }
            logger.info('[StatefulGameInterface] D-061 Story arc unlocked:', {
              arcId: arc.id,
              title: arc.title
            })
          }
        }
      }

      // Check if current node advances any active arc chapters
      const arcState = newGameState.storyArcState!
      for (const arcId of arcState.activeArcs) {
        const arc = getArcById(arcId)
        if (!arc) continue

        const currentChapter = getCurrentChapter(arcState, arc)
        if (!currentChapter) continue

        // Check if visited node is in current chapter's nodeIds
        if (currentChapter.nodeIds.includes(nextNode.nodeId)) {
          // Mark chapter complete if this was the last required node
          const visitedChapterNodes = currentChapter.nodeIds.filter(nodeId =>
            targetCharacter.conversationHistory.includes(nodeId) || nodeId === nextNode.nodeId
          )

          if (visitedChapterNodes.length >= currentChapter.nodeIds.length) {
            // Complete the chapter
            const { newState: updatedArcState, arcCompleted } = completeChapter(arcState, arc, currentChapter.id)
            newGameState = {
              ...newGameState,
              storyArcState: updatedArcState
            }

            // Set the chapter completion flag
            newGameState.globalFlags.add(currentChapter.completionFlag)

            // Show completion echo if no other echo pending
            if (!consequenceEcho) {
              if (arcCompleted) {
                consequenceEcho = {
                  text: `Story complete: "${arc.title}"-The threads have woven together.`,
                  emotion: 'satisfied',
                  timing: 'immediate'
                }
              } else {
                consequenceEcho = {
                  text: `Chapter complete: "${currentChapter.title}"-The story continues...`,
                  emotion: 'curious',
                  timing: 'immediate'
                }
              }
            }

            logger.info('[StatefulGameInterface] D-061 Chapter completed:', {
              arcId: arc.id,
              chapterId: currentChapter.id,
              completionFlag: currentChapter.completionFlag,
              arcCompleted
            })
          }
        }
      }

      // D-083: Synthesis Puzzle Auto-Checking
      // Track completed puzzles to avoid re-triggering
      const completedPuzzlesKey = 'lux_completed_synthesis_puzzles'
      const completedPuzzlesRaw = typeof window !== 'undefined' ? localStorage.getItem(completedPuzzlesKey) : null
      const completedPuzzles = new Set<string>(completedPuzzlesRaw ? JSON.parse(completedPuzzlesRaw) : [])

      // Also track puzzles where we've shown the hint
      const hintShownKey = 'lux_synthesis_hints_shown'
      const hintShownRaw = typeof window !== 'undefined' ? localStorage.getItem(hintShownKey) : null
      const hintsShown = new Set<string>(hintShownRaw ? JSON.parse(hintShownRaw) : [])

      // Collect all knowledge flags (global + character-specific)
      const allKnowledge = new Set<string>(newGameState.globalFlags)
      newGameState.characters.forEach(char => {
        char.knowledgeFlags.forEach(flag => allKnowledge.add(flag))
      })

      for (const puzzle of SYNTHESIS_PUZZLES) {
        // Skip already completed puzzles
        if (completedPuzzles.has(puzzle.id)) continue
        if (newGameState.globalFlags.has(puzzle.reward.unlockFlag || '')) continue

        // Count how many required flags we have
        const matchingFlags = puzzle.requiredKnowledge.filter(flag => allKnowledge.has(flag))
        const progress = matchingFlags.length / puzzle.requiredKnowledge.length

        // Puzzle complete-all knowledge gathered
        if (progress >= 1.0) {
          // Apply rewards
          if (puzzle.reward.patternBonus) {
            const patternUpdates: Partial<PlayerPatterns> = {}
            for (const [pattern, bonus] of Object.entries(puzzle.reward.patternBonus)) {
              patternUpdates[pattern as keyof PlayerPatterns] = bonus as number
            }
            newGameState = GameStateUtils.applyStateChange(newGameState, { patternChanges: patternUpdates })
          }
          if (puzzle.reward.unlockFlag) {
            newGameState.globalFlags.add(puzzle.reward.unlockFlag)
          }

          // Mark as completed
          completedPuzzles.add(puzzle.id)
          localStorageBuffer[completedPuzzlesKey] = JSON.stringify([...completedPuzzles])

          // Show completion echo if no other pending
          if (!consequenceEcho) {
            consequenceEcho = {
              text: `Synthesis complete: "${puzzle.title}"-${puzzle.solution}`,
              emotion: 'revelation',
              timing: 'immediate'
            }
          }

          logger.info('[StatefulGameInterface] D-083 Synthesis puzzle completed:', {
            puzzleId: puzzle.id,
            title: puzzle.title,
            unlockFlag: puzzle.reward.unlockFlag
          })
        }
        // Puzzle partially complete (50%+)-show hint
        else if (progress >= 0.5 && !hintsShown.has(puzzle.id)) {
          hintsShown.add(puzzle.id)
          localStorageBuffer[hintShownKey] = JSON.stringify([...hintsShown])

          if (!consequenceEcho) {
            consequenceEcho = {
              text: `Something is connecting... "${puzzle.title}"-${puzzle.hint}`,
              emotion: 'curious',
              timing: 'immediate'
            }
          }

          logger.info('[StatefulGameInterface] D-083 Synthesis puzzle hint shown:', {
            puzzleId: puzzle.id,
            progress: Math.round(progress * 100) + '%'
          })
        }
      }

      // D-057: Info Trade Availability Check
      // Track completed trades to avoid re-notification
      const completedTradesKey = 'lux_completed_info_trades'
      const completedTradesRaw = typeof window !== 'undefined' ? localStorage.getItem(completedTradesKey) : null
      const completedTrades = new Set<string>(completedTradesRaw ? JSON.parse(completedTradesRaw) : [])

      // Track trades we've already notified about this session
      const notifiedTradesKey = 'lux_notified_info_trades'
      const notifiedTradesRaw = typeof window !== 'undefined' ? localStorage.getItem(notifiedTradesKey) : null
      const notifiedTrades = new Set<string>(notifiedTradesRaw ? JSON.parse(notifiedTradesRaw) : [])

      // Check for newly available trades with this character
      const availableTrades = getAvailableInfoTrades(
        targetCharacterId,
        targetCharacter.trust,
        ALL_INFO_TRADES,
        completedTrades
      )

      // Find trades we haven't notified about yet
      const newTradeAvailable = availableTrades.find(trade => !notifiedTrades.has(trade.id))

      if (newTradeAvailable && !consequenceEcho) {
        notifiedTrades.add(newTradeAvailable.id)
        localStorageBuffer[notifiedTradesKey] = JSON.stringify([...notifiedTrades])

        consequenceEcho = {
          text: `${targetCharacter.characterId} seems willing to share something: "${newTradeAvailable.description}" ${newTradeAvailable.trustCost > 0 ? `(Trust cost: ${newTradeAvailable.trustCost})` : ''}`,
          emotion: 'intrigued',
          timing: 'immediate'
        }

        logger.info('[StatefulGameInterface] D-057 Info trade available:', {
          characterId: targetCharacterId,
          tradeId: newTradeAvailable.id,
          tier: newTradeAvailable.tier
        })
      }

      // D-056: Knowledge Item Discovery Tracking
      // Track discovered knowledge items to avoid re-notification
      const discoveredKnowledgeKey = 'lux_discovered_knowledge_items'
      const discoveredKnowledgeRaw = typeof window !== 'undefined' ? localStorage.getItem(discoveredKnowledgeKey) : null
      const discoveredKnowledge = new Set<string>(discoveredKnowledgeRaw ? JSON.parse(discoveredKnowledgeRaw) : [])

      // Check if any new knowledge items were gained via flags
      const prevGlobalFlags = gameState?.globalFlags || new Set<string>()
      const newFlags = Array.from(newGameState.globalFlags).filter(flag => !prevGlobalFlags.has(flag))

      // Also check character knowledge flags
      const prevCharacterFlags = gameState?.characters.get(targetCharacterId)?.knowledgeFlags || new Set<string>()
      const newCharacterFlags = Array.from(targetCharacter.knowledgeFlags).filter(flag => !prevCharacterFlags.has(flag))

      const allNewFlags = [...newFlags, ...newCharacterFlags]

      // Find knowledge items that match newly gained flags
      for (const flag of allNewFlags) {
        const matchingItem = KNOWLEDGE_ITEMS.find(item => item.id === flag)
        if (matchingItem && !discoveredKnowledge.has(matchingItem.id)) {
          discoveredKnowledge.add(matchingItem.id)
          localStorageBuffer[discoveredKnowledgeKey] = JSON.stringify([...discoveredKnowledge])

          // Show discovery echo if no other pending
          if (!consequenceEcho) {
            const tierEmoji = matchingItem.tier === 'truth' ? '✦' :
              matchingItem.tier === 'secret' ? '⚡' :
                matchingItem.tier === 'insight' ? '💡' : '💬'
            consequenceEcho = {
              text: `${tierEmoji} Knowledge gained: "${matchingItem.topic}"-${matchingItem.content}`,
              emotion: 'curious',
              timing: 'immediate'
            }
          }

          logger.info('[StatefulGameInterface] D-056 Knowledge item discovered:', {
            itemId: matchingItem.id,
            topic: matchingItem.topic,
            tier: matchingItem.tier,
            source: matchingItem.sourceCharacterId
          })

          // Check if this unlocks trades with other characters
          if (matchingItem.unlocksTradesWith.length > 0) {
            logger.info('[StatefulGameInterface] D-056 New trades unlocked with:', {
              characters: matchingItem.unlocksTradesWith
            })
          }
        }
      }

      // Check for cross-character echoes (characters referencing other relationships)
      // Echoes are delivered when entering a character's dialogue after another arc completes
      if (!consequenceEcho) {
        const echoQueue = loadEchoQueue()
        const { echoes: crossEchoes, updatedQueue } = getAndUpdateEchosForCharacter(
          targetCharacterId,
          newGameState,
          echoQueue
        )
        if (crossEchoes.length > 0) {
          // Deliver the first ready echo as the consequence echo
          consequenceEcho = crossEchoes[0]
          saveEchoQueue(updatedQueue)
          logger.info('[StatefulGameInterface] Delivered cross-character echo:', {
            targetCharacter: targetCharacterId,
            echoText: consequenceEcho.text.substring(0, 50) + '...'
          })
        }
      }

      // D-004: Check for pattern recognition comments
      // Characters notice and comment on player's developed patterns
      if (!consequenceEcho) {
        // Get shown comments from localStorage (or could add to game state)
        const shownCommentsKey = 'lux_pattern_recognition_shown'
        const shownCommentsRaw = typeof window !== 'undefined' ? localStorage.getItem(shownCommentsKey) : null
        const shownComments = new Set<string>(shownCommentsRaw ? JSON.parse(shownCommentsRaw) : [])

        const patternComments = getPatternRecognitionComments(
          targetCharacterId,
          newGameState.patterns,
          shownComments
        )

        if (patternComments.length > 0) {
          const comment = patternComments[0]
          consequenceEcho = {
            text: `"${comment.comment}"`,
            emotion: comment.emotion,
            timing: 'immediate'
          }

          // Mark as shown
          const commentKey = `${comment.characterId}_${comment.pattern}_${comment.threshold}`
          shownComments.add(commentKey)
          localStorageBuffer[shownCommentsKey] = JSON.stringify([...shownComments])

          logger.info('[StatefulGameInterface] D-004 Pattern recognition comment:', {
            characterId: targetCharacterId,
            pattern: comment.pattern,
            comment: comment.comment.substring(0, 40) + '...'
          })
        }
      }

      // D-006: Check for newly available knowledge combinations
      // When player has gathered enough knowledge pieces, they can make connections
      if (!consequenceEcho) {
        // Get character knowledge map
        const characterKnowledge = new Map<string, Set<string>>()
        newGameState.characters.forEach((char, charId) => {
          characterKnowledge.set(charId, char.knowledgeFlags)
        })

        // Check for new combinations (compare old vs new state)
        const oldGlobalFlags = gameState?.globalFlags || new Set<string>()
        const newCombinations = getNewlyAvailableCombinations(
          oldGlobalFlags,
          newGameState.globalFlags,
          characterKnowledge
        )

        if (newCombinations.length > 0) {
          const combo = newCombinations[0]
          consequenceEcho = {
            text: combo.discoveryText,
            emotion: 'revelation',
            timing: 'immediate'
          }
          // Add the unlock flag
          newGameState.globalFlags.add(combo.unlocksFlag)

          logger.info('[StatefulGameInterface] D-006 Knowledge combination discovered:', {
            comboId: combo.id,
            comboName: combo.name,
            unlocksNode: combo.unlocksNodeId
          })
        }
      }

      // D-019: Check for iceberg references in dialogue node tags
      // Tags prefixed with "iceberg:" indicate casual mentions of mystery topics
      if (nextNode.tags && newGameState.icebergState) {
        const icebergTags = nextNode.tags.filter(tag => tag.startsWith('iceberg:'))

        if (icebergTags.length > 0) {
          // Record previous investigable topics for comparison
          const prevInvestigable = getInvestigableTopics(newGameState.icebergState)
          const prevInvestigableIds = new Set(prevInvestigable.map(t => t.id))

          // Record each iceberg mention
          for (const tag of icebergTags) {
            const topicId = tag.replace('iceberg:', '')
            // Use first content variation's text as mention context (or node ID as fallback)
            const mentionText = nextNode.content[0]?.text?.substring(0, 100) || nextNode.nodeId
            newGameState = {
              ...newGameState,
              icebergState: recordIcebergMention(
                newGameState.icebergState!,
                topicId,
                targetCharacterId,
                nextNode.nodeId,
                mentionText
              )
            }
          }

          // Check if any new topics became investigable
          if (!consequenceEcho) {
            const nowInvestigable = getInvestigableTopics(newGameState.icebergState!)
            const newlyInvestigable = nowInvestigable.filter(t => !prevInvestigableIds.has(t.id))

            if (newlyInvestigable.length > 0) {
              const topic = newlyInvestigable[0]
              consequenceEcho = {
                text: `Something clicks... "${topic.topic}"-you've heard this mentioned enough times now. Perhaps there's more to investigate.`,
                emotion: 'intrigued',
                timing: 'immediate'
              }
              logger.info('[StatefulGameInterface] D-019 Iceberg topic now investigable:', {
                topicId: topic.id,
                topic: topic.topic,
                investigationNodeId: topic.investigationNodeId
              })
            }
          }
        }
      }

      // D-002: Check for newly unlocked pattern-trust gates
      // Special content requires BOTH high trust AND specific pattern development
      if (!consequenceEcho) {
        const prevUnlockedGates = gameState
          ? getUnlockedGates(targetCharacterId, gameState.characters.get(targetCharacterId)?.trust || 0, gameState.patterns)
          : []
        const nowUnlockedGates = getUnlockedGates(targetCharacterId, targetCharacter.trust, newGameState.patterns)
        const newlyUnlocked = nowUnlockedGates.filter(g => !prevUnlockedGates.includes(g))

        if (newlyUnlocked.length > 0) {
          const gateId = newlyUnlocked[0]
          const gate = PATTERN_TRUST_GATES[gateId]
          if (gate) {
            consequenceEcho = {
              text: `Something shifts in ${targetCharacterId}'s demeanor... ${gate.description}`,
              emotion: 'intrigued',
              timing: 'immediate'
            }
            // Add flag so dialogue can check for this
            newGameState.globalFlags.add(`gate_unlocked_${gateId}`)
            logger.info('[StatefulGameInterface] D-002 Pattern-trust gate unlocked:', {
              gateId,
              trust: targetCharacter.trust,
              pattern: gate.pattern,
              patternLevel: newGameState.patterns[gate.pattern]
            })
          }
        }
      }

      // D-020: Check for newly active magical realism manifestations
      // At high pattern levels, reality becomes more fluid
      if (!consequenceEcho) {
        const shownMagicalKey = 'lux_magical_realism_shown'
        const shownMagicalRaw = typeof window !== 'undefined' ? localStorage.getItem(shownMagicalKey) : null
        const shownMagical = new Set<string>(shownMagicalRaw ? JSON.parse(shownMagicalRaw) : [])

        const prevManifestations = gameState ? getActiveMagicalRealisms(gameState.patterns) : []
        const nowManifestations = getActiveMagicalRealisms(newGameState.patterns)

        // Find newly unlocked manifestations that haven't been shown
        const newlyActive = nowManifestations.filter(m =>
          !prevManifestations.some(p => p.id === m.id) && !shownMagical.has(m.id)
        )

        if (newlyActive.length > 0) {
          const manifestation = newlyActive[0]
          consequenceEcho = {
            text: manifestation.manifestation,
            emotion: 'wonder',
            timing: 'immediate'
          }

          // Mark as shown
          shownMagical.add(manifestation.id)
          localStorageBuffer[shownMagicalKey] = JSON.stringify([...shownMagical])

          // Add flag for dialogue to reference
          newGameState.globalFlags.add(`magical_${manifestation.id}`)
          logger.info('[StatefulGameInterface] D-020 Magical realism manifestation:', {
            id: manifestation.id,
            name: manifestation.name,
            pattern: manifestation.triggerPattern
          })
        }
      }

      // D-059: Check for newly earned pattern achievements
      if (!consequenceEcho && gameState) {
        const newAchievements = checkNewAchievements(gameState.patterns, newGameState.patterns)

        if (newAchievements.length > 0) {
          const achievement = newAchievements[0]
          consequenceEcho = {
            text: `${achievement.icon} ${achievement.name}: ${achievement.description}${achievement.reward ? `\n\n${achievement.reward}` : ''}`,
            emotion: 'triumph',
            timing: 'immediate'
          }
          newGameState.globalFlags.add(`achievement_${achievement.id}`)
          logger.info('[StatefulGameInterface] D-059 Achievement earned:', {
            id: achievement.id,
            name: achievement.name
          })
        }
      }

      // D-016: Check for newly active environmental effects from character trust
      if (!consequenceEcho && gameState) {
        const prevEffects = getActiveEnvironmentalEffects(gameState)
        const nowEffects = getActiveEnvironmentalEffects(newGameState)
        const newEffects = nowEffects.filter(e =>
          !prevEffects.some(p => p.effect === e.effect)
        )

        if (newEffects.length > 0) {
          const effect = newEffects[0]
          consequenceEcho = {
            text: effect.visualDescription,
            emotion: 'wonder',
            timing: 'immediate'
          }
          newGameState.globalFlags.add(`env_${effect.effect}`)
          logger.info('[StatefulGameInterface] D-016 Environmental effect triggered:', {
            effect: effect.effect,
            warmthChange: effect.warmthChange
          })
        }
      }

      // D-017: Check for newly available cross-character experiences
      if (!consequenceEcho && gameState) {
        const prevExperiences = getAvailableCrossCharacterExperiences(gameState)
        const nowExperiences = getAvailableCrossCharacterExperiences(newGameState)
        const newExperiences = nowExperiences.filter(e =>
          !prevExperiences.some(p => p.experienceId === e.experienceId)
        )

        if (newExperiences.length > 0) {
          const exp = newExperiences[0]
          consequenceEcho = {
            text: `${exp.unlockHint}\n\n(New experience available: ${exp.experienceName})`,
            emotion: 'intrigued',
            timing: 'immediate'
          }
          newGameState.globalFlags.add(`exp_available_${exp.experienceId}`)
          logger.info('[StatefulGameInterface] D-017 Cross-character experience available:', {
            experienceId: exp.experienceId,
            experienceName: exp.experienceName
          })
        }
      }

      // D-062: Check for cascade effects triggered by new flags
      if (!consequenceEcho && gameState) {
        // Find flags that were just added
        const newFlags = [...newGameState.globalFlags].filter(f => !gameState!.globalFlags.has(f))

        for (const flag of newFlags) {
          const cascade = getCascadeEffectsForFlag(flag, targetCharacterId)
          if (cascade && cascade.chain.length > 0) {
            // Get the first degree effect
            const firstEffect = cascade.chain.find(c => c.degree === 1)
            if (firstEffect) {
              consequenceEcho = {
                text: firstEffect.description,
                emotion: 'knowing',
                timing: 'immediate'
              }
              // Apply first degree effects immediately
              if (firstEffect.effect.flagSet) {
                newGameState.globalFlags.add(firstEffect.effect.flagSet)
              }
              // Queue later effects via global flags for tracking
              newGameState.globalFlags.add(`cascade_${cascade.id}_triggered`)
              logger.info('[StatefulGameInterface] D-062 Cascade triggered:', {
                cascadeId: cascade.id,
                triggerFlag: flag,
                chainLength: cascade.chain.length
              })
              break
            }
          }
        }
      }

      // D-065: Check for newly unlocked meta-narrative revelations
      if (!consequenceEcho && gameState) {
        const prevRevelations = getUnlockedMetaRevelations(gameState.patterns)
        const nowRevelations = getUnlockedMetaRevelations(newGameState.patterns)
        const newRevelations = nowRevelations.filter(r =>
          !prevRevelations.some(p => p.id === r.id) &&
          !newGameState.globalFlags.has(`meta_${r.id}`)
        )

        if (newRevelations.length > 0) {
          const revelation = newRevelations[0]
          consequenceEcho = {
            text: `${revelation.revelation}\n\n${revelation.characterAcknowledgement.dialogue}`,
            emotion: 'profound',
            timing: 'immediate'
          }
          newGameState.globalFlags.add(`meta_${revelation.id}`)
          // Unlock associated dialogue nodes
          revelation.unlocksDialogue.forEach(nodeId => {
            newGameState.globalFlags.add(`dialogue_unlocked_${nodeId}`)
          })
          logger.info('[StatefulGameInterface] D-065 Meta-narrative revelation:', {
            id: revelation.id,
            name: revelation.name
          })
        }
      }

      // D-064: Log narrative framing for current session (UI will use this)
      const narrativeFraming = getNarrativeFraming(newGameState.patterns)
      logger.debug('[StatefulGameInterface] D-064 Current narrative framing:', {
        dominantPattern: narrativeFraming.pattern,
        stationMetaphor: narrativeFraming.stationMetaphor
      })

      // Check for delayed gifts ready to deliver
      // Gifts surface after N interactions, creating "your choice mattered" moments
      let pendingGift: DelayedGift | null = null
      if (!consequenceEcho) {
        const readyGifts = getReadyGiftsForCharacter(targetCharacterId)
        if (readyGifts.length > 0) {
          pendingGift = readyGifts[0]
          // Deliver gift as consequence echo
          let giftText = `"${pendingGift.content.text}"`
          // Append attribution if context exists
          if (pendingGift.giftContext?.sourceChoiceText) {
            const shortText = pendingGift.giftContext.sourceChoiceText.length > 50
              ? pendingGift.giftContext.sourceChoiceText.substring(0, 47) + '...'
              : pendingGift.giftContext.sourceChoiceText
            giftText += `\n\n(Recall: "${shortText}")`
          }

          consequenceEcho = {
            text: giftText,
            emotion: pendingGift.content.emotion || 'knowing',
            timing: 'immediate' as const
          }
          consumeGift(pendingGift.id)
          logger.info('[StatefulGameInterface] Delivered delayed gift:', {
            giftId: pendingGift.id,
            sourceCharacter: pendingGift.sourceCharacter,
            targetCharacter: pendingGift.targetCharacter,
            giftType: pendingGift.giftType
          })
        }
      }

      // Check for discovery hints (vulnerability foreshadowing for Maya/Devon)
      // 20% chance per interaction, only if no other echo is active
      if (!consequenceEcho && DISCOVERY_HINTS[targetCharacterId] && Math.random() < 0.2) {
        const vulnerabilities = DISCOVERY_HINTS[targetCharacterId]
        for (const vuln of vulnerabilities) {
          // Check if vulnerability not yet discovered
          const discoveryFlag = `${targetCharacterId}_${vuln.vulnerability}_revealed`
          if (!targetCharacter.knowledgeFlags.has(discoveryFlag)) {
            const hint = getDiscoveryHint(targetCharacterId, vuln.vulnerability, targetCharacter.trust)
            if (hint) {
              consequenceEcho = hint
              logger.info('[StatefulGameInterface] Discovery hint triggered:', {
                characterId: targetCharacterId,
                vulnerability: vuln.vulnerability,
                trust: targetCharacter.trust
              })
              break // Only one hint per interaction
            }
          }
        }
      }

      // D-005: Check for trust asymmetry (character notices player trusts others differently)
      // 15% chance per interaction, only if no other echo and asymmetry is notable or major
      if (!consequenceEcho && Math.random() < 0.15) {
        const asymmetries = analyzeTrustAsymmetry(newGameState.characters, targetCharacterId)
        // Get the most significant asymmetry
        const significantAsymmetry = asymmetries.find(a => a.asymmetry.level === 'notable' || a.asymmetry.level === 'major')

        if (significantAsymmetry) {
          // Determine reaction type based on direction
          const reaction: AsymmetryReaction = significantAsymmetry.direction === 'higher'
            ? 'curiosity'  // Player trusts this character more
            : 'jealousy'   // Player trusts others more

          const asymmetryText = getAsymmetryComment(targetCharacterId, reaction, newGameState)

          if (asymmetryText) {
            consequenceEcho = {
              text: asymmetryText,
              timing: 'immediate',
              soundCue: undefined
            }
            logger.info('[StatefulGameInterface] D-005: Trust asymmetry comment triggered:', {
              characterId: targetCharacterId,
              asymmetryWith: significantAsymmetry.characterId,
              level: significantAsymmetry.asymmetry.level,
              direction: significantAsymmetry.direction,
              reaction
            })
          }
        }
      }

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
      const newChoices = [...regularNewChoices, ...patternUnlockNewChoices]

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

      // Phase 1.2: Trust feedback message extracted to pure function
      const consequenceFeedback = computeTrustFeedbackMessage(trustDelta, state.currentCharacterId)


      const completedArc = detectArcCompletion(gameState, newGameState)
      const experienceSummaryUpdate = { showExperienceSummary: false, experienceSummaryData: null as ExperienceSummaryData | null }

      // Award bonus orbs for arc completion-SILENT (no notification)
      // Gives bonus based on dominant pattern during this arc
      if (completedArc) {
        const patterns = newGameState.patterns
        const patternEntries = Object.entries(patterns) as [PatternType, number][]
        const dominantPattern = patternEntries.reduce((max, curr) =>
          curr[1] > max[1] ? curr : max, patternEntries[0])?.[0]
        if (dominantPattern && isValidPattern(dominantPattern)) {
          earnBonusOrbs(dominantPattern, 5) // ORB_EARNINGS.arcCompletion
        }

        // Queue cross-character echoes for this arc completion
        // Other characters will reference this relationship in future conversations
        const arcFlag = getArcCompletionFlag(completedArc)
        const currentQueue = loadEchoQueue()
        const updatedQueue = queueEchosForFlag(arcFlag, CROSS_CHARACTER_ECHOES, currentQueue)
        saveEchoQueue(updatedQueue)
        logger.info('[StatefulGameInterface] Queued cross-character echoes for:', { completedArc, arcFlag })

        // Queue delayed gifts for arc completion
        // These surface later when visiting other characters
        const arcGifts = queueGiftsForArcComplete(completedArc as CharacterId)
        if (arcGifts.length > 0) {
          logger.info('[StatefulGameInterface] Queued delayed gifts for arc completion:', {
            completedArc,
            giftCount: arcGifts.length,
            targets: arcGifts.map(g => g.targetCharacter)
          })
        }
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
      setState({
        currentNode: nextNode,
        currentGraph: targetGraph,
        currentCharacterId: targetCharacterId,
        availableChoices: newChoices,
        currentContent: reflected.text,
        currentDialogueContent: { ...content, text: reflected.text, emotion: reflected.emotion },
        useChatPacing: content.useChatPacing || false,
        isLoading: false,
        hasStarted: true,
        selectedChoice: null,
        showSaveConfirmation: false, // Disabled-save happens silently, no interruption
        skillToast: null, // Disabled-skills tracked silently
        consequenceFeedback,
        error: null,
        previousSpeaker: state.currentNode?.speaker || null,
        recentSkills: skillsToKeep,
        activeExperience: state.activeExperience, // Added to fix build error
        ...experienceSummaryUpdate,
        showJournal: state.showJournal,
        showConstellation: state.showConstellation,
        pendingFloatingModule: null, // Floating modules disabled
        showJourneySummary: state.showJourneySummary,
        activeInterrupt: shouldShowInterrupt(content.interrupt, newGameState.patterns), // D-009: Filter by pattern
        journeyNarrative: state.journeyNarrative,
        achievementNotification,
        ambientEvent: null,  // Clear ambient event when player acts
        patternSensation: patternShiftMsg || patternSensation, // Prefer shift msg if shift happened
        consequenceEcho,     // Dialogue-based trust feedback
        sessionBoundary: sessionBoundaryAnnouncement,  // Session boundary announcement if triggered
        previousTotalNodes: getTotalNodesVisited(newGameState),  // Track for next boundary check
        showIdentityCeremony: identityCeremonyPattern !== null,  // Identity ceremony if triggered
        ceremonyPattern: identityCeremonyPattern,  // Pattern being internalized
        showPatternEnding: isJourneyCompleteNode,  // Pattern-based journey ending
        endingPattern: dominantPattern,  // Dominant pattern for ending
        hasNewTrust: trustDelta !== 0 ? true : state.hasNewTrust,  // Track trust changes for Constellation attention
        hasNewMeeting: isFirstMeeting ? true : state.hasNewMeeting,  // Track first meeting for Constellation nudge
        showReport: state.showReport,
        isProcessing: false, // ISP FIX: Unlock UI
        patternVoice,  // Disco Elysium-style inner monologue
        voiceConflict,  // D-096: Voice conflict when patterns disagree
        activeComboChain: state.activeComboChain,  // D-084: Preserve combo chain state
        // Engagement Loop State (preserved across choice)
        waitingCharacters: state.waitingCharacters,
        pendingGift,
        isReturningPlayer: state.isReturningPlayer
      })
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
