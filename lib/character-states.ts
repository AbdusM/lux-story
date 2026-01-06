/**
 * Character States - Trust-Based Demeanor System
 *
 * INVISIBLE DEPTH PRINCIPLE:
 * Characters have emotional states that shift based on trust level.
 * This manifests through greeting prefixes and tone shifts in dialogue.
 * Player experiences relationship progress without explicit meters.
 *
 * State Flow: guarded → warming → open → vulnerable
 * Each state affects how characters greet and speak to the player.
 */

import { CharacterId } from './graph-registry'

/**
 * The four emotional states a character can be in
 * Determined by trust level with the player
 */
export type CharacterState = 'guarded' | 'warming' | 'open' | 'vulnerable'

/**
 * All possible character states in order of trust
 */
export const CHARACTER_STATES: CharacterState[] = ['guarded', 'warming', 'open', 'vulnerable']

/**
 * Trust thresholds for each state
 */
export const STATE_THRESHOLDS = {
  guarded: { max: 2 },      // Trust 0-1
  warming: { min: 2, max: 4 }, // Trust 2-3
  open: { min: 4, max: 6 },    // Trust 4-5
  vulnerable: { min: 6 }       // Trust 6+
} as const

/**
 * Dialogue modifiers for each state
 */
export interface StateDialogueModifiers {
  /** Prefix added to greeting dialogue */
  greetingPrefix: string
  /** Emotional tone for dialogue */
  toneShift?: string
  /** Topics that become available in this state */
  availableTopics?: string[]
}

/**
 * Per-character state modifiers
 * Each character has unique prefixes that match their personality
 */
export const CHARACTER_STATE_MODIFIERS: Partial<Record<CharacterId, Record<CharacterState, StateDialogueModifiers>>> = {
  maya: {
    guarded: {
      greetingPrefix: "Maya eyes you warily. ",
      toneShift: 'cautious'
    },
    warming: {
      greetingPrefix: "Maya nods in recognition. ",
      toneShift: 'neutral'
    },
    open: {
      greetingPrefix: "Maya's face lights up. ",
      toneShift: 'warm',
      availableTopics: ['family', 'dreams']
    },
    vulnerable: {
      greetingPrefix: "Maya takes a breath, as if deciding something. ",
      toneShift: 'intimate',
      availableTopics: ['fears', 'regrets', 'hopes']
    }
  },

  devon: {
    guarded: {
      greetingPrefix: "Devon glances up from their work, guarded. ",
      toneShift: 'cautious'
    },
    warming: {
      greetingPrefix: "Devon pauses their work, acknowledging you. ",
      toneShift: 'neutral'
    },
    open: {
      greetingPrefix: "Devon sets down their tools, genuinely pleased. ",
      toneShift: 'warm',
      availableTopics: ['projects', 'aspirations']
    },
    vulnerable: {
      greetingPrefix: "Devon's usual composure softens. ",
      toneShift: 'intimate',
      availableTopics: ['doubts', 'failures', 'dreams']
    }
  },

  marcus: {
    guarded: {
      greetingPrefix: "Marcus offers a professional nod. ",
      toneShift: 'formal'
    },
    warming: {
      greetingPrefix: "Marcus relaxes slightly at your approach. ",
      toneShift: 'neutral'
    },
    open: {
      greetingPrefix: "Marcus's clinical demeanor melts into warmth. ",
      toneShift: 'warm',
      availableTopics: ['patients', 'calling']
    },
    vulnerable: {
      greetingPrefix: "Marcus lowers his guard completely. ",
      toneShift: 'intimate',
      availableTopics: ['losses', 'doubts', 'why_medicine']
    }
  },

  tess: {
    guarded: {
      greetingPrefix: "Tess maintains a careful distance. ",
      toneShift: 'cautious'
    },
    warming: {
      greetingPrefix: "Tess's posture opens toward you. ",
      toneShift: 'neutral'
    },
    open: {
      greetingPrefix: "Tess beams with genuine warmth. ",
      toneShift: 'warm',
      availableTopics: ['students', 'teaching_philosophy']
    },
    vulnerable: {
      greetingPrefix: "Tess speaks with rare honesty. ",
      toneShift: 'intimate',
      availableTopics: ['burnout', 'systemic_failures', 'hope']
    }
  },

  rohan: {
    guarded: {
      greetingPrefix: "Rohan barely looks up from his screen. ",
      toneShift: 'distracted'
    },
    warming: {
      greetingPrefix: "Rohan minimizes his work, giving you attention. ",
      toneShift: 'neutral'
    },
    open: {
      greetingPrefix: "Rohan's eyes light up with recognition. ",
      toneShift: 'engaged',
      availableTopics: ['code', 'systems', 'puzzles']
    },
    vulnerable: {
      greetingPrefix: "Rohan removes his headphones completely. ",
      toneShift: 'present',
      availableTopics: ['isolation', 'connection', 'meaning']
    }
  },

  elena: {
    guarded: {
      greetingPrefix: "Elena peers at you over her glasses. ",
      toneShift: 'assessing'
    },
    warming: {
      greetingPrefix: "Elena marks her place in her book. ",
      toneShift: 'neutral'
    },
    open: {
      greetingPrefix: "Elena closes her book entirely. ",
      toneShift: 'attentive',
      availableTopics: ['archives', 'discoveries', 'patterns']
    },
    vulnerable: {
      greetingPrefix: "Elena sets aside her usual reserve. ",
      toneShift: 'confiding',
      availableTopics: ['lost_knowledge', 'obsession', 'purpose']
    }
  },

  alex: {
    guarded: {
      greetingPrefix: "Alex keeps one eye on the logistics board. ",
      toneShift: 'distracted'
    },
    warming: {
      greetingPrefix: "Alex turns to face you properly. ",
      toneShift: 'neutral'
    },
    open: {
      greetingPrefix: "Alex's stressed expression softens. ",
      toneShift: 'relieved',
      availableTopics: ['systems', 'efficiency', 'chaos']
    },
    vulnerable: {
      greetingPrefix: "Alex drops the mask of competence. ",
      toneShift: 'honest',
      availableTopics: ['pressure', 'invisibility', 'value']
    }
  },

  grace: {
    guarded: {
      greetingPrefix: "Grace maintains professional composure. ",
      toneShift: 'professional'
    },
    warming: {
      greetingPrefix: "Grace's smile reaches her eyes. ",
      toneShift: 'friendly'
    },
    open: {
      greetingPrefix: "Grace gestures you closer. ",
      toneShift: 'warm',
      availableTopics: ['patients', 'care', 'systems']
    },
    vulnerable: {
      greetingPrefix: "Grace speaks from experience, not training. ",
      toneShift: 'raw',
      availableTopics: ['loss', 'limits', 'meaning_of_care']
    }
  },

  kai: {
    guarded: {
      greetingPrefix: "Kai assesses you with trained eyes. ",
      toneShift: 'vigilant'
    },
    warming: {
      greetingPrefix: "Kai's stance relaxes slightly. ",
      toneShift: 'alert'
    },
    open: {
      greetingPrefix: "Kai allows a rare smile. ",
      toneShift: 'approachable',
      availableTopics: ['safety', 'protocols', 'prevention']
    },
    vulnerable: {
      greetingPrefix: "Kai's guard drops completely. ",
      toneShift: 'human',
      availableTopics: ['failures', 'guilt', 'purpose']
    }
  },

  silas: {
    guarded: {
      greetingPrefix: "Silas wipes grease from his hands, watching. ",
      toneShift: 'wary'
    },
    warming: {
      greetingPrefix: "Silas sets down his tools to talk. ",
      toneShift: 'neutral'
    },
    open: {
      greetingPrefix: "Silas's weathered face creases with a smile. ",
      toneShift: 'welcoming',
      availableTopics: ['craft', 'machines', 'precision']
    },
    vulnerable: {
      greetingPrefix: "Silas speaks with the weight of years. ",
      toneShift: 'reflective',
      availableTopics: ['industry_changes', 'legacy', 'obsolescence']
    }
  },

  jordan: {
    guarded: {
      greetingPrefix: "Jordan offers a polished, professional greeting. ",
      toneShift: 'rehearsed'
    },
    warming: {
      greetingPrefix: "Jordan's corporate mask slips a little. ",
      toneShift: 'genuine'
    },
    open: {
      greetingPrefix: "Jordan leans in with authentic interest. ",
      toneShift: 'engaged',
      availableTopics: ['paths', 'choices', 'futures']
    },
    vulnerable: {
      greetingPrefix: "Jordan speaks off the record. ",
      toneShift: 'candid',
      availableTopics: ['own_journey', 'regrets', 'advice_they_wish_theyd_gotten']
    }
  },

  yaquin: {
    guarded: {
      greetingPrefix: "Yaquin fidgets with his tablet nervously. ",
      toneShift: 'anxious'
    },
    warming: {
      greetingPrefix: "Yaquin's nervous energy settles. ",
      toneShift: 'curious'
    },
    open: {
      greetingPrefix: "Yaquin's enthusiasm bursts through. ",
      toneShift: 'excited',
      availableTopics: ['ideas', 'edtech', 'innovation']
    },
    vulnerable: {
      greetingPrefix: "Yaquin's bravado fades to honesty. ",
      toneShift: 'earnest',
      availableTopics: ['imposter_syndrome', 'family_expectations', 'real_dreams']
    }
  },

  asha: {
    guarded: {
      greetingPrefix: "Asha observes you with measured calm. ",
      toneShift: 'neutral'
    },
    warming: {
      greetingPrefix: "Asha's posture invites conversation. ",
      toneShift: 'receptive'
    },
    open: {
      greetingPrefix: "Asha's presence feels genuinely welcoming. ",
      toneShift: 'open',
      availableTopics: ['conflict', 'resolution', 'understanding']
    },
    vulnerable: {
      greetingPrefix: "Asha shares from her own struggles. ",
      toneShift: 'personal',
      availableTopics: ['own_conflicts', 'failures', 'growth']
    }
  },

  lira: {
    guarded: {
      greetingPrefix: "Lira adjusts her headphones, half-listening. ",
      toneShift: 'distracted'
    },
    warming: {
      greetingPrefix: "Lira removes one earbud, curious. ",
      toneShift: 'interested'
    },
    open: {
      greetingPrefix: "Lira's creative energy vibrates toward you. ",
      toneShift: 'enthusiastic',
      availableTopics: ['sound', 'stories', 'expression']
    },
    vulnerable: {
      greetingPrefix: "Lira speaks without the performance. ",
      toneShift: 'authentic',
      availableTopics: ['creative_blocks', 'identity', 'voice']
    }
  },

  zara: {
    guarded: {
      greetingPrefix: "Zara's analytical gaze weighs you. ",
      toneShift: 'evaluating'
    },
    warming: {
      greetingPrefix: "Zara's expression softens with recognition. ",
      toneShift: 'accepting'
    },
    open: {
      greetingPrefix: "Zara engages with full attention. ",
      toneShift: 'focused',
      availableTopics: ['ethics', 'data', 'art']
    },
    vulnerable: {
      greetingPrefix: "Zara speaks from conviction, not analysis. ",
      toneShift: 'passionate',
      availableTopics: ['moral_dilemmas', 'compromises', 'what_matters']
    }
  },

  samuel: {
    guarded: {
      greetingPrefix: "Samuel watches from the shadows. ",
      toneShift: 'mysterious'
    },
    warming: {
      greetingPrefix: "Samuel emerges from the station's depths. ",
      toneShift: 'attentive'
    },
    open: {
      greetingPrefix: "Samuel's ancient eyes hold warmth. ",
      toneShift: 'paternal',
      availableTopics: ['station', 'travelers', 'patterns']
    },
    vulnerable: {
      greetingPrefix: "Samuel speaks of things he rarely shares. ",
      toneShift: 'reverent',
      availableTopics: ['his_past', 'the_cost', 'what_hes_learned']
    }
  }
}

/**
 * Get the character state based on trust level
 */
export function getCharacterState(trust: number): CharacterState {
  if (trust < STATE_THRESHOLDS.warming.min) return 'guarded'
  if (trust < STATE_THRESHOLDS.open.min) return 'warming'
  if (trust < STATE_THRESHOLDS.vulnerable.min) return 'open'
  return 'vulnerable'
}

/**
 * Get the greeting prefix for a character at a given trust level
 */
export function getGreetingPrefix(characterId: CharacterId, trust: number): string {
  const state = getCharacterState(trust)
  const modifiers = CHARACTER_STATE_MODIFIERS[characterId]

  if (!modifiers) {
    // Default prefixes for characters without custom modifiers
    const defaults: Record<CharacterState, string> = {
      guarded: "They regard you carefully. ",
      warming: "They acknowledge your presence. ",
      open: "They greet you warmly. ",
      vulnerable: "They speak with unusual openness. "
    }
    return defaults[state]
  }

  return modifiers[state].greetingPrefix
}

/**
 * Get the tone shift for a character at a given trust level
 */
export function getToneShift(characterId: CharacterId, trust: number): string | undefined {
  const state = getCharacterState(trust)
  const modifiers = CHARACTER_STATE_MODIFIERS[characterId]

  if (!modifiers) return undefined
  return modifiers[state].toneShift
}

/**
 * Get available topics for a character at a given trust level
 */
export function getAvailableTopics(characterId: CharacterId, trust: number): string[] {
  const state = getCharacterState(trust)
  const modifiers = CHARACTER_STATE_MODIFIERS[characterId]

  if (!modifiers) return []
  return modifiers[state].availableTopics || []
}

/**
 * Get the full state modifiers for a character
 */
export function getStateModifiers(
  characterId: CharacterId,
  trust: number
): StateDialogueModifiers | undefined {
  const state = getCharacterState(trust)
  const modifiers = CHARACTER_STATE_MODIFIERS[characterId]

  if (!modifiers) return undefined
  return modifiers[state]
}

/**
 * Check if a character has reached a specific state
 */
export function hasReachedState(trust: number, targetState: CharacterState): boolean {
  const currentState = getCharacterState(trust)
  const currentIndex = CHARACTER_STATES.indexOf(currentState)
  const targetIndex = CHARACTER_STATES.indexOf(targetState)
  return currentIndex >= targetIndex
}

/**
 * Get the trust needed to reach a specific state
 */
export function getTrustForState(targetState: CharacterState): number {
  switch (targetState) {
    case 'guarded': return 0
    case 'warming': return STATE_THRESHOLDS.warming.min
    case 'open': return STATE_THRESHOLDS.open.min
    case 'vulnerable': return STATE_THRESHOLDS.vulnerable.min
  }
}
