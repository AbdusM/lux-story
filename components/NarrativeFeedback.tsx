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
        "fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50",
        "transition-all duration-500 ease-in-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
    >
      <div className="bg-slate-800/90 text-slate-50 px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm border border-slate-700/50 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        {message}
      </div>
    </div>
  )
}
