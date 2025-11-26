"use client"

/**
 * Dialogue Style Comparison Test
 * Compare literary prose vs game-style dialogue
 */

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CharacterAvatar } from '@/components/CharacterAvatar'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { motion } from 'framer-motion'
import { cn as _cn } from '@/lib/utils'

type DialogueStyle = 'literary' | 'game' | 'ace-attorney'

const literaryVersion = {
  text: `*He's staring at his hands, holding them perfectly still in the air. His breathing is shallow, controlled.*

Seventy-two beats per minute. Flow rate 4.5 liters. Pressure stable.

*He blinks, looking at you.*

Don't bump the table. Please.`,
  emotion: 'focused_tense' as const,
  wordCount: 140
}

const gameVersion = {
  text: `Seventy-two beats. Flow rate 4.5 liters. Pressure stable.

*He snaps his eyes to you*

Don't. Bump. The table.`,
  emotion: 'focused_tense' as const,
  interaction: 'shake' as const,
  wordCount: 40
}

const aceAttorneyVersion = {
  beats: [
    { text: "*Marcus's hands are frozen mid-air*", interaction: 'jitter' as const },
    { text: "Seventy-two beats per minute...", emotion: 'focused' as const },
    { text: "Flow rate 4.5 liters. Pressure stable.", emotion: 'focused' as const },
    { text: "Don't bump the table.", emotion: 'warning' as const, interaction: 'shake' as const }
  ],
  currentBeat: 0
}

const choices = [
  { text: "*Step back carefully* I won't touch anything.", emoji: "🤚" },
  { text: "What are you seeing right now?", emoji: "🤔" },
  { text: "You look like you're holding something invisible.", emoji: "👀" }
]

export default function DialogueStyleTest() {
  const [style, setStyle] = useState<DialogueStyle>('literary')
  const [showChoices, setShowChoices] = useState(false)
  const [aceAttorneyBeat, setAceAttorneyBeat] = useState(0)
  const [startTime] = useState(Date.now())
  const [timeToChoice, setTimeToChoice] = useState<number | null>(null)

  const handleDialogueComplete = () => {
    setShowChoices(true)
    if (!timeToChoice) {
      setTimeToChoice(Date.now() - startTime)
    }
  }

  const handleNextBeat = () => {
    if (aceAttorneyBeat < aceAttorneyVersion.beats.length - 1) {
      setAceAttorneyBeat(prev => prev + 1)
    } else {
      handleDialogueComplete()
    }
  }

  const resetTest = () => {
    setShowChoices(false)
    setTimeToChoice(null)
    setAceAttorneyBeat(0)
  }

  const renderDialogue = () => {
    switch (style) {
      case 'literary':
        return (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CharacterAvatar characterName="Marcus Chen" size="md" />
              <div className="flex-1">
                <div className="text-xs font-medium text-slate-600 mb-1">Marcus Chen</div>
                <RichTextRenderer
                  text={literaryVersion.text}
                  effects={{ mode: 'staggered' }}
                  onComplete={handleDialogueComplete}
                  clickToComplete={true}
                />
              </div>
            </div>
            <div className="text-xs text-slate-500 italic">
              📊 {literaryVersion.wordCount} words before choice
            </div>
          </div>
        )

      case 'game':
        return (
          <div className="space-y-4">
            <motion.div
              className="flex items-start gap-3"
              animate={gameVersion.interaction === 'shake' ? {
                x: [0, -2, 2, -2, 2, 0],
                transition: { duration: 0.5, repeat: 2 }
              } : {}}
            >
              <CharacterAvatar characterName="Marcus Chen" size="md" />
              <div className="flex-1">
                <div className="text-xs font-medium text-slate-600 mb-1">Marcus Chen</div>
                <RichTextRenderer
                  text={gameVersion.text}
                  effects={{ mode: 'staggered' }}
                  onComplete={handleDialogueComplete}
                  clickToComplete={true}
                />
              </div>
            </motion.div>
            <div className="text-xs text-slate-500 italic">
              📊 {gameVersion.wordCount} words before choice (71% shorter) |
              ✨ Avatar + animation show emotion
            </div>
          </div>
        )

      case 'ace-attorney':
        const currentBeatData = aceAttorneyVersion.beats[aceAttorneyBeat]
        return (
          <div className="space-y-4">
            <motion.div
              key={aceAttorneyBeat}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                x: currentBeatData.interaction === 'shake' ? [0, -2, 2, -2, 2, 0] : 0,
                scale: currentBeatData.interaction === 'jitter' ? [1, 1.02, 0.98, 1.02, 0.98, 1] : 1
              }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3"
            >
              <CharacterAvatar characterName="Marcus Chen" size="md" />
              <div className="flex-1">
                <div className="text-xs font-medium text-slate-600 mb-1">Marcus Chen</div>
                <div className="text-slate-700 leading-relaxed">
                  {currentBeatData.text}
                </div>
              </div>
            </motion.div>

            {aceAttorneyBeat < aceAttorneyVersion.beats.length - 1 ? (
              <Button
                onClick={handleNextBeat}
                variant="outline"
                className="w-full animate-pulse"
              >
                ▼ Continue (Beat {aceAttorneyBeat + 1}/{aceAttorneyVersion.beats.length})
              </Button>
            ) : (
              <Button
                onClick={handleDialogueComplete}
                variant="outline"
                className="w-full"
              >
                Show Choices
              </Button>
            )}

            <div className="text-xs text-slate-500 italic">
              📊 {aceAttorneyVersion.beats.length} dramatic beats |
              ✨ Player controls pacing
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Dialogue Style Comparison Test</CardTitle>
            <p className="text-sm text-slate-600">
              Compare different dialogue approaches: Literary prose vs Game-style vs Ace Attorney
            </p>
          </CardHeader>
        </Card>

        {/* Style Selector */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="text-sm font-medium text-slate-700 mb-3">Choose a style to test:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  onClick={() => { setStyle('literary'); resetTest(); }}
                  variant={style === 'literary' ? 'default' : 'outline'}
                  className="h-auto py-4 flex flex-col items-start"
                >
                  <div className="font-bold">📚 Literary</div>
                  <div className="text-xs opacity-70 text-left">
                    Descriptive prose with narration
                  </div>
                </Button>

                <Button
                  onClick={() => { setStyle('game'); resetTest(); }}
                  variant={style === 'game' ? 'default' : 'outline'}
                  className="h-auto py-4 flex flex-col items-start"
                >
                  <div className="font-bold">🎮 Game-Style</div>
                  <div className="text-xs opacity-70 text-left">
                    Punchy dialogue + visual effects
                  </div>
                </Button>

                <Button
                  onClick={() => { setStyle('ace-attorney'); resetTest(); }}
                  variant={style === 'ace-attorney' ? 'default' : 'outline'}
                  className="h-auto py-4 flex flex-col items-start"
                >
                  <div className="font-bold">⚖️ Ace Attorney</div>
                  <div className="text-xs opacity-70 text-left">
                    Click-through dramatic beats
                  </div>
                </Button>
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
            {renderDialogue()}
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
                      className="w-full h-auto py-4 justify-start text-left"
                      onClick={() => alert(`Choice selected! Time to choice: ${timeToChoice}ms`)}
                    >
                      <span className="mr-3 text-xl">{choice.emoji}</span>
                      <span>{choice.text}</span>
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

        {/* Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Design Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <strong className="text-slate-700">📚 Literary Style:</strong>
              <ul className="mt-2 space-y-1 text-slate-600 ml-4">
                <li>• 140 words of reading before choice</li>
                <li>• Immersive, descriptive, world-building</li>
                <li>• Slower pacing, more passive experience</li>
                <li>• Best for: Story-focused players</li>
              </ul>
            </div>

            <div>
              <strong className="text-slate-700">🎮 Game Style:</strong>
              <ul className="mt-2 space-y-1 text-slate-600 ml-4">
                <li>• 40 words (71% reduction)</li>
                <li>• Visual effects carry emotional weight</li>
                <li>• Faster pacing, more active engagement</li>
                <li>• Best for: Mobile, replayability, younger audience</li>
              </ul>
            </div>

            <div>
              <strong className="text-slate-700">⚖️ Ace Attorney:</strong>
              <ul className="mt-2 space-y-1 text-slate-600 ml-4">
                <li>• Player controls reveal rhythm</li>
                <li>• Each beat has visual payoff</li>
                <li>• Dramatic tension builds naturally</li>
                <li>• Best for: Key dramatic moments</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Reset */}
        <div className="text-center">
          <Button onClick={resetTest} variant="outline">
            🔄 Reset Test
          </Button>
        </div>
      </div>
    </div>
  )
}
