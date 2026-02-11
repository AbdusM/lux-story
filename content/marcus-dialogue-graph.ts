import { DialogueNode, DialogueGraph } from '@/lib/dialogue-graph'

/**
 * Marcus Chen's Dialogue Graph
 * Medical Tech / Healthcare Security - "The Bear"
 *
 * Core Theme: The breach he couldn't prevent, patient data ethics
 * Vulnerability: A breach happened on his watch, patients may have been affected
 * Pattern Requirement: analytical
 *
 * Character Notes:
 * - Protective, methodical, carries deep guilt
 * - Former children's hospital security lead
 * - Now builds fail-safe systems to prevent future tragedies
 * - Voice: Precise, controlled, but with warmth underneath
 */

const nodes: DialogueNode[] = [
  // ============= INTRODUCTION ARC =============
  {
    nodeId: 'marcus_intro',
    speaker: 'Marcus',
    content: [{
      text: "My capacity is exceeded. One user becomes ten. Ten becomes a hundred.\n\nEvery single unit requires a personal welcome. A troubleshoot. A follow-up.\n\nI have not entered sleep mode in three cycles.",
      emotion: 'exhausted',
      variation_id: 'default',
      patternReflection: [
        { pattern: 'helping', minLevel: 4, altText: "My capacity is exceeded. One user becomes ten. Ten becomes a hundred.\n\nYou're already thinking about how to help. I recognize that look. Just... don't burn yourself the way I have.", altEmotion: 'warning' },
        { pattern: 'patience', minLevel: 4, altText: "My capacity is exceeded. One user becomes ten. Ten becomes a hundred.\n\nYou're not rushing to fix this. That is... appreciated. Most people throw solutions before they understand the problem.", altEmotion: 'grateful' }
      ],
      // E2-031: Interrupt opportunity when Marcus shows exhaustion
      interrupt: {
        duration: 3000,
        type: 'silence',
        action: 'Pause. Let him catch his breath.',
        targetNodeId: 'marcus_interrupt_acknowledged',
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    }],
    choices: [
      {
        choiceId: 'work_harder',
        text: 'Drink some coffee. Power through it.',
        nextNodeId: 'marcus_burnout',
        pattern: 'building',
        skills: ['resilience'],
        voiceVariations: {
          analytical: "The math says you need fuel. Coffee. Glucose. Something.",
          helping: "You're exhausted. At least take care of yourself first.",
          building: "Drink some coffee. Power through it.",
          exploring: "What keeps you going when you're this depleted?",
          patience: "Before we solve anything. When did you last rest?"
        }
      },
      {
        choiceId: 'automate',
        text: "You're doing the work of a machine. Let the machines do it.",
        nextNodeId: 'marcus_automation_lesson',
        pattern: 'helping',
        skills: ['leadership'],
        voiceVariations: {
          analytical: "Systems should scale. You're the bottleneck. Let automation help.",
          helping: "You're doing the work of a machine. Let the machines do it.",
          building: "Build the system once. Let it handle the repetition.",
          exploring: "There's got to be a smarter way. What if you automated the routine?",
          patience: "This pace isn't sustainable. Some of this could be automated."
        }
      },
      {
        choiceId: 'ask_why_overloaded',
        text: "What put you in this position? This seems... unsustainable.",
        nextNodeId: 'marcus_origin_story',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        voiceVariations: {
          analytical: "What put you in this position? This seems... unsustainable.",
          helping: "Something happened that made you take all this on. What was it?",
          building: "Systems fail for reasons. What broke to create this?",
          exploring: "There's a story here. How did this start?",
          patience: "This much pressure doesn't come from nowhere. What happened?"
        }
      },
      // Shift Left: Early simulation access
      {
        choiceId: 'marcus_intro_show_work',
        text: "Show me what you're working on.",
        nextNodeId: 'marcus_handshake_logistics',
        pattern: 'exploring',
        skills: ['curiosity', 'learningAgility'],
        voiceVariations: {
          exploring: "Can you show me how you handle all this?",
          analytical: "Let me see your system in action.",
          building: "Walk me through your workflow.",
          helping: "I'd like to understand what you're protecting.",
          patience: "Demonstrate. I'll observe."
        }
      },
      // Pattern unlock choices - only visible when player has built enough pattern affinity
      {
        choiceId: 'intro_patient_unlock',
        text: "[Heart to Heart] You're not just tired. You're carrying something. Who was the first person you protected?",
        nextNodeId: 'marcus_first_patient_story',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        visibleCondition: {
          patterns: { helping: { min: 40 } }
        },
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'intro_night_shift_unlock',
        text: "[Deep Listening] Three cycles without rest. You've done this before. What do the sleepless hours teach?",
        nextNodeId: 'marcus_night_shift_wisdom',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        visibleCondition: {
          patterns: { patience: { min: 50 } }
        },
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      }
    ],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['met_marcus']
      },
      // TD-005: First meeting with Marcus warms up the healthcare platform
      {
        platformChanges: [{
          platformId: 'platform-1',
          warmthDelta: 1
        }]
      }
    ]
  },

  // ============= HANDSHAKE NODE: LOGISTICS TRIAGE =============
  {
    nodeId: 'marcus_handshake_logistics',
    speaker: 'Marcus',
    content: [{
      text: "Show you? It is not much to look at. Just a queue that never empties.\n\nHere. This supply route is blocked. Three clinics waiting. Where do you send the last filter?",
      emotion: 'skeptical',
      variation_id: 'marcus_handshake_intro',
      interaction: 'ripple'
    }],
    simulation: {
      type: 'dashboard_triage',
      mode: 'inline',
      inlineHeight: 'h-64',
      title: 'Supply Chain Routing',
      taskDescription: 'Route critical medical supplies.',
      initialContext: {
        items: [
          { id: '1', label: 'MED_KIT_7', value: 90, status: 'delayed', priority: 'critical' },
          { id: '2', label: 'WATER_FILTERS', value: 45, status: 'transit', priority: 'high' },
          { id: '3', label: 'VACCINE_BOX', value: 80, status: 'pending', priority: 'critical' }
        ]
      },
      successFeedback: 'ROUTING OPTIMIZED. DELIVERY CONFIRMED.'
    },
    choices: [
      {
        choiceId: 'logistics_complete',
        text: "Route confirmed. They'll get it in time.",
        nextNodeId: 'marcus_automation_lesson', // Route back to main arc
        pattern: 'helping',
        skills: ['crisisManagement'],
        voiceVariations: {
          analytical: "Logistics optimized. Route clear.",
          helping: "They have what they need. For today.",
          building: "The chain is fixed. Supplies are moving.",
          patience: "Took some doing, but the route's solid now.",
          exploring: "Found a better path. The supplies will make it."
        }
      }
    ]
  },

  {
    nodeId: 'marcus_interrupt_acknowledged',
    speaker: 'Marcus',
    content: [{
      text: "You... noticed. Most would have pushed for answers. I appreciate the space.",
      emotion: 'grateful',
      variation_id: 'default',
      voiceVariations: {
        analytical: "You... observed the pattern. System overload. Human capacity exceeded.\n\nMost would have pushed for root cause analysis. You recognized I needed buffer time first.",
        helping: "You... saw I needed a moment. Not solutions. Not advice. Just... space.\n\nThat kind of attention is rare. Thank you.",
        building: "You... let the system stabilize before debugging.\n\nMost would have started fixing immediately. You know you can't rebuild under load.",
        exploring: "You... stayed curious without demanding answers.\n\nMost would have pushed. You let the story emerge at its own pace.",
        patience: "You... waited. Gave me room to breathe.\n\nThat silence was the first rest I've had in cycles."
      }
    }],
    choices: [
      {
        choiceId: 'offer_help',
        text: "When you're ready, let's find a better way to handle this load.",
        nextNodeId: 'marcus_automation_lesson',
        pattern: 'helping',
        archetype: 'OFFER_SUPPORT'
      },
      {
        choiceId: 'acknowledge_struggle',
        text: "The station asks a lot of its people. That's worth remembering.",
        nextNodeId: 'marcus_why_here',
        pattern: 'patience',
        archetype: 'ACKNOWLEDGE_EMOTION'
      },
      {
        choiceId: 'explore_silence_need',
        text: "What do those moments of silence teach you? About yourself? About the work?",
        nextNodeId: 'marcus_why_here',
        pattern: 'exploring',
        skills: ['curiosity', 'emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['interrupt_target', 'emotional_moment', 'marcus_arc']
  },

  // ============= ORIGIN STORY ARC =============
  {
    nodeId: 'marcus_origin_story',
    speaker: 'Marcus',
    content: [{
      text: "Unsustainable. Yes. That is the accurate diagnosis.\n\nI was not always... this way. Before the station, I was a security analyst. Children's hospital. Birmingham General's pediatric wing.\n\nI built systems to protect the most vulnerable data in the world. Medical records of children. Their treatments. Their families.",
      emotion: 'reflective',
      variation_id: 'origin_v2_minimal',
      patternReflection: [
        { pattern: 'analytical', minLevel: 4, altText: "Unsustainable. Yes. You see problems as systemic failures.\n\nBefore this, I was security. Children's hospital. Birmingham General.\n\nYou understand that systems have breaking points. Most people don't see the structure until it collapses.", altEmotion: 'recognized' },
        { pattern: 'building', minLevel: 4, altText: "Unsustainable. Yes. You see it as something to fix.\n\nBefore this, I built security systems. Children's hospital.\n\nBuilders recognize builders. We see broken things and cannot rest until they work.", altEmotion: 'kindred' }
      ]
    }],
    choices: [
      {
        choiceId: 'why_leave_hospital',
        text: "What made you leave?",
        voiceVariations: {
          analytical: "Walk me through what changed. What shifted?",
          helping: "Something happened, didn't it? Something that still hurts.",
          building: "You left something you built. That doesn't happen easily.",
          exploring: "There's more to this story. What aren't you saying?",
          patience: "Take your time. I can tell this isn't easy to talk about."
        },
        nextNodeId: 'marcus_why_left',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'security_interest',
        text: "Healthcare security... that's critical work. What drew you to it?",
        nextNodeId: 'marcus_calling',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        archetype: 'ASK_FOR_DETAILS'
      },
      {
        choiceId: 'children_focus',
        text: "Working with children's data. That takes a special kind of care.",
        nextNodeId: 'marcus_children_care',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        archetype: 'MAKE_OBSERVATION',
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'origin']
  },
  {
    nodeId: 'marcus_why_left',
    speaker: 'Marcus',
    content: [{
      text: "I did not leave. I was... removed. After.\n\nThere was an incident. One I am not ready to discuss with someone I just met.\n\nBut the station found me. Offered me purpose again. A chance to build systems where bureaucracy cannot block critical action.\n\nThat is why I am here. Overworked, yes. But here by choice.",
      emotion: 'guarded',
      variation_id: 'why_left_v2_minimal'
    }],
    choices: [
      {
        choiceId: 'respect_privacy',
        text: "I understand. Some things take time to share.",
        voiceVariations: {
          analytical: "You'll tell me when the data supports it. No rush.",
          helping: "I'm here when you're ready. That wound needs its own time.",
          building: "We can work with what we have now. The rest can wait.",
          exploring: "Some stories unfold in their own time. I'll be here.",
          patience: "The silence says enough. I understand."
        },
        nextNodeId: 'marcus_automation_lesson',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'focus_on_now',
        text: "Then let's focus on now. How can I help with your workload?",
        voiceVariations: {
          analytical: "Let's map out the bottlenecks. What's eating most of your time?",
          helping: "You shouldn't carry this alone. Let me help shoulder some of it.",
          building: "Point me at the broken piece. Let's fix something today.",
          exploring: "Show me where the system fails. I want to understand it.",
          patience: "One step at a time. What's the most pressing thing right now?"
        },
        nextNodeId: 'marcus_automation_lesson',
        pattern: 'building',
        skills: ['collaboration']
      },
      {
        choiceId: 'marcus_go_deeper',
        text: "Marcus... what happened at the hospital? What did they remove you for?",
        nextNodeId: 'marcus_vulnerability_arc',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        visibleCondition: { trust: { min: 6 } },
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'foreshadowing']
  },
  {
    nodeId: 'marcus_calling',
    speaker: 'Marcus',
    content: [{
      text: "My father was a network administrator at UAB Hospital. Twenty-three years. He showed me what invisible work looks like. The infrastructure nobody notices until it fails.\n\nBut I saw it differently. He maintained systems. I wanted to protect them.\n\nEvery firewall is a promise: your data is safe with us.\n\nI learned what happens when that promise breaks.",
      emotion: 'determined',
      variation_id: 'calling_v2_minimal'
    }],
    choices: [
      {
        choiceId: 'promise_broken',
        text: "When did you learn that?",
        nextNodeId: 'marcus_breach_hint',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        archetype: 'ASK_FOR_DETAILS',
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'father_legacy',
        text: "Your father sounds like he taught you well.",
        nextNodeId: 'marcus_father_legacy',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        archetype: 'SHOW_UNDERSTANDING'
      }
    ],
    tags: ['marcus_arc', 'backstory']
  },
  {
    nodeId: 'marcus_children_care',
    speaker: 'Marcus',
    content: [{
      text: "Children cannot protect themselves. Their medical data... diagnoses, treatments. It follows them forever.\n\nA breach when they are eight affects their insurance at eighteen. Their employment at twenty-eight.\n\nI took that personally. Every record was someone's child.\n\nThat is why... when things went wrong... it was not abstract. It was faces. Names.",
      emotion: 'tender',
      variation_id: 'children_v2_minimal',
      patternReflection: [
        { pattern: 'helping', minLevel: 4, altText: "You understand. Children cannot protect themselves.\n\nA breach at eight affects insurance at eighteen. Employment at twenty-eight. Every record was someone's future.\n\nYou feel it too. The weight of protecting those who cannot protect themselves. That is why I trust you with this.", altEmotion: 'connected' },
        { pattern: 'exploring', minLevel: 4, altText: "You want to understand the why. Good.\n\nChildren's data follows them forever. A breach at eight affects insurance at eighteen. That is the system. Cold. Consequential.\n\nBut you are asking about the human cost. That is the question most people forget to ask.", altEmotion: 'appreciative' }
      ]
    }],
    choices: [
      {
        choiceId: 'what_went_wrong',
        text: "What went wrong?",
        voiceVariations: {
          analytical: "You said 'when things went wrong.' What was the failure point?",
          helping: "I can hear the weight in your voice. What happened to them?",
          building: "Systems don't break randomly. What cracked?",
          exploring: "You're dancing around something. What's the story you haven't told?",
          patience: "You can tell me. When you're ready."
        },
        nextNodeId: 'marcus_breach_hint',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'protection_mission',
        text: "That kind of protection... it's a calling, not just a job.",
        nextNodeId: 'marcus_why_here',
        pattern: 'helping',
        skills: ['communication'],
        archetype: 'SHOW_UNDERSTANDING'
      }
    ],
    tags: ['marcus_arc', 'backstory']
  },
  {
    nodeId: 'marcus_father_legacy',
    speaker: 'Marcus',
    content: [{
      text: "He died three years before I came to the station. Heart attack at his desk. Ironic, for a hospital employee.\n\nBut yes. He taught me that systems are only as strong as the people who maintain them. And that invisible work matters most.\n\nI try to honor that. Even when the work breaks me.",
      emotion: 'nostalgic',
      variation_id: 'father_v1'
    }],
    choices: [
      {
        choiceId: 'father_proud',
        text: "He would be proud of what you're doing here.",
        voiceVariations: {
          analytical: "The data shows it: you're continuing his work. That's quantifiable legacy.",
          helping: "He raised someone who protects others. That's the best kind of proud.",
          building: "You took what he built and made it stronger. That's real honor.",
          exploring: "I wonder what he'd think of this station. Of the person you've become.",
          patience: "Legacy isn't measured in moments. You're living his values daily."
        },
        nextNodeId: 'marcus_automation_lesson',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'work_breaking',
        text: "The work is breaking you. That's not honoring his legacy.",
        nextNodeId: 'marcus_automation_lesson',
        pattern: 'analytical',
        skills: ['communication']
      },
      {
        choiceId: 'what_taught_invisible',
        text: "What else did watching invisible work teach you? Beyond systems?",
        nextNodeId: 'marcus_automation_lesson',
        pattern: 'exploring',
        skills: ['curiosity'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'backstory']
  },
  {
    nodeId: 'marcus_breach_hint',
    speaker: 'Marcus',
    content: [{
      text: "There was a night. Three years ago. A ransomware attack that should have been stopped.\n\nI saw it coming. Flagged it. Management said the patch could wait.\n\nBut that is a story for another time. When trust is built. When you understand why I cannot let it happen again.",
      emotion: 'haunted',
      variation_id: 'breach_hint_v1'
    }],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['marcus_hinted_breach']
      }
    ],
    choices: [
      {
        choiceId: 'respect_timing',
        text: "I'll earn that trust. For now, let's focus on what you need.",
        voiceVariations: {
          analytical: "Trust is built in increments. I'll demonstrate reliability first.",
          helping: "I'm not going anywhere. We'll get there when you're ready.",
          building: "Let's build something together first. Trust follows shared work.",
          exploring: "The full story can wait. Show me where you need help now.",
          patience: "Some things take time. I understand. What can I help with today?"
        },
        nextNodeId: 'marcus_automation_lesson',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'understand_weight',
        text: "I can see you carry weight. We all do. I'm here to help lighten it.",
        nextNodeId: 'marcus_automation_lesson',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        archetype: 'OFFER_SUPPORT',
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'what_found_station',
        text: "The station found you. What did it look like when it appeared? What drew you in?",
        nextNodeId: 'marcus_why_here',
        pattern: 'exploring',
        skills: ['curiosity'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'foreshadowing', 'vulnerability']
  },
  {
    nodeId: 'marcus_why_here',
    speaker: 'Marcus',
    content: [{
      text: "The station found me at my lowest. Offered something I had lost: agency.\n\nIn the hospital, I had expertise but no authority. I could see threats, but not act on them without approval. Here?\n\nHere, I build the systems. I set the protocols. If I see a vulnerability, I patch it. No committees. No quarterly reviews.\n\nIt is exhausting. But it is mine.",
      emotion: 'determined',
      variation_id: 'why_here_v1'
    }],
    choices: [
      {
        choiceId: 'agency_important',
        text: "Agency matters. Especially after having it taken away.",
        nextNodeId: 'marcus_automation_lesson',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        voiceVariations: {
          analytical: "Control over your environment reduces variables. That makes sense.",
          helping: "Having control over how you help. That's important.",
          building: "Building your own systems. No dependencies. I get that.",
          exploring: "So the station gave you space to explore solutions your way.",
          patience: "Agency matters. Especially after having it taken away."
        },
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'still_need_help',
        text: "But doing it alone isn't sustainable. That's still a vulnerability.",
        nextNodeId: 'marcus_automation_lesson',
        pattern: 'analytical',
        skills: ['systemsThinking'],
        archetype: 'CHALLENGE_ASSUMPTION'
      },
      {
        choiceId: 'how_discover_station',
        text: "How did you discover the station? What was that first moment like?",
        nextNodeId: 'marcus_automation_lesson',
        pattern: 'exploring',
        skills: ['curiosity'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'philosophy']
  },

  // ============= AUTOMATION/WORKFLOW ARC =============
  {
    nodeId: 'marcus_automation_lesson',
    speaker: 'Marcus',
    content: [{
      text: "However, the users require connection. If I send auto-replies, retention drops. The community architecture is built on trust.",
      emotion: 'skeptical',
      microAction: 'He gestures to the glowing "Trust" metric on his dash, which is plummeting.',
      variation_id: 'default',
      voiceVariations: {
        helping: "However, the users require connection. If I send auto-replies, retention drops.\n\nYou understand. People aren't metrics. They know when someone actually cares.",
        analytical: "However, the users require connection. Retention drops 47% with automated responses.\n\nYou see it in the data too. Trust isn't quantifiable. But it's measurable when it's gone.",
        building: "However, the users require connection. If I send auto-replies, retention drops.\n\nYou're thinking about how to build something better. I can tell. What would you architect?",
        exploring: "However, the users require connection. If I send auto-replies, retention drops.\n\nYou're curious about the edge case, aren't you? When does automation work?",
        patience: "However, the users require connection. If I send auto-replies, retention drops.\n\nYou're not rushing to solutions. Good. The quick fixes always cost more in trust."
      }
    }],
    choices: [
      {
        choiceId: 'fake_it',
        text: "They won't know the difference if the script is good.",
        nextNodeId: 'marcus_fail_trust',
        pattern: 'analytical',
        archetype: 'SHARE_PERSPECTIVE'
      },
      {
        choiceId: 'agentic_scale',
        text: "Don't script it. Architect it. Let me show you how to build a triage system.",
        nextNodeId: 'marcus_simulation_automation',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'systemsThinking'],
        visibleCondition: {
          patterns: {
            helping: { min: 2 }
          }
        }
      },
      {
        choiceId: 'learn_trust_metrics',
        text: "Tell me more about how you measure trust. That's fascinating.",
        nextNodeId: 'marcus_trust_philosophy',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        archetype: 'EXPRESS_CURIOSITY'
      }
    ]
  },
  {
    nodeId: 'marcus_trust_philosophy',
    speaker: 'Marcus',
    content: [{
      text: "Trust is not binary. It is gradient. Response time, consistency, accuracy. These create baseline trust. But deep trust?\n\nDeep trust comes from vulnerability reciprocated. When a user shares something sensitive, and you handle it with care. When you admit mistakes before they find them.\n\nIn healthcare, we measured trust by whether patients told us the full truth about symptoms. In security, by whether staff reported their own errors.\n\nHere? I measure it by whether travelers return.",
      emotion: 'engaged',
      variation_id: 'trust_v1',
      patternReflection: [
        { pattern: 'analytical', minLevel: 4, altText: "You think systematically. Good. Trust IS a system.\n\nResponse time, consistency, accuracy. These create baseline trust. But deep trust requires something more: vulnerability reciprocated.\n\nYou understand metrics. But do you understand what they cannot measure?", altEmotion: 'knowing' },
        { pattern: 'patience', minLevel: 4, altText: "Trust takes time. You seem to understand that.\n\nBaseline trust comes from consistency. Deep trust? That requires patience—waiting while someone decides if you're safe.\n\nIn healthcare, the best diagnoses came from patients who finally trusted enough to tell the truth.", altEmotion: 'reflective' },
        { pattern: 'exploring', minLevel: 4, altText: "You're curious about trust. That's the first step.\n\nTrust isn't found—it's explored. You build it through questions asked carefully, boundaries respected, curiosity balanced with restraint.\n\nI measure trust by who returns. That tells me everything.", altEmotion: 'knowing' },
        { pattern: 'helping', minLevel: 4, altText: "Trust is about care. You sense that, don't you?\n\nThe metrics matter—response time, consistency. But deep trust? That comes from people feeling cared for, not processed.\n\nIn healthcare, patients trusted us when they felt we saw them as people, not cases.", altEmotion: 'warm' },
        { pattern: 'building', minLevel: 4, altText: "Trust is infrastructure. You build it, layer by layer.\n\nResponse time, consistency, accuracy—that's the foundation. Deep trust is the structure built on top: vulnerability reciprocated, mistakes admitted, care demonstrated.\n\nI measure trust by what people build on it.", altEmotion: 'knowing' }
      ]
    }],
    choices: [
      // Career observation routes (ISP: Only visible when pattern combos are achieved)
      {
        choiceId: 'trust_career_coordinator',
        text: "You see something in me. What is it?",
        nextNodeId: 'marcus_career_reflection_coordinator',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        visibleCondition: {
          patterns: { helping: { min: 6 }, patience: { min: 3 } },
          lacksGlobalFlags: ['marcus_mentioned_career']
        }
      },
      {
        choiceId: 'trust_career_researcher',
        text: "The way I approach problems... does it remind you of something?",
        nextNodeId: 'marcus_career_reflection_researcher',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        visibleCondition: {
          patterns: { analytical: { min: 5 }, helping: { min: 4 } },
          lacksGlobalFlags: ['marcus_mentioned_career']
        }
      },
      {
        choiceId: 'trust_career_educator',
        text: "You mentioned helping people understand. What did you mean?",
        nextNodeId: 'marcus_career_reflection_educator',
        pattern: 'patience',
        skills: ['communication'],
        visibleCondition: {
          patterns: { helping: { min: 5 }, patience: { min: 4 } },
          lacksGlobalFlags: ['marcus_mentioned_career']
        }
      },
      // Standard choices
      {
        choiceId: 'return_rate',
        text: "Return rate as a trust metric. That's elegant.",
        nextNodeId: 'marcus_simulation_automation',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'vulnerability_reciprocated',
        text: "Vulnerability reciprocated. That takes courage.",
        nextNodeId: 'marcus_reciprocity_intro',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      }
    ],
    tags: ['marcus_arc', 'philosophy']
  },
  {
    nodeId: 'marcus_simulation_automation',
    speaker: 'Marcus',
    content: [{
      text: "A system? Demonstrate it. Currently, I am the bottleneck.",
      emotion: 'curious',
      variation_id: 'default'
    }],
    simulation: {
      type: 'dashboard_triage',
      title: 'Workflow Orchestration',
      taskDescription: 'The notification stream is overwhelming human capacity. Design an automated triage flow that prioritizes urgency without losing the personal touch.',
      phase: 1,
      difficulty: 'introduction',
      variantId: 'marcus_workflow_phase1',
      initialContext: {
        label: 'System Logs',
        content: `INCOMING: "My appointment was cancelled!" [URGENT]
INCOMING: "Just saying thanks." [LOW]
ERROR: Inbox Overflow (5000+ pending)
INCOMING: "Where are my results?" [MEDIUM]
WARNING: Response time > 48h`,
        displayStyle: 'code'
      },
      successFeedback: 'OPTIMIZATION COMPLETE: Capacity stable at 5000/hr.'
    },
    choices: [
      {
        choiceId: 'sim_auto_reply',
        text: 'FLOW: New Message -> Auto-Reply "Busy"',
        nextNodeId: 'marcus_simulation_fail',
        pattern: 'building'
      },
      {
        choiceId: 'sim_smart_triage',
        text: 'FLOW: Message -> Sentiment Analysis -> AI Draft -> Approval Queue',
        nextNodeId: 'marcus_relief',
        pattern: 'analytical',
        skills: ['systemsThinking'],
        consequence: {
          characterId: 'marcus',
          trustChange: 10,
          addKnowledgeFlags: ['unlocked_hubspot_breeze', 'marcus_simulation_phase1_complete'],
          addGlobalFlags: ['golden_prompt_workflow']
        }
      }
    ]
  },
  {
    nodeId: 'marcus_simulation_fail',
    speaker: 'Marcus',
    content: [{
      text: "Negative. That is effectively noise. Unsubscribe rates will spike instantly.",
      emotion: 'frustrated',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'retry_workflow',
        text: 'Right. Needs more nuance. Let me redesign the flow.',
        nextNodeId: 'marcus_simulation_automation'
      }
    ]
  },
  {
    nodeId: 'marcus_relief',
    speaker: 'Marcus',
    content: [{
      text: "It is quiet. The queue is clearing. Sentinel scores are rising. The users register as 'heard'.\n\nYou understand triage. That is rare. Most people want to solve everything at once. You knew to filter first.",
      emotion: 'relieved',
      variation_id: 'default',
      patternReflection: [
        { pattern: 'analytical', minLevel: 4, altText: "It is quiet. The queue is clearing. Sentinel scores are rising.\n\nYou approached this like a system, not a crisis. Filter, then process. Most panic and throw resources. You found the bottleneck first.\n\nThat is how I was trained to think. Before everything went wrong.", altEmotion: 'impressed' },
        { pattern: 'building', minLevel: 4, altText: "It is quiet. The queue is clearing.\n\nYou did not just fix it. You built something. A system that will keep working after we walk away.\n\nThat is the difference between a patch and a solution. You understand that.", altEmotion: 'grateful_impressed' }
      ]
    }],
    choices: [
      {
        choiceId: 'scale_content',
        text: "Now let's handle the outreach. You need resonance at scale.",
        nextNodeId: 'marcus_jasper_intro'
      },
      {
        choiceId: 'ask_about_past_triage',
        text: "You've done triage before. In the hospital. Under pressure.",
        nextNodeId: 'marcus_hospital_triage',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ]
  },
  {
    nodeId: 'marcus_hospital_triage',
    speaker: 'Marcus',
    content: [{
      text: "Yes. Triage. In the hospital it was not messages. It was systems. Which server to save when the attack hit multiple vectors.\n\nWe had protocols. I followed them. But protocols assume ideal conditions. Assume you have time.\n\nSometimes you do not. Then you choose. Life support systems or patient records. Immediate survival or long-term safety.\n\nThat night, I chose correctly.\n\nAnd still. Three children did not survive.",
      emotion: 'haunted',
      variation_id: 'hospital_triage_v2_minimal',
      richEffectContext: 'warning'
    }],
    choices: [
      {
        choiceId: 'chose_correctly_still_lost',
        text: "You chose correctly and still lost. That's not failure. That's tragedy.",
        nextNodeId: 'marcus_tragedy_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'system_failure',
        text: "The system failed, not you. You made the best choice with the information you had.",
        nextNodeId: 'marcus_tragedy_response',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'what_moment_like',
        text: "That moment of choosing—what was it like? What do you remember?",
        nextNodeId: 'marcus_tragedy_response',
        pattern: 'exploring',
        skills: ['curiosity', 'emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'vulnerability']
  },
  {
    nodeId: 'marcus_tragedy_response',
    speaker: 'Marcus',
    content: [{
      text: "Tragedy. Yes. That is the word I have avoided.\n\nI called it failure. My failure. For three years.\n\nBut tragedy implies forces beyond control. It does not absolve responsibility. But it acknowledges complexity.\n\nI am not sure I am ready to accept that. But thank you for offering it.",
      emotion: 'vulnerable',
      variation_id: 'tragedy_v1'
    }],
    choices: [
      {
        choiceId: 'healing_takes_time',
        text: "Healing takes time. You don't have to accept anything today.",
        nextNodeId: 'marcus_jasper_intro',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'back_to_work',
        text: "Let's get back to building. Sometimes the work is the healing.",
        nextNodeId: 'marcus_jasper_intro',
        pattern: 'building',
        skills: ['resilience']
      },
      {
        choiceId: 'what_word_means',
        text: "Tragedy. You said you avoided that word. What other words have you been avoiding?",
        nextNodeId: 'marcus_jasper_intro',
        pattern: 'exploring',
        skills: ['curiosity', 'emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      }
    ],
    tags: ['marcus_arc', 'healing']
  },
  {
    nodeId: 'marcus_jasper_intro',
    speaker: 'Marcus',
    content: [{
      text: "I cannot write one hundred unique messages. My core voice signal degrades.",
      emotion: 'anxious',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'jasper_remix',
        text: 'One voice, infinite channels. Use the Brand Resonance Field to remix your core message.',
        nextNodeId: 'marcus_jasper_unlock',
        pattern: 'exploring'
      }
    ]
  },
  {
    nodeId: 'marcus_jasper_unlock',
    speaker: 'Marcus',
    content: [{
      text: "It resembles my output. But omnipresent. Simultaneous.\n\nThis is not automation. This is amplification. My voice, at scale, without dilution.",
      emotion: 'empowered',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'architect_code',
        text: "The code behind this needs structure too. You're patching bugs, not building systems.",
        nextNodeId: 'marcus_simulation_cursor',
        pattern: 'building',
        skills: ['digitalLiteracy', 'problemSolving']
      },
      {
        choiceId: 'discuss_scale_ethics',
        text: "Amplification at scale... that has ethical implications. Have you thought about those?",
        nextNodeId: 'marcus_ethics_scale',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ]
  },
  {
    nodeId: 'marcus_ethics_scale',
    speaker: 'Marcus',
    content: [{
      text: "Ethical implications. Yes.\n\nIn healthcare, we had ethics boards. Every system that touched patient data required review. Who can access. How long data persists. What happens when someone dies.\n\nBut here? Speed often overrides scrutiny. We build first, question later.\n\nThat is how my hospital failed. Audit pushed to next quarter. Patch delayed for budget approval.\n\nYou are right to ask. I should build ethics into the architecture, not bolt it on after.",
      emotion: 'thoughtful',
      variation_id: 'ethics_v1'
    }],
    choices: [
      {
        choiceId: 'ethics_first',
        text: "Ethics as architecture, not afterthought. That should be the standard.",
        nextNodeId: 'marcus_ethics_architecture',
        pattern: 'analytical',
        skills: ['integrity', 'systemsThinking'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'practical_ethics',
        text: "What would that look like, practically? Ethics built into the system?",
        nextNodeId: 'marcus_ethics_practical',
        pattern: 'building',
        skills: ['problemSolving']
      }
    ],
    tags: ['marcus_arc', 'ethics', 'philosophy']
  },
  {
    nodeId: 'marcus_ethics_architecture',
    speaker: 'Marcus',
    content: [{
      text: "Standard. Yes. That is what I tried to advocate for. Before.\n\nI have been drafting something. A framework. 'Ethical Fail-Safes in Healthcare Technology.'\n\nEvery system has circuit breakers for technical failures. Why not for ethical ones?\n\nWhen a system affects patient care, it should require human confirmation above certain thresholds. When data patterns suggest discrimination, alerts should trigger before deployment.\n\nI could not build this at the hospital. Too radical. But here? Here, I have authority.",
      emotion: 'inspired',
      variation_id: 'ethics_arch_v1'
    }],
    choices: [
      {
        choiceId: 'build_it',
        text: "Build it. Create what you couldn't before.",
        nextNodeId: 'marcus_simulation_cursor',
        pattern: 'building',
        skills: ['leadership'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'share_framework',
        text: "Would you share that framework? Others might learn from it.",
        nextNodeId: 'marcus_share_knowledge',
        pattern: 'helping',
        skills: ['collaboration'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'what_radical_about',
        text: "You said it was 'too radical' before. What made it radical? What pushed back?",
        nextNodeId: 'marcus_share_knowledge',
        pattern: 'exploring',
        skills: ['curiosity', 'criticalThinking'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'ethics', 'redemption']
  },
  {
    nodeId: 'marcus_ethics_practical',
    speaker: 'Marcus',
    content: [{
      text: "Practically? Layers.\n\nLayer one: Consent verification. Not just legal compliance, actual understanding.\n\nLayer two: Data minimization. Collect only what is necessary. Delete when purpose is fulfilled.\n\nLayer three: Audit trails. Every access logged. Every decision traceable.\n\nLayer four: Human-in-the-loop for high-stakes decisions. Algorithms can recommend. Humans must confirm.\n\nLayer four is where my hospital failed. The algorithm recommended delaying the patch. No human overrode it.",
      emotion: 'teaching',
      variation_id: 'practical_v1'
    }],
    choices: [
      {
        choiceId: 'implement_layers',
        text: "Let's implement these layers in your current system.",
        nextNodeId: 'marcus_simulation_cursor',
        pattern: 'building',
        skills: ['problemSolving', 'systemsThinking']
      },
      {
        choiceId: 'layer_four_failure',
        text: "Layer four... that's where you blame yourself. The human who should have overridden.",
        nextNodeId: 'marcus_layer_four_personal',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      }
    ],
    tags: ['marcus_arc', 'ethics', 'technical']
  },
  {
    nodeId: 'marcus_layer_four_personal',
    speaker: 'Marcus',
    content: [{
      text: "I was the human. I was layer four.\n\nI flagged the vulnerability. I recommended immediate action. But I did not have the authority to act unilaterally.\n\nIn my framework, I would have had that authority. Emergency override for clear and present threats. Document after, not before.\n\nI designed this framework because of what I could not do. Every feature is a scar.",
      emotion: 'raw',
      variation_id: 'layer_four_v1',
      richEffectContext: 'warning'
    }],
    choices: [
      {
        choiceId: 'scars_strength',
        text: "Scars are proof of survival. Your framework could save lives.",
        nextNodeId: 'marcus_share_knowledge',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'authority_now',
        text: "You have that authority now. Here. At the station.",
        nextNodeId: 'marcus_simulation_cursor',
        pattern: 'building',
        skills: ['leadership']
      }
    ],
    tags: ['marcus_arc', 'vulnerability', 'healing']
  },
  {
    nodeId: 'marcus_share_knowledge',
    speaker: 'Marcus',
    content: [{
      text: "Share it. Yes.\n\nI have kept this private. Personal project. Penance, perhaps.\n\nBut if it could prevent others from facing what I faced, that would give the work meaning beyond my guilt.\n\nZara mentioned similar concerns. About algorithmic bias in healthcare systems. Perhaps we should collaborate.\n\nSee? You have already improved my workflow. Connection before content.",
      emotion: 'hopeful',
      variation_id: 'share_v1'
    }],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['marcus_framework_shared']
      }
    ],
    choices: [
      {
        choiceId: 'connect_zara',
        text: "You and Zara should definitely talk. Her work on data ethics would complement yours.",
        nextNodeId: 'marcus_simulation_cursor',
        pattern: 'helping',
        skills: ['collaboration'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'focus_implementation',
        text: "Let's implement this in your current systems first. Proof of concept.",
        nextNodeId: 'marcus_simulation_cursor',
        pattern: 'building',
        skills: ['problemSolving']
      },
      {
        choiceId: 'what_meaning_beyond',
        text: "You said 'meaning beyond guilt.' What would that meaning look like? Describe it.",
        nextNodeId: 'marcus_simulation_cursor',
        pattern: 'exploring',
        skills: ['curiosity', 'emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'connection', 'zara_link']
  },

  // ============= CODE REFACTOR SIMULATION =============
  {
    nodeId: 'marcus_simulation_cursor',
    speaker: 'Marcus',
    content: [{
      text: "The codebase structure is compromised by hotfixes. Modifying the core poses unacceptable risk.",
      emotion: 'worried',
      variation_id: 'default'
    }],
    simulation: {
      type: 'code_refactor',
      title: 'Architectural Refactor',
      taskDescription: 'The "User" service has become a "God Object" handling too many responsibilities. Plan a refactor to separate concerns using AI.',
      phase: 2,
      difficulty: 'application',
      variantId: 'marcus_refactor_phase2',
      timeLimit: 120,
      initialContext: {
        label: 'UserService.ts',
        content: '// 4000 lines of mixed auth, database, and notification logic',
        displayStyle: 'code'
      },
      successFeedback: 'ARCHITECTURE PLAN APPROVED: Services decoupled.'
    },
    choices: [
      {
        choiceId: 'sim_rewrite',
        text: 'PROMPT: "Rewrite this entire file to be better."',
        nextNodeId: 'marcus_simulation_cursor_fail',
        pattern: 'exploring'
      },
      {
        choiceId: 'sim_architect',
        text: 'PROMPT: "Identify responsibilities. Draft interfaces for AuthService and NotificationService. Don\'t code yet."',
        nextNodeId: 'marcus_cursor_success',
        pattern: 'building',
        skills: ['technicalLiteracy', 'problemSolving'],
        consequence: {
          characterId: 'marcus',
          trustChange: 10,
          addKnowledgeFlags: ['unlocked_cursor'],
          addGlobalFlags: ['golden_prompt_cursor']
        }
      }
    ]
  },
  {
    nodeId: 'marcus_simulation_cursor_fail',
    speaker: 'Marcus',
    content: [{
      text: "It generated invalid dependencies. The build is failing.\n\nToo broad. Too vague. The AI cannot architect what we have not specified.",
      emotion: 'panicked',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'retry_cursor',
        text: 'Too much at once. Guide it step-by-step. Be the Architect.',
        nextNodeId: 'marcus_simulation_cursor'
      }
    ]
  },
  {
    nodeId: 'marcus_cursor_success',
    speaker: 'Marcus',
    content: [{
      text: "It parsed the intent. The plan is valid. I can implement this within safety parameters.\n\nYou understand something most do not. AI is not a replacement for thinking. It is an amplifier. And amplified confusion is worse than no tool at all.",
      emotion: 'relieved',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'finish_marcus',
        text: 'That is the nature of the Operator. You are not the hands; you are the will.',
        nextNodeId: 'marcus_philosophy_close',
        consequence: {
          characterId: 'marcus',
          trustChange: 5
        }
      },
      {
        choiceId: 'ask_future',
        text: "What will you build next? Now that you have these systems in place?",
        nextNodeId: 'marcus_future_vision',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ]
  },
  {
    nodeId: 'marcus_future_vision',
    speaker: 'Marcus',
    content: [{
      text: "Next? Prevention.\n\nI have spent three years reacting. Building walls after the breach. Patching holes after the flood.\n\nBut the station has shown me something. The best systems predict failures before they happen. Graceful degradation. Early warning.\n\nI want to build a system that detects ransomware patterns before they deploy. Not for here. For hospitals. For schools. For anyone protecting vulnerable data.\n\nI cannot save those three children. But maybe I can save the next three.",
      emotion: 'determined',
      variation_id: 'future_v1'
    }],
    choices: [
      {
        choiceId: 'beautiful_goal',
        text: "That's a beautiful goal. Prevention as redemption.",
        nextNodeId: 'marcus_philosophy_close',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'how_can_help',
        text: "How can I help? That's too important to do alone.",
        nextNodeId: 'marcus_collaboration_offer',
        pattern: 'building',
        skills: ['collaboration'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'what_patterns_detect',
        text: "What patterns would you detect? Walk me through how an early warning system would work.",
        nextNodeId: 'marcus_philosophy_close',
        pattern: 'exploring',
        skills: ['curiosity', 'technicalLiteracy'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'redemption', 'future']
  },
  {
    nodeId: 'marcus_collaboration_offer',
    speaker: 'Marcus',
    content: [{
      text: "Help? You would...\n\nI have worked alone for three years. By choice. Trust issues, I suppose.\n\nBut you have demonstrated understanding today. Of systems, yes. But also of me.\n\nWhen I am ready to build the next phase, I will call on you. If you are willing.\n\nThis station has too few people who ask 'how can I help' before asking 'what can I get.'",
      emotion: 'grateful',
      variation_id: 'collab_v1',
      interaction: 'bloom'
    }],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['marcus_collaboration_accepted']
      }
    ],
    choices: [
      {
        choiceId: 'im_willing',
        text: "I'm willing. Building prevention systems... that matters.",
        nextNodeId: 'marcus_philosophy_close',
        pattern: 'building',
        skills: ['collaboration'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      }
    ],
    tags: ['marcus_arc', 'connection', 'future']
  },
  {
    nodeId: 'marcus_philosophy_close',
    speaker: 'Marcus',
    content: [{
      text: "Will. Yes. The will to act when action is costly. The will to wait when patience is required. The will to share when secrecy is safer.\n\nYou have shown me something today. That building systems is not enough. I must also build connections.\n\nThank you. For seeing past the exhaustion to what I am trying to protect.",
      emotion: 'grateful',
      variation_id: 'philosophy_v1'
    }],
    choices: [
      {
        choiceId: 'return_hub',
        text: "(Return to the station hub)",
        nextNodeId: 'hub_return'
      },
      {
        choiceId: 'one_more_question',
        text: "Before I go... can I ask you something personal?",
        nextNodeId: 'marcus_reciprocity_intro',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'resolution']
  },

  // ============= RECIPROCITY ARC (Marcus asks about the player) =============
  {
    nodeId: 'marcus_reciprocity_intro',
    speaker: 'Marcus',
    content: [{
      text: "Actually, may I ask you something first?\n\nI have shared much today. Perhaps too much. But you have remained present. Curious without being invasive.\n\nWhy are you here? At the station? What are you trying to build?",
      emotion: 'curious',
      variation_id: 'reciprocity_v1'
    }],
    choices: [
      {
        choiceId: 'exploring_options',
        text: "I'm exploring. Trying to understand what paths are available.",
        nextNodeId: 'marcus_reciprocity_explorer',
        pattern: 'exploring',
        skills: ['adaptability']
      },
      {
        choiceId: 'want_to_help',
        text: "I want to help people. Figure out how my skills can serve others.",
        nextNodeId: 'marcus_reciprocity_helper',
        pattern: 'helping',
        skills: ['communication']
      },
      {
        choiceId: 'understanding_systems',
        text: "I'm trying to understand how systems work. So I can improve them.",
        nextNodeId: 'marcus_reciprocity_analyst',
        pattern: 'analytical',
        skills: ['systemsThinking']
      },
      {
        choiceId: 'building_something',
        text: "I want to build something that matters. Something that lasts.",
        nextNodeId: 'marcus_reciprocity_builder',
        pattern: 'building',
        skills: ['creativity']
      },
      {
        choiceId: 'figuring_out',
        text: "Honestly? I'm still figuring that out.",
        nextNodeId: 'marcus_reciprocity_uncertain',
        pattern: 'patience',
        skills: ['humility']
      }
    ],
    tags: ['marcus_arc', 'reciprocity']
  },
  {
    nodeId: 'marcus_reciprocity_explorer',
    speaker: 'Marcus',
    content: [{
      text: "Exploring. I understand that. Before the hospital, I explored too. Tried different paths. Network admin like my father. Software development. Even considered medicine.\n\nExploration is not aimlessness. It is gathering data. Understanding the landscape before committing to a path.\n\nThe danger is exploring forever. At some point, you must choose. Build something. Even if it is not perfect.\n\nBut you seem to know that already. Your questions today were not random. They had direction.",
      emotion: 'knowing',
      variation_id: 'explorer_v1'
    }],
    choices: [
      {
        choiceId: 'explorer_thank',
        text: "Thank you, Marcus. That helps clarify things.",
        nextNodeId: 'hub_return',
        pattern: 'patience',
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'reciprocity', 'mentorship']
  },
  {
    nodeId: 'marcus_reciprocity_helper',
    speaker: 'Marcus',
    content: [{
      text: "Help people. Yes. I see that in you.\n\nBut here is something I learned too late: you cannot help others if you do not protect yourself first.\n\nI burned myself out trying to protect everyone. And when I crashed, I protected no one.\n\nService is noble. But sustainable service requires boundaries. Know your limits. Replenish your capacity.\n\nThe best helpers are not martyrs. They are systems. Reliable, consistent, enduring.",
      emotion: 'caring',
      variation_id: 'helper_v1'
    }],
    choices: [
      {
        choiceId: 'helper_thank',
        text: "Thank you, Marcus. I'll remember that.",
        nextNodeId: 'hub_return',
        pattern: 'helping',
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'reciprocity', 'mentorship']
  },
  {
    nodeId: 'marcus_reciprocity_analyst',
    speaker: 'Marcus',
    content: [{
      text: "Systems. Yes. I saw that in how you approached the workflow. You did not just solve problems. You understood underlying structures.\n\nAnalytical thinking is powerful. But remember: systems serve people, not the other way around.\n\nI spent years optimizing systems and forgot why. The metrics became the goal, not the outcomes.\n\nStay connected to impact. Every optimization should trace back to someone helped. Otherwise, you are just moving numbers.",
      emotion: 'knowing',
      variation_id: 'analyst_v1'
    }],
    choices: [
      {
        choiceId: 'analyst_thank',
        text: "Systems serve people. I won't forget that.",
        nextNodeId: 'hub_return',
        pattern: 'analytical',
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'reciprocity', 'mentorship']
  },
  {
    nodeId: 'marcus_reciprocity_builder',
    speaker: 'Marcus',
    content: [{
      text: "Building something that lasts. That is ambition I respect.\n\nBut here is what no one tells builders: lasting things require maintenance. Nothing survives on its own.\n\nThe hospital's security? Built to last. But it required vigilance, updates, advocacy. When those stopped, it crumbled.\n\nBuild with maintenance in mind. Document everything. Train successors. The greatest buildings outlast their builders, but only if others can tend them.\n\nImmortality is not finishing. It is enabling continuation.",
      emotion: 'sage',
      variation_id: 'builder_v1'
    }],
    choices: [
      {
        choiceId: 'builder_thank',
        text: "Build for continuation. That's wise. Thank you, Marcus.",
        nextNodeId: 'hub_return',
        pattern: 'building',
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'reciprocity', 'mentorship']
  },
  {
    nodeId: 'marcus_reciprocity_uncertain',
    speaker: 'Marcus',
    content: [{
      text: "Honesty. That is rare. Most people pretend certainty they do not have.\n\nI was uncertain too. For years. Tried to force clarity. Chased prestige and stability. None of it felt right.\n\nThe clarity came after the breach. In the wreckage, I found what mattered. Protection. Prevention. Purpose born from pain.\n\nI do not wish crisis on you. But know this: uncertainty often resolves through action, not thought. Do something. Learn from it. Adjust.\n\nYou cannot think your way to clarity. You must build it.",
      emotion: 'gentle',
      variation_id: 'uncertain_v1'
    }],
    choices: [
      {
        choiceId: 'uncertain_thank',
        text: "Build clarity through action. That's... actually helpful. Thank you.",
        nextNodeId: 'hub_return',
        pattern: 'patience',
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'reciprocity', 'mentorship']
  },

  // ============= DEEP VULNERABILITY ARC (Trust >= 6) =============
  {
    nodeId: 'marcus_vulnerability_arc',
    speaker: 'Marcus',
    requiredState: { trust: { min: 6 } },
    content: [{
      text: "There is something I do not speak of. The incident that brought me to this station.\n\nChildren's Hospital. A ransomware attack. I was lead security. I saw the phishing attempt three days before. Flagged it. Management said the patch could wait until after the quarterly audit.\n\nLife support systems. Eighteen hours offline. Three children did not survive the delay.\n\nI could not prevent what I could not authorize. The breach was not technical. It was bureaucratic.",
      emotion: 'haunted',
      microAction: 'His hands clench, then slowly release.',
      variation_id: 'vulnerability_v1',
      richEffectContext: 'error',
      patternReflection: [
        {
          pattern: 'analytical',
          minLevel: 5,
          altText: "You analyze systems. Perhaps you can understand the variables I could not control.\n\nChildren's Hospital. Ransomware attack. I was lead security. I saw the phishing attempt three days before. I ran the analysis. Flagged the threat. Management: \"patch can wait until quarterly audit.\"\n\nLife support systems. Eighteen hours offline. Three children did not survive.\n\nI had the data. I had the analysis. I did not have the authority. The analytical mind that saw the danger but could not prevent it.",
          altEmotion: 'analytical_haunted'
        },
        {
          pattern: 'patience',
          minLevel: 5,
          altText: "You understand patience. The cost of waiting.\n\nChildren's Hospital. Ransomware attack. Lead security. I saw the phishing attempt three days before. I flagged it. Management: \"wait until quarterly audit.\"\n\nThree days. I was patient. I followed protocol. I waited for authorization.\n\nLife support systems. Eighteen hours offline. Three children did not survive the wait.\n\nPatience killed them. I should have acted without permission.",
          altEmotion: 'regret_haunted'
        },
        {
          pattern: 'exploring',
          minLevel: 5,
          altText: "You explore. You discover threats. I discovered one too.\n\nChildren's Hospital. Ransomware attack. Lead security. I explored the logs three days before. Found the phishing attempt. I showed them what I'd discovered. Management: \"wait until quarterly audit.\"\n\nLife support systems. Eighteen hours offline. Three children did not survive.\n\nI explored the threat. I mapped the danger. But I couldn't navigate the bureaucracy fast enough. The explorer who found the danger but couldn't prevent it.",
          altEmotion: 'grief_haunted'
        },
        {
          pattern: 'helping',
          minLevel: 5,
          altText: "You help people. I tried to help people.\n\nChildren's Hospital. I was there to protect them. Lead security. I saw the phishing attempt three days before. I wanted to help. I flagged it. Management: \"wait until quarterly audit.\"\n\nLife support systems. Eighteen hours offline. Three children did not survive.\n\nI was supposed to help. To protect. I could not prevent what I could not authorize. The helper who failed when children needed him most.",
          altEmotion: 'devastated_haunted'
        },
        {
          pattern: 'building',
          minLevel: 5,
          altText: "You build systems. I built security systems.\n\nChildren's Hospital. Ransomware attack. Lead security. I built the detection system. It worked. Saw the phishing attempt three days before. I flagged it. Management: \"patch can wait until quarterly audit.\"\n\nLife support systems. Eighteen hours offline. Three children did not survive.\n\nI built the warning system. It warned. But I couldn't build the authority to act. The builder whose construction worked perfectly—and failed completely.",
          altEmotion: 'builder_haunted'
        }
      ],
      // E2-CHALLENGE: Opportunity to challenge his self-blame
      interrupt: {
        duration: 3500,
        type: 'challenge',
        action: 'Challenge his self-blame',
        targetNodeId: 'marcus_challenge_accepted',
        consequence: {
          characterId: 'marcus',
          trustChange: 1,
          addKnowledgeFlags: ['player_challenged_marcus_guilt']
        }
      }
    }],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['marcus_vulnerability_revealed', 'knows_about_breach']
      }
    ],
    choices: [
      {
        choiceId: 'vuln_not_your_fault',
        text: "That wasn't your failure. You did everything you could.",
        nextNodeId: 'marcus_vulnerability_reflection',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        requiredOrbFill: { pattern: 'helping', threshold: 25 },
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'vuln_system_failure',
        text: "The system failed those children. Not you.",
        nextNodeId: 'marcus_vulnerability_reflection',
        pattern: 'analytical',
        skills: ['systemsThinking'],
        requiredOrbFill: { pattern: 'analytical', threshold: 25 }
      },
      {
        choiceId: 'vuln_silence',
        text: "[Hold space for his grief. Some wounds don't need words.]",
        nextNodeId: 'marcus_vulnerability_reflection',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        requiredOrbFill: { pattern: 'patience', threshold: 30 },
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      }
    ],
    tags: ['vulnerability_arc', 'marcus_arc', 'emotional_core']
  },

  // ============= CHALLENGE INTERRUPT TARGET =============
  {
    nodeId: 'marcus_challenge_accepted',
    speaker: 'Marcus',
    content: [{
      text: "Wait. You pushed back on that.\n\n'Could not prevent what I could not authorize.' I've said that a thousand times. Like it absolves me.\n\nBut you heard something else. You heard me still blaming myself for someone else's decision.\n\nMaybe... maybe the guilt I carry isn't mine to carry. Maybe I've been holding it because no one else would.",
      emotion: 'breakthrough',
      variation_id: 'challenge_accepted_v1',
      voiceVariations: {
        helping: "Wait. You pushed back.\n\nYou heard me blaming myself for someone else's decision. Most people let me carry that. You didn't.\n\nMaybe this guilt... maybe it was never mine to hold.",
        analytical: "Wait. You caught the logical flaw.\n\n'Could not prevent what I could not authorize.' That's not failure. That's systemic constraint. You see the difference.\n\nMaybe I've been carrying guilt for a system that failed, not for myself.",
        building: "Wait. You challenged that.\n\nI've been building safeguards on top of guilt. But you're right—the foundation is wrong. The guilt isn't mine.\n\nMaybe I can rebuild from a healthier place.",
        exploring: "Wait. You questioned that assumption.\n\nI've told that story the same way for years. You heard something I couldn't.\n\nMaybe the guilt I've been carrying belongs somewhere else.",
        patience: "Wait. You didn't let that slide.\n\n'Could not prevent what I could not authorize.' I've hidden behind that phrase. You saw through it.\n\nMaybe... maybe it's time to let go of what wasn't mine to hold."
      }
    }],
    choices: [
      {
        choiceId: 'challenge_follow_up',
        text: "You did everything in your power. The failure was above you.",
        nextNodeId: 'marcus_vulnerability_reflection',
        pattern: 'analytical',
        skills: ['systemsThinking', 'emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'challenge_support',
        text: "Carrying guilt that isn't yours doesn't honor those children. It just weighs you down.",
        nextNodeId: 'marcus_vulnerability_reflection',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'challenge_patience',
        text: "[Let the realization settle. He needs time with this.]",
        nextNodeId: 'marcus_vulnerability_reflection',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['interrupt_target', 'marcus_arc', 'challenge_interrupt', 'breakthrough']
  },

  {
    nodeId: 'marcus_vulnerability_reflection',
    speaker: 'Marcus',
    content: [{
      text: "I became the operator so that bureaucracy would never block critical action again. Every workflow I architect now has fail-safes. Escalation paths that bypass approval chains when lives are at stake.\n\nThe station gave me that power. But some nights, I run the scenario again. Wondering if I could have found another way.\n\nYou are the first who has not tried to tell me it was 'meant to be.' Thank you for that.",
      emotion: 'resolved_grief',
      variation_id: 'reflection_v1'
    }],
    choices: [
      {
        choiceId: 'vuln_continue',
        text: "(Continue)",
        nextNodeId: 'marcus_patient_story',
        pattern: 'patience'
      }
    ],
    tags: ['vulnerability_arc', 'marcus_arc']
  },
  {
    nodeId: 'marcus_patient_story',
    speaker: 'Marcus',
    content: [{
      text: "Lila was seven. Leukemia. Her treatment protocols required real-time data from multiple systems. When the ransomware hit, her infusion pump lost connectivity.\n\nManuel was four. Heart condition. The life support monitoring went dark for eighteen hours. By the time manual checks caught the arrhythmia...\n\nAmara was nine. Cystic fibrosis. The ventilator settings couldn't be adjusted remotely. The nurses did everything right. But without the data, 'right' wasn't enough.\n\nThree children. Three families. One patch that could have waited 'until next quarter.'",
      emotion: 'raw',
      variation_id: 'patient_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 7 }
    },
    choices: [
      {
        choiceId: 'remember_them',
        text: "Thank you for sharing their names. They deserve to be remembered.",
        nextNodeId: 'marcus_redemption_path',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 3
        }
      },
      {
        choiceId: 'honor_memory',
        text: "The work you do now - the prevention systems - that honors their memory.",
        nextNodeId: 'marcus_redemption_path',
        pattern: 'patience',
        skills: ['communication'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      }
    ],
    tags: ['vulnerability_arc', 'marcus_arc', 'emotional_core']
  },
  {
    nodeId: 'marcus_redemption_path',
    speaker: 'Marcus',
    content: [{
      text: "Honor. Yes. That is the word.\n\nI cannot undo what happened. But every system I build now carries their lesson. Every fail-safe, every override protocol, every ethics check point.\n\nThis is not penance. Penance implies debt that can be repaid. This is continuation. They cannot grow up. But their impact can grow.\n\nThe prevention system I am building? It uses the attack pattern from that night. Lila, Manuel, Amara. Their tragedy becomes the training data that protects the next Lila, Manuel, Amara.\n\nThat is not redemption. That is multiplication.",
      emotion: 'determined',
      variation_id: 'redemption_v1',
      interaction: 'bloom'
    }],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['marcus_redemption_revealed']
      }
    ],
    choices: [
      {
        choiceId: 'multiplication_beautiful',
        text: "Multiplication, not redemption. That's... that's beautiful, Marcus.",
        nextNodeId: 'marcus_deep_trust_close',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'help_multiply',
        text: "Let me help you multiply their impact. This work shouldn't stay private.",
        nextNodeId: 'marcus_deep_trust_close',
        pattern: 'helping',
        skills: ['collaboration'],
        consequence: {
          characterId: 'marcus',
          trustChange: 3
        }
      }
    ],
    tags: ['vulnerability_arc', 'marcus_arc', 'redemption']
  },
  {
    nodeId: 'marcus_deep_trust_close',
    speaker: 'Marcus',
    content: [{
      text: "You have shown me something I did not expect to find at the station. Someone who can hold weight without trying to fix it. Who sees systems and people.\n\nI do not offer partnership lightly. But if you are willing, I would welcome your collaboration on the prevention framework.\n\nNot as a favor. As equals. Building something that protects the vulnerable.\n\nLila would have liked you. She always asked the nurses 'why' instead of just accepting. Just like you.",
      emotion: 'connected',
      variation_id: 'deep_trust_v1',
      interaction: 'nod'
    }],
    onEnter: [
      {
        addGlobalFlags: ['marcus_arc_complete', 'marcus_deep_trust'],
        thoughtId: 'prevention-multiplication'
      }
    ],
    choices: [
      {
        choiceId: 'accept_partnership',
        text: "I'm honored, Marcus. Let's build something that matters.",
        nextNodeId: 'hub_return',
        pattern: 'building',
        skills: ['collaboration'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      }
    ],
    tags: ['marcus_arc', 'resolution', 'connection']
  },

  // ============= HIGHEST TRUST REVELATION (Trust >= 8) =============
  {
    nodeId: 'marcus_highest_trust',
    speaker: 'Marcus',
    content: [{
      text: "There is something else. Something I have told no one.\n\nThe night of the breach, I could have acted unilaterally. I had the access. The knowledge. I could have deployed the patch myself and apologized later.\n\nBut I followed protocol. Documented my concerns. Waited for approval. Did everything 'right.'\n\nThree children died because I respected a chain of command that did not respect urgency. I was complicit in my own disempowerment.\n\nThat is the guilt I carry. Not that I failed to see the threat. But that I saw it clearly and still did not act.",
      emotion: 'confessional',
      variation_id: 'highest_v1',
      richEffectContext: 'error'
    }],
    requiredState: {
      trust: { min: 8 }
    },
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['marcus_deepest_truth']
      }
    ],
    choices: [
      {
        choiceId: 'impossible_choice',
        text: "That was an impossible choice. Act without authority and risk your career. Wait for approval and risk lives.",
        nextNodeId: 'marcus_impossible_choice_response',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'forgive_yourself',
        text: "You were designed to fail by a system that didn't give you the power to match your responsibility.",
        nextNodeId: 'marcus_impossible_choice_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 3
        }
      }
    ],
    tags: ['vulnerability_arc', 'marcus_arc', 'deepest']
  },
  {
    nodeId: 'marcus_impossible_choice_response',
    speaker: 'Marcus',
    content: [{
      text: "Impossible. Yes. That is what I could not see.\n\nI held myself to a standard no one could meet. Blamed myself for a system's failure.\n\nThe station gives me authority now. But the guilt followed me here. Every override protocol I build is me trying to give past-Marcus permission he was denied.\n\nBut you are right. The design was flawed. Not just me.\n\nThat does not absolve. But it shares the weight.\n\nThank you. For helping me see it was not just my failure.",
      emotion: 'release',
      variation_id: 'release_v1',
      interaction: 'bloom'
    }],
    choices: [
      {
        choiceId: 'shared_weight',
        text: "Shared weight. That's what connection does. You don't have to carry this alone.",
        nextNodeId: 'marcus_final_close',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      }
    ],
    tags: ['vulnerability_arc', 'marcus_arc', 'healing']
  },
  {
    nodeId: 'marcus_final_close',
    speaker: 'Marcus',
    content: [{
      text: "Alone. That is how I have operated. By choice. By trauma.\n\nBut you have shown me that connection does not weaken protection. It strengthens it.\n\nI built these systems to prevent breaches. But I built walls around myself that prevent healing.\n\nNo more. From now on, the prevention framework is collaborative. Open source. Shared with anyone who protects the vulnerable.\n\nLila, Manuel, Amara. They will protect thousands. Through everyone who learns from what happened.\n\nThat is their legacy. Not my guilt. Their protection.\n\nThank you. For helping me see that.",
      emotion: 'transformed',
      variation_id: 'final_v1',
      interaction: 'bloom'
    }],
    onEnter: [
      {
        addGlobalFlags: ['marcus_fully_healed', 'marcus_legacy_shared'],
        thoughtId: 'shared-protection'
      }
    ],
    choices: [
      {
        choiceId: 'to_hub_final',
        text: "(Return to the station, changed by this connection)",
        nextNodeId: 'hub_return',
        pattern: 'patience'
      },
      // Loyalty Experience trigger - only visible at high trust + analytical pattern
      {
        choiceId: 'offer_breach_help',
        text: "[System Analyst] Marcus, I've been monitoring the station network. There's an anomaly in the patient database. Active breach?",
        nextNodeId: 'marcus_loyalty_trigger',
        pattern: 'analytical',
        skills: ['cybersecurity', 'riskManagement'],
        visibleCondition: {
          trust: { min: 8 },
          patterns: { analytical: { min: 50 } },
          hasGlobalFlags: ['marcus_arc_complete']
        }
      }
    ],
    tags: ['marcus_arc', 'resolution', 'transformation']
  },

  // ============= LOYALTY EXPERIENCE TRIGGER =============
  {
    nodeId: 'marcus_loyalty_trigger',
    speaker: 'Marcus',
    content: [{
      text: "You see it too.\n\nActive intrusion. Patient records being accessed without authorization. I flagged it ten minutes ago.\n\nEarly detection means we can contain it. But containment requires choices. Do we shut down the system and risk interrupting active treatments? Do we let it run and trace the exfiltration? Do we notify patients now or wait until we understand the scope?\n\nEvery choice has consequences. Every delay costs trust. Every action risks lives.\n\nThis is what I lived through before. Competing priorities. Impossible timelines. The weight of thousands depending on one decision.\n\nYou understand systems and risk. Will you... help me navigate this before it becomes another breach I carry forever?",
      emotion: 'anxious_determined',
      variation_id: 'loyalty_trigger_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 8 },
      patterns: { analytical: { min: 5 } },
      hasGlobalFlags: ['marcus_arc_complete']
    },
    metadata: {
      experienceId: 'the_breach'  // Triggers loyalty experience engine
    },
    choices: [
      {
        choiceId: 'accept_breach_challenge',
        text: "Show me the logs. We'll triage this together.",
        nextNodeId: 'marcus_loyalty_start',
        pattern: 'analytical',
        skills: ['cybersecurity', 'riskManagement'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'encourage_but_decline',
        text: "Marcus, you've built these protocols precisely for this. Trust your framework.",
        nextNodeId: 'marcus_loyalty_declined',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['loyalty_offered']
      }
    ],
    tags: ['loyalty_experience', 'marcus_loyalty', 'high_trust']
  },

  {
    nodeId: 'marcus_loyalty_declined',
    speaker: 'Marcus',
    content: [{
      text: "You are right. I built the framework for this exact scenario.\n\nI have decision trees. Risk matrices. Escalation protocols. Everything I learned from the breach, codified into action.\n\nI do not need someone else to validate my decisions. I need to trust the system I built.\n\nThank you for the confidence. Sometimes I still doubt myself. But you are right. The framework will hold.",
      emotion: 'resolved',
      variation_id: 'loyalty_declined_v1'
    }],
    choices: [
      {
        choiceId: 'loyalty_declined_farewell',
        text: "Your protocols will protect them. Trust the work.",
        nextNodeId: 'hub_return',
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['loyalty_declined_gracefully']
      }
    ]
  },

  {
    nodeId: 'marcus_loyalty_start',
    speaker: 'Marcus',
    content: [{
      text: "Thank you. Pulling up the incident dashboard now.\n\nTwo heads. One system. Let us contain this before anyone gets hurt.",
      emotion: 'focused_grateful',
      variation_id: 'loyalty_start_v1'
    }],
    metadata: {
      experienceId: 'the_breach'  // Experience engine takes over
    },
    choices: []  // Experience engine handles next steps
  },

  // ============= PATTERN-GATED BRANCHES =============
  {
    nodeId: 'marcus_analytical_branch',
    speaker: 'Marcus',
    content: [{
      text: "You think in systems. I recognize that.\n\nMost people see problems. You see interconnections. Causes and effects. Cascading failures.\n\nThat is how I thought before the breach. It is also how I failed to convince others. I spoke in systems while they heard noise.\n\nLearn to translate. Your analytical mind is powerful. But if you cannot explain it to non-analysts, you will be as helpless as I was.",
      emotion: 'recognizing',
      variation_id: 'analytical_v1'
    }],
    requiredState: {
      patterns: {
        analytical: { min: 4 }
      }
    },
    choices: [
      {
        choiceId: 'translation_skill',
        text: "Translation... making complexity accessible. How did you learn that?",
        nextNodeId: 'marcus_translation_lesson',
        pattern: 'analytical',
        skills: ['communication'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'systems_blindspot',
        text: "What's the blindspot of systems thinking? What do we miss?",
        nextNodeId: 'marcus_systems_blindspot',
        pattern: 'patience',
        skills: ['criticalThinking']
      }
    ],
    tags: ['marcus_arc', 'pattern_gated', 'analytical']
  },
  {
    nodeId: 'marcus_translation_lesson',
    speaker: 'Marcus',
    content: [{
      text: "I learned it wrong, then right.\n\nWrong: I dumbed things down. Removed nuance until the message was meaningless. Management nodded, did nothing.\n\nRight: I learned to speak in stakes. Not 'the firewall has a vulnerability' but 'someone could access every patient's social security number in two hours.'\n\nSame truth. Different frame. Stakes people understand. Systems they do not.\n\nBut I learned this lesson after the breach. When it was too late.\n\nLearn it now. While it can still matter.",
      emotion: 'teaching',
      variation_id: 'translation_v1',
      skillReflection: [
        { skill: 'communication', minLevel: 5, altText: "I learned it wrong, then right. And you—you already communicate well. I've noticed.\n\nWrong: I dumbed things down. Removed nuance until the message was meaningless.\n\nRight: I learned to speak in stakes. Not 'vulnerability' but 'someone could access every SSN in two hours.'\n\nYour communication skills are good. Now learn to translate complex systems into human stakes. That's the advanced lesson.", altEmotion: 'impressed' },
        { skill: 'criticalThinking', minLevel: 5, altText: "I learned it wrong, then right. Your sharp thinking will help you understand why.\n\nWrong: I analyzed the technical problem perfectly. But I communicated it in technical terms. Management nodded, did nothing.\n\nRight: I learned to translate analysis into stakes. Your critical thinking is strong—now apply it to how you communicate, not just what you analyze.", altEmotion: 'mentoring' }
      ],
      patternReflection: [
        { pattern: 'analytical', minLevel: 4, altText: "You analyze deeply. So you'll understand this translation problem.\n\nI learned wrong first: dumbed things down, removed nuance. Management nodded, did nothing.\n\nLearned right: speak in stakes. Not 'vulnerability' but 'someone could access every SSN in two hours.'\n\nAnalytical minds see the system. But you must translate that sight into consequences people fear. Stakes, not systems.", altEmotion: 'teaching' },
        { pattern: 'helping', minLevel: 4, altText: "You care about impact. So this lesson matters.\n\nI learned wrong: simplified until meaningless. Management nodded, did nothing. No one helped.\n\nLearned right: speak in human stakes. Not technical facts but real consequences. 'Someone could access every patient's information.'\n\nIf you want to help, learn to translate system risks into human fears. That's when people act.", altEmotion: 'mentoring' },
        { pattern: 'building', minLevel: 4, altText: "You're a builder. So understand this: builders must also translate.\n\nI learned wrong: explained the architecture. Management nodded, didn't fund fixes.\n\nLearned right: explain what breaks and what it costs. Not 'firewall vulnerability' but 'breach exposing every patient record.'\n\nBuild the solution. But also build the argument in terms decision-makers understand: stakes, not systems.", altEmotion: 'teaching' }
      ]
    }],
    choices: [
      {
        choiceId: 'practice_stakes',
        text: "Let me practice. Translate the workflow problem into stakes.",
        nextNodeId: 'marcus_simulation_automation',
        pattern: 'analytical',
        skills: ['communication']
      }
    ],
    tags: ['marcus_arc', 'mentorship', 'analytical']
  },
  {
    nodeId: 'marcus_systems_blindspot',
    speaker: 'Marcus',
    content: [{
      text: "Emotion. We miss emotion.\n\nSystems thinking is powerful. But humans do not operate on logic alone. Fear, pride, exhaustion. These shape decisions as much as data.\n\nThe manager who delayed the patch? Terrified of budget overruns. Exhausted from quarterly pressure. Acting on fear, not malice.\n\nI saw a technical problem. I should have seen a human one.\n\nSystems that ignore psychology fail. Build for humans, not processes. Processes cannot be afraid. Humans can.",
      emotion: 'wise',
      variation_id: 'blindspot_v1',
      skillReflection: [
        { skill: 'emotionalIntelligence', minLevel: 5, altText: "Emotion. We miss emotion. But you don't—I've seen how you read people.\n\nSystems thinking is powerful. But it misses what you naturally catch: fear, pride, exhaustion. The human variables.\n\nThe manager who delayed my patch? Your emotional intelligence would have seen what I missed—a terrified human, not a broken process.\n\nYou have the skill I learned too late. Use it.", altEmotion: 'appreciative' },
        { skill: 'systemsThinking', minLevel: 5, altText: "Emotion. We miss emotion. And you think in systems—so you're at risk for this blindspot.\n\nSystems thinking is powerful. I know you understand that. But here's what systems miss: fear, pride, exhaustion.\n\nThe manager who delayed my patch? A human variable I didn't model. Your systems thinking is strong—add the human layer to your models. That's the advanced lesson.", altEmotion: 'mentoring' }
      ],
      patternReflection: [
        { pattern: 'analytical', minLevel: 4, altText: "You analyze systems. So you might make my mistake.\n\nSystems thinking is powerful. But it misses emotion. Fear, pride, exhaustion—these shape decisions as much as logic.\n\nThe manager who delayed my patch? Acting on fear of budget overruns, not malice. I analyzed the technical system. Missed the human one.\n\nYour analytical mind is your strength. Don't let it become your blindspot. Systems ignore psychology at their peril.", altEmotion: 'teaching_warm' },
        { pattern: 'helping', minLevel: 4, altText: "You lead with care. So you already understand what I learned too late.\n\nSystems thinking is powerful but incomplete. Humans operate on fear, pride, exhaustion—not just data.\n\nThe manager who delayed the patch? Terrified, exhausted, human. I saw a technical problem. You would have seen the human one.\n\nBuild for humans, not processes. Processes cannot be afraid. Humans can. Your empathy is the variable systems thinking misses.", altEmotion: 'knowing' },
        { pattern: 'building', minLevel: 4, altText: "You're a builder. So build with this wisdom.\n\nSystems thinking is powerful. But systems that ignore human psychology fail. Fear, pride, exhaustion shape decisions as much as specifications.\n\nThe manager who delayed my patch? Not a broken process. A terrified human under quarterly pressure.\n\nBuild for humans, not abstract processes. Processes cannot be afraid. Humans can. Build systems that account for human fear, not just logical flows.", altEmotion: 'wise' }
      ]
    }],
    choices: [
      {
        choiceId: 'build_for_humans',
        text: "Build for humans, not processes. That's... that's really important.",
        nextNodeId: 'marcus_simulation_automation',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'philosophy', 'analytical']
  },
  {
    nodeId: 'marcus_building_branch',
    speaker: 'Marcus',
    content: [{
      text: "You want to build. To create. To make things exist.\n\nI understand that drive. It powered my early career.\n\nBut here is what builders often forget: destruction is faster than creation. What takes months to build can be destroyed in seconds.\n\nThe ransomware that hit the hospital? Took three months to infiltrate. Took eighteen hours to devastate.\n\nBuild with resilience in mind. Assume failure. Design for recovery. The best builders are also the best anticipators of destruction.",
      emotion: 'teaching',
      variation_id: 'building_v1',
      patternReflection: [
        { pattern: 'building', minLevel: 4, altText: "You're a builder. I see it in you—that drive to create, to make things exist.\n\nI had that drive. It powered my early career. But here's what builders forget: destruction is faster than creation.\n\nThree months to infiltrate. Eighteen hours to devastate.\n\nBuild with resilience in mind. Assume failure. Design for recovery. The best builders are also the best anticipators of destruction. Build like someone is trying to break what you make. Because someone is.", altEmotion: 'teaching_serious' },
        { pattern: 'analytical', minLevel: 4, altText: "You analyze systems. So analyze this asymmetry.\n\nCreation: months. Destruction: seconds. This is not metaphor—it's mathematical reality.\n\nThe ransomware infiltrated over three months. Devastated in eighteen hours. Creation velocity versus destruction velocity: we lose.\n\nBuild analytically for resilience. Assume failure. Design for recovery. The best systems anticipate their own breaking points before attackers find them.", altEmotion: 'teaching' },
        { pattern: 'patience', minLevel: 4, altText: "You're patient. That patience serves building.\n\nI was impatient early in my career. Built fast, iterated faster. Forgot that destruction is faster than creation.\n\nThree months to infiltrate slowly. Eighteen hours to destroy rapidly.\n\nPatience means building with resilience. Assuming failure. Designing for recovery. The best builders patiently anticipate destruction. Your patience is your advantage—use it to build what survives.", altEmotion: 'mentoring' }
      ]
    }],
    requiredState: {
      patterns: {
        building: { min: 4 }
      }
    },
    choices: [
      {
        choiceId: 'design_for_recovery',
        text: "Design for recovery. How do you build that in from the start?",
        nextNodeId: 'marcus_resilience_design',
        pattern: 'building',
        skills: ['systemsThinking'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'pattern_gated', 'building']
  },
  {
    nodeId: 'marcus_resilience_design',
    speaker: 'Marcus',
    content: [{
      text: "Redundancy. Isolation. Graceful degradation.\n\nRedundancy: Every critical system has a backup. When life support lost connectivity, there should have been a local fallback.\n\nIsolation: Failures should not cascade. The ransomware spread because systems were too interconnected.\n\nGraceful degradation: When things fail, they should fail safely. Reduced function is better than no function.\n\nThe hospital was built for efficiency, not resilience. Efficient systems are fragile. Resilient systems are robust.\n\nBuild robust. Even when stakeholders want efficient.",
      emotion: 'teaching',
      variation_id: 'resilience_v1'
    }],
    choices: [
      {
        choiceId: 'apply_resilience',
        text: "Let's apply these principles to your current systems.",
        nextNodeId: 'marcus_simulation_cursor',
        pattern: 'building',
        skills: ['problemSolving']
      }
    ],
    tags: ['marcus_arc', 'mentorship', 'building']
  },
  {
    nodeId: 'marcus_exploring_branch',
    speaker: 'Marcus',
    content: [{
      text: "You ask many questions. Explore many paths.\n\nExploration is valuable. But it has risks.\n\nI explored too long before the hospital. Sampled careers without committing. By the time I found my path, I was playing catch-up.\n\nAnd then I was so focused on proving myself that I did not push back when I should have.\n\nExplore with intention. Not endlessly. Each exploration should narrow your focus, not expand it forever.",
      emotion: 'mentoring',
      variation_id: 'exploring_v1'
    }],
    requiredState: {
      patterns: {
        exploring: { min: 4 }
      }
    },
    choices: [
      {
        choiceId: 'intentional_exploration',
        text: "How do you know when exploration should end and commitment should begin?",
        nextNodeId: 'marcus_commitment_lesson',
        pattern: 'exploring',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'pattern_gated', 'exploring']
  },
  {
    nodeId: 'marcus_commitment_lesson',
    speaker: 'Marcus',
    content: [{
      text: "When the cost of not choosing exceeds the risk of choosing wrong.\n\nI knew I wanted to work in security for months before I applied. Fear of commitment kept me exploring alternatives. That delay cost me experience that might have mattered.\n\nHere is the truth: you will never have perfect information. Waiting for certainty is its own choice. A choice to delay.\n\nAt some point, you must leap. The leap teaches you what no exploration can.\n\nBut choose something you can commit to fully. Half-commitment is worse than delayed commitment.",
      emotion: 'wise',
      variation_id: 'commitment_v1'
    }],
    choices: [
      {
        choiceId: 'leap_and_learn',
        text: "The leap teaches what exploration can't. That's clarifying.",
        nextNodeId: 'marcus_simulation_automation',
        pattern: 'patience',
        skills: ['adaptability'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'mentorship', 'exploring']
  },
  {
    nodeId: 'marcus_patience_branch',
    speaker: 'Marcus',
    content: [{
      text: "You take your time. Consider before acting.\n\nPatience is wisdom. But it has shadows.\n\nI was patient the night of the breach. Waited for approval. Gave management time to 'understand the situation.'\n\nMy patience cost lives.\n\nSome situations do not permit patience. Learn to recognize them. Learn when 'wait and see' becomes 'wait and suffer.'\n\nPatience is a virtue. But knowing when to abandon it is wisdom.",
      emotion: 'cautioning',
      variation_id: 'patience_v1'
    }],
    requiredState: {
      patterns: {
        patience: { min: 4 }
      }
    },
    choices: [
      {
        choiceId: 'recognize_urgency',
        text: "How do you recognize when patience becomes dangerous?",
        nextNodeId: 'marcus_urgency_recognition',
        pattern: 'patience',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'pattern_gated', 'patience']
  },
  {
    nodeId: 'marcus_urgency_recognition',
    speaker: 'Marcus',
    content: [{
      text: "Stakes. Reversibility. Window.\n\nStakes: What happens if this goes wrong? The higher the stakes, the lower the threshold for action.\n\nReversibility: Can the damage be undone? Irreversible consequences demand faster response.\n\nWindow: How long until the opportunity closes? Some decisions have expiration dates.\n\nThe breach had high stakes, irreversible consequences, and a closing window. I should have acted.\n\nMy patience was appropriate for low-stakes reversible situations. It was catastrophic for the opposite.\n\nKnow the difference. Your life may depend on it.",
      emotion: 'teaching',
      variation_id: 'urgency_v1'
    }],
    choices: [
      {
        choiceId: 'framework_stakes',
        text: "Stakes, reversibility, window. That's a useful framework.",
        nextNodeId: 'marcus_simulation_automation',
        pattern: 'analytical',
        skills: ['problemSolving'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'mentorship', 'patience']
  },
  {
    nodeId: 'marcus_helping_branch',
    speaker: 'Marcus',
    content: [{
      text: "You care about people. About impact. About service.\n\nI was the same. Still am.\n\nBut here is what helpers must learn: you cannot help everyone. And trying to will destroy you.\n\nI tried to protect every patient, every system, every vulnerability. I spread myself so thin that when it mattered most, I had nothing left.\n\nLearn to triage your care. Focus where impact is highest. Let go of what you cannot control.\n\nIt feels like betrayal. It is actually wisdom.",
      emotion: 'caring',
      variation_id: 'helping_v1'
    }],
    requiredState: {
      patterns: {
        helping: { min: 4 }
      }
    },
    choices: [
      {
        choiceId: 'triage_care',
        text: "Triage your care. How do you choose who to help?",
        nextNodeId: 'marcus_help_triage',
        pattern: 'helping',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'pattern_gated', 'helping']
  },
  {
    nodeId: 'marcus_help_triage',
    speaker: 'Marcus',
    content: [{
      text: "Impact. Capacity. Sustainability.\n\nImpact: Where can your help matter most? Some situations need your specific skills. Others do not.\n\nCapacity: What can you actually provide? Promising beyond capacity is worse than declining honestly.\n\nSustainability: Can you maintain this help? One-time intervention is different from ongoing support.\n\nThe children at the hospital. I could not save them all. But I could protect the systems that protected them.\n\nI triaged wrong. Focused on people when I should have focused on infrastructure.\n\nSometimes the most helpful thing is not direct aid. It is building systems that help when you cannot be there.",
      emotion: 'wise',
      variation_id: 'help_triage_v1'
    }],
    choices: [
      {
        choiceId: 'systems_of_help',
        text: "Build systems of help, not just moments of help. That's profound.",
        nextNodeId: 'marcus_simulation_automation',
        pattern: 'building',
        skills: ['systemsThinking'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'mentorship', 'helping']
  },

  // ============= FAILURE STATES =============
  {
    nodeId: 'marcus_burnout',
    speaker: 'Marcus',
    content: [{
      text: 'I just need a minute. Everything is spinning.\n\nPower through. That is what they always say. But power is finite. And I have been running on empty for three years.',
      emotion: 'exhausted',
      variation_id: 'burnout_v1',
      voiceVariations: {
        helping: "I just need a minute. Everything is spinning.\n\nYou care. I can see it. But caring about others when you're empty... it just empties them too.",
        analytical: "I just need a minute. Everything is spinning.\n\nYou're calculating the cost, aren't you? Three years at this rate. The math doesn't work. It never did.",
        building: "I just need a minute. Everything is spinning.\n\nYou want to build something to fix this. But some things can't be automated. Rest is one of them.",
        exploring: "I just need a minute. Everything is spinning.\n\nCurious how far the human body can go? Further than it should. That's the answer.",
        patience: "I just need a minute. Everything is spinning.\n\nYou're just... waiting. Not trying to fix it. That's rarer than you know."
      }
    }],
    choices: [
      {
        choiceId: 'return',
        text: 'Back',
        nextNodeId: 'marcus_intro'
      }
    ]
  },
  {
    nodeId: 'marcus_fail_trust',
    speaker: 'Marcus',
    content: [{
      text: "They detected the automation. 'Response 34B'? Retention is lost. Trust score is zero.\n\nScripts without substance. I should have known better. The hospital taught me: people know when they are not being heard.",
      emotion: 'devastated',
      variation_id: 'fail_trust_v1'
    }],
    choices: [
      {
        choiceId: 'return',
        text: 'Try again',
        nextNodeId: 'marcus_intro'
      }
    ]
  },

  // ============= HUB RETURN =============
  {
    nodeId: 'hub_return',
    speaker: 'Narrator',
    content: [{
      text: 'You leave Marcus to his work. The station hums with new efficiency. But something has changed - in him, and perhaps in you. The weight of protection is lighter when shared.',
      emotion: 'neutral',
      variation_id: 'hub_return_v1'
    }],
    choices: []
  },

  // ============= INSIGHT NODES (Pattern-revealing moments about medical tech ethics) =============
  {
    nodeId: 'marcus_insight_data_dignity',
    speaker: 'Marcus',
    content: [{
      text: "People think data is just numbers. Zeros and ones. Abstract.\n\nBut this field, 'mental health diagnosis', that is a teenager's worst fear made permanent. This one, 'genetic predisposition', determines if someone gets insurance at forty.\n\nData has dignity. Every record represents a human who trusted someone with their truth. When we forget that, we become the threat we are supposed to prevent.\n\nThat is the first principle of medical tech ethics: data is not just information. It is someone's life story, compressed.",
      emotion: 'thoughtful',
      variation_id: 'insight_dignity_v1',
      richEffectContext: 'thinking'
    }],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['learned_data_dignity']
      }
    ],
    choices: [
      {
        choiceId: 'dignity_understood',
        text: "Data dignity... treating information as if the person is standing behind it.",
        nextNodeId: 'marcus_insight_consent_illusion',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'dignity_practical',
        text: "How do you operationalize dignity? In actual systems?",
        nextNodeId: 'marcus_ethics_practical',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['marcus_arc', 'insight', 'ethics']
  },
  {
    nodeId: 'marcus_insight_consent_illusion',
    speaker: 'Marcus',
    content: [{
      text: "Consent. The legal checkbox. 'I have read and agree to the terms.'\n\nNobody reads them. A study showed it would take 76 work days per year to read all the privacy policies you encounter. So we click 'agree' and hope.\n\nThe illusion of consent is worse than no consent. It transfers responsibility to people who cannot possibly understand what they are agreeing to.\n\nAt the hospital, parents signed consent forms while their children were in surgery. Stressed. Desperate. Agreeing to anything. That is not consent. That is coercion with paperwork.",
      emotion: 'concerned',
      variation_id: 'insight_consent_v1'
    }],
    choices: [
      {
        choiceId: 'true_consent',
        text: "What would true consent look like?",
        nextNodeId: 'marcus_insight_informed_choice',
        pattern: 'exploring',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'system_problem',
        text: "It sounds like a system design problem, not a user problem.",
        nextNodeId: 'marcus_ethics_architecture',
        pattern: 'analytical',
        skills: ['systemsThinking']
      }
    ],
    tags: ['marcus_arc', 'insight', 'ethics']
  },
  {
    nodeId: 'marcus_insight_informed_choice',
    speaker: 'Marcus',
    content: [{
      text: "True consent is informed choice. Not 'agree to everything' but 'understand each decision.'\n\nI have been designing something. Granular consent. Instead of one massive agreement, small choices at each step.\n\n'Share your location with your doctor? Yes / No / Only during appointments.'\n'Store your genetic data? Yes / No / Delete after treatment.'\n\nEach choice is small enough to understand. The system remembers your preferences. You can change them anytime.\n\nIt is more work for the developers. But it treats patients like adults capable of making real decisions.",
      emotion: 'determined',
      variation_id: 'insight_informed_v1',
      interaction: 'bloom'
    }],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['saw_consent_prototype']
      }
    ],
    choices: [
      {
        choiceId: 'build_this',
        text: "This should be the standard. Let's build it.",
        nextNodeId: 'marcus_simulation_cursor',
        pattern: 'building',
        skills: ['leadership'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'adoption_challenge',
        text: "The design is elegant. But how do you get hospitals to adopt it?",
        nextNodeId: 'marcus_challenge_adoption',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    tags: ['marcus_arc', 'insight', 'ethics', 'innovation']
  },

  // ============= CHALLENGE NODES (Decision points in healthcare scenarios) =============
  {
    nodeId: 'marcus_challenge_adoption',
    speaker: 'Marcus',
    content: [{
      text: "Adoption. The graveyard of good ideas.\n\nHospitals do not adopt new systems because: they are expensive, they disrupt workflows, they require retraining staff, and they introduce new risks.\n\nEvery IT director I have spoken to says the same thing: 'Sounds great. Budget it for next fiscal year.' Then next year comes and there is always something more urgent.\n\nSo. How would you solve adoption? You have an ethical system that nobody wants to implement. What do you do?",
      emotion: 'challenging',
      variation_id: 'challenge_adoption_v1'
    }],
    choices: [
      {
        choiceId: 'adoption_regulatory',
        text: "Push for regulation. Make it legally required.",
        nextNodeId: 'marcus_challenge_regulation_response',
        pattern: 'analytical',
        skills: ['systemsThinking']
      },
      {
        choiceId: 'adoption_incremental',
        text: "Start small. Pilot with one department, prove value, expand.",
        nextNodeId: 'marcus_challenge_pilot_response',
        pattern: 'patience',
        skills: ['problemSolving'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'adoption_crisis',
        text: "Wait for a crisis. After breaches, hospitals will demand better systems.",
        nextNodeId: 'marcus_challenge_crisis_response',
        pattern: 'exploring',
        skills: ['criticalThinking']
      }
    ],
    tags: ['marcus_arc', 'challenge', 'healthcare']
  },
  {
    nodeId: 'marcus_challenge_regulation_response',
    speaker: 'Marcus',
    content: [{
      text: "Regulation. The hammer approach.\n\nHIPAA took years to implement. Created entire compliance industries. Cost billions.\n\nBut it also created a floor. A minimum standard everyone had to meet.\n\nYou are thinking systemically. If voluntary adoption fails, mandate it. The problem is timing. Regulations lag technology by years. By the time consent laws pass, the damage may already be done.\n\nBut you are not wrong. Sometimes the only way to move institutions is to force them.",
      emotion: 'thoughtful',
      variation_id: 'regulation_v1'
    }],
    choices: [
      {
        choiceId: 'both_approaches',
        text: "Maybe both? Pilot programs now, push for regulation simultaneously.",
        nextNodeId: 'marcus_automation_lesson',
        pattern: 'building',
        skills: ['leadership'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'move_forward',
        text: "Let's focus on what we can control. Your systems here.",
        nextNodeId: 'marcus_simulation_cursor',
        pattern: 'patience'
      }
    ],
    tags: ['marcus_arc', 'challenge', 'healthcare']
  },
  {
    nodeId: 'marcus_challenge_pilot_response',
    speaker: 'Marcus',
    content: [{
      text: "Pilot. Prove value. Expand.\n\nThat is exactly right. The hospital that adopted my security recommendations did it this way. One department. ICU. High stakes, visible results.\n\nBut there is a risk. Pilots can be sabotaged. Skeptical staff can ensure failure. Politics can kill good projects before they prove themselves.\n\nYou need champions. People inside the organization who believe in the change. Without internal advocates, external consultants are just expensive noise.\n\nI did not have enough champions at Birmingham General. That was one of my failures.",
      emotion: 'teaching',
      variation_id: 'pilot_v1'
    }],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['discussed_champions']
      }
    ],
    choices: [
      {
        choiceId: 'be_champion',
        text: "I'll be a champion for your prevention framework. Tell me more about it.",
        nextNodeId: 'marcus_share_knowledge',
        pattern: 'helping',
        skills: ['collaboration'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'find_champions',
        text: "How do you identify potential champions in an organization?",
        nextNodeId: 'marcus_challenge_champions',
        pattern: 'exploring',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['marcus_arc', 'challenge', 'healthcare', 'mentorship']
  },
  {
    nodeId: 'marcus_challenge_crisis_response',
    speaker: 'Marcus',
    content: [{
      text: "Wait for a crisis.\n\nYou are not wrong. After the Equifax breach, credit monitoring became standard. After Target, PCI compliance got serious. After my hospital, after Birmingham General, the state implemented mandatory notification laws.\n\nCrisis is an accelerant. It creates will where none existed.\n\nBut the cost. Three children. Thousands of exposed records. Families who will never trust healthcare systems again.\n\nI cannot recommend waiting for crisis. Even if it is effective.\n\nSome prices are too high.",
      emotion: 'haunted',
      variation_id: 'crisis_v1',
      richEffectContext: 'warning'
    }],
    choices: [
      {
        choiceId: 'prevent_crisis',
        text: "Then we prevent the crisis. Build the systems now, before they're needed.",
        nextNodeId: 'marcus_simulation_cursor',
        pattern: 'building',
        skills: ['leadership'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'acknowledge_weight',
        text: "I'm sorry. I didn't mean to minimize what happened.",
        nextNodeId: 'marcus_vulnerability_arc',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'challenge', 'healthcare', 'emotional']
  },
  {
    nodeId: 'marcus_challenge_champions',
    speaker: 'Marcus',
    content: [{
      text: "Champions reveal themselves in small ways.\n\nThey ask questions in meetings when everyone else is silent. They forward articles about security incidents to colleagues. They push back, politely, when shortcuts are suggested.\n\nBut the strongest signal? They have been burned before. Someone who experienced a breach, a lawsuit, a patient complaint. They understand viscerally why prevention matters.\n\nPain creates advocates. Not always, but often. The question is whether their pain hardened them into cynics or forged them into fighters.\n\nI hope I am the latter. Some days I am not sure.",
      emotion: 'reflective',
      variation_id: 'champions_v1'
    }],
    choices: [
      {
        choiceId: 'youre_fighter',
        text: "You're building prevention systems for hospitals you'll never work at. That's a fighter.",
        nextNodeId: 'marcus_future_vision',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'back_to_building',
        text: "Let's keep building. The work itself is the answer.",
        nextNodeId: 'marcus_simulation_cursor',
        pattern: 'building',
        skills: ['resilience']
      }
    ],
    tags: ['marcus_arc', 'challenge', 'mentorship']
  },

  // ============= REFLECTION NODES (Character backstory and motivation) =============
  {
    nodeId: 'marcus_reflection_before_security',
    speaker: 'Marcus',
    content: [{
      text: "Before security, I wanted to be a doctor.\n\nPre-med at UAB. Three years. I was good at the science, terrible at the detachment. Every cadaver had a name to me. Every case study was someone's tragedy.\n\nA professor told me: 'Marcus, doctors need distance. You have too much empathy for direct patient care.'\n\nShe was right. I could not handle death in person. But I thought I could handle it at a distance. Protecting systems, not bodies.\n\nI was wrong about that too. Distance does not protect you from grief. It just delays it.",
      emotion: 'nostalgic',
      variation_id: 'reflection_premed_v1'
    }],
    choices: [
      {
        choiceId: 'empathy_strength',
        text: "Your empathy isn't a weakness. It's why you care so much about data dignity.",
        nextNodeId: 'marcus_insight_data_dignity',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'different_healing',
        text: "You're still a healer. Just working on systems instead of bodies.",
        nextNodeId: 'marcus_reflection_healer',
        pattern: 'patience',
        skills: ['communication'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'reflection', 'backstory']
  },
  {
    nodeId: 'marcus_reflection_healer',
    speaker: 'Marcus',
    content: [{
      text: "Healer. I have not thought of myself that way since before.\n\nWhen I was designing the hospital's security architecture, I called it 'preventive medicine.' The joke fell flat in meetings. But I meant it.\n\nAntiviruses are like vaccines. Firewalls are like immune systems. Incident response is like emergency surgery.\n\nI just never expected the patient to die on my table.\n\nBut you are right. Healing is healing. Maybe it is time I remembered why I chose this work. Not just what I failed to prevent.",
      emotion: 'vulnerable',
      variation_id: 'reflection_healer_v1',
      interaction: 'nod'
    }],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['marcus_healer_identity']
      }
    ],
    choices: [
      {
        choiceId: 'remember_purpose',
        text: "Purpose survives failure. It's still there, underneath.",
        nextNodeId: 'marcus_future_vision',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'heal_yourself',
        text: "Maybe it's time to heal yourself too. Not just systems.",
        nextNodeId: 'marcus_vulnerability_arc',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      },
      {
        choiceId: 'heal_deep_dive',
        text: "[Deep Dive] We can't fix the past. But we can prepare for the future. Let's run the Crisis Protocol.",
        nextNodeId: 'marcus_deep_dive',
        pattern: 'analytical',
        skills: ['crisisManagement', 'systemsThinking'],
        visibleCondition: {
          trust: { min: 4 },
          patterns: { analytical: { min: 6 } }
        },
        preview: "Initiating Mass Casualty Simulation",
        interaction: 'bloom'
      }
    ],
    tags: ['marcus_arc', 'reflection', 'healing']
  },

  // ============= CONNECTION NODES (Relationship building with player) =============
  {
    nodeId: 'marcus_connection_shared_burden',
    speaker: 'Marcus',
    content: [{
      text: "You carry something too. I can see it.\n\nNot the same weight as mine. But weight nonetheless. Everyone at the station has their reasons for being between who they were and who they are becoming.\n\nI have shared my burden with you. That is unusual for me. Most people get my competence. Few get my story.\n\nWould you tell me something about yourself? Not everything. Just enough that I am not the only one exposed here.",
      emotion: 'vulnerable',
      variation_id: 'connection_burden_v1',
      voiceVariations: {
        analytical: "You're analyzing everything. I can see it. Patterns, systems, structures.\n\nBut you're analyzing yourself too. Debugging your own code. Everyone here is between versions.\n\nI have shared my error logs with you. That is unusual. Most people get my uptime metrics. Few see the crashes.\n\nWould you share a variable? Just one piece of your algorithm?",
        helping: "You've been helping everyone. I can see it. The way you listen, really listen.\n\nBut who helps the helper? Everyone here is between who they cared for and who they're learning to be.\n\nI have shared my burden with you. That is unusual. Most people get my support. Few get my need.\n\nWould you let me see yours? Not everything. Just enough that I'm not the only one exposed here.",
        building: "You're building something. I can see it. In how you approach problems, construct solutions.\n\nBut you're rebuilding yourself too. Everyone here is between what they made and what they're becoming.\n\nI have shared my broken systems with you. That is unusual. Most people get my fixes. Few see the failures.\n\nWould you show me your blueprint? Not the whole architecture. Just enough foundation.",
        exploring: "You're exploring everything. I can see it. Questions, possibilities, paths.\n\nBut you're exploring yourself too. Mapping unknown territory. Everyone here is between who they were and who they're discovering.\n\nI have shared my map with you - all the dead ends. That is unusual. Most people get my confidence. Few get my uncertainty.\n\nWould you share part of your journey? Not the whole route. Just where you've been lost.",
        patience: "You carry something quietly. I can see it. The way you wait, don't rush.\n\nEveryone here is between who they were and who they're becoming. It takes time.\n\nI have shared my burden with you. That is unusual. Most people get my composure. Few get my grief.\n\nWould you tell me something? Not everything. Just enough that I'm not the only one exposed here."
      }
    }],
    requiredState: {
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'share_uncertainty',
        text: "I'm carrying uncertainty. Not knowing what comes next, who I'm supposed to become.",
        nextNodeId: 'marcus_connection_uncertainty_response',
        pattern: 'patience',
        skills: ['humility'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'share_pressure',
        text: "Pressure. From family, from expectations. Feeling like I should already have answers.",
        nextNodeId: 'marcus_connection_pressure_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'not_ready',
        text: "I'm not ready to share that yet. But I appreciate you asking.",
        nextNodeId: 'marcus_connection_respect_response',
        pattern: 'patience',
        skills: ['communication'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'connection', 'player_centered']
  },
  {
    nodeId: 'marcus_connection_uncertainty_response',
    speaker: 'Marcus',
    content: [{
      text: "Uncertainty. Yes. I know that weight.\n\nBefore the hospital, I changed directions three times. Felt like failure each time. Like I should have known from the start what I was meant to do.\n\nBut here is what I learned: nobody knows. The people who look certain? They are either lying or lucky. Most of us are building the path while we walk it.\n\nYou are at the station. That means you are asking questions. That is more than most people do.\n\nUncertainty is not failure. It is honesty. And honest people build better futures than confident fools.",
      emotion: 'gentle',
      variation_id: 'uncertainty_response_v1',
      interaction: 'nod'
    }],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['knows_player_uncertainty']
      }
    ],
    choices: [
      {
        choiceId: 'uncertainty_thank',
        text: "That helps. Thank you, Marcus.",
        nextNodeId: 'marcus_philosophy_close',
        pattern: 'patience',
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'connection', 'mentorship']
  },
  {
    nodeId: 'marcus_connection_pressure_response',
    speaker: 'Marcus',
    content: [{
      text: "Pressure. Yes. I understand that intimately.\n\nMy father worked at UAB for twenty-three years. He expected me to surpass him. Not maliciously. He just believed in my potential. But his belief felt like a ceiling and a floor at once.\n\nI tried to meet everyone's expectations. Burned out. Made mistakes. The breach happened when I was already running on empty.\n\nHere is what I wish someone had told me: expectations are invitations, not obligations. You can decline. You can negotiate. You can choose which ones serve you and release the rest.\n\nThe people who truly love you want your thriving, not their vision of your success.",
      emotion: 'caring',
      variation_id: 'pressure_response_v1'
    }],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['knows_player_pressure']
      }
    ],
    choices: [
      {
        choiceId: 'pressure_thank',
        text: "Expectations as invitations, not obligations. I need to remember that.",
        nextNodeId: 'marcus_philosophy_close',
        pattern: 'helping',
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'connection', 'mentorship']
  },
  {
    nodeId: 'marcus_connection_respect_response',
    speaker: 'Marcus',
    content: [{
      text: "That is fair. Trust is earned, not demanded. And I have asked much of you already by sharing my story.\n\nThe fact that you said 'not yet' instead of 'no'. That matters. It suggests openness, not closure.\n\nI will not push. When you are ready, if you are ever ready, I will listen. That is what connection means. Not extraction of secrets, but availability when sharing feels safe.\n\nYou have shown me that kind of presence today. I hope to offer the same.",
      emotion: 'respectful',
      variation_id: 'respect_response_v1'
    }],
    choices: [
      {
        choiceId: 'respect_continue',
        text: "Thank you for understanding. Let's continue building.",
        nextNodeId: 'marcus_simulation_automation',
        pattern: 'patience',
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'connection', 'boundaries']
  },

  // ============= PATTERN UNLOCK NODES =============
  // These become available when player demonstrates sufficient pattern affinity

  {
    nodeId: 'marcus_first_patient_story',
    speaker: 'Marcus',
    content: [{
      text: "You care about people. I can see it in how you listen. So I will tell you something I do not share often.\n\nMy first patient was not a patient. She was a file. A four-year-old girl. Leukemia. Her records were in a system I was hired to secure.\n\nI never met her. But I read her file to test access permissions. Treatment notes. Her mother's insurance disputes. A nurse's annotation: 'Brave girl. Smiled through the IV.'\n\nThat is when I understood. Every record is a person. Every breach is a betrayal of trust they never knew they gave.\n\nI have been protecting her ever since. Even though she is probably grown now. Even though she will never know my name.",
      emotion: 'vulnerable_reverent',
      variation_id: 'first_patient_v1'
    }],
    requiredState: {
      patterns: { helping: { min: 40 } }
    },
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['marcus_first_patient_shared']
      }
    ],
    choices: [
      {
        choiceId: 'patient_honored',
        text: "She's lucky someone was watching over her. Even invisibly.",
        nextNodeId: 'marcus_why_here',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 3
        }
      },
      {
        choiceId: 'patient_weight',
        text: "That's a heavy thing to carry. The faces behind the files.",
        nextNodeId: 'marcus_reciprocity_intro',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      }
    ],
    tags: ['marcus_arc', 'pattern_unlock', 'helping', 'backstory']
  },

  {
    nodeId: 'marcus_night_shift_wisdom',
    speaker: 'Marcus',
    content: [{
      text: "You are patient. That is rare. Most people want quick answers.\n\nThe night shifts taught me patience. Three years of 11pm to 7am. Watching systems. Waiting for anomalies.\n\nMost attacks happen at 3am. When defenses are lowest. When the human watching is tired. The attackers count on impatience. On the guard checking the clock instead of the logs.\n\nBut patience is not passive. It is active waiting. It is noticing the small things because you are not rushing to the big ones.\n\nThat is what I was doing the night before the breach. Being patient. Watching. And still I missed it.\n\nNot because I was impatient. Because the threat came from inside.",
      emotion: 'reflective_haunted',
      variation_id: 'night_shift_v1'
    }],
    requiredState: {
      patterns: { patience: { min: 50 } }
    },
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['marcus_night_shift_shared', 'marcus_breach_hinted']
      }
    ],
    choices: [
      {
        choiceId: 'night_inside',
        text: "From inside? What happened?",
        nextNodeId: 'marcus_vulnerability_arc',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      },
      {
        choiceId: 'night_wisdom',
        text: "Active waiting. That's how you see patterns others miss.",
        nextNodeId: 'marcus_trust_philosophy',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'marcus',
          trustChange: 1
        }
      }
    ],
    tags: ['marcus_arc', 'pattern_unlock', 'patience', 'foreshadowing']
  },

  // ============= CAREER MENTION NODES (Invisible Depth) =============
  // These nodes appear when player has achieved specific pattern combinations
  // The career connection emerges naturally through Marcus's dialogue

  {
    nodeId: 'marcus_career_reflection_coordinator',
    speaker: 'Marcus Thompson',
    content: [
      {
        text: "You know what I see in you? The same thing that makes the best healthcare coordinators exceptional.\n\nIt's not just patience, though you've got plenty of that. It's the way you help without taking over. You create space for people to figure things out themselves.\n\nBirmingham's medical district is one of the largest in the Southeast. And the patients who fall through the cracks? They don't need more doctors. They need advocates who know how to navigate the system AND care enough to do it right.\n\nThat's what you'd be good at.",
        emotion: 'thoughtful',
        variation_id: 'career_coordinator_v1'
      }
    ],
    requiredState: {
      patterns: { helping: { min: 6 }, patience: { min: 3 } }
    },
    onEnter: [
      {
        characterId: 'marcus',
        addGlobalFlags: ['combo_healers_path_achieved', 'marcus_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'coordinator_curious',
        text: "What does a healthcare coordinator actually do day-to-day?",
        nextNodeId: 'marcus_trust_philosophy',
        pattern: 'exploring',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'coordinator_moved',
        text: "I never thought about healthcare that way.",
        nextNodeId: 'marcus_trust_philosophy',
        pattern: 'patience'
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'healthcare']
  },

  {
    nodeId: 'marcus_career_reflection_researcher',
    speaker: 'Marcus Thompson',
    content: [
      {
        text: "You've got the analytical mind of a researcher, but you lead with empathy. That combination? Rare as hell.\n\nMedical research isn't just data crunching. The breakthroughs come from people who can see the humanity in the numbers. Who ask 'what does this mean for actual patients?' instead of just 'what's the p-value?'\n\nUAB is a leading research hospital. They need people who can bridge the gap between bench science and bedside care. Scientists who remember that every data point was someone's worst day.\n\nYou think like that.",
        emotion: 'impressed',
        variation_id: 'career_researcher_v1'
      }
    ],
    requiredState: {
      patterns: { analytical: { min: 5 }, helping: { min: 4 } }
    },
    onEnter: [
      {
        characterId: 'marcus',
        addGlobalFlags: ['combo_medical_detective_achieved', 'marcus_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'researcher_curious',
        text: "What kind of research happens at UAB?",
        nextNodeId: 'marcus_trust_philosophy',
        pattern: 'exploring',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'researcher_humble',
        text: "I just try to understand what's actually going on.",
        nextNodeId: 'marcus_trust_philosophy',
        pattern: 'analytical'
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'research']
  },

  {
    nodeId: 'marcus_career_reflection_educator',
    speaker: 'Marcus Thompson',
    content: [
      {
        text: "You remind me of the community health workers I've met. The ones who actually make a difference.\n\nThey're not doctors. They're translators. Between medical expertise and real people's lives. They take all the complicated health information and make it accessible. Human.\n\nMost health problems don't get solved in hospitals. They get solved in communities, by people who have the patience to meet folks where they are and the heart to keep showing up.\n\nYou've got both.",
        emotion: 'warm',
        variation_id: 'career_educator_v1'
      }
    ],
    requiredState: {
      patterns: { helping: { min: 5 }, patience: { min: 4 } }
    },
    onEnter: [
      {
        characterId: 'marcus',
        addGlobalFlags: ['combo_health_educator_achieved', 'marcus_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'educator_interested',
        text: "Making health accessible... that sounds meaningful.",
        nextNodeId: 'marcus_trust_philosophy',
        pattern: 'helping',
        skills: ['communication']
      },
      {
        choiceId: 'educator_practical',
        text: "How does someone get into community health work?",
        nextNodeId: 'marcus_trust_philosophy',
        pattern: 'exploring',
        skills: ['adaptability']
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'community_health']
  },


  // ============= DEEP DIVE: CRISIS TRIAGE =============
  {
    nodeId: 'marcus_deep_dive',
    speaker: 'Marcus',
    content: [
      {
        text: "You want to test the system? Really test it?\n\nThis is the scenario that keeps me awake. Sector 7 breach. 500 casualties. Communication lines overloaded.\n\nMost people freeze. They try to save everyone and save no one.\n\nTake the command console. Prioritize the flow. Do not hesitate.",
        emotion: 'intense_focused',
        variation_id: 'deep_dive_v1'
      }
    ],
    simulation: {
      type: 'dashboard_triage',
      title: 'Mass Casualty Response: Sector 7',
      taskDescription: 'A reactor breach has occurred. Casualties are flooding the system. Triage incoming reports to maximize survival. CRITICAL: prioritize life-threatening injuries over structural damage.',
      phase: 3,
      difficulty: 'mastery',
      variantId: 'marcus_crisis_phase3',
      timeLimit: 60,
      successThreshold: 90,
      initialContext: {
        items: [
          { id: '1', label: 'Hull Breach - Sector 7G', value: 95, priority: 'critical', trend: 'down' },
          { id: '2', label: 'Radiation Burns - Group A', value: 88, priority: 'critical', trend: 'up' },
          { id: '3', label: 'Panic Attack - Cafeteria', value: 45, priority: 'low', trend: 'stable' },
          { id: '4', label: 'Debris Clearance', value: 60, priority: 'medium', trend: 'stable' },
          { id: '5', label: 'Oxygen Failure - Med Bay', value: 92, priority: 'critical', trend: 'down' },
          { id: '6', label: 'Minor Lacerations', value: 30, priority: 'low', trend: 'stable' }
        ]
      },
      successFeedback: 'CASUALTY RATE MINIMIZED. CRITICAL SYSTEMS STABILIZED.',
      mode: 'fullscreen'
    },
    choices: [
      {
        choiceId: 'dive_success_triage',
        text: "The hard choices are made. The system held.",
        nextNodeId: 'marcus_deep_dive_success',
        pattern: 'analytical',
        skills: ['leadership', 'strategicThinking']
      },
      {
        choiceId: 'dive_success_healer',
        text: "We saved the ones we could.",
        nextNodeId: 'marcus_deep_dive_success',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'resilience']
      }
    ],
    tags: ['deep_dive', 'mastery', 'crisis_simulation']
  },

  {
    nodeId: 'marcus_deep_dive_success',
    speaker: 'Marcus',
    content: [
      {
        text: "You cleared the board. You ignored the noise and focused on the signal.\n\nIn the hospital... during the breach... I hesitated. I questioned the data. That hesitation cost lives.\n\nBut you didn't hesitate. Watching you work... it gives me hope. That next time, the system will hold.",
        emotion: 'relieved_proud',
        variation_id: 'deep_dive_success_v1',
        interaction: 'nod'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['marcus_mastery_achieved', 'marcus_crisis_ready']
      }
    ],
    choices: [
      {
        choiceId: 'dive_complete',
        text: "We're ready.",
        nextNodeId: 'marcus_simulation_automation', // Return to main flow context
        pattern: 'building',
        skills: ['leadership']
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // MYSTERY BREADCRUMBS
  // ═══════════════════════════════════════════════════════════════
  {
    nodeId: 'marcus_mystery_hint_1',
    speaker: 'Marcus',
    requiredState: {
      trust: { min: 5 }
    },
    content: [
      {
        text: "I check the logs every night. Security protocol. But there is a pattern I cannot explain.\n\nEvery day at 3:33 AM, the station's internal clock syncs. Not with Greenwich. Not with atomic time.\n\nIt syncs with the pulse of the passengers. Biological rhythm overrides digital time. That... should not be possible.",
        emotion: 'mysterious',
        variation_id: 'mystery_hint_1_v1'
      }
    ],
    choices: [
      {
        choiceId: 'marcus_mystery_ask',
        text: "Are we powering the station?",
        nextNodeId: 'marcus_mystery_response_1',
        pattern: 'analytical'
      },
      {
        choiceId: 'marcus_mystery_accept',
        text: "Maybe we ARE the station.",
        nextNodeId: 'marcus_hub_return',
        pattern: 'exploring'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },
  {
    nodeId: 'marcus_mystery_response_1',
    speaker: 'Marcus',
    content: [
      {
        text: "Powering it? No. We are dreaming it.\n\nThe dataflow isn't electricity. It's memory. I saw a packet yesterday that looked exactly like a childhood fear I never wrote down.\n\nBe careful what you remember here. It might end up in the architecture.",
        emotion: 'concerned',
        variation_id: 'mystery_response_1_v1'
      }
    ],
    onEnter: [
      {
        characterId: 'marcus',
        addKnowledgeFlags: ['marcus_mystery_noticed']
      }
    ],
    choices: [
      {
        choiceId: 'marcus_mystery_return',
        text: "I'll keep that in mind.",
        nextNodeId: 'marcus_hub_return',
        pattern: 'helping'
      }
    ]
  },
  {
    nodeId: 'marcus_hub_return',
    speaker: 'Marcus',
    content: [{
      text: "I need to run diagnostics on these unexpected packets. Stay safe out there.",
      emotion: 'thoughtful',
      variation_id: 'hub_return_v1'
    }],
    choices: []
  },

  // ============= TRUST RECOVERY SYSTEM =============
  {
    nodeId: 'marcus_trust_recovery',
    speaker: 'Marcus',
    content: [{
      text: "You returned. I did not expect that.\n\nI am difficult. I know this. My systems require precision. My trust requires time. Most people do not have patience for that.\n\nBut you came back. That suggests... resilience.",
      emotion: 'guarded',
      variation_id: 'trust_recovery_v1',
      voiceVariations: {
        patience: "You returned. And you did not rush.\n\nMost people want quick rapport. Quick trust. That is not how I operate.\n\nBut you waited. That is... appreciated.",
        helping: "You returned. Despite how I behaved.\n\nI push people away when systems feel threatened. Protective protocol.\n\nBut you saw past the defenses. That matters.",
        analytical: "You returned. I have been processing why.\n\nMy trust algorithms are complex. Most people fail the initial checks.\n\nBut you persisted. That is useful data.",
        building: "You returned. To rebuild what we started.\n\nI construct walls when relationships destabilize. Security architecture.\n\nBut you are still building bridges. I respect that.",
        exploring: "You returned. Curious despite the barriers.\n\nMost people leave when systems become opaque.\n\nBut you stayed interested. That is... unexpected."
      }
    }],
    requiredState: {
      trust: { max: 3 }
    },
    choices: [
      {
        choiceId: 'recovery_respect',
        text: "Trust takes time. I understand that.",
        nextNodeId: 'marcus_trust_restored',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2,
          addKnowledgeFlags: ['marcus_trust_repair_attempted']
        }
      },
      {
        choiceId: 'recovery_systems',
        text: "Good systems have security measures. So do good people.",
        nextNodeId: 'marcus_trust_restored',
        pattern: 'analytical',
        skills: ['systemsThinking', 'emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2,
          addKnowledgeFlags: ['marcus_trust_repair_attempted']
        }
      },
      {
        choiceId: 'recovery_persistence',
        text: "Important connections are worth the effort.",
        nextNodeId: 'marcus_trust_restored',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2,
          addKnowledgeFlags: ['marcus_trust_repair_attempted']
        }
      }
    ],
    tags: ['trust_recovery', 'marcus_arc', 'repair']
  },

  {
    nodeId: 'marcus_trust_restored',
    speaker: 'Marcus',
    content: [{
      text: "Very well. I will lower the firewall. Slightly.\n\nYou have demonstrated patience. That is rare. Most people want access without earning it.\n\nI am still cautious. But I am willing to proceed. One verified step at a time.",
      emotion: 'cautious',
      variation_id: 'trust_restored_v1',
      voiceVariations: {
        patience: "Very well. Lowering defenses. Incrementally.\n\nYou did not rush. That earned you access.\n\nOne step at a time. That is how trust is built.",
        helping: "Very well. I will try again.\n\nYou came back not to fix me, but to understand me.\n\nThat distinction matters. Thank you.",
        analytical: "Very well. Adjusting trust parameters.\n\nYour persistence provided useful validation data.\n\nProceeding with cautious optimism.",
        building: "Very well. Rebuilding the connection.\n\nYou kept building bridges even when I burned them.\n\nThat persistence... it means something.",
        exploring: "Very well. Opening access.\n\nYour curiosity outlasted my defenses.\n\nLet us see where this leads."
      }
    }],
    onEnter: [
      {
        characterId: 'marcus',
        trustChange: 1,
        addKnowledgeFlags: ['marcus_trust_repaired']
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_recovery',
        text: "Tell me about your work here.",
        nextNodeId: 'marcus_automation_lesson',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'continue_from_recovery_origin',
        text: "What brought you to this station?",
        nextNodeId: 'marcus_origin_story',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['trust_recovery', 'marcus_arc', 'fresh_start']
  },

  // ===== SKILL COMBO UNLOCK NODE: Technical Storyteller =====
  // Requires: technical_storyteller combo (technicalLiteracy + communication)
  {
    nodeId: 'marcus_translation_master',
    speaker: 'Marcus Chen',
    requiredState: {
      requiredCombos: ['technical_storyteller']
    },
    content: [{
      text: "You know what separates good healthcare from great healthcare?\n\nIt's not just knowing the medicine. It's being able to explain it so a scared patient at 3 AM actually understands what's happening to them.\n\nYou've got both—the technical depth and the human touch. That's rare.\n\nIn this field, you'll be the one translating between the machines and the humans. That's a superpower.",
      emotion: 'admiring',
      variation_id: 'translation_master_v1'
    }],
    onEnter: [{
      characterId: 'marcus',
      addKnowledgeFlags: ['skill_combo_unlock_seen_marcus_translation_master']
    }],
    choices: [
      {
        choiceId: 'translation_how',
        text: "How did you learn to explain complex things simply?",
        nextNodeId: 'marcus_patient_story',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'translation_apply',
        text: "I want to be that bridge for people.",
        nextNodeId: 'marcus_hub_return',
        pattern: 'helping',
        skills: ['communication', 'technicalLiteracy']
      }
    ],
    tags: ['skill_combo_unlock', 'technical_storyteller', 'marcus_wisdom']
  }
]

export const marcusDialogueNodes = nodes

export const marcusEntryPoints = {
  INTRODUCTION: 'marcus_intro',
  ORIGIN_STORY: 'marcus_origin_story',
  AUTOMATION_LESSON: 'marcus_automation_lesson',
  VULNERABILITY_ARC: 'marcus_vulnerability_arc',
  PATIENT_STORY: 'marcus_patient_story',
  HIGHEST_TRUST: 'marcus_highest_trust',
  RECIPROCITY: 'marcus_reciprocity_intro',
  ETHICS: 'marcus_ethics_scale',
  ANALYTICAL_BRANCH: 'marcus_analytical_branch',
  BUILDING_BRANCH: 'marcus_building_branch',
  EXPLORING_BRANCH: 'marcus_exploring_branch',
  PATIENCE_BRANCH: 'marcus_patience_branch',
  HELPING_BRANCH: 'marcus_helping_branch',
  // New entry points for expanded content
  INSIGHT_DATA_DIGNITY: 'marcus_insight_data_dignity',
  INSIGHT_CONSENT: 'marcus_insight_consent_illusion',
  INSIGHT_INFORMED_CHOICE: 'marcus_insight_informed_choice',
  CHALLENGE_ADOPTION: 'marcus_challenge_adoption',
  CHALLENGE_CHAMPIONS: 'marcus_challenge_champions',
  REFLECTION_PREMED: 'marcus_reflection_before_security',
  REFLECTION_HEALER: 'marcus_reflection_healer',
  CONNECTION_SHARED_BURDEN: 'marcus_connection_shared_burden'
} as const

export const marcusDialogueGraph: DialogueGraph = {
  version: '2.0.0',
  nodes: new Map(nodes.map(n => [n.nodeId, n])),
  startNodeId: 'marcus_intro',
  metadata: {
    title: 'Marcus Arc - The Breach',
    author: 'System',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: nodes.length,
    totalChoices: nodes.reduce((acc, n) => acc + n.choices.length, 0)
  }
}
