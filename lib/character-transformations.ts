/**
 * Character Transformation System
 * Dramatic moments where characters reveal their true selves
 *
 * Design Philosophy:
 * - Transformations are the payoff for relationship building
 * - They should feel EARNED, not handed out
 * - The character genuinely changes - this affects future dialogue
 * - These are memorable moments players will remember
 */

import { PatternType } from './patterns'

/**
 * Types of transformation moments
 */
export type TransformationType =
  | 'growth'        // Character overcomes a limitation
  | 'revelation'    // Character reveals hidden truth about themselves
  | 'breakthrough'  // Character has a sudden realization
  | 'crisis'        // Character faces and resolves inner conflict

/**
 * A single transformation moment definition
 */
export interface TransformationMoment {
  id: string
  characterId: string
  name: string                    // "Maya's Awakening", "Devon's Breakthrough"
  type: TransformationType

  // What must be true for this to trigger
  gates: {
    trustMin: number
    requiredFlags: string[]       // Knowledge/global flags needed
    requiredPatterns?: {
      pattern: PatternType
      minLevel: number
    }[]
  }

  // The transformation itself
  transformation: {
    beforeState: string           // Description of character before
    afterState: string            // Description of character after
    triggerDialogue: string[]     // Multi-part revelation dialogue
    emotionArc: string[]          // Emotions through the transformation
  }

  // What changes after transformation
  consequences: {
    newRelationshipStatus?: 'acquaintance' | 'confidant'
    unlockedDialogueNodes?: string[]  // New paths available
    characterEvolution?: {
      quirksRemoved?: string[]    // Old defensive quirks that disappear
      quirksAdded?: string[]      // New authentic quirks that emerge
    }
    globalFlagsSet: string[]
  }
}

/**
 * All character transformation moments
 * Starting with Maya as proof of concept
 */
export const TRANSFORMATION_MOMENTS: TransformationMoment[] = [
  // ============================================
  // MAYA'S TRANSFORMATIONS
  // ============================================

  {
    id: 'maya_robot_heart_reveal',
    characterId: 'maya',
    name: "Maya's Awakening",
    type: 'revelation',

    gates: {
      trustMin: 5,
      requiredFlags: ['knows_robotics', 'knows_maya_family_pressure'],
      requiredPatterns: [
        { pattern: 'building', minLevel: 3 }  // Player must be a builder too
      ]
    },

    transformation: {
      beforeState: 'Maya hides her engineering passion, deflects with humor, uses hedging language',
      afterState: 'Maya openly identifies as an engineer, speaks directly about her passion, sets boundaries',

      triggerDialogue: [
        "*Maya pulls the robot from her bag. Its eyes glow softly.*",
        "\"I used to think I had to choose. Doctor OR inventor. Platform 1 OR Platform 3.\"",
        "*The robot projects a holographic heart—gears and springs working in perfect rhythm.*",
        "\"What if our letters are tests?\"",
        "*She looks at you directly for the first time.*",
        "\"What if they tell us where we're supposed to go, just to see if we're brave enough to choose differently?\"",
        "*The robot chirps. Maya laughs—a real laugh, not a nervous one.*",
        "\"I'm an engineer. That's who I am. Maybe it's time everyone knew that.\""
      ],

      emotionArc: ['vulnerable', 'wondering', 'hopeful', 'determined', 'joyful', 'resolved']
    },

    consequences: {
      newRelationshipStatus: 'confidant',
      unlockedDialogueNodes: [
        'maya_confident_engineer',
        'maya_revisit_parents',
        'maya_collaboration_mode'
      ],
      characterEvolution: {
        quirksRemoved: ['maya_deflect_humor', 'maya_hedging_language'],
        quirksAdded: ['maya_direct_vulnerable', 'maya_confident_technical']
      },
      globalFlagsSet: ['maya_transformation_complete', 'maya_engineer_identity']
    }
  },

  {
    id: 'maya_family_breakthrough',
    characterId: 'maya',
    name: "Maya's Boundary",
    type: 'growth',

    gates: {
      trustMin: 7,
      requiredFlags: [
        'maya_transformation_complete',  // Must have had first transformation
        'knows_unsent_email'
      ],
      requiredPatterns: [
        { pattern: 'patience', minLevel: 4 }  // Player gave her space
      ]
    },

    transformation: {
      beforeState: 'Maya carries guilt about potentially disappointing her parents',
      afterState: 'Maya has set healthy boundaries, sees her parents\' sacrifice as for HER, not for a career',

      triggerDialogue: [
        "\"I had dinner with my parents last night.\"",
        "*Maya pauses, collecting herself.*",
        "\"I didn't tell them everything. Not yet.\"",
        "\"But I stopped apologizing for loving robotics.\"",
        "*A small, surprised laugh.*",
        "\"My mom asked about my robot. Actually asked.\"",
        "\"Maybe that's the first step.\"",
        "*She looks at you with gratitude.*",
        "\"Understanding that their sacrifice wasn't for a doctor—it was for ME. Whoever I become.\""
      ],

      emotionArc: ['nervous', 'thoughtful', 'surprised', 'hopeful', 'grateful', 'peaceful']
    },

    consequences: {
      unlockedDialogueNodes: [
        'maya_healthy_family',
        'maya_career_confident',
        'maya_mentor_mode'
      ],
      characterEvolution: {
        quirksRemoved: ['maya_trailing_off']  // She finishes her thoughts now
      },
      globalFlagsSet: ['maya_family_resolved', 'maya_full_arc_complete']
    }
  },

  // ============================================
  // DEVON'S TRANSFORMATIONS (Structure for later)
  // ============================================

  {
    id: 'devon_dropping_script',
    characterId: 'devon',
    name: "Devon's Connection",
    type: 'breakthrough',

    gates: {
      trustMin: 7,
      requiredFlags: ['devon_optimizer_tested'],
      requiredPatterns: [
        { pattern: 'patience', minLevel: 4 }  // Player didn't rush him
      ]
    },

    transformation: {
      beforeState: 'Devon speaks in pseudo-code, treats emotions as variables, builds systems to avoid connection',
      afterState: 'Devon uses "I" statements, admits fear directly, sees that connection IS the system',

      triggerDialogue: [
        "*The simulation fades. Devon looks at his hands.*",
        "\"I keep building scripts because scripts don't hang up.\"",
        "\"Scripts don't cry.\"",
        "\"Scripts don't say 'I'm fine' when they're drowning.\"",
        "*A long pause.*",
        "\"But my dad doesn't want an algorithm.\"",
        "*Devon's voice cracks.*",
        "\"He wants his son.\""
      ],

      emotionArc: ['analytical', 'defensive', 'raw', 'vulnerable', 'breakthrough']
    },

    consequences: {
      newRelationshipStatus: 'confidant',
      unlockedDialogueNodes: [
        'devon_authentic',
        'devon_father_call',
        'devon_human_connection'
      ],
      characterEvolution: {
        quirksRemoved: ['devon_pseudocode_everything']
      },
      globalFlagsSet: ['devon_transformation_complete', 'devon_human_connection']
    }
  },

  // ============================================
  // SAMUEL'S TRANSFORMATIONS
  // ============================================

  {
    id: 'samuel_the_farewell',
    characterId: 'samuel',
    name: "Samuel's Farewell",
    type: 'revelation',

    gates: {
      trustMin: 8,
      requiredFlags: ['knows_samuel_past_failure', 'knows_samuel_station_history'],
      requiredPatterns: [
        { pattern: 'patience', minLevel: 5 }
      ]
    },

    transformation: {
      beforeState: 'Samuel speaks in riddles and metaphors, keeps his own story hidden',
      afterState: 'Samuel reveals why he stays at the station, shares his own unfollowed path',

      triggerDialogue: [
        "*Samuel looks at the departure board, then back at you.*",
        "\"I've never told anyone why I stay here.\"",
        "*He gestures at the station around him.*",
        "\"I had a letter once. Platform 7. Music.\"",
        "\"I was terrified. So I waited for the 'right' train.\"",
        "*A sad smile.*",
        "\"Waited so long, the platform closed.\"",
        "\"Now I help others board while they still can.\"",
        "*His owl eyes are soft.*",
        "\"Don't wait for certainty. Certainty is a train that never comes.\""
      ],

      emotionArc: ['contemplative', 'vulnerable', 'regretful', 'accepting', 'hopeful']
    },

    consequences: {
      newRelationshipStatus: 'confidant',
      unlockedDialogueNodes: [
        'samuel_personal_advice',
        'samuel_final_blessing',
        'samuel_music_memory'
      ],
      characterEvolution: {
        quirksRemoved: ['samuel_warm_cryptic'],
        quirksAdded: ['samuel_direct_wisdom']
      },
      globalFlagsSet: ['samuel_transformation_complete', 'knows_samuel_full_story']
    }
  },

  // ============================================
  // TESS'S TRANSFORMATIONS
  // ============================================

  {
    id: 'tess_the_demo_tape',
    characterId: 'tess',
    name: "Tess's Demo Tape",
    type: 'revelation',

    gates: {
      trustMin: 6,
      requiredFlags: ['knows_tess_corporate_past'],
      requiredPatterns: [
        { pattern: 'building', minLevel: 4 }
      ]
    },

    transformation: {
      beforeState: 'Tess is guarded, speaks in clipped sentences, judges harshly',
      afterState: 'Tess reveals her own artistic ambitions, admits she gave up her dream',

      triggerDialogue: [
        "*Tess stops flipping records. Her hand rests on one sleeve.*",
        "\"This one.\"",
        "*She pulls out a dusty cassette.*",
        "\"My demo tape. 1987.\"",
        "\"I was good. Real good.\"",
        "*Her voice drops.*",
        "\"Label wanted to change everything. My sound. My look. My name.\"",
        "\"I walked away. Thought I was being brave.\"",
        "*She laughs bitterly.*",
        "\"Now I curate other people's dreams instead of making my own.\"",
        "*The record flipping resumes, slower now.*",
        "\"Don't mistake stubbornness for integrity. Sometimes compromise isn't selling out—it's showing up.\""
      ],

      emotionArc: ['guarded', 'nostalgic', 'proud', 'bitter', 'vulnerable', 'wise']
    },

    consequences: {
      newRelationshipStatus: 'confidant',
      unlockedDialogueNodes: [
        'tess_music_advice',
        'tess_industry_wisdom',
        'tess_authentic_praise'
      ],
      characterEvolution: {
        quirksRemoved: ['tess_clipped_sentences'],
        quirksAdded: ['tess_open_reflection']
      },
      globalFlagsSet: ['tess_transformation_complete', 'knows_tess_full_story']
    }
  },

  // ============================================
  // MARCUS'S TRANSFORMATIONS
  // ============================================

  {
    id: 'marcus_the_code_blue',
    characterId: 'marcus',
    name: "Marcus's Code Blue",
    type: 'revelation',

    gates: {
      trustMin: 6,
      requiredFlags: ['knows_marcus_first_patient'],
      requiredPatterns: [
        { pattern: 'helping', minLevel: 4 }
      ]
    },

    transformation: {
      beforeState: 'Marcus is measured, careful, counts heartbeats as a distancing mechanism',
      afterState: 'Marcus reveals the weight he carries, admits that counting is his way of coping',

      triggerDialogue: [
        "*Marcus's hands are still. For once, he's not counting.*",
        "\"Seventy-two is resting. Ninety is walking. One-twenty is running.\"",
        "\"Zero...\"",
        "*A long pause.*",
        "\"Zero is the sound of a family in the hallway.\"",
        "\"I count because if I'm counting, I'm not thinking about zero.\"",
        "*He finally looks up.*",
        "\"Every heartbeat I hear is someone's whole world. Someone's kid. Someone's mother.\"",
        "\"The weight of that...\"",
        "*His voice steadies.*",
        "\"That's why I stay. Not despite the weight. Because of it.\""
      ],

      emotionArc: ['measured', 'analytical', 'vulnerable', 'heavy', 'resolved', 'purposeful']
    },

    consequences: {
      newRelationshipStatus: 'confidant',
      unlockedDialogueNodes: [
        'marcus_coping_wisdom',
        'marcus_calling_confirmed',
        'marcus_mentorship_offer'
      ],
      characterEvolution: {
        quirksRemoved: ['marcus_constant_counting'],
        quirksAdded: ['marcus_present_presence']
      },
      globalFlagsSet: ['marcus_transformation_complete', 'knows_marcus_full_story']
    }
  },

  // ============================================
  // ROHAN'S TRANSFORMATIONS
  // ============================================

  {
    id: 'rohan_the_algorithm_confession',
    characterId: 'rohan',
    name: "Rohan's Algorithm Confession",
    type: 'breakthrough',

    gates: {
      trustMin: 7,
      requiredFlags: ['knows_rohan_algorithm_fear'],
      requiredPatterns: [
        { pattern: 'patience', minLevel: 5 },
        { pattern: 'exploring', minLevel: 3 }
      ]
    },

    transformation: {
      beforeState: 'Rohan teaches through questions, keeps philosophical distance, fears obsolescence',
      afterState: 'Rohan admits his own vulnerability, stops hiding behind Socratic method',

      triggerDialogue: [
        "*Rohan sets down his book. His hands tremble slightly.*",
        "\"I teach critical thinking. That's what I tell myself.\"",
        "\"But you know what I'm really doing?\"",
        "*He looks at the old texts surrounding him.*",
        "\"I'm terrified that everything I value—deep reading, slow thought, wisdom earned over decades—\"",
        "\"—will become obsolete. Quaint. A museum curiosity.\"",
        "*A bitter laugh.*",
        "\"'Rohan: Philosopher. Like a typewriter. Charming but useless.'\"",
        "*He meets your eyes.*",
        "\"I ask questions because I'm afraid if I give answers, they'll be wrong. Permanently wrong.\"",
        "\"But maybe that fear is the real obsolescence.\""
      ],

      emotionArc: ['philosophical', 'raw', 'fearful', 'bitter', 'vulnerable', 'breakthrough']
    },

    consequences: {
      newRelationshipStatus: 'confidant',
      unlockedDialogueNodes: [
        'rohan_direct_wisdom',
        'rohan_collaboration_offer',
        'rohan_future_hope'
      ],
      characterEvolution: {
        quirksRemoved: ['rohan_socratic_deflection'],
        quirksAdded: ['rohan_direct_vulnerability']
      },
      globalFlagsSet: ['rohan_transformation_complete', 'knows_rohan_full_story']
    }
  },

  // ============================================
  // YAQUIN'S TRANSFORMATIONS
  // ============================================

  {
    id: 'yaquin_finding_voice',
    characterId: 'yaquin',
    name: "Yaquin's Voice",
    type: 'growth',

    gates: {
      trustMin: 5,
      requiredFlags: ['knows_yaquin_doubt'],
      requiredPatterns: [
        { pattern: 'exploring', minLevel: 4 }
      ]
    },

    transformation: {
      beforeState: 'Yaquin constantly minimizes herself, uses "just" excessively, questions her own expertise',
      afterState: 'Yaquin owns her knowledge, speaks with quiet authority, claims her space',

      triggerDialogue: [
        "*Yaquin takes a breath. Something shifts in her posture.*",
        "\"I keep saying 'just.' 'Just an assistant.' 'Just helping out.'\"",
        "\"You know why?\"",
        "*Her voice strengthens.*",
        "\"Because if I stay small, no one can tell me I've taken up too much space.\"",
        "\"But that's not humility. That's hiding.\"",
        "*She stands a little taller.*",
        "\"I know things. I've worked hard to know things.\"",
        "\"Maybe it's time I stopped apologizing for being competent.\"",
        "*A surprised laugh.*",
        "\"That felt... good. Saying that out loud.\""
      ],

      emotionArc: ['hesitant', 'reflective', 'surprised', 'determined', 'joyful']
    },

    consequences: {
      newRelationshipStatus: 'confidant',
      unlockedDialogueNodes: [
        'yaquin_confident_teaching',
        'yaquin_assertion_mode',
        'yaquin_mentorship'
      ],
      characterEvolution: {
        quirksRemoved: ['yaquin_excessive_just'],
        quirksAdded: ['yaquin_quiet_authority']
      },
      globalFlagsSet: ['yaquin_transformation_complete', 'yaquin_found_voice']
    }
  }
]

/**
 * Check if a transformation is ready to trigger
 */
export function checkTransformationEligible(
  characterId: string,
  context: {
    trust: number
    knowledgeFlags: Set<string>
    globalFlags: Set<string>
    patterns: Record<PatternType, number>
    witnessedTransformations: string[]
  }
): TransformationMoment | null {
  const eligibleTransformations = TRANSFORMATION_MOMENTS.filter(t => {
    // Must be for the right character
    if (t.characterId !== characterId) return false

    // Must not have already witnessed
    if (context.witnessedTransformations.includes(t.id)) return false

    // Check trust gate
    if (context.trust < t.gates.trustMin) return false

    // Check flag gates (both knowledge and global)
    for (const flag of t.gates.requiredFlags) {
      if (!context.knowledgeFlags.has(flag) && !context.globalFlags.has(flag)) {
        return false
      }
    }

    // Check pattern gates
    if (t.gates.requiredPatterns) {
      for (const req of t.gates.requiredPatterns) {
        if ((context.patterns[req.pattern] || 0) < req.minLevel) {
          return false
        }
      }
    }

    return true
  })

  // Return the first eligible (they should be ordered by priority)
  return eligibleTransformations[0] || null
}

/**
 * Get transformation by ID
 */
export function getTransformationById(id: string): TransformationMoment | null {
  return TRANSFORMATION_MOMENTS.find(t => t.id === id) || null
}

/**
 * Get all transformations for a character
 */
export function getCharacterTransformations(characterId: string): TransformationMoment[] {
  return TRANSFORMATION_MOMENTS.filter(t => t.characterId === characterId)
}

/**
 * Get transformation progress - how close is a transformation to triggering?
 */
export function getTransformationProgress(
  transformationId: string,
  context: {
    trust: number
    knowledgeFlags: Set<string>
    globalFlags: Set<string>
    patterns: Record<PatternType, number>
  }
): {
  progress: number  // 0-100%
  missingRequirements: string[]
} {
  const transformation = getTransformationById(transformationId)
  if (!transformation) return { progress: 0, missingRequirements: ['Unknown transformation'] }

  const missing: string[] = []
  let met = 0
  let total = 0

  // Trust check
  total++
  if (context.trust >= transformation.gates.trustMin) {
    met++
  } else {
    missing.push(`Trust ${transformation.gates.trustMin}+ (have ${context.trust})`)
  }

  // Flag checks
  for (const flag of transformation.gates.requiredFlags) {
    total++
    if (context.knowledgeFlags.has(flag) || context.globalFlags.has(flag)) {
      met++
    } else {
      missing.push(`Discover: ${flag.replace(/_/g, ' ')}`)
    }
  }

  // Pattern checks
  if (transformation.gates.requiredPatterns) {
    for (const req of transformation.gates.requiredPatterns) {
      total++
      if ((context.patterns[req.pattern] || 0) >= req.minLevel) {
        met++
      } else {
        missing.push(`${req.pattern} pattern ${req.minLevel}+`)
      }
    }
  }

  return {
    progress: Math.round((met / total) * 100),
    missingRequirements: missing
  }
}
