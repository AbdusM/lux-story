/**
 * D-074: Skill Radar Chart
 * Your skills vs career requirements overlay visualization
 *
 * Visualizes:
 * - Player's current skill levels
 * - Career path requirements
 * - Gap analysis between current and target
 */

import { PatternType, PATTERN_METADATA, getPatternColor } from './patterns'
import { PlayerPatterns } from './character-state'

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Skill category for radar chart
 */
export type SkillCategory =
  | 'critical_thinking'
  | 'communication'
  | 'collaboration'
  | 'technical'
  | 'creativity'
  | 'adaptability'

/**
 * Career path definition
 */
export interface CareerPath {
  id: string
  name: string
  description: string
  icon: string
  color: string
  requiredSkills: Record<SkillCategory, number>  // 0-10 scale
  alignedPatterns: PatternType[]
}

/**
 * Player skill profile for radar chart
 */
export interface SkillProfile {
  skills: Record<SkillCategory, number>  // 0-10 scale
  dominantPattern?: PatternType
  secondaryPattern?: PatternType
}

/**
 * Radar chart data point
 */
export interface RadarDataPoint {
  category: SkillCategory
  label: string
  playerValue: number
  careerValue?: number
  gap?: number
}

/**
 * Radar chart configuration
 */
export interface RadarChartConfig {
  size: number           // SVG size in pixels
  maxValue: number       // Maximum value (usually 10)
  levels: number         // Number of concentric rings
  labelOffset: number    // Distance from chart edge for labels
  showCareerOverlay: boolean
  showGapHighlight: boolean
  animationDuration: number
}

// ═══════════════════════════════════════════════════════════════════════════
// SKILL CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Skill category metadata
 */
export const SKILL_CATEGORY_METADATA: Record<SkillCategory, {
  label: string
  shortLabel: string
  description: string
  icon: string
}> = {
  critical_thinking: {
    label: 'Critical Thinking',
    shortLabel: 'Critical',
    description: 'Analyzing information, problem-solving, logical reasoning',
    icon: '🧠'
  },
  communication: {
    label: 'Communication',
    shortLabel: 'Comm',
    description: 'Written, verbal, and presentation skills',
    icon: '💬'
  },
  collaboration: {
    label: 'Collaboration',
    shortLabel: 'Collab',
    description: 'Teamwork, conflict resolution, leadership',
    icon: '🤝'
  },
  technical: {
    label: 'Technical Skills',
    shortLabel: 'Tech',
    description: 'Digital literacy, data analysis, tool proficiency',
    icon: '💻'
  },
  creativity: {
    label: 'Creativity',
    shortLabel: 'Create',
    description: 'Innovation, design thinking, artistic expression',
    icon: '🎨'
  },
  adaptability: {
    label: 'Adaptability',
    shortLabel: 'Adapt',
    description: 'Flexibility, learning agility, resilience',
    icon: '🌊'
  }
}

/**
 * All skill categories in order for radar chart
 */
export const SKILL_CATEGORIES: SkillCategory[] = [
  'critical_thinking',
  'communication',
  'collaboration',
  'technical',
  'creativity',
  'adaptability'
]

// ═══════════════════════════════════════════════════════════════════════════
// CAREER PATHS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Career paths from Birmingham focus areas
 */
export const CAREER_PATHS: CareerPath[] = [
  {
    id: 'tech_innovator',
    name: 'Tech Innovator',
    description: 'Building the future through technology',
    icon: '🚀',
    color: '#3B82F6',
    requiredSkills: {
      critical_thinking: 8,
      communication: 6,
      collaboration: 5,
      technical: 9,
      creativity: 7,
      adaptability: 7
    },
    alignedPatterns: ['analytical', 'building']
  },
  {
    id: 'healthcare_leader',
    name: 'Healthcare Leader',
    description: 'Caring for communities through medicine',
    icon: '⚕️',
    color: '#10B981',
    requiredSkills: {
      critical_thinking: 8,
      communication: 8,
      collaboration: 7,
      technical: 6,
      creativity: 5,
      adaptability: 8
    },
    alignedPatterns: ['helping', 'patience']
  },
  {
    id: 'creative_professional',
    name: 'Creative Professional',
    description: 'Shaping culture through art and design',
    icon: '🎭',
    color: '#8B5CF6',
    requiredSkills: {
      critical_thinking: 6,
      communication: 8,
      collaboration: 6,
      technical: 5,
      creativity: 9,
      adaptability: 7
    },
    alignedPatterns: ['building', 'exploring']
  },
  {
    id: 'business_strategist',
    name: 'Business Strategist',
    description: 'Leading organizations to success',
    icon: '📊',
    color: '#F59E0B',
    requiredSkills: {
      critical_thinking: 9,
      communication: 8,
      collaboration: 8,
      technical: 6,
      creativity: 6,
      adaptability: 7
    },
    alignedPatterns: ['analytical', 'exploring']
  },
  {
    id: 'educator_mentor',
    name: 'Educator & Mentor',
    description: 'Empowering the next generation',
    icon: '📚',
    color: '#EC4899',
    requiredSkills: {
      critical_thinking: 7,
      communication: 9,
      collaboration: 8,
      technical: 5,
      creativity: 7,
      adaptability: 8
    },
    alignedPatterns: ['helping', 'patience']
  },
  {
    id: 'systems_engineer',
    name: 'Systems Engineer',
    description: 'Designing and maintaining complex systems',
    icon: '⚙️',
    color: '#6366F1',
    requiredSkills: {
      critical_thinking: 9,
      communication: 6,
      collaboration: 6,
      technical: 9,
      creativity: 6,
      adaptability: 7
    },
    alignedPatterns: ['analytical', 'building']
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN TO SKILL MAPPING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * How patterns influence skill development
 */
export const PATTERN_SKILL_WEIGHTS: Record<PatternType, Record<SkillCategory, number>> = {
  analytical: {
    critical_thinking: 1.5,
    communication: 0.8,
    collaboration: 0.7,
    technical: 1.2,
    creativity: 0.9,
    adaptability: 1.0
  },
  patience: {
    critical_thinking: 1.1,
    communication: 1.2,
    collaboration: 1.3,
    technical: 0.8,
    creativity: 0.9,
    adaptability: 1.4
  },
  exploring: {
    critical_thinking: 1.0,
    communication: 1.0,
    collaboration: 0.9,
    technical: 1.0,
    creativity: 1.3,
    adaptability: 1.5
  },
  helping: {
    critical_thinking: 0.9,
    communication: 1.4,
    collaboration: 1.5,
    technical: 0.7,
    creativity: 1.0,
    adaptability: 1.2
  },
  building: {
    critical_thinking: 1.2,
    communication: 0.9,
    collaboration: 1.0,
    technical: 1.4,
    creativity: 1.3,
    adaptability: 1.0
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SKILL CALCULATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate skills from patterns
 */
export function calculateSkillsFromPatterns(patterns: PlayerPatterns): SkillProfile {
  const skills: Record<SkillCategory, number> = {
    critical_thinking: 0,
    communication: 0,
    collaboration: 0,
    technical: 0,
    creativity: 0,
    adaptability: 0
  }

  // Base skill from pattern values with weights
  SKILL_CATEGORIES.forEach(category => {
    let total = 0
    let weightSum = 0

    Object.entries(patterns).forEach(([pattern, value]) => {
      const weight = PATTERN_SKILL_WEIGHTS[pattern as PatternType][category]
      total += value * weight
      weightSum += weight
    })

    // Normalize to 0-10 scale (assuming max pattern total ~45)
    skills[category] = Math.min(10, Math.round((total / weightSum) * 2) / 2)
  })

  // Find dominant patterns
  const patternEntries = Object.entries(patterns) as [PatternType, number][]
  const sorted = patternEntries.sort((a, b) => b[1] - a[1])

  return {
    skills,
    dominantPattern: sorted[0][1] >= 3 ? sorted[0][0] : undefined,
    secondaryPattern: sorted[1]?.[1] >= 3 ? sorted[1][0] : undefined
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// RADAR CHART DATA GENERATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate radar chart data points
 */
export function generateRadarData(
  profile: SkillProfile,
  careerPath?: CareerPath
): RadarDataPoint[] {
  return SKILL_CATEGORIES.map(category => {
    const playerValue = profile.skills[category]
    const careerValue = careerPath?.requiredSkills[category]
    const gap = careerValue !== undefined ? careerValue - playerValue : undefined

    return {
      category,
      label: SKILL_CATEGORY_METADATA[category].shortLabel,
      playerValue,
      careerValue,
      gap
    }
  })
}

/**
 * Calculate gap score (0-100, lower is better)
 */
export function calculateGapScore(
  profile: SkillProfile,
  careerPath: CareerPath
): number {
  let totalGap = 0
  let maxPossibleGap = 0

  SKILL_CATEGORIES.forEach(category => {
    const required = careerPath.requiredSkills[category]
    const current = profile.skills[category]
    const gap = Math.max(0, required - current) // Only count shortfalls
    totalGap += gap
    maxPossibleGap += required
  })

  return Math.round((totalGap / maxPossibleGap) * 100)
}

/**
 * Get skill strengths and weaknesses
 */
export function analyzeSkillProfile(
  profile: SkillProfile
): {
  strengths: SkillCategory[]
  weaknesses: SkillCategory[]
  balanced: boolean
} {
  const entries = SKILL_CATEGORIES.map(c => ({ category: c, value: profile.skills[c] }))
  const sorted = entries.sort((a, b) => b.value - a.value)

  const strengths = sorted.slice(0, 2).filter(e => e.value >= 5).map(e => e.category)
  const weaknesses = sorted.slice(-2).filter(e => e.value < 4).map(e => e.category)

  // Check if balanced (all skills within 3 points of each other)
  const values = Object.values(profile.skills)
  const range = Math.max(...values) - Math.min(...values)
  const balanced = range <= 3

  return { strengths, weaknesses, balanced }
}

// ═══════════════════════════════════════════════════════════════════════════
// CAREER MATCHING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Career match result
 */
export interface CareerMatch {
  career: CareerPath
  matchScore: number       // 0-100, higher is better
  gapScore: number         // 0-100, lower is better
  patternAlignment: number // 0-100, pattern compatibility
  strengthsMatch: SkillCategory[]
  gapsToClose: SkillCategory[]
}

/**
 * Get career matches sorted by fit
 */
export function getCareerMatches(
  profile: SkillProfile
): CareerMatch[] {
  return CAREER_PATHS.map(career => {
    const gapScore = calculateGapScore(profile, career)
    const matchScore = 100 - gapScore

    // Calculate pattern alignment
    let patternAlignment = 50 // Base score
    if (profile.dominantPattern && career.alignedPatterns.includes(profile.dominantPattern)) {
      patternAlignment += 30
    }
    if (profile.secondaryPattern && career.alignedPatterns.includes(profile.secondaryPattern)) {
      patternAlignment += 20
    }

    // Find strength matches
    const strengthsMatch: SkillCategory[] = []
    const gapsToClose: SkillCategory[] = []

    SKILL_CATEGORIES.forEach(category => {
      const required = career.requiredSkills[category]
      const current = profile.skills[category]

      if (current >= required) {
        strengthsMatch.push(category)
      } else if (required - current >= 2) {
        gapsToClose.push(category)
      }
    })

    return {
      career,
      matchScore,
      gapScore,
      patternAlignment,
      strengthsMatch,
      gapsToClose
    }
  }).sort((a, b) => {
    // Sort by combined score (match + pattern alignment)
    const aScore = a.matchScore * 0.7 + a.patternAlignment * 0.3
    const bScore = b.matchScore * 0.7 + b.patternAlignment * 0.3
    return bScore - aScore
  })
}

/**
 * Get top career recommendation
 */
export function getTopCareerMatch(profile: SkillProfile): CareerMatch | null {
  const matches = getCareerMatches(profile)
  return matches[0] || null
}

// ═══════════════════════════════════════════════════════════════════════════
// SVG PATH GENERATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default radar chart config
 */
export const DEFAULT_RADAR_CONFIG: RadarChartConfig = {
  size: 300,
  maxValue: 10,
  levels: 5,
  labelOffset: 20,
  showCareerOverlay: true,
  showGapHighlight: true,
  animationDuration: 500
}

/**
 * Calculate point coordinates for radar chart
 */
export function calculateRadarPoint(
  index: number,
  value: number,
  config: RadarChartConfig = DEFAULT_RADAR_CONFIG
): { x: number; y: number } {
  const angle = (Math.PI * 2 * index) / SKILL_CATEGORIES.length - Math.PI / 2
  const radius = (config.size / 2 - config.labelOffset) * (value / config.maxValue)
  const centerX = config.size / 2
  const centerY = config.size / 2

  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle)
  }
}

/**
 * Generate SVG path for radar polygon
 */
export function generateRadarPath(
  data: RadarDataPoint[],
  valueKey: 'playerValue' | 'careerValue',
  config: RadarChartConfig = DEFAULT_RADAR_CONFIG
): string {
  const points = data.map((d, i) => {
    const value = d[valueKey] ?? 0
    return calculateRadarPoint(i, value, config)
  })

  return points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ' Z'
}

/**
 * Generate level ring paths
 */
export function generateLevelPaths(
  config: RadarChartConfig = DEFAULT_RADAR_CONFIG
): string[] {
  const paths: string[] = []

  for (let level = 1; level <= config.levels; level++) {
    const levelValue = (config.maxValue / config.levels) * level
    const points = SKILL_CATEGORIES.map((_, i) =>
      calculateRadarPoint(i, levelValue, config)
    )

    paths.push(
      points.map((p, i) =>
        `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
      ).join(' ') + ' Z'
    )
  }

  return paths
}

/**
 * Generate axis paths
 */
export function generateAxisPaths(
  config: RadarChartConfig = DEFAULT_RADAR_CONFIG
): { path: string; labelPosition: { x: number; y: number } }[] {
  const centerX = config.size / 2
  const centerY = config.size / 2

  return SKILL_CATEGORIES.map((_, i) => {
    const outerPoint = calculateRadarPoint(i, config.maxValue, config)
    const labelPoint = calculateRadarPoint(
      i,
      config.maxValue + config.labelOffset / (config.size / 2 - config.labelOffset) * config.maxValue,
      config
    )

    return {
      path: `M ${centerX} ${centerY} L ${outerPoint.x} ${outerPoint.y}`,
      labelPosition: labelPoint
    }
  })
}
