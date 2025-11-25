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
import { ensureUserProfile } from './ensure-user-profile'

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

    // Track user IDs we've already ensured exist to avoid duplicate checks
    const ensuredUserIds = new Set<string>()

    // PERFORMANCE FIX: Check localStorage cache for profile existence
    const PROFILE_CACHE_KEY = 'profile-existence-cache'
    const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000 // 24 hours

    const getCachedProfileExists = (userId: string): boolean | null => {
      const cached = safeStorage.getItem(`${PROFILE_CACHE_KEY}-${userId}`)
      if (!cached) return null

      try {
        const data = JSON.parse(cached)
        if (Date.now() - data.timestamp > CACHE_EXPIRY_MS) {
          safeStorage.removeItem(`${PROFILE_CACHE_KEY}-${userId}`)
          return null
        }
        return data.exists
      } catch {
        return null
      }
    }

    const setCachedProfileExists = (userId: string, exists: boolean): void => {
      safeStorage.setItem(`${PROFILE_CACHE_KEY}-${userId}`, JSON.stringify({
        exists,
        timestamp: Date.now()
      }))
    }

    for (const action of queue) {
      // Validate action structure
      if (!action || typeof action !== 'object') {
        console.error('❌ [SyncQueue] Invalid action structure:', action)
        continue
      }
      
      if (!action.id || !action.type) {
        console.error('❌ [SyncQueue] Action missing required fields:', {
          hasId: !!action.id,
          hasType: !!action.type,
          actionKeys: Object.keys(action)
        })
        continue
      }
      
      const actionAge = Date.now() - (action.timestamp || Date.now())
      console.log('⏳ [SyncQueue] Processing action:', {
        type: action.type,
        id: action.id ? action.id.substring(0, 8) : 'no-id',
        retries: action.retries || 0,
        ageSeconds: Math.floor(actionAge / 1000)
      })

      try {
        // Extract user_id from action (needed for foreign key constraints)
        let userId: string | undefined

        if (action.type === 'db_method' && action.args && action.args.length > 0) {
          // First arg is usually userId for db methods
          userId = typeof action.args[0] === 'string' ? action.args[0] : undefined
        } else if (action.data && typeof action.data.user_id === 'string') {
          userId = action.data.user_id
        }

        // Ensure user profile exists before any data insertion
        if (userId && !ensuredUserIds.has(userId)) {
          // PERFORMANCE FIX: Check cache first to avoid unnecessary database query
          const cachedExists = getCachedProfileExists(userId)

          if (cachedExists === true) {
            console.log(`⚡ [SyncQueue] Profile cached for ${userId}, skipping check`)
            ensuredUserIds.add(userId)
          } else {
            console.log(`🔒 [SyncQueue] Ensuring profile exists for ${userId}...`)
            const profileEnsured = await ensureUserProfile(userId)

            if (!profileEnsured) {
              console.error(`❌ [SyncQueue] Failed to ensure profile for ${userId}, skipping action`)
              failedActions.push({ ...action, retries: action.retries + 1 })
              continue
            }

            ensuredUserIds.add(userId)
            setCachedProfileExists(userId, true)
            console.log(`✅ [SyncQueue] Profile ensured and cached for ${userId}`)
          }
        }

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
          let response: Response
          try {
            response = await fetch('/api/user/career-analytics', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(action.data)
            })
          } catch (fetchError) {
            // Network error - rethrow with more context
            throw new Error(`Network error syncing career analytics: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`)
          }

          if (!response.ok) {
            // Try to get error details from response
            let errorBody = ''
            try {
              errorBody = await response.text()
            } catch (_e) {
              // Ignore if we can't read body
            }
            throw new Error(`Career analytics sync failed: ${response.status} ${response.statusText}${errorBody ? ` - ${errorBody.slice(0, 100)}` : ''}`)
          }

          successfulIds.push(action.id)
          console.log('✅ [SyncQueue] Action successful:', { type: 'career_analytics', userId: (action.data as { user_id?: string })?.user_id })

          // Real-time monitoring
          logSync((action.data as { user_id?: string })?.user_id || 'unknown', 'career_analytics', true)

        } else if (action.type === 'skill_summary') {
          // Sync skill summary to Supabase
          let response: Response
          try {
            response = await fetch('/api/user/skill-summaries', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(action.data)
            })
          } catch (fetchError) {
            // Network error - rethrow with more context
            throw new Error(`Network error syncing skill summary: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`)
          }

          if (!response.ok) {
            // Try to get error details from response
            let errorBody = ''
            try {
              errorBody = await response.text()
            } catch (_e) {
              // Ignore if we can't read body
            }
            throw new Error(`Skill summary sync failed: ${response.status} ${response.statusText}${errorBody ? ` - ${errorBody.slice(0, 100)}` : ''}`)
          }

          successfulIds.push(action.id)
          console.log('✅ [SyncQueue] Action successful:', {
            type: 'skill_summary',
            skill: (action.data as { skill_name?: string })?.skill_name,
            count: (action.data as { demonstration_count?: number })?.demonstration_count
          })

          // Real-time monitoring
          logSync((action.data as { user_id?: string })?.user_id || 'unknown', 'skill_summary', true)

        } else if (action.type === 'skill_demonstration') {
          // Sync individual skill demonstration to Supabase
          let response: Response
          try {
            response = await fetch('/api/user/skill-demonstrations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(action.data)
            })
          } catch (fetchError) {
            // Network error - rethrow with more context
            throw new Error(`Network error syncing skill demonstration: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`)
          }

          if (!response.ok) {
            // Try to get error details from response
            let errorBody = ''
            try {
              errorBody = await response.text()
            } catch (_e) {
              // Ignore if we can't read body
            }
            throw new Error(`Skill demonstration sync failed: ${response.status} ${response.statusText}${errorBody ? ` - ${errorBody.slice(0, 100)}` : ''}`)
          }

          successfulIds.push(action.id)
          console.log('✅ [SyncQueue] Action successful:', {
            type: 'skill_demonstration',
            skill: (action.data as { skill_name?: string })?.skill_name,
            scene: (action.data as { scene_id?: string })?.scene_id
          })

          // Real-time monitoring
          logSync((action.data as { user_id?: string })?.user_id || 'unknown', 'skill_demonstration', true)

        } else if (action.type === 'career_exploration') {
          // Sync career exploration to Supabase
          let response: Response
          try {
            response = await fetch('/api/user/career-explorations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(action.data)
            })
          } catch (fetchError) {
            // Network error - rethrow with more context
            throw new Error(`Network error syncing career exploration: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`)
          }

          if (!response.ok) {
            // Try to get error details from response
            let errorBody = ''
            try {
              errorBody = await response.text()
            } catch (_e) {
              // Ignore if we can't read body
            }
            throw new Error(`Career exploration sync failed: ${response.status} ${response.statusText}${errorBody ? ` - ${errorBody.slice(0, 100)}` : ''}`)
          }

          successfulIds.push(action.id)
          console.log('✅ [SyncQueue] Action successful:', {
            type: 'career_exploration',
            career: (action.data as { career_name?: string })?.career_name,
            matchScore: (action.data as { match_score?: number })?.match_score
          })

          // Real-time monitoring
          logSync((action.data as { user_id?: string })?.user_id || 'unknown', 'career_exploration', true)

        } else if (action.type === 'pattern_demonstration') {
          // Sync pattern demonstration to Supabase
          let response: Response
          try {
            response = await fetch('/api/user/pattern-demonstrations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(action.data)
            })
          } catch (fetchError) {
            // Network error - rethrow with more context
            throw new Error(`Network error syncing pattern demonstration: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`)
          }

          if (!response.ok) {
            // Try to get error details from response
            let errorBody = ''
            try {
              errorBody = await response.text()
            } catch (_e) {
              // Ignore if we can't read body
            }
            throw new Error(`Pattern demonstration sync failed: ${response.status} ${response.statusText}${errorBody ? ` - ${errorBody.slice(0, 100)}` : ''}`)
          }

          successfulIds.push(action.id)
          console.log('✅ [SyncQueue] Action successful:', {
            type: 'pattern_demonstration',
            pattern: (action.data as { pattern_name?: string })?.pattern_name,
            scene: (action.data as { scene_id?: string })?.scene_id
          })

          // Real-time monitoring
          logSync((action.data as { user_id?: string })?.user_id || 'unknown', 'pattern_demonstration', true)

        } else {
          console.error(`❌ [SyncQueue] Unknown action type: ${action.type}`)
          failedActions.push({ ...action, retries: action.retries + 1 })
        }

      } catch (error) {
        const willRetry = action.retries < 3
        let errorMessage = 'Unknown error'
        let errorDetails: any = null
        
        if (error instanceof Error) {
          errorMessage = error.message || 'Error object has no message'
          errorDetails = {
            name: error.name,
            stack: error.stack,
            message: error.message
          }
        } else if (error && typeof error === 'object') {
          // Handle non-Error objects (like API responses)
          try {
            errorMessage = JSON.stringify(error)
            errorDetails = error
          } catch (_e) {
            errorMessage = 'Failed to stringify error object'
            errorDetails = { toString: String(error) }
          }
        } else if (typeof error === 'string') {
          errorMessage = error
        } else if (error === null || error === undefined) {
          errorMessage = 'Error is null or undefined'
        } else {
          errorMessage = `Unexpected error type: ${typeof error}`
          errorDetails = { value: String(error) }
        }
        
        console.error('❌ [SyncQueue] Action failed:', {
          type: action.type,
          id: action.id?.substring(0, 8) || 'unknown',
          error: errorMessage,
          errorDetails,
          retries: action.retries || 0,
          willRetry,
          actionData: action.data ? (typeof action.data === 'object' ? Object.keys(action.data) : action.data) : 'no data'
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
    const _now = Date.now()

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
  scene_descriptions?: string[]
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
 * Helper: Queue individual skill demonstration sync
 * Called for EVERY demonstration to provide granular evidence
 */
export function queueSkillDemonstrationSync(data: {
  user_id: string
  skill_name: string
  scene_id: string
  scene_description?: string
  choice_text: string
  context: string
  demonstrated_at?: string
}): void {
  SyncQueue.addToQueue({
    id: generateActionId(),
    type: 'skill_demonstration',
    data: {
      ...data,
      demonstrated_at: data.demonstrated_at || new Date().toISOString()
    },
    timestamp: Date.now()
  })
}

/**
 * Helper: Queue career exploration sync
 * Called when user demonstrates career interest
 */
export function queueCareerExplorationSync(data: {
  user_id: string
  career_name: string
  match_score: number
  readiness_level: 'exploratory' | 'emerging' | 'near_ready' | 'ready'
  local_opportunities: string[]
  education_paths: string[]
  explored_at?: string
}): void {
  SyncQueue.addToQueue({
    id: generateActionId(),
    type: 'career_exploration',
    data: {
      ...data,
      explored_at: data.explored_at || new Date().toISOString()
    },
    timestamp: Date.now()
  })

  console.log('[SyncQueue] Queued career exploration sync:', {
    userId: data.user_id,
    careerName: data.career_name,
    matchScore: data.match_score
  })
}

/**
 * Helper: Queue pattern demonstration sync
 * Called when user demonstrates a decision-making pattern through their choices
 */
export function queuePatternDemonstrationSync(data: {
  user_id: string
  pattern_name: string
  choice_id: string
  choice_text: string
  scene_id: string
  character_id: string
  context: string
  demonstrated_at?: string
}): void {
  SyncQueue.addToQueue({
    id: generateActionId(),
    type: 'pattern_demonstration',
    data: {
      ...data,
      demonstrated_at: data.demonstrated_at || new Date().toISOString()
    },
    timestamp: Date.now()
  })

  console.log('[SyncQueue] Queued pattern demonstration sync:', {
    userId: data.user_id,
    pattern: data.pattern_name,
    scene: data.scene_id
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
