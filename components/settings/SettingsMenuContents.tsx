/**
 * Settings menu contents shared between:
 * - desktop anchored settings menu (UnifiedMenu)
 * - mobile host-rendered settings sheet (OverlayHost)
 *
 * Keep this component "content-only": no fixed backdrops, no global listeners.
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings,
  Volume2,
  VolumeX,
  Sparkles,
  User,
  LogOut,
  Shield,
  Loader2,
  ChevronRight,
  ChevronDown,
  X,
} from 'lucide-react'
import { useUserRole } from '@/hooks/useUserRole'
import { useLargeTextMode } from '@/hooks/useLargeTextMode'
import { useColorBlindMode } from '@/hooks/useColorBlindMode'
import { useSettingsSync } from '@/hooks/useSettingsSync'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { springs } from '@/lib/animations'

// Text size options
const TEXT_SIZES = [
  { id: 'default', label: 'Default' },
  { id: 'large', label: 'Large' },
  { id: 'x-large', label: 'X-Large' },
  { id: 'xx-large', label: 'XX-Large' },
] as const

// Color mode options
const COLOR_MODES = [
  { id: 'default', label: 'Standard' },
  { id: 'protanopia', label: 'Protanopia' },
  { id: 'deuteranopia', label: 'Deuteranopia' },
  { id: 'highContrast', label: 'High Contrast' },
] as const

export interface SettingsMenuContentsProps {
  onRequestClose: () => void
  isMuted?: boolean
  onToggleMute?: () => void
  volume?: number
  onVolumeChange?: (volume: number) => void
  onRequestLogin?: () => void
}

export function SettingsMenuContents({
  onRequestClose,
  isMuted = false,
  onToggleMute,
  volume = 50,
  onVolumeChange,
  onRequestLogin,
}: SettingsMenuContentsProps) {
  const router = useRouter()
  const supabase = createClient()

  // State
  const [signingOut, setSigningOut] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  // User auth
  const { user, role, loading: authLoading } = useUserRole()

  // Accessibility settings
  const { textSize, setTextSize } = useLargeTextMode()
  const [colorBlindMode, setColorBlindMode] = useColorBlindMode()
  const { pushNow } = useSettingsSync()

  // Reduced motion
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lux_reduced_motion')
      setReducedMotion(stored === 'true')
    }
  }, [])

  // Handlers
  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await supabase.auth.signOut()
      onRequestClose()
    } catch (error) {
      console.error('[UnifiedMenu] Sign out error:', error)
    } finally {
      setSigningOut(false)
    }
  }

  const handleTextSizeChange = useCallback(async (value: typeof TEXT_SIZES[number]['id']) => {
    setTextSize(value)
    await pushNow()
  }, [setTextSize, pushNow])

  const handleColorModeChange = useCallback(async (value: typeof COLOR_MODES[number]['id']) => {
    setColorBlindMode(value)
    await pushNow()
  }, [setColorBlindMode, pushNow])

  const toggleReducedMotion = useCallback(async () => {
    const newValue = !reducedMotion
    setReducedMotion(newValue)
    localStorage.setItem('lux_reduced_motion', String(newValue))
    document.documentElement.classList.toggle('reduce-motion', newValue)
    await pushNow()
  }, [reducedMotion, pushNow])

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section)
  }

  const accessibilitySummary = [
    textSize === 'default' ? 'Readable text' : `${TEXT_SIZES.find((size) => size.id === textSize)?.label || 'Larger'} text`,
    colorBlindMode === 'default'
      ? 'Standard contrast'
      : `${COLOR_MODES.find((mode) => mode.id === colorBlindMode)?.label || 'Adjusted'} colors`,
    reducedMotion ? 'Calmer motion' : 'Full motion',
  ]

  return (
    <>
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.98))]" />
        <div className="relative flex items-start justify-between gap-3 px-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-amber-100/80">
              <Settings className="h-3.5 w-3.5" />
              <span>System Controls</span>
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Settings</h2>
              <p className="max-w-[18rem] text-xs leading-relaxed text-slate-300/75">
                Keep audio, accessibility, and account tools close without pushing admin or report UI back into the story.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRequestClose}
            className="rounded-full border border-white/10 bg-white/5 p-2 transition-colors hover:bg-white/10"
            aria-label="Close settings menu"
          >
            <X className="h-4 w-4 text-slate-300" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_36%)] px-3 py-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:px-4">
        <section className="rounded-2xl border border-white/10 bg-black/25 p-3.5 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-amber-400" />
                <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">Audio</h3>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                Ambient sound, interaction cues, and mute control for the current session.
              </p>
            </div>
            <div className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-100">
              {isMuted ? 'Muted' : `${volume}%`}
            </div>
          </div>

          <div className="space-y-3">
            {onVolumeChange && (
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <label htmlFor="volume-slider" className="mb-2 flex items-center justify-between text-xs text-slate-300">
                  <span>Volume</span>
                  <span className="font-medium text-amber-300">{volume}%</span>
                </label>
                <input
                  id="volume-slider"
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => onVolumeChange(parseInt(e.target.value, 10))}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={volume}
                  aria-label="Volume level"
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-amber-500"
                  style={{
                    background: `linear-gradient(to right, rgb(245 158 11) 0%, rgb(245 158 11) ${volume}%, rgb(51 65 85) ${volume}%, rgb(51 65 85) 100%)`
                  }}
                />
              </div>
            )}

            {onToggleMute && (
              <button
                onClick={onToggleMute}
                role="switch"
                aria-checked={isMuted}
                aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border p-3 text-sm transition-colors",
                  isMuted
                    ? "border-red-500/20 bg-red-500/10 text-red-300"
                    : "border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.07]"
                )}
              >
                <span>{isMuted ? 'Audio Muted' : 'Mute Audio'}</span>
                {isMuted ? (
                  <VolumeX className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
          <button
            onClick={() => toggleSection('accessibility')}
            aria-label="Accessibility"
            className="flex w-full items-start justify-between gap-3 text-left"
          >
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-300" />
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">Accessibility</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                Text scale, color treatment, and motion controls tuned for clarity.
              </p>
            </div>
            <ChevronDown className={cn(
              "mt-1 h-4 w-4 shrink-0 text-slate-500 transition-transform",
              expandedSection === 'accessibility' && "rotate-180"
            )} />
          </button>

          <AnimatePresence>
            {expandedSection === 'accessibility' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={springs.snappy}
                className="overflow-hidden"
              >
                <div className="space-y-3 pt-4">
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                    <label className="mb-2 block text-xs text-slate-300">Text Size</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {TEXT_SIZES.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => handleTextSizeChange(size.id)}
                          className={cn(
                            'rounded-lg border p-2 text-xs transition-all',
                            textSize === size.id
                              ? 'border-amber-500/30 bg-amber-500/20 text-amber-200'
                              : 'border-transparent bg-white/5 text-slate-400 hover:bg-white/10'
                          )}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                    <label className="mb-2 block text-xs text-slate-300">Color Mode</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {COLOR_MODES.map((mode) => (
                        <button
                          key={mode.id}
                          onClick={() => handleColorModeChange(mode.id)}
                          className={cn(
                            'rounded-lg border p-2 text-xs transition-all',
                            colorBlindMode === mode.id
                              ? 'border-sky-400/30 bg-sky-400/15 text-sky-100'
                              : 'border-transparent bg-white/5 text-slate-400 hover:bg-white/10'
                          )}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3">
                    <div>
                      <span className="text-sm text-slate-200">Reduce Motion</span>
                      <p className="text-xs text-slate-400">Tone down animation and movement cues.</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-label="Reduce motion animations"
                      aria-checked={reducedMotion}
                      onClick={toggleReducedMotion}
                      className={cn(
                        'relative h-5 w-10 rounded-full transition-colors',
                        reducedMotion ? 'bg-amber-500/30' : 'bg-slate-700'
                      )}
                    >
                      <div
                        className={cn(
                          'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform',
                          reducedMotion ? 'left-5' : 'left-0.5'
                        )}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {expandedSection !== 'accessibility' && (
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-slate-400">
              {accessibilitySummary.map((label) => (
                <span key={label} className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 whitespace-normal">
                  {label}
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-3.5 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
          <div className="mb-3">
            <div className="mb-1 flex items-center gap-2">
              <User className="h-4 w-4 text-violet-300" />
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">Profile</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Move beyond the story shell for backups, deeper preferences, and research controls.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                router.push('/profile')
                onRequestClose()
              }}
              aria-label="Profile & Preferences"
              className="flex w-full items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left transition-colors hover:bg-white/[0.07]"
            >
              <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                <User className="h-4 w-4 text-slate-200" />
              </div>
              <div className="min-w-0 flex-1 pr-2">
                <div className="text-sm font-medium text-white">Profile & Preferences</div>
                <p className="mt-1 text-xs leading-relaxed text-slate-400" aria-hidden="true">
                  Audio, accessibility, backups, and account controls.
                </p>
              </div>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-500" />
            </button>

            <button
              onClick={() => {
                router.push('/profile#research-consent')
                onRequestClose()
              }}
              aria-label="Research Participation"
              className="flex w-full items-start gap-3 rounded-xl border border-sky-400/15 bg-sky-400/[0.06] p-3 text-left transition-colors hover:bg-sky-400/[0.1]"
            >
              <div className="rounded-lg border border-sky-400/15 bg-sky-400/10 p-2">
                <Shield className="h-4 w-4 text-sky-200" />
              </div>
              <div className="min-w-0 flex-1 pr-2">
                <div className="text-sm font-medium text-white">Research Participation</div>
                <p className="mt-1 text-xs leading-relaxed text-slate-400" aria-hidden="true">
                  Review research sharing and export permissions.
                </p>
              </div>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-500" />
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
          <div className="mb-3">
            <div className="mb-1 flex items-center gap-2">
              <User className="h-4 w-4 text-emerald-300" />
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">Account</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Session identity and sign-in controls stay here instead of inside active play.
            </p>
          </div>

          {authLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            </div>
          ) : user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-cyan-500 text-sm font-bold text-white">
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-white">
                    {user.email}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                    {(role === 'educator' || role === 'admin') && (
                      <Shield className="h-3 w-3 text-amber-400" />
                    )}
                    <span className="capitalize">{role}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-50"
              >
                {signingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onRequestLogin?.()
                onRequestClose()
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-300 transition-colors hover:bg-amber-500/20"
            >
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          )}
        </section>
      </div>
    </>
  )
}
