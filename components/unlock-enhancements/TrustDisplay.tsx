/**
 * TrustDisplay Component
 *
 * Shows character's trust level when Helping unlock achieved
 * Uses existing trust data from CharacterState
 */

'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TrustDisplayProps {
  trust: number
  characterName?: string
  className?: string
}

export function TrustDisplay({ trust, characterName, className }: TrustDisplayProps) {
  // Determine color based on trust level
  const getTrustColor = (level: number): string => {
    if (level >= 7) return 'text-emerald-600'
    if (level >= 4) return 'text-blue-600'
    if (level >= 0) return 'text-slate-600'
    return 'text-rose-600'
  }

  const getTrustLabel = (level: number): string => {
    if (level >= 8) return 'Close'
    if (level >= 6) return 'Trusted'
    if (level >= 4) return 'Friendly'
    if (level >= 2) return 'Acquaintance'
    if (level >= 0) return 'Neutral'
    if (level >= -2) return 'Wary'
    return 'Distant'
  }

  const color = getTrustColor(trust)
  const label = getTrustLabel(trust)

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn('inline-flex items-center gap-1.5 text-xs', className)}
      title={characterName ? `Trust with ${characterName}` : 'Trust level'}
    >
      <span className="text-slate-500 font-medium">Trust:</span>
      <span className={cn('font-bold', color)}>
        {trust}/10
      </span>
      <span className={cn('font-medium opacity-75', color)}>
        ({label})
      </span>
    </motion.div>
  )
}
