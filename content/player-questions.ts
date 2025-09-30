/**
 * The Reciprocity Engine: Player Self-Discovery Questions
 *
 * These questions are asked by high-trust NPCs to allow the player to reveal
 * their own values and history. Answers directly update PlayerPatterns,
 * transforming the experience from empathy simulator to mutual self-discovery.
 *
 * Questions are derived from universal self-reflection themes and designed
 * to feel natural within character conversations, not like therapy sessions.
 */

import { StateChange } from '../lib/character-state'

export interface ReciprocityQuestion {
  questionId: string
  questionText: string
  /** Which character is asking this question */
  askedBy?: 'maya' | 'devon' | 'jordan' | 'samuel'
  /** Minimum trust required for character to ask this */
  minTrust?: number
  /** Required knowledge flags before this question can be asked */
  requiredFlags?: string[]
  choices: Array<{
    choiceId: string
    choiceText: string
    /** Direct impact on PlayerPatterns */
    stateChanges: StateChange[]
    /** Optional: How the NPC responds to this answer */
    npcResponse?: string
  }>
}

export const reciprocityQuestions: Record<string, ReciprocityQuestion> = {
  // ============= PARENTAL WORK LEGACY =============
  parental_work_legacy: {
    questionId: 'parental_work_legacy',
    questionText: "Can I ask you something personal? | What did you learn about work from watching your parents? | I'm curious because... well, my parents' sacrifice shaped everything about how I see careers.",
    askedBy: 'maya',
    minTrust: 6,
    requiredFlags: ['knows_family_pressure', 'helped_with_choice'],
    choices: [
      {
        choiceId: 'stable_career_parent',
        choiceText: "They taught me stability matters most. Same job for decades, reliable income.",
        stateChanges: [
          { patternChanges: { patience: 2, building: 1, exploring: -1 } }
        ],
        npcResponse: "That's why you were so patient with me. You understand the weight of expectations."
      },
      {
        choiceId: 'entrepreneurial_parent',
        choiceText: "They were always starting something new. Risk was normal in our house.",
        stateChanges: [
          { patternChanges: { exploring: 2, analytical: 1, patience: -1 } }
        ],
        npcResponse: "That explains why you pushed me to consider robotics. You see possibility, not just risk."
      },
      {
        choiceId: 'struggling_parent',
        choiceText: "I watched them struggle. Multiple jobs, never enough. It made me want to help.",
        stateChanges: [
          { patternChanges: { helping: 2, patience: 1, analytical: 1 } }
        ],
        npcResponse: "You know what it's like to carry weight. That's why you could hold space for mine."
      },
      {
        choiceId: 'absent_parent_work',
        choiceText: "They were always working. Success meant absence in our family.",
        stateChanges: [
          { patternChanges: { patience: 2, helping: 1, building: -1 } }
        ],
        npcResponse: "So you learned early that achievement has costs. No wonder you understood my conflict."
      }
    ]
  },

  // ============= SUCCESS DEFINITION =============
  success_definition: {
    questionId: 'success_definition',
    questionText: "You helped me reframe what success means. | But I'm curious - what does it mean to you? | Not the answer you'd give in an interview. The real one.",
    askedBy: 'jordan',
    minTrust: 5,
    requiredFlags: ['helped_with_impostor_syndrome'],
    choices: [
      {
        choiceId: 'success_as_recognition',
        choiceText: "Being recognized as exceptional at what I do. I want to be known for something.",
        stateChanges: [
          { type: 'pattern', pattern: 'analytical', delta: 2 },
          { type: 'pattern', pattern: 'building', delta: 1 },
          { type: 'pattern', pattern: 'patience', delta: -1 }
        ],
        npcResponse: "That drive for excellence... it's powerful but heavy. I carried that for years."
      },
      {
        choiceId: 'success_as_service',
        choiceText: "Making life better for people who need it. Success is measured in lives touched.",
        stateChanges: [
          { type: 'pattern', pattern: 'helping', delta: 3 },
          { type: 'pattern', pattern: 'patience', delta: 1 }
        ],
        npcResponse: "That's beautiful. And explains why you took time with a stranger having a crisis."
      },
      {
        choiceId: 'success_as_freedom',
        choiceText: "Having choices. Not being trapped by circumstances or other people's expectations.",
        stateChanges: [
          { type: 'pattern', pattern: 'exploring', delta: 2 },
          { type: 'pattern', pattern: 'patience', delta: 1 },
          { type: 'pattern', pattern: 'helping', delta: -1 }
        ],
        npcResponse: "Freedom from constraints... yeah, I get that. Seven jobs taught me about cages."
      },
      {
        choiceId: 'success_as_creation',
        choiceText: "Building something that didn't exist before. Leaving a mark through creation.",
        stateChanges: [
          { type: 'pattern', pattern: 'building', delta: 3 },
          { type: 'pattern', pattern: 'exploring', delta: 1 }
        ],
        npcResponse: "The builder's drive. That's why you understood my need to make, not just consume."
      }
    ]
  },

  // ============= THE PROVING GROUND =============
  proving_ground: {
    questionId: 'proving_ground',
    questionText: "*After a long pause* | You saw through my systems to what I was really doing - trying to prove something. | What about you? What are you trying to prove? And to whom?",
    askedBy: 'devon',
    minTrust: 7,
    requiredFlags: ['broke_through_systems', 'devon_vulnerable'],
    choices: [
      {
        choiceId: 'proving_to_parents',
        choiceText: "That my parents' sacrifices were worth it. Everything is about validating their investment.",
        stateChanges: [
          { type: 'pattern', pattern: 'analytical', delta: 2 },
          { type: 'pattern', pattern: 'building', delta: 2 },
          { type: 'pattern', pattern: 'exploring', delta: -1 }
        ],
        npcResponse: "The weight of being someone's hope. I understand that pressure completely."
      },
      {
        choiceId: 'proving_to_self',
        choiceText: "That I'm capable of more than I've shown. It's really about proving it to myself.",
        stateChanges: [
          { type: 'pattern', pattern: 'patience', delta: 2 },
          { type: 'pattern', pattern: 'exploring', delta: 2 }
        ],
        npcResponse: "Internal validation. The hardest kind. That takes real strength."
      },
      {
        choiceId: 'proving_nothing',
        choiceText: "Honestly? I'm tired of proving things. I just want to be useful.",
        stateChanges: [
          { type: 'pattern', pattern: 'helping', delta: 3 },
          { type: 'pattern', pattern: 'patience', delta: 2 }
        ],
        npcResponse: "No performance, just purpose. That's... refreshing. And rare."
      },
      {
        choiceId: 'proving_belonging',
        choiceText: "That I belong in spaces that weren't built for people like me.",
        stateChanges: [
          { type: 'pattern', pattern: 'analytical', delta: 1 },
          { type: 'pattern', pattern: 'building', delta: 2 },
          { type: 'pattern', pattern: 'helping', delta: 1 }
        ],
        npcResponse: "Breaking into systems not designed for you... that's its own kind of engineering."
      }
    ]
  },

  // ============= UNLIMITED RESOURCES =============
  unlimited_resources: {
    questionId: 'unlimited_resources',
    questionText: "Here's something I think about sometimes. | If money wasn't a factor - like, at all - what would you actually do with your time? | Not what sounds noble. What would you really do?",
    askedBy: 'maya',
    minTrust: 5,
    requiredFlags: ['helped_with_choice'],
    choices: [
      {
        choiceId: 'would_create',
        choiceText: "Build things. Code, art, machines - doesn't matter. I just need to create.",
        stateChanges: [
          { type: 'pattern', pattern: 'building', delta: 3 },
          { type: 'pattern', pattern: 'exploring', delta: 1 }
        ],
        npcResponse: "Pure creation drive. That's what I feel with robotics. The need to make something exist."
      },
      {
        choiceId: 'would_explore',
        choiceText: "Travel, learn languages, study random subjects. Just... explore everything.",
        stateChanges: [
          { type: 'pattern', pattern: 'exploring', delta: 3 },
          { type: 'pattern', pattern: 'analytical', delta: 1 }
        ],
        npcResponse: "Curiosity without boundaries. I envy that. My curiosity always had guardrails."
      },
      {
        choiceId: 'would_teach',
        choiceText: "Teach. Mentor. Help people see what they can't see in themselves.",
        stateChanges: [
          { type: 'pattern', pattern: 'helping', delta: 3 },
          { type: 'pattern', pattern: 'patience', delta: 1 }
        ],
        npcResponse: "That's literally what you just did for me. You're already living your truth."
      },
      {
        choiceId: 'would_rest',
        choiceText: "Honestly? Rest. Read. Garden. Just... exist without producing.",
        stateChanges: [
          { type: 'pattern', pattern: 'patience', delta: 3 },
          { type: 'pattern', pattern: 'exploring', delta: 1 },
          { type: 'pattern', pattern: 'building', delta: -1 }
        ],
        npcResponse: "The radical act of just being. In our productivity-obsessed world, that's revolutionary."
      }
    ]
  },

  // ============= THE ONLY ONE =============
  the_only_one: {
    questionId: 'the_only_one',
    questionText: "Can I tell you why I really asked you to listen to my speech? | I've been the 'only' so many times. Only woman, only one without a degree, only one who job-hopped. | Have you ever been the only one in a room? How did you handle it?",
    askedBy: 'jordan',
    minTrust: 6,
    requiredFlags: ['listened_to_speech'],
    choices: [
      {
        choiceId: 'only_advocated',
        choiceText: "I spoke up for others like me who weren't in the room yet.",
        stateChanges: [
          { type: 'pattern', pattern: 'helping', delta: 3 },
          { type: 'pattern', pattern: 'patience', delta: 1 }
        ],
        npcResponse: "Using your seat at the table to pull up chairs. That's real leadership."
      },
      {
        choiceId: 'only_proved',
        choiceText: "I worked twice as hard to prove I deserved to be there.",
        stateChanges: [
          { type: 'pattern', pattern: 'analytical', delta: 2 },
          { type: 'pattern', pattern: 'building', delta: 2 },
          { type: 'pattern', pattern: 'patience', delta: -1 }
        ],
        npcResponse: "The exhausting performance of belonging. I know that dance too well."
      },
      {
        choiceId: 'only_observed',
        choiceText: "I stayed quiet, observed, learned the unwritten rules first.",
        stateChanges: [
          { type: 'pattern', pattern: 'patience', delta: 3 },
          { type: 'pattern', pattern: 'analytical', delta: 1 },
          { type: 'pattern', pattern: 'helping', delta: -1 }
        ],
        npcResponse: "Strategic invisibility. Sometimes that's how we survive before we can thrive."
      },
      {
        choiceId: 'only_connected',
        choiceText: "I found the other 'onlys' and we built our own support network.",
        stateChanges: [
          { type: 'pattern', pattern: 'helping', delta: 2 },
          { type: 'pattern', pattern: 'exploring', delta: 1 },
          { type: 'pattern', pattern: 'building', delta: 1 }
        ],
        npcResponse: "Creating belonging instead of seeking permission. That's powerful."
      }
    ]
  },

  // ============= RUNNING FROM OR TOWARD =============
  running_from_or_toward: {
    questionId: 'running_from_or_toward',
    questionText: "You know what I realized, talking to you? | I've been running - sometimes toward things, sometimes away from them. | What about you? What are you running toward? Or running from?",
    askedBy: 'devon',
    minTrust: 6,
    requiredFlags: ['helped_with_emotions'],
    choices: [
      {
        choiceId: 'running_toward_purpose',
        choiceText: "Toward something meaningful. I'm tired of work that doesn't matter.",
        stateChanges: [
          { type: 'pattern', pattern: 'exploring', delta: 2 },
          { type: 'pattern', pattern: 'building', delta: 1 },
          { type: 'pattern', pattern: 'helping', delta: 1 }
        ],
        npcResponse: "Purpose-driven momentum. That's sustainable. Fear-based running exhausts you."
      },
      {
        choiceId: 'running_from_limitation',
        choiceText: "Away from limitations others placed on me. Old definitions that don't fit.",
        stateChanges: [
          { type: 'pattern', pattern: 'analytical', delta: 2 },
          { type: 'pattern', pattern: 'exploring', delta: 1 },
          { type: 'pattern', pattern: 'patience', delta: -1 }
        ],
        npcResponse: "Escaping others' blueprints. I built systems to avoid that exact feeling."
      },
      {
        choiceId: 'running_both',
        choiceText: "Both, honestly. Running from what I don't want, toward what I hope exists.",
        stateChanges: [
          { type: 'pattern', pattern: 'patience', delta: 2 },
          { type: 'pattern', pattern: 'exploring', delta: 1 },
          { type: 'pattern', pattern: 'helping', delta: 1 }
        ],
        npcResponse: "The honest answer. Push and pull together. That's most of us, really."
      },
      {
        choiceId: 'not_running',
        choiceText: "I'm not running. I'm trying to be present, wherever I am.",
        stateChanges: [
          { type: 'pattern', pattern: 'patience', delta: 3 },
          { type: 'pattern', pattern: 'helping', delta: 1 },
          { type: 'pattern', pattern: 'exploring', delta: -1 }
        ],
        npcResponse: "Stillness as resistance. In a world obsessed with motion, that's profound."
      }
    ]
  },

  // ============= TEN YEARS HENCE =============
  ten_years_hence: {
    questionId: 'ten_years_hence',
    questionText: "This station makes you think about time differently. | If you could see yourself ten years from now - best case scenario - what would your days actually look like? | Not your job title. Your actual life.",
    askedBy: 'samuel',
    minTrust: 8,
    requiredFlags: ['completed_reflection_loop', 'high_trust_established'],
    choices: [
      {
        choiceId: 'future_leading',
        choiceText: "Leading something important. Teams looking to me for direction and vision.",
        stateChanges: [
          { type: 'pattern', pattern: 'analytical', delta: 2 },
          { type: 'pattern', pattern: 'building', delta: 2 }
        ],
        npcResponse: "The architect pattern. Building through others. That's what I did at Southern Company."
      },
      {
        choiceId: 'future_creating',
        choiceText: "Deep in creative work. Making things that didn't exist before.",
        stateChanges: [
          { type: 'pattern', pattern: 'building', delta: 3 },
          { type: 'pattern', pattern: 'exploring', delta: 1 }
        ],
        npcResponse: "Pure creation. Some people need to build to feel alive. I see that in you."
      },
      {
        choiceId: 'future_nurturing',
        choiceText: "Surrounded by community. Mentoring, teaching, helping others grow.",
        stateChanges: [
          { type: 'pattern', pattern: 'helping', delta: 3 },
          { type: 'pattern', pattern: 'patience', delta: 1 }
        ],
        npcResponse: "The gardener's path. That's why I became Station Keeper. To tend growth."
      },
      {
        choiceId: 'future_exploring',
        choiceText: "Still discovering. New places, ideas, connections. Never quite settled.",
        stateChanges: [
          { type: 'pattern', pattern: 'exploring', delta: 3 },
          { type: 'pattern', pattern: 'patience', delta: -1 }
        ],
        npcResponse: "The eternal student. Some souls aren't meant to settle. The journey IS the destination."
      }
    ]
  }
}

// Export individual questions for easy import in dialogue graphs
export const parentalWorkLegacy = reciprocityQuestions.parental_work_legacy
export const successDefinition = reciprocityQuestions.success_definition
export const provingGround = reciprocityQuestions.proving_ground
export const unlimitedResources = reciprocityQuestions.unlimited_resources
export const theOnlyOne = reciprocityQuestions.the_only_one
export const runningFromOrToward = reciprocityQuestions.running_from_or_toward
export const tenYearsHence = reciprocityQuestions.ten_years_hence