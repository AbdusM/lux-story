/**
 * Meta-Achievements System
 * Hidden recognition for consistent play patterns across the journey
 *
 * Based on IF audit recommendation: "Meta-Endings (Inside UFO 54-40 Style)"
 * Creates replay value without gamification - these are recognitions, not rewards.
 *
 * Philosophy:
 * - Achievements are discovered, not chased
 * - Recognition of WHO you are, not WHAT you did
 * - No numerical scores displayed to players
 * - Samuel can reference these in dialogue/journey summary
 */

import type { GameState, SerializableGameState } from './character-state'

/**
 * Achievement definition
 */
export interface MetaAchievement {
  id: string
  name: string
  description: string // Short description shown when unlocked
  samuelQuote: string // What Samuel might say about this
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
  category: 'pattern' | 'relationship' | 'journey' | 'hidden'
  icon?: string // Emoji or icon identifier
}

/**
 * Achievement unlock status
 */
export interface UnlockedAchievement {
  achievementId: string
  unlockedAt: number
  context?: string // Optional context about how it was unlocked
}

/**
 * All meta-achievements in the game
 */
export const META_ACHIEVEMENTS: MetaAchievement[] = [
  // Pattern-based achievements
  {
    id: 'the_listener',
    name: 'The Listener',
    description: 'Consistently chose patience across multiple characters',
    samuelQuote: '"You have a rare gift—the ability to sit with silence until it speaks."',
    rarity: 'uncommon',
    category: 'pattern',
    icon: '👂'
  },
  {
    id: 'the_observer',
    name: 'The Observer',
    description: 'Analytical pattern dominated your journey',
    samuelQuote: '"You see the threads others miss. That kind of seeing changes everything."',
    rarity: 'uncommon',
    category: 'pattern',
    icon: '🔍'
  },
  {
    id: 'the_builder',
    name: 'The Builder',
    description: 'Building pattern showed across multiple conversations',
    samuelQuote: '"Where others see problems, you see blueprints."',
    rarity: 'uncommon',
    category: 'pattern',
    icon: '🔧'
  },
  {
    id: 'the_heart',
    name: 'The Heart',
    description: 'Helping pattern was your consistent approach',
    samuelQuote: '"You lead with compassion. That takes more courage than people realize."',
    rarity: 'uncommon',
    category: 'pattern',
    icon: '💚'
  },
  {
    id: 'the_wanderer',
    name: 'The Wanderer',
    description: 'Exploring pattern guided your journey',
    samuelQuote: '"You ask the questions others are afraid to ask."',
    rarity: 'uncommon',
    category: 'pattern',
    icon: '🧭'
  },
  {
    id: 'renaissance_soul',
    name: 'Renaissance Soul',
    description: 'Balanced all five patterns without a dominant one',
    samuelQuote: '"Most people lean one way. You... you\'re adaptable. That\'s rare."',
    rarity: 'rare',
    category: 'pattern',
    icon: '🌈'
  },

  // Relationship-based achievements
  {
    id: 'trusted_confidant',
    name: 'Trusted Confidant',
    description: 'Reached high trust with 3 or more characters',
    samuelQuote: '"People don\'t open up to just anyone. They opened up to you."',
    rarity: 'uncommon',
    category: 'relationship',
    icon: '🤝'
  },
  {
    id: 'deep_connection',
    name: 'Deep Connection',
    description: 'Reached maximum trust with any character',
    samuelQuote: '"What you built with them—that\'s not something that fades."',
    rarity: 'rare',
    category: 'relationship',
    icon: '💫'
  },
  {
    id: 'station_regular',
    name: 'Station Regular',
    description: 'Met and conversed with every character',
    samuelQuote: '"You talked to everyone. Most people don\'t. They should."',
    rarity: 'uncommon',
    category: 'relationship',
    icon: '🚉'
  },

  // Journey-based achievements
  {
    id: 'full_circle',
    name: 'Full Circle',
    description: 'Completed all character arcs',
    samuelQuote: '"You didn\'t leave any conversation unfinished. That says something."',
    rarity: 'rare',
    category: 'journey',
    icon: '🔄'
  },
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Completed your first character arc',
    samuelQuote: '"The first conversation is always the hardest. You did it."',
    rarity: 'common',
    category: 'journey',
    icon: '👣'
  },
  {
    id: 'thoughtful_traveler',
    name: 'Thoughtful Traveler',
    description: 'Collected 5 or more thoughts in your cabinet',
    samuelQuote: '"You carry pieces of every conversation with you. That\'s wisdom."',
    rarity: 'uncommon',
    category: 'journey',
    icon: '💭'
  },

  // Hidden achievements (discovered through specific behaviors)
  {
    id: 'the_returner',
    name: 'The Returner',
    description: 'Revisited a character after completing their arc',
    samuelQuote: '"Coming back—that\'s not about finishing. That\'s about caring."',
    rarity: 'uncommon',
    category: 'hidden',
    icon: '🔙'
  },
  {
    id: 'midnight_philosopher',
    name: 'Midnight Philosopher',
    description: 'Made 50+ choices during your journey',
    samuelQuote: '"You didn\'t rush. Every choice was a conversation with yourself."',
    rarity: 'rare',
    category: 'hidden',
    icon: '🌙'
  },
  {
    id: 'quiet_presence',
    name: 'Quiet Presence',
    description: 'Chose patience options more than any other pattern',
    samuelQuote: '"In a world that\'s always rushing, you waited. That\'s power."',
    rarity: 'rare',
    category: 'hidden',
    icon: '🌿'
  }
]

/**
 * Evaluate achievements based on current game state
 * Returns array of newly unlocked achievement IDs
 */
export function evaluateAchievements(
  gameState: GameState | SerializableGameState,
  existingUnlocks: string[] = []
): string[] {
  const newUnlocks: string[] = []

  // Helper to check if achievement is already unlocked
  const isUnlocked = (id: string) => existingUnlocks.includes(id)

  // Extract data from game state
  const patterns = gameState.patterns
  const globalFlags = 'globalFlags' in gameState && gameState.globalFlags instanceof Set
    ? gameState.globalFlags
    : new Set(gameState.globalFlags || [])

  const characters = 'characters' in gameState && gameState.characters instanceof Map
    ? Array.from(gameState.characters.values())
    : (gameState as SerializableGameState).characters || []

  const thoughts = 'thoughts' in gameState ? gameState.thoughts : []

  // Calculate pattern totals
  const patternEntries = Object.entries(patterns) as [string, number][]
  const totalPatternChoices = patternEntries.reduce((sum, [, val]) => sum + val, 0)
  const sortedPatterns = patternEntries.sort(([, a], [, b]) => b - a)
  const dominantPattern = sortedPatterns[0]?.[0]
  const dominantValue = sortedPatterns[0]?.[1] || 0
  const secondHighest = sortedPatterns[1]?.[1] || 0

  // Count arcs completed
  const arcFlags = [
    'maya_arc_complete', 'devon_arc_complete', 'jordan_arc_complete',
    'tess_arc_complete', 'yaquin_arc_complete', 'kai_arc_complete',
    'rohan_arc_complete', 'silas_arc_complete'
  ]
  const arcsCompleted = arcFlags.filter(flag => globalFlags.has(flag)).length

  // Count characters met
  const metFlags = [
    'met_maya', 'met_devon', 'met_jordan', 'met_tess',
    'met_yaquin', 'met_kai', 'met_rohan', 'met_silas'
  ]
  const charactersMet = metFlags.filter(flag => globalFlags.has(flag)).length

  // Calculate trust levels
  const trustLevels = characters.map((c: { trust?: number }) => c.trust || 0)
  const highTrustCount = trustLevels.filter((t: number) => t >= 7).length
  const maxTrust = Math.max(...trustLevels, 0)

  // --- Pattern Achievements ---

  // The Listener: Patience is dominant pattern with significant choices
  if (!isUnlocked('the_listener') && dominantPattern === 'patience' && dominantValue >= 5) {
    newUnlocks.push('the_listener')
  }

  // The Observer: Analytical is dominant
  if (!isUnlocked('the_observer') && dominantPattern === 'analytical' && dominantValue >= 5) {
    newUnlocks.push('the_observer')
  }

  // The Builder: Building is dominant
  if (!isUnlocked('the_builder') && dominantPattern === 'building' && dominantValue >= 5) {
    newUnlocks.push('the_builder')
  }

  // The Heart: Helping is dominant
  if (!isUnlocked('the_heart') && dominantPattern === 'helping' && dominantValue >= 5) {
    newUnlocks.push('the_heart')
  }

  // The Wanderer: Exploring is dominant
  if (!isUnlocked('the_wanderer') && dominantPattern === 'exploring' && dominantValue >= 5) {
    newUnlocks.push('the_wanderer')
  }

  // Renaissance Soul: All patterns within 2 of each other, minimum 3 each
  if (!isUnlocked('renaissance_soul')) {
    const minPattern = Math.min(...patternEntries.map(([, v]) => v))
    const maxPattern = Math.max(...patternEntries.map(([, v]) => v))
    if (minPattern >= 3 && maxPattern - minPattern <= 2) {
      newUnlocks.push('renaissance_soul')
    }
  }

  // --- Relationship Achievements ---

  // Trusted Confidant: 3+ characters at trust >= 7
  if (!isUnlocked('trusted_confidant') && highTrustCount >= 3) {
    newUnlocks.push('trusted_confidant')
  }

  // Deep Connection: Any character at trust 10
  if (!isUnlocked('deep_connection') && maxTrust >= 10) {
    newUnlocks.push('deep_connection')
  }

  // Station Regular: Met all 8 characters
  if (!isUnlocked('station_regular') && charactersMet >= 8) {
    newUnlocks.push('station_regular')
  }

  // --- Journey Achievements ---

  // First Steps: Completed first arc
  if (!isUnlocked('first_steps') && arcsCompleted >= 1) {
    newUnlocks.push('first_steps')
  }

  // Full Circle: Completed all arcs
  if (!isUnlocked('full_circle') && arcsCompleted >= 8) {
    newUnlocks.push('full_circle')
  }

  // Thoughtful Traveler: 5+ thoughts collected
  if (!isUnlocked('thoughtful_traveler') && thoughts.length >= 5) {
    newUnlocks.push('thoughtful_traveler')
  }

  // --- Hidden Achievements ---

  // The Returner: Any revisit flag set
  const revisitFlags = ['maya_revisit', 'yaquin_revisit']
  if (!isUnlocked('the_returner') && revisitFlags.some(flag => globalFlags.has(flag))) {
    newUnlocks.push('the_returner')
  }

  // Midnight Philosopher: 50+ total choices
  if (!isUnlocked('midnight_philosopher') && totalPatternChoices >= 50) {
    newUnlocks.push('midnight_philosopher')
  }

  // Quiet Presence: Patience > all other patterns and >= 8
  if (!isUnlocked('quiet_presence')) {
    if (dominantPattern === 'patience' && dominantValue >= 8 && dominantValue > secondHighest + 2) {
      newUnlocks.push('quiet_presence')
    }
  }

  return newUnlocks
}

/**
 * Get achievement by ID
 */
export function getAchievement(id: string): MetaAchievement | undefined {
  return META_ACHIEVEMENTS.find(a => a.id === id)
}

/**
 * Get all unlocked achievements with full data
 */
export function getUnlockedAchievements(unlockIds: string[]): MetaAchievement[] {
  return unlockIds
    .map(id => getAchievement(id))
    .filter((a): a is MetaAchievement => a !== undefined)
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category: MetaAchievement['category']): MetaAchievement[] {
  return META_ACHIEVEMENTS.filter(a => a.category === category)
}

/**
 * Get a Samuel quote for the player's achievements
 * Used in journey summary
 */
export function getSamuelAchievementReflection(unlockIds: string[]): string | null {
  if (unlockIds.length === 0) return null

  const achievements = getUnlockedAchievements(unlockIds)

  // Prioritize rare achievements
  const rare = achievements.find(a => a.rarity === 'rare' || a.rarity === 'legendary')
  if (rare) return rare.samuelQuote

  // Otherwise use the first achievement
  return achievements[0]?.samuelQuote || null
}

/**
 * Check if player has any achievements in a category
 */
export function hasAchievementInCategory(
  unlockIds: string[],
  category: MetaAchievement['category']
): boolean {
  const achievements = getUnlockedAchievements(unlockIds)
  return achievements.some(a => a.category === category)
}
