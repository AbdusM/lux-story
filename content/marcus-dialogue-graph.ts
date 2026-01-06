import { DialogueNode, DialogueGraph } from '@/lib/dialogue-graph'

const nodes: DialogueNode[] = [
  {
    nodeId: 'marcus_intro',
    speaker: 'Marcus',
    content: [{
      text: "My capacity is exceeded. One user becomes ten. Ten becomes a hundred. Every single unit requires a personal welcome, a troubleshoot, a follow-up. I have not entered sleep mode in three cycles.",
      emotion: 'exhausted',
      microAction: 'He rubs his temples, surrounded by buzzing message alerts.',
      variation_id: 'default',
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
        skills: ['resilience']
      },
      {
        choiceId: 'automate',
        text: 'You\'re doing the work of a machine. Let the machines do it.',
        nextNodeId: 'marcus_automation_lesson',
        pattern: 'helping',
        skills: ['leadership']
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
        nextNodeId: 'marcus_automation_lesson',
        pattern: 'patience'
      }
    ]
  },
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
        text: 'They won\'t know the difference if the script is good.',
        nextNodeId: 'marcus_fail_trust',
        pattern: 'analytical'
      },
      {
        choiceId: 'agentic_scale',
        text: 'Don\'t script it. Architect it. Let me show you how to build a triage system.',
        nextNodeId: 'marcus_simulation_automation', // Launches Simulation
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'systemsThinking'],
        visibleCondition: {
          patterns: {
            helping: { min: 2 } // Lowered for accessibility
          }
        }
      }
    ]
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
      successFeedback: '✓ OPTIMIZATION COMPLETE: Capacity stable at 5000/hr.'
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
      text: "It is... quiet. The queue is clearing. Sentinel scores are rising. The users register as 'heard'.",
      emotion: 'relieved',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'scale_content',
        text: 'Now let\'s handle the outreach. You need resonance at scale.',
        nextNodeId: 'marcus_jasper_intro'
      }
    ]
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
        nextNodeId: 'marcus_jasper_unlock', // Unlocks Jasper
        pattern: 'exploring'
      }
    ]
  },
  {
    nodeId: 'marcus_jasper_unlock',
    speaker: 'Marcus',
    content: [{
      text: "It resembles my output. But... omnipresent. Simultaneous.",
      emotion: 'empowered',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'architect_code',
        text: 'The code behind this needs structure too. You\'re patching bugs, not building systems.',
        nextNodeId: 'marcus_simulation_cursor',
        pattern: 'building',
        skills: ['digitalLiteracy', 'problemSolving']
      }
    ]
  },
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
      successFeedback: '✓ ARCHITECTURE PLAN APPROVED: Services decoupled.'
    },
    choices: [
      {
        choiceId: 'sim_rewrite',
        text: 'PROMPT: "Rewrite this entire file to be better."',
        nextNodeId: 'marcus_simulation_cursor_fail',
        pattern: 'exploring' // Intentionally inefficient
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
      text: "It generated invalid dependencies. The build is failing.",
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
      text: "It... it parsed the intent. The plan is valid. I can implement this within safety parameters.",
      emotion: 'relieved',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'finish_marcus',
        text: 'That is the nature of the Operator. You are not the hands; you are the will.',
        nextNodeId: 'hub_return',
        consequence: {
          characterId: 'marcus',
          trustChange: 5
        }
      }
    ]
  },
  {
    nodeId: 'hub_return',
    speaker: 'Narrator',
    content: [{
      text: 'You leave Marcus to his work. The station hums with new efficiency.',
      emotion: 'neutral',
      variation_id: 'hub_return_v1'
    }],
    choices: [] // End of arc - Engine returns to Hub or Loop
  },
  // ============= E2-063: MARCUS'S VULNERABILITY ARC =============
  // "The breach he couldn't prevent"
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
        nextNodeId: 'hub_return',
        pattern: 'patience'
      }
    ],
    tags: ['vulnerability_arc', 'marcus_arc']
  },
  {
    nodeId: 'marcus_burnout',
    speaker: 'Marcus',
    content: [{
      text: 'I... I just need a minute. Everything is spinning.',
      emotion: 'exhausted',
      variation_id: 'burnout_v1'
    }],
    choices: [{ choiceId: 'return', text: 'Back', nextNodeId: 'marcus_intro' }]
  },
  {
    nodeId: 'marcus_fail_trust',
    speaker: 'Marcus',
    content: [{
      text: "They detected the automation. 'Response 34B'? Retention is lost. Trust score is zero.",
      emotion: 'devastated',
      variation_id: 'fail_trust_v1'
    }],
    choices: [{ choiceId: 'return', text: 'Try again', nextNodeId: 'marcus_intro' }]
  }
]

export const marcusDialogueNodes = nodes

export const marcusDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(nodes.map(n => [n.nodeId, n])),
  startNodeId: 'marcus_intro',
  metadata: {
    title: 'Marcus Arc',
    author: 'System',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: nodes.length,
    totalChoices: nodes.reduce((acc, n) => acc + n.choices.length, 0)
  }
}