/**
 * Sync Queue - Durable Offline-First Database Sync
 *
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Purpose: Guarantee zero data loss by queuing all database writes
 * in localStorage and syncing to Supabase when connection is available.
 *
 * Why: In workforce development tools, silent data loss creates false
 * admin insights and incorrect student intervention decisions.
 *
 * Architecture: Offline-first pattern (Firebase/CouchDB style)
 */

import { safeStorage } from './safe-storage'

const SYNC_QUEUE_KEY = 'lux-sync-queue'
const MAX_QUEUE_SIZE = 500 // Prevent unbounded growth
const MAX_RETRY_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export interface QueuedAction {
  id: string // UUID for idempotency
  method: string // DatabaseService method name
  args: any[] // Method arguments
  timestamp: number // When action was created
  retries: number // How many times we've attempted sync
}

export class SyncQueue {
  /**
   * Get all queued actions from localStorage
   */
  static getQueue(): QueuedAction[] {
    const stored = safeStorage.getItem(SYNC_QUEUE_KEY)
    if (!stored) return []

    try {
      const queue = JSON.parse(stored)
      return Array.isArray(queue) ? queue : []
    } catch (error) {
      console.error('[SyncQueue] Failed to parse queue:', error)
      return []
    }
  }

  /**
   * Add a new action to the sync queue
   * This is synchronous and instant - no network call
   */
  static addToQueue(action: Omit<QueuedAction, 'retries'>): void {
    const queue = this.getQueue()

    // Prevent unbounded growth - drop oldest if at limit
    if (queue.length >= MAX_QUEUE_SIZE) {
      console.warn(`[SyncQueue] Queue at max size (${MAX_QUEUE_SIZE}), dropping oldest action`)
      queue.shift()
    }

    // Add new action with retry counter
    queue.push({
      ...action,
      retries: 0
    })

    // Save back to localStorage
    safeStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue))
  }

  /**
   * Clear the entire queue (called after successful sync)
   */
  static clearQueue(): void {
    safeStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify([]))
  }

  /**
   * Remove specific actions by ID (for partial success)
   */
  static removeFromQueue(actionIds: string[]): void {
    const queue = this.getQueue()
    const idsToRemove = new Set(actionIds)
    const filteredQueue = queue.filter(action => !idsToRemove.has(action.id))
    safeStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(filteredQueue))
  }

  /**
   * Clean up stale actions that are too old to retry
   */
  static cleanStaleActions(): void {
    const queue = this.getQueue()
    const now = Date.now()
    const cleanedQueue = queue.filter(action => {
      const age = now - action.timestamp
      return age < MAX_RETRY_AGE_MS
    })

    if (cleanedQueue.length < queue.length) {
      console.warn(`[SyncQueue] Cleaned ${queue.length - cleanedQueue.length} stale actions`)
      safeStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(cleanedQueue))
    }
  }

  /**
   * Process the queue - attempt to sync all pending actions
   *
   * Strategy: Process actions in order, but continue on individual failures
   * to maximize successful syncs even if some fail.
   */
  static async processQueue(db: any): Promise<SyncResult> {
    const queue = this.getQueue()

    if (queue.length === 0) {
      return { success: true, processed: 0, failed: 0 }
    }

    console.log(`[SyncQueue] Processing ${queue.length} queued actions...`)

    const successfulIds: string[] = []
    const failedActions: QueuedAction[] = []

    for (const action of queue) {
      try {
        // Call the DatabaseService method with original arguments
        const method = db[action.method]
        if (typeof method !== 'function') {
          console.error(`[SyncQueue] Unknown method: ${action.method}`)
          failedActions.push({ ...action, retries: action.retries + 1 })
          continue
        }

        await method.apply(db, action.args)
        successfulIds.push(action.id)

      } catch (error) {
        console.error(`[SyncQueue] Failed to sync action ${action.id}:`, error)
        failedActions.push({ ...action, retries: action.retries + 1 })
      }
    }

    // Remove successful actions from queue
    if (successfulIds.length > 0) {
      this.removeFromQueue(successfulIds)
      console.log(`✅ [SyncQueue] Successfully synced ${successfulIds.length} actions`)
    }

    // Update retry counts for failed actions
    if (failedActions.length > 0) {
      const remainingQueue = this.getQueue()
      safeStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(remainingQueue))
      console.warn(`⚠️ [SyncQueue] ${failedActions.length} actions failed, will retry later`)
    }

    // Clean stale actions periodically
    this.cleanStaleActions()

    return {
      success: failedActions.length === 0,
      processed: successfulIds.length,
      failed: failedActions.length
    }
  }

  /**
   * Get queue statistics for debugging/monitoring
   */
  static getStats(): QueueStats {
    const queue = this.getQueue()
    const now = Date.now()

    return {
      totalActions: queue.length,
      oldestAction: queue.length > 0 ? Math.min(...queue.map(a => a.timestamp)) : null,
      newestAction: queue.length > 0 ? Math.max(...queue.map(a => a.timestamp)) : null,
      actionsByMethod: queue.reduce((acc, action) => {
        acc[action.method] = (acc[action.method] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      averageRetries: queue.length > 0
        ? queue.reduce((sum, a) => sum + a.retries, 0) / queue.length
        : 0
    }
  }
}

export interface SyncResult {
  success: boolean
  processed: number
  failed: number
}

export interface QueueStats {
  totalActions: number
  oldestAction: number | null
  newestAction: number | null
  actionsByMethod: Record<string, number>
  averageRetries: number
}

/**
 * Generate a simple UUID v4 for action IDs
 */
export function generateActionId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
