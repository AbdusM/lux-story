"use client"

import { useEffect, useMemo } from 'react'
import { getGrandCentralState } from '@/lib/grand-central-state'
import { useGameStore } from '@/lib/game-store'

// Extract character ID from scene ID (e.g., "samuel_introduction" -> "samuel")
function getCharacterFromScene(sceneId: string | null): string {
  if (!sceneId) return 'samuel'
  const match = sceneId.match(/^(samuel|maya|devon|jordan|marcus|kai|tess|yaquin)/i)
  return match ? match[1].toLowerCase() : 'samuel'
}

export function EnvironmentalEffects() {
  const grandCentralState = useMemo(() => getGrandCentralState(), [])
  const currentSceneId = useGameStore((state) => state.currentSceneId)
  
  useEffect(() => {
    const updateEnvironmentalClasses = () => {
      const state = grandCentralState.getState()
      const body = document.body
      
      // Clear previous environmental classes
      body.className = body.className.replace(/platform-warmth-\S+/g, '')
      body.className = body.className.replace(/time-speed-\S+/g, '')
      body.className = body.className.replace(/resonance-level-\S+/g, '')
      body.className = body.className.replace(/\S+-environment/g, '')
      body.className = body.className.replace(/\S+-high/g, '')
      
      // Platform warmth effects
      const platforms = state.platforms || {}
      let dominantWarmth = 0
      let dominantPlatform = ''
      
      Object.entries(platforms).forEach(([key, platform]) => {
        if (platform?.discovered && platform.warmth > dominantWarmth) {
          dominantWarmth = platform.warmth
          dominantPlatform = key
        }
      })
      
      // Apply warmth class
      const warmthClass = `platform-warmth-${Math.round(dominantWarmth)}`
      body.classList.add(warmthClass)
      
      // Time speed effects
      const timeSpeed = state.time?.speed || 1.0
      const timeClass = `time-speed-${timeSpeed.toString().replace('.', '-')}`
      body.classList.add(timeClass)
      
      // Pattern-based environmental changes
      const patterns = state.patterns || {}
      const dominantPattern = Object.entries(patterns).reduce(
        (max, [key, value]) => value > max.value ? { key, value } : max,
        { key: '', value: 0 }
      )
      
      if (dominantPattern.value > 5) {
        body.classList.add(`${dominantPattern.key}-environment`)
      }
      
      // Career value manifestations
      const careerValues = state.careerValues || {}
      Object.entries(careerValues).forEach(([key, value]) => {
        if (value > 5) {
          const className = key.replace(/([A-Z])/g, '-$1').toLowerCase()
          body.classList.add(`${className}-high`)
        }
      })
      
      // Platform resonance
      if (dominantPlatform) {
        const resonance = platforms[dominantPlatform as keyof typeof platforms].resonance
        const resonanceClass = `resonance-level-${Math.min(10, Math.round(resonance))}`
        body.classList.add(resonanceClass)
      }
      
      // Special states
      if (state.time?.stopped) {
        body.classList.add('quiet-hour-active')
      } else {
        body.classList.remove('quiet-hour-active')
      }
      
      // Station breathing effect
      if (patterns.patience > 7) {
        body.classList.add('station-breathing')
      }
      
      // Shadow effects based on helping
      if (patterns.helping > patterns.rushing) {
        body.classList.add('shadow-warm')
        body.classList.remove('shadow-cold')
      } else if (patterns.rushing > patterns.helping) {
        body.classList.add('shadow-cold')
        body.classList.remove('shadow-warm')
      }

      // Environmental particles
      if (patterns.helping > 6) {
        body.classList.add('particles-helping')
      } else if (patterns.building > 6) {
        body.classList.add('particles-building')
      }

      // ═══════════════════════════════════════════════════════════════
      // FOX THEATRE ATMOSPHERIC EFFECTS
      // ═══════════════════════════════════════════════════════════════

      // Clear previous Fox Theatre classes
      body.className = body.className.replace(/character-\S+/g, '')
      body.className = body.className.replace(/theatre-\S+/g, '')
      body.classList.remove('character-atmosphere')

      // Character atmosphere - vignette color based on current character
      const characterId = getCharacterFromScene(currentSceneId)
      body.classList.add('character-atmosphere')
      body.classList.add(`character-${characterId}`)

      // Theatre stars - always on for prominent Fox Theatre effect
      body.classList.add('theatre-stars')

      // Theatre clouds - activate when not rushing (contemplative mood)
      if (patterns.rushing < 5) {
        body.classList.add('theatre-clouds')
      }
      
      // Object responsiveness
      if (patterns.building > 4) {
        body.classList.add('objects-responsive', 'building-nearby')
      } else if (patterns.exploring > 4) {
        body.classList.add('objects-responsive', 'growth-minded')
      }
    }
    
    // Update on state changes
    const interval = setInterval(updateEnvironmentalClasses, 1000)
    updateEnvironmentalClasses() // Initial update

    return () => clearInterval(interval)
  }, [grandCentralState, currentSceneId])
  
  return null // This component only manages body classes
}