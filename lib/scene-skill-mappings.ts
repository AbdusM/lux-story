/**
 * Scene-Skill Mappings for Grand Central Terminus
 * Evidence-based skill demonstration tracking across narrative arcs
 *
 * These mappings connect specific narrative moments to 2030 Skills demonstrations,
 * providing rich context for counselor dashboards and student self-reflection.
 */

import { FutureSkills } from './2030-skills-system'

export interface SceneSkillMapping {
  sceneId: string
  characterArc: 'maya' | 'devon' | 'jordan' | 'samuel'
  sceneDescription: string

  // Map specific choice IDs to skill demonstrations
  choiceMappings: {
    [choiceId: string]: {
      skillsDemonstrated: (keyof FutureSkills)[]
      context: string
      intensity: 'high' | 'medium' | 'low'
    }
  }
}

/**
 * TOP 30 IMPACTFUL NARRATIVE MOMENTS
 *
 * Selection Criteria:
 * - Trust-gate moments (breakthrough vulnerability)
 * - Character revelation scenes (authentic backstory sharing)
 * - Crossroads decision points (major life choices)
 * - Mentorship moments (wisdom transfer)
 * - Skill synthesis moments (multiple competencies demonstrated)
 *
 * Coverage: 30 of 151 total scenes (20%)
 */
export const SCENE_SKILL_MAPPINGS: Record<string, SceneSkillMapping> = {

  // ============= MAYA ARC (7 scenes) =============

  // SCENE 1: Family Expectations vs Personal Passion
  'maya_family_pressure': {
    sceneId: 'maya_family_pressure',
    characterArc: 'maya',
    sceneDescription: 'Maya reveals tension between 20 years of immigrant family sacrifice and her authentic passion for robotics',

    choiceMappings: {
      'family_understanding': {
        skillsDemonstrated: ['emotionalIntelligence', 'culturalCompetence', 'communication', 'criticalThinking'],
        context: 'Reframed parental sacrifice from "obligation to fulfill their vision" to "investment in student\'s happiness and authentic success." Demonstrated cultural competence by honoring immigrant family dynamics while validating competing need for personal identity. Critical thinking shown in distinguishing between fulfilling parents\' expectations vs. honoring their deeper intention.',
        intensity: 'high'
      },

      'family_challenge': {
        skillsDemonstrated: ['criticalThinking', 'communication', 'emotionalIntelligence', 'leadership'],
        context: 'Posed fundamental question about life agency and autonomous identity formation. Challenged cultural obligation narrative without dismissing its validity. Leadership demonstrated through willingness to speak difficult truth that shifts perspective. Emotional intelligence shown in recognizing long-term psychological cost of living someone else\'s vision.',
        intensity: 'high'
      }
    }
  },

  // SCENE 1.5: Anxiety Reveal (High Trust Moment)
  'maya_anxiety_reveal': {
    sceneId: 'maya_anxiety_reveal',
    characterArc: 'maya',
    sceneDescription: 'Maya confesses she is not studying at night but doing "something else", testing player reaction to her secret',

    choiceMappings: {
      'reveal_curious': {
        skillsDemonstrated: ['communication', 'criticalThinking'],
        context: 'Responded to vulnerability with open curiosity rather than judgment. Demonstrated communication by inviting further disclosure without pressure, and critical thinking by seeking to understand the reality behind the facade.',
        intensity: 'medium'
      },

      'reveal_support': {
        skillsDemonstrated: ['emotionalIntelligence', 'communication'],
        context: 'Validated the human need for personal interests outside of obligations. Demonstrated emotional intelligence by normalizing her struggle and providing immediate psychological safety.',
        intensity: 'medium'
      },

      'reveal_wait': {
        skillsDemonstrated: ['emotionalIntelligence', 'adaptability', 'communication'],
        context: 'Chose silence to hold space, recognizing that active questioning might feel intrusive. Demonstrated high emotional intelligence by prioritizing the relationship over information gathering. Adaptability shown in shifting from "player" to "listener" role.',
        intensity: 'high'
      }
    }
  },

  // SCENE 2: Robotics Passion Reveal (Major Trust Gate)
  'maya_robotics_passion': {
    sceneId: 'maya_robotics_passion',
    characterArc: 'maya',
    sceneDescription: 'Maya shares her secret passion for building medical robots, revealing core identity conflict between medicine and engineering',

    choiceMappings: {
      'robotics_encourage': {
        skillsDemonstrated: ['emotionalIntelligence', 'communication', 'creativity'],
        context: 'Validated passion as "gift" rather than betrayal, reframing internal conflict. Emotional intelligence demonstrated through recognizing and naming hidden self-worth beneath shame narrative. Communication skill shown in articulating value without prescribing action. Creativity in seeing robotics as legitimate form of healing contribution.',
        intensity: 'high'
      },

      'robotics_practical': {
        skillsDemonstrated: ['problemSolving', 'criticalThinking', 'creativity', 'communication'],
        context: 'Synthesized conflicting passions (medicine + robotics) into innovative hybrid solution. Problem-solving through identification of medical robotics as bridge discipline. Critical thinking in recognizing UAB biomedical engineering as specific local pathway. Creativity in proposing "both/and" rather than "either/or" framework.',
        intensity: 'high'
      },

      'robotics_birmingham': {
        skillsDemonstrated: ['problemSolving', 'communication', 'leadership', 'adaptability'],
        context: 'Connected personal passion to Birmingham ecosystem (Innovation Depot, startup community). Demonstrated geographic career awareness and local opportunity knowledge. Leadership through entrepreneurial thinking - building something new rather than following traditional path. Adaptability shown in willingness to consider non-traditional career entry point.',
        intensity: 'medium'
      }
    }
  },

  // SCENE 3: UAB Biomedical Engineering Revelation
  'maya_uab_revelation': {
    sceneId: 'maya_uab_revelation',
    characterArc: 'maya',
    sceneDescription: 'Maya discovers UAB\'s biomedical engineering program, realizing she can combine healing technology and medicine',

    choiceMappings: {
      'uab_encourage_research': {
        skillsDemonstrated: ['criticalThinking', 'problemSolving', 'digitalLiteracy', 'communication'],
        context: 'Provided concrete institutional pathway research (UAB program recognition, national standing). Digital literacy through effective use of online educational resources. Problem-solving by identifying specific bridge between current trajectory and desired field. Communication skill in translating research findings into actionable intelligence.',
        intensity: 'high'
      },

      'uab_validate_feeling': {
        skillsDemonstrated: ['emotionalIntelligence', 'communication', 'creativity', 'problemSolving'],
        context: 'Recognized and named moment of synthesis - "bridge between both worlds." Emotional intelligence in acknowledging significance of finding hybrid identity solution. Creativity in seeing biomedical engineering as validation of dual passion. Problem-solving through confirmation that complex identity conflicts can have structural solutions.',
        intensity: 'high'
      }
    }
  },

  // SCENE 4: Strategic Family Communication Planning
  'maya_actionable_path': {
    sceneId: 'maya_actionable_path',
    characterArc: 'maya',
    sceneDescription: 'Maya develops strategic approach to presenting biomedical engineering to parents as "innovation in medicine"',

    choiceMappings: {
      'support_strategy': {
        skillsDemonstrated: ['communication', 'culturalCompetence', 'emotionalIntelligence', 'problemSolving'],
        context: 'Crafted culturally competent messaging that honors family values while introducing new information. Communication strategy demonstrated through framing (innovation in medicine vs. abandoning medicine). Emotional intelligence in anticipating parental concerns and addressing them proactively. Problem-solving through rhetorical approach that creates space for new possibility within existing value system.',
        intensity: 'high'
      }
    }
  },

  // SCENE 5: Crossroads Decision (Trust 10 Moment)
  'maya_crossroads': {
    sceneId: 'maya_crossroads',
    characterArc: 'maya',
    sceneDescription: 'Maya faces ultimate decision between traditional pre-med, biomedical engineering hybrid, or continued exploration',

    choiceMappings: {
      'crossroads_robotics': {
        skillsDemonstrated: ['leadership', 'leadership', 'communication', 'adaptability'],  // courage → leadership
        context: 'Chose authentic passion despite cultural and family pressure. Leadership through autonomous decision-making in high-stakes situation. Courage in accepting potential family disappointment. Adaptability shown in willingness to change established path based on self-knowledge. Communication commitment to transparency with family rather than deception.',
        intensity: 'high'
      },

      'crossroads_hybrid': {
        skillsDemonstrated: ['problemSolving', 'creativity', 'criticalThinking', 'culturalCompetence'],
        context: 'Selected strategic synthesis path that honors multiple stakeholder needs (self + family). Problem-solving through identification of structural solution to identity conflict. Creativity in hybrid discipline selection. Critical thinking shown in evaluating trade-offs of different paths. Cultural competence in navigating first-generation expectations without sacrificing authenticity.',
        intensity: 'high'
      },

      'crossroads_support': {
        skillsDemonstrated: ['emotionalIntelligence', 'timeManagement', 'adaptability', 'criticalThinking'],  // patience → timeManagement
        context: 'Chose continued exploration over premature commitment. Emotional intelligence in recognizing need for more information and self-discovery time. Patience with ambiguity rather than forced resolution. Adaptability through comfort with non-linear path. Critical thinking in distinguishing between "needing answer now" vs. "needing space to discover answer."',
        intensity: 'medium'
      }
    }
  },

  // SCENE 6 (Maya): Early Deflection - Passion Guarded
  'maya_deflect_passion': {
    sceneId: 'maya_deflect_passion',
    characterArc: 'maya',
    sceneDescription: 'Player encounters Maya deflecting questions about her authentic interests, showing early trust-building opportunity',

    choiceMappings: {
      'deflect_respect': {
        skillsDemonstrated: ['emotionalIntelligence', 'timeManagement', 'communication'],
        context: 'Recognized emotional guardedness and responded with patience rather than pressure. Demonstrated emotional intelligence by understanding need for safety before vulnerability. Time management through recognizing relationship-building requires gradual trust, not immediate revelation. Communication through non-verbal respect (quiet nod).',
        intensity: 'medium'
      },

      'deflect_curiosity': {
        skillsDemonstrated: ['emotionalIntelligence', 'communication', 'adaptability'],
        context: 'Showed genuine curiosity while respecting boundaries. Emotional intelligence in balancing interest with respect for privacy. Communication through open-ended questions that invite rather than demand. Adaptability in adjusting approach when sensing resistance.',
        intensity: 'medium'
      }
    }
  },

  // SCENE 7 (Maya): Reframing Sacrifice - Obligation vs. Investment
  'maya_reframes_sacrifice': {
    sceneId: 'maya_reframes_sacrifice',
    characterArc: 'maya',
    sceneDescription: 'Critical moment where player helps Maya distinguish between obligation to fulfill parents\' specific vision vs. honoring their deeper intention for her happiness',

    choiceMappings: {
      'reframe_investment': {
        skillsDemonstrated: ['criticalThinking', 'emotionalIntelligence', 'communication', 'culturalCompetence'],
        context: 'Reframed 20 years of sacrifice from "debt to repay with medical career" to "investment in daughter\'s authentic success and happiness." Critical thinking in separating means (medical career) from ends (meaningful life). Emotional intelligence in validating both family love and personal identity needs. Cultural competence in navigating immigrant family dynamics with respect.',
        intensity: 'high'
      },

      'reframe_exploration': {
        skillsDemonstrated: ['adaptability', 'criticalThinking', 'timeManagement'],
        context: 'Suggested exploration before commitment as honoring family investment, not betraying it. Adaptability in viewing career exploration as prudent rather than indecisive. Critical thinking in distinguishing between respecting parents and needing their permission for every choice. Time management through recognizing value of exploration phase.',
        intensity: 'high'
      }
    }
  },

  // SCENE: Marcus ECMO Simulation
  'marcus_simulation_start': {
    sceneId: 'marcus_simulation_start',
    characterArc: 'maya', // Linked to Maya's biomed theme
    sceneDescription: 'High-stakes ECMO simulation requiring precision and crisis management',

    choiceMappings: {
      'sim_clamp_line': {
        skillsDemonstrated: ['crisisManagement', 'decisiveness', 'systemsThinking'],
        context: 'Demonstrated immediate crisis response by identifying the priority action (stopping flow) over communication in a critical 1.5s window.',
        intensity: 'high'
      },
      'sim_call_help': {
        skillsDemonstrated: ['communication'],
        context: 'Prioritized communication, which is valid in many settings but fatal in this specific rapid-response scenario.',
        intensity: 'medium'
      }
    }
  },

  // ============= DEVON ARC (7 scenes) =============

  // SCENE 6: Father Grief System Revelation
  'devon_father_reveal': {
    sceneId: 'devon_father_reveal',
    characterArc: 'devon',
    sceneDescription: 'Devon reveals he built conversational flowchart system to help grieving father after mother\'s death',

    choiceMappings: {
      'express_sympathy': {
        skillsDemonstrated: ['emotionalIntelligence', 'communication', 'emotionalIntelligence'],  // empathy → emotionalIntelligence
        context: 'Offered direct emotional acknowledgment ("I\'m sorry about your mom") without problem-solving or intellectualizing grief. Emotional intelligence through recognition that some situations require witnessing, not fixing. Communication skill in expressing condolence simply and authentically. Demonstrated understanding that empathy precedes analysis in moments of loss.',
        intensity: 'high'
      },

      'ask_about_system': {
        skillsDemonstrated: ['criticalThinking', 'communication', 'emotionalIntelligence'],
        context: 'Respected Devon\'s coping mechanism (systems thinking) while gently probing its effectiveness. Critical thinking shown in analytical approach to understanding his problem-solving strategy. Communication through non-judgmental questioning. Emotional intelligence in recognizing that asking about system is safer entry point than confronting grief directly.',
        intensity: 'medium'
      }
    }
  },

  // SCENE 7: NASA Father Career Context (Birmingham Integration)
  'devon_father_aerospace': {
    sceneId: 'devon_father_aerospace',
    characterArc: 'devon',
    sceneDescription: 'Devon describes father\'s NASA aerospace engineering career in Huntsville, revealing inherited systems thinking',

    choiceMappings: {
      'ask_devon_engineering': {
        skillsDemonstrated: ['criticalThinking', 'communication', 'culturalCompetence'],
        context: 'Connected Devon\'s career choice to family legacy and identity formation. Critical thinking in recognizing intergenerational pattern of engineering as emotional language. Communication through gentle exploration of motivation. Cultural competence in understanding career as inherited family value system.',
        intensity: 'medium'
      },

      'comment_on_similarity': {
        skillsDemonstrated: ['criticalThinking', 'emotionalIntelligence', 'communication', 'problemSolving'],
        context: 'Identified parallel between father\'s rocket debugging and Devon\'s conversational debugging. Critical thinking through pattern recognition across domains. Emotional intelligence in seeing that Devon is trying to connect with father using shared professional language. Problem-solving insight that both are approaching relationship as technical system. Communication of profound observation without judgment.',
        intensity: 'high'
      }
    }
  },

  // SCENE 8: UAB Systems Engineering + Southern Company Context
  'devon_uab_systems_engineering': {
    sceneId: 'devon_uab_systems_engineering',
    characterArc: 'devon',
    sceneDescription: 'Devon discusses UAB capstone on distributed system error detection, Southern Company DevOps opportunity',

    choiceMappings: {
      'encourage_capstone': {
        skillsDemonstrated: ['communication', 'emotionalIntelligence', 'communication'],  // encouragement → communication
        context: 'Validated Devon\'s technical competency and professional trajectory separate from personal struggle. Communication through genuine interest in academic work. Emotional intelligence in recognizing that affirming professional identity provides stable ground during emotional vulnerability. Encouragement without conflating technical success with emotional resolution.',
        intensity: 'medium'
      },

      'connect_to_dad': {
        skillsDemonstrated: ['problemSolving', 'emotionalIntelligence', 'creativity', 'communication'],
        context: 'Proposed using shared technical language (system failures) as bridge to emotional connection. Problem-solving through reframe: don\'t abandon systems thinking, redirect it toward connection. Creativity in suggesting error detection capstone as conversation starter with father. Emotional intelligence in recognizing engineering is their love language, not obstacle to intimacy.',
        intensity: 'high'
      }
    }
  },

  // SCENE 9: System Failure Confession
  'devon_system_failure': {
    sceneId: 'devon_system_failure',
    characterArc: 'devon',
    sceneDescription: 'Devon admits conversational flowchart failed catastrophically - father said he sounded scripted, not present',

    choiceMappings: {
      'validate_pain': {
        skillsDemonstrated: ['emotionalIntelligence', 'communication', 'emotionalIntelligence'],  // empathy → emotionalIntelligence
        context: 'Named emotional impact ("that must have hurt") without rushing to fix or minimize. Emotional intelligence through recognition that technical failure represented relationship failure, causing double shame. Communication skill in validating pain before analysis. Empathy demonstrated by sitting with discomfort rather than solving away from it.',
        intensity: 'high'
      },

      'analyze_failure': {
        skillsDemonstrated: ['criticalThinking', 'problemSolving', 'communication'],
        context: 'Respected Devon\'s analytical coping style by examining system failure rather than bypassing to emotion. Critical thinking in asking diagnostic question about failure mode. Problem-solving through collaborative root-cause analysis. Communication strategy that meets person in their preferred problem-solving modality before introducing alternative frame.',
        intensity: 'medium'
      }
    }
  },

  // SCENE 10: Crossroads - Integration of Logic and Emotion
  'devon_crossroads': {
    sceneId: 'devon_crossroads',
    characterArc: 'devon',
    sceneDescription: 'Devon faces choice: call father with integrated approach, lead with heart, or simply be present',

    choiceMappings: {
      'crossroads_integrated': {
        skillsDemonstrated: ['problemSolving', 'creativity', 'emotionalIntelligence', 'adaptability'],
        context: 'Chose to synthesize engineering identity with emotional capacity ("both/and" framework). Problem-solving through rejection of false binary (logic OR emotion). Creativity in proposing integrated systems thinking that includes emotions as valid data. Emotional intelligence in recognizing that abandoning analytical identity isn\'t required for emotional connection. Adaptability in expanding self-concept.',
        intensity: 'high'
      },

      'crossroads_emotional': {
        skillsDemonstrated: ['leadership', 'emotionalIntelligence', 'communication', 'emotionalIntelligence'],  // courage → leadership, vulnerability → emotionalIntelligence
        context: 'Committed to leading with emotion and vulnerability ("tell him I miss mom too"). Courage in choosing authenticity over control. Emotional intelligence through willingness to experience and express grief without management system. Communication choice to prioritize truth over optimization. Vulnerability as conscious strategy for intimacy.',
        intensity: 'high'
      },

      'crossroads_support': {
        skillsDemonstrated: ['emotionalIntelligence', 'timeManagement', 'emotionalIntelligence', 'communication'],  // patience → timeManagement, presence → emotionalIntelligence
        context: 'Chose presence as action ("just be there"). Emotional intelligence in understanding that witnessing grief is different from fixing grief. Patience with non-instrumental relationship time. Presence as active practice, not passive default. Communication insight that silence can carry more meaning than optimized words.',
        intensity: 'high'
      }
    }
  },

  // SCENE 11 (Devon): Admits Hurt - Vulnerability Breakthrough
  'devon_admits_hurt': {
    sceneId: 'devon_admits_hurt',
    characterArc: 'devon',
    sceneDescription: 'Devon admits social struggles hurt deeply, breaking through defensive "I don\'t need people" narrative',

    choiceMappings: {
      'validate_hurt': {
        skillsDemonstrated: ['emotionalIntelligence', 'communication', 'culturalCompetence'],
        context: 'Validated that social exclusion causes real pain, not weakness. Emotional intelligence in recognizing defensive coping mechanisms (isolation as protection). Communication through acknowledging pain without trying to fix it immediately. Cultural competence in understanding neurodivergent social experiences.',
        intensity: 'high'
      },

      'reframe_strength': {
        skillsDemonstrated: ['emotionalIntelligence', 'communication', 'leadership'],
        context: 'Reframed vulnerability as strength, not liability. Emotional intelligence in distinguishing between "not needing people" (defense) and "choosing solitude" (preference). Communication in normalizing emotional complexity. Leadership in modeling that authentic connection requires showing hurt.',
        intensity: 'high'
      }
    }
  },

  // SCENE 12 (Devon): Collaborative Building Moment
  'devon_collaborative_project': {
    sceneId: 'devon_collaborative_project',
    characterArc: 'devon',
    sceneDescription: 'Devon discovers joy in collaborative building after years of solitary work, challenges "systems don\'t need people" belief',

    choiceMappings: {
      'celebrate_collaboration': {
        skillsDemonstrated: ['collaboration', 'emotionalIntelligence', 'adaptability', 'problemSolving'],
        context: 'Recognized collaborative building as different from forced social interaction. Collaboration skill in experiencing shared problem-solving. Emotional intelligence in acknowledging fear of dependence vs. joy of partnership. Adaptability in revising "I work better alone" identity. Problem-solving enhancement through diverse perspectives.',
        intensity: 'medium'
      },

      'acknowledge_shift': {
        skillsDemonstrated: ['emotionalIntelligence', 'criticalThinking', 'adaptability'],
        context: 'Acknowledged cognitive dissonance between "systems are pure" belief and collaborative joy. Emotional intelligence in sitting with identity evolution discomfort. Critical thinking in evaluating beliefs against lived experience. Adaptability in considering revised self-concept.',
        intensity: 'medium'
      }
    }
  },

  // ============= JORDAN ARC (8 scenes) =============

  // SCENE 11: Seven Jobs Impostor Syndrome Introduction (Part 2 only - Part 1 has no choices)
  'jordan_mentor_context_pt2': {
    sceneId: 'jordan_mentor_context_pt2',
    characterArc: 'jordan',
    sceneDescription: 'Jordan reveals impostor syndrome before Career Day speech - seven jobs feel like failures, not learning',

    choiceMappings: {
      'jordan_mentor_ask_fear': {
        skillsDemonstrated: ['emotionalIntelligence', 'communication', 'criticalThinking'],
        context: 'Asked diagnostic question ("what are you really afraid they\'ll think?") that surfaces underlying belief system. Emotional intelligence in recognizing stated anxiety (impostor syndrome) vs. core fear (fraudulence). Communication through precise questioning that invites depth. Critical thinking in distinguishing symptom from root cause.',
        intensity: 'high'
      },

      'jordan_mentor_challenge_frame': {
        skillsDemonstrated: ['criticalThinking', 'communication', 'problemSolving', 'leadership'],  // courage → leadership
        context: 'Directly challenged narrative framework ("you\'re telling yourself wrong story about those seven jobs"). Critical thinking through identification of faulty premise. Communication courage in naming self-deception pattern. Problem-solving insight that story revision, not evidence accumulation, resolves impostor syndrome. Demonstrated that external validation won\'t fix internal narrative flaw.',
        intensity: 'high'
      },

      'jordan_mentor_analyze_voice': {
        skillsDemonstrated: ['criticalThinking', 'emotionalIntelligence', 'communication', 'criticalThinking'],  // metacognition → criticalThinking
        context: 'Used metacognitive questioning ("whose voice is that really?") to externalize internalized critic. Critical thinking through voice attribution analysis. Emotional intelligence in recognizing that self-criticism often echoes external source. Communication strategy that creates distance between Jordan and her self-judgment. Metacognitive skill in examining thinking patterns about thinking.',
        intensity: 'high'
      }
    }
  },

  // SCENE 12: Impostor Syndrome Revelation (Trust 9)
  'jordan_impostor_reveal': {
    sceneId: 'jordan_impostor_reveal',
    characterArc: 'jordan',
    sceneDescription: 'Jordan shares mother\'s worried text ("Another one?"), revealing source of impostor narrative',

    choiceMappings: {
      'jordan_impostor_ask_real': {
        skillsDemonstrated: ['problemSolving', 'communication', 'emotionalIntelligence', 'creativity'],
        context: 'Bypassed validation ("you\'re not a fraud") to ask productive question: "What would you tell students if you believed your story was real?" Problem-solving through reframe from defensive posture to mentorship possibility. Communication that assumes truth of positive frame. Emotional intelligence in recognizing validation alone won\'t shift belief. Creativity in future-self perspective-taking.',
        intensity: 'high'
      },

      'jordan_impostor_affirm': {
        skillsDemonstrated: ['communication', 'emotionalIntelligence', 'communication'],  // encouragement → communication
        context: 'Offered direct affirmation ("you\'re the most qualified person to give this talk"). Communication through unambiguous positive assessment. Emotional intelligence in recognizing Jordan needs external reality check on internal distortion. Encouragement without minimizing her fear. Simple truth-telling as intervention.',
        intensity: 'medium'
      },

      'jordan_impostor_reframe': {
        skillsDemonstrated: ['criticalThinking', 'communication', 'problemSolving', 'creativity'],
        context: 'Reframed "luck" as "preparation meets opportunity" - attributed success to Jordan\'s agency. Critical thinking through causal analysis of career progression. Communication using memorable aphorism that shifts attribution. Problem-solving by revealing Jordan as active creator, not passive recipient. Creativity in linguistic reframe that changes meaning of same events.',
        intensity: 'high'
      }
    }
  },

  // SCENE 13: Crossroads - Choosing Narrative Frame
  'jordan_crossroads': {
    sceneId: 'jordan_crossroads',
    characterArc: 'jordan',
    sceneDescription: 'Jordan must choose which story to tell students: accumulation asset, Birmingham adaptability, or internal validation',

    choiceMappings: {
      'jordan_crossroads_accumulation': {
        skillsDemonstrated: ['problemSolving', 'creativity', 'communication', 'leadership'],
        context: 'Chose "accumulation" frame - seven jobs as intentional skill-building across disciplines. Problem-solving through narrative synthesis that gives meaning to apparent chaos. Creativity in seeing sales empathy → UX research, graphic design → interface, etc. Communication strategy that teaches students to connect dots backward. Leadership through modeling non-linear success story.',
        intensity: 'high'
      },

      'jordan_crossroads_birmingham': {
        skillsDemonstrated: ['criticalThinking', 'culturalCompetence', 'communication', 'creativity'],
        context: 'Chose "Birmingham adaptability" frame - seven jobs mirror city\'s reinvention from steel to tech. Critical thinking through macro-level pattern recognition (personal trajectory reflects geographic narrative). Cultural competence in connecting individual path to regional economic history. Communication that contextualizes career within place-based story. Creativity in using city as metaphor for professional identity.',
        intensity: 'high'
      },

      'jordan_crossroads_internal': {
        skillsDemonstrated: ['emotionalIntelligence', 'leadership', 'communication', 'emotionalIntelligence'],  // courage → leadership, authenticity → emotionalIntelligence
        context: 'Chose "internal validation" frame - story you tell yourself matters most. Emotional intelligence in recognizing that external validation feeds impostor cycle. Courage to teach students about rejecting others\' definitions of success. Communication choice to model vulnerability over polish. Authenticity as pedagogical strategy - teaching through raw honesty rather than curated narrative.',
        intensity: 'high'
      }
    }
  },

  // SCENE 14: Accumulation Frame Ending
  'jordan_chooses_accumulation': {
    sceneId: 'jordan_chooses_accumulation',
    characterArc: 'jordan',
    sceneDescription: 'Jordan commits to writing all seven jobs on whiteboard, drawing connection lines between skills',

    choiceMappings: {
      'jordan_accumulation_celebrate': {
        skillsDemonstrated: ['communication', 'problemSolving', 'creativity', 'leadership'],
        context: 'Affirmed that "nothing is wasted" narrative serves students facing their own winding paths. Communication affirmation of pedagogical approach. Problem-solving recognition that students need permission for non-linear trajectories. Creativity in visual strategy (whiteboard lines connecting jobs). Leadership through modeling integration of messy past into coherent present.',
        intensity: 'medium'
      }
    }
  },

  // SCENE 15: Birmingham Frame Ending
  'jordan_chooses_birmingham': {
    sceneId: 'jordan_chooses_birmingham',
    characterArc: 'jordan',
    sceneDescription: 'Jordan plans to show city map with all job locations, teaching Birmingham as metaphor for career reinvention',

    choiceMappings: {
      'jordan_birmingham_affirm': {
        skillsDemonstrated: ['communication', 'creativity', 'culturalCompetence', 'leadership'],
        context: 'Validated power of place-based identity narrative and geographic metaphor for student learning. Communication recognition of storytelling strategy. Creativity in geographic visualization approach (city map of career). Cultural competence in teaching Birmingham\'s adaptive capacity as model. Leadership through connection of personal story to civic narrative.',
        intensity: 'medium'
      }
    }
  },

  // SCENE 16 (Jordan): Job Reveal 1 - First Career Path Exploration
  'jordan_job_reveal_1': {
    sceneId: 'jordan_job_reveal_1',
    characterArc: 'jordan',
    sceneDescription: 'Jordan shares first job experience, beginning seven-job narrative that frames non-linear paths as exploration rather than failure',

    choiceMappings: {
      'affirm_learning': {
        skillsDemonstrated: ['adaptability', 'emotionalIntelligence', 'communication'],
        context: 'Reframed "failed job" as "learning experience" in career exploration. Adaptability in recognizing value of diverse experiences. Emotional intelligence in validating exploration anxiety. Communication in normalizing non-linear career paths.',
        intensity: 'low'
      },

      'ask_insight': {
        skillsDemonstrated: ['criticalThinking', 'communication', 'emotionalIntelligence'],
        context: 'Asked what Jordan learned from experience rather than why they left. Critical thinking in seeking growth insights. Communication through curiosity over judgment. Emotional intelligence in avoiding shame-based questioning.',
        intensity: 'low'
      }
    }
  },

  // SCENE 17 (Jordan): Mentor Wisdom - Pattern Recognition
  'jordan_mentor_wisdom': {
    sceneId: 'jordan_mentor_wisdom',
    characterArc: 'jordan',
    sceneDescription: 'Jordan shares mentorship insight about pattern recognition across diverse experiences, teaching transferable skills concept',

    choiceMappings: {
      'recognize_pattern': {
        skillsDemonstrated: ['criticalThinking', 'adaptability', 'communication', 'leadership'],
        context: 'Recognized transferable skills pattern across Jordan\'s seven jobs. Critical thinking in identifying common threads. Adaptability in understanding skills transcend specific roles. Communication in articulating meta-learning. Leadership through teaching pattern recognition as career strategy.',
        intensity: 'high'
      },

      'apply_self': {
        skillsDemonstrated: ['emotionalIntelligence', 'criticalThinking', 'adaptability'],
        context: 'Applied Jordan\'s pattern recognition to own experience. Emotional intelligence in self-reflection. Critical thinking in identifying personal transferable skills. Adaptability through revised self-concept from narrow to broad competence.',
        intensity: 'medium'
      }
    }
  },

  // SCENE 18 (Jordan): Internal Choice - Self-Awareness Path
  'jordan_internal_choice': {
    sceneId: 'jordan_internal_choice',
    characterArc: 'jordan',
    sceneDescription: 'Jordan chooses internal validation over external metrics, demonstrating mature career identity beyond resume accumulation',

    choiceMappings: {
      'affirm_internal': {
        skillsDemonstrated: ['emotionalIntelligence', 'leadership', 'criticalThinking', 'adaptability'],
        context: 'Affirmed choosing work for internal resonance over external validation. Emotional intelligence in prioritizing values alignment. Leadership in modeling intrinsic motivation. Critical thinking in questioning conventional success metrics. Adaptability through comfort with non-traditional path.',
        intensity: 'high'
      },

      'acknowledge_courage': {
        skillsDemonstrated: ['emotionalIntelligence', 'communication', 'leadership'],
        context: 'Acknowledged courage required to resist external pressure. Emotional intelligence in recognizing value-driven choices as brave. Communication in normalizing internal-external tension. Leadership through validation of authentic career choices.',
        intensity: 'medium'
      }
    }
  },

  // ============= JORDAN ARC CONTINUED (4 additional scenes) =============

  // SCENE 19 (Jordan): Job Reveal 2 - Galleria Sales to User Research
  'jordan_job_reveal_2': {
    sceneId: 'jordan_job_reveal_2',
    characterArc: 'jordan',
    sceneDescription: 'Jordan shares Galleria phone sales experience, learning to read people in three seconds - applied empathy foundation',

    choiceMappings: {
      'jordan_job2_validate_skill': {
        skillsDemonstrated: ['emotionalIntelligence', 'communication', 'adaptability'],
        context: 'Validated that reading people quickly is valuable transferable skill. Emotional intelligence in recognizing social perception as professional competency. Communication in affirming skill value without dismissing humble origins. Adaptability shown in understanding that retail teaches user research fundamentals.',
        intensity: 'medium'
      },

      'jordan_job2_connect_ux': {
        skillsDemonstrated: ['criticalThinking', 'problemSolving', 'creativity', 'communication'],
        context: 'Connected "applied empathy" in retail to UX design methodology. Critical thinking through pattern recognition across disciplines. Problem-solving by identifying structural similarity between customer service and user research. Creativity in linguistic bridge ("applied empathy"). Communication skill in articulating transferable competency.',
        intensity: 'high'
      }
    }
  },

  // SCENE 20 (Jordan): Job Reveal 5 - Personal Trainer as Experience Designer
  'jordan_job_reveal_5': {
    sceneId: 'jordan_job_reveal_5',
    characterArc: 'jordan',
    sceneDescription: 'Jordan reveals personal training work, recognizing trainers as motivation psychologists designing experiences that build belief',

    choiceMappings: {
      'jordan_job5_validate_insight': {
        skillsDemonstrated: ['criticalThinking', 'emotionalIntelligence', 'creativity', 'problemSolving'],
        context: 'Recognized deep pattern underneath job title - personal training as motivation psychology. Critical thinking in seeing abstract principle across concrete role. Emotional intelligence in understanding belief-building as core competency. Creativity through reframe of fitness work as experience design. Problem-solving insight that user motivation transcends specific domain.',
        intensity: 'high'
      },

      'jordan_job5_pattern_thread': {
        skillsDemonstrated: ['criticalThinking', 'adaptability', 'communication', 'creativity'],
        context: 'Identified that Jordan has been doing UX design throughout career, just changing medium. Critical thinking through meta-pattern recognition. Adaptability in understanding skills transcend job titles. Communication in naming invisible thread. Creativity in synthesis: not job-hopping, but iterative skill development in different contexts.',
        intensity: 'high'
      }
    }
  },

  // SCENE 21 (Jordan): Job Reveal 6 - Uber as Systems Education
  'jordan_job_reveal_6': {
    sceneId: 'jordan_job_reveal_6',
    characterArc: 'jordan',
    sceneDescription: 'Jordan shares Uber driving experience as Birmingham education - learning city systems, logistics, route optimization, human stories',

    choiceMappings: {
      'jordan_job6_validate_learning': {
        skillsDemonstrated: ['adaptability', 'criticalThinking', 'emotionalIntelligence', 'leadership'],
        context: 'Reframed "survival work" as intentional education. Adaptability in extracting learning from economic necessity. Critical thinking in recognizing systems thinking development. Emotional intelligence in hearing hundreds of passenger stories. Leadership through growth mindset - seeing every experience as teacher.',
        intensity: 'high'
      },

      'jordan_job6_pattern_systems': {
        skillsDemonstrated: ['problemSolving', 'criticalThinking', 'digitalLiteracy', 'communication'],
        context: 'Recognized Uber as systems thinking education - people movement through spaces and experiences. Problem-solving through route optimization and logistics learning. Critical thinking in pattern recognition across city geography. Digital literacy in platform economics understanding. Communication in identifying transferable skill to user journey mapping.',
        intensity: 'high'
      }
    }
  },

  // SCENE 22 (Jordan): Mentor Wisdom - Teaching Transferable Skills
  'jordan_mentor_wisdom_new': {
    sceneId: 'jordan_mentor_wisdom_new',
    characterArc: 'jordan',
    sceneDescription: 'Jordan shares mentorship wisdom about pattern recognition across diverse experiences, teaching transferable skills concept',

    choiceMappings: {
      'recognize_pattern': {
        skillsDemonstrated: ['criticalThinking', 'adaptability', 'communication', 'leadership'],
        context: 'Recognized transferable skills pattern across Jordan\'s seven jobs. Critical thinking in meta-level analysis. Adaptability through understanding competencies transcend roles. Communication in naming pattern clearly. Leadership in teaching career strategy: seek patterns, not just titles.',
        intensity: 'high'
      },

      'apply_self': {
        skillsDemonstrated: ['emotionalIntelligence', 'criticalThinking', 'adaptability', 'leadership'],
        context: 'Applied Jordan\'s framework to own experience, demonstrating self-awareness. Emotional intelligence through personal reflection. Critical thinking in identifying own transferable skills. Adaptability by revising self-concept from narrow specialist to broad capability set. Leadership through modeling vulnerability in learning.',
        intensity: 'high'
      }
    }
  },

  // ============= DEVON ARC CONTINUED (4 additional scenes) =============

  // SCENE 13 (Devon): Realizes Parallel - Father's Debugging Style
  'devon_realizes_parallel': {
    sceneId: 'devon_realizes_parallel',
    characterArc: 'devon',
    sceneDescription: 'Devon realizes he\'s debugging relationship with father like mission-critical system, mirroring inherited engineering approach',

    choiceMappings: {
      'suggest_shared_language': {
        skillsDemonstrated: ['emotionalIntelligence', 'problemSolving', 'communication', 'culturalCompetence'],
        context: 'Proposed engineering as shared language with father, not obstacle to connection. Emotional intelligence in recognizing technical communication as valid love language. Problem-solving through reframe: don\'t abandon systems thinking, redirect it. Communication insight that professional language can carry emotional content. Cultural competence in honoring family communication patterns.',
        intensity: 'high'
      }
    }
  },

  // SCENE 14 (Devon): Realizes Bridge - Capstone as Connection
  'devon_realizes_bridge': {
    sceneId: 'devon_realizes_bridge',
    characterArc: 'devon',
    sceneDescription: 'Devon discovers he can use distributed system error detection capstone as conversation bridge with grieving father',

    choiceMappings: {
      'support_approach': {
        skillsDemonstrated: ['emotionalIntelligence', 'creativity', 'problemSolving', 'communication'],
        context: 'Validated Devon\'s integrated approach: use shared technical interest as emotional connection pathway. Emotional intelligence in recognizing professional content can carry relational intent. Creativity in seeing capstone project as relationship-building tool. Problem-solving through synthesis of academic work and family connection. Communication affirming authentic conversation over scripted optimization.',
        intensity: 'high'
      }
    }
  },

  // SCENE 15 (Devon): Collaborative Project Discovery
  'devon_collaborative_project_new': {
    sceneId: 'devon_collaborative_project_new',
    characterArc: 'devon',
    sceneDescription: 'Devon experiences unexpected joy in collaborative building, challenging "systems don\'t need people" defensive belief',

    choiceMappings: {
      'celebrate_collaboration': {
        skillsDemonstrated: ['collaboration', 'emotionalIntelligence', 'adaptability', 'problemSolving'],
        context: 'Celebrated discovery that collaborative building differs from forced social interaction. Collaboration skill through shared technical problem-solving experience. Emotional intelligence in acknowledging fear of dependence vs. joy of partnership. Adaptability in revising "I work better alone" identity. Problem-solving enhancement recognition through diverse perspectives.',
        intensity: 'high'
      },

      'acknowledge_shift': {
        skillsDemonstrated: ['emotionalIntelligence', 'criticalThinking', 'adaptability', 'leadership'],
        context: 'Acknowledged cognitive dissonance between "systems are pure" belief and collaborative joy evidence. Emotional intelligence in sitting with identity evolution discomfort. Critical thinking by evaluating beliefs against lived experience. Adaptability through willingness to revise self-concept. Leadership in modeling evidence-based self-revision.',
        intensity: 'high'
      }
    }
  },

  // SCENE 16 (Devon): Defends Logic - People Are Variables
  'devon_people_problem': {
    sceneId: 'devon_people_problem',
    characterArc: 'devon',
    sceneDescription: 'Devon explains frustration that people are non-deterministic - same input, different outputs based on unobservable emotional state',

    choiceMappings: {
      'suggest_empathy': {
        skillsDemonstrated: ['emotionalIntelligence', 'communication', 'problemSolving', 'creativity'],
        context: 'Challenged fundamental framing: "Maybe feelings aren\'t bugs to fix." Emotional intelligence through recognizing emotions as valid data, not system errors. Communication courage in directly confronting problematic metaphor. Problem-solving reframe from debugging to understanding. Creativity in proposing integrated framework that includes emotion as feature, not bug.',
        intensity: 'high'
      }
    }
  },

  // ============= SAMUEL ARC CONTINUED (8 additional scenes) =============

  // SCENE 24 (Samuel): Teaching Witnessing - Presence Without Agenda
  'samuel_teaching_witnessing_new': {
    sceneId: 'samuel_teaching_witnessing_new',
    characterArc: 'samuel',
    sceneDescription: 'Samuel teaches difference between helping and witnessing - being present without fixing, holding space without agenda',

    choiceMappings: {
      'understand_witnessing': {
        skillsDemonstrated: ['emotionalIntelligence', 'communication', 'adaptability', 'criticalThinking'],
        context: 'Absorbed complex relational concept: witnessing as presence without intervention agenda. Emotional intelligence in understanding that "helping" often serves helper\'s discomfort, not recipient\'s need. Communication through concise articulation of nuanced distinction. Adaptability by integrating new framework for supporting others. Critical thinking in evaluating own helping motivations.',
        intensity: 'high'
      }
    }
  },

  // SCENE 25 (Samuel): Patience Wisdom - Not Knowing as Strength
  'samuel_patience_wisdom_new': {
    sceneId: 'samuel_patience_wisdom_new',
    characterArc: 'samuel',
    sceneDescription: 'Samuel teaches that not knowing is honest and courageous, refusing to let urgency override truth - foundation of coaching',

    choiceMappings: {
      'continue_from_patience': {
        skillsDemonstrated: ['emotionalIntelligence', 'criticalThinking', 'adaptability', 'timeManagement'],
        context: 'Recognized patience with uncertainty as strength, not weakness. Emotional intelligence in understanding courage required to resist external pressure for premature answers. Critical thinking through questioning cultural urgency narrative. Adaptability in comfort with ambiguity and non-linear development. Time management wisdom: exploration phase has value, rushing creates false clarity.',
        intensity: 'high'
      }
    }
  },

  // SCENE 26 (Samuel): Reflects on Maya - Reframing Strategy
  'samuel_reflects_maya_new': {
    sceneId: 'samuel_reflects_maya_new',
    characterArc: 'samuel',
    sceneDescription: 'Samuel reflects on how player helped Maya navigate family sacrifice vs. identity, teaching distinction between means and ends',

    choiceMappings: {
      'learn_reframing': {
        skillsDemonstrated: ['criticalThinking', 'emotionalIntelligence', 'culturalCompetence', 'communication'],
        context: 'Learned reframing technique: separating means (specific career) from ends (family honor/happiness). Critical thinking in identifying false binary structures. Emotional intelligence in understanding identity development complexity. Cultural competence in navigating immigrant family dynamics with respect. Communication through linguistic reframe that preserves relationship while creating autonomy.',
        intensity: 'high'
      },

      'acknowledge_complexity': {
        skillsDemonstrated: ['emotionalIntelligence', 'criticalThinking', 'communication', 'culturalCompetence'],
        context: 'Acknowledged difficulty of honoring family while pursuing authentic path. Emotional intelligence in holding competing values simultaneously without collapsing into simple answer. Critical thinking in resisting either/or thinking. Communication that normalizes complex identity negotiations. Cultural competence in validating first-generation experience.',
        intensity: 'high'
      }
    }
  },

  // SCENE 27 (Samuel): Reflects on Devon - Systems and Humanity
  'samuel_reflects_devon_new': {
    sceneId: 'samuel_reflects_devon_new',
    characterArc: 'samuel',
    sceneDescription: 'Samuel reflects on how player helped Devon integrate systems thinking with emotional connection, challenging false dichotomy',

    choiceMappings: {
      'systems_insight': {
        skillsDemonstrated: ['criticalThinking', 'problemSolving', 'emotionalIntelligence', 'collaboration'],
        context: 'Recognized systems thinking and emotional connection as complementary, not opposed. Critical thinking in identifying false dichotomy between logic and emotion. Problem-solving through integrative approach that includes both. Emotional intelligence in understanding humans need social-technical balance. Collaboration as valid system component insight.',
        intensity: 'high'
      },

      'validate_devon_growth': {
        skillsDemonstrated: ['emotionalIntelligence', 'communication', 'leadership', 'adaptability'],
        context: 'Validated Devon\'s courage in revising defensive "I don\'t need people" narrative. Emotional intelligence in recognizing coping mechanisms and their evolution. Communication through affirmation of growth. Leadership in modeling vulnerability as strength. Adaptability in celebrating identity revision.',
        intensity: 'high'
      }
    }
  },

  // SCENE 29 (Samuel): Pattern Observation - Player's Emerging Identity
  'samuel_pattern_observation_new': {
    sceneId: 'samuel_pattern_observation_new',
    characterArc: 'samuel',
    sceneDescription: 'Samuel observes player listens more than speaks, asks questions that create thinking rather than provide answers',

    choiceMappings: {
      'what_about_my_path': {
        skillsDemonstrated: ['criticalThinking', 'communication', 'emotionalIntelligence', 'adaptability'],
        context: 'Turned Samuel\'s observation into self-inquiry about personal journey. Critical thinking through self-awareness seeking. Communication via direct request for guidance. Emotional intelligence in recognizing that helping others clarify doesn\'t mean own path is clear. Adaptability in vulnerability - asking existential question without defensiveness.',
        intensity: 'high'
      },

      'accept': {
        skillsDemonstrated: ['emotionalIntelligence', 'adaptability', 'communication'],
        context: 'Received Samuel\'s observation with gratitude and integration. Emotional intelligence in accepting positive reflection without deflection or minimization. Adaptability through simply receiving without immediate need to reciprocate or redirect. Communication showing presence - being seen accurately matters. Demonstrated humility in thanking rather than analyzing.',
        intensity: 'high'
      }
    }
  },

  // SCENE 31 (Samuel): Specificity Trap - Pattern Over Position
  'samuel_specificity_trap': {
    sceneId: 'samuel_specificity_trap',
    characterArc: 'samuel',
    sceneDescription: 'Samuel teaches that asking "what specifically should I do" keeps people stuck - pattern matters more than job title',

    choiceMappings: {
      'trust_the_pattern': {
        skillsDemonstrated: ['adaptability', 'criticalThinking', 'emotionalIntelligence', 'timeManagement'],
        context: 'Chose to trust pattern development over premature specificity. Adaptability in comfort with emergence rather than forced clarity. Critical thinking through questioning need for immediate concrete answer. Emotional intelligence in patience with identity formation process. Time management wisdom: exploration has value, specificity will emerge when ready.',
        intensity: 'high'
      }
    }
  },

  // ============= SAMUEL ARC (8 scenes) =============

  // SCENE 16: Samuel's Backstory - Southern Company Engineer to Station Keeper
  'samuel_backstory_revelation': {
    sceneId: 'samuel_backstory_revelation',
    characterArc: 'samuel',
    sceneDescription: 'Samuel reveals 23-year Southern Company engineering career, moment at Vulcan when he realized he followed others\' blueprints',

    choiceMappings: {
      'what_did_you_want': {
        skillsDemonstrated: ['communication', 'criticalThinking', 'emotionalIntelligence'],  // curiosity → criticalThinking
        context: 'Asked open exploration question ("what did you want to build?") that invites self-revelation without agenda. Communication skill through non-directive questioning. Curiosity demonstrated by genuine interest in Samuel\'s purpose. Emotional intelligence in recognizing vulnerability of sharing unrealized dreams requires patient, open response.',
        intensity: 'medium'
      },

      'relate': {
        skillsDemonstrated: ['emotionalIntelligence', 'communication', 'emotionalIntelligence', 'emotionalIntelligence'],  // vulnerability → emotionalIntelligence, empathy → emotionalIntelligence
        context: 'Offered reciprocal vulnerability ("I understand that feeling") creating mutual disclosure safety. Emotional intelligence through recognition of shared experience. Communication that builds connection through identification rather than analysis. Vulnerability as gift - matching Samuel\'s disclosure with personal resonance. Empathy through felt understanding, not intellectual sympathy.',
        intensity: 'high'
      }
    }
  },

  // SCENE 17: Maya Reflection - Understanding Influence vs Agency (Part 2 only - Part 1 has no choices)
  'samuel_reflect_on_influence_pt2': {
    sceneId: 'samuel_reflect_on_influence_pt2',
    characterArc: 'samuel',
    sceneDescription: 'Samuel teaches difference between helping someone see options vs telling them what to do',

    choiceMappings: {
      'what_did_maya_choose': {
        skillsDemonstrated: ['communication', 'criticalThinking', 'timeManagement'],  // curiosity → criticalThinking, followThrough → timeManagement
        context: 'Followed up on Maya\'s outcome with genuine interest in her autonomous choice. Communication through continuation of narrative thread. Curiosity about result of mentorship interaction. Demonstrated care through investment in knowing how story resolved. Follow-through as relationship maintenance - showing that outcomes matter.',
        intensity: 'low'
      },

      'how_do_you_know': {
        skillsDemonstrated: ['criticalThinking', 'communication', 'criticalThinking'],  // metacognition → criticalThinking
        context: 'Questioned own mentorship process by asking how Samuel knew player didn\'t prescribe solutions. Critical thinking through self-examination of helping behavior. Communication that invites feedback on own approach. Metacognition - thinking about thinking, examining own facilitation strategy. Demonstrates intellectual humility and growth mindset.',
        intensity: 'medium'
      },

      'accept_insight': {
        skillsDemonstrated: ['emotionalIntelligence', 'adaptability', 'collaboration', 'emotionalIntelligence'],  // learning → adaptability, humility → collaboration, presence → emotionalIntelligence
        context: 'Integrated Samuel\'s teaching about mentorship distinction (space-holding vs directing). Emotional intelligence in receiving wisdom about own impact. Learning capacity through acceptance of new framework. Humility in acknowledging didn\'t fully understand own helping mechanism. Presence demonstrated by valuing insight over defensiveness.',
        intensity: 'medium'
      }
    }
  },

  // SCENE 18: Witnessing vs Fixing Teaching Moment
  'samuel_teaching_witnessing_pt2': {
    sceneId: 'samuel_teaching_witnessing_pt2',
    characterArc: 'samuel',
    sceneDescription: 'Samuel explains witnessing as being fully present to experience without needing to change it',

    choiceMappings: {
      'understand_witnessing': {
        skillsDemonstrated: ['emotionalIntelligence', 'communication', 'adaptability', 'emotionalIntelligence'],  // learning → adaptability, presence → emotionalIntelligence
        context: 'Absorbed complex relational concept (witnessing = presence without agenda) and integrated into worldview. Emotional intelligence through understanding that helping often serves helper\'s discomfort, not recipient\'s need. Communication shown in concise articulation ("present without fixing"). Learning demonstrated by grasping subtle distinction. Presence as skill recognized as different from action.',
        intensity: 'high'
      }
    }
  },

  // SCENE 19: Jordan Reflection - Narrative Reframing Power
  'samuel_reflects_jordan': {
    sceneId: 'samuel_reflects_jordan',
    characterArc: 'samuel',
    sceneDescription: 'Samuel reflects on how player helped Jordan reframe seven jobs from failure to accumulation/adaptation',

    choiceMappings: {
      'story_might_change': {
        skillsDemonstrated: ['criticalThinking', 'adaptability', 'criticalThinking'],  // wisdom → criticalThinking
        context: 'Questioned stability of narrative reframe ("what if story changes again?") showing understanding that identity is constructed, not fixed. Critical thinking through recognition that single reframe isn\'t permanent solution. Adaptability in accepting fluid nature of self-narrative. Wisdom in understanding that meaning-making is ongoing process, not one-time event.',
        intensity: 'medium'
      },

      'needed_authorship': {
        skillsDemonstrated: ['emotionalIntelligence', 'communication', 'criticalThinking'],  // insight → criticalThinking
        context: 'Recognized that Jordan needed permission to author own story, not validation of specific story. Emotional intelligence through distinction between external affirmation and internal agency. Communication of meta-level insight about locus of control. Deep understanding that confidence comes from authorship capacity, not correct narrative content.',
        intensity: 'high'
      },

      'lonely_frame': {
        skillsDemonstrated: ['criticalThinking', 'emotionalIntelligence', 'criticalThinking', 'criticalThinking'],  // ethics → criticalThinking, nuance → criticalThinking
        context: 'Identified potential isolation in "only your story matters" frame, questioning whether it severs connection. Critical thinking through examination of frame\'s implications. Emotional intelligence in recognizing humans need both autonomy and belonging. Ethical consideration of whether empowerment message inadvertently promotes disconnection. Nuanced thinking that holds both individual agency and relational interdependence.',
        intensity: 'high'
      }
    }
  },

  // SCENE 20: Pattern Observation - Player's Emerging Identity
  'samuel_pattern_observation': {
    sceneId: 'samuel_pattern_observation',
    characterArc: 'samuel',
    sceneDescription: 'Samuel observes player listens more than speaks, asks questions that make people think',

    choiceMappings: {
      'what_about_my_path': {
        skillsDemonstrated: ['criticalThinking', 'communication', 'emotionalIntelligence'],  // curiosity → criticalThinking, selfAwareness → emotionalIntelligence
        context: 'Turned Samuel\'s observation back to personal journey ("what about my own path?") showing hunger for self-understanding. Curiosity about own trajectory and emerging identity. Communication through direct request for guidance. Self-awareness in recognizing that helping others clarify doesn\'t mean own path is clear. Vulnerability in asking existential question.',
        intensity: 'medium'
      },

      'accept': {
        skillsDemonstrated: ['emotionalIntelligence', 'collaboration', 'emotionalIntelligence', 'emotionalIntelligence'],  // humility → collaboration, presence → emotionalIntelligence, gratitude → emotionalIntelligence
        context: 'Received Samuel\'s observation ("you hold space for others\' becoming") with gratitude and integration. Emotional intelligence in accepting positive reflection without deflection. Humility demonstrated by simply thanking rather than minimizing. Presence shown through receiving without immediate need to reciprocate or redirect. Gratitude for being seen accurately.',
        intensity: 'high'
      }
    }
  },

  // SCENE 21 (Samuel): Reflects on Maya - Sacrifice and Identity
  'samuel_reflects_maya': {
    sceneId: 'samuel_reflects_maya',
    characterArc: 'samuel',
    sceneDescription: 'Samuel reflects on how player helped Maya navigate family sacrifice vs. authentic identity, teaching reframing strategy',

    choiceMappings: {
      'learn_reframing': {
        skillsDemonstrated: ['criticalThinking', 'emotionalIntelligence', 'culturalCompetence', 'communication'],
        context: 'Learned reframing technique from Samuel\'s reflection: separating means (specific career) from ends (family honor/happiness). Critical thinking in identifying false choice structures. Emotional intelligence in understanding identity development. Cultural competence in navigating immigrant family dynamics. Communication through reframing language.',
        intensity: 'high'
      },

      'acknowledge_complexity': {
        skillsDemonstrated: ['emotionalIntelligence', 'criticalThinking', 'communication'],
        context: 'Acknowledged complexity of honoring family while pursuing authentic path. Emotional intelligence in holding competing values simultaneously. Critical thinking in resisting binary thinking. Communication in normalizing complex identity negotiations.',
        intensity: 'medium'
      }
    }
  },

  // SCENE 22 (Samuel): Reflects on Devon - Systems and Connection
  'samuel_reflects_devon': {
    sceneId: 'samuel_reflects_devon',
    characterArc: 'samuel',
    sceneDescription: 'Samuel reflects on how player helped Devon discover systems thinking can include human connection, not just replace it',

    choiceMappings: {
      'systems_insight': {
        skillsDemonstrated: ['criticalThinking', 'problemSolving', 'emotionalIntelligence', 'collaboration'],
        context: 'Gained insight that systems thinking and emotional connection are complementary, not opposed. Critical thinking in recognizing false dichotomy. Problem-solving through integrative approach. Emotional intelligence in understanding social-technical balance. Collaboration as valid system component.',
        intensity: 'high'
      },

      'validate_devon_growth': {
        skillsDemonstrated: ['emotionalIntelligence', 'communication', 'leadership'],
        context: 'Validated Devon\'s courage in revising "I don\'t need people" narrative. Emotional intelligence in recognizing defensive coping mechanisms. Communication through affirmation of growth. Leadership in modeling vulnerability as strength.',
        intensity: 'medium'
      }
    }
  },

  // SCENE 23 (Samuel): Final Wisdom - Synthesis Moment
  'samuel_final_wisdom': {
    sceneId: 'samuel_final_wisdom',
    characterArc: 'samuel',
    sceneDescription: 'Samuel shares final wisdom synthesizing all character arcs - pattern recognition across human development, career as identity exploration',

    choiceMappings: {
      'receive_synthesis': {
        skillsDemonstrated: ['criticalThinking', 'emotionalIntelligence', 'adaptability', 'leadership', 'communication'],
        context: 'Received Samuel\'s meta-pattern: career choices as identity development moments, not just economic decisions. Critical thinking in recognizing overarching framework. Emotional intelligence in understanding identity formation process. Adaptability through revised career exploration mental model. Leadership in synthesizing learning across conversations. Communication in articulating developmental insight.',
        intensity: 'high'
      },

      'apply_journey': {
        skillsDemonstrated: ['emotionalIntelligence', 'criticalThinking', 'adaptability'],
        context: 'Applied Samuel\'s synthesis to own journey, recognizing pattern across choices made. Emotional intelligence through self-reflection. Critical thinking in identifying personal pattern. Adaptability in revising self-concept based on evidence of growth.',
        intensity: 'high'
      }
    }
  }
}

/**
 * Helper function to get all scenes for a specific character arc
 */
export function getScenesByCharacter(character: 'maya' | 'devon' | 'jordan' | 'samuel'): SceneSkillMapping[] {
  return Object.values(SCENE_SKILL_MAPPINGS).filter(scene => scene.characterArc === character)
}

/**
 * Helper function to get all high-intensity skill demonstrations
 */
export function getHighIntensityMoments(): Array<{
  sceneId: string
  characterArc: string
  choiceId: string
  skillsDemonstrated: (keyof FutureSkills)[]
  context: string
}> {
  const highIntensityMoments: Array<{
    sceneId: string
    characterArc: string
    choiceId: string
    skillsDemonstrated: (keyof FutureSkills)[]
    context: string
  }> = []

  Object.entries(SCENE_SKILL_MAPPINGS).forEach(([sceneId, scene]) => {
    Object.entries(scene.choiceMappings).forEach(([choiceId, mapping]) => {
      if (mapping.intensity === 'high') {
        highIntensityMoments.push({
          sceneId,
          characterArc: scene.characterArc,
          choiceId,
          skillsDemonstrated: mapping.skillsDemonstrated,
          context: mapping.context
        })
      }
    })
  })

  return highIntensityMoments
}

/**
 * Helper function to get all skills demonstrated across all scenes
 */
export function getAllSkillsDemonstrated(): Record<keyof FutureSkills, number> {
  const skillCounts: Record<string, number> = {}

  Object.values(SCENE_SKILL_MAPPINGS).forEach(scene => {
    Object.values(scene.choiceMappings).forEach(mapping => {
      mapping.skillsDemonstrated.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1
      })
    })
  })

  return skillCounts as Record<keyof FutureSkills, number>
}

/**
 * Helper function to search scenes by skill
 */
export function getScenesBySkill(skill: keyof FutureSkills): Array<{
  sceneId: string
  characterArc: string
  choiceId: string
  context: string
  intensity: 'high' | 'medium' | 'low'
}> {
  const scenes: Array<{
    sceneId: string
    characterArc: string
    choiceId: string
    context: string
    intensity: 'high' | 'medium' | 'low'
  }> = []

  Object.entries(SCENE_SKILL_MAPPINGS).forEach(([sceneId, scene]) => {
    Object.entries(scene.choiceMappings).forEach(([choiceId, mapping]) => {
      if (mapping.skillsDemonstrated.includes(skill)) {
        scenes.push({
          sceneId,
          characterArc: scene.characterArc,
          choiceId,
          context: mapping.context,
          intensity: mapping.intensity
        })
      }
    })
  })

  return scenes
}
