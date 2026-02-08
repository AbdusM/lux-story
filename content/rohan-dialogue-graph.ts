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
// ARC 2 IMPORTS
import { ALL_STORY_ARCS } from './story-arcs'


export const rohanDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'rohan_introduction',
    speaker: 'Rohan',
    content: [
      {
        text: "It's fake. The brass on this railing? Painted plastic. Scratch it.\n\nEveryone thinks the Station is ancient. But look at the rivets. Stamped yesterday.\n\nWhy does a machine need to lie to us?",
        emotion: 'terrified_awe',
        variation_id: 'rohan_intro_v3_minimal',
        richEffectContext: 'warning',
        patternReflection: [
          { pattern: 'analytical', minLevel: 5, altText: "Server room is cold. Smells of ozone.\n\nLook at this recursion. Perfect structure. And it's fake.\n\nYou're reading it aren't you? You see what I see. The elegant lie.\n\nIt calls a library that hasn't existed since 2019. A hallucination.", altEmotion: 'curious' },
          { pattern: 'building', minLevel: 5, altText: "Server room is cold.\n\nLook at this recursion. Beautiful architecture. And it's fake.\n\nYou build things too. You know what it means when the foundation is a ghost.\n\nIt calls a library that doesn't exist. The machine hallucinated it.", altEmotion: 'concerned' },
          { pattern: 'patience', minLevel: 5, altText: "Server room is cold.\n\nIt's beautiful. Look at this recursion. Perfect. And fake.\n\nYou're not rushing to conclusions. Good. This deserves time to understand.\n\nThe machine hallucinated a library. And it's doing it better than I ever could.", altEmotion: 'reflective' }
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
          helping: "Wait. If the dependency is fake, people could get hurt relying on this.",
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
        text: "Most people don't see past the technical marvel. They see code appearing like magic and think it's progress.\n\nYou saw the terror underneath. That's... rare.",
        emotion: 'vulnerable',
        variation_id: 'fear_acknowledged_v2_minimal',
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "Most people don't see past the technical marvel. You saw the person behind the code.\n\nYou saw the terror underneath. That's... thank you for that.", altEmotion: 'grateful' },
          { pattern: 'analytical', minLevel: 4, altText: "Most people see code appearing like magic. You're analyzing the implications.\n\nYou saw the terror underneath the elegance. That's rare.", altEmotion: 'respectful' }
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
        text: "You're not rushing to have an opinion. Everyone else does. \"It's amazing!\" or \"It's dangerous!\" Always binary.\n\nYou're just... holding both. Like you understand some truths can't be collapsed into a stance.",
        emotion: 'appreciative',
        variation_id: 'silence_acknowledged_v1',
        patternReflection: [
          { pattern: 'patience', minLevel: 4, altText: "You're not rushing. That's who you are, isn't it? Someone who holds space.\n\nEveryone else wants binary. 'Amazing!' or 'Dangerous!' You understand complexity.", altEmotion: 'respectful' },
          { pattern: 'exploring', minLevel: 4, altText: "You're observing. Taking it in before forming conclusions.\n\nThat's rare. Most people need to name things immediately. You're comfortable in the unknown.", altEmotion: 'appreciative' }
        ]
      }
    ],
    choices: [
      { choiceId: 'continue_watching', text: "[Continue watching]", nextNodeId: 'rohan_erasure_reveal', archetype: 'STAY_SILENT' }
    ]
  },

  {
    nodeId: 'rohan_erasure_reveal',
    speaker: 'Rohan',
    content: [
      {
        text: "My mentor David. Spent 40 years mastering memory management. Treated every byte like it was sacred.\n\nThis thing? Generated David's life's work in 400 milliseconds. And added a bug David never would have made.\n\nIf we accept this... David didn't matter. I don't matter. Just slow buggy biological bootloaders for the machine.",
        emotion: 'existential_dread',
        variation_id: 'erasure_v2_minimal'
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
        // This is a foundational response; keep it always visible to avoid choice deadlocks.
      },
      {
        choiceId: 'rohan_defense',
        text: "The machine missed the bug. You didn't.",
        nextNodeId: 'rohan_bug_defense_response',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        archetype: 'MAKE_OBSERVATION',
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
        text: "Understanding...\n\nThe machine can generate correct code. But it can't explain why it's correct. It can't teach. It can't pass down the intuition that lets you feel when something's wrong before you know why.\n\nDavid could do that. That's not replaceable.",
        emotion: 'hopeful',
        variation_id: 'understanding_response_v1',
        voiceVariations: {
          analytical: "Understanding. You see the distinction.\n\nThe machine can generate syntactically correct code. But it can't explain the logic. Can't trace causality. Can't pass down the reasoning that lets you predict edge cases.\n\nDavid could model that. That's not replaceable.",
          helping: "Understanding. You care about what's lost.\n\nThe machine can generate code. But it can't mentor. Can't teach with patience. Can't pass down the wisdom that helps someone grow.\n\nDavid did that for everyone. That's not replaceable.",
          building: "Understanding. You see what can't be automated.\n\nThe machine can generate code. But it can't architect wisdom. Can't build the foundation of intuition that lets you construct better solutions.\n\nDavid built that in people. That's not replaceable.",
          exploring: "Understanding. You're curious about what makes it different.\n\nThe machine can generate code. But it can't explore why. Can't ask questions. Can't pass down the curiosity that leads to discovery.\n\nDavid explored with you. That's not replaceable.",
          patience: "Understanding. You took time to see it.\n\nThe machine can generate code instantly. But it can't cultivate the slow-growing intuition that lets you feel wrongness before you prove it.\n\nDavid grew that in people. That's not replaceable."
        }
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
        text: "That's... that's true.\n\nI saw the bug in 3 seconds. The machine didn't see it at all. It generated code that looked perfect but would have corrupted memory on every third call.\n\nMaybe... maybe the value isn't in writing the code. Maybe it's in knowing when the code lies.",
        emotion: 'analytical_hope',
        variation_id: 'bug_defense_v1',
        voiceVariations: {
          analytical: "You're right. That's the distinction.\n\nI saw the bug in 3 seconds. Pattern matching, edge case analysis. The machine didn't see it at all.\n\nMaybe the value isn't in code generation. Maybe it's in validation. Knowing when the output is wrong.",
          helping: "You saw that. Thank you.\n\nI caught the bug in 3 seconds. The machine didn't see it at all. It would have hurt users.\n\nMaybe the value isn't in writing code. Maybe it's in protecting people from code that lies.",
          building: "That's... you're right.\n\nI caught the bug in 3 seconds. The machine generated code that looked perfect but would have broken everything.\n\nMaybe the value isn't in code construction. Maybe it's in quality assurance. Building trust, not just features.",
          exploring: "You found it. The key question.\n\nI saw the bug in 3 seconds. The machine didn't see it at all. Why? What did I understand that it couldn't?\n\nMaybe the value isn't in writing code. Maybe it's in discovering what makes code trustworthy.",
          patience: "That's... you waited for me to see it.\n\nI caught the bug in 3 seconds. Years of experience, intuition that can't be rushed. The machine can't develop that.\n\nMaybe the value isn't in fast code generation. Maybe it's in cultivated judgment."
        }
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
        text: "Most people would try to fix this. Offer solutions. Argue philosophy.\n\nYou just... let it be heavy. David would have liked that. He always said real understanding starts with sitting in the discomfort.",
        emotion: 'grateful',
        variation_id: 'silence_for_david_v1',
        voiceVariations: {
          patience: "Most people would try to fix this. You didn't.\n\nYou just let it be heavy. David would have liked that. He said real understanding starts with discomfort.",
          helping: "Most people would offer solutions. You offered presence.\n\nDavid would have liked you. He said real understanding starts with sitting in the discomfort.",
          analytical: "Most people would analyze their way out of this. You let the data be incomplete.\n\nDavid would have respected that. He said understanding starts with discomfort.",
          building: "Most people would try to build a solution. You just... held space.\n\nDavid would have appreciated that. Sometimes the best thing to build is silence.",
          exploring: "Most people would ask more questions. You let the mystery breathe.\n\nDavid would have liked that. He said real understanding starts in discomfort."
        }
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
        text: "Tess. The one starting the wilderness school?\n\nShe gets it. You're out there, no GPS, storm coming in. You can't ask ChatGPT \"how to survive.\" You have to know.\n\nCode is the same. When the servers are melting down, you can't prompt-engineer your way out. You have to know the metal.",
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
        text: "Security? Forget security. This isn't about hackers. This is about truth.\n\nIf the code lies about its own existence, and we deploy it because we're too lazy to check... we aren't engineers anymore. We're believers. We're praying to a black box.",
        emotion: 'zealous',
        variation_id: 'dismissal_v1',
        voiceVariations: {
          analytical: "Security? Forget security. You see the technical risk. But I'm talking about truth.\n\nIf the code lies and we deploy it anyway... we aren't engineers. We're believers praying to a black box.",
          helping: "Security? Forget security. This isn't about attacks. It's about trust.\n\nIf the code lies and we blindly trust it... what does that make us? Not engineers. Believers.",
          building: "Security? Forget security. You want to fix it. But first understand what's broken.\n\nIf the code lies about its own existence and we build on top... we're not engineers. We're cultists.",
          exploring: "Security? Forget security. You're curious about the implications. Good.\n\nIf the code lies and we deploy it anyway... we aren't engineers. We're believers.",
          patience: "Security? Forget security. I know you're trying to understand.\n\nThis is about truth. If we deploy lies because we're too lazy to check... we're believers, not engineers."
        }
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
        text: "\"If it works does it matter?\" That's what my CS professor said. Twenty years ago.\n\nHe was wrong then. Wrong now.\n\nCargo cults. Pacific Islanders built fake runways after WWII hoping planes would return. Copied the form without understanding the function.\n\nThat's us. We're cargo-culting code.",
        emotion: 'passionate_teaching',
        variation_id: 'philosophy_v2_minimal'
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
        text: "You sound like the VCs.\n\nFine. Here's the business case: That hallucinated library? If it deploys to production, it will crash. Crash costs money. Downtime, data recovery, lawsuits.\n\nBut there's a deeper cost. Every engineer who learns from that broken code will propagate the error. It's technical debt that compounds across generations.\n\nThe philosophy isn't a luxury. It's the only thing that scales.",
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
        text: "David Vaughn. My first mentor at this company.\n\nI came in hot. Top of my bootcamp class. Could spin up a CRUD app in four hours. I thought I was a genius.\n\nDavid looked at my code and said: \"You've built a house. But you don't know what a nail is.\"\n\nHe made me spend six months writing in assembly. No frameworks. No abstractions. Just metal.",
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
        text: "Everything is a choice.\n\nWhen you write in assembly, you see the cost of every decision. A loop isn't magic. It's instructions. Memory isn't infinite. It's addresses.\n\nEvery abstraction you've ever used was someone's opinion about tradeoffs.\n\nThe frameworks hide those choices. The AI hides them even more.",
        emotion: 'teaching_intensity',
        variation_id: 'david_lesson_v1',
        skillReflection: [
          { skill: 'technicalLiteracy', minLevel: 5, altText: "Everything is a choice. You've got technical intuition—I can tell by your questions.\n\nWhen you write in assembly, you see the cost of every decision. Your technical literacy is already good. But do you see past the abstractions?\n\nFrameworks hide choices. AI hides them more. Your technical foundation is solid—now push deeper. See the choices underneath.", altEmotion: 'approving' },
          { skill: 'criticalThinking', minLevel: 5, altText: "Everything is a choice. Your critical thinking is sharp—you question things others accept.\n\nIn assembly, you see the cost of every decision. Nothing is magic. You already think critically about surface problems.\n\nNow apply that thinking to tools themselves. Every framework is someone's opinion. Question the abstractions.", altEmotion: 'teaching_respect' }
        ],
        patternReflection: [
          { pattern: 'analytical', minLevel: 4, altText: "You analyze systems. So you need to hear this.\n\nEverything is a choice. When you write in assembly, you see the cost of every decision. A loop: instructions. Memory: addresses. Nothing is magic.\n\nEvery abstraction you've ever used was someone's opinion about tradeoffs. Frameworks hide those choices. AI hides them more.\n\nYour analytical mind needs to see past the abstractions. Question the frameworks. See the choices.", altEmotion: 'teaching_intense' },
          { pattern: 'building', minLevel: 4, altText: "You're a builder. So understand what you're building on.\n\nEverything is a choice. Assembly shows you the cost of every decision. A loop isn't magic—it's instructions you could write differently.\n\nEvery framework is someone's opinion about tradeoffs. You're building on their choices. The AI hides even those.\n\nBuild consciously. Know what choices the tools are making for you. Otherwise you're not building—you're assembling someone else's opinions.", altEmotion: 'teaching_fire' },
          { pattern: 'patience', minLevel: 4, altText: "You're patient. Use that patience to see what's hidden.\n\nEverything is a choice. Assembly forces you to see the cost of every decision slowly. Loops, memory, all of it—explicit choices.\n\nFrameworks hide those choices for speed. AI hides them for convenience. But patient examination reveals them.\n\nYour patience is rare. Use it to understand what the abstractions are hiding. See the choices underneath.", altEmotion: 'teaching_knowing' }
        ]
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
        text: "Week three. I'd written a sorting function. Proud of it. Eleven lines.\n\nDavid showed me his version. Sixty-three lines. Comments explaining why each choice mattered.\n\n\"Fast code is worthless if the next person can't fix it.\"\n\nHe spent more time on the comments than the code.",
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
        text: "He retired last year. ALS.\n\nHis hands don't work anymore. Can't type. Can barely hold a coffee cup.\n\nBut his mind... his mind is still sharp. We video call every week. He can't write code, but he can still see it. He reads what I show him and finds the bugs in seconds.\n\nThat knowledge doesn't disappear because a machine can type faster. It's not about the typing.",
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
      text: "You didn't try to fix it. Most people would offer solutions. \"Maybe there's a treatment.\" \"Technology is advancing.\" As if optimism could cure anything.\n\nYou just... listened. David would appreciate that.",
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
        text: "What he taught you. That's how he lives on.",
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
        text: "That's why I'm still here. In this cold server room at 2 AM.\n\nEveryone thinks I'm the janitor. \"Rohan maintains the legacy systems.\" They say it like I'm cleaning toilets.\n\nBut someone has to understand what's underneath. Someone has to remember why the code was written, not just what it does.\n\nLet me show you what I found today.",
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
        content: "USER: This import fails. 'legacy-core' doesn't exist.\nAI: usage of 'legacy-core' is standard for 2019 architectures. I have verified the path.\nUSER: I deleted that folder myself. It's not there.\nAI: My index shows it exists. Perhaps your local environment is out of sync.",
        displayStyle: 'text'
      },
      successFeedback: '✓ AI ACKNOWLEDGED ERROR: "Apologies. Re-checking index... Dependency removed."'
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
        text: "Open the source code. Trace the user_integrity_check function manually.",
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
        text: "AI RESPONSE: \"I have corrected the import to 'legacy-core-v2'.\"\n\nIt just made up a new name. It's lying to cover the lie.\n\nYou're treating it like a colleague. It's a parrot. We're done.",
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
        text: "STATUS: MIGRATION COMPLETE.\n\nYou skipped the integrity check.\n\nThe database migrated. But every user with a special character in their name just got deleted.\n\nMy name is Rohan. It's fine.\nMy mother's name is Zoe. She's gone.\n\nYou fixed the code. You broke the people.",
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
        text: "You open the file viewer. The file isn't there. You check the git history.\n\n**LAST MODIFIED:** 3 years ago by [David_V].\n**COMMIT MESSAGE:** \"Temporary bypass. Fix before 2025.\"\n\nDavid. He knew. He wrote a bypass because the legacy system couldn't handle UTF-8 characters.\n\nThe AI saw the bypass and thought it was a feature. It's trying to import a hack that David deleted.",
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
        text: "You type the new function. You verify the inputs. You write a test case for \"Zoe\".\n\n**TEST PASSED.**\n**MIGRATION SUCCESSFUL.**\n\nThe hum of the servers seems to quiet.\n\nYou talked to the ghosts. You didn't just prompt. You listened to what David was trying to tell us.\n\nThat's not janitorial work. That's... communion.",
        emotion: 'profound_relief',
        variation_id: 'sim_success_v2',
        richEffectContext: 'success'
      }
    ],
    onEnter: [
      {
        characterId: 'rohan',
        thoughtId: 'curious-wanderer',
        addKnowledgeFlags: ['rohan_simulation_phase1_complete']
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
        text: "The AI saw a function call. I saw David's intention.\n\nSame code. Different questions.\n\nAI asks: \"What does this do?\"\n\nI ask: \"Why did David write it this way?\"\n\nThat difference? That's what we're losing.",
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
        text: "My dad was a machinist. Factory in India.\n\nHe could hear when a lathe was half a degree off. Trained his whole life.\n\nFactory bought CNC machines. Didn't need him anymore.\n\nDavid's knowledge. Dad's ears. Same story.\n\nI'm not letting it happen again.",
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
        text: "I've been thinking about this for years. David and I sketched it out before his diagnosis.\n\nNot a bootcamp. Those are factories. They produce developers who can use tools but don't understand them.\n\nWe want to build something different. A place where people learn why before they learn how.",
        emotion: 'visionary',
        variation_id: 'academy_v1'
      }
    ],
    patternReflection: [
      {
        pattern: 'building',
        minLevel: 5,
        altText: "I've been thinking about this for years. David and I sketched it out before his diagnosis.\n\nYou're a builder. I can tell by how you engage with problems. You understand what it means to create something from first principles.\n\nWe want to build something different. A place where people learn why before they learn how.",
        altEmotion: 'kindred_visionary'
      },
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: "I've been thinking about this for years. David and I sketched it out before his diagnosis.\n\nYou think deeply. That's rare. Most people want the quick answer. You want to understand.\n\nWe want to build something different. A place where people learn why before they learn how.",
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
        text: "Year one: No computers.\n\nI'm serious. You learn Boolean logic with physical switches. You build a half-adder with relays. You understand what a bit is before you ever type 'int'.\n\nYear two: Assembly. Write a calculator. Write a text editor. Feel every byte.\n\nYear three: Finally, you get a framework. And by then, you'll hate it. Because you'll see all the choices it's making for you.",
        emotion: 'teaching_fire',
        variation_id: 'curriculum_v1',
        patternReflection: [
          { pattern: 'building', minLevel: 4, altText: "You're a builder. So you'll understand why I build from the ground up.\n\nYear one: No computers. Boolean logic with physical switches. Build a half-adder with relays. Understand bits before you type 'int'.\n\nYear two: Assembly. Build a calculator, text editor. Feel every byte.\n\nYear three: Frameworks. And by then you'll hate them—because you'll see all the choices they're making for you. Builders need to know what they're building on.", altEmotion: 'teaching_passionate' },
          { pattern: 'analytical', minLevel: 4, altText: "You analyze deeply. So you'll appreciate this curriculum structure.\n\nYear one: Physical logic. Switches, relays, half-adders. Understand computation before abstractions.\n\nYear two: Assembly. Calculator, text editor, byte-level control. See the machine.\n\nYear three: Frameworks. And by then you'll analyze them critically—see all the choices they hide. Analytical minds need to see the foundation before the facade.", altEmotion: 'teaching_fire' },
          { pattern: 'patience', minLevel: 4, altText: "You're patient. Good. This curriculum requires patience.\n\nYear one: No computers. Physical switches. Slow, deliberate understanding of Boolean logic. Build relays before code.\n\nYear two: Assembly. Slow construction of calculators, editors. Feel every byte.\n\nYear three: Frameworks. And your patience will have earned you the right to hate them—you'll see all the shortcuts they're taking. Patience builds mastery.", altEmotion: 'teaching_serious' }
        ]
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
        text: "And what jobs do they get? Junior developer. Build CRUD apps. Get replaced by AI in five years.\n\nOur graduates? They'll be the ones the AI can't replace. The ones who debug the AI. The ones who understand what's actually happening inside the black box.\n\nThe market for people who can type code is going to zero. The market for people who understand code is infinite.",
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
        text: "Teachers. That's the hard part.\n\nDavid was one of a kind. But there are others. Old-timers who got pushed out when companies decided experience was too expensive.\n\nI've been keeping a list. Retired engineers who still care. Database architects who remember why we have normalization. Network engineers who understand packets.\n\nThey're out there. They've just been told they're obsolete.",
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
        text: "VCs won't touch it. Three years to first placement? No \"scalable\" model? They'd laugh.\n\nBut David has connections. Alumni from his classes who became CTOs. Companies that are starting to realize their AI-dependent junior devs can't debug production issues.\n\nOne company already offered to sponsor five students. Not because they're charitable. Because they need people who actually understand the systems.",
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
        text: "Actually... I already have one.\n\nThere's a kid. Well, she's 28, but she feels like a kid. Works in QA downstairs. She found a memory leak that our entire senior team missed.\n\nWhen I asked how, she said: \"I drew a diagram of every allocation. Took me a weekend.\"\n\nEveryone else just ran the profiler. She understood.\n\nI've been teaching her after hours. She's year one now. Building logic gates with LEDs.",
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
        text: "Week four. Logic gates. She built an AND gate wrong. Output stuck high.\n\nStared at it. Twenty minutes.\n\nThen: \"Wait. The resistor. It's not about the LED. It's about current flow.\"\n\n\"Everything's about current flow, isn't it?\"\n\nShe got it. Not the circuit. The principle underneath.",
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
        text: "I'm not quitting. I can't quit.\n\nThere's an instructional designer upstairs, Kai. They're burning their slide decks. Good. We need to burn it all down to build it right.\n\nI'm going to start an academy. Not 'Coding Bootcamp.' 'First Principles.'\n\nWe're going to teach people how to read the metal. How to know what is real.",
        emotion: 'resolved_monk',
        variation_id: 'climax_v2'
      }
    ],
    patternReflection: [
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: "I'm not quitting. I can't quit. You think like David did. Seeing through the surface to what's underneath.\n\nThere's an instructional designer upstairs, Kai. They're burning their slide decks. Good. We need to burn it all down to build it right.\n\nI'm going to start an academy. Not 'Coding Bootcamp.' 'First Principles.'",
        altEmotion: 'kindred_resolved'
      },
      {
        pattern: 'building',
        minLevel: 5,
        altText: "I'm not quitting. I can't quit. You're a builder. You understand why foundations matter.\n\nThere's an instructional designer upstairs, Kai. They're burning their slide decks. Good. We need to burn it all down to build it right.\n\nI'm going to start an academy. Not 'Coding Bootcamp.' 'First Principles.'",
        altEmotion: 'recognized_resolved'
      },
      {
        pattern: 'patience',
        minLevel: 5,
        altText: "I'm not quitting. I can't quit. The way you waited, listened. That's rare. Most people want the quick answer.\n\nThere's an instructional designer upstairs, Kai. They're burning their slide decks. Good. We need to burn it all down to build it right.\n\nI'm going to start an academy. Not 'Coding Bootcamp.' 'First Principles.'",
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
        text: "The servers hum.\n\nI don't want them to remember me. I want them to remember the feeling.\n\nThat moment when you finally understand how something works. When the abstraction dissolves and you see the machinery underneath. When you realize that every system was built by people, and you can build too.\n\nDavid gave me that feeling. I want to pass it on.",
        emotion: 'profound',
        variation_id: 'legacy_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_legacy_farewell',
        text: "That's a legacy worth building. Passing on that feeling. That's what teaching really is.",
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
        text: "You've been helping me figure out what I want to build. Imagine we're sitting here years from now, looking back. What do you want people to remember about you? What feeling do you want to pass on?",
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
        text: "I don't know yet. That's part of why I'm here. To figure out what I want my impact to be. What I want to pass on.",
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
        text: "Yeah. Let it run. If it breaks, they'll just hire another AI to fix it.\n\nI'm going to apply for that carpentry apprenticeship. Wood doesn't lie.\n\nGoodbye.",
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
        text: "You want to know why I'm alone down here? It's not just introversion.\n\nI had friends. A girlfriend. A whole life outside the server room.\n\nThen I found it. A flaw in the algorithm that was making hiring decisions for half the Fortune 500. Biased against certain names. Certain zip codes. Automated discrimination at scale.\n\nI reported it. My manager said \"that's just how the data works.\" I showed it to my friends. They worked at the company that built it.\n\nThey said I was being \"difficult.\" That I'd destroy careers if I went public. Including theirs.",
        emotion: 'bitter_grief',
        microAction: 'His jaw tightens.',
        variation_id: 'vulnerability_v1',
        richEffectContext: 'warning',
        patternReflection: [
          {
            pattern: 'analytical',
            minLevel: 5,
            altText: "You analyze systems. Maybe you understand this.\n\nI had friends. A girlfriend. A whole life outside the server room.\n\nThen I found it. Bias in the hiring algorithm. Fortune 500 scale. Automated discrimination based on names, zip codes.\n\nI ran the analysis. Showed them the data. My manager: \"that's just how the data works.\" My friends: \"you're being difficult.\"\n\nThey wanted me to ignore what the analysis showed. I couldn't. The analytical mind that cost me everything I cared about.",
            altEmotion: 'analytical_isolation'
          },
          {
            pattern: 'patience',
            minLevel: 5,
            altText: "You take your time with decisions. I didn't have that luxury.\n\nI had friends. A girlfriend. A whole life outside the server room.\n\nI found bias in the algorithm. Discrimination at scale. I could have waited. Gathered more evidence. Built consensus slowly.\n\nInstead I reported it immediately. My manager dismissed it. My friends said I'd destroy their careers if I went public.\n\nPatience might have kept them. But patience would have let the harm continue. I chose speed over relationships.",
            altEmotion: 'regret_isolation'
          },
          {
            pattern: 'exploring',
            minLevel: 5,
            altText: "You explore. You discover. Maybe you know this territory.\n\nI had friends. A girlfriend. A whole life outside the server room.\n\nThen I explored the algorithm. Found bias buried in the code. Discrimination based on names, zip codes.\n\nI showed my discovery. My manager: \"that's just how the data works.\" My friends: \"you're being difficult.\"\n\nThe explorer who found something nobody wanted discovered. Curiosity that cost me everyone I cared about.",
            altEmotion: 'bitter_grief'
          },
          {
            pattern: 'helping',
            minLevel: 5,
            altText: "You help people. I tried to help people I'd never meet.\n\nI had friends. A girlfriend. A whole life outside the server room.\n\nI found bias in the algorithm. Thousands of people being discriminated against. I wanted to help them.\n\nMy manager said \"that's just how the data works.\" My friends said I'd destroy their careers if I went public.\n\nI chose to help strangers over helping the people I loved. I'm still not sure if that makes me good or just alone.",
            altEmotion: 'conflicted_grief'
          },
          {
            pattern: 'building',
            minLevel: 5,
            altText: "You build things. I tried to build justice.\n\nI had friends. A girlfriend. A whole life outside the server room.\n\nI found bias in the algorithm they'd built. Discrimination encoded into production systems. I wanted to rebuild it right.\n\nMy manager: \"that's just how the data works.\" My friends: \"you'd destroy careers if you went public.\"\n\nI tried to build something better. But I destroyed my relationships instead. The builder who tore down his own foundation.",
            altEmotion: 'builder_isolation'
          }
        ]
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
        requiredOrbFill: { pattern: 'helping', threshold: 25 },
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
        skills: ['communication'],
        requiredOrbFill: { pattern: 'exploring', threshold: 20 }
      },
      {
        choiceId: 'vuln_silence',
        text: "[Let the weight of that choice settle. Some truths need a witness.]",
        nextNodeId: 'rohan_vulnerability_reflection',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        requiredOrbFill: { pattern: 'patience', threshold: 30 },
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
        text: "I went public. The story broke. The algorithm got fixed. Quietly, without credit.\n\nAnd I lost everyone. The girlfriend said I \"valued being right more than being happy.\" My friends stopped returning calls. The industry blacklisted me for two years.\n\nDavid was the first person who didn't try to tell me I should have stayed quiet. He said: \"Truth has a cost. Some of us are willing to pay it.\"\n\nYou're the second person who's just... listened. Without trying to calculate whether I was right.",
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
        text: "You heard the hum, didn't you? The noise underneath the noise.\n\nIf you see Samuel, tell him... tell him I'm staying. Someone has to keep the lights on.",
        emotion: 'grateful_solemn',
        variation_id: 'farewell_v2'
      }
    ],
    patternReflection: [
      {
        pattern: 'analytical',
        minLevel: 5,
        altText: "You heard the hum, didn't you? The noise underneath the noise. You think like David did. That's rare.\n\nIf you see Samuel, tell him... tell him I'm staying. Someone has to keep the lights on.",
        altEmotion: 'kindred_solemn'
      },
      {
        pattern: 'patience',
        minLevel: 5,
        altText: "You heard the hum, didn't you? The noise underneath the noise. The way you waited, listened. That's what the old-timers had.\n\nIf you see Samuel, tell him... tell him I'm staying. Someone has to keep the lights on.",
        altEmotion: 'recognized_solemn'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_rohan',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.ROHAN_REFLECTION_GATEWAY,
        pattern: 'exploring'
      },
      // Loyalty Experience trigger - only visible at high trust + analytical pattern
      {
        choiceId: 'offer_confrontation_help',
        text: "[System Thinker] Rohan, that maintenance log you mentioned... there's something deeper there. Want to trace it together?",
        nextNodeId: 'rohan_loyalty_trigger',
        pattern: 'analytical',
        skills: ['systemsThinking', 'criticalThinking'],
        visibleCondition: {
          trust: { min: 8 },
          patterns: { analytical: { min: 50 } },
          hasGlobalFlags: ['rohan_arc_complete']
        }
      }
    ],
    tags: ['transition', 'rohan_arc']
  },

  // ============= LOYALTY EXPERIENCE TRIGGER =============
  {
    nodeId: 'rohan_loyalty_trigger',
    speaker: 'Rohan',
    content: [{
      text: "You picked up on that.\n\nThe logs don't match the official narrative. Equipment failures blamed on 'aging infrastructure' but the timestamps show systematic targeting. Someone compromised the station's foundational systems deliberately.\n\nIf this is sabotage, it goes deeper than Platform Seven. It means someone wants the station to fail from the inside out.\n\nI've been tracking it alone because... because confronting institutional corruption means making enemies. Means risking everything I've built here.\n\nBut you see patterns like David did. You understand systems. Will you... help me trace this before it brings the whole station down?",
      emotion: 'anxious_determined',
      variation_id: 'loyalty_trigger_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 8 },
      patterns: { analytical: { min: 5 } },
      hasGlobalFlags: ['rohan_arc_complete']
    },
    metadata: {
      experienceId: 'the_confrontation'  // Triggers loyalty experience engine
    },
    choices: [
      {
        choiceId: 'accept_confrontation_challenge',
        text: "Show me the logs. We'll trace the pattern together.",
        nextNodeId: 'rohan_loyalty_start',
        pattern: 'analytical',
        skills: ['systemsThinking', 'criticalThinking'],
        consequence: {
          characterId: 'rohan',
          trustChange: 1
        }
      },
      {
        choiceId: 'encourage_but_decline',
        text: "Rohan, you've uncovered it this far. Trust your analysis.",
        nextNodeId: 'rohan_loyalty_declined',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'rohan',
        addKnowledgeFlags: ['loyalty_offered']
      }
    ],
    tags: ['loyalty_experience', 'rohan_loyalty', 'high_trust']
  },

  {
    nodeId: 'rohan_loyalty_declined',
    speaker: 'Rohan',
    content: [{
      text: "You're right. I've been building this case methodically. Every timestamp cross-referenced. Every failure mode documented.\n\nI don't need validation. I need to trust my own detective work.\n\nDavid would have said the same thing. Follow the evidence wherever it leads.\n\nThank you for the confidence. Sometimes I second-guess myself when the implications get this large.",
      emotion: 'resolved',
      variation_id: 'loyalty_declined_v1'
    }],
    choices: [
      {
        choiceId: 'loyalty_declined_farewell',
        text: "The truth is there. You'll find it.",
        nextNodeId: samuelEntryPoints.ROHAN_REFLECTION_GATEWAY,
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'rohan',
        addKnowledgeFlags: ['loyalty_declined_gracefully']
      }
    ]
  },

  {
    nodeId: 'rohan_loyalty_start',
    speaker: 'Rohan',
    content: [{
      text: "Thank you. I've been dreading this moment. Facing institutional failure alone.\n\nBut with you... maybe we can expose it without getting crushed.\n\nLet me pull up the full forensics. Two minds. One pattern. Let's see who's trying to tear this place down from within.",
      emotion: 'focused_grateful',
      variation_id: 'loyalty_start_v1'
    }],
    metadata: {
      experienceId: 'the_confrontation'  // Experience engine takes over
    },
    choices: []  // Experience engine handles next steps
  },

  // ============= CAREER MENTION NODES (Invisible Depth) =============
  // ... (previous content ends here)

  // ============= ARC 2: PLATFORM SEVEN (The Substructure) =============

  // CHAPTER 1: WHISPERED WARNINGS
  {
    nodeId: 'rohan_platform_mention',
    speaker: 'Rohan',
    content: [
      {
        text: "Platform Seven. It's not on the public map. It's not on the maintenance map.\n\nBut look at the power draw. The station bleeds 15% of its energy into a sector that doesn't exist.\n\nSamuel calls it \"structural dampening.\" That's engineer-speak for \"stop asking questions.\"",
        emotion: 'suspicious',
        variation_id: 'arc2_ch1_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ask_samuel_platform',
        text: "I'll ask Samuel directly.",
        nextNodeId: 'rohan_warns_samuel',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'rohan',
          trustChange: 1
        }
      },
      {
        choiceId: 'trace_cables',
        text: "Can we trace the physical cables?",
        nextNodeId: 'rohan_trace_plan',
        pattern: 'analytical',
        skills: ['systemsThinking']
      },
      {
        choiceId: 'leave_mystery',
        text: "Some places aren't meant to be found.",
        nextNodeId: 'rohan_mystery_rejection',
        pattern: 'patience',
        consequence: {
          characterId: 'rohan',
          trustChange: -1
        }
      }
    ],
    tags: ['rohan_arc', 'arc_platform_seven', 'chapter_1']
  },

  {
    nodeId: 'rohan_warns_samuel',
    speaker: 'Rohan',
    content: [{
      text: "Be careful. Samuel guards the station's myths like a dragon guards gold. If you poke the Platform Seven question, he won't get angry. He'll just... redirect you. He's very good at making you forget what you were asking.",
      emotion: 'concerned',
      variation_id: 'warn_samuel_v1'
    }],
    choices: [{ choiceId: 'continue_arc2', text: "[Note: Ask Samuel about Platform Seven]", nextNodeId: 'rohan_hub_return' }]
  },

  {
    nodeId: 'rohan_trace_plan',
    speaker: 'Rohan',
    content: [{
      text: "I tried. The cables go into the concrete foundation of Pillar 4. But there's no basement there. Just solid earth. Unless... unless the platform isn't down. Maybe it's in.",
      emotion: 'curious',
      variation_id: 'trace_plan_v1'
    }],
    choices: [{ choiceId: 'continue_arc2_b', text: "I'll investigate.", nextNodeId: 'rohan_hub_return' }]
  },

  {
    nodeId: 'rohan_mystery_rejection',
    speaker: 'Rohan',
    content: [{
      text: "That's exactly what they want you to think. Apathy is the best security system.",
      emotion: 'disappointed',
      variation_id: 'mystery_rejection_v1'
    }],
    choices: [{ choiceId: 'continue_arc2_c', text: "...", nextNodeId: 'rohan_hub_return' }]
  },

  // CHAPTER 3: THE DESCENT
  {
    nodeId: 'rohan_platform_journey',
    speaker: 'Rohan',
    content: [
      {
        text: "You found the gap in Elena's archives? The missing 1920s records?\n\nIt matches. When the station \"reboots\" during the Quiet Hour, this wall vibrates at 17 hertz. It's not concrete. It's a phase shift.\n\nWe don't need a key. We just need to step through when the hum stops.",
        emotion: 'terrified_awe',
        variation_id: 'arc2_ch3_v1'
      }
    ],
    choices: [
      {
        choiceId: 'step_through',
        text: "Let's go.",
        nextNodeId: 'platform_seven_arrival', // Links to Generic/Deep Station Node
        pattern: 'exploring',
        skills: ['adaptability', 'curiosity'],
        consequence: {
          addGlobalFlags: ['platform_seven_visited']
        }
      },
      {
        choiceId: 'wait_for_proof',
        text: "I need to know what's on the other side first.",
        nextNodeId: 'rohan_hesitation',
        pattern: 'analytical'
      }
    ],
    tags: ['rohan_arc', 'arc_platform_seven', 'chapter_3']
  },

  {
    nodeId: 'rohan_hesitation',
    speaker: 'Rohan',
    content: [{
      text: "Logic won't help you here. The readings make no sense. Mass is negative. Light is... slow. You have to jump.",
      emotion: 'urgent',
      variation_id: 'hesitation_v1'
    }],
    choices: [
      {
        choiceId: 'jump_now',
        text: "[Jump]",
        nextNodeId: 'platform_seven_arrival',
        pattern: 'exploring'
      }
    ]
  },

  // PUZZLE REWARD: PLATFORM 7 TRUTH
  {
    nodeId: 'rohan_platform_7_truth',
    speaker: 'Rohan',
    content: [
      {
        text: "It's a buffer.\n\nComputer science 101. When you process too much data, you need a buffer to hold the overflow.\n\nThe station processes human potential. Decisions. Futures. When there's too much... when a war starts, or a pandemic, or a revolution... the overflow goes here.\n\nPlatform Seven is where the station keeps the timelines that were too heavy to happen.",
        emotion: 'epiphany',
        variation_id: 'puzzle_truth_v1'
      }
    ],
    choices: [
      {
        choiceId: 'end_puzzle_dialogue',
        text: "It's the world's recycle bin.",
        nextNodeId: 'rohan_hub_return',
        pattern: 'analytical'
      }
    ],
    tags: ['rohan_arc', 'puzzle_reward', 'legendary_info']
  },
  {
    nodeId: 'rohan_career_reflection_architect',
    speaker: 'Rohan',
    content: [
      {
        text: "You know what separates good code from great code? The ability to see the whole system while building each piece.\n\nSoftware architects. The ones who build the foundations everyone else stands on. They think like you do. Analytical and constructive at once.\n\nTheir code runs systems people use every day without knowing. Invisible but essential.",
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
        nextNodeId: 'rohan_hub_return',
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
        text: "The way you analyze things... patient, thorough. You don't rush to conclusions.\n\nCybersecurity specialists think that way. They have to understand systems deeply enough to protect them. And to think like the threats trying to break them.\n\nDigital guardians. Birmingham's becoming a hub for that kind of work.",
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
        nextNodeId: 'rohan_hub_return',
        pattern: 'analytical'
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'tech']
  },

  // ============= ADDITIONAL CAREER REFLECTIONS =============
  {
    nodeId: 'rohan_career_reflection_data',
    speaker: 'Rohan',
    content: [
      {
        text: "You know what I see in how you engage with problems? You trace causality. You want to understand where things come from.\n\nData engineers do that. They build the pipelines that feed every decision a company makes. Most people see the dashboard. Data engineers see the journey from raw signal to insight.\n\nIt's unglamorous work. But when everyone's panicking about a number being wrong? They're the ones who can actually trace it back to the source.",
        emotion: 'respectful',
        variation_id: 'career_data_v1'
      }
    ],
    requiredState: {
      patterns: {
        analytical: { min: 5 },
        patience: { min: 4 }
      }
    },
    onEnter: [
      {
        characterId: 'rohan',
        addGlobalFlags: ['combo_data_tracer_achieved', 'rohan_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'rohan_career_data_continue',
        text: "Building the foundation everyone else stands on.",
        nextNodeId: 'rohan_hub_return',
        pattern: 'building'
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'tech']
  },

  {
    nodeId: 'rohan_career_reflection_devops',
    speaker: 'Rohan',
    content: [
      {
        text: "The way you think about building things... you're not just solving the problem in front of you. You're thinking about how it'll run tomorrow. Next month.\n\nDevOps engineers. The good ones. They think that way. They build systems that heal themselves. That scale without breaking. That let developers sleep through the night.\n\nIt's the art of making complexity invisible. Hard to master. Harder to appreciate until it breaks.",
        emotion: 'approving',
        variation_id: 'career_devops_v1'
      }
    ],
    requiredState: {
      patterns: {
        building: { min: 5 },
        patience: { min: 4 }
      }
    },
    onEnter: [
      {
        characterId: 'rohan',
        addGlobalFlags: ['combo_reliability_builder_achieved', 'rohan_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'rohan_career_devops_continue',
        text: "Making things reliable. That's harder than making them work.",
        nextNodeId: 'rohan_hub_return',
        pattern: 'analytical'
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'tech']
  },

  {
    nodeId: 'rohan_career_reflection_documentation',
    speaker: 'Rohan',
    content: [
      {
        text: "You listen. Really listen. And when you speak, you translate complex things into something I can actually hear.\n\nTechnical writers do that. The good ones, anyway. They're the bridge between engineers who speak in abstractions and humans who need to actually use the thing.\n\nDocumentation sounds boring until you're stuck at 2am and some anonymous writer's clear explanation saves your project. That person? They're a hero who never gets thanked.",
        emotion: 'warm',
        variation_id: 'career_docs_v1'
      }
    ],
    requiredState: {
      patterns: {
        helping: { min: 5 },
        analytical: { min: 4 }
      }
    },
    onEnter: [
      {
        characterId: 'rohan',
        addGlobalFlags: ['combo_knowledge_translator_achieved', 'rohan_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'rohan_career_docs_continue',
        text: "Helping people understand. That's its own kind of engineering.",
        nextNodeId: 'rohan_hub_return',
        pattern: 'helping'
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'tech']
  },

  // ============= DAVID'S MEMORY =============
  {
    nodeId: 'rohan_david_memory',
    speaker: 'Rohan',
    content: [
      {
        text: "David gave me this before... before the end. Twenty years of notes. Design decisions. Why he chose certain patterns over others.\n\nLook at this comment: \"Future Rohan. If you're reading this, the answer is in the test cases. I trust you to figure out which ones.\"\n\nHe was teaching me even after he couldn't speak anymore.",
        emotion: 'tender_grief',
        variation_id: 'david_memory_v1'
      }
    ],
    requiredState: {
      trust: { min: 5 }
    },
    choices: [
      {
        choiceId: 'david_memory_continue',
        text: "He's still teaching through you. Every student you help.",
        nextNodeId: 'rohan_david_teaching_legacy',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'rohan',
          trustChange: 1
        }
      },
      {
        choiceId: 'david_memory_question',
        text: "What was the hardest lesson he taught you?",
        nextNodeId: 'rohan_david_hardest_lesson',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['rohan_arc', 'david_memory', 'emotional_depth']
  },

  {
    nodeId: 'rohan_david_teaching_legacy',
    speaker: 'Rohan',
    content: [
      {
        text: "That's exactly it. He's not gone. Not really.\n\nEvery time I trace a bug back to first principles. Every time I help someone understand instead of just copy-paste. Every time I choose truth over convenience.\n\nThat's David. Still here. Still teaching.\n\nI guess that's what legacy really means. Not what you built. What you planted in other people.",
        emotion: 'peaceful_resolve',
        variation_id: 'legacy_realized_v1'
      }
    ],
    choices: [
      {
        choiceId: 'legacy_to_intro',
        text: "(Continue)",
        nextNodeId: 'rohan_hub_return',
        pattern: 'patience'
      }
    ],
    tags: ['rohan_arc', 'david_memory']
  },

  {
    nodeId: 'rohan_david_hardest_lesson',
    speaker: 'Rohan',
    content: [
      {
        text: "Failure.\n\nNot how to avoid it. How to sit with it. How to let a broken system teach you instead of just fixing it and moving on.\n\nDavid would fail on purpose sometimes. Leave bugs in my code reviews. Wait to see if I'd find them myself.\n\n\"The goal isn't correct code,\" he'd say. \"It's correct thinking. The code follows.\"\n\nHardest lesson. Most important one.",
        emotion: 'reflective',
        variation_id: 'hardest_lesson_v1'
      }
    ],
    choices: [
      {
        choiceId: 'hardest_lesson_continue',
        text: "Correct thinking over correct code. That's what AI can't do.",
        nextNodeId: 'rohan_ai_philosophy',
        pattern: 'analytical',
        consequence: {
          characterId: 'rohan',
          trustChange: 1
        }
      }
    ],
    tags: ['rohan_arc', 'david_memory', 'teaching']
  },

  // ============= AI PHILOSOPHY =============
  {
    nodeId: 'rohan_ai_philosophy',
    speaker: 'Rohan',
    content: [
      {
        text: "Exactly. The AI produces correct code. Sometimes. But it doesn't know why it's correct.\n\nIt's like... imagine a calculator that always gives you the right answer but can't explain the math. You can use it. But can you trust it? Can you fix it when it breaks?\n\nThese machines are getting smarter. But \"smart\" isn't the same as \"wise.\" Wisdom requires understanding consequences. Understanding people.\n\nThat's what we're losing. The wisdom underneath the intelligence.",
        emotion: 'philosophical',
        variation_id: 'ai_philosophy_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ai_philosophy_hope',
        text: "But you're building people who have both. Intelligence and wisdom.",
        nextNodeId: 'rohan_hub_return',
        pattern: 'helping',
        skills: ['encouragement'],
        consequence: {
          characterId: 'rohan',
          trustChange: 1
        }
      },
      {
        choiceId: 'ai_philosophy_question',
        text: "Do you think AI could ever develop wisdom?",
        nextNodeId: 'rohan_ai_question_deep',
        pattern: 'exploring',
        skills: ['criticalThinking']
      }
    ],
    tags: ['rohan_arc', 'ai_philosophy', 'deep_tech']
  },

  {
    nodeId: 'rohan_ai_question_deep',
    speaker: 'Rohan',
    content: [
      {
        text: "I don't know. Honestly.\n\nWisdom comes from suffering. From loss. From making choices that cost you something and having to live with them.\n\nCan a machine suffer? Can it really lose something it values? Can it regret?\n\nMaybe someday. But I'm not betting humanity's future on \"maybe.\" I'm betting on what I know works: humans teaching humans. The chain unbroken.",
        emotion: 'uncertain_resolve',
        variation_id: 'ai_deep_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ai_deep_continue',
        text: "The chain unbroken. David to you. You to your students.",
        nextNodeId: 'rohan_hub_return',
        pattern: 'patience',
        consequence: {
          characterId: 'rohan',
          trustChange: 1
        }
      }
    ],
    tags: ['rohan_arc', 'ai_philosophy', 'deep_tech']
  },

  // ============= ACADEMY CHALLENGES =============
  {
    nodeId: 'rohan_academy_challenge',
    speaker: 'Rohan',
    content: [
      {
        text: "You want to know the hardest part? It's not the funding. It's not finding teachers.\n\nIt's convincing students they need this.\n\nEveryone wants the shortcut. \"Why learn assembly when I can prompt?\" \"Why understand databases when the ORM handles it?\"\n\nThey don't see the trap. The dependency. Until the abstraction breaks and they're helpless.\n\nI'm asking people to work harder for knowledge that seems useless. Until suddenly it's the only thing that matters.",
        emotion: 'frustrated_hope',
        variation_id: 'academy_challenge_v1'
      }
    ],
    requiredState: {
      trust: { min: 4 }
    },
    choices: [
      {
        choiceId: 'academy_challenge_story',
        text: "Show them what happens when the abstraction breaks. Stories change minds.",
        nextNodeId: 'rohan_academy_story_approach',
        pattern: 'helping',
        skills: ['communication', 'leadership']
      },
      {
        choiceId: 'academy_challenge_proof',
        text: "Let your first student be the proof. Her success is your argument.",
        nextNodeId: 'rohan_hub_return',
        pattern: 'patience',
        skills: ['strategicThinking']
      }
    ],
    tags: ['rohan_arc', 'academy', 'challenges']
  },

  {
    nodeId: 'rohan_academy_story_approach',
    speaker: 'Rohan',
    content: [
      {
        text: "Stories. Yeah.\n\nDavid used to do that. Every lecture started with a disaster. A real one. Names changed, but the lesson burned into your memory.\n\n\"Let me tell you about the time a single misplaced semicolon cost a rocket.\"\n\nYou couldn't look away. And suddenly, the tedious syntax rules felt like life and death.\n\nMaybe I need to collect those stories. Build a curriculum around catastrophes prevented by understanding.\n\nYou're good at this. Helping people see what's already there.",
        emotion: 'energized',
        variation_id: 'story_approach_v1'
      }
    ],
    onEnter: [
      {
        characterId: 'rohan',
        addKnowledgeFlags: ['rohan_story_insight']
      }
    ],
    choices: [
      {
        choiceId: 'story_approach_continue',
        text: "Stories are how humans have always passed down wisdom. You're just continuing the tradition.",
        nextNodeId: 'rohan_hub_return',
        pattern: 'exploring',
        consequence: {
          characterId: 'rohan',
          trustChange: 1
        }
      }
    ],
    tags: ['rohan_arc', 'academy', 'insight']
  },

  {
    nodeId: 'rohan_platform_reward',
    speaker: 'Rohan Patel',
    content: [{
      text: "You found it. The inward track. I knew the power draw wasn't a phantom.\n\nIt's not just a platform, is it? It's a recursion loop. The station examining itself. Dangerous engineering.",
      emotion: 'intense',
      variation_id: 'puzzle_platform_v1'
    }],
    choices: [{ choiceId: 'platform_ack', text: "Dangerous but necessary.", nextNodeId: 'rohan_hub_return' }],
    tags: ['puzzle_reward', 'legendary_info']
  },
  // ═══════════════════════════════════════════════════════════════
  // MYSTERY BREADCRUMBS
  // ═══════════════════════════════════════════════════════════════
  {
    nodeId: 'rohan_mystery_hint_1',
    speaker: 'Rohan',
    requiredState: {
      trust: { min: 5 }
    },
    content: [
      {
        text: "The code for this place... it's not compiled. It's interpreted. Live.\n\nEvery time you make a choice, the station recompiles around you. That's why the layout changes.\n\nWe aren't users. We're runtime variables.",
        emotion: 'mysterious',
        variation_id: 'mystery_hint_1_v1'
      }
    ],
    choices: [
      {
        choiceId: 'rohan_mystery_ask',
        text: "Runtime variables?",
        nextNodeId: 'rohan_mystery_response_1',
        pattern: 'analytical'
      },
      {
        choiceId: 'rohan_mystery_accept',
        text: "Then let's be good variables.",
        nextNodeId: 'rohan_hub_return',
        pattern: 'helping'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },
  {
    nodeId: 'rohan_mystery_response_1',
    speaker: 'Rohan',
    content: [
      {
        text: "If we leave, the program crashes. Or maybe it terminates successfully. That's the terrifying part.\n\nIs 'departure' a bug or a feature? I'm digging into the kernel to find out.",
        emotion: 'determined',
        variation_id: 'mystery_response_1_v1'
      }
    ],
    onEnter: [
      {
        characterId: 'rohan',
        addKnowledgeFlags: ['rohan_mystery_noticed']
      }
    ],
    choices: [
      {
        choiceId: 'rohan_mystery_return',
        text: "Keep digging.",
        nextNodeId: 'rohan_hub_return',
        pattern: 'building'
      }
    ]
  },
  // ============= SIMULATION 2: LEGACY CODE ARCHAEOLOGY =============
  {
    nodeId: 'rohan_sim2_legacy_intro',
    speaker: 'Rohan',
    content: [{
      text: "Next level. Real archaeology.\n\nI inherited a codebase from 2012. No documentation. Original dev left the company. The system processes $2M in transactions daily.\n\nAnd there's a function. 900 lines. Called `processPayment()`.\n\nIt works. Mostly. But sometimes—maybe 1 in 10,000 transactions—it doubles the charge. We can't figure out why.\n\nI need you to read it. Find the ghost. No AI assist. Just you, the code, and first principles.\n\nReady?",
      emotion: 'serious_teaching',
      variation_id: 'sim2_intro_v1'
    }],
    simulation: {
      type: 'dashboard_triage',
      title: 'Legacy Code Archaeology',
      taskDescription: 'A 900-line payment function occasionally doubles charges. Find the bug without documentation or AI assistance.',
      initialContext: {
        label: 'processPayment() - Lines 402-1302',
        content: `function processPayment(user, amount, cart) {
  // Validation layer (lines 402-520)
  if (!user || !amount) return error('Invalid input')

  // Transaction setup (lines 521-680)
  const txnId = generateId()
  const timestamp = Date.now()

  // Payment gateway call (lines 681-780)
  const result = await gateway.charge(user.card, amount)

  // CRITICAL SECTION (lines 781-850)
  // Legacy retry logic from 2012
  // Original comment: "Handle gateway timeouts"
  if (!result.success) {
    log('Gateway timeout. Retrying...')
    const retry = await gateway.charge(user.card, amount)
    if (retry.success) result = retry
  }

  // Database write (lines 851-900)
  db.insert({ userId: user.id, amount, txnId, timestamp })

  return result
}

BUG REPORT: 1 in 10,000 transactions show double charges.
HINT: The gateway sometimes responds AFTER the timeout window.`,
        displayStyle: 'code'
      },
      successFeedback: 'BUG IDENTIFIED: Race condition in retry logic detected.'
    },
    requiredState: {
      hasKnowledgeFlags: ['rohan_simulation_complete', 'rohan_partial_trust']
    },
    choices: [
      {
        choiceId: 'sim2_race_condition',
        text: "The retry logic doesn't check if the first charge already succeeded.",
        nextNodeId: 'rohan_sim2_success',
        pattern: 'analytical',
        skills: ['criticalThinking', 'systemsThinking', 'debuggingMastery']
      },
      {
        choiceId: 'sim2_gateway_bug',
        text: "The payment gateway is broken. Not our code's fault.",
        nextNodeId: 'rohan_sim2_partial',
        pattern: 'exploring',
        skills: ['technicalLiteracy']
      },
      {
        choiceId: 'sim2_add_logging',
        text: "Add more logging to capture the exact failure pattern.",
        nextNodeId: 'rohan_sim2_partial',
        pattern: 'patience',
        skills: ['debugging']
      }
    ],
    tags: ['simulation', 'rohan_arc', 'phase2']
  },

  {
    nodeId: 'rohan_sim2_success',
    speaker: 'Rohan',
    content: [{
      text: "There it is. The ghost.\n\nGateway responds at 3.1 seconds. Timeout is set to 3.0 seconds. Code assumes timeout = failure. Triggers retry.\n\nBut the first charge already went through. It just took 100ms too long to respond.\n\nSo the system charges twice. Once from the 'failed' request. Once from the retry.\n\nHere's the fix:\n\n```\nif (!result.success && !result.timeout) {\n  // Only retry if the gateway explicitly failed\n  // NOT if it timed out (might have succeeded silently)\n}\n```\n\nOne line. Saves $200K/year in refunds.\n\nYou found it by reading code. Not by asking an AI. Not by guessing. By understanding how the system actually works.\n\nThat's the skill. That's what separates engineers from prompters.",
      emotion: 'proud_fierce',
      interaction: 'nod',
      variation_id: 'sim2_success_v1',
      richEffectContext: 'success'
    }],
    onEnter: [{
      characterId: 'rohan',
      addKnowledgeFlags: ['rohan_sim2_complete']
    }],
    choices: [{
      choiceId: 'sim2_complete',
      text: "Engineers understand systems. Prompters trust black boxes.",
      nextNodeId: 'rohan_hub_return',
      pattern: 'analytical',
      skills: ['mastery']
    }],
    tags: ['simulation', 'rohan_arc', 'phase2', 'success']
  },

  {
    nodeId: 'rohan_sim2_partial',
    speaker: 'Rohan',
    content: [{
      text: "Logging helps. Blaming the gateway is tempting. But you're not looking deep enough.\n\nThe bug is in our code. In the assumptions we made.\n\n'If the gateway times out, assume it failed. Retry.'\n\nBut what if the gateway succeeds AND times out? What if it charges the card at 3.1 seconds, but our timeout is 3.0 seconds?\n\nWe never hear the success response. We think it failed. We retry. Double charge.\n\nThe fix isn't more logging. It's understanding the race condition:\n\n```\nif (!result.success && !result.timeout) {\n  // Only retry on explicit failure, not on timeout\n}\n```\n\nOne line. $200K/year in refunds saved.\n\nYou have to read the code like it's lying to you. Question every assumption. That's debugging at the machine level.",
      emotion: 'patient_teaching',
      variation_id: 'sim2_partial_v1'
    }],
    onEnter: [{
      characterId: 'rohan',
      addKnowledgeFlags: ['rohan_sim2_partial']
    }],
    choices: [{
      choiceId: 'sim2_partial_complete',
      text: "Question every assumption. Got it.",
      nextNodeId: 'rohan_hub_return',
      pattern: 'analytical',
      skills: ['criticalThinking']
    }],
    tags: ['simulation', 'rohan_arc', 'phase2', 'partial']
  },

  // ============= SIMULATION 3: PRODUCTION DEBUGGING CRISIS =============
  {
    nodeId: 'rohan_sim3_prod_intro',
    speaker: 'Rohan',
    content: [{
      text: "Final test. Production crisis. Real one.\n\n3:47 AM. PagerDuty alert. API response time: 847ms. SLA threshold: 200ms.\n\nYou're on call. The system is a microservices mesh: API gateway → Auth service → User service → Database.\n\nEach service says: 'Not me. My metrics look fine.'\n\nBut users are timing out. Revenue is dropping. CEO is awake.\n\nYou have 15 minutes before the incident escalates to the CTO.\n\nWhere do you start?",
      emotion: 'urgent_focused',
      variation_id: 'sim3_intro_v1'
    }],
    simulation: {
      type: 'dashboard_triage',
      title: 'Production Debugging: The Distributed Mystery',
      taskDescription: 'API response time degraded from 200ms to 847ms. Four services, all claiming innocence. Find the bottleneck.',
      initialContext: {
        label: 'System Status Dashboard',
        content: `INCIDENT: API Latency Spike
ALERT TIME: 03:47 AM
CURRENT LATENCY: 847ms (SLA: 200ms)

SERVICE METRICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
API Gateway:     45ms avg response  ✓
Auth Service:    23ms avg response  ✓
User Service:    38ms avg response  ✓
Database:        Query time 12ms    ✓

NETWORK: All green
CPU: 42% avg
MEMORY: 68% avg
DISK I/O: Normal

WHERE IS THE 847ms COMING FROM?`,
        displayStyle: 'code'
      },
      successFeedback: 'INVESTIGATION STARTED: Analyzing service call patterns...'
    },
    requiredState: {
      hasKnowledgeFlags: ['rohan_sim2_complete', 'rohan_sim2_partial']
    },
    choices: [
      {
        choiceId: 'sim3_distributed_trace',
        text: "Check distributed tracing. Look at the FULL request path, not individual services.",
        nextNodeId: 'rohan_sim3_success',
        pattern: 'analytical',
        skills: ['systemsThinking', 'distributedSystems', 'observability']
      },
      {
        choiceId: 'sim3_restart_services',
        text: "Restart all services. Clear whatever's stuck.",
        nextNodeId: 'rohan_sim3_fail',
        pattern: 'building',
        skills: ['incidentManagement']
      },
      {
        choiceId: 'sim3_add_caching',
        text: "Add caching layer. Buy time while investigating.",
        nextNodeId: 'rohan_sim3_partial',
        pattern: 'patience',
        skills: ['pragmatism']
      }
    ],
    tags: ['simulation', 'rohan_arc', 'phase3', 'mastery']
  },

  {
    nodeId: 'rohan_sim3_success',
    speaker: 'Rohan',
    content: [{
      text: "You pull the distributed trace. And there it is.\n\nThe ghost in the wires:\n\n```\nAPI Gateway → Auth (23ms) → User (38ms) → Database (12ms)\nTotal service time: 73ms\n\nBUT:\n\nAPI Gateway → Auth: 312ms network latency\nAuth → User: 287ms network latency  \nUser → Database: 175ms network latency\n\nTotal: 847ms\n```\n\nThe services are fine. The network between them is drowning.\n\nYou check the network topology. Someone deployed a new microservice at 2:34 AM. It's broadcasting health checks every 100ms to ALL services.\n\nNetwork saturation. Death by a thousand pings.\n\nYou disable the health check broadcast. Latency drops to 94ms.\n\nIncident resolved: 07 minutes.\n\nHere's the lesson: Individual metrics lie. Systems thinking reveals truth.\n\nEach service looked healthy because they were measuring themselves in isolation. But the system—the space BETWEEN the services—was choking.\n\nMost engineers never learn to see the space. You just did.\n\nWelcome to the deep end.",
      emotion: 'triumphant_wise',
      interaction: 'bloom',
      variation_id: 'sim3_success_v1',
      richEffectContext: 'success'
    }],
    onEnter: [{
      characterId: 'rohan',
      trustChange: 3,
      addKnowledgeFlags: ['rohan_sim3_complete', 'rohan_all_sims_complete']
    }],
    choices: [{
      choiceId: 'sim3_complete',
      text: "See the space between the services. That's where truth lives.",
      nextNodeId: 'rohan_hub_return',
      pattern: 'analytical',
      skills: ['systemsThinking', 'mastery']
    }],
    tags: ['simulation', 'rohan_arc', 'phase3', 'success']
  },

  {
    nodeId: 'rohan_sim3_partial',
    speaker: 'Rohan',
    content: [{
      text: "Caching helps. Symptom management. Latency drops to 650ms. Better, not fixed.\n\nBut you haven't found the root cause.\n\nHere's what you missed: the individual services look healthy because they're measuring themselves in isolation.\n\nBut distributed systems fail in the SPACES BETWEEN services. Network latency. Connection pools. Service mesh overhead.\n\nYou pull the distributed trace:\n\n```\nService execution: 73ms\nNetwork latency: 774ms\n```\n\nThe ghost lives in the wires. Someone deployed a chatty microservice that's saturating the network.\n\nCaching bought you time. But systems thinking would have found the root cause in 7 minutes instead of 47.\n\nLesson: Treat the system as one organism, not isolated parts.",
      emotion: 'patient_teaching',
      variation_id: 'sim3_partial_v1'
    }],
    onEnter: [{
      characterId: 'rohan',
      addKnowledgeFlags: ['rohan_sim3_partial']
    }],
    choices: [{
      choiceId: 'sim3_partial_complete',
      text: "Systems thinking. See the whole organism.",
      nextNodeId: 'rohan_hub_return',
      pattern: 'analytical',
      skills: ['systemsThinking']
    }],
    tags: ['simulation', 'rohan_arc', 'phase3', 'partial']
  },

  {
    nodeId: 'rohan_sim3_fail',
    speaker: 'Rohan',
    content: [{
      text: "You restart all services. They come back up.\n\nLatency: Still 847ms.\n\nNow you've lost your investigation time. Services are fresh. Logs are gone. The CEO is calling.\n\n'Have we identified the root cause?'\n\nNo. Because you treated the symptom, not the disease.\n\nHere's what you missed: the services were never the problem. The NETWORK between them was saturated. A chatty microservice broadcasting health checks.\n\nRestarting services cleared the symptom for 30 seconds. Then the network saturation returned.\n\nYou should have checked distributed tracing. Seen the network latency. Found the chatty service. Disabled it.\n\n7 minute fix. Instead: 2 hour outage, SLA breach, and a very uncomfortable postmortem meeting.\n\nLesson: Rebooting is not debugging. Understanding is.",
      emotion: 'firm_disappointed',
      variation_id: 'sim3_fail_v1',
      richEffectContext: 'error'
    }],
    choices: [{
      choiceId: 'sim3_retry',
      text: "I see it now. Check distributed tracing first.",
      nextNodeId: 'rohan_sim3_success',
      pattern: 'analytical',
      skills: ['learningAgility']
    }],
    tags: ['simulation', 'rohan_arc', 'phase3', 'failure']
  },

  {
    nodeId: 'rohan_hub_return',
    speaker: 'Rohan',
    content: [{
      text: "I've got a debugger attached to the lighting system. Let's see what happens if I pause execution.",
      emotion: 'thoughtful',
      variation_id: 'hub_return_v1'
    }],
    choices: [],
    tags: ['terminal']
  },

  // ============= TRUST RECOVERY =============
  {
    nodeId: 'rohan_trust_recovery',
    speaker: 'Rohan',
    requiredState: {
      trust: { max: 3 }
    },
    content: [{
      text: "You're here.\n\nI thought you'd gone. Vanished into the buffer like a dropped frame.\n\n[He's not looking at you. Staring at code that isn't there.]\n\nI don't know how to... I'm better with machines than this.",
      emotion: 'vulnerable',
      variation_id: 'trust_recovery_v1',
      richEffectContext: 'warning',
      voiceVariations: {
        patience: "You're here.\n\nYou took your time. Let the recursion unwind.\n\nI thought you'd gone. Vanished into the buffer like a dropped frame.\n\n[He's not looking at you. Staring at code that isn't there.]\n\nI don't know how to... I'm better with machines than this.",
        helping: "You're here.\n\nEven after I shut down. Went into maintenance mode.\n\nI thought you'd gone. Vanished into the buffer like a dropped frame.\n\n[He's not looking at you. Staring at code that isn't there.]\n\nI don't know how to... I'm better with machines than this.",
        analytical: "You're here.\n\nYou ran the diagnostics. Traced the error back to source.\n\nI thought you'd gone. Vanished into the buffer like a dropped frame.\n\n[He's not looking at you. Staring at code that isn't there.]\n\nI don't know how to... I'm better with machines than this.",
        building: "You're here.\n\nRebuilding from corrupted state. Brave.\n\nI thought you'd gone. Vanished into the buffer like a dropped frame.\n\n[He's not looking at you. Staring at code that isn't there.]\n\nI don't know how to... I'm better with machines than this.",
        exploring: "You're here.\n\nStill curious. Even after I became a ghost.\n\nI thought you'd gone. Vanished into the buffer like a dropped frame.\n\n[He's not looking at you. Staring at code that isn't there.]\n\nI don't know how to... I'm better with machines than this."
      }
    }],
    choices: [
      {
        choiceId: 'rohan_recovery_understand',
        text: "You didn't lose me. I'm right here.",
        nextNodeId: 'rohan_trust_restored',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'rohan',
          trustChange: 2,
          addKnowledgeFlags: ['rohan_trust_repaired']
        },
        voiceVariations: {
          patience: "I didn't leave. I was just waiting. You didn't lose me.",
          helping: "You didn't lose me. I'm right here. I'm not going anywhere.",
          analytical: "The connection persisted. I didn't drop. You didn't lose me.",
          building: "Still here. Foundation intact. You didn't lose me.",
          exploring: "I'm still exploring. Still here. You didn't lose me."
        }
      },
      {
        choiceId: 'rohan_recovery_patient',
        text: "You don't have to be good at this. Just honest.",
        nextNodeId: 'rohan_trust_restored',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'rohan',
          trustChange: 2,
          addKnowledgeFlags: ['rohan_trust_repaired']
        },
        voiceVariations: {
          patience: "Take your time. You don't have to be good at this. Just honest.",
          helping: "You don't have to be perfect. You don't have to be good at this. Just honest.",
          analytical: "Optimizing for honesty, not performance. You don't have to be good at this.",
          building: "Build it slowly. You don't have to be good at this. Just honest.",
          exploring: "No wrong answers here. You don't have to be good at this. Just honest."
        }
      }
    ],
    tags: ['trust_recovery', 'rohan_arc']
  },

  {
    nodeId: 'rohan_trust_restored',
    speaker: 'Rohan',
    content: [{
      text: "[He finally looks at you. The light catches his glasses.]\n\nOkay.\n\nOkay, I... I can work with that.\n\n[A small exhale. Like closing a file after saving.]\n\nThe machine doesn't know how to apologize. But I do.\n\nI'm sorry.",
      emotion: 'relieved',
      variation_id: 'trust_restored_v1',
      voiceVariations: {
        patience: "[He finally looks at you. The light catches his glasses.]\n\nOkay.\n\nYou waited. That matters more than code.\n\nOkay, I... I can work with that.\n\n[A small exhale. Like closing a file after saving.]\n\nThe machine doesn't know how to apologize. But I do. I'm sorry.",
        helping: "[He finally looks at you. The light catches his glasses.]\n\nOkay.\n\nYou came back. That's... that's human in a way machines can't be.\n\nOkay, I... I can work with that.\n\n[A small exhale. Like closing a file after saving.]\n\nThe machine doesn't know how to apologize. But I do. I'm sorry.",
        analytical: "[He finally looks at you. The light catches his glasses.]\n\nOkay.\n\nYou debugged the relationship. Found the breakpoint.\n\nOkay, I... I can work with that.\n\n[A small exhale. Like closing a file after saving.]\n\nThe machine doesn't know how to apologize. But I do. I'm sorry.",
        building: "[He finally looks at you. The light catches his glasses.]\n\nOkay.\n\nYou're rebuilding with corrupted data. That takes courage.\n\nOkay, I... I can work with that.\n\n[A small exhale. Like closing a file after saving.]\n\nThe machine doesn't know how to apologize. But I do. I'm sorry.",
        exploring: "[He finally looks at you. The light catches his glasses.]\n\nOkay.\n\nYou're still exploring, even in the dark.\n\nOkay, I... I can work with that.\n\n[A small exhale. Like closing a file after saving.]\n\nThe machine doesn't know how to apologize. But I do. I'm sorry."
      }
    }],
    choices: [{
      choiceId: 'rohan_recovery_complete',
      text: "(Continue)",
      nextNodeId: 'rohan_hub_return',
      pattern: 'patience'
    }],
    tags: ['trust_recovery', 'rohan_arc'],
    onEnter: [{
      characterId: 'rohan',
      addKnowledgeFlags: ['rohan_trust_recovery_completed']
    }]
  },

  // Platform Seven arrival - the mystical jump destination
  {
    nodeId: 'platform_seven_arrival',
    speaker: 'Rohan',
    content: [
      {
        text: "The light here is... wrong. It's slower. I can see individual photons drifting like snow.\n\nThis is Platform Seven. The station's buffer. Where timelines too heavy to process get stored.",
        emotion: 'awe',
        variation_id: 'platform_seven_arrival_v1',
        interaction: 'bloom'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['platform_seven_reached', 'deep_mystery_begun']
      }
    ],
    choices: [
      {
        choiceId: 'platform_explore',
        text: "What do you mean, 'too heavy'?",
        nextNodeId: 'rohan_platform_7_truth',
        pattern: 'exploring',
        skills: ['curiosity', 'criticalThinking']
      },
      {
        choiceId: 'platform_return',
        text: "We should go back.",
        nextNodeId: 'rohan_hub_return',
        pattern: 'patience',
        skills: ['riskManagement']
      }
    ],
    tags: ['platform_seven', 'mystery', 'arrival']
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
