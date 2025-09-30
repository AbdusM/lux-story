'use client'

/**
 * Stateful Game Interface
 * Uses the new Stateful Narrative Engine instead of old linear scenes
 */

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GameState, GameStateUtils } from '@/lib/character-state'
import { GameStateManager } from '@/lib/game-state-manager'
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

interface GameInterfaceState {
  gameState: GameState | null
  currentNode: DialogueNode | null
  currentGraph: DialogueGraph
  currentCharacterId: CharacterId
  availableChoices: EvaluatedChoice[]
  currentContent: string
  isLoading: boolean
  hasStarted: boolean
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
    isLoading: false,
    hasStarted: false
  })

  // Client-only state for save file detection (prevents hydration mismatch)
  const [hasSaveFile, setHasSaveFile] = useState(false)

  // Check for save file and if it's at an ending
  const [saveIsComplete, setSaveIsComplete] = useState(false)

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
  const initializeGame = useCallback(() => {
    console.log('🎮 Initializing Stateful Narrative Engine...')

    try {
      // Try to load existing save
      let gameState = GameStateManager.loadGameState()

      if (!gameState) {
        // Create new game
        gameState = GameStateUtils.createNewGameState('player_' + Date.now())
        console.log('✅ Created new game state')
      } else {
        console.log('✅ Loaded existing game state')
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
        isLoading: false,
        hasStarted: true
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

    setState(prev => ({ ...prev, isLoading: true }))

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

    // Update state
    setState({
      gameState: newGameState,
      currentNode: nextNode,
      currentGraph: targetGraph,
      currentCharacterId: targetCharacterId,
      availableChoices: newChoices,
      currentContent: content.text,
      isLoading: false,
      hasStarted: true
    })

    // Auto-save
    GameStateManager.saveGameState(newGameState)

    console.log(`🎭 Moved to: ${nextNode.nodeId}`)
    console.log(`🎯 ${targetCharacterId} trust: ${newGameState.characters.get(targetCharacterId)?.trust}`)
  }, [state.gameState, state.currentGraph, state.currentCharacterId])

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

  if (!state.hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">
              Grand Central Terminus
            </h1>
            <p className="text-slate-600 mb-8">
              A magical train station appears between who you were and who you're becoming.
              Meet Maya, a pre-med student torn between family expectations and personal passion.
            </p>
            <div className="space-y-4">
              {saveIsComplete ? (
                <>
                  <Button
                    onClick={continueJourney}
                    size="lg"
                    className="w-full"
                  >
                    New Conversation with Maya
                  </Button>
                  <Button
                    onClick={initializeGame}
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
                    onClick={initializeGame}
                    size="lg"
                    className="w-full"
                  >
                    {hasSaveFile ? 'Continue Your Journey' : 'Enter the Station'}
                  </Button>
                  {hasSaveFile && (
                    <Button
                      onClick={continueJourney}
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      New Conversation with Maya
                    </Button>
                  )}
                </>
              )}
              {hasSaveFile && (
                <Button
                  onClick={nuclearReset}
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-red-600 hover:text-red-700"
                >
                  Erase All Progress (Danger Zone)
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Grand Central Terminus</h1>
          <div className="flex gap-2">
            {process.env.NODE_ENV === 'development' && (
              <Button variant="outline" size="sm" onClick={showDebugInfo}>
                Debug
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={continueJourney}>
              New Conversation
            </Button>
          </div>
        </div>

        {/* Character Status */}
        {currentCharacter && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{characterNames[state.currentCharacterId]}</h3>
                  <p className="text-sm text-slate-600">Relationship: {currentCharacter.relationshipStatus}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Trust: {currentCharacter.trust}/10</p>
                  <p className="text-xs text-slate-500">
                    {currentCharacter.knowledgeFlags.size} things learned
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-700 mb-2">
                {state.currentNode?.speaker}
              </h2>
              <div className="text-slate-800 leading-loose space-y-4 whitespace-pre-line">
                {state.currentContent}
              </div>
            </div>

            {/* Scene info for debugging */}
            <div className="text-xs text-slate-400 border-t pt-2">
              Scene: {state.currentNode?.nodeId}
            </div>
          </CardContent>
        </Card>

        {/* Choices */}
        {!isEnding && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Your Response</h3>
              <div className="space-y-3">
                {state.availableChoices.map((evaluatedChoice, index) => (
                  <Button
                    key={evaluatedChoice.choice.choiceId}
                    onClick={() => handleChoice(evaluatedChoice)}
                    disabled={!evaluatedChoice.enabled}
                    variant={evaluatedChoice.enabled ? "outline" : "ghost"}
                    className={`w-full text-left justify-start h-auto p-4 ${
                      evaluatedChoice.enabled
                        ? "bg-white hover:bg-slate-50 text-slate-800 border-slate-300"
                        : "bg-slate-100 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <div>
                      <div className="font-medium">
                        {evaluatedChoice.choice.text}
                      </div>
                      {!evaluatedChoice.enabled && evaluatedChoice.reason && (
                        <div className="text-xs text-slate-500 mt-1">
                          {evaluatedChoice.reason}
                        </div>
                      )}
                      {evaluatedChoice.choice.pattern && (
                        <div className="text-xs text-blue-600 mt-1">
                          Pattern: {evaluatedChoice.choice.pattern}
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
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Conversation Complete
              </h3>
              <p className="text-slate-600 mb-6">
                {characterNames[state.currentCharacterId]} will remember this conversation. Your relationship: {currentCharacter?.relationshipStatus} • Trust: {currentCharacter?.trust}/10
              </p>
              <div className="space-y-2">
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
                }} className="w-full">
                  Talk to {characterNames[state.currentCharacterId]} Again
                </Button>
                <Button variant="outline" onClick={continueJourney} className="w-full">
                  Return to Station
                </Button>
                {process.env.NODE_ENV === 'development' && (
                  <Button variant="ghost" size="sm" onClick={showDebugInfo} className="w-full text-xs">
                    Debug: View Conversation Summary
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}