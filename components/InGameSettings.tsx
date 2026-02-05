/**
 * In-Game Settings Gear
 * Floating accessibility quick-access panel
 *
 * Features:
 * - 44x44 gear icon in bottom-right corner
 * - Opens mini-panel with quick toggles
 * - Text size, color blind mode, motion reduction
 * - Respects safe area insets on mobile
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Settings, X, Type, Palette, Sparkles, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLargeTextMode } from '@/hooks/useLargeTextMode'
import { useColorBlindMode } from '@/hooks/useColorBlindMode'
import { useSettingsSync } from '@/hooks/useSettingsSync'
import { STORAGE_KEYS } from '@/lib/persistence/storage-keys'
import { useToast } from '@/components/ui/toast'
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
  { id: 'default', label: 'Default' },
  { id: 'protanopia', label: 'Protanopia' },
  { id: 'deuteranopia', label: 'Deuteranopia' },
  { id: 'highContrast', label: 'High Contrast' },
] as const

interface InGameSettingsProps {
  className?: string
}

export function InGameSettings({ className }: InGameSettingsProps) {
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()

  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<'main' | 'text' | 'color'>('main')
  const [showPulse, setShowPulse] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // Show pulse animation on first visit (once only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS_DISCOVERED)
      if (!hasSeenSettings) {
        setShowPulse(true)
      }
    }
  }, [])

  // Settings hooks
  const { textSize, setTextSize } = useLargeTextMode()
  const [colorBlindMode, setColorBlindMode] = useColorBlindMode()
  const { pushNow, isOnline } = useSettingsSync()
  const toast = useToast()

  // Reduced motion preference from system
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.REDUCED_MOTION)
      setReducedMotion(stored === 'true')
    }
  }, [])

  // Toggle panel
  const togglePanel = useCallback(() => {
    setIsOpen(prev => !prev)
    setActiveSection('main') // Reset to main when reopening
    // Mark settings as discovered (stops pulse animation)
    if (showPulse) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS_DISCOVERED, 'true')
      setShowPulse(false)
    }
  }, [showPulse])

  // Handle text size change with sync
  const handleTextSizeChange = useCallback(async (value: typeof TEXT_SIZES[number]['id']) => {
    setTextSize(value)
    const result = await pushNow()
    if (result.success) {
      toast.syncSuccess()
    } else if (!isOnline) {
      toast.offlineNotice()
    }
  }, [setTextSize, pushNow, isOnline, toast])

  // Handle color mode change with sync
  const handleColorModeChange = useCallback(async (value: typeof COLOR_MODES[number]['id']) => {
    setColorBlindMode(value)
    const result = await pushNow()
    if (result.success) {
      toast.syncSuccess()
    } else if (!isOnline) {
      toast.offlineNotice()
    }
  }, [setColorBlindMode, pushNow, isOnline, toast])

  // Handle reduced motion toggle
  const toggleReducedMotion = useCallback(async () => {
    const newValue = !reducedMotion
    setReducedMotion(newValue)
    localStorage.setItem(STORAGE_KEYS.REDUCED_MOTION, String(newValue))
    document.documentElement.classList.toggle('reduce-motion', newValue)
    const result = await pushNow()
    if (result.success) {
      toast.syncSuccess()
    } else if (!isOnline) {
      toast.offlineNotice()
    }
  }, [reducedMotion, pushNow, isOnline, toast])

  // Go to full settings page
  const goToFullSettings = useCallback(() => {
    router.push('/profile')
  }, [router])

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <>
      {/* Gear Button - Fixed position with tooltip */}
      <div
        className="fixed z-50"
        style={{
          right: '16px',
          bottom: 'max(16px, calc(env(safe-area-inset-bottom, 0px) + 8px))',
        }}
        onMouseEnter={() => !isOpen && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={springs.snappy}
              className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg bg-slate-800/95 text-xs text-white border border-white/10 shadow-lg"
            >
              Settings & Accessibility
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring for first-time users */}
        {showPulse && !prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-amber-400/60"
            animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <button
          onClick={togglePanel}
          className={cn(
            'relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200',
            'bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10',
            'shadow-lg shadow-black/20',
            isOpen && 'bg-white/20',
            showPulse && 'border-amber-400/30',
            className
          )}
          aria-label={isOpen ? 'Close settings' : 'Open quick settings'}
          aria-expanded={isOpen}
          aria-controls="in-game-settings-panel"
        >
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={springs.snappy}
          >
            {isOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Settings className={cn('w-5 h-5', showPulse ? 'text-amber-400' : 'text-white/80')} />
            )}
          </motion.div>
        </button>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="in-game-settings-panel"
            role="dialog"
            aria-label="Quick settings"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
            transition={springs.smooth}
            className="fixed z-40 glass-panel !rounded-xl p-4 w-72 max-h-[400px] overflow-hidden"
            style={{
              right: '16px',
              bottom: 'max(72px, calc(env(safe-area-inset-bottom, 0px) + 64px))',
            }}
          >
            {/* Main Menu */}
            {activeSection === 'main' && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Quick Settings
                </h3>

                {/* Text Size Option */}
                <button
                  onClick={() => setActiveSection('text')}
                  className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Type className="w-5 h-5 text-amber-400" />
                    <div className="text-left">
                      <span className="block text-sm text-white">Text Size</span>
                      <span className="block text-xs text-slate-500 capitalize">{textSize.replace('-', ' ')}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </button>

                {/* Color Mode Option */}
                <button
                  onClick={() => setActiveSection('color')}
                  className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Palette className="w-5 h-5 text-purple-400" />
                    <div className="text-left">
                      <span className="block text-sm text-white">Color Mode</span>
                      <span className="block text-xs text-slate-500 capitalize">
                        {colorBlindMode === 'default' ? 'Standard' : colorBlindMode}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </button>

                {/* Reduce Motion Toggle */}
                <button
                  onClick={toggleReducedMotion}
                  className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-white">Reduce Motion</span>
                  </div>
                  <div
                    className={cn(
                      'w-10 h-6 rounded-full transition-colors relative',
                      reducedMotion ? 'bg-amber-500' : 'bg-slate-600'
                    )}
                  >
                    <div
                      className={cn(
                        'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                        reducedMotion ? 'left-5' : 'left-1'
                      )}
                    />
                  </div>
                </button>

                {/* Divider */}
                <div className="border-t border-white/10 my-3" />

                {/* Go to Full Settings */}
                <button
                  onClick={goToFullSettings}
                  className="w-full p-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors text-amber-400 text-sm font-medium"
                >
                  All Settings
                </button>
              </div>
            )}

            {/* Text Size Submenu */}
            {activeSection === 'text' && (
              <div className="space-y-2">
                <button
                  onClick={() => setActiveSection('main')}
                  className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-3 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Back
                </button>

                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Type className="w-4 h-4 text-amber-400" />
                  Text Size
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  {TEXT_SIZES.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => handleTextSizeChange(size.id)}
                      className={cn(
                        'p-3 rounded-lg text-sm transition-all',
                        textSize === size.id
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-transparent'
                      )}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Mode Submenu */}
            {activeSection === 'color' && (
              <div className="space-y-2">
                <button
                  onClick={() => setActiveSection('main')}
                  className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-3 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Back
                </button>

                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-400" />
                  Color Mode
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  {COLOR_MODES.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => handleColorModeChange(mode.id)}
                      className={cn(
                        'p-3 rounded-lg text-sm transition-all',
                        colorBlindMode === mode.id
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-transparent'
                      )}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-30 bg-black/20"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  )
}
