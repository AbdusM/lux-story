import React, { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SkillToastProps {
  skill: string
  message: string
  duration?: number
  onClose?: () => void
}

export function SkillToast({ 
  skill, 
  message, 
  duration = 3000,
  onClose 
}: SkillToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose?.(), 200) // Wait for animation to complete
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50",
      "px-4 py-3 rounded-lg shadow-lg",
      "bg-white border-2 border-green-400",
      "animate-slide-in-from-bottom"
    )}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <p className="font-medium text-sm text-slate-900">
            {skill} demonstrated
          </p>
          <p className="text-xs text-slate-600">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}
