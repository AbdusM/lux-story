/**
 * Unified Data Schemas
 * Normalized data structures for relationships, platforms, patterns, and game state
 */

// Base entity interface
export interface BaseEntity {
  id: string
  createdAt: number
  updatedAt: number
  version: number
}

// Character relationship schema
export interface CharacterRelationship extends BaseEntity {
  characterId: string
  playerId: string
  trust: number // 0-1
  respect: number // 0-1
  affinity: number // 0-1
  interactionCount: number
  lastInteraction: number
  relationshipType: 'neutral' | 'friendly' | 'adversarial' | 'mentor' | 'peer'
  tags: string[]
  notes: string[]
}

// Platform relationship schema
export interface PlatformRelationship extends BaseEntity {
  platformId: string
  playerId: string
  warmth: number // 0-1
  accessibility: number // 0-1
  familiarity: number // 0-1
  visitCount: number
  lastVisit: number
  platformType: 'career' | 'education' | 'social' | 'creative' | 'technical'
  tags: string[]
  notes: string[]
}

// Choice pattern schema
export interface ChoicePattern extends BaseEntity {
  patternId: string
  playerId: string
  patternType: 'emotional' | 'cognitive' | 'social' | 'creative' | 'analytical'
  frequency: number
  strength: number // 0-1
  lastUsed: number
  context: string[]
  outcomes: {
    positive: number
    negative: number
    neutral: number
  }
  tags: string[]
}

// Scene interaction schema
export interface SceneInteraction extends BaseEntity {
  sceneId: string
  playerId: string
  choiceId: string | null
  responseTime: number
  emotionalState: string
  cognitiveState: string
  outcome: 'positive' | 'negative' | 'neutral'
  timestamp: number
  context: Record<string, unknown>
}

// Skill development schema
export interface SkillDevelopment extends BaseEntity {
  skillId: string
  playerId: string
  currentLevel: number // 0-1
  targetLevel: number // 0-1
  progressRate: number // 0-1
  lastPracticed: number
  practiceCount: number
  skillCategory: 'communication' | 'technical' | 'creative' | 'analytical' | 'social'
  dependencies: string[]
  prerequisites: string[]
}

// Game session schema
export interface GameSession extends BaseEntity {
  sessionId: string
  playerId: string
  startTime: number
  endTime: number | null
  totalChoices: number
  scenesVisited: string[]
  skillsPracticed: string[]
  relationshipsChanged: string[]
  patternsIdentified: string[]
  performanceMetrics: {
    averageResponseTime: number
    rapidClicks: number
    hesitationCount: number
    flowState: string
  }
  context: Record<string, unknown>
}

// Normalized data store interface
export interface NormalizedDataStore {
  // Entities
  characters: Record<string, CharacterRelationship>
  platforms: Record<string, PlatformRelationship>
  patterns: Record<string, ChoicePattern>
  interactions: Record<string, SceneInteraction>
  skills: Record<string, SkillDevelopment>
  sessions: Record<string, GameSession>
  
  // Metadata
  lastUpdated: number
  version: string
  playerId: string
}

// Data normalization utilities
export class DataNormalizer {
  private store: NormalizedDataStore

  constructor(initialData?: Partial<NormalizedDataStore>) {
    this.store = {
      characters: {},
      platforms: {},
      patterns: {},
      interactions: {},
      skills: {},
      sessions: {},
      lastUpdated: Date.now(),
      version: '1.0.0',
      playerId: 'default',
      ...initialData
    }
  }

  // Character relationship methods
  updateCharacterRelationship(characterId: string, updates: Partial<CharacterRelationship>): CharacterRelationship {
    const existing = this.store.characters[characterId]
    const now = Date.now()
    
    const updated: CharacterRelationship = {
      id: characterId,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      version: (existing?.version || 0) + 1,
      characterId,
      playerId: this.store.playerId,
      trust: existing?.trust || 0,
      respect: existing?.respect || 0,
      affinity: existing?.affinity || 0,
      interactionCount: existing?.interactionCount || 0,
      lastInteraction: existing?.lastInteraction || now,
      relationshipType: existing?.relationshipType || 'neutral',
      tags: existing?.tags || [],
      notes: existing?.notes || [],
      ...updates
    }
    
    this.store.characters[characterId] = updated
    this.store.lastUpdated = now
    return updated
  }

  getCharacterRelationship(characterId: string): CharacterRelationship | null {
    return this.store.characters[characterId] || null
  }

  // Platform relationship methods
  updatePlatformRelationship(platformId: string, updates: Partial<PlatformRelationship>): PlatformRelationship {
    const existing = this.store.platforms[platformId]
    const now = Date.now()
    
    const updated: PlatformRelationship = {
      id: platformId,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      version: (existing?.version || 0) + 1,
      platformId,
      playerId: this.store.playerId,
      warmth: existing?.warmth || 0,
      accessibility: existing?.accessibility || 0,
      familiarity: existing?.familiarity || 0,
      visitCount: existing?.visitCount || 0,
      lastVisit: existing?.lastVisit || now,
      platformType: existing?.platformType || 'career',
      tags: existing?.tags || [],
      notes: existing?.notes || [],
      ...updates
    }
    
    this.store.platforms[platformId] = updated
    this.store.lastUpdated = now
    return updated
  }

  getPlatformRelationship(platformId: string): PlatformRelationship | null {
    return this.store.platforms[platformId] || null
  }

  // Pattern methods
  updatePattern(patternId: string, updates: Partial<ChoicePattern>): ChoicePattern {
    const existing = this.store.patterns[patternId]
    const now = Date.now()
    
    const updated: ChoicePattern = {
      id: patternId,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      version: (existing?.version || 0) + 1,
      patternId,
      playerId: this.store.playerId,
      patternType: existing?.patternType || 'emotional',
      frequency: existing?.frequency || 0,
      strength: existing?.strength || 0,
      lastUsed: existing?.lastUsed || now,
      context: existing?.context || [],
      outcomes: existing?.outcomes || { positive: 0, negative: 0, neutral: 0 },
      tags: existing?.tags || [],
      ...updates
    }
    
    this.store.patterns[patternId] = updated
    this.store.lastUpdated = now
    return updated
  }

  getPattern(patternId: string): ChoicePattern | null {
    return this.store.patterns[patternId] || null
  }

  // Interaction methods
  recordInteraction(interaction: Omit<SceneInteraction, 'id' | 'createdAt' | 'updatedAt' | 'version'>): SceneInteraction {
    const id = `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newInteraction: SceneInteraction = {
      id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
      ...interaction
    }
    
    this.store.interactions[id] = newInteraction
    this.store.lastUpdated = Date.now()
    return newInteraction
  }

  // Skill development methods
  updateSkillDevelopment(skillId: string, updates: Partial<SkillDevelopment>): SkillDevelopment {
    const existing = this.store.skills[skillId]
    const now = Date.now()
    
    const updated: SkillDevelopment = {
      id: skillId,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      version: (existing?.version || 0) + 1,
      skillId,
      playerId: this.store.playerId,
      currentLevel: existing?.currentLevel || 0,
      targetLevel: existing?.targetLevel || 1,
      progressRate: existing?.progressRate || 0,
      lastPracticed: existing?.lastPracticed || now,
      practiceCount: existing?.practiceCount || 0,
      skillCategory: existing?.skillCategory || 'communication',
      dependencies: existing?.dependencies || [],
      prerequisites: existing?.prerequisites || [],
      ...updates
    }
    
    this.store.skills[skillId] = updated
    this.store.lastUpdated = now
    return updated
  }

  getSkillDevelopment(skillId: string): SkillDevelopment | null {
    return this.store.skills[skillId] || null
  }

  // Session methods
  startSession(sessionId: string): GameSession {
    const session: GameSession = {
      id: sessionId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
      sessionId,
      playerId: this.store.playerId,
      startTime: Date.now(),
      endTime: null,
      totalChoices: 0,
      scenesVisited: [],
      skillsPracticed: [],
      relationshipsChanged: [],
      patternsIdentified: [],
      performanceMetrics: {
        averageResponseTime: 0,
        rapidClicks: 0,
        hesitationCount: 0,
        flowState: 'neutral'
      },
      context: {}
    }
    
    this.store.sessions[sessionId] = session
    this.store.lastUpdated = Date.now()
    return session
  }

  endSession(sessionId: string, updates: Partial<GameSession>): GameSession | null {
    const session = this.store.sessions[sessionId]
    if (!session) return null

    const updated: GameSession = {
      ...session,
      ...updates,
      endTime: Date.now(),
      updatedAt: Date.now(),
      version: session.version + 1
    }
    
    this.store.sessions[sessionId] = updated
    this.store.lastUpdated = Date.now()
    return updated
  }

  // Query methods
  getRelationshipsByType(type: 'character' | 'platform'): (CharacterRelationship | PlatformRelationship)[] {
    if (type === 'character') {
      return Object.values(this.store.characters)
    } else {
      return Object.values(this.store.platforms)
    }
  }

  getPatternsByType(type: ChoicePattern['patternType']): ChoicePattern[] {
    return Object.values(this.store.patterns).filter(pattern => pattern.patternType === type)
  }

  getRecentInteractions(limit: number = 10): SceneInteraction[] {
    return Object.values(this.store.interactions)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit)
  }

  getActiveSession(): GameSession | null {
    return Object.values(this.store.sessions).find(session => !session.endTime) || null
  }

  // Export/Import methods
  exportData(): NormalizedDataStore {
    return { ...this.store }
  }

  importData(data: NormalizedDataStore): void {
    this.store = { ...data }
  }

  // Cleanup methods
  cleanupOldData(maxAge: number = 30 * 24 * 60 * 60 * 1000): void { // 30 days
    const cutoff = Date.now() - maxAge
    
    // Clean up old interactions
    Object.keys(this.store.interactions).forEach(id => {
      if (this.store.interactions[id].timestamp < cutoff) {
        delete this.store.interactions[id]
      }
    })
    
    // Clean up old sessions
    Object.keys(this.store.sessions).forEach(id => {
      if (this.store.sessions[id].startTime < cutoff) {
        delete this.store.sessions[id]
      }
    })
    
    this.store.lastUpdated = Date.now()
  }
}

// Singleton instance
let dataNormalizer: DataNormalizer | null = null

export function getDataNormalizer(): DataNormalizer {
  if (!dataNormalizer) {
    dataNormalizer = new DataNormalizer()
  }
  return dataNormalizer
}
