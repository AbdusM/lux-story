"use client"

import { memo } from 'react'

interface GameHeaderProps {
  visualAdjustments: Record<string, any>
}

/**
 * Game Header Component
 * Displays the game title and subtitle with Apple design principles
 */
export const GameHeader = memo(({ visualAdjustments }: GameHeaderProps) => {
  return (
    <div className="apple-header" style={visualAdjustments}>
      <div className="apple-text-headline">Grand Central Terminus</div>
      <div className="apple-text-caption">Birmingham Career Exploration</div>
    </div>
  )
})

GameHeader.displayName = 'GameHeader'
