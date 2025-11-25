/**
 * Atmospheric Intro - Single screen value proposition
 *
 * Clean, minimal intro that answers:
 * - Why trust us (research + experience)
 * - How it works (play to discover)
 * - Pay it forward (helps next explorer + workforce dev people)
 */

"use client"

import { Button } from '@/components/ui/button'

interface AtmosphericIntroProps {
  onStart: () => void
}

export function AtmosphericIntro({ onStart }: AtmosphericIntroProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-3 sm:p-4 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">

        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">
          Grand Central Terminus
        </h1>

        {/* Value proposition */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm mb-8">
          <p className="text-lg sm:text-xl text-slate-800 leading-relaxed mb-6">
            Discover your interests, skills, and values through play.
          </p>

          <p className="text-base text-slate-600 leading-relaxed mb-6">
            Built on research. Designed by people who do this work.
          </p>

          <p className="text-base text-slate-600 leading-relaxed">
            What you learn helps the next explorer, and the people working to create opportunity for them.
          </p>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onStart}
          variant="default"
          size="lg"
          className="w-full sm:w-auto min-h-[48px] px-8"
          aria-label="Begin your journey at Grand Central Terminus"
        >
          Enter the Station
        </Button>

      </div>
    </div>
  )
}