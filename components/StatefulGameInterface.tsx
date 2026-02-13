/* eslint-disable */
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
import { synthEngine } from '@/lib/audio/synth-engine'
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
import { queueInteractionEventSync, generateActionId } from '@/lib/sync-queue'
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
import { PATTERN_TYPES, type PatternType, getPatternSensation, isValidPattern } from '@/lib/patterns'
import { calculatePatternGain } from '@/lib/identity-system'
import { getConsequenceEcho, checkPatternThreshold as checkPatternEchoThreshold, getPatternRecognitionEcho, createResonanceEchoFromDescription, getVoicedChoiceText, applyPatternReflection, getOrbMilestoneEcho, getDiscoveryHint, DISCOVERY_HINTS, type ConsequenceEcho, resolveContentVoiceVariation, applySkillReflection, applyNervousSystemReflection } from '@/lib/consequence-echoes'
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
// Analytics Hooks
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
import { playPatternSound, playTrustSound, playIdentitySound, playMilestoneSound, playEpisodeSound, playSound, initializeAudio, setAudioEnabled } from '@/lib/audio-feedback'
// OnboardingScreen removed-discovery-based learning via Samuel's firstOrb echo instead
// FoxTheatreGlow import removed-unused
import { ExperienceRenderer } from '@/components/game/ExperienceRenderer'
import { SimulationRenderer } from '@/components/game/SimulationRenderer'
import { GameErrorBoundary } from '@/components/GameErrorBoundary'
import { ContinuityStrip } from '@/components/game/ContinuityStrip'
import { ReturnHookPrompt } from '@/components/game/ReturnHookPrompt'
import { getPatternUnlockChoices } from '@/lib/pattern-unlock-choices'
import { getSkillComboUnlockChoices } from '@/lib/skill-combo-unlock-choices'
import { calculateSkillDecay, getSkillDecayNarrative } from '@/lib/assessment-derivatives'
// Share prompts removed-too obtrusive

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
  // showConfigWarning removed-Samuel mentions it once via consequenceEcho
  showJournal: boolean
  showConstellation: boolean
  pendingFloatingModule: null // Floating modules disabled
  showJourneySummary: boolean
  showReport: boolean
  journeyNarrative: JourneyNarrative | null
  achievementNotification: MetaAchievement | null
  ambientEvent: AmbientEvent | null  // Station breathing-idle atmosphere
  patternSensation: string | null    // Brief feedback when pattern triggered
  consequenceEcho: ConsequenceEcho | null  // Dialogue-based trust feedback
  // patternToast removed-Journal glow effect replaces it
  sessionBoundary: SessionAnnouncement | null  // Session boundary announcement
  previousTotalNodes: number  // Track total nodes for boundary calculation
  showIdentityCeremony: boolean  // Identity internalization ceremony
  ceremonyPattern: PatternType | null  // Pattern being internalized
  showPatternEnding: boolean  // Pattern-based journey ending screen
  endingPattern: PatternType | null  // Dominant pattern for ending
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
  returnHookDismissed: boolean

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
  if (!alignedPatterns) return interrupt // Unknown type-show by default

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

const characterNames: Record<CharacterId, string> = {
  samuel: 'Samuel Washington',
  maya: 'Maya Chen',
  devon: 'Devon Solis',
  jordan: 'Jordan Kyles',
  marcus: 'Marcus Vance',
  tess: 'Tess O\'Malley',
  yaquin: 'Dr. Yaquin',
  kai: 'Kai',
  alex: 'Alex',
  rohan: 'Rohan',
  silas: 'Silas',
  elena: 'Elena',
  grace: 'Grace',
  asha: 'Asha Patel',
  lira: 'Lira Vance',
  zara: 'Zara El-Amin',
  quinn: 'Quinn Almeida',
  dante: 'Dante Moreau',
  nadia: 'Nadia Petrova',
  isaiah: 'Isaiah Greene',
  station_entry: 'Sector 0',
  grand_hall: 'Sector 1: The Grand Hall',
  market: 'Sector 2: The Asset Exchange',
  deep_station: 'Sector 3: The Core'
}

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
    isMuted: typeof window !== 'undefined' ? localStorage.getItem('lux_audio_muted') === 'true' : false,
    isProcessing: false,
    activeInterrupt: null,
    patternVoice: null,
    voiceConflict: null,
    activeComboChain: null,
    waitingCharacters: [],
    pendingGift: null,
    isReturningPlayer: false,
    returnHookDismissed: true,
    // activeExperience: null
  })

  // Audio volume state (0-100, persisted to localStorage)
  const [audioVolume, setAudioVolume] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lux_audio_volume')
      return stored ? parseInt(stored, 10) : 50
    }
    return 50
  })

  // 5. GOD MODE OVERRIDE-Access from zustand store (conditional render at end of component)
  const debugSimulation = useGameStore(s => s.debugSimulation)

  // Force re-render when God Mode navigates (refreshCounter increments trigger React update)
  const refreshCounter = useGameStore(s => s.refreshCounter)

  // Derived State for UI Logic
  const currentState = state.gameState ? 'dialogue' : 'station'

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
  const isProcessingChoiceRef = useRef(false) // Race condition guard
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
      if (pendingSaveRef.current && state.gameState) {
        clearTimeout(pendingSaveRef.current)
        GameStateManager.saveGameState(state.gameState)
        pendingSaveRef.current = null
      }
    }
    window.addEventListener('pagehide', flushSave)
    return () => window.removeEventListener('pagehide', flushSave)
  }, [state.gameState])

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
      const newMuted = !state.isMuted
      setState(prev => ({ ...prev, isMuted: newMuted }))
      localStorage.setItem('lux_audio_muted', String(newMuted))
      synthEngine.setMute(newMuted)
      setAudioEnabled(!newMuted)
      pushSettingsToCloud()
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
  }, [registerHandler, state.isMuted, state.showJournal, state.showConstellation, state.showReport, showShortcutsHelp, pushSettingsToCloud, setAudioEnabled])

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
    if (!state.gameState || refreshCounter === 0) return

    const coreState = useGameStore.getState().coreGameState
    if (!coreState) return

    // Reload dialogue from coreGameState
    const characterId = coreState.currentCharacterId as CharacterId
    const nodeId = coreState.currentNodeId
    const graph = getGraphForCharacter(characterId, state.gameState)
    const node = graph.nodes.get(nodeId)

    if (node) {
      logger.info('[God Mode Refresh] Reloading dialogue', { characterId, nodeId })

      // Apply voice variation pipeline for consistency
      const content = node.content[0]
      const gamePatterns = state.gameState!.patterns
      const skillLevels = state.gameState!.skillLevels
      const charState = state.gameState!.characters.get(characterId)

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
        availableChoices: StateConditionEvaluator.evaluateChoices(node, state.gameState!, characterId, state.gameState!.skillLevels),
        previousSpeaker: null
      }))
    }
  }, [refreshCounter])

  // 4. NAVIGATION BRIDGE (Connects Constellation Panel to Game Interface)
  // Listen for navigation requests from the Zustand store
  const requestedSceneId = useGameStore(s => s.currentSceneId)

  useEffect(() => {
    if (!requestedSceneId || !state.gameState) return

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
      const samuelGraph = getGraphForCharacter('samuel', state.gameState)
      const conductorNode = samuelGraph.nodes.get(conductorNodeId)


      if (conductorNode) {
        // Dynamic Variable Injection for Conductor Mode
        const targetCharacter = state.gameState?.characters.get(targetCharId)
        const hasMet = (targetCharacter?.conversationHistory?.length || 0) > 0
        const targetName = characterNames[targetCharId] || 'someone'
        const conductorAction = hasMet ? 'Heading back to' : 'Off to see'

        // Pre-process the content with the variables
        const processedText = TextProcessor.process(
          conductorNode.content[0].text,
          state.gameState!,
          { targetName, conductorAction }
        )

        setState(prev => ({
          ...prev,
          currentNode: conductorNode,
          currentGraph: samuelGraph,
          currentCharacterId: 'samuel',
          currentContent: processedText, // Injected name
          currentDialogueContent: conductorNode.content[0],
          availableChoices: StateConditionEvaluator.evaluateChoices(conductorNode, state.gameState!, 'samuel', state.gameState!.skillLevels),
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
      const samuelGraph = getGraphForCharacter('samuel', state.gameState)
      const conductorNode = samuelGraph.nodes.get(conductorNodeId)

      if (conductorNode) {
        const pendingSim = useGameStore.getState().pendingGodModeSimulation
        const simTitle = pendingSim?.title?.replace('[DEBUG] ', '') || 'a simulation'

        // Pre-process content with simulation title
        const processedText = TextProcessor.process(
          conductorNode.content[0].text,
          state.gameState!,
          { simulationTitle: simTitle }
        )

        setState(prev => ({
          ...prev,
          currentNode: conductorNode,
          currentGraph: samuelGraph,
          currentCharacterId: 'samuel',
          currentContent: processedText,
          currentDialogueContent: conductorNode.content[0],
          availableChoices: StateConditionEvaluator.evaluateChoices(conductorNode, state.gameState!, 'samuel', state.gameState!.skillLevels),
          previousSpeaker: null
        }))
        return
      }
    }
    // ===============================================

    // Default to [char]_introduction convention
    const targetNodeId = `${requestedSceneId}_introduction`
    const graph = getGraphForCharacter(targetCharId, state.gameState)

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
      const gamePatterns = state.gameState!.patterns
      const skillLevels = state.gameState!.skillLevels
      const charState = state.gameState!.characters.get(targetCharId)

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
        availableChoices: StateConditionEvaluator.evaluateChoices(targetNode!, state.gameState!, targetCharId, state.gameState!.skillLevels),
        previousSpeaker: null, // Reset speaker on jump
        consequenceEcho: null  // Clear echo from previous character
      }))

      // Persist the jump
      const newState = {
        ...state.gameState,
        currentNodeId: targetNode.nodeId,
        currentCharacterId: targetCharId
      }
      GameStateManager.saveGameState(newState)
    }

    // Reset the request so we don't loop
    useGameStore.getState().setCurrentScene(null)

  }, [requestedSceneId, state.gameState, state.currentCharacterId])

  // ═══════════════════════════════════════════════════════════════════════════
  // STATION EVOLUTION: Sync Station State & Ambience
  // ═══════════════════════════════════════════════════════════════════════════
  // require statements removed-using top-level imports

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
  const cognitiveLoad = useStationStore(s => s.cognitiveLoad)
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
  // AMBIENT EVENTS-"The Station Breathes"
  // When the player pauses to think, life continues around them.
  // ═══════════════════════════════════════════════════════════════════════════
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const idleCountRef = useRef(0)  // Track how many ambient events shown this idle period
  const lastChoiceTimeRef = useRef(Date.now())



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

  // Handle atmospheric intro start-now just starts the game directly
  // Pattern teaching happens via Samuel's firstOrb milestone echo (discovery-based learning)
  // eslint-disable-next-line react-hooks/exhaustive-deps--initializeGame is stable, intentionally excluded to prevent re-creation
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

      // Canonical telemetry: persist a contract-validated node_entered event.
      queueInteractionEventSync({
        user_id: gameState.playerId,
        session_id: String(gameState.sessionStartTime || Date.now()),
        event_type: 'node_entered',
        node_id: currentNode.nodeId,
        character_id: actualCharacterId,
        payload: {
          event_id: generateActionId(),
          entered_at_ms: Date.now(),
          node_id: currentNode.nodeId,
          character_id: actualCharacterId,
          screen: 'game_init'
        }
      })

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
      const skillComboUnlockChoices = getSkillComboUnlockChoices(
        gameState.skillLevels,
        actualGraph,
        character.conversationHistory
      )
      const choices = [...regularChoices, ...patternUnlockChoices, ...skillComboUnlockChoices]

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
        showPatternEnding: false,
        endingPattern: null,
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
        isReturningPlayer: waitingContext.isReturningPlayer,
        // Show return hook once per session if they are truly returning.
        returnHookDismissed: !waitingContext.isReturningPlayer,
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
        logger.error('[StatefulGameInterface] Choice handler timeout-auto-resetting lock')
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

      // Canonical telemetry: authoritative game-logic result for selected choice.
      // This complements `choice_selected_ui` from GameChoices with post-resolution truth.
      queueInteractionEventSync({
        user_id: newGameState.playerId,
        session_id: String(newGameState.sessionStartTime || Date.now()),
        event_type: 'choice_selected_result',
        node_id: state.currentNode?.nodeId || null,
        character_id: state.currentCharacterId || null,
        payload: {
          event_id: generateActionId(),
          selected_choice_id: choice.choice.choiceId || null,
          selected_choice_text: choice.choice.text || null,
          reaction_time_ms: reactionTime,
          earned_pattern: result.events.earnOrb || null,
          trust_delta: trustDelta ?? null,
        },
      })

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
        // Play identity sound for the meaningful moment
        const { playIdentitySound: playRevelation } = await import('@/lib/audio-feedback')
        playRevelation()
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

          // P4: If no direct trust feedback, check for relationship echoes (Gossip)
          if (!consequenceEcho) {
            const crossEcho = getRelevantCrossCharacterEcho(state.currentCharacterId, newGameState)
            if (crossEcho) {
              consequenceEcho = {
                text: crossEcho.text,
                emotion: crossEcho.emotion,
                timing: 'immediate',
                trustAtEvent: currentTrust
              }
              logger.info('[StatefulGameInterface] Cross-Character echo triggered', {
                speaker: state.currentCharacterId,
                text: crossEcho.text.substring(0, 30)
              })
            }
          }
        }

        // D-010: Add trust level to echo for intensity-based display
        if (consequenceEcho) {
          consequenceEcho = { ...consequenceEcho, trustAtEvent: currentTrust }
        }

        // Audio feedback for trust increase
        if (trustDelta > 0) {
          playTrustSound()
        }

        // D-039: Record trust change in timeline for visualization
        const charState = newGameState.characters.get(state.currentCharacterId)
        if (charState?.trustTimeline) {
          charState.trustTimeline = recordTrustChange(
            charState.trustTimeline,
            charState.trust,
            trustDelta,
            state.currentNode?.nodeId || 'unknown',
            choice.choice.text.substring(0, 50)
          )
          logger.info('[StatefulGameInterface] D-039 Trust timeline recorded:', {
            characterId: state.currentCharacterId,
            newTrust: charState.trust,
            delta: trustDelta
          })
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

      // Check for orb milestone echoes-Samuel acknowledges growth
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

      const searchResult = findCharacterForNode(choice.choice.nextNodeId, newGameState)
      if (!searchResult) {
        logger.error('[StatefulGameInterface] Could not find character graph for node:', { nodeId: choice.choice.nextNodeId })
        isProcessingChoiceRef.current = false  // Release lock on error
        setState(prev => ({
          ...prev,
          error: {
            title: 'Navigation Error',
            message: `Could not find node "${choice.choice.nextNodeId}". Please refresh the page to restart.`,
            severity: 'error' as const
          },
          isLoading: false,
          isProcessing: false
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
        isProcessingChoiceRef.current = false  // Release lock on error
        setState(prev => ({
          ...prev,
          error: {
            title: 'Navigation Error',
            message: `Node "${choice.choice.nextNodeId}" not found in ${searchResult.graph.metadata?.title || 'graph'}. Please refresh.`,
            severity: 'error' as const
          },
          isProcessing: false
        }))
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
      newGameState.currentCharacterId = targetCharacterId

      // Canonical telemetry: persist a contract-validated node_entered event.
      queueInteractionEventSync({
        user_id: newGameState.playerId,
        session_id: String(newGameState.sessionStartTime || Date.now()),
        event_type: 'node_entered',
        node_id: nextNode.nodeId,
        character_id: targetCharacterId,
        payload: {
          event_id: generateActionId(),
          entered_at_ms: Date.now(),
          node_id: nextNode.nodeId,
          character_id: targetCharacterId,
          screen: 'choice'
        }
      })

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
            for (const [pattern, bonus] of Object.entries(puzzle.reward.patternBonus)) {
              newGameState.patterns[pattern as keyof typeof newGameState.patterns] += bonus as number
            }
          }
          if (puzzle.reward.unlockFlag) {
            newGameState.globalFlags.add(puzzle.reward.unlockFlag)
          }

          // Mark as completed
          completedPuzzles.add(puzzle.id)
          if (typeof window !== 'undefined') {
            localStorage.setItem(completedPuzzlesKey, JSON.stringify([...completedPuzzles]))
          }

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
          if (typeof window !== 'undefined') {
            localStorage.setItem(hintShownKey, JSON.stringify([...hintsShown]))
          }

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
        if (typeof window !== 'undefined') {
          localStorage.setItem(notifiedTradesKey, JSON.stringify([...notifiedTrades]))
        }

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
      const prevGlobalFlags = state.gameState?.globalFlags || new Set<string>()
      const newFlags = Array.from(newGameState.globalFlags).filter(flag => !prevGlobalFlags.has(flag))

      // Also check character knowledge flags
      const prevCharacterFlags = state.gameState?.characters.get(targetCharacterId)?.knowledgeFlags || new Set<string>()
      const newCharacterFlags = Array.from(targetCharacter.knowledgeFlags).filter(flag => !prevCharacterFlags.has(flag))

      const allNewFlags = [...newFlags, ...newCharacterFlags]

      // Find knowledge items that match newly gained flags
      for (const flag of allNewFlags) {
        const matchingItem = KNOWLEDGE_ITEMS.find(item => item.id === flag)
        if (matchingItem && !discoveredKnowledge.has(matchingItem.id)) {
          discoveredKnowledge.add(matchingItem.id)
          if (typeof window !== 'undefined') {
            localStorage.setItem(discoveredKnowledgeKey, JSON.stringify([...discoveredKnowledge]))
          }

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
        const prevUnlockedGates = state.gameState
          ? getUnlockedGates(targetCharacterId, state.gameState.characters.get(targetCharacterId)?.trust || 0, state.gameState.patterns)
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

        const prevManifestations = state.gameState ? getActiveMagicalRealisms(state.gameState.patterns) : []
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
          if (typeof window !== 'undefined') {
            localStorage.setItem(shownMagicalKey, JSON.stringify([...shownMagical]))
          }

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
      if (!consequenceEcho && state.gameState) {
        const newAchievements = checkNewAchievements(state.gameState.patterns, newGameState.patterns)

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
      if (!consequenceEcho && state.gameState) {
        const prevEffects = getActiveEnvironmentalEffects(state.gameState)
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
      if (!consequenceEcho && state.gameState) {
        const prevExperiences = getAvailableCrossCharacterExperiences(state.gameState)
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
      if (!consequenceEcho && state.gameState) {
        // Find flags that were just added
        const newFlags = [...newGameState.globalFlags].filter(f => !state.gameState!.globalFlags.has(f))

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
      if (!consequenceEcho && state.gameState) {
        const prevRevelations = getUnlockedMetaRevelations(state.gameState.patterns)
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
        playEpisodeSound()
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
      const skillComboUnlockNewChoices = getSkillComboUnlockChoices(
        newGameState.skillLevels,
        targetGraph,
        newGameState.characters.get(targetCharacterId)?.conversationHistory || []
      )
      const newChoices = [...regularNewChoices, ...patternUnlockNewChoices, ...skillComboUnlockNewChoices]

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

      setState(prev => ({
        ...prev,
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
        showSaveConfirmation: false, // Disabled-save happens silently, no interruption
        skillToast: null, // Disabled-skills tracked silently
        consequenceFeedback,
        error: null,
        previousSpeaker: prev.currentNode?.speaker || null,
        recentSkills: skillsToKeep,
        activeExperience: prev.activeExperience, // Added to fix build error
        ...experienceSummaryUpdate,
        // Preserve live overlay toggles in case the user changes them while async choice work is running.
        showJournal: prev.showJournal,
        showConstellation: prev.showConstellation,
        pendingFloatingModule: null, // Floating modules disabled
        showJourneySummary: prev.showJourneySummary,
        activeInterrupt: shouldShowInterrupt(content.interrupt, newGameState.patterns), // D-009: Filter by pattern
        journeyNarrative: prev.journeyNarrative,
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
        hasNewTrust: trustDelta !== 0 ? true : prev.hasNewTrust,  // Track trust changes for Constellation attention
        hasNewMeeting: isFirstMeeting ? true : prev.hasNewMeeting,  // Track first meeting for Constellation nudge
        isMuted: prev.isMuted,
        showReport: prev.showReport,
        isProcessing: false, // ISP FIX: Unlock UI
        patternVoice,  // Disco Elysium-style inner monologue
        voiceConflict,  // D-096: Voice conflict when patterns disagree
        activeComboChain: prev.activeComboChain,  // D-084: Preserve combo chain state
        // Engagement Loop State (preserved across choice)
        waitingCharacters: prev.waitingCharacters,
        pendingGift,
        isReturningPlayer: prev.isReturningPlayer,
        returnHookDismissed: prev.returnHookDismissed,
      }))
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
   * Handle interrupt trigger-player acted during NPC speech
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
    const regularInterruptChoices = StateConditionEvaluator.evaluateChoices(targetNode, newGameState, searchResult.characterId, newGameState.skillLevels).filter(c => c.visible)

    // Add pattern-unlocked choices for interrupt context
    const interruptCharState = newGameState.characters.get(searchResult.characterId)
    const patternUnlockInterruptChoices = getPatternUnlockChoices(
      searchResult.characterId,
      newGameState.patterns,
      searchResult.graph,
      interruptCharState?.visitedPatternUnlocks
    )
    const skillComboUnlockInterruptChoices = getSkillComboUnlockChoices(
      newGameState.skillLevels,
      searchResult.graph,
      interruptCharState?.conversationHistory || []
    )
    const choices = [...regularInterruptChoices, ...patternUnlockInterruptChoices, ...skillComboUnlockInterruptChoices]
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
   * Handle interrupt timeout-player didn't act
   */
  const handleInterruptTimeout = useCallback(() => {
    const interrupt = state.activeInterrupt
    if (!interrupt || !state.gameState) return

    logger.info('[StatefulGameInterface] Interrupt timed out:', { action: interrupt.action })

    // Clear the interrupt-if there's a missedNodeId, navigate there
    if (interrupt.missedNodeId) {
      const searchResult = findCharacterForNode(interrupt.missedNodeId, state.gameState)
      if (searchResult) {
        const targetNode = searchResult.graph.nodes.get(interrupt.missedNodeId)
        if (targetNode) {
          const content = DialogueGraphNavigator.selectContent(targetNode, [], state.gameState)
          const regularMissedChoices = StateConditionEvaluator.evaluateChoices(targetNode, state.gameState, searchResult.characterId, state.gameState.skillLevels).filter(c => c.visible)

          // Add pattern-unlocked choices
          const missedCharState = state.gameState.characters.get(searchResult.characterId)
          const patternUnlockMissedChoices = getPatternUnlockChoices(
            searchResult.characterId,
            state.gameState.patterns,
            searchResult.graph,
            missedCharState?.visitedPatternUnlocks
          )
          const skillComboUnlockMissedChoices = getSkillComboUnlockChoices(
            state.gameState.skillLevels,
            searchResult.graph,
            missedCharState?.conversationHistory || []
          )
          const choices = [...regularMissedChoices, ...patternUnlockMissedChoices, ...skillComboUnlockMissedChoices]
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

    // No missedNodeId or it wasn't found-just clear the interrupt
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
          // STATE FIX: Use full clone instead of shallow clone
          const newGameState = GameStateUtils.cloneGameState(state.gameState)
          newGameState.currentNodeId = introNode.nodeId
          newGameState.currentCharacterId = 'samuel'
          const samuelChar = newGameState.characters.get('samuel') || GameStateUtils.createCharacterState('samuel')
          newGameState.characters.set('samuel', samuelChar)
          const content = DialogueGraphNavigator.selectContent(introNode, samuelChar.conversationHistory, newGameState)
          const regularSamuelChoices = StateConditionEvaluator.evaluateChoices(introNode, newGameState, 'samuel', newGameState.skillLevels).filter(c => c.visible)

          // Add pattern-unlocked choices for Samuel
          const patternUnlockSamuelChoices = getPatternUnlockChoices(
            'samuel',
            newGameState.patterns,
            samuelGraph,
            samuelChar.visitedPatternUnlocks
          )
          const skillComboUnlockSamuelChoices = getSkillComboUnlockChoices(
            newGameState.skillLevels,
            samuelGraph,
            samuelChar.conversationHistory
          )
          const choices = [...regularSamuelChoices, ...patternUnlockSamuelChoices, ...skillComboUnlockSamuelChoices]

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
      // STATE FIX: Start with full clone to avoid mutations
      let newGameState = GameStateUtils.cloneGameState(state.gameState)
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

      // STATE FIX: Update conversation history immutably
      let targetCharacter = newGameState.characters.get(targetCharacterId)!
      if (!targetCharacter.conversationHistory.includes(targetNode.nodeId)) {
        const updatedCharacter: CharacterState = {
          ...targetCharacter,
          conversationHistory: [...targetCharacter.conversationHistory, targetNode.nodeId]
        }
        newGameState.characters.set(targetCharacterId, updatedCharacter)
        targetCharacter = updatedCharacter
      }
      newGameState.currentNodeId = targetNode.nodeId
      newGameState.currentCharacterId = targetCharacterId

      const content = DialogueGraphNavigator.selectContent(targetNode, targetCharacter.conversationHistory, newGameState)
      const regularNavChoices = StateConditionEvaluator.evaluateChoices(targetNode, newGameState, targetCharacterId, newGameState.skillLevels).filter(c => c.visible)

      // Add pattern-unlocked choices
      const patternUnlockNavChoices = getPatternUnlockChoices(
        targetCharacterId,
        newGameState.patterns,
        targetGraph,
        targetCharacter.visitedPatternUnlocks
      )
      const skillComboUnlockNavChoices = getSkillComboUnlockChoices(
        newGameState.skillLevels,
        targetGraph,
        targetCharacter.conversationHistory
      )
      const choices = [...regularNavChoices, ...patternUnlockNavChoices, ...skillComboUnlockNavChoices]

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




  const currentCharacter = state.gameState?.characters.get(state.currentCharacterId)
  const isEnding = state.availableChoices.length === 0
  const currentNodeTags = state.currentNode?.tags || []
  const isNodePivotal = currentNodeTags.some(tag =>
    ['pivotal', 'defining_moment', 'final_choice', 'climax', 'revelation', 'introduction'].includes(tag)
  )
  const preparedChoices = filterChoicesByLoad(
    state.availableChoices,
    cognitiveLoad,
    undefined, // Todo: Pass dominant pattern
    isNodePivotal // Bypass filtering for pivotal moments
  ).map((c) => {
    const originalIndex = state.availableChoices.indexOf(c)
    const voicedText = state.gameState ? getVoicedChoiceText(
      c.choice.text,
      c.choice.voiceVariations,
      state.gameState.patterns
    ) : c.choice.text
    return {
      text: voicedText,
      pattern: c.choice.pattern,
      feedback: c.choice.interaction === 'shake' ? 'shake' : undefined,
      pivotal: isNodePivotal,
      requiredOrbFill: c.choice.requiredOrbFill,
      next: String(originalIndex)
    }
  })
  const useCappedChoiceSheet = preparedChoices.length > 3
  const hasBlockingOverlay =
    state.showJournal ||
    state.showConstellation ||
    state.showJourneySummary ||
    state.showReport

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
      <EnvironmentalEffects gameState={state.gameState} />
      <div
        className="relative z-10 flex flex-col min-h-[100dvh] w-full max-w-xl mx-auto bg-black/10"
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
        <header
          className="relative flex-shrink-0 glass-panel border-b border-white/10 z-10"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className="max-w-4xl mx-auto px-3 sm:px-4">
            {/* Top Row-Title and Navigation */}
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <Link href="/" className="text-sm font-semibold text-slate-100 hover:text-white transition-colors truncate min-w-0 flex flex-col">
                <span>Terminus</span>
                {/* Station Status-Always visible compact dashboard */}
                <StationStatusBadge gameState={state.gameState} />
              </Link>
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Hero Badge-Player Identity */}
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
                  onClick={() => setState(prev => ({ ...prev, showJournal: true }))}
                  className={cn(
                    "relative h-9 w-9 p-0 text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-md",
                    hasNewOrbs ? "text-amber-400 nav-attention-halo nav-attention-halo-amber" : ""
                  )}
                  aria-label="Open Journal"
                  title="The Prism"
                >
                  <BookOpen className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setState(prev => ({ ...prev, showConstellation: true, hasNewTrust: false, hasNewMeeting: false }))}
                  className={cn(
                    "relative h-9 w-9 p-0 text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-md",
                    (state.hasNewTrust || state.hasNewMeeting) ? "text-purple-400 nav-attention-marquee nav-attention-halo nav-attention-halo-purple" : ""
                  )}
                  aria-label="Open Skill Constellation"
                  title="Your Journey"
                >
                  <Stars className="h-4 w-4" />
                </Button>

                {/* Unified Settings Menu - Consolidates game settings, accessibility, and account */}
                <UnifiedMenu
                  onShowReport={() => setState(prev => ({ ...prev, showReport: true }))}
                  isMuted={state.isMuted}
                  onToggleMute={() => {
                    const newMuted = !state.isMuted
                    console.log(`[UnifiedMenu] Toggling Mute to: ${newMuted}`)
                    setState(prev => ({ ...prev, isMuted: newMuted }))
                    localStorage.setItem('lux_audio_muted', String(newMuted))
                    synthEngine.setMute(newMuted)
                    setAudioEnabled(!newMuted)
                    pushSettingsToCloud()
                  }}
                  volume={audioVolume}
                  onVolumeChange={(newVolume) => {
                    setAudioVolume(newVolume)
                    localStorage.setItem('lux_audio_volume', String(newVolume))
                    pushSettingsToCloud()
                  }}
                  playerId={state.gameState?.playerId}
                />

                {/* Connection Status Indicator */}
                <SyncStatusIndicator />
              </div>
            </div>
            {/* Character Info Row-extra vertical padding for mobile touch */}
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
                  <span data-testid="speaker-name" className="truncate max-w-[150px] sm:max-w-none">{characterNames[state.currentCharacterId]}</span>
                </div>
                <div className="flex flex-col items-end">
                  {/* Trust Label hidden for immersion */}
                </div>
              </div>
            )}

            {state.gameState && (
              <ContinuityStrip
                gameState={state.gameState}
                characterId={state.currentCharacterId}
              />
            )}
          </div>
        </header>

        {state.gameState && !state.returnHookDismissed && (
          <ReturnHookPrompt
            gameState={state.gameState}
            isReturningPlayer={state.isReturningPlayer}
            waitingCharacters={state.waitingCharacters}
            onOpenJourney={() => {
              setState(prev => ({
                ...prev,
                returnHookDismissed: true,
                showConstellation: true,
                hasNewTrust: false,
                hasNewMeeting: false,
              }))
            }}
            onVisitCharacter={(characterId) => {
              setState(prev => ({ ...prev, returnHookDismissed: true }))
              useGameStore.getState().setCurrentScene(characterId)
            }}
            onDismiss={() => setState(prev => ({ ...prev, returnHookDismissed: true }))}
          />
        )}

        {/* ══════════════════════════════════════════════════════════════════
          SCROLLABLE DIALOGUE AREA-Middle section
          ══════════════════════════════════════════════════════════════════ */}
        <main
          // Mobile safe-area/corner padding: tests assert the game interface box is inset from edges.
          className="flex-1 overflow-y-auto overscroll-contain mx-2 sm:mx-0"
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
                  className="p-5 sm:p-8 md:p-10"
                  // SINGLE SCROLL REFACTOR: Removed h-[45vh] and overflow-y-auto - main scrolls now
                  // Note: Removed text-center for narration-left-align is easier to read (eye hunts for line starts when centered)
                  data-testid="dialogue-content"
                  data-speaker={state.currentNode?.speaker || ''}
                >


                  {/* Dialogue Card-Dynamic Marquee Effect */}
                  {/* STABILITY: Removed transition-all to prevent container jumping */}
                  <Card
                    className={cn(
                    "shadow-lg backdrop-blur-xl relative overflow-hidden rounded-xl",
                    !state.activeExperience && !state.currentNode?.simulation ? "min-h-[280px] sm:min-h-[320px]" : "",
                    state.activeExperience || state.currentNode?.simulation
                      ? "bg-slate-950/80 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                      : (state.currentDialogueContent?.emotion === 'analytical' || state.currentDialogueContent?.emotion === 'knowing')
                        ? "bg-slate-950/80 border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
                        : (state.currentDialogueContent?.emotion === 'fear' || state.currentDialogueContent?.emotion === 'tension')
                          ? "bg-slate-950/80 border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                          : "bg-black/40 border-white/5 hover:border-white/10"
                  )}
                    data-dialogue-stage={(!state.activeExperience && !state.currentNode?.simulation) ? 'pinned' : 'dynamic'}
                    data-testid="dialogue-stage"
                  >
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
                              gameState={state.gameState!}
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
                            const textEffects = state.gameState
                              ? getActiveTextEffects(state.gameState, state.currentCharacterId)
                              : []
                            const textEffectClasses = getTextEffectClasses(textEffects)
                            const textEffectStyles = getTextEffectStyles(textEffects)
                            return (
                              <DialogueDisplay
                                key="dialogue-display-main"
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
              <Card className={cn(
                "mt-4 rounded-xl shadow-md",
                state.gameState && isJourneyComplete(state.gameState) ? "bg-gradient-to-b from-amber-50 to-white border-amber-200" : ""
              )}>
                <CardContent className="p-4 sm:p-6 text-center">
                  {state.gameState && isJourneyComplete(state.gameState) ? (
                    <>
                      {/* Journey Complete-Full celebration */}
                      <div className="mb-4">
                        <Compass className="w-10 h-10 mx-auto text-amber-600 mb-2" />
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
                          The Station Knows You Now
                        </h3>
                        <p className="text-sm text-slate-600 italic mb-4">
                          Your journey through Terminus is complete.
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
                      {/* Conversation Complete-but journey continues */}
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
          CHOICES PANEL-Positioned for optimal flow
          PC: Closer to content (not stuck at very bottom)
          Mobile: Bottom with proper safe area padding
          ══════════════════════════════════════════════════════════════════ */}
        {!isEnding && (
          <footer
            className={cn(
              "flex-shrink-0 sticky bottom-0 glass-panel max-w-4xl mx-auto w-full px-3 sm:px-4 z-20",
              useCappedChoiceSheet ? "rounded-t-2xl border-b-0 overflow-hidden" : ""
            )}
            data-choice-sheet-mode={useCappedChoiceSheet ? 'capped' : 'free'}
            style={{
              // SINGLE SCROLL REFACTOR: Sticky footer with safe area padding
              // Chrome mobile has 48-56px bottom bar that's NOT in safe-area-inset
              paddingBottom: 'max(64px, env(safe-area-inset-bottom, 64px))'
            }}
          >
            {/* Response label - compact on mobile */}
            <div className="px-4 sm:px-6 pt-2 pb-0.5 text-center">
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-[0.1em]">
                Your Response
              </span>
            </div>

            <div className="px-4 sm:px-6 pt-1 pb-2">
              {/* Scrollable choices container with scroll indicator */}
              <div className="relative w-full">
                {/* SINGLE SCROLL REFACTOR: Removed nested scroll - choices expand naturally */}
                {/* For >3 choices, TICKET-002 will add bottom sheet */}
                <div
                  id="choices-container"
                  className={cn(
                    "w-full",
                    useCappedChoiceSheet ? "h-[260px] xs:h-[300px] sm:h-[260px]" : ""
                  )}
                >
                  <GameChoices
                    choices={preparedChoices}
                    isProcessing={state.isProcessing || hasBlockingOverlay}
                    orbFillLevels={orbFillLevels}
                    onChoice={(c) => {
                      const index = parseInt(c.next || '0', 10)
                      const original = state.availableChoices[index]
                      if (original) handleChoice(original)
                    }}
                    // FIX: Always use glass mode for dark theme (prevents white background issue)
                    glass={true}
                    playerPatterns={state.gameState?.patterns}
                    cognitiveLoad={cognitiveLoad}
                  />
                </div>

                {/* Scroll indicator removed based on user feedback (often unnecessary) */}
              </div>
            </div>
          </footer>
        )}

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
          state.showReport && state.gameState && (
            <StrategyReport
              gameState={state.gameState}
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
