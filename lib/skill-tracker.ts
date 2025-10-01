/**
 * Evidence-First Skill Tracker
 *
 * THE KEY INSIGHT: We are NOT building a measurement tool that produces scores.
 * We ARE building an evidence-gathering tool that produces stories.
 *
 * Primary data structure: SkillDemonstration[] (what actually happened)
 * Numbers are INTERNAL ONLY (for career matching algorithms)
 * exportSkillProfile() returns evidence and context, NOT scores
 * False precision like emotionalIntelligence: 0.82 is a lie - we don't do that
 */

import { FutureSkillsSystem } from './2030-skills-system'
import { safeStorage } from './safe-storage'
import type { SimpleGameState } from '../hooks/useSimpleGame'
import { SCENE_SKILL_MAPPINGS, type SceneSkillMapping } from './scene-skill-mappings'
import { queueSkillSummarySync } from './sync-queue'
import { logSkillDemo } from './real-time-monitor'

export interface SkillDemonstration {
  scene: string
  sceneDescription: string
  choice: string
  skillsDemonstrated: string[]
  context: string
  timestamp: number
}

export interface SkillMilestone {
  checkpoint: string
  totalChoices: number
  demonstrationCount: number
  timestamp: number
}

export interface CareerMatch {
  name: string
  matchScore: number // Internal use, not primary presentation
  evidenceForMatch: string[] // THIS is what we show
  requiredSkills: Record<string, { current: number; required: number; gap: number }> // Skill requirements and gaps
  salaryRange: [number, number]
  educationPaths: string[]
  localOpportunities: string[]
  readiness: 'near_ready' | 'developing' | 'exploring'
}

export interface SkillProfile {
  // PRIMARY DATA: Evidence, not scores
  skillDemonstrations: Record<string, SkillDemonstration[]>

  // Timeline
  milestones: SkillMilestone[]

  // Career matches with evidence
  careerMatches: CareerMatch[]

  // Metadata
  totalDemonstrations: number
  journeyStarted: number
}

/**
 * Evidence-First Skill Tracker
 * Records skill demonstrations as evidence, not as numeric scores
 */
export class SkillTracker {
  // Maximum number of demonstrations to keep in memory
  // ~100KB at 200 bytes per demonstration
  private static readonly MAX_DEMONSTRATIONS = 500

  // Maximum localStorage size before attempting cleanup (in characters)
  // ~5MB typical quota, use 4MB threshold for safety
  private static readonly MAX_STORAGE_SIZE = 4_000_000

  private skillsSystem: FutureSkillsSystem
  private userId: string
  private demonstrations: SkillDemonstration[] = []
  private milestones: SkillMilestone[] = []
  private saveErrorCount = 0
  private lastSaveError: number | null = null

  constructor(userId: string) {
    this.userId = userId
    this.skillsSystem = new FutureSkillsSystem()
    this.loadFromStorage()
  }

  /**
   * Core method: Record a skill demonstration after each choice
   */
  recordChoice(choice: any, scene: string, gameState: SimpleGameState): void {
    // 1. Extract skill demonstrations from choice
    const demonstrations = this.extractDemonstrations(choice, scene, gameState)

    // 2. Record evidence
    this.demonstrations.push(...demonstrations)

    // 3. Smart trimming that prioritizes recent and milestone-related demonstrations
    this.trimDemonstrationsIfNeeded()

    // 4. Update internal skill levels (for career matching only)
    demonstrations.forEach(demo => {
      demo.skillsDemonstrated.forEach(skill => {
        this.skillsSystem.analyzeChoiceForSkills(demo.choice, demo.scene)
      })
    })

    // 5. Take milestone snapshot if needed
    if (this.isMilestone(gameState)) {
      this.recordMilestone(gameState)
    }

    // 6. Persist with error handling
    const saveSuccess = this.saveToStorage()

    if (saveSuccess) {
      this.handleSaveSuccess()
    } else {
      this.handleSaveFailure()
    }

    // 7. Queue Supabase sync every 3rd demonstration for each skill
    demonstrations.forEach(demo => {
      demo.skillsDemonstrated.forEach(skill => {
        const skillDemoCount = this.getSkillDemonstrationCount(skill)

        if (skillDemoCount % 3 === 0) {
          // Get all scenes where this skill was demonstrated
          const scenesInvolved = Array.from(
            new Set(
              this.demonstrations
                .filter(d => d.skillsDemonstrated.includes(skill))
                .map(d => d.scene)
            )
          )

          // Queue sync to Supabase
          queueSkillSummarySync({
            user_id: this.userId,
            skill_name: skill,
            demonstration_count: skillDemoCount,
            latest_context: demo.context, // Rich 100-150 word context
            scenes_involved: scenesInvolved,
            last_demonstrated: new Date().toISOString()
          })

          console.log(
            `[SkillTracker] Queued sync for ${skill} (${skillDemoCount} demonstrations)`
          )
        }
      })
    })
  }

  /**
   * Simplified method for direct skill demonstration recording
   * Used by: test data generators, manual recording, and game integration
   */
  recordSkillDemonstration(
    sceneId: string,
    choiceId: string,
    skills: string[],
    context: string
  ): void {
    console.log('📝 [SkillTracker] Recording skill demonstration:', {
      userId: this.userId,
      sceneId,
      skills,
      contextLength: context.length,
      totalDemonstrations: this.demonstrations.length
    })

    // Look up scene mapping for rich context
    const sceneMapping = SCENE_SKILL_MAPPINGS[sceneId]
    const sceneDescription = sceneMapping?.sceneDescription || `Scene: ${sceneId}`

    // Create demonstration record
    const demonstration: SkillDemonstration = {
      scene: sceneId,
      sceneDescription,
      choice: choiceId,
      skillsDemonstrated: skills,
      context,
      timestamp: Date.now()
    }

    // Add to demonstrations list
    this.demonstrations.push(demonstration)

    // Trim if needed
    this.trimDemonstrationsIfNeeded()

    // Persist to localStorage
    this.saveToStorage()

    // Queue Supabase sync every 3rd demonstration for each skill
    skills.forEach(skill => {
      const skillDemoCount = this.getSkillDemonstrationCount(skill)

      console.log('📊 [SkillTracker] Skill demonstration count:', {
        skill,
        count: skillDemoCount,
        willSync: skillDemoCount % 3 === 0
      })

      // Real-time monitoring
      const willSync = skillDemoCount % 3 === 0
      logSkillDemo(this.userId, skill, skillDemoCount, willSync)

      if (skillDemoCount % 3 === 0) {
        // Get all scenes where this skill was demonstrated
        const scenesInvolved = Array.from(
          new Set(
            this.demonstrations
              .filter(d => d.skillsDemonstrated.includes(skill))
              .map(d => d.scene)
          )
        )

        // Queue sync to Supabase
        queueSkillSummarySync({
          user_id: this.userId,
          skill_name: skill,
          demonstration_count: skillDemoCount,
          latest_context: context, // Rich 100-150 word context
          scenes_involved: scenesInvolved,
          last_demonstrated: new Date().toISOString()
        })

        console.log('🔄 [SkillTracker] Queued Supabase sync:', {
          skill,
          demonstrationCount: skillDemoCount,
          scenesInvolved: scenesInvolved.length,
          contextLength: context.length
        })
      }
    })
  }

  /**
   * Add a milestone marker for major progress points
   */
  addMilestone(checkpoint: string): void {
    this.milestones.push({
      checkpoint,
      totalChoices: this.demonstrations.length,
      demonstrationCount: this.demonstrations.length,
      timestamp: Date.now()
    })
    this.saveToStorage()
  }

  /**
   * Extract demonstrations - PRIORITY: Rich scene mappings, FALLBACK: Pattern detection
   */
  private extractDemonstrations(
    choice: any,
    scene: string,
    gameState: SimpleGameState
  ): SkillDemonstration[] {
    // PRIORITY 1: Check for scene-specific mapping with rich context
    const sceneMapping = SCENE_SKILL_MAPPINGS[scene]

    if (sceneMapping) {
      // Try to find matching choice in scene mappings
      const choiceMapping = this.findChoiceMapping(sceneMapping, choice)

      if (choiceMapping) {
        // Use rich context from scene mapping
        return [{
          scene,
          sceneDescription: sceneMapping.sceneDescription,
          choice: choice.text,
          skillsDemonstrated: choiceMapping.skillsDemonstrated,
          context: choiceMapping.context, // Rich 100-150 word context!
          timestamp: Date.now()
        }]
      }
    }

    // FALLBACK: Pattern-based detection if no scene mapping
    const skills = this.detectSkillsFromPattern(choice)

    // Add scene-specific skill additions
    const sceneSkills = this.getSceneSpecificSkills(scene, choice.text)
    const allSkills = Array.from(new Set([...skills, ...sceneSkills]))

    if (allSkills.length === 0) return []

    return [{
      scene,
      sceneDescription: this.getSceneDescription(scene),
      choice: choice.text,
      skillsDemonstrated: allSkills,
      context: this.generateContext(choice, scene, gameState),
      timestamp: Date.now()
    }]
  }

  /**
   * Find matching choice in scene mappings
   * Matches by choice ID or text similarity
   */
  private findChoiceMapping(
    sceneMapping: SceneSkillMapping,
    choice: any
  ): { skillsDemonstrated: string[]; context: string } | null {
    // Try exact match by choice ID first
    if (choice.id && sceneMapping.choiceMappings[choice.id]) {
      return sceneMapping.choiceMappings[choice.id]
    }

    // Try fuzzy match by choice text
    const choiceText = choice.text.toLowerCase()
    for (const [choiceId, mapping] of Object.entries(sceneMapping.choiceMappings)) {
      // Simple substring match (can be improved with string similarity)
      if (choiceText.includes(choiceId.toLowerCase()) ||
          choiceId.toLowerCase().includes(choiceText.substring(0, 20))) {
        return mapping
      }
    }

    return null
  }

  /**
   * Pattern-based skill detection (fallback)
   */
  private detectSkillsFromPattern(choice: any): string[] {
    const patternSkillMap: Record<string, string[]> = {
      helping: ['emotionalIntelligence', 'collaboration', 'communication'],
      analytical: ['criticalThinking', 'problemSolving', 'digitalLiteracy'],
      building: ['creativity', 'problemSolving', 'leadership'],
      patience: ['timeManagement', 'adaptability', 'emotionalIntelligence'],
      exploring: ['adaptability', 'creativity', 'criticalThinking']
    }

    if (!choice.pattern) return []

    const skills = patternSkillMap[choice.pattern] || []

    // Validate pattern is recognized
    if (choice.pattern && !patternSkillMap[choice.pattern]) {
      console.warn(`Unknown pattern: "${choice.pattern}" in choice: "${choice.text}"`)
    }

    return skills
  }

  /**
   * Get scene-specific skill additions
   */
  private getSceneSpecificSkills(scene: string, choiceText: string): string[] {
    const skills: string[] = []
    const text = choiceText.toLowerCase()

    // Birmingham-specific scenes enhance cultural competence
    if (scene.includes('birmingham') || text.includes('birmingham')) {
      skills.push('culturalCompetence')
    }

    // Financial discussions
    if (text.includes('salary') || text.includes('cost') || text.includes('budget') || text.includes('money')) {
      skills.push('financialLiteracy')
    }

    // Leadership moments
    if (text.includes('lead') || text.includes('guide') || text.includes('inspire') || text.includes('organize')) {
      skills.push('leadership')
    }

    // Digital/tech contexts
    if (text.includes('robot') || text.includes('data') || text.includes('tech') || text.includes('digital')) {
      skills.push('digitalLiteracy')
    }

    // Communication patterns
    if (text.includes('explain') || text.includes('tell') || text.includes('share') || text.includes('discuss')) {
      skills.push('communication')
    }

    // Collaboration patterns
    if (text.includes('together') || text.includes('team') || text.includes('with') || text.includes('help')) {
      skills.push('collaboration')
    }

    return skills
  }

  /**
   * Generate human-readable context for demonstration
   */
  private generateContext(choice: any, scene: string, gameState: SimpleGameState): string {
    const characterArc = this.detectCharacterArc(scene)
    const pattern = choice.pattern || 'exploring'
    const choiceCount = gameState.choiceHistory?.length || 0

    // Build rich context
    let context = `Demonstrated ${pattern} pattern`

    if (characterArc !== 'Exploration') {
      context += ` in ${characterArc} arc`
    }

    // Add relationship context if relevant
    const relationships = gameState.characterRelationships
    if (characterArc === 'Maya' && relationships?.maya) {
      if (relationships.maya.confidence > 5) {
        context += ' (building confidence)'
      }
    } else if (characterArc === 'Samuel' && relationships?.samuel) {
      if (relationships.samuel.trust > 5) {
        context += ' (earning trust)'
      }
    } else if (characterArc === 'Devon' && relationships?.devon) {
      if (relationships.devon.socialComfort > 3) {
        context += ' (improving social comfort)'
      }
    }

    // Add journey stage
    if (choiceCount <= 5) {
      context += ' [Early Journey]'
    } else if (choiceCount <= 15) {
      context += ' [Mid Journey]'
    } else {
      context += ' [Late Journey]'
    }

    return context
  }

  /**
   * Export for dashboard - EVIDENCE FIRST
   */
  exportSkillProfile(): SkillProfile {
    // Group demonstrations by skill
    const demonstrationsBySkill: Record<string, SkillDemonstration[]> = {}

    this.demonstrations.forEach(demo => {
      demo.skillsDemonstrated.forEach(skill => {
        if (!demonstrationsBySkill[skill]) {
          demonstrationsBySkill[skill] = []
        }
        demonstrationsBySkill[skill].push(demo)
      })
    })

    // Get career matches (uses internal numbers, but presents as evidence)
    const careerMatches = this.getCareerMatches()

    return {
      // PRIMARY DATA: Evidence, not scores
      skillDemonstrations: demonstrationsBySkill,

      // Timeline of skill development
      milestones: this.milestones,

      // Career matches with evidence
      careerMatches,

      // Metadata
      totalDemonstrations: this.demonstrations.length,
      journeyStarted: this.milestones[0]?.timestamp || Date.now()
    }
  }

  /**
   * Get career matches with evidence-based explanations
   */
  private getCareerMatches(): CareerMatch[] {
    // Use internal skill levels for matching algorithm
    const internalSkills = this.calculateInternalSkillLevels()
    const matches = this.skillsSystem.getMatchingCareerPaths()

    // Convert to evidence-based presentation
    return matches.slice(0, 5).map(match => {
      // Build requiredSkills object for gap analysis
      const requiredSkillsObj: Record<string, { current: number; required: number; gap: number }> = {}
      const requiredSkills = match.requiredSkills || []

      requiredSkills.forEach((skillKey: string) => {
        const required = match.skillLevels?.[skillKey] || 0.7
        const current = internalSkills[skillKey] || 0.5
        const gap = Math.max(0, required - current)

        requiredSkillsObj[skillKey] = { current, required, gap }
      })

      return {
        name: match.name,
        matchScore: this.calculateMatchScore(match, internalSkills),
        evidenceForMatch: this.buildEvidenceForCareer(match, internalSkills),
        requiredSkills: requiredSkillsObj,
        salaryRange: match.salaryRange,
        educationPaths: match.educationPath || [],
        localOpportunities: match.localOpportunities || [],
        readiness: this.determineReadiness(this.calculateMatchScore(match, internalSkills))
      }
    })
  }

  /**
   * Calculate match score for a career
   */
  private calculateMatchScore(match: any, skills: Record<string, number>): number {
    const requiredSkills = match.requiredSkills || []
    if (requiredSkills.length === 0) return 0.5

    const totalScore = requiredSkills.reduce((sum: number, skill: string) => {
      return sum + (skills[skill] || 0)
    }, 0)

    return totalScore / requiredSkills.length
  }

  /**
   * Build evidence statements for why career matches
   */
  private buildEvidenceForCareer(match: any, skills: Record<string, number>): string[] {
    const evidence: string[] = []

    // Find demonstrations that align with career requirements
    const relevantDemos = this.demonstrations.filter(demo =>
      demo.skillsDemonstrated.some(skill =>
        match.requiredSkills?.includes(skill)
      )
    )

    // Create evidence statements
    if (relevantDemos.length > 0) {
      evidence.push(`Demonstrated ${relevantDemos.length} relevant skills across journey`)
    }

    // Add specific skill evidence
    const requiredSkills = match.requiredSkills || []
    requiredSkills.forEach((skill: string) => {
      if (skills[skill] > 0.7) {
        const count = this.demonstrations.filter(d =>
          d.skillsDemonstrated.includes(skill)
        ).length
        const skillName = this.formatSkillName(skill)
        evidence.push(`Strong ${skillName} pattern (${count} demonstrations)`)
      }
    })

    // Add Birmingham relevance if high
    if (match.birminghamRelevance > 0.8) {
      evidence.push(`High Birmingham job market relevance`)
    }

    // Add growth projection
    if (match.growthProjection === 'high') {
      evidence.push(`High growth career field`)
    }

    return evidence
  }

  /**
   * Format skill name for display
   */
  private formatSkillName(skill: string): string {
    return skill
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .trim()
  }

  /**
   * Calculate internal skill levels (for algorithms only, not exported)
   */
  private calculateInternalSkillLevels(): Record<string, number> {
    const skills: Record<string, number> = {}

    // Count demonstrations per skill
    this.demonstrations.forEach(demo => {
      demo.skillsDemonstrated.forEach(skill => {
        skills[skill] = (skills[skill] || 0) + 0.03 // Small increment per demo
      })
    })

    // Cap at 1.0
    Object.keys(skills).forEach(skill => {
      skills[skill] = Math.min(1.0, skills[skill])
    })

    return skills
  }

  /**
   * Get skill demonstrations count
   */
  getSkillDemonstrationCount(skillName: string): number {
    return this.demonstrations.filter(demo =>
      demo.skillsDemonstrated.includes(skillName)
    ).length
  }

  /**
   * Get recent demonstrations
   */
  getRecentDemonstrations(limit: number = 5): SkillDemonstration[] {
    return this.demonstrations.slice(-limit).reverse()
  }

  /**
   * Get total demonstrations count
   */
  getTotalDemonstrationsCount(): number {
    return this.demonstrations.length
  }

  /**
   * Handle successful save - reset error counters
   */
  private handleSaveSuccess(): void {
    if (this.saveErrorCount > 0) {
      console.info('SkillTracker: Save recovered after errors', {
        previousFailures: this.saveErrorCount
      })
    }
    this.saveErrorCount = 0
    this.lastSaveError = null
  }

  /**
   * Handle save failure - track errors
   */
  private handleSaveFailure(): void {
    this.saveErrorCount++
    this.lastSaveError = Date.now()

    if (this.saveErrorCount >= 3) {
      console.error(
        'SkillTracker: CRITICAL - Multiple consecutive save failures',
        {
          failureCount: this.saveErrorCount,
          userId: this.userId,
          demonstrationCount: this.demonstrations.length,
          milestoneCount: this.milestones.length,
          estimatedSize: this.estimateStorageSize()
        }
      )

      // Could trigger user notification here if needed
      // this.notifyUser('Unable to save progress. Please free up storage space.')
    }
  }

  /**
   * Intelligently trim demonstrations, prioritizing recent and milestone-related
   */
  private trimDemonstrationsIfNeeded(): void {
    if (this.demonstrations.length <= SkillTracker.MAX_DEMONSTRATIONS) {
      return
    }

    const excess = this.demonstrations.length - SkillTracker.MAX_DEMONSTRATIONS

    // Strategy: Keep recent demonstrations and those near milestones
    const recentThreshold = Date.now() - (30 * 24 * 60 * 60 * 1000) // Last 30 days

    // Separate demonstrations into priority groups
    const recent = this.demonstrations.filter(d => d.timestamp >= recentThreshold)
    const older = this.demonstrations.filter(d => d.timestamp < recentThreshold)

    if (recent.length >= SkillTracker.MAX_DEMONSTRATIONS) {
      // If even recent demos exceed limit, keep most recent
      this.demonstrations = recent.slice(-SkillTracker.MAX_DEMONSTRATIONS)
    } else {
      // Keep all recent, fill remaining space with older demos
      const remainingSpace = SkillTracker.MAX_DEMONSTRATIONS - recent.length
      const olderToKeep = older.slice(-remainingSpace)
      this.demonstrations = [...olderToKeep, ...recent]
    }

    console.info(
      `SkillTracker: Trimmed ${excess} demonstrations (${recent.length} recent, ${this.demonstrations.length - recent.length} older kept)`
    )
  }

  /**
   * Estimate storage size before saving
   */
  private estimateStorageSize(): number {
    const data = {
      demonstrations: this.demonstrations,
      milestones: this.milestones,
      lastUpdated: Date.now()
    }

    return JSON.stringify(data).length
  }

  /**
   * Attempt aggressive cleanup if storage size too large
   */
  private aggressiveCleanup(): void {
    const originalDemoCount = this.demonstrations.length
    const originalMilestoneCount = this.milestones.length

    console.warn('SkillTracker: Storage size exceeded, performing aggressive cleanup')

    // Keep only last 100 demonstrations
    const emergencyLimit = 100
    if (this.demonstrations.length > emergencyLimit) {
      this.demonstrations = this.demonstrations.slice(-emergencyLimit)
    }

    // Keep only last 5 milestones
    if (this.milestones.length > 5) {
      this.milestones = this.milestones.slice(-5)
    }

    // Compress demonstration contexts if still too large
    this.demonstrations = this.demonstrations.map(demo => ({
      ...demo,
      context: demo.context.length > 200
        ? demo.context.substring(0, 200) + '...'
        : demo.context
    }))

    const demosTrimmed = originalDemoCount - this.demonstrations.length
    const milestonesTrimmed = originalMilestoneCount - this.milestones.length

    console.info(
      'SkillTracker: Performed aggressive cleanup',
      {
        demonstrationsTrimmed: demosTrimmed,
        demonstrationsKept: this.demonstrations.length,
        milestonesTrimmed,
        milestonesKept: this.milestones.length
      }
    )
  }

  /**
   * Perform storage cleanup (called during retry logic)
   * Alias for aggressiveCleanup for compatibility
   */
  private performStorageCleanup(): void {
    this.aggressiveCleanup()
  }

  /**
   * Check if localStorage has sufficient space
   * Returns estimated available space in KB
   */
  private checkStorageHealth(): { available: boolean; estimatedSpaceKB: number } {
    try {
      // Try to write a test value
      const testKey = `skill_tracker_health_${Date.now()}`
      const testData = 'x'.repeat(100000) // 100KB test

      const canWrite = safeStorage.setItem(testKey, testData)
      safeStorage.removeItem(testKey)

      if (!canWrite) {
        return { available: false, estimatedSpaceKB: 0 }
      }

      // Rough estimate: if 100KB test passed, we have at least 100KB
      const currentSize = this.estimateStorageSize()
      const estimatedSpaceKB = Math.floor((5000000 - currentSize) / 1024)

      return { available: true, estimatedSpaceKB }

    } catch (error) {
      console.error('SkillTracker: Error checking storage health:', error)
      return { available: false, estimatedSpaceKB: 0 }
    }
  }

  // Helper methods
  private isMilestone(gameState: SimpleGameState): boolean {
    const count = gameState.choiceHistory?.length || 0
    return count === 1 || count % 10 === 0
  }

  private recordMilestone(gameState: SimpleGameState): void {
    this.milestones.push({
      checkpoint: this.determineCheckpoint(gameState),
      totalChoices: gameState.choiceHistory?.length || 0,
      demonstrationCount: this.demonstrations.length,
      timestamp: Date.now()
    })
  }

  private determineCheckpoint(gameState: SimpleGameState): string {
    const count = gameState.choiceHistory?.length || 0
    if (count === 1) return 'Journey Start'
    if (count === 10) return 'Early Exploration'
    if (count === 20) return 'Mid Journey'
    if (count === 30) return 'Late Journey'
    return `Choice ${count}`
  }

  private detectCharacterArc(scene: string): string {
    if (scene.includes('maya')) return 'Maya'
    if (scene.includes('devon')) return 'Devon'
    if (scene.includes('jordan')) return 'Jordan'
    if (scene.includes('samuel')) return 'Samuel'
    return 'Exploration'
  }

  private getSceneDescription(scene: string): string {
    // Use rich description from scene mapping if available
    const sceneMapping = SCENE_SKILL_MAPPINGS[scene]
    if (sceneMapping) {
      return sceneMapping.sceneDescription
    }

    // Fallback to simple formatting
    return scene.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())
  }

  private determineReadiness(score: number): 'near_ready' | 'developing' | 'exploring' {
    if (score >= 0.80) return 'near_ready'
    if (score >= 0.60) return 'developing'
    return 'exploring'
  }

  // Persistence
  private loadFromStorage(): void {
    const key = `skill_tracker_${this.userId}`
    const saved = safeStorage.getItem(key)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        this.demonstrations = data.demonstrations || []
        this.milestones = data.milestones || []
      } catch (error) {
        console.warn('Failed to load skill tracker data:', error)
      }
    }
  }

  private saveToStorage(): boolean {
    const key = `skill_tracker_${this.userId}`

    try {
      // Check estimated storage size
      const estimatedSize = this.estimateStorageSize()

      if (estimatedSize > SkillTracker.MAX_STORAGE_SIZE) {
        console.warn(
          `SkillTracker: Data size (${estimatedSize} chars) exceeds threshold, attempting cleanup`
        )
        this.aggressiveCleanup()
      }

      const data = {
        demonstrations: this.demonstrations,
        milestones: this.milestones,
        lastUpdated: Date.now()
      }

      // First attempt
      let success = safeStorage.setItem(key, JSON.stringify(data))

      if (!success) {
        console.warn(
          'SkillTracker: Initial save failed, attempting cleanup and retry',
          {
            dataSize: JSON.stringify(data).length,
            demonstrationCount: this.demonstrations.length,
            milestoneCount: this.milestones.length
          }
        )

        // Attempt cleanup
        this.performStorageCleanup()

        // Retry after cleanup
        const cleanedData = JSON.stringify({
          demonstrations: this.demonstrations,
          milestones: this.milestones,
          lastUpdated: Date.now()
        })

        success = safeStorage.setItem(key, cleanedData)

        if (success) {
          console.info(
            'SkillTracker: Save succeeded after cleanup',
            {
              dataSize: cleanedData.length,
              demonstrationCount: this.demonstrations.length
            }
          )
        } else {
          console.error(
            'SkillTracker: Save failed even after cleanup - data loss may occur',
            {
              dataSize: cleanedData.length,
              demonstrationCount: this.demonstrations.length
            }
          )
        }
      }

      return success

    } catch (error) {
      console.error('SkillTracker: Exception during save:', error)
      return false
    }
  }

  /**
   * Clear all tracking data (for reset/new journey)
   */
  clearAllData(): void {
    this.demonstrations = []
    this.milestones = []
    this.saveToStorage()
  }

  /**
   * Get raw demonstrations for debugging
   */
  getAllDemonstrations(): SkillDemonstration[] {
    return [...this.demonstrations]
  }

  /**
   * Get milestones timeline
   */
  getMilestones(): SkillMilestone[] {
    return [...this.milestones]
  }
}

// Factory function (no singleton - multiple players supported)
export function createSkillTracker(userId: string): SkillTracker {
  return new SkillTracker(userId)
}
