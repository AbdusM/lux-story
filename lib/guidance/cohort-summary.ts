import { buildAdminGuidanceDiagnostics } from '@/lib/guidance/admin-diagnostics'
import { isInternalGuidanceValidationUserId } from '@/lib/guidance/internal-users'
import {
  getAdaptiveGuidanceRolloutConfig,
  type GuidanceRolloutConfig,
} from '@/lib/guidance/rollout'
import { extractGuidancePlanEnvelope } from '@/lib/guidance/storage'
import type {
  AdminGuidanceCohortMetrics,
  AdminGuidanceCohortSummary,
} from '@/lib/types/admin-api'

type GuidancePlanSummaryRow = {
  user_id: string
  plan_data?: unknown
  last_action_plan?: unknown
}

type GuidanceSummaryEventRow = {
  user_id: string
  event_type: string
  occurred_at: string | null
  payload: unknown
}

type CohortAccumulator = {
  cohort: 'control' | 'adaptive'
  userCount: number
  recommendationShown: number
  recommendationClicked: number
  recommendationDismissed: number
  taskCompleted: number
  artifactExported: number
  initiativeSum: number
  followThroughSum: number
  recoverySum: number
  dimensionCount: number
  stalledUserCount: number
}

function roundRate(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0
  return Math.round((numerator / denominator) * 100)
}

function toRolloutStatus(config: GuidanceRolloutConfig) {
  return {
    mode: config.mode,
    adaptivePercentage: config.adaptivePercentage,
    controlPercentage: config.controlPercentage,
    isKillSwitchActive: config.isKillSwitchActive,
  }
}

function createAccumulator(cohort: 'control' | 'adaptive'): CohortAccumulator {
  return {
    cohort,
    userCount: 0,
    recommendationShown: 0,
    recommendationClicked: 0,
    recommendationDismissed: 0,
    taskCompleted: 0,
    artifactExported: 0,
    initiativeSum: 0,
    followThroughSum: 0,
    recoverySum: 0,
    dimensionCount: 0,
    stalledUserCount: 0,
  }
}

function finalizeAccumulator(accumulator: CohortAccumulator): AdminGuidanceCohortMetrics {
  return {
    cohort: accumulator.cohort,
    userCount: accumulator.userCount,
    recommendationShown: accumulator.recommendationShown,
    recommendationClicked: accumulator.recommendationClicked,
    recommendationDismissed: accumulator.recommendationDismissed,
    taskCompleted: accumulator.taskCompleted,
    artifactExported: accumulator.artifactExported,
    ctr: roundRate(accumulator.recommendationClicked, accumulator.recommendationShown),
    completionRate: roundRate(accumulator.taskCompleted, accumulator.recommendationShown),
    dismissRate: roundRate(
      accumulator.recommendationDismissed,
      accumulator.recommendationShown,
    ),
    artifactExportRate: roundRate(
      accumulator.artifactExported,
      accumulator.taskCompleted,
    ),
    averageInitiative:
      accumulator.dimensionCount > 0
        ? Math.round(accumulator.initiativeSum / accumulator.dimensionCount)
        : null,
    averageFollowThrough:
      accumulator.dimensionCount > 0
        ? Math.round(accumulator.followThroughSum / accumulator.dimensionCount)
        : null,
    averageRecoveryAfterFriction:
      accumulator.dimensionCount > 0
        ? Math.round(accumulator.recoverySum / accumulator.dimensionCount)
        : null,
    stalledUserCount: accumulator.stalledUserCount,
  }
}

export function buildAdminGuidanceCohortSummary(params: {
  planRows: GuidancePlanSummaryRow[]
  interactionEvents: GuidanceSummaryEventRow[]
  days: number
  userLimit: number
  generatedAt?: string
  rolloutConfig?: GuidanceRolloutConfig
  truncated?: boolean
  includeInternalUsers?: boolean
}): AdminGuidanceCohortSummary {
  const rolloutConfig = params.rolloutConfig ?? getAdaptiveGuidanceRolloutConfig()
  const generatedAt = params.generatedAt ?? new Date().toISOString()
  const plansByUser = new Map<string, unknown>()

  for (const row of params.planRows) {
    if (!params.includeInternalUsers && isInternalGuidanceValidationUserId(row.user_id)) {
      continue
    }

    const plan = row.plan_data ?? row.last_action_plan ?? null
    if (!extractGuidancePlanEnvelope(plan)?.adaptiveGuidance?.record) continue
    plansByUser.set(row.user_id, plan)
  }

  const interactionEventsByUser = new Map<string, GuidanceSummaryEventRow[]>()
  for (const event of params.interactionEvents) {
    if (!plansByUser.has(event.user_id)) continue

    const current = interactionEventsByUser.get(event.user_id) ?? []
    current.push(event)
    interactionEventsByUser.set(event.user_id, current)
  }

  const accumulators = {
    control: createAccumulator('control'),
    adaptive: createAccumulator('adaptive'),
  }

  for (const [userId, plan] of plansByUser.entries()) {
    const diagnostics = buildAdminGuidanceDiagnostics({
      plan,
      interactionEvents: interactionEventsByUser.get(userId) ?? [],
    })
    const accumulator = accumulators[diagnostics.experimentVariant]

    accumulator.userCount += 1
    accumulator.recommendationShown += diagnostics.eventCounts.recommendationShown
    accumulator.recommendationClicked += diagnostics.eventCounts.recommendationClicked
    accumulator.recommendationDismissed += diagnostics.eventCounts.recommendationDismissed
    accumulator.taskCompleted += diagnostics.eventCounts.taskCompleted
    accumulator.artifactExported += diagnostics.eventCounts.artifactExported

    if (diagnostics.dimensions) {
      accumulator.dimensionCount += 1
      accumulator.initiativeSum += diagnostics.dimensions.initiative
      accumulator.followThroughSum += diagnostics.dimensions.followThrough
      accumulator.recoverySum += diagnostics.dimensions.recoveryAfterFriction
    }

    if (diagnostics.stalledTasks.length > 0) {
      accumulator.stalledUserCount += 1
    }
  }

  return {
    generatedAt,
    days: params.days,
    userLimit: params.userLimit,
    rollout: toRolloutStatus(rolloutConfig),
    totals: {
      usersWithGuidance: plansByUser.size,
      controlUsers: accumulators.control.userCount,
      adaptiveUsers: accumulators.adaptive.userCount,
    },
    cohorts: [
      finalizeAccumulator(accumulators.control),
      finalizeAccumulator(accumulators.adaptive),
    ],
    metadata: {
      planRowsScanned: params.planRows.length,
      eventRowsScanned: params.interactionEvents.length,
      truncated: params.truncated ?? false,
    },
  }
}
