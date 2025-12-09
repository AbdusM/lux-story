/**
 * Floating Modules Registry
 *
 * State-gated narrative interludes that "slot in" between regular dialogue.
 * Based on Failbetter's Quality-Based Narrative from Fallen London.
 *
 * These modules trigger when certain state conditions are met, adding
 * texture and reactivity without modifying the main dialogue graphs.
 */

import { FloatingModule } from '@/lib/dialogue-graph'

/**
 * Registry of all floating modules in the game.
 * Organized by trigger type for efficient lookup.
 */
export const FLOATING_MODULES: FloatingModule[] = [
  // ============= PATTERN THRESHOLD MODULES =============
  // Triggered immediately when patterns cross key thresholds

  {
    moduleId: 'analytical_awakening',
    speaker: 'Narrator',
    content: [
      {
        text: `A quiet shift. You've started noticing patterns between patterns.

You see why, not just what. The gaps matter more than the words.

Something in you has sharpened.`,
        variation_id: 'analytical_v1'
      }
    ],
    triggerCondition: {
      patterns: { analytical: { min: 8 } }
    },
    insertAfter: 'pattern_threshold',
    oneShot: true,
    priority: 10,
    tags: ['pattern_voice', 'analytical']
  },

  {
    moduleId: 'helper_recognition',
    speaker: 'Narrator',
    content: [
      {
        text: `Something settles in your chest.

The weight isn't burden. it's purpose. You've stopped asking "why should I help?" and started asking "how can I help better?"

People see it. They open up faster now.`,
        variation_id: 'helping_v1'
      }
    ],
    triggerCondition: {
      patterns: { helping: { min: 8 } }
    },
    insertAfter: 'pattern_threshold',
    oneShot: true,
    priority: 10,
    tags: ['pattern_voice', 'helping']
  },

  {
    moduleId: 'builder_instinct',
    speaker: 'Narrator',
    content: [
      {
        text: `Your hands remember things your mind forgets.

Every problem is a system. Every system has components. Every component can be improved.

You don't just see solutions—you feel them.`,
        variation_id: 'building_v1'
      }
    ],
    triggerCondition: {
      patterns: { building: { min: 8 } }
    },
    insertAfter: 'pattern_threshold',
    oneShot: true,
    priority: 10,
    tags: ['pattern_voice', 'building']
  },

  {
    moduleId: 'patient_wisdom',
    speaker: 'Narrator',
    content: [
      {
        text: `Time moves differently for you now.

Not slower—less urgent. Rushing breaks things. Silence reveals them.

Some doors only open when you stop pushing.`,
        variation_id: 'patience_v1'
      }
    ],
    triggerCondition: {
      patterns: { patience: { min: 8 } }
    },
    insertAfter: 'pattern_threshold',
    oneShot: true,
    priority: 10,
    tags: ['pattern_voice', 'patience']
  },

  {
    moduleId: 'explorer_spirit',
    speaker: 'Narrator',
    content: [
      {
        text: `The unknown stopped being scary.

Every dead end is data. Every failure is feedback. There are no wrong turns—just longer routes to understanding.`,
        variation_id: 'exploring_v1'
      }
    ],
    triggerCondition: {
      patterns: { exploring: { min: 8 } }
    },
    insertAfter: 'pattern_threshold',
    oneShot: true,
    priority: 10,
    tags: ['pattern_voice', 'exploring']
  },

  // ============= HUB RETURN MODULES =============
  // Shown when returning to Samuel after completing arcs

  {
    moduleId: 'first_arc_complete',
    speaker: 'Samuel Washington',
    emotion: 'proud',
    content: [
      {
        text: `Samuel looks at you differently now.

"First conversation's always the hardest. Not what you say—what you learn to hear."

He nods. "You're starting to understand."`,
        variation_id: 'first_arc_v1'
      }
    ],
    triggerCondition: {
      hasGlobalFlags: ['maya_arc_complete', 'kai_arc_complete', 'jordan_arc_complete']
      // Only triggers after at least one of these (any one)
    },
    insertAfter: 'hub_return',
    oneShot: true,
    priority: 5,
    tags: ['samuel', 'milestone']
  },

  {
    moduleId: 'three_arcs_complete',
    speaker: 'Samuel Washington',
    emotion: 'reflective',
    content: [
      {
        text: `Samuel watches the station, but his attention is on you.

"Three stories. Three crossroads. You've been part of all of them."

He turns. "What patterns are you starting to see?"`,
        variation_id: 'three_arcs_v1'
      }
    ],
    triggerCondition: {
      hasGlobalFlags: ['maya_arc_complete', 'kai_arc_complete', 'jordan_arc_complete']
    },
    insertAfter: 'hub_return',
    oneShot: true,
    priority: 8,
    tags: ['samuel', 'milestone']
  },

  // ============= ARC TRANSITION MODULES =============
  // Shown at natural breaks between character arcs

  {
    moduleId: 'maya_arc_reflection',
    speaker: 'Narrator',
    content: [
      {
        text: `The station feels different after Maya.

The clock still ticks. The departure boards still flicker. But something in the air has changed.

You helped someone find their direction. That changes you too.`,
        variation_id: 'maya_reflect_v1'
      }
    ],
    triggerCondition: {
      hasGlobalFlags: ['maya_arc_complete']
    },
    insertAfter: 'arc_transition',
    oneShot: true,
    priority: 3,
    tags: ['reflection', 'maya']
  },

  {
    moduleId: 'high_trust_contrast',
    speaker: 'Narrator',
    content: [
      {
        text: `You've noticed something.

Some people open up immediately. Others take longer. The difference is you—the questions you ask, the patience you show.`,
        variation_id: 'trust_contrast_v1'
      }
    ],
    triggerCondition: {
      // Triggers when player has both high and low trust with different characters
      // This is a simplified version - ideally would check character-specific trust
      patterns: { helping: { min: 5 }, patience: { min: 5 } }
    },
    insertAfter: 'arc_transition',
    oneShot: true,
    priority: 4,
    tags: ['trust', 'meta']
  },

  // ============= SAMUEL OBSERVATION MODULES =============
  // Samuel notices when patterns grow during character arcs
  // Makes him feel like he's watching the player's journey

  {
    moduleId: 'samuel_notices_helper',
    speaker: 'Samuel Washington',
    emotion: 'knowing',
    content: [
      {
        text: `Samuel catches your eye as you return.

"You've been listening. Not hearing—listening."

"People feel that. When someone wants to understand, not respond. That's rare."`,
        variation_id: 'samuel_helper_v1'
      }
    ],
    triggerCondition: {
      patterns: { helping: { min: 6 } }
    },
    insertAfter: 'hub_return',
    oneShot: true,
    priority: 7,
    tags: ['samuel', 'pattern_observation', 'helping']
  },

  {
    moduleId: 'samuel_notices_patience',
    speaker: 'Samuel Washington',
    emotion: 'impressed',
    content: [
      {
        text: `Samuel is watching the departure board, but he's been waiting for you.

"You take your time. Most people rush to fill silences. You let them breathe."

"That's how you find what's underneath."`,
        variation_id: 'samuel_patience_v1'
      }
    ],
    triggerCondition: {
      patterns: { patience: { min: 6 } }
    },
    insertAfter: 'hub_return',
    oneShot: true,
    priority: 7,
    tags: ['samuel', 'pattern_observation', 'patience']
  },

  {
    moduleId: 'samuel_notices_builder',
    speaker: 'Samuel Washington',
    emotion: 'thoughtful',
    content: [
      {
        text: `Samuel looks at you differently now.

"You see what could be, not just what is."

He nods.

"Builder thinking. Some tear down. Others repair. You imagine what hasn't been made yet."`,
        variation_id: 'samuel_builder_v1'
      }
    ],
    triggerCondition: {
      patterns: { building: { min: 6 } }
    },
    insertAfter: 'hub_return',
    oneShot: true,
    priority: 7,
    tags: ['samuel', 'pattern_observation', 'building']
  },

  {
    moduleId: 'samuel_notices_analyst',
    speaker: 'Samuel Washington',
    emotion: 'appreciative',
    content: [
      {
        text: `Samuel's watching you with quiet attention.

"You see patterns. Connections others miss."

A slight smile.

"Some call it overthinking. I call it seeing clearly."`,
        variation_id: 'samuel_analyst_v1'
      }
    ],
    triggerCondition: {
      patterns: { analytical: { min: 6 } }
    },
    insertAfter: 'hub_return',
    oneShot: true,
    priority: 7,
    tags: ['samuel', 'pattern_observation', 'analytical']
  },

  {
    moduleId: 'samuel_notices_explorer',
    speaker: 'Samuel Washington',
    emotion: 'warm',
    content: [
      {
        text: `Samuel catches you looking around the station.

"You can't help it, can you? Always asking. Always wondering what's around the next corner."

He chuckles.

"Never lose that. The curious ones find what no one else is looking for."`,
        variation_id: 'samuel_explorer_v1'
      }
    ],
    triggerCondition: {
      patterns: { exploring: { min: 6 } }
    },
    insertAfter: 'hub_return',
    oneShot: true,
    priority: 7,
    tags: ['samuel', 'pattern_observation', 'exploring']
  }
]

/**
 * Get modules that should trigger for a given insertion point
 */
export function getModulesForInsertPoint(
  insertAfter: FloatingModule['insertAfter']
): FloatingModule[] {
  return FLOATING_MODULES
    .filter(m => m.insertAfter === insertAfter)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
}

/**
 * Get a specific module by ID
 */
export function getModuleById(moduleId: string): FloatingModule | undefined {
  return FLOATING_MODULES.find(m => m.moduleId === moduleId)
}
