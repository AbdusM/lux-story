/**
 * Dante Moreau's Dialogue Graph
 * The Reformed Closer - Sales/Marketing Specialist
 *
 * LinkedIn 2026 Roles: #8 Advertising Sales, #10 Sales Executives, #13 Field Marketing, #16 Business Dev
 * Animal: Peacock (blue/teal/gold palette)
 * Tier: 3 (Secondary) - 35 nodes target, 6 voice variations
 *
 * Core Conflict: Natural charmer who fears his gift for persuasion. Wants to sell truth, not just products.
 * Backstory: From New Orleans, learned to read people young. Questions ethics of influence.
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const danteDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'dante_introduction',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_intro_v1',
        text: "You caught me practicing. Not my pitch—my pause.\n\nSee, anyone can learn to talk. The real skill? Knowing when to stop.\n\nMost people in sales never learn that. They think silence is failure. I think silence is where trust lives.",
        emotion: 'charming',
        patternReflection: [
          { pattern: 'helping', minLevel: 5, altText: "You caught me practicing. Not my pitch—my pause.\n\nYou're not here to be sold to. I can tell. People who genuinely want to help have this... quality. Like they're already listening before you speak.", altEmotion: 'warm' },
          { pattern: 'analytical', minLevel: 5, altText: "You caught me practicing. Not my pitch—my pause.\n\nYou're analyzing me already. Good. I'd rather work with someone who questions than someone who just nods.", altEmotion: 'appreciative' },
          { pattern: 'building', minLevel: 5, altText: "You caught me practicing. Not my pitch—my pause.\n\nYou've got builder's eyes. Looking at me like I'm a system to understand, not a person to charm. I respect that.", altEmotion: 'genuine' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'dante_intro_silence',
        text: "Silence as trust. That's not the sales I've heard about.",
        nextNodeId: 'dante_silence_truth',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        voiceVariations: {
          analytical: "The correlation between silence and trust—walk me through that.",
          building: "You're reengineering what sales means.",
          exploring: "What does silence teach you that words can't?",
          helping: "Trust takes courage. Silence takes even more.",
          patience: "Silence. Let's stay there a moment."
        }
      },
      {
        choiceId: 'dante_intro_practice',
        text: "You practice pausing?",
        nextNodeId: 'dante_practice_pause',
        pattern: 'exploring',
        skills: ['curiosity', 'communication'],
        voiceVariations: {
          exploring: "Practicing pauses. That's... unexpected. Show me.",
          analytical: "What's your methodology for pause optimization?",
          building: "How do you build intentional silence into conversation?",
          helping: "There's care in that practice. Why does it matter to you?",
          patience: "Practice. That implies intentionality."
        }
      },
      {
        choiceId: 'dante_intro_skill',
        text: "So the skill isn't talking—it's restraint.",
        nextNodeId: 'dante_restraint',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'emotionalIntelligence'],
        voiceVariations: {
          patience: "Restraint. That's harder than any pitch.",
          analytical: "Self-regulation as core competency. Interesting.",
          building: "Building space into conversation.",
          exploring: "What do you restrain yourself from?",
          helping: "Restraint in service of the other person."
        },
        consequence: {
          characterId: 'dante',
          trustChange: 1
        }
      },
      {
        choiceId: 'dante_intro_new_orleans',
        text: "That accent. New Orleans?",
        nextNodeId: 'dante_new_orleans',
        pattern: 'exploring',
        skills: ['communication', 'culturalCompetence'],
        voiceVariations: {
          exploring: "That lilt in your voice. Louisiana?",
          helping: "You carry home in how you speak.",
          analytical: "Regional influence on communication style?",
          building: "Accent tells a story of where you built yourself.",
          patience: "New Orleans. That explains the rhythm."
        }
      },
      {
        choiceId: 'dante_intro_show_work',
        text: "Show me what you're working on.",
        nextNodeId: 'dante_sim_reluctant',
        pattern: 'exploring',
        skills: ['curiosity', 'learningAgility'],
        voiceVariations: {
          exploring: "Can you show me what this looks like in practice?",
          analytical: "Let me see your methodology in action.",
          building: "Walk me through a real scenario.",
          helping: "I'd love to see how you help people.",
          patience: "Demonstrate. I'll observe."
        }
      }
    ],
    onEnter: [
      { addGlobalFlags: ['met_dante'] },
      { characterId: 'dante', addKnowledgeFlags: ['dante_met'] }
    ],
    tags: ['dante_intro', 'first_meeting']
  },

  // ============= SILENCE AND TRUST =============
  {
    nodeId: 'dante_silence_truth',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_silence_v1',
        text: "Traditional sales is a performance. You're right to be skeptical.\n\nBut here's what I learned: when I stopped performing and started listening, my close rate went up. Not because I got better at manipulation—because I got better at understanding.\n\nSilence isn't a technique. It's respect.",
        emotion: 'earnest'
      }
    ],
    choices: [
      {
        choiceId: 'dante_silence_respect',
        text: "Respect for what exactly?",
        nextNodeId: 'dante_respect_depth',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence']
      },
      {
        choiceId: 'dante_silence_learned',
        text: "What made you stop performing?",
        nextNodeId: 'dante_stopped_performing',
        pattern: 'helping',
        skills: ['empathy', 'communication'],
        consequence: {
          characterId: 'dante',
          trustChange: 1
        }
      },
      {
        choiceId: 'dante_silence_hub',
        text: "I'd like to explore more of your approach.",
        nextNodeId: 'dante_exploration_hub',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['dante_arc', 'philosophy', 'sales']
  },

  {
    nodeId: 'dante_practice_pause',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_practice_v1',
        text: "Every morning. I set a timer, ask myself a hard question, and don't let myself answer for sixty seconds.\n\nTry it. Ask yourself what you really want from your career. Then wait. Don't fill the silence. Let the real answer surface.\n\nThe first answer is always the safe one. The real answer takes time.",
        emotion: 'teaching'
      }
    ],
    choices: [
      {
        choiceId: 'dante_try_pause',
        text: "[Try the sixty-second pause.]",
        nextNodeId: 'dante_pause_experience',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'grounding']
      },
      {
        choiceId: 'dante_why_hard',
        text: "Why a hard question specifically?",
        nextNodeId: 'dante_hard_questions',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['dante_arc', 'practice', 'exercise']
  },

  // ============= PAUSE EXPERIENCE =============
  {
    nodeId: 'dante_pause_experience',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_pause_exp_v1',
        text: "[Dante watches you, silent. The station hums around you both. Time stretches.]\n\n...There. Did you feel it? The moment when your brain stopped performing and started reflecting?\n\nThat's the space I'm trying to create in every conversation. That's where real decisions happen.",
        emotion: 'quiet_satisfied'
      }
    ],
    choices: [
      {
        choiceId: 'dante_felt_it',
        text: "I felt it. Uncomfortable but... honest.",
        nextNodeId: 'dante_honest_discomfort',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'emotionalIntelligence'],
        consequence: {
          characterId: 'dante',
          trustChange: 2
        }
      },
      {
        choiceId: 'dante_analyze_pause',
        text: "What's actually happening neurologically in that moment?",
        nextNodeId: 'dante_neuro_pause',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['dante_arc', 'exercise', 'silence']
  },

  // ============= RESTRAINT PHILOSOPHY =============
  {
    nodeId: 'dante_restraint',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_restraint_v1',
        text: "Exactly. I can close anyone. That's not bragging—it's a warning.\n\nI learned to sell before I learned ethics. Grew up reading people because I had to. By twenty, I could get anyone to buy anything.\n\nThat's when I realized: power without restraint isn't a gift. It's a liability.",
        emotion: 'serious'
      }
    ],
    choices: [
      {
        choiceId: 'dante_grew_up',
        text: "You learned to read people because you had to. What happened?",
        nextNodeId: 'dante_childhood',
        pattern: 'helping',
        skills: ['empathy', 'communication'],
        consequence: {
          characterId: 'dante',
          trustChange: 1,
          addKnowledgeFlags: ['asked_dante_past']
        }
      },
      {
        choiceId: 'dante_power_ethics',
        text: "So how do you decide when to use that power?",
        nextNodeId: 'dante_ethics_framework',
        pattern: 'analytical',
        skills: ['integrity', 'criticalThinking']
      },
      {
        choiceId: 'dante_liability',
        text: "A liability to whom?",
        nextNodeId: 'dante_liability_who',
        pattern: 'patience',
        skills: ['criticalThinking']
      }
    ],
    tags: ['dante_arc', 'philosophy', 'ethics']
  },

  // ============= NEW ORLEANS ORIGIN =============
  {
    nodeId: 'dante_new_orleans',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_nola_v1',
        text: "Born in the Ninth Ward. My grandmother sold pralines outside Jackson Square.\n\nShe taught me the first rule of sales: make them feel seen before you try to make a sale. She never once pitched her candy. She just... noticed people. Remembered their names. Asked about their kids.\n\nPeople came back because she made them feel human. The pralines were almost incidental.",
        emotion: 'nostalgic'
      }
    ],
    choices: [
      {
        choiceId: 'dante_grandmother',
        text: "Your grandmother sounds wise.",
        nextNodeId: 'dante_grandmother_lessons',
        pattern: 'helping',
        skills: ['empathy', 'communication'],
        consequence: {
          characterId: 'dante',
          trustChange: 1
        }
      },
      {
        choiceId: 'dante_ninth_ward',
        text: "The Ninth Ward. Katrina?",
        nextNodeId: 'dante_katrina',
        pattern: 'exploring',
        skills: ['culturalCompetence']
      },
      {
        choiceId: 'dante_pralines_lesson',
        text: "Product incidental, connection primary. That flips everything.",
        nextNodeId: 'dante_flip_everything',
        pattern: 'analytical',
        skills: ['criticalThinking', 'financialLiteracy']
      }
    ],
    tags: ['dante_arc', 'backstory', 'new_orleans']
  },

  // ============= EXPLORATION HUB =============
  {
    nodeId: 'dante_exploration_hub',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_hub_v1',
        text: "I'm an open book. Well—a book you have to read carefully. Every chapter has two meanings.\n\nWhat aspect of sales and connection interests you most?",
        emotion: 'inviting'
      }
    ],
    choices: [
      {
        choiceId: 'dante_hub_ethics',
        text: "The ethics of persuasion.",
        nextNodeId: 'dante_ethics_deep',
        pattern: 'analytical',
        skills: ['integrity']
      },
      {
        choiceId: 'dante_hub_technique',
        text: "Your actual techniques.",
        nextNodeId: 'dante_techniques',
        pattern: 'building',
        skills: ['communication', 'financialLiteracy']
      },
      {
        choiceId: 'dante_hub_story',
        text: "Your story. How you got here.",
        nextNodeId: 'dante_origin_story',
        pattern: 'helping',
        skills: ['empathy']
      },
      {
        choiceId: 'dante_hub_samuel',
        text: "I should check on other areas of the station.",
        nextNodeId: samuelEntryPoints.HUB_INITIAL,
        pattern: 'exploring',
        skills: ['adaptability']
      }
    ],
    tags: ['dante_arc', 'hub', 'navigation']
  },

  // ============= ETHICS DEEP DIVE =============
  {
    nodeId: 'dante_ethics_deep',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_ethics_v1',
        text: "Here's my line: I never sell anyone something they don't need.\n\nSounds simple. It's not. Because 'need' is subjective. Do they need it, or have I convinced them they need it?\n\nI had a prospect once. Single mom, needed a car. I could have upsold her into debt that would have followed her for years. Instead, I found her a reliable used sedan and lost my commission.\n\nThat's the day I knew who I wanted to be.",
        emotion: 'reflective'
      }
    ],
    choices: [
      {
        choiceId: 'dante_single_mom',
        text: "Tell me more about her.",
        nextNodeId: 'dante_single_mom_story',
        pattern: 'helping',
        skills: ['empathy', 'communication'],
        consequence: {
          characterId: 'dante',
          trustChange: 2,
          addKnowledgeFlags: ['dante_car_story']
        }
      },
      {
        choiceId: 'dante_lost_commission',
        text: "Did you ever regret losing that commission?",
        nextNodeId: 'dante_no_regrets',
        pattern: 'exploring',
        skills: ['criticalThinking']
      },
      {
        choiceId: 'dante_need_line',
        text: "But who decides 'need'?",
        nextNodeId: 'dante_need_philosophy',
        pattern: 'analytical',
        skills: ['integrity', 'criticalThinking']
      }
    ],
    tags: ['dante_arc', 'ethics', 'defining_moment']
  },

  // ============= SINGLE MOM STORY =============
  {
    nodeId: 'dante_single_mom_story',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_mom_v1',
        text: "Her name was Desiree. Two kids. Working double shifts at a hospital.\n\nShe came in looking at a new SUV—the big one with the leather seats. She'd seen an ad. Thought she deserved something nice after everything she'd been through.\n\nAnd she did deserve something nice. But what she needed was reliability and low payments. I could see the math in her budget. The SUV would have broken her.\n\nSo I walked her to the used lot. Found a Honda Accord with 40,000 miles. Her payments were half what they would have been.\n\nShe cried. Not from disappointment—from relief. Because I saw her as a person, not a commission check.\n\nThat's who I want to be. Every time.",
        emotion: 'moved'
      }
    ],
    choices: [
      {
        choiceId: 'dante_desiree_outcome',
        text: "Did you ever see her again?",
        nextNodeId: 'dante_desiree_follow',
        pattern: 'helping',
        skills: ['empathy'],
        consequence: {
          characterId: 'dante',
          trustChange: 1
        }
      },
      {
        choiceId: 'dante_ethics_return',
        text: "How do you apply that to everything you do?",
        nextNodeId: 'dante_ethics_application',
        pattern: 'building',
        skills: ['integrity', 'systemsThinking']
      }
    ],
    tags: ['dante_arc', 'ethics', 'vulnerability', 'defining_moment']
  },

  // ============= TECHNIQUES =============
  {
    nodeId: 'dante_techniques',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_tech_v1',
        text: "Alright, let me break it down. My approach has three pillars:\n\n**Listen First**: Before I pitch anything, I ask questions until I truly understand what someone needs.\n\n**Mirror, Don't Manipulate**: Reflect back what they've told me. Help them see their own thinking clearly.\n\n**Exit Gracefully**: If what I'm selling isn't right for them, I tell them. Better to lose a sale than lose trust.\n\nNotice what's missing? Persuasion tricks. Pressure tactics. Manufactured urgency.\n\nThose work short-term. I'm building something longer.",
        emotion: 'teaching'
      }
    ],
    choices: [
      {
        choiceId: 'dante_listen_first',
        text: "How do you know when you've listened enough?",
        nextNodeId: 'dante_listening_depth',
        pattern: 'patience',
        skills: ['communication', 'communication']
      },
      {
        choiceId: 'dante_mirror_how',
        text: "What does 'mirror, don't manipulate' look like in practice?",
        nextNodeId: 'dante_mirroring',
        pattern: 'building',
        skills: ['communication', 'emotionalIntelligence']
      },
      {
        choiceId: 'dante_exit_cost',
        text: "Exiting gracefully costs money. How do you afford that?",
        nextNodeId: 'dante_exit_economics',
        pattern: 'analytical',
        skills: ['financialLiteracy', 'criticalThinking']
      }
    ],
    tags: ['dante_arc', 'techniques', 'sales']
  },

  // ============= ORIGIN STORY =============
  {
    nodeId: 'dante_origin_story',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_origin_v1',
        text: "You want the real version or the one I tell at networking events?\n\n...Okay. Real version.\n\nGrew up poor in New Orleans. Mom worked three jobs. Dad wasn't around. I learned early that charm was currency.\n\nBy fifteen, I was running small hustles. Nothing illegal—just a kid who knew how to make people feel important. Got into sales young. Rose fast.\n\nBut somewhere along the way, I started feeling empty. Like I was becoming a caricature of myself. All persona, no person.\n\nThat's when I came to Birmingham. Started over. Decided to figure out who I actually am beneath all the charm.",
        emotion: 'vulnerable'
      }
    ],
    choices: [
      {
        choiceId: 'dante_who_actual',
        text: "And who are you? Beneath the charm?",
        nextNodeId: 'dante_beneath_charm',
        pattern: 'helping',
        skills: ['empathy', 'communication'],
        consequence: {
          characterId: 'dante',
          trustChange: 2,
          addKnowledgeFlags: ['dante_vulnerable']
        }
      },
      {
        choiceId: 'dante_why_birmingham',
        text: "Why Birmingham specifically?",
        nextNodeId: 'dante_birmingham_choice',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'dante_origin_reflect',
        text: "Starting over takes courage.",
        nextNodeId: 'dante_courage_acknowledgment',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['dante_arc', 'backstory', 'vulnerability']
  },

  // ============= VULNERABILITY ARC =============
  {
    nodeId: 'dante_vulnerability_arc',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_vuln_v1',
        text: "[Dante's usual ease falters. He looks past you.]\n\nYou want to know my real fear?\n\nI'm terrified I don't know how to be genuine anymore. That all my interactions are some version of a pitch. Even this conversation—part of me is tracking your responses, adjusting my delivery.\n\nI've been performing so long I'm not sure where the act ends and I begin.\n\nWhat if there's nothing underneath?",
        emotion: 'scared'
      }
    ],
    requiredState: { trust: { min: 6 } },
    onEnter: [
      { characterId: 'dante', addKnowledgeFlags: ['dante_vulnerability_revealed'] }
    ],
    choices: [
      {
        choiceId: 'dante_vuln_something_there',
        text: "The fact that you're asking means there's something underneath.",
        nextNodeId: 'dante_something_underneath',
        pattern: 'helping',
        skills: ['empathy', 'emotionalIntelligence'],
        consequence: {
          characterId: 'dante',
          trustChange: 2
        }
      },
      {
        choiceId: 'dante_vuln_performing_now',
        text: "Are you performing right now?",
        nextNodeId: 'dante_performing_now',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication']
      },
      {
        choiceId: 'dante_vuln_understand',
        text: "[Stay quiet. Let the question hang between you.]",
        nextNodeId: 'dante_silent_understanding',
        pattern: 'patience',
        skills: ['grounding', 'emotionalIntelligence'],
        consequence: {
          characterId: 'dante',
          trustChange: 2
        }
      }
    ],
    tags: ['dante_arc', 'vulnerability', 'deep_trust']
  },

  // ============= SIMULATION: THE RELUCTANT BUYER =============
  {
    nodeId: 'dante_sim_reluctant',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_sim_v1',
        text: "Alright, let me show you something. A scenario I use to train new salespeople.\n\nPicture this: You're selling software to a small business owner. She's hesitant—been burned by tech promises before. She needs the solution, but she doesn't trust the process.\n\nMost salespeople would push harder. Overcome objections. Create urgency.\n\nWhat would you do?",
        emotion: 'teaching'
      }
    ],
    choices: [
      {
        choiceId: 'dante_sim_listen',
        text: "I'd ask what burned her before.",
        nextNodeId: 'dante_sim_listen_response',
        pattern: 'helping',
        skills: ['communication', 'empathy']
      },
      {
        choiceId: 'dante_sim_demo',
        text: "I'd offer a free trial. Let her experience it risk-free.",
        nextNodeId: 'dante_sim_demo_response',
        pattern: 'building',
        skills: ['problemSolving', 'financialLiteracy']
      },
      {
        choiceId: 'dante_sim_walk',
        text: "I'd acknowledge her hesitation might be warranted and offer to walk away.",
        nextNodeId: 'dante_sim_walk_response',
        pattern: 'patience',
        skills: ['integrity', 'emotionalIntelligence'],
        consequence: {
          characterId: 'dante',
          trustChange: 1
        }
      }
    ],
    tags: ['dante_sim', 'simulation', 'sales']
  },

  // ============= LISTENING DEPTH =============
  {
    nodeId: 'dante_listening_depth',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_listen_v1',
        text: "You've listened enough when they say something that surprises you.\n\nNot because they're unpredictable—but because you finally got past their surface answers. When someone tells you something they didn't plan to share, you're in real territory.\n\nThat's when the conversation actually starts.",
        emotion: 'knowing'
      }
    ],
    choices: [
      {
        choiceId: 'dante_surprise_example',
        text: "Can you give me an example?",
        nextNodeId: 'dante_surprise_story',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'dante_listen_return',
        text: "Let me think about that. What else did you want to explore?",
        nextNodeId: 'dante_exploration_hub',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['dante_arc', 'listening', 'techniques']
  },

  // ============= BENEATH THE CHARM =============
  {
    nodeId: 'dante_beneath_charm',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_beneath_v1',
        text: "[Long pause. Dante looks genuinely uncertain.]\n\nI don't... fully know yet. That's the honest answer.\n\nI think there's someone who cares about people. Really cares. Someone who saw his mom work herself to exhaustion and decided no one should have to beg for basic dignity.\n\nBut I've also got this other part—the part that knows how to win, how to close, how to get what I want. And I don't always trust him.\n\nMaybe the point isn't picking one or the other. Maybe it's teaching them to work together.",
        emotion: 'searching'
      }
    ],
    choices: [
      {
        choiceId: 'dante_integration',
        text: "Integration, not elimination. That's wise.",
        nextNodeId: 'dante_wise_reflection',
        pattern: 'analytical',
        skills: ['emotionalIntelligence', 'emotionalIntelligence'],
        consequence: {
          characterId: 'dante',
          trustChange: 1
        }
      },
      {
        choiceId: 'dante_mom_story',
        text: "Tell me about your mom.",
        nextNodeId: 'dante_mom_deep',
        pattern: 'helping',
        skills: ['empathy'],
        consequence: {
          characterId: 'dante',
          trustChange: 1,
          addKnowledgeFlags: ['asked_about_dante_mom']
        }
      }
    ],
    tags: ['dante_arc', 'vulnerability', 'identity']
  },

  // ============= RETURN TO HUB =============
  {
    nodeId: 'dante_return_hub',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_return_v1',
        text: "You know where to find me. This floor's all about understanding what people really need.\n\nAnd what they need isn't always what they ask for.",
        emotion: 'warm'
      }
    ],
    choices: [
      {
        choiceId: 'dante_return_explore',
        text: "I'll explore more of the station.",
        nextNodeId: samuelEntryPoints.HUB_INITIAL,
        pattern: 'exploring',
        skills: ['adaptability']
      },
      {
        choiceId: 'dante_return_stay',
        text: "Actually, I have more questions.",
        nextNodeId: 'dante_exploration_hub',
        pattern: 'patience',
        skills: ['curiosity']
      }
    ],
    tags: ['dante_arc', 'hub', 'navigation']
  },

  // ============= ADDITIONAL NODES FOR DEPTH =============
  {
    nodeId: 'dante_respect_depth',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_respect_v1',
        text: "Respect for their process. Their timeline. Their right to say no.\n\nWhen I'm silent, I'm saying: 'Your thoughts matter. Take your time.' Most salespeople fill silence because they're afraid. I stay in it because I trust the other person to know their own mind.",
        emotion: 'earnest'
      }
    ],
    choices: [
      {
        choiceId: 'dante_trust_them',
        text: "You trust people to know their own mind. Do they?",
        nextNodeId: 'dante_exploration_hub',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['dante_arc', 'philosophy']
  },

  {
    nodeId: 'dante_stopped_performing',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_stopped_v1',
        text: "I closed a deal I shouldn't have. Elderly couple. Sold them a time-share they couldn't afford.\n\nWhen I saw the contract go through, I felt... nothing. No triumph. Just emptiness.\n\nThat's when I knew: I was becoming the thing I promised myself I'd never be. Someone who takes from people. Someone who performs humanity instead of feeling it.\n\nI quit the next week.",
        emotion: 'somber'
      }
    ],
    choices: [
      {
        choiceId: 'dante_quit_then',
        text: "What happened to the couple?",
        nextNodeId: 'dante_couple_outcome',
        pattern: 'helping',
        skills: ['empathy'],
        consequence: {
          characterId: 'dante',
          trustChange: 1
        }
      }
    ],
    tags: ['dante_arc', 'turning_point', 'vulnerability']
  },

  {
    nodeId: 'dante_couple_outcome',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_couple_v1',
        text: "I went back. Helped them get out of the contract. It wasn't easy—the company fought me on it.\n\nBut I needed to make it right. Not for them, really. For me. To prove I could still be someone who gives instead of takes.\n\nThat couple sent me a card last Christmas. Still makes me cry if I think about it too long.",
        emotion: 'moved'
      }
    ],
    choices: [
      {
        choiceId: 'dante_redemption',
        text: "You found your way back.",
        nextNodeId: 'dante_exploration_hub',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'dante',
          trustChange: 1
        }
      }
    ],
    tags: ['dante_arc', 'redemption', 'vulnerability']
  },

  {
    nodeId: 'dante_sim_listen_response',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_sim_listen_v1',
        text: "[Dante's eyes light up.]\n\nYes. Exactly.\n\nBecause once you know what burned her, you know what she actually needs protection from. Maybe it's complexity. Maybe it's hidden fees. Maybe it's feeling dumb when things break.\n\nNow you're not selling software. You're offering to solve her actual problem.\n\nThat's the shift from transaction to relationship.",
        emotion: 'approving'
      }
    ],
    choices: [
      {
        choiceId: 'dante_sim_continue',
        text: "What comes after understanding the burn?",
        nextNodeId: 'dante_sim_aftermath',
        pattern: 'building',
        skills: ['problemSolving']
      }
    ],
    tags: ['dante_sim', 'simulation', 'teaching']
  },

  {
    nodeId: 'dante_sim_walk_response',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_sim_walk_v1',
        text: "[Dante actually steps back, impressed.]\n\nYou'd walk away. You'd give her the power.\n\nThat's... that's the advanced move. Because when you're willing to lose the sale, you demonstrate that you're not desperate. You're confident enough to believe in what you're offering—and confident enough to know it's not for everyone.\n\nCounterintuitively, that's often when people buy. Because real confidence isn't push. It's peace.",
        emotion: 'deeply_impressed'
      }
    ],
    choices: [
      {
        choiceId: 'dante_peace_confidence',
        text: "Peace as confidence. I never thought of it that way.",
        nextNodeId: 'dante_exploration_hub',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['dante_sim', 'simulation', 'mastery']
  },

  {
    nodeId: 'dante_sim_aftermath',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_aftermath_v1',
        text: "After understanding? You mirror it back.\n\n'So if I'm hearing you right, your biggest concern is that you'll invest in something and then feel stuck when it doesn't work. You want an exit strategy before you need one.'\n\nNow she knows you heard her. And you can address the real objection—not the surface excuse.",
        emotion: 'teaching'
      }
    ],
    onEnter: [
      {
        characterId: 'dante',
        addKnowledgeFlags: ['dante_simulation_phase1_complete']
      }
    ],
    choices: [
      {
        choiceId: 'dante_more_sim',
        text: "Let's do another scenario.",
        nextNodeId: 'dante_sim_reluctant',
        pattern: 'building',
        skills: ['problemSolving']
      },
      {
        choiceId: 'dante_enough_sim',
        text: "I think I'm getting the principles.",
        nextNodeId: 'dante_exploration_hub',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['dante_sim', 'simulation', 'techniques']
  },

  {
    nodeId: 'dante_something_underneath',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_underneath_v1',
        text: "[Dante takes a shaky breath.]\n\nYeah. Maybe.\n\nI keep thinking—the act couldn't be this convincing if there wasn't something real powering it. You can't fake care that well. At some point, some part of me is genuinely present.\n\nThe work isn't becoming someone new. It's... learning to stay in those genuine moments longer. Stretch them out until they become the default.\n\nThanks. For seeing that.",
        emotion: 'grateful_vulnerable'
      }
    ],
    choices: [
      {
        choiceId: 'dante_genuine_moments',
        text: "Those genuine moments are already you. The rest is just habit.",
        nextNodeId: 'dante_habit_insight',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'dante',
          trustChange: 1
        }
      }
    ],
    tags: ['dante_arc', 'vulnerability', 'growth']
  },

  {
    nodeId: 'dante_habit_insight',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_habit_v1',
        text: "Habit. Not identity.\n\n...That's actually helpful. The performance isn't who I am—it's just what I learned to do to survive. And I can learn something else.\n\nYou're pretty good at this, you know. The listening thing.",
        emotion: 'lighter'
      }
    ],
    choices: [
      {
        choiceId: 'dante_learned_from',
        text: "I had a good teacher. Just now.",
        nextNodeId: 'dante_return_hub',
        pattern: 'helping',
        skills: ['communication'],
        consequence: {
          characterId: 'dante',
          trustChange: 1
        }
      }
    ],
    tags: ['dante_arc', 'growth', 'connection']
  },

  // ============= MISSING NODES FIX =============
  {
    nodeId: 'dante_katrina',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_katrina_v1',
        text: "We lost the house. Water to the roof. I was twelve.\n\nBut you know what I remember? Not the loss. The rebuilding. How neighbors who had nothing shared what little they had.\n\nThat's where I learned that value isn't physical. Value is... presence. Showing up when it counts. That's the only currency that never inflates.",
        emotion: 'somber'
      }
    ],
    choices: [
      {
        choiceId: 'dante_katrina_value',
        text: "Presence as currency. I like that.",
        nextNodeId: 'dante_exploration_hub',
        pattern: 'helping',
        skills: ['empathy', 'resilience']
      },
      {
        choiceId: 'dante_katrina_rebuild',
        text: "How did that shape your career?",
        nextNodeId: 'dante_techniques',
        pattern: 'building',
        skills: ['adaptability']
      }
    ],
    tags: ['dante_arc', 'backstory', 'resilience']
  },

  {
    nodeId: 'dante_grandmother_lessons',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_grandma_v1',
        text: "She didn't have an MBA. She had intuition.\n\nShe'd say, 'Baby, people don't buy sugar. They buy the memory of their mama's kitchen. They buy a moment of sweetness in a bitter day.'\n\nShe taught me to sell the feeling, not the object. The object is just the delivery mechanism.",
        emotion: 'warm'
      }
    ],
    choices: [
      {
        choiceId: 'dante_grandma_feeling',
        text: "Sell the feeling. That's powerful.",
        nextNodeId: 'dante_techniques',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'dante_grandma_mechanism',
        text: "So the product doesn't matter?",
        nextNodeId: 'dante_flip_everything',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['dante_arc', 'backstory', 'wisdom']
  },

  {
    nodeId: 'dante_flip_everything',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_flip_v1',
        text: "It matters—it has to be good. You can't build trust on a lie.\n\nBut the product isn't the *point*. The connection is the point. The product is just the souvenir of the connection.\n\nOnce you get that, you stop pushing. You start inviting. And that changes the whole game.",
        emotion: 'teaching'
      }
    ],
    choices: [
      {
        choiceId: 'dante_flip_invite',
        text: "I want to learn how to invite like that.",
        nextNodeId: 'dante_techniques',
        pattern: 'building',
        skills: ['communication']
      },
      {
        choiceId: 'dante_flip_hub',
        text: "I think I understand.",
        nextNodeId: 'dante_exploration_hub',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['dante_arc', 'philosophy', 'sales']
  }
]

// Entry points for navigation
export const danteEntryPoints = {
  INTRODUCTION: 'dante_introduction',
  SIMULATION: 'dante_sim_reluctant',
  VULNERABILITY: 'dante_vulnerability_arc'
} as const

// Build the graph
export const danteDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(danteDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: danteEntryPoints.INTRODUCTION,
  metadata: {
    title: "Dante's Stage",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: danteDialogueNodes.length,
    totalChoices: danteDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}
