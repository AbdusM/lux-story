/**
 * Yaquin's Dialogue Graph
 * The Practical Creator - Platform 5 (Creator Economy / EdTech)
 *
 * CHARACTER: The Dental Assistant Turned Educator
 * Core Conflict: "Tacit Knowledge" vs. "Formal Credentials"
 * Arc: Realizing that his practical skills are more valuable than theoretical degrees
 * Mechanic: "The Curriculum" - Designing a course that strips away the fluff
 */

import { DialogueNode, DialogueGraph } from '../lib/dialogue-graph'
import { samuelEntryPoints } from './samuel-dialogue-graph'

export const yaquinDialogueNodes: DialogueNode[] = [
  // ... [KEEPING INTRO NODES] ...
  {
    nodeId: 'yaquin_introduction',
    speaker: 'Yaquin',
    content: [
      {
        text: `*He's surrounded by dental models—sets of teeth, gum molds—and a ring light setup. He's talking to his phone.*

"Okay, guys, forget the textbook. Chapter 4 is garbage. This is how you actually mix the alginate so it doesn't gag the patient."

*He stops recording and sighs.*

Is it garbage? Or am I just uneducated?`,
        emotion: 'frustrated_passion',
        variation_id: 'yaquin_intro_v1',
        richEffectContext: 'warning'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_intro_garbage',
        text: "If the textbook doesn't work, it's garbage.",
        nextNodeId: 'yaquin_textbook_problem',
        pattern: 'building',
        skills: ['criticalThinking'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      },
      {
        choiceId: 'yaquin_intro_authority',
        text: "Why do you think you're uneducated?",
        nextNodeId: 'yaquin_credential_gap',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'yaquin_intro_content',
        text: "You're teaching online?",
        nextNodeId: 'yaquin_creator_path',
        pattern: 'exploring',
        skills: ['digitalLiteracy']
      }
    ],
    onEnter: [
      {
        characterId: 'yaquin',
        setRelationshipStatus: 'stranger'
      }
    ],
    tags: ['introduction', 'yaquin_arc']
  },

  {
    nodeId: 'yaquin_textbook_problem',
    speaker: 'Yaquin',
    content: [
      {
        text: `Right? It says 'mix for 45 seconds.' If you do that, it sets in the bowl. You ruin the mold.

I've been a dental assistant for 8 years. I know the feel of the paste. I know the look in a patient's eyes when they're scared.

The books don't teach that.`,
        emotion: 'confident',
        variation_id: 'textbook_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_tacit_knowledge',
        text: "That's called tacit knowledge. It's valuable.",
        nextNodeId: 'yaquin_curriculum_dream',
        pattern: 'analytical',
        skills: ['pedagogy']
      },
      {
        choiceId: 'yaquin_teach_that',
        text: "So teach THAT. The real stuff.",
        nextNodeId: 'yaquin_curriculum_setup',
        pattern: 'building',
        skills: ['leadership']
      }
    ]
  },

  {
    nodeId: 'yaquin_credential_gap',
    speaker: 'Yaquin',
    content: [
      {
        text: `I'm 'just' an assistant. I didn't go to dental school.

But the dentists ask *me* how to handle the difficult patients. They ask *me* to train the new hires.

I'm doing the work, but I don't have the paper.`,
        emotion: 'insecure',
        variation_id: 'credential_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_competence',
        text: "Competence matters more than paper.",
        nextNodeId: 'yaquin_curriculum_dream',
        pattern: 'helping',
        skills: ['encouragement'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      }
    ]
  },

  {
    nodeId: 'yaquin_curriculum_dream',
    speaker: 'Yaquin',
    content: [
      {
        text: `I want to build a course. 'The Real Dental Assistant.'

Not theory. Reality. How to calm a crying kid. How to mix the paste. How to anticipate what the doctor needs before they ask.

But I keep looking at the syllabus and thinking... I need to include the history of dentistry. And anatomy. And ethics.`,
        emotion: 'overwhelmed',
        variation_id: 'dream_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_help_edit',
        text: "You're adding fluff. Let's cut it.",
        nextNodeId: 'yaquin_curriculum_setup',
        pattern: 'building',
        skills: ['instructionalDesign']
      }
    ]
  },

  // ============= THE CURRICULUM (Immersive Scenario) =============
  {
    nodeId: 'yaquin_curriculum_setup',
    speaker: 'Yaquin',
    content: [
      {
        text: `*He slams a notebook onto the table. It's thick, messy, and covered in coffee stains.*

"Look at this list. I'm trying to turn 8 years of instinct into a checklist. It's impossible."

*He points to three potential modules.*

"I only have time to film one pilot module this weekend. If I pick the wrong one, nobody watches, and I go back to cleaning spit valves."`,
        emotion: 'frustrated_focused',
        variation_id: 'curriculum_setup_v2',
        richEffectContext: 'warning', // Editor Mode
        useChatPacing: true
      }
    ],
    requiredState: {
      trust: { min: 1 }
    },
    choices: [
      {
        choiceId: 'module_history',
        text: "[ACTION] 'Module 1: The History of Dentistry (1800-Present).'",
        nextNodeId: 'yaquin_fail_boring',
        pattern: 'analytical', // Trap choice: boring
        skills: ['curriculumDesign']
      },
      {
        choiceId: 'module_practical',
        text: "[ACTION] 'Module 1: The Perfect Impression (How not to choke your patient).'",
        nextNodeId: 'yaquin_success_practical',
        pattern: 'building',
        skills: ['marketing', 'empathy']
      },
      {
        choiceId: 'module_soft_skills',
        text: "[ACTION] 'Module 1: Reading the Room (Patient Psychology).'",
        nextNodeId: 'yaquin_success_psych',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['simulation', 'yaquin_arc', 'immersive_scenario']
  },

  // --- FAILURE STATE: BORING ---
  {
    nodeId: 'yaquin_fail_boring',
    speaker: 'Yaquin',
    content: [
      {
        text: `*Yaquin films it. He watches the playback.*

"Hello class. Today we will discuss 19th century forceps."

*He puts his head in his hands.*

"I'm bored. I'm literally bored watching myself. Nobody is going to pay $50 for this. I sound like the professors I hated."`,
        emotion: 'defeated',
        variation_id: 'fail_boring_v1',
        richEffectContext: 'error'
      }
    ],
    choices: [
      {
        choiceId: 'retry_curriculum',
        text: "Cut the history. Teach the skill.",
        nextNodeId: 'yaquin_curriculum_setup',
        pattern: 'building'
      },
      {
        choiceId: 'give_up_boring',
        text: "Maybe you need a degree to teach.",
        nextNodeId: 'yaquin_bad_ending',
        pattern: 'analytical',
        consequence: {
           addGlobalFlags: ['yaquin_chose_safe'] 
        }
      }
    ]
  },

  // --- SUCCESS VARIATIONS ---
  {
    nodeId: 'yaquin_success_practical',
    speaker: 'Yaquin',
    content: [
      {
        text: `*He films it. Fast. Energetic. He mixes the paste on camera, making a mess, laughing.*

"See? It's pink. It's goopy. And you have 30 seconds before it turns to stone. Go!"

*He watches the playback, grinning.*

"That's it. That's the energy. It's not a lecture. It's a cooking show for teeth."`,
        emotion: 'excited',
        variation_id: 'success_practical_v1',
        richEffectContext: 'success'
      }
    ],
    choices: [
      {
        choiceId: 'confirm_practical',
        text: "That's your brand. 'The Cooking Show for Teeth.'",
        nextNodeId: 'yaquin_launch_decision',
        pattern: 'building',
        skills: ['branding']
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['yaquin_chose_practical']
      }
    ]
  },

  {
    nodeId: 'yaquin_success_psych',
    speaker: 'Yaquin',
    content: [
      {
        text: `*He talks to the camera like it's a scared patient.*

"I know you're nervous. I know the drill sounds loud. Watch my eyes. Breathe with me."

*He stops recording.*

"That's what I do all day. I don't fix teeth. I fix fear. That's what I'm selling."`,
        emotion: 'inspired',
        variation_id: 'success_psych_v1',
        richEffectContext: 'success'
      }
    ],
    choices: [
      {
        choiceId: 'confirm_psych',
        text: "You're teaching emotional intelligence, not just dentistry.",
        nextNodeId: 'yaquin_launch_decision',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['yaquin_chose_psych']
      }
    ]
  },

  // ============= THE LAUNCH (Climax) =============
  {
    nodeId: 'yaquin_launch_decision',
    speaker: 'Yaquin',
    content: [
      {
        text: `I have the video. I have the platform.

But if I hit publish... the dentists I work for will see it. They might fire me. 'Who does this guy think he is?'

But if I don't... I'm just a guy shouting at his phone in a basement.`,
        emotion: 'nervous_energy',
        variation_id: 'launch_v1'
      }
    ],
    requiredState: {
      trust: { min: 2 }
    },
    choices: [
      {
        choiceId: 'launch_now',
        text: "Launch it. Ask for forgiveness, not permission.",
        nextNodeId: 'yaquin_launched',
        pattern: 'building',
        skills: ['entrepreneurship', 'courage']
      },
      {
        choiceId: 'launch_wait',
        text: "Build an audience anonymously first.",
        nextNodeId: 'yaquin_audience_first',
        pattern: 'analytical',
        skills: ['strategy']
      }
    ]
  },

  {
    nodeId: 'yaquin_launched',
    speaker: 'Yaquin',
    content: [
      {
        text: `*He hits the button.*

It's live.

First comment: 'Finally someone explains the mixing ratio!'

I'm doing it. I'm actually doing it. I'm a teacher.`,
        emotion: 'triumphant',
        variation_id: 'launched_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_farewell_launched',
        text: "You always were.",
        nextNodeId: 'yaquin_farewell',
        pattern: 'helping'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['yaquin_arc_complete', 'yaquin_launched']
      }
    ],
    tags: ['ending', 'yaquin_arc']
  },

  {
    nodeId: 'yaquin_audience_first',
    speaker: 'Yaquin',
    content: [
      {
        text: `Smart. I'll create a brand name. 'The Dental Ninja.' Build trust, then sell the course.

It's safer. But it's still moving forward.

Thank you. You kept me from making a reckless mistake.`,
        emotion: 'relieved',
        variation_id: 'audience_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_farewell_audience',
        text: "Strategy beats speed.",
        nextNodeId: 'yaquin_farewell',
        pattern: 'analytical'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['yaquin_arc_complete', 'yaquin_building_audience']
      }
    ],
    tags: ['ending', 'yaquin_arc']
  },

  // ============= BAD ENDING =============
  {
    nodeId: 'yaquin_bad_ending',
    speaker: 'Yaquin',
    content: [
      {
        text: `Yeah. I should probably just go back to school. Get the degree. Then maybe people will listen.

This was... a nice fantasy. But I'm just an assistant.

Thanks for listening.`,
        emotion: 'deflated',
        variation_id: 'bad_ending_v1'
      }
    ],
    choices: [
      {
        choiceId: 'yaquin_leave_bad',
        text: "...",
        nextNodeId: samuelEntryPoints.YAQUIN_REFLECTION_GATEWAY,
        pattern: 'patience'
      }
    ],
    onEnter: [
      {
        addGlobalFlags: ['yaquin_chose_safe', 'yaquin_arc_complete']
      }
    ],
    tags: ['ending', 'bad_ending', 'yaquin_arc']
  },

  {
    nodeId: 'yaquin_farewell',
    speaker: 'Yaquin',
    content: [
      {
        text: `I have a lot of editing to do.

If you see Samuel, tell him... tell him class is in session.`,
        emotion: 'happy',
        variation_id: 'farewell_v1'
      }
    ],
    choices: [
      {
        choiceId: 'return_to_samuel_yaquin',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.YAQUIN_REFLECTION_GATEWAY,
        pattern: 'exploring'
      },
      {
        choiceId: 'yaquin_ask_about_course',
        text: "How's the course going with actual students?",
        nextNodeId: 'yaquin_phase2_entry',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        visibleCondition: {
          hasGlobalFlags: ['yaquin_arc_complete']
        }
      }
    ],
    onEnter: [
      {
        characterId: 'yaquin',
        addKnowledgeFlags: ['completed_arc'],
        addGlobalFlags: ['yaquin_arc_complete']
      }
    ],
    tags: ['transition', 'yaquin_arc']
  },

  // ============= PHASE 2: COURSE LAUNCH AFTERMATH + SCALING CHALLENGE =============

  {
    nodeId: 'yaquin_phase2_entry',
    speaker: 'Yaquin',
    content: [{
      text: `*Eight weeks later. Yaquin is surrounded by three laptops, all open to different tabs. Support tickets. Refund requests. Student progress dashboards.*

*He looks exhausted.*

127 students. I have 127 students in my dental assistant course.

*He gestures at the screens.*

And I have 47 unread support messages, 15 refund requests, a comment from a DDS calling my work "amateur hour," and three dental offices asking to license my course for bulk training.

*He looks up.*

Turns out teaching is the easy part. Running a course business? That's the real education.`,
      emotion: 'overwhelmed',
      variation_id: 'p2_entry_v1'
    }],
    choices: [
      {
        choiceId: 'p2_refund_requests',
        text: "15 refund requests? What's happening?",
        nextNodeId: 'yaquin_p2_quality_crisis',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      },
      {
        choiceId: 'p2_dds_comment',
        text: "What did the DDS say?",
        nextNodeId: 'yaquin_p2_dds_comment',
        pattern: 'analytical',
        skills: ['criticalThinking']
      }
    ],
    requiredState: {
      hasGlobalFlags: ['yaquin_arc_complete']
    },
    tags: ['phase2', 'yaquin_arc', 'crisis']
  },

  {
    nodeId: 'yaquin_p2_quality_crisis',
    speaker: 'Yaquin',
    content: [{
      text: `Students are saying the self-paced format doesn't work for them.

"I need live instruction."
"The videos are too fast."
"I can't stay motivated alone."

*He pulls up a review.*

"Great content, wrong format. I need a teacher, not a YouTube channel."

*He rubs his eyes.*

Half my students are career-switchers like me—motivated, self-directed. They're crushing it.

The other half? Dental office employees sent by their bosses. They're struggling. And asking for refunds.`,
      emotion: 'frustrated',
      variation_id: 'quality_crisis_v1'
    }],
    choices: [
      {
        choiceId: 'p2_two_student_types',
        text: "You have two different student types. One format won't work.",
        nextNodeId: 'yaquin_p2_format_decision',
        pattern: 'analytical',
        skills: ['criticalThinking', 'strategicThinking']
      },
      {
        choiceId: 'p2_refund_policy',
        text: "What's your refund policy?",
        nextNodeId: 'yaquin_p2_refund_pressure',
        pattern: 'building',
        skills: ['pragmatism']
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'crisis']
  },

  {
    nodeId: 'yaquin_p2_dds_comment',
    speaker: 'Yaquin',
    content: [{
      text: `*He shows you the comment.*

**Dr. Sarah Chen, DDS**: "This is amateur hour. No credentials, no structure, no accountability. You're selling YouTube videos for $497. Dental assistants deserve real education, not shortcuts."

*Yaquin sets down the phone.*

She's not wrong about the credentials. I'm a dental assistant teaching dental assistants. No degree. No formal teaching training.

*He looks at you.*

Part of me wants to ignore her. Part of me wants to defend myself. Part of me thinks... maybe she's right.`,
      emotion: 'insecure',
      variation_id: 'dds_comment_v1'
    }],
    choices: [
      {
        choiceId: 'p2_credentials_matter',
        text: "Credentials aren't everything. Your experience is the credential.",
        nextNodeId: 'yaquin_p2_credibility_response',
        pattern: 'helping',
        skills: ['encouragement', 'emotionalIntelligence']
      },
      {
        choiceId: 'p2_take_feedback',
        text: "Use it as feedback. What can you improve?",
        nextNodeId: 'yaquin_p2_credibility_response',
        pattern: 'building',
        skills: ['learningAgility', 'humility']
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'imposter_syndrome']
  },

  {
    nodeId: 'yaquin_p2_refund_pressure',
    speaker: 'Yaquin',
    content: [{
      text: `30-day money-back guarantee. No questions asked.

I thought it was the right thing to do—stand behind the quality.

*He scrolls through refund requests.*

But now I'm getting requests like:
- "My boss made me take this, I don't want to."
- "Too hard, not what I expected."
- "Didn't finish it, want my money back."

*He looks conflicted.*

If I honor every refund, I lose $7,500. If I get strict, I look like a scammer.

And the worst part? I don't know if they're right. Maybe the course IS too hard. Maybe it IS "amateur hour."`,
      emotion: 'conflicted',
      variation_id: 'refund_v1'
    }],
    choices: [
      {
        choiceId: 'p2_generous_refunds',
        text: "Honor the refunds. Build reputation over revenue.",
        nextNodeId: 'yaquin_p2_format_decision',
        pattern: 'helping',
        skills: ['integrity', 'patience'],
        consequence: {
          characterId: 'yaquin',
          addKnowledgeFlags: ['generous_refunds']
        }
      },
      {
        choiceId: 'p2_firm_policy',
        text: "Hold the line. 'Not finishing' isn't a refund reason.",
        nextNodeId: 'yaquin_p2_format_decision',
        pattern: 'building',
        skills: ['accountability', 'courage']
      },
      {
        choiceId: 'p2_case_by_case',
        text: "Case-by-case. Talk to each student, understand why.",
        nextNodeId: 'yaquin_p2_format_decision',
        pattern: 'patience',
        skills: ['emotionalIntelligence', 'fairness']
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'business_ethics']
  },

  {
    nodeId: 'yaquin_p2_credibility_response',
    speaker: 'Yaquin',
    content: [{
      text: `I could ignore Dr. Chen. Or...

*He thinks.*

What if I invite her to review the course? Offer to add her as a credentialed advisor?

Or I could respond publicly: "You're right—I'm not a DDS. I'm the person in the office 40 hours a week doing the actual work. Students need both perspectives."

*He looks at you.*

Do I defend my ground, or do I acknowledge the gap?`,
      emotion: 'thoughtful',
      variation_id: 'credibility_v1'
    }],
    choices: [
      {
        choiceId: 'p2_invite_advisor',
        text: "Invite her to be an advisor. Turn critic into collaborator.",
        nextNodeId: 'yaquin_p2_scaling_offer',
        pattern: 'building',
        skills: ['collaboration', 'strategicThinking'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1,
          addKnowledgeFlags: ['credentialed_advisor']
        }
      },
      {
        choiceId: 'p2_defend_experience',
        text: "Defend your expertise. You know things DDS programs don't teach.",
        nextNodeId: 'yaquin_p2_scaling_offer',
        pattern: 'helping',
        skills: ['courage', 'integrity']
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'credibility']
  },

  {
    nodeId: 'yaquin_p2_format_decision',
    speaker: 'Yaquin',
    content: [{
      text: `I'm looking at the data.

**Self-motivated students**: 85% completion rate. Glowing reviews.
**Boss-mandated students**: 32% completion rate. Most of the refund requests.

*He sketches two paths.*

**Option 1**: Pivot to cohort-based. Fewer students, live instruction, higher price.

**Option 2**: Improve self-paced. Better async support, community forums, office hours.

**Option 3**: Two-tier model. Self-paced ($497) + Cohort premium ($1,497).

*He looks at you.*

What would you do?`,
      emotion: 'analytical',
      variation_id: 'format_v1'
    }],
    choices: [
      {
        choiceId: 'p2_cohort_based',
        text: "Go cohort-based. Quality over quantity.",
        nextNodeId: 'yaquin_p2_scaling_choice',
        pattern: 'helping',
        skills: ['pedagogy', 'visionaryThinking'],
        consequence: {
          characterId: 'yaquin',
          addKnowledgeFlags: ['chose_cohort']
        }
      },
      {
        choiceId: 'p2_improve_self_paced',
        text: "Double down on self-paced. Fix what's broken.",
        nextNodeId: 'yaquin_p2_scaling_choice',
        pattern: 'building',
        skills: ['learningAgility', 'resilience']
      },
      {
        choiceId: 'p2_two_tier',
        text: "Two-tier. Serve both student types.",
        nextNodeId: 'yaquin_p2_scaling_choice',
        pattern: 'analytical',
        skills: ['strategicThinking', 'entrepreneurship'],
        consequence: {
          characterId: 'yaquin',
          trustChange: 1
        }
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'product_strategy']
  },

  {
    nodeId: 'yaquin_p2_scaling_offer',
    speaker: 'Yaquin',
    content: [{
      text: `Three dental offices in Birmingham reached out this week.

They want to license my course for their new hires. Bulk pricing. 50+ students.

*He shows you the emails.*

**Offer**: $15,000 per office, annual license. They handle onboarding, I provide the content.

That's $45,000. Nine months of my dental assistant salary.

*He leans back.*

But if I do this, I'm not teaching anymore. I'm licensing content. I'm... a content creator, not an educator.

Is that what I want?`,
      emotion: 'tempted',
      variation_id: 'scaling_v1'
    }],
    choices: [
      {
        choiceId: 'p2_take_license',
        text: "Take the deal. Sustainable income lets you teach better.",
        nextNodeId: 'yaquin_p2_implementation',
        pattern: 'analytical',
        skills: ['pragmatism', 'entrepreneurship'],
        consequence: {
          characterId: 'yaquin',
          addKnowledgeFlags: ['chose_licensing']
        }
      },
      {
        choiceId: 'p2_stay_direct',
        text: "Stay direct. Teaching is the point, not licensing.",
        nextNodeId: 'yaquin_p2_implementation',
        pattern: 'helping',
        skills: ['integrity', 'visionaryThinking']
      },
      {
        choiceId: 'p2_both',
        text: "Do both. License for income, teach for impact.",
        nextNodeId: 'yaquin_p2_implementation',
        pattern: 'building',
        skills: ['strategicThinking', 'adaptability']
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'scaling']
  },

  {
    nodeId: 'yaquin_p2_scaling_choice',
    speaker: 'Yaquin',
    content: [{
      text: `*He's sketching out a plan.*

Here's what I'm thinking:

Keep the self-paced course for motivated learners.

Add a cohort-based "Dental Mastery Program"—8 weeks, live sessions, small groups.

And maybe... maybe reach out to Dr. Chen. See if she'll co-teach the advanced modules.

*He looks up.*

This isn't about being perfect. It's about serving students where they are.

Some need independence. Some need structure. Why not offer both?`,
      emotion: 'determined',
      variation_id: 'scaling_choice_v1'
    }],
    choices: [
      {
        choiceId: 'p2_solid_plan',
        text: "That's a solid plan. Iteration, not perfection.",
        nextNodeId: 'yaquin_p2_implementation',
        pattern: 'building',
        skills: ['encouragement']
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'strategy']
  },

  {
    nodeId: 'yaquin_p2_implementation',
    speaker: 'Yaquin',
    content: [{
      text: `*Two weeks later.*

I implemented the changes.

- Launched cohort-based program: 24 students enrolled at $1,497 each
- Improved self-paced: Added weekly office hours, student forum
- Refunds: Approved 8, denied 7 with clear reasoning
- Dr. Chen: She agreed to review my curriculum (for a fee, of course)

*He grins.*

Revenue is up. Completion rates are up. Refund requests are down.

But more importantly? I'm learning to run a business, not just teach a skill.`,
      emotion: 'proud',
      variation_id: 'implementation_v1'
    }],
    choices: [
      {
        choiceId: 'p2_student_reactions',
        text: "How did students react to the changes?",
        nextNodeId: 'yaquin_p2_student_reactions',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'execution']
  },

  {
    nodeId: 'yaquin_p2_student_reactions',
    speaker: 'Yaquin',
    content: [{
      text: `Mixed.

Some students who got refunds left 1-star reviews: "Bait and switch. Changed the program after I enrolled."

Some students who stayed are thriving: "Finally feels like real teaching, not just videos."

*He pulls up a message.*

**Student message**: "Yaquin, I almost quit. But the cohort program saved me. I'm getting hired next week because of what you taught me."

*He looks at you.*

That's why I'm doing this. Not the revenue. Not the validation. That message.`,
      emotion: 'fulfilled',
      variation_id: 'reactions_v1'
    }],
    choices: [
      {
        choiceId: 'p2_dds_outcome',
        text: "What happened with Dr. Chen?",
        nextNodeId: 'yaquin_p2_dds_outcome',
        pattern: 'exploring',
        skills: ['curiosity']
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'impact']
  },

  {
    nodeId: 'yaquin_p2_dds_outcome',
    speaker: 'Yaquin',
    content: [{
      text: `*He laughs.*

Dr. Chen reviewed my curriculum. Tore it apart. "This module is outdated. This technique is wrong. This explanation is too simplified."

She was brutal.

*He grins.*

And she was right. I updated everything she flagged.

Then she said: "You know what you're missing? The why. You teach the how, but students need to understand why we do it this way."

*He nods.*

So now she's a paid consultant. She reviews my content. I cite her as a clinical advisor.

Critics can become collaborators if you're humble enough to listen.`,
      emotion: 'wise',
      variation_id: 'dds_outcome_v1'
    }],
    choices: [
      {
        choiceId: 'p2_operational_wisdom',
        text: "You've learned to operate at scale.",
        nextNodeId: 'yaquin_p2_operational_wisdom',
        pattern: 'analytical',
        skills: ['strategicThinking']
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'collaboration']
  },

  {
    nodeId: 'yaquin_p2_operational_wisdom',
    speaker: 'Yaquin',
    content: [{
      text: `A month ago, I thought running a course was about great content.

Now I know it's about:
- Customer service (support tickets, refunds, communication)
- Product iteration (v1 → v2 → v3)
- Strategic execution (cohorts, licensing, scaling)
- Operational systems (forums, office hours, feedback loops)

*He looks at his setup.*

I'm not just a teacher. I'm an educator-entrepreneur.

Teaching is the craft. Running a course business is the skill.

And the best part? Every problem is data. Every refund is a lesson. Every 1-star review tells me what to improve.`,
      emotion: 'confident',
      variation_id: 'wisdom_v1'
    }],
    choices: [
      {
        choiceId: 'p2_reflection',
        text: "You've become what you needed when you started.",
        nextNodeId: 'yaquin_p2_reflection',
        pattern: 'helping',
        skills: ['emotionalIntelligence']
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'wisdom']
  },

  {
    nodeId: 'yaquin_p2_reflection',
    speaker: 'Yaquin',
    content: [{
      text: `When I started, I was a dental assistant who thought the textbooks were garbage.

Now I'm a course creator who knows that great content is only 20% of the work.

The other 80%? Operations. Strategy. Communication. Resilience.

*He smiles.*

I'm teaching 200+ students now. Some will finish. Some will quit. Some will leave bad reviews.

And I'm okay with that.

Because the ones who succeed? They'll know things the textbooks never taught them.

Just like I did.`,
      emotion: 'peaceful',
      variation_id: 'reflection_v1'
    }],
    choices: [
      {
        choiceId: 'p2_complete',
        text: "Class is definitely in session.",
        nextNodeId: 'yaquin_p2_complete',
        pattern: 'helping',
        skills: ['encouragement']
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'growth']
  },

  {
    nodeId: 'yaquin_p2_complete',
    speaker: 'Yaquin',
    content: [{
      text: `Thank you. For being here when it got messy.

*He starts packing up his recording equipment.*

I have a cohort starting Monday. Twenty students. Live sessions. Real teaching.

If you see Samuel, tell him... tell him I'm not just teaching skills anymore. I'm building a business that teaches.`,
      emotion: 'grateful',
      variation_id: 'complete_v1'
    }],
    choices: [
      {
        choiceId: 'return_to_samuel_yaquin_p2',
        text: "Return to Samuel",
        nextNodeId: samuelEntryPoints.YAQUIN_REFLECTION_GATEWAY,
        pattern: 'exploring'
      }
    ],
    tags: ['phase2', 'yaquin_arc', 'completion']
  }
]

export const yaquinEntryPoints = {
  INTRODUCTION: 'yaquin_introduction',
  PHASE2_ENTRY: 'yaquin_phase2_entry'
} as const

export const yaquinDialogueGraph: DialogueGraph = {
  version: '1.0.0',
  nodes: new Map(yaquinDialogueNodes.map(node => [node.nodeId, node])),
  startNodeId: yaquinEntryPoints.INTRODUCTION,
  metadata: {
    title: "Yaquin's Course",
    author: 'Guided Generation',
    createdAt: Date.now(),
    lastModified: Date.now(),
    totalNodes: yaquinDialogueNodes.length,
    totalChoices: yaquinDialogueNodes.reduce((sum, n) => sum + n.choices.length, 0)
  }
}