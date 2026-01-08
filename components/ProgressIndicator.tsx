"use client"

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '@/lib/game-store'
import { useConstellationData } from '@/hooks/useConstellationData'
import { cn } from '@/lib/utils'
import { springs } from '@/lib/animations'

interface ProgressIndicatorProps {
  className?: string
}

/**
 * ProgressIndicator - Subtle progress visualization
 *
 * Shows overall journey progress based on:
 * - Characters met
 * - Patterns developed
 * - Skills demonstrated
 */
export function ProgressIndicator({ className }: ProgressIndicatorProps) {
  const { characters } = useConstellationData() // Use hook that checks both trust and conversation history
  const patterns = useGameStore((state) => state.patterns)
  const skills = useGameStore((state) => state.skills)
  const visitedScenes = useGameStore((state) => state.visitedScenes)

  const progress = useMemo(() => {
    // Characters met (using hasMet which checks both trust > 0 OR conversation history > 0)
    const charactersMet = characters.filter(c => c.hasMet).length
    const maxCharacters = 9 // Total number of characters in the game

    // Patterns developed (count patterns > 0)
    const patternsActive = Object.values(patterns).filter(p => p > 0).length
    const maxPatterns = 7 // Total patterns

    // Skills demonstrated (count skills > 0)
    const skillsShown = Object.values(skills).filter(s => s > 0).length
    const maxSkills = 12 // Total skill areas

    // Calculate weighted progress
    const characterProgress = charactersMet / maxCharacters
    const patternProgress = patternsActive / maxPatterns
    const skillProgress = skillsShown / maxSkills

    // Weight characters most heavily since that's the core interaction
    const overall = (characterProgress * 0.5) + (patternProgress * 0.3) + (skillProgress * 0.2)

    return {
      charactersMet,
      maxCharacters,
      patternsActive,
      skillsShown,
      scenesVisited: visitedScenes.length,
      overall: Math.round(overall * 100)
    }
  }, [characters, patterns, skills, visitedScenes])

  // Don't show if no progress yet
  if (progress.overall === 0) return null

  return (
    <div className={cn("flex items-center gap-2", className)} title={`Journey Progress: ${progress.overall}%`}>
      {/* Progress ring */}
      <div className="relative w-7 h-7">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
          {/* Background circle */}
          <circle
            cx="16"
            cy="16"
            r="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-slate-200"
          />
          {/* Progress arc - animated with spring */}
          <motion.circle
            cx="16"
            cy="16"
            r="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-amber-500"
            initial={{ strokeDasharray: "0 75.4" }}
            animate={{ strokeDasharray: `${progress.overall * 0.754} 75.4` }}
            transition={springs.smooth}
          />
        </svg>
        {/* Center text */}
        <span className="absolute inset-0 flex items-center justify-center text-3xs font-bold text-slate-500">
          {progress.overall}%
        </span>
      </div>

      {/* Stats breakdown (hidden on mobile for space) */}
      <div className="hidden sm:flex gap-3 text-xs text-slate-400">
        <span title="Characters met">{progress.charactersMet}/{progress.maxCharacters} 👤</span>
        <span title="Scenes visited">{progress.scenesVisited} 📍</span>
      </div>
    </div>
  )
}
