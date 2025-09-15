/**
 * Player Persona System
 *
 * Tracks player behavior patterns and generates rich persona descriptions
 * for personalized choice generation
 */

import type { GameState } from './game-store'
import type { Choice } from './story-engine'

export interface PlayerPersona {
  playerId: string

  // Pattern analysis
  dominantPatterns: string[]
  patternCounts: Record<string, number>
  patternPercentages: Record<string, number>

  // Behavioral insights
  responseSpeed: 'deliberate' | 'moderate' | 'quick' | 'impulsive'
  stressResponse: 'calm' | 'adaptive' | 'reactive' | 'overwhelmed'
  socialOrientation: 'helper' | 'collaborator' | 'independent' | 'observer'
  problemApproach: 'analytical' | 'creative' | 'practical' | 'intuitive'

  // Birmingham context
  culturalAlignment: number // 0-1 scale
  localReferences: string[]
  communicationStyle: 'direct' | 'thoughtful' | 'expressive' | 'reserved'

  // AI context
  summaryText: string
  lastUpdated: number
  totalChoices: number
}

export interface PersonaInsight {
  category: string
  insight: string
  confidence: number
  examples: string[]
}

/**
 * Player Persona Tracker
 * Analyzes player choices to build rich behavioral profiles
 */
export class PlayerPersonaTracker {
  private personas: Map<string, PlayerPersona> = new Map()

  constructor() {
    this.loadPersonas()
  }

  /**
   * Update persona based on a choice made
   */
  updatePersona(playerId: string, choice: Choice, responseTime: number, gameState: GameState): PlayerPersona {
    let persona = this.personas.get(playerId) || this.createBasePersona(playerId)

    // Update pattern counts
    const pattern = this.extractPatternFromChoice(choice)
    if (pattern) {
      persona.patternCounts[pattern] = (persona.patternCounts[pattern] || 0) + 1
      persona.totalChoices++
    }

    // Update behavioral metrics
    persona.responseSpeed = this.analyzeResponseSpeed(responseTime, persona.responseSpeed)
    persona.stressResponse = this.analyzeStressResponse(gameState.emotionalState, persona.stressResponse)
    persona.socialOrientation = this.analyzeSocialOrientation(choice, pattern, persona.socialOrientation)
    persona.problemApproach = this.analyzeProblemApproach(choice, pattern, persona.problemApproach)

    // Update pattern analysis
    persona.patternPercentages = this.calculatePatternPercentages(persona.patternCounts, persona.totalChoices)
    persona.dominantPatterns = this.getDominantPatterns(persona.patternPercentages)

    // Update cultural alignment
    persona.culturalAlignment = this.analyzeCulturalAlignment(choice, gameState)

    // Generate updated summary
    persona.summaryText = this.generatePersonaSummary(persona)
    persona.lastUpdated = Date.now()

    // Save and return
    this.personas.set(playerId, persona)
    this.savePersonas()

    return persona
  }

  /**
   * Get existing persona or create basic one
   */
  getPersona(playerId: string): PlayerPersona {
    return this.personas.get(playerId) || this.createBasePersona(playerId)
  }

  /**
   * Create base persona for new player
   */
  private createBasePersona(playerId: string): PlayerPersona {
    return {
      playerId,
      dominantPatterns: [],
      patternCounts: {},
      patternPercentages: {},
      responseSpeed: 'moderate',
      stressResponse: 'calm',
      socialOrientation: 'observer',
      problemApproach: 'intuitive',
      culturalAlignment: 0.5,
      localReferences: [],
      communicationStyle: 'thoughtful',
      summaryText: 'New player just beginning their journey.',
      lastUpdated: Date.now(),
      totalChoices: 0
    }
  }

  /**
   * Extract pattern from choice consequence
   */
  private extractPatternFromChoice(choice: Choice): string | null {
    if (!choice.consequence) return null

    const patterns = ['exploring', 'helping', 'building', 'analyzing', 'patience', 'rushing', 'independence']
    return patterns.find(pattern => choice.consequence.includes(pattern)) || null
  }

  /**
   * Analyze response speed pattern
   */
  private analyzeResponseSpeed(responseTime: number, current: string): PlayerPersona['responseSpeed'] {
    if (responseTime < 2000) return 'impulsive'
    if (responseTime < 5000) return 'quick'
    if (responseTime < 10000) return 'moderate'
    return 'deliberate'
  }

  /**
   * Analyze stress response from emotional state
   */
  private analyzeStressResponse(emotionalState: any, current: string): PlayerPersona['stressResponse'] {
    const stressLevel = emotionalState?.stressLevel || 'calm'
    const rapidClicks = emotionalState?.rapidClicks || 0

    if (stressLevel === 'overwhelmed' || rapidClicks > 5) return 'overwhelmed'
    if (stressLevel === 'anxious' || rapidClicks > 2) return 'reactive'
    if (stressLevel === 'alert') return 'adaptive'
    return 'calm'
  }

  /**
   * Analyze social orientation from choice patterns
   */
  private analyzeSocialOrientation(choice: Choice, pattern: string | null, current: PlayerPersona['socialOrientation']): PlayerPersona['socialOrientation'] {
    if (pattern === 'helping') return 'helper'
    if (pattern === 'independence') return 'independent'
    if (choice.text.toLowerCase().includes('together') || choice.text.toLowerCase().includes('with')) return 'collaborator'
    return current
  }

  /**
   * Analyze problem approach from choice patterns
   */
  private analyzeProblemApproach(choice: Choice, pattern: string | null, current: PlayerPersona['problemApproach']): PlayerPersona['problemApproach'] {
    if (pattern === 'analyzing') return 'analytical'
    if (pattern === 'building') return 'practical'
    if (choice.text.toLowerCase().includes('creative') || choice.text.toLowerCase().includes('different')) return 'creative'
    return current
  }

  /**
   * Calculate pattern percentages
   */
  private calculatePatternPercentages(counts: Record<string, number>, total: number): Record<string, number> {
    const percentages: Record<string, number> = {}

    for (const [pattern, count] of Object.entries(counts)) {
      percentages[pattern] = total > 0 ? count / total : 0
    }

    return percentages
  }

  /**
   * Get dominant patterns (top 3)
   */
  private getDominantPatterns(percentages: Record<string, number>): string[] {
    return Object.entries(percentages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([pattern]) => pattern)
  }

  /**
   * Analyze cultural alignment based on choices
   */
  private analyzeCulturalAlignment(choice: Choice, gameState: GameState): number {
    // Simple heuristic - can be expanded with more sophisticated analysis
    let alignment = 0.5

    // Community-oriented choices increase alignment
    if (choice.text.toLowerCase().includes('help') || choice.text.toLowerCase().includes('together')) {
      alignment += 0.1
    }

    // Independent choices decrease alignment slightly
    if (choice.text.toLowerCase().includes('alone') || choice.text.toLowerCase().includes('myself')) {
      alignment -= 0.05
    }

    return Math.max(0, Math.min(1, alignment))
  }

  /**
   * Generate rich persona summary for AI
   */
  private generatePersonaSummary(persona: PlayerPersona): string {
    const { dominantPatterns, responseSpeed, stressResponse, socialOrientation, problemApproach, totalChoices } = persona

    let summary = `This player has made ${totalChoices} choices. `

    // Dominant patterns
    if (dominantPatterns.length > 0) {
      const primaryPattern = dominantPatterns[0]
      const percentage = Math.round(persona.patternPercentages[primaryPattern] * 100)
      summary += `They show a strong ${primaryPattern} pattern (${percentage}% of choices). `

      if (dominantPatterns.length > 1) {
        const secondaryPattern = dominantPatterns[1]
        const secondaryPercentage = Math.round(persona.patternPercentages[secondaryPattern] * 100)
        summary += `Secondary pattern is ${secondaryPattern} (${secondaryPercentage}%). `
      }
    }

    // Behavioral insights
    summary += this.getResponseSpeedDescription(responseSpeed) + ' '
    summary += this.getStressResponseDescription(stressResponse) + ' '
    summary += this.getSocialOrientationDescription(socialOrientation) + ' '
    summary += this.getProblemApproachDescription(problemApproach) + ' '

    // Cultural context
    if (persona.culturalAlignment > 0.7) {
      summary += 'They show strong connection to community values. '
    } else if (persona.culturalAlignment < 0.3) {
      summary += 'They tend toward more individualistic approaches. '
    }

    return summary.trim()
  }

  private getResponseSpeedDescription(speed: string): string {
    const descriptions = {
      'impulsive': 'They make choices very quickly, often on instinct.',
      'quick': 'They tend to make decisions promptly without much hesitation.',
      'moderate': 'They take a reasonable amount of time to consider options.',
      'deliberate': 'They carefully consider choices before deciding.'
    }
    return descriptions[speed as keyof typeof descriptions] || ''
  }

  private getStressResponseDescription(stress: string): string {
    const descriptions = {
      'calm': 'They remain composed under pressure.',
      'adaptive': 'They adjust well to challenging situations.',
      'reactive': 'They show some sensitivity to stressful moments.',
      'overwhelmed': 'They tend to feel stressed when facing difficult choices.'
    }
    return descriptions[stress as keyof typeof descriptions] || ''
  }

  private getSocialOrientationDescription(social: string): string {
    const descriptions = {
      'helper': 'They consistently focus on supporting others.',
      'collaborator': 'They prefer working with others when possible.',
      'independent': 'They often choose to handle things on their own.',
      'observer': 'They tend to watch and assess before acting.'
    }
    return descriptions[social as keyof typeof descriptions] || ''
  }

  private getProblemApproachDescription(approach: string): string {
    const descriptions = {
      'analytical': 'They break down problems systematically.',
      'creative': 'They look for innovative and unique solutions.',
      'practical': 'They focus on concrete, actionable approaches.',
      'intuitive': 'They trust their instincts when solving problems.'
    }
    return descriptions[approach as keyof typeof descriptions] || ''
  }

  /**
   * Get persona insights for debugging/analytics
   */
  getPersonaInsights(playerId: string): PersonaInsight[] {
    const persona = this.personas.get(playerId)
    if (!persona) return []

    const insights: PersonaInsight[] = []

    // Pattern insights
    for (const pattern of persona.dominantPatterns) {
      const percentage = persona.patternPercentages[pattern]
      if (percentage > 0.3) {
        insights.push({
          category: 'Pattern',
          insight: `Strong ${pattern} tendency (${Math.round(percentage * 100)}%)`,
          confidence: percentage,
          examples: [`${Math.round(percentage * persona.totalChoices)} of ${persona.totalChoices} choices`]
        })
      }
    }

    // Behavioral insights
    insights.push({
      category: 'Response Style',
      insight: `${persona.responseSpeed} decision maker`,
      confidence: 0.8,
      examples: [this.getResponseSpeedDescription(persona.responseSpeed)]
    })

    return insights
  }

  /**
   * Save personas to storage
   */
  private savePersonas() {
    try {
      const data = Object.fromEntries(this.personas)
      localStorage.setItem('lux-story-player-personas', JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save personas:', error)
    }
  }

  /**
   * Load personas from storage
   */
  private loadPersonas() {
    try {
      const stored = localStorage.getItem('lux-story-player-personas')
      if (stored) {
        const data = JSON.parse(stored)
        this.personas = new Map(Object.entries(data))
      }
    } catch (error) {
      console.warn('Failed to load personas:', error)
    }
  }

  /**
   * Get all personas (for analytics)
   */
  getAllPersonas(): PlayerPersona[] {
    return Array.from(this.personas.values())
  }

  /**
   * Clear all persona data
   */
  clearAllPersonas() {
    this.personas.clear()
    localStorage.removeItem('lux-story-player-personas')
  }
}

// Singleton instance
let personaTracker: PlayerPersonaTracker | null = null

export function getPersonaTracker(): PlayerPersonaTracker {
  if (!personaTracker) {
    personaTracker = new PlayerPersonaTracker()
  }
  return personaTracker
}