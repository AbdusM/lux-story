/**
 * Skill Combo Detector - Layer 5 of Progressive Skill Revelation
 *
 * Detects which skill combinations a player has unlocked based on their
 * demonstrated skill levels. Provides progress tracking for incomplete combos.
 */

import { SKILL_COMBOS, type SkillCombo } from './skill-combos'

export interface ComboSkillProgress {
  skill: string
  current: number    // Current level (0-10 scale)
  required: number   // Required level (0-10 scale)
  progress: number   // Percentage toward requirement (0-100)
  isMet: boolean     // Whether requirement is met
}

export interface ComboProgress {
  combo: SkillCombo
  overall: number    // Overall percentage (0-100)
  bySkill: Record<string, ComboSkillProgress>
  isUnlocked: boolean
  unlockedAt?: number // Timestamp when unlocked (if tracked)
}

/**
 * Detect all unlocked combos based on current skill levels
 *
 * @param skillLevels - Record of skill names to levels (0-1 scale from GameState)
 * @returns Array of unlocked combos
 */
export function detectUnlockedCombos(skillLevels: Record<string, number>): SkillCombo[] {
  return SKILL_COMBOS.filter(combo => {
    return combo.skills.every((skill, index) => {
      // Convert 0-1 scale to 0-10 for comparison
      const playerLevel = (skillLevels[skill] || 0) * 10
      return playerLevel >= combo.minLevels[index]
    })
  })
}

/**
 * Check if a specific combo is unlocked
 *
 * @param comboId - The combo ID to check
 * @param skillLevels - Record of skill names to levels (0-1 scale)
 * @returns Whether the combo is unlocked
 */
export function isComboUnlocked(comboId: string, skillLevels: Record<string, number>): boolean {
  const combo = SKILL_COMBOS.find(c => c.id === comboId)
  if (!combo) return false

  return combo.skills.every((skill, index) => {
    const playerLevel = (skillLevels[skill] || 0) * 10
    return playerLevel >= combo.minLevels[index]
  })
}

/**
 * Get detailed progress toward a specific combo
 *
 * @param combo - The combo to analyze
 * @param skillLevels - Record of skill names to levels (0-1 scale)
 * @returns Detailed progress breakdown
 */
export function getComboProgress(
  combo: SkillCombo,
  skillLevels: Record<string, number>
): ComboProgress {
  const bySkill: Record<string, ComboSkillProgress> = {}

  combo.skills.forEach((skill, index) => {
    const current = (skillLevels[skill] || 0) * 10 // Convert to 0-10 scale
    const required = combo.minLevels[index]
    const progress = Math.min(100, (current / required) * 100)
    const isMet = current >= required

    bySkill[skill] = {
      skill,
      current,
      required,
      progress,
      isMet
    }
  })

  const skillProgresses = Object.values(bySkill)
  const overallProgress = skillProgresses.reduce((sum, s) => sum + s.progress, 0) / combo.skills.length
  const isUnlocked = skillProgresses.every(s => s.isMet)

  return {
    combo,
    overall: Math.round(overallProgress),
    bySkill,
    isUnlocked
  }
}

/**
 * Get progress for all combos, sorted by how close to completion
 *
 * @param skillLevels - Record of skill names to levels (0-1 scale)
 * @returns Array of combo progress, sorted by overall progress descending
 */
export function getAllComboProgress(skillLevels: Record<string, number>): ComboProgress[] {
  return SKILL_COMBOS
    .map(combo => getComboProgress(combo, skillLevels))
    .sort((a, b) => {
      // Unlocked combos first, then by progress
      if (a.isUnlocked && !b.isUnlocked) return -1
      if (!a.isUnlocked && b.isUnlocked) return 1
      return b.overall - a.overall
    })
}

/**
 * Suggest next combo to work toward based on current skill levels
 *
 * @param skillLevels - Record of skill names to levels (0-1 scale)
 * @returns The combo with highest progress that isn't yet unlocked
 */
export function suggestNextCombo(skillLevels: Record<string, number>): ComboProgress | null {
  const progress = getAllComboProgress(skillLevels)
  const inProgress = progress.filter(cp => !cp.isUnlocked)

  if (inProgress.length === 0) return null

  // Return the one with highest progress
  return inProgress[0]
}

/**
 * Get summary stats for combos
 *
 * @param skillLevels - Record of skill names to levels (0-1 scale)
 * @returns Summary of combo progress
 */
export function getComboSummary(skillLevels: Record<string, number>): {
  totalCombos: number
  unlockedCount: number
  inProgressCount: number
  nextCombo: ComboProgress | null
} {
  const progress = getAllComboProgress(skillLevels)
  const unlocked = progress.filter(cp => cp.isUnlocked)
  const inProgress = progress.filter(cp => !cp.isUnlocked && cp.overall > 0)
  const next = suggestNextCombo(skillLevels)

  return {
    totalCombos: SKILL_COMBOS.length,
    unlockedCount: unlocked.length,
    inProgressCount: inProgress.length,
    nextCombo: next
  }
}
