/**
 * User Profile & Settings Page
 * Unified location for all user preferences and account settings
 */

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX, User, Eye, Brain, Palette, Monitor, LogOut, Cloud, CloudOff, Loader2, Download, Upload, Keyboard, Shield, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAccessibilityProfile } from '@/hooks/useAccessibilityProfile'
import { useLargeTextMode } from '@/hooks/useLargeTextMode'
import { useColorBlindMode } from '@/hooks/useColorBlindMode'
import { useCognitiveLoad } from '@/hooks/useCognitiveLoad'
import { useUserRole } from '@/hooks/useUserRole'
import type { AccessibilityProfile } from '@/lib/accessibility-profiles'
import type { TextSizePreset } from '@/lib/large-text-mode'
import type { ColorBlindMode } from '@/lib/patterns'
import type { CognitiveLoadLevel } from '@/lib/cognitive-load'
import { useSettingsSync } from '@/hooks/useSettingsSync'
import { useToast } from '@/components/ui/toast'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { loadLocalSettings } from '@/lib/settings-sync'
import { CATEGORY_LABELS, formatKeyCombo } from '@/lib/keyboard-shortcuts'
import type { KeyboardShortcut } from '@/lib/keyboard-shortcuts'
import { springs } from '@/lib/animations'
import type {
  ResearchConsentResponse,
  ResearchParticipationLevel,
} from '@/lib/research-consent'
import { ensureUserApiSession } from '@/lib/user-api-session'
import { GameStateManager } from '@/lib/game-state-manager'
import { UI_STORAGE_KEYS } from '@/lib/ui-constants'
import { deriveJourneyLaneSummary } from '@/lib/journey-lane'
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

const PLAYER_ID_STORAGE_KEYS = ['lux-player-id', 'playerId', 'gameUserId'] as const

const RESEARCH_PARTICIPATION_OPTIONS: Array<{
  id: ResearchParticipationLevel
  title: string
  description: string
}> = [
  {
    id: 'none',
    title: 'No Research Sharing',
    description: 'Disable identified exports and longitudinal research access.',
  },
  {
    id: 'cohort_only',
    title: 'Anonymous Cohort Only',
    description: 'Allow pseudonymized cohort analysis without identified export.',
  },
  {
    id: 'individual_research',
    title: 'Individual Research',
    description: 'Allow identified single-participant export when consent is granted.',
  },
  {
    id: 'full_research',
    title: 'Full Longitudinal Research',
    description: 'Allow identified export plus longitudinal timeline analysis.',
  },
]

function loadStoredPlayerId(): string | null {
  if (typeof window === 'undefined') return null

  for (const key of PLAYER_ID_STORAGE_KEYS) {
    const value = localStorage.getItem(key)
    if (value) return value
  }

  return null
}

function formatConsentStatus(status: ResearchConsentResponse['status'] | null): string {
  if (status === 'granted') return 'Granted'
  if (status === 'pending') return 'Pending'
  if (status === 'revoked') return 'Revoked'
  return 'Not Set'
}

const PROFILE_SURFACE_CLASS =
  'relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(2,6,23,0.92))] shadow-[0_28px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl'

const PROFILE_INSET_CLASS =
  'rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl'

const RESEARCH_SETTINGS_UNAVAILABLE_MESSAGE =
  'Research settings are temporarily unavailable on this deployment. Your journey progress is unaffected.'

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const { role } = useUserRole()

  const [activeTab, setActiveTab] = useState<TabId>('account')
  const [user, setUser] = useState<{ email?: string; created_at?: string } | null>(null)
  const [saveMetadata, setSaveMetadata] = useState<ReturnType<typeof GameStateManager.getSaveMetadata> | null>(null)
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

  // Research consent
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [consent, setConsent] = useState<ResearchConsentResponse | null>(null)
  const [consentLoading, setConsentLoading] = useState(true)
  const [consentSaving, setConsentSaving] = useState(false)
  const [consentError, setConsentError] = useState<string | null>(null)
  const [participationLevel, setParticipationLevel] =
    useState<ResearchParticipationLevel>('none')
  const [guardianRequired, setGuardianRequired] = useState(false)
  const [guardianVerified, setGuardianVerified] = useState(false)

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    loadUser()
  }, [supabase.auth])

  useEffect(() => {
    const storedPlayerId = loadStoredPlayerId()
    setPlayerId(storedPlayerId)
    setSaveMetadata(GameStateManager.getSaveMetadata())
  }, [])

  useEffect(() => {
    if (!playerId) {
      setConsentLoading(false)
      setConsent(null)
      setConsentError('Start the game once on this device to create a player record before managing research participation.')
      return
    }

    let cancelled = false

    const loadConsent = async () => {
      setConsentLoading(true)
      setConsentError(null)

      const sessionReady = await ensureUserApiSession(playerId)
      if (!sessionReady) {
        if (!cancelled) {
          setConsent(null)
          setConsentLoading(false)
          setConsentError(RESEARCH_SETTINGS_UNAVAILABLE_MESSAGE)
        }
        return
      }

      try {
        const response = await fetch(`/api/user/research-consent?userId=${encodeURIComponent(playerId)}`, {
          credentials: 'include',
        })
        const body = await response.json()

        if (!response.ok) {
          throw new Error(
            typeof body?.error === 'string' ? body.error : 'Unable to load research consent.'
          )
        }

        if (cancelled) return

        const nextConsent = (body.consent ?? null) as ResearchConsentResponse | null
        setConsent(nextConsent)
        setParticipationLevel(nextConsent?.selectedParticipation ?? 'none')
        setGuardianRequired(nextConsent?.guardianRequired ?? false)
        setGuardianVerified(nextConsent?.guardianVerified ?? false)
      } catch (error) {
        if (cancelled) return
        setConsent(null)
        setConsentError(error instanceof Error ? error.message : 'Unable to load research consent.')
      } finally {
        if (!cancelled) {
          setConsentLoading(false)
        }
      }
    }

    loadConsent()

    return () => {
      cancelled = true
    }
  }, [playerId])

  useEffect(() => {
    if (participationLevel === 'none') {
      setGuardianRequired(false)
      setGuardianVerified(false)
      return
    }

    if (!guardianRequired && guardianVerified) {
      setGuardianVerified(false)
    }
  }, [guardianRequired, guardianVerified, participationLevel])

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

  const handleSaveResearchConsent = useCallback(async () => {
    if (!playerId) {
      toast.error('Research consent unavailable', 'Start the game once to create a player record.')
      return
    }

    setConsentSaving(true)
    setConsentError(null)

    const sessionReady = await ensureUserApiSession(playerId)
    if (!sessionReady) {
      setConsentSaving(false)
      setConsentError(RESEARCH_SETTINGS_UNAVAILABLE_MESSAGE)
      toast.error('Research consent unavailable', 'Research settings are temporarily unavailable right now.')
      return
    }

    try {
      const response = await fetch('/api/user/research-consent', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user_id: playerId,
          consent_enabled: participationLevel !== 'none',
          consent_scope: participationLevel === 'none' ? 'cohort_only' : participationLevel,
          guardian_required: guardianRequired,
          guardian_verified: guardianVerified,
        }),
      })

      const body = await response.json()
      if (!response.ok) {
        throw new Error(
          typeof body?.error === 'string' ? body.error : 'Unable to save research consent.'
        )
      }

      const nextConsent = (body.consent ?? null) as ResearchConsentResponse | null
      setConsent(nextConsent)
      setParticipationLevel(nextConsent?.selectedParticipation ?? 'none')
      setGuardianRequired(nextConsent?.guardianRequired ?? false)
      setGuardianVerified(nextConsent?.guardianVerified ?? false)

      if (nextConsent?.status === 'granted') {
        toast.success('Research consent updated', 'Your export permissions are active.')
      } else if (nextConsent?.status === 'pending') {
        toast.warning('Research consent pending', 'Guardian verification is still required.')
      } else {
        toast.info('Research consent revoked', 'Identified research export is disabled.')
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to save research consent.'
      setConsentError(message)
      toast.error('Research consent failed', message)
    } finally {
      setConsentSaving(false)
    }
  }, [guardianRequired, guardianVerified, participationLevel, playerId, toast])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleOpenStrategyProfile = useCallback(() => {
    if (!saveMetadata?.exists) return

    localStorage.setItem(UI_STORAGE_KEYS.resumeToReport, 'true')
    router.push('/')
  }, [router, saveMetadata])

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

  const previewStatus =
    participationLevel === 'none'
      ? 'revoked'
      : guardianRequired && !guardianVerified
        ? 'pending'
        : 'granted'
  const previewAllowsIdentified =
    previewStatus === 'granted' &&
    (participationLevel === 'individual_research' || participationLevel === 'full_research')
  const previewAllowsLongitudinal =
    previewStatus === 'granted' && participationLevel === 'full_research'
  const showFacilitatorTools = Boolean(saveMetadata?.playerId && (role === 'educator' || role === 'admin'))
  const consentErrorToneClass = consentError === RESEARCH_SETTINGS_UNAVAILABLE_MESSAGE
    ? 'bg-amber-500/10 border-amber-500/20 text-amber-100'
    : 'bg-red-500/10 border-red-500/20 text-red-200'
  const journeySummary =
    typeof window === 'undefined' || !saveMetadata?.exists
      ? deriveJourneyLaneSummary(null)
      : deriveJourneyLaneSummary(GameStateManager.getSaveSnapshot())

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070b] px-4 py-4 text-white sm:px-6 sm:py-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_28%),radial-gradient(circle_at_bottom,rgba(139,92,246,0.12),transparent_32%)]" />
      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.smooth}
          className="mb-8"
        >
          <div className={cn(PROFILE_SURFACE_CLASS, 'p-6 sm:p-8')}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_36%)]" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-amber-100/80">
                  <Shield className="h-3.5 w-3.5" />
                  Profile Lane
                </div>
                <div>
                  <h1 className="mb-2 bg-gradient-to-r from-amber-300 via-white to-cyan-300 bg-clip-text text-3xl font-semibold text-transparent sm:text-4xl">
                    Profile & Settings
                  </h1>
                  <p className="max-w-2xl text-sm leading-relaxed text-slate-300/80 sm:text-base">
                    Keep your route record, system controls, and research permissions in one place without dragging utility surfaces back into the story lane.
                  </p>
                </div>
              </div>

              <div className={cn(PROFILE_INSET_CLASS, 'min-w-[220px] p-4')}>
                <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">Sync Status</p>
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  {isSyncing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                      <span>Syncing preferences…</span>
                    </>
                  ) : user ? (
                    <>
                      <Cloud className="h-4 w-4 text-emerald-400" />
                      <span>
                        {lastSyncTime
                          ? `Synced ${new Date(lastSyncTime).toLocaleTimeString()}`
                          : 'Cloud sync enabled'}
                      </span>
                    </>
                  ) : (
                    <>
                      <CloudOff className="h-4 w-4 text-slate-500" />
                      <span>Local-only settings</span>
                    </>
                  )}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  Profile Lane keeps your held route, consent choices, and system tools nearby while play stays immersive.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className={cn(PROFILE_SURFACE_CLASS, 'mb-6 p-3')}>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2 sm:overflow-x-auto sm:pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all sm:min-w-fit sm:px-4 sm:whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-amber-400/30 bg-amber-400/15 text-amber-100 shadow-[0_10px_30px_rgba(245,158,11,0.18)]'
                    : 'border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white'
                )}
              >
                <span className="shrink-0 opacity-90">{tab.icon}</span>
                <span className="min-w-0 whitespace-normal font-medium leading-tight sm:whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springs.gentle}
          className={cn(PROFILE_SURFACE_CLASS, 'p-6 space-y-6')}
        >
          {/* Account Tab */}
          {activeTab === 'account' && (
            <>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    Journey Artifacts
                  </h2>
                  <p className="text-sm text-slate-400 max-w-2xl">
                    The station keeps a trace of where you were headed, which signal has been strongest, and who is ready when you return.
                  </p>
                </div>

                {saveMetadata?.exists ? (
                  <div className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <div className={cn(PROFILE_INSET_CLASS, 'space-y-2 p-4')}>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Current Chapter</p>
                        <p className="text-lg font-semibold text-white">Episode {journeySummary.episodeNumber}</p>
                        <p className="text-sm leading-relaxed text-slate-300/80">
                          {journeySummary.unlockedAbilitiesCount > 0
                            ? `${journeySummary.unlockedAbilitiesCount} station tool${journeySummary.unlockedAbilitiesCount === 1 ? '' : 's'} already answer to you.`
                            : `${journeySummary.voicesReachedCount} traveler${journeySummary.voicesReachedCount === 1 ? '' : 's'} have already bent the route with you.`}
                        </p>
                      </div>

                      <div className={cn(PROFILE_INSET_CLASS, 'space-y-2 p-4')}>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Held Route</p>
                        <p className="text-lg font-semibold text-white">{journeySummary.heldRouteLabel}</p>
                        <p className="text-sm leading-relaxed text-slate-300/80">
                          {journeySummary.heldRouteNote}
                        </p>
                      </div>

                      <div className={cn(PROFILE_INSET_CLASS, 'space-y-2 p-4')}>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Strongest Signal</p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-semibold text-white">{journeySummary.dominantPatternLabel}</p>
                          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-200/85">
                            {journeySummary.dominantPatternScore}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-300/80">
                          {journeySummary.dominantPatternSummary}
                        </p>
                      </div>

                      <div className={cn(PROFILE_INSET_CLASS, 'space-y-2 p-4')}>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Open Returns</p>
                        <p className="text-lg font-semibold text-white">
                          {journeySummary.openReturnsCount > 0
                            ? `${journeySummary.openReturnsCount} waiting`
                            : 'Quiet for now'}
                        </p>
                        <p className="text-sm leading-relaxed text-slate-300/80">
                          {journeySummary.openReturnsNote}
                        </p>
                      </div>
                    </div>

                    <div className={cn(PROFILE_INSET_CLASS, 'p-4')}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">Career Strategy Profile</p>
                          <p className="text-xs text-slate-400">
                            Resume your route and open the deeper strategy view without pushing reports back into the story shell.
                          </p>
                          {saveMetadata.lastSaved && (
                            <p className="mt-2 text-xs text-slate-500">
                              Last saved {saveMetadata.lastSaved.toLocaleString()}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleOpenStrategyProfile}
                          className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-300 transition-colors hover:bg-amber-500/20"
                        >
                          Open Career Strategy Profile
                        </button>
                      </div>
                    </div>

                    {showFacilitatorTools && saveMetadata.playerId && (
                      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 backdrop-blur-xl">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-medium text-white">Facilitator Tools</p>
                            <p className="text-xs text-slate-400">
                              Admin tooling stays outside the immersive shell and opens in the dedicated dashboard lane.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => router.push(`/admin/${saveMetadata.playerId}`)}
                            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
                          >
                            Open Clinical Audit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={cn(PROFILE_INSET_CLASS, 'p-4 text-sm text-slate-300')}>
                    Start or resume a journey on this device before opening the career strategy profile.
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10">
                <h2 className="mb-4 text-xl font-semibold">Account Information</h2>
                {loading ? (
                  <p className="text-slate-400">Loading...</p>
                ) : user ? (
                  <div className={cn(PROFILE_INSET_CLASS, 'space-y-3 p-4')}>
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
                  <div className={cn(PROFILE_INSET_CLASS, 'p-4 text-slate-400')}>Not signed in</div>
                )}
              </div>

              <div id="research-consent" className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-400" />
                      Research Participation
                    </h2>
                    <p className="text-sm text-slate-400 max-w-2xl">
                      Optional utility layer. Control whether your data can be used for pseudonymized cohort analysis,
                      identified single-participant export, or full longitudinal research.
                    </p>
                  </div>

                  <div
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-medium',
                      consent?.status === 'granted'
                        ? 'bg-green-500/10 text-green-300 border-green-500/30'
                        : consent?.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800/60 text-slate-300 border-slate-700/60'
                    )}
                  >
                    {formatConsentStatus(consent?.status ?? null)}
                  </div>
                </div>

                {playerId ? (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">
                      Device-linked player record ready for research settings.
                    </p>
                    <details className="text-xs text-slate-500">
                      <summary className="cursor-pointer list-none text-slate-400 transition-colors hover:text-slate-200">
                        Show technical record ID
                      </summary>
                      <p className="mt-2 font-mono text-slate-300">{playerId}</p>
                    </details>
                  </div>
                ) : (
                  <div className={cn(PROFILE_INSET_CLASS, 'p-4 text-sm text-slate-300')}>
                    Start the game once on this device before managing research participation.
                  </div>
                )}

                {consentError && (
                  <div className={cn('rounded-lg border p-4 text-sm', consentErrorToneClass)}>
                    {consentError}
                  </div>
                )}

                {playerId && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {RESEARCH_PARTICIPATION_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setParticipationLevel(option.id)}
                          disabled={consentLoading || consentSaving}
                          className={cn(
                            'text-left p-4 rounded-lg border transition-all',
                            participationLevel === option.id
                              ? 'bg-amber-500/15 border-amber-500/40 text-white'
                              : 'bg-slate-800/30 border-slate-700/60 text-slate-300 hover:border-slate-500/60',
                            (consentLoading || consentSaving) && 'opacity-60 cursor-not-allowed'
                          )}
                        >
                          <div className="font-medium mb-1">{option.title}</div>
                          <div className="text-sm text-slate-400">{option.description}</div>
                        </button>
                      ))}
                    </div>

                    <div className={cn(PROFILE_INSET_CLASS, 'space-y-3 p-4')}>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-white">Guardian Approval</p>
                          <p className="text-xs text-slate-400">
                            Mark this if a guardian must approve research participation for this player.
                          </p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={guardianRequired}
                          aria-label="Guardian approval required"
                          disabled={participationLevel === 'none' || consentLoading || consentSaving}
                          onClick={() => setGuardianRequired((current) => !current)}
                          className={cn(
                            'relative w-11 h-6 rounded-full transition-colors',
                            guardianRequired ? 'bg-amber-500/40' : 'bg-slate-700',
                            (participationLevel === 'none' || consentLoading || consentSaving) &&
                              'opacity-50 cursor-not-allowed'
                          )}
                        >
                          <span
                            className={cn(
                              'absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform',
                              guardianRequired && 'translate-x-5'
                            )}
                          />
                        </button>
                      </div>

                      {guardianRequired && participationLevel !== 'none' && (
                        <label className="flex items-start gap-3 text-sm text-slate-300">
                          <input
                            type="checkbox"
                            checked={guardianVerified}
                            disabled={consentLoading || consentSaving}
                            onChange={(event) => setGuardianVerified(event.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-900 text-amber-500 focus:ring-amber-500/50"
                          />
                          <span>
                            Guardian approval has been collected for this research participation setting.
                          </span>
                        </label>
                      )}

                      {participationLevel !== 'none' && guardianRequired && !guardianVerified && (
                        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                          This consent will remain pending until guardian approval is verified.
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className={cn(PROFILE_INSET_CLASS, 'p-3')}>
                        <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">
                          Cohort Analysis
                        </p>
                        <p className="text-sm text-white">
                          {previewStatus === 'revoked' ? 'Off' : 'Allowed'}
                        </p>
                      </div>
                      <div className={cn(PROFILE_INSET_CLASS, 'p-3')}>
                        <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">
                          Identified Export
                        </p>
                        <p className="text-sm text-white">
                          {previewAllowsIdentified ? 'Allowed' : 'Off'}
                        </p>
                      </div>
                      <div className={cn(PROFILE_INSET_CLASS, 'p-3')}>
                        <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">
                          Longitudinal Tracking
                        </p>
                        <p className="text-sm text-white">
                          {previewAllowsLongitudinal ? 'Allowed' : 'Off'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleSaveResearchConsent}
                        disabled={consentLoading || consentSaving}
                        className={cn(
                          'inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                          'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30',
                          (consentLoading || consentSaving) && 'opacity-60 cursor-not-allowed'
                        )}
                      >
                        {(consentLoading || consentSaving) && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        <span>Save Research Settings</span>
                      </button>

                      {consent?.status === 'revoked' && consent.revokedAt && (
                        <p className="text-xs text-slate-500">
                          Last revoked {new Date(consent.revokedAt).toLocaleString()}
                        </p>
                      )}
                      {consent?.status !== 'revoked' && consent?.consentedAt && (
                        <p className="text-xs text-slate-500">
                          Last granted {new Date(consent.consentedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </>
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
                    onChange={(e) => { setProfile(e.target.value as AccessibilityProfile); syncWithToast() }}
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
                        onClick={() => { setTextSize(size as TextSizePreset); syncWithToast() }}
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
                        onClick={() => { setColorBlindMode(mode as ColorBlindMode); syncWithToast() }}
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
                        onClick={() => { setCognitiveLoad(level as CognitiveLoadLevel); syncWithToast() }}
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
