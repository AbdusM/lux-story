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
        emotion: 'earnest',
        voiceVariations: {
          analytical: "Traditional sales is a performance. Your skepticism is statistically justified.\n\nBut here's the data: when I stopped optimizing talk time and started measuring listen rate, my close rate improved 40%. Not from better manipulation algorithms—from better pattern recognition of actual needs.\n\nSilence isn't a technique. It's respect for the signal-to-noise ratio.",
          helping: "Traditional sales is a performance. You're right to question it.\n\nBut here's what I learned: when I stopped trying to impress and started caring what they needed, people trusted me more. Not because I got better at persuasion—because I got better at actually wanting to help.\n\nSilence isn't a technique. It's respect for what someone's trying to tell you.",
          building: "Traditional sales is a performance. You're right to be skeptical.\n\nBut here's what I learned: when I stopped constructing pitches and started building understanding, relationships lasted longer. Not because I got better at convincing—because I got better at co-creating solutions.\n\nSilence isn't a technique. It's respect for what we're building together.",
          exploring: "Traditional sales is a performance. You're right to question it.\n\nBut here's what I discovered: when I stopped mapping my agenda and started exploring theirs, conversations went deeper. Not because I got better at persuasion—because I got better at navigating what they actually need.\n\nSilence isn't a technique. It's respect for the territory they're showing you.",
          patience: "Traditional sales is a performance. You're right to be skeptical.\n\nBut here's what I learned: when I stopped rushing to close and started giving time to understand, trust developed naturally. Not because I got better at manipulation—because I got better at waiting for the real need to surface.\n\nSilence isn't a technique. It's respect for the time truth takes."
        }
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
        emotion: 'quiet_satisfied',
        voiceVariations: {
          analytical: "[Dante watches you, silent. The station hums around you both. Time stretches.]\n\n...There. Did you process it? The moment when analysis stopped and meta-cognition began?\n\nThat's the state space I'm trying to reach in every conversation. That's where authentic optimization happens.",
          helping: "[Dante watches you, silent. The station hums around you both. Time stretches.]\n\n...There. Did you feel it? The moment when trying stopped and truth began?\n\nThat's the safe space I'm trying to create in every conversation. That's where real care happens.",
          building: "[Dante watches you, silent. The station hums around you both. Time stretches.]\n\n...There. Did you feel it? The moment when construction stopped and foundation became visible?\n\nThat's the ground I'm trying to establish in every conversation. That's where solid decisions build.",
          exploring: "[Dante watches you, silent. The station hums around you both. Time stretches.]\n\n...There. Did you find it? The moment when navigation stopped and discovery began?\n\nThat's the territory I'm trying to reach in every conversation. That's where real paths reveal themselves.",
          patience: "[Dante watches you, silent. The station hums around you both. Time stretches.]\n\n...There. Did you notice it? The moment when rushing stopped and presence began?\n\nThat's the duration I'm trying to honor in every conversation. That's where truth accumulates enough weight to settle."
        }
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
        emotion: 'serious',
        voiceVariations: {
          analytical: "Exactly. I can close anyone. That's not bragging—it's predictive accuracy.\n\nI learned persuasion patterns before I learned ethical frameworks. Grew up analyzing people because survival required it. By twenty, I could model anyone's decision tree.\n\nThat's when I realized: capability without constraint isn't optimization. It's risk.",
          helping: "Exactly. I can close anyone. That's not bragging—it's a confession.\n\nI learned to sell before I learned to care. Grew up reading people because I had to survive. By twenty, I could convince anyone of anything.\n\nThat's when I realized: power without caring isn't a gift. It's harm.",
          building: "Exactly. I can close anyone. That's not bragging—it's acknowledging the infrastructure.\n\nI learned to build influence before I learned to build ethically. Grew up constructing persuasion because circumstances demanded it. By twenty, I could architect anyone's yes.\n\nThat's when I realized: power without foundation isn't strength. It's structural failure waiting to happen.",
          exploring: "Exactly. I can close anyone. That's not bragging—it's mapping my own territory.\n\nI learned to navigate persuasion before I learned where I should go. Grew up reading people because I had to find my way. By twenty, I could guide anyone to any destination.\n\nThat's when I realized: power without direction isn't a gift. It's getting lost with greater efficiency.",
          patience: "Exactly. I can close anyone. That's not bragging—it's a burden I've carried.\n\nI learned to sell fast before I learned to wait for truth. Grew up reading people because I had to. By twenty, I could rush anyone to any decision.\n\nThat's when I realized: power without patience isn't a gift. It's speed that breaks things."
        }
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
        emotion: 'inviting',
        patternReflection: [
          { pattern: 'analytical', minLevel: 4, altText: "You read between the lines. I appreciate that. Most people take me at face value.\n\nI'm an open book—but every chapter has layers. What aspect of persuasion do you want to analyze?", altEmotion: 'knowing' },
          { pattern: 'helping', minLevel: 4, altText: "You listen like you actually care. That's rare in sales. Or anywhere, honestly.\n\nI'm an open book. Well—mostly. What aspect of connection interests someone who leads with care?", altEmotion: 'warm' },
          { pattern: 'patience', minLevel: 4, altText: "You take your time. I see that in you. Not rushing to conclusions, not filling silence.\n\nI'm an open book. But some chapters take time to read carefully. Where do you want to pause?", altEmotion: 'appreciative' }
        ]
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
        emotion: 'reflective',
        skillReflection: [
          { skill: 'integrity', minLevel: 5, altText: "Here's my line: I never sell anyone something they don't need. You have integrity—I can tell by how you engage.\n\nThe question is: do they need it, or have I convinced them? Integrity means sitting with that discomfort.\n\nSingle mom, car purchase. I could have profited from debt. Instead, used sedan, lost commission. That's the day I knew who I was.\n\nYour integrity already knows this.", altEmotion: 'knowing' },
          { skill: 'negotiation', minLevel: 5, altText: "Here's my line: I never sell anyone something they don't need. You're good at negotiation—I've noticed.\n\nBut real skill isn't winning. It's knowing when not to sell. Do they need it, or have I convinced them?\n\nSingle mom, car purchase. The upsell was easy. The right thing was harder. Used sedan, lost commission, gained clarity.\n\nThat's advanced negotiation: knowing when the best deal is no deal.", altEmotion: 'teaching' }
        ],
        patternReflection: [
          { pattern: 'analytical', minLevel: 4, altText: "You think critically. Good. This is a critical question.\n\nMy line: I never sell anyone something they don't need. But 'need' is subjective. Do they need it, or have I convinced them they need it?\n\nThe epistemological problem of persuasion. Single mom, car purchase, potential debt spiral. I chose the used sedan. Lost commission. Defined my ethics.", altEmotion: 'teaching' },
          { pattern: 'helping', minLevel: 4, altText: "You care about impact. So you'll understand this.\n\nMy line: I never sell anyone something they don't need. Simple words, complex execution.\n\nSingle mom, needed a car. I could have profited from her vulnerability. Instead I helped her find what she actually needed. Lost my commission. Found my integrity.", altEmotion: 'serious_warm' },
          { pattern: 'patience', minLevel: 4, altText: "You take time with decisions. That patience matters in this work.\n\nMy line: I never sell anyone something they don't need. But that requires pausing. Asking: do they need it, or have I convinced them?\n\nSingle mom, car purchase. I could have rushed the upsell. Instead I took time to find what she actually needed. Lost commission. Gained clarity.", altEmotion: 'reflective' }
        ]
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
        emotion: 'vulnerable',
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "You want the real version or the one I tell at networking events?\n\n...You help people. So you'll get the real version.\n\nGrew up poor. New Orleans. Learned charm was currency. By fifteen I was making people feel important for survival.\n\nRose fast in sales. But somewhere I became all persona, no person. Came to Birmingham to figure out who I am when I'm not performing.", altEmotion: 'vulnerable_warm' },
          { pattern: 'analytical', minLevel: 4, altText: "You want the real version or the one I tell at networking events?\n\n...You analyze. So here's the unoptimized truth.\n\nNew Orleans. Poor. Learned charm was survival currency. By fifteen: small hustles, all legal, all effective. Sales career trajectory: rapid ascent.\n\nBut at some point the optimization became the identity. All caricature, no core. Birmingham: attempt to debug the system. Find the authentic variable underneath.", altEmotion: 'vulnerable_analytical' },
          { pattern: 'patience', minLevel: 4, altText: "You want the real version or the one I tell at networking events?\n\n...You're patient. So I'll take time with the real version.\n\nNew Orleans. Poor. Learned charm young. Rose fast in sales. But somewhere I became a performance—all persona, no person.\n\nBirmingham: starting over. Taking time to figure out who I am when I'm not rushing toward the next sale.", altEmotion: 'vulnerable_reflective' }
        ],
        interrupt: {
          duration: 3500,
          type: 'silence',
          action: 'Let the truth hang. He is not asking for a fix.',
          targetNodeId: 'dante_interrupt_acknowledged',
          consequence: {
            characterId: 'dante',
            trustChange: 2
          }
        }
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
  {
    nodeId: 'dante_interrupt_acknowledged',
    speaker: 'Dante Moreau',
    content: [{
      text: "Most people fill that silence with advice. You didn't.\n\nThat's the kind of restraint I keep talking about. It lets me tell the real story.",
      emotion: 'grateful',
      variation_id: 'dante_interrupt_v1'
    }],
    choices: [
      {
        choiceId: 'dante_interrupt_continue',
        text: "Who are you beneath the charm?",
        nextNodeId: 'dante_beneath_charm',
        pattern: 'helping',
        consequence: {
          characterId: 'dante',
          trustChange: 1
        }
      }
    ],
    tags: ['interrupt_target', 'emotional_moment', 'dante_arc']
  },

  // ============= VULNERABILITY ARC =============
  {
    nodeId: 'dante_vulnerability_arc',
    speaker: 'Dante Moreau',
    content: [
      {
        variation_id: 'dante_vuln_v1',
        text: "[Dante's usual ease falters. He looks past you.]\n\nYou want to know my real fear?\n\nI'm terrified I don't know how to be genuine anymore. That all my interactions are some version of a pitch. Even this conversation—part of me is tracking your responses, adjusting my delivery.\n\nI've been performing so long I'm not sure where the act ends and I begin.\n\nWhat if there's nothing underneath?",
        emotion: 'scared',
        patternReflection: [
          { pattern: 'helping', minLevel: 5, altText: "[Dante's usual ease falters. He looks past you.]\n\nYou care about people genuinely. I see that. That's why I'm asking you this.\n\nI'm terrified I don't know how to be genuine anymore. Every interaction feels like a pitch. Even now—I'm tracking your responses, adjusting delivery.\n\nI've been performing so long... what if there's nothing real underneath?", altEmotion: 'vulnerable_scared' },
          { pattern: 'analytical', minLevel: 5, altText: "[Dante's usual ease falters. He looks past you.]\n\nYou analyze deeply. Maybe you can help me understand this.\n\nI can't tell where performance ends and authenticity begins. Even this conversation—I'm tracking responses, optimizing delivery.\n\nI've been performing so long the variable is lost. What if there's no authentic self underneath the optimization?", altEmotion: 'vulnerable_analytical' },
          { pattern: 'patience', minLevel: 5, altText: "[Dante's usual ease falters. He looks past you.]\n\nYou're patient. You don't rush. That's why I'm telling you this.\n\nI'm terrified I've performed so long I don't know how to be genuine. Every interaction feels rehearsed, even this one.\n\nWhat if slowing down reveals there's nothing underneath? Just… layers of performance all the way down?", altEmotion: 'vulnerable_terrified' },
          { pattern: 'exploring', minLevel: 5, altText: "[Dante's usual ease falters. He looks past you.]\n\nYou explore. You discover. Maybe you can help me navigate this.\n\nI'm terrified I've performed so long there's no authentic territory left to explore. Every interaction is a mapped route. Every response calculated.\n\nI've been charting other people's desires for so long... what if there's no unexplored self underneath? Just endless performance all the way down?", altEmotion: 'vulnerable_lost' },
          { pattern: 'building', minLevel: 5, altText: "[Dante's usual ease falters. He looks past you.]\n\nYou build things. Real things. That's why I need to ask you this.\n\nI'm terrified I've built an entire identity out of performance. Every interaction constructed. Every moment architected for effect.\n\nI've been building facades so long... what if there's no foundation underneath? Just scaffolding all the way down?", altEmotion: 'vulnerable_hollow' }
        ]
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
      },
      {
        choiceId: 'offer_real_pitch',
        text: "[Helper] Dante, you look troubled. Someone need your help?",
        nextNodeId: 'dante_loyalty_trigger',
        pattern: 'helping',
        skills: ['empathy', 'emotionalIntelligence'],
        visibleCondition: {
          trust: { min: 8 },
          patterns: { helping: { min: 5 } },
          hasGlobalFlags: ['dante_arc_complete']
        }
      }
    ],
    tags: ['dante_arc', 'hub', 'navigation']
  },

  // ═══════════════════════════════════════════════════════════════
  // LOYALTY EXPERIENCE: THE REAL PITCH
  // Requires: Trust >= 8, Helping >= 50%, dante_arc_complete
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'dante_loyalty_trigger',
    speaker: 'Dante Moreau',
    content: [{
      text: "There's a kid in the conference room. Twenty. Dropped out of college to start a tutoring business. Hasn't made a sale in three months.\n\nHe reached out because he saw my LinkedIn. Thought I could teach him the tricks. How to manipulate people into saying yes.\n\nBut here's the thing—his service is actually good. Really good. He just doesn't believe in it enough to sell it honestly.\n\nI could give him my old playbook. The one that worked. Mirroring, scarcity tactics, emotional leverage. He'd probably start closing deals.\n\nBut I don't want to teach him how to perform. I want to teach him how to believe in what he's offering. How to sell from a place of service, not survival.\n\nI've never done that before. I don't even know if I can.\n\nYou understand helping people. Would you... sit in on this? Help me figure out how to coach someone when the goal isn't just winning?",
      emotion: 'vulnerable_determined',
      variation_id: 'loyalty_trigger_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 8 },
      patterns: { helping: { min: 5 } },
      hasGlobalFlags: ['dante_arc_complete']
    },
    metadata: {
      experienceId: 'the_real_pitch'
    },
    choices: [
      {
        choiceId: 'accept_real_pitch',
        text: "I'll be there.",
        nextNodeId: 'dante_loyalty_start',
        pattern: 'helping'
      },
      {
        choiceId: 'decline_real_pitch',
        text: "That sounds like something you should figure out yourself.",
        nextNodeId: 'dante_loyalty_declined'
      }
    ]
  },

  {
    nodeId: 'dante_loyalty_declined',
    speaker: 'Dante Moreau',
    content: [{
      text: "Yeah. You're probably right. Some lessons you gotta teach yourself.\n\nStill appreciate you listening.",
      emotion: 'understanding',
      variation_id: 'loyalty_declined_v1'
    }],
    choices: [
      {
        choiceId: 'return_to_hub',
        text: "Good luck with the session.",
        nextNodeId: 'dante_return_hub'
      }
    ]
  },

  {
    nodeId: 'dante_loyalty_start',
    speaker: 'Dante Moreau',
    content: [{
      text: "Conference room C. Third floor.\n\nJust... if I start slipping into performance mode, call me on it. I need someone to keep me honest.\n\nLet's go figure this out together.",
      emotion: 'warm_grateful',
      variation_id: 'loyalty_start_v1'
    }],
    onEnter: [
      { characterId: 'dante', addKnowledgeFlags: ['dante_loyalty_accepted'] }
    ],
    choices: []
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
    onEnter: [
      {
        addGlobalFlags: ['dante_arc_complete']
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
  },

  // ═══════════════════════════════════════════════════════════════
  // MYSTERY BREADCRUMBS
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'dante_mystery_hint',
    speaker: 'dante',
    requiredState: {
      trust: { min: 5 }
    },
    content: [
      {
        text: "I know a setup when I see one. A perfectly curated environment designed to close a deal.\\n\\nBut I can't figure out who the seller is. Or what they're selling.",
        emotion: 'suspicious',
        variation_id: 'mystery_hint_v1'
      },
      {
        text: "Every person I meet here needs exactly what I have to offer. And I need what they have. It's the perfect <shake>exchange</shake>.",
        emotion: 'intrigued',
        variation_id: 'mystery_hint_v2'
      }
    ],
    choices: [
      {
        choiceId: 'dante_mystery_dig',
        text: "Maybe that's not coincidence.",
        nextNodeId: 'dante_mystery_response',
        pattern: 'analytical'
      },
      {
        choiceId: 'dante_mystery_feel',
        text: "Some connections are meant to happen.",
        nextNodeId: 'dante_mystery_response',
        pattern: 'helping'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  {
    nodeId: 'dante_mystery_response',
    speaker: 'dante',
    content: [
      {
        text: "You know what's wild? For once, I'm not trying to close deals. I'm just... connecting. And it feels better than any sale I've ever made.\\n\\nMaybe that's what the station's selling. Authenticity.",
        emotion: 'vulnerable',
        variation_id: 'mystery_response_v1'
      }
    ],
    onEnter: [
      { characterId: 'dante', addKnowledgeFlags: ['dante_mystery_noticed'] }
    ],
    choices: [
      {
        choiceId: 'dante_mystery_return',
        text: "That's a product worth buying.",
        nextNodeId: 'dante_hub_return',
        pattern: 'helping'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  {
    nodeId: 'dante_hub_return',
    speaker: 'dante',
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
    nodeId: 'dante_trust_recovery',
    speaker: 'Dante Moreau',
    requiredState: {
      trust: { max: 3 }
    },
    content: [{
      text: "[He's practicing that pause. The one he talked about. But it's not working.]\n\nYou came back.\n\nI thought... well. I know how to read a room. And I read that one wrong.\n\n[Finally stops. Looks at you.]\n\nI spent my whole life learning to charm people. To read what they need and give it to them.\n\nBut I forgot to ask what YOU actually needed. I just... performed.\n\nThat's manipulation, not connection. And I'm sorry.",
      emotion: 'vulnerable',
      variation_id: 'trust_recovery_v1',
      voiceVariations: {
        patience: "[He's practicing that pause. The one he talked about. But it's not working.]\n\nYou came back.\n\nYou gave me time. Most people don't.\n\nI thought... well. I know how to read a room. And I read that one wrong.\n\n[Finally stops. Looks at you.]\n\nI spent my whole life learning to charm people. To read what they need and give it to them.\n\nBut I forgot to ask what YOU actually needed. I just... performed. That's manipulation, not connection. And I'm sorry.",
        helping: "[He's practicing that pause. The one he talked about. But it's not working.]\n\nYou came back.\n\nEven after I used my charm like a shield instead of a bridge.\n\nI thought... well. I know how to read a room. And I read that one wrong.\n\n[Finally stops. Looks at you.]\n\nI spent my whole life learning to charm people. To read what they need and give it to them.\n\nBut I forgot to ask what YOU actually needed. I just... performed. That's manipulation, not connection. And I'm sorry.",
        analytical: "[He's practicing that pause. The one he talked about. But it's not working.]\n\nYou came back.\n\nYou analyzed what I missed. The gap between performance and authenticity.\n\nI thought... well. I know how to read a room. And I read that one wrong.\n\n[Finally stops. Looks at you.]\n\nI spent my whole life learning to charm people. To read what they need and give it to them.\n\nBut I forgot to ask what YOU actually needed. I just... performed. That's manipulation, not connection. And I'm sorry.",
        building: "[He's practicing that pause. The one he talked about. But it's not working.]\n\nYou came back.\n\nRebuilding after I performed instead of connecting.\n\nI thought... well. I know how to read a room. And I read that one wrong.\n\n[Finally stops. Looks at you.]\n\nI spent my whole life learning to charm people. To read what they need and give it to them.\n\nBut I forgot to ask what YOU actually needed. I just... performed. That's manipulation, not connection. And I'm sorry.",
        exploring: "[He's practicing that pause. The one he talked about. But it's not working.]\n\nYou came back.\n\nStill curious even after I gave you the sales pitch instead of the truth.\n\nI thought... well. I know how to read a room. And I read that one wrong.\n\n[Finally stops. Looks at you.]\n\nI spent my whole life learning to charm people. To read what they need and give it to them.\n\nBut I forgot to ask what YOU actually needed. I just... performed. That's manipulation, not connection. And I'm sorry."
      }
    }],
    choices: [
      {
        choiceId: 'dante_recovery_real',
        text: "Show me the real you, not the performance.",
        nextNodeId: 'dante_trust_restored',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'dante',
          trustChange: 2,
          addKnowledgeFlags: ['dante_trust_repaired']
        },
        voiceVariations: {
          patience: "Take your time. Show me the real you, not the performance.",
          helping: "I care about the person, not the pitch. Show me the real you.",
          analytical: "Authenticity over optimization. Show me the real you, not the performance.",
          building: "Build something real. Show me the real you, not the performance.",
          exploring: "I want to explore the truth. Show me the real you, not the performance."
        }
      },
      {
        choiceId: 'dante_recovery_pause',
        text: "Try that pause again. For real this time.",
        nextNodeId: 'dante_trust_restored',
        pattern: 'patience',
        skills: ['communication'],
        consequence: {
          characterId: 'dante',
          trustChange: 2,
          addKnowledgeFlags: ['dante_trust_repaired']
        },
        voiceVariations: {
          patience: "Try that pause again. For real this time. I'll wait.",
          helping: "You taught me about silence. Try that pause again. For real this time.",
          analytical: "Apply your own methodology. Try that pause again. For real this time.",
          building: "Build the silence. Try that pause again. For real this time.",
          exploring: "Let's explore the quiet. Try that pause again. For real this time."
        }
      }
    ],
    tags: ['trust_recovery', 'dante_arc']
  },

  {
    nodeId: 'dante_trust_restored',
    speaker: 'Dante Moreau',
    content: [{
      text: "[He stops talking. Actually pauses. Breathes.]\n\n...\n\n[When he speaks again, it's different. Slower. Real.]\n\nI grew up in New Orleans learning to perform. To give people what they wanted before they knew they wanted it.\n\nIt kept me safe. Fed. Successful.\n\nBut somewhere along the way, I forgot how to just... be.\n\n[He looks at you. No charm. Just tired honesty.]\n\nThank you. For wanting the real version.\n\nI'm sorry I was scared to show it.",
      emotion: 'grateful_vulnerable',
      variation_id: 'trust_restored_v1',
      voiceVariations: {
        patience: "[He stops talking. Actually pauses. Breathes.]\n\n...\n\n[When he speaks again, it's different. Slower. Real.]\n\nYou waited for me to find the real words.\n\nI grew up in New Orleans learning to perform. To give people what they wanted before they knew they wanted it.\n\nIt kept me safe. Fed. Successful.\n\nBut somewhere along the way, I forgot how to just... be.\n\n[He looks at you. No charm. Just tired honesty.]\n\nThank you. For wanting the real version. I'm sorry I was scared to show it.",
        helping: "[He stops talking. Actually pauses. Breathes.]\n\n...\n\n[When he speaks again, it's different. Slower. Real.]\n\nYou cared enough to want the truth.\n\nI grew up in New Orleans learning to perform. To give people what they wanted before they knew they wanted it.\n\nIt kept me safe. Fed. Successful.\n\nBut somewhere along the way, I forgot how to just... be.\n\n[He looks at you. No charm. Just tired honesty.]\n\nThank you. For wanting the real version. I'm sorry I was scared to show it.",
        analytical: "[He stops talking. Actually pauses. Breathes.]\n\n...\n\n[When he speaks again, it's different. Slower. Real.]\n\nYou saw through the performance. That's rare.\n\nI grew up in New Orleans learning to perform. To give people what they wanted before they knew they wanted it.\n\nIt kept me safe. Fed. Successful.\n\nBut somewhere along the way, I forgot how to just... be.\n\n[He looks at you. No charm. Just tired honesty.]\n\nThank you. For wanting the real version. I'm sorry I was scared to show it.",
        building: "[He stops talking. Actually pauses. Breathes.]\n\n...\n\n[When he speaks again, it's different. Slower. Real.]\n\nYou helped me build something authentic.\n\nI grew up in New Orleans learning to perform. To give people what they wanted before they knew they wanted it.\n\nIt kept me safe. Fed. Successful.\n\nBut somewhere along the way, I forgot how to just... be.\n\n[He looks at you. No charm. Just tired honesty.]\n\nThank you. For wanting the real version. I'm sorry I was scared to show it.",
        exploring: "[He stops talking. Actually pauses. Breathes.]\n\n...\n\n[When he speaks again, it's different. Slower. Real.]\n\nYou explored past the charm to find the person.\n\nI grew up in New Orleans learning to perform. To give people what they wanted before they knew they wanted it.\n\nIt kept me safe. Fed. Successful.\n\nBut somewhere along the way, I forgot how to just... be.\n\n[He looks at you. No charm. Just tired honesty.]\n\nThank you. For wanting the real version. I'm sorry I was scared to show it."
      }
    }],
    choices: [{
      choiceId: 'dante_recovery_complete',
      text: "(Continue)",
      nextNodeId: 'dante_hub_return',
      pattern: 'patience'
    }],
    tags: ['trust_recovery', 'dante_arc'],
    onEnter: [{
      characterId: 'dante',
      addKnowledgeFlags: ['dante_trust_recovery_completed']
    }]
  },

  // ═══════════════════════════════════════════════════════════════
  // MISSING NODES - Added to fix broken navigation
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'dante_hard_questions',
    speaker: 'Dante Moreau',
    content: [{
      text: "Hard questions force honesty. Easy questions let people hide.\n\nWhen I ask 'What's really holding you back?'—that pause before they answer? That's where the real conversation begins.\n\nMost salespeople are afraid of that pause. I live for it.",
      emotion: 'knowing',
      variation_id: 'hard_questions_v1'
    }],
    choices: [
      { choiceId: 'hq_try', text: "I want to try asking a hard question.", nextNodeId: 'dante_exploration_hub', pattern: 'exploring' },
      { choiceId: 'hq_understand', text: "That takes courage.", nextNodeId: 'dante_hub_return', pattern: 'helping' }
    ],
    tags: ['dante_arc', 'technique']
  },

  {
    nodeId: 'dante_honest_discomfort',
    speaker: 'Dante Moreau',
    content: [{
      text: "Uncomfortable but honest. That's the whole game right there.\n\nComfort is where people perform. Discomfort is where they're real. My job isn't to make you comfortable—it's to make you clear.",
      emotion: 'appreciative',
      variation_id: 'honest_discomfort_v1'
    }],
    choices: [
      { choiceId: 'hd_more', text: "Tell me more about that clarity.", nextNodeId: 'dante_exploration_hub', pattern: 'analytical' },
      { choiceId: 'hd_felt', text: "I appreciate you creating that space.", nextNodeId: 'dante_hub_return', pattern: 'patience' }
    ],
    tags: ['dante_arc', 'trust']
  },

  {
    nodeId: 'dante_birmingham_choice',
    speaker: 'Dante Moreau',
    content: [{
      text: "Birmingham's a city that knows reinvention. Steel city that became something else.\n\nMaybe that's why I ended up here. I'm still figuring out what I'm becoming after I stopped being just a closer.",
      emotion: 'reflective',
      variation_id: 'birmingham_v1'
    }],
    choices: [
      { choiceId: 'bc_reinvent', text: "What does reinvention look like for you?", nextNodeId: 'dante_exploration_hub', pattern: 'exploring' },
      { choiceId: 'bc_thanks', text: "Thanks for sharing that.", nextNodeId: 'dante_hub_return', pattern: 'helping' }
    ],
    tags: ['dante_arc', 'backstory']
  },

  {
    nodeId: 'dante_childhood',
    speaker: 'Dante Moreau',
    content: [{
      text: "Growing up in New Orleans, you learn to read a room fast. Who's celebrating, who's grieving, who's about to start trouble.\n\nThat skill saved me. Also cursed me. Hard to turn it off when you can see what everyone needs before they say it.",
      emotion: 'vulnerable',
      variation_id: 'childhood_v1'
    }],
    choices: [
      { choiceId: 'ch_curse', text: "Why do you call it a curse?", nextNodeId: 'dante_exploration_hub', pattern: 'analytical' },
      { choiceId: 'ch_thanks', text: "That's a heavy gift to carry.", nextNodeId: 'dante_hub_return', pattern: 'helping' }
    ],
    tags: ['dante_arc', 'backstory', 'vulnerability']
  },

  {
    nodeId: 'dante_courage_acknowledgment',
    speaker: 'Dante Moreau',
    content: [{
      text: "Takes courage to sit with silence. Most people fill it with noise.\n\nYou didn't. That tells me something about you.",
      emotion: 'warm',
      variation_id: 'courage_v1'
    }],
    choices: [
      { choiceId: 'ca_what', text: "What does it tell you?", nextNodeId: 'dante_exploration_hub', pattern: 'exploring' },
      { choiceId: 'ca_thanks', text: "Thank you for noticing.", nextNodeId: 'dante_hub_return', pattern: 'patience' }
    ],
    tags: ['dante_arc', 'trust']
  },

  {
    nodeId: 'dante_desiree_follow',
    speaker: 'Dante Moreau',
    content: [{
      text: "Desiree—my grandmother—she always said 'People tell you who they are in the first ten seconds. The rest is just decoration.'\n\nTook me years to understand what she meant. And years more to stop ignoring what I saw.",
      emotion: 'nostalgic',
      variation_id: 'desiree_v1'
    }],
    choices: [
      { choiceId: 'df_saw', text: "What did you see that you ignored?", nextNodeId: 'dante_exploration_hub', pattern: 'exploring' },
      { choiceId: 'df_wise', text: "She sounds wise.", nextNodeId: 'dante_hub_return', pattern: 'helping' }
    ],
    tags: ['dante_arc', 'backstory']
  },

  {
    nodeId: 'dante_ethics_application',
    speaker: 'Dante Moreau',
    content: [{
      text: "Ethical selling isn't about being soft. It's about being honest—even when honesty costs you the deal.\n\nI've walked away from six-figure contracts because I couldn't look myself in the mirror after. That's the application.",
      emotion: 'serious',
      variation_id: 'ethics_app_v1'
    }],
    choices: [
      { choiceId: 'ea_example', text: "Tell me about one you walked away from.", nextNodeId: 'dante_exploration_hub', pattern: 'exploring' },
      { choiceId: 'ea_respect', text: "That takes real integrity.", nextNodeId: 'dante_hub_return', pattern: 'helping' }
    ],
    tags: ['dante_arc', 'ethics']
  },

  {
    nodeId: 'dante_ethics_framework',
    speaker: 'Dante Moreau',
    content: [{
      text: "My framework's simple: Would I sell this to my grandmother? Would I be proud if my daughter watched?\n\nIf the answer's no, I don't care how big the commission is. Some money isn't worth what it costs you.",
      emotion: 'firm',
      variation_id: 'ethics_frame_v1'
    }],
    choices: [
      { choiceId: 'ef_test', text: "Has that framework ever been tested?", nextNodeId: 'dante_exploration_hub', pattern: 'analytical' },
      { choiceId: 'ef_clear', text: "That's a clear line to hold.", nextNodeId: 'dante_hub_return', pattern: 'patience' }
    ],
    tags: ['dante_arc', 'ethics']
  },

  {
    nodeId: 'dante_exit_economics',
    speaker: 'Dante Moreau',
    content: [{
      text: "Exit economics. What's it cost you to stay versus leave?\n\nMost people only count the money. They forget to count the pieces of themselves they're giving away. That's the real math.",
      emotion: 'knowing',
      variation_id: 'exit_econ_v1'
    }],
    choices: [
      { choiceId: 'ee_pieces', text: "What pieces did you lose?", nextNodeId: 'dante_exploration_hub', pattern: 'exploring' },
      { choiceId: 'ee_heavy', text: "That's heavy calculus.", nextNodeId: 'dante_hub_return', pattern: 'analytical' }
    ],
    tags: ['dante_arc', 'reflection']
  },

  {
    nodeId: 'dante_liability_who',
    speaker: 'Dante Moreau',
    content: [{
      text: "Who's liable when persuasion works too well? When someone buys something they can't afford because I was too good?\n\nThat question haunted me for years. Still does, some nights.",
      emotion: 'troubled',
      variation_id: 'liability_v1'
    }],
    choices: [
      { choiceId: 'lw_answer', text: "What's your answer to that?", nextNodeId: 'dante_exploration_hub', pattern: 'analytical' },
      { choiceId: 'lw_hard', text: "That's a hard question to carry.", nextNodeId: 'dante_hub_return', pattern: 'helping' }
    ],
    tags: ['dante_arc', 'ethics', 'vulnerability']
  },

  {
    nodeId: 'dante_mirroring',
    speaker: 'Dante Moreau',
    content: [{
      text: "Mirroring. It's a technique—match their body language, their pace, their energy. Makes people feel understood.\n\nProblem is, I got so good at it I forgot who I was underneath all those reflections.",
      emotion: 'vulnerable',
      variation_id: 'mirroring_v1'
    }],
    choices: [
      { choiceId: 'mi_find', text: "How did you find yourself again?", nextNodeId: 'dante_exploration_hub', pattern: 'exploring' },
      { choiceId: 'mi_recognize', text: "I recognize that feeling.", nextNodeId: 'dante_hub_return', pattern: 'helping' }
    ],
    tags: ['dante_arc', 'technique', 'vulnerability']
  },

  {
    nodeId: 'dante_mom_deep',
    speaker: 'Dante Moreau',
    content: [{
      text: "My mom raised three of us alone after Katrina. Worked two jobs, never complained.\n\nShe's why I can't fake it anymore. Every time I tried to sell something I didn't believe in, I'd hear her voice: 'Dante, is this the man you want to be?'",
      emotion: 'tender',
      variation_id: 'mom_deep_v1'
    }],
    choices: [
      { choiceId: 'md_answer', text: "What's your answer to her now?", nextNodeId: 'dante_exploration_hub', pattern: 'exploring' },
      { choiceId: 'md_strong', text: "She sounds incredible.", nextNodeId: 'dante_hub_return', pattern: 'helping' }
    ],
    tags: ['dante_arc', 'backstory', 'vulnerability']
  },

  {
    nodeId: 'dante_need_philosophy',
    speaker: 'Dante Moreau',
    content: [{
      text: "Need versus want. That's the philosophy.\n\nI can sell you anything you want. But should I? Do you need it? Will it make your life better?\n\nThose questions changed everything for me.",
      emotion: 'thoughtful',
      variation_id: 'need_phil_v1'
    }],
    choices: [
      { choiceId: 'np_change', text: "How did that change your approach?", nextNodeId: 'dante_exploration_hub', pattern: 'analytical' },
      { choiceId: 'np_rare', text: "That's a rare perspective in sales.", nextNodeId: 'dante_hub_return', pattern: 'patience' }
    ],
    tags: ['dante_arc', 'ethics']
  },

  {
    nodeId: 'dante_neuro_pause',
    speaker: 'Dante Moreau',
    content: [{
      text: "Neuroscience says it takes 6-8 seconds for the prefrontal cortex to override emotional reactions.\n\nSo I wait. I give people space to think, not just react. Most salespeople are afraid of that space. I've learned to live in it.",
      emotion: 'knowing',
      variation_id: 'neuro_v1'
    }],
    choices: [
      { choiceId: 'np_practice', text: "Can we practice that pause?", nextNodeId: 'dante_pause_experience', pattern: 'patience' },
      { choiceId: 'np_interesting', text: "That's fascinating.", nextNodeId: 'dante_hub_return', pattern: 'analytical' }
    ],
    tags: ['dante_arc', 'technique']
  },

  {
    nodeId: 'dante_no_regrets',
    speaker: 'Dante Moreau',
    content: [{
      text: "No regrets is a lie people tell themselves. I've got plenty.\n\nBut I'm not carrying them anymore. I put them down. Learned from them. Let them make me better instead of bitter.",
      emotion: 'peaceful',
      variation_id: 'no_regrets_v1'
    }],
    choices: [
      { choiceId: 'nr_how', text: "How do you put down regret?", nextNodeId: 'dante_exploration_hub', pattern: 'exploring' },
      { choiceId: 'nr_wise', text: "That's wisdom.", nextNodeId: 'dante_hub_return', pattern: 'patience' }
    ],
    tags: ['dante_arc', 'growth']
  },

  {
    nodeId: 'dante_performing_now',
    speaker: 'Dante Moreau',
    content: [{
      text: "Am I performing right now? Talking to you?\n\n[He pauses, genuinely considering.]\n\nHonestly? Probably some. Old habits. But I'm trying to let you see the real parts. That's the work—being real even when performance is easier.",
      emotion: 'honest',
      variation_id: 'performing_v1'
    }],
    choices: [
      { choiceId: 'pn_real', text: "I appreciate the honesty.", nextNodeId: 'dante_hub_return', pattern: 'helping' },
      { choiceId: 'pn_tell', text: "How can I tell the difference?", nextNodeId: 'dante_exploration_hub', pattern: 'analytical' }
    ],
    tags: ['dante_arc', 'trust', 'vulnerability']
  },

  {
    nodeId: 'dante_silent_understanding',
    speaker: 'Dante Moreau',
    content: [{
      text: "Sometimes understanding doesn't need words. You just... get it. And they know you get it.\n\nThat's the connection I'm always chasing. Not the sale. The moment when two people really see each other.",
      emotion: 'warm',
      variation_id: 'silent_under_v1'
    }],
    choices: [
      { choiceId: 'su_chasing', text: "What happens when you find it?", nextNodeId: 'dante_exploration_hub', pattern: 'exploring' },
      { choiceId: 'su_rare', text: "That's rare.", nextNodeId: 'dante_hub_return', pattern: 'patience' }
    ],
    tags: ['dante_arc', 'connection']
  },

  {
    nodeId: 'dante_sim_demo_response',
    speaker: 'Dante Moreau',
    content: [{
      text: "You saw it. The technique, yeah, but also what's under it. The why.\n\nMost people just want the tricks. You wanted to understand. That tells me something about you.",
      emotion: 'appreciative',
      variation_id: 'sim_demo_v1'
    }],
    choices: [
      { choiceId: 'sdr_what', text: "What does it tell you?", nextNodeId: 'dante_exploration_hub', pattern: 'exploring' },
      { choiceId: 'sdr_thanks', text: "Thank you for showing me.", nextNodeId: 'dante_hub_return', pattern: 'helping' }
    ],
    tags: ['dante_arc', 'simulation']
  },

  {
    nodeId: 'dante_surprise_story',
    speaker: 'Dante Moreau',
    content: [{
      text: "Caught me off guard with that one. Don't usually tell these stories.\n\nBut you asked the right way. Not curious for entertainment. Curious to understand. There's a difference.",
      emotion: 'surprised',
      variation_id: 'surprise_v1'
    }],
    choices: [
      { choiceId: 'ss_more', text: "Is there more you want to share?", nextNodeId: 'dante_exploration_hub', pattern: 'helping' },
      { choiceId: 'ss_honor', text: "I'm honored you shared.", nextNodeId: 'dante_hub_return', pattern: 'patience' }
    ],
    tags: ['dante_arc', 'trust']
  },

  {
    nodeId: 'dante_wise_reflection',
    speaker: 'Dante Moreau',
    content: [{
      text: "Wisdom's just mistakes you survived long enough to learn from.\n\nI've made plenty. Still making them. But at least now I'm making new ones instead of repeating the old.",
      emotion: 'reflective',
      variation_id: 'wise_ref_v1'
    }],
    choices: [
      { choiceId: 'wr_new', text: "What new mistakes are you making?", nextNodeId: 'dante_exploration_hub', pattern: 'exploring' },
      { choiceId: 'wr_growth', text: "That's growth.", nextNodeId: 'dante_hub_return', pattern: 'patience' }
    ],
    tags: ['dante_arc', 'growth']
  },

  // ============= PHASE 1 SIMULATION: READING THE ROOM (Trust ≥ 2) =============
  {
    nodeId: 'dante_simulation_phase1_setup',
    speaker: 'Dante Moreau',
    content: [{
      text: "Want to see what I'm actually good at?\n\nNot the pitch. Not the close. Just... reading the room.\n\nThere's a small business owner I've been working with. She says she needs a new website. Marketing automation. The whole digital transformation package.\n\nBut when I listen—really listen—she's saying something else.\n\nWant to practice listening with me?",
      emotion: 'inviting',
      variation_id: 'simulation_phase1_intro_v1'
    }],
    requiredState: {
      trust: { min: 2 }
    },
    choices: [
      {
        choiceId: 'phase1_accept',
        text: "Show me how you listen.",
        nextNodeId: 'dante_simulation_phase1',
        pattern: 'helping',
        skills: ['communication']
      },
      {
        choiceId: 'phase1_decline',
        text: "Maybe another time.",
        nextNodeId: 'dante_exploration_hub',
        pattern: 'patience'
      }
    ],
    tags: ['simulation', 'dante_arc']
  },

  {
    nodeId: 'dante_simulation_phase1',
    speaker: 'Dante Moreau',
    content: [{
      text: "Listen past what she's saying. What is she actually asking for?",
      emotion: 'focused',
      variation_id: 'simulation_phase1_v1'
    }],
    simulation: {
      type: 'chat_negotiation',
      title: 'Active Listening: Reading Between the Lines',
      taskDescription: 'A bakery owner says she needs a new website and marketing automation. But her real need is different. Listen carefully and identify what she truly wants help with.',
      phase: 1,
      difficulty: 'introduction',
      variantId: 'dante_active_listening_phase1',
      initialContext: {
        label: 'CLIENT_TRANSCRIPT',
        content: `CLIENT (Maria, bakery owner):
"I need a new website. Something modern. Maybe with automation for email campaigns.

My competitors all have these sleek sites with online ordering. I'm falling behind.

Though honestly, I don't even know if my customers would use online ordering. They're mostly regulars who come in every morning.

I just... everyone says I need to be online. That's where the future is, right?

What do you think I should do?"

QUESTION: What is Maria's real need?
A) New website with modern design
B) Email marketing automation
C) Clarity on whether digital transformation fits her actual business
D) Online ordering system`,
        displayStyle: 'text'
      },
      successFeedback: '✓ INSIGHT: She doesn\'t need a website—she needs strategic clarity. Her regulars don\'t need online ordering. She\'s chasing solutions instead of understanding her business model.',
      successThreshold: 75,
      unlockRequirements: {
        trustMin: 2
      }
    },
    choices: [
      {
        choiceId: 'phase1_success',
        text: "She doesn't need digital tools. She needs to understand her business.",
        nextNodeId: 'dante_simulation_phase1_success',
        pattern: 'helping',
        skills: ['criticalThinking', 'communication']
      }
    ],
    onEnter: [{
      characterId: 'dante',
      addKnowledgeFlags: ['dante_simulation_phase1_complete']
    }],
    tags: ['simulation', 'phase1']
  },

  {
    nodeId: 'dante_simulation_phase1_success',
    speaker: 'Dante Moreau',
    content: [{
      text: "Exactly. You heard it too.\n\nShe doesn't need a website. She needs permission to trust what's already working. Her regulars. Her daily rhythm. The human connection.\n\nMost salespeople would've sold her the website. Closed the deal. Made commission.\n\nBut that's not selling. That's taking advantage of confusion.\n\nReal sales? It's helping someone see clearly. Even if it means walking away from the deal.",
      emotion: 'warm_vindicated',
      variation_id: 'phase1_success_v1'
    }],
    choices: [
      {
        choiceId: 'phase1_success_continue',
        text: "Clarity over commission. That's rare.",
        nextNodeId: 'dante_exploration_hub',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'dante',
          trustChange: 2
        }
      }
    ],
    tags: ['simulation', 'success']
  },

  {
    nodeId: 'dante_simulation_phase1_fail',
    speaker: 'Dante Moreau',
    content: [{
      text: "That's the surface need. What she's saying she wants.\n\nBut if you listen deeper... there's a question underneath. About whether chasing 'modern' is even right for her.\n\nMost people never hear that second conversation. The real one.",
      emotion: 'patient_teaching',
      variation_id: 'phase1_fail_v1'
    }],
    choices: [
      {
        choiceId: 'phase1_fail_continue',
        text: "I'll practice listening deeper.",
        nextNodeId: 'dante_exploration_hub',
        pattern: 'patience',
        consequence: {
          characterId: 'dante',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'fail']
  },

  // ============= PHASE 2 SIMULATION: ETHICAL PERSUASION (Trust ≥ 5) =============
  {
    nodeId: 'dante_simulation_phase2_setup',
    speaker: 'Dante Moreau',
    content: [{
      text: "This one's harder.\n\nThere's a founder who wants to rebrand their entire nonprofit. New logo, new messaging, new website. Six-figure project.\n\nHere's the problem: their current brand is working. Donors love it. Volunteers recognize it. The community trusts it.\n\nBut the founder... he's bored of it. Wants something 'fresh'.\n\nHow do I tell him the truth without losing his trust? Or worse—letting him make a mistake because I was afraid to speak up?",
      emotion: 'conflicted',
      variation_id: 'simulation_phase2_intro_v1'
    }],
    requiredState: {
      trust: { min: 5 },
      hasKnowledgeFlags: ['dante_simulation_phase1_complete']
    },
    choices: [
      {
        choiceId: 'phase2_accept',
        text: "Show me how you navigate this.",
        nextNodeId: 'dante_simulation_phase2',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'phase2_decline',
        text: "That's a delicate balance.",
        nextNodeId: 'dante_exploration_hub',
        pattern: 'patience',
        consequence: {
          characterId: 'dante',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'dante_arc']
  },

  {
    nodeId: 'dante_simulation_phase2',
    speaker: 'Dante Moreau',
    content: [{
      text: "How do you redirect someone who's excited about the wrong thing?",
      emotion: 'focused',
      variation_id: 'simulation_phase2_v1'
    }],
    simulation: {
      type: 'chat_negotiation',
      title: 'Ethical Persuasion: Truth Over Commission',
      taskDescription: 'A nonprofit founder wants a costly rebrand, but their current brand is working well. How do you tell them the truth without losing trust or the relationship?',
      phase: 2,
      difficulty: 'application',
      variantId: 'dante_ethical_persuasion_phase2',
      timeLimit: 120,
      initialContext: {
        label: 'FOUNDER_MEETING',
        content: `FOUNDER (excited):
"I've been thinking about this for months. Our brand feels... stale. We need something modern. Bold. Something that screams innovation.

I want a complete rebrand. Logo, colors, website, messaging—everything.

I know it's expensive, but this is an investment in our future."

CONTEXT YOU KNOW (but he doesn't):
- Current brand has 87% donor recognition
- Last rebrand (5 years ago) caused 23% donor drop
- Community surveys show trust in current visual identity
- His board hasn't approved this yet

APPROACH OPTIONS:
A) Agree and take the project (easy commission, but wrong for them)
B) Direct confrontation: "Your idea is bad" (truthful but relationship-ending)
C) Ask questions to help him discover the risk himself (ethical persuasion)
D) Suggest a brand "refresh" instead of full rebrand (compromise)

What's the most ethical approach?`,
        displayStyle: 'text'
      },
      successFeedback: '✓ ETHICAL WIN: Option C - Ask questions. "What problem does the current brand fail to solve?" Let him realize the brand isn\'t the issue. Truth through discovery.',
      successThreshold: 85,
      unlockRequirements: {
        trustMin: 5,
        previousPhaseCompleted: 'dante_active_listening_phase1'
      }
    },
    choices: [
      {
        choiceId: 'phase2_success',
        text: "Guide him to discover the answer himself.",
        nextNodeId: 'dante_simulation_phase2_success',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      }
    ],
    onEnter: [{
      characterId: 'dante',
      addKnowledgeFlags: ['dante_simulation_phase2_complete']
    }],
    tags: ['simulation', 'phase2']
  },

  {
    nodeId: 'dante_simulation_phase2_success',
    speaker: 'Dante Moreau',
    content: [{
      text: "That\'s it. That\'s the move.\n\nYou didn\'t tell him he was wrong. You didn\'t take his money. You asked a question that let him see it himself.\n\n'What problem does the current brand fail to solve?'\n\nWhen he couldn't answer that... he realized. The brand wasn't the problem. His boredom was.\n\nThat\'s what ethical persuasion looks like. Not manipulation. Not even convincing. Just... clarity.\n\nYou can sell truth. You just have to trust the other person enough to let them find it.",
      emotion: 'grateful_awed',
      variation_id: 'phase2_success_v1',
      richEffectContext: 'success'
    }],
    choices: [
      {
        choiceId: 'phase2_success_continue',
        text: "You helped him avoid a mistake.",
        nextNodeId: 'dante_exploration_hub',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'dante',
          trustChange: 2
        }
      }
    ],
    tags: ['simulation', 'success']
  },

  {
    nodeId: 'dante_simulation_phase2_fail',
    speaker: 'Dante Moreau',
    content: [{
      text: "That approach... it either takes his money or loses his trust.\n\nThere's a third way. Harder than both.\n\nYou ask questions that help him see what you see. Not telling. Not selling. Just... illuminating.\n\n'What problem does your current brand fail to solve?'\n\nIf he can't answer that, he'll realize the brand isn\'t broken. And you didn't have to be the one to say it.",
      emotion: 'patient_teaching',
      variation_id: 'phase2_fail_v1'
    }],
    choices: [
      {
        choiceId: 'phase2_fail_continue',
        text: "Questions as truth-telling.",
        nextNodeId: 'dante_exploration_hub',
        pattern: 'patience',
        consequence: {
          characterId: 'dante',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'fail']
  },

  // ============= PHASE 3 SIMULATION: SELLING TRUTH (Trust ≥ 8, Post-Vulnerability) =============
  {
    nodeId: 'dante_simulation_phase3_setup',
    speaker: 'Dante Moreau',
    content: [{
      text: "I need your help with something I've never done before.\n\nActual selling. Not manipulation. Not charm. Just... truth.\n\nThere's a youth program in New Orleans. Kids like I used to be. Learning to read people, but not being taught why it matters. How to use that gift without losing yourself.\n\nI want to pitch them on building an ethical sales curriculum. Teaching influence as service, not extraction.\n\nBut I've spent so long avoiding my own talent... I don't know if I can pitch something I genuinely believe in.\n\nWill you help me practice?",
      emotion: 'vulnerable_determined',
      variation_id: 'simulation_phase3_intro_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 8 },
      hasGlobalFlags: ['dante_vulnerability_revealed'],
      hasKnowledgeFlags: ['dante_simulation_phase2_complete']
    },
    choices: [
      {
        choiceId: 'phase3_accept',
        text: "Let's craft a pitch you believe in.",
        nextNodeId: 'dante_simulation_phase3',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'phase3_gentle',
        text: "This isn't just a pitch. It's your transformation.",
        nextNodeId: 'dante_exploration_hub',
        pattern: 'patience',
        consequence: {
          characterId: 'dante',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'dante_arc', 'transformation']
  },

  {
    nodeId: 'dante_simulation_phase3',
    speaker: 'Dante Moreau',
    content: [{
      text: "Here's what I want to say. Help me make it true.",
      emotion: 'vulnerable_focused',
      variation_id: 'simulation_phase3_v1'
    }],
    simulation: {
      type: 'chat_negotiation',
      title: 'Authentic Persuasion: Selling What You Believe',
      taskDescription: 'Craft a pitch for an ethical sales curriculum that balances passion, evidence, and vulnerability. This isn\'t manipulation—it\'s authentic persuasion.',
      phase: 3,
      difficulty: 'mastery',
      variantId: 'dante_authentic_pitch_phase3',
      timeLimit: 90,
      initialContext: {
        label: 'PITCH_FRAMEWORK',
        content: `PROGRAM: Ethical Sales & Influence Curriculum for At-Risk Youth

YOUR GOAL: Convince program director to pilot this curriculum

AVAILABLE ELEMENTS:
1. EMOTIONAL HOOK: "I learned to read people in survival mode. These kids deserve better."
2. DATA: Sales skills increase employability by 47% (BLS)
3. DIFFERENTIATION: "Not manipulation. Service. Not extraction. Empowerment."
4. VULNERABILITY: "I've spent years fearing this gift. I want them to embrace it."
5. CALL TO ACTION: "8-week pilot. 20 students. Let me prove it works."

PITCH STRUCTURE OPTIONS:
A) Lead with emotion → data → call to action (classic persuasion arc)
B) Lead with vulnerability → differentiation → emotional close (authentic arc)
C) Lead with data → differentiation → vulnerability (credibility-first arc)
D) Lead with story → mirror their values → collaborative invitation (ethical arc)

Which structure creates genuine persuasion without manipulation?`,
        displayStyle: 'text'
      },
      successFeedback: '✓ AUTHENTIC PITCH: Option D - Story first (your journey), mirror their mission (youth empowerment), invite collaboration (we build this together). Truth as the foundation.',
      successThreshold: 95,
      unlockRequirements: {
        trustMin: 8,
        previousPhaseCompleted: 'dante_ethical_persuasion_phase2',
        requiredFlags: ['dante_vulnerability_revealed']
      }
    },
    choices: [
      {
        choiceId: 'phase3_success',
        text: "Your story IS the pitch. Lead with truth.",
        nextNodeId: 'dante_simulation_phase3_success',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication']
      }
    ],
    onEnter: [{
      characterId: 'dante',
      addKnowledgeFlags: ['dante_simulation_phase3_complete']
    }],
    tags: ['simulation', 'phase3', 'mastery']
  },

  {
    nodeId: 'dante_simulation_phase3_success',
    speaker: 'Dante Moreau',
    content: [{
      text: "You're right.\n\nThe pitch isn't the structure. It's not the data. It's not even the call to action.\n\nIt's the truth. My truth. That I learned to read people to survive. That I feared that gift because I saw how it could be weaponized. That these kids deserve to learn influence as service, not manipulation.\n\nThat's... that\'s a pitch I can deliver without losing myself.\n\nThank you. For showing me that selling truth isn't a technique. It's just... being honest about what matters.\n\nI think I can do that now. Finally.",
      emotion: 'transformed_grateful',
      variation_id: 'phase3_success_v1',
      richEffectContext: 'success',
      patternReflection: [
        {
          pattern: 'analytical',
          minLevel: 5,
          altText: "You see systems clearly. Maybe that's why you helped me see this.\n\nThe pitch isn't the framework. It's the truth underneath.\n\nMy truth: I learned to read people to survive. I feared that gift. But these kids deserve to learn influence as service, not manipulation.\n\nThat's a pitch grounded in data—my lived experience. Thank you for showing me that selling truth is just being honest about what the analysis reveals.",
          altEmotion: 'analytical_gratitude'
        },
        {
          pattern: 'patience',
          minLevel: 5,
          altText: "You've been so patient with me. Through all my doubt.\n\nThe pitch isn't rushing to the close. It's taking time to be truthful.\n\nMy truth: I learned to read people. I feared that gift. These kids deserve better.\n\nThank you. For showing me that selling truth requires patience—with myself, with the process. I think I can do that now.",
          altEmotion: 'patient_gratitude'
        },
        {
          pattern: 'exploring',
          minLevel: 5,
          altText: "You helped me explore territory I was afraid of.\n\nThe pitch isn't the route I mapped. It's discovering my authentic path.\n\nMy truth: I learned to read people. I feared that gift could be weaponized. These kids deserve to learn influence as service.\n\nThank you. For showing me that selling truth is exploring what matters—and having the courage to share that discovery.",
          altEmotion: 'explorer_gratitude'
        },
        {
          pattern: 'helping',
          minLevel: 5,
          altText: "You helped me when I couldn't help myself.\n\nThe pitch isn't about me. It's about serving these kids.\n\nMy truth: I learned to read people. I feared that gift. But these kids deserve to learn influence that helps, not manipulates.\n\nThank you. For showing me that selling truth is just helping people understand what genuinely matters. I can do that now.",
          altEmotion: 'helping_gratitude'
        },
        {
          pattern: 'building',
          minLevel: 5,
          altText: "You helped me rebuild what I thought was broken.\n\nThe pitch isn't constructed—it's the foundation I've been standing on.\n\nMy truth: I learned to read people. I feared that gift. These kids deserve better than manipulation disguised as influence.\n\nThank you. For showing me that selling truth is building from authentic foundation—not constructing a facade. I can do that now.",
          altEmotion: 'builder_gratitude'
        }
      ]
    }],
    choices: [
      {
        choiceId: 'phase3_success_continue',
        text: "You were always capable of this. You just needed to trust yourself.",
        nextNodeId: 'dante_exploration_hub',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'dante',
          trustChange: 3,
          addGlobalFlags: ['dante_authentic_selling_mastery']
        }
      }
    ],
    tags: ['simulation', 'success', 'transformation']
  },

  {
    nodeId: 'dante_simulation_phase3_fail',
    speaker: 'Dante Moreau',
    content: [{
      text: "That structure... it\'s still a technique. Still a framework. Still manipulation dressed up as authenticity.\n\nI don't know if I can pitch this without it feeling like I'm selling them on something. Even if I believe in it.\n\nMaybe some people aren't meant to sell truth. Maybe I'm one of them.",
      emotion: 'defeated_vulnerable',
      variation_id: 'phase3_fail_v1'
    }],
    choices: [
      {
        choiceId: 'phase3_fail_continue',
        text: "The fact that you question it means you're ready.",
        nextNodeId: 'dante_exploration_hub',
        pattern: 'patience',
        consequence: {
          characterId: 'dante',
          trustChange: 1
        }
      }
    ],
    tags: ['simulation', 'fail']
  }
]

// Entry points for navigation
export const danteEntryPoints = {
  INTRODUCTION: 'dante_introduction',
  SIMULATION: 'dante_sim_reluctant',
  VULNERABILITY: 'dante_vulnerability_arc',
  MYSTERY_HINT: 'dante_mystery_hint'
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
