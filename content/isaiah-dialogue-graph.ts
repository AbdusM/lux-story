/**
 * Isaiah Greene's Dialogue Graph
 * The Reluctant Fundraiser - Nonprofit/Fundraising Specialist
 *
 * LinkedIn 2026 Role: #14 Fundraising Officers
 * Animal: Elephant (gray/green palette)
 * Tier: 3 (Secondary) - 35 nodes target, 6 voice variations
 *
 * Core Conflict: Burned out on saving the world one donor at a time. Questioning if charity fixes systems.
 * Backstory: Former youth pastor who pivoted to nonprofit work. Carries the weight of "the kid he couldn't save."
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const isaiahDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'isaiah_introduction',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_intro_v1',
        text: "You know what nobody tells you about saving the world? It doesn't stay saved.\n\nI've been doing this work for twelve years. Youth programs. Community development. Donor cultivation. And every year, the problems are bigger than the year before.\n\nI'm not trying to be cynical. I'm trying to be honest. Because if you're here to make a difference... you deserve to know what that actually costs.",
        emotion: 'weary_honest',
        patternReflection: [
          { pattern: 'helping', minLevel: 5, altText: "You know what nobody tells you about saving the world? It doesn't stay saved.\n\nYou've got that look. The one that says you actually care about other people. Don't lose that. But also... protect it. Because this work will try to burn it out of you.", altEmotion: 'protective' },
          { pattern: 'building', minLevel: 5, altText: "You know what nobody tells you about saving the world? It doesn't stay saved.\n\nYou're a builder. I can tell. You want to construct something that lasts. That's good—because the work needs people who think in systems, not just emergencies.", altEmotion: 'appreciative' },
          { pattern: 'analytical', minLevel: 5, altText: "You know what nobody tells you about saving the world? It doesn't stay saved.\n\nYou're thinking 'that's not how impact works.' You want metrics. Outcomes. Evidence. Good. We need that. Too much nonprofit work runs on feelings instead of data.", altEmotion: 'approving' }
        ]
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_intro_cost',
        text: "What does it actually cost?",
        nextNodeId: 'isaiah_real_cost',
        pattern: 'helping',
        skills: ['empathy', 'emotionalIntelligence'],
        voiceVariations: {
          helping: "Tell me what it costs. I need to know.",
          analytical: "Define the costs. Emotional? Financial? Opportunity?",
          building: "What has the work taken from you?",
          exploring: "What did you expect it to cost versus what it actually cost?",
          patience: "The cost. I'm listening."
        }
      },
      {
        choiceId: 'isaiah_intro_cynical',
        text: "You sound more than honest. You sound burned out.",
        nextNodeId: 'isaiah_burnout',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication'],
        voiceVariations: {
          patience: "There's something heavier than honesty in what you said.",
          helping: "You're carrying something. Burnout? Something else?",
          analytical: "The pattern in your speech suggests emotional depletion.",
          building: "You've been trying to build something and the foundation keeps crumbling.",
          exploring: "What broke? Something specific?"
        },
        consequence: {
          characterId: 'isaiah',
          trustChange: 1,
          addKnowledgeFlags: ['noticed_isaiah_burnout']
        }
      },
      {
        choiceId: 'isaiah_intro_difference',
        text: "But you're still here. You still believe in the work.",
        nextNodeId: 'isaiah_still_believe',
        pattern: 'exploring',
        skills: ['criticalThinking', 'communication'],
        voiceVariations: {
          exploring: "Twelve years. You're still here. Why?",
          helping: "Something keeps you going despite all that.",
          analytical: "The cost-benefit analysis still favors continuing?",
          building: "You've rebuilt your motivation. How?",
          patience: "Still here. Still doing the work. That means something."
        }
      },
      {
        choiceId: 'isaiah_intro_youth',
        text: "Youth programs. You work with kids?",
        nextNodeId: 'isaiah_kids_work',
        pattern: 'helping',
        skills: ['curiosity', 'communication'],
        voiceVariations: {
          helping: "Kids. That's where the heart of the work is, isn't it?",
          building: "Youth programs. Building the next generation.",
          analytical: "What age range? What outcomes do you target?",
          exploring: "Tell me about the kids you work with.",
          patience: "Youth. That's where you started."
        }
      },
      {
        choiceId: 'isaiah_intro_show_work',
        text: "Show me what you're working on.",
        nextNodeId: 'isaiah_sim_donor',
        pattern: 'exploring',
        skills: ['curiosity', 'learningAgility'],
        voiceVariations: {
          exploring: "Can you walk me through a fundraising challenge?",
          analytical: "Show me the mechanics of donor cultivation.",
          building: "Let me see how you build funding relationships.",
          helping: "I'd like to understand what you're up against.",
          patience: "Show me. I'll observe."
        }
      }
    ],
    onEnter: [
      { addGlobalFlags: ['met_isaiah'] },
      { characterId: 'isaiah', addKnowledgeFlags: ['isaiah_met'] }
    ],
    tags: ['isaiah_intro', 'first_meeting']
  },

  // ============= REAL COST =============
  {
    nodeId: 'isaiah_real_cost',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_cost_v1',
        text: "Sleep. Relationships. The ability to enjoy things without guilt.\n\nWhen you do this work, you become a container for other people's trauma. Kids tell you things they've never told anyone. Donors tell you what they want to believe about themselves. Your job is to hold it all without cracking.\n\nAnd some days... you crack anyway. And nobody's there to hold you.\n\nThe salary doesn't compensate. The mission statements don't cover it. You do this because you have to. Because walking away feels like betrayal.",
        emotion: 'raw'
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_cost_hold',
        text: "Who holds you when you crack?",
        nextNodeId: 'isaiah_who_holds',
        pattern: 'helping',
        skills: ['empathy', 'emotionalIntelligence'],
        consequence: {
          characterId: 'isaiah',
          trustChange: 2,
          addKnowledgeFlags: ['isaiah_support_question']
        }
      },
      {
        choiceId: 'isaiah_cost_betrayal',
        text: "Betrayal of whom?",
        nextNodeId: 'isaiah_betrayal',
        pattern: 'patience',
        skills: ['criticalThinking', 'emotionalIntelligence']
      },
      {
        choiceId: 'isaiah_cost_worth',
        text: "Is it worth it? Honestly?",
        nextNodeId: 'isaiah_worth_it',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    tags: ['isaiah_arc', 'burnout', 'cost']
  },

  // ============= WHO HOLDS =============
  {
    nodeId: 'isaiah_who_holds',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_holds_v1',
        text: "[Long silence. Isaiah's eyes get bright.]\n\nNobody, for a long time. I thought needing support was weakness. Ministry training, you know? You're supposed to be the strong one.\n\nNow I have a therapist. Took me until last year to finally go. Best decision I've made in a decade.\n\nBut a lot of people in this work don't get there. They just... burn out. Leave. Or worse, stay but stop caring.",
        emotion: 'vulnerable'
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_therapy_helped',
        text: "What did therapy help you understand?",
        nextNodeId: 'isaiah_therapy_insight',
        pattern: 'helping',
        skills: ['empathy', 'emotionalIntelligence'],
        consequence: {
          characterId: 'isaiah',
          trustChange: 1
        }
      },
      {
        choiceId: 'isaiah_ministry_training',
        text: "Ministry training. You were in religious work before?",
        nextNodeId: 'isaiah_ministry_past',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['isaiah_arc', 'vulnerability', 'growth']
  },

  // ============= BURNOUT =============
  {
    nodeId: 'isaiah_burnout',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_burnout_v1',
        text: "[Isaiah's facade cracks, just slightly.]\n\nYeah. You're right.\n\nI've been running on fumes for... I don't know how long. Months? Years? At some point the exhaustion became normal. I forgot what rested felt like.\n\nThe thing is—burnout in this field is almost a badge of honor. 'Look how much I sacrificed.' But it's not sacrifice if you destroy yourself. Then you're just... destroyed.",
        emotion: 'tired_honest'
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_destroyed_recover',
        text: "Can you come back from destroyed?",
        nextNodeId: 'isaiah_recovery',
        pattern: 'helping',
        skills: ['empathy'],
        consequence: {
          characterId: 'isaiah',
          trustChange: 1
        }
      },
      {
        choiceId: 'isaiah_badge_honor',
        text: "Why is suffering glorified in nonprofit work?",
        nextNodeId: 'isaiah_suffering_culture',
        pattern: 'analytical',
        skills: ['criticalThinking', 'systemsThinking']
      },
      {
        choiceId: 'isaiah_burnout_hub',
        text: "Let's talk about something else for now.",
        nextNodeId: 'isaiah_exploration_hub',
        pattern: 'patience',
        skills: ['adaptability']
      }
    ],
    tags: ['isaiah_arc', 'burnout', 'vulnerability']
  },

  // ============= STILL BELIEVE =============
  {
    nodeId: 'isaiah_still_believe',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_believe_v1',
        text: "Believe? That's complicated.\n\nI believe in the kids. Every single one of them. I believe they deserve better than what the world has given them.\n\nBut the systems? The funding structures? The way we measure impact? Those I'm less sure about.\n\nSometimes I think we've built a nonprofit industrial complex that exists to make donors feel good more than to actually solve problems.\n\nBut what's the alternative? Not trying?",
        emotion: 'conflicted'
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_alternative',
        text: "What would actually solving problems look like?",
        nextNodeId: 'isaiah_real_solutions',
        pattern: 'building',
        skills: ['systemsThinking', 'criticalThinking']
      },
      {
        choiceId: 'isaiah_donors_feel_good',
        text: "Tell me about making donors feel good.",
        nextNodeId: 'isaiah_donor_reality',
        pattern: 'analytical',
        skills: ['financialLiteracy', 'communication']
      },
      {
        choiceId: 'isaiah_kids_believe',
        text: "The kids you believe in. Tell me about them.",
        nextNodeId: 'isaiah_kids_stories',
        pattern: 'helping',
        skills: ['empathy']
      }
    ],
    tags: ['isaiah_arc', 'beliefs', 'systems']
  },

  // ============= KIDS WORK =============
  {
    nodeId: 'isaiah_kids_work',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_kids_v1',
        text: "Started in youth ministry. Fourteen years old, running a Sunday school class because nobody else would.\n\nNow I'm Chief Development Officer for a youth services nonprofit. Fancy title. It means I spend most of my time asking rich people for money so we can keep the lights on for kids who have nowhere else to go.\n\nThe fundraising... it's necessary. But I miss being in the room with the kids. That's where the real work happens.",
        emotion: 'nostalgic'
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_real_work',
        text: "What happens in the room with the kids?",
        nextNodeId: 'isaiah_room_kids',
        pattern: 'helping',
        skills: ['empathy', 'curiosity']
      },
      {
        choiceId: 'isaiah_fundraising',
        text: "Tell me about the fundraising side.",
        nextNodeId: 'isaiah_fundraising_reality',
        pattern: 'building',
        skills: ['financialLiteracy']
      },
      {
        choiceId: 'isaiah_youth_ministry',
        text: "Youth ministry at fourteen. That's young to take on that responsibility.",
        nextNodeId: 'isaiah_early_calling',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['isaiah_arc', 'background', 'work']
  },

  // ============= EXPLORATION HUB =============
  {
    nodeId: 'isaiah_exploration_hub',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_hub_v1',
        text: "There's a lot I can tell you about this work. The good, the bad, the complicated.\n\nWhat do you want to know?",
        emotion: 'open'
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_hub_fundraising',
        text: "How fundraising actually works.",
        nextNodeId: 'isaiah_fundraising_mechanics',
        pattern: 'building',
        skills: ['financialLiteracy']
      },
      {
        choiceId: 'isaiah_hub_impact',
        text: "How you measure real impact.",
        nextNodeId: 'isaiah_impact_measurement',
        pattern: 'analytical',
        skills: ['criticalThinking', 'criticalThinking']
      },
      {
        choiceId: 'isaiah_hub_stories',
        text: "The kids who made it. And the ones who didn't.",
        nextNodeId: 'isaiah_kids_outcomes',
        pattern: 'helping',
        skills: ['empathy']
      },
      {
        choiceId: 'isaiah_hub_samuel',
        text: "I need to explore other parts of the station.",
        nextNodeId: samuelEntryPoints.HUB_INITIAL,
        pattern: 'exploring',
        skills: ['adaptability']
      }
    ],
    tags: ['isaiah_arc', 'hub', 'navigation']
  },

  // ============= FUNDRAISING MECHANICS =============
  {
    nodeId: 'isaiah_fundraising_mechanics',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_fund_v1',
        text: "Alright. Fundraising 101.\n\nSmall donations keep the lights on. $25, $50—they add up. But they're not enough to grow programs.\n\nMajor gifts move the needle. $10,000 and up. That's where I spend most of my time. Cultivation, solicitation, stewardship. Fancy words for: build relationship, make ask, maintain relationship after they give.\n\nThe trick? Donors give when they feel connected to the mission. Your job is to be the bridge between their values and your work.\n\nSome people find that manipulative. I find it honest. I'm not making them care about something new—I'm helping them act on what they already care about.",
        emotion: 'teaching'
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_cultivation',
        text: "What does cultivation actually look like?",
        nextNodeId: 'isaiah_cultivation_detail',
        pattern: 'building',
        skills: ['collaboration', 'communication']
      },
      {
        choiceId: 'isaiah_manipulative',
        text: "Where's the line between connection and manipulation?",
        nextNodeId: 'isaiah_manipulation_line',
        pattern: 'analytical',
        skills: ['integrity']
      },
      {
        choiceId: 'isaiah_major_ask',
        text: "Walk me through a major gift ask.",
        nextNodeId: 'isaiah_major_gift_sim',
        pattern: 'exploring',
        skills: ['curiosity', 'financialLiteracy']
      }
    ],
    tags: ['isaiah_arc', 'fundraising', 'teaching']
  },

  // ============= VULNERABILITY ARC =============
  {
    nodeId: 'isaiah_vulnerability_arc',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_vuln_v1',
        text: "[Isaiah's voice drops. He's looking at his hands.]\n\nThere was a kid. Marcus. Not his real name, but I call him that in my head.\n\nFourteen when he came to us. Brilliant. Angry. All the things that make you both worry and hope.\n\nI invested everything in that kid. Extra tutoring. My personal cell number. Drove him to college visits.\n\nHe died three days before his eighteenth birthday. Drug deal gone wrong.\n\nI was supposed to be his bridge to something better. And I couldn't... I couldn't...\n\n[Isaiah stops. Collects himself.]\n\nI haven't told anyone the whole story in years.",
        emotion: 'grief'
      }
    ],
    requiredState: { trust: { min: 6 } },
    onEnter: [
      { characterId: 'isaiah', addKnowledgeFlags: ['isaiah_vulnerability_revealed', 'marcus_story'] }
    ],
    choices: [
      {
        choiceId: 'isaiah_vuln_not_fault',
        text: "That wasn't your fault.",
        nextNodeId: 'isaiah_fault_response',
        pattern: 'helping',
        skills: ['empathy', 'communication']
      },
      {
        choiceId: 'isaiah_vuln_kept_going',
        text: "And you kept going. After that.",
        nextNodeId: 'isaiah_kept_going',
        pattern: 'patience',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'isaiah',
          trustChange: 2
        }
      },
      {
        choiceId: 'isaiah_vuln_silence',
        text: "[Sit with him in silence. Some things don't need words.]",
        nextNodeId: 'isaiah_silence',
        pattern: 'patience',
        skills: ['grounding', 'emotionalIntelligence'],
        consequence: {
          characterId: 'isaiah',
          trustChange: 2
        }
      }
    ],
    tags: ['isaiah_arc', 'vulnerability', 'marcus', 'deep_trust']
  },

  // ============= SILENCE =============
  {
    nodeId: 'isaiah_silence',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_silence_v1',
        text: "[The station hums around you both. Isaiah breathes. You wait.]\n\n...\n\nThank you. For not trying to fix it.\n\nMost people hear that story and immediately want to make me feel better. Tell me it wasn't my fault. Tell me I made a difference to other kids.\n\nBut sometimes you just need to sit in the grief. Let it be real.\n\nYou understand that.",
        emotion: 'grateful_heavy'
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_grief_sit',
        text: "Grief doesn't want solutions. It wants witnesses.",
        nextNodeId: 'isaiah_witnesses',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'isaiah',
          trustChange: 1
        }
      },
      {
        choiceId: 'isaiah_grief_carry',
        text: "You still carry Marcus with you.",
        nextNodeId: 'isaiah_carry_marcus',
        pattern: 'patience',
        skills: ['empathy']
      }
    ],
    tags: ['isaiah_arc', 'grief', 'connection']
  },

  // ============= KEPT GOING =============
  {
    nodeId: 'isaiah_kept_going',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_kept_v1',
        text: "Almost didn't.\n\nI went dark for three months after the funeral. Quit my job. Stopped returning calls. Thought about leaving the field entirely.\n\nBut then I thought about all the other kids who were still here. Still showing up. Still needing someone to believe in them.\n\nIf I left, Marcus's story would just be tragedy. If I stayed, maybe... maybe I could make it mean something.\n\nI'm still figuring out what that meaning is.",
        emotion: 'searching'
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_meaning_found',
        text: "What meaning have you found so far?",
        nextNodeId: 'isaiah_meaning_progress',
        pattern: 'helping',
        skills: ['empathy', 'communication'],
        consequence: {
          characterId: 'isaiah',
          trustChange: 1
        }
      },
      {
        choiceId: 'isaiah_other_kids',
        text: "Tell me about the other kids. The ones who made it.",
        nextNodeId: 'isaiah_success_stories',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['isaiah_arc', 'grief', 'resilience']
  },

  // ============= SIMULATION: THE MAJOR DONOR =============
  {
    nodeId: 'isaiah_sim_donor',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_sim_v1',
        text: "Alright, let me give you a scenario.\n\nYou're meeting with a potential major donor. She's wealthy—inherited money, runs a family foundation. She's interested in youth programs.\n\nBut here's the catch: she wants to fund a music program. Your organization doesn't have a music program. You have mentorship, job training, college prep.\n\nThe donation would be $100,000. You need the money desperately.\n\nWhat do you do?",
        emotion: 'testing'
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_sim_start_music',
        text: "Start a music program. Adapt to what donors want.",
        nextNodeId: 'isaiah_sim_adapt_response',
        pattern: 'building',
        skills: ['adaptability', 'financialLiteracy']
      },
      {
        choiceId: 'isaiah_sim_redirect',
        text: "Thank her and redirect. Explain what you do offer.",
        nextNodeId: 'isaiah_sim_redirect_response',
        pattern: 'patience',
        skills: ['communication', 'communication']
      },
      {
        choiceId: 'isaiah_sim_connect',
        text: "Find out why music matters to her. Maybe there's a bridge.",
        nextNodeId: 'isaiah_sim_connect_response',
        pattern: 'helping',
        skills: ['empathy', 'curiosity'],
        consequence: {
          characterId: 'isaiah',
          trustChange: 1
        }
      },
      {
        choiceId: 'isaiah_sim_decline',
        text: "Decline gracefully. Refer her to an organization with music programs.",
        nextNodeId: 'isaiah_sim_decline_response',
        pattern: 'analytical',
        skills: ['integrity', 'integrity']
      }
    ],
    tags: ['isaiah_sim', 'simulation', 'fundraising']
  },

  // ============= SIM CONNECT RESPONSE =============
  {
    nodeId: 'isaiah_sim_connect_response',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_connect_v1',
        text: "[Isaiah actually smiles—a real one.]\n\nThat's exactly right. That's what I would do.\n\nMaybe music was important to her son. Maybe she played piano as a kid and it saved her. The 'what' matters less than the 'why.'\n\nOnce you understand why music matters to her, you can often find a connection to your actual work. 'We don't have a formal music program, but we partner with the community center next door. And our mentors use creative expression in their sessions.'\n\nYou're not lying. You're finding genuine alignment.\n\nThe best fundraisers are translators, not salespeople.",
        emotion: 'approving'
      }
    ],
    onEnter: [
      {
        characterId: 'isaiah',
        addKnowledgeFlags: ['isaiah_simulation_phase1_complete']
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_translators',
        text: "Translators. What else do you translate?",
        nextNodeId: 'isaiah_translation_work',
        pattern: 'building',
        skills: ['communication']
      },
      {
        choiceId: 'isaiah_another_sim',
        text: "Can I try another scenario?",
        nextNodeId: 'isaiah_sim_burnout',
        pattern: 'exploring',
        skills: ['problemSolving']
      }
    ],
    tags: ['isaiah_sim', 'simulation', 'teaching']
  },

  // ============= SIM BURNOUT =============
  {
    nodeId: 'isaiah_sim_burnout',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_sim_burn_v1',
        text: "Harder one.\n\nYou've been at your nonprofit for five years. You've raised millions. But you're exhausted. Your relationships are suffering. You fantasize about quitting every morning.\n\nYour executive director calls you in. 'We just lost our biggest donor. I need you to cultivate three new major gifts by end of quarter, or we're laying off program staff.'\n\nWhat do you do?",
        emotion: 'serious'
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_burn_push',
        text: "Push through. The program staff need their jobs.",
        nextNodeId: 'isaiah_burn_push_response',
        pattern: 'helping',
        skills: ['resilience']
      },
      {
        choiceId: 'isaiah_burn_boundaries',
        text: "Set boundaries. Tell the ED you'll do what you can, sustainably.",
        nextNodeId: 'isaiah_burn_boundary_response',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'communication']
      },
      {
        choiceId: 'isaiah_burn_quit',
        text: "Start looking for another job.",
        nextNodeId: 'isaiah_burn_quit_response',
        pattern: 'exploring',
        skills: ['resilience']
      }
    ],
    tags: ['isaiah_sim', 'simulation', 'burnout']
  },

  // ============= DONOR REALITY =============
  {
    nodeId: 'isaiah_donor_reality',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_donor_v1',
        text: "Here's the uncomfortable truth.\n\nMost major donors don't give because they've analyzed the evidence and concluded your nonprofit is the most effective use of their money. They give because it makes them feel good. Connected. Meaningful.\n\nSome of them genuinely want to help. Some want tax breaks. Some want their name on a building. Some want to assuage guilt about how they made their money.\n\nYour job is to find alignment between their motivations—whatever they are—and your mission.\n\nIs that manipulation? Or is it just... understanding human nature?",
        emotion: 'realistic'
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_motivation_spectrum',
        text: "Walk me through that motivation spectrum.",
        nextNodeId: 'isaiah_motivations',
        pattern: 'analytical',
        skills: ['psychology']
      },
      {
        choiceId: 'isaiah_uncomfortable_donors',
        text: "Have you ever taken money you felt uncomfortable about?",
        nextNodeId: 'isaiah_uncomfortable_money',
        pattern: 'exploring',
        skills: ['integrity']
      },
      {
        choiceId: 'isaiah_best_donors',
        text: "Who are your favorite donors?",
        nextNodeId: 'isaiah_favorite_donors',
        pattern: 'helping',
        skills: ['collaboration']
      }
    ],
    tags: ['isaiah_arc', 'donors', 'reality']
  },

  // ============= IMPACT MEASUREMENT =============
  {
    nodeId: 'isaiah_impact_measurement',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_impact_v1',
        text: "Impact measurement is the holy grail everyone pretends they've found.\n\nWe track outputs: how many kids served, sessions held, hours of programming. Those are easy to count but don't tell you much.\n\nOutcomes are harder: graduation rates, college enrollment, employment. Better, but you can't prove causation.\n\nReal impact? Whether we actually changed the trajectory of a life? That takes decades to measure. Most funders won't wait.\n\nSo we measure what we can, tell stories that resonate, and hope we're making a difference we can't fully prove.",
        emotion: 'honest'
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_better_measurement',
        text: "Is there a better way to measure?",
        nextNodeId: 'isaiah_measurement_innovation',
        pattern: 'building',
        skills: ['systemsThinking', 'creativity']
      },
      {
        choiceId: 'isaiah_hope_enough',
        text: "Is hope enough to build a career on?",
        nextNodeId: 'isaiah_hope_career',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'isaiah_stories_matter',
        text: "Tell me about stories that resonated.",
        nextNodeId: 'isaiah_resonant_stories',
        pattern: 'helping',
        skills: ['communication']
      }
    ],
    tags: ['isaiah_arc', 'impact', 'measurement']
  },

  // ============= KIDS OUTCOMES =============
  {
    nodeId: 'isaiah_kids_outcomes',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_outcomes_v1',
        text: "[Isaiah's voice shifts—softer, more careful.]\n\nThe ones who made it... there's Jasmine. First in her family to graduate college. Now she's a social worker. Came back to work at the same organization that helped her.\n\nTyler. Got into trouble early—thought he was going to be another statistic. Now he runs a barbershop that quietly employs formerly incarcerated men.\n\nAnd then... there are the ones who didn't.\n\n[Pause.]\n\nI can tell you about Marcus. If you want to hear.",
        emotion: 'tender'
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_jasmine_tyler',
        text: "Tell me more about Jasmine and Tyler first.",
        nextNodeId: 'isaiah_success_detail',
        pattern: 'exploring',
        skills: ['curiosity']
      },
      {
        choiceId: 'isaiah_marcus_story',
        text: "I want to hear about Marcus.",
        nextNodeId: 'isaiah_vulnerability_arc',
        pattern: 'helping',
        skills: ['empathy', 'courage'],
        consequence: {
          characterId: 'isaiah',
          trustChange: 1
        }
      },
      {
        choiceId: 'isaiah_patterns',
        text: "What patterns do you see between the ones who made it and the ones who didn't?",
        nextNodeId: 'isaiah_patterns_seen',
        pattern: 'analytical',
        skills: ['criticalThinking', 'observation']
      }
    ],
    tags: ['isaiah_arc', 'outcomes', 'kids']
  },

  // ============= RETURN HUB =============
  {
    nodeId: 'isaiah_return_hub',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_return_v1',
        text: "This work isn't for everyone. It's demanding, underpaid, and emotionally exhausting.\n\nBut if you're called to it... there's nothing else like it.\n\nYou know where to find me.",
        emotion: 'warm_tired'
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_return_station',
        text: "I'll explore other parts of the station.",
        nextNodeId: samuelEntryPoints.HUB_INITIAL,
        pattern: 'exploring',
        skills: ['adaptability']
      },
      {
        choiceId: 'isaiah_return_stay',
        text: "I have more questions.",
        nextNodeId: 'isaiah_exploration_hub',
        pattern: 'patience',
        skills: ['curiosity']
      }
    ],
    tags: ['isaiah_arc', 'hub', 'navigation']
  },

  // ============= ADDITIONAL DEPTH NODES =============
  {
    nodeId: 'isaiah_betrayal',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_betray_v1',
        text: "The kids who are still here. The ones I've promised to help.\n\nEvery time I think about leaving, I see their faces. The ones who already trusted adults who left. The ones who built walls because everyone lets them down eventually.\n\nHow do I become another person who walked away?",
        emotion: 'conflicted'
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_sustainable',
        text: "You can't help them if you're destroyed. Sustainability isn't betrayal.",
        nextNodeId: 'isaiah_sustainability_insight',
        pattern: 'analytical',
        skills: ['criticalThinking', 'emotionalIntelligence']
      },
      {
        choiceId: 'isaiah_stay_hurt',
        text: "You're staying even though it hurts.",
        nextNodeId: 'isaiah_staying_pain',
        pattern: 'helping',
        skills: ['empathy']
      }
    ],
    tags: ['isaiah_arc', 'conflict', 'commitment']
  },

  {
    nodeId: 'isaiah_worth_it',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_worth_v1',
        text: "[Long pause. Isaiah seems to really consider the question.]\n\nFor me? Yes. Even on the worst days.\n\nBecause I've seen what happens when someone believes in a kid nobody else believed in. That spark of recognition. That moment when they realize they matter.\n\nYou can't put a price on that. And you can't measure it in outcomes.\n\nBut... I wouldn't tell everyone to do this. The cost is real. You have to know what you're sacrificing and choose it anyway.",
        emotion: 'honest_tired'
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_choose_anyway',
        text: "How do you make that choice every day?",
        nextNodeId: 'isaiah_daily_choice',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'isaiah_worth_hub',
        text: "What else should I know about this work?",
        nextNodeId: 'isaiah_exploration_hub',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['isaiah_arc', 'worth', 'calling']
  },

  {
    nodeId: 'isaiah_fault_response',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_fault_v1',
        text: "I know that. Intellectually, I know that.\n\nBut there's this part of me that keeps asking: what if I'd done more? What if I'd driven him home that night? What if I'd pushed harder for him to stay at the program center instead of going back to his neighborhood?\n\nThe 'what ifs' don't stop, even when you know they're not fair.\n\nTherapy helped me stop blaming myself. But I still... I still feel responsible. Like I should have seen it coming.",
        emotion: 'anguished'
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_responsibility_vs_blame',
        text: "There's a difference between responsibility and blame.",
        nextNodeId: 'isaiah_difference',
        pattern: 'analytical',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'isaiah_what_ifs',
        text: "The 'what ifs' mean you loved him.",
        nextNodeId: 'isaiah_loved_him',
        pattern: 'helping',
        skills: ['empathy'],
        consequence: {
          characterId: 'isaiah',
          trustChange: 1
        }
      }
    ],
    tags: ['isaiah_arc', 'marcus', 'grief']
  },

  {
    nodeId: 'isaiah_loved_him',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_loved_v1',
        text: "[Isaiah's eyes shine. He blinks rapidly.]\n\nYeah. I did.\n\nYou're not supposed to say that in professional settings. Boundaries. Appropriate distance. But the truth is, you can't do this work without loving the kids.\n\nAnd when you love someone, losing them... it breaks something.\n\nI don't want that something to heal completely. Because if it healed, I might forget why I do this.",
        emotion: 'grief_tender'
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_broken_motivation',
        text: "The broken part keeps you going.",
        nextNodeId: 'isaiah_broken_fuel',
        pattern: 'patience',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['isaiah_arc', 'marcus', 'love', 'grief']
  },

  {
    nodeId: 'isaiah_broken_fuel',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_broken_v1',
        text: "It does. In a strange way, Marcus is with me every time I meet a new kid.\n\nI think: This one. This one I won't lose.\n\nI know I can't save everyone. But I can try harder. Be more present. Catch the warning signs earlier.\n\nMarcus taught me that. In the worst way possible.\n\n[Quiet moment.]\n\nThank you. For letting me talk about him like he was a person, not a lesson.",
        emotion: 'grateful'
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_person_not_lesson',
        text: "He was a person. He still is, in your memory.",
        nextNodeId: 'isaiah_return_hub',
        pattern: 'helping',
        skills: ['empathy'],
        consequence: {
          characterId: 'isaiah',
          trustChange: 1
        }
      }
    ],
    tags: ['isaiah_arc', 'marcus', 'healing', 'connection']
  },

  // ═══════════════════════════════════════════════════════════════
  // MYSTERY BREADCRUMBS
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'isaiah_mystery_hint',
    speaker: 'isaiah',
    requiredState: {
      trust: { min: 5 }
    },
    content: [
      {
        text: "I've spent my life building communities. Bringing people together around shared purpose.\\n\\nThis station does that effortlessly. No fundraising, no marketing, no struggle for attention. People just... <shake>show up</shake>.",
        emotion: 'amazed',
        variation_id: 'mystery_hint_v1'
      },
      {
        text: "And they show up ready. Ready to help. Ready to connect. Ready to change.",
        emotion: 'inspired',
        variation_id: 'mystery_hint_v2'
      }
    ],
    choices: [
      {
        choiceId: 'isaiah_mystery_dig',
        text: "What do you think draws them here?",
        nextNodeId: 'isaiah_mystery_response',
        pattern: 'exploring'
      },
      {
        choiceId: 'isaiah_mystery_feel',
        text: "Maybe they were always ready. They just needed a place.",
        nextNodeId: 'isaiah_mystery_response',
        pattern: 'helping'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  {
    nodeId: 'isaiah_mystery_response',
    speaker: 'isaiah',
    content: [
      {
        text: "That's beautiful. And I think you're right.\\n\\nThe station isn't creating community. It's revealing it. Showing us we were connected all along.\\n\\nThat's the real miracle.",
        emotion: 'moved',
        variation_id: 'mystery_response_v1'
      }
    ],
    onEnter: [
      { characterId: 'isaiah', addKnowledgeFlags: ['isaiah_mystery_noticed'] }
    ],
    choices: [
      {
        choiceId: 'isaiah_mystery_return',
        text: "I'm glad I'm part of this community.",
        nextNodeId: 'isaiah_hub_return',
        pattern: 'helping'
      }
    ],
    tags: ['mystery', 'breadcrumb']
  },

  {
    nodeId: 'isaiah_hub_return',
    speaker: 'isaiah',
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
export const isaiahEntryPoints = {
  INTRODUCTION: 'isaiah_introduction',
  SIMULATION: 'isaiah_sim_donor',
  VULNERABILITY: 'isaiah_vulnerability_arc',
  MYSTERY_HINT: 'isaiah_mystery_hint'
} as const

// Build the graph
export const isaiahDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(isaiahDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: isaiahEntryPoints.INTRODUCTION,
  metadata: {
    title: "Isaiah's Bench",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: isaiahDialogueNodes.length,
    totalChoices: isaiahDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}
