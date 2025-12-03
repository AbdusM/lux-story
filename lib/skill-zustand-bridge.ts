/**
 * Skill-Zustand Bridge
 *
 * Bridges the SkillTracker (localStorage-based evidence tracking) with
 * Zustand game store (UI state for constellation view).
 *
 * This solves the dual-system problem where:
 * - SkillTracker records rich skill demonstrations for Supabase/admin
 * - Zustand skills field drives the SkillsView constellation UI
 *
 * Without this bridge, skills never appear in the constellation.
 */

import { useGameStore, type FutureSkills } from './game-store'
import { SKILL_NODES } from './constellation/skill-positions'
import { logger } from './logger'

// Skill IDs from constellation that we track
const CONSTELLATION_SKILL_IDS = new Set(SKILL_NODES.map(node => node.id))

// Convert demonstration count to 0-1 scale for Zustand
// Mirrors useConstellationData logic: demonstrationCount = Math.round(rawValue * 10)
// So rawValue = demonstrationCount / 10
function demonstrationCountToScale(count: number): number {
  // Cap at 1.0 (10+ demonstrations = mastery)
  return Math.min(1, count / 10)
}

/**
 * Sync a single skill demonstration to Zustand store
 * Called by SkillTracker after each recordSkillDemonstration
 */
export function syncSkillToZustand(skillName: string, demonstrationCount: number): void {
  // Normalize skill name to match constellation IDs (camelCase)
  const normalizedSkill = normalizeSkillName(skillName)

  // Only sync skills that are in the constellation
  if (!CONSTELLATION_SKILL_IDS.has(normalizedSkill)) {
    logger.debug('Skill not in constellation, skipping sync', {
      operation: 'skill-bridge.skip',
      skill: skillName,
      normalized: normalizedSkill
    })
    return
  }

  const store = useGameStore.getState()
  const currentValue = (store.skills as unknown as Record<string, number>)[normalizedSkill] || 0
  const newValue = demonstrationCountToScale(demonstrationCount)

  // Only update if value increased (skills don't decrease)
  if (newValue > currentValue) {
    store.updateSkills({ [normalizedSkill]: newValue } as Partial<FutureSkills>)

    logger.debug('Synced skill to Zustand', {
      operation: 'skill-bridge.sync',
      skill: normalizedSkill,
      demonstrationCount,
      previousValue: currentValue,
      newValue
    })
  }
}

/**
 * Batch sync all skills from SkillTracker to Zustand
 * Called on initialization to restore skill state from localStorage
 */
export function syncAllSkillsToZustand(
  skillDemonstrations: Record<string, { length: number } | number>
): void {
  const store = useGameStore.getState()
  const updates: Partial<FutureSkills> = {}
  let updateCount = 0

  for (const [skillName, data] of Object.entries(skillDemonstrations)) {
    const normalizedSkill = normalizeSkillName(skillName)

    if (!CONSTELLATION_SKILL_IDS.has(normalizedSkill)) {
      continue
    }

    // Handle both array length and direct count
    const count = typeof data === 'number' ? data : (data?.length || 0)
    const newValue = demonstrationCountToScale(count)
    const currentValue = (store.skills as unknown as Record<string, number>)[normalizedSkill] || 0

    if (newValue > currentValue) {
      (updates as Record<string, number>)[normalizedSkill] = newValue
      updateCount++
    }
  }

  if (updateCount > 0) {
    store.updateSkills(updates)

    logger.info('Batch synced skills to Zustand', {
      operation: 'skill-bridge.batch-sync',
      skillsUpdated: updateCount,
      skills: Object.keys(updates)
    })
  }
}

/**
 * Get skill demonstration counts from SkillTracker localStorage
 * Used for initialization sync
 */
export function getSkillCountsFromLocalStorage(userId: string): Record<string, number> {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const key = `skill_tracker_${userId}`
    const saved = localStorage.getItem(key)

    if (!saved) {
      return {}
    }

    const data = JSON.parse(saved)
    const demonstrations = data.demonstrations || []

    // Count demonstrations per skill
    const counts: Record<string, number> = {}

    for (const demo of demonstrations) {
      if (demo.skillsDemonstrated && Array.isArray(demo.skillsDemonstrated)) {
        for (const skill of demo.skillsDemonstrated) {
          const normalized = normalizeSkillName(skill)
          counts[normalized] = (counts[normalized] || 0) + 1
        }
      }
    }

    return counts
  } catch (error) {
    logger.warn('Failed to load skill counts from localStorage', {
      operation: 'skill-bridge.load-error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return {}
  }
}

/**
 * Initialize skill sync - call this when SkillTracker is created
 * Restores skill state from localStorage to Zustand
 */
export function initializeSkillSync(userId: string): void {
  const counts = getSkillCountsFromLocalStorage(userId)

  if (Object.keys(counts).length > 0) {
    syncAllSkillsToZustand(counts)

    logger.info('Initialized skill sync from localStorage', {
      operation: 'skill-bridge.init',
      userId,
      skillCount: Object.keys(counts).length,
      totalDemonstrations: Object.values(counts).reduce((a, b) => a + b, 0)
    })
  }
}

/**
 * Normalize skill name to camelCase constellation ID format
 */
function normalizeSkillName(skill: string): string {
  // Already camelCase
  if (/^[a-z][a-zA-Z]*$/.test(skill)) {
    return skill
  }

  // Convert from various formats
  return skill
    .toLowerCase()
    .replace(/[_\s-]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^(.)/, c => c.toLowerCase())
}

/**
 * Debug utility: Get current skill state from both systems
 */
export function debugSkillState(userId: string): {
  localStorage: Record<string, number>
  zustand: Record<string, number>
  mismatches: string[]
} {
  const localStorageCounts = getSkillCountsFromLocalStorage(userId)
  const zustandSkills = useGameStore.getState().skills as unknown as Record<string, number>

  const mismatches: string[] = []

  for (const [skill, count] of Object.entries(localStorageCounts)) {
    const expectedZustand = demonstrationCountToScale(count)
    const actualZustand = zustandSkills[skill] || 0

    if (Math.abs(expectedZustand - actualZustand) > 0.01) {
      mismatches.push(`${skill}: localStorage=${count} (${expectedZustand.toFixed(2)}), zustand=${actualZustand.toFixed(2)}`)
    }
  }

  return {
    localStorage: localStorageCounts,
    zustand: zustandSkills,
    mismatches
  }
}
