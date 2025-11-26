/**
 * Student Insights Types
 * Clean interfaces for parsed admin dashboard data
 *
 * NOTE: SkillGap, KeySkillMoment, and SkillEvolutionPoint are re-exported
 * from skill-profile-adapter.ts to avoid type conflicts
 */

// Re-export canonical types from skill-profile-adapter
export type {
  SkillGap,
  KeySkillMoment,
  SkillEvolutionPoint
} from '@/lib/skill-profile-adapter'

export interface ChoicePatternInsight {
  helping: number
  analytical: number
  patience: number
  exploring: number
  building: number
  dominantPattern: string
  consistency: 'consistent' | 'varied' | 'random'
  totalChoices: number
}

export interface CharacterInsight {
  characterName: 'Maya Chen' | 'Devon Kumar' | 'Jordan Packard'
  trustLevel: number
  met: boolean
  metTimestamp?: number
  vulnerabilityShared?: string
  studentHelped?: string
  personalSharing?: string
  currentStatus: string
}

export interface BreakthroughMoment {
  type: 'vulnerability' | 'decision' | 'personal_sharing' | 'mutual_recognition'
  characterName?: string
  quote: string
  studentResponse?: string
  timestamp: number
  scene: string
}

export interface CareerInsight {
  topMatch: { name: string; confidence: number }
  secondMatch?: { name: string; confidence: number }
  birminghamOpportunities: string[]
  decisionStyle: string
}

export interface StudentInsights {
  userId: string
  lastActive: number
  currentScene: string
  choicePatterns: ChoicePatternInsight
  characterRelationships: CharacterInsight[]
  breakthroughMoments: BreakthroughMoment[]
  careerDiscovery: CareerInsight
  skillGaps: import('@/lib/skill-profile-adapter').SkillGap[]
  keySkillMoments: import('@/lib/skill-profile-adapter').KeySkillMoment[]
  totalDemonstrations: number
  skillEvolution: import('@/lib/skill-profile-adapter').SkillEvolutionPoint[]
}

