import React from 'react'
import { Train } from 'lucide-react'

interface CharacterTransitionProps {
  nextPlatform: number
  transitionMessage: string
  onComplete?: () => void
}

export function CharacterTransition({
  nextPlatform,
  transitionMessage,
  onComplete: _onComplete
}: CharacterTransitionProps) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-xl p-8 max-w-md mx-4 shadow-2xl animate-zoom-in">
        <div className="text-center space-y-4">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
            <Train className="w-8 h-8 text-blue-600" />
          </div>
          
          {/* Message */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Platform {nextPlatform}
            </h3>
            <p className="text-sm text-slate-600">
              {transitionMessage}
            </p>
          </div>
          
          {/* Progress */}
          <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
            <div className="h-full bg-blue-600 animate-progress" />
          </div>
        </div>
      </div>
    </div>
  )
}
