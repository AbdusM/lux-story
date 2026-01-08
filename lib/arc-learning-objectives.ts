/**
 * Arc Learning Objectives
 * Defines what students learn through each character arc
 * Used for Experience Summary component (Kolb's Cycle Stage 2: Reflective Observation)
 */

import type { ExperienceSummaryData, ArcLearningObjective } from '@/components/ExperienceSummary'
import type { GameState } from './character-state'

// All characters with arc learning objectives
export type ArcCharacterId =
  | 'maya' | 'devon' | 'jordan' // Original 3
  | 'samuel' | 'marcus' | 'tess' | 'rohan' | 'kai' | 'grace' | 'elena' | 'alex' | 'yaquin' // Core characters
  | 'silas' | 'asha' | 'lira' | 'zara' // Extended characters
  | 'quinn' | 'dante' | 'nadia' | 'isaiah' // LinkedIn 2026

export const ARC_LEARNING_OBJECTIVES: Record<ArcCharacterId, {
  theme: string
  defaultSkills: ArcLearningObjective[]
  defaultInsights: string[]
}> = {
  maya: {
    theme: "You helped Maya navigate the tension between her family's expectations and her authentic passion for robotics. Through your conversations, you explored how identity, cultural values, and personal dreams intersect.",
    defaultSkills: [
      {
        skill: 'emotionalIntelligence',
        howYouShowedIt: 'You recognized Maya\'s emotional struggle and helped her process complex feelings about family expectations versus personal identity.',
        whyItMatters: 'Emotional intelligence is critical for understanding others\' perspectives and building authentic relationships in any career.'
      },
      {
        skill: 'culturalCompetence',
        howYouShowedIt: 'You understood the cultural dynamics of immigrant families and the weight of sacrifice across generations.',
        whyItMatters: 'Cultural competence helps you work effectively with diverse teams and understand different perspectives in the workplace.'
      },
      {
        skill: 'communication',
        howYouShowedIt: 'You asked thoughtful questions and helped Maya articulate her values and dreams clearly.',
        whyItMatters: 'Strong communication skills enable you to express ideas, ask powerful questions, and build understanding with others.'
      },
      {
        skill: 'criticalThinking',
        howYouShowedIt: 'You helped Maya analyze the difference between fulfilling expectations and honoring deeper intentions.',
        whyItMatters: 'Critical thinking allows you to evaluate complex situations and make informed decisions about your own path.'
      }
    ],
    defaultInsights: [
      'Family expectations can come from love, even when they feel limiting',
      'Authentic choices require balancing multiple important values',
      'Supporting others in difficult decisions builds trust and connection',
      'Cultural identity and personal dreams can coexist with understanding'
    ]
  },
  devon: {
    theme: "You helped Devon process grief and navigate family relationships while exploring his technical interests. Through your conversations, you discovered how logic and emotion both matter in meaningful connections.",
    defaultSkills: [
      {
        skill: 'emotionalIntelligence',
        howYouShowedIt: 'You recognized Devon\'s emotional needs around grief and family relationships, supporting him through difficult conversations.',
        whyItMatters: 'Emotional intelligence helps you support colleagues through challenges and build workplace relationships.'
      },
      {
        skill: 'problemSolving',
        howYouShowedIt: 'You helped Devon find systematic approaches to complex emotional situations, like creating flowcharts for difficult conversations.',
        whyItMatters: 'Problem-solving skills let you break down complex challenges into manageable steps, useful in any career.'
      },
      {
        skill: 'communication',
        howYouShowedIt: 'You adapted your communication style to match Devon\'s logical, structured approach to emotional topics.',
        whyItMatters: 'Adaptive communication helps you connect with different personality types and working styles.'
      },
      {
        skill: 'criticalThinking',
        howYouShowedIt: 'You helped Devon analyze patterns in his relationships and think through the implications of different approaches.',
        whyItMatters: 'Critical thinking enables you to see connections and make thoughtful decisions in complex situations.'
      }
    ],
    defaultInsights: [
      'Logic and emotion are both important in relationships',
      'Systematic approaches can help navigate emotional challenges',
      'Supporting others through grief requires patience and understanding',
      'Different communication styles can be equally valid and effective'
    ]
  },
  jordan: {
    theme: "You helped Jordan navigate impostor syndrome and recognize the value of their trade skills. Through your conversations, you explored how different paths can lead to meaningful careers.",
    defaultSkills: [
      {
        skill: 'emotionalIntelligence',
        howYouShowedIt: 'You recognized Jordan\'s self-doubt and helped them see their own value and accomplishments.',
        whyItMatters: 'Emotional intelligence helps you build confidence in yourself and support others in doing the same.'
      },
      {
        skill: 'leadership',
        howYouShowedIt: 'You helped Jordan recognize their leadership potential in construction and sustainable building.',
        whyItMatters: 'Leadership skills enable you to guide projects, mentor others, and advance in your career.'
      },
      {
        skill: 'communication',
        howYouShowedIt: 'You validated Jordan\'s experiences and helped them articulate the value of hands-on skills and trade knowledge.',
        whyItMatters: 'Strong communication helps you advocate for yourself and explain your unique value to employers.'
      },
      {
        skill: 'criticalThinking',
        howYouShowedIt: 'You helped Jordan analyze the differences between academic and practical paths, recognizing both have value.',
        whyItMatters: 'Critical thinking helps you evaluate career options and make informed decisions about your path.'
      }
    ],
    defaultInsights: [
      'Hands-on skills and trade knowledge are valuable career foundations',
      'Impostor syndrome can affect anyone, regardless of their path',
      'Leadership can be developed through many different experiences',
      'There are multiple valid paths to meaningful careers'
    ]
  },

  // Core Characters
  samuel: {
    theme: "You connected with Samuel, the Station Keeper who has guided countless travelers. Through your conversations, you explored the wisdom of patience, the power of listening, and how to find meaning in helping others find their way.",
    defaultSkills: [
      {
        skill: 'emotionalIntelligence',
        howYouShowedIt: 'You recognized the depth behind Samuel\'s gentle guidance and responded with patience and openness.',
        whyItMatters: 'Emotional intelligence helps you see beyond surface interactions to understand deeper motivations and needs.'
      },
      {
        skill: 'mentorship',
        howYouShowedIt: 'You learned to guide without directing, to ask questions that help others find their own answers.',
        whyItMatters: 'Mentorship skills help you support others\' growth while empowering them to make their own choices.'
      },
      {
        skill: 'patience',
        howYouShowedIt: 'You took time with difficult questions, allowing understanding to emerge naturally.',
        whyItMatters: 'Patience enables you to build deeper relationships and navigate complex situations without rushing to judgment.'
      }
    ],
    defaultInsights: [
      'True guidance helps others find their own answers',
      'Patience creates space for wisdom to emerge',
      'Everyone who enters the station is on a journey',
      'The best mentors listen more than they speak'
    ]
  },
  marcus: {
    theme: "You connected with Marcus, who navigates the complex intersection of healthcare, technology, and ethics. Through your conversations, you explored how to balance efficiency with compassion and make difficult decisions under pressure.",
    defaultSkills: [
      {
        skill: 'emotionalIntelligence',
        howYouShowedIt: 'You understood Marcus\'s burden of responsibility and the weight of decisions that affect patient lives.',
        whyItMatters: 'Emotional intelligence helps you support colleagues through high-stakes decisions.'
      },
      {
        skill: 'criticalThinking',
        howYouShowedIt: 'You helped Marcus analyze complex ethical situations with multiple valid perspectives.',
        whyItMatters: 'Critical thinking enables you to navigate gray areas where there are no easy answers.'
      },
      {
        skill: 'crisisManagement',
        howYouShowedIt: 'You learned to stay calm and systematic when facing urgent, high-pressure situations.',
        whyItMatters: 'Crisis management skills help you lead effectively when stakes are highest.'
      }
    ],
    defaultInsights: [
      'Healthcare decisions often involve competing values',
      'Technology should serve human needs, not replace human judgment',
      'Ethical dilemmas rarely have perfect solutions',
      'Taking care of caregivers is essential to sustainable impact'
    ]
  },
  tess: {
    theme: "You connected with Tess, a founder who built her education venture from nothing. Through your conversations, you explored the journey from idea to impact, the challenges of scaling while staying true to your mission.",
    defaultSkills: [
      {
        skill: 'leadership',
        howYouShowedIt: 'You learned how Tess inspires and guides her team while navigating uncertainty.',
        whyItMatters: 'Leadership skills help you rally people around a vision and navigate challenges together.'
      },
      {
        skill: 'resilience',
        howYouShowedIt: 'You explored how Tess handles setbacks and maintains faith in her mission.',
        whyItMatters: 'Resilience enables you to persist through difficulties and learn from failures.'
      },
      {
        skill: 'communication',
        howYouShowedIt: 'You learned how to articulate vision in ways that inspire action.',
        whyItMatters: 'Strong communication helps you share your ideas and build support for your goals.'
      }
    ],
    defaultInsights: [
      'Starting something new requires courage and persistence',
      'Mission-driven work sustains you through challenges',
      'Building a team means finding people who share your values',
      'Impact often comes from solving problems others overlook'
    ]
  },
  rohan: {
    theme: "You connected with Rohan, a deep tech researcher who sees patterns others miss. Through your conversations, you explored the intersection of technical depth, ethical responsibility, and the courage to speak truth to power.",
    defaultSkills: [
      {
        skill: 'criticalThinking',
        howYouShowedIt: 'You engaged with Rohan\'s complex technical and ethical frameworks.',
        whyItMatters: 'Critical thinking helps you evaluate complex systems and their implications.'
      },
      {
        skill: 'courage',
        howYouShowedIt: 'You explored what it means to stand by data when it conflicts with what people want to hear.',
        whyItMatters: 'Courage enables you to speak truth and maintain integrity under pressure.'
      },
      {
        skill: 'research',
        howYouShowedIt: 'You learned to approach problems with systematic inquiry and intellectual rigor.',
        whyItMatters: 'Research skills help you find truth in complex situations and make evidence-based decisions.'
      }
    ],
    defaultInsights: [
      'Technical skill without ethics can cause harm',
      'Speaking truth requires courage and preparation',
      'Deep expertise comes from sustained, focused inquiry',
      'Some patterns only become visible with patience and attention'
    ]
  },
  kai: {
    theme: "You connected with Kai, a safety specialist who protects others through vigilance and care. Through your conversations, you explored how attention to detail, clear protocols, and genuine concern for others combine to prevent harm.",
    defaultSkills: [
      {
        skill: 'problemSolving',
        howYouShowedIt: 'You learned to identify risks before they become problems.',
        whyItMatters: 'Problem-solving skills help you anticipate and prevent issues in any field.'
      },
      {
        skill: 'communication',
        howYouShowedIt: 'You explored how to convey safety concerns clearly without causing panic.',
        whyItMatters: 'Clear communication helps you share important information effectively.'
      },
      {
        skill: 'leadership',
        howYouShowedIt: 'You learned how Kai guides others to take responsibility for safety.',
        whyItMatters: 'Leadership in safety means empowering everyone to be vigilant.'
      }
    ],
    defaultInsights: [
      'Safety is everyone\'s responsibility',
      'Attention to detail saves lives',
      'Clear protocols create freedom through structure',
      'Caring for others means anticipating their needs'
    ]
  },
  grace: {
    theme: "You connected with Grace, who provides care and support during people's most vulnerable moments. Through your conversations, you explored compassion, presence, and the courage to accompany others through difficulty.",
    defaultSkills: [
      {
        skill: 'emotionalIntelligence',
        howYouShowedIt: 'You learned to be present with difficult emotions without trying to fix them.',
        whyItMatters: 'Emotional intelligence helps you support others through their challenges.'
      },
      {
        skill: 'compassion',
        howYouShowedIt: 'You explored how Grace maintains empathy while protecting her own wellbeing.',
        whyItMatters: 'Sustainable compassion requires boundaries and self-care.'
      },
      {
        skill: 'communication',
        howYouShowedIt: 'You learned the power of presence and listening over advice-giving.',
        whyItMatters: 'Sometimes the most helpful thing is simply being there.'
      }
    ],
    defaultInsights: [
      'Being present is more powerful than having answers',
      'Compassion requires boundaries to be sustainable',
      'Helping others through difficulty is sacred work',
      'Self-care is not selfish - it enables continued service'
    ]
  },
  elena: {
    theme: "You connected with Elena, an archivist who finds patterns in history and information. Through your conversations, you explored how understanding the past illuminates the present and how careful research reveals hidden truths.",
    defaultSkills: [
      {
        skill: 'research',
        howYouShowedIt: 'You learned to follow threads of information to their sources.',
        whyItMatters: 'Research skills help you find truth in a world of competing claims.'
      },
      {
        skill: 'criticalThinking',
        howYouShowedIt: 'You explored how to evaluate sources and recognize patterns across time.',
        whyItMatters: 'Critical thinking helps you distinguish signal from noise.'
      },
      {
        skill: 'patience',
        howYouShowedIt: 'You learned that important discoveries often require sustained attention.',
        whyItMatters: 'Patience enables you to see what others miss in their rush.'
      }
    ],
    defaultInsights: [
      'History contains patterns that illuminate the present',
      'Preserving knowledge is an act of service',
      'Truth often hides in details others overlook',
      'Understanding context transforms isolated facts into wisdom'
    ]
  },
  alex: {
    theme: "You connected with Alex, who navigates complex supply chains and logistics. Through your conversations, you explored how systems thinking, optimization, and ethical considerations shape how goods and services flow.",
    defaultSkills: [
      {
        skill: 'systemsThinking',
        howYouShowedIt: 'You learned to see connections and dependencies across complex networks.',
        whyItMatters: 'Systems thinking helps you understand how changes ripple through organizations.'
      },
      {
        skill: 'problemSolving',
        howYouShowedIt: 'You explored how to optimize processes while considering human impacts.',
        whyItMatters: 'Problem-solving skills help you improve efficiency without losing sight of values.'
      },
      {
        skill: 'adaptability',
        howYouShowedIt: 'You learned how Alex responds to disruptions and unexpected challenges.',
        whyItMatters: 'Adaptability enables you to maintain performance when conditions change.'
      }
    ],
    defaultInsights: [
      'Every system has hidden dependencies',
      'Optimization without ethics can cause harm',
      'Resilience comes from understanding the whole picture',
      'Small improvements compound into significant impact'
    ]
  },
  yaquin: {
    theme: "You connected with Yaquin, an EdTech creator who builds tools for learning. Through your conversations, you explored how technology can enhance human potential when designed with empathy and purpose.",
    defaultSkills: [
      {
        skill: 'creativity',
        howYouShowedIt: 'You explored how Yaquin translates learning needs into engaging experiences.',
        whyItMatters: 'Creativity helps you find novel solutions to persistent problems.'
      },
      {
        skill: 'empathy',
        howYouShowedIt: 'You learned to design with the learner\'s perspective in mind.',
        whyItMatters: 'Empathy ensures your solutions actually serve those they\'re meant to help.'
      },
      {
        skill: 'innovation',
        howYouShowedIt: 'You explored how to iterate based on feedback and evidence.',
        whyItMatters: 'Innovation requires balancing vision with responsiveness to reality.'
      }
    ],
    defaultInsights: [
      'Technology should amplify human potential, not replace it',
      'Great design starts with understanding the user',
      'Learning is personal - one size does not fit all',
      'Iteration beats perfection every time'
    ]
  },

  // Extended Characters
  silas: {
    theme: "You connected with Silas, a master of advanced manufacturing who finds meaning in precision and craft. Through your conversations, you explored how technical excellence, safety consciousness, and teaching others combine to create lasting impact.",
    defaultSkills: [
      {
        skill: 'craftsmanship',
        howYouShowedIt: 'You learned the value of precision and attention to detail in technical work.',
        whyItMatters: 'Craftsmanship creates quality that earns trust and respect.'
      },
      {
        skill: 'teaching',
        howYouShowedIt: 'You explored how Silas passes on knowledge to the next generation.',
        whyItMatters: 'Teaching multiplies your impact by enabling others.'
      },
      {
        skill: 'problemSolving',
        howYouShowedIt: 'You learned to diagnose issues systematically and find root causes.',
        whyItMatters: 'Systematic problem-solving prevents recurring issues.'
      }
    ],
    defaultInsights: [
      'Excellence in craft is its own reward',
      'Safety is non-negotiable in skilled trades',
      'Teaching is the highest form of mastery',
      'Hands-on skills remain valuable in an automated world'
    ]
  },
  asha: {
    theme: "You connected with Asha, a conflict resolution specialist who transforms tension into understanding. Through your conversations, you explored how active listening, mediation, and creative problem-solving can bridge even deep divides.",
    defaultSkills: [
      {
        skill: 'conflictResolution',
        howYouShowedIt: 'You learned techniques for de-escalating tension and finding common ground.',
        whyItMatters: 'Conflict resolution skills help you navigate disagreements constructively.'
      },
      {
        skill: 'activeListening',
        howYouShowedIt: 'You practiced hearing what people really mean, not just what they say.',
        whyItMatters: 'Active listening builds trust and reveals underlying needs.'
      },
      {
        skill: 'empathy',
        howYouShowedIt: 'You explored how to see situations from multiple perspectives simultaneously.',
        whyItMatters: 'Empathy enables you to connect with people who see the world differently.'
      }
    ],
    defaultInsights: [
      'Most conflicts arise from unmet needs, not bad intentions',
      'Listening is more powerful than arguing',
      'Finding common ground requires seeing shared humanity',
      'Transformation happens when people feel truly heard'
    ]
  },
  lira: {
    theme: "You connected with Lira, a communications artist who expresses meaning through sound and story. Through your conversations, you explored how creativity, sensory awareness, and emotional expression combine to move and inspire others.",
    defaultSkills: [
      {
        skill: 'creativity',
        howYouShowedIt: 'You explored how Lira transforms feelings into artistic expression.',
        whyItMatters: 'Creativity helps you find unique ways to communicate and connect.'
      },
      {
        skill: 'communication',
        howYouShowedIt: 'You learned how different mediums convey different aspects of meaning.',
        whyItMatters: 'Multi-modal communication reaches people in different ways.'
      },
      {
        skill: 'emotionalIntelligence',
        howYouShowedIt: 'You explored how art can process and express complex emotions.',
        whyItMatters: 'Emotional intelligence helps you connect with others through shared feeling.'
      }
    ],
    defaultInsights: [
      'Art communicates what words cannot',
      'Creative work requires vulnerability and courage',
      'Every sense is a channel for meaning',
      'Beauty has the power to heal and inspire'
    ]
  },
  zara: {
    theme: "You connected with Zara, a data ethics advocate who questions the systems that shape our lives. Through your conversations, you explored how to recognize bias, advocate for fairness, and use visual thinking to reveal hidden patterns.",
    defaultSkills: [
      {
        skill: 'criticalThinking',
        howYouShowedIt: 'You learned to question assumptions and examine systems for hidden biases.',
        whyItMatters: 'Critical thinking helps you see beyond surface-level appearances.'
      },
      {
        skill: 'advocacy',
        howYouShowedIt: 'You explored how to speak up for those affected by unfair systems.',
        whyItMatters: 'Advocacy skills help you create change for those who lack power.'
      },
      {
        skill: 'visualThinking',
        howYouShowedIt: 'You learned how visual representation can reveal patterns invisible in data.',
        whyItMatters: 'Visual thinking helps you communicate complex ideas clearly.'
      }
    ],
    defaultInsights: [
      'Algorithms encode human biases unless we actively correct them',
      'Ethical technology requires ongoing vigilance',
      'Those most affected by systems should have voice in designing them',
      'Art and data together reveal truths neither can show alone'
    ]
  },

  // LinkedIn 2026 Career Expansion
  quinn: {
    theme: "You connected with Quinn, a finance specialist who mentors others through the complexities of investment and wealth-building. Through your conversations, you explored how financial literacy, risk assessment, and values-aligned investing can create sustainable impact.",
    defaultSkills: [
      {
        skill: 'analyticalThinking',
        howYouShowedIt: 'You learned to evaluate opportunities by understanding risk, return, and underlying fundamentals.',
        whyItMatters: 'Analytical thinking helps you make sound decisions in uncertain situations.'
      },
      {
        skill: 'mentorship',
        howYouShowedIt: 'You explored how Quinn shares financial knowledge to empower others.',
        whyItMatters: 'Mentorship multiplies your impact by helping others grow.'
      },
      {
        skill: 'decisionMaking',
        howYouShowedIt: 'You learned frameworks for making decisions when perfect information isn\'t available.',
        whyItMatters: 'Decision-making skills help you act confidently despite uncertainty.'
      }
    ],
    defaultInsights: [
      'Financial literacy is a form of empowerment',
      'Money is a tool - its value depends on how it\'s used',
      'Risk and opportunity are two sides of the same coin',
      'Teaching others to fish creates more impact than giving fish'
    ]
  },
  dante: {
    theme: "You connected with Dante, a sales strategist who builds relationships through authentic connection. Through your conversations, you explored how persuasion rooted in integrity, active listening, and genuine care creates trust and mutual benefit.",
    defaultSkills: [
      {
        skill: 'persuasion',
        howYouShowedIt: 'You learned how to influence through understanding and alignment, not manipulation.',
        whyItMatters: 'Ethical persuasion helps you advocate for ideas you believe in.'
      },
      {
        skill: 'relationshipBuilding',
        howYouShowedIt: 'You explored how Dante builds trust through consistency and genuine interest.',
        whyItMatters: 'Strong relationships open doors and create opportunities.'
      },
      {
        skill: 'activeListening',
        howYouShowedIt: 'You learned that understanding needs precedes offering solutions.',
        whyItMatters: 'Active listening reveals what people really want and need.'
      }
    ],
    defaultInsights: [
      'The best sales come from truly solving problems',
      'Manipulation damages relationships; influence builds them',
      'Trust is earned through consistency over time',
      'Understanding someone\'s needs is more powerful than pitching benefits'
    ]
  },
  nadia: {
    theme: "You connected with Nadia, an AI strategist who helps organizations navigate technological transformation responsibly. Through your conversations, you explored how strategic thinking, change management, and ethical AI implementation create lasting positive impact.",
    defaultSkills: [
      {
        skill: 'strategicThinking',
        howYouShowedIt: 'You learned to see beyond immediate applications to long-term implications.',
        whyItMatters: 'Strategic thinking helps you anticipate consequences and plan effectively.'
      },
      {
        skill: 'changeManagement',
        howYouShowedIt: 'You explored how to guide organizations through technological transitions.',
        whyItMatters: 'Change management skills help you implement ideas in complex organizations.'
      },
      {
        skill: 'ethicalReasoning',
        howYouShowedIt: 'You learned to evaluate AI systems for potential harms and biases.',
        whyItMatters: 'Ethical reasoning ensures technology serves human flourishing.'
      }
    ],
    defaultInsights: [
      'Technology is never neutral - it embeds values',
      'Change management is as important as technical implementation',
      'The people affected by AI should have voice in its development',
      'Moving fast and breaking things has real human costs'
    ]
  },
  isaiah: {
    theme: "You connected with Isaiah, a nonprofit leader who mobilizes community support for meaningful causes. Through your conversations, you explored how storytelling, relationship cultivation, and mission alignment create sustainable social impact.",
    defaultSkills: [
      {
        skill: 'storytelling',
        howYouShowedIt: 'You learned how Isaiah translates impact into narratives that inspire action.',
        whyItMatters: 'Storytelling helps you share your vision and motivate others.'
      },
      {
        skill: 'relationshipBuilding',
        howYouShowedIt: 'You explored how to cultivate donor relationships based on shared values.',
        whyItMatters: 'Strong relationships are the foundation of sustainable impact.'
      },
      {
        skill: 'missionAlignment',
        howYouShowedIt: 'You learned to connect individual motivations with collective purpose.',
        whyItMatters: 'Mission alignment creates engagement that goes beyond transactions.'
      }
    ],
    defaultInsights: [
      'Impact comes from consistent small actions, not just big gestures',
      'Sustainable change requires community, not just resources',
      'Stories connect hearts; data convinces minds - you need both',
      'Taking care of yourself enables you to take care of others'
    ]
  }
}

/**
 * Skill demonstration from SkillTracker
 */
interface SkillDemonstration {
  scene: string
  sceneDescription: string
  choice: string
  skillsDemonstrated: string[]
  context: string
  timestamp: number
}

/**
 * Map of skill names to their "why it matters" descriptions
 */
const SKILL_WHY_IT_MATTERS: Record<string, string> = {
  emotionalIntelligence: 'Emotional intelligence helps you build authentic relationships, navigate workplace dynamics, and support colleagues through challenges.',
  criticalThinking: 'Critical thinking enables you to evaluate complex situations, see through surface-level appearances, and make informed decisions.',
  communication: 'Strong communication helps you express ideas clearly, ask powerful questions, and build understanding with diverse teams.',
  problemSolving: 'Problem-solving skills let you break down complex challenges into manageable steps, essential in any career.',
  leadership: 'Leadership skills help you guide projects, mentor others, and advance in your career. even without formal authority.',
  creativity: 'Creativity helps you find innovative solutions and connect ideas across different domains.',
  adaptability: 'Adaptability helps you thrive in changing environments and pivot when circumstances shift.',
  collaboration: 'Collaboration skills help you work effectively with diverse teams and build on others\' strengths.',
  culturalCompetence: 'Cultural competence helps you work effectively with diverse teams and understand different perspectives.',
  relationshipBuilding: 'The ability to build authentic trust quickly unlocks opportunities, mentorship, and career paths that aren\'t listed on job boards.'
}

/**
 * Generate experience summary data from game state after arc completion
 * Now supports actual skill demonstrations from gameplay
 */
export async function generateExperienceSummary(
  characterArc: ArcCharacterId,
  gameState: GameState,
  profile?: import('@/lib/skill-profile-adapter').SkillProfile | null,
  demonstrations?: SkillDemonstration[]
): Promise<ExperienceSummaryData> {
  const characterId = characterArc
  const character = gameState.characters.get(characterId)
  const arcData = ARC_LEARNING_OBJECTIVES[characterArc]

  const characterNames: Record<ArcCharacterId, string> = {
    // Original 3
    maya: 'Maya Chen',
    devon: 'Devon Kumar',
    jordan: 'Jordan Packard',
    // Core characters
    samuel: 'Samuel Webb',
    marcus: 'Marcus Williams',
    tess: 'Tess Harmon',
    rohan: 'Rohan Kapoor',
    kai: 'Kai Nakamura',
    grace: 'Grace Okafor',
    elena: 'Elena Rodriguez',
    alex: 'Alex Torres',
    yaquin: 'Yaquin Reyes',
    // Extended characters
    silas: 'Silas Brennan',
    asha: 'Asha Patel',
    lira: 'Lira Moon',
    zara: 'Zara Okonkwo',
    // LinkedIn 2026
    quinn: 'Quinn Foster',
    dante: 'Dante Morales',
    nadia: 'Nadia Volkov',
    isaiah: 'Isaiah Grant'
  }

  // Build skills from actual demonstrations if available
  let skillsDeveloped: ArcLearningObjective[]

  if (demonstrations && demonstrations.length > 0) {
    // Filter demonstrations to this character arc
    const arcDemonstrations = demonstrations.filter(d =>
      d.scene.toLowerCase().includes(characterArc) ||
      d.sceneDescription?.toLowerCase().includes(characterArc) ||
      d.sceneDescription?.toLowerCase().includes(characterNames[characterArc].toLowerCase())
    )

    if (arcDemonstrations.length > 0) {
      // Group demonstrations by skill, keeping the most informative context
      const skillMap = new Map<string, { choices: string[], context: string, count: number }>()

      for (const demo of arcDemonstrations) {
        for (const skill of demo.skillsDemonstrated) {
          const existing = skillMap.get(skill)
          if (existing) {
            existing.choices.push(demo.choice)
            existing.count++
            // Keep the longer/richer context
            if (demo.context.length > existing.context.length) {
              existing.context = demo.context
            }
          } else {
            skillMap.set(skill, {
              choices: [demo.choice],
              context: demo.context,
              count: 1
            })
          }
        }
      }

      // Convert to ArcLearningObjective format
      skillsDeveloped = Array.from(skillMap.entries())
        .sort(([, a], [, b]) => b.count - a.count) // Sort by demonstration count
        .slice(0, 5) // Top 5 skills
        .map(([skill, data]) => ({
          skill,
          howYouShowedIt: data.context || `You demonstrated this skill ${data.count} time${data.count > 1 ? 's' : ''} through choices like: "${data.choices[0]}"`,
          whyItMatters: SKILL_WHY_IT_MATTERS[skill] || `This skill is valuable for building authentic connections and navigating complex situations.`
        }))
    } else {
      // No arc-specific demonstrations, use defaults
      skillsDeveloped = [...arcData.defaultSkills]
    }
  } else {
    // No demonstrations provided, use defaults
    skillsDeveloped = [...arcData.defaultSkills]
  }

  const keyInsights = [...arcData.defaultInsights]

  // DYNAMIC: Inject Trust/Relationship Building if trust is high
  const trustLevel = character?.trust || 0
  if (trustLevel >= 6) {
    // Only add if not already present
    const hasRelationshipSkill = skillsDeveloped.some(s => s.skill === 'relationshipBuilding')
    if (!hasRelationshipSkill) {
      skillsDeveloped.unshift({
        skill: 'relationshipBuilding',
        howYouShowedIt: `You built a deep level of trust (${trustLevel}/10) with ${characterNames[characterArc]}, moving beyond surface-level interaction to genuine connection.`,
        whyItMatters: SKILL_WHY_IT_MATTERS['relationshipBuilding']
      })
    }

    keyInsights.unshift('Building trust is a form of career exploration. it reveals paths you can\'t find on Google')
  }

  // Determine dominant pattern from game state
  const patterns = gameState.patterns
  const patternEntries = Object.entries(patterns) as [keyof typeof patterns, number][]
  const dominantPattern = patternEntries
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'helping'

  return {
    characterName: characterNames[characterArc],
    characterArc,
    arcTheme: arcData.theme,
    skillsDeveloped,
    keyInsights,
    trustLevel: character?.trust || 0,
    relationshipStatus: character?.relationshipStatus || 'stranger',
    dominantPattern,
    profile: profile || undefined
  }
}

/**
 * All character arc completion flags
 * Maps flag name to character ID (only actual characters, not locations)
 */
const ARC_FLAG_TO_CHARACTER: Record<string, ArcCharacterId> = {
  // Original 3
  'maya_arc_complete': 'maya',
  'devon_arc_complete': 'devon',
  'jordan_arc_complete': 'jordan',
  // Core characters
  'samuel_arc_complete': 'samuel',
  'marcus_arc_complete': 'marcus',
  'tess_arc_complete': 'tess',
  'rohan_arc_complete': 'rohan',
  'kai_arc_complete': 'kai',
  'grace_arc_complete': 'grace',
  'elena_arc_complete': 'elena',
  'alex_arc_complete': 'alex',
  'yaquin_arc_complete': 'yaquin',
  // Extended characters
  'silas_arc_complete': 'silas',
  'asha_arc_complete': 'asha',
  'lira_arc_complete': 'lira',
  'zara_arc_complete': 'zara',
  // LinkedIn 2026
  'quinn_arc_complete': 'quinn',
  'dante_arc_complete': 'dante',
  'nadia_arc_complete': 'nadia',
  'isaiah_arc_complete': 'isaiah'
}

/**
 * Check if an arc just completed based on state changes
 * Returns the character whose arc just completed, or null
 */
export function detectArcCompletion(
  previousState: GameState,
  currentState: GameState
): ArcCharacterId | null {
  for (const [flag, characterId] of Object.entries(ARC_FLAG_TO_CHARACTER)) {
    const wasComplete = previousState.globalFlags.has(flag)
    const isNowComplete = currentState.globalFlags.has(flag)

    if (!wasComplete && isNowComplete) {
      return characterId
    }
  }

  return null
}

/**
 * Get the arc completion flag for a character
 */
export function getArcCompletionFlag(characterId: ArcCharacterId): string {
  return `${characterId}_arc_complete`
}

