/**
 * Admin Urgency System
 * Feature ID: D-053
 * 
 * Allows admins to forcefully override urgency states for global events
 * or testing purposes.
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type UrgencyLevel = 'normal' | 'heightened' | 'critical' | 'emergency'

export interface UrgencyOverride {
    active: boolean
    level: UrgencyLevel
    reason: string
    expiresAt?: number
    affectedRegions?: string[] // Optional: localized urgency
}

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL STATE
// ═══════════════════════════════════════════════════════════════════════════

let CURRENT_OVERRIDE: UrgencyOverride | null = null

// ═══════════════════════════════════════════════════════════════════════════
// LOGIC
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Set a global urgency override
 */
export function setGlobalUrgency(
    level: UrgencyLevel,
    reason: string,
    durationMinutes: number = 60
): void {
    CURRENT_OVERRIDE = {
        active: true,
        level,
        reason,
        expiresAt: Date.now() + (durationMinutes * 60 * 1000)
    }
}

/**
 * Clear any active override
 */
export function clearGlobalUrgency(): void {
    CURRENT_OVERRIDE = null
}

/**
 * Get current effective urgency level
 * (Returns calculated system level if no override active)
 */
export function getEffectiveUrgency(systemLevel: UrgencyLevel): UrgencyLevel {
    if (!CURRENT_OVERRIDE || !CURRENT_OVERRIDE.active) {
        return systemLevel
    }

    if (CURRENT_OVERRIDE.expiresAt && Date.now() > CURRENT_OVERRIDE.expiresAt) {
        clearGlobalUrgency()
        return systemLevel
    }

    return CURRENT_OVERRIDE.level
}

/**
 * Check if specific region is under override
 */
export function isRegionUnderUrgency(regionId: string): boolean {
    if (!CURRENT_OVERRIDE || !CURRENT_OVERRIDE.active) return false

    // If no regions specified, applies globally
    if (!CURRENT_OVERRIDE.affectedRegions) return true

    return CURRENT_OVERRIDE.affectedRegions.includes(regionId)
}
