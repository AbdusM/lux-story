import { logger } from '@/lib/logger'
/**
 * Grand Central Terminus - State Management System
 * Tracks platform states, relationships, patterns, and mysteries
 */

export interface GrandCentralState {
  // Platform states - warmth affects accessibility and appearance
  platforms: {
    p1: PlatformState  // Service & Impact (healthcare, counseling, helping professions)
    p3: PlatformState  // Systems & Operations (building, logistics, process optimization)
    p7: PlatformState  // Information & Analysis (data science, security, research)
    p9: PlatformState  // Emerging & Growth (green energy, new fields, patient development)
    forgotten: PlatformState  // Hybrid & Innovation (cross-disciplinary, new combinations)
  }
  
  // Character relationships affect dialogue and story branches
  relationships: {
    samuel: RelationshipState
    maya: RelationshipState
    devon: RelationshipState
    jordan: RelationshipState
    marcus: RelationshipState
  }
  
  // Behavioral patterns determine career affinity
  patterns: {
    helping: number      // Care, service orientation
    building: number     // Creation, engineering
    analyzing: number    // Data, research, systems
    exploring: number    // Curiosity, experimentation
    patience: number     // Contemplation, growth
    rushing: number      // Anxiety, impatience
    independence: number // Self-direction, rebellion
  }
  
  // Career values - deeper motivational tracking
  careerValues: {
    directImpact: number     // Helping people directly, immediate service
    systemsThinking: number  // Optimizing how things work, process improvement
    dataInsights: number     // Finding patterns, security, research
    futureBuilding: number   // Emerging fields, growth sectors, innovation
    independence: number     // Creating new approaches, hybrid careers
  }
  
  // Time mechanics
  time: {
    current: string     // Current time display
    minutes: number     // Minutes until midnight (starts at 13)
    speed: number       // Time flow rate (1.0 normal, <1 slower, 0 stopped)
    stopped: boolean    // Quiet Hour active
  }
  
  // Story mysteries to uncover
  mysteries: {
    letter_sender: 'unknown' | 'investigating' | 'trusted' | 'rejected' | 'samuel_knows' | 'self_revealed'
    platform_seven: 'stable' | 'flickering' | 'error' | 'denied' | 'revealed'
    samuels_past: 'hidden' | 'hinted' | 'revealed'
    station_nature: 'unknown' | 'sensing' | 'understanding' | 'mastered'
  }
  
  // Player inventory/states
  items: {
    letter: 'kept' | 'torn' | 'shown' | 'burned'
    safe_spot?: string  // Location that becomes safe haven
    discovered_paths: string[]  // Platforms discovered
  }
  
  // Quiet Hour mechanics
  quiet_hour: {
    potential: boolean  // Can trigger
    experienced: string[]  // Which quiet hours seen
    triggered_by?: string  // What caused current quiet hour
  }
}

interface PlatformState {
  warmth: number        // -5 to 5, affects visual and accessibility
  accessible: boolean   // Can player access this platform
  discovered: boolean   // Has player found this platform
  resonance: number    // 0-10, how aligned with player patterns
}

interface RelationshipState {
  trust: number         // -5 to 10
  met: boolean         // Have you encountered them
  helped: boolean      // Did you help them
  knows_name: boolean  // Do they know who you are
  influenced_path: boolean  // Did you change their trajectory
  shared_story: boolean  // Did they reveal their background
}

export class GrandCentralStateManager {
  private state: GrandCentralState
  private readonly STORAGE_KEY = 'grand-central-state'
  
  constructor() {
    this.state = this.loadState() || this.getInitialState()
  }
  
  private getInitialState(): GrandCentralState {
    return {
      platforms: {
        p1: { warmth: 0, accessible: true, discovered: false, resonance: 0 },
        p3: { warmth: 0, accessible: true, discovered: false, resonance: 0 },
        p7: { warmth: 0, accessible: true, discovered: false, resonance: 0 },
        p9: { warmth: 0, accessible: true, discovered: false, resonance: 0 },
        forgotten: { warmth: 0, accessible: false, discovered: false, resonance: 0 }
      },
      relationships: {
        samuel: { trust: 0, met: false, helped: false, knows_name: false, influenced_path: false, shared_story: false },
        maya: { trust: 0, met: false, helped: false, knows_name: false, influenced_path: false, shared_story: false },
        devon: { trust: 0, met: false, helped: false, knows_name: false, influenced_path: false, shared_story: false },
        jordan: { trust: 0, met: false, helped: false, knows_name: false, influenced_path: false, shared_story: false },
        marcus: { trust: 0, met: false, helped: false, knows_name: false, influenced_path: false, shared_story: false }
      },
      patterns: {
        helping: 0,
        building: 0,
        analyzing: 0,
        exploring: 0,
        patience: 0,
        rushing: 0,
        independence: 0
      },
      careerValues: {
        directImpact: 0,
        systemsThinking: 0,
        dataInsights: 0,
        futureBuilding: 0,
        independence: 0
      },
      time: {
        current: "11:47 PM",
        minutes: 13,
        speed: 1.0,
        stopped: false
      },
      mysteries: {
        letter_sender: 'unknown',
        platform_seven: 'flickering',
        samuels_past: 'hidden',
        station_nature: 'unknown'
      },
      items: {
        letter: 'kept',
        discovered_paths: []
      },
      quiet_hour: {
        potential: false,
        experienced: []
      }
    }
  }
  
  /**
   * Apply state changes from a choice
   */
  applyChoiceEffects(changes: any): void {
    // Update time
    if (changes.time !== undefined) {
      if (changes.time === 'slowing') {
        this.state.time.speed *= 0.5
      } else if (typeof changes.time === 'number') {
        this.state.time.minutes += changes.time
        this.updateTimeDisplay()
      }
    }
    
    // Update patterns
    if (changes.patterns) {
      Object.entries(changes.patterns).forEach(([pattern, value]) => {
        if (pattern in this.state.patterns) {
          this.state.patterns[pattern as keyof typeof this.state.patterns] += value as number
        }
      })
    }
    
    // Update career values
    if (changes.careerValues) {
      Object.entries(changes.careerValues).forEach(([value, amount]) => {
        if (value in this.state.careerValues) {
          this.state.careerValues[value as keyof typeof this.state.careerValues] += amount as number
        }
      })
    }
    
    // Update relationships
    if (changes.relationships) {
      this.updateRelationships(changes.relationships)
    }
    
    // Update platforms
    if (changes.platforms) {
      this.updatePlatforms(changes.platforms)
    }
    
    // Update mysteries
    if (changes.mysteries) {
      Object.entries(changes.mysteries).forEach(([mystery, value]) => {
        if (mystery in this.state.mysteries) {
          (this.state.mysteries as any)[mystery] = value
        }
      })
    }
    
    // Update items
    if (changes.items) {
      Object.entries(changes.items).forEach(([item, value]) => {
        (this.state.items as any)[item] = value
      })
    }
    
    // Check for quiet hour trigger
    this.checkQuietHourTrigger()
    
    // Update platform resonance based on patterns
    this.updatePlatformResonance()
    
    // Save state
    this.saveState()
  }
  
  private updateTimeDisplay(): void {
    const totalMinutes = 47 + (13 - this.state.time.minutes)
    const hours = Math.floor(totalMinutes / 60) % 12 || 12
    const minutes = totalMinutes % 60
    this.state.time.current = `${hours}:${minutes.toString().padStart(2, '0')} PM`
  }
  
  private updateRelationships(changes: any): void {
    Object.entries(changes).forEach(([character, updates]) => {
      if (character in this.state.relationships && typeof updates === 'object' && updates !== null) {
        const relationship = this.state.relationships[character as keyof typeof this.state.relationships]
        Object.entries(updates as Record<string, any>).forEach(([key, value]) => {
          (relationship as any)[key] = value
        })
        // Meeting someone always sets met to true
        if ((updates as any).trust !== undefined && (updates as any).trust > 0) {
          relationship.met = true
        }
      }
    })
  }
  
  private updatePlatforms(changes: any): void {
    Object.entries(changes).forEach(([platform, updates]) => {
      if (platform in this.state.platforms && typeof updates === 'object' && updates !== null) {
        const plat = this.state.platforms[platform as keyof typeof this.state.platforms]
        Object.entries(updates as Record<string, any>).forEach(([key, value]) => {
          (plat as any)[key] = value
        })
        // Warmth affects accessibility
        if (plat.warmth < -3) {
          plat.accessible = false
        } else if (plat.warmth > 3) {
          plat.accessible = true
          plat.discovered = true
        }
      }
    })
  }
  
  private updatePlatformResonance(): void {
    // Platform 1 (Service & Impact) - directImpact + helping patterns
    this.state.platforms.p1.resonance = 
      (this.state.careerValues.directImpact * 1.5 + this.state.patterns.helping * 2 + this.state.patterns.patience) / 4.5
    
    // Platform 3 (Systems & Operations) - systemsThinking + building patterns  
    this.state.platforms.p3.resonance = 
      (this.state.careerValues.systemsThinking * 1.5 + this.state.patterns.building * 2 + this.state.patterns.analyzing) / 4.5
    
    // Platform 7 (Information & Analysis) - dataInsights + analyzing patterns
    this.state.platforms.p7.resonance = 
      (this.state.careerValues.dataInsights * 1.5 + this.state.patterns.analyzing * 2 + this.state.patterns.exploring) / 4.5
    
    // Platform 9 (Emerging & Growth) - futureBuilding + patience patterns
    this.state.platforms.p9.resonance = 
      (this.state.careerValues.futureBuilding * 1.5 + this.state.patterns.patience * 2 + this.state.patterns.helping) / 4.5
    
    // Forgotten Platform (Hybrid & Innovation) - independence value + independence patterns
    this.state.platforms.forgotten.resonance = 
      (this.state.careerValues.independence * 1.5 + this.state.patterns.independence * 2 + this.state.patterns.exploring) / 4.5
  }
  
  private checkQuietHourTrigger(): void {
    // Quiet Hour triggers if:
    // - High patience (>8) and low rushing (<2) - increased threshold
    // - Helped 5+ people - increased threshold
    // - Discovered 4+ platforms - increased threshold
    // - Sitting in contemplation with potential = true
    
    const highPatience = this.state.patterns.patience > 8 && this.state.patterns.rushing < 2
    const helpedMany = this.state.patterns.helping > 6
    const explored = this.state.items.discovered_paths.length >= 4
    
    // Only trigger if explicitly set to potential AND very high thresholds
    if (this.state.quiet_hour.potential && (highPatience || helpedMany || explored)) {
      // Actually trigger if conditions are very strong - much higher bar
      if (highPatience && helpedMany && this.state.patterns.patience > 10) {
        this.triggerQuietHour('compassionate_patience')
      } else if (explored && this.state.patterns.patience > 8 && helpedMany) {
        this.triggerQuietHour('patient_exploration')
      }
    }
  }
  
  private triggerQuietHour(trigger: string): void {
    this.state.time.stopped = true
    this.state.time.speed = 0
    this.state.quiet_hour.triggered_by = trigger
    // Time display shows something special
    this.state.time.current = "TIME HOLDS ITS BREATH"
  }
  
  /**
   * Get narrative variations based on state
   */
  getSceneVariation(baseScene: string): string {
    // Return different text based on relationships, platform states, etc.
    // This allows the same scene to have different content based on prior choices
    
    // Example: If Samuel trusts you highly, his dialogue changes
    if (this.state.relationships.samuel.trust > 5) {
      return `${baseScene}_high_trust`
    }
    
    // Example: If Platform 7 is inaccessible, describe it differently
    if (!this.state.platforms.p7.accessible) {
      return `${baseScene}_locked`
    }
    
    return baseScene
  }
  
  /**
   * Calculate dominant career value for Chapter 2 branching
   */
  getDominantCareerValue(): string {
    const values = this.state.careerValues
    const maxValue = Math.max(...Object.values(values))
    
    // Find the career value with highest score
    for (const [key, value] of Object.entries(values)) {
      if (value === maxValue && maxValue > 2) {
        return key
      }
    }
    
    return 'balanced'
  }
  
  /**
   * Calculate which ending the player is heading toward
   */
  calculateEndingPath(): string {
    const patterns = this.state.patterns
    const values = this.state.careerValues
    
    // Service Guide: High directImpact + helping patterns
    if (values.directImpact > 6 && patterns.helping > 8) {
      return 'service_guide'
    }
    
    // Systems Builder: High systemsThinking + building patterns
    if (values.systemsThinking > 6 && patterns.building > 8) {
      return 'systems_builder'
    }
    
    // Data Analyst: High dataInsights + analyzing patterns
    if (values.dataInsights > 6 && patterns.analyzing > 8) {
      return 'data_analyst'
    }
    
    // Future Pioneer: High futureBuilding + exploring patterns
    if (values.futureBuilding > 6 && patterns.exploring > 7) {
      return 'future_pioneer'
    }
    
    // Independent Creator: High independence value + patterns
    if (values.independence > 6 && patterns.independence > 7) {
      return 'independent_creator'
    }
    
    // Balanced Explorer: Moderate scores across multiple areas
    const avgValues = Object.values(values).reduce((a, b) => a + b, 0) / 5
    if (avgValues > 3 && Math.max(...Object.values(values)) - Math.min(...Object.values(values)) < 4) {
      return 'balanced_explorer'
    }
    
    return 'undetermined'
  }
  
  private loadState(): GrandCentralState | null {
    if (typeof window === 'undefined') return null
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY)
      if (!saved) return null
      
      const loadedState = JSON.parse(saved)
      
      // Migration: ensure careerValues exists (for backwards compatibility)
      if (!loadedState.careerValues) {
        logger.debug('🔧 Migrating state: adding missing careerValues')
        loadedState.careerValues = {
          directImpact: 0,
          systemsThinking: 0,
          dataInsights: 0,
          futureBuilding: 0,
          independence: 0
        }
      }
      
      return loadedState
    } catch {
      return null
    }
  }
  
  private saveState(): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state))
    } catch (error) {
      logger.warn('Failed to save state:', error)
    }
  }
  
  getState(): GrandCentralState {
    return this.state
  }
  
  reset(): void {
    this.state = this.getInitialState()
    this.saveState()
  }
}

// Singleton instance
let instance: GrandCentralStateManager | null = null

export function getGrandCentralState(): GrandCentralStateManager {
  if (!instance) {
    instance = new GrandCentralStateManager()
  }
  return instance
}