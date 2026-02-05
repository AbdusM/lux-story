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
 *
 * D-003: Trust-Based Voice Tone
 * Voice intensity changes based on trust with current character.
 * Low trust = whispered doubts. High trust = confident assertions.
 */

import type { PatternType } from './patterns'
import type { CharacterId } from './graph-registry'
import type { GameState } from './character-state'
import { getVoiceToneForTrust, formatVoiceWithTone, type VoiceTone } from './trust-derivatives'
import { random, randomPick } from './seeded-random'
import { getActiveVoiceConflicts, type VoiceConflict } from './pattern-derivatives'

/**
 * When a pattern voice should trigger
 */
export type PatternVoiceTrigger = 'node_enter' | 'before_choices' | 'npc_emotion'

/**
 * How the pattern voice should be styled
 * D-003: Extended with trust-derived tones (speak, command)
 */
export type PatternVoiceStyle = 'whisper' | 'speak' | 'urge' | 'command' | 'observation'

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
 * D-003: Extended with trust-derived intensity and tone
 */
export interface PatternVoiceResult {
  pattern: PatternType
  text: string
  style: PatternVoiceStyle
  /** D-003: Trust-derived voice tone */
  trustTone?: VoiceTone
  /** D-003: Voice intensity 0-1 based on trust */
  intensity?: number
}

/**
 * Context for evaluating pattern voices
 * D-003: Extended with trust for tone calculation
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
  /** D-003: Current trust with character for tone derivation */
  characterTrust?: number
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

  // Select random voice line from options (TD-007: use seeded random)
  const voiceText = randomPick(selected.entry.voices)!

  // Update cooldowns
  const voiceKey = `${selected.entry.pattern}-${selected.entry.trigger}-${selected.entry.condition?.characterId || 'any'}`
  recentVoices.set(voiceKey, 1)
  nodesSinceLastVoice = 0

  // D-003: Calculate trust-based tone and intensity
  const trust = context.characterTrust ?? 5 // Default to middle trust
  const trustTone = getVoiceToneForTrust(trust)
  const { text: formattedText, intensity } = formatVoiceWithTone(
    selected.entry.pattern,
    voiceText,
    trust
  )

  // D-003: Use trust-derived tone for styling when appropriate
  // Trust tone overrides entry style for whisper/command (extreme trust)
  // Otherwise preserve the authored style
  const effectiveStyle: PatternVoiceStyle =
    trustTone === 'whisper' ? 'whisper' :
    trustTone === 'command' ? 'command' :
    selected.entry.style

  return {
    pattern: selected.entry.pattern,
    text: formattedText,
    style: effectiveStyle,
    trustTone,
    intensity
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

// ═══════════════════════════════════════════════════════════════════════════
// D-096: VOICE CONFLICTS
// When two strong patterns disagree, show both arguments
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Result when voices conflict (D-096)
 */
export interface VoiceConflictResult {
  type: 'conflict'
  conflictId: string
  situation: string
  voices: {
    pattern: PatternType
    argument: string
    tone: 'urging' | 'warning' | 'questioning' | 'suggesting'
  }[]
}

// Track shown conflicts to avoid repetition
const shownConflicts = new Set<string>()

/**
 * Check if a voice conflict should trigger (D-096)
 * Returns a conflict when player has two competing strong patterns
 */
export function checkVoiceConflict(
  gameState: GameState
): VoiceConflictResult | null {
  // Only check occasionally (10% chance to avoid spam)
  // TD-007: Use seeded random for testability
  if (random() > 0.1) return null

  const activeConflicts = getActiveVoiceConflicts(gameState.patterns, shownConflicts)

  if (activeConflicts.length === 0) return null

  // Pick the first active conflict
  const conflict = activeConflicts[0]

  // Mark as shown
  shownConflicts.add(conflict.id)

  return {
    type: 'conflict',
    conflictId: conflict.id,
    situation: conflict.situation,
    voices: conflict.voices
  }
}

/**
 * Reset voice conflict tracking (for new game)
 */
export function resetVoiceConflictState(): void {
  shownConflicts.clear()
}

// Re-export VoiceConflict type for external use
export type { VoiceConflict }

// ═══════════════════════════════════════════════════════════════════════════
// B7: VOICE PROGRESSION STAGES
// Pattern level determines voice strength: whisper → speak → command
// ═══════════════════════════════════════════════════════════════════════════

import { PATTERN_THRESHOLDS } from './patterns'

/**
 * Voice progression stages tied to pattern thresholds
 */
export type VoiceStage = 'dormant' | 'whisper' | 'speak' | 'command'

/**
 * Metadata for each voice stage
 */
export const VOICE_STAGE_META: Record<VoiceStage, {
  label: string
  description: string
  intensity: number // 0-1
  icon: string
}> = {
  dormant: {
    label: 'Dormant',
    description: 'This voice has not yet awakened',
    intensity: 0,
    icon: '💤'
  },
  whisper: {
    label: 'Whisper',
    description: 'A faint voice emerges in quiet moments',
    intensity: 0.33,
    icon: '🌱'
  },
  speak: {
    label: 'Speak',
    description: 'The voice speaks with growing confidence',
    intensity: 0.66,
    icon: '🌿'
  },
  command: {
    label: 'Command',
    description: 'This voice shapes how you see the world',
    intensity: 1.0,
    icon: '🌟'
  }
}

/**
 * Get voice stage from pattern level
 * Maps EMERGING/DEVELOPING/FLOURISHING thresholds to whisper/speak/command
 */
export function getVoiceStage(patternLevel: number): VoiceStage {
  if (patternLevel >= PATTERN_THRESHOLDS.FLOURISHING) {
    return 'command'
  }
  if (patternLevel >= PATTERN_THRESHOLDS.DEVELOPING) {
    return 'speak'
  }
  if (patternLevel >= PATTERN_THRESHOLDS.EMERGING) {
    return 'whisper'
  }
  return 'dormant'
}

/**
 * Get voice stages for all patterns
 */
export function getAllVoiceStages(patterns: Record<PatternType, number>): Record<PatternType, VoiceStage> {
  return {
    analytical: getVoiceStage(patterns.analytical || 0),
    patience: getVoiceStage(patterns.patience || 0),
    exploring: getVoiceStage(patterns.exploring || 0),
    helping: getVoiceStage(patterns.helping || 0),
    building: getVoiceStage(patterns.building || 0)
  }
}

/**
 * Get progress towards next voice stage
 * Returns 0-1 progress within current stage
 */
export function getVoiceStageProgress(patternLevel: number): {
  stage: VoiceStage
  progress: number
  nextStage: VoiceStage | null
  thresholdToNext: number | null
} {
  const stage = getVoiceStage(patternLevel)

  if (stage === 'dormant') {
    return {
      stage,
      progress: patternLevel / PATTERN_THRESHOLDS.EMERGING,
      nextStage: 'whisper',
      thresholdToNext: PATTERN_THRESHOLDS.EMERGING
    }
  }

  if (stage === 'whisper') {
    const rangeStart = PATTERN_THRESHOLDS.EMERGING
    const rangeEnd = PATTERN_THRESHOLDS.DEVELOPING
    return {
      stage,
      progress: (patternLevel - rangeStart) / (rangeEnd - rangeStart),
      nextStage: 'speak',
      thresholdToNext: PATTERN_THRESHOLDS.DEVELOPING
    }
  }

  if (stage === 'speak') {
    const rangeStart = PATTERN_THRESHOLDS.DEVELOPING
    const rangeEnd = PATTERN_THRESHOLDS.FLOURISHING
    return {
      stage,
      progress: (patternLevel - rangeStart) / (rangeEnd - rangeStart),
      nextStage: 'command',
      thresholdToNext: PATTERN_THRESHOLDS.FLOURISHING
    }
  }

  // Command stage - maxed out
  return {
    stage,
    progress: 1.0,
    nextStage: null,
    thresholdToNext: null
  }
}
