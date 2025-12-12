/**
 * Crossroads System
 * Dramatic decision moments where characters face major life choices
 *
 * Design Philosophy:
 * - These are the BIG moments - the ones players remember
 * - Multiple approaches available based on player's patterns and trust
 * - No "wrong" answers - different approaches lead to different outcomes
 * - The player helps but doesn't decide - the character chooses
 * - Pattern-gated approaches reward investment without locking out content
 */

import { PatternType } from './patterns'

/**
 * A single approach the player can take during a crossroads
 */
export interface CrossroadsApproach {
  id: string
  label: string              // What player sees
  description: string        // Tooltip/expansion text

  // Requirements (all optional - default approach has none)
  requirements?: {
    pattern?: PatternType    // Must have this as dominant/high pattern
    patternMin?: number      // Minimum level (percentage of total, e.g., 30 = 30%)
    trustMin?: number        // Minimum trust with this character
    requiredFlags?: string[] // Must have these flags
  }

  // What happens if this approach is chosen
  outcome: {
    characterResponse: string[]  // Multi-part response from character
    emotionArc: string[]         // How character feels through response
    trustChange: number          // How this affects relationship
    globalFlagsSet: string[]     // Flags to set
    unlockedContent?: string     // Description of what this unlocks
  }
}

/**
 * A crossroads moment definition
 */
export interface CrossroadsMoment {
  id: string
  characterId: string
  name: string                   // "Maya's Decision", "Devon's Call"

  // Narrative context
  stakes: string                 // What's at risk
  setup: string[]                // Dialogue leading into the crossroads

  // When this crossroads triggers
  triggerConditions: {
    trustMin: number
    requiredFlags: string[]
    requiredTransformations?: string[]  // Must have witnessed these
  }

  // Available approaches
  approaches: CrossroadsApproach[]

  // Fallback/default approach (always available)
  defaultApproach: CrossroadsApproach

  // After resolution
  resolution: {
    sharedDialogue: string[]     // Always shown after any approach
    nextNodeId?: string          // Where to go in dialogue graph
  }
}

/**
 * All crossroads moments
 * Starting with Maya as proof of concept
 */
export const CROSSROADS_MOMENTS: CrossroadsMoment[] = [
  // ============================================
  // MAYA'S CROSSROADS: The Parent Visit
  // ============================================
  {
    id: 'maya_parent_decision',
    characterId: 'maya',
    name: "Maya's Decision",

    stakes: "Maya's parents are visiting tomorrow. She needs to decide what to tell them about her path.",

    setup: [
      "*Maya's phone buzzes. She looks at it, face going pale.*",
      "\"My parents. They're coming tomorrow.\"",
      "*She sets the phone down slowly, hands not quite steady.*",
      "\"They think they're visiting their pre-med daughter.\"",
      "\"I haven't... I don't know how to...\"",
      "*She looks at you, really looks, for the first time.*",
      "\"What do I even say?\""
    ],

    triggerConditions: {
      trustMin: 6,
      requiredFlags: ['knows_robotics', 'knows_maya_family_pressure', 'maya_transformation_complete']
    },

    approaches: [
      // ANALYTICAL APPROACH
      {
        id: 'analytical_approach',
        label: "Help her see the data",
        description: "Walk through the facts: job prospects, salary ranges, career satisfaction statistics for biomedical engineering.",

        requirements: {
          pattern: 'analytical',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*Maya listens as you lay out the numbers.*",
            "\"Biomedical engineering... the job growth is actually higher than general practice medicine.\"",
            "\"And the median salary...\"",
            "*She pulls out her phone, starts searching.*",
            "\"UAB has a program. I never even looked because I thought—\"",
            "*A slow exhale.*",
            "\"Facts. They can't argue with facts.\"",
            "\"It's not 'abandoning medicine.' It's... evolving it.\""
          ],
          emotionArc: ['anxious', 'curious', 'surprised', 'hopeful', 'determined'],
          trustChange: 2,
          globalFlagsSet: ['maya_analytical_support', 'maya_considering_biomedical'],
          unlockedContent: "Maya will approach her parents with data and career statistics"
        }
      },

      // PATIENT APPROACH
      {
        id: 'patience_approach',
        label: "Give her space to feel it",
        description: "Don't offer solutions. Just be present. Let her work through the fear herself.",

        requirements: {
          pattern: 'patience',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*You don't say anything. Just... stay.*",
            "*Maya's breathing slows. The silence isn't empty—it's full.*",
            "\"I keep trying to figure out the right words.\"",
            "\"But maybe... maybe there are no right words.\"",
            "*She looks at her robot companion, still perched nearby.*",
            "\"Maybe I just need to show them.\"",
            "\"Show them what makes me come alive.\"",
            "*A small laugh, almost surprised.*",
            "\"When did I get so scared of my own parents seeing who I actually am?\""
          ],
          emotionArc: ['tense', 'softening', 'reflective', 'vulnerable', 'resolving'],
          trustChange: 3,
          globalFlagsSet: ['maya_patience_support', 'maya_show_dont_tell'],
          unlockedContent: "Maya will show her parents her robot instead of explaining"
        }
      },

      // BUILDING APPROACH
      {
        id: 'building_approach',
        label: "Suggest the hybrid path",
        description: "Medical robotics. Surgical automation. Help her see she doesn't have to choose between worlds.",

        requirements: {
          pattern: 'building',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "\"Wait—\" *Maya sits forward.* \"Medical robotics?\"",
            "\"Like... surgical systems? Prosthetic interfaces?\"",
            "*Her robot companion chirps excitedly, sensing her energy shift.*",
            "\"I could design tools that help surgeons. Or... or prosthetics that respond to neural signals.\"",
            "\"It's not abandoning medicine. It's—\"",
            "*Her eyes are bright now, that spark you've seen before.*",
            "\"It's building the future of medicine.\"",
            "\"My parents wanted me to help people. What if I could help millions?\""
          ],
          emotionArc: ['confused', 'intrigued', 'excited', 'inspired', 'determined'],
          trustChange: 2,
          globalFlagsSet: ['maya_building_support', 'maya_medical_robotics_vision'],
          unlockedContent: "Maya will pitch medical robotics as her hybrid path"
        }
      },

      // TRUST-BASED APPROACH
      {
        id: 'trust_approach',
        label: "Share your own story",
        description: "Tell her about a time you had to choose between what was expected and what felt right.",

        requirements: {
          trustMin: 8
        },

        outcome: {
          characterResponse: [
            "*Maya listens. Really listens.*",
            "*When you finish, she's quiet for a long moment.*",
            "\"You get it. You actually get it.\"",
            "\"It's not about disappointing them. It's about...\"",
            "*She trails off, thinking.*",
            "\"...about whether I can live with disappointing myself.\"",
            "\"Every day. For the rest of my life.\"",
            "*She meets your eyes.*",
            "\"Thank you. For trusting me with that.\""
          ],
          emotionArc: ['attentive', 'moved', 'understanding', 'resolved', 'grateful'],
          trustChange: 3,
          globalFlagsSet: ['maya_deep_trust', 'player_shared_story'],
          unlockedContent: "Maya sees you as a true confidant—deepest dialogue unlocked"
        }
      },

      // HELPING APPROACH
      {
        id: 'helping_approach',
        label: "Offer to be there",
        description: "Tell her she doesn't have to face them alone. You could be there—moral support.",

        requirements: {
          pattern: 'helping',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*Maya's expression shifts—surprise, then something softer.*",
            "\"You'd... you'd do that?\"",
            "\"I wasn't even—I mean, we barely—\"",
            "*She stops, recalibrating.*",
            "\"Actually, you know what? Yes.\"",
            "\"Having someone there who sees me... the real me...\"",
            "*A determined nod.*",
            "\"It might help them see her too.\""
          ],
          emotionArc: ['surprised', 'touched', 'uncertain', 'deciding', 'grateful'],
          trustChange: 2,
          globalFlagsSet: ['maya_helping_support', 'player_will_attend'],
          unlockedContent: "Player will be present during Maya's conversation with parents"
        }
      },

      // EXPLORING APPROACH
      {
        id: 'exploring_approach',
        label: "Ask what she's really afraid of",
        description: "Dig deeper. Is it their disappointment? Their sacrifice? Something else?",

        requirements: {
          pattern: 'exploring',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*Maya starts to answer, then stops.*",
            "\"I was going to say 'disappointing them' but...\"",
            "*A long pause.*",
            "\"It's not that. It's...\"",
            "*Her voice drops.*",
            "\"What if they sacrificed everything... and I'm just not good enough to deserve it?\"",
            "*The words hang there, raw and real.*",
            "\"Not the path. Me. What if I'm the disappointment?\"",
            "*She looks at you, eyes wet but steady.*",
            "\"I've never said that out loud before.\""
          ],
          emotionArc: ['deflecting', 'thinking', 'vulnerable', 'raw', 'relieved'],
          trustChange: 3,
          globalFlagsSet: ['maya_exploring_support', 'maya_core_fear_revealed'],
          unlockedContent: "Maya's deepest fear revealed—new dialogue about self-worth"
        }
      }
    ],

    // DEFAULT (always available)
    defaultApproach: {
      id: 'default_approach',
      label: "Listen and support",
      description: "You don't have all the answers. But you can be here.",

      outcome: {
        characterResponse: [
          "*You don't have the perfect thing to say. But you're here.*",
          "*Maya seems to sense that—the genuine presence, no agenda.*",
          "\"You know what's funny?\"",
          "\"Everyone always has advice. 'Do this.' 'Say that.'\"",
          "\"You're just... here.\"",
          "*A small, real smile.*",
          "\"That actually helps more than you know.\""
        ],
        emotionArc: ['stressed', 'observing', 'softening', 'appreciating'],
        trustChange: 1,
        globalFlagsSet: ['maya_default_support'],
        unlockedContent: "Standard progression through Maya's arc"
      }
    },

    resolution: {
      sharedDialogue: [
        "*Maya takes a deep breath.*",
        "\"Tomorrow. I'll talk to them tomorrow.\"",
        "*She looks at her robot companion, then back at you.*",
        "\"Whatever happens... I'm glad I'm not doing this alone.\""
      ],
      nextNodeId: 'maya_post_crossroads'
    }
  },

  // ============================================
  // DEVON'S CROSSROADS (Structure for later)
  // ============================================
  {
    id: 'devon_father_call',
    characterId: 'devon',
    name: "Devon's Call",

    stakes: "Devon's father is calling. After months of silence. The phone is ringing.",

    setup: [
      "*Devon's phone lights up. He stares at it like it's a live grenade.*",
      "\"It's him.\"",
      "*The ringtone—generic, impersonal—fills the space.*",
      "\"He never calls. Not since I left for school.\"",
      "*His hand hovers over the phone.*",
      "\"What if he... what if something's wrong?\""
    ],

    triggerConditions: {
      trustMin: 7,
      requiredFlags: ['devon_transformation_complete', 'knows_devon_father'],
      requiredTransformations: ['devon_dropping_script']
    },

    approaches: [
      {
        id: 'analytical_approach',
        label: "Help him prepare",
        description: "Talk through what his father might say. Prepare responses. Have a plan.",

        requirements: {
          pattern: 'analytical',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*Devon nods, grabbing onto the structure.*",
            "\"Right. Okay. If he says X, I respond with—\"",
            "*The phone keeps ringing.*",
            "\"No. No, I can't script this.\"",
            "*He picks up the phone.*",
            "\"Dad? ...Yeah. Yeah, I'm here.\""
          ],
          emotionArc: ['panicked', 'focusing', 'realizing', 'brave'],
          trustChange: 1,
          globalFlagsSet: ['devon_analytical_support'],
          unlockedContent: "Devon takes the call with preparation, finds it doesn't matter"
        }
      },

      {
        id: 'patience_approach',
        label: "Just be present",
        description: "Don't say anything. Just sit with him. Let him decide.",

        requirements: {
          pattern: 'patience',
          patternMin: 30
        },

        outcome: {
          characterResponse: [
            "*The phone rings. And rings.*",
            "*Devon looks at you. You don't look away.*",
            "*Something in his shoulders releases.*",
            "*He picks up.*",
            "\"Hey, Dad.\"",
            "*His voice is steadier than you've ever heard it.*"
          ],
          emotionArc: ['frozen', 'seen', 'grounded', 'ready'],
          trustChange: 2,
          globalFlagsSet: ['devon_patience_support'],
          unlockedContent: "Devon takes the call centered, finds his own strength"
        }
      }
    ],

    defaultApproach: {
      id: 'default_approach',
      label: "Encourage him",
      description: "Tell him he can do this. Whatever happens.",

      outcome: {
        characterResponse: [
          "\"Yeah. Yeah, I can do this.\"",
          "*Devon picks up the phone, hand only slightly shaking.*",
          "\"Dad? Hi. No, nothing's wrong. I just...\"",
          "*He looks at you.*",
          "\"I just wanted to hear your voice.\""
        ],
        emotionArc: ['nervous', 'determined', 'connected'],
        trustChange: 1,
        globalFlagsSet: ['devon_default_support'],
        unlockedContent: "Standard progression through Devon's arc"
      }
    },

    resolution: {
      sharedDialogue: [
        "*The call ends. Devon sits in silence.*",
        "\"He said... he said he misses me.\"",
        "*A pause.*",
        "\"I didn't have to optimize anything. I just had to... talk.\""
      ],
      nextNodeId: 'devon_post_crossroads'
    }
  }
]

/**
 * Check if a crossroads is ready to trigger
 */
export function checkCrossroadsEligible(
  characterId: string,
  context: {
    trust: number
    globalFlags: Set<string>
    witnessedTransformations: string[]
  }
): CrossroadsMoment | null {
  const eligibleCrossroads = CROSSROADS_MOMENTS.filter(c => {
    // Must be for the right character
    if (c.characterId !== characterId) return false

    // Check if already completed (use a flag pattern)
    if (context.globalFlags.has(`${c.id}_completed`)) return false

    // Check trust gate
    if (context.trust < c.triggerConditions.trustMin) return false

    // Check required flags
    for (const flag of c.triggerConditions.requiredFlags) {
      if (!context.globalFlags.has(flag)) return false
    }

    // Check required transformations
    if (c.triggerConditions.requiredTransformations) {
      for (const transformation of c.triggerConditions.requiredTransformations) {
        if (!context.witnessedTransformations.includes(transformation)) return false
      }
    }

    return true
  })

  return eligibleCrossroads[0] || null
}

/**
 * Get available approaches for a crossroads based on player state
 */
export function getAvailableApproaches(
  crossroads: CrossroadsMoment,
  context: {
    trust: number
    patterns: Record<PatternType, number>
    globalFlags: Set<string>
  }
): {
  available: CrossroadsApproach[]
  locked: { approach: CrossroadsApproach; reason: string }[]
} {
  const totalPatternPoints = Object.values(context.patterns).reduce((a, b) => a + b, 0)

  const available: CrossroadsApproach[] = [crossroads.defaultApproach]
  const locked: { approach: CrossroadsApproach; reason: string }[] = []

  for (const approach of crossroads.approaches) {
    const req = approach.requirements

    if (!req) {
      available.push(approach)
      continue
    }

    let meetsRequirements = true
    let lockReason = ''

    // Check pattern requirement
    if (req.pattern && req.patternMin !== undefined) {
      const patternValue = context.patterns[req.pattern] || 0
      const patternPercentage = totalPatternPoints > 0
        ? (patternValue / totalPatternPoints) * 100
        : 0

      if (patternPercentage < req.patternMin) {
        meetsRequirements = false
        lockReason = `Requires stronger ${req.pattern} pattern`
      }
    }

    // Check trust requirement
    if (req.trustMin !== undefined && context.trust < req.trustMin) {
      meetsRequirements = false
      lockReason = `Requires higher trust`
    }

    // Check flag requirements
    if (req.requiredFlags) {
      for (const flag of req.requiredFlags) {
        if (!context.globalFlags.has(flag)) {
          meetsRequirements = false
          lockReason = `Requires discovering more about this character`
          break
        }
      }
    }

    if (meetsRequirements) {
      available.push(approach)
    } else {
      locked.push({ approach, reason: lockReason })
    }
  }

  return { available, locked }
}

/**
 * Get crossroads by ID
 */
export function getCrossroadsById(id: string): CrossroadsMoment | null {
  return CROSSROADS_MOMENTS.find(c => c.id === id) || null
}

/**
 * Get all crossroads for a character
 */
export function getCharacterCrossroads(characterId: string): CrossroadsMoment[] {
  return CROSSROADS_MOMENTS.filter(c => c.characterId === characterId)
}
