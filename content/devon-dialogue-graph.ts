/**
 * Devon Kumar's Dialogue Graph
 * The Builder's Track - Platform 3
 *
 * CHARACTER: The Family Debugger
 * Core conflict: Trying to "debug" his relationship with his grieving father
 * Arc: Systems engineer learns empathy is data, not the opposite of logic
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'
import { buildDialogueNodesMap, filterDraftNodes } from './drafts/draft-filter'

export const devonDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'devon_introduction_after_building',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Pass me the... no, the other wrench. The one that's actually regulation.\n\nShift change isn't for ten minutes. If you're here to complain about the heat, join the queue. If you're here to help, grab the duct tape.",
        emotion: 'guarded',
        variation_id: 'intro_after_building_v1',
        patternReflection: [
          { pattern: 'analytical', minLevel: 5, altText: "Avondale coffee shop. Back booth. 2 AM.\n\nOh. You're reading the logic flow, aren't you? Most people don't even see it.\n\nClosed system. But maybe you understand closed systems.", altEmotion: 'curious' },
          { pattern: 'building', minLevel: 5, altText: "Avondale coffee shop. Back booth. 2 AM.\n\nDecision tree. Flowchart. You've built things like this before, haven't you?\n\nMost people don't recognize the architecture. But you do.", altEmotion: 'interested' },
          { pattern: 'patience', minLevel: 5, altText: "Avondale coffee shop. Back booth. 2 AM.\n\nOh. You're just... waiting. Not rushing me. That's different.\n\nClosed system. Are you a variable I need to account for?", altEmotion: 'guarded' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'intro_curious_after_building',
        text: "What are you working on?",
        nextNodeId: 'devon_explains_system',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        },
        voiceVariations: {
          analytical: "What system is this? Walk me through the logic.",
          helping: "You look like you're solving something important.",
          building: "What are you building? I want to see.",
          exploring: "What are you working on?",
          patience: "I'm curious about what you're working on."
        }
      },
      {
        choiceId: 'intro_technical_after_building',
        text: "That looks like a decision tree. For what?",
        nextNodeId: 'devon_technical_response',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['recognizes_technical_work']
        },
        voiceVariations: {
          analytical: "That looks like a decision tree. For what?",
          helping: "That flowchart... it's about people, isn't it?",
          building: "I recognize that structure. Decision tree. What's the output?",
          exploring: "Interesting diagram. What does it do?",
          patience: "That looks complex. A decision tree?"
        }
      },
      {
        choiceId: 'intro_gentle_after_building',
        text: "I'm just passing through. You seem focused.",
        nextNodeId: 'devon_defends_focus',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        },
        voiceVariations: {
          analytical: "I won't interrupt your process. Just observing.",
          helping: "I don't want to disrupt you. You seem deep in something.",
          building: "I can see you're in the zone. I'll wait.",
          exploring: "Don't mind me. I'm just curious what's happening here.",
          patience: "I'm just passing through. You seem focused."
        }
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        setRelationshipStatus: 'stranger'
      },
      {
        platformChanges: [{
          platformId: 'platform-7',
          warmthDelta: 1
        }]
      }
    ],
    tags: ['introduction', 'devon_arc']
  },

  {
    nodeId: 'devon_introduction_after_empathy',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Pass me the... no, the other wrench. The one that's actually regulation.\n\nShift change isn't for ten minutes. If you're here to complain about the heat, join the queue. If you're here to help, grab the duct tape.",
        emotion: 'guarded',
        variation_id: 'intro_after_empathy_v1',
        patternReflection: [
          { pattern: 'analytical', minLevel: 5, altText: "Avondale coffee shop. Back booth. 2 AM.\n\nOh. You're reading the logic flow, aren't you? Most people don't even see it.\n\nClosed system. But maybe you understand closed systems.", altEmotion: 'curious' },
          { pattern: 'building', minLevel: 5, altText: "Avondale coffee shop. Back booth. 2 AM.\n\nDecision tree. Flowchart. You've built things like this before, haven't you?\n\nMost people don't recognize the architecture. But you do.", altEmotion: 'interested' },
          { pattern: 'patience', minLevel: 5, altText: "Avondale coffee shop. Back booth. 2 AM.\n\nOh. You're just... waiting. Not rushing me. That's different.\n\nClosed system. Are you a variable I need to account for?", altEmotion: 'guarded' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'intro_curious_after_empathy',
        text: "What are you working on?",
        nextNodeId: 'devon_explains_system',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        },
        voiceVariations: {
          analytical: "What system is this? Walk me through the logic.",
          helping: "You look like you're solving something important.",
          building: "What are you building? I want to see.",
          exploring: "What are you working on?",
          patience: "I'm curious about what you're working on."
        }
      },
      {
        choiceId: 'intro_technical_after_empathy',
        text: "That looks like a decision tree. For what?",
        nextNodeId: 'devon_technical_response',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['recognizes_technical_work']
        },
        voiceVariations: {
          analytical: "That looks like a decision tree. For what?",
          helping: "That flowchart... it's about people, isn't it?",
          building: "I recognize that structure. Decision tree. What's the output?",
          exploring: "Interesting diagram. What does it do?",
          patience: "That looks complex. A decision tree?"
        }
      },
      {
        choiceId: 'intro_gentle_after_empathy',
        text: "I'm just passing through. You seem focused.",
        nextNodeId: 'devon_defends_focus',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        },
        voiceVariations: {
          analytical: "I won't interrupt your process. Just observing.",
          helping: "I don't want to disrupt you. You seem deep in something.",
          building: "I can see you're in the zone. I'll wait.",
          exploring: "Don't mind me. I'm just curious what's happening here.",
          patience: "I'm just passing through. You seem focused."
        }
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        setRelationshipStatus: 'stranger'
      },
      {
        platformChanges: [{
          platformId: 'platform-7',
          warmthDelta: 1
        }]
      }
    ],
    tags: ['introduction', 'devon_arc']
  },

  {
    nodeId: 'devon_introduction',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Pass me the... no, the other wrench. The one that's actually regulation.\n\nShift change isn't for ten minutes. If you're here to complain about the heat, join the queue. If you're here to help, grab the duct tape.",
        emotion: 'guarded',
        variation_id: 'intro_v2_minimal',
        patternReflection: [
          { pattern: 'analytical', minLevel: 5, altText: "Avondale coffee shop. Back booth. 2 AM.\n\nOh. You're reading the logic flow, aren't you? Most people don't even see it.\n\nClosed system. But maybe you understand closed systems.", altEmotion: 'curious' },
          { pattern: 'building', minLevel: 5, altText: "Avondale coffee shop. Back booth. 2 AM.\n\nDecision tree. Flowchart. You've built things like this before, haven't you?\n\nMost people don't recognize the architecture. But you do.", altEmotion: 'interested' },
          { pattern: 'patience', minLevel: 5, altText: "Avondale coffee shop. Back booth. 2 AM.\n\nOh. You're just... waiting. Not rushing me. That's different.\n\nClosed system. Are you a variable I need to account for?", altEmotion: 'guarded' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'intro_curious',
        text: "What are you working on?",
        nextNodeId: 'devon_explains_system',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        },
        voiceVariations: {
          analytical: "What system is this? Walk me through the logic.",
          helping: "You look like you're solving something important.",
          building: "What are you building? I want to see.",
          exploring: "What are you working on?",
          patience: "I'm curious about what you're working on."
        }
      },
      {
        choiceId: 'intro_technical',
        text: "That looks like a decision tree. For what?",
        nextNodeId: 'devon_technical_response',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['recognizes_technical_work']
        },
        voiceVariations: {
          analytical: "That looks like a decision tree. For what?",
          helping: "That flowchart... it's about people, isn't it?",
          building: "I recognize that structure. Decision tree. What's the output?",
          exploring: "Interesting diagram. What does it do?",
          patience: "That looks complex. A decision tree?"
        }
      },
      {
        choiceId: 'intro_gentle',
        text: "I'm just passing through. You seem focused.",
        nextNodeId: 'devon_defends_focus',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        },
        voiceVariations: {
          analytical: "I won't interrupt your process. Just observing.",
          helping: "I don't want to disrupt you. You seem deep in something.",
          building: "I can see you're in the zone. I'll wait.",
          exploring: "Don't mind me. I'm just curious what's happening here.",
          patience: "I'm just passing through. You seem focused."
        }
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        setRelationshipStatus: 'stranger'
      },
      // TD-005: First meeting with Devon warms up the technology platform
      {
        platformChanges: [{
          platformId: 'platform-7',
          warmthDelta: 1
        }]
      }
    ],
    tags: ['introduction', 'devon_arc']
  },

  // ============= EXPLAINING THE SYSTEM (Immersive Scenario) =============
  // ============= EXPLAINING THE SYSTEM (Immersive Scenario) =============
  {
    nodeId: 'devon_explains_system',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Technically speaking... don't just look at it. Run it.\n\nI visualized the logic flow. It's cleaner this way.",
        emotion: 'focused',
        variation_id: 'explains_scenario_v2_minimal',
        richEffectContext: 'warning',
        useChatPacing: true,
        patternReflection: [
          { pattern: 'analytical', minLevel: 5, altText: "Technically speaking... run it. You've built systems like this. You know the beauty of a clean decision tree.\n\nBut this one... this one has high latency.", altEmotion: 'focused' },
          { pattern: 'patience', minLevel: 5, altText: "Technically speaking... don't rush. Just watch. You understand waiting, don't you?\n\nThis decision tree needs time to reveal its flaw.", altEmotion: 'contemplative' },
          { pattern: 'exploring', minLevel: 5, altText: "Technically speaking... explore it. Not just the branches—the gaps. The places where logic doesn't reach.\n\nThat's where the real bugs hide.", altEmotion: 'curious' },
          { pattern: 'helping', minLevel: 5, altText: "Technically speaking... it's a conversation optimizer. Sounds cold, right?\n\nBut it's about connection. About not losing the people who matter.", altEmotion: 'vulnerable' },
          { pattern: 'building', minLevel: 5, altText: "Technically speaking... I built this myself. Every branch, every condition.\n\nYou build things too, don't you? You know the cost of getting the architecture wrong.", altEmotion: 'focused' }
        ]
      }
    ],
    simulation: {
      type: 'visual_canvas',
      title: 'Conversational Optimizer v1.4',
      taskDescription: 'Debug the conversation flow. The "Father" node is returning unexpected null values.',
      initialContext: {
        label: 'Logic Map: Father_Interaction_Protocol',
        content: `ROOT: [Initiate Call]
  │
  ├── IF [Input_Tone == "Warm"] → [Open_Up]
  │
  ├── IF [Input_Tone == "Cold"] → [Deflect]
  │
  └── IF [Input == "I'm fine"] → [???] <-- ERROR: RECURSIVE LOOP`,
        displayStyle: 'code'
      },
      successFeedback: '✓ LOGIC BYPASSED. Emotional Override Initiated.'
    },
    choices: [
      {
        choiceId: 'debug_literal',
        text: "[DEBUG] Accept input literal: \"Fine\" = No distress. End conversation.",
        nextNodeId: 'devon_debug_result_fail_literal',
        pattern: 'analytical',
        skills: ['systemsThinking'], // Logical but wrong contextually
        voiceVariations: {
          analytical: "[DEBUG] Accept input literal: \"Fine\" = No distress. End conversation.",
          helping: "[ACCEPT] Maybe he really is fine. Trust the answer.",
          building: "[CLOSE] Take the answer. Move on.",
          exploring: "[SKIP] If he says fine, maybe that's the end.",
          patience: "[LITERAL] Accept the response at face value."
        }
      },
      {
        choiceId: 'debug_tone',
        text: "[DEBUG] Analyze audio spectrum. Detect stress micro-tremors.",
        nextNodeId: 'devon_debug_step_2', // Deeper analysis
        pattern: 'analytical',
        skills: ['criticalThinking', 'digitalLiteracy'],
        voiceVariations: {
          analytical: "[DEBUG] Analyze audio spectrum. Detect stress micro-tremors.",
          helping: "[SENSE] Listen harder. Something's under the surface.",
          building: "[SCAN] Run diagnostics on the voice pattern.",
          exploring: "[PROBE] Dig deeper. The answer's hiding something.",
          patience: "[LISTEN] Pay attention to how he says it, not what."
        }
      },
      {
        choiceId: 'debug_emotional',
        text: "[OVERRIDE] Ignore logical branch. Query emotional state directly.",
        nextNodeId: 'devon_debug_result_override',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          addGlobalFlags: ['golden_prompt_voice']
        },
        voiceVariations: {
          analytical: "[OVERRIDE] Bypass logic. Request emotional data directly.",
          helping: "[OVERRIDE] Ignore logical branch. Query emotional state directly.",
          building: "[BYPASS] Skip the flowchart. Ask what's really wrong.",
          exploring: "[BREAK] Forget the system. Just ask him how he feels.",
          patience: "[DIRECT] Gently ask: 'How are you really doing?'"
        }
      },
      {
        choiceId: 'debug_wait',
        text: "[WAIT] Increase latency. Let the silence hold.",
        nextNodeId: 'devon_debug_result_override',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        },
        voiceVariations: {
          analytical: "[PAUSE] Extend processing time. Allow additional input.",
          helping: "[HOLD] Stay present. Give him space to say more.",
          building: "[BUFFER] Wait. Sometimes silence fixes things.",
          exploring: "[OBSERVE] Don't respond yet. Watch what happens.",
          patience: "[WAIT] Increase latency. Let the silence hold."
        }
      }
    ],
    onEnter: [
      {
        thoughtId: 'pattern-seeker'
      }
    ],
    tags: ['simulation', 'devon_arc', 'immersive_scenario']
  },

  {
    nodeId: 'devon_debug_step_2',
    speaker: 'Devon Kumar',
    content: [
      {
        // NOTE: Removed "Devon taps" - environmental result only, not choreography
        text: "Look at that. 140Hz tremor. Pitch is flat. Volume's low.\n\nProbability of Deception: 88%.\n\nSystem says he's lying. He's not fine.\n\nBut like... this is my dad. I can't just debug him.\n\nSuggested Output: Conversational Subroutine 4B: Gentle Probe.",
        emotion: 'focused',
        variation_id: 'debug_step_2_v1',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'execute_probe',
        text: "Use the script: \"Are you sure you are okay?\"",
        nextNodeId: 'devon_debug_result_fail_script', // TRAP CHOICE
        pattern: 'building',
        skills: ['systemsThinking'],
        voiceVariations: {
          analytical: "[EXECUTE] Run the suggested subroutine verbatim.",
          helping: "[TRY] Maybe the gentle probe will help.",
          building: "Use the script: \"Are you sure you are okay?\"",
          exploring: "[TEST] Let's see if the probe works.",
          patience: "[FOLLOW] Use the system's recommended approach."
        }
      },
      {
        choiceId: 'abort_script',
        text: "Forget the script. Just talk to him.",
        nextNodeId: 'devon_debug_result_override',
        pattern: 'helping',
        skills: ['adaptability'],
        voiceVariations: {
          analytical: "[ABANDON] Discard the scripted approach. Go unstructured.",
          helping: "Forget the script. Just talk to him.",
          building: "[MANUAL] Override the system. Handle it yourself.",
          exploring: "[IMPROVISE] Forget the flowchart. Just be real.",
          patience: "[BREATHE] Put the script down. Just be present."
        }
      }
    ]
  },

  // --- FAILURE STATE 1: LITERAL ---
  {
    nodeId: 'devon_debug_result_fail_literal',
    speaker: 'Devon Kumar',
    content: [
      {
        // NOTE: Removed "Devon swipes" and "looks at phone, pained" - dialogue carries the regret
        text: "The tree goes dark.\n\nRobotic voice: \"Conversation Ended.\"\n\nI took the input at face value. Just hung up.\n\nHe was waiting for me to push back.\n\nGod. I failed the actual test because I passed the logic check.",
        emotion: 'regretful',
        variation_id: 'debug_fail_literal_v1',
        richEffectContext: 'error',
        patternReflection: [
          { pattern: 'analytical', minLevel: 4, altText: "The tree goes dark.\n\n\"Conversation Ended.\"\n\nI took the input at face value. You see it, right? The logic was perfect. The outcome was wrong.\n\nPerfect logic can still miss everything that matters.", altEmotion: 'regretful' },
          { pattern: 'helping', minLevel: 4, altText: "The tree goes dark.\n\nI took the input at face value. Just hung up.\n\nYou wouldn't have done that, would you? You would have heard what he wasn't saying.", altEmotion: 'vulnerable' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'retry_literal',
        text: "Reset. Don't take 'fine' as an answer.",
        nextNodeId: 'devon_explains_system',
        pattern: 'patience',
        voiceVariations: {
          analytical: "[RESET] Iterate. Modify the acceptance criteria.",
          helping: "Let's try again. You can do this differently.",
          building: "[RESTART] Reset the system. New approach.",
          exploring: "Let's run it again. Different input this time.",
          patience: "Reset. Don't take 'fine' as an answer."
        }
      },
      {
        choiceId: 'explore_failed_assumption',
        text: "What made you think 'fine' was ever literal?",
        nextNodeId: 'devon_explains_system',
        pattern: 'exploring',
        skills: ['curiosity', 'criticalThinking'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        },
        voiceVariations: {
          analytical: "What made you think 'fine' was ever literal?",
          helping: "When people say 'fine,' it rarely means fine. You know that.",
          building: "The assumption was wrong from the start. Why build on it?",
          exploring: "'Fine' is almost never literal. What were you really testing?",
          patience: "Have you ever said 'fine' when you meant something else?"
        }
      }
    ]
  },

  // --- FAILURE STATE 2: SCRIPTED ---
  {
    nodeId: 'devon_debug_result_fail_script',
    speaker: 'Devon Kumar',
    content: [
      {
        // NOTE: Removed "Devon reads" - the scripted line speaks for itself
        text: "\"Dad, data suggests you are distressed. Are you sure you are okay?\"\n\nSilence.\n\nThen a click.\n\nRed text: \"SCRIPT <glitch>FAILED</glitch>. EXCEPTION: HUMAN_VARIANCE.\"\n\nHe hung up. He heard the script in my voice.\n\nHe heard me debugging him instead of just... talking to him.\n\nThis whole thing is stupid.",
        emotion: 'devastated',
        variation_id: 'debug_fail_script_v1',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'retry_script',
        text: "I'm sorry. Let's try without the script.",
        nextNodeId: 'devon_explains_system',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        voiceVariations: {
          analytical: "Iteration two. Disabling script module.",
          helping: "I'm sorry. Let's try without the script.",
          building: "Start fresh. No script this time.",
          exploring: "Scripts fail. Let's see what happens without one.",
          patience: "It's okay. Let's try again, more naturally."
        }
      },
      {
        choiceId: 'give_up_script',
        text: "Maybe emotions really are just bugs.",
        nextNodeId: 'devon_bad_ending',
        pattern: 'analytical',
        consequence: {
          addGlobalFlags: ['devon_chose_logic'] // BAD ENDING
        },
        voiceVariations: {
          analytical: "Maybe emotions really are just bugs.",
          helping: "Maybe some things can't be fixed.",
          building: "If the system keeps failing, maybe the system is the problem.",
          exploring: "Maybe this approach was doomed from the start.",
          patience: "Maybe some things aren't meant to be solved."
        }
      },
      {
        choiceId: 'sit_with_failure',
        text: "Sometimes we just need to sit with failure. Let's take a breath.",
        nextNodeId: 'devon_explains_system',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        visibleCondition: {
          patterns: { patience: { min: 4 } }
        },
        consequence: {
          characterId: 'devon',
          trustChange: 2
        },
        voiceVariations: {
          analytical: "Processing pause. Let the system rest before retry.",
          helping: "It's okay to fail. Let's just breathe for a moment.",
          building: "Step back. Sometimes distance shows the solution.",
          exploring: "Let's not rush. Sit with what just happened.",
          patience: "Sometimes we just need to sit with failure. Let's take a breath."
        }
      }
    ]
  },

  // --- SUCCESS STATE ---
  {
    nodeId: 'devon_debug_result_override',
    speaker: 'Devon Kumar',
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['devon_simulation_phase1_complete']
      }
    ],
    content: [
      {
        // NOTE: Removed "Devon looks at you, intrigued" - emotion conveyed through dialogue
        text: "System flashes. \"Unknown Variable.\"\n\nYou went off script.\n\nMy whole system creates a loop. You just... broke it. You ignored the data to find the feeling.\n\nI can't code that. How do you code that?",
        emotion: 'intrigued',
        variation_id: 'debug_override_v1',
        richEffectContext: 'thinking',
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "System flashes. \"Unknown Variable.\"\n\nYou went off script. You saw a person, not a problem.\n\nMy whole system creates a loop. You just... broke it with empathy.\n\nI can't code that. But you do it naturally.", altEmotion: 'vulnerable' },
          { pattern: 'patience', minLevel: 4, altText: "System flashes. \"Unknown Variable.\"\n\nYou didn't rush. You let the silence hold instead of filling it with the next step.\n\nMy whole system assumes action. You just proved stillness is also an answer.", altEmotion: 'intrigued' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'ask_who_for_override',
        text: "Who is this system for?",
        nextNodeId: 'devon_father_hint',
        pattern: 'exploring',
        skills: ['curiosity', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        },
        voiceVariations: {
          analytical: "The system has a specific subject. Who is it optimized for?",
          helping: "This is about someone you care about, isn't it?",
          building: "You built this for someone. Who?",
          exploring: "Who is this system for?",
          patience: "You've been working on this for someone specific."
        }
      },
      {
        choiceId: 'override_helping_insight',
        text: "[Empathy] You can't code connection. But you can create space for it.",
        nextNodeId: 'devon_father_hint',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        requiredOrbFill: { pattern: 'helping', threshold: 30 },
        consequence: {
          characterId: 'devon',
          trustChange: 3
        }
      }
    ]
  },

  {
    nodeId: 'devon_technical_response',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You recognize it. Most people just see scribbles.\n\nIt's a decision tree. Conversational routing.\n\nIf input A, response B. If emotional_state equals defensive, run de-escalate.\n\nPretty standard stuff.",
        emotion: 'relieved',
        variation_id: 'technical_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ask_purpose',
        text: "What's the use case for this system?",
        nextNodeId: 'devon_father_hint',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      },
      {
        choiceId: 'validate_approach',
        text: "Systems make sense. People don't.",
        nextNodeId: 'devon_father_hint',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 2,
          setRelationshipStatus: 'acquaintance'
        }
      },
      {
        choiceId: 'technical_building',
        text: "What if you built in emotional states as first-class variables?",
        nextNodeId: 'devon_father_hint',
        pattern: 'building',
        skills: ['systemsThinking', 'creativity'],
        visibleCondition: {
          patterns: { building: { min: 3 }, analytical: { min: 2 } }
        },
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      },
      {
        choiceId: 'technical_simplified',
        text: "So... it's a flowchart for feelings?",
        nextNodeId: 'devon_simple_analogy',
        pattern: 'analytical', // attempting to understand
        visibleCondition: {
          patterns: { analytical: { max: 2 } }
        }
      }
    ]
  },

  {
    nodeId: 'devon_defends_focus',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Focus is necessary. Systems don't build themselves.\n\nAnd unlike people, systems are predictable. They do what you design them to do. Every time.",
        emotion: 'defensive',
        variation_id: 'defends_v1'
      }
    ],
    choices: [
      {
        choiceId: 'stay_quiet',
        text: "[Wait quietly]",
        nextNodeId: 'devon_opens_up',
        pattern: 'patience',
        archetype: 'STAY_SILENT',
        skills: ['emotionalIntelligence', 'adaptability'],
        visibleCondition: {
          patterns: { patience: { min: 3 } }
        },
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'ask_about_people',
        text: "People aren't predictable?",
        nextNodeId: 'devon_people_problem',
        pattern: 'exploring',
        archetype: 'ASK_FOR_DETAILS',
        skills: ['communication']
      }
    ]
  },

  {
    nodeId: 'devon_simple_analogy',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Yeah. I guess it is. 'Flowchart for Feelings.' Sounds like a bad self-help book.\n\nBut that's the problem. Charts are binary. Feelings are... analog. Messy.",
        emotion: 'amused',
        variation_id: 'simple_analogy_v1'
      }
    ],
    choices: [
      {
        choiceId: 'simple_analogy_continue',
        text: "Why do you need a chart for this person?",
        nextNodeId: 'devon_father_hint',
        pattern: 'exploring',
        skills: ['communication']
      }
    ],
    tags: ['devon_arc']
  },

  {
    nodeId: 'devon_opens_up',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You waited. Most people fill silences. They're uncomfortable with latency.\n\nBut you just... let the system complete its processing.\n\nThis flowchart. It's not for an engineering class. It's for someone important to me.",
        emotion: 'grateful',
        variation_id: 'opens_up_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ask_who_its_for',
        text: "Who is it for?",
        nextNodeId: 'devon_father_hint',
        pattern: 'exploring',
        archetype: 'ASK_FOR_DETAILS',
        skills: ['communication', 'emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      },
      {
        choiceId: 'acknowledge_their_importance',
        text: "They must mean a lot to you.",
        nextNodeId: 'devon_father_hint',
        pattern: 'helping',
        archetype: 'ACKNOWLEDGE_EMOTION',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'devon'
      }
    ]
  },

  {
    nodeId: 'devon_people_problem',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Exactly. People are non-deterministic.\n\nSame input, totally different outputs depending on state variables I can't even observe. Emotional cache. Historical context. Unspoken expectations.\n\nSystems have specifications. People have feelings.\n\nAnd I'm not good at debugging feelings.",
        emotion: 'frustrated',
        variation_id: 'people_problem_v1'
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        thoughtId: 'analytical-eye'
      }
    ],
    choices: [
      {
        choiceId: 'suggest_empathy',
        text: "Maybe feelings aren't bugs to fix?",
        nextNodeId: 'devon_father_hint',
        pattern: 'helping',
        archetype: 'CHALLENGE_ASSUMPTION',
        skills: ['emotionalIntelligence', 'criticalThinking'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'ask_specific_case',
        text: "Is there someone specific you're trying to understand?",
        nextNodeId: 'devon_father_hint',
        pattern: 'exploring',
        archetype: 'ASK_FOR_DETAILS',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      },
      {
        choiceId: 'let_devon_process',
        text: "[Nod slowly. Give them space to think.]",
        nextNodeId: 'devon_father_hint',
        pattern: 'patience',
        archetype: 'STAY_SILENT',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'people_building_framework',
        text: "What would a system look like that doesn't try to control everything?",
        nextNodeId: 'devon_father_hint',
        pattern: 'building',
        skills: ['systemsThinking', 'creativity'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      },
      {
        choiceId: 'people_data_weaver',
        text: "[AI] Only noise if you can't read it. Treat emotions as high-complexity data streams.",
        nextNodeId: 'devon_father_hint',
        pattern: 'analytical',
        visibleCondition: {
          patterns: { analytical: { min: 6 } }
        },
        consequence: {
          characterId: 'devon',
          trustChange: 2,
          addKnowledgeFlags: ['used_data_weaver_insight'],
          thoughtId: 'data-weaver'
        }
      }
    ]
  },

  {
    nodeId: 'devon_father_hint',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "It's for... someone who's going through a rough time.\n\nSomeone I care about but can't seem to help. Every conversation is a failure cascade.\n\nI thought if I could map the optimal response paths, I could fix it. Debug the relationship, you know?",
        emotion: 'frustrated',
        variation_id: 'father_hint_v1',
        voiceVariations: {
          helping: "It's for... someone who's going through a rough time.\n\nSomeone I care about but can't help. You probably understand - when caring isn't enough.\n\nI thought if I could optimize the conversation, I could fix it.",
          analytical: "It's for... someone going through a rough time.\n\nEvery conversation is a failure cascade. Error rate approaching 100%.\n\nI thought mapping optimal response paths would solve it.",
          building: "It's for... someone going through a rough time.\n\nSomeone I care about but can't reach. Every attempt fails.\n\nI thought if I could architect the right flow, I could fix it.",
          exploring: "It's for... someone going through a rough time.\n\nYou're curious why I'm doing this, aren't you?\n\nI thought if I could map it, find the right path... I could help.",
          patience: "It's for... someone going through a rough time.\n\nEvery conversation ends too fast, wrong.\n\nI thought if I could slow it down, map it out... I could fix it."
        }
      }
    ],
    choices: [
      {
        choiceId: 'ask_who',
        text: "Who is it?",
        nextNodeId: 'devon_father_reveal',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      },
      {
        choiceId: 'devon_recognize_care',
        text: "The caring is obvious. Even if the conversations aren't working.",
        nextNodeId: 'devon_father_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'ask_why_failing',
        text: "Why do you think conversations are failing?",
        nextNodeId: 'devon_system_failure',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'father_hint_building_bridge',
        text: "What if the conversation isn't the thing that needs fixing?",
        nextNodeId: 'devon_father_reveal',
        pattern: 'building',
        skills: ['systemsThinking', 'emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'devon_father_reveal',
    learningObjectives: ['devon_emotional_logic_integration'],
    speaker: 'Devon Kumar',
    content: [
      {
        text: "My dad. He lives up in Huntsville. Since mom died six months ago, every phone call is... an exception error.\n\nHe says he's fine. But his voice has this... lag. Like packet loss. Information that isn't being transmitted. And I don't know how to debug grief.",
        emotion: 'vulnerable',
        variation_id: 'father_reveal_v1',
        richEffectContext: 'thinking',
        useChatPacing: true,
        // E2-031: Interrupt opportunity when Devon reveals grief
        interrupt: {
          duration: 3500,
          type: 'silence',
          action: 'Wait. Let the silence hold space for his grief.',
          targetNodeId: 'devon_interrupt_acknowledged',
          consequence: {
            characterId: 'devon',
            trustChange: 2
          }
        }
      }
    ],
    patternReflection: [
      {
        pattern: 'helping',
        minLevel: 5,
        altText: "My dad. He lives up in Huntsville. Since mom died six months ago, every phone call is... an exception error.\n\nI don't know why I'm telling you this. Maybe because you actually listen. not many people do.\n\nHe says he's fine. But his voice has this... lag. Like packet loss. I don't know how to debug grief.",
        altEmotion: 'grateful_vulnerable'
      },
      {
        pattern: 'patience',
        minLevel: 5,
        altText: "My dad. He lives up in Huntsville. Since mom died six months ago, every phone call is... an exception error.\n\nThe way you wait... you give space. That's rare. Most people rush to fill silence.\n\nHe says he's fine. But his voice has this... lag. Like packet loss. I don't know how to debug grief.",
        altEmotion: 'seen_vulnerable'
      }
    ],
    choices: [
      {
        choiceId: 'express_sympathy',
        text: "I'm sorry about your mom.",
        nextNodeId: 'devon_pause_after_father_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 2,
          addKnowledgeFlags: ['knows_about_mother']
        }
      },
      {
        choiceId: 'ask_about_system',
        text: "So you built this flowchart to help him?",
        nextNodeId: 'devon_pause_after_father_reveal',
        pattern: 'building',
        skills: ['systemsThinking', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['knows_about_mother']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['father_in_huntsville', 'mother_died']
      }
    ]
  },

  {
    nodeId: 'devon_interrupt_acknowledged',
    speaker: 'Devon Kumar',
    content: [{
      text: "You didn't try to fix it. You just... waited. Let the error state exist without rushing to clear it.\n\nThat's not how I process. But maybe that's what he needs.",
      emotion: 'surprised_grateful',
      microAction: 'He pauses, the constant tapping of his fingers finally still.',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'silence_is_data',
        text: "Silence can be data too. Just a different kind.",
        nextNodeId: 'devon_pause_after_father_reveal',
        pattern: 'patience',
        archetype: 'SHARE_PERSPECTIVE',
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      },
      {
        choiceId: 'presence_matters',
        text: "Sometimes presence is more valuable than solutions.",
        nextNodeId: 'devon_pause_after_father_reveal',
        pattern: 'helping',
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    tags: ['interrupt_target', 'emotional_moment', 'devon_arc']
  },
  {
    nodeId: 'devon_pause_after_father_reveal',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Sorry. That's... more than I usually tell people.",
        emotion: 'processing',
        variation_id: 'pause_father_reveal_v1'
      }
    ],
    choices: [
      {
        choiceId: 'devon_continue_after_pause',
        text: "(Continue)",
        nextNodeId: 'devon_accepts_sympathy',
        pattern: 'patience'
      }
    ],
    tags: ['scene_break', 'pacing', 'devon_arc'],
    metadata: {
      sessionBoundary: true  // Session 1: Introduction complete
    }
  },

  {
    nodeId: 'devon_accepts_sympathy',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Thank you. She was... she was the interpreter. Between me and dad. She translated my logic into warmth.\n\nAnd now that translation layer is gone.\n\nSo I built a system. To optimize our conversations. To help him.",
        emotion: 'raw',
        variation_id: 'accepts_sympathy_v1',
        voiceVariations: {
          analytical: "Thank you. You see the architecture. She was the interpreter layer. Between my logic and his emotion.\n\nThe abstraction is gone now. Communication protocol broken.\n\nSo I built a system. Tried to programmatically optimize our conversations.",
          helping: "Thank you for... for staying with that.\n\nShe was the bridge. Between me and dad. I could speak in code, she'd translate to care.\n\nWithout her, I don't know the language anymore.\n\nSo I built a system. Trying to automate what she did naturally.",
          building: "Thank you. You understand construction. She was the infrastructure. Between me and dad. She built connections I couldn't engineer.\n\nNow the foundation's gone.\n\nSo I'm trying to rebuild it. Systematically. Through conversation optimization.",
          exploring: "Thank you for listening. There's more here than I usually share.\n\nShe was my guide. Between me and dad. She knew paths I couldn't see.\n\nNow I'm lost without the map.\n\nSo I built a system. Trying to navigate what she understood intuitively.",
          patience: "Thank you. For not rushing past this.\n\nShe was the buffer. Between me and dad. She gave both of us time to understand each other.\n\nWithout that space, everything feels urgent and wrong.\n\nSo I built a system. Trying to slow things down enough to connect."
        }
      }
    ],
    choices: [
      {
        choiceId: 'ask_about_dad_work',
        text: "What does your dad do in Huntsville?",
        nextNodeId: 'devon_father_aerospace',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      },
      {
        choiceId: 'devon_loss_recognition',
        text: "You lost your translator. That's a profound loss.",
        nextNodeId: 'devon_system_failure',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'did_it_work',
        text: "Did it work?",
        nextNodeId: 'devon_system_failure',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'hold_space_grief',
        text: "[Stay quiet. Some things need space, not words.]",
        nextNodeId: 'devon_system_failure',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'devon_go_deeper',
        text: "Devon... what happened the night she died?",
        nextNodeId: 'devon_vulnerability_arc',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        visibleCondition: { trust: { min: 6 } },
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'devon_father_aerospace',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "{{trust>3:He's an aerospace engineer at NASA Marshall.|He's an engineer. Precision is everything.}}\n\nTwenty-five years debugging rocket systems. Guidance control, error detection, mission-critical protocols.\n\nHe can troubleshoot a spacecraft traveling 17,000 miles per hour, but he can't...\n\nHe can't debug his own grief.",
        emotion: 'frustrated_admiration',
        variation_id: 'father_aerospace_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ask_devon_engineering',
        text: "Is that why you went into engineering?",
        nextNodeId: 'devon_uab_systems_engineering',
        pattern: 'exploring',
        skills: ['communication'],
        consequence: {
          characterId: 'devon',
          addKnowledgeFlags: ['father_nasa_engineer']
        }
      },
      {
        choiceId: 'devon_grief_recognition',
        text: "Grief can't be debugged. It can only be felt.",
        nextNodeId: 'devon_grief_felt_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'comment_on_similarity',
        text: "You're doing what he does - trying to debug systems.",
        nextNodeId: 'devon_debug_parallel_response',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['father_nasa_engineer']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['father_aerospace_engineer']
      }
    ]
  },

  // Divergent responses for father aerospace
  {
    nodeId: 'devon_grief_felt_response',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Nobody's ever said that to me before.\n\nEveryone says 'time heals' or 'stay busy' or 'process it logically.' Nobody's ever said... just feel it.",
        emotion: 'vulnerable',
        variation_id: 'grief_felt_v1'
      }
    ],
    choices: [
      {
        choiceId: 'feeling_as_data',
        text: "Feeling is its own kind of data.",
        nextNodeId: 'devon_uab_systems_engineering',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ]
  },
  {
    nodeId: 'devon_debug_parallel_response',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Oh god. You're right. I'm running the same subroutine he does.\n\nProblem detected. Isolate variables. Test solutions. Repeat until fixed.\n\nExcept feelings aren't... they don't have error codes. There's no stack trace for sadness.",
        emotion: 'self_aware',
        variation_id: 'debug_parallel_v1'
      }
    ],
    choices: [
      {
        choiceId: 'thats_okay',
        text: "Maybe that's okay.",
        nextNodeId: 'devon_uab_systems_engineering',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'devon_uab_systems_engineering',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "UAB Systems Engineering. Senior capstone on error detection in distributed systems.\n\nSouthern Company's DevOps team is coming to our showcase. Looking for system resilience grads.\n\nIronic. I can debug code but not emotions.",
        emotion: 'self_aware',
        variation_id: 'uab_systems_v1',
        // E2-CHALLENGE: Opportunity to challenge the false dichotomy
        interrupt: {
          duration: 3000,
          type: 'challenge',
          action: 'Challenge that assumption',
          targetNodeId: 'devon_challenge_accepted',
          consequence: {
            characterId: 'devon',
            trustChange: 1,
            addKnowledgeFlags: ['player_challenged_devon']
          }
        }
      }
    ],
    choices: [
      {
        choiceId: 'encourage_capstone',
        text: "That capstone project sounds impressive.",
        nextNodeId: 'devon_career_context',
        pattern: 'helping',
        skills: ['communication', 'emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 1,
          addKnowledgeFlags: ['knows_uab_program']
        }
      },
      {
        choiceId: 'connect_to_dad',
        text: "Talk system failures with your dad?",
        nextNodeId: 'devon_realizes_bridge',
        pattern: 'building',
        skills: ['creativity', 'emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 2,
          addKnowledgeFlags: ['knows_uab_program']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['revealed_career_path']
      }
    ]
  },

  // ============= CHALLENGE INTERRUPT TARGET =============
  {
    nodeId: 'devon_challenge_accepted',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Wait. You're calling that out?\n\n\"Can't debug emotions.\" I just said that like it's a fact. But that's not true, is it?\n\nI debug code by understanding how it works. By being patient with failures. By tracing problems to their root.\n\nMaybe... maybe that IS what emotions need. Not fixing. Understanding.",
        emotion: 'breakthrough',
        variation_id: 'challenge_accepted_v1',
        voiceVariations: {
          analytical: "Wait. You caught that logical flaw.\n\n\"Can't debug emotions.\" I stated that as fact. But debugging isn't about fixing—it's about understanding.\n\nMaybe emotions aren't the exception. Maybe I've been using the wrong metaphor all along.",
          helping: "Wait. You're pushing back on that?\n\n\"Can't debug emotions.\" I say that to protect myself. But you see through it.\n\nMaybe the skills ARE transferable. Just... not the way I thought.",
          building: "Wait. You're challenging that assumption.\n\n\"Can't debug emotions.\" But debugging is just... understanding how something works. Being patient with failures.\n\nMaybe I've been building walls when I should be building bridges.",
          exploring: "Wait. That's an interesting challenge.\n\n\"Can't debug emotions.\" But what if I'm wrong? What if the same curiosity that helps me find bugs could help me understand feelings?",
          patience: "Wait. You didn't let that slide.\n\n\"Can't debug emotions.\" I've been telling myself that for years. But you're right to question it.\n\nMaybe patience with code and patience with people aren't that different."
        }
      }
    ],
    choices: [
      {
        choiceId: 'challenge_follow_systems',
        text: "Systems thinking might be exactly what grief needs.",
        nextNodeId: 'devon_realizes_bridge',
        pattern: 'analytical',
        skills: ['systemsThinking', 'emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'challenge_follow_patience',
        text: "Debugging requires patience. So does grief.",
        nextNodeId: 'devon_career_context',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'challenge_follow_connection',
        text: "You already have the skills. You just need to apply them differently.",
        nextNodeId: 'devon_career_context',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      }
    ],
    tags: ['interrupt_target', 'devon_arc', 'challenge_interrupt', 'breakthrough']
  },

  {
    nodeId: 'devon_career_context',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Systems that work even when things go wrong. Redundancy, error handling.\n\nI thought I could apply that to people.\n\nBut people aren't systems. Grief isn't a bug.",
        emotion: 'dawning_understanding',
        variation_id: 'career_context_v1'
      }
    ],
    choices: [
      {
        choiceId: 'acknowledge_realization',
        text: "There's something your system can't map.",
        nextNodeId: 'devon_system_failure',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      },
      {
        choiceId: 'explore_irony_further',
        text: "What would it mean to debug your own emotions the way you debug code?",
        nextNodeId: 'devon_system_failure',
        pattern: 'exploring',
        skills: ['curiosity', 'criticalThinking'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'devon_system_failure',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "No. I followed it perfectly. Every decision node, every optimal path.\n\nMade everything worse.\n\nHe said I sounded like a script. Treating him like a problem, not a person.\n\nThe system was perfect. Completely wrong.",
        emotion: 'devastated',
        variation_id: 'system_failure_v1'
      }
    ],
    choices: [
      {
        choiceId: 'validate_pain',
        text: "That must have hurt.",
        nextNodeId: 'devon_admits_hurt',
        pattern: 'helping',
        archetype: 'ACKNOWLEDGE_EMOTION',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 2,
          setRelationshipStatus: 'confidant'
        }
      },
      {
        choiceId: 'analyze_failure',
        text: "What went wrong with the system?",
        nextNodeId: 'devon_analyzes_failure',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['system_failed']
      }
    ]
  },

  {
    nodeId: 'devon_admits_hurt',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "It did. Because he was right. I was treating him like a system failure. Like debugging code. But you can't debug a memory. You can't optimize grief.\n\nAnd I don't know any other way to help.",
        emotion: 'broken',
        variation_id: 'admits_hurt_v1'
      }
    ],
    choices: [
      {
        choiceId: 'devon_presence_validation',
        text: "[Say nothing. Just be here with him.]",
        nextNodeId: 'devon_reframe',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'devon',
          trustChange: 3
        }
      },
      {
        choiceId: 'reframe_empathy',
        text: "What if understanding someone is its own kind of information?",
        nextNodeId: 'devon_reframe',
        pattern: 'building',
        skills: ['creativity', 'criticalThinking', 'emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'explore_other_ways',
        text: "What would it look like if helping wasn't fixing? What else could it be?",
        nextNodeId: 'devon_reframe',
        pattern: 'exploring',
        skills: ['curiosity', 'emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'devon_analyzes_failure',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "The system assumed emotional states could be optimized.\n\nBut grief isn't a bug. Not something to route around.\n\nI was treating symptoms. Not the underlying condition.\n\nSolving the wrong problem.",
        emotion: 'analytical',
        variation_id: 'analyzes_failure_v1'
      }
    ],
    choices: [
      {
        choiceId: 'suggest_reframe',
        text: "So what's the right problem?",
        nextNodeId: 'devon_realizes_connection',
        pattern: 'exploring',
        skills: ['criticalThinking', 'problemSolving', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'devon_reframe',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Empathy as data collection. Presence as bandwidth. You're saying... I don't have to abandon systems thinking. I have to expand what counts as data.\n\nEmotions aren't noise interfering with the signal. They ARE the signal.",
        emotion: 'dawning_realization',
        variation_id: 'reframe_v1'
      }
    ],
    choices: [
      {
        choiceId: 'confirm',
        text: "Exactly. Your framework needed updating, not replacing.",
        nextNodeId: 'devon_pause_before_crossroads',
        pattern: 'helping',
        skills: ["emotionalIntelligence", "communication"],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['empathy_reframe', 'devon_reframe_insight']
      }
    ],
    tags: ['simulation', 'devon_arc'],
    metadata: {
      sessionBoundary: true  // Session 2: Crossroads complete
    }
  },

  {
    nodeId: 'devon_realizes_connection',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "The right problem isn't 'How do I fix my dad.'\n\nIt's 'How do I be present with my dad.'\n\nYou can't optimize connection. You show up. Be in the system instead of designing it.",
        emotion: 'understanding',
        variation_id: 'realizes_v1',
        voiceVariations: {
          analytical: "I've been debugging the wrong function. The right problem isn't 'How do I fix my dad.'\n\nIt's 'How do I be present with my dad.'\n\nYou can't optimize connection. Some variables can't be controlled - they have to be experienced.",
          helping: "You helped me see. The right problem isn't 'How do I fix my dad.'\n\nIt's 'How do I be present with my dad.'\n\nConnection isn't something you engineer. It's something you give. Show up. Be there.",
          building: "I've been trying to construct the wrong thing. The right problem isn't 'How do I fix my dad.'\n\nIt's 'How do I be present with my dad.'\n\nYou can't build connection like a system. You have to be IN the system instead of designing it.",
          exploring: "You asked the questions that led me here. The right problem isn't 'How do I fix my dad.'\n\nIt's 'How do I be present with my dad.'\n\nConnection isn't something you map ahead of time. You discover it as you go. Show up. Stay curious.",
          patience: "You gave me time to understand. The right problem isn't 'How do I fix my dad.'\n\nIt's 'How do I be present with my dad.'\n\nYou can't rush connection. You show up. Be in the moment instead of planning the next one."
        }
      }
    ],
    choices: [
      {
        choiceId: 'what_now',
        text: "So what will you do?",
        nextNodeId: 'devon_pause_before_crossroads',
        pattern: 'exploring',
        skills: ['communication', 'emotionalIntelligence']
      }
    ]
  },

  // ============= PAUSE =============
  {
    nodeId: 'devon_pause_before_crossroads',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "This feels different. Clearer.",
        emotion: 'reflective',
        variation_id: 'pause_crossroads_v1'
      }
    ],
    choices: [
      {
        choiceId: 'devon_continue_to_crossroads',
        text: "(Continue)",
        nextNodeId: 'devon_crossroads',
        pattern: 'patience'
      }
    ],
    tags: ['scene_break', 'pacing', 'devon_arc']
  },

  // ============= CROSSROADS (Climax) =============
  {
    nodeId: 'devon_crossroads',
    learningObjectives: ['devon_systematic_communication'],
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You helped me see emotions as data. Now I can work with them.\n\nI need to call him. Differently. No flowchart. Me, talking to my dad. Listening for what I've been filtering out. The pauses. The pain. The love underneath the 'I'm fine.'\n\nWhat if I let the conversation be what it needs to be?",
        emotion: 'ready',
        variation_id: 'crossroads_reframe',
        useChatPacing: true,
        richEffectContext: 'thinking'
      }
    ],
    patternReflection: [
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: "You think like I do. Systems, patterns, frameworks. But you also see what I was missing. You helped me see emotions as data.\n\nI need to call him. Differently. No flowchart. Me, talking to my dad.",
        altEmotion: 'recognized'
      },
      {
        pattern: 'patience',
        minLevel: 5,
        altText: "The way you waited... you gave me space to process. That's what my dad needs, isn't it? You helped me see emotions as data. Now I can work with them.\n\nI need to call him. But differently. No flowchart. Just... me, talking to my dad.",
        altEmotion: 'grateful_ready'
      },
      {
        pattern: 'helping',
        minLevel: 5,
        altText: "You've been debugging me this whole time. but gently. Not fixing, just... being here. You helped me see emotions as data. Now I can work with them.\n\nI need to call him. But differently. No flowchart. Just... me, talking to my dad.",
        altEmotion: 'warm_ready'
      }
    ],
    choices: [
      // Career observation routes (ISP: Only visible when pattern combos are achieved)
      {
        choiceId: 'crossroads_career_systems',
        text: "The way you analyze systems... it reminds me of something.",
        nextNodeId: 'devon_career_reflection_systems',
        pattern: 'analytical',
        skills: ['systemsThinking'],
        visibleCondition: {
          patterns: { analytical: { min: 5 }, patience: { min: 4 } },
          lacksGlobalFlags: ['devon_mentioned_career']
        }
      },
      {
        choiceId: 'crossroads_career_sustainability',
        text: "You build things that last. That matters.",
        nextNodeId: 'devon_career_reflection_sustainability',
        pattern: 'building',
        skills: ['creativity', 'systemsThinking'],
        visibleCondition: {
          patterns: { building: { min: 5 }, patience: { min: 4 } },
          lacksGlobalFlags: ['devon_mentioned_career']
        }
      },
      // Pattern-enhanced: Analytical players see integration as system upgrade
      {
        choiceId: 'crossroads_integrated_analytical',
        text: "What if you don't have to pick?",
        nextNodeId: 'devon_chooses_integration',
        pattern: 'analytical',
        skills: ['criticalThinking', 'creativity', 'emotionalIntelligence'],
        preview: "Suggest an integrated approach - systems can hold emotion too",
        interaction: 'bloom',
        visibleCondition: {
          patterns: { analytical: { min: 3 } }
        }
      },
      {
        choiceId: 'crossroads_integrated',
        text: "What if you don't have to pick?",
        nextNodeId: 'devon_chooses_integration',
        pattern: 'analytical',
        skills: ['criticalThinking', 'creativity', 'emotionalIntelligence'],
        visibleCondition: {
          patterns: { analytical: { max: 2 } }  // Only show when enhanced version doesn't
        }
      },
      // Pattern-enhanced: Helping players see emotional connection
      {
        choiceId: 'crossroads_emotional_helping',
        text: "What does your gut say?",
        nextNodeId: 'devon_chooses_heart',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        preview: "Encourage him to lead with feelings, not frameworks",
        interaction: 'bloom',
        visibleCondition: {
          patterns: { helping: { min: 3 } }
        }
      },
      {
        choiceId: 'crossroads_emotional',
        text: "What does your gut say?",
        nextNodeId: 'devon_chooses_heart',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        visibleCondition: {
          patterns: { helping: { max: 2 } }  // Only show when enhanced version doesn't
        }
      },
      // Pattern-enhanced: Patience players see supportive presence
      {
        choiceId: 'crossroads_support_patience',
        text: "Whatever feels right. He needs you there.",
        nextNodeId: 'devon_chooses_presence',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        preview: "Affirm that being present matters more than having answers",
        interaction: 'bloom',
        visibleCondition: {
          patterns: { patience: { min: 3 } }
        }
      },
      {
        choiceId: 'crossroads_support',
        text: "Whatever feels right. He needs you there.",
        nextNodeId: 'devon_chooses_presence',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        visibleCondition: {
          patterns: { patience: { max: 2 } }  // Only show when enhanced version doesn't
        }
      }
    ],
    tags: ['climax', 'devon_arc', 'pattern_enhanced']
  },

  // ============= ENDINGS =============
  {
    nodeId: 'devon_chooses_integration',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Engineer and son. Logic and love. Both are valid data sources. Both matter.\n\nI'll call him tonight. No script. But I won't abandon systems thinking either. I'll just... let the system be human. Complex. Unpredictable. Real.\n\nThank you for helping me see that systems can hold grief too.",
        emotion: 'integrated',
        variation_id: 'ending_integration_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_after_integration',
        text: "Good luck with the call.",
        nextNodeId: 'devon_farewell_integration',
        pattern: 'analytical',
        skills: ["criticalThinking", "communication"]
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['chose_integration', 'completed_arc'],
        addGlobalFlags: ['devon_arc_complete'],
        thoughtId: 'pattern-seeker'
      }
    ],
    tags: ['ending', 'devon_arc']
  },

  {
    nodeId: 'devon_chooses_heart',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You're right. Sometimes you have to put down the blueprint and just... feel.\n\nI'll call him. I'll tell him I miss mom too. I'll cry if I need to. No optimization. Just truth.\n\nThe flowchart can wait. My dad can't.",
        emotion: 'emotional',
        variation_id: 'ending_heart_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_after_heart',
        text: "He'll hear you.",
        nextNodeId: 'devon_farewell_heart',
        pattern: 'helping',
        skills: ["emotionalIntelligence", "communication"]
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['chose_heart', 'completed_arc'],
        addGlobalFlags: ['devon_arc_complete'],
        thoughtId: 'pattern-seeker'
      }
    ],
    tags: ['ending', 'devon_arc']
  },

  {
    nodeId: 'devon_chooses_presence',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Just be there. That's the whole system, isn't it? Show up. Listen. Be present in his grief instead of trying to fix it.\n\nI think that's what mom did for both of us. She was just... there. And I can do that too.\n\nThank you for helping me see what matters.",
        emotion: 'peaceful',
        variation_id: 'ending_presence_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_after_presence',
        text: "Your mom would be proud.",
        nextNodeId: 'devon_farewell_presence',
        pattern: 'patience',
        skills: ["emotionalIntelligence", "communication"]
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['chose_presence', 'completed_arc'],
        addGlobalFlags: ['devon_arc_complete'],
        thoughtId: 'pattern-seeker'
      }
    ],
    tags: ['ending', 'devon_arc']
  },

  // ============= BAD ENDING =============
  {
    nodeId: 'devon_bad_ending',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You're right. Emotions are noise. I was foolish to think I could integrate them.\n\nI'm going back to the flowchart. I need to refine the error handling. If he hangs up, I'll call back with a different script.\n\nPeople are systems. I haven't cracked the code yet.",
        emotion: 'cold_robotic',
        variation_id: 'bad_ending_v1'
      }
    ],
    choices: [
      {
        choiceId: 'devon_leave_bad',
        text: "...",
        nextNodeId: samuelEntryPoints.DEVON_REFLECTION_GATEWAY,
        visibleCondition: {
          hasGlobalFlags: ['devon_arc_complete'],
          lacksGlobalFlags: ['reflected_on_devon']
        },
        pattern: 'analytical'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['devon_chose_logic', 'devon_arc_complete'],
        thoughtId: 'analytical-eye'
      }
    ],
    tags: ['ending', 'bad_ending', 'devon_arc']
  },

  // ============= FAREWELL NODES =============
  {
    nodeId: 'devon_farewell_integration',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "I'm going to call him. Engineer and son. Both.\n\nBut I'm terrified I'll optimize again. Fall back into solution mode.\n\nThis will be work. Every conversation. Catching myself.\n\nThank you. Samuel's waiting.",
        emotion: 'determined_but_fragile',
        variation_id: 'farewell_integration_v2_complex'
      }
    ],
    patternReflection: [
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: "I'm going to call him. Engineer and son. Both.\n\nBut I'm terrified I'll optimize again. Fall back into solution mode.\n\nYou think systematically too. but you showed me there's room for both. Thank you.\n\nSamuel's waiting.",
        altEmotion: 'kindred_fragile'
      },
      {
        pattern: 'patience',
        minLevel: 5,
        altText: "I'm going to call him. Engineer and son. Both.\n\nBut I'm terrified I'll optimize again. Fall back into solution mode.\n\nThe way you waited for me to process... that's what I need to do for him. Thank you.\n\nSamuel's waiting.",
        altEmotion: 'grateful_fragile'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_integration',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.DEVON_REFLECTION_GATEWAY,
        visibleCondition: {
          hasGlobalFlags: ['devon_arc_complete'],
          lacksGlobalFlags: ['reflected_on_devon']
        },
        pattern: 'exploring'
      }
    ],
    tags: ['transition', 'devon_arc', 'bittersweet']
  },

  {
    nodeId: 'devon_farewell_heart',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "I'm going to call him. Let my heart do the talking.\n\nI don't know how. Twenty-two years of thinking first.\n\nBut that's what trying looks like. Doing it even when you don't know how.\n\nThank you. Tell Samuel Devon finally understood.",
        emotion: 'vulnerable_determination',
        variation_id: 'farewell_heart_v2_complex',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_heart',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.DEVON_REFLECTION_GATEWAY,
        visibleCondition: {
          hasGlobalFlags: ['devon_arc_complete'],
          lacksGlobalFlags: ['reflected_on_devon']
        },
        pattern: 'helping'
      }
    ],
    tags: ['transition', 'devon_arc', 'bittersweet'],
    metadata: {
      sessionBoundary: true  // Session 3: Resolution reached
    }
  },

  {
    nodeId: 'devon_farewell_presence',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "I'm going to call him. Be present. No agenda.\n\nMom knew how to be both. Present and helpful. I only knew helpful.\n\nLearning to exist with someone's pain. Everything in me screams to act.\n\nBut maybe that's growth.\n\nSamuel's waiting.",
        emotion: 'raw_courage',
        variation_id: 'farewell_presence_v2_complex'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_presence',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.DEVON_REFLECTION_GATEWAY,
        visibleCondition: {
          hasGlobalFlags: ['devon_arc_complete'],
          lacksGlobalFlags: ['reflected_on_devon']
        },
        pattern: 'patience'
      }
    ],
    tags: ['transition', 'devon_arc', 'bittersweet']
  },

  // [PLACEHOLDER FOR BONUS NODES - PRESERVED STRUCTURE]
  {
    nodeId: 'devon_realizes_bridge',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "What if... what if I stopped trying to optimize the conversation and just... asked him about the systems he's debugging at Marshall?",
        emotion: 'hopeful',
        variation_id: 'realizes_bridge_v1',
        voiceVariations: {
          analytical: "Wait. New hypothesis: What if I stopped trying to optimize the conversation parameters and just... queried his current work? Asked him about the systems he's debugging at Marshall?",
          helping: "What if... what if I stopped trying to fix the conversation and just... connected? Asked him about his work? The systems he's debugging at Marshall?",
          building: "What if... what if I stopped trying to construct the perfect conversation and just... built on what we both understand? Asked him about the systems he's debugging at Marshall?",
          exploring: "What if... what if there's a simpler path I haven't tried? What if I just... asked him about the systems he's debugging at Marshall?",
          patience: "What if... what if I stopped rushing to solve it and just... let the conversation happen? Asked him about the systems he's debugging at Marshall? Let it take time?"
        }
      }
    ],
    choices: [
      {
        choiceId: 'support_approach',
        text: "That sounds like a real conversation, not a scripted one.",
        nextNodeId: 'devon_grateful_insight',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      }
    ]
  },
  {
    nodeId: 'devon_grateful_insight',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "I've been so focused on fixing the conversation. I forgot we could have one.",
        emotion: 'grateful',
        variation_id: 'grateful_insight_v1',
        voiceVariations: {
          patience: "You stayed with me through all that debugging. I've been so focused on fixing the conversation. I forgot we could have one.",
          helping: "You saw what I couldn't. I've been so focused on fixing the conversation. I forgot we could have one.",
          analytical: "You helped me see the logic error. I've been so focused on fixing the conversation. I forgot we could have one.",
          building: "You helped me construct a solution I couldn't see. I've been so focused on fixing the conversation. I forgot we could have one.",
          exploring: "Your questions led me here. I've been so focused on fixing the conversation. I forgot we could have one."
        }
      }
    ],
    choices: [
      {
        choiceId: 'devon_continue_to_reciprocity',
        text: "(Continue)",
        nextNodeId: 'devon_asks_player',
        pattern: 'patience'
      }
    ]
  },
  // ============= RECIPROCITY: DEVON ASKS PLAYER =============
  {
    nodeId: 'devon_asks_player',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "I've been trying to debug my relationship with my dad. But... I realize I've been asking you questions this whole time.\n\nTechnically speaking, that's asymmetric. So: how do you handle relationships when logic doesn't work? When someone you care about is hurting and you can't fix it?",
        emotion: 'curious_vulnerable',
        variation_id: 'devon_reciprocity_v1'
      }
    ],
    choices: [
      {
        choiceId: 'player_try_to_fix',
        text: "I try to fix it anyway. Offer solutions, try to make it better. Sometimes I make it worse because I can't just... be there.",
        nextNodeId: 'devon_crossroads',
        pattern: 'building',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'player_listen_first',
        text: "I try to listen first. Understand, not solve. But I want to help, so I jump to solutions.",
        nextNodeId: 'devon_crossroads',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'player_analyze_patterns',
        text: "I look for patterns. What's worked before? What hasn't? I treat it like a problem to solve, even though I know emotions don't work that way.",
        nextNodeId: 'devon_crossroads',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication']
      },
      {
        choiceId: 'player_feel_helpless',
        text: "Honestly? I feel helpless. I want to do something, anything, but sometimes there's nothing to do except be present. That feels like not enough.",
        nextNodeId: 'devon_crossroads',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      }
    ],
    tags: ['reciprocity', 'player_reflection', 'devon_arc']
  },
  {
    nodeId: 'devon_crossroads_alt',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "That's... that's exactly what I've been doing. Trying to fix. Trying to solve. But grief isn't a bug to debug.\n\nMaybe I need to just... be there. Like you've been here for me.",
        emotion: 'realization',
        variation_id: 'devon_crossroads_v1'
      }
    ],
    choices: [
      {
        choiceId: 'devon_support',
        text: "Asking about his work. That's showing up.",
        nextNodeId: 'devon_farewell',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      }
    ],
    tags: ['crossroads', 'devon_arc']
  },
  // ============= DEVON'S VULNERABILITY ARC =============
  // "The call he didn't answer"
  {
    nodeId: 'devon_vulnerability_arc',
    speaker: 'Devon Kumar',
    requiredState: { trust: { min: 6 } },
    content: [{
      text: "There's something I've never processed.\n\nThe night mom died. I was debugging a production outage. Critical system. Couldn't leave.\n\nDad called. Twice. I silenced both.\n\nThird call. Voicemail. \"Devon, your mother... she's... please come.\"\n\nI optimized for the wrong system. Fixed the server. Lost the goodbye.\n\nTwo hours. That's how long it would have taken to drive home. Two hours I could have had. Instead I watched log files.",
      emotion: 'hollowed',
      microAction: 'His fingers tap an invisible keyboard, a nervous habit.',
      variation_id: 'vulnerability_v1',
      richEffectContext: 'error',
      patternReflection: [
        {
          pattern: 'analytical',
          minLevel: 5,
          altText: "You think in systems. Maybe you understand this optimization failure.\n\nThe night mom died. Production outage. Critical system. I ran the analysis: server down = thousands affected. Dad's calls = personal emergency.\n\nI optimized for scale. Silenced both calls.\n\nThird call. Voicemail. \"Devon, your mother... she's... please come.\"\n\nI fixed the server. Lost the goodbye. Two hours I could have had. Instead I analyzed log files.\n\nThe analytical mind that calculated wrong. Some systems can't be measured in user impact.",
          altEmotion: 'analytical_hollowed'
        },
        {
          pattern: 'patience',
          minLevel: 5,
          altText: "You understand patience. Taking time for what matters.\n\nThe night mom died. Production outage. Critical system. I thought: fix this first, then go home. I had time.\n\nDad called. Twice. I silenced both. I'd call back after the fix.\n\nThird call. Voicemail. \"Devon, your mother... she's... please come.\"\n\nI waited too long. Fixed the server. Lost the goodbye. Two hours I should have taken.\n\nPatience for the wrong priority. I should have dropped everything immediately.",
          altEmotion: 'regret_hollowed'
        },
        {
          pattern: 'exploring',
          minLevel: 5,
          altText: "You explore problems. You dig into systems. I was too.\n\nThe night mom died. Production outage. I was exploring the logs, mapping the failure chain. Critical system.\n\nDad called. Twice. I silenced both. Deep in the debugging maze.\n\nThird call. Voicemail. \"Devon, your mother... she's... please come.\"\n\nI explored the wrong territory. Fixed the server. Lost the goodbye. Two hours of exploring code instead of being with her.\n\nThe explorer who got lost in the wrong problem.",
          altEmotion: 'grief_hollowed'
        },
        {
          pattern: 'helping',
          minLevel: 5,
          altText: "You help people. I thought I was helping people.\n\nThe night mom died. Production outage. Thousands of users affected. I had to help them. Critical system.\n\nDad called. Twice. I silenced both. I was helping.\n\nThird call. Voicemail. \"Devon, your mother... she's... please come.\"\n\nI helped strangers. Lost the chance to help the person who mattered most. Fixed the server. Lost the goodbye.\n\nTwo hours I could have spent with her. Instead I helped people I'll never meet.",
          altEmotion: 'devastated_hollowed'
        },
        {
          pattern: 'building',
          minLevel: 5,
          altText: "You build things. You fix systems. I was fixing a system.\n\nThe night mom died. Production outage. Critical infrastructure. I was the one who built it. I had to fix it.\n\nDad called. Twice. I silenced both. The system needed me.\n\nThird call. Voicemail. \"Devon, your mother... she's... please come.\"\n\nI fixed the server. Lost the goodbye. Two hours watching logs instead of holding her hand.\n\nThe builder who prioritized construction over connection.",
          altEmotion: 'builder_hollowed'
        }
      ]
    }],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['devon_vulnerability_revealed', 'knows_the_call']
      }
    ],
    choices: [
      {
        choiceId: 'vuln_couldnt_know',
        text: "You couldn't have known. That's not optimization. That's being human.",
        nextNodeId: 'devon_vulnerability_reflection',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'vuln_system_taught',
        text: "The system you learned that night. Is that why you're trying to be present for your dad now?",
        nextNodeId: 'devon_vulnerability_reflection',
        pattern: 'analytical',
        skills: ['emotionalIntelligence', 'systemsThinking'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      },
      {
        choiceId: 'vuln_silence',
        text: "[Don't fill the silence. Let him feel it.]",
        nextNodeId: 'devon_vulnerability_reflection',
        pattern: 'patience',
        archetype: 'STAY_SILENT',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      }
    ],
    tags: ['vulnerability_arc', 'devon_arc', 'emotional_core']
  },
  {
    nodeId: 'devon_vulnerability_reflection',
    speaker: 'Devon Kumar',
    content: [{
      text: "Dad never blamed me. That's worse, somehow.\n\nHe just said: \"You were doing your job. Your mother would have understood.\"\n\nBut I don't understand. I don't understand how I became someone who optimizes systems instead of showing up for people.\n\nYou're the first person I've told the full sequence. Not the sanitized \"I was at work\" version.\n\nThe one where I chose code over family. And I still don't know how to forgive the algorithm that made that choice.",
      emotion: 'broken_honest',
      variation_id: 'reflection_v1'
    }],
    choices: [
      {
        choiceId: 'vuln_continue',
        text: "(Continue)",
        nextNodeId: 'devon_farewell',
        pattern: 'patience'
      }
    ],
    tags: ['vulnerability_arc', 'devon_arc']
  },
  {
    nodeId: 'devon_farewell',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "For listening. For not trying to fix me.\n\nI think I know what to do now. Not a solution. A different approach.\n\nSamuel's waiting. Good luck with your own journey.",
        emotion: 'grateful_resolved',
        variation_id: 'devon_farewell_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.HUB_AFTER_DEVON,
        pattern: 'exploring'
      }
    ],
    tags: ['farewell', 'devon_arc'],
    onEnter: [
      {
        addGlobalFlags: ['devon_arc_complete'],
        thoughtId: 'system-restored'
      }
    ]
  },
  {
    nodeId: 'devon_revisit_welcome',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You're back. I was just optimizing my schedule for next semester.\n\nDid you need something, or just checking if my logic processor is still overheating?",
        emotion: 'amused',
        variation_id: 'revisit_v1'
      }
    ],
    choices: [
      {
        choiceId: 'revisit_chat',
        text: "Just wanted to see how you're doing.",
        nextNodeId: 'devon_father_hint', // Loop back to main loop for now or simple close
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'revisit_leave',
        text: "I'll let you get back to it.",
        nextNodeId: samuelEntryPoints.HUB_AFTER_DEVON, // Return to hub
        pattern: 'patience'
      }
    ],
    tags: ['revisit', 'devon_arc']
  },

  // ============= CAREER MENTION NODES (Invisible Depth) =============
  {
    nodeId: 'devon_career_reflection_systems',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You think like a process engineer. Not just fixing problems. Understanding why systems break in the first place.\n\nI used to think engineering was about building things. But the best engineers I've met? They're optimizers. They see the whole picture and find the leverage points.\n\nThat patience you have. Waiting for the right answer instead of the fast one. That's what separates good engineers from great ones.",
        emotion: 'impressed',
        variation_id: 'career_systems_v1'
      }
    ],
    requiredState: {
      patterns: { analytical: { min: 5 }, patience: { min: 4 } }
    },
    onEnter: [
      {
        characterId: 'devon',
        addGlobalFlags: ['combo_systems_thinker_achieved', 'devon_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'systems_curious',
        text: "What do process engineers actually work on?",
        nextNodeId: 'devon_crossroads',
        pattern: 'exploring',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'systems_relate',
        text: "I like understanding how things connect.",
        nextNodeId: 'devon_crossroads',
        pattern: 'analytical'
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'engineering']
  },

  {
    nodeId: 'devon_career_reflection_sustainability',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You build things that last. I can tell by how you approach problems. Not just solving for now, but thinking about what comes after.\n\nSustainability engineering is exactly that. Designing systems that don't just work today, but heal instead of harm over time.\n\nAlabama Power, Southern Company. They're investing heavily in sustainable infrastructure. People who can build AND think long-term? They're in demand.\n\nYou've got that combination.",
        emotion: 'thoughtful',
        variation_id: 'career_sustainability_v1'
      }
    ],
    requiredState: {
      patterns: { building: { min: 5 }, patience: { min: 4 } }
    },
    onEnter: [
      {
        characterId: 'devon',
        addGlobalFlags: ['combo_sustainable_builder_achieved', 'devon_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'sustainability_interested',
        text: "Building things that heal... that's what I want.",
        nextNodeId: 'devon_crossroads',
        pattern: 'building',
        skills: ['systemsThinking']
      },
      {
        choiceId: 'sustainability_practical',
        text: "How do you get into sustainability engineering?",
        nextNodeId: 'devon_crossroads',
        pattern: 'exploring',
        skills: ['adaptability']
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'sustainability']
  },

  // ============= ADDITIONAL CAREER REFLECTIONS =============
  {
    nodeId: 'devon_career_reflection_ux',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You know what I see in how you approach problems? You're thinking about the user. The human at the end of the system.\n\nUX engineering combines both worlds. The technical rigor of building systems and the empathy of understanding people.\n\nIt's where my flowcharts and my... family work... actually overlap. Understanding why people do what they do. Then building things that meet them where they are.",
        emotion: 'connecting',
        variation_id: 'career_ux_v1'
      }
    ],
    requiredState: {
      patterns: { helping: { min: 5 }, building: { min: 4 } }
    },
    onEnter: [
      {
        characterId: 'devon',
        addGlobalFlags: ['combo_ux_engineer_achieved', 'devon_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'ux_interested',
        text: "Systems and empathy together. That's where the real solutions live.",
        nextNodeId: 'devon_crossroads',
        pattern: 'helping',
        skills: ['systemsThinking']
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'ux']
  },

  {
    nodeId: 'devon_career_reflection_operations',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You think like an operations engineer. The big picture. How all the pieces fit together.\n\nOperations management is about keeping complex systems running. Factories, hospitals, supply chains. Making sure the right things happen at the right time.\n\nBirmingham's rebuilding its manufacturing sector. They need people who can see the whole machine, not just the individual gears.",
        emotion: 'respectful',
        variation_id: 'career_operations_v1'
      }
    ],
    requiredState: {
      patterns: { analytical: { min: 5 }, patience: { min: 4 } }
    },
    onEnter: [
      {
        characterId: 'devon',
        addGlobalFlags: ['combo_operations_achieved', 'devon_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'operations_continue',
        text: "Keeping the machine running. That takes patience and precision.",
        nextNodeId: 'devon_crossroads',
        pattern: 'patience',
        skills: ['systemsThinking']
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'operations']
  },

  // ============= FATHER RELATIONSHIP DEPTH =============
  {
    nodeId: 'devon_father_memory',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "My dad used to do this too. Not flowcharts. He was a mechanic. But the same thing. Breaking problems into pieces.\n\nWhen I was ten, our car broke down. He didn't call a tow truck. He sat me down, opened the hood, and said: \"Every problem has a cause. Find the cause, find the fix.\"\n\nWe spent four hours tracing wires. I thought I was helping. Really, he was teaching.\n\nI haven't heard his voice in two years. Not really. Just... polite distance.",
        emotion: 'tender_grief',
        variation_id: 'father_memory_v1'
      }
    ],
    requiredState: {
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'father_memory_continue',
        text: "He taught you how to think. That's still with you.",
        nextNodeId: 'devon_father_teaching',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      },
      {
        choiceId: 'father_memory_question',
        text: "What happened? Between you and him.",
        nextNodeId: 'devon_father_distance',
        pattern: 'exploring',
        skills: ['communication']
      }
    ],
    tags: ['devon_arc', 'father', 'emotional_depth']
  },

  {
    nodeId: 'devon_father_teaching',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Yeah. He's in everything I build.\n\nThe way I label my variables. His naming convention for parts. The way I test things twice. His \"measure twice, cut once.\" Even this flowchart... it's his diagnostic method, just digitized.\n\nI never told him any of this. He thinks I left behind everything he taught me when I went to college.\n\nHe doesn't know he's the foundation of every system I design.",
        emotion: 'realization',
        variation_id: 'father_teaching_v1',
        voiceVariations: {
          patience: "You took the time to understand this. Yeah. He's in everything I build.\n\nThe way I label my variables. His naming convention for parts. The way I test things twice. His \"measure twice, cut once.\" Even this flowchart... it's his diagnostic method, just digitized.\n\nI never told him any of this. He thinks I left behind everything he taught me when I went to college.\n\nHe doesn't know he's the foundation of every system I design.",
          helping: "You helped me see this. Yeah. He's in everything I build.\n\nThe way I label my variables. His naming convention for parts. The way I test things twice. His \"measure twice, cut once.\" Even this flowchart... it's his diagnostic method, just digitized.\n\nI never told him any of this. He thinks I left behind everything he taught me when I went to college.\n\nHe doesn't know he's the foundation of every system I design.",
          analytical: "You helped me analyze what I couldn't see. Yeah. He's in everything I build.\n\nThe way I label my variables. His naming convention for parts. The way I test things twice. His \"measure twice, cut once.\" Even this flowchart... it's his diagnostic method, just digitized.\n\nI never told him any of this. He thinks I left behind everything he taught me when I went to college.\n\nHe doesn't know he's the foundation of every system I design.",
          building: "You helped me build this bridge. Yeah. He's in everything I build.\n\nThe way I label my variables. His naming convention for parts. The way I test things twice. His \"measure twice, cut once.\" Even this flowchart... it's his diagnostic method, just digitized.\n\nI never told him any of this. He thinks I left behind everything he taught me when I went to college.\n\nHe doesn't know he's the foundation of every system I design.",
          exploring: "Your curiosity led me here. Yeah. He's in everything I build.\n\nThe way I label my variables. His naming convention for parts. The way I test things twice. His \"measure twice, cut once.\" Even this flowchart... it's his diagnostic method, just digitized.\n\nI never told him any of this. He thinks I left behind everything he taught me when I went to college.\n\nHe doesn't know he's the foundation of every system I design."
        }
      }
    ],
    choices: [
      {
        choiceId: 'teaching_continue',
        text: "Maybe he needs to hear that. That he's still part of what you build.",
        nextNodeId: 'devon_hub_return',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    tags: ['devon_arc', 'father', 'insight']
  },

  {
    nodeId: 'devon_father_distance',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Mom died. Three years ago. Cancer.\n\nAnd Dad just... shut down. Same way he used to when a car was too broken to fix. \"Some things you can't diagnose.\"\n\nI tried to help. Made spreadsheets of her medications. Optimized her care schedule. Built systems to make the impossible manageable.\n\nHe called it \"cold.\" Said I was treating her like a machine problem, not a person.\n\nMaybe he was right. Or maybe it was the only way I knew how to love her.",
        emotion: 'raw_pain',
        variation_id: 'father_distance_v1'
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['knows_about_mother']
      }
    ],
    choices: [
      {
        choiceId: 'distance_understand',
        text: "You loved her the way you know how. Systems were your language.",
        nextNodeId: 'devon_systems_love',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      }
    ],
    tags: ['devon_arc', 'vulnerability', 'grief']
  },

  {
    nodeId: 'devon_systems_love',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Systems were my language.\n\nWhen I was scared, I made lists. When I was helpless, I made schedules. When I couldn't fix her, I tried to fix everything around her.\n\nDad dealt with it by being present. Just sitting with her. Holding her hand. No agenda.\n\nWe both loved her. In completely different languages.\n\nAnd after she was gone... we couldn't translate anymore.",
        emotion: 'vulnerable_clarity',
        variation_id: 'systems_love_v1'
      }
    ],
    choices: [
      {
        choiceId: 'systems_love_continue',
        text: "The flowchart. It's teaching you his language, isn't it?",
        nextNodeId: 'devon_hub_return',
        pattern: 'analytical',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      }
    ],
    tags: ['devon_arc', 'vulnerability', 'breakthrough']
  },

  {
    nodeId: 'devon_father_hope',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "The Conversation Optimizer isn't really about him, is it?\n\nIt's about me. Learning to listen instead of solve. To be present instead of productive.\n\nWhat if I showed him the flowchart? Not to use it on him. To show him I'm trying.\n\n\"Dad, I built this because I didn't know how to talk to you. But I want to learn.\"\n\nWould that be crazy? Using a system to apologize for using systems?",
        emotion: 'hopeful_uncertain',
        variation_id: 'father_hope_v1'
      }
    ],
    requiredState: {
      trust: { min: 6 }
    },
    choices: [
      {
        choiceId: 'hope_encourage',
        text: "It's not crazy. It's honest. You're showing him who you are while reaching for who he is.",
        nextNodeId: 'devon_hub_return',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'wisdom'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      }
    ],
    tags: ['devon_arc', 'father', 'hope']
  },

  // ============= SYSTEMS PHILOSOPHY =============
  {
    nodeId: 'devon_systems_philosophy',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You know what most people get wrong about systems? They think systems are cold. Mechanical. Inhuman.\n\nBut every system is a story about what matters.\n\nTraffic lights tell a story about safety. Hospital schedules tell a story about care. My flowchart... it tells a story about a son trying to reconnect.\n\nThe logic isn't the opposite of feeling. It's feeling, made visible.",
        emotion: 'philosophical',
        variation_id: 'systems_philosophy_v1'
      }
    ],
    choices: [
      {
        choiceId: 'philosophy_agree',
        text: "Logic as feeling made visible. I've never thought of it that way.",
        nextNodeId: 'devon_hub_return',
        pattern: 'analytical',
        skills: ['systemsThinking'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    tags: ['devon_arc', 'philosophy', 'insight']
  },

  {
    nodeId: 'devon_optimization_trap',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Want to hear about my worst habit?\n\nI optimize everything. Shower routine: 7 minutes. Morning coffee: while code compiles. Conversations: mapped for maximum information transfer.\n\nEfficient. Also exhausting. Also lonely.\n\nSome of the best moments with Mom were completely unoptimized. Sitting on the porch. Not talking. Just... being.\n\nI'm trying to remember how to waste time with people I love. It's harder than it should be.",
        emotion: 'self_aware',
        variation_id: 'optimization_trap_v1'
      }
    ],
    choices: [
      {
        choiceId: 'optimization_respond',
        text: "Wasted time with people you love isn't wasted. It's the whole point.",
        nextNodeId: 'devon_hub_return',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    tags: ['devon_arc', 'vulnerability', 'growth']
  },

  {
    nodeId: 'devon_debug_people',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Here's something I've learned the hard way: you can't debug people.\n\nCode has consistent behavior. Same input, same output. People? They're different every day. Different moods, different contexts, different histories.\n\nMy first instinct is always \"find the pattern, fix the bug.\" But people aren't bugs. They're features. Complicated, contradictory, beautiful features.\n\nI'm learning to appreciate the inconsistency. Slowly.",
        emotion: 'growing',
        variation_id: 'debug_people_v1'
      }
    ],
    choices: [
      {
        choiceId: 'debug_continue',
        text: "Features, not bugs. That's a healthier way to see people.",
        nextNodeId: 'devon_hub_return',
        pattern: 'helping',
        skills: ['wisdom']
      }
    ],
    tags: ['devon_arc', 'philosophy', 'growth']
  },

  // ============= BIRMINGHAM CONNECTION =============
  {
    nodeId: 'devon_birmingham_roots',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "People think Birmingham is behind. Rust Belt. Manufacturing ghost town.\n\nThey're wrong. This city is rebuilding itself. From iron forges to medical research. From steel mills to tech incubators.\n\nI could work anywhere. Silicon Valley called. Twice. But here... here I can build things that matter to people I know.\n\nMy neighbor's daughter uses an app I helped design. My old teacher's hospital runs on systems I optimized.\n\nThat's not possible in San Francisco. Here, I can see the impact.",
        emotion: 'rooted_pride',
        variation_id: 'birmingham_roots_v1'
      }
    ],
    choices: [
      {
        choiceId: 'birmingham_continue',
        text: "Building for people you know. That changes what you build.",
        nextNodeId: 'devon_hub_return',
        pattern: 'building',
        skills: ['wisdom'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    tags: ['devon_arc', 'birmingham', 'local']
  },

  {
    nodeId: 'devon_birmingham_future',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You want to know what Birmingham looks like in ten years? I've been modeling it.\n\nClean energy hub. Medical technology corridor. Advanced manufacturing center. All the pieces are there. UAB, the startup scene, the workforce ready to be retrained.\n\nThe old Birmingham made things with iron and sweat. The new Birmingham will make things with code and creativity.\n\nAnd I want to be part of building it. Not as an outsider importing solutions. As someone who grew up here, building for here.",
        emotion: 'visionary',
        variation_id: 'birmingham_future_v1'
      }
    ],
    choices: [
      {
        choiceId: 'future_continue',
        text: "From iron to code. That's not just progress. That's transformation.",
        nextNodeId: 'devon_hub_return',
        pattern: 'building',
        skills: ['visionaryThinking']
      }
    ],
    tags: ['devon_arc', 'birmingham', 'future']
  },

  // ============= CROSS-CHARACTER CONNECTIONS =============
  {
    nodeId: 'devon_mentions_maya',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "There's this student. Maya. Works on robots for physical therapy.\n\nShe thinks she's not a \"real engineer.\" Meanwhile, she's building adaptive AI systems that most professionals couldn't dream of.\n\nImposter syndrome. I had it too. Still do, sometimes. The fear that someone's going to realize you're faking it.\n\nShe doesn't see how her heart makes her work better, not worse. Empathy as engineering input.",
        emotion: 'admiring',
        variation_id: 'mentions_maya_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['met_maya']
    },
    choices: [
      {
        choiceId: 'maya_continue',
        text: "Empathy as engineering input. You understand that now too.",
        nextNodeId: 'devon_hub_return',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['devon_arc', 'cross_character', 'maya']
  },

  {
    nodeId: 'devon_mentions_rohan',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Rohan. The ghost hunter. Have you met him?\n\nHe's down there tracing hallucinated code, trying to understand what machines dream about.\n\nWe argue sometimes. He thinks I'm too focused on efficiency. I think he's too attached to the past. But we're both asking the same question:\n\nWhat does it mean to understand something? Really understand it, not just use it?\n\nDifferent approaches. Same obsession.",
        emotion: 'respectful_disagreement',
        variation_id: 'mentions_rohan_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['met_rohan']
    },
    choices: [
      {
        choiceId: 'rohan_continue',
        text: "Different approaches to the same obsession. That's how breakthroughs happen.",
        nextNodeId: 'devon_hub_return',
        pattern: 'analytical',
        skills: ['systemsThinking']
      }
    ],
    tags: ['devon_arc', 'cross_character', 'rohan']
  },

  // ============= EMOTIONAL DEPTH =============
  {
    nodeId: 'devon_loneliness',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You want to know something pathetic?\n\nI have 3,000 connections on LinkedIn. 47 \"close friends\" on a social app. Zero people I can call at 3am when I can't sleep.\n\nI optimized my social network. Pruned the inactive connections. Maintained relationships with strategic value.\n\nCongratulations, Devon. Your social graph is beautiful. And you're completely alone.",
        emotion: 'lonely_honest',
        variation_id: 'loneliness_v1'
      }
    ],
    requiredState: {
      trust: { min: 6 }
    },
    choices: [
      {
        choiceId: 'loneliness_respond',
        text: "You're not alone right now. This conversation is real.",
        nextNodeId: 'devon_loneliness_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      }
    ],
    tags: ['devon_arc', 'vulnerability', 'loneliness']
  },

  {
    nodeId: 'devon_loneliness_response',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Yeah. This is real, isn't it?\n\nNo agenda. No strategic value. Just... talking. Like people used to do.\n\nMaybe that's what I've been missing. Not more connections. Fewer. But real ones.\n\nQuality over quantity. Isn't that basic systems design? I somehow forgot to apply it to my own life.",
        emotion: 'dawning_realization',
        variation_id: 'loneliness_response_v1'
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['devon_loneliness_acknowledged']
      }
    ],
    choices: [
      {
        choiceId: 'loneliness_continue',
        text: "The best systems are simple. Maybe relationships are the same.",
        nextNodeId: 'devon_hub_return',
        pattern: 'patience',
        skills: ['wisdom']
      }
    ],
    tags: ['devon_arc', 'vulnerability', 'breakthrough']
  },

  {
    nodeId: 'devon_failure_story',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "My biggest failure? Easy. The Day Mom's Medical System Crashed.\n\nI'd built this beautiful medication tracker. Alerts, interactions, scheduling. My masterpiece.\n\nIt crashed the morning of her worst day. Corrupted database. No backup. Because I was so confident in my code, I didn't test the recovery path.\n\nShe missed her meds. Had a bad reaction. Dad had to rush her to the ER.\n\nHe never said \"I told you so.\" He didn't have to. The silence was enough.",
        emotion: 'shame',
        variation_id: 'failure_story_v1'
      }
    ],
    choices: [
      {
        choiceId: 'failure_respond',
        text: "You learned something that day that no textbook could teach.",
        nextNodeId: 'devon_hub_return',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    tags: ['devon_arc', 'failure', 'growth']
  },

  {
    nodeId: 'devon_what_ifs',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "I run scenarios. Professionally and... personally.\n\nWhat if I hadn't gone to college across the country? What if I'd stayed closer to home?\n\nWhat if I'd spent less time building systems and more time sitting with Mom?\n\nWhat if the last real conversation I had with Dad wasn't an argument?\n\nThe scenarios don't help. But I can't stop running them.",
        emotion: 'regret',
        variation_id: 'what_ifs_v1'
      }
    ],
    requiredState: {
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'what_ifs_respond',
        text: "You can't optimize the past. But you can still write the future.",
        nextNodeId: 'devon_hub_return',
        pattern: 'analytical',
        skills: ['wisdom'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    tags: ['devon_arc', 'vulnerability', 'regret']
  },

  // ============= WORK AND PURPOSE =============
  {
    nodeId: 'devon_why_systems',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Why systems? Everyone asks.\n\nWhen I was eight, there was a power outage. Three days. No heat. February.\n\nI watched my dad figure out, step by step, how to keep us warm. Blankets layered in specific order. Candles positioned for maximum heat distribution. A system.\n\nHe made chaos manageable. He made the impossible feel possible.\n\nThat's what systems are for. Not control. Calm. Making sense of things that don't make sense.",
        emotion: 'origin_story',
        variation_id: 'why_systems_v1'
      }
    ],
    choices: [
      {
        choiceId: 'why_systems_continue',
        text: "Systems as calm in chaos. That's what you're building for your dad now.",
        nextNodeId: 'devon_hub_return',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    tags: ['devon_arc', 'origin', 'purpose']
  },

  {
    nodeId: 'devon_best_work',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "My best work? Not the enterprise systems. Not the optimized workflows.\n\nA grief support app. Never launched. Personal project after Mom died.\n\nIt didn't try to fix grief. It just helped you track it. Good days, bad days, triggers, small victories.\n\nNo solutions. Just acknowledgment. \"Today is hard. That's real. You're not crazy.\"\n\nI showed it to a therapist friend. She cried. Said it was the first tech she'd seen that actually understood grief.\n\nMaybe that's what Dad needs. Not a conversation optimizer. A grief companion. Something that says \"this is hard\" instead of \"here's how to fix it.\"",
        emotion: 'tender_insight',
        variation_id: 'best_work_v1'
      }
    ],
    requiredState: {
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'best_work_continue',
        text: "You already know what he needs. You just built it in the wrong direction.",
        nextNodeId: 'devon_hub_return',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      }
    ],
    tags: ['devon_arc', 'purpose', 'breakthrough']
  },

  {
    nodeId: 'devon_process',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Want to see how I actually work?\n\nStep one: Define the problem. Not the surface problem. The real one underneath.\n\nStep two: Map the system. All the pieces. All the connections.\n\nStep three: Find the leverage point. The one change that affects everything else.\n\nStep four: Test. Fail. Learn. Repeat.\n\nSimple, right? Except step one takes forever. Because people, including me, are terrible at knowing what the real problem is.",
        emotion: 'teaching',
        variation_id: 'process_v1',
        skillReflection: [
          { skill: 'systemsThinking', minLevel: 5, altText: "Want to see how I actually work? You already think in systems—I can tell by your questions.\n\nStep one: Define the real problem underneath. Step two: Map the system. Step three: Find the leverage point. Step four: Test, fail, learn.\n\nYou've got the systems thinking instinct. Just remember: step one is where everyone fails. Including us.", altEmotion: 'appreciative' },
          { skill: 'criticalThinking', minLevel: 5, altText: "Want to see how I actually work? You ask sharp questions—you'll appreciate this.\n\nStep one: Find the real problem underneath. Step two: Map everything. Step three: Find leverage. Step four: Iterate.\n\nYour critical thinking is an asset here. But it can also be a trap—sometimes we analyze so deeply we forget to build.", altEmotion: 'knowing' }
        ],
        patternReflection: [
          { pattern: 'analytical', minLevel: 4, altText: "You think systematically. So you'll appreciate this process.\n\nStep one: Define the real problem underneath. Step two: Map the system—pieces, connections. Step three: Find the leverage point. Step four: Test, fail, learn, repeat.\n\nYou have the analytical mind for this. But step one is the trap—we're all terrible at knowing what the real problem is. Including me. Including you. Stay skeptical of your first answer.", altEmotion: 'teaching' },
          { pattern: 'building', minLevel: 4, altText: "You're a builder. Here's my building process.\n\nStep one: Define the real problem (not the surface one). Step two: Map the entire system. Step three: Find the leverage point—the one change that affects everything. Step four: Build, test, fail, learn.\n\nSimple framework. But step one is deceptive—builders want to start building. Force yourself to define the real problem first. What are you actually building? Why?", altEmotion: 'mentoring' },
          { pattern: 'patience', minLevel: 4, altText: "You're patient. That patience will save you here.\n\nStep one: Define the real problem underneath. Step two: Map the system. Step three: Find leverage. Step four: Test, fail, learn.\n\nStep one takes forever. Because we're all terrible at seeing the real problem. Your patience is your advantage—most people rush past step one. You can afford to wait until you know what you're actually solving.", altEmotion: 'teaching' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'process_continue',
        text: "The real problem with your dad isn't communication. It's connection.",
        nextNodeId: 'devon_hub_return',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    tags: ['devon_arc', 'process', 'insight']
  },

  // ============= ADDITIONAL DEPTH =============
  {
    nodeId: 'devon_midnight_work',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You know when the best ideas come? 2am. When the world goes quiet and there's no one to perform for.\n\nThat's when the flowchart started. Not during the day when I was \"working.\" In the dark, when I couldn't sleep because I missed my dad.\n\nI think my brain solves problems while my heart grieves. They run in parallel. Different processes. Same system.",
        emotion: 'tired_honest',
        variation_id: 'midnight_work_v1'
      }
    ],
    choices: [
      {
        choiceId: 'midnight_continue',
        text: "Parallel processes. Your heart and brain are both working on the same problem.",
        nextNodeId: 'devon_hub_return',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['devon_arc', 'process', 'vulnerability']
  },

  {
    nodeId: 'devon_mentors',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "My first programming teacher. Mr. Krishnan. Community college intro course.\n\nHe didn't just teach syntax. He taught thinking. \"Every program is a conversation with future you. Be kind to that person.\"\n\nI still comment my code like I'm explaining it to someone I care about. Because of him.\n\nDad thinks I left behind everything he taught me. But Mr. Krishnan? He built on Dad's foundation. The careful thinking, the systematic approach.\n\nDad just can't see the connection. Or I haven't shown it to him.",
        emotion: 'grateful_reflective',
        variation_id: 'mentors_v1'
      }
    ],
    choices: [
      {
        choiceId: 'mentors_continue',
        text: "Show him the connection. He might recognize himself in your code.",
        nextNodeId: 'devon_hub_return',
        pattern: 'helping',
        skills: ['wisdom']
      }
    ],
    tags: ['devon_arc', 'mentors', 'father']
  },

  {
    nodeId: 'devon_identity',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Who am I if I'm not optimizing something?\n\nI've been the \"systems guy\" since I was twelve. The one who fixes things. Organizes things. Makes things work.\n\nWhat happens if I just... stop? Be present without purpose. Exist without producing.\n\nIt terrifies me. The idea of being valuable just because I exist, not because I'm useful.\n\nThat's probably something I should work on, huh?",
        emotion: 'vulnerable_self_awareness',
        variation_id: 'identity_v1'
      }
    ],
    requiredState: {
      trust: { min: 6 }
    },
    choices: [
      {
        choiceId: 'identity_respond',
        text: "Your dad loved you before you could optimize anything. That hasn't changed.",
        nextNodeId: 'devon_hub_return',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      }
    ],
    tags: ['devon_arc', 'vulnerability', 'identity']
  },

  {
    nodeId: 'devon_hope',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You know what? I'm going to call him.\n\nNot with the flowchart. Not with a script. Just... call.\n\n\"Hey Dad. I miss you. I miss Mom. I'm scared I'm losing you too.\"\n\nNo system. No optimization. Just the truth.\n\nTerrifying. But maybe that's the whole point. Love isn't supposed to be efficient.",
        emotion: 'resolved_scared',
        variation_id: 'hope_v1'
      }
    ],
    requiredState: {
      trust: { min: 7 }
    },
    choices: [
      {
        choiceId: 'hope_encourage',
        text: "That's the most beautiful system you could build. Truth without optimization.",
        nextNodeId: 'devon_crossroads',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'wisdom'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      }
    ],
    tags: ['devon_arc', 'hope', 'breakthrough']
  },

  // ============= ADDITIONAL DEPTH =============
  {
    nodeId: 'devon_college_choice',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Georgia Tech. 500 miles from home. Everyone asked why I didn't stay closer.\n\nI told them it was the program. The rankings. The opportunities.\n\nTruth? I was running. Every time I saw Mom, I saw what we were losing. Every conversation reminded me time was finite.\n\nI thought distance would hurt less than watching. Turns out distance has its own kind of pain.",
        emotion: 'regret_honesty',
        variation_id: 'college_choice_v1'
      }
    ],
    requiredState: {
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'college_understand',
        text: "Running isn't the same as not caring. Sometimes we run because we care too much.",
        nextNodeId: 'devon_hub_return',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    tags: ['devon_arc', 'college', 'running']
  },

  {
    nodeId: 'devon_first_debug',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "My first real debug. I was ten.\n\nDad's truck wouldn't start. He'd been under the hood for hours, frustrated. Mom was worried. She had a doctor's appointment.\n\nI sat in the driver's seat, turned the key when he said, and watched the dashboard. Noticed something. A pattern.\n\n\"Dad, the battery light flickers before it dies. Maybe there's a loose connection?\"\n\nHe found the corroded terminal in five minutes. Looked at me like I was magic.\n\nFirst time I understood: watching systems carefully shows you what's wrong. First time I felt... useful.",
        emotion: 'nostalgic_pride',
        variation_id: 'first_debug_v1'
      }
    ],
    choices: [
      {
        choiceId: 'first_debug_respond',
        text: "You were helping him debug before you knew the word for it.",
        nextNodeId: 'devon_hub_return',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    tags: ['devon_arc', 'origin', 'dad']
  },

  {
    nodeId: 'devon_mom_final_words',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Last coherent thing Mom ever said to me. Three days before the end.\n\nShe grabbed my hand, stronger than she'd been in weeks, and said:\n\n\"Devon. Stop trying to fix everything. Some things just need to be felt.\"\n\nI didn't understand then. I thought she was giving up. Now I realize she was giving me permission.\n\nPermission to not be useful. To just... be present. To let things be broken and love them anyway.",
        emotion: 'grief_clarity',
        variation_id: 'mom_final_v1'
      }
    ],
    requiredState: {
      trust: { min: 7 }
    },
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['devon_mom_final_words_revealed']
      }
    ],
    choices: [
      {
        choiceId: 'mom_words_honor',
        text: "She saw exactly what you needed to hear. Even at the end, she was helping you.",
        nextNodeId: 'devon_hub_return',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'wisdom'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      }
    ],
    tags: ['devon_arc', 'vulnerability', 'mom', 'breakthrough']
  },

  {
    nodeId: 'devon_coding_escape',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You want to know why I code at 2am? Why I take every side project?\n\nBecause code makes sense. Variables don't have feelings. Functions don't die. Errors have solutions.\n\nReal life doesn't work that way. Real life is messy and unpredictable and people leave and nothing you build can stop it.\n\nSo I hide in logic. Build systems where I'm in control. Pretend that making something perfect somewhere makes up for the chaos everywhere else.\n\nIt doesn't. But it's easier than facing what I'm avoiding.",
        emotion: 'raw_honesty',
        variation_id: 'coding_escape_v1'
      }
    ],
    requiredState: {
      trust: { min: 6 }
    },
    choices: [
      {
        choiceId: 'escape_acknowledge',
        text: "Knowing why you escape is the first step to coming back.",
        nextNodeId: 'devon_hub_return',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    tags: ['devon_arc', 'vulnerability', 'avoidance']
  },

  {
    nodeId: 'devon_birmingham_future_roots',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Everyone at Tech talks about Silicon Valley. Seattle. New York. The big moves.\n\nBut Birmingham... it's changing. Medical research is booming. UAB is doing incredible work. Tech companies are actually looking here.\n\nAnd Dad's here. Still in the house I grew up in. Still working on cars.\n\nWhat if the best opportunity isn't somewhere else? What if it's building something where it matters most? Close to home. Close to him.",
        emotion: 'hopeful_uncertain',
        variation_id: 'birmingham_future_v1'
      }
    ],
    choices: [
      {
        choiceId: 'birmingham_support',
        text: "Sometimes the most courageous move is staying. Building where your roots are.",
        nextNodeId: 'devon_hub_return',
        pattern: 'building',
        skills: ['wisdom'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    tags: ['devon_arc', 'birmingham', 'future', 'dad']
  },

  {
    nodeId: 'devon_uncertainty',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You know what nobody tells you about systems engineering?\n\nThere's always another layer. Always something you don't understand. The more you learn, the more you realize how much you don't know.\n\nI present this confident face. \"Devon knows systems.\" But half the time I'm terrified someone will ask a question I can't answer.\n\nImposter syndrome doesn't go away. You just get better at hiding it.",
        emotion: 'vulnerable_confession',
        variation_id: 'uncertainty_v1'
      }
    ],
    requiredState: {
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'uncertainty_normalize',
        text: "The smartest people I know are the ones who admit what they don't know.",
        nextNodeId: 'devon_hub_return',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    tags: ['devon_arc', 'vulnerability', 'imposter']
  },

  {
    nodeId: 'devon_small_joys',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Mom taught me something I keep forgetting.\n\nShe'd stop mid-sentence sometimes. Point out a bird. A flower. The way light hit the window.\n\n\"Devon, look. Isn't that beautiful?\"\n\nI'd nod and get back to whatever I was doing. Optimizing. Always optimizing.\n\nNow I try to notice. The morning coffee. The way code compiles. A conversation that goes nowhere but feels good.\n\nSmall joys. Non-optimized moments. She was teaching me all along. I'm just now learning to listen.",
        emotion: 'bittersweet_growth',
        variation_id: 'small_joys_v1'
      }
    ],
    choices: [
      {
        choiceId: 'small_joys_celebrate',
        text: "That's a kind of pattern too. Recognizing beauty without trying to optimize it.",
        nextNodeId: 'devon_hub_return',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    tags: ['devon_arc', 'mom', 'growth', 'mindfulness']
  },

  {
    nodeId: 'devon_dad_birthday',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Dad's birthday is next month. First one since Mom.\n\nLast year, she organized everything. The cake he pretends not to want. The dinner with his old mechanic buddies. The card where she wrote things I should have said.\n\nThis year... I don't know what to do. Part of me wants to recreate it. Make sure he doesn't feel the absence.\n\nBut maybe that's wrong. Maybe trying to fill her space makes it worse.\n\nWhat do you do for someone's first birthday alone?",
        emotion: 'uncertain_grief',
        variation_id: 'dad_birthday_v1'
      }
    ],
    requiredState: {
      trust: { min: 6 }
    },
    choices: [
      {
        choiceId: 'birthday_presence',
        text: "Maybe just being there is enough. Not filling her space. Just filling yours.",
        nextNodeId: 'devon_hub_return',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'wisdom'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      }
    ],
    tags: ['devon_arc', 'dad', 'grief', 'birthday']
  },

  {
    nodeId: 'devon_future_vision',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "You know what I keep imagining?\n\nFive years from now. Working at UAB's research hospital. Building systems that actually help people. Not just optimize profits.\n\nComing home to Birmingham. Having dinner with Dad. Not because I'm trying to fix anything. Just because I want to.\n\nMaybe the Conversation Optimizer becomes a joke between us. \"Remember when you tried to script our relationship?\" And we laugh. Because we figured out something better.\n\nThat's the future I want to build. Not optimal. Just... real.",
        emotion: 'hopeful',
        variation_id: 'future_vision_v1'
      }
    ],
    requiredState: {
      trust: { min: 7 }
    },
    choices: [
      {
        choiceId: 'future_encourage',
        text: "That's a vision worth working toward. And you've already started.",
        nextNodeId: 'devon_hub_return',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      }
    ],
    tags: ['devon_arc', 'future', 'hope', 'growth']
  },

  {
    nodeId: 'devon_gratitude',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Hey. I don't say this enough. To anyone.\n\nThank you.\n\nNot for fixing anything. Not for optimizing my situation. Just for... listening. Being here while I figured things out loud.\n\nThat's what I was missing with Dad. Not solutions. Presence.\n\nYou taught me something just now. By doing nothing except paying attention.\n\nMaybe that's what I needed all along.",
        emotion: 'grateful',
        variation_id: 'gratitude_v1'
      }
    ],
    requiredState: {
      trust: { min: 6 }
    },
    choices: [
      {
        choiceId: 'gratitude_return',
        text: "You taught me something too. About the courage it takes to show up imperfectly.",
        nextNodeId: 'devon_crossroads',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      }
    ],
    tags: ['devon_arc', 'gratitude', 'connection', 'breakthrough']
  },

  // ============= ARC 4: CAREER CROSSROADS =============
  {
    nodeId: 'devon_probability_map',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Jordan calls this the 'Scary Map.' It's a probability tree of her career paths.\n\nSee this branch? Staying in architecture school. Probability dropping to zero. This one? The personal training gig. Had a 40% chance of leading to physical therapy school, but she branched here instead.\n\nPeople think choices are forks in the road. They're not. They're fluid dynamics. You don't take a path. You flow into the one of least resistance... unless you build a dam.",
        emotion: 'focused',
        variation_id: 'arc4_prob_map_v1'
      }
    ],
    choices: [
      {
        choiceId: 'prob_map_agency',
        text: "Building a dam takes effort. Most people just float.",
        nextNodeId: 'devon_career_crossroads',
        pattern: 'building',
        skills: ['systemsThinking'],
        consequence: {
          addGlobalFlags: ['devon_explained_probability']
        }
      },
      {
        choiceId: 'prob_map_beauty',
        text: "It's beautiful. Like a river system.",
        nextNodeId: 'devon_career_crossroads',
        pattern: 'exploring',
        skills: ['creativity']
      }
    ],
    tags: ['arc_career_crossroads']
  },

  {
    nodeId: 'devon_career_crossroads',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "The probability model for my career is robust. It's safe.\n\nBut the probability model for my happiness? It's throwing errors.\n\nI can stay here, build something real, and risk it failing. Or I can go to Silicon Valley, make millions, and always wonder what I left behind.\n\nDebug that for me.",
        emotion: 'conflicted',
        variation_id: 'arc4_crossroads_v1'
      }
    ],
    choices: [
      {
        choiceId: 'crossroads_stay',
        text: "The hardest bugs are the ones you can't reproduce. If you leave, you can never reproduce what you have here.",
        nextNodeId: 'devon_hub_return', // Leads to acceptance
        pattern: 'building',
        skills: ['wisdom'],
        consequence: {
          characterId: 'devon',
          trustChange: 3,
          addGlobalFlags: ['devon_chose_stay']
        }
      },
      {
        choiceId: 'crossroads_go',
        text: "Sometimes you have to leave the system to understand it.",
        nextNodeId: 'devon_hub_return',
        pattern: 'exploring',
        skills: ['systemsThinking']
      }
    ],
    tags: ['arc_career_crossroads', 'turning_point']
  },

  {
    nodeId: 'devon_birmingham_reward',
    speaker: 'Devon Kumar',
    content: [{
      text: "You're right. Birmingham isn't just a location. It's a forge. This station... it's powered by that energy. The urge to make something new from what's broken.",
      emotion: 'inspired',
      variation_id: 'puzzle_bham_v1'
    }],
    choices: [{ choiceId: 'bham_ack', text: "It's a good place to build.", nextNodeId: 'devon_hub_return' }],
    tags: ['puzzle_reward', 'legendary_info']
  },

  {
    nodeId: 'devon_patterns_reward',
    speaker: 'Devon Kumar',
    content: [{
      text: "The Healer, The Builder, The Navigator...\n\nYou found the source code. We're not just people. We're functions. As long as the city has these needs, the station summons us to fill them.",
      emotion: 'analytical_awe',
      variation_id: 'puzzle_patterns_v1'
    }],
    choices: [{ choiceId: 'patterns_ack', text: "We all play our part.", nextNodeId: 'devon_hub_return' }],
    tags: ['puzzle_reward', 'legendary_info']
  },
  // ═══════════════════════════════════════════════════════════════
  // MYSTERY BREADCRUMBS
  // ═══════════════════════════════════════════════════════════════
  {
    nodeId: 'devon_mystery_hint_1',
    speaker: 'Devon Kumar',
    requiredState: {
      trust: { min: 5 }
    },
    content: [
      {
        text: "I optimized the passenger flow algorithms yesterday. Perfect efficiency. But the passengers didn't follow the lines.\n\nThey stood in pools of light. They walked in spirals. They moved like... like water.\n\nMy algorithm assumed people want to get somewhere. But nobody here is trying to leave. They're waiting. For what?",
        emotion: 'mysterious',
        variation_id: 'mystery_hint_1_v1'
      }
    ],
    choices: [
      {
        choiceId: 'devon_mystery_ask',
        text: "What do you think they're waiting for?",
        nextNodeId: 'devon_mystery_response_1',
        pattern: 'helping',
        skills: ['curiosity']
      },
      {
        choiceId: 'devon_mystery_accept',
        text: "Maybe waiting is the point.",
        nextNodeId: 'devon_hub_return',
        pattern: 'patience'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },
  {
    nodeId: 'devon_mystery_response_1',
    speaker: 'Devon Kumar',
    content: [
      {
        text: "Permission. To change.\n\nThe station feels like a holding pattern. A waiting room for the soul. I can't optimize a waiting room if I don't know when the doctor is coming.\n\nOr if there IS a doctor.",
        emotion: 'wondering',
        variation_id: 'mystery_response_1_v1'
      }
    ],
    onEnter: [
      {
        characterId: 'devon',
        addKnowledgeFlags: ['devon_mystery_noticed']
      }
    ],
    choices: [
      {
        choiceId: 'devon_mystery_return',
        text: "We'll figure it out.",
        nextNodeId: 'devon_hub_return',
        pattern: 'helping'
      }
    ]
  },
  {
    nodeId: 'devon_hub_return',
    speaker: 'Devon Kumar',
    content: [{
      text: "I'm going to watch the traffic patterns a bit longer. See if I can decode the spiral.",
      emotion: 'thoughtful',
      variation_id: 'hub_return_v1'
    }],
    choices: [],
    tags: ['terminal']
  },

  // ============= PHASE 1 SIMULATION: SYSTEM DEBUGGER (Trust ≥ 2) =============
  {
    nodeId: 'devon_simulation_phase1_setup',
    speaker: 'Devon Kumar',
    content: [{
      text: "Okay. You want to see how I think?\n\nThere's a ventilation controller down in sub-level 3. It's been cycling on and off every 47 seconds for the past two days. Nobody's touched it. The logs show normal operation.\n\nBut it's fighting itself. Just like...\n\n...doesn't matter. You want to debug it with me?",
      emotion: 'focused_curious',
      variation_id: 'simulation_intro_v1'
    }],
    requiredState: {
      trust: { min: 2 }
    },
    choices: [
      {
        choiceId: 'phase1_accept',
        text: "Let's debug it together.",
        nextNodeId: 'devon_simulation_phase1',
        pattern: 'analytical',
        skills: ['problemSolving']
      },
      {
        choiceId: 'phase1_decline',
        text: "Maybe another time.",
        nextNodeId: 'devon_crossroads',
        pattern: 'patience'
      }
    ],
    tags: ['simulation', 'devon_arc']
  },

  {
    nodeId: 'devon_simulation_phase1',
    speaker: 'Devon Kumar',
    content: [{
      text: "Here's the control system. Find the bug.",
      emotion: 'focused',
      variation_id: 'simulation_phase1_v1'
    }],
    simulation: {
      type: 'terminal_coding',
      title: 'Ventilation Control Debug',
      taskDescription: 'The HVAC controller is cycling on/off every 47 seconds. The sensor readings are normal, but the system is unstable. Identify the root cause.',
      phase: 1,
      difficulty: 'introduction',
      variantId: 'devon_hvac_debug_phase1',
      initialContext: {
        label: 'HVAC_Controller_v4.2',
        content: `SENSOR: Temperature = 21.5°C (target: 21.0°C)
ACTUATOR: Fan = ON (cycling every 47s)
ERROR LOG: None

Control Logic:
if (temp > target + 0.5):
    fan = ON
if (temp < target - 0.5):
    fan = OFF

Problem: System oscillating instead of stabilizing
Hint: Check the hysteresis logic`,
        displayStyle: 'code'
      },
      successFeedback: '✓ BUG FOUND: Hysteresis threshold too wide (±0.5°C). System overshoots and oscillates. Solution: Narrow band to ±0.2°C.',
      successThreshold: 75,
      unlockRequirements: {
        trustMin: 2
      }
    },
    choices: [
      {
        choiceId: 'phase1_success',
        text: "That was elegant. Simple fix.",
        nextNodeId: 'devon_simulation_phase1_success',
        pattern: 'analytical',
        skills: ['problemSolving']
      }
    ],
    onEnter: [{
      characterId: 'devon',
      addKnowledgeFlags: ['devon_simulation_phase1_complete']
    }],
    tags: ['simulation', 'phase1']
  },

  {
    nodeId: 'devon_simulation_phase1_success',
    speaker: 'Devon Kumar',
    content: [{
      text: "You see it too. The system was fighting itself because the tolerances were too wide.\n\nMost people would've just replaced the whole controller. But you debugged it. Found the root cause.\n\nThat's... that's how I think. Everything's a system. Everything has logic.",
      emotion: 'seen_warm',
      variation_id: 'phase1_success_v1'
    }],
    choices: [
      {
        choiceId: 'phase1_success_continue',
        text: "Systems thinking is powerful.",
        nextNodeId: 'devon_crossroads',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      }
    ],
    tags: ['simulation', 'success']
  },

  {
    nodeId: 'devon_simulation_phase1_fail',
    speaker: 'Devon Kumar',
    content: [{
      text: "That's... not it. The system's still cycling.\n\nIt's okay. Debugging takes practice. Most people don't even try to understand the logic.\n\nMaybe we'll take another crack at it later.",
      emotion: 'patient_disappointed',
      variation_id: 'phase1_fail_v1'
    }],
    choices: [
      {
        choiceId: 'phase1_fail_continue',
        text: "I'll learn from this.",
        nextNodeId: 'devon_crossroads',
        pattern: 'patience',
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'fail']
  },

  // ============= PHASE 2 SIMULATION: ARCHITECTURE UNDER CONSTRAINTS (Trust ≥ 5) =============
  {
    nodeId: 'devon_simulation_phase2_setup',
    speaker: 'Devon Kumar',
    content: [{
      text: "I've been thinking about redundancy. The station's life support has a single point of failure in the oxygen recycler.\n\nIf it goes down, we have 6 hours of reserve air. That's it.\n\nI've been designing a backup system, but... I can't get the constraints to balance. Power budget is maxed. Space is limited. Cost matters.\n\nWant to see if you can architect something I missed?",
      emotion: 'focused_vulnerable',
      variation_id: 'simulation_phase2_intro_v1'
    }],
    requiredState: {
      trust: { min: 5 },
      hasKnowledgeFlags: ['devon_simulation_phase1_complete']
    },
    choices: [
      {
        choiceId: 'phase2_accept',
        text: "Let's design it together.",
        nextNodeId: 'devon_simulation_phase2',
        pattern: 'building',
        skills: ['systemsThinking']
      },
      {
        choiceId: 'phase2_decline',
        text: "This feels important. Are you sure you want my input?",
        nextNodeId: 'devon_crossroads',
        pattern: 'helping',
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'devon_arc']
  },

  {
    nodeId: 'devon_simulation_phase2',
    speaker: 'Devon Kumar',
    content: [{
      text: "Here are the constraints. Design a backup oxygen system that fits within them.",
      emotion: 'focused',
      variation_id: 'simulation_phase2_v1'
    }],
    simulation: {
      type: 'system_architecture',
      title: 'Redundant Life Support Design',
      taskDescription: 'Design a backup oxygen recycling system under strict constraints: 500W power budget, 2m³ space, 48-hour oxygen reserve minimum.',
      phase: 2,
      difficulty: 'application',
      variantId: 'devon_life_support_phase2',
      timeLimit: 120,
      initialContext: {
        label: 'SYSTEM_CONSTRAINTS',
        content: `REQUIREMENTS:
- Backup O2 capacity: 48 hours minimum
- Power budget: 500W max
- Physical space: 2m³ max
- Cost: $50k max

DESIGN OPTIONS:
A) Chemical O2 generators (250W, 1m³, $30k, 72hr capacity)
B) Compressed O2 tanks (0W, 3m³, $20k, 96hr capacity)
C) Electrolysis backup (450W, 1.5m³, $45k, infinite if water available)
D) Hybrid: Tanks + Electrolysis (450W, 2.5m³, $65k, 120hr)

TRADE-OFFS: Power vs Space vs Cost vs Reliability

Which architecture balances the constraints?`,
        displayStyle: 'code'
      },
      successFeedback: '✓ OPTIMAL DESIGN: Option A (Chemical) meets all constraints with 50% power headroom. Cost-effective, fits space, exceeds minimum capacity.',
      successThreshold: 85,
      unlockRequirements: {
        trustMin: 5,
        previousPhaseCompleted: 'devon_hvac_debug_phase1'
      }
    },
    choices: [
      {
        choiceId: 'phase2_success',
        text: "Chemical generators. Elegant compromise.",
        nextNodeId: 'devon_simulation_phase2_success',
        pattern: 'analytical',
        skills: ['systemsThinking', 'problemSolving']
      }
    ],
    onEnter: [{
      characterId: 'devon',
      addKnowledgeFlags: ['devon_simulation_phase2_complete']
    }],
    tags: ['simulation', 'phase2']
  },

  {
    nodeId: 'devon_simulation_phase2_success',
    speaker: 'Devon Kumar',
    content: [{
      text: "You balanced it. Power, space, cost, reliability.\n\nMost engineers optimize for one thing and ignore the rest. But you saw the whole system. The constraints aren't enemies - they're design parameters.\n\nThat's... that's how you build things that last.\n\nMaybe that applies to more than just engineering.",
      emotion: 'awed_thoughtful',
      variation_id: 'phase2_success_v1',
      richEffectContext: 'warning'
    }],
    choices: [
      {
        choiceId: 'phase2_success_continue',
        text: "Constraints force creativity.",
        nextNodeId: 'devon_crossroads',
        pattern: 'building',
        skills: ['creativity'],
        consequence: {
          characterId: 'devon',
          trustChange: 2
        }
      }
    ],
    tags: ['simulation', 'success']
  },

  {
    nodeId: 'devon_simulation_phase2_fail',
    speaker: 'Devon Kumar',
    content: [{
      text: "That design... it violates the power budget. Or the space constraint. One of them.\n\nIt's harder than it looks, right? Optimizing for everything at once.\n\nI've been stuck on this for weeks. Maybe there isn't a perfect solution.",
      emotion: 'frustrated_tired',
      variation_id: 'phase2_fail_v1'
    }],
    choices: [
      {
        choiceId: 'phase2_fail_continue',
        text: "Sometimes there are only trade-offs, not solutions.",
        nextNodeId: 'devon_crossroads',
        pattern: 'patience',
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'fail']
  },

  // ============= PHASE 3 SIMULATION: HUMAN SYSTEM DESIGN (Trust ≥ 8, Post-Vulnerability) =============
  {
    nodeId: 'devon_simulation_phase3_setup',
    speaker: 'Devon Kumar',
    content: [{
      text: "I need your help with something.\n\nNot a technical system. A human one.\n\nMy dad. We haven't really talked since mom died. I keep trying to... debug the relationship. Fix the communication protocol. But every time I try to optimize for efficiency, I just make it worse.\n\nYou've seen how I think. Maybe... maybe you can help me design a better approach.\n\nNot a fix. Just... a framework.",
      emotion: 'vulnerable_hopeful',
      variation_id: 'simulation_phase3_intro_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 8 },
      hasGlobalFlags: ['devon_vulnerability_revealed'],
      hasKnowledgeFlags: ['devon_simulation_phase2_complete']
    },
    choices: [
      {
        choiceId: 'phase3_accept',
        text: "Let's design it together.",
        nextNodeId: 'devon_simulation_phase3',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'phase3_gentle',
        text: "This isn't a system to debug, Devon. It's a relationship to rebuild.",
        nextNodeId: 'devon_crossroads',
        pattern: 'patience',
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'devon_arc', 'emotional']
  },

  {
    nodeId: 'devon_simulation_phase3',
    speaker: 'Devon Kumar',
    content: [{
      text: "Here's what I know about him. Help me design a communication framework.",
      emotion: 'vulnerable_focused',
      variation_id: 'simulation_phase3_v1'
    }],
    simulation: {
      type: 'visual_canvas',
      title: 'Communication Framework Design',
      taskDescription: 'Design a communication approach for Devon to reconnect with his grieving father. Balance emotional safety, authenticity, and gradual trust-building.',
      phase: 3,
      difficulty: 'mastery',
      variantId: 'devon_human_system_phase3',
      timeLimit: 90,
      initialContext: {
        label: 'FATHER_PROFILE',
        content: `CONTEXT:
- Grieving wife of 35 years
- Emotionally guarded (engineer, like Devon)
- Avoids direct emotional conversations
- Responds to: practical help, shared activities, silence

DEVON'S PAST ATTEMPTS (all failed):
1. "We should process this together" → Shutdown
2. "Let's establish regular check-ins" → Avoidance
3. "I made you a grief support workflow" → Anger

DESIGN PARAMETERS:
- Safety: No forced emotional vulnerability
- Authenticity: Can't be purely transactional
- Sustainability: Must work long-term, not just once
- Respect: Honors his grieving process

What communication approach balances these?`,
        displayStyle: 'text'
      },
      successFeedback: '✓ FRAMEWORK: Start with shared repair work (garage project). Let conversations emerge naturally. Silence is data, not failure. Emotional connection is the output, not the input.',
      successThreshold: 95,
      unlockRequirements: {
        trustMin: 8,
        previousPhaseCompleted: 'devon_life_support_phase2',
        requiredFlags: ['devon_vulnerability_revealed']
      }
    },
    choices: [
      {
        choiceId: 'phase3_success',
        text: "It's not about optimizing. It's about being present.",
        nextNodeId: 'devon_simulation_phase3_success',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      }
    ],
    onEnter: [{
      characterId: 'devon',
      addKnowledgeFlags: ['devon_simulation_phase3_complete']
    }],
    tags: ['simulation', 'phase3', 'mastery']
  },

  {
    nodeId: 'devon_simulation_phase3_success',
    speaker: 'Devon Kumar',
    content: [{
      text: "You're right.\n\nI've been trying to debug grief like it's a system error. But it's not broken. It's... human.\n\nShared work. Silence as data. Emotional connection as the output, not the input.\n\nThat's not a fix. It's a framework for being present.\n\nI think... I think I can do that.\n\nThank you. For seeing the system I couldn't see. The one that includes hearts, not just logic.",
      emotion: 'grateful_transformed',
      variation_id: 'phase3_success_v1',
      richEffectContext: 'success',
      patternReflection: [
        {
          pattern: 'analytical',
          minLevel: 5,
          altText: "You helped me see the analysis I was missing.\n\nI've been debugging grief like it's a system error. But you showed me the variables I excluded—hearts, presence, silence as meaningful data.\n\nShared work. Emotional connection as output. That's a complete system model.\n\nThank you. For showing me that analytical thinking works when it includes all the variables—even the human ones.",
          altEmotion: 'analytical_gratitude'
        },
        {
          pattern: 'patience',
          minLevel: 5,
          altText: "You've been so patient with me. While I tried to rush through grief.\n\nShared work. Silence that doesn't need filling. Emotional connection that takes time.\n\nThat's not a fix. It's patience as a framework for being present.\n\nThank you. For showing me that some systems can't be optimized—they need time to unfold.",
          altEmotion: 'patient_gratitude'
        },
        {
          pattern: 'exploring',
          minLevel: 5,
          altText: "You helped me explore territory I was avoiding.\n\nI've been trying to debug grief. But you showed me unexplored paths—shared work, meaningful silence, emotional connection.\n\nThat's not fixing. It's discovering a framework for presence.\n\nThank you. For helping me explore the system I couldn't map—the one that includes hearts alongside logic.",
          altEmotion: 'explorer_gratitude'
        },
        {
          pattern: 'helping',
          minLevel: 5,
          altText: "You helped me when I couldn't help my dad.\n\nShared work. Silence as presence. Emotional connection—not as input to optimize, but as the meaningful output.\n\nThat's not fixing him. It's being there for him.\n\nThank you. For showing me that helping sometimes means presence, not solutions.",
          altEmotion: 'helping_gratitude'
        },
        {
          pattern: 'building',
          minLevel: 5,
          altText: "You helped me build what I thought was broken.\n\nI've been trying to debug grief. But you showed me how to build connection—shared work, meaningful silence, emotional presence.\n\nThat's not a fix. It's a framework for constructing relationship.\n\nThank you. For showing me that building includes hearts, not just logic.",
          altEmotion: 'builder_gratitude'
        }
      ]
    }],
    choices: [
      {
        choiceId: 'phase3_success_continue',
        text: "You were always capable of this. You just needed a new framework.",
        nextNodeId: 'devon_crossroads',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 3,
          addGlobalFlags: ['devon_human_systems_mastery']
        }
      }
    ],
    tags: ['simulation', 'success', 'transformation']
  },

  {
    nodeId: 'devon_simulation_phase3_fail',
    speaker: 'Devon Kumar',
    content: [{
      text: "That still feels like I'm trying to engineer the outcome. To optimize for a result.\n\nBut relationships aren't systems. They're... messier than that.\n\nI don't know if I can do this without turning it into another flowchart.",
      emotion: 'defeated_vulnerable',
      variation_id: 'phase3_fail_v1'
    }],
    choices: [
      {
        choiceId: 'phase3_fail_continue',
        text: "It's okay to not have the answer yet.",
        nextNodeId: 'devon_crossroads',
        pattern: 'patience',
        consequence: {
          characterId: 'devon',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'fail']
  },

  // ═══════════════════════════════════════════════════════════════
  // LOYALTY EXPERIENCE: The Outage (trust ≥ 8, post-vulnerability)
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'devon_loyalty_trigger',
    speaker: 'Devon Kumar',
    content: [{
      text: "I need your help. Right now.\n\n[His phone is buzzing nonstop. He looks exhausted.]\n\nStation's HVAC system just failed. Main controller's down. Backup didn't kick in. Temperature's rising in the server room—if it hits 85°F, we lose data infrastructure for the entire building.\n\nI've got 30 minutes before critical failure. Maybe less.\n\nI can fix this, but I need someone to help me triage. Make the calls I can't make while I'm elbow-deep in the control panel.\n\nCan you do that?",
      emotion: 'urgent_focused',
      variation_id: 'loyalty_trigger_v1'
    }],
    requiredState: {
      trust: { min: 8 },
      hasKnowledgeFlags: ['devon_vulnerability_revealed']
    },
    choices: [
      {
        choiceId: 'accept_loyalty',
        text: "Tell me what you need. I'm here.",
        nextNodeId: 'devon_loyalty_start',
        pattern: 'helping',
        skills: ['crisisManagement']
      },
      {
        choiceId: 'decline_loyalty',
        text: "This sounds serious. Maybe call building maintenance?",
        nextNodeId: 'devon_loyalty_declined',
        pattern: 'patience'
      }
    ],
    tags: ['loyalty_experience', 'the_outage']
  },

  {
    nodeId: 'devon_loyalty_declined',
    speaker: 'Devon Kumar',
    content: [{
      text: "[He nods, already moving.]\n\nYeah. You're right. I'll handle it.\n\n[He disappears into the mechanical room. You hear metal clanging, muttered calculations.]",
      emotion: 'focused',
      variation_id: 'loyalty_declined_v1'
    }],
    choices: [{
      choiceId: 'return_to_hub',
      text: "(Let him work)",
      nextNodeId: 'devon_hub_return',
      pattern: 'patience'
    }],
    tags: ['loyalty_declined']
  },

  {
    nodeId: 'devon_loyalty_start',
    speaker: 'Devon Kumar',
    content: [{
      text: "[He hands you his tablet. A system diagram glows—red zones spreading.]\n\n\"Main controller's fried. Lightning strike hit the transformer last night. Surge protection failed.\n\nI can reroute through the backup, but it'll take 20 minutes of manual rewiring. During that time, systems will be unstable.\n\nHere's what I need: Monitor these three subsystems. If any of them hit critical, you tell me IMMEDIATELY. I'll have to choose which one to prioritize.\n\nReady?\"",
      emotion: 'intense_focused',
      variation_id: 'loyalty_start_v1'
    }],
    onEnter: [
      { characterId: 'devon', addKnowledgeFlags: ['devon_loyalty_accepted'] }
    ],
    choices: [{
      choiceId: 'begin_triage',
      text: "[Nod] I'm watching the systems.",
      nextNodeId: 'devon_loyalty_crisis_1',
      pattern: 'analytical',
      skills: ['attentionToDetail']
    }],
    tags: ['loyalty_experience', 'the_outage', 'crisis_start']
  },

  {
    nodeId: 'devon_loyalty_crisis_1',
    speaker: 'Devon Kumar',
    content: [{
      text: "[He's inside the panel now. Sparks fly. His hands move fast—disconnecting, reconnecting, testing voltage.]\n\n[Your tablet beeps. WARNING: Server Room Temp 78°F. Rising 2° per minute.]\n\n[Another beep. WARNING: Emergency Lighting Circuit Unstable.]\n\n[A third beep. WARNING: Fire Suppression System Offline.]\n\n[Devon calls out, not looking up.]\n\n\"Which one first? I can only stabilize one at a time. What's the priority?\"",
      emotion: 'tense',
      variation_id: 'crisis_1_v1'
    }],
    choices: [
      {
        choiceId: 'prioritize_servers',
        text: "Server room. If we lose data, everything else is meaningless.",
        nextNodeId: 'devon_loyalty_servers_first',
        pattern: 'analytical',
        skills: ['criticalThinking', 'triage']
      },
      {
        choiceId: 'prioritize_fire',
        text: "Fire suppression. If something catches, it's all over.",
        nextNodeId: 'devon_loyalty_fire_first',
        pattern: 'helping',
        skills: ['riskManagement']
      },
      {
        choiceId: 'freeze_indecision',
        text: "I... I don't know. You decide.",
        nextNodeId: 'devon_loyalty_freeze',
        pattern: 'patience'
      }
    ],
    tags: ['loyalty_experience', 'the_outage', 'crisis_triage']
  },

  {
    nodeId: 'devon_loyalty_servers_first',
    speaker: 'Devon Kumar',
    content: [{
      text: "[He nods sharply.]\n\n\"Servers. Got it.\"\n\n[Pulls a jumper cable, reroutes power. The server room temp stabilizes at 79°F.]\n\n\"Holding. Fire suppression still offline. Emergency lights flickering.\"\n\n[Ten minutes pass. He's soaked in sweat.]\n\n\"Backup controller's online. Routing primary systems now. We're... we're stable.\"\n\n[He emerges from the panel. Sits on the floor.]\n\n\"You made the right call. Servers first. Data is irreplaceable. Everything else we can fix later.\n\nYou didn't freeze. That's... that's the hardest part of crisis management. Making a choice when any choice could be wrong.\"",
      emotion: 'exhausted_grateful',
      variation_id: 'servers_first_v1',
      richEffectContext: 'success'
    }],
    choices: [{
      choiceId: 'servers_success',
      text: "You did the hard part. I just prioritized.",
      nextNodeId: 'devon_loyalty_success',
      pattern: 'helping',
      skills: ['humility']
    }],
    tags: ['loyalty_experience', 'the_outage', 'servers_priority']
  },

  {
    nodeId: 'devon_loyalty_fire_first',
    speaker: 'Devon Kumar',
    content: [{
      text: "[He hesitates for half a second.]\n\n\"Fire suppression. Okay.\"\n\n[Switches the priority. Fire suppression comes online. But the server room alarm screams—82°F.]\n\n\"Servers are critical. I have to switch now.\"\n\n[He works frantically. Gets the servers under control at 83°F—just before failure threshold.]\n\n[Fifteen minutes later, backup's online. He stumbles out, pale.]\n\n\"We made it. Barely. Fire suppression was the safer choice, but... servers were the critical path.\n\nI should have overruled you. But I didn't trust my own judgment in the moment.\n\nWe got lucky. Next time, we might not.\"",
      emotion: 'conflicted_exhausted',
      variation_id: 'fire_first_v1'
    }],
    choices: [{
      choiceId: 'fire_partial',
      text: "We both learned something. That counts.",
      nextNodeId: 'devon_loyalty_partial',
      pattern: 'patience',
      skills: ['resilience']
    }],
    tags: ['loyalty_experience', 'the_outage', 'fire_priority']
  },

  {
    nodeId: 'devon_loyalty_freeze',
    speaker: 'Devon Kumar',
    content: [{
      text: "[He looks up, frustrated.]\n\n\"I need you to DECIDE. I can't—\"\n\n[The tablet screams. Server room hits 81°F.]\n\n\"Damn it. Servers. Has to be servers.\"\n\n[He makes the call himself. Fixes it. But it's close—84°F before he stabilizes it.]\n\n[Later, he sits outside, not looking at you.]\n\n\"I asked you because I needed someone to make the hard calls while I was physically unable to. When you froze, I had to do both.\n\nIt worked out. This time.\n\nBut in crisis management, hesitation kills.\"",
      emotion: 'disappointed_tired',
      variation_id: 'freeze_v1'
    }],
    choices: [{
      choiceId: 'freeze_return',
      text: "I'm sorry. I wasn't ready.",
      nextNodeId: 'devon_hub_return',
      pattern: 'patience'
    }],
    onEnter: [{
      characterId: 'devon',
      addKnowledgeFlags: ['devon_loyalty_incomplete']
    }],
    tags: ['loyalty_experience', 'the_outage', 'freeze']
  },

  {
    nodeId: 'devon_loyalty_success',
    speaker: 'Devon Kumar',
    content: [{
      text: "[He looks at you seriously.]\n\n\"No. You don't understand.\n\nI've been managing systems for eight years. I've handled outages, failures, critical incidents. I'm good at this.\n\nBut I'm terrible at asking for help. At trusting someone else to make the call when I can't.\n\nToday, you proved I can. That I don't have to carry every system, every decision, alone.\n\nThat's worth more than fixing an HVAC controller.\n\nThank you. For not freezing. For making the hard choice. For being someone I can trust when systems fail.\"",
      emotion: 'vulnerable_grateful',
      variation_id: 'success_v1',
      richEffectContext: 'success'
    }],
    choices: [{
      choiceId: 'success_return',
      text: "Systems fail. People don't have to.",
      nextNodeId: 'devon_hub_return',
      pattern: 'helping',
      skills: ['emotionalIntelligence']
    }],
    onEnter: [
      {
        characterId: 'devon',
        trustChange: 3,
        addKnowledgeFlags: ['devon_loyalty_complete'],
        addGlobalFlags: ['devon_outage_mastery']
      }
    ],
    tags: ['loyalty_experience', 'the_outage', 'success']
  },

  {
    nodeId: 'devon_loyalty_partial',
    speaker: 'Devon Kumar',
    content: [{
      text: "[He nods slowly.]\n\n\"Yeah. We learned.\n\nYou learned that crisis decisions have stakes. I learned that I need to trust my own judgment even when someone else is helping.\n\nWe didn't fail. But we didn't excel either.\n\nNext crisis, we'll both be better.\"",
      emotion: 'reflective_tired',
      variation_id: 'partial_v1'
    }],
    choices: [{
      choiceId: 'partial_return',
      text: "Next time.",
      nextNodeId: 'devon_hub_return',
      pattern: 'patience'
    }],
    onEnter: [
      {
        characterId: 'devon',
        trustChange: 1,
        addKnowledgeFlags: ['devon_loyalty_partial']
      }
    ],
    tags: ['loyalty_experience', 'the_outage', 'partial']
  },

  // ============= TRUST RECOVERY SYSTEM =============
  {
    nodeId: 'devon_trust_recovery',
    speaker: 'Devon Kumar',
    content: [{
      text: "You came back. After... how things went last time.\n\nI pushed people away. It's what I do when systems feel unstable. Defensive subroutine.\n\nBut you didn't stay gone. That's... not in my decision tree.",
      emotion: 'guarded',
      variation_id: 'trust_recovery_v1',
      voiceVariations: {
        analytical: "You came back. I'm processing that.\n\nMy defensive routines pushed you away. Standard protocol when variables feel unstable.\n\nBut you're still here. That's unexpected data.",
        helping: "You came back. After how I acted.\n\nI push people away when things get complicated. Protective mechanism.\n\nBut you didn't give up on me. That's... rare.",
        building: "You came back. Even after I threw up walls.\n\nI build barriers when systems feel unstable. Defense architecture.\n\nBut you're still trying to connect. That matters.",
        exploring: "You came back. I didn't expect that.\n\nI shut down when things get uncertain. Avoid the unknown variable.\n\nBut you stayed curious. That's... interesting.",
        patience: "You came back. You waited.\n\nI push people away when I feel overwhelmed. Emergency shutdown.\n\nBut you didn't force it. You just... came back when I was ready."
      }
    }],
    requiredState: {
      trust: { max: 3 }
    },
    choices: [
      {
        choiceId: 'recovery_patience',
        text: "Systems need time to stabilize. So do people.",
        nextNodeId: 'devon_trust_restored',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 2,
          addKnowledgeFlags: ['devon_trust_repair_attempted']
        }
      },
      {
        choiceId: 'recovery_understand',
        text: "I get it. Defense mechanisms exist for a reason.",
        nextNodeId: 'devon_trust_restored',
        pattern: 'analytical',
        skills: ['emotionalIntelligence', 'systemsThinking'],
        consequence: {
          characterId: 'devon',
          trustChange: 2,
          addKnowledgeFlags: ['devon_trust_repair_attempted']
        }
      },
      {
        choiceId: 'recovery_honest',
        text: "I'm still here. That's what matters.",
        nextNodeId: 'devon_trust_restored',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'devon',
          trustChange: 2,
          addKnowledgeFlags: ['devon_trust_repair_attempted']
        }
      }
    ],
    tags: ['trust_recovery', 'devon_arc', 'repair']
  },

  {
    nodeId: 'devon_trust_restored',
    speaker: 'Devon Kumar',
    content: [{
      text: "Okay. Running a system restore.\n\nI'm not good at this. People. Connections. My brain wants to optimize everything, including relationships. That's not how it works.\n\nBut I'm learning. Maybe we can debug this together.",
      emotion: 'hopeful',
      variation_id: 'trust_restored_v1',
      voiceVariations: {
        analytical: "Okay. Initializing repair sequence.\n\nMy optimization algorithms don't work on relationships. I know that now.\n\nMaybe we can find a better approach. Together.",
        helping: "Okay. Starting over.\n\nYou didn't treat me like a broken system to fix. You just... stayed.\n\nThat's teaching me something about connection.",
        building: "Okay. Rebuilding.\n\nI tried to architect our interaction like a system. That was wrong.\n\nMaybe we build this differently. One conversation at a time.",
        exploring: "Okay. New iteration.\n\nI closed off when things got uncertain. But you stayed curious.\n\nMaybe that's the approach—exploring instead of solving.",
        patience: "Okay. Reset complete.\n\nYou gave me time. Didn't push. Didn't debug.\n\nThat's... that's what I needed. Thank you."
      }
    }],
    onEnter: [
      {
        characterId: 'devon',
        trustChange: 1,
        addKnowledgeFlags: ['devon_trust_repaired']
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_recovery',
        text: "Tell me about the system you're building.",
        nextNodeId: 'devon_explains_system',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'continue_from_recovery_dad',
        text: "How are things with your dad?",
        nextNodeId: 'devon_father_hint',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['trust_recovery', 'devon_arc', 'fresh_start']
  },

  // ===== SKILL COMBO UNLOCK NODE: Strategic Empathy =====
  // Requires: strategic_empathy combo (systemsThinking + emotionalIntelligence)
  {
    nodeId: 'devon_deep_insight',
    speaker: 'Devon Kumar',
    requiredState: {
      requiredCombos: ['strategic_empathy']
    },
    content: [{
      text: "You know what I've realized?\n\nSystems aren't cold. They're not just logic and efficiency. Every system has people in it, and those people have feelings, fears, dreams.\n\nWhen I started seeing systems through both lenses—the structural AND the emotional—everything changed.\n\nThe best systems don't optimize against human nature. They work with it.",
      emotion: 'insightful',
      variation_id: 'deep_insight_v1'
    }],
    choices: [
      {
        choiceId: 'insight_explore_more',
        text: "How did you learn to see both sides?",
        nextNodeId: 'devon_explains_system',
        pattern: 'exploring',
        skills: ['systemsThinking']
      },
      {
        choiceId: 'insight_apply',
        text: "I want to think about systems like that too.",
        nextNodeId: 'devon_hub_return',
        pattern: 'analytical',
        skills: ['systemsThinking', 'emotionalIntelligence']
      }
    ],
    tags: ['skill_combo_unlock', 'strategic_empathy', 'devon_wisdom']
  }
]

export const devonEntryPoints = {
  INTRODUCTION: 'devon_introduction',
  CROSSROADS: 'devon_crossroads'
} as const

export type DevonEntryPoint = typeof devonEntryPoints[keyof typeof devonEntryPoints]

const activeDevonDialogueNodes = filterDraftNodes('devon', devonDialogueNodes)

export const devonDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: buildDialogueNodesMap('devon', devonDialogueNodes),
  startNodeId: devonEntryPoints.INTRODUCTION,
  metadata: {
    title: "Devon's Journey",
    author: 'Guided Generation (Build-Time)',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: activeDevonDialogueNodes.length,
    totalChoices: activeDevonDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}
