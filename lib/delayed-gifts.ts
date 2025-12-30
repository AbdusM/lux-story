/**
 * Delayed Gifts System
 *
 * Player actions create "gifts" that reveal themselves in future conversations.
 * Creates satisfying "your choice mattered" moments with different characters.
 *
 * Philosophy:
 * - Choices ripple outward to other characters
 * - Gifts surface naturally in conversation (not forced)
 * - Each gift is unique - once delivered, it's consumed
 * - Creates connection between otherwise siloed arcs
 */

import type { CharacterId } from './graph-registry'
import type { GameState } from './character-state'

/**
 * Types of delayed gifts
 */
export type DelayedGiftType =
  | 'callback'      // Direct reference to player's past action
  | 'reference'     // Character mentions another character
  | 'thank_you'     // Indirect thanks through third party
  | 'perspective'   // Character offers new angle on past event

/**
 * A delayed gift waiting to be delivered
 */
export interface DelayedGift {
  id: string                        // Unique identifier
  sourceChoice: string              // What triggered this (choice ID)
  sourceCharacter: CharacterId      // Who the original interaction was with
  targetCharacter: CharacterId      // Who will deliver this gift
  delayInteractions: number         // Surfaces after N interactions
  interactionsRemaining: number     // Countdown
  giftType: DelayedGiftType
  content: {
    text: string
    emotion?: string
  }
  consumed: boolean                 // Once shown, don't repeat
  createdAt: number                 // Timestamp for ordering
}

/**
 * Serializable version for persistence
 */
export interface SerializableDelayedGift {
  id: string
  sourceChoice: string
  sourceCharacter: string
  targetCharacter: string
  delayInteractions: number
  interactionsRemaining: number
  giftType: DelayedGiftType
  content: {
    text: string
    emotion?: string
  }
  consumed: boolean
  createdAt: number
}

/**
 * Gift registry - maps choices to gifts they create
 * When player makes these choices, corresponding gifts are queued
 */
export interface GiftTrigger {
  /** Choice ID that triggers this gift */
  choiceId: string
  /** Character context for the choice */
  sourceCharacter: CharacterId
  /** Who will deliver the gift */
  targetCharacter: CharacterId
  /** Interactions before gift surfaces */
  delay: number
  /** Type of gift */
  giftType: DelayedGiftType
  /** Content of the gift */
  content: {
    text: string
    emotion?: string
  }
}

/**
 * Gift trigger registry
 * Add entries here when you want a choice to create a delayed gift
 */
export const GIFT_TRIGGERS: GiftTrigger[] = [
  // ============= MAYA'S ARC → SAMUEL =============
  {
    choiceId: 'maya_encourage_patience',
    sourceCharacter: 'maya',
    targetCharacter: 'samuel',
    delay: 2,
    giftType: 'reference',
    content: {
      text: "Maya told me about your advice. 'Take your time,' she said you told her. She seemed lighter after that.",
      emotion: 'knowing'
    }
  },
  {
    choiceId: 'maya_support_robots',
    sourceCharacter: 'maya',
    targetCharacter: 'samuel',
    delay: 3,
    giftType: 'callback',
    content: {
      text: "That robot of Maya's—she showed it to me. Said someone finally understood why she builds things. That was you.",
      emotion: 'warm'
    }
  },

  // ============= MAYA'S ARC → DEVON =============
  {
    choiceId: 'maya_arc_complete',
    sourceCharacter: 'maya',
    targetCharacter: 'devon',
    delay: 2,
    giftType: 'perspective',
    content: {
      text: "Maya mentioned you. Said you didn't try to fix her—just listened. That's... harder than it sounds. I'm learning that.",
      emotion: 'reflective'
    }
  },

  // ============= DEVON'S ARC → SAMUEL =============
  {
    choiceId: 'devon_validate_feelings',
    sourceCharacter: 'devon',
    targetCharacter: 'samuel',
    delay: 3,
    giftType: 'reference',
    content: {
      text: "Devon's been different lately. Less... calculated. Said someone showed him there's value in what can't be measured. That was you.",
      emotion: 'knowing'
    }
  },
  {
    choiceId: 'devon_arc_complete',
    sourceCharacter: 'devon',
    targetCharacter: 'maya',
    delay: 2,
    giftType: 'perspective',
    content: {
      text: "Devon mentioned you helped him see something. About systems and feelings. He never talks like that. You got through to him.",
      emotion: 'curious'
    }
  },

  // ============= ELENA'S ARC → SAMUEL =============
  {
    choiceId: 'elena_acknowledge_skill',
    sourceCharacter: 'elena',
    targetCharacter: 'samuel',
    delay: 2,
    giftType: 'reference',
    content: {
      text: "Elena fixed the light in the waiting area. She doesn't usually do extras. Said someone reminded her why she learned this trade.",
      emotion: 'warm'
    }
  },
  {
    choiceId: 'elena_arc_complete',
    sourceCharacter: 'elena',
    targetCharacter: 'grace',
    delay: 3,
    giftType: 'thank_you',
    content: {
      text: "The electrician—Elena. She mentioned you. Said you understand that some work matters even when no one sees it. Takes one to know one.",
      emotion: 'gentle'
    }
  },

  // ============= GRACE'S ARC → SAMUEL =============
  {
    choiceId: 'grace_give_space',
    sourceCharacter: 'grace',
    targetCharacter: 'samuel',
    delay: 2,
    giftType: 'reference',
    content: {
      text: "Grace mentioned your patience. Said you sat with her without pushing. That's rare. Most folks rush toward solutions.",
      emotion: 'reflective'
    }
  },
  {
    choiceId: 'grace_arc_complete',
    sourceCharacter: 'grace',
    targetCharacter: 'elena',
    delay: 3,
    giftType: 'perspective',
    content: {
      text: "Grace told me about your conversation. The one about presence. She's... different now. Settled. What did you say to her?",
      emotion: 'curious'
    }
  },

  // ============= MARCUS'S ARC → SAMUEL =============
  {
    choiceId: 'marcus_validate_exhaustion',
    sourceCharacter: 'marcus',
    targetCharacter: 'samuel',
    delay: 2,
    giftType: 'reference',
    content: {
      text: "Marcus seems less... heavy. Said someone understood the weight of the machines. The responsibility. That was you.",
      emotion: 'knowing'
    }
  },
  {
    choiceId: 'marcus_arc_complete',
    sourceCharacter: 'marcus',
    targetCharacter: 'maya',
    delay: 3,
    giftType: 'perspective',
    content: {
      text: "Marcus mentioned you helped him see something about purpose and calling. He doesn't open up easily. You did good.",
      emotion: 'warm'
    }
  },

  // ============= TESS'S ARC → SAMUEL =============
  {
    choiceId: 'tess_support_dream',
    sourceCharacter: 'tess',
    targetCharacter: 'samuel',
    delay: 2,
    giftType: 'reference',
    content: {
      text: "Tess played me that demo she's been working on. Said someone believed in her vision before it was finished. That courage spreads.",
      emotion: 'warm'
    }
  },

  // ============= ROHAN'S ARC → SAMUEL =============
  {
    choiceId: 'rohan_sit_with_uncertainty',
    sourceCharacter: 'rohan',
    targetCharacter: 'samuel',
    delay: 3,
    giftType: 'reference',
    content: {
      text: "Rohan's been contemplating something. Said someone showed him that uncertainty isn't weakness—it's honesty. Philosophy needs that.",
      emotion: 'reflective'
    }
  },

  // ============= YAQUIN'S ARC → SAMUEL =============
  {
    choiceId: 'yaquin_acknowledge_burnout',
    sourceCharacter: 'yaquin',
    targetCharacter: 'samuel',
    delay: 2,
    giftType: 'reference',
    content: {
      text: "Yaquin's been taking more breaks. Said someone reminded her that teaching includes teaching yourself to rest. About time.",
      emotion: 'knowing'
    }
  }
]

/**
 * In-memory gift queue (would typically be stored in GameState)
 * For persistence, serialize and store in localStorage
 */
let giftQueue: DelayedGift[] = []

/**
 * Generate a unique gift ID
 */
function generateGiftId(): string {
  return `gift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Queue a new gift based on a choice
 */
export function queueGiftForChoice(
  choiceId: string,
  sourceCharacter: CharacterId
): DelayedGift | null {
  // Find matching trigger
  const trigger = GIFT_TRIGGERS.find(
    t => t.choiceId === choiceId && t.sourceCharacter === sourceCharacter
  )

  if (!trigger) return null

  // Check if this gift is already queued (avoid duplicates)
  const existingGift = giftQueue.find(
    g => g.sourceChoice === choiceId &&
         g.sourceCharacter === sourceCharacter &&
         g.targetCharacter === trigger.targetCharacter &&
         !g.consumed
  )

  if (existingGift) return null

  const gift: DelayedGift = {
    id: generateGiftId(),
    sourceChoice: trigger.choiceId,
    sourceCharacter: trigger.sourceCharacter,
    targetCharacter: trigger.targetCharacter,
    delayInteractions: trigger.delay,
    interactionsRemaining: trigger.delay,
    giftType: trigger.giftType,
    content: trigger.content,
    consumed: false,
    createdAt: Date.now()
  }

  giftQueue.push(gift)
  return gift
}

/**
 * Queue a gift from arc completion flag
 * Called when arc_complete flags are set
 */
export function queueGiftsForArcComplete(
  characterId: CharacterId
): DelayedGift[] {
  const arcChoiceId = `${characterId}_arc_complete`
  const newGifts: DelayedGift[] = []

  // Find all triggers for this arc completion
  const triggers = GIFT_TRIGGERS.filter(t => t.choiceId === arcChoiceId)

  for (const trigger of triggers) {
    const gift = queueGiftForChoice(arcChoiceId, trigger.sourceCharacter)
    if (gift) newGifts.push(gift)
  }

  return newGifts
}

/**
 * Decrement interaction counters after a character interaction
 */
export function tickGiftCounters(): void {
  for (const gift of giftQueue) {
    if (!gift.consumed && gift.interactionsRemaining > 0) {
      gift.interactionsRemaining--
    }
  }
}

/**
 * Get gifts ready to deliver for a specific character
 */
export function getReadyGiftsForCharacter(
  characterId: CharacterId
): DelayedGift[] {
  return giftQueue.filter(
    gift =>
      gift.targetCharacter === characterId &&
      gift.interactionsRemaining <= 0 &&
      !gift.consumed
  ).sort((a, b) => a.createdAt - b.createdAt) // Oldest first
}

/**
 * Mark a gift as consumed (delivered)
 */
export function consumeGift(giftId: string): boolean {
  const gift = giftQueue.find(g => g.id === giftId)
  if (gift) {
    gift.consumed = true
    return true
  }
  return false
}

/**
 * Get all pending gifts (for debugging/admin)
 */
export function getAllPendingGifts(): DelayedGift[] {
  return giftQueue.filter(g => !g.consumed)
}

/**
 * Serialize gift queue for persistence
 */
export function serializeGiftQueue(): SerializableDelayedGift[] {
  return giftQueue.map(gift => ({
    id: gift.id,
    sourceChoice: gift.sourceChoice,
    sourceCharacter: gift.sourceCharacter as string,
    targetCharacter: gift.targetCharacter as string,
    delayInteractions: gift.delayInteractions,
    interactionsRemaining: gift.interactionsRemaining,
    giftType: gift.giftType,
    content: gift.content,
    consumed: gift.consumed,
    createdAt: gift.createdAt
  }))
}

/**
 * Deserialize and restore gift queue
 */
export function deserializeGiftQueue(serialized: SerializableDelayedGift[]): void {
  giftQueue = serialized.map(s => ({
    id: s.id,
    sourceChoice: s.sourceChoice,
    sourceCharacter: s.sourceCharacter as CharacterId,
    targetCharacter: s.targetCharacter as CharacterId,
    delayInteractions: s.delayInteractions,
    interactionsRemaining: s.interactionsRemaining,
    giftType: s.giftType,
    content: s.content,
    consumed: s.consumed,
    createdAt: s.createdAt
  }))
}

/**
 * Clear all gifts (for new game)
 */
export function resetGiftQueue(): void {
  giftQueue = []
}

/**
 * Integration helper: Check if any gifts are ready for a character
 * Use this when entering a conversation to prepend gift dialogue
 */
export function checkForPendingGifts(
  characterId: CharacterId,
  _gameState: GameState
): { hasGifts: boolean; gifts: DelayedGift[] } {
  const gifts = getReadyGiftsForCharacter(characterId)
  return {
    hasGifts: gifts.length > 0,
    gifts
  }
}

/**
 * Format gift as Samuel-style dialogue
 * For use when Samuel delivers a gift about another character
 */
export function formatGiftAsSamuelDialogue(gift: DelayedGift): string {
  const characterNames: Record<string, string> = {
    maya: 'Maya',
    devon: 'Devon',
    elena: 'Elena',
    grace: 'Grace',
    marcus: 'Marcus',
    tess: 'Tess',
    yaquin: 'Yaquin',
    rohan: 'Rohan',
    jordan: 'Jordan',
    kai: 'Kai',
    silas: 'Silas',
    alex: 'Alex'
  }

  const sourceName = characterNames[gift.sourceCharacter] || gift.sourceCharacter
  const prefix = `Speaking of ${sourceName}...`

  return `${prefix}\n\n${gift.content.text}`
}

/**
 * Format gift for direct delivery by target character
 */
export function formatGiftAsDirectDialogue(gift: DelayedGift): string {
  return gift.content.text
}
