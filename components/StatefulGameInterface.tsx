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
import { mayaDialogueGraph } from '@/content/maya-dialogue-graph'

interface GameInterfaceState {
  gameState: GameState | null
  currentNode: DialogueNode | null
  availableChoices: EvaluatedChoice[]
  currentContent: string
  isLoading: boolean
  hasStarted: boolean
}

export default function StatefulGameInterface() {
  const [state, setState] = useState<GameInterfaceState>({
    gameState: null,
    currentNode: null,
    availableChoices: [],
    currentContent: '',
    isLoading: false,
    hasStarted: false
  })

  // Client-only state for save file detection (prevents hydration mismatch)
  const [hasSaveFile, setHasSaveFile] = useState(false)

  // Check for save file after mounting (client-side only)
  useEffect(() => {
    setHasSaveFile(GameStateManager.hasSaveFile())
  }, [])

  // Initialize or load game
  const initializeGame = useCallback(() => {
    console.log('🎮 Initializing Stateful Narrative Engine...')

    // Try to load existing save
    let gameState = GameStateManager.loadGameState()

    if (!gameState) {
      // Create new game
      gameState = GameStateUtils.createNewGameState('player_' + Date.now())
      console.log('✅ Created new game state')
    } else {
      console.log('✅ Loaded existing game state')
    }

    // Get the starting node
    const startNode = mayaDialogueGraph.nodes.get('maya_introduction')
    if (!startNode) {
      console.error('❌ Start node not found!')
      return
    }

    // Select content variation
    const content = DialogueGraphNavigator.selectContent(startNode)

    // Evaluate available choices
    const choices = StateConditionEvaluator.evaluateChoices(
      startNode,
      gameState,
      'maya'
    ).filter(choice => choice.visible)

    setState({
      gameState,
      currentNode: startNode,
      availableChoices: choices,
      currentContent: content.text,
      isLoading: false,
      hasStarted: true
    })

    // Auto-save
    GameStateManager.saveGameState(gameState)
  }, [])

  // Handle choice selection
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

    // Get next node
    const nextNode = mayaDialogueGraph.nodes.get(choice.choice.nextNodeId)
    if (!nextNode) {
      console.error(`❌ Next node not found: ${choice.choice.nextNodeId}`)
      setState(prev => ({ ...prev, isLoading: false }))
      return
    }

    // Apply node entry state changes
    if (nextNode.onEnter) {
      for (const change of nextNode.onEnter) {
        newGameState = GameStateUtils.applyStateChange(newGameState, change)
      }
    }

    // Update conversation history
    const mayaState = newGameState.characters.get('maya')!
    mayaState.conversationHistory.push(nextNode.nodeId)

    // Select content variation
    const content = DialogueGraphNavigator.selectContent(
      nextNode,
      mayaState.conversationHistory
    )

    // Evaluate new choices
    const newChoices = StateConditionEvaluator.evaluateChoices(
      nextNode,
      newGameState,
      'maya'
    ).filter(choice => choice.visible)

    // Update state
    setState({
      gameState: newGameState,
      currentNode: nextNode,
      availableChoices: newChoices,
      currentContent: content.text,
      isLoading: false,
      hasStarted: true
    })

    // Auto-save
    GameStateManager.saveGameState(newGameState)

    console.log(`🎭 Moved to: ${nextNode.nodeId}`)
    console.log(`🎯 Maya trust: ${newGameState.characters.get('maya')?.trust}`)
  }, [state.gameState])

  // Reset game
  const resetGame = useCallback(() => {
    GameStateManager.resetGameState()
    setState({
      gameState: null,
      currentNode: null,
      availableChoices: [],
      currentContent: '',
      isLoading: false,
      hasStarted: false
    })
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
              <Button
                onClick={initializeGame}
                size="lg"
                className="w-full"
              >
                Begin New Journey
              </Button>
              {hasSaveFile && (
                <Button
                  onClick={initializeGame}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Continue Journey
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
  const maya = state.gameState?.characters.get('maya')

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Grand Central Terminus</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={showDebugInfo}>
              Debug
            </Button>
            <Button variant="outline" size="sm" onClick={resetGame}>
              Reset
            </Button>
          </div>
        </div>

        {/* Character Status */}
        {maya && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Maya Chen</h3>
                  <p className="text-sm text-slate-600">Relationship: {maya.relationshipStatus}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Trust: {maya.trust}/10</p>
                  <p className="text-xs text-slate-500">
                    {maya.knowledgeFlags.size} things learned
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
              <p className="text-slate-800 leading-relaxed">
                {state.currentContent}
              </p>
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
                    variant={evaluatedChoice.enabled ? "default" : "outline"}
                    className="w-full text-left justify-start h-auto p-4"
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
                Chapter Complete
              </h3>
              <p className="text-slate-600 mb-6">
                Maya's story continues, shaped by your choices.
              </p>
              <div className="space-y-2">
                <Button onClick={resetGame} className="w-full">
                  Start New Journey
                </Button>
                <Button variant="outline" onClick={showDebugInfo} className="w-full">
                  View Journey Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}