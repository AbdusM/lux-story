"use client"

import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StoryMessage } from "./StoryMessage"
import { CharacterIntro } from "./CharacterIntro"
import { SilentCompanion } from "./SilentCompanion"
import { StoryEngine } from "@/lib/story-engine"

// Simplified hooks - no more gamification
import { useGameState } from "@/hooks/useGameState"
import { useSceneTransitions } from "@/hooks/useSceneTransitions"
import { useMessageManager } from "@/hooks/useMessageManager"
import { usePresence } from "@/hooks/usePresence"
import { useAdaptiveNarrative } from "@/hooks/useAdaptiveNarrative"
import { getPerformanceSystem } from "@/lib/performance-system"
import { getGrandCentralState } from "@/lib/grand-central-state"

export function GameInterface() {
  const [storyEngine] = useState(() => new StoryEngine())
  const [showIntro, setShowIntro] = useState(true)
  const [choiceStartTime, setChoiceStartTime] = useState<number>(Date.now())
  const lastSceneLoadTime = useRef<number>(0)
  const performanceSystem = useMemo(() => getPerformanceSystem(), [])
  const grandCentralState = useMemo(() => getGrandCentralState(), [])
  
  // Simplified state management - no tracking, no stats
  const { gameState, isInitialized } = useGameState()
  const { currentScene, isProcessing, loadScene, setProcessing } = useSceneTransitions(storyEngine, gameState)
  const { messages, messagesEndRef, addMessage, clearMessages } = useMessageManager()
  const { resetPresence } = usePresence()
  const { performanceLevel, enhanceSceneText, analyzeContentSemantics, enhanceChoices } = useAdaptiveNarrative()

  // Semantic-based content chunking with timed reveals
  const createSemanticChunks = useCallback((text: string, speaker: string) => {
    // Analyze content for semantic hierarchy
    const semanticParts = analyzeContentSemantics(text)
    
    // If only one part or short content, return as single chunk
    if (semanticParts.length <= 1 || text.length < 100) {
      return [{ 
        text, 
        delay: 0, 
        semanticType: semanticParts[0]?.type || 'default',
        priority: semanticParts[0]?.priority || 3
      }]
    }
    
    // Create chunks with delays based on priority and narrative flow
    const chunks = semanticParts.map((part, index) => {
      let delay = 0
      
      // Calculate delays based on priority hierarchy
      if (index === 0) {
        // First chunk appears immediately if critical, else small delay
        delay = part.priority === 1 ? 0 : 400
      } else {
        // Subsequent chunks have timing based on their importance
        const baseDelay = 600
        const priorityMultiplier = {
          1: 0.5,   // Critical action appears faster
          2: 0.8,   // Time info appears fairly quickly  
          3: 1.0,   // Default timing
          4: 1.4,   // Stakes/mystery build suspense with longer delay
          5: 0.3    // Atmosphere fills in quickly
        }
        delay = baseDelay * (priorityMultiplier[part.priority as keyof typeof priorityMultiplier] || 1.0) * index
      }
      
      return {
        text: part.text + '.',
        delay: Math.round(delay),
        semanticType: part.type,
        priority: part.priority
      }
    })
    
    // Sort chunks by priority for display order, but keep original delays
    return chunks.sort((a, b) => a.priority - b.priority)
  }, [analyzeContentSemantics])
  
  // Debug logging for React re-renders (removed to prevent console spam)
  // console.log('🔄 GameInterface render - currentScene:', currentScene?.id, 'messages count:', messages.length)
  
  // Track choice timing for Grand Central Terminus - no forest interference
  useEffect(() => {
    if (currentScene?.type === 'choice') {
      setChoiceStartTime(Date.now()) // Track when choice appears for performance metrics only
    }
  }, [currentScene])
  
  // Load scene with simple message handling and auto-advancement for narration
  const handleLoadScene = useCallback((sceneId: string, forceLoad = false) => {
    
    // Prevent rapid scene loading (debounce)
    const now = Date.now()
    if (!forceLoad && now - lastSceneLoadTime.current < 500) {
      return
    }
    lastSceneLoadTime.current = now
    
    if (!gameState) {
      return
    }
    
    // Load the scene first through useSceneTransitions
    const scene = loadScene(sceneId, forceLoad)
    if (!scene) {
      return
    }
    
    console.log('🟡 handleLoadScene - scene loaded:', scene.id, 'text preview:', scene.text?.substring(0, 50))
    
    // Check if this is the same speaker as the last message
    const lastMessage = messages[messages.length - 1]
    const sceneText = scene.text || ''
    const speaker = scene.speaker || 'narrator'
    const isSameSpeaker = lastMessage && lastMessage.speaker === speaker && speaker !== 'narrator'
    
    // Check if this is mixed content that should be split
    const enhancedText = scene.text ? enhanceSceneText(scene.text, scene.type) : ''
    const isMixedLetterContent = enhancedText.includes('At the bottom of the letter') && enhancedText.includes("'")
    
    if (isSameSpeaker && !isMixedLetterContent) {
      console.log('🟡 Same speaker detected - will update existing message instead of clearing')
      // Don't clear messages for same speaker, just update content
    } else {
      console.log('🟡 Different speaker or special content - clearing messages')
      clearMessages()
    }
    
    if (isMixedLetterContent) {
      console.log('🟡 Mixed content detected - will split into two messages')
    }
    
    // Add a small delay to ensure clearing completes before adding new message
    setTimeout(() => {
      console.log('🟡 After clearMessages delay, adding new message')
      
      // Display current scene text
      if (scene.text) {
        console.log('🟡 About to add message for scene:', scene.id)
        
        if (isMixedLetterContent) {
          console.log('🟡 Detected mixed letter content, splitting into two messages')
          console.log('🟡 Original text:', enhancedText)
          
          // Split the text properly: "text: 'quoted content'"
          const colonIndex = enhancedText.indexOf(': ')
          const narrativePart = enhancedText.substring(0, colonIndex + 1).trim() // "At the bottom of the letter, in smaller text:"
          const quotedPart = enhancedText.substring(colonIndex + 2).trim() // "'You have one year...'"
          const letterPart = quotedPart.replace(/^'|'$/g, '').trim() // Remove surrounding single quotes
          
          console.log('🟡 Split into:')
          console.log('🟡 - Narrative part:', narrativePart)
          console.log('🟡 - Letter part:', letterPart)
          
          // Add narrative context first (instant)
          addMessage({ 
            speaker, 
            text: narrativePart,
            type: 'narration',
            typewriter: false,
            sceneId: scene.id
          })
          
          // Add letter content with typewriter effect after a short delay
          setTimeout(() => {
            addMessage({ 
              speaker, 
              text: letterPart,
              type: 'narration',
              typewriter: true,
              sceneId: scene.id
            })
          }, 100)
          
          console.log('🟡 Split messages added for scene:', scene.id)
        } else {
          const shouldUseTypewriter = (text: string, type: string, speaker: string) => {
            // Only for quoted letter/note content that's mostly just the quote
            if (text.includes('"') && type === 'narration') {
              const quotedPart = text.match(/"([^"]*)"/)?.[1] || '';
              return quotedPart.length > text.length * 0.8; // >80% quoted content
            }
            return false; // Everything else instant
          }
          
          if (isSameSpeaker) {
            // For same speaker, just add a simple message (StoryMessage component will handle it)
            console.log('🟡 Same speaker - adding simple message without semantic chunking')
            addMessage({ 
              speaker, 
              text: enhancedText,
              type: scene.type as 'narration' | 'dialogue',
              typewriter: shouldUseTypewriter(enhancedText, scene.type, speaker),
              sceneId: scene.id
            })
          } else {
            // For new speakers, use semantic chunking only if the content is complex enough
            // Skip semantic chunking for narrator - keep as single flowing narrative
            const semanticChunks = createSemanticChunks(enhancedText, speaker)
            
            if (semanticChunks.length > 1 && enhancedText.length > 150 && speaker !== 'narrator') {
              // Add semantic chunks with priority-based delays and styling - only for long complex content
              console.log('🟡 Creating semantic chunks:', semanticChunks.length, 'parts')
              
              semanticChunks.forEach((chunk, index) => {
                setTimeout(() => {
                  addMessage({ 
                    speaker, 
                    text: chunk.text,
                    type: scene.type as 'narration' | 'dialogue',
                    typewriter: shouldUseTypewriter(chunk.text, scene.type, speaker),
                    messageWeight: chunk.priority === 1 ? 'critical' : 
                                 chunk.priority <= 2 ? 'primary' : 'aside',
                    className: `semantic-${chunk.semanticType}`,
                    sceneId: scene.id
                  })
                }, chunk.delay)
              })
              
              console.log('🟡 Semantic chunks scheduled for scene:', scene.id)
            } else {
              // Single message with basic semantic styling
              const chunk = semanticChunks[0]
              addMessage({ 
                speaker, 
                text: enhancedText,
                type: scene.type as 'narration' | 'dialogue',
                typewriter: shouldUseTypewriter(enhancedText, scene.type, speaker),
                messageWeight: chunk?.priority === 1 ? 'critical' : 
                             chunk?.priority <= 2 ? 'primary' : 'aside',
                className: chunk ? `semantic-${chunk.semanticType}` : undefined,
                sceneId: scene.id
              })
              
              console.log('🟡 Single message added for scene:', scene.id)
            }
          }
        }
      } else {
        console.log('🟡 No text for scene:', scene.id)
      }
      
      // User control: always require Continue button interaction
      // Removed auto-advance to maintain consistent UX and user agency
    }, 10) // Very small delay to ensure state updates
  }, [loadScene, gameState, addMessage, clearMessages, enhanceSceneText, createSemanticChunks, storyEngine])
  
  const handleStartGame = useCallback(() => {
    setShowIntro(false)
    if (gameState) {
      // Always start from the beginning for a new game
      const initialScene = '1-1'
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
    setShowIntro(false)
    if (gameState) {
      const state = gameState.getState()
      // Clear messages but keep progress
      clearMessages()
      resetPresence()
      // Load the saved scene
      handleLoadScene(state.currentScene, true)
    }
  }, [gameState, clearMessages, resetPresence, handleLoadScene])
  
  
  const handleChoice = useCallback(async (choice: { text: string; consequence: string; nextScene: string; stateChanges?: unknown }) => {
    console.log('handleChoice called with:', choice)
    try {
      if (!gameState || !currentScene) {
        console.log('Missing gameState or currentScene:', { gameState: !!gameState, currentScene: !!currentScene })
        return
      }
      
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
      'revolutionary_quiet': 'independence',
      // Chapter 2 career values consequences
      'service_calling': 'helping',
      'systems_calling': 'building',
      'analysis_calling': 'analyzing',
      'future_calling': 'exploring',
      'service_systems_blend': 'helping',
      'systems_analysis_blend': 'building',
      'analysis_future_blend': 'analyzing',
      'future_independence_blend': 'exploring',
      'service_systems_clarity': 'helping',
      'systems_analysis_clarity': 'building',
      'analysis_future_clarity': 'analyzing',
      'future_independence_clarity': 'exploring',
      'practical_guidance': 'patience',
      'hybrid_exploration': 'independence',
      'mentoring_others': 'helping',
      'contemplative_insight': 'patience',
      'focused_commitment': 'building',
      'hybrid_integration': 'independence',
      'guide_commitment': 'helping',
      'continued_exploration': 'exploring',
      'confident_departure': 'building',
      'service_before_self': 'helping',
      'station_integration': 'independence',
      'final_reflection': 'patience',
      'values_guided_career': 'analyzing',
      'workforce_development_career': 'helping',
      'career_innovation': 'independence',
      'lifelong_exploration': 'exploring',
      // Chapter 3 career development consequences
      'healthcare_exploration': 'helping',
      'innovation_networking': 'exploring',
      'community_service': 'helping',
      'strategic_research': 'analyzing',
      'organic_exploration': 'patience',
      'parallel_exploration': 'exploring',
      'skills_first_approach': 'building',
      'relationship_building': 'helping',
      'technical_specialization': 'building',
      'interpersonal_development': 'helping',
      'business_acumen': 'analyzing',
      'entrepreneurial_development': 'independence',
      'mentorship_approach': 'patience',
      'project_approach': 'building',
      'community_approach': 'helping',
      'creation_approach': 'independence',
      'specialization_focus': 'building',
      'generalist_focus': 'exploring',
      'influence_focus': 'helping',
      'innovation_focus': 'independence',
      'systematic_planning': 'building',
      'adaptive_planning': 'exploring',
      'balanced_planning': 'patience',
      'relationship_planning': 'helping',
      'values_evolution_insight': 'patience',
      'location_advantage_insight': 'analyzing',
      'contribution_insight': 'helping',
      'relationship_insight': 'helping',
      'mentorship_commitment': 'helping',
      'building_commitment': 'building',
      'exploration_commitment': 'exploring',
      'integration_commitment': 'analyzing'
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
    
    // Don't add choice as separate message - go directly to next scene
    // Load next scene immediately
    setTimeout(() => {
      console.log('🔄 setTimeout executing, attempting to load scene:', choice.nextScene)
      const result = handleLoadScene(choice.nextScene)
      console.log('🔄 handleLoadScene result:', result)
      setProcessing(false)
    }, 500) // Shorter delay
    
    } catch (error) {
      console.error('❌ Error in handleChoice:', error)
      console.error('❌ Choice details:', choice)
      setProcessing(false)
    }
  }, [gameState, currentScene, setProcessing, addMessage, handleLoadScene, resetPresence, choiceStartTime, performanceSystem, messages])
  
  const handleContinue = useCallback(() => {
    console.log('handleContinue called, currentScene:', currentScene?.id)
    if (!currentScene) {
      console.log('No currentScene, returning')
      return
    }
    
    const nextSceneId = storyEngine.getNextScene(currentScene.id)
    console.log('Next scene ID:', nextSceneId)
    
    if (nextSceneId) {
      handleLoadScene(nextSceneId)
    } else {
      console.log('No next scene, showing end message')
      // Clear messages first, then add end message
      clearMessages()
      addMessage({
        speaker: 'narrator',
        text: 'To be continued...',
        type: 'narration',
        typewriter: false,
        sceneId: currentScene?.id || 'end'
      })
    }
  }, [currentScene, storyEngine, handleLoadScene, addMessage, clearMessages])
  
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
  
  const gcState = grandCentralState.getState()
  const platformClass = gcState.platforms.p1.warmth > 2 ? 'platform-warm' : 
                      gcState.platforms.p1.warmth < -2 ? 'platform-cold' : 'platform-neutral'
  const quietHourClass = gcState.time.stopped ? 'quiet-hour' : ''
  
  return (
    <div className={`game-container w-full md:container md:max-w-4xl md:mx-auto p-0 md:p-4 performance-${performanceLevel} grand-central-terminus ${platformClass} ${quietHourClass}`}>
      <Card className="game-card w-full md:max-w-3xl md:mx-auto bg-white dark:bg-gray-900 md:bg-white/95 md:dark:bg-gray-900/95 md:backdrop-blur-sm md:shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-sm text-muted-foreground">
            <span>·</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center min-h-[60vh]">
          {/* Centered Messages Area */}
          <div className="flex-1 flex items-center justify-center">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>Your journey begins...</p>
              </div>
            ) : (
              <div className="w-full" key={currentScene?.id || 'no-scene'}>
                {messages.map((msg, index) => {
                  // Get previous message for visual grouping
                  const prevMsg = index > 0 ? messages[index - 1] : null
                  const isContinuedSpeaker = prevMsg && prevMsg.speaker === msg.speaker && 
                                           msg.speaker !== 'You' // Allow narrator grouping, exclude only user messages
                  
                  return (
                    <StoryMessage
                      key={msg.id} // Use stable message ID instead of scene-based key
                      speaker={msg.speaker}
                      text={msg.text}
                      type={msg.type}
                      messageWeight={msg.messageWeight}
                      buttonText={msg.buttonText}
                      typewriter={msg.typewriter}
                      isContinuedSpeaker={isContinuedSpeaker}
                    />
                  )
                })}
              </div>
            )}
          </div>
          
          {/* Action Area - Adaptive choice layout */}
          <div className="choice-buttons border-t pt-4">
            {currentScene?.type === 'choice' && currentScene.choices ? (
              <div className={
                currentScene.choices.length === 1 
                  ? "flex justify-center" 
                  : currentScene.choices.length === 2
                  ? "grid grid-cols-1 md:grid-cols-2 gap-2"
                  : currentScene.choices.length === 3
                  ? "grid grid-cols-1 md:grid-cols-3 gap-2"
                  : "grid grid-cols-1 md:grid-cols-2 gap-2"
              }>
                {enhanceChoices(currentScene.choices).map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoice(choice)}
                    disabled={isProcessing}
                    className="pokemon-choice-button w-full text-left"
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            ) : (
              // Show Continue button for all non-choice scenes
              <button
                onClick={handleContinue}
                disabled={isProcessing}
                className="pokemon-continue-button w-full"
              >
                {storyEngine.getNextScene(currentScene?.id || '') ? 'Continue' : 'Chapter Complete'}
              </button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* No breathing invitation for Grand Central Terminus */}
      
      {/* Silent companion - only speaks when asked, only asks questions */}
      <SilentCompanion />
    </div>
  )
}