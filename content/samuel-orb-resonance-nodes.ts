/**
 * Samuel Orb Resonance Nodes
 *
 * Dialogue nodes that unlock based on orb tier milestones.
 * Follows Invisible Depth Principle: backend tracks orb accumulation,
 * manifestation only through Samuel's dialogue.
 *
 * Orb tiers:
 * - nascent (0-9): No special dialogue
 * - emerging (10-29): "Something stirs..."
 * - developing (30-59): "The station recognizes..."
 * - flourishing (60-99): "The platforms respond..."
 * - mastered (100+): "You know who you are..."
 */

import { DialogueNode } from '@/lib/dialogue-graph'

export const samuelOrbResonanceNodes: DialogueNode[] = [
  // ============= ORB RESONANCE: EMERGING (10+ orbs) =============
  {
    nodeId: 'samuel_orb_emerging',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Hold on a second.",
        emotion: 'curious',
        variation_id: 'orb_emerging_v1'
      },
      {
        text: "Wait.\n\n*Samuel tilts his head, as if listening to something*\n\nThe station... it's starting to notice you. Not many travelers get that. Most folks come through, make their choices, move on. But you? Something's taking shape.",
        emotion: 'mystical',
        variation_id: 'orb_emerging_v2'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['orb_tier_emerging'],
      lacksGlobalFlags: ['samuel_acknowledged_emerging']
    },
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['player_orb_emerging']
      },
      {
        addGlobalFlags: ['samuel_acknowledged_emerging']
      }
    ],
    choices: [
      {
        choiceId: 'orb_emerging_ask',
        text: '"What do you mean, traces?"',
        nextNodeId: 'samuel_orb_emerging_explain',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'orb_emerging_dismiss',
        text: '"I\'m just making choices."',
        nextNodeId: 'samuel_orb_emerging_humble',
        pattern: 'patience',
        skills: ['humility']
      }
    ],
    tags: ['orb_resonance', 'milestone']
  },

  {
    nodeId: 'samuel_orb_emerging_explain',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Every choice you make.",
        emotion: 'knowing',
        variation_id: 'orb_emerging_explain_v1'
      }
    ],
    choices: [
      {
        choiceId: 'orb_emerging_continue',
        text: '"What happens as it adds up?"',
        nextNodeId: 'samuel_orb_emerging_foreshadow',
        pattern: 'analytical'
      },
      {
        choiceId: 'orb_emerging_back',
        text: '"I should get back to exploring."',
        nextNodeId: 'samuel_hub_router',
        pattern: 'exploring'
      }
    ]
  },

  {
    nodeId: 'samuel_orb_emerging_humble',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "*Samuel smiles* choices.",
        emotion: 'warm',
        variation_id: 'orb_emerging_humble_v1'
      }
    ],
    choices: [
      {
        choiceId: 'orb_emerging_humble_continue',
        text: '"I never thought of it that way."',
        nextNodeId: 'samuel_orb_emerging_foreshadow',
        pattern: 'patience'
      },
      {
        choiceId: 'orb_emerging_humble_back',
        text: '"Thanks, Samuel."',
        nextNodeId: 'samuel_hub_router',
        pattern: 'helping'
      }
    ]
  },

  {
    nodeId: 'samuel_orb_emerging_foreshadow',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Keep going the way you're going, and the station will start.",
        emotion: 'mystical',
        variation_id: 'orb_emerging_foreshadow_v1'
      }
    ],
    choices: [
      {
        choiceId: 'orb_emerging_foreshadow_continue',
        text: 'Continue exploring',
        nextNodeId: 'samuel_hub_router',
        pattern: 'exploring'
      }
    ]
  },

  // ============= ORB RESONANCE: DEVELOPING (30+ orbs) =============
  {
    nodeId: 'samuel_orb_developing',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "*Samuel stops mid-sentence* There it is again.",
        emotion: 'awe',
        variation_id: 'orb_developing_v1'
      },
      {
        text: "*Samuel looks at you with new respect*\n\nYou've been busy. Thirty-some choices deep now, if I'm counting right. And the station's been paying attention.\n\nYour patterns... they're taking shape. I can see 'em now too.",
        emotion: 'knowing',
        variation_id: 'orb_developing_v2'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['orb_tier_developing'],
      lacksGlobalFlags: ['samuel_acknowledged_developing']
    },
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['player_orb_developing']
      },
      {
        addGlobalFlags: ['samuel_acknowledged_developing']
      }
    ],
    choices: [
      {
        choiceId: 'orb_developing_patterns',
        text: '"What patterns do you see?"',
        nextNodeId: 'samuel_orb_developing_patterns',
        pattern: 'analytical',
        skills: ['curiosity', 'emotionalIntelligence']
      },
      {
        choiceId: 'orb_developing_station',
        text: '"How does the station know?"',
        nextNodeId: 'samuel_orb_developing_station',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['orb_resonance', 'milestone']
  },

  {
    nodeId: 'samuel_orb_developing_patterns',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I see someone who thinks before they speak.",
        emotion: 'respect',
        variation_id: 'orb_developing_patterns_v1',
        patternReflection: [
          {
            pattern: 'analytical',
            minLevel: 5,
            altText: "I see a mind that cuts through noise. You don't just accept what you're told—you test it. Question it. Break it down.\n\nThat kind of thinking... it builds things that last.",
            altEmotion: 'knowing'
          },
          {
            pattern: 'helping',
            minLevel: 5,
            altText: "I see a heart that leads. Every choice you've made... it comes back to people. Understanding them. Supporting them.\n\nThat's a gift. Don't let anyone tell you it's soft.",
            altEmotion: 'warm'
          },
          {
            pattern: 'building',
            minLevel: 5,
            altText: "I see a builder. Not just of things—of futures. You look at problems and see possibilities.\n\nThe station needs more folks like you.",
            altEmotion: 'admiring'
          }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'orb_developing_patterns_continue',
        text: '"Thank you, Samuel."',
        nextNodeId: 'samuel_hub_router',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_orb_developing_station',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Been keepin' this place running for a long time. And in all those years, I've learned one thing: the station has a.",
        emotion: 'mystical',
        variation_id: 'orb_developing_station_v1'
      }
    ],
    choices: [
      {
        choiceId: 'orb_developing_station_continue',
        text: 'Continue exploring',
        nextNodeId: 'samuel_hub_router',
        pattern: 'exploring'
      }
    ]
  },

  // ============= ORB RESONANCE: FLOURISHING (60+ orbs) =============
  {
    nodeId: 'samuel_orb_flourishing',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "*Samuel straightens up, something pride in his eyes* Well now.",
        emotion: 'proud',
        variation_id: 'orb_flourishing_v1'
      },
      {
        text: "*The lights in the station seem to pulse gently*\n\nFeel that? The station's welcoming you now. Not as a visitor—as something closer to family.\n\nYou've earned that. Through every careful choice. Every moment of real listening.",
        emotion: 'awe',
        variation_id: 'orb_flourishing_v2'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['orb_tier_flourishing'],
      lacksGlobalFlags: ['samuel_acknowledged_flourishing']
    },
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['player_orb_flourishing']
      },
      {
        addGlobalFlags: ['samuel_acknowledged_flourishing']
      }
    ],
    choices: [
      {
        choiceId: 'orb_flourishing_earned',
        text: '"I\'ve earned the station\'s trust?"',
        nextNodeId: 'samuel_orb_flourishing_trust',
        pattern: 'exploring',
        skills: ['humility']
      },
      {
        choiceId: 'orb_flourishing_what_now',
        text: '"What happens now?"',
        nextNodeId: 'samuel_orb_flourishing_future',
        pattern: 'analytical',
        skills: ['strategicThinking']
      }
    ],
    tags: ['orb_resonance', 'milestone']
  },

  {
    nodeId: 'samuel_orb_flourishing_trust',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Trust isn't given.",
        emotion: 'respect',
        variation_id: 'orb_flourishing_trust_v1'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        trustChange: 1
      }
    ],
    choices: [
      {
        choiceId: 'orb_flourishing_trust_continue',
        text: 'Continue exploring',
        nextNodeId: 'samuel_hub_router',
        pattern: 'exploring'
      }
    ]
  },

  {
    nodeId: 'samuel_orb_flourishing_future',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Now? You keep going.",
        emotion: 'knowing',
        variation_id: 'orb_flourishing_future_v1'
      }
    ],
    choices: [
      {
        choiceId: 'orb_flourishing_future_continue',
        text: 'Continue exploring',
        nextNodeId: 'samuel_hub_router',
        pattern: 'exploring'
      }
    ]
  },

  // ============= ORB RESONANCE: MASTERED (100+ orbs) =============
  {
    nodeId: 'samuel_orb_mastered',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "*Samuel stops.",
        emotion: 'reverent',
        variation_id: 'orb_mastered_v1'
      },
      {
        text: "*The station seems to breathe around you*\n\nMost travelers... they come through looking for answers. What job. What path. What future.\n\nBut you? You found something better. You found yourself. And in doing that, you've become part of this place.",
        emotion: 'awe',
        variation_id: 'orb_mastered_v2'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['orb_tier_mastered'],
      lacksGlobalFlags: ['samuel_acknowledged_mastered']
    },
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['player_orb_mastered']
      },
      {
        addGlobalFlags: ['samuel_acknowledged_mastered']
      }
    ],
    choices: [
      {
        choiceId: 'orb_mastered_meaning',
        text: '"What does it mean to be part of the station?"',
        nextNodeId: 'samuel_orb_mastered_meaning',
        pattern: 'exploring',
        skills: ['visionaryThinking']
      },
      {
        choiceId: 'orb_mastered_gratitude',
        text: '"Thank you, Samuel. For everything."',
        nextNodeId: 'samuel_orb_mastered_gratitude',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['orb_resonance', 'milestone', 'mastery']
  },

  {
    nodeId: 'samuel_orb_mastered_meaning',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "It means your choices become guidance for people you'll never meet.\n\nNot through speeches, through patterns left in this place.\n\nYears from now someone may choose well without knowing you helped make that possible.",
        emotion: 'reverent',
        variation_id: 'orb_mastered_meaning_v1'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        trustChange: 2,
        addGlobalFlags: ['true_resonance_achieved']
      }
    ],
    choices: [
      {
        choiceId: 'orb_mastered_meaning_continue',
        text: 'Continue with quiet appreciation',
        nextNodeId: 'samuel_hub_router',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_orb_mastered_gratitude',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "*Samuel puts his cap back on, but you can see his eyes are bright* No. Thank you.",
        emotion: 'proud',
        variation_id: 'orb_mastered_gratitude_v1'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        trustChange: 2,
        addGlobalFlags: ['samuel_grateful', 'true_resonance_achieved']
      }
    ],
    choices: [
      {
        choiceId: 'orb_mastered_gratitude_continue',
        text: 'Continue exploring with renewed purpose',
        nextNodeId: 'samuel_hub_router',
        pattern: 'exploring'
      }
    ]
  }
]
