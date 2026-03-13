import {
  STUDENT_INSIGHTS_ACTION_PLAN_SURFACE,
  STUDENT_INSIGHTS_ACTION_PLAN_TASK_ID,
  STUDENT_INSIGHTS_OUTCOME_CHECK_IN_TASK_ID,
  STUDENT_INSIGHTS_SIGNAL_SURFACE,
  STUDENT_INSIGHTS_SIGNAL_TASK_ID,
} from '@/lib/telemetry/student-insights-constants'

export type StudentInsightsInteractionEventRow = {
  user_id: string
  event_type: string
  occurred_at: string | null
  payload: unknown
}

export const STUDENT_INSIGHTS_EVENT_TYPES = [
  'recommendation_shown',
  'recommendation_clicked',
  'task_exposed',
  'task_started',
  'assist_mode_selected',
  'task_completed',
  'artifact_exported',
  'outcome_checkin_submitted',
] as const

const STUDENT_INSIGHTS_EVENT_TYPES_SET = new Set<string>(STUDENT_INSIGHTS_EVENT_TYPES)

const STUDENT_INSIGHTS_SCHEMA_PREFIXES_BY_SURFACE: Record<string, string[]> = {
  [STUDENT_INSIGHTS_SIGNAL_SURFACE]: ['student-insights-signals-'],
  [STUDENT_INSIGHTS_ACTION_PLAN_SURFACE]: [
    'student-insights-action-plan-',
    'student-insights-outcome-',
  ],
}

const STUDENT_INSIGHTS_TASK_ID_BY_SURFACE: Record<string, string> = {
  [STUDENT_INSIGHTS_SIGNAL_SURFACE]: STUDENT_INSIGHTS_SIGNAL_TASK_ID,
  [STUDENT_INSIGHTS_ACTION_PLAN_SURFACE]: STUDENT_INSIGHTS_ACTION_PLAN_TASK_ID,
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function getTaskId(payload: unknown): string | null {
  if (!isPlainObject(payload)) return null
  return typeof payload.task_id === 'string' && payload.task_id.length > 0 ? payload.task_id : null
}

function getSchemaVersion(payload: unknown): string | null {
  if (!isPlainObject(payload)) return null
  return typeof payload.guidance_schema_version === 'string' && payload.guidance_schema_version.length > 0
    ? payload.guidance_schema_version
    : null
}

export function getStudentInsightsSourceSurface(payload: unknown): string | null {
  if (!isPlainObject(payload)) return null
  return typeof payload.source_surface === 'string' && payload.source_surface.length > 0
    ? payload.source_surface
    : null
}

export function isStudentInsightsPayloadForSurface(payload: unknown, surface: string): boolean {
  const schemaPrefixes = STUDENT_INSIGHTS_SCHEMA_PREFIXES_BY_SURFACE[surface]
  if (!schemaPrefixes) return false

  const taskId = getTaskId(payload)
  if (surface === STUDENT_INSIGHTS_ACTION_PLAN_SURFACE) {
    const validActionPlanTaskIds = new Set([
      STUDENT_INSIGHTS_ACTION_PLAN_TASK_ID,
      STUDENT_INSIGHTS_OUTCOME_CHECK_IN_TASK_ID,
    ])
    if (!taskId || !validActionPlanTaskIds.has(taskId)) return false
  } else {
    const expectedTaskId = STUDENT_INSIGHTS_TASK_ID_BY_SURFACE[surface]
    if (!expectedTaskId || taskId !== expectedTaskId) return false
  }

  const schemaVersion = getSchemaVersion(payload)
  if (!schemaVersion || !schemaPrefixes.some((prefix) => schemaVersion.startsWith(prefix))) return false

  return true
}

export function isStudentInsightsInteractionEvent(event: StudentInsightsInteractionEventRow): boolean {
  if (!STUDENT_INSIGHTS_EVENT_TYPES_SET.has(event.event_type)) return false

  const surface = getStudentInsightsSourceSurface(event.payload)
  if (!surface) return false

  return isStudentInsightsPayloadForSurface(event.payload, surface)
}
