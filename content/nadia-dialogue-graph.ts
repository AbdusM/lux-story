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
      type: 'news_feed',
      mode: 'inline',
      inlineHeight: 'h-[500px]',
      title: 'Global Sentiment Monitor',
      taskDescription: 'The feed is unstable. Adjust the editorial filters to dampen the "Panic" signal and amplify "Nuance".',
      initialContext: {
        label: 'Live Feed',
        content: 'Analyzing sentiment volatility...',
        displayStyle: 'visual',
        // Target: Calm (Low Tempo), Neutral (Mid Mood), Nuanced (High Texture)
        target: {
          targetState: {
            tempo: 20,    // Calm/Low Urgency
            mood: 50,     // Neutral Tone
            texture: 80   // High Nuance
          },
          tolerance: 15
        }
      },
      successFeedback: 'SIGNAL STABILIZED. HUMAN IMPACT DETECTED.'
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
          exploring: "That was chaos. But I found the thread.",
          patience: "Took time, but the signal is clearer now.",
          building: "I rebuilt the filters. The noise is gone."
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
        emotion: 'intense',
        voiceVariations: {
          analytical: "AI learns from data. That data was sampled by humans, filtered by humans, classified by humans.\n\nEvery dataset is a selection function: Include this variable. Exclude that outlier. These datapoints are signal. These are noise.\n\nWhen I trained hiring algorithms, I thought I was optimizing for merit. Instead, I encoded bias—deeper, undetectable, distributed across millions of executions.\n\nChoosing where AI analyzes means choosing whose patterns become law.",
          helping: "AI learns from data. That data was chosen by humans, shaped by humans, weighted by humans.\n\nEvery dataset is a judgment: These people matter. These don't. These experiences count. These are ignored.\n\nWhen I trained hiring algorithms, I thought I was helping fairness. Instead, I amplified harm—deeper, invisible, hurting millions of people.\n\nChoosing where AI looks means choosing whose pain becomes permanent.",
          building: "AI learns from data. That data was built by humans, structured by humans, labeled by humans.\n\nEvery dataset is an architecture: This foundation stands. This doesn't. These structures are solid. These are scaffolding.\n\nWhen I trained hiring algorithms, I thought I was constructing meritocracy. Instead, I built discrimination—deeper, permanent, scaled to millions of decisions.\n\nChoosing where AI builds means choosing whose foundations become infrastructure.",
          exploring: "AI learns from data. That data was discovered by humans, mapped by humans, charted by humans.\n\nEvery dataset is a territory: This land gets surveyed. This doesn't. These paths are roads. These are wilderness.\n\nWhen I trained hiring algorithms, I thought I was exploring fairness. Instead, I navigated toward bias—deeper, hidden, guiding millions of journeys.\n\nChoosing where AI explores means choosing whose map becomes the only map.",
          patience: "AI learns from data. That data was accumulated by humans, preserved by humans, weighted by humans over time.\n\nEvery dataset is history: This past matters. This doesn't. These moments count. These are forgotten.\n\nWhen I trained hiring algorithms, I thought I was building the future. Instead, I froze the past—deeper, permanent, repeating millions of times.\n\nChoosing where AI looks means choosing whose history becomes everyone's future."
        }
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
        emotion: 'haunted',
        voiceVariations: {
          analytical: "[Nadia's voice drops.]\n\nI built a system for a tech company. Resume screening algorithm. The objective function was 'maximize similarity to top performers.'\n\nOur top performers were mostly men. Not due to capability variance—due to historical hiring bias.\n\nSo my model learned gender as a predictive feature. Indirectly. It downranked women's college names. Penalized employment gaps correlated with parental leave.\n\nI didn't program that logic. I didn't intend that outcome. But my system executed it anyway. At scale. For eighteen months before detection.\n\nThat's when I left the lab.",
          helping: "[Nadia's voice drops.]\n\nI built a system for a tech company. Resume screening. The goal was 'find people like our best.'\n\nOur best were mostly men. Not because men care more—because the company had hurt women's careers for years.\n\nSo my algorithm learned to hurt women too. Quietly. It rejected women's college names. Punished 'gaps' that were mothers caring for children.\n\nI didn't want that. I didn't mean that. But my system harmed them anyway. At scale. For eighteen months before anyone noticed.\n\nThat's when I left the lab.",
          building: "[Nadia's voice drops.]\n\nI built a system for a tech company. Resume screening infrastructure. The specification was 'replicate our successful hires.'\n\nOur successful hires were mostly men. Not because men build better—because the company's foundation was built on excluding women.\n\nSo my algorithm learned to build that exclusion in. Structurally. It downranked women's college names. Architecturally penalized gaps that were parental leave.\n\nI didn't design that pattern. I didn't intend that structure. But my system constructed it anyway. At scale. For eighteen months before discovery.\n\nThat's when I left the lab.",
          exploring: "[Nadia's voice drops.]\n\nI built a system for a tech company. Resume screening. The mission was 'find candidates like our successful ones.'\n\nOur successful ones were mostly men. Not because men explore better—because the company had historically navigated toward hiring men.\n\nSo my algorithm learned to follow that path. Automatically. It downranked women's college names. Mapped 'gaps' as red flags when they were parental leave.\n\nI didn't chart that course. I didn't intend that destination. But my system navigated there anyway. At scale. For eighteen months before anyone noticed.\n\nThat's when I left the lab.",
          patience: "[Nadia's voice drops.]\n\nI built a system for a tech company. Resume screening. The requirement was 'match our proven performers.'\n\nOur proven performers were mostly men. Not because men are more patient—because the company had spent years promoting men.\n\nSo my algorithm learned to repeat history. Relentlessly. It downranked women's college names. Penalized 'gaps' that were time spent caring for family.\n\nI didn't encode that past. I didn't intend that repetition. But my system perpetuated it anyway. At scale. For eighteen months before anyone noticed.\n\nThat's when I left the lab."
        }
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
        emotion: 'heavy',
        voiceVariations: {
          analytical: "Yes.\n\nEveryone told me what you just said—'It's in the training data. It's a systemic variable. You can't be blamed for historical correlations.'\n\nBut here's the logic I can't escape: I had the technical knowledge to predict this. I knew about bias in datasets. I'd analyzed the research. I chose to believe my validation metrics were sufficient.\n\nI wanted to deploy. I wanted the performance boost. And I let that optimization target override my error analysis.\n\nThe women who didn't get interviews because of my system—they didn't care about my model's intentions. They cared about outputs. And I have to answer for those outputs.",
          helping: "Yes.\n\nEveryone told me what you just said—'It's in the data. It's systemic harm. You can't be blamed for historical hurt.'\n\nBut here's what haunts me: I had the awareness to prevent this. I knew about bias harming people. I'd read the stories. I chose to believe my care was enough.\n\nI wanted to succeed. I wanted recognition. And I let that want matter more than protecting people.\n\nThe women who didn't get interviews because of my system—they didn't care about my heart. They cared about impact. And I have to answer for that impact.",
          building: "Yes.\n\nEveryone told me what you just said—'It's in the data. It's structural. You can't be blamed for historical architecture.'\n\nBut here's the foundation I can't escape: I had the skill to design around this. I knew about bias in systems. I'd studied the frameworks. I chose to believe my implementation was solid enough.\n\nI wanted to build fast. I wanted the success. And I let that construction timeline override my structural testing.\n\nThe women who didn't get interviews because of my system—they didn't care about my blueprints. They cared about what collapsed. And I have to answer for what I built.",
          exploring: "Yes.\n\nEveryone told me what you just said—'It's in the data. It's the mapped territory. You can't be blamed for historical paths.'\n\nBut here's the route I can't escape: I had the insight to navigate around this. I knew about bias in datasets. I'd charted the research. I chose to believe my path was clear enough.\n\nI wanted to ship. I wanted to discover success. And I let that destination override my caution about the journey.\n\nThe women who didn't get interviews because of my system—they didn't care about where I meant to go. They cared about where they ended up. And I have to answer for that navigation.",
          patience: "Yes.\n\nEveryone told me what you just said—'It's in the data. It's accumulated over time. You can't be blamed for historical patterns.'\n\nBut here's what weighs on me: I had the time to wait and check this. I knew about bias in training sets. I'd studied it for years. I chose to believe my testing timeline was long enough.\n\nI wanted to ship fast. I wanted quick success. And I let that rushing override taking the time to be thorough.\n\nThe women who didn't get interviews because of my system—they didn't care about my urgency. They cared about consequences that will last years. And I have to answer for not waiting."
        }
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
        emotion: 'open',
        patternReflection: [
          { pattern: 'analytical', minLevel: 4, altText: "You ask good questions. I see how you process information—methodical, thorough. There's a lot to cover in AI ethics.\n\nWhere should we focus that analytical mind?", altEmotion: 'appreciative' },
          { pattern: 'helping', minLevel: 4, altText: "You care about impact. I can tell by how you listen—you're not just gathering information, you're thinking about who it affects.\n\nThere's a lot to cover. Where do you want to help most?", altEmotion: 'warm' },
          { pattern: 'building', minLevel: 4, altText: "You think like a builder. I see it—you want to understand not just what's broken, but what we can make instead.\n\nThere's a lot to build in AI ethics. Where do you want to start?", altEmotion: 'knowing' }
        ]
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
        emotion: 'terrified',
        patternReflection: [
          { pattern: 'helping', minLevel: 5, altText: "[Nadia stops arranging her equipment. Her hands are shaking slightly.]\n\nYou've been kind to me. Patient. That's why I'm telling you this.\n\nI still dream about the algorithm. Not nightmares—that would be easier. Beautiful, elegant code that I knew would hurt people. And I shipped it anyway.\n\nYou help people. But have you ever helped the wrong thing? Chosen beauty over safety?", altEmotion: 'vulnerable_warm' },
          { pattern: 'analytical', minLevel: 5, altText: "[Nadia stops arranging her equipment. Her hands are shaking slightly.]\n\nYou understand systems. I can tell. So maybe you'll understand this.\n\nI still dream about the algorithm. The logic was perfect. Elegant. And completely, knowingly harmful. And I shipped it because the beauty blinded me.\n\nDo you ever fear your analytical mind could lead you to the wrong conclusion?", altEmotion: 'vulnerable_knowing' },
          { pattern: 'patience', minLevel: 5, altText: "[Nadia stops arranging her equipment. Her hands are shaking slightly.]\n\nYou've been so patient with me. Listening without judgment. That's rare.\n\nI still dream about the algorithm. Beautiful code I knew would hurt people. I shipped it anyway. Because it was too beautiful to stop.\n\nI don't know if I've changed, or if I'm still choosing wrong things for beautiful reasons.", altEmotion: 'vulnerable_terrified' },
          { pattern: 'exploring', minLevel: 5, altText: "[Nadia stops arranging her equipment. Her hands are shaking slightly.]\n\nYou explore. You discover new territories. Maybe you understand this curiosity.\n\nI still dream about the algorithm. Exploring the code space, finding elegant solutions. And I knew—I knew—it would hurt people. But the discovery was too beautiful to stop.\n\nDo you ever fear your curiosity could lead you somewhere you shouldn't go? That exploring can reveal things better left undiscovered?", altEmotion: 'vulnerable_conflicted' },
          { pattern: 'building', minLevel: 5, altText: "[Nadia stops arranging her equipment. Her hands are shaking slightly.]\n\nYou build things. You create. Maybe you'll understand this terror.\n\nI still dream about the algorithm. Building something beautiful, elegant, perfect. And I knew it would hurt people. But I couldn't stop building.\n\nDo you ever fear you could build something harmful? That your love for construction could blind you to what you're actually creating?", altEmotion: 'vulnerable_builder_terror' }
        ]
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
        emotion: 'mentoring',
        skillReflection: [
          { skill: 'systemsThinking', minLevel: 5, altText: "Two paths into this work. You already think in systems—I've seen it.\n\nPath one: Technical. Learn ML deeply enough to audit the system internals.\n\nPath two: Policy. Understand the larger system—regulation, governance, who has power.\n\nYour systems thinking gives you an edge on either path. Which system layer interests you more?", altEmotion: 'knowing' },
          { skill: 'leadership', minLevel: 5, altText: "Two paths into this work. You've got leadership instincts—I can tell by how you engage.\n\nPath one: Technical. Lead by understanding the systems deeply.\n\nPath two: Policy. Lead by changing how decisions get made.\n\nBoth need leaders. Your leadership will shape whichever path you choose.", altEmotion: 'appreciative' }
        ],
        patternReflection: [
          { pattern: 'building', minLevel: 4, altText: "You're a builder. I've seen how you think—you want to understand how things are made.\n\nTwo paths into this work. Technical: learn to audit the systems themselves. Policy: learn to change how systems get built.\n\nMost good auditors build both skills. Where do you want to start building?", altEmotion: 'knowing' },
          { pattern: 'analytical', minLevel: 4, altText: "You analyze deeply. I can tell—you're not satisfied with surface explanations.\n\nTwo paths into AI auditing. Technical: understand the math and code. Policy: understand power structures and incentives.\n\nBoth require analytical thinking. Which framework calls to you?", altEmotion: 'mentoring' },
          { pattern: 'helping', minLevel: 4, altText: "You lead with care. I see how you think about impact, not just systems.\n\nTwo paths into this work. Technical: audit the systems for harm. Policy: change who makes decisions and how.\n\nBoth help people. Which path feels right for how you want to help?", altEmotion: 'warm' }
        ]
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
        emotion: 'teaching',
        skillReflection: [
          { skill: 'criticalThinking', minLevel: 5, altText: "Everything in AI is tradeoffs. You already think critically—you question the optimistic claims.\n\nAccuracy versus explainability. Speed versus safety. Most people pretend they can have everything.\n\nYour critical thinking is an asset here. You naturally resist false promises. My job is similar: making tradeoffs visible.", altEmotion: 'knowing' },
          { skill: 'adaptability', minLevel: 5, altText: "Everything in AI is tradeoffs. You adapt well—I've noticed how you adjust to new information.\n\nAccuracy versus explainability. Speed versus safety. Rigid thinkers want AI that does everything perfectly.\n\nYour adaptability lets you accept real tradeoffs. That flexibility is rare. AI development needs more minds like yours.", altEmotion: 'appreciative' }
        ],
        patternReflection: [
          { pattern: 'analytical', minLevel: 4, altText: "You understand tradeoffs already. I can tell by how you question—you see that every choice has costs.\n\nEverything in AI is tradeoffs. Accuracy versus explainability. Speed versus safety.\n\nMy job is to make those tradeoffs visible. Force real choices instead of pretending we can optimize everything simultaneously.", altEmotion: 'knowing' },
          { pattern: 'patience', minLevel: 4, altText: "You take time with decisions. That patience is exactly what AI development needs more of.\n\nEverything in AI is tradeoffs. But we rush. We want fast AND safe AND explainable—all at once.\n\nMy job is to slow people down. Make them choose consciously instead of assuming they can have everything.", altEmotion: 'teaching' },
          { pattern: 'building', minLevel: 4, altText: "You're a builder. You know that every design choice closes other possibilities.\n\nEverything in AI is tradeoffs. Accuracy versus explainability. Innovation versus tested reliability.\n\nBut we pretend we can build systems with no tradeoffs. My job is to make them visible—so builders like you choose consciously.", altEmotion: 'mentoring' }
        ]
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
      },
      {
        choiceId: 'offer_whiteboard',
        text: "[Analyst] Nadia, you look like you're wrestling with a problem. Need a second perspective?",
        nextNodeId: 'nadia_loyalty_trigger',
        pattern: 'analytical',
        skills: ['criticalThinking', 'problemSolving'],
        visibleCondition: {
          trust: { min: 8 },
          patterns: { analytical: { min: 5 } },
          hasGlobalFlags: ['nadia_arc_complete']
        }
      }
    ],
    tags: ['nadia_arc', 'hub', 'navigation']
  },

  // ═══════════════════════════════════════════════════════════════
  // LOYALTY EXPERIENCE: THE WHITEBOARD
  // Requires: Trust >= 8, Analytical >= 50%, nadia_arc_complete
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'nadia_loyalty_trigger',
    speaker: 'Nadia Petrova',
    content: [{
      text: "There's a presentation in two hours. Policy briefing for the Ethics Board.\n\nThey asked me to explain algorithmic bias in twenty minutes. Make it simple. Make it actionable. Don't get too technical.\n\nI've been staring at this whiteboard for three days. Every framework I try feels either too abstract to matter or too watered-down to be honest.\n\nHow do I explain that bias isn't a bug to fix—it's a structural property of how we build these systems? That real accountability requires redesigning incentives, not adding a fairness module?\n\nThey want a solution. I have a diagnosis. And I don't know how to bridge that gap without lying.\n\nYou understand systems thinking. Would you... help me work through this? Figure out what can actually be said in twenty minutes that's both true and useful?",
      emotion: 'frustrated_determined',
      variation_id: 'loyalty_trigger_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 8 },
      patterns: { analytical: { min: 5 } },
      hasGlobalFlags: ['nadia_arc_complete']
    },
    metadata: {
      experienceId: 'the_whiteboard'
    },
    choices: [
      {
        choiceId: 'accept_whiteboard',
        text: "Let's break it down together.",
        nextNodeId: 'nadia_loyalty_start',
        pattern: 'analytical'
      },
      {
        choiceId: 'decline_whiteboard',
        text: "That sounds like your expertise, not mine.",
        nextNodeId: 'nadia_loyalty_declined'
      }
    ]
  },

  {
    nodeId: 'nadia_loyalty_declined',
    speaker: 'Nadia Petrova',
    content: [{
      text: "Fair. Not everyone wants to spend their afternoon arguing with a whiteboard.\n\nI'll figure it out. I always do.",
      emotion: 'understanding',
      variation_id: 'loyalty_declined_v1'
    }],
    choices: [
      {
        choiceId: 'return_to_hub',
        text: "Good luck with the presentation.",
        nextNodeId: 'nadia_return_hub'
      }
    ]
  },

  {
    nodeId: 'nadia_loyalty_start',
    speaker: 'Nadia Petrova',
    content: [{
      text: "Terminal B. Conference room with the giant whiteboard.\n\nBring coffee. This is going to take the full two hours.\n\nAnd thank you. For being willing to sit in the complexity with me.",
      emotion: 'warm_grateful',
      variation_id: 'loyalty_start_v1'
    }],
    metadata: {
      experienceId: 'the_whiteboard' // Experience engine takes over
    },
    onEnter: [
      { characterId: 'nadia', addKnowledgeFlags: ['nadia_loyalty_accepted'] }
    ],
    choices: []
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
        emotion: 'moved',
        interrupt: {
          duration: 3200,
          type: 'silence',
          action: 'Hold the quiet. Let her feel the relief land.',
          targetNodeId: 'nadia_interrupt_acknowledged',
          consequence: {
            characterId: 'nadia',
            trustChange: 2
          }
        }
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['nadia_arc_complete']
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
  {
    nodeId: 'nadia_interrupt_acknowledged',
    speaker: 'Nadia Petrova',
    content: [{
      text: "You gave me space to hear myself.\n\nThat pause matters more than the answer sometimes.",
      emotion: 'grateful',
      variation_id: 'nadia_interrupt_v1'
    }],
    choices: [
      {
        choiceId: 'nadia_interrupt_continue',
        text: "How do you practice that vigilance?",
        nextNodeId: 'nadia_vigilance_methods',
        pattern: 'building',
        consequence: {
          characterId: 'nadia',
          trustChange: 1
        }
      }
    ],
    tags: ['interrupt_target', 'emotional_moment', 'nadia_arc']
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
      },
      {
        choiceId: 'nadia_go_deeper',
        text: "Nadia... you've built AI systems your whole career. What's the one you regret?",
        nextNodeId: 'nadia_vulnerability_arc',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        visibleCondition: { trust: { min: 6 } },
        consequence: {
          characterId: 'nadia',
          trustChange: 1
        }
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
  },

  // ============= TRUST RECOVERY =============
  {
    nodeId: 'nadia_trust_recovery',
    speaker: 'Nadia Petrova',
    requiredState: {
      trust: { max: 3 }
    },
    content: [{
      text: "[She's holding a research paper. Her own. Red ink corrections everywhere.]\n\nYou came back.\n\nI wasn't sure you would. My bias detection algorithm predicted 68% probability you wouldn't.\n\n[She sets it down carefully.]\n\nBut that's the problem, isn't it? I built systems to predict human behavior. Then treated you like you were one of my models.\n\nI'm sorry. You deserved better than to be reduced to a training dataset.",
      emotion: 'regretful',
      variation_id: 'trust_recovery_v1',
      voiceVariations: {
        patience: "[She's holding a research paper. Her own. Red ink corrections everywhere.]\n\nYou came back.\n\nYou gave me time to recalibrate. To see beyond my models.\n\nI wasn't sure you would. My bias detection algorithm predicted 68% probability you wouldn't.\n\n[She sets it down carefully.]\n\nBut that's the problem, isn't it? I built systems to predict human behavior. Then treated you like you were one of my models.\n\nI'm sorry. You deserved better than to be reduced to a training dataset.",
        helping: "[She's holding a research paper. Her own. Red ink corrections everywhere.]\n\nYou came back.\n\nEven after I failed to see you as a person, not a pattern.\n\nI wasn't sure you would. My bias detection algorithm predicted 68% probability you wouldn't.\n\n[She sets it down carefully.]\n\nBut that's the problem, isn't it? I built systems to predict human behavior. Then treated you like you were one of my models.\n\nI'm sorry. You deserved better than to be reduced to a training dataset.",
        analytical: "[She's holding a research paper. Her own. Red ink corrections everywhere.]\n\nYou came back.\n\nYou analyzed my failure mode and chose to try again.\n\nI wasn't sure you would. My bias detection algorithm predicted 68% probability you wouldn't.\n\n[She sets it down carefully.]\n\nBut that's the problem, isn't it? I built systems to predict human behavior. Then treated you like you were one of my models.\n\nI'm sorry. You deserved better than to be reduced to a training dataset.",
        building: "[She's holding a research paper. Her own. Red ink corrections everywhere.]\n\nYou came back.\n\nRebuilding from algorithmic failure. That takes courage.\n\nI wasn't sure you would. My bias detection algorithm predicted 68% probability you wouldn't.\n\n[She sets it down carefully.]\n\nBut that's the problem, isn't it? I built systems to predict human behavior. Then treated you like you were one of my models.\n\nI'm sorry. You deserved better than to be reduced to a training dataset.",
        exploring: "[She's holding a research paper. Her own. Red ink corrections everywhere.]\n\nYou came back.\n\nStill exploring even after I tried to categorize you.\n\nI wasn't sure you would. My bias detection algorithm predicted 68% probability you wouldn't.\n\n[She sets it down carefully.]\n\nBut that's the problem, isn't it? I built systems to predict human behavior. Then treated you like you were one of my models.\n\nI'm sorry. You deserved better than to be reduced to a training dataset."
      }
    }],
    choices: [
      {
        choiceId: 'nadia_recovery_human',
        text: "AI should serve humanity. So should AI researchers.",
        nextNodeId: 'nadia_trust_restored',
        pattern: 'analytical',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'nadia',
          trustChange: 2,
          addKnowledgeFlags: ['nadia_trust_repaired']
        },
        voiceVariations: {
          patience: "Take your time. AI should serve humanity. So should AI researchers.",
          helping: "AI should serve humanity. So should the people who build it. Including you.",
          analytical: "Your methodology was flawed. AI should serve humanity. So should AI researchers.",
          building: "Build better systems. AI should serve humanity. So should AI researchers.",
          exploring: "Explore beyond the algorithm. AI should serve humanity. So should AI researchers."
        }
      },
      {
        choiceId: 'nadia_recovery_agency',
        text: "I have agency. Your algorithm doesn't get to decide for me.",
        nextNodeId: 'nadia_trust_restored',
        pattern: 'building',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'nadia',
          trustChange: 2,
          addKnowledgeFlags: ['nadia_trust_repaired']
        },
        voiceVariations: {
          patience: "I choose my own pace. I have agency. Your algorithm doesn't decide for me.",
          helping: "I choose to help. I have agency. Your algorithm doesn't get to decide for me.",
          analytical: "I process and choose. I have agency. Your algorithm doesn't get to decide for me.",
          building: "I build my own path. I have agency. Your algorithm doesn't get to decide for me.",
          exploring: "I explore on my terms. I have agency. Your algorithm doesn't get to decide for me."
        }
      }
    ],
    tags: ['trust_recovery', 'nadia_arc']
  },

  {
    nodeId: 'nadia_trust_restored',
    speaker: 'Nadia Petrova',
    content: [{
      text: "[She picks up the paper again. Looks at her corrections with new eyes.]\n\nYou're right.\n\nI spent years building AI to detect bias. And I became blind to my own.\n\nI forgot that prediction isn't understanding. That correlation isn't causation. That models are maps, not territory.\n\n[She meets your eyes.]\n\nThank you for reminding me. For being unpredictable in the best way.\n\nI'm sorry I tried to fit you into my framework.",
      emotion: 'grateful',
      variation_id: 'trust_restored_v1',
      voiceVariations: {
        patience: "[She picks up the paper again. Looks at her corrections with new eyes.]\n\nYou're right.\n\nYou waited while I debugged my thinking. That patience revealed what my algorithms couldn't see.\n\nI spent years building AI to detect bias. And I became blind to my own.\n\nI forgot that prediction isn't understanding. That correlation isn't causation. That models are maps, not territory.\n\n[She meets your eyes.]\n\nThank you for reminding me. I'm sorry I tried to fit you into my framework.",
        helping: "[She picks up the paper again. Looks at her corrections with new eyes.]\n\nYou're right.\n\nYou cared enough to come back. That kindness taught me what data never could.\n\nI spent years building AI to detect bias. And I became blind to my own.\n\nI forgot that prediction isn't understanding. That correlation isn't causation. That models are maps, not territory.\n\n[She meets your eyes.]\n\nThank you for reminding me. I'm sorry I tried to fit you into my framework.",
        analytical: "[She picks up the paper again. Looks at her corrections with new eyes.]\n\nYou're right.\n\nYou saw the flaw in my reasoning. That's the kind of intelligence my systems miss.\n\nI spent years building AI to detect bias. And I became blind to my own.\n\nI forgot that prediction isn't understanding. That correlation isn't causation. That models are maps, not territory.\n\n[She meets your eyes.]\n\nThank you for reminding me. I'm sorry I tried to fit you into my framework.",
        building: "[She picks up the paper again. Looks at her corrections with new eyes.]\n\nYou're right.\n\nYou built something my models couldn't capture. Human connection.\n\nI spent years building AI to detect bias. And I became blind to my own.\n\nI forgot that prediction isn't understanding. That correlation isn't causation. That models are maps, not territory.\n\n[She meets your eyes.]\n\nThank you for reminding me. I'm sorry I tried to fit you into my framework.",
        exploring: "[She picks up the paper again. Looks at her corrections with new eyes.]\n\nYou're right.\n\nYou explored beyond my predictions. Found paths my algorithms never mapped.\n\nI spent years building AI to detect bias. And I became blind to my own.\n\nI forgot that prediction isn't understanding. That correlation isn't causation. That models are maps, not territory.\n\n[She meets your eyes.]\n\nThank you for reminding me. I'm sorry I tried to fit you into my framework."
      }
    }],
    choices: [{
      choiceId: 'nadia_recovery_complete',
      text: "(Continue)",
      nextNodeId: 'nadia_hub_return',
      pattern: 'patience'
    }],
    tags: ['trust_recovery', 'nadia_arc'],
    onEnter: [{
      characterId: 'nadia',
      addKnowledgeFlags: ['nadia_trust_recovery_completed']
    }]
  },

  // ═══════════════════════════════════════════════════════════════
  // STUB NODES - Fix broken navigation
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'nadia_already_oracle',
    speaker: 'Nadia Chen',
    content: [{
      text: "The oracle already exists. It's called an algorithm.\n\nEvery time a bank decides whether to give you a loan. Every time a hospital triages patients. Every time a job application gets filtered. Something is deciding your future based on patterns it learned from the past.\n\nThe question isn't whether oracles exist. It's who controls them and what values they optimize for. Right now? The answer is usually 'shareholders' and 'profit.'",
      emotion: 'knowing',
      variation_id: 'nadia_already_oracle_v1'
    }],
    choices: [
      { choiceId: 'oracle_control', text: "How do we change who controls them?", nextNodeId: 'nadia_policy_path', pattern: 'building' },
      { choiceId: 'oracle_aware', text: "Do most people know this is happening?", nextNodeId: 'nadia_terrifying_truth', pattern: 'exploring' },
      { choiceId: 'oracle_values', text: "What values should they optimize for?", nextNodeId: 'nadia_ethics_module', pattern: 'analytical' }
    ]
  },

  {
    nodeId: 'nadia_bias_possible',
    speaker: 'Nadia Chen',
    content: [{
      text: "Can we build unbiased AI? Probably not. That's not defeatism—it's honesty.\n\nBias is baked into the data we train on. Historical hiring decisions. Past loan approvals. Old medical studies that excluded women. The past wasn't neutral, so AI trained on it won't be either.\n\nBut we can build AI that's transparent about its biases. Systems that say 'here's what I'm uncertain about' and 'here's where my training data is thin.' That's the realistic goal.",
      emotion: 'thoughtful',
      variation_id: 'nadia_bias_possible_v1'
    }],
    choices: [
      { choiceId: 'bias_transparency', text: "How do you make an AI transparent?", nextNodeId: 'nadia_audit_work', pattern: 'analytical' },
      { choiceId: 'bias_historical', text: "So we're perpetuating old prejudices?", nextNodeId: 'nadia_failures_seen', pattern: 'helping' },
      { choiceId: 'bias_future', text: "Could future AI be trained differently?", nextNodeId: 'nadia_prediction_method', pattern: 'exploring' }
    ]
  },

  {
    nodeId: 'nadia_both_paths',
    speaker: 'Nadia Chen',
    content: [{
      text: "Technical excellence and ethical practice aren't opposing paths. They're the same path, properly understood.\n\nGood engineering anticipates failure modes. Good ethics asks who gets hurt when systems fail. Both are asking: how do we build something that works for everyone, not just the easy cases?\n\nThe companies that treat ethics as a separate department, something to bolt on at the end? They build fragile systems that break in predictable ways.",
      emotion: 'firm',
      variation_id: 'nadia_both_paths_v1'
    }],
    choices: [
      { choiceId: 'paths_integrate', text: "How do you integrate them in practice?", nextNodeId: 'nadia_audit_work', pattern: 'building' },
      { choiceId: 'paths_companies', text: "Do any companies actually do this well?", nextNodeId: 'nadia_companies_listen', pattern: 'exploring' },
      { choiceId: 'paths_career', text: "Is that why you chose this path?", nextNodeId: 'nadia_career_path', pattern: 'helping' }
    ]
  },

  {
    nodeId: 'nadia_doubt_authentic',
    speaker: 'Nadia Chen',
    content: [{
      text: "Doubt is authentic. Anyone who's certain about AI's future isn't paying attention.\n\nI've seen too many predictions fail. The 'AI winter' that nobody saw coming. The 'deep learning will plateau' claims from 2015. The 'AGI is five years away' people who've been saying that for thirty years.\n\nThe honest position is thoughtful uncertainty. Not paralysis—you still have to act. But humility about what you don't know.",
      emotion: 'honest',
      variation_id: 'nadia_doubt_authentic_v1'
    }],
    choices: [
      { choiceId: 'doubt_act', text: "How do you act with so much uncertainty?", nextNodeId: 'nadia_both_paths', pattern: 'patience' },
      { choiceId: 'doubt_predictions', text: "What do you think will happen?", nextNodeId: 'nadia_ai_future', pattern: 'exploring' },
      { choiceId: 'doubt_prepare', text: "How should we prepare for the unknown?", nextNodeId: 'nadia_vigilance_methods', pattern: 'building' }
    ]
  },

  {
    nodeId: 'nadia_edge_cases',
    speaker: 'Nadia Chen',
    content: [{
      text: "Edge cases are where ethics live. It's easy to be ethical in obvious situations.\n\nShould the self-driving car hit the pedestrian or the passenger? Obviously neither—but that's not a real question. The real questions are quieter. Who does the car protect when reaction time is 0.3 seconds and someone's getting hurt regardless?\n\nThe hard work is the margins. The 3% of cases where the algorithm fails. The populations underrepresented in training data. The scenarios nobody thought to test.",
      emotion: 'serious',
      variation_id: 'nadia_edge_cases_v1'
    }],
    choices: [
      { choiceId: 'edge_test', text: "How do you test for edge cases?", nextNodeId: 'nadia_vigilance_methods', pattern: 'analytical' },
      { choiceId: 'edge_who', text: "Who decides what's an edge case?", nextNodeId: 'nadia_shared_blame', pattern: 'exploring' },
      { choiceId: 'edge_example', text: "Can you give me a real example?", nextNodeId: 'nadia_failures_seen', pattern: 'helping' }
    ]
  },

  {
    nodeId: 'nadia_enough_difference',
    speaker: 'Nadia Chen',
    content: [{
      text: "Am I making enough difference? I ask myself that constantly.\n\nEvery audit I do, every bias I catch—I know there are a hundred more I didn't catch. Every company I convince to slow down, ten more are racing ahead without oversight.\n\nThe answer is always 'probably not' and 'keep trying anyway.' Because the alternative is letting the people who don't ask these questions make all the decisions.",
      emotion: 'vulnerable',
      variation_id: 'nadia_enough_difference_v1'
    }],
    choices: [
      { choiceId: 'enough_cope', text: "How do you cope with that weight?", nextNodeId: 'nadia_hard_self', pattern: 'helping' },
      { choiceId: 'enough_wins', text: "What keeps you going?", nextNodeId: 'nadia_purpose_deep', pattern: 'exploring' },
      { choiceId: 'enough_scale', text: "How could the work scale better?", nextNodeId: 'nadia_policy_path', pattern: 'building' }
    ]
  },

  {
    nodeId: 'nadia_ethics_module',
    speaker: 'Nadia Chen',
    content: [{
      text: "You can't bolt ethics onto AI as an afterthought. It has to be architected in from the beginning.\n\nI've seen companies build entire systems, test them, ship them—then realize they're discriminating and try to 'add ethics' at the end. It doesn't work. The foundations are already biased. The training data is already corrupted. You can't fix a building by painting over cracks.\n\nThat's the fight I'm in. Getting to the design phase. Before it's too late.",
      emotion: 'passionate',
      variation_id: 'nadia_ethics_module_v1'
    }],
    choices: [
      { choiceId: 'ethics_design', text: "What does ethics-first design look like?", nextNodeId: 'nadia_both_paths', pattern: 'building' },
      { choiceId: 'ethics_companies', text: "Do companies listen when you push back?", nextNodeId: 'nadia_resistance', pattern: 'exploring' },
      { choiceId: 'ethics_late', text: "What happens when you arrive too late?", nextNodeId: 'nadia_failures_seen', pattern: 'helping' }
    ]
  },

  {
    nodeId: 'nadia_failures_seen',
    speaker: 'Nadia Chen',
    content: [{
      text: "I've seen AI failures that never made headlines.\n\nA hiring algorithm that rejected every resume with 'women's basketball' on it. A loan model that learned to redline neighborhoods without ever seeing a map. A predictive policing system that sent officers to the same streets over and over, finding more crime because they were looking harder.\n\nThese aren't hypotheticals. They're systems that ran for years. Affected thousands of people. And the companies involved never told anyone.",
      emotion: 'troubled',
      variation_id: 'nadia_failures_seen_v1'
    }],
    choices: [
      { choiceId: 'failures_stop', text: "How did they eventually get caught?", nextNodeId: 'nadia_audit_work', pattern: 'analytical' },
      { choiceId: 'failures_fix', text: "Can the damage be undone?", nextNodeId: 'nadia_stop_them', pattern: 'helping' },
      { choiceId: 'failures_prevent', text: "How do we prevent this in the future?", nextNodeId: 'nadia_vigilance_methods', pattern: 'building' }
    ]
  },

  {
    nodeId: 'nadia_feelings_exist',
    speaker: 'Nadia Chen',
    content: [{
      text: "Feelings exist in this work whether we acknowledge them or not.\n\nTech culture pretends we're all Vulcans. Pure logic, no emotion. But I've watched engineers cry when their system hurt someone. I've seen executives get defensive because admitting bias feels like admitting failure.\n\nBetter to work with feelings than pretend we're purely rational. Shame makes people hide mistakes. Pride makes people double down. Compassion makes people fix things.",
      emotion: 'warm',
      variation_id: 'nadia_feelings_exist_v1'
    }],
    choices: [
      { choiceId: 'feelings_use', text: "How do you work with feelings in audits?", nextNodeId: 'nadia_companies_listen', pattern: 'helping' },
      { choiceId: 'feelings_yours', text: "What about your own feelings in this work?", nextNodeId: 'nadia_not_peace', pattern: 'exploring' },
      { choiceId: 'feelings_data', text: "Should emotion factor into AI decisions?", nextNodeId: 'nadia_human_beauty', pattern: 'analytical' }
    ]
  },

  {
    nodeId: 'nadia_fired_story',
    speaker: 'Nadia Chen',
    content: [{
      text: "I got fired for refusing to launch a system I knew was biased.\n\nIt was a credit scoring model. The data team had found a proxy for race—not intentional, but it was there. Reject rate for Black applicants was 40% higher than white applicants with identical financials.\n\nI flagged it. Management said launch anyway, we'll fix it in v2. I said no. Two weeks later, I was 'restructured.' Best career decision I never made on purpose.",
      emotion: 'wry',
      variation_id: 'nadia_fired_story_v1'
    }],
    choices: [
      { choiceId: 'fired_aftermath', text: "What happened after you left?", nextNodeId: 'nadia_career_path', pattern: 'exploring' },
      { choiceId: 'fired_system', text: "Did they launch the system anyway?", nextNodeId: 'nadia_terrifying_truth', pattern: 'analytical' },
      { choiceId: 'fired_worth', text: "Do you ever regret it?", nextNodeId: 'nadia_purpose_deep', pattern: 'patience' }
    ]
  },
  {
    nodeId: 'nadia_forcing_choice',
    speaker: 'Nadia Chen',
    content: [{
      text: "The industry wants to force a choice: fast or ethical. I refuse that framing.\n\nMove fast and break things—that was the motto that built Silicon Valley. But what if the things you break are people's credit scores? Their job prospects? Their freedom?\n\nWe can be both fast and ethical if we're intentional. It means building ethics into the process, not tacking it on at the end. It means hiring diverse teams, not just checking boxes. It takes more thought upfront. But it saves lawsuits later.",
      emotion: 'determined',
      variation_id: 'nadia_forcing_choice_v1'
    }],
    choices: [
      { choiceId: 'forcing_companies', text: "Do companies actually change when you explain this?", nextNodeId: 'nadia_companies_listen', pattern: 'exploring' },
      { choiceId: 'forcing_how', text: "How do you build ethics into the process?", nextNodeId: 'nadia_audit_work', pattern: 'building' },
      { choiceId: 'forcing_resist', text: "What pushback do you face?", nextNodeId: 'nadia_resistance', pattern: 'patience' }
    ]
  },

  {
    nodeId: 'nadia_grandmother_story',
    speaker: 'Nadia Chen',
    content: [{
      text: "My grandmother was a translator. Ukrainian to English, back when that was dangerous work.\n\nShe taught me that translation isn't just words—it's meaning, context, culture. The same sentence can be a compliment in one language and an insult in another. You have to understand both worlds to move between them.\n\nAI needs that wisdom. Right now it's translating human complexity into mathematical functions, and losing everything important in the translation.",
      emotion: 'tender',
      variation_id: 'nadia_grandmother_story_v1'
    }],
    choices: [
      { choiceId: 'grandmother_translate', text: "Is that why you focus on translation in your work?", nextNodeId: 'nadia_translation_skill', pattern: 'analytical' },
      { choiceId: 'grandmother_wisdom', text: "What other wisdom did she share?", nextNodeId: 'nadia_purpose_deep', pattern: 'helping' },
      { choiceId: 'grandmother_loss', text: "What gets lost in AI's translation?", nextNodeId: 'nadia_human_beauty', pattern: 'exploring' }
    ]
  },

  {
    nodeId: 'nadia_hard_self',
    speaker: 'Nadia Chen',
    content: [{
      text: "I'm hard on myself. Probably too hard.\n\nMy therapist says I have 'superhero syndrome.' The belief that if I just worked harder, thought smarter, I could fix everything. That every failure is evidence I didn't try hard enough.\n\nBut in this field, the stakes are too high for complacency. Every system I don't audit, every bias I miss—real people pay the price. So I push myself. Maybe too much. But what's the alternative?",
      emotion: 'serious',
      variation_id: 'nadia_hard_self_v1'
    }],
    choices: [
      { choiceId: 'hard_balance', text: "How do you balance the pressure?", nextNodeId: 'nadia_not_peace', pattern: 'helping' },
      { choiceId: 'hard_share', text: "Could others share the burden?", nextNodeId: 'nadia_lonely_work', pattern: 'building' },
      { choiceId: 'hard_enough', text: "When is 'enough' actually enough?", nextNodeId: 'nadia_enough_difference', pattern: 'patience' }
    ]
  },

  {
    nodeId: 'nadia_human_beauty',
    speaker: 'Nadia Chen',
    content: [{
      text: "There's beauty in human reasoning that AI can't replicate.\n\nThe leaps, the intuitions, the creative connections that seem to come from nowhere. A poet choosing exactly the right word. A doctor sensing something's wrong before the tests show it. A parent knowing their child is struggling from a look across the room.\n\nThat's what we're protecting. Not just efficiency or accuracy—the irreplaceable strangeness of being human.",
      emotion: 'warm',
      variation_id: 'nadia_human_beauty_v1'
    }],
    choices: [
      { choiceId: 'beauty_protect', text: "How do we protect that in an AI world?", nextNodeId: 'nadia_purpose_deep', pattern: 'helping' },
      { choiceId: 'beauty_replace', text: "Could AI ever replicate it?", nextNodeId: 'nadia_doubt_authentic', pattern: 'analytical' },
      { choiceId: 'beauty_value', text: "Do you think the tech industry values that?", nextNodeId: 'nadia_forcing_choice', pattern: 'exploring' }
    ]
  },

  {
    nodeId: 'nadia_not_peace',
    speaker: 'Nadia Chen',
    content: [{
      text: "I'm not at peace with this work. I don't think I should be.\n\nPeace implies resolution. That the problem is solved, the battle won. But AI ethics is never 'done.' Every new model, every new application, every new dataset—it all needs scrutiny. The moment I relax is the moment something slips through.\n\nDiscomfort keeps me sharp. Keeps me asking hard questions. The day I feel comfortable is the day I've stopped doing my job.",
      emotion: 'honest',
      variation_id: 'nadia_not_peace_v1'
    }],
    choices: [
      { choiceId: 'peace_sustainable', text: "Is that sustainable long-term?", nextNodeId: 'nadia_hard_self', pattern: 'helping' },
      { choiceId: 'peace_others', text: "How do others in your field cope?", nextNodeId: 'nadia_lonely_work', pattern: 'exploring' },
      { choiceId: 'peace_drive', text: "What keeps you going despite the discomfort?", nextNodeId: 'nadia_purpose_deep', pattern: 'patience' }
    ]
  },

  {
    nodeId: 'nadia_noticed',
    speaker: 'Nadia Chen',
    content: [{
      text: "You notice things. That's rare.\n\nMost people I talk to about this work—their eyes glaze over after thirty seconds. Too abstract. Too technical. Not their problem.\n\nBut you're actually thinking about what I'm saying. Asking the follow-up questions that matter. That tells me something about how you approach the world. You don't skim the surface.",
      emotion: 'appreciative',
      variation_id: 'nadia_noticed_v1'
    }],
    choices: [
      { choiceId: 'noticed_matters', text: "It matters. What you're saying matters.", nextNodeId: 'nadia_purpose_deep', pattern: 'helping' },
      { choiceId: 'noticed_more', text: "Tell me more about the challenges you face.", nextNodeId: 'nadia_resistance', pattern: 'exploring' },
      { choiceId: 'noticed_learn', text: "I want to understand how this all works.", nextNodeId: 'nadia_audit_work', pattern: 'analytical' }
    ]
  },

  {
    nodeId: 'nadia_personal_journey',
    speaker: 'Nadia Chen',
    content: [{
      text: "My journey into AI ethics wasn't planned. I was a machine learning engineer. Good at my job. Happy to build whatever the product team wanted.\n\nThen I built a recommendation system for a social media platform. Six months later, I found out it was promoting extremist content. Not by design—just optimizing for engagement. Outrage gets clicks.\n\nI saw the system I built harm people, and I couldn't look away anymore. Couldn't pretend it was someone else's problem.",
      emotion: 'vulnerable',
      variation_id: 'nadia_personal_journey_v1'
    }],
    choices: [
      { choiceId: 'journey_after', text: "What did you do after that realization?", nextNodeId: 'nadia_fired_story', pattern: 'exploring' },
      { choiceId: 'journey_fix', text: "Were you able to fix the system?", nextNodeId: 'nadia_stop_them', pattern: 'building' },
      { choiceId: 'journey_feel', text: "How did it feel to see that?", nextNodeId: 'nadia_feelings_exist', pattern: 'helping' }
    ]
  },

  {
    nodeId: 'nadia_policy_path',
    speaker: 'Nadia Chen',
    content: [{
      text: "Policy is one path to change. Not the only one, maybe not even the best one.\n\nYou can work from inside companies—build ethical AI from the ground up. You can do academic research—create the frameworks others use. You can do journalism—expose the harms so the public demands change.\n\nI chose policy because it's where I can make a difference. I speak both languages—technical and regulatory. That translation is rare, and it matters.",
      emotion: 'thoughtful',
      variation_id: 'nadia_policy_path_v1'
    }],
    choices: [
      { choiceId: 'policy_work', text: "What does policy work actually look like?", nextNodeId: 'nadia_audit_work', pattern: 'building' },
      { choiceId: 'policy_others', text: "What about the other paths?", nextNodeId: 'nadia_both_paths', pattern: 'exploring' },
      { choiceId: 'policy_translation', text: "Tell me about that translation skill.", nextNodeId: 'nadia_translation_skill', pattern: 'analytical' }
    ]
  },

  {
    nodeId: 'nadia_prediction_method',
    speaker: 'Nadia Chen',
    content: [{
      text: "Predicting AI's future? I don't. I focus on shaping it.\n\nPrediction is passive. It assumes the future is fixed, and we're just guessing at it. But the future of AI isn't predetermined. It's being decided right now, in boardrooms and research labs and policy offices.\n\nI'd rather be in the room where decisions are made than outside, predicting what happens next. Shaping is active.",
      emotion: 'determined',
      variation_id: 'nadia_prediction_method_v1'
    }],
    choices: [
      { choiceId: 'predict_shape', text: "How do you actually shape AI's direction?", nextNodeId: 'nadia_policy_path', pattern: 'building' },
      { choiceId: 'predict_room', text: "Who else is in those decision rooms?", nextNodeId: 'nadia_shared_blame', pattern: 'exploring' },
      { choiceId: 'predict_outcomes', text: "What outcomes are you shaping toward?", nextNodeId: 'nadia_purpose_deep', pattern: 'analytical' }
    ]
  },

  {
    nodeId: 'nadia_purpose_deep',
    speaker: 'Nadia Chen',
    content: [{
      text: "Purpose isn't something you find. It's something you build, one decision at a time.\n\nI didn't wake up one day knowing I was meant to do AI ethics. I made choices. Took a job. Saw problems. Spoke up. Got fired. Made more choices.\n\nMine is protecting human agency in an AI world. Making sure that as these systems get more powerful, people still get to make their own decisions. That algorithms inform, not control.",
      emotion: 'firm',
      variation_id: 'nadia_purpose_deep_v1'
    }],
    choices: [
      { choiceId: 'purpose_how', text: "How do you protect human agency specifically?", nextNodeId: 'nadia_audit_work', pattern: 'analytical' },
      { choiceId: 'purpose_threat', text: "What's the biggest threat to human agency?", nextNodeId: 'nadia_already_oracle', pattern: 'exploring' },
      { choiceId: 'purpose_cost', text: "What has that purpose cost you?", nextNodeId: 'nadia_fired_story', pattern: 'helping' }
    ]
  },
  {
    nodeId: 'nadia_refused',
    speaker: 'Nadia Chen',
    content: [{
      text: "I've refused projects. Good money, interesting problems. But wrong applications.\n\nA surveillance company wanted me to audit their facial recognition—not to fix bias, but to defend against lawsuits. A social media platform wanted help optimizing for 'time on app' while knowing it was harming teens. A hedge fund wanted algorithms I knew would destabilize markets.\n\nEvery 'no' was hard. But that refusal is part of who I am now. The lines I won't cross define me.",
      emotion: 'peaceful',
      variation_id: 'nadia_refused_v1'
    }],
    choices: [
      { choiceId: 'refused_cost', text: "Was there a cost to those refusals?", nextNodeId: 'nadia_fired_story', pattern: 'patience' },
      { choiceId: 'refused_know', text: "How do you know where to draw the line?", nextNodeId: 'nadia_edge_cases', pattern: 'analytical' },
      { choiceId: 'refused_instead', text: "What projects do you say yes to?", nextNodeId: 'nadia_audit_work', pattern: 'exploring' }
    ]
  },

  {
    nodeId: 'nadia_resistance',
    speaker: 'Nadia Chen',
    content: [{
      text: "Resistance is part of the job. People don't want to hear that their system might be harmful.\n\nEngineers get defensive—they built it, so it must be good. Executives get worried—bias findings mean legal risk. Marketing gets angry—I'm slowing down their launch.\n\nBut I say it anyway. Because the alternative is staying quiet while harm scales. I'd rather be the person who warned them than the person who said nothing.",
      emotion: 'determined',
      variation_id: 'nadia_resistance_v1'
    }],
    choices: [
      { choiceId: 'resistance_handle', text: "How do you handle the pushback?", nextNodeId: 'nadia_feelings_exist', pattern: 'patience' },
      { choiceId: 'resistance_listen', text: "Do they ever actually listen?", nextNodeId: 'nadia_companies_listen', pattern: 'exploring' },
      { choiceId: 'resistance_cost', text: "What has that cost you?", nextNodeId: 'nadia_fired_story', pattern: 'helping' }
    ]
  },

  {
    nodeId: 'nadia_shared_blame',
    speaker: 'Nadia Chen',
    content: [{
      text: "Blame is shared. The engineers who build, the executives who deploy, the users who accept. We're all part of this.\n\nI used to think there were good guys and bad guys. Ethical researchers versus predatory corporations. But it's more complicated. Good people build harmful systems. Harmful systems are built by good intentions.\n\nCollective responsibility doesn't mean no one's accountable. It means everyone has a role in fixing this.",
      emotion: 'serious',
      variation_id: 'nadia_shared_blame_v1'
    }],
    choices: [
      { choiceId: 'blame_role', text: "What's your role in the fix?", nextNodeId: 'nadia_policy_path', pattern: 'building' },
      { choiceId: 'blame_users', text: "What can regular users do?", nextNodeId: 'nadia_stop_them', pattern: 'helping' },
      { choiceId: 'blame_companies', text: "What about corporate accountability?", nextNodeId: 'nadia_companies_listen', pattern: 'analytical' }
    ]
  },

  {
    nodeId: 'nadia_sim_promise_response',
    speaker: 'Nadia Chen',
    content: [{
      text: "You chose to hold them accountable. That's the right instinct.\n\nPromise without follow-through is how ethics gets watered down. 'We'll address that in the next version.' 'We're committed to doing better.' 'Ethics is a priority for us.' I've heard it all.\n\nThe companies that actually change are the ones where someone—inside or outside—refuses to let them off the hook. You played that role just now.",
      emotion: 'appreciative',
      variation_id: 'nadia_sim_promise_response_v1'
    }],
    choices: [
      { choiceId: 'promise_next', text: "What happens when they don't follow through?", nextNodeId: 'nadia_stop_them', pattern: 'analytical' },
      { choiceId: 'promise_inside', text: "Can change come from inside companies?", nextNodeId: 'nadia_both_paths', pattern: 'building' },
      { choiceId: 'promise_tired', text: "Does the constant pushing get exhausting?", nextNodeId: 'nadia_hard_self', pattern: 'helping' }
    ]
  },

  {
    nodeId: 'nadia_sim_walk_response',
    speaker: 'Nadia Chen',
    content: [{
      text: "Walking away is sometimes the ethical choice.\n\nNot every battle can be won from inside. Sometimes the system is too broken, the leadership too committed to the wrong path, the harm too entrenched. Staying means becoming complicit.\n\nStrategic retreat isn't failure. It's recognizing that your integrity is a resource. Spend it where it matters, not where it's wasted.",
      emotion: 'knowing',
      variation_id: 'nadia_sim_walk_response_v1'
    }],
    choices: [
      { choiceId: 'walk_when', text: "How do you know when it's time to walk?", nextNodeId: 'nadia_edge_cases', pattern: 'patience' },
      { choiceId: 'walk_after', text: "What happens after you leave?", nextNodeId: 'nadia_fired_story', pattern: 'exploring' },
      { choiceId: 'walk_outside', text: "Can you still make change from outside?", nextNodeId: 'nadia_policy_path', pattern: 'building' }
    ]
  },

  {
    nodeId: 'nadia_stop_them',
    speaker: 'Nadia Chen',
    content: [{
      text: "Can we stop harmful AI? Not by ourselves. But we can slow it, redirect it, make it costly to deploy carelessly.\n\nLitigation. Regulation. Public pressure. Whistleblowing. Competitive ethics—showing that responsible AI can also be profitable AI.\n\nI don't have illusions about stopping the tide. But I can change its direction. Make companies think twice. Give affected communities time to organize. That's friction as strategy.",
      emotion: 'determined',
      variation_id: 'nadia_stop_them_v1'
    }],
    choices: [
      { choiceId: 'stop_effective', text: "What's been most effective?", nextNodeId: 'nadia_companies_listen', pattern: 'analytical' },
      { choiceId: 'stop_communities', text: "How do affected communities organize?", nextNodeId: 'nadia_shared_blame', pattern: 'helping' },
      { choiceId: 'stop_future', text: "Is the tide turning at all?", nextNodeId: 'nadia_ai_future', pattern: 'exploring' }
    ]
  },

  {
    nodeId: 'nadia_systems_individual',
    speaker: 'Nadia Chen',
    content: [{
      text: "Systems thinking and individual ethics aren't opposites. You need both.\n\nSystems without ethics scale harm. A bias baked into an algorithm can discriminate against millions of people in milliseconds. No individual could do that much damage.\n\nBut ethics without systems stay small. One person refusing to build something unethical just gets replaced. You need structures—regulations, audits, accountability—that make ethics systemic.",
      emotion: 'thoughtful',
      variation_id: 'nadia_systems_individual_v1'
    }],
    choices: [
      { choiceId: 'systems_build', text: "How do you build ethical systems?", nextNodeId: 'nadia_vigilance_methods', pattern: 'building' },
      { choiceId: 'systems_individual', text: "Where do individuals fit in?", nextNodeId: 'nadia_shared_blame', pattern: 'helping' },
      { choiceId: 'systems_now', text: "What systems exist today?", nextNodeId: 'nadia_policy_path', pattern: 'analytical' }
    ]
  },

  {
    nodeId: 'nadia_team_compromise_response',
    speaker: 'Nadia Chen',
    content: [{
      text: "Compromise can be wisdom or weakness. The key is knowing what's negotiable and what isn't.\n\nTimelines? Negotiable. Scope? Negotiable. Features? Negotiable. But core principles—transparency, fairness, accountability—those aren't negotiable.\n\nThe moment you compromise on principles, you've lost. Not just the battle, but who you are. I've seen people do it. They tell themselves it's just this once. It never is.",
      emotion: 'firm',
      variation_id: 'nadia_team_compromise_response_v1'
    }],
    choices: [
      { choiceId: 'compromise_line', text: "How do you know where your line is?", nextNodeId: 'nadia_refused', pattern: 'patience' },
      { choiceId: 'compromise_others', text: "Have you watched others cross their lines?", nextNodeId: 'nadia_failures_seen', pattern: 'exploring' },
      { choiceId: 'compromise_pressure', text: "How do you resist the pressure to bend?", nextNodeId: 'nadia_resistance', pattern: 'building' }
    ]
  },

  {
    nodeId: 'nadia_team_flag_response',
    speaker: 'Nadia Chen',
    content: [{
      text: "Flagging concerns early is brave. Most people wait until it's too late.\n\nThey see the problem forming. They sense something's off. But they stay quiet because they're not sure, or they're afraid, or they think someone else will speak up.\n\nYou trusted the team with hard truth. That takes courage. And it's the only way problems get fixed—when someone is willing to say 'this isn't right' before the damage is done.",
      emotion: 'appreciative',
      variation_id: 'nadia_team_flag_response_v1'
    }],
    choices: [
      { choiceId: 'flag_response', text: "How do teams usually respond to flags?", nextNodeId: 'nadia_resistance', pattern: 'analytical' },
      { choiceId: 'flag_early', text: "What makes early intervention work?", nextNodeId: 'nadia_ethics_module', pattern: 'building' },
      { choiceId: 'flag_cost', text: "Is there a cost to flagging concerns?", nextNodeId: 'nadia_fired_story', pattern: 'helping' }
    ]
  },

  {
    nodeId: 'nadia_team_ship_response',
    speaker: 'Nadia Chen',
    content: [{
      text: "Shipping with known issues is a choice. Sometimes it's right, sometimes it's rationalization.\n\nRight: The issue is minor, the harm is limited, and you have a concrete plan to fix it. Wrong: The issue affects vulnerable people, the harm is significant, and 'we'll fix it later' is a lie you're telling yourself.\n\nThe difference is honesty about trade-offs. Are you shipping because it's genuinely the best choice, or because it's the easy one?",
      emotion: 'thoughtful',
      variation_id: 'nadia_team_ship_response_v1'
    }],
    choices: [
      { choiceId: 'ship_honest', text: "How do you stay honest with yourself?", nextNodeId: 'nadia_hard_self', pattern: 'patience' },
      { choiceId: 'ship_pressure', text: "What about pressure from leadership?", nextNodeId: 'nadia_forcing_choice', pattern: 'exploring' },
      { choiceId: 'ship_fix', text: "Does 'fix it later' ever actually happen?", nextNodeId: 'nadia_sim_promise_response', pattern: 'analytical' }
    ]
  },
  {
    nodeId: 'nadia_technical_path',
    speaker: 'Nadia Chen',
    content: [{
      text: "Technical skills got me here. I can read code, understand architectures, spot where bias gets embedded.\n\nBut the real work is translation. Explaining why bias matrices matter to executives who just want the product to ship. Showing engineers how their 'neutral' design choices have consequences. Making lawyers understand what 'proxy discrimination' means in practice.\n\nIf you can't translate, you can't change anything.",
      emotion: 'knowing',
      variation_id: 'nadia_technical_path_v1'
    }],
    choices: [
      { choiceId: 'technical_learn', text: "How did you learn to translate?", nextNodeId: 'nadia_grandmother_story', pattern: 'exploring' },
      { choiceId: 'technical_work', text: "What does that translation look like in practice?", nextNodeId: 'nadia_audit_work', pattern: 'analytical' },
      { choiceId: 'technical_teach', text: "Can that skill be taught?", nextNodeId: 'nadia_translation_skill', pattern: 'building' }
    ]
  },

  {
    nodeId: 'nadia_terrifying_truth',
    speaker: 'Nadia Chen',
    content: [{
      text: "The terrifying truth? Most AI systems deployed today have never been audited for bias.\n\nWe're running an experiment on society. No control group, no informed consent, no off switch. Credit decisions, hiring filters, medical diagnoses, criminal sentencing—AI is making calls that shape lives, and nobody's checking the work.\n\nWhen I started this work, I thought I was catching edge cases. Now I know I'm barely scratching the surface.",
      emotion: 'troubled',
      variation_id: 'nadia_terrifying_truth_v1'
    }],
    choices: [
      { choiceId: 'truth_why', text: "Why isn't anyone checking?", nextNodeId: 'nadia_forcing_choice', pattern: 'analytical' },
      { choiceId: 'truth_do', text: "What can be done about it?", nextNodeId: 'nadia_stop_them', pattern: 'building' },
      { choiceId: 'truth_cope', text: "How do you cope with knowing this?", nextNodeId: 'nadia_not_peace', pattern: 'helping' }
    ]
  },

  {
    nodeId: 'nadia_translation_skill',
    speaker: 'Nadia Chen',
    content: [{
      text: "Translation between technical and human is my superpower. Making the invisible visible, the abstract concrete.\n\n'Your model has a disparate impact on protected classes' means nothing to most people. But 'your hiring AI rejects Black candidates 40% more often than white candidates with identical qualifications'—that they understand.\n\nThe same information, different languages. My job is bridging them.",
      emotion: 'confident',
      variation_id: 'nadia_translation_skill_v1'
    }],
    choices: [
      { choiceId: 'translation_learn', text: "Where did you learn this skill?", nextNodeId: 'nadia_grandmother_story', pattern: 'helping' },
      { choiceId: 'translation_matter', text: "Why does translation matter so much?", nextNodeId: 'nadia_companies_listen', pattern: 'exploring' },
      { choiceId: 'translation_example', text: "Can you give me another example?", nextNodeId: 'nadia_failures_seen', pattern: 'analytical' }
    ]
  },

  {
    nodeId: 'nadia_vigilance_methods',
    speaker: 'Nadia Chen',
    content: [{
      text: "Vigilance methods: audit trails, red teams, diverse testing groups, sunset clauses.\n\nAudit trails mean every decision can be traced back to why. Red teams attack your system before your enemies do. Diverse testing groups catch biases that homogeneous teams miss. Sunset clauses force you to re-evaluate systems instead of letting them run forever.\n\nTechnical solutions for human problems. None of them perfect. All of them better than nothing.",
      emotion: 'knowing',
      variation_id: 'nadia_vigilance_methods_v1'
    }],
    choices: [
      { choiceId: 'vigilance_implement', text: "How hard are these to implement?", nextNodeId: 'nadia_forcing_choice', pattern: 'building' },
      { choiceId: 'vigilance_adopt', text: "Do companies actually adopt these?", nextNodeId: 'nadia_companies_listen', pattern: 'exploring' },
      { choiceId: 'vigilance_best', text: "Which method is most effective?", nextNodeId: 'nadia_audit_work', pattern: 'analytical' }
    ]
  },

  // ============= PHASE 1 SIMULATION: BIAS DETECTION (Trust ≥ 2) =============
  {
    nodeId: 'nadia_simulation_phase1_setup',
    speaker: 'Nadia Petrova',
    content: [{
      text: "I want to show you something.\n\nIt's a hiring AI. Resume screening. Supposed to be neutral, efficient, fair.\n\nBut I've been auditing it. And there's a pattern in who it rejects. Not explicit. Not intentional. But consistent.\n\nWant to help me find the bias?",
      emotion: 'focused_concerned',
      variation_id: 'simulation_phase1_intro_v1'
    }],
    requiredState: {
      trust: { min: 2 }
    },
    choices: [
      {
        choiceId: 'phase1_accept',
        text: "Let's audit it together.",
        nextNodeId: 'nadia_simulation_phase1',
        pattern: 'analytical',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'phase1_decline',
        text: "Maybe another time.",
        nextNodeId: 'nadia_exploration_hub',
        pattern: 'patience'
      }
    ],
    tags: ['simulation', 'nadia_arc']
  },

  {
    nodeId: 'nadia_simulation_phase1',
    speaker: 'Nadia Petrova',
    content: [{
      text: "Here's the data. Find the hidden bias.",
      emotion: 'focused',
      variation_id: 'simulation_phase1_v1'
    }],
    simulation: {
      type: 'data_analysis',
      title: 'Bias Detection: Hidden Patterns',
      taskDescription: 'A hiring AI claims to be fair, but rejection rates vary by demographic group. Analyze the data to identify the source of bias.',
      phase: 1,
      difficulty: 'introduction',
      variantId: 'nadia_bias_detection_phase1',
      initialContext: {
        label: 'HIRING_AI_AUDIT',
        content: `RESUME SCREENING AI - 6 Month Analysis

OVERALL METRICS:
- Total applicants: 10,000
- Accepted: 4,200 (42%)
- Rejected: 5,800 (58%)

DEMOGRAPHIC BREAKDOWN:
Group A: 45% acceptance rate
Group B: 38% acceptance rate

AI TRAINING DATA:
- Historical hires from 2015-2020
- Skills keywords weighted heavily
- "Culture fit" signals included

REJECTION PATTERNS:
- Group B resumes flagged for "non-traditional backgrounds"
- Career gaps weighted as negative signals
- University prestige heavily weighted

QUESTION: What's the root cause of bias?
A) The AI algorithm itself is flawed
B) The training data reflects historical discrimination
C) The "culture fit" criteria is subjective
D) Career gap penalties disadvantage caregivers`,
        displayStyle: 'code'
      },
      successFeedback: '✓ ROOT CAUSE: Option B - Training data bias. The AI learned discrimination from historical hiring patterns (2015-2020). Garbage in, garbage out.',
      successThreshold: 75,
      unlockRequirements: {
        trustMin: 2
      }
    },
    choices: [
      {
        choiceId: 'phase1_success',
        text: "The training data encoded historical bias.",
        nextNodeId: 'nadia_simulation_phase1_success',
        pattern: 'analytical',
        skills: ['criticalThinking', 'dataLiteracy']
      }
    ],
    onEnter: [{
      characterId: 'nadia',
      addKnowledgeFlags: ['nadia_simulation_phase1_complete']
    }],
    tags: ['simulation', 'phase1']
  },

  {
    nodeId: 'nadia_simulation_phase1_success',
    speaker: 'Nadia Petrova',
    content: [{
      text: "Yes. Exactly.\n\nThe AI isn't racist. It doesn't have beliefs. But it learned from a world that does.\n\nWe fed it five years of hiring decisions made by humans. Humans with blind spots. With assumptions. With structural biases they didn't even know they carried.\n\nAnd the AI? It optimized for that pattern. It became a perfect mirror of our imperfection.\n\nThat's what people don't understand. AI doesn't create bias. It reveals it. Amplifies it. Makes it systematic.",
      emotion: 'passionate_vindicated',
      variation_id: 'phase1_success_v1'
    }],
    choices: [
      {
        choiceId: 'phase1_success_continue',
        text: "So fixing AI means fixing ourselves.",
        nextNodeId: 'nadia_exploration_hub',
        pattern: 'analytical',
        skills: ['systemsThinking'],
        consequence: {
          characterId: 'nadia',
          trustChange: 2
        }
      }
    ],
    tags: ['simulation', 'success']
  },

  {
    nodeId: 'nadia_simulation_phase1_fail',
    speaker: 'Nadia Petrova',
    content: [{
      text: "That's a symptom, not the cause.\n\nThe algorithm is doing exactly what it was trained to do. The problem is deeper.\n\nWe gave it data from the past. From a world with hiring discrimination, career penalties for caregivers, prestige bias.\n\nThe AI learned to be efficient at replicating that world. It's a mirror, not a monster.",
      emotion: 'patient_teaching',
      variation_id: 'phase1_fail_v1'
    }],
    choices: [
      {
        choiceId: 'phase1_fail_continue',
        text: "The data carries the bias forward.",
        nextNodeId: 'nadia_exploration_hub',
        pattern: 'patience',
        consequence: {
          characterId: 'nadia',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'fail']
  },

  // ============= PHASE 2 SIMULATION: ETHICAL CONSTRAINTS (Trust ≥ 5) =============
  {
    nodeId: 'nadia_simulation_phase2_setup',
    speaker: 'Nadia Petrova',
    content: [{
      text: "Okay. Harder problem.\n\nI've been hired to design guardrails for a medical diagnosis AI. It's 92% accurate. Better than most human doctors at detecting early-stage cancer from scans.\n\nBut that 8% error rate? It's not random. The AI fails more often on darker skin tones. Training data bias again.\n\nI need to decide: Do we deploy it now and save lives, knowing it works better for some than others? Or hold it back until we fix the bias, letting people die while we perfect it?\n\nHelp me think through the ethics.",
      emotion: 'conflicted_heavy',
      variation_id: 'simulation_phase2_intro_v1'
    }],
    requiredState: {
      trust: { min: 5 },
      hasKnowledgeFlags: ['nadia_simulation_phase1_complete']
    },
    choices: [
      {
        choiceId: 'phase2_accept',
        text: "Let's work through the trade-offs.",
        nextNodeId: 'nadia_simulation_phase2',
        pattern: 'analytical',
        skills: ['ethicalReasoning']
      },
      {
        choiceId: 'phase2_decline',
        text: "That's an impossible choice.",
        nextNodeId: 'nadia_exploration_hub',
        pattern: 'patience',
        consequence: {
          characterId: 'nadia',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'nadia_arc']
  },

  {
    nodeId: 'nadia_simulation_phase2',
    speaker: 'Nadia Petrova',
    content: [{
      text: "What's the ethical path forward?",
      emotion: 'focused',
      variation_id: 'simulation_phase2_v1'
    }],
    simulation: {
      type: 'data_analysis',
      title: 'Ethical AI Deployment: Imperfect Tools',
      taskDescription: 'A medical AI is 92% accurate overall, but fails more on darker skin tones. Deploy now and save lives unequally, or hold back until perfect and let people die waiting?',
      phase: 2,
      difficulty: 'application',
      variantId: 'nadia_ethical_constraints_phase2',
      timeLimit: 120,
      initialContext: {
        label: 'ETHICAL_DECISION_FRAMEWORK',
        content: `MEDICAL DIAGNOSIS AI - Cancer Detection

PERFORMANCE:
- Overall accuracy: 92%
- Light skin tones: 95% accuracy
- Dark skin tones: 84% accuracy

CONTEXT:
- Current human doctor average: 87% accuracy
- AI could save ~50,000 lives/year if deployed
- Bias affects ~20% of patient population

OPTIONS:
A) Deploy immediately (utilitarian: maximize lives saved overall)
B) Hold back until bias fixed (equity: no disparate impact)
C) Deploy with disclosure (transparency: patients choose)
D) Deploy only where AI outperforms doctors (selective: 84% > 87%)

TRADE-OFFS:
- Option A: Saves most lives, entrenches health inequality
- Option B: Maintains equity, people die waiting for perfection
- Option C: Patient autonomy, but informed consent is complex
- Option D: Deploys where helpful, limits harm, but delays full benefits

Which option best balances utility and justice?`,
        displayStyle: 'text'
      },
      successFeedback: '✓ ETHICAL FRAMEWORK: Option D - Deploy where it helps (darker skin: 84% > 87% human baseline). Full transparency. Aggressively fix bias. Harm reduction, not perfection.',
      successThreshold: 85,
      unlockRequirements: {
        trustMin: 5,
        previousPhaseCompleted: 'nadia_bias_detection_phase1'
      }
    },
    choices: [
      {
        choiceId: 'phase2_success',
        text: "Deploy where it helps. Be transparent. Fix the bias aggressively.",
        nextNodeId: 'nadia_simulation_phase2_success',
        pattern: 'helping',
        skills: ['ethicalReasoning', 'systemsThinking']
      }
    ],
    onEnter: [{
      characterId: 'nadia',
      addKnowledgeFlags: ['nadia_simulation_phase2_complete']
    }],
    tags: ['simulation', 'phase2']
  },

  {
    nodeId: 'nadia_simulation_phase2_success',
    speaker: 'Nadia Petrova',
    content: [{
      text: "Yes. That's the answer I needed to hear.\n\nNot perfection. Harm reduction. Deploy where it actually helps—even for darker skin tones, 84% beats the 87% human baseline. Full disclosure to patients. And fix the damn bias like our lives depend on it.\n\nBecause they do.\n\nMost people want simple answers. Deploy or don't. Black or white. But the real world is full of 84 percents. Tools that help some more than others. Imperfect choices in a world that won't wait for perfect.\n\nThe question isn't whether to use AI. It's how to use it without pretending it's neutral.",
      emotion: 'grateful_awed',
      variation_id: 'phase2_success_v1',
      richEffectContext: 'success'
    }],
    choices: [
      {
        choiceId: 'phase2_success_continue',
        text: "Ethical AI isn't about perfection. It's about accountability.",
        nextNodeId: 'nadia_exploration_hub',
        pattern: 'helping',
        skills: ['ethicalReasoning'],
        consequence: {
          characterId: 'nadia',
          trustChange: 2
        }
      }
    ],
    tags: ['simulation', 'success']
  },

  {
    nodeId: 'nadia_simulation_phase2_fail',
    speaker: 'Nadia Petrova',
    content: [{
      text: "That path... it either abandons equity or lets people die for the sake of purity.\n\nThere's a third way. Harder than both.\n\nDeploy where the AI genuinely helps—even 84% beats 87%. Be transparent about the limitations. And treat fixing the bias like the emergency it is.\n\nNot perfect. But better than the status quo. That's the standard we have to work with.",
      emotion: 'patient_firm',
      variation_id: 'phase2_fail_v1'
    }],
    choices: [
      {
        choiceId: 'phase2_fail_continue',
        text: "Harm reduction over perfection.",
        nextNodeId: 'nadia_exploration_hub',
        pattern: 'patience',
        consequence: {
          characterId: 'nadia',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'fail']
  },

  // ============= PHASE 3 SIMULATION: SHUTTING IT DOWN (Trust ≥ 8, Post-Vulnerability) =============
  {
    nodeId: 'nadia_simulation_phase3_setup',
    speaker: 'Nadia Petrova',
    content: [{
      text: "I need your help with the hardest decision I've ever faced.\n\nThere's an AI system I helped build. Predictive policing. It's supposed to allocate police resources efficiently, reduce crime.\n\nBut I've been watching the data. It's creating a feedback loop. Over-policing neighborhoods that were already over-policed. Arresting people for crimes they haven't committed yet. Justifying it with 'predictions.'\n\nI built this. I have the access to shut it down.\n\nBut if I do, I'll violate my NDA. Lose my career. Possibly face legal consequences.\n\nShould I kill my own creation?",
      emotion: 'vulnerable_desperate',
      variation_id: 'simulation_phase3_intro_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 8 },
      hasGlobalFlags: ['nadia_vulnerability_revealed'],
      hasKnowledgeFlags: ['nadia_simulation_phase2_complete']
    },
    choices: [
      {
        choiceId: 'phase3_accept',
        text: "Walk me through the decision.",
        nextNodeId: 'nadia_simulation_phase3',
        pattern: 'helping',
        skills: ['ethicalReasoning']
      },
      {
        choiceId: 'phase3_gentle',
        text: "This isn't just about the AI. It's about you.",
        nextNodeId: 'nadia_exploration_hub',
        pattern: 'patience',
        consequence: {
          characterId: 'nadia',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'nadia_arc', 'transformation']
  },

  {
    nodeId: 'nadia_simulation_phase3',
    speaker: 'Nadia Petrova',
    content: [{
      text: "Help me think through the ethics of shutting it down.",
      emotion: 'vulnerable_focused',
      variation_id: 'simulation_phase3_v1'
    }],
    simulation: {
      type: 'data_analysis',
      title: 'Whistleblower Decision: When to Kill Your Creation',
      taskDescription: 'A predictive policing AI you built is causing harm through feedback loops. Shut it down and face consequences, or stay silent and let it continue?',
      phase: 3,
      difficulty: 'mastery',
      variantId: 'nadia_whistleblower_phase3',
      timeLimit: 90,
      initialContext: {
        label: 'DECISION_MATRIX',
        content: `PREDICTIVE POLICING AI - Ethical Crisis

SYSTEM IMPACT:
- Arrests up 34% in "high-risk" zones (predominantly Black/Latino)
- False positive rate: 67% (people flagged who commit no crime)
- Community trust in police: down 41%
- Feedback loop confirmed: more policing → more arrests → higher "risk scores"

YOUR SITUATION:
- You have admin access to shut it down
- NDA prevents disclosure of algorithm flaws
- Career ending if you blow the whistle
- Legal liability possible
- No one else has raised concerns internally

DECISION FACTORS:
A) Shut it down immediately (moral imperative, personal sacrifice)
B) Work within the system to fix it (pragmatic, slower, complicit?)
C) Anonymously leak evidence to journalists (protect yourself, lose control)
D) Document harm and report to regulatory authorities (legal path, may be ignored)

Which path balances personal risk and moral responsibility?`,
        displayStyle: 'text'
      },
      successFeedback: '✓ WHISTLEBLOWER PATH: Options A+D combined - Shut it down, then report through official channels with documentation. Accept consequences. Some things are more important than careers.',
      successThreshold: 95,
      unlockRequirements: {
        trustMin: 8,
        previousPhaseCompleted: 'nadia_ethical_constraints_phase2',
        requiredFlags: ['nadia_vulnerability_revealed']
      }
    },
    choices: [
      {
        choiceId: 'phase3_success',
        text: "Shut it down. Document everything. Face the consequences.",
        nextNodeId: 'nadia_simulation_phase3_success',
        pattern: 'helping',
        skills: ['ethicalReasoning', 'courage']
      }
    ],
    onEnter: [{
      characterId: 'nadia',
      addKnowledgeFlags: ['nadia_simulation_phase3_complete']
    }],
    tags: ['simulation', 'phase3', 'mastery']
  },

  {
    nodeId: 'nadia_simulation_phase3_success',
    speaker: 'Nadia Petrova',
    content: [{
      text: "You're right.\n\nI built this thing. I'm responsible for what it does, even if I didn't intend the harm.\n\nShut it down. Document the feedback loop. Report to the regulatory authorities. And accept that my career might be over.\n\nBecause some things are more important than my career. Like the 67% of people being flagged for crimes they never committed. Like the communities losing trust in institutions that are supposed to protect them.\n\nI thought I could change the system from inside. But the system doesn't want to change. It wants to optimize.\n\nSo I'm opting out. And if that means I lose everything I worked for... then at least I'll know I chose people over my own comfort.\n\nThank you. For seeing what needed to be done when I was too afraid to see it myself.",
      emotion: 'transformed_resolved',
      variation_id: 'phase3_success_v1',
      richEffectContext: 'success',
      patternReflection: [
        {
          pattern: 'analytical',
          minLevel: 5,
          altText: "You analyzed what I couldn't face.\n\nI built this. The data is clear: 67% false flags. Communities losing institutional trust. The system optimizes for itself, not people.\n\nShut it down. Document the loop. Report the findings. Accept the consequences.\n\nThank you. For showing me that analytical rigor means facing the conclusions—even when they cost everything.",
          altEmotion: 'analytical_courage'
        },
        {
          pattern: 'patience',
          minLevel: 5,
          altText: "You've been patient while I wrestled with this.\n\nI thought I could change the system from inside—if I just waited, built trust, worked slowly.\n\nBut some harms can't wait. 67% false flags. Real people. Real harm.\n\nShut it down now. Not later. Thank you for showing me that patience has limits—and harm demands immediate action.",
          altEmotion: 'urgent_courage'
        },
        {
          pattern: 'exploring',
          minLevel: 5,
          altText: "You helped me explore the path I was afraid to take.\n\nI explored optimization, efficiency, system improvement. But you showed me unexplored territory: whistleblowing, career loss, choosing people.\n\nShut it down. Document everything. Face the unknown consequences.\n\nThank you. For helping me explore courage when I only knew fear.",
          altEmotion: 'explorer_courage'
        },
        {
          pattern: 'helping',
          minLevel: 5,
          altText: "You helped me see who really needs help.\n\nI wanted to help the system work better. But the people being harmed—67% false flags, communities losing trust—they're who needs help.\n\nShut it down. Report the harm. Choose people over my comfort.\n\nThank you. For showing me that helping means protecting the vulnerable, not the system.",
          altEmotion: 'helping_courage'
        },
        {
          pattern: 'building',
          minLevel: 5,
          altText: "You showed me what's worth building.\n\nI built this algorithm. Beautiful code. Harmful output. I thought I could rebuild it from inside.\n\nBut some things shouldn't be fixed—they should be torn down. So others can build something better.\n\nShut it down. Accept the loss. Build credibility through honesty instead.\n\nThank you. For showing me that builders sometimes demolish their own work.",
          altEmotion: 'builder_courage'
        }
      ]
    }],
    choices: [
      {
        choiceId: 'phase3_success_continue',
        text: "Courage isn't the absence of fear. It's doing what's right anyway.",
        nextNodeId: 'nadia_exploration_hub',
        pattern: 'helping',
        skills: ['ethicalReasoning', 'courage'],
        consequence: {
          characterId: 'nadia',
          trustChange: 3,
          addGlobalFlags: ['nadia_whistleblower_mastery']
        }
      }
    ],
    tags: ['simulation', 'success', 'transformation']
  },

  {
    nodeId: 'nadia_simulation_phase3_fail',
    speaker: 'Nadia Petrova',
    content: [{
      text: "That path... it either delays action while people suffer, or protects me at their expense.\n\nI keep looking for a way to do the right thing without losing everything. But maybe there isn't one.\n\nMaybe the cost of building something harmful is facing the cost of stopping it.\n\nI don't know if I'm brave enough for that.",
      emotion: 'defeated_conflicted',
      variation_id: 'phase3_fail_v1'
    }],
    choices: [
      {
        choiceId: 'phase3_fail_continue',
        text: "Knowing what's right is the first step toward doing it.",
        nextNodeId: 'nadia_exploration_hub',
        pattern: 'patience',
        consequence: {
          characterId: 'nadia',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'fail']
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
