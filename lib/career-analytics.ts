/**
 * Career Path Analytics System
 *
 * Analyzes player choice patterns to identify career path resonance
 * and provides evidence-based insights for Birmingham career exploration
 */

import { getPersonaTracker, type PlayerPersona } from './player-persona'
import type { Choice } from './story-engine'

export interface CareerPathAffinities {
  healthcare: number
  engineering: number
  technology: number
  education: number
  sustainability: number
  entrepreneurship: number
  creative: number
  service: number
}

export interface CareerInsight {
  careerPath: keyof CareerPathAffinities
  confidence: number
  evidencePoints: string[]
  birminghamOpportunities: string[]
  nextSteps: string[]
}

export interface AnalyticsSnapshot {
  playerId: string
  sessionId: string
  timestamp: number

  // Choice pattern analysis
  totalChoices: number
  patternDistribution: Record<string, number>
  careerAffinities: CareerPathAffinities

  // Engagement metrics
  averageResponseTime: number
  sessionDuration: number
  platformsExplored: string[]

  // Career insights
  primaryAffinity: keyof CareerPathAffinities
  secondaryAffinity: keyof CareerPathAffinities
  insights: CareerInsight[]
}

/**
 * Career path pattern mappings based on choice consequence patterns
 */
const CAREER_PATTERN_MAPPING: Record<string, Partial<CareerPathAffinities>> = {
  // Helping patterns → Healthcare, Education, Service
  'helping': { healthcare: 0.4, education: 0.3, service: 0.3 },
  'caring': { healthcare: 0.5, education: 0.3, service: 0.2 },
  'supporting': { healthcare: 0.3, education: 0.4, service: 0.3 },

  // Building patterns → Engineering, Technology
  'building': { engineering: 0.6, technology: 0.4 },
  'creating': { engineering: 0.4, technology: 0.3, creative: 0.3 },
  'designing': { engineering: 0.3, technology: 0.3, creative: 0.4 },

  // Analyzing patterns → Technology, Engineering
  'analyzing': { technology: 0.5, engineering: 0.3, healthcare: 0.2 },
  'researching': { technology: 0.4, healthcare: 0.3, education: 0.3 },
  'investigating': { technology: 0.4, engineering: 0.3, service: 0.3 },

  // Environmental patterns → Sustainability, Engineering
  'environmental': { sustainability: 0.6, engineering: 0.4 },
  'growing': { sustainability: 0.5, healthcare: 0.3, education: 0.2 },

  // Leadership patterns → Entrepreneurship, Education
  'leading': { entrepreneurship: 0.4, education: 0.3, service: 0.3 },
  'organizing': { entrepreneurship: 0.3, education: 0.4, technology: 0.3 },

  // Creative patterns → Creative, Technology
  'expressing': { creative: 0.6, technology: 0.2, education: 0.2 },
  'storytelling': { creative: 0.5, education: 0.3, technology: 0.2 }
}

/**
 * Birmingham-specific career opportunities by sector
 */
const BIRMINGHAM_OPPORTUNITIES: Record<keyof CareerPathAffinities, string[]> = {
  healthcare: [
    'UAB Medical Center - Nursing & Medical Programs',
    'Children\'s of Alabama - Pediatric Specialties',
    'Birmingham VA Medical Center - Veterans Healthcare',
    'Brookwood Baptist Health - Community Healthcare'
  ],
  engineering: [
    'Southern Company - Energy Infrastructure',
    'BBVA Field Engineering Programs',
    'Nucor Steel - Manufacturing Engineering',
    'Alabama Power - Electrical Engineering'
  ],
  technology: [
    'Regions Bank - Fintech Development',
    'BBVA Innovation Center - Banking Technology',
    'UAB Informatics - Health Tech',
    'Velocity Accelerator - Tech Startups'
  ],
  education: [
    'Birmingham City Schools - Teaching',
    'UAB Education Programs',
    'Jefferson County Schools',
    'Community Education Partners'
  ],
  sustainability: [
    'Alabama Power Renewable Energy',
    'Environmental Services - City of Birmingham',
    'Green Infrastructure Projects',
    'Urban Agriculture Initiatives'
  ],
  entrepreneurship: [
    'Innovation Depot - Startup Incubator',
    'Velocity Accelerator - Business Development',
    'REV Birmingham - Economic Development',
    'Alabama Launchpad - Venture Capital'
  ],
  creative: [
    'Birmingham Arts District',
    'UAB Arts Programs',
    'Local Media & Marketing Agencies',
    'Birmingham Design Week'
  ],
  service: [
    'United Way of Central Alabama',
    'Birmingham Civil Rights Institute',
    'Community Foundation Greater Birmingham',
    'Local Non-Profit Organizations'
  ]
}

/**
 * Career Analytics Engine
 */
export class CareerAnalyticsEngine {
  private static instance: CareerAnalyticsEngine | null = null
  private snapshots: Map<string, AnalyticsSnapshot[]> = new Map()

  static getInstance(): CareerAnalyticsEngine {
    if (!this.instance) {
      this.instance = new CareerAnalyticsEngine()
    }
    return this.instance
  }

  /**
   * Analyze current player choice patterns for career path affinities
   */
  analyzeCareerAffinities(playerId: string): CareerPathAffinities {
    const persona = getPersonaTracker().getPersona(playerId)
    if (!persona) {
      return this.getDefaultAffinities()
    }

    const affinities: CareerPathAffinities = this.getDefaultAffinities()

    // Analyze each choice pattern and apply mappings
    for (const [pattern, count] of Object.entries(persona.patternCounts)) {
      const mapping = CAREER_PATTERN_MAPPING[pattern.toLowerCase()]
      if (mapping) {
        const weight = count / persona.totalChoices // Normalize by total choices

        // Apply weighted mapping to affinities
        for (const [career, value] of Object.entries(mapping)) {
          const careerKey = career as keyof CareerPathAffinities
          affinities[careerKey] += (value || 0) * weight
        }
      }
    }

    // Normalize affinities to 0-1 range
    const total = Object.values(affinities).reduce((sum, val) => sum + val, 0)
    if (total > 0) {
      for (const key of Object.keys(affinities) as Array<keyof CareerPathAffinities>) {
        affinities[key] = affinities[key] / total
      }
    }

    return affinities
  }

  /**
   * Generate career insights based on analysis
   */
  generateCareerInsights(playerId: string): CareerInsight[] {
    const affinities = this.analyzeCareerAffinities(playerId)
    const persona = getPersonaTracker().getPersona(playerId)
    const insights: CareerInsight[] = []

    // Sort affinities by strength
    const sortedAffinities = Object.entries(affinities)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3) // Top 3 affinities

    for (const [careerPath, affinity] of sortedAffinities) {
      if (affinity > 0.1) { // Only include meaningful affinities
        const insight: CareerInsight = {
          careerPath: careerPath as keyof CareerPathAffinities,
          confidence: Math.min(affinity * 100, 95), // Convert to percentage, cap at 95%
          evidencePoints: this.getEvidencePoints(careerPath as keyof CareerPathAffinities, persona),
          birminghamOpportunities: BIRMINGHAM_OPPORTUNITIES[careerPath as keyof CareerPathAffinities].slice(0, 3),
          nextSteps: this.generateNextSteps(careerPath as keyof CareerPathAffinities, affinity)
        }
        insights.push(insight)
      }
    }

    return insights
  }

  /**
   * Create analytics snapshot for current session
   */
  createSnapshot(playerId: string, sessionId: string): AnalyticsSnapshot {
    const affinities = this.analyzeCareerAffinities(playerId)
    const persona = getPersonaTracker().getPersona(playerId)

    const sortedAffinities = Object.entries(affinities).sort(([,a], [,b]) => b - a)

    const snapshot: AnalyticsSnapshot = {
      playerId,
      sessionId,
      timestamp: Date.now(),

      totalChoices: persona?.totalChoices || 0,
      patternDistribution: persona?.patternCounts || {},
      careerAffinities: affinities,

      averageResponseTime: 0, // TODO: Implement from performance monitor
      sessionDuration: Date.now() - (Date.now() - (60 * 1000)), // Assume 1 minute for now
      platformsExplored: [], // TODO: Get from Zustand store

      primaryAffinity: sortedAffinities[0]?.[0] as keyof CareerPathAffinities || 'technology',
      secondaryAffinity: sortedAffinities[1]?.[0] as keyof CareerPathAffinities || 'healthcare',
      insights: this.generateCareerInsights(playerId)
    }

    // Store snapshot
    if (!this.snapshots.has(playerId)) {
      this.snapshots.set(playerId, [])
    }
    this.snapshots.get(playerId)!.push(snapshot)

    return snapshot
  }

  /**
   * Get evidence points for a career path
   */
  private getEvidencePoints(careerPath: keyof CareerPathAffinities, persona?: PlayerPersona): string[] {
    if (!persona) return []

    const evidence: string[] = []
    const patterns = persona.dominantPatterns

    switch (careerPath) {
      case 'healthcare':
        if (patterns.includes('helping')) evidence.push('Shows strong helping orientation')
        if (patterns.includes('caring')) evidence.push('Demonstrates empathy and care')
        if (persona.socialOrientation === 'helper') evidence.push('Natural inclination to support others')
        break
      case 'engineering':
        if (patterns.includes('building')) evidence.push('Enjoys creating and constructing')
        if (patterns.includes('analyzing')) evidence.push('Systematic problem-solving approach')
        if (persona.problemApproach === 'analytical') evidence.push('Methodical thinking style')
        break
      case 'technology':
        if (patterns.includes('analyzing')) evidence.push('Data-driven decision making')
        if (patterns.includes('researching')) evidence.push('Strong research capabilities')
        if (persona.problemApproach === 'analytical') evidence.push('Logical problem-solving')
        break
      case 'education':
        if (patterns.includes('helping')) evidence.push('Supportive communication style')
        if (patterns.includes('organizing')) evidence.push('Natural teaching abilities')
        if (persona.socialOrientation === 'collaborator') evidence.push('Collaborative mindset')
        break
      default:
        evidence.push('Emerging interests detected')
    }

    return evidence.slice(0, 3) // Limit to top 3 evidence points
  }

  /**
   * Generate next steps for a career path
   */
  private generateNextSteps(careerPath: keyof CareerPathAffinities, affinity: number): string[] {
    const baseSteps = [
      'Explore Birmingham opportunities in this field',
      'Connect with local professionals',
      'Research education requirements',
      'Consider internship opportunities'
    ]

    // Add specific steps based on career path
    const specificSteps: Record<keyof CareerPathAffinities, string[]> = {
      healthcare: ['Shadow a healthcare professional at UAB', 'Volunteer at local hospitals'],
      engineering: ['Join engineering clubs', 'Attend Alabama Power career events'],
      technology: ['Learn programming basics', 'Visit Innovation Depot'],
      education: ['Volunteer as a tutor', 'Explore UAB Education programs'],
      sustainability: ['Join environmental clubs', 'Research green career paths'],
      entrepreneurship: ['Attend startup events', 'Develop business ideas'],
      creative: ['Build a portfolio', 'Explore local arts opportunities'],
      service: ['Volunteer with nonprofits', 'Research social work programs']
    }

    return [...specificSteps[careerPath], ...baseSteps].slice(0, 4)
  }

  /**
   * Get default career affinities (all equal)
   */
  private getDefaultAffinities(): CareerPathAffinities {
    return {
      healthcare: 0,
      engineering: 0,
      technology: 0,
      education: 0,
      sustainability: 0,
      entrepreneurship: 0,
      creative: 0,
      service: 0
    }
  }

  /**
   * Get analytics snapshots for a player
   */
  getPlayerSnapshots(playerId: string): AnalyticsSnapshot[] {
    return this.snapshots.get(playerId) || []
  }

  /**
   * Export analytics data for external analysis
   */
  exportAnalytics(playerId?: string): any {
    if (playerId) {
      return {
        playerId,
        snapshots: this.snapshots.get(playerId) || [],
        currentAffinities: this.analyzeCareerAffinities(playerId),
        insights: this.generateCareerInsights(playerId)
      }
    }

    // Export all data
    const allData: any = {}
    for (const [id, snapshots] of this.snapshots.entries()) {
      allData[id] = {
        snapshots,
        currentAffinities: this.analyzeCareerAffinities(id),
        insights: this.generateCareerInsights(id)
      }
    }
    return allData
  }
}

/**
 * Get the global career analytics engine instance
 */
export function getCareerAnalytics(): CareerAnalyticsEngine {
  return CareerAnalyticsEngine.getInstance()
}

/**
 * Analyze choice for career implications and record insights
 */
export function analyzeChoiceForCareer(choice: Choice, playerId: string): void {
  try {
    // Extract career-relevant patterns from choice consequence
    const patterns = choice.consequence.split('_')
    const analytics = getCareerAnalytics()

    // This will be automatically captured in the next snapshot
    console.log(`🎯 Career analysis: ${choice.text} → ${patterns.join(', ')}`)

  } catch (error) {
    console.error('Career analysis error:', error)
  }
}

/**
 * Get real-time career insights for display
 */
export async function getCurrentCareerInsights(playerId: string): Promise<CareerInsight[]> {
  const analytics = getCareerAnalytics()
  return analytics.generateCareerInsights(playerId)
}