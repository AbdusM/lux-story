/**
 * Player Persona System
 *
 * Tracks player behavior patterns and generates rich persona descriptions
 * for personalized choice generation
 */

import type { GameState } from './game-store'
import type { Choice } from './story-engine'
import { logChoice } from './real-time-monitor'
import { logger } from './logger'

export interface SkillDemonstrationSummary {
  count: number
  latestContext: string // Rich 100-150 word context
  latestScene: string
  timestamp: number
}

export interface TopSkill {
  skill: string
  count: number
  percentage: number // % of total demonstrations
}

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

  // 2030 Skills tracking (NEW)
  recentSkills: string[] // Last 5 unique skills demonstrated
  skillDemonstrations: Record<string, SkillDemonstrationSummary>
  topSkills: TopSkill[] // Top 5 skills by demonstration count

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
    const persona = this.personas.get(playerId) || this.createBasePersona(playerId)

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
      recentSkills: [],
      skillDemonstrations: {},
      topSkills: [],
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
  private analyzeResponseSpeed(responseTime: number, _current: string): PlayerPersona['responseSpeed'] {
    if (responseTime < 2000) return 'impulsive'
    if (responseTime < 5000) return 'quick'
    if (responseTime < 10000) return 'moderate'
    return 'deliberate'
  }

  /**
   * Analyze stress response from emotional state
   */
  private analyzeStressResponse(emotionalState: unknown, _current: string): PlayerPersona['stressResponse'] {
    const state = typeof emotionalState === 'object' && emotionalState !== null ? emotionalState as Record<string, unknown> : {}
    const stressLevel = typeof state.stressLevel === 'string' ? state.stressLevel : 'calm'
    const rapidClicks = typeof state.rapidClicks === 'number' ? state.rapidClicks : 0

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
  private analyzeCulturalAlignment(choice: Choice, _gameState: GameState): number {
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

    // Skill demonstrations (NEW)
    if (persona.topSkills.length > 0) {
      const topSkill = persona.topSkills[0]
      summary += `Most demonstrated skill: ${this.formatSkillName(topSkill.skill)} (${topSkill.count}x, ${Math.round(topSkill.percentage)}%). `

      if (persona.topSkills.length > 1) {
        const secondSkill = persona.topSkills[1]
        summary += `Also shows ${this.formatSkillName(secondSkill.skill)} (${secondSkill.count}x). `
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
   * Add skill demonstration to persona
   * Called when choices with skills metadata are made
   */
  addSkillDemonstration(
    playerId: string,
    skills: string[],
    context: string,
    sceneId: string
  ): PlayerPersona {
    logger.debug('Adding skill demonstration', {
      operation: 'player-persona.add-skill',
      playerId,
      skills,
      sceneId,
      contextLength: context.length
    })

    // Real-time monitoring
    logChoice(playerId, sceneId, skills, sceneId)

    const persona = this.personas.get(playerId) || this.createBasePersona(playerId)

    // Update skill demonstrations
    skills.forEach(skill => {
      if (!persona.skillDemonstrations[skill]) {
        persona.skillDemonstrations[skill] = {
          count: 0,
          latestContext: '',
          latestScene: '',
          timestamp: 0
        }
      }

      persona.skillDemonstrations[skill].count++
      persona.skillDemonstrations[skill].latestContext = context
      persona.skillDemonstrations[skill].latestScene = sceneId
      persona.skillDemonstrations[skill].timestamp = Date.now()
    })

    // Update recent skills (last 5 unique)
    skills.forEach(skill => {
      // Remove skill if already in list
      persona.recentSkills = persona.recentSkills.filter(s => s !== skill)
      // Add to front
      persona.recentSkills.unshift(skill)
    })
    // Keep only last 5 unique
    persona.recentSkills = persona.recentSkills.slice(0, 5)

    // Recalculate top skills
    persona.topSkills = this.calculateTopSkills(persona.skillDemonstrations)

    // Update timestamp
    persona.lastUpdated = Date.now()

    // Save and return
    this.personas.set(playerId, persona)
    this.savePersonas()

    logger.debug('Updated persona', {
      operation: 'player-persona.update-complete',
      recentSkills: persona.recentSkills,
      topSkills: persona.topSkills.slice(0, 3).map(s => `${s.skill}:${s.count}`),
      totalDemonstrations: Object.keys(persona.skillDemonstrations).length
    })

    return persona
  }

  /**
   * Calculate top skills by demonstration count
   */
  private calculateTopSkills(skillDemonstrations: Record<string, SkillDemonstrationSummary>): TopSkill[] {
    // Calculate total demonstrations
    const totalDemonstrations = Object.values(skillDemonstrations)
      .reduce((sum, skill) => sum + skill.count, 0)

    if (totalDemonstrations === 0) return []

    // Sort skills by count and take top 5
    return Object.entries(skillDemonstrations)
      .map(([skill, data]) => ({
        skill,
        count: data.count,
        percentage: (data.count / totalDemonstrations) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  /**
   * Get skill summary for AI prompts
   * Returns formatted string with recent skills and top demonstrations
   */
  getSkillSummaryForAI(playerId: string): string {
    const persona = this.personas.get(playerId)
    if (!persona || persona.topSkills.length === 0) {
      logger.debug('No skill demonstrations yet', { operation: 'player-persona.no-skills', playerId })
      return 'No skill demonstrations yet.'
    }

    let summary = 'Recent skills: '

    // Add top 3 skills with counts
    const topThree = persona.topSkills.slice(0, 3)
    summary += topThree
      .map(skill => `${this.formatSkillName(skill.skill)} (${skill.count}x)`)
      .join(', ')

    summary += '. '

    // Add latest contexts for top 3 skills
    topThree.forEach((topSkill) => {
      const skillData = persona.skillDemonstrations[topSkill.skill]
      if (skillData && skillData.latestContext) {
        const skillName = this.formatSkillName(topSkill.skill)
        summary += `${skillName}: ${skillData.latestContext}. `
      }
    })

    logger.debug('AI Summary generated', {
      operation: 'player-persona.summary',
      playerId,
      summaryLength: summary.length,
      topSkills: topThree.map(s => s.skill),
      preview: summary.substring(0, 100) + '...'
    })

    return summary.trim()
  }

  /**
   * Sync skill demonstrations from SkillTracker
   * Call this on app mount or scene transitions to ensure persona is up-to-date
   */
  syncFromSkillTracker(playerId: string, skillTrackerData: unknown[]): PlayerPersona {
    const persona = this.personas.get(playerId) || this.createBasePersona(playerId)

    // Reset skill demonstrations
    persona.skillDemonstrations = {}
    persona.recentSkills = []

    // Build skill demonstrations from SkillTracker data
    skillTrackerData.forEach(demo => {
      if (typeof demo !== 'object' || demo === null) return
      const demoObj = demo as Record<string, unknown>
      const skills = Array.isArray(demoObj.skillsDemonstrated) ? demoObj.skillsDemonstrated : []
      skills.forEach((skill: unknown) => {
        if (typeof skill !== 'string') return
        if (!persona.skillDemonstrations[skill]) {
          persona.skillDemonstrations[skill] = {
            count: 0,
            latestContext: '',
            latestScene: '',
            timestamp: 0
          }
        }

        persona.skillDemonstrations[skill].count++

        // Keep the most recent context
        const timestamp = typeof demoObj.timestamp === 'number' ? demoObj.timestamp : 0
        if (timestamp > persona.skillDemonstrations[skill].timestamp) {
          persona.skillDemonstrations[skill].latestContext = typeof demoObj.context === 'string' ? demoObj.context : ''
          persona.skillDemonstrations[skill].latestScene = typeof demoObj.scene === 'string' ? demoObj.scene : ''
          persona.skillDemonstrations[skill].timestamp = timestamp
        }
      })
    })

    // Calculate recent skills from most recent demonstrations
    const recentDemos = skillTrackerData
      .filter((demo): demo is Record<string, unknown> => typeof demo === 'object' && demo !== null)
      .sort((a, b) => {
        const aTime = typeof a.timestamp === 'number' ? a.timestamp : 0
        const bTime = typeof b.timestamp === 'number' ? b.timestamp : 0
        return bTime - aTime
      })
      .slice(0, 10) // Look at last 10 demonstrations

    const recentSkillsSet = new Set<string>()
    recentDemos.forEach(demo => {
      const skills = Array.isArray(demo.skillsDemonstrated) ? demo.skillsDemonstrated : []
      skills.forEach((skill: unknown) => {
        if (typeof skill === 'string' && recentSkillsSet.size < 5) {
          recentSkillsSet.add(skill)
        }
      })
    })
    persona.recentSkills = Array.from(recentSkillsSet)

    // Recalculate top skills
    persona.topSkills = this.calculateTopSkills(persona.skillDemonstrations)

    // Update timestamp
    persona.lastUpdated = Date.now()

    // Save and return
    this.personas.set(playerId, persona)
    this.savePersonas()

    return persona
  }

  /**
   * Format skill name for display (camelCase to Title Case)
   */
  private formatSkillName(skill: string): string {
    return skill
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
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

    // Skill insights
    if (persona.topSkills.length > 0) {
      const topSkill = persona.topSkills[0]
      insights.push({
        category: 'Skills',
        insight: `Strong ${this.formatSkillName(topSkill.skill)} pattern`,
        confidence: topSkill.percentage / 100,
        examples: [`${topSkill.count} demonstrations (${Math.round(topSkill.percentage)}%)`]
      })
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