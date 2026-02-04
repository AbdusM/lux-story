/**
 * Ceremony System Module
 *
 * Recognition moments where Samuel acknowledges player progression.
 * Combines anime rank reveal moments with Samuel's mentor role.
 *
 * @module lib/ranking/ceremonies
 */

import type { PatternType } from '@/lib/patterns'
import type { CeremonyType, CeremonyRecord, CeremonyState } from './types'

// ═══════════════════════════════════════════════════════════════════════════
// CEREMONY TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Visual backdrop for ceremony presentation
 */
export type CeremonyBackdrop =
  | 'station_platform'
  | 'private_office'
  | 'grand_hall'
  | 'constellation_view'

/**
 * Lighting style for ceremony
 */
export type CeremonyLighting = 'warm' | 'cool' | 'dramatic' | 'soft'

/**
 * Player response option in ceremony
 */
export interface CeremonyResponse {
  id: string
  text: string
  samuelReply: string
  patterns?: PatternType[]
}

/**
 * Ceremony dialogue structure
 */
export interface CeremonyDialogue {
  opening: string
  recognition: string
  reflection: string
  blessing: string
  responses?: CeremonyResponse[]
}

/**
 * Ceremony presentation settings
 */
export interface CeremonyPresentation {
  backdrop: CeremonyBackdrop
  lighting: CeremonyLighting
  duration: number
}

/**
 * Full ceremony definition
 */
export interface Ceremony {
  id: string
  type: CeremonyType
  name: string
  triggerId: string
  priority: number
  oneTime: boolean
  presentation: CeremonyPresentation
  dialogue: CeremonyDialogue
}

// ═══════════════════════════════════════════════════════════════════════════
// CEREMONY REGISTRY
// ═══════════════════════════════════════════════════════════════════════════

export const CEREMONY_REGISTRY: Ceremony[] = [
  // Pattern Mastery Promotions
  {
    id: 'ceremony_passenger',
    type: 'rank_promotion',
    name: 'Passenger Recognition',
    triggerId: 'pm_passenger',
    priority: 80,
    oneTime: true,
    presentation: {
      backdrop: 'station_platform',
      lighting: 'warm',
      duration: 45
    },
    dialogue: {
      opening: "Wait. Stop for a moment.",
      recognition: "I've been watching you, you know. The way you move through this place. The questions you ask. The choices you make.",
      reflection: "Most people who come here—they rush. They want answers before they understand the questions. But you... you're finding your rhythm.",
      blessing: "You're not just passing through anymore. You're becoming a Passenger. That means something here.",
      responses: [
        {
          id: 'curious',
          text: "What does it mean?",
          samuelReply: "It means the station has noticed you. And when this place notices someone... things start to happen.",
          patterns: ['exploring']
        },
        {
          id: 'humble',
          text: "I'm just trying to figure things out.",
          samuelReply: "That's exactly it. Most people think they already know. You're willing to discover.",
          patterns: ['patience']
        },
        {
          id: 'grateful',
          text: "I appreciate you saying that.",
          samuelReply: "I don't say things I don't mean. Remember that.",
          patterns: ['helping']
        }
      ]
    }
  },

  {
    id: 'ceremony_regular',
    type: 'rank_promotion',
    name: 'Regular Recognition',
    triggerId: 'pm_regular',
    priority: 85,
    oneTime: true,
    presentation: {
      backdrop: 'private_office',
      lighting: 'soft',
      duration: 50
    },
    dialogue: {
      opening: "Come in. Close the door.",
      recognition: "I've seen a lot of travelers pass through this station. Most of them, I forget. Some of them, I remember. You? I remember.",
      reflection: "The Regulars... they're different. They don't just visit—they belong. They understand that this place isn't about destinations. It's about the journey of becoming.",
      blessing: "Welcome to the Regulars. You've earned this. Now... the real work begins.",
      responses: [
        {
          id: 'curious',
          text: "What real work?",
          samuelReply: "Helping others find their way. The station gives, but it also asks.",
          patterns: ['helping']
        },
        {
          id: 'ready',
          text: "I'm ready.",
          samuelReply: "I believe you are. That's rare.",
          patterns: ['building']
        },
        {
          id: 'grateful',
          text: "Thank you for believing in me.",
          samuelReply: "I don't believe in you. I see you. There's a difference.",
          patterns: ['patience']
        }
      ]
    }
  },

  {
    id: 'ceremony_conductor',
    type: 'rank_promotion',
    name: 'Conductor Recognition',
    triggerId: 'pm_conductor',
    priority: 90,
    oneTime: true,
    presentation: {
      backdrop: 'grand_hall',
      lighting: 'dramatic',
      duration: 60
    },
    dialogue: {
      opening: "Follow me. There's something I want to show you.",
      recognition: "This hall... most people never see it. The Conductors built it, generations ago. A reminder that the journey matters more than any destination.",
      reflection: "You guide your own journey now. But more than that—you're learning to guide others. That's what a Conductor does.",
      blessing: "Take this knowing: You've earned a place here that few ever reach. Use it wisely.",
      responses: [
        {
          id: 'committed',
          text: "I'll try to live up to it.",
          samuelReply: "Don't try. Do. You're past trying.",
          patterns: ['building', 'patience']
        },
        {
          id: 'curious',
          text: "How do I guide others?",
          samuelReply: "The same way you found your own path. By listening. By being present. By asking the right questions.",
          patterns: ['helping', 'exploring']
        },
        {
          id: 'overwhelmed',
          text: "This is... a lot to take in.",
          samuelReply: "It should be. Growth that feels easy wasn't growth at all.",
          patterns: ['analytical', 'patience']
        }
      ]
    }
  },

  {
    id: 'ceremony_stationmaster',
    type: 'rank_promotion',
    name: 'Station Master Recognition',
    triggerId: 'pm_stationmaster',
    priority: 100,
    oneTime: true,
    presentation: {
      backdrop: 'constellation_view',
      lighting: 'cool',
      duration: 75
    },
    dialogue: {
      opening: "Look up. Do you see them? The constellations above the station?",
      recognition: "Every light up there... someone who came through this place and left their mark. Someone who became more than they were when they arrived.",
      reflection: "Station Master. It's not a title I give often. Some say I've only given it a handful of times in all my years here.",
      blessing: "This place is part of you now. You are part of it. What you do next... that's between you and the universe.",
      responses: [
        {
          id: 'humble',
          text: "I don't know what to say.",
          samuelReply: "You don't have to say anything. Your actions have already spoken.",
          patterns: ['patience']
        },
        {
          id: 'curious',
          text: "What happens now?",
          samuelReply: "Now? Now you live it. Every day, every choice. The station doesn't end here.",
          patterns: ['exploring', 'building']
        },
        {
          id: 'grateful',
          text: "Thank you, Samuel. For everything.",
          samuelReply: "*Samuel simply nods, a rare smile crossing his face*",
          patterns: ['helping']
        }
      ]
    }
  },

  // Champion Recognition
  {
    id: 'ceremony_champion',
    type: 'champion_recognition',
    name: 'Champion Recognition',
    triggerId: 'first_champion',
    priority: 88,
    oneTime: true,
    presentation: {
      backdrop: 'grand_hall',
      lighting: 'warm',
      duration: 55
    },
    dialogue: {
      opening: "I heard about your achievement.",
      recognition: "A Champion in your field. That's not something that happens by accident. It takes dedication, focus, and something more.",
      reflection: "The people you've connected with, the knowledge you've gained... it all led here. To this moment of recognition.",
      blessing: "Wear this title with pride, but never stop growing. Champions who rest become former champions.",
      responses: [
        {
          id: 'determined',
          text: "I won't stop.",
          samuelReply: "I know. That's why you're a Champion.",
          patterns: ['building']
        },
        {
          id: 'humble',
          text: "I had help along the way.",
          samuelReply: "True strength recognizes the strength of others. Well said.",
          patterns: ['helping']
        }
      ]
    }
  },

  // Elite Status Recognition
  {
    id: 'ceremony_elite',
    type: 'elite_induction',
    name: 'Elite Recognition',
    triggerId: 'first_elite',
    priority: 95,
    oneTime: true,
    presentation: {
      backdrop: 'constellation_view',
      lighting: 'dramatic',
      duration: 65
    },
    dialogue: {
      opening: "There's something rare about you. I've been waiting to say this.",
      recognition: "Elite status. It's not a rank—it's a designation. A mark of someone who has transcended ordinary boundaries.",
      reflection: "Few travelers ever achieve this. Fewer still understand what it truly means. You've earned the right to stand among legends.",
      blessing: "The elite don't just complete the journey. They become part of the station's story. Forever.",
      responses: [
        {
          id: 'honored',
          text: "I'm honored.",
          samuelReply: "The honor is mine, to have witnessed your journey.",
          patterns: ['patience']
        },
        {
          id: 'curious',
          text: "What does this unlock?",
          samuelReply: "Doors that were invisible before. Paths that only appear to those who've proven themselves.",
          patterns: ['exploring']
        }
      ]
    }
  },

  // Milestone Celebration
  {
    id: 'ceremony_milestone',
    type: 'milestone_celebration',
    name: 'Journey Milestone',
    triggerId: 'major_milestone',
    priority: 75,
    oneTime: false,
    presentation: {
      backdrop: 'station_platform',
      lighting: 'warm',
      duration: 40
    },
    dialogue: {
      opening: "A moment, if you have one.",
      recognition: "Look how far you've come. When you first arrived, you were searching. Now? Now you're finding.",
      reflection: "Milestones matter. Not because of what they are, but because of what they represent. Growth. Change. Becoming.",
      blessing: "Keep going. The next milestone is already waiting for you.",
      responses: [
        {
          id: 'motivated',
          text: "I can't wait to see what's next.",
          samuelReply: "That's the spirit that brought you here.",
          patterns: ['exploring']
        },
        {
          id: 'reflective',
          text: "It's been quite a journey.",
          samuelReply: "And it's only just beginning.",
          patterns: ['patience']
        }
      ]
    }
  }
]

// ═══════════════════════════════════════════════════════════════════════════
// CEREMONY LOOKUP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get ceremony by ID
 */
export function getCeremonyById(ceremonyId: string): Ceremony | undefined {
  return CEREMONY_REGISTRY.find(c => c.id === ceremonyId)
}

/**
 * Get ceremonies by type
 */
export function getCeremoniesByType(type: CeremonyType): Ceremony[] {
  return CEREMONY_REGISTRY.filter(c => c.type === type)
}

/**
 * Get ceremony by trigger ID
 */
export function getCeremonyByTriggerId(triggerId: string): Ceremony | undefined {
  return CEREMONY_REGISTRY.find(c => c.triggerId === triggerId)
}

// ═══════════════════════════════════════════════════════════════════════════
// CEREMONY STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default ceremony state
 */
export function createDefaultCeremonyState(): CeremonyState {
  return {
    completedCeremonies: [],
    pendingCeremony: null,
    ceremonyHistory: [],
    lastCeremonyAt: null
  }
}

/**
 * Check if ceremony is completed
 */
export function isCeremonyCompleted(state: CeremonyState, ceremonyId: string): boolean {
  return state.completedCeremonies.includes(ceremonyId)
}

/**
 * Complete a ceremony
 */
export function completeCeremony(
  state: CeremonyState,
  ceremonyId: string,
  responseId?: string,
  now: number = Date.now()
): CeremonyState {
  const record: CeremonyRecord = {
    ceremonyId,
    type: getCeremonyById(ceremonyId)?.type || 'milestone_celebration',
    completedAt: now,
    playerResponseId: responseId
  }

  return {
    ...state,
    completedCeremonies: [...state.completedCeremonies, ceremonyId],
    pendingCeremony: null,
    ceremonyHistory: [...state.ceremonyHistory, record],
    lastCeremonyAt: now
  }
}

/**
 * Set pending ceremony
 */
export function setPendingCeremony(state: CeremonyState, ceremonyId: string | null): CeremonyState {
  return {
    ...state,
    pendingCeremony: ceremonyId
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CEREMONY TRIGGER CHECKING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cooldown between ceremonies (5 minutes)
 */
export const CEREMONY_COOLDOWN = 5 * 60 * 1000

/**
 * Check if cooldown is active
 */
export function isCeremonyCooldownActive(
  state: CeremonyState,
  now: number = Date.now()
): boolean {
  if (!state.lastCeremonyAt) return false
  return now - state.lastCeremonyAt < CEREMONY_COOLDOWN
}

/**
 * Find eligible ceremonies based on trigger IDs
 */
export function findEligibleCeremonies(
  state: CeremonyState,
  triggerIds: string[]
): Ceremony[] {
  return CEREMONY_REGISTRY.filter(ceremony => {
    // Check if trigger matches
    if (!triggerIds.includes(ceremony.triggerId)) return false

    // Check if already completed (for one-time ceremonies)
    if (ceremony.oneTime && state.completedCeremonies.includes(ceremony.id)) {
      return false
    }

    return true
  }).sort((a, b) => b.priority - a.priority)
}

/**
 * Get next ceremony to show
 */
export function getNextCeremony(
  state: CeremonyState,
  triggerIds: string[],
  now: number = Date.now()
): Ceremony | null {
  // Check cooldown
  if (isCeremonyCooldownActive(state, now)) return null

  // If there's a pending ceremony, return it
  if (state.pendingCeremony) {
    return getCeremonyById(state.pendingCeremony) || null
  }

  // Find eligible ceremonies
  const eligible = findEligibleCeremonies(state, triggerIds)

  return eligible[0] || null
}

// ═══════════════════════════════════════════════════════════════════════════
// DISPLAY HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get backdrop style classes
 */
export function getBackdropClasses(backdrop: CeremonyBackdrop): string {
  const backdropStyles: Record<CeremonyBackdrop, string> = {
    station_platform: 'bg-gradient-to-b from-slate-900 via-slate-800 to-amber-900/20',
    private_office: 'bg-gradient-to-b from-slate-900 to-amber-950/30',
    grand_hall: 'bg-gradient-to-b from-indigo-950 via-slate-900 to-amber-900/30',
    constellation_view: 'bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900'
  }
  return backdropStyles[backdrop]
}

/**
 * Get lighting style classes
 */
export function getLightingClasses(lighting: CeremonyLighting): string {
  const lightingStyles: Record<CeremonyLighting, string> = {
    warm: 'from-amber-500/10',
    cool: 'from-blue-500/10',
    dramatic: 'from-purple-500/20',
    soft: 'from-slate-500/10'
  }
  return lightingStyles[lighting]
}

/**
 * Get ceremony type display name
 */
export function getCeremonyTypeName(type: CeremonyType): string {
  const names: Record<CeremonyType, string> = {
    rank_promotion: 'Rank Promotion',
    champion_recognition: 'Champion Recognition',
    elite_induction: 'Elite Recognition',
    milestone_celebration: 'Milestone Celebration',
    resonance_event: 'Resonance Event'
  }
  return names[type]
}
