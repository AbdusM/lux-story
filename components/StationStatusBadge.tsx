'use client'

/**
 * StationStatusBadge - Compact header status indicator
 *
 * Shows station atmosphere and waiting characters in a non-intrusive format.
 * ISP Principle: Backend state manifests through UI without interrupting core gameplay.
 *
 * Display format: "Awakening | 3 waiting"
 */

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { GameState } from '@/lib/character-state'
import { calculateAmbientContext } from '@/content/ambient-descriptions'
import { getWaitingCharacters } from '@/lib/character-waiting'

interface StationStatusBadgeProps {
  gameState: GameState | null
  className?: string
}

// Atmosphere display names - short and evocative
const ATMOSPHERE_LABELS: Record<string, { label: string; color: string }> = {
  dormant: { label: 'Dormant', color: 'text-slate-400' },
  awakening: { label: 'Awakening', color: 'text-blue-400' },
  alive: { label: 'Alive', color: 'text-emerald-400' },
  tense: { label: 'Alert', color: 'text-red-400' },
  harmonious: { label: 'Harmonious', color: 'text-purple-400' }
}

export function StationStatusBadge({ gameState, className = '' }: StationStatusBadgeProps) {
  const prefersReducedMotion = useReducedMotion()

  const statusData = useMemo(() => {
    if (!gameState) return null

    const { atmosphere } = calculateAmbientContext(gameState)
    const waitingCharacters = getWaitingCharacters(gameState)

    return {
      atmosphere,
      atmosphereLabel: ATMOSPHERE_LABELS[atmosphere] || ATMOSPHERE_LABELS.dormant,
      waitingCount: waitingCharacters.length
    }
  }, [gameState])

  if (!statusData) return null

  const { atmosphereLabel, waitingCount } = statusData

  return (
    <motion.div
      initial={!prefersReducedMotion ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-1.5 text-2xs font-mono uppercase tracking-wider ${className}`}
    >
      {/* Atmosphere indicator */}
      <span className={atmosphereLabel.color}>
        {atmosphereLabel.label}
      </span>

      {/* Waiting characters (only show if there are any) */}
      {waitingCount > 0 && (
        <>
          <span className="text-slate-500">|</span>
          <span className="text-amber-400/80">
            {waitingCount} waiting
          </span>
        </>
      )}
    </motion.div>
  )
}
