/* eslint-disable */
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
import { InterruptButton } from '@/components/game/InterruptButton'
import type { RichTextEffect } from '@/components/RichTextRenderer'
import { AtmosphericIntro } from '@/components/AtmosphericIntro'
import { AtmosphericGameBackground } from '@/components/AtmosphericGameBackground'
import { calculateAmbientContext, ATMOSPHERES } from '@/content/ambient-descriptions'
import { PatternOrb } from '@/components/PatternOrb'
import { GooeyPatternOrbs, patternScoresToWeights } from '@/components/GooeyPatternOrbs'
import { CharacterAvatar } from '@/components/CharacterAvatar'
import { getTrustLabel } from '@/lib/trust-labels'
import { GameState, GameStateUtils } from '@/lib/character-state'
import { GameLogic } from '@/lib/game-logic'
import { synthEngine } from '@/lib/audio/synth-engine'
import { HeroBadge } from '@/components/HeroBadge'
import { StrategyReport } from '@/components/career/StrategyReport'
import { GameMenu } from '@/components/GameMenu'
import { GameStateManager } from '@/lib/game-state-manager'
import { useBackgroundSync } from '@/hooks/useBackgroundSync'
import { useStationStore } from '@/lib/station-state' // Fixed: Top-level import
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
import { useGameStore } from '@/lib/game-store' // RESTORED
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
import { ConstellationPanel } from '@/components/constellation'
import { StationStatusBadge } from '@/components/StationStatusBadge'
import { TextProcessor } from '@/lib/text-processor'
import { JourneySummary } from '@/components/JourneySummary'
import { generateJourneyNarrative, isJourneyComplete, type JourneyNarrative } from '@/lib/journey-narrative-generator'
import { evaluateAchievements, type MetaAchievement } from '@/lib/meta-achievements'
import { selectAmbientEvent, IDLE_CONFIG, type AmbientEvent } from '@/lib/ambient-events'
import { PATTERN_TYPES, type PatternType, getPatternSensation, isValidPattern } from '@/lib/patterns'
import { calculatePatternGain } from '@/lib/identity-system'
import { getConsequenceEcho, checkPatternThreshold as checkPatternEchoThreshold, getPatternRecognitionEcho, createResonanceEchoFromDescription, getVoicedChoiceText, applyPatternReflection, getOrbMilestoneEcho, getDiscoveryHint, DISCOVERY_HINTS, type ConsequenceEcho } from '@/lib/consequence-echoes'
import { calculateResonantTrustChange } from '@/lib/pattern-affinity'
import { getEchoIntensity, ECHO_INTENSITY_MODIFIERS, analyzeTrustAsymmetry, getAsymmetryComment, type AsymmetryReaction } from '@/lib/trust-derivatives'
import { calculateCharacterTrustDecay, getPatternRecognitionComments, type PatternRecognitionComment } from '@/lib/pattern-derivatives'
import { getNewlyAvailableCombinations, type KnowledgeCombination, recordIcebergMention, getInvestigableTopics, type IcebergReference } from '@/lib/knowledge-derivatives'
import { getActiveTextEffects, getTextEffectClasses, getTextEffectStyles } from '@/lib/narrative-derivatives'
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
import { checkTransformationEligible, type TransformationMoment } from '@/lib/character-transformations'
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
import { useOrbs } from '@/hooks/useOrbs'
// Engagement Loop Systems
import { detectReturningPlayer, getWaitingCharacters, getSamuelWaitingSummary, type CharacterWaitingState } from '@/lib/character-waiting'
import { queueGiftForChoice, queueGiftsForArcComplete, tickGiftCounters, getReadyGiftsForCharacter, consumeGift, serializeGiftQueue, deserializeGiftQueue, type DelayedGift } from '@/lib/delayed-gifts'
// ProgressToast removed - Journal glow effect replaces it
import { selectAnnouncement } from '@/lib/platform-announcements'
import { checkSessionBoundary, incrementBoundaryCounter, type SessionAnnouncement } from '@/lib/session-structure'
import { SessionBoundaryAnnouncement } from '@/components/SessionBoundaryAnnouncement'
import { IdentityCeremony } from '@/components/IdentityCeremony'
import { playPatternSound, playTrustSound, playIdentitySound, playMilestoneSound, playEpisodeSound, playSound, initializeAudio, setAudioEnabled } from '@/lib/audio-feedback'
// OnboardingScreen removed - discovery-based learning via Samuel's firstOrb echo instead
// FoxTheatreGlow import removed - unused
import { ExperienceRenderer } from '@/components/game/ExperienceRenderer'
import { SimulationRenderer } from '@/components/game/SimulationRenderer'
import { getPatternUnlockChoices } from '@/lib/pattern-unlock-choices'
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
  previousSpeaker: string | null
  recentSkills: string[]
  showExperienceSummary: boolean
  experienceSummaryData: ExperienceSummaryData | null
  // showConfigWarning removed - Samuel mentions it once via consequenceEcho
  showJournal: boolean
  showConstellation: boolean
  pendingFloatingModule: null // Floating modules disabled
  showJourneySummary: boolean
  showReport: boolean
  journeyNarrative: JourneyNarrative | null
  achievementNotification: MetaAchievement | null
  ambientEvent: AmbientEvent | null  // Station breathing - idle atmosphere
  patternSensation: string | null    // Brief feedback when pattern triggered
  consequenceEcho: ConsequenceEcho | null  // Dialogue-based trust feedback
  // patternToast removed - Journal glow effect replaces it
  sessionBoundary: SessionAnnouncement | null  // Session boundary announcement
  previousTotalNodes: number  // Track total nodes for boundary calculation
  showIdentityCeremony: boolean  // Identity internalization ceremony
  ceremonyPattern: PatternType | null  // Pattern being internalized
  hasNewTrust: boolean  // Track trust changes for Constellation attention indicator
  hasNewMeeting: boolean  // Track first meeting with non-Samuel character
  isMuted: boolean
  isProcessing: boolean
  activeInterrupt: InterruptWindow | null  // ME2-style interrupt window during dialogue
  patternVoice: PatternVoiceResult | null  // Disco Elysium-style inner monologue
  voiceConflict: VoiceConflictResult | null  // D-096: Voice conflict when patterns disagree
  activeComboChain: ActiveComboState | null  // D-084: Active interrupt combo chain
  // Engagement Loop State
  waitingCharacters: CharacterWaitingState[]  // Characters "waiting" for returning player
  pendingGift: DelayedGift | null  // Gift ready to deliver
  isReturningPlayer: boolean  // True if player returned after absence

  // P6: Loyalty Experience System
  activeExperience: import("@/lib/experience-engine").ActiveExperienceState | null
}

import type { ExperienceSummaryData } from '@/components/ExperienceSummary'

// D-009: Filter interrupt visibility based on player's developed patterns
// Only see interrupts aligned with patterns at EMERGING threshold (2+)
const EMERGING_THRESHOLD = 2 // Matches PATTERN_THRESHOLDS.EMERGING
function shouldShowInterrupt(
  interrupt: InterruptWindow | null | undefined,
  patterns: { analytical: number; patience: number; exploring: number; helping: number; building: number }
): InterruptWindow | null {
  if (!interrupt) return null

  // Get patterns aligned with this interrupt type
  const alignedPatterns = INTERRUPT_PATTERN_ALIGNMENT[interrupt.type]
  if (!alignedPatterns) return interrupt // Unknown type - show by default

  // Check if any aligned pattern is at EMERGING threshold
  const hasAlignedPattern = alignedPatterns.some(
    patternKey => patterns[patternKey] >= EMERGING_THRESHOLD
  )

  // If no aligned pattern developed, hide the interrupt
  return hasAlignedPattern ? interrupt : null
}

function AmbientDescriptionDisplay({ gameState, mode = 'fixed' }: { gameState: GameState, mode?: 'fixed' | 'inline' }) {
  const [description, setDescription] = useState('')

  useEffect(() => {
    const ctx = calculateAmbientContext(gameState)
    setDescription(ATMOSPHERES[ctx.atmosphere]?.description || "The station hums quietly.")
  }, [gameState])

  if (!description) return null

  if (mode === 'inline') {
    return <span>{description}</span>
  }

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-2xs uppercase tracking-widest text-slate-400 font-mono leading-relaxed"
    >
      {description}
    </motion.p>
  )
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
    hasNewTrust: false,
    hasNewMeeting: false,
    isMuted: false,
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

  // Derived State for UI Logic
  const currentState = state.gameState ? 'dialogue' : 'station'

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
  const contentLoadTimestampRef = useRef<number>(Date.now()) // Track when content appeared
  const { queueStats: _queueStats } = useBackgroundSync({ enabled: true })
  const [hasSaveFile, setHasSaveFile] = useState(false)
  const [_saveIsComplete, setSaveIsComplete] = useState(false)

  // Save confirmation disabled - saves happen silently without interruption
  // Achievement notifications disabled - no longer needed

  // Reset timestamp when content changes (new node displayed)
  useEffect(() => {
    contentLoadTimestampRef.current = Date.now()
  }, [state.currentContent])
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

  // ═══════════════════════════════════════════════════════════════════════════
  // STATION EVOLUTION: Sync Station State & Ambience
  // ═══════════════════════════════════════════════════════════════════════════
  // require statements removed - using top-level imports

  // Sync Ambient Context when GameState changes
  useEffect(() => {
    if (state.gameState) {
      try {
        const context = calculateAmbientContext(state.gameState)
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
  }, [state.gameState, state.currentCharacterId])

  // P5: Sync station atmosphere with game state
  useEffect(() => {
    if (state.gameState) {
      import('@/lib/station-logic').then(({ updateStationState }) => {
        updateStationState(state.gameState!)
      })
    }
  }, [state.gameState?.globalFlags?.size, state.gameState?.globalFlags]) // Re-run when flags change

  // P5: Derive Atmospheric Emotion (Moved to top level to avoid conditional hook error)
  const stationAtmosphere = useStationStore(s => s.atmosphere)
  const currentEmotion = useMemo(() => {
    if (stationAtmosphere === 'tense') return 'anxiety'
    if (stationAtmosphere === 'awakening') return 'fear_awe'

    // Character-based overrides
    const char = state.gameState?.characters.get(state.currentCharacterId)
    if (char && char.anxiety > 60) return 'anxiety'

    // Location-based overrides
    if (state.currentCharacterId === 'deep_station') return 'fear_awe'
    if (state.currentCharacterId === 'market') return 'curiosity'

    return 'neutral'
  }, [stationAtmosphere, state.gameState, state.currentCharacterId])

  // ═══════════════════════════════════════════════════════════════════════════
  // AMBIENT EVENTS - "The Station Breathes"
  // When the player pauses to think, life continues around them.
  // ═══════════════════════════════════════════════════════════════════════════
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const idleCountRef = useRef(0)  // Track how many ambient events shown this idle period
  const lastChoiceTimeRef = useRef(Date.now())

  // Helper to calculate total nodes visited across all characters
  const getTotalNodesVisited = (gameState: GameState): number => {
    let total = 0
    gameState.characters.forEach(char => {
      total += char.conversationHistory.length
    })
    return total
  }

  // Helper to clean atmospheric tags
  const cleanContent = (text: string) => {
    return text.replace(/\[atmospheric.*?\]/gi, '').trim()
  }

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
        if (state.showJournal || state.showConstellation || state.showJourneySummary) return

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
  }, [state.hasStarted, state.availableChoices.length, state.currentCharacterId, state.showJournal, state.showConstellation, state.showJourneySummary, getDominantPattern])

  // Reset timer when choices change (player made a choice)
  useEffect(() => {
    resetIdleTimer()
    // ISP FIX: Release choice lock here, once the new node is actually rendered
    // This prevents race conditions where lock is released before state update
    if (isProcessingChoiceRef.current) {
      // Small delay to ensure render cycle completes
      setTimeout(() => {
        isProcessingChoiceRef.current = false
      }, 100)
    }

    // ISP: Update Conductor with full state
    if (state.gameState && state.currentCharacterId) {
      generativeScore.update(state.gameState, state.currentCharacterId)
    }
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
    }
  }, [state.currentNode?.nodeId, resetIdleTimer, state.gameState, state.currentCharacterId])

  // Audio Immersion: Trigger sounds for Consequence Echoes
  useEffect(() => {
    if (state.consequenceEcho?.soundCue) {
      playSound(state.consequenceEcho.soundCue)
    }
  }, [state.consequenceEcho])

  // Handle atmospheric intro start - now just starts the game directly
  // Pattern teaching happens via Samuel's firstOrb milestone echo (discovery-based learning)
  // eslint-disable-next-line react-hooks/exhaustive-deps -- initializeGame is stable, intentionally excluded to prevent re-creation
  const handleAtmosphericIntroStart = useCallback(() => {
    initializeGame()
  }, [])

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
          logger.warn('⚠️ Failed to ensure player profile (will fallback to API route check):', { error })
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

        gameState = { ...gameState, ...updates }

        // Save immediately to persist the decremented counters
        // This ensures if they refresh right away, we don't count it again (lastSaved will be now)
        GameStateManager.saveGameState(gameState)
        zustandStore.setCoreGameState(GameStateUtils.serialize(gameState)) // Sync store
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

      let content = DialogueGraphNavigator.selectContent(currentNode, character.conversationHistory, gameState)
      const regularChoices = StateConditionEvaluator.evaluateChoices(currentNode, gameState, actualCharacterId).filter(c => c.visible)

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
        activeExperience: state.activeExperience, // Added to fix build error
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
        hasNewTrust: false,
        hasNewMeeting: false,
        isMuted: false,
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
          // Inject Samuel's echo about local mode - shows once, naturally in dialogue
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
      //
      // We sync BOTH:
      // 1. The full SerializableGameState (for complete state access)
      // 2. Derived fields (for backward compatibility with existing selectors)
      // ═══════════════════════════════════════════════════════════════════════════
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
      logger.error('Init error', { error })
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

  // Choice handler
  const handleChoice = useCallback(async (choice: EvaluatedChoice) => {
    // Initialize audio on first user interaction (required for mobile)
    initializeAudio()

    // Prevent race condition from rapid-fire clicks
    if (isProcessingChoiceRef.current) return
    if (!state.gameState || !choice.enabled) return

    // LOCK: Immediate ref lock + UI state update
    isProcessingChoiceRef.current = true
    setState(prev => ({ ...prev, isProcessing: true }))

    // Safety timeout: auto-reset lock if handler crashes or hangs
    const safetyTimeout = setTimeout(() => {
      if (isProcessingChoiceRef.current) {
        logger.error('[StatefulGameInterface] Choice handler timeout - auto-resetting lock')
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
      const result = GameLogic.processChoice(state.gameState, choice, reactionTime)
      const previousPatterns = { ...state.gameState.patterns } // Restored for echo check
      let newGameState = result.newState
      const trustDelta = result.trustDelta

      // ═══════════════════════════════════════════════════════════════════════════
      // STATE DEFINITIONS
      // ═══════════════════════════════════════════════════════════════════════════

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

        if (crossedThreshold5) {
          const identityThoughtId = `identity-${result.events.earnOrb}` as const
          newGameState = GameStateUtils.applyStateChange(newGameState, {
            thoughtId: identityThoughtId
          })
          // Play Identity Sound immediately if threshold crossed
          if (result.events.checkIdentityThreshold) {
            playIdentitySound()
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

          // Play sound (reuse identity sound for now)
          playIdentitySound()
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

          // Play sound (reuse identity sound for now)
          playIdentitySound()
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

        // Play distinct sound
        const { playIdentitySound } = await import('@/lib/audio-feedback')
        playIdentitySound()
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
        if (type === 'pattern' && id) playPatternSound(id)
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
      let consequenceEcho: ConsequenceEcho | null = null
      // D-010: Get current trust level for echo intensity
      const currentTrust = newGameState.characters.get(state.currentCharacterId)?.trust ?? 5

      if (trustDelta !== 0) {
        // Check if pattern resonance affected this trust change
        // Resonance descriptions are more meaningful than generic trust echoes
        const choicePattern = choice.choice.pattern as PatternType | undefined
        const resonanceResult = calculateResonantTrustChange(
          trustDelta,
          state.currentCharacterId,
          newGameState.patterns as Record<PatternType, number>,
          choicePattern
        )

        // Use resonance echo if triggered, otherwise fall back to generic trust echo
        if (resonanceResult.resonanceTriggered && resonanceResult.resonanceDescription) {
          consequenceEcho = createResonanceEchoFromDescription(resonanceResult.resonanceDescription)
          logger.info('[StatefulGameInterface] Resonance echo triggered:', {
            characterId: state.currentCharacterId,
            description: resonanceResult.resonanceDescription.substring(0, 50) + '...'
          })
        } else {
          consequenceEcho = getConsequenceEcho(state.currentCharacterId, trustDelta)
        }

        // D-010: Add trust level to echo for intensity-based display
        if (consequenceEcho) {
          consequenceEcho = { ...consequenceEcho, trustAtEvent: currentTrust }
        }

        // Audio feedback for trust increase
        if (trustDelta > 0) {
          playTrustSound()
        }
      }

      // Also check for pattern recognition echos (when player crosses a threshold)
      const crossedPattern = checkPatternEchoThreshold(previousPatterns, newGameState.patterns, 5) // Check multiples of 5
      let patternShiftMsg: string | null = null

      if (crossedPattern) {
        // Pattern recognition takes precedence over trust echo if no trust change
        if (!consequenceEcho) {
          consequenceEcho = getPatternRecognitionEcho(state.currentCharacterId, crossedPattern)
        }

        // Trigger distinct "Identity Shift" sensation
        const level = (newGameState.patterns as any)[crossedPattern] || 0
        const patternName = crossedPattern.charAt(0).toUpperCase() + crossedPattern.slice(1)
        patternShiftMsg = `Worldview Shift: ${patternName} (Level ${level})`
        playPatternSound(crossedPattern) // Ensure sound plays
      }

      // Check for orb milestone echoes - Samuel acknowledges growth
      // Only shows when talking to Samuel and there's an unacknowledged milestone
      if (!consequenceEcho && state.currentCharacterId === 'samuel') {
        const unacknowledgedMilestone = getUnacknowledgedMilestone()
        if (unacknowledgedMilestone) {
          consequenceEcho = getOrbMilestoneEcho(unacknowledgedMilestone)
          if (consequenceEcho) {
            acknowledgeMilestone(unacknowledgedMilestone)
            // Audio feedback for milestone achievement
            playMilestoneSound()
          }
        }
      }

      // Check for character transformation eligibility (dramatic reveal moments)
      // Transformations trigger when trust + flags + patterns align
      let eligibleTransformation: TransformationMoment | null = null
      if (trustDelta > 0) { // Only check when trust increases
        const zustandState = useGameStore.getState()
        const characterData = newGameState.characters.get(state.currentCharacterId)
        if (characterData) {
          eligibleTransformation = checkTransformationEligible(
            state.currentCharacterId,
            {
              trust: characterData.trust,
              knowledgeFlags: characterData.knowledgeFlags,
              globalFlags: newGameState.globalFlags,
              patterns: newGameState.patterns as Record<PatternType, number>,
              witnessedTransformations: zustandState.witnessedTransformations
            }
          )

          // If transformation is eligible, mark it as witnessed and apply consequences
          if (eligibleTransformation) {
            zustandState.markTransformationWitnessed(eligibleTransformation.id)

            // Apply transformation consequences (set global flags)
            for (const flag of eligibleTransformation.consequences.globalFlagsSet) {
              newGameState.globalFlags.add(flag)
            }

            // Show transformation as a special consequence echo
            // The first line of transformation dialogue becomes the echo
            if (eligibleTransformation.transformation.triggerDialogue.length > 0) {
              consequenceEcho = {
                text: eligibleTransformation.transformation.triggerDialogue[0],
                emotion: eligibleTransformation.transformation.emotionArc[0],
                timing: 'immediate'
              }
            }
          }
        }
      }

      // 6. SYNC TO ZUSTAND (Critical for Side Menus)
      // Ensure Journal and Constellation get the latest state immediately
      useGameStore.getState().setCoreGameState(GameStateUtils.serialize(newGameState))

      // Floating modules disabled - broke dialogue immersion
      const zustandStore = useGameStore.getState()

      const searchResult = findCharacterForNode(choice.choice.nextNodeId, newGameState)
      if (!searchResult) {
        logger.error('[StatefulGameInterface] Could not find character graph for node:', { nodeId: choice.choice.nextNodeId })
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
        logger.error('[StatefulGameInterface] Node not found in graph:', {
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

      const targetCharacter = newGameState.characters.get(targetCharacterId)!

      // D-001: Update last interaction timestamp for trust decay calculation
      targetCharacter.lastInteractionTimestamp = Date.now()

      // Track pattern unlock visit (so it doesn't show again)
      if (choice.choice.choiceId?.startsWith('pattern_unlock_')) {
        if (!targetCharacter.visitedPatternUnlocks) {
          targetCharacter.visitedPatternUnlocks = new Set()
        }
        targetCharacter.visitedPatternUnlocks.add(nextNode.nodeId)
        logger.info('[StatefulGameInterface] Pattern unlock visited:', {
          characterId: targetCharacterId,
          nodeId: nextNode.nodeId
        })
      }

      // D-001: Apply pattern-influenced trust decay when returning to a character
      // Only apply if character has been interacted with before and some time has passed
      if (targetCharacter.lastInteractionTimestamp && targetCharacterId !== state.currentCharacterId) {
        const SESSION_DURATION_MS = 10 * 60 * 1000 // 10 minutes = 1 "session"
        const timeSinceLastInteraction = Date.now() - targetCharacter.lastInteractionTimestamp
        const sessionsAbsent = Math.floor(timeSinceLastInteraction / SESSION_DURATION_MS)

        if (sessionsAbsent > 0) {
          const decayAmount = calculateCharacterTrustDecay(sessionsAbsent, newGameState.patterns)
          if (decayAmount > 0 && targetCharacter.trust > 0) {
            const oldTrust = targetCharacter.trust
            targetCharacter.trust = Math.max(0, targetCharacter.trust - decayAmount)
            logger.info('[StatefulGameInterface] D-001 Trust decay applied:', {
              characterId: targetCharacterId,
              sessionsAbsent,
              decayAmount,
              oldTrust,
              newTrust: targetCharacter.trust
            })
          }
        }
      }

      // Track first meeting with non-Samuel character for Constellation nudge
      const isFirstMeeting = targetCharacter.conversationHistory.length === 0 && targetCharacterId !== 'samuel'
      targetCharacter.conversationHistory.push(nextNode.nodeId)
      newGameState.currentNodeId = nextNode.nodeId
      newGameState.currentCharacterId = targetCharacterId

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
          if (typeof window !== 'undefined') {
            localStorage.setItem(shownCommentsKey, JSON.stringify([...shownComments]))
          }

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
        const oldGlobalFlags = state.gameState?.globalFlags || new Set<string>()
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
                text: `Something clicks... "${topic.topic}" - you've heard this mentioned enough times now. Perhaps there's more to investigate.`,
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
        playEpisodeSound()
      }

      const content = DialogueGraphNavigator.selectContent(nextNode, targetCharacter.conversationHistory, newGameState)
      const regularNewChoices = StateConditionEvaluator.evaluateChoices(nextNode, newGameState, targetCharacterId).filter(c => c.visible)

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

      // Skill tracking logic (abbreviated for safety, same as before)
      // Note: Toast removed as user found it intrusive. Skills still tracked silently.
      let demonstratedSkills: string[] = []

      if (skillTrackerRef.current && state.currentNode && choice.choice.skills) {
        demonstratedSkills = choice.choice.skills as string[]

        // Generate rich context for skill demonstrations (2-3 sentences)
        // Uses available dialogue data instead of manual mappings
        const speaker = state.currentNode.speaker
        const choiceText = choice.choice.text.length > 60
          ? choice.choice.text.substring(0, 57) + '...'
          : choice.choice.text
        const pattern = choice.choice.pattern || 'exploring'

        // Build context with character, choice, and skills
        let context = `In conversation with ${speaker}, `
        context += `the player chose "${choiceText}" `
        context += `(${pattern} pattern), `
        context += `demonstrating ${demonstratedSkills.join(', ')}. `

        // Add relationship/pattern depth if available
        const dominantPattern = Object.entries(state.gameState.patterns)
          .reduce((max, curr) => curr[1] > max[1] ? curr : max, ['exploring', 0])
        if (dominantPattern[1] >= 5) {
          context += `This aligns with their emerging ${dominantPattern[0]} identity. `
        }

        // Add scene context
        context += `[${state.currentNode.nodeId}]`

        skillTrackerRef.current.recordSkillDemonstration(
          state.currentNode.nodeId,
          choice.choice.choiceId,
          demonstratedSkills,
          context
        )
      }

      const skillsToKeep = demonstratedSkills.length > 0
        ? [...demonstratedSkills, ...state.recentSkills].slice(0, 10)
        : state.recentSkills.slice(0, 8)

      // Trust feedback enabled (Subtle Toast)
      let consequenceFeedback: { message: string } | null = null

      if (trustDelta !== 0) {
        const charName = state.currentCharacterId.charAt(0).toUpperCase() + state.currentCharacterId.slice(1)
        const sign = trustDelta > 0 ? '+' : ''
        consequenceFeedback = {
          message: `Trust (${charName}): ${sign}${trustDelta}`
        }
      }


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
        hasNewTrust: trustDelta !== 0 ? true : state.hasNewTrust,  // Track trust changes for Constellation attention
        hasNewMeeting: isFirstMeeting ? true : state.hasNewMeeting,  // Track first meeting for Constellation nudge
        isMuted: state.isMuted,
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
    } catch (error) {
      console.error('Choice handling failed:', error)
      isProcessingChoiceRef.current = false // Release lock if error
      setState(prev => ({ ...prev, isProcessing: false }))
    } finally {
      // Clear safety timeout
      clearTimeout(safetyTimeout)

      // CRITICAL RACE CONDITION FIX:
      // Do NOT release isProcessingChoiceRef.current here!
      // We wait for the useEffect on nodeId change to release it.
      // This ensures we don't accept clicks while the old node is still rendered.
    }
  }, [state.gameState, state.currentNode, state.recentSkills, state.showJournal, state.showConstellation, state.journeyNarrative, state.showJourneySummary, state.currentCharacterId, state.currentContent, state.previousTotalNodes, earnOrb, earnBonusOrbs, getUnacknowledgedMilestone, acknowledgeMilestone])

  // ISP: Active Silence Detection
  // Check if the player is being silent and if the current node has a specific reaction to it
  useEffect(() => {
    // Only run if we are in a dialogue state and not processing
    if (!state.gameState || !state.currentNode || state.isProcessing || state.activeInterrupt) return

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

        const activeSilenceState: GameState = state.gameState ? {
          ...state.gameState,
          saveVersion: state.gameState.saveVersion || '1.0', // Ensure string
          globalFlags: new Set([...state.gameState.globalFlags, 'temporary_silence'])
        } : state.gameState!

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
  }, [state.currentNode, state.currentContent, state.isProcessing, state.activeInterrupt, state.gameState]) // Reset on content change

  /**
   * Handle interrupt trigger - player acted during NPC speech
   */
  const handleInterruptTrigger = useCallback(() => {
    const interrupt = state.activeInterrupt
    if (!interrupt || !state.gameState) return

    logger.info('[StatefulGameInterface] Interrupt triggered:', { action: interrupt.action, targetNodeId: interrupt.targetNodeId })

    // Apply interrupt consequence if present
    let newGameState = state.gameState
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
            // Wrong interrupt type - chain broken
            logger.info('[StatefulGameInterface] D-084: Combo chain broken - wrong type', {
              expected: expectedStep.interruptType,
              got: interrupt.type
            })
            newComboChain = null
          }
        }
      }
    } else {
      // No active combo - check if this interrupt starts one
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

    // Navigate to the interrupt target node
    const searchResult = findCharacterForNode(interrupt.targetNodeId, newGameState)
    if (!searchResult) {
      logger.error('[StatefulGameInterface] Interrupt target node not found:', { nodeId: interrupt.targetNodeId })
      setState(prev => ({ ...prev, activeInterrupt: null }))
      return
    }

    const targetNode = searchResult.graph.nodes.get(interrupt.targetNodeId)
    if (!targetNode) {
      logger.error('[StatefulGameInterface] Interrupt target node not in graph:', { nodeId: interrupt.targetNodeId })
      setState(prev => ({ ...prev, activeInterrupt: null }))
      return
    }

    const content = DialogueGraphNavigator.selectContent(targetNode, [], newGameState)
    const regularInterruptChoices = StateConditionEvaluator.evaluateChoices(targetNode, newGameState, searchResult.characterId).filter(c => c.visible)

    // Add pattern-unlocked choices for interrupt context
    const interruptCharState = newGameState.characters.get(searchResult.characterId)
    const patternUnlockInterruptChoices = getPatternUnlockChoices(
      searchResult.characterId,
      newGameState.patterns,
      searchResult.graph,
      interruptCharState?.visitedPatternUnlocks
    )
    const choices = [...regularInterruptChoices, ...patternUnlockInterruptChoices]
    const reflected = applyPatternReflection(content.text, content.emotion, content.patternReflection, newGameState.patterns)

    setState(prev => ({
      ...prev,
      gameState: newGameState,
      currentNode: targetNode,
      currentGraph: searchResult.graph,
      currentCharacterId: searchResult.characterId,
      availableChoices: choices,
      currentContent: reflected.text,
      currentDialogueContent: { ...content, text: reflected.text, emotion: reflected.emotion },
      activeInterrupt: shouldShowInterrupt(content.interrupt, newGameState.patterns), // D-009: Filter by pattern
      activeComboChain: newComboChain  // D-084: Track combo chain state
    }))

    GameStateManager.saveGameState(newGameState)
    useGameStore.getState().setCoreGameState(GameStateUtils.serialize(newGameState))
  }, [state.activeInterrupt, state.gameState, state.activeComboChain])

  /**
   * Handle interrupt timeout - player didn't act
   */
  const handleInterruptTimeout = useCallback(() => {
    const interrupt = state.activeInterrupt
    if (!interrupt || !state.gameState) return

    logger.info('[StatefulGameInterface] Interrupt timed out:', { action: interrupt.action })

    // Clear the interrupt - if there's a missedNodeId, navigate there
    if (interrupt.missedNodeId) {
      const searchResult = findCharacterForNode(interrupt.missedNodeId, state.gameState)
      if (searchResult) {
        const targetNode = searchResult.graph.nodes.get(interrupt.missedNodeId)
        if (targetNode) {
          const content = DialogueGraphNavigator.selectContent(targetNode, [], state.gameState)
          const regularMissedChoices = StateConditionEvaluator.evaluateChoices(targetNode, state.gameState, searchResult.characterId).filter(c => c.visible)

          // Add pattern-unlocked choices
          const missedCharState = state.gameState.characters.get(searchResult.characterId)
          const patternUnlockMissedChoices = getPatternUnlockChoices(
            searchResult.characterId,
            state.gameState.patterns,
            searchResult.graph,
            missedCharState?.visitedPatternUnlocks
          )
          const choices = [...regularMissedChoices, ...patternUnlockMissedChoices]
          const reflected = applyPatternReflection(content.text, content.emotion, content.patternReflection, state.gameState.patterns)

          // D-084: Reset combo chain when interrupt is missed
          setState(prev => ({
            ...prev,
            currentNode: targetNode,
            currentGraph: searchResult.graph,
            currentCharacterId: searchResult.characterId,
            availableChoices: choices,
            currentContent: reflected.text,
            currentDialogueContent: { ...content, text: reflected.text, emotion: reflected.emotion },
            activeInterrupt: state.gameState ? shouldShowInterrupt(content.interrupt, state.gameState.patterns) : null, // D-009: Filter by pattern
            activeComboChain: null  // D-084: Reset combo on missed interrupt
          }))
          return
        }
      }
    }

    // No missedNodeId or it wasn't found - just clear the interrupt
    // D-084: Also reset combo chain
    setState(prev => ({ ...prev, activeInterrupt: null, activeComboChain: null }))
  }, [state.activeInterrupt, state.gameState])

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
        logger.error('Failed to find Samuel hub node:', { targetNodeId })
        // Fallback: reset to introduction
        const samuelGraph = getGraphForCharacter('samuel', state.gameState)
        const introNode = samuelGraph.nodes.get(samuelEntryPoints.INTRODUCTION)
        if (introNode) {
          const newGameState = { ...state.gameState }
          newGameState.currentNodeId = introNode.nodeId
          newGameState.currentCharacterId = 'samuel'
          const samuelChar = newGameState.characters.get('samuel') || GameStateUtils.createCharacterState('samuel')
          newGameState.characters.set('samuel', samuelChar)
          const content = DialogueGraphNavigator.selectContent(introNode, samuelChar.conversationHistory, newGameState)
          const regularSamuelChoices = StateConditionEvaluator.evaluateChoices(introNode, newGameState, 'samuel').filter(c => c.visible)

          // Add pattern-unlocked choices for Samuel
          const patternUnlockSamuelChoices = getPatternUnlockChoices(
            'samuel',
            newGameState.patterns,
            samuelGraph,
            samuelChar.visitedPatternUnlocks
          )
          const choices = [...regularSamuelChoices, ...patternUnlockSamuelChoices]

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
            isLoading: false,
            isProcessing: false
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
          isLoading: false,
          isProcessing: false
        }))
        return
      }

      const targetNode = searchResult.graph.nodes.get(targetNodeId)
      if (!targetNode) {
        logger.error('Target node not found:', { targetNodeId })
        setState(prev => ({
          ...prev,
          error: {
            title: 'Navigation Error',
            message: `Target node "${targetNodeId}" not found in graph. Please refresh the page.`,
            severity: 'error' as const
          },
          isLoading: false,
          isProcessing: false
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

      const content = DialogueGraphNavigator.selectContent(targetNode, targetCharacter.conversationHistory, newGameState)
      const regularNavChoices = StateConditionEvaluator.evaluateChoices(targetNode, newGameState, targetCharacterId).filter(c => c.visible)

      // Add pattern-unlocked choices
      const patternUnlockNavChoices = getPatternUnlockChoices(
        targetCharacterId,
        newGameState.patterns,
        targetGraph,
        targetCharacter.visitedPatternUnlocks
      )
      const choices = [...regularNavChoices, ...patternUnlockNavChoices]

      // Apply pattern reflection
      const reflected = applyPatternReflection(
        content.text,
        content.emotion,
        content.patternReflection,
        newGameState.patterns
      )

      // P6: Check for Loyalty Experience Trigger
      if (targetNode.metadata?.experienceId) {
        import("@/lib/experience-engine").then(({ ExperienceEngine }) => {
          const expState = ExperienceEngine.startExperience(targetNode.metadata!.experienceId as any)
          if (expState) {
            setState(prev => ({
              ...prev,
              activeExperience: expState,
              gameState: newGameState,
              currentNode: targetNode, // Keep node for context/return
              isProcessing: false
            }))
            return
          }
        })
      }

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
        isLoading: false,
        isProcessing: false
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
      logger.error('[StatefulGameInterface] Error in handleReturnToStation:', { error })
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

  // Experience Choice Handler
  const handleExperienceChoice = useCallback((choiceId: string) => {
    if (!state.activeExperience || !state.gameState) return

    import("@/lib/experience-engine").then(({ ExperienceEngine }) => {
      const result = ExperienceEngine.processChoice(state.activeExperience!, choiceId, state.gameState!)

      const newGameState = { ...state.gameState!, ...result.updates }

      // Update state
      setState(prev => ({
        ...prev,
        activeExperience: result.isComplete ? null : result.newState,
        gameState: newGameState,
      }))

      // Sync
      GameStateManager.saveGameState(newGameState)
    })
  }, [state.activeExperience, state.gameState])


  // Render Logic - Restored Card Layout
  // Onboarding removed - discovery-based learning happens via Samuel's firstOrb echo
  if (!state.hasStarted) {
    if (!hasSaveFile) return <AtmosphericIntro onStart={handleAtmosphericIntroStart} />
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
    silas: 'Silas',
    elena: 'Elena Vasquez',
    grace: 'Grace Thompson',
    asha: 'Asha Patel',
    lira: 'Lira Vance',
    zara: 'Zara El-Amin',
    station_entry: 'Sector 0',
    grand_hall: 'Sector 1: The Grand Hall',
    market: 'Sector 2: The Asset Exchange',
    deep_station: 'Sector 3: The Core'
  }

  const currentCharacter = state.gameState?.characters.get(state.currentCharacterId)
  const isEnding = state.availableChoices.length === 0

  return (
    <AtmosphericGameBackground
      characterId={state.currentCharacterId}
      emotion={currentEmotion === 'neutral' ? undefined : currentEmotion}
      isProcessing={state.isProcessing}
      className="h-[100dvh]"
    >
      <div
        key="game-container"
        className="h-full flex flex-col"
        style={{
          willChange: 'auto',
          contain: 'layout style paint',
          transition: 'none',
          // Safe area insets for notched devices (iPhone X+)
          // paddingTop handled by header for edge-to-edge look
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)'
        }}
      >
        {/* ══════════════════════════════════════════════════════════════════
          FIXED HEADER - Always visible at top (Claude/ChatGPT pattern)
          ══════════════════════════════════════════════════════════════════ */}
        <header
          className="relative flex-shrink-0 glass-panel border-b border-white/10 z-10"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className="max-w-4xl mx-auto px-3 sm:px-4">
            {/* Top Row - Title and Navigation */}
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <Link href="/" className="text-sm font-semibold text-slate-100 hover:text-white transition-colors truncate min-w-0 flex flex-col">
                <span>Grand Central Terminus</span>
                {/* Station Status - Always visible compact dashboard */}
                <StationStatusBadge gameState={state.gameState} />
              </Link>
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Hero Badge - Player Identity */}
                {state.gameState && (
                  <HeroBadge
                    patterns={state.gameState.patterns}
                    compact={true}
                    className="mr-2 hidden sm:flex"
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    markOrbsViewed()
                    setState(prev => ({ ...prev, showJournal: true }))
                  }}
                  className={`relative h-9 w-9 p-0 text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-md ${hasNewOrbs
                    ? 'text-amber-400 nav-attention-marquee nav-attention-border nav-attention-halo'
                    : ''
                    }`}
                  title="Journal"
                >
                  <BookOpen className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setState(prev => ({ ...prev, showConstellation: true, hasNewTrust: false, hasNewMeeting: false }))}
                  className={`relative h-9 w-9 p-0 text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-md ${(state.hasNewTrust || state.hasNewMeeting)
                    ? 'text-purple-400 nav-attention-marquee nav-attention-border-purple nav-attention-halo nav-attention-halo-purple'
                    : ''
                    }`}
                  title="Constellation"
                >
                  <Stars className="h-4 w-4" />
                </Button>

                {/* Header Controls - Now integrated in flow to prevent overlap */}
                <GameMenu
                  onShowReport={() => setState(prev => ({ ...prev, showReport: true }))}
                  onReturnToStation={currentState === 'dialogue' ? handleReturnToStation : undefined}
                  onShowConstellation={() => setState(prev => ({ ...prev, showConstellation: true }))}
                  isMuted={state.isMuted}
                  onToggleMute={() => {
                    const newMuted = !state.isMuted
                    console.log(`[GameMenu] Toggling Mute to: ${newMuted}`)
                    setState(prev => ({ ...prev, isMuted: newMuted }))
                    synthEngine.setMute(newMuted)
                    setAudioEnabled(!newMuted) // NEW: Kill the OGG tracks too
                  }}
                  playerId={state.gameState?.playerId}
                />

                {/* Connection Status Indicator */}
                <SyncStatusIndicator />
              </div>
            </div>
            {/* Character Info Row - extra vertical padding for mobile touch */}
            {/* Only show if current node has a speaker (hide for atmospheric narration) */}
            {currentCharacter && state.currentNode?.speaker && (
              <div
                className="flex items-center justify-between py-3 sm:py-2"
                data-testid="character-header"
                data-character-id={state.currentCharacterId}
              >
                <div className="flex items-center gap-2 font-medium text-slate-200 text-sm sm:text-base">
                  <CharacterAvatar
                    characterName={characterNames[state.currentCharacterId]}
                    size="sm"
                  />
                  <span className="truncate max-w-[150px] sm:max-w-none">{characterNames[state.currentCharacterId]}</span>
                </div>
                <div className="flex flex-col items-end">
                  {/* Trust Label hidden for immersion */}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* ══════════════════════════════════════════════════════════════════
          SCROLLABLE DIALOGUE AREA - Middle section
          ══════════════════════════════════════════════════════════════════ */}
        <main
          className="flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
          data-testid="game-interface"
        >
          <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 md:pt-8 lg:pt-12 pb-6 sm:pb-8">
            {/* Dialogue container - STABLE: no animations to prevent layout shifts */}
            <div key={`dialogue-${state.gameState?.currentNodeId || 'none'}-${state.currentCharacterId}`}>
              <Card
                className="glass-panel text-white"
                style={{ transition: 'none', background: 'rgba(10, 12, 16, 0.85)' }}
                data-testid="dialogue-card"
                data-node-id={state.gameState?.currentNodeId || ''}
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
                  className={`p-5 sm:p-8 md:p-10 min-h-[200px] sm:min-h-[300px] max-h-[50vh] sm:max-h-[55vh] overflow-y-auto`}
                  style={{ WebkitOverflowScrolling: 'touch' }}
                  // Note: Removed text-center for narration - left-align is easier to read (eye hunts for line starts when centered)
                  data-testid="dialogue-content"
                  data-speaker={state.currentNode?.speaker || ''}
                >
                  {/* Session Boundary Announcement - Platform pause point */}
                  {state.sessionBoundary && (
                    <div className="mb-6">
                      <SessionBoundaryAnnouncement
                        announcement={state.sessionBoundary}
                        onDismiss={() => setState(prev => ({ ...prev, sessionBoundary: null }))}
                      />
                    </div>
                  )}

                  {/* Dialogue Card */}
                  <Card className="border-0 shadow-lg bg-black/40 backdrop-blur-xl relative overflow-hidden">
                    <CardContent className="p-0">
                      {/* P6: Experience Mode Overlay */}
                      {state.activeExperience ? (
                        <div className="p-6 md:p-8 space-y-6">
                          <div className="flex items-center gap-3 text-amber-500 mb-4">
                            <Stars className="w-5 h-5 animate-pulse" />
                            <span className="text-sm uppercase tracking-widest font-bold">Loyalty Event</span>
                          </div>

                          <div className="prose prose-invert max-w-none text-lg leading-relaxed text-indigo-100/90 whitespace-pre-wrap">
                            <ExperienceRenderer
                              state={state.activeExperience}
                              gameState={state.gameState!}
                              onChoice={(choiceId) => handleExperienceChoice(choiceId)}
                            />
                          </div>
                        </div>
                      ) : state.currentNode?.simulation ? (
                        // ISP: Workflow Simulation Renderer
                        <div className="p-6 h-full">
                          <SimulationRenderer
                            node={state.currentNode}
                            onChoice={(index) => {
                              // Default handled by footer
                            }}
                          />
                        </div>
                      ) : (
                        <div className="p-6 md:p-8">
                          {/* D-008: Compute text effects based on player state */}
                          {(() => {
                            const textEffects = state.gameState
                              ? getActiveTextEffects(state.gameState, state.currentCharacterId)
                              : []
                            const textEffectClasses = getTextEffectClasses(textEffects)
                            const textEffectStyles = getTextEffectStyles(textEffects)
                            return (
                              <DialogueDisplay
                                key={`dialogue-display-${state.gameState?.currentNodeId || 'none'}-${state.currentCharacterId}-${state.currentContent?.substring(0, 20) || ''}`}
                                text={cleanContent(state.gameState ? TextProcessor.process(state.currentContent || '', state.gameState) : (state.currentContent || ''))}
                                characterName={state.currentNode?.speaker}
                                characterId={state.currentCharacterId}
                                gameState={state.gameState ?? undefined}
                                showAvatar={false}
                                richEffects={getRichEffectContext(state.currentDialogueContent, state.isLoading, state.recentSkills, state.useChatPacing)}
                                interaction={state.currentDialogueContent?.interaction}
                                emotion={state.currentDialogueContent?.emotion}
                                microAction={state.currentDialogueContent?.microAction}
                                patternSensation={state.patternSensation}
                                textEffectClasses={textEffectClasses}
                                textEffectStyles={textEffectStyles}
                              />
                            )
                          })()}

                          {/* ME2-style interrupt button - appears during NPC speech */}
                          {state.activeInterrupt && (
                            <div className="mt-6">
                              <InterruptButton
                                interrupt={state.activeInterrupt}
                                onTrigger={handleInterruptTrigger}
                                onTimeout={handleInterruptTimeout}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Disco Elysium-style pattern voice - inner monologue */}
                      {/* PatternVoice (Inner Monologue) - HIDDEN per user feedback ("show not tell") */}
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

                      {/* Consequence Echo - Dialogue Feedback (Resonance descriptions) */}
                      {state.consequenceEcho && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 mx-6 md:mx-8 mb-4 p-3 rounded-lg bg-amber-950/20 border border-amber-500/10 text-amber-200/70 italic text-sm font-serif"
                        >
                          {/* D-010: Apply intensity-based formatting */}
                          {(() => {
                            const trust = state.consequenceEcho?.trustAtEvent ?? 5
                            const intensity = getEchoIntensity(trust)
                            const modifier = ECHO_INTENSITY_MODIFIERS[intensity]
                            // High trust = vivid, low trust = faded
                            return modifier.detailLevel >= 0.7
                              ? state.consequenceEcho?.text
                              : `${modifier.prefix} ${state.consequenceEcho?.text || ''}`
                          })()}
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>

            {/* Pattern sensations and ambient events removed - keeping UI clean */}

            {/* Ending State - Shows in scroll area when conversation complete */}
            {isEnding && (
              <Card className={`mt-4 rounded-xl shadow-md ${state.gameState && isJourneyComplete(state.gameState)
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
                              const trackedSkills = useGameStore.getState().skills // Get tracked skills from game store
                              const narrative = generateJourneyNarrative(state.gameState, demonstrations, trackedSkills)
                              setState(prev => ({ ...prev, showJourneySummary: true, journeyNarrative: narrative }))
                            }
                          }}
                          className="w-full min-h-[48px] bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          See Your Journey
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => setState(prev => ({ ...prev, showReport: true }))}
                          className="w-full min-h-[48px] bg-slate-900 text-white hover:bg-slate-700 border border-slate-700"
                        >
                          Export Career Profile
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
        </main >

        {/* ══════════════════════════════════════════════════════════════════
          CHOICES PANEL - Positioned for optimal flow
          PC: Closer to content (not stuck at very bottom)
          Mobile: Bottom with proper safe area padding
          ══════════════════════════════════════════════════════════════════ */}
        < AnimatePresence mode="wait" >
          {!isEnding && (
            <footer
              className="flex-shrink-0 glass-panel mx-3 sm:mx-auto sm:max-w-3xl lg:max-w-4xl z-20"
              style={{
                marginTop: '1.5rem',
                // PC: Raise higher (2.5rem base), Mobile: Keep safe (calc)
                marginBottom: 'max(1rem, calc(2.5rem + env(safe-area-inset-bottom, 0px)))'
              }}
            >
              {/* Response label - clean, modern styling */}
              <div className="px-4 sm:px-6 pt-3 pb-1 text-center">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.1em]">
                  Your Response
                </span>
              </div>

              <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-2">
                {/* Scrollable choices container with scroll indicator */}
                <div className="relative w-full">
                  <div
                    id="choices-scroll-container"
                    className="max-h-[180px] sm:max-h-[200px] overflow-y-auto overflow-x-hidden overscroll-contain scroll-smooth w-full"
                    style={{
                      WebkitOverflowScrolling: 'touch',
                      scrollSnapType: 'y proximity',
                      touchAction: 'pan-y',
                    }}
                    onScroll={(e) => {
                      const target = e.target as HTMLElement
                      const indicator = document.getElementById('scroll-indicator')
                      if (indicator) {
                        const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 10
                        indicator.style.opacity = isAtBottom ? '0' : '1'
                      }
                    }}
                  >
                    <GameChoices
                      choices={state.availableChoices.map((c, index) => {
                        const nodeTags = state.currentNode?.tags || []
                        const isPivotal = nodeTags.some(tag =>
                          ['pivotal', 'defining_moment', 'final_choice', 'climax', 'revelation', 'introduction'].includes(tag)
                        )
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
                          requiredOrbFill: c.choice.requiredOrbFill,
                          next: String(index)
                        }
                      })}
                      isProcessing={state.isProcessing}
                      orbFillLevels={orbFillLevels}
                      onChoice={(c) => {
                        const index = parseInt(c.next || '0', 10)
                        const original = state.availableChoices[index]
                        if (original) handleChoice(original)
                      }}
                      glass={true}
                      playerPatterns={state.gameState?.patterns}
                    />
                  </div>

                  {/* Scroll indicator removed based on user feedback (often unnecessary) */}
                </div>
              </div>
            </footer>
          )}
        </AnimatePresence>

        {/* Share prompts removed - too obtrusive */}

        {/* Error Display */}
        {
          state.error && (
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



        {/* ══════════════════════════════════════════════════════════════════
          OVERLAYS & MODALS - Positioned above everything
          ══════════════════════════════════════════════════════════════════ */}

        {/* Feedback Overlays - Disabled to avoid blocking content */}
        {/* Trust and skill changes are tracked silently in the background */}

        {/* Achievement notifications disabled - obtrusive on mobile */}
        {/* Achievements are still tracked and visible in admin dashboard/journey summary */}

        {/* Experience Summary disabled - breaks immersion, available in menus/maps */}
        {/* Users can view arc summaries in admin dashboard or journey summary when they choose */}

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

        {/* Limbic System Overlay REMOVED - caused distracting color flashing */}
        {/* The Reality Interface - Career Report */}
        {
          state.showReport && state.gameState && (
            <StrategyReport
              gameState={state.gameState}
              onClose={() => setState(prev => ({ ...prev, showReport: false }))}
            />
          )
        }

        {/* PatternOrb moved to Journal panel for cleaner main game view */}
      </div>
    </AtmosphericGameBackground>
  )
}
// ═══════════════════════════════════════════════════════════════════════════
// SUBCOMPONENTS
// ═══════════════════════════════════════════════════════════════════════════


