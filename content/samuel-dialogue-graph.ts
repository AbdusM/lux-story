/**
 * Samuel Washington's Dialogue Graph
 * The Station Keeper - Hub character who guides travelers between platforms
 *
 * Role: Navigator, mentor, former traveler who chose to guide others
 * Background: Former Southern Company engineer, Birmingham native
 * Voice: Warm, patient, knowing but not mystical
 */

import {
  DialogueNode,
  DialogueGraph
} from '@/lib/dialogue-graph'
import { mayaRevisitEntryPoints } from './maya-revisit-graph'

export const samuelDialogueNodes: DialogueNode[] = [
  // ============= INTRODUCTION =============
  {
    nodeId: 'samuel_introduction',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Welcome to Grand Central Terminus. I'm Samuel Washington, and I keep this station.\n\nYou have the look of someone standing at a crossroads. Not sure which way to turn, which path to take. The good news? You're in exactly the right place.",
        emotion: 'warm',
        variation_id: 'intro_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ask_what_is_this',
        text: "What is this place?",
        nextNodeId: 'samuel_explains_station',
        pattern: 'exploring',
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'ask_about_platforms',
        text: "I see platforms. Where do they lead?",
        nextNodeId: 'samuel_explains_platforms',
        pattern: 'analytical',
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'ask_who_are_you',
        text: "Who are you, really?",
        nextNodeId: 'samuel_backstory_intro',
        pattern: 'patience',
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      }
    ]
  },

  // ============= STATION EXPLANATION =============
  {
    nodeId: 'samuel_explains_station',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "This station exists for people like you - people at a turning point. It's not on any map. You can't find it unless you need it.\n\nEvery platform here represents a different path, a different way of contributing to the world. The travelers you meet here? They're all asking the same question you are: 'What am I supposed to do with my life?'",
        emotion: 'knowing',
        variation_id: 'explains_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ask_your_story',
        text: "Were you a traveler once?",
        nextNodeId: 'samuel_backstory_intro',
        pattern: 'patience'
      },
      {
        choiceId: 'ready_to_explore',
        text: "I'm ready to explore the platforms.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'exploring'
      }
    ]
  },

  {
    nodeId: 'samuel_explains_platforms',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Each platform leads somewhere different. Platform 1 - The Care Line - that's where you find people who heal, who teach, who help others grow. Platform 3 - The Builder's Track - engineers, makers, people who create with their hands.\n\nThe thing is, you don't choose a platform by logic alone. You talk to the travelers, hear their stories, see which ones resonate. Your path reveals itself through connection.",
        emotion: 'reflective',
        variation_id: 'platforms_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ask_backstory',
        text: "What's your story? How did you become the Station Keeper?",
        nextNodeId: 'samuel_backstory_intro',
        pattern: 'patience',
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'ready_to_meet',
        text: "I'd like to meet someone.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'helping'
      }
    ]
  },

  // ============= SAMUEL'S BACKSTORY =============
  {
    nodeId: 'samuel_backstory_intro',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You want to know my story? Fair question.\n\nI was an engineer at Southern Company for twenty-three years. Power plants, electrical grids, the infrastructure that keeps Birmingham running. Good job, stable, respected. My father was proud - first in our family to work in an office instead of at Sloss Furnaces.",
        emotion: 'reflective',
        variation_id: 'backstory_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ask_why_leave',
        text: "Why did you leave?",
        nextNodeId: 'samuel_backstory_revelation',
        pattern: 'exploring'
      },
      {
        choiceId: 'acknowledge',
        text: "That sounds like a good life.",
        nextNodeId: 'samuel_backstory_revelation',
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['knows_backstory']
      }
    ]
  },

  {
    nodeId: 'samuel_backstory_revelation',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "It was a good life. But it wasn't MY life, if that makes sense.\n\nOne day I'm standing in front of Vulcan, looking down at Birmingham spread out below. And I realize I've spent twenty-three years building other people's systems, following other people's blueprints. I was good at it. But I'd never asked myself what I actually wanted to build.",
        emotion: 'vulnerable',
        variation_id: 'revelation_v1'
      }
    ],
    choices: [
      {
        choiceId: 'what_did_you_want',
        text: "What did you want to build?",
        nextNodeId: 'samuel_purpose_found',
        pattern: 'exploring',
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'relate',
        text: "I understand that feeling.",
        nextNodeId: 'samuel_purpose_found',
        pattern: 'helping',
        consequence: {
          characterId: 'samuel',
          trustChange: 2,
          setRelationshipStatus: 'acquaintance'
        }
      }
    ]
  },

  {
    nodeId: 'samuel_purpose_found',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I wanted to help people find their own blueprints. Not hand them answers, but create a space where they could ask the right questions.\n\nThat's what this station is. I didn't build it - it was here, waiting for someone to keep it. Been doing this for... well, time works differently here. Long enough to see hundreds of travelers find their way.",
        emotion: 'warm',
        variation_id: 'purpose_v1'
      }
    ],
    choices: [
      {
        choiceId: 'beautiful',
        text: "That's a beautiful purpose.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'helping',
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'ready_for_my_blueprint',
        text: "I'm ready to find my blueprint.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'exploring'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['knows_purpose']
      }
    ]
  },

  // ============= HUB: INITIAL (Only Maya available) =============
  {
    nodeId: 'samuel_hub_initial',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Tonight, there's a young woman on Platform 1 - The Care Line. Her name is Maya Chen. Pre-med student at UAB, brilliant mind. But she's carrying a weight she doesn't quite know how to put down.\n\nI have a feeling you two should meet. Sometimes the best way to find your own path is to help someone else see theirs.",
        emotion: 'knowing',
        variation_id: 'hub_initial_v1'
      }
    ],
    requiredState: {
      lacksGlobalFlags: ['met_maya', 'maya_arc_complete']
    },
    choices: [
      {
        choiceId: 'go_to_maya',
        text: "I'll find her on Platform 1.",
        nextNodeId: 'maya_introduction', // Cross-graph to Maya
        pattern: 'helping',
        consequence: {
          addGlobalFlags: ['met_maya']
        }
      },
      {
        choiceId: 'tell_me_more',
        text: "Tell me more about Maya first.",
        nextNodeId: 'samuel_maya_context',
        pattern: 'analytical'
      },
      {
        choiceId: 'need_time',
        text: "I need a moment to think.",
        nextNodeId: 'samuel_patience_response',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_maya_context',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Maya's parents are immigrants. They sacrificed everything to give her opportunities they never had. Now she's succeeding by every measure - top grades, MCAT scores, acceptance letters.\n\nBut success and fulfillment aren't always the same thing. She's torn between honoring her parents' dreams and finding her own. It's a weight many first-generation students carry.",
        emotion: 'empathetic',
        variation_id: 'maya_context_v1'
      }
    ],
    choices: [
      {
        choiceId: 'go_now',
        text: "I'll go talk to her.",
        nextNodeId: 'maya_introduction',
        pattern: 'helping',
        consequence: {
          addGlobalFlags: ['met_maya']
        }
      }
    ]
  },

  {
    nodeId: 'samuel_patience_response',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Take all the time you need. The platforms aren't going anywhere, and neither am I.\n\nThis station has been here for as long as people have needed it. It'll be here when you're ready.",
        emotion: 'patient',
        variation_id: 'patience_v1'
      }
    ],
    choices: [
      {
        choiceId: 'ready_now',
        text: "Actually, I'm ready now.",
        nextNodeId: 'samuel_hub_initial',
        pattern: 'exploring'
      }
    ]
  },

  // ============= MAYA REFLECTION GATEWAY (First return from Maya) =============
  {
    nodeId: 'samuel_maya_reflection_gateway',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "*He's standing at the platform entrance as you return, a knowing look in his eyes*\n\nWelcome back. I can see the conversation went deep - Maya has that effect on people who really listen to her.\n\nHow are you feeling about what just happened between you two?",
        emotion: 'warm_observant',
        variation_id: 'reflection_gateway_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['maya_arc_complete'],
      lacksKnowledgeFlags: ['reflected_on_maya']
    },
    choices: [
      {
        choiceId: 'hope_i_helped',
        text: "I hope I helped her.",
        nextNodeId: 'samuel_reflect_on_influence',
        pattern: 'helping'
      },
      {
        choiceId: 'unsure_what_i_did',
        text: "I'm not sure what I actually did.",
        nextNodeId: 'samuel_reflect_on_influence',
        pattern: 'exploring'
      },
      {
        choiceId: 'skip_reflection',
        text: "She made her own choice.",
        nextNodeId: 'samuel_reflect_on_agency',
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['reflected_on_maya']
      }
    ]
  },

  // ============= REFLECTION: Understanding Influence vs. Agency =============
  {
    nodeId: 'samuel_reflect_on_influence',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "You did help her. But not in the way most people think 'helping' works.\n\nYou didn't fix her problem. You didn't tell her what to do. You created space for her to see options she couldn't see before. That's influence, not control. And influence - the kind that respects someone's agency - that's rare.",
        emotion: 'teaching',
        variation_id: 'influence_v1'
      }
    ],
    choices: [
      {
        choiceId: 'what_did_maya_choose',
        text: "What path did she choose?",
        nextNodeId: 'samuel_maya_path_reflection',
        pattern: 'exploring'
      },
      {
        choiceId: 'how_do_you_know',
        text: "How do you know I didn't just tell her what to do?",
        nextNodeId: 'samuel_systemic_proof',
        pattern: 'analytical'
      },
      {
        choiceId: 'accept_insight',
        text: "That distinction matters.",
        nextNodeId: 'samuel_maya_path_reflection',
        pattern: 'patience',
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_reflect_on_agency',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "*He smiles, a quiet satisfaction in his expression*\n\nExactly. She made her own choice. That's the most important thing you could understand about what just happened.\n\nYou were a mirror, not a map. You reflected possibilities back to her, but she's the one who decided which way to walk. That's the difference between helping someone and trying to save them.",
        emotion: 'proud',
        variation_id: 'agency_v1'
      }
    ],
    choices: [
      {
        choiceId: 'what_path_did_she_choose',
        text: "Which path did she choose?",
        nextNodeId: 'samuel_maya_path_reflection',
        pattern: 'exploring'
      },
      {
        choiceId: 'is_that_what_you_do',
        text: "Is that what you do here? Be a mirror?",
        nextNodeId: 'samuel_station_keeper_truth',
        pattern: 'patience'
      }
    ]
  },

  // ============= REFLECTION: Maya's Specific Choice =============
  {
    nodeId: 'samuel_maya_path_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She's choosing robotics. The path she's been afraid to name out loud because it felt like betraying twenty years of her parents' sacrifice.\n\nYou helped her see that honoring their love doesn't require abandoning herself. That's wisdom most people spend decades learning.",
        emotion: 'reflective',
        variation_id: 'robotics_path_v1'
      }
    ],
    requiredState: {
      hasKnowledgeFlags: ['chose_robotics']
    },
    choices: [
      {
        choiceId: 'how_do_you_know_robotics',
        text: "How do you know that's what she'll choose?",
        nextNodeId: 'samuel_station_sees_all',
        pattern: 'analytical'
      },
      {
        choiceId: 'glad_she_found_it',
        text: "I'm glad she found that clarity.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'helping'
      },
      {
        choiceId: 'what_about_me',
        text: "What about my path?",
        nextNodeId: 'samuel_your_pattern_emerges',
        pattern: 'exploring'
      }
    ]
  },

  {
    nodeId: 'samuel_maya_path_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She's choosing the hybrid path - biomedical engineering. The road where she doesn't have to choose between her parents' dreams and her own.\n\nYou helped her see both paths could honor her family. You showed her that 'and' is sometimes more powerful than 'or.' That takes someone who understands complexity, not just solutions.",
        emotion: 'appreciative',
        variation_id: 'hybrid_path_v1'
      }
    ],
    requiredState: {
      hasKnowledgeFlags: ['chose_hybrid']
    },
    choices: [
      {
        choiceId: 'perfect_solution',
        text: "It does seem like the perfect solution.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'analytical'
      },
      {
        choiceId: 'she_found_her_bridge',
        text: "She found her own bridge.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'patience',
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'what_pattern_am_i_showing',
        text: "What pattern am I showing?",
        nextNodeId: 'samuel_your_pattern_emerges',
        pattern: 'exploring'
      }
    ]
  },

  {
    nodeId: 'samuel_maya_path_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "She's choosing to keep exploring. Not rushing the decision, not forcing clarity before it's ready to emerge.\n\nYou gave her permission to not know yet. In a world that demands immediate answers, that's a profound gift. That takes someone comfortable with ambiguity - someone patient.",
        emotion: 'knowing',
        variation_id: 'self_path_v1'
      }
    ],
    requiredState: {
      hasKnowledgeFlags: ['chose_self']
    },
    choices: [
      {
        choiceId: 'is_that_okay',
        text: "Is it okay that she doesn't have an answer yet?",
        nextNodeId: 'samuel_patience_wisdom',
        pattern: 'helping'
      },
      {
        choiceId: 'recognize_the_gift',
        text: "Sometimes not knowing is the answer.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'patience',
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'what_does_that_say',
        text: "What does that say about me?",
        nextNodeId: 'samuel_your_pattern_emerges',
        pattern: 'exploring'
      }
    ]
  },

  // ============= CONTEMPLATION MOMENTS (Optional Depth) =============
  {
    nodeId: 'samuel_station_sees_all',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The station doesn't just connect platforms. It connects moments. I saw her at the robotics lab when she was sixteen, sneaking in after her parents thought she was at SAT prep.\n\nShe's always known. You just helped her believe knowing was allowed.",
        emotion: 'mystical_truth',
        variation_id: 'station_truth_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_station_truth',
        text: "*nod in understanding*",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_patience_wisdom',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Is it okay? It's more than okay - it's courageous.\n\nOur whole world is designed to make you choose fast, commit early, lock in your path before you've even walked it. Maya choosing to sit with uncertainty? That's her refusing to let urgency override truth.",
        emotion: 'wise',
        variation_id: 'patience_wisdom_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_from_patience',
        text: "That's a different kind of strength.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'patience',
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_systemic_proof',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Because the station remembers. If you'd tried to control her - 'You should be a doctor,' 'You should follow your passion' - her trust in you wouldn't have grown. But it did. The system doesn't lie.\n\nTrust is how the station measures genuine connection. And Maya trusted you because you listened without an agenda.",
        emotion: 'knowing',
        variation_id: 'systemic_proof_v1'
      }
    ],
    choices: [
      {
        choiceId: 'trust_as_measurement',
        text: "Trust as a measurement of authenticity.",
        nextNodeId: 'samuel_maya_path_reflection',
        pattern: 'analytical',
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_station_keeper_truth',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "*He looks out at the platforms, the lights reflecting in his eyes*\n\nThat's exactly what I do. I don't give travelers directions - I help them see what they already know but can't admit yet.\n\nI was an engineer who followed other people's blueprints for twenty-three years. Now I help people draw their own. The station chose me because I learned this truth the hard way: The best guides don't lead. They witness.",
        emotion: 'vulnerable_wisdom',
        variation_id: 'keeper_truth_v1'
      }
    ],
    choices: [
      {
        choiceId: 'witness_not_lead',
        text: "Witness, not lead.",
        nextNodeId: 'samuel_maya_path_reflection',
        pattern: 'patience',
        consequence: {
          characterId: 'samuel',
          trustChange: 2
        }
      }
    ]
  },

  {
    nodeId: 'samuel_your_pattern_emerges',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Your path? It's being written right now, in how you show up for others.\n\nSome people come to this station knowing exactly what they want to build. Others come to discover their purpose through building others up. You're in the second group. That's not a lesser path - it's often the deeper one.",
        emotion: 'reflective',
        variation_id: 'pattern_emerges_v1'
      }
    ],
    choices: [
      {
        choiceId: 'accept_the_pattern',
        text: "I'm starting to see that.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'patience'
      },
      {
        choiceId: 'but_what_specifically',
        text: "But what does that mean, specifically?",
        nextNodeId: 'samuel_specificity_trap',
        pattern: 'analytical'
      }
    ]
  },

  {
    nodeId: 'samuel_specificity_trap',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "*He smiles gently*\n\nThat's the question that keeps people stuck. 'What specifically should I do?' As if your purpose can be reduced to a job title or a five-year plan.\n\nThe pattern is bigger than any single role. You're learning to hold space, to ask questions that matter, to meet people in their uncertainty. Those skills? They're valuable everywhere - teaching, counseling, leadership, design, ministry, coaching. The form will emerge. Trust the pattern.",
        emotion: 'patient_wisdom',
        variation_id: 'specificity_trap_v1'
      }
    ],
    choices: [
      {
        choiceId: 'trust_the_pattern',
        text: "Trust the pattern.",
        nextNodeId: 'samuel_contemplation_offer',
        pattern: 'patience',
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'samuel_contemplation_offer',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "*He pauses, studying you for a moment*\n\nWe can keep talking about what happened with Maya, if you want. There's value in sitting with an experience before rushing to the next one.\n\nOr, if you're ready, there are other travelers on the platforms tonight. Each one will show you something different about yourself.",
        emotion: 'offering_space',
        variation_id: 'contemplation_offer_v1'
      }
    ],
    choices: [
      {
        choiceId: 'contemplate_more',
        text: "Tell me more about what you saw.",
        nextNodeId: 'samuel_deep_reflection',
        pattern: 'patience'
      },
      {
        choiceId: 'ready_for_next',
        text: "I'm ready to meet someone else.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring'
      },
      {
        choiceId: 'revisit_maya',
        text: "Can I talk to Maya again?",
        nextNodeId: 'samuel_maya_revisit_guidance',
        pattern: 'helping'
      }
    ]
  },

  {
    nodeId: 'samuel_deep_reflection',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "I saw you listening to what Maya wasn't saying. Most people hear the words - 'I'm pre-med, I have good grades' - and think they understand.\n\nYou heard the weight underneath the words. The fear of disappointing her parents. The shame of wanting something different. The loneliness of succeeding at a path that isn't yours.\n\nThat's not a skill they teach in school. That's wisdom born from your own wrestling. You recognized her struggle because you've felt something like it yourself.",
        emotion: 'deep_knowing',
        variation_id: 'deep_reflection_v1'
      }
    ],
    choices: [
      {
        choiceId: 'how_did_you_see_that',
        text: "How could you see all that?",
        nextNodeId: 'samuel_station_truth_deep',
        pattern: 'exploring'
      },
      {
        choiceId: 'yes_i_have',
        text: "I have felt something like that.",
        nextNodeId: 'samuel_solidarity',
        pattern: 'patience',
        consequence: {
          characterId: 'samuel',
          trustChange: 2,
          setRelationshipStatus: 'confidant'
        }
      },
      {
        choiceId: 'ready_now',
        text: "I think I'm ready for the next platform.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring'
      }
    ]
  },

  {
    nodeId: 'samuel_station_truth_deep',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "The station shows me moments. Fragments. Your conversation with Maya, yes, but also... glimpses of what brought you here.\n\nEveryone who finds this place is standing at their own crossroads. You're not just helping Maya find her path. You're finding yours by walking beside her through her uncertainty.",
        emotion: 'mystical',
        variation_id: 'station_truth_deep_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue_deep',
        text: "*sit with this truth*",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_solidarity',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "*He nods, no surprise in his expression - just recognition*\n\nI know you have. That's why you could meet her there. We can only guide people through territory we've walked ourselves.\n\nYour uncertainty isn't a flaw. It's your qualification. The station doesn't call people who have all the answers. It calls people who know how to sit with questions.",
        emotion: 'warm_solidarity',
        variation_id: 'solidarity_v1'
      }
    ],
    choices: [
      {
        choiceId: 'thank_you',
        text: "Thank you for seeing that.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience'
      }
    ]
  },

  {
    nodeId: 'samuel_maya_revisit_guidance',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Of course. She'll be glad to see you.\n\nThe relationship you built with her doesn't end when the conversation does. That's one of the gifts of this place - the connections are real, and they persist.\n\nYou'll find her back on Platform 1.",
        emotion: 'encouraging',
        variation_id: 'revisit_guidance_v1'
      }
    ],
    choices: [
      {
        choiceId: 'go_to_maya_revisit',
        text: "Take me to Platform 1.",
        nextNodeId: mayaRevisitEntryPoints.WELCOME,
        pattern: 'helping'
      }
    ]
  },

  // ============= HUB: AFTER MAYA (Maya + Devon available) =============
  {
    nodeId: 'samuel_hub_after_maya',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Platform 3 has another traveler tonight. Devon Kumar - engineering student. Builds systems to avoid dealing with emotions. Reminds me of myself at that age, if I'm honest.\n\nOr you can return to Maya if you'd like. The choice is yours.",
        emotion: 'reflective',
        variation_id: 'hub_after_maya_v1'
      }
    ],
    requiredState: {
      hasGlobalFlags: ['maya_arc_complete'],
      lacksGlobalFlags: ['devon_arc_complete']
    },
    choices: [
      {
        choiceId: 'return_to_maya',
        text: "I'd like to talk to Maya again.",
        nextNodeId: mayaRevisitEntryPoints.WELCOME, // Type-safe revisit navigation ✅
        pattern: 'helping',
        visibleCondition: {
          hasGlobalFlags: ['maya_arc_complete']
        }
      },
      {
        choiceId: 'meet_devon',
        text: "Tell me about Devon.",
        nextNodeId: 'samuel_devon_intro',
        pattern: 'exploring'
      },
      {
        choiceId: 'tell_me_pattern',
        text: "What do you see in me?",
        nextNodeId: 'samuel_pattern_observation',
        pattern: 'patience',
        visibleCondition: {
          trust: { min: 3 }
        }
      }
    ]
  },

  {
    nodeId: 'samuel_devon_intro',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Devon's on Platform 3 - The Builder's Track. Engineering student, probably hunched over some blueprint or schematic right now.\n\nHe organizes everything into systems because systems are predictable. People aren't. He's brilliant at designing solutions for problems, but he struggles when the problems involve hearts instead of mechanics.",
        emotion: 'understanding',
        variation_id: 'devon_intro_v1'
      }
    ],
    choices: [
      {
        choiceId: 'go_to_devon',
        text: "I'll go meet Devon.",
        nextNodeId: 'devon_introduction', // Cross-graph to Devon (future)
        pattern: 'exploring',
        consequence: {
          addGlobalFlags: ['met_devon']
        }
      },
      {
        choiceId: 'why_me',
        text: "Why do you think I should talk to him?",
        nextNodeId: 'samuel_why_devon',
        pattern: 'analytical'
      }
    ]
  },

  {
    nodeId: 'samuel_why_devon',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Because you've shown you can meet people where they are. Maya needed someone to validate her hidden dream. Devon needs something different - someone to show him that vulnerability isn't weakness, it's data he's been ignoring.\n\nYou're building a particular kind of skill here. The station is showing you.",
        emotion: 'wise',
        variation_id: 'why_devon_v1'
      }
    ],
    choices: [
      {
        choiceId: 'go_now',
        text: "I'll go find Devon.",
        nextNodeId: 'devon_introduction', // Cross-graph (future)
        pattern: 'helping',
        consequence: {
          addGlobalFlags: ['met_devon']
        }
      }
    ]
  },

  // ============= PATTERN OBSERVATION (Trust-gated wisdom) =============
  {
    nodeId: 'samuel_pattern_observation',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "What do I see in you? I see someone who listens more than they speak. Who asks questions that make people think instead of giving answers that shut down thinking.\n\nYou're not here by accident. The station called you because you have the capacity to hold space for others' becoming. That's a rare gift, and a difficult one. It means you'll often help others find clarity before you find your own.",
        emotion: 'knowing',
        variation_id: 'pattern_v1'
      }
    ],
    requiredState: {
      trust: { min: 3 }
    },
    choices: [
      {
        choiceId: 'what_about_my_path',
        text: "What about my own path?",
        nextNodeId: 'samuel_your_path',
        pattern: 'exploring',
        consequence: {
          characterId: 'samuel',
          trustChange: 1
        }
      },
      {
        choiceId: 'accept',
        text: "Thank you for seeing that.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'patience',
        consequence: {
          characterId: 'samuel',
          trustChange: 2,
          setRelationshipStatus: 'confidant'
        }
      }
    ]
  },

  {
    nodeId: 'samuel_your_path',
    speaker: 'Samuel Washington',
    content: [
      {
        text: "Your path is being revealed right now, in these conversations. Every traveler you help is a mirror showing you something about yourself.\n\nThe station doesn't give answers. It provides encounters. The meaning emerges from what you do with them. Keep walking the platforms. Your blueprint is taking shape, even if you can't see the full design yet.",
        emotion: 'patient',
        variation_id: 'your_path_v1'
      }
    ],
    choices: [
      {
        choiceId: 'continue',
        text: "I'll keep exploring.",
        nextNodeId: 'samuel_hub_after_maya',
        pattern: 'exploring'
      }
    ],
    onEnter: [
      {
        characterId: 'samuel',
        addKnowledgeFlags: ['pattern_revealed']
      }
    ]
  }
]

// ============= PUBLIC API: EXPORTED ENTRY POINTS =============
// These nodes are designed for cross-graph navigation.
// Do NOT link to internal nodes - only use these exported IDs.
// This provides compile-time safety and refactor protection.

export const samuelEntryPoints = {
  /** Initial entry point - game starts here */
  INTRODUCTION: 'samuel_introduction',

  /** Hub shown when player first arrives (only Maya available) */
  HUB_INITIAL: 'samuel_hub_initial',

  /** Reflection gateway - first return from Maya (mirrors player's influence) */
  MAYA_REFLECTION_GATEWAY: 'samuel_maya_reflection_gateway',

  /** Hub after completing Maya's arc (Maya + Devon available) */
  HUB_AFTER_MAYA: 'samuel_hub_after_maya',

  /** Samuel's backstory reveal (trust-gated) */
  BACKSTORY: 'samuel_backstory_intro',

  /** Pattern observation (trust ≥3 required) */
  PATTERN_OBSERVATION: 'samuel_pattern_observation'
} as const

// Type export for TypeScript autocomplete
export type SamuelEntryPoint = typeof samuelEntryPoints[keyof typeof samuelEntryPoints]

export const samuelDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(samuelDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: samuelEntryPoints.INTRODUCTION,
  metadata: {
    title: "Samuel's Guidance",
    author: 'Guided Generation (Build-Time)',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: samuelDialogueNodes.length,
    totalChoices: samuelDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}