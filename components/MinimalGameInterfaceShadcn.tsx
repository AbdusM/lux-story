/**
 * MINIMAL Game Interface - Shadcn Version
 * Drop-in replacement using shadcn components instead of apple-design-system.css
 */

"use client"

import { useState, useEffect, useMemo } from 'react'
import { useSimpleGame } from '@/hooks/useSimpleGame'
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

    // Detect scene headings (INT./EXT. format)
    if (trimmedSection.match(/^(INT\.|EXT\.)/i)) {
      return (
        <div key={index} className="mb-4">
          <Typography
            variant="h4"
            font="mono"
            className="uppercase tracking-wider text-amber-700 dark:text-amber-300 text-center"
          >
            {trimmedSection}
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

// Professional choice categorization with consistent emotional mapping
function categorizeChoice(choiceText: string | undefined): { type: string; icon: string; pattern: "helping" | "analytical" | "building" | "patience" | "exploring" } {
  if (!choiceText || typeof choiceText !== 'string') {
    return { type: 'neutral', icon: '💭', pattern: 'exploring' }
  }
  const text = choiceText.toLowerCase()

  // Supportive/Agreeable (Green) - Encouraging, validating, agreeing
  if (text.includes('feel') || text.includes('understand') || text.includes('that must') ||
      text.includes('sounds like') || text.includes('help') || text.includes('support') ||
      text.includes('together') || text.includes('believe') || text.includes('validate') ||
      text.includes('great') || text.includes('excellent') || text.includes('i hear')) {
    return { type: 'supportive', icon: '🤝', pattern: 'helping' }
  }

  // Analytical/Question (Blue) - Investigating, questioning, exploring
  if (text.includes('why') || text.includes('how') || text.includes('what') ||
      text.includes('analyze') || text.includes('think about') || text.includes('consider') ||
      text.includes('tell me') || text.includes('explain') || text.includes('curious') ||
      text.includes('explore') || text.includes('understand more')) {
    return { type: 'analytical', icon: '🧠', pattern: 'analytical' }
  }

  // Challenge/Push (Orange) - Questioning assumptions, pushing boundaries
  if (text.includes('but') || text.includes('however') || text.includes('what if') ||
      text.includes('challenge') || text.includes('push') || text.includes('difficult') ||
      text.includes('disagree') || text.includes('alternative') || text.includes('consider that')) {
    return { type: 'challenging', icon: '⚡', pattern: 'building' }
  }

  // Listen/Neutral (Gray) - Observing, listening, continuing
  return { type: 'listening', icon: '👂', pattern: 'patience' }
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
                className="mb-8 max-w-2xl mx-auto"
                glow
                animated
              >
                <GameCardHeader>
                  <Typography
                    variant="h4"
                    font="mono"
                    className="uppercase tracking-wider text-amber-700 dark:text-amber-300 text-center"
                  >
                    INT. GRAND CENTRAL TERMINUS - NIGHT
                  </Typography>
                </GameCardHeader>
                <GameCardContent>
                  <div className="space-y-4">
                    {parseTextWithHierarchy("Grand Central Terminus isn't on any map, but here you are.\n\nThe letter in your hand reads: \"Platform 7, Midnight. Your future awaits.\"\n\nAround you, platforms stretch into the distance, each humming with different energy.")}
                  </div>
                </GameCardContent>
              </GameCard>

              {/* Start Button */}
              <div className="flex justify-center">
                <Button
                  onClick={game.handleStartGame}
                  size="lg"
                  className="font-semibold px-8 py-4 text-lg"
                >
                  Begin New Journey
                </Button>
              </div>

            </div>
          </ScrollArea>
        </div>
      </div>
    )
  }

  // Show main game interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <ScrollArea className="h-screen">
          <div className="py-8">

            {/* Header */}
            <div className="text-center mb-8">
              <Typography variant="h2" className="mb-2 text-primary">
                Grand Central Terminus
              </Typography>
              <Typography variant="large" color="muted">
                Birmingham Career Exploration
              </Typography>
            </div>

            {/* Clean Progressive Dialogue System */}
            {game.messages && game.messages.length > 0 && (
              <GameCard
                variant={isDialogue ? "dialogue" : "narration"}
                platform={getCurrentPlatform()}
                character={getCurrentCharacter()}
                className="mb-8 max-w-2xl mx-auto"
                glow={isDialogue}
                animated
              >
                <GameCardHeader className={cn(
                  !isDialogue && "sr-only" // Hide header for narrator
                )}>
                  <Typography variant="large" font="mono" className="uppercase tracking-wider">
                    {currentSpeaker}
                  </Typography>
                </GameCardHeader>

                <GameCardContent className={cn(
                  isDialogue ? "pt-0" : "pt-6"
                )}>
                  <div className="space-y-4">
                    {/* THE CORE LOGIC: Show one chunk for dialogue, all for narrator */}
                    {isDialogue ? (
                      // Progressive dialogue: show only current chunk
                      <GameCard variant="dialogue" className="border-0 shadow-none bg-transparent">
                        <GameCardContent className="p-0">
                          <Typography variant="dialogue" className="leading-relaxed">
                            {chunks[chunkIndex] || chunks[0] || game.messages[0].text}
                          </Typography>
                        </GameCardContent>
                      </GameCard>
                    ) : (
                      // Narrator: show all text at once using the existing parser
                      parseTextWithHierarchy(game.messages[0].text)
                    )}
                  </div>
                </GameCardContent>
              </GameCard>
            )}

            <Separator className="my-6" />

            {/* Clean Controls: Continue button OR choices */}
            <div className="max-w-2xl mx-auto">
              {/* Show Continue button for dialogue with critical edge case handling */}
              {isDialogue && (!isLastChunk || (isLastChunk && !hasChoices)) && chunks.length > 1 && (
                <div className="flex justify-center mb-6">
                  <Button
                    onClick={handleContinue}
                    variant="outline"
                    size="lg"
                    className="w-full max-w-sm"
                  >
                    Continue →
                  </Button>
                </div>
              )}

              {/* Show choices when narrator scene OR last dialogue chunk */}
              {(isNarrator || (isDialogue && isLastChunk)) && hasChoices && (
                <GameChoiceGroup>
                  {game.choices.map((choice, index) => {
                    const { type, icon, pattern } = categorizeChoice(choice.text)
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
                          }, 400)
                        }}
                        isSelected={selectedChoiceIndex === index}
                        index={index}
                        variant={selectedChoiceIndex === index ? 'selected' :
                                selectedChoiceIndex !== null ? 'disabled' : 'default'}
                        pattern={pattern}
                        animated
                        showIcon
                        className={cn(
                          selectedChoiceIndex !== null && selectedChoiceIndex !== index && "opacity-50"
                        )}
                      />
                    )
                  })}
                </GameChoiceGroup>
              )}
            </div>

          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default MinimalGameInterfaceShadcn