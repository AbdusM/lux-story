/**
 * Character Waiting System
 *
 * Creates "They're Waiting for You" engagement loop.
 * When players return after time away, characters signal desire to reconnect.
 *
 * Philosophy:
 * - Characters feel alive between sessions
 * - No punishment for absence - only warm welcomes
 * - Higher trust = stronger "missing you" signal
 * - Arc-in-progress characters have priority
 */

import type { CharacterId } from './graph-registry'
import type { GameState } from './character-state'

/**
 * A character's waiting state when player returns
 */
export interface CharacterWaitingState {
  characterId: CharacterId
  hoursSinceVisit: number
  waitingMessage: string
  priority: number              // Higher = show first
  hasNewContent: boolean        // True if state changed since last visit
  trustLevel: number
  arcInProgress: boolean
}

/**
 * Context for determining waiting state
 */
export interface WaitingContext {
  isReturningPlayer: boolean    // True if new session after absence
  hoursSinceLastSession: number
  currentSessionCharacters: Set<string>  // Characters visited this session
}

/**
 * Waiting messages by character - personalized to their personality
 * Multiple variants for variety
 */
const WAITING_MESSAGES: Record<CharacterId, string[]> = {
  samuel: [
    "Samuel's been watching the arrivals board more than usual.",
    "The station keeper mentioned he hoped you'd return.",
    "Samuel's tea has gone cold. He's been waiting."
  ],
  maya: [
    "Maya's been tinkering more than usual. She keeps looking toward the platform.",
    "That robot companion of Maya's keeps wheeling toward the entrance.",
    "Maya mentioned you the other day. She seemed... hopeful."
  ],
  devon: [
    "Devon's been running his algorithms in loops. He's thinking about something.",
    "Devon asked Samuel if you'd been by. Tried to sound casual.",
    "The systems thinker has been unusually quiet. Processing, maybe."
  ],
  jordan: [
    "Jordan's been reorganizing career pamphlets. Restless energy.",
    "The career navigator keeps checking the schedule boards."
  ],
  marcus: [
    "Marcus mentioned you during his break. Said you 'get it.'",
    "The medical tech has been steady as always, but he asked about you."
  ],
  tess: [
    "Tess has new music to share. She's been curating something special.",
    "The music curator's been humming more than usual. Thinking of someone."
  ],
  yaquin: [
    "Yaquin's students asked about 'the visitor.' She smiled.",
    "The teacher has been more reflective lately. Your conversations stay with her."
  ],
  kai: [
    "Kai's been running safety checks twice. Thorough as always.",
    "The safety specialist mentioned your attention to detail."
  ],
  rohan: [
    "Rohan's been deep in thought. Deeper than usual.",
    "The philosopher asked Samuel about time and return visits."
  ],
  silas: [
    "Silas has been managing more efficiently. Something's shifted.",
    "The crisis manager mentioned your calm presence."
  ],
  alex: [
    "Alex has been exploring new corners of the station.",
    "The wanderer asked if anyone new had arrived."
  ],
  elena: [
    "Elena's been fixing things with unusual focus. Hands stay busy.",
    "The electrician mentioned your conversation. Said it helped."
  ],
  grace: [
    "Grace has been sitting peacefully. Presence matters to her.",
    "The caregiver spoke about your patience. It meant something."
  ]
}

/**
 * Priority weights for different factors
 */
const PRIORITY_WEIGHTS = {
  trustLevel: 2,           // Higher trust = higher priority
  arcInProgress: 5,        // Arc in progress = major boost
  recentInteraction: -1,   // Recently visited = lower priority
  hoursAway: 0.1          // Longer away = slightly higher priority (caps at 48h)
} as const

/**
 * Minimum hours away to trigger "waiting" state
 */
const MIN_HOURS_FOR_WAITING = 4

/**
 * Detect if player is returning after absence
 */
export function detectReturningPlayer(
  gameState: GameState,
  currentTime: number = Date.now()
): WaitingContext {
  const lastSaved = gameState.lastSaved
  const sessionStart = gameState.sessionStartTime

  // Calculate hours since last session
  const hoursSinceLastSession = (currentTime - lastSaved) / (1000 * 60 * 60)

  // Player is "returning" if:
  // 1. Session start is recent (within last minute) AND
  // 2. Last saved was more than MIN_HOURS ago
  const sessionJustStarted = (currentTime - sessionStart) < 60000 // Within 1 minute
  const wasAwayLongEnough = hoursSinceLastSession >= MIN_HOURS_FOR_WAITING

  // Get characters visited in current session
  const currentSessionCharacters = new Set<string>()
  gameState.characters.forEach((charState, charId) => {
    // If conversation history grew since session start, they were visited
    // For simplicity, check if they have ANY history (we'll refine this)
    if (charState.conversationHistory.length > 0) {
      // Check if most recent visit was this session
      // This is approximate - for better tracking, we'd add timestamps per character
      currentSessionCharacters.add(charId)
    }
  })

  return {
    isReturningPlayer: sessionJustStarted && wasAwayLongEnough,
    hoursSinceLastSession: Math.min(hoursSinceLastSession, 168), // Cap at 1 week
    currentSessionCharacters
  }
}

/**
 * Check if a character has an arc in progress
 * (Started but not completed)
 */
function hasArcInProgress(characterId: CharacterId, gameState: GameState): boolean {
  const startFlags: Record<string, string> = {
    maya: 'maya_arc_started',
    devon: 'devon_arc_started',
    elena: 'elena_arc_started',
    grace: 'grace_arc_started',
    marcus: 'marcus_arc_started',
    tess: 'tess_arc_started',
    yaquin: 'yaquin_arc_started',
    rohan: 'rohan_arc_started',
    jordan: 'jordan_arc_started',
    kai: 'kai_arc_started',
    silas: 'silas_arc_started',
    alex: 'alex_arc_started'
  }

  const completeFlags: Record<string, string> = {
    maya: 'maya_arc_complete',
    devon: 'devon_arc_complete',
    elena: 'elena_arc_complete',
    grace: 'grace_arc_complete',
    marcus: 'marcus_arc_complete',
    tess: 'tess_arc_complete',
    yaquin: 'yaquin_arc_complete',
    rohan: 'rohan_arc_complete',
    jordan: 'jordan_arc_complete',
    kai: 'kai_arc_complete',
    silas: 'silas_arc_complete',
    alex: 'alex_arc_complete'
  }

  const startFlag = startFlags[characterId]
  const completeFlag = completeFlags[characterId]

  if (!startFlag || !completeFlag) return false

  const hasStarted = gameState.globalFlags.has(startFlag)
  const hasCompleted = gameState.globalFlags.has(completeFlag)

  return hasStarted && !hasCompleted
}

/**
 * Get a random waiting message for a character
 */
function getWaitingMessage(characterId: CharacterId): string {
  const messages = WAITING_MESSAGES[characterId]
  if (!messages || messages.length === 0) {
    return `${characterId} has been thinking about your conversations.`
  }
  return messages[Math.floor(Math.random() * messages.length)]
}

/**
 * Calculate priority for a character
 */
function calculatePriority(
  characterId: CharacterId,
  gameState: GameState,
  context: WaitingContext
): number {
  const charState = gameState.characters.get(characterId)
  if (!charState) return 0

  let priority = 0

  // Trust contribution
  priority += charState.trust * PRIORITY_WEIGHTS.trustLevel

  // Arc in progress contribution
  if (hasArcInProgress(characterId, gameState)) {
    priority += PRIORITY_WEIGHTS.arcInProgress
  }

  // Time away contribution (capped)
  const cappedHours = Math.min(context.hoursSinceLastSession, 48)
  priority += cappedHours * PRIORITY_WEIGHTS.hoursAway

  // Recent interaction penalty
  if (context.currentSessionCharacters.has(characterId)) {
    priority += PRIORITY_WEIGHTS.recentInteraction * 10 // Strong penalty
  }

  return priority
}

/**
 * Get all characters who are "waiting" for the player
 * Returns sorted by priority (highest first)
 */
export function getWaitingCharacters(
  gameState: GameState,
  context?: WaitingContext
): CharacterWaitingState[] {
  // Auto-detect context if not provided
  const waitingContext = context || detectReturningPlayer(gameState)

  // If not a returning player, no one is "waiting"
  if (!waitingContext.isReturningPlayer) {
    return []
  }

  const waitingCharacters: CharacterWaitingState[] = []

  // Check each character (except Samuel - he's always there)
  const characterIds: CharacterId[] = [
    'maya', 'devon', 'elena', 'grace', 'marcus',
    'tess', 'yaquin', 'rohan', 'jordan', 'kai', 'silas', 'alex'
  ]

  for (const characterId of characterIds) {
    const charState = gameState.characters.get(characterId)
    if (!charState) continue

    // Must have been visited at least once
    if (charState.conversationHistory.length === 0) continue

    // Must have minimum trust to "miss" the player
    if (charState.trust < 3) continue

    // Skip if already visited this session
    if (waitingContext.currentSessionCharacters.has(characterId)) continue

    const arcInProgress = hasArcInProgress(characterId, gameState)
    const priority = calculatePriority(characterId, gameState, waitingContext)

    waitingCharacters.push({
      characterId,
      hoursSinceVisit: waitingContext.hoursSinceLastSession,
      waitingMessage: getWaitingMessage(characterId),
      priority,
      hasNewContent: arcInProgress, // Arc in progress = likely new content
      trustLevel: charState.trust,
      arcInProgress
    })
  }

  // Sort by priority (highest first)
  return waitingCharacters.sort((a, b) => b.priority - a.priority)
}

/**
 * Get a summary message for Samuel to deliver
 * "Maya and Devon have been asking about you..."
 */
export function getSamuelWaitingSummary(
  waitingCharacters: CharacterWaitingState[],
  maxCharacters: number = 3
): string | null {
  if (waitingCharacters.length === 0) return null

  const topCharacters = waitingCharacters.slice(0, maxCharacters)

  if (topCharacters.length === 1) {
    const char = topCharacters[0]
    return `${formatCharacterName(char.characterId)} has been asking about you.`
  }

  if (topCharacters.length === 2) {
    return `${formatCharacterName(topCharacters[0].characterId)} and ${formatCharacterName(topCharacters[1].characterId)} have been asking about you.`
  }

  // 3+ characters
  const names = topCharacters.slice(0, -1).map(c => formatCharacterName(c.characterId))
  const lastName = formatCharacterName(topCharacters[topCharacters.length - 1].characterId)
  return `${names.join(', ')}, and ${lastName} have been asking about you.`
}

/**
 * Format character ID to display name
 */
function formatCharacterName(characterId: CharacterId): string {
  const names: Record<CharacterId, string> = {
    samuel: 'Samuel',
    maya: 'Maya',
    devon: 'Devon',
    jordan: 'Jordan',
    marcus: 'Marcus',
    tess: 'Tess',
    yaquin: 'Yaquin',
    kai: 'Kai',
    rohan: 'Rohan',
    silas: 'Silas',
    alex: 'Alex',
    elena: 'Elena',
    grace: 'Grace'
  }
  return names[characterId] || characterId
}

/**
 * Get time-aware greeting prefix for a character
 * Used when starting a conversation with someone who's been waiting
 */
export function getTimeAwareGreeting(
  characterId: CharacterId,
  hoursSince: number
): string {
  const greetings: Record<CharacterId, { short: string; medium: string; long: string }> = {
    samuel: {
      short: "Ah, you're back.",
      medium: "It's good to see you again.",
      long: "The station feels more complete when you're here."
    },
    maya: {
      short: "Hey! You came back.",
      medium: "I was hoping you'd stop by again.",
      long: "I've been thinking about our conversation. I'm glad you're here."
    },
    devon: {
      short: "You returned.",
      medium: "I've been... processing since we talked.",
      long: "The probability of you returning was... higher than I expected. I'm pleased."
    },
    elena: {
      short: "Back again?",
      medium: "Good to see you. Things have been steady.",
      long: "You know, I've fixed a lot of things since we talked. But some things don't need fixing."
    },
    grace: {
      short: "You're here.",
      medium: "I saved your spot. Not that anyone else sits there.",
      long: "Time moves differently when you know someone will return."
    },
    marcus: {
      short: "Hey.",
      medium: "Shift's been quiet. Good quiet.",
      long: "Some visitors you remember. You're one of those."
    },
    tess: {
      short: "You're back!",
      medium: "I've got something new for you to hear.",
      long: "The station's quieter without certain conversations. I missed this."
    },
    yaquin: {
      short: "Welcome back.",
      medium: "My students asked about you.",
      long: "There's something about the conversations we have. They stick with me."
    },
    rohan: {
      short: "Ah.",
      medium: "I've been contemplating our last exchange.",
      long: "Time teaches patience. Your return teaches its value."
    },
    jordan: {
      short: "Hey there.",
      medium: "Good to see a familiar face.",
      long: "Some paths circle back. Yours did."
    },
    kai: {
      short: "You're back.",
      medium: "Station's been secure. You?",
      long: "Consistency matters. In safety and in people."
    },
    silas: {
      short: "Back again.",
      medium: "Things have been... manageable.",
      long: "Crisis management is about knowing who to count on. Good to see you."
    },
    alex: {
      short: "Oh, hey!",
      medium: "I found some new corners of the station.",
      long: "The station's big, but certain platforms feel less empty when you're around."
    }
  }

  const charGreetings = greetings[characterId] || {
    short: "You're back.",
    medium: "Good to see you again.",
    long: "It's been a while. I'm glad you returned."
  }

  if (hoursSince < 12) {
    return charGreetings.short
  } else if (hoursSince < 48) {
    return charGreetings.medium
  } else {
    return charGreetings.long
  }
}
