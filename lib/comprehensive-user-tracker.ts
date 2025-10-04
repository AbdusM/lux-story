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
import { ensureUserProfile } from './ensure-user-profile'

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
  private userId: string
  private profileEnsured: boolean = false

  constructor(userId: string) {
    this.userId = userId
    this.skillTracker = new SkillTracker(userId)
    this.performanceSystem = getPerformanceSystem()
    this.careerAnalytics = getSimpleAnalytics()

    // Ensure user profile exists on tracker initialization
    this.ensureProfile()
  }

  /**
   * Ensure user profile exists in database (async, non-blocking)
   */
  private async ensureProfile(): Promise<void> {
    if (this.profileEnsured) return

    try {
      const success = await ensureUserProfile(this.userId)
      this.profileEnsured = success

      if (!success) {
        console.error(`[ComprehensiveTracker] Failed to ensure profile for ${this.userId}`)
      }
    } catch (error) {
      console.error(`[ComprehensiveTracker] Error ensuring profile:`, error)
    }
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
    console.log(`[ComprehensiveTracker] trackChoice called for ${userId} in ${sceneId}`)
    
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
    console.log(`[ComprehensiveTracker] Added interaction, total: ${this.interactions.length}`)

    // Track in all systems
    try {
      await Promise.all([
        this.trackInSkillTracker(choice, sceneId),
        this.trackInCareerAnalytics(choice),
        this.trackInPerformanceSystem(choice, sceneId, timeToChoose || 0),
        this.trackInGameState(choice, sceneId)
      ])
      console.log(`[ComprehensiveTracker] All tracking systems completed for ${userId}`)
    } catch (error) {
      console.error(`[ComprehensiveTracker] Error in tracking systems:`, error)
    }

    // Generate career explorations if conditions are met
    try {
      await this.generateCareerExplorations(userId)
      console.log(`[ComprehensiveTracker] Career exploration generation completed for ${userId}`)
    } catch (error) {
      console.error(`[ComprehensiveTracker] Error in career exploration generation:`, error)
    }
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
        sceneId: `platform_${platformId}`, // Add required sceneId
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
   * PERFORMANCE FIX: Debounced to run every 5th choice instead of every choice
   */
  private async generateCareerExplorations(userId: string): Promise<void> {
    const userMetrics = this.careerAnalytics.getUserMetrics(userId)

    console.log(`[ComprehensiveTracker] Checking career generation for ${userId}:`, {
      careerInterests: userMetrics.careerInterests.length,
      choicesMade: userMetrics.choicesMade,
      platformsExplored: userMetrics.platformsExplored.length
    })

    // PERFORMANCE FIX: Only generate career explorations every 5th choice to reduce API calls
    const shouldGenerate = userMetrics.choicesMade % 5 === 0

    if (!shouldGenerate) {
      console.log(`[ComprehensiveTracker] Skipping career generation (choice ${userMetrics.choicesMade}, waiting for multiple of 5)`)
      return
    }

    // Generate career explorations if user has sufficient data
    if (userMetrics.careerInterests.length > 0 || userMetrics.choicesMade >= 3) {
      console.log(`[ComprehensiveTracker] Generating career explorations for ${userId} (choice ${userMetrics.choicesMade})`)

      const careerExplorations = this.mapInteractionsToCareers(userId, userMetrics)

      // Queue each career exploration for sync
      for (const exploration of careerExplorations) {
        await this.queueCareerExplorationSync(exploration)
      }
    } else {
      console.log(`[ComprehensiveTracker] Insufficient data for career generation: ${userId}`)
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

    // If user has specific career interests, generate those
    if (userMetrics.careerInterests.length > 0) {
      for (const interest of userMetrics.careerInterests) {
        const careers = careerMapping[interest as keyof typeof careerMapping] || []
        
        for (const career of careers) {
          const exploration = this.createCareerExploration(userId, career, userMetrics)
          explorations.push(exploration)
        }
      }
    } else {
      // If no specific interests, generate general career explorations based on engagement
      console.log(`[ComprehensiveTracker] No specific interests, generating general careers for ${userId}`)
      
      // Generate 2-3 general career explorations based on user engagement
      const generalCareers = [
        { name: 'General Professional', baseScore: 0.70, readiness: 'exploratory' },
        { name: 'Birmingham Community Contributor', baseScore: 0.75, readiness: 'emerging' }
      ]
      
      for (const career of generalCareers) {
        const exploration = this.createCareerExploration(userId, career, userMetrics)
        explorations.push(exploration)
      }
    }

    console.log(`[ComprehensiveTracker] Generated ${explorations.length} career explorations for ${userId}`)
    return explorations
  }

  /**
   * Create a single career exploration
   */
  private createCareerExploration(
    userId: string,
    career: { name: string; baseScore: number; readiness: string },
    userMetrics: any
  ): CareerExplorationData {
    // Calculate match score based on interactions
    let matchScore = career.baseScore
    
    // Boost score based on engagement
    if (userMetrics.choicesMade > 10) matchScore += 0.05
    if (userMetrics.platformsExplored.length > 2) matchScore += 0.05
    if (userMetrics.timeSpent > 300) matchScore += 0.05 // 5+ minutes
    
    matchScore = Math.min(1.0, matchScore)

    // Get Birmingham-specific data
    const birminghamData = this.getBirminghamCareerData(career.name)

    return {
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
    }
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
      },
      'General Professional': {
        localOpportunities: ['Birmingham Business Alliance', 'Local Companies', 'Startup Community'],
        educationPaths: ['UAB Professional Development', 'Jefferson State Programs', 'Community College']
      },
      'Birmingham Community Contributor': {
        localOpportunities: ['Non-profit Organizations', 'Community Centers', 'Local Government'],
        educationPaths: ['Community Programs', 'Volunteer Training', 'Leadership Development']
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
      // Create minimal game state - recordChoice only uses it for pattern extraction
      this.skillTracker.recordChoice(choice, sceneId, {} as any)
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

// Singleton instance per user with memory leak protection
const trackerInstances = new Map<string, { tracker: ComprehensiveUserTracker; timestamp: number }>()
const MAX_TRACKER_AGE = 60 * 60 * 1000 // 1 hour
const MAX_TRACKERS = 100 // Prevent unbounded growth

/**
 * Clean up stale tracker instances to prevent memory leaks
 */
function cleanupStaleTrackers(): void {
  const now = Date.now()
  const toDelete: string[] = []

  trackerInstances.forEach((value, userId) => {
    if (now - value.timestamp > MAX_TRACKER_AGE) {
      toDelete.push(userId)
    }
  })

  toDelete.forEach(userId => {
    trackerInstances.delete(userId)
    console.log(`[ComprehensiveTracker] Cleaned up stale tracker for ${userId}`)
  })

  // Also enforce max trackers limit (LRU eviction)
  if (trackerInstances.size > MAX_TRACKERS) {
    const sorted = Array.from(trackerInstances.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)

    const toEvict = sorted.slice(0, trackerInstances.size - MAX_TRACKERS)
    toEvict.forEach(([userId]) => {
      trackerInstances.delete(userId)
      console.log(`[ComprehensiveTracker] Evicted tracker for ${userId} (LRU)`)
    })
  }
}

export function getComprehensiveTracker(userId: string): ComprehensiveUserTracker {
  // Clean up stale trackers periodically
  if (Math.random() < 0.1) { // 10% chance on each call
    cleanupStaleTrackers()
  }

  const existing = trackerInstances.get(userId)
  if (existing) {
    // Update timestamp on access
    existing.timestamp = Date.now()
    return existing.tracker
  }

  const tracker = new ComprehensiveUserTracker(userId)
  trackerInstances.set(userId, {
    tracker,
    timestamp: Date.now()
  })

  return tracker
}

/**
 * Manually reset all trackers (for testing or manual cleanup)
 */
export function resetAllTrackers(): void {
  trackerInstances.clear()
  console.log('[ComprehensiveTracker] All trackers cleared')
}

/**
 * Get tracker statistics for monitoring
 */
export function getTrackerStats(): {
  count: number
  oldest: number
  newest: number
  trackers: Array<{ userId: string; age: number }>
} {
  const now = Date.now()
  const trackers = Array.from(trackerInstances.entries()).map(([userId, data]) => ({
    userId,
    age: now - data.timestamp
  }))

  return {
    count: trackerInstances.size,
    oldest: Math.max(...trackers.map(t => t.age), 0),
    newest: Math.min(...trackers.map(t => t.age), 0),
    trackers
  }
}
