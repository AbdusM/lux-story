/**
 * Character Quirks System
 * Makes characters memorable through distinctive verbal, behavioral, and cognitive patterns
 *
 * Design Philosophy:
 * - Quirks surface naturally in dialogue, not through explicit UI
 * - Quirks evolve as trust deepens (some disappear, others emerge)
 * - Every quirk tells you something about who the character really is
 */

export type QuirkType =
  | 'verbal'       // Speech patterns, catchphrases, verbal tics
  | 'behavioral'   // Actions, reactions, physical habits
  | 'cognitive'    // Thought patterns, how they process information
  | 'relational'   // How they relate to others, deflection/openness patterns

export type QuirkFrequency = 'rare' | 'occasional' | 'frequent'

/**
 * A single character quirk with its manifestations and triggers
 */
export interface CharacterQuirk {
  id: string
  type: QuirkType
  name: string                    // Human-readable name for documentation
  manifestations: string[]        // Actual text/actions that show this quirk
  frequency: QuirkFrequency
  triggers?: {
    emotionalStates?: string[]    // e.g., ['anxious', 'vulnerable', 'confident']
    trustLevel?: { min?: number; max?: number }
    topicFlags?: string[]         // Topics that trigger this quirk
  }
}

/**
 * Evolution rules for how quirks change as relationships deepen
 */
export interface QuirkEvolution {
  trustThreshold: number
  transformations: {
    fromQuirkId: string
    toQuirkId: string | null      // null = quirk disappears entirely
    reason: string                // For documentation/debugging
  }[]
}

/**
 * Complete quirk profile for a character
 */
export interface CharacterQuirkProfile {
  characterId: string
  quirks: CharacterQuirk[]
  quirkEvolution: QuirkEvolution[]
  // Hidden tells - subtle cues about inner state (revealed to observant players)
  hiddenTells: {
    trigger: string               // What causes this tell
    manifestation: string         // What the player might notice
    minTrust: number              // Trust level needed to notice
  }[]
}

/**
 * All character quirk profiles
 * Starting with Maya as proof of concept
 */
export const CHARACTER_QUIRKS: Record<string, CharacterQuirkProfile> = {
  maya: {
    characterId: 'maya',
    quirks: [
      // VERBAL QUIRKS
      {
        id: 'maya_hedging_language',
        type: 'verbal',
        name: 'Hedging Language',
        manifestations: [
          'supposedly',
          'or something',
          'I guess',
          'whatever that means',
          'not that it matters'
        ],
        frequency: 'frequent',
        triggers: {
          topicFlags: ['medicine', 'family', 'expectations', 'future']
        }
      },
      {
        id: 'maya_trailing_off',
        type: 'verbal',
        name: 'Trailing Off',
        manifestations: [
          'so...',
          'but anyway...',
          'never mind.',
          'it\'s fine.'
        ],
        frequency: 'occasional',
        triggers: {
          emotionalStates: ['vulnerable', 'conflicted'],
          trustLevel: { max: 5 }
        }
      },
      {
        id: 'maya_precise_technical',
        type: 'verbal',
        name: 'Precise Technical Language',
        manifestations: [
          'The servo response time is',
          'If you look at the actuator alignment',
          'The pressure distribution needs to',
          'Classic debugging problem—'
        ],
        frequency: 'frequent',
        triggers: {
          topicFlags: ['robotics', 'engineering', 'building']
        }
      },

      // BEHAVIORAL QUIRKS
      {
        id: 'maya_scattered_energy',
        type: 'behavioral',
        name: 'Scattered Energy',
        manifestations: [
          '*shuffles through papers*',
          '*glances at phone*',
          '*fidgets with servo motor*',
          '*robot chirps from bag*'
        ],
        frequency: 'occasional',
        triggers: {
          emotionalStates: ['anxious', 'conflicted', 'excited']
        }
      },
      {
        id: 'maya_robot_companion',
        type: 'behavioral',
        name: 'Robot Companion Reactions',
        manifestations: [
          '*The robot in her bag whirs softly*',
          '*A mechanical chirp escapes her bag*',
          '*Her robot companion\'s eyes glow briefly*',
          '*Tiny servos hum in agreement*'
        ],
        frequency: 'rare',
        triggers: {
          topicFlags: ['robotics', 'passion', 'truth']
        }
      },

      // RELATIONAL QUIRKS
      {
        id: 'maya_deflect_humor',
        type: 'relational',
        name: 'Deflecting with Humor',
        manifestations: [
          '*nervous laugh* Yeah, I\'m a disaster.',
          'No big deal. Just my entire future. Ha.',
          'Welcome to my chaotic life.',
          'Plot twist: I have no idea what I\'m doing.'
        ],
        frequency: 'frequent',
        triggers: {
          emotionalStates: ['vulnerable', 'exposed'],
          trustLevel: { max: 4 }
        }
      },
      {
        id: 'maya_direct_vulnerable',
        type: 'relational',
        name: 'Direct Vulnerability',
        manifestations: [
          'Honestly?',
          'I don\'t usually tell people this, but...',
          'Can I be real with you?',
          'This is hard to say.'
        ],
        frequency: 'rare',
        triggers: {
          trustLevel: { min: 6 }
        }
      },

      // COGNITIVE QUIRKS
      {
        id: 'maya_tech_tangent',
        type: 'cognitive',
        name: 'Technical Tangents',
        manifestations: [
          'Oh! Speaking of which, the actuator—never mind.',
          'Sorry, engineer brain. Where was I?',
          'The feedback loop is—wait, that\'s not what you asked.',
          '*mentally calculating* —sorry, what?'
        ],
        frequency: 'occasional',
        triggers: {
          topicFlags: ['robotics', 'building', 'problem_solving']
        }
      }
    ],

    quirkEvolution: [
      {
        trustThreshold: 5,
        transformations: [
          {
            fromQuirkId: 'maya_deflect_humor',
            toQuirkId: 'maya_direct_vulnerable',
            reason: 'Maya stops deflecting once she trusts you'
          }
        ]
      },
      {
        trustThreshold: 7,
        transformations: [
          {
            fromQuirkId: 'maya_trailing_off',
            toQuirkId: null,
            reason: 'Maya finishes her thoughts when she feels safe'
          }
        ]
      }
    ],

    hiddenTells: [
      {
        trigger: 'talking_about_robotics',
        manifestation: 'Her language becomes precise and confident',
        minTrust: 2
      },
      {
        trigger: 'talking_about_medicine',
        manifestation: 'She uses hedging words like "supposedly" and "I guess"',
        minTrust: 2
      },
      {
        trigger: 'family_mentioned',
        manifestation: 'Her robot companion goes quiet, as if listening',
        minTrust: 4
      },
      {
        trigger: 'feeling_understood',
        manifestation: 'She makes eye contact instead of looking away',
        minTrust: 5
      }
    ]
  }

  // Additional characters will be added after Maya proves the system
}

/**
 * Helper: Get active quirks for a character based on current context
 */
export function getActiveQuirks(
  characterId: string,
  context: {
    trust: number
    emotionalState?: string
    topicFlags?: string[]
  }
): CharacterQuirk[] {
  const profile = CHARACTER_QUIRKS[characterId]
  if (!profile) return []

  return profile.quirks.filter(quirk => {
    // Check trust level triggers
    if (quirk.triggers?.trustLevel) {
      if (quirk.triggers.trustLevel.min !== undefined &&
          context.trust < quirk.triggers.trustLevel.min) {
        return false
      }
      if (quirk.triggers.trustLevel.max !== undefined &&
          context.trust > quirk.triggers.trustLevel.max) {
        return false
      }
    }

    // Check if quirk has evolved away
    const evolution = profile.quirkEvolution.find(e =>
      e.trustThreshold <= context.trust &&
      e.transformations.some(t => t.fromQuirkId === quirk.id)
    )
    if (evolution) {
      const transform = evolution.transformations.find(t => t.fromQuirkId === quirk.id)
      if (transform?.toQuirkId === null) {
        return false // Quirk has disappeared
      }
    }

    // Check emotional state triggers
    if (quirk.triggers?.emotionalStates && context.emotionalState) {
      if (!quirk.triggers.emotionalStates.includes(context.emotionalState)) {
        return false
      }
    }

    // Check topic triggers
    if (quirk.triggers?.topicFlags && context.topicFlags) {
      const hasMatchingTopic = quirk.triggers.topicFlags.some(
        topic => context.topicFlags?.includes(topic)
      )
      if (!hasMatchingTopic) {
        return false
      }
    }

    return true
  })
}

/**
 * Helper: Get a random manifestation from a quirk
 */
export function getQuirkManifestation(quirk: CharacterQuirk): string {
  return quirk.manifestations[Math.floor(Math.random() * quirk.manifestations.length)]
}

/**
 * Helper: Check if a quirk should fire based on frequency
 */
export function shouldShowQuirk(frequency: QuirkFrequency): boolean {
  const roll = Math.random()
  switch (frequency) {
    case 'frequent': return roll < 0.6
    case 'occasional': return roll < 0.3
    case 'rare': return roll < 0.1
    default: return false
  }
}

/**
 * Helper: Get visible hidden tells based on trust level
 */
export function getVisibleHiddenTells(
  characterId: string,
  trust: number,
  trigger?: string
): string[] {
  const profile = CHARACTER_QUIRKS[characterId]
  if (!profile) return []

  return profile.hiddenTells
    .filter(tell => tell.minTrust <= trust)
    .filter(tell => !trigger || tell.trigger === trigger)
    .map(tell => tell.manifestation)
}
