import { DialogueNode, DialogueGraph } from '@/lib/dialogue-graph'

const nodes: DialogueNode[] = [
  {
    nodeId: 'marcus_intro',
    speaker: 'Marcus',
    content: [{
      text: "I'm drowning. One user becomes ten. Ten becomes a hundred. Every single one needs a personal welcome, a troubleshoot, a follow-up. I haven't slept in three cycles.",
      emotion: 'exhausted',
      microAction: 'He rubs his temples, surrounded by buzzing message alerts.',
      variation_id: 'default'
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
    nodeId: 'marcus_automation_lesson',
    speaker: 'Marcus',
    content: [{
      text: "But they want *connection*. If I send auto-replies, I lose them. The community is built on trust.",
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
      text: "A system? Show me. Because right now, I'm the bottleneck.",
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
      text: "No! That's just noise. They'll unsubscribe instantly.",
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
      text: "It's... quiet. The queue is clearing. And the sentiment score is rising. They feel heard.",
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
      text: "I can't write a hundred unique messages. My voice gets lost.",
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
      text: "It sounds like me. But... everywhere. All at once.",
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
      text: "The codebase is a mess of hotfixes. I'm afraid to touch the core.",
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
      text: "It just hallucinated a bunch of broken imports! The build is failing!",
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
      text: "It... it understood the intent. The plan is clean. I can implement this safely.",
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
  }
]

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