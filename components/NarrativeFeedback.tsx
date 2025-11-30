'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface NarrativeFeedbackProps {
  message: string
  isVisible: boolean
  onDismiss: () => void
}

/**
 * NarrativeFeedback - Subtle, inline feedback for game state changes
 * Replaces invasive "toasts" with a gentle narrative whisper
 */
export function NarrativeFeedback({ message, isVisible, onDismiss }: NarrativeFeedbackProps) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
      const timer = setTimeout(() => {
        onDismiss()
      }, 3000) // Disappear after 3 seconds
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 500) // Wait for fade out animation
      return () => clearTimeout(timer)
    }
  }, [isVisible, onDismiss])

  if (!shouldRender) return null

  return (
    <div
      className={cn(
        // Non-obtrusive: top-right corner, small, low z-index
        "fixed top-4 right-4 z-30 max-w-[200px] sm:max-w-[240px]",
        "transition-all duration-300 ease-in-out",
        isVisible ? "opacity-70 translate-y-0" : "opacity-0 translate-y-[-10px]"
      )}
    >
      <div className="bg-slate-800/80 text-slate-50 px-2.5 py-1.5 rounded-lg text-xs font-medium shadow-md backdrop-blur-sm border border-slate-700/40 flex items-center gap-1.5">
        <span className="w-1 h-1 rounded-full bg-emerald-400" />
        <span className="truncate">{message}</span>
      </div>
    </div>
  )
}
