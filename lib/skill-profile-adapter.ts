/**
 * Skill Profile Adapter
 * Bridges between existing SkillTracker and dashboard requirements
 * Converts evidence-based skill data into comprehensive admin dashboard format
 */

import { SkillTracker, type SkillProfile as TrackerSkillProfile, type SamuelQuote } from './skill-tracker'
import { FutureSkills, SkillContext, CareerPath2030 } from './2030-skills-system'
import { logger } from './logger'

// Cache for profile loads to prevent duplicate requests
const profileCache = new Map<string, { profile: SkillProfile | null; timestamp: number }>()
const CACHE_TTL = 5000 // 5 seconds cache

export interface SkillDemonstration {
  scene: string
  choice?: string  // Actual player choice text (for quotes in briefings)
  sceneDescription?: string  // Scene context for narrative
  context: string  // Analysis/explanation of what was demonstrated
  value: number
  timestamp?: number  // For temporal analysis
  [key: string]: unknown // Add index signature
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
  timestamp?: number
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
  samuelQuotes?: SamuelQuote[] // Samuel's wisdom shared with this user
  learningObjectivesEngagement?: import('./learning-objectives-tracker').LearningObjectiveEngagement[] // Learning objectives engagement tracking
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
  const avgGap = path.requiredSkills.length > 0 ? totalGap / path.requiredSkills.length : 0

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
  _currentSkills: FutureSkills
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

function _calculateSkillFromContexts(contexts: SkillContext[], skillType: keyof FutureSkills): number {
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
  _currentSkills: FutureSkills
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
 * Load SkillProfile from Supabase or SkillTracker for a given user
 */
export async function loadSkillProfile(userId: string): Promise<SkillProfile | null> {
  if (typeof window === 'undefined') return null

  // Check cache first to prevent duplicate requests
  const cached = profileCache.get(userId)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    logger.debug('Using cached profile', { operation: 'skill-profile-adapter.load', userId })
    return cached.profile
  }

  try {
    // Try admin API first (uses service role key)
    try {
      const response = await fetch(`/api/admin/skill-data?userId=${encodeURIComponent(userId)}`, {
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.profile) {
          logger.debug('Loaded user from admin API', { operation: 'skill-profile-adapter.load', userId })
          const profile = convertSupabaseProfileToDashboard(result.profile)
          profileCache.set(userId, { profile, timestamp: Date.now() })
          return profile
        } else {
          console.warn(`[SkillProfileAdapter] Admin API returned unsuccessful result for ${userId}:`, result.error || 'Unknown error')
        }
      } else {
        const errorText = await response.text().catch(() => 'Unable to read error response')
        console.warn(`[SkillProfileAdapter] Admin API returned ${response.status} for ${userId}:`, errorText.substring(0, 200))
      }
    } catch (apiError: unknown) {
      console.warn(`[SkillProfileAdapter] Admin API failed for ${userId}:`, {
        message: (apiError as Error)?.message || 'Network or fetch error',
        name: (apiError as Error)?.name
      })
    }

    // Try career explorations API (optional - just for logging)
    try {
      const careerResponse = await fetch(`/api/user/career-explorations?userId=${encodeURIComponent(userId)}`, {
        credentials: 'include',
      })
      if (careerResponse.ok) {
        const careerResult = await careerResponse.json()
        if (careerResult.success && careerResult.careerExplorations) {
          logger.debug('Loaded career explorations', {
            operation: 'skill-profile-adapter.load',
            userId,
            count: careerResult.careerExplorations.length
          })
        }
      }
    } catch (_careerError) {
      console.warn(`[SkillProfileAdapter] Career explorations API failed for ${userId}`)
    }

    // Fallback to direct Supabase (may be blocked by RLS)
    // Note: This is a fallback if admin API fails - it may fail due to RLS policies
    try {
      const { supabase } = await import('./supabase')

      // PERFORMANCE FIX: Select only needed columns instead of SELECT *
      const { data: profile, error } = await supabase
        .from('player_profiles')
        .select(`
          user_id,
          current_scene,
          total_demonstrations,
          last_activity,
          skill_demonstrations(skill_name, scene_id, choice_text, context, demonstrated_at),
          skill_summaries(skill_name, demonstration_count, latest_context, scenes_involved, last_demonstrated),
          career_explorations(id, career_name, match_score, readiness_level, local_opportunities, education_paths),
          relationship_progress(character_name, trust_level, last_interaction, key_moments, interaction_count)
        `)
        .eq('user_id', userId)
        .single()

      if (error) {
        // Check if it's a network error (Supabase unreachable)
        const isNetworkError =
          error.message?.includes('Failed to fetch') ||
          error.message?.includes('fetch failed') ||
          !error.code // Network errors often don't have error codes

        if (!isNetworkError) {
          // Only log non-network errors (actual Supabase errors)
          console.warn(`[SkillProfileAdapter] Supabase direct query error for ${userId}:`, {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          })
        }
      } else if (profile) {
        logger.debug('Loaded user from Supabase', { operation: 'skill-profile-adapter.load', userId })
        const dashboardProfile = convertSupabaseProfileToDashboard(profile)
        profileCache.set(userId, { profile: dashboardProfile, timestamp: Date.now() })
        return dashboardProfile
      }
    } catch (supabaseError: unknown) {
      // Check if it's a network error (Supabase unreachable)
      const error = supabaseError instanceof Error ? supabaseError : new Error(String(supabaseError))
      const isNetworkError =
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('ERR_NAME_NOT_RESOLVED') ||
        error.name === 'TypeError' ||
        String(supabaseError).includes('fetch')

      if (!isNetworkError) {
        // Only log unexpected errors
        console.warn(`[SkillProfileAdapter] Supabase connection error for ${userId}:`, {
          message: error.message || 'Unknown error',
          name: error.name
        })
      }
    }

    // Fallback to localStorage
    logger.debug('Supabase empty, checking localStorage', { operation: 'skill-profile-adapter.load', userId })
    const tracker = new SkillTracker(userId)
    const trackerProfile = tracker.exportSkillProfile()

    // Check if user has any data
    if (trackerProfile.totalDemonstrations === 0) {
      return null
    }

    // Convert TrackerSkillProfile to dashboard SkillProfile
    return await convertTrackerProfileToDashboard(userId, trackerProfile)
  } catch (error) {
    console.error('Failed to load skill profile:', error)
    return null
  }
}

/**
 * Convert Supabase profile to dashboard-compatible format
 */
function convertSupabaseProfileToDashboard(supabaseProfile: Record<string, unknown>): SkillProfile {
  const userId = typeof supabaseProfile.user_id === 'string' ? supabaseProfile.user_id : ''

  // Convert skill demonstrations from skill_summaries
  const skillDemonstrations: SkillDemonstrations = {}
  const skillSummaries = Array.isArray(supabaseProfile.skill_summaries) ? supabaseProfile.skill_summaries : []
  skillSummaries.forEach((summary: unknown) => {
    if (typeof summary !== 'object' || summary === null) return
    const summaryObj = summary as Record<string, unknown>
    const skillName = typeof summaryObj.skill_name === 'string' ? summaryObj.skill_name : ''
    if (!skillName) return

    if (!skillDemonstrations[skillName]) {
      skillDemonstrations[skillName] = []
    }

    const count = typeof summaryObj.demonstration_count === 'number' ? summaryObj.demonstration_count : 0
    const scenes = Array.isArray(summaryObj.scenes_involved) ? summaryObj.scenes_involved : []
    const firstScene = typeof scenes[0] === 'string' ? scenes[0] : 'unknown_scene'
    const latestContext = typeof summaryObj.latest_context === 'string' ? summaryObj.latest_context : 'Skill demonstration'
    const lastDemonstrated = typeof summaryObj.last_demonstrated === 'string' ? summaryObj.last_demonstrated : new Date().toISOString()

    // Create demonstration entries based on demonstration_count
    for (let i = 0; i < count; i++) {
      skillDemonstrations[skillName].push({
        scene: firstScene,
        choice: 'Your choice',
        sceneDescription: firstScene.replace(/_/g, ' ').replace(/^\w/, (c: string) => c.toUpperCase()),
        context: latestContext,
        value: 1,
        timestamp: new Date(lastDemonstrated).getTime()
      })
    }
  })

  // Also include any legacy skill_demonstrations data
  const skillDemos = Array.isArray(supabaseProfile.skill_demonstrations) ? supabaseProfile.skill_demonstrations : []
  skillDemos.forEach((demo: unknown) => {
    if (typeof demo !== 'object' || demo === null) return
    const demoObj = demo as Record<string, unknown>
    const skillName = typeof demoObj.skill_name === 'string' ? demoObj.skill_name : ''
    if (!skillName) return

    if (!skillDemonstrations[skillName]) {
      skillDemonstrations[skillName] = []
    }
    const sceneId = typeof demoObj.scene_id === 'string' ? demoObj.scene_id : 'unknown_scene'
    const choiceText = typeof demoObj.choice_text === 'string' ? demoObj.choice_text : 'Your choice'
    const context = typeof demoObj.context === 'string' ? demoObj.context : 'Skill demonstration'
    const demonstratedAt = typeof demoObj.demonstrated_at === 'string' ? demoObj.demonstrated_at : new Date().toISOString()

    skillDemonstrations[skillName].push({
      scene: sceneId,
      choice: choiceText,
      sceneDescription: sceneId.replace(/_/g, ' ').replace(/^\w/, (c: string) => c.toUpperCase()),
      context,
      value: 1,
      timestamp: new Date(demonstratedAt).getTime()
    })
  })

  // Convert career matches
  const careerMatches: CareerMatch[] = []
  const careerExplorations = Array.isArray(supabaseProfile.career_explorations) ? supabaseProfile.career_explorations : []
  careerExplorations.forEach((career: unknown) => {
    if (typeof career !== 'object' || career === null) return
    const careerObj = career as Record<string, unknown>
    const id = typeof careerObj.id === 'string' ? careerObj.id : ''
    const name = typeof careerObj.career_name === 'string' ? careerObj.career_name : ''
    const matchScore = typeof careerObj.match_score === 'number' ? careerObj.match_score : 0
    const educationPaths = Array.isArray(careerObj.education_paths) ? careerObj.education_paths.map(p => String(p)) : []
    const localOpportunities = Array.isArray(careerObj.local_opportunities) ? careerObj.local_opportunities.map(o => String(o)) : []
    const readinessLevel = typeof careerObj.readiness_level === 'string' ? careerObj.readiness_level : 'exploratory'

    careerMatches.push({
      id,
      name,
      matchScore,
      requiredSkills: {}, // Would need to be populated from career data
      salaryRange: [40000, 80000] as [number, number], // Add required field
      educationPaths,
      localOpportunities,
      birminghamRelevance: 0.8, // Default value
      growthProjection: 'high' as const, // Fix: use correct type
      readiness: readinessLevel as CareerMatch['readiness']
    })
  })

  // Convert milestones (would need to be stored in Supabase)
  const milestones: string[] = []

  // Calculate skill gaps (simplified)
  const skillGaps: SkillGap[] = []
  const allSkills = ['criticalThinking', 'communication', 'collaboration', 'creativity', 'adaptability', 'leadership', 'digitalLiteracy', 'emotionalIntelligence', 'culturalCompetence', 'financialLiteracy', 'timeManagement', 'problemSolving']

  allSkills.forEach(skill => {
    const demos = skillDemonstrations[skill] || []
    if (demos.length < 3) { // Less than 3 demonstrations = gap
      const currentLevel = demos.length / 10 // Normalize to 0-1
      const targetLevel = 0.7
      skillGaps.push({
        skill,
        currentLevel,
        targetForTopCareers: targetLevel,
        gap: targetLevel - currentLevel, // Add required gap field
        developmentPath: `Practice ${skill} through more choices`,
        priority: demos.length === 0 ? 'high' : 'medium'
      })
    }
  })

  // Convert skill evolution to SkillEvolutionPoint[] (the correct interface)
  const skillEvolution: SkillEvolutionPoint[] = []
  const totalDemos = Object.values(skillDemonstrations).reduce((sum, demos) => sum + demos.length, 0)

  if (totalDemos > 0) {
    skillEvolution.push({
      checkpoint: 'Beginning their journey',
      totalDemonstrations: 0,
      timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000 // 7 days ago estimate
    })

    if (totalDemos >= 5) {
      skillEvolution.push({
        checkpoint: 'Building confidence',
        totalDemonstrations: Math.floor(totalDemos / 2),
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000 // 3 days ago estimate
      })
    }

    skillEvolution.push({
      checkpoint: 'Active skill development',
      totalDemonstrations: totalDemos,
      timestamp: Date.now()
    })
  }

  // Convert key skill moments
  const keySkillMoments: KeySkillMoment[] = []
  Object.entries(skillDemonstrations).forEach(([skill, demos]) => {
    if (demos.length > 0) {
      const latestDemo = demos[demos.length - 1]
      keySkillMoments.push({
        scene: latestDemo.scene,
        choice: latestDemo.choice || latestDemo.context, // Ensure choice is never undefined
        skillsDemonstrated: [skill],
        insight: latestDemo.context
      })
    }
  })

  // Calculate total demonstrations from skill_summaries
  const skillSummariesArray = Array.isArray(supabaseProfile.skill_summaries) ? supabaseProfile.skill_summaries : []
  const totalDemonstrations = skillSummariesArray.length > 0
    ? skillSummariesArray.reduce((sum: number, summary: unknown) => {
      if (typeof summary !== 'object' || summary === null) return sum
      const summaryObj = summary as Record<string, unknown>
      const count = typeof summaryObj.demonstration_count === 'number' ? summaryObj.demonstration_count : 0
      return sum + count
    }, 0)
    : (typeof supabaseProfile.total_demonstrations === 'number' ? supabaseProfile.total_demonstrations : 0)

  return {
    userId,
    userName: `User ${userId.slice(0, 8)}`,
    skillDemonstrations,
    careerMatches,
    skillEvolution,
    keySkillMoments,
    skillGaps,
    totalDemonstrations,
    milestones
  }
}

/**
 * Convert SkillTracker profile to dashboard-compatible format
 */
async function convertTrackerProfileToDashboard(
  userId: string,
  trackerProfile: TrackerSkillProfile
): Promise<SkillProfile> {
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
    // SkillTracker already provides fully populated requiredSkills with current/required/gap
    // Just pass it through directly
    const requiredSkills = match.requiredSkills || {}

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
    checkpoint: milestone.checkpoint.replace(/Start/g, 'Beginning their journey')
      .replace(/Mid-Journey/g, 'Building confidence')
      .replace(/Current/g, 'Active skill development'),
    totalDemonstrations: milestone.demonstrationCount || 0,
    timestamp: milestone.timestamp
  }))

  // Extract key skill moments (top demonstrations)
  // Group by scene+choice to avoid duplicate insights for the same choice
  const keySkillMoments: KeySkillMoment[] = []
  const seenChoices = new Set<string>()

  Object.entries(skillDemonstrations).forEach(([skill, demos]) => {
    if (demos.length > 0) {
      demos.forEach(demo => {
        const choiceKey = `${demo.scene}:${demo.choice || demo.context}`

        // If we haven't seen this choice before, create a new moment
        if (!seenChoices.has(choiceKey)) {
          seenChoices.add(choiceKey)

          // Find all skills demonstrated by this same choice
          const allSkillsFromChoice: string[] = []
          Object.entries(skillDemonstrations).forEach(([otherSkill, otherDemos]) => {
            if (otherDemos.some(d => `${d.scene}:${d.choice || d.context}` === choiceKey)) {
              allSkillsFromChoice.push(otherSkill)
            }
          })

          keySkillMoments.push({
            scene: demo.scene,
            choice: demo.choice || demo.context,
            skillsDemonstrated: allSkillsFromChoice.length > 0 ? allSkillsFromChoice : [skill],
            insight: demo.context
          })
        }
      })
    }
  })

  // Sort by most skills demonstrated and take top 5
  keySkillMoments.sort((a, b) => b.skillsDemonstrated.length - a.skillsDemonstrated.length)
  keySkillMoments.splice(5) // Keep only top 5

  // Calculate internal skill levels for gap analysis only (not exported)
  const internalSkills: FutureSkills = {
    criticalThinking: 0,
    communication: 0,
    collaboration: 0,
    creativity: 0,
    adaptability: 0,
    leadership: 0,
    digitalLiteracy: 0,
    emotionalIntelligence: 0,
    culturalCompetence: 0,
    financialLiteracy: 0,
    timeManagement: 0,
    problemSolving: 0,
    systemsThinking: 0,
    crisisManagement: 0,
    instructionalDesign: 0,
    riskManagement: 0,
    courage: 0,
    informationLiteracy: 0,
    learningAgility: 0,
    entrepreneurship: 0,
    encouragement: 0,
    technicalLiteracy: 0,
    sustainability: 0,
    strategicThinking: 0,
    integrity: 0,
    mentorship: 0,
    wisdom: 0,
    actionOrientation: 0,
    psychology: 0,
    grounding: 0,
    groundedResearch: 0,
    observation: 0,
    urgency: 0,
    resilience: 0,
    groundedness: 0,
    humor: 0,
    pedagogy: 0,
    curriculumDesign: 0,
    marketing: 0,
    branding: 0,
    strategy: 0,
    deepWork: 0,
    pragmatism: 0,
    humility: 0,
    fairness: 0,
    coding: 0,
    respect: 0,
    curiosity: 0,
    patience: 0,
    triage: 0,
    empathy: 0,
    accountability: 0,
    visionaryThinking: 0,
    promptEngineering: 0,

    // Content-Referenced Skills
    activeListening: 0,
    attentionToDetail: 0,
    contentCreation: 0,
    cybersecurity: 0,
    dataAnalysis: 0,
    dataLiteracy: 0,
    ethicalReasoning: 0,
    selfMarketing: 0,

    // Simulation Skills (Jan 13, 2026)
    projectManagement: 0,
    metaphoricalThinking: 0,
    negotiation: 0,
    confidence: 0,
    values: 0,
    growth: 0,
    openness: 0,
    selfAwareness: 0,
    compliance: 0,
    technology: 0,
    socialLearning: 0,
    prioritization: 0,
    discipline: 0,
    purpose: 0,
    utilitarian: 0,
    distributedSystems: 0,
    observability: 0,
    incidentManagement: 0,
    debuggingMastery: 0,
    debugging: 0,
    mastery: 0
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

  // Load learning objectives engagement
  let learningObjectivesEngagement: import('./learning-objectives-tracker').LearningObjectiveEngagement[] | undefined
  try {
    if (typeof window !== 'undefined') {
      const { getLearningObjectivesTracker } = await import('./learning-objectives-tracker')
      const objectivesTracker = getLearningObjectivesTracker(userId)
      learningObjectivesEngagement = objectivesTracker.exportEngagements()
    }
  } catch (error) {
    console.warn('[SkillProfileAdapter] Failed to load learning objectives:', error)
  }

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
    milestones: trackerProfile.milestones.map(m => m.checkpoint),
    samuelQuotes: trackerProfile.samuelQuotes || [],
    learningObjectivesEngagement
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
 * Uses admin API (server-side with service role) to bypass RLS, falls back to localStorage
 */
export async function getAllUserIds(): Promise<string[]> {
  if (typeof window === 'undefined') return []

  try {
    // Try admin API first (uses service role key, bypasses RLS)
    try {
      const response = await fetch('/api/admin/user-ids', {
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.userIds) {
          logger.debug('Loaded user IDs from admin API', { operation: 'skill-profile-adapter.load-user-ids', count: result.userIds.length })
          return result.userIds
        }
      } else {
        // Handle specific error cases
        if (response.status === 401) {
          console.warn(`[SkillProfileAdapter] Admin authentication required. Please log in at /admin/login`)
          // Don't throw - fall through to localStorage fallback
        } else {
          const errorText = await response.text().catch(() => 'Unable to read error response')
          console.warn(`[SkillProfileAdapter] Admin user-ids API returned ${response.status}:`, errorText.substring(0, 200))
        }
      }
    } catch (apiError: unknown) {
      // Network errors, CORS issues, etc.
      const error = apiError instanceof Error ? apiError : new Error(String(apiError))
      logger.warn('Admin user-ids API request failed', {
        operation: 'skill-profile-adapter.getAllUserIds',
        message: error.message,
        name: error.name
      })
      // Don't throw - fall through to localStorage fallback
    }

    // Fallback to localStorage
    logger.debug('Admin API failed, checking localStorage', { operation: 'skill-profile-adapter.getAllUserIds' })
    const keys = Object.keys(localStorage)
    const trackerKeys = keys.filter(k => k.startsWith('skill_tracker_'))
    const userIds = trackerKeys.map(k => k.replace('skill_tracker_', ''))
    logger.debug('Found users in localStorage', {
      operation: 'skill-profile-adapter.getAllUserIds',
      count: userIds.length
    })

    // Filter to only users with actual demonstration data
    return userIds.filter(userId => {
      const tracker = new SkillTracker(userId)
      const profile = tracker.exportSkillProfile()
      return profile.totalDemonstrations > 0
    })
  } catch (error) {
    console.error('[SkillProfileAdapter] Failed to get user IDs:', error)
    return []
  }
}
