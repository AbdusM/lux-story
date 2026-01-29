/* eslint-disable @typescript-eslint/no-unused-vars -- God Component has many imports used conditionally; cleanup tracked separately */
/* eslint-disable @typescript-eslint/no-explicit-any -- Legacy casts in simulation props; tracked for cleanup */
/* eslint-disable react-hooks/exhaustive-deps -- Complex hook deps require careful audit; tracked separately */
/* eslint-disable prefer-const -- Minor; tracked for cleanup */
'use client'


/**
 * Stateful Game Interface-Main Game Component
 *
 * The central orchestrator for the game experience. Manages all game state,
 * dialogue flow, choice handling, and UI rendering.
 *
 * ========================================================================
 * STRUCTURE MAP (3,363 lines)
 * ========================================================================
 *
 * SECTION 1: IMPORTS (lines 1-145)
 *   80+ imports from lib, content, components
 *
 * SECTION 2: TYPES (lines 147-203)
 * -GameInterfaceState interface
 * -EMERGING_THRESHOLD constant
 *
 * SECTION 3: HELPER FUNCTIONS (lines 204-248)
 * -shouldShowInterrupt()-Interrupt visibility logic
 * -AmbientDescriptionDisplay-Ambient text component
 *
 * SECTION 4: MAIN COMPONENT START (lines 249-408)
 * -Refs (inputDisabledRef, lastChoiceTimeRef, etc.)
 * -Initial state declaration
 * -useState hooks (12 state variables)
 *
 * SECTION 5: MEMOS & CALLBACKS (lines 409-532)
 * -currentEmotion memo
 * -getDominantPattern callback
 * -resetIdleTimer callback
 * -Idle timer useEffect
 *
 * SECTION 6: INITIALIZATION (lines 533-840)
 * -handleAtmosphericIntroStart
 * -initializeGame (async, ~280 lines)
 * -emergencyReset
 *
 * SECTION 7: HANDLE CHOICE (lines 841-2291) ⚠️ LARGEST SECTION
 *   The main choice handler-1,450 lines covering:
 * -State updates (trust, patterns, knowledge flags)
 * -Audio feedback (pattern, trust, identity sounds)
 * -Consequence echoes and derivative calculations
 * -Story arc progression
 * -Cross-character memory and check-ins
 * -Achievement checking
 * -Telemetry and analytics
 * -Node navigation
 *
 * SECTION 8: NODE EFFECTS (lines 2292-2346)
 * -useEffect for node changes
 * -Silence detection timer
 *
 * SECTION 9: INTERRUPT HANDLERS (lines 2347-2535)
 * -handleInterruptTrigger
 * -handleInterruptTimeout
 *
 * SECTION 10: RETURN TO STATION (lines 2536-2767)
 * -handleReturnToStation (~230 lines)
 *
 * SECTION 11: EXPERIENCE HANDLER (lines 2768-2792)
 * -handleExperienceChoice
 *
 * SECTION 12: RENDER (lines 2793-3363)
 * -Intro screens (AtmosphericIntro)
 * -Journey complete (JourneySummary, IdentityCeremony)
 * -Loading states
 * -Main game UI (header, dialogue, choices, panels)
 *
 * ========================================================================
 * REFACTORING NOTES
 * ========================================================================
 *
 * handleChoice (Section 7) is a candidate for extraction into hooks:
 * -useConsequenceProcessor-Echo and consequence logic
 * -useGameAudio-Audio feedback
 * -useStoryArcProgress-Story arc management
 *
 * See: docs/03_PROCESS/STATEFUL_GAME_INTERFACE_ANALYSIS.md
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DialogueDisplay } from '@/components/DialogueDisplay'
import { InterruptButton } from '@/components/game/InterruptButton'
import type { RichTextEffect } from '@/components/RichTextRenderer'
import { AtmosphericIntro } from '@/components/AtmosphericIntro'
import { LivingAtmosphere } from '@/components/LivingAtmosphere' // ISP: Living Interface
import { EnvironmentalEffects } from '@/components/EnvironmentalEffects'
import { calculateAmbientContext, ATMOSPHERES } from '@/content/ambient-descriptions'
import { PatternOrb } from '@/components/PatternOrb'
import { GooeyPatternOrbs, patternScoresToWeights } from '@/components/GooeyPatternOrbs'
import { CharacterAvatar } from '@/components/CharacterAvatar'
import { getTrustLabel } from '@/lib/trust-labels'
import { CharacterState, GameState, GameStateUtils } from '@/lib/character-state'
import { GameLogic } from '@/lib/game-logic'
import { HeroBadge } from '@/components/HeroBadge'
import { StrategyReport } from '@/components/career/StrategyReport'
import { UnifiedMenu } from '@/components/UnifiedMenu'
import { GameStateManager } from '@/lib/game-state-manager'
import { useBackgroundSync } from '@/hooks/useBackgroundSync'
import { useSettingsSync } from '@/hooks/useSettingsSync'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { KeyboardShortcutsHelp } from '@/components/KeyboardShortcutsHelp'
import { StationState, useStationStore } from '@/lib/station-state'
import { filterChoicesByLoad, CognitiveLoadLevel } from '@/lib/cognitive-load' // Fixed: Top-level import
import { generateUserId } from '@/lib/safe-storage'
import {
  DialogueGraph,
  DialogueNode,
  DialogueContent,
  StateConditionEvaluator,
  DialogueGraphNavigator,
  EvaluatedChoice,
  InterruptWindow
} from '@/lib/dialogue-graph'
import {
  CharacterId,
  getGraphForCharacter,
  findCharacterForNode,
  getSafeStart
} from '@/lib/graph-registry'
import { samuelEntryPoints } from '@/content/samuel-dialogue-graph'
import { SkillTracker } from '@/lib/skill-tracker'
import { queueRelationshipSync, queuePlatformStateSync, queueSkillDemonstrationSync, queuePatternDemonstrationSync } from '@/lib/sync-queue'
import { useGameStore, useGameSelectors } from '@/lib/game-store' // RESTORED + TD-001 selectors
import { dashboard } from '@/lib/telemetry/dashboard-feed' // FIXED: Named export is 'dashboard'
import { generativeScore } from '@/lib/audio/generative-score' // ISP: Symphonic Agency
import { CHOICE_HANDLER_TIMEOUT_MS } from '@/lib/constants'
import { logger } from '@/lib/logger'

import { SyncStatusIndicator } from '@/components/SyncStatusIndicator'
import { detectArcCompletion } from '@/lib/arc-learning-objectives'
import { isSupabaseConfigured } from '@/lib/supabase'
// eslint-disable-next-line
import { GameChoices } from '@/components/GameChoices'
import { BookOpen, Stars, Compass } from 'lucide-react'
import { Journal } from '@/components/Journal'
import { SessionSummary } from '@/components/SessionSummary'
import { ConstellationPanel } from '@/components/constellation'
import { SectionErrorBoundary } from '@/components/LayeredErrorBoundaries'
import { StationStatusBadge } from '@/components/StationStatusBadge'
import { TextProcessor } from '@/lib/text-processor'
// InGameSettings removed - consolidated into UnifiedMenu
import { IdleWarningModal } from '@/components/IdleWarningModal'
import { JourneySummary } from '@/components/JourneySummary'
import { useToast } from '@/components/ui/toast'
import { generateJourneyNarrative, isJourneyComplete, type JourneyNarrative } from '@/lib/journey-narrative-generator'
import { evaluateAchievements, type MetaAchievement } from '@/lib/meta-achievements'
import { selectAmbientEvent, IDLE_CONFIG, type AmbientEvent } from '@/lib/ambient-events'
import { PATTERN_TYPES, type PatternType, type PlayerPatterns, getPatternSensation, isValidPattern } from '@/lib/patterns'
import { calculatePatternGain } from '@/lib/identity-system'
import { getPatternRecognitionEcho, createResonanceEchoFromDescription, getVoicedChoiceText, applyPatternReflection, getDiscoveryHint, DISCOVERY_HINTS, type ConsequenceEcho, resolveContentVoiceVariation, applySkillReflection, applyNervousSystemReflection } from '@/lib/consequence-echoes'
import { calculateResonantTrustChange } from '@/lib/pattern-affinity'
import { getEchoIntensity, ECHO_INTENSITY_MODIFIERS, analyzeTrustAsymmetry, getAsymmetryComment, type AsymmetryReaction, calculateInheritedTrust, recordTrustChange, type TrustTimeline, executeInfoTrade, getAvailableInfoTrades, type InfoTradeOffer } from '@/lib/trust-derivatives'
// D-057: Info Trades
import { ALL_INFO_TRADES } from '@/content/info-trades'
// D-056: Knowledge Items
import { KNOWLEDGE_ITEMS, TRADE_CHAINS, getKnowledgeItem, type KnowledgeItem } from '@/content/knowledge-items'
import { calculateCharacterTrustDecay, getPatternRecognitionComments, type PatternRecognitionComment, getUnlockedGates, PATTERN_TRUST_GATES, checkNewAchievements, type PatternAchievement, recordPatternEvolution, type PatternEvolutionHistory } from '@/lib/pattern-derivatives'
import { getNewlyAvailableCombinations, type KnowledgeCombination, recordIcebergMention, getInvestigableTopics, type IcebergReference } from '@/lib/knowledge-derivatives'
import { getActiveTextEffects, getTextEffectClasses, getTextEffectStyles, getActiveMagicalRealisms, type MagicalRealism, getNewlyDiscoveredArcs, getCascadeEffectsForFlag, getNarrativeFraming, getUnlockedMetaRevelations, type EmergentStoryArc, type CascadeEffect, type MetaNarrativeRevelation } from '@/lib/narrative-derivatives'
import { getActiveEnvironmentalEffects, getAvailableCrossCharacterExperiences, type EnvironmentalEffect, type CrossCharacterRequirement } from '@/lib/character-derivatives'
import { getRelevantCrossCharacterEcho } from '@/lib/character-relationships'
import {
  INTERRUPT_PATTERN_ALIGNMENT,
  INTERRUPT_COMBO_CHAINS,
  startComboChain,
  advanceComboChain,
  isComboChainComplete,
  getComboChainReward,
  isComboChainExpired,
  getAvailableComboChains,
  type ActiveComboState,
  type InterruptComboChain
} from '@/lib/interrupt-derivatives'
// checkTransformationEligible + TransformationMoment moved to choice-processing.ts
import { loadEchoQueue, saveEchoQueue, queueEchosForFlag, getAndUpdateEchosForCharacter, type CrossCharacterEchoQueueState } from '@/lib/cross-character-memory'
import { CheckInQueue } from '@/lib/character-check-ins'
import { UnlockManager } from '@/lib/unlock-manager'
import { ABILITIES } from '@/lib/abilities'
import { THOUGHT_REGISTRY } from '@/content/thoughts'
import { CROSS_CHARACTER_ECHOES, getEchosForFlag } from '@/lib/cross-character-echoes'
import { getArcCompletionFlag } from '@/lib/arc-learning-objectives'
import { getPatternVoice, incrementPatternVoiceNodeCounter, checkVoiceConflict, type PatternVoiceResult, type PatternVoiceContext, type VoiceConflictResult } from '@/lib/pattern-voices'
import { PATTERN_VOICE_LIBRARY } from '@/content/pattern-voice-library'
import { PatternVoice } from '@/components/game/PatternVoice'
import { useOrbs, type OrbMilestones } from '@/hooks/useOrbs'
// Analytics Hooks
import { trackUserOnNode, recordVisit } from '@/lib/admin-analytics'
// Complex Character Hooks
import { processComplexCharacterTick } from '@/lib/character-complex'
// D-061: Story Arc System
import { checkArcUnlock, startStoryArc, completeChapter, getCurrentChapter } from '@/lib/story-arcs'
import { ALL_STORY_ARCS, getArcById } from '@/content/story-arcs'
// D-083: Synthesis Puzzles
import { SYNTHESIS_PUZZLES, type SynthesisPuzzle } from '@/content/synthesis-puzzles'
// Engagement Loop Systems
import { detectReturningPlayer, getWaitingCharacters, getSamuelWaitingSummary, type CharacterWaitingState } from '@/lib/character-waiting'
import { queueGiftForChoice, queueGiftsForArcComplete, tickGiftCounters, getReadyGiftsForCharacter, consumeGift, serializeGiftQueue, deserializeGiftQueue, type DelayedGift } from '@/lib/delayed-gifts'
// ProgressToast removed-Journal glow effect replaces it
import { selectAnnouncement } from '@/lib/platform-announcements'
import { checkSessionBoundary, incrementBoundaryCounter, getTotalNodesVisited, type SessionAnnouncement } from '@/lib/session-structure'
import { setupPlayTimeTracking } from '@/lib/session-tracker'
import { SessionBoundaryAnnouncement } from '@/components/SessionBoundaryAnnouncement'
import { IdentityCeremony } from '@/components/IdentityCeremony'
import { JourneyComplete } from '@/components/JourneyComplete'
import { useAudioDirector } from '@/hooks/game/useAudioDirector'
import { useGameInitializer } from '@/hooks/game/useGameInitializer'
import { useIdleAmbience } from '@/hooks/game/useIdleAmbience'
import { useReturnToStation } from '@/hooks/game/useReturnToStation'
import { useChoiceHandler } from '@/hooks/game/useChoiceHandler'
import { resolveNode } from '@/hooks/game/useNarrativeNavigator'
import { computeTrustFeedback, computePatternEcho, computeOrbMilestoneEcho, computeTransformation, computeTrustFeedbackMessage, computeSkillTracking } from '@/lib/choice-processing'
// useNarrativeNavigator available but not yet wired — see hooks/game/useNarrativeNavigator.ts
// OnboardingScreen removed-discovery-based learning via Samuel's firstOrb echo instead
// FoxTheatreGlow import removed-unused
import { ExperienceRenderer } from '@/components/game/ExperienceRenderer'
import { SimulationRenderer } from '@/components/game/SimulationRenderer'
import { GameErrorBoundary } from '@/components/GameErrorBoundary'
import { ChatPacedDialogue } from '@/components/ChatPacedDialogue'
import { ConsequenceEchoDisplay } from '@/components/game/ConsequenceEchoDisplay'
import { useWaitingRoom } from '@/hooks/useWaitingRoom'
import { WaitingRoomIndicator, WaitingRoomRevealToast } from '@/components/ui/WaitingRoomIndicator'
import { getPatternUnlockChoices } from '@/lib/pattern-unlock-choices'
import { calculateSkillDecay, getSkillDecayNarrative } from '@/lib/assessment-derivatives'
// Share prompts removed-too obtrusive

// Trust feedback now dialogue-based via consequence echoes

// Types, helpers, and presentational components extracted to:
// - lib/game-interface-types.ts (GameInterfaceState, characterNames)
// - lib/interrupt-visibility.ts (shouldShowInterrupt, EMERGING_THRESHOLD)
// - components/game/AmbientDescriptionDisplay.tsx
import type { GameInterfaceState } from '@/lib/game-interface-types'
import { characterNames } from '@/lib/game-interface-types'
import { shouldShowInterrupt } from '@/lib/interrupt-visibility'
import { AmbientDescriptionDisplay } from '@/components/game/AmbientDescriptionDisplay'
import { GameHeader } from '@/components/game/GameHeader'
import { GameFooter } from '@/components/game/GameFooter'
import { EndingPanel } from '@/components/game/EndingPanel'
import type { ExperienceSummaryData } from '@/components/ExperienceSummary'

export default function StatefulGameInterface() {
  const safeStart = getSafeStart()

  // Orb earning-SILENT during gameplay (discovery in Journal)
  const { earnOrb, earnBonusOrbs, hasNewOrbs, markOrbsViewed, getUnacknowledgedMilestone, acknowledgeMilestone, balance: orbBalance } = useOrbs()

  // Settings sync - automatically sync settings to cloud when authenticated
  const { pushNow: pushSettingsToCloud } = useSettingsSync()

  // Keyboard shortcuts
  const { registerHandler, shortcuts, updateShortcut, resetShortcuts } = useKeyboardShortcuts()
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false)

  // Toast notifications for keyboard hint
  const toast = useToast()

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
    activeExperience: null,
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
    recentSkills: [],
    showExperienceSummary: false,
    experienceSummaryData: null,
    showJournal: false,
    showConstellation: false,
    pendingFloatingModule: null,
    showJourneySummary: false,
    showReport: false,
    journeyNarrative: null,
    achievementNotification: null,
    ambientEvent: null,
    patternSensation: null,
    consequenceEcho: null,
    sessionBoundary: null,
    previousTotalNodes: 0,
    showIdentityCeremony: false,
    ceremonyPattern: null,
    showPatternEnding: false,
    endingPattern: null,
    hasNewTrust: false,
    hasNewMeeting: false,
    isProcessing: false,
    activeInterrupt: null,
    patternVoice: null,
    voiceConflict: null,
    activeComboChain: null,
    waitingCharacters: [],
    pendingGift: null,
    isReturningPlayer: false,
    // activeExperience: null
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // TD-001 STEP 3a: ZUSTAND GAME STATE (Single Source of Truth)
  // Read game state from Zustand. During migration, we use a shim that prefers
  // Zustand but falls back to React state. The fallback triggers a dev warning.
  // ═══════════════════════════════════════════════════════════════════════════
  const zustandGameState = useGameSelectors.useCoreGameStateHydrated()

  // Dev-loud shim: warn if fallback is used (indicates incomplete migration)
  const gameState = useMemo((): GameState | null => {
    if (zustandGameState) {
      return zustandGameState
    }
    // Fallback to React state during migration
    if (state.gameState && process.env.NODE_ENV === 'development') {
      // Only warn once per mount to avoid console spam
      console.warn(
        '[TD-001 Migration] Using legacy React gameState fallback. ' +
        'This indicates Zustand state is null but React state exists. ' +
        'Investigate if this persists after initialization.'
      )
    }
    return state.gameState ?? null
  }, [zustandGameState, state.gameState])

  // Audio Director hook (Phase 1.1 extraction)
  const audio = useAudioDirector(state.consequenceEcho, pushSettingsToCloud)

  const audioVolume = audio.state.audioVolume

  // 5. GOD MODE OVERRIDE-Access from zustand store (conditional render at end of component)
  const debugSimulation = useGameStore(s => s.debugSimulation)

  // Force re-render when God Mode navigates (refreshCounter increments trigger React update)
  const refreshCounter = useGameStore(s => s.refreshCounter)

  // Derived State for UI Logic
  // TD-001: Use gameState from shim (prefers Zustand)
  const currentState = gameState ? 'dialogue' : 'station'

  // Rich effects config-KEEPING NEW STAGGERED MODE
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
  const pendingSaveRef = useRef<NodeJS.Timeout | null>(null) // Deferred save for pagehide flush

  // Share prompts disabled-too obtrusive
  // isProcessingChoiceRef and choiceAttemptIdRef moved to useChoiceHandler hook
  const contentLoadTimestampRef = useRef<number>(Date.now()) // Track when content appeared
  const { queueStats: _queueStats } = useBackgroundSync({ enabled: true })
  const [hasSaveFile, setHasSaveFile] = useState(false)
  const [_saveIsComplete, setSaveIsComplete] = useState(false)

  // Save confirmation disabled-saves happen silently without interruption
  // Achievement notifications disabled-no longer needed

  // Reset timestamp when content changes (new node displayed)
  useEffect(() => {
    contentLoadTimestampRef.current = Date.now()
  }, [state.currentContent])

  // Page unload save durability - wire session tracking
  useEffect(() => {
    const cleanup = setupPlayTimeTracking()
    return cleanup
  }, [])

  // Flush deferred saves on page hide (tab close, navigation)
  useEffect(() => {
    const flushSave = () => {
      if (pendingSaveRef.current && gameState) {
        clearTimeout(pendingSaveRef.current)
        GameStateManager.saveGameState(gameState)
        pendingSaveRef.current = null
      }
    }
    window.addEventListener('pagehide', flushSave)
    return () => window.removeEventListener('pagehide', flushSave)
  }, [gameState])

  // 3. LOAD GAME ID
  useEffect(() => {
    // Check for save
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

  // Register keyboard shortcut handlers
  useEffect(() => {
    // Navigation shortcuts
    registerHandler('toggleJournal', () => {
      setState(prev => ({ ...prev, showJournal: !prev.showJournal }))
    })
    registerHandler('toggleConstellation', () => {
      setState(prev => ({ ...prev, showConstellation: !prev.showConstellation }))
    })
    registerHandler('toggleReport', () => {
      setState(prev => ({ ...prev, showReport: !prev.showReport }))
    })

    // Action shortcuts
    registerHandler('toggleMute', () => {
      audio.actions.toggleMute()
    })
    registerHandler('openSettings', () => {
      window.location.href = '/profile'
    })
    registerHandler('openHelp', () => {
      setShowShortcutsHelp(true)
    })

    // Choice selection shortcuts
    registerHandler('selectChoice1', () => {
      const button = document.querySelector('[data-choice-index="0"]') as HTMLButtonElement
      button?.click()
    })
    registerHandler('selectChoice2', () => {
      const button = document.querySelector('[data-choice-index="1"]') as HTMLButtonElement
      button?.click()
    })
    registerHandler('selectChoice3', () => {
      const button = document.querySelector('[data-choice-index="2"]') as HTMLButtonElement
      button?.click()
    })
    registerHandler('selectChoice4', () => {
      const button = document.querySelector('[data-choice-index="3"]') as HTMLButtonElement
      button?.click()
    })
    registerHandler('focusChoices', () => {
      const firstChoice = document.querySelector('[data-choice-index="0"]') as HTMLButtonElement
      firstChoice?.focus()
    })

    // General shortcuts
    registerHandler('escape', () => {
      if (state.showJournal) setState(prev => ({ ...prev, showJournal: false }))
      else if (state.showConstellation) setState(prev => ({ ...prev, showConstellation: false }))
      else if (state.showReport) setState(prev => ({ ...prev, showReport: false }))
      else if (showShortcutsHelp) setShowShortcutsHelp(false)
    })
  }, [registerHandler, state.showJournal, state.showConstellation, state.showReport, showShortcutsHelp, audio.actions])

  // Keyboard shortcut hint - show after 30 seconds of gameplay (only once)
  useEffect(() => {
    if (!state.hasStarted) return

    // Check if already shown
    const hintShown = localStorage.getItem('lux_keyboard_hint_shown')
    if (hintShown === 'true') return

    const timer = setTimeout(() => {
      // Double-check it hasn't been shown (e.g., user opened shortcuts manually)
      if (localStorage.getItem('lux_keyboard_hint_shown') !== 'true') {
        toast.info('Press ? for keyboard shortcuts', 'Navigate faster with hotkeys')
        localStorage.setItem('lux_keyboard_hint_shown', 'true')
      }
    }, 30000) // 30 seconds

    return () => clearTimeout(timer)
  }, [state.hasStarted, toast])

  // God Mode Refresh: Reload dialogue when refreshCounter changes (God Mode navigation)
  useEffect(() => {
    if (!gameState || refreshCounter === 0) return

    const coreState = useGameStore.getState().coreGameState
    if (!coreState) return

    // Reload dialogue from coreGameState
    const characterId = coreState.currentCharacterId as CharacterId
    const nodeId = coreState.currentNodeId
    const graph = getGraphForCharacter(characterId, gameState)
    const node = graph.nodes.get(nodeId)

    if (node) {
      logger.info('[God Mode Refresh] Reloading dialogue', { characterId, nodeId })

      // Apply voice variation pipeline for consistency
      const content = node.content[0]
      const gamePatterns = gameState!.patterns
      const skillLevels = gameState!.skillLevels
      const charState = gameState!.characters.get(characterId)

      // Apply pattern reflection first
      const mergedPatternReflection = node.patternReflection || content.patternReflection
      let reflected = applyPatternReflection(content.text, content.emotion, mergedPatternReflection, gamePatterns)

      // Apply voice variations (NPC responds to player's dominant pattern)
      const contentWithReflection = { ...content, text: reflected.text, emotion: reflected.emotion }
      const voiceVaried = resolveContentVoiceVariation(contentWithReflection, gamePatterns)
      const skillReflected = applySkillReflection(voiceVaried, skillLevels)
      const fullyReflected = applyNervousSystemReflection(skillReflected, charState?.nervousSystemState)

      // Update reflected with all bidirectional reflections
      reflected = { text: fullyReflected.text, emotion: fullyReflected.emotion || reflected.emotion }

      setState(prev => ({
        ...prev,
        currentNode: node,
        currentGraph: graph,
        currentCharacterId: characterId,
        currentContent: reflected.text,
        currentDialogueContent: { ...content, text: reflected.text, emotion: reflected.emotion },
        availableChoices: StateConditionEvaluator.evaluateChoices(node, gameState!, characterId, gameState!.skillLevels),
        previousSpeaker: null
      }))
    }
  }, [refreshCounter])

  // 4. NAVIGATION BRIDGE (Connects Constellation Panel to Game Interface)
  // Listen for navigation requests from the Zustand store
  const requestedSceneId = useGameStore(s => s.currentSceneId)

  useEffect(() => {
    if (!requestedSceneId || !gameState) return

    // Logic: If it's a CharacterID, go to their Intro/Hub. If it's a NodeID, go there.
    // We assume it's a CharacterID first
    const targetCharId = requestedSceneId as CharacterId

    // ============= CONDUCTOR MODE LOGIC =============
    // D-102: Route all travel through Samuel (The Conductor) unless:
    // 1. We are already talking to Samuel (avoid loops)
    // 2. The target IS Samuel (direct travel permitted)
    // 3. It's a specific internal node jump (contains underscores not ending in 'introduction')

    // Check if it's a "Travel" command (Character ID) or a specific node jump
    const isCharacterJump = !requestedSceneId.includes('_') || requestedSceneId.endsWith('_introduction')
    const isTargetSamuel = targetCharId === 'samuel' || requestedSceneId.startsWith('samuel_')
    const currentIsSamuel = state.currentCharacterId === 'samuel'

    if (isCharacterJump && !isTargetSamuel && !currentIsSamuel) {
      logger.info('[Conductor Mode] Intercepting travel request', { target: targetCharId })

      // 1. Store the destination
      useGameStore.getState().setPendingTravelTarget(targetCharId)

      // 2. Clear the request to stop this hook re-firing immediately
      useGameStore.getState().setCurrentScene(null)

      // 3. Immediately trigger navigation to Samuel's Conductor Node
      // We manually set state here because we can't use setCurrentScene (would loop)
      const conductorNodeId = 'samuel_conductor'
      const samuelGraph = getGraphForCharacter('samuel', gameState)
      const conductorNode = samuelGraph.nodes.get(conductorNodeId)


      if (conductorNode) {
        // Dynamic Variable Injection for Conductor Mode
        const targetCharacter = gameState?.characters.get(targetCharId)
        const hasMet = (targetCharacter?.conversationHistory?.length || 0) > 0
        const targetName = characterNames[targetCharId] || 'someone'
        const conductorAction = hasMet ? 'Heading back to' : 'Off to see'

        // Pre-process the content with the variables
        const processedText = TextProcessor.process(
          conductorNode.content[0].text,
          gameState!,
          { targetName, conductorAction }
        )

        setState(prev => ({
          ...prev,
          currentNode: conductorNode,
          currentGraph: samuelGraph,
          currentCharacterId: 'samuel',
          currentContent: processedText, // Injected name
          currentDialogueContent: conductorNode.content[0],
          availableChoices: StateConditionEvaluator.evaluateChoices(conductorNode, gameState!, 'samuel', gameState!.skillLevels),
          previousSpeaker: null
        }))
        return // Stop processing the direct jump
      }
    }

    // ============= GOD MODE CONDUCTOR =============
    // Handle God Mode simulation requests that go through Samuel
    if (requestedSceneId === 'samuel_conductor_god_mode') {
      logger.info('[God Mode Conductor] Routing simulation through Samuel')

      // Clear the request
      useGameStore.getState().setCurrentScene(null)

      // Navigate to Samuel's God Mode conductor node
      const conductorNodeId = 'samuel_conductor_god_mode'
      const samuelGraph = getGraphForCharacter('samuel', gameState)
      const conductorNode = samuelGraph.nodes.get(conductorNodeId)

      if (conductorNode) {
        const pendingSim = useGameStore.getState().pendingGodModeSimulation
        const simTitle = pendingSim?.title?.replace('[DEBUG] ', '') || 'a simulation'

        // Pre-process content with simulation title
        const processedText = TextProcessor.process(
          conductorNode.content[0].text,
          gameState!,
          { simulationTitle: simTitle }
        )

        setState(prev => ({
          ...prev,
          currentNode: conductorNode,
          currentGraph: samuelGraph,
          currentCharacterId: 'samuel',
          currentContent: processedText,
          currentDialogueContent: conductorNode.content[0],
          availableChoices: StateConditionEvaluator.evaluateChoices(conductorNode, gameState!, 'samuel', gameState!.skillLevels),
          previousSpeaker: null
        }))
        return
      }
    }
    // ===============================================

    // Default to [char]_introduction convention
    const targetNodeId = `${requestedSceneId}_introduction`
    const graph = getGraphForCharacter(targetCharId, gameState)

    // Check if the graph actually has this node, otherwise fallback to first node
    let targetNode = graph.nodes.get(targetNodeId)
    if (!targetNode && graph.nodes.size > 0) {
      // Fallback: Pick the first node in the graph (usually the entry)
      targetNode = graph.nodes.values().next().value
    }

    if (targetNode) {
      logger.info('Navigating via Constellation', { target: requestedSceneId, resolvedNode: targetNode.nodeId })

      // Apply voice variation pipeline for consistency
      const content = targetNode.content[0]
      const gamePatterns = gameState!.patterns
      const skillLevels = gameState!.skillLevels
      const charState = gameState!.characters.get(targetCharId)

      // Apply pattern reflection first
      const mergedPatternReflection = targetNode.patternReflection || content.patternReflection
      let reflected = applyPatternReflection(content.text, content.emotion, mergedPatternReflection, gamePatterns)

      // Apply voice variations (NPC responds to player's dominant pattern)
      const contentWithReflection = { ...content, text: reflected.text, emotion: reflected.emotion }
      const voiceVaried = resolveContentVoiceVariation(contentWithReflection, gamePatterns)
      const skillReflected = applySkillReflection(voiceVaried, skillLevels)
      const fullyReflected = applyNervousSystemReflection(skillReflected, charState?.nervousSystemState)

      // Update reflected with all bidirectional reflections
      reflected = { text: fullyReflected.text, emotion: fullyReflected.emotion || reflected.emotion }

      // Update State to Render New Scene
      setState(prev => ({
        ...prev,
        currentNode: targetNode!,
        currentGraph: graph,
        currentCharacterId: targetCharId,
        currentContent: reflected.text,
        currentDialogueContent: { ...content, text: reflected.text, emotion: reflected.emotion },
        availableChoices: StateConditionEvaluator.evaluateChoices(targetNode!, gameState!, targetCharId, gameState!.skillLevels),
        previousSpeaker: null, // Reset speaker on jump
        consequenceEcho: null  // Clear echo from previous character
      }))

      // Persist the jump
      const newState = {
        ...gameState,
        currentNodeId: targetNode.nodeId,
        currentCharacterId: targetCharId
      }
      GameStateManager.saveGameState(newState)
    }

    // Reset the request so we don't loop
    useGameStore.getState().setCurrentScene(null)

  }, [requestedSceneId, gameState, state.currentCharacterId])

  // ═══════════════════════════════════════════════════════════════════════════
  // STATION EVOLUTION: Sync Station State & Ambience
  // ═══════════════════════════════════════════════════════════════════════════
  // require statements removed-using top-level imports

  // Sync Ambient Context when GameState changes
  useEffect(() => {
    if (gameState) {
      try {
        const context = calculateAmbientContext(gameState)
        useStationStore.getState().setAtmosphere(context.atmosphere)

        // Update local ambient description for UI
        // We only show this if we are "idle" or in the Hub (Samuel)
        if (state.currentCharacterId === 'samuel') {
          // We can inject this into the UI state if we want to show it
          // For now, let's just make sure the store is updated
        }
      } catch (e) {
        console.warn('Failed to sync station ambience', e)
      }
    }
  }, [gameState, state.currentCharacterId])

  // P5: Sync station atmosphere with game state
  useEffect(() => {
    if (gameState) {
      import('@/lib/station-logic').then(({ updateStationState }) => {
        updateStationState(gameState!)
      })
    }
  }, [gameState?.globalFlags?.size, gameState?.globalFlags]) // Re-run when flags change

  // P5: Derive Atmospheric Emotion (Moved to top level to avoid conditional hook error)
  const stationAtmosphere = useStationStore(s => s.atmosphere)
  const cognitiveLoad = useStationStore(s => s.cognitiveLoad)
  const currentEmotion = useMemo(() => {
    if (stationAtmosphere === 'tense') return 'anxiety'
    if (stationAtmosphere === 'awakening') return 'fear_awe'

    // Character-based overrides
    const char = gameState?.characters.get(state.currentCharacterId)
    if (char && char.anxiety > 60) return 'anxiety'

    // Location-based overrides
    if (state.currentCharacterId === 'deep_station') return 'fear_awe'
    if (state.currentCharacterId === 'market') return 'curiosity'

    return 'neutral'
  }, [stationAtmosphere, gameState, state.currentCharacterId])

  // Idle ambience system — extracted to hook
  useIdleAmbience({ state, setState })

  // Waiting Room patience mechanic — reveals hidden content when player lingers
  const [activeWaitingReveal, setActiveWaitingReveal] = useState<{ text: string; type: 'ambient' | 'memory' | 'whisper' | 'insight'; speaker?: string } | null>(null)
  const waitingRoom = useWaitingRoom({
    characterId: state.hasStarted ? state.currentCharacterId : null,
    enabled: state.hasStarted && !state.isProcessing,
    onReveal: (reveal) => {
      setActiveWaitingReveal({
        text: reveal.content.text,
        type: reveal.content.type,
        speaker: reveal.content.speaker,
      })
    },
  })

  // Helper to clean atmospheric tags
  const cleanContent = (text: string) => {
    return text.replace(/\[atmospheric.*?\]/gi, '').trim()
  }

  // Audio Immersion: Consequence echo sounds handled by useAudioDirector

  // Game initialization, emergency reset, and atmospheric intro start — extracted to hook
  const { initializeGame, handleAtmosphericIntroStart, emergencyReset } = useGameInitializer({
    setState,
    safeStart,
    skillTrackerRef,
    activeExperience: state.activeExperience,
  })

  // Choice handler — extracted to useChoiceHandler hook
  const { handleChoice, isProcessingRef: isProcessingChoiceRef } = useChoiceHandler({
    state,
    setState,
    audio,
    skillTrackerRef,
    contentLoadTimestampRef,
    earnOrb,
    earnBonusOrbs,
    getUnacknowledgedMilestone,
    acknowledgeMilestone,
  })

  // ISP: Active Silence Detection
  // Check if the player is being silent and if the current node has a specific reaction to it
  useEffect(() => {
    // Only run if we are in a dialogue state and not processing
    if (!gameState || !state.currentNode || state.isProcessing || state.activeInterrupt) return

    // Clear any existing timer
    const silenceTimer = setTimeout(() => {
      // 1. Check if we're still on the same node (ensured by cleanup)
      // 2. Check if current node has a silence variation
      const node = state.currentNode!
      const silenceVariation = node.content.find(c =>
        c.condition &&
        c.condition.hasGlobalFlags &&
        c.condition.hasGlobalFlags.includes('temporary_silence')
      )

      if (silenceVariation) {
        // 3. Trigger active interrupt
        logger.info('[StatefulGameInterface] Silence detected. Triggering dynamic reaction.', { nodeId: node.nodeId })

        const activeSilenceState: GameState = gameState ? {
          ...gameState,
          saveVersion: gameState.saveVersion || '1.0', // Ensure string
          globalFlags: new Set([...gameState.globalFlags, 'temporary_silence'])
        } : gameState!

        // Select the new content
        const newContent = DialogueGraphNavigator.selectContent(node, [], activeSilenceState)

        // Only update if different
        if (newContent.variation_id !== state.currentDialogueContent?.variation_id) {
          // Apply pattern reflection
          const reflected = applyPatternReflection(
            newContent.text,
            newContent.emotion,
            newContent.patternReflection,
            activeSilenceState.patterns
          )

          setState(prev => ({
            ...prev,
            currentContent: reflected.text,
            currentDialogueContent: { ...newContent, text: reflected.text, emotion: reflected.emotion },
            // feedback for the player?
            patternSensation: "The silence speaks..."
          }))
        }
      }
    }, 15000) // 15 seconds threshold

    return () => clearTimeout(silenceTimer)
  }, [state.currentNode, state.currentContent, state.isProcessing, state.activeInterrupt, gameState]) // Reset on content change

  /**
   * Handle interrupt trigger-player acted during NPC speech
   */
  const handleInterruptTrigger = useCallback(() => {
    const interrupt = state.activeInterrupt
    if (!interrupt || !gameState) return

    logger.info('[StatefulGameInterface] Interrupt triggered:', { action: interrupt.action, targetNodeId: interrupt.targetNodeId })

    // Apply interrupt consequence if present
    let newGameState = gameState
    if (interrupt.consequence) {
      newGameState = GameStateUtils.applyStateChange(newGameState, interrupt.consequence)
    }

    // D-084: Track interrupt combo chains
    let newComboChain = state.activeComboChain

    // Check if current combo is expired
    if (newComboChain && isComboChainExpired(newComboChain)) {
      logger.info('[StatefulGameInterface] D-084: Combo chain expired', { chainId: newComboChain.chainId })
      newComboChain = null
    }

    // Check if this interrupt advances or starts a combo
    if (newComboChain) {
      // Check if interrupt type matches current step
      const chain = INTERRUPT_COMBO_CHAINS.find(c => c.id === newComboChain!.chainId)
      if (chain) {
        const currentStepIndex = newComboChain.currentStep - 1
        if (currentStepIndex < chain.steps.length) {
          const expectedStep = chain.steps[currentStepIndex]
          if (interrupt.type === expectedStep.interruptType) {
            // Advance the combo!
            newComboChain = advanceComboChain(newComboChain, expectedStep)
            logger.info('[StatefulGameInterface] D-084: Combo chain advanced!', {
              chainId: newComboChain.chainId,
              step: newComboChain.currentStep,
              successText: expectedStep.successText
            })

            // Check if combo is complete
            if (isComboChainComplete(newComboChain)) {
              const reward = getComboChainReward(newComboChain)
              if (reward) {
                logger.info('[StatefulGameInterface] D-084: Combo chain COMPLETE!', {
                  chainId: newComboChain.chainId,
                  reward
                })
                // Apply combo rewards
                newGameState = GameStateUtils.applyStateChange(newGameState, {
                  trustChange: reward.trustBonus,
                  patternChanges: { [reward.patternBonus.pattern]: reward.patternBonus.amount }
                })
                if (reward.specialFlag) {
                  newGameState = GameStateUtils.applyStateChange(newGameState, {
                    addGlobalFlags: [reward.specialFlag]
                  })
                }
              }
              newComboChain = null // Reset after completion
            }
          } else {
            // Wrong interrupt type-chain broken
            logger.info('[StatefulGameInterface] D-084: Combo chain broken-wrong type', {
              expected: expectedStep.interruptType,
              got: interrupt.type
            })
            newComboChain = null
          }
        }
      }
    } else {
      // No active combo-check if this interrupt starts one
      const availableChains = getAvailableComboChains(newGameState.patterns)
      const matchingChain = availableChains.find(chain =>
        chain.steps[0].interruptType === interrupt.type
      )
      if (matchingChain) {
        newComboChain = startComboChain(matchingChain.id)
        if (newComboChain) {
          // Advance past first step since we just completed it
          newComboChain = advanceComboChain(newComboChain, matchingChain.steps[0])
          logger.info('[StatefulGameInterface] D-084: Combo chain started!', {
            chainId: matchingChain.id,
            chainName: matchingChain.name
          })
        }
      }
    }

    // Navigate to the interrupt target node via centralized resolver
    const navResult = resolveNode(interrupt.targetNodeId, newGameState, [])
    if (!navResult.success) {
      logger.error('[StatefulGameInterface] Interrupt navigation failed:', {
        nodeId: interrupt.targetNodeId,
        errorCode: navResult.errorCode,
      })
      setState(prev => ({ ...prev, activeInterrupt: null }))
      return
    }

    // TD-001: Write to Zustand ONLY (single source of truth)
    useGameStore.getState().setCoreGameState(GameStateUtils.serialize(newGameState))
    GameStateManager.saveGameState(newGameState)

    // Update UI-ephemeral state (no gameState - now in Zustand)
    setState(prev => ({
      ...prev,
      currentNode: navResult.nextNode,
      currentGraph: navResult.targetGraph,
      currentCharacterId: navResult.targetCharacterId,
      availableChoices: navResult.availableChoices,
      currentContent: navResult.reflectedText,
      currentDialogueContent: { ...navResult.content, text: navResult.reflectedText, emotion: navResult.reflectedEmotion },
      activeInterrupt: shouldShowInterrupt(navResult.content.interrupt, newGameState.patterns), // D-009: Filter by pattern
      activeComboChain: newComboChain  // D-084: Track combo chain state
    }))
  }, [state.activeInterrupt, gameState, state.activeComboChain])

  /**
   * Handle interrupt timeout-player didn't act
   */
  const handleInterruptTimeout = useCallback(() => {
    const interrupt = state.activeInterrupt
    if (!interrupt || !gameState) return

    logger.info('[StatefulGameInterface] Interrupt timed out:', { action: interrupt.action })

    // Clear the interrupt-if there's a missedNodeId, navigate there
    if (interrupt.missedNodeId) {
      const missedNav = resolveNode(interrupt.missedNodeId, gameState, [])
      if (missedNav.success) {
        // D-084: Reset combo chain when interrupt is missed
        setState(prev => ({
          ...prev,
          currentNode: missedNav.nextNode,
          currentGraph: missedNav.targetGraph,
          currentCharacterId: missedNav.targetCharacterId,
          availableChoices: missedNav.availableChoices,
          currentContent: missedNav.reflectedText,
          currentDialogueContent: { ...missedNav.content, text: missedNav.reflectedText, emotion: missedNav.reflectedEmotion },
          activeInterrupt: gameState ? shouldShowInterrupt(missedNav.content.interrupt, gameState.patterns) : null, // D-009: Filter by pattern
          activeComboChain: null  // D-084: Reset combo on missed interrupt
        }))
        return
      }
    }

    // No missedNodeId or it wasn't found-just clear the interrupt
    // D-084: Also reset combo chain
    setState(prev => ({ ...prev, activeInterrupt: null, activeComboChain: null }))
  }, [state.activeInterrupt, gameState])

  /**
   * Navigate back to Samuel's hub after completing a conversation
   * Determines the appropriate entry point based on completed arcs
   */
  // Return to station — extracted to hook
  const { handleReturnToStation } = useReturnToStation({ state, setState })

  // Experience Choice Handler
  const handleExperienceChoice = useCallback((choiceId: string) => {
    if (!state.activeExperience || !gameState) return

    import("@/lib/experience-engine").then(({ ExperienceEngine }) => {
      const result = ExperienceEngine.processChoice(state.activeExperience!, choiceId, gameState!)

      const newGameState = { ...gameState!, ...result.updates }

      // TD-001: Write to Zustand ONLY (single source of truth)
      useGameStore.getState().setCoreGameState(GameStateUtils.serialize(newGameState))
      GameStateManager.saveGameState(newGameState)

      // Update UI-ephemeral state (no gameState - now in Zustand)
      setState(prev => ({
        ...prev,
        activeExperience: result.isComplete ? null : result.newState,
      }))
    })
  }, [state.activeExperience, gameState])


  // Render Logic-Restored Card Layout
  // Onboarding removed-discovery-based learning happens via Samuel's firstOrb echo
  if (!state.hasStarted) {
    if (!hasSaveFile) return <AtmosphericIntro onStart={handleAtmosphericIntroStart} />
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-3 sm:p-4 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          {/* Header */}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-6">
            Terminus
          </h1>

          {/* Welcome back message */}
          <div className="glass-panel rounded-xl p-6 sm:p-8 mb-8">
            <p className="text-lg sm:text-xl text-slate-100 leading-relaxed mb-2">
              Welcome back, traveler.
            </p>
            <p className="text-base text-slate-400 leading-relaxed">
              The station remembers you.
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <Button
              onClick={initializeGame}
              variant="default"
              size="lg"
              className="w-full sm:w-auto min-h-[48px] px-8 bg-violet-600 hover:bg-violet-500 text-white font-semibold shadow-lg shadow-violet-900/30"
            >
              Continue Journey
            </Button>
            <div>
              <Button
                onClick={() => {
                  // Clear all save data for true reset
                  GameStateManager.nuclearReset()
                  window.location.reload()
                }}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-slate-200 hover:bg-white/5"
              >
                Start Over
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }




  const currentCharacter = gameState?.characters.get(state.currentCharacterId)
  const isEnding = state.availableChoices.length === 0

  // GOD MODE OVERRIDE-Render simulation if active (must be at end after all hooks)
  if (debugSimulation) {
    return (
      <GameErrorBoundary componentName="GodModeSimulation">
        <SimulationRenderer
          simulation={{
            ...debugSimulation,
            // Inject explicit back button for God Mode
            onExit: () => useGameStore.getState().setDebugSimulation(null)
          }}
          onComplete={(result) => {
            logger.info('God Mode Simulation Complete', result)
            useGameStore.getState().setDebugSimulation(null)
          }}
        />
      </GameErrorBoundary>
    )

  }

  return (
    <LivingAtmosphere
      characterId={state.currentCharacterId}
      emotion={currentEmotion === 'neutral' ? 'calm' : currentEmotion}
      className={currentState === 'station' ? 'cursor-default' : ''}
    >
      {/* Environmental body class manager - applies pattern/character atmosphere to <body> */}
      <EnvironmentalEffects gameState={gameState} />
      <div
        className="relative z-10 flex flex-col min-h-[100dvh] w-full max-w-xl mx-auto shadow-2xl border-x border-white/5 bg-black/10"
        style={{
          willChange: 'auto',
          contain: 'layout style paint',
          transition: 'none',
          // Safe area insets for notched devices (iPhone X+)
          // paddingTop handled by header, paddingBottom handled by footer
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)'
        }}
      >
        {/* ══════════════════════════════════════════════════════════════════
          FIXED HEADER-Always visible at top (Claude/ChatGPT pattern)
          ══════════════════════════════════════════════════════════════════ */}
        <GameHeader
          gameState={gameState}
          currentCharacterId={state.currentCharacterId}
          currentNode={state.currentNode}
          hasCurrentCharacter={!!currentCharacter}
          hasNewOrbs={hasNewOrbs}
          hasNewTrust={state.hasNewTrust}
          hasNewMeeting={state.hasNewMeeting}
          audio={{
            isMuted: audio.state.isMuted,
            audioVolume: audio.state.audioVolume,
            toggleMute: () => audio.actions.toggleMute(),
            setVolume: (v) => audio.actions.setVolume(v),
          }}
          onShowJournal={() => setState(prev => ({ ...prev, showJournal: true }))}
          onShowConstellation={() => setState(prev => ({ ...prev, showConstellation: true, hasNewTrust: false, hasNewMeeting: false }))}
          onShowReport={() => setState(prev => ({ ...prev, showReport: true }))}
        />

        {/* ══════════════════════════════════════════════════════════════════
          SCROLLABLE DIALOGUE AREA-Middle section
          ══════════════════════════════════════════════════════════════════ */}
        <main
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
          data-testid="game-interface"
        >
          <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 md:pt-8 lg:pt-12 pb-4 sm:pb-6">
            {/* Dialogue container-STABLE: no animations to prevent layout shifts */}
            <div key="dialogue-wrapper">
              <Card
                className="glass-panel text-white"
                style={{ transition: 'none', background: 'rgba(10, 12, 16, 0.85)' }}
                data-testid="dialogue-card"
                data-node-id={gameState?.currentNodeId || ''}
                data-character-id={state.currentCharacterId}
                data-is-narration={state.currentNode?.speaker ? undefined : 'true'}
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
                  className="p-5 sm:p-8 md:p-10"
                  // SINGLE SCROLL REFACTOR: Removed h-[45vh] and overflow-y-auto - main scrolls now
                  // Note: Removed text-center for narration-left-align is easier to read (eye hunts for line starts when centered)
                  data-testid="dialogue-content"
                  data-speaker={state.currentNode?.speaker || ''}
                >


                  {/* Dialogue Card-Dynamic Marquee Effect */}
                  {/* STABILITY: Removed transition-all to prevent container jumping */}
                  <Card className={cn(
                    "shadow-lg backdrop-blur-xl relative overflow-hidden rounded-xl",
                    state.activeExperience || state.currentNode?.simulation
                      ? "bg-slate-950/80 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                      : (state.currentDialogueContent?.emotion === 'analytical' || state.currentDialogueContent?.emotion === 'knowing')
                        ? "bg-slate-950/80 border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
                        : (state.currentDialogueContent?.emotion === 'fear' || state.currentDialogueContent?.emotion === 'tension')
                          ? "bg-slate-950/80 border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                          : "bg-black/40 border-white/5 hover:border-white/10"
                  )}>
                    <CardContent className="p-0">
                      {/* Marquee Header Overlay */}
                      {(state.activeExperience || state.currentNode?.simulation) && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-50" />
                      )}
                      {/* P6: Experience Mode Overlay */}
                      {state.activeExperience ? (
                        <div className="p-6 md:p-8 space-y-6">
                          <div className="flex items-center gap-3 text-amber-500 mb-4">
                            <Stars className="w-5 h-5 text-amber-400" />
                            <span className="text-sm uppercase tracking-widest font-bold">Loyalty Event</span>
                          </div>

                          <div className="prose prose-invert max-w-none text-lg leading-relaxed text-indigo-100/90 whitespace-pre-wrap">
                            <ExperienceRenderer
                              state={state.activeExperience}
                              gameState={gameState!}
                              onChoice={(choiceId) => handleExperienceChoice(choiceId)}
                            />
                          </div>
                        </div>
                      ) : (state.currentNode?.simulation && state.currentNode.simulation.mode !== 'inline') ? (
                        // ISP: FULLSCREEN Workflow Simulation Renderer (Legacy God Mode)
                        <div className="p-6 h-full">
                          <GameErrorBoundary
                            componentName="FullscreenSimulation"
                            fallback={
                              <div className="flex flex-col items-center justify-center h-full p-8 text-center border-l-2 border-red-500/50 bg-red-500/5 rounded-r-lg">
                                <h3 className="text-lg font-bold text-red-400 mb-2">Simulation Offline</h3>
                                <p className="text-sm text-red-300/80 mb-4">Connection to the internal network was interrupted.</p>
                                <Button onClick={() => handleChoice(state.availableChoices[0])} variant="outline" className="border-red-500/20 hover:bg-red-500/10 text-red-400">
                                  Bypass Protocol
                                </Button>
                              </div>
                            }
                          >
                            <SimulationRenderer
                              simulation={state.currentNode.simulation as any}
                              onComplete={(result) => {
                                logger.info('Simulation Complete', result)
                                // Auto-advance to next node if choices exist
                                if (state.availableChoices.length > 0) {
                                  handleChoice(state.availableChoices[0])
                                }
                              }}
                            />
                          </GameErrorBoundary>
                        </div>
                      ) : (
                        <div className="p-6 md:p-8">
                          {/* D-008: Compute text effects based on player state */}
                          {(() => {
                            const textEffects = gameState
                              ? getActiveTextEffects(gameState, state.currentCharacterId)
                              : []
                            const textEffectClasses = getTextEffectClasses(textEffects)
                            const textEffectStyles = getTextEffectStyles(textEffects)
                            return (
                              <ChatPacedDialogue
                                characterName={state.currentNode?.speaker}
                                emotion={state.currentDialogueContent?.emotion}
                                nodeId={state.currentNode?.nodeId || ''}
                              >
                                <DialogueDisplay
                                  key="dialogue-display-main"
                                  text={cleanContent(gameState ? TextProcessor.process(state.currentContent || '', gameState) : (state.currentContent || ''))}
                                  characterName={state.currentNode?.speaker}
                                  characterId={state.currentCharacterId}
                                  gameState={gameState ?? undefined}
                                  showAvatar={false}
                                  richEffects={getRichEffectContext(state.currentDialogueContent, state.isLoading, state.recentSkills, state.useChatPacing)}
                                  interaction={state.currentDialogueContent?.interaction}
                                  emotion={state.currentDialogueContent?.emotion}
                                  microAction={state.currentDialogueContent?.microAction}
                                  patternSensation={state.patternSensation}
                                  textEffectClasses={textEffectClasses}
                                  textEffectStyles={textEffectStyles}
                                />
                              </ChatPacedDialogue>
                            )
                          })()}

                          {/* Consequence Echo — dialogue-based feedback for trust/pattern changes */}
                          <ConsequenceEchoDisplay echo={state.consequenceEcho} />

                          {/* Pattern sensation — atmospheric feedback after choices */}
                          {state.patternSensation && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5, duration: 0.4 }}
                              className="mt-3 text-sm italic text-emerald-300/50 font-serif"
                            >
                              {state.patternSensation}
                            </motion.p>
                          )}

                          {/* ISP: INLINE SIMULATION WIDGET (Handshake Protocol) */}
                          {state.currentNode?.simulation && state.currentNode.simulation.mode === 'inline' && (
                            <div className="mt-6">
                              <GameErrorBoundary
                                componentName="InlineSimulation"
                                fallback={
                                  <div className="p-4 border border-red-900/50 bg-red-950/20 rounded-lg text-center">
                                    <span className="text-xs font-mono text-red-400">SIMULATION_RENDER_FAILURE</span>
                                  </div>
                                }
                              >
                                <SimulationRenderer
                                  simulation={state.currentNode.simulation as any}
                                  onComplete={(result) => {
                                    logger.info('Inline Simulation Complete', result)
                                    // Auto-advance logic
                                    if (state.availableChoices.length > 0) {
                                      handleChoice(state.availableChoices[0])
                                    }
                                  }}
                                />
                              </GameErrorBoundary>
                            </div>
                          )}

                          {/* ME2-style interrupt button-DISABLED per UX review
                              Issue: Appears in narrative area instead of choice framework
                              Issue: No audio feedback, feels incomplete
                              TODO: Reimplement as part of choice system if needed
                          {state.activeInterrupt && (
                            <div className="mt-6">
                              <InterruptButton
                                interrupt={state.activeInterrupt}
                                onTrigger={handleInterruptTrigger}
                                onTimeout={handleInterruptTimeout}
                              />
                            </div>
                          )}
                          */}
                        </div>
                      )}

                      {/* Disco Elysium-style pattern voice-inner monologue */}
                      {/* PatternVoice (Inner Monologue)-HIDDEN per user feedback ("show not tell") */}
                      {/* {state.patternVoice && (
                        <div className="mt-6 p-6 md:p-8 pt-0">
                          <PatternVoice
                            pattern={state.patternVoice.pattern}
                            text={state.patternVoice.text}
                            style={state.patternVoice.style}
                            onDismiss={() => setState(prev => ({ ...prev, patternVoice: null }))}
                          />
                        </div>
                      )} */}


                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>

            {/* Pattern sensations and ambient events removed-keeping UI clean */}

            {/* Ending State-Shows in scroll area when conversation complete */}
            {isEnding && (
              <EndingPanel
                gameState={gameState}
                onSeeJourney={() => {
                  if (gameState) {
                    const demonstrations = skillTrackerRef.current?.getAllDemonstrations() || []
                    const trackedSkills = useGameStore.getState().skills
                    const narrative = generateJourneyNarrative(gameState, demonstrations, trackedSkills)
                    setState(prev => ({ ...prev, showJourneySummary: true, journeyNarrative: narrative }))
                  }
                }}
                onExportProfile={() => setState(prev => ({ ...prev, showReport: true }))}
                onContinueExploring={handleReturnToStation}
                onReturnToStation={handleReturnToStation}
              />
            )}
          </div>
        </main >

        {/* ══════════════════════════════════════════════════════════════════
          CHOICES PANEL-Positioned for optimal flow
          ══════════════════════════════════════════════════════════════════ */}
        <GameFooter
          isEnding={isEnding}
          availableChoices={state.availableChoices}
          currentNode={state.currentNode}
          gameState={gameState}
          isProcessing={state.isProcessing}
          orbFillLevels={orbFillLevels}
          cognitiveLoad={cognitiveLoad}
          onChoice={handleChoice}
        />

        {/* Share prompts removed-too obtrusive */}

        {/* Error Display */}
        {
          state.error && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
              <div className="mx-4 max-w-md bg-slate-900 rounded-xl shadow-xl border border-red-900/50 overflow-hidden">
                <div className="px-6 py-4 bg-red-950/50 border-b border-red-900/30">
                  <h3 className="text-lg font-semibold text-red-300">{state.error.title}</h3>
                </div>
                <div className="px-6 py-4">
                  <p className="text-slate-300 mb-4">{state.error.message}</p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => window.location.reload()}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      Refresh Page
                    </Button>
                    {/* GameMenu removed from here */}
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
          )
        }



        {/* Waiting Room patience mechanic — subtle indicators and reveal toasts */}
        <AnimatePresence>
          {waitingRoom.isBreathing && (
            <WaitingRoomIndicator
              isActive={waitingRoom.revealedContent.length > 0}
              progress={waitingRoom.progressToNext}
              isBreathing={waitingRoom.isBreathing}
            />
          )}
          {activeWaitingReveal && (
            <WaitingRoomRevealToast
              text={activeWaitingReveal.text}
              type={activeWaitingReveal.type}
              speaker={activeWaitingReveal.speaker}
              onComplete={() => setActiveWaitingReveal(null)}
            />
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════════════════════════════
          OVERLAYS & MODALS-Positioned above everything
          ══════════════════════════════════════════════════════════════════ */}

        {/* Feedback Overlays-Disabled to avoid blocking content */}
        {/* Trust and skill changes are tracked silently in the background */}

        {/* Achievement notifications disabled-obtrusive on mobile */}
        {/* Achievements are still tracked and visible in admin dashboard/journey summary */}

        {/* Experience Summary disabled-breaks immersion, available in menus/maps */}
        {/* Users can view arc summaries in admin dashboard or journey summary when they choose */}

        {/* Journal */}
        <SectionErrorBoundary sectionName="Journal" compact>
          <Journal
            isOpen={state.showJournal}
            onClose={() => setState(prev => ({ ...prev, showJournal: false }))}
          />
        </SectionErrorBoundary>

        {/* Constellation */}
        <SectionErrorBoundary sectionName="Constellation" compact>
          <ConstellationPanel
            isOpen={state.showConstellation}
            onClose={() => setState(prev => ({ ...prev, showConstellation: false }))}
          />
        </SectionErrorBoundary>

        {/* Floating Module Interlude-DISABLED: broke dialogue immersion */}

        {/* Journey Summary-Samuel's narrative of the complete journey */}
        {
          state.showJourneySummary && state.journeyNarrative && (
            <JourneySummary
              narrative={state.journeyNarrative}
              onClose={() => setState(prev => ({ ...prev, showJourneySummary: false, journeyNarrative: null }))}
            />
          )
        }

        <IdentityCeremony
          pattern={state.ceremonyPattern}
          isVisible={state.showIdentityCeremony}
          onComplete={() => setState(prev => ({ ...prev, showIdentityCeremony: false, ceremonyPattern: null }))}
        />

        {/* Pattern-Based Journey Ending */}
        {state.showPatternEnding && state.endingPattern && (
          <JourneyComplete
            pattern={state.endingPattern}
            onRestart={() => setState(prev => ({ ...prev, showPatternEnding: false, endingPattern: null }))}
          />
        )}

        {/* Limbic System Overlay REMOVED-caused distracting color flashing */}
        {/* The Reality Interface-Career Report */}
        {
          state.showReport && gameState && (
            <StrategyReport
              gameState={gameState}
              onClose={() => setState(prev => ({ ...prev, showReport: false }))}
            />
          )
        }

        {/* PatternOrb moved to Journal panel for cleaner main game view */}
        {/* InGameSettings removed - consolidated into UnifiedMenu in header */}

        {/* Idle Warning Modal - Prevents unexpected session loss */}
        <IdleWarningModal
          onTimeout={() => {
            // Auto-save is already handled by the game
            // Just show a gentle reminder that they can return anytime
            console.log('[IdleWarning] Session timeout - state preserved')
          }}
          onContinue={() => {
            console.log('[IdleWarning] User confirmed presence')
          }}
        />

        {/* Keyboard Shortcuts Help Modal */}
        <KeyboardShortcutsHelp
          isOpen={showShortcutsHelp}
          onClose={() => setShowShortcutsHelp(false)}
          shortcuts={shortcuts}
          onUpdateShortcut={updateShortcut}
          onResetShortcuts={resetShortcuts}
        />
      </div>
    </LivingAtmosphere>
  )
}
// ═══════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTS
// ═══════════════════════════════════════════════════════════════════════════


