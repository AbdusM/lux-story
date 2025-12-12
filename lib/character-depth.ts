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
  },

  // ============================================
  // SAMUEL - The Station Keeper
  // ============================================
  samuel: {
    characterId: 'samuel',

    vulnerabilities: [
      {
        id: 'samuel_past_failure',
        topic: 'past_mistakes',
        displayName: 'A Train He Missed',
        description: 'Samuel once failed to help a traveler who needed him—this still haunts him.',

        triggerPhrases: [
          'failed', 'mistake', 'regret', 'couldn\'t help',
          'wrong', 'missed', 'too late'
        ],

        discoveryConditions: {
          trustMin: 5,
          patternRequirements: [{ pattern: 'patience', min: 3 }]
        },

        responses: {
          earlyTrust: '*a long pause* Some trains... some trains leave without us.',
          midTrust: 'I\'ve been doing this a long time. Long enough to have regrets.',
          highTrust: 'There was a young man, years ago. I saw the signs—the weight he carried. I thought he needed space. He needed someone to stop him from boarding that train alone. I still wonder where he ended up.'
        },

        rewards: {
          knowledgeFlag: 'knows_samuel_regret',
          unlockedDialogueNodes: ['samuel_past_deep_dive', 'samuel_redemption'],
          trustBonus: 2
        }
      },

      {
        id: 'samuel_loneliness',
        topic: 'isolation',
        displayName: 'The Lonely Station Keeper',
        description: 'Samuel guides countless travelers but has no journey of his own.',

        triggerPhrases: [
          'alone', 'lonely', 'journey', 'your story',
          'what about you', 'your path'
        ],

        discoveryConditions: {
          trustMin: 6,
          requiredFlags: ['met_multiple_characters']
        },

        responses: {
          earlyTrust: '*deflects with a smile* This station is my journey.',
          midTrust: 'The keeper watches the trains. The keeper doesn\'t board them.',
          highTrust: 'Everyone who comes through here is going somewhere. I help them find their way. But sometimes, late at night, I wonder... where would I go? If I could still choose?'
        },

        rewards: {
          knowledgeFlag: 'knows_samuel_lonely',
          unlockedDialogueNodes: ['samuel_own_story', 'samuel_before_station'],
          trustBonus: 2
        }
      }
    ],

    strengths: [
      {
        id: 'samuel_pattern_sight',
        domain: 'seeing_patterns',
        displayName: 'Pattern Sight',
        description: 'Samuel can see connections between people and paths that others miss.',

        demonstrationTopics: ['connections', 'relationships', 'paths', 'choices'],

        revealConditions: {
          trustMin: 3
        },

        helpDialogue: {
          offerHelp: 'Let me show you how your thread connects to theirs.',
          successFeedback: 'You see it now, don\'t you? The pattern was always there.',
          recognitionResponse: '*nods slowly* The station shows me things. After this many years, you learn to see.'
        },

        ability: {
          id: 'samuel_connection_reveal',
          name: 'Samuel\'s Insight',
          description: 'Ask Samuel to reveal connections between characters',
          usableInContexts: ['relationship_questions', 'character_introduction', 'story_connection']
        }
      },

      {
        id: 'samuel_patient_wisdom',
        domain: 'wisdom_through_waiting',
        displayName: 'Wisdom of Waiting',
        description: 'Samuel knows when to speak and when to let silence teach.',

        demonstrationTopics: ['uncertainty', 'rushing', 'decisions', 'patience'],

        revealConditions: {
          trustMin: 4
        },

        helpDialogue: {
          offerHelp: 'Sometimes the best thing to do is wait.',
          successFeedback: 'See? The answer was already there. It just needed time to arrive.',
          recognitionResponse: 'Patience isn\'t doing nothing. It\'s doing nothing until the right moment.'
        }
      }
    ],

    growthArcs: []
  },

  // ============================================
  // DEVON - The Systems Thinker
  // ============================================
  devon: {
    characterId: 'devon',

    vulnerabilities: [
      {
        id: 'devon_father_distance',
        topic: 'father_relationship',
        displayName: 'The Distance Call',
        description: 'Devon\'s father is struggling with health issues, and Devon can\'t connect.',

        triggerPhrases: [
          'father', 'dad', 'family', 'home', 'call',
          'distance', 'health', 'sick'
        ],

        discoveryConditions: {
          trustMin: 4,
          patternRequirements: [{ pattern: 'patience', min: 2 }]
        },

        responses: {
          earlyTrust: '*checks phone* Family stuff. It\'s fine.',
          midTrust: 'My dad... he\'s not doing well. I built him this app to track symptoms, but...',
          highTrust: 'He doesn\'t want my app. He wants me to visit. To just... sit with him. I don\'t know how to do that. I don\'t have code for "be present."'
        },

        rewards: {
          knowledgeFlag: 'knows_devon_father',
          unlockedDialogueNodes: ['devon_father_deep', 'devon_family_call'],
          trustBonus: 2
        }
      },

      {
        id: 'devon_connection_fear',
        topic: 'emotional_vulnerability',
        displayName: 'Error Handling for Emotions',
        description: 'Devon uses systems thinking because real connection terrifies him.',

        triggerPhrases: [
          'feel', 'emotion', 'vulnerable', 'connect',
          'love', 'afraid', 'scared'
        ],

        discoveryConditions: {
          trustMin: 6,
          requiredFlags: ['knows_devon_father']
        },

        responses: {
          earlyTrust: 'I prefer systems. They\'re predictable.',
          midTrust: 'The optimizer tells me what to say. Without it, I might say the wrong thing.',
          highTrust: 'Scripts don\'t hang up. Scripts don\'t cry. Scripts don\'t say "I\'m fine" when they\'re drowning. But my dad doesn\'t want an algorithm. He wants his son.'
        },

        rewards: {
          knowledgeFlag: 'knows_devon_fear',
          unlockedDialogueNodes: ['devon_breakthrough', 'devon_authentic'],
          trustBonus: 3,
          thoughtId: 'analytical-eye'
        }
      }
    ],

    strengths: [
      {
        id: 'devon_system_analysis',
        domain: 'systems_thinking',
        displayName: 'Systems Analysis',
        description: 'Devon can break down any problem into components and dependencies.',

        demonstrationTopics: ['problems', 'decisions', 'optimization', 'structure'],

        revealConditions: {
          trustMin: 2
        },

        helpDialogue: {
          offerHelp: 'Let me map out the dependencies. There\'s always a structure.',
          successFeedback: 'See? Once you isolate the variables, the solution becomes clear.',
          recognitionResponse: '*slight smile* Systems are my language.'
        },

        ability: {
          id: 'devon_breakdown',
          name: 'Devon\'s Analysis',
          description: 'Ask Devon to systematically analyze a problem',
          usableInContexts: ['complex_decision', 'technical_problem', 'career_planning']
        }
      },

      {
        id: 'devon_human_connection',
        domain: 'earned_vulnerability',
        displayName: 'Real Connection',
        description: 'Devon can connect authentically once he drops the algorithm.',

        demonstrationTopics: ['honesty', 'vulnerability', 'connection', 'real_talk'],

        revealConditions: {
          trustMin: 7,
          requiredFlags: ['knows_devon_fear']
        },

        helpDialogue: {
          offerHelp: 'No optimizer for this one. Just... me.',
          successFeedback: 'That wasn\'t so hard. Maybe I don\'t need the script.',
          recognitionResponse: 'I guess some things can\'t be debugged. They just have to be felt.'
        }
      }
    ],

    growthArcs: [
      {
        vulnerabilityId: 'devon_connection_fear',
        strengthId: 'devon_human_connection',
        transformationDialogue: [
          '*The simulation fades. Devon looks at his hands.*',
          'I keep building scripts because scripts don\'t hang up.',
          'Scripts don\'t cry.',
          'Scripts don\'t say "I\'m fine" when they\'re drowning.',
          '*A long pause.*',
          'But my dad doesn\'t want an algorithm.',
          '*Devon\'s voice cracks.*',
          'He wants his son.'
        ],
        conditions: {
          trustMin: 8,
          requiredFlags: ['knows_devon_fear', 'devon_optimizer_tested']
        },
        result: {
          globalFlagsSet: ['devon_transformation_complete', 'devon_human_connection'],
          newStrengthUnlocked: 'devon_human_connection'
        }
      }
    ]
  },

  // ============================================
  // TESS - The Curator
  // ============================================
  tess: {
    characterId: 'tess',

    vulnerabilities: [
      {
        id: 'tess_corporate_past',
        topic: 'selling_out',
        displayName: 'The Corporate Years',
        description: 'Tess spent years at a major label doing exactly what she now despises.',

        triggerPhrases: [
          'corporate', 'label', 'sellout', 'past',
          'before', 'industry', 'executive'
        ],

        discoveryConditions: {
          trustMin: 4,
          patternRequirements: [{ pattern: 'analytical', min: 2 }]
        },

        responses: {
          earlyTrust: '*flips a record* Everyone starts somewhere.',
          midTrust: 'I know how the algorithm works because I helped build it. At Universal. For eight years.',
          highTrust: 'I signed artists to contracts I knew would bury them. Told myself I was "helping them get heard." I was helping the machine get fed.'
        },

        rewards: {
          knowledgeFlag: 'knows_tess_corporate',
          unlockedDialogueNodes: ['tess_label_days', 'tess_why_she_left'],
          trustBonus: 2
        }
      },

      {
        id: 'tess_artist_guilt',
        topic: 'failed_artist',
        displayName: 'The Demo She Never Made',
        description: 'Tess was a musician once. She chose the safe path and regrets it.',

        triggerPhrases: [
          'your music', 'play', 'perform', 'stage',
          'your art', 'dream', 'gave up'
        ],

        discoveryConditions: {
          trustMin: 6,
          requiredFlags: ['knows_tess_corporate']
        },

        responses: {
          earlyTrust: '*doesn\'t answer, keeps flipping records*',
          midTrust: 'I had a band. We had a sound. I got a "real job" instead.',
          highTrust: 'We had something real. I watched that demo tape until it warped. Then I took the label job because it was "smart." Been wondering ever since what would have happened if I\'d been brave instead of smart.'
        },

        rewards: {
          knowledgeFlag: 'knows_tess_artist',
          unlockedDialogueNodes: ['tess_band_story', 'tess_what_if'],
          trustBonus: 2
        }
      }
    ],

    strengths: [
      {
        id: 'tess_authenticity_detection',
        domain: 'reading_people',
        displayName: 'BS Detector',
        description: 'Tess can tell when someone is performing versus being real.',

        demonstrationTopics: ['truth', 'honesty', 'authenticity', 'real'],

        revealConditions: {
          trustMin: 2
        },

        helpDialogue: {
          offerHelp: 'Let me tell you what I hear when they talk.',
          successFeedback: 'See? The truth has a different sound.',
          recognitionResponse: 'Twenty years of listening. You learn what\'s real.'
        },

        ability: {
          id: 'tess_truth_reading',
          name: 'Tess\'s Reading',
          description: 'Ask Tess to evaluate someone\'s authenticity',
          usableInContexts: ['character_evaluation', 'trust_decision', 'authenticity_check']
        }
      },

      {
        id: 'tess_curation_wisdom',
        domain: 'finding_value',
        displayName: 'Curation',
        description: 'Tess can find the signal in the noise—the real among the fake.',

        demonstrationTopics: ['choice', 'quality', 'direction', 'taste'],

        revealConditions: {
          trustMin: 5,
          requiredFlags: ['knows_tess_corporate']
        },

        helpDialogue: {
          offerHelp: 'I\'ve heard ten thousand demos. Let me help you find yours.',
          successFeedback: 'That\'s the one. That\'s you.',
          recognitionResponse: 'Curation isn\'t about taste. It\'s about recognition.'
        },

        ability: {
          id: 'tess_curation',
          name: 'Tess\'s Curation',
          description: 'Ask Tess to help identify what matters most',
          usableInContexts: ['priority_decision', 'values_clarification', 'path_choice']
        }
      }
    ],

    growthArcs: [
      {
        vulnerabilityId: 'tess_artist_guilt',
        strengthId: 'tess_curation_wisdom',
        transformationDialogue: [
          '*Tess puts down the record she\'s holding*',
          'I spent years regretting not making that demo.',
          'But you know what?',
          'Maybe my instrument was never the guitar.',
          'Maybe it was always this—',
          '*gestures at the shop*',
          'Finding the ones who ARE brave enough. And making sure they get heard.'
        ],
        conditions: {
          trustMin: 8,
          requiredFlags: ['knows_tess_artist', 'tess_helped_player']
        },
        result: {
          globalFlagsSet: ['tess_transformation_complete', 'tess_peace_with_past']
        }
      }
    ]
  }
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
