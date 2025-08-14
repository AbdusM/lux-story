"use client"

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StoryMessage } from "./StoryMessage"
import { CharacterIntro } from "./CharacterIntro"
import { BreathingInvitation } from "./BreathingInvitation"
import { SilentCompanion } from "./SilentCompanion"
import { StoryEngine, Choice } from "@/lib/story-engine"
import { ChevronRight, RotateCcw } from "lucide-react"

// Simplified hooks - no more gamification
import { useGameState } from "@/hooks/useGameState"
import { useSceneTransitions } from "@/hooks/useSceneTransitions"
import { useMessageManager } from "@/hooks/useMessageManager"
import { usePresence } from "@/hooks/usePresence"

export function GameInterface() {
  const [storyEngine] = useState(() => new StoryEngine())
  const [showIntro, setShowIntro] = useState(true)
  
  // Simplified state management - no tracking, no stats
  const { gameState, isInitialized, reset } = useGameState()
  const { currentScene, isProcessing, loadScene, setProcessing } = useSceneTransitions(storyEngine, gameState)
  const { messages, messagesEndRef, addMessage, clearMessages } = useMessageManager()
  const { beginPresence, checkPresence, resetPresence } = usePresence()
  
  // Check for natural revelations through presence (not rewards)
  useEffect(() => {
    if (currentScene?.type === 'choice') {
      beginPresence()
      
      // Check occasionally, not constantly - no pressure
      const interval = setInterval(() => {
        const revelation = checkPresence()
        if (revelation) {
          // Add as a subtle observation, not a reward notification
          setTimeout(() => {
            addMessage({
              speaker: 'narrator',
              text: revelation,
              type: 'narration'
            })
          }, 500)
        }
      }, 5000) // Check every 5 seconds, not every second
      
      return () => clearInterval(interval)
    }
  }, [currentScene, beginPresence, checkPresence, addMessage])
  
  // Load scene with simple message handling
  const handleLoadScene = useCallback((sceneId: string, forceLoad = false) => {
    console.log('handleLoadScene called:', sceneId, forceLoad)
    if (!gameState) {
      console.error('Game state not available in handleLoadScene')
      return
    }
    
    // Load the scene first through useSceneTransitions
    const scene = loadScene(sceneId, forceLoad)
    if (!scene) {
      console.error('Failed to load scene:', sceneId)
      return
    }
    
    // Just display the text, no enhancements or variations
    if (scene.text) {
      const speaker = scene.speaker || 'narrator'
      addMessage({ 
        speaker, 
        text: scene.text,
        type: scene.type as 'narration' | 'dialogue'
      })
    }
  }, [loadScene, gameState, addMessage])
  
  const handleStartGame = useCallback(() => {
    console.log('Starting new game...')
    setShowIntro(false)
    if (gameState) {
      // Always start from the beginning for a new game
      const initialScene = '1-1'
      console.log('Starting new game from scene:', initialScene)
      // Clear messages and reset state for fresh start
      clearMessages()
      resetPresence()
      // Reset game state to beginning
      gameState.setScene(initialScene)
      // Force load the initial scene (handleLoadScene will add the message)
      handleLoadScene(initialScene, true)
    }
  }, [gameState, clearMessages, resetPresence, handleLoadScene])

  const handleContinueGame = useCallback(() => {
    console.log('Continuing game...')
    setShowIntro(false)
    if (gameState) {
      const state = gameState.getState()
      console.log('Continuing from scene:', state.currentScene)
      // Clear messages but keep progress
      clearMessages()
      resetPresence()
      // Load the saved scene
      handleLoadScene(state.currentScene, true)
    }
  }, [gameState, clearMessages, resetPresence, handleLoadScene])
  
  
  const handleChoice = useCallback(async (choice: any) => {
    if (!gameState || !currentScene) return
    
    setProcessing(true)
    resetPresence() // New scene, new presence
    
    // Simply record the choice and move on
    gameState.recordChoice(currentScene.id, choice.text, choice.consequence)
    
    // Add choice to messages
    addMessage({
      speaker: 'You',
      text: choice.text,
      type: 'dialogue'
    })
    
    // Load next scene after a short delay
    setTimeout(() => {
      handleLoadScene(choice.nextScene)
      setProcessing(false)
    }, 1000)
  }, [gameState, currentScene, setProcessing, addMessage, handleLoadScene, resetPresence])
  
  const handleContinue = useCallback(() => {
    if (!currentScene) return
    
    const nextSceneId = storyEngine.getNextScene(currentScene.id)
    if (nextSceneId) {
      handleLoadScene(nextSceneId)
    } else {
      // End of current chapter
      addMessage({
        speaker: 'narrator',
        text: 'To be continued...',
        type: 'narration'
      })
    }
  }, [currentScene, storyEngine, handleLoadScene, addMessage])
  
  // Loading state
  if (!gameState || !isInitialized) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }
  
  // Intro screen
  if (showIntro) {
    const hasSavedProgress = gameState.getState().currentScene !== '1-1'
    return (
      <CharacterIntro 
        onStart={handleStartGame}
        onContinue={handleContinueGame}
        hasSavedProgress={hasSavedProgress}
      />
    )
  }
  
  const state = gameState.getState()
  
  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Card className="max-w-3xl mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-sm text-muted-foreground">
            <span>·</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Messages Area - The only thing on screen */}
          <div className="h-[60vh] overflow-y-auto mb-4 space-y-3 pr-2">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>Your journey begins...</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className="fade-in">
                  <StoryMessage
                    speaker={msg.speaker}
                    text={msg.text}
                    type={msg.type}
                  />
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Action Area - Adaptive choice layout */}
          <div className="border-t pt-4">
            {currentScene?.type === 'choice' && currentScene.choices ? (
              <div className={
                currentScene.choices.length === 1 
                  ? "flex justify-center" 
                  : currentScene.choices.length === 2
                  ? "grid grid-cols-2 gap-2"
                  : currentScene.choices.length === 3
                  ? "grid grid-cols-3 gap-2"
                  : "grid grid-cols-2 gap-2"
              }>
                {currentScene.choices.map((choice, index) => (
                  <Button
                    key={index}
                    onClick={() => handleChoice(choice)}
                    disabled={isProcessing}
                    variant={currentScene.choices?.length === 1 ? "default" : "outline"}
                    className={`h-auto py-3 px-4 text-sm text-center whitespace-normal ${
                      currentScene.choices?.length === 1 ? "max-w-xs" : ""
                    }`}
                  >
                    {choice.text}
                  </Button>
                ))}
              </div>
            ) : currentScene ? (
              <Button
                onClick={handleContinue}
                disabled={isProcessing || !storyEngine.getNextScene(currentScene.id)}
                className="w-full"
                size="lg"
              >
                {storyEngine.getNextScene(currentScene.id) ? 'Continue' : 'Chapter Complete'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
      
      {/* Optional breathing invitation - no pressure, just presence */}
      <BreathingInvitation visible={currentScene?.type === 'choice'} />
      
      {/* Silent companion - only speaks when asked, only asks questions */}
      <SilentCompanion />
    </div>
  )
}