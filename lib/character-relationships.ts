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
