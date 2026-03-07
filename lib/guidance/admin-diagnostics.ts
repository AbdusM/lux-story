import { GUIDANCE_TASK_MAP } from '@/lib/guidance/task-registry'
import { extractGuidancePlanEnvelope } from '@/lib/guidance/storage'
import type {
  AdminGuidanceDiagnostics,
  AdminGuidanceEventCounts,
  AdminGuidanceRecentEvent,
  AdminGuidanceTaskSummary,
} from '@/lib/types/admin-api'

type GuidanceInteractionEventRow = {
  event_type: string
  occurred_at: string | null
  payload: unknown
}

const EMPTY_EVENT_COUNTS: AdminGuidanceEventCounts = {
  taskExposed: 0,
  recommendationShown: 0,
  recommendationClicked: 0,
  recommendationDismissed: 0,
  taskStarted: 0,
  taskCompleted: 0,
  artifactExported: 0,
  assistModeSelected: 0,
}

export const GUIDANCE_DIAGNOSTIC_EVENT_TYPES = [
  'task_exposed',
  'assist_mode_selected',
  'task_started',
  'task_completed',
  'recommendation_shown',
  'recommendation_clicked',
  'recommendation_dismissed',
  'artifact_exported',
] as const

type GuidanceDiagnosticEventType = (typeof GUIDANCE_DIAGNOSTIC_EVENT_TYPES)[number]

const GUIDANCE_EVENT_TYPES = new Set<GuidanceDiagnosticEventType>(GUIDANCE_DIAGNOSTIC_EVENT_TYPES)

function isGuidanceDiagnosticEventType(
  value: string,
): value is GuidanceDiagnosticEventType {
  return GUIDANCE_EVENT_TYPES.has(value as GuidanceDiagnosticEventType)
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function getPayloadTaskId(payload: unknown): string | null {
  if (!isPlainObject(payload)) return null
  return typeof payload.task_id === 'string' && payload.task_id.length > 0
    ? payload.task_id
    : null
}

function getPayloadSurface(payload: unknown): string | null {
  if (!isPlainObject(payload)) return null
  return typeof payload.source_surface === 'string' && payload.source_surface.length > 0
    ? payload.source_surface
    : null
}

function sortByRecent<T extends { lastTouchedAt: string }>(items: T[]): T[] {
  return [...items].sort(
    (left, right) =>
      new Date(right.lastTouchedAt).getTime() - new Date(left.lastTouchedAt).getTime(),
  )
}

function toTaskSummary(
  taskId: string,
  progress: {
    highestProgressState: AdminGuidanceTaskSummary['highestProgressState']
    latestAssistMode: AdminGuidanceTaskSummary['latestAssistMode']
    attemptCount: number
    completionCount: number
    evidenceCount: number
    lastTouchedAt: string
    lastCompletedAt?: string | null
  },
): AdminGuidanceTaskSummary {
  return {
    taskId,
    title: GUIDANCE_TASK_MAP[taskId]?.title ?? taskId,
    highestProgressState: progress.highestProgressState,
    latestAssistMode: progress.latestAssistMode ?? null,
    attemptCount: progress.attemptCount,
    completionCount: progress.completionCount,
    evidenceCount: progress.evidenceCount,
    lastTouchedAt: progress.lastTouchedAt,
    lastCompletedAt: progress.lastCompletedAt ?? null,
  }
}

function deriveFallbackFrictionFlags(
  taskProgress: Record<
    string,
    {
      attemptCount: number
      completionCount: number
      lastDismissedAt?: string | null
    }
  >,
): string[] {
  const frictionFlags: string[] = []

  for (const [taskId, progress] of Object.entries(taskProgress)) {
    if (progress.attemptCount >= 2 && progress.completionCount === 0) {
      frictionFlags.push(`stalled:${taskId}`)
    }
    if (progress.lastDismissedAt && progress.completionCount === 0) {
      frictionFlags.push(`dismissed:${taskId}`)
    }
  }

  return frictionFlags
}

export function buildAdminGuidanceDiagnostics(params: {
  plan: unknown
  interactionEvents: GuidanceInteractionEventRow[]
}): AdminGuidanceDiagnostics {
  const envelope = extractGuidancePlanEnvelope(params.plan)
  const record = envelope?.adaptiveGuidance?.record ?? null
  const snapshot = envelope?.adaptiveGuidance?.snapshot ?? null

  const taskProgress = record?.taskProgress ?? {}
  const progressValues = Object.values(taskProgress)
  const stalledTasks = sortByRecent(
    Object.entries(taskProgress)
      .filter(([, progress]) => progress.attemptCount >= 2 && progress.completionCount === 0)
      .map(([taskId, progress]) => toTaskSummary(taskId, progress)),
  )
  const completedTasks = sortByRecent(
    Object.entries(taskProgress)
      .filter(([, progress]) => progress.completionCount > 0)
      .map(([taskId, progress]) => toTaskSummary(taskId, progress)),
  )

  const eventCounts = params.interactionEvents.reduce<AdminGuidanceEventCounts>((counts, event) => {
    if (!isGuidanceDiagnosticEventType(event.event_type)) return counts

    switch (event.event_type) {
      case 'task_exposed':
        counts.taskExposed += 1
        break
      case 'assist_mode_selected':
        counts.assistModeSelected += 1
        break
      case 'task_started':
        counts.taskStarted += 1
        break
      case 'task_completed':
        counts.taskCompleted += 1
        break
      case 'recommendation_shown':
        counts.recommendationShown += 1
        break
      case 'recommendation_clicked':
        counts.recommendationClicked += 1
        break
      case 'recommendation_dismissed':
        counts.recommendationDismissed += 1
        break
      case 'artifact_exported':
        counts.artifactExported += 1
        break
    }

    return counts
  }, { ...EMPTY_EVENT_COUNTS })

  const recentEvents = params.interactionEvents
    .filter((event) => isGuidanceDiagnosticEventType(event.event_type))
    .sort((left, right) => {
      const leftTime = left.occurred_at ? new Date(left.occurred_at).getTime() : 0
      const rightTime = right.occurred_at ? new Date(right.occurred_at).getTime() : 0
      return rightTime - leftTime
    })
    .slice(0, 8)
    .map<AdminGuidanceRecentEvent>((event) => {
      const taskId = getPayloadTaskId(event.payload)
      return {
        eventType: event.event_type,
        occurredAt: event.occurred_at,
        taskId,
        taskTitle: taskId ? (GUIDANCE_TASK_MAP[taskId]?.title ?? taskId) : null,
        sourceSurface: getPayloadSurface(event.payload),
      }
    })

  return {
    experimentVariant: snapshot?.experimentVariant ?? record?.experimentVariant ?? 'control',
    schemaVersion: snapshot?.schemaVersion ?? record?.schemaVersion ?? null,
    ontologyVersion: snapshot?.ontologyVersion ?? record?.ontologyVersion ?? null,
    recommendationVersion:
      snapshot?.recommendationVersion ?? record?.recommendationVersion ?? null,
    updatedAt: record?.updatedAt ?? null,
    dimensions: snapshot?.dimensions ?? null,
    currentRecommendation:
      (snapshot?.experimentVariant ?? record?.experimentVariant) === 'adaptive'
        ? (snapshot?.nextBestMove ?? null)
        : null,
    missedDoors: snapshot?.missedDoors ?? [],
    reachableTaskCount: snapshot?.reachableTaskIds.length ?? 0,
    shadowArtifactCount:
      snapshot?.shadowArtifacts.length ??
      progressValues.filter((progress) => progress.completionCount > 0).length,
    frictionFlags: snapshot?.frictionFlags ?? deriveFallbackFrictionFlags(taskProgress),
    stalledTasks,
    completedTasks,
    eventCounts,
    recentEvents,
  }
}
