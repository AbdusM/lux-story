'use client'

/**
 * Stateful Game Interface
 * Uses the new Stateful Narrative Engine instead of old linear scenes
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DialogueDisplay } from '@/components/DialogueDisplay'
import { AtmosphericIntro } from '@/components/AtmosphericIntro'
import { CharacterAvatar } from '@/components/CharacterAvatar'
// import { CharacterLoadingState } from '@/components/CharacterLoadingState' // Removed - using subtle loading instead
import { ErrorRecoveryState } from '@/components/ErrorRecoveryState'
import { SkillToast } from '@/components/SkillToast'
import { CharacterTransition } from '@/components/CharacterTransition'
import { cn } from '@/lib/utils'
import { GameState, GameStateUtils } from '@/lib/character-state'
import { GameStateManager } from '@/lib/game-state-manager'
import { useBackgroundSync } from '@/hooks/useBackgroundSync'
import { generateUserId } from '@/lib/safe-storage'
import {
  DialogueGraph,
  DialogueNode,
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
import { getComprehensiveTracker } from '@/lib/comprehensive-user-tracker'

interface GameInterfaceState {
  gameState: GameState | null
  currentNode: DialogueNode | null
  currentGraph: DialogueGraph
  currentCharacterId: CharacterId
  availableChoices: EvaluatedChoice[]
  currentContent: string
  useChatPacing: boolean  // Whether to use sequential reveal for this node
  isLoading: boolean
  hasStarted: boolean
  selectedChoice: string | null  // For choice selection feedback
  showSaveConfirmation: boolean  // For auto-save confirmation
  skillToast: { skill: string; message: string } | null  // For skill demonstration
  error: { title: string; message: string; severity: 'error' | 'warning' | 'info' } | null  // For error states
  showTransition: boolean  // For character switching
  transitionData: { platform: number; message: string } | null  // Transition details
  previousSpeaker: string | null  // For detecting continued speakers (avatar logic)
}

export default function StatefulGameInterface() {
  const safeStart = getSafeStart()
  const [state, setState] = useState<GameInterfaceState>({
    gameState: null,
    currentNode: null,
    currentGraph: safeStart.graph, // Start with Samuel (safe start)
    currentCharacterId: safeStart.characterId, // Game begins with Station Keeper
    availableChoices: [],
    currentContent: '',
    useChatPacing: false,
    isLoading: false,
    hasStarted: false,
    previousSpeaker: null,
    selectedChoice: null,
    showSaveConfirmation: false,
    skillToast: null,
    error: null,
    showTransition: false,
    transitionData: null
  })

  // Skill tracker for recording demonstrations
  const skillTrackerRef = useRef<SkillTracker | null>(null)

  // Background sync for durable offline-first database writes
  // Guarantees zero data loss even with spotty network connection
  const { queueStats } = useBackgroundSync({
    enabled: true,
    intervalMs: 30000, // Sync every 30 seconds
    syncOnFocus: true, // Sync when user returns to tab
    syncOnOnline: true // Sync when network restored
  })

  // Client-only state for save file detection (prevents hydration mismatch)
  const [hasSaveFile, setHasSaveFile] = useState(false)

  // Check for save file and if it's at an ending
  const [saveIsComplete, setSaveIsComplete] = useState(false)

  // Auto-save confirmation effect
  useEffect(() => {
    if (state.showSaveConfirmation) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, showSaveConfirmation: false }))
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [state.showSaveConfirmation])

  useEffect(() => {
    const exists = GameStateManager.hasSaveFile()
    setHasSaveFile(exists)

    // Check if save is at a completed ending
    if (exists) {
      const loadedState = GameStateManager.loadGameState()
      if (loadedState) {
        // Use registry to get the correct graph for the saved character
        const characterId = (loadedState.currentCharacterId || 'samuel') as CharacterId
        const graph = getGraphForCharacter(characterId, loadedState)
        const node = graph.nodes.get(loadedState.currentNodeId)
        const isEnding = node && node.choices.length === 0
        setSaveIsComplete(!!isEnding)
      }
    }
  }, [])

  // Initialize or load game
  const initializeGame = useCallback(async () => {
    console.log('🎮 Initializing Stateful Narrative Engine...')

    try {
      // Try to load existing save
      let gameState = GameStateManager.loadGameState()

      if (!gameState) {
        // Create new game with consistent userId (uses/creates localStorage 'lux-player-id')
        const userId = generateUserId()
        gameState = GameStateUtils.createNewGameState(userId)
        console.log('✅ Created new game state for user:', userId)
        
        // CRITICAL FIX: Create database profile using reliable ensureUserProfile utility
        try {
          const { ensureUserProfile } = await import('@/lib/ensure-user-profile')
          const profileCreated = await ensureUserProfile(gameState.playerId, {
            current_scene: gameState.currentNodeId,
            total_demonstrations: 0,
            last_activity: new Date().toISOString()
          })
          
          if (profileCreated) {
            console.log('✅ Database profile ensured for user:', gameState.playerId)
          } else {
            console.error('⚠️ Database profile creation returned false for user:', gameState.playerId)
            // Profile creation failed but game can continue - will retry on next sync
          }
        } catch (error) {
          console.error('❌ Failed to ensure database profile:', error)
          // Continue anyway - user can still play, profile will be ensured on first tracker call
        }
      } else {
        console.log('✅ Loaded existing game state')
        
        // CRITICAL FIX: Ensure profile exists for returning users too (handles backfill)
        try {
          const { ensureUserProfile } = await import('@/lib/ensure-user-profile')
          await ensureUserProfile(gameState.playerId, {
            current_scene: gameState.currentNodeId,
            last_activity: new Date().toISOString()
          })
          console.log('✅ Database profile verified for returning user:', gameState.playerId)
        } catch (error) {
          console.error('⚠️ Failed to verify profile for returning user:', error)
          // Non-critical - will be ensured on next tracker call
        }
      }

      // Initialize skill tracker with this user's ID
      if (typeof window !== 'undefined' && !skillTrackerRef.current) {
        skillTrackerRef.current = new SkillTracker(gameState.playerId)
        console.log('✅ Initialized skill tracker for user:', gameState.playerId)
      }

      // Get character ID from saved state (defaults to samuel for new games)
      const characterId = (gameState.currentCharacterId || 'samuel') as CharacterId

      // Get the state-appropriate graph for this character
      const currentGraph = getGraphForCharacter(characterId, gameState)

      // Get the current node (either new game start or saved position)
      const nodeId = gameState.currentNodeId

      console.log(`📍 Current character: ${characterId}, Node: ${nodeId}`)

      // Get the node from the graph
      let currentNode = currentGraph.nodes.get(nodeId)
      let actualCharacterId = characterId
      let actualGraph = currentGraph

      // DEFENSIVE: Handle corrupted save states where character/node mismatch
      if (!currentNode) {
        console.warn(`⚠️ Node "${nodeId}" not found in ${characterId} graph, searching all graphs...`)

        // Use registry to find which character owns this node
        const searchResult = findCharacterForNode(nodeId, gameState)

        if (searchResult) {
          // Found the node in a different character's graph
          actualCharacterId = searchResult.characterId
          actualGraph = searchResult.graph
          currentNode = actualGraph.nodes.get(nodeId)!
          gameState.currentCharacterId = actualCharacterId
          console.warn(`✅ Found node in ${actualCharacterId} graph, corrected character mismatch`)
        } else {
          // Last resort: fall back to safe starting point
          console.error(`❌ Node "${nodeId}" not found in any graph. Resetting to safe start.`)
          const safeStart = getSafeStart()
          actualCharacterId = safeStart.characterId
          actualGraph = safeStart.graph
          currentNode = actualGraph.nodes.get(actualGraph.startNodeId)!
          gameState.currentCharacterId = actualCharacterId
          gameState.currentNodeId = actualGraph.startNodeId
          console.warn(`🔄 Reset to safe start: ${actualGraph.startNodeId}`)
        }
      }

      // Update current node in state
      gameState.currentNodeId = currentNode.nodeId
      gameState.currentCharacterId = actualCharacterId

      // Select content variation (use character's conversation history)
      const character = gameState.characters.get(actualCharacterId)!
      const content = DialogueGraphNavigator.selectContent(
        currentNode,
        character.conversationHistory
      )

      // Evaluate available choices
      const choices = StateConditionEvaluator.evaluateChoices(
        currentNode,
        gameState,
        actualCharacterId
      ).filter(choice => choice.visible)

      setState({
        gameState,
        currentNode: currentNode,
        currentGraph: actualGraph,
        currentCharacterId: actualCharacterId,
        availableChoices: choices,
        currentContent: content.text,
        useChatPacing: content.useChatPacing || false,
        isLoading: false,
        hasStarted: true,
        previousSpeaker: state.currentNode?.speaker || null
      })

      // Auto-save
      GameStateManager.saveGameState(gameState)
    } catch (error) {
      console.error('❌ Fatal error initializing game:', error)
      alert(`Error starting game: ${error instanceof Error ? error.message : 'Unknown error'}. Click "Start New Journey" to reset.`)
    }
  }, [])

  // Handle choice selection (with cross-graph navigation support)
  const handleChoice = useCallback(async (choice: EvaluatedChoice) => {
    if (!state.gameState || !choice.enabled) return

    // Immediate feedback for choice selection
    setState(prev => ({ ...prev, selectedChoice: choice.choice.choiceId, isLoading: true }))

    // Brief pause for visual confirmation
    await new Promise(resolve => setTimeout(resolve, 200))

    // Track the choice in comprehensive tracker
    try {
      console.log(`[StatefulGameInterface] Calling comprehensive tracker for ${state.gameState.playerId}`)
      const comprehensiveTracker = getComprehensiveTracker(state.gameState.playerId)
      await comprehensiveTracker.trackChoice(
        state.gameState.playerId,
        choice.choice,
        state.currentNode?.nodeId || 'unknown',
        state.currentCharacterId,
        0 // Time to choose not tracked in this interface
      )
      console.log(`[StatefulGameInterface] Comprehensive tracker completed for ${state.gameState.playerId}`)
    } catch (error) {
      console.error(`[StatefulGameInterface] Comprehensive tracker error:`, error)
    }

    let newGameState = state.gameState

    // Apply choice consequences
    if (choice.choice.consequence) {
      newGameState = GameStateUtils.applyStateChange(newGameState, choice.choice.consequence)
    }

    // Update pattern tracking
    if (choice.choice.pattern) {
      const patternChange = { [choice.choice.pattern]: 1 }
      newGameState = GameStateUtils.applyStateChange(newGameState, {
        patternChanges: patternChange
      })
    }

    // Use registry to find which character owns the next node
    // This handles cross-graph navigation AND state-aware graph selection
    const searchResult = findCharacterForNode(choice.choice.nextNodeId, newGameState)

    if (!searchResult) {
      console.error(`❌ Next node not found in any graph: ${choice.choice.nextNodeId}`)
      setState(prev => ({ ...prev, isLoading: false }))
      return
    }

    const nextNode = searchResult.graph.nodes.get(choice.choice.nextNodeId)!
    const targetGraph = searchResult.graph
    const targetCharacterId = searchResult.characterId

    // Log cross-graph navigation if character changed
    if (targetCharacterId !== state.currentCharacterId) {
      console.log(`🔀 Cross-graph navigation: ${state.currentCharacterId} → ${targetCharacterId}`)
    }

    // Apply node entry state changes
    if (nextNode.onEnter) {
      for (const change of nextNode.onEnter) {
        newGameState = GameStateUtils.applyStateChange(newGameState, change)
      }
    }

    // Update conversation history for TARGET character
    const targetCharacter = newGameState.characters.get(targetCharacterId)!
    targetCharacter.conversationHistory.push(nextNode.nodeId)

    // Update current position and character
    newGameState.currentNodeId = nextNode.nodeId
    newGameState.currentCharacterId = targetCharacterId

    // Select content variation
    const content = DialogueGraphNavigator.selectContent(
      nextNode,
      targetCharacter.conversationHistory
    )

    // Evaluate new choices
    const newChoices = StateConditionEvaluator.evaluateChoices(
      nextNode,
      newGameState,
      targetCharacterId
    ).filter(choice => choice.visible)

    // Record skill demonstration from this choice
    if (skillTrackerRef.current && state.currentNode) {
      const sceneMapping = SCENE_SKILL_MAPPINGS[state.currentNode.nodeId]
      let skillsRecorded = false
      
      // Priority 1: Use SCENE_SKILL_MAPPINGS if available (rich context)
      if (sceneMapping) {
        const choiceMapping = sceneMapping.choiceMappings[choice.choice.choiceId]
        if (choiceMapping) {
          skillTrackerRef.current.recordSkillDemonstration(
            state.currentNode.nodeId,
            choice.choice.choiceId,
            choiceMapping.skillsDemonstrated,
            choiceMapping.context
          )
          console.log(`📊 Recorded skill demonstration (scene mapping): ${choiceMapping.skillsDemonstrated.join(', ')}`)
          skillsRecorded = true
          
          // Show skill demonstration toast
          setState(prev => ({
            ...prev,
            skillToast: {
              skill: choiceMapping.skillsDemonstrated.join(', '),
              message: choiceMapping.context
            }
          }))
        }
      }
      
      // Priority 2: Fallback to choice.skills if no scene mapping (newly added 341 skills)
      if (!skillsRecorded && choice.choice.skills && choice.choice.skills.length > 0) {
        const skills = choice.choice.skills as string[] // Cast to string[] for compatibility
        skillTrackerRef.current.recordSkillDemonstration(
          state.currentNode.nodeId,
          choice.choice.choiceId,
          skills,
          `Demonstrated ${skills.join(', ')} through choice: "${choice.choice.text}"`
        )
        console.log(`📊 Recorded skill demonstration (choice.skills): ${skills.join(', ')}`)
      }
    }

    // Check for character transition
    const isCharacterChange = targetCharacterId !== state.currentCharacterId
    if (isCharacterChange) {
      setState(prev => ({
        ...prev,
        showTransition: true,
        transitionData: {
          platform: Math.floor(Math.random() * 10) + 1, // Random platform 1-10
          message: `Moving to ${characterNames[targetCharacterId]}...`
        }
      }))
      
      // Hide transition after delay
      setTimeout(() => {
        setState(prev => ({ ...prev, showTransition: false, transitionData: null }))
      }, 2000)
    }

    // Update state
    setState({
      gameState: newGameState,
      currentNode: nextNode,
      currentGraph: targetGraph,
      currentCharacterId: targetCharacterId,
      availableChoices: newChoices,
      currentContent: content.text,
      useChatPacing: content.useChatPacing || false,
      isLoading: false,
      hasStarted: true,
      selectedChoice: null, // Reset choice selection
      showSaveConfirmation: true, // Show save confirmation
      previousSpeaker: state.currentNode?.speaker || null, // Track previous speaker for avatar logic
      skillToast: state.skillToast, // Keep existing toast
      error: null,
      showTransition: state.showTransition, // Keep existing transition
      transitionData: state.transitionData
    })

    // Auto-save
    GameStateManager.saveGameState(newGameState)

    console.log(`🎭 Moved to: ${nextNode.nodeId}`)
    console.log(`🎯 ${targetCharacterId} trust: ${newGameState.characters.get(targetCharacterId)?.trust}`)
  }, [state.gameState, state.currentGraph, state.currentCharacterId, state.currentNode])

  // Continue journey (resets position but keeps relationships)
  const continueJourney = useCallback(() => {
    const currentState = GameStateManager.loadGameState()
    if (currentState) {
      const resetState = GameStateManager.resetConversationPosition(currentState)
      GameStateManager.saveGameState(resetState)
    }
    // Reinitialize with preserved relationships
    window.location.reload()
  }, [])

  // DANGER: Nuclear reset (wipes everything)
  const nuclearReset = useCallback(() => {
    if (confirm('⚠️ This will PERMANENTLY erase your entire journey and all relationships with Maya. Are you absolutely sure?')) {
      GameStateManager.nuclearReset()
      // Reload page to start completely fresh
      window.location.reload()
    }
  }, [])

  // Debug: show current state
  const showDebugInfo = useCallback(() => {
    if (!state.gameState) return

    const maya = state.gameState.characters.get('maya')!
    console.log('🔍 DEBUG INFO:')
    console.log('Current Node:', state.currentNode?.nodeId)
    console.log('Maya Trust:', maya.trust)
    console.log('Maya Relationship:', maya.relationshipStatus)
    console.log('Maya Knowledge:', Array.from(maya.knowledgeFlags))
    console.log('Global Flags:', Array.from(state.gameState.globalFlags))
    console.log('Patterns:', state.gameState.patterns)
  }, [state])

  // Export full analytics profile for BEFORE/AFTER validation
  const exportFullAnalyticsProfile = useCallback(() => {
    console.log('📦 Preparing full analytics profile export...')

    // 1. Gather data from all primary systems
    const rawGameState = state.gameState
    const skillProfile = skillTrackerRef.current?.exportSkillProfile()

    // 2. Aggregate into comprehensive object
    const fullProfile = {
      exportVersion: '1.0.0',
      timestamp: new Date().toISOString(),
      profileSource: 'GCT_Manual_Export_BEFORE',
      skillProfile,
      rawGameState,
    }

    // 3. Create and trigger browser download
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullProfile, null, 2))
      const downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.setAttribute("href", dataStr)
      downloadAnchorNode.setAttribute("download", `analytics_profile_BEFORE.json`)
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()

      console.log('✅ Full analytics profile exported as analytics_profile_BEFORE.json')
    } catch (error) {
      console.error('❌ Failed to export analytics profile:', error)
    }
  }, [state.gameState, skillTrackerRef])

  if (!state.hasStarted) {
    // First-time users get atmospheric intro
    // Returning users get quick start screen
    if (!hasSaveFile) {
      return (
        <>
          {/* Admin Button - Top Right */}
          <div className="absolute top-4 right-4 z-50">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-xs min-h-[48px]">
                Admin
              </Button>
            </Link>
          </div>
          <AtmosphericIntro onStart={() => initializeGame()} />
        </>
      )
    }

    // Returning users: Quick start screen
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-3 sm:p-4">
        {/* Admin Button - Top Right */}
        <div className="absolute top-4 right-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-xs min-h-[48px]">
              Admin
            </Button>
          </Link>
        </div>
        
        <Card className="w-full max-w-2xl">
          <CardContent className="p-5 sm:p-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3 sm:mb-4">
              Welcome Back
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 leading-relaxed">
              Grand Central Terminus awaits. Continue your journey or start fresh.
            </p>
            <div className="space-y-3 sm:space-y-4">
              {saveIsComplete ? (
                <>
                  <Button
                    onClick={continueJourney}
                    size="lg"
                    className="w-full"
                  >
                    Begin New Journey
                  </Button>
                  <Button
                    onClick={() => initializeGame()}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    Review Last Conversation
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => initializeGame()}
                    size="lg"
                    className="w-full"
                  >
                    Continue Your Journey
                  </Button>
                  <Button
                    onClick={continueJourney}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    Start Over
                  </Button>
                </>
              )}
              <Button
                onClick={nuclearReset}
                variant="ghost"
                size="sm"
                className="w-full text-xs text-red-600 hover:text-red-700"
              >
                Erase All Progress (Danger Zone)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        {/* Subtle loading state - no distracting animations */}
        <div className="text-center">
          <div className="text-slate-600 text-sm">Loading...</div>
        </div>
      </div>
    )
  }

  const isEnding = state.availableChoices.length === 0
  const currentCharacter = state.gameState?.characters.get(state.currentCharacterId)

  // Character display names
  const characterNames: Record<CharacterId, string> = {
    samuel: 'Samuel Washington',
    maya: 'Maya Chen',
    devon: 'Devon Kumar',
    jordan: 'Jordan Packard'
  }

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto p-3 sm:p-4">

        {/* Subtle top utility bar */}
        <div className="flex justify-between items-center mb-3">
          <Link href="/admin">
            <button className="text-xs text-slate-400 hover:text-slate-600 transition-colors px-2 py-1">
              Admin
            </button>
          </Link>
          <div className="flex gap-2">
            {process.env.NODE_ENV === 'development' && (
              <Button variant="ghost" size="sm" onClick={exportFullAnalyticsProfile} className="text-xs h-7 px-2 text-slate-400">
                Export
              </Button>
            )}
            <button 
              onClick={continueJourney} 
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors px-2 py-1"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Character Banner - Minimal Chat Style with Avatar */}
        {currentCharacter && (
          <div className="mb-4 px-3 py-2 bg-white/50 border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-medium text-slate-700">
                <CharacterAvatar 
                  characterName={characterNames[state.currentCharacterId]} 
                  size="sm"
                  showAvatar={true}
                />
                <span className="truncate">{characterNames[state.currentCharacterId]}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600">{currentCharacter.relationshipStatus}</span>
              </div>
              <div className="text-slate-500 flex-shrink-0">
                <span>Trust: {currentCharacter.trust}/10</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-3 sm:mb-4">
              <DialogueDisplay 
                text={state.currentContent} 
                useChatPacing={state.useChatPacing}
                characterName={state.currentNode?.speaker}
                showAvatar={false}
                isContinuedSpeaker={state.currentNode?.speaker === state.previousSpeaker}
              />
            </div>

            {/* Scene info for debugging */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-xs text-slate-400 border-t pt-2 mt-2">
                Scene: {state.currentNode?.nodeId}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Choices */}
        {!isEnding && (
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-3 sm:mb-4">Your Response</h3>
              <div className="space-y-2 sm:space-y-3">
                {state.availableChoices.map((evaluatedChoice, index) => (
                  <Button
                    key={evaluatedChoice.choice.choiceId}
                    onClick={() => handleChoice(evaluatedChoice)}
                    disabled={!evaluatedChoice.enabled}
                    variant="ghost"
                    className={cn(
                      // Base sizing (touch target)
                      "min-h-[48px] w-full px-6 py-3",
                      
                      // Typography - ensure text wraps
                      "text-base font-medium text-left whitespace-normal",
                      
                      // Clean, subtle styling
                      "border border-slate-200 bg-white",
                      "hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm",
                      "active:scale-[0.98]",
                      "transition-all duration-200 ease-out",
                      
                      // Selection feedback
                      state.selectedChoice === evaluatedChoice.choice.choiceId && "bg-blue-50 border-blue-300 scale-[0.98]",
                      
                      // Rounded corners
                      "rounded-lg",
                      
                      // Disabled state
                      !evaluatedChoice.enabled && "bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200"
                    )}
                  >
                    <div className="w-full">
                      {/* Choice text */}
                      <div className="font-medium text-base break-words">
                        {evaluatedChoice.choice.text}
                      </div>
                      {!evaluatedChoice.enabled && evaluatedChoice.reason && (
                        <div className="text-xs text-slate-500 mt-1 break-words">
                          {evaluatedChoice.reason}
                        </div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ending */}
        {isEnding && (
          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">
                Conversation Complete
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
                {characterNames[state.currentCharacterId]} will remember this conversation. Your relationship: {currentCharacter?.relationshipStatus} • Trust: {currentCharacter?.trust}/10
              </p>
              <div className="space-y-2 sm:space-y-3">
                <Button variant="outline" onClick={continueJourney} className="w-full min-h-[48px]">
                  Return to Station
                </Button>
                {process.env.NODE_ENV === 'development' && (
                  <>
                    <Button onClick={() => {
                      // Start a new conversation with the SAME character
                      const currentState = GameStateManager.loadGameState()
                      if (currentState) {
                        // Get the appropriate graph for this character
                        const characterId = state.currentCharacterId
                        const graph = getGraphForCharacter(characterId, currentState)

                        // Set to character's start node (introduction or revisit entry)
                        currentState.currentNodeId = graph.startNodeId
                        currentState.currentCharacterId = characterId

                        GameStateManager.saveGameState(currentState)
                        window.location.reload()
                      }
                    }} variant="ghost" size="sm" className="w-full text-xs">
                      Debug: Talk to {characterNames[state.currentCharacterId]} Again
                    </Button>
                    <Button variant="ghost" size="sm" onClick={showDebugInfo} className="w-full text-xs min-h-[48px]">
                      Debug: View Conversation Summary
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skill Demonstration Toast */}
        {state.skillToast && (
          <SkillToast
            skill={state.skillToast.skill}
            message={state.skillToast.message}
            onClose={() => setState(prev => ({ ...prev, skillToast: null }))}
          />
        )}

        {/* Character Transition */}
        {state.showTransition && state.transitionData && (
          <CharacterTransition
            nextPlatform={state.transitionData.platform}
            transitionMessage={state.transitionData.message}
            onComplete={() => setState(prev => ({ ...prev, showTransition: false, transitionData: null }))}
          />
        )}

        {/* Error State */}
        {state.error && (
          <ErrorRecoveryState
            title={state.error.title}
            message={state.error.message}
            severity={state.error.severity}
            onRetry={() => setState(prev => ({ ...prev, error: null }))}
            onDismiss={() => setState(prev => ({ ...prev, error: null }))}
          />
        )}

      </div>
    </div>
  )
}