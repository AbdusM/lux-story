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
  },

  // ============================================
  // MARCUS - The Healer
  // ============================================
  marcus: {
    characterId: 'marcus',

    vulnerabilities: [
      {
        id: 'marcus_weight_of_lives',
        topic: 'emotional_burden',
        displayName: 'The Weight',
        description: 'Marcus carries the cumulative weight of every patient—saved and lost.',

        triggerPhrases: [
          'heavy', 'hard', 'burden', 'carry',
          'tired', 'weight', 'too much', 'loss'
        ],

        discoveryConditions: {
          trustMin: 4,
          patternRequirements: [{ pattern: 'helping', min: 2 }]
        },

        responses: {
          earlyTrust: 'The job is the job. You do what needs doing.',
          midTrust: 'Seventy-two beats at rest. I hear that number in my sleep sometimes.',
          highTrust: 'Every code blue I call, I wonder—did I do enough? Did I catch it fast enough? Was there something, some moment where I could have—and I didn\'t?'
        },

        rewards: {
          knowledgeFlag: 'knows_marcus_weight',
          unlockedDialogueNodes: ['marcus_burden', 'marcus_coping'],
          trustBonus: 2
        }
      },

      {
        id: 'marcus_first_loss',
        topic: 'first_patient_death',
        displayName: 'Patient Zero',
        description: 'Marcus\'s first patient death still haunts him—a child named Elena.',

        triggerPhrases: [
          'first time', 'remember', 'beginning', 'start',
          'child', 'kid', 'young', 'lost'
        ],

        discoveryConditions: {
          trustMin: 6,
          requiredFlags: ['knows_marcus_weight']
        },

        responses: {
          earlyTrust: '*his hands go still for a moment*',
          midTrust: 'Her name was Elena. Six years old. Leukemia. I was her nurse for eleven months.',
          highTrust: 'I told her I\'d see her tomorrow. She believed me. She was gone by morning. I still don\'t know if I lied to her or to myself.'
        },

        rewards: {
          knowledgeFlag: 'knows_marcus_first_patient',
          unlockedDialogueNodes: ['marcus_elena', 'marcus_why_he_stays'],
          trustBonus: 3
        }
      }
    ],

    strengths: [
      {
        id: 'marcus_steady_presence',
        domain: 'calm_under_pressure',
        displayName: 'Steady Hands',
        description: 'Marcus remains calm when everyone else panics. His presence grounds people.',

        demonstrationTopics: ['crisis', 'panic', 'emergency', 'chaos'],

        revealConditions: {
          trustMin: 2
        },

        helpDialogue: {
          offerHelp: 'Breathe. I\'m here. Nothing\'s happening faster than we can handle.',
          successFeedback: 'See? One thing at a time.',
          recognitionResponse: 'Panic doesn\'t save lives. Presence does.'
        },

        ability: {
          id: 'marcus_grounding',
          name: 'Marcus\'s Grounding',
          description: 'Marcus can help calm a crisis and provide steady presence',
          usableInContexts: ['crisis_management', 'panic_response', 'stress_reduction']
        }
      },

      {
        id: 'marcus_care_wisdom',
        domain: 'compassionate_care',
        displayName: 'The Art of Care',
        description: 'Marcus knows that healing isn\'t just physical—it\'s about making people feel human.',

        demonstrationTopics: ['care', 'comfort', 'healing', 'support'],

        revealConditions: {
          trustMin: 5,
          requiredFlags: ['knows_marcus_weight']
        },

        helpDialogue: {
          offerHelp: 'Sometimes people don\'t need solutions. They need someone to sit with them.',
          successFeedback: 'You don\'t have to fix everything. Just be here.',
          recognitionResponse: 'Care isn\'t about curing. It\'s about presence.'
        },

        ability: {
          id: 'marcus_care',
          name: 'Marcus\'s Care',
          description: 'Marcus can teach the art of being present with someone in pain',
          usableInContexts: ['comfort_guidance', 'presence_teaching', 'care_approach']
        }
      }
    ],

    growthArcs: [
      {
        vulnerabilityId: 'marcus_first_loss',
        strengthId: 'marcus_care_wisdom',
        transformationDialogue: [
          '*Marcus stops counting for a moment*',
          'I used to think I failed Elena because I couldn\'t save her.',
          'But I was there. Every day for eleven months.',
          'She knew she wasn\'t alone.',
          '*He looks at his hands*',
          'Maybe that\'s not failure. Maybe that\'s exactly what care looks like.',
          'Being there until you can\'t be anymore.'
        ],
        conditions: {
          trustMin: 8,
          requiredFlags: ['knows_marcus_first_patient', 'marcus_helped_player']
        },
        result: {
          globalFlagsSet: ['marcus_transformation_complete', 'marcus_peace_with_elena']
        }
      }
    ]
  },

  // ============================================
  // ROHAN - The Philosopher
  // ============================================
  rohan: {
    characterId: 'rohan',

    vulnerabilities: [
      {
        id: 'rohan_obsolescence_fear',
        topic: 'becoming_irrelevant',
        displayName: 'The Obsolescence',
        description: 'Rohan secretly fears that deep thinking will become obsolete in an algorithmic world.',

        triggerPhrases: [
          'old', 'outdated', 'useless', 'replace',
          'AI', 'algorithm', 'efficiency', 'obsolete'
        ],

        discoveryConditions: {
          trustMin: 4,
          patternRequirements: [{ pattern: 'exploring', min: 2 }]
        },

        responses: {
          earlyTrust: 'The question is always more interesting than the answer.',
          midTrust: 'Sometimes I wonder if anyone has time for questions anymore. Optimization doesn\'t pause for wisdom.',
          highTrust: 'What if I\'ve spent my life cultivating something no one needs? What if deep thought is a luxury humanity is about to decide it can\'t afford?'
        },

        rewards: {
          knowledgeFlag: 'knows_rohan_algorithm_fear',
          unlockedDialogueNodes: ['rohan_future_fear', 'rohan_wisdom_value'],
          trustBonus: 2
        }
      },

      {
        id: 'rohan_student_failure',
        topic: 'failed_to_reach',
        displayName: 'The One He Lost',
        description: 'Rohan had a brilliant student who chose algorithmic thinking and abandoned depth.',

        triggerPhrases: [
          'student', 'teach', 'failed', 'lost',
          'gave up', 'disappointed', 'abandoned'
        ],

        discoveryConditions: {
          trustMin: 6,
          requiredFlags: ['knows_rohan_algorithm_fear']
        },

        responses: {
          earlyTrust: '*adjusts a book on his shelf*',
          midTrust: 'I had a student once. Brilliant. She wrote the best questions I\'d ever read.',
          highTrust: 'She got a job optimizing ad placement. Said philosophy was "beautiful but impractical." I still have her dissertation. Unfinished. I keep wondering if I failed her somehow.'
        },

        rewards: {
          knowledgeFlag: 'knows_rohan_student',
          unlockedDialogueNodes: ['rohan_sarah', 'rohan_teaching_purpose'],
          trustBonus: 3
        }
      }
    ],

    strengths: [
      {
        id: 'rohan_deep_questioning',
        domain: 'finding_truth',
        displayName: 'The Deeper Question',
        description: 'Rohan can see past the surface to the real question underneath.',

        demonstrationTopics: ['meaning', 'purpose', 'truth', 'why'],

        revealConditions: {
          trustMin: 2
        },

        helpDialogue: {
          offerHelp: 'Before we answer, let\'s make sure we\'re asking the right question.',
          successFeedback: 'Now you\'re asking what matters.',
          recognitionResponse: 'The answer you need is often hiding in a question you haven\'t asked.'
        },

        ability: {
          id: 'rohan_questioning',
          name: 'Rohan\'s Inquiry',
          description: 'Rohan can help find the question beneath the question',
          usableInContexts: ['decision_clarity', 'meaning_exploration', 'truth_seeking']
        }
      },

      {
        id: 'rohan_wisdom_synthesis',
        domain: 'integrating_knowledge',
        displayName: 'The Long View',
        description: 'Rohan can connect your situation to centuries of human wisdom.',

        demonstrationTopics: ['history', 'patterns', 'wisdom', 'perspective'],

        revealConditions: {
          trustMin: 5,
          requiredFlags: ['knows_rohan_algorithm_fear']
        },

        helpDialogue: {
          offerHelp: 'This isn\'t new. Let me show you how others have faced it.',
          successFeedback: 'You\'re part of a conversation that\'s been going on for millennia.',
          recognitionResponse: 'Wisdom isn\'t about having answers. It\'s about knowing which questions have been asked before.'
        },

        ability: {
          id: 'rohan_wisdom',
          name: 'Rohan\'s Wisdom',
          description: 'Rohan can provide historical and philosophical perspective',
          usableInContexts: ['perspective_gaining', 'historical_context', 'wisdom_application']
        }
      }
    ],

    growthArcs: [
      {
        vulnerabilityId: 'rohan_student_failure',
        strengthId: 'rohan_wisdom_synthesis',
        transformationDialogue: [
          '*Rohan sets down Sarah\'s unfinished dissertation*',
          'I kept blaming myself for losing her.',
          'But the Stoics would remind me—',
          '*a wry smile*',
          'I can teach. I can inspire. I can\'t choose for anyone.',
          'Maybe Sarah needed to optimize ads for a while.',
          'Maybe she\'ll come back to the questions when she\'s ready.',
          'My job is to make sure the questions are still here when she does.'
        ],
        conditions: {
          trustMin: 8,
          requiredFlags: ['knows_rohan_student', 'rohan_helped_player']
        },
        result: {
          globalFlagsSet: ['rohan_transformation_complete', 'rohan_peace_with_sarah']
        }
      }
    ]
  },

  // ============================================
  // YAQUIN - The Nurturer
  // ============================================
  yaquin: {
    characterId: 'yaquin',

    vulnerabilities: [
      {
        id: 'yaquin_imposter_syndrome',
        topic: 'not_good_enough',
        displayName: 'Just an Assistant',
        description: 'Yaquin constantly minimizes her expertise and doubts her value.',

        triggerPhrases: [
          'expert', 'know', 'smart', 'qualified',
          'real', 'deserve', 'worthy', 'enough'
        ],

        discoveryConditions: {
          trustMin: 3,
          patternRequirements: [{ pattern: 'exploring', min: 2 }]
        },

        responses: {
          earlyTrust: 'Oh, I just help out. The real experts are...',
          midTrust: 'I know things, I guess. I just... I always feel like someone\'s about to catch me. Find out I don\'t really belong.',
          highTrust: 'Every time someone asks for my opinion, there\'s this voice: "Who are you to say? You\'re just..." I don\'t know when I started believing I was "just" anything.'
        },

        rewards: {
          knowledgeFlag: 'knows_yaquin_doubt',
          unlockedDialogueNodes: ['yaquin_self_doubt', 'yaquin_origins'],
          trustBonus: 2
        }
      },

      {
        id: 'yaquin_mother_voice',
        topic: 'inherited_fear',
        displayName: 'Mother\'s Warning',
        description: 'Yaquin\'s self-doubt traces back to her mother\'s protective fears.',

        triggerPhrases: [
          'family', 'mother', 'parents', 'grew up',
          'taught', 'learned', 'always been', 'childhood'
        ],

        discoveryConditions: {
          trustMin: 5,
          requiredFlags: ['knows_yaquin_doubt']
        },

        responses: {
          earlyTrust: '*adjusts her glasses nervously*',
          midTrust: 'My mom used to say "Don\'t aim too high, m\'ija." I thought she was being wise.',
          highTrust: 'She was scared. Her whole life, scared. Scared for herself, scared for me. And somewhere along the way, I inherited her fear and thought it was humility.'
        },

        rewards: {
          knowledgeFlag: 'knows_yaquin_mother',
          unlockedDialogueNodes: ['yaquin_family_story', 'yaquin_breaking_pattern'],
          trustBonus: 3
        }
      }
    ],

    strengths: [
      {
        id: 'yaquin_genuine_teaching',
        domain: 'making_complex_simple',
        displayName: 'The Gift of Clarity',
        description: 'Yaquin has an exceptional ability to make complex things understandable.',

        demonstrationTopics: ['explain', 'understand', 'learn', 'help'],

        revealConditions: {
          trustMin: 2
        },

        helpDialogue: {
          offerHelp: 'Let me try explaining it differently—',
          successFeedback: '*her eyes light up* You\'ve got it!',
          recognitionResponse: 'I just... I just see where people get stuck. That\'s all.'
        },

        ability: {
          id: 'yaquin_teaching',
          name: 'Yaquin\'s Teaching',
          description: 'Yaquin can break down complex concepts into understandable pieces',
          usableInContexts: ['learning_assistance', 'concept_clarification', 'skill_building']
        }
      },

      {
        id: 'yaquin_emotional_attunement',
        domain: 'sensing_needs',
        displayName: 'Quiet Perception',
        description: 'Yaquin notices what others need before they ask—sometimes before they know.',

        demonstrationTopics: ['feel', 'need', 'sense', 'notice'],

        revealConditions: {
          trustMin: 4,
          requiredFlags: ['knows_yaquin_doubt']
        },

        helpDialogue: {
          offerHelp: 'You seem like you need... here.',
          successFeedback: 'I could tell. It\'s okay.',
          recognitionResponse: 'I just pay attention. People tell you what they need if you listen.'
        },

        ability: {
          id: 'yaquin_attunement',
          name: 'Yaquin\'s Attunement',
          description: 'Yaquin can sense what someone needs emotionally or practically',
          usableInContexts: ['emotional_support', 'need_identification', 'care_planning']
        }
      }
    ],

    growthArcs: [
      {
        vulnerabilityId: 'yaquin_mother_voice',
        strengthId: 'yaquin_genuine_teaching',
        transformationDialogue: [
          '*Yaquin stands a little taller*',
          'I spent so long being careful. Being small. Not taking up space.',
          'But teaching isn\'t about being small.',
          '*she smiles, surprised*',
          'It\'s about making space for others to grow.',
          'Maybe my mom was wrong.',
          'Maybe I can aim high AND land soft.',
          'Maybe I already have.'
        ],
        conditions: {
          trustMin: 7,
          requiredFlags: ['knows_yaquin_mother', 'yaquin_helped_player']
        },
        result: {
          globalFlagsSet: ['yaquin_transformation_complete', 'yaquin_found_voice']
        }
      }
    ]
  },

  // ============================================
  // ELENA - The Architect
  // ============================================
  elena: {
    characterId: 'elena',
    vulnerabilities: [
      {
        id: 'elena_imperfect_creation',
        topic: 'perfectionism',
        displayName: 'The Flaw',
        description: 'Elena fears her best work is behind her.',
        triggerPhrases: ['perfect', 'flaw', 'mistake', 'broken'],
        discoveryConditions: { trustMin: 4 },
        responses: {
          earlyTrust: 'Nothing is ever perfect.',
          midTrust: 'I see the cracks in everything I build.',
          highTrust: 'What if I never make anything beautiful again?'
        },
        rewards: {
          knowledgeFlag: 'knows_elena_fear',
          trustBonus: 2
        }
      }
    ],
    strengths: [
      {
        id: 'elena_structure',
        domain: 'structural_integrity',
        displayName: 'Structural Vision',
        description: 'Elena sees how things hold together.',
        demonstrationTopics: ['stability', 'foundation', 'core'],
        helpDialogue: {
          offerHelp: 'Let me check the foundations.',
          successFeedback: 'Solid.',
          recognitionResponse: 'Structure is truth.'
        }
      }
    ],
    growthArcs: []
  },

  // ============================================
  // GRACE - The Mystic
  // ============================================
  grace: {
    characterId: 'grace',
    vulnerabilities: [
      {
        id: 'grace_compassion_fatigue',
        topic: 'exhaustion',
        displayName: 'The Weight of Care',
        description: 'Grace fears she has nothing left to give.',
        triggerPhrases: ['tired', 'rest', 'help', 'give'],
        discoveryConditions: { trustMin: 4 },
        responses: {
          earlyTrust: 'I am fine. Others need me.',
          midTrust: 'Sometimes the well runs dry.',
          highTrust: 'I pour myself out until there is nothing left. Who refills me?'
        },
        rewards: {
          knowledgeFlag: 'knows_grace_exhaustion',
          trustBonus: 2
        }
      }
    ],
    strengths: [
      {
        id: 'grace_empathy',
        domain: 'healing',
        displayName: 'Deep Empathy',
        description: 'Grace can heal emotional wounds.',
        demonstrationTopics: ['pain', 'healing', 'comfort'],
        helpDialogue: {
          offerHelp: 'Let me sit with you.',
          successFeedback: 'Peace returns.',
          recognitionResponse: 'To heal others is a gift.'
        }
      }
    ],
    growthArcs: []
  },

  // ============================================
  // ALEX - The Tactician
  // ============================================
  alex: {
    characterId: 'alex',
    vulnerabilities: [
      {
        id: 'alex_blind_loyalty',
        topic: 'orders',
        displayName: 'The Soldier\'s Dilemma',
        description: 'Alex fears thinking for himself.',
        triggerPhrases: ['orders', 'command', 'decide', 'choice'],
        discoveryConditions: { trustMin: 4 },
        responses: {
          earlyTrust: 'Just following protocol.',
          midTrust: 'It\'s easier when someone else decides.',
          highTrust: 'If I choose, I might choose wrong. If I follow, the mistake isn\'t mine.'
        },
        rewards: {
          knowledgeFlag: 'knows_alex_doubt',
          trustBonus: 2
        }
      }
    ],
    strengths: [
      {
        id: 'alex_tactics',
        domain: 'strategy',
        displayName: 'Tactical Mind',
        description: 'Alex sees the threats before they happen.',
        demonstrationTopics: ['danger', 'plan', 'defense'],
        helpDialogue: {
          offerHelp: 'I got your six.',
          successFeedback: 'threat neutralized.',
          recognitionResponse: 'Vigilance is survival.'
        }
      }
    ],
    growthArcs: []
  },

  // ============================================
  // ASHA - The Visionary
  // ============================================
  asha: {
    characterId: 'asha',
    vulnerabilities: [
      {
        id: 'asha_reality_disconnect',
        topic: 'madness',
        displayName: 'The Edge of Reality',
        description: 'Asha fears her visions are just delusions.',
        triggerPhrases: ['real', 'vision', 'dream', 'crazy'],
        discoveryConditions: { trustMin: 4 },
        responses: {
          earlyTrust: 'You wouldn\'t understand.',
          midTrust: 'It\'s so clear to me. Why can\'t others see it?',
          highTrust: 'Sometimes I wonder if I\'m seeing the future, or just losing my mind.'
        },
        rewards: {
          knowledgeFlag: 'knows_asha_fear',
          trustBonus: 2
        }
      }
    ],
    strengths: [
      {
        id: 'asha_inspiration',
        domain: 'vision',
        displayName: 'Pure Vision',
        description: 'Asha can see what could be.',
        demonstrationTopics: ['future', 'possibility', 'dream'],
        helpDialogue: {
          offerHelp: 'Look closer. See the potential.',
          successFeedback: 'Now you see.',
          recognitionResponse: 'The future is waiting.'
        }
      }
    ],
    growthArcs: []
  },

  // ============================================
  // SILAS - The Maintainer
  // ============================================
  silas: {
    characterId: 'silas',
    vulnerabilities: [
      {
        id: 'silas_obsolescence',
        topic: 'useless',
        displayName: 'Rust',
        description: 'Silas fears being replaced by something newer.',
        triggerPhrases: ['new', 'replace', 'old', 'broken'],
        discoveryConditions: { trustMin: 4 },
        responses: {
          earlyTrust: 'Still got some miles in me.',
          midTrust: 'They don\'t make \'em like they used to.',
          highTrust: 'One day, I\'ll be the junk I\'m sweeping up. Just... scrap.'
        },
        rewards: {
          knowledgeFlag: 'knows_silas_fear',
          trustBonus: 2
        }
      }
    ],
    strengths: [
      {
        id: 'silas_maintenance',
        domain: 'repair',
        displayName: 'The Fixer',
        description: 'Silas can fix anything broken.',
        demonstrationTopics: ['broken', 'fix', 'repair'],
        helpDialogue: {
          offerHelp: 'Give it here. I\'ll sort it.',
          successFeedback: 'Good as new.',
          recognitionResponse: 'Everything can be fixed.'
        }
      }
    ],
    growthArcs: []
  },

  // ============================================
  // LIRA - The Listener
  // ============================================
  lira: {
    characterId: 'lira',
    vulnerabilities: [
      {
        id: 'lira_lost_voice',
        topic: 'silence',
        displayName: 'The Muted Song',
        description: 'Lira fears her voice has no power.',
        triggerPhrases: ['sing', 'speak', 'heard', 'listen'],
        discoveryConditions: { trustMin: 4 },
        responses: {
          earlyTrust: 'I prefer to listen.',
          midTrust: 'My songs are small. Quiet.',
          highTrust: 'I tried to sing once. No one listened. So I stopped.'
        },
        rewards: {
          knowledgeFlag: 'knows_lira_silence',
          trustBonus: 2
        }
      }
    ],
    strengths: [
      {
        id: 'lira_harmony',
        domain: 'connection',
        displayName: 'Harmonic Resonance',
        description: 'Lira hears the truth in silence.',
        demonstrationTopics: ['listen', 'hear', 'understand'],
        helpDialogue: {
          offerHelp: 'Listen closely.',
          successFeedback: 'You hear it now.',
          recognitionResponse: 'The world is music.'
        }
      }
    ],
    growthArcs: []
  },

  // ============================================
  // ZARA - The Analyst
  // ============================================
  zara: {
    characterId: 'zara',
    vulnerabilities: [
      {
        id: 'zara_uncertainty',
        topic: 'chaos',
        displayName: 'The Variable',
        description: 'Zara fears what cannot be calculated.',
        triggerPhrases: ['unknown', 'random', 'chaos', 'guess'],
        discoveryConditions: { trustMin: 4 },
        responses: {
          earlyTrust: 'There is always a probability.',
          midTrust: 'Outliers are... disturbing.',
          highTrust: 'I can calculate everything except why. Why are we here? There is no formula for that.'
        },
        rewards: {
          knowledgeFlag: 'knows_zara_fear',
          trustBonus: 2
        }
      }
    ],
    strengths: [
      {
        id: 'zara_prediction',
        domain: 'analysis',
        displayName: 'Predictive Logic',
        description: 'Zara sees the likely outcome.',
        demonstrationTopics: ['outcome', 'result', 'future'],
        helpDialogue: {
          offerHelp: 'Let me run the numbers.',
          successFeedback: 'The data holds.',
          recognitionResponse: 'Logic is safety.'
        }
      }
    ],
    growthArcs: []
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
