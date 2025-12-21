/**
 * Subtext Component
 *
 * Displays analytical hints when Analytical unlock achieved
 * Shows observable details about character's emotional state
 */

'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SubtextProps {
  text: string
  className?: string
}

export function Subtext({ text, className }: SubtextProps) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'text-xs italic text-slate-600 dark:text-slate-400 mt-2 leading-relaxed',
        className
      )}
    >
      {text}
    </motion.p>
  )
}
