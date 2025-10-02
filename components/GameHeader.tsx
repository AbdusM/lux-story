"use client"

import { memo } from 'react'
import React from 'react'

interface GameHeaderProps {
  visualAdjustments: { style: React.CSSProperties; className: string }
}

/**
 * Game Header Component
 * Displays the game title and subtitle with Apple design principles
 */
export const GameHeader = memo(({ visualAdjustments }: GameHeaderProps) => {
  return (
    <div className="apple-header" style={visualAdjustments.style}>
      <div className="apple-text-headline">Grand Central Terminus</div>
      <div className="apple-text-caption">Birmingham Career Exploration</div>
    </div>
  )
})

GameHeader.displayName = 'GameHeader'
