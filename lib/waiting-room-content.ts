/**
 * Waiting Room Content System
 *
 * IDEA 005: The Waiting Room (Patience Mechanic)
 *
 * Philosophy: Lingering at locations unlocks hidden content.
 * Rewards patience pattern organically. Stillness has power.
 *
 * Content reveals at timed thresholds (30s, 60s, 120s).
 * These are bonus discoveries, not essential content.
 */

import type { CharacterId } from './graph-registry'
import type { PatternType } from './patterns'

/**
 * A hidden content piece revealed through patience
 */
export interface WaitingRoomReveal {
  /** Unique identifier */
  id: string

  /** Seconds of stillness required to unlock */
  threshold: 30 | 60 | 120

  /** The revealed content */
  content: {
    /** Type of revelation */
    type: 'ambient' | 'memory' | 'whisper' | 'insight'
    /** The text to display */
    text: string
    /** Optional speaker (for whispers) */
    speaker?: string
  }

  /** Pattern reward for patience */
  patternReward?: {
    pattern: PatternType
    amount: number
  }

  /** Optional: Add a knowledge flag when revealed */
  addKnowledgeFlag?: string

  /** Optional: Only show once per session */
  oneShot?: boolean
}

/**
 * Waiting room content by character/location
 */
export const WAITING_ROOM_CONTENT: Partial<Record<CharacterId | 'samuel_hub', WaitingRoomReveal[]>> = {
  samuel_hub: [
    {
      id: 'samuel_hub_30s',
      threshold: 30,
      content: {
        type: 'ambient',
        text: 'The station hums. Not machinery—something older. As if the walls themselves are breathing.',
      },
      patternReward: { pattern: 'patience', amount: 0.5 },
    },
    {
      id: 'samuel_hub_60s',
      threshold: 60,
      content: {
        type: 'whisper',
        text: 'Those who rush miss the architecture. The station reveals itself to those who wait.',
        speaker: 'Samuel',
      },
      patternReward: { pattern: 'patience', amount: 1 },
      oneShot: true,
    },
    {
      id: 'samuel_hub_120s',
      threshold: 120,
      content: {
        type: 'insight',
        text: 'You notice it now—the schedules on the board don\'t quite match the clocks. Time moves differently here.',
      },
      patternReward: { pattern: 'patience', amount: 1.5 },
      addKnowledgeFlag: 'noticed_time_anomaly',
      oneShot: true,
    },
  ],

  maya: [
    {
      id: 'maya_30s',
      threshold: 30,
      content: {
        type: 'ambient',
        text: 'Maya\'s fingers hover over her keyboard, but she\'s not typing. She\'s thinking.',
      },
      patternReward: { pattern: 'patience', amount: 0.5 },
    },
    {
      id: 'maya_60s',
      threshold: 60,
      content: {
        type: 'memory',
        text: 'You remember: sometimes the best code comes after you stop trying to write it.',
      },
      patternReward: { pattern: 'patience', amount: 1 },
    },
    {
      id: 'maya_120s',
      threshold: 120,
      content: {
        type: 'whisper',
        text: 'Most people want answers. You\'re the first to just... sit with the question.',
        speaker: 'Maya',
      },
      patternReward: { pattern: 'patience', amount: 1.5 },
      addKnowledgeFlag: 'maya_noticed_patience',
      oneShot: true,
    },
  ],

  devon: [
    {
      id: 'devon_30s',
      threshold: 30,
      content: {
        type: 'ambient',
        text: 'The workshop smells of solder and possibility. Devon\'s blueprints cover every surface.',
      },
      patternReward: { pattern: 'patience', amount: 0.5 },
    },
    {
      id: 'devon_60s',
      threshold: 60,
      content: {
        type: 'memory',
        text: 'You notice the half-finished projects. Each one a question Devon hasn\'t answered yet.',
      },
      patternReward: { pattern: 'patience', amount: 1 },
    },
    {
      id: 'devon_120s',
      threshold: 120,
      content: {
        type: 'insight',
        text: 'One blueprint catches your eye—it\'s not a machine. It\'s a map of relationships. People Devon wants to help.',
      },
      patternReward: { pattern: 'patience', amount: 1.5 },
      addKnowledgeFlag: 'saw_devon_relationship_map',
      oneShot: true,
    },
  ],

  marcus: [
    {
      id: 'marcus_30s',
      threshold: 30,
      content: {
        type: 'ambient',
        text: 'Marcus checks his watch—not anxiously, but with the precision of someone who measures moments.',
      },
      patternReward: { pattern: 'patience', amount: 0.5 },
    },
    {
      id: 'marcus_60s',
      threshold: 60,
      content: {
        type: 'whisper',
        text: 'In medicine, we call it watchful waiting. Sometimes the best intervention is presence.',
        speaker: 'Marcus',
      },
      patternReward: { pattern: 'patience', amount: 1 },
    },
  ],

  rohan: [
    {
      id: 'rohan_30s',
      threshold: 30,
      content: {
        type: 'ambient',
        text: 'Rohan\'s screens glow with data streams. Patterns within patterns within patterns.',
      },
      patternReward: { pattern: 'patience', amount: 0.5 },
    },
    {
      id: 'rohan_60s',
      threshold: 60,
      content: {
        type: 'memory',
        text: 'The data doesn\'t speak to everyone. It speaks to those who listen long enough.',
      },
      patternReward: { pattern: 'patience', amount: 1 },
    },
    {
      id: 'rohan_120s',
      threshold: 120,
      content: {
        type: 'insight',
        text: 'You see it now—a hidden correlation in the data. Rohan smiles. "You noticed."',
      },
      patternReward: { pattern: 'patience', amount: 1.5 },
      addKnowledgeFlag: 'rohan_shared_insight',
      oneShot: true,
    },
  ],

  tess: [
    {
      id: 'tess_30s',
      threshold: 30,
      content: {
        type: 'ambient',
        text: 'Tess is mid-thought, her pen tracing invisible diagrams in the air.',
      },
      patternReward: { pattern: 'patience', amount: 0.5 },
    },
    {
      id: 'tess_60s',
      threshold: 60,
      content: {
        type: 'whisper',
        text: 'Education isn\'t about filling time. It\'s about creating space for growth.',
        speaker: 'Tess',
      },
      patternReward: { pattern: 'patience', amount: 1 },
    },
  ],

  jordan: [
    {
      id: 'jordan_30s',
      threshold: 30,
      content: {
        type: 'ambient',
        text: 'Jordan\'s workspace is organized chaos—every sticky note a possibility, every arrow a path.',
      },
      patternReward: { pattern: 'patience', amount: 0.5 },
    },
    {
      id: 'jordan_60s',
      threshold: 60,
      content: {
        type: 'memory',
        text: 'Career paths aren\'t linear. They\'re discovered by those patient enough to explore the detours.',
      },
      patternReward: { pattern: 'patience', amount: 1 },
    },
  ],
}

/**
 * Get waiting room reveals for a character/location
 */
export function getWaitingRoomContent(characterId: string): WaitingRoomReveal[] {
  // Check for hub first
  if (characterId === 'samuel' || characterId === 'samuel_hub') {
    return WAITING_ROOM_CONTENT.samuel_hub || []
  }
  return WAITING_ROOM_CONTENT[characterId as CharacterId] || []
}

/**
 * Get reveals that should trigger at or before a given time threshold
 */
export function getRevealsForTime(
  characterId: string,
  elapsedSeconds: number,
  alreadyRevealed: Set<string>
): WaitingRoomReveal[] {
  const content = getWaitingRoomContent(characterId)
  return content.filter(reveal =>
    reveal.threshold <= elapsedSeconds &&
    !alreadyRevealed.has(reveal.id)
  )
}

/**
 * Check if a character has any waiting room content
 */
export function hasWaitingRoomContent(characterId: string): boolean {
  return getWaitingRoomContent(characterId).length > 0
}
