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
import { buildDialogueNodesMap, filterDraftNodes } from './drafts/draft-filter'

export const alexDialogueNodes: DialogueNode[] = [
  // ============= SCENE 1: THE DISMISSAL =============
  {
    nodeId: 'alex_introduction',
    speaker: 'Alex',
    content: [
      {
        text: "D'you bring it?",
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
        text: "[Pattern Recognition] You mapped more than air ducts. You mapped how information moves.",
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
        text: "Yeah.",
        emotion: 'surprised_vulnerable',
        interaction: 'nod',
        variation_id: 'response_helping_v1',
        useChatPacing: true,
        voiceVariations: {
          analytical: "Yeah. Maybe.\n\n...Sorry. That was my default response algorithm. Pattern recognition failure.\n\nI'm Alex. Former bootcamp instructor. Now documentation writer.\n\nYou're the first person to query my state instead of my data.",
          helping: "Yeah. Maybe.\n\n...Sorry. That was my old instructor voice. The one that says 'I'm fine' automatically.\n\nI'm Alex. I used to help people learn. Now I write docs for tools I'm not sure help anyone.\n\nYou're the first person to actually care how I'm doing.",
          building: "Yeah. Maybe.\n\n...Sorry. That was my old instructor framework. Built to project confidence.\n\nI'm Alex. Used to construct learning experiences. Now I write documentation for tools I don't believe in.\n\nYou're the first person to check my foundation instead of my output.",
          exploring: "Yeah. Maybe.\n\n...Sorry. That was my old instructor path. The territory I know by memory.\n\nI'm Alex. Used to guide people through bootcamps. Now I map documentation for tools that feel aimless.\n\nYou're the first person to explore how I'm doing instead of what I'm doing.",
          patience: "Yeah. Maybe.\n\n...Sorry. That was my old instructor reflex. Years of trained responses.\n\nI'm Alex. Used to teach bootcamps. Now I write documentation and wonder if any of it matters.\n\nYou're the first person to wait and ask how I am. Not what I know."
        }
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
        text: "Worth it for who?",
        emotion: 'frustrated',
        interaction: 'shake',
        variation_id: 'response_analytical_v1',
        useChatPacing: true,
        voiceVariations: {
          analytical: "Worth it for who? Optimize which variable?\n\nI'm Alex. Former bootcamp instructor. Now documentation writer for AI tools.\n\nYou want ROI analysis? Three cohorts. All followed the optimal path. Courses, projects, networking. Most struggled. The ones who succeeded? Didn't have the highest test scores.",
          helping: "Worth it for who? The person stressed about keeping up? Or the platform profiting from that stress?\n\nI'm Alex. Used to teach bootcamps. Watched people exhaust themselves.\n\nYou want honesty? Three cohorts did everything \"right.\" Still struggled. The ones who succeeded? Weren't trying to help everyone. Just focused on their own path.",
          building: "Worth it for who? The company building the course? Or you trying to build a career?\n\nI'm Alex. Former bootcamp instructor. Now I document tools I didn't help create.\n\nYou want real data? Three cohorts built portfolios, networked, did everything right. Most struggled. The ones who succeeded? Didn't build the most projects.",
          exploring: "Worth it for who? The explorer or the map-maker profiting from confusion?\n\nI'm Alex. Used to guide people through bootcamps. Now I document AI tools nobody asked for.\n\nYou want truth? Three cohorts explored every path. Courses, projects, networking. Most got lost. The ones who succeeded? Weren't the best at exploring everything.",
          patience: "Worth it for who? The person waiting to be ready? Or the system profiting from \"one more course\"?\n\nI'm Alex. Former bootcamp instructor. Watched people wait for readiness that never came.\n\nYou want reality? Three cohorts took their time, did everything right. Most struggled anyway. The ones who succeeded? Didn't wait to be perfect coders."
        }
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
        text: "\"Ready.",
        emotion: 'reflective',
        interaction: 'nod',
        variation_id: 'response_exploring_v1',
        useChatPacing: true,
        voiceVariations: {
          analytical: "\"Ready.\" The halting problem.\n\nOne more course. One more certificate. Then you'll reach the termination condition.\n\nExcept the loop is infinite. The condition never resolves.\n\nI'm Alex. I taught that algorithm for three years. Now I document AI tools and question the entire function.",
          helping: "\"Ready.\" The cruelest word.\n\nOne more course. One more certificate. Then you'll finally help yourself. Feel worthy.\n\nExcept you never do. The goalpost moves every time you reach it.\n\nI'm Alex. I sold that lie for three years. Now I write docs for AI tools and wonder if I'm helping anyone.",
          building: "\"Ready.\" The foundation fallacy.\n\nOne more course. One more certificate. Then your base will be solid enough to build.\n\nExcept it never is. You keep reinforcing instead of constructing.\n\nI'm Alex. I taught that trap for three years. Now I document AI tools and wonder what I'm really building.",
          exploring: "\"Ready.\" The infinite map.\n\nOne more course. One more certificate. One more territory to chart. Then you'll know enough to start.\n\nExcept there's always another region. The map never completes.\n\nI'm Alex. I guided people into that maze for three years. Now I write docs for AI tools and wonder if we're all just lost.",
          patience: "\"Ready.\" The eternal waiting.\n\nOne more course. One more certificate. Just a bit more time. Then you'll be ready.\n\nExcept \"ready\" never arrives. The waiting becomes permanent.\n\nI'm Alex. I taught people to wait for three years. Now I document AI tools and wonder if the moment to start ever comes."
        }
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
        text: "Direction over credentials. That's.",
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
        text: "You can see that?",
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
        text: "Okay.",
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
        text: "Here's the contradiction: people saying \" build projects\" often got hired through connections, and.",
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
        text: "Maybe.",
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
        text: "If no one was watching?",
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
        text: "how long it took me to admit the bootcamp thing wasn't working?",
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
        text: "Final presentations broke me.\n\nA brilliant accessibility project got filtered out for lacking credentials, while tutorial clones got offers with better branding.\n\nI realized I was teaching people to play a game built against them.",
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
        text: "Last I heard?",
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
        text: ".",
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
        text: "Now I write documentation for AI tools and watch the exact same cycle. \"Learn prompt engineering!",
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
        text: "You're the first person to ask that.",
        emotion: 'surprised_vulnerable',
        variation_id: 'exhaustion_response_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_treadmill_empathy',
        text: "Ask what he learned.",
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
        text: "Logical.",
        emotion: 'thoughtful',
        variation_id: 'leverage_response_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'continue_to_treadmill_analytical',
        text: "Press the deeper point.",
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
        text: "The treadmill is designed to keep you anxious and buying. Break it by choosing a learning path you actually care about.",
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
        text: "I'm building an anti-curriculum.\n\nIt starts with real curiosity, not job titles, then maps <bloom>how you learn</bloom> instead of what course to buy.\n\nIt's messy and maybe unmonetizable, but it's the first thing I've built in years that feels honest.",
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
        text: "Because I'm not selling an outcome anymore.\n\nBootcamps sold linear promises, but this is curiosity-driven exploration, and I've stayed up late chasing questions with no deadline or payout.\n\nThat's the feeling we should chase, not certificates. <ripple>That.</ripple>",
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
        text: "Your pattern is already visible in your choices. Follow that signal instead of chasing generic advice.",
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
        text: "Crossroads: chase optics or chase mastery. Both can work short-term, only one compounds into a life you respect.",
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
        text: "Real answer:\n\nCredentials follow once you get good at work you can keep caring about.\n\nI watched students burn out chasing marketable skills they hated. The ones who lasted followed curiosity and built proof.\n\nThis station isn't about perfect paths. It's about finding signal in noise.\n\nYou're doing that now.\n\nDistrust anyone, <bloom>including me</bloom>, who makes it sound easy.",
        emotion: 'knowing_warm',
        interaction: 'bloom',
        variation_id: 'synthesis_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_synthesis_to_turn',
        text: "Hear his final turn.",
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
        text: "Here's what I wish someone told me earlier:\n\nWinners aren't people who found the perfect course.\n\nThey're people who <bloom>stayed curious longer than they stayed scared</bloom>.\n\nIn five years, the tools will change and most courses will be obsolete.\n\nPeople who learned <ripple>how to learn</ripple> adapt again.",
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
        text: "If I were restarting tomorrow:\n\n<bloom>One:</bloom> pick a small problem you actually care about.\n\n<bloom>Two:</bloom> build something, even rough.\n\n<bloom>Three:</bloom> when stuck, struggle before buying another course.\n\n<bloom>Four:</bloom> share what you made and explain your choices.\n\nRepeat until your own learning pattern becomes obvious.\n\nThen choose the next skill with evidence, not panic.\n\nNo grand curriculum required.",
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
        text: "Both is the honest answer.\n\nAnyone claiming zero fear is lying or numb.\n\nI'm scared too: scared this pivot fails, scared I burned years teaching the wrong thing, scared I'm wrong again.\n\nFear doesn't vanish when you find a perfect path.\n\nIt shrinks when you stop demanding certainty and keep learning anyway.\n\n<bloom>Curiosity doesn't erase fear; it makes it livable.</bloom>",
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
        text: "Credentials can open doors, but they cannot replace judgment, story, and persistence. Use them as tools, not identity.",
        emotion: 'balanced_wise',
        interaction: 'nod',
        variation_id: 'wisdom_v1',
        useChatPacing: true,
        skillReflection: [
          { skill: 'strategicThinking', minLevel: 5, altText: "You don't have to choose between them. You think strategically—I can tell.\n\nCredentials are signaling. Learning is substance. You already know that every choice is context-dependent.\n\nNeed a job next month? Optimize for credentials. Building long-term? Optimize for learning. Your strategic mind already gets this. Apply it.", altEmotion: 'knowing' },
          { skill: 'adaptability', minLevel: 5, altText: "You don't have to choose between them. You adapt well—I've noticed.\n\nCredentials are signaling. Learning is substance. Most people lock into one strategy.\n\nYour adaptability lets you switch between optimization modes. Need survival? Credentials. Need growth? Learning. The flexibility itself is your advantage.", altEmotion: 'appreciative' }
        ],
        patternReflection: [
          { pattern: 'analytical', minLevel: 4, altText: "You analyze systems. So analyze this optimization problem.\n\nCredentials are signaling. Learning is substance. You need both variables.\n\nNeed a job next month? Optimize for credentials. Play the game. But don't confuse survival strategy with actual learning.\n\nChase only signals, you end up hollow. Chase only substance, you might starve. The wisdom is knowing which optimization function to run when.", altEmotion: 'teaching_wise' },
          { pattern: 'building', minLevel: 4, altText: "You're a builder. So understand what you're building on.\n\nCredentials are signaling. Learning is substance. You need both to build a career.\n\nNeed a job? Get credentials. Build the resume. But don't confuse survival construction with actual foundation.\n\nChase only signals, you build on sand. Chase only substance, you might never get funded. Wisdom is knowing when to build which layer.", altEmotion: 'balanced_wise' },
          { pattern: 'patience', minLevel: 4, altText: "You're patient. That patience serves you here.\n\nCredentials are signaling. Learning is substance. Most people rush toward one.\n\nNeed a job next month? Get credentials quickly. Do what you must. But patiently, separately, pursue actual learning.\n\nChase only quick signals, you end hollow. Chase only slow substance, you might starve. Your patience lets you do both—just not simultaneously.", altEmotion: 'wise_calm' }
        ]
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
        text: "Platform 8. \"The Learning Loop.",
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
        text: "Both is the honest answer.",
        emotion: 'warm',
        interaction: 'nod',
        variation_id: 'closing_both_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_to_summary_both',
        text: "Summarize the pattern.",
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
        text: "Close with the takeaway.",
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
        text: "Honestly?",
        emotion: 'peaceful',
        interaction: 'nod',
        variation_id: 'closing_next_v1',
        useChatPacing: true
      }
    ],
    choices: [
      {
        choiceId: 'alex_to_summary_next',
        text: "Summarize the pattern.",
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
        text: "I've been documenting this logistics platform.",
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
        text: "Because I used to be one of those kids. Free lunch.",
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
        text: "FastShip. Okay.",
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
        text: "Regional Supply.",
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
        text: "Community-First.",
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
        text: "Hybrid.",
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
          trustChange: 2
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
        text: "We did it.",
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
        text: "Done. Maybe not perfect, but working.",
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
        text: "Order placed.",
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
        text: "Sorry.",
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
        useChatPacing: true,
        patternReflection: [
          {
            pattern: 'analytical',
            minLevel: 5,
            altText: "You think in systems. You'd understand this.\n\nMaria. Single mom. Cashed out 401k for bootcamp. The data said it was a safe bet - 87% placement rate, we told her.\n\nSix months later: zero callbacks. The statistics didn't account for ageism, childcare conflicts, networking gaps.\n\nHer last message: \"The numbers made it sound so certain.\"\n\nThey did. Because I believed the data without questioning what it was measuring.",
            altEmotion: 'analytical_guilt'
          },
          {
            pattern: 'helping',
            minLevel: 5,
            altText: "You care about people. That's why I'm telling you this.\n\nMaria. Single mom. Cashed out 401k for bootcamp. I told her she was doing the right thing - because I wanted to help her change her life.\n\nSix months after graduation. Zero callbacks. Moved back with parents. Gave up on tech.\n\nHer last message: \"You made it sound so possible.\"\n\nI did. Because I thought helping meant being optimistic. I was wrong.",
            altEmotion: 'caring_guilt'
          },
          {
            pattern: 'building',
            minLevel: 5,
            altText: "You build things. You understand investment.\n\nMaria. Single mom. Cashed out 401k - her entire foundation - for bootcamp. I told her she was building toward something real.\n\nSix months later. Zero callbacks. Everything she'd built toward... collapsed.\n\nHer last message: \"You made it sound like solid ground.\"\n\nI did. Because I'd built my career on that ground. Didn't realize it wasn't stable for everyone.",
            altEmotion: 'builder_guilt'
          },
          {
            pattern: 'patience',
            minLevel: 5,
            altText: "You wait. You don't rush. I didn't give Maria that.\n\nSingle mom. Cashed out 401k for bootcamp. I told her the fast track was possible - six months to a new career.\n\nSix months after graduation. Zero callbacks. She needed time I told her she didn't have.\n\nHer last message: \"You made it sound like the quick path was the only path.\"\n\nI did. Because I was impatient. For her success. For my numbers.",
            altEmotion: 'regretful'
          },
          {
            pattern: 'exploring',
            minLevel: 5,
            altText: "You explore before committing. Maria didn't get that chance.\n\nSingle mom. Cashed out 401k for bootcamp. I sold her a single path - my path - as the only way forward.\n\nSix months later. Zero callbacks. No other options explored. All her resources committed to one route that failed.\n\nHer last message: \"You made it sound like there was only one door.\"\n\nI did. Because I hadn't explored other doors myself. Just the one I walked through.",
            altEmotion: 'exploration_guilt'
          }
        ]
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
        text: "Thanks for listening.",
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
        visibleCondition: {
          hasGlobalFlags: ['alex_arc_complete'],
          lacksGlobalFlags: ['reflected_on_alex']
        },
        pattern: 'exploring'
      },
      // Loyalty Experience trigger - only visible at high trust + exploring pattern
      {
        choiceId: 'offer_honest_course_help',
        text: "[Explorer's Curiosity] You want to teach this. Want to build the course together?",
        nextNodeId: 'alex_loyalty_trigger',
        pattern: 'exploring',
        skills: ['curiosity', 'collaboration'],
        visibleCondition: {
          trust: { min: 8 },
          patterns: { exploring: { min: 50 } },
          hasGlobalFlags: ['alex_arc_complete']
        }
      }
    ],
    tags: ['alex_arc', 'arc_complete']
  },

  // ============= LOYALTY EXPERIENCE TRIGGER =============
  {
    nodeId: 'alex_loyalty_trigger',
    speaker: 'Alex',
    content: [{
      text: "Build it together? Good.",
      emotion: 'anxious_hopeful',
      variation_id: 'loyalty_trigger_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 8 },
      patterns: { exploring: { min: 5 } },
      hasGlobalFlags: ['alex_arc_complete']
    },
    metadata: {
      experienceId: 'the_honest_course'  // Triggers loyalty experience engine
    },
    choices: [
      {
        choiceId: 'accept_honest_course_challenge',
        text: "Let's figure it out together. Real learning, no shortcuts.",
        nextNodeId: 'alex_loyalty_start',
        pattern: 'exploring',
        skills: ['curiosity', 'collaboration'],
        consequence: {
          characterId: 'alex',
          trustChange: 1
        }
      },
      {
        choiceId: 'encourage_but_decline',
        text: "Alex, you've got the substance. The structure will follow. Trust the process.",
        nextNodeId: 'alex_loyalty_declined',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        characterId: 'alex',
        addKnowledgeFlags: ['loyalty_offered']
      }
    ],
    tags: ['loyalty_experience', 'alex_loyalty', 'high_trust']
  },

  {
    nodeId: 'alex_loyalty_declined',
    speaker: 'Alex',
    content: [{
      text: "Trust the process.",
      emotion: 'resolved',
      variation_id: 'loyalty_declined_v1'
    }],
    choices: [
      {
        choiceId: 'loyalty_declined_farewell',
        text: "Go build something honest. That's what matters.",
        nextNodeId: samuelEntryPoints.ALEX_REFLECTION_GATEWAY,
        visibleCondition: {
          hasGlobalFlags: ['alex_arc_complete'],
          lacksGlobalFlags: ['reflected_on_alex']
        },
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'alex',
        addKnowledgeFlags: ['loyalty_declined_gracefully']
      }
    ]
  },

  {
    nodeId: 'alex_loyalty_start',
    speaker: 'Alex',
    content: [{
      text: "Real learning. No shortcuts.",
      emotion: 'excited_determined',
      variation_id: 'loyalty_start_v1'
    }],
    metadata: {
      experienceId: 'the_honest_course'  // Experience engine takes over
    },
    choices: []  // Experience engine handles next steps
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
        text: "You think in systems.",
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
        text: "You've got this way of analyzing things.",
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
  },

  // ═══════════════════════════════════════════════════════════════
  // MYSTERY BREADCRUMBS
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'alex_mystery_hint',
    speaker: 'alex',
    requiredState: {
      trust: { min: 5 }
    },
    content: [
      {
        text: "I optimize routes for a living.",
        emotion: 'puzzled',
        variation_id: 'mystery_hint_v1'
      },
      {
        text: "It's like the destination finds you, not the other way around. That breaks every logistics model I know.",
        emotion: 'intrigued',
        variation_id: 'mystery_hint_v2'
      }
    ],
    choices: [
      {
        choiceId: 'alex_mystery_dig',
        text: "Maybe people aren't packages.",
        nextNodeId: 'alex_mystery_response',
        pattern: 'helping'
      },
      {
        choiceId: 'alex_mystery_analyze',
        text: "What if the station optimizes for something we can't measure?",
        nextNodeId: 'alex_mystery_response',
        pattern: 'analytical'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  {
    nodeId: 'alex_mystery_response',
    speaker: 'alex',
    content: [
      {
        text: "Ha.",
        emotion: 'vulnerable',
        variation_id: 'mystery_response_v1'
      }
    ],
    onEnter: [
      { characterId: 'alex', addKnowledgeFlags: ['alex_mystery_noticed'] }
    ],
    choices: [
      {
        choiceId: 'alex_mystery_return',
        text: "Soft isn't the same as wrong.",
        nextNodeId: 'alex_hub_return',
        pattern: 'patience'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  // ============= SIMULATION 3: CURRICULUM DESIGN =============
  {
    nodeId: 'alex_sim3_curriculum_intro',
    speaker: 'Alex',
    content: [{
      text: "Final scenario: design a 12-week tech program for Birmingham high school students. Trap one: credential-heavy track.",
      emotion: 'teaching_challenging',
      variation_id: 'sim3_intro_v1'
    }],
    simulation: {
      type: 'chat_negotiation',
      title: 'Curriculum Design: The Learning Paradox',
      taskDescription: 'Design a learning program that serves both genuine curiosity AND employability. Most programs sacrifice one for the other. Can you do both?',
      initialContext: {
        label: 'Program Design Canvas',
        content: `DESIGN CHALLENGE: Tech Learning Program for Birmingham Youth

TARGET: High school students (ages 14-18)
DURATION: 12 weeks
GOAL: Genuine skill development + employability

TWO EXTREMES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOOTCAMP MODEL:
- Structured curriculum
- Weekly tests and grading
- Final certificate
- High completion rates (82%)
- Low curiosity retention (34% still coding 1 year later)
- Employers recognize credentials

EXPLORATION MODEL:
- Student-directed projects
- No tests or grades
- No formal credential
- High engagement during program (94%)
- High curiosity retention (78% still coding 1 year later)
- Employers skeptical without proof

CONSTRAINT: You need BOTH outcomes.
How do you design for genuine learning AND employability?`,
        displayStyle: 'text'
      },
      successFeedback: 'CURRICULUM SUBMITTED: Analyzing learning vs credentialing balance...'
    },
    requiredState: {
      hasKnowledgeFlags: ['alex_project_unmonetizable', 'alex_curiosity_rekindled', 'alex_simulation_complete']
    },
    choices: [
      {
        choiceId: 'sim3_portfolio_over_cert',
        text: "No certificates. Build portfolios. Real projects are better proof than paper.",
        nextNodeId: 'alex_sim3_partial',
        pattern: 'building',
        skills: ['creativity', 'leadership']
      },
      {
        choiceId: 'sim3_micro_credentials',
        text: "Micro-credentials. Students earn badges for genuine skill demonstrations, not tests.",
        nextNodeId: 'alex_sim3_success',
        pattern: 'analytical',
        skills: ['systemsThinking', 'instructionalDesign']
      },
      {
        choiceId: 'sim3_dual_track',
        text: "Dual track: exploration modules + optional certification prep for those who want it.",
        nextNodeId: 'alex_sim3_fail',
        pattern: 'patience',
        skills: ['projectManagement']
      }
    ],
    tags: ['simulation', 'alex_arc', 'phase3', 'mastery']
  },

  {
    nodeId: 'alex_sim3_success',
    speaker: 'Alex',
    content: [{
      text: "Micro-credentials. Yes.",
      emotion: 'proud_inspired_breakthrough',
      interaction: 'bloom',
      variation_id: 'sim3_success_v1',
      richEffectContext: 'success'
    }],
    onEnter: [{
      characterId: 'alex',
      trustChange: 2,
      addKnowledgeFlags: ['alex_sim3_complete', 'alex_all_sims_complete']
    }],
    choices: [{
      choiceId: 'sim3_complete',
      text: "Credentials as evidence, not as goal. That changes everything.",
      nextNodeId: 'alex_hub_return',
      pattern: 'building',
      skills: ['wisdom', 'instructionalDesign']
    }],
    tags: ['simulation', 'alex_arc', 'phase3', 'success']
  },

  {
    nodeId: 'alex_sim3_partial',
    speaker: 'Alex',
    content: [{
      text: "Portfolios are real work, yes. But many employers cannot evaluate them for entry-level hiring, so certificates still win interviews because they are legible.",
      emotion: 'patient_teaching',
      variation_id: 'sim3_partial_v1'
    }],
    onEnter: [{
      characterId: 'alex',
      addKnowledgeFlags: ['alex_sim3_partial']
    }],
    choices: [{
      choiceId: 'sim3_partial_reflect',
      text: "Both the real work AND the legible proof. Got it.",
      nextNodeId: 'alex_hub_return',
      pattern: 'analytical',
      skills: ['systemsThinking']
    }],
    tags: ['simulation', 'alex_arc', 'phase3', 'partial']
  },

  {
    nodeId: 'alex_sim3_fail',
    speaker: 'Alex',
    content: [{
      text: "Dual tracks split students into identities: 'explorers' and 'certifiers. ' Then both lose something.",
      emotion: 'firm_teaching',
      variation_id: 'sim3_fail_v1',
      richEffectContext: 'error'
    }],
    choices: [{
      choiceId: 'sim3_retry',
      text: "I see it. Integration, not separation. Micro-credentials in context.",
      nextNodeId: 'alex_sim3_success',
      pattern: 'building',
      skills: ['learningAgility']
    }],
    tags: ['simulation', 'alex_arc', 'phase3', 'failure']
  },

  {
    nodeId: 'alex_hub_return',
    speaker: 'alex',
    content: [{
      text: "I'll keep looking at the logistics. But I'll keep your theory in mind.",
      emotion: 'thoughtful',
      variation_id: 'hub_return_v1'
    }],
    choices: [],
    tags: ['terminal']
  },

  // ============= TRUST RECOVERY =============
  {
    nodeId: 'alex_trust_recovery',
    speaker: 'Alex',
    requiredState: {
      trust: { max: 3 }
    },
    content: [{
      text: "[They're staring at a half-written documentation page. Cursor blinking.]\n\nHey.\n\nI wasn't sure you'd come back after I... after I shut down.\n\n[They close the laptop.]\n\nI've taught a lot of people. Burned out on a lot of people. Started seeing everyone as just another credential chaser.\n\nBut you weren't. And I treated you like you were.\n\nThat's on me.",
      emotion: 'regretful_tired',
      variation_id: 'trust_recovery_v1',
      voiceVariations: {
        patience: "[They're staring at a half-written documentation page. Cursor blinking.]\n\nHey.\n\nYou gave me space. I appreciate that.\n\nI wasn't sure you'd come back after I... after I shut down.\n\n[They close the laptop.]\n\nI've taught a lot of people. Burned out on a lot of people. Started seeing everyone as just another credential chaser.\n\nBut you weren't. And I treated you like you were. That's on me.",
        helping: "[They're staring at a half-written documentation page. Cursor blinking.]\n\nHey.\n\nYou came back even after I pushed you away.\n\nI wasn't sure you'd come back after I... after I shut down.\n\n[They close the laptop.]\n\nI've taught a lot of people. Burned out on a lot of people. Started seeing everyone as just another credential chaser.\n\nBut you weren't. And I treated you like you were. That's on me.",
        analytical: "[They're staring at a half-written documentation page. Cursor blinking.]\n\nHey.\n\nYou analyzed the situation and decided to try again.\n\nI wasn't sure you'd come back after I... after I shut down.\n\n[They close the laptop.]\n\nI've taught a lot of people. Burned out on a lot of people. Started seeing everyone as just another credential chaser.\n\nBut you weren't. And I treated you like you were. That's on me.",
        building: "[They're staring at a half-written documentation page. Cursor blinking.]\n\nHey.\n\nYou're rebuilding something I damaged.\n\nI wasn't sure you'd come back after I... after I shut down.\n\n[They close the laptop.]\n\nI've taught a lot of people. Burned out on a lot of people. Started seeing everyone as just another credential chaser.\n\nBut you weren't. And I treated you like you were. That's on me.",
        exploring: "[They're staring at a half-written documentation page. Cursor blinking.]\n\nHey.\n\nStill curious even after I became cynical.\n\nI wasn't sure you'd come back after I... after I shut down.\n\n[They close the laptop.]\n\nI've taught a lot of people. Burned out on a lot of people. Started seeing everyone as just another credential chaser.\n\nBut you weren't. And I treated you like you were. That's on me."
      }
    }],
    choices: [
      {
        choiceId: 'alex_recovery_burnout',
        text: "Burnout makes us see the worst in people. I get it.",
        nextNodeId: 'alex_trust_restored',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'alex',
          trustChange: 2,
          addKnowledgeFlags: ['alex_trust_repaired']
        },
        voiceVariations: {
          patience: "Take your time. Burnout makes us see the worst in people. I get it.",
          helping: "Burnout makes us see the worst in people. You're not a bad teacher. You're tired.",
          analytical: "Burnout creates cognitive biases. Pattern recognition becomes cynicism. I get it.",
          building: "Burnout breaks what we build. I get it. Let's rebuild.",
          exploring: "Burnout narrows our perspective. I get it. Let's explore past it."
        }
      },
      {
        choiceId: 'alex_recovery_here',
        text: "I'm here because I'm actually learning. Not credential chasing.",
        nextNodeId: 'alex_trust_restored',
        pattern: 'building',
        skills: ['communication'],
        consequence: {
          characterId: 'alex',
          trustChange: 2,
          addKnowledgeFlags: ['alex_trust_repaired']
        },
        voiceVariations: {
          patience: "I'm here for the learning. Not the credentials. Take your time seeing that.",
          helping: "I'm here because I'm actually learning. Because you're a good teacher when you let yourself be.",
          analytical: "I'm here for knowledge transfer, not credential accumulation. There's a difference.",
          building: "I'm here to build understanding. Not chase certificates.",
          exploring: "I'm here because I'm actually learning. Because you make me curious."
        }
      }
    ],
    tags: ['trust_recovery', 'alex_arc']
  },

  {
    nodeId: 'alex_trust_restored',
    speaker: 'Alex',
    content: [{
      text: "[They take a breath. First genuine smile you've seen.]\n\nYeah.\n\nYou are learning. I can see it. You ask the kind of questions that mean you're thinking, not just checking boxes.\n\n[They reopen the laptop.]\n\nI'm sorry. For projecting my burnout onto you. For forgetting why I started teaching in the first place.\n\nThanks for... for not giving up on me.",
      emotion: 'grateful_relieved',
      variation_id: 'trust_restored_v1',
      voiceVariations: {
        patience: "[They take a breath. First genuine smile you've seen.]\n\nYeah.\n\nYou are learning. And you take your time with it. That's rare. That's real.\n\n[They reopen the laptop.]\n\nI'm sorry. For projecting my burnout onto you. For forgetting why I started teaching in the first place.\n\nThanks for... for not giving up on me.",
        helping: "[They take a breath. First genuine smile you've seen.]\n\nYeah.\n\nYou are learning. And you care about people, not just outcomes. That reminds me why teaching matters.\n\n[They reopen the laptop.]\n\nI'm sorry. For projecting my burnout onto you. For forgetting why I started teaching in the first place.\n\nThanks for... for not giving up on me.",
        analytical: "[They take a breath. First genuine smile you've seen.]\n\nYeah.\n\nYou are learning. I can see it in how you analyze, how you connect concepts. That's genuine understanding.\n\n[They reopen the laptop.]\n\nI'm sorry. For projecting my burnout onto you. For forgetting why I started teaching in the first place.\n\nThanks for... for not giving up on me.",
        building: "[They take a breath. First genuine smile you've seen.]\n\nYeah.\n\nYou are learning. Building something real, not just collecting certificates. That's what I wanted to teach.\n\n[They reopen the laptop.]\n\nI'm sorry. For projecting my burnout onto you. For forgetting why I started teaching in the first place.\n\nThanks for... for not giving up on me.",
        exploring: "[They take a breath. First genuine smile you've seen.]\n\nYeah.\n\nYou are learning. Your curiosity is real. That's what teaching should feed.\n\n[They reopen the laptop.]\n\nI'm sorry. For projecting my burnout onto you. For forgetting why I started teaching in the first place.\n\nThanks for... for not giving up on me."
      }
    }],
    choices: [{
      choiceId: 'alex_recovery_complete',
      text: "Proceed.",
      nextNodeId: 'alex_hub_return',
      pattern: 'patience'
    }],
    tags: ['trust_recovery', 'alex_arc'],
    onEnter: [{
      characterId: 'alex',
      addKnowledgeFlags: ['alex_trust_recovery_completed']
    }]
  }
];

export const alexEntryPoints = {
  INTRODUCTION: 'alex_introduction',
  SIMULATION: 'alex_simulation_intro',
  MYSTERY_HINT: 'alex_mystery_hint'
} as const

export const alexDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: buildDialogueNodesMap('alex', alexDialogueNodes),
  startNodeId: alexEntryPoints.INTRODUCTION,
  metadata: {
    title: "The Credential Paradox",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: filterDraftNodes('alex', alexDialogueNodes).length,
    totalChoices: filterDraftNodes('alex', alexDialogueNodes).reduce((sum, n) => sum + n.choices.length, 0)
  }
}
