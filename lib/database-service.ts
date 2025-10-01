/**
 * Database Service Layer
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Abstracts database operations to support both localStorage and Supabase
 * Enables gradual migration from client-side storage to persistent database
 */

import { supabase } from './supabase'
import { getStoredPlayerData, savePlayerData } from './safe-storage'

type StorageMode = 'localStorage' | 'supabase' | 'dual-write'

/**
 * Current storage mode
 * - localStorage: Client-side only (Phase 2)
 * - dual-write: Write to both, read from localStorage (Phase 3.1)
 * - supabase: Database-first with localStorage cache (Phase 3.2+)
 */
const STORAGE_MODE: StorageMode = 'dual-write' // Phase 2 complete: Durable offline-first sync enabled

interface PlayerProfile {
  userId: string
  currentScene: string
  totalDemonstrations: number
  lastActivity: Date
}

interface SkillDemonstration {
  userId: string
  skillName: string
  sceneId: string
  choiceText: string
  context: string
  demonstratedAt: Date
}

interface CareerExploration {
  userId: string
  careerName: string
  matchScore: number
  readinessLevel: 'exploratory' | 'emerging' | 'near_ready' | 'ready'
  localOpportunities: string[]
  educationPaths: string[]
}

interface RelationshipProgress {
  userId: string
  characterName: string
  trustLevel: number
  lastInteraction: Date
  keyMoments: Array<{ scene: string; choice: string; timestamp: Date }>
}

// ============================================================================
// NORMALIZED SCHEMA INTERFACES (Migration 002)
// ============================================================================

interface PlayerPattern {
  patternName: 'helping' | 'analyzing' | 'building' | 'exploring' | 'patience' | 'rushing'
  patternValue: number // 0.00 to 1.00
  demonstrationCount: number
}

interface BehavioralProfile {
  responseSpeed?: 'deliberate' | 'moderate' | 'quick' | 'impulsive'
  stressResponse?: 'calm' | 'adaptive' | 'reactive' | 'overwhelmed'
  socialOrientation?: 'helper' | 'collaborator' | 'independent' | 'observer'
  problemApproach?: 'analytical' | 'creative' | 'practical' | 'intuitive'
  communicationStyle?: 'direct' | 'thoughtful' | 'expressive' | 'reserved'
  culturalAlignment?: number // 0.00 to 1.00
  totalChoices?: number
  avgResponseTimeMs?: number
  summaryText?: string
}

interface Choice {
  sceneId: string
  choiceId: string
  choiceText: string
  chosenAt: Date
}

interface Milestone {
  milestoneType: 'journey_start' | 'first_demonstration' | 'five_demonstrations' |
                 'ten_demonstrations' | 'fifteen_demonstrations' | 'character_trust_gained' |
                 'platform_discovered' | 'arc_completed'
  milestoneContext?: string
  reachedAt: Date
}

/**
 * Database Service
 * Provides unified interface for data operations
 */
export class DatabaseService {
  private mode: StorageMode

  constructor(mode: StorageMode = STORAGE_MODE) {
    this.mode = mode
  }

  // ============================================================================
  // PLAYER PROFILE OPERATIONS
  // ============================================================================

  async getPlayerProfile(userId: string): Promise<PlayerProfile | null> {
    if (this.mode === 'localStorage') {
      return this.getPlayerProfileFromLocalStorage(userId)
    }

    if (this.mode === 'dual-write') {
      // Read from localStorage (faster)
      return this.getPlayerProfileFromLocalStorage(userId)
    }

    // Supabase-first mode
    return this.getPlayerProfileFromSupabase(userId)
  }

  async upsertPlayerProfile(profile: PlayerProfile): Promise<void> {
    if (this.mode === 'localStorage') {
      return this.savePlayerProfileToLocalStorage(profile)
    }

    if (this.mode === 'dual-write') {
      // Write to both
      await Promise.all([
        this.savePlayerProfileToLocalStorage(profile),
        this.savePlayerProfileToSupabase(profile)
      ])
      return
    }

    // Supabase-first mode
    return this.savePlayerProfileToSupabase(profile)
  }

  // ============================================================================
  // SKILL DEMONSTRATION OPERATIONS
  // ============================================================================

  async addSkillDemonstration(demo: SkillDemonstration): Promise<void> {
    if (this.mode === 'localStorage') {
      return this.addSkillDemoToLocalStorage(demo)
    }

    if (this.mode === 'dual-write') {
      await Promise.all([
        this.addSkillDemoToLocalStorage(demo),
        this.addSkillDemoToSupabase(demo)
      ])
      return
    }

    return this.addSkillDemoToSupabase(demo)
  }

  async getSkillDemonstrations(userId: string): Promise<SkillDemonstration[]> {
    if (this.mode === 'localStorage' || this.mode === 'dual-write') {
      return this.getSkillDemosFromLocalStorage(userId)
    }

    return this.getSkillDemosFromSupabase(userId)
  }

  // ============================================================================
  // CAREER EXPLORATION OPERATIONS
  // ============================================================================

  async addCareerExploration(exploration: CareerExploration): Promise<void> {
    if (this.mode === 'localStorage') {
      return this.addCareerToLocalStorage(exploration)
    }

    if (this.mode === 'dual-write') {
      await Promise.all([
        this.addCareerToLocalStorage(exploration),
        this.addCareerToSupabase(exploration)
      ])
      return
    }

    return this.addCareerToSupabase(exploration)
  }

  // ============================================================================
  // RELATIONSHIP PROGRESS OPERATIONS
  // ============================================================================

  async updateRelationship(relationship: RelationshipProgress): Promise<void> {
    if (this.mode === 'localStorage') {
      return this.updateRelationshipInLocalStorage(relationship)
    }

    if (this.mode === 'dual-write') {
      await Promise.all([
        this.updateRelationshipInLocalStorage(relationship),
        this.updateRelationshipInSupabase(relationship)
      ])
      return
    }

    return this.updateRelationshipInSupabase(relationship)
  }

  // ============================================================================
  // GAME PROGRESS OPERATIONS (Migration 002 - Normalized Schema)
  // ============================================================================

  async recordSceneVisit(userId: string, sceneId: string): Promise<void> {
    if (this.mode === 'localStorage') {
      return this.recordSceneVisitToLocalStorage(userId, sceneId)
    }

    if (this.mode === 'dual-write') {
      await Promise.all([
        this.recordSceneVisitToLocalStorage(userId, sceneId),
        this.recordSceneVisitToSupabase(userId, sceneId)
      ])
      return
    }

    return this.recordSceneVisitToSupabase(userId, sceneId)
  }

  async recordChoice(userId: string, sceneId: string, choiceId: string, choiceText: string): Promise<void> {
    if (this.mode === 'localStorage') {
      return this.recordChoiceToLocalStorage(userId, sceneId, choiceId, choiceText)
    }

    if (this.mode === 'dual-write') {
      await Promise.all([
        this.recordChoiceToLocalStorage(userId, sceneId, choiceId, choiceText),
        this.recordChoiceToSupabase(userId, sceneId, choiceId, choiceText)
      ])
      return
    }

    return this.recordChoiceToSupabase(userId, sceneId, choiceId, choiceText)
  }

  async getVisitedScenes(userId: string): Promise<string[]> {
    if (this.mode === 'localStorage' || this.mode === 'dual-write') {
      return this.getVisitedScenesFromLocalStorage(userId)
    }

    return this.getVisitedScenesFromSupabase(userId)
  }

  async getChoiceHistory(userId: string): Promise<Choice[]> {
    if (this.mode === 'localStorage' || this.mode === 'dual-write') {
      return this.getChoiceHistoryFromLocalStorage(userId)
    }

    return this.getChoiceHistoryFromSupabase(userId)
  }

  // ============================================================================
  // PATTERN OPERATIONS (Migration 002)
  // ============================================================================

  async updatePlayerPattern(userId: string, patternName: PlayerPattern['patternName'], value: number, demonstrationCount: number = 0): Promise<void> {
    if (this.mode === 'localStorage') {
      return this.updatePatternInLocalStorage(userId, patternName, value, demonstrationCount)
    }

    if (this.mode === 'dual-write') {
      await Promise.all([
        this.updatePatternInLocalStorage(userId, patternName, value, demonstrationCount),
        this.updatePatternInSupabase(userId, patternName, value, demonstrationCount)
      ])
      return
    }

    return this.updatePatternInSupabase(userId, patternName, value, demonstrationCount)
  }

  async getPlayerPatterns(userId: string): Promise<Record<string, number>> {
    if (this.mode === 'localStorage' || this.mode === 'dual-write') {
      return this.getPatternsFromLocalStorage(userId)
    }

    return this.getPatternsFromSupabase(userId)
  }

  // ============================================================================
  // BEHAVIORAL PROFILE OPERATIONS (Migration 002)
  // ============================================================================

  async updateBehavioralProfile(userId: string, profile: BehavioralProfile): Promise<void> {
    if (this.mode === 'localStorage') {
      return this.updateBehavioralProfileInLocalStorage(userId, profile)
    }

    if (this.mode === 'dual-write') {
      await Promise.all([
        this.updateBehavioralProfileInLocalStorage(userId, profile),
        this.updateBehavioralProfileInSupabase(userId, profile)
      ])
      return
    }

    return this.updateBehavioralProfileInSupabase(userId, profile)
  }

  async getBehavioralProfile(userId: string): Promise<BehavioralProfile | null> {
    if (this.mode === 'localStorage' || this.mode === 'dual-write') {
      return this.getBehavioralProfileFromLocalStorage(userId)
    }

    return this.getBehavioralProfileFromSupabase(userId)
  }

  // ============================================================================
  // MILESTONE OPERATIONS (Migration 002)
  // ============================================================================

  async recordMilestone(userId: string, milestoneType: Milestone['milestoneType'], context?: string): Promise<void> {
    if (this.mode === 'localStorage') {
      return this.recordMilestoneToLocalStorage(userId, milestoneType, context)
    }

    if (this.mode === 'dual-write') {
      await Promise.all([
        this.recordMilestoneToLocalStorage(userId, milestoneType, context),
        this.recordMilestoneToSupabase(userId, milestoneType, context)
      ])
      return
    }

    return this.recordMilestoneToSupabase(userId, milestoneType, context)
  }

  async getMilestones(userId: string): Promise<Milestone[]> {
    if (this.mode === 'localStorage' || this.mode === 'dual-write') {
      return this.getMilestonesFromLocalStorage(userId)
    }

    return this.getMilestonesFromSupabase(userId)
  }

  // ============================================================================
  // LOCALSTORAGE IMPLEMENTATIONS
  // ============================================================================

  private getPlayerProfileFromLocalStorage(userId: string): PlayerProfile | null {
    const data = getStoredPlayerData(userId)
    if (!data) return null

    return {
      userId,
      currentScene: data.currentScene || '',
      totalDemonstrations: data.totalDemonstrations || 0,
      lastActivity: new Date(data.lastActivity || Date.now())
    }
  }

  private savePlayerProfileToLocalStorage(profile: PlayerProfile): void {
    const existingData = getStoredPlayerData(profile.userId) || {}
    savePlayerData(profile.userId, {
      ...existingData,
      currentScene: profile.currentScene,
      totalDemonstrations: profile.totalDemonstrations,
      lastActivity: profile.lastActivity.toISOString()
    })
  }

  private addSkillDemoToLocalStorage(demo: SkillDemonstration): void {
    const data = getStoredPlayerData(demo.userId) || {}
    const demonstrations = data.skillDemonstrations || []

    demonstrations.push({
      skill: demo.skillName,
      scene: demo.sceneId,
      choice: demo.choiceText,
      context: demo.context,
      timestamp: demo.demonstratedAt.toISOString()
    })

    savePlayerData(demo.userId, {
      ...data,
      skillDemonstrations: demonstrations
    })
  }

  private getSkillDemosFromLocalStorage(userId: string): SkillDemonstration[] {
    const data = getStoredPlayerData(userId)
    if (!data?.skillDemonstrations) return []

    return data.skillDemonstrations.map((demo: any) => ({
      userId,
      skillName: demo.skill,
      sceneId: demo.scene,
      choiceText: demo.choice,
      context: demo.context,
      demonstratedAt: new Date(demo.timestamp)
    }))
  }

  private addCareerToLocalStorage(exploration: CareerExploration): void {
    const data = getStoredPlayerData(exploration.userId) || {}
    const careers = data.careerExplorations || []

    careers.push({
      name: exploration.careerName,
      matchScore: exploration.matchScore,
      readiness: exploration.readinessLevel,
      localOpportunities: exploration.localOpportunities,
      educationPaths: exploration.educationPaths,
      exploredAt: new Date().toISOString()
    })

    savePlayerData(exploration.userId, {
      ...data,
      careerExplorations: careers
    })
  }

  private updateRelationshipInLocalStorage(relationship: RelationshipProgress): void {
    const data = getStoredPlayerData(relationship.userId) || {}
    const relationships = data.relationships || {}

    relationships[relationship.characterName] = {
      trust: relationship.trustLevel,
      lastInteraction: relationship.lastInteraction.toISOString(),
      keyMoments: relationship.keyMoments
    }

    savePlayerData(relationship.userId, {
      ...data,
      relationships
    })
  }

  // ============================================================================
  // NORMALIZED SCHEMA - LOCALSTORAGE IMPLEMENTATIONS (Migration 002)
  // ============================================================================

  private recordSceneVisitToLocalStorage(userId: string, sceneId: string): void {
    const data = getStoredPlayerData(userId) || {}
    const visitedScenes = new Set<string>(data.visitedScenes || [])
    visitedScenes.add(sceneId)

    savePlayerData(userId, {
      ...data,
      visitedScenes: Array.from(visitedScenes)
    })
  }

  private recordChoiceToLocalStorage(userId: string, sceneId: string, choiceId: string, choiceText: string): void {
    const data = getStoredPlayerData(userId) || {}
    const choiceHistory = data.choiceHistory || []

    choiceHistory.push({
      sceneId,
      choiceId,
      choiceText,
      chosenAt: new Date().toISOString()
    })

    savePlayerData(userId, {
      ...data,
      choiceHistory
    })
  }

  private getVisitedScenesFromLocalStorage(userId: string): string[] {
    const data = getStoredPlayerData(userId)
    return data?.visitedScenes || []
  }

  private getChoiceHistoryFromLocalStorage(userId: string): Choice[] {
    const data = getStoredPlayerData(userId)
    if (!data?.choiceHistory) return []

    return data.choiceHistory
      .map((choice: any) => ({
        sceneId: choice.sceneId,
        choiceId: choice.choiceId,
        choiceText: choice.choiceText,
        chosenAt: new Date(choice.chosenAt)
      }))
      .sort((a, b) => b.chosenAt.getTime() - a.chosenAt.getTime()) // DESC order (newest first)
  }

  private updatePatternInLocalStorage(userId: string, patternName: string, value: number, demonstrationCount: number): void {
    const data = getStoredPlayerData(userId) || {}
    const patterns = data.patterns || {}

    patterns[patternName] = {
      value,
      demonstrationCount,
      updatedAt: new Date().toISOString()
    }

    savePlayerData(userId, {
      ...data,
      patterns
    })
  }

  private getPatternsFromLocalStorage(userId: string): Record<string, number> {
    const data = getStoredPlayerData(userId)
    if (!data?.patterns) return {}

    const result: Record<string, number> = {}
    for (const [key, pattern] of Object.entries(data.patterns)) {
      result[key] = (pattern as any).value
    }
    return result
  }

  private updateBehavioralProfileInLocalStorage(userId: string, profile: BehavioralProfile): void {
    const data = getStoredPlayerData(userId) || {}

    savePlayerData(userId, {
      ...data,
      behavioralProfile: {
        ...profile,
        updatedAt: new Date().toISOString()
      }
    })
  }

  private getBehavioralProfileFromLocalStorage(userId: string): BehavioralProfile | null {
    const data = getStoredPlayerData(userId)
    return data?.behavioralProfile || null
  }

  private recordMilestoneToLocalStorage(userId: string, milestoneType: string, context?: string): void {
    const data = getStoredPlayerData(userId) || {}
    const milestones = data.milestones || []

    milestones.push({
      milestoneType,
      milestoneContext: context,
      reachedAt: new Date().toISOString()
    })

    savePlayerData(userId, {
      ...data,
      milestones
    })
  }

  private getMilestonesFromLocalStorage(userId: string): Milestone[] {
    const data = getStoredPlayerData(userId)
    if (!data?.milestones) return []

    return data.milestones
      .map((milestone: any) => ({
        milestoneType: milestone.milestoneType,
        milestoneContext: milestone.milestoneContext,
        reachedAt: new Date(milestone.reachedAt)
      }))
      .sort((a, b) => b.reachedAt.getTime() - a.reachedAt.getTime()) // DESC order (newest first)
  }

  // ============================================================================
  // SUPABASE IMPLEMENTATIONS
  // ============================================================================

  private async getPlayerProfileFromSupabase(userId: string): Promise<PlayerProfile | null> {
    const { data, error } = await supabase
      .from('player_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('[DatabaseService] Error fetching player profile:', error)
      return null
    }

    if (!data) return null

    return {
      userId: data.user_id,
      currentScene: data.current_scene,
      totalDemonstrations: data.total_demonstrations,
      lastActivity: new Date(data.last_activity)
    }
  }

  private async savePlayerProfileToSupabase(profile: PlayerProfile): Promise<void> {
    const { error } = await supabase
      .from('player_profiles')
      .upsert({
        user_id: profile.userId,
        current_scene: profile.currentScene,
        total_demonstrations: profile.totalDemonstrations,
        last_activity: profile.lastActivity.toISOString()
      })

    if (error) {
      console.error('[DatabaseService] Error saving player profile:', error)
      throw error
    }
  }

  private async addSkillDemoToSupabase(demo: SkillDemonstration): Promise<void> {
    const { error } = await supabase
      .from('skill_demonstrations')
      .insert({
        user_id: demo.userId,
        skill_name: demo.skillName,
        scene_id: demo.sceneId,
        choice_text: demo.choiceText,
        context: demo.context,
        demonstrated_at: demo.demonstratedAt.toISOString()
      })

    if (error) {
      console.error('[DatabaseService] Error adding skill demonstration:', error)
      throw error
    }
  }

  private async getSkillDemosFromSupabase(userId: string): Promise<SkillDemonstration[]> {
    const { data, error } = await supabase
      .from('skill_demonstrations')
      .select('*')
      .eq('user_id', userId)
      .order('demonstrated_at', { ascending: false })

    if (error) {
      console.error('[DatabaseService] Error fetching skill demonstrations:', error)
      return []
    }

    return data.map(demo => ({
      userId: demo.user_id,
      skillName: demo.skill_name,
      sceneId: demo.scene_id,
      choiceText: demo.choice_text,
      context: demo.context,
      demonstratedAt: new Date(demo.demonstrated_at)
    }))
  }

  private async addCareerToSupabase(exploration: CareerExploration): Promise<void> {
    const { error } = await supabase
      .from('career_explorations')
      .upsert({
        user_id: exploration.userId,
        career_name: exploration.careerName,
        match_score: exploration.matchScore,
        readiness_level: exploration.readinessLevel,
        local_opportunities: exploration.localOpportunities,
        education_paths: exploration.educationPaths
      })

    if (error) {
      console.error('[DatabaseService] Error adding career exploration:', error)
      throw error
    }
  }

  private async updateRelationshipInSupabase(relationship: RelationshipProgress): Promise<void> {
    const { error } = await supabase
      .from('relationship_progress')
      .upsert({
        user_id: relationship.userId,
        character_name: relationship.characterName,
        trust_level: relationship.trustLevel,
        last_interaction: relationship.lastInteraction.toISOString(),
        key_moments: relationship.keyMoments
      })

    if (error) {
      console.error('[DatabaseService] Error updating relationship:', error)
      throw error
    }
  }

  // ============================================================================
  // NORMALIZED SCHEMA - SUPABASE IMPLEMENTATIONS (Migration 002)
  // ============================================================================

  private async recordSceneVisitToSupabase(userId: string, sceneId: string): Promise<void> {
    const { error } = await supabase
      .from('visited_scenes')
      .upsert({
        player_id: userId,
        scene_id: sceneId,
        visited_at: new Date().toISOString()
      }, {
        onConflict: 'player_id,scene_id',
        ignoreDuplicates: true
      })

    if (error) {
      console.error('[DatabaseService] Error recording scene visit:', error)
      throw error
    }
  }

  private async recordChoiceToSupabase(userId: string, sceneId: string, choiceId: string, choiceText: string): Promise<void> {
    const { error } = await supabase
      .from('choice_history')
      .insert({
        player_id: userId,
        scene_id: sceneId,
        choice_id: choiceId,
        choice_text: choiceText,
        chosen_at: new Date().toISOString()
      })

    if (error) {
      console.error('[DatabaseService] Error recording choice:', error)
      throw error
    }
  }

  private async getVisitedScenesFromSupabase(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('visited_scenes')
      .select('scene_id')
      .eq('player_id', userId)

    if (error) {
      console.error('[DatabaseService] Error fetching visited scenes:', error)
      return []
    }

    return data.map(row => row.scene_id)
  }

  private async getChoiceHistoryFromSupabase(userId: string): Promise<Choice[]> {
    const { data, error } = await supabase
      .from('choice_history')
      .select('scene_id, choice_id, choice_text, chosen_at')
      .eq('player_id', userId)
      .order('chosen_at', { ascending: false })

    if (error) {
      console.error('[DatabaseService] Error fetching choice history:', error)
      return []
    }

    return data.map(row => ({
      sceneId: row.scene_id,
      choiceId: row.choice_id,
      choiceText: row.choice_text,
      chosenAt: new Date(row.chosen_at)
    }))
  }

  private async updatePatternInSupabase(userId: string, patternName: string, value: number, demonstrationCount: number): Promise<void> {
    const { error } = await supabase
      .from('player_patterns')
      .upsert({
        player_id: userId,
        pattern_name: patternName,
        pattern_value: value,
        demonstration_count: demonstrationCount,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'player_id,pattern_name'
      })

    if (error) {
      console.error('[DatabaseService] Error updating player pattern:', error)
      throw error
    }
  }

  private async getPatternsFromSupabase(userId: string): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from('player_patterns')
      .select('pattern_name, pattern_value')
      .eq('player_id', userId)

    if (error) {
      console.error('[DatabaseService] Error fetching player patterns:', error)
      return {}
    }

    const result: Record<string, number> = {}
    for (const row of data) {
      result[row.pattern_name] = row.pattern_value
    }
    return result
  }

  private async updateBehavioralProfileInSupabase(userId: string, profile: BehavioralProfile): Promise<void> {
    const { error } = await supabase
      .from('player_behavioral_profiles')
      .upsert({
        player_id: userId,
        response_speed: profile.responseSpeed,
        stress_response: profile.stressResponse,
        social_orientation: profile.socialOrientation,
        problem_approach: profile.problemApproach,
        communication_style: profile.communicationStyle,
        cultural_alignment: profile.culturalAlignment,
        total_choices: profile.totalChoices,
        avg_response_time_ms: profile.avgResponseTimeMs,
        summary_text: profile.summaryText,
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('[DatabaseService] Error updating behavioral profile:', error)
      throw error
    }
  }

  private async getBehavioralProfileFromSupabase(userId: string): Promise<BehavioralProfile | null> {
    const { data, error } = await supabase
      .from('player_behavioral_profiles')
      .select('*')
      .eq('player_id', userId)
      .single()

    if (error) {
      console.error('[DatabaseService] Error fetching behavioral profile:', error)
      return null
    }

    if (!data) return null

    return {
      responseSpeed: data.response_speed,
      stressResponse: data.stress_response,
      socialOrientation: data.social_orientation,
      problemApproach: data.problem_approach,
      communicationStyle: data.communication_style,
      culturalAlignment: data.cultural_alignment,
      totalChoices: data.total_choices,
      avgResponseTimeMs: data.avg_response_time_ms,
      summaryText: data.summary_text
    }
  }

  private async recordMilestoneToSupabase(userId: string, milestoneType: string, context?: string): Promise<void> {
    const { error } = await supabase
      .from('skill_milestones')
      .insert({
        player_id: userId,
        milestone_type: milestoneType,
        milestone_context: context,
        reached_at: new Date().toISOString()
      })

    if (error) {
      console.error('[DatabaseService] Error recording milestone:', error)
      throw error
    }
  }

  private async getMilestonesFromSupabase(userId: string): Promise<Milestone[]> {
    const { data, error } = await supabase
      .from('skill_milestones')
      .select('milestone_type, milestone_context, reached_at')
      .eq('player_id', userId)
      .order('reached_at', { ascending: false })

    if (error) {
      console.error('[DatabaseService] Error fetching milestones:', error)
      return []
    }

    return data.map(row => ({
      milestoneType: row.milestone_type,
      milestoneContext: row.milestone_context,
      reachedAt: new Date(row.reached_at)
    }))
  }
}

// Export singleton instance
export const db = new DatabaseService()
