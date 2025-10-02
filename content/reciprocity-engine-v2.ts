/**
 * Reciprocity Engine v2: Human-Centered Design
 *
 * This implementation addresses the three critical mandates:
 * 1. Every Question requires a meaningful Reaction Node
 * 2. Every Ask requires a Graceful Decline Path
 * 3. Every Answer requires a Samuel Reflection
 *
 * The goal is to create genuine moments of mutual vulnerability,
 * not a jarring quiz show experience.
 */

import { DialogueNode } from '../lib/dialogue-graph'
import { parentalWorkLegacy, unlimitedResources } from './player-questions'

// ============= MANDATE 1: GRACEFUL DECLINE PATH =============
export const gracefulDeclineNodes: DialogueNode[] = [
  {
    nodeId: 'maya_graceful_decline',
    speaker: 'Maya Chen',
    content: [
      {
        text: "*She smiles softly, with genuine understanding* | Of course. Thank you for being honest with me. | *She fidgets with her notebook* | You know what? The fact that you feel safe enough to say 'no' means more than any answer you could have given. | You've held space for my story without demanding I earn it. I can do the same for you.",
        emotion: 'warm_understanding',
        variation_id: 'graceful_decline_v1'
      }
    ],
    choices: [
      {
        choiceId: 'appreciate_understanding',
        text: "Thank you for understanding.",
        nextNodeId: 'maya_decline_appreciation',
        pattern: 'patience',
        consequence: {
          characterId: 'maya',
          trustChange: 1, // REWARD for setting boundaries
          addKnowledgeFlags: ['respected_boundaries']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'maya',
        addKnowledgeFlags: ['player_set_boundary', 'deeper_trust_established']
      }
    ],
    tags: ['reciprocity', 'boundary_respect', 'maya_arc']
  },

  {
    nodeId: 'maya_decline_appreciation',
    speaker: 'Maya Chen',
    content: [
      {
        text: "You've taught me something important tonight. | Not every question needs an answer. Sometimes the space between people is sacred precisely because we choose what to share. | *She looks at Platform 1 glowing softly* | My train's coming soon. But this conversation... it changed things.",
        emotion: 'grateful',
        variation_id: 'decline_appreciation_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_farewell',
        text: "I'm glad we met here.",
        nextNodeId: 'maya_farewell_robotics',
        pattern: 'helping'
      }
    ]
  }
]

// ============= MANDATE 2: MEANINGFUL REACTION NODES =============
export const enhancedReactionNodes: DialogueNode[] = [
  // Reaction to "Stable Career Parent"
  {
    nodeId: 'maya_reaction_stable_enhanced',
    speaker: 'Maya Chen',
    content: [
      {
        text: "*Her eyes widen with recognition* | That makes so much sense. That consistency, that foundation... | I can see why you're so patient with people like me who are spiraling. You grew up with solid ground beneath you. | *She pauses, thoughtful* | For me, it was the opposite. My parents gave up everything stable to come here. Every day was a gamble on the future. | Maybe that's why your patience felt so... safe. Like something I could trust.",
        emotion: 'connecting_dots',
        variation_id: 'stable_reaction_enhanced_v1'
      }
    ],
    choices: [
      {
        choiceId: 'mutual_understanding',
        text: "We balance each other out.",
        nextNodeId: 'maya_deeper_connection',
        pattern: 'helping',
        consequence: {
          characterId: 'maya',
          trustChange: 1,
          addKnowledgeFlags: ['shared_vulnerability', 'player_revealed_stable_parents']
        }
      },
      {
        choiceId: 'acknowledge_difference',
        text: "Different foundations, same station.",
        nextNodeId: 'maya_philosophical_moment',
        pattern: 'patience',
        consequence: {
          characterId: 'maya',
          addKnowledgeFlags: ['shared_vulnerability', 'player_revealed_stable_parents']
        }
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['player_shared_parental_work_legacy']
      }
    ]
  },

  // Reaction to "Entrepreneurial Parent"
  {
    nodeId: 'maya_reaction_entrepreneur_enhanced',
    speaker: 'Maya Chen',
    content: [
      {
        text: "*She laughs, but it's not bitter - it's recognition* | Of course! That's why you pushed me toward robotics without hesitation. | Risk is normal for you. Starting fresh, building something from nothing - that's your inherited language. | *She looks at her med school textbooks* | My parents took one huge risk coming to America. They want me to never have to risk again. | But you... you grew up seeing risk as possibility, not threat. That's why you could see my path when I couldn't.",
        emotion: 'dawning_understanding',
        variation_id: 'entrepreneur_reaction_enhanced_v1'
      }
    ],
    choices: [
      {
        choiceId: 'risk_as_inheritance',
        text: "We inherit more than we realize.",
        nextNodeId: 'maya_inheritance_reflection',
        pattern: 'analytical',
        consequence: {
          characterId: 'maya',
          trustChange: 1,
          addKnowledgeFlags: ['shared_vulnerability', 'player_revealed_entrepreneur_parents']
        }
      },
      {
        choiceId: 'different_kinds_of_brave',
        text: "Your parents were brave too, just differently.",
        nextNodeId: 'maya_bravery_types',
        pattern: 'helping',
        consequence: {
          characterId: 'maya',
          addKnowledgeFlags: ['shared_vulnerability', 'player_revealed_entrepreneur_parents']
        }
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['player_shared_parental_work_legacy']
      }
    ]
  },

  // Reaction to "Struggling Parent"
  {
    nodeId: 'maya_reaction_struggling_enhanced',
    speaker: 'Maya Chen',
    content: [
      {
        text: "*Her expression softens into something deeper than sympathy* | Oh. | *Long pause* | You know what it's like to watch someone you love fight just to stay afloat. | That's why you didn't try to fix me or minimize my struggle. You've seen what real weight looks like. | *She reaches toward you, then stops* | When you helped me, you weren't performing empathy. You were remembering. | That's... that's different. That's real.",
        emotion: 'profound_connection',
        variation_id: 'struggling_reaction_enhanced_v1'
      }
    ],
    choices: [
      {
        choiceId: 'shared_weight',
        text: "Some weights teach us how to help carry others.",
        nextNodeId: 'maya_weight_wisdom',
        pattern: 'helping',
        consequence: {
          characterId: 'maya',
          trustChange: 2,
          addKnowledgeFlags: ['deep_vulnerability_shared', 'player_revealed_struggling_parents'],
          setRelationshipStatus: 'confidant'
        }
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['player_shared_parental_work_legacy', 'deep_reciprocal_vulnerability']
      }
    ]
  },

  // Reaction to "Absent Parent"
  {
    nodeId: 'maya_reaction_absent_enhanced',
    speaker: 'Maya Chen',
    content: [
      {
        text: "*She nods slowly, understanding crossing her face* | Success at the cost of presence. | You learned early that achievement and absence can be the same thing. | *She looks at her stack of study materials* | I've been so afraid of disappointing my parents, I never considered I might disappear into my achievements. | You saw that in me, didn't you? The risk of succeeding at the wrong thing.",
        emotion: 'sobering_realization',
        variation_id: 'absent_reaction_enhanced_v1'
      }
    ],
    choices: [
      {
        choiceId: 'success_paradox',
        text: "Success means different things to different people.",
        nextNodeId: 'maya_success_definitions',
        pattern: 'analytical',
        consequence: {
          characterId: 'maya',
          trustChange: 1,
          addKnowledgeFlags: ['shared_vulnerability', 'player_revealed_absent_parents']
        }
      },
      {
        choiceId: 'presence_matters',
        text: "Being present for your own life matters too.",
        nextNodeId: 'maya_presence_philosophy',
        pattern: 'patience',
        consequence: {
          characterId: 'maya',
          addKnowledgeFlags: ['shared_vulnerability', 'player_revealed_absent_parents']
        }
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['player_shared_parental_work_legacy']
      }
    ]
  }
]

// ============= MANDATE 3: SAMUEL REFLECTION NODES =============
export const samuelReflectionNodes: DialogueNode[] = [
  // Samuel reflects on stable parent revelation
  {
    nodeId: 'samuel_reflects_stable_parents',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "*He looks at you with knowing eyes* | I was thinking about what you told Maya. About your parents and their stable careers. | *He nods slowly* | It helps me understand the way you approach problems - with a patience that comes from solid foundation. | You've never had to rush because you've never had to run. That's a gift you give others without realizing it. | The station shows me these patterns. Your patience isn't just a trait - it's an inheritance.",
        emotion: 'insightful',
        variation_id: 'stable_parents_reflection_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['player_revealed_stable_parents'],
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'never_thought_of_it',
        text: "I never thought of patience as inherited.",
        nextNodeId: 'samuel_inheritance_wisdom',
        pattern: 'exploring'
      },
      {
        choiceId: 'makes_sense',
        text: "That actually makes a lot of sense.",
        nextNodeId: 'samuel_pattern_confirmation',
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['discussed_player_background', 'closed_reciprocity_loop']
      }
    ]
  },

  // Samuel reflects on entrepreneur parent revelation
  {
    nodeId: 'samuel_reflects_entrepreneur_parents',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Maya told me you opened up to her. About growing up with parents who were always building something new. | *He smiles knowingly* | That explains your exploring pattern. You don't see closed doors - you see opportunities to build new ones. | Risk feels like possibility to you because that's the water you swam in growing up. | The station called you here because you have the rare ability to help others see possibility where they see only walls.",
        emotion: 'appreciative',
        variation_id: 'entrepreneur_parents_reflection_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['player_revealed_entrepreneur_parents'],
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'pattern_recognition',
        text: "You really do see the patterns, don't you?",
        nextNodeId: 'samuel_pattern_wisdom',
        pattern: 'analytical'
      },
      {
        choiceId: 'helping_see_possibility',
        text: "I try to help people see what's possible.",
        nextNodeId: 'samuel_possibility_keeper',
        pattern: 'helping'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['discussed_player_background', 'closed_reciprocity_loop']
      }
    ]
  },

  // Samuel reflects on struggling parent revelation
  {
    nodeId: 'samuel_reflects_struggling_parents',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "*His voice is gentle, respectful of the weight you've shared* | Maya mentioned you shared something difficult with her. About watching your parents struggle. | *Long pause* | That kind of witnessing changes you. Makes you see need before it's spoken. Makes you hold space before it's asked for. | You have the helper pattern not because you chose it, but because life taught you early what it means to need help. | That's not a burden. That's wisdom. The station recognizes servants who serve from understanding, not obligation.",
        emotion: 'deep_respect',
        variation_id: 'struggling_parents_reflection_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['player_revealed_struggling_parents'],
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'wisdom_from_struggle',
        text: "I never saw it as wisdom before.",
        nextNodeId: 'samuel_struggle_transformation',
        pattern: 'patience'
      },
      {
        choiceId: 'understanding_not_obligation',
        text: "Understanding, not obligation. I like that framing.",
        nextNodeId: 'samuel_service_philosophy',
        pattern: 'helping'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['discussed_player_background', 'closed_reciprocity_loop'],
        trustChange: 1
      }
    ]
  },

  // Samuel reflects on absent parent revelation
  {
    nodeId: 'samuel_reflects_absent_parents',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I heard you shared something personal with Maya. About success and absence in your family. | *He looks out at the platforms* | You learned early that achievement can become a disappearing act. That's why you have such patience with others' journeys. | You're not rushing anyone because you know where rushing leads - to being successful and hollow. | The station brought you here because you understand something crucial: presence matters more than performance.",
        emotion: 'understanding',
        variation_id: 'absent_parents_reflection_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['player_revealed_absent_parents'],
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'presence_over_performance',
        text: "Presence over performance. Still learning that.",
        nextNodeId: 'samuel_presence_teaching',
        pattern: 'patience'
      },
      {
        choiceId: 'hollow_success',
        text: "I've seen what hollow success looks like.",
        nextNodeId: 'samuel_hollow_wisdom',
        pattern: 'analytical'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['discussed_player_background', 'closed_reciprocity_loop']
      }
    ]
  },

  // Samuel reflects on boundary setting (declined to answer)
  {
    nodeId: 'samuel_reflects_boundaries',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "*He smiles with deep approval* | Maya told me something interesting. Not what you shared with her - but that you chose NOT to share something when she asked. | *He leans forward* | Do you know how rare that is? Most people perform vulnerability to earn connection. But you set a boundary, kindly but firmly. | That's mastery. Maya's trust in you grew not despite your 'no,' but because of it. | The station respects those who know the difference between walls and boundaries.",
        emotion: 'profound_respect',
        variation_id: 'boundaries_reflection_v1'
      }
    ],
    requiredState: {
      hasKnowledgeFlags: ['player_set_boundary'],
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'didnt_feel_like_mastery',
        text: "It didn't feel like mastery. Just honesty.",
        nextNodeId: 'samuel_honesty_mastery',
        pattern: 'patience',
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      },
      {
        choiceId: 'walls_vs_boundaries',
        text: "Walls and boundaries - that's an important distinction.",
        nextNodeId: 'samuel_boundary_philosophy',
        pattern: 'analytical'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['recognized_boundary_wisdom', 'closed_reciprocity_loop']
      }
    ]
  }
]

/**
 * INTEGRATION INSTRUCTIONS v2:
 *
 * 1. The reciprocity flow now includes:
 *    - Graceful decline path that REWARDS boundary-setting
 *    - Enhanced reaction nodes with real conversation, not generic responses
 *    - Samuel reflection nodes that close the feedback loop
 *
 * 2. Key architectural changes:
 *    - Every player answer leads to a meaningful NPC reaction
 *    - Declining to answer builds MORE trust, not less
 *    - Samuel explicitly references what was shared, making patterns visible
 *
 * 3. New knowledge flags to track:
 *    - player_revealed_[parent_type]_parents (for Samuel reflection)
 *    - player_set_boundary (for boundary respect path)
 *    - shared_vulnerability / deep_vulnerability_shared
 *    - closed_reciprocity_loop (Samuel has reflected on revelation)
 *
 * 4. Implementation priority:
 *    - First: Add graceful decline paths (prevents feeling manipulative)
 *    - Second: Enhance reaction nodes (makes exchange feel real)
 *    - Third: Add Samuel reflections (closes the loop, explains patterns)
 *
 * This transforms the Reciprocity Engine from a quiz show into genuine mutual vulnerability.
 */