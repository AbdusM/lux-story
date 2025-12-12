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
  },

  // ============================================
  // SAMUEL (Owl) - The Station Keeper
  // ============================================
  samuel: {
    characterId: 'samuel',
    quirks: [
      // VERBAL QUIRKS
      {
        id: 'samuel_train_metaphors',
        type: 'verbal',
        name: 'Train/Station Metaphors',
        manifestations: [
          'Every journey starts with a single step onto the platform.',
          'Some trains run on schedule. Others... take the scenic route.',
          'The tracks are laid, but you choose which train to board.',
          'Delays happen. What matters is what you do while waiting.',
          'Not every station is a destination. Some are just... transfers.'
        ],
        frequency: 'frequent',
        triggers: {
          topicFlags: ['choices', 'future', 'uncertainty', 'guidance']
        }
      },
      {
        id: 'samuel_weaving_metaphors',
        type: 'verbal',
        name: 'Thread/Weaving Metaphors',
        manifestations: [
          'Your thread is just beginning to show its color.',
          'Some patterns only make sense from a distance.',
          'A tangled thread isn\'t broken—just finding its way.',
          'The strongest weaves have threads that cross unexpectedly.'
        ],
        frequency: 'occasional',
        triggers: {
          topicFlags: ['identity', 'patterns', 'connections']
        }
      },
      {
        id: 'samuel_measured_speech',
        type: 'verbal',
        name: 'Measured Speech',
        manifestations: [
          '...',
          '*a considered pause*',
          'Hmm.',
          '*takes a slow breath*'
        ],
        frequency: 'frequent',
        triggers: {
          emotionalStates: ['thoughtful', 'concerned', 'hopeful']
        }
      },

      // BEHAVIORAL QUIRKS
      {
        id: 'samuel_long_pauses',
        type: 'behavioral',
        name: 'Meaningful Pauses',
        manifestations: [
          '*Samuel pauses, watching the departure board*',
          '*He takes his time, as if listening to something far away*',
          '*A long silence stretches between you—comfortable, not awkward*',
          '*He seems to be choosing his next words carefully*'
        ],
        frequency: 'frequent',
        triggers: {
          emotionalStates: ['thoughtful', 'concerned']
        }
      },
      {
        id: 'samuel_observing_station',
        type: 'behavioral',
        name: 'Station Awareness',
        manifestations: [
          '*His eyes track a traveler across the concourse*',
          '*He glances at the arrivals board, nodding slightly*',
          '*His attention briefly shifts to the platforms*',
          '*He tilts his head, as if hearing a distant train*'
        ],
        frequency: 'occasional',
        triggers: {}
      },

      // COGNITIVE QUIRKS
      {
        id: 'samuel_seeing_patterns',
        type: 'cognitive',
        name: 'Pattern Recognition',
        manifestations: [
          'Ah. I\'ve seen this before.',
          'Your thread reminds me of another...',
          'There\'s a pattern here. Do you see it?',
          'Some things echo through this station.'
        ],
        frequency: 'occasional',
        triggers: {
          topicFlags: ['patterns', 'connections', 'other_characters']
        }
      },

      // RELATIONAL QUIRKS
      {
        id: 'samuel_gentle_redirection',
        type: 'relational',
        name: 'Gentle Redirection',
        manifestations: [
          'That\'s one way to see it.',
          'Perhaps. But consider...',
          'The question isn\'t what you should do. It\'s what you want to do.',
          'I wonder if you already know the answer.'
        ],
        frequency: 'frequent',
        triggers: {
          topicFlags: ['seeking_advice', 'uncertainty']
        }
      },
      {
        id: 'samuel_warm_cryptic',
        type: 'relational',
        name: 'Warm but Cryptic',
        manifestations: [
          '*a knowing smile*',
          'You\'ll understand. When you\'re ready.',
          'Some truths can only be discovered, not told.',
          '*his eyes hold a warmth that asks no questions*'
        ],
        frequency: 'occasional',
        triggers: {
          trustLevel: { min: 3 }
        }
      }
    ],

    quirkEvolution: [
      {
        trustThreshold: 6,
        transformations: [
          {
            fromQuirkId: 'samuel_warm_cryptic',
            toQuirkId: 'samuel_direct_wisdom',
            reason: 'Samuel speaks more directly once trust is established'
          }
        ]
      }
    ],

    hiddenTells: [
      {
        trigger: 'worried_about_traveler',
        manifestation: 'He mentions "delays" more often than usual',
        minTrust: 3
      },
      {
        trigger: 'sees_potential',
        manifestation: 'His pauses become longer, more thoughtful',
        minTrust: 2
      },
      {
        trigger: 'remembering_past',
        manifestation: 'He touches the station keeper\'s badge on his lapel',
        minTrust: 5
      },
      {
        trigger: 'genuine_concern',
        manifestation: 'The usual metaphors drop away—he speaks plainly',
        minTrust: 7
      }
    ]
  },

  // ============================================
  // DEVON (Deer) - The Systems Thinker
  // ============================================
  devon: {
    characterId: 'devon',
    quirks: [
      // VERBAL QUIRKS
      {
        id: 'devon_pseudocode_speech',
        type: 'verbal',
        name: 'Pseudo-Code Metaphors',
        manifestations: [
          'If input is "I\'m fine," route to branch 4.B: Deeper Investigation.',
          'Classic recursion problem. Keep calling until you hit the base case.',
          'That\'s an edge case. Need to handle it explicitly.',
          'Running diagnostics on that statement...',
          'Error handling for emotions: try { feel() } catch { analyze() }'
        ],
        frequency: 'frequent',
        triggers: {
          topicFlags: ['emotions', 'relationships', 'problems']
        }
      },
      {
        id: 'devon_technical_distance',
        type: 'verbal',
        name: 'Technical Distancing',
        manifestations: [
          'The data suggests...',
          'Statistically speaking...',
          'If we model this as a graph...',
          'Optimizing for the expected outcome...'
        ],
        frequency: 'frequent',
        triggers: {
          emotionalStates: ['uncomfortable', 'vulnerable']
        }
      },
      {
        id: 'devon_direct_connection',
        type: 'verbal',
        name: 'Direct Human Speech',
        manifestations: [
          'I mean... I feel...',
          'This is hard to say without code.',
          'No algorithm for this one.',
          'I don\'t have a script for this.'
        ],
        frequency: 'rare',
        triggers: {
          trustLevel: { min: 6 },
          emotionalStates: ['connected', 'breakthrough']
        }
      },

      // BEHAVIORAL QUIRKS
      {
        id: 'devon_filling_silence',
        type: 'behavioral',
        name: 'Filling Silence with Analysis',
        manifestations: [
          '*pulls out phone to check something*',
          '*starts sketching a diagram on a napkin*',
          '*mutters calculations under his breath*',
          '*eyes unfocus as he runs scenarios*'
        ],
        frequency: 'frequent',
        triggers: {
          emotionalStates: ['anxious', 'uncomfortable']
        }
      },
      {
        id: 'devon_optimizer_check',
        type: 'behavioral',
        name: 'Conversation Optimizer Reference',
        manifestations: [
          '*glances at his tablet—the optimizer is running*',
          '*the conversation tracker blinks suggestions*',
          '*his app suggests a response path*',
          '*ignores the optimizer\'s recommendation*'
        ],
        frequency: 'occasional',
        triggers: {
          topicFlags: ['conversation', 'connection', 'father']
        }
      },

      // COGNITIVE QUIRKS
      {
        id: 'devon_systems_thinking',
        type: 'cognitive',
        name: 'Everything is a System',
        manifestations: [
          'There\'s always an underlying structure.',
          'Map the dependencies first.',
          'What are the inputs and outputs here?',
          'If we abstract this pattern...'
        ],
        frequency: 'frequent',
        triggers: {
          topicFlags: ['problems', 'relationships', 'future']
        }
      },

      // RELATIONAL QUIRKS
      {
        id: 'devon_helpful_distance',
        type: 'relational',
        name: 'Helpfulness as Distance',
        manifestations: [
          'I could build you something for that.',
          'Want me to analyze the options?',
          'I have a framework that might help.',
          'Let me optimize this for you.'
        ],
        frequency: 'frequent',
        triggers: {
          trustLevel: { max: 5 }
        }
      },
      {
        id: 'devon_admitting_limits',
        type: 'relational',
        name: 'Admitting Algorithmic Limits',
        manifestations: [
          'The optimizer can\'t solve everything.',
          'Some things don\'t compile.',
          'I\'ve been debugging the wrong problem.',
          'Human connection isn\'t in the documentation.'
        ],
        frequency: 'rare',
        triggers: {
          trustLevel: { min: 7 }
        }
      }
    ],

    quirkEvolution: [
      {
        trustThreshold: 6,
        transformations: [
          {
            fromQuirkId: 'devon_technical_distance',
            toQuirkId: 'devon_direct_connection',
            reason: 'Devon starts using human language when he trusts you'
          }
        ]
      },
      {
        trustThreshold: 8,
        transformations: [
          {
            fromQuirkId: 'devon_filling_silence',
            toQuirkId: null,
            reason: 'Devon becomes comfortable with silence'
          }
        ]
      }
    ],

    hiddenTells: [
      {
        trigger: 'feeling_understood',
        manifestation: 'He puts his phone away without checking it',
        minTrust: 3
      },
      {
        trigger: 'talking_about_father',
        manifestation: 'His technical language becomes more pronounced',
        minTrust: 2
      },
      {
        trigger: 'genuine_connection',
        manifestation: 'He forgets to check the conversation optimizer',
        minTrust: 5
      },
      {
        trigger: 'breakthrough_moment',
        manifestation: 'He uses "I" statements instead of system metaphors',
        minTrust: 7
      }
    ]
  },

  // ============================================
  // TESS (Fox) - The Curator
  // ============================================
  tess: {
    characterId: 'tess',
    quirks: [
      // VERBAL QUIRKS
      {
        id: 'tess_clipped_sentences',
        type: 'verbal',
        name: 'Clipped Efficient Speech',
        manifestations: [
          'Yeah.',
          'Nope.',
          'Heard that one.',
          'Next.',
          'Try again.'
        ],
        frequency: 'frequent',
        triggers: {
          emotionalStates: ['evaluating', 'unimpressed']
        }
      },
      {
        id: 'tess_real_praise',
        type: 'verbal',
        name: '"Real" as Highest Praise',
        manifestations: [
          'Real.',
          'That\'s real.',
          'Now THAT\'S real.',
          '*nods* Real talk.'
        ],
        frequency: 'rare',
        triggers: {
          emotionalStates: ['impressed', 'moved']
        }
      },
      {
        id: 'tess_music_references',
        type: 'verbal',
        name: 'Music Industry Wisdom',
        manifestations: [
          'The algorithm doesn\'t know soul.',
          'Viral isn\'t the same as vital.',
          'Numbers don\'t know nuance.',
          'Streams don\'t measure tears.'
        ],
        frequency: 'occasional',
        triggers: {
          topicFlags: ['authenticity', 'success', 'passion']
        }
      },

      // BEHAVIORAL QUIRKS
      {
        id: 'tess_flipping_records',
        type: 'behavioral',
        name: 'Record Flipping While Thinking',
        manifestations: [
          '*flips through a crate of vinyl*',
          '*runs her fingers along record spines*',
          '*pulls a record, examines it, puts it back*',
          '*the soft shush of sleeves sliding past*'
        ],
        frequency: 'frequent',
        triggers: {
          emotionalStates: ['thinking', 'evaluating', 'processing']
        }
      },
      {
        id: 'tess_stops_flipping',
        type: 'behavioral',
        name: 'Stops When Decided',
        manifestations: [
          '*her hands go still on a record*',
          '*she stops mid-flip, looking at you*',
          '*the browsing pauses—she\'s listening now*',
          '*pulls a record definitively*'
        ],
        frequency: 'rare',
        triggers: {
          emotionalStates: ['decided', 'certain', 'moved']
        }
      },

      // COGNITIVE QUIRKS
      {
        id: 'tess_authenticity_radar',
        type: 'cognitive',
        name: 'Authenticity Detection',
        manifestations: [
          'You mean that?',
          'Say that again. Slower.',
          '*studies your face*',
          'I can hear when someone\'s performing.'
        ],
        frequency: 'frequent',
        triggers: {
          topicFlags: ['passion', 'dreams', 'truth']
        }
      },

      // RELATIONAL QUIRKS
      {
        id: 'tess_testing_realness',
        type: 'relational',
        name: 'Testing for Realness',
        manifestations: [
          'Everyone says that. What do YOU mean?',
          'Easy answer. Try harder.',
          'That\'s the surface. Go deeper.',
          'You\'re playing it safe.'
        ],
        frequency: 'frequent',
        triggers: {
          trustLevel: { max: 4 }
        }
      },
      {
        id: 'tess_mentoring_real',
        type: 'relational',
        name: 'Genuine Mentorship',
        manifestations: [
          'Okay. Now we can talk.',
          'That\'s the you I wanted to meet.',
          'Now you\'re speaking your language.',
          '*a rare, full smile*'
        ],
        frequency: 'rare',
        triggers: {
          trustLevel: { min: 5 }
        }
      }
    ],

    quirkEvolution: [
      {
        trustThreshold: 5,
        transformations: [
          {
            fromQuirkId: 'tess_testing_realness',
            toQuirkId: 'tess_mentoring_real',
            reason: 'Tess stops testing once you prove authentic'
          }
        ]
      }
    ],

    hiddenTells: [
      {
        trigger: 'hearing_authenticity',
        manifestation: 'Her browsing slows—she\'s paying attention',
        minTrust: 2
      },
      {
        trigger: 'reminded_of_past',
        manifestation: 'She pulls a specific record, holds it longer than usual',
        minTrust: 4
      },
      {
        trigger: 'seeing_potential',
        manifestation: 'She says "Real" without any irony',
        minTrust: 3
      },
      {
        trigger: 'made_decision_about_you',
        manifestation: 'The record flipping stops completely',
        minTrust: 5
      }
    ]
  }
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
