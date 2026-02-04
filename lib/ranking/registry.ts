/**
 * Rank Registry - Canonical Tier Definitions
 *
 * All rank tiers defined here. This is the single source of truth.
 * Thresholds align with existing systems (ORB_TIERS, TRUST_THRESHOLDS, etc.)
 *
 * @module lib/ranking/registry
 */

import type { RankTier, RankCategory } from './types'
import { ORB_TIERS } from '@/lib/orbs'
// TRUST_THRESHOLDS available from '@/lib/constants' if needed for future enhancements

// ═══════════════════════════════════════════════════════════════════════════
// RANK REGISTRY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * All rank tiers by category
 *
 * CRITICAL: pattern_mastery thresholds MUST match ORB_TIERS from lib/orbs.ts:
 *   nascent: 0, emerging: 10, developing: 30, flourishing: 60, mastered: 100
 */
export const RANK_REGISTRY: Record<RankCategory, RankTier[]> = {
  // ─────────────────────────────────────────────────────────────────────────
  // PATTERN MASTERY - Claymore inspired
  // Thresholds align with ORB_TIERS.*.minOrbs
  // ─────────────────────────────────────────────────────────────────────────
  pattern_mastery: [
    {
      id: 'pm_traveler',
      category: 'pattern_mastery',
      level: 0,
      name: 'Traveler',
      threshold: ORB_TIERS.nascent.minOrbs,     // 0
      description: 'Just arrived at the station. Everything is new.',
      iconVariant: 'compass',
      colorToken: 'slate'
    },
    {
      id: 'pm_passenger',
      category: 'pattern_mastery',
      level: 1,
      name: 'Passenger',
      threshold: ORB_TIERS.emerging.minOrbs,    // 10
      description: 'Beginning to find your way. Patterns emerging.',
      iconVariant: 'ticket',
      colorToken: 'blue'
    },
    {
      id: 'pm_regular',
      category: 'pattern_mastery',
      level: 2,
      name: 'Regular',
      threshold: ORB_TIERS.developing.minOrbs,  // 30
      description: 'The station knows you. You know yourself.',
      iconVariant: 'badge',
      colorToken: 'indigo'
    },
    {
      id: 'pm_conductor',
      category: 'pattern_mastery',
      level: 3,
      name: 'Conductor',
      threshold: ORB_TIERS.flourishing.minOrbs, // 60
      description: 'You guide your own journey now.',
      iconVariant: 'hat',
      colorToken: 'purple'
    },
    {
      id: 'pm_stationmaster',
      category: 'pattern_mastery',
      level: 4,
      name: 'Station Master',
      threshold: ORB_TIERS.mastered.minOrbs,    // 100
      description: 'The station is part of you. You are part of it.',
      iconVariant: 'key',
      colorToken: 'amber'
    }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // CAREER EXPERTISE - Demon Slayer inspired
  // ─────────────────────────────────────────────────────────────────────────
  career_expertise: [
    {
      id: 'ce_curious',
      category: 'career_expertise',
      level: 0,
      name: 'Curious',
      threshold: 0,
      description: 'Just beginning to explore this path.',
      colorToken: 'slate'
    },
    {
      id: 'ce_exploring',
      category: 'career_expertise',
      level: 1,
      name: 'Exploring',
      threshold: 3,
      description: 'Actively investigating what this domain offers.',
      colorToken: 'blue'
    },
    {
      id: 'ce_apprentice',
      category: 'career_expertise',
      level: 2,
      name: 'Apprentice',
      threshold: 8,
      description: 'Learning the fundamentals with growing confidence.',
      colorToken: 'green'
    },
    {
      id: 'ce_practitioner',
      category: 'career_expertise',
      level: 3,
      name: 'Practitioner',
      threshold: 15,
      description: 'Capable of real contribution in this field.',
      colorToken: 'indigo'
    },
    {
      id: 'ce_specialist',
      category: 'career_expertise',
      level: 4,
      name: 'Specialist',
      threshold: 25,
      description: 'Deep expertise recognized by others.',
      colorToken: 'purple'
    },
    {
      id: 'ce_champion',
      category: 'career_expertise',
      level: 5,
      name: 'Champion',
      threshold: 35, // Reduced from 40 to be achievable
      description: 'A guiding light for others in this domain.',
      colorToken: 'amber'
    }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // CHALLENGE RATING - JJK inspired
  // Maps to ReadinessLevel: exploratory, emerging, near_ready, ready
  // ─────────────────────────────────────────────────────────────────────────
  challenge_rating: [
    {
      id: 'cr_d',
      category: 'challenge_rating',
      level: 0,
      name: 'Grade D',
      threshold: 0,
      description: 'Starting your journey. Safe paths ahead.',
      colorToken: 'slate'
    },
    {
      id: 'cr_c',
      category: 'challenge_rating',
      level: 1,
      name: 'Grade C',
      threshold: 25,
      description: 'Finding your footing. Standard challenges.',
      colorToken: 'blue'
    },
    {
      id: 'cr_b',
      category: 'challenge_rating',
      level: 2,
      name: 'Grade B',
      threshold: 50,
      description: 'Growing stronger. Meaningful tests ahead.',
      colorToken: 'green'
    },
    {
      id: 'cr_a',
      category: 'challenge_rating',
      level: 3,
      name: 'Grade A',
      threshold: 75,
      description: 'Near mastery. Complex paths open.',
      colorToken: 'purple'
    },
    {
      id: 'cr_s',
      category: 'challenge_rating',
      level: 4,
      name: 'Grade S',
      threshold: 90,
      description: 'Ready for anything. The station salutes you.',
      colorToken: 'amber'
    }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // STATION STANDING - OPM inspired
  // ─────────────────────────────────────────────────────────────────────────
  station_standing: [
    {
      id: 'ss_newcomer',
      category: 'station_standing',
      level: 0,
      name: 'Newcomer',
      threshold: 0,
      description: 'A fresh face at the station.',
      colorToken: 'slate'
    },
    {
      id: 'ss_regular',
      category: 'station_standing',
      level: 1,
      name: 'Regular',
      threshold: 25,
      description: 'The staff nod when they see you.',
      colorToken: 'blue'
    },
    {
      id: 'ss_notable',
      category: 'station_standing',
      level: 2,
      name: 'Notable',
      threshold: 75,
      description: 'People remember your name.',
      colorToken: 'purple'
    },
    {
      id: 'ss_distinguished',
      category: 'station_standing',
      level: 3,
      name: 'Distinguished',
      threshold: 150,
      description: 'A pillar of the station community.',
      colorToken: 'amber'
    }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // SKILL STARS - HxH inspired
  // Based on existing skill combo system
  // ─────────────────────────────────────────────────────────────────────────
  skill_stars: [
    {
      id: 'sk_unstarred',
      category: 'skill_stars',
      level: 0,
      name: 'Unstarred',
      threshold: 0,
      description: 'Your constellation awaits.',
      colorToken: 'slate'
    },
    {
      id: 'sk_bronze',
      category: 'skill_stars',
      level: 1,
      name: 'Bronze Star',
      threshold: 3,
      description: 'First lights appear in your sky.',
      colorToken: 'orange'
    },
    {
      id: 'sk_silver',
      category: 'skill_stars',
      level: 2,
      name: 'Silver Star',
      threshold: 9,
      description: 'A recognizable pattern forms.',
      colorToken: 'slate'
    },
    {
      id: 'sk_gold',
      category: 'skill_stars',
      level: 3,
      name: 'Gold Star',
      threshold: 18,
      description: 'Your constellation shines bright.',
      colorToken: 'amber'
    }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // ELITE STATUS - Bleach inspired
  // Special designations with multi-system requirements
  // ─────────────────────────────────────────────────────────────────────────
  elite_status: [
    {
      id: 'es_none',
      category: 'elite_status',
      level: 0,
      name: 'Standard',
      threshold: 0,
      description: 'Walking your own path.',
      colorToken: 'slate'
    },
    {
      id: 'es_recognized',
      category: 'elite_status',
      level: 1,
      name: 'Recognized',
      threshold: 1,
      description: 'The station has taken notice.',
      colorToken: 'blue'
    },
    {
      id: 'es_elite',
      category: 'elite_status',
      level: 2,
      name: 'Elite',
      threshold: 3,
      description: 'Among the exceptional few.',
      colorToken: 'purple'
    },
    {
      id: 'es_legendary',
      category: 'elite_status',
      level: 3,
      name: 'Legendary',
      threshold: 5,
      description: 'Stories will be told of your journey.',
      colorToken: 'amber'
    }
  ]
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get tier for a given category and point total
 * Returns the highest tier where threshold <= points
 */
export function getTierForPoints(category: RankCategory, points: number): RankTier {
  const tiers = RANK_REGISTRY[category]

  // Find highest tier where threshold <= points
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (points >= tiers[i].threshold) {
      return tiers[i]
    }
  }

  return tiers[0] // Default to lowest
}

/**
 * Get tier by ID
 */
export function getTierById(tierId: string): RankTier | undefined {
  for (const tiers of Object.values(RANK_REGISTRY)) {
    const tier = tiers.find(t => t.id === tierId)
    if (tier) return tier
  }
  return undefined
}

/**
 * Calculate progress to next tier
 */
export function calculateProgress(
  category: RankCategory,
  points: number
): { toNext: number; percent: number } {
  const tiers = RANK_REGISTRY[category]
  const currentTier = getTierForPoints(category, points)
  const currentIndex = tiers.findIndex(t => t.id === currentTier.id)

  // At max tier
  if (currentIndex >= tiers.length - 1) {
    return { toNext: 0, percent: 100 }
  }

  const nextTier = tiers[currentIndex + 1]
  const pointsInTier = points - currentTier.threshold
  const tierRange = nextTier.threshold - currentTier.threshold

  return {
    toNext: nextTier.threshold - points,
    percent: Math.floor((pointsInTier / tierRange) * 100)
  }
}

/**
 * Get all tiers for a category
 */
export function getTiersForCategory(category: RankCategory): RankTier[] {
  return RANK_REGISTRY[category]
}

/**
 * Get next tier (if any)
 */
export function getNextTier(category: RankCategory, currentTierId: string): RankTier | null {
  const tiers = RANK_REGISTRY[category]
  const currentIndex = tiers.findIndex(t => t.id === currentTierId)

  if (currentIndex < 0 || currentIndex >= tiers.length - 1) {
    return null
  }

  return tiers[currentIndex + 1]
}

/**
 * Check if player would promote with given points
 */
export function wouldPromote(
  category: RankCategory,
  currentTierId: string,
  newPoints: number
): boolean {
  const newTier = getTierForPoints(category, newPoints)
  return newTier.id !== currentTierId && newTier.level > (getTierById(currentTierId)?.level ?? 0)
}

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validate registry integrity
 * Called by contract tests
 */
export function validateRegistry(): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const allIds = new Set<string>()

  for (const [category, tiers] of Object.entries(RANK_REGISTRY)) {
    // Check minimum tier count
    if (tiers.length < 2) {
      errors.push(`${category}: Must have at least 2 tiers`)
    }

    // Check thresholds are increasing
    for (let i = 1; i < tiers.length; i++) {
      if (tiers[i].threshold <= tiers[i - 1].threshold) {
        errors.push(`${category}: Thresholds must be strictly increasing`)
      }
    }

    // Check levels are sequential
    for (let i = 0; i < tiers.length; i++) {
      if (tiers[i].level !== i) {
        errors.push(`${category}: Levels must be sequential starting at 0`)
      }
    }

    // Check unique IDs
    for (const tier of tiers) {
      if (allIds.has(tier.id)) {
        errors.push(`Duplicate tier ID: ${tier.id}`)
      }
      allIds.add(tier.id)
    }
  }

  return { valid: errors.length === 0, errors }
}
