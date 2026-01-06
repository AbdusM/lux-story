/**
 * Quest/Mission System
 * Tracks player progress through character arcs and discovery objectives
 *
 * State machine: LOCKED → UNLOCKED → ACTIVE → COMPLETED
 *
 * Invisible Depth: Quests track silently. UI shows progress without interrupting gameplay.
 */

import { GameState } from './character-state'
import { CharacterId, isValidCharacterId } from './graph-registry'

// ============================================================================
// QUEST STATE MACHINE
// ============================================================================

export type QuestStatus = 'locked' | 'unlocked' | 'active' | 'completed'

export interface Quest {
  id: string
  title: string
  description: string
  type: 'character_arc' | 'discovery' | 'return_hook'
  characterId?: CharacterId  // For character arcs
  status: QuestStatus
  unlockCondition: QuestCondition
  completeCondition: QuestCondition
  reward?: QuestReward
}

export interface QuestCondition {
  hasGlobalFlags?: string[]
  hasKnowledgeFlags?: string[]
  metCharacters?: CharacterId[]
  minTrust?: { characterId: CharacterId; trust: number }[]
  minPatterns?: Partial<Record<string, number>>
}

export interface QuestReward {
  type: 'insight' | 'connection' | 'unlock'
  description: string
}

// ============================================================================
// QUEST DEFINITIONS
// ============================================================================

export const QUEST_DEFINITIONS: Omit<Quest, 'status'>[] = [
  // CHARACTER ARCS
  {
    id: 'maya_arc',
    title: "Maya's Path",
    description: "Help Maya navigate the tension between family expectations and her own aspirations.",
    type: 'character_arc',
    characterId: 'maya',
    unlockCondition: {
      hasGlobalFlags: ['met_maya']
    },
    completeCondition: {
      hasGlobalFlags: ['maya_arc_complete']
    },
    reward: {
      type: 'insight',
      description: "Understanding how to balance external pressure with internal drive"
    }
  },
  {
    id: 'devon_arc',
    title: "Devon's Journey",
    description: "Walk with Devon through the challenges of systems thinking and emotional resilience.",
    type: 'character_arc',
    characterId: 'devon',
    unlockCondition: {
      hasGlobalFlags: ['met_devon']
    },
    completeCondition: {
      hasGlobalFlags: ['devon_arc_complete']
    },
    reward: {
      type: 'insight',
      description: "Seeing how analytical minds process emotional challenges"
    }
  },
  {
    id: 'jordan_arc',
    title: "Jordan's Crossroads",
    description: "Support Jordan as they question their winding career path and find meaning in the journey.",
    type: 'character_arc',
    characterId: 'jordan',
    unlockCondition: {
      hasGlobalFlags: ['met_jordan']
    },
    completeCondition: {
      hasGlobalFlags: ['jordan_arc_complete']
    },
    reward: {
      type: 'insight',
      description: "Discovering that non-linear paths can lead to unexpected clarity"
    }
  },
  {
    id: 'marcus_arc',
    title: "Marcus's Challenge",
    description: "Help Marcus balance the demands of healthcare leadership with personal well-being.",
    type: 'character_arc',
    characterId: 'marcus',
    unlockCondition: {
      hasGlobalFlags: ['met_marcus']
    },
    completeCondition: {
      hasGlobalFlags: ['marcus_arc_complete']
    },
    reward: {
      type: 'insight',
      description: "Understanding the weight of responsibility in service roles"
    }
  },
  {
    id: 'tess_arc',
    title: "Tess's Vision",
    description: "Explore Tess's journey from educator to founder, and the sacrifices it requires.",
    type: 'character_arc',
    characterId: 'tess',
    unlockCondition: {
      hasGlobalFlags: ['met_tess']
    },
    completeCondition: {
      hasGlobalFlags: ['tess_arc_complete']
    },
    reward: {
      type: 'insight',
      description: "Learning how passion transforms into purpose"
    }
  },

  // DISCOVERY QUESTS
  {
    id: 'station_secrets',
    title: "Station Secrets",
    description: "Uncover the hidden history of Grand Central Terminus.",
    type: 'discovery',
    unlockCondition: {
      metCharacters: ['samuel']
    },
    completeCondition: {
      hasGlobalFlags: ['station_history_revealed']
    },
    reward: {
      type: 'unlock',
      description: "Access to deeper station lore"
    }
  },
  {
    id: 'pattern_mastery',
    title: "Finding Your Pattern",
    description: "Develop a strong affinity for one of the five patterns.",
    type: 'discovery',
    unlockCondition: {
      metCharacters: ['samuel']
    },
    completeCondition: {
      minPatterns: {
        analytical: 6,
        helping: 6,
        building: 6,
        patience: 6,
        exploring: 6
      }
    }
  },

  // RETURN HOOKS
  {
    id: 'waiting_characters',
    title: "They're Waiting",
    description: "Return to characters you've connected with—they have more to share.",
    type: 'return_hook',
    unlockCondition: {
      hasGlobalFlags: ['maya_arc_complete']
    },
    completeCondition: {
      hasGlobalFlags: ['maya_revisit_complete']
    },
    reward: {
      type: 'connection',
      description: "Deeper relationship unlocked"
    }
  }
]

// ============================================================================
// QUEST EVALUATION
// ============================================================================

/**
 * Check if a condition is met based on game state
 */
export function evaluateQuestCondition(condition: QuestCondition, state: GameState): boolean {
  // Check global flags
  if (condition.hasGlobalFlags) {
    for (const flag of condition.hasGlobalFlags) {
      if (!state.globalFlags.has(flag)) {
        return false
      }
    }
  }

  // Check knowledge flags (any character)
  if (condition.hasKnowledgeFlags) {
    const allKnowledgeFlags = new Set<string>()
    state.characters.forEach(char => {
      char.knowledgeFlags.forEach(flag => allKnowledgeFlags.add(flag))
    })
    for (const flag of condition.hasKnowledgeFlags) {
      if (!allKnowledgeFlags.has(flag)) {
        return false
      }
    }
  }

  // Check met characters
  if (condition.metCharacters) {
    for (const charId of condition.metCharacters) {
      if (!isValidCharacterId(charId)) continue
      const char = state.characters.get(charId)
      if (!char || char.conversationHistory.length === 0) {
        return false
      }
    }
  }

  // Check min trust
  if (condition.minTrust) {
    for (const { characterId, trust } of condition.minTrust) {
      if (!isValidCharacterId(characterId)) continue
      const char = state.characters.get(characterId)
      if (!char || char.trust < trust) {
        return false
      }
    }
  }

  // Check min patterns (any pattern meeting threshold triggers completion)
  if (condition.minPatterns) {
    // For pattern mastery, we check if ANY pattern meets the threshold
    const patternMet = Object.entries(condition.minPatterns).some(([pattern, min]) => {
      const value = state.patterns[pattern as keyof typeof state.patterns]
      return value >= (min || 0)
    })
    if (!patternMet) {
      return false
    }
  }

  return true
}

/**
 * Calculate quest status based on game state
 */
export function calculateQuestStatus(quest: Omit<Quest, 'status'>, state: GameState): QuestStatus {
  // Check completion first
  if (evaluateQuestCondition(quest.completeCondition, state)) {
    return 'completed'
  }

  // Check if unlocked
  if (evaluateQuestCondition(quest.unlockCondition, state)) {
    // If unlocked but not completed, it's active
    // For character arcs, check if we've started the conversation
    if (quest.type === 'character_arc' && quest.characterId) {
      const char = state.characters.get(quest.characterId)
      if (char && char.conversationHistory.length > 0) {
        return 'active'
      }
    }
    return 'unlocked'
  }

  return 'locked'
}

/**
 * Get all quests with their current status
 */
export function getQuestsWithStatus(state: GameState): Quest[] {
  return QUEST_DEFINITIONS.map(quest => ({
    ...quest,
    status: calculateQuestStatus(quest, state)
  }))
}

/**
 * Get active quests (unlocked or in-progress)
 */
export function getActiveQuests(state: GameState): Quest[] {
  return getQuestsWithStatus(state).filter(q => q.status === 'active' || q.status === 'unlocked')
}

/**
 * Get completed quests
 */
export function getCompletedQuests(state: GameState): Quest[] {
  return getQuestsWithStatus(state).filter(q => q.status === 'completed')
}

/**
 * Get the primary active quest (for display in minimal UI)
 */
export function getPrimaryQuest(state: GameState): Quest | null {
  const active = getActiveQuests(state)
  // Prioritize character arcs over discovery
  const characterArc = active.find(q => q.type === 'character_arc' && q.status === 'active')
  if (characterArc) return characterArc

  // Then any active quest
  const anyActive = active.find(q => q.status === 'active')
  if (anyActive) return anyActive

  // Then unlocked quests
  return active.find(q => q.status === 'unlocked') || null
}

/**
 * Get quest progress summary
 */
export function getQuestProgress(state: GameState): {
  total: number
  completed: number
  active: number
  locked: number
} {
  const quests = getQuestsWithStatus(state)
  return {
    total: quests.length,
    completed: quests.filter(q => q.status === 'completed').length,
    active: quests.filter(q => q.status === 'active' || q.status === 'unlocked').length,
    locked: quests.filter(q => q.status === 'locked').length
  }
}
