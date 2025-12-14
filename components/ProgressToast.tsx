"use client"

import { motion, AnimatePresence } from "framer-motion"
import { PATTERN_METADATA, type PatternType } from "@/lib/patterns"

interface ProgressToastProps {
  pattern: PatternType | null
  onComplete?: () => void
}

// Pattern symbols (emojis for visual identity)
const PATTERN_SYMBOLS: Record<PatternType, string> = {
  analytical: '🔷',
  patience: '🌱',
  exploring: '🔮',
  helping: '❤️',
  building: '🔨'
}

/**
 * Minimal pattern toast - ONLY shows when pattern earned
 * Pokemon principle: Low HP beep (essential feedback only)
 * Bottom placement, non-intrusive, fades after 1.5s
 */
export function ProgressToast({ pattern, onComplete }: ProgressToastProps) {
  if (!pattern) return null

  const metadata = PATTERN_METADATA[pattern]
  if (!metadata) return null

  const symbol = PATTERN_SYMBOLS[pattern]

  return (
    <AnimatePresence onExitComplete={onComplete}>
      <motion.div
        key={`toast-${pattern}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      >
        <div
          className="px-4 py-2 rounded-full shadow-lg border flex items-center gap-2"
          style={{
            backgroundColor: `${metadata.color}10`,
            borderColor: `${metadata.color}40`,
          }}
        >
          <span className="text-lg" style={{ color: metadata.color }}>
            {symbol}
          </span>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            +1 {metadata.shortLabel}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
