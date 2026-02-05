"use client"

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Heart, Settings, Search, Rocket, Lightbulb } from 'lucide-react'
import { useGameSelectors } from '@/lib/game-store'
import { cn } from '@/lib/utils'
import { springs, STAGGER_DELAY } from '@/lib/animations'

/**
 * CareerValuesView - Displays the player's career values
 *
 * Shows 5 core motivational values derived from gameplay choices:
 * - Direct Impact: Helping people directly
 * - Systems Thinking: Optimizing how things work
 * - Data Insights: Finding patterns and research
 * - Future Building: Emerging fields and innovation
 * - Independence: Creating new approaches
 */

const VALUE_CONFIGS = {
  directImpact: {
    label: 'Direct Impact',
    description: 'Helping people directly, immediate service',
    icon: Heart,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/20'
  },
  systemsThinking: {
    label: 'Systems Thinking',
    description: 'Optimizing how things work, process improvement',
    icon: Settings,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20'
  },
  dataInsights: {
    label: 'Data Insights',
    description: 'Finding patterns, security, research',
    icon: Search,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20'
  },
  futureBuilding: {
    label: 'Future Building',
    description: 'Emerging fields, growth sectors, innovation',
    icon: Rocket,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20'
  },
  independence: {
    label: 'Independence',
    description: 'Creating new approaches, hybrid careers',
    icon: Lightbulb,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20'
  }
} as const

export function CareerValuesView() {
  const prefersReducedMotion = useReducedMotion()
  const gameState = useGameSelectors.useCoreGameStateHydrated()

  const values = useMemo(() => {
    if (!gameState?.careerValues) {
      return null
    }

    const careerValues = gameState.careerValues
    const entries = Object.entries(careerValues) as [keyof typeof VALUE_CONFIGS, number][]

    // Sort by value descending
    const sorted = entries.sort((a, b) => b[1] - a[1])

    // Calculate total for percentage
    const total = entries.reduce((sum, [, val]) => sum + val, 0)

    return sorted.map(([key, value]) => ({
      ...VALUE_CONFIGS[key],
      id: key,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0
    }))
  }, [gameState?.careerValues])

  // Get top 2 values
  const topValues = values?.slice(0, 2) ?? []
  const hasValues = values && values.some(v => v.value > 0)

  if (!hasValues) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-slate-400">
          Your career values will emerge as you make choices in conversations.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      {topValues.length >= 2 && (
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-slate-400 mb-1">Your driving motivations</p>
          <p className="text-sm text-white">
            <span className={topValues[0].color}>{topValues[0].label}</span>
            {' & '}
            <span className={topValues[1].color}>{topValues[1].label}</span>
          </p>
        </div>
      )}

      {/* Value bars */}
      <div className="space-y-3">
        {values?.map((value, index) => {
          const Icon = value.icon
          return (
            <motion.div
              key={value.id}
              className="space-y-1.5"
              initial={!prefersReducedMotion ? { opacity: 0, x: -10 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * STAGGER_DELAY.normal,
                ...springs.gentle
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("p-1.5 rounded-md", value.bgColor)}>
                    <Icon className={cn("w-3.5 h-3.5", value.color)} />
                  </div>
                  <span className="text-xs font-medium text-slate-300">
                    {value.label}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {value.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={cn("h-full rounded-full", value.bgColor.replace('/20', ''))}
                  initial={{ width: 0 }}
                  animate={{ width: `${value.percentage}%` }}
                  transition={springs.smooth}
                />
              </div>

              <p className="text-[10px] text-slate-500 pl-7">
                {value.description}
              </p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Compact version for use in header/sidebar
 */
export function CareerValuesCompact() {
  const gameState = useGameSelectors.useCoreGameStateHydrated()

  const topValue = useMemo(() => {
    if (!gameState?.careerValues) return null

    const entries = Object.entries(gameState.careerValues) as [keyof typeof VALUE_CONFIGS, number][]
    const sorted = entries.sort((a, b) => b[1] - a[1])

    if (sorted[0][1] === 0) return null

    return {
      ...VALUE_CONFIGS[sorted[0][0]],
      id: sorted[0][0],
      value: sorted[0][1]
    }
  }, [gameState?.careerValues])

  if (!topValue) return null

  const Icon = topValue.icon

  return (
    <div
      className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full", topValue.bgColor)}
      title={`Top value: ${topValue.label}`}
    >
      <Icon className={cn("w-3 h-3", topValue.color)} />
      <span className={cn("text-xs font-medium", topValue.color)}>
        {topValue.label}
      </span>
    </div>
  )
}
