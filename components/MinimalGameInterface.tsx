/**
 * MINIMAL Game Interface - Zero Complex Dependencies
 * Breaks the whack-a-mole cycle with guaranteed-working simple components
 */

"use client"

import { useSimpleGame } from '@/hooks/useSimpleGame'
import '@/styles/apple-design-system.css'

// Screenplay/Graphic Novel text parsing for role-based formatting
function parseTextWithHierarchy(text: string) {
  // Split by double line breaks to create major sections
  const sections = text.split('\n\n').filter(section => section.trim())
  
  return sections.map((section, index) => {
    const trimmedSection = section.trim()
    
    // Detect scene headings (INT./EXT. format)
    if (trimmedSection.match(/^(INT\.|EXT\.)/i)) {
      return (
        <div key={index} className="apple-scene-heading">
          {trimmedSection}
        </div>
      )
    }
    
    // Detect direct dialogue (quoted text)
    if (trimmedSection.startsWith('"') && trimmedSection.endsWith('"')) {
      return (
        <div key={index} className="apple-dialogue-card">
          <div className="apple-dialogue-text">{trimmedSection}</div>
        </div>
      )
    }
    
    // Detect character introduction with action
    if (trimmedSection.includes('Platform') && trimmedSection.includes(':')) {
      // Extract platform name for scene heading
      const platformMatch = trimmedSection.match(/Platform \d+: ([^.]+)/)
      const platformName = platformMatch ? platformMatch[1] : 'UNKNOWN PLATFORM'
      
      return (
        <div key={index}>
          <div className="apple-scene-heading">
            INT. PLATFORM {platformName.toUpperCase()} - DAY
          </div>
          <div className="apple-caption-box">
            {trimmedSection}
          </div>
        </div>
      )
    }
    
    // Detect parentheticals (tone indicators)
    if (trimmedSection.startsWith('*(') && trimmedSection.endsWith(')*')) {
      return (
        <div key={index} className="apple-parenthetical">
          {trimmedSection.slice(2, -2)}
        </div>
      )
    }
    
    // Default to action lines for other content
    return (
      <div key={index} className="apple-action-line">
        {trimmedSection}
      </div>
    )
  })
}

export function MinimalGameInterface() {
  const game = useSimpleGame()

  // Show intro screen if not started
  if (!game.hasStarted) {
    return (
      <div className="apple-game-container">
        <div className="apple-game-content">
          <div className="apple-header">
            <div className="apple-text-headline">Grand Central Terminus</div>
            <div className="apple-text-caption">Birmingham Career Exploration</div>
          </div>

          <div className="apple-story-message">
            <div className="apple-scene-heading">INT. GRAND CENTRAL TERMINUS - NIGHT</div>
            <div className="apple-story-text">
              {parseTextWithHierarchy("Grand Central Terminus isn't on any map, but here you are.\n\nThe letter in your hand reads: \"Platform 7, Midnight. Your future awaits.\"\n\nAround you, platforms stretch into the distance, each humming with different energy.")}
            </div>
          </div>

          <div className="apple-choices-container">
            <button
              onClick={game.handleStartGame}
              className="apple-button apple-button-primary"
            >
              Begin New Journey
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show main game interface
  return (
    <div className="apple-game-container">
      <div className="apple-game-content">
        <div className="apple-header">
          <div className="apple-text-headline">Grand Central Terminus</div>
          <div className="apple-text-caption">Birmingham Career Exploration</div>
        </div>

        {/* Screenplay-style message display */}
        {game.messages && game.messages.length > 0 && (
          <div className="apple-story-message">
            <div className="apple-character-cue">{game.messages[0].speaker}</div>
            <div className="apple-story-text">
              {parseTextWithHierarchy(game.messages[0].text)}
            </div>
          </div>
        )}

        {/* Simple choices - no complex components */}
        {game.choices && game.choices.length > 0 && (
          <div className="apple-choices-container">
            {game.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => game.handleChoice(choice)}
                disabled={game.isProcessing}
                className="apple-choice-button"
              >
                {choice.text}
              </button>
            ))}
          </div>
        )}

        {/* Processing indicator */}
        {game.isProcessing && (
          <div className="apple-processing-indicator">
            <div className="apple-spinner"></div>
            <span>Processing your choice...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default MinimalGameInterface