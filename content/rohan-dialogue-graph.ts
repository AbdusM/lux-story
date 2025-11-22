/**
 * Rohan's Dialogue Graph
 * The Legacy Archaeologist - Platform 7 (The Substructure / Deep Tech)
 *
 * CHARACTER: The Monk of the Machine
 * Core Conflict: "The Black Box" vs. "Human Understanding"
 * Arc: From "Janitor of Slop" to "Guardian of First Principles"
 * Mechanic: "The Ghost in the Machine" - Tracing a hallucinated library that doesn't exist.
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
        text: `*The server room is cold. It smells of ozone and stale coffee. Rohan sits cross-legged on the floor, surrounded by three laptops.*

*He doesn't look up. He whispers, tracing a line of code on the screen with a trembling finger.*

It's beautiful. Look at this recursion. It's absolutely perfect.

*He turns to you. His eyes are red-rimmed, terrified.*

And it's fake. A machine wrote it. It calls a library that hasn't existed since 2019.

It's hallucinating reality, and it's doing it better than I ever could.`,
        emotion: 'terrified_awe',
        variation_id: 'rohan_intro_v2',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_intro_fear',
        text: "You sound afraid of it.",
        nextNodeId: 'rohan_erasure_reveal',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'rohan',
          trustChange: 2
        }
      },
      {
        choiceId: 'rohan_intro_tech',
        text: "Hallucinated dependency? That's a supply chain attack vector.",
        nextNodeId: 'rohan_technical_dismissal',
        pattern: 'analytical',
        skills: ['technicalLiteracy']
      },
      {
        choiceId: 'rohan_intro_wonder',
        text: "If it works, does it matter who wrote it?",
        nextNodeId: 'rohan_philosophy_trap',
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
    nodeId: 'rohan_erasure_reveal',
    speaker: 'Rohan',
    content: [
      {
        text: `I am.

My mentor, David, spent 40 years mastering memory management. He treated every byte like it was sacred.

This thing? It generated David's life's work in 400 milliseconds. And it added a bug that David would never have made.

If we accept this... David didn't matter. *I* don't matter. We're just slow, buggy biological bootloaders for the machine.`,
        emotion: 'existential_dread',
        variation_id: 'erasure_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_value_human',
        text: "Speed isn't the only metric. Understanding is the metric.",
        nextNodeId: 'rohan_simulation_setup',
        pattern: 'building',
        skills: ['wisdom', 'leadership']
      },
      {
        choiceId: 'rohan_defense',
        text: "You're the one who found the bug. The machine didn't.",
        nextNodeId: 'rohan_simulation_setup',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'rohan',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'rohan_technical_dismissal',
    speaker: 'Rohan',
    content: [
      {
        text: `*He waves a hand, dismissive.*

Security? Forget security. This isn't about hackers. This is about truth.

If the code lies about its own existence, and we deploy it because we're too lazy to check... we aren't engineers anymore. We're believers. We're praying to a black box.`,
        emotion: 'zealous',
        variation_id: 'dismissal_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_show_me',
        text: "Show me the lie.",
        nextNodeId: 'rohan_simulation_setup',
        pattern: 'analytical',
        skills: ['curiosity']
      }
    ]
  },

  // ============= THE SIMULATION: THE GHOST IN THE MACHINE =============
  {
    nodeId: 'rohan_simulation_setup',
    speaker: 'Rohan',
    content: [
      {
        text: `Look.

*He spins the laptop. The screen is a wall of white text on black. A single cursor blinks.*

**SYSTEM:** PROD_DB_MIGRATION_SCRIPT.py
**AUTHOR:** CoPilot-v6
**STATUS:** RUNNING (DRY RUN)

It looks perfect. It's migrating 40 million user records.

But look at line 402.

`import { user_integrity_check } from 'legacy-core'`

'legacy-core' doesn't exist. I deleted it three years ago. The AI remembers a ghost.

If this runs, it will call a null pointer on 40 million people.`,
        emotion: 'quiet_intensity',
        variation_id: 'sim_setup_v2',
        richEffectContext: 'warning', // Terminal Mode
        useChatPacing: true
      }
    ],
    requiredState: {
      trust: { min: 1 }
    },
    choices: [
      {
        choiceId: 'sim_ask_ai',
        text: "[ACTION] Ask the AI to 'fix the import error'.",
        nextNodeId: 'rohan_sim_fail_hallucination',
        pattern: 'building',
        skills: ['digitalLiteracy'] // Relying on the tool that broke it
      },
      {
        choiceId: 'sim_manual_trace',
        text: "[ACTION] Open the source code. Trace the `user_integrity_check` function manually.",
        nextNodeId: 'rohan_sim_step_2',
        pattern: 'analytical',
        skills: ['technicalLiteracy', 'deepWork']
      },
      {
        choiceId: 'sim_comment_out',
        text: "[ACTION] Comment out line 402. Skip the check.",
        nextNodeId: 'rohan_sim_fail_corruption',
        pattern: 'helping', // Trying to "help" by bypassing
        skills: ['pragmatism']
      }
    ],
    tags: ['simulation', 'rohan_arc', 'immersive_scenario']
  },

  // --- FAILURE STATE 1: HALLUCINATION LOOP ---
  {
    nodeId: 'rohan_sim_fail_hallucination',
    speaker: 'Rohan',
    content: [
      {
        text: `*The screen flickers.*

**AI RESPONSE:** "I have corrected the import to 'legacy-core-v2'."

*Rohan buries his face in his hands.*

It just made up a *new* name. It's lying to cover the lie.

You're treating it like a colleague. It's a parrot. We're done.`,
        emotion: 'hopeless',
        variation_id: 'sim_fail_hallucination_v1',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_retry_manual',
        text: "I'm sorry. I'll look at the code myself.",
        nextNodeId: 'rohan_simulation_setup',
        pattern: 'patience',
        skills: ['humility']
      },
      {
        choiceId: 'rohan_give_up',
        text: "It's too complex. Maybe we should just let it run.",
        nextNodeId: 'rohan_bad_ending',
        pattern: 'analytical',
        consequence: {
          addGlobalFlags: ['rohan_chose_apathy'] // BAD ENDING
        }
      }
    ]
  },

  // --- FAILURE STATE 2: CORRUPTION ---
  {
    nodeId: 'rohan_sim_fail_corruption',
    speaker: 'Rohan',
    content: [
      {
        text: `*You type `//` before the line. The error clears.*

**STATUS:** MIGRATION COMPLETE.

*Rohan stares at the logs. His face goes grey.*

You skipped the integrity check.

The database migrated. But every user with a special character in their name just got deleted.

My name is Rohan. It's fine.
My mother's name is Zoë. She's gone.

You fixed the code. You broke the people.`,
        emotion: 'horrified_whisper',
        variation_id: 'sim_fail_corruption_v1',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_retry_corruption',
        text: "Rollback. Now. I need to understand what the check was doing.",
        nextNodeId: 'rohan_simulation_setup',
        pattern: 'helping',
        skills: ['accountability']
      }
    ]
  },

  // --- STEP 2: THE DEEP DIVE ---
  {
    nodeId: 'rohan_sim_step_2',
    speaker: 'Rohan',
    content: [
      {
        text: `*You open the file viewer. The file isn't there. You check the git history.*

**LAST MODIFIED:** 3 years ago by [David_V].
**COMMIT MESSAGE:** "Temporary bypass. Fix before 2025."

*Rohan traces the screen.*

David. He knew. He wrote a bypass because the legacy system couldn't handle UTF-8 characters.

The AI saw the bypass and thought it was a feature. It's trying to import a hack that David deleted.`,
        emotion: 'reverent_sadness',
        variation_id: 'sim_step_2_v1',
        richEffectContext: 'thinking'
      }
    ],
    choices: [
      {
        choiceId: 'sim_rewrite_modern',
        text: "[ACTION] Rewrite the integrity check using modern libraries. No hallucinations. First principles.",
        nextNodeId: 'rohan_sim_success',
        pattern: 'building',
        skills: ['coding', 'respect']
      }
    ],
    tags: ['simulation', 'rohan_arc']
  },

  {
    nodeId: 'rohan_sim_success',
    speaker: 'Rohan',
    content: [
      {
        text: `*You type the new function. You verify the inputs. You write a test case for "Zoë".*

**TEST PASSED.**
**MIGRATION SUCCESSFUL.**

*Rohan closes the laptop slowly. The hum of the servers seems to quiet.*

You talked to the ghosts. You didn't just prompt. You listened to what David was trying to tell us.

That's not janitorial work. That's... communion.`,
        emotion: 'profound_relief',
        variation_id: 'sim_success_v2',
        richEffectContext: 'success'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_new_purpose',
        text: "We need people who can talk to the ghosts.",
        nextNodeId: 'rohan_climax_decision',
        pattern: 'helping',
        skills: ['wisdom']
      }
    ],
    tags: ['simulation_complete', 'rohan_arc']
  },

  // ============= THE TURN =============
  {
    nodeId: 'rohan_climax_decision',
    speaker: 'Rohan',
    content: [
      {
        text: "I'm not quitting. I can't quit.

There's an instructional designer upstairs, Kai. They're burning their slide decks. Good. We need to burn it all down to build it right.

I'm going to start an academy. Not 'Coding Bootcamp.' 'First Principles.'

We're going to teach people how to read the metal. How to know what is real.",
        emotion: 'resolved_monk',
        variation_id: 'climax_v2'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_farewell',
        text: "The world needs guardians.",
        nextNodeId: 'rohan_farewell',
        pattern: 'building',
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

  // ============= BAD ENDING =============
  {
    nodeId: 'rohan_bad_ending',
    speaker: 'Rohan',
    content: [
      {
        text: "*Rohan looks at the screen, defeat in his eyes.*

Yeah. Let it run. If it breaks, they'll just hire another AI to fix it.

I'm going to apply for that carpentry apprenticeship. Wood doesn't lie.

Goodbye.",
        emotion: 'broken_spirit',
        variation_id: 'bad_ending_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_leave_bad',
        text: "...",
        nextNodeId: samuelEntryPoints.ROHAN_REFLECTION_GATEWAY,
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['rohan_chose_apathy', 'rohan_arc_complete']
      }
    ],
    tags: ['ending', 'bad_ending', 'rohan_arc']
  },

  {
    nodeId: 'rohan_farewell',
    speaker: 'Rohan',
    content: [
      {
        text: "You heard the hum, didn't you? The noise underneath the noise.

If you see Samuel, tell him... tell him I'm staying. Someone has to keep the lights on.",
        emotion: 'grateful_solemn',
        variation_id: 'farewell_v2'
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