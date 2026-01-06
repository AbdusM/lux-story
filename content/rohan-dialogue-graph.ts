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
        text: "It's fake. The brass on this railing? It's painted plastic. Scratch it.\n\n[He leans back, staring at the ceiling.]\n\nEveryone thinks the Station is ancient. But look at the rivets. They were stamped yesterday.\n\nWhy does a machine need to lie to us?",
        emotion: 'terrified_awe',
        variation_id: 'rohan_intro_v2',
        richEffectContext: 'warning',
        patternReflection: [
          { pattern: 'analytical', minLevel: 5, altText: "The server room is cold. Smells of ozone and stale coffee.\n\nLook at this recursion. Perfect structure. And it's fake.\n\nYou're reading it, aren't you? You see what I see. The elegant lie.\n\nIt calls a library that hasn't existed since 2019. A hallucination.", altEmotion: 'curious' },
          { pattern: 'building', minLevel: 5, altText: "The server room is cold.\n\nLook at this recursion. Beautiful architecture. And it's fake.\n\nYou build things too. You know what it means when the foundation is a ghost.\n\nIt calls a library that doesn't exist. The machine hallucinated it.", altEmotion: 'concerned' },
          { pattern: 'patience', minLevel: 5, altText: "The server room is cold.\n\nIt's beautiful. Look at this recursion. Perfect. And fake.\n\nYou're not rushing to conclusions. Good. This deserves time to understand.\n\nThe machine hallucinated a library. And it's doing it better than I ever could.", altEmotion: 'reflective' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'rohan_intro_fear',
        text: "You sound afraid of it.",
        nextNodeId: 'rohan_fear_acknowledged',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        voiceVariations: {
          analytical: "Your metrics show fear. Heart rate, voice tremor. What's the real threat?",
          helping: "You sound afraid of it. What's scaring you?",
          building: "Something in this code broke your confidence. What?",
          exploring: "I hear something deeper than technical frustration. What is it?",
          patience: "Take a breath. You sound afraid. I'm listening."
        },
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
        skills: ['technicalLiteracy'],
        voiceVariations: {
          analytical: "Hallucinated dependency? That's a supply chain attack vector.",
          helping: "Wait—if the dependency is fake, people could get hurt relying on this.",
          building: "Phantom libraries are a build-time bomb. How do we fix it?",
          exploring: "That's wild. A machine invented a library that never existed?",
          patience: "Let me make sure I understand. The code references something that doesn't exist?"
        }
      },
      {
        choiceId: 'rohan_intro_wonder',
        text: "If it works, who cares how it got written?",
        voiceVariations: {
          analytical: "Results matter. If it works, who cares how it got written?",
          helping: "Maybe it's okay to not understand everything. If it works, who cares?",
          building: "Ship it. If it works, who cares how it got written?",
          exploring: "Devil's advocate: if it works, who cares how it got written?",
          patience: "Maybe that's a question worth sitting with. If it works..."
        },
        nextNodeId: 'rohan_philosophy_trap',
        pattern: 'exploring',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'rohan_intro_patience',
        text: "[Stay quiet. Let the awe and dread coexist without comment.]",
        nextNodeId: 'rohan_silence_acknowledged',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        voiceVariations: {
          analytical: "[Process the information. Don't rush to conclusions.]",
          helping: "[Just be present. He needs someone to witness this.]",
          building: "[Wait. Sometimes the best response is no response.]",
          exploring: "[Let the mystery breathe. Don't collapse it with words.]",
          patience: "[Stay quiet. Let the awe and dread coexist without comment.]"
        },
        consequence: {
          characterId: 'rohan',
          trustChange: 1
        }
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

  // Divergent responses for intro
  {
    nodeId: 'rohan_fear_acknowledged',
    speaker: 'Rohan',
    content: [
      {
        text: `*He turns to look at you, surprised anyone noticed.*

Most people don't see past the technical marvel. They see code appearing like magic and think it's progress.

You saw the terror underneath. That's... rare.`,
        emotion: 'vulnerable',
        variation_id: 'fear_acknowledged_v1',
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "*He turns to look at you, surprised anyone noticed.*\n\nMost people don't see past the technical marvel. You saw the person behind the code.\n\nYou saw the terror underneath. That's... thank you for that.", altEmotion: 'grateful' },
          { pattern: 'analytical', minLevel: 4, altText: "*He turns to look at you, surprised.*\n\nMost people see code appearing like magic. You're analyzing the implications.\n\nYou saw the terror underneath the elegance. That's rare.", altEmotion: 'respectful' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'tell_me_why',
        text: "Tell me why.",
        nextNodeId: 'rohan_erasure_reveal',
        voiceVariations: {
          analytical: "Walk me through the logic. Why the fear?",
          helping: "I want to understand. Tell me why.",
          building: "What's the foundation of this fear?",
          exploring: "Tell me more. I'm genuinely curious.",
          patience: "Tell me why. Take all the time you need."
        }
      }
    ]
  },
  {
    nodeId: 'rohan_silence_acknowledged',
    speaker: 'Rohan',
    content: [
      {
        text: `*He glances at you. Notes your stillness.*

You're not rushing to have an opinion. Everyone else does. "It's amazing!" or "It's dangerous!" - always binary.

You're just... holding both. Like you understand some truths can't be collapsed into a stance.`,
        emotion: 'appreciative',
        variation_id: 'silence_acknowledged_v1',
        patternReflection: [
          { pattern: 'patience', minLevel: 4, altText: "*He glances at you. Notes your stillness.*\n\nYou're not rushing. That's who you are, isn't it? Someone who holds space.\n\nEveryone else wants binary. 'Amazing!' or 'Dangerous!' You understand complexity.", altEmotion: 'respectful' },
          { pattern: 'exploring', minLevel: 4, altText: "*He glances at you. Notes your stillness.*\n\nYou're observing. Taking it in before forming conclusions.\n\nThat's rare. Most people need to name things immediately. You're comfortable in the unknown.", altEmotion: 'appreciative' }
        ]
      }
    ],
    choices: [
      { choiceId: 'continue_watching', text: "[Continue watching]", nextNodeId: 'rohan_erasure_reveal' }
    ]
  },

  {
    nodeId: 'rohan_erasure_reveal',
    speaker: 'Rohan',
    content: [
      {
        text: `I am.

My mentor, David, spent 40 years mastering memory management. He treated every byte like it was sacred.

This thing? It generated David's life's work in 400 milliseconds. And it added a bug that David would never have made.

If we accept this... David didn't matter. I don't matter. We're just slow, buggy biological bootloaders for the machine.`,
        emotion: 'existential_dread',
        variation_id: 'erasure_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_value_human',
        text: "Understanding matters more than speed.",
        voiceVariations: {
          analytical: "Velocity without comprehension is just technical debt. Understanding matters.",
          helping: "People need to truly understand, not just ship. Understanding matters.",
          building: "Build foundations first. Understanding matters more than speed.",
          exploring: "What's lost when we optimize for speed alone? Understanding matters.",
          patience: "Some things can't be rushed. Understanding matters more than speed."
        },
        nextNodeId: 'rohan_understanding_response',
        pattern: 'building',
        skills: ['wisdom', 'leadership'],
        visibleCondition: {
          patterns: { building: { min: 3 } }
        }
      },
      {
        choiceId: 'rohan_defense',
        text: "The machine missed the bug. You didn't.",
        nextNodeId: 'rohan_bug_defense_response',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        visibleCondition: {
          patterns: { analytical: { min: 4 } }
        },
        consequence: {
          characterId: 'rohan',
          trustChange: 1
        }
      },
      {
        choiceId: 'rohan_tess_connection',
        text: "Tess talked about this. Making choices when the map runs out.",
        nextNodeId: 'rohan_tess_reference',
        pattern: 'helping',
        skills: ['collaboration'],
        visibleCondition: {
          hasGlobalFlags: ['tess_arc_complete']
        }
      },
      {
        choiceId: 'rohan_erasure_patience',
        text: "[Let the weight of David's legacy settle. Some grief speaks louder in silence.]",
        nextNodeId: 'rohan_silence_for_david',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        visibleCondition: {
          patterns: { patience: { min: 4 } }
        },
        consequence: {
          characterId: 'rohan',
          trustChange: 2
        }
      }
    ],
    tags: ['rohan_arc']
  },

  // Divergent responses for erasure reveal
  {
    nodeId: 'rohan_understanding_response',
    speaker: 'Rohan',
    content: [
      {
        text: `*He pauses, considering your words like debugging a claim.*

Understanding...

The machine can generate correct code. But it can't explain why it's correct. It can't teach. It can't pass down the intuition that lets you feel when something's wrong before you know why.

David could do that. That's not replaceable.`,
        emotion: 'hopeful',
        variation_id: 'understanding_response_v1'
      }
    ],
    choices: [
      { choiceId: 'show_understanding', text: "Show me what understanding looks like.", nextNodeId: 'rohan_simulation_setup' }
    ]
  },
  {
    nodeId: 'rohan_bug_defense_response',
    speaker: 'Rohan',
    content: [
      {
        text: `*His eyes sharpen. A small crack in the despair.*

That's... that's true.

I saw the bug in 3 seconds. The machine didn't see it at all. It generated code that looked perfect but would have corrupted memory on every third call.

Maybe... maybe the value isn't in writing the code. Maybe it's in knowing when the code lies.`,
        emotion: 'analytical_hope',
        variation_id: 'bug_defense_v1'
      }
    ],
    choices: [
      { choiceId: 'teach_seeing', text: "Can you teach someone to see that?", nextNodeId: 'rohan_simulation_setup' }
    ]
  },
  {
    nodeId: 'rohan_silence_for_david',
    speaker: 'Rohan',
    content: [
      {
        text: `*The silence stretches. You don't fill it.*

*After a long moment, he exhales.*

Most people would try to fix this. Offer solutions. Argue philosophy.

You just... let it be heavy. David would have liked that. He always said real understanding starts with sitting in the discomfort.`,
        emotion: 'grateful',
        variation_id: 'silence_for_david_v1'
      }
    ],
    choices: [
      { choiceId: 'let_him_lead', text: "[Let him lead when he's ready]", nextNodeId: 'rohan_simulation_setup' }
    ]
  },

  {
    nodeId: 'rohan_tess_reference',
    speaker: 'Rohan',
    content: [
      {
        text: `Tess. The one starting the wilderness school?

She gets it. You're out there, no GPS, storm coming in. You can't ask ChatGPT "how to survive." You have to know.

Code is the same. When the servers are melting down, you can't prompt-engineer your way out. You have to know the metal.`,
        emotion: 'respect',
        variation_id: 'tess_ref_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_tess_back',
        text: "Exactly. Show me the metal.",
        nextNodeId: 'rohan_simulation_setup',
        pattern: 'analytical'
      }
    ]
  },

  {
    nodeId: 'rohan_technical_dismissal',
    speaker: 'Rohan',
    content: [
      {
        text: `Security? Forget security. This isn't about hackers. This is about truth.

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

  // ============= SCENE 3: ROHAN'S ORIGIN =============
  {
    nodeId: 'rohan_philosophy_trap',
    speaker: 'Rohan',
    content: [
      {
        text: `"If it works, does it matter?"

That's what my CS professor said. Twenty years ago. He was wrong then, and he's wrong now.

Do you know what a cargo cult is? Pacific Islanders built fake runways after WWII, hoping planes would return with goods. They copied the form without understanding the function.

That's us. We're cargo-culting code. The AI writes something that looks like a solution, and we deploy it because we can't tell the difference.`,
        emotion: 'passionate_teaching',
        variation_id: 'philosophy_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_origin_ask',
        text: "How did you learn to see the difference?",
        nextNodeId: 'rohan_origin_david',
        pattern: 'exploring',
        skills: ['curiosity', 'emotionalIntelligence'],
        consequence: {
          characterId: 'rohan',
          trustChange: 2
        }
      },
      {
        choiceId: 'rohan_pragmatic_push',
        text: "But businesses need solutions now, not philosophy lectures.",
        nextNodeId: 'rohan_pragmatic_response',
        pattern: 'analytical',
        skills: ['pragmatism']
      }
    ],
    tags: ['rohan_arc', 'philosophy']
  },

  {
    nodeId: 'rohan_pragmatic_response',
    speaker: 'Rohan',
    content: [
      {
        text: `You sound like the VCs.

Fine. Here's the business case: That hallucinated library? If it deploys to production, it will crash. Crash costs money. Downtime, data recovery, lawsuits.

But there's a deeper cost. Every engineer who learns from that broken code will propagate the error. It's technical debt that compounds across generations.

The philosophy isn't a luxury. It's the only thing that scales.`,
        emotion: 'frustrated_patience',
        variation_id: 'pragmatic_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_pragmatic_learn',
        text: "Teach me how you learned to see it.",
        nextNodeId: 'rohan_origin_david',
        pattern: 'exploring',
        skills: ['curiosity', 'learningAgility']
      },
      {
        choiceId: 'rohan_pragmatic_building',
        text: "So build the alternative. What would real training look like?",
        nextNodeId: 'rohan_origin_david',
        pattern: 'building',
        skills: ['creativity', 'systemsThinking'],
        consequence: {
          characterId: 'rohan',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'rohan_origin_david',
    speaker: 'Rohan',
    content: [
      {
        text: `David Vaughn. My first mentor at this company.

I came in hot. Top of my bootcamp class. Could spin up a CRUD app in four hours. I thought I was a genius.

David looked at my code and said: "You've built a house. But you don't know what a nail is."

He made me spend six months writing in assembly. No frameworks. No abstractions. Just metal.`,
        emotion: 'reverent',
        variation_id: 'origin_david_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_david_more',
        text: "What did six months of assembly teach you?",
        nextNodeId: 'rohan_david_lesson',
        pattern: 'helping',
        skills: ['curiosity', 'patience']
      },
      {
        choiceId: 'rohan_david_whereabouts',
        text: "Where is David now?",
        nextNodeId: 'rohan_david_gone',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'rohan_david_patience',
        text: "[Nod slowly. That kind of mentorship deserves reverent silence.]",
        nextNodeId: 'rohan_david_lesson',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'rohan',
          trustChange: 1
        }
      }
    ],
    tags: ['rohan_arc', 'backstory']
  },

  {
    nodeId: 'rohan_david_lesson',
    speaker: 'Rohan',
    content: [
      {
        text: `Everything is a choice.

When you write in assembly, you see the cost of every decision. A loop isn't magic. it's instructions. Memory isn't infinite. it's addresses.

Every abstraction you've ever used was someone's opinion about tradeoffs.

The frameworks hide those choices. The AI hides them even more.`,
        emotion: 'teaching_intensity',
        variation_id: 'david_lesson_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_lesson_moment',
        text: "Did David show you something specific?",
        nextNodeId: 'rohan_david_moment',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ]
  },

  // EXPANSION: David teaching moment
  {
    nodeId: 'rohan_david_moment',
    speaker: 'Rohan',
    content: [
      {
        text: `Week three. I'd written a sorting function. Proud of it. Eleven lines.

David showed me his version. Sixty-three lines. Comments explaining why each choice mattered.

"Fast code is worthless if the next person can't fix it."

*Quiet.*

He spent more time on the comments than the code.`,
        emotion: 'reverent',
        variation_id: 'moment_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_moment_to_gone',
        text: "Is he still teaching?",
        nextNodeId: 'rohan_david_gone',
        pattern: 'helping',
        skills: ['empathy']
      }
    ],
    tags: ['rohan_arc', 'teaching']
  },

  {
    nodeId: 'rohan_david_gone',
    speaker: 'Rohan',
    content: [
      {
        text: `He retired last year. ALS.

His hands don't work anymore. Can't type. Can barely hold a coffee cup.

But his mind... his mind is still sharp. We video call every week. He can't write code, but he can still see it. He reads what I show him and finds the bugs in seconds.

That knowledge doesn't disappear because a machine can type faster. It's not about the typing.`,
        emotion: 'grief_determination',
        variation_id: 'david_gone_v1',
        // E2-031: Interrupt opportunity when Rohan reveals David's illness
        interrupt: {
          duration: 4000,
          type: 'silence',
          action: 'Hold the silence. Some grief needs a witness, not words.',
          targetNodeId: 'rohan_interrupt_acknowledged',
          consequence: {
            characterId: 'rohan',
            trustChange: 2
          }
        }
      }
    ],
    choices: [
      {
        choiceId: 'rohan_honor_david',
        text: "David matters to you.",
        voiceVariations: {
          analytical: "There's a connection here. David matters to you.",
          helping: "I can see it. David matters to you.",
          building: "That's why you're doing this work. David matters to you.",
          exploring: "Tell me more about that. David matters to you.",
          patience: "I understand. David matters to you."
        },
        nextNodeId: 'rohan_honor_path',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'wisdom'],
        consequence: {
          characterId: 'rohan',
          trustChange: 2
        }
      },
      {
        choiceId: 'rohan_preserve',
        text: "That's knowledge that could be lost. Someone needs to preserve it.",
        nextNodeId: 'rohan_honor_path',
        pattern: 'building',
        skills: ['strategicThinking']
      },
      {
        choiceId: 'rohan_gone_patience',
        text: "[Hold the moment. This grief has been waiting for someone to witness it.]",
        nextNodeId: 'rohan_honor_path',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'rohan',
          trustChange: 2
        }
      }
    ],
    tags: ['rohan_arc', 'emotional_core']
  },

  {
    nodeId: 'rohan_interrupt_acknowledged',
    speaker: 'Rohan',
    content: [{
      text: `*He glances at you. Notes that you didn't rush to fill the silence.*

You didn't try to fix it. Most people would offer solutions. "Maybe there's a treatment." "Technology is advancing." As if optimism could cure anything.

You just... listened. David would appreciate that.`,
      emotion: 'grateful_surprised',
      microAction: 'His shoulders drop slightly, some tension releasing.',
      variation_id: 'default'
    }],
    choices: [
      {
        choiceId: 'presence_is_enough',
        text: "Some things can't be fixed. They can only be witnessed.",
        nextNodeId: 'rohan_honor_path',
        pattern: 'patience',
        consequence: {
          characterId: 'rohan',
          trustChange: 1
        }
      },
      {
        choiceId: 'david_lives_on',
        text: "What he taught you—that's how he lives on.",
        nextNodeId: 'rohan_honor_path',
        pattern: 'helping',
        consequence: {
          characterId: 'rohan',
          trustChange: 1
        }
      }
    ]
  },
  {
    nodeId: 'rohan_honor_path',
    speaker: 'Rohan',
    content: [
      {
        text: `That's why I'm still here. In this cold server room at 2 AM.

Everyone thinks I'm the janitor. "Rohan maintains the legacy systems." They say it like I'm cleaning toilets.

But someone has to understand what's underneath. Someone has to remember why the code was written, not just what it does.

Let me show you what I found today.`,
        emotion: 'quiet_resolve',
        variation_id: 'honor_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_show_ghost',
        text: "Show me.",
        nextNodeId: 'rohan_simulation_setup',
        pattern: 'analytical',
        skills: ['curiosity', 'deepWork']
      },
      {
        choiceId: 'rohan_honor_building',
        text: "Then build something that preserves what David taught. Make it last.",
        nextNodeId: 'rohan_simulation_setup',
        pattern: 'building',
        skills: ['systemsThinking', 'leadership'],
        consequence: {
          characterId: 'rohan',
          trustChange: 1
        }
      }
    ]
  },

  // ============= SCENE 5: THE SIMULATION: THE GHOST IN THE MACHINE =============
  {
    nodeId: 'rohan_simulation_setup',
    speaker: 'Rohan',
    content: [{
      text: "The AI is hallucinating a dependency. I need you to prove it wrong.",
      emotion: 'neutral',
      variation_id: 'sim_setup_v2'
    }],
    simulation: {
      type: 'chat_negotiation',
      title: 'Hallucination Debate',
      taskDescription: 'The AI model insists the efficient code is correct. You must navigate the conversation to force it to acknowledge the "ghost" dependency.',
      initialContext: {
        label: 'Chat Session: CoPilot-v6',
        content: `USER: This import fails. 'legacy-core' doesn't exist.
AI: usage of 'legacy-core' is standard for 2019 architectures. I have verified the path.
USER: I deleted that folder myself. It's not there.
AI: My index shows it exists. Perhaps your local environment is out of sync.`,
        displayStyle: 'text'
      },
      successFeedback: '✓ AI ACKNOWLEDGED ERROR: "Apologies. Re-checking index... Dependency removed."'
    },
    requiredState: {
      trust: { min: 1 }
    },
    choices: [
      {
        choiceId: 'sim_ask_ai',
        text: "Ask the AI to 'fix the import error'.",
        nextNodeId: 'rohan_sim_fail_hallucination',
        pattern: 'building',
        skills: ['digitalLiteracy'] // Relying on the tool that broke it
      },
      {
        choiceId: 'sim_manual_trace',
        text: "Open the source code. Trace the `user_integrity_check` function manually.",
        nextNodeId: 'rohan_sim_step_2',
        pattern: 'analytical',
        skills: ['technicalLiteracy', 'deepWork']
      },
      {
        choiceId: 'sim_comment_out',
        text: "Comment out line 402. Skip the check.",
        nextNodeId: 'rohan_sim_fail_corruption',
        pattern: 'helping', // Trying to "help" by bypassing
        skills: ['pragmatism']
      }
    ],
    tags: ['simulation', 'rohan_arc', 'immersive_scenario'],
    metadata: {
      sessionBoundary: true  // Session 1: Introduction complete
    }
  },

  // --- FAILURE STATE 1: HALLUCINATION LOOP ---
  {
    nodeId: 'rohan_sim_fail_hallucination',
    speaker: 'Rohan',
    content: [
      {
        text: `AI RESPONSE: "I have corrected the import to 'legacy-core-v2'."

It just made up a new name. It's lying to cover the lie.

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
        text: "It's too complex. Maybe we should let it run.",
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
        text: `STATUS: MIGRATION COMPLETE.

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
        text: `You open the file viewer. The file isn't there. You check the git history.

**LAST MODIFIED:** 3 years ago by [David_V].
**COMMIT MESSAGE:** "Temporary bypass. Fix before 2025."


David. He knew. He wrote a bypass because the legacy system couldn't handle UTF-8 characters.

The AI saw the bypass and thought it was a feature. It's trying to import a hack that David deleted.`,
        emotion: 'reverent_sadness',
        variation_id: 'sim_step_2_v1',
        richEffectContext: 'thinking'
      }
    ],
    onEnter: [
      {
        characterId: 'rohan',
        thoughtId: 'analytical-eye'
      }
    ],
    choices: [
      {
        choiceId: 'sim_rewrite_modern',
        text: "Rewrite the integrity check using modern libraries. No hallucinations. First principles.",
        nextNodeId: 'rohan_sim_success',
        pattern: 'building',
        skills: ['technicalLiteracy', 'respect']
      }
    ],
    tags: ['simulation', 'rohan_arc']
  },

  {
    nodeId: 'rohan_sim_success',
    speaker: 'Rohan',
    content: [
      {
        text: `You type the new function. You verify the inputs. You write a test case for "Zoë".

**TEST PASSED.**
**MIGRATION SUCCESSFUL.**

The hum of the servers seems to quiet.

You talked to the ghosts. You didn't just prompt. You listened to what David was trying to tell us.

That's not janitorial work. That's... communion.`,
        emotion: 'profound_relief',
        variation_id: 'sim_success_v2',
        richEffectContext: 'success'
      }
    ],
    onEnter: [
      {
        characterId: 'rohan',
        thoughtId: 'curious-wanderer'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_to_taught',
        text: "What did this teach you?",
        nextNodeId: 'rohan_ghost_lesson',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['simulation_complete', 'rohan_arc']
  },

  // EXPANSION: Ghost lesson
  {
    nodeId: 'rohan_ghost_lesson',
    speaker: 'Rohan',
    content: [
      {
        text: `The AI saw a function call. I saw David's intention.

Same code. Different questions.

AI asks: "What does this do?"

I ask: "Why did David write it this way?"

*Pause.*

That difference? That's what we're losing.`,
        emotion: 'clear',
        variation_id: 'lesson_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_lesson_to_why',
        text: "Why does that matter to you?",
        nextNodeId: 'rohan_personal_why',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['rohan_arc', 'insight']
  },

  // EXPANSION: Personal why
  {
    nodeId: 'rohan_personal_why',
    speaker: 'Rohan',
    content: [
      {
        text: `My dad was a machinist. Factory in India.

He could hear when a lathe was half a degree off. Trained his whole life.

Factory bought CNC machines. Didn't need him anymore.

*Quiet.*

David's knowledge. Dad's ears. Same story.

I'm not letting it happen again.`,
        emotion: 'fierce',
        variation_id: 'why_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_why_to_academy',
        text: "(Continue)",
        nextNodeId: 'rohan_academy_vision',
        pattern: 'patience'
      }
    ],
    tags: ['rohan_arc', 'personal']
  },

  // ============= SCENE 7: THE ACADEMY VISION =============
  {
    nodeId: 'rohan_academy_vision',
    speaker: 'Rohan',
    content: [
      {
        text: `I've been thinking about this for years. David and I sketched it out before his diagnosis.

Not a bootcamp. Those are factories. They produce developers who can use tools but don't understand them.

We want to build something different. A place where people learn why before they learn how.`,
        emotion: 'visionary',
        variation_id: 'academy_v1'
      }
    ],
    patternReflection: [
      {
        pattern: 'building',
        minLevel: 5,
        altText: `I've been thinking about this for years. David and I sketched it out before his diagnosis.

You're a builder. I can tell by how you engage with problems. You understand what it means to create something from first principles.

We want to build something different. A place where people learn why before they learn how.`,
        altEmotion: 'kindred_visionary'
      },
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: `I've been thinking about this for years. David and I sketched it out before his diagnosis.

You think deeply. That's rare. Most people want the quick answer. you want to understand.

We want to build something different. A place where people learn why before they learn how.`,
        altEmotion: 'recognized_visionary'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_academy_how',
        text: "What would the curriculum look like?",
        nextNodeId: 'rohan_curriculum_design',
        pattern: 'analytical',
        skills: ['curiosity', 'instructionalDesign']
      },
      {
        choiceId: 'rohan_academy_who',
        text: "Who would teach? You can't scale David.",
        nextNodeId: 'rohan_teacher_challenge',
        pattern: 'building',
        skills: ['strategicThinking', 'pragmatism']
      },
      {
        choiceId: 'rohan_academy_building_framework',
        text: "Start with a framework. What's the first principle you'd teach?",
        voiceVariations: {
          analytical: "What's the logical foundation? What's the first principle you'd teach?",
          helping: "Help me understand your vision. What's the first principle you'd teach?",
          building: "Start with a framework. What's the first principle you'd teach?",
          exploring: "I want to see how you think. What's the first principle you'd teach?",
          patience: "Walk me through it. What's the first principle you'd teach?"
        },
        nextNodeId: 'rohan_curriculum_design',
        pattern: 'building',
        skills: ['systemsThinking', 'creativity'],
        consequence: {
          characterId: 'rohan',
          trustChange: 1
        }
      }
    ],
    tags: ['rohan_arc', 'vision']
  },

  {
    nodeId: 'rohan_curriculum_design',
    speaker: 'Rohan',
    content: [
      {
        text: `Year one: No computers.

I'm serious. You learn Boolean logic with physical switches. You build a half-adder with relays. You understand what a bit is before you ever type 'int'.

Year two: Assembly. Write a calculator. Write a text editor. Feel every byte.

Year three: Finally, you get a framework. And by then, you'll hate it. Because you'll see all the choices it's making for you.`,
        emotion: 'teaching_fire',
        variation_id: 'curriculum_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_curriculum_time',
        text: "Three years? Bootcamps promise jobs in twelve weeks.",
        nextNodeId: 'rohan_quality_argument',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'rohan_curriculum_trust',
        text: "That's radical. I love it.",
        nextNodeId: 'rohan_teacher_challenge',
        pattern: 'helping',
        skills: ['encouragement', 'courage']
      }
    ],
    tags: ['rohan_arc', 'vision'],
    metadata: {
      sessionBoundary: true  // Session 2: Academy vision revealed
    }
  },

  {
    nodeId: 'rohan_quality_argument',
    speaker: 'Rohan',
    content: [
      {
        text: `And what jobs do they get? Junior developer. Build CRUD apps. Get replaced by AI in five years.

Our graduates? They'll be the ones the AI can't replace. The ones who debug the AI. The ones who understand what's actually happening inside the black box.

The market for people who can type code is going to zero. The market for people who understand code is infinite.`,
        emotion: 'confident',
        variation_id: 'quality_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_quality_continue',
        text: "You're building guardians, not coders.",
        nextNodeId: 'rohan_teacher_challenge',
        pattern: 'building',
        skills: ['leadership']
      }
    ]
  },

  {
    nodeId: 'rohan_teacher_challenge',
    speaker: 'Rohan',
    content: [
      {
        text: `Teachers. That's the hard part.

David was one of a kind. But there are others. Old-timers who got pushed out when companies decided experience was too expensive.

I've been keeping a list. Retired engineers who still care. Database architects who remember why we have normalization. Network engineers who understand packets.

They're out there. They're just been told they're obsolete.`,
        emotion: 'hopeful_determined',
        variation_id: 'teacher_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_funding_question',
        text: "How do you fund something like this?",
        nextNodeId: 'rohan_funding_reality',
        pattern: 'analytical',
        skills: ['financialLiteracy', 'pragmatism']
      },
      {
        choiceId: 'rohan_start_small',
        text: "Start with one student. Prove it works.",
        nextNodeId: 'rohan_first_student',
        pattern: 'building',
        skills: ['strategicThinking', 'pragmatism']
      }
    ]
  },

  {
    nodeId: 'rohan_funding_reality',
    speaker: 'Rohan',
    content: [
      {
        text: `VCs won't touch it. Three years to first placement? No "scalable" model? They'd laugh.

But David has connections. Alumni from his classes who became CTOs. Companies that are starting to realize their AI-dependent junior devs can't debug production issues.

One company already offered to sponsor five students. Not because they're charitable. because they need people who actually understand the systems.`,
        emotion: 'practical_hope',
        variation_id: 'funding_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_funding_continue',
        text: "The market will catch up to you.",
        nextNodeId: 'rohan_climax_decision',
        pattern: 'helping',
        skills: ['strategicThinking', 'encouragement']
      }
    ]
  },

  {
    nodeId: 'rohan_first_student',
    speaker: 'Rohan',
    content: [
      {
        text: `Actually... I already have one.

There's a kid. well, she's 28, but she feels like a kid. who works in QA downstairs. She found a memory leak that our entire senior team missed.

When I asked how, she said: "I drew a diagram of every allocation. Took me a weekend."

Everyone else just ran the profiler. She understood.

I've been teaching her after hours. She's year one now. Building logic gates with LEDs.`,
        emotion: 'quiet_pride',
        variation_id: 'first_student_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_student_moment',
        text: "What did she say when she understood?",
        nextNodeId: 'rohan_student_breakthrough',
        pattern: 'exploring',
        skills: ['curiosity', 'emotionalIntelligence']
      }
    ]
  },

  // EXPANSION: Student breakthrough
  {
    nodeId: 'rohan_student_breakthrough',
    speaker: 'Rohan',
    content: [
      {
        text: `Week four. Logic gates. She built an AND gate wrong. Output stuck high.

Stared at it. Twenty minutes.

Then: "Wait. The resistor. It's not about the LED. It's about current flow."

*Pause.*

"Everything's about current flow, isn't it?"

She got it. Not the circuit. The principle underneath.`,
        emotion: 'proud',
        variation_id: 'breakthrough_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_breakthrough_to_decision',
        text: "That's what David did for you.",
        nextNodeId: 'rohan_climax_decision',
        pattern: 'helping',
        skills: ['wisdom', 'mentorship'],
        consequence: {
          characterId: 'rohan',
          trustChange: 2
        }
      }
    ],
    tags: ['rohan_arc', 'teaching']
  },

  // ============= SCENE 8: THE TURN =============
  {
    nodeId: 'rohan_climax_decision',
    speaker: 'Rohan',
    content: [
      {
        text: `I'm not quitting. I can't quit.

There's an instructional designer upstairs, Kai. They're burning their slide decks. Good. We need to burn it all down to build it right.

I'm going to start an academy. Not 'Coding Bootcamp.' 'First Principles.'

We're going to teach people how to read the metal. How to know what is real.`,
        emotion: 'resolved_monk',
        variation_id: 'climax_v2'
      }
    ],
    patternReflection: [
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: `I'm not quitting. I can't quit. You think like David did. seeing through the surface to what's underneath.

There's an instructional designer upstairs, Kai. They're burning their slide decks. Good. We need to burn it all down to build it right.

I'm going to start an academy. Not 'Coding Bootcamp.' 'First Principles.'`,
        altEmotion: 'kindred_resolved'
      },
      {
        pattern: 'building',
        minLevel: 5,
        altText: `I'm not quitting. I can't quit. You're a builder. you understand why foundations matter.

There's an instructional designer upstairs, Kai. They're burning their slide decks. Good. We need to burn it all down to build it right.

I'm going to start an academy. Not 'Coding Bootcamp.' 'First Principles.'`,
        altEmotion: 'recognized_resolved'
      },
      {
        pattern: 'patience',
        minLevel: 5,
        altText: `I'm not quitting. I can't quit. The way you waited, listened. that's rare. Most people want the quick answer.

There's an instructional designer upstairs, Kai. They're burning their slide decks. Good. We need to burn it all down to build it right.

I'm going to start an academy. Not 'Coding Bootcamp.' 'First Principles.'`,
        altEmotion: 'grateful_resolved'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_ask_why',
        text: "What do you want people to remember about you?",
        nextNodeId: 'rohan_legacy_question',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'wisdom']
      },
      {
        choiceId: 'rohan_farewell_direct',
        text: "The world needs guardians. Go build them.",
        nextNodeId: 'rohan_farewell',
        pattern: 'building',
        skills: ['encouragement']
      }
    ],
    tags: ['rohan_arc'],
    metadata: {
      sessionBoundary: true  // Session 2: Crossroads complete
    }
  },

  {
    nodeId: 'rohan_legacy_question',
    speaker: 'Rohan',
    content: [
      {
        text: `The servers hum.

I don't want them to remember me. I want them to remember the feeling.

That moment when you finally understand how something works. When the abstraction dissolves and you see the machinery underneath. When you realize that every system was built by people, and you can build too.

David gave me that feeling. I want to pass it on.`,
        emotion: 'profound',
        variation_id: 'legacy_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_legacy_farewell',
        text: "That's a legacy worth building. Passing on that feeling. that's what teaching really is.",
        voiceVariations: {
          analytical: "Knowledge transfer with emotional context. That's what teaching really is.",
          helping: "You're giving others what David gave you. That's what teaching really is.",
          building: "That's a legacy worth building. That's what teaching really is.",
          exploring: "That moment of understanding you create. That's what teaching really is.",
          patience: "Passing on that feeling, patiently. That's what teaching really is."
        },
        nextNodeId: 'rohan_farewell',
        pattern: 'building',
        skills: ['leadership', 'wisdom'],
        consequence: {
          characterId: 'rohan',
          trustChange: 3
        }
      },
      {
        choiceId: 'rohan_legacy_reflect',
        text: "I hope someone remembers that feeling about me too. That moment when I helped them see something they couldn't see before.",
        nextNodeId: 'rohan_farewell',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'emotionalIntelligence'],
        consequence: {
          characterId: 'rohan',
          trustChange: 2
        }
      },
      {
        choiceId: 'rohan_legacy_question_back',
        text: "What do you want people to remember about you?",
        nextNodeId: 'rohan_asks_player',
        pattern: 'exploring',
        skills: ['communication', 'curiosity']
      }
    ],
    onEnter: [
      {
        characterId: 'rohan',
        addKnowledgeFlags: ['rohan_chose_foundation'],
        addGlobalFlags: ['rohan_arc_complete'],
        thoughtId: 'question-everything'
      }
    ],
    tags: ['ending', 'rohan_arc']
  },

  // ============= RECIPROCITY: ROHAN ASKS PLAYER =============
  {
    nodeId: 'rohan_asks_player',
    speaker: 'Rohan',
    content: [
      {
        text: `

You've been helping me figure out what I want to build. Imagine we're sitting here years from now, looking back. what do you want people to remember about you? What feeling do you want to pass on?`,
        emotion: 'curious_engaged',
        variation_id: 'rohan_reciprocity_v1'
      }
    ],
    choices: [
      {
        choiceId: 'player_remember_helping',
        text: "I want them to remember that I helped them see something in themselves they couldn't see. That moment of clarity, of possibility.",
        nextNodeId: 'rohan_farewell',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'emotionalIntelligence'],
        consequence: {
          characterId: 'rohan',
          trustChange: 2
        }
      },
      {
        choiceId: 'player_remember_teaching',
        text: "I want them to remember the feeling of understanding. When something finally clicks, and they realize they can build things too.",
        nextNodeId: 'rohan_farewell',
        pattern: 'building',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'rohan',
          trustChange: 2
        }
      },
      {
        choiceId: 'player_remember_presence',
        text: "I want them to remember I was there. That I listened. That I showed up.",
        nextNodeId: 'rohan_farewell',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'emotionalIntelligence'],
        consequence: {
          characterId: 'rohan',
          trustChange: 2
        }
      },
      {
        choiceId: 'player_uncertain_legacy',
        text: "I don't know yet. That's part of why I'm here. to figure out what I want my impact to be. What I want to pass on.",
        nextNodeId: 'rohan_farewell',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'adaptability']
      },
      // Career observation routes (ISP: Only visible when pattern combos are achieved)
      {
        choiceId: 'career_architect',
        text: "The way you think about building systems... it reminds me of architects.",
        nextNodeId: 'rohan_career_reflection_architect',
        pattern: 'analytical',
        skills: ['systemsThinking', 'criticalThinking'],
        visibleCondition: {
          patterns: { analytical: { min: 6 }, building: { min: 4 } },
          lacksGlobalFlags: ['rohan_mentioned_career']
        }
      },
      {
        choiceId: 'career_security',
        text: "Your patience with details... and seeing threats others miss. That's cybersecurity thinking.",
        nextNodeId: 'rohan_career_reflection_security',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving'],
        visibleCondition: {
          patterns: { analytical: { min: 5 }, patience: { min: 5 } },
          lacksGlobalFlags: ['rohan_mentioned_career']
        }
      }
    ],
    tags: ['reciprocity', 'player_reflection', 'rohan_arc']
  },

  // ============= BAD ENDING =============
  {
    nodeId: 'rohan_bad_ending',
    speaker: 'Rohan',
    content: [
      {
        text: `

Yeah. Let it run. If it breaks, they'll just hire another AI to fix it.

I'm going to apply for that carpentry apprenticeship. Wood doesn't lie.

Goodbye.`,
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

  // ============= E2-065: ROHAN'S VULNERABILITY ARC =============
  // "The truth that cost him relationships"
  {
    nodeId: 'rohan_vulnerability_arc',
    speaker: 'Rohan',
    content: [
      {
        text: `*He stares at the server lights, then speaks quietly.*

You want to know why I'm alone down here? It's not just introversion.

I had friends. A girlfriend. A whole life outside the server room.

Then I found it. A flaw in the algorithm that was making hiring decisions for half the Fortune 500. Biased against certain names. Certain zip codes. Automated discrimination at scale.

*His voice hardens.*

I reported it. My manager said "that's just how the data works." I showed it to my friends—they worked at the company that built it.

They said I was being "difficult." That I'd destroy careers if I went public. Including theirs.`,
        emotion: 'bitter_grief',
        microAction: 'His jaw tightens.',
        variation_id: 'vulnerability_v1',
        richEffectContext: 'warning'
      }
    ],
    requiredState: {
      trust: { min: 6 }
    },
    onEnter: [
      {
        characterId: 'rohan',
        addKnowledgeFlags: ['rohan_vulnerability_revealed', 'knows_about_algorithm']
      }
    ],
    choices: [
      {
        choiceId: 'vuln_right_choice',
        text: "You chose truth over comfort. That's not something to regret.",
        voiceVariations: {
          analytical: "Truth has long-term value. That's not something to regret.",
          helping: "You chose integrity. That's not something to regret.",
          building: "That choice built who you are. That's not something to regret.",
          exploring: "That decision shaped everything after. That's not something to regret.",
          patience: "You chose truth over comfort. That's not something to regret."
        },
        nextNodeId: 'rohan_vulnerability_reflection',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'rohan',
          trustChange: 2
        }
      },
      {
        choiceId: 'vuln_cost_question',
        text: "What did it cost you?",
        nextNodeId: 'rohan_vulnerability_reflection',
        pattern: 'exploring',
        skills: ['communication']
      },
      {
        choiceId: 'vuln_silence',
        text: "[Let the weight of that choice settle. Some truths need a witness.]",
        nextNodeId: 'rohan_vulnerability_reflection',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'rohan',
          trustChange: 2
        }
      }
    ],
    tags: ['vulnerability_arc', 'rohan_arc', 'emotional_core']
  },
  {
    nodeId: 'rohan_vulnerability_reflection',
    speaker: 'Rohan',
    content: [
      {
        text: `*He exhales slowly.*

I went public. The story broke. The algorithm got fixed—quietly, without credit.

And I lost everyone. The girlfriend said I "valued being right more than being happy." My friends stopped returning calls. The industry blacklisted me for two years.

*A pause.*

David was the first person who didn't try to tell me I should have stayed quiet. He said: "Truth has a cost. Some of us are willing to pay it."

You're the second person who's just... listened. Without trying to calculate whether I was right.`,
        emotion: 'vulnerable_resolved',
        variation_id: 'reflection_v1'
      }
    ],
    choices: [
      {
        choiceId: 'vuln_continue',
        text: "(Continue)",
        nextNodeId: 'rohan_farewell',
        pattern: 'patience'
      }
    ],
    tags: ['vulnerability_arc', 'rohan_arc']
  },
  {
    nodeId: 'rohan_farewell',
    speaker: 'Rohan',
    content: [
      {
        text: `You heard the hum, didn't you? The noise underneath the noise.

If you see Samuel, tell him... tell him I'm staying. Someone has to keep the lights on.`,
        emotion: 'grateful_solemn',
        variation_id: 'farewell_v2'
      }
    ],
    patternReflection: [
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: `You heard the hum, didn't you? The noise underneath the noise. You think like David did. that's rare.

If you see Samuel, tell him... tell him I'm staying. Someone has to keep the lights on.`,
        altEmotion: 'kindred_solemn'
      },
      {
        pattern: 'patience',
        minLevel: 5,
        altText: `You heard the hum, didn't you? The noise underneath the noise. The way you waited, listened. that's what the old-timers had.

If you see Samuel, tell him... tell him I'm staying. Someone has to keep the lights on.`,
        altEmotion: 'recognized_solemn'
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
  },

  // ============= CAREER MENTION NODES (Invisible Depth) =============
  {
    nodeId: 'rohan_career_reflection_architect',
    speaker: 'Rohan',
    content: [
      {
        text: `You know what separates good code from great code? The ability to see the whole system while building each piece.

Software architects—the ones who build the foundations everyone else stands on—they think like you do. Analytical and constructive at once.

Their code runs systems people use every day without knowing. Invisible but essential.`,
        emotion: 'impressed',
        variation_id: 'career_architect_v1'
      }
    ],
    requiredState: {
      patterns: {
        analytical: { min: 6 },
        building: { min: 4 }
      }
    },
    onEnter: [
      {
        characterId: 'rohan',
        addGlobalFlags: ['combo_deep_coder_achieved', 'rohan_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'rohan_career_architect_continue',
        text: "Building foundations that last. That's meaningful.",
        nextNodeId: 'rohan_introduction',
        pattern: 'building'
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'tech']
  },

  {
    nodeId: 'rohan_career_reflection_security',
    speaker: 'Rohan',
    content: [
      {
        text: `The way you analyze things... patient, thorough. You don't rush to conclusions.

Cybersecurity specialists think that way. They have to understand systems deeply enough to protect them—and to think like the threats trying to break them.

Digital guardians. Birmingham's becoming a hub for that kind of work.`,
        emotion: 'respectful',
        variation_id: 'career_security_v1'
      }
    ],
    requiredState: {
      patterns: {
        analytical: { min: 5 },
        patience: { min: 5 }
      }
    },
    onEnter: [
      {
        characterId: 'rohan',
        addGlobalFlags: ['combo_security_guardian_achieved', 'rohan_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'rohan_career_security_continue',
        text: "Protecting what matters. That takes patience.",
        nextNodeId: 'rohan_introduction',
        pattern: 'analytical'
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'tech']
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