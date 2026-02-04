/**
 * Career Expertise Module
 *
 * Demon Slayer-inspired domain expertise calculation.
 * Maps character interactions, skills, and arcs to career domains.
 *
 * Uses a flexible input interface that can be derived from any state structure.
 *
 * @module lib/ranking/career-expertise
 */

import type { CharacterId } from '@/lib/graph-registry'
import type {
  CareerDomain,
  DomainExpertise,
  CareerExpertiseState,
  ExpertiseEvidence
} from './types'
import { CAREER_DOMAINS } from './types'
import { getTierForPoints, calculateProgress } from './registry'
import { TRUST_THRESHOLDS } from '@/lib/constants'

// ═══════════════════════════════════════════════════════════════════════════
// INPUT INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Lightweight input for career expertise calculation
 * Can be derived from GameState, SerializableGameState, or test fixtures
 */
export interface CareerExpertiseInput {
  /** Character trust levels */
  characterTrust: Record<string, number>
  /** Completed arc IDs */
  completedArcs?: string[]
  /** Demonstrated skills with levels */
  skills?: Record<string, number>
}

// ═══════════════════════════════════════════════════════════════════════════
// CHARACTER-DOMAIN MAPPING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Maps each character to their primary career domain
 *
 * Excludes:
 * - samuel (hub character, no domain)
 * - locations (station_entry, grand_hall, market, deep_station)
 */
export const CHARACTER_DOMAIN_MAP: Record<string, CareerDomain> = {
  // Technology (4 characters)
  maya: 'technology',
  devon: 'technology',
  rohan: 'technology',
  nadia: 'technology',

  // Healthcare (3 characters)
  marcus: 'healthcare',
  grace: 'healthcare',
  kai: 'healthcare',

  // Business (3 characters)
  quinn: 'business',
  dante: 'business',
  alex: 'business',

  // Creative (4 characters)
  lira: 'creative',
  zara: 'creative',
  yaquin: 'creative',
  elena: 'creative',

  // Social Impact (6 characters)
  tess: 'social_impact',
  jordan: 'social_impact',
  asha: 'social_impact',
  isaiah: 'social_impact',
  silas: 'social_impact'
}

/**
 * Characters excluded from domain mapping (hub + locations)
 */
export const EXCLUDED_CHARACTERS = new Set([
  'samuel',
  'station_entry',
  'grand_hall',
  'market',
  'deep_station'
])

/**
 * Get characters for a specific domain
 */
export function getCharactersForDomain(domain: CareerDomain): CharacterId[] {
  return Object.entries(CHARACTER_DOMAIN_MAP)
    .filter(([_, d]) => d === domain)
    .map(([charId]) => charId as CharacterId)
}

/**
 * Get domain for a character
 */
export function getDomainForCharacter(charId: CharacterId): CareerDomain | null {
  if (EXCLUDED_CHARACTERS.has(charId)) return null
  return CHARACTER_DOMAIN_MAP[charId] ?? null
}

// ═══════════════════════════════════════════════════════════════════════════
// DOMAIN DISPLAY INFO
// ═══════════════════════════════════════════════════════════════════════════

export interface DomainDisplayInfo {
  name: string
  description: string
  iconVariant: string
  colorToken: string
}

export const DOMAIN_DISPLAY: Record<CareerDomain, DomainDisplayInfo> = {
  technology: {
    name: 'Technology',
    description: 'Innovation, software, and digital systems',
    iconVariant: 'cpu',
    colorToken: 'blue'
  },
  healthcare: {
    name: 'Healthcare',
    description: 'Medicine, wellness, and patient care',
    iconVariant: 'heart',
    colorToken: 'green'
  },
  business: {
    name: 'Business',
    description: 'Finance, strategy, and operations',
    iconVariant: 'briefcase',
    colorToken: 'indigo'
  },
  creative: {
    name: 'Creative',
    description: 'Art, design, and communication',
    iconVariant: 'palette',
    colorToken: 'purple'
  },
  social_impact: {
    name: 'Social Impact',
    description: 'Community, education, and advocacy',
    iconVariant: 'users',
    colorToken: 'amber'
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// POINT CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Point weights for expertise calculation
 *
 * Based on PRD spec:
 * - Skills: 0.8 per demonstrated level
 * - Characters: 5 points at trust >= 6 (TRUST_THRESHOLDS.trusted)
 * - Arcs: 8 points per completed arc with domain character
 */
const POINT_WEIGHTS = {
  SKILL_PER_LEVEL: 0.8,
  CHARACTER_TRUSTED: 5,
  ARC_COMPLETED: 8
}

/**
 * Calculate points for a single domain
 */
export function calculateDomainPoints(
  domain: CareerDomain,
  input: CareerExpertiseInput,
  now: number = Date.now()
): { points: number; evidence: ExpertiseEvidence[] } {
  const domainChars = getCharactersForDomain(domain)
  const evidence: ExpertiseEvidence[] = []
  let points = 0

  // Character trust points
  for (const charId of domainChars) {
    const trust = input.characterTrust[charId] ?? 0

    if (trust >= TRUST_THRESHOLDS.trusted) {
      points += POINT_WEIGHTS.CHARACTER_TRUSTED
      evidence.push({
        type: 'trust_built',
        description: `Built trust with ${charId}`,
        timestamp: now
      })
    }
  }

  // Arc completion points (check completed arcs involving domain characters)
  const completedArcs = input.completedArcs || []
  for (const arcId of completedArcs) {
    // Arc IDs typically include character name: e.g., "maya_main", "devon_insight"
    const arcChar = domainChars.find(charId => arcId.toLowerCase().includes(charId))
    if (arcChar) {
      points += POINT_WEIGHTS.ARC_COMPLETED
      evidence.push({
        type: 'arc_completed',
        description: `Completed ${arcId} arc`,
        timestamp: now
      })
    }
  }

  // Skill points (from demonstrated skills matching domain)
  const skills = input.skills || {}

  // Map domains to skill keywords for matching
  const domainSkillKeywords: Record<CareerDomain, string[]> = {
    technology: ['coding', 'software', 'data', 'tech', 'system', 'ai', 'digital', 'programming', 'analysis'],
    healthcare: ['health', 'care', 'medical', 'patient', 'safety', 'wellness'],
    business: ['business', 'finance', 'sales', 'strategy', 'operations', 'management', 'entrepreneurship'],
    creative: ['creative', 'design', 'art', 'communication', 'writing', 'media', 'sound'],
    social_impact: ['social', 'community', 'education', 'teaching', 'advocacy', 'nonprofit', 'conflict']
  }

  const keywords = domainSkillKeywords[domain]
  for (const [skillId, level] of Object.entries(skills)) {
    const skillLower = skillId.toLowerCase()
    if (keywords.some(kw => skillLower.includes(kw))) {
      const skillPoints = (level as number) * POINT_WEIGHTS.SKILL_PER_LEVEL
      points += skillPoints
      evidence.push({
        type: 'skill_demonstrated',
        description: `Demonstrated ${skillId} (level ${level})`,
        timestamp: now
      })
    }
  }

  return { points, evidence }
}

// ═══════════════════════════════════════════════════════════════════════════
// STATE CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate full career expertise state from input
 */
export function calculateCareerExpertiseState(
  input: CareerExpertiseInput,
  now: number = Date.now()
): CareerExpertiseState {
  const domains: Record<CareerDomain, DomainExpertise> = {} as Record<CareerDomain, DomainExpertise>

  let maxPoints = 0
  let primaryDomain: CareerDomain | null = null
  const championDomains: CareerDomain[] = []
  let domainsWithPoints = 0

  for (const domain of CAREER_DOMAINS) {
    const { points, evidence } = calculateDomainPoints(domain, input, now)
    const tier = getTierForPoints('career_expertise', points)
    const progress = calculateProgress('career_expertise', points)

    const isChampion = tier.name === 'Champion'
    if (isChampion) {
      championDomains.push(domain)
    }

    if (points > maxPoints) {
      maxPoints = points
      primaryDomain = domain
    }

    if (points > 0) {
      domainsWithPoints++
    }

    domains[domain] = {
      domain,
      tierId: tier.id,
      tierName: tier.name,
      level: tier.level,
      points,
      percentToNext: progress.percent,
      isChampion,
      evidence
    }
  }

  // Determine breadth (how many domains player is exploring)
  let breadth: 'narrow' | 'moderate' | 'broad'
  if (domainsWithPoints <= 1) {
    breadth = 'narrow'
  } else if (domainsWithPoints <= 3) {
    breadth = 'moderate'
  } else {
    breadth = 'broad'
  }

  return {
    domains,
    primaryDomain,
    championDomains,
    breadth
  }
}

/**
 * Get display tier name for a domain
 */
export function getDomainTierName(domain: CareerDomain, input: CareerExpertiseInput): string {
  const { points } = calculateDomainPoints(domain, input)
  const tier = getTierForPoints('career_expertise', points)
  return tier.name
}

/**
 * Check if player is champion in a domain
 */
export function isChampionInDomain(domain: CareerDomain, input: CareerExpertiseInput): boolean {
  const { points } = calculateDomainPoints(domain, input)
  const tier = getTierForPoints('career_expertise', points)
  return tier.name === 'Champion'
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPERTISE TIER DISPLAY NAMES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Career expertise tier display names (from registry)
 */
export const EXPERTISE_TIER_NAMES = [
  'Curious',      // Level 0: threshold 0
  'Exploring',    // Level 1: threshold 3
  'Apprentice',   // Level 2: threshold 8
  'Practitioner', // Level 3: threshold 15
  'Specialist',   // Level 4: threshold 25
  'Champion'      // Level 5: threshold 35
]

/**
 * Samuel's messages for expertise milestones
 */
export const SAMUEL_EXPERTISE_MESSAGES: Record<string, string[]> = {
  Curious: [
    "I see you're looking toward a new path.",
    "Curiosity is the first step. Keep exploring."
  ],
  Exploring: [
    "You're starting to understand what this field offers.",
    "The more you explore, the clearer the path becomes."
  ],
  Apprentice: [
    "You've moved beyond curiosity to real learning.",
    "An apprentice sees the craft beneath the surface."
  ],
  Practitioner: [
    "You're ready to contribute in meaningful ways now.",
    "Practice makes the path your own."
  ],
  Specialist: [
    "Others will seek your insight in this domain.",
    "Deep knowledge reveals hidden connections."
  ],
  Champion: [
    "You've mastered this domain. Others will follow your lead.",
    "A champion lights the way for those who come after."
  ]
}

/**
 * Get Samuel's message for expertise tier
 */
export function getSamuelExpertiseMessage(tierName: string): string {
  const messages = SAMUEL_EXPERTISE_MESSAGES[tierName] || SAMUEL_EXPERTISE_MESSAGES.Curious
  return messages[Math.floor(Math.random() * messages.length)]
}
