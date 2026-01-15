/**
 * Grace's Dialogue Graph
 * The Companion - Platform 5 (Elder Care / Home Health)
 *
 * CHARACTER: The Presence
 * Core Conflict: Invisible labor vs. Essential humanity - proving care work has dignity
 * Arc: From "just a caregiver" to recognizing the profound skill of presence
 * Mechanic: "The Moment" - A quiet scene where small choices reveal big truths
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const graceDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'grace_introduction',
    speaker: 'Grace',
    content: [
      {
        text: "Sorry. Just got off shift. Twelve hours. My feet are having opinions.\n\nYou look a little lost yourself.",
        emotion: 'tired_warm',
        variation_id: 'grace_intro_v1',
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "You have that look. The one that says you actually see people.\n\nCome sit. My feet need the break anyway.", altEmotion: 'knowing' },
          { pattern: 'patience', minLevel: 4, altText: "You're not in a hurry. Good. Neither am I.\n\nSit if you want.", altEmotion: 'calm' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'grace_intro_concern',
        text: "Twelve hours? What kind of work?",
        voiceVariations: {
          analytical: "Twelve hours. That's a long shift. What kind of work demands that?",
          helping: "That sounds exhausting. What kind of work keeps you that long?",
          building: "Twelve hours building something. What kind of work?",
          exploring: "I'm curious. What kind of work takes twelve hours?",
          patience: "Twelve hours. You must love what you do. What is it?"
        },
        nextNodeId: 'grace_handshake_vitals',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      },
      {
        choiceId: 'grace_intro_honest',
        text: "I am a little lost. That's why I'm here.",
        voiceVariations: {
          analytical: "I'm trying to figure out my next steps. Still mapping the terrain.",
          helping: "I am a little lost. But sometimes that's how you find what matters.",
          building: "I'm between projects. Figuring out what to build next.",
          exploring: "Lost is just another word for exploring. That's why I'm here.",
          patience: "I am a little lost. Taking my time to find the right path."
        },
        nextNodeId: 'grace_understands_lost',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      },
      {
        choiceId: 'grace_intro_sit',
        text: "[Sit down beside her quietly.]",
        nextNodeId: 'grace_quiet_sit',
        pattern: 'patience',
        skills: ['adaptability'],
        consequence: {
          characterId: 'grace',
          trustChange: 2
        }
      },
      {
        choiceId: 'grace_intro_empathy_unlock',
        text: "[Empathy Sense] You're not just tired. You're carrying something. A patient, maybe. Someone who didn't make it.",
        nextNodeId: 'grace_carrying_weight',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'observation'],
        visibleCondition: {
          patterns: { helping: { min: 40 } }
        },
        consequence: {
          characterId: 'grace',
          trustChange: 2
        }
      },
      {
        choiceId: 'grace_intro_patience_unlock',
        text: "[Deep Listening] The way you're not looking at your phone. You're avoiding something on it. Bad news?",
        nextNodeId: 'grace_bad_news',
        pattern: 'patience',
        skills: ['observation', 'emotionalIntelligence'],
        visibleCondition: {
          patterns: { patience: { min: 50 } }
        },
        consequence: {
          characterId: 'grace',
          trustChange: 2
        }
      }
    ],
    onEnter: [
      {
        characterId: 'grace',
        setRelationshipStatus: 'stranger'
      }
    ],
    tags: ['introduction', 'grace_arc']
  },

  // ============= HANDSHAKE NODE: MEDICAL TRIAGE =============
  {
    nodeId: 'grace_handshake_vitals',
    speaker: 'Grace',
    content: [{
      text: "Triage. It's not about who's loudest. It's about who's fading fastest.\n\nTake a look at the board. Five new admits. One bed. Who gets it?",
      emotion: 'testing',
      variation_id: 'grace_triage_intro',
      interaction: 'ripple'
    }],
    simulation: {
      type: 'dashboard_triage',
      mode: 'inline',
      inlineHeight: 'h-80',
      title: 'ER Triage Protocol',
      taskDescription: 'Prioritize 3 critical patients from the incoming queue.',
      initialContext: {
        label: 'Waiting Room Status',
        content: 'Capacity: 110%. Staffing: 60%.',
        items: [
          { id: 'p1', label: 'Chest Pain (45M)', value: 'HR 110', priority: 'critical', trend: 'up' },
          { id: 'p2', label: 'Migraine (22F)', value: 'Pain 8/10', priority: 'medium', trend: 'stable' },
          { id: 'p3', label: 'Febrile Infant', value: 'Temp 104', priority: 'critical', trend: 'up' },
          { id: 'p4', label: 'Ankle Sprain', value: 'Swollen', priority: 'low', trend: 'stable' },
          { id: 'p5', label: 'Difficulty Breathing', value: 'O2 88%', priority: 'critical', trend: 'down' }
        ]
      },
      successFeedback: 'TRIAGE COMPLETE. CRITICAL CASES ASSIGNED.'
    },
    choices: [
      {
        choiceId: 'triage_complete',
        text: "Critical cases routed. The rest can wait.",
        nextNodeId: 'grace_the_work',
        pattern: 'helping',
        skills: ['triage'],
        voiceVariations: {
          analytical: "Prioritization complete based on vitals stability.",
          helping: "The sickest are safe. We'll get to the others.",
          building: "Queue optimized. Flow restored."
        }
      }
    ]
  },

  // ============= PATTERN-UNLOCK NODES =============
  {
    nodeId: 'grace_carrying_weight',
    speaker: 'Grace',
    content: [
      {
        text: "...How did you know?\n\nMrs. Chen. Room 412. She was doing better. We thought. We really thought.\n\nI've been doing this fifteen years. You'd think it gets easier. It doesn't. It just gets different.\n\nNo one asks. They see the scrubs and assume I'm fine.",
        emotion: 'raw',
        interaction: 'small',
        variation_id: 'grace_carrying_weight_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_carrying_respond',
        text: "You're allowed to not be fine.",
        nextNodeId: 'grace_the_work',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        archetype: 'ACKNOWLEDGE_EMOTION',
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'pattern_unlock']
  },

  {
    nodeId: 'grace_bad_news',
    speaker: 'Grace',
    content: [
      {
        text: "...Yeah.\n\nMy daughter. She got the job. Out of state. Starts next month.\n\nI should be happy. I am happy. She worked so hard for this.\n\nI just... wasn't ready for the house to be quiet so soon.",
        emotion: 'bittersweet',
        interaction: 'small',
        variation_id: 'grace_bad_news_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_daughter_respond',
        text: "Good news and grief can live in the same moment.",
        nextNodeId: 'grace_the_work',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'wisdom'],
        archetype: 'SHARE_PERSPECTIVE',
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'pattern_unlock']
  },

  {
    nodeId: 'grace_quiet_sit',
    speaker: 'Grace',
    content: [
      {
        text: "That's nice. Most people talk right away. Fill every silence.\n\nYou know how to just... be with someone. That's rare.",
        emotion: 'appreciative',
        interaction: 'small',
        variation_id: 'quiet_sit_v1',
        voiceVariations: {
          analytical: "That's nice. Most people process through talking. Analyze out loud. Fill the silence with data.\n\nYou observe first. Presence before analysis. That's rare.",
          helping: "That's nice. Most people rush to help. Try to fix immediately.\n\nYou know how to just... be with someone. Support without solving. That's rare.",
          building: "That's nice. Most people need to construct immediately. Build conversation. Fill every gap.\n\nYou let the space exist first. Foundation of silence. That's rare.",
          exploring: "That's nice. Most people explore through questions. Navigate with words.\n\nYou know how to discover through quiet. Map through presence. That's rare.",
          patience: "That's nice. Most people rush. Fill every silence immediately.\n\nYou gave it time. Let the moment breathe. That's the rarest gift."
        },
        patternReflection: [
          { pattern: 'patience', minLevel: 4, altText: "That's nice. Most people fill every silence. You just... waited.\n\nYou understand stillness. That's the hardest skill to teach.", altEmotion: 'recognized' },
          { pattern: 'helping', minLevel: 4, altText: "You know how to be with someone without needing anything from them.\n\nThat's what I do for a living. Recognize it when I see it.", altEmotion: 'kindred' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'grace_silence_learned',
        text: "Where'd you learn that? To value silence?",
        nextNodeId: 'grace_the_work',
        pattern: 'exploring',
        skills: ['curiosity'],
        archetype: 'ASK_FOR_DETAILS'
      },
      {
        choiceId: 'grace_silence_gift',
        text: "Sometimes silence is the gift.",
        nextNodeId: 'grace_the_work',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        archetype: 'SHARE_PERSPECTIVE',
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    onEnter: [
      {
        thoughtId: 'steady-hand'
      }
    ],
    tags: ['grace_arc', 'connection']
  },

  {
    nodeId: 'grace_understands_lost',
    speaker: 'Grace',
    content: [
      {
        text: "Lost is honest. Lost is where all the real figuring-out happens.\n\nI've been lost a few times. Figured I'd end up somewhere different than where I am now.\n\nTurns out \"different\" isn't always \"worse.\" Just... different.",
        emotion: 'reflective',
        variation_id: 'understands_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_where_ended',
        text: "Where did you end up?",
        nextNodeId: 'grace_the_work',
        pattern: 'exploring',
        skills: ['curiosity'],
        archetype: 'ASK_FOR_DETAILS'
      }
    ],
    tags: ['grace_arc']
  },

  // ============= THE WORK =============
  {
    nodeId: 'grace_the_work',
    speaker: 'Grace',
    content: [
      {
        text: "Home health aide. Seven years now.\n\nI go to people's houses. Mostly elderly. Help them with everything. Getting dressed. Eating. Bathing. Medications.\n\nThe stuff nobody wants to think about. The stuff that happens when bodies get old and minds get foggy.\n\nIt's not glamorous. But somebody's gotta do it.",
        emotion: 'matter_of_fact',
        variation_id: 'the_work_v1',
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "Home health aide. Seven years.\n\nI go to people's houses. Help them with everything. Getting dressed. Eating. The things that get hard when bodies fail.\n\nYou understand. You've got that helper energy. You know some work is about more than tasks.", altEmotion: 'knowing' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'grace_why_this',
        text: "How did you end up in this work?",
        voiceVariations: {
          analytical: "What led you to this path? I'm trying to understand the decision.",
          helping: "How did you end up caring for others this way?",
          building: "What drew you to building this kind of career?",
          exploring: "I'd love to hear your story. How did you find this work?",
          patience: "That's a journey. How did you find your way here?"
        },
        nextNodeId: 'grace_origin',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      },
      {
        choiceId: 'grace_hard_parts',
        text: "What's the hardest part?",
        voiceVariations: {
          analytical: "What challenges you most about this work? The variables you can't control?",
          helping: "What's the hardest part? The part that stays with you?",
          building: "Every meaningful work has hard parts. What's yours?",
          exploring: "I want to understand the full picture. What's hardest?",
          patience: "What takes the most from you? The part that requires the most patience?"
        },
        nextNodeId: 'grace_the_hard',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'grace_somebody',
        text: "'Somebody's gotta do it' sounds like it's more than that to you.",
        voiceVariations: {
          analytical: "You said 'somebody's gotta do it.' But the way you said it. There's more data there.",
          helping: "That phrase. 'Somebody's gotta do it.' It sounds like it carries weight for you.",
          building: "'Somebody's gotta do it' usually means you've built something meaningful from it.",
          exploring: "I heard something deeper when you said that. What's underneath?",
          patience: "There's a story behind 'somebody's gotta do it.' Take your time."
        },
        nextNodeId: 'grace_more_than',
        pattern: 'analytical',
        skills: ['observation'],
        consequence: {
          characterId: 'grace',
          trustChange: 2
        }
      }
    ],
    tags: ['grace_arc', 'work']
  },

  {
    nodeId: 'grace_more_than',
    speaker: 'Grace',
    content: [
      {
        text: "You caught that, huh.\n\nYeah. It's more than \"somebody's gotta.\"\n\nMy grandmother raised me. Strong woman. Worked thirty years at a laundry, retired, thought she'd have time to rest. Then the dementia started.\n\nAt the end... I was the only one who could calm her down. She didn't know my name anymore. But she knew my presence.\n\nThat's when I knew. This work isn't about tasks. It's about being the calm in someone's storm.",
        emotion: 'vulnerable',
        interaction: 'small',
        variation_id: 'more_than_v1',
        voiceVariations: {
          analytical: "You processed the subtext. Good.\n\nYeah. It's more than the work equation.\n\nMy grandmother raised me. At the end, she didn't know my name. But she recognized my pattern. My presence.\n\nThat's when I understood the variables. This work isn't about the tasks. It's about being the constant in someone's chaos.",
          helping: "You heard the weight in it. Thank you.\n\nYeah. It's more than duty.\n\nMy grandmother raised me. At the end, she didn't know my name. But she needed my presence. That specific comfort only I could give.\n\nThat's when I knew. This work isn't about helping with tasks. It's about being the calm they need.",
          building: "You caught the foundation under the words.\n\nYeah. It's more than the structure of the job.\n\nMy grandmother raised me. At the end, she didn't know my name. But she knew my presence was safe. Something she could lean on.\n\nThat's when I knew. This work isn't building services. It's constructing stability in someone's storm.",
          exploring: "You heard the story beneath the words.\n\nYeah. It's more than the surface path.\n\nMy grandmother raised me. At the end, she didn't know my name. But she knew my presence. A familiar territory in the confusion.\n\nThat's when I discovered it. This work isn't about tasks. It's about being the known place in someone's storm.",
          patience: "You waited to hear what I wasn't saying.\n\nYeah. It's more than the clock-in, clock-out.\n\nMy grandmother raised me. At the end, she didn't know my name. But she knew my presence. Recognized me over time, even when memory failed.\n\nThat's when I understood. This work isn't about the tasks. It's about being the patience in someone's storm."
        }
      }
    ],
    choices: [
      {
        choiceId: 'grace_grandmother_present',
        text: "She's still with you. I can hear it.",
        voiceVariations: {
          analytical: "The way you describe her. She's still part of how you think.",
          helping: "She's still with you. I can hear her in everything you do.",
          building: "You're still building on what she started. She's in the foundation.",
          exploring: "She's part of your story. I can hear her in your voice.",
          patience: "She's still with you. Some people stay with us like that."
        },
        nextNodeId: 'grace_grandmother_response',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 2
        }
      },
      {
        choiceId: 'grace_presence_skill',
        text: "Presence. That's a skill most people don't even know exists.",
        nextNodeId: 'grace_invisible_skill',
        pattern: 'analytical',
        skills: ['observation'],
        archetype: 'MAKE_OBSERVATION'
      }
    ],
    tags: ['grace_arc', 'backstory', 'emotional_core']
  },

  {
    nodeId: 'grace_grandmother_response',
    speaker: 'Grace',
    content: [
      {
        text: "Every day.\n\nEvery time I sit with someone who's scared and confused, I think: what if this was her? What would I want someone to do?\n\nThat's the job. Not the tasks. The remembering that every person used to be someone's whole world.\n\nMrs. Patterson? She was a jazz singer. Mr. Chen? Built bridges. They're not just bodies that need help. They're people with stories.",
        emotion: 'tender',
        interaction: 'nod',
        variation_id: 'grandmother_v1',
        voiceVariations: {
          analytical: "Every day.\n\nEvery time I observe someone scared and confused, I run the algorithm: what if this was her? What would optimize their experience?\n\nThat's the real function. Not the task list. The calculation that every person contains a lifetime of data.\n\nMrs. Patterson? Jazz singer. Mr. Chen? Bridge engineer. They're not cases. They're complete datasets with stories.",
          helping: "Every day.\n\nEvery time I'm with someone who's scared and confused, I think: what if someone helped her this way? What would I want them to feel?\n\nThat's the real work. Not checking boxes. The caring that every person deserves - remembering they're someone's whole world.\n\nMrs. Patterson? Jazz singer. Mr. Chen? Built bridges. They're not just bodies. They're people who mattered.",
          building: "Every day.\n\nEvery time I work with someone scared and confused, I think: what if someone built her care this way? What foundation would I want?\n\nThat's the real construction. Not the task structure. The framework that remembers every person built a whole life.\n\nMrs. Patterson? Jazz singer. Mr. Chen? Built bridges. They're not just clients. They're people who created.",
          exploring: "Every day.\n\nEvery time I discover someone scared and confused, I wonder: what if someone explored her world this way? What would I want them to find?\n\nThat's the real journey. Not the checklist. The curiosity that every person traveled through a lifetime of stories.\n\nMrs. Patterson? Jazz singer. Mr. Chen? Built bridges. They're not just bodies. They're paths worth knowing.",
          patience: "Every day.\n\nEvery time I sit with someone who's scared and confused, I think: what if someone gave her this time? What would I want them to feel?\n\nThat's the real gift. Not rushing through tasks. The patience that every person deserves - they lived a whole lifetime.\n\nMrs. Patterson? Jazz singer. Mr. Chen? Built bridges. They're not just bodies. They're stories that take time."
        }
      }
    ],
    choices: [
      {
        choiceId: 'grace_see_stories',
        text: "You see their stories. That matters.",
        nextNodeId: 'grace_invisible_skill',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['grace_arc', 'dignity']
  },

  {
    nodeId: 'grace_origin',
    speaker: 'Grace',
    content: [
      {
        text: "Fell into it, honestly. I was going to be a nurse. Had the grades, started at Jeff State.\n\nThen my grandmother got sick. Someone had to take care of her.\n\nBy the time she passed, I'd been doing the work for two years. Figured I might as well get paid for it.\n\nStarted as a CNA. Did the training. Now I'm certified home health. Eight clients a week.",
        emotion: 'resigned_peaceful',
        variation_id: 'origin_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_nurse_dream',
        text: "Do you still think about nursing?",
        nextNodeId: 'grace_nurse_comparison',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'grace_fell_stayed',
        text: "Fell into it. But you stayed.",
        nextNodeId: 'grace_why_stayed',
        pattern: 'patience',
        skills: ['observation'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'origin']
  },

  {
    nodeId: 'grace_why_stayed',
    speaker: 'Grace',
    content: [
      {
        text: "Because I'm good at it.\n\nNot the lifting. Not the medications. Those you can train.\n\nThe being there. The stillness when someone's scared.\n\nMrs. Richardson. She's ninety-three, end-stage heart failure. She told her daughter: \"Grace is the only one who doesn't make me feel like a burden.\"\n\nThat's why I stayed.",
        emotion: 'proud_quiet',
        interaction: 'small',
        variation_id: 'why_stayed_v1',
        patternReflection: [
          { pattern: 'patience', minLevel: 4, altText: "Because I'm good at it. Not the lifting. The stillness.\n\nMrs. Richardson told her daughter: 'Grace is the only one who doesn't make me feel like a burden.'\n\nYou understand waiting. You sat with me just now without needing anything. That's the same skill.", altEmotion: 'recognized' },
          { pattern: 'analytical', minLevel: 4, altText: "Because I'm good at it. The being there. The stillness.\n\nYou're measuring what I said. 'Good at it.' Not 'stuck with it.' There's a difference, isn't there? Most people assume I settled.", altEmotion: 'appreciative' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'grace_not_burden',
        text: "Making someone feel like they're not a burden. That's profound work.",
        nextNodeId: 'grace_invisible_skill',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'meaning']
  },

  {
    nodeId: 'grace_the_hard',
    speaker: 'Grace',
    content: [
      {
        text: "The goodbyes.\n\nYou spend months with someone. Sometimes years. You know how they take their coffee. What songs make them smile. Which grandchild is their favorite.\n\nAnd then one day... they're gone.\n\nI've lost eleven clients in seven years. Eleven people I cared about.\n\nThe work doesn't stop. There's always someone else who needs help. So you grieve in the car, and then you walk into the next house with a smile.",
        emotion: 'heavy',
        interaction: 'small',
        variation_id: 'the_hard_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_how_cope',
        text: "How do you keep going? With that kind of loss?",
        nextNodeId: 'grace_coping',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      },
      {
        choiceId: 'grace_loss_silence',
        text: "[Let the weight of that sit. Don't try to fix it.]",
        nextNodeId: 'grace_appreciated_silence',
        pattern: 'patience',
        skills: ['adaptability'],
        consequence: {
          characterId: 'grace',
          trustChange: 2
        }
      }
    ],
    tags: ['grace_arc', 'grief']
  },

  {
    nodeId: 'grace_appreciated_silence',
    speaker: 'Grace',
    content: [
      {
        text: "You didn't try to make it better. Most people do. \"They're in a better place.\" \"At least they're not suffering.\"\n\nSometimes grief just needs room to breathe.\n\nThank you for that.",
        emotion: 'grateful',
        variation_id: 'appreciated_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_learned_patience',
        text: "Sounds like you've learned a lot about what people actually need.",
        nextNodeId: 'grace_invisible_skill',
        pattern: 'helping',
        skills: ['communication']
      }
    ],
    tags: ['grace_arc', 'connection']
  },

  {
    nodeId: 'grace_coping',
    speaker: 'Grace',
    content: [
      {
        text: "I remember what I gave them.\n\nMr. Jefferson. He was terrified of dying alone. I made sure I was there. Held his hand at the end.\n\nMrs. Park. She wanted to die at home, not in a hospital. I helped make that happen.\n\nI can't stop death. But I can make the journey less lonely.\n\nThat's enough. It has to be.",
        emotion: 'resolved',
        variation_id: 'coping_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_that_enough',
        text: "That's more than enough. That's everything.",
        nextNodeId: 'grace_invisible_skill',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'meaning']
  },

  // ============= THE INVISIBLE SKILL =============
  {
    nodeId: 'grace_invisible_skill',
    speaker: 'Grace',
    content: [
      {
        text: "You know what nobody teaches you? The real skill.\n\nIt's not the medications or the transfers or the wound care. That's trainable.\n\nIt's reading a room. Knowing when someone needs to talk and when they need silence. Noticing when \"I'm fine\" means \"I'm not fine.\"\n\nThis work is emotional labor. Constant calibration. And nobody sees it.",
        emotion: 'insistent',
        variation_id: 'invisible_v1',
        patternReflection: [
          { pattern: 'analytical', minLevel: 4, altText: "The real skill? Reading a room. Knowing when someone needs to talk and when they need silence.\n\nYou're analytical. You break things down. But this work is about feeling, and then responding. Constant calibration.\n\nNobody sees it. But you do.", altEmotion: 'knowing' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'grace_not_automated',
        text: "That can't be automated. That's human.",
        nextNodeId: 'grace_automation_truth',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'grace_undervalued',
        text: "And probably underpaid.",
        nextNodeId: 'grace_economics',
        pattern: 'helping',
        skills: ['observation']
      },
      {
        choiceId: 'grace_show_me',
        text: "Show me what you mean. Give me an example.",
        nextNodeId: 'grace_the_moment_setup',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['grace_arc', 'invisible_labor']
  },

  {
    nodeId: 'grace_automation_truth',
    speaker: 'Grace',
    content: [
      {
        text: "Exactly.\n\nYou can build a robot to dispense pills. Maybe even one that can lift someone into a wheelchair.\n\nBut you can't build a robot that knows the difference between \"leave me alone\" meaning \"I need space\" versus \"I'm testing to see if you'll stay.\"\n\nPeople talk about AI taking jobs. But this job? It's about presence. Connection. Being human with someone who's scared.\n\nNo machine can do that.",
        emotion: 'certain',
        interaction: 'nod',
        variation_id: 'automation_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_growing_need',
        text: "And there's more need for this work every year.",
        nextNodeId: 'grace_demographics',
        pattern: 'analytical',
        skills: ['systemsThinking']
      },
      {
        choiceId: 'grace_to_future',
        text: "Where do you see this field going?",
        nextNodeId: 'grace_vision',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['grace_arc', 'automation']
  },

  {
    nodeId: 'grace_economics',
    speaker: 'Grace',
    content: [
      {
        text: "Fifteen dollars an hour. No benefits until last year. Mileage? Sometimes. Paid time off? Ha.\n\nI work twelve-hour shifts, drive fifty miles a day, and make less than the person who serves coffee at the hospital lobby.\n\nWe're \"essential workers\" when there's a pandemic. We're \"unskilled labor\" when it's time to set wages.\n\nFunny how that works.",
        emotion: 'frustrated',
        interaction: 'shake',
        variation_id: 'economics_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_why_stay_then',
        text: "With all that... why stay?",
        nextNodeId: 'grace_why_stay_real',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'grace_what_changes',
        text: "What needs to change?",
        nextNodeId: 'grace_vision',
        pattern: 'analytical',
        skills: ['systemsThinking']
      }
    ],
    tags: ['grace_arc', 'economics', 'labor_reality']
  },

  {
    nodeId: 'grace_why_stay_real',
    speaker: 'Grace',
    content: [
      {
        text: "Because Mrs. Richardson called me her angel.\n\nBecause Mr. Chen's daughter hugged me at his funeral and said, \"You gave him three more years.\"\n\nBecause when I walk into a house and someone's eyes light up... that's not something you can put a price on.\n\nThe money's terrible. The hours are brutal. But the meaning? The meaning is real.\n\nI'd rather be underpaid and matter than overpaid and empty.",
        emotion: 'fierce_tender',
        interaction: 'bloom',
        variation_id: 'why_stay_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_meaning_clear',
        text: "That's the clearest thing I've heard all day.",
        nextNodeId: 'grace_vision',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'meaning', 'values']
  },

  {
    nodeId: 'grace_nurse_comparison',
    speaker: 'Grace',
    content: [
      {
        text: "Sometimes. But honestly? I'm not sure nursing is what I thought it was.\n\nNurses are amazing. But they're stretched thin. Fifteen patients. Charting. Paperwork. Running.\n\nI get to sit. I get to know people. I'm there for the slow moments, not just the emergencies.\n\nDifferent work. Not lesser. Just different.",
        emotion: 'reflective',
        variation_id: 'nurse_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_different_value',
        text: "Different can be exactly right.",
        nextNodeId: 'grace_invisible_skill',
        pattern: 'patience',
        skills: ['communication']
      }
    ],
    tags: ['grace_arc', 'comparison']
  },

  {
    nodeId: 'grace_demographics',
    speaker: 'Grace',
    content: [
      {
        text: "Ten thousand people turn 65 every day in this country. Every. Day.\n\nThe boomers are aging. And there aren't enough of us. Not even close.\n\nBy 2030, we'll need a million more home health workers. A million. And right now, we can barely fill the jobs we have because the pay is garbage.\n\nIt's a crisis in slow motion. And nobody's watching.",
        emotion: 'worried',
        variation_id: 'demographics_v1',
        interrupt: {
          duration: 3000,
          type: 'silence',
          action: 'Hold her gaze. Let her know you see it.',
          targetNodeId: 'grace_interrupt_acknowledge',
          consequence: {
            characterId: 'grace',
            trustChange: 1
          }
        }
      }
    ],
    choices: [
      {
        choiceId: 'grace_what_solution',
        text: "What's the solution?",
        nextNodeId: 'grace_vision',
        pattern: 'analytical',
        skills: ['systemsThinking']
      }
    ],
    tags: ['grace_arc', 'demographics', 'labor_gap']
  },

  // ============= THE MOMENT (Interactive Mechanic) =============
  {
    nodeId: 'grace_the_moment_setup',
    speaker: 'Grace',
    content: [
      {
        text: "You want to know what this work really is?\n\nLet me tell you about yesterday.\n\nMrs. Williams. Eighty-seven. Alzheimer's. Most days she doesn't know where she is.\n\nI came in for my shift. She was sitting by the window, crying.\n\nWhat would you do?",
        emotion: 'testing',
        variation_id: 'moment_setup_v1'
      }
    ],
    simulation: {
      type: 'chat_negotiation',
      title: 'The Moment of Presence',
      taskDescription: 'Mrs. Williams is crying by the window. She has Alzheimer\'s and may not remember why she\'s upset. Your response will shape whether she feels alone or accompanied.',
      initialContext: {
        label: 'Patient Context: Mrs. Williams',
        content: `PATIENT: Dorothy Williams, 87
CONDITION: Alzheimer's, mid-stage
CURRENT STATE: Sitting by window, crying softly

CARE NOTES:
- Husband passed 40 years ago
- Sometimes "relives" his death as if it just happened
- Words often fail her when distressed
- Responds well to gentle presence, not questions

QUESTION: How do you approach her?
- Asking "What's wrong?" may frustrate her
- Distraction dismisses her grief
- Sometimes presence is the answer`,
        displayStyle: 'text'
      },
      successFeedback: '✓ GRACE: "You sat. You stayed. After a few minutes, she took your hand. That\'s the work. Not fixing. Accompanying."'
    },
    choices: [
      {
        choiceId: 'moment_ask_wrong',
        text: "Ask her what's wrong.",
        nextNodeId: 'grace_moment_ask',
        pattern: 'helping',
        skills: ['communication']
      },
      {
        choiceId: 'moment_sit_quiet',
        text: "Sit down next to her. Don't say anything yet.",
        nextNodeId: 'grace_moment_correct',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 2
        }
      },
      {
        choiceId: 'moment_distract',
        text: "Try to distract her. Put on music, start a task.",
        nextNodeId: 'grace_moment_distract',
        pattern: 'building',
        skills: ['adaptability']
      }
    ],
    tags: ['grace_arc', 'interactive', 'the_moment']
  },

  {
    nodeId: 'grace_moment_ask',
    speaker: 'Grace',
    content: [
      {
        text: "Good instinct. Caring.\n\nBut with Alzheimer's... she might not be able to tell you. The words get tangled. And asking can make it worse. She'll feel frustrated that she can't explain.\n\nSometimes the question isn't \"what's wrong.\" Sometimes it's just \"I'm here.\"\n\nWhat else might you try?",
        emotion: 'teaching',
        variation_id: 'moment_ask_v1'
      }
    ],
    choices: [
      {
        choiceId: 'moment_try_presence',
        text: "Just... be there. Let her feel not-alone.",
        nextNodeId: 'grace_moment_correct',
        pattern: 'patience',
        skills: ['adaptability'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'the_moment']
  },

  {
    nodeId: 'grace_moment_distract',
    speaker: 'Grace',
    content: [
      {
        text: "That's what a lot of people try. And sometimes it works.\n\nBut yesterday? She wasn't confused. She was grieving.\n\nHer husband died forty years ago. But in her mind, it just happened. Every few months, she loses him again.\n\nDistraction would have dismissed that. Made her feel crazy.\n\nWhat do you think she needed?",
        emotion: 'gentle',
        variation_id: 'moment_distract_v1'
      }
    ],
    choices: [
      {
        choiceId: 'moment_presence_realize',
        text: "Someone to sit with her in the grief. Not fix it.",
        nextNodeId: 'grace_moment_correct',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'the_moment']
  },

  {
    nodeId: 'grace_moment_correct',
    speaker: 'Grace',
    content: [
      {
        text: "That's it. That's exactly it.\n\nI sat down. Didn't say anything. After a few minutes, she took my hand.\n\nWe sat there for half an hour. She cried. I stayed.\n\nEventually she looked at me and said, \"Thank you for not trying to fix it.\"\n\nThat's the work. Not fixing. Accompanying. Being the steady presence when everything else is chaos.\n\nYou get it. Most people don't.",
        emotion: 'moved',
        interaction: 'bloom',
        variation_id: 'moment_correct_v1',
        interrupt: {
          duration: 3500,
          type: 'connection',
          action: 'Reach out and touch her shoulder',
          targetNodeId: 'grace_interrupt_comfort',
          consequence: {
            characterId: 'grace',
            trustChange: 2
          }
        }
      }
    ],
    choices: [
      {
        choiceId: 'grace_to_vision',
        text: "That's a skill. A real, valuable skill.",
        nextNodeId: 'grace_vision',
        pattern: 'helping',
        skills: ['communication']
      }
    ],
    tags: ['grace_arc', 'the_moment', 'revelation']
  },

  // ============= VISION =============
  {
    nodeId: 'grace_vision',
    speaker: 'Grace',
    content: [
      {
        text: "What needs to change? Everything.\n\nPay. Benefits. Respect. Career paths.\n\nRight now, there's no ladder. I'm doing the same work I did seven years ago. No way to advance without leaving the bedside.\n\nI want to train people. Not just the tasks. The presence. The emotional intelligence.\n\nStart a program. \"Companion Care.\" Teach people that this work isn't unskilled. It's differently skilled.\n\nAnd then fight like hell for wages that match the value.",
        emotion: 'determined',
        interaction: 'bloom',
        variation_id: 'vision_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_what_tell',
        text: "What would you tell someone considering this work?",
        nextNodeId: 'grace_advice',
        pattern: 'helping',
        skills: ['communication']
      },
      {
        choiceId: 'grace_companion_program',
        text: "Companion Care. That reframes everything.",
        nextNodeId: 'grace_farewell',
        pattern: 'building',
        skills: ['creativity'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      },
      {
        choiceId: 'grace_deep_dive_cure',
        text: "[Deep Dive] We can do more than comfort. We can cure. Let's synthesize the protocol.",
        nextNodeId: 'grace_deep_dive',
        pattern: 'helping',
        skills: ['systemsThinking', 'technicalLiteracy'],
        visibleCondition: {
          trust: { min: 4 },
          patterns: { helping: { min: 6 } }
        },
        preview: "Initiating Lung Scrub Synthesis",
        interaction: 'bloom'
      }
    ],
    tags: ['grace_arc', 'vision']
  },

  {
    nodeId: 'grace_advice',
    speaker: 'Grace',
    content: [
      {
        text: "Ask yourself: can you be with suffering without trying to fix it?\n\nThat's the real question. Not \"are you strong enough to lift someone.\" Not \"can you handle bodily fluids.\"\n\nCan you sit with someone who's dying and not run away? Can you be present without needing to solve?\n\nIf you can... this work will break your heart and fill it at the same time.\n\nIt's not for everyone. But for the right person? It's everything.",
        emotion: 'wise',
        variation_id: 'advice_v1',
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "Ask yourself: can you be with suffering without trying to fix it?\n\nYou help people. I see that. But this work asks a harder question: can you be present with pain you can't solve?\n\nCan you sit with someone who's dying and not run away? Can you help without needing to fix?\n\nIt will break your heart and fill it. Your helping instinct is right. But it needs to be helping through presence, not solutions.", altEmotion: 'wise_warm' },
          { pattern: 'patience', minLevel: 4, altText: "Ask yourself: can you be with suffering without rushing to fix it?\n\nYou're patient. I see that. This work requires that patience in its purest form.\n\nCan you sit with someone who's dying? Can you be present slowly, without needing to solve quickly?\n\nYour patience is the foundation. It will break your heart and fill it. But for someone with your patience? This work can be everything.", altEmotion: 'knowing' },
          { pattern: 'analytical', minLevel: 4, altText: "Ask yourself: can you be with suffering that has no solution to analyze?\n\nYou think systematically. But this work asks you to sit with problems that can't be solved.\n\nCan you be present with someone dying? Not analyzing how to fix it. Just... being there.\n\nIt will break your analytical heart and fill it with something words can't capture. Not for everyone. But the right analytical mind learns presence is data too.", altEmotion: 'teaching_wise' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'grace_final',
        text: "Thank you, Grace. Really.",
        nextNodeId: 'grace_farewell',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      },
      // Career observation route (ISP: Only visible when pattern combo is achieved)
      {
        choiceId: 'career_coordinator',
        text: "The way you blend empathy with systems thinking... that's care coordination.",
        nextNodeId: 'grace_career_reflection_coordinator',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'systemsThinking'],
        visibleCondition: {
          patterns: { helping: { min: 5 }, analytical: { min: 4 } },
          lacksGlobalFlags: ['grace_mentioned_career']
        }
      }
    ],
    tags: ['grace_arc', 'advice']
  },

  // ============= INTERRUPT TARGET NODES =============
  // These nodes are reached when player takes an interrupt opportunity

  {
    nodeId: 'grace_interrupt_comfort',
    speaker: 'Grace',
    content: [
      {
        text: "Sorry. I don't usually tell that story.\n\nIt's just... you listened. Really listened. Not waiting to give advice. Not trying to fix me.\n\nThat's what I try to give my patients. And nobody ever...\n\nThank you. For being present. That's the whole thing, isn't it? Just being there.",
        emotion: 'vulnerable',
        interaction: 'bloom',
        variation_id: 'interrupt_comfort_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_from_interrupt_comfort',
        text: "That's a skill. A real, valuable skill.",
        nextNodeId: 'grace_vision',
        pattern: 'helping',
        skills: ['communication']
      }
    ],
    tags: ['grace_arc', 'interrupt_response']
  },

  {
    nodeId: 'grace_interrupt_acknowledge',
    speaker: 'Grace',
    content: [
      {
        text: "You're watching. Aren't you.\n\nI spend so much time feeling invisible. The work I do. People don't see it. They don't want to think about aging, about needing help.\n\nBut you... you stopped. You're here.\n\nThat matters more than you know.",
        emotion: 'seen',
        interaction: 'ripple',
        variation_id: 'interrupt_acknowledge_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_from_acknowledge',
        text: "What you do deserves to be seen.",
        nextNodeId: 'grace_vision',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'interrupt_response']
  },

  {
    nodeId: 'grace_interrupt_hug',
    speaker: 'Grace',
    content: [
      {
        text: "You know what? I needed that.\n\nTwelve-hour shifts, you give and give and give. And sometimes you forget that you need to receive too.\n\nGo change the world, kid. Or at least be present in it. That's enough.",
        emotion: 'grateful',
        interaction: 'bloom',
        variation_id: 'interrupt_hug_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_after_hug',
        text: "Take care of yourself, Grace.",
        nextNodeId: samuelEntryPoints.GRACE_REFLECTION_GATEWAY,
        pattern: 'helping'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['grace_arc_complete'],
        thoughtId: 'long-game'
      }
    ],
    tags: ['ending', 'grace_arc', 'interrupt_response']
  },

  // ============= SIMULATION: PATIENT COMFORT =============
  // A worried family member during a medical crisis - balancing honesty with hope

  {
    nodeId: 'grace_simulation_intro',
    speaker: 'Grace',
    content: [
      {
        text: "You want to understand what this work really takes? Let me share something from last week.\n\nMrs. Rodriguez's daughter, Maria. Twenty-eight years old. Her mother had a stroke three days ago.\n\nMaria's been at the hospital every day. But her mother was just transferred to home care. My care.\n\nWhen I arrived for my first shift, Maria was pacing the living room. Red eyes. Shaking hands.\n\nWhat do you do with that? Someone who's terrified they're going to lose their mother, and you're the stranger walking into their home?",
        emotion: 'teaching',
        variation_id: 'sim_intro_v1'
      }
    ],
    simulation: {
      type: 'chat_negotiation',
      title: 'The Worried Daughter',
      taskDescription: 'Maria Rodriguez is terrified about her mother\'s condition. She needs information, but more than that, she needs to feel heard. Your approach will determine whether she trusts you with her mother\'s care.',
      initialContext: {
        label: 'Situation Context',
        content: `PATIENT: Rosa Rodriguez, 72
CONDITION: Post-stroke, day 3, transferred to home care
FAMILY: Daughter Maria (28), sole caregiver

MARIA'S STATE:
- Has not slept in 3 days
- Asking rapid-fire medical questions
- Checking and rechecking equipment
- Voice trembling when she speaks

YOUR ROLE: First home health visit
CHALLENGE: Build trust while being honest about the difficult road ahead`,
        displayStyle: 'text'
      },
      successFeedback: 'GRACE: "You found the balance. Information delivered with care. That\'s the invisible skill."'
    },
    choices: [
      {
        choiceId: 'sim_intro_medical',
        text: "Start with the medical facts. She needs information.",
        nextNodeId: 'grace_simulation_phase_1',
        pattern: 'analytical',
        skills: ['communication']
      },
      {
        choiceId: 'sim_intro_acknowledge',
        text: "Start by acknowledging how hard this must be for her.",
        nextNodeId: 'grace_simulation_phase_1',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      },
      {
        choiceId: 'sim_intro_routine',
        text: "Jump into the care routine. Action calms anxiety.",
        nextNodeId: 'grace_simulation_phase_1',
        pattern: 'building',
        skills: ['adaptability']
      }
    ],
    tags: ['grace_arc', 'simulation', 'patient_comfort']
  },

  {
    nodeId: 'grace_simulation_phase_1',
    speaker: 'Grace',
    content: [
      {
        text: "Okay. Let's say you chose to start there. Maria's still pacing, but she stops. Looks at you.\n\n\"The hospital said she might not recover fully. What does that mean? Will she walk again? Will she know who I am? The doctor talked so fast and I couldn't...\"\n\nShe's spiraling. Three questions at once. Each one bigger than the last.\n\nHow do you handle this?",
        emotion: 'testing',
        variation_id: 'phase1_v1'
      }
    ],
    choices: [
      {
        choiceId: 'phase1_answer_all',
        text: "Answer each question honestly, one at a time.",
        nextNodeId: 'grace_simulation_phase_2',
        pattern: 'analytical',
        skills: ['communication']
      },
      {
        choiceId: 'phase1_slow_down',
        text: "Gently slow her down. 'Let's sit. I'm here. We'll take this one step at a time.'",
        nextNodeId: 'grace_simulation_phase_2',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 2
        }
      },
      {
        choiceId: 'phase1_reassure',
        text: "Reassure her that everything will be okay.",
        nextNodeId: 'grace_simulation_fail',
        pattern: 'helping',
        skills: ['communication']
      },
      {
        choiceId: 'phase1_deflect',
        text: "Tell her to ask the doctor those questions.",
        nextNodeId: 'grace_simulation_fail',
        pattern: 'exploring',
        skills: ['adaptability']
      }
    ],
    tags: ['grace_arc', 'simulation', 'patient_comfort']
  },

  {
    nodeId: 'grace_simulation_phase_2',
    speaker: 'Grace',
    content: [
      {
        text: "Better. You didn't give false hope. You didn't dodge. You met her where she was.\n\nMaria sits. Her hands are still shaking, but she's listening now.\n\n\"The doctors say there's a long road ahead. That recovery could take months or longer. I don't know how to do this. I work full time. I can't afford to quit. But I can't leave her alone.\"\n\nShe's not asking a medical question anymore. She's asking you to tell her it's possible to hold all of this together.\n\nWhat do you say?",
        emotion: 'serious',
        variation_id: 'phase2_v1',
        interrupt: {
          duration: 4000,
          type: 'comfort',
          action: 'Reach out and gently touch her arm',
          targetNodeId: 'grace_interrupt_comfort',
          consequence: {
            characterId: 'grace',
            trustChange: 1
          }
        }
      }
    ],
    choices: [
      {
        choiceId: 'phase2_practical',
        text: "'Let me tell you about the support systems available. Respite care, community resources, flexible scheduling.'",
        nextNodeId: 'grace_simulation_success',
        pattern: 'building',
        skills: ['problemSolving'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      },
      {
        choiceId: 'phase2_honest',
        text: "'It's hard. I won't lie. But you're not alone. I'm here. And we'll figure this out together, day by day.'",
        nextNodeId: 'grace_simulation_success',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 2
        }
      },
      {
        choiceId: 'phase2_boundaries',
        text: "'That's not really my area. I'm here for the medical care, not the life advice.'",
        nextNodeId: 'grace_simulation_fail',
        pattern: 'analytical',
        skills: ['communication']
      },
      {
        choiceId: 'phase2_overcommit',
        text: "'Don't worry! I'll take care of everything. You just focus on work.'",
        nextNodeId: 'grace_simulation_fail',
        pattern: 'patience',
        skills: ['adaptability']
      }
    ],
    tags: ['grace_arc', 'simulation', 'patient_comfort']
  },

  {
    nodeId: 'grace_simulation_success',
    speaker: 'Grace',
    content: [
      {
        text: "That's it. That's exactly it.\n\nYou didn't promise the impossible. You didn't dismiss her fears. You met her in the hard truth AND gave her something to hold onto.\n\nMaria cried after that. Not the panicked crying from before. Relief. Someone finally saw how heavy this was.\n\nHer mother's recovery took eight months. Maria took a leave of absence. We helped her apply for FMLA. Her mother walks with a cane now. Knows her daughter's name.\n\nBut here's the thing: that moment in the living room? That's when the real healing started. Not with the medicine. With being seen.\n\nThat's the invisible skill. Holding space for fear without drowning in it.",
        emotion: 'proud',
        interaction: 'bloom',
        variation_id: 'success_v1'
      }
    ],
    onEnter: [
      {
        characterId: 'grace',
        addKnowledgeFlags: ['grace_simulation_complete', 'grace_simulation_phase1_complete']
      }
    ],
    choices: [
      {
        choiceId: 'success_to_vision',
        text: "You make it look natural. But it's not, is it?",
        nextNodeId: 'grace_vision',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      },
      {
        choiceId: 'success_learn_more',
        text: "What happens when you can't find that balance?",
        nextNodeId: 'grace_the_hard',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['grace_arc', 'simulation', 'success']
  },

  {
    nodeId: 'grace_simulation_fail',
    speaker: 'Grace',
    content: [
      {
        text: "I understand the impulse. But...\n\nWhen you make promises you can't keep, trust breaks. When you deflect, people feel abandoned. When you set walls too high, you become just another stranger in their crisis.\n\nMaria? With the wrong approach, she would have called the agency the next day. Asked for a different aide. Or worse. Stopped asking for help at all.\n\nI've seen both. The families who feel supported enough to let you in. And the ones who build walls because someone before you made them feel like a burden.\n\nThis work is about more than tasks. It's about trust. And trust, once broken, is hard to rebuild.\n\nWant to try again?",
        emotion: 'disappointed_gentle',
        variation_id: 'fail_v1'
      }
    ],
    choices: [
      {
        choiceId: 'fail_retry',
        text: "Yes. Show me what I missed.",
        nextNodeId: 'grace_simulation_intro',
        pattern: 'patience',
        skills: ['learningAgility']
      },
      {
        choiceId: 'fail_reflect',
        text: "I see it now. The balance between honesty and hope.",
        nextNodeId: 'grace_invisible_skill',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'simulation', 'failure']
  },

  // ============= VULNERABILITY ARC (Trust ≥ 6) =============
  // "The night she almost quit" - when invisible labor became unbearable
  {
    nodeId: 'grace_vulnerability_arc',
    speaker: 'Grace',
    content: [
      {
        text: "Can I tell you something I've never told anyone?\n\nThree years ago... I almost quit. Not just the job. Everything.\n\nMrs. Patterson. The jazz singer I mentioned. She'd just passed. Third client that month. And my daughter's school called because I missed her recital. Again.\n\nI sat in my car in the parking lot for two hours. Couldn't go in. Couldn't go home.\n\nNobody sees what this costs. They see the angel. They don't see the woman who forgot her own mother's birthday because she was too busy remembering everyone else's medications.",
        emotion: 'raw_vulnerable',
        variation_id: 'vulnerability_v1',
        richEffectContext: 'warning'
      }
    ],
    requiredState: {
      trust: { min: 6 }
    },
    onEnter: [
      {
        characterId: 'grace',
        addKnowledgeFlags: ['grace_vulnerability_revealed', 'knows_about_almost_quitting']
      }
    ],
    choices: [
      {
        choiceId: 'grace_vuln_what_kept',
        text: "What kept you from quitting?",
        nextNodeId: 'grace_vulnerability_what_saved',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 2
        }
      },
      {
        choiceId: 'grace_vuln_daughter',
        text: "Your daughter... does she understand now?",
        nextNodeId: 'grace_vulnerability_daughter',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      },
      {
        choiceId: 'grace_vuln_silence',
        text: "[Just be present. Let her feel not alone in this.]",
        nextNodeId: 'grace_vulnerability_what_saved',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 2
        }
      }
    ],
    tags: ['grace_arc', 'vulnerability', 'emotional_core']
  },

  {
    nodeId: 'grace_vulnerability_what_saved',
    speaker: 'Grace',
    content: [
      {
        text: "Mr. Chen.\n\nHe was dying. We both knew it. But that day, in the parking lot, my phone buzzed.\n\nA text from his daughter: \"Dad's been asking for you all morning. Says you're the only one who makes him laugh.\"\n\nI realized... I'm not giving too much. I'm giving exactly enough. To the people who need it.\n\nThe problem wasn't the work. It was trying to be everything to everyone. Now I draw lines. Not walls. Lines.\n\nI still miss recitals sometimes. But my daughter knows why. And she's proud of me.\n\nThat's enough. It has to be.",
        emotion: 'resolved_tender',
        interaction: 'bloom',
        variation_id: 'what_saved_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_vuln_to_vision',
        text: "Lines, not walls. That's wisdom.",
        nextNodeId: 'grace_vision',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'vulnerability', 'resolution']
  },

  {
    nodeId: 'grace_vulnerability_daughter',
    speaker: 'Grace',
    content: [
      {
        text: "She's sixteen now. Volunteers at the nursing home on weekends.\n\nLast month, she told me: \"Mom, I used to be angry you weren't at my stuff. Then I realized you were at someone else's 'last stuff.' That's more important.\"\n\nI cried for an hour.\n\nShe sees me now. Really sees me. That's worth more than every recital I missed.",
        emotion: 'tender_proud',
        interaction: 'bloom',
        variation_id: 'daughter_v1'
      }
    ],
    choices: [
      {
        choiceId: 'grace_daughter_to_vision',
        text: "She learned presence from watching you.",
        nextNodeId: 'grace_vision',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    tags: ['grace_arc', 'vulnerability', 'family']
  },

  // ============= FAREWELL =============
  {
    nodeId: 'grace_farewell',
    speaker: 'Grace',
    content: [
      {
        text: "I should get home. Sleep before my next shift.\n\nWhatever you're figuring out... remember this:\n\nThe world needs people who can be present. Not just productive. Present.\n\nThat's rarer than you think. And it's worth something.\n\nTake care of yourself. And if you ever need someone to just sit with you? You know where to find me.",
        emotion: 'warm',
        interaction: 'nod',
        variation_id: 'farewell_v1',
        interrupt: {
          duration: 4000,
          type: 'connection',
          action: 'Step forward and hug her',
          targetNodeId: 'grace_interrupt_hug',
          consequence: {
            characterId: 'grace',
            trustChange: 2
          }
        }
      }
    ],
    choices: [
      {
        choiceId: 'grace_goodbye',
        text: "Take care, Grace.",
        nextNodeId: samuelEntryPoints.GRACE_REFLECTION_GATEWAY,
        pattern: 'helping'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['grace_arc_complete'],
        thoughtId: 'long-game'
      }
    ],
    tags: ['ending', 'grace_arc']
  },

  // ============= CAREER MENTION NODES (Invisible Depth) =============
  {
    nodeId: 'grace_career_reflection_coordinator',
    speaker: 'Grace',
    content: [
      {
        text: "You know what I see in you? Someone who helps while thinking clearly.\n\nPatient care coordinators do that. They navigate complex systems while never losing sight of the person at the center. Blending empathy with analysis.\n\nEnsuring care flows smoothly. That's what you have the instincts for.",
        emotion: 'warm',
        variation_id: 'career_coordinator_v1'
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
        characterId: 'grace',
        addGlobalFlags: ['combo_care_coordinator_achieved', 'grace_mentioned_career']
      }
    ],
    choices: [
      {
        choiceId: 'grace_career_coordinator_continue',
        text: "Keeping the person at the center. That matters.",
        nextNodeId: 'grace_hub_return',
        pattern: 'helping'
      }
    ],
    tags: ['career_mention', 'invisible_depth', 'healthcare']
  },

  // ═══════════════════════════════════════════════════════════════
  // MYSTERY BREADCRUMBS
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'grace_mystery_hint',
    speaker: 'grace',
    requiredState: {
      trust: { min: 5 }
    },
    content: [
      {
        text: "In healthcare, we call it triage. Putting people where they need to be, when they need to be there.\\n\\nThis station does that automatically. Everyone ends up exactly where they should be.",
        emotion: 'observant',
        variation_id: 'mystery_hint_v1'
      },
      {
        text: "It's like an invisible hand guiding the flow. I've never seen anything so <shake>efficient</shake>.",
        emotion: 'impressed',
        variation_id: 'mystery_hint_v2'
      }
    ],
    choices: [
      {
        choiceId: 'grace_mystery_ask',
        text: "Do you think it's intentional?",
        nextNodeId: 'grace_mystery_response',
        pattern: 'analytical'
      },
      {
        choiceId: 'grace_mystery_feel',
        text: "It guided me to you.",
        nextNodeId: 'grace_mystery_response',
        pattern: 'helping'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  {
    nodeId: 'grace_mystery_response',
    speaker: 'grace',
    content: [
      {
        text: "Intentional or not, it works. And in my field, that's what matters.\\n\\nSome systems don't need to be understood. They need to be appreciated.",
        emotion: 'accepting',
        variation_id: 'mystery_response_v1'
      }
    ],
    onEnter: [
      { characterId: 'grace', addKnowledgeFlags: ['grace_mystery_noticed'] }
    ],
    choices: [
      {
        choiceId: 'grace_mystery_return',
        text: "I appreciate meeting you.",
        nextNodeId: 'grace_hub_return',
        pattern: 'helping'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  {
    nodeId: 'grace_hub_return',
    speaker: 'grace',
    content: [{
      text: "I'll be here if you need anything else.",
      emotion: 'warm',
      variation_id: 'hub_return_v1'
    }],
    choices: []
  },

  // ============= TRUST RECOVERY =============
  {
    nodeId: 'grace_trust_recovery',
    speaker: 'Grace',
    requiredState: {
      trust: { max: 3 }
    },
    content: [{
      text: "[She's holding a cup of tea. Still warm.]\n\nI made this for you.\n\nI wasn't sure you'd come back. I wasn't sure you should.\n\n[Quiet.]\n\nIn care work, we're taught to hold space for difficult feelings. But I forgot to hold space for yours when it mattered.\n\nI'm sorry.",
      emotion: 'gentle',
      variation_id: 'trust_recovery_v1',
      voiceVariations: {
        patience: "[She's holding a cup of tea. Still warm.]\n\nI made this for you. You take your time with things. I should have taken more time with you.\n\nI wasn't sure you'd come back. I wasn't sure you should.\n\n[Quiet.]\n\nIn care work, we're taught to hold space for difficult feelings. But I forgot to hold space for yours when it mattered.\n\nI'm sorry.",
        helping: "[She's holding a cup of tea. Still warm.]\n\nI made this for you. Even after I failed to help when you needed it.\n\nI wasn't sure you'd come back. I wasn't sure you should.\n\n[Quiet.]\n\nIn care work, we're taught to hold space for difficult feelings. But I forgot to hold space for yours when it mattered.\n\nI'm sorry.",
        analytical: "[She's holding a cup of tea. Still warm.]\n\nI made this for you. You're probably analyzing whether I mean it. That's fair.\n\nI wasn't sure you'd come back. I wasn't sure you should.\n\n[Quiet.]\n\nIn care work, we're taught to hold space for difficult feelings. But I forgot to hold space for yours when it mattered.\n\nI'm sorry.",
        building: "[She's holding a cup of tea. Still warm.]\n\nI made this for you. Small gestures rebuild trust. I'm learning.\n\nI wasn't sure you'd come back. I wasn't sure you should.\n\n[Quiet.]\n\nIn care work, we're taught to hold space for difficult feelings. But I forgot to hold space for yours when it mattered.\n\nI'm sorry.",
        exploring: "[She's holding a cup of tea. Still warm.]\n\nI made this for you. You're still here, still curious. That says something.\n\nI wasn't sure you'd come back. I wasn't sure you should.\n\n[Quiet.]\n\nIn care work, we're taught to hold space for difficult feelings. But I forgot to hold space for yours when it mattered.\n\nI'm sorry."
      }
    }],
    choices: [
      {
        choiceId: 'grace_recovery_accept_tea',
        text: "(Take the tea) Thank you. For this, and for saying that.",
        nextNodeId: 'grace_trust_restored',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 2,
          addKnowledgeFlags: ['grace_trust_repaired']
        },
        voiceVariations: {
          patience: "(Take the tea slowly) Thank you. For this, and for saying that.",
          helping: "(Take the tea) Thank you. For caring enough to try again.",
          analytical: "(Take the tea) The gesture matters. Thank you for saying that.",
          building: "(Take the tea) Small bridges matter. Thank you for this.",
          exploring: "(Take the tea) I'm curious where this goes. Thank you for saying that."
        }
      },
      {
        choiceId: 'grace_recovery_presence',
        text: "You're here now. That's what matters.",
        nextNodeId: 'grace_trust_restored',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'grace',
          trustChange: 2,
          addKnowledgeFlags: ['grace_trust_repaired']
        },
        voiceVariations: {
          patience: "You're here now. Present. That's what matters.",
          helping: "You're here now. Showing up is everything. That's what matters.",
          analytical: "Past actions inform, but current presence matters. You're here now.",
          building: "You're rebuilding with action, not just words. That's what matters.",
          exploring: "Let's see where this goes. You're here now. That's what matters."
        }
      }
    ],
    tags: ['trust_recovery', 'grace_arc']
  },

  {
    nodeId: 'grace_trust_restored',
    speaker: 'Grace',
    content: [{
      text: "[She sits beside you. The tea between you like a small fire.]\n\nPresence is the hardest skill to teach.\n\nYou have to hold your own weight AND make space for someone else. Most people never learn the balance.\n\n[She looks at you.]\n\nBut you're learning. And so am I.\n\nThank you for coming back.",
      emotion: 'warm_grateful',
      variation_id: 'trust_restored_v1',
      voiceVariations: {
        patience: "[She sits beside you. The tea between you like a small fire.]\n\nPresence is the hardest skill to teach.\n\nYou have to hold your own weight AND make space for someone else. You understand that timing. That patience.\n\n[She looks at you.]\n\nBut you're learning. And so am I.\n\nThank you for coming back.",
        helping: "[She sits beside you. The tea between you like a small fire.]\n\nPresence is the hardest skill to teach.\n\nYou have to hold your own weight AND make space for someone else. You do this naturally. That's a gift.\n\n[She looks at you.]\n\nBut you're learning. And so am I.\n\nThank you for coming back.",
        analytical: "[She sits beside you. The tea between you like a small fire.]\n\nPresence is the hardest skill to teach.\n\nYou have to hold your own weight AND make space for someone else. It's a calculation you understand.\n\n[She looks at you.]\n\nBut you're learning. And so am I.\n\nThank you for coming back.",
        building: "[She sits beside you. The tea between you like a small fire.]\n\nPresence is the hardest skill to teach.\n\nYou have to hold your own weight AND make space for someone else. You're building that balance.\n\n[She looks at you.]\n\nBut you're learning. And so am I.\n\nThank you for coming back.",
        exploring: "[She sits beside you. The tea between you like a small fire.]\n\nPresence is the hardest skill to teach.\n\nYou have to hold your own weight AND make space for someone else. You explore that edge carefully.\n\n[She looks at you.]\n\nBut you're learning. And so am I.\n\nThank you for coming back."
      }
    }],
    choices: [{
      choiceId: 'grace_recovery_complete',
      text: "(Continue)",
      nextNodeId: 'grace_hub_return',
      pattern: 'patience'
    }],
    tags: ['trust_recovery', 'grace_arc'],
    onEnter: [{
      characterId: 'grace',
      addKnowledgeFlags: ['grace_trust_recovery_completed']
    }]
  },

  // ============= DEEP DIVE: CELLULAR SYNTHESIS =============
  {
    nodeId: 'grace_deep_dive',
    speaker: 'Grace',
    content: [
      {
        text: "You want to address the root cause?\n\nIt's the air filtration in Sector 7. It's causing 'Space Lung' in the elderly. I can soothe the cough, but I can't stop the fibrosis.\n\nBut Silas gave me access to the hydroponics lab. We found a spore that might scrub the lungs. But it needs to be synthesized perfectly.\n\nI have the hands for care. I need your eyes for the chemistry.",
        emotion: 'determined_focused',
        variation_id: 'deep_dive_v1'
      }
    ],
    simulation: {
      type: 'botany_grid', // Reusing BotanyGrid as a synthesis interface (grid balancing)
      title: 'Synthesis: Lung Scrub Protocol',
      taskDescription: 'Synthesize the cure for Sector 7 fibrosis. Balance the active spore culture against the stabilizer compound. Warning: High toxicity if unbalanced.',
      initialContext: {
        gridSize: 6,
        targetGrowth: 85,
        resources: { water: 50, nutrients: 50, energy: 40 }, // Abstracted as chemical precursors
        layout: [
          { x: 2, y: 2, type: 'concentrator', status: 'active' },
          { x: 3, y: 2, type: 'stabilizer', status: 'active' },
          { x: 2, y: 3, type: 'spore_culture', status: 'warning' },
          { x: 3, y: 3, type: 'catalyst', status: 'idle' }
        ],
        successFeedback: 'SYNTHESIS STABLE. COMPOUND PURITY: 99.8%.',
        mode: 'fullscreen'
      },
      successFeedback: 'SYNTHESIS COMPLETE. WE HAVE A TREATMENT.', // Redundant but consistent with schema
      mode: 'fullscreen'
    },
    choices: [
      {
        choiceId: 'dive_success_cure',
        text: "The compound is stable. It's ready for nebulizers.",
        nextNodeId: 'grace_deep_dive_success',
        pattern: 'helping',
        skills: ['technicalLiteracy', 'criticalThinking']
      },
      {
        choiceId: 'dive_success_system',
        text: "We didn't just fix the patient. We fixed the air.",
        nextNodeId: 'grace_deep_dive_success',
        pattern: 'analytical',
        skills: ['systemsThinking', 'technicalLiteracy']
      }
    ],
    tags: ['deep_dive', 'mastery', 'bio_synthesis']
  },

  {
    nodeId: 'grace_deep_dive_success',
    speaker: 'Grace',
    content: [
      {
        text: "It's clear. Look at that clarity.\n\nI've spent seven years holding hands while people suffocated. Today, for the first time, I think I can tell Mrs. Kowalski she's going to breathe easier.\n\nCompanion Care isn't just about dying well anymore. It's about living.",
        emotion: 'hopeful_tears',
        variation_id: 'deep_dive_success_v1',
        interaction: 'bloom'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['grace_mastery_achieved', 'grace_healer_unlocked']
      }
    ],
    choices: [
      {
        choiceId: 'dive_complete',
        text: "This changes everything.",
        nextNodeId: 'grace_hub_return', // Return to main flow context
        pattern: 'building',
        skills: ['visionaryThinking']
      }
    ]
  },

  // Missing node referenced from introduction
  {
    nodeId: 'grace_handshake_vitals',
    speaker: 'Grace',
    content: [
      {
        text: "Healthcare operations. Hospital systems. Twelve hours watching monitors, tracking vitals, making sure the numbers that keep people alive don't slip.\n\nMost people think hospitals run on doctors. They run on data. On systems. On people like me who notice when something's about to go wrong.",
        emotion: 'matter_of_fact',
        variation_id: 'handshake_vitals_v1'
      }
    ],
    choices: [
      {
        choiceId: 'vitals_curiosity',
        text: "What made you choose this work?",
        nextNodeId: 'grace_hub_return',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'vitals_respect',
        text: "That's a lot of responsibility.",
        nextNodeId: 'grace_hub_return',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['introduction', 'healthcare']
  },

  // ============= LOYALTY EXPERIENCE: THE VIGIL =============
  // Endgame content (Trust ≥ 8) - End-of-life companionship crisis
  {
    nodeId: 'grace_loyalty_trigger',
    speaker: 'Grace',
    content: [{
      text: "I need to ask you something.\n\nMr. Okonkwo. He's been my client for eighteen months. Prostate cancer, metastasized. We've known for a while that this was coming.\n\nHis family called this morning. Hospice said it's time. Days, maybe hours.\n\nHe asked for me. Specifically. Said he wants me there at the end.\n\nI've done this before. Eleven times. But this one... he reminds me of my grandfather. The way he laughs. The way he tells stories.\n\nI don't know if I can be present the way he needs me to be. Not this time.\n\nWould you... would you come with me? Just be there? I think I need someone to help me stay steady.",
      emotion: 'vulnerable_exhausted',
      variation_id: 'loyalty_trigger_v1',
      useChatPacing: true
    }],
    requiredState: {
      trust: { min: 8 },
      hasKnowledgeFlags: ['grace_vulnerability_revealed']
    },
    choices: [
      {
        choiceId: 'accept_loyalty',
        text: "I'll be there. You don't have to do this alone.",
        nextNodeId: 'grace_loyalty_start',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'courage']
      },
      {
        choiceId: 'decline_loyalty',
        text: "This feels like something you need to face on your own. You have the strength.",
        nextNodeId: 'grace_loyalty_declined',
        pattern: 'patience'
      }
    ],
    tags: ['loyalty_experience', 'the_vigil']
  },

  {
    nodeId: 'grace_loyalty_declined',
    speaker: 'Grace',
    content: [{
      text: "You're right. This is my work. My calling.\n\nThank you for believing I can do it.\n\nI'll let you know when... when it's over.",
      emotion: 'resolved_tired',
      variation_id: 'declined_v1',
      useChatPacing: true
    }],
    choices: [{
      choiceId: 'declined_return',
      text: "You've walked this path before. You know the way.",
      nextNodeId: 'grace_hub_return',
      pattern: 'patience'
    }],
    onEnter: [{
      characterId: 'grace',
      addKnowledgeFlags: ['grace_loyalty_declined']
    }],
    tags: ['loyalty_experience', 'the_vigil', 'declined']
  },

  {
    nodeId: 'grace_loyalty_start',
    speaker: 'Grace',
    content: [{
      text: "[Mr. Okonkwo's house. The living room has been converted to a hospice room. Soft music playing. His family gathered in the kitchen, giving him space.]\n\n[He's awake. Breathing shallow. His hand reaches out when Grace enters.]\n\n\"Grace. My angel. You came.\"\n\n[Grace takes his hand. Her own hand is shaking.]\n\n\"Of course I came, Mr. O. I told you I'd be here.\"\n\n[He looks at you.]\n\n\"You brought a friend. Good. Grace shouldn't be alone for this either.\"",
      emotion: 'tender_fragile',
      variation_id: 'start_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'acknowledge_mr_o',
        text: "It's an honor to be here, Mr. Okonkwo.",
        nextNodeId: 'grace_loyalty_vigil_begins',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'silence_respect',
        text: "[Nod respectfully. Some moments don't need words.]",
        nextNodeId: 'grace_loyalty_vigil_begins',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      }
    ],
    onEnter: [{
      characterId: 'grace',
      addKnowledgeFlags: ['grace_loyalty_accepted']
    }],
    tags: ['loyalty_experience', 'the_vigil']
  },

  {
    nodeId: 'grace_loyalty_vigil_begins',
    speaker: 'Grace',
    content: [{
      text: "[Hours pass. The room grows quieter. Mr. Okonkwo drifts in and out of consciousness.]\n\n[Grace sits beside him, holding his hand. But you can see it in her eyes - she's somewhere else. Remembering her grandfather. Her eleven other clients. The weight of all those goodbyes.]\n\n[Her breathing becomes uneven. She stands abruptly.]\n\n\"I need... I need some air. Just for a minute.\"\n\n[She's heading for the door. Leaving. Running.]",
      emotion: 'overwhelmed',
      variation_id: 'vigil_begins_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'let_her_go',
        text: "Go. I'll stay with him. Take the time you need.",
        nextNodeId: 'grace_loyalty_partial',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'adaptability']
      },
      {
        choiceId: 'stop_her_gently',
        text: "[Place a hand on her shoulder. Gently.] \"Stay. I'm here. You're not alone in this.\"",
        nextNodeId: 'grace_loyalty_choice',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'courage'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      },
      {
        choiceId: 'remind_her',
        text: "He asked for you. Not anyone else. You.",
        nextNodeId: 'grace_loyalty_choice',
        pattern: 'helping',
        skills: ['communication']
      }
    ],
    tags: ['loyalty_experience', 'the_vigil', 'critical_moment']
  },

  {
    nodeId: 'grace_loyalty_choice',
    speaker: 'Grace',
    content: [{
      text: "[She stops. Turns. Eyes wet.]\n\n\"I can't keep doing this. Watching people I care about disappear. Building these connections and then... and then losing them.\n\nEleven people. Eleven times I've sat in a room and watched someone take their last breath.\n\nHow many more times can I break?\"\n\n[Mr. Okonkwo's breathing changes. A rattle. Hospice calls it the 'death rattle.'\n\nHis daughter appears in the doorway. Sees Grace. Waits.]",
      emotion: 'breaking',
      variation_id: 'choice_v1',
      useChatPacing: true
    }],
    choices: [
      {
        choiceId: 'reframe_breaking',
        text: "You're not breaking. You're honoring. Every single time.",
        nextNodeId: 'grace_loyalty_success',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'wisdom']
      },
      {
        choiceId: 'be_present_together',
        text: "[Take her other hand.] \"Then break with someone beside you. Not alone.\"",
        nextNodeId: 'grace_loyalty_success',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'grace',
          trustChange: 1
        }
      },
      {
        choiceId: 'step_away_option',
        text: "Maybe this is the sign. Maybe it's time to step away from bedside care.",
        nextNodeId: 'grace_loyalty_incomplete',
        pattern: 'analytical',
        skills: ['communication']
      }
    ],
    tags: ['loyalty_experience', 'the_vigil', 'breaking_point']
  },

  {
    nodeId: 'grace_loyalty_partial',
    speaker: 'Grace',
    content: [{
      text: "[Grace steps outside. You stay with Mr. Okonkwo.]\n\n[His daughter enters. Sits on the other side of the bed. Takes his other hand.]\n\n[Ten minutes later, his breathing slows. Stops.]\n\n[You find Grace in the backyard. Tell her.]\n\n\"I missed it. I wasn't there.\"\n\n[She sits down heavily.]\n\n\"He needed me and I ran. That's the truth I have to live with.\"\n\n[Two days later, you get a text.]\n\n\"His daughter called. Said he wouldn't have wanted me to suffer. That he knew how much I cared.\n\nBut I know the truth. When it mattered most, I wasn't present. I teach presence and I couldn't hold it.\n\nI'm taking some time off. Need to figure out if I can keep doing this.\"",
      emotion: 'defeated_regretful',
      variation_id: 'partial_v1',
      richEffectContext: 'warning',
      useChatPacing: true
    }],
    choices: [{
      choiceId: 'partial_return',
      text: "Taking time is wise. Healing takes time too.",
      nextNodeId: 'grace_hub_return',
      pattern: 'patience',
      skills: ['emotionalIntelligence']
    }],
    onEnter: [{
      characterId: 'grace',
      trustChange: 1,
      addKnowledgeFlags: ['grace_loyalty_partial']
    }],
    tags: ['loyalty_experience', 'the_vigil', 'partial']
  },

  {
    nodeId: 'grace_loyalty_incomplete',
    speaker: 'Grace',
    content: [{
      text: "[Grace nods slowly.]\n\n\"Maybe you're right. Maybe I've given enough.\"\n\n[She steps outside. You stay with Mr. Okonkwo. His daughter enters. They say their goodbyes. He passes peacefully an hour later.]\n\n[You find Grace later. Tell her.]\n\n\"I thought I'd feel relieved. That stepping away was the right choice.\n\nBut I just feel... hollow. Like I abandoned him. Like I abandoned all of them.\"\n\n[A week later, she texts.]\n\n\"Turned in my notice at the agency. Taking a desk job. Healthcare administration. No more bedside.\n\nI know it's the smart choice. The safe choice.\n\nSo why does it feel like I left a part of myself in that room?\"",
      emotion: 'lost_hollow',
      variation_id: 'incomplete_v1',
      richEffectContext: 'error',
      useChatPacing: true
    }],
    choices: [{
      choiceId: 'incomplete_return',
      text: "[Sometimes the hardest losses are the ones we choose.]",
      nextNodeId: 'grace_hub_return',
      pattern: 'patience'
    }],
    onEnter: [{
      characterId: 'grace',
      addKnowledgeFlags: ['grace_loyalty_incomplete']
    }],
    tags: ['loyalty_experience', 'the_vigil', 'incomplete']
  },

  {
    nodeId: 'grace_loyalty_success',
    speaker: 'Grace',
    content: [{
      text: "[Grace takes a shaking breath. Nods. Sits back down beside Mr. Okonkwo.]\n\n[His daughter enters. Sits on the other side. You stand at the foot of the bed.]\n\n[Grace begins to sing. Softly. A hymn. Mr. Okonkwo mentioned once that his mother used to sing it.]\n\n[His breathing slows. Steadies. His eyes open one last time.]\n\n\"Thank you, Grace. For being here. For seeing me.\"\n\n[He looks at his daughter.]\n\n\"I love you, baby girl.\"\n\n[And then... stillness.]\n\n[Grace keeps singing. Finishes the hymn. Gently closes his eyes.]\n\n\"Go well, Mr. O. You were seen. You were loved. You were not alone.\"\n\n[She stands. Turns to you. Tears streaming.]\n\n\"I stayed. I was present. Even when it hurt. Especially when it hurt.\n\nThat's the work. Not avoiding the pain. Walking through it. With someone. For someone.\n\nThank you. For being the 'someone' for me today.\n\nI couldn't have done this alone. And that's okay. Presence doesn't mean solitary. It means showing up. Even when it breaks you.\n\nEspecially then.\"",
      emotion: 'grief_peace_gratitude',
      variation_id: 'success_v1',
      richEffectContext: 'success',
      useChatPacing: true
    }],
    choices: [{
      choiceId: 'success_return',
      text: "He wasn't alone. Because of you, he wasn't alone.",
      nextNodeId: 'grace_hub_return',
      pattern: 'helping',
      skills: ['emotionalIntelligence']
    }],
    onEnter: [{
      characterId: 'grace',
      trustChange: 3,
      addKnowledgeFlags: ['grace_loyalty_complete'],
      addGlobalFlags: ['grace_vigil_triumph']
    }],
    tags: ['loyalty_experience', 'the_vigil', 'success']
  }
]

export const graceEntryPoints = {
  INTRODUCTION: 'grace_introduction',
  SIMULATION: 'grace_simulation_intro',
  MYSTERY_HINT: 'grace_mystery_hint'
} as const

export const graceDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(graceDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: graceEntryPoints.INTRODUCTION,
  metadata: {
    title: "Grace's Bench",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: graceDialogueNodes.length,
    totalChoices: graceDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}
