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
