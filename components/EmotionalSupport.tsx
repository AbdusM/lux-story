"use client"

import { useState, useEffect } from 'react'
import { EmotionalState } from '@/lib/emotional-regulation-system'

interface EmotionalSupportProps {
  emotionalState: EmotionalState
  supportMessage: string | null
  visualAdjustments: Record<string, any>
  onDismiss?: () => void
}

/**
 * Emotional Support Component
 * Provides gentle, accessible emotional regulation support for Birmingham youth
 */
export function EmotionalSupport({ 
  emotionalState, 
  supportMessage, 
  visualAdjustments, 
  onDismiss 
}: EmotionalSupportProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState<'in' | 'out' | 'hold'>('in')
  const [breathingCount, setBreathingCount] = useState(0)

  // Show support when regulation is needed
  useEffect(() => {
    if (emotionalState.regulationNeeded && supportMessage) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [emotionalState.regulationNeeded, supportMessage])

  // Breathing guidance animation
  useEffect(() => {
    if (visualAdjustments.breathingCue && emotionalState.breathingRhythm === 'guided') {
      const interval = setInterval(() => {
        setBreathingPhase(prev => {
          if (prev === 'in') {
            setTimeout(() => setBreathingPhase('hold'), 2000)
            return 'hold'
          } else if (prev === 'hold') {
            setTimeout(() => setBreathingPhase('out'), 1000)
            return 'out'
          } else {
            setTimeout(() => setBreathingPhase('in'), 2000)
            setBreathingCount(prev => prev + 1)
            return 'in'
          }
        })
      }, 5000) // 5 second cycle

      return () => clearInterval(interval)
    }
  }, [visualAdjustments.breathingCue, emotionalState.breathingRhythm])

  if (!isVisible || !supportMessage) return null

  const getStressLevelColor = () => {
    switch (emotionalState.stressLevel) {
      case 'calm': return 'text-green-600'
      case 'alert': return 'text-blue-600'
      case 'anxious': return 'text-yellow-600'
      case 'overwhelmed': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStressLevelIcon = () => {
    switch (emotionalState.stressLevel) {
      case 'calm': return '😌'
      case 'alert': return '👀'
      case 'anxious': return '😰'
      case 'overwhelmed': return '🤗'
      default: return '💭'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div
        className={`
          bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl
          ${visualAdjustments.spacing === 'increased' ? 'p-8' : ''}
          ${visualAdjustments.spacing === 'maximum' ? 'p-10' : ''}
          ${visualAdjustments.blurBackground ? 'backdrop-blur-sm' : ''}
        `}
        style={{
          animation: visualAdjustments.animationSpeed === 'slower' ? 'pulse 2s ease-in-out' : 'none'
        }}
      >
        <div className="text-center">
          {/* Stress level indicator */}
          <div className="flex items-center justify-center mb-4">
            <span className="text-2xl mr-2">{getStressLevelIcon()}</span>
            <span className={`text-sm font-medium ${getStressLevelColor()}`}>
              {emotionalState.stressLevel.charAt(0).toUpperCase() + emotionalState.stressLevel.slice(1)}
            </span>
          </div>

          {/* Support message */}
          <p className="text-gray-700 mb-6 leading-relaxed">
            {supportMessage}
          </p>

          {/* Breathing guidance */}
          {visualAdjustments.breathingCue && (
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-3">
                {emotionalState.breathingRhythm === 'guided' ? 'Follow along:' : 'Take your time:'}
              </div>
              <div 
                className={`
                  w-16 h-16 mx-auto rounded-full border-4 border-blue-300 transition-all duration-2000
                  ${breathingPhase === 'in' ? 'scale-110 bg-blue-100' : ''}
                  ${breathingPhase === 'hold' ? 'scale-125 bg-blue-200' : ''}
                  ${breathingPhase === 'out' ? 'scale-100 bg-blue-50' : ''}
                `}
              />
              <div className="text-xs text-gray-500 mt-2">
                {breathingPhase === 'in' && 'Breathe in...'}
                {breathingPhase === 'hold' && 'Hold...'}
                {breathingPhase === 'out' && 'Breathe out...'}
              </div>
              {breathingCount > 0 && (
                <div className="text-xs text-gray-400 mt-1">
                  {breathingCount} breath{breathingCount !== 1 ? 'es' : ''}
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => setIsVisible(false)}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              I'm ready
            </button>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
              >
                Dismiss
              </button>
            )}
          </div>

          {/* Additional support for overwhelmed state */}
          {emotionalState.stressLevel === 'overwhelmed' && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-xs text-red-700">
                💡 Remember: There are no wrong choices here. This is about exploring, not getting the "right" answer.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
