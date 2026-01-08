/**
 * Character Tiers - Narrative Resource Allocation System
 *
 * Following AAA 70/20/10 principle for content investment:
 * - Tier 1 (Core): 70% of effort, deepest content
 * - Tier 2 (Primary): 20% of effort, rich content
 * - Tier 3 (Secondary): 10% of effort, standard content
 * - Tier 4 (Extended): Supporting cast, minimal investment
 *
 * Used to prioritize:
 * - Dialogue depth expansion
 * - Voice variation investment
 * - Pattern reflection coverage
 */

import { CharacterId } from './graph-registry'

/**
 * Location IDs (not actual characters - excluded from tier calculations)
 */
export const LOCATION_IDS: CharacterId[] = ['station_entry', 'grand_hall', 'market', 'deep_station']

/**
 * Check if an ID is a location rather than a character
 */
export function isLocationId(id: CharacterId): boolean {
  return LOCATION_IDS.includes(id)
}

/**
 * Character narrative tiers
 */
export type CharacterTier = 1 | 2 | 3 | 4

/**
 * Tier configuration with targets
 */
export interface TierConfig {
  /** Tier number (1-4) */
  tier: CharacterTier
  /** Target dialogue node count */
  dialogueTarget: number
  /** Target voice variations */
  voiceVariationTarget: number
  /** Target pattern reflections */
  patternReflectionTarget: number
  /** Description of tier purpose */
  description: string
}

/**
 * Tier configuration constants
 */
export const TIER_CONFIGS: Record<CharacterTier, Omit<TierConfig, 'tier'>> = {
  1: {
    dialogueTarget: 80,
    voiceVariationTarget: 15,
    patternReflectionTarget: 10,
    description: 'Core characters - hub and primary story drivers'
  },
  2: {
    dialogueTarget: 50,
    voiceVariationTarget: 10,
    patternReflectionTarget: 6,
    description: 'Primary characters - deep career path representation'
  },
  3: {
    dialogueTarget: 35,
    voiceVariationTarget: 6,
    patternReflectionTarget: 4,
    description: 'Secondary characters - supporting career paths'
  },
  4: {
    dialogueTarget: 25,
    voiceVariationTarget: 6,
    patternReflectionTarget: 2,
    description: 'Extended cast - specialized/niche paths'
  }
}

/**
 * Character tier assignments
 * Based on narrative importance and career path breadth
 */
export const CHARACTER_TIERS: Record<CharacterId, CharacterTier> = {
  // Tier 1: Core (Hub + Primary Story)
  samuel: 1,    // Hub character, station keeper
  maya: 1,      // Tech/innovation flagship
  devon: 1,     // Systems thinking flagship

  // Tier 2: Primary (Deep Career Paths)
  marcus: 2,    // Healthcare
  tess: 2,      // Education
  rohan: 2,     // Deep tech
  kai: 2,       // Safety/security

  // Tier 3: Secondary (Supporting Paths)
  grace: 3,     // Healthcare operations
  elena: 3,     // Information science
  alex: 3,      // Logistics
  yaquin: 3,    // EdTech

  // Tier 4: Extended Cast
  silas: 4,     // Manufacturing
  asha: 4,      // Conflict resolution
  lira: 4,      // Communications
  zara: 4,      // Data ethics
  jordan: 4,    // Career navigation

  // NEW: LinkedIn 2026 Character Expansion
  // Quinn & Nadia: Tier 2 (Primary) - Finance & AI Strategy are key growth areas
  quinn: 2,     // Finance/Investment - LinkedIn #12, #20, #21
  nadia: 2,     // AI Strategy - LinkedIn #2 (fastest growing)

  // Dante & Isaiah: Tier 3 (Secondary) - Sales & Nonprofit supporting paths
  dante: 3,     // Sales/Marketing - LinkedIn #8, #10, #13, #16
  isaiah: 3,    // Nonprofit/Fundraising - LinkedIn #14

  // Locations (not characters - tier 4 as fallback for type safety)
  station_entry: 4,
  grand_hall: 4,
  market: 4,
  deep_station: 4
}

/**
 * Get the tier for a character
 */
export function getCharacterTier(characterId: CharacterId): CharacterTier {
  return CHARACTER_TIERS[characterId] || 4
}

/**
 * Get tier configuration for a character
 */
export function getCharacterTierConfig(characterId: CharacterId): TierConfig {
  const tier = getCharacterTier(characterId)
  return {
    tier,
    ...TIER_CONFIGS[tier]
  }
}

/**
 * Get all characters in a specific tier
 * Excludes location IDs (station_entry, grand_hall, etc.)
 */
export function getCharactersByTier(tier: CharacterTier): CharacterId[] {
  return (Object.entries(CHARACTER_TIERS) as [CharacterId, CharacterTier][])
    .filter(([id, t]) => t === tier && !isLocationId(id))
    .map(([id]) => id)
}

/**
 * Check if character meets dialogue target
 */
export function meetsDialogueTarget(characterId: CharacterId, currentNodes: number): boolean {
  const config = getCharacterTierConfig(characterId)
  return currentNodes >= config.dialogueTarget
}

/**
 * Check if character meets voice variation target
 */
export function meetsVoiceTarget(characterId: CharacterId, currentVariations: number): boolean {
  const config = getCharacterTierConfig(characterId)
  return currentVariations >= config.voiceVariationTarget
}

/**
 * Get priority score for content investment
 * Higher score = higher priority for expansion
 */
export function getExpansionPriority(
  characterId: CharacterId,
  currentNodes: number,
  currentVoiceVariations: number
): number {
  const config = getCharacterTierConfig(characterId)

  // Base priority from tier (Tier 1 = highest)
  const tierPriority = (5 - config.tier) * 100

  // Gap priority (further from target = higher priority)
  const dialogueGap = Math.max(0, config.dialogueTarget - currentNodes)
  const voiceGap = Math.max(0, config.voiceVariationTarget - currentVoiceVariations)

  return tierPriority + dialogueGap + (voiceGap * 5)
}

/**
 * Get characters ordered by expansion priority
 * Excludes location IDs (station_entry, grand_hall, etc.)
 */
export function getExpansionOrder(
  currentStats: Map<CharacterId, { nodes: number; voiceVariations: number }>
): CharacterId[] {
  // Filter out locations - only include actual characters
  const characters = (Object.keys(CHARACTER_TIERS) as CharacterId[])
    .filter(id => !isLocationId(id))

  return characters.sort((a, b) => {
    const statsA = currentStats.get(a) || { nodes: 0, voiceVariations: 0 }
    const statsB = currentStats.get(b) || { nodes: 0, voiceVariations: 0 }

    const priorityA = getExpansionPriority(a, statsA.nodes, statsA.voiceVariations)
    const priorityB = getExpansionPriority(b, statsB.nodes, statsB.voiceVariations)

    return priorityB - priorityA // Higher priority first
  })
}

/**
 * Generate a tier progress report
 */
export function generateTierReport(
  currentStats: Map<CharacterId, { nodes: number; voiceVariations: number }>
): string {
  const lines: string[] = ['# Character Tier Progress Report\n']

  for (const tier of [1, 2, 3, 4] as CharacterTier[]) {
    const config = TIER_CONFIGS[tier]
    const characters = getCharactersByTier(tier)

    lines.push(`## Tier ${tier}: ${config.description}`)
    lines.push(`Target: ${config.dialogueTarget} nodes, ${config.voiceVariationTarget} voice variations\n`)

    for (const charId of characters) {
      const stats = currentStats.get(charId) || { nodes: 0, voiceVariations: 0 }
      const nodeStatus = stats.nodes >= config.dialogueTarget ? '✅' : '⚠️'
      const voiceStatus = stats.voiceVariations >= config.voiceVariationTarget ? '✅' : '⚠️'

      lines.push(`- ${charId}: ${nodeStatus} ${stats.nodes}/${config.dialogueTarget} nodes, ${voiceStatus} ${stats.voiceVariations}/${config.voiceVariationTarget} voice`)
    }
    lines.push('')
  }

  return lines.join('\n')
}
