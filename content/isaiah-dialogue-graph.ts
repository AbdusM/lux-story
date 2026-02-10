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
        emotion: 'raw',
        voiceVariations: {
          analytical: "Sleep. Relationships. Cognitive capacity for non-mission activities.\n\nWhen you do this work, you become a data repository for other people's trauma. Kids provide information they've never disclosed. Donors project their ideal selves. Your function is to process it all without system failure.\n\nAnd some days... the system fails anyway. And there's no backup.\n\nThe compensation doesn't offset cost. The value propositions don't account for it. You do this because the exit cost—abandoning commitments—exceeds the continuation cost.",
          helping: "Sleep. Relationships. The ability to enjoy anything without feeling like you should be helping.\n\nWhen you do this work, you become a vessel for other people's pain. Kids trust you with their worst moments. Donors trust you to heal the world for them. Your job is to carry it all without breaking.\n\nAnd some days... you break anyway. And nobody carries you.\n\nThe salary doesn't heal you. The mission statements don't hold you. You do this because stopping feels like abandoning people who need you.",
          building: "Sleep. Relationships. The foundation for a life outside the work.\n\nWhen you do this work, you become infrastructure for other people's trauma. Kids build their first safety on you. Donors build their identity through you. Your job is to bear the load without structural failure.\n\nAnd some days... the structure fails anyway. And there's no support beam.\n\nThe salary doesn't rebuild you. The mission statements don't reinforce you. You do this because walking away feels like demolishing what you've built.",
          exploring: "Sleep. Relationships. The ability to discover joy without mapping back to mission.\n\nWhen you do this work, you become a map for other people's trauma. Kids navigate their stories through you. Donors navigate their values through you. Your job is to chart it all without losing your way.\n\nAnd some days... you lose your way anyway. And there's no one to guide you back.\n\nThe salary doesn't orient you. The mission statements don't chart paths for you. You do this because turning back feels like abandoning the journey.",
          patience: "Sleep. Relationships. The ability to rest without guilt accumulating.\n\nWhen you do this work, you become a timeline for other people's trauma. Kids process their histories through you. Donors process their legacies through you. Your job is to hold it all without running out of time.\n\nAnd some days... time runs out anyway. And nobody gives you more.\n\nThe salary doesn't give you back years. The mission statements don't slow down the clock. You do this because walking away feels like wasting all the time you already gave."
        }
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
        emotion: 'vulnerable',
        voiceVariations: {
          analytical: "[Long silence. Isaiah processes.]\n\nNobody, for a long time. I thought requiring external support indicated system failure. Ministry training, you know? You're designed to be the support structure.\n\nNow I have a therapist. Took me until last year to implement that solution. Optimal decision in the past decade.\n\nBut a lot of people in this work don't reach that data point. They just... reach critical failure. Exit. Or worse, continue operating at zero effectiveness.",
          helping: "[Long silence. Isaiah's eyes shine with tears.]\n\nNobody, for a long time. I thought needing help meant I couldn't help others. Ministry training, you know? You're supposed to give, not receive.\n\nNow I have a therapist. Took me until last year to let someone care for me. Best gift I've given myself in a decade.\n\nBut a lot of people in this work don't get there. They just... burn out. Leave. Or worse, stay but their heart dies.",
          building: "[Long silence. Isaiah's foundation trembles.]\n\nNobody, for a long time. I thought needing support meant my construction was weak. Ministry training, you know? You're supposed to be the load-bearing wall.\n\nNow I have a therapist. Took me until last year to add that reinforcement. Strongest structural decision in a decade.\n\nBut a lot of people in this work don't build that support. They just... collapse. Abandon the site. Or worse, stay standing but hollow inside.",
          exploring: "[Long silence. Isaiah finds his words.]\n\nNobody, for a long time. I thought needing support meant I was lost. Ministry training, you know? You're supposed to be the guide.\n\nNow I have a therapist. Took me until last year to accept I needed navigation too. Best path I've found in a decade.\n\nBut a lot of people in this work don't discover that. They just... lose their way. Leave the field. Or worse, stay but wander without direction.",
          patience: "[Long silence. Isaiah takes his time.]\n\nNobody, for a long time. I thought needing support meant I was too slow to recover. Ministry training, you know? You're supposed to bounce back fast.\n\nNow I have a therapist. Took me until last year—too many years—to go. Best thing I've waited for in a decade.\n\nBut a lot of people in this work don't give themselves that time. They just... burn out faster. Leave. Or worse, stay but stop feeling anything."
        },
        interrupt: {
          duration: 3500,
          type: 'silence',
          action: 'Stay with him. Let the weight breathe before moving on.',
          targetNodeId: 'isaiah_interrupt_acknowledged',
          consequence: {
            characterId: 'isaiah',
            trustChange: 2
          }
        }
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
  {
    nodeId: 'isaiah_interrupt_acknowledged',
    speaker: 'Isaiah Greene',
    content: [{
      text: "Thank you for not rushing me.\n\nMost people want the fix. You gave me a minute to be honest.",
      emotion: 'grateful',
      variation_id: 'isaiah_interrupt_v1'
    }],
    choices: [
      {
        choiceId: 'isaiah_interrupt_continue',
        text: "What did therapy help you understand?",
        nextNodeId: 'isaiah_therapy_insight',
        pattern: 'helping',
        consequence: {
          characterId: 'isaiah',
          trustChange: 1
        }
      }
    ],
    tags: ['interrupt_target', 'emotional_moment', 'isaiah_arc']
  },

  // ============= BURNOUT =============
  {
    nodeId: 'isaiah_burnout',
    speaker: 'Isaiah Greene',
    content: [
      {
        variation_id: 'isaiah_burnout_v1',
        text: "[Isaiah's facade cracks, just slightly.]\n\nYeah. You're right.\n\nI've been running on fumes for... I don't know how long. Months? Years? At some point the exhaustion became normal. I forgot what rested felt like.\n\nThe thing is—burnout in this field is almost a badge of honor. 'Look how much I sacrificed.' But it's not sacrifice if you destroy yourself. Then you're just... destroyed.",
        emotion: 'tired_honest',
        voiceVariations: {
          analytical: "[Isaiah's data model reveals its flaws.]\n\nYeah. Accurate diagnosis.\n\nI've been operating below baseline capacity for... I don't know the duration. Months? Years? At some point low performance became the new normal. I lost my reference point for optimal function.\n\nThe thing is—burnout in this field is almost a performance metric. 'Look at my utilization rate.' But it's not efficiency if you degrade the system. Then you're just... degraded.",
          helping: "[Isaiah's heart shows through.]\n\nYeah. You see it.\n\nI've been running on empty for... I don't know how long. Months? Years? At some point exhaustion became who I am. I forgot what having energy to care felt like.\n\nThe thing is—burnout in this field is almost proof of love. 'Look how much I gave.' But it's not giving if you destroy yourself. Then you're just... gone. And you can't help anyone anymore.",
          building: "[Isaiah's structure shows the cracks.]\n\nYeah. You're right.\n\nI've been operating on failing infrastructure for... I don't know the timeline. Months? Years? At some point the deterioration became the baseline. I forgot what stable foundation felt like.\n\nThe thing is—burnout in this field is almost architectural achievement. 'Look how much load I carried.' But it's not strength if you collapse. Then you're just... rubble.",
          exploring: "[Isaiah's map shows the dead ends.]\n\nYeah. You're right.\n\nI've been navigating without reserves for... I don't know the distance. Months? Years? At some point being lost became normal. I forgot what having clear direction felt like.\n\nThe thing is—burnout in this field is almost a badge of exploration. 'Look how far I went.' But it's not discovery if you lose yourself. Then you're just... lost. Can't guide anyone else.",
          patience: "[Isaiah's timeline shows the cost.]\n\nYeah. You're right.\n\nI've been running on borrowed time for... I don't know how long anymore. Months? Years? At some point the rushing became constant. I forgot what rest felt like.\n\nThe thing is—burnout in this field is almost proof of commitment. 'Look at all the time I gave.' But it's not sacrifice if you destroy your future. Then you're just... used up. Nothing left to give."
        }
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
        emotion: 'nostalgic',
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "You help people. I see that in you immediately.\n\nStarted in youth ministry at fourteen. Sunday school because nobody else would step up. Now I'm CDO—fancy title for asking rich people for money so kids have somewhere to go.\n\nThe fundraising? Necessary. But I miss the room with the kids. That's where you actually help.", altEmotion: 'warm_nostalgic' },
          { pattern: 'building', minLevel: 4, altText: "You're a builder. So you'll understand this tension.\n\nStarted building Sunday school programs at fourteen. Now I build fundraising systems—asking donors for money so we can keep programs alive.\n\nThe systems work. But I miss being in the room building futures directly with kids. That's the construction I care about most.", altEmotion: 'nostalgic' },
          { pattern: 'patience', minLevel: 4, altText: "You're patient. I see that in how you listen.\n\nStarted in youth ministry at fourteen. Had to learn patience early—kids need time, not quick fixes.\n\nNow I fundraise. Still requires patience—cultivation takes years. But I miss the patience required in the room with kids. That's the patience that matters.", altEmotion: 'reflective' }
        ]
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
        emotion: 'open',
        patternReflection: [
          { pattern: 'helping', minLevel: 4, altText: "You care about people. I see it in how you listen—you're not just collecting facts, you're understanding impact.\n\nThere's a lot I can tell you about nonprofit work. Where do you want to help?", altEmotion: 'warm' },
          { pattern: 'analytical', minLevel: 4, altText: "You ask sharp questions. I respect that. Too many people want the feel-good story without the messy reality.\n\nThere's a lot I can tell you—good, bad, complicated. What do you want to analyze?", altEmotion: 'appreciative' },
          { pattern: 'building', minLevel: 4, altText: "You think like a builder. I can tell—you want to understand how things actually work, not just what they look like.\n\nThere's a lot to this work. What systems do you want to understand?", altEmotion: 'knowing' }
        ]
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
        emotion: 'teaching',
        skillReflection: [
          { skill: 'leadership', minLevel: 5, altText: "Alright. Fundraising 101. You've got leadership instincts—I can tell by how you engage.\n\nSmall donations build foundation. Major gifts ($10k+) enable growth. But the real skill? Being the bridge between donor values and organizational mission.\n\nLeaders understand that. You're connecting people to purpose. That's leadership applied to fundraising.", altEmotion: 'knowing' },
          { skill: 'communication', minLevel: 5, altText: "Alright. Fundraising 101. You communicate well—I've noticed how you listen.\n\nSmall donations keep lights on. Major gifts enable growth. But the real skill is communication: being the bridge between donor values and your work.\n\nYour communication skills are an asset here. Fundraising is just storytelling with purpose.", altEmotion: 'mentoring' }
        ],
        patternReflection: [
          { pattern: 'building', minLevel: 4, altText: "You're a builder. So you'll appreciate this.\n\nFundraising is building relationships at scale. Small donations build foundation. Major gifts ($10k+) build capacity.\n\nCultivation, solicitation, stewardship—fancy words for: build trust, make ask, maintain relationship.\n\nYour job is to be the bridge between donor values and organizational work. Build that connection right, and it sustains itself.", altEmotion: 'mentoring' },
          { pattern: 'analytical', minLevel: 4, altText: "You think analytically. Good. Fundraising has a clear structure.\n\nSmall donations: consistent revenue. Major gifts: growth capital. The math is simple.\n\nCultivation, solicitation, stewardship. Build relationship, make ask, maintain relationship. A system.\n\nThe variable? Connection. Donors give when values align with mission. Your job is to optimize for that connection.", altEmotion: 'teaching' },
          { pattern: 'helping', minLevel: 4, altText: "You help people. So you'll understand this instinctively.\n\nFundraising is helping donors act on what they already care about. I'm not manipulating—I'm connecting their values to our work.\n\nCultivation, solicitation, stewardship. Build relationship, invite giving, honor the gift.\n\nWhen it works, everyone wins. Donors feel meaningful. Kids get resources. That's helping at scale.", altEmotion: 'warm' }
        ]
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
        emotion: 'grief',
        patternReflection: [
          { pattern: 'helping', minLevel: 5, altText: "[Isaiah's voice drops. He's looking at his hands.]\n\nYou help people. I see that in you. So maybe you'll understand this.\n\nThere was a kid. Marcus. Fourteen. Brilliant, angry. I invested everything—tutoring, my cell number, college visits.\n\nHe died three days before his eighteenth birthday. Drug deal gone wrong.\n\nI was supposed to save him. And I... I couldn't.\n\nHow do you keep helping when you couldn't help the one who mattered most?", altEmotion: 'vulnerable_grief' },
          { pattern: 'patience', minLevel: 5, altText: "[Isaiah's voice drops. He's looking at his hands.]\n\nYou've been patient with me. That's why I'm telling you this.\n\nThere was a kid. Marcus. I gave him years—tutoring, mentorship, hope. Drug deal gone wrong, three days before his eighteenth birthday.\n\nI couldn't save him. And I don't know if patience was enough, or if I should have done more, faster.", altEmotion: 'vulnerable_grief' },
          { pattern: 'analytical', minLevel: 5, altText: "[Isaiah's voice drops. He's looking at his hands.]\n\nYou think systematically. So maybe you can help me understand this.\n\nMarcus. Fourteen. Brilliant, angry. I did everything by the book—tutoring, relationship-building, resources.\n\nHe died anyway. Drug deal gone wrong, three days before his eighteenth birthday.\n\nI've analyzed it a thousand times. What variable did I miss? What intervention would have worked?\n\nThere's no answer. And that breaks me.", altEmotion: 'vulnerable_analytical_grief' },
          { pattern: 'exploring', minLevel: 5, altText: "[Isaiah's voice drops. He's looking at his hands.]\n\nYou explore. You discover paths. Maybe you understand this better than I do.\n\nMarcus. Fourteen. Brilliant, angry. I tried to show him every path—college, trade school, opportunities beyond the street.\n\nHe died anyway. Drug deal gone wrong, three days before his eighteenth birthday.\n\nI mapped every route out of that neighborhood. But I couldn't navigate the one that mattered.\n\nHow do you keep exploring when you couldn't find the path that would have saved him?", altEmotion: 'vulnerable_lost' },
          { pattern: 'building', minLevel: 5, altText: "[Isaiah's voice drops. He's looking at his hands.]\n\nYou build things. Real things. Maybe you'll understand this construction.\n\nMarcus. Fourteen. Brilliant, angry. I tried to build him a foundation—education, relationships, structure.\n\nHe died anyway. Drug deal gone wrong, three days before his eighteenth birthday.\n\nI built every support I could think of. But the foundation wasn't strong enough.\n\nHow do you keep building when the most important thing you ever constructed... collapsed?", altEmotion: 'vulnerable_builder_grief' }
        ]
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
    onEnter: [
      {
        addGlobalFlags: ['isaiah_arc_complete']
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
      },
      {
        choiceId: 'offer_site_visit',
        text: "[Helper] Isaiah, you look like you could use support. Something happening today?",
        nextNodeId: 'isaiah_loyalty_trigger',
        pattern: 'helping',
        skills: ['empathy', 'emotionalIntelligence'],
        visibleCondition: {
          trust: { min: 8 },
          patterns: { helping: { min: 5 } },
          hasGlobalFlags: ['isaiah_arc_complete']
        }
      }
    ],
    tags: ['isaiah_arc', 'hub', 'navigation']
  },

  // ═══════════════════════════════════════════════════════════════
  // LOYALTY EXPERIENCE: THE SITE VISIT
  // Requires: Trust >= 8, Helping >= 50%, isaiah_arc_complete
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'isaiah_loyalty_trigger',
    speaker: 'Isaiah Greene',
    content: [{
      text: "Major donor site visit. Today. Two hours from now.\n\nDr. Patricia Chen. Runs a foundation that could fund our entire youth program for three years. She wants to see the work. Meet the kids. Understand the impact.\n\nNormally I'd be excited. Prepared. This is what I do.\n\nBut one of our kids—Jamal—just found out his mom's back in rehab. He's fourteen. He's barely holding it together. He asked if he could sit in my office during the visit.\n\nI could tell him no. Explain that this is important. That we need to look professional. That sometimes you have to put the mission ahead of the individual.\n\nBut that would make me a liar. Because the mission IS the individual. It's Jamal. And all the kids like him.\n\nYou understand presence. Would you... come with me? Help me figure out how to honor both? How to show Dr. Chen what matters without making Jamal invisible?",
      emotion: 'conflicted_determined',
      variation_id: 'loyalty_trigger_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 8 },
      patterns: { helping: { min: 5 } },
      hasGlobalFlags: ['isaiah_arc_complete']
    },
    metadata: {
      experienceId: 'the_site_visit'
    },
    choices: [
      {
        choiceId: 'accept_site_visit',
        text: "I'll be there.",
        nextNodeId: 'isaiah_loyalty_start',
        pattern: 'helping'
      },
      {
        choiceId: 'decline_site_visit',
        text: "That sounds like something you need to navigate yourself.",
        nextNodeId: 'isaiah_loyalty_declined'
      }
    ]
  },

  {
    nodeId: 'isaiah_loyalty_declined',
    speaker: 'Isaiah Greene',
    content: [{
      text: "I get it. Not everyone wants to be in the middle of that kind of tension.\n\nI'll figure it out. Always do.",
      emotion: 'understanding',
      variation_id: 'loyalty_declined_v1'
    }],
    choices: [
      {
        choiceId: 'return_to_hub',
        text: "Good luck with the visit.",
        nextNodeId: 'isaiah_return_hub'
      }
    ]
  },

  {
    nodeId: 'isaiah_loyalty_start',
    speaker: 'Isaiah Greene',
    content: [{
      text: "Youth center. Third floor. Conference room overlooks the gym.\n\nJamal will probably be in the corner with his headphones. Dr. Chen arrives at 2pm.\n\nThank you. For understanding that sometimes the work is holding space for two truths at once.",
      emotion: 'warm_grateful',
      variation_id: 'loyalty_start_v1'
    }],
    metadata: {
      experienceId: 'the_site_visit' // Experience engine takes over
    },
    onEnter: [
      { characterId: 'isaiah', addKnowledgeFlags: ['isaiah_loyalty_accepted'] }
    ],
    choices: []
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
      },
      {
        choiceId: 'isaiah_go_deeper',
        text: "Isaiah... there's more to this story. What happened with Marcus?",
        nextNodeId: 'isaiah_vulnerability_arc',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        visibleCondition: { trust: { min: 6 } },
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
  },

  // ============= TRUST RECOVERY =============
  {
    nodeId: 'isaiah_trust_recovery',
    speaker: 'Isaiah Greene',
    requiredState: {
      trust: { max: 3 }
    },
    content: [{
      text: "[He's holding a donor report. Numbers that represent people he couldn't help.]\n\nYou came back.\n\nI wasn't sure you would. Wasn't sure you should.\n\n[He sets it down heavily.]\n\nI carry a lot of weight. Twelve years of kids I couldn't save. Donors I had to smile for. Systems that stay broken no matter how hard I work.\n\nAnd I put that weight on you. Made you carry my burnout.\n\nThat wasn't fair. I'm sorry.",
      emotion: 'weary',
      variation_id: 'trust_recovery_v1',
      voiceVariations: {
        patience: "[He's holding a donor report. Numbers that represent people he couldn't help.]\n\nYou came back.\n\nYou gave me time. That patience... it's a gift I stopped giving myself.\n\nI wasn't sure you would. Wasn't sure you should.\n\n[He sets it down heavily.]\n\nI carry a lot of weight. Twelve years of kids I couldn't save. Donors I had to smile for. Systems that stay broken no matter how hard I work.\n\nAnd I put that weight on you. Made you carry my burnout. That wasn't fair. I'm sorry.",
        helping: "[He's holding a donor report. Numbers that represent people he couldn't help.]\n\nYou came back.\n\nEven after I couldn't help you the way you tried to help me.\n\nI wasn't sure you would. Wasn't sure you should.\n\n[He sets it down heavily.]\n\nI carry a lot of weight. Twelve years of kids I couldn't save. Donors I had to smile for. Systems that stay broken no matter how hard I work.\n\nAnd I put that weight on you. Made you carry my burnout. That wasn't fair. I'm sorry.",
        analytical: "[He's holding a donor report. Numbers that represent people he couldn't help.]\n\nYou came back.\n\nYou assessed the situation and chose grace.\n\nI wasn't sure you would. Wasn't sure you should.\n\n[He sets it down heavily.]\n\nI carry a lot of weight. Twelve years of kids I couldn't save. Donors I had to smile for. Systems that stay broken no matter how hard I work.\n\nAnd I put that weight on you. Made you carry my burnout. That wasn't fair. I'm sorry.",
        building: "[He's holding a donor report. Numbers that represent people he couldn't help.]\n\nYou came back.\n\nRebuilding after I tore down what you were trying to build.\n\nI wasn't sure you would. Wasn't sure you should.\n\n[He sets it down heavily.]\n\nI carry a lot of weight. Twelve years of kids I couldn't save. Donors I had to smile for. Systems that stay broken no matter how hard I work.\n\nAnd I put that weight on you. Made you carry my burnout. That wasn't fair. I'm sorry.",
        exploring: "[He's holding a donor report. Numbers that represent people he couldn't help.]\n\nYou came back.\n\nStill exploring even after I showed you the darkness.\n\nI wasn't sure you would. Wasn't sure you should.\n\n[He sets it down heavily.]\n\nI carry a lot of weight. Twelve years of kids I couldn't save. Donors I had to smile for. Systems that stay broken no matter how hard I work.\n\nAnd I put that weight on you. Made you carry my burnout. That wasn't fair. I'm sorry."
      }
    }],
    choices: [
      {
        choiceId: 'isaiah_recovery_together',
        text: "You don't have to carry it alone.",
        nextNodeId: 'isaiah_trust_restored',
        pattern: 'helping',
        skills: ['emotionalIntelligence'],
        consequence: {
          characterId: 'isaiah',
          trustChange: 2,
          addKnowledgeFlags: ['isaiah_trust_repaired']
        },
        voiceVariations: {
          patience: "Take it slow. You don't have to carry it alone.",
          helping: "You don't have to carry it alone. That's why I'm here.",
          analytical: "Distributed load reduces failure. You don't have to carry it alone.",
          building: "Build support systems. You don't have to carry it alone.",
          exploring: "Let's explore together. You don't have to carry it alone."
        }
      },
      {
        choiceId: 'isaiah_recovery_systems',
        text: "The system is broken. But you're not.",
        nextNodeId: 'isaiah_trust_restored',
        pattern: 'analytical',
        skills: ['wisdom'],
        consequence: {
          characterId: 'isaiah',
          trustChange: 2,
          addKnowledgeFlags: ['isaiah_trust_repaired']
        },
        voiceVariations: {
          patience: "Give yourself grace. The system is broken. But you're not.",
          helping: "You're doing your best. The system is broken. But you're not.",
          analytical: "Separate the variables. The system is broken. But you're not.",
          building: "You can't rebuild everything at once. The system is broken. But you're not.",
          exploring: "Examine the root cause. The system is broken. But you're not."
        }
      }
    ],
    tags: ['trust_recovery', 'isaiah_arc']
  },

  {
    nodeId: 'isaiah_trust_restored',
    speaker: 'Isaiah Greene',
    content: [{
      text: "[He takes a breath. First full breath you've seen him take.]\n\nYou're right.\n\nI've been fighting the same fight for twelve years. Trying to save everyone. Fix everything.\n\nAnd when I can't... I blame myself.\n\n[He looks at you with clearer eyes.]\n\nBut you're here. Still here. After I tried to push you away with my cynicism.\n\nMaybe... maybe that's what actually saves people. Not perfect programs or endless donors.\n\nJust showing up. Even when it's hard.\n\nThank you for showing up for me.",
      emotion: 'grateful_lighter',
      variation_id: 'trust_restored_v1',
      voiceVariations: {
        patience: "[He takes a breath. First full breath you've seen him take.]\n\nYou're right.\n\nYour patience reminded me it's not a race.\n\nI've been fighting the same fight for twelve years. Trying to save everyone. Fix everything.\n\nAnd when I can't... I blame myself.\n\n[He looks at you with clearer eyes.]\n\nBut you're here. Still here. After I tried to push you away with my cynicism.\n\nMaybe that's what actually saves people. Just showing up. Even when it's hard.\n\nThank you for showing up for me.",
        helping: "[He takes a breath. First full breath you've seen him take.]\n\nYou're right.\n\nYou showed me what care actually looks like.\n\nI've been fighting the same fight for twelve years. Trying to save everyone. Fix everything.\n\nAnd when I can't... I blame myself.\n\n[He looks at you with clearer eyes.]\n\nBut you're here. Still here. After I tried to push you away with my cynicism.\n\nMaybe that's what actually saves people. Just showing up. Even when it's hard.\n\nThank you for showing up for me.",
        analytical: "[He takes a breath. First full breath you've seen him take.]\n\nYou're right.\n\nYou saw what I couldn't analyze my way to seeing.\n\nI've been fighting the same fight for twelve years. Trying to save everyone. Fix everything.\n\nAnd when I can't... I blame myself.\n\n[He looks at you with clearer eyes.]\n\nBut you're here. Still here. After I tried to push you away with my cynicism.\n\nMaybe that's what actually saves people. Just showing up. Even when it's hard.\n\nThank you for showing up for me.",
        building: "[He takes a breath. First full breath you've seen him take.]\n\nYou're right.\n\nYou're building something I forgot existed. Hope.\n\nI've been fighting the same fight for twelve years. Trying to save everyone. Fix everything.\n\nAnd when I can't... I blame myself.\n\n[He looks at you with clearer eyes.]\n\nBut you're here. Still here. After I tried to push you away with my cynicism.\n\nMaybe that's what actually saves people. Just showing up. Even when it's hard.\n\nThank you for showing up for me.",
        exploring: "[He takes a breath. First full breath you've seen him take.]\n\nYou're right.\n\nYou explored past my defenses to find the person.\n\nI've been fighting the same fight for twelve years. Trying to save everyone. Fix everything.\n\nAnd when I can't... I blame myself.\n\n[He looks at you with clearer eyes.]\n\nBut you're here. Still here. After I tried to push you away with my cynicism.\n\nMaybe that's what actually saves people. Just showing up. Even when it's hard.\n\nThank you for showing up for me."
      }
    }],
    choices: [{
      choiceId: 'isaiah_recovery_complete',
      text: "(Continue)",
      nextNodeId: 'isaiah_hub_return',
      pattern: 'patience'
    }],
    tags: ['trust_recovery', 'isaiah_arc'],
    onEnter: [{
      characterId: 'isaiah',
      addKnowledgeFlags: ['isaiah_trust_recovery_completed']
    }]
  },

  // ═══════════════════════════════════════════════════════════════
  // STUB NODES - Fix broken navigation (content TBD)
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'isaiah_burn_boundary_response',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Sometimes you have to set boundaries to sustain the work. It's not about doing less—it's about lasting longer.\n\nI used to answer emails at midnight. Take calls during my daughter's dance recital. Say yes to every request because the need was real.\n\nBut you can't serve from empty. I had to learn that the hard way.",
      emotion: 'thoughtful',
      variation_id: 'isaiah_burn_boundary_v1'
    }],
    choices: [
      { choiceId: 'boundary_set', text: "What boundaries do you set now?", nextNodeId: 'isaiah_recovery', pattern: 'exploring' },
      { choiceId: 'boundary_guilt', text: "Do you ever feel guilty saying no?", nextNodeId: 'isaiah_staying_pain', pattern: 'helping' },
      { choiceId: 'boundary_culture', text: "Is boundary-setting accepted in nonprofit culture?", nextNodeId: 'isaiah_suffering_culture', pattern: 'analytical' }
    ]
  },
  {
    nodeId: 'isaiah_burn_push_response',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Pushing through feels heroic, but heroes burn out. I've learned that the hard way.\n\nThere was a year... I ran myself into the ground. Pneumonia twice. Marriage nearly ended. Still I kept going because 'the kids need me.'\n\nWhat I didn't see was that exhausted-Isaiah wasn't helping anyone. He was just performing helpfulness while falling apart.",
      emotion: 'vulnerable',
      variation_id: 'isaiah_burn_push_v1'
    }],
    choices: [
      { choiceId: 'push_wakeup', text: "What was the wake-up call?", nextNodeId: 'isaiah_therapy_insight', pattern: 'exploring' },
      { choiceId: 'push_now', text: "How do you handle the drive to push now?", nextNodeId: 'isaiah_recovery', pattern: 'patience' },
      { choiceId: 'push_advice', text: "What advice would you give to someone in that cycle?", nextNodeId: 'isaiah_sustainability_insight', pattern: 'helping' }
    ]
  },
  {
    nodeId: 'isaiah_burn_quit_response',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Quitting isn't failure. Sometimes it's wisdom. Knowing when to step back is its own kind of strength.\n\nI've watched people destroy themselves trying to 'stay the course.' Lost marriages. Lost health. Lost the very passion that brought them to this work.\n\nSometimes the bravest thing you can do is say 'not me, not now' and trust that the work will continue without you.",
      emotion: 'warm',
      variation_id: 'isaiah_burn_quit_v1'
    }],
    choices: [
      { choiceId: 'quit_hard', text: "That must be hard to accept.", nextNodeId: 'isaiah_recovery', pattern: 'helping' },
      { choiceId: 'quit_when', text: "How do you know when it's time?", nextNodeId: 'isaiah_patterns_seen', pattern: 'analytical' },
      { choiceId: 'quit_stayed', text: "But you stayed.", nextNodeId: 'isaiah_daily_choice', pattern: 'exploring' }
    ]
  },
  {
    nodeId: 'isaiah_carry_marcus',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Marcus and I see different sides of the same coin. He sees the systems that break people. I see the people rebuilding after.\n\nWe've had some real conversations. About healthcare, about community, about what it means to actually help someone.\n\nHe gets frustrated with the slow pace of nonprofit work. I get frustrated with how healthcare sometimes treats symptoms instead of causes. But we're both trying to fix the same broken world.",
      emotion: 'reflective',
      variation_id: 'isaiah_carry_marcus_v1'
    }],
    choices: [
      { choiceId: 'marcus_learn', text: "What have you learned from each other?", nextNodeId: 'isaiah_real_solutions', pattern: 'exploring' },
      { choiceId: 'marcus_tension', text: "Where do you disagree?", nextNodeId: 'isaiah_measurement_innovation', pattern: 'analytical' },
      { choiceId: 'marcus_collaborate', text: "Have you ever worked together?", nextNodeId: 'isaiah_resonant_stories', pattern: 'building' }
    ]
  },
  {
    nodeId: 'isaiah_cultivation_detail',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Cultivation isn't about asking for money. It's about building relationships. The giving follows when people feel connected to the mission.\n\nFirst meeting? I don't ask for anything. I listen. What do they care about? What keeps them up at night? Where does their passion live?\n\nSecond meeting, maybe third—I start showing how our work connects to what they already value. Not selling. Revealing.\n\nBy the time I make an ask, it's not a sales pitch. It's an invitation to be part of something they already believe in.",
      emotion: 'knowing',
      variation_id: 'isaiah_cultivation_v1'
    }],
    choices: [
      { choiceId: 'cultivation_time', text: "That takes a lot of time.", nextNodeId: 'isaiah_sustainability_insight', pattern: 'patience' },
      { choiceId: 'cultivation_authentic', text: "How do you keep it authentic?", nextNodeId: 'isaiah_manipulation_line', pattern: 'exploring' },
      { choiceId: 'cultivation_failure', text: "What if they never come around?", nextNodeId: 'isaiah_hope_career', pattern: 'analytical' }
    ]
  },
  {
    nodeId: 'isaiah_daily_choice',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Every day I choose to show up. Even when the funding's uncertain, even when the wins feel small. That choice matters.\n\nThere are mornings I don't want to. Mornings where the inbox is full of problems and the grant deadline is looming and I wonder if any of this makes a difference.\n\nBut then I remember: the kids don't get to take a day off from their circumstances. So I show up.",
      emotion: 'determined',
      variation_id: 'isaiah_daily_choice_v1'
    }],
    choices: [
      { choiceId: 'daily_sustain', text: "How do you sustain that commitment?", nextNodeId: 'isaiah_recovery', pattern: 'patience' },
      { choiceId: 'daily_days', text: "What gets you through the hardest days?", nextNodeId: 'isaiah_kids_stories', pattern: 'helping' },
      { choiceId: 'daily_measure', text: "How do you know when you've made a difference?", nextNodeId: 'isaiah_meaning_progress', pattern: 'analytical' }
    ]
  },
  {
    nodeId: 'isaiah_difference',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Making a difference isn't about grand gestures. It's about showing up, again and again, for people who need someone in their corner.\n\nI used to dream about big moments. The transformative grant. The celebrity endorsement. The viral success story.\n\nNow I know: the difference is made in a thousand small moments. A kid who trusts you enough to ask for help. A parent who finally believes change is possible.",
      emotion: 'warm',
      variation_id: 'isaiah_difference_v1'
    }],
    choices: [
      { choiceId: 'diff_small', text: "Tell me about one of those small moments.", nextNodeId: 'isaiah_resonant_stories', pattern: 'helping' },
      { choiceId: 'diff_scale', text: "How do you scale small moments into larger impact?", nextNodeId: 'isaiah_real_solutions', pattern: 'building' },
      { choiceId: 'diff_patience', text: "It sounds like that requires a lot of patience.", nextNodeId: 'isaiah_hope_career', pattern: 'patience' }
    ]
  },
  {
    nodeId: 'isaiah_early_calling',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "I knew early that I wanted to help. Not in an abstract way—I wanted to see the faces, hear the stories, be part of the change.\n\nGrowing up, I watched my neighborhood struggle. Good people, working hard, still falling behind. And I thought: someone needs to do something.\n\nTook me years to realize that someone was me.",
      emotion: 'passionate',
      variation_id: 'isaiah_early_calling_v1'
    }],
    choices: [
      { choiceId: 'calling_path', text: "What path led you here?", nextNodeId: 'isaiah_ministry_past', pattern: 'exploring' },
      { choiceId: 'calling_change', text: "Has that calling changed over time?", nextNodeId: 'isaiah_hope_career', pattern: 'patience' },
      { choiceId: 'calling_doubt', text: "Did you ever doubt that calling?", nextNodeId: 'isaiah_daily_choice', pattern: 'analytical' }
    ]
  },
  {
    nodeId: 'isaiah_favorite_donors',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "My favorite donors aren't the biggest givers. They're the ones who ask 'How are YOU doing?' before asking about the numbers.\n\nThere's a retired teacher who gives fifty dollars a month. Never misses. She calls every quarter just to check in. Asks about my kids, my wife.\n\nThat's partnership. Not transaction.",
      emotion: 'warm',
      variation_id: 'isaiah_favorite_donors_v1'
    }],
    choices: [
      { choiceId: 'donors_rare', text: "Are donors like that rare?", nextNodeId: 'isaiah_cultivation_detail', pattern: 'exploring' },
      { choiceId: 'donors_cultivate', text: "How do you find people who give that way?", nextNodeId: 'isaiah_fundraising_reality', pattern: 'analytical' },
      { choiceId: 'donors_reciprocate', text: "How do you reciprocate that care?", nextNodeId: 'isaiah_staying_pain', pattern: 'helping' }
    ]
  },
  {
    nodeId: 'isaiah_fundraising_reality',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Fundraising isn't about convincing people to give. It's about connecting them to something they already want to be part of.\n\nMost donors have giving in their heart already. They're looking for the right vessel. Something they trust, something that matches their values.\n\nMy job isn't to manufacture that desire. It's to help them see that what we do is what they've been searching for.",
      emotion: 'knowing',
      variation_id: 'isaiah_fundraising_v1'
    }],
    choices: [
      { choiceId: 'fundraising_find', text: "How do you find those people?", nextNodeId: 'isaiah_favorite_donors', pattern: 'exploring' },
      { choiceId: 'fundraising_mismatch', text: "What if there's no match?", nextNodeId: 'isaiah_sim_decline_response', pattern: 'patience' },
      { choiceId: 'fundraising_skills', text: "What skills does this kind of fundraising require?", nextNodeId: 'isaiah_translation_work', pattern: 'analytical' }
    ]
  },
  {
    nodeId: 'isaiah_hope_career',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Hope is the job. On good days and bad days. When funders say yes and when they say no. Hope is what I offer.\n\nPeople don't come to us because they have options. They come because they've run out of them. And what we give first—before programs, before services—is the belief that things can be different.\n\nThat's not naive. That's strategy. Because without hope, nothing else works.",
      emotion: 'determined',
      variation_id: 'isaiah_hope_career_v1'
    }],
    choices: [
      { choiceId: 'hope_maintain', text: "How do you maintain hope when outcomes are uncertain?", nextNodeId: 'isaiah_daily_choice', pattern: 'patience' },
      { choiceId: 'hope_practical', text: "Is hope enough without practical resources?", nextNodeId: 'isaiah_real_solutions', pattern: 'analytical' },
      { choiceId: 'hope_offer', text: "How do you offer hope to someone who's given up?", nextNodeId: 'isaiah_witnesses', pattern: 'helping' }
    ]
  },
  {
    nodeId: 'isaiah_kids_stories',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "The kids... their stories keep me going.\n\nLast month, DeShawn graduated. First in his family to finish high school. Came to our program at thirteen, angry at the world. Now he's heading to Tuskegee.\n\nEvery success like that, every graduation, every 'thank you'—it adds up to something bigger than any of us.\n\nOn the hard days, I think about DeShawn. About Maria. About all the kids whose names I'll never know who went a little further because someone showed up.",
      emotion: 'tender',
      variation_id: 'isaiah_kids_v1'
    }],
    choices: [
      { choiceId: 'kids_failures', text: "What about the ones who don't make it?", nextNodeId: 'isaiah_meaning_progress', pattern: 'exploring' },
      { choiceId: 'kids_connection', text: "Do you stay in touch with graduates?", nextNodeId: 'isaiah_room_kids', pattern: 'helping' },
      { choiceId: 'kids_impact', text: "How do you measure that kind of impact?", nextNodeId: 'isaiah_measurement_innovation', pattern: 'analytical' }
    ]
  },
  {
    nodeId: 'isaiah_major_gift_sim',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Major gifts aren't about the money. They're about shared vision. When someone gives big, they're saying 'I believe what you believe.'\n\nThe cultivation process for a major gift can take years. Years of relationship building, of listening, of showing—not telling—how the work connects to their values.\n\nAnd when that gift finally comes, it's not a transaction. It's a partnership being born.",
      emotion: 'thoughtful',
      variation_id: 'isaiah_major_gift_v1'
    }],
    choices: [
      { choiceId: 'major_time', text: "Years of cultivation sounds exhausting.", nextNodeId: 'isaiah_sustainability_insight', pattern: 'patience' },
      { choiceId: 'major_wrong', text: "What if the vision isn't actually shared?", nextNodeId: 'isaiah_sim_decline_response', pattern: 'exploring' },
      { choiceId: 'major_steps', text: "What does that cultivation process look like?", nextNodeId: 'isaiah_cultivation_detail', pattern: 'analytical' }
    ]
  },
  {
    nodeId: 'isaiah_manipulation_line',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "There's a line between inspiration and manipulation. I've seen fundraisers cross it. I work hard to stay on the right side.\n\nIt's easy to weaponize suffering. To use poverty porn, trauma stories, guilt. And it works—in the short term.\n\nBut it dehumanizes the people we serve. Turns them into props for donor sympathy. I won't do that, no matter how much money is at stake.",
      emotion: 'serious',
      variation_id: 'isaiah_manipulation_v1'
    }],
    choices: [
      { choiceId: 'manip_pressure', text: "Do you ever feel pressure to cross that line?", nextNodeId: 'isaiah_uncomfortable_money', pattern: 'exploring' },
      { choiceId: 'manip_tell', text: "How do you tell stories ethically?", nextNodeId: 'isaiah_resonant_stories', pattern: 'analytical' },
      { choiceId: 'manip_others', text: "Have you called out others who cross that line?", nextNodeId: 'isaiah_real_solutions', pattern: 'building' }
    ]
  },
  {
    nodeId: 'isaiah_meaning_progress',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Progress in nonprofit work isn't always visible. Sometimes it's a kid who doesn't drop out. A family that stays together. Quiet victories.\n\nThe hardest part is explaining that to funders who want metrics. 'How many lives did you save this quarter?' As if transformation works on quarterly reports.\n\nSome of our biggest wins, we'll never see. A seed planted that grows years later.",
      emotion: 'reflective',
      variation_id: 'isaiah_meaning_progress_v1'
    }],
    choices: [
      { choiceId: 'progress_measure', text: "How do you measure what can't be counted?", nextNodeId: 'isaiah_measurement_innovation', pattern: 'analytical' },
      { choiceId: 'progress_patience', text: "That requires a lot of faith.", nextNodeId: 'isaiah_hope_career', pattern: 'patience' },
      { choiceId: 'progress_example', text: "Tell me about a quiet victory.", nextNodeId: 'isaiah_kids_stories', pattern: 'helping' }
    ]
  },
  {
    nodeId: 'isaiah_measurement_innovation',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "We're always being asked to measure impact. But how do you measure hope? How do you quantify a kid believing in themselves?\n\nI've tried everything. Surveys, interviews, longitudinal tracking. And yes, we have data—graduation rates, employment numbers, income changes.\n\nBut the data misses the thing that matters most: the moment someone decides their life can be different. That's where the magic happens, and it doesn't fit in a spreadsheet.",
      emotion: 'frustrated',
      variation_id: 'isaiah_measurement_v1'
    }],
    choices: [
      { choiceId: 'measure_funders', text: "How do funders respond to that?", nextNodeId: 'isaiah_translation_work', pattern: 'exploring' },
      { choiceId: 'measure_better', text: "Are there better ways to capture impact?", nextNodeId: 'isaiah_resonant_stories', pattern: 'analytical' },
      { choiceId: 'measure_tension', text: "That tension sounds exhausting.", nextNodeId: 'isaiah_suffering_culture', pattern: 'helping' }
    ]
  },
  {
    nodeId: 'isaiah_ministry_past',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "I almost went into ministry. Different path, same call. Serving people, building community, holding space for hope.\n\nSpent two years in seminary before I realized: I didn't want to preach from a pulpit. I wanted to be in the streets. In the schools. Where the struggle actually lives.\n\nSometimes I wonder what would have happened if I'd finished. Different collar, same work, maybe.",
      emotion: 'reflective',
      variation_id: 'isaiah_ministry_v1'
    }],
    choices: [
      { choiceId: 'ministry_regret', text: "Do you regret leaving seminary?", nextNodeId: 'isaiah_early_calling', pattern: 'exploring' },
      { choiceId: 'ministry_faith', text: "Does faith still guide your work?", nextNodeId: 'isaiah_hope_career', pattern: 'patience' },
      { choiceId: 'ministry_different', text: "How is nonprofit work different from ministry?", nextNodeId: 'isaiah_difference', pattern: 'analytical' }
    ]
  },
  {
    nodeId: 'isaiah_motivations',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Why do I do this?\n\nBecause someone did it for me. Mr. Henderson. Ran a youth program in our neighborhood when I was fourteen. Everybody else saw a kid headed for trouble. He saw... potential.\n\nHe didn't have much. Drove an old car, wore the same jacket every day. But he showed up. Every single day. For us.\n\nThat consistency—that stubborn belief in kids everyone else had given up on—it changed everything for me.",
      emotion: 'vulnerable',
      variation_id: 'isaiah_motivations_v1'
    }],
    choices: [
      { choiceId: 'motivations_mentor', text: "Where is Mr. Henderson now?", nextNodeId: 'isaiah_ministry_past', pattern: 'exploring' },
      { choiceId: 'motivations_payforward', text: "So you're doing for others what he did for you.", nextNodeId: 'isaiah_kids_stories', pattern: 'helping' },
      { choiceId: 'motivations_different', text: "What made you different from other kids?", nextNodeId: 'isaiah_early_calling', pattern: 'analytical' }
    ]
  },
  {
    nodeId: 'isaiah_patterns_seen',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "After years in this work, you start seeing patterns. Who succeeds, who struggles, what makes the difference. It's rarely what you'd expect.\n\nIt's not always the smartest kids who make it. Or the ones with the most talent. It's the ones who have one person—just one—who believes in them unconditionally.\n\nThat's the pattern. Connection. Belief. Someone in their corner.",
      emotion: 'knowing',
      variation_id: 'isaiah_patterns_v1'
    }],
    choices: [
      { choiceId: 'patterns_person', text: "How do you become that person for someone?", nextNodeId: 'isaiah_staying_pain', pattern: 'helping' },
      { choiceId: 'patterns_system', text: "Can you systematize that kind of connection?", nextNodeId: 'isaiah_real_solutions', pattern: 'building' },
      { choiceId: 'patterns_fail', text: "What about when connection isn't enough?", nextNodeId: 'isaiah_meaning_progress', pattern: 'patience' }
    ]
  },
  {
    nodeId: 'isaiah_real_solutions',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Real solutions are messy. They don't fit in grant reports. They involve failure and pivoting and trying again.\n\nWe tried a mentorship program three different ways before we found what worked. And what worked wasn't what any of us expected—it was letting kids choose their mentors instead of assigning them.\n\nThat kind of learning doesn't happen in a strategic plan. It happens in the doing.",
      emotion: 'serious',
      variation_id: 'isaiah_real_solutions_v1'
    }],
    choices: [
      { choiceId: 'solutions_fail', text: "How do you handle failure in this work?", nextNodeId: 'isaiah_recovery', pattern: 'patience' },
      { choiceId: 'solutions_funders', text: "Do funders accept messy solutions?", nextNodeId: 'isaiah_translation_work', pattern: 'analytical' },
      { choiceId: 'solutions_learn', text: "What else have you learned the hard way?", nextNodeId: 'isaiah_success_detail', pattern: 'exploring' }
    ]
  },
  {
    nodeId: 'isaiah_recovery',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Recovery—from burnout, from setbacks, from the weight of this work—it's a practice. Not a destination.\n\nI meditate every morning. Twenty minutes before the inbox, before the demands. It's not enough, but it's something.\n\nAnd I've learned to notice the warning signs. When I start resenting the people I'm supposed to help—that's the red flag. That's when I need to step back.",
      emotion: 'peaceful',
      variation_id: 'isaiah_recovery_v1'
    }],
    choices: [
      { choiceId: 'recovery_practice', text: "What other practices help you recover?", nextNodeId: 'isaiah_sustainability_insight', pattern: 'patience' },
      { choiceId: 'recovery_warning', text: "How often do you hit those warning signs?", nextNodeId: 'isaiah_burn_boundary_response', pattern: 'exploring' },
      { choiceId: 'recovery_others', text: "How do you help your team with recovery?", nextNodeId: 'isaiah_suffering_culture', pattern: 'helping' }
    ]
  },
  {
    nodeId: 'isaiah_resonant_stories',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "The stories that resonate aren't about numbers. They're about moments. A breakthrough. A connection. A door opening.\n\nI remember a kid—Marcus, actually—who hadn't spoken in group for six months. Just sat there, arms crossed. Then one day, another kid shared about losing his dad. And Marcus started talking. About his own loss. His own pain.\n\nThat moment changed everything for him. For the whole group. You can't put that in a pie chart.",
      emotion: 'warm',
      variation_id: 'isaiah_resonant_v1'
    }],
    choices: [
      { choiceId: 'resonant_share', text: "How do you share stories like that responsibly?", nextNodeId: 'isaiah_manipulation_line', pattern: 'analytical' },
      { choiceId: 'resonant_remember', text: "Do you remember all those moments?", nextNodeId: 'isaiah_staying_pain', pattern: 'helping' },
      { choiceId: 'resonant_create', text: "Can you create conditions for moments like that?", nextNodeId: 'isaiah_room_kids', pattern: 'building' }
    ]
  },
  {
    nodeId: 'isaiah_room_kids',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "When I'm in a room with kids, everything else falls away. The funding stress, the politics—none of it matters. Just them.\n\nThey're not impressed by my title or my grant writing skills. They just want to know: Are you real? Do you actually care? Can I trust you?\n\nThat honesty keeps me grounded. Reminds me what this is actually about.",
      emotion: 'peaceful',
      variation_id: 'isaiah_room_kids_v1'
    }],
    choices: [
      { choiceId: 'room_trust', text: "How do you earn their trust?", nextNodeId: 'isaiah_staying_pain', pattern: 'helping' },
      { choiceId: 'room_balance', text: "How do you balance admin work with face time?", nextNodeId: 'isaiah_daily_choice', pattern: 'patience' },
      { choiceId: 'room_change', text: "Has what they need changed over the years?", nextNodeId: 'isaiah_patterns_seen', pattern: 'exploring' }
    ]
  },
  {
    nodeId: 'isaiah_sim_adapt_response',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Adapting to the donor's needs while staying true to mission—that's the art. You saw that in action.\n\nIt's not compromise. It's finding the overlap between what they care about and what we're trying to do.\n\nWhen it works, both parties walk away feeling heard. That's the foundation of a lasting partnership.",
      emotion: 'appreciative',
      variation_id: 'isaiah_sim_adapt_v1'
    }],
    choices: [
      { choiceId: 'adapt_learn', text: "How did you learn to do that?", nextNodeId: 'isaiah_cultivation_detail', pattern: 'exploring' },
      { choiceId: 'adapt_boundaries', text: "Where do you draw the line on adapting?", nextNodeId: 'isaiah_manipulation_line', pattern: 'patience' },
      { choiceId: 'adapt_apply', text: "I can see how that applies beyond fundraising.", nextNodeId: 'isaiah_translation_work', pattern: 'analytical' }
    ]
  },
  {
    nodeId: 'isaiah_sim_decline_response',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Sometimes saying no is the right answer. Protecting the mission matters more than any single gift.\n\nI've seen organizations chase money that came with strings. Five years later, they're unrecognizable. Serving the donor's vision, not the community's.\n\nThat's a trap. A well-funded trap, but a trap.",
      emotion: 'firm',
      variation_id: 'isaiah_sim_decline_v1'
    }],
    choices: [
      { choiceId: 'decline_pressure', text: "How do you handle the pressure when funding is tight?", nextNodeId: 'isaiah_daily_choice', pattern: 'exploring' },
      { choiceId: 'decline_board', text: "Does your board support saying no to big gifts?", nextNodeId: 'isaiah_real_solutions', pattern: 'analytical' },
      { choiceId: 'decline_feel', text: "It must be hard to turn down money you need.", nextNodeId: 'isaiah_uncomfortable_money', pattern: 'helping' }
    ]
  },
  {
    nodeId: 'isaiah_sim_redirect_response',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Redirecting energy into better channels—that's leadership. Not every opportunity is the right opportunity.\n\nWhen I was younger, I'd chase every lead. Exhaust myself on prospects that weren't aligned.\n\nNow I ask: Even if we get this gift, will it move us toward our mission or away from it?",
      emotion: 'knowing',
      variation_id: 'isaiah_sim_redirect_v1'
    }],
    choices: [
      { choiceId: 'redirect_discernment', text: "How do you develop that discernment?", nextNodeId: 'isaiah_patterns_seen', pattern: 'exploring' },
      { choiceId: 'redirect_mistakes', text: "Have you ever misjudged and regretted it?", nextNodeId: 'isaiah_success_detail', pattern: 'helping' },
      { choiceId: 'redirect_teach', text: "How do you teach that to newer fundraisers?", nextNodeId: 'isaiah_fundraising_reality', pattern: 'building' }
    ]
  },
  {
    nodeId: 'isaiah_staying_pain',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Staying present with pain is part of the work. Not fixing it, not rushing past it. Just... being there.\n\nPeople in crisis don't always need solutions. Sometimes they need a witness. Someone who says: 'I see what you're going through. It matters. You matter.'\n\nThat kind of presence costs something. But it's often the most valuable thing I can offer.",
      emotion: 'tender',
      variation_id: 'isaiah_staying_pain_v1'
    }],
    choices: [
      { choiceId: 'pain_cost', text: "What does that presence cost you?", nextNodeId: 'isaiah_therapy_insight', pattern: 'exploring' },
      { choiceId: 'pain_learn', text: "How did you learn to do that?", nextNodeId: 'isaiah_ministry_past', pattern: 'patience' },
      { choiceId: 'pain_protect', text: "How do you protect yourself while being present?", nextNodeId: 'isaiah_recovery', pattern: 'analytical' }
    ]
  },
  {
    nodeId: 'isaiah_success_detail',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Success in this work is rarely clean. It's one step forward, two steps back, then three forward. Progress is jagged.\n\nI've had kids graduate from our program, get jobs, start families—then show up three years later in crisis. Back at square one.\n\nDoes that mean we failed? I don't think so. It means life is hard. And we're here for the long haul.",
      emotion: 'honest',
      variation_id: 'isaiah_success_detail_v1'
    }],
    choices: [
      { choiceId: 'success_measure', text: "How do you measure success when it's not linear?", nextNodeId: 'isaiah_measurement_innovation', pattern: 'analytical' },
      { choiceId: 'success_return', text: "What happens when people come back?", nextNodeId: 'isaiah_hope_career', pattern: 'helping' },
      { choiceId: 'success_patience', text: "That takes incredible patience.", nextNodeId: 'isaiah_daily_choice', pattern: 'patience' }
    ]
  },
  {
    nodeId: 'isaiah_success_stories',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "The success stories keep us going. Not as marketing—as reminders. Reminders that this work matters.\n\nWe have a wall in the office. Photos of graduates, letters they've sent, announcements of jobs and weddings and babies. On the hard days, I stand there.\n\nNot to feel proud. To remember: This is real. These lives changed. Keep going.",
      emotion: 'warm',
      variation_id: 'isaiah_success_stories_v1'
    }],
    choices: [
      { choiceId: 'stories_share', text: "Do you share those stories with donors?", nextNodeId: 'isaiah_manipulation_line', pattern: 'analytical' },
      { choiceId: 'stories_hard', text: "What about the ones who didn't make it to the wall?", nextNodeId: 'isaiah_meaning_progress', pattern: 'exploring' },
      { choiceId: 'stories_team', text: "How does your team use those reminders?", nextNodeId: 'isaiah_suffering_culture', pattern: 'building' }
    ]
  },
  {
    nodeId: 'isaiah_suffering_culture',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Nonprofit culture sometimes glorifies suffering. Working late, sacrificing everything. I'm trying to change that.\n\nFor years, I wore my exhaustion like a badge. 'Look how much I care.' But burnt-out staff don't serve anyone well.\n\nNow I send my team home at 5. I take real vacations. It's hard—the work never stops—but we're modeling something different.",
      emotion: 'determined',
      variation_id: 'isaiah_suffering_culture_v1'
    }],
    choices: [
      { choiceId: 'suffering_resistance', text: "Do you face resistance to that approach?", nextNodeId: 'isaiah_real_solutions', pattern: 'exploring' },
      { choiceId: 'suffering_model', text: "How do you model healthy boundaries?", nextNodeId: 'isaiah_burn_boundary_response', pattern: 'patience' },
      { choiceId: 'suffering_sector', text: "Is the sector changing?", nextNodeId: 'isaiah_translation_work', pattern: 'analytical' }
    ]
  },
  {
    nodeId: 'isaiah_sustainability_insight',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Sustainable impact requires sustainable people. You can't pour from an empty cup, no matter how much you want to.\n\nI learned this the hard way. Crashed hard about five years ago. Had to take three months off. The organization survived without me—humbling, honestly.\n\nBut it taught me: I'm not indispensable. And that's actually liberating.",
      emotion: 'knowing',
      variation_id: 'isaiah_sustainability_v1'
    }],
    choices: [
      { choiceId: 'sustain_practice', text: "How do you practice sustainability now?", nextNodeId: 'isaiah_recovery', pattern: 'patience' },
      { choiceId: 'sustain_team', text: "How do you help your team be sustainable?", nextNodeId: 'isaiah_suffering_culture', pattern: 'building' },
      { choiceId: 'sustain_crash', text: "What did you learn from that crash?", nextNodeId: 'isaiah_therapy_insight', pattern: 'exploring' }
    ]
  },
  {
    nodeId: 'isaiah_therapy_insight',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Therapy... that was hard. Admitting I needed help when my whole job is helping others.\n\nBut I was burning out. Running on fumes. Snapping at my wife. Missing my kids' games to chase one more donor meeting.\n\nMy therapist helped me see it: I was trying to save everyone because I couldn't save the people from my past. My cousin who got caught up. My uncle who never got out.\n\nHeavy stuff. But understanding it... that was the first step to actually being sustainable in this work.",
      emotion: 'vulnerable',
      variation_id: 'isaiah_therapy_v1'
    }],
    choices: [
      { choiceId: 'therapy_balance', text: "How do you balance the drive to help with self-care now?", nextNodeId: 'isaiah_recovery', pattern: 'patience' },
      { choiceId: 'therapy_family', text: "How's your family now?", nextNodeId: 'isaiah_room_kids', pattern: 'helping' },
      { choiceId: 'therapy_recommend', text: "Would you recommend therapy to others in nonprofit work?", nextNodeId: 'isaiah_sustainability_insight', pattern: 'exploring' }
    ]
  },
  {
    nodeId: 'isaiah_translation_work',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Translation is a big part of the job. Translating community needs for funders. Translating funder expectations for staff.\n\nI speak three languages: nonprofit-speak for grants, street-speak for the community, and donor-speak for cultivation. Different vocabulary, different frames.\n\nThe trick is never losing the truth in translation. Making sure everyone hears the same story, just in their own language.",
      emotion: 'thoughtful',
      variation_id: 'isaiah_translation_v1'
    }],
    choices: [
      { choiceId: 'translate_hard', text: "What's hardest to translate?", nextNodeId: 'isaiah_measurement_innovation', pattern: 'exploring' },
      { choiceId: 'translate_lost', text: "Does anything get lost in translation?", nextNodeId: 'isaiah_manipulation_line', pattern: 'analytical' },
      { choiceId: 'translate_bridge', text: "How do you bridge those different worlds?", nextNodeId: 'isaiah_carry_marcus', pattern: 'helping' }
    ]
  },
  {
    nodeId: 'isaiah_uncomfortable_money',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Money conversations are uncomfortable. But discomfort is where growth happens—for me and for donors.\n\nI used to apologize when I asked for money. 'I know this is awkward, but...' Now I don't. Because asking someone to invest in change isn't asking for a favor—it's offering an opportunity.\n\nThat shift in mindset changed everything.",
      emotion: 'honest',
      variation_id: 'isaiah_uncomfortable_v1'
    }],
    choices: [
      { choiceId: 'money_learn', text: "How did you develop that mindset?", nextNodeId: 'isaiah_cultivation_detail', pattern: 'exploring' },
      { choiceId: 'money_donors', text: "How do donors respond to that confidence?", nextNodeId: 'isaiah_favorite_donors', pattern: 'helping' },
      { choiceId: 'money_specific', text: "How do you actually make the ask?", nextNodeId: 'isaiah_major_gift_sim', pattern: 'analytical' }
    ]
  },
  {
    nodeId: 'isaiah_witnesses',
    speaker: 'Isaiah Thompson',
    content: [{
      text: "Sometimes the most important thing isn't solving problems. It's witnessing them. Saying 'I see you. This matters.'\n\nThere's a kid I worked with years ago. Couldn't fix his situation. Couldn't get him out of foster care, couldn't change his school. But I could show up. Every week. For three years.\n\nHe told me later: 'You were the first person who never gave up on me.' That witnessing—that persistence—was the intervention.",
      emotion: 'tender',
      variation_id: 'isaiah_witnesses_v1'
    }],
    choices: [
      { choiceId: 'witness_hard', text: "That must be hard—witnessing without fixing.", nextNodeId: 'isaiah_staying_pain', pattern: 'helping' },
      { choiceId: 'witness_balance', text: "How do you balance witnessing with action?", nextNodeId: 'isaiah_real_solutions', pattern: 'analytical' },
      { choiceId: 'witness_impact', text: "How do you know when witnessing is enough?", nextNodeId: 'isaiah_patterns_seen', pattern: 'patience' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // SIMULATION PHASE 1: Authentic Donor Cultivation (trust ≥ 2)
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'isaiah_simulation_phase1_setup',
    speaker: 'Isaiah Greene',
    content: [{
      text: "Got a new donor prospect. Dr. Williams. Retired surgeon. Wealth advisor suggested us.\n\nFirst coffee meeting tomorrow. This is where it all starts—building real connection or falling into transactional fundraising.\n\nWant to help me think through the approach?",
      emotion: 'focused',
      variation_id: 'sim_phase1_setup_v1'
    }],
    requiredState: {
      trust: { min: 2 }
    },
    choices: [
      {
        choiceId: 'phase1_accept',
        text: "Let\'s build authentic connection.",
        nextNodeId: 'isaiah_simulation_phase1',
        pattern: 'helping',
        skills: ['communication']
      },
      {
        choiceId: 'phase1_decline',
        text: "You know how to cultivate donors. You\'ve done this hundreds of times.",
        nextNodeId: 'isaiah_hub_return',
        pattern: 'patience'
      }
    ],
    tags: ['simulation', 'isaiah_sim', 'phase1']
  },

  {
    nodeId: 'isaiah_simulation_phase1',
    speaker: 'Isaiah Greene',
    content: [{
      text: "Here\'s the situation. First ten minutes of the meeting.",
      emotion: 'teaching',
      variation_id: 'simulation_phase1_v1'
    }],
    simulation: {
      type: 'chat_negotiation',
      title: 'Authentic Donor Cultivation',
      taskDescription: 'First coffee meeting with a major donor prospect. Build genuine connection without being transactional. How do you start?',
      phase: 1,
      difficulty: 'introduction',
      variantId: 'isaiah_donor_cultivation_phase1',
      timeLimit: 90,
      initialContext: {
        label: 'COFFEE_MEETING',
        content: `DR. WILLIAMS (reserved but curious):
"So. Isaiah. Tell me about your organization."

WHAT YOU KNOW:
- Retired surgeon, 68
- Lost his practice to malpractice insurance costs
- Wealth advisor recommended you (tax planning)
- No obvious connection to youth work
- First time considering nonprofit giving beyond church

APPROACH OPTIONS:
A) Launch into your elevator pitch - statistics, outcomes, impact metrics (professional)
B) Ask him about his life first - what brought him to Birmingham, what he cares about (curious)
C) Share a kid\'s story that will pull heartstrings (emotional appeal)
D) Ask why his advisor recommended youth work specifically (strategic)

What builds authentic connection instead of transactional fundraising?`,
        displayStyle: 'text'
      },
      successFeedback: '✓ CONNECTION: Option B - He talks about losing his practice. How powerless he felt. How he wishes someone had mentored him earlier in his career. The "why" emerges naturally. You didn\'t extract it. You invited it.',
      successThreshold: 80,
      unlockRequirements: {
        trustMin: 2
      }
    },
    choices: [{
      choiceId: 'phase1_success',
      text: "He opened up. The connection came first, not the ask.",
      nextNodeId: 'isaiah_simulation_phase1_success',
      pattern: 'helping',
      skills: ['empathy', 'communication']
    }],
    onEnter: [{
      characterId: 'isaiah',
      addKnowledgeFlags: ['isaiah_simulation_phase1_complete']
    }],
    tags: ['simulation', 'phase1', 'isaiah_sim']
  },

  {
    nodeId: 'isaiah_simulation_phase1_success',
    speaker: 'Isaiah Greene',
    content: [{
      text: "Exactly. THAT\'S the difference.\n\nTransactional fundraisers see donors as ATMs. Authentic fundraisers see them as people with stories, wounds, hopes.\n\nWhen you start with curiosity instead of strategy, people feel it. They relax. They share.\n\nAnd when they share their \'why,\' the giving becomes inevitable. Not because you manipulated it. Because you helped them see how their values can take action.\n\nThat\'s the work at its best.",
      emotion: 'warm',
      variation_id: 'phase1_success_v1',
      richEffectContext: 'success'
    }],
    choices: [{
      choiceId: 'phase1_success_continue',
      text: "People want to be seen before they\'re asked.",
      nextNodeId: 'isaiah_hub_return',
      pattern: 'helping',
      skills: ['emotionalIntelligence']
    }],
    onEnter: [{
      characterId: 'isaiah',
      trustChange: 2
    }],
    tags: ['simulation', 'phase1', 'success']
  },

  {
    nodeId: 'isaiah_simulation_phase1_fail',
    speaker: 'Isaiah Greene',
    content: [{
      text: "That approach... it works sometimes. Gets the gift.\n\nBut you know what it doesn\'t get? A relationship. A partner. Someone who feels genuinely connected to the mission.\n\nYou get a transaction. One and done.\n\nAnd in fundraising, transactions burn out. Relationships renew.\n\nThe best donors aren\'t the ones you convinced. They\'re the ones who convinced themselves—because you gave them space to discover their own reasons for caring.",
      emotion: 'disappointed',
      variation_id: 'phase1_fail_v1',
      richEffectContext: 'error'
    }],
    choices: [{
      choiceId: 'phase1_fail_reflect',
      text: "Relationships over transactions. I see that now.",
      nextNodeId: 'isaiah_hub_return',
      pattern: 'patience',
      skills: ['criticalThinking']
    }],
    onEnter: [{
      characterId: 'isaiah',
      trustChange: 1
    }],
    tags: ['simulation', 'phase1', 'fail']
  },

  // ═══════════════════════════════════════════════════════════════
  // SIMULATION PHASE 2: Emergency Fundraising (trust ≥ 5)
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'isaiah_simulation_phase2_setup',
    speaker: 'Isaiah Greene',
    content: [{
      text: "Crisis. Big one.\n\nLost our largest corporate sponsor. Budget shortfall: $50,000. We have 30 days before we have to cut the after-school program. That\'s 80 kids who won\'t have anywhere safe to go after school.\n\nI need to make emergency asks to donors we\'ve been cultivating. But emergency appeals can burn relationships if you\'re not careful.\n\nHow do you ask for urgent help without being manipulative? Want to work through it?",
      emotion: 'anxious',
      variation_id: 'sim_phase2_setup_v1'
    }],
    requiredState: {
      trust: { min: 5 },
      hasKnowledgeFlags: ['isaiah_simulation_phase1_complete']
    },
    choices: [
      {
        choiceId: 'phase2_accept',
        text: "Let\'s find the honest urgency.",
        nextNodeId: 'isaiah_simulation_phase2',
        pattern: 'helping',
        skills: ['problemSolving']
      },
      {
        choiceId: 'phase2_decline',
        text: "You know how to navigate crisis fundraising. Trust your integrity.",
        nextNodeId: 'isaiah_hub_return',
        pattern: 'patience'
      }
    ],
    tags: ['simulation', 'isaiah_sim', 'phase2']
  },

  {
    nodeId: 'isaiah_simulation_phase2',
    speaker: 'Isaiah Greene',
    content: [{
      text: "Here\'s the call I have to make. Help me find the right words.",
      emotion: 'tense',
      variation_id: 'simulation_phase2_v1'
    }],
    simulation: {
      type: 'chat_negotiation',
      title: 'Emergency Fundraising with Integrity',
      taskDescription: 'Make an emergency ask to a cultivated donor. $50k needed in 30 days or 80 kids lose their after-school program. How do you ask without manipulating?',
      phase: 2,
      difficulty: 'application',
      variantId: 'isaiah_emergency_ask_phase2',
      timeLimit: 120,
      initialContext: {
        label: 'EMERGENCY_CALL',
        content: `THE SITUATION:
- Lost $50k corporate sponsor (merged with another company, cut community giving)
- 30 days until budget gap forces program cuts
- 80 kids in after-school program would lose their safe place
- This donor (Sarah Chen) has given $5k annually for 3 years
- You\'ve built genuine relationship with her
- She cares deeply but has limited capacity ($10-15k max)

SARAH (answering phone):
"Isaiah! Good to hear from you. How are things?"

APPROACH OPTIONS:
A) Lead with crisis immediately: "Sarah, I need help. We\'re in trouble." (urgent)
B) Share the news honestly but calmly: "Sarah, something happened I need to share with you." (honest)
C) Ask how she is first, then transition: "Before I share some challenging news..." (relationship-first)
D) Minimize the crisis to avoid burdening her: "Small hiccup, wondering if you could help." (protective)

What honors both the urgency and the relationship?`,
        displayStyle: 'text'
      },
      successFeedback: '✓ INTEGRITY: Option B+C combined - You ask about her first. Then: "Sarah, we lost our largest sponsor. I\'m making calls to people I trust to think through this with me. Not asking you to solve it alone. But I want you to know what\'s happening." She says: "Tell me what you need."',
      successThreshold: 85,
      unlockRequirements: {
        trustMin: 5,
        previousPhaseCompleted: 'isaiah_donor_cultivation_phase1'
      }
    },
    choices: [{
      choiceId: 'phase2_success',
      text: "You invited her in as a partner, not a solution.",
      nextNodeId: 'isaiah_simulation_phase2_success',
      pattern: 'helping',
      skills: ['communication', 'integrity']
    }],
    onEnter: [{
      characterId: 'isaiah',
      addKnowledgeFlags: ['isaiah_simulation_phase2_complete']
    }],
    tags: ['simulation', 'phase2', 'isaiah_sim']
  },

  {
    nodeId: 'isaiah_simulation_phase2_success',
    speaker: 'Isaiah Greene',
    content: [{
      text: "That\'s it. That\'s the skill most fundraisers never learn.\n\nEmergency fundraising doesn\'t mean panic fundraising. Urgency is real. Manipulation is when you exaggerate urgency to force a decision.\n\nWhen you invite donors in as PARTNERS in solving the problem—not ATMs to extract from—they feel respected. They want to help. They think creatively. They often give MORE than you asked for.\n\nSarah didn\'t just write a check. She called three other donors and organized a matching campaign. Raised $40k in two weeks.\n\nBecause you treated her like a partner, not a target.",
      emotion: 'relieved_grateful',
      variation_id: 'phase2_success_v1',
      richEffectContext: 'success'
    }],
    choices: [{
      choiceId: 'phase2_success_continue',
      text: "Partnership multiplies impact.",
      nextNodeId: 'isaiah_hub_return',
      pattern: 'building',
      skills: ['collaboration']
    }],
    onEnter: [{
      characterId: 'isaiah',
      trustChange: 2
    }],
    tags: ['simulation', 'phase2', 'success']
  },

  {
    nodeId: 'isaiah_simulation_phase2_fail',
    speaker: 'Isaiah Greene',
    content: [{
      text: "That approach... yeah, it might get the money. This time.\n\nBut next time you call Sarah, she\'ll see your name and think: \'What crisis is it now? What do they want from me?\'\n\nEmergency appeals work once. Maybe twice. Then donors start avoiding you.\n\nBecause they don\'t feel like partners. They feel like rescue services you only call when you\'re drowning.\n\nThe best fundraisers share the full truth—the good AND the hard—so donors can be genuine partners in both.",
      emotion: 'weary',
      variation_id: 'phase2_fail_v1',
      richEffectContext: 'error'
    }],
    choices: [{
      choiceId: 'phase2_fail_reflect',
      text: "I was solving for short-term money instead of long-term partnership.",
      nextNodeId: 'isaiah_hub_return',
      pattern: 'analytical',
      skills: ['criticalThinking']
    }],
    onEnter: [{
      characterId: 'isaiah',
      trustChange: 1
    }],
    tags: ['simulation', 'phase2', 'fail']
  },

  // ═══════════════════════════════════════════════════════════════
  // SIMULATION PHASE 3: The Marcus Memorial (trust ≥ 8)
  // ═══════════════════════════════════════════════════════════════

  {
    nodeId: 'isaiah_simulation_phase3_setup',
    speaker: 'Isaiah Greene',
    content: [{
      text: "[Isaiah\'s voice is tight. Controlled.]\n\nGot an email this morning. Donor I\'ve never met. Elizabeth Morrison.\n\nHer son died two years ago. Eighteen years old. Car accident on the way to his college orientation.\n\nShe wants to fund a scholarship program in his name. Full ride for kids aging out of foster care. $500,000 over five years.\n\nIt\'s... it\'s exactly what we need. It would change everything.\n\nBut I have to sit across from a mother who lost her son and talk about Marcus. About what we do. About hope.\n\nAnd I don\'t... I don\'t know if I can hold her grief and mine at the same time without breaking.\n\nWill you... can you be there? In case I need...",
      emotion: 'vulnerable_afraid',
      variation_id: 'sim_phase3_setup_v1',
      richEffectContext: 'warning'
    }],
    requiredState: {
      trust: { min: 8 },
      hasKnowledgeFlags: ['isaiah_simulation_phase2_complete', 'isaiah_vulnerability_revealed']
    },
    choices: [
      {
        choiceId: 'phase3_accept',
        text: "I\'ll be there. You don\'t have to hold this alone.",
        nextNodeId: 'isaiah_simulation_phase3',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'phase3_decline',
        text: "This one you might need to do alone. But you can.",
        nextNodeId: 'isaiah_hub_return',
        pattern: 'patience'
      }
    ],
    tags: ['simulation', 'isaiah_sim', 'phase3', 'vulnerability']
  },

  {
    nodeId: 'isaiah_simulation_phase3',
    speaker: 'Isaiah Greene',
    content: [{
      text: "[Conference room. Elizabeth Morrison sits across from you both. She\'s composed. Too composed.]\n\nHere we are.",
      emotion: 'tense',
      variation_id: 'simulation_phase3_v1'
    }],
    simulation: {
      type: 'chat_negotiation',
      title: 'The Marcus Memorial',
      taskDescription: 'A grieving mother wants to fund a scholarship in her dead son\'s name. Isaiah must honor her grief while carrying Marcus\'s memory. How does he accept this gift without breaking?',
      phase: 3,
      difficulty: 'mastery',
      variantId: 'isaiah_marcus_memorial_phase3',
      timeLimit: 90,
      initialContext: {
        label: 'THE_MEETING',
        content: `ELIZABETH MORRISON (grief barely contained):
"My son David was going to study social work. He wanted to help kids in the system. Kids like him.

He aged out of foster care at seventeen. Full scholarship to UAB. We met at a church event—I became his mentor, then... well, he became my son in every way that mattered.

He died before he could help anyone.

This scholarship—$500,000 over five years—it\'s what he would have done. I need his death to mean something.

I need you to tell me this will save someone. That David\'s name will be attached to hope, not just... loss."

ISAIAH\'S INTERNAL VOICE:
"She\'s talking about David. But I\'m seeing Marcus. Eighteen. Dead. Me trying to make his death mean something by staying in this work.

Can I accept this money without falling apart? Can I hold her grief when mine is still so raw?

Do I tell her about Marcus? Do I stay professional? Do I let her see that I understand EXACTLY what she\'s feeling—because I\'m still feeling it too?"

APPROACH OPTIONS:
A) Stay professional - accept the gift graciously without sharing Marcus\'s story (safe)
B) Share Marcus - let her know she\'s not alone in this grief (vulnerable)
C) Redirect to the kids - focus on the impact, not the loss (mission-focused)
D) Ask her what David would want - help her find her own meaning (therapeutic)

What honors both Elizabeth\'s grief and Isaiah\'s without breaking either?`,
        displayStyle: 'text'
      },
      successFeedback: '✓ WITNESSED GRIEF: Option B+D combined - Isaiah shares Marcus. Not as a fundraising tactic. As a witness. "I lost a kid too. Marcus. I understand wanting their death to mean something. But David already meant something. To you. This scholarship... it doesn\'t make his death meaningful. It extends his love." Elizabeth cries. Isaiah cries. The gift becomes sacred, not transactional.',
      successThreshold: 95,
      unlockRequirements: {
        trustMin: 8,
        previousPhaseCompleted: 'isaiah_emergency_ask_phase2',
        requiredFlags: ['isaiah_vulnerability_revealed']
      }
    },
    choices: [{
      choiceId: 'phase3_success',
      text: "You didn\'t accept a donation. You honored two boys who deserved better.",
      nextNodeId: 'isaiah_simulation_phase3_success',
      pattern: 'helping',
      skills: ['emotionalIntelligence', 'integrity']
    }],
    onEnter: [{
      characterId: 'isaiah',
      addKnowledgeFlags: ['isaiah_simulation_phase3_complete', 'isaiah_elizabeth_partnership']
    }],
    tags: ['simulation', 'phase3', 'isaiah_sim', 'mastery']
  },

  {
    nodeId: 'isaiah_simulation_phase3_success',
    speaker: 'Isaiah Greene',
    content: [{
      text: "[Isaiah is crying. Not hiding it.]\n\nI\'ve been doing this work for twelve years. Raised millions of dollars. Sat with hundreds of donors.\n\nThat was the first time I brought Marcus into the room.\n\nNot as a story to illustrate impact. As a wound that\'s still bleeding. As proof that I\'m not separate from the grief I\'m asking donors to care about.\n\nElizabeth didn\'t want a fundraiser. She wanted a witness. Someone who understood that money can\'t fix death, but love can outlast it.\n\nMarcus\'s name will be on that scholarship too. Next to David\'s. Two boys who deserved more time.\n\nThank you. For being here when I couldn\'t do it alone.",
      emotion: 'grief_gratitude_peace',
      variation_id: 'phase3_success_v1',
      richEffectContext: 'success'
    }],
    choices: [{
      choiceId: 'phase3_success_continue',
      text: "You honored them both. That\'s what sacred fundraising looks like.",
      nextNodeId: 'isaiah_hub_return',
      pattern: 'helping',
      skills: ['emotionalIntelligence', 'integrity']
    }],
    onEnter: [{
      characterId: 'isaiah',
      trustChange: 3,
      addGlobalFlags: ['isaiah_mastery_achieved']
    }],
    tags: ['simulation', 'phase3', 'success', 'transformation']
  },

  {
    nodeId: 'isaiah_simulation_phase3_fail',
    speaker: 'Isaiah Greene',
    content: [{
      text: "[Isaiah stares at the signed gift agreement. $500,000.]\n\nI got the money. Stayed professional. Didn\'t break down.\n\nBut when Elizabeth left, she looked... empty. Like she\'d written a check to assuage guilt, not to honor love.\n\nI didn\'t give her what she needed. I gave her what was easiest for me.\n\nAnd now I have half a million dollars that feels... hollow.\n\nMarcus would have told me to do better. To be braver. To let people see the wound, not just the work.\n\nI failed him again.",
      emotion: 'hollow_regret',
      variation_id: 'phase3_fail_v1',
      richEffectContext: 'error'
    }],
    choices: [{
      choiceId: 'phase3_fail_reflect',
      text: "Maybe you can call her. Tell her what you couldn\'t say in the room.",
      nextNodeId: 'isaiah_hub_return',
      pattern: 'patience',
      skills: ['courage']
    }],
    onEnter: [{
      characterId: 'isaiah',
      trustChange: 1
    }],
    tags: ['simulation', 'phase3', 'fail']
  },

  {
    nodeId: 'isaiah_vision',
    requiredState: {
      requiredCombos: ['community_architect']
    },
    speaker: 'Isaiah Greene',
    content: [{
      text: "You know what I\'ve been missing all these years?\n\nI\'ve been treating systems like problems to solve through individual heroism. One donor. One scholarship. One life changed at a time.\n\nBut you understand something I\'m still learning. Systems work when they\'re collaborative. When the people inside them—donors, staff, young people, community leaders—are all part of building the structure, not just benefiting from it.\n\nThat\'s a community architect. Someone who builds systems where everyone\'s voice matters. Where the work can scale because it\'s rooted in relationships, not just resources.\n\nI think... I think that\'s how we actually transform things. Not by saving people. By building systems that help people save each other.",
      emotion: 'inspired',
      variation_id: 'community_architect_vision_v1'
    }],
    choices: [
      {
        choiceId: 'vision_apply',
        text: "That\'s how you rebuild what you\'ve been carrying.",
        nextNodeId: 'isaiah_hub_return',
        pattern: 'building',
        skills: ['systemsThinking', 'collaboration']
      },
      {
        choiceId: 'vision_together',
        text: "And you think you can build that way?",
        nextNodeId: 'isaiah_still_believe',
        pattern: 'exploring',
        skills: ['communication', 'encouragement']
      }
    ],
    tags: ['skill_combo_unlock', 'community_architect', 'isaiah_wisdom']
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
