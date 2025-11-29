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

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DialogueDisplay } from '@/components/DialogueDisplay'
import type { RichTextEffect } from '@/components/RichTextRenderer'
import { AtmosphericIntro } from '@/components/AtmosphericIntro'
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
import { SkillTracker } from '@/lib/skill-tracker'
import { SCENE_SKILL_MAPPINGS } from '@/lib/scene-skill-mappings'
import { queueRelationshipSync, queuePlatformStateSync } from '@/lib/sync-queue'
import { useGameStore } from '@/lib/game-store'
import { CHOICE_HANDLER_TIMEOUT_MS } from '@/lib/constants'
import { ExperienceSummary, type ExperienceSummaryData } from '@/components/ExperienceSummary'
import { NarrativeFeedback } from '@/components/NarrativeFeedback'
import { SyncStatusIndicator } from '@/components/SyncStatusIndicator'
import { detectArcCompletion, generateExperienceSummary } from '@/lib/arc-learning-objectives'
import { loadSkillProfile } from '@/lib/skill-profile-adapter'
import { isSupabaseConfigured } from '@/lib/supabase'
import { GameChoices } from '@/components/GameChoices'
import { Brain, BookOpen, Stars, RefreshCw } from 'lucide-react'
import { ThoughtCabinet } from '@/components/ThoughtCabinet'
import { Journal } from '@/components/Journal'
import { ProgressIndicator } from '@/components/ProgressIndicator'
import { ConstellationPanel } from '@/components/constellation'
import { TextProcessor } from '@/lib/text-processor'

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
}

export default function StatefulGameInterface() {
  const safeStart = getSafeStart()
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
    error: null,
    showTransition: false,
    transitionData: null,
    recentSkills: [],
    showExperienceSummary: false,
    experienceSummaryData: null,
    showConfigWarning: !isSupabaseConfigured(),
    showThoughtCabinet: false,
    showJournal: false,
    showConstellation: false
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
      state: state as any,
      speed: 1.0
    }
  }, [enableRichEffects])

  // Refs & Sync
  const skillTrackerRef = useRef<SkillTracker | null>(null)
  const isProcessingChoiceRef = useRef(false) // Race condition guard
  const { queueStats: _queueStats } = useBackgroundSync({ enabled: true })
  const [hasSaveFile, setHasSaveFile] = useState(false)
  const [_saveIsComplete, setSaveIsComplete] = useState(false)

  useEffect(() => {
    if (state.showSaveConfirmation) {
      const timer = setTimeout(() => setState(prev => ({ ...prev, showSaveConfirmation: false })), 2000)
      return () => clearTimeout(timer)
    }
  }, [state.showSaveConfirmation])

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

  // Initialize game logic
  const initializeGame = useCallback(async () => {
    console.log('🎮 Initializing Stateful Narrative Engine...')
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
          console.log('✅ Player profile ensured:', gameState.playerId)
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

      const content = DialogueGraphNavigator.selectContent(currentNode, character.conversationHistory)
      const choices = StateConditionEvaluator.evaluateChoices(currentNode, gameState, actualCharacterId).filter(c => c.visible)

      setState({
        gameState,
        currentNode,
        currentGraph: actualGraph,
        currentCharacterId: actualCharacterId,
        availableChoices: choices,
        currentContent: content.text,
        currentDialogueContent: content,
        useChatPacing: content.useChatPacing || false,
        isLoading: false,
        hasStarted: true,
        selectedChoice: null,
        showSaveConfirmation: false,
        skillToast: null,
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
        showConstellation: false
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
      console.log('🔄 Zustand synced with CoreGameState:', {
        characterCount: serializedState.characters.length,
        patterns: serializedState.patterns,
        currentNodeId: serializedState.currentNodeId
      })

    } catch (error) {
        console.error('Init error', error)
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
      if (choice.choice.consequence) newGameState = GameStateUtils.applyStateChange(newGameState, choice.choice.consequence)
      if (choice.choice.pattern) newGameState = GameStateUtils.applyStateChange(newGameState, { patternChanges: { [choice.choice.pattern]: 1 } })

      const searchResult = findCharacterForNode(choice.choice.nextNodeId, newGameState)
      if (!searchResult) return

      const nextNode = searchResult.graph.nodes.get(choice.choice.nextNodeId)!
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

      const completedArc = detectArcCompletion(state.gameState, newGameState)
      const experienceSummaryUpdate = { showExperienceSummary: false, experienceSummaryData: null as ExperienceSummaryData | null }

      if (completedArc) {
          // Get actual skill demonstrations from tracker for personalized summary
          const demonstrations = skillTrackerRef.current?.getAllDemonstrations() || []

          loadSkillProfile(newGameState.playerId)
              .then(profile => generateExperienceSummary(completedArc, newGameState, profile, demonstrations))
              .then(summaryData => setState(prev => ({ ...prev, showExperienceSummary: true, experienceSummaryData: summaryData })))
              .catch(() => setState(prev => ({ ...prev, showExperienceSummary: true, experienceSummaryData: null }))) // Fallback
      }
    
      setState({
          gameState: newGameState,
          currentNode: nextNode,
          currentGraph: targetGraph,
          currentCharacterId: targetCharacterId,
          availableChoices: newChoices,
          currentContent: content.text,
          currentDialogueContent: content,
          useChatPacing: content.useChatPacing || false,
          isLoading: false,
          hasStarted: true,
          selectedChoice: null,
          showSaveConfirmation: true,
          skillToast: null, // Disabled - skills tracked silently
          error: null,
          showTransition: false,
          transitionData: null,
          previousSpeaker: state.currentNode?.speaker || null,
          recentSkills: skillsToKeep,
          ...experienceSummaryUpdate,
          showConfigWarning: state.showConfigWarning,
          showThoughtCabinet: state.showThoughtCabinet,
          showJournal: state.showJournal,
          showConstellation: state.showConstellation
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
      const zustandStore = useGameStore.getState()

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
  }, [state.gameState, state.currentNode, state.showConfigWarning, state.recentSkills, state.showThoughtCabinet, state.showJournal, state.showConstellation])


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
    rohan: 'Rohan',
    silas: 'Silas'
  }
  
  const currentCharacter = state.gameState?.characters.get(state.currentCharacterId)
  const isEnding = state.availableChoices.length === 0

  return (
    <div
      key="game-container"
      className="h-screen h-[100dvh] flex flex-col bg-stone-100"
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
          {/* Top Navigation Row */}
          <div className="flex justify-between items-center py-2">
            <div className="flex gap-1 sm:gap-2 items-center">
              {/* All buttons must be 44px minimum touch target (Apple HIG, Android MD) */}
              <button
                onClick={() => setState(prev => ({ ...prev, showJournal: true }))}
                className="min-w-[44px] min-h-[44px] p-2.5 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors text-slate-500 flex items-center justify-center"
                aria-label="Open Journal"
              >
                <BookOpen className="w-5 h-5" />
              </button>
              <button
                onClick={() => setState(prev => ({ ...prev, showThoughtCabinet: true }))}
                className="min-w-[44px] min-h-[44px] p-2.5 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors text-slate-500 flex items-center justify-center"
                aria-label="Open Thought Cabinet"
              >
                <Brain className="w-5 h-5" />
              </button>
              <button
                onClick={() => setState(prev => ({ ...prev, showConstellation: true }))}
                className="min-w-[44px] min-h-[44px] p-2.5 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors text-slate-500 flex items-center justify-center"
                aria-label="Open Skill Constellation"
              >
                <Stars className="w-5 h-5" />
              </button>
              <Link href="/student/insights">
                <button className="min-h-[44px] text-xs sm:text-sm text-blue-600 hover:text-blue-700 active:text-blue-800 transition-colors px-3 py-2 font-medium rounded-md hover:bg-blue-50 active:bg-blue-100">
                  Your Journey
                </button>
              </Link>
              <Link href="/admin" className="hidden sm:block">
                <button className="min-h-[44px] text-xs text-slate-400 hover:text-slate-600 transition-colors px-3 py-2 rounded-md hover:bg-slate-100">
                  Admin
                </button>
              </Link>
            </div>
            <div className="flex gap-1 sm:gap-2 items-center">
              <ProgressIndicator />
              <SyncStatusIndicator />
              <button
                onClick={() => window.location.reload()}
                className="min-w-[44px] min-h-[44px] text-xs text-slate-400 hover:text-slate-600 active:text-slate-800 px-2 sm:px-3 py-2 rounded-md hover:bg-slate-100 active:bg-slate-200 flex items-center gap-1"
                aria-label="New Conversation"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">New</span>
              </button>
            </div>
          </div>

          {/* Character Info Row */}
          {currentCharacter && (
            <div className="flex items-center justify-between py-2 border-t border-stone-200/50">
              <div className="flex items-center gap-2 font-medium text-slate-700 text-sm sm:text-base">
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
          SCROLLABLE DIALOGUE AREA - Middle section (flex-1 takes remaining space)
          ══════════════════════════════════════════════════════════════════ */}
      <main
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
        data-testid="game-interface"
      >
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4">
          <Card
            key="dialogue-card"
            className="rounded-xl shadow-sm bg-amber-50/40 border-stone-200/60"
            style={{ transition: 'none' }}
            data-testid="dialogue-card"
          >
            <CardContent
              className="p-5 sm:p-8 md:p-10 min-h-[200px] sm:min-h-[300px]"
              data-testid="dialogue-content"
              data-speaker={state.currentNode?.speaker || ''}
            >
              <DialogueDisplay
                text={state.gameState ? TextProcessor.process(state.currentContent || '', state.gameState) : (state.currentContent || '')}
                useChatPacing={state.useChatPacing}
                characterName={state.currentNode?.speaker}
                showAvatar={false}
                richEffects={getRichEffectContext(state.currentDialogueContent, state.isLoading, state.recentSkills, state.useChatPacing)}
                interaction={state.currentDialogueContent?.interaction}
              />
            </CardContent>
          </Card>

          {/* Ending State - Shows in scroll area when conversation complete */}
          {isEnding && (
            <Card className="mt-4 rounded-xl shadow-md">
              <CardContent className="p-4 sm:p-6 text-center">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">
                  Conversation Complete
                </h3>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full min-h-[48px] active:scale-[0.98] transition-transform"
                >
                  Return to Station
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════
          FIXED CHOICES PANEL - Always visible at bottom (Claude/ChatGPT pattern)
          ══════════════════════════════════════════════════════════════════ */}
      {!isEnding && (
        <footer
          className="flex-shrink-0 bg-stone-50 border border-stone-200 shadow-lg mx-3 sm:mx-auto sm:max-w-2xl rounded-2xl"
          style={{ marginBottom: 'calc(1rem + env(safe-area-inset-bottom, 4rem))' }}
        >
          <div className="px-3 sm:px-4 py-3 sm:py-4">
            {/* Scrollable choices container for many options */}
            {/* scroll-snap + touch-action prevents accidental selections during scroll (Switch port failure lesson) */}
            <div
              className="max-h-[40vh] sm:max-h-[35vh] overflow-y-auto overscroll-contain rounded-lg scroll-smooth"
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollSnapType: 'y proximity', // Gentle snap to choices
                touchAction: 'pan-y', // Only allow vertical pan, not tap during scroll
              }}
            >
              <GameChoices
                choices={state.availableChoices.map(c => ({
                  text: c.choice.text,
                  pattern: c.choice.pattern,
                  feedback: c.choice.interaction === 'shake' ? 'shake' : undefined
                }))}
                isProcessing={state.isLoading}
                onChoice={(c) => {
                  const original = state.availableChoices.find(ac => ac.choice.text === c.text)
                  if (original) handleChoice(original)
                }}
              />
            </div>
          </div>
        </footer>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          OVERLAYS & MODALS - Positioned above everything
          ══════════════════════════════════════════════════════════════════ */}

      {/* Feedback Overlays */}
      <NarrativeFeedback
        message={state.skillToast?.message || ''}
        isVisible={!!state.skillToast}
        onDismiss={() => setState(prev => ({ ...prev, skillToast: null }))}
      />

      {/* Experience Summary */}
      {state.showExperienceSummary && state.experienceSummaryData && (
        <ExperienceSummary
          data={state.experienceSummaryData}
          onContinue={() => setState(prev => ({ ...prev, showExperienceSummary: false, experienceSummaryData: null }))}
        />
      )}

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
    </div>
  )
}