/**
 * Loyalty Experience System (E2-034 to E2-039)
 *
 * Each major character has one signature Loyalty Experience - a culminating
 * mini-game within dialogue that tests skills learned throughout their arc.
 *
 * Loyalty Experiences require:
 * - High trust (Trust >= 8)
 * - Completed character arc
 * - Pattern alignment with character's core theme
 */

import { PatternType } from './patterns'
import { CharacterId } from './graph-registry'
import {
  LOYALTY_TRUST_THRESHOLD,
  LOYALTY_PATTERN_THRESHOLD
} from './constants'

// Re-export constants for convenience
export { LOYALTY_TRUST_THRESHOLD, LOYALTY_PATTERN_THRESHOLD }

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Types of loyalty experiences
 */
export type LoyaltyExperienceType =
  | 'the_demo'           // Maya - Iterative Design / Pitch
  | 'the_outage'         // Devon - Crisis Management / Triage
  | 'the_quiet_hour'     // Samuel - Active Listening / Wisdom
  | 'the_breach'         // Marcus - Ethical Triage / Security
  | 'the_confrontation'  // Rohan - Data-Driven Courage
  | 'the_first_class'    // Tess - Education Crisis / Pedagogy
  | 'the_crossroads'     // Jordan - Career Counseling / Boundaries
  | 'the_vigil'          // Grace - End-of-life Companionship
  | 'the_honest_course'  // Alex - Ethical Learning Design
  | 'the_inspection'     // Kai - Safety Training Validation
  | 'the_launch'         // Yaquin - First Course Publication
  | 'the_pattern'        // Elena - Critical Data Investigation
  | 'the_feral_lab'      // Silas - Crisis Teaching Moment
  | 'the_mural'          // Asha - Permanent Art Creation
  | 'the_memory_song'    // Lira - Composing for Memory
  | 'the_audit'          // Zara - Algorithmic Bias Exposure

/**
 * Status of a loyalty experience
 */
export type LoyaltyStatus =
  | 'locked'      // Requirements not met
  | 'available'   // Requirements met, not started
  | 'in_progress' // Currently active
  | 'completed'   // Successfully finished
  | 'failed'      // Failed (can retry)

/**
 * Unlock requirements for a loyalty experience
 */
export interface LoyaltyUnlockRequirements {
  /** Minimum trust with character */
  trustMin: number
  /** Required pattern and minimum level */
  patternRequirement?: {
    pattern: PatternType
    minLevel: number
  }
  /** Required global flags (e.g., arc completion) */
  requiredFlags?: string[]
  /** Required knowledge flags */
  requiredKnowledge?: string[]
}

/**
 * Outcome of a loyalty experience choice
 */
export interface LoyaltyOutcome {
  /** Whether this outcome leads to success */
  isSuccess: boolean
  /** Pattern changes from this outcome */
  patternChanges?: Partial<Record<PatternType, number>>
  /** Trust change with the character */
  trustChange?: number
  /** Global flags to set */
  setFlags?: string[]
  /** Feedback message to player */
  feedback: string
}

/**
 * A phase/stage within a loyalty experience
 */
export interface LoyaltyPhase {
  /** Unique identifier for this phase */
  phaseId: string
  /** Description of the situation */
  situation: string
  /** Time pressure indicator (optional) */
  timeContext?: string
  /** Available choices in this phase */
  choices: {
    choiceId: string
    text: string
    /** Which pattern this choice represents */
    pattern?: PatternType
    /** Outcome of this choice */
    outcome: LoyaltyOutcome
    /** Next phase (if not terminal) */
    nextPhaseId?: string
  }[]
}

/**
 * Full definition of a loyalty experience
 */
export interface LoyaltyExperience {
  /** Unique identifier */
  id: LoyaltyExperienceType
  /** Display title */
  title: string
  /** Character this belongs to */
  characterId: CharacterId
  /** Brief description */
  description: string
  /** Skills being tested */
  skills: string[]
  /** Unlock requirements */
  requirements: LoyaltyUnlockRequirements
  /** Introduction text when starting */
  introduction: string
  /** The phases of the experience */
  phases: LoyaltyPhase[]
  /** Success ending */
  successEnding: {
    text: string
    trustBonus: number
    unlockedFlag: string
  }
  /** Failure ending */
  failureEnding: {
    text: string
    canRetry: boolean
  }
}

/**
 * Player's progress in loyalty experiences
 */
export interface LoyaltyProgress {
  /** Status per experience */
  experiences: Partial<Record<LoyaltyExperienceType, {
    status: LoyaltyStatus
    currentPhaseId?: string
    attempts: number
    completedAt?: number
  }>>
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPERIENCE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Maya's Loyalty Experience: "The Demo"
 * Help her present robotics project to skeptical investors
 */
export const MAYA_THE_DEMO: LoyaltyExperience = {
  id: 'the_demo',
  title: 'The Demo',
  characterId: 'maya',
  description: 'Help Maya present her robotics project to skeptical investors while navigating family expectations.',
  skills: ['Technical Communication', 'Pitch Development', 'Stakeholder Management'],
  requirements: {
    trustMin: LOYALTY_TRUST_THRESHOLD,
    patternRequirement: { pattern: 'building', minLevel: LOYALTY_PATTERN_THRESHOLD },
    requiredFlags: ['maya_arc_complete']
  },
  introduction: `Maya's hands are shaking. Three investors sit across the table. Her parents watch from the back of the room.

"This is it," she whispers. "Everything I've been building toward. Will you help me through this?"`,
  phases: [
    {
      phaseId: 'opening',
      situation: 'The lead investor leans forward: "So, another robotics project. What makes yours different from the hundred pitches we see each month?"',
      choices: [
        {
          choiceId: 'technical_deep',
          text: 'Focus on technical innovation - the proprietary haptic feedback system',
          pattern: 'analytical',
          outcome: {
            isSuccess: true,
            feedback: 'The technical investor nods appreciatively, but the others look confused.',
            patternChanges: { analytical: 1 }
          },
          nextPhaseId: 'technical_followup'
        },
        {
          choiceId: 'story_lead',
          text: 'Lead with the story - the child who inspired the prosthetic design',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'The room leans in. Even the skeptical investor softens.',
            patternChanges: { helping: 1 }
          },
          nextPhaseId: 'story_followup'
        },
        {
          choiceId: 'market_focus',
          text: 'Start with market opportunity - the $4.2B prosthetics market gap',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'Numbers capture attention. The business-focused investor takes notes.',
            patternChanges: { building: 1 }
          },
          nextPhaseId: 'market_followup'
        }
      ]
    },
    {
      phaseId: 'technical_followup',
      situation: 'An investor interrupts: "Impressive tech, but can you actually manufacture this at scale? Your cost projections seem... optimistic."',
      choices: [
        {
          choiceId: 'acknowledge_challenge',
          text: 'Acknowledge the challenge honestly, present the phased approach',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Your honesty builds credibility. They appreciate the realistic timeline.',
            trustChange: 1
          },
          nextPhaseId: 'final_question'
        },
        {
          choiceId: 'defend_numbers',
          text: 'Defend the projections with detailed supplier research',
          pattern: 'analytical',
          outcome: {
            isSuccess: false,
            feedback: 'You sound defensive. The room cools slightly.'
          },
          nextPhaseId: 'final_question'
        }
      ]
    },
    {
      phaseId: 'story_followup',
      situation: 'Maya\'s mother stands up: "Very nice presentation, but when will you return to your medical studies? This robot hobby has gone on long enough."',
      timeContext: 'The investors watch the family dynamic unfold.',
      choices: [
        {
          choiceId: 'bridge_both',
          text: 'Help Maya explain how robotics IS healthcare - just a different path',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Maya\'s voice steadies. Her mother sits down, processing.',
            trustChange: 2
          },
          nextPhaseId: 'final_question'
        },
        {
          choiceId: 'deflect_family',
          text: 'Redirect focus back to the investors, ignore the family tension',
          pattern: 'analytical',
          outcome: {
            isSuccess: false,
            feedback: 'The investors notice the avoidance. Authenticity points lost.'
          },
          nextPhaseId: 'final_question'
        }
      ]
    },
    {
      phaseId: 'market_followup',
      situation: 'The skeptic challenges: "Your competitor has $50M in funding. Why would we bet on a college student?"',
      choices: [
        {
          choiceId: 'differentiation',
          text: 'Highlight what big companies can\'t do - agility, user-centered design',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'You reframe the David vs Goliath narrative. Interest piques.',
            patternChanges: { building: 1 }
          },
          nextPhaseId: 'final_question'
        },
        {
          choiceId: 'concede_underdog',
          text: 'Admit the funding gap, focus on what you\'ve achieved with less',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Humility combined with results. A compelling combination.'
          },
          nextPhaseId: 'final_question'
        }
      ]
    },
    {
      phaseId: 'final_question',
      situation: 'The lead investor stands: "Final question. In five years, where do you see this - and yourself?"',
      choices: [
        {
          choiceId: 'vision_bold',
          text: 'Paint a bold vision: accessible prosthetics for developing nations',
          pattern: 'exploring',
          outcome: {
            isSuccess: true,
            feedback: 'Your vision resonates. This isn\'t just a product - it\'s a mission.',
            trustChange: 1,
            setFlags: ['maya_demo_success']
          }
        },
        {
          choiceId: 'vision_grounded',
          text: 'Stay grounded: profitable company with social impact',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'Practical ambition. They see a founder who can execute.',
            setFlags: ['maya_demo_success']
          }
        }
      ]
    }
  ],
  successEnding: {
    text: `The lead investor extends her hand. "We'd like to schedule a follow-up. Bring your full team."

Maya's eyes are bright. Her mother is quiet, but there's something new in her expression. Pride? Understanding?

"We did it," Maya whispers. "WE did it."`,
    trustBonus: 3,
    unlockedFlag: 'maya_loyalty_complete'
  },
  failureEnding: {
    text: `The investors exchange glances. "We'll be in touch," they say - the universal rejection.

Maya's shoulders fall. But there's steel in her voice: "Next time. We'll be ready next time."`,
    canRetry: true
  }
}

/**
 * Devon's Loyalty Experience: "The Outage"
 * Triage critical system failure under time pressure
 */
export const DEVON_THE_OUTAGE: LoyaltyExperience = {
  id: 'the_outage',
  title: 'The Outage',
  characterId: 'devon',
  description: 'Help Devon triage a critical system failure affecting thousands of users.',
  skills: ['Systems Thinking', 'Crisis Management', 'Prioritization'],
  requirements: {
    trustMin: LOYALTY_TRUST_THRESHOLD,
    patternRequirement: { pattern: 'analytical', minLevel: LOYALTY_PATTERN_THRESHOLD },
    requiredFlags: ['devon_arc_complete']
  },
  introduction: `Devon's phone explodes with alerts. Three systems are failing simultaneously.

"Payment processing is down. User auth is flapping. And the monitoring dashboard just went dark."

His voice is steady but his eyes are wide. "I need someone to think with me. Right now."`,
  phases: [
    {
      phaseId: 'triage',
      situation: 'Three fires, one engineer. What do you tackle first?',
      timeContext: '5,000 users affected and climbing.',
      choices: [
        {
          choiceId: 'payments_first',
          text: 'Payments - money is flowing wrong, that\'s the biggest liability',
          pattern: 'analytical',
          outcome: {
            isSuccess: true,
            feedback: 'Correct prioritization. Financial impact is measurable and immediate.',
            patternChanges: { analytical: 1 }
          },
          nextPhaseId: 'payments_dive'
        },
        {
          choiceId: 'auth_first',
          text: 'Auth - if users can\'t log in, nothing else matters',
          pattern: 'building',
          outcome: {
            isSuccess: false,
            feedback: 'Auth is flapping but not down. Payments is the real fire.'
          },
          nextPhaseId: 'payments_dive'
        },
        {
          choiceId: 'monitoring_first',
          text: 'Monitoring - we\'re flying blind without dashboards',
          pattern: 'patience',
          outcome: {
            isSuccess: false,
            feedback: 'Monitoring helps, but users are losing money NOW.'
          },
          nextPhaseId: 'payments_dive'
        }
      ]
    },
    {
      phaseId: 'payments_dive',
      situation: 'Payment logs show duplicate transactions. Database writes are backing up. Root cause unclear.',
      timeContext: 'CFO is calling. Legal is asking about liability.',
      choices: [
        {
          choiceId: 'rollback',
          text: 'Rollback to last known good state - stop the bleeding',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Bleeding stopped. Now you can diagnose without pressure.',
            trustChange: 1
          },
          nextPhaseId: 'root_cause'
        },
        {
          choiceId: 'hotfix',
          text: 'Write a hotfix for the duplicate detection',
          pattern: 'building',
          outcome: {
            isSuccess: false,
            feedback: 'Hotfix introduces new bugs. Pressure mounts.'
          },
          nextPhaseId: 'root_cause'
        }
      ]
    },
    {
      phaseId: 'root_cause',
      situation: 'Devon finds it: a config change from last night\'s deploy. "Someone pushed without review."',
      choices: [
        {
          choiceId: 'fix_first',
          text: 'Fix first, blame later. Revert the config.',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'Systems stabilize. Devon exhales for the first time in an hour.',
            patternChanges: { building: 1 }
          },
          nextPhaseId: 'postmortem'
        },
        {
          choiceId: 'document_first',
          text: 'Document everything before making changes',
          pattern: 'analytical',
          outcome: {
            isSuccess: true,
            feedback: 'Good instinct, but users are still impacted. Speed matters.'
          },
          nextPhaseId: 'postmortem'
        }
      ]
    },
    {
      phaseId: 'postmortem',
      situation: 'Systems restored. The team gathers for postmortem. Someone asks: "Who pushed that config?"',
      choices: [
        {
          choiceId: 'blameless',
          text: 'Focus on process failure, not person failure',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'The team relaxes. This is how you build psychological safety.',
            trustChange: 2,
            setFlags: ['devon_outage_success']
          }
        },
        {
          choiceId: 'accountability',
          text: 'Name the person - accountability matters',
          pattern: 'analytical',
          outcome: {
            isSuccess: false,
            feedback: 'The room chills. Someone learns to hide mistakes instead of report them.'
          }
        }
      ]
    }
  ],
  successEnding: {
    text: `Devon closes his laptop. The incident report is filed. No data lost. No customers churned.

"That's the first outage where I didn't spiral," he says quietly. "You helped me stay in the system instead of getting lost in it."

His phone buzzes. A text from his dad: "Saw the news about the outage. You okay?"

Devon types back: "Yeah. I'm okay. Actually okay."`,
    trustBonus: 3,
    unlockedFlag: 'devon_loyalty_complete'
  },
  failureEnding: {
    text: `The postmortem turns bitter. Blame flows. Devon retreats into his shell.

"Next time," he mutters, "I'll handle it alone." But there's doubt in his voice.`,
    canRetry: true
  }
}

/**
 * Samuel's Loyalty Experience: "The Quiet Hour"
 * Active listening and presence - sometimes silence is the answer
 */
export const SAMUEL_THE_QUIET_HOUR: LoyaltyExperience = {
  id: 'the_quiet_hour',
  title: 'The Quiet Hour',
  characterId: 'samuel',
  description: 'Sit with Samuel in contemplative silence. Learn when to speak and when to simply be present.',
  skills: ['Emotional Intelligence', 'Active Listening', 'Patience'],
  requirements: {
    trustMin: LOYALTY_TRUST_THRESHOLD,
    patternRequirement: { pattern: 'patience', minLevel: LOYALTY_PATTERN_THRESHOLD },
    requiredFlags: ['samuel_arc_complete']
  },
  introduction: `Samuel leads you to a quiet platform. No trains. No travelers. Just the soft hum of the station.

"Every conductor needs to learn this," he says. "The hour where you don't speak. Where you just... are."

He settles into a worn bench. "Sit with me. When you feel like talking - don't. When silence gets uncomfortable - stay."`,
  phases: [
    {
      phaseId: 'minute_five',
      situation: 'Five minutes pass. Samuel hasn\'t moved. The silence feels thick.',
      timeContext: 'The urge to fill the void grows.',
      choices: [
        {
          choiceId: 'stay_silent',
          text: '[Remain silent. Let the moment breathe.]',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'The discomfort ebbs. Something shifts.',
            patternChanges: { patience: 1 }
          },
          nextPhaseId: 'minute_fifteen'
        },
        {
          choiceId: 'break_silence',
          text: '"This is harder than I expected."',
          pattern: 'helping',
          outcome: {
            isSuccess: false,
            feedback: 'Samuel nods but says nothing. The moment fractures slightly.'
          },
          nextPhaseId: 'minute_fifteen'
        }
      ]
    },
    {
      phaseId: 'minute_fifteen',
      situation: 'Samuel\'s eyes close. A single tear tracks down his weathered cheek.',
      timeContext: 'He doesn\'t explain. He doesn\'t wipe it away.',
      choices: [
        {
          choiceId: 'witness_silent',
          text: '[Bear witness. Let him have this.]',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'He doesn\'t need comfort. He needs a witness.',
            trustChange: 2
          },
          nextPhaseId: 'minute_thirty'
        },
        {
          choiceId: 'offer_comfort',
          text: '[Gently place a hand on his shoulder]',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'He accepts the touch. Sometimes presence requires contact.'
          },
          nextPhaseId: 'minute_thirty'
        }
      ]
    },
    {
      phaseId: 'minute_thirty',
      situation: 'The station hums. In the distance, a train whistle. Samuel finally speaks: "Dorothy loved trains."',
      choices: [
        {
          choiceId: 'let_him_continue',
          text: '[Wait. Let him find his own pace.]',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'He continues, in his own time, with his own words.',
            patternChanges: { patience: 1 }
          },
          nextPhaseId: 'minute_sixty'
        },
        {
          choiceId: 'ask_about_dorothy',
          text: '"Tell me about her."',
          pattern: 'exploring',
          outcome: {
            isSuccess: true,
            feedback: 'An invitation, not a demand. He accepts.'
          },
          nextPhaseId: 'minute_sixty'
        }
      ]
    },
    {
      phaseId: 'minute_sixty',
      situation: 'The hour ends. Samuel opens his eyes. "Most people can\'t do that. Can\'t just... be."',
      choices: [
        {
          choiceId: 'learned_something',
          text: '"I learned something. About silence. About presence."',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Samuel smiles - a rare, genuine smile.',
            trustChange: 1,
            setFlags: ['samuel_quiet_hour_success']
          }
        },
        {
          choiceId: 'thank_him',
          text: '"Thank you for trusting me with that hour."',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'He nods. Trust acknowledged.',
            setFlags: ['samuel_quiet_hour_success']
          }
        }
      ]
    }
  ],
  successEnding: {
    text: `Samuel stands, joints creaking.

"You know why I became a conductor?" He doesn't wait for an answer. "Because I learned that sometimes the most important thing you can do for someone is not leave."

He looks at you with something like pride. "You've got that in you. The staying power."`,
    trustBonus: 3,
    unlockedFlag: 'samuel_loyalty_complete'
  },
  failureEnding: {
    text: `The hour passes, but something was lost. Samuel sighs.

"Silence is a skill," he says. "Not everyone learns it." There's no judgment - just observation.`,
    canRetry: true
  }
}

/**
 * Marcus's Loyalty Experience: "The Breach"
 * Navigate a security incident with competing priorities
 */
export const MARCUS_THE_BREACH: LoyaltyExperience = {
  id: 'the_breach',
  title: 'The Breach',
  characterId: 'marcus',
  description: 'Help Marcus navigate a security incident with competing priorities: patient safety, legal liability, and public trust.',
  skills: ['Cybersecurity', 'Risk Management', 'Stakeholder Communication'],
  requirements: {
    trustMin: LOYALTY_TRUST_THRESHOLD,
    patternRequirement: { pattern: 'analytical', minLevel: LOYALTY_PATTERN_THRESHOLD },
    requiredFlags: ['marcus_arc_complete']
  },
  introduction: `Marcus's screen flashes red. Intrusion detected. Patient records database.

"It's happening again." His voice is flat. Controlled. "But this time, I have help."

The breach is active. Decisions must be made in minutes, not hours.`,
  phases: [
    {
      phaseId: 'initial_response',
      situation: 'The attacker is still in the system. Do you isolate and lose access, or observe and risk more exposure?',
      timeContext: '1,200 patient records potentially exposed.',
      choices: [
        {
          choiceId: 'isolate_immediate',
          text: 'Isolate immediately - stop the bleeding',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'System isolated. Attacker locked out. But we lost visibility.',
            patternChanges: { building: 1 }
          },
          nextPhaseId: 'notification_decision'
        },
        {
          choiceId: 'observe_briefly',
          text: 'Observe for 60 seconds - understand the attack vector',
          pattern: 'analytical',
          outcome: {
            isSuccess: true,
            feedback: 'You capture their methodology. Risky, but valuable intel.',
            trustChange: 1
          },
          nextPhaseId: 'notification_decision'
        }
      ]
    },
    {
      phaseId: 'notification_decision',
      situation: 'Legal says: "Don\'t notify patients until we understand scope." Ethics says: "They deserve to know." What do you advise?',
      choices: [
        {
          choiceId: 'immediate_notification',
          text: 'Patients first. Notify now with what we know.',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Transparency over liability. Marcus nods approvingly.',
            trustChange: 2
          },
          nextPhaseId: 'media_response'
        },
        {
          choiceId: 'staged_notification',
          text: 'Staged disclosure - facts first, then affected individuals',
          pattern: 'analytical',
          outcome: {
            isSuccess: true,
            feedback: 'Balanced approach. Legal and ethics both satisfied.',
            patternChanges: { analytical: 1 }
          },
          nextPhaseId: 'media_response'
        }
      ]
    },
    {
      phaseId: 'media_response',
      situation: 'A reporter calls. "We\'re running a story about a hospital breach. Comment?"',
      timeContext: 'The story goes live in 30 minutes either way.',
      choices: [
        {
          choiceId: 'proactive_statement',
          text: 'Get ahead of it - issue a proactive statement',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'Control the narrative. The story runs, but fairly.',
            setFlags: ['marcus_breach_success']
          }
        },
        {
          choiceId: 'no_comment',
          text: 'No comment - let legal handle media',
          pattern: 'patience',
          outcome: {
            isSuccess: false,
            feedback: 'The story runs hostile. "Hospital refuses to comment."'
          }
        }
      ]
    }
  ],
  successEnding: {
    text: `The breach is contained. Patients notified. Media handled.

Marcus looks at the incident report. "Zero deaths. Full disclosure. Community trust maintained."

He turns to you. "Last time, bureaucracy blocked me. This time, I had someone who understood that speed and ethics aren't opposites."`,
    trustBonus: 3,
    unlockedFlag: 'marcus_loyalty_complete'
  },
  failureEnding: {
    text: `The breach spirals. Legal and ethics clash. The story runs ugly.

Marcus stares at the screen. "Same nightmare. Different day." But his voice holds determination, not defeat.`,
    canRetry: true
  }
}

/**
 * Rohan's Loyalty Experience: "The Confrontation"
 * Challenge a popular narrative with uncomfortable data
 */
export const ROHAN_THE_CONFRONTATION: LoyaltyExperience = {
  id: 'the_confrontation',
  title: 'The Confrontation',
  characterId: 'rohan',
  description: 'Help Rohan present uncomfortable data that challenges a popular company narrative.',
  skills: ['Data Analysis', 'Critical Thinking', 'Courage'],
  requirements: {
    trustMin: LOYALTY_TRUST_THRESHOLD,
    patternRequirement: { pattern: 'analytical', minLevel: LOYALTY_PATTERN_THRESHOLD },
    requiredFlags: ['rohan_arc_complete']
  },
  introduction: `Rohan's hands are steady on the keyboard, but his voice shakes.

"The data is clear. The AI hiring tool we deployed? It's rejecting qualified candidates from certain zip codes. Same pattern as last time."

Management meeting in ten minutes. His career on one side. The truth on the other.

"Will you help me present this? I can't do it alone again."`,
  phases: [
    {
      phaseId: 'preparation',
      situation: 'The data is solid, but presentation matters. How do you frame it?',
      choices: [
        {
          choiceId: 'lead_with_impact',
          text: 'Lead with human impact - the candidates who were wrongly rejected',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Stories before statistics. The room will feel it.',
            patternChanges: { helping: 1 }
          },
          nextPhaseId: 'the_room'
        },
        {
          choiceId: 'lead_with_data',
          text: 'Lead with irrefutable data - let numbers speak',
          pattern: 'analytical',
          outcome: {
            isSuccess: true,
            feedback: 'Cold, hard facts. Harder to dismiss.',
            trustChange: 1
          },
          nextPhaseId: 'the_room'
        }
      ]
    },
    {
      phaseId: 'the_room',
      situation: 'The VP interrupts: "This sounds like a lot of speculation. Our vendor assured us the algorithm is unbiased."',
      choices: [
        {
          choiceId: 'show_methodology',
          text: 'Walk through the methodology - show exactly how bias was measured',
          pattern: 'analytical',
          outcome: {
            isSuccess: true,
            feedback: 'Transparency builds credibility. The VP sits back.',
            patternChanges: { analytical: 1 }
          },
          nextPhaseId: 'the_pushback'
        },
        {
          choiceId: 'challenge_vendor',
          text: 'Challenge: "Did the vendor share their training data? Their test results?"',
          pattern: 'exploring',
          outcome: {
            isSuccess: true,
            feedback: 'Questions they can\'t answer. Doubt seeds.',
            trustChange: 1
          },
          nextPhaseId: 'the_pushback'
        }
      ]
    },
    {
      phaseId: 'the_pushback',
      situation: 'The CEO leans forward: "If this gets out, it destroys our DEI reputation. Are you sure you want to push this?"',
      timeContext: 'Rohan\'s career hangs in the balance.',
      choices: [
        {
          choiceId: 'stand_firm',
          text: '"The question isn\'t whether we want to. It\'s whether we can live with the alternative."',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Silence. Then the CEO nods slowly.',
            trustChange: 2,
            setFlags: ['rohan_confrontation_success']
          }
        },
        {
          choiceId: 'offer_solution',
          text: '"Here\'s a path forward: fix it quietly, then announce what we fixed."',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'A pragmatic bridge between truth and optics.',
            setFlags: ['rohan_confrontation_success']
          }
        }
      ]
    }
  ],
  successEnding: {
    text: `The meeting ends. The tool gets paused for audit.

Rohan exhales like he's been holding his breath for years. "Last time, I lost everyone. This time..."

He looks at you. "This time I had someone who didn't ask if the data was convenient. Just if it was true."`,
    trustBonus: 3,
    unlockedFlag: 'rohan_loyalty_complete'
  },
  failureEnding: {
    text: `The room dismisses the findings. "Further review needed." Corporate code for burial.

Rohan gathers his notes quietly. "The truth doesn't disappear because it's inconvenient," he says. "It just waits."`,
    canRetry: true
  }
}

/**
 * Tess's Loyalty Experience: "The First Class"
 * Launch the first cohort and handle a crisis that tests everything
 */
export const TESS_THE_FIRST_CLASS: LoyaltyExperience = {
  id: 'the_first_class',
  title: 'The First Class',
  characterId: 'tess',
  description: 'Help Tess launch her first education cohort and navigate a crisis that threatens everything she\'s built.',
  skills: ['Curriculum Design', 'Crisis Management', 'Student Advocacy'],
  requirements: {
    trustMin: LOYALTY_TRUST_THRESHOLD,
    patternRequirement: { pattern: 'helping', minLevel: LOYALTY_PATTERN_THRESHOLD },
    requiredFlags: ['tess_arc_complete']
  },
  introduction: `Tess stands in front of twelve chairs. Tomorrow, they'll be filled with her first students.

"I've dreamed about this for years," she says. "But tonight, I'm terrified."

Her phone buzzes. An email. Her face goes white.

"The building inspector. Our permit is under review. If we don't pass tomorrow's inspection, we lose the space."

She looks at you. "I can't do this alone. Will you help me save this school?"`,
  phases: [
    {
      phaseId: 'triage',
      situation: 'The inspection is in 12 hours. Three issues flagged: fire exits, accessibility ramp, electrical capacity. You can\'t fix everything.',
      timeContext: 'Students arrive at 9 AM. Inspector arrives at 8 AM.',
      choices: [
        {
          choiceId: 'safety_first',
          text: 'Fire exits are non-negotiable. Start there.',
          pattern: 'analytical',
          outcome: {
            isSuccess: true,
            feedback: 'Correct priority. Safety violations would shut you down immediately.',
            patternChanges: { analytical: 1 }
          },
          nextPhaseId: 'the_ramp'
        },
        {
          choiceId: 'accessibility_first',
          text: 'The ramp affects real students who enrolled. They\'re counting on access.',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Heart in the right place, but a fire code violation closes everything.',
            trustChange: 1
          },
          nextPhaseId: 'the_ramp'
        }
      ]
    },
    {
      phaseId: 'the_ramp',
      situation: 'Fire exits cleared. But the accessibility ramp won\'t be ready. Marcus, a wheelchair user, enrolled specifically because you promised accessibility.',
      choices: [
        {
          choiceId: 'temporary_solution',
          text: 'Temporary portable ramp tonight, permanent fix within the week. Be honest with Marcus.',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'Practical and transparent. Marcus appreciates the honesty.',
            patternChanges: { building: 1 }
          },
          nextPhaseId: 'the_inspector'
        },
        {
          choiceId: 'delay_marcus',
          text: 'Ask Marcus to start next week when the ramp is ready.',
          pattern: 'patience',
          outcome: {
            isSuccess: false,
            feedback: 'He drove two hours. Asking him to leave sends the wrong message about your values.'
          },
          nextPhaseId: 'the_inspector'
        }
      ]
    },
    {
      phaseId: 'the_inspector',
      situation: 'The inspector arrives. Stern. By the book. She finds a minor electrical issue you missed.',
      timeContext: 'Students are arriving in 30 minutes.',
      choices: [
        {
          choiceId: 'acknowledge_fix',
          text: 'Acknowledge it immediately. Ask what it takes to get conditional approval.',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Your honesty surprises her. She offers a 48-hour conditional pass.',
            trustChange: 2
          },
          nextPhaseId: 'first_student'
        },
        {
          choiceId: 'argue_minor',
          text: 'Point out it\'s a minor issue that poses no real risk.',
          pattern: 'analytical',
          outcome: {
            isSuccess: false,
            feedback: 'She hardens. "Minor issues become major ones." The mood chills.'
          },
          nextPhaseId: 'first_student'
        }
      ]
    },
    {
      phaseId: 'first_student',
      situation: 'Inspection passed. Students file in. But one student, Keisha, stands at the door, frozen. "I don\'t belong here. Everyone else looks like they know what they\'re doing."',
      choices: [
        {
          choiceId: 'share_own_story',
          text: 'Share your own first day. The terror. The doubt. The staying anyway.',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Keisha\'s shoulders drop. She takes a seat. Front row.',
            trustChange: 1,
            setFlags: ['tess_first_class_success']
          }
        },
        {
          choiceId: 'reassure_belonging',
          text: '"You applied. You were accepted. You belong. Now sit down and prove it to yourself."',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'Direct. She needs to hear it. She sits.',
            setFlags: ['tess_first_class_success']
          }
        }
      ]
    }
  ],
  successEnding: {
    text: `Twelve students. First day complete. No one left.

Tess stands at the door as the last student files out. Her eyes are wet.

"Elena said I couldn't do this alone. She was right. I couldn't." She looks at you. "But I didn't have to."

She picks up a dry-erase marker. Writes on the board: "Day 1. Complete."

"364 to go."`,
    trustBonus: 3,
    unlockedFlag: 'tess_loyalty_complete'
  },
  failureEnding: {
    text: `The day ends ragged. Some students leave confused. The inspector's conditional pass weighs heavy.

Tess stares at the empty chairs. "Maybe Elena was right. Maybe I couldn't do this."

But she doesn't leave. She starts cleaning. "Tomorrow. We try again tomorrow."`,
    canRetry: true
  }
}

/**
 * Jordan's Loyalty Experience: "The Crossroads"
 * Help a client who mirrors Jordan's own past - without losing professional boundaries
 */
export const JORDAN_THE_CROSSROADS: LoyaltyExperience = {
  id: 'the_crossroads',
  title: 'The Crossroads',
  characterId: 'jordan',
  description: 'Help Jordan counsel a client whose situation mirrors her own painful past, testing her boundaries and growth.',
  skills: ['Career Counseling', 'Active Listening', 'Boundary Setting'],
  requirements: {
    trustMin: LOYALTY_TRUST_THRESHOLD,
    patternRequirement: { pattern: 'helping', minLevel: LOYALTY_PATTERN_THRESHOLD },
    requiredFlags: ['jordan_arc_complete']
  },
  introduction: `Jordan's next client walks in. Young. Eager. Carrying a folder of rejection letters.

"I've applied to 200 jobs. Nothing. Everyone says I'm 'not the right fit.' What does that even mean?"

Jordan freezes. You see it - the recognition. This client is who Jordan was, five years ago.

"I need you in there with me," she whispers. "I'm too close to this one."`,
  phases: [
    {
      phaseId: 'the_mirror',
      situation: 'The client, Destiny, shares her story. Prestigious degree. Perfect GPA. Zero callbacks. "Am I doing something wrong?"',
      choices: [
        {
          choiceId: 'ask_questions',
          text: 'Ask what "right fit" feedback has she actually received?',
          pattern: 'analytical',
          outcome: {
            isSuccess: true,
            feedback: 'Good instinct. Gather data before diagnosing.',
            patternChanges: { analytical: 1 }
          },
          nextPhaseId: 'the_pattern'
        },
        {
          choiceId: 'reassure_first',
          text: 'Reassure her - the job market is brutal, it\'s not her fault.',
          pattern: 'helping',
          outcome: {
            isSuccess: false,
            feedback: 'Comfort without clarity. She needs actionable insight.'
          },
          nextPhaseId: 'the_pattern'
        }
      ]
    },
    {
      phaseId: 'the_pattern',
      situation: 'Destiny pulls up her resume. You see it immediately: corporate jargon, no personality, skills list without stories. Jordan tenses - she recognizes her old resume in Destiny\'s.',
      choices: [
        {
          choiceId: 'honest_feedback',
          text: 'Be direct: "Your resume hides you. Let\'s find where you are in here."',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Destiny looks startled, then relieved. Someone finally told her the truth.',
            trustChange: 2
          },
          nextPhaseId: 'the_boundary'
        },
        {
          choiceId: 'gentle_reframe',
          text: 'Gently suggest the resume could use "more personal touch."',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Softer landing, but she needs more specificity.',
            patternChanges: { patience: 1 }
          },
          nextPhaseId: 'the_boundary'
        }
      ]
    },
    {
      phaseId: 'the_boundary',
      situation: 'Destiny tears up. "I just want someone to tell me I\'m going to be okay." She looks at Jordan like a lifeline. Jordan reaches for your hand under the table.',
      timeContext: 'Professional boundaries vs. human connection.',
      choices: [
        {
          choiceId: 'hold_boundary',
          text: '"I can\'t promise outcomes. But I can promise I\'ll help you build something real."',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Honest boundaries. Destiny nods - she needed reality, not fantasy.',
            trustChange: 1
          },
          nextPhaseId: 'the_breakthrough'
        },
        {
          choiceId: 'share_story',
          text: 'Let Jordan share her own story - "I was where you are. It gets better."',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Risky, but authentic. Destiny sees she\'s not alone.',
            patternChanges: { helping: 1 }
          },
          nextPhaseId: 'the_breakthrough'
        }
      ]
    },
    {
      phaseId: 'the_breakthrough',
      situation: 'An hour later. Destiny has a new resume draft. Real stories. Real voice. She looks up: "Why did you become a career counselor?"',
      choices: [
        {
          choiceId: 'because_of_you',
          text: '"Because someone once sat with me when I had 200 rejection letters. I\'m paying it forward."',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Destiny smiles for the first time. "I\'d like to do that someday too."',
            trustChange: 1,
            setFlags: ['jordan_crossroads_success']
          }
        },
        {
          choiceId: 'because_of_work',
          text: '"Because this work matters. Helping people find where they belong."',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'Professional, purposeful. Destiny leaves with direction.',
            setFlags: ['jordan_crossroads_success']
          }
        }
      ]
    }
  ],
  successEnding: {
    text: `Destiny leaves with her new resume and three targeted applications.

Jordan sits back, exhausted but whole. "I almost lost myself in there. Saw too much of the old me."

She looks at you. "But you kept me grounded. Helped me be a counselor, not a rescuer."

Her phone buzzes. A text from Destiny: "Thank you. First callback in months. Wish me luck."

Jordan smiles. "This is why."`,
    trustBonus: 3,
    unlockedFlag: 'jordan_loyalty_complete'
  },
  failureEnding: {
    text: `Destiny leaves, but something feels unresolved. Too much comfort, not enough clarity.

Jordan stares at the closed door. "I got too close. Made it about my story, not hers."

But she pulls out her notes. "Next client. Fresh start. I'll do better."`,
    canRetry: true
  }
}

/**
 * Grace's Loyalty Experience: "The Vigil"
 * Stay present with a patient through their final hours
 */
export const GRACE_THE_VIGIL: LoyaltyExperience = {
  id: 'the_vigil',
  title: 'The Vigil',
  characterId: 'grace',
  description: 'Stay with Grace through a patient\'s final hours. Learn what it means to be truly present.',
  skills: ['Emotional Presence', 'End-of-Life Care', 'Compassionate Communication'],
  requirements: {
    trustMin: LOYALTY_TRUST_THRESHOLD,
    patternRequirement: { pattern: 'helping', minLevel: LOYALTY_PATTERN_THRESHOLD },
    requiredFlags: ['grace_arc_complete']
  },
  introduction: `Grace's phone buzzes at 2 AM. Mrs. Patterson. Her favorite client of seven years.

"The family called. They're not going to make it in time." Her voice breaks. "She shouldn't be alone."

She looks at you. "I've sat vigil before. But never with someone who... understood. Will you come with me?"`,
  phases: [
    {
      phaseId: 'arrival',
      situation: 'Mrs. Patterson\'s room is dim. Soft machines hum. Her breathing is shallow. The family photo on the nightstand shows decades of life.',
      timeContext: 'Hours, maybe less.',
      choices: [
        {
          choiceId: 'take_position',
          text: '[Sit beside Grace. Match her stillness.]',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Your presence anchors hers. She exhales.',
            patternChanges: { patience: 1 }
          },
          nextPhaseId: 'the_wait'
        },
        {
          choiceId: 'ask_about_patient',
          text: '"Tell me about her."',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Grace\'s eyes soften. Stories help.',
            trustChange: 1
          },
          nextPhaseId: 'the_wait'
        }
      ]
    },
    {
      phaseId: 'the_wait',
      situation: 'An hour passes. Mrs. Patterson stirs. Her eyes flutter open, confused. "Dorothy? Is that you?"',
      timeContext: 'She\'s seeing someone who isn\'t there.',
      choices: [
        {
          choiceId: 'gentle_presence',
          text: '[Let Grace handle it. Trust her expertise.]',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Grace takes her hand. "I\'m here. You\'re safe." Mrs. Patterson settles.',
            trustChange: 1
          },
          nextPhaseId: 'the_confession'
        },
        {
          choiceId: 'correct_gently',
          text: '"Mrs. Patterson, it\'s Grace. You\'re in your room."',
          pattern: 'helping',
          outcome: {
            isSuccess: false,
            feedback: 'Confusion deepens. Sometimes truth isn\'t what they need.'
          },
          nextPhaseId: 'the_confession'
        }
      ]
    },
    {
      phaseId: 'the_confession',
      situation: 'Grace whispers: "I almost quit last year. After Mr. Chen. After Mrs. Rodriguez. Everyone I love leaves." Her tears fall silently.',
      choices: [
        {
          choiceId: 'witness_grief',
          text: '[Stay silent. Let her grieve.]',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'She doesn\'t need words. She needs witness.',
            patternChanges: { patience: 1 }
          },
          nextPhaseId: 'the_end'
        },
        {
          choiceId: 'acknowledge_burden',
          text: '"The weight you carry... it\'s not invisible. I see it."',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Recognition. The rarest gift in care work.',
            trustChange: 2,
            patternChanges: { helping: 1 }
          },
          nextPhaseId: 'the_end'
        }
      ]
    },
    {
      phaseId: 'the_end',
      situation: 'Mrs. Patterson\'s breathing changes. Slows. Grace holds her hand. "You can go now, Margaret. Everyone you loved is waiting."',
      timeContext: 'The final moments.',
      choices: [
        {
          choiceId: 'hold_space',
          text: '[Place your hand on Grace\'s shoulder. Hold the space together.]',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Two witnesses. One departure. A sacred exchange.',
            trustChange: 1,
            setFlags: ['grace_vigil_success']
          }
        },
        {
          choiceId: 'honor_silence',
          text: '[Bow your head. Honor what\'s happening with silence.]',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Some moments are too profound for touch.',
            setFlags: ['grace_vigil_success']
          }
        }
      ]
    }
  ],
  successEnding: {
    text: `Sunrise filters through the curtains. Mrs. Patterson is gone, peacefully.

Grace sits back, exhausted but whole. "Seven years of invisible work. And tonight, someone saw it."

She looks at you. "That's why I stay. Not for the ones who leave. For the ones who witness."

Her phone buzzes. The family is an hour away. She'll be here when they arrive.`,
    trustBonus: 3,
    unlockedFlag: 'grace_loyalty_complete'
  },
  failureEnding: {
    text: `The night passes, but something was lost in translation. Grace is alone again.

"It's okay," she says, but her voice is hollow. "Not everyone can do this work."`,
    canRetry: true
  }
}

/**
 * Alex's Loyalty Experience: "The Honest Course"
 * Launch an ethical learning platform without the predatory tactics
 */
export const ALEX_THE_HONEST_COURSE: LoyaltyExperience = {
  id: 'the_honest_course',
  title: 'The Honest Course',
  characterId: 'alex',
  description: 'Help Alex launch an ethical alternative to the predatory bootcamp industry.',
  skills: ['Curriculum Design', 'Ethical Marketing', 'Student Advocacy'],
  requirements: {
    trustMin: LOYALTY_TRUST_THRESHOLD,
    patternRequirement: { pattern: 'exploring', minLevel: LOYALTY_PATTERN_THRESHOLD },
    requiredFlags: ['alex_arc_complete']
  },
  introduction: `Alex has been building something in secret. A learning platform. No fake job guarantees. No predatory financing. Just honest education.

"Tomorrow is launch day. But the marketing guy wants me to add 'GUARANTEED JOB PLACEMENT.'" He looks sick. "That's how it starts. One compromise."

He shows you the screen. "Help me write copy that's honest AND compelling. I can't go back to being complicit."`,
  phases: [
    {
      phaseId: 'the_copy',
      situation: 'The landing page needs a headline. The marketing guy\'s suggestion: "Become a Six-Figure Developer in 12 Weeks - GUARANTEED!"',
      choices: [
        {
          choiceId: 'honest_value',
          text: '"Learn to code. For real. No false promises." - Lead with integrity.',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Honesty as differentiator. Alex\'s shoulders relax.',
            patternChanges: { helping: 1 }
          },
          nextPhaseId: 'the_pricing'
        },
        {
          choiceId: 'outcome_focus',
          text: '"85% of graduates report career progress within 6 months." - Real data, no hype.',
          pattern: 'analytical',
          outcome: {
            isSuccess: true,
            feedback: 'Measurable, honest, compelling. The best of both worlds.',
            trustChange: 1
          },
          nextPhaseId: 'the_pricing'
        }
      ]
    },
    {
      phaseId: 'the_pricing',
      situation: 'Pricing decision. Competitors charge $15,000 with "income share agreements" that trap students. Alex wants $2,000 upfront.',
      choices: [
        {
          choiceId: 'defend_price',
          text: '"$2,000 is honest. It covers costs. Students aren\'t in debt for years."',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'Sustainable pricing that doesn\'t exploit. Revolutionary.',
            patternChanges: { building: 1 }
          },
          nextPhaseId: 'the_doubt'
        },
        {
          choiceId: 'scholarship_tier',
          text: '"Add a scholarship tier. Let paying students fund those who can\'t."',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Community-funded learning. Alex\'s eyes light up.',
            trustChange: 1
          },
          nextPhaseId: 'the_doubt'
        }
      ]
    },
    {
      phaseId: 'the_doubt',
      situation: 'Night before launch. Alex stares at the screen. "What if no one signs up? What if honesty doesn\'t sell?"',
      timeContext: 'The fear is real.',
      choices: [
        {
          choiceId: 'acknowledge_fear',
          text: '"The fear means you care. But remember Maria - this is for students like her."',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'The memory of the student who cashed out her 401k. The reason this matters.',
            trustChange: 2
          },
          nextPhaseId: 'launch'
        },
        {
          choiceId: 'focus_on_mission',
          text: '"Even if ten students learn something real, that\'s ten fewer people burned by the industry."',
          pattern: 'exploring',
          outcome: {
            isSuccess: true,
            feedback: 'Small impact is still impact. The mission crystallizes.',
            patternChanges: { exploring: 1 }
          },
          nextPhaseId: 'launch'
        }
      ]
    },
    {
      phaseId: 'launch',
      situation: 'Launch button glows on the screen. Alex\'s hand hovers. "Once it\'s out there, I can\'t take it back."',
      choices: [
        {
          choiceId: 'together',
          text: '"Press it together. I believe in what you\'ve built."',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Click. It\'s live. The honest alternative exists.',
            trustChange: 1,
            setFlags: ['alex_course_success']
          }
        },
        {
          choiceId: 'his_moment',
          text: '"This is your moment. You\'ve earned it."',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'He presses it alone. But not lonely. You\'re watching.',
            setFlags: ['alex_course_success']
          }
        }
      ]
    }
  ],
  successEnding: {
    text: `Three days later. Twelve sign-ups. Not thousands. Twelve.

Alex stares at the list. "Twelve people who chose honesty over hype."

His phone buzzes. A message from one student: "Thank you for not lying to me. That's why I signed up."

"Worth it," Alex whispers. "Every single one."`,
    trustBonus: 3,
    unlockedFlag: 'alex_loyalty_complete'
  },
  failureEnding: {
    text: `The launch goes live, but something's off. The compromises crept in.

Alex stares at the marketing copy. "I did it again," he says. "Started honest. Ended... complicit."

But he doesn't delete it. "Tomorrow. Fix it tomorrow."`,
    canRetry: true
  }
}

/**
 * Kai's Loyalty Experience: "The Inspection"
 * Prove that thoughtful safety training actually saves lives
 */
export const KAI_THE_INSPECTION: LoyaltyExperience = {
  id: 'the_inspection',
  title: 'The Inspection',
  characterId: 'kai',
  description: 'Help Kai prove that real safety training saves lives when an OSHA inspector questions their methods.',
  skills: ['Training Design', 'Safety Systems', 'Evidence-Based Practice'],
  requirements: {
    trustMin: LOYALTY_TRUST_THRESHOLD,
    patternRequirement: { pattern: 'building', minLevel: LOYALTY_PATTERN_THRESHOLD },
    requiredFlags: ['kai_arc_complete']
  },
  introduction: `OSHA inspector at the door. Unannounced. Kai's pilot program is under review.

"Your training module takes three hours. Industry standard is forty-five minutes." The inspector's pen taps her clipboard. "Justify the difference."

Kai's hands shake. The last time she was questioned, Marcus ended up in the hospital.

"Help me show her. Help me prove that faster isn't better when lives are at stake."`,
  phases: [
    {
      phaseId: 'the_challenge',
      situation: 'The inspector reviews the training module. "Three hours for lockout/tagout? The checklist approach takes thirty minutes."',
      choices: [
        {
          choiceId: 'show_outcomes',
          text: 'Pull up incident data. "Zero injuries in six months. Previous program: four."',
          pattern: 'analytical',
          outcome: {
            isSuccess: true,
            feedback: 'Data speaks. The inspector\'s eyebrow rises.',
            patternChanges: { analytical: 1 }
          },
          nextPhaseId: 'the_simulation'
        },
        {
          choiceId: 'explain_philosophy',
          text: '"Compliance theater versus actual competence. We teach understanding, not just steps."',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'Philosophy before metrics. Risky, but authentic.',
            trustChange: 1
          },
          nextPhaseId: 'the_simulation'
        }
      ]
    },
    {
      phaseId: 'the_simulation',
      situation: 'The inspector wants a demo. "Show me what your workers actually do."',
      timeContext: 'A floor worker named James is nearby.',
      choices: [
        {
          choiceId: 'live_demo',
          text: '"James, walk the inspector through your last equipment lockout."',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'James explains every step - AND why it matters. The inspector nods.',
            trustChange: 1
          },
          nextPhaseId: 'the_question'
        },
        {
          choiceId: 'scenario_test',
          text: '"What if the pressure gauge reads wrong? James, what do you do?"',
          pattern: 'analytical',
          outcome: {
            isSuccess: true,
            feedback: 'James knows. Edge cases covered. Not just the happy path.',
            patternChanges: { building: 1 }
          },
          nextPhaseId: 'the_question'
        }
      ]
    },
    {
      phaseId: 'the_question',
      situation: 'The inspector sets down her clipboard. "Why do you do this? Your method takes more time, more resources. Companies hate that."',
      choices: [
        {
          choiceId: 'marcus_story',
          text: '"Because Marcus is still in physical therapy. Because a forty-five minute checklist didn\'t prepare him."',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Personal cost. The inspector\'s demeanor shifts.',
            trustChange: 2
          },
          nextPhaseId: 'verdict'
        },
        {
          choiceId: 'father_story',
          text: '"My father lost three fingers. The training manual said he was \'compliant.\'"',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Generational knowledge. The inspector understands.',
            patternChanges: { patience: 1 }
          },
          nextPhaseId: 'verdict'
        }
      ]
    },
    {
      phaseId: 'verdict',
      situation: 'The inspector closes her notebook. The pause stretches.',
      choices: [
        {
          choiceId: 'wait_for_verdict',
          text: '[Wait. Let her process what she\'s seen.]',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: '"I\'m recommending your program as a case study," she says finally.',
            setFlags: ['kai_inspection_success']
          }
        },
        {
          choiceId: 'ask_directly',
          text: '"What\'s the verdict?"',
          pattern: 'analytical',
          outcome: {
            isSuccess: true,
            feedback: 'She smiles. "Pass. With distinction."',
            setFlags: ['kai_inspection_success']
          }
        }
      ]
    }
  ],
  successEnding: {
    text: `The inspector leaves. Kai slumps against the wall.

"Six months of work. Years of doubt." She looks at you. "And someone finally said it matters."

James walks by. "Hey Kai, thanks for teaching me why the steps matter. Not just what to do."

Kai smiles. "That's the whole point."`,
    trustBonus: 3,
    unlockedFlag: 'kai_loyalty_complete'
  },
  failureEnding: {
    text: `The inspection ends ambiguously. "Further review required."

Kai stares at the paperwork. "Same as always. Good enough isn't good enough for them."

But she's already revising the module. "Next time. I'll make it undeniable."`,
    canRetry: true
  }
}

/**
 * Yaquin's Loyalty Experience: "The Launch"
 * Publish the first course and navigate the creator economy
 */
export const YAQUIN_THE_LAUNCH: LoyaltyExperience = {
  id: 'the_launch',
  title: 'The Launch',
  characterId: 'yaquin',
  description: 'Help Yaquin launch her first online course and prove that hands-on expertise matters.',
  skills: ['Content Creation', 'Self-Marketing', 'Tacit Knowledge Transfer'],
  requirements: {
    trustMin: LOYALTY_TRUST_THRESHOLD,
    patternRequirement: { pattern: 'building', minLevel: LOYALTY_PATTERN_THRESHOLD },
    requiredFlags: ['yaquin_arc_complete']
  },
  introduction: `Yaquin's finger hovers over the "Publish" button. Eight months of work. Forty-seven video lessons. Everything she knows about dental assisting, distilled.

"My father still thinks I should have gone to dental school." Her voice is steady, but her hand isn't. "He doesn't understand that this... this is dental school. My version."

She looks at you. "Will you watch me do this? I don't want to be alone when it either works or doesn't."`,
  phases: [
    {
      phaseId: 'the_button',
      situation: 'The publish button glows. Course price: $47. Eight years of experience for less than dinner.',
      choices: [
        {
          choiceId: 'affirm_value',
          text: '"Your knowledge saved patients from pain. That\'s worth more than any credential."',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Her shoulders drop. Validation.',
            patternChanges: { helping: 1 }
          },
          nextPhaseId: 'first_student'
        },
        {
          choiceId: 'focus_forward',
          text: '"Press it. The only way to know if it works is to try."',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'She clicks. It\'s live. The world can see it now.',
            trustChange: 1
          },
          nextPhaseId: 'first_student'
        }
      ]
    },
    {
      phaseId: 'first_student',
      situation: 'Twenty-four hours. Three sales. Then a message: "I\'m a new dental assistant. Your video on anxious patients saved my first day. Thank you."',
      choices: [
        {
          choiceId: 'celebrate_small',
          text: '"Three students. Three people whose days will be better because of you."',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Small numbers, big impact. She starts to see it.',
            trustChange: 1
          },
          nextPhaseId: 'the_doubt'
        },
        {
          choiceId: 'share_message',
          text: '"Read that message again. That\'s why this matters."',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'The human connection. Not metrics. Impact.',
            patternChanges: { helping: 1 }
          },
          nextPhaseId: 'the_doubt'
        }
      ]
    },
    {
      phaseId: 'the_doubt',
      situation: 'Her father calls. "Mija, how much did you make?" She tells him. Silence. "That\'s... not very much."',
      timeContext: 'The comparison to dental school salary hangs unspoken.',
      choices: [
        {
          choiceId: 'reframe_success',
          text: '"Three people trusted her enough to pay. Week one. This is the beginning, not the end."',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'You speak to her father through her. The reframe lands.',
            trustChange: 2
          },
          nextPhaseId: 'the_review'
        },
        {
          choiceId: 'validate_feelings',
          text: '"It hurts when family doesn\'t understand. But you know what you built."',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Acknowledgment before advice. She needed that.',
            patternChanges: { patience: 1 }
          },
          nextPhaseId: 'the_review'
        }
      ]
    },
    {
      phaseId: 'the_review',
      situation: 'Week two. A negative review: "Too basic. Anyone could teach this." Yaquin stares at the screen.',
      choices: [
        {
          choiceId: 'perspective',
          text: '"One critic. Twelve positive messages. Which voice will you amplify?"',
          pattern: 'analytical',
          outcome: {
            isSuccess: true,
            feedback: 'Data over drama. She nods slowly.',
            setFlags: ['yaquin_launch_success']
          }
        },
        {
          choiceId: 'growth_mindset',
          text: '"Use it. What could the next version teach that this one didn\'t?"',
          pattern: 'exploring',
          outcome: {
            isSuccess: true,
            feedback: 'Criticism as fuel. She opens her notes app.',
            setFlags: ['yaquin_launch_success']
          }
        }
      ]
    }
  ],
  successEnding: {
    text: `Month one ends. Forty-seven students. Enough to cover her phone bill and then some.

"It's not dental school money," Yaquin says. "But it's mine. Built from what I actually know."

Her phone buzzes. Another message: "Your lesson on instrument sterilization is better than anything in my textbook."

"That's the credential," she says, smiling. "Right there."`,
    trustBonus: 3,
    unlockedFlag: 'yaquin_loyalty_complete'
  },
  failureEnding: {
    text: `The launch stalls. Self-doubt creeps in. "Maybe my father was right."

But she doesn't delete the course. "I'll try again. Different approach."`,
    canRetry: true
  }
}

/**
 * Elena's Loyalty Experience: "The Pattern"
 * Investigate a critical data anomaly that others dismissed
 */
export const ELENA_THE_PATTERN: LoyaltyExperience = {
  id: 'the_pattern',
  title: 'The Pattern',
  characterId: 'elena',
  description: 'Help Elena investigate a data anomaly that everyone else is ignoring. The truth matters.',
  skills: ['Data Analysis', 'Critical Thinking', 'Persistence'],
  requirements: {
    trustMin: LOYALTY_TRUST_THRESHOLD,
    patternRequirement: { pattern: 'analytical', minLevel: LOYALTY_PATTERN_THRESHOLD },
    requiredFlags: ['elena_arc_complete']
  },
  introduction: `Elena hasn't slept. Spreadsheets cover every surface. Her eyes are bloodshot.

"I found something. Something everyone missed." Her voice is hoarse. "Supply chain data. There's a pattern in the anomalies. It's not random."

She pulls up a graph. Points that look like noise. But when you squint...

"Last time I dismissed anomalous data, four people died." Her hands shake. "Help me prove this isn't nothing."`,
  phases: [
    {
      phaseId: 'the_data',
      situation: 'The dataset is massive. Thousands of entries. Elena\'s eyes dart across screens. "The pattern is here. I can feel it."',
      choices: [
        {
          choiceId: 'systematic_approach',
          text: '"Walk me through your methodology. Start from the first anomaly you noticed."',
          pattern: 'analytical',
          outcome: {
            isSuccess: true,
            feedback: 'Structure. She needed someone to slow her down.',
            patternChanges: { analytical: 1 }
          },
          nextPhaseId: 'the_correlation'
        },
        {
          choiceId: 'trust_instinct',
          text: '"Your gut found something. Let\'s follow it. Show me what you see."',
          pattern: 'exploring',
          outcome: {
            isSuccess: true,
            feedback: 'Intuition validated. She traces the thread.',
            trustChange: 1
          },
          nextPhaseId: 'the_correlation'
        }
      ]
    },
    {
      phaseId: 'the_correlation',
      situation: 'There it is. Maintenance delays correlating with supplier batch numbers. A defective component slipping through.',
      timeContext: 'If she\'s right, equipment is failing. Quietly.',
      choices: [
        {
          choiceId: 'verify_twice',
          text: '"Run it again. Different dataset. We need to be sure."',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Confirmation. The pattern holds across samples.',
            patternChanges: { analytical: 1 }
          },
          nextPhaseId: 'the_report'
        },
        {
          choiceId: 'document_now',
          text: '"Document everything. Screenshots, timestamps, methodology. Before anyone can dismiss it."',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'Evidence trail. CYA before confrontation.',
            trustChange: 1
          },
          nextPhaseId: 'the_report'
        }
      ]
    },
    {
      phaseId: 'the_report',
      situation: 'The operations manager dismisses the meeting request. "Elena sees patterns in everything. She\'s been wrong before."',
      choices: [
        {
          choiceId: 'go_around',
          text: '"Safety officer. They can\'t ignore a formal safety concern."',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'Process exists for a reason. Use it.',
            trustChange: 1
          },
          nextPhaseId: 'the_vindication'
        },
        {
          choiceId: 'persist_directly',
          text: '"Send the data anyway. CC the safety team. Create a paper trail."',
          pattern: 'analytical',
          outcome: {
            isSuccess: true,
            feedback: 'Assertive documentation. They\'ll have to respond.',
            patternChanges: { patience: 1 }
          },
          nextPhaseId: 'the_vindication'
        }
      ]
    },
    {
      phaseId: 'the_vindication',
      situation: 'The safety officer calls. "We pulled the batch numbers you flagged. Six components failed inspection."',
      choices: [
        {
          choiceId: 'quiet_relief',
          text: '[Let Elena have this moment. The validation she\'s been seeking.]',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'She exhales. Years of self-doubt, answered.',
            setFlags: ['elena_pattern_success']
          }
        },
        {
          choiceId: 'acknowledge_cost',
          text: '"They should have listened sooner. You saved lives today."',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Recognition of what the doubt cost her.',
            trustChange: 1,
            setFlags: ['elena_pattern_success']
          }
        }
      ]
    }
  ],
  successEnding: {
    text: `The recall goes out. Six facilities. Hundreds of units replaced.

Elena stares at the safety report. "No injuries. Because someone listened this time."

She looks at the Station Seven file, still open on her desk. "Can't fix the past. But I can make sure it matters."`,
    trustBonus: 3,
    unlockedFlag: 'elena_loyalty_complete'
  },
  failureEnding: {
    text: `The data is buried. "Inconclusive," they call it.

Elena saves her work. "I'll keep watching. Someone will listen eventually."`,
    canRetry: true
  }
}

/**
 * Silas's Loyalty Experience: "The Feral Lab"
 * Guide burnt-out engineers through a crisis using presence, not dashboards
 */
export const SILAS_THE_FERAL_LAB: LoyaltyExperience = {
  id: 'the_feral_lab',
  title: 'The Feral Lab',
  characterId: 'silas',
  description: 'Help Silas teach a cohort of burnt-out engineers that ground truth comes from observation, not dashboards.',
  skills: ['Mentorship', 'Systems Observation', 'Patience'],
  requirements: {
    trustMin: LOYALTY_TRUST_THRESHOLD,
    patternRequirement: { pattern: 'patience', minLevel: LOYALTY_PATTERN_THRESHOLD },
    requiredFlags: ['silas_arc_complete']
  },
  introduction: `The vertical farm is struggling. Sensors show everything is fine. But the lettuce is dying.

Three engineers from AWS, Google, and Meta stand in the grow room, staring at their tablets.

"The data says humidity is optimal," one insists.

Silas touches a leaf. Brown at the edges. He looks at you. "Help me teach them what Mr. Hawkins taught me. The dashboard lies. The plant doesn't."`,
  phases: [
    {
      phaseId: 'the_disconnect',
      situation: 'The engineers are frustrated. "We\'ve checked every sensor. Everything reads normal. The plants are just... wrong."',
      choices: [
        {
          choiceId: 'question_sensors',
          text: '"When did you last calibrate those sensors? Data is only as good as its source."',
          pattern: 'analytical',
          outcome: {
            isSuccess: true,
            feedback: 'One engineer frowns. "Calibrate? They\'re supposed to be self-calibrating..."',
            patternChanges: { analytical: 1 }
          },
          nextPhaseId: 'the_observation'
        },
        {
          choiceId: 'redirect_attention',
          text: '"Put down the tablets. Look at the plants. What do you actually see?"',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Confusion. Then slowly, they look up from screens.',
            trustChange: 1
          },
          nextPhaseId: 'the_observation'
        }
      ]
    },
    {
      phaseId: 'the_observation',
      situation: 'Silas kneels, touching soil. "What does this feel like?" One engineer reluctantly pokes the growing medium.',
      timeContext: 'Literal ground truth.',
      choices: [
        {
          choiceId: 'join_observation',
          text: '[Kneel beside them. Feel the soil yourself. Model the behavior.]',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Touch. The soil is dry despite the sensor reading "optimal."',
            trustChange: 1
          },
          nextPhaseId: 'the_lesson'
        },
        {
          choiceId: 'ask_questions',
          text: '"What does the soil tell you that the sensor doesn\'t?"',
          pattern: 'exploring',
          outcome: {
            isSuccess: true,
            feedback: 'Socratic method. They start to answer their own questions.',
            patternChanges: { exploring: 1 }
          },
          nextPhaseId: 'the_lesson'
        }
      ]
    },
    {
      phaseId: 'the_lesson',
      situation: 'The root cause: irrigation line clogged with mineral buildup. Sensors couldn\'t see it. Human touch could.',
      choices: [
        {
          choiceId: 'gentle_wisdom',
          text: '"Technology amplifies judgment. It doesn\'t replace it. This is the lesson."',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Silas nods. Mr. Hawkins would approve.',
            trustChange: 2
          },
          nextPhaseId: 'the_integration'
        },
        {
          choiceId: 'practical_fix',
          text: '"Now let\'s fix it. And build a maintenance schedule that doesn\'t rely only on sensors."',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'Theory into practice. The engineers take notes.',
            patternChanges: { building: 1 }
          },
          nextPhaseId: 'the_integration'
        }
      ]
    },
    {
      phaseId: 'the_integration',
      situation: 'One engineer stays late. "I left AWS because the dashboards made me feel disconnected. Today was the first time I felt like I understood something."',
      choices: [
        {
          choiceId: 'affirm_journey',
          text: '"That\'s why Silas built this place. To reconnect engineers with the real."',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'The engineer looks at the plants differently now.',
            setFlags: ['silas_feral_success']
          }
        },
        {
          choiceId: 'invite_deeper',
          text: '"Come back next week. The strawberries need attention. Bring your curiosity, leave the tablet."',
          pattern: 'exploring',
          outcome: {
            isSuccess: true,
            feedback: 'An invitation. The Feral Lab gains another convert.',
            setFlags: ['silas_feral_success']
          }
        }
      ]
    }
  ],
  successEnding: {
    text: `The lettuce recovers. The engineers return, week after week.

Silas stands in the grow room, morning light filtering through leaves. "Mr. Hawkins was right. You can't understand a system from a dashboard. You have to be in it."

He looks at the thriving plants, then at the engineers getting their hands dirty.

"This is what I was meant to build."`,
    trustBonus: 3,
    unlockedFlag: 'silas_loyalty_complete'
  },
  failureEnding: {
    text: `Some engineers return to their dashboards. Old habits.

Silas watches them go. "Not everyone is ready to let go of the illusion of control."

But one stayed. One learned. "That's how it starts."`,
    canRetry: true
  }
}

/**
 * Asha's Loyalty Experience: "The Mural"
 * Create art that can't be erased
 */
export const ASHA_THE_MURAL: LoyaltyExperience = {
  id: 'the_mural',
  title: 'The Mural',
  characterId: 'asha',
  description: 'Help Asha create a community mural that captures Birmingham\'s soul - one they can\'t paint over.',
  skills: ['Creative Direction', 'Community Engagement', 'Artistic Vision'],
  requirements: {
    trustMin: LOYALTY_TRUST_THRESHOLD,
    patternRequirement: { pattern: 'building', minLevel: LOYALTY_PATTERN_THRESHOLD },
    requiredFlags: ['asha_arc_complete']
  },
  introduction: `The city council approved it. A permanent mural. Not projection mapping they can unplug. Not temporary paint they can cover. Permanent.

Asha stands before the blank wall, AI-generated concept sketches in hand. "They painted over my last one in three days. 'Too political. Too diverse.'"

She looks at you. "Help me make something they can't ignore. Something that's Birmingham. Not their Birmingham. Ours."`,
  phases: [
    {
      phaseId: 'the_concept',
      situation: 'Three concepts. One safe. One provocative. One that tells the truth. The council approved "safe." Asha wants "truth."',
      choices: [
        {
          choiceId: 'truth_approach',
          text: '"Paint the truth. Make it so beautiful they can\'t call it political."',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'Beauty as trojan horse. Asha grins.',
            patternChanges: { building: 1 }
          },
          nextPhaseId: 'the_process'
        },
        {
          choiceId: 'hybrid_approach',
          text: '"Blend them. Start with safe, reveal truth. Let people discover it."',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Layers of meaning. Art that unfolds.',
            trustChange: 1
          },
          nextPhaseId: 'the_process'
        }
      ]
    },
    {
      phaseId: 'the_process',
      situation: 'AI tools generate patterns, colors, compositions. But something\'s missing. "It looks like Birmingham. It doesn\'t feel like Birmingham."',
      choices: [
        {
          choiceId: 'add_human',
          text: '"What can\'t AI know? The stories. Add the people\'s stories."',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Community input. Faces of real people. Now it breathes.',
            trustChange: 1
          },
          nextPhaseId: 'the_resistance'
        },
        {
          choiceId: 'trust_instinct',
          text: '"You\'re the director. What does YOUR Birmingham look like?"',
          pattern: 'exploring',
          outcome: {
            isSuccess: true,
            feedback: 'She stops deferring to algorithms. Her vision emerges.',
            patternChanges: { exploring: 1 }
          },
          nextPhaseId: 'the_resistance'
        }
      ]
    },
    {
      phaseId: 'the_resistance',
      situation: 'Council member stops by. "This looks... different from what we approved." His tone is cold.',
      timeContext: 'The mural is half-finished. Stopping now would waste weeks.',
      choices: [
        {
          choiceId: 'stand_ground',
          text: '"The community approved it. Ask them."',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'Community support is the shield. He has no leverage.',
            trustChange: 2
          },
          nextPhaseId: 'the_unveiling'
        },
        {
          choiceId: 'redirect',
          text: '"Wait until it\'s finished. Art needs to be seen complete."',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Buy time. Finish before they can stop you.',
            patternChanges: { patience: 1 }
          },
          nextPhaseId: 'the_unveiling'
        }
      ]
    },
    {
      phaseId: 'the_unveiling',
      situation: 'The mural is complete. A crowd gathers. Faces from the neighborhood, painted into history. Someone is crying.',
      choices: [
        {
          choiceId: 'let_asha_speak',
          text: '[Step back. Let Asha address her community.]',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Her voice carries. "This is us. All of us. Forever."',
            setFlags: ['asha_mural_success']
          }
        },
        {
          choiceId: 'witness_silently',
          text: '[Watch the community respond. This moment is theirs.]',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Children point at faces they recognize. History becomes personal.',
            setFlags: ['asha_mural_success']
          }
        }
      ]
    }
  ],
  successEnding: {
    text: `The mural stays. Months later, tourists stop to photograph it. Locals explain who the faces are.

Asha runs her hand along the wall. "They can't paint over permanence. They can't unplug a wall."

A child tugs her sleeve. "That's my grandma! She's famous now!"

"Not famous," Asha says softly. "Remembered."`,
    trustBonus: 3,
    unlockedFlag: 'asha_loyalty_complete'
  },
  failureEnding: {
    text: `The mural is "revised." Committee oversight. Some faces disappear.

Asha photographs what remains. "The original lives in my files. In people's memories."

She's already planning the next one.`,
    canRetry: true
  }
}

/**
 * Lira's Loyalty Experience: "The Memory Song"
 * Compose music that captures a memory before it fades
 */
export const LIRA_THE_MEMORY_SONG: LoyaltyExperience = {
  id: 'the_memory_song',
  title: 'The Memory Song',
  characterId: 'lira',
  description: 'Help Lira compose a piece for her grandmother, capturing the sound of a memory trying to remember itself.',
  skills: ['Sound Design', 'Emotional Expression', 'AI-Assisted Creation'],
  requirements: {
    trustMin: LOYALTY_TRUST_THRESHOLD,
    patternRequirement: { pattern: 'patience', minLevel: LOYALTY_PATTERN_THRESHOLD },
    requiredFlags: ['lira_arc_complete']
  },
  introduction: `Lira's grandmother was a concert pianist. Dementia took the music first. Then the words. Now she sits by the window, humming fragments of songs she can't quite recall.

"I want to give it back to her," Lira says, voice raw. "One piece. The song she used to play for me. But I can only remember pieces."

She shows you an AI audio generator. "Help me describe what a song trying to remember itself sounds like."`,
  phases: [
    {
      phaseId: 'the_prompt',
      situation: 'The AI needs a description. "Piano song, melancholy" gives generic results. They need something specific.',
      choices: [
        {
          choiceId: 'sensory_description',
          text: '"What did the room feel like when she played? Start there."',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Lira closes her eyes. "Afternoon light. Dust in the air. Her hands..."',
            patternChanges: { patience: 1 }
          },
          nextPhaseId: 'the_iteration'
        },
        {
          choiceId: 'emotional_core',
          text: '"What does forgetting feel like? Describe the emotion, not the notes."',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: '"Like reaching for something just out of grasp." The prompt takes shape.',
            trustChange: 1
          },
          nextPhaseId: 'the_iteration'
        }
      ]
    },
    {
      phaseId: 'the_iteration',
      situation: 'Version 12. Close but not right. "It sounds like loss. But Grandma wasn\'t just loss. She was joy first."',
      choices: [
        {
          choiceId: 'add_light',
          text: '"Start with the joy. Let the forgetting creep in at the edges."',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'Structure shift. Joy fading to fog. Better.',
            patternChanges: { building: 1 }
          },
          nextPhaseId: 'the_fragment'
        },
        {
          choiceId: 'embrace_imperfection',
          text: '"Maybe perfection isn\'t the goal. Memory is imperfect by nature."',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Permission to be incomplete. The pressure lifts.',
            trustChange: 1
          },
          nextPhaseId: 'the_fragment'
        }
      ]
    },
    {
      phaseId: 'the_fragment',
      situation: 'Lira plays a few notes on her keyboard. "This fragment. I remember this. It was in the middle somewhere."',
      timeContext: 'A real memory surfacing through the process.',
      choices: [
        {
          choiceId: 'build_around',
          text: '"Use that as the anchor. Build the AI generation around your real memory."',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'Human memory + AI texture. The hybrid works.',
            trustChange: 2
          },
          nextPhaseId: 'the_gift'
        },
        {
          choiceId: 'honor_fragment',
          text: '"That fragment is enough. Maybe that\'s all she needs to remember."',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Less is more. The fragment becomes the center.',
            patternChanges: { patience: 1 }
          },
          nextPhaseId: 'the_gift'
        }
      ]
    },
    {
      phaseId: 'the_gift',
      situation: 'The piece is ready. Lira\'s hands shake as she sets up speakers in her grandmother\'s room.',
      choices: [
        {
          choiceId: 'stay_with_her',
          text: '[Stay for the moment. Witness what happens.]',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'The music plays. Grandmother\'s eyes shift. Something flickers.',
            setFlags: ['lira_memory_success']
          }
        },
        {
          choiceId: 'give_privacy',
          text: '"This moment is yours. I\'ll wait outside."',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Sacred privacy. The gift is between them.',
            setFlags: ['lira_memory_success']
          }
        }
      ]
    }
  ],
  successEnding: {
    text: `Lira emerges an hour later, face streaked with tears but smiling.

"She hummed along. Just for a moment. She remembered something."

The recording device captured it. Grandmother humming a phrase she'd lost years ago.

"It came back," Lira whispers. "Just for a moment, it came back."`,
    trustBonus: 3,
    unlockedFlag: 'lira_loyalty_complete'
  },
  failureEnding: {
    text: `The music plays. Grandmother listens. But recognition doesn't come.

Lira cries quietly. "Maybe it's not about her remembering. Maybe it's about me not forgetting."

She saves the file. Plays it sometimes. For herself.`,
    canRetry: true
  }
}

/**
 * Zara's Loyalty Experience: "The Audit"
 * Expose algorithmic bias before it harms more people
 */
export const ZARA_THE_AUDIT: LoyaltyExperience = {
  id: 'the_audit',
  title: 'The Audit',
  characterId: 'zara',
  description: 'Help Zara expose algorithmic bias in a healthcare system before it causes more harm.',
  skills: ['Data Auditing', 'Bias Detection', 'Ethical Analysis'],
  requirements: {
    trustMin: LOYALTY_TRUST_THRESHOLD,
    patternRequirement: { pattern: 'analytical', minLevel: LOYALTY_PATTERN_THRESHOLD },
    requiredFlags: ['zara_arc_complete']
  },
  introduction: `Zara's laptop shows a spreadsheet. Thousands of rows. Hospital triage priority scores.

"There's a pattern," she says, voice flat. "Patients from three zip codes are systematically deprioritized. Same symptoms. Different treatment windows."

She pulls up a map. Low-income neighborhoods, highlighted.

"Last time I found something like this, I was too slow. Three people died." Her jaw tightens. "Not this time."`,
  phases: [
    {
      phaseId: 'the_evidence',
      situation: 'The correlation is clear. But correlation isn\'t causation. "They\'ll say it\'s coincidence. They always do."',
      choices: [
        {
          choiceId: 'control_variables',
          text: '"Control for every variable. Age, condition severity, time of admission. Make it undeniable."',
          pattern: 'analytical',
          outcome: {
            isSuccess: true,
            feedback: 'Rigorous methodology. The pattern survives every filter.',
            patternChanges: { analytical: 1 }
          },
          nextPhaseId: 'the_mechanism'
        },
        {
          choiceId: 'find_mechanism',
          text: '"Find the mechanism. How does the algorithm KNOW which zip code they\'re from?"',
          pattern: 'exploring',
          outcome: {
            isSuccess: true,
            feedback: 'Insurance type. Payment history. Proxies for income.',
            trustChange: 1
          },
          nextPhaseId: 'the_mechanism'
        }
      ]
    },
    {
      phaseId: 'the_mechanism',
      situation: 'The algorithm uses "payor mix" as a factor. Insurance type. Perfectly legal. Systematically harmful.',
      choices: [
        {
          choiceId: 'document_impact',
          text: '"Show the human cost. Delayed treatments. Worse outcomes. Make it real."',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Statistics become stories. Three patients identified who can testify.',
            trustChange: 2
          },
          nextPhaseId: 'the_escalation'
        },
        {
          choiceId: 'legal_angle',
          text: '"Civil rights law. Disparate impact. They can\'t hide behind \'the algorithm.\'"',
          pattern: 'analytical',
          outcome: {
            isSuccess: true,
            feedback: 'Legal framework established. This is actionable.',
            patternChanges: { building: 1 }
          },
          nextPhaseId: 'the_escalation'
        }
      ]
    },
    {
      phaseId: 'the_escalation',
      situation: 'Zara\'s manager calls. "The hospital is a major client. Are you sure you want to escalate this?"',
      timeContext: 'Career pressure.',
      choices: [
        {
          choiceId: 'firm_escalation',
          text: '"Patients are dying because of this algorithm. I\'m escalating."',
          pattern: 'building',
          outcome: {
            isSuccess: true,
            feedback: 'Moral clarity. The manager backs down.',
            trustChange: 1
          },
          nextPhaseId: 'the_result'
        },
        {
          choiceId: 'documentation_first',
          text: '"I\'m sending you the documentation. Read it. Then tell me not to escalate."',
          pattern: 'patience',
          outcome: {
            isSuccess: true,
            feedback: 'Evidence speaks. The manager goes quiet.',
            patternChanges: { patience: 1 }
          },
          nextPhaseId: 'the_result'
        }
      ]
    },
    {
      phaseId: 'the_result',
      situation: 'Two weeks later. The algorithm is pulled for review. Zara receives an email from hospital administration: "Thank you for your thorough work."',
      choices: [
        {
          choiceId: 'quiet_victory',
          text: '"You did it. The invisible work mattered."',
          pattern: 'helping',
          outcome: {
            isSuccess: true,
            feedback: 'Recognition of what she does in spreadsheets, alone, for hours.',
            setFlags: ['zara_audit_success']
          }
        },
        {
          choiceId: 'look_forward',
          text: '"This one is fixed. How many more are out there?"',
          pattern: 'exploring',
          outcome: {
            isSuccess: true,
            feedback: 'The work continues. But today is a win.',
            setFlags: ['zara_audit_success']
          }
        }
      ]
    }
  ],
  successEnding: {
    text: `The algorithm is replaced. New policy: triage cannot use insurance type as a proxy.

Zara stares at the empty inbox. No thank-you notes from patients. They'll never know what almost happened.

"Invisible work," she says. "That's okay. The outcomes are visible. That's what counts."

She opens the next dataset. Another algorithm. Another audit.`,
    trustBonus: 3,
    unlockedFlag: 'zara_loyalty_complete'
  },
  failureEnding: {
    text: `The report is buried. "Under review indefinitely."

Zara saves her documentation. Someday, someone will need it.

"They can't hide data forever. I'll wait."`,
    canRetry: true
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * All loyalty experiences indexed by type
 */
export const LOYALTY_EXPERIENCES: Record<LoyaltyExperienceType, LoyaltyExperience> = {
  // Original 7
  'the_demo': MAYA_THE_DEMO,
  'the_outage': DEVON_THE_OUTAGE,
  'the_quiet_hour': SAMUEL_THE_QUIET_HOUR,
  'the_breach': MARCUS_THE_BREACH,
  'the_confrontation': ROHAN_THE_CONFRONTATION,
  'the_first_class': TESS_THE_FIRST_CLASS,
  'the_crossroads': JORDAN_THE_CROSSROADS,
  // Extended 9
  'the_vigil': GRACE_THE_VIGIL,
  'the_honest_course': ALEX_THE_HONEST_COURSE,
  'the_inspection': KAI_THE_INSPECTION,
  'the_launch': YAQUIN_THE_LAUNCH,
  'the_pattern': ELENA_THE_PATTERN,
  'the_feral_lab': SILAS_THE_FERAL_LAB,
  'the_mural': ASHA_THE_MURAL,
  'the_memory_song': LIRA_THE_MEMORY_SONG,
  'the_audit': ZARA_THE_AUDIT
}

/**
 * Get loyalty experience for a character
 */
export function getLoyaltyExperienceForCharacter(characterId: CharacterId): LoyaltyExperience | undefined {
  return Object.values(LOYALTY_EXPERIENCES).find(exp => exp.characterId === characterId)
}

/**
 * Check if loyalty experience is unlocked
 */
export function isLoyaltyExperienceUnlocked(
  experience: LoyaltyExperience,
  trust: number,
  patterns: Record<PatternType, number>,
  globalFlags: Set<string>
): boolean {
  const { requirements } = experience

  // Check trust
  if (trust < requirements.trustMin) return false

  // Check pattern requirement
  if (requirements.patternRequirement) {
    const { pattern, minLevel } = requirements.patternRequirement
    if ((patterns[pattern] || 0) < minLevel) return false
  }

  // Check required flags
  if (requirements.requiredFlags) {
    for (const flag of requirements.requiredFlags) {
      if (!globalFlags.has(flag)) return false
    }
  }

  return true
}
