/**
 * Cognitive Domain Scoring System
 *
 * Maps the 54 skills to 11 cognitive domains inspired by DSM-5 neurocognitive
 * assessment framework, adapted for career exploration with Birmingham youth.
 *
 * Core Domains (DSM-5 Inspired):
 * - Complex Attention
 * - Executive Functions
 * - Learning & Memory
 * - Language
 * - Perceptual-Motor
 * - Social Cognition
 *
 * Advanced Domains:
 * - Metacognition
 * - Wisdom & Judgment
 * - Creativity & Synthesis
 * - Emotional Intelligence
 * - Adaptive Functioning
 */

import { PatternType } from './patterns'

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

export const COGNITIVE_DOMAIN_IDS = [
  'complexAttention',
  'executiveFunctions',
  'learningMemory',
  'language',
  'perceptualMotor',
  'socialCognition',
  'metacognition',
  'wisdomJudgment',
  'creativitySynthesis',
  'emotionalIntelligence',
  'adaptiveFunctioning'
] as const

export type CognitiveDomainId = typeof COGNITIVE_DOMAIN_IDS[number]

export type DomainLevel = 'dormant' | 'emerging' | 'developing' | 'flourishing' | 'mastery'

export type EngagementLevel = 'INACTIVE' | 'LOW' | 'MODERATE' | 'HIGH' | 'INTENSIVE'

export interface DomainEvidence {
  skillId: string
  demonstrationCount: number
  weight: number
  contributionScore: number
}

export interface CognitiveDomainScore {
  domainId: CognitiveDomainId
  name: string
  shortName: string
  level: DomainLevel
  confidence: number // 0-1 based on evidence breadth
  evidence: DomainEvidence[]
  rawScore: number
  lastUpdated: number
}

export interface DomainSkillMapping {
  skillId: string
  weight: number // 0-1, contribution weight
}

export interface DomainMetadata {
  id: CognitiveDomainId
  name: string
  shortName: string
  description: string
  category: 'core' | 'advanced'
  color: string
  colorblindSafe: string // Alternative for colorblind mode
  icon: string // lucide-react icon name
  skills: DomainSkillMapping[]
}

export interface PatternDomainBoost {
  pattern: PatternType
  primaryDomain: CognitiveDomainId
  primaryBoost: number // e.g., 0.20 for +20%
  secondaryDomain: CognitiveDomainId
  secondaryBoost: number // e.g., 0.15 for +15%
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

/**
 * Domain level thresholds (evidence-based)
 * Aligned with ISP research: 3x/week engagement for cognitive benefits
 */
export const DOMAIN_THRESHOLDS = {
  DORMANT: 0,
  EMERGING: 3,      // First signs of engagement (3 demonstrations)
  DEVELOPING: 8,    // Regular engagement
  FLOURISHING: 15,  // Consistent pattern
  MASTERY: 25       // Deep expertise evidence
} as const

/**
 * Engagement frequency thresholds (from ISP cognitive research)
 * Based on elderly study: 3x/week minimum for cognitive improvement
 */
export const ENGAGEMENT_THRESHOLDS = {
  INACTIVE: 0,
  LOW: 1,
  MODERATE: 3,      // ISP validated threshold (3x/week)
  HIGH: 5,
  INTENSIVE: 7
} as const

/**
 * Domain colors - accessible palette
 */
export const DOMAIN_COLORS: Record<CognitiveDomainId, { primary: string; colorblind: string }> = {
  complexAttention: { primary: '#3B82F6', colorblind: '#0077BB' },      // Blue
  executiveFunctions: { primary: '#8B5CF6', colorblind: '#AA3377' },    // Purple
  learningMemory: { primary: '#10B981', colorblind: '#009988' },        // Emerald
  language: { primary: '#F59E0B', colorblind: '#EE7733' },              // Amber
  perceptualMotor: { primary: '#EC4899', colorblind: '#CC3311' },       // Pink
  socialCognition: { primary: '#EF4444', colorblind: '#EE3377' },       // Red
  metacognition: { primary: '#6366F1', colorblind: '#0077BB' },         // Indigo
  wisdomJudgment: { primary: '#14B8A6', colorblind: '#009988' },        // Teal
  creativitySynthesis: { primary: '#F97316', colorblind: '#EE7733' },   // Orange
  emotionalIntelligence: { primary: '#84CC16', colorblind: '#33BBEE' }, // Lime
  adaptiveFunctioning: { primary: '#06B6D4', colorblind: '#33BBEE' }    // Cyan
}

// -----------------------------------------------------------------------------
// Domain Metadata - Full Configuration
// -----------------------------------------------------------------------------

export const DOMAIN_METADATA: Record<CognitiveDomainId, DomainMetadata> = {
  complexAttention: {
    id: 'complexAttention',
    name: 'Complex Attention',
    shortName: 'Attention',
    description: 'Sustained focus, selective attention (ignoring distractors), divided attention (multitasking)',
    category: 'core',
    color: DOMAIN_COLORS.complexAttention.primary,
    colorblindSafe: DOMAIN_COLORS.complexAttention.colorblind,
    icon: 'Focus',
    skills: [
      { skillId: 'deep_work', weight: 1.0 },
      { skillId: 'time_management', weight: 0.9 },
      { skillId: 'observation', weight: 0.8 },
      { skillId: 'patience', weight: 0.7 },
      { skillId: 'grounded_research', weight: 0.6 }
    ]
  },
  executiveFunctions: {
    id: 'executiveFunctions',
    name: 'Executive Functions',
    shortName: 'Executive',
    description: 'Planning, reasoning, abstract thinking, problem-solving, cognitive flexibility, working memory',
    category: 'core',
    color: DOMAIN_COLORS.executiveFunctions.primary,
    colorblindSafe: DOMAIN_COLORS.executiveFunctions.colorblind,
    icon: 'Brain',
    skills: [
      { skillId: 'strategic_thinking', weight: 1.0 },
      { skillId: 'problem_solving', weight: 1.0 },
      { skillId: 'systems_thinking', weight: 0.9 },
      { skillId: 'critical_thinking', weight: 0.9 },
      { skillId: 'triage', weight: 0.8 },
      { skillId: 'risk_management', weight: 0.8 },
      { skillId: 'crisis_management', weight: 0.7 },
      { skillId: 'accountability', weight: 0.6 }
    ]
  },
  learningMemory: {
    id: 'learningMemory',
    name: 'Learning & Memory',
    shortName: 'Learning',
    description: 'Encoding, storage, retrieval (verbal, visual, episodic, semantic)',
    category: 'core',
    color: DOMAIN_COLORS.learningMemory.primary,
    colorblindSafe: DOMAIN_COLORS.learningMemory.colorblind,
    icon: 'BookOpen',
    skills: [
      { skillId: 'learning_agility', weight: 1.0 },
      { skillId: 'information_literacy', weight: 0.9 },
      { skillId: 'curiosity', weight: 0.9 },
      { skillId: 'observation', weight: 0.7 },
      { skillId: 'grounded_research', weight: 0.8 },
      { skillId: 'pedagogy', weight: 0.6 }
    ]
  },
  language: {
    id: 'language',
    name: 'Language',
    shortName: 'Language',
    description: 'Expressive (generating speech/writing), receptive (understanding), fluency, complex comprehension',
    category: 'core',
    color: DOMAIN_COLORS.language.primary,
    colorblindSafe: DOMAIN_COLORS.language.colorblind,
    icon: 'MessageSquare',
    skills: [
      { skillId: 'communication', weight: 1.0 },
      { skillId: 'marketing', weight: 0.8 },
      { skillId: 'curriculum_design', weight: 0.7 },
      { skillId: 'instructional_design', weight: 0.7 },
      { skillId: 'humor', weight: 0.5 },
      { skillId: 'wisdom', weight: 0.4 }
    ]
  },
  perceptualMotor: {
    id: 'perceptualMotor',
    name: 'Perceptual-Motor',
    shortName: 'Perceptual',
    description: 'Visual-spatial skills, motor speed, coordination, integration of sensory input',
    category: 'core',
    color: DOMAIN_COLORS.perceptualMotor.primary,
    colorblindSafe: DOMAIN_COLORS.perceptualMotor.colorblind,
    icon: 'Eye',
    skills: [
      { skillId: 'technical_literacy', weight: 1.0 },
      { skillId: 'digital_literacy', weight: 0.9 },
      { skillId: 'agentic_coding', weight: 0.8 },
      { skillId: 'workflow_orchestration', weight: 0.7 },
      { skillId: 'multimodal_creation', weight: 0.6 }
    ]
  },
  socialCognition: {
    id: 'socialCognition',
    name: 'Social Cognition',
    shortName: 'Social',
    description: 'Understanding social cues, theory of mind (others\' intentions), emotional recognition',
    category: 'core',
    color: DOMAIN_COLORS.socialCognition.primary,
    colorblindSafe: DOMAIN_COLORS.socialCognition.colorblind,
    icon: 'Users',
    skills: [
      { skillId: 'emotional_intelligence', weight: 1.0 },
      { skillId: 'empathy', weight: 1.0 },
      { skillId: 'cultural_competence', weight: 0.9 },
      { skillId: 'respect', weight: 0.8 },
      { skillId: 'mentorship', weight: 0.7 },
      { skillId: 'encouragement', weight: 0.6 }
    ]
  },
  metacognition: {
    id: 'metacognition',
    name: 'Metacognition',
    shortName: 'Meta',
    description: 'Awareness and understanding of one\'s own thought processes (thinking about thinking)',
    category: 'advanced',
    color: DOMAIN_COLORS.metacognition.primary,
    colorblindSafe: DOMAIN_COLORS.metacognition.colorblind,
    icon: 'Lightbulb',
    skills: [
      { skillId: 'critical_thinking', weight: 0.9 },
      { skillId: 'humility', weight: 1.0 },
      { skillId: 'pragmatism', weight: 0.8 },
      { skillId: 'visionary_thinking', weight: 0.7 },
      { skillId: 'psychology', weight: 0.8 },
      { skillId: 'wisdom', weight: 0.6 }
    ]
  },
  wisdomJudgment: {
    id: 'wisdomJudgment',
    name: 'Wisdom & Judgment',
    shortName: 'Wisdom',
    description: 'Integrating complex information, values, and long-term consequences for sound decision-making',
    category: 'advanced',
    color: DOMAIN_COLORS.wisdomJudgment.primary,
    colorblindSafe: DOMAIN_COLORS.wisdomJudgment.colorblind,
    icon: 'Scale',
    skills: [
      { skillId: 'wisdom', weight: 1.0 },
      { skillId: 'integrity', weight: 0.9 },
      { skillId: 'fairness', weight: 0.9 },
      { skillId: 'accountability', weight: 0.8 },
      { skillId: 'strategic_thinking', weight: 0.7 }
    ]
  },
  creativitySynthesis: {
    id: 'creativitySynthesis',
    name: 'Creativity & Synthesis',
    shortName: 'Creativity',
    description: 'Generating novel ideas and integrating disparate knowledge domains',
    category: 'advanced',
    color: DOMAIN_COLORS.creativitySynthesis.primary,
    colorblindSafe: DOMAIN_COLORS.creativitySynthesis.colorblind,
    icon: 'Sparkles',
    skills: [
      { skillId: 'creativity', weight: 1.0 },
      { skillId: 'multimodal_creation', weight: 0.9 },
      { skillId: 'entrepreneurship', weight: 0.8 },
      { skillId: 'visionary_thinking', weight: 0.9 },
      { skillId: 'prompt_engineering', weight: 0.6 }
    ]
  },
  emotionalIntelligence: {
    id: 'emotionalIntelligence',
    name: 'Emotional Intelligence',
    shortName: 'EQ',
    description: 'Advanced regulation, empathy, and nuanced understanding of emotions in self and others',
    category: 'advanced',
    color: DOMAIN_COLORS.emotionalIntelligence.primary,
    colorblindSafe: DOMAIN_COLORS.emotionalIntelligence.colorblind,
    icon: 'Heart',
    skills: [
      { skillId: 'emotional_intelligence', weight: 1.0 },
      { skillId: 'empathy', weight: 0.9 },
      { skillId: 'patience', weight: 0.8 },
      { skillId: 'resilience', weight: 0.8 },
      { skillId: 'courage', weight: 0.6 },
      { skillId: 'humor', weight: 0.5 }
    ]
  },
  adaptiveFunctioning: {
    id: 'adaptiveFunctioning',
    name: 'Adaptive Functioning',
    shortName: 'Adaptive',
    description: 'How well cognitive skills translate to complex real-world demands, including social, occupational, and personal goals',
    category: 'advanced',
    color: DOMAIN_COLORS.adaptiveFunctioning.primary,
    colorblindSafe: DOMAIN_COLORS.adaptiveFunctioning.colorblind,
    icon: 'Zap',
    skills: [
      { skillId: 'adaptability', weight: 1.0 },
      { skillId: 'action_orientation', weight: 0.9 },
      { skillId: 'urgency', weight: 0.7 },
      { skillId: 'collaboration', weight: 0.8 },
      { skillId: 'leadership', weight: 0.8 },
      { skillId: 'ai_literacy', weight: 0.6 },
      { skillId: 'financial_literacy', weight: 0.5 }
    ]
  }
}

// -----------------------------------------------------------------------------
// Pattern-to-Domain Boost Mappings
// -----------------------------------------------------------------------------

/**
 * Each pattern boosts specific cognitive domains
 * Based on the conceptual alignment between decision-making styles and cognition
 */
export const PATTERN_DOMAIN_BOOSTS: PatternDomainBoost[] = [
  {
    pattern: 'analytical',
    primaryDomain: 'executiveFunctions',
    primaryBoost: 0.20,
    secondaryDomain: 'metacognition',
    secondaryBoost: 0.15
  },
  {
    pattern: 'patience',
    primaryDomain: 'complexAttention',
    primaryBoost: 0.25,
    secondaryDomain: 'emotionalIntelligence',
    secondaryBoost: 0.15
  },
  {
    pattern: 'exploring',
    primaryDomain: 'learningMemory',
    primaryBoost: 0.20,
    secondaryDomain: 'creativitySynthesis',
    secondaryBoost: 0.15
  },
  {
    pattern: 'helping',
    primaryDomain: 'socialCognition',
    primaryBoost: 0.25,
    secondaryDomain: 'emotionalIntelligence',
    secondaryBoost: 0.20
  },
  {
    pattern: 'building',
    primaryDomain: 'creativitySynthesis',
    primaryBoost: 0.20,
    secondaryDomain: 'adaptiveFunctioning',
    secondaryBoost: 0.15
  }
]

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

/**
 * Check if a string is a valid cognitive domain ID
 */
export function isValidCognitiveDomainId(id: string): id is CognitiveDomainId {
  return COGNITIVE_DOMAIN_IDS.includes(id as CognitiveDomainId)
}

/**
 * Get all skills that contribute to a specific domain
 */
export function getSkillsForDomain(domainId: CognitiveDomainId): DomainSkillMapping[] {
  return DOMAIN_METADATA[domainId].skills
}

/**
 * Get all domains a skill contributes to
 */
export function getDomainsForSkill(skillId: string): { domainId: CognitiveDomainId; weight: number }[] {
  const domains: { domainId: CognitiveDomainId; weight: number }[] = []

  for (const domainId of COGNITIVE_DOMAIN_IDS) {
    const mapping = DOMAIN_METADATA[domainId].skills.find(s => s.skillId === skillId)
    if (mapping) {
      domains.push({ domainId, weight: mapping.weight })
    }
  }

  return domains
}

/**
 * Get pattern boost for a domain
 */
export function getPatternBoostForDomain(
  domainId: CognitiveDomainId,
  patternScores: Record<PatternType, number>
): number {
  let totalBoost = 0

  for (const boost of PATTERN_DOMAIN_BOOSTS) {
    const patternValue = patternScores[boost.pattern] || 0
    const normalizedPattern = patternValue / 10 // Normalize to 0-1

    if (boost.primaryDomain === domainId) {
      totalBoost += normalizedPattern * boost.primaryBoost
    }
    if (boost.secondaryDomain === domainId) {
      totalBoost += normalizedPattern * boost.secondaryBoost
    }
  }

  return totalBoost
}

/**
 * Determine domain level from raw score
 */
export function determineDomainLevel(score: number): DomainLevel {
  if (score >= DOMAIN_THRESHOLDS.MASTERY) return 'mastery'
  if (score >= DOMAIN_THRESHOLDS.FLOURISHING) return 'flourishing'
  if (score >= DOMAIN_THRESHOLDS.DEVELOPING) return 'developing'
  if (score >= DOMAIN_THRESHOLDS.EMERGING) return 'emerging'
  return 'dormant'
}

/**
 * Determine engagement level from weekly activity
 */
export function determineEngagementLevel(activeDaysLast7: number): EngagementLevel {
  if (activeDaysLast7 >= ENGAGEMENT_THRESHOLDS.INTENSIVE) return 'INTENSIVE'
  if (activeDaysLast7 >= ENGAGEMENT_THRESHOLDS.HIGH) return 'HIGH'
  if (activeDaysLast7 >= ENGAGEMENT_THRESHOLDS.MODERATE) return 'MODERATE'
  if (activeDaysLast7 >= ENGAGEMENT_THRESHOLDS.LOW) return 'LOW'
  return 'INACTIVE'
}

/**
 * Get color for domain level (for UI display)
 */
export function getLevelColor(level: DomainLevel): string {
  switch (level) {
    case 'mastery': return '#FFD700'     // Gold
    case 'flourishing': return '#10B981' // Emerald
    case 'developing': return '#3B82F6'  // Blue
    case 'emerging': return '#8B5CF6'    // Purple
    case 'dormant': return '#6B7280'     // Gray
  }
}

/**
 * Get human-readable label for domain level
 */
export function getLevelLabel(level: DomainLevel): string {
  switch (level) {
    case 'mastery': return 'Mastery'
    case 'flourishing': return 'Flourishing'
    case 'developing': return 'Developing'
    case 'emerging': return 'Emerging'
    case 'dormant': return 'Dormant'
  }
}

/**
 * Get progress percentage within current level
 */
export function getLevelProgress(score: number): number {
  const thresholds = [
    DOMAIN_THRESHOLDS.DORMANT,
    DOMAIN_THRESHOLDS.EMERGING,
    DOMAIN_THRESHOLDS.DEVELOPING,
    DOMAIN_THRESHOLDS.FLOURISHING,
    DOMAIN_THRESHOLDS.MASTERY
  ]

  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (score >= thresholds[i]) {
      const currentThreshold = thresholds[i]
      const nextThreshold = thresholds[i + 1] || currentThreshold + 10
      const range = nextThreshold - currentThreshold
      const progress = (score - currentThreshold) / range
      return Math.min(progress, 1)
    }
  }

  return 0
}

/**
 * Get core domains only
 */
export function getCoreDomains(): CognitiveDomainId[] {
  return COGNITIVE_DOMAIN_IDS.filter(id => DOMAIN_METADATA[id].category === 'core')
}

/**
 * Get advanced domains only
 */
export function getAdvancedDomains(): CognitiveDomainId[] {
  return COGNITIVE_DOMAIN_IDS.filter(id => DOMAIN_METADATA[id].category === 'advanced')
}

/**
 * Create empty domain scores (initial state)
 */
export function createEmptyDomainScores(): Record<CognitiveDomainId, CognitiveDomainScore> {
  const scores: Partial<Record<CognitiveDomainId, CognitiveDomainScore>> = {}

  for (const domainId of COGNITIVE_DOMAIN_IDS) {
    const meta = DOMAIN_METADATA[domainId]
    scores[domainId] = {
      domainId,
      name: meta.name,
      shortName: meta.shortName,
      level: 'dormant',
      confidence: 0,
      evidence: [],
      rawScore: 0,
      lastUpdated: Date.now()
    }
  }

  return scores as Record<CognitiveDomainId, CognitiveDomainScore>
}
