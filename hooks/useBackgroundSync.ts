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
import { SyncQueue, SyncResult, QueueStats, processQueueDeferred } from '@/lib/sync-queue'
import { db } from '@/lib/database-service'
import { logger } from '@/lib/logger'
import { isTestEnvironment } from '@/lib/test-environment'

// Debounce delay for sync processing (allows actions to batch)
const SYNC_DEBOUNCE_MS = 2000 // Wait 2s for actions to accumulate

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

  // Disable in test environment to prevent blocking UI
  const actuallyEnabled = enabled && !isTestEnvironment()

  const [isProcessing, setIsProcessing] = useState(false)
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null)
  const [queueStats, setQueueStats] = useState<QueueStats | null>(null)

  // Use ref to prevent concurrent sync attempts
  const syncInProgressRef = useRef(false)

  // Debounce timer for batching sync operations
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * Core sync function - processes the queue (debounced)
   * Waits for actions to accumulate before syncing to reduce API calls
   */
  const triggerSync = useCallback(async () => {
    if (!actuallyEnabled) {
      logger.debug('Background sync skipped', {
        operation: 'use-background-sync.skip',
        reason: isTestEnvironment() ? 'test-environment' : 'disabled'
      })
      return
    }

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Debounce: Wait for actions to accumulate
    debounceTimerRef.current = setTimeout(async () => {
      // Prevent concurrent sync attempts (silent skip to reduce spam)
      if (syncInProgressRef.current) {
        return
      }

      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        return
      }

      syncInProgressRef.current = true
      setIsProcessing(true)

      try {
        const result = await processQueueDeferred(
          true,  // Always defer to prevent blocking UI
          db as unknown as Record<string, (...args: unknown[]) => Promise<unknown>>
        )
        setLastSyncResult(result)

        // Update stats after sync
        const stats = SyncQueue.getStats()
        setQueueStats(stats)

        // Log results
        if (result.processed > 0) {
          logger.debug('Synced actions', { operation: 'use-background-sync.sync', processed: result.processed })
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
    }, SYNC_DEBOUNCE_MS) // Wait for actions to batch
  }, [actuallyEnabled])

  /**
   * Interval-based sync
   */
  useEffect(() => {
    if (!actuallyEnabled) return

    const interval = setInterval(() => {
      triggerSync()
    }, intervalMs)

    // Initial sync on mount
    triggerSync()

    return () => {
      clearInterval(interval)
      // Clean up debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [actuallyEnabled, intervalMs, triggerSync])

  /**
   * Sync on window focus
   */
  useEffect(() => {
    if (!actuallyEnabled || !syncOnFocus) return

    const handleFocus = () => {
      // Silent sync on focus - no logging to reduce console spam
      triggerSync()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [actuallyEnabled, syncOnFocus, triggerSync])

  /**
   * Sync when network comes back online
   */
  useEffect(() => {
    if (!actuallyEnabled || !syncOnOnline) return

    const handleOnline = () => {
      // Silent sync on reconnect - no logging to reduce console spam
      triggerSync()
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [actuallyEnabled, syncOnOnline, triggerSync])

  /**
   * Update stats periodically (for UI display)
   */
  useEffect(() => {
    if (!actuallyEnabled) return

    const updateStats = () => {
      const stats = SyncQueue.getStats()
      setQueueStats(stats)
    }

    // Update stats every 5 seconds
    const interval = setInterval(updateStats, 5000)
    updateStats() // Initial update

    return () => clearInterval(interval)
  }, [actuallyEnabled])

  return {
    isProcessing,
    lastSyncResult,
    queueStats,
    triggerSync
  }
}
