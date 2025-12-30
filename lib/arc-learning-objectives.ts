/**
 * Arc Learning Objectives
 * Defines what students learn through each character arc
 * Used for Experience Summary component (Kolb's Cycle Stage 2: Reflective Observation)
 */

import type { ExperienceSummaryData, ArcLearningObjective } from '@/components/ExperienceSummary'
import type { GameState } from './character-state'
import type { CharacterId } from './graph-registry'

export const ARC_LEARNING_OBJECTIVES: Record<'maya' | 'devon' | 'jordan', {
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
  characterArc: 'maya' | 'devon' | 'jordan',
  gameState: GameState,
  profile?: import('@/lib/skill-profile-adapter').SkillProfile | null,
  demonstrations?: SkillDemonstration[]
): Promise<ExperienceSummaryData> {
  const characterId = characterArc
  const character = gameState.characters.get(characterId)
  const arcData = ARC_LEARNING_OBJECTIVES[characterArc]

  const characterNames: Record<string, string> = {
    maya: 'Maya Chen',
    devon: 'Devon Kumar',
    jordan: 'Jordan Packard'
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
 * Maps flag name to character ID
 */
const ARC_FLAG_TO_CHARACTER: Record<string, CharacterId> = {
  'maya_arc_complete': 'maya',
  'devon_arc_complete': 'devon',
  'jordan_arc_complete': 'jordan',
  'marcus_arc_complete': 'marcus',
  'tess_arc_complete': 'tess',
  'yaquin_arc_complete': 'yaquin',
  'kai_arc_complete': 'kai',
  'alex_arc_complete': 'alex',
  'rohan_arc_complete': 'rohan',
  'silas_arc_complete': 'silas',
  'elena_arc_complete': 'elena',
  'grace_arc_complete': 'grace'
}

/**
 * Check if an arc just completed based on state changes
 * Returns the character whose arc just completed, or null
 */
export function detectArcCompletion(
  previousState: GameState,
  currentState: GameState
): CharacterId | null {
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
export function getArcCompletionFlag(characterId: CharacterId): string {
  return `${characterId}_arc_complete`
}

