/**
 * Narrative Lock Messages
 *
 * TICKET-003: Reframe gates as relationships
 *
 * Instead of "REQ: HELPING 4", show:
 * "Samuel doesn't trust your instincts yet."
 * "Try running the 'Patient Comfort' simulation."
 */

import { PatternType, PATTERN_METADATA } from './patterns'
import type { CharacterId } from './graph-registry'

/**
 * Pattern-to-relationship narrative templates
 * Each pattern has a set of messages that frame locks as relationship building
 */
const PATTERN_LOCK_NARRATIVES: Record<PatternType, string[]> = {
  analytical: [
    '{character} needs to see more of your logical thinking.',
    '{character} isn\'t convinced of your analytical approach yet.',
    'Show {character} you can think through complex problems.',
  ],
  patience: [
    '{character} needs to see you can take your time.',
    '{character} is watching how you handle difficult moments.',
    'Demonstrate patience to earn {character}\'s trust.',
  ],
  exploring: [
    '{character} wants to see your curiosity in action.',
    'Show {character} you\'re willing to explore unknown territory.',
    '{character} is waiting for you to ask the right questions.',
  ],
  helping: [
    '{character} needs to know you genuinely care.',
    'Show {character} your compassion through your actions.',
    '{character} is watching how you treat others.',
  ],
  building: [
    '{character} wants to see what you can create.',
    'Demonstrate your ability to build something meaningful.',
    '{character} needs to trust your constructive instincts.',
  ],
}

/**
 * Default character names when no specific character is involved
 */
const DEFAULT_CHARACTER_NAMES: Record<string, string> = {
  samuel: 'Samuel',
  maya: 'Maya',
  marcus: 'Marcus',
  kai: 'Kai',
  rohan: 'Rohan',
  devon: 'Devon',
  tess: 'Tess',
  yaquin: 'Yaquin',
  grace: 'Grace',
  elena: 'Elena',
  alex: 'Alex',
  jordan: 'Jordan',
  silas: 'Silas',
  asha: 'Asha',
  lira: 'Lira',
  zara: 'Zara',
  quinn: 'Quinn',
  dante: 'Dante',
  nadia: 'Nadia',
  isaiah: 'Isaiah',
}

/**
 * Action hints for each pattern - suggests what the player can do
 */
const PATTERN_ACTION_HINTS: Record<PatternType, string[]> = {
  analytical: [
    'Try analyzing a complex situation',
    'Look for patterns in the data',
    'Ask probing questions',
  ],
  patience: [
    'Take your time with difficult choices',
    'Listen more before responding',
    'Wait for the right moment',
  ],
  exploring: [
    'Ask more questions about their world',
    'Investigate unfamiliar topics',
    'Follow your curiosity',
  ],
  helping: [
    'Offer support when they struggle',
    'Show empathy in your responses',
    'Put their needs first',
  ],
  building: [
    'Suggest constructive solutions',
    'Help them create something',
    'Focus on practical outcomes',
  ],
}

/**
 * Generate a narrative lock message for a locked choice
 */
export function generateNarrativeLockMessage(
  pattern: PatternType,
  characterId?: CharacterId | string,
  currentLevel?: number,
  requiredLevel?: number
): {
  message: string
  progress: string
  actionHint: string
} {
  // Get character name
  const characterName = characterId
    ? DEFAULT_CHARACTER_NAMES[characterId] || 'The Station'
    : 'The Station'

  // Pick a random narrative template
  const templates = PATTERN_LOCK_NARRATIVES[pattern]
  const template = templates[Math.floor(Math.random() * templates.length)]
  const message = template.replace('{character}', characterName)

  // Generate progress bar (visual representation)
  const current = currentLevel ?? 0
  const required = requiredLevel ?? 5
  const filledBlocks = Math.floor((current / required) * 4)
  const emptyBlocks = 4 - filledBlocks
  const progressBar = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks)
  const patternLabel = PATTERN_METADATA[pattern].label
  const progress = `${patternLabel} ${progressBar} ${current}/${required}`

  // Pick a random action hint
  const hints = PATTERN_ACTION_HINTS[pattern]
  const actionHint = hints[Math.floor(Math.random() * hints.length)]

  return { message, progress, actionHint }
}

/**
 * Format a complete narrative lock display
 * Returns a multi-line string suitable for UI display
 */
export function formatNarrativeLock(
  pattern: PatternType,
  characterId?: CharacterId | string,
  currentLevel?: number,
  requiredLevel?: number
): string {
  const { message, progress, actionHint } = generateNarrativeLockMessage(
    pattern,
    characterId,
    currentLevel,
    requiredLevel
  )

  return `${message}\n${progress}\n→ ${actionHint}`
}

/**
 * Get just the short narrative message (for compact UI)
 */
export function getShortLockMessage(
  pattern: PatternType,
  characterId?: CharacterId | string
): string {
  const characterName = characterId
    ? DEFAULT_CHARACTER_NAMES[characterId] || 'The Station'
    : 'The Station'

  const templates = PATTERN_LOCK_NARRATIVES[pattern]
  const template = templates[0] // Use first (most generic) for consistency
  return template.replace('{character}', characterName)
}
