/**
 * Admin Pattern Recognition Utility
 *
 * Agent 0: Infrastructure - Issue 13
 * Analyzes skill demonstrations to identify patterns for admin dashboard insights
 *
 * Purpose:
 * - Detect scene types (family_conflict, career_exploration, personal_growth)
 * - Identify character context (Maya, Samuel, Devon, Jordan)
 * - Determine strength contexts (areas of growth)
 * - Calculate recent trends (increasing/stable/declining)
 */

import type { SkillDemonstration, SkillDemonstrations } from './skill-profile-adapter'

export type SceneType = 'family_conflict' | 'career_exploration' | 'personal_growth' | 'relationship_building' | 'unknown'
export type TrendDirection = 'increasing' | 'stable' | 'declining'

export interface SceneTypeCount {
  type: SceneType
  count: number
}

export interface CharacterFrequency {
  character: string
  frequency: number
}

export interface SkillPattern {
  skillName: string
  totalDemonstrations: number
  sceneTypes: SceneTypeCount[]
  characterContext: CharacterFrequency[]
  strengthContext: string
  recentTrend: TrendDirection
  lastDemonstrated?: string
}

/**
 * Classify scene type based on scene ID and context
 */
function classifySceneType(scene: string, context: string): SceneType {
  const lowerScene = scene.toLowerCase()
  const lowerContext = context.toLowerCase()

  // Family conflict indicators
  if (
    lowerContext.includes('family') ||
    lowerContext.includes('parent') ||
    lowerContext.includes('mother') ||
    lowerContext.includes('father') ||
    lowerScene.includes('family') ||
    lowerScene.includes('home')
  ) {
    return 'family_conflict'
  }

  // Career exploration indicators
  if (
    lowerContext.includes('career') ||
    lowerContext.includes('job') ||
    lowerContext.includes('platform') ||
    lowerContext.includes('train') ||
    lowerContext.includes('healthcare') ||
    lowerContext.includes('engineering') ||
    lowerContext.includes('tech') ||
    lowerScene.includes('platform') ||
    lowerScene.includes('station')
  ) {
    return 'career_exploration'
  }

  // Relationship building indicators
  if (
    lowerContext.includes('maya') ||
    lowerContext.includes('samuel') ||
    lowerContext.includes('devon') ||
    lowerContext.includes('jordan') ||
    lowerContext.includes('trust') ||
    lowerContext.includes('conversation') ||
    lowerContext.includes('helped')
  ) {
    return 'relationship_building'
  }

  // Personal growth indicators
  if (
    lowerContext.includes('confidence') ||
    lowerContext.includes('growth') ||
    lowerContext.includes('learned') ||
    lowerContext.includes('reflection') ||
    lowerContext.includes('identity') ||
    lowerContext.includes('self')
  ) {
    return 'personal_growth'
  }

  return 'unknown'
}

/**
 * Extract character mentions from context
 */
function extractCharacters(context: string): string[] {
  const characters: string[] = []
  const lowerContext = context.toLowerCase()

  if (lowerContext.includes('maya')) characters.push('Maya')
  if (lowerContext.includes('samuel')) characters.push('Samuel')
  if (lowerContext.includes('devon')) characters.push('Devon')
  if (lowerContext.includes('jordan')) characters.push('Jordan')

  return characters
}

/**
 * Determine strength context based on demonstration patterns
 */
function determineStrengthContext(demonstrations: SkillDemonstration[]): string {
  const sceneTypes = demonstrations.map(d =>
    classifySceneType(d.scene, d.context)
  )

  const typeCounts = sceneTypes.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<SceneType, number>)

  const dominant = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])[0]

  if (!dominant) return 'general exploration'

  const [type, count] = dominant
  const percentage = (count / demonstrations.length) * 100

  if (percentage < 40) {
    return 'balanced across contexts'
  }

  switch (type) {
    case 'family_conflict':
      return 'navigating family expectations'
    case 'career_exploration':
      return 'career pathway discovery'
    case 'relationship_building':
      return 'building support networks'
    case 'personal_growth':
      return 'identity development'
    default:
      return 'general exploration'
  }
}

/**
 * Calculate recent trend from timestamp data
 */
function calculateTrend(demonstrations: SkillDemonstration[]): TrendDirection {
  if (demonstrations.length < 3) return 'stable'

  // Sort by timestamp (most recent first)
  const sorted = [...demonstrations]
    .filter(d => d.timestamp)
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))

  if (sorted.length < 3) return 'stable'

  // Compare recent third to earlier demonstrations
  const recentThird = sorted.slice(0, Math.floor(sorted.length / 3))
  const earlierDemos = sorted.slice(Math.floor(sorted.length / 3))

  const recentAvgValue = recentThird.reduce((sum, d) => sum + d.value, 0) / recentThird.length
  const earlierAvgValue = earlierDemos.reduce((sum, d) => sum + d.value, 0) / earlierDemos.length

  const difference = recentAvgValue - earlierAvgValue

  if (difference > 0.1) return 'increasing'
  if (difference < -0.1) return 'declining'
  return 'stable'
}

/**
 * Analyze patterns across all skill demonstrations
 */
export function analyzeSkillPatterns(demonstrations: SkillDemonstrations): SkillPattern[] {
  const patterns: SkillPattern[] = []

  for (const [skillName, demos] of Object.entries(demonstrations)) {
    if (!demos || demos.length === 0) continue

    // Count scene types
    const sceneTypeCounts: Record<SceneType, number> = {
      family_conflict: 0,
      career_exploration: 0,
      personal_growth: 0,
      relationship_building: 0,
      unknown: 0
    }

    demos.forEach(demo => {
      const type = classifySceneType(demo.scene, demo.context)
      sceneTypeCounts[type]++
    })

    const sceneTypes: SceneTypeCount[] = Object.entries(sceneTypeCounts)
      .filter(([, count]) => count > 0)
      .map(([type, count]) => ({
        type: type as SceneType,
        count
      }))
      .sort((a, b) => b.count - a.count)

    // Count character mentions
    const characterCounts: Record<string, number> = {}
    demos.forEach(demo => {
      const characters = extractCharacters(demo.context)
      characters.forEach(char => {
        characterCounts[char] = (characterCounts[char] || 0) + 1
      })
    })

    const characterContext: CharacterFrequency[] = Object.entries(characterCounts)
      .map(([character, frequency]) => ({ character, frequency }))
      .sort((a, b) => b.frequency - a.frequency)

    // Determine strength context
    const strengthContext = determineStrengthContext(demos)

    // Calculate trend
    const recentTrend = calculateTrend(demos)

    // Find last demonstrated timestamp
    const lastTimestamp = Math.max(...demos.map(d => d.timestamp || 0))
    const lastDemonstrated = lastTimestamp > 0
      ? new Date(lastTimestamp).toISOString()
      : undefined

    patterns.push({
      skillName,
      totalDemonstrations: demos.length,
      sceneTypes,
      characterContext,
      strengthContext,
      recentTrend,
      lastDemonstrated
    })
  }

  return patterns.sort((a, b) => b.totalDemonstrations - a.totalDemonstrations)
}

/**
 * Get pattern summary for a specific skill
 */
export function getSkillPatternSummary(skillName: string, patterns: SkillPattern[]): string {
  const pattern = patterns.find(p => p.skillName === skillName)
  if (!pattern) return 'No pattern data available'

  const topSceneType = pattern.sceneTypes[0]
  const topCharacter = pattern.characterContext[0]

  let summary = `${pattern.totalDemonstrations} demonstrations`

  if (topSceneType) {
    summary += `, primarily in ${topSceneType.type.replace(/_/g, ' ')}`
  }

  if (topCharacter) {
    summary += `, often with ${topCharacter.character}`
  }

  return summary
}

/**
 * Filter patterns by scene type
 */
export function filterPatternsBySceneType(
  patterns: SkillPattern[],
  sceneType: SceneType
): SkillPattern[] {
  return patterns.filter(pattern =>
    pattern.sceneTypes.some(st => st.type === sceneType && st.count > 0)
  )
}

/**
 * Get skills with increasing trends
 */
export function getIncreasingSkills(patterns: SkillPattern[]): SkillPattern[] {
  return patterns.filter(p => p.recentTrend === 'increasing')
}

/**
 * Get skills with declining trends
 */
export function getDecliningSkills(patterns: SkillPattern[]): SkillPattern[] {
  return patterns.filter(p => p.recentTrend === 'declining')
}

// ============================================================================
// SKILL SORTING UTILITY - Agent 0: Infrastructure - Issue 14
// ============================================================================

export type SortMode = 'by_count' | 'alphabetical' | 'by_recency' | 'by_scene_type'

export interface SortableSkill {
  skillName: string
  demonstrationCount: number
  lastDemonstrated?: string
  dominantSceneType?: SceneType
  // Allow additional properties from SkillPattern
  [key: string]: unknown
}

/**
 * Sort skills by demonstration count (highest first)
 */
function sortByCount(skills: SortableSkill[]): SortableSkill[] {
  return [...skills].sort((a, b) => b.demonstrationCount - a.demonstrationCount)
}

/**
 * Sort skills alphabetically by name
 */
function sortAlphabetically(skills: SortableSkill[]): SortableSkill[] {
  return [...skills].sort((a, b) =>
    a.skillName.localeCompare(b.skillName, 'en', { sensitivity: 'base' })
  )
}

/**
 * Sort skills by recency (most recent first)
 */
function sortByRecency(skills: SortableSkill[]): SortableSkill[] {
  return [...skills].sort((a, b) => {
    // Handle missing timestamps
    if (!a.lastDemonstrated && !b.lastDemonstrated) return 0
    if (!a.lastDemonstrated) return 1 // Move to end
    if (!b.lastDemonstrated) return -1 // Move to end

    const timeA = new Date(a.lastDemonstrated).getTime()
    const timeB = new Date(b.lastDemonstrated).getTime()

    return timeB - timeA // Most recent first
  })
}

/**
 * Sort skills by scene type (grouped by dominant scene type)
 */
function sortBySceneType(skills: SortableSkill[]): SortableSkill[] {
  // Define scene type priority order
  const sceneTypePriority: Record<SceneType, number> = {
    career_exploration: 1,
    family_conflict: 2,
    personal_growth: 3,
    relationship_building: 4,
    unknown: 5
  }

  return [...skills].sort((a, b) => {
    const priorityA = sceneTypePriority[a.dominantSceneType || 'unknown']
    const priorityB = sceneTypePriority[b.dominantSceneType || 'unknown']

    if (priorityA !== priorityB) {
      return priorityA - priorityB
    }

    // Secondary sort by demonstration count within same scene type
    return b.demonstrationCount - a.demonstrationCount
  })
}

/**
 * Main sorting function with 4 modes
 */
export function sortSkills(skills: SortableSkill[], mode: SortMode): SortableSkill[] {
  switch (mode) {
    case 'by_count':
      return sortByCount(skills)
    case 'alphabetical':
      return sortAlphabetically(skills)
    case 'by_recency':
      return sortByRecency(skills)
    case 'by_scene_type':
      return sortBySceneType(skills)
    default:
      return skills
  }
}

/**
 * Convert SkillPattern to SortableSkill format
 */
export function patternToSortable(pattern: SkillPattern): SortableSkill {
  return {
    ...pattern, // Spread first to preserve all properties
    skillName: pattern.skillName,
    demonstrationCount: pattern.totalDemonstrations,
    lastDemonstrated: pattern.lastDemonstrated,
    dominantSceneType: pattern.sceneTypes[0]?.type
  }
}

/**
 * Sort SkillPattern array using any sort mode
 */
export function sortSkillPatterns(patterns: SkillPattern[], mode: SortMode): SkillPattern[] {
  // Use direct pattern sorting to maintain type safety
  switch (mode) {
    case 'by_count':
      return [...patterns].sort((a, b) => b.totalDemonstrations - a.totalDemonstrations)
    case 'alphabetical':
      return [...patterns].sort((a, b) =>
        a.skillName.localeCompare(b.skillName, 'en', { sensitivity: 'base' })
      )
    case 'by_recency':
      return [...patterns].sort((a, b) => {
        if (!a.lastDemonstrated && !b.lastDemonstrated) return 0
        if (!a.lastDemonstrated) return 1
        if (!b.lastDemonstrated) return -1
        const timeA = new Date(a.lastDemonstrated).getTime()
        const timeB = new Date(b.lastDemonstrated).getTime()
        return timeB - timeA
      })
    case 'by_scene_type': {
      const sceneTypePriority: Record<SceneType, number> = {
        career_exploration: 1,
        family_conflict: 2,
        personal_growth: 3,
        relationship_building: 4,
        unknown: 5
      }
      return [...patterns].sort((a, b) => {
        const priorityA = sceneTypePriority[a.sceneTypes[0]?.type || 'unknown']
        const priorityB = sceneTypePriority[b.sceneTypes[0]?.type || 'unknown']
        if (priorityA !== priorityB) {
          return priorityA - priorityB
        }
        return b.totalDemonstrations - a.totalDemonstrations
      })
    }
    default:
      return patterns
  }
}
