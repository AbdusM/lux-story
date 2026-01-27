'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { GameState } from '@/lib/character-state'
import { calculateAmbientContext, ATMOSPHERES } from '@/content/ambient-descriptions'

export function AmbientDescriptionDisplay({ gameState, mode = 'fixed' }: { gameState: GameState, mode?: 'fixed' | 'inline' }) {
  const [description, setDescription] = useState('')

  useEffect(() => {
    const ctx = calculateAmbientContext(gameState)
    setDescription(ATMOSPHERES[ctx.atmosphere]?.description || "The station hums quietly.")
  }, [gameState])

  if (!description) return null

  if (mode === 'inline') {
    return <span>{description}</span>
  }

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-2xs uppercase tracking-widest text-slate-400 font-mono leading-relaxed"
    >
      {description}
    </motion.p>
  )
}
