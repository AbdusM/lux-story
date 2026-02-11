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
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { syncSettings, pushSettingsToCloud, pullSettingsFromCloud } from '@/lib/settings-sync'

export type SyncResult = {
  success: boolean
  message?: string
}

interface UseSettingsSyncReturn {
  isSyncing: boolean
  lastSyncTime: Date | null
  lastSyncResult: SyncResult | null
  isOnline: boolean
  syncNow: () => Promise<SyncResult>
  pushNow: () => Promise<SyncResult>
  pullNow: () => Promise<SyncResult>
}

export function useSettingsSync(): UseSettingsSyncReturn {
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null)
  const [isOnline, setIsOnline] = useState(true)

  const supabase = createClient()

  // Check if user is authenticated (determines online/offline sync capability)
  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsOnline(!!user)
    }
    checkAuthStatus()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setIsOnline(!!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // Manual full sync
  const syncNow = useCallback(async (): Promise<SyncResult> => {
    setIsSyncing(true)
    try {
      await syncSettings()
      const result: SyncResult = { success: true, message: 'Settings synchronized' }
      setLastSyncTime(new Date())
      setLastSyncResult(result)
      return result
    } catch (error) {
      console.error('[useSettingsSync] Sync error:', error)
      const result: SyncResult = { success: false, message: 'Failed to sync settings' }
      setLastSyncResult(result)
      return result
    } finally {
      setIsSyncing(false)
    }
  }, [])

  // Push local to cloud
  const pushNow = useCallback(async (): Promise<SyncResult> => {
    setIsSyncing(true)
    try {
      const success = await pushSettingsToCloud()
      const result: SyncResult = success
        ? { success: true, message: 'Settings synced to cloud' }
        : { success: false, message: 'Not signed in - saved locally only' }
      if (success) {
        setLastSyncTime(new Date())
      }
      setLastSyncResult(result)
      return result
    } catch (error) {
      console.error('[useSettingsSync] Push error:', error)
      const result: SyncResult = { success: false, message: 'Failed to sync settings' }
      setLastSyncResult(result)
      return result
    } finally {
      setIsSyncing(false)
    }
  }, [])

  // Pull cloud to local
  const pullNow = useCallback(async (): Promise<SyncResult> => {
    setIsSyncing(true)
    try {
      const settings = await pullSettingsFromCloud()
      const result: SyncResult = settings
        ? { success: true, message: 'Settings loaded from cloud' }
        : { success: false, message: 'No cloud settings found' }
      if (settings) {
        setLastSyncTime(new Date())
      }
      setLastSyncResult(result)
      return result
    } catch (error) {
      console.error('[useSettingsSync] Pull error:', error)
      const result: SyncResult = { success: false, message: 'Failed to load settings' }
      setLastSyncResult(result)
      return result
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
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
    lastSyncResult,
    isOnline,
    syncNow,
    pushNow,
    pullNow,
  }
}
