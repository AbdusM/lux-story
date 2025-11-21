"use client"

import { memo } from 'react'
import { Button } from '@/components/ui/button'

interface Choice {
  text: string
  next?: string
  consequence?: string
  pattern?: string // Used for grouping
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
    variant="ghost"
    className="w-full min-h-[48px] px-6 py-3 text-base font-medium text-left whitespace-normal border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 hover:shadow-lg active:scale-[0.98] transition-colors duration-150 ease-out rounded-lg justify-start"
  >
    {choice.text}
  </Button>
))

ChoiceButton.displayName = 'ChoiceButton'

/**
 * Group choices by pattern/domain for better organization
 */
const groupChoices = (choices: Choice[]) => {
  const groups: Record<string, Choice[]> = {
    'Career Paths': [],
    'Exploration': [],
    'Other': []
  }

  choices.forEach(choice => {
    // Heuristic grouping based on pattern or text content
    if (choice.pattern === 'building' || choice.pattern === 'helping' || choice.pattern === 'analytical') {
      groups['Career Paths'].push(choice)
    } else if (choice.pattern === 'exploring' || choice.pattern === 'patience') {
      groups['Exploration'].push(choice)
    } else {
      groups['Other'].push(choice)
    }
  })

  return groups
}

/**
 * Game Choices Component
 * Displays choice buttons with optimized rendering and optional grouping
 */
export const GameChoices = memo(({ choices, isProcessing, onChoice }: GameChoicesProps) => {
  if (!choices || choices.length === 0) {
    return null
  }

  // If we have many choices (e.g., Samuel's Hub), use grouping
  // Currently simplistic, can be enhanced with metadata from the graph later
  const showGrouping = choices.length > 4

  if (showGrouping) {
    const groups = groupChoices(choices)
    const nonEmptyGroups = Object.entries(groups).filter(([_, groupChoices]) => groupChoices.length > 0)

    return (
      <div className="space-y-6 apple-animate-slide-in">
        {nonEmptyGroups.map(([title, groupChoices]) => (
          <div key={title} className="space-y-2">
            {title !== 'Other' && (
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
                {title}
              </h4>
            )}
            <div className="space-y-2">
              {groupChoices.map((choice, index) => (
                <ChoiceButton
                  key={`${title}-${index}`}
                  choice={choice}
                  index={index}
                  onChoice={onChoice}
                  isProcessing={isProcessing}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2 apple-animate-slide-in">
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