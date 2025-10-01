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
const STORAGE_MODE: StorageMode = 'localStorage' // TODO: Make configurable

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
}

// Export singleton instance
export const db = new DatabaseService()
