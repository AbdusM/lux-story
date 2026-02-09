"use client"

import { useEffect } from 'react'
import { CharacterState, GameState } from '@/lib/character-state'

export function EnvironmentalEffects({ gameState }: { gameState: GameState | null }) {

  useEffect(() => {
    if (!gameState) return

    const updateEnvironmentalClasses = () => {
      const body = document.body

      // Clear previous environmental classes
      // Using a regex approach for class removal
      body.className = body.className
        .split(' ')
        .filter(c => !c.match(/^(platform-|time-|resonance-|.*-environment|.*-high|character-|theatre-|station-|shadow-|particles-|objects-)/))
        .join(' ')

      // Map Patterns
      const patterns = gameState.patterns || {}
      // Safe logic for empty patterns
      const dominantPatternKey = Object.keys(patterns).length > 0
        ? Object.entries(patterns).reduce((a, b) => a[1] > b[1] ? a : b)[0]
        : null

      const dominantPatternValue = dominantPatternKey ? (patterns[dominantPatternKey as keyof typeof patterns] || 0) : 0

      if (dominantPatternValue > 5) {
        body.classList.add(`${dominantPatternKey}-environment`)
      }

      // Station breathing effect (Patience)
      if (patterns.patience > 7) {
        body.classList.add('station-breathing')
      }

      // Shadow effects based on helping
      if (patterns.helping > 5) {
        body.classList.add('shadow-warm')
      }

      // Fox Theatre character atmosphere
      let activeCharacter = 'samuel' // Default
      let highestTrust = 0

      // Canonical shape is Map<string, CharacterState>. Keep a small guard for legacy arrays.
      const charValues: CharacterState[] =
        gameState.characters instanceof Map
          ? Array.from(gameState.characters.values())
          : Array.isArray(gameState.characters)
            ? (gameState.characters as unknown as CharacterState[])
            : []

      for (const char of charValues) {
        if (char.trust > highestTrust) {
          highestTrust = char.trust
          activeCharacter = char.characterId
        }
      }

      body.classList.add('character-atmosphere')
      body.classList.add(`character-${activeCharacter}`)

      // Environmental particles
      if (patterns.helping > 6) {
        body.classList.add('particles-helping')
      } else if (patterns.building > 6) {
        body.classList.add('particles-building')
      }

      // Object responsiveness
      if (patterns.building > 4) {
        body.classList.add('objects-responsive', 'building-nearby')
      } else if (patterns.exploring > 4) {
        body.classList.add('objects-responsive', 'growth-minded')
      }
    }

    updateEnvironmentalClasses()
  }, [gameState])

  return null // This component only manages body classes
}
