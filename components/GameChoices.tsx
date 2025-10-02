"use client"

import { memo } from 'react'
import { Button } from '@/components/ui/button'

interface Choice {
  text: string
  next?: string
  consequence?: string
  pattern?: string
}

interface GameChoicesProps {
  choices: Choice[]
  isProcessing: boolean
  onChoice: (choice: Choice) => void
}

// Memoized choice button component
const ChoiceButton = memo(({ choice, index, onChoice, isProcessing }: {
  choice: Choice
  index: number
  onChoice: (choice: Choice) => void
  isProcessing: boolean
}) => (
  <Button
    key={index}
    onClick={() => onChoice(choice)}
    disabled={isProcessing}
    variant="default"
    size="lg"
    className="w-full min-h-[44px] text-base"
  >
    {choice.text}
  </Button>
))

ChoiceButton.displayName = 'ChoiceButton'

/**
 * Game Choices Component
 * Displays choice buttons with optimized rendering
 */
export const GameChoices = memo(({ choices, isProcessing, onChoice }: GameChoicesProps) => {
  if (!choices || choices.length === 0) {
    return null
  }

  return (
    <div className="apple-choices-container apple-animate-slide-in">
      {choices.map((choice, index) => (
        <ChoiceButton
          key={index}
          choice={choice}
          index={index}
          onChoice={onChoice}
          isProcessing={isProcessing}
        />
      ))}
    </div>
  )
})

GameChoices.displayName = 'GameChoices'
