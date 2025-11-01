'use client'

/**
 * Stateful Game Interface
 * Uses the new Stateful Narrative Engine instead of old linear scenes
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DialogueDisplay } from '@/components/DialogueDisplay'
import type { RichTextEffect } from '@/components/RichTextRenderer'
import { AtmosphericIntro } from '@/components/AtmosphericIntro'
import { CharacterAvatar } from '@/components/CharacterAvatar'
// import { CharacterLoadingState } from '@/components/CharacterLoadingState' // Removed - using subtle loading instead
import { ErrorRecoveryState } from '@/components/ErrorRecoveryState'
// Removed: SkillToast and CharacterTransition - break single UI principle
// Skills acknowledged naturally in narrative; transitions handled by dialogue
import { cn } from '@/lib/utils'
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
import { getComprehensiveTracker } from '@/lib/comprehensive-user-tracker'

interface GameInterfaceState {
  gameState: GameState | null
  currentNode: DialogueNode | null
  currentGraph: DialogueGraph
  currentCharacterId: CharacterId
  availableChoices: EvaluatedChoice[]
  currentContent: string
  currentDialogueContent: DialogueContent | null  // Full content object for rich effects
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
  recentSkills: string[]  // Recently demonstrated skills for highlighting
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
    recentSkills: []
  })

  // Feature flag for rich text effects (terminal-style animations)
  const enableRichEffects = true // Rich text effects enabled

  // Helper function to get rich text effects from content (Phase 2 & 3 - with emotion mapping and skill highlighting)
  // Typewriter ONLY for chat pacing moments (interactive conversation feel)
  // Fade-in/static for regular dialogue (clean dropdown, less demanding)
  const getRichEffectContext = useCallback((content: DialogueContent | null, isLoading: boolean, recentSkills: string[], useChatPacing: boolean): RichTextEffect | undefined => {
    if (!enableRichEffects || !content) {
      return undefined
    }

    // Chat pacing = interactive conversation = typewriter effect (character-by-character)
    // Regular dialogue = clean fade-in dropdown (smooth appearance, less demanding)
    // If chat pacing is active, ChatPacedDialogue handles it - don't apply rich effects
    // Rich effects only for regular dialogue chunks (fade-in for smooth appearance)
    const useTypewriter = false // Typewriter reserved for ChatPacedDialogue only, not RichTextRenderer

    // If content has explicit richEffectContext, use it (highest priority)
    if (content.richEffectContext) {
      const effect: RichTextEffect = {
        mode: useTypewriter ? 'typewriter' : 'fade-in', // Typewriter for chat pacing, fade-in for regular
        state: content.richEffectContext,
        speed: 1.0,
        charDelay: useTypewriter ? 20 : undefined // Faster typewriter for chat pacing
      }

      // Phase 3: Add skill highlighting if skills are mentioned in dialogue
      if (recentSkills.length > 0 && content.text) {
        const mentionedSkills = recentSkills.filter(skill => {
          // Convert skill name (e.g., "criticalThinking") to readable format and check if it appears
          const skillWords = skill.replace(/([A-Z])/g, ' $1').trim().toLowerCase()
          const skillVariations = [
            skill.toLowerCase(),
            skillWords,
            skill.replace(/([A-Z])/g, ' $1').trim() // With capitals
          ]
          return skillVariations.some(variation => content.text!.toLowerCase().includes(variation))
        })

        if (mentionedSkills.length > 0) {
          effect.highlightWords = mentionedSkills.map(skill => 
            skill.replace(/([A-Z])/g, ' $1').trim()
          )
          effect.rainbow = true // Subtle rainbow effect for skill highlights
        }
      }

      return effect
    }

    // If loading, apply thinking effect (fade-in for cleaner feel)
    if (isLoading) {
      return {
        mode: 'fade-in',
        state: 'thinking',
        speed: 1.0,
        perCharColor: false // Simpler for loading states
      }
    }

    // Map emotions to contexts (subtle, minimal mapping)
    const emotionMap: Record<string, 'thinking' | 'warning' | 'success' | undefined> = {
      'anxious': 'warning',
      'worried': 'warning',
      'vulnerable': 'thinking',
      'thoughtful': 'thinking',
      'reflecting': 'thinking',
      'excited': 'success',
      'determined': 'success'
    }

    let mappedContext: 'thinking' | 'warning' | 'success' | undefined
    if (content.emotion) {
      mappedContext = emotionMap[content.emotion]
    }

    if (mappedContext) {
      const effect: RichTextEffect = {
        mode: useTypewriter ? 'typewriter' : 'fade-in', // Typewriter for chat pacing, fade-in for regular
        state: mappedContext,
        speed: mappedContext === 'warning' ? 1.2 : 1.0,
        charDelay: useTypewriter ? (mappedContext === 'warning' ? 20 : 25) : undefined, // Typewriter only for chat
        flashing: mappedContext === 'warning' // Flash warnings for emphasis
      }

      // Phase 3: Add skill highlighting if skills are mentioned in dialogue
      if (recentSkills.length > 0 && content.text) {
        const mentionedSkills = recentSkills.filter(skill => {
          const skillWords = skill.replace(/([A-Z])/g, ' $1').trim().toLowerCase()
          const skillVariations = [
            skill.toLowerCase(),
            skillWords,
            skill.replace(/([A-Z])/g, ' $1').trim()
          ]
          return skillVariations.some(variation => content.text!.toLowerCase().includes(variation))
        })

        if (mentionedSkills.length > 0) {
          effect.highlightWords = mentionedSkills.map(skill => 
            skill.replace(/([A-Z])/g, ' $1').trim()
          )
          effect.rainbow = true
        }
      }

      return effect
    }

    // Phase 3: Even without emotion mapping, highlight skills if mentioned
    if (recentSkills.length > 0 && content.text) {
      const mentionedSkills = recentSkills.filter(skill => {
        const skillWords = skill.replace(/([A-Z])/g, ' $1').trim().toLowerCase()
        const skillVariations = [
          skill.toLowerCase(),
          skillWords,
          skill.replace(/([A-Z])/g, ' $1').trim()
        ]
        return skillVariations.some(variation => content.text!.toLowerCase().includes(variation))
      })

      if (mentionedSkills.length > 0) {
        return {
          mode: useTypewriter ? 'typewriter' : 'fade-in', // Typewriter for chat pacing, fade-in for regular
          state: 'success',
          highlightWords: mentionedSkills.map(skill => 
            skill.replace(/([A-Z])/g, ' $1').trim()
          ),
          rainbow: true,
          speed: 1.0,
          charDelay: useTypewriter ? 25 : undefined // Typewriter only for chat pacing
        }
      }
    }

    // Default: simple fade-in (clean, not distracting)
    // Line-by-line fade can be applied selectively via DialogueDisplay if needed
    return {
      mode: 'fade-in',
      speed: 1.0,
      state: 'default'
    }
  }, [enableRichEffects])

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
        previousSpeaker: state.currentNode?.speaker || null,
        recentSkills: [] // Reset on initialization
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

    // Prepare all state changes first (Priority 1: Batch state updates)
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
      // Error case - keep current state, don't update
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

    // Record skills aligned with this choice (not actual skill demonstration)
    let demonstratedSkills: string[] = []
    let skillToastUpdate: { skill: string; message: string } | null = null
    
    if (skillTrackerRef.current && state.currentNode) {
      const sceneMapping = SCENE_SKILL_MAPPINGS[state.currentNode.nodeId]
      let skillsRecorded = false
      
      // Priority 1: Use SCENE_SKILL_MAPPINGS if available (rich context)
      if (sceneMapping) {
        const choiceMapping = sceneMapping.choiceMappings[choice.choice.choiceId]
        if (choiceMapping) {
          demonstratedSkills = choiceMapping.skillsDemonstrated
          skillTrackerRef.current.recordSkillDemonstration(
            state.currentNode.nodeId,
            choice.choice.choiceId,
            choiceMapping.skillsDemonstrated,
            choiceMapping.context
          )
          console.log(`📊 Recorded skill demonstration (scene mapping): ${choiceMapping.skillsDemonstrated.join(', ')}`)
          skillsRecorded = true
          
          // Skills are tracked but not shown via toast - breaks single UI principle
          // Skills should be acknowledged naturally in narrative, not via overlays
          skillToastUpdate = null
        }
      }
      
      // Priority 2: Fallback to choice.skills if no scene mapping (newly added 341 skills)
      if (!skillsRecorded && choice.choice.skills && choice.choice.skills.length > 0) {
        demonstratedSkills = choice.choice.skills as string[]
        skillTrackerRef.current.recordSkillDemonstration(
          state.currentNode.nodeId,
          choice.choice.choiceId,
          demonstratedSkills,
          `Demonstrated ${demonstratedSkills.join(', ')} through choice: "${choice.choice.text}"`
        )
        console.log(`📊 Recorded skill demonstration (choice.skills): ${demonstratedSkills.join(', ')}`)
      }
    }

    // Character transitions should happen naturally in narrative, not via modal
    // Remove transition modal - let Samuel handle it narratively
    const transitionUpdate = {
      showTransition: false, // Always false - no modal overlays
      transitionData: null
    }

    // Phase 3: Track recent skills for highlighting (keep for next 3-5 nodes, then clear)
    const skillsToKeep = demonstratedSkills.length > 0 
      ? [...demonstratedSkills, ...state.recentSkills].slice(0, 10)
      : state.recentSkills.slice(0, 8)

    // Priority 1: Single batched state update - all changes at once
    setState({
      gameState: newGameState,
      currentNode: nextNode,
      currentGraph: targetGraph,
      currentCharacterId: targetCharacterId,
      availableChoices: newChoices,
      currentContent: content.text,
      currentDialogueContent: content,
      useChatPacing: content.useChatPacing || false,
      isLoading: false, // Clear loading immediately with new content
      hasStarted: true,
      selectedChoice: null,
      showSaveConfirmation: true,
      previousSpeaker: state.currentNode?.speaker || null,
      skillToast: skillToastUpdate || state.skillToast, // Use prepared toast or keep existing
      error: null,
      ...transitionUpdate, // Spread transition state
      recentSkills: skillsToKeep
    })

    // Track Samuel quotes when he speaks
    if (nextNode.speaker === 'Samuel Washington' && content.text && skillTrackerRef.current) {
      try {
        const quoteText = content.text
        const sceneDescription = nextNode.nodeId.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())
        skillTrackerRef.current.recordSamuelQuote(
          nextNode.nodeId,
          quoteText,
          nextNode.nodeId,
          sceneDescription,
          content.emotion
        )
      } catch (error) {
        console.error(`[StatefulGameInterface] Error recording Samuel quote:`, error)
      }
    }

    // Priority 3: Move async operations AFTER UI update (don't block rendering)
    // Run tracking in background, don't wait for it
    try {
      const trackerPromise = getComprehensiveTracker(state.gameState.playerId)
        .trackChoice(
          state.gameState.playerId,
          choice.choice,
          state.currentNode?.nodeId || 'unknown',
          state.currentCharacterId,
          0
        )
      // Don't await - let it run in background
      trackerPromise.catch(error => {
        console.error(`[StatefulGameInterface] Comprehensive tracker error:`, error)
      })
    } catch (error) {
      console.error(`[StatefulGameInterface] Comprehensive tracker setup error:`, error)
    }

    // No transition modal needed - narrative handles character changes naturally

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

  // Loading state now handled inline with chat pacing - no full-screen replacement

  // Helper to get contextual thinking state text (matching ChatPacedDialogue logic)
  const getThinkingStateText = (characterName: string, patterns?: { analytical?: number; helping?: number; building?: number; patience?: number; exploring?: number }): string => {
    const characterStates: Record<string, string> = {
      'Samuel': 'considering',
      'Maya': 'thinking',
      'Devon': 'processing',
      'Jordan': 'reflecting',
      'Narrator': 'pausing',
      'You': 'thinking'
    }

    let baseState = characterStates[characterName] || 'thinking'

    if (patterns) {
      const dominantPattern = Object.entries(patterns)
        .filter(([_, value]) => value && value > 0)
        .sort(([_, a], [__, b]) => (b || 0) - (a || 0))[0]?.[0]

      if (dominantPattern === 'analytical' && (patterns.analytical || 0) > 2) {
        if (characterName === 'Samuel' || characterName === 'Devon') {
          baseState = 'analyzing'
        }
      } else if (dominantPattern === 'helping' && (patterns.helping || 0) > 2) {
        baseState = 'considering'
      } else if (dominantPattern === 'exploring' && (patterns.exploring || 0) > 2) {
        if (characterName === 'Jordan' || characterName === 'Maya') {
          baseState = 'exploring'
        }
      } else if (dominantPattern === 'patience' && (patterns.patience || 0) > 2) {
        baseState = 'reflecting'
      }
    }

    return baseState
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
    <div 
      key="game-container" 
      className="min-h-screen max-h-screen overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100"
      style={{ willChange: 'auto', contain: 'layout style paint', transition: 'none' }}
    >
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
          <div className="mb-4 px-3 py-2 bg-white/50 border border-slate-300 rounded-xl backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-medium text-slate-700">
                <CharacterAvatar 
                  characterName={characterNames[state.currentCharacterId]} 
                  size="sm"
                  showAvatar={true}
                />
                <span className="truncate">{characterNames[state.currentCharacterId]}</span>
                <span className="text-slate-400">•</span>
                <Badge variant="outline" className="text-xs font-normal border-slate-300 text-slate-600">
                  {currentCharacter.relationshipStatus}
                </Badge>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Character Switcher - Clean button row */}
                {state.gameState && (() => {
                  const availableChars = (['samuel', 'maya', 'devon', 'jordan'] as CharacterId[]).filter(charId => {
                    const char = state.gameState!.characters.get(charId)
                    const hasMet = char && (char.trust > 0 || char.conversationHistory.length > 0)
                    return hasMet || charId === 'samuel' // Always show Samuel
                  })
                  
                  // Only show switcher if more than one character is available
                  if (availableChars.length <= 1) {
                    return null
                  }
                  
                  return (
                    <div className="flex gap-1 border-r border-slate-300 pr-2 sm:pr-3 mr-1 sm:mr-2">
                      {availableChars.map((charId) => {
                        const char = state.gameState!.characters.get(charId)
                        const isCurrent = charId === state.currentCharacterId
                        
                        return (
                          <button
                            key={charId}
                            onClick={() => {
                              const graph = getGraphForCharacter(charId, state.gameState!)
                              const startNode = graph.nodes.get(graph.startNodeId)!
                              const content = DialogueGraphNavigator.selectContent(startNode, char?.conversationHistory || [])
                              
                              setState(prev => ({
                                ...prev,
                                currentCharacterId: charId,
                                currentGraph: graph,
                                currentNode: startNode,
                                currentContent: content.text,
                                currentDialogueContent: content,
                                useChatPacing: content.useChatPacing || false,
                                availableChoices: StateConditionEvaluator.evaluateChoices(startNode, state.gameState!, charId).filter(c => c.visible),
                                previousSpeaker: null
                              }))
                            }}
                            className={cn(
                              "px-2 py-1 rounded text-xs transition-colors min-h-[32px] border",
                              isCurrent 
                                ? "bg-blue-100 text-blue-700 font-medium border-blue-300 shadow-sm" 
                                : "bg-white/70 text-slate-600 hover:bg-slate-50 border-slate-300 hover:border-slate-400"
                            )}
                            title={characterNames[charId]}
                          >
                            {characterNames[charId].split(' ')[0]}
                          </button>
                        )
                      })}
                    </div>
                  )
                })()}
                <div className="text-slate-500 flex-shrink-0">
                  <span 
                    className={cn(
                      currentCharacter.trust === 10 && "trust-max-celebration"
                    )}
                  >
                    Trust: {currentCharacter.trust}/10
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Fixed min-height container to prevent jumping */}
        <Card key="dialogue-card" className="mb-4 sm:mb-6 rounded-xl shadow-md" style={{ transition: 'none', minHeight: '250px' }}>
          <CardContent className="p-4 sm:p-6">
            <div className="mb-3 sm:mb-4" key="dialogue-content-stable" style={{ transition: 'none' }}>
              {/* Dialogue content - stable container, content updates smoothly */}
              <DialogueDisplay 
                text={state.currentContent || ''} 
                useChatPacing={state.useChatPacing}
                characterName={state.currentNode?.speaker}
                showAvatar={false}
                isContinuedSpeaker={state.currentNode?.speaker === state.previousSpeaker}
                richEffects={getRichEffectContext(state.currentDialogueContent, state.isLoading, state.recentSkills, state.useChatPacing)}
                interaction={state.currentDialogueContent?.interaction}
                emotion={state.currentDialogueContent?.emotion}
                playerPatterns={state.gameState?.patterns ? {
                  analytical: state.gameState.patterns.analytical || 0,
                  helping: state.gameState.patterns.helping || 0,
                  building: state.gameState.patterns.building || 0,
                  patience: state.gameState.patterns.patience || 0,
                  exploring: state.gameState.patterns.exploring || 0
                } : undefined}
              />
            </div>
          </CardContent>
        </Card>

        {/* Choices - Stable container, always mounted (Priority 2: Never unmount) */}
        {!isEnding && (
          <Card key="choices-card" className="rounded-xl shadow-md" style={{ transition: 'none' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl text-slate-700">Your Response</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div 
                className="space-y-2 sm:space-y-3" 
                key="choices-list-stable"
                style={{ 
                  opacity: state.isLoading ? 0.5 : 1,
                  pointerEvents: state.isLoading ? 'none' : 'auto',
                  transition: 'none' // Priority 5: No transitions on state changes
                }}
              >
                {state.availableChoices.map((evaluatedChoice) => {
                  // Get interaction class if choice has interaction specified
                  const interactionClass = evaluatedChoice.choice.interaction 
                    ? `narrative-interaction-${evaluatedChoice.choice.interaction}` 
                    : null
                  
                  return (
                  <Button
                    key={`choice-${evaluatedChoice.choice.choiceId}`}
                    onClick={() => handleChoice(evaluatedChoice)}
                    disabled={!evaluatedChoice.enabled}
                    variant="ghost"
                    className={cn(
                      // Base sizing (touch target)
                      "min-h-[48px] w-full px-6 py-3",
                      
                      // Typography - ensure text wraps
                      "text-base font-medium text-left whitespace-normal",
                      
                      // Clean, subtle styling - removed transition-all to prevent flashing
                      "border border-slate-200 bg-white",
                      "hover:bg-slate-50 hover:border-slate-300 hover:shadow-lg",
                      "active:scale-[0.98]",
                      "transition-colors duration-150 ease-out", // Only transition colors, not all properties
                      
                      // Selection feedback
                      state.selectedChoice === evaluatedChoice.choice.choiceId && "bg-blue-50 border-blue-300",
                      
                      // Rounded corners
                      "rounded-lg",
                      
                      // Disabled state
                      !evaluatedChoice.enabled && "bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200",
                      
                      // Interaction animation (applied on mount, doesn't interfere with hover/active)
                      interactionClass
                    )}
                  >
                    <div className="w-full">
                      {/* Choice text - simple display (no animations) */}
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
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ending */}
        {isEnding && (
          <Card className="rounded-xl shadow-md">
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

        {/* Removed: SkillToast and CharacterTransition - break single UI principle */}
        {/* Skills acknowledged naturally in narrative; transitions handled by Samuel's dialogue */}

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