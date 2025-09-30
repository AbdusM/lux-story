/**
 * Example implementation of Reciprocity Nodes in Maya's Dialogue Graph
 *
 * This shows how to integrate player questions into the existing dialogue flow.
 * These nodes should be inserted after Maya has made her choice (high trust established)
 * but before the farewell sequence.
 */

import { DialogueNode } from '../lib/dialogue-graph'
import { parentalWorkLegacy, unlimitedResources } from './player-questions'

// Example reciprocity nodes to add to maya-dialogue-graph.ts

export const mayaReciprocityNodes: DialogueNode[] = [
  // ============= RECIPROCITY ASK NODE =============
  // This comes after maya_chooses_robotics/hybrid/self
  {
    nodeId: 'maya_reciprocity_ask',
    speaker: 'Maya Chen',
    content: [
      {
        text: "*She pauses, looking at you with new curiosity* | You know so much about my struggle now. You helped me see what I couldn't. | Can I... can I ask you something personal? About your own path?",
        emotion: 'curious',
        variation_id: 'reciprocity_ask_v1'
      }
    ],
    requiredState: {
      trust: { min: 6 },
      hasKnowledgeFlags: ['knows_family_pressure', 'helped_with_choice'],
      hasGlobalFlags: ['maya_arc_complete']
    },
    choices: [
      {
        choiceId: 'allow_question',
        text: "Of course. After everything you've shared, it's only fair.",
        nextNodeId: 'maya_reciprocity_question',
        pattern: 'helping',
        consequence: {
          characterId: 'maya',
          trustChange: 1,
          addKnowledgeFlags: ['player_opened_up']
        }
      },
      {
        choiceId: 'deflect_question',
        text: "I'd rather not talk about that, if it's okay.",
        nextNodeId: 'maya_graceful_decline',
        pattern: 'patience'
      }
    ],
    tags: ['reciprocity', 'maya_arc']
  },

  // ============= RECIPROCITY QUESTION NODE =============
  {
    nodeId: 'maya_reciprocity_question',
    speaker: 'Maya Chen',
    content: [
      {
        // This pulls the question text from player-questions.ts
        text: parentalWorkLegacy.questionText,
        emotion: 'interested',
        variation_id: 'parental_work_question_v1'
      }
    ],
    requiredState: {
      trust: { min: 6 },
      hasKnowledgeFlags: ['player_opened_up']
    },
    choices: [
      // These choices come from the question definition
      {
        choiceId: parentalWorkLegacy.choices[0].choiceId,
        text: parentalWorkLegacy.choices[0].choiceText,
        nextNodeId: 'maya_reciprocity_response_stable',
        pattern: 'patience', // Matches the pattern impact
        // The state changes update PlayerPatterns
        consequences: parentalWorkLegacy.choices[0].stateChanges
      },
      {
        choiceId: parentalWorkLegacy.choices[1].choiceId,
        text: parentalWorkLegacy.choices[1].choiceText,
        nextNodeId: 'maya_reciprocity_response_entrepreneur',
        pattern: 'exploring',
        consequences: parentalWorkLegacy.choices[1].stateChanges
      },
      {
        choiceId: parentalWorkLegacy.choices[2].choiceId,
        text: parentalWorkLegacy.choices[2].choiceText,
        nextNodeId: 'maya_reciprocity_response_struggling',
        pattern: 'helping',
        consequences: parentalWorkLegacy.choices[2].stateChanges
      },
      {
        choiceId: parentalWorkLegacy.choices[3].choiceId,
        text: parentalWorkLegacy.choices[3].choiceText,
        nextNodeId: 'maya_reciprocity_response_absent',
        pattern: 'patience',
        consequences: parentalWorkLegacy.choices[3].stateChanges
      }
    ],
    tags: ['reciprocity', 'player_reveal', 'maya_arc']
  },

  // ============= RECIPROCITY RESPONSES =============
  // Maya responds to each possible player answer
  {
    nodeId: 'maya_reciprocity_response_stable',
    speaker: 'Maya Chen',
    content: [
      {
        text: parentalWorkLegacy.choices[0].npcResponse || "That's why you were so patient with me. You understand the weight of expectations.",
        emotion: 'understanding',
        variation_id: 'response_stable_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_second_question',
        text: "Your turn - another question?",
        nextNodeId: 'maya_second_reciprocity_ask',
        pattern: 'exploring',
        visibleCondition: {
          trust: { min: 7 }
        }
      },
      {
        choiceId: 'continue_to_farewell',
        text: "Thank you for asking. It helped me understand myself better.",
        nextNodeId: 'maya_farewell_robotics',
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['learned_player_background']
      }
    ]
  },

  {
    nodeId: 'maya_reciprocity_response_entrepreneur',
    speaker: 'Maya Chen',
    content: [
      {
        text: parentalWorkLegacy.choices[1].npcResponse || "That explains why you pushed me to consider robotics. You see possibility, not just risk.",
        emotion: 'understanding',
        variation_id: 'response_entrepreneur_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_second_question',
        text: "Your turn - another question?",
        nextNodeId: 'maya_second_reciprocity_ask',
        pattern: 'exploring',
        visibleCondition: {
          trust: { min: 7 }
        }
      },
      {
        choiceId: 'continue_to_farewell',
        text: "Thank you for asking. It felt good to share that.",
        nextNodeId: 'maya_farewell_robotics',
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['learned_player_background']
      }
    ]
  },

  {
    nodeId: 'maya_reciprocity_response_struggling',
    speaker: 'Maya Chen',
    content: [
      {
        text: parentalWorkLegacy.choices[2].npcResponse || "You know what it's like to carry weight. That's why you could hold space for mine.",
        emotion: 'touched',
        variation_id: 'response_struggling_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_farewell',
        text: "We both know about carrying weight. Maybe that's why we found each other here.",
        nextNodeId: 'maya_farewell_robotics',
        pattern: 'helping'
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['learned_player_background', 'deep_connection']
      }
    ]
  },

  {
    nodeId: 'maya_reciprocity_response_absent',
    speaker: 'Maya Chen',
    content: [
      {
        text: parentalWorkLegacy.choices[3].npcResponse || "So you learned early that achievement has costs. No wonder you understood my conflict.",
        emotion: 'understanding',
        variation_id: 'response_absent_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_farewell',
        text: "We both learned different lessons about the price of success.",
        nextNodeId: 'maya_farewell_robotics',
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['learned_player_background']
      }
    ]
  },

  // ============= SECOND RECIPROCITY (Optional, Trust 7+) =============
  {
    nodeId: 'maya_second_reciprocity_ask',
    speaker: 'Maya Chen',
    content: [
      {
        text: "*She seems more relaxed now, the mutual vulnerability creating a different energy* | One more question, if that's okay? | This one's been on my mind since you helped me see beyond the obvious paths.",
        emotion: 'thoughtful',
        variation_id: 'second_ask_v1'
      }
    ],
    requiredState: {
      trust: { min: 7 },
      hasKnowledgeFlags: ['learned_player_background']
    },
    choices: [
      {
        choiceId: 'allow_second',
        text: "Go ahead. This feels like a real conversation now.",
        nextNodeId: 'maya_unlimited_resources_question',
        pattern: 'helping'
      },
      {
        choiceId: 'enough_sharing',
        text: "I think we've shared enough for one night.",
        nextNodeId: 'maya_farewell_robotics',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'maya_unlimited_resources_question',
    speaker: 'Maya Chen',
    content: [
      {
        text: unlimitedResources.questionText,
        emotion: 'curious',
        variation_id: 'unlimited_resources_v1'
      }
    ],
    choices: [
      {
        choiceId: unlimitedResources.choices[0].choiceId,
        text: unlimitedResources.choices[0].choiceText,
        nextNodeId: 'maya_unlimited_response_create',
        pattern: 'building',
        consequences: unlimitedResources.choices[0].stateChanges
      },
      {
        choiceId: unlimitedResources.choices[1].choiceId,
        text: unlimitedResources.choices[1].choiceText,
        nextNodeId: 'maya_unlimited_response_explore',
        pattern: 'exploring',
        consequences: unlimitedResources.choices[1].stateChanges
      },
      {
        choiceId: unlimitedResources.choices[2].choiceId,
        text: unlimitedResources.choices[2].choiceText,
        nextNodeId: 'maya_unlimited_response_teach',
        pattern: 'helping',
        consequences: unlimitedResources.choices[2].stateChanges
      },
      {
        choiceId: unlimitedResources.choices[3].choiceId,
        text: unlimitedResources.choices[3].choiceText,
        nextNodeId: 'maya_unlimited_response_rest',
        pattern: 'patience',
        consequences: unlimitedResources.choices[3].stateChanges
      }
    ]
  },

  {
    nodeId: 'maya_unlimited_response_create',
    speaker: 'Maya Chen',
    content: [
      {
        text: "Pure creation drive. That's what I feel with robotics. The need to make something exist. | *She smiles* | We're both builders, aren't we? Just building different things.",
        emotion: 'connected',
        variation_id: 'unlimited_create_v1'
      }
    ],
    choices: [
      {
        choiceId: 'final_farewell',
        text: "I guess we are. Thank you for seeing that in me.",
        nextNodeId: 'maya_farewell_robotics',
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['deep_mutual_understanding'],
        setRelationshipStatus: 'profound_connection'
      }
    ]
  },

  // ... Similar response nodes for explore, teach, and rest options ...
]

/**
 * INTEGRATION INSTRUCTIONS:
 *
 * 1. Import the reciprocity questions at the top of maya-dialogue-graph.ts:
 *    import { parentalWorkLegacy, unlimitedResources } from './player-questions'
 *
 * 2. Add these reciprocity nodes to the mayaDialogueNodes array
 *
 * 3. Update the exit nodes (maya_chooses_robotics, maya_chooses_hybrid, maya_chooses_self)
 *    to point to 'maya_reciprocity_ask' instead of directly to farewell:
 *
 *    choices: [
 *      {
 *        choiceId: 'continue_after_robotics',
 *        text: "I'm glad I could help.",
 *        nextNodeId: 'maya_reciprocity_ask', // Changed from maya_farewell_robotics
 *        pattern: 'helping'
 *      }
 *    ]
 *
 * 4. The reciprocity flow:
 *    - Player helps Maya reach decision (trust 5+)
 *    - Maya asks permission to ask personal question
 *    - If granted, Maya asks about parental work legacy
 *    - Player answers, updating their PlayerPatterns
 *    - Maya responds based on answer
 *    - If trust 7+, option for second question (unlimited resources)
 *    - Flow continues to farewell
 */