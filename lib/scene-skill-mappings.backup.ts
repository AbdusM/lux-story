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
  characterArc: 'maya' | 'devon' | 'jordan' | 'samuel' | 'kai' | 'rohan' | 'silas' | 'marcus' | 'tess' | 'yaquin'
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
 * TOP IMPACTFUL NARRATIVE MOMENTS
 *
 * Selection Criteria:
 * - Trust-gate moments (breakthrough vulnerability)
 * - Crossroads decision points (major life choices)
 * - Skill synthesis moments (multiple competencies demonstrated)
 * - Immersive Scenario Failures & Successes
 */
export const SCENE_SKILL_MAPPINGS: Record<string, SceneSkillMapping> = {

  // ============= KAI ARC (Instructional Architect) =============
  'kai_simulation_setup': {
    sceneId: 'kai_simulation_setup',
    characterArc: 'kai',
    sceneDescription: 'The "Safety Drill" Simulation - Forklift Accident Scenario',
    choiceMappings: {
      'sim_pressure_compliance': {
        skillsDemonstrated: ['adaptability'],
        context: 'Succumbed to pressure and prioritized efficiency over safety, demonstrating compliance rather than leadership.',
        intensity: 'low'
      },
      'sim_pressure_safety': {
        skillsDemonstrated: ['leadership', 'courage', 'criticalThinking'],
        context: 'Prioritized human safety over authority commands in a high-pressure environment. Demonstrated moral courage and decisive leadership.',
        intensity: 'high'
      },
      'sim_check_manual': {
        skillsDemonstrated: ['digitalLiteracy'],
        context: 'Relied on documentation in a crisis, showing analytical intent but poor situational awareness (latency failure).',
        intensity: 'medium'
      }
    }
  },
  'kai_sim_fail_compliance': {
    sceneId: 'kai_sim_fail_compliance',
    characterArc: 'kai',
    sceneDescription: 'Failure State: Compliance leads to fatality',
    choiceMappings: {
      'kai_retry_compliance': {
        skillsDemonstrated: ['resilience', 'learningAgility'],
        context: 'Demonstrated resilience by facing the failure and choosing to learn from the mistake rather than retreating.',
        intensity: 'medium'
      }
    }
  },

  // ============= ROHAN ARC (Deep Tech) =============
  'rohan_simulation_setup': {
    sceneId: 'rohan_simulation_setup',
    characterArc: 'rohan',
    sceneDescription: 'The "Ghost in the Machine" Simulation - Database Migration',
    choiceMappings: {
      'sim_ask_ai': {
        skillsDemonstrated: ['digitalLiteracy'],
        context: 'Relied on the tool that caused the problem (AI) to fix it, demonstrating a lack of first-principles understanding.',
        intensity: 'low'
      },
      'sim_manual_trace': {
        skillsDemonstrated: ['technicalLiteracy', 'deepWork', 'criticalThinking'],
        context: 'Chose to manually verify the code path, demonstrating a commitment to "ground truth" and deep technical understanding.',
        intensity: 'high'
      },
      'sim_comment_out': {
        skillsDemonstrated: ['pragmatism'],
        context: 'Chose a pragmatic bypass that ignored the underlying safety check, leading to data corruption. High speed, low integrity.',
        intensity: 'medium'
      }
    }
  },
  'rohan_sim_fail_hallucination': {
    sceneId: 'rohan_sim_fail_hallucination',
    characterArc: 'rohan',
    sceneDescription: 'Failure State: Recursive Hallucination',
    choiceMappings: {
      'rohan_retry_manual': {
        skillsDemonstrated: ['humility', 'resilience'],
        context: 'Acknowledged the limitation of the AI tool and pivoted to manual verification. Demonstrated humility and adaptability.',
        intensity: 'medium'
      }
    }
  },

  // ============= SILAS ARC (AgTech) =============
  'silas_simulation_start': {
    sceneId: 'silas_simulation_start',
    characterArc: 'silas',
    sceneDescription: 'The "Microgrid Crisis" Simulation - Hurricane Power Allocation',
    choiceMappings: {
      'sim_medical_priority': {
        skillsDemonstrated: ['crisisManagement', 'triage', 'systemsThinking'],
        context: 'Correctly identified the critical dependency (medical equipment) and prioritized life-safety over comfort/shelter.',
        intensity: 'high'
      },
      'sim_community_priority': {
        skillsDemonstrated: ['systemsThinking'],
        context: 'Prioritized the shelter without checking dependencies, leading to a secondary failure (medical crisis). Good intent, incomplete analysis.',
        intensity: 'medium'
      },
      'sim_distribute_evenly': {
        skillsDemonstrated: ['fairness'],
        context: 'Prioritized fairness over physics, leading to a total system collapse (Brownout). Demonstrated a misunderstanding of scarcity constraints.',
        intensity: 'low'
      }
    }
  },
  'silas_microgrid_failure': {
    sceneId: 'silas_microgrid_failure',
    characterArc: 'silas',
    sceneDescription: 'Failure State: Medical Crisis due to wrong priority',
    choiceMappings: {
      'silas_retry_priority': {
        skillsDemonstrated: ['systemsThinking', 'learningAgility'],
        context: 'Re-evaluated the system map after failure to find the hidden dependency. Demonstrated iterative problem solving.',
        intensity: 'medium'
      }
    }
  },

  // ============= MARCUS ARC (Medical Tech) =============
  'marcus_simulation_start': {
    sceneId: 'marcus_simulation_start',
    characterArc: 'marcus',
    sceneDescription: 'The "Air Bubble" Simulation - ECMO Crisis',
    choiceMappings: {
      'sim_clamp_line': {
        skillsDemonstrated: ['problemSolving', 'criticalThinking', 'crisisManagement'],
        context: 'Identified the immediate physical threat (air) and acted decisively to stop flow. Prioritized mechanics over communication in a sub-second crisis.',
        intensity: 'high'
      },
      'sim_call_help': {
        skillsDemonstrated: ['communication'],
        context: 'Prioritized communication/escalation, which is valid in slow crises but fatal in rapid ones. Demonstrated reliance on authority.',
        intensity: 'medium'
      }
    }
  },
  'marcus_sim_step_2': {
    sceneId: 'marcus_sim_step_2',
    characterArc: 'marcus',
    sceneDescription: 'The "Clamped Line" Decision - Vapor Lock vs. Flow',
    choiceMappings: {
      'sim_flick_line': {
        skillsDemonstrated: ['problemSolving', 'digitalLiteracy'],
        context: 'Used mechanical agitation to resolve the blockage without compromising the patient. Demonstrated understanding of physical systems.',
        intensity: 'high'
      },
      'sim_unclamp': {
        skillsDemonstrated: ['emotionalIntelligence'],
        context: 'Reacted to the patient\'s distress (dropping stats) by releasing the safety, causing a fatal error. Empathy override logic.',
        intensity: 'medium'
      }
    }
  },

  // ============= TESS ARC (Education Founder) =============
  'tess_the_pitch_setup': {
    sceneId: 'tess_the_pitch_setup',
    characterArc: 'tess',
    sceneDescription: 'The "Grant Proposal" Simulation - Pitch Deck Tone',
    choiceMappings: {
      'pitch_resilience': {
        skillsDemonstrated: ['leadership', 'creativity', 'communication'],
        context: 'Framed the program around "Antifragility," connecting educational outcomes to modern resilience needs. Strong visionary leadership.',
        intensity: 'high'
      },
      'pitch_mental_health': {
        skillsDemonstrated: ['emotionalIntelligence', 'leadership'],
        context: 'Framed the program as a mental health intervention ("Disconnect to Reconnect"). Strong empathetic leadership.',
        intensity: 'high'
      },
      'pitch_safe': {
        skillsDemonstrated: ['communication'],
        context: 'Chose a safe, academic tone ("Evidence-Based"), failing to capture the urgency or emotion required for funding.',
        intensity: 'low'
      }
    }
  },

  // ============= YAQUIN ARC (EdTech Creator) =============
  'yaquin_curriculum_setup': {
    sceneId: 'yaquin_curriculum_setup',
    characterArc: 'yaquin',
    sceneDescription: 'The "Curriculum Design" Simulation - Module Selection',
    choiceMappings: {
      'module_history': {
        skillsDemonstrated: ['curriculumDesign'],
        context: 'Chose "History of Dentistry," mimicking academic structures rather than addressing user needs. Failed to differentiate.',
        intensity: 'low'
      },
      'module_practical': {
        skillsDemonstrated: ['marketing', 'empathy', 'creativity'],
        context: 'Chose "The Perfect Impression," addressing a specific, high-pain practical skill. Demonstrated market awareness.',
        intensity: 'high'
      },
      'module_soft_skills': {
        skillsDemonstrated: ['emotionalIntelligence', 'leadership'],
        context: 'Chose "Reading the Room," validating the emotional labor of the role. Strong empathetic leadership.',
        intensity: 'high'
      }
    }
  },

  // ============= MAYA ARC (Updated) =============
  'maya_robotics_passion': {
    sceneId: 'maya_robotics_passion',
    characterArc: 'maya',
    sceneDescription: 'The "Twitching Hand" Simulation - Servo Debug',
    choiceMappings: {
      'debug_voltage': {
        skillsDemonstrated: ['technicalLiteracy'], // Was 'analytical'
        context: 'Attempted a standard electrical fix (voltage) on a mechanical feedback loop, causing burnout. Correct domain, wrong diagnosis.',
        intensity: 'medium'
      },
      'debug_force': {
        skillsDemonstrated: ['technicalLiteracy'], // Renamed from voltage
        context: 'Attempted to force the servo, causing mechanical burnout.',
        intensity: 'medium'
      },
      'debug_stabilize': {
        skillsDemonstrated: ['emotionalIntelligence', 'patience'],
        context: 'Used physical touch to dampen the feedback loop, mirroring a biological intervention. Recognized the system needed steadying, not fixing.',
        intensity: 'high'
      }
    }
  },

  // ============= DEVON ARC (Updated) =============
  'devon_debug_step_2': {
    sceneId: 'devon_debug_step_2',
    characterArc: 'devon',
    sceneDescription: 'The "Flowchart" Simulation - Conversational Scripting',
    choiceMappings: {
      'execute_probe': {
        skillsDemonstrated: ['systemsThinking'],
        context: 'Executed the scripted subroutine, prioritizing system logic over human connection. Resulted in disconnection.',
        intensity: 'medium'
      },
      'abort_script': {
        skillsDemonstrated: ['adaptability', 'emotionalIntelligence'],
        context: 'Recognized the script was inadequate and aborted to manual control. Prioritized connection over safety.',
        intensity: 'high'
      }
    }
  }
}

// Helper functions needed by other modules

/**
 * Get all scene mappings for a specific character
 */
export function getScenesByCharacter(characterId: string): SceneSkillMapping[] {
  return Object.values(SCENE_SKILL_MAPPINGS).filter(
    scene => scene.characterArc === characterId
  )
}

/**
 * Get all scenes that represent high-intensity moments (trust gates, crisis)
 */
export function getHighIntensityMoments(): SceneSkillMapping[] {
  return Object.values(SCENE_SKILL_MAPPINGS).filter(scene => {
    return Object.values(scene.choiceMappings).some(
      choice => choice.intensity === 'high'
    )
  })
}

/**
 * Get list of all skills demonstrated in a specific scene, or all skills across the system if no sceneId provided
 */
export function getAllSkillsDemonstrated(sceneId?: string): (keyof FutureSkills)[] | Record<string, number> {
  if (sceneId) {
    const scene = SCENE_SKILL_MAPPINGS[sceneId]
    if (!scene) return []
    
    const skills = new Set<keyof FutureSkills>()
    Object.values(scene.choiceMappings).forEach(choice => {
      choice.skillsDemonstrated.forEach(skill => skills.add(skill))
    })
    
    return Array.from(skills)
  }

  // Aggregate count for all scenes (for validation script)
  const counts: Record<string, number> = {}
  Object.values(SCENE_SKILL_MAPPINGS).forEach(scene => {
    Object.values(scene.choiceMappings).forEach(choice => {
      choice.skillsDemonstrated.forEach(skill => {
        counts[skill] = (counts[skill] || 0) + 1
      })
    })
  })
  return counts
}
