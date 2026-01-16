import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SkillGapBarProps {
  skillName: string
  current: number // 0-1 scale
  required: number // 0-1 scale
  className?: string
}

/**
 * Visualizes skill gap between current level and required level
 * Shows current progress (solid) vs required threshold (dashed outline)
 */
export function SkillGapBar({ skillName, current, required, className }: SkillGapBarProps) {
  const prefersReducedMotion = useReducedMotion()

  // Format skill name for display (camelCase to Title Case)
  const displayName = skillName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()

  const currentPercent = Math.round(current * 100)
  const requiredPercent = Math.round(required * 100)
  const isMet = current >= required
  const gap = Math.max(0, required - current)

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-300 font-medium truncate">{displayName}</span>
        <span className={cn(
          "font-mono text-[10px]",
          isMet ? "text-emerald-400" : "text-amber-400"
        )}>
          {currentPercent}% / {requiredPercent}%
        </span>
      </div>

      <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
        {/* Required threshold indicator (dashed) */}
        <div
          className="absolute top-0 bottom-0 border-r-2 border-dashed border-white/30"
          style={{ left: `${requiredPercent}%` }}
        />

        {/* Current progress (solid) */}
        <motion.div
          className={cn(
            "h-full rounded-full",
            isMet
              ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
              : "bg-gradient-to-r from-amber-600 to-amber-500"
          )}
          initial={prefersReducedMotion ? { width: `${currentPercent}%` } : { width: 0 }}
          animate={{ width: `${currentPercent}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* Gap indicator */}
      {!isMet && (
        <div className="text-[10px] text-slate-500 font-mono">
          Gap: {Math.round(gap * 100)}% to reach requirement
        </div>
      )}
    </div>
  )
}
