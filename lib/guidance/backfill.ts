import {
  GuidancePersistenceRecordSchema,
  GuidanceSnapshotSchema,
} from '@/lib/guidance/contracts'

export type GuidanceBackfillCandidateSource =
  | 'user_action_plans'
  | 'player_profiles.last_action_plan'

export type GuidanceBackfillCandidateReason =
  | 'ok'
  | 'missing_record'
  | 'missing_snapshot'
  | 'missing_both'

export type GuidanceBackfillCandidate = {
  userId: string
  source: GuidanceBackfillCandidateSource
  hasRecord: boolean
  hasSnapshot: boolean
  valid: boolean
  reason: GuidanceBackfillCandidateReason
  plan: Record<string, unknown>
}

export type GuidanceBackfillCandidateSummary = {
  total: number
  valid: number
  invalid: number
  invalidReasons: Partial<Record<GuidanceBackfillCandidateReason, number>>
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function classifyGuidancePlan(params: {
  userId: string
  source: GuidanceBackfillCandidateSource
  plan: unknown
}): GuidanceBackfillCandidate | null {
  if (!isPlainObject(params.plan)) return null

  const maybeAdaptiveGuidance = params.plan.adaptiveGuidance
  if (!isPlainObject(maybeAdaptiveGuidance)) return null

  const hasRecord = GuidancePersistenceRecordSchema.safeParse(
    maybeAdaptiveGuidance.record,
  ).success
  const hasSnapshot = GuidanceSnapshotSchema.safeParse(
    maybeAdaptiveGuidance.snapshot,
  ).success

  let reason: GuidanceBackfillCandidateReason = 'ok'
  if (!hasRecord && !hasSnapshot) reason = 'missing_both'
  else if (!hasRecord) reason = 'missing_record'
  else if (!hasSnapshot) reason = 'missing_snapshot'

  return {
    userId: params.userId,
    source: params.source,
    hasRecord,
    hasSnapshot,
    valid: hasRecord && hasSnapshot,
    reason,
    plan: params.plan,
  }
}

export function summarizeGuidanceCandidates(
  candidates: GuidanceBackfillCandidate[],
): GuidanceBackfillCandidateSummary {
  const invalidReasons = candidates
    .filter((candidate) => !candidate.valid)
    .reduce<Partial<Record<GuidanceBackfillCandidateReason, number>>>(
      (acc, candidate) => {
        acc[candidate.reason] = (acc[candidate.reason] ?? 0) + 1
        return acc
      },
      {},
    )

  const valid = candidates.filter((candidate) => candidate.valid).length

  return {
    total: candidates.length,
    valid,
    invalid: candidates.length - valid,
    invalidReasons,
  }
}

export function isMissingColumnError(error: { code?: string } | null | undefined): boolean {
  return error?.code === '42703'
}
