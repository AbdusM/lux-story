/**
 * Nadia Petrova's Dialogue Graph
 * The AI Ethicist - AI Strategy Specialist
 *
 * LinkedIn 2026 Role: #2 AI Consultants & Strategists (fastest growing)
 * Animal: Barn Owl (cream/tan/teal palette)
 * Tier: 2 (Primary) - 50 nodes target, 10 voice variations
 *
 * Core Conflict: Built AI that caused harm. Now fights to make AI serve humanity, not replace it.
 * Backstory: Former ML researcher who left a top lab after seeing her bias detection work weaponized.
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const nadiaDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'nadia_introduction',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_intro_v1',
        text: "Do you know why owls can rotate their heads 270 degrees? Because they can't move their eyes. They're fixed.\n\nI think about that a lot. Sometimes the thing that gives you insight also gives you limitation.\n\nI used to think AI would see everything. Now I know it sees only what we point it toward. And we're not very good at choosing where to look.",
        emotion: 'thoughtful',
        patternReflection: [
          { pattern: 'analytical', minLevel: 5, altText: "Do you know why owls can rotate their heads 270 degrees? Because they can't move their eyes. They're fixed.\n\nYou think systematically. I can tell by how you entered—scanning, mapping. That's rare. Most people just... experience. You process.", altEmotion: 'appreciative' },
          { pattern: 'helping', minLevel: 5, altText: "Do you know why owls can rotate their heads 270 degrees? Because they can't move their eyes. They're fixed.\n\nYou're here because you care about something larger than yourself. I see that. The helpers always find their way to me eventually.", altEmotion: 'knowing' },
          { pattern: 'building', minLevel: 5, altText: "Do you know why owls can rotate their heads 270 degrees? Because they can't move their eyes. They're fixed.\n\nYou're a builder. I can tell by your hands—how you touched that terminal screen. Reverent. Curious. What do you want to build?", altEmotion: 'curious' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'nadia_intro_see',
        text: "What do you mean by 'choosing where to look'?",
        nextNodeId: 'nadia_choosing_sight',
        pattern: 'analytical',
        skills: ['criticalThinking', 'integrity'],
        voiceVariations: {
          analytical: "Define 'choosing where to look' in the AI context.",
          building: "How does AI's attention get built?",
          exploring: "What happens when AI looks in the wrong direction?",
          helping: "Who decides where AI pays attention?",
          patience: "The choice of where to look. Tell me more."
        }
      },
      {
        choiceId: 'nadia_intro_fixed',
        text: "Insight and limitation in the same trait. That's profound.",
        nextNodeId: 'nadia_tradeoffs',
        pattern: 'patience',
        skills: ['criticalThinking', 'emotionalIntelligence'],
        voiceVariations: {
          patience: "Insight and limitation, bound together. I want to sit with that.",
          analytical: "The correlation between capability and constraint is worth examining.",
          building: "Every strength is a direction. Every direction is a choice.",
          exploring: "What limitations do you carry alongside your insight?",
          helping: "You're describing yourself too, aren't you?"
        },
        consequence: {
          characterId: 'nadia',
          trustChange: 1,
          addKnowledgeFlags: ['noticed_nadia_metaphor']
        }
      },
      {
        choiceId: 'nadia_intro_ai',
        text: "So you work with AI?",
        nextNodeId: 'nadia_work_ai',
        pattern: 'exploring',
        skills: ['curiosity', 'communication'],
        voiceVariations: {
          exploring: "You're talking about AI like someone who knows it intimately.",
          analytical: "What's your relationship with machine learning systems?",
          building: "You build AI? Or fix it?",
          helping: "AI that sees—you've worked on giving machines vision?",
          patience: "AI. Your field."
        }
      },
      {
        choiceId: 'nadia_intro_owl',
        text: "Why owls?",
        nextNodeId: 'nadia_owl_connection',
        pattern: 'exploring',
        skills: ['curiosity', 'communication'],
        voiceVariations: {
          exploring: "There's a story behind the owl metaphor.",
          helping: "Owls mean something specific to you.",
          analytical: "Why that specific example?",
          building: "Did you choose the owl, or did it choose you?",
          patience: "The owl. It matters to you."
        }
      },
      {
        choiceId: 'nadia_intro_show_work',
        text: "Show me what you're working on.",
        nextNodeId: 'nadia_handshake_news',
        pattern: 'exploring',
        skills: ['curiosity', 'learningAgility'],
        voiceVariations: {
          exploring: "Can you show me an example of this tension in action?",
          analytical: "Walk me through a real AI ethics scenario.",
          building: "Let me see the problem you're trying to solve.",
          helping: "Show me where the harm happens.",
          patience: "Demonstrate. I'll learn by watching."
        }
      }
    ],
    onEnter: [
      { addGlobalFlags: ['met_nadia'] },
      { characterId: 'nadia', addKnowledgeFlags: ['nadia_met'] }
    ],
    tags: ['nadia_intro', 'first_meeting']
  },

  // ============= HANDSHAKE NODE: NEWS TICKER =============
  {
    nodeId: 'nadia_handshake_news',
    speaker: 'Nadia Petrova',
    content: [{
      text: "Look at the feed. These aren't just headlines. They're feedback loops. The algorithm amplifies what outrages us, and we feed it back more outrage.\n\nCan you stabilize the signal? Find the human impact hidden in the noise.",
      emotion: 'urgent',
      variation_id: 'nadia_handshake_intro',
      interaction: 'ripple'
    }],
    simulation: {
      type: 'data_ticker',
      mode: 'inline',
      title: 'Global Sentiment Monitor',
      taskDescription: 'Stabilize the viral headlines to find the truth.',
      initialContext: {
        label: 'Live Feed',
        content: JSON.stringify([
          { id: '1', label: 'AI_SURGE', value: 92, priority: 'critical', trend: 'up' },
          { id: '2', label: 'MARKET_CRASH', value: 88, priority: 'critical', trend: 'down' },
          { id: '3', label: 'ETHICS_BILL', value: 45, priority: 'medium', trend: 'stable' },
          { id: '4', label: 'NEW_MODEL', value: 76, priority: 'high', trend: 'up' },
          { id: '5', label: 'PUBLIC_OUTCRY', value: 95, priority: 'critical', trend: 'up' }
        ])
      },
      successFeedback: 'NOISE FILTERED. HUMAN IMPACT DETECTED.'
    },
    choices: [
      {
        choiceId: 'news_complete',
        text: "I've filtered the noise. It's... intense.",
        nextNodeId: 'nadia_choosing_sight', // Route back to main arc
        pattern: 'analytical',
        skills: ['digitalLiteracy'],
        voiceVariations: {
          analytical: "Signal stabilized. The pattern is clear.",
          helping: "I see the people behind the data now.",
          exploring: "That was chaos. But I found the thread."
        }
      }
    ]
  },

  // ============= CHOOSING SIGHT =============
  {
    nodeId: 'nadia_choosing_sight',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_sight_v1',
        text: "AI learns from data. That data was collected by humans, curated by humans, labeled by humans.\n\nEvery dataset is a decision: This matters. This doesn't. These people count. These are noise.\n\nWhen I trained hiring algorithms, I thought I was removing human bias. Instead, I baked it in—deeper, invisible, scaled to millions of decisions.\n\nChoosing where AI looks means choosing whose truth becomes universal.",
        emotion: 'intense'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_hiring_harm',
        text: "What happened with the hiring algorithms?",
        nextNodeId: 'nadia_hiring_story',
        pattern: 'helping',
        skills: ['empathy', 'integrity'],
        consequence: {
          characterId: 'nadia',
          trustChange: 1,
          addKnowledgeFlags: ['asked_nadia_hiring']
        }
      },
      {
        choiceId: 'nadia_remove_bias',
        text: "Is it possible to remove bias from AI?",
        nextNodeId: 'nadia_bias_possible',
        pattern: 'analytical',
        skills: ['criticalThinking', 'integrity']
      },
      {
        choiceId: 'nadia_whose_truth',
        text: "Whose truth becomes universal—that's terrifying.",
        nextNodeId: 'nadia_terrifying_truth',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'integrity']
      }
    ],
    tags: ['nadia_arc', 'ai_ethics', 'bias']
  },

  // ============= HIRING STORY =============
  {
    nodeId: 'nadia_hiring_story',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_hiring_v1',
        text: "[Nadia's voice drops.]\n\nI built a system for a tech company. Resume screening. The brief was 'find candidates like our best performers.'\n\nOur best performers were mostly men. Not because men are better engineers—because the company had historically hired and promoted men.\n\nSo my algorithm learned to penalize women. Subtly. It downranked resumes with women's college names. Flagged 'gaps' that were often parental leave.\n\nI didn't code that. I didn't intend that. But my system did it anyway. At scale. For eighteen months before anyone noticed.\n\nThat's when I left the lab.",
        emotion: 'haunted'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_noticed_how',
        text: "How did someone finally notice?",
        nextNodeId: 'nadia_noticed',
        pattern: 'exploring',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'nadia_your_fault',
        text: "That wasn't your fault. The bias was in the data.",
        nextNodeId: 'nadia_data_defense',
        pattern: 'helping',
        skills: ['empathy']
      },
      {
        choiceId: 'nadia_it_was',
        text: "You left because you felt responsible.",
        nextNodeId: 'nadia_responsible',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'nadia',
          trustChange: 2,
          addKnowledgeFlags: ['understood_nadia_guilt']
        }
      }
    ],
    tags: ['nadia_arc', 'backstory', 'harm', 'vulnerability']
  },

  // ============= RESPONSIBLE =============
  {
    nodeId: 'nadia_responsible',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_responsible_v1',
        text: "Yes.\n\nEveryone told me what you just said—'It's in the data. It's systemic. You can't be blamed for historical patterns.'\n\nBut here's what I can't escape: I had the expertise to anticipate this. I knew about bias in training sets. I'd read the research. I chose to believe my implementation was clean enough.\n\nI wanted to ship. I wanted the success. And I let that want override my caution.\n\nThe women who didn't get interviews because of my system—they didn't care about my intentions. They cared about results. And I have to answer for those results.",
        emotion: 'heavy'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_answer_how',
        text: "How do you answer for them now?",
        nextNodeId: 'nadia_answer_now',
        pattern: 'helping',
        skills: ['empathy', 'integrity'],
        consequence: {
          characterId: 'nadia',
          trustChange: 1
        }
      },
      {
        choiceId: 'nadia_others_too',
        text: "You weren't the only one in that lab. Others share responsibility.",
        nextNodeId: 'nadia_shared_blame',
        pattern: 'analytical',
        skills: ['criticalThinking', 'integrity']
      }
    ],
    tags: ['nadia_arc', 'accountability', 'vulnerability']
  },

  // ============= ANSWER NOW =============
  {
    nodeId: 'nadia_answer_now',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_answer_v1',
        text: "By making sure it doesn't happen again. Not just my systems—anyone's.\n\nI consult now. Not to build AI, but to audit it. I help organizations ask the questions they don't want to ask:\n\n'Who does this system harm?'\n'What are we not seeing?'\n'If this fails, who suffers first?'\n\nIt's not redemption. There's no undoing what happened. But it's... purpose. Redirected purpose.",
        emotion: 'resolute'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_questions_companies',
        text: "Do companies actually listen to those questions?",
        nextNodeId: 'nadia_companies_listen',
        pattern: 'analytical',
        skills: ['criticalThinking', 'financialLiteracy']
      },
      {
        choiceId: 'nadia_purpose_enough',
        text: "Is redirected purpose enough?",
        nextNodeId: 'nadia_purpose_deep',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'empathy'],
        consequence: {
          characterId: 'nadia',
          trustChange: 1
        }
      }
    ],
    tags: ['nadia_arc', 'purpose', 'current_work']
  },

  // ============= EXPLORATION HUB =============
  {
    nodeId: 'nadia_exploration_hub',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_hub_v1',
        text: "There's a lot to cover in AI ethics. Most of it uncomfortable.\n\nWhere do you want to go?",
        emotion: 'open'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_hub_future',
        text: "The future of AI. Where is this heading?",
        nextNodeId: 'nadia_ai_future',
        pattern: 'exploring',
        skills: ['visionaryThinking', 'criticalThinking']
      },
      {
        choiceId: 'nadia_hub_audit',
        text: "Tell me about AI auditing.",
        nextNodeId: 'nadia_audit_work',
        pattern: 'building',
        skills: ['systemsThinking', 'integrity']
      },
      {
        choiceId: 'nadia_hub_personal',
        text: "Your personal journey through all this.",
        nextNodeId: 'nadia_personal_journey',
        pattern: 'helping',
        skills: ['empathy', 'communication']
      },
      {
        choiceId: 'nadia_hub_samuel',
        text: "I need to explore other parts of the station.",
        nextNodeId: samuelEntryPoints.HUB_INITIAL,
        pattern: 'exploring',
        skills: ['adaptability']
      }
    ],
    tags: ['nadia_arc', 'hub', 'navigation']
  },

  // ============= AI FUTURE =============
  {
    nodeId: 'nadia_ai_future',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_future_v1',
        text: "Two paths. We're choosing between them right now.\n\nPath one: AI as tool. Amplifies human judgment but doesn't replace it. Requires humans to stay in the loop, stay skeptical, stay responsible.\n\nPath two: AI as oracle. Answers all questions, makes all decisions, optimizes everything. Humans become passengers in systems they don't understand.\n\nThe technology allows either. The question is what we choose to build—and what we refuse to.",
        emotion: 'serious'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_path_one',
        text: "Path one seems obvious. Why would anyone choose path two?",
        nextNodeId: 'nadia_why_oracle',
        pattern: 'analytical',
        skills: ['criticalThinking', 'financialLiteracy']
      },
      {
        choiceId: 'nadia_already_chose',
        text: "Haven't we already started down path two?",
        nextNodeId: 'nadia_already_oracle',
        pattern: 'patience',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'nadia_refuse_build',
        text: "What have you refused to build?",
        nextNodeId: 'nadia_refused',
        pattern: 'helping',
        skills: ['integrity', 'courage'],
        consequence: {
          characterId: 'nadia',
          trustChange: 1
        }
      }
    ],
    tags: ['nadia_arc', 'ai_future', 'philosophy']
  },

  // ============= WHY ORACLE =============
  {
    nodeId: 'nadia_why_oracle',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_oracle_v1',
        text: "Because path two is faster. More profitable. Scales infinitely.\n\nPath one requires training humans. Maintaining expertise. Accepting that machines can be wrong and humans need authority to override them.\n\nPath two just... replaces the uncertainty. No more human judgment to question. No more experts to pay. Just outputs and efficiency.\n\nThe people building path two aren't villains. They're optimizers. And optimization doesn't have an ethics module.",
        emotion: 'bitter'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_add_ethics',
        text: "Can you add an ethics module?",
        nextNodeId: 'nadia_ethics_module',
        pattern: 'building',
        skills: ['systemsThinking', 'integrity']
      },
      {
        choiceId: 'nadia_stop_optimizers',
        text: "How do we stop the optimizers?",
        nextNodeId: 'nadia_stop_them',
        pattern: 'analytical',
        skills: ['strategicThinking', 'problemSolving']
      }
    ],
    tags: ['nadia_arc', 'ai_future', 'economics']
  },

  // ============= AUDIT WORK =============
  {
    nodeId: 'nadia_audit_work',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_audit_v1',
        text: "AI auditing is detective work. With a dash of philosophy.\n\nI go into organizations and ask: What is this system actually doing? Not what you think it does. Not what it was designed to do. What does it actually do in practice, to real people?\n\nThen I trace the failures back. Find where assumptions broke down. Where data was incomplete. Where the edge cases were dismissed as 'acceptable loss.'\n\nThe goal isn't to kill the system. It's to make it honest about its limits.",
        emotion: 'teaching'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_edge_cases',
        text: "What kind of edge cases get dismissed?",
        nextNodeId: 'nadia_edge_cases',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'nadia_resist_audit',
        text: "Do companies resist your findings?",
        nextNodeId: 'nadia_resistance',
        pattern: 'exploring',
        skills: ['financialLiteracy']
      },
      {
        choiceId: 'nadia_become_auditor',
        text: "How would someone become an AI auditor?",
        nextNodeId: 'nadia_career_path',
        pattern: 'building',
        skills: ['strategicThinking', 'visionaryThinking']
      }
    ],
    tags: ['nadia_arc', 'auditing', 'work']
  },

  // ============= VULNERABILITY ARC =============
  {
    nodeId: 'nadia_vulnerability_arc',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_vuln_v1',
        text: "[Nadia stops arranging her equipment. Her hands are shaking slightly.]\n\nCan I tell you something I've never said out loud?\n\nI still dream about the algorithm. Not nightmares—that would be easier. I dream about the code. Lines and lines of it. Beautiful, elegant code.\n\nAnd in the dream, I know exactly what it's going to do. I know it will hurt people. And I ship it anyway. Because it's too beautiful to stop.\n\nI wake up and I don't know if I've changed. Or if I'm still that person who chose beauty over safety.",
        emotion: 'terrified'
      }
    ],
    requiredState: { trust: { min: 6 } },
    onEnter: [
      { characterId: 'nadia', addKnowledgeFlags: ['nadia_vulnerability_revealed'] }
    ],
    choices: [
      {
        choiceId: 'nadia_vuln_changed',
        text: "The fact that you're haunted by it means you've changed.",
        nextNodeId: 'nadia_haunted_change',
        pattern: 'helping',
        skills: ['empathy', 'emotionalIntelligence'],
        consequence: {
          characterId: 'nadia',
          trustChange: 2
        }
      },
      {
        choiceId: 'nadia_vuln_both',
        text: "Maybe you're both. Maybe that's what vigilance looks like.",
        nextNodeId: 'nadia_both_selves',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'emotionalIntelligence'],
        consequence: {
          characterId: 'nadia',
          trustChange: 2
        }
      },
      {
        choiceId: 'nadia_vuln_beautiful',
        text: "Beauty is seductive. That's not a flaw—it's human.",
        nextNodeId: 'nadia_human_beauty',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence']
      }
    ],
    tags: ['nadia_arc', 'vulnerability', 'deep_trust']
  },

  // ============= HAUNTED CHANGE =============
  {
    nodeId: 'nadia_haunted_change',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_haunted_v1',
        text: "[Long silence. Then a small, choked laugh.]\n\nI want to believe that. I really do.\n\nMaybe the guilt is the evidence. Maybe if I didn't care, I wouldn't be here doing this work. Fighting system by system to make AI accountable.\n\nBut some days the guilt feels like performance too. Like I'm haunted because that's what a good person would be. And I don't know anymore which feelings are real and which are just... optimized.",
        emotion: 'raw'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_feelings_real',
        text: "Real feelings don't need to be optimized. They just are.",
        nextNodeId: 'nadia_feelings_exist',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'nadia',
          trustChange: 1
        }
      },
      {
        choiceId: 'nadia_doubt_proof',
        text: "The doubt itself is proof you're not performing.",
        nextNodeId: 'nadia_doubt_authentic',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['nadia_arc', 'vulnerability', 'healing']
  },

  // ============= SIMULATION: THE HYPE MEETING =============
  {
    nodeId: 'nadia_sim_hype',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_sim_v1',
        text: "Let me give you a scenario I actually faced.\n\nYou're in a boardroom. The CEO is excited—just read an article about AI transforming industries. They want a chatbot that 'understands customers better than any human.'\n\nYou know the technology. You know it can't actually understand. It pattern-matches. It hallucinates. It will fail in ways they can't predict.\n\nBut they're offering a six-figure contract. And your team needs the work.\n\nWhat do you say?",
        emotion: 'testing'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_sim_truth',
        text: "Tell them the truth. AI doesn't understand—it mimics.",
        nextNodeId: 'nadia_sim_truth_response',
        pattern: 'patience',
        skills: ['integrity', 'communication'],
        consequence: {
          characterId: 'nadia',
          trustChange: 1
        }
      },
      {
        choiceId: 'nadia_sim_scope',
        text: "Take the contract but scope it honestly. Tell them what's actually achievable.",
        nextNodeId: 'nadia_sim_scope_response',
        pattern: 'building',
        skills: ['communication', 'financialLiteracy']
      },
      {
        choiceId: 'nadia_sim_walk',
        text: "Walk away. Some contracts aren't worth the compromise.",
        nextNodeId: 'nadia_sim_walk_response',
        pattern: 'helping',
        skills: ['integrity', 'emotionalIntelligence']
      },
      {
        choiceId: 'nadia_sim_promise',
        text: "Promise what they want. Figure out the details later.",
        nextNodeId: 'nadia_sim_promise_response',
        pattern: 'exploring',
        skills: ['adaptability']
      }
    ],
    tags: ['nadia_sim', 'simulation', 'ethics']
  },

  // ============= SIM TRUTH RESPONSE =============
  {
    nodeId: 'nadia_sim_truth_response',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_sim_truth_v1',
        text: "[Nadia nods slowly.]\n\nThat's the hard path. The right one, usually.\n\nIn my experience, about half the CEOs appreciate the honesty. They didn't know they were asking for the impossible. Once you explain what AI can actually do, they often find value in the realistic version.\n\nThe other half get angry. Think you're being negative. Go find someone who'll tell them what they want to hear.\n\nBut those are the projects that fail spectacularly. And you won't be holding the blame.",
        emotion: 'approving'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_sim_fail_story',
        text: "Have you seen those projects fail?",
        nextNodeId: 'nadia_failures_seen',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'nadia_sim_continue',
        text: "Let's try another scenario.",
        nextNodeId: 'nadia_sim_team',
        pattern: 'building',
        skills: ['problemSolving']
      }
    ],
    tags: ['nadia_sim', 'simulation', 'teaching']
  },

  // ============= SIM SCOPE RESPONSE =============
  {
    nodeId: 'nadia_sim_scope_response',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_sim_scope_v1',
        text: "That's my answer too. Most of the time.\n\nYou can usually find an honest version of what they want. 'AI that understands customers' becomes 'AI that categorizes customer inquiries and routes them efficiently.'\n\nNot as sexy. But it's real. It works. And when it fails—which all systems do—it fails in predictable ways you can fix.\n\nThe skill is translating hype into reality without condescending.",
        emotion: 'teaching'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_translate_hype',
        text: "How do you translate without condescending?",
        nextNodeId: 'nadia_translation_skill',
        pattern: 'helping',
        skills: ['communication', 'communication']
      },
      {
        choiceId: 'nadia_sim_next',
        text: "Give me another scenario.",
        nextNodeId: 'nadia_sim_team',
        pattern: 'building',
        skills: ['problemSolving']
      }
    ],
    tags: ['nadia_sim', 'simulation', 'practical']
  },

  // ============= SIM TEAM =============
  {
    nodeId: 'nadia_sim_team',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_team_v1',
        text: "New scenario. Harder.\n\nYou're on a team building a recommendation system. Your data shows it works really well—but only for users who match the demographic of your test group.\n\nYour manager wants to ship. Your timeline is tight. If you flag this, the launch delays three months.\n\nBut if you don't flag it, the system will work poorly for users who aren't like your test group. They'll have worse experiences. Some might be harmed by bad recommendations.\n\nWhat do you do?",
        emotion: 'serious'
      }
    ],
    onEnter: [
      {
        characterId: 'nadia',
        addKnowledgeFlags: ['nadia_simulation_phase1_complete']
      }
    ],
    choices: [
      {
        choiceId: 'nadia_team_flag',
        text: "Flag it. Three months is worth getting it right.",
        nextNodeId: 'nadia_team_flag_response',
        pattern: 'patience',
        skills: ['integrity', 'courage']
      },
      {
        choiceId: 'nadia_team_compromise',
        text: "Ship with disclosure. Tell users the system may not work equally for everyone.",
        nextNodeId: 'nadia_team_compromise_response',
        pattern: 'analytical',
        skills: ['integrity', 'communication']
      },
      {
        choiceId: 'nadia_team_ship',
        text: "Ship it. Fix it in updates. Speed matters.",
        nextNodeId: 'nadia_team_ship_response',
        pattern: 'building',
        skills: ['financialLiteracy']
      }
    ],
    tags: ['nadia_sim', 'simulation', 'team_dynamics']
  },

  // ============= CAREER PATH =============
  {
    nodeId: 'nadia_career_path',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_career_v1',
        text: "Two paths into this work.\n\nPath one: Technical. Learn ML deeply enough to audit it. Python, statistics, understanding how models actually work under the hood.\n\nPath two: Policy. Learn regulation, governance, organizational change. You don't need to code the systems—you need to know what questions to ask and who has the power to change things.\n\nMost good auditors have elements of both. But you can start from either side.\n\nWhich interests you more?",
        emotion: 'mentoring'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_path_technical',
        text: "The technical side. I want to understand the systems.",
        nextNodeId: 'nadia_technical_path',
        pattern: 'building',
        skills: ['technicalLiteracy', 'curiosity']
      },
      {
        choiceId: 'nadia_path_policy',
        text: "Policy. I want to change how decisions get made.",
        nextNodeId: 'nadia_policy_path',
        pattern: 'helping',
        skills: ['systemsThinking', 'leadership']
      },
      {
        choiceId: 'nadia_path_both',
        text: "Both, honestly. Can you do that?",
        nextNodeId: 'nadia_both_paths',
        pattern: 'exploring',
        skills: ['adaptability']
      }
    ],
    tags: ['nadia_arc', 'career', 'mentoring']
  },

  // ============= TRADEOFFS =============
  {
    nodeId: 'nadia_tradeoffs',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_tradeoffs_v1',
        text: "Everything in AI is tradeoffs. Accuracy versus explainability. Speed versus safety. Innovation versus tested reliability.\n\nThe problem is, we pretend these tradeoffs don't exist. We want AI that's fast AND safe AND explainable AND innovative.\n\nMy job is to make the tradeoffs visible. Force organizations to actually choose instead of assuming they can have everything.",
        emotion: 'teaching'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_force_choose',
        text: "How do you force a choice?",
        nextNodeId: 'nadia_forcing_choice',
        pattern: 'analytical',
        skills: ['communication', 'communication']
      },
      {
        choiceId: 'nadia_tradeoffs_hub',
        text: "What other aspects of your work can we explore?",
        nextNodeId: 'nadia_exploration_hub',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['nadia_arc', 'tradeoffs', 'philosophy']
  },

  // ============= OWL CONNECTION =============
  {
    nodeId: 'nadia_owl_connection',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_owl_v1',
        text: "My grandmother. She had an owl figurine on her windowsill. Little ceramic thing, cheap.\n\nShe used to say: 'The owl sees in darkness, but it cannot see in sunlight. Every gift has a cost.'\n\nI think about that with AI. The thing that lets it see patterns humans miss is the same thing that makes it miss what humans see obviously. Different vision. Different blindness.\n\nGrandmother would have been very suspicious of my work. She was right to be.",
        emotion: 'wistful'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_grandmother',
        text: "Tell me more about your grandmother.",
        nextNodeId: 'nadia_grandmother_story',
        pattern: 'helping',
        skills: ['empathy', 'communication'],
        consequence: {
          characterId: 'nadia',
          trustChange: 1
        }
      },
      {
        choiceId: 'nadia_owl_hub',
        text: "Different vision, different blindness. Where else do we explore?",
        nextNodeId: 'nadia_exploration_hub',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['nadia_arc', 'backstory', 'family']
  },

  // ============= WORK WITH AI =============
  {
    nodeId: 'nadia_work_ai',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_work_v1',
        text: "I used to build it. Now I audit it.\n\nThe shift happened when I realized I was better at asking questions than providing answers. Any engineer can build a system. Fewer can predict where it will fail.\n\nAnd almost none want to be the person who stands up and says 'this will hurt someone' before it does.\n\nThat's my job now. Being the inconvenient voice in the room.",
        emotion: 'matter_of_fact'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_inconvenient',
        text: "That sounds lonely.",
        nextNodeId: 'nadia_lonely_work',
        pattern: 'helping',
        skills: ['empathy'],
        consequence: {
          characterId: 'nadia',
          trustChange: 1
        }
      },
      {
        choiceId: 'nadia_predict_fail',
        text: "How do you predict where systems fail?",
        nextNodeId: 'nadia_prediction_method',
        pattern: 'analytical',
        skills: ['systemsThinking', 'criticalThinking']
      },
      {
        choiceId: 'nadia_explore_more',
        text: "What else should I know about this work?",
        nextNodeId: 'nadia_exploration_hub',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['nadia_arc', 'work', 'identity']
  },

  // ============= LONELY WORK =============
  {
    nodeId: 'nadia_lonely_work',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_lonely_v1',
        text: "[Small pause. Nadia looks surprised by the observation.]\n\nIt is. Most people in tech want to build things. They get excited about possibilities. I walk in and talk about failure modes.\n\nNobody invites the person who says 'have you considered how this could go wrong?' to the celebration dinner.\n\nBut someone has to be that person. And I've made peace with it being me.\n\n...Mostly.",
        emotion: 'honest'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_mostly',
        text: "Mostly. What's the part you haven't made peace with?",
        nextNodeId: 'nadia_not_peace',
        pattern: 'helping',
        skills: ['empathy', 'emotionalIntelligence'],
        consequence: {
          characterId: 'nadia',
          trustChange: 1
        }
      },
      {
        choiceId: 'nadia_lonely_hub',
        text: "What other aspects of AI ethics can we explore?",
        nextNodeId: 'nadia_exploration_hub',
        pattern: 'patience',
        skills: ['adaptability']
      }
    ],
    tags: ['nadia_arc', 'loneliness', 'vulnerability']
  },

  // ============= RETURN HUB =============
  {
    nodeId: 'nadia_return_hub',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_return_v1',
        text: "The terminal's always open if you want to explore AI ethics more deeply. The questions don't get easier, but they get more interesting.\n\nCareful where you let yourself look. Once you see certain things, you can't unsee them.",
        emotion: 'knowing'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_return_station',
        text: "I'll explore other parts of the station.",
        nextNodeId: samuelEntryPoints.HUB_INITIAL,
        pattern: 'exploring',
        skills: ['adaptability']
      },
      {
        choiceId: 'nadia_return_stay',
        text: "I'm not done. Let's keep exploring.",
        nextNodeId: 'nadia_exploration_hub',
        pattern: 'patience',
        skills: ['curiosity']
      }
    ],
    tags: ['nadia_arc', 'hub', 'navigation']
  },

  // ============= ADDITIONAL DEPTH NODES =============
  {
    nodeId: 'nadia_data_defense',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_defense_v1',
        text: "I've heard that defense. I've used it.\n\nBut here's what it misses: I knew the data was biased. Everyone in ML knows historical data reflects historical inequality. That's not a secret.\n\nI just... hoped my math was good enough to compensate. That if I built a sophisticated enough model, it would transcend its inputs.\n\nThat's not engineering. That's magical thinking. And I should have known better.",
        emotion: 'self_critical'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_know_better',
        text: "Knowing better doesn't mean you can always do better. Systems constrain individuals.",
        nextNodeId: 'nadia_systems_individual',
        pattern: 'analytical',
        skills: ['systemsThinking']
      },
      {
        choiceId: 'nadia_magical_thinking',
        text: "Magical thinking is human. You're being hard on yourself.",
        nextNodeId: 'nadia_hard_self',
        pattern: 'helping',
        skills: ['empathy']
      }
    ],
    tags: ['nadia_arc', 'accountability', 'self_reflection']
  },

  {
    nodeId: 'nadia_companies_listen',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_listen_v1',
        text: "Sometimes. More often than you'd expect, less often than they should.\n\nThe companies that hire auditors are already self-selected—they care enough to ask. The dangerous ones never call.\n\nBut even the ones who call... they're hoping for a clean bill of health. A rubber stamp. When I find problems, some of them shoot the messenger.\n\nI've been fired from two consulting engagements for being too honest. I consider both successes.",
        emotion: 'dry'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_fired_story',
        text: "Tell me about one of those firings.",
        nextNodeId: 'nadia_fired_story',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'nadia_enough_listeners',
        text: "Are there enough companies listening to make a difference?",
        nextNodeId: 'nadia_enough_difference',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['nadia_arc', 'consulting', 'reality']
  },

  {
    nodeId: 'nadia_both_selves',
    speaker: 'Nadia Petrova',
    content: [
      {
        variation_id: 'nadia_both_v1',
        text: "[Nadia stares at you. Then laughs—a real laugh, surprised out of her.]\n\nBoth. Vigilance.\n\nI never thought of it that way. The person who could ship harmful code and the person who's haunted by it—same person. The haunting is what keeps me careful.\n\nIf I ever stop being haunted... that's when I should worry.\n\nThank you. Genuinely. That reframe helps.",
        emotion: 'moved'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_vigilance_practice',
        text: "How do you practice that vigilance?",
        nextNodeId: 'nadia_vigilance_methods',
        pattern: 'building',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'nadia_both_return',
        text: "I'm glad it helped. What else can we explore?",
        nextNodeId: 'nadia_exploration_hub',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['nadia_arc', 'healing', 'growth']
  },

  // ═══════════════════════════════════════════════════════════════
  // MYSTERY BREADCRUMBS
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'nadia_mystery_hint',
    speaker: 'nadia',
    requiredState: {
      trust: { min: 5 }
    },
    content: [
      {
        text: "I work with AI systems. I've seen what they can do—and what they can't.\\n\\nThis station operates like the most advanced AI I've ever encountered. But there's no server room. No data center.",
        emotion: 'mystified',
        variation_id: 'mystery_hint_v1'
      },
      {
        text: "It's like the intelligence is... <shake>distributed</shake>. In all of us.",
        emotion: 'intrigued',
        variation_id: 'mystery_hint_v2'
      }
    ],
    choices: [
      {
        choiceId: 'nadia_mystery_dig',
        text: "You mean we're the processing power?",
        nextNodeId: 'nadia_mystery_response',
        pattern: 'analytical'
      },
      {
        choiceId: 'nadia_mystery_feel',
        text: "Maybe intelligence isn't always artificial.",
        nextNodeId: 'nadia_mystery_response',
        pattern: 'patience'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  {
    nodeId: 'nadia_mystery_response',
    speaker: 'nadia',
    content: [
      {
        text: "Exactly. The station isn't running ON us—it's running THROUGH us. Our connections are the network.\\n\\nI've spent my career building artificial systems. This one is beautifully, irreducibly human.",
        emotion: 'awed',
        variation_id: 'mystery_response_v1'
      }
    ],
    onEnter: [
      { characterId: 'nadia', addKnowledgeFlags: ['nadia_mystery_noticed'] }
    ],
    choices: [
      {
        choiceId: 'nadia_mystery_return',
        text: "Maybe the best intelligence is the one we build together.",
        nextNodeId: 'nadia_hub_return',
        pattern: 'building'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  {
    nodeId: 'nadia_hub_return',
    speaker: 'nadia',
    content: [{
      text: "It was good talking with you. Come back anytime.",
      emotion: 'warm',
      variation_id: 'hub_return_v1'
    }],
    choices: [],
    tags: ['farewell']
  }
]

// Entry points for navigation
export const nadiaEntryPoints = {
  INTRODUCTION: 'nadia_introduction',
  SIMULATION: 'nadia_sim_hype',
  VULNERABILITY: 'nadia_vulnerability_arc',
  MYSTERY_HINT: 'nadia_mystery_hint'
} as const

// Build the graph
export const nadiaDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(nadiaDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: nadiaEntryPoints.INTRODUCTION,
  metadata: {
    title: "Nadia's Terminal",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: nadiaDialogueNodes.length,
    totalChoices: nadiaDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}
