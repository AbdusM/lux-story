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

export class SafeStorage {
    /**
     * Safe wrapper for localStorage.setItem
     * Handles QuotaExceededError and other storage exceptions
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
                    console.error('SafeStorage: Quota exceeded. storage failed.', error)
                    // TODO: Implement critical save strategy (e.g. clear non-essential keys)
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
