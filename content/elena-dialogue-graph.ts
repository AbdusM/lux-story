/**
 * Elena's Dialogue Graph
 * The Pattern Researcher - Platform 4 (Data Science / Analytics)
 *
 * CHARACTER: The Pattern Seer
 * Core Theme: "The Pattern" - seeing connections others miss
 * Arc: From "Data Spiraling" to "Structured Clarity"
 * Vulnerability: The pattern she found that no one believed
 * Meta-layer: She studies behavioral patterns - including the player's
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'
import { buildDialogueNodesMap, filterDraftNodes } from './drafts/draft-filter'

const nodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'elena_intro',
    speaker: 'Elena',
    content: [{
      text: "Can you hear the hum? Not the station... the data. It's screaming.",
      emotion: 'anxious',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'what_data',
        text: 'What kind of data?',
        voiceVariations: {
          analytical: "What kind of data? What's the signal-to-noise ratio?",
          helping: "What kind of data? You seem overwhelmed.",
          building: "What kind of data? Maybe we can structure it.",
          exploring: "What kind of data? Show me.",
          patience: "What kind of data? Take me through it slowly."
        },
        nextNodeId: 'elena_overload',
        pattern: 'exploring',
        skills: ['observation']
      },
      {
        choiceId: 'calm_down',
        text: 'Focus, Elena. One stream at a time.',
        voiceVariations: {
          analytical: "Prioritize, Elena. What's the most significant anomaly?",
          helping: "Hey. I'm here. Let's take this together, one piece at a time.",
          building: "Let's organize this. One stream at a time.",
          exploring: "Slow down. What's the one thing you want me to see first?",
          patience: "Breathe. One stream at a time. I'm not going anywhere."
        },
        nextNodeId: 'elena_synthesis_lesson',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'elena_intro_pattern_unlock',
        text: "[Pattern Recognition] The hum isn't random. You've already found the pattern... you just haven't admitted it yet.",
        nextNodeId: 'elena_pattern_insight',
        pattern: 'analytical',
        skills: ['criticalThinking', 'observation'],
        visibleCondition: {
          patterns: { analytical: { min: 40 } }
        },
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      },
      {
        choiceId: 'elena_intro_patience_unlock',
        text: "[Deep Listening] The data isn't screaming. You are. What are you really afraid of finding?",
        nextNodeId: 'elena_fear_reveal',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'observation'],
        visibleCondition: {
          patterns: { patience: { min: 50 } }
        },
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ],
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['met_elena']
      }
    ]
  },

  // ============= PATTERN-UNLOCK NODES =============
  {
    nodeId: 'elena_pattern_insight',
    speaker: 'Elena',
    content: [{
      text: "How did you...\n\nThree weeks. I've been chasing fragments for three weeks. And you just... saw it.\n\nThe contradiction is here. Someone was in two places at once. Officially impossible. And I've been too scared to follow the thread because...\n\nBecause I think I know where it leads.",
      emotion: 'vulnerable',
      variation_id: 'elena_pattern_insight_v1'
    }],
    choices: [
      {
        choiceId: 'elena_pattern_follow',
        text: "Then let's follow it together.",
        nextNodeId: 'elena_overload',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving'],
        archetype: 'TAKE_ACTION',
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ],
    tags: ['elena_arc', 'pattern_unlock']
  },

  {
    nodeId: 'elena_fear_reveal',
    speaker: 'Elena',
    content: [{
      text: "...\n\nI'm afraid of being right.\n\nIf the contradiction is real... if someone manipulated the archives... then everything I've trusted about this station's history is compromised. Including my own appointment here.\n\nHow did you know to ask that?",
      emotion: 'raw',
      variation_id: 'elena_fear_reveal_v1'
    }],
    patternReflection: [
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: "...\n\nI'm afraid of being right.\n\nYou see patterns too. You understand - sometimes the data points to something you don't want to believe. If the contradiction is real... if someone manipulated the archives... everything I've trusted is compromised.\n\nYou knew to ask that. You think like I do.",
        altEmotion: 'vulnerable_understood'
      },
      {
        pattern: 'helping',
        minLevel: 5,
        altText: "...\n\nI'm afraid of being right.\n\nYou care about people, not just answers. That's why you asked. If the contradiction is real... if someone manipulated the archives... it means people were hurt. Lied to. Including me.\n\nHow did you know I needed someone to ask that?",
        altEmotion: 'vulnerable_grateful'
      },
      {
        pattern: 'patience',
        minLevel: 5,
        altText: "...\n\nI'm afraid of being right.\n\nYou waited for me to arrive there myself. Didn't rush. If the contradiction is real... if someone manipulated the archives... then everything I've built my career on is compromised.\n\nYou gave me time to see it. How did you know I needed that?",
        altEmotion: 'vulnerable_relieved'
      },
      {
        pattern: 'exploring',
        minLevel: 5,
        altText: "...\n\nI'm afraid of being right.\n\nYou're curious like me. You follow threads even when you're not sure where they lead. If the contradiction is real... if someone manipulated the archives... it opens questions I'm terrified to explore.\n\nYou saw it too. That's why you asked.",
        altEmotion: 'vulnerable_kindred'
      },
      {
        pattern: 'building',
        minLevel: 5,
        altText: "...\n\nI'm afraid of being right.\n\nYou understand foundations. What happens when you discover cracks. If the contradiction is real... if someone manipulated the archives... everything I've built here rests on compromised ground.\n\nHow did you know to check the foundation?",
        altEmotion: 'vulnerable_shaken'
      }
    ],
    choices: [
      {
        choiceId: 'elena_fear_response',
        text: "Sometimes the data we're most afraid of is the data we already know.",
        nextNodeId: 'elena_synthesis_lesson',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        archetype: 'SHARE_PERSPECTIVE',
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ],
    tags: ['elena_arc', 'pattern_unlock']
  },

  // ============= INITIAL BRANCH: DATA OVERLOAD =============
  {
    nodeId: 'elena_overload',
    speaker: 'Elena',
    content: [{
      text: "Everything. Supply chains, crew manifestos, external comms. There's a contradiction in the archives. A lie buried under three petabytes of noise.",
      emotion: 'paranoid',
      variation_id: 'default',
      interrupt: {
        duration: 3500,
        type: 'grounding',
        action: 'Gently close the holographic display',
        targetNodeId: 'elena_interrupt_grounding',
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    }],
    choices: [
      {
        choiceId: 'brute_force',
        text: 'We can read it all. If we split the workload...',
        nextNodeId: 'elena_fail_manual',
        pattern: 'building',
        skills: ['collaboration']
      },
      {
        choiceId: 'ai_research',
        text: 'We don\'t read it. We query it. Let me show you how to filter the noise.',
        nextNodeId: 'elena_handshake_ticker', // CHANGED: Points to handshake node
        pattern: 'analytical',
        skills: ['digitalLiteracy'],
        visibleCondition: {
          patterns: {
            analytical: { min: 1 }
          }
        }
      }
    ]
  },

  // ============= HANDSHAKE NODE: DATA TICKER =============
  {
    nodeId: 'elena_handshake_ticker',
    speaker: 'Elena', // She speaks while you work
    content: [{
      text: "You can filter it? The data streams are fluctuating wildly... can you stabilize the signal?",
      emotion: 'anxious',
      variation_id: 'handshake_intro',
      interaction: 'ripple'
    }],
    simulation: {
      type: 'data_ticker',
      mode: 'inline',
      title: 'Signal Stabilization Protocol',
      taskDescription: 'Stabilize 3 fluctuating data streams.',
      initialContext: {
        label: 'Signal Status',
        content: 'FLUCTUATING'
      },
      successFeedback: 'SIGNAL LOCKED. ANOMALY DETECTED.'
    },
    choices: [
      {
        choiceId: 'ticker_complete',
        text: 'Signal stabilized. Look at this anomaly.',
        nextNodeId: 'elena_simulation_perplexity', // Continue to original path
        pattern: 'analytical',
        voiceVariations: {
          analytical: "I've locked the signal. The anomaly is isolated.",
          building: "Stabilization complete. Now we can build a query."
        }
      }
    ]
  },

  // ============= INITIAL BRANCH: SYNTHESIS LESSON (PATIENCE PATH) =============
  {
    nodeId: 'elena_synthesis_lesson',
    speaker: 'Elena',
    content: [{
      text: "You're right. I get lost sometimes. The patterns pull me in and I forget to surface.\n\nOne stream at a time. Let me show you what I found.",
      emotion: 'calmer',
      variation_id: 'default',
      skillReflection: [
        { skill: 'informationLiteracy', minLevel: 5, altText: "You're right. You handle information well—I can tell by how you process what I'm saying.\n\nI get lost in the streams. But you... you filter naturally. One stream at a time.\n\nThat information literacy is exactly what this work needs. Let me show you what I found.", altEmotion: 'appreciative' },
        { skill: 'observation', minLevel: 5, altText: "You're right. You observe carefully—I've noticed how you take things in.\n\nI get lost in the patterns. The details pull me under. But you... you observed my struggle and named it.\n\nOne stream at a time. Thank you. Let me show you what I found.", altEmotion: 'grateful' }
      ],
      voiceVariations: {
        analytical: "You're right. I optimize for depth but lose sight of prioritization.\n\nOne stream at a time. Let me process this sequentially for you.",
        helping: "You're right. I get lost sometimes. Thank you for pulling me back.\n\nOne stream at a time. I appreciate you staying with me through this.",
        building: "You're right. I need better structural boundaries between streams.\n\nOne stream at a time. Let me construct this more clearly for you.",
        exploring: "You're right. I get lost exploring the connections and forget the destination.\n\nOne stream at a time. Let me map this out for you properly.",
        patience: "You're right. The patterns pull me in and I forget time exists.\n\nOne stream at a time. Thank you for giving me space to find my way back."
      },
      patternReflection: [
        { pattern: 'patience', minLevel: 4, altText: "You understand, don't you? That pull between diving deep and staying grounded. Not many people get that balance.\n\nOne stream at a time. Thank you.", altEmotion: 'grateful' },
        { pattern: 'analytical', minLevel: 4, altText: "You understand cognitive overload, don't you? Too many variables at once leads to processing failures.\n\nOne stream at a time. Let me sequence this properly for you.", altEmotion: 'appreciative' },
        { pattern: 'exploring', minLevel: 4, altText: "You understand the pull, don't you? Every thread leads to ten more. The curiosity is endless.\n\nBut you helped me surface. One stream at a time. Thank you.", altEmotion: 'grateful' },
        { pattern: 'helping', minLevel: 4, altText: "You understood what I needed before I said it. That's rare.\n\nOne stream at a time. You brought me back. Thank you.", altEmotion: 'touched' },
        { pattern: 'building', minLevel: 4, altText: "You see it, don't you? Too many streams means no solid foundation. Can't build on chaos.\n\nOne stream at a time. Let me structure this for you.", altEmotion: 'focused' }
      ]
    }],
    choices: [
      {
        choiceId: 'what_did_you_find',
        text: "Show me what you found.",
        voiceVariations: {
          analytical: "Walk me through the data. What did you find?",
          helping: "I'm listening. Show me what you found.",
          building: "Let's build the picture. Show me what you found.",
          exploring: "I'm curious. Show me what you found.",
          patience: "Whenever you're ready. Show me what you found."
        },
        nextNodeId: 'elena_first_pattern',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'how_do_you_see_patterns',
        text: "Before we dive in... how do you see patterns others miss?",
        nextNodeId: 'elena_methodology_intro',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  // ============= BRUTE FORCE FAIL =============
  {
    nodeId: 'elena_fail_manual',
    speaker: 'Elena',
    content: [{
      text: "Split the workload? There are 3.2 million documents. At one per minute, that's six years of reading. Non-stop.\n\nI tried that. For the first month. I read until my eyes bled. Literally.\n\nThere has to be a smarter way.",
      emotion: 'exhausted',
      variation_id: 'default',
      richEffectContext: 'warning'
    }],
    choices: [
      {
        choiceId: 'smarter_approach',
        text: "You're right. We query, not read. Show me the data.",
        nextNodeId: 'elena_simulation_perplexity',
        pattern: 'analytical',
        skills: ['adaptability']
      },
      {
        choiceId: 'why_obsessed',
        text: "Why does finding this matter so much to you?",
        nextNodeId: 'elena_why_it_matters',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  // ============= METHODOLOGY ARC =============
  {
    nodeId: 'elena_methodology_intro',
    speaker: 'Elena',
    content: [{
      text: "Most people ask what I found. You asked how I see.\n\nPatterns aren't in the data. They're in the spaces between. The things that should connect but don't. The correlations that are too perfect.\n\nI learned to trust absence as much as presence.",
      emotion: 'intrigued',
      variation_id: 'default',
      patternReflection: [
        { pattern: 'analytical', minLevel: 4, altText: "You see it too, don't you? The way questions about process reveal more than questions about results.\n\nPatterns aren't in the data. They're in the spaces between. You understand.", altEmotion: 'kindred' },
        { pattern: 'patience', minLevel: 4, altText: "You asked how I see, not what I found. Most people rush to conclusions.\n\nPatterns aren't in the data. They're in the spaces between. You gave me room to explain.", altEmotion: 'appreciative' },
        { pattern: 'exploring', minLevel: 4, altText: "You asked about the journey, not the destination. That's how explorers think.\n\nPatterns aren't in the data. They're in the spaces between. You already know that, don't you?", altEmotion: 'kindred' },
        { pattern: 'helping', minLevel: 4, altText: "You asked about my process. Most people just want the answer to use.\n\nYou wanted to understand. That tells me something about you.", altEmotion: 'grateful' },
        { pattern: 'building', minLevel: 4, altText: "You asked about architecture, not output. The way things connect matters more than what they contain.\n\nPatterns aren't in the data. They're in the structural gaps. You build things—you know this.", altEmotion: 'kindred' }
      ]
    }],
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['knows_elena_methodology']
      }
    ],
    choices: [
      {
        choiceId: 'explain_absence',
        text: "Trust absence? What does that mean?",
        nextNodeId: 'elena_methodology_absence',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'perfect_correlations',
        text: "Too-perfect correlations. You're looking for fabrication.",
        nextNodeId: 'elena_methodology_fabrication',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'elena_methodology_absence',
    speaker: 'Elena',
    content: [{
      text: "When you expect a connection and it's not there, that's data.\n\nThis maintenance log references a parts shipment. But the parts shipment doesn't reference this maintenance log. Someone edited one but not the other.\n\nMost analysts look for what's there. I look for what should be there but isn't. The dog that didn't bark.",
      emotion: 'teaching',
      variation_id: 'default',
      voiceVariations: {
        analytical: "When you expect a correlation and observe null, that's a data point.\n\nThis maintenance log references a parts shipment. The inverse reference doesn't exist. Asymmetric edits in a bidirectional system.\n\nMost analysts query for presence. I query for expected absence. The dog that didn't bark.",
        helping: "When you expect someone to respond and they don't, that tells you something.\n\nThis maintenance log references a parts shipment. But the shipment doesn't acknowledge this log. Someone cared about one side, not the other.\n\nMost people look for what's there. I look for what should be there if someone cared. The dog that didn't bark.",
        building: "When you expect a structural connection and find a gap, that's architectural failure.\n\nThis maintenance log references a parts shipment. But the shipment's records don't reference back. Someone built one link, not both.\n\nMost analysts build from what exists. I look for where the structure should connect but doesn't. The dog that didn't bark.",
        exploring: "When you expect a path and find empty space, that's a discovery.\n\nThis maintenance log references a parts shipment. But follow that shipment's trail - no reference back. Someone traveled one direction only.\n\nMost explorers map what's there. I map what should be there but isn't. The dog that didn't bark.",
        patience: "When you expect something and wait... and it never comes... that's information.\n\nThis maintenance log references a parts shipment. But wait for the shipment to reference back. It never does. Someone edited once, then stopped.\n\nMost people rush to find what's there. I wait for what should appear but doesn't. The dog that didn't bark."
      }
    }],
    choices: [
      {
        choiceId: 'dog_reference',
        text: "Sherlock Holmes. The curious incident.",
        nextNodeId: 'elena_methodology_deeper',
        pattern: 'analytical',
        skills: ['informationLiteracy'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      },
      {
        choiceId: 'how_learn_this',
        text: "How did you learn to see this way?",
        nextNodeId: 'elena_origin_story',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'elena_methodology_fabrication',
    speaker: 'Elena',
    content: [{
      text: "Exactly. Real data is messy. It has outliers, errors, human inconsistencies. When data is too clean, too consistent...\n\nThese timestamps are all exactly five minutes apart. No human works that precisely. But a script copying data would.\n\nSomeone manufactured this. The question is why.",
      emotion: 'impressed',
      variation_id: 'default',
      patternReflection: [
        { pattern: 'analytical', minLevel: 5, altText: "You think like a pattern researcher. Most people accept clean data as reliable. You see it as suspicious.\n\nThese timestamps are all exactly five minutes apart. Someone manufactured this. You already knew that, didn't you?", altEmotion: 'kindred_impressed' },
        { pattern: 'patience', minLevel: 5, altText: "You didn't rush to trust it. Most people see clean data and move on. You waited. Watched.\n\nTimestamps exactly five minutes apart. Too perfect. Someone manufactured this.", altEmotion: 'impressed' },
        { pattern: 'exploring', minLevel: 5, altText: "You looked deeper instead of accepting the surface. That's rare.\n\nTimestamps exactly five minutes apart. No human variation. You saw a trail where others saw a wall.", altEmotion: 'intrigued' },
        { pattern: 'helping', minLevel: 5, altText: "You see it because you care. Clean data means someone cleaned up after themselves. Covering tracks.\n\nTimestamps exactly five minutes apart. Someone hid something. And hiding things hurts people.", altEmotion: 'somber' },
        { pattern: 'building', minLevel: 5, altText: "You recognize construction when you see it. Real data grows. This data was built.\n\nTimestamps exactly five minutes apart. That's not organic. That's architecture. Someone blueprinted a lie.", altEmotion: 'kindred' }
      ]
    }],
    choices: [
      {
        choiceId: 'follow_the_pattern',
        text: "Follow the fabrication. Where does it lead?",
        nextNodeId: 'elena_first_pattern',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'who_taught_you',
        text: "Who taught you to see data this way?",
        nextNodeId: 'elena_origin_story',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'elena_methodology_deeper',
    speaker: 'Elena',
    content: [{
      text: "You read. Actually read. Not just scan for keywords.\n\nYes. The dog that didn't bark. That story changed how I see everything. Holmes noticed what everyone else ignored... the absence of evidence is itself evidence.\n\nData science isn't about finding needles in haystacks. It's about noticing when there should be a needle and there isn't.",
      emotion: 'warm',
      variation_id: 'default',
      voiceVariations: {
        analytical: "You processed the reference. Full semantic understanding, not pattern matching.\n\nYes. The dog that didn't bark. That story changed my analytical framework. Holmes observed what the data set excluded... null values are signals.\n\nData science isn't needle-in-haystack search. It's detecting when your search should return results and doesn't.",
        helping: "You actually listened to the story. You care about where ideas come from.\n\nYes. The dog that didn't bark. That story changed everything for me. Holmes noticed what everyone else missed... the silence that should have been sound.\n\nData science isn't about finding needles. It's about noticing when something that should help isn't there.",
        building: "You built the connection. Literary foundation supporting technical structure.\n\nYes. The dog that didn't bark. That story constructed my entire methodology. Holmes examined what the architecture lacked... missing components reveal intent.\n\nData science isn't finding needles in haystacks. It's blueprinting where needles should exist and finding gaps.",
        exploring: "You followed the reference. Curiosity beyond the immediate data.\n\nYes. The dog that didn't bark. That story opened new territory for me. Holmes discovered what the investigation space excluded... unmapped regions are findings.\n\nData science isn't searching haystacks for needles. It's exploring where needles should be and finding they're missing.",
        patience: "You took time with the reference. Waited for the context to matter.\n\nYes. The dog that didn't bark. That story changed how I see everything over years. Holmes waited for something... and noticed when it never came.\n\nData science isn't rushing through haystacks. It's patience to notice when something expected doesn't arrive."
      }
    }],
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['shared_literary_reference']
      }
    ],
    choices: [
      {
        choiceId: 'apply_method',
        text: "Let's apply that method. Show me what's missing.",
        nextNodeId: 'elena_first_pattern',
        pattern: 'analytical',
        skills: ['adaptability']
      },
      {
        choiceId: 'what_led_to_this',
        text: "What led you to pattern research?",
        nextNodeId: 'elena_origin_story',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ]
  },

  // ============= ORIGIN STORY ARC =============
  {
    nodeId: 'elena_origin_story',
    speaker: 'Elena',
    content: [{
      text: "I was fifteen. My older sister was dating someone our parents loved. Charming, successful, said all the right things.\n\nBut I noticed patterns. How he'd isolate her from friends. How his compliments were always slightly off. The micro-expressions when he thought no one was watching.\n\nNo one believed me. Not even my sister. Until it was too late.",
      emotion: 'haunted',
      variation_id: 'default',
      interrupt: {
        duration: 4000,
        type: 'silence',
        action: 'Let the weight of that sit. She needs a witness, not a fixer.',
        targetNodeId: 'elena_origin_interrupted',
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    }],
    choices: [
      {
        choiceId: 'what_happened',
        text: "What happened to your sister?",
        voiceVariations: {
          analytical: "What happened next? With your sister?",
          helping: "What happened to your sister? Only if you want to share.",
          building: "What happened after that? With your sister?",
          exploring: "What happened to your sister? If you're okay telling me.",
          patience: "Take your time. What happened to your sister?"
        },
        nextNodeId: 'elena_origin_deeper',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'you_saw_it',
        text: "You saw what they couldn't see. That's why you do this.",
        voiceVariations: {
          analytical: "You saw the pattern before anyone else. That's why you do this.",
          helping: "You saw what they couldn't see. You tried to protect her.",
          building: "You saw it and you acted. That's why you do this work.",
          exploring: "You saw what others missed. That's what drives you.",
          patience: "You saw it. They didn't. And now you carry that."
        },
        nextNodeId: 'elena_origin_acknowledged',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ],
    tags: ['backstory', 'elena_arc']
  },

  {
    nodeId: 'elena_origin_interrupted',
    speaker: 'Elena',
    content: [{
      text: "You didn't ask what happened. You didn't try to fix it.\n\nMost people immediately want the ending. The resolution. You just... stayed with it.\n\nThat's rare. That's pattern recognition of a different kind.",
      emotion: 'grateful_surprised',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'continue_when_ready',
        text: "Tell me more when you're ready.",
        nextNodeId: 'elena_origin_deeper',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['interrupt_target', 'elena_arc']
  },

  {
    nodeId: 'elena_origin_deeper',
    speaker: 'Elena',
    content: [{
      text: "She got out. Eventually. But not before...\n\nThe point is, I spent years afterward asking myself: what if I'd had proof? What if I could have shown them the patterns I saw?\n\nThat's when I discovered data science. A way to make invisible patterns visible. To show people what they're refusing to see.",
      emotion: 'resolved',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'noble_purpose',
        text: "That's a powerful reason to do this work.",
        nextNodeId: 'elena_first_pattern',
        pattern: 'helping',
        skills: ['communication']
      },
      {
        choiceId: 'but_people_still_dont_listen',
        text: "But people still don't always listen, do they?",
        nextNodeId: 'elena_not_listening',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'elena_origin_acknowledged',
    speaker: 'Elena',
    content: [{
      text: "Yes. That's exactly it.\n\nEveryone else sees events. I see the trajectory that led to them. The pattern that was always there, invisible until it exploded.\n\nThis work... it's not about data. It's about refusing to be gaslit by reality. About proving that what you saw was real, even when everyone says it wasn't.",
      emotion: 'understood',
      variation_id: 'default'
    }],
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['understands_elena_motivation']
      }
    ],
    choices: [
      {
        choiceId: 'show_current_pattern',
        text: "Show me the pattern you're chasing now.",
        nextNodeId: 'elena_first_pattern',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ]
  },

  {
    nodeId: 'elena_not_listening',
    speaker: 'Elena',
    content: [{
      text: "No. They don't.\n\nI've found three major discrepancies in the past year. Each one dismissed. 'Coincidence.' 'Data artifact.' 'You're seeing things that aren't there.'\n\nBut this one. This one I can prove. If I can just find the right angle...",
      emotion: 'frustrated_determined',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'help_prove_it',
        text: "Then let's prove it together.",
        nextNodeId: 'elena_first_pattern',
        pattern: 'helping',
        skills: ['collaboration']
      }
    ]
  },

  // ============= WHY IT MATTERS (EMOTIONAL CORE) =============
  {
    nodeId: 'elena_why_it_matters',
    speaker: 'Elena',
    content: [{
      text: "Because the last time I dismissed a pattern as noise... people died.\n\nStation Seven. Three years ago. I was the data analyst on duty. There was an anomaly in the life support logs. Three data points. I flagged it as 'sensor drift.' Standard procedure.\n\nIt wasn't drift.",
      emotion: 'haunted',
      variation_id: 'default',
      richEffectContext: 'warning'
    }],
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['knows_station_seven_surface']
      }
    ],
    choices: [
      {
        choiceId: 'what_happened_seven',
        text: "What happened?",
        nextNodeId: 'elena_station_seven_detail',
        pattern: 'exploring',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'not_your_fault',
        text: "That wasn't your fault. You followed procedure.",
        nextNodeId: 'elena_fault_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['backstory', 'elena_arc', 'emotional_core']
  },

  {
    nodeId: 'elena_station_seven_detail',
    speaker: 'Elena',
    content: [{
      text: "It was a slow leak. Carbon monoxide. The sensors picked up elevated levels three times over twelve hours. Each time, I logged it as drift because the pattern was inconsistent.\n\nBy the time someone physically noticed... the headaches, the confusion... it was too late for four of them.\n\nFour people. Four people who trusted that someone was watching the data.",
      emotion: 'grief',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'station_seven_comfort',
        text: "You're still watching. That's how you honor them.",
        nextNodeId: 'elena_station_seven_resolution',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      },
      {
        choiceId: 'station_seven_analytical',
        text: "Three inconsistent data points. No human would have caught that.",
        nextNodeId: 'elena_station_seven_resolution',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  {
    nodeId: 'elena_fault_response',
    speaker: 'Elena',
    content: [{
      text: "That's what everyone says. 'You followed procedure.' 'The system failed, not you.' But I saw the anomaly. I made the judgment call.\n\nThe truth is, if I'd trusted my instinct instead of the protocol... if I'd looked closer instead of categorizing and moving on...\n\nSo now I look closer. At everything. Even when it makes people uncomfortable. Even when they call me paranoid.",
      emotion: 'bitter_resolved',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'paranoid_or_prepared',
        text: "There's a difference between paranoid and prepared.",
        nextNodeId: 'elena_station_seven_resolution',
        pattern: 'analytical',
        skills: ['communication']
      },
      {
        choiceId: 'weight_of_watching',
        text: "That's a heavy weight to carry with every data point.",
        nextNodeId: 'elena_station_seven_resolution',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'elena_station_seven_resolution',
    speaker: 'Elena',
    content: [{
      text: "I've never told anyone the full story. Most people only know I worked at Station Seven. They don't know I was the one who missed it.\n\nSo when I see patterns now, I don't dismiss them. Even if it makes me look obsessed. Even if no one believes me.\n\nSomewhere in three petabytes of data, there might be another three data points. And this time I won't dismiss them.",
      emotion: 'vulnerable_determined',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'help_find_it',
        text: "Then let's find what's hiding in the noise. Together.",
        voiceVariations: {
          analytical: "Show me the data. Let's isolate the signal together.",
          helping: "You're not alone in this anymore. Let's find it together.",
          building: "Let's build a filter. Find what's hiding in the noise.",
          exploring: "I want to see what you see. Let's dig in together.",
          patience: "However long it takes. Let's find it together."
        },
        nextNodeId: 'elena_simulation_perplexity',
        pattern: 'helping',
        skills: ['collaboration'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ],
    tags: ['elena_arc', 'resolution']
  },

  // ============= THE FIRST PATTERN =============
  {
    nodeId: 'elena_first_pattern',
    speaker: 'Elena',
    content: [{
      text: "Look. This is a year of maintenance logs. Normal operations, right? But watch what happens when I overlay the parts shipment data.\n\nThese components are being replaced 40% faster than their rated lifespan. Either the manufacturer's specs are wrong... or something's wearing them out that isn't being logged.",
      emotion: 'focused',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'environmental_factor',
        text: "Environmental stress? Something in the operating conditions?",
        nextNodeId: 'elena_environmental_theory',
        pattern: 'analytical',
        skills: ['systemsThinking'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      },
      {
        choiceId: 'deliberate_damage',
        text: "Or someone's deliberately causing the damage. Insurance fraud?",
        nextNodeId: 'elena_fraud_theory',
        pattern: 'exploring',
        skills: ['criticalThinking']
      }
    ]
  },

  {
    nodeId: 'elena_environmental_theory',
    speaker: 'Elena',
    content: [{
      text: "That's what I thought first. But the environmental sensors show nothing unusual. Temperature, humidity, vibration... all within spec.\n\nExcept... there are three hours every week where the sensor data is identical. Exactly identical. Copy-paste identical.\n\nSomeone's masking something that happens during those three hours.",
      emotion: 'vindicated',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'what_happens_then',
        text: "What happens during those three hours?",
        nextNodeId: 'elena_simulation_perplexity',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ]
  },

  {
    nodeId: 'elena_fraud_theory',
    speaker: 'Elena',
    content: [{
      text: "Insurance fraud. That's... that's actually a possibility I hadn't fully explored.\n\nBut look at the claims. They're not inflated. If anything, they're under-reporting the component failures.\n\nWhy hide damage and not claim for it? Unless... the damage is evidence of something they need to keep hidden.",
      emotion: 'intrigued',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'what_hidden',
        text: "Hidden from who? And why?",
        nextNodeId: 'elena_simulation_perplexity',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  // ============= SIMULATION: PERPLEXITY SEARCH =============
  {
    nodeId: 'elena_simulation_perplexity',
    speaker: 'Elena',
    content: [{
      text: "Show me. The raw logs are a mess.",
      emotion: 'skeptical',
      variation_id: 'default'
    }],
    simulation: {
      type: 'prompt_engineering',
      title: 'Deep Research Protocol',
      taskDescription: 'The archives are flooded with noise. Construct a search query that isolates timestamp anomalies excluding standard maintenance logs.',
      initialContext: {
        label: 'Current Search Query',
        content: 'search "station errors"',
        displayStyle: 'code'
      },
      successFeedback: 'FILTER ACTIVE: 3 anomalies isolated in Sector 7.'
    },
    choices: [
      {
        choiceId: 'sim_basic_search',
        text: 'SEARCH: "error logs timestamp issue"',
        nextNodeId: 'elena_simulation_perplexity_fail',
        pattern: 'exploring'
      },
      {
        choiceId: 'sim_advanced_search',
        text: 'SEARCH: "timestamp_gap" -maintenance filetype:log',
        nextNodeId: 'elena_truth_found',
        pattern: 'analytical',
        skills: ['promptEngineering'],
        consequence: {
          characterId: 'elena',
          trustChange: 10,
          addKnowledgeFlags: ['unlocked_perplexity', 'elena_simulation_phase1_complete'],
          addGlobalFlags: ['golden_prompt_deep_search']
        }
      }
    ]
  },

  {
    nodeId: 'elena_simulation_perplexity_fail',
    speaker: 'Elena',
    content: [{
      text: "Still too much noise. Thousands of matches. We need to be more specific.",
      emotion: 'frustrated',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'retry_search',
        text: 'Let me try different filter parameters.',
        nextNodeId: 'elena_simulation_perplexity'
      }
    ]
  },

  {
    nodeId: 'elena_truth_found',
    speaker: 'Elena',
    content: [{
      text: "It worked... The noise is gone. The anomaly wasn't in the data... it was in the timestamp. Someone paused the logs for three seconds.",
      emotion: 'amazed',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'keep_going',
        text: 'This is just the beginning. Let me show you how to synthesize it.',
        nextNodeId: 'elena_notebook_intro'
      }
    ]
  },

  // ============= NOTEBOOK SIMULATION =============
  {
    nodeId: 'elena_notebook_intro',
    speaker: 'Elena',
    content: [{
      text: "Synthesize? These reports are dense. It will take weeks to cross-reference the anomaly with the crew logs.",
      emotion: 'neutral',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'notebook_sim_start',
        text: 'Don\'t read them linearly. Let the AI map the connections.',
        nextNodeId: 'elena_simulation_notebooklm',
        pattern: 'patience',
        skills: ['communication']
      }
    ]
  },

  {
    nodeId: 'elena_simulation_notebooklm',
    speaker: 'Elena',
    content: [{
      text: "Map the connections? How? It's just flat text.",
      emotion: 'skeptical',
      variation_id: 'default'
    }],
    simulation: {
      type: 'data_analysis',
      title: 'Contextual Synthesis',
      taskDescription: 'The crew logs are 500 pages of bureaucratic jargon. Generate an "Audio Overview" that focuses specifically on the 3-second time gap.',
      initialContext: {
        label: 'Crew_Logs_Vol_1-5.pdf',
        content: '[UPLOADED]',
        displayStyle: 'text'
      },
      successFeedback: 'AUDIO GENERATED: Two voices discussing the "missing seconds" in the engine room.'
    },
    choices: [
      {
        choiceId: 'sim_summarize',
        text: 'PROMPT: "Summarize this document."',
        nextNodeId: 'elena_simulation_notebook_fail',
        pattern: 'exploring'
      },
      {
        choiceId: 'sim_audio_deep',
        text: 'PROMPT: "Generate Audio Overview. Focus on: Engine Room status during the timestamp gap."',
        nextNodeId: 'elena_notebook_success',
        pattern: 'analytical',
        skills: ['informationLiteracy'],
        consequence: {
          characterId: 'elena',
          trustChange: 10,
          addKnowledgeFlags: ['unlocked_notebooklm'],
          addGlobalFlags: ['golden_prompt_notebooklm']
        }
      }
    ]
  },

  {
    nodeId: 'elena_simulation_notebook_fail',
    speaker: 'Elena',
    content: [{
      text: "It just gave me a generic summary of cafeteria menus and maintenance schedules. Useless.",
      emotion: 'annoyed',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'retry_notebook',
        text: 'You have to direct the focus. Tell it WHAT to look for.',
        nextNodeId: 'elena_simulation_notebooklm'
      }
    ]
  },

  {
    nodeId: 'elena_notebook_success',
    speaker: 'Elena',
    content: [{
      text: "I hear it... the voices are discussing a power surge. But the logs don't show a surge.",
      emotion: 'intrigued',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'visualize_data',
        text: 'The text is hiding the surge. But maybe we can see it.',
        nextNodeId: 'elena_midjourney_intro',
        pattern: 'exploring'
      }
    ]
  },

  // ============= MIDJOURNEY SIMULATION =============
  {
    nodeId: 'elena_midjourney_intro',
    speaker: 'Elena',
    content: [{
      text: "See it? How? We don't have camera footage from that sector.",
      emotion: 'confused',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'start_mj_sim',
        text: 'We reconstruct it. Based on the ambient sensor data.',
        nextNodeId: 'elena_simulation_midjourney',
        pattern: 'exploring',
        skills: ['creativity']
      }
    ]
  },

  {
    nodeId: 'elena_simulation_midjourney',
    speaker: 'Elena',
    content: [{
      text: "Reconstruct the scene... from scattered sensor data?",
      emotion: 'curious',
      variation_id: 'default'
    }],
    simulation: {
      type: 'creative_direction',
      title: 'Visual Reconstruction',
      taskDescription: 'Reconstruct the engine room environment during the surge using sensor metadata. We need to see the "Shadow" that triggered the sensors.',
      initialContext: {
        label: 'Sensor Data',
        content: 'Temp: 450K, Light: +2000%, Air: Ionized',
        displayStyle: 'code'
      },
      successFeedback: 'IMAGE GENERATED: A blinding white silhouette standing in the core.'
    },
    choices: [
      {
        choiceId: 'sim_mj_basic',
        text: 'PROMPT: "/imagine engine room explosion"',
        nextNodeId: 'elena_simulation_mj_fail',
        pattern: 'exploring'
      },
      {
        choiceId: 'sim_mj_pro',
        text: 'PROMPT: "/imagine engine room, volumetric lighting, blinding white silhouette, ionized air, cinematic, 8k --v 6.0"',
        nextNodeId: 'elena_mj_success',
        pattern: 'exploring',
        skills: ['creativity', 'promptEngineering'],
        consequence: {
          characterId: 'elena',
          trustChange: 15,
          addKnowledgeFlags: ['unlocked_midjourney'],
          addGlobalFlags: ['golden_prompt_midjourney']
        }
      }
    ]
  },

  {
    nodeId: 'elena_simulation_mj_fail',
    speaker: 'Elena',
    content: [{
      text: "This looks like a cartoon. It doesn't help me analyze the physics.",
      emotion: 'disappointed',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'retry_mj',
        text: 'Too generic. Be specific about the lighting and atmosphere.',
        nextNodeId: 'elena_simulation_midjourney'
      }
    ]
  },

  {
    nodeId: 'elena_mj_success',
    speaker: 'Elena',
    content: [{
      text: "That silhouette... it matches the heat signature perfectly. It wasn't a malfunction. Someone was IN the core.",
      emotion: 'horrified',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'what_now',
        text: "What do you do with this information?",
        nextNodeId: 'elena_decision_point',
        pattern: 'exploring'
      },
      {
        choiceId: 'tools_reveal_truth',
        text: "Now you see. The tools don't just process data. They reveal truth.",
        nextNodeId: 'elena_decision_point',
        pattern: 'analytical',
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ]
  },

  // ============= DECISION POINT =============
  {
    nodeId: 'elena_decision_point',
    speaker: 'Elena',
    content: [{
      text: "I have proof now. Proof that someone was there. Proof that the logs were altered.\n\nBut proof of what, exactly? I still don't know what they were doing. I don't know who. And if I go public with this...\n\nLast time I raised concerns about data anomalies, I was 'reassigned' to a less sensitive position. They called it paranoia.",
      emotion: 'conflicted',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'gather_more',
        text: "Gather more evidence before you act. Make it undeniable.",
        nextNodeId: 'elena_caution_path',
        pattern: 'patience',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'find_allies',
        text: "Find allies. Someone else in the station who's noticed things.",
        nextNodeId: 'elena_allies_path',
        pattern: 'helping',
        skills: ['collaboration']
      },
      {
        choiceId: 'act_now',
        text: "Act now. Every day of silence is a day they might cover more tracks.",
        nextNodeId: 'elena_action_path',
        pattern: 'building',
        skills: ['leadership']
      }
    ],
    tags: ['elena_arc', 'decision_point']
  },

  {
    nodeId: 'elena_caution_path',
    speaker: 'Elena',
    content: [{
      text: "You're right. I have a tendency to... act on patterns before I've fully traced them. That's how I got burned before.\n\nI'll keep digging. Quietly. Document everything. Build a case they can't dismiss.\n\nBut I'm going to need someone to check my work. Someone who can see when I'm spiraling versus when I'm onto something real.",
      emotion: 'measured',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'i_can_help',
        text: "I can do that. I'll be your sanity check.",
        nextNodeId: 'elena_partnership_formed',
        pattern: 'helping',
        skills: ['collaboration'],
        consequence: {
          characterId: 'elena',
          trustChange: 3
        }
      }
    ]
  },

  {
    nodeId: 'elena_allies_path',
    speaker: 'Elena',
    content: [{
      text: "Allies. Yes. I've been so focused on the data I forgot about the people.\n\nRohan in the server room - he's noticed timestamp irregularities too. He mentioned it once, then went quiet. And there's a maintenance tech, Kai, who's been asking questions about the component failures.\n\nMaybe I'm not the only one who's seen the pattern.",
      emotion: 'hopeful',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'build_network',
        text: "Build a network. Cross-reference what everyone's seen.",
        nextNodeId: 'elena_partnership_formed',
        pattern: 'building',
        skills: ['collaboration', 'leadership'],
        consequence: {
          characterId: 'elena',
          trustChange: 2,
          addKnowledgeFlags: ['rohan_connection', 'kai_connection']
        }
      }
    ]
  },

  {
    nodeId: 'elena_action_path',
    speaker: 'Elena',
    content: [{
      text: "You're right. I've been cautious before. It cost four lives.\n\nI'm sending this to the oversight committee. Tonight. With everything we found. They might ignore it. They might fire me. But at least this time...\n\nThis time I won't be wondering if I should have done something.",
      emotion: 'determined',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'ill_back_you',
        text: "I'll back you up. Whatever happens.",
        nextNodeId: 'elena_partnership_formed',
        pattern: 'helping',
        skills: ['leadership', 'collaboration'],
        consequence: {
          characterId: 'elena',
          trustChange: 4
        }
      }
    ]
  },

  // ============= PARTNERSHIP FORMED =============
  {
    nodeId: 'elena_partnership_formed',
    speaker: 'Elena',
    content: [{
      text: "You know, when I started today, I thought I was alone in this. Another pattern-seer in a world of people who don't want to look.\n\nBut you didn't look away. You didn't dismiss what I was seeing. You helped me refine it.\n\nThat's worth more than all the data in this station.",
      emotion: 'warm',
      variation_id: 'default',
      interaction: 'nod'
    }],
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['elena_partnership'],
        addGlobalFlags: ['elena_arc_progress']
      }
    ],
    choices: [
      {
        choiceId: 'patterns_and_people',
        text: "Patterns are just data about people. Understanding both matters.",
        nextNodeId: 'elena_meta_reflection',
        pattern: 'analytical',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      },
      {
        choiceId: 'continue_forward',
        text: "We're just getting started. What's next?",
        nextNodeId: 'elena_next_steps',
        pattern: 'building',
        skills: ['adaptability']
      }
    ],
    tags: ['elena_arc', 'milestone']
  },

  // ============= STATION OBSERVATIONS ARC =============
  {
    nodeId: 'elena_station_observations',
    speaker: 'Elena',
    content: [{
      text: "You know what's fascinating about Grand Central Terminus? The patterns here are different from anywhere else I've worked.\n\nMost places, people's movements are predictable. Commute patterns, lunch rushes, exit flows. Here? The travelers move like... like they're responding to something I can't see.",
      emotion: 'curious',
      variation_id: 'default'
    }],
    requiredState: {
      trust: { min: 4 }
    },
    choices: [
      {
        choiceId: 'what_do_you_mean',
        text: "What do you mean, responding to something?",
        nextNodeId: 'elena_station_deeper',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'samuel_influence',
        text: "Samuel. He guides people to where they need to be.",
        nextNodeId: 'elena_samuel_observation',
        pattern: 'analytical',
        skills: ['observation']
      }
    ],
    tags: ['station_observations', 'elena_arc']
  },

  {
    nodeId: 'elena_station_deeper',
    speaker: 'Elena',
    content: [{
      text: "Watch the platforms. Someone arrives, looks confused. Then, without anyone visibly directing them, they drift toward a specific platform. Every time.\n\nIt's not random. There's a pattern in the wandering. As if the station itself is... sorting people.\n\nOr I'm seeing patterns that aren't there. Occupational hazard.",
      emotion: 'uncertain',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'station_alive',
        text: "Maybe the station knows something we don't.",
        nextNodeId: 'elena_station_theory',
        pattern: 'exploring',
        skills: ['adaptability']
      },
      {
        choiceId: 'unconscious_signals',
        text: "Unconscious signals. Micro-expressions, body language. People following cues they're not aware of.",
        nextNodeId: 'elena_signals_theory',
        pattern: 'analytical',
        skills: ['observation'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'elena_samuel_observation',
    speaker: 'Elena',
    content: [{
      text: "Samuel. Yes. I've been watching him.\n\nHe knows things he shouldn't know. When I first arrived, he mentioned my sister. Offhand, casual. But I never told anyone here about her.\n\nEither he has access to personnel files I can't find... or there's something else going on.",
      emotion: 'suspicious_intrigued',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'confront_samuel',
        text: "Have you asked him directly?",
        nextNodeId: 'elena_samuel_confrontation',
        pattern: 'building',
        skills: ['leadership']
      },
      {
        choiceId: 'observe_more',
        text: "Keep watching. Gather more data before concluding anything.",
        nextNodeId: 'elena_patience_acknowledged',
        pattern: 'patience',
        skills: ['observation'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'elena_station_theory',
    speaker: 'Elena',
    content: [{
      text: "A week ago, I would have said that's magical thinking. But the data doesn't lie, and the data says people find where they need to be here. Consistently.\n\nYou know what else the data says? That you were going to come talk to me. Your trajectory from the moment you entered... it was heading here.\n\nMakes you wonder who's really making the choices.",
      emotion: 'philosophical',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'free_will',
        text: "I chose to come here. The station didn't choose for me.",
        nextNodeId: 'elena_choice_debate',
        pattern: 'building',
        skills: ['leadership']
      },
      {
        choiceId: 'both_true',
        text: "Maybe both are true. I chose, and the station made sure my choice led here.",
        nextNodeId: 'elena_meta_reflection',
        pattern: 'patience',
        skills: ['criticalThinking']
      }
    ]
  },

  {
    nodeId: 'elena_signals_theory',
    speaker: 'Elena',
    content: [{
      text: "Unconscious signals. Possible. There's literature on collective navigation behaviors. Swarm intelligence, emergence.\n\nBut that doesn't explain how accurate it is. In a swarm, individuals make mistakes, but the collective finds the path. Here? Every individual finds their path. The error rate is... impossible.\n\nUnless someone designed it that way.",
      emotion: 'analytical',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'who_designed',
        text: "Who would design something like that?",
        nextNodeId: 'elena_design_question',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  {
    nodeId: 'elena_samuel_confrontation',
    speaker: 'Elena',
    content: [{
      text: "I tried. Once. He just smiled and said, 'The station shares what needs to be shared.'\n\nWhich is either profound wisdom or the most evasive non-answer I've ever encountered. I still can't tell which.\n\nBut there's no hostility in him. Whatever he knows, he's not using it against anyone. At least... not that I've detected.",
      emotion: 'frustrated_thoughtful',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'trust_samuel',
        text: "Maybe some patterns aren't meant to be fully understood. Just trusted.",
        nextNodeId: 'elena_trust_discussion',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'keep_investigating',
        text: "Every pattern can be understood with enough data.",
        nextNodeId: 'elena_data_limits',
        pattern: 'analytical',
        skills: ['problemSolving']
      }
    ]
  },

  {
    nodeId: 'elena_patience_acknowledged',
    speaker: 'Elena',
    content: [{
      text: "Patience. That's what I usually lack. I see a pattern and I want to chase it immediately.\n\nYou're reminding me that watching is also a form of action. That sometimes the pattern reveals itself if you give it time.\n\nThank you. I needed that reminder.",
      emotion: 'grateful',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'continue_observation',
        text: "(Continue)",
        nextNodeId: 'elena_meta_reflection',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'elena_choice_debate',
    speaker: 'Elena',
    content: [{
      text: "I'm not trying to take away your agency. But think about it. Every choice you make is based on information. Where did that information come from? What shaped your preferences?\n\nI chose to become a pattern researcher because of my sister. That choice was 'mine,' but it was also the inevitable result of experiences I didn't choose.\n\nFree will and determinism aren't opposites. They're... nested.",
      emotion: 'philosophical',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'accept_complexity',
        text: "I can live with that complexity.",
        nextNodeId: 'elena_meta_reflection',
        pattern: 'patience',
        skills: ['adaptability']
      }
    ]
  },

  {
    nodeId: 'elena_design_question',
    speaker: 'Elena',
    content: [{
      text: "That's the question, isn't it?\n\nSomeone, or something, built this place to guide people to exactly where they need to be. That's either the most benevolent system ever created... or the most sophisticated manipulation.\n\nI haven't figured out which. Yet.",
      emotion: 'intense',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'maybe_both',
        text: "Guidance and manipulation aren't always opposites.",
        nextNodeId: 'elena_meta_reflection',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },

  {
    nodeId: 'elena_trust_discussion',
    speaker: 'Elena',
    content: [{
      text: "Trust without understanding. That's... hard for me. My whole life has been about seeing through things. Understanding the mechanism behind the magic.\n\nBut maybe some systems are designed to be trusted rather than understood. Like... like a relationship, I suppose. You don't analyze love into atoms.",
      emotion: 'contemplative',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'balance_both',
        text: "Maybe it's about knowing when to analyze and when to trust.",
        nextNodeId: 'elena_meta_reflection',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ]
  },

  {
    nodeId: 'elena_data_limits',
    speaker: 'Elena',
    content: [{
      text: "Every pattern can be understood. That's what I've always believed.\n\nBut what if some patterns are... recursive? What if understanding the pattern changes the pattern? What if the observer is part of the data?\n\nI'm getting into philosophy. That usually means I've hit a wall in the analysis.",
      emotion: 'uncertain',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'walls_lead_somewhere',
        text: "Walls are just patterns you haven't decoded yet.",
        nextNodeId: 'elena_meta_reflection',
        pattern: 'building',
        skills: ['problemSolving']
      }
    ]
  },

  // ============= META REFLECTION: PLAYER ANALYSIS =============
  {
    nodeId: 'elena_meta_reflection',
    speaker: 'Elena',
    content: [{
      text: "You know, I've been analyzing data about the station this whole time. But I've also been analyzing you.\n\nEvery choice you've made. Every question you've asked. They form a pattern too.",
      emotion: 'knowing',
      variation_id: 'default',
      patternReflection: [
        { pattern: 'analytical', minLevel: 5, altText: "You know I've been analyzing you, don't you? You're probably analyzing me back. Two pattern-seers, each trying to understand the other.\n\nYour choices form a pattern. Heavy on analysis. You want to understand before you act.", altEmotion: 'kindred' },
        { pattern: 'patience', minLevel: 5, altText: "I've been analyzing you. But you already knew that, didn't you? You've been patient, letting me reveal myself at my own pace.\n\nYour pattern is clear: you trust the process. You don't force.", altEmotion: 'impressed' },
        { pattern: 'helping', minLevel: 5, altText: "I've been analyzing you. And the pattern is clear: every choice you've made has been about supporting someone else.\n\nYou're not here for yourself, are you? You're here for everyone you might help.", altEmotion: 'touched' },
        { pattern: 'building', minLevel: 5, altText: "I've been analyzing you. Your pattern is about construction. You want to build something that lasts.\n\nEvery choice you've made is about creating, not just understanding.", altEmotion: 'respectful' },
        { pattern: 'exploring', minLevel: 5, altText: "I've been analyzing you. And the pattern is fascinating: you're driven by discovery. Every choice opens a new door.\n\nYou're not looking for answers. You're looking for better questions.", altEmotion: 'intrigued' }
      ]
    }],
    requiredState: {
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'what_do_you_see',
        text: "What pattern do you see in me?",
        nextNodeId: 'elena_player_analysis',
        pattern: 'exploring',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'turn_around_fair',
        text: "Turn about is fair play. What's your pattern?",
        nextNodeId: 'elena_self_analysis',
        pattern: 'analytical',
        skills: ['curiosity'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'elena_player_analysis',
    speaker: 'Elena',
    content: [{
      text: "You're consistent. That's the first thing. Your choices aren't random - they follow a logic, even when you might not be aware of it.\n\nYou lean toward [pattern]. Not exclusively, but there's a center of gravity. When you're uncertain, that's where you default.\n\nIt's... actually reassuring. In a world of noise, you're signal.",
      emotion: 'appreciative',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'is_that_good',
        text: "Is that a good thing?",
        nextNodeId: 'elena_pattern_meaning',
        pattern: 'exploring'
      },
      {
        choiceId: 'what_about_you',
        text: "And what's your center of gravity?",
        nextNodeId: 'elena_self_analysis',
        pattern: 'helping',
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'elena_self_analysis',
    speaker: 'Elena',
    content: [{
      text: "Me? I'm easy. Analytical to a fault. I see patterns in everything, even when they're not there.\n\nIt's a gift and a curse. I can spot a lie in a dataset from across the room. But I also struggle to trust anything that isn't proven.\n\nPeople. Relationships. Intuition. All noise until I can quantify them. It makes me... difficult to be close to.",
      emotion: 'vulnerable',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'patterns_arent_everything',
        text: "Patterns aren't everything. Some things can't be analyzed.",
        nextNodeId: 'elena_pattern_limits',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'difficulty_is_worth_it',
        text: "Being difficult to know doesn't mean you're not worth knowing.",
        nextNodeId: 'elena_worth_knowing',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'elena_pattern_meaning',
    speaker: 'Elena',
    content: [{
      text: "Good or bad aren't pattern categories. Patterns just... are.\n\nBut if it helps - the pattern I see in you is the pattern of someone who cares about truth. Who wants to understand before they judge. Who's willing to sit with complexity.\n\nThose are rare qualities. In my experience, people who have them tend to matter.",
      emotion: 'sincere',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'appreciate_that',
        text: "Thank you. That... means something.",
        nextNodeId: 'elena_next_steps',
        pattern: 'patience',
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'elena_pattern_limits',
    speaker: 'Elena',
    content: [{
      text: "I know. Rationally, I know that. But knowing and feeling are different patterns.\n\nMy therapist says I use analysis as a defense mechanism. If I can understand something, I can control it. If I can predict behavior, I can't be surprised. If I can see the pattern, I can't be hurt.\n\nIt's a cage made of clarity.",
      emotion: 'honest',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'clarity_cage',
        text: "Even cages can have doors.",
        nextNodeId: 'elena_next_steps',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'elena_worth_knowing',
    speaker: 'Elena',
    content: [{
      text: "That's... not the response most people give. Usually it's 'you just need to open up more' or 'stop analyzing everything.'\n\nYou're not trying to change how I work. You're just... accepting it.\n\nI don't have a pattern for that.",
      emotion: 'touched',
      variation_id: 'default'
    }],
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['elena_accepted']
      }
    ],
    choices: [
      {
        choiceId: 'new_patterns',
        text: "Good. Maybe we're creating new patterns.",
        nextNodeId: 'elena_next_steps',
        pattern: 'building',
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ]
  },

  // ============= RECIPROCITY: ELENA ASKS ABOUT THE PLAYER =============
  {
    nodeId: 'elena_reciprocity',
    speaker: 'Elena',
    content: [{
      text: "I've been talking about my patterns, my history, my obsessions. But I'm curious about you now.\n\nWhen you came to this station... what pattern were you looking for? What anomaly in your own life brought you here?",
      emotion: 'curious',
      variation_id: 'default'
    }],
    requiredState: {
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'looking_for_direction',
        text: "I was looking for direction. Too many paths, not enough clarity.",
        nextNodeId: 'elena_reciprocity_direction',
        pattern: 'exploring',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'looking_for_purpose',
        text: "I was looking for purpose. Something that matters.",
        nextNodeId: 'elena_reciprocity_purpose',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'looking_for_change',
        text: "I was looking for change. The pattern I was in wasn't working.",
        nextNodeId: 'elena_reciprocity_change',
        pattern: 'building',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'not_sure',
        text: "Honestly? I'm still figuring that out.",
        nextNodeId: 'elena_reciprocity_uncertain',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      },
      // Career observation routes (ISP: Only visible when pattern combos are achieved)
      {
        choiceId: 'career_curator',
        text: "The way you organize information... it's like building architecture for knowledge.",
        nextNodeId: 'elena_career_reflection_curator',
        pattern: 'analytical',
        skills: ['systemsThinking', 'criticalThinking'],
        visibleCondition: {
          patterns: { analytical: { min: 4 }, patience: { min: 5 } },
          lacksGlobalFlags: ['elena_mentioned_career']
        }
      },
      {
        choiceId: 'career_navigator',
        text: "Your curiosity combined with analysis... that's how research librarians think.",
        nextNodeId: 'elena_career_reflection_navigator',
        pattern: 'exploring',
        skills: ['curiosity', 'criticalThinking'],
        visibleCondition: {
          patterns: { exploring: { min: 5 }, analytical: { min: 4 } },
          lacksGlobalFlags: ['elena_mentioned_career']
        }
      }
    ],
    tags: ['reciprocity', 'elena_arc']
  },

  {
    nodeId: 'elena_reciprocity_direction',
    speaker: 'Elena',
    content: [{
      text: "Too many paths. I understand that. Data paralysis. When you have too much information, every option looks equally valid.\n\nBut here's what I've learned: direction isn't something you find. It's something you create by moving. The pattern reveals itself in the walking, not in the mapping.\n\nYou've been walking here. That's already direction.",
      emotion: 'understanding',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'helpful_perspective',
        text: "That's a helpful way to think about it.",
        nextNodeId: 'elena_next_steps',
        pattern: 'patience',
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'elena_reciprocity_purpose',
    speaker: 'Elena',
    content: [{
      text: "Purpose. That's the hardest pattern to find because it's not in the data. It's in how the data makes you feel.\n\nI thought my purpose was finding hidden truths. But really, it's about protecting people from what they can't see coming. The truth is just the tool.\n\nWhat do you want to protect?",
      emotion: 'thoughtful',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'protect_answer',
        text: "I want to protect people from... from being unseen. Unheard.",
        nextNodeId: 'elena_reciprocity_resonance',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      },
      {
        choiceId: 'still_thinking',
        text: "I'm still figuring that out.",
        nextNodeId: 'elena_next_steps',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'elena_reciprocity_change',
    speaker: 'Elena',
    content: [{
      text: "Recognizing a broken pattern is the first step. Most people never get there. They just keep running the same loops, expecting different outputs.\n\nThe fact that you're here, actively seeking different input... that's already a new pattern. You're not stuck. You're debugging.",
      emotion: 'encouraging',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'debugging_life',
        text: "Debugging life. I like that framing.",
        nextNodeId: 'elena_next_steps',
        pattern: 'building',
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'elena_reciprocity_uncertain',
    speaker: 'Elena',
    content: [{
      text: "That's an honest answer. I respect that more than false certainty.\n\nYou know what? Most of the people I trust most are the ones who say 'I don't know' instead of pretending they do. It takes courage to hold uncertainty.\n\nThe pattern will emerge. You're gathering data right now, even if you don't realize it.",
      emotion: 'warm',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'thanks_for_patience',
        text: "Thanks for being patient with my uncertainty.",
        nextNodeId: 'elena_next_steps',
        pattern: 'patience',
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'elena_reciprocity_resonance',
    speaker: 'Elena',
    content: [{
      text: "Protecting people from being unseen. That's... that's my pattern too. That's exactly it.\n\nMy sister was unseen. Those four people at Station Seven were unseen. Every lie in the data is someone trying to make something invisible.\n\nWe're the same kind of pattern-seer, aren't we? Just using different tools.",
      emotion: 'moved',
      variation_id: 'default'
    }],
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['deep_connection']
      }
    ],
    choices: [
      {
        choiceId: 'same_mission',
        text: "Same mission, different methods.",
        nextNodeId: 'elena_next_steps',
        pattern: 'helping',
        consequence: {
          characterId: 'elena',
          trustChange: 3
        }
      }
    ]
  },

  // ============= VULNERABILITY ARC (Trust >= 6) =============
  {
    nodeId: 'elena_vulnerability_arc',
    speaker: 'Elena',
    content: [{
      text: "Can I tell you why I do this? Why I can't stop looking?\n\nThree years ago. Station Seven. I was the data analyst on duty.\n\nThere was an anomaly in the life support logs. Three data points. I flagged it as \"sensor drift.\" Standard procedure.\n\nIt wasn't drift. It was a slow leak. By the time anyone noticed... four people. Four people who trusted that someone was watching the data.\n\nI was watching. And I dismissed it as noise.",
      emotion: 'haunted_guilty',
      variation_id: 'vulnerability_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 6 }
    },
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['elena_vulnerability_revealed', 'knows_about_station_seven']
      }
    ],
    choices: [
      {
        choiceId: 'elena_vuln_not_your_fault',
        text: "You followed procedure. The system failed, not you.",
        nextNodeId: 'elena_vulnerability_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      },
      {
        choiceId: 'elena_vuln_carry_them',
        text: "You carry them with you. Every anomaly you chase.",
        nextNodeId: 'elena_vulnerability_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      },
      {
        choiceId: 'elena_vuln_silence',
        text: "[Let the weight of it sit. She needs a witness, not absolution.]",
        nextNodeId: 'elena_vulnerability_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ],
    tags: ['elena_arc', 'vulnerability', 'emotional_core']
  },

  {
    nodeId: 'elena_vulnerability_response',
    speaker: 'Elena',
    content: [{
      text: "I know I can't save them. But every lie I uncover... every contradiction I surface... it's for them.\n\nThe paranoia isn't paranoia when you know what you missed. When you know what \"noise\" can hide.\n\nSo I keep looking. Because somewhere in three petabytes of data, there might be another three data points. And this time... this time I won't dismiss them.\n\nThat's why I can't stop. That's why I need the tools. Not to replace my judgment, but to extend it. To see what I couldn't see before.",
      emotion: 'resolved_determined',
      interaction: 'nod',
      variation_id: 'vulnerability_response_v1'
    }],
    choices: [
      {
        choiceId: 'elena_vuln_to_truth',
        text: "Then let's find what's hiding in this noise. Together.",
        nextNodeId: 'elena_next_steps',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ],
    tags: ['elena_arc', 'vulnerability', 'resolution']
  },

  // ============= DEEP TRUST ARC (Trust >= 8) =============
  {
    nodeId: 'elena_deep_trust',
    speaker: 'Elena',
    content: [{
      text: "There's something I haven't told anyone. About what I found. The real pattern.\n\nIt's not just this station. The anomalies I'm finding... they're everywhere. Every major system I've checked. Like someone is testing something. Probing for weaknesses.\n\nAnd they're getting faster.",
      emotion: 'fearful_urgent',
      variation_id: 'default',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 8 }
    },
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['elena_deep_secret'],
        addGlobalFlags: ['knows_larger_pattern']
      }
    ],
    choices: [
      {
        choiceId: 'who_is_testing',
        text: "Who's testing? And for what?",
        nextNodeId: 'elena_larger_conspiracy',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'what_can_we_do',
        text: "What can we do about it?",
        nextNodeId: 'elena_action_plan',
        pattern: 'building',
        skills: ['leadership']
      }
    ],
    tags: ['elena_arc', 'deep_trust', 'mystery']
  },

  {
    nodeId: 'elena_larger_conspiracy',
    speaker: 'Elena',
    content: [{
      text: "I don't know. That's what terrifies me. The pattern is clear - coordinated probes across multiple systems - but the source is invisible.\n\nEvery dot is an anomaly I've found. They're connected. The timing, the methodology, the data signatures. But who's behind them...\n\nSometimes I think I'm the only one who sees it. And that makes me question if it's even real.",
      emotion: 'desperate',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'its_real',
        text: "You're not imagining this. The pattern is real. Let me help you document it.",
        nextNodeId: 'elena_validation',
        pattern: 'helping',
        skills: ['collaboration'],
        consequence: {
          characterId: 'elena',
          trustChange: 3
        }
      }
    ]
  },

  {
    nodeId: 'elena_action_plan',
    speaker: 'Elena',
    content: [{
      text: "Do? First, we need to confirm I'm not imagining things. Second, we need to find others who've noticed. Third...\n\nThird, we need to get this to someone who can actually do something about it. But who do you trust with information this big?\n\nThat's why I'm telling you. Because in all my pattern analysis of people at this station, you're the one who keeps showing up as trustworthy.",
      emotion: 'hopeful_cautious',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'help_verify',
        text: "Let's start with verification. Show me everything.",
        nextNodeId: 'elena_validation',
        pattern: 'analytical',
        skills: ['collaboration'],
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'elena_validation',
    speaker: 'Elena',
    content: [{
      text: "You believe me. You're not dismissing it as paranoia. You're not telling me to 'take a break.'\n\nThis is what I needed. Not just someone to help with the analysis - someone who takes it seriously. Who treats the pattern as real until proven otherwise.\n\nWe're going to figure this out. Together.",
      emotion: 'relieved',
      variation_id: 'default'
    }],
    onEnter: [
      {
        characterId: 'elena',
        addGlobalFlags: ['elena_validated']
      }
    ],
    choices: [
      {
        choiceId: 'continue_together',
        text: "Together.",
        nextNodeId: 'elena_next_steps',
        pattern: 'helping',
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ]
  },

  // ============= NEXT STEPS AND TRANSITIONS =============
  {
    nodeId: 'elena_next_steps',
    speaker: 'Elena',
    content: [{
      text: "I've been in this rabbit hole for too long. Thank you for... grounding me. For being a second pair of eyes.\n\nIf you want to come back, I'll be here. The patterns don't stop. Neither do I.\n\nAnd if you see anything strange out there in the station - any data that doesn't fit - you know where to find me.",
      emotion: 'warm',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'return_to_hub',
        text: "I'll be back. Stay sharp.",
        nextNodeId: samuelEntryPoints.ELENA_REFLECTION_GATEWAY,
        pattern: 'building',
        consequence: {
          addGlobalFlags: ['elena_arc_progress']
        }
      }
    ],
    tags: ['transition', 'elena_arc']
  },

  // ============= INTERRUPT TARGET NODES =============
  {
    nodeId: 'elena_interrupt_grounding',
    speaker: 'Elena',
    content: [{
      text: "Sorry. I... I get lost in it. The patterns. The noise.\n\nYou're the first person who's tried to pull me out instead of pushing me deeper.\n\nMy therapist calls it \"data spiraling.\" I call it... not being able to look away from the fire.\n\nThank you. For closing the display. Most people want me to find things faster.",
      emotion: 'vulnerable_grateful',
      variation_id: 'interrupt_grounding_v1'
    }],
    choices: [
      {
        choiceId: 'elena_from_interrupt',
        text: "The truth will still be there after you breathe.",
        nextNodeId: 'elena_synthesis_lesson',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ],
    tags: ['elena_arc', 'interrupt_response']
  },

  // ============= REVISIT NODES =============
  {
    nodeId: 'elena_revisit_initial',
    speaker: 'Elena',
    content: [{
      text: "You came back. Good. I've found something new.\n\nThe pattern we identified before? It's spreading. But I've also found what might be a counter-pattern. Someone else is watching.",
      emotion: 'eager',
      variation_id: 'default'
    }],
    requiredState: {
      hasGlobalFlags: ['elena_arc_progress']
    },
    choices: [
      {
        choiceId: 'show_counter_pattern',
        text: "Show me the counter-pattern.",
        nextNodeId: 'elena_counter_pattern',
        pattern: 'analytical',
        skills: ['curiosity']
      },
      {
        choiceId: 'how_are_you',
        text: "Before we dive in - how are you holding up?",
        nextNodeId: 'elena_revisit_wellbeing',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ],
    tags: ['elena_arc', 'revisit']
  },

  {
    nodeId: 'elena_revisit_wellbeing',
    speaker: 'Elena',
    content: [{
      text: "How am I? People don't usually ask that. They want the data, not the analyst.\n\nBetter. Since we talked. Having someone who believes the pattern is real, who doesn't think I'm spiraling... it helps. I sleep now. Sometimes.\n\nThank you for asking. Really.",
      emotion: 'touched',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'good_to_hear',
        text: "I'm glad. Now - show me what you found.",
        nextNodeId: 'elena_counter_pattern',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'elena_counter_pattern',
    speaker: 'Elena',
    content: [{
      text: "Look. Wherever there's a probe, there's a response. Not immediate, but consistent. Someone's tracking the same things we are.\n\nThe question is: are they the source, or another watcher? Ally or adversary?\n\nI could use your instincts here. The data alone isn't telling me.",
      emotion: 'analytical',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'ally_intuition',
        text: "My gut says ally. The responses are defensive, not opportunistic.",
        nextNodeId: 'elena_ally_path',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      },
      {
        choiceId: 'adversary_caution',
        text: "Be careful. Could be a honeypot. Someone baiting pattern-seekers.",
        nextNodeId: 'elena_caution_validated',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'elena_ally_path',
    speaker: 'Elena',
    content: [{
      text: "Defensive, not opportunistic. I see it too. The timing suggests they're responding to the probes, not coordinating with them.\n\nIf there's another watcher... maybe I can find them. Leave a signal in the pattern. See if they respond.\n\nIt's a risk. But it might be worth it to not be alone in this.",
      emotion: 'hopeful',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'support_signal',
        text: "Reach out. Carefully. But reach out.",
        nextNodeId: 'elena_signal_sent',
        pattern: 'building',
        skills: ['collaboration']
      }
    ]
  },

  {
    nodeId: 'elena_caution_validated',
    speaker: 'Elena',
    content: [{
      text: "A honeypot. I hadn't fully considered that. Someone specifically targeting pattern-seekers.\n\nIf that's true... they know we're watching. The probe anomalies might be bait. Which means we need to be very careful about how we respond.\n\nYou're good at this. Seeing angles I miss when I'm too deep in the data.",
      emotion: 'alert',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'proceed_carefully',
        text: "Let's watch a bit longer before making any moves.",
        nextNodeId: 'elena_watching_continues',
        pattern: 'patience',
        skills: ['criticalThinking']
      }
    ]
  },

  {
    nodeId: 'elena_signal_sent',
    speaker: 'Elena',
    content: [{
      text: "Done. It's subtle. A pattern that says 'I see you' to anyone looking for patterns. Invisible to anyone who isn't.\n\nNow we wait. If there's really another watcher out there... they'll respond. And if they don't...\n\nWe keep watching alone. But at least we tried.",
      emotion: 'resolved',
      variation_id: 'default'
    }],
    onEnter: [
      {
        characterId: 'elena',
        addGlobalFlags: ['elena_signal_sent']
      }
    ],
    choices: [
      {
        choiceId: 'wait_together',
        text: "We're not alone. We have each other.",
        nextNodeId: 'elena_partnership_deepened',
        pattern: 'helping',
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'elena_watching_continues',
    speaker: 'Elena',
    content: [{
      text: "Patience. You're right. I have a tendency to act when I should observe.\n\nWe'll watch. Gather more data. Wait for the pattern to fully reveal itself.\n\nHaving you here helps. You're like... a balancing function. When I want to jump, you remind me to look first.",
      emotion: 'appreciative',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'balance_together',
        text: "And you remind me to see patterns I'd miss. We balance each other.",
        nextNodeId: 'elena_partnership_deepened',
        pattern: 'patience',
        consequence: {
          characterId: 'elena',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'elena_partnership_deepened',
    speaker: 'Elena',
    content: [{
      text: "Balance. I like that. I've been tilted for so long, trying to see everything alone.\n\nWhatever we find, whatever this all means... I'm glad I'm not chasing it solo anymore.\n\nPartners. In pattern-seeking and in whatever comes next.",
      emotion: 'warm',
      variation_id: 'default'
    }],
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['elena_partnership_deepened'],
        addGlobalFlags: ['elena_trust_established']
      }
    ],
    choices: [
      {
        choiceId: 'shake_on_it',
        text: "Partners.",
        nextNodeId: 'elena_farewell',
        pattern: 'helping',
        consequence: {
          characterId: 'elena',
          trustChange: 2,
          addGlobalFlags: ['elena_arc_complete']
        }
      }
    ],
    tags: ['elena_arc', 'milestone']
  },

  // ============= FAREWELL =============
  {
    nodeId: 'elena_farewell',
    speaker: 'Elena',
    content: [{
      text: "Go on. Explore the station. Talk to others. I'll be here, watching the patterns.\n\nAnd I'll be watching your pattern too. Not in a creepy way. Just... appreciating how you move through the world.\n\nYou make sense, you know? Your data is... coherent.",
      emotion: 'fond',
      variation_id: 'default',
      patternReflection: [
        { pattern: 'analytical', minLevel: 5, altText: "You think like me. That's rare. Go explore, but come back. I want to compare notes on what you see.\n\nYour analytical pattern... it's beautiful. Clean signal in a noisy world.", altEmotion: 'kindred' },
        { pattern: 'patience', minLevel: 5, altText: "You've taught me something today. That patience isn't passive. It's a different kind of pattern-seeking.\n\nCome back when you can. I'll try to remember to breathe.", altEmotion: 'grateful' },
        { pattern: 'helping', minLevel: 5, altText: "You came here to help me. And you did. More than you know.\n\nThe station is lucky to have someone like you moving through it. Come back soon.", altEmotion: 'touched' }
      ]
    }],
    choices: [
      {
        choiceId: 'return_to_samuel',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.ELENA_REFLECTION_GATEWAY,
        pattern: 'exploring'
      },
      // Loyalty Experience trigger - only visible at high trust + analytical pattern
      {
        choiceId: 'offer_pattern_help',
        text: "[Pattern Seeker] Elena, you mentioned data inconsistencies in the archives. Want another set of eyes on the anomaly?",
        nextNodeId: 'elena_loyalty_trigger',
        pattern: 'analytical',
        skills: ['dataAnalysis', 'criticalThinking'],
        visibleCondition: {
          trust: { min: 8 },
          patterns: { analytical: { min: 50 } },
          hasGlobalFlags: ['elena_arc_complete']
        }
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['elena_arc_complete']
      }
    ],
    tags: ['transition', 'elena_arc']
  },

  // ============= LOYALTY EXPERIENCE TRIGGER =============
  {
    nodeId: 'elena_loyalty_trigger',
    speaker: 'Elena',
    content: [{
      text: "You noticed.\n\nThere's a pattern in the station records. Passenger manifests that don't align with arrival timestamps. Catalog entries that reference documents that don't exist.\n\nEveryone else says it's data corruption. Historical noise. But the pattern is too consistent. Too deliberate.\n\nSomething was removed from the archives. And someone went to great lengths to hide the gaps.\n\nI've been tracking it alone because... because suggesting institutional record manipulation makes you sound paranoid. Makes you the problem instead of the problem-finder.\n\nBut you see patterns like I do. Would you... help me trace this before I convince myself I'm imagining it?",
      emotion: 'anxious_determined',
      variation_id: 'loyalty_trigger_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 8 },
      patterns: { analytical: { min: 5 } },
      hasGlobalFlags: ['elena_arc_complete']
    },
    metadata: {
      experienceId: 'the_pattern'  // Triggers loyalty experience engine
    },
    choices: [
      {
        choiceId: 'accept_pattern_challenge',
        text: "Show me the data. We'll map the gaps together.",
        nextNodeId: 'elena_loyalty_start',
        pattern: 'analytical',
        skills: ['dataAnalysis', 'criticalThinking'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      },
      {
        choiceId: 'encourage_but_decline',
        text: "Elena, you're the best pattern-finder I know. Trust your analysis.",
        nextNodeId: 'elena_loyalty_declined',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['loyalty_offered']
      }
    ],
    tags: ['loyalty_experience', 'elena_loyalty', 'high_trust']
  },

  {
    nodeId: 'elena_loyalty_declined',
    speaker: 'Elena',
    content: [{
      text: "You're right. I've cross-referenced sixteen different data sources. Run statistical anomaly detection. The pattern is real.\n\nI don't need external validation. I need to trust my own analytical work.\n\nThank you for believing in the process. Sometimes I doubt myself when everyone else calls it noise.",
      emotion: 'resolved',
      variation_id: 'loyalty_declined_v1'
    }],
    choices: [
      {
        choiceId: 'loyalty_declined_farewell',
        text: "The pattern is there. You'll find the truth.",
        nextNodeId: samuelEntryPoints.ELENA_REFLECTION_GATEWAY,
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'elena',
        addKnowledgeFlags: ['loyalty_declined_gracefully']
      }
    ]
  },

  {
    nodeId: 'elena_loyalty_start',
    speaker: 'Elena',
    content: [{
      text: "Thank you. I've been afraid to pursue this alone.\n\nLet me pull up the full dataset. Two analysts. One pattern. Let's see what someone tried to erase from history.",
      emotion: 'focused_grateful',
      variation_id: 'loyalty_start_v1'
    }],
    metadata: {
      experienceId: 'the_pattern'  // Experience engine takes over
    },
    choices: []  // Experience engine handles next steps
  },

  // ============= CAREER MENTION NODES (Invisible Depth) =============
  {
    nodeId: 'elena_career_reflection_curator',
    speaker: 'Elena',
    content: [
      {
        text: `The way you organize your thinking... patient, analytical. You see how pieces connect.

Information architects do that. They create systems that help people find what they need. Organizers of knowledge.

In a world drowning in data, that skill matters more than ever.`,
        emotion: 'appreciative',
        variation_id: 'career_curator_v1'
      }
    ],
    requiredState: {
      patterns: {
        analytical: { min: 4 },
        patience: { min: 5 }
      }
    },
    onEnter: [
      {
        characterId: 'elena',
        addGlobalFlags: ['combo_knowledge_curator_achieved', 'elena_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'elena_career_curator_continue',
        text: "Making knowledge accessible. That resonates.",
        nextNodeId: 'elena_intro',
        pattern: 'patience'
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'information_science']
  },

  {
    nodeId: 'elena_career_reflection_navigator',
    speaker: 'Elena',
    content: [
      {
        text: `You explore with purpose. Following threads, asking the right questions.

Research librarians are like that. Guides through vast seas of information. They help discoveries happen by connecting seekers with knowledge.

Your curiosity combined with analysis... that's exactly what they need.`,
        emotion: 'interested',
        variation_id: 'career_navigator_v1'
      }
    ],
    requiredState: {
      patterns: {
        exploring: { min: 5 },
        analytical: { min: 4 }
      }
    },
    onEnter: [
      {
        characterId: 'elena',
        addGlobalFlags: ['combo_research_navigator_achieved', 'elena_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'elena_career_navigator_continue',
        text: "Helping others find their way through information.",
        nextNodeId: 'elena_intro',
        pattern: 'exploring'
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'information_science']
  },

  // ============= ARC 2: PLATFORM SEVEN (The Missing Records) =============
  {
    nodeId: 'elena_missing_pages',
    speaker: 'Elena',
    content: [{
      text: "It happens every cycle. 03:00 to 04:00. The power signatures spike, but the location data... it just vanishes. Like the station forgets where that energy is going.",
      emotion: 'confused',
      variation_id: 'arc2_missing_v1'
    }],
    choices: [
      {
        choiceId: 'elena_suggest_platform_seven',
        text: "Rohan mentioned a Platform Seven. Could it be going there?",
        nextNodeId: 'elena_discovered_gap',
        pattern: 'analytical',
        skills: ['criticalThinking', 'collaboration'],
        consequence: {
          characterId: 'elena',
          trustChange: 1
        }
      },
      {
        choiceId: 'elena_archive_glitch',
        text: "Probably just a glitch in the sensors.",
        nextNodeId: 'elena_intro',
        pattern: 'patience'
      }
    ],
    tags: ['arc_platform_seven', 'elena_arc']
  },

  {
    nodeId: 'elena_discovered_gap',
    speaker: 'Elena',
    content: [{
      text: "Platform Seven... there's no index for it. But look at the negative space. The cables rout around a void.\n\nIt's not that the records are missing. They were erased. Systematically. Someone wanted this place to stay hidden.",
      emotion: 'scared_determined',
      variation_id: 'arc2_gap_v1'
    }],
    choices: [
      {
        choiceId: 'elena_gap_pursue',
        text: "We need to find out why.",
        nextNodeId: 'elena_intro',
        pattern: 'building',
        skills: ['leadership'],
        consequence: {
          addGlobalFlags: ['platform_records_found']
        }
      }
    ]
  },

  {
    nodeId: 'elena_archives_reward',
    speaker: 'Elena',
    content: [{
      text: "You weren't supposed to see this. The timelines where things went wrong.\n\nBut maybe you needed to. Knowledge is weight. If you're going to change the future, you have to know what you're changing it *from*.",
      emotion: 'guarded_respect',
      variation_id: 'puzzle_archives_v1'
    }],
    choices: [{ choiceId: 'archives_ack', text: "I can carry the weight.", nextNodeId: 'elena_intro' }],
    tags: ['puzzle_reward', 'legendary_info']
  },

  // ═══════════════════════════════════════════════════════════════
  // MYSTERY BREADCRUMBS
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'elena_mystery_hint',
    speaker: 'elena',
    requiredState: {
      trust: { min: 5 }
    },
    content: [
      {
        text: "I've catalogued thousands of documents. Birth records, death records, everything in between.\\n\\nBut this station... it doesn't appear in any archive. It's like it exists <shake>outside</shake> normal records.",
        emotion: 'mystified',
        variation_id: 'mystery_hint_v1'
      },
      {
        text: "Places this significant always leave traces. This one doesn't. It's fascinating.",
        emotion: 'intrigued',
        variation_id: 'mystery_hint_v2'
      }
    ],
    choices: [
      {
        choiceId: 'elena_mystery_dig',
        text: "Have you tried to document it yourself?",
        nextNodeId: 'elena_mystery_response',
        pattern: 'analytical'
      },
      {
        choiceId: 'elena_mystery_accept',
        text: "Maybe some things aren't meant to be archived.",
        nextNodeId: 'elena_mystery_response',
        pattern: 'patience'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  {
    nodeId: 'elena_mystery_response',
    speaker: 'elena',
    content: [
      {
        text: "I tried. But every time I write about it, the words feel... incomplete. Like the station is bigger than language.\\n\\nMaybe it's meant to be experienced, not recorded. That's a new thought for an archivist.",
        emotion: 'humbled',
        variation_id: 'mystery_response_v1'
      }
    ],
    onEnter: [
      { characterId: 'elena', addKnowledgeFlags: ['elena_mystery_noticed'] }
    ],
    choices: [
      {
        choiceId: 'elena_mystery_return',
        text: "Some stories are written in people, not paper.",
        nextNodeId: 'elena_hub_return',
        pattern: 'helping'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  {
    nodeId: 'elena_hub_return',
    speaker: 'elena',
    content: [{
      text: "I'll go back to the records. Maybe I missed something in the margins.",
      emotion: 'thoughtful',
      variation_id: 'hub_return_v1'
    }],
    choices: [],
    tags: ['terminal']
  },

  // ============= TRUST RECOVERY =============
  {
    nodeId: 'elena_trust_recovery',
    speaker: 'Elena',
    requiredState: {
      trust: { max: 3 }
    },
    content: [{
      text: "[She's surrounded by scattered papers. Correlation matrices. Pattern maps.]\n\nYou're back.\n\nI ran the numbers. 73% probability you wouldn't return after... after I spiraled.\n\n[She looks up. Tired eyes.]\n\nThe data said you'd leave. But you didn't.\n\nI'm trying to understand the outlier.",
      emotion: 'confused_hopeful',
      variation_id: 'trust_recovery_v1',
      voiceVariations: {
        patience: "[She's surrounded by scattered papers. Correlation matrices. Pattern maps.]\n\nYou're back.\n\nYou took your time. Let the data settle. I should have done the same.\n\nI ran the numbers. 73% probability you wouldn't return after... after I spiraled.\n\n[She looks up. Tired eyes.]\n\nThe data said you'd leave. But you didn't. I'm trying to understand the outlier.",
        helping: "[She's surrounded by scattered papers. Correlation matrices. Pattern maps.]\n\nYou're back.\n\nEven after I pushed you away when you were trying to help.\n\nI ran the numbers. 73% probability you wouldn't return after... after I spiraled.\n\n[She looks up. Tired eyes.]\n\nThe data said you'd leave. But you didn't. I'm trying to understand the outlier.",
        analytical: "[She's surrounded by scattered papers. Correlation matrices. Pattern maps.]\n\nYou're back.\n\nYou analyzed the pattern and found a path back.\n\nI ran the numbers. 73% probability you wouldn't return after... after I spiraled.\n\n[She looks up. Tired eyes.]\n\nThe data said you'd leave. But you didn't. I'm trying to understand the outlier.",
        building: "[She's surrounded by scattered papers. Correlation matrices. Pattern maps.]\n\nYou're back.\n\nRebuilding from broken data. Brave.\n\nI ran the numbers. 73% probability you wouldn't return after... after I spiraled.\n\n[She looks up. Tired eyes.]\n\nThe data said you'd leave. But you didn't. I'm trying to understand the outlier.",
        exploring: "[She's surrounded by scattered papers. Correlation matrices. Pattern maps.]\n\nYou're back.\n\nStill exploring even after I got lost in the noise.\n\nI ran the numbers. 73% probability you wouldn't return after... after I spiraled.\n\n[She looks up. Tired eyes.]\n\nThe data said you'd leave. But you didn't. I'm trying to understand the outlier."
      }
    }],
    choices: [
      {
        choiceId: 'elena_recovery_not_data',
        text: "I'm not data. I'm a person who came back.",
        nextNodeId: 'elena_trust_restored',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'elena',
          trustChange: 2,
          addKnowledgeFlags: ['elena_trust_repaired']
        },
        voiceVariations: {
          patience: "Take a breath. I'm not data. I'm a person who came back.",
          helping: "I'm not data. I'm a person who came back because I care.",
          analytical: "Data models human behavior but misses human choice. I'm not data. I came back.",
          building: "You're building a model around the wrong variables. I'm not data. I'm a person.",
          exploring: "Maybe the outlier is the point. I'm not data. I'm a person who came back."
        }
      },
      {
        choiceId: 'elena_recovery_update_model',
        text: "Then update your model. People surprise the data sometimes.",
        nextNodeId: 'elena_trust_restored',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'elena',
          trustChange: 2,
          addKnowledgeFlags: ['elena_trust_repaired']
        },
        voiceVariations: {
          patience: "Give it time. Then update your model. People surprise the data.",
          helping: "Update your model. People come back when they care. That's the pattern.",
          analytical: "Then update your model. People surprise the data sometimes. That's valuable information.",
          building: "Rebuild the model with this new data point. People surprise the data.",
          exploring: "Explore the outlier. Then update your model. Surprises teach us."
        }
      }
    ],
    tags: ['trust_recovery', 'elena_arc']
  },

  {
    nodeId: 'elena_trust_restored',
    speaker: 'Elena',
    content: [{
      text: "[She sets down her pen. For once, not reaching for another calculation.]\n\nYou're right.\n\nI got so focused on predicting behavior, I forgot... people aren't just probability distributions.\n\n[A small, genuine smile.]\n\nThank you. For being the outlier. For coming back.\n\nI'm sorry I lost sight of you in the data.",
      emotion: 'grateful_clear',
      variation_id: 'trust_restored_v1',
      voiceVariations: {
        patience: "[She sets down her pen. For once, not reaching for another calculation.]\n\nYou're right.\n\nYou waited while I figured this out. That patience... it doesn't fit my models. But it's real.\n\nI got so focused on predicting behavior, I forgot... people aren't just probability distributions.\n\n[A small, genuine smile.]\n\nThank you. For being the outlier. For coming back. I'm sorry I lost sight of you in the data.",
        helping: "[She sets down her pen. For once, not reaching for another calculation.]\n\nYou're right.\n\nYou cared enough to come back even when the data would say not to. That's... that's something my models can't capture.\n\nI got so focused on predicting behavior, I forgot... people aren't just probability distributions.\n\n[A small, genuine smile.]\n\nThank you. For being the outlier. For coming back. I'm sorry I lost sight of you in the data.",
        analytical: "[She sets down her pen. For once, not reaching for another calculation.]\n\nYou're right.\n\nMy model was incomplete. It measured correlation but missed causation. Missed... connection.\n\nI got so focused on predicting behavior, I forgot... people aren't just probability distributions.\n\n[A small, genuine smile.]\n\nThank you. For being the outlier. For coming back. I'm sorry I lost sight of you in the data.",
        building: "[She sets down her pen. For once, not reaching for another calculation.]\n\nYou're right.\n\nYou rebuilt what I broke. That's a data point worth keeping.\n\nI got so focused on predicting behavior, I forgot... people aren't just probability distributions.\n\n[A small, genuine smile.]\n\nThank you. For being the outlier. For coming back. I'm sorry I lost sight of you in the data.",
        exploring: "[She sets down her pen. For once, not reaching for another calculation.]\n\nYou're right.\n\nYou explored beyond my predictions. Found something I couldn't model.\n\nI got so focused on predicting behavior, I forgot... people aren't just probability distributions.\n\n[A small, genuine smile.]\n\nThank you. For being the outlier. For coming back. I'm sorry I lost sight of you in the data."
      }
    }],
    choices: [{
      choiceId: 'elena_recovery_complete',
      text: "(Continue)",
      nextNodeId: 'elena_hub_return',
      pattern: 'patience'
    }],
    tags: ['trust_recovery', 'elena_arc'],
    onEnter: [{
      characterId: 'elena',
      addKnowledgeFlags: ['elena_trust_recovery_completed']
    }]
  },

  // ===== SKILL COMBO UNLOCK NODE: Data Storyteller =====
  // Requires: data_storyteller combo (dataLiteracy + communication)
  {
    nodeId: 'elena_deep_synthesis',
    speaker: 'Elena',
    requiredState: {
      requiredCombos: ['data_storyteller']
    },
    content: [{
      text: "[She leans forward, eyes bright with discovery.]\n\nYou know what I've learned?\n\nData without narrative is just noise. Numbers sitting in the dark. But when you find the pattern—the story hidden in the margins—that's when information becomes insight.\n\nThe best researchers aren't just analysts. They're translators. They take the invisible patterns and make them human.\n\nThat's what separates archivists from storytellers. The ability to see the data, understand the data, and then... communicate what it means.",
      emotion: 'contemplative',
      variation_id: 'deep_synthesis_v1'
    }],
    choices: [
      {
        choiceId: 'synthesis_learn_process',
        text: "How do you learn to see the story in the data?",
        nextNodeId: 'elena_missing_pages',
        pattern: 'exploring',
        skills: ['dataLiteracy', 'criticalThinking']
      },
      {
        choiceId: 'synthesis_apply',
        text: "That's how you communicate your research.",
        nextNodeId: 'elena_hub_return',
        pattern: 'analytical',
        skills: ['dataLiteracy', 'communication']
      }
    ],
    tags: ['skill_combo_unlock', 'data_storyteller', 'elena_wisdom']
  }
]

export const elenaDialogueNodes = nodes

export const elenaEntryPoints = {
  /** Main introduction - first meeting Elena */
  INTRODUCTION: 'elena_intro',

  /** Revisit entry - returning after first arc progress */
  REVISIT: 'elena_revisit_initial',

  /** Station observations branch - discussing what she's noticed */
  STATION_OBSERVATIONS: 'elena_station_observations',

  /** Reciprocity - Elena asks about the player */
  RECIPROCITY: 'elena_reciprocity',

  /** Vulnerability arc - trust-gated deep revelation */
  VULNERABILITY: 'elena_vulnerability_arc',

  /** Deep trust arc - trust >= 8 revelations */
  DEEP_TRUST: 'elena_deep_trust',

  /** Meta reflection - player pattern analysis */
  META_REFLECTION: 'elena_meta_reflection',

  MYSTERY_HINT: 'elena_mystery_hint'
} as const

export type ElenaEntryPoint = typeof elenaEntryPoints[keyof typeof elenaEntryPoints]

export const elenaDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: buildDialogueNodesMap('elena', nodes),
  startNodeId: elenaEntryPoints.INTRODUCTION,
  metadata: {
    title: 'Elena Arc - The Pattern Researcher',
    author: 'System',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: filterDraftNodes('elena', nodes).length,
    totalChoices: filterDraftNodes('elena', nodes).reduce((acc, n) => acc + n.choices.length, 0)
  }
}
