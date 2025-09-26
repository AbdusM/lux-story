/**
 * MINIMAL Game Interface - Zero Complex Dependencies
 * Breaks the whack-a-mole cycle with guaranteed-working simple components
 */

"use client"

import { useState, useEffect, useMemo } from 'react'
import { useSimpleGame } from '@/hooks/useSimpleGame'
// Apple Design System removed - using shadcn components

// Function to render a single dialogue chunk
function renderDialogueChunk(chunk: { text: string; type: string }, index: number) {
  const { text, type } = chunk

  switch (type) {
    case 'scene-heading':
      return (
        <div key={index} className="apple-scene-heading">
          {text}
        </div>
      )
    case 'dialogue':
      return (
        <div key={index} className="apple-dialogue-card">
          <div className="apple-dialogue-text">{text}</div>
        </div>
      )
    case 'parenthetical':
      return (
        <div key={index} className="apple-parenthetical">
          {text}
        </div>
      )
    case 'action':
    default:
      return (
        <div key={index} className="apple-action-line">
          {text}
        </div>
      )
  }
}

// Legacy function for backward compatibility (now simplified)
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
    
    // Detect character introduction with action (but not in opening sequence)
    if (trimmedSection.includes('Platform') && trimmedSection.includes(':') && trimmedSection.match(/Platform \d+:/)) {
      // Skip auto-generating scene headers for generic platform references in opening text
      if (trimmedSection.includes('Platform 7, Midnight') || trimmedSection.includes('platforms stretch into the distance')) {
        return (
          <div key={index} className="apple-action-line">
            {trimmedSection}
          </div>
        )
      }

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
    
    // Break text at natural paragraph boundaries for better readability
    if (trimmedSection.includes('\n\n') || trimmedSection.length > 400) {
      const naturalParagraphs = createNaturalParagraphs(trimmedSection)
      return (
        <div key={index} className="apple-text-paragraphs">
          {naturalParagraphs.map((paragraph, paragraphIndex) => (
            <div key={paragraphIndex} className="apple-action-line apple-paragraph">
              {paragraph}
            </div>
          ))}
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

// Natural paragraph creation that respects semantic boundaries
function createNaturalParagraphs(text: string): string[] {
  // First, split by explicit paragraph breaks (double line breaks)
  const explicitParagraphs = text.split(/\n\n+/).filter(p => p.trim())

  const paragraphs: string[] = []

  for (const paragraph of explicitParagraphs) {
    const trimmed = paragraph.trim()

    // If paragraph is reasonable length (under 250 chars), keep it whole
    if (trimmed.length <= 250) {
      paragraphs.push(trimmed)
    } else {
      // For long paragraphs, split at natural sentence boundaries
      const sentences = trimmed.split(/(?<=[.!?])\s+/)
      let currentParagraph = ''

      for (const sentence of sentences) {
        // If adding this sentence keeps us under 250 chars, add it
        if (currentParagraph.length + sentence.length <= 250) {
          currentParagraph = currentParagraph ? currentParagraph + ' ' + sentence : sentence
        } else {
          // Start new paragraph if current one has content
          if (currentParagraph) {
            paragraphs.push(currentParagraph.trim())
          }
          currentParagraph = sentence
        }
      }

      // Add final paragraph if it has content
      if (currentParagraph.trim()) {
        paragraphs.push(currentParagraph.trim())
      }
    }
  }

  return paragraphs.length > 0 ? paragraphs : [text.trim()]
}

// Character identification for styling
function getCharacterFromSpeaker(speaker: string | undefined): string {
  if (!speaker || typeof speaker !== 'string') return 'narrator'
  const lowerSpeaker = speaker.toLowerCase()
  if (lowerSpeaker.includes('maya')) return 'maya'
  if (lowerSpeaker.includes('samuel')) return 'samuel'
  if (lowerSpeaker.includes('narrator')) return 'narrator'
  if (lowerSpeaker.includes('devon')) return 'devon'
  if (lowerSpeaker.includes('jordan')) return 'jordan'
  return 'narrator'
}

// Professional choice categorization with consistent emotional mapping
function categorizeChoice(choiceText: string | undefined): { type: string; icon: string } {
  if (!choiceText || typeof choiceText !== 'string') {
    return { type: 'neutral', icon: '💭' }
  }
  const text = choiceText.toLowerCase()

  // Supportive/Agreeable (Green) - Encouraging, validating, agreeing
  if (text.includes('feel') || text.includes('understand') || text.includes('that must') ||
      text.includes('sounds like') || text.includes('help') || text.includes('support') ||
      text.includes('together') || text.includes('believe') || text.includes('validate') ||
      text.includes('great') || text.includes('excellent') || text.includes('i hear')) {
    return { type: 'supportive', icon: '🤝' }
  }

  // Analytical/Question (Blue) - Investigating, questioning, exploring
  if (text.includes('why') || text.includes('how') || text.includes('what') ||
      text.includes('analyze') || text.includes('think about') || text.includes('consider') ||
      text.includes('tell me') || text.includes('explain') || text.includes('curious') ||
      text.includes('explore') || text.includes('understand more')) {
    return { type: 'analytical', icon: '🧠' }
  }

  // Challenge/Push (Orange) - Questioning assumptions, pushing boundaries
  if (text.includes('but') || text.includes('however') || text.includes('what if') ||
      text.includes('challenge') || text.includes('push') || text.includes('difficult') ||
      text.includes('disagree') || text.includes('alternative') || text.includes('consider that')) {
    return { type: 'challenging', icon: '⚡' }
  }

  // Listen/Neutral (Gray) - Observing, listening, continuing
  return { type: 'listening', icon: '👂' }
}

// Speakers that should show all text at once (no progression)
const NARRATOR_SPEAKERS = ['Narrator', 'SCENE', null, undefined, '']

export function MinimalGameInterface() {
  const game = useSimpleGame()
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null)
  const [chunkIndex, setChunkIndex] = useState(0)

  // Reset chunk index when scene changes
  useEffect(() => {
    setChunkIndex(0)
    setSelectedChoiceIndex(null)
  }, [game.currentScene])

  // Parse text into chunks (memoized for performance)
  const chunks = useMemo(() => {
    if (!game.messages?.[0]?.text) return []
    return game.messages[0].text
      .split('\n\n')
      .filter(chunk => chunk.trim())
      .map(chunk => chunk.trim())
  }, [game.messages])

  // Determine scene type and progression state
  const currentSpeaker = game.messages?.[0]?.speaker || 'Narrator'
  const isNarrator = NARRATOR_SPEAKERS.includes(currentSpeaker)
  const isDialogue = !isNarrator
  const isLastChunk = chunkIndex >= chunks.length - 1
  const hasChoices = game.choices && game.choices.length > 0

  // Handle continue button click with critical edge case fix
  const handleContinue = () => {
    if (!isLastChunk) {
      // Not on last chunk, just advance the chunk index
      setChunkIndex(prev => prev + 1)
    } else {
      // On last chunk - check if we need to auto-advance
      if (!hasChoices && game.handleContinueDialogue) {
        // No choices available, advance to next scene
        game.handleContinueDialogue()
      }
      // If there ARE choices, do nothing - they'll be displayed
    }
  }

  // Detect current platform for gradient theming
  const getCurrentPlatform = () => {
    if (!game.messages || game.messages.length === 0) return 'default'
    const text = game.messages[0].text
    if (text.includes('Platform 1') || text.includes('Care Line')) return 'care'
    if (text.includes('Platform 3') || text.includes('Builder')) return 'builder'
    if (text.includes('Platform 7') || text.includes('Data Stream')) return 'tech'
    if (text.includes('Platform 9') || text.includes('Growing Garden')) return 'creative'
    return 'default'
  }

  // Show intro screen if not started
  if (!game.hasStarted) {
    return (
      <div className="apple-game-container">
        <div className="apple-conversation-wrapper">
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
      </div>
    )
  }

  // Show main game interface
  return (
    <div className="apple-game-container">
      <div className="apple-conversation-wrapper">
        <div className="apple-game-content">
        <div className="apple-header">
          <div className="apple-text-headline">Grand Central Terminus</div>
          <div className="apple-text-caption">Birmingham Career Exploration</div>
        </div>

        {/* Clean Progressive Dialogue System */}
        {game.messages && game.messages.length > 0 && (
          <div
            className="apple-story-message"
            data-platform={getCurrentPlatform()}
            data-character={getCharacterFromSpeaker(game.messages[0].speaker)}
            role="article"
            aria-labelledby="story-speaker"
          >
            <div id="story-speaker" className="apple-character-cue">{currentSpeaker}</div>
            <div className="apple-story-text" aria-live="polite">
              {/* THE CORE LOGIC: Show one chunk for dialogue, all for narrator */}
              {isDialogue ? (
                // Progressive dialogue: show only current chunk
                <div className="apple-dialogue-card">
                  <div className="apple-dialogue-text">
                    {chunks[chunkIndex] || chunks[0] || game.messages[0].text}
                  </div>
                </div>
              ) : (
                // Narrator: show all text at once using the existing parser
                parseTextWithHierarchy(game.messages[0].text)
              )}
            </div>
          </div>
        )}

        {/* Clean Controls: Continue button OR choices */}
        <div className="apple-choices-container" role="group" aria-label="Story interactions">
          {/* Show Continue button for dialogue with critical edge case handling */}
          {isDialogue && (!isLastChunk || (isLastChunk && !hasChoices)) && chunks.length > 1 && (
            <button
              onClick={handleContinue}
              className="apple-button apple-button-primary"
              style={{ width: '100%' }}
            >
              Continue →
            </button>
          )}

          {/* Show choices when narrator scene OR last dialogue chunk */}
          {(isNarrator || (isDialogue && isLastChunk)) && hasChoices && (
            game.choices.map((choice, index) => {
              const { type, icon } = categorizeChoice(choice.text)
              return (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedChoiceIndex(index)
                    setTimeout(() => {
                      game.handleChoice(choice)
                      setSelectedChoiceIndex(null)
                    }, 400)
                  }}
                  className={`apple-choice-button ${
                    selectedChoiceIndex === index ? 'selected' :
                    selectedChoiceIndex !== null ? 'faded' : ''
                  }`}
                  data-choice-type={type}
                  aria-describedby={`choice-${index}-description`}
                  aria-pressed={selectedChoiceIndex === index}
                >
                  <span className="choice-icon" aria-hidden="true">{icon}</span>
                  {choice.text}
                  <span id={`choice-${index}-description`} className="sr-only">
                    Choice {index + 1} of {game.choices.length}: {type} response
                  </span>
                </button>
              )
            })
          )}
        </div>

        </div>
      </div>
    </div>
  )
}

export default MinimalGameInterface