"use client"

import { useEffect } from 'react'
import { GameStateManager } from '@/lib/game-state-manager'

export function EnvironmentalEffects() {

  useEffect(() => {
    const updateEnvironmentalClasses = () => {
      // Use loadGameState as fallback since we are outside React context tree root
      // This is a "Game Juice" component that runs on interval, so reading LS is acceptable
      const state = GameStateManager.loadGameState()
      if (!state) return

      const body = document.body

      // Clear previous environmental classes
      // Using a safer regex approach for class removal
      body.className = body.className
        .split(' ')
        .filter(c => !c.match(/^(platform-|time-|resonance-|.*-environment|.*-high|character-|theatre-|station-|shadow-|particles-|objects-)/))
        .join(' ')

      // Note: State accessors changed from GrandCentralState structure to GameState structure
      // Many environmental features (Time Speed, Platforms) were specific to GrandCentralState
      // and are not fully present in the core GameState.
      // We will map what we can (Patterns, Trust) and stub the rest to prevent crashes.

      // Map Patterns
      const patterns = state.patterns || {}
      const dominantPatternKey = Object.entries(patterns).reduce((a, b) => a[1] > b[1] ? a : b)[0]
      const dominantPatternValue = patterns[dominantPatternKey as keyof typeof patterns] || 0

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
      // Derive active character from relationships (highest trust level)
      // GameState uses Map, so we iterate differently
      let activeCharacter = 'samuel' // Default
      let highestTrust = 0

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      state.characters.forEach((char: any) => {
        if (char.trust > highestTrust) {
          highestTrust = char.trust
          activeCharacter = char.characterId
        }
      })

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

    // Update on state changes - now polling for simplicity, ideally would subscribe
    // But since this is purely cosmetic CSS on body, polling 1s is fine and consistent with previous
    const interval = setInterval(updateEnvironmentalClasses, 1000)
    updateEnvironmentalClasses() // Initial update

    return () => clearInterval(interval)
  }, [])

  return null // This component only manages body classes
}