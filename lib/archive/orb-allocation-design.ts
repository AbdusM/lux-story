/**
 * @deprecated ARCHIVED - Orb Allocation System Design
 *
 * HISTORY:
 * This file contains the original design for an orb spending/allocation system.
 * Inspired by Diablo's attribute point allocation.
 *
 * ORIGINAL INTENT:
 * - Players would earn orbs through choices (implemented)
 * - Players could "spend" orbs to unlock special content (NOT implemented)
 * - AllocationTargets would gate premium dialogue options
 *
 * WHY NOT IMPLEMENTED:
 * - Added complexity without clear player value
 * - Spending mechanics conflicted with "self-discovery" theme
 * - Pattern revelation through action was more meaningful
 *
 * CURRENT REALITY:
 * - Orbs are earned-only (no spending)
 * - `totalAllocated` is always 0
 * - `availableToAllocate` is always 0
 *
 * PRESERVED FOR:
 * - Future gamification features
 * - Potential premium content gating
 * - Design intent documentation
 *
 * DO NOT IMPORT THIS FILE.
 */

import { OrbType } from '../orbs'

/**
 * @deprecated Allocation target - where orbs could be spent
 * Never implemented in production.
 */
export interface AllocationTarget {
  id: string
  name: string
  description: string
  requiredOrbs: Record<OrbType, number>
  unlocks: string[] // What this allocation would unlock
  isUnlocked: boolean
}

/**
 * @deprecated Example allocation targets that were designed but never used
 */
export const UNUSED_ALLOCATION_TARGETS: AllocationTarget[] = [
  {
    id: 'maya_deep_trust',
    name: "Maya's Inner Circle",
    description: "Unlock Maya's most vulnerable dialogue options",
    requiredOrbs: { analytical: 0, patience: 5, exploring: 0, helping: 10, building: 0 },
    unlocks: ['maya_family_secret', 'maya_career_doubts'],
    isUnlocked: false
  },
  {
    id: 'samuel_wisdom',
    name: "Samuel's Hidden Stories",
    description: "Unlock Samuel's deeper philosophical insights",
    requiredOrbs: { analytical: 5, patience: 10, exploring: 5, helping: 0, building: 0 },
    unlocks: ['samuel_station_origin', 'samuel_past_travelers'],
    isUnlocked: false
  }
]

/**
 * @deprecated Function to allocate orbs to a target
 * Never called in production.
 */
export function allocateOrbs(
  _balance: { [key in OrbType]: number },
  _target: AllocationTarget
): { success: boolean; newBalance: { [key in OrbType]: number } } {
  // This function was never implemented
  console.warn('[ARCHIVED] allocateOrbs called but system is not implemented')
  return { success: false, newBalance: _balance }
}
