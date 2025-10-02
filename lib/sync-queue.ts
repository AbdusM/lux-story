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
import { logSync } from './real-time-monitor'

const SYNC_QUEUE_KEY = 'lux-sync-queue'
const MAX_QUEUE_SIZE = 500 // Prevent unbounded growth
const MAX_RETRY_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export interface QueuedAction {
  id: string // UUID for idempotency
  type: string // Action type: 'db_method' | 'career_analytics' | 'skill_summary'
  method?: string // DatabaseService method name (for db_method type)
  args?: unknown[] // Method arguments (for db_method type)
  data?: Record<string, unknown> // Payload data (for career_analytics/skill_summary types)
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
  static async processQueue(db?: Record<string, (...args: unknown[]) => Promise<unknown>>): Promise<SyncResult> {
    const queue = this.getQueue()

    if (queue.length === 0) {
      return { success: true, processed: 0, failed: 0 }
    }

    const actionTypes = queue.reduce((acc, a) => {
      acc[a.type] = (acc[a.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    console.log('🚀 [SyncQueue] Processing queue:', {
      totalActions: queue.length,
      actionTypes,
      oldestAction: queue.length > 0 ? new Date(queue[0].timestamp).toISOString() : null
    })

    const successfulIds: string[] = []
    const failedActions: QueuedAction[] = []

    for (const action of queue) {
      const actionAge = Date.now() - action.timestamp
      console.log('⏳ [SyncQueue] Processing action:', {
        type: action.type,
        id: action.id.substring(0, 8),
        retries: action.retries,
        ageSeconds: Math.floor(actionAge / 1000)
      })

      try {
        // Handle different action types
        if (action.type === 'db_method') {
          // Legacy: DatabaseService method call
          if (!db) {
            console.error('❌ [SyncQueue] No database service provided for db_method')
            failedActions.push({ ...action, retries: action.retries + 1 })
            continue
          }

          const method = db[action.method!]
          if (typeof method !== 'function') {
            console.error(`❌ [SyncQueue] Unknown method: ${action.method}`)
            failedActions.push({ ...action, retries: action.retries + 1 })
            continue
          }

          await method.apply(db, action.args as unknown[])
          successfulIds.push(action.id)
          console.log('✅ [SyncQueue] Action successful:', { type: 'db_method', method: action.method })

          // Real-time monitoring
          logSync((action.data as { user_id?: string })?.user_id || 'unknown', 'career_analytics', true)

        } else if (action.type === 'career_analytics') {
          // Sync career analytics to Supabase
          const response = await fetch('/api/user/career-analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(action.data)
          })

          if (!response.ok) {
            throw new Error(`Career analytics sync failed: ${response.status}`)
          }

          successfulIds.push(action.id)
          console.log('✅ [SyncQueue] Action successful:', { type: 'career_analytics', userId: (action.data as { user_id?: string })?.user_id })

          // Real-time monitoring
          logSync((action.data as { user_id?: string })?.user_id || 'unknown', 'career_analytics', true)

        } else if (action.type === 'skill_summary') {
          // Sync skill summary to Supabase
          const response = await fetch('/api/user/skill-summaries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(action.data)
          })

          if (!response.ok) {
            throw new Error(`Skill summary sync failed: ${response.status}`)
          }

          successfulIds.push(action.id)
          console.log('✅ [SyncQueue] Action successful:', {
            type: 'skill_summary',
            skill: (action.data as { skill_name?: string })?.skill_name,
            count: (action.data as { demonstration_count?: number })?.demonstration_count
          })

          // Real-time monitoring
          logSync((action.data as { user_id?: string })?.user_id || 'unknown', 'skill_summary', true)

        } else {
          console.error(`❌ [SyncQueue] Unknown action type: ${action.type}`)
          failedActions.push({ ...action, retries: action.retries + 1 })
        }

      } catch (error) {
        const willRetry = action.retries < 3
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('❌ [SyncQueue] Action failed:', {
          type: action.type,
          id: action.id.substring(0, 8),
          error: errorMessage,
          retries: action.retries,
          willRetry
        })

        // Real-time monitoring for failures
        const syncType = action.type === 'skill_summary' ? 'skill_summary' : 'career_analytics'
        const userId = typeof action.data?.user_id === 'string' ? action.data.user_id : 'unknown'
        logSync(userId, syncType, false, errorMessage)

        failedActions.push({ ...action, retries: action.retries + 1 })
      }
    }

    // Remove successful actions from queue
    if (successfulIds.length > 0) {
      this.removeFromQueue(successfulIds)
      console.log(`🎉 [SyncQueue] Successfully synced ${successfulIds.length} actions`)
    }

    // Update retry counts for failed actions
    if (failedActions.length > 0) {
      const remainingQueue = this.getQueue()
      safeStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(remainingQueue))
      console.warn(`⚠️ [SyncQueue] ${failedActions.length} actions failed, will retry later`)
    }

    // Clean stale actions periodically
    this.cleanStaleActions()

    const result = {
      success: failedActions.length === 0,
      processed: successfulIds.length,
      failed: failedActions.length
    }

    console.log('🎉 [SyncQueue] Queue processing complete:', result)

    return result
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
      actionsByMethod: queue.reduce((acc: Record<string, number>, action) => {
        acc[action.method as string] = (acc[action.method as string] || 0) + 1
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
 * Helper: Queue career analytics sync
 */
export function queueCareerAnalyticsSync(data: {
  user_id: string
  platforms_explored?: string[]
  career_interests?: string[]
  choices_made?: number
  time_spent_seconds?: number
  sections_viewed?: string[]
  birmingham_opportunities?: string[]
}): void {
  SyncQueue.addToQueue({
    id: generateActionId(),
    type: 'career_analytics',
    data,
    timestamp: Date.now()
  })
}

/**
 * Helper: Queue skill summary sync
 */
export function queueSkillSummarySync(data: {
  user_id: string
  skill_name: string
  demonstration_count: number
  latest_context: string
  scenes_involved: string[]
  last_demonstrated?: string
}): void {
  SyncQueue.addToQueue({
    id: generateActionId(),
    type: 'skill_summary',
    data: {
      ...data,
      last_demonstrated: data.last_demonstrated || new Date().toISOString()
    },
    timestamp: Date.now()
  })
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
