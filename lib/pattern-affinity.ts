/**
 * Pattern-Character Affinity System
 * Certain patterns resonate with certain characters, affecting trust gain rates
 *
 * Design Philosophy:
 * - Resonance feels like discovering a kindred spirit, not gaming a system
 * - Friction patterns create interesting TENSION, not lockouts
 * - Players discover affinities through NPC dialogue, not UI meters
 * - This honors the "silent tracking, feel comes first" principle
 */

import { PatternType, PATTERN_TYPES, getDominantPattern } from './patterns'

/**
 * Affinity levels determine trust multipliers
 */
export type AffinityLevel = 'primary' | 'secondary' | 'neutral' | 'friction'

/**
 * Pattern affinity configuration for a character
 */
export interface CharacterPatternAffinity {
  characterId: string
  primary: PatternType           // +50% trust gain - deep resonance
  secondary: PatternType         // +25% trust gain - natural fit
  neutral: PatternType[]         // Standard trust gain
  friction: PatternType          // -25% trust gain - productive tension (NOT blocked)

  // Resonance descriptions (for consequence echoes)
  resonanceDescriptions: {
    pattern: PatternType
    description: string          // Why this pattern resonates/creates friction
  }[]

  // Special dialogue unlocks at high pattern levels
  patternUnlocks?: {
    pattern: PatternType
    threshold: number            // Orb fill percentage (0-100)
    unlockedNodeId: string       // Special dialogue that unlocks
    description: string          // What this unlock represents
  }[]
}

/**
 * Trust multipliers for each affinity level
 */
export const AFFINITY_MULTIPLIERS: Record<AffinityLevel, number> = {
  primary: 1.5,     // +50% trust gain
  secondary: 1.25,  // +25% trust gain
  neutral: 1.0,     // Standard
  friction: 0.75    // -25% trust gain (tension, NOT blocked)
}

/**
 * All character pattern affinities
 * Starting with Maya as proof of concept
 */
export const CHARACTER_PATTERN_AFFINITIES: Record<string, CharacterPatternAffinity> = {
  maya: {
    characterId: 'maya',
    primary: 'building',        // Maya connects with fellow makers
    secondary: 'analytical',    // She respects systematic thinking
    neutral: ['patience', 'exploring'],
    friction: 'helping',        // She bristles at being "helped" - wants autonomy

    resonanceDescriptions: [
      {
        pattern: 'building',
        description: 'Maya sees a kindred maker spirit in you. Her eyes light up when you talk about creating things.'
      },
      {
        pattern: 'analytical',
        description: 'Your systematic thinking reminds Maya of how she approaches robotics problems.'
      },
      {
        pattern: 'patience',
        description: 'Maya appreciates that you don\'t rush her, even if she\'s not sure what to do with that kindness.'
      },
      {
        pattern: 'exploring',
        description: 'Your curiosity opens doors Maya didn\'t know existed.'
      },
      {
        pattern: 'helping',
        description: 'Maya tenses slightly. She\'s spent her whole life being helped into a box she didn\'t choose.'
      }
    ],

    patternUnlocks: [
      {
        pattern: 'building',
        threshold: 40,
        unlockedNodeId: 'maya_workshop_invitation',
        description: 'Maya invites you to see her secret workshop'
      },
      {
        pattern: 'building',
        threshold: 70,
        unlockedNodeId: 'maya_collaboration_offer',
        description: 'Maya asks for your help on a robotics project'
      },
      {
        pattern: 'analytical',
        threshold: 50,
        unlockedNodeId: 'maya_technical_deep_dive',
        description: 'Maya shares the technical details she usually hides'
      }
    ]
  },

  // Additional characters will be added after Maya proves the system
  // Showing structure for reference:
  samuel: {
    characterId: 'samuel',
    primary: 'patience',         // Samuel values those who listen and wait
    secondary: 'helping',        // He appreciates those who help others
    neutral: ['analytical', 'exploring'],
    friction: 'building',        // He's wary of those who want to "fix" everything fast

    resonanceDescriptions: [
      {
        pattern: 'patience',
        description: 'Samuel nods slowly. You understand that some things can\'t be rushed.'
      },
      {
        pattern: 'helping',
        description: 'Samuel recognizes a fellow guide in you.'
      },
      {
        pattern: 'analytical',
        description: 'Samuel appreciates your thoughtfulness, even if he sees things differently.'
      },
      {
        pattern: 'exploring',
        description: 'Your curiosity reminds Samuel of his younger self.'
      },
      {
        pattern: 'building',
        description: 'Samuel watches carefully. Not everything needs to be fixed immediately.'
      }
    ],

    patternUnlocks: []
  },

  devon: {
    characterId: 'devon',
    primary: 'analytical',       // Devon connects with systematic thinkers
    secondary: 'building',       // He respects those who make things
    neutral: ['patience', 'exploring'],
    friction: 'helping',         // Direct emotional support makes him uncomfortable

    resonanceDescriptions: [
      {
        pattern: 'analytical',
        description: 'Devon\'s posture relaxes. You speak his language.'
      },
      {
        pattern: 'building',
        description: 'Devon respects that you understand making things.'
      },
      {
        pattern: 'patience',
        description: 'Devon appreciates that you don\'t push for immediate answers.'
      },
      {
        pattern: 'exploring',
        description: 'Your questions make Devon think in new ways.'
      },
      {
        pattern: 'helping',
        description: 'Devon shifts uncomfortably. He prefers systems to sentiment.'
      }
    ],

    patternUnlocks: [
      {
        pattern: 'analytical',
        threshold: 40,
        unlockedNodeId: 'devon_optimization_trap',
        description: 'Devon reflects on his optimization habits'
      },
      {
        pattern: 'patience',
        threshold: 60,
        unlockedNodeId: 'devon_father_reveal',
        description: 'Devon opens up about his father'
      }
    ]
  },

  tess: {
    characterId: 'tess',
    primary: 'building',         // Tess respects creators and makers
    secondary: 'analytical',     // She appreciates those who dig deep
    neutral: ['patience', 'helping'],
    friction: 'exploring',       // Surface curiosity without depth annoys her

    resonanceDescriptions: [
      {
        pattern: 'building',
        description: 'Tess sees a fellow creator in you. The record flipping slows.'
      },
      {
        pattern: 'analytical',
        description: 'Tess respects that you want to understand, not just consume.'
      },
      {
        pattern: 'patience',
        description: 'Tess notices you don\'t rush. Good. The real stuff takes time.'
      },
      {
        pattern: 'helping',
        description: 'Tess wonders if you actually want to help or just feel helpful.'
      },
      {
        pattern: 'exploring',
        description: 'Tess\'s eyes narrow slightly. Curiosity without commitment is tourism.'
      }
    ],

    patternUnlocks: [
      {
        pattern: 'building',
        threshold: 50,
        unlockedNodeId: 'tess_demo_tape_story',
        description: 'Tess tells you about the demo tape that changed her life'
      },
      {
        pattern: 'analytical',
        threshold: 40,
        unlockedNodeId: 'tess_industry_truth',
        description: 'Tess shares her unfiltered views on the music industry'
      }
    ]
  },

  marcus: {
    characterId: 'marcus',
    primary: 'helping',          // Marcus values those who care for others
    secondary: 'patience',       // He respects measured, calm approaches
    neutral: ['exploring', 'building'],
    friction: 'analytical',      // Pure logic feels cold to him

    resonanceDescriptions: [
      {
        pattern: 'helping',
        description: 'Marcus recognizes compassion in you. His measured manner warms.'
      },
      {
        pattern: 'patience',
        description: 'Marcus appreciates that you don\'t rush. Lives depend on getting it right.'
      },
      {
        pattern: 'exploring',
        description: 'Marcus finds your curiosity refreshing—not everyone asks.'
      },
      {
        pattern: 'building',
        description: 'Marcus respects makers. The machines he tends were built by someone.'
      },
      {
        pattern: 'analytical',
        description: 'Marcus stiffens slightly. Numbers are important, but people aren\'t data.'
      }
    ],

    patternUnlocks: [
      {
        pattern: 'helping',
        threshold: 40,
        unlockedNodeId: 'marcus_first_patient_story',
        description: 'Marcus shares the story of his first patient'
      },
      {
        pattern: 'patience',
        threshold: 50,
        unlockedNodeId: 'marcus_night_shift_wisdom',
        description: 'Marcus opens up about what the night shifts taught him'
      }
    ]
  },

  rohan: {
    characterId: 'rohan',
    primary: 'patience',         // Rohan values deep thought over quick answers
    secondary: 'exploring',      // He appreciates genuine curiosity
    neutral: ['analytical', 'building'],
    friction: 'helping',         // He distrusts those who want to "save" people

    resonanceDescriptions: [
      {
        pattern: 'patience',
        description: 'Rohan\'s intensity softens. You understand that truth takes time.'
      },
      {
        pattern: 'exploring',
        description: 'Rohan sees genuine curiosity in you, not just surface interest.'
      },
      {
        pattern: 'analytical',
        description: 'Rohan appreciates systematic thinking, even if he questions its limits.'
      },
      {
        pattern: 'building',
        description: 'Rohan respects creation, though he wonders what gets lost in progress.'
      },
      {
        pattern: 'helping',
        description: 'Rohan\'s guard goes up. He\'s seen how "help" can become control.'
      }
    ],

    patternUnlocks: [
      {
        pattern: 'patience',
        threshold: 50,
        unlockedNodeId: 'rohan_algorithm_warning',
        description: 'Rohan shares his fears about algorithmic thinking'
      },
      {
        pattern: 'exploring',
        threshold: 60,
        unlockedNodeId: 'rohan_philosophy_deep',
        description: 'Rohan engages you in genuine philosophical dialogue'
      }
    ]
  },

  yaquin: {
    characterId: 'yaquin',
    primary: 'exploring',        // Yaquin connects with curious minds
    secondary: 'patience',       // She values those who take time to understand
    neutral: ['helping', 'analytical'],
    friction: 'building',        // "Move fast and build things" overwhelms her

    resonanceDescriptions: [
      {
        pattern: 'exploring',
        description: 'Yaquin\'s eyes light up. A fellow curious soul.'
      },
      {
        pattern: 'patience',
        description: 'Yaquin relaxes. You don\'t rush her, and she appreciates that.'
      },
      {
        pattern: 'helping',
        description: 'Yaquin appreciates kindness, though she\'s still learning to accept it.'
      },
      {
        pattern: 'analytical',
        description: 'Yaquin finds your thoughtfulness grounding.'
      },
      {
        pattern: 'building',
        description: 'Yaquin feels a little overwhelmed. Not everyone moves at builder speed.'
      }
    ],

    patternUnlocks: [
      {
        pattern: 'exploring',
        threshold: 40,
        unlockedNodeId: 'yaquin_teaching_passion',
        description: 'Yaquin shares why she loves teaching'
      },
      {
        pattern: 'patience',
        threshold: 50,
        unlockedNodeId: 'yaquin_doubt_confession',
        description: 'Yaquin confesses her private doubts'
      }
    ]
  },

  jordan: {
    characterId: 'jordan',
    primary: 'exploring',        // Jordan helps people discover their paths
    secondary: 'helping',        // Naturally supportive, validates others' journeys
    neutral: ['building', 'patience'],
    friction: 'analytical',      // Pure logic misses the human element of career choices

    resonanceDescriptions: [
      {
        pattern: 'exploring',
        description: 'Jordan lights up. You\'re a fellow seeker—someone who understands that paths aren\'t straight lines.'
      },
      {
        pattern: 'helping',
        description: 'Jordan recognizes a kindred spirit. Someone who sees people, not just problems.'
      },
      {
        pattern: 'building',
        description: 'Jordan respects your drive to create. That energy can move mountains.'
      },
      {
        pattern: 'patience',
        description: 'Jordan appreciates that you don\'t rush. Good decisions need room to breathe.'
      },
      {
        pattern: 'analytical',
        description: 'Jordan\'s smile tightens slightly. Not everything can be optimized. Some things you just have to feel.'
      }
    ],

    patternUnlocks: [
      {
        pattern: 'exploring',
        threshold: 40,
        unlockedNodeId: 'jordan_seven_jobs_story',
        description: 'Jordan opens up about their seven jobs in four years'
      },
      {
        pattern: 'helping',
        threshold: 50,
        unlockedNodeId: 'jordan_impostor_reveal',
        description: 'Jordan confides about their impostor syndrome'
      },
      {
        pattern: 'exploring',
        threshold: 70,
        unlockedNodeId: 'jordan_unexpected_paths',
        description: 'Jordan shares the crossroads moment that changed everything'
      }
    ]
  },

  kai: {
    characterId: 'kai',
    primary: 'building',         // Kai creates safety systems, proactive protection
    secondary: 'analytical',     // Critical thinking, risk assessment
    neutral: ['helping', 'exploring'],
    friction: 'patience',        // In crisis, waiting can cost lives

    resonanceDescriptions: [
      {
        pattern: 'building',
        description: 'Kai nods approvingly. You understand that safety is built, not found.'
      },
      {
        pattern: 'analytical',
        description: 'Kai\'s posture shifts—you speak the language of risk assessment.'
      },
      {
        pattern: 'helping',
        description: 'Kai recognizes your care for others. That\'s the heart of the work.'
      },
      {
        pattern: 'exploring',
        description: 'Kai appreciates your curiosity, though some doors are closed for good reason.'
      },
      {
        pattern: 'patience',
        description: 'Kai\'s jaw tightens. "Sometimes waiting is the most dangerous choice."'
      }
    ],

    patternUnlocks: [
      {
        pattern: 'building',
        threshold: 40,
        unlockedNodeId: 'kai_safety_protocol_story',
        description: 'Kai shows you a safety protocol they designed'
      },
      {
        pattern: 'analytical',
        threshold: 50,
        unlockedNodeId: 'kai_risk_matrix',
        description: 'Kai explains how they think about risk'
      },
      {
        pattern: 'building',
        threshold: 70,
        unlockedNodeId: 'kai_prevention_philosophy',
        description: 'Kai shares their philosophy of prevention over reaction'
      }
    ]
  },

  alex: {
    characterId: 'alex',
    primary: 'exploring',        // Alex experiments, tries new approaches
    secondary: 'building',       // Creates, makes things happen
    neutral: ['analytical', 'helping'],
    friction: 'patience',        // Prefers action to waiting

    resonanceDescriptions: [
      {
        pattern: 'exploring',
        description: 'Alex grins. A fellow adventurer. Someone who asks "what if?"'
      },
      {
        pattern: 'building',
        description: 'Alex respects your maker energy. Talk is cheap—you actually build.'
      },
      {
        pattern: 'analytical',
        description: 'Alex appreciates your thinking, even if they prefer to learn by doing.'
      },
      {
        pattern: 'helping',
        description: 'Alex softens. They don\'t always know what to do with kindness.'
      },
      {
        pattern: 'patience',
        description: 'Alex shifts restlessly. "Life\'s too short to wait for the perfect moment."'
      }
    ],

    patternUnlocks: [
      {
        pattern: 'exploring',
        threshold: 40,
        unlockedNodeId: 'alex_creative_process',
        description: 'Alex shows you how they approach creative problems'
      },
      {
        pattern: 'building',
        threshold: 50,
        unlockedNodeId: 'alex_first_project',
        description: 'Alex tells you about their first real project'
      }
    ]
  },

  silas: {
    characterId: 'silas',
    primary: 'analytical',       // Systems thinker, sees the patterns in crisis
    secondary: 'patience',       // Deliberate, doesn\'t panic
    neutral: ['building', 'exploring'],
    friction: 'helping',         // Has seen "help" become exploitation in crisis

    resonanceDescriptions: [
      {
        pattern: 'analytical',
        description: 'Silas\'s guarded expression eases. You see the systems, not just the symptoms.'
      },
      {
        pattern: 'patience',
        description: 'Silas respects your steadiness. Panic helps no one.'
      },
      {
        pattern: 'building',
        description: 'Silas appreciates makers—people who do more than diagnose.'
      },
      {
        pattern: 'exploring',
        description: 'Silas watches your curiosity with interest. Just be careful where it leads.'
      },
      {
        pattern: 'helping',
        description: 'Silas\'s walls go up. "I\'ve seen too many helpers who helped themselves first."'
      }
    ],

    patternUnlocks: [
      {
        pattern: 'analytical',
        threshold: 40,
        unlockedNodeId: 'silas_systems_breakdown',
        description: 'Silas explains how systems fail in crisis'
      },
      {
        pattern: 'patience',
        threshold: 50,
        unlockedNodeId: 'silas_farm_story',
        description: 'Silas opens up about the farm crisis'
      },
      {
        pattern: 'analytical',
        threshold: 70,
        unlockedNodeId: 'silas_triage_philosophy',
        description: 'Silas shares their philosophy of triage and hard choices'
      }
    ]
  },

  grace: {
    characterId: 'grace',
    primary: 'helping',           // Healthcare operations = caring for systems and people
    secondary: 'analytical',      // Operations requires systematic thinking
    neutral: ['patience', 'building'],
    friction: 'exploring',        // Healthcare needs stability, not constant experimentation

    resonanceDescriptions: [
      {
        pattern: 'helping',
        description: 'Grace recognizes a fellow caregiver. Her professional warmth becomes genuine warmth.'
      },
      {
        pattern: 'analytical',
        description: 'Grace appreciates your systematic approach. Healthcare runs on good systems.'
      },
      {
        pattern: 'patience',
        description: 'Grace nods approvingly. Medicine requires patience with processes and people.'
      },
      {
        pattern: 'building',
        description: 'Grace sees potential in your constructive approach to problems.'
      },
      {
        pattern: 'exploring',
        description: 'Grace hesitates. In healthcare, too much experimentation can hurt people.'
      }
    ],

    patternUnlocks: [
      {
        pattern: 'helping',
        threshold: 40,
        unlockedNodeId: 'grace_patient_stories',
        description: 'Grace shares stories from her years in healthcare'
      },
      {
        pattern: 'analytical',
        threshold: 50,
        unlockedNodeId: 'grace_systems_insight',
        description: 'Grace explains the hidden systems that make hospitals work'
      }
    ]
  },

  asha: {
    characterId: 'asha',
    primary: 'patience',          // Mediation requires deep patience
    secondary: 'helping',         // Conflict resolution is fundamentally about helping
    neutral: ['exploring', 'analytical'],
    friction: 'building',         // Sometimes building means taking sides

    resonanceDescriptions: [
      {
        pattern: 'patience',
        description: 'Asha\'s eyes soften. "You understand that some things can\'t be rushed."'
      },
      {
        pattern: 'helping',
        description: 'Asha senses your genuine care for others. That\'s the foundation of her work.'
      },
      {
        pattern: 'exploring',
        description: 'Asha appreciates your curiosity about different perspectives.'
      },
      {
        pattern: 'analytical',
        description: 'Asha values your ability to see patterns in conflict.'
      },
      {
        pattern: 'building',
        description: 'Asha tenses slightly. "Building requires choosing materials. Mediation requires holding space for all of them."'
      }
    ],

    patternUnlocks: [
      {
        pattern: 'patience',
        threshold: 40,
        unlockedNodeId: 'asha_mediation_philosophy',
        description: 'Asha shares her philosophy of conflict resolution'
      },
      {
        pattern: 'helping',
        threshold: 50,
        unlockedNodeId: 'asha_hardest_case',
        description: 'Asha tells you about the hardest conflict she ever mediated'
      }
    ]
  },

  lira: {
    characterId: 'lira',
    primary: 'exploring',         // Sound design is about discovering new sonic territories
    secondary: 'building',        // Creating soundscapes requires construction skills
    neutral: ['analytical', 'patience'],
    friction: 'helping',          // Lira creates for expression, not service

    resonanceDescriptions: [
      {
        pattern: 'exploring',
        description: 'Lira\'s energy rises. "You hear it too, don\'t you? The sounds no one else notices."'
      },
      {
        pattern: 'building',
        description: 'Lira appreciates your maker spirit. Sound design is architecture in time.'
      },
      {
        pattern: 'analytical',
        description: 'Lira respects your attention to detail. Frequencies don\'t lie.'
      },
      {
        pattern: 'patience',
        description: 'Lira nods. Good sound design requires waiting for the right moment.'
      },
      {
        pattern: 'helping',
        description: 'Lira pulls back slightly. "I create because I must, not because someone asked."'
      }
    ],

    patternUnlocks: [
      {
        pattern: 'exploring',
        threshold: 40,
        unlockedNodeId: 'lira_sound_studio',
        description: 'Lira invites you to experience her sound studio'
      },
      {
        pattern: 'building',
        threshold: 50,
        unlockedNodeId: 'lira_collaboration',
        description: 'Lira proposes a creative collaboration'
      }
    ]
  },

  zara: {
    characterId: 'zara',
    primary: 'analytical',        // Data ethics requires rigorous analysis
    secondary: 'exploring',       // Art requires exploration and experimentation
    neutral: ['patience', 'helping'],
    friction: 'building',         // Zara questions what we build and why

    resonanceDescriptions: [
      {
        pattern: 'analytical',
        description: 'Zara leans in. "You ask the right questions. Most people just accept the data."'
      },
      {
        pattern: 'exploring',
        description: 'Zara smiles. Your curiosity mirrors her artistic investigations.'
      },
      {
        pattern: 'patience',
        description: 'Zara appreciates your thoughtfulness. Ethics isn\'t about quick answers.'
      },
      {
        pattern: 'helping',
        description: 'Zara sees your care for others. That\'s why data ethics matters.'
      },
      {
        pattern: 'building',
        description: 'Zara\'s expression becomes guarded. "Building without ethics is how we got here."'
      }
    ],

    patternUnlocks: [
      {
        pattern: 'analytical',
        threshold: 40,
        unlockedNodeId: 'zara_ethics_framework',
        description: 'Zara shares her framework for thinking about data ethics'
      },
      {
        pattern: 'exploring',
        threshold: 50,
        unlockedNodeId: 'zara_art_meaning',
        description: 'Zara explains how her art explores ethical questions'
      }
    ]
  },

  quinn: {
    characterId: 'quinn',
    primary: 'analytical',        // Finance requires rigorous number-crunching
    secondary: 'patience',        // Markets reward those who wait
    neutral: ['building', 'exploring'],
    friction: 'helping',          // Quinn believes in self-reliance over handouts

    resonanceDescriptions: [
      {
        pattern: 'analytical',
        description: 'Quinn\'s quills settle. You speak the language of numbers and risk.'
      },
      {
        pattern: 'patience',
        description: 'Quinn respects your willingness to wait for the right opportunity.'
      },
      {
        pattern: 'building',
        description: 'Quinn sees value in your constructive approach. Building wealth is building, after all.'
      },
      {
        pattern: 'exploring',
        description: 'Quinn finds your curiosity interesting—diversification starts with exploration.'
      },
      {
        pattern: 'helping',
        description: 'Quinn bristles slightly. "Charity is admirable, but it doesn\'t compound."'
      }
    ],

    patternUnlocks: [
      {
        pattern: 'analytical',
        threshold: 40,
        unlockedNodeId: 'quinn_risk_assessment',
        description: 'Quinn shares their personal risk assessment framework'
      },
      {
        pattern: 'patience',
        threshold: 50,
        unlockedNodeId: 'quinn_long_game',
        description: 'Quinn reveals the long game strategy most people miss'
      }
    ]
  },

  dante: {
    characterId: 'dante',
    primary: 'exploring',         // Sales is about discovering what people need
    secondary: 'building',        // Building relationships and pipelines
    neutral: ['helping', 'analytical'],
    friction: 'patience',         // Dante thrives on momentum, not waiting

    resonanceDescriptions: [
      {
        pattern: 'exploring',
        description: 'Dante\'s feathers practically shimmer. "You get it—every conversation is a door."'
      },
      {
        pattern: 'building',
        description: 'Dante respects your drive to create. Sales is architecture with people.'
      },
      {
        pattern: 'helping',
        description: 'Dante sees your empathy. The best salespeople genuinely care.'
      },
      {
        pattern: 'analytical',
        description: 'Dante nods at your precision. Data drives the modern deal.'
      },
      {
        pattern: 'patience',
        description: 'Dante shifts impatiently. "Timing matters, but waiting too long kills the deal."'
      }
    ],

    patternUnlocks: [
      {
        pattern: 'exploring',
        threshold: 40,
        unlockedNodeId: 'dante_million_dollar_lesson',
        description: 'Dante tells you about the deal that taught them everything'
      },
      {
        pattern: 'building',
        threshold: 50,
        unlockedNodeId: 'dante_relationship_map',
        description: 'Dante shares how they map relationships strategically'
      }
    ]
  },

  nadia: {
    characterId: 'nadia',
    primary: 'analytical',        // AI strategy demands deep analytical thinking
    secondary: 'exploring',       // Innovation requires curiosity
    neutral: ['building', 'patience'],
    friction: 'helping',          // Nadia is wary of AI "helping" without understanding consequences

    resonanceDescriptions: [
      {
        pattern: 'analytical',
        description: 'Nadia\'s owl-like gaze sharpens with approval. You think in systems.'
      },
      {
        pattern: 'exploring',
        description: 'Nadia appreciates your curiosity. AI reveals itself to those who question.'
      },
      {
        pattern: 'building',
        description: 'Nadia respects your maker instinct. AI needs builders, not just theorists.'
      },
      {
        pattern: 'patience',
        description: 'Nadia nods. AI strategy is a long game most people don\'t have the patience for.'
      },
      {
        pattern: 'helping',
        description: 'Nadia\'s expression cools. "The most dangerous AI is the one built to \'help\' without understanding."'
      }
    ],

    patternUnlocks: [
      {
        pattern: 'analytical',
        threshold: 40,
        unlockedNodeId: 'nadia_ai_framework',
        description: 'Nadia shares her framework for evaluating AI opportunities'
      },
      {
        pattern: 'exploring',
        threshold: 50,
        unlockedNodeId: 'nadia_future_vision',
        description: 'Nadia reveals her vision for AI\'s transformative potential'
      }
    ]
  },

  isaiah: {
    characterId: 'isaiah',
    primary: 'helping',           // Nonprofit leadership is service-driven
    secondary: 'building',        // Building organizations and communities
    neutral: ['patience', 'exploring'],
    friction: 'analytical',       // Pure metrics miss the human impact

    resonanceDescriptions: [
      {
        pattern: 'helping',
        description: 'Isaiah\'s steady presence warms. You understand that service is strength.'
      },
      {
        pattern: 'building',
        description: 'Isaiah respects your drive to construct something lasting.'
      },
      {
        pattern: 'patience',
        description: 'Isaiah appreciates your steadiness. Change takes generations, not quarters.'
      },
      {
        pattern: 'exploring',
        description: 'Isaiah values your curiosity about how communities actually work.'
      },
      {
        pattern: 'analytical',
        description: 'Isaiah\'s gaze becomes careful. "Impact can\'t always be measured in spreadsheets."'
      }
    ],

    patternUnlocks: [
      {
        pattern: 'helping',
        threshold: 40,
        unlockedNodeId: 'isaiah_community_story',
        description: 'Isaiah shares the community story that shaped his mission'
      },
      {
        pattern: 'building',
        threshold: 50,
        unlockedNodeId: 'isaiah_organization_vision',
        description: 'Isaiah reveals his vision for building lasting nonprofit infrastructure'
      }
    ]
  },

  elena: {
    characterId: 'elena',
    primary: 'patience',          // Archives require patience and preservation
    secondary: 'analytical',      // Information science is deeply analytical
    neutral: ['exploring', 'helping'],
    friction: 'building',         // Elena preserves; building can mean destroying the old

    resonanceDescriptions: [
      {
        pattern: 'patience',
        description: 'Elena relaxes. "You understand that some knowledge reveals itself slowly."'
      },
      {
        pattern: 'analytical',
        description: 'Elena\'s eyes light up. Your systematic thinking mirrors her cataloging mind.'
      },
      {
        pattern: 'exploring',
        description: 'Elena appreciates your curiosity. Archives reward the persistent searcher.'
      },
      {
        pattern: 'helping',
        description: 'Elena sees your desire to serve. Archivists serve the future.'
      },
      {
        pattern: 'building',
        description: 'Elena grows cautious. "New construction often buries what came before."'
      }
    ],

    patternUnlocks: [
      {
        pattern: 'patience',
        threshold: 40,
        unlockedNodeId: 'elena_rare_collection',
        description: 'Elena shows you the rare collection few people see'
      },
      {
        pattern: 'analytical',
        threshold: 50,
        unlockedNodeId: 'elena_hidden_connections',
        description: 'Elena reveals hidden connections in the archive\'s history'
      }
    ]
  }
}

/**
 * Get the affinity level between a player's pattern and a character
 */
export function getPatternAffinityLevel(
  characterId: string,
  pattern: PatternType
): AffinityLevel {
  const affinity = CHARACTER_PATTERN_AFFINITIES[characterId]
  if (!affinity) return 'neutral'

  if (affinity.primary === pattern) return 'primary'
  if (affinity.secondary === pattern) return 'secondary'
  if (affinity.friction === pattern) return 'friction'
  return 'neutral'
}

/**
 * Get the trust multiplier for a character based on player's dominant pattern
 */
export function getTrustMultiplier(
  characterId: string,
  dominantPattern: PatternType | null
): number {
  if (!dominantPattern) return 1.0

  const affinityLevel = getPatternAffinityLevel(characterId, dominantPattern)
  return AFFINITY_MULTIPLIERS[affinityLevel]
}

/**
 * Get the resonance description for a pattern-character pair
 */
export function getResonanceDescription(
  characterId: string,
  pattern: PatternType
): string | null {
  const affinity = CHARACTER_PATTERN_AFFINITIES[characterId]
  if (!affinity) return null

  const resonance = affinity.resonanceDescriptions.find(r => r.pattern === pattern)
  return resonance?.description || null
}

/**
 * Get pattern-based dialogue unlocks for a character
 */
export function getPatternUnlocks(
  characterId: string,
  patternLevels: Record<PatternType, number>  // Orb fill percentages
): string[] {
  const affinity = CHARACTER_PATTERN_AFFINITIES[characterId]
  if (!affinity?.patternUnlocks) return []

  return affinity.patternUnlocks
    .filter(unlock => patternLevels[unlock.pattern] >= unlock.threshold)
    .map(unlock => unlock.unlockedNodeId)
}

/**
 * Calculate modified trust change based on pattern affinity
 * This is called during StateChange application
 */
export function calculateResonantTrustChange(
  baseTrustChange: number,
  characterId: string,
  playerPatterns: Record<PatternType, number>,
  choicePattern?: PatternType
): {
  modifiedTrust: number
  resonanceTriggered: boolean
  resonanceDescription: string | null
} {
  // Use threshold 3 for early pattern detection in affinity calculations
  const dominantPattern = getDominantPattern(playerPatterns, 3)

  // Start with base trust
  let modifiedTrust = baseTrustChange
  let resonanceTriggered = false
  let resonanceDescription: string | null = null

  // Apply multiplier based on player's dominant pattern (who they ARE)
  if (dominantPattern) {
    const multiplier = getTrustMultiplier(characterId, dominantPattern)
    if (multiplier !== 1.0) {
      modifiedTrust = Math.round(baseTrustChange * multiplier)
      resonanceTriggered = true
      resonanceDescription = getResonanceDescription(characterId, dominantPattern)
    }
  }

  // Additional bonus/penalty for this specific choice's pattern (what they DID)
  if (choicePattern && choicePattern !== dominantPattern) {
    const choiceMultiplier = getTrustMultiplier(characterId, choicePattern)
    if (choiceMultiplier !== 1.0) {
      // Smaller effect for single choice vs overall pattern
      const choiceAdjustment = baseTrustChange * (choiceMultiplier - 1.0) * 0.5
      modifiedTrust += Math.round(choiceAdjustment)
      if (!resonanceTriggered) {
        resonanceTriggered = true
        resonanceDescription = getResonanceDescription(characterId, choicePattern)
      }
    }
  }

  return {
    modifiedTrust,
    resonanceTriggered,
    resonanceDescription
  }
}

/**
 * Validate pattern type at runtime
 */
export function isValidPatternType(pattern: string): pattern is PatternType {
  return PATTERN_TYPES.includes(pattern as PatternType)
}
