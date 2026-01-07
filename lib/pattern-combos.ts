/**
 * Pattern Combos - Silent Career Connection System
 *
 * INVISIBLE DEPTH PRINCIPLE:
 * Backend tracks pattern combinations silently.
 * Characters mention careers in dialogue when combos are achieved.
 * Player feels "seen" without knowing why.
 *
 * This system does NOT create UI notifications.
 * All manifestation happens through dialogue nodes with visibleCondition.
 */

import { PatternType } from './patterns'
import { CharacterId } from './graph-registry'
import { PlayerPatterns } from './character-state'

/**
 * A pattern combination that unlocks career-related dialogue
 */
export interface PatternCombo {
  /** Unique identifier for this combo */
  id: string

  /** Pattern requirements (all must be met) */
  requirements: Partial<Record<PatternType, number>>

  /** Career hint that character will mention */
  careerHint: string

  /** Full career description for deeper dialogue */
  careerDescription: string

  /** Which character mentions this career */
  characterId: CharacterId

  /** Birmingham-specific connection */
  birminghamConnection?: string
}

/**
 * All pattern combos in the system
 * Each combo links specific pattern combinations to career paths
 */
export const PATTERN_COMBOS: PatternCombo[] = [
  // Maya's Tech Combos
  {
    id: 'architect_vision',
    requirements: { analytical: 5, building: 4 },
    careerHint: 'systems architects',
    careerDescription: 'People who design how complex systems work together - the invisible architects behind everything from apps to city infrastructure.',
    characterId: 'maya',
    birminghamConnection: 'UAB has a growing tech hub for systems design'
  },
  {
    id: 'data_storyteller',
    requirements: { analytical: 5, exploring: 4 },
    careerHint: 'data scientists',
    careerDescription: 'Explorers who find stories hidden in numbers - turning raw data into insights that change how we understand the world.',
    characterId: 'maya',
    birminghamConnection: 'Birmingham\'s healthcare sector needs data talent'
  },
  {
    id: 'creative_technologist',
    requirements: { building: 5, exploring: 4 },
    careerHint: 'creative technologists',
    careerDescription: 'Inventors at the intersection of art and engineering - they make technology feel human.',
    characterId: 'maya'
  },

  // Marcus's Healthcare Combos
  {
    id: 'healers_path',
    requirements: { helping: 6, patience: 3 },
    careerHint: 'healthcare coordinators',
    careerDescription: 'The patient advocates who navigate complex medical systems - making sure no one falls through the cracks.',
    characterId: 'marcus',
    birminghamConnection: 'Birmingham\'s medical district is one of the largest in the Southeast'
  },
  {
    id: 'medical_detective',
    requirements: { analytical: 5, helping: 4 },
    careerHint: 'medical researchers',
    careerDescription: 'Scientists who solve the puzzles of disease - their curiosity saves lives.',
    characterId: 'marcus',
    birminghamConnection: 'UAB is a leading research hospital'
  },
  {
    id: 'health_educator',
    requirements: { helping: 5, patience: 4 },
    careerHint: 'community health workers',
    careerDescription: 'Bridge-builders between medical expertise and community needs - they make health accessible.',
    characterId: 'marcus'
  },

  // Devon's Engineering Combos
  {
    id: 'systems_thinker',
    requirements: { analytical: 5, patience: 4 },
    careerHint: 'process engineers',
    careerDescription: 'Optimizers who see the whole picture - they make complex systems work smoothly.',
    characterId: 'devon'
  },
  {
    id: 'sustainable_builder',
    requirements: { building: 5, patience: 4 },
    careerHint: 'sustainability engineers',
    careerDescription: 'Builders who think in generations - designing systems that last and heal.',
    characterId: 'devon',
    birminghamConnection: 'Alabama Power and Southern Company are investing in sustainable infrastructure'
  },

  // Tess's Education Combos
  {
    id: 'patient_teacher',
    requirements: { helping: 5, patience: 5 },
    careerHint: 'education specialists',
    careerDescription: 'Those who understand that learning takes time - creating spaces where everyone can grow.',
    characterId: 'tess'
  },
  {
    id: 'curriculum_designer',
    requirements: { building: 4, helping: 5 },
    careerHint: 'curriculum developers',
    careerDescription: 'Architects of learning experiences - building bridges between knowledge and understanding.',
    characterId: 'tess'
  },

  // Rohan's Deep Tech Combos
  {
    id: 'deep_coder',
    requirements: { analytical: 6, building: 4 },
    careerHint: 'software architects',
    careerDescription: 'The ones who build the foundations - their code runs systems you use every day without knowing.',
    characterId: 'rohan'
  },
  {
    id: 'security_guardian',
    requirements: { analytical: 5, patience: 5 },
    careerHint: 'cybersecurity specialists',
    careerDescription: 'Digital guardians who think like both protectors and threats - keeping systems safe.',
    characterId: 'rohan',
    birminghamConnection: 'Birmingham is becoming a cybersecurity hub'
  },

  // Elena's Information Science Combos
  {
    id: 'knowledge_curator',
    requirements: { analytical: 4, patience: 5 },
    careerHint: 'information architects',
    careerDescription: 'Organizers of knowledge - they create systems that help people find what they need.',
    characterId: 'elena'
  },
  {
    id: 'research_navigator',
    requirements: { exploring: 5, analytical: 4 },
    careerHint: 'research librarians',
    careerDescription: 'Guides through vast seas of information - they help discoveries happen.',
    characterId: 'elena'
  },

  // Alex's Operations Combos
  {
    id: 'logistics_master',
    requirements: { analytical: 4, building: 5 },
    careerHint: 'supply chain managers',
    careerDescription: 'Orchestrators of movement - they make sure everything arrives where it needs to be.',
    characterId: 'alex'
  },
  {
    id: 'operations_optimizer',
    requirements: { analytical: 5, patience: 4 },
    careerHint: 'operations analysts',
    careerDescription: 'Efficiency experts who see patterns in processes - they find the hidden improvements.',
    characterId: 'alex'
  },

  // Grace's Healthcare Operations Combos
  {
    id: 'care_coordinator',
    requirements: { helping: 5, analytical: 4 },
    careerHint: 'patient care coordinators',
    careerDescription: 'Navigators who blend empathy with systems thinking - ensuring care flows smoothly.',
    characterId: 'grace'
  },

  // Jordan's Career Navigation Combos
  {
    id: 'path_finder',
    requirements: { helping: 4, exploring: 5 },
    careerHint: 'career counselors',
    careerDescription: 'Guides who help others find their way - they see potential before it blooms.',
    characterId: 'jordan'
  },

  // Kai's Safety Combos
  {
    id: 'safety_designer',
    requirements: { analytical: 4, helping: 4, patience: 3 },
    careerHint: 'safety engineers',
    careerDescription: 'Protectors who think ahead - designing systems that keep people safe before danger arrives.',
    characterId: 'kai'
  },

  // Silas's Manufacturing Combos
  {
    id: 'precision_maker',
    requirements: { building: 6, patience: 4 },
    careerHint: 'advanced manufacturing specialists',
    careerDescription: 'Craftspeople of the future - where precision meets innovation.',
    characterId: 'silas',
    birminghamConnection: 'Mercedes and Honda have major facilities nearby'
  }
]

/**
 * Check if player patterns meet a combo's requirements
 */
export function meetsComboRequirements(
  patterns: PlayerPatterns,
  combo: PatternCombo
): boolean {
  for (const [pattern, required] of Object.entries(combo.requirements)) {
    const playerValue = patterns[pattern as PatternType]
    if (playerValue < required) {
      return false
    }
  }
  return true
}

/**
 * Get all combos that the player has achieved
 * @returns Array of combo IDs that are unlocked
 */
export function getUnlockedCombos(patterns: PlayerPatterns): string[] {
  return PATTERN_COMBOS
    .filter(combo => meetsComboRequirements(patterns, combo))
    .map(combo => combo.id)
}

/**
 * Get combos unlocked for a specific character
 * Useful for determining what career mentions a character can make
 */
export function getCharacterUnlockedCombos(
  patterns: PlayerPatterns,
  characterId: CharacterId
): PatternCombo[] {
  return PATTERN_COMBOS.filter(
    combo => combo.characterId === characterId && meetsComboRequirements(patterns, combo)
  )
}

/**
 * Get a specific combo by ID
 */
export function getComboById(comboId: string): PatternCombo | undefined {
  return PATTERN_COMBOS.find(combo => combo.id === comboId)
}

/**
 * Check if a specific combo is unlocked
 */
export function isComboUnlocked(comboId: string, patterns: PlayerPatterns): boolean {
  const combo = getComboById(comboId)
  if (!combo) return false
  return meetsComboRequirements(patterns, combo)
}

/**
 * Get the global flag name for an achieved combo
 * Used in dialogue visibleCondition
 */
export function getComboFlag(comboId: string): string {
  return `combo_${comboId}_achieved`
}

/**
 * Get progress toward a combo (0-100%)
 * Useful for showing how close player is to unlocking
 */
export function getComboProgress(
  patterns: PlayerPatterns,
  combo: PatternCombo
): number {
  let totalRequired = 0
  let totalAchieved = 0

  for (const [pattern, required] of Object.entries(combo.requirements)) {
    const playerValue = patterns[pattern as PatternType]
    totalRequired += required
    totalAchieved += Math.min(playerValue, required)
  }

  if (totalRequired === 0) return 100
  return Math.round((totalAchieved / totalRequired) * 100)
}

/**
 * Career match result for a specific pattern
 */
export interface PatternCareerMatch {
  comboId: string
  careerHint: string
  progress: number
  isUnlocked: boolean
}

/**
 * Get career matches for a specific pattern
 * Returns careers that require this pattern, sorted by progress
 */
export function getCareersForPattern(
  pattern: PatternType,
  patterns: PlayerPatterns
): PatternCareerMatch[] {
  // Find all combos that require this pattern
  const relevantCombos = PATTERN_COMBOS.filter(combo =>
    combo.requirements[pattern] !== undefined
  )

  // Calculate progress and sort by closest to unlocking
  const matches = relevantCombos.map(combo => ({
    comboId: combo.id,
    careerHint: combo.careerHint,
    progress: getComboProgress(patterns, combo),
    isUnlocked: meetsComboRequirements(patterns, combo)
  }))

  // Sort: unlocked first, then by progress descending
  return matches.sort((a, b) => {
    if (a.isUnlocked !== b.isUnlocked) {
      return a.isUnlocked ? -1 : 1
    }
    return b.progress - a.progress
  })
}

/**
 * Get top career hint for display on a pattern orb
 * Returns the closest unlockable or already unlocked career
 */
export function getTopCareerForPattern(
  pattern: PatternType,
  patterns: PlayerPatterns
): PatternCareerMatch | null {
  const careers = getCareersForPattern(pattern, patterns)
  return careers[0] || null
}

/**
 * Get combos that are close to being unlocked (>= 75% progress)
 * Characters might hint at these in dialogue
 */
export function getNearbyUnlocks(
  patterns: PlayerPatterns,
  characterId?: CharacterId
): PatternCombo[] {
  return PATTERN_COMBOS.filter(combo => {
    if (characterId && combo.characterId !== characterId) return false
    const progress = getComboProgress(patterns, combo)
    return progress >= 75 && progress < 100
  })
}
