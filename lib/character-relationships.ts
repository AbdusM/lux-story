import { GameState } from '@/lib/character-state'

/**
 * Character Relationships System
 * Creates a living web of inter-character dynamics
 *
 * Design Philosophy:
 * - Characters exist in relationship to each other, not just to the player
 * - Relationships can change based on player actions (ripple effects)
 * - Characters mention each other naturally in dialogue
 * - This makes the station feel like a real community
 */

/**
 * Types of relationships between characters
 */
export type RelationshipType =
  | 'ally'           // Mutual support and friendship
  | 'rival'          // Competitive tension (not hostile)
  | 'mentor'         // One guides the other
  | 'protege'        // Being guided by another
  | 'former'         // Past relationship (history)
  | 'parallel'       // Similar situations, potential connection
  | 'stranger'       // No relationship yet
  | 'complicated'    // Mixed feelings, unresolved

/**
 * A single directional relationship edge
 * Note: Relationships can be asymmetric (A feels differently about B than B about A)
 */
export interface CharacterRelationshipEdge {
  fromCharacterId: string
  toCharacterId: string
  type: RelationshipType
  intensity: number  // 1-10, how strong the feeling

  // What they think/say about each other
  opinions: {
    sentiment: 'positive' | 'neutral' | 'negative' | 'conflicted'
    publicOpinion: string      // What they'd say openly (early trust)
    privateOpinion: string     // What they really think (high trust)
    memories: string[]         // Specific shared moments they might mention
  }

  // How this relationship can change based on player actions
  dynamicRules?: {
    triggerFlags: string[]     // Global flags that trigger the change
    newType: RelationshipType
    newIntensity: number
    newPublicOpinion?: string
    newPrivateOpinion?: string
  }[]

  // When this relationship gets revealed to the player
  revealConditions?: {
    trustMin?: number          // Trust with the speaking character
    requiredFlags?: string[]   // Flags that must be set
    charactersMet?: string[]   // Player must have met these chars first
  }
}

/**
 * The complete relationship web
 */
export const CHARACTER_RELATIONSHIP_WEB: CharacterRelationshipEdge[] = [
  // ============================================
  // MAYA'S RELATIONSHIPS
  // ============================================

  // Maya → Devon (Former classmates, parallel pressure)
  {
    fromCharacterId: 'maya',
    toCharacterId: 'devon',
    type: 'parallel',
    intensity: 5,
    opinions: {
      sentiment: 'conflicted',
      publicOpinion: 'Devon? We had some classes together at UAB. Engineering stuff.',
      privateOpinion: 'He made it look so easy. Chose engineering without any guilt. Must be nice to not have your parents\' entire life savings riding on your career choice.',
      memories: [
        'That robotics club meeting where he actually defended my servo design',
        'Him not understanding why I couldn\'t just "tell my parents the truth"'
      ]
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['devon']
    },
    dynamicRules: [
      {
        triggerFlags: ['devon_maya_collaboration_started'],
        newType: 'ally',
        newIntensity: 7,
        newPublicOpinion: 'Devon and I are actually working on something together. Never thought I\'d say that.',
        newPrivateOpinion: 'He sees me as an engineer. Not pre-med Maya playing with toys. That means something.'
      }
    ]
  },

  // Maya → Samuel (Seeks guidance)
  {
    fromCharacterId: 'maya',
    toCharacterId: 'samuel',
    type: 'protege',
    intensity: 6,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Samuel? He runs this place. Seems like he\'s always watching, but not in a creepy way.',
      privateOpinion: 'He looks at me like he already knows what I\'m going to figure out. Like he\'s waiting for me to catch up to myself.',
      memories: [
        'The first time he saw my robot companion and just... nodded. Like it was exactly what he expected.'
      ]
    },
    revealConditions: {
      trustMin: 3
    }
  },

  // Maya → Marcus (Medical tech potential)
  {
    fromCharacterId: 'maya',
    toCharacterId: 'marcus',
    type: 'stranger',
    intensity: 2,
    opinions: {
      sentiment: 'neutral',
      publicOpinion: 'Marcus? I\'ve seen him around. Healthcare, right?',
      privateOpinion: 'He works with machines that keep people alive. That\'s... actually closer to what I want to do than pre-med ever was.',
      memories: []
    },
    revealConditions: {
      trustMin: 5,
      charactersMet: ['marcus']
    },
    dynamicRules: [
      {
        triggerFlags: ['maya_considers_biomedical'],
        newType: 'ally',
        newIntensity: 5,
        newPublicOpinion: 'Marcus and I have been talking. Biomedical engineering—it\'s a real path.',
        newPrivateOpinion: 'He made me realize I don\'t have to choose between helping people and building things. I can do both.'
      }
    ]
  },

  // ============================================
  // DEVON'S RELATIONSHIPS
  // ============================================

  // Devon → Maya (Respects her differently)
  {
    fromCharacterId: 'devon',
    toCharacterId: 'maya',
    type: 'parallel',
    intensity: 4,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Maya Chen? She was in the robotics club. Good intuition for mechanical systems.',
      privateOpinion: 'She builds things that make people smile. I build systems that process data. Sometimes I wonder if she has it figured out better than me.',
      memories: [
        'Her robot companion—it\'s not optimized for anything practical, but people love it.',
        'When I realized she was pre-med and not engineering. Made no sense to me.'
      ]
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['maya']
    }
  },

  // Devon → Samuel (Observes from distance)
  {
    fromCharacterId: 'devon',
    toCharacterId: 'samuel',
    type: 'mentor',
    intensity: 3,
    opinions: {
      sentiment: 'neutral',
      publicOpinion: 'Samuel seems to understand systems. Human ones, I mean. I don\'t know how he does it.',
      privateOpinion: 'He\'s the kind of person my Conversation Optimizer is trying to model. But I don\'t think you can reduce what he does to an algorithm.',
      memories: []
    },
    revealConditions: {
      trustMin: 5
    }
  },

  // ============================================
  // SAMUEL'S RELATIONSHIPS (Hub character)
  // ============================================

  // Samuel → Maya (Sees her potential)
  {
    fromCharacterId: 'samuel',
    toCharacterId: 'maya',
    type: 'mentor',
    intensity: 7,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Maya? She\'s figuring things out. Sometimes the most tangled threads make the strongest weave.',
      privateOpinion: 'Her thread splits like light through a prism—one part drawn to healing hands, another to building minds. Most see split threads as weakness. I see them as the future.',
      memories: [
        'First time she showed me that robot. Her whole face changed—that was the real Maya.'
      ]
    },
    revealConditions: {
      trustMin: 3
    }
  },

  // Samuel → Devon (Patience with process)
  {
    fromCharacterId: 'samuel',
    toCharacterId: 'devon',
    type: 'mentor',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Devon thinks in systems. Nothing wrong with that—systems keep trains running. But people aren\'t trains.',
      privateOpinion: 'He\'s trying to build a machine to do what his heart already knows how to do. One day he\'ll realize the algorithm was inside him all along.',
      memories: [
        'Watching him debug that conversation model like it was his own heart on the screen.'
      ]
    },
    revealConditions: {
      trustMin: 4
    }
  },

  // Samuel → Tess (Kindred spirits)
  {
    fromCharacterId: 'samuel',
    toCharacterId: 'tess',
    type: 'ally',
    intensity: 8,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Tess? She\'s been here almost as long as me. Different stations, same purpose.',
      privateOpinion: 'She left corporate to build something real. Sound familiar? We\'re both curators now—she curates music, I curate journeys.',
      memories: [
        'The night she played that demo tape for me. Both of us knowing that kid was going places.'
      ]
    },
    revealConditions: {
      trustMin: 5,
      charactersMet: ['tess']
    }
  },

  // ============================================
  // TESS'S RELATIONSHIPS
  // ============================================

  // Tess → Rohan (Algorithm fighters)
  {
    fromCharacterId: 'tess',
    toCharacterId: 'rohan',
    type: 'ally',
    intensity: 6,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Rohan? He gets it. We\'re both fighting the same thing, different battlefield.',
      privateOpinion: 'He\'s trying to save human understanding from the algorithm. I\'m trying to save human taste. Same war, different fronts.',
      memories: [
        'That conversation about cargo cults. I said "Real." He said "Metal." Same thing, different languages.'
      ]
    },
    revealConditions: {
      trustMin: 5,
      charactersMet: ['rohan']
    }
  },

  // Tess → Maya (Sees potential curator)
  {
    fromCharacterId: 'tess',
    toCharacterId: 'maya',
    type: 'mentor',
    intensity: 4,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Maya? She\'s got that spark. You can see it when she talks about her projects.',
      privateOpinion: 'She\'s in the same trap I was—doing what makes sense instead of what makes her alive. Hope she figures it out faster than I did.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['maya']
    }
  },

  // ============================================
  // SAMUEL AS HUB - Additional Connections
  // ============================================

  // Samuel → Marcus (Recognizes quiet strength)
  {
    fromCharacterId: 'samuel',
    toCharacterId: 'marcus',
    type: 'ally',
    intensity: 7,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Marcus? He keeps people alive. That\'s a calling, not a job.',
      privateOpinion: 'He counts heartbeats like I count arrivals. We both know that every number is a person. Every pause could be the last.',
      memories: [
        'The night he told me about the code blue that made him certain. His hands were steady, but his voice shook.'
      ]
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['marcus']
    }
  },

  // Samuel → Rohan (Philosophical kinship)
  {
    fromCharacterId: 'samuel',
    toCharacterId: 'rohan',
    type: 'ally',
    intensity: 6,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Rohan asks the questions most people are afraid to ask.',
      privateOpinion: 'He sees what the machines are doing to human connection. I see what they\'re doing to human direction. We\'re both watching something precious slip away.',
      memories: [
        'That debate about whether technology liberates or traps us. We agreed more than we disagreed.'
      ]
    },
    revealConditions: {
      trustMin: 5,
      charactersMet: ['rohan']
    }
  },

  // Samuel → Yaquin (Protective concern)
  {
    fromCharacterId: 'samuel',
    toCharacterId: 'yaquin',
    type: 'mentor',
    intensity: 6,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Yaquin? She teaches because she cares. Not everyone in education can say that.',
      privateOpinion: 'She gives so much of herself to her students. I worry she forgets to save some for herself. Familiar pattern.',
      memories: []
    },
    revealConditions: {
      trustMin: 3,
      charactersMet: ['yaquin']
    }
  },

  // ============================================
  // MARCUS'S RELATIONSHIPS
  // ============================================

  // Marcus → Samuel (Respects the keeper)
  {
    fromCharacterId: 'marcus',
    toCharacterId: 'samuel',
    type: 'mentor',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Samuel sees things. Not like doctors see—differently. Deeper.',
      privateOpinion: 'He helped me once, years ago. Didn\'t even know he was doing it. Just said the right thing at the right time.',
      memories: []
    },
    revealConditions: {
      trustMin: 4
    }
  },

  // Marcus → Maya (Biomedical connection)
  {
    fromCharacterId: 'marcus',
    toCharacterId: 'maya',
    type: 'parallel',
    intensity: 4,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'The engineering student? She asks good questions about the equipment.',
      privateOpinion: 'She looks at the dialysis machines like they\'re puzzles to solve. Not many people see the beauty in medical technology. I do.',
      memories: []
    },
    revealConditions: {
      trustMin: 3,
      charactersMet: ['maya']
    },
    dynamicRules: [
      {
        triggerFlags: ['maya_considers_biomedical'],
        newType: 'ally',
        newIntensity: 6,
        newPublicOpinion: 'Maya and I have been talking about biomedical engineering. She sees what I see—where medicine meets machines.',
        newPrivateOpinion: 'She could build the tools that save lives. That\'s not abandoning medicine. That\'s expanding it.'
      }
    ]
  },

  // ============================================
  // ROHAN'S RELATIONSHIPS
  // ============================================

  // Rohan → Devon (Philosophical tension)
  {
    fromCharacterId: 'rohan',
    toCharacterId: 'devon',
    type: 'rival',
    intensity: 5,
    opinions: {
      sentiment: 'conflicted',
      publicOpinion: 'Devon? Brilliant. But he thinks everything can be optimized.',
      privateOpinion: 'He represents everything I worry about—reducing human connection to algorithms. But he\'s not doing it maliciously. He\'s doing it because he\'s scared of the alternative.',
      memories: [
        'Our debate about whether AI could ever understand emotion. He said yes. I said it could simulate understanding. Neither of us won.'
      ]
    },
    revealConditions: {
      trustMin: 5,
      charactersMet: ['devon']
    }
  },

  // Rohan → Samuel (Philosophical respect)
  {
    fromCharacterId: 'rohan',
    toCharacterId: 'samuel',
    type: 'ally',
    intensity: 7,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Samuel? He understands time differently than most people.',
      privateOpinion: 'He\'s the only one here who doesn\'t try to rush toward answers. In a world obsessed with efficiency, that\'s revolutionary.',
      memories: []
    },
    revealConditions: {
      trustMin: 4
    }
  },

  // ============================================
  // YAQUIN'S RELATIONSHIPS
  // ============================================

  // Yaquin → Samuel (Looks up to)
  {
    fromCharacterId: 'yaquin',
    toCharacterId: 'samuel',
    type: 'protege',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Samuel always knows what to say. I wish I had that certainty.',
      privateOpinion: 'He makes guiding people look easy. I\'m still learning. Maybe I\'ll never be that calm.',
      memories: []
    },
    revealConditions: {
      trustMin: 3
    }
  },

  // Yaquin → Maya (Sees herself)
  {
    fromCharacterId: 'yaquin',
    toCharacterId: 'maya',
    type: 'parallel',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Maya reminds me of some of my students. Talented, but unsure.',
      privateOpinion: 'She\'s caught between what she wants and what she thinks she should want. I know that feeling. I still know it.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['maya']
    }
  },

  // ============================================
  // DEVON'S ADDITIONAL RELATIONSHIPS
  // ============================================

  // Devon → Rohan (Intellectual friction)
  {
    fromCharacterId: 'devon',
    toCharacterId: 'rohan',
    type: 'rival',
    intensity: 4,
    opinions: {
      sentiment: 'conflicted',
      publicOpinion: 'Rohan thinks technology is the problem. I think it\'s the solution.',
      privateOpinion: 'He makes good points. Frustratingly good. Sometimes I wonder if he\'s right—if I\'m just building elaborate ways to avoid being human.',
      memories: []
    },
    revealConditions: {
      trustMin: 5,
      charactersMet: ['rohan']
    }
  },

  // Devon → Marcus (Respects different intelligence)
  {
    fromCharacterId: 'devon',
    toCharacterId: 'marcus',
    type: 'parallel',
    intensity: 3,
    opinions: {
      sentiment: 'neutral',
      publicOpinion: 'Marcus works with complex systems. Medical ones. Different domain, same principles.',
      privateOpinion: 'He makes life-or-death decisions without an algorithm. That terrifies me. Also impresses me.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['marcus']
    }
  },

  // ============================================
  // JORDAN'S RELATIONSHIPS
  // ============================================

  // Jordan → Samuel (Seeking direction)
  {
    fromCharacterId: 'jordan',
    toCharacterId: 'samuel',
    type: 'protege',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Samuel sees patterns in people. Seven jobs in, I\'m still trying to see the pattern in myself.',
      privateOpinion: 'He doesn\'t tell me I\'m scattered. He tells me I\'m accumulating. That word changed something.',
      memories: []
    },
    revealConditions: {
      trustMin: 3
    }
  },

  // Jordan → Maya (Parallel struggles)
  {
    fromCharacterId: 'jordan',
    toCharacterId: 'maya',
    type: 'parallel',
    intensity: 4,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Maya? She\'s figuring out what she wants. Same as everyone here.',
      privateOpinion: 'She\'s torn between what her family wants and what she wants. At least she knows what she wants. That\'s further than me.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['maya']
    }
  },

  // Jordan → Devon (Different approaches)
  {
    fromCharacterId: 'jordan',
    toCharacterId: 'devon',
    type: 'parallel',
    intensity: 3,
    opinions: {
      sentiment: 'conflicted',
      publicOpinion: 'Devon knows exactly what he wants to build. Must be nice.',
      privateOpinion: 'He picked a path and stuck to it. I picked seven. I used to think that made me a failure. Now I\'m not so sure.',
      memories: []
    },
    revealConditions: {
      trustMin: 5,
      charactersMet: ['devon']
    }
  },

  // ============================================
  // KAI'S RELATIONSHIPS
  // ============================================

  // Kai → Samuel (Mentor guidance)
  {
    fromCharacterId: 'kai',
    toCharacterId: 'samuel',
    type: 'protege',
    intensity: 4,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Samuel understands that some decisions can\'t wait for consensus.',
      privateOpinion: 'He told me once that the hardest part of keeping people safe is accepting you can\'t save everyone. He was right.',
      memories: []
    },
    revealConditions: {
      trustMin: 3
    }
  },

  // Kai → Marcus (Shared stakes)
  {
    fromCharacterId: 'kai',
    toCharacterId: 'marcus',
    type: 'ally',
    intensity: 6,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Marcus and I speak the same language. We both know what it\'s like when seconds matter.',
      privateOpinion: 'He saves lives in the ER. I prevent the situations that send people there. We\'re two sides of the same coin.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['marcus']
    }
  },

  // Kai → Silas (Crisis kinship)
  {
    fromCharacterId: 'kai',
    toCharacterId: 'silas',
    type: 'parallel',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Silas handles system failures. I handle safety failures. Same pressure, different domain.',
      privateOpinion: 'When everything\'s breaking, we both have to stay calm. That\'s a rare skill. I respect it.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['silas']
    }
  },

  // ============================================
  // SILAS'S RELATIONSHIPS
  // ============================================

  // Silas → Samuel (Wisdom seeker)
  {
    fromCharacterId: 'silas',
    toCharacterId: 'samuel',
    type: 'protege',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Samuel runs this place like a well-maintained system. Redundancy, graceful degradation, clear priorities.',
      privateOpinion: 'He told me about failure modes once. Not in systems—in people. How burnout is just another kind of cascade failure. I think about that a lot.',
      memories: []
    },
    revealConditions: {
      trustMin: 4
    }
  },

  // Silas → Devon (Systems thinking)
  {
    fromCharacterId: 'silas',
    toCharacterId: 'devon',
    type: 'ally',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Devon builds systems. I keep them running when they break. We understand each other.',
      privateOpinion: 'He thinks in dependencies and failure modes. So do I. The difference is he builds for ideal conditions. I plan for worst case.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['devon']
    }
  },

  // Silas → Kai (Mutual respect)
  {
    fromCharacterId: 'silas',
    toCharacterId: 'kai',
    type: 'parallel',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Kai knows what it\'s like when everything depends on you staying calm.',
      privateOpinion: 'We both live in that space between action and consequence. Most people never have to make those calls. We make them every day.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['kai']
    }
  },

  // ============================================
  // ALEX'S RELATIONSHIPS
  // ============================================

  // Alex → Samuel (Rediscovering purpose)
  {
    fromCharacterId: 'alex',
    toCharacterId: 'samuel',
    type: 'protege',
    intensity: 4,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Samuel doesn\'t ask about credentials. He asks what you\'re curious about. Refreshing.',
      privateOpinion: 'I was so burned out on the credential chase. He reminded me that learning used to be the point, not the certificate at the end.',
      memories: []
    },
    revealConditions: {
      trustMin: 3
    }
  },

  // Alex → Maya (Parallel paths)
  {
    fromCharacterId: 'alex',
    toCharacterId: 'maya',
    type: 'parallel',
    intensity: 4,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Maya\'s building things, not collecting certificates. Smart.',
      privateOpinion: 'She\'s doing what I forgot how to do—learning by making. Not learning to prove something.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['maya']
    }
  },

  // Alex → Yaquin (Education alliance)
  {
    fromCharacterId: 'alex',
    toCharacterId: 'yaquin',
    type: 'ally',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Yaquin\'s trying to make learning accessible. Same fight, different battlefield.',
      privateOpinion: 'She actually cares about her students. Not about completion rates or testimonials. That\'s getting rare in EdTech.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['yaquin']
    }
  },

  // ============================================
  // GRACE'S RELATIONSHIPS
  // ============================================

  // Grace → Samuel (Learned patience)
  {
    fromCharacterId: 'grace',
    toCharacterId: 'samuel',
    type: 'mentor',
    intensity: 6,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Samuel knows about presence. About being there without needing to fix anything.',
      privateOpinion: 'When I first came here, I was looking for answers about Mom. He gave me something better—permission to not have answers.',
      memories: []
    },
    revealConditions: {
      trustMin: 3
    }
  },

  // Grace → Marcus (Care professions)
  {
    fromCharacterId: 'grace',
    toCharacterId: 'marcus',
    type: 'ally',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Marcus understands care. The real kind, not the performative kind.',
      privateOpinion: 'He sees patients as people, not conditions. That\'s how I try to see Mom. Not the disease—her.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['marcus']
    }
  },

  // Grace → Maya (Family weight)
  {
    fromCharacterId: 'grace',
    toCharacterId: 'maya',
    type: 'parallel',
    intensity: 4,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Maya knows what it\'s like when family expectations feel heavy.',
      privateOpinion: 'Her pressure is about success. Mine is about loss. Different weight, same shoulders.',
      memories: []
    },
    revealConditions: {
      trustMin: 5,
      charactersMet: ['maya']
    }
  },

  // ============================================
  // ELENA'S RELATIONSHIPS
  // ============================================

  // Elena → Samuel (Practical wisdom)
  {
    fromCharacterId: 'elena',
    toCharacterId: 'samuel',
    type: 'mentor',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Samuel\'s a troubleshooter too. Just with people instead of circuits.',
      privateOpinion: 'He once told me that listening is like checking continuity. You can\'t fix what you can\'t trace. Best advice I\'ve gotten here.',
      memories: []
    },
    revealConditions: {
      trustMin: 3
    }
  },

  // Elena → Devon (Technical kinship, different approaches)
  {
    fromCharacterId: 'elena',
    toCharacterId: 'devon',
    type: 'parallel',
    intensity: 4,
    opinions: {
      sentiment: 'conflicted',
      publicOpinion: 'Devon thinks in software. I think in hardware. Different layers of the same stack.',
      privateOpinion: 'He optimizes for elegance. I optimize for "will this not catch fire." Sometimes I wonder if we\'re solving different problems.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['devon']
    }
  },

  // Elena → Rohan (Ground truth alliance)
  {
    fromCharacterId: 'elena',
    toCharacterId: 'rohan',
    type: 'ally',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Rohan cares about fundamentals. So do I. You can\'t troubleshoot what you don\'t understand.',
      privateOpinion: 'He\'s fighting the same fight I am—people who want shortcuts without understanding the basics. Can\'t skip the ground truth.',
      memories: []
    },
    revealConditions: {
      trustMin: 5,
      charactersMet: ['rohan']
    }
  },

  // ============================================
  // ASHA'S RELATIONSHIPS
  // ============================================

  // Asha → Samuel (Visionary respect)
  {
    fromCharacterId: 'asha',
    toCharacterId: 'samuel',
    type: 'mentor',
    intensity: 6,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Samuel sees the big picture. He understands that reality is flexible.',
      privateOpinion: 'He encourages my visions. Everyone else calls them dreams. He calls them data.',
      memories: []
    },
    revealConditions: {
      trustMin: 4
    }
  },

  // Asha → Kai (Creative alignment)
  {
    fromCharacterId: 'asha',
    toCharacterId: 'kai',
    type: 'ally',
    intensity: 7,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Kai designs specifically, I design abstractly. We need each other.',
      privateOpinion: 'He focuses on safety, I focus on possibility. Together we make things that are safe enough to be possible.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['kai']
    }
  },

  // ============================================
  // LIRA'S RELATIONSHIPS
  // ============================================

  // Lira → Tess (The Curators)
  {
    fromCharacterId: 'lira',
    toCharacterId: 'tess',
    type: 'protege',
    intensity: 7,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Tess hears music in everything. She taught me how to listen to the station.',
      privateOpinion: 'She curates the best sounds. I try to make new ones. She says my silence is the most important sound of all.',
      memories: []
    },
    revealConditions: {
      trustMin: 5,
      charactersMet: ['tess']
    }
  },

  // Lira → Samuel (Quiet understanding)
  {
    fromCharacterId: 'lira',
    toCharacterId: 'samuel',
    type: 'mentor',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Samuel doesn\'t need words.',
      privateOpinion: 'He sits with me in silence. It\'s the loudest conversation I have all day.',
      memories: []
    },
    revealConditions: {
      trustMin: 4
    }
  },

  // ============================================
  // ZARA'S RELATIONSHIPS
  // ============================================

  // Zara → Devon (Logic vs Optimization)
  {
    fromCharacterId: 'zara',
    toCharacterId: 'devon',
    type: 'rival',
    intensity: 4,
    opinions: {
      sentiment: 'conflicted',
      publicOpinion: 'Devon optimizes for strict metrics. I analyze the variance.',
      privateOpinion: 'He hates my outliers. I love them. That\'s where the truth hides.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['devon']
    }
  },

  // Zara → Marcus (Data vs Life)
  {
    fromCharacterId: 'zara',
    toCharacterId: 'marcus',
    type: 'parallel',
    intensity: 5,
    opinions: {
      sentiment: 'neutral',
      publicOpinion: 'Medical data is messy. Marcus handles the mess.',
      privateOpinion: 'I tried to model his triage decisions. There\'s a variable I can\'t isolate. He calls it "gut feeling." I call it "unquantified heuristic."',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['marcus']
    }
  },

  // ============================================
  // QUINN'S RELATIONSHIPS (LinkedIn 2026 - Finance)
  // ============================================

  // Quinn → Samuel (Seeks redemption wisdom)
  {
    fromCharacterId: 'quinn',
    toCharacterId: 'samuel',
    type: 'protege',
    intensity: 6,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Samuel understands that some currencies can\'t be traded. Time. Trust. Second chances.',
      privateOpinion: 'He\'s the first person who looked at my past and saw possibility instead of liability. That portfolio is worth more than anything I\'ve ever managed.',
      memories: [
        'When I told him about the 400 jobs. He just nodded and asked what I learned.'
      ]
    },
    revealConditions: {
      trustMin: 3
    }
  },

  // Quinn → Marcus (Respects steadiness)
  {
    fromCharacterId: 'quinn',
    toCharacterId: 'marcus',
    type: 'ally',
    intensity: 4,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Marcus works in a world where returns are measured in heartbeats. Different metrics, same discipline.',
      privateOpinion: 'He makes life-or-death calls without a model. I used to think that was reckless. Now I think it\'s the purest form of conviction.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['marcus']
    }
  },

  // Quinn → Devon (Systems collaboration)
  {
    fromCharacterId: 'quinn',
    toCharacterId: 'devon',
    type: 'ally',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Devon builds models. So do I. His just don\'t have dollar signs attached.',
      privateOpinion: 'He\'s trying to optimize human connection. I tried to optimize human value. We both learned that some things resist optimization.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['devon']
    }
  },

  // Quinn → Nadia (Professional rivalry)
  {
    fromCharacterId: 'quinn',
    toCharacterId: 'nadia',
    type: 'rival',
    intensity: 4,
    opinions: {
      sentiment: 'conflicted',
      publicOpinion: 'Nadia thinks finance is the problem. I think unexamined finance is the problem. There\'s a difference.',
      privateOpinion: 'She\'s right more often than I\'d like to admit. But she doesn\'t understand that capital allocation can be a force for good. When it\'s done right.',
      memories: []
    },
    revealConditions: {
      trustMin: 5,
      charactersMet: ['nadia']
    }
  },

  // Quinn → Isaiah (Mentorship)
  {
    fromCharacterId: 'quinn',
    toCharacterId: 'isaiah',
    type: 'mentor',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Isaiah understands impact. Real impact, not the kind you put in a quarterly report.',
      privateOpinion: 'I\'m teaching him how capital works. He\'s teaching me what capital is for. I\'m getting the better deal.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['isaiah']
    }
  },

  // ============================================
  // DANTE'S RELATIONSHIPS (LinkedIn 2026 - Sales)
  // ============================================

  // Dante → Samuel (Seeking authenticity)
  {
    fromCharacterId: 'dante',
    toCharacterId: 'samuel',
    type: 'protege',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Samuel doesn\'t sell. He invites. There\'s a masterclass in that distinction.',
      privateOpinion: 'Every pitch I made used to be about closing. Samuel showed me that the best relationships never close. They just keep opening.',
      memories: []
    },
    revealConditions: {
      trustMin: 3
    }
  },

  // Dante → Quinn (Friendly tension)
  {
    fromCharacterId: 'dante',
    toCharacterId: 'quinn',
    type: 'rival',
    intensity: 3,
    opinions: {
      sentiment: 'conflicted',
      publicOpinion: 'Quinn thinks in spreadsheets. I think in handshakes. Somehow we understand each other.',
      privateOpinion: 'He\'s trying to redeem capital. I\'m trying to redeem persuasion. We\'re both reforming things people love to hate.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['quinn']
    }
  },

  // Dante → Lira (Creative partners)
  {
    fromCharacterId: 'dante',
    toCharacterId: 'lira',
    type: 'ally',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Lira hears what people don\'t say. That\'s the whole game, isn\'t it?',
      privateOpinion: 'She taught me to listen for the silence between words. Best sales training I never paid for.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['lira']
    }
  },

  // Dante → Jordan (Mutual respect)
  {
    fromCharacterId: 'dante',
    toCharacterId: 'jordan',
    type: 'ally',
    intensity: 4,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Jordan helps people find their path. I help people see value. Similar missions.',
      privateOpinion: 'Seven jobs? I see someone who kept learning until they found the right fit. That\'s not scattered. That\'s thorough.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['jordan']
    }
  },

  // Dante → Tess (Admiration)
  {
    fromCharacterId: 'dante',
    toCharacterId: 'tess',
    type: 'protege',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Tess left corporate to build something real. That takes guts.',
      privateOpinion: 'She\'s who I want to be when I fully trust my own voice. Someone who creates instead of convinces.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['tess']
    }
  },

  // ============================================
  // NADIA'S RELATIONSHIPS (LinkedIn 2026 - AI Ethics)
  // ============================================

  // Nadia → Samuel (Ethical grounding)
  {
    fromCharacterId: 'nadia',
    toCharacterId: 'samuel',
    type: 'mentor',
    intensity: 6,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Samuel guides without controlling. That\'s what responsible AI should do.',
      privateOpinion: 'He reminds me that humans figured out ethics before algorithms existed. Sometimes the old frameworks are the most robust.',
      memories: []
    },
    revealConditions: {
      trustMin: 3
    }
  },

  // Nadia → Rohan (Deep respect)
  {
    fromCharacterId: 'nadia',
    toCharacterId: 'rohan',
    type: 'ally',
    intensity: 6,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Rohan asks the questions I wish more AI researchers would ask.',
      privateOpinion: 'He sees technology as a threat to human depth. I see it as a responsibility to human safety. We\'re worried about the same thing from different angles.',
      memories: []
    },
    revealConditions: {
      trustMin: 5,
      charactersMet: ['rohan']
    }
  },

  // Nadia → Maya (Complicated)
  {
    fromCharacterId: 'nadia',
    toCharacterId: 'maya',
    type: 'complicated',
    intensity: 4,
    opinions: {
      sentiment: 'conflicted',
      publicOpinion: 'Maya builds things quickly. I worry about the things we don\'t have time to anticipate.',
      privateOpinion: 'She has the spark I had before I saw what unchecked innovation can do. I don\'t want to dim it. I just want to guide it.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['maya']
    }
  },

  // Nadia → Quinn (Professional rivalry)
  {
    fromCharacterId: 'nadia',
    toCharacterId: 'quinn',
    type: 'rival',
    intensity: 4,
    opinions: {
      sentiment: 'conflicted',
      publicOpinion: 'Quinn thinks capital can solve ethics. I think ethics should constrain capital.',
      privateOpinion: 'He\'s not wrong that money shapes outcomes. He\'s wrong that it should be the primary shaper. But at least he\'s thinking about it.',
      memories: []
    },
    revealConditions: {
      trustMin: 5,
      charactersMet: ['quinn']
    }
  },

  // Nadia → Zara (Philosophical allies)
  {
    fromCharacterId: 'nadia',
    toCharacterId: 'zara',
    type: 'ally',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Zara sees the bias in data. That\'s half of responsible AI right there.',
      privateOpinion: 'She fights the same fight I do—making the invisible visible. Her domain is statistics. Mine is deployment. Same war.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['zara']
    }
  },

  // Nadia → Devon (Collaboration)
  {
    fromCharacterId: 'nadia',
    toCharacterId: 'devon',
    type: 'ally',
    intensity: 4,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Devon builds systems. I try to make sure they\'re safe to deploy.',
      privateOpinion: 'He\'s genuinely trying to help people. His heart is in the right place. I just want to make sure his code follows.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['devon']
    }
  },

  // ============================================
  // ISAIAH'S RELATIONSHIPS (LinkedIn 2026 - Nonprofit)
  // ============================================

  // Isaiah → Samuel (Reverence)
  {
    fromCharacterId: 'isaiah',
    toCharacterId: 'samuel',
    type: 'protege',
    intensity: 7,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Samuel builds community without asking for credit. That\'s the purest form of service.',
      privateOpinion: 'He saw Marcus in me—the kid I couldn\'t save—and he didn\'t look away. He asked what I learned from the loss. That question changed everything.',
      memories: [
        'The night I told him about Marcus. He listened for an hour. Then he said, "That pain is what makes you effective." I\'ve held onto those words.'
      ]
    },
    revealConditions: {
      trustMin: 4
    }
  },

  // Isaiah → Quinn (Mentored by)
  {
    fromCharacterId: 'isaiah',
    toCharacterId: 'quinn',
    type: 'protege',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Quinn teaches me how money moves. I teach him what it should move toward.',
      privateOpinion: 'He\'s seen the dark side of capital. That\'s why he\'s the right teacher. He knows what to avoid.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['quinn']
    }
  },

  // Isaiah → Asha (Deep partners)
  {
    fromCharacterId: 'isaiah',
    toCharacterId: 'asha',
    type: 'ally',
    intensity: 7,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Asha resolves conflicts. I prevent the conditions that create them. Perfect partnership.',
      privateOpinion: 'She holds space for tension without rushing to resolve it. That\'s what the kids need. Someone who doesn\'t flinch at their pain.',
      memories: []
    },
    revealConditions: {
      trustMin: 5,
      charactersMet: ['asha']
    }
  },

  // Isaiah → Tess (Mutual admiration)
  {
    fromCharacterId: 'isaiah',
    toCharacterId: 'tess',
    type: 'ally',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Tess left money to follow meaning. That\'s the nonprofit gospel right there.',
      privateOpinion: 'She proves you can build something sustainable outside the traditional funding models. That gives me hope.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['tess']
    }
  },

  // Isaiah → Grace (Collaborates)
  {
    fromCharacterId: 'isaiah',
    toCharacterId: 'grace',
    type: 'ally',
    intensity: 5,
    opinions: {
      sentiment: 'positive',
      publicOpinion: 'Grace cares for individuals. I try to care for systems. We need both.',
      privateOpinion: 'She understands that care is exhausting. That it costs something. The donors never see that cost.',
      memories: []
    },
    revealConditions: {
      trustMin: 4,
      charactersMet: ['grace']
    }
  }
]

/**
 * Get what one character would say about another
 */
export function getCharacterMention(
  speakerId: string,
  targetId: string,
  context: {
    trust: number
    globalFlags: Set<string>
    charactersMet: string[]
  }
): {
  canMention: boolean
  opinion: string | null
  sentiment: string | null
  isDeepReveal: boolean
} {
  const relationship = CHARACTER_RELATIONSHIP_WEB.find(
    r => r.fromCharacterId === speakerId && r.toCharacterId === targetId
  )

  if (!relationship) {
    return { canMention: false, opinion: null, sentiment: null, isDeepReveal: false }
  }

  // Check reveal conditions
  if (relationship.revealConditions) {
    if (relationship.revealConditions.trustMin !== undefined &&
      context.trust < relationship.revealConditions.trustMin) {
      return { canMention: false, opinion: null, sentiment: null, isDeepReveal: false }
    }

    if (relationship.revealConditions.charactersMet) {
      const hasMetAll = relationship.revealConditions.charactersMet.every(
        charId => context.charactersMet.includes(charId)
      )
      if (!hasMetAll) {
        return { canMention: false, opinion: null, sentiment: null, isDeepReveal: false }
      }
    }

    if (relationship.revealConditions.requiredFlags) {
      const hasAllFlags = relationship.revealConditions.requiredFlags.every(
        flag => context.globalFlags.has(flag)
      )
      if (!hasAllFlags) {
        return { canMention: false, opinion: null, sentiment: null, isDeepReveal: false }
      }
    }
  }

  // Check for dynamic relationship updates
  let currentRelationship = relationship
  if (relationship.dynamicRules) {
    for (const rule of relationship.dynamicRules) {
      const hasAllTriggers = rule.triggerFlags.every(
        flag => context.globalFlags.has(flag)
      )
      if (hasAllTriggers) {
        // Apply the dynamic update
        currentRelationship = {
          ...relationship,
          type: rule.newType,
          intensity: rule.newIntensity,
          opinions: {
            ...relationship.opinions,
            publicOpinion: rule.newPublicOpinion || relationship.opinions.publicOpinion,
            privateOpinion: rule.newPrivateOpinion || relationship.opinions.privateOpinion
          }
        }
        break // Apply first matching rule
      }
    }
  }

  // Return appropriate opinion based on trust
  const isDeepReveal = context.trust >= 7
  const opinion = isDeepReveal
    ? currentRelationship.opinions.privateOpinion
    : currentRelationship.opinions.publicOpinion

  return {
    canMention: true,
    opinion,
    sentiment: currentRelationship.opinions.sentiment,
    isDeepReveal
  }
}

/**
 * Get a random memory one character has about another
 */
export function getSharedMemory(
  speakerId: string,
  targetId: string,
  context: {
    trust: number
    globalFlags: Set<string>
  }
): string | null {
  const relationship = CHARACTER_RELATIONSHIP_WEB.find(
    r => r.fromCharacterId === speakerId && r.toCharacterId === targetId
  )

  if (!relationship || relationship.opinions.memories.length === 0) {
    return null
  }

  // Only share memories at higher trust
  if (context.trust < 6) {
    return null
  }

  return relationship.opinions.memories[
    Math.floor(Math.random() * relationship.opinions.memories.length)
  ]
}

/**
 * Get all characters that a character has opinions about
 */
export function getCharacterConnections(characterId: string): string[] {
  return CHARACTER_RELATIONSHIP_WEB
    .filter(r => r.fromCharacterId === characterId)
    .map(r => r.toCharacterId)
}

/**
 * Check if a relationship would change based on current flags
 */
export function checkRelationshipEvolution(
  fromCharacterId: string,
  toCharacterId: string,
  globalFlags: Set<string>
): { evolved: boolean; newType?: RelationshipType } {
  const relationship = CHARACTER_RELATIONSHIP_WEB.find(
    r => r.fromCharacterId === fromCharacterId && r.toCharacterId === toCharacterId
  )

  if (!relationship?.dynamicRules) {
    return { evolved: false }
  }

  for (const rule of relationship.dynamicRules) {
    const hasAllTriggers = rule.triggerFlags.every(flag => globalFlags.has(flag))
    if (hasAllTriggers) {
      return { evolved: true, newType: rule.newType }
    }
  }

  return { evolved: false }
}

/**
 * Detect which relationships have changed based on flag updates
 * Used to trigger visual feedback when a choice shifts dynamics
 */
export function detectRelationshipUpdates(
  oldFlags: Set<string>,
  newFlags: Set<string>
): Array<{ fromId: string; toId: string; newType: string }> {
  const updates: Array<{ fromId: string; toId: string; newType: string }> = []

  // Optimization: If no new flags added, no dynamic rules can trigger (assuming purely additive flags for now)
  // Actually, let's just check rules that require flags present in new but not old
  const addedFlags = new Set([...newFlags].filter(x => !oldFlags.has(x)))
  if (addedFlags.size === 0) return []

  for (const relationship of CHARACTER_RELATIONSHIP_WEB) {
    if (!relationship.dynamicRules) continue

    for (const rule of relationship.dynamicRules) {
      // Check if this rule is NOW satisfied but WAS NOT satisfied before
      const nowSatisfied = rule.triggerFlags.every(f => newFlags.has(f))
      const wasSatisfied = rule.triggerFlags.every(f => oldFlags.has(f))

      if (nowSatisfied && !wasSatisfied) {
        updates.push({
          fromId: relationship.fromCharacterId,
          toId: relationship.toCharacterId,
          newType: rule.newType
        })
        // Only trigger one update per relationship per turn to avoid spam/conflicts
        break
      }
    }
  }

  return updates
}

/**
 * Get a relevant cross-character echo for the current situation
 * Favors characters the player has met and has high trust with
 */
export function getRelevantCrossCharacterEcho(
  speakerId: string,
  gameState: GameState
): { text: string; emotion?: string } | null {
  const speaker = gameState.characters.get(speakerId)
  if (!speaker) return null

  // Get all potential connections
  const relationships = CHARACTER_RELATIONSHIP_WEB.filter(r => r.fromCharacterId === speakerId)

  const validEchoes: Array<{
    text: string
    emotion: string
    intensity: number
    isDeep: boolean
  }> = []

  // Derive context from GameState
  const context = {
    trust: speaker.trust,
    globalFlags: gameState.globalFlags,
    charactersMet: Array.from(gameState.characters.values())
      .filter(c => c.conversationHistory.length > 0) // Player has interacted with them
      .map(c => c.characterId)
  }

  for (const rel of relationships) {
    const mention = getCharacterMention(speakerId, rel.toCharacterId, context)

    if (mention.canMention && mention.opinion) {
      validEchoes.push({
        text: mention.opinion,
        emotion: mention.sentiment || 'neutral',
        intensity: rel.intensity,
        isDeep: mention.isDeepReveal
      })
    }
  }

  if (validEchoes.length === 0) return null

  // Simple random selection for variety
  const selected = validEchoes[Math.floor(Math.random() * validEchoes.length)]

  return {
    text: selected.text,
    emotion: selected.emotion
  }
}
