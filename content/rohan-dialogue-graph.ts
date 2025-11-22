/**
 * Rohan's Dialogue Graph
 * The Legacy Archaeologist - Platform 7 (The Substructure / Deep Tech)
 *
 * CHARACTER: The Guardian of the "Black Box"
 * Core Conflict: "AI Generation" vs. "Human Understanding"
 * Arc: From burned-out "Digital Janitor" to "Guardian of First Principles"
 * Mechanic: "The Debug" - Tracing a race condition in AI-generated spaghetti code
 * Theme: Inspired by the HN thread about "Vibe Coding" vs. "Deep Engineering"
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const rohanDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'rohan_introduction',
    speaker: 'Rohan',
    content: [
      {
        text: `*He's sitting on the floor, back against a server rack that hums with an ominous, uneven rhythm. He's drinking espresso from a thermos that looks like it's been dropped off a building.*

*He taps a laptop screen filled with cascading red text.*

Do you know what 'vibe coding' looks like when it hits production?

It looks like a $400 million database corruption because an LLM hallucinated a library that doesn't exist.`,
        emotion: 'exhausted_cynical',
        variation_id: 'rohan_intro_v1',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_intro_ask_slop',
        text: "Sounds like you're cleaning up a mess you didn't make.",
        nextNodeId: 'rohan_slop_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'problemSolving'],
        consequence: {
          characterId: 'rohan',
          trustChange: 2
        }
      },
      {
        choiceId: 'rohan_intro_technical',
        text: "Hallucinated dependency? Did it bypass the CI/CD pipeline?",
        nextNodeId: 'rohan_technical_bond',
        pattern: 'analytical',
        skills: ['technicalLiteracy', 'systemsThinking'],
        consequence: {
          characterId: 'rohan',
          trustChange: 1
        }
      },
      {
        choiceId: 'rohan_intro_future',
        text: "I thought AI was supposed to fix all this.",
        nextNodeId: 'rohan_ai_reality',
        pattern: 'exploring',
        skills: ['criticalThinking']
      }
    ],
    onEnter: [
      {
        characterId: 'rohan',
        setRelationshipStatus: 'stranger'
      }
    ],
    tags: ['introduction', 'rohan_arc']
  },

  {
    nodeId: 'rohan_slop_reveal',
    speaker: 'Rohan',
    content: [
      {
        text: `I haven't written new code in three years. I just act as a garbage collector for the '10x engineers'—which is just one guy and a GPT-6 subscription.

They generate terabytes of code. It passes the unit tests because they asked the AI to write the tests too.

But nobody *understands* it. Nobody knows why it works. So when it breaks... they call me.`,
        emotion: 'bitter',
        variation_id: 'slop_reveal_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_archaeologist',
        text: "You're not a janitor. You're an archaeologist.",
        nextNodeId: 'rohan_archeology_metaphor',
        pattern: 'building',
        skills: ['reframing', 'communication']
      },
      {
        choiceId: 'rohan_black_box',
        text: "We're building black boxes we can't look inside.",
        nextNodeId: 'rohan_black_box_scenario',
        pattern: 'analytical',
        skills: ['systemsThinking', 'criticalThinking']
      }
    ]
  },

  {
    nodeId: 'rohan_technical_bond',
    speaker: 'Rohan',
    content: [
      {
        text: `*He laughs, a dry, sharp sound.*

CI/CD? The pipeline was AI-generated too. It 'optimized' the safety checks right out of existence because they slowed down deployment.

We fired the junior devs who used to catch this stuff. 'Why pay juniors when AI is free?'

Now I'm the only human in the loop.`,
        emotion: 'dark_humor',
        variation_id: 'technical_bond_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_human_firewall',
        text: "You're the human firewall.",
        nextNodeId: 'rohan_archeology_metaphor',
        pattern: 'building',
        skills: ['leadership', 'resilience']
      }
    ]
  },

  {
    nodeId: 'rohan_archeology_metaphor',
    speaker: 'Rohan',
    content: [
      {
        text: `Archaeologist... I like that. Digging through layers of sediment.

Layer 1: Clean AI code.
Layer 2: Patchy human fixes.
Layer 3: The ancient COBOL core that actually moves the money.

The AI is terrified of Layer 3. It hallucinates wildly when it touches bare metal.`,
        emotion: 'reflective',
        variation_id: 'archeology_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_start_sim',
        text: "Show me what you're digging into right now.",
        nextNodeId: 'rohan_simulation_start',
        pattern: 'analytical',
        skills: ['curiosity']
      }
    ]
  },

  // ============= THE SIMULATION: THE BLACK BOX DEBUG =============
  {
    nodeId: 'rohan_simulation_start',
    speaker: 'Rohan',
    content: [
      {
        text: `*He slides the laptop toward you. The terminal is blinking red.*

**CRITICAL ALERT: TRANSACTION LEDGER IMBALANCE**
**VELOCITY:** -$10,000 / sec
**SOURCE:** Unknown Service Mesh

The AI suggests a 'rollback.' But if I rollback, we lose the last hour of trades. Millions of dollars.

There's a bug in the concurrency logic. Find it.`,
        emotion: 'focused_crisis',
        variation_id: 'sim_start_v1',
        richEffectContext: 'warning', // Terminal Mode
        useChatPacing: true
      }
    ],
    requiredState: {
      trust: { min: 1 }
    },
    choices: [
      {
        choiceId: 'debug_ask_ai',
        text: "[ACTION] Ask the AI Assistant to 'Fix the race condition.'",
        nextNodeId: 'rohan_sim_trap',
        pattern: 'building', // Trying to use tools, but wrongly
        skills: ['digitalLiteracy'] 
      },
      {
        choiceId: 'debug_logs',
        text: "[ACTION] Ignore the AI. Tail the raw transaction logs. Look for the timestamp delta.",
        nextNodeId: 'rohan_sim_step_2',
        pattern: 'analytical',
        skills: ['technicalLiteracy', 'problemSolving']
      },
      {
        choiceId: 'debug_halt',
        text: "[ACTION] Hit the kill switch. Stop the bleeding first.",
        nextNodeId: 'rohan_sim_panic',
        pattern: 'helping',
        skills: ['crisisManagement']
      }
    ],
    tags: ['simulation', 'rohan_arc', 'immersive_scenario']
  },

  {
    nodeId: 'rohan_sim_trap',
    speaker: 'SYSTEM ALERT',
    content: [
      {
        text: `**AI ASSISTANT:** "I have applied a mutex lock to the User Object!"

*Rohan slams his fist on the floor.*

**ALERT: DEADLOCK DETECTED. SYSTEM FROZEN.**

You just froze the entire bank. The AI locked the wrong object because it doesn't understand the dependency graph. It just guessed.`,
        emotion: 'critical_failure',
        variation_id: 'sim_trap_v1',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'retry_manual',
        text: "Reset. I'll do it the hard way.",
        nextNodeId: 'rohan_simulation_start',
        pattern: 'patience',
        skills: ['resilience']
      }
    ],
    tags: ['simulation', 'rohan_arc']
  },

  {
    nodeId: 'rohan_sim_step_2',
    speaker: 'SYSTEM ALERT',
    content: [
      {
        text: `*Logs scroll faster than the eye can track. But you see the pattern.*

Transaction A: 10:00:00.001 (Pending)
Transaction B: 10:00:00.002 (Success)
Transaction A: 10:00:00.003 (Failed - Insufficient Funds)

The balance check is happening *before* the database commit completes. It's an eventual consistency error disguised as a logic bug.`,
        emotion: 'focused_flow',
        variation_id: 'sim_step_2_v1',
        richEffectContext: 'thinking'
      }
    ],
    choices: [
      {
        choiceId: 'fix_add_wait',
        text: "[ACTION] Add a 50ms wait time to the transaction.",
        nextNodeId: 'rohan_sim_bandaid',
        pattern: 'building',
        skills: ['problemSolving']
      },
      {
        choiceId: 'fix_atomic',
        text: "[ACTION] Rewrite the SQL query to use an ATOMIC transaction block. Force consistency.",
        nextNodeId: 'rohan_sim_success',
        pattern: 'analytical',
        skills: ['technicalLiteracy', 'systemsThinking']
      }
    ],
    tags: ['simulation', 'rohan_arc']
  },

  {
    nodeId: 'rohan_sim_success',
    speaker: 'Rohan',
    content: [
      {
        text: `*You type the SQL manually. No autocomplete. Just raw logic.*

**COMMIT SUCCESS.**
**LEDGER BALANCED.**

*Rohan exhales, a long, shuddering breath.*

You verified it. You didn't guess. You went to the source of truth.

That... that is what we're losing. The ability to know *why* it works.`,
        emotion: 'relieved_respect',
        variation_id: 'sim_success_v1',
        richEffectContext: 'success'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_skill_value',
        text: "Deep understanding is the only safety net.",
        nextNodeId: 'rohan_new_role',
        pattern: 'analytical',
        skills: ['criticalThinking', 'wisdom']
      },
      {
        choiceId: 'rohan_human_value',
        text: "The machine generates. The human verifies.",
        nextNodeId: 'rohan_new_role',
        pattern: 'helping',
        skills: ['leadership']
      }
    ],
    tags: ['simulation_complete', 'rohan_arc']
  },

  // ============= THE TURN: FROM JANITOR TO GUARDIAN =============
  {
    nodeId: 'rohan_new_role',
    speaker: 'Rohan',
    content: [
      {
        text: "I've been thinking about quitting. Becoming a carpenter. Something real.

But if I leave... who teaches the next generation how to read the logs? Who teaches them that code isn't magic?

If we all leave, the black box wins.",
        emotion: 'determined',
        variation_id: 'new_role_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_start_academy',
        text: "Start an academy. 'First Principles Engineering.'",
        nextNodeId: 'rohan_climax_decision',
        pattern: 'building',
        skills: ['leadership', 'education']
      },
      {
        choiceId: 'rohan_mentorship',
        text: "Don't fix the code. Fix the engineers. Be the mentor you wish you had.",
        nextNodeId: 'rohan_climax_decision',
        pattern: 'helping',
        skills: ['mentorship', 'communication']
      }
    ]
  },

  {
    nodeId: 'rohan_climax_decision',
    speaker: 'Rohan',
    content: [
      {
        text: "*He closes the laptop. The red alerts are gone.*

I'm not going to fix their bugs anymore. I'm going to build a team that doesn't write them.

The 'Integration Engineers.' The ones who can bridge the gap between the AI's speed and the human's understanding.

It's not glamorous. It's not 'vibe coding.' It's the foundation. And foundations have to be solid.",
        emotion: 'resolved',
        variation_id: 'climax_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_farewell',
        text: "The world needs foundations.",
        nextNodeId: 'rohan_farewell',
        pattern: 'patience',
        skills: ['encouragement']
      }
    ],
    onEnter: [
      {
        characterId: 'rohan',
        addKnowledgeFlags: ['rohan_chose_foundation'],
        addGlobalFlags: ['rohan_arc_complete']
      }
    ],
    tags: ['ending', 'rohan_arc']
  },

  {
    nodeId: 'rohan_farewell',
    speaker: 'Rohan',
    content: [
      {
        text: "Thank you. For sitting in the noise with me.

There's an instructional designer upstairs, Kai. They're burning their slide decks. Good. We need to burn it all down to build it right.

If you see Samuel, tell him... tell him I finally found the bug. It wasn't in the code. It was in how we were teaching people to write it.",
        emotion: 'grateful',
        variation_id: 'farewell_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_rohan',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.ROHAN_REFLECTION_GATEWAY,
        pattern: 'exploring'
      }
    ],
    tags: ['transition', 'rohan_arc']
  }
]

export const rohanEntryPoints = {
  INTRODUCTION: 'rohan_introduction'
} as const

export const rohanDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(rohanDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: rohanEntryPoints.INTRODUCTION,
  metadata: {
    title: "Rohan's Debug",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: rohanDialogueNodes.length,
    totalChoices: rohanDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}
