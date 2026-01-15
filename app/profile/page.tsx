/**
 * User Profile & Settings Page
 * Unified location for all user preferences and account settings
 */

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX, User, Eye, Brain, Palette, Monitor, LogOut, Cloud, CloudOff, Loader2, Download, Upload, Keyboard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAccessibilityProfile } from '@/hooks/useAccessibilityProfile'
import { useLargeTextMode } from '@/hooks/useLargeTextMode'
import { useColorBlindMode } from '@/hooks/useColorBlindMode'
import { useCognitiveLoad } from '@/hooks/useCognitiveLoad'
import { useSettingsSync } from '@/hooks/useSettingsSync'
import { useToast } from '@/components/ui/toast'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { loadLocalSettings } from '@/lib/settings-sync'
import { CATEGORY_LABELS, formatKeyCombo } from '@/lib/keyboard-shortcuts'
import type { KeyboardShortcut } from '@/lib/keyboard-shortcuts'
import { springs } from '@/lib/animations'
import { cn } from '@/lib/utils'

type TabId = 'account' | 'audio' | 'accessibility' | 'display' | 'keyboard'

interface Tab {
  id: TabId
  label: string
  icon: React.ReactNode
}

const tabs: Tab[] = [
  { id: 'account', label: 'Account', icon: <User className="w-5 h-5" /> },
  { id: 'audio', label: 'Audio', icon: <Volume2 className="w-5 h-5" /> },
  { id: 'accessibility', label: 'Accessibility', icon: <Eye className="w-5 h-5" /> },
  { id: 'keyboard', label: 'Keyboard', icon: <Keyboard className="w-5 h-5" /> },
  { id: 'display', label: 'Display', icon: <Monitor className="w-5 h-5" /> },
]

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()

  const [activeTab, setActiveTab] = useState<TabId>('account')
  const [user, setUser] = useState<{ email?: string; created_at?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  // Audio settings
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lux_audio_muted') === 'true'
    }
    return false
  })

  const [audioVolume, setAudioVolume] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lux_audio_volume')
      return stored ? parseInt(stored, 10) : 50
    }
    return 50
  })

  // Accessibility hooks
  const { profile, setProfile, profiles } = useAccessibilityProfile()
  const { textSize, setTextSize } = useLargeTextMode()
  const [colorBlindMode, setColorBlindMode] = useColorBlindMode()
  const [cognitiveLoad, setCognitiveLoad] = useCognitiveLoad()

  // Settings sync
  const { isSyncing, lastSyncTime, isOnline, pushNow } = useSettingsSync()

  // Toast notifications
  const toast = useToast()

  // Keyboard shortcuts
  const { shortcuts, resetShortcuts } = useKeyboardShortcuts()

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    loadUser()
  }, [supabase.auth])

  const handleToggleMute = async () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    localStorage.setItem('lux_audio_muted', String(newMuted))
    const result = await pushNow()
    if (result.success) {
      toast.syncSuccess()
    } else if (!isOnline) {
      toast.offlineNotice()
    }
  }

  // Track user interactions vs initial mount
  const hasInteracted = useRef(false)
  const volumeChangeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleVolumeChange = (newVolume: number) => {
    hasInteracted.current = true
    setAudioVolume(newVolume)
    localStorage.setItem('lux_audio_volume', String(newVolume))

    // Debounce the sync and toast
    if (volumeChangeTimer.current) {
      clearTimeout(volumeChangeTimer.current)
    }
    volumeChangeTimer.current = setTimeout(async () => {
      const result = await pushNow()
      if (result.success) {
        toast.syncSuccess()
      } else if (!isOnline) {
        toast.offlineNotice()
      }
    }, 800)
  }

  // Sync and toast for accessibility changes
  const syncWithToast = useCallback(async () => {
    hasInteracted.current = true
    const result = await pushNow()
    if (result.success) {
      toast.syncSuccess()
    } else if (!isOnline) {
      toast.offlineNotice()
    }
  }, [pushNow, isOnline, toast])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleExportSettings = () => {
    const settings = loadLocalSettings()
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `lux-story-settings-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Settings exported', 'Download started')
  }

  const handleImportSettings = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const importedSettings = JSON.parse(text)

        // Apply imported settings to localStorage
        type SettingKey = 'audioMuted' | 'audioVolume' | 'accessibilityProfile' | 'textSize' | 'colorBlindMode' | 'cognitiveLoadLevel' | 'adminViewMode'

        const storageKeyMap: Record<SettingKey, string> = {
          audioMuted: 'lux_audio_muted',
          audioVolume: 'lux_audio_volume',
          accessibilityProfile: 'lux_accessibility_profile',
          textSize: 'lux_text_size',
          colorBlindMode: 'lux_color_blind_mode',
          cognitiveLoadLevel: 'lux_cognitive_load_level',
          adminViewMode: 'admin_view_preference',
        }

        Object.entries(importedSettings).forEach(([key, value]) => {
          const storageKey = storageKeyMap[key as SettingKey]

          if (storageKey && value !== undefined) {
            localStorage.setItem(storageKey, String(value))
          }
        })

        // Show success toast and reload page to apply settings
        toast.success('Settings imported', 'Reloading to apply changes...')
        setTimeout(() => window.location.reload(), 1500)
      } catch (error) {
        console.error('[Profile] Import error:', error)
        toast.error('Import failed', 'Please check the file format.')
      }
    }
    input.click()
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.smooth}
          className="mb-8"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-purple-600 mb-2">
                Profile & Settings
              </h1>
              <p className="text-slate-400">
                Manage your account and customize your experience
              </p>
            </div>

            {/* Sync Status */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              {isSyncing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Syncing...</span>
                </>
              ) : user ? (
                <>
                  <Cloud className="w-4 h-4 text-green-400" />
                  <span>
                    {lastSyncTime
                      ? `Synced ${new Date(lastSyncTime).toLocaleTimeString()}`
                      : 'Cloud sync enabled'}
                  </span>
                </>
              ) : (
                <>
                  <CloudOff className="w-4 h-4 text-slate-500" />
                  <span>Local only</span>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-700/50'
              )}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springs.gentle}
          className="glass-panel !rounded-xl p-6 space-y-6"
        >
          {/* Account Tab */}
          {activeTab === 'account' && (
            <>
              <div>
                <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                {loading ? (
                  <p className="text-slate-400">Loading...</p>
                ) : user ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-slate-400">Email</label>
                      <p className="text-white font-medium">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-400">Account Created</label>
                      <p className="text-white font-medium">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400">Not signed in</p>
                )}
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </>
          )}

          {/* Audio Tab */}
          {activeTab === 'audio' && (
            <>
              <div>
                <h2 className="text-xl font-semibold mb-4">Audio Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <div>
                      <h3 className="font-medium text-white">Sound Effects</h3>
                      <p className="text-sm text-slate-400">Pattern feedback and ambient audio</p>
                    </div>
                    <button
                      onClick={handleToggleMute}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                        isMuted
                          ? 'bg-slate-700/50 text-slate-400'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      )}
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                    </button>
                  </div>

                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white">Volume Level</h3>
                      <span className="text-amber-400 font-medium">{audioVolume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={audioVolume}
                      onChange={(e) => handleVolumeChange(parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      style={{
                        background: `linear-gradient(to right, rgb(245 158 11) 0%, rgb(245 158 11) ${audioVolume}%, rgb(51 65 85) ${audioVolume}%, rgb(51 65 85) 100%)`
                      }}
                    />
                    <p className="text-xs text-slate-500">
                      Adjust the volume of pattern feedback and ambient sounds
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Accessibility Tab */}
          {activeTab === 'accessibility' && (
            <>
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Eye className="w-6 h-6" />
                  Accessibility Settings
                </h2>

                {/* Accessibility Profile Presets */}
                <div className="space-y-3 mb-6">
                  <label className="block text-sm font-medium text-slate-300">
                    Profile Preset
                  </label>
                  <select
                    value={profile}
                    onChange={(e) => { setProfile(e.target.value as any); syncWithToast() }}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    {Object.entries(profiles).map(([key, config]) => (
                      <option key={key} value={key} className="bg-slate-900">
                        {config.label} - {config.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Text Size */}
                <div className="space-y-3 mb-6">
                  <label className="block text-sm font-medium text-slate-300">
                    Text Size
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['default', 'large', 'x-large', 'xx-large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => { setTextSize(size as any); syncWithToast() }}
                        className={cn(
                          'px-4 py-2 rounded-lg transition-all',
                          textSize === size
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800/80 border border-slate-700/50'
                        )}
                      >
                        {size.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Blind Mode */}
                <div className="space-y-3 mb-6">
                  <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Color Blind Mode
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['default', 'protanopia', 'deuteranopia', 'tritanopia', 'highContrast'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => { setColorBlindMode(mode as any); syncWithToast() }}
                        className={cn(
                          'px-4 py-2 rounded-lg transition-all text-sm',
                          colorBlindMode === mode
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800/80 border border-slate-700/50'
                        )}
                      >
                        {mode === 'default' ? 'Default' : mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cognitive Load Level */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Cognitive Load Level
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['minimal', 'reduced', 'normal', 'detailed'].map((level) => (
                      <button
                        key={level}
                        onClick={() => { setCognitiveLoad(level as any); syncWithToast() }}
                        className={cn(
                          'px-4 py-2 rounded-lg transition-all',
                          cognitiveLoad === level
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800/80 border border-slate-700/50'
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">
                    Adjusts the number and complexity of dialogue choices shown
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Keyboard Tab */}
          {activeTab === 'keyboard' && (
            <>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Keyboard className="w-6 h-6" />
                    Keyboard Shortcuts
                  </h2>
                  <button
                    onClick={resetShortcuts}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Reset to Defaults
                  </button>
                </div>

                <p className="text-sm text-slate-400">
                  Press <kbd className="px-2 py-1 bg-slate-700/50 rounded text-slate-300">?</kbd> in-game to view all shortcuts
                </p>

                {/* Shortcuts by Category */}
                {Object.entries(
                  Object.values(shortcuts).reduce((acc, shortcut) => {
                    if (!acc[shortcut.category]) {
                      acc[shortcut.category] = []
                    }
                    acc[shortcut.category].push(shortcut)
                    return acc
                  }, {} as Record<KeyboardShortcut['category'], KeyboardShortcut[]>)
                ).map(([category, categoryShortcuts]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      {CATEGORY_LABELS[category as KeyboardShortcut['category']]}
                    </h3>
                    <div className="space-y-2">
                      {categoryShortcuts.map((shortcut) => (
                        <div
                          key={shortcut.action}
                          className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50"
                        >
                          <span className="text-white">{shortcut.description}</span>
                          <kbd className="px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-md font-mono text-sm border border-slate-600">
                            {formatKeyCombo(shortcut.key)}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Display Tab */}
          {activeTab === 'display' && (
            <>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Display Settings</h2>
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-blue-400">
                      💡 Additional display settings (reduce motion, enlarge touch targets, etc.) are controlled by your accessibility profile preset.
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <h2 className="text-xl font-semibold mb-4">Settings Backup</h2>
                  <div className="space-y-3">
                    <p className="text-sm text-slate-400 mb-4">
                      Export your settings to back them up or transfer to another device. Import previously exported settings to restore your preferences.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={handleExportSettings}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg transition-colors"
                      >
                        <Download className="w-5 h-5" />
                        <span>Export Settings</span>
                      </button>

                      <button
                        onClick={handleImportSettings}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg transition-colors"
                      >
                        <Upload className="w-5 h-5" />
                        <span>Import Settings</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Back to Game */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, ...springs.gentle }}
          className="mt-6 text-center"
        >
          <button
            onClick={() => router.push('/')}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Game
          </button>
        </motion.div>
      </div>
    </div>
  )
}
