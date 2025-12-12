/**
 * Character Depth System - Vulnerabilities and Strengths
 * Makes characters feel real by giving them weak points that open them up
 * and strengths that provide value to the player
 *
 * Design Philosophy:
 * - Vulnerabilities aren't about "breaking" characters, but understanding them
 * - Finding a vulnerability unlocks deeper dialogue, not manipulation
 * - Strengths provide tangible gameplay benefits (insights, new options)
 * - Discovery should feel earned through genuine relationship building
 */

/**
 * A topic that, when approached correctly, opens a character up emotionally
 */
export interface CharacterVulnerability {
  id: string
  topic: string                     // Internal identifier
  displayName: string               // Human-readable name
  description: string               // What this vulnerability is about

  // How to discover this vulnerability
  triggerPhrases: string[]          // Keywords that might touch this nerve
  discoveryConditions: {
    trustMin: number                // Minimum trust to reveal
    requiredFlags?: string[]        // Knowledge flags needed
    patternRequirements?: {
      pattern: string
      min: number
    }[]
  }

  // How character responds at different trust levels
  responses: {
    earlyTrust: string              // Trust < 4: defensive/deflective
    midTrust: string                // Trust 4-7: starting to open up
    highTrust: string               // Trust >= 8: vulnerable and honest
  }

  // What discovering this unlocks
  rewards: {
    knowledgeFlag: string           // Flag set when discovered
    unlockedDialogueNodes?: string[] // New dialogue paths
    trustBonus?: number             // One-time trust increase
    thoughtId?: string              // Thought cabinet entry
  }
}

/**
 * An area where the character excels and can help the player
 */
export interface CharacterStrength {
  id: string
  domain: string                    // Internal identifier
  displayName: string               // Human-readable name
  description: string               // What this strength is about

  // Topics where this strength manifests
  demonstrationTopics: string[]

  // How the strength is revealed
  revealConditions?: {
    trustMin?: number
    requiredFlags?: string[]
  }

  // What the character says when using their strength
  helpDialogue: {
    offerHelp: string               // When offering their expertise
    successFeedback: string         // When their help works
    recognitionResponse: string     // When player acknowledges their strength
  }

  // Gameplay benefit
  ability?: {
    id: string
    name: string
    description: string
    usableInContexts: string[]      // Where this ability can be used
  }
}

/**
 * How a vulnerability can transform into a strength (character growth)
 */
export interface GrowthArc {
  vulnerabilityId: string
  strengthId: string
  transformationDialogue: string[]   // Multi-part dialogue for the moment
  conditions: {
    trustMin: number
    requiredFlags: string[]
  }
  result: {
    globalFlagsSet: string[]
    newStrengthUnlocked?: string
  }
}

/**
 * Complete depth profile for a character
 */
export interface CharacterDepthProfile {
  characterId: string
  vulnerabilities: CharacterVulnerability[]
  strengths: CharacterStrength[]
  growthArcs: GrowthArc[]
}

/**
 * All character depth profiles
 * Starting with Maya as proof of concept
 */
export const CHARACTER_DEPTH: Record<string, CharacterDepthProfile> = {
  maya: {
    characterId: 'maya',

    vulnerabilities: [
      {
        id: 'maya_family_guilt',
        topic: 'family_expectations',
        displayName: 'Family Guilt',
        description: 'Maya carries immense guilt about potentially disappointing parents who sacrificed everything for her.',

        triggerPhrases: [
          'parents', 'family', 'expectations', 'sacrifice',
          'immigrant', 'proud', 'disappoint', 'pressure'
        ],

        discoveryConditions: {
          trustMin: 3,
          patternRequirements: [{ pattern: 'patience', min: 2 }]
        },

        responses: {
          earlyTrust: '*deflects* It\'s fine. They just want what\'s best for me. Everyone\'s parents are like that, right?',
          midTrust: 'They gave up everything—their careers, their country—for me. How do I tell them I want something different?',
          highTrust: 'Sometimes I wonder... would they still love me if I wasn\'t pre-med? Is their love conditional on me becoming a doctor?'
        },

        rewards: {
          knowledgeFlag: 'knows_maya_family_pressure',
          unlockedDialogueNodes: ['maya_family_deep_dive', 'maya_parents_conflict'],
          trustBonus: 1,
          thoughtId: 'empathy-mirror'
        }
      },

      {
        id: 'maya_imposter_syndrome',
        topic: 'self_doubt',
        displayName: 'Imposter Syndrome',
        description: 'Maya doubts whether she\'s actually talented at robotics or just desperate for something that\'s "hers."',

        triggerPhrases: [
          'capable', 'smart', 'talented', 'engineer', 'real',
          'belong', 'good enough', 'compared to'
        ],

        discoveryConditions: {
          trustMin: 5,
          requiredFlags: ['knows_robotics'],
          patternRequirements: [{ pattern: 'analytical', min: 2 }]
        },

        responses: {
          earlyTrust: '*nervous laugh* I just mess around with circuits. It\'s nothing serious.',
          midTrust: 'Devon makes it look easy. I spend hours on something he\'d do in minutes. Maybe I\'m just... playing engineer.',
          highTrust: 'What if I\'m not actually good at this? What if I\'m just desperate for something that\'s mine, and I\'m fooling myself?'
        },

        rewards: {
          knowledgeFlag: 'knows_maya_self_doubt',
          unlockedDialogueNodes: ['maya_imposter_deep_dive', 'maya_devon_comparison'],
          trustBonus: 2,
          thoughtId: 'analytical-eye'
        }
      },

      {
        id: 'maya_unsent_email',
        topic: 'missed_opportunity',
        displayName: 'The Unsent Email',
        description: 'Maya wrote an email to Innovation Depot about an internship but never sent it.',

        triggerPhrases: [
          'innovation', 'depot', 'internship', 'opportunity',
          'application', 'email', 'birmingham', 'tech'
        ],

        discoveryConditions: {
          trustMin: 6,
          requiredFlags: ['knows_maya_family_pressure', 'knows_robotics']
        },

        responses: {
          earlyTrust: 'Innovation Depot? Yeah, I\'ve heard of it. Cool place, supposedly.',
          midTrust: 'I actually... wrote them once. About their robotics program. Never sent it.',
          highTrust: 'I had the email written. "Robotics Internship Inquiry." But then I imagined their faces—my parents. The years of sacrifice. All of it... for me to abandon medicine for "tinkering"? I deleted the draft.'
        },

        rewards: {
          knowledgeFlag: 'knows_unsent_email',
          unlockedDialogueNodes: ['maya_email_discussion', 'maya_what_if'],
          trustBonus: 2
        }
      }
    ],

    strengths: [
      {
        id: 'maya_creative_engineering',
        domain: 'technical_problem_solving',
        displayName: 'Creative Engineering',
        description: 'Maya has an intuitive understanding of how mechanical systems work and can debug problems others miss.',

        demonstrationTopics: ['robotics', 'debugging', 'building', 'design', 'mechanical'],

        revealConditions: {
          trustMin: 4
        },

        helpDialogue: {
          offerHelp: 'I could take a look at it. Sometimes a fresh pair of eyes—especially engineer eyes—helps.',
          successFeedback: 'See? You just needed to isolate the signal path. Classic debugging.',
          recognitionResponse: '*surprised* You really think so? I just... I like figuring out how things work.'
        },

        ability: {
          id: 'maya_technical_insight',
          name: 'Maya\'s Technical Insight',
          description: 'Ask Maya to analyze technical problems or systems',
          usableInContexts: ['platform_choice', 'technical_problem', 'career_decision']
        }
      },

      {
        id: 'maya_empathy_bridge',
        domain: 'emotional_understanding',
        displayName: 'Empathy Through Experience',
        description: 'Maya deeply understands the pressure of being caught between expectations and passion.',

        demonstrationTopics: ['pressure', 'expectations', 'identity', 'family', 'choice'],

        revealConditions: {
          trustMin: 6,
          requiredFlags: ['knows_maya_family_pressure']
        },

        helpDialogue: {
          offerHelp: 'I know what it\'s like to feel stuck between who you are and who everyone expects you to be.',
          successFeedback: 'Sometimes just knowing someone gets it... that helps, right?',
          recognitionResponse: 'I guess living it makes you understand it.'
        },

        ability: {
          id: 'maya_empathy_insight',
          name: 'Maya\'s Understanding',
          description: 'Maya can relate to others facing similar pressure',
          usableInContexts: ['emotional_support', 'identity_crisis', 'family_conflict']
        }
      }
    ],

    growthArcs: [
      {
        vulnerabilityId: 'maya_imposter_syndrome',
        strengthId: 'maya_creative_engineering',
        transformationDialogue: [
          'You know what I realized?',
          'I keep comparing myself to Devon, to "real" engineers.',
          'But they didn\'t build a robot that makes their grandmother smile.',
          'Maybe I\'m not an imposter. Maybe I\'m just... different.',
          'And different isn\'t wrong.'
        ],
        conditions: {
          trustMin: 8,
          requiredFlags: ['knows_maya_self_doubt', 'maya_robotics_success']
        },
        result: {
          globalFlagsSet: ['maya_imposter_resolved', 'maya_growth_engineering'],
          newStrengthUnlocked: 'maya_mentor_mode'
        }
      },

      {
        vulnerabilityId: 'maya_family_guilt',
        strengthId: 'maya_empathy_bridge',
        transformationDialogue: [
          'I had dinner with my parents last night.',
          'I didn\'t tell them everything. Not yet.',
          'But I stopped apologizing for loving robotics.',
          'Maybe that\'s the first step.',
          'Understanding that their sacrifice wasn\'t for a doctor—it was for ME.'
        ],
        conditions: {
          trustMin: 8,
          requiredFlags: ['knows_maya_family_pressure', 'knows_unsent_email']
        },
        result: {
          globalFlagsSet: ['maya_family_growth', 'maya_boundary_set']
        }
      }
    ]
  }

  // Additional characters will be added after Maya proves the system
}

/**
 * Check if player's dialogue choice touches a vulnerability
 */
export function checkVulnerabilityTrigger(
  characterId: string,
  choiceText: string,
  context: {
    trust: number
    knowledgeFlags: Set<string>
    patterns: Record<string, number>
  }
): {
  triggered: boolean
  vulnerability?: CharacterVulnerability
  response?: string
} {
  const profile = CHARACTER_DEPTH[characterId]
  if (!profile) return { triggered: false }

  const choiceLower = choiceText.toLowerCase()

  for (const vuln of profile.vulnerabilities) {
    // Check if any trigger phrases are in the choice
    const triggered = vuln.triggerPhrases.some(
      phrase => choiceLower.includes(phrase.toLowerCase())
    )

    if (!triggered) continue

    // Check discovery conditions
    if (context.trust < vuln.discoveryConditions.trustMin) {
      continue // Not enough trust to trigger
    }

    if (vuln.discoveryConditions.requiredFlags) {
      const hasAllFlags = vuln.discoveryConditions.requiredFlags.every(
        flag => context.knowledgeFlags.has(flag)
      )
      if (!hasAllFlags) continue
    }

    if (vuln.discoveryConditions.patternRequirements) {
      const meetsPatterns = vuln.discoveryConditions.patternRequirements.every(
        req => (context.patterns[req.pattern] || 0) >= req.min
      )
      if (!meetsPatterns) continue
    }

    // Determine appropriate response based on trust
    let response: string
    if (context.trust < 4) {
      response = vuln.responses.earlyTrust
    } else if (context.trust < 8) {
      response = vuln.responses.midTrust
    } else {
      response = vuln.responses.highTrust
    }

    return {
      triggered: true,
      vulnerability: vuln,
      response
    }
  }

  return { triggered: false }
}

/**
 * Get available strengths for a character based on current state
 */
export function getAvailableStrengths(
  characterId: string,
  context: {
    trust: number
    knowledgeFlags: Set<string>
  }
): CharacterStrength[] {
  const profile = CHARACTER_DEPTH[characterId]
  if (!profile) return []

  return profile.strengths.filter(strength => {
    if (!strength.revealConditions) return true

    if (strength.revealConditions.trustMin !== undefined &&
        context.trust < strength.revealConditions.trustMin) {
      return false
    }

    if (strength.revealConditions.requiredFlags) {
      const hasAllFlags = strength.revealConditions.requiredFlags.every(
        flag => context.knowledgeFlags.has(flag)
      )
      if (!hasAllFlags) return false
    }

    return true
  })
}

/**
 * Check if a growth arc is ready to trigger
 */
export function checkGrowthArcReady(
  characterId: string,
  context: {
    trust: number
    globalFlags: Set<string>
  }
): GrowthArc | null {
  const profile = CHARACTER_DEPTH[characterId]
  if (!profile) return null

  for (const arc of profile.growthArcs) {
    // Check if already completed
    if (arc.result.globalFlagsSet.some(flag => context.globalFlags.has(flag))) {
      continue
    }

    // Check conditions
    if (context.trust < arc.conditions.trustMin) continue

    const hasAllFlags = arc.conditions.requiredFlags.every(
      flag => context.globalFlags.has(flag)
    )
    if (!hasAllFlags) continue

    return arc
  }

  return null
}

/**
 * Get discovery hints for undiscovered vulnerabilities
 * These appear subtly in dialogue to guide players toward discoveries
 */
export function getDiscoveryHints(
  characterId: string,
  context: {
    trust: number
    knowledgeFlags: Set<string>
  }
): string[] {
  const profile = CHARACTER_DEPTH[characterId]
  if (!profile) return []

  const hints: string[] = []

  for (const vuln of profile.vulnerabilities) {
    // Skip if already discovered
    if (context.knowledgeFlags.has(vuln.rewards.knowledgeFlag)) continue

    // Check if we're close to discovering
    const trustGap = vuln.discoveryConditions.trustMin - context.trust

    if (trustGap <= 2 && trustGap > 0) {
      // Close enough to hint
      hints.push(`There's something ${vuln.displayName.toLowerCase()} she's not saying...`)
    }
  }

  return hints
}
