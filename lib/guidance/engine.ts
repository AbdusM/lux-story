import {
  GUIDANCE_ONTOLOGY_VERSION,
  GUIDANCE_RECOMMENDATION_VERSION,
  GUIDANCE_SCHEMA_VERSION,
  type GuidanceDimensions,
  type GuidanceEvent,
  type GuidanceInput,
  type GuidancePersistenceRecord,
  type GuidanceRecommendation,
  type GuidanceSnapshot,
  type GuidanceTaskProgress,
  type ShadowArtifact,
} from '@/lib/guidance/contracts'
import { GUIDANCE_TASKS, GUIDANCE_TASK_MAP } from '@/lib/guidance/task-registry'

const PROGRESS_RANK: Record<GuidanceTaskProgress['highestProgressState'], number> = {
  unseen: 0,
  exposed: 1,
  attempted: 2,
  assisted: 3,
  completed: 4,
  repeated: 5,
  evidenced: 6,
  autonomous: 7,
}

const COMPLETED_STATES = new Set(['completed', 'repeated', 'evidenced', 'autonomous'])

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function getNowIso(nowIso?: string): string {
  return nowIso || new Date().toISOString()
}

function rankToState(
  rank: number,
  fallback: GuidanceTaskProgress['highestProgressState'],
): GuidanceTaskProgress['highestProgressState'] {
  const found = Object.entries(PROGRESS_RANK).find(([, value]) => value === rank)
  return (found?.[0] as GuidanceTaskProgress['highestProgressState'] | undefined) || fallback
}

function upgradeState(
  current: GuidanceTaskProgress['highestProgressState'],
  next: GuidanceTaskProgress['highestProgressState'],
): GuidanceTaskProgress['highestProgressState'] {
  return PROGRESS_RANK[next] > PROGRESS_RANK[current] ? next : current
}

function isCompleted(progress: GuidanceTaskProgress | null): boolean {
  return progress ? COMPLETED_STATES.has(progress.highestProgressState) : false
}

function hoursBetween(olderIso: string, newerIso: string): number {
  return Math.abs(new Date(newerIso).getTime() - new Date(olderIso).getTime()) / (60 * 60 * 1000)
}

function latestIso(
  leftIso: string | null | undefined,
  rightIso: string | null | undefined,
): string | null {
  if (!leftIso) return rightIso ?? null
  if (!rightIso) return leftIso
  return new Date(leftIso).getTime() >= new Date(rightIso).getTime() ? leftIso : rightIso
}

function mergeTaskProgress(
  left: GuidanceTaskProgress,
  right: GuidanceTaskProgress,
): GuidanceTaskProgress {
  const leftTouchedAt = new Date(left.lastTouchedAt).getTime()
  const rightTouchedAt = new Date(right.lastTouchedAt).getTime()
  const latest = leftTouchedAt >= rightTouchedAt ? left : right
  const older = latest === left ? right : left

  return {
    taskId: latest.taskId,
    highestProgressState: rankToState(
      Math.max(
        PROGRESS_RANK[left.highestProgressState],
        PROGRESS_RANK[right.highestProgressState],
      ),
      latest.highestProgressState,
    ),
    latestAssistMode: latest.latestAssistMode ?? older.latestAssistMode ?? null,
    attemptCount: Math.max(left.attemptCount, right.attemptCount),
    abandonCount: Math.max(left.abandonCount, right.abandonCount),
    completionCount: Math.max(left.completionCount, right.completionCount),
    evidenceCount: Math.max(left.evidenceCount, right.evidenceCount),
    lastTouchedAt: latestIso(left.lastTouchedAt, right.lastTouchedAt) ?? latest.lastTouchedAt,
    lastCompletedAt: latestIso(left.lastCompletedAt, right.lastCompletedAt),
    lastDismissedAt: latestIso(left.lastDismissedAt, right.lastDismissedAt),
  }
}

export function createEmptyGuidanceRecord(
  experimentVariant: GuidancePersistenceRecord['experimentVariant'] = 'adaptive',
  nowIso?: string,
): GuidancePersistenceRecord {
  return {
    schemaVersion: GUIDANCE_SCHEMA_VERSION,
    ontologyVersion: GUIDANCE_ONTOLOGY_VERSION,
    recommendationVersion: GUIDANCE_RECOMMENDATION_VERSION,
    experimentVariant,
    taskProgress: {},
    dismissedAtByTaskId: {},
    updatedAt: getNowIso(nowIso),
  }
}

export function mergeGuidanceRecords(
  localRecord: GuidancePersistenceRecord | null,
  remoteRecord: GuidancePersistenceRecord | null,
): GuidancePersistenceRecord | null {
  if (!localRecord && !remoteRecord) return null
  if (!localRecord) return remoteRecord
  if (!remoteRecord) return localRecord

  const base = new Date(localRecord.updatedAt).getTime() >= new Date(remoteRecord.updatedAt).getTime()
    ? localRecord
    : remoteRecord
  const other = base === localRecord ? remoteRecord : localRecord

  const mergedTaskProgress: Record<string, GuidanceTaskProgress> = { ...base.taskProgress }
  for (const [taskId, progress] of Object.entries(other.taskProgress)) {
    const existing = mergedTaskProgress[taskId]
    mergedTaskProgress[taskId] = existing ? mergeTaskProgress(existing, progress) : progress
  }

  const mergedDismissedAtByTaskId: Record<string, string> = { ...base.dismissedAtByTaskId }
  for (const [taskId, dismissedAt] of Object.entries(other.dismissedAtByTaskId)) {
    const existing = mergedDismissedAtByTaskId[taskId]
    mergedDismissedAtByTaskId[taskId] =
      latestIso(existing, dismissedAt) ?? dismissedAt
  }

  return {
    ...base,
    taskProgress: mergedTaskProgress,
    dismissedAtByTaskId: mergedDismissedAtByTaskId,
    updatedAt: new Date(Math.max(
      new Date(localRecord.updatedAt).getTime(),
      new Date(remoteRecord.updatedAt).getTime(),
    )).toISOString(),
  }
}

export function applyGuidanceEvent(
  record: GuidancePersistenceRecord,
  event: GuidanceEvent,
): GuidancePersistenceRecord {
  const at = getNowIso(event.at)
  const current = record.taskProgress[event.taskId] || {
    taskId: event.taskId,
    highestProgressState: 'unseen' as const,
    latestAssistMode: null,
    attemptCount: 0,
    abandonCount: 0,
    completionCount: 0,
    evidenceCount: 0,
    lastTouchedAt: at,
    lastCompletedAt: null,
    lastDismissedAt: null,
  }

  const next: GuidanceTaskProgress = {
    ...current,
    lastTouchedAt: at,
  }

  if (event.assistMode !== undefined) {
    next.latestAssistMode = event.assistMode
  }

  switch (event.kind) {
    case 'viewed': {
      next.highestProgressState = upgradeState(next.highestProgressState, 'exposed')
      break
    }
    case 'assist_mode_selected': {
      next.highestProgressState = upgradeState(next.highestProgressState, 'exposed')
      break
    }
    case 'started': {
      next.attemptCount += 1
      next.highestProgressState = upgradeState(
        next.highestProgressState,
        event.assistMode && event.assistMode !== 'manual' ? 'assisted' : 'attempted',
      )
      break
    }
    case 'completed': {
      next.completionCount += 1
      next.lastCompletedAt = at
      if (next.completionCount >= 2) {
        next.highestProgressState = event.assistMode === 'manual'
          ? 'autonomous'
          : upgradeState(next.highestProgressState, 'repeated')
      } else {
        next.highestProgressState = upgradeState(next.highestProgressState, 'completed')
      }
      break
    }
    case 'artifact_exported': {
      next.evidenceCount += 1
      next.highestProgressState = upgradeState(next.highestProgressState, 'evidenced')
      break
    }
    case 'dismissed': {
      next.lastDismissedAt = at
      break
    }
  }

  const dismissedAtByTaskId = { ...record.dismissedAtByTaskId }
  if (event.kind === 'dismissed') {
    dismissedAtByTaskId[event.taskId] = at
  }

  return {
    ...record,
    taskProgress: {
      ...record.taskProgress,
      [event.taskId]: next,
    },
    dismissedAtByTaskId,
    updatedAt: at,
  }
}

function isDismissedWithinCooldown(
  record: GuidancePersistenceRecord,
  taskId: string,
  cooldownHours: number,
  nowIso: string,
): boolean {
  const dismissedAt = record.dismissedAtByTaskId[taskId]
  if (!dismissedAt) return false
  return hoursBetween(dismissedAt, nowIso) < cooldownHours
}

function toRecommendation(
  taskId: string,
  input: GuidanceInput,
  score: number,
): GuidanceRecommendation {
  const task = GUIDANCE_TASK_MAP[taskId]
  return {
    taskId,
    title: task.title,
    summary: task.summary,
    reason: task.getReason(input),
    ctaLabel: task.getCtaLabel(input),
    destination: task.getDestination(input),
    surface: task.surface,
    score,
  }
}

function deriveDimensions(
  input: GuidanceInput,
  record: GuidancePersistenceRecord,
): GuidanceDimensions {
  const progressValues = Object.values(record.taskProgress)
  const attempts = progressValues.reduce((sum, item) => sum + item.attemptCount, 0)
  const completions = progressValues.reduce((sum, item) => sum + item.completionCount, 0)
  const effectiveAttempts = Math.max(attempts, completions)
  const manualCompletions = progressValues.reduce((sum, item) => {
    return sum + (item.completionCount > 0 && item.latestAssistMode === 'manual' ? item.completionCount : 0)
  }, 0)
  const assistedCompletions = progressValues.reduce((sum, item) => {
    return sum + (item.completionCount > 0 && item.latestAssistMode && item.latestAssistMode !== 'manual' ? item.completionCount : 0)
  }, 0)
  const dismissedThenCompleted = progressValues.filter((item) => {
    return Boolean(item.lastDismissedAt && item.lastCompletedAt && new Date(item.lastCompletedAt).getTime() > new Date(item.lastDismissedAt).getTime())
  }).length

  const reachableCount = Math.max(1, GUIDANCE_TASKS.filter((task) => task.isReachable(input)).length)
  const initiativeBase = ((attempts + completions + Math.min(input.totalDemonstrations, 10)) / (reachableCount * 2.5)) * 100
  const followThroughBase = effectiveAttempts > 0 ? (completions / effectiveAttempts) * 100 : input.hasJourneySave ? 35 : 0
  const assistedBase = completions > 0 ? (assistedCompletions / completions) * 100 : 0
  const independentBase = completions > 0 ? (manualCompletions / completions) * 100 : 0
  const recoveryBase = completions > 0
    ? ((dismissedThenCompleted + Math.max(0, completions - Object.keys(record.dismissedAtByTaskId).length)) / completions) * 100
    : 0

  return {
    initiative: clampPercent(initiativeBase),
    followThrough: clampPercent(followThroughBase),
    assistedCompletion: clampPercent(assistedBase),
    independentCompletion: clampPercent(independentBase),
    recoveryAfterFriction: clampPercent(recoveryBase),
  }
}

function deriveMissedDoors(
  input: GuidanceInput,
  record: GuidancePersistenceRecord,
): GuidanceRecommendation[] {
  return GUIDANCE_TASKS
    .filter((task) => task.isReachable(input))
    .map((task) => {
      const progress = record.taskProgress[task.id] || null
      const hasDismissed = Boolean(record.dismissedAtByTaskId[task.id])
      const score = progress
        ? progress.attemptCount * 20 + (hasDismissed ? 30 : 0) - progress.completionCount * 40
        : hasDismissed ? 10 : -1
      return { task, progress, score }
    })
    .filter(({ progress, score }) => !isCompleted(progress) && score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ task, score }) => toRecommendation(task.id, input, score))
}

function deriveShadowArtifacts(
  input: GuidanceInput,
  record: GuidancePersistenceRecord,
): ShadowArtifact[] {
  return Object.values(record.taskProgress)
    .filter((progress) => progress.lastCompletedAt && progress.completionCount > 0)
    .sort((a, b) => new Date(b.lastCompletedAt || 0).getTime() - new Date(a.lastCompletedAt || 0).getTime())
    .slice(0, 4)
    .map((progress) => {
      const task = GUIDANCE_TASK_MAP[progress.taskId]
      return {
        id: `${progress.taskId}:${progress.lastCompletedAt}`,
        title: task.title,
        description: `${task.evidenceTemplate} ${input.totalDemonstrations > 0 ? `Built on ${input.totalDemonstrations} demonstrated choice${input.totalDemonstrations === 1 ? '' : 's'}.` : ''}`.trim(),
        taskId: progress.taskId,
        completedAt: progress.lastCompletedAt!,
        assistMode: progress.latestAssistMode,
      }
    })
}

export function buildGuidanceRecommendationForTask(
  taskId: string,
  input: GuidanceInput,
  record: GuidancePersistenceRecord,
): GuidanceRecommendation | null {
  const task = GUIDANCE_TASK_MAP[taskId]
  if (!task || !task.isReachable(input)) return null

  const progress = record.taskProgress[task.id] || null
  if (isCompleted(progress)) return null
  if (isDismissedWithinCooldown(record, task.id, task.dismissCooldownHours, getNowIso(input.nowIso))) {
    return null
  }

  const score = task.getScore(input, progress)
  if (score < 0) return null

  return toRecommendation(task.id, input, score)
}

export function buildGuidanceSnapshot(
  input: GuidanceInput,
  record: GuidancePersistenceRecord,
): GuidanceSnapshot {
  const nowIso = getNowIso(input.nowIso)
  const rankedRecommendations = GUIDANCE_TASKS
    .map((task) =>
      buildGuidanceRecommendationForTask(task.id, { ...input, nowIso }, record),
    )
    .filter((recommendation): recommendation is GuidanceRecommendation => Boolean(recommendation))
    .sort((a, b) => b.score - a.score)

  const frictionFlags: string[] = []
  for (const progress of Object.values(record.taskProgress)) {
    if (progress.attemptCount >= 2 && progress.completionCount === 0) {
      frictionFlags.push(`stalled:${progress.taskId}`)
    }
    if (progress.lastDismissedAt && progress.completionCount === 0) {
      frictionFlags.push(`dismissed:${progress.taskId}`)
    }
  }

  return {
    schemaVersion: GUIDANCE_SCHEMA_VERSION,
    ontologyVersion: GUIDANCE_ONTOLOGY_VERSION,
    recommendationVersion: GUIDANCE_RECOMMENDATION_VERSION,
    experimentVariant: record.experimentVariant,
    dimensions: deriveDimensions(input, record),
    nextBestMove: rankedRecommendations[0] || null,
    missedDoors: deriveMissedDoors(input, record),
    shadowArtifacts: deriveShadowArtifacts(input, record),
    reachableTaskIds: GUIDANCE_TASKS.filter((task) => task.isReachable(input)).map((task) => task.id),
    frictionFlags,
  }
}
