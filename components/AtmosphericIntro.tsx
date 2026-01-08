/**
 * Atmospheric Intro - Single screen value proposition
 *
 * Clean, minimal intro that answers:
 * - Why trust us (research + experience)
 * - How it works (play to discover)
 * - Pay it forward (helps next explorer + workforce dev people)
 */

"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

const quotes = [
  { text: "Hide not your talents, they for use were made. What's a sundial in the shade?", author: "Benjamin Franklin" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "The privilege of a lifetime is to become who you truly are.", author: "Carl Jung" },
  { text: "Your work is to discover your work and then with all your heart to give yourself to it.", author: "Buddha" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "It is never too late to be what you might have been.", author: "George Eliot" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
]

interface AtmosphericIntroProps {
  onStart: () => void
}

export function AtmosphericIntro({ onStart }: AtmosphericIntroProps) {
  // Use first quote for SSR, then randomize on client to avoid hydration mismatch
  const [quote, setQuote] = useState(quotes[0])

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-3 sm:p-4 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">

        {/* Header */}
        <h1
          className="text-3xl sm:text-4xl font-bold text-slate-100 mb-8"
          data-testid="intro-title"
        >
          Terminus
        </h1>

        {/* Value proposition */}
        <div className="glass-panel rounded-xl p-6 sm:p-8 mb-8">
          <p className="text-lg sm:text-xl text-slate-100 leading-relaxed mb-4">
            Play. Learn what moves you.
          </p>

          <p className="text-base text-slate-400 leading-relaxed">
            What you discover lights the way for others.
          </p>
        </div>

        {/* Rotating Quote */}
        <p className="text-sm italic text-slate-500 mb-6">
          {quote.text}
          <span className="block mt-1 not-italic text-slate-400">— {quote.author}</span>
        </p>

        {/* CTA Button */}
        <Button
          onClick={onStart}
          variant="default"
          size="lg"
          className="w-full sm:w-auto min-h-[48px] px-8 bg-violet-600 hover:bg-violet-500 text-white font-semibold shadow-lg shadow-violet-900/30"
          aria-label="Begin your journey at Terminus"
          data-testid="intro-cta"
        >
          Enter the Station
        </Button>

      </div>
    </div>
  )
}