'use client'

/**
 * Stateful Game Interface - Restored Card Layout
 *
 * Reverts structure to the "Classic" card-based design as requested by the user.
 * Keeps the internal engine upgrades (Staggered Fade-In Text, robust State Manager).
 *
 * Changes from "Modern":
 * - Removed fixed header / scrollable content area.
 * - Restored `min-h-screen` page container.
 * - Restored separate <Card> for Character Header.
 * - Restored "Your Response" header on Choices card.
 * - Restored Avatar display inside DialogueDisplay (via props).
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DialogueDisplay } from '@/components/DialogueDisplay'
import type { RichTextEffect } from '@/components/RichTextRenderer'
import { AtmosphericIntro } from '@/components/AtmosphericIntro'
import { CharacterAvatar } from '@/components/CharacterAvatar'
import { getTrustLabel } from '@/lib/trust-labels'
import { GameState, GameStateUtils } from '@/lib/character-state'
import { GameStateManager } from '@/lib/game-state-manager'
import { useBackgroundSync } from '@/hooks/useBackgroundSync'
import { generateUserId } from '@/lib/safe-storage'
import {
  DialogueGraph,
  DialogueNode,
  DialogueContent,
  StateConditionEvaluator,
  DialogueGraphNavigator,
  EvaluatedChoice
} from '@/lib/dialogue-graph'
import {
  CharacterId,
  getGraphForCharacter,
  findCharacterForNode,
  getSafeStart
} from '@/lib/graph-registry'
import { samuelEntryPoints } from '@/content/samuel-dialogue-graph'
import { SkillTracker } from '@/lib/skill-tracker'
import { SCENE_SKILL_MAPPINGS } from '@/lib/scene-skill-mappings'
import { queueRelationshipSync, queuePlatformStateSync } from '@/lib/sync-queue'
import { useGameStore } from '@/lib/game-store'
import { CHOICE_HANDLER_TIMEOUT_MS } from '@/lib/constants'
import { logger } from '@/lib/logger'
import { type ExperienceSummaryData } from '@/components/ExperienceSummary'
import { SyncStatusIndicator } from '@/components/SyncStatusIndicator'
import { detectArcCompletion } from '@/lib/arc-learning-objectives'
import { isSupabaseConfigured } from '@/lib/supabase'
import { GameChoices } from '@/components/GameChoices'
import { Brain, BookOpen, Stars, Compass } from 'lucide-react'
import { ThoughtCabinet } from '@/components/ThoughtCabinet'
import { Journal } from '@/components/Journal'
// ProgressIndicator import removed - unused
import { ConstellationPanel } from '@/components/constellation'
import { TextProcessor } from '@/lib/text-processor'
// Floating modules removed - broke dialogue immersion
// import { FloatingModuleEvaluator } from '@/lib/floating-module-evaluator'
// import type { FloatingModule } from '@/lib/dialogue-graph'
import { JourneySummary } from '@/components/JourneySummary'
import { generateJourneyNarrative, isJourneyComplete, type JourneyNarrative } from '@/lib/journey-narrative-generator'
import { evaluateAchievements, type MetaAchievement } from '@/lib/meta-achievements'
import { selectAmbientEvent, IDLE_CONFIG, type AmbientEvent } from '@/lib/ambient-events'
import { PATTERN_TYPES, type PatternType, getPatternSensation, isValidPattern } from '@/lib/patterns'
import { calculatePatternGain } from '@/lib/identity-system'
import { getConsequenceEcho, checkPatternThreshold as checkPatternEchoThreshold, getPatternRecognitionEcho, getVoicedChoiceText, applyPatternReflection, getOrbMilestoneEcho, type ConsequenceEcho } from '@/lib/consequence-echoes'
import { useOrbs } from '@/hooks/useOrbs'
import { ProgressToast } from '@/components/ProgressToast'
import { selectAnnouncement } from '@/lib/platform-announcements'
// FoxTheatreGlow import removed - unused
// Share prompts removed - too obtrusive

// Trust feedback now dialogue-based via consequence echoes

// Types
interface GameInterfaceState {
  gameState: GameState | null
  currentNode: DialogueNode | null
  currentGraph: DialogueGraph
  currentCharacterId: CharacterId
  availableChoices: EvaluatedChoice[]
  currentContent: string
  currentDialogueContent: DialogueContent | null
  useChatPacing: boolean
  isLoading: boolean
  hasStarted: boolean
  selectedChoice: string | null
  showSaveConfirmation: boolean
  skillToast: { skill: string; message: string } | null
  consequenceFeedback: { message: string } | null
  error: { title: string; message: string; severity: 'error' | 'warning' | 'info' } | null
  showTransition: boolean
  transitionData: { platform: number; message: string } | null
  previousSpeaker: string | null
  recentSkills: string[]
  showExperienceSummary: boolean
  experienceSummaryData: ExperienceSummaryData | null
  showConfigWarning: boolean
  showThoughtCabinet: boolean
  showJournal: boolean
  showConstellation: boolean
  pendingFloatingModule: null // Floating modules disabled
  showJourneySummary: boolean
  journeyNarrative: JourneyNarrative | null
  achievementNotification: MetaAchievement | null
  ambientEvent: AmbientEvent | null  // Station breathing - idle atmosphere
  patternSensation: string | null    // Brief feedback when pattern triggered
  consequenceEcho: ConsequenceEcho | null  // Dialogue-based trust feedback
  patternToast: PatternType | null   // Minimal toast for pattern earned (Pokemon: Low HP beep principle)
}

export default function StatefulGameInterface() {
  const safeStart = getSafeStart()

  // Orb earning - SILENT during gameplay (discovery in Journal)
  const { earnOrb, earnBonusOrbs, hasNewOrbs, markOrbsViewed, getUnacknowledgedMilestone, acknowledgeMilestone, balance: orbBalance } = useOrbs()

  // Compute orb fill percentages for KOTOR-style locked choices
  const MAX_ORB_COUNT = 100
  const orbFillLevels = useMemo(() => ({
    analytical: Math.min(100, Math.round((orbBalance.analytical / MAX_ORB_COUNT) * 100)),
    patience: Math.min(100, Math.round((orbBalance.patience / MAX_ORB_COUNT) * 100)),
    exploring: Math.min(100, Math.round((orbBalance.exploring / MAX_ORB_COUNT) * 100)),
    helping: Math.min(100, Math.round((orbBalance.helping / MAX_ORB_COUNT) * 100)),
    building: Math.min(100, Math.round((orbBalance.building / MAX_ORB_COUNT) * 100)),
  }), [orbBalance])

  const [state, setState] = useState<GameInterfaceState>({
    gameState: null,
    currentNode: null,
    currentGraph: safeStart.graph,
    currentCharacterId: safeStart.characterId,
    availableChoices: [],
    currentContent: '',
    currentDialogueContent: null,
    useChatPacing: false,
    isLoading: false,
    hasStarted: false,
    previousSpeaker: null,
    selectedChoice: null,
    showSaveConfirmation: false,
    skillToast: null,
    consequenceFeedback: null,
    error: null,
    showTransition: false,
    transitionData: null,
    recentSkills: [],
    showExperienceSummary: false,
    experienceSummaryData: null,
    showConfigWarning: !isSupabaseConfigured(),
    showThoughtCabinet: false,
    showJournal: false,
    showConstellation: false,
    pendingFloatingModule: null,
    showJourneySummary: false,
    journeyNarrative: null,
    achievementNotification: null,
    ambientEvent: null,
    patternSensation: null,
    consequenceEcho: null,
    patternToast: null
  })

  // Rich effects config - KEEPING NEW STAGGERED MODE
  const enableRichEffects = true 
  const getRichEffectContext = useCallback((content: DialogueContent | null, _isLoading: boolean, _recentSkills: string[], _useChatPacing: boolean): RichTextEffect | undefined => {
    if (!enableRichEffects || !content) return undefined
    
    const emotionMap: Record<string, 'thinking' | 'warning' | 'success' | undefined> = {
      'anxious': 'warning',
      'worried': 'warning',
      'vulnerable': 'thinking',
      'thoughtful': 'thinking',
      'reflecting': 'thinking',
      'excited': 'success',
      'determined': 'success'
    }

    const state = content.richEffectContext || (content.emotion ? emotionMap[content.emotion] : 'default') || 'default'

    return {
      mode: 'staggered', // Keep user-approved smooth text
      state: (state || 'default') as 'thinking' | 'executing' | 'warning' | 'error' | 'success' | 'default',
      speed: 1.0
    }
  }, [enableRichEffects])

  // Refs & Sync
  const skillTrackerRef = useRef<SkillTracker | null>(null)
  
  // Share prompts disabled - too obtrusive
  const isProcessingChoiceRef = useRef(false) // Race condition guard
  const { queueStats: _queueStats } = useBackgroundSync({ enabled: true })
  const [hasSaveFile, setHasSaveFile] = useState(false)
  const [_saveIsComplete, setSaveIsComplete] = useState(false)

  // Save confirmation disabled - saves happen silently without interruption
  // Achievement notifications disabled - no longer needed

  useEffect(() => {
    const exists = GameStateManager.hasSaveFile()
    setHasSaveFile(exists)
    if (exists) {
      const loadedState = GameStateManager.loadGameState()
      if (loadedState) {
        const characterId = (loadedState.currentCharacterId || 'samuel') as CharacterId
        const graph = getGraphForCharacter(characterId, loadedState)
        const node = graph.nodes.get(loadedState.currentNodeId)
        setSaveIsComplete(!!(node && node.choices.length === 0))
      }
    }
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // AMBIENT EVENTS - "The Station Breathes"
  // When the player pauses to think, life continues around them.
  // ═══════════════════════════════════════════════════════════════════════════
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const idleCountRef = useRef(0)  // Track how many ambient events shown this idle period
  const lastChoiceTimeRef = useRef(Date.now())

  // Helper to get dominant pattern
  const getDominantPattern = useCallback((): PatternType | undefined => {
    if (!state.gameState) return undefined
    const patterns = state.gameState.patterns
    let maxPattern: PatternType | undefined
    let maxValue = 0
    for (const p of PATTERN_TYPES) {
      const value = patterns[p] || 0
      if (value > maxValue) {
        maxValue = value
        maxPattern = p
      }
    }
    return maxValue >= 3 ? maxPattern : undefined  // Only if pattern is strong enough
  }, [state.gameState])

  // Start/reset idle timer
  const resetIdleTimer = useCallback(() => {
    // Clear any existing timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
    }

    // Reset idle count when player acts
    idleCountRef.current = 0
    lastChoiceTimeRef.current = Date.now()

    // Clear any showing ambient event
    setState(prev => prev.ambientEvent ? { ...prev, ambientEvent: null } : prev)

    // Don't start timer if game not active or no choices available
    if (!state.hasStarted || state.availableChoices.length === 0) return

    const scheduleAmbientEvent = () => {
      const delay = idleCountRef.current === 0
        ? IDLE_CONFIG.FIRST_IDLE_MS
        : IDLE_CONFIG.SUBSEQUENT_IDLE_MS

      idleTimerRef.current = setTimeout(() => {
        // Don't show if max events reached or modals open
        if (idleCountRef.current >= IDLE_CONFIG.MAX_IDLE_EVENTS) return
        if (state.showJournal || state.showThoughtCabinet || state.showConstellation || state.showJourneySummary) return

        const dominantPattern = getDominantPattern()
        const event = selectAmbientEvent(state.currentCharacterId, dominantPattern)

        if (event) {
          idleCountRef.current++
          setState(prev => ({ ...prev, ambientEvent: event }))

          // Schedule next event if not at max
          if (idleCountRef.current < IDLE_CONFIG.MAX_IDLE_EVENTS) {
            scheduleAmbientEvent()
          }
        }
      }, delay)
    }

    scheduleAmbientEvent()
  }, [state.hasStarted, state.availableChoices.length, state.currentCharacterId, state.showJournal, state.showThoughtCabinet, state.showConstellation, state.showJourneySummary, getDominantPattern])

  // Reset timer when choices change (player made a choice)
  useEffect(() => {
    resetIdleTimer()
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
    }
  }, [state.currentNode?.nodeId, resetIdleTimer])

  // Initialize game logic
  const initializeGame = useCallback(async () => {
    logger.debug('Initializing Stateful Narrative Engine', { operation: 'game-interface.init' })
    try {
      let gameState = GameStateManager.loadGameState()
      if (!gameState) {
        const userId = generateUserId()
        gameState = GameStateUtils.createNewGameState(userId)
      }

      // Ensure player profile exists in database BEFORE any skill tracking
      // This prevents foreign key violations (error 23503)
      if (isSupabaseConfigured()) {
        try {
          await fetch('/api/user/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: gameState.playerId,
              created_at: new Date().toISOString()
            })
          })
          logger.debug('Player profile ensured', { operation: 'game-interface.profile', playerId: gameState.playerId })
        } catch (error) {
          console.warn('⚠️ Failed to ensure player profile (will fallback to API route check):', error)
        }
      }

      if (typeof window !== 'undefined' && !skillTrackerRef.current) {
        skillTrackerRef.current = new SkillTracker(gameState.playerId)
      }

      const characterId = (gameState.currentCharacterId || 'samuel') as CharacterId
      const currentGraph = getGraphForCharacter(characterId, gameState)
      const nodeId = gameState.currentNodeId
      
      let currentNode = currentGraph.nodes.get(nodeId)
      let actualCharacterId = characterId
      let actualGraph = currentGraph

      if (!currentNode) {
         const searchResult = findCharacterForNode(nodeId, gameState)
         if (searchResult) {
             actualCharacterId = searchResult.characterId
             actualGraph = searchResult.graph
             currentNode = actualGraph.nodes.get(nodeId)!
         } else {
             const safe = getSafeStart()
             actualCharacterId = safe.characterId
             actualGraph = safe.graph
             currentNode = actualGraph.nodes.get(actualGraph.startNodeId)!
         }
      }

      gameState.currentNodeId = currentNode.nodeId
      gameState.currentCharacterId = actualCharacterId

      // Ensure character exists, create if missing
      let character = gameState.characters.get(actualCharacterId)
      if (!character) {
        character = GameStateUtils.createCharacterState(actualCharacterId)
        gameState.characters.set(actualCharacterId, character)
      }

      let content = DialogueGraphNavigator.selectContent(currentNode, character.conversationHistory)
      const choices = StateConditionEvaluator.evaluateChoices(currentNode, gameState, actualCharacterId).filter(c => c.visible)

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
        // Track silently in PostHog (analytics handled separately)
      }

      // Apply pattern reflection to NPC dialogue based on player's patterns
      // Node-level patternReflection takes precedence over content-level
      const mergedPatternReflection = currentNode.patternReflection || content.patternReflection
      const reflected = applyPatternReflection(
        content.text,
        content.emotion,
        mergedPatternReflection,
        gameState.patterns
      )

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
        hasStarted: true,
        selectedChoice: null,
        showSaveConfirmation: false,
        skillToast: null,
        consequenceFeedback: null,
        error: null,
        showTransition: false,
        transitionData: null,
        previousSpeaker: null,
        recentSkills: [],
        showExperienceSummary: false,
        experienceSummaryData: null,
        showConfigWarning: !isSupabaseConfigured(),
        showThoughtCabinet: false,
        showJournal: false,
        showConstellation: false,
        pendingFloatingModule: null,
        showJourneySummary: false,
        journeyNarrative: null,
        achievementNotification: null,
        ambientEvent: null,
        patternSensation: null,
        consequenceEcho: null,
        patternToast: null
      })

      // ═══════════════════════════════════════════════════════════════════════════
      // SYNC BRIDGE: Hydrate Zustand with loaded/initial GameState
      // This ensures ConstellationPanel, Journal, and other components show correct data
      //
      // We sync BOTH:
      // 1. The full SerializableGameState (for complete state access)
      // 2. Derived fields (for backward compatibility with existing selectors)
      // ═══════════════════════════════════════════════════════════════════════════
      const zustandStore = useGameStore.getState()

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
        console.error('Init error', error)
        setState(prev => ({
          ...prev,
          error: {
            title: 'Initialization Error',
            message: error instanceof Error ? error.message : 'Failed to initialize game. Please refresh the page.',
            severity: 'error' as const
          },
          isLoading: false
        }))
    }
  }, [])

  // Choice handler
  const handleChoice = useCallback(async (choice: EvaluatedChoice) => {
    // Prevent race condition from rapid-fire clicks
    if (isProcessingChoiceRef.current) return
    if (!state.gameState || !choice.enabled) return

    isProcessingChoiceRef.current = true

    // Safety timeout: auto-reset lock if handler crashes or hangs
    const safetyTimeout = setTimeout(() => {
      if (isProcessingChoiceRef.current) {
        console.error('[StatefulGameInterface] Choice handler timeout - auto-resetting lock')
        isProcessingChoiceRef.current = false
      }
    }, CHOICE_HANDLER_TIMEOUT_MS)

    try {
      let newGameState = state.gameState
      const previousPatterns = { ...state.gameState.patterns } // Store for threshold detection

      // Track trust before change for echo generation
      const trustBefore = state.gameState.characters.get(state.currentCharacterId)?.trust ?? 0

      if (choice.choice.consequence) newGameState = GameStateUtils.applyStateChange(newGameState, choice.choice.consequence)

      // Apply pattern change with identity bonus (if internalized)
      if (choice.choice.pattern) {
        const baseGain = 1
        const modifiedGain = calculatePatternGain(baseGain, choice.choice.pattern, newGameState)
        newGameState = GameStateUtils.applyStateChange(newGameState, {
          patternChanges: { [choice.choice.pattern]: modifiedGain }
        })
      }

      // Earn orb for pattern choice - Show minimal toast (Pokemon: Low HP beep principle)
      if (choice.choice.pattern && isValidPattern(choice.choice.pattern)) {
        const earnedPattern = choice.choice.pattern
        const { crossedThreshold5 } = earnOrb(earnedPattern)

        // Show pattern toast (minimal, bottom placement, fades after 1.5s)
        setState(prev => ({ ...prev, patternToast: earnedPattern }))
        setTimeout(() => {
          setState(prev => ({ ...prev, patternToast: null }))
        }, 1500)

        // Identity offering at threshold 5 (Disco Elysium: "Is this who you are?")
        // Pokemon four-move limit philosophy: Constraint forces identity
        if (crossedThreshold5) {
          const identityThoughtId = `identity-${earnedPattern}` as const
          newGameState = GameStateUtils.applyStateChange(newGameState, {
            thoughtId: identityThoughtId
          })
        }
      }

      // Calculate trust change for consequence echo
      const trustAfter = newGameState.characters.get(state.currentCharacterId)?.trust ?? 0
      const trustDelta = trustAfter - trustBefore

      // Generate pattern sensation if pattern was triggered
      // Only show occasionally (30% chance) to avoid being obtrusive
      let patternSensation: string | null = null
      if (choice.choice.pattern && isValidPattern(choice.choice.pattern) && Math.random() < 0.3) {
        patternSensation = getPatternSensation(choice.choice.pattern)
      }

      // Generate consequence echo for trust changes (dialogue-based feedback)
      let consequenceEcho: ConsequenceEcho | null = null
      if (trustDelta !== 0) {
        consequenceEcho = getConsequenceEcho(state.currentCharacterId, trustDelta)
      }

      // Also check for pattern recognition echos (when player crosses a threshold)
      const crossedPattern = checkPatternEchoThreshold(previousPatterns, newGameState.patterns, 5)
      if (crossedPattern && !consequenceEcho) {
        // Pattern recognition takes precedence over trust echo if no trust change
        consequenceEcho = getPatternRecognitionEcho(state.currentCharacterId, crossedPattern)
      }

      // Check for orb milestone echoes - Samuel acknowledges growth
      // Only shows when talking to Samuel and there's an unacknowledged milestone
      if (!consequenceEcho && state.currentCharacterId === 'samuel') {
        const unacknowledgedMilestone = getUnacknowledgedMilestone()
        if (unacknowledgedMilestone) {
          consequenceEcho = getOrbMilestoneEcho(unacknowledgedMilestone)
          if (consequenceEcho) {
            acknowledgeMilestone(unacknowledgedMilestone)
          }
        }
      }

      // Floating modules disabled - broke dialogue immersion
      const zustandStore = useGameStore.getState()

      const searchResult = findCharacterForNode(choice.choice.nextNodeId, newGameState)
      if (!searchResult) {
        console.error('[StatefulGameInterface] Could not find character graph for node:', choice.choice.nextNodeId)
        setState(prev => ({
          ...prev,
          error: {
            title: 'Navigation Error',
            message: `Could not find node "${choice.choice.nextNodeId}". Please refresh the page to restart.`,
            severity: 'error' as const
          },
          isLoading: false
        }))
        return
      }

      const nextNode = searchResult.graph.nodes.get(choice.choice.nextNodeId)
      if (!nextNode) {
        console.error('[StatefulGameInterface] Node not found in graph:', {
          nodeId: choice.choice.nextNodeId,
          characterId: searchResult.characterId,
          graphName: searchResult.graph.metadata?.title || 'unknown'
        })
        setState(prev => ({
          ...prev,
          error: {
            title: 'Navigation Error',
            message: `Node "${choice.choice.nextNodeId}" not found in ${searchResult.characterId}'s graph.`,
            severity: 'error' as const
          },
          isLoading: false
        }))
        isProcessingChoiceRef.current = false
        return
      }

      const targetGraph = searchResult.graph
      const targetCharacterId = searchResult.characterId

      if (nextNode.onEnter) {
          for (const change of nextNode.onEnter) {
              newGameState = GameStateUtils.applyStateChange(newGameState, change)
          }
      }

      const targetCharacter = newGameState.characters.get(targetCharacterId)!
      targetCharacter.conversationHistory.push(nextNode.nodeId)
      newGameState.currentNodeId = nextNode.nodeId
      newGameState.currentCharacterId = targetCharacterId

      const content = DialogueGraphNavigator.selectContent(nextNode, targetCharacter.conversationHistory)
      const newChoices = StateConditionEvaluator.evaluateChoices(nextNode, newGameState, targetCharacterId).filter(c => c.visible)

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
        console.warn('[StatefulGameInterface] Character changed but content unchanged', {
          fromCharacter: state.currentCharacterId,
          toCharacter: targetCharacterId,
          nodeId: nextNode.nodeId,
          contentPreview: reflected.text.substring(0, 50)
        })
      }

      // Skill tracking logic (abbreviated for safety, same as before)
      // Note: Toast removed as user found it intrusive. Skills still tracked silently.
      let demonstratedSkills: string[] = []

      if (skillTrackerRef.current && state.currentNode) {
        const sceneMapping = SCENE_SKILL_MAPPINGS[state.currentNode.nodeId]
        if (sceneMapping && sceneMapping.choiceMappings[choice.choice.choiceId]) {
            demonstratedSkills = sceneMapping.choiceMappings[choice.choice.choiceId].skillsDemonstrated
            skillTrackerRef.current.recordSkillDemonstration(
              state.currentNode.nodeId,
              choice.choice.choiceId,
              demonstratedSkills,
              sceneMapping.choiceMappings[choice.choice.choiceId].context
            )
        } else if (choice.choice.skills) {
            demonstratedSkills = choice.choice.skills as string[]
            skillTrackerRef.current.recordSkillDemonstration(
              state.currentNode.nodeId,
              choice.choice.choiceId,
              demonstratedSkills,
              `Demonstrated ${demonstratedSkills.join(', ')}`
            )
        }
      }

      const skillsToKeep = demonstratedSkills.length > 0
        ? [...demonstratedSkills, ...state.recentSkills].slice(0, 10)
        : state.recentSkills.slice(0, 8)

      // Trust feedback disabled - notifications were obtrusive
      // Trust changes are tracked silently in the background
      const consequenceFeedback: { message: string } | null = null


      const completedArc = detectArcCompletion(state.gameState, newGameState)
      const experienceSummaryUpdate = { showExperienceSummary: false, experienceSummaryData: null as ExperienceSummaryData | null }

      // Award bonus orbs for arc completion - SILENT (no notification)
      // Gives bonus based on dominant pattern during this arc
      if (completedArc) {
        const patterns = newGameState.patterns
        const patternEntries = Object.entries(patterns) as [PatternType, number][]
        const dominantPattern = patternEntries.reduce((max, curr) =>
          curr[1] > max[1] ? curr : max, patternEntries[0])?.[0]
        if (dominantPattern && isValidPattern(dominantPattern)) {
          earnBonusOrbs(dominantPattern, 5) // ORB_EARNINGS.arcCompletion
        }
      }

      // Arc completion summary disabled - breaks immersion
      // Experience summaries available in admin dashboard/journey summary (menus/maps)
      // if (completedArc) {
      //   const demonstrations = skillTrackerRef.current?.getAllDemonstrations() || []
      //   loadSkillProfile(newGameState.playerId)
      //       .then(profile => generateExperienceSummary(completedArc, newGameState, profile, demonstrations))
      //       .then(summaryData => setState(prev => ({ ...prev, showExperienceSummary: true, experienceSummaryData: summaryData })))
      //       .catch(() => setState(prev => ({ ...prev, showExperienceSummary: true, experienceSummaryData: null })))
      // }
    
      // Floating modules disabled - arc_transition check removed

      // Evaluate meta-achievements after state changes
      // Achievements are tracked silently - no obtrusive notifications
      const existingUnlocks = zustandStore.unlockedAchievements || []
      const newAchievements = evaluateAchievements(newGameState, existingUnlocks)
      if (newAchievements.length > 0) {
        // Unlock the new achievements in Zustand (still tracked, just no popup)
        zustandStore.unlockAchievements(newAchievements)
        // Notification disabled - obtrusive on mobile, achievements visible in admin dashboard
      }
      const achievementNotification: MetaAchievement | null = null

      setState({
          gameState: newGameState,
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
          showSaveConfirmation: false, // Disabled - save happens silently, no interruption
          skillToast: null, // Disabled - skills tracked silently
          consequenceFeedback,
          error: null,
          showTransition: false,
          transitionData: null,
          previousSpeaker: state.currentNode?.speaker || null,
          recentSkills: skillsToKeep,
          ...experienceSummaryUpdate,
          showConfigWarning: state.showConfigWarning,
          showThoughtCabinet: state.showThoughtCabinet,
          showJournal: state.showJournal,
          showConstellation: state.showConstellation,
          pendingFloatingModule: null, // Floating modules disabled
          showJourneySummary: state.showJourneySummary,
          journeyNarrative: state.journeyNarrative,
          achievementNotification,
          ambientEvent: null,  // Clear ambient event when player acts
          patternSensation,    // Show pattern feedback if triggered
          consequenceEcho,     // Dialogue-based trust feedback
          patternToast: state.patternToast  // Preserve pattern toast (set earlier in choice handling)
      })
      GameStateManager.saveGameState(newGameState)

      // ═══════════════════════════════════════════════════════════════════════════
      // SYNC BRIDGE: Push GameState changes to Zustand for UI components
      // This ensures ConstellationPanel, Journal, and other Zustand consumers
      // see real-time updates from gameplay choices.
      //
      // We sync the full SerializableGameState, which automatically updates
      // all derived fields (characterTrust, patterns, etc.) via syncDerivedState
      // ═══════════════════════════════════════════════════════════════════════════
      // Note: zustandStore was declared earlier for floating module evaluation

      // Sync full CoreGameState to Zustand (single source of truth)
      const serializedState = GameStateUtils.serialize(newGameState)
      zustandStore.setCoreGameState(serializedState)

      // Additional explicit syncs for Journal (these use different data structures)
      // Note: syncDerivedState handles characterTrust and patterns automatically
      zustandStore.markSceneVisited(nextNode.nodeId)
      zustandStore.addChoiceRecord({
        sceneId: state.currentNode?.nodeId || '',
        choice: choice.choice.text,
        timestamp: Date.now()
      })

      // Share prompts removed - too obtrusive

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
    } finally {
      // Clear safety timeout and release lock
      clearTimeout(safetyTimeout)
      isProcessingChoiceRef.current = false
    }
  }, [state.gameState, state.currentNode, state.showConfigWarning, state.recentSkills, state.showThoughtCabinet, state.showJournal, state.showConstellation, state.journeyNarrative, state.showJourneySummary, state.currentCharacterId, state.currentContent, earnOrb, earnBonusOrbs, getUnacknowledgedMilestone, acknowledgeMilestone])

  /**
   * Navigate back to Samuel's hub after completing a conversation
   * Determines the appropriate entry point based on completed arcs
   */
  const handleReturnToStation = useCallback(async () => {
    if (!state.gameState) return

    try {
      // Determine which Samuel entry point to use based on completed arcs
      let targetNodeId: string = samuelEntryPoints.INTRODUCTION

      // Check for character-specific reflection gateways
      const globalFlags = Array.from(state.gameState.globalFlags)
      if (globalFlags.includes('kai_arc_complete')) {
        targetNodeId = samuelEntryPoints.KAI_REFLECTION_GATEWAY
      } else if (globalFlags.includes('maya_arc_complete') && !globalFlags.includes('devon_arc_complete')) {
        targetNodeId = samuelEntryPoints.HUB_AFTER_MAYA
      } else if (globalFlags.includes('devon_arc_complete')) {
        targetNodeId = samuelEntryPoints.HUB_AFTER_DEVON
      } else if (globalFlags.includes('marcus_arc_complete')) {
        targetNodeId = samuelEntryPoints.MARCUS_REFLECTION_GATEWAY
      } else if (globalFlags.includes('jordan_arc_complete')) {
        targetNodeId = samuelEntryPoints.JORDAN_REFLECTION_GATEWAY
      } else if (globalFlags.includes('tess_arc_complete')) {
        targetNodeId = samuelEntryPoints.TESS_REFLECTION_GATEWAY
      } else if (globalFlags.includes('yaquin_arc_complete')) {
        targetNodeId = samuelEntryPoints.YAQUIN_REFLECTION_GATEWAY
      } else if (globalFlags.includes('rohan_arc_complete')) {
        targetNodeId = samuelEntryPoints.ROHAN_REFLECTION_GATEWAY
      } else if (globalFlags.includes('silas_arc_complete')) {
        targetNodeId = samuelEntryPoints.SILAS_REFLECTION_GATEWAY
      } else if (globalFlags.includes('maya_arc_complete')) {
        targetNodeId = samuelEntryPoints.MAYA_REFLECTION_GATEWAY
      } else {
        // Default to initial hub or introduction
        targetNodeId = samuelEntryPoints.HUB_INITIAL || samuelEntryPoints.INTRODUCTION
      }

      // Find the character and graph for the target node
      const searchResult = findCharacterForNode(targetNodeId, state.gameState)
      if (!searchResult) {
        console.error('Failed to find Samuel hub node:', targetNodeId)
        // Fallback: reset to introduction
        const samuelGraph = getGraphForCharacter('samuel', state.gameState)
        const introNode = samuelGraph.nodes.get(samuelEntryPoints.INTRODUCTION)
        if (introNode) {
          const newGameState = { ...state.gameState }
          newGameState.currentNodeId = introNode.nodeId
          newGameState.currentCharacterId = 'samuel'
          const samuelChar = newGameState.characters.get('samuel') || GameStateUtils.createCharacterState('samuel')
          newGameState.characters.set('samuel', samuelChar)
          const content = DialogueGraphNavigator.selectContent(introNode, samuelChar.conversationHistory)
          const choices = StateConditionEvaluator.evaluateChoices(introNode, newGameState, 'samuel').filter(c => c.visible)

          // Apply pattern reflection
          const reflected = applyPatternReflection(
            content.text,
            content.emotion,
            content.patternReflection,
            newGameState.patterns
          )

          setState(prev => ({
            ...prev,
            gameState: newGameState,
            currentNode: introNode,
            currentGraph: samuelGraph,
            currentCharacterId: 'samuel',
            availableChoices: choices,
            currentContent: reflected.text,
            currentDialogueContent: { ...content, text: reflected.text, emotion: reflected.emotion },
            useChatPacing: content.useChatPacing || false,
            isLoading: false
          }))
          GameStateManager.saveGameState(newGameState)
          const zustandStore = useGameStore.getState()
          zustandStore.setCoreGameState(GameStateUtils.serialize(newGameState))
          return
        }
        // If fallback also fails, show error
        setState(prev => ({
          ...prev,
          error: {
            title: 'Navigation Error',
            message: `Could not find hub node "${targetNodeId}" or fallback introduction. Please refresh the page.`,
            severity: 'error' as const
          },
          isLoading: false
        }))
        return
      }

      const targetNode = searchResult.graph.nodes.get(targetNodeId)
      if (!targetNode) {
        console.error('Target node not found:', targetNodeId)
        setState(prev => ({
          ...prev,
          error: {
            title: 'Navigation Error',
            message: `Target node "${targetNodeId}" not found in graph. Please refresh the page.`,
            severity: 'error' as const
          },
          isLoading: false
        }))
        return
      }

      // Navigate to the target node (similar to handleChoice but without choice consequences)
      let newGameState = state.gameState
      const targetCharacterId = searchResult.characterId
      const targetGraph = searchResult.graph

      // Apply onEnter effects if any
      if (targetNode.onEnter) {
        for (const change of targetNode.onEnter) {
          newGameState = GameStateUtils.applyStateChange(newGameState, change)
        }
      }

      // Ensure character exists
      if (!newGameState.characters.has(targetCharacterId)) {
        const newChar = GameStateUtils.createCharacterState(targetCharacterId)
        newGameState.characters.set(targetCharacterId, newChar)
      }
      
      const targetCharacter = newGameState.characters.get(targetCharacterId)!
      if (!targetCharacter.conversationHistory.includes(targetNode.nodeId)) {
        targetCharacter.conversationHistory.push(targetNode.nodeId)
      }
      newGameState.currentNodeId = targetNode.nodeId
      newGameState.currentCharacterId = targetCharacterId

      const content = DialogueGraphNavigator.selectContent(targetNode, targetCharacter.conversationHistory)
      const choices = StateConditionEvaluator.evaluateChoices(targetNode, newGameState, targetCharacterId).filter(c => c.visible)

      // Apply pattern reflection
      const reflected = applyPatternReflection(
        content.text,
        content.emotion,
        content.patternReflection,
        newGameState.patterns
      )

      setState(prev => ({
        ...prev,
        gameState: newGameState,
        currentNode: targetNode,
        currentGraph: targetGraph,
        currentCharacterId: targetCharacterId,
        availableChoices: choices,
        currentContent: reflected.text,
        currentDialogueContent: { ...content, text: reflected.text, emotion: reflected.emotion },
        useChatPacing: content.useChatPacing || false,
        isLoading: false
      }))

      GameStateManager.saveGameState(newGameState)
      
      // Sync to Zustand
      const zustandStore = useGameStore.getState()
      zustandStore.setCoreGameState(GameStateUtils.serialize(newGameState))
      zustandStore.markSceneVisited(targetNode.nodeId)

      // Sync to Supabase
      if (isSupabaseConfigured()) {
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
        queuePlatformStateSync({
          user_id: newGameState.playerId,
          current_scene: newGameState.currentNodeId,
          global_flags: Array.from(newGameState.globalFlags),
          patterns: newGameState.patterns
        })
      }
    } catch (error) {
      console.error('[StatefulGameInterface] Error in handleReturnToStation:', error)
      setState(prev => ({
        ...prev,
        error: {
          title: 'Navigation Error',
          message: error instanceof Error ? error.message : 'Failed to return to station. Please refresh the page.',
          severity: 'error' as const
        },
        isLoading: false
      }))
    }
  }, [state.gameState])


  // Render Logic - Restored Card Layout
  if (!state.hasStarted) {
      if (!hasSaveFile) return <AtmosphericIntro onStart={initializeGame} />
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl border-0">
                <CardContent className="p-8 text-center">
                    <div className="space-y-3">
                        <Button onClick={initializeGame} size="lg" className="w-full bg-slate-900 hover:bg-slate-800 text-white">Continue</Button>
                        <Button onClick={() => {
                            // Clear all save data for true reset
                            GameStateManager.nuclearReset()
                            window.location.reload()
                        }} variant="outline" size="lg" className="w-full">Start Over</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      )
  }

  const characterNames: Record<CharacterId, string> = {
    samuel: 'Samuel Washington',
    maya: 'Maya Chen',
    devon: 'Devon Kumar',
    jordan: 'Jordan Packard',
    marcus: 'Marcus',
    tess: 'Tess',
    yaquin: 'Yaquin',
    kai: 'Kai',
    alex: 'Alex',
    rohan: 'Rohan',
    silas: 'Silas'
  }
  
  const currentCharacter = state.gameState?.characters.get(state.currentCharacterId)
  const isEnding = state.availableChoices.length === 0

  return (
    <div
      key="game-container"
      className="h-[100dvh] flex flex-col bg-gradient-to-b from-slate-50 to-slate-100"
      style={{
        willChange: 'auto',
        contain: 'layout style paint',
        transition: 'none',
        // Safe area insets for notched devices (iPhone X+)
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      }}
    >
      {/* ══════════════════════════════════════════════════════════════════
          FIXED HEADER - Always visible at top (Claude/ChatGPT pattern)
          ══════════════════════════════════════════════════════════════════ */}
      <header className="flex-shrink-0 bg-stone-50/95 backdrop-blur-md border-b border-stone-200 z-10">
        <div className="max-w-4xl mx-auto px-3 sm:px-4">
          {/* Top Row - Title and Navigation */}
          <div className="flex items-center justify-between py-2 border-b border-stone-100">
            <Link href="/" className="text-sm font-semibold text-slate-800 hover:text-slate-600 transition-colors">
              Grand Central Terminus
            </Link>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setState(prev => ({ ...prev, showThoughtCabinet: true }))}
                className="h-9 w-9 p-0 text-slate-500 hover:text-slate-700 hover:bg-stone-100"
                title="Thought Cabinet"
              >
                <Brain className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  markOrbsViewed()
                  setState(prev => ({ ...prev, showJournal: true }))
                }}
                className="relative h-9 w-9 p-0 text-slate-500 hover:text-slate-700 hover:bg-stone-100"
                title="Journal"
              >
                <BookOpen className="h-4 w-4" />
                {hasNewOrbs && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-amber-500 rounded-full animate-pulse" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setState(prev => ({ ...prev, showConstellation: true }))}
                className="h-9 w-9 p-0 text-slate-500 hover:text-slate-700 hover:bg-stone-100"
                title="Constellation"
              >
                <Stars className="h-4 w-4" />
              </Button>
              <SyncStatusIndicator />
            </div>
          </div>
          {/* Character Info Row - extra vertical padding for mobile touch */}
          {currentCharacter && (
            <div
              className="flex items-center justify-between py-3 sm:py-2"
              data-testid="character-header"
              data-character-id={state.currentCharacterId}
            >
              <div className="flex items-center gap-2 font-medium text-slate-700 text-sm sm:text-base">
                <CharacterAvatar
                  characterName={characterNames[state.currentCharacterId]}
                  size="sm"
                />
                <span className="truncate max-w-[150px] sm:max-w-none">{characterNames[state.currentCharacterId]}</span>
              </div>
              <div className="flex flex-col items-end">
                {(() => {
                  const { label, color, description } = getTrustLabel(currentCharacter.trust)
                  return (
                    <>
                      <span className={`text-xs sm:text-sm font-semibold ${color}`}>{label}</span>
                      <span className="text-[10px] sm:text-xs text-slate-400 hidden sm:inline-block">{description}</span>
                    </>
                  )
                })()}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Configuration Warning - Collapsible on mobile */}
      {state.showConfigWarning && (
        <div className="flex-shrink-0 px-3 sm:px-4 py-2 bg-amber-50 border-b border-amber-200">
          <div className="max-w-4xl mx-auto flex items-center gap-2">
            <span className="text-amber-600 text-sm">⚠️</span>
            <p className="text-xs text-amber-700 truncate sm:whitespace-normal">Local preview mode. Progress saved to browser only.</p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          SCROLLABLE DIALOGUE AREA - Middle section
          ══════════════════════════════════════════════════════════════════ */}
      <main
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
        data-testid="game-interface"
      >
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 md:pt-12 lg:pt-16 pb-8">
          {/* AnimatePresence for smooth dialogue transitions - mobile-optimized */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`dialogue-${state.gameState?.currentNodeId || 'none'}-${state.currentCharacterId}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.15,
                ease: "easeOut"
              }}
            >
              <Card
                className="rounded-xl shadow-sm bg-amber-50/40 border-stone-200/60"
                style={{ transition: 'none' }}
                data-testid="dialogue-card"
                data-node-id={state.gameState?.currentNodeId || ''}
                data-character-id={state.currentCharacterId}
                data-emotional-beat={
                  state.currentDialogueContent?.interaction === 'ripple' ||
                  state.currentDialogueContent?.interaction === 'bloom' ||
                  state.currentDialogueContent?.interaction === 'shake' ||
                  state.currentNode?.tags?.includes('emotional_beat') ||
                  state.currentNode?.tags?.includes('revelation')
                    ? 'true'
                    : undefined
                }
                data-scene-type={
                  state.currentNode?.tags?.includes('introduction') ? 'introduction' :
                  state.currentNode?.tags?.includes('climax') ? 'climax' :
                  state.currentNode?.tags?.includes('revelation') ? 'revelation' :
                  undefined
                }
              >
                <CardContent
                  className="p-5 sm:p-8 md:p-10 min-h-[200px] sm:min-h-[300px]"
                  data-testid="dialogue-content"
                  data-speaker={state.currentNode?.speaker || ''}
                >
                  {/* Consequence Echo - NPC micro-reaction before their main line */}
                  {state.consequenceEcho && (
                    <div
                      className="text-slate-500 italic text-sm mb-4 animate-fade-in"
                      data-testid="consequence-echo"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {state.consequenceEcho.text}
                    </div>
                  )}
                  <DialogueDisplay
                    key={`dialogue-display-${state.gameState?.currentNodeId || 'none'}-${state.currentCharacterId}-${state.currentContent?.substring(0, 20) || ''}`}
                    text={state.gameState ? TextProcessor.process(state.currentContent || '', state.gameState) : (state.currentContent || '')}
                    useChatPacing={state.useChatPacing}
                    characterName={state.currentNode?.speaker}
                    showAvatar={false}
                    richEffects={getRichEffectContext(state.currentDialogueContent, state.isLoading, state.recentSkills, state.useChatPacing)}
                    interaction={state.currentDialogueContent?.interaction}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Pattern sensations and ambient events removed - keeping UI clean */}

          {/* Ending State - Shows in scroll area when conversation complete */}
          {isEnding && (
            <Card className={`mt-4 rounded-xl shadow-md ${
              state.gameState && isJourneyComplete(state.gameState)
                ? 'bg-gradient-to-b from-amber-50 to-white border-amber-200'
                : ''
            }`}>
              <CardContent className="p-4 sm:p-6 text-center">
                {state.gameState && isJourneyComplete(state.gameState) ? (
                  <>
                    {/* Journey Complete - Full celebration */}
                    <div className="mb-4">
                      <Compass className="w-10 h-10 mx-auto text-amber-600 mb-2" />
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
                        The Station Knows You Now
                      </h3>
                      <p className="text-sm text-slate-600 italic mb-4">
                        Your journey through Grand Central Terminus is complete.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Button
                        onClick={() => {
                          if (state.gameState) {
                            const demonstrations = skillTrackerRef.current?.getAllDemonstrations() || []
                            const narrative = generateJourneyNarrative(state.gameState, demonstrations)
                            setState(prev => ({ ...prev, showJourneySummary: true, journeyNarrative: narrative }))
                          }
                        }}
                        className="w-full min-h-[48px] bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        See Your Journey
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleReturnToStation}
                        className="w-full min-h-[48px] active:scale-[0.98] transition-transform"
                      >
                        Continue Exploring
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Conversation Complete - but journey continues */}
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">
                      Conversation Complete
                    </h3>
                    <Button
                      variant="outline"
                      onClick={handleReturnToStation}
                      className="w-full min-h-[48px] active:scale-[0.98] transition-transform"
                    >
                      Return to Station
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════
          FIXED CHOICES PANEL - Always visible at bottom (Claude/ChatGPT pattern)
          Strong visual distinction from narrative container
          AnimatePresence for smooth exit when conversation ends
          ══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {!isEnding && (
          <motion.footer
            key="choices-footer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex-shrink-0 bg-stone-50 border border-stone-200 shadow-lg mx-3 sm:mx-auto sm:max-w-2xl rounded-2xl"
            style={{
              marginTop: '1rem',
              marginBottom: 'max(1rem, calc(2rem + env(safe-area-inset-bottom, 0px)))'
            }}
          >
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              {/* Scrollable choices container with visual overflow indicator */}
              {/* scroll-snap + touch-action prevents accidental selections during scroll */}
              <div className="relative">
                <div
                  className="max-h-[200px] overflow-y-auto overscroll-contain rounded-lg scroll-smooth"
                  style={{
                    WebkitOverflowScrolling: 'touch',
                    scrollSnapType: 'y proximity', // Gentle snap to choices
                    touchAction: 'pan-y', // Only allow vertical pan, not tap during scroll
                  }}
                >
                <GameChoices
                  choices={state.availableChoices.map((c, index) => {
                    // Detect pivotal moments for marquee effect
                    const nodeTags = state.currentNode?.tags || []
                    const isPivotal = nodeTags.some(tag =>
                      ['pivotal', 'defining_moment', 'final_choice', 'climax', 'revelation', 'introduction'].includes(tag)
                    )
                    // Apply voice variation based on player's dominant pattern
                    const voicedText = state.gameState ? getVoicedChoiceText(
                      c.choice.text,
                      c.choice.voiceVariations,
                      state.gameState.patterns
                    ) : c.choice.text
                    return {
                      text: voicedText,
                      pattern: c.choice.pattern,
                      feedback: c.choice.interaction === 'shake' ? 'shake' : undefined,
                      pivotal: isPivotal,
                      // KOTOR-style orb requirement (if set on choice)
                      requiredOrbFill: c.choice.requiredOrbFill,
                      // Track index for finding the original choice
                      next: String(index)
                    }
                  })}
                  isProcessing={state.isLoading}
                  orbFillLevels={orbFillLevels}
                  onChoice={(c) => {
                    // Use index to find the original choice (stored in 'next' field)
                    const index = parseInt(c.next || '0', 10)
                    const original = state.availableChoices[index]
                    if (original) handleChoice(original)
                  }}
                />
                </div>
              </div>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>

      {/* Share prompts removed - too obtrusive */}

      {/* Error Display */}
      {state.error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="mx-4 max-w-md bg-white rounded-xl shadow-xl border border-red-200 overflow-hidden">
            <div className="px-6 py-4 bg-red-50 border-b border-red-200">
              <h3 className="text-lg font-semibold text-red-800">{state.error.title}</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-slate-700 mb-4">{state.error.message}</p>
              <div className="flex gap-3">
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Refresh Page
                </Button>
                <Button
                  onClick={() => setState(prev => ({ ...prev, error: null }))}
                  variant="outline"
                  className="flex-1"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          OVERLAYS & MODALS - Positioned above everything
          ══════════════════════════════════════════════════════════════════ */}

      {/* Feedback Overlays - Disabled to avoid blocking content */}
      {/* Trust and skill changes are tracked silently in the background */}

      {/* Achievement notifications disabled - obtrusive on mobile */}
      {/* Achievements are still tracked and visible in admin dashboard/journey summary */}

      {/* Experience Summary disabled - breaks immersion, available in menus/maps */}
      {/* Users can view arc summaries in admin dashboard or journey summary when they choose */}

      {/* Thought Cabinet */}
      <ThoughtCabinet
        isOpen={state.showThoughtCabinet}
        onClose={() => setState(prev => ({ ...prev, showThoughtCabinet: false }))}
      />

      {/* Journal */}
      <Journal
        isOpen={state.showJournal}
        onClose={() => setState(prev => ({ ...prev, showJournal: false }))}
      />

      {/* Constellation */}
      <ConstellationPanel
        isOpen={state.showConstellation}
        onClose={() => setState(prev => ({ ...prev, showConstellation: false }))}
      />

      {/* Floating Module Interlude - DISABLED: broke dialogue immersion */}

      {/* Journey Summary - Samuel's narrative of the complete journey */}
      {state.showJourneySummary && state.journeyNarrative && (
        <JourneySummary
          narrative={state.journeyNarrative}
          onClose={() => setState(prev => ({ ...prev, showJourneySummary: false, journeyNarrative: null }))}
        />
      )}

      {/* Pattern Toast - Minimal feedback (Pokemon: Low HP beep principle) */}
      <ProgressToast pattern={state.patternToast} />
    </div>
  )
}