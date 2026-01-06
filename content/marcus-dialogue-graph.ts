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
      text: "My capacity is exceeded. One user becomes ten. Ten becomes a hundred. Every single unit requires a personal welcome, a troubleshoot, a follow-up. I have not entered sleep mode in three cycles.",
      emotion: 'exhausted',
      microAction: 'He rubs his temples, surrounded by buzzing message alerts.',
      variation_id: 'default',
      patternReflection: [
        { pattern: 'helping', minLevel: 4, altText: "My capacity is exceeded. One user becomes ten. Ten becomes a hundred.\n\n*He pauses, noticing something in your expression.*\n\nYou're already thinking about how to help. I recognize that look. Just... don't burn yourself the way I have.", altEmotion: 'warning' },
        { pattern: 'patience', minLevel: 4, altText: "My capacity is exceeded. One user becomes ten. Ten becomes a hundred.\n\n*He takes a breath, steadied by your calm presence.*\n\nYou're not rushing to fix this. That is... appreciated. Most people throw solutions before they understand the problem.", altEmotion: 'grateful' }
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
          patience: "Before we solve anything—when did you last rest?"
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
      }
    ]
  },
  {
    nodeId: 'marcus_interrupt_acknowledged',
    speaker: 'Marcus',
    content: [{
      text: "You... noticed. Most would have pushed for answers. I appreciate the space.",
      emotion: 'grateful',
      microAction: 'He takes a deep breath, some tension leaving his shoulders.',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'offer_help',
        text: "When you're ready, let's find a better way to handle this load.",
        nextNodeId: 'marcus_automation_lesson',
        pattern: 'helping'
      },
      {
        choiceId: 'acknowledge_struggle',
        text: "The station asks a lot of its people. That's worth remembering.",
        nextNodeId: 'marcus_why_here',
        pattern: 'patience'
      }
    ]
  },

  // ============= ORIGIN STORY ARC =============
  {
    nodeId: 'marcus_origin_story',
    speaker: 'Marcus',
    content: [{
      text: "*He pauses, fingers hovering over the keyboard.*\n\nUnsustainable. Yes. That is the accurate diagnosis.\n\n*Looks at you with tired eyes.*\n\nI was not always... this way. Before the station, I was a security analyst. Children's hospital. Birmingham General's pediatric wing.\n\n*His voice softens.*\n\nI built systems to protect the most vulnerable data in the world. Medical records of children. Their treatments. Their families' information.",
      emotion: 'reflective',
      variation_id: 'origin_v1',
      patternReflection: [
        { pattern: 'analytical', minLevel: 4, altText: "*He pauses, recognizing something in your questions.*\n\nYou think in systems too. Unsustainable—that is an accurate diagnosis.\n\nBefore this, I was security. Children's hospital. Birmingham General.\n\n*A faint appreciation in his voice.*\n\nYou understand that systems have breaking points. Most people don't see the structure until it fails.", altEmotion: 'recognized' },
        { pattern: 'building', minLevel: 4, altText: "*He pauses, noting how you approached the problem.*\n\nUnsustainable. Yes. You see it as something to *fix*, not just describe.\n\nBefore this, I built security systems. Children's hospital.\n\n*Slight nod.*\n\nBuilders recognize builders. We see broken things and cannot rest until they work.", altEmotion: 'kindred' }
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
        skills: ['criticalThinking']
      },
      {
        choiceId: 'children_focus',
        text: "Working with children's data. That takes a special kind of care.",
        nextNodeId: 'marcus_children_care',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
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
      text: "*Long pause. His jaw tightens.*\n\nI did not leave. I was... removed. After.\n\n*He catches himself.*\n\nThere was an incident. One I am not ready to discuss with someone I just met.\n\n*Looks at his screens.*\n\nBut the station found me. Offered me purpose again. A chance to build systems where bureaucracy cannot block critical action.\n\nThat is why I am here. Overworked, yes. But here by choice.",
      emotion: 'guarded',
      variation_id: 'why_left_v1'
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
      }
    ],
    tags: ['marcus_arc', 'foreshadowing']
  },
  {
    nodeId: 'marcus_calling',
    speaker: 'Marcus',
    content: [{
      text: "*Something flickers in his eyes - a spark of the person he was before the exhaustion.*\n\nMy father was a network administrator at UAB Hospital. Twenty-three years. He showed me what invisible work looks like - the infrastructure nobody notices until it fails.\n\n*Taps his desk.*\n\nBut I saw it differently. He maintained systems. I wanted to protect them. Every firewall is a promise: your data is safe with us.\n\n*Voice hardens.*\n\nI learned what happens when that promise breaks.",
      emotion: 'determined',
      variation_id: 'calling_v1'
    }],
    choices: [
      {
        choiceId: 'promise_broken',
        text: "When did you learn that?",
        nextNodeId: 'marcus_breach_hint',
        pattern: 'analytical',
        skills: ['criticalThinking'],
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
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['marcus_arc', 'backstory']
  },
  {
    nodeId: 'marcus_children_care',
    speaker: 'Marcus',
    content: [{
      text: "*His expression softens unexpectedly.*\n\nChildren cannot protect themselves. Their medical data - diagnoses, treatments, family histories - it follows them forever. A breach when they are eight affects their insurance at eighteen. Their employment at twenty-eight.\n\n*Quieter.*\n\nI took that personally. Every record was someone's child. Someone's future.\n\n*Pause.*\n\nThat is why... when things went wrong... it was not abstract. It was faces. Names. Kids I had seen in the hallways.",
      emotion: 'tender',
      variation_id: 'children_v1',
      patternReflection: [
        { pattern: 'helping', minLevel: 4, altText: "*His expression softens, recognizing something familiar in you.*\n\nYou understand. Children cannot protect themselves.\n\nA breach at eight affects insurance at eighteen. Employment at twenty-eight. Every record was someone's future.\n\n*He meets your eyes.*\n\nYou feel it too—the weight of protecting those who cannot protect themselves. That is why I trust you with this.", altEmotion: 'connected' },
        { pattern: 'exploring', minLevel: 4, altText: "*His expression shifts as he watches your curiosity.*\n\nYou want to understand the *why*. Good.\n\nChildren's data follows them forever. A breach at eight affects insurance at eighteen. That is the system. Cold. Consequential.\n\n*Pause.*\n\nBut you are asking about the human cost. That is the question most people forget to ask.", altEmotion: 'appreciative' }
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
        skills: ['communication']
      }
    ],
    tags: ['marcus_arc', 'backstory']
  },
  {
    nodeId: 'marcus_father_legacy',
    speaker: 'Marcus',
    content: [{
      text: "*A rare, small smile.*\n\nHe died three years before... before I came to the station. Heart attack at his desk. Ironic, for a hospital employee.\n\n*Looks at his monitors.*\n\nBut yes. He taught me that systems are only as strong as the people who maintain them. And that invisible work matters most.\n\nI try to honor that. Even when the work breaks me.",
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
      }
    ],
    tags: ['marcus_arc', 'backstory']
  },
  {
    nodeId: 'marcus_breach_hint',
    speaker: 'Marcus',
    content: [{
      text: "*His hands still on the keyboard. Silence stretches.*\n\n...\n\n*Voice barely above a whisper.*\n\nThere was a night. Three years ago. A ransomware attack that should have been stopped.\n\nI saw it coming. Flagged it. Management said the patch could wait.\n\n*He shakes his head.*\n\nBut that is... that is a story for another time. When trust is built. When you understand why I cannot let it happen again.",
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
      text: "*He gestures at the station around them.*\n\nThe station found me at my lowest. Offered something I had lost: agency.\n\nIn the hospital, I had expertise but no authority. I could see threats, but not act on them without approval. Here?\n\n*Taps his terminal.*\n\nHere, I build the systems. I set the protocols. If I see a vulnerability, I patch it. No committees. No quarterly reviews.\n\n*Quieter.*\n\nIt is exhausting. But it is mine.",
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
          helping: "Having control over how you help—that's important.",
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
        skills: ['systemsThinking']
      }
    ],
    tags: ['marcus_arc', 'philosophy']
  },

  // ============= AUTOMATION/WORKFLOW ARC =============
  {
    nodeId: 'marcus_automation_lesson',
    speaker: 'Marcus',
    content: [{
      text: "However, the users require *connection*. If I send auto-replies, retention drops. The community architecture is built on trust.",
      emotion: 'skeptical',
      microAction: 'He gestures to the glowing "Trust" metric on his dash, which is plummeting.',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'fake_it',
        text: "They won't know the difference if the script is good.",
        nextNodeId: 'marcus_fail_trust',
        pattern: 'analytical'
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
        skills: ['criticalThinking']
      }
    ]
  },
  {
    nodeId: 'marcus_trust_philosophy',
    speaker: 'Marcus',
    content: [{
      text: "*His eyes light up - you've touched something he cares about.*\n\nTrust is not binary. It is gradient. Response time, consistency, accuracy - these create baseline trust. But deep trust?\n\n*Leans forward.*\n\nDeep trust comes from vulnerability reciprocated. When a user shares something sensitive, and you handle it with care. When you admit mistakes before they find them.\n\n*Pause.*\n\nIn healthcare, we measured trust by whether patients told us the full truth about symptoms. In security, by whether staff reported their own errors.\n\nHere? I measure it by whether travelers return.",
      emotion: 'engaged',
      variation_id: 'trust_v1',
      patternReflection: [
        { pattern: 'analytical', minLevel: 4, altText: "*His eyes light up - you've touched something he cares about.*\n\nYou think systematically. Good. Trust IS a system.\n\nResponse time, consistency, accuracy - these create baseline trust. But deep trust requires something more: vulnerability reciprocated.\n\n*Nods at you.*\n\nYou understand metrics. But do you understand what they cannot measure?", altEmotion: 'knowing' }
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
          addKnowledgeFlags: ['unlocked_hubspot_breeze'],
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
      text: "It is... quiet. The queue is clearing. Sentinel scores are rising. The users register as 'heard'.\n\n*He watches the metrics stabilize.*\n\nYou understand triage. That is rare. Most people want to solve everything at once. You knew to filter first.",
      emotion: 'relieved',
      variation_id: 'default',
      patternReflection: [
        { pattern: 'analytical', minLevel: 4, altText: "It is... quiet. The queue is clearing. Sentinel scores are rising.\n\n*He watches you with new respect.*\n\nYou approached this like a system, not a crisis. Filter, then process. Most panic and throw resources. You found the bottleneck first.\n\nThat is how I was trained to think. Before everything went wrong.", altEmotion: 'impressed' },
        { pattern: 'building', minLevel: 4, altText: "It is... quiet. The queue is clearing.\n\n*He watches the metrics with something like wonder.*\n\nYou did not just fix it. You *built* something. A system that will keep working after we walk away.\n\nThat is the difference between a patch and a solution. You understand that.", altEmotion: 'grateful_impressed' }
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
      text: "*His expression shifts - something old surfacing.*\n\nYes. Triage. In the hospital it was not messages. It was systems. Which server to save when the attack hit multiple vectors.\n\n*Stares at his hands.*\n\nWe had protocols. I followed them. But protocols assume ideal conditions. They assume you have time.\n\n*Quieter.*\n\nSometimes you do not have time. And then you choose. Life support systems or patient records. Immediate survival or long-term damage.\n\n*Meets your eyes.*\n\nThat night, I chose correctly. And still, three children did not survive.",
      emotion: 'haunted',
      variation_id: 'hospital_triage_v1',
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
      }
    ],
    tags: ['marcus_arc', 'vulnerability']
  },
  {
    nodeId: 'marcus_tragedy_response',
    speaker: 'Marcus',
    content: [{
      text: "*Long silence. Then a slow nod.*\n\nTragedy. Yes. That is the word I have avoided.\n\nI called it failure. My failure. For three years.\n\n*Looks at the cleared message queue.*\n\nBut tragedy... tragedy implies forces beyond control. It does not absolve responsibility. But it acknowledges complexity.\n\n*Quieter.*\n\nI am not sure I am ready to accept that. But thank you for offering it.",
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
      text: "It resembles my output. But... omnipresent. Simultaneous.\n\n*Studies the interface with growing interest.*\n\nThis is not automation. This is amplification. My voice, at scale, without dilution.",
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
      text: "*He stops. Actually stops.*\n\nEthical implications. Yes.\n\n*Turns to face you fully.*\n\nIn healthcare, we had ethics boards. Every system that touched patient data required review. Who can access. How long data persists. What happens when someone dies.\n\n*Gestures at his amplification system.*\n\nBut here? Speed often overrides scrutiny. We build first, question later.\n\nThat is how my hospital failed. Audit pushed to next quarter. Patch delayed for budget approval.\n\n*Quieter.*\n\nYou are right to ask. I should build ethics into the architecture, not bolt it on after.",
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
      text: "*A spark in his eyes - you have touched something important.*\n\nStandard. Yes. That is what I tried to advocate for. Before.\n\n*Opens a new window on his terminal.*\n\nI have been drafting something. A framework. 'Ethical Fail-Safes in Healthcare Technology.'\n\nEvery system has circuit breakers for technical failures. Why not for ethical ones?\n\n*Scrolls through his notes.*\n\nWhen a system affects patient care, it should require human confirmation above certain thresholds. When data patterns suggest discrimination, alerts should trigger before deployment.\n\n*Looks at you.*\n\nI could not build this at the hospital. Too radical. But here? Here, I have authority.",
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
      }
    ],
    tags: ['marcus_arc', 'ethics', 'redemption']
  },
  {
    nodeId: 'marcus_ethics_practical',
    speaker: 'Marcus',
    content: [{
      text: "*He pulls up a diagram - something he has clearly been working on alone.*\n\nPractically? Layers.\n\nLayer one: Consent verification. Not just legal compliance - actual understanding.\n\nLayer two: Data minimization. Collect only what is necessary. Delete when purpose is fulfilled.\n\nLayer three: Audit trails. Every access logged. Every decision traceable.\n\n*Points to a red section.*\n\nLayer four: Human-in-the-loop for high-stakes decisions. Algorithms can recommend. Humans must confirm.\n\n*Quieter.*\n\nLayer four is where my hospital failed. The algorithm recommended delaying the patch. No human overrode it.",
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
      text: "*His hands stop moving.*\n\n...\n\n*Voice tight.*\n\nI was the human. I was layer four.\n\nI flagged the vulnerability. I recommended immediate action. But I did not have the authority to act unilaterally.\n\n*Looks at his hands.*\n\nIn my framework, I would have had that authority. Emergency override for clear and present threats. Document after, not before.\n\n*Meets your eyes.*\n\nI designed this framework because of what I could not do. Every feature is a scar.",
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
      text: "*He hesitates. Then slowly nods.*\n\nShare it. Yes.\n\nI have kept this private. Personal project. Penance, perhaps.\n\n*Opens a export menu.*\n\nBut if it could prevent others from facing what I faced... that would give the work meaning beyond my guilt.\n\n*Looks at you.*\n\nZara mentioned similar concerns. About algorithmic bias in healthcare systems. Perhaps we should collaborate.\n\n*A real smile - rare for him.*\n\nSee? You have already improved my workflow. Connection before content.",
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
      text: "It generated invalid dependencies. The build is failing.\n\n*Shakes his head.*\n\nToo broad. Too vague. The AI cannot architect what we have not specified.",
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
      text: "It... it parsed the intent. The plan is valid. I can implement this within safety parameters.\n\n*Studies the output.*\n\nYou understand something most do not. AI is not a replacement for thinking. It is an amplifier. And amplified confusion is worse than no tool at all.",
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
      text: "*He leans back, looking at his now-quiet terminal.*\n\nNext? Prevention.\n\nI have spent three years reacting. Building walls after the breach. Patching holes after the flood.\n\n*Stands, walks to the window.*\n\nBut the station has shown me something. The best systems predict failures before they happen. Graceful degradation. Early warning.\n\n*Turns back.*\n\nI want to build a system that detects ransomware patterns before they deploy. Not for here - for hospitals. For schools. For anyone protecting vulnerable data.\n\n*Quieter.*\n\nI cannot save those three children. But maybe I can save the next three.",
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
      }
    ],
    tags: ['marcus_arc', 'redemption', 'future']
  },
  {
    nodeId: 'marcus_collaboration_offer',
    speaker: 'Marcus',
    content: [{
      text: "*He stops. Looks at you with something approaching surprise.*\n\nHelp? You would...\n\n*Processes.*\n\nI have worked alone for three years. By choice. Trust issues, I suppose.\n\n*Small nod.*\n\nBut you have demonstrated understanding today. Of systems, yes. But also of... me.\n\n*Extends his hand.*\n\nWhen I am ready to build the next phase, I will call on you. If you are willing.\n\nThis station has too few people who ask 'how can I help' before asking 'what can I get.'",
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
      text: "*He looks at his terminal - messages flowing smoothly now, systems stable.*\n\nWill. Yes. The will to act when action is costly. The will to wait when patience is required. The will to share when secrecy is safer.\n\n*Meets your eyes.*\n\nYou have shown me something today. That building systems is not enough. I must also build connections.\n\n*A rare, genuine smile.*\n\nThank you. For seeing past the exhaustion to what I am trying to protect.",
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
      text: "*He pauses at his terminal. Then turns fully to face you.*\n\nActually... may I ask you something first?\n\nI have shared much today. Perhaps too much. But you have remained... present. Curious without being invasive.\n\n*Tilts his head.*\n\nWhy are you here? At the station? What are you trying to build?",
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
      text: "*He nods slowly.*\n\nExploring. I understand that. Before the hospital, I explored too. Tried different paths. Network admin like my father. Software development. Even considered medicine.\n\n*Looks at his screens.*\n\nExploration is not aimlessness. It is gathering data. Understanding the landscape before committing to a path.\n\n*Meets your eyes.*\n\nThe danger is exploring forever. At some point, you must choose. Build something. Even if it is not perfect.\n\nBut you seem to know that already. Your questions today were not random - they had direction.",
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
      text: "*Something softens in his expression.*\n\nHelp people. Yes. I see that in you.\n\nBut here is something I learned too late: you cannot help others if you do not protect yourself first.\n\n*Gestures at his exhausted state.*\n\nI burned myself out trying to protect everyone. And when I crashed, I protected no one.\n\n*Looks at you seriously.*\n\nService is noble. But sustainable service requires boundaries. Know your limits. Replenish your capacity.\n\nThe best helpers are not martyrs. They are systems - reliable, consistent, enduring.",
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
      text: "*His eyes light up - recognition.*\n\nSystems. Yes. I saw that in how you approached the workflow. You did not just solve problems - you understood underlying structures.\n\n*Nods.*\n\nAnalytical thinking is powerful. But remember: systems serve people, not the other way around.\n\n*Looks at his terminal.*\n\nI spent years optimizing systems and forgot why. The metrics became the goal, not the outcomes.\n\n*Meets your eyes.*\n\nStay connected to impact. Every optimization should trace back to someone helped. Otherwise, you are just moving numbers.",
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
      text: "*A slow nod.*\n\nBuilding something that lasts. That is ambition I respect.\n\nBut here is what no one tells builders: lasting things require maintenance. Nothing survives on its own.\n\n*Gestures at his systems.*\n\nThe hospital's security? Built to last. But it required vigilance, updates, advocacy. When those stopped, it crumbled.\n\n*Looks at you seriously.*\n\nBuild with maintenance in mind. Document everything. Train successors. The greatest buildings outlast their builders - but only if others can tend them.\n\nImmortality is not finishing. It is enabling continuation.",
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
      text: "*A rare, warm expression crosses his face.*\n\nHonesty. That is rare. Most people pretend certainty they do not have.\n\n*Leans back.*\n\nI was uncertain too. For years. Tried to force clarity. Chased prestige and stability. None of it felt right.\n\n*Quieter.*\n\nThe clarity came after the breach. In the wreckage, I found what mattered. Protection. Prevention. Purpose born from pain.\n\n*Looks at you.*\n\nI do not wish crisis on you. But know this: uncertainty often resolves through action, not thought. Do something. Learn from it. Adjust.\n\nYou cannot think your way to clarity. You must build it.",
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
    content: [{
      text: "There is something I do not speak of. The incident that brought me to this station.\n\nChildren's Hospital. A ransomware attack. I was lead security. I *saw* the phishing attempt three days before. Flagged it. Management said the patch could wait until after the quarterly audit.\n\n*His voice drops.*\n\nLife support systems. Eighteen hours offline. Three children... did not survive the delay.\n\nI could not prevent what I could not authorize. The breach was not technical. It was bureaucratic.",
      emotion: 'haunted',
      microAction: 'His hands clench, then slowly release.',
      variation_id: 'vulnerability_v1',
      richEffectContext: 'error'
    }],
    requiredState: {
      trust: { min: 6 }
    },
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
        skills: ['systemsThinking']
      },
      {
        choiceId: 'vuln_silence',
        text: "[Hold space for his grief. Some wounds don't need words.]",
        nextNodeId: 'marcus_vulnerability_reflection',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'marcus',
          trustChange: 2
        }
      }
    ],
    tags: ['vulnerability_arc', 'marcus_arc', 'emotional_core']
  },
  {
    nodeId: 'marcus_vulnerability_reflection',
    speaker: 'Marcus',
    content: [{
      text: "*He meets your eyes.*\n\nI became the operator so that bureaucracy would never block critical action again. Every workflow I architect now has fail-safes. Escalation paths that bypass approval chains when lives are at stake.\n\nThe station gave me that power. But some nights, I run the scenario again. Wondering if I could have found another way.\n\n*A pause.*\n\nYou are the first who has not tried to tell me it was 'meant to be.' Thank you for that.",
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
      text: "*He pulls up an old photo on his personal terminal. Three smiling faces.*\n\nLila was seven. Leukemia. Her treatment protocols required real-time data from multiple systems. When the ransomware hit, her infusion pump lost connectivity.\n\nManuel was four. Heart condition. The life support monitoring went dark for eighteen hours. By the time manual checks caught the arrhythmia...\n\n*Voice breaks slightly.*\n\nAmara was nine. Cystic fibrosis. The ventilator settings couldn't be adjusted remotely. The nurses did everything right. But without the data, 'right' wasn't enough.\n\n*Closes the photo.*\n\nThree children. Three families. One patch that could have waited 'until next quarter.'",
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
      text: "*He straightens. Something shifts in his posture - from grief to determination.*\n\nHonor. Yes. That is the word.\n\nI cannot undo what happened. But every system I build now carries their lesson. Every fail-safe, every override protocol, every ethics check point.\n\n*Opens his framework document.*\n\nThis is not penance. Penance implies debt that can be repaid. This is... continuation. They cannot grow up. But their impact can grow.\n\n*Looks at you.*\n\nThe prevention system I am building? It uses the attack pattern from that night. Lila, Manuel, Amara - their tragedy becomes the training data that protects the next Lila, Manuel, Amara.\n\n*Quiet conviction.*\n\nThat is not redemption. That is multiplication.",
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
      text: "*For the first time, a genuine smile.*\n\nYou have shown me something I did not expect to find at the station. Someone who can hold weight without trying to fix it. Who sees systems and people.\n\n*Extends his hand.*\n\nI do not offer partnership lightly. But if you are willing... I would welcome your collaboration on the prevention framework.\n\nNot as a favor. As equals. Building something that protects the vulnerable.\n\n*Quiet.*\n\nLila would have liked you. She always asked the nurses 'why' instead of just accepting. Just like you.",
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
      text: "*He pulls you aside, voice low.*\n\nThere is something else. Something I have told no one.\n\nThe night of the breach... I could have acted unilaterally. I had the access. The knowledge. I could have deployed the patch myself and apologized later.\n\n*His hands shake.*\n\nBut I followed protocol. Documented my concerns. Waited for approval. Did everything 'right.'\n\n*Meets your eyes.*\n\nThree children died because I respected a chain of command that did not respect urgency. I was complicit in my own disempowerment.\n\nThat is the guilt I carry. Not that I failed to see the threat. But that I saw it clearly and still did not act.",
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
      text: "*Tears he has clearly held for years.*\n\nImpossible. Yes. That is... that is what I could not see.\n\nI held myself to a standard no one could meet. Blamed myself for a system's failure.\n\n*Wipes his eyes.*\n\nThe station... it gives me authority now. But the guilt followed me here. Every override protocol I build is me trying to give past-Marcus permission he was denied.\n\n*Looks at you with something like hope.*\n\nBut you are right. The design was flawed. Not just me.\n\nThat does not absolve. But it... shares the weight.\n\n*Quiet.*\n\nThank you. For helping me see it was not just my failure.",
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
      text: "*He stands straighter than you have ever seen him.*\n\nAlone. That is how I have operated. By choice. By trauma.\n\nBut you have shown me that connection does not weaken protection. It strengthens it.\n\n*Looks at his terminal - systems running smoothly.*\n\nI built these systems to prevent breaches. But I built walls around myself that prevent healing.\n\n*Extends his hand.*\n\nNo more. From now on, the prevention framework is collaborative. Open source. Shared with anyone who protects the vulnerable.\n\nLila, Manuel, Amara... they will protect thousands. Through everyone who learns from what happened.\n\nThat is their legacy. Not my guilt. Their protection.\n\n*Genuine smile.*\n\nThank you. For helping me see that.",
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
      }
    ],
    tags: ['marcus_arc', 'resolution', 'transformation']
  },

  // ============= PATTERN-GATED BRANCHES =============
  {
    nodeId: 'marcus_analytical_branch',
    speaker: 'Marcus',
    content: [{
      text: "*He notices how you processed the information.*\n\nYou think in systems. I recognize that.\n\n*Pulls up a complex diagram.*\n\nMost people see problems. You see interconnections. Causes and effects. Cascading failures.\n\nThat is how I thought before the breach. It is also how I failed to convince others - I spoke in systems while they heard noise.\n\n*Looks at you.*\n\nLearn to translate. Your analytical mind is powerful. But if you cannot explain it to non-analysts, you will be as helpless as I was.",
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
      text: "*He pauses, considering.*\n\nI learned it wrong, then right.\n\nWrong: I dumbed things down. Removed nuance until the message was meaningless. Management nodded, did nothing.\n\n*Shakes his head.*\n\nRight: I learned to speak in stakes. Not 'the firewall has a vulnerability' but 'someone could access every patient's social security number in two hours.'\n\n*Meets your eyes.*\n\nSame truth. Different frame. Stakes people understand. Systems they do not.\n\nBut I learned this lesson after the breach. When it was too late.\n\nLearn it now. While it can still matter.",
      emotion: 'teaching',
      variation_id: 'translation_v1'
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
      text: "*Long pause.*\n\nEmotion. We miss emotion.\n\nSystems thinking is powerful. But humans do not operate on logic alone. Fear, pride, exhaustion - these shape decisions as much as data.\n\n*Looks at his hands.*\n\nThe manager who delayed the patch? Terrified of budget overruns. Exhausted from quarterly pressure. Acting on fear, not malice.\n\nI saw a technical problem. I should have seen a human one.\n\n*Meets your eyes.*\n\nSystems that ignore psychology fail. Build for humans, not processes. Processes cannot be afraid. Humans can.",
      emotion: 'wise',
      variation_id: 'blindspot_v1'
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
      text: "*He observes your hands-on approach.*\n\nYou want to build. To create. To make things exist.\n\nI understand that drive. It powered my early career.\n\n*Quieter.*\n\nBut here is what builders often forget: destruction is faster than creation. What takes months to build can be destroyed in seconds.\n\nThe ransomware that hit the hospital? Took three months to infiltrate. Took eighteen hours to devastate.\n\n*Looks at you.*\n\nBuild with resilience in mind. Assume failure. Design for recovery. The best builders are also the best anticipators of destruction.",
      emotion: 'teaching',
      variation_id: 'building_v1'
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
      text: "*He pulls up architectural diagrams.*\n\nRedundancy. Isolation. Graceful degradation.\n\nRedundancy: Every critical system has a backup. When life support lost connectivity, there should have been a local fallback.\n\nIsolation: Failures should not cascade. The ransomware spread because systems were too interconnected.\n\n*Points to a section.*\n\nGraceful degradation: When things fail, they should fail safely. Reduced function is better than no function.\n\n*Looks at you.*\n\nThe hospital was built for efficiency, not resilience. Efficient systems are fragile. Resilient systems are robust.\n\nBuild robust. Even when stakeholders want efficient.",
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
      text: "*He notices your curiosity.*\n\nYou ask many questions. Explore many paths.\n\nExploration is valuable. But it has risks.\n\n*Pauses.*\n\nI explored too long before the hospital. Sampled careers without committing. By the time I found my path, I was playing catch-up.\n\nAnd then... I was so focused on proving myself that I did not push back when I should have.\n\n*Meets your eyes.*\n\nExplore with intention. Not endlessly. Each exploration should narrow your focus, not expand it forever.",
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
      text: "*He considers carefully.*\n\nWhen the cost of not choosing exceeds the risk of choosing wrong.\n\n*Looks at his terminal.*\n\nI knew I wanted to work in security for months before I applied. Fear of commitment kept me exploring alternatives. That delay cost me experience that might have... might have mattered.\n\n*Quieter.*\n\nHere is the truth: you will never have perfect information. Waiting for certainty is its own choice - a choice to delay.\n\nAt some point, you must leap. The leap teaches you what no exploration can.\n\n*Meets your eyes.*\n\nBut choose something you can commit to fully. Half-commitment is worse than delayed commitment.",
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
      text: "*He observes your measured pace.*\n\nYou take your time. Consider before acting.\n\nPatience is wisdom. But it has shadows.\n\n*Voice drops.*\n\nI was patient the night of the breach. Waited for approval. Gave management time to 'understand the situation.'\n\nMy patience cost lives.\n\n*Looks at you.*\n\nSome situations do not permit patience. Learn to recognize them. Learn when 'wait and see' becomes 'wait and suffer.'\n\nPatience is a virtue. But knowing when to abandon it is wisdom.",
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
      text: "*He thinks carefully.*\n\nStakes. Reversibility. Window.\n\nStakes: What happens if this goes wrong? The higher the stakes, the lower the threshold for action.\n\nReversibility: Can the damage be undone? Irreversible consequences demand faster response.\n\nWindow: How long until the opportunity closes? Some decisions have expiration dates.\n\n*Looks at you.*\n\nThe breach had high stakes, irreversible consequences, and a closing window. I should have acted.\n\nMy patience was appropriate for low-stakes reversible situations. It was catastrophic for the opposite.\n\nKnow the difference. Your life may depend on it.",
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
      text: "*He notices your orientation toward others.*\n\nYou care about people. About impact. About service.\n\nI was the same. Still am.\n\n*Quieter.*\n\nBut here is what helpers must learn: you cannot help everyone. And trying to will destroy you.\n\n*Gestures at his exhausted state.*\n\nI tried to protect every patient, every system, every vulnerability. I spread myself so thin that when it mattered most, I had nothing left.\n\n*Meets your eyes.*\n\nLearn to triage your care. Focus where impact is highest. Let go of what you cannot control.\n\nIt feels like betrayal. It is actually wisdom.",
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
      text: "*He considers the weight of the question.*\n\nImpact. Capacity. Sustainability.\n\nImpact: Where can your help matter most? Some situations need your specific skills. Others do not.\n\nCapacity: What can you actually provide? Promising beyond capacity is worse than declining honestly.\n\nSustainability: Can you maintain this help? One-time intervention is different from ongoing support.\n\n*Quieter.*\n\nThe children at the hospital... I could not save them all. But I could protect the systems that protected them.\n\nI triaged wrong. Focused on people when I should have focused on infrastructure.\n\n*Looks at you.*\n\nSometimes the most helpful thing is not direct aid. It is building systems that help when you cannot be there.",
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
      text: 'I... I just need a minute. Everything is spinning.\n\n*He puts his head in his hands.*\n\nPower through. That is what they always say. But power is finite. And I have been running on empty for three years.',
      emotion: 'exhausted',
      variation_id: 'burnout_v1'
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
      text: "They detected the automation. 'Response 34B'? Retention is lost. Trust score is zero.\n\n*Shakes his head.*\n\nScripts without substance. I should have known better. The hospital taught me: people know when they are not being heard.",
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
      text: "*He pulls up a anonymized patient record on his screen.*\n\nPeople think data is just numbers. Zeros and ones. Abstract.\n\n*Points to a field.*\n\nBut this field - 'mental health diagnosis' - that is a teenager's worst fear made permanent. This one - 'genetic predisposition' - determines if someone gets insurance at forty.\n\n*Meets your eyes.*\n\nData has dignity. Every record represents a human who trusted someone with their truth. When we forget that, we become the threat we are supposed to prevent.\n\nThat is the first principle of medical tech ethics: data is not just information. It is someone's life story, compressed.",
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
      text: "*He laughs - but there is no humor in it.*\n\nConsent. The legal checkbox. 'I have read and agree to the terms.'\n\n*Shakes his head.*\n\nNobody reads them. A study showed it would take 76 work days per year to read all the privacy policies you encounter. So we click 'agree' and hope.\n\n*Leans forward.*\n\nThe illusion of consent is worse than no consent. It transfers responsibility to people who cannot possibly understand what they are agreeing to.\n\n*Quieter.*\n\nAt the hospital, parents signed consent forms while their children were in surgery. Stressed. Desperate. Agreeing to anything. That is not consent. That is coercion with paperwork.",
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
      text: "*His eyes light up - you have asked the right question.*\n\nTrue consent is informed choice. Not 'agree to everything' but 'understand each decision.'\n\n*Pulls up a prototype interface.*\n\nI have been designing something. Granular consent. Instead of one massive agreement, small choices at each step.\n\n'Share your location with your doctor? Yes / No / Only during appointments.'\n'Store your genetic data? Yes / No / Delete after treatment.'\n\n*Gestures at the screen.*\n\nEach choice is small enough to understand. The system remembers your preferences. You can change them anytime.\n\n*Quieter.*\n\nIt is more work for the developers. But it treats patients like adults capable of making real decisions.",
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
      text: "*He sighs heavily.*\n\nAdoption. The graveyard of good ideas.\n\n*Counts on his fingers.*\n\nHospitals do not adopt new systems because: they are expensive, they disrupt workflows, they require retraining staff, and they introduce new risks.\n\n*Looks at you.*\n\nEvery IT director I have spoken to says the same thing: 'Sounds great. Budget it for next fiscal year.' Then next year comes and there is always something more urgent.\n\n*Pause.*\n\nSo. How would you solve adoption? You have an ethical system that nobody wants to implement. What do you do?",
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
      text: "*He nods slowly.*\n\nRegulation. The hammer approach.\n\n*Pulls up HIPAA documentation.*\n\nHIPAA took years to implement. Created entire compliance industries. Cost billions.\n\nBut it also created a floor. A minimum standard everyone had to meet.\n\n*Looks at you thoughtfully.*\n\nYou are thinking systemically. If voluntary adoption fails, mandate it. The problem is timing - regulations lag technology by years. By the time consent laws pass, the damage may already be done.\n\nBut you are not wrong. Sometimes the only way to move institutions is to force them.",
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
      text: "*A genuine smile crosses his face.*\n\nPilot. Prove value. Expand.\n\nThat is exactly right. The hospital that adopted my security recommendations did it this way. One department. ICU. High stakes, visible results.\n\n*His expression darkens slightly.*\n\nBut there is a risk. Pilots can be sabotaged. Skeptical staff can ensure failure. Politics can kill good projects before they prove themselves.\n\n*Meets your eyes.*\n\nYou need champions. People inside the organization who believe in the change. Without internal advocates, external consultants are just expensive noise.\n\nI did not have enough champions at Birmingham General. That was one of my failures.",
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
      text: "*His jaw tightens.*\n\nWait for a crisis.\n\n*Long pause.*\n\nYou are not wrong. After the Equifax breach, credit monitoring became standard. After Target, PCI compliance got serious. After my hospital...\n\n*Voice drops.*\n\n...after Birmingham General, the state implemented mandatory notification laws.\n\nCrisis is an accelerant. It creates will where none existed.\n\n*Meets your eyes.*\n\nBut the cost. Three children. Thousands of exposed records. Families who will never trust healthcare systems again.\n\nI cannot recommend waiting for crisis. Even if it is effective.\n\nSome prices are too high.",
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
      text: "*He considers the question carefully.*\n\nChampions reveal themselves in small ways.\n\n*Counts on his fingers.*\n\nThey ask questions in meetings when everyone else is silent. They forward articles about security incidents to colleagues. They push back - politely - when shortcuts are suggested.\n\n*Leans back.*\n\nBut the strongest signal? They have been burned before. Someone who experienced a breach, a lawsuit, a patient complaint - they understand viscerally why prevention matters.\n\n*Looks at you.*\n\nPain creates advocates. Not always, but often. The question is whether their pain hardened them into cynics or forged them into fighters.\n\nI hope I am the latter. Some days I am not sure.",
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
      text: "*He stares at the ceiling, remembering.*\n\nBefore security, I wanted to be a doctor.\n\n*Small, sad laugh.*\n\nPre-med at UAB. Three years. I was good at the science, terrible at the detachment. Every cadaver had a name to me. Every case study was someone's tragedy.\n\n*Shakes his head.*\n\nA professor told me: 'Marcus, doctors need distance. You have too much empathy for direct patient care.'\n\n*Meets your eyes.*\n\nShe was right. I could not handle death in person. But I thought I could handle it at a distance - protecting systems, not bodies.\n\nI was wrong about that too. Distance does not protect you from grief. It just delays it.",
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
      text: "*He pauses. Blinks.*\n\nHealer. I have not thought of myself that way since... since before.\n\n*Looks at his hands.*\n\nWhen I was designing the hospital's security architecture, I called it 'preventive medicine.' The joke fell flat in meetings. But I meant it.\n\nAntiviruses are like vaccines. Firewalls are like immune systems. Incident response is like emergency surgery.\n\n*Quieter.*\n\nI just never expected the patient to die on my table.\n\n*Meets your eyes.*\n\nBut you are right. Healing is healing. Maybe it is time I remembered why I chose this work. Not just what I failed to prevent.",
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
      }
    ],
    tags: ['marcus_arc', 'reflection', 'healing']
  },

  // ============= CONNECTION NODES (Relationship building with player) =============
  {
    nodeId: 'marcus_connection_shared_burden',
    speaker: 'Marcus',
    content: [{
      text: "*He looks at you for a long moment.*\n\nYou carry something too. I can see it.\n\nNot the same weight as mine. But weight nonetheless. Everyone at the station has their reasons for being between who they were and who they are becoming.\n\n*Quieter.*\n\nI have shared my burden with you. That is... unusual for me. Most people get my competence. Few get my story.\n\n*Meets your eyes.*\n\nWould you... would you tell me something about yourself? Not everything. Just enough that I am not the only one exposed here.",
      emotion: 'vulnerable',
      variation_id: 'connection_burden_v1'
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
      text: "*He nods slowly, recognition in his eyes.*\n\nUncertainty. Yes. I know that weight.\n\nBefore the hospital, I changed directions three times. Felt like failure each time. Like I should have known from the start what I was meant to do.\n\n*Leans forward.*\n\nBut here is what I learned: nobody knows. The people who look certain? They are either lying or lucky. Most of us are building the path while we walk it.\n\n*Small smile.*\n\nYou are at the station. That means you are asking questions. That is more than most people do.\n\nUncertainty is not failure. It is honesty. And honest people build better futures than confident fools.",
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
      text: "*His expression softens.*\n\nPressure. Yes. I understand that intimately.\n\nMy father worked at UAB for twenty-three years. He expected me to surpass him. Not maliciously - he just believed in my potential. But his belief felt like a ceiling and a floor at once.\n\n*Quieter.*\n\nI tried to meet everyone's expectations. Burned out. Made mistakes. The breach happened when I was already running on empty.\n\n*Meets your eyes.*\n\nHere is what I wish someone had told me: expectations are invitations, not obligations. You can decline. You can negotiate. You can choose which ones serve you and release the rest.\n\nThe people who truly love you want your thriving, not their vision of your success.",
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
      text: "*He nods, no hint of offense.*\n\nThat is fair. Trust is earned, not demanded. And I have asked much of you already by sharing my story.\n\n*Small smile.*\n\nThe fact that you said 'not yet' instead of 'no' - that matters. It suggests openness, not closure.\n\n*Leans back.*\n\nI will not push. When you are ready - if you are ever ready - I will listen. That is what connection means. Not extraction of secrets, but availability when sharing feels safe.\n\nYou have shown me that kind of presence today. I hope to offer the same.",
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
      text: "*Marcus sets down his coffee. His usual measured demeanor softens.*\n\nYou care about people. I can see it in how you listen. So I will tell you something I do not share often.\n\n*Pause.*\n\nMy first patient was not a patient. She was a file. A four-year-old girl. Leukemia. Her records were in a system I was hired to secure.\n\n*Voice quieter.*\n\nI never met her. But I read her file to test access permissions. Treatment notes. Her mother's insurance disputes. A nurse's annotation: 'Brave girl. Smiled through the IV.'\n\n*Meets your eyes.*\n\nThat is when I understood. Every record is a person. Every breach is a betrayal of trust they never knew they gave.\n\nI have been protecting her ever since. Even though she is probably grown now. Even though she will never know my name.",
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
      text: "*Marcus leans back. The exhaustion is still there, but something else surfaces—hard-won wisdom.*\n\nYou are patient. That is rare. Most people want quick answers.\n\n*He gestures at the screens around them.*\n\nThe night shifts taught me patience. Three years of 11pm to 7am. Watching systems. Waiting for anomalies.\n\n*Quiet.*\n\nMost attacks happen at 3am. When defenses are lowest. When the human watching is tired. The attackers count on impatience. On the guard checking the clock instead of the logs.\n\n*Looks at you.*\n\nBut patience is not passive. It is active waiting. It is noticing the small things because you are not rushing to the big ones.\n\n*Almost to himself.*\n\nThat is what I was doing the night before the breach. Being patient. Watching. And still... I missed it.\n\nNot because I was impatient. Because the threat came from inside.",
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
        text: "*Marcus sets down his tablet, giving you his full attention.*\n\nYou know what I see in you? The same thing that makes the best healthcare coordinators exceptional.\n\nIt's not just patience—though you've got plenty of that. It's the way you help without taking over. You create space for people to figure things out themselves.\n\n*A knowing look.*\n\nBirmingham's medical district is one of the largest in the Southeast. And the patients who fall through the cracks? They don't need more doctors. They need advocates who know how to navigate the system AND care enough to do it right.\n\nThat's what you'd be good at.",
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
        text: "*Marcus leans forward with sudden intensity.*\n\nYou've got the analytical mind of a researcher, but you lead with empathy. That combination? Rare as hell.\n\nMedical research isn't just data crunching. The breakthroughs come from people who can see the humanity in the numbers—who ask 'what does this mean for actual patients?' instead of just 'what's the p-value?'\n\n*He gestures toward the hospital corridor.*\n\nUAB is a leading research hospital. They need people who can bridge the gap between bench science and bedside care. Scientists who remember that every data point was someone's worst day.\n\nYou think like that.",
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
        text: "*Marcus's expression softens.*\n\nYou remind me of the community health workers I've met. The ones who actually make a difference.\n\nThey're not doctors. They're translators—between medical expertise and real people's lives. They take all the complicated health information and make it... accessible. Human.\n\n*He pauses.*\n\nMost health problems don't get solved in hospitals. They get solved in communities, by people who have the patience to meet folks where they are and the heart to keep showing up.\n\nYou've got both.",
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
