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
import { usePatternRevelation } from "@/hooks/usePatternRevelation"
import { useAdaptiveNarrative } from "@/hooks/useAdaptiveNarrative"
import { getPerformanceSystem } from "@/lib/performance-system"

export function GameInterface() {
  const [storyEngine] = useState(() => new StoryEngine())
  const [showIntro, setShowIntro] = useState(true)
  const [choiceStartTime, setChoiceStartTime] = useState<number>(Date.now())
  const [performanceSystem] = useState(() => getPerformanceSystem())
  
  // Simplified state management - no tracking, no stats
  const { gameState, isInitialized, reset } = useGameState()
  const { currentScene, isProcessing, loadScene, setProcessing } = useSceneTransitions(storyEngine, gameState)
  const { messages, messagesEndRef, addMessage, clearMessages } = useMessageManager()
  const { beginPresence, checkPresence, resetPresence } = usePresence()
  const { checkForRevelation } = usePatternRevelation()
  const { enhanceSceneText, getAmbientMessage, enhanceChoices, getBreathingFrequency } = useAdaptiveNarrative()
  
  // Check for natural revelations through presence (not rewards)
  useEffect(() => {
    if (currentScene?.type === 'choice') {
      beginPresence()
      setChoiceStartTime(Date.now()) // Track when choice appears
      
      // Check occasionally, not constantly - no pressure
      const interval = setInterval(() => {
        // Check for presence revelations
        const presenceRevelation = checkPresence()
        if (presenceRevelation) {
          // Add as a subtle observation, not a reward notification
          setTimeout(() => {
            addMessage({
              speaker: 'narrator',
              text: presenceRevelation,
              type: 'narration'
            })
          }, 500)
        }
        
        // Check for pattern revelations (Birmingham career demo)
        const patternRevelation = checkForRevelation()
        if (patternRevelation) {
          setTimeout(() => {
            addMessage({
              speaker: 'narrator',
              text: patternRevelation,
              type: 'whisper'
            })
          }, 2000)
        }
        
        // Check for performance guidance
        const guidance = performanceSystem.getGuidance()
        if (guidance && Math.random() < 0.3) { // 30% chance to show guidance
          setTimeout(() => {
            addMessage({
              speaker: 'narrator',
              text: guidance,
              type: 'whisper'
            })
          }, 3000)
        }
        
        // Check for ambient messages based on performance
        const ambientMessage = getAmbientMessage()
        if (ambientMessage) {
          setTimeout(() => {
            addMessage({
              speaker: 'narrator',
              text: ambientMessage,
              type: 'narration'
            })
          }, 4000)
        }
      }, 5000) // Check every 5 seconds, not every second
      
      return () => clearInterval(interval)
    }
  }, [currentScene, beginPresence, checkPresence, checkForRevelation, performanceSystem, addMessage])
  
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
    
    // Display text with adaptive enhancements
    if (scene.text) {
      const speaker = scene.speaker || 'narrator'
      const enhancedText = enhanceSceneText(scene.text, scene.type)
      addMessage({ 
        speaker, 
        text: enhancedText,
        type: scene.type as 'narration' | 'dialogue'
      })
      
      // Add breathing invitation based on performance
      if (scene.type === 'choice' && Math.random() < getBreathingFrequency()) {
        setTimeout(() => {
          addMessage({
            speaker: 'narrator',
            text: 'Perhaps this is a moment to breathe.',
            type: 'whisper'
          })
        }, 2000)
      }
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
    
    // Calculate time taken to make choice
    const timeToChoose = Date.now() - choiceStartTime
    
    // Record the choice with theme tracking for Birmingham demo
    // Map consequences to career-relevant themes
    const themeMap: Record<string, string> = {
      'observation': 'analyzing',
      'acceptance': 'patience',
      'immersion': 'experiencing',
      'patience': 'patience',
      'engagement': 'connecting',
      'movement': 'action',
      'presence': 'mindfulness',
      'planning': 'organizing',
      'curiosity': 'questioning',
      'indifference': 'detachment',
      'silence': 'listening',
      'reassurance': 'helping',
      'questioning': 'questioning',
      'deflection': 'avoiding',
      'persistence': 'perseverance',
      'philosophy': 'thinking',
      'seeking': 'exploring',
      'receptivity': 'openness',
      'contribution': 'sharing',
      'traditional': 'conforming',
      'honesty': 'authenticity',
      'uncertainty': 'accepting_unknown',
      'creation': 'building',
      'seeking_peace': 'harmony',
      'seeking_purpose': 'meaning',
      'seeking_nothing': 'contentment',
      'seeking_unknown': 'exploring',
      'confirmation': 'affirming',
      'mirror': 'reflecting',
      'teaching': 'guiding',
      'nothing': 'simplicity'
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
    
    // Load next scene after a short delay
    setTimeout(() => {
      handleLoadScene(choice.nextScene)
      setProcessing(false)
    }, 1000)
  }, [gameState, currentScene, setProcessing, addMessage, handleLoadScene, resetPresence, choiceStartTime, performanceSystem, messages])
  
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