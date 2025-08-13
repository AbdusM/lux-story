"use client"

import { useState, useEffect } from 'react'

interface BreathingInvitationProps {
  visible: boolean
}

/**
 * A gentle breathing invitation - not a game, not scored, just an option
 */
export function BreathingInvitation({ visible }: BreathingInvitationProps) {
  const [breathing, setBreathing] = useState(false)
  const [phase, setPhase] = useState<'in' | 'out'>('in')
  
  useEffect(() => {
    if (breathing) {
      const interval = setInterval(() => {
        setPhase(p => p === 'in' ? 'out' : 'in')
      }, 4000) // Slow, natural breathing rhythm
      
      return () => clearInterval(interval)
    }
  }, [breathing])
  
  if (!visible) return null
  
  return (
    <div className="fixed bottom-4 left-4 text-sm text-muted-foreground">
      {!breathing ? (
        <button
          onClick={() => setBreathing(true)}
          className="hover:text-foreground transition-colors"
        >
          The air is here if you'd like it
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full bg-current transition-all duration-[4000ms] ${
            phase === 'in' ? 'scale-150 opacity-100' : 'scale-100 opacity-50'
          }`} />
          <button
            onClick={() => setBreathing(false)}
            className="hover:text-foreground transition-colors"
          >
            {phase === 'in' ? 'in' : 'out'}
          </button>
        </div>
      )}
    </div>
  )
}