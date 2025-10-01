/**
 * Skill Profile Adapter
 * Bridges between existing SkillTracker and dashboard requirements
 * Converts evidence-based skill data into comprehensive admin dashboard format
 */

import { SkillTracker, type SkillProfile as TrackerSkillProfile } from './skill-tracker'
import { FutureSkills, SkillContext, CareerPath2030 } from './2030-skills-system'

export interface SkillDemonstration {
  scene: string
  choice?: string  // Actual player choice text (for quotes in briefings)
  sceneDescription?: string  // Scene context for narrative
  context: string  // Analysis/explanation of what was demonstrated
  value: number
  timestamp?: number  // For temporal analysis
}

export interface SkillDemonstrations {
  [skillKey: string]: SkillDemonstration[]
}

export interface CareerMatch {
  id: string
  name: string
  matchScore: number
  requiredSkills: {
    [skillKey: string]: {
      current: number
      required: number
      gap: number
    }
  }
  salaryRange: [number, number]
  educationPaths: string[]
  localOpportunities: string[]
  birminghamRelevance: number
  growthProjection: 'high' | 'medium' | 'stable'
  readiness: 'near_ready' | 'skill_gaps' | 'exploratory'
}

export interface SkillEvolutionPoint {
  checkpoint: string
  totalDemonstrations: number  // Evidence-based metric
  timestamp: number
}

export interface KeySkillMoment {
  scene: string
  choice: string
  skillsDemonstrated: string[]
  insight: string
}

export interface SkillGap {
  skill: string
  currentLevel: number
  targetForTopCareers: number
  gap: number
  priority: 'high' | 'medium' | 'low'
  developmentPath: string
}

export interface SkillProfile {
  userId: string
  userName: string
  // Removed: skills: FutureSkills (evidence-first: no scores!)
  skillDemonstrations: SkillDemonstrations
  careerMatches: CareerMatch[]
  skillEvolution: SkillEvolutionPoint[]
  keySkillMoments: KeySkillMoment[]
  skillGaps: SkillGap[]
  totalDemonstrations: number
  milestones: string[]
}

/**
 * Convert SkillContext[] to SkillDemonstrations format
 */
function convertSkillContexts(contexts: SkillContext[]): SkillDemonstrations {
  const demonstrations: SkillDemonstrations = {}

  contexts.forEach(context => {
    const skillKey = context.skillType
    if (!demonstrations[skillKey]) {
      demonstrations[skillKey] = []
    }

    demonstrations[skillKey].push({
      scene: context.sceneId,
      context: context.context,
      value: context.skillValue
    })
  })

  return demonstrations
}

/**
 * Convert CareerPath2030 to CareerMatch format with readiness assessment
 */
function convertCareerPath(
  path: CareerPath2030 & { matchScore: number },
  currentSkills: FutureSkills
): CareerMatch {
  const requiredSkills: CareerMatch['requiredSkills'] = {}

  // Build required skills comparison
  path.requiredSkills.forEach(skillKey => {
    const required = path.skillLevels[skillKey] || 0.5
    const current = currentSkills[skillKey] || 0.5
    const gap = Math.max(0, required - current)

    requiredSkills[skillKey] = {
      current,
      required,
      gap
    }
  })

  // Calculate average gap to determine readiness
  const totalGap = Object.values(requiredSkills).reduce((sum, skill) => sum + skill.gap, 0)
  const avgGap = totalGap / path.requiredSkills.length

  let readiness: CareerMatch['readiness']
  if (avgGap < 0.1) {
    readiness = 'near_ready'
  } else if (avgGap < 0.2) {
    readiness = 'skill_gaps'
  } else {
    readiness = 'exploratory'
  }

  return {
    id: path.id,
    name: path.name,
    matchScore: path.matchScore,
    requiredSkills,
    salaryRange: path.salaryRange,
    educationPaths: path.educationPath,
    localOpportunities: path.localOpportunities,
    birminghamRelevance: path.birminghamRelevance,
    growthProjection: path.growthProjection,
    readiness
  }
}

/**
 * Generate skill evolution from skill contexts (evidence-based)
 */
function generateSkillEvolution(
  contexts: SkillContext[],
  currentSkills: FutureSkills
): SkillEvolutionPoint[] {
  const evolution: SkillEvolutionPoint[] = []

  // Start point (baseline)
  evolution.push({
    checkpoint: 'Start',
    totalDemonstrations: 0,
    timestamp: Date.now() - (contexts.length * 300000) // Estimate start time
  })

  // Calculate midpoint from first half of contexts
  if (contexts.length >= 4) {
    const midpoint = Math.floor(contexts.length / 2)

    evolution.push({
      checkpoint: 'Mid-Journey',
      totalDemonstrations: midpoint,
      timestamp: Date.now() - (contexts.length * 150000) // Estimate mid time
    })
  }

  // Current point
  evolution.push({
    checkpoint: 'Current',
    totalDemonstrations: contexts.length,
    timestamp: Date.now()
  })

  return evolution
}

function calculateSkillFromContexts(contexts: SkillContext[], skillType: keyof FutureSkills): number {
  const relevantContexts = contexts.filter(c => c.skillType === skillType)
  if (relevantContexts.length === 0) return 0.5

  const avgValue = relevantContexts.reduce((sum, c) => sum + c.skillValue, 0) / relevantContexts.length
  return Math.min(1, Math.max(0, 0.5 + (avgValue - 0.5) * 0.5)) // Gradual improvement from baseline
}

/**
 * Extract key skill moments from contexts
 */
function extractKeySkillMoments(contexts: SkillContext[]): KeySkillMoment[] {
  // Group by scene
  const sceneContexts = new Map<string, SkillContext[]>()
  contexts.forEach(context => {
    if (!sceneContexts.has(context.sceneId)) {
      sceneContexts.set(context.sceneId, [])
    }
    sceneContexts.get(context.sceneId)!.push(context)
  })

  // Find scenes with multiple high-value skill demonstrations
  const moments: KeySkillMoment[] = []

  sceneContexts.forEach((sceneContextsList, sceneId) => {
    const highValueSkills = sceneContextsList
      .filter(c => c.skillValue > 0.7)
      .sort((a, b) => b.skillValue - a.skillValue)
      .slice(0, 3)

    if (highValueSkills.length >= 2) {
      moments.push({
        scene: sceneId,
        choice: highValueSkills[0].choiceText,
        skillsDemonstrated: highValueSkills.map(c => c.skillType),
        insight: highValueSkills[0].explanation
      })
    }
  })

  return moments.slice(0, 5) // Top 5 moments
}

/**
 * Calculate skill gaps based on top career matches
 */
function calculateSkillGaps(
  careerMatches: CareerMatch[],
  currentSkills: FutureSkills
): SkillGap[] {
  const gaps: SkillGap[] = []
  const skillGapMap = new Map<string, { current: number; targets: number[]; paths: string[] }>()

  // Collect gaps from top 3 career matches
  careerMatches.slice(0, 3).forEach(career => {
    Object.entries(career.requiredSkills).forEach(([skillKey, skillData]) => {
      if (skillData.gap > 0) {
        if (!skillGapMap.has(skillKey)) {
          skillGapMap.set(skillKey, {
            current: skillData.current,
            targets: [],
            paths: []
          })
        }
        skillGapMap.get(skillKey)!.targets.push(skillData.required)
        skillGapMap.get(skillKey)!.paths.push(career.name)
      }
    })
  })

  // Convert to SkillGap format
  skillGapMap.forEach((data, skillKey) => {
    const avgTarget = data.targets.reduce((sum, t) => sum + t, 0) / data.targets.length
    const gap = avgTarget - data.current

    let priority: SkillGap['priority']
    if (gap > 0.2) priority = 'high'
    else if (gap > 0.1) priority = 'medium'
    else priority = 'low'

    gaps.push({
      skill: skillKey,
      currentLevel: data.current,
      targetForTopCareers: avgTarget,
      gap,
      priority,
      developmentPath: `Needed for: ${data.paths.join(', ')}`
    })
  })

  return gaps.sort((a, b) => b.gap - a.gap).slice(0, 5)
}

/**
 * Create SkillProfile from FutureSkillsSystem data
 */
export function createSkillProfile(
  userId: string,
  skills: FutureSkills,
  skillContexts: SkillContext[],
  careerPaths: (CareerPath2030 & { matchScore: number })[]
): SkillProfile {
  const skillDemonstrations = convertSkillContexts(skillContexts)
  const careerMatches = careerPaths.map(path => convertCareerPath(path, skills))
  const skillEvolution = generateSkillEvolution(skillContexts, skills)
  const keySkillMoments = extractKeySkillMoments(skillContexts)
  const skillGaps = calculateSkillGaps(careerMatches, skills)

  // Generate milestones based on skill contexts
  const milestones: string[] = []
  if (skillContexts.length >= 5) milestones.push('Completed 5+ skill demonstrations')
  if (skillContexts.length >= 10) milestones.push('Completed 10+ skill demonstrations')
  if (careerMatches.some(c => c.readiness === 'near_ready')) milestones.push('Near-ready for career path')
  if (Object.values(skills).some(v => v > 0.8)) milestones.push('Achieved advanced skill level')

  return {
    userId,
    userName: `User ${userId.slice(0, 8)}`,
    // No skills property - evidence-first!
    skillDemonstrations,
    careerMatches,
    skillEvolution,
    keySkillMoments,
    skillGaps,
    totalDemonstrations: skillContexts.length,
    milestones
  }
}

/**
 * Load SkillProfile from SkillTracker for a given user
 */
export function loadSkillProfile(userId: string): SkillProfile | null {
  if (typeof window === 'undefined') return null

  try {
    // Load from existing SkillTracker
    const tracker = new SkillTracker(userId)
    const trackerProfile = tracker.exportSkillProfile()

    // Check if user has any data
    if (trackerProfile.totalDemonstrations === 0) {
      return null
    }

    // Convert TrackerSkillProfile to dashboard SkillProfile
    return convertTrackerProfileToDashboard(userId, trackerProfile)
  } catch (error) {
    console.error('Failed to load skill profile:', error)
    return null
  }
}

/**
 * Convert SkillTracker profile to dashboard-compatible format
 */
function convertTrackerProfileToDashboard(
  userId: string,
  trackerProfile: TrackerSkillProfile
): SkillProfile {
  // Convert skill demonstrations to expected format
  const skillDemonstrations: SkillDemonstrations = {}
  Object.entries(trackerProfile.skillDemonstrations).forEach(([skill, demos]) => {
    skillDemonstrations[skill] = demos.map(demo => ({
      scene: demo.scene,
      choice: demo.choice,  // CRITICAL: Preserve actual choice text for quotes
      sceneDescription: demo.sceneDescription,  // Scene context
      context: demo.context,  // Analysis/explanation
      value: 0.8, // Default high value since they demonstrated it
      timestamp: demo.timestamp  // Temporal data for evolution tracking
    }))
  })

  // Convert career matches to dashboard format
  const careerMatches: CareerMatch[] = trackerProfile.careerMatches.map(match => {
    // Build required skills object (simplified since we don't have detailed requirements)
    const requiredSkills: CareerMatch['requiredSkills'] = {}

    // Map readiness values from SkillTracker to dashboard format
    let readiness: CareerMatch['readiness']
    if (match.readiness === 'near_ready') {
      readiness = 'near_ready'
    } else if (match.readiness === 'developing') {
      readiness = 'skill_gaps'
    } else {
      readiness = 'exploratory'
    }

    return {
      id: match.name.toLowerCase().replace(/\s+/g, '-'),
      name: match.name,
      matchScore: match.matchScore,
      requiredSkills,
      salaryRange: match.salaryRange,
      educationPaths: match.educationPaths,
      localOpportunities: match.localOpportunities,
      birminghamRelevance: 0.9, // High by default for Birmingham careers
      growthProjection: 'high' as const,
      readiness
    }
  })

  // Generate skill evolution from milestones (evidence-based)
  const skillEvolution: SkillEvolutionPoint[] = trackerProfile.milestones.map(milestone => ({
    checkpoint: milestone.checkpoint,
    totalDemonstrations: milestone.demonstrationCount || 0,
    timestamp: milestone.timestamp
  }))

  // Extract key skill moments (top demonstrations)
  const keySkillMoments: KeySkillMoment[] = []
  Object.entries(skillDemonstrations).slice(0, 5).forEach(([skill, demos]) => {
    if (demos.length > 0) {
      const demo = demos[0]
      keySkillMoments.push({
        scene: demo.scene,
        choice: demo.choice || demo.context,  // Use actual choice text, fallback to context
        skillsDemonstrated: [skill],
        insight: demo.context  // Use context for the analysis/insight
      })
    }
  })

  // Calculate internal skill levels for gap analysis only (not exported)
  const internalSkills: FutureSkills = {
    criticalThinking: 0.5,
    communication: 0.5,
    collaboration: 0.5,
    creativity: 0.5,
    adaptability: 0.5,
    leadership: 0.5,
    digitalLiteracy: 0.5,
    emotionalIntelligence: 0.5,
    culturalCompetence: 0.5,
    financialLiteracy: 0.5,
    timeManagement: 0.5,
    problemSolving: 0.5
  }

  // Boost internal levels based on demonstrations (for algorithms only)
  Object.keys(skillDemonstrations).forEach(skill => {
    if (skill in internalSkills) {
      const demos = skillDemonstrations[skill]
      internalSkills[skill as keyof FutureSkills] = Math.min(0.5 + (demos.length * 0.1), 0.95)
    }
  })

  // Generate skill gaps using internal levels
  const skillGaps = calculateSkillGaps(careerMatches, internalSkills)

  return {
    userId,
    userName: `User ${userId.slice(0, 8)}`,
    // No skills property - evidence-first!
    skillDemonstrations,
    careerMatches,
    skillEvolution,
    keySkillMoments,
    skillGaps,
    totalDemonstrations: trackerProfile.totalDemonstrations,
    milestones: trackerProfile.milestones.map(m => m.checkpoint)
  }
}

/**
 * Save skill data to localStorage for admin dashboard access
 */
export function saveSkillData(
  userId: string,
  skills: FutureSkills,
  skillContexts: SkillContext[],
  careerPaths: (CareerPath2030 & { matchScore: number })[]
): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(`future_skills_${userId}`, JSON.stringify(skills))
    localStorage.setItem(`skill_contexts_${userId}`, JSON.stringify(skillContexts))
    localStorage.setItem(`career_paths_${userId}`, JSON.stringify(careerPaths))
  } catch (error) {
    console.error('Failed to save skill data:', error)
  }
}

/**
 * Get all user IDs with skill data
 * Looks for SkillTracker data in localStorage
 */
export function getAllUserIds(): string[] {
  if (typeof window === 'undefined') return []

  try {
    const keys = Object.keys(localStorage)
    // SkillTracker stores data with key format: skill_tracker_{userId}
    const trackerKeys = keys.filter(k => k.startsWith('skill_tracker_'))
    const userIds = trackerKeys.map(k => k.replace('skill_tracker_', ''))

    // Filter to only users with actual demonstration data
    return userIds.filter(userId => {
      const tracker = new SkillTracker(userId)
      const profile = tracker.exportSkillProfile()
      return profile.totalDemonstrations > 0
    })
  } catch (error) {
    console.error('Failed to get user IDs:', error)
    return []
  }
}
