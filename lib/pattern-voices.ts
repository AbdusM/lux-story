/**
 * Pattern Voice System
 *
 * Lux Story 2.0 - The Thought Cabinet
 *
 * When patterns reach threshold, they "speak" as inner monologue during dialogue.
 * Inspired by Disco Elysium's skill system where your abilities have personality.
 *
 * Philosophy: Your patterns aren't just numbers - they're voices in your head.
 * As you become more analytical, the analytical voice gets louder.
 */

import type { PatternType } from './patterns'
import type { CharacterId } from './graph-registry'
import type { GameState } from './character-state'

/**
 * When a pattern voice should trigger
 */
export type PatternVoiceTrigger = 'node_enter' | 'before_choices' | 'npc_emotion'

/**
 * How the pattern voice should be styled
 */
export type PatternVoiceStyle = 'whisper' | 'urge' | 'observation'

/**
 * A single pattern voice entry
 */
export interface PatternVoiceEntry {
  /** Pattern that speaks */
  pattern: PatternType
  /** Minimum pattern level required */
  minLevel: number
  /** When to trigger this voice */
  trigger: PatternVoiceTrigger
  /** Optional conditions for triggering */
  condition?: {
    /** NPC must be showing this emotion */
    emotion?: string
    /** Current character must be this */
    characterId?: CharacterId
    /** Node must have this tag */
    nodeTag?: string
  }
  /** Possible voice lines (random selection) */
  voices: string[]
  /** Visual style */
  style: PatternVoiceStyle
  /** Cooldown in nodes before this specific voice can trigger again */
  cooldown?: number
}

/**
 * Result of checking for pattern voice
 */
export interface PatternVoiceResult {
  pattern: PatternType
  text: string
  style: PatternVoiceStyle
}

/**
 * Context for evaluating pattern voices
 */
export interface PatternVoiceContext {
  /** Current trigger point */
  trigger: PatternVoiceTrigger
  /** Current character */
  characterId?: CharacterId
  /** Current NPC emotion */
  npcEmotion?: string
  /** Current node tags */
  nodeTags?: string[]
}

// Track recently shown voices to prevent spam
const recentVoices = new Map<string, number>() // voice key -> node count
const GLOBAL_COOLDOWN = 3 // Minimum nodes between any voice
let nodesSinceLastVoice = GLOBAL_COOLDOWN

/**
 * Check if a pattern voice should trigger
 */
export function getPatternVoice(
  context: PatternVoiceContext,
  gameState: GameState,
  voiceLibrary: PatternVoiceEntry[]
): PatternVoiceResult | null {
  // Global cooldown - don't spam voices
  if (nodesSinceLastVoice < GLOBAL_COOLDOWN) {
    nodesSinceLastVoice++
    return null
  }

  // Find eligible voices for this context
  const eligibleVoices: { entry: PatternVoiceEntry; priority: number }[] = []

  for (const entry of voiceLibrary) {
    // Check minimum pattern level
    const patternLevel = gameState.patterns[entry.pattern] || 0
    if (patternLevel < entry.minLevel) continue

    // Check trigger matches
    if (entry.trigger !== context.trigger) continue

    // Check conditions
    if (entry.condition) {
      if (entry.condition.emotion && entry.condition.emotion !== context.npcEmotion) continue
      if (entry.condition.characterId && entry.condition.characterId !== context.characterId) continue
      if (entry.condition.nodeTag && (!context.nodeTags || !context.nodeTags.includes(entry.condition.nodeTag))) continue
    }

    // Check cooldown for this specific voice
    const voiceKey = `${entry.pattern}-${entry.trigger}-${entry.condition?.characterId || 'any'}`
    const lastShown = recentVoices.get(voiceKey) || 0
    const cooldown = entry.cooldown || 5
    if (lastShown > 0 && lastShown < cooldown) {
      recentVoices.set(voiceKey, lastShown + 1)
      continue
    }

    // Calculate priority (higher pattern level = higher priority)
    const priority = patternLevel

    eligibleVoices.push({ entry, priority })
  }

  if (eligibleVoices.length === 0) return null

  // Sort by priority (highest first) and pick one
  eligibleVoices.sort((a, b) => b.priority - a.priority)

  // Pick the highest priority voice
  const selected = eligibleVoices[0]

  // Select random voice line from options
  const voiceText = selected.entry.voices[Math.floor(Math.random() * selected.entry.voices.length)]

  // Update cooldowns
  const voiceKey = `${selected.entry.pattern}-${selected.entry.trigger}-${selected.entry.condition?.characterId || 'any'}`
  recentVoices.set(voiceKey, 1)
  nodesSinceLastVoice = 0

  return {
    pattern: selected.entry.pattern,
    text: voiceText,
    style: selected.entry.style
  }
}

/**
 * Increment node counter for cooldown tracking
 * Call this when navigating to a new node
 */
export function incrementPatternVoiceNodeCounter(): void {
  nodesSinceLastVoice++

  // Increment all cooldown counters
  for (const [key, count] of recentVoices) {
    recentVoices.set(key, count + 1)
  }
}

/**
 * Reset pattern voice state (for new game)
 */
export function resetPatternVoiceState(): void {
  recentVoices.clear()
  nodesSinceLastVoice = GLOBAL_COOLDOWN
}

/**
 * Get pattern display info for UI
 */
export function getPatternDisplayInfo(pattern: PatternType): {
  label: string
  color: string
  icon: string
} {
  const info: Record<PatternType, { label: string; color: string; icon: string }> = {
    analytical: { label: 'ANALYTICAL', color: 'text-blue-400', icon: '🔬' },
    patience: { label: 'PATIENCE', color: 'text-purple-400', icon: '⏳' },
    exploring: { label: 'EXPLORING', color: 'text-green-400', icon: '🧭' },
    helping: { label: 'HELPING', color: 'text-amber-400', icon: '🤝' },
    building: { label: 'BUILDING', color: 'text-orange-400', icon: '🔧' }
  }
  return info[pattern]
}
