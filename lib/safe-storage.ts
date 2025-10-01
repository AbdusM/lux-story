/**
 * Safe Storage Utility
 * Fixes localStorage undefined errors in server-side rendering
 */

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

// Safe user ID generation
export function generateUserId(): string {
  if (typeof window === 'undefined') {
    return `server-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  let existingId = safeStorage.getItem('lux-player-id')
  if (!existingId) {
    existingId = `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    safeStorage.setItem('lux-player-id', existingId)
  }
  return existingId
}

// Safe progress storage
export function saveProgress(data: any): boolean {
  return safeStorage.setItem('lux-story-progress', JSON.stringify(data))
}

export function loadProgress(): any {
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
export function saveMetrics(userId: string, metrics: any): boolean {
  return safeStorage.setItem(`lux-metrics-${userId}`, JSON.stringify(metrics))
}

export function loadMetrics(userId: string): any {
  const stored = safeStorage.getItem(`lux-metrics-${userId}`)
  if (!stored) return null

  try {
    return JSON.parse(stored)
  } catch (error) {
    console.warn('Failed to parse stored metrics:', error)
    return null
  }
}

// Player data storage (for DatabaseService compatibility)
export function getStoredPlayerData(userId: string): any | null {
  const key = `lux-player-data-${userId}`
  const stored = safeStorage.getItem(key)
  if (!stored) return null

  try {
    return JSON.parse(stored)
  } catch (error) {
    console.warn('Failed to parse player data:', error)
    return null
  }
}

export function savePlayerData(userId: string, data: any): boolean {
  const key = `lux-player-data-${userId}`
  return safeStorage.setItem(key, JSON.stringify(data))
}