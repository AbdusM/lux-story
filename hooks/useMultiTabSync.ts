"use client"

import { useEffect, useCallback, useRef } from 'react'
import { useGameStore } from '@/lib/game-store'
import { STORAGE_KEYS } from '@/lib/persistence/storage-keys'

/**
 * TD-006: Multi-Tab Coordination
 *
 * This hook prevents state corruption when the game is open in multiple tabs.
 * It listens for `storage` events (fired when localStorage changes in ANOTHER tab)
 * and rehydrates the Zustand store to stay in sync.
 *
 * Implementation notes:
 * - The `storage` event only fires in OTHER tabs, not the one making changes
 * - We debounce rehydration to prevent excessive refreshes
 * - We show a toast/notification when state is synced from another tab
 */

// TD-005: Use unified storage key
const DEBOUNCE_MS = 100

export function useMultiTabSync() {
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const lastSyncRef = useRef<number>(0)

  const handleStorageChange = useCallback((event: StorageEvent) => {
    // Only handle our storage key
    if (event.key !== STORAGE_KEYS.GAME_STORE) return

    // Debounce rapid changes
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      const now = Date.now()
      // Prevent sync flood (max once per second)
      if (now - lastSyncRef.current < 1000) return
      lastSyncRef.current = now

      try {
        // Access the persist API to rehydrate from localStorage
        const persist = (useGameStore as unknown as { persist?: { rehydrate: () => Promise<void> } }).persist
        if (persist?.rehydrate) {
          persist.rehydrate()
          console.info('[MultiTabSync] State rehydrated from another tab')
        }
      } catch (error) {
        console.warn('[MultiTabSync] Failed to rehydrate state:', error)
      }
    }, DEBOUNCE_MS)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Listen for storage changes from other tabs
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [handleStorageChange])
}

/**
 * Multi-tab conflict detection
 *
 * Returns information about potential conflicts when multiple tabs
 * are editing game state simultaneously.
 */
export function useMultiTabConflictDetection() {
  const lastSaveRef = useRef<number>(0)
  const tabIdRef = useRef<string>('')

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Generate unique tab ID
    tabIdRef.current = `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Register this tab in sessionStorage (survives reloads, but not new tabs)
    const registerTab = () => {
      try {
        const activeTabs = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVE_TABS) || '[]') as string[]
        if (!activeTabs.includes(tabIdRef.current)) {
          activeTabs.push(tabIdRef.current)
          localStorage.setItem(STORAGE_KEYS.ACTIVE_TABS, JSON.stringify(activeTabs))
        }
      } catch {
        // Ignore errors
      }
    }

    // Unregister this tab on unload
    const unregisterTab = () => {
      try {
        const activeTabs = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVE_TABS) || '[]') as string[]
        const filtered = activeTabs.filter((id: string) => id !== tabIdRef.current)
        localStorage.setItem(STORAGE_KEYS.ACTIVE_TABS, JSON.stringify(filtered))
      } catch {
        // Ignore errors
      }
    }

    registerTab()
    window.addEventListener('beforeunload', unregisterTab)

    return () => {
      unregisterTab()
      window.removeEventListener('beforeunload', unregisterTab)
    }
  }, [])

  // Check if multiple tabs are active
  const getActiveTabCount = useCallback(() => {
    if (typeof window === 'undefined') return 1
    try {
      const activeTabs = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVE_TABS) || '[]')
      return Array.isArray(activeTabs) ? activeTabs.length : 1
    } catch {
      return 1
    }
  }, [])

  return {
    tabId: tabIdRef.current,
    getActiveTabCount,
    lastSave: lastSaveRef.current
  }
}
