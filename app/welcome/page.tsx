/**
 * Welcome/Intro Page
 * Atmospheric entry point for new users
 *
 * Features:
 * - Timed animated intro sequence
 * - Guest vs Sign In options
 * - Quick accessibility profile selection
 * - Respects prefers-reduced-motion
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { User, Play, Eye, Settings, ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAccessibilityProfile } from '@/hooks/useAccessibilityProfile'
import { cn } from '@/lib/utils'
import { springs } from '@/lib/animations'

// Animated quotes for rotating display
const JOURNEY_QUOTES = [
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "The privilege of a lifetime is to become who you truly are.", author: "Carl Jung" },
  { text: "Your work is to discover your work and then with all your heart to give yourself to it.", author: "Buddha" },
]

// Accessibility quick-select profiles (subset for welcome screen)
const QUICK_PROFILES = [
  { id: 'default', label: 'Standard', description: 'Default experience' },
  { id: 'dyslexia', label: 'Dyslexia Friendly', description: 'Easier reading with special fonts' },
  { id: 'low_vision', label: 'Large Text', description: 'Bigger text and higher contrast' },
  { id: 'reduced_motion', label: 'Reduce Motion', description: 'Less animation and movement' },
] as const

export default function WelcomePage() {
  const router = useRouter()
  const supabase = createClient()
  const prefersReducedMotion = useReducedMotion()

  // Animation phase control
  const [phase, setPhase] = useState<'loading' | 'title' | 'tagline' | 'ready'>('loading')
  const [showAccessibility, setShowAccessibility] = useState(false)
  const [quote] = useState(() => JOURNEY_QUOTES[Math.floor(Math.random() * JOURNEY_QUOTES.length)])

  // Accessibility profile
  const { profile, setProfile } = useAccessibilityProfile()

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Already authenticated, redirect to game
        router.replace('/')
      }
    }
    checkAuth()
  }, [router, supabase.auth])

  // Timed animation sequence
  useEffect(() => {
    if (prefersReducedMotion) {
      // Skip animations for reduced motion preference
      setPhase('ready')
      return
    }

    // Phase 1: Title appears
    const titleTimer = setTimeout(() => setPhase('title'), 500)

    // Phase 2: Tagline appears
    const taglineTimer = setTimeout(() => setPhase('tagline'), 2000)

    // Phase 3: Ready state (buttons appear)
    const readyTimer = setTimeout(() => setPhase('ready'), 3500)

    return () => {
      clearTimeout(titleTimer)
      clearTimeout(taglineTimer)
      clearTimeout(readyTimer)
    }
  }, [prefersReducedMotion])

  // Handle guest entry
  const handleGuestEntry = useCallback(() => {
    // Store that user chose guest mode
    localStorage.setItem('lux_guest_mode', 'true')
    document.cookie = 'lux_guest_mode=true; path=/; max-age=31536000; samesite=lax'
    router.push('/')
  }, [router])

  // Handle sign in
  const handleSignIn = useCallback(() => {
    router.push('/admin/login')
  }, [router])

  // Handle accessibility profile change
  const handleProfileChange = useCallback((profileId: string) => {
    setProfile(profileId as 'default' | 'dyslexia' | 'low_vision' | 'reduced_motion')
  }, [setProfile])

  const showContent = phase !== 'loading'
  const showTagline = phase === 'tagline' || phase === 'ready'
  const showButtons = phase === 'ready'

  return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Ambient background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto text-center">
        <AnimatePresence mode="wait">
          {/* Title */}
          {showContent && (
            <motion.div
              key="title"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ...springs.gentle }}
              className="mb-8"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                  Grand Central
                </span>
                <br />
                <span className="text-white/90 text-3xl sm:text-4xl md:text-5xl">
                  Terminus
                </span>
              </h1>
            </motion.div>
          )}

          {/* Tagline */}
          {showTagline && (
            <motion.div
              key="tagline"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-10"
            >
              <p className="text-lg sm:text-xl text-slate-300 mb-4">
                A magical station appears between who you were
                <br className="hidden sm:block" />
                {' '}and who you're becoming.
              </p>
              <p className="text-sm text-slate-500 italic">
                "{quote.text}"
                <span className="block mt-1 not-italic">— {quote.author}</span>
              </p>
            </motion.div>
          )}

          {/* Action Buttons */}
          {showButtons && (
            <motion.div
              key="buttons"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ...springs.smooth }}
              className="space-y-4"
            >
              {/* Primary CTA - Guest Entry */}
              <button
                onClick={handleGuestEntry}
                className="w-full min-h-[56px] px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold text-lg rounded-xl shadow-lg shadow-amber-900/30 transition-all duration-200 flex items-center justify-center gap-3"
                aria-label="Begin exploring as a guest"
              >
                <Play className="w-5 h-5" />
                Begin Exploring
              </button>

              {/* Secondary CTA - Sign In */}
              <button
                onClick={handleSignIn}
                className="w-full min-h-[48px] px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                aria-label="Sign in to save your progress"
              >
                <User className="w-4 h-4" />
                Sign In to Save Progress
              </button>

              {/* Accessibility Options Toggle */}
              <button
                onClick={() => setShowAccessibility(!showAccessibility)}
                className="w-full py-2 text-slate-500 hover:text-slate-400 text-sm transition-colors flex items-center justify-center gap-1"
                aria-expanded={showAccessibility}
                aria-controls="accessibility-options"
              >
                <Eye className="w-4 h-4" />
                <span>Accessibility Options</span>
                {showAccessibility ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {/* Accessibility Profile Selection */}
              <AnimatePresence>
                {showAccessibility && (
                  <motion.div
                    id="accessibility-options"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={springs.smooth}
                    className="overflow-hidden"
                  >
                    <div className="glass-panel !rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-400">Quick Setup</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {QUICK_PROFILES.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => handleProfileChange(p.id)}
                            className={cn(
                              'p-3 rounded-lg text-left transition-all text-sm',
                              profile === p.id
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                            )}
                            aria-pressed={profile === p.id}
                          >
                            <span className="block font-medium">{p.label}</span>
                            <span className="block text-xs opacity-70 mt-0.5">{p.description}</span>
                          </button>
                        ))}
                      </div>

                      <p className="text-xs text-slate-500 text-center mt-2">
                        You can change these anytime in Settings
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading state */}
        {phase === 'loading' && (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}
