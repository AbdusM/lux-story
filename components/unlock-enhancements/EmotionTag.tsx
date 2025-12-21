/**
 * EmotionTag Component
 *
 * Displays character's emotional state when Analytical or Helping unlocks achieved
 * Uses existing emotion data from DialogueContent
 */

'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EmotionTagProps {
  emotion: string
  className?: string
}

/**
 * Color mapping for different emotional states
 */
const EMOTION_COLORS: Record<string, string> = {
  // Anxiety/Uncertainty
  anxious: 'text-amber-700 bg-amber-100/80 border-amber-200',
  nervous: 'text-amber-700 bg-amber-100/80 border-amber-200',
  uncertain: 'text-slate-700 bg-slate-100/80 border-slate-200',
  conflicted: 'text-purple-700 bg-purple-100/80 border-purple-200',

  // Positive states
  hopeful: 'text-emerald-700 bg-emerald-100/80 border-emerald-200',
  excited: 'text-blue-700 bg-blue-100/80 border-blue-200',
  determined: 'text-indigo-700 bg-indigo-100/80 border-indigo-200',
  warm: 'text-rose-700 bg-rose-100/80 border-rose-200',
  proud: 'text-amber-700 bg-amber-100/80 border-amber-200',

  // Guarded/Defensive
  guarded: 'text-slate-700 bg-slate-100/80 border-slate-200',
  defensive: 'text-slate-700 bg-slate-100/80 border-slate-200',
  wary: 'text-slate-700 bg-slate-100/80 border-slate-200',
  suspicious: 'text-slate-700 bg-slate-100/80 border-slate-200',

  // Vulnerable
  vulnerable: 'text-rose-700 bg-rose-100/80 border-rose-200',
  raw: 'text-rose-700 bg-rose-100/80 border-rose-200',
  honest: 'text-blue-700 bg-blue-100/80 border-blue-200',
  open: 'text-emerald-700 bg-emerald-100/80 border-emerald-200',

  // Neutral/Thinking
  contemplative: 'text-indigo-700 bg-indigo-100/80 border-indigo-200',
  thoughtful: 'text-indigo-700 bg-indigo-100/80 border-indigo-200',
  curious: 'text-purple-700 bg-purple-100/80 border-purple-200',
  focused: 'text-slate-700 bg-slate-100/80 border-slate-200'
}

export function EmotionTag({ emotion, className }: EmotionTagProps) {
  const cleanEmotion = emotion.replace(/[\[\]]/g, '')
  const colorClass = EMOTION_COLORS[cleanEmotion.toLowerCase()] || 'text-slate-700 bg-slate-100/80 border-slate-200'

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border',
        colorClass,
        className
      )}
      title={`Character is feeling ${emotion}`}
    >
      {cleanEmotion}
    </motion.span>
  )
}
