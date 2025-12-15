'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface OnboardingScreenProps {
  onDismiss: () => void
  isVisible: boolean
}

/**
 * Onboarding Screen
 *
 * Explains the core game mechanics on first load:
 * - What patterns are
 * - How choices work
 * - What to expect from the station
 *
 * CRITICAL: Players need to understand patterns BEFORE first choice
 */
export function OnboardingScreen({ onDismiss, isVisible }: OnboardingScreenProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 p-4"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative max-w-2xl rounded-2xl border-2 border-slate-600/50 bg-gradient-to-br from-slate-800 to-slate-900 p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onDismiss}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-slate-200"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Title */}
            <div className="mb-6 text-center">
              <h1 className="mb-2 text-3xl font-bold text-slate-100">
                Welcome to the Station
              </h1>
              <p className="text-lg text-slate-400">
                A place between who you were and who you're becoming
              </p>
            </div>

            {/* What to Expect */}
            <div className="mb-6 space-y-4">
              <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
                <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold text-blue-400">
                  <span>💬</span> Conversations Shape Everything
                </h2>
                <p className="text-slate-300">
                  Meet characters exploring their paths. Your responses matter—not for being
                  "right" or "wrong," but for revealing who <em>you</em> are.
                </p>
              </div>

              <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
                <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold text-purple-400">
                  <span>⭐</span> Your Choices Reveal Your Patterns
                </h2>
                <p className="mb-3 text-slate-300">
                  As you make choices, you'll discover five behavioral patterns:
                </p>
                <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400">🔬</span>
                    <div>
                      <strong className="text-slate-200">Analytical</strong>
                      <span className="text-slate-400"> - Logic & insight</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400">⏳</span>
                    <div>
                      <strong className="text-slate-200">Patience</strong>
                      <span className="text-slate-400"> - Listening & waiting</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">🔍</span>
                    <div>
                      <strong className="text-slate-200">Exploring</strong>
                      <span className="text-slate-400"> - Curiosity & discovery</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-pink-400">💗</span>
                    <div>
                      <strong className="text-slate-200">Helping</strong>
                      <span className="text-slate-400"> - Empathy & support</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-400">🏗️</span>
                    <div>
                      <strong className="text-slate-200">Building</strong>
                      <span className="text-slate-400"> - Action & creation</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
                <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold text-green-400">
                  <span>🔓</span> Patterns Unlock New Abilities
                </h2>
                <p className="text-slate-300">
                  As your patterns grow stronger, you'll unlock new ways to see the world—like
                  reading between the lines, asking deeper questions, or taking decisive action.
                </p>
              </div>

              <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-4">
                <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold text-amber-400">
                  <span>📖</span> Track Your Journey
                </h2>
                <p className="text-slate-300">
                  Open the <strong className="text-slate-100">Journal</strong> (side panel) anytime
                  to see your patterns, unlocks, and the characters you've met.
                </p>
              </div>
            </div>

            {/* Session Info */}
            <div className="mb-6 rounded-lg border border-blue-500/30 bg-blue-950/30 p-4">
              <p className="text-center text-sm text-blue-200">
                <strong>Mobile-Friendly:</strong> The station will announce natural pause points
                every 5-10 minutes. Your progress is always saved.
              </p>
            </div>

            {/* Start Button */}
            <button
              onClick={onDismiss}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
            >
              Enter the Station →
            </button>

            {/* Hint */}
            <p className="mt-4 text-center text-xs text-slate-500">
              There are no wrong choices—only different paths to discover
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
