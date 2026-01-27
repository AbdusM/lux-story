/* eslint-disable react-hooks/exhaustive-deps -- initializeGame intentionally uses empty deps to prevent re-creation */
'use client'

import { useCallback, type Dispatch, type SetStateAction, type RefObject } from 'react'
import type { GameInterfaceState } from '@/lib/game-interface-types'
import type { DialogueGraph } from '@/lib/dialogue-graph'
import type { CharacterId } from '@/lib/graph-registry'
import { GameStateUtils, type GameState } from '@/lib/character-state'
import { GameLogic } from '@/lib/game-logic'
import { GameStateManager } from '@/lib/game-state-manager'
import {
  DialogueGraphNavigator,
  StateConditionEvaluator,
} from '@/lib/dialogue-graph'
import {
  getGraphForCharacter,
  findCharacterForNode,
  getSafeStart,
} from '@/lib/graph-registry'
import { generateUserId } from '@/lib/safe-storage'
import { isSupabaseConfigured } from '@/lib/supabase'
import { useGameStore } from '@/lib/game-store'
import { useStationStore } from '@/lib/station-state'
import { SkillTracker } from '@/lib/skill-tracker'
import { CheckInQueue } from '@/lib/character-check-ins'
import { UnlockManager } from '@/lib/unlock-manager'
import { logger } from '@/lib/logger'
import { trackUserOnNode, recordVisit } from '@/lib/admin-analytics'
import { shouldShowInterrupt } from '@/lib/interrupt-visibility'
import { applyPatternReflection, resolveContentVoiceVariation, applySkillReflection, applyNervousSystemReflection, type ConsequenceEcho } from '@/lib/consequence-echoes'
import { calculateInheritedTrust } from '@/lib/trust-derivatives'
import { getPatternUnlockChoices } from '@/lib/pattern-unlock-choices'
import { selectAnnouncement } from '@/lib/platform-announcements'
import { getTotalNodesVisited } from '@/lib/session-structure'
import { detectReturningPlayer, getWaitingCharacters, getSamuelWaitingSummary } from '@/lib/character-waiting'
import { calculateSkillDecay, getSkillDecayNarrative } from '@/lib/assessment-derivatives'

interface UseGameInitializerParams {
  setState: Dispatch<SetStateAction<GameInterfaceState>>
  safeStart: { graph: DialogueGraph; characterId: CharacterId }
  skillTrackerRef: RefObject<SkillTracker | null>
  activeExperience: GameInterfaceState['activeExperience']
}

export function useGameInitializer({
  setState,
  safeStart,
  skillTrackerRef,
  activeExperience,
}: UseGameInitializerParams) {
  // Initialize game logic
  const initializeGame = useCallback(async () => {
    logger.debug('Initializing Stateful Narrative Engine', { operation: 'game-interface.init' })
    try {
      let gameState = GameStateManager.loadGameState()
      if (!gameState) {
        const userId = generateUserId()
        gameState = GameStateUtils.createNewGameState(userId)
      }

      const zustandStore = useGameStore.getState()

      // FIX: Atomic state update helper to prevent Zustand/localStorage desync
      const atomicStateUpdate = (updates: Partial<GameState>): GameState => {
        try {
          // Type assertion safe: gameState has all required props, updates only overrides some
          const newState = { ...gameState, ...updates } as GameState
          GameStateManager.saveGameState(newState)
          zustandStore.setCoreGameState(GameStateUtils.serialize(newState))
          return newState
        } catch (e) {
          logger.error('Failed to update game state atomically', { error: e })
          throw e
        }
      }

      // Ensure player profile exists in database BEFORE any skill tracking
      // This prevents foreign key violations (error 23503)
      // FIX: Added 5-second timeout to prevent infinite hang on slow networks
      if (isSupabaseConfigured()) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5-second timeout

        try {
          await fetch('/api/user/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: gameState.playerId,
              created_at: new Date().toISOString()
            }),
            signal: controller.signal
          })
          clearTimeout(timeoutId)
          logger.debug('Player profile ensured', { operation: 'game-interface.profile', playerId: gameState.playerId })
        } catch (error) {
          clearTimeout(timeoutId)
          if (error instanceof Error && error.name === 'AbortError') {
            logger.warn('Profile endpoint timeout (5s), continuing with local state', {
              operation: 'game-interface.profile-timeout',
              playerId: gameState.playerId
            })
          } else {
            logger.warn('⚠️ Failed to ensure player profile (will fallback to API route check):', { error })
          }
        }
      }

      // ═══════════════════════════════════════════════════════════════════════════
      // CHECK-IN SYSTEM: Process time passing (P1)
      // Only decrement counters if meaningful time (>30m) has passed since last save
      // This prevents players from spam-refreshing to speed up timers
      // ═══════════════════════════════════════════════════════════════════════════
      const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes
      let checkInFeedback: { message: string } | null = null

      if (Date.now() - gameState.lastSaved > SESSION_TIMEOUT_MS) {
        logger.debug('Processing new session check-ins', { operation: 'game-interface.check-in' })
        const updates = CheckInQueue.processSessionStart(gameState)

        // Notify player if new messages are available
        if (updates.globalFlags?.has('has_new_messages')) {
          checkInFeedback = { message: "New messages available" }
        }

        // Save immediately to persist the decremented counters
        // This ensures if they refresh right away, we don't count it again (lastSaved will be now)
        gameState = atomicStateUpdate(updates)

        // P1: SKILL DECAY INTEGRATION (Claim 14)
        // Check for "use it or lose it" atrophy if session has advanced
        // This MUST happen after session checks to ensure 'lastUsedSession' logic is valid
        // FIX: Defer to microtask to keep init responsive
        if (gameState && gameState.skillLevels && gameState.skillUsage) {
          const activeState = gameState // Capture for closure safety
          Promise.resolve().then(() => {
            try {
              const decayResult = calculateSkillDecay(
                activeState.skillLevels,
                activeState.skillUsage,
                activeState.episodeNumber
              )

              // Detect if anything decayed
              const decayedSkills = Object.keys(activeState.skillLevels).filter(
                id => (activeState.skillLevels[id] || 0) > (decayResult[id] || 0)
              )

              if (decayedSkills.length > 0) {
                logger.info('Skill Decay Detected', { skills: decayedSkills })

                // 1. Apply changes state atomically
                try {
                  const updatedState = {
                    ...activeState,
                    skillLevels: decayResult
                  }
                  GameStateManager.saveGameState(updatedState)
                  zustandStore.setCoreGameState(GameStateUtils.serialize(updatedState))
                } catch (e) {
                  logger.error('Failed to save skill decay state', { error: e })
                  return // Early exit if save fails
                }

                // 2. Trigger DIEGETIC notification (Ambient "Intrusive Thought")
                // Pick one random skill to narrate so we don't spam
                const targetSkillId = decayedSkills[Math.floor(Math.random() * decayedSkills.length)]
                const narrative = getSkillDecayNarrative(targetSkillId)

                // 3. Inject into Ambient System immediately
                // Map to StationState's AmbientEvent format
                useStationStore.getState().triggerAmbientEvent({
                  id: `decay_${targetSkillId}_${Date.now()}`,
                  text: narrative,
                  intensity: 'subtle', // Internal thoughts are subtle
                  duration: 8000
                })
              }
            } catch (e) {
              logger.warn('Failed to calculate skill decay', { error: e })
            }
          })
        }
      }

      const activeGameState = gameState! // Assert non-null for subsequent logic
      if (typeof window !== 'undefined' && !skillTrackerRef.current) {
        skillTrackerRef.current = new SkillTracker(activeGameState.playerId)
      }

      const characterId = (activeGameState.currentCharacterId || 'samuel') as CharacterId
      const currentGraph = getGraphForCharacter(characterId, activeGameState)
      const nodeId = activeGameState.currentNodeId

      let currentNode = currentGraph.nodes.get(nodeId)
      let actualCharacterId = characterId
      let actualGraph = currentGraph

      if (!currentNode) {
        const searchResult = findCharacterForNode(nodeId, gameState)
        if (searchResult && searchResult.graph.nodes.has(nodeId)) {
          actualCharacterId = searchResult.characterId
          actualGraph = searchResult.graph
          currentNode = searchResult.graph.nodes.get(nodeId)
        }
      }

      // FIX: Final safety check with proper error handling
      if (!currentNode) {
        const safe = getSafeStart()
        const safeNode = safe.graph.nodes.get(safe.graph.startNodeId)

        if (!safeNode) {
          throw new Error(
            `[CRITICAL] Cannot find safe start node. ` +
            `Requested: ${nodeId}, Safe start: ${safe.graph.startNodeId}`
          )
        }

        actualCharacterId = safe.characterId
        actualGraph = safe.graph
        currentNode = safeNode

        logger.warn('Recovered to safe start node', {
          operation: 'game-interface.safe-start-recovery',
          originalNode: nodeId,
          recoveryNode: safeNode.nodeId
        })
      }

      gameState.currentNodeId = currentNode.nodeId
      gameState.currentCharacterId = actualCharacterId

      // D-011/D-012: Analytics Tracking (Initial Load)
      trackUserOnNode(gameState.playerId, currentNode.nodeId)
      recordVisit(currentNode.nodeId)

      // Ensure character exists, create if missing
      let character = gameState.characters.get(actualCharacterId)
      if (!character) {
        character = GameStateUtils.createCharacterState(actualCharacterId)
        // D-093: Apply inherited trust from related characters
        const inheritedTrust = calculateInheritedTrust(actualCharacterId, gameState.characters)
        if (inheritedTrust > 0) {
          character.trust = Math.min(10, character.trust + inheritedTrust)
          logger.info('[StatefulGameInterface] D-093 Trust inheritance applied:', {
            characterId: actualCharacterId,
            inheritedTrust,
            newTrust: character.trust
          })
        }
        gameState.characters.set(actualCharacterId, character)
      }

      let content = DialogueGraphNavigator.selectContent(currentNode, character.conversationHistory, gameState)
      const regularChoices = StateConditionEvaluator.evaluateChoices(currentNode, gameState, actualCharacterId, gameState.skillLevels).filter(c => c.visible)

      // Add pattern-unlocked choices (special dialogue branches unlocked by pattern investment)
      const patternUnlockChoices = getPatternUnlockChoices(
        actualCharacterId,
        gameState.patterns,
        actualGraph,
        character.visitedPatternUnlocks
      )
      const choices = [...regularChoices, ...patternUnlockChoices]

      // Session Boundary Detection (clean, minimal)
      // If this node is marked as a session boundary, show atmospheric announcement
      if (currentNode.metadata?.sessionBoundary === true) {
        const announcement = selectAnnouncement(gameState.sessionBoundariesCrossed)
        // Replace content with atmospheric announcement
        content = {
          ...content,
          text: announcement,
          emotion: 'atmospheric'
        }
        // Increment counter for next boundary
        gameState.sessionBoundariesCrossed += 1
      }

      // Apply pattern reflection to NPC dialogue based on player's patterns
      // Node-level patternReflection takes precedence over content-level
      const mergedPatternReflection = currentNode.patternReflection || content.patternReflection
      let reflected = applyPatternReflection(
        content.text,
        content.emotion,
        mergedPatternReflection,
        gameState.patterns
      )

      // ═══════════════════════════════════════════════════════════════════════════
      // BIDIRECTIONAL REFLECTION: NPCs respond to WHO the player is becoming
      // This is the architectural fix - NPCs now see player patterns, skills, and state
      // ═══════════════════════════════════════════════════════════════════════════

      // Step 1: Apply NPC voice variations based on player's dominant pattern
      const contentWithReflection = { ...content, text: reflected.text, emotion: reflected.emotion }
      const voiceVaried = resolveContentVoiceVariation(contentWithReflection, gameState.patterns)

      // Step 2: Apply skill reflection (NPCs notice demonstrated competence)
      const skillReflected = applySkillReflection(voiceVaried, gameState.skillLevels)

      // Step 3: Apply nervous system reflection (NPCs respond to player's state)
      const charState = gameState.characters.get(actualCharacterId)
      const fullyReflected = applyNervousSystemReflection(skillReflected, charState?.nervousSystemState)

      // Update reflected with all bidirectional reflections applied
      reflected = { text: fullyReflected.text, emotion: fullyReflected.emotion || reflected.emotion }

      // ═══════════════════════════════════════════════════════════════════════════
      // ORB RECONCILIATION: Check for missed ability unlocks (P0)
      // This ensures existing saves get abilities they qualify for
      const unlockResult = UnlockManager.checkUnlockStatus(gameState)
      if (unlockResult) {
        logger.info('Retroactively unlocked abilities', { abilities: unlockResult.unlockedIds })
        gameState = { ...gameState, ...unlockResult.updates }
        GameStateManager.saveGameState(gameState)
      }

      // ═══════════════════════════════════════════════════════════════════════════
      // ENGAGEMENT LOOPS: Detect Returning Player
      // If player was away for 4+ hours, detect who's been "waiting" for them
      // ═══════════════════════════════════════════════════════════════════════════
      const waitingContext = detectReturningPlayer(gameState)
      const waitingCharacters = waitingContext.isReturningPlayer
        ? getWaitingCharacters(gameState, waitingContext)
        : []

      // If returning player and characters are waiting, prepare Samuel's greeting
      let returnEcho: ConsequenceEcho | null = null
      if (waitingContext.isReturningPlayer && waitingCharacters.length > 0 && actualCharacterId === 'samuel') {
        const waitingSummary = getSamuelWaitingSummary(waitingCharacters)
        if (waitingSummary) {
          returnEcho = {
            text: `"${waitingSummary}"`,
            emotion: 'warm',
            timing: 'immediate' as const
          }
        }
      }

      setState({
        gameState,
        currentNode,
        currentGraph: actualGraph,
        currentCharacterId: actualCharacterId,
        availableChoices: choices,
        currentContent: reflected.text,
        currentDialogueContent: { ...content, text: reflected.text, emotion: reflected.emotion },
        useChatPacing: content.useChatPacing || false,
        isLoading: false,
        isProcessing: false,
        hasStarted: true,
        selectedChoice: null,
        activeExperience, // Preserve from previous state
        showSaveConfirmation: false,
        skillToast: null,
        consequenceFeedback: checkInFeedback,
        error: null,
        previousSpeaker: null,
        recentSkills: [],
        showExperienceSummary: false,
        experienceSummaryData: null,
        showJournal: false,
        showConstellation: false,
        pendingFloatingModule: null,
        showJourneySummary: false,
        journeyNarrative: null,
        achievementNotification: null,
        ambientEvent: null,
        patternSensation: null,
        consequenceEcho: returnEcho,
        sessionBoundary: null,
        previousTotalNodes: getTotalNodesVisited(gameState),
        showIdentityCeremony: false,
        ceremonyPattern: null,
        showPatternEnding: false,
        endingPattern: null,
        hasNewTrust: false,
        hasNewMeeting: false,
        showReport: false,
        activeInterrupt: shouldShowInterrupt(content.interrupt, gameState.patterns), // D-009: Filter by pattern
        patternVoice: null,
        voiceConflict: null,
        activeComboChain: null,
        waitingCharacters,
        pendingGift: null,
        isReturningPlayer: waitingContext.isReturningPlayer
      })

      // One-time local mode notice via Samuel (replaces persistent banner)
      if (!isSupabaseConfigured() && typeof window !== 'undefined') {
        const hasSeenLocalModeNotice = localStorage.getItem('lux-local-mode-seen')
        if (!hasSeenLocalModeNotice) {
          localStorage.setItem('lux-local-mode-seen', 'true')
          // Inject Samuel's echo about local mode-shows once, naturally in dialogue
          setState(prev => ({
            ...prev,
            consequenceEcho: {
              text: '"The station\'s connection to the wider network seems limited today. Your journey will be saved here, in your browser."',
              emotion: 'knowing',
              timing: 'immediate' as const
            }
          }))
        }
      }

      // ═══════════════════════════════════════════════════════════════════════════
      // SYNC BRIDGE: Hydrate Zustand with loaded/initial GameState
      // This ensures ConstellationPanel, Journal, and other components show correct data
      // ═══════════════════════════════════════════════════════════════════════════

      // Sync full CoreGameState to Zustand (single source of truth)
      const serializedState = GameStateUtils.serialize(gameState)
      zustandStore.setCoreGameState(serializedState)

      // syncDerivedState is called automatically by setCoreGameState,
      // but we also explicitly sync here for clarity and debugging
      logger.debug('Zustand synced with CoreGameState', {
        operation: 'game-interface.zustand-sync',
        characterCount: serializedState.characters.length,
        patterns: serializedState.patterns,
        currentNodeId: serializedState.currentNodeId
      })

    } catch (error) {
      logger.error('Init error', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        operation: 'game-interface.init-failed'
      })
      setState(prev => ({
        ...prev,
        error: {
          title: 'Initialization Error',
          message: error instanceof Error ? error.message : 'Failed to initialize game. Please refresh the page.',
          severity: 'error' as const
        },
        isLoading: false,
        hasStarted: true  // FIX: Allow UI to render error state instead of infinite spinner
      }))
    }
  }, [])

  // Handle atmospheric intro start — now just starts the game directly
  // Pattern teaching happens via Samuel's firstOrb milestone echo (discovery-based learning)
  // initializeGame is stable, intentionally excluded to prevent re-creation
  const handleAtmosphericIntroStart = useCallback(() => {
    initializeGame()
  }, [])

  // Emergency Reset Handler (used by choice logic)
  const emergencyReset = useCallback(() => {
    logger.info('[StatefulGameInterface] Emergency Reset to Station', { operation: 'emergencyReset' })

    // Reset to safe start
    setState(prev => ({
      ...prev,
      currentNode: null,
      currentGraph: safeStart.graph,
      currentCharacterId: safeStart.characterId,
      currentNodeId: safeStart.graph.startNodeId,
      availableChoices: [],
      currentContent: '',
      showReport: false,
      showJournal: false,
      showConstellation: false,
      showJourneySummary: false,
      error: null,
      ambientEvent: null,
      consequenceFeedback: null,
      patternSensation: null
    }))
  }, [safeStart.graph, safeStart.characterId])

  return {
    initializeGame,
    handleAtmosphericIntroStart,
    emergencyReset,
  }
}
