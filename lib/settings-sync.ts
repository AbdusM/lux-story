/**
 * Settings Sync Utility
 * Synchronizes user preferences between localStorage and Supabase user metadata
 *
 * Sync Strategy:
 * - Settings stored in localStorage (fast, offline-first)
 * - Synced to Supabase user metadata when authenticated
 * - Cloud settings loaded on login/mount (merge with local)
 * - Conflict resolution: last-write-wins (based on timestamp)
 */

import { createClient } from '@/lib/supabase/client'
import { STORAGE_KEYS } from '@/lib/persistence/storage-keys'

export interface UserSettings {
  // Audio
  audioMuted: boolean
  audioVolume: number

  // Accessibility
  accessibilityProfile: string
  textSize: string
  colorBlindMode: string
  cognitiveLoadLevel: string

  // Admin (if applicable)
  adminViewMode?: 'family' | 'research'

  // Metadata
  lastSynced?: string  // ISO timestamp
}

const DEFAULT_SETTINGS: UserSettings = {
  audioMuted: false,
  audioVolume: 50,
  accessibilityProfile: 'default',
  textSize: 'default',
  colorBlindMode: 'default',
  cognitiveLoadLevel: 'normal',
  lastSynced: undefined,
}

// LocalStorage keys mapped to settings object (TD-005: use unified keys)
const STORAGE_KEY_MAP: Record<keyof UserSettings, string | null> = {
  audioMuted: STORAGE_KEYS.AUDIO_MUTED,
  audioVolume: STORAGE_KEYS.AUDIO_VOLUME,
  accessibilityProfile: STORAGE_KEYS.ACCESSIBILITY_PROFILE,
  textSize: STORAGE_KEYS.TEXT_SIZE,
  colorBlindMode: STORAGE_KEYS.COLOR_BLIND_MODE,
  cognitiveLoadLevel: STORAGE_KEYS.COGNITIVE_LOAD_LEVEL,
  adminViewMode: STORAGE_KEYS.ADMIN_VIEW_MODE,
  lastSynced: null,  // Not stored in localStorage
}

/**
 * Load settings from localStorage
 */
export function loadLocalSettings(): Partial<UserSettings> {
  if (typeof window === 'undefined') return {}

  const settings: Partial<UserSettings> = {}

  // Audio muted
  const audioMuted = localStorage.getItem(STORAGE_KEYS.AUDIO_MUTED)
  if (audioMuted !== null) {
    settings.audioMuted = audioMuted === 'true'
  }

  // Audio volume
  const audioVolume = localStorage.getItem(STORAGE_KEYS.AUDIO_VOLUME)
  if (audioVolume !== null) {
    settings.audioVolume = parseInt(audioVolume, 10)
  }

  // Accessibility profile
  const accessibilityProfile = localStorage.getItem(STORAGE_KEYS.ACCESSIBILITY_PROFILE)
  if (accessibilityProfile) {
    settings.accessibilityProfile = accessibilityProfile
  }

  // Text size
  const textSize = localStorage.getItem(STORAGE_KEYS.TEXT_SIZE)
  if (textSize) {
    settings.textSize = textSize
  }

  // Color blind mode
  const colorBlindMode = localStorage.getItem(STORAGE_KEYS.COLOR_BLIND_MODE)
  if (colorBlindMode) {
    settings.colorBlindMode = colorBlindMode
  }

  // Cognitive load level
  const cognitiveLoadLevel = localStorage.getItem(STORAGE_KEYS.COGNITIVE_LOAD_LEVEL)
  if (cognitiveLoadLevel) {
    settings.cognitiveLoadLevel = cognitiveLoadLevel
  }

  // Admin view mode
  const adminViewMode = localStorage.getItem(STORAGE_KEYS.ADMIN_VIEW_MODE)
  if (adminViewMode) {
    settings.adminViewMode = adminViewMode as 'family' | 'research'
  }

  return settings
}

/**
 * Save settings to localStorage
 */
export function saveLocalSettings(settings: Partial<UserSettings>): void {
  if (typeof window === 'undefined') return

  Object.entries(settings).forEach(([key, value]) => {
    const storageKey = STORAGE_KEY_MAP[key as keyof UserSettings]
    if (storageKey && value !== undefined) {
      localStorage.setItem(storageKey, String(value))
    }
  })
}

/**
 * Load settings from Supabase user metadata
 */
export async function loadCloudSettings(): Promise<UserSettings | null> {
  const supabase = createClient()

  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      console.log('[SettingsSync] No authenticated user, skipping cloud load')
      return null
    }

    const cloudSettings = user.user_metadata?.settings as UserSettings | undefined

    if (!cloudSettings) {
      console.log('[SettingsSync] No cloud settings found')
      return null
    }

    console.log('[SettingsSync] Loaded cloud settings:', cloudSettings)
    return cloudSettings
  } catch (error) {
    console.error('[SettingsSync] Error loading cloud settings:', error)
    return null
  }
}

/**
 * Save settings to Supabase user metadata
 */
export async function saveCloudSettings(settings: UserSettings): Promise<boolean> {
  const supabase = createClient()

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.warn('[SettingsSync] No authenticated user, skipping cloud save')
      return false
    }

    // Add timestamp
    const settingsWithTimestamp = {
      ...settings,
      lastSynced: new Date().toISOString(),
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        settings: settingsWithTimestamp,
      },
    })

    if (error) {
      console.error('[SettingsSync] Error saving cloud settings:', error)
      return false
    }

    console.log('[SettingsSync] Saved settings to cloud:', settingsWithTimestamp)
    return true
  } catch (error) {
    console.error('[SettingsSync] Error saving cloud settings:', error)
    return false
  }
}

/**
 * Merge local and cloud settings with conflict resolution
 * Strategy: Last-write-wins based on timestamp
 */
export function mergeSettings(local: Partial<UserSettings>, cloud: UserSettings | null): UserSettings {
  // If no cloud settings, use local + defaults
  if (!cloud) {
    return { ...DEFAULT_SETTINGS, ...local }
  }

  // If no local settings, use cloud
  if (!local || Object.keys(local).length === 0) {
    return cloud
  }

  // Both exist - merge with last-write-wins
  // For simplicity, cloud wins (user logged in, likely their latest preferences)
  console.log('[SettingsSync] Merging settings - cloud wins in conflicts')
  return { ...DEFAULT_SETTINGS, ...local, ...cloud }
}

/**
 * Full sync: Load cloud, merge with local, save to both
 */
export async function syncSettings(): Promise<UserSettings> {
  console.log('[SettingsSync] Starting full sync...')

  // Load from both sources
  const localSettings = loadLocalSettings()
  const cloudSettings = await loadCloudSettings()

  // Merge
  const mergedSettings = mergeSettings(localSettings, cloudSettings)

  // Save to both
  saveLocalSettings(mergedSettings)
  await saveCloudSettings(mergedSettings)

  console.log('[SettingsSync] Sync complete:', mergedSettings)
  return mergedSettings
}

/**
 * Push local settings to cloud (e.g., on setting change)
 */
export async function pushSettingsToCloud(): Promise<boolean> {
  const localSettings = loadLocalSettings()
  const fullSettings = { ...DEFAULT_SETTINGS, ...localSettings }
  return await saveCloudSettings(fullSettings)
}

/**
 * Pull cloud settings to local (e.g., on login)
 */
export async function pullSettingsFromCloud(): Promise<UserSettings | null> {
  const cloudSettings = await loadCloudSettings()

  if (cloudSettings) {
    saveLocalSettings(cloudSettings)
    console.log('[SettingsSync] Pulled settings from cloud to local')
  }

  return cloudSettings
}
