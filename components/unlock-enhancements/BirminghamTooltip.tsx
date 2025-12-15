/**
 * BirminghamTooltip Component
 *
 * Displays context about Birmingham locations when Exploring unlock achieved
 * Works on both desktop (hover) and mobile (tap)
 */

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BirminghamTooltipProps {
  location: string
  context: string
  children: React.ReactNode
  className?: string
}

export function BirminghamTooltip({ location, context, children, className }: BirminghamTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <span className={cn('relative inline-block', className)}>
      <span
        className="underline decoration-dotted decoration-purple-400 decoration-2 cursor-help hover:decoration-purple-500 transition-colors"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)} // Mobile tap support
      >
        {children}
      </span>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg shadow-xl max-w-xs w-max"
            style={{ maxWidth: '280px' }}
          >
            <div className="whitespace-normal text-left leading-relaxed">
              {context}
            </div>
            {/* Arrow pointing down */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}
