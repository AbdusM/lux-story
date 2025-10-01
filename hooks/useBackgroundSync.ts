/**
 * useBackgroundSync Hook
 *
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Manages automatic background synchronization of queued database actions.
 *
 * Sync Triggers:
 * 1. Interval (every 30 seconds by default)
 * 2. Window focus (user returns to tab)
 * 3. Network online (connection restored)
 * 4. Manual trigger (for testing)
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { SyncQueue, SyncResult, QueueStats } from '@/lib/sync-queue'
import { db } from '@/lib/database-service'

interface UseBackgroundSyncOptions {
  enabled?: boolean
  intervalMs?: number // How often to attempt sync (default: 30000 = 30s)
  syncOnFocus?: boolean // Sync when window gains focus
  syncOnOnline?: boolean // Sync when network comes back online
}

interface UseBackgroundSyncReturn {
  isProcessing: boolean
  lastSyncResult: SyncResult | null
  queueStats: QueueStats | null
  triggerSync: () => Promise<void>
}

export function useBackgroundSync(
  options: UseBackgroundSyncOptions = {}
): UseBackgroundSyncReturn {
  const {
    enabled = true,
    intervalMs = 30000,
    syncOnFocus = true,
    syncOnOnline = true
  } = options

  const [isProcessing, setIsProcessing] = useState(false)
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null)
  const [queueStats, setQueueStats] = useState<QueueStats | null>(null)

  // Use ref to prevent concurrent sync attempts
  const syncInProgressRef = useRef(false)

  /**
   * Core sync function - processes the queue
   */
  const triggerSync = useCallback(async () => {
    // Prevent concurrent sync attempts
    if (syncInProgressRef.current) {
      console.log('[useBackgroundSync] Sync already in progress, skipping')
      return
    }

    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return
    }

    syncInProgressRef.current = true
    setIsProcessing(true)

    try {
      const result = await SyncQueue.processQueue(db)
      setLastSyncResult(result)

      // Update stats after sync
      const stats = SyncQueue.getStats()
      setQueueStats(stats)

      // Log results
      if (result.processed > 0) {
        console.log(`[useBackgroundSync] Synced ${result.processed} actions`)
      }
      if (result.failed > 0) {
        console.warn(`[useBackgroundSync] ${result.failed} actions failed`)
      }

    } catch (error) {
      console.error('[useBackgroundSync] Sync error:', error)
      setLastSyncResult({ success: false, processed: 0, failed: 0 })
    } finally {
      syncInProgressRef.current = false
      setIsProcessing(false)
    }
  }, [])

  /**
   * Interval-based sync
   */
  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(() => {
      triggerSync()
    }, intervalMs)

    // Initial sync on mount
    triggerSync()

    return () => clearInterval(interval)
  }, [enabled, intervalMs, triggerSync])

  /**
   * Sync on window focus
   */
  useEffect(() => {
    if (!enabled || !syncOnFocus) return

    const handleFocus = () => {
      console.log('[useBackgroundSync] Window focused, triggering sync')
      triggerSync()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [enabled, syncOnFocus, triggerSync])

  /**
   * Sync when network comes back online
   */
  useEffect(() => {
    if (!enabled || !syncOnOnline) return

    const handleOnline = () => {
      console.log('[useBackgroundSync] Network online, triggering sync')
      triggerSync()
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [enabled, syncOnOnline, triggerSync])

  /**
   * Update stats periodically (for UI display)
   */
  useEffect(() => {
    if (!enabled) return

    const updateStats = () => {
      const stats = SyncQueue.getStats()
      setQueueStats(stats)
    }

    // Update stats every 5 seconds
    const interval = setInterval(updateStats, 5000)
    updateStats() // Initial update

    return () => clearInterval(interval)
  }, [enabled])

  return {
    isProcessing,
    lastSyncResult,
    queueStats,
    triggerSync
  }
}
