/**
 * Alex's Dialogue Graph
 * The Credential Paradox - Platform 8: The Learning Loop
 *
 * CHARACTER: Former bootcamp instructor, now documentation writer
 * Core Conflict: Credential culture vs. genuine learning
 * Arc: From burnout and skepticism to rediscovering curiosity
 * Theme: Learning to learn > chasing certificates
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const alexDialogueNodes: DialogueNode[] = [
  // ============= SCENE 1: THE DISMISSAL =============
  {
    nodeId: 'alex_introduction',
    speaker: 'Alex',
    content: [
      {
        text: "D'you bring it? The shiny?\n\nI got maps. I got codes. I got a protein bar from 2024. What's your trade?",
        emotion: 'suspicious',
        interaction: 'shake',
        variation_id: 'alex_intro_rat_v1',
        richEffectContext: 'thinking',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_intro_burnout',
        text: "You sound burned out.",
        voiceVariations: {
          analytical: "That pitch sounds rehearsed. And exhausted.",
          helping: "You sound burned out. Are you okay?",
          building: "That's a lot of hustle talk. What are you actually building?",
          exploring: "What's behind the sales pitch? You sound tired.",
          patience: "Take a breath. You don't have to perform for me."
        },
        nextNodeId: 'alex_response_helping',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'alex',
          trustChange: 2
        }
      },
      {
        choiceId: 'alex_intro_ai_worth',
        text: "Is learning AI actually worth it?",
        voiceVariations: {
          analytical: "Is learning AI actually worth it? What's the ROI?",
          helping: "Everyone says learn AI. But is it worth the stress?",
          building: "Should I be learning AI? Or building with it?",
          exploring: "Is learning AI actually worth it? Or just hype?",
          patience: "AI moves fast. Is any of it worth learning deeply?"
        },
        nextNodeId: 'alex_response_analytical',
        pattern: 'analytical',
        skills: ['criticalThinking', 'adaptability'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      },
      {
        choiceId: 'alex_intro_ready',
        text: "What do you mean 'finally feel ready'?",
        archetype: 'ASK_FOR_DETAILS',
        nextNodeId: 'alex_response_exploring',
        pattern: 'exploring',
        skills: ['criticalThinking', 'communication'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      },
      {
        choiceId: 'alex_intro_direction',
        text: "I don't need certifications. I need direction.",
        archetype: 'SHARE_PERSPECTIVE',
        nextNodeId: 'alex_response_building',
        pattern: 'building',
        skills: ['adaptability', 'creativity'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      },
      {
        choiceId: 'alex_intro_system_unlock',
        text: "[Pattern Recognition] The night vision. The jingling pockets. You've mapped more than air ducts. You've mapped information flow.",
        archetype: 'MAKE_OBSERVATION',
        nextNodeId: 'alex_system_insight',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving'],
        visibleCondition: {
          patterns: { analytical: { min: 40 } }
        },
        consequence: {
          characterId: 'alex',
          trustChange: 2
        }
      },
      {
        choiceId: 'alex_intro_builder_unlock',
        text: "[Decisive Action] Stop pitching. Show me what you've actually built.",
        archetype: 'CHALLENGE_ASSUMPTION',
        nextNodeId: 'alex_builder_reveal',
        pattern: 'building',
        skills: ['leadership', 'adaptability'],
        visibleCondition: {
          patterns: { building: { min: 50 } }
        },
        consequence: {
          characterId: 'alex',
          trustChange: 2
        }
      }
    ],
    onEnter: [
      {
        characterId: 'alex',
        setRelationshipStatus: 'stranger',
        addGlobalFlags: ['met_alex']
      }
    ],
    tags: ['introduction', 'alex_arc']
  },

  // Responses to Scene 1 choices
  {
    nodeId: 'alex_response_helping',
    speaker: 'Alex',
    content: [
      {
        text: "Yeah. Maybe.\n\n...Sorry. That was my old instructor voice. Muscle memory.\n\nI'm Alex. I used to teach bootcamps. Now I write documentation for tools I'm not sure anyone needs.\n\nYou're the first person to ask how I am instead of what I know.",
        emotion: 'surprised_vulnerable',
        interaction: 'nod',
        variation_id: 'response_helping_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'to_contradiction_from_helping',
        text: "What happened with the bootcamps?",
        voiceVariations: {
          analytical: "What data made you leave the bootcamps?",
          helping: "What happened with the bootcamps? If you want to talk about it.",
          building: "What went wrong with the bootcamps?",
          exploring: "What happened? Why'd you stop teaching?",
          patience: "Take your time. What happened with the bootcamps?"
        },
        nextNodeId: 'alex_contradiction',
        pattern: 'exploring',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['alex_arc']
  },

  {
    nodeId: 'alex_response_analytical',
    speaker: 'Alex',
    content: [
      {
        text: "Worth it for who? The platform selling the course? The company looking for cheap keywords on resumes?\n\nI'm Alex. Former bootcamp instructor. Now documentation writer.\n\nYou want data? I watched three cohorts do everything \"right.\" Courses, projects, networking. Still struggle. The ones who succeeded? Weren't the best coders.",
        emotion: 'frustrated',
        interaction: 'shake',
        variation_id: 'response_analytical_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'to_contradiction_from_analytical',
        text: "Then what made the difference?",
        nextNodeId: 'alex_contradiction',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['alex_arc']
  },

  {
    nodeId: 'alex_response_exploring',
    speaker: 'Alex',
    content: [
      {
        text: "\"Ready.\" The trap word.\n\nOne more course. One more certificate. One more bootcamp. Then you'll be ready.\n\nExcept you never are. The finish line keeps moving.\n\nI'm Alex. I taught that lie for three years. Now I write docs for AI tools and wonder if any of it matters.",
        emotion: 'reflective',
        interaction: 'nod',
        variation_id: 'response_exploring_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'to_contradiction_from_exploring',
        text: "What made you stop teaching?",
        nextNodeId: 'alex_contradiction',
        pattern: 'exploring',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['alex_arc']
  },

  {
    nodeId: 'alex_response_building',
    speaker: 'Alex',
    content: [
      {
        text: "Direction over credentials. That's... refreshing.\n\nMost people want the shortcut. The checklist. The guarantee.\n\nI'm Alex. Former bootcamp instructor. Current documentation hermit.\n\nYou might actually survive out there.",
        emotion: 'intrigued',
        interaction: 'nod',
        variation_id: 'response_building_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'to_contradiction_from_building',
        text: "What do you mean, survive?",
        nextNodeId: 'alex_contradiction',
        pattern: 'building',
        skills: ['adaptability']
      }
    ],
    tags: ['alex_arc']
  },

  // ============= PATTERN-UNLOCK NODES =============
  {
    nodeId: 'alex_system_insight',
    speaker: 'Alex',
    content: [
      {
        text: "...You can see that?\n\nThree years mapping this station. The ventilation isn't just air. It's information. Who talks to who. Where the real decisions happen. Where the blockages form.\n\nMost people just see rats in walls. You see...\n\n...You see patterns.",
        emotion: 'impressed',
        interaction: 'nod',
        variation_id: 'alex_system_insight_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_system_show_more',
        text: "Show me what you've mapped.",
        archetype: 'EXPRESS_CURIOSITY',
        nextNodeId: 'alex_contradiction',
        pattern: 'analytical',
        skills: ['criticalThinking', 'systemsThinking'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      }
    ],
    tags: ['alex_arc', 'pattern_unlock']
  },

  {
    nodeId: 'alex_builder_reveal',
    speaker: 'Alex',
    content: [
      {
        text: "Okay. Fine.\n\nBootcamp dropout tracker. Connects with 400+ former students across twelve cohorts. Not what they learned. What they did with it. Real outcomes, not LinkedIn theater.\n\nThe patterns are brutal. But honest.\n\nNo one asked me to build this. No one's paying for it. I just... needed to know.",
        emotion: 'vulnerable',
        interaction: 'nod',
        variation_id: 'alex_builder_reveal_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_builder_patterns',
        text: "What patterns did you find?",
        archetype: 'ASK_FOR_DETAILS',
        nextNodeId: 'alex_contradiction',
        pattern: 'building',
        skills: ['criticalThinking', 'leadership'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      }
    ],
    tags: ['alex_arc', 'pattern_unlock']
  },

  // ============= SCENE 2: THE CONTRADICTION =============
  {
    nodeId: 'alex_contradiction',
    speaker: 'Alex',
    content: [
      {
        text: "You know what's wild?\n\nThe people who told my students \"just build projects\" were the same ones who got their jobs through connections.\n\nAnd the ones screaming \"prompt engineering is dead\" online? Half of them are selling prompt templates on the side.\n\nI watched three cohorts do everything right. Courses, projects, networking. Still struggle. Started wondering if I was selling snake oil with a curriculum.\n\nI'm not saying don't learn. I'm saying... be suspicious of anyone who makes it sound simple. Including me.",
        emotion: 'conflicted',
        interaction: 'shake',
        variation_id: 'contradiction_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_contradict_success',
        text: "So what actually helped the students who did succeed?",
        archetype: 'ASK_FOR_DETAILS',
        nextNodeId: 'alex_students_success',
        pattern: 'analytical',
        skills: ['criticalThinking', 'adaptability'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      },
      {
        choiceId: 'alex_contradict_cares',
        text: "It sounds like you still care about teaching.",
        voiceVariations: {
          analytical: "You're still analyzing what went wrong. You still care.",
          helping: "The frustration is real. You still care about teaching.",
          building: "That anger has a purpose. You want to build something better.",
          exploring: "You're still asking questions. You still care.",
          patience: "You wouldn't be this honest if you'd stopped caring."
        },
        nextNodeId: 'alex_still_cares',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'alex',
          trustChange: 2
        }
      },
      {
        choiceId: 'alex_contradict_learning',
        text: "What are YOU learning right now?",
        voiceVariations: {
          analytical: "Enough about them. What are YOU learning right now?",
          helping: "What about you? What are you curious about?",
          building: "What are you building? What are you learning?",
          exploring: "Forget the students. What are YOU exploring?",
          patience: "Step back from the frustration. What are YOU learning?"
        },
        nextNodeId: 'alex_learning_now',
        pattern: 'exploring',
        skills: ['criticalThinking', 'creativity'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      },
      {
        choiceId: 'alex_contradict_build',
        text: "Forget what worked for others. What would you build if no one was watching?",
        archetype: 'EXPRESS_CURIOSITY',
        nextNodeId: 'alex_if_no_watching',
        pattern: 'building',
        skills: ['creativity', 'leadership'],
        consequence: {
          characterId: 'alex',
          trustChange: 2
        }
      },
      {
        choiceId: 'alex_contradict_time',
        text: "Sometimes figuring things out just takes longer. That's not failure.",
        archetype: 'ACKNOWLEDGE_EMOTION',
        nextNodeId: 'alex_takes_time',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'adaptability'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      }
    ],
    tags: ['alex_arc', 'pivotal']
  },

  // Scene 2 branch responses
  {
    nodeId: 'alex_students_success',
    speaker: 'Alex',
    content: [
      {
        text: "The ones who made it? They weren't the best coders.\n\nThey were the ones who could explain what they built and why it mattered.\n\nTechnical skills got them in the door. <bloom>Storytelling</bloom> got them the job.\n\nWeird, right? We spend all this time on syntax and none on \"why should anyone care?\"",
        emotion: 'reflective',
        interaction: 'nod',
        variation_id: 'success_v1',
        useChatPacing: true,
        patternReflection: [
          { pattern: 'analytical', minLevel: 4, altText: "The ones who made it? They weren't the best coders.\n\nThey were the ones who could explain what they built and why it mattered.\n\nYou're processing that. Good. Most people want the simple answer: 'learn X framework.' The real variable is human.", altEmotion: 'recognized' },
          { pattern: 'helping', minLevel: 4, altText: "The ones who made it? They weren't the best coders.\n\nThey were the ones who could connect. Tell stories. Make people care.\n\nYou already do that, don't you? The technical stuff is learnable. What you have isn't.", altEmotion: 'knowing' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'alex_success_to_breaking',
        text: "What made you realize that?",
        nextNodeId: 'alex_bootcamp_breaking_point',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'criticalThinking']
      }
    ],
    tags: ['alex_arc']
  },

  {
    nodeId: 'alex_still_cares',
    speaker: 'Alex',
    content: [
      {
        text: "...Maybe.\n\nIt's hard to watch people struggle when you know the game is rigged. When the advice is \"network more\" but nobody teaches networking. When \"soft skills\" get dismissed but they're what actually matter.\n\nI got tired of pretending I had answers I didn't have.",
        emotion: 'vulnerable',
        interaction: 'nod',
        variation_id: 'cares_v1',
        useChatPacing: true,
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "...Maybe.\n\nIt's hard to watch people struggle when you know the game is rigged.\n\nYou felt that, didn't you? The unfairness. You're not here to judge me. You want to understand. That's... rare.", altEmotion: 'connected' },
          { pattern: 'patience', minLevel: 4, altText: "...Maybe.\n\nIt's hard to watch people struggle. I got tired of pretending.\n\nYou're not rushing to fix me. That's... actually what I needed. Space to think.", altEmotion: 'grateful' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'alex_cares_to_breaking',
        text: "What was the moment you knew you had to stop?",
        nextNodeId: 'alex_bootcamp_breaking_point',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      }
    ],
    tags: ['alex_arc']
  },

  {
    nodeId: 'alex_learning_now',
    speaker: 'Alex',
    content: [
      {
        text: "What am I learning?\n\n...Okay, fine. I've been messing with local LLMs. Running models on my own machine. Not for a job or a side hustle.\n\nJust because I remembered what <bloom>curiosity</bloom> felt like before I had to monetize it.\n\nIt's dumb. It won't look good on a resume. But it's the first thing that's felt real in a while.",
        emotion: 'surprised_honest',
        interaction: 'bloom',
        variation_id: 'learning_v1',
        useChatPacing: true,
        patternReflection: [
          { pattern: 'exploring', minLevel: 4, altText: "What am I learning?\n\n...Okay, fine. Local LLMs. Running models on my own machine. No agenda.\n\nYou get it, don't you? Curiosity without a business plan. That question you asked. Most people don't even think to ask what others are exploring.", altEmotion: 'kindred' },
          { pattern: 'building', minLevel: 4, altText: "What am I learning?\n\nLocal LLMs. Running models. Building things nobody asked for.\n\nYou're a maker. You understand the itch. The thing that keeps you up at night even when there's no profit in it.", altEmotion: 'recognized' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'alex_learning_to_project',
        text: "Tell me more about what you're building.",
        nextNodeId: 'alex_llm_project_reveal',
        pattern: 'exploring',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      }
    ],
    tags: ['alex_arc']
  },

  {
    nodeId: 'alex_if_no_watching',
    speaker: 'Alex',
    content: [
      {
        text: "If no one was watching?\n\nI'd build a tool that helps people figure out what they actually want to learn. Not what LinkedIn says they should.\n\nSomething that asks questions instead of selling answers. Kind of the opposite of what I used to do.\n\nProbably wouldn't make any money.",
        emotion: 'dreaming',
        interaction: 'bloom',
        variation_id: 'no_watching_v1',
        useChatPacing: true,
        patternReflection: [
          { pattern: 'building', minLevel: 4, altText: "If no one was watching?\n\nI'd build a tool that helps people figure out what they actually want to learn.\n\nYou asked what I'd build. Not what I'd sell. That's... that's the right question. Most people skip straight to monetization.", altEmotion: 'hopeful' },
          { pattern: 'analytical', minLevel: 4, altText: "If no one was watching?\n\nA tool that asks questions instead of selling answers. Inverse of the current model.\n\nYou're analyzing the premise. Good. Most people hear 'build' and think features. You hear 'build' and think purpose.", altEmotion: 'recognized' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'alex_no_watching_to_project',
        text: "Have you started building it?",
        nextNodeId: 'alex_llm_project_reveal',
        pattern: 'building',
        skills: ['creativity', 'leadership'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      }
    ],
    tags: ['alex_arc'],
    metadata: {
      sessionBoundary: true  // Session 1: Introduction complete
    }
  },

  {
    nodeId: 'alex_takes_time',
    speaker: 'Alex',
    content: [
      {
        text: "You know how long it took me to admit the bootcamp thing wasn't working? Three years.\n\nThree years of telling myself \"next cohort will be different.\"\n\nSometimes the slow realization is the only honest one. The quick pivots, the \"fail fast\" mantras. Sometimes they're just avoiding the real question.",
        emotion: 'reflective',
        interaction: 'nod',
        variation_id: 'takes_time_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_time_to_breaking',
        text: "What was the real question?",
        nextNodeId: 'alex_bootcamp_breaking_point',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'criticalThinking']
      }
    ],
    tags: ['alex_arc']
  },

  // ============= EXPANSION: BOOTCAMP BACKSTORY =============
  {
    nodeId: 'alex_bootcamp_breaking_point',
    speaker: 'Alex',
    content: [
      {
        text: "Cohort 3. Final presentations.\n\nOne student. Brilliant kid, genuinely talented. Built this beautiful accessibility tool for blind coders. Screen reader integration, custom keyboard shortcuts, the whole thing.\n\nThey couldn't get past the resume screen. No CS degree. \"Insufficient experience.\" Meanwhile, another student who copy-pasted tutorial projects got three offers because they had \"Full-Stack Developer\" in the right font on LinkedIn.\n\nI realized I was teaching people to play a game I didn't understand and couldn't win.",
        emotion: 'haunted',
        interaction: 'shake',
        variation_id: 'breaking_v1',
        useChatPacing: true,
        interrupt: {
          duration: 3500,
          type: 'comfort',
          action: 'Put a hand on their shoulder',
          targetNodeId: 'alex_interrupt_comfort',
          consequence: {
            characterId: 'alex',
            trustChange: 2
          }
        }
      }
    ],
    choices: [
      {
        choiceId: 'alex_breaking_student',
        text: "What happened to the student with the accessibility tool?",
        nextNodeId: 'alex_student_failure_story',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'alex',
          trustChange: 2
        }
      },
      {
        choiceId: 'alex_breaking_game',
        text: "The game is broken. That's not on you.",
        nextNodeId: 'alex_moral_injury',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      }
    ],
    tags: ['alex_arc', 'backstory']
  },

  {
    nodeId: 'alex_student_failure_story',
    speaker: 'Alex',
    content: [
      {
        text: "Last I heard? Working retail. Still coding on weekends. Still applying.\n\nThey messaged me six months later. Should they do another bootcamp?\n\n\"Keep trying\" felt like a lie. \"Give up\" felt worse.\n\nSo I told them to take a break. Figure out what they actually wanted.",
        emotion: 'regretful',
        interaction: 'nod',
        variation_id: 'failure_story_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_student_to_hype',
        text: "Is it different now? With AI?",
        nextNodeId: 'alex_ai_hype_cycle',
        pattern: 'exploring',
        skills: ['criticalThinking', 'adaptability']
      }
    ],
    tags: ['alex_arc', 'backstory']
  },

  {
    nodeId: 'alex_moral_injury',
    speaker: 'Alex',
    content: [
      {
        text: "Maybe. But I was the one saying \"This will change your life.\"\n\nCharging them money. Promising outcomes I couldn't guarantee.\n\nYou ever hear \"moral injury\"? Complicit in something that violates your values.\n\nThat's what teaching bootcamps felt like.",
        emotion: 'vulnerable_angry',
        interaction: 'shake',
        variation_id: 'moral_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
            choiceId: 'alex_moral_to_hype',
            text: "So you left. And now?",
            nextNodeId: 'alex_ai_hype_cycle',
            pattern: 'patience',
            skills: ['emotionalIntelligence', 'adaptability'],
            consequence: {
              characterId: 'alex',
              trustChange: 1
            }
          }
        ],
        tags: ['alex_arc', 'backstory']
      },

      // ============= EXPANSION: CREDENTIAL TRAP DEEPENING =============
      {
        nodeId: 'alex_ai_hype_cycle',
        speaker: 'Alex',
        content: [
          {
            text: "Now I write documentation for AI tools and watch the exact same cycle.\n\n\"Learn prompt engineering!\" \"No wait, prompt engineering is dead!\" \"Actually, you need to understand transformers!\" \"Just use Claude/GPT/whatever's new this week!\"\n\nSame treadmill. New branding. Same people selling courses. Same people panicking they're falling behind.\n\nThe tools change every six months. The anxiety stays the same.",
            emotion: 'cynical_knowing',
            interaction: 'shake',
            variation_id: 'hype_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_hype_exhausting',
            text: "Doesn't that get exhausting? Constantly relearning?",
            nextNodeId: 'alex_hype_exhaustion_response',
            pattern: 'helping',
            skills: ['emotionalIntelligence', 'adaptability'],
            consequence: {
              characterId: 'alex',
              trustChange: 1
            }
          },
          {
            choiceId: 'alex_hype_leverage',
            text: "But someone has to understand the tools, right?",
            nextNodeId: 'alex_hype_leverage_response',
            pattern: 'analytical',
            skills: ['criticalThinking', 'adaptability']
          }
        ],
        tags: ['alex_arc', 'credential_critique']
      },

      // ============= DIVERGENT RESPONSES TO HYPE CYCLE =============
      {
        nodeId: 'alex_hype_exhaustion_response',
        speaker: 'Alex',
        content: [
          {
            text: "You're the first person to ask that. Everyone else just wants to know \"what should I learn next?\"\n\nYeah. It's exhausting. The constant feeling that whatever you know is about to be obsolete. That you're always one update behind.\n\nBut you asking that. Asking about the feeling, not the strategy. That's different.",
            emotion: 'surprised_vulnerable',
            variation_id: 'exhaustion_response_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'continue_to_treadmill_empathy',
            text: "[Continue]",
            nextNodeId: 'alex_learning_treadmill',
            pattern: 'patience'
          }
        ],
        tags: ['alex_arc', 'credential_critique']
      },

      {
        nodeId: 'alex_hype_leverage_response',
        speaker: 'Alex',
        content: [
          {
            text: "Logical. And you're not wrong.\n\nSomeone does need to understand the tools. The documentation I write? It matters. People rely on it.\n\nBut the question is whether \"someone\" has to be the same person forever. Or whether you can be the bridge without becoming the bridge's foundation.",
            emotion: 'thoughtful',
            variation_id: 'leverage_response_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'continue_to_treadmill_analytical',
            text: "[Continue]",
            nextNodeId: 'alex_learning_treadmill',
            pattern: 'patience'
          }
        ],
        tags: ['alex_arc', 'credential_critique']
      },

      {
        nodeId: 'alex_learning_treadmill',
        speaker: 'Alex',
        content: [
          {
            text: "Here's the thing nobody says out loud:\n\nYou can't keep up. The treadmill is designed so you can't keep up.\n\nBecause if you ever felt \"done,\" you'd stop buying courses. Stop clicking ads. Stop refreshing LinkedIn wondering if you're obsolete.\n\nThe system needs you anxious. Anxious people are profitable.\n\nI was selling that anxiety for three years. Now I'm writing docs for tools that perpetuate it.\n\n<bloom>But</bloom>. Here's where it gets interesting. I'm also finally learning stuff I actually care about again.",
            emotion: 'revealing',
            interaction: 'bloom',
            variation_id: 'treadmill_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_treadmill_care',
            text: "What are you learning that you care about?",
            nextNodeId: 'alex_llm_project_reveal',
            pattern: 'exploring',
            skills: ['emotionalIntelligence', 'communication']
          }
        ],
        tags: ['alex_arc', 'credential_critique'],
        metadata: {
          sessionBoundary: true  // Session 2: Deeper revelation
        }
      },

      // ============= EXPANSION: GENUINE LEARNING REDISCOVERY =============
      {
        nodeId: 'alex_llm_project_reveal',
        speaker: 'Alex',
        content: [
          {
            text: "I'm building a... I don't even know what to call it. A conversation tool? An anti-curriculum?\n\nIt asks you questions about what you're curious about. Not what job you want. Not what salary. Just. What makes you want to learn more?\n\nThen it helps you figure out <bloom>how you like to learn</bloom>. Not which course to buy. How your brain actually works.\n\nIt's messy. Unmonetizable. Probably nobody needs it. But it's the first thing I've built in years that feels honest.",
            emotion: 'vulnerable_proud',
            interaction: 'bloom',
            variation_id: 'project_v1',
            useChatPacing: true
          }
        ],
        simulation: {
          type: 'prompt_engineering',
          title: 'Learning Pattern Discovery',
          taskDescription: 'Alex\'s prototype needs a better opening prompt. The current version asks generic questions. Help refine it to uncover genuine curiosity patterns instead of career anxiety.',
          initialContext: {
            label: 'Current System Prompt (Draft v3)',
            content: "CURRENT PROMPT:\n\"What career do you want? What skills are you missing?\nLet me recommend courses to fill your gaps.\"\n\nPROBLEM: This triggers anxiety, not curiosity.\n\nGOAL: Redesign the opening to ask about:\n- What they explore when no one's watching\n- What problems they notice that others don't\n- What they'd build if monetization didn't matter\n\nReframe the AI from \"gap filler\" to \"pattern revealer\"",
            displayStyle: 'code'
          },
          successFeedback: '✓ PROMPT REFINED: New opening focuses on intrinsic curiosity, not extrinsic pressure. "What would you learn if no one was grading you?"'
        },
        choices: [
          {
            choiceId: 'alex_project_why',
            text: "Why does that feel different than the bootcamp?",
            nextNodeId: 'alex_curiosity_rekindled',
            pattern: 'analytical',
            skills: ['criticalThinking', 'emotionalIntelligence'],
            consequence: {
              characterId: 'alex',
              trustChange: 1
            }
          },
          {
            choiceId: 'alex_project_unmonetizable',
            text: "Maybe unmonetizable means you're onto something real.",
            nextNodeId: 'alex_curiosity_rekindled',
            pattern: 'building',
            skills: ['creativity', 'leadership'],
            consequence: {
              characterId: 'alex',
              trustChange: 2
            }
          }
        ],
        tags: ['alex_arc', 'transformation']
      },

      {
        nodeId: 'alex_curiosity_rekindled',
        speaker: 'Alex',
        content: [
          {
            text: "Because I'm not selling an outcome.\n\nBootcamps sell the promise: \"Do this, get that.\" Linear. Guaranteed. Except it's not.\n\nThis? This is just... exploration. Following curiosity. Asking questions nobody asked me to answer.\n\nI've been up till 2am three nights this week. Not because of a deadline. Not because someone's paying me.\n\nBecause I forgot what happened next in my own code and had to find out.\n\nThat's the feeling. That's what we should be chasing. Not certificates. <ripple>That.</ripple>",
            emotion: 'illuminated',
            interaction: 'bloom',
            variation_id: 'curiosity_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_curiosity_to_player',
            text: "How do I figure out what 'that' is for me?",
            nextNodeId: 'alex_player_learning_pattern',
            pattern: 'exploring',
            skills: ['adaptability', 'criticalThinking']
          }
        ],
        tags: ['alex_arc', 'transformation']
      },

      // ============= EXPANSION: PLAYER APPLICATION =============
      {
        nodeId: 'alex_player_learning_pattern',
        speaker: 'Alex',
        content: [
          {
            text: "Okay. Real talk. Forget what I taught at bootcamps. Forget the curriculum. Here's what actually matters:\n\nNotice what you do when nobody's watching.\n\nWhat Wikipedia rabbit holes do you fall into? What YouTube videos do you watch at 1am? What do you explain to people even when they didn't ask?\n\nThat's your pattern. That's the shape of your curiosity.\n\nMost people try to force themselves into \"marketable skills.\" But the people who actually break through? They find the overlap between what fascinates them and what's useful.\n\nYou've been making choices this whole conversation. What patterns are you seeing in yourself?",
            emotion: 'teaching_honest',
            interaction: 'nod',
            variation_id: 'player_pattern_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_pattern_analytical',
            text: "I like understanding how things work. Systems. Causes.",
            nextNodeId: 'alex_crossroads_moment',
            pattern: 'analytical',
            skills: ['criticalThinking', 'adaptability']
          },
          {
            choiceId: 'alex_pattern_helping',
            text: "I care about people. What helps them. What hurts them.",
            nextNodeId: 'alex_crossroads_moment',
            pattern: 'helping',
            skills: ['emotionalIntelligence', 'communication']
          },
          {
            choiceId: 'alex_pattern_exploring',
            text: "I'm always asking 'what if?' Connecting dots others miss.",
            nextNodeId: 'alex_crossroads_moment',
            pattern: 'exploring',
            skills: ['creativity', 'adaptability']
          },
          {
            choiceId: 'alex_pattern_building',
            text: "I want to make things. Ship things. See them exist in the world.",
            nextNodeId: 'alex_crossroads_moment',
            pattern: 'building',
            skills: ['creativity', 'leadership']
          },
          {
            choiceId: 'alex_pattern_patience',
            text: "I take my time. Let things develop. Notice what others rush past.",
            nextNodeId: 'alex_crossroads_moment',
            pattern: 'patience',
            skills: ['emotionalIntelligence', 'adaptability']
          }
        ],
        tags: ['alex_arc', 'player_reflection']
      },

      {
        nodeId: 'alex_crossroads_moment',
        speaker: 'Alex',
        content: [
          {
            text: "Yeah. I see it. The pattern is there.\n\nMost people never stop to notice it. They just keep chasing what they're \"supposed to\" learn.\n\nBut here's the crossroads:\n\nYou can use that pattern to chase credentials. Get really good at gaming the system, collecting the right keywords, playing the LinkedIn game.\n\nOr you can use it to chase genuine mastery. Following what actually fascinates you, even when it's not trending.\n\nBoth are valid. Both can work. But only one of them will still matter to you in five years.\n\nWhich one pulls you?",
            emotion: 'challenging',
            interaction: 'nod',
            variation_id: 'crossroads_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_crossroads_mastery',
            text: "I want the real thing. Even if it's harder.",
            nextNodeId: 'alex_final_synthesis',
            pattern: 'building',
            skills: ['leadership', 'adaptability'],
            consequence: {
              characterId: 'alex',
              trustChange: 2
            }
          },
          {
            choiceId: 'alex_crossroads_pragmatic',
            text: "I need to be practical. Bills don't pay themselves.",
            nextNodeId: 'alex_final_synthesis',
            pattern: 'analytical',
            skills: ['criticalThinking', 'adaptability'],
            consequence: {
              characterId: 'alex',
              trustChange: 1
            }
          },
          {
            choiceId: 'alex_crossroads_both',
            text: "Can it be both? Practical AND meaningful?",
            voiceVariations: {
              analytical: "False dichotomy. Can't practical and meaningful overlap?",
              helping: "What if they don't have to be separate? Practical AND meaningful?",
              building: "I want to build something that pays AND matters. Possible?",
              exploring: "What if I don't want to choose? Can it be both?",
              patience: "Maybe the answer isn't either/or. Maybe it's both."
            },
            nextNodeId: 'alex_final_synthesis',
            pattern: 'patience',
            skills: ['criticalThinking', 'emotionalIntelligence'],
            consequence: {
              characterId: 'alex',
              trustChange: 2
            }
          },
          // Career observation routes (ISP: Only visible when pattern combos are achieved)
          {
            choiceId: 'career_logistics',
            text: "The way you think about systems and building... reminds me of supply chain thinking.",
            nextNodeId: 'alex_career_reflection_logistics',
            pattern: 'building',
            skills: ['systemsThinking', 'problemSolving'],
            visibleCondition: {
              patterns: { analytical: { min: 4 }, building: { min: 5 } },
              lacksGlobalFlags: ['alex_mentioned_career']
            }
          },
          {
            choiceId: 'career_operations',
            text: "Your analytical patience... that's how operations analysts find hidden improvements.",
            nextNodeId: 'alex_career_reflection_operations',
            pattern: 'analytical',
            skills: ['criticalThinking', 'problemSolving'],
            visibleCondition: {
              patterns: { analytical: { min: 5 }, patience: { min: 4 } },
              lacksGlobalFlags: ['alex_mentioned_career']
            }
          }
        ],
        tags: ['alex_arc', 'pivotal', 'decision']
      },

      {
        nodeId: 'alex_final_synthesis',
        speaker: 'Alex',
        content: [
          {
            text: "Listen. The real answer is this:\n\nThe credentials will come if you get good at something that matters. But you only get good at things you can sustain caring about.\n\nI watched hundreds of students burn out chasing skills they didn't care about. The ones who made it? They found the thing they'd do for free and figured out how to get paid for it.\n\nThis whole station. It's not about finding the \"right path.\" It's about learning to recognize your own signal in all the noise.\n\nYou're doing that. Right now. Keep doing it.\n\nAnd be suspicious of anyone, <bloom>including me</bloom>, who makes it sound simple.",
            emotion: 'knowing_warm',
            interaction: 'bloom',
            variation_id: 'synthesis_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_synthesis_to_turn',
            text: "[Continue]",
            nextNodeId: 'alex_turn',
            pattern: 'exploring'
          }
        ],
        tags: ['alex_arc', 'synthesis'],
        metadata: {
          sessionBoundary: true  // Session 3: Transformation complete
        }
      },

      // ============= SCENE 3: THE TURN =============
      {
        nodeId: 'alex_turn',
        speaker: 'Alex',
        content: [
          {
            text: "Here's what I wish someone told me earlier:\n\nThe people who succeed aren't the ones who found the perfect course.\n\nThey're the ones who <bloom>stayed curious longer than they stayed scared</bloom>.\n\nThat sounds like fortune cookie garbage, I know. But watch. In five years, the tools will be completely different. The courses will be obsolete.\n\nBut the people who learned <ripple>how to learn</ripple>? They'll adapt again.",
            emotion: 'knowing',
            interaction: 'bloom',
            variation_id: 'turn_v1',
            useChatPacing: true
          }
        ],
        patternReflection: [
          {
            pattern: 'analytical',
            minLevel: 5,
            altText: "Here's what I wish someone told me earlier:\n\nThe people who succeed aren't the ones who found the perfect course.\n\nThey're the ones who could <bloom>explain their thinking</bloom>. Who could trace the \"why\" behind the \"what.\"\n\nYou're like that. You lead with evidence. That's rare. Just... don't let analysis become avoidance.",
            altEmotion: 'knowing_direct'
          },
          {
            pattern: 'helping',
            minLevel: 5,
            altText: "You know what?\n\nYou're good at this. <bloom>Seeing people</bloom>. Most folks here just want answers.\n\nYou asked how I was doing first. That's rare. That's also a skill no course teaches.\n\nJust... don't forget to look in the mirror sometimes.",
            altEmotion: 'knowing_warm'
          },
          {
            pattern: 'exploring',
            minLevel: 5,
            altText: "Here's the thing about curiosity:\n\nThe question is beautiful. But at some point, you have to <bloom>live inside an answer</bloom>.\n\nYou pull at threads others ignore. That's valuable. Just don't let the exploration become endless.",
            altEmotion: 'knowing_curious'
          },
          {
            pattern: 'building',
            minLevel: 5,
            altText: "You understand. You're a <bloom>builder</bloom> too.\n\nYou'd rather ship something imperfect than plan something perfect. That's how things actually get made.\n\nJust... make sure you're going somewhere you actually want to be. Speed without direction is just motion.",
            altEmotion: 'knowing_kindred'
          },
          {
            pattern: 'patience',
            minLevel: 5,
            altText: "You know what most people miss?\n\n<bloom>Not all progress is visible.</bloom> You understand that.\n\nSome things need time. Some things need you to stop waiting and act. The wisdom is knowing which is which.",
            altEmotion: 'knowing_patient'
          }
        ],
        choices: [
          {
            choiceId: 'alex_turn_practical',
            text: "Okay, but practically. What do I do tomorrow?",
            nextNodeId: 'alex_practical_advice',
            pattern: 'building',
            skills: ['adaptability', 'leadership']
          },
          {
            choiceId: 'alex_turn_fear',
            text: "What if I'm both curious AND scared?",
            nextNodeId: 'alex_fear_acknowledgment',
            pattern: 'helping',
            skills: ['emotionalIntelligence', 'adaptability']
          },
          {
            choiceId: 'alex_turn_balance',
            text: "How do I balance credentials and genuine learning?",
            nextNodeId: 'alex_credential_wisdom',
            pattern: 'analytical',
            skills: ['criticalThinking', 'adaptability']
          }
        ],
        tags: ['alex_arc', 'climax', 'revelation']
      },

      // ============= EXPANSION: PRACTICAL APPLICATION =============
      {
        nodeId: 'alex_practical_advice',
        speaker: 'Alex',
        content: [
          {
            text: "Tomorrow? Here's what I'd do if I were starting over:\n\n<bloom>One:</bloom> Pick something small you're actually curious about. Not \"marketable.\" Curious.\n\n<bloom>Two:</bloom> Build something with it. Doesn't matter if it's useful. Doesn't matter if it's been done. Build it anyway.\n\n<bloom>Three:</bloom> When you get stuck (and you will) resist the urge to buy a course. Struggle first. The struggle is where learning happens.\n\n<bloom>Four:</bloom> Share what you made. Not for likes. To practice explaining your thinking.\n\nThat's it. Repeat until you've built enough things you can see your own patterns. Then you'll know what to learn next.\n\nNo curriculum required.",
            emotion: 'direct_practical',
            interaction: 'nod',
            variation_id: 'practical_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_practical_to_platform',
            text: "Is that what Platform 8 teaches?",
            nextNodeId: 'alex_platform_8_meaning',
            pattern: 'exploring',
            skills: ['criticalThinking', 'communication']
          }
        ],
        tags: ['alex_arc', 'practical']
      },

      {
        nodeId: 'alex_fear_acknowledgment',
        speaker: 'Alex',
        content: [
          {
            text: "Both is the only honest answer.\n\nAnyone who says they're not scared is either lying or not paying attention.\n\nI'm scared right now. Scared this side project won't lead anywhere. Scared I wasted three years teaching bootcamps. Scared I'm wrong about all of this.\n\nBut here's the thing: the fear doesn't go away when you find the \"right path.\"\n\nThe fear goes away when you stop needing the path to be right and start being okay with figuring it out.\n\n<bloom>Curiosity is how you live with the fear.</bloom> Not how you eliminate it.",
            emotion: 'vulnerable_warm',
            interaction: 'bloom',
            variation_id: 'fear_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_fear_to_platform',
            text: "That's what this place is about, isn't it?",
            nextNodeId: 'alex_platform_8_meaning',
            pattern: 'exploring',
            skills: ['emotionalIntelligence', 'communication']
          }
        ],
        tags: ['alex_arc', 'emotional']
      },

      {
        nodeId: 'alex_credential_wisdom',
        speaker: 'Alex',
        content: [
          {
            text: "You don't have to choose between them. But know which one you're optimizing for at any moment.\n\nNeed a job next month? Get the credentials. Play the game. Do what you have to do.\n\nBut don't confuse survival strategy with actual learning.\n\nCredentials are signaling. Learning is substance.\n\nYou need both. Chase only signals, you end up hollow. Chase only substance, you might starve.\n\nThe wisdom is knowing when to do which.",
            emotion: 'balanced_wise',
            interaction: 'nod',
            variation_id: 'wisdom_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_wisdom_to_platform',
            text: "How does Platform 8 fit into all this?",
            nextNodeId: 'alex_platform_8_meaning',
            pattern: 'analytical',
            skills: ['criticalThinking', 'communication']
          }
        ],
        tags: ['alex_arc', 'wisdom']
      },

      {
        nodeId: 'alex_platform_8_meaning',
        speaker: 'Alex',
        content: [
          {
            text: "Platform 8. \"The Learning Loop.\"\n\nSamuel set it up as a mirror. See all the noise. The hype cycles. The anxiety. Decide whether you want to keep running.\n\nMost travelers panic and leave. They want me to tell them which course to take.\n\nBut you stayed. Asked different questions.\n\nThe loop is: Learn. Reflect. Choose. Repeat.\n\nYou're already doing it.",
            emotion: 'affirming_profound',
            interaction: 'bloom',
            variation_id: 'platform_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_platform_both',
            text: "Thank you. This helped.",
            nextNodeId: 'alex_closing_both',
            pattern: 'helping',
            skills: ['emotionalIntelligence', 'communication']
          },
          {
            choiceId: 'alex_platform_next',
            text: "What's next for you?",
            nextNodeId: 'alex_closing_next',
            pattern: 'exploring',
            skills: ['communication'],
            consequence: {
              characterId: 'alex',
              trustChange: 1
            }
          }
        ],
        tags: ['alex_arc', 'revelation', 'meta']
      },

      // ============= SCENE 4: THE REFRAME / CLOSING =============
      {
        nodeId: 'alex_closing_both',
        speaker: 'Alex',
        content: [
          {
            text: "Both is the honest answer.\n\nAnyone who says they're not scared is lying or not paying attention.\n\nThe question isn't how to stop being scared. It's whether you let fear make the decisions.\n\nYou're asking good questions. That's the whole game.",
            emotion: 'warm',
            interaction: 'nod',
            variation_id: 'closing_both_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_to_summary_both',
            text: "[Continue]",
            nextNodeId: 'alex_pattern_summary',
            pattern: 'patience'
          }
        ],
        tags: ['alex_arc']
      },

      {
        nodeId: 'alex_closing_enough',
        speaker: 'Alex',
        content: [
          {
            text: "You don't.\n\nThat's the trap. \"Enough\" is a moving target. Always another course, another skill, another gap.\n\nBetter question: what do you want to DO?\n\nStart there. Learn what you need. Ship something. Learn what you missed. Repeat.\n\nMessier than a certificate. But it's real.",
            emotion: 'direct',
            interaction: 'nod',
            variation_id: 'closing_enough_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_to_summary_enough',
            text: "[Continue]",
            nextNodeId: 'alex_pattern_summary',
            pattern: 'analytical'
          }
        ],
        tags: ['alex_arc']
      },

      {
        nodeId: 'alex_closing_next',
        speaker: 'Alex',
        content: [
          {
            text: "Honestly? I don't know.\n\nMaybe that's okay. Maybe I'm finally comfortable not having the syllabus figured out.\n\nDocumentation job pays the bills. Late-night LLM experiments feed the soul. For now, enough.\n\nAsk me in a year. Answer will probably be different.",
            emotion: 'peaceful',
            interaction: 'nod',
            variation_id: 'closing_next_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_to_summary_next',
            text: "[Continue]",
            nextNodeId: 'alex_pattern_summary',
            pattern: 'exploring'
          }
        ],
        tags: ['alex_arc']
      },

      // ============= SIMULATION: LOGISTICS PUZZLE =============
      {
        nodeId: 'alex_simulation_intro',
        speaker: 'Alex',
        content: [
          {
            text: "I've been documenting this logistics platform. Nonprofit sourcing supplies for Birmingham schools. They hit a wall.\n\nUsual supplier ghosted. 2,000 kids waiting, donor deadline in 72 hours, three alternative suppliers.\n\nThe \"obvious\" choice isn't obvious. Speed, cost, ethics. All pulling different directions.\n\nWant to help me think through this?",
            emotion: 'engaged',
            interaction: 'nod',
            variation_id: 'sim_intro_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_sim_dive_in',
            text: "Show me the options. Let's figure this out.",
            nextNodeId: 'alex_simulation_phase_1',
            pattern: 'analytical',
            skills: ['criticalThinking', 'problemSolving'],
            consequence: {
              characterId: 'alex',
              trustChange: 1
            }
          },
          {
            choiceId: 'alex_sim_why_care',
            text: "Why does this matter to you? It's not your project.",
            nextNodeId: 'alex_simulation_why_care',
            pattern: 'helping',
            skills: ['emotionalIntelligence'],
            consequence: {
              characterId: 'alex',
              trustChange: 1
            }
          }
        ],
        tags: ['alex_arc', 'simulation', 'logistics']
      },

      {
        nodeId: 'alex_simulation_why_care',
        speaker: 'Alex',
        content: [
          {
            text: "Because I used to be one of those kids.\n\nFree lunch. Hand-me-down textbooks. The year supply shipment got \"delayed\" we spent September writing on napkins.\n\nI'm supposed to document the interface, not solve their problems.\n\nBut when you see the pattern. When you know what delay means for real kids. Hard to look away.",
            emotion: 'vulnerable_determined',
            interaction: 'nod',
            variation_id: 'why_care_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_sim_to_phase_1',
            text: "Then let's not look away. Show me the suppliers.",
            nextNodeId: 'alex_simulation_phase_1',
            pattern: 'helping',
            skills: ['emotionalIntelligence'],
            consequence: {
              characterId: 'alex',
              trustChange: 2
            }
          }
        ],
        tags: ['alex_arc', 'simulation', 'backstory']
      },

      {
        nodeId: 'alex_simulation_phase_1',
        speaker: 'Alex',
        content: [
          {
            text: "Three options. None perfect.",
            emotion: 'focused',
            variation_id: 'phase_1_v1',
            useChatPacing: true
          }
        ],
        simulation: {
          type: 'dashboard_triage',
          title: 'Supply Chain Triage',
          taskDescription: 'The nonprofit needs 2,000 supply kits in 72 hours. Each supplier has tradeoffs. Your recommendation will affect real students.',
          initialContext: {
            label: 'Supplier Analysis Dashboard',
            content: "SUPPLIER A: FastShip Global\n--------------------------\nDelivery: 24 hours (FASTEST)\nCost: $18.50 / kit ($37,000 total)\nEthics Score: 2 / 10 (labor violations, overseas)\nQuality: Mixed reviews (15% defect rate)\n\nSUPPLIER B: Regional Educational Supply Co.\n--------------------------\nDelivery: 48 hours\nCost: $22.00 / kit ($44,000 total)\nEthics Score: 7 / 10 (domestic, union workers)\nQuality: Solid (3% defect rate)\n\nSUPPLIER C: Community-First Cooperative\n--------------------------\nDelivery: 72 hours (TIGHT)\nCost: $24.50 / kit ($49,000 total)\nEthics Score: 10 / 10 (local, living wage, minority-owned)\nQuality: Excellent (1% defect rate)\n\nBUDGET: $45,000 | DEADLINE: 72 hours",
            displayStyle: 'code'
          },
          successFeedback: 'ANALYSIS COMPLETE: Tradeoffs mapped. Decision framework established.'
        },
        choices: [
          {
            choiceId: 'alex_sim_supplier_a',
            text: "Supplier A. Speed is everything. Kids can't wait.",
            nextNodeId: 'alex_simulation_phase_2_speed',
            pattern: 'building',
            skills: ['problemSolving']
          },
          {
            choiceId: 'alex_sim_supplier_b',
            text: "Supplier B. Balance of speed, cost, and ethics.",
            nextNodeId: 'alex_simulation_phase_2_balance',
            pattern: 'analytical',
            skills: ['criticalThinking', 'systemsThinking']
          },
          {
            choiceId: 'alex_sim_supplier_c',
            text: "Supplier C. Ethics matter, even if it's tight on time.",
            nextNodeId: 'alex_simulation_phase_2_ethics',
            pattern: 'helping',
            skills: ['emotionalIntelligence', 'leadership']
          },
          {
            choiceId: 'alex_sim_hybrid',
            text: "Wait. Can we split the order? Hybrid approach?",
            nextNodeId: 'alex_simulation_phase_2_hybrid',
            pattern: 'exploring',
            skills: ['creativity', 'systemsThinking'],
            consequence: {
              characterId: 'alex',
              trustChange: 1
            }
          }
        ],
        tags: ['alex_arc', 'simulation', 'decision_point']
      },

      // Phase 2 branches based on first decision
      {
        nodeId: 'alex_simulation_phase_2_speed',
        speaker: 'Alex',
        content: [
          {
            text: "FastShip. Okay. But here's the complication.\n\nThey got flagged six months ago for child labor in their overseas facilities. The nonprofit's donor (a local church group) specifically asked about ethical sourcing in their grant application.\n\nIf this gets traced back... the nonprofit could lose future funding.\n\nSpeed now, or sustainability later? That's the real question.",
            emotion: 'conflicted',
            variation_id: 'speed_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_speed_anyway',
            text: "Kids need supplies NOW. Deal with reputation later.",
            nextNodeId: 'alex_simulation_fail',
            pattern: 'building',
            skills: ['problemSolving']
          },
          {
            choiceId: 'alex_speed_reconsider',
            text: "You're right. Let me reconsider the options.",
            nextNodeId: 'alex_simulation_phase_1',
            pattern: 'patience',
            skills: ['adaptability']
          }
        ],
        tags: ['alex_arc', 'simulation']
      },

      {
        nodeId: 'alex_simulation_phase_2_balance',
        speaker: 'Alex',
        content: [
          {
            text: "Regional Supply. Middle path. But there's a catch.\n\n$44,000 is $1,000 under budget. But minimum order for 48-hour delivery is 2,500 kits. 500 extra.\n\nExtras could go to the overflow waitlist. Or negotiate smaller order, bumping delivery to 60 hours.\n\nMore kids, or guaranteed timeline?",
            emotion: 'thoughtful',
            variation_id: 'balance_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_balance_overflow',
            text: "Order 2,500. Those waitlist kids deserve supplies too.",
            nextNodeId: 'alex_simulation_success',
            pattern: 'helping',
            skills: ['emotionalIntelligence', 'systemsThinking'],
            consequence: {
              characterId: 'alex',
              trustChange: 2
            }
          },
          {
            choiceId: 'alex_balance_negotiate',
            text: "Negotiate down. Stick to the original scope.",
            nextNodeId: 'alex_simulation_success_modest',
            pattern: 'analytical',
            skills: ['communication']
          }
        ],
        tags: ['alex_arc', 'simulation']
      },

      {
        nodeId: 'alex_simulation_phase_2_ethics',
        speaker: 'Alex',
        content: [
          {
            text: "Community-First. The \"right\" choice. 72 hours means zero margin.\n\nWarehouse in Bessemer. 20 minutes from schools. Volunteers for same-day distribution bypass the shipping delay.\n\nA gamble. But if it works: quality, ethics, AND local impact.\n\nDo you trust people to show up?",
            emotion: 'hopeful',
            variation_id: 'ethics_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_ethics_trust',
            text: "Yes. People show up for their community. Make the call.",
            nextNodeId: 'alex_simulation_success',
            pattern: 'helping',
            skills: ['leadership', 'communication'],
            consequence: {
              characterId: 'alex',
              trustChange: 2
            }
          },
          {
            choiceId: 'alex_ethics_backup',
            text: "Trust, but verify. Have Supplier B on standby.",
            nextNodeId: 'alex_simulation_success',
            pattern: 'patience',
            skills: ['systemsThinking', 'adaptability'],
            consequence: {
              characterId: 'alex',
              trustChange: 1
            }
          }
        ],
        tags: ['alex_arc', 'simulation']
      },

      {
        nodeId: 'alex_simulation_phase_2_hybrid',
        speaker: 'Alex',
        content: [
          {
            text: "Hybrid. I didn't think of that.\n\nSplit it: 1,000 kits from Community-First for Bessemer schools, 1,000 from Regional for the rest.\n\n$46,500 total. $1,500 over. But church group could cover as \"local impact bonus.\"\n\nSpeed, ethics, two suppliers. Systems thinking.",
            emotion: 'impressed',
            variation_id: 'hybrid_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_hybrid_pitch',
            text: "Let's pitch it. Write up the proposal.",
            nextNodeId: 'alex_simulation_success',
            pattern: 'building',
            skills: ['communication', 'leadership'],
            consequence: {
              characterId: 'alex',
              trustChange: 3
            }
          },
          {
            choiceId: 'alex_hybrid_risky',
            text: "Elegant but risky. What if the donor says no?",
            nextNodeId: 'alex_simulation_success_modest',
            pattern: 'patience',
            skills: ['criticalThinking']
          }
        ],
        tags: ['alex_arc', 'simulation', 'creative_solution']
      },

      // Success outcomes
      {
        nodeId: 'alex_simulation_success',
        speaker: 'Alex',
        onEnter: [
          {
            characterId: 'alex',
            addKnowledgeFlags: ['alex_logistics_solved', 'alex_simulation_phase1_complete'],
            addGlobalFlags: ['golden_prompt_logistics']
          }
        ],
        content: [
          {
            text: "We did it. Order's in. Volunteers mobilizing. Donor agreed.\n\nThis wasn't my job. I document software, not logistics.\n\nBut this is what learning looks like. Real problems, real stakes.\n\nCuriosity did what bootcamp never taught. Thanks for asking the right questions.",
            emotion: 'grateful_illuminated',
            interaction: 'bloom',
            variation_id: 'success_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_success_to_turn',
            text: "The best learning happens when it matters.",
            nextNodeId: 'alex_turn',
            pattern: 'exploring',
            skills: ['communication'],
            consequence: {
              characterId: 'alex',
              trustChange: 1
            }
          }
        ],
        tags: ['alex_arc', 'simulation', 'resolution']
      },

      {
        nodeId: 'alex_simulation_success_modest',
        speaker: 'Alex',
        onEnter: [
          {
            characterId: 'alex',
            addKnowledgeFlags: ['alex_logistics_completed', 'alex_simulation_phase1_complete']
          }
        ],
        content: [
          {
            text: "Done. Maybe not perfect, but working.\n\n2,000 kids get supplies. Deadline met. Sometimes \"good enough\" is actually good.\n\nI'll remember the hybrid idea. Creative solutions need runway.\n\nThanks for thinking through this.",
            emotion: 'peaceful',
            interaction: 'nod',
            variation_id: 'modest_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_modest_to_turn',
            text: "Progress over perfection. That's wisdom.",
            nextNodeId: 'alex_turn',
            pattern: 'patience',
            skills: ['adaptability']
          }
        ],
        tags: ['alex_arc', 'simulation', 'resolution']
      },

      // Failure outcome
      {
        nodeId: 'alex_simulation_fail',
        speaker: 'Alex',
        content: [
          {
            text: "Order placed. FastShip confirmed.\n\nThree weeks later, story broke. \"Nonprofit Linked to Labor Violation Supplier.\" Church group pulled funding.\n\nKids got supplies. Program might not survive.\n\n\"Ship fast, fix later.\" Except sometimes there is no later.",
            emotion: 'regretful',
            interaction: 'shake',
            variation_id: 'fail_v1',
            useChatPacing: true,
            richEffectContext: 'warning'
          }
        ],
        choices: [
          {
            choiceId: 'alex_fail_retry',
            text: "Hindsight. Want to walk through it again?",
            nextNodeId: 'alex_simulation_intro',
            pattern: 'patience',
            skills: ['emotionalIntelligence']
          },
          {
            choiceId: 'alex_fail_accept',
            text: "Hard lesson. At least kids had supplies this year.",
            nextNodeId: 'alex_turn',
            pattern: 'helping',
            skills: ['emotionalIntelligence']
          }
        ],
        tags: ['alex_arc', 'simulation', 'failure']
      },

      // ============= INTERRUPT TARGET NODES =============
      {
        nodeId: 'alex_interrupt_comfort',
        speaker: 'Alex',
        content: [
          {
            text: "Sorry. Nobody asks about them. The students. Everyone talks \"outcomes\" and \"placement rates.\"\n\nJamie messaged me last year. \"Still trying.\" Still applying. Still hoping.\n\nI couldn't respond. What do you say?\n\nThank you. For not trying to fix it.",
            emotion: 'vulnerable_grateful',
            interaction: 'bloom',
            variation_id: 'interrupt_comfort_v1',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_from_interrupt',
            text: "Some things can't be fixed. Only witnessed.",
            nextNodeId: 'alex_ai_hype_cycle',
            pattern: 'patience',
            skills: ['emotionalIntelligence'],
            consequence: {
              characterId: 'alex',
              trustChange: 1
            }
          }
        ],
        tags: ['alex_arc', 'interrupt_response']
      },

      // ============= VULNERABILITY ARC (Trust ≥ 6) =============
      {
        nodeId: 'alex_vulnerability_arc',
        speaker: 'Alex',
        requiredState: {
          trust: { min: 6 }
        },
        onEnter: [
          {
            characterId: 'alex',
            addKnowledgeFlags: ['alex_vulnerability_revealed', 'knows_about_maria']
          }
        ],
        content: [
          {
            text: "I've never told anyone this.\n\nMaria. Single mom. Cashed out 401k for bootcamp. I told her she was doing the right thing.\n\nSix months after graduation. Zero callbacks. Moved back with parents. Gave up on tech.\n\nHer last message: \"You made it sound so possible.\"\n\nI did. Because I needed to believe it.",
            emotion: 'haunted_guilty',
            variation_id: 'vulnerability_v1',
            richEffectContext: 'warning',
            useChatPacing: true
          }
        ],
        choices: [
          {
            choiceId: 'alex_vuln_not_your_fault',
            text: "You gave her tools. The system failed her, not you.",
            nextNodeId: 'alex_vulnerability_response',
            pattern: 'helping',
            skills: ['emotionalIntelligence'],
            consequence: {
              characterId: 'alex',
              trustChange: 1
            }
          },
          {
            choiceId: 'alex_vuln_feel_guilty',
            text: "You feel responsible.",
            nextNodeId: 'alex_vulnerability_response',
            pattern: 'patience',
            skills: ['emotionalIntelligence'],
            consequence: {
              characterId: 'alex',
              trustChange: 2
            }
          },
          {
            choiceId: 'alex_vuln_silence',
            text: "[Let the confession breathe.]",
            archetype: 'STAY_SILENT',
            nextNodeId: 'alex_vulnerability_response',
            pattern: 'patience',
            skills: ['emotionalIntelligence'],
            consequence: {
              characterId: 'alex',
              trustChange: 2
            }
          }
        ],
        tags: ['alex_arc', 'vulnerability', 'emotional_core']
      },

      {
        nodeId: 'alex_vulnerability_response',
        speaker: 'Alex',
        content: [
          {
            text: "Yeah. I do.\n\nNot because I lied. I believed it. But believing isn't knowing.\n\nThat's why I do this now. Documentation. Skepticism. Making sure nobody makes it sound simpler than it is.\n\n\"Learn to learn. Question everything.\"\n\nIncluding me.",
            emotion: 'resolved_honest',
            interaction: 'nod',
            variation_id: 'vulnerability_response_v1',
            useChatPacing: true
          }
        ],
        choices: [
            {
              choiceId: 'alex_vuln_to_turn',
              text: "That's not selling. That's teaching.",
              nextNodeId: 'alex_turn',
              pattern: 'helping',
              skills: ['communication'],
              consequence: {
                characterId: 'alex',
                trustChange: 1
              }
            }
          ],
          tags: ['alex_arc', 'vulnerability', 'resolution']
        },

        // ============= PATTERN SUMMARY =============
        {
          nodeId: 'alex_pattern_summary',
          speaker: 'Alex',
          onEnter: [
            {
              addGlobalFlags: ['alex_arc_complete'],
              characterId: 'alex',
              setRelationshipStatus: 'acquaintance',
              thoughtId: 'curious-wanderer'
            }
          ],
          content: [
            {
              text: "Thanks for listening. Most people just want the shortcut and leave.\n\nYou're different.\n\nGo on. Samuel's probably wondering where you wandered off to. Platform 8 says hi.\n\nThe people who figure it out aren't the ones with most certificates. They're the ones who kept showing up.",
              emotion: 'affirming',
              interaction: 'bloom',
              variation_id: 'summary_v1',
              useChatPacing: true
            }
          ],
          choices: [
            {
              choiceId: 'return_to_samuel_from_alex',
              text: "Return to Samuel",
              nextNodeId: samuelEntryPoints.ALEX_REFLECTION_GATEWAY,
              pattern: 'exploring'
            }
          ],
          tags: ['alex_arc', 'arc_complete']
        },

        // ============= CAREER MENTION NODES (Invisible Depth) =============
        {
          nodeId: 'alex_career_reflection_logistics',
          speaker: 'Alex',
          requiredState: {
            patterns: {
              analytical: { min: 4 },
              building: { min: 5 }
            }
          },
          onEnter: [
            {
              characterId: 'alex',
              addGlobalFlags: ['combo_logistics_master_achieved', 'alex_mentioned_career']
            }
          ],
          content: [
            {
              text: "You think in systems. Analytical and constructive.\n\nSupply chain managers work like that. Orchestrators of movement. Making sure everything arrives where it needs to be.\n\nIn a world where everything connects, that thinking is gold.",
              emotion: 'appreciative',
              variation_id: 'career_logistics_v1'
            }
          ],
          choices: [
            {
              choiceId: 'alex_career_logistics_continue',
              text: "Making sure things work together. I like that.",
              nextNodeId: 'alex_crossroads_moment',
              pattern: 'building'
            }
          ],
          tags: ['career_mention', 'invisible_depth', 'operations']
        },

        {
          nodeId: 'alex_career_reflection_operations',
          speaker: 'Alex',
          requiredState: {
            patterns: {
              analytical: { min: 5 },
              patience: { min: 4 }
            }
          },
          onEnter: [
            {
              characterId: 'alex',
              addGlobalFlags: ['combo_operations_optimizer_achieved', 'alex_mentioned_career']
            }
          ],
          content: [
            {
              text: "You've got this way of analyzing things. Patient, thorough. Finding the patterns.\n\nOperations analysts do that. Efficiency experts who see what others miss. Finding the hidden improvements.\n\nThat combination of analysis and patience? Rare and valuable.",
              emotion: 'impressed',
              variation_id: 'career_operations_v1'
            }
          ],
          choices: [
            {
              choiceId: 'alex_career_operations_continue',
              text: "Finding hidden improvements. That sounds right.",
              nextNodeId: 'alex_crossroads_moment',
              pattern: 'analytical'
            }
          ],
          tags: ['career_mention', 'invisible_depth', 'operations']
        }
      ];

export const alexEntryPoints = {
  INTRODUCTION: 'alex_introduction',
  SIMULATION: 'alex_simulation_intro'
} as const

export const alexDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(alexDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: alexEntryPoints.INTRODUCTION,
  metadata: {
    title: "The Credential Paradox",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: alexDialogueNodes.length,
    totalChoices: alexDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}
