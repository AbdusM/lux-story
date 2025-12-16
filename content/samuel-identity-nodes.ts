/**
 * Samuel's Identity Dialogue Nodes
 *
 * These are special dialogues that trigger when a pattern crosses threshold 5.
 * Samuel notices the player's emerging identity and creates space for reflection.
 *
 * Design Philosophy:
 * - Samuel doesn't explain the mechanic - he notices the pattern
 * - These feel like natural conversation moments, not tutorial text
 * - Player receives identity thought AFTER this dialogue
 * - Samuel's voice: Warm, observant, giving space for self-discovery
 */

import { DialogueNode } from '@/lib/dialogue-graph'

/**
 * Samuel's Identity Dialogues
 * One for each of the 5 patterns
 *
 * Triggered when:
 * - Player's pattern crosses threshold 5
 * - Samuel is the current character OR player visits Samuel next
 * - Identity thought is in "developing" status
 */

export const samuelIdentityNodes: DialogueNode[] = [
  // ============= ANALYTICAL IDENTITY =============
  {
    nodeId: 'samuel_identity_analytical',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You been watchin' things real close. Notice how you pause before answerin'? Like you're turnin' somethin' over in your mind, lookin' at it from all sides.",
        emotion: 'observant',
        variation_id: 'analytical_observation_v1'
      },
      {
        text: "That's a way of bein', not just a way of thinkin'. Question is: you comfortable with that? Or you just passin' through?",
        emotion: 'warm',
        variation_id: 'analytical_question_v1'
      }
    ],
    choices: [
      {
        choiceId: 'acknowledge_analytical',
        text: '"I guess I do analyze things carefully"',
        nextNodeId: 'samuel_analytical_affirm',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'uncertain_analytical',
        text: '"I\'m not sure if that\'s really me"',
        nextNodeId: 'samuel_analytical_uncertain',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'explore_analytical',
        text: '"What do you notice about how I think?"',
        nextNodeId: 'samuel_analytical_reflect',
        pattern: 'exploring',
        skills: ['communication', 'adaptability'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'samuel_analytical_affirm',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Good. Own it. That analytical mind—it's a tool, but it's also part of who you are. Long as you remember: sometimes the answer ain't in the data. Sometimes it's in the quiet between numbers.",
        emotion: 'affirming',
        variation_id: 'analytical_affirm_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_main',
        text: '"I\'ll remember that"',
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'samuel_analytical_uncertain',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "That's honest. And maybe that's the point. You don't have to claim every pattern you show. Station's got room for you to be lots of things.\n\nJust remember: whether you name it or not, people see it. Question is whether you're steerin' it.",
        emotion: 'understanding',
        variation_id: 'analytical_uncertain_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_main_2',
        text: '"I\'ll think about it"',
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'samuel_analytical_reflect',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "See? Even now, you're askin' questions, lookin' for data. You count things. Measure. Compare. When Maya talks, you're trackinin' the logic. When Devon explains code, you're followin' the structure.\n\nThat mind of yours—it builds maps. Just make sure you don't mistake the map for the territory.",
        emotion: 'reflective',
        variation_id: 'analytical_reflect_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_main_3',
        text: '"That makes sense"',
        nextNodeId: 'samuel_hub_initial',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  // ============= PATIENCE IDENTITY =============
  {
    nodeId: 'samuel_identity_patience',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Noticed somethin' about you. When everyone else is rushin', you ain't. You let the moment breathe. Let things unfold.",
        emotion: 'observant',
        variation_id: 'patience_observation_v1'
      },
      {
        text: "Most folks fight that. They think movin' fast means gettin' somewhere. But you... you seem to know better. That true? Or you still figurin' it out?",
        emotion: 'warm',
        variation_id: 'patience_question_v1'
      }
    ],
    choices: [
      {
        choiceId: 'acknowledge_patience',
        text: '"I think rushing usually makes things worse"',
        nextNodeId: 'samuel_patience_affirm',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'uncertain_patience',
        text: '"Sometimes I wonder if I\'m just being slow"',
        nextNodeId: 'samuel_patience_uncertain',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'explore_patience',
        text: '"What makes you think that about me?"',
        nextNodeId: 'samuel_patience_reflect',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'samuel_patience_affirm',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Smart. Real smart. Patience ain't slowness—it's knowin' when to move and when to wait. That's wisdom, not hesitation.\n\nKeep that. World's gonna try to rush you. Don't let it.",
        emotion: 'affirming',
        variation_id: 'patience_affirm_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_main_4',
        text: '"Thank you, Samuel"',
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'samuel_patience_uncertain',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Slow and patient ain't the same thing. Slow is fear. Patient is choice. You're choosin' to let things develop at their own pace. That's strength, not weakness.\n\nBut if you're wonderin'... maybe you need to trust yourself more.",
        emotion: 'understanding',
        variation_id: 'patience_uncertain_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_main_5',
        text: '"I\'ll work on that"',
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'samuel_patience_reflect',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "When Marcus was talkin' about patient care, you didn't jump in. You listened. When Maya got overwhelmed, you didn't rush her—you gave her space.\n\nPatience is how you hold yourself in the world. Not passive. Active waitin'. There's power in that.",
        emotion: 'reflective',
        variation_id: 'patience_reflect_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_main_6',
        text: '"I never thought of it that way"',
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  // ============= EXPLORING IDENTITY =============
  {
    nodeId: 'samuel_identity_exploring',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You got that look. The one travelers get when they're mappin' new territory. Askin' questions nobody thought to ask. Checkin' corners most folks walk right past.",
        emotion: 'observant',
        variation_id: 'exploring_observation_v1'
      },
      {
        text: "Curiosity like that—it's either who you are, or it's somethin' you're tryin' on. Which is it?",
        emotion: 'warm',
        variation_id: 'exploring_question_v1'
      }
    ],
    choices: [
      {
        choiceId: 'acknowledge_exploring',
        text: '"I\'ve always needed to understand things"',
        nextNodeId: 'samuel_exploring_affirm',
        pattern: 'exploring',
        skills: ['adaptability'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'uncertain_exploring',
        text: '"Maybe I just don\'t know what I\'m looking for"',
        nextNodeId: 'samuel_exploring_uncertain',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'explore_exploring',
        text: '"What corners have I checked?"',
        nextNodeId: 'samuel_exploring_reflect',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'samuel_exploring_affirm',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Good. That hunger to understand—that's what moves the world forward. Just remember: sometimes the question's more important than the answer.\n\nKeep explorin'. But know when you found somethin' worth stayin' for.",
        emotion: 'affirming',
        variation_id: 'exploring_affirm_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_main_7',
        text: '"I will"',
        nextNodeId: 'samuel_hub_initial',
        pattern: 'exploring',
        skills: ['adaptability']
      }
    ]
  },

  {
    nodeId: 'samuel_exploring_uncertain',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Maybe so. But you're lookin', and that counts. Some folks stop searchin' before they even start.\n\nYou'll know what you're lookin' for when you find it. Or maybe... you're lookin' for the lookin' itself.",
        emotion: 'understanding',
        variation_id: 'exploring_uncertain_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_main_8',
        text: '"That\'s a strange thought"',
        nextNodeId: 'samuel_hub_initial',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  {
    nodeId: 'samuel_exploring_reflect',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You asked Jordan about the neighborhoods nobody visits. Asked Tess about the music nobody streams. Asked me about the platforms most travelers ignore.\n\nYou're not just curious—you're thorough. You explore edges. That's the mark of someone who sees the world different.",
        emotion: 'reflective',
        variation_id: 'exploring_reflect_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_main_9',
        text: '"I didn\'t realize I was doing that"',
        nextNodeId: 'samuel_hub_initial',
        pattern: 'exploring',
        skills: ['adaptability']
      }
    ]
  },

  // ============= HELPING IDENTITY =============
  {
    nodeId: 'samuel_identity_helping',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You lean in when people talk. Really listen. I see you offerin' support before folks even ask for it. That ain't common.",
        emotion: 'observant',
        variation_id: 'helping_observation_v1'
      },
      {
        text: "Some people help 'cause they think they should. Others help 'cause they can't not. Which one are you?",
        emotion: 'warm',
        variation_id: 'helping_question_v1'
      }
    ],
    choices: [
      {
        choiceId: 'acknowledge_helping',
        text: '"I care when people are struggling"',
        nextNodeId: 'samuel_helping_affirm',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'uncertain_helping',
        text: '"Sometimes I wonder if I help too much"',
        nextNodeId: 'samuel_helping_uncertain',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'explore_helping',
        text: '"When have you seen me do that?"',
        nextNodeId: 'samuel_helping_reflect',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'samuel_helping_affirm',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Good answer. Honest. That compassion—it's a gift. Don't let nobody make you feel weak for havin' it.\n\nJust remember: you can't pour from an empty cup. Help others, but help yourself too.",
        emotion: 'affirming',
        variation_id: 'helping_affirm_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_main_10',
        text: '"I\'ll remember that"',
        nextNodeId: 'samuel_hub_initial',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'samuel_helping_uncertain',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Maybe. Or maybe you're worried about bein' too much. Listen: there's a difference between helpin' and fixin'. You can hold space for someone without carryin' their whole load.\n\nYour instinct to help? That's beautiful. Just make sure it ain't costin' you.",
        emotion: 'understanding',
        variation_id: 'helping_uncertain_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_main_11',
        text: '"How do I know the difference?"',
        nextNodeId: 'samuel_hub_initial',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  {
    nodeId: 'samuel_helping_reflect',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "When Maya was overwhelmed, you didn't try to solve it. You just... listened. When Jordan talked about community work, your whole face lit up. When Marcus mentioned patient care, you asked how he handles the emotional weight.\n\nYou connect to people's struggles. That's empathy. Real empathy. Holds the world together.",
        emotion: 'reflective',
        variation_id: 'helping_reflect_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_main_12',
        text: '"I never thought about it like that"',
        nextNodeId: 'samuel_hub_initial',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  // ============= BUILDING IDENTITY =============
  {
    nodeId: 'samuel_identity_building',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Your hands move when you talk about ideas. Like you're already shapin' somethin' in your mind. You see a problem, you don't just analyze it—you wanna build the solution.",
        emotion: 'observant',
        variation_id: 'building_observation_v1'
      },
      {
        text: "That's a maker's mindset. Question is: you claimin' it? Or you just borrowin' it for a while?",
        emotion: 'warm',
        variation_id: 'building_question_v1'
      }
    ],
    choices: [
      {
        choiceId: 'acknowledge_building',
        text: '"I\'ve always liked creating things"',
        nextNodeId: 'samuel_building_affirm',
        pattern: 'building',
        skills: ['creativity'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'uncertain_building',
        text: '"I\'m not sure I\'m good enough to call myself a builder"',
        nextNodeId: 'samuel_building_uncertain',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'explore_building',
        text: '"What have you seen me want to build?"',
        nextNodeId: 'samuel_building_reflect',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'samuel_building_affirm',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Then claim it. World needs makers. People who don't just talk about change—they build it.\n\nJust remember: buildin' ain't always about addin'. Sometimes it's about knowin' what to take away. Keep that builder's eye sharp.",
        emotion: 'affirming',
        variation_id: 'building_affirm_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_main_13',
        text: '"I will"',
        nextNodeId: 'samuel_hub_initial',
        pattern: 'building',
        skills: ['creativity']
      }
    ]
  },

  {
    nodeId: 'samuel_building_uncertain',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Bein' good ain't the same as bein' a builder. Every master started not knowin' what they were doin'. The question ain't skill—it's commitment.\n\nYou got the instinct. You see somethin', you wanna improve it. That's the heart of it. Skill comes with time.",
        emotion: 'understanding',
        variation_id: 'building_uncertain_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_main_14',
        text: '"That helps"',
        nextNodeId: 'samuel_hub_initial',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'samuel_building_reflect',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "When Maya showed you that robot, you didn't just look—you asked how it works, how it could be better. When Devon talked code, you were thinkin' about what you'd build with it. When Jordan mentioned community programs, you lit up talkin' about what could be created.\n\nYou're a builder. Not 'cause you've built everything. 'Cause you see the world as materials waitin' to become somethin' better.",
        emotion: 'reflective',
        variation_id: 'building_reflect_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_main_15',
        text: '"I like that way of thinking"',
        nextNodeId: 'samuel_hub_initial',
        pattern: 'building',
        skills: ['creativity']
      }
    ]
  }
]

/**
 * Export for integration into Samuel's main dialogue graph
 */
export const samuelIdentityGraph = {
  nodes: samuelIdentityNodes,
  entryPoints: {
    analytical: 'samuel_identity_analytical',
    patience: 'samuel_identity_patience',
    exploring: 'samuel_identity_exploring',
    helping: 'samuel_identity_helping',
    building: 'samuel_identity_building'
  }
}
