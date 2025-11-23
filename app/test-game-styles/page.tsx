"use client"

/**
 * Game-Style Dialogue Variations Test
 * Compare different approaches to game-style dialogue compression
 */

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CharacterAvatar } from '@/components/CharacterAvatar'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { motion } from 'framer-motion'

type GameStyle = 'pokemon' | 'fireEmblem' | 'persona' | 'hades' | 'disco' | 'original'

const dialogueVariations = {
  // Original literary version for comparison
  original: {
    name: "📚 Original (Literary)",
    text: `*He's staring at his hands, holding them perfectly still in the air. His breathing is shallow, controlled.*

Seventy-two beats per minute. Flow rate 4.5 liters. Pressure stable.

*He blinks, looking at you.*

Don't bump the table. Please.`,
    wordCount: 35,
    description: "Full descriptive prose with narration",
    emotion: 'focused_tense' as const,
    style: "Immersive, literary, slow-paced"
  },

  // Ultra-minimal like Pokémon dialogue
  pokemon: {
    name: "🎮 Pokémon Style",
    text: `Seventy-two beats. Flow rate stable.

...Don't bump the table.`,
    wordCount: 11,
    description: "Ultra-minimal, every word counts",
    emotion: 'focused_tense' as const,
    interaction: 'shake' as const,
    style: "Short, punchy, player fills in the rest"
  },

  // Character-driven like Fire Emblem
  fireEmblem: {
    name: "⚔️ Fire Emblem Style",
    text: `*Eyes locked on invisible controls*

Seventy-two beats... flow stable... pressure holding...

*Sharp glance*

Don't. Move.`,
    wordCount: 17,
    description: "Emotional beats + terse commands",
    emotion: 'focused_tense' as const,
    interaction: 'shake' as const,
    style: "Character voice first, emotion through rhythm"
  },

  // Stylish and personality-driven like Persona
  persona: {
    name: "🎭 Persona Style",
    text: `*Hands frozen mid-air, conducting an invisible symphony of vitals*

"Seventy-two BPM. Flow 4.5L. Pressure stable."

*Locks eyes with you*

"Easy. Don't bump the table."`,
    wordCount: 27,
    description: "Stylish action descriptions + quoted dialogue",
    emotion: 'focused_tense' as const,
    interaction: 'shake' as const,
    style: "Visual metaphors, quoted speech for impact"
  },

  // Fast-paced and flavor-heavy like Hades
  hades: {
    name: "🔱 Hades Style",
    text: `*Marcus, hands steady as steel, eyes tracking numbers you can't see*

Seventy-two beats. Flow rate 4.5. Stable.

*Flicks gaze at you*

Don't. Bump. The table.`,
    wordCount: 26,
    description: "Character name + vivid action + staccato speech",
    emotion: 'focused_tense' as const,
    interaction: 'shake' as const,
    style: "Name drops, punchy descriptors, dramatic pauses"
  },

  // Dense but systemic like Disco Elysium
  disco: {
    name: "🎩 Disco Elysium Style",
    text: `MARCUS — *hands suspended, trembling with precision*

"Seventy-two beats per minute. Flow rate 4.5 liters. Pressure stable."

*His eyes snap to you. Don't test him right now.*

"Don't bump the table. Please."`,
    wordCount: 35,
    description: "All caps name, stage direction, internal voice",
    emotion: 'focused_tense' as const,
    interaction: 'shake' as const,
    style: "Theatrical, narrator comments on choices"
  }
}

const choices = [
  { text: "*Step back carefully* I won't touch anything.", emoji: "🤚", pattern: "patience" },
  { text: "What are you seeing right now?", emoji: "🤔", pattern: "exploring" },
  { text: "You look like you're holding something invisible.", emoji: "👀", pattern: "analytical" }
]

export default function GameStylesTest() {
  const [style, setStyle] = useState<GameStyle>('pokemon')
  const [showChoices, setShowChoices] = useState(false)
  const [timeToChoice, setTimeToChoice] = useState<number | null>(null)
  const [startTime] = useState(Date.now())

  const currentDialogue = dialogueVariations[style]

  const handleDialogueComplete = () => {
    setShowChoices(true)
    if (!timeToChoice) {
      setTimeToChoice(Date.now() - startTime)
    }
  }

  const resetTest = () => {
    setShowChoices(false)
    setTimeToChoice(null)
  }

  const getCompressionPercent = () => {
    const original = dialogueVariations.original.wordCount
    const current = currentDialogue.wordCount
    return Math.round(((original - current) / original) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Game-Style Dialogue Variations</CardTitle>
            <p className="text-sm text-slate-600">
              Compare different game writing approaches - from ultra-minimal to personality-driven
            </p>
          </CardHeader>
        </Card>

        {/* Style Grid */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Object.keys(dialogueVariations) as GameStyle[]).map((key) => {
                const variant = dialogueVariations[key]
                const isSelected = style === key
                return (
                  <Button
                    key={key}
                    onClick={() => { setStyle(key); resetTest(); }}
                    variant={isSelected ? 'default' : 'outline'}
                    className="h-auto py-4 flex flex-col items-start text-left"
                  >
                    <div className="font-bold text-sm mb-1">{variant.name}</div>
                    <div className="text-xs opacity-70">
                      {variant.wordCount} words
                    </div>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Style Info */}
        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">{currentDialogue.name}</h3>
                <span className="text-sm font-medium px-3 py-1 bg-blue-100 rounded-full">
                  {currentDialogue.wordCount} words
                </span>
              </div>
              <p className="text-sm text-slate-700">{currentDialogue.description}</p>
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <span>📊 {getCompressionPercent()}% compression</span>
                <span>🎨 {currentDialogue.style}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dialogue Display */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Marcus Chen's Introduction</CardTitle>
            <p className="text-xs text-slate-500">Platform 4 - Medical Technology</p>
          </CardHeader>
          <CardContent>
            <motion.div
              key={style}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                x: (currentDialogue as any).interaction === 'shake' ? [0, -2, 2, -2, 2, 0] : 0
              }}
              transition={{
                opacity: { duration: 0.3 },
                x: { duration: 0.5, repeat: 2, delay: 1 }
              }}
              className="flex items-start gap-3"
            >
              <CharacterAvatar characterName="Marcus Chen" size="md" />
              <div className="flex-1">
                <div className="text-xs font-medium text-slate-600 mb-1">Marcus Chen</div>
                <RichTextRenderer
                  text={currentDialogue.text}
                  effects={{ mode: 'staggered' }}
                  onComplete={handleDialogueComplete}
                  clickToComplete={true}
                />
              </div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Choices */}
        {showChoices && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {choices.map((choice, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full h-auto py-4 justify-start text-left hover:bg-blue-50"
                      onClick={() => {
                        alert(`Choice: ${choice.pattern}\nTime to choice: ${timeToChoice}ms`)
                      }}
                    >
                      <span className="mr-3 text-xl">{choice.emoji}</span>
                      <div className="flex-1">
                        <div>{choice.text}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          Pattern: {choice.pattern}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>

                {timeToChoice && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm">
                    ⏱️ <strong>Time to choice:</strong> {(timeToChoice / 1000).toFixed(1)}s
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Style Comparison Matrix */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Style Comparison Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              {(Object.keys(dialogueVariations) as GameStyle[]).map((key) => {
                const variant = dialogueVariations[key]
                const compression = Math.round(
                  ((dialogueVariations.original.wordCount - variant.wordCount) /
                   dialogueVariations.original.wordCount) * 100
                )

                return (
                  <div key={key} className="border-l-4 border-blue-400 pl-4 py-2">
                    <div className="font-bold text-slate-700">{variant.name}</div>
                    <div className="text-xs text-slate-600 mt-1">{variant.style}</div>
                    <div className="flex gap-4 mt-2 text-xs">
                      <span className="px-2 py-1 bg-slate-100 rounded">
                        {variant.wordCount} words
                      </span>
                      <span className="px-2 py-1 bg-green-100 rounded">
                        {compression}% compression
                      </span>
                      {(variant as any).interaction && (
                        <span className="px-2 py-1 bg-purple-100 rounded">
                          ✨ Visual effects
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Design Guidance */}
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-lg">💡 Design Guidance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <strong>🎮 Pokémon Style:</strong>
              <p className="text-slate-600 ml-4">Best for: Mobile, fast pacing, maximum replayability. Risk: May feel too sparse for deep emotional moments.</p>
            </div>

            <div>
              <strong>⚔️ Fire Emblem Style:</strong>
              <p className="text-slate-600 ml-4">Best for: Character personality, emotional beats. Balanced compression with voice. Good middle ground.</p>
            </div>

            <div>
              <strong>🎭 Persona Style:</strong>
              <p className="text-slate-600 ml-4">Best for: Stylish moments, visual metaphors. Slightly longer but feels cinematic. Great for key scenes.</p>
            </div>

            <div>
              <strong>🔱 Hades Style:</strong>
              <p className="text-slate-600 ml-4">Best for: Action-heavy scenes, personality in narrator voice. Fast-paced storytelling with flair.</p>
            </div>

            <div>
              <strong>🎩 Disco Elysium Style:</strong>
              <p className="text-slate-600 ml-4">Best for: Complex narratives, internal voice. Longer but information-dense. Every word has mechanical weight.</p>
            </div>
          </CardContent>
        </Card>

        {/* Reset */}
        <div className="text-center pb-8">
          <Button onClick={resetTest} variant="outline" size="lg">
            🔄 Reset Test
          </Button>
        </div>
      </div>
    </div>
  )
}
