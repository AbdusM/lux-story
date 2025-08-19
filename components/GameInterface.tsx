"use client"

import { useState, useCallback, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StoryMessage } from "./StoryMessage"
import { CharacterIntro } from "./CharacterIntro"
import { SilentCompanion } from "./SilentCompanion"
import { StoryEngine, Choice } from "@/lib/story-engine"
import { ChevronRight, RotateCcw } from "lucide-react"

// Simplified hooks - no more gamification
import { useGameState } from "@/hooks/useGameState"
import { useSceneTransitions } from "@/hooks/useSceneTransitions"
import { useMessageManager } from "@/hooks/useMessageManager"
import { usePresence } from "@/hooks/usePresence"
import { usePatternRevelation } from "@/hooks/usePatternRevelation"
import { useAdaptiveNarrative } from "@/hooks/useAdaptiveNarrative"
import { getPerformanceSystem } from "@/lib/performance-system"
import { getGrandCentralState } from "@/lib/grand-central-state"

export function GameInterface() {
  const [storyEngine] = useState(() => new StoryEngine())
  const [showIntro, setShowIntro] = useState(true)
  const [choiceStartTime, setChoiceStartTime] = useState<number>(Date.now())
  const [lastSceneLoadTime, setLastSceneLoadTime] = useState<number>(0)
  const performanceSystem = useMemo(() => getPerformanceSystem(), [])
  const grandCentralState = useMemo(() => getGrandCentralState(), [])
  
  // Simplified state management - no tracking, no stats
  const { gameState, isInitialized, reset } = useGameState()
  const { currentScene, isProcessing, loadScene, setProcessing } = useSceneTransitions(storyEngine, gameState)
  const { messages, messagesEndRef, addMessage, clearMessages } = useMessageManager()
  const { resetPresence } = usePresence()
  const { performanceLevel, enhanceSceneText, enhanceChoices } = useAdaptiveNarrative()
  
  // Track choice timing for Grand Central Terminus - no forest interference
  useEffect(() => {
    if (currentScene?.type === 'choice') {
      setChoiceStartTime(Date.now()) // Track when choice appears for performance metrics only
    }
  }, [currentScene])
  
  // Load scene with simple message handling
  const handleLoadScene = useCallback((sceneId: string, forceLoad = false) => {
    console.log('handleLoadScene called:', sceneId, forceLoad)
    
    // Prevent rapid scene loading (debounce)
    const now = Date.now()
    if (!forceLoad && now - lastSceneLoadTime < 500) {
      console.log('Scene load blocked - too rapid', now - lastSceneLoadTime)
      return
    }
    setLastSceneLoadTime(now)
    
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
    
    // Display text with adaptive enhancements
    if (scene.text) {
      const speaker = scene.speaker || 'narrator'
      const enhancedText = enhanceSceneText(scene.text, scene.type)
      addMessage({ 
        speaker, 
        text: enhancedText,
        type: scene.type as 'narration' | 'dialogue'
      })
      
      // No breathing invitations for Grand Central Terminus - this is career exploration, not meditation
    }
  }, [loadScene, gameState, addMessage, lastSceneLoadTime])
  
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
    try {
      console.log('🎯 HANDLE_CHOICE_START:', choice, 'currentScene:', currentScene?.id)
      console.log('🎯 Choice details:', JSON.stringify(choice, null, 2))
      console.trace('🎯 handleChoice call stack')
      
      if (!gameState || !currentScene) {
        console.error('🎯 HANDLE_CHOICE_ERROR: Missing gameState or currentScene')
        return
      }
      
      console.log('🎯 Setting processing true')
      setProcessing(true)
      resetPresence() // New scene, new presence
    
    // Calculate time taken to make choice
    const timeToChoose = Date.now() - choiceStartTime
    
    // Apply Grand Central choice effects
    if (choice.stateChanges) {
      grandCentralState.applyChoiceEffects(choice.stateChanges)
    }
    
    // Record the choice with theme tracking for Birmingham demo
    // Map consequences to career-relevant themes
    const themeMap: Record<string, string> = {
      'trusting': 'trust',
      'cautious': 'analyzing',
      'rebellious': 'independence',
      'analytical': 'analyzing',
      'builder': 'building',
      'helper': 'helping',
      'focused': 'rushing',
      'direct': 'analyzing',
      'curious': 'exploring',
      'impatient': 'rushing',
      'determined': 'rushing',
      'exploring': 'exploring',
      'connecting': 'helping',
      'observing': 'patience',
      'explorer_quiet': 'exploring',
      'understanding_quiet': 'analyzing',
      'helper_quiet': 'helping',
      'revolutionary_quiet': 'independence'
    }
    
    const theme = themeMap[choice.consequence] || choice.consequence
    gameState.recordChoiceWithTheme(currentScene.id, choice.text, choice.consequence, theme)
    
    // Update performance metrics
    const character = messages.slice(-5).find(m => m.speaker !== 'You' && m.speaker !== 'narrator')?.speaker
    performanceSystem.updateFromChoice(theme, timeToChoose, currentScene.id, character)
    
    // Get all recent themes for pattern analysis
    const state = gameState.getState()
    const recentThemes = state.choices.slice(-10).map(c => {
      const mappedTheme = themeMap[c.consequence] || c.consequence
      return mappedTheme
    })
    performanceSystem.updateFromPatterns(recentThemes)
    
    // Add choice to messages
    addMessage({
      speaker: 'You',
      text: choice.text,
      type: 'dialogue'
    })
    
    console.log('🎯 Loading next scene:', choice.nextScene)
    // Load next scene after a short delay
    setTimeout(() => {
      handleLoadScene(choice.nextScene)
      setProcessing(false)
      console.log('🎯 HANDLE_CHOICE_COMPLETE')
    }, 1000)
    
    } catch (error) {
      console.error('🎯 HANDLE_CHOICE_ERROR:', error)
      setProcessing(false)
    }
  }, [gameState, currentScene, setProcessing, addMessage, handleLoadScene, resetPresence, choiceStartTime, performanceSystem, messages])
  
  const handleContinue = useCallback(() => {
    console.log('handleContinue called, currentScene:', currentScene?.id)
    if (!currentScene) return
    
    const nextSceneId = storyEngine.getNextScene(currentScene.id)
    console.log('Next scene ID from story engine:', nextSceneId)
    if (nextSceneId) {
      console.log('Loading next scene:', nextSceneId)
      handleLoadScene(nextSceneId)
    } else {
      console.log('No next scene found, showing chapter complete')
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
  
  const gcState = grandCentralState.getState()
  const platformClass = gcState.platforms.p1.warmth > 2 ? 'platform-warm' : 
                      gcState.platforms.p1.warmth < -2 ? 'platform-cold' : 'platform-neutral'
  const quietHourClass = gcState.time.stopped ? 'quiet-hour' : ''
  
  return (
    <div className={`container max-w-4xl mx-auto p-4 performance-${performanceLevel} grand-central-terminus ${platformClass} ${quietHourClass}`}>
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
            {(() => {
              console.log('Rendering action area, currentScene:', currentScene?.id, 'type:', currentScene?.type, 'choices:', currentScene?.choices?.length)
              return null
            })()}
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
                {enhanceChoices(currentScene.choices).map((choice, index) => (
                  <Button
                    key={index}
                    onClick={() => {
                      console.log('🔘 BUTTON_CLICKED:', index, choice.text)
                      handleChoice(choice)
                    }}
                    disabled={isProcessing}
                    variant={currentScene.choices?.length === 1 ? "default" : "outline"}
                    className={`choice-button h-auto py-3 px-4 text-sm text-center whitespace-normal ${
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
      
      {/* No breathing invitation for Grand Central Terminus */}
      
      {/* Silent companion - only speaks when asked, only asks questions */}
      <SilentCompanion />
    </div>
  )
}