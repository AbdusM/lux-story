/**
 * Settings Sync Hook
 * Automatically syncs user settings between localStorage and Supabase
 *
 * Usage:
 * - Call useSettingsSync() at the top level of your component
 * - It will automatically sync on mount and when user auth state changes
 * - Call syncNow() to manually trigger a sync (e.g., after changing a setting)
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { syncSettings, pushSettingsToCloud, pullSettingsFromCloud } from '@/lib/settings-sync'

interface UseSettingsSyncReturn {
  isSyncing: boolean
  lastSyncTime: Date | null
  syncNow: () => Promise<void>
  pushNow: () => Promise<void>
  pullNow: () => Promise<void>
}

export function useSettingsSync(): UseSettingsSyncReturn {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

  const supabase = createClient()

  // Manual full sync
  const syncNow = useCallback(async () => {
    setIsSyncing(true)
    try {
      await syncSettings()
      setLastSyncTime(new Date())
    } catch (error) {
      console.error('[useSettingsSync] Sync error:', error)
    } finally {
      setIsSyncing(false)
    }
  }, [])

  // Push local to cloud
  const pushNow = useCallback(async () => {
    setIsSyncing(true)
    try {
      await pushSettingsToCloud()
      setLastSyncTime(new Date())
    } catch (error) {
      console.error('[useSettingsSync] Push error:', error)
    } finally {
      setIsSyncing(false)
    }
  }, [])

  // Pull cloud to local
  const pullNow = useCallback(async () => {
    setIsSyncing(true)
    try {
      await pullSettingsFromCloud()
      setLastSyncTime(new Date())
    } catch (error) {
      console.error('[useSettingsSync] Pull error:', error)
    } finally {
      setIsSyncing(false)
    }
  }, [])

  // Auto-sync on mount and when auth state changes
  useEffect(() => {
    let mounted = true

    const initSync = async () => {
      // Initial pull from cloud (if user is logged in)
      const { data: { user } } = await supabase.auth.getUser()

      if (user && mounted) {
        console.log('[useSettingsSync] User authenticated, pulling settings from cloud...')
        await pullNow()
      }
    }

    initSync()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('[useSettingsSync] User signed in, pulling settings from cloud...')
        await pullNow()
      } else if (event === 'SIGNED_OUT') {
        console.log('[useSettingsSync] User signed out, keeping local settings')
        // Don't clear settings on logout - keep localStorage as backup
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [pullNow, supabase.auth])

  // Periodic push to cloud (every 5 minutes if user is authenticated)
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        console.log('[useSettingsSync] Periodic push to cloud...')
        await pushNow()
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(intervalId)
  }, [pushNow, supabase.auth])

  return {
    isSyncing,
    lastSyncTime,
    syncNow,
    pushNow,
    pullNow,
  }
}
