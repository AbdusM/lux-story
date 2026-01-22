/**
 * Safe Storage Utility
 * Fixes localStorage undefined errors in server-side rendering
 */

import { ZodType } from 'zod'

// Safe localStorage wrapper that works in both client and server
export const safeStorage = {
  getItem(key: string): string | null {
    if (typeof window === 'undefined') return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.warn('localStorage.getItem failed:', error)
      return null
    }
  },

  /**
   * Diamond Safe Retrieval: Validates data against a schema on read.
   * Logs errors (Observability) and returns null if corrupt (Stability).
   */
  getValidatedItem<T>(key: string, schema: ZodType<T>): T | null {
    const raw = this.getItem(key)
    if (!raw) return null

    try {
      const parsed = JSON.parse(raw)
      const result = schema.safeParse(parsed)

      if (!result.success) {
        console.error(`[SafeStorage] Validation Failed for key '${key}':`, result.error.issues)
        return null
      }

      return result.data
    } catch (error) {
      console.error(`[SafeStorage] JSON Parse Failed for key '${key}':`, error)
      return null
    }
  },

  setItem(key: string, value: string): boolean {
    if (typeof window === 'undefined') return false
    try {
      localStorage.setItem(key, value)
      return true
    } catch (error) {
      console.warn('localStorage.setItem failed:', error)
      return false
    }
  },

  removeItem(key: string): boolean {
    if (typeof window === 'undefined') return false
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.warn('localStorage.removeItem failed:', error)
      return false
    }
  },

  clear(): boolean {
    if (typeof window === 'undefined') return false
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.warn('localStorage.clear failed:', error)
      return false
    }
  }
}

// Simple UUID generator polyfill
function uuidv4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Safe user ID generation
export function generateUserId(): string {
  if (typeof window === 'undefined') {
    // Generate a temporary UUID for SSR, though rarely needed for logic
    return uuidv4()
  }

  let existingId = safeStorage.getItem('lux-player-id')

  // Validate existing ID format (must be UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  if (!existingId || !uuidRegex.test(existingId)) {
    // Create new UUID if missing or invalid
    existingId = uuidv4()
    safeStorage.setItem('lux-player-id', existingId)

    // If we replaced an invalid ID, we should prolly log/warn, but for now just fixing it is enough
    if (existingId) {
      console.warn('Replaced invalid/missing User ID with new UUID')
    }
  }

  return existingId
}

// Safe progress storage
export function saveProgress(data: unknown): boolean {
  return safeStorage.setItem('lux-story-progress', JSON.stringify(data))
}

export function loadProgress(): unknown {
  const stored = safeStorage.getItem('lux-story-progress')
  if (!stored) return null

  try {
    return JSON.parse(stored)
  } catch (error) {
    console.warn('Failed to parse stored progress:', error)
    return null
  }
}

// Simple metrics persistence
export function saveMetrics(userId: string, metrics: unknown): boolean {
  return safeStorage.setItem(`lux-metrics-${userId}`, JSON.stringify(metrics))
}

export function loadMetrics(userId: string): unknown {
  const stored = safeStorage.getItem(`lux-metrics-${userId}`)
  if (!stored) return null

  try {
    return JSON.parse(stored)
  } catch (error) {
    console.warn('Failed to parse stored metrics:', error)
    return null
  }
}

import type { LocalPlayerData } from './database-service' // Import the defined interface
import { parseLocalPlayerData } from './schemas/player-data'

// Player data storage (for DatabaseService compatibility)
// Uses Zod validation to ensure data integrity
export function getStoredPlayerData(userId: string): Partial<LocalPlayerData> | null {
  const key = `lux-player-data-${userId}`
  const stored = safeStorage.getItem(key)
  if (!stored) return null

  // Use validated parsing - returns null if invalid
  // Note: Schema validates string timestamps (as stored in JSON), interface expects Date
  // The cast is safe because the structure is validated, only Date/string differs
  const validated = parseLocalPlayerData(stored)
  return validated as Partial<LocalPlayerData> | null
}

export function savePlayerData(userId: string, data: unknown): boolean {
  const key = `lux-player-data-${userId}`
  return safeStorage.setItem(key, JSON.stringify(data))
}