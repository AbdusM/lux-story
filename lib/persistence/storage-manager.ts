/**
 * storage-manager.ts
 * 
 * A robust wrapper around localStorage that provides:
 * 1. Versioning (schema migration support)
 * 2. Error handling (quota exceeded, privacy mode)
 * 3. Type safety
 */

export type StorageSchemaVersion = number

export interface StorageConfig {
    version: StorageSchemaVersion
    prefix: string
}

export const STORAGE_CONFIG: StorageConfig = {
    version: 1, // Current schema version
    prefix: 'lux_story_v1_'
}

// Keys that can be cleared when quota is exceeded (non-essential)
const NON_ESSENTIAL_KEYS = [
    'shownMagical',
    'shownConflicts',
    'shownAchievements',
    'shownIcebergs',
    'analytics_snapshots',
    'session_metrics',
    'shown_notifications',
    'tutorial_progress'
]

// Keys that must be preserved (critical game state)
const CRITICAL_KEYS = [
    'gameState',
    'character_states',
    'player_profile'
]

export class SafeStorage {
    /**
     * Clear non-essential storage to free up space
     * Called when quota is exceeded
     */
    private static clearNonEssentialStorage(): number {
        let clearedCount = 0
        for (const key of NON_ESSENTIAL_KEYS) {
            const fullKey = this.getKey(key)
            if (window.localStorage.getItem(fullKey)) {
                window.localStorage.removeItem(fullKey)
                clearedCount++
            }
        }
        console.info(`SafeStorage: Cleared ${clearedCount} non-essential keys to free space`)
        return clearedCount
    }

    /**
     * Safe wrapper for localStorage.setItem
     * Handles QuotaExceededError with automatic cleanup and retry
     */
    static set<T>(key: string, value: T): boolean {
        if (typeof window === 'undefined') return false

        try {
            const serialized = JSON.stringify({
                version: STORAGE_CONFIG.version,
                timestamp: Date.now(),
                data: value
            })

            const fullKey = this.getKey(key)
            window.localStorage.setItem(fullKey, serialized)
            return true
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'QuotaExceededError' ||
                    error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                    console.warn('SafeStorage: Quota exceeded, attempting cleanup...')

                    // Clear non-essential keys and retry
                    const cleared = this.clearNonEssentialStorage()
                    if (cleared > 0) {
                        try {
                            const serialized = JSON.stringify({
                                version: STORAGE_CONFIG.version,
                                timestamp: Date.now(),
                                data: value
                            })
                            window.localStorage.setItem(this.getKey(key), serialized)
                            console.info('SafeStorage: Save succeeded after cleanup')
                            return true
                        } catch (retryError) {
                            console.error('SafeStorage: Save failed even after cleanup', retryError)
                        }
                    }

                    // If this is a critical key, try more aggressive cleanup
                    if (CRITICAL_KEYS.some(k => key.includes(k))) {
                        console.warn('SafeStorage: Critical save failed, preserving only essentials')
                        // Clear everything except critical keys
                        const allKeys = Object.keys(window.localStorage)
                        for (const k of allKeys) {
                            if (k.startsWith(STORAGE_CONFIG.prefix) &&
                                !CRITICAL_KEYS.some(ck => k.includes(ck))) {
                                window.localStorage.removeItem(k)
                            }
                        }
                        // Final retry
                        try {
                            const serialized = JSON.stringify({
                                version: STORAGE_CONFIG.version,
                                timestamp: Date.now(),
                                data: value
                            })
                            window.localStorage.setItem(this.getKey(key), serialized)
                            return true
                        } catch {
                            console.error('SafeStorage: Critical save failed completely')
                        }
                    }
                } else {
                    console.error('SafeStorage: Save failed.', error)
                }
            }
            return false
        }
    }

    /**
     * Safe wrapper for localStorage.getItem
     * Validates version and handles parsing errors
     */
    static get<T>(key: string, fallback: T): T {
        if (typeof window === 'undefined') return fallback

        try {
            const fullKey = this.getKey(key)
            const item = window.localStorage.getItem(fullKey)

            if (!item) return fallback

            const parsed = JSON.parse(item)

            // Schema Version Check
            if (parsed.version !== STORAGE_CONFIG.version) {
                console.warn(`SafeStorage: Schema version mismatch for ${key}. Expected ${STORAGE_CONFIG.version}, got ${parsed.version || '0'}.`)
                // Simple migration strategy: For now, we return fallback to prevent crashes.
                // In future: call migrate(parsed.data, parsed.version)
                return fallback
            }

            return parsed.data as T
        } catch (error) {
            console.error(`SafeStorage: Read failed for ${key}.`, error)
            return fallback
        }
    }

    /**
     * Remove item safely
     */
    static remove(key: string): void {
        if (typeof window === 'undefined') return
        try {
            window.localStorage.removeItem(this.getKey(key))
        } catch (e) {
            console.warn('SafeStorage: Remove failed', e)
        }
    }

    private static getKey(key: string): string {
        return `${STORAGE_CONFIG.prefix}${key}`
    }
}
