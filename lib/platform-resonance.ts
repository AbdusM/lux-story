/**
 * Platform Resonance Detection System
 *
 * Detects which career platforms (like train platforms in Grand Central Terminus)
 * naturally resonate with players based on their behavioral patterns and choices
 */

import { getPersonaTracker, type PlayerPersona } from './player-persona'
import { getCareerAnalytics } from './career-analytics'
import type { Choice } from './story-engine'

export interface PlatformState {
  id: string
  name: string
  description: string
  warmth: number // 0-1 scale, how welcoming/accessible the platform feels
  resonance: number // 0-1 scale, how much the platform "recognizes" the player
  accessibility: 'locked' | 'discovered' | 'accessible' | 'resonant'
  visitCount: number
  lastVisited?: number
  birminghamConnections: string[]
}

export interface ResonancePattern {
  platformId: string
  triggerPatterns: string[]
  warmthModifiers: Record<string, number>
  resonanceThreshold: number
  unlockConditions: string[]
}

export interface ResonanceEvent {
  type: 'warmth_increase' | 'warmth_decrease' | 'resonance_detected' | 'platform_unlock'
  platformId: string
  intensity: number
  reason: string
  timestamp: number
}

/**
 * Career platform definitions based on Grand Central Terminus concept
 */
const CAREER_PLATFORMS: Record<string, PlatformState> = {
  'platform-1': {
    id: 'platform-1',
    name: 'The Care Line',
    description: 'Healthcare, teaching, social work - where helping others becomes purpose',
    warmth: 0.3,
    resonance: 0,
    accessibility: 'accessible',
    visitCount: 0,
    birminghamConnections: [
      'UAB Medical Center',
      'Children\'s of Alabama',
      'Birmingham City Schools',
      'United Way of Central Alabama'
    ]
  },
  'platform-3': {
    id: 'platform-3',
    name: 'The Builder\'s Track',
    description: 'Engineering, trades, manufacturing - creating the world\'s foundation',
    warmth: 0.3,
    resonance: 0,
    accessibility: 'accessible',
    visitCount: 0,
    birminghamConnections: [
      'Southern Company',
      'Nucor Steel',
      'Alabama Power',
      'BBVA Field Engineering'
    ]
  },
  'platform-7': {
    id: 'platform-7',
    name: 'The Data Stream',
    description: 'Technology, analytics, research - finding patterns in chaos',
    warmth: 0.3,
    resonance: 0,
    accessibility: 'accessible',
    visitCount: 0,
    birminghamConnections: [
      'Regions Bank Fintech',
      'BBVA Innovation Center',
      'UAB Informatics',
      'Velocity Accelerator'
    ]
  },
  'platform-9': {
    id: 'platform-9',
    name: 'The Growing Garden',
    description: 'Sustainability, environment, agriculture - nurturing tomorrow',
    warmth: 0.3,
    resonance: 0,
    accessibility: 'discovered', // Requires exploration to find
    visitCount: 0,
    birminghamConnections: [
      'Alabama Power Renewable Energy',
      'City of Birmingham Environmental Services',
      'Urban Agriculture Initiatives',
      'Green Infrastructure Projects'
    ]
  },
  'platform-forgotten': {
    id: 'platform-forgotten',
    name: 'The Forgotten Platform',
    description: 'The careers nobody talks about but everyone needs',
    warmth: 0.1,
    resonance: 0,
    accessibility: 'locked', // Special unlock conditions
    visitCount: 0,
    birminghamConnections: [
      'Community Support Services',
      'Essential Infrastructure',
      'Behind-the-Scenes Operations',
      'Invisible but Vital Work'
    ]
  },
  'platform-7-half': {
    id: 'platform-7-half',
    name: 'Platform 7½',
    description: 'The space between - hybrid careers that don\'t fit neat categories',
    warmth: 0,
    resonance: 0,
    accessibility: 'locked', // Only appears for certain player types
    visitCount: 0,
    birminghamConnections: [
      'Cross-Sector Innovation',
      'Hybrid Role Creation',
      'Interdisciplinary Projects',
      'New Career Pathways'
    ]
  }
}

/**
 * Resonance patterns that determine how platforms respond to player behavior
 */
const RESONANCE_PATTERNS: ResonancePattern[] = [
  {
    platformId: 'platform-1',
    triggerPatterns: ['helping', 'caring', 'supporting'],
    warmthModifiers: {
      'helping': 0.3,
      'caring': 0.4,
      'supporting': 0.2,
      'rushed': -0.1,
      'independence': -0.1
    },
    resonanceThreshold: 0.6,
    unlockConditions: []
  },
  {
    platformId: 'platform-3',
    triggerPatterns: ['building', 'creating', 'designing'],
    warmthModifiers: {
      'building': 0.4,
      'creating': 0.3,
      'designing': 0.2,
      'analytical': 0.1,
      'patience': 0.2
    },
    resonanceThreshold: 0.6,
    unlockConditions: []
  },
  {
    platformId: 'platform-7',
    triggerPatterns: ['analytical', 'researching', 'investigating'],
    warmthModifiers: {
      'analytical': 0.4,
      'researching': 0.3,
      'investigating': 0.3,
      'patience': 0.2,
      'building': 0.1
    },
    resonanceThreshold: 0.7,
    unlockConditions: []
  },
  {
    platformId: 'platform-9',
    triggerPatterns: ['environmental', 'growing', 'patience'],
    warmthModifiers: {
      'environmental': 0.5,
      'growing': 0.3,
      'patience': 0.3,
      'caring': 0.2,
      'rushing': -0.2
    },
    resonanceThreshold: 0.5,
    unlockConditions: ['exploring_pattern_detected', 'patience_pattern_strong']
  },
  {
    platformId: 'platform-forgotten',
    triggerPatterns: ['independence', 'patience', 'observation'],
    warmthModifiers: {
      'independence': 0.3,
      'patience': 0.4,
      'helping': -0.1 // Paradoxically, direct helping reduces this platform's warmth
    },
    resonanceThreshold: 0.8,
    unlockConditions: ['high_pattern_diversity', 'low_social_orientation']
  },
  {
    platformId: 'platform-7-half',
    triggerPatterns: ['pattern_diversity', 'creative_problem_solving'],
    warmthModifiers: {
      'building': 0.2,
      'analytical': 0.2,
      'helping': 0.2,
      'creating': 0.3
    },
    resonanceThreshold: 0.9,
    unlockConditions: ['multiple_platform_resonance', 'high_cognitive_flexibility']
  }
]

/**
 * Platform Resonance Detection Engine
 */
export class PlatformResonanceEngine {
  private static instance: PlatformResonanceEngine | null = null
  private platforms: Map<string, PlatformState> = new Map()
  private playerPlatforms: Map<string, Map<string, PlatformState>> = new Map()
  private resonanceEvents: Map<string, ResonanceEvent[]> = new Map()

  static getInstance(): PlatformResonanceEngine {
    if (!this.instance) {
      this.instance = new PlatformResonanceEngine()
    }
    return this.instance
  }

  constructor() {
    this.initializePlatforms()
  }

  private initializePlatforms() {
    for (const platform of Object.values(CAREER_PLATFORMS)) {
      this.platforms.set(platform.id, { ...platform })
    }
  }

  /**
   * Update platform resonance based on player choice
   */
  updatePlatformResonance(playerId: string, choice: Choice): ResonanceEvent[] {
    const events: ResonanceEvent[] = []
    const playerPlatforms = this.getPlayerPlatforms(playerId)
    const persona = getPersonaTracker().getPersona(playerId)

    // Extract patterns from choice
    const choicePatterns = this.extractChoicePatterns(choice)

    // Update each platform based on resonance patterns
    for (const pattern of RESONANCE_PATTERNS) {
      const platform = playerPlatforms.get(pattern.platformId)
      if (!platform) continue

      // Check if choice contains trigger patterns
      const hasRelevantPattern = pattern.triggerPatterns.some(trigger =>
        choicePatterns.includes(trigger)
      )

      if (hasRelevantPattern) {
        // Calculate warmth change
        let warmthChange = 0
        for (const [modifier, value] of Object.entries(pattern.warmthModifiers)) {
          if (choicePatterns.includes(modifier)) {
            warmthChange += value
          }
        }

        // Apply warmth change
        if (warmthChange !== 0) {
          const oldWarmth = platform.warmth
          platform.warmth = Math.max(0, Math.min(1, platform.warmth + warmthChange))

          events.push({
            type: warmthChange > 0 ? 'warmth_increase' : 'warmth_decrease',
            platformId: platform.id,
            intensity: Math.abs(warmthChange),
            reason: `Choice pattern: ${choicePatterns.join(', ')}`,
            timestamp: Date.now()
          })

          // Check for resonance threshold
          if (platform.warmth >= pattern.resonanceThreshold && oldWarmth < pattern.resonanceThreshold) {
            platform.resonance = platform.warmth
            platform.accessibility = 'resonant'

            events.push({
              type: 'resonance_detected',
              platformId: platform.id,
              intensity: platform.resonance,
              reason: `Warmth threshold reached: ${platform.warmth.toFixed(2)}`,
              timestamp: Date.now()
            })
          }
        }
      }

      // Check unlock conditions
      if (platform.accessibility === 'locked' && this.checkUnlockConditions(pattern, persona, playerPlatforms)) {
        platform.accessibility = 'accessible'

        events.push({
          type: 'platform_unlock',
          platformId: platform.id,
          intensity: 1.0,
          reason: `Unlock conditions met: ${pattern.unlockConditions.join(', ')}`,
          timestamp: Date.now()
        })
      }
    }

    // Store events
    if (!this.resonanceEvents.has(playerId)) {
      this.resonanceEvents.set(playerId, [])
    }
    this.resonanceEvents.get(playerId)!.push(...events)

    // Save state
    this.savePlayerPlatforms(playerId)

    return events
  }

  /**
   * Extract behavioral patterns from a choice
   */
  private extractChoicePatterns(choice: Choice): string[] {
    const patterns: string[] = []
    const text = choice.text.toLowerCase()
    const consequence = choice.consequence?.toLowerCase() || ''

    // Direct pattern extraction from consequence
    if (consequence.includes('helping')) patterns.push('helping')
    if (consequence.includes('building')) patterns.push('building')
    if (consequence.includes('analytical') || consequence.includes('analyzing')) patterns.push('analytical')
    if (consequence.includes('caring')) patterns.push('caring')
    if (consequence.includes('creating')) patterns.push('creating')
    if (consequence.includes('environmental')) patterns.push('environmental')

    // Pattern inference from choice text
    if (text.includes('help') || text.includes('support')) patterns.push('helping', 'caring')
    if (text.includes('build') || text.includes('create') || text.includes('make')) patterns.push('building', 'creating')
    if (text.includes('analyze') || text.includes('study') || text.includes('research')) patterns.push('analytical', 'researching')
    if (text.includes('wait') || text.includes('carefully') || text.includes('patient')) patterns.push('patience')
    if (text.includes('quick') || text.includes('rush') || text.includes('hurry')) patterns.push('rushing')
    if (text.includes('alone') || text.includes('myself')) patterns.push('independence')
    if (text.includes('environment') || text.includes('nature') || text.includes('grow')) patterns.push('environmental', 'growing')

    return [...new Set(patterns)] // Remove duplicates
  }

  /**
   * Check if unlock conditions are met for a platform
   */
  private checkUnlockConditions(pattern: ResonancePattern, persona: PlayerPersona, platforms: Map<string, PlatformState>): boolean {
    if (pattern.unlockConditions.length === 0) return true

    for (const condition of pattern.unlockConditions) {
      switch (condition) {
        case 'exploring_pattern_detected':
          if (!persona.dominantPatterns.includes('exploring')) return false
          break

        case 'patience_pattern_strong':
          if ((persona.patternPercentages['patience'] || 0) < 0.3) return false
          break

        case 'high_pattern_diversity':
          if (persona.dominantPatterns.length < 4) return false
          break

        case 'low_social_orientation':
          if (persona.socialOrientation === 'helper' || persona.socialOrientation === 'collaborator') return false
          break

        case 'multiple_platform_resonance':
          const resonantPlatforms = Array.from(platforms.values()).filter(p => p.accessibility === 'resonant')
          if (resonantPlatforms.length < 2) return false
          break

        case 'high_cognitive_flexibility':
          if (persona.problemApproach === 'analytical' && persona.responseSpeed === 'deliberate') return false
          break
      }
    }

    return true
  }

  /**
   * Get platforms for a specific player
   */
  getPlayerPlatforms(playerId: string): Map<string, PlatformState> {
    if (!this.playerPlatforms.has(playerId)) {
      // Initialize with default platforms
      const playerPlatformMap = new Map<string, PlatformState>()
      for (const [id, platform] of this.platforms) {
        playerPlatformMap.set(id, { ...platform })
      }
      this.playerPlatforms.set(playerId, playerPlatformMap)
    }
    return this.playerPlatforms.get(playerId)!
  }

  /**
   * Get resonance events for a player
   */
  getResonanceEvents(playerId: string, limit?: number): ResonanceEvent[] {
    const events = this.resonanceEvents.get(playerId) || []
    return limit ? events.slice(-limit) : events
  }

  /**
   * Get platforms sorted by resonance strength
   */
  getResonantPlatforms(playerId: string): PlatformState[] {
    const platforms = Array.from(this.getPlayerPlatforms(playerId).values())
    return platforms
      .filter(p => p.accessibility !== 'locked')
      .sort((a, b) => b.resonance - a.resonance)
  }

  /**
   * Get visual adjustments for platform display
   */
  getPlatformVisualState(playerId: string, platformId: string): {
    warmthLevel: 'cold' | 'neutral' | 'warm' | 'resonant'
    accessibility: PlatformState['accessibility']
    cssClass: string
    description: string
  } {
    const platform = this.getPlayerPlatforms(playerId).get(platformId)
    if (!platform) {
      return {
        warmthLevel: 'cold',
        accessibility: 'locked',
        cssClass: 'platform-locked',
        description: 'Unknown platform'
      }
    }

    let warmthLevel: 'cold' | 'neutral' | 'warm' | 'resonant'
    if (platform.accessibility === 'resonant') {
      warmthLevel = 'resonant'
    } else if (platform.warmth > 0.6) {
      warmthLevel = 'warm'
    } else if (platform.warmth > 0.3) {
      warmthLevel = 'neutral'
    } else {
      warmthLevel = 'cold'
    }

    const cssClass = `platform-${platform.accessibility} platform-${warmthLevel}`

    return {
      warmthLevel,
      accessibility: platform.accessibility,
      cssClass,
      description: platform.description
    }
  }

  /**
   * Save player platform state to localStorage
   */
  private savePlayerPlatforms(playerId: string) {
    try {
      const platforms = this.getPlayerPlatforms(playerId)
      const data = Object.fromEntries(platforms)
      localStorage.setItem(`lux-platforms-${playerId}`, JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save platform state:', error)
    }
  }

  /**
   * Load player platform state from localStorage
   */
  private loadPlayerPlatforms(playerId: string) {
    try {
      const stored = localStorage.getItem(`lux-platforms-${playerId}`)
      if (stored) {
        const data = JSON.parse(stored)
        const platformMap = new Map<string, PlatformState>()
        for (const [id, platform] of Object.entries(data)) {
          platformMap.set(id, platform as PlatformState)
        }
        this.playerPlatforms.set(playerId, platformMap)
      }
    } catch (error) {
      console.warn('Failed to load platform state:', error)
    }
  }

  /**
   * Generate platform recommendation based on current resonance
   */
  getRecommendation(playerId: string): {
    platformId: string
    confidence: number
    reason: string
    nextSteps: string[]
  } | null {
    const platforms = this.getResonantPlatforms(playerId)
    const topPlatform = platforms[0]

    if (!topPlatform || topPlatform.resonance < 0.4) {
      return null
    }

    const careerAnalytics = getCareerAnalytics()
    const insights = careerAnalytics.generateCareerInsights(playerId)
    const matchingInsight = insights.find(insight =>
      topPlatform.name.toLowerCase().includes(insight.careerPath)
    )

    return {
      platformId: topPlatform.id,
      confidence: topPlatform.resonance,
      reason: `Strong resonance detected (${Math.round(topPlatform.resonance * 100)}%)`,
      nextSteps: matchingInsight?.nextSteps || [
        'Explore this platform further',
        'Connect with Birmingham professionals in this field',
        'Research education pathways'
      ]
    }
  }

  /**
   * Export platform analytics data
   */
  exportPlatformData(playerId?: string): Record<string, unknown> {
    if (playerId) {
      return {
        platforms: Object.fromEntries(this.getPlayerPlatforms(playerId)),
        events: this.getResonanceEvents(playerId),
        recommendation: this.getRecommendation(playerId)
      }
    }

    // Export all data
    const allData: Record<string, unknown> = {}
    for (const [id, platforms] of this.playerPlatforms) {
      allData[id] = {
        platforms: Object.fromEntries(platforms),
        events: this.getResonanceEvents(id),
        recommendation: this.getRecommendation(id)
      }
    }
    return allData
  }
}

/**
 * Get global platform resonance engine instance
 */
export function getPlatformResonance(): PlatformResonanceEngine {
  return PlatformResonanceEngine.getInstance()
}

/**
 * Update platform resonance for a choice (convenience function)
 */
export function updatePlatformResonance(playerId: string, choice: Choice): ResonanceEvent[] {
  return getPlatformResonance().updatePlatformResonance(playerId, choice)
}

/**
 * Get platform visual state for UI (convenience function)
 */
export function getPlatformVisualState(playerId: string, platformId: string) {
  return getPlatformResonance().getPlatformVisualState(playerId, platformId)
}
