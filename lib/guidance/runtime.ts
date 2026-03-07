import { calculateCareerMatchesFromSkills, countSkillDemonstrations } from '@/lib/2030-skills-system'
import type { GuidanceInput } from '@/lib/guidance/contracts'
import { deriveJourneyLaneSummary } from '@/lib/journey-lane'
import type { SerializableGameState } from '@/lib/character-state'
import { getBirminghamOpportunities } from '@/content/birmingham-opportunities'

const BIRMINGHAM_OPPORTUNITIES = getBirminghamOpportunities().getFilteredOpportunities({})

type CareerReadinessLike = { readiness?: string | null }

export function countUnlockedOpportunities(
  patterns: Record<string, number | undefined> | null | undefined,
): number {
  const patternRecord = patterns ?? {}
  return BIRMINGHAM_OPPORTUNITIES.filter((opportunity) => {
    const currentLevel = patternRecord[opportunity.unlockCondition.pattern] ?? 0
    return currentLevel >= opportunity.unlockCondition.minLevel
  }).length
}

export function countNearReadyCareerMatches(
  careerMatches: readonly CareerReadinessLike[],
): number {
  return careerMatches.filter((career) => career.readiness === 'near_ready').length
}

export function createGuidanceInputFromRuntime(options: {
  playerId: string
  skills?: Record<string, number> | null
  careerMatches?: readonly CareerReadinessLike[] | null
  totalDemonstrations?: number | null
  skillCountOverride?: number | null
  unlockedOpportunityCountOverride?: number | null
  saveSnapshot?: SerializableGameState | null
  taskProgress: GuidanceInput['taskProgress']
  nowIso?: string
}): GuidanceInput {
  const skills = options.skills ?? {}
  const careerMatches =
    options.careerMatches ??
    (Object.keys(skills).length > 0
      ? calculateCareerMatchesFromSkills(skills).map((career) => ({ readiness: career.readiness }))
      : [])
  const journeySummary = deriveJourneyLaneSummary(options.saveSnapshot)
  const totalDemonstrations =
    options.totalDemonstrations ?? countSkillDemonstrations(skills)
  const skillCount =
    options.skillCountOverride ?? countSkillDemonstrations(skills)

  return {
    playerId: options.playerId,
    totalDemonstrations,
    skillCount,
    careerMatchCount: careerMatches.length,
    nearReadyCareerCount: countNearReadyCareerMatches(careerMatches),
    unlockedOpportunityCount:
      options.unlockedOpportunityCountOverride ??
      countUnlockedOpportunities(
        options.saveSnapshot?.patterns as Record<string, number | undefined> | undefined,
      ),
    openReturnsCount: journeySummary.openReturnsCount,
    hasJourneySave: journeySummary.hasJourney,
    currentCharacterLabel: journeySummary.nextReturnLabel ?? journeySummary.heldRouteLabel,
    dominantPatternLabel: journeySummary.dominantPatternLabel,
    taskProgress: options.taskProgress,
    nowIso: options.nowIso,
  }
}
