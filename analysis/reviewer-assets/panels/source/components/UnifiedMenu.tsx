/**
 * Unified Menu Component
 * Consolidates GameMenu, InGameSettings, and UserMenu into single entry point
 *
 * Sections:
 * 1. Audio (Volume, Mute)
 * 2. Accessibility (Text Size, Color Mode, Reduce Motion)
 * 3. Profile (Career Profile, Clinical Audit, All Settings)
 * 4. Account (User info, Sign Out / Sign In)
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings,
  Volume2,
  VolumeX,
  FileText,
  Brain,
  Sparkles,
  User,
  LogOut,
  Shield,
  Loader2,
  ChevronRight,
  ChevronDown,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUserRole } from '@/hooks/useUserRole'
import { useLargeTextMode } from '@/hooks/useLargeTextMode'
import { useColorBlindMode } from '@/hooks/useColorBlindMode'
import { useSettingsSync } from '@/hooks/useSettingsSync'
import { createClient } from '@/lib/supabase/client'
import { LoginModal } from '@/components/auth/LoginModal'
import { cn } from '@/lib/utils'
import { springs } from '@/lib/animations'
import { Z_INDEX } from '@/lib/ui-constants'

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

interface UnifiedMenuProps {
  onShowReport?: () => void
  isMuted?: boolean
  onToggleMute?: () => void
  volume?: number
  onVolumeChange?: (volume: number) => void
  playerId?: string
}

export function UnifiedMenu({
  onShowReport,
  isMuted = false,
  onToggleMute,
  volume = 50,
  onVolumeChange,
  playerId,
}: UnifiedMenuProps) {
  const router = useRouter()
  const supabase = createClient()

  // State
  const [isOpen, setIsOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
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

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Handlers
  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await supabase.auth.signOut()
      setIsOpen(false)
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

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="text-slate-400 hover:text-white hover:bg-white/5 relative"
        aria-label="Settings menu"
        aria-expanded={isOpen}
      >
        <Settings className="w-5 h-5" />
        {/* Badge for logged-in educators/admins */}
        {user && (role === 'educator' || role === 'admin') && (
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400" />
        )}
      </Button>

      {/* Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/20"
              style={{ zIndex: Z_INDEX.modalBackdrop }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={springs.snappy}
              className="absolute right-0 top-full mt-2 w-72 glass-panel-solid !rounded-xl border border-white/10 shadow-2xl overflow-hidden"
              style={{ zIndex: Z_INDEX.popover }}
              role="dialog"
              aria-label="Settings"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <span className="text-sm font-semibold text-white">Settings</span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                  aria-label="Close settings menu"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto">
                {/* ══════════════════════════════════════════════════════════════
                   AUDIO SECTION
                   ══════════════════════════════════════════════════════════════ */}
                <div className="p-3 border-b border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Audio</h3>
                  </div>

                  {/* Volume Slider */}
                  {onVolumeChange && (
                    <div className="mb-3">
                      <label htmlFor="volume-slider" className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                        <span>Volume</span>
                        <span className="text-amber-400 font-medium">{volume}%</span>
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
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        style={{
                          background: `linear-gradient(to right, rgb(245 158 11) 0%, rgb(245 158 11) ${volume}%, rgb(51 65 85) ${volume}%, rgb(51 65 85) 100%)`
                        }}
                      />
                    </div>
                  )}

                  {/* Mute Toggle */}
                  {onToggleMute && (
                    <button
                      onClick={onToggleMute}
                      role="switch"
                      aria-checked={isMuted}
                      aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
                      className={cn(
                        "w-full flex items-center justify-between p-2.5 rounded-lg transition-colors",
                        isMuted ? "bg-red-500/10 text-red-400" : "bg-white/5 text-slate-300 hover:bg-white/10"
                      )}
                    >
                      <span className="text-sm">{isMuted ? 'Audio Muted' : 'Mute Audio'}</span>
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Volume2 className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                  )}
                </div>

                {/* ══════════════════════════════════════════════════════════════
                   ACCESSIBILITY SECTION
                   ══════════════════════════════════════════════════════════════ */}
                <div className="p-3 border-b border-white/5">
                  <button
                    onClick={() => toggleSection('accessibility')}
                    className="w-full flex items-center justify-between mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Accessibility</span>
                    </div>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-slate-500 transition-transform",
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
                        <div className="space-y-3 pt-2">
                          {/* Text Size */}
                          <div>
                            <label className="text-xs text-slate-500 mb-1.5 block">Text Size</label>
                            <div className="grid grid-cols-2 gap-1.5">
                              {TEXT_SIZES.map((size) => (
                                <button
                                  key={size.id}
                                  onClick={() => handleTextSizeChange(size.id)}
                                  className={cn(
                                    'p-2 rounded text-xs transition-all',
                                    textSize === size.id
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                      : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-transparent'
                                  )}
                                >
                                  {size.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Color Mode */}
                          <div>
                            <label className="text-xs text-slate-500 mb-1.5 block">Color Mode</label>
                            <div className="grid grid-cols-2 gap-1.5">
                              {COLOR_MODES.map((mode) => (
                                <button
                                  key={mode.id}
                                  onClick={() => handleColorModeChange(mode.id)}
                                  className={cn(
                                    'p-2 rounded text-xs transition-all',
                                    colorBlindMode === mode.id
                                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                      : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-transparent'
                                  )}
                                >
                                  {mode.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Reduce Motion */}
                          <button
                            onClick={toggleReducedMotion}
                            className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            role="switch"
                            aria-checked={reducedMotion}
                            aria-label="Reduce motion animations"
                          >
                            <span className="text-sm text-slate-300">Reduce Motion</span>
                            <div
                              className={cn(
                                'w-9 h-5 rounded-full transition-colors relative',
                                reducedMotion ? 'bg-purple-500' : 'bg-slate-600'
                              )}
                              aria-hidden="true"
                            >
                              <div
                                className={cn(
                                  'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
                                  reducedMotion ? 'left-4' : 'left-0.5'
                                )}
                              />
                            </div>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Collapsed preview */}
                  {expandedSection !== 'accessibility' && (
                    <div className="text-xs text-slate-500">
                      {textSize !== 'default' && <span className="mr-2">Text: {textSize}</span>}
                      {colorBlindMode !== 'default' && <span className="mr-2">Color: {colorBlindMode}</span>}
                      {reducedMotion && <span>Motion: Off</span>}
                      {textSize === 'default' && colorBlindMode === 'default' && !reducedMotion && (
                        <span>Default settings</span>
                      )}
                    </div>
                  )}
                </div>

                {/* ══════════════════════════════════════════════════════════════
                   PROFILE SECTION
                   ══════════════════════════════════════════════════════════════ */}
                <div className="p-3 border-b border-white/5 space-y-1">
                  {onShowReport ? (
                    <button
                      onClick={() => {
                        onShowReport()
                        setIsOpen(false)
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
                    >
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-slate-300">Career Profile</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 opacity-50">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-500">Career Profile (unavailable)</span>
                    </div>
                  )}

                  {playerId ? (
                    <Link
                      href={`/admin/${playerId}`}
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <Brain className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-slate-300">Clinical Audit</span>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 opacity-50">
                      <Brain className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-500">Clinical Audit (start game first)</span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      router.push('/profile')
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300">All Settings</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 ml-auto" />
                  </button>
                </div>

                {/* ══════════════════════════════════════════════════════════════
                   ACCOUNT SECTION
                   ══════════════════════════════════════════════════════════════ */}
                <div className="p-3">
                  {authLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                    </div>
                  ) : user ? (
                    <div className="space-y-3">
                      {/* User Info */}
                      <div className="flex items-center gap-3 p-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          {user.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white font-medium truncate">
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {(role === 'educator' || role === 'admin') && (
                              <Shield className="w-3 h-3 text-amber-400" />
                            )}
                            <span className="text-xs text-slate-400 capitalize">{role}</span>
                          </div>
                        </div>
                      </div>

                      {/* Sign Out */}
                      <button
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors text-red-400 text-sm disabled:opacity-50"
                      >
                        {signingOut ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <LogOut className="w-4 h-4" />
                        )}
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowLoginModal(true)
                        setIsOpen(false)
                      }}
                      className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors text-amber-400 text-sm"
                    >
                      <User className="w-4 h-4" />
                      <span>Sign In</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}
