import {
  STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
  STUDENT_INSIGHTS_SIGNAL_SURFACE,
} from '@/lib/telemetry/student-insights-constants'
import type {
  AdminStudentInsightsFunnelRates,
  AdminStudentInsightsFunnelStageCounts,
  AdminStudentInsightsFunnelSummary,
  AdminStudentInsightsSurfaceMetrics,
} from '@/lib/types/admin-api'

type InteractionEventRow = {
  user_id: string
  event_type: string
  occurred_at: string | null
  payload: unknown
}

const STUDENT_INSIGHTS_EVENT_TYPES = new Set<string>([
  'recommendation_shown',
  'recommendation_clicked',
  'task_exposed',
  'task_started',
  'assist_mode_selected',
  'task_completed',
  'artifact_exported',
])

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function getSourceSurface(payload: unknown): string | null {
  if (!isPlainObject(payload)) return null
  return typeof payload.source_surface === 'string' && payload.source_surface.length > 0
    ? payload.source_surface
    : null
}

function createEmptyCounts(): AdminStudentInsightsFunnelStageCounts {
  return {
    recommendationShown: 0,
    recommendationClicked: 0,
    taskExposed: 0,
    taskStarted: 0,
    assistModeSelected: 0,
    taskCompleted: 0,
    artifactExported: 0,
  }
}

function recordEvent(counts: AdminStudentInsightsFunnelStageCounts, eventType: string): void {
  switch (eventType) {
    case 'recommendation_shown':
      counts.recommendationShown += 1
      return
    case 'recommendation_clicked':
      counts.recommendationClicked += 1
      return
    case 'task_exposed':
      counts.taskExposed += 1
      return
    case 'task_started':
      counts.taskStarted += 1
      return
    case 'assist_mode_selected':
      counts.assistModeSelected += 1
      return
    case 'task_completed':
      counts.taskCompleted += 1
      return
    case 'artifact_exported':
      counts.artifactExported += 1
      return
    default:
      return
  }
}

function sumCounts(left: AdminStudentInsightsFunnelStageCounts, right: AdminStudentInsightsFunnelStageCounts) {
  left.recommendationShown += right.recommendationShown
  left.recommendationClicked += right.recommendationClicked
  left.taskExposed += right.taskExposed
  left.taskStarted += right.taskStarted
  left.assistModeSelected += right.assistModeSelected
  left.taskCompleted += right.taskCompleted
  left.artifactExported += right.artifactExported
}

function roundRate(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0
  return Math.round((numerator / denominator) * 100)
}

function buildRates(counts: AdminStudentInsightsFunnelStageCounts): AdminStudentInsightsFunnelRates {
  return {
    recommendationCtr: roundRate(counts.recommendationClicked, counts.recommendationShown),
    startRate: roundRate(counts.taskStarted, counts.taskExposed),
    completionRate: roundRate(counts.taskCompleted, counts.taskStarted),
    artifactExportRate: roundRate(counts.artifactExported, counts.taskCompleted),
  }
}

function buildSurfaceMetrics(
  surface: string,
  events: InteractionEventRow[],
): AdminStudentInsightsSurfaceMetrics {
  const counts = createEmptyCounts()
  const users = new Set<string>()

  for (const event of events) {
    users.add(event.user_id)
    recordEvent(counts, event.event_type)
  }

  return {
    surface,
    uniqueUsers: users.size,
    counts,
    rates: buildRates(counts),
  }
}

export function buildAdminStudentInsightsFunnelSummary(params: {
  interactionEvents: InteractionEventRow[]
  days: number
  eventLimit: number
  generatedAt?: string
  truncated?: boolean
  surfaces?: string[]
}): AdminStudentInsightsFunnelSummary {
  const generatedAt = params.generatedAt ?? new Date().toISOString()
  const surfaces = params.surfaces ?? [
    STUDENT_INSIGHTS_SIGNAL_SURFACE,
    STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
  ]
  const allowedSurfaces = new Set<string>(surfaces)

  const candidateEvents = params.interactionEvents.filter((event) => {
    if (!STUDENT_INSIGHTS_EVENT_TYPES.has(event.event_type)) return false
    const surface = getSourceSurface(event.payload)
    if (!surface) return false
    return allowedSurfaces.has(surface)
  })

  const totalsUsers = new Set<string>()
  const totalsCounts = createEmptyCounts()

  const surfaceMetrics: AdminStudentInsightsSurfaceMetrics[] = surfaces.map((surface) => {
    const events = candidateEvents.filter((event) => getSourceSurface(event.payload) === surface)
    const metrics = buildSurfaceMetrics(surface, events)
    events.forEach((event) => totalsUsers.add(event.user_id))
    sumCounts(totalsCounts, metrics.counts)
    return metrics
  })

  return {
    generatedAt,
    days: params.days,
    eventLimit: params.eventLimit,
    surfaces: surfaceMetrics,
    totals: {
      uniqueUsers: totalsUsers.size,
      counts: totalsCounts,
      rates: buildRates(totalsCounts),
    },
    metadata: {
      eventRowsScanned: params.interactionEvents.length,
      truncated: params.truncated ?? false,
    },
  }
}
