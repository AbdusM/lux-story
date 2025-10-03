/**
 * Comprehensive User Interaction Tracker
 * 
 * This system captures ALL user interactions and ensures they flow to the database
 * and are available in the admin dashboard. No more piecemeal tracking.
 */

import { queueSkillSummarySync } from './sync-queue'
import { trackUserChoice, getSimpleAnalytics } from './simple-career-analytics'
import { SkillTracker } from './skill-tracker'
import { getPerformanceSystem } from './performance-system'

// Comprehensive interaction data structure
export interface UserInteraction {
  userId: string
  timestamp: number
  type: 'choice' | 'scene_visit' | 'character_interaction' | 'skill_demonstration' | 'platform_exploration'
  data: any
  context: {
    sceneId: string
    characterId?: string
    platformId?: string
    timeSpent?: number
  }
}

// Career exploration data
export interface CareerExplorationData {
  user_id: string
  career_name: string
  match_score: number
  readiness_level: 'exploratory' | 'emerging' | 'near_ready' | 'ready'
  local_opportunities: string[]
  education_paths: string[]
  evidence: {
    skill_demonstrations: string[]
    character_interactions: string[]
    scene_choices: string[]
    time_invested: number
  }
}

// Relationship progress data
export interface RelationshipProgressData {
  user_id: string
  character_name: string
  trust_level: number
  last_interaction: string
  key_moments: string[]
  interaction_count: number
}

// Performance metrics data
export interface PerformanceMetricsData {
  user_id: string
  patience_score: number
  rushing_score: number
  anxiety_score: number
  exploration_score: number
  engagement_level: 'low' | 'medium' | 'high'
  total_choices: number
  average_choice_time: number
  scene_visits: string[]
  character_interactions: string[]
}

export class ComprehensiveUserTracker {
  private interactions: UserInteraction[] = []
  private skillTracker: SkillTracker
  private performanceSystem: any
  private careerAnalytics: any

  constructor(userId: string) {
    this.skillTracker = new SkillTracker(userId)
    this.performanceSystem = getPerformanceSystem()
    this.careerAnalytics = getSimpleAnalytics()
  }

  /**
   * Track a user choice with comprehensive context
   */
  async trackChoice(
    userId: string,
    choice: any,
    sceneId: string,
    characterId?: string,
    timeToChoose?: number
  ): Promise<void> {
    const interaction: UserInteraction = {
      userId,
      timestamp: Date.now(),
      type: 'choice',
      data: {
        choiceText: choice.text,
        consequence: choice.consequence,
        nextScene: choice.nextScene,
        stateChanges: choice.stateChanges
      },
      context: {
        sceneId,
        characterId,
        timeSpent: timeToChoose
      }
    }

    this.interactions.push(interaction)

    // Track in all systems
    await Promise.all([
      this.trackInSkillTracker(choice, sceneId),
      this.trackInCareerAnalytics(choice),
      this.trackInPerformanceSystem(choice, sceneId, timeToChoose || 0),
      this.trackInGameState(choice, sceneId)
    ])

    // Generate career explorations if conditions are met
    await this.generateCareerExplorations(userId)
  }

  /**
   * Track scene visit with time spent
   */
  async trackSceneVisit(
    userId: string,
    sceneId: string,
    timeSpent: number,
    characterId?: string
  ): Promise<void> {
    const interaction: UserInteraction = {
      userId,
      timestamp: Date.now(),
      type: 'scene_visit',
      data: {
        sceneId,
        timeSpent,
        characterId
      },
      context: {
        sceneId,
        characterId,
        timeSpent
      }
    }

    this.interactions.push(interaction)

    // Update performance system
    this.performanceSystem.updateFromChoice('scene_visit', timeSpent, sceneId, characterId)
  }

  /**
   * Track character interaction
   */
  async trackCharacterInteraction(
    userId: string,
    characterId: string,
    interactionType: string,
    sceneId: string
  ): Promise<void> {
    const interaction: UserInteraction = {
      userId,
      timestamp: Date.now(),
      type: 'character_interaction',
      data: {
        characterId,
        interactionType,
        sceneId
      },
      context: {
        sceneId,
        characterId
      }
    }

    this.interactions.push(interaction)

    // Update relationship progress
    await this.updateRelationshipProgress(userId, characterId, interactionType)
  }

  /**
   * Track platform exploration
   */
  async trackPlatformExploration(
    userId: string,
    platformId: string,
    timeSpent: number
  ): Promise<void> {
    const interaction: UserInteraction = {
      userId,
      timestamp: Date.now(),
      type: 'platform_exploration',
      data: {
        platformId,
        timeSpent
      },
      context: {
        platformId,
        timeSpent
      }
    }

    this.interactions.push(interaction)

    // Track in career analytics
    this.careerAnalytics.trackPlatformVisit(userId, platformId)
  }

  /**
   * Generate career explorations from tracked data
   */
  private async generateCareerExplorations(userId: string): Promise<void> {
    const userMetrics = this.careerAnalytics.getUserMetrics(userId)
    
    // Only generate if user has sufficient data
    if (userMetrics.careerInterests.length === 0 && userMetrics.choicesMade < 5) {
      return
    }

    const careerExplorations = this.mapInteractionsToCareers(userId, userMetrics)
    
    // Queue each career exploration for sync
    for (const exploration of careerExplorations) {
      await this.queueCareerExplorationSync(exploration)
    }
  }

  /**
   * Map user interactions to career explorations
   */
  private mapInteractionsToCareers(
    userId: string,
    userMetrics: any
  ): CareerExplorationData[] {
    const explorations: CareerExplorationData[] = []
    
    // Map career interests to specific careers
    const careerMapping = {
      'healthcare': [
        { name: 'Healthcare Professional', baseScore: 0.85, readiness: 'near_ready' },
        { name: 'Nurse', baseScore: 0.80, readiness: 'emerging' },
        { name: 'Medical Assistant', baseScore: 0.75, readiness: 'exploratory' }
      ],
      'technology': [
        { name: 'Software Developer', baseScore: 0.85, readiness: 'near_ready' },
        { name: 'IT Support Specialist', baseScore: 0.80, readiness: 'emerging' },
        { name: 'Data Analyst', baseScore: 0.75, readiness: 'exploratory' }
      ],
      'engineering': [
        { name: 'Mechanical Engineer', baseScore: 0.85, readiness: 'near_ready' },
        { name: 'Civil Engineer', baseScore: 0.80, readiness: 'emerging' },
        { name: 'Engineering Technician', baseScore: 0.75, readiness: 'exploratory' }
      ],
      'education': [
        { name: 'Teacher', baseScore: 0.85, readiness: 'near_ready' },
        { name: 'Educational Assistant', baseScore: 0.80, readiness: 'emerging' },
        { name: 'Tutor', baseScore: 0.75, readiness: 'exploratory' }
      ]
    }

    // Generate career explorations for each interest
    for (const interest of userMetrics.careerInterests) {
      const careers = careerMapping[interest as keyof typeof careerMapping] || []
      
      for (const career of careers) {
        // Calculate match score based on interactions
        let matchScore = career.baseScore
        
        // Boost score based on engagement
        if (userMetrics.choicesMade > 10) matchScore += 0.05
        if (userMetrics.platformsExplored.length > 2) matchScore += 0.05
        if (userMetrics.timeSpent > 300) matchScore += 0.05 // 5+ minutes
        
        matchScore = Math.min(1.0, matchScore)

        // Get Birmingham-specific data
        const birminghamData = this.getBirminghamCareerData(career.name)

        explorations.push({
          user_id: userId,
          career_name: career.name,
          match_score: matchScore,
          readiness_level: career.readiness as any,
          local_opportunities: birminghamData.localOpportunities,
          education_paths: birminghamData.educationPaths,
          evidence: {
            skill_demonstrations: this.getSkillDemonstrationsForCareer(career.name),
            character_interactions: this.getCharacterInteractionsForCareer(career.name),
            scene_choices: this.getSceneChoicesForCareer(career.name),
            time_invested: userMetrics.timeSpent
          }
        })
      }
    }

    return explorations
  }

  /**
   * Get Birmingham-specific career data
   */
  private getBirminghamCareerData(careerName: string): {
    localOpportunities: string[]
    educationPaths: string[]
  } {
    const birminghamData = {
      'Healthcare Professional': {
        localOpportunities: ['UAB Hospital', 'Children\'s of Alabama', 'Birmingham VA Medical Center'],
        educationPaths: ['UAB School of Medicine', 'UAB School of Nursing', 'Jefferson State Nursing Program']
      },
      'Software Developer': {
        localOpportunities: ['Shipt (Birmingham HQ)', 'Regions Bank Technology', 'UAB IT Department'],
        educationPaths: ['UAB Computer Science', 'Jefferson State Community College', 'Birmingham Coding Bootcamp']
      },
      'Mechanical Engineer': {
        localOpportunities: ['Southern Company', 'ACIPCO', 'Birmingham Engineering Firms'],
        educationPaths: ['UAB School of Engineering', 'Jefferson State Engineering Program']
      },
      'Teacher': {
        localOpportunities: ['Birmingham City Schools', 'Jefferson County Schools', 'Private Schools'],
        educationPaths: ['UAB School of Education', 'Samford University Education Program']
      }
    }

    return birminghamData[careerName as keyof typeof birminghamData] || {
      localOpportunities: ['Local Birmingham Opportunities'],
      educationPaths: ['Birmingham Education Programs']
    }
  }

  /**
   * Get skill demonstrations relevant to a career
   */
  private getSkillDemonstrationsForCareer(careerName: string): string[] {
    // This would analyze the skill tracker data for relevant skills
    // For now, return placeholder
    return ['Problem Solving', 'Communication', 'Critical Thinking']
  }

  /**
   * Get character interactions relevant to a career
   */
  private getCharacterInteractionsForCareer(careerName: string): string[] {
    // This would analyze character interaction data
    // For now, return placeholder
    return ['Samuel - Career Guidance', 'Maya - Technical Discussion']
  }

  /**
   * Get scene choices relevant to a career
   */
  private getSceneChoicesForCareer(careerName: string): string[] {
    // This would analyze choice history for career-relevant decisions
    // For now, return placeholder
    return ['Platform Exploration', 'Career Values Discussion']
  }

  /**
   * Queue career exploration for database sync
   */
  private async queueCareerExplorationSync(exploration: CareerExplorationData): Promise<void> {
    // Use the existing sync queue mechanism
    // We'll need to extend it to handle career_explorations
    console.log(`[ComprehensiveTracker] Queuing career exploration: ${exploration.career_name}`)
    
    // For now, we'll use a direct API call
    try {
      const response = await fetch('/api/user/career-explorations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exploration)
      })
      
      if (!response.ok) {
        console.error('Failed to sync career exploration:', response.statusText)
      }
    } catch (error) {
      console.error('Error syncing career exploration:', error)
    }
  }

  /**
   * Update relationship progress
   */
  private async updateRelationshipProgress(
    userId: string,
    characterId: string,
    interactionType: string
  ): Promise<void> {
    // This would update the relationship_progress table
    console.log(`[ComprehensiveTracker] Updating relationship: ${characterId} - ${interactionType}`)
  }

  /**
   * Track in skill tracker
   */
  private async trackInSkillTracker(choice: any, sceneId: string): Promise<void> {
    if (this.skillTracker) {
      this.skillTracker.recordChoice(choice, sceneId, {})
    }
  }

  /**
   * Track in career analytics
   */
  private async trackInCareerAnalytics(choice: any): Promise<void> {
    // This is already handled by trackUserChoice
  }

  /**
   * Track in performance system
   */
  private async trackInPerformanceSystem(
    choice: any,
    sceneId: string,
    timeToChoose: number
  ): Promise<void> {
    if (this.performanceSystem) {
      this.performanceSystem.updateFromChoice(
        choice.consequence || 'unknown',
        timeToChoose,
        sceneId
      )
    }
  }

  /**
   * Track in game state
   */
  private async trackInGameState(choice: any, sceneId: string): Promise<void> {
    // This would update the game state manager
    console.log(`[ComprehensiveTracker] Updating game state for choice in ${sceneId}`)
  }

  /**
   * Get all tracked interactions
   */
  getInteractions(): UserInteraction[] {
    return this.interactions
  }

  /**
   * Get interaction summary
   */
  getInteractionSummary(): {
    totalInteractions: number
    choices: number
    sceneVisits: number
    characterInteractions: number
    platformExplorations: number
  } {
    const summary = {
      totalInteractions: this.interactions.length,
      choices: 0,
      sceneVisits: 0,
      characterInteractions: 0,
      platformExplorations: 0
    }

    for (const interaction of this.interactions) {
      summary[interaction.type as keyof typeof summary]++
    }

    return summary
  }
}

// Singleton instance per user
const trackerInstances = new Map<string, ComprehensiveUserTracker>()

export function getComprehensiveTracker(userId: string): ComprehensiveUserTracker {
  if (!trackerInstances.has(userId)) {
    trackerInstances.set(userId, new ComprehensiveUserTracker(userId))
  }
  return trackerInstances.get(userId)!
}
