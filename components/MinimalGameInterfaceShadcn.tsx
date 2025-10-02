/**
 * MINIMAL Game Interface - Shadcn Version
 * Drop-in replacement using shadcn components instead of apple-design-system.css
 */

"use client"

import { useState, useEffect, useMemo } from 'react'
import { useSimpleGame } from '@/hooks/useSimpleGame'
import { ChevronRight } from 'lucide-react'
import { GameCard, GameCardContent, GameCardHeader } from '@/components/game/game-card'
import { GameChoice, GameChoiceGroup } from '@/components/game/game-choice'
import { GameMessage } from '@/components/game/game-message'
import { Typography } from '@/components/ui/typography'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Function to render a single dialogue chunk using GameMessage
function renderDialogueChunk(chunk: { text: string; type: string }, index: number) {
  const { text, type } = chunk

  switch (type) {
    case 'scene-heading':
      return (
        <div key={index} className="mb-4">
          <Typography
            variant="h4"
            font="mono"
            className="uppercase tracking-wider text-amber-700 dark:text-amber-300 text-center"
          >
            {text}
          </Typography>
        </div>
      )
    case 'dialogue':
      return (
        <GameCard key={index} variant="dialogue" className="mb-4">
          <GameCardContent className="p-4">
            <Typography variant="dialogue">{text}</Typography>
          </GameCardContent>
        </GameCard>
      )
    case 'parenthetical':
      return (
        <div key={index} className="mb-2">
          <Typography variant="whisper" className="italic text-center">
            {text}
          </Typography>
        </div>
      )
    case 'action':
    default:
      return (
        <div key={index} className="mb-3">
          <Typography variant="narrator" className="text-center">
            {text}
          </Typography>
        </div>
      )
  }
}

// Legacy function for backward compatibility (now simplified with shadcn)
function parseTextWithHierarchy(text: string) {
  // Split by double line breaks to create major sections
  const sections = text.split('\n\n').filter(section => section.trim())

  return sections.map((section, index) => {
    const trimmedSection = section.trim()

    // Detect scene headings (INT./EXT. format) and ensure they're uppercase
    if (trimmedSection.match(/^(INT\.|EXT\.)/i)) {
      return (
        <div key={index} className="mb-4">
          <Typography
            variant="h4"
            font="mono"
            className="uppercase tracking-wider text-amber-700 dark:text-amber-300 text-center"
          >
            {trimmedSection.toUpperCase()}
          </Typography>
        </div>
      )
    }

    // Detect direct dialogue (quoted text)
    if (trimmedSection.startsWith('"') && trimmedSection.endsWith('"')) {
      return (
        <GameCard key={index} variant="dialogue" className="mb-4">
          <GameCardContent className="p-4">
            <Typography variant="dialogue">{trimmedSection}</Typography>
          </GameCardContent>
        </GameCard>
      )
    }

    // Detect character introduction with action (but not in opening sequence)
    if (trimmedSection.includes('Platform') && trimmedSection.includes(':') && trimmedSection.match(/Platform \d+:/)) {
      // Skip auto-generating scene headers for generic platform references in opening text
      if (trimmedSection.includes('Platform 7, Midnight') || trimmedSection.includes('platforms stretch into the distance')) {
        return (
          <div key={index} className="mb-3">
            <Typography variant="narrator">{trimmedSection}</Typography>
          </div>
        )
      }

      // Extract platform name for scene heading
      const platformMatch = trimmedSection.match(/Platform \d+: ([^.]+)/)
      const platformName = platformMatch ? platformMatch[1] : 'UNKNOWN PLATFORM'

      return (
        <div key={index} className="mb-6">
          <Typography
            variant="h4"
            font="mono"
            className="uppercase tracking-wider text-amber-700 dark:text-amber-300 text-center mb-4"
          >
            INT. PLATFORM {platformName.toUpperCase()} - DAY
          </Typography>
          <GameCard variant="narration" className="mb-4">
            <GameCardContent className="p-4">
              <Typography variant="caption">{trimmedSection}</Typography>
            </GameCardContent>
          </GameCard>
        </div>
      )
    }

    // Detect parentheticals (tone indicators)
    if (trimmedSection.startsWith('*(') && trimmedSection.endsWith(')*')) {
      return (
        <div key={index} className="mb-2">
          <Typography variant="whisper" className="italic text-center">
            {trimmedSection.slice(2, -2)}
          </Typography>
        </div>
      )
    }

    // Break text at natural paragraph boundaries for better readability
    if (trimmedSection.includes('\n\n') || trimmedSection.length > 400) {
      const naturalParagraphs = createNaturalParagraphs(trimmedSection)
      return (
        <div key={index} className="mb-4 space-y-3">
          {naturalParagraphs.map((paragraph, paragraphIndex) => (
            <Typography key={paragraphIndex} variant="narrator" className="block">
              {paragraph}
            </Typography>
          ))}
        </div>
      )
    }

    // Default to action lines for other content
    return (
      <div key={index} className="mb-3">
        <Typography variant="narrator">{trimmedSection}</Typography>
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

// Professional choice categorization (no emoji)
function categorizeChoice(choiceText: string | undefined): { type: string; pattern: "helping" | "analytical" | "building" | "patience" | "exploring" } {
  if (!choiceText || typeof choiceText !== 'string') {
    return { type: 'neutral', pattern: 'exploring' }
  }
  const text = choiceText.toLowerCase()

  // Supportive/Agreeable - Encouraging, validating, agreeing
  if (text.includes('feel') || text.includes('understand') || text.includes('that must') ||
      text.includes('sounds like') || text.includes('help') || text.includes('support') ||
      text.includes('together') || text.includes('believe') || text.includes('validate') ||
      text.includes('great') || text.includes('excellent') || text.includes('i hear')) {
    return { type: 'supportive', pattern: 'helping' }
  }

  // Analytical/Question - Investigating, questioning, exploring
  if (text.includes('why') || text.includes('how') || text.includes('what') ||
      text.includes('analyze') || text.includes('think about') || text.includes('consider') ||
      text.includes('tell me') || text.includes('explain') || text.includes('curious') ||
      text.includes('explore') || text.includes('understand more')) {
    return { type: 'analytical', pattern: 'analytical' }
  }

  // Challenge/Push - Questioning assumptions, pushing boundaries
  if (text.includes('but') || text.includes('however') || text.includes('what if') ||
      text.includes('challenge') || text.includes('push') || text.includes('difficult') ||
      text.includes('disagree') || text.includes('alternative') || text.includes('consider that')) {
    return { type: 'challenging', pattern: 'building' }
  }

  // Listen/Neutral - Observing, listening, continuing
  return { type: 'listening', pattern: 'patience' }
}

// Speakers that should show all text at once (no progression)
const NARRATOR_SPEAKERS = ['Narrator', 'SCENE', null, undefined, '']

export function MinimalGameInterfaceShadcn() {
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

    // Strip outer quotes from dialogue
    let text = game.messages[0].text.trim()
    text = text.replace(/^["']|["']$/g, '')

    // Smart chunking: split at sentence boundaries only
    // This ensures grammatical coherence while managing cognitive load
    // CALIBRATION: Tuned for max-w-xl (576px ≈ 65 chars/line)
    const MAX_CHUNK_SIZE = 170  // About 2-3 sentences at 65ch width
    const MIN_CHUNK_SIZE = 80   // At least one full sentence

    // Split by sentence-ending punctuation, keeping the punctuation
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
    const conversationalChunks: string[] = []
    let currentChunk = ''

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim()

      // If current chunk + new sentence is under max, combine them
      if (currentChunk && (currentChunk.length + trimmedSentence.length + 1) <= MAX_CHUNK_SIZE) {
        currentChunk = currentChunk + ' ' + trimmedSentence
      } else if (currentChunk) {
        // Save current chunk and start new one
        conversationalChunks.push(currentChunk)
        currentChunk = trimmedSentence
      } else {
        // First sentence
        currentChunk = trimmedSentence
      }

      // If chunk is getting long, save it
      if (currentChunk.length >= MAX_CHUNK_SIZE) {
        conversationalChunks.push(currentChunk)
        currentChunk = ''
      }
    }

    // Add any remaining chunk
    if (currentChunk) {
      conversationalChunks.push(currentChunk)
    }

    return conversationalChunks.length > 0 ? conversationalChunks : [text]
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
  const getCurrentPlatform = (): "healthcare" | "technology" | "engineering" | "sustainability" => {
    if (!game.messages || game.messages.length === 0) return 'technology'
    const text = game.messages[0].text
    if (text.includes('Platform 1') || text.includes('Care Line')) return 'healthcare'
    if (text.includes('Platform 3') || text.includes('Builder')) return 'engineering'
    if (text.includes('Platform 7') || text.includes('Data Stream')) return 'technology'
    if (text.includes('Platform 9') || text.includes('Growing Garden')) return 'sustainability'
    return 'technology'
  }

  // Get character mapping for GameCard
  const getCurrentCharacter = (): "samuel" | "maya" | "devon" | "jordan" | "you" => {
    const character = getCharacterFromSpeaker(game.messages?.[0]?.speaker)
    if (character === 'samuel') return 'samuel'
    if (character === 'maya') return 'maya'
    if (character === 'devon') return 'devon'
    if (character === 'jordan') return 'jordan'
    return 'you'
  }

  // Show intro screen if not started
  if (!game.hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-4xl mx-auto">
          <ScrollArea className="h-screen">
            <div className="py-8">

              {/* Header */}
              <div className="text-center mb-8">
                <Typography variant="h1" className="mb-2 text-primary">
                  Grand Central Terminus
                </Typography>
                <Typography variant="large" color="muted">
                  Birmingham Career Exploration
                </Typography>
              </div>

              {/* Story Introduction */}
              <GameCard
                variant="narration"
                platform={getCurrentPlatform()}
                className="mb-8 max-w-xl mx-auto"
                glow
                animated
              >
                <GameCardHeader>
                  <div className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3 text-center">
                    INT. GRAND CENTRAL TERMINUS - NIGHT
                  </div>
                </GameCardHeader>
                <GameCardContent>
                  <div className="space-y-4">
                    {parseTextWithHierarchy("Grand Central Terminus isn't on any map, but here you are.\n\nThe letter in your hand reads: \"Platform 7, Midnight. Your future awaits.\"\n\nAround you, platforms stretch into the distance, each humming with different energy.")}
                  </div>
                </GameCardContent>
              </GameCard>

              {/* Start Button - Minimal style */}
              <div className="flex justify-center">
                <button
                  onClick={game.handleStartGame}
                  className={cn(
                    "px-8 py-4",
                    "text-[18px] font-medium",
                    "text-slate-900 dark:text-slate-100",
                    "bg-white dark:bg-slate-800",
                    "hover:bg-slate-50 dark:hover:bg-slate-700",
                    "rounded-xl",
                    "shadow-sm hover:shadow-md",
                    "transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                  )}
                >
                  Begin New Journey
                </button>
              </div>

            </div>
          </ScrollArea>
        </div>
      </div>
    )
  }

  // Show main game interface - Clean Apple style
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4">
        <div className="py-12">

          {/* Header - Minimal */}
          <div className="text-center mb-12">
            <h1 className="text-[28px] font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Grand Central Terminus
            </h1>
            <p className="text-[15px] text-slate-500 dark:text-slate-400">
              Birmingham Career Exploration
            </p>
          </div>

            {/* Clean Progressive Dialogue System - Minimal Apple Style */}
            {game.messages && game.messages.length > 0 && (
              <div className="mb-6 max-w-xl mx-auto">
                {/* Single clean container */}
                <div className={cn(
                  "bg-white dark:bg-slate-900",
                  "rounded-xl",
                  "p-4",
                  "shadow-sm",
                  "animate-in fade-in duration-300"
                )}>
                  {/* Speaker name - subtle and once */}
                  {currentSpeaker !== 'Narrator' && (
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                      {currentSpeaker}
                    </div>
                  )}

                  {/* Dialogue text with better line height and max width */}
                  <div className={cn(
                    "text-[17px] leading-[1.7]",
                    "text-slate-900 dark:text-slate-100",
                    "max-w-[65ch]",
                    currentSpeaker === 'Narrator' && "text-center italic text-slate-600 dark:text-slate-400"
                  )}>
                    {isDialogue ? (
                      // Progressive dialogue: clean text only
                      chunks[chunkIndex] || chunks[0] || game.messages[0].text
                    ) : (
                      // Narrator: show all text at once
                      parseTextWithHierarchy(game.messages[0].text)
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Clean Controls: Continue button OR choices */}
            <div className="max-w-xl mx-auto">
              {/* Show Continue button for dialogue - matches choice style exactly */}
              {isDialogue && (!isLastChunk || (isLastChunk && !hasChoices)) && chunks.length > 1 && (
                <div className="mb-6">
                  <button
                    onClick={handleContinue}
                    className={cn(
                      // Identical to choice buttons
                      "w-full text-left",
                      "p-4",
                      "rounded-xl",
                      "transition-all duration-200 ease-out",
                      "text-[17px] leading-relaxed",
                      "text-slate-900 dark:text-slate-100",
                      "hover:bg-slate-50 dark:hover:bg-slate-800",
                      "active:bg-slate-100 dark:active:bg-slate-700",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
                      "flex items-center justify-between group"
                    )}
                  >
                    <span>Continue</span>
                    <ChevronRight className={cn(
                      "w-5 h-5 text-slate-300 dark:text-slate-600",
                      "transition-all duration-200",
                      "group-hover:text-slate-500 dark:group-hover:text-slate-400",
                      "group-hover:translate-x-0.5"
                    )} />
                  </button>
                </div>
              )}

              {/* Show choices when narrator scene OR last dialogue chunk */}
              {(isNarrator || (isDialogue && isLastChunk)) && hasChoices && (
                <GameChoiceGroup>
                  {game.choices.map((choice, index) => {
                    const { type, pattern } = categorizeChoice(choice.text)
                    return (
                      <GameChoice
                        key={index}
                        choice={{
                          text: choice.text,
                          pattern: pattern
                        }}
                        onSelect={() => {
                          setSelectedChoiceIndex(index)
                          setTimeout(() => {
                            game.handleChoice(choice)
                            setSelectedChoiceIndex(null)
                          }, 300)
                        }}
                        isSelected={selectedChoiceIndex === index}
                        loading={selectedChoiceIndex === index}
                        index={index}
                        animated
                        disabled={selectedChoiceIndex !== null && selectedChoiceIndex !== index}
                      />
                    )
                  })}
                </GameChoiceGroup>
              )}
            </div>

        </div>
      </div>
    </div>
  )
}

export default MinimalGameInterfaceShadcn