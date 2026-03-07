import path from 'node:path'

import { config as loadEnv } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

import { GUIDANCE_DIAGNOSTIC_EVENT_TYPES } from '@/lib/guidance/admin-diagnostics'
import { buildAdminGuidanceCohortSummary } from '@/lib/guidance/cohort-summary'
import { loadGuidancePlanRowsFromDb } from '@/lib/guidance/db-store'
import { isInternalGuidanceValidationUserId } from '@/lib/guidance/internal-users'
import { getAdaptiveGuidanceRolloutConfig } from '@/lib/guidance/rollout'

type SupabaseClient = ReturnType<typeof createClient>

type GuidanceSummaryEventRow = {
  user_id: string
  event_type: string
  occurred_at: string | null
  payload: unknown
}

type GuidanceCohortRow = {
  cohort: 'control' | 'adaptive'
  userCount: number
  recommendationShown: number
  recommendationClicked: number
  recommendationDismissed: number
  taskCompleted: number
  artifactExported: number
  ctr: number
  completionRate: number
  dismissRate: number
  artifactExportRate: number
  averageInitiative: number | null
  averageFollowThrough: number | null
  averageRecoveryAfterFriction: number | null
  stalledUserCount: number
}

type GuidanceReport = {
  fetchedAt: string
  rolloutConfig: ReturnType<typeof getAdaptiveGuidanceRolloutConfig>
  substrate: {
    snapshotRows: number
    taskProgressRows: number
    planRowsLoaded: number
    internalValidationUsers: string[]
  }
  realUsers30d: {
    totals: {
      usersWithGuidance: number
      controlUsers: number
      adaptiveUsers: number
    }
    cohorts: GuidanceCohortRow[]
    eventRows: number
    eventCounts: Record<string, number>
  }
  realUsers7d: {
    eventRows: number
    eventCounts: Record<string, number>
  }
  includingInternal30d: {
    totals: {
      usersWithGuidance: number
      controlUsers: number
      adaptiveUsers: number
    }
    cohorts: GuidanceCohortRow[]
    eventRows: number
    eventCounts: Record<string, number>
  }
}

function fail(message: string): never {
  // eslint-disable-next-line no-console
  console.error(`[report-live-guidance] ${message}`)
  process.exit(1)
}

async function countRows(
  supabase: SupabaseClient,
  table: string,
): Promise<number> {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })

  if (error) fail(`Failed counting ${table}: ${error.message}`)
  return count ?? 0
}

async function loadInteractionEvents(
  supabase: SupabaseClient,
  sinceIso: string,
): Promise<GuidanceSummaryEventRow[]> {
  const { data, error } = await supabase
    .from('interaction_events')
    .select('user_id, event_type, occurred_at, payload')
    .in('event_type', [...GUIDANCE_DIAGNOSTIC_EVENT_TYPES])
    .gte('occurred_at', sinceIso)
    .order('occurred_at', { ascending: false })
    .limit(5000)

  if (error) fail(`Failed loading interaction events: ${error.message}`)
  return (data ?? []) as GuidanceSummaryEventRow[]
}

function summarizeEventCounts(
  events: GuidanceSummaryEventRow[],
): Record<string, number> {
  return events.reduce<Record<string, number>>((acc, event) => {
    acc[event.event_type] = (acc[event.event_type] ?? 0) + 1
    return acc
  }, {})
}

function parseFormatArg(): 'json' | 'markdown' {
  const formatArg = process.argv.find((arg) => arg.startsWith('--format='))
  if (!formatArg) return 'json'
  const value = formatArg.slice('--format='.length)
  if (value === 'json' || value === 'markdown') return value
  fail(`Unsupported format "${value}". Expected json or markdown.`)
}

function formatNumber(value: number | null): string {
  if (value === null) return 'n/a'
  return `${Math.round(value * 100) / 100}`
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100) / 100}%`
}

function formatEventCounts(eventCounts: Record<string, number>): string {
  const entries = Object.entries(eventCounts)
  if (entries.length === 0) return '- none'
  return entries
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([eventType, count]) => `- ${eventType}: ${count}`)
    .join('\n')
}

function formatCohortTable(cohorts: GuidanceCohortRow[]): string {
  const rows = cohorts.map((cohort) => [
    cohort.cohort,
    String(cohort.userCount),
    String(cohort.recommendationShown),
    String(cohort.recommendationClicked),
    String(cohort.recommendationDismissed),
    String(cohort.taskCompleted),
    String(cohort.artifactExported),
    formatPercent(cohort.ctr),
    formatPercent(cohort.completionRate),
    formatPercent(cohort.dismissRate),
    String(cohort.stalledUserCount),
    formatNumber(cohort.averageInitiative),
    formatNumber(cohort.averageFollowThrough),
  ])

  return [
    '| Cohort | Users | Shown | Clicked | Dismissed | Completed | Exported | CTR | Completion | Dismiss | Stalled | Initiative | Follow-through |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...rows.map((columns) => `| ${columns.join(' | ')} |`),
  ].join('\n')
}

function formatReportAsMarkdown(report: GuidanceReport): string {
  const realUsers = report.realUsers30d
  const internalUsers = report.includingInternal30d
  const realUserStatus = realUsers.totals.usersWithGuidance === 0
    ? 'No non-internal guidance activity detected yet.'
    : `Detected ${realUsers.totals.usersWithGuidance} non-internal guidance user(s).`

  return [
    '# Guidance Live Operator Report',
    '',
    `Generated: ${report.fetchedAt}`,
    '',
    '## Rollout',
    `- Mode: ${report.rolloutConfig.mode}`,
    `- Assignment version: ${report.rolloutConfig.assignmentVersion}`,
    `- Adaptive / Control: ${report.rolloutConfig.adaptivePercentage}% / ${report.rolloutConfig.controlPercentage}%`,
    `- Kill switch active: ${report.rolloutConfig.isKillSwitchActive ? 'yes' : 'no'}`,
    '',
    '## Substrate',
    `- Snapshot rows: ${report.substrate.snapshotRows}`,
    `- Task progress rows: ${report.substrate.taskProgressRows}`,
    `- Plan rows loaded: ${report.substrate.planRowsLoaded}`,
    `- Internal validation users: ${report.substrate.internalValidationUsers.join(', ') || 'none'}`,
    '',
    '## Real Users (30d)',
    `- Status: ${realUserStatus}`,
    `- Users with guidance: ${realUsers.totals.usersWithGuidance}`,
    `- Adaptive users: ${realUsers.totals.adaptiveUsers}`,
    `- Control users: ${realUsers.totals.controlUsers}`,
    `- Guidance events: ${realUsers.eventRows}`,
    '',
    formatCohortTable(realUsers.cohorts),
    '',
    '### Event Counts (30d)',
    formatEventCounts(realUsers.eventCounts),
    '',
    '## Real Users (7d)',
    `- Guidance events: ${report.realUsers7d.eventRows}`,
    formatEventCounts(report.realUsers7d.eventCounts),
    '',
    '## Validation Signal Included (30d)',
    `- Users with guidance: ${internalUsers.totals.usersWithGuidance}`,
    `- Adaptive users: ${internalUsers.totals.adaptiveUsers}`,
    `- Control users: ${internalUsers.totals.controlUsers}`,
    `- Guidance events: ${internalUsers.eventRows}`,
    '',
    formatCohortTable(internalUsers.cohorts),
    '',
    '### Event Counts Including Internal (30d)',
    formatEventCounts(internalUsers.eventCounts),
    '',
  ].join('\n')
}

async function main(): Promise<void> {
  const format = parseFormatArg()
  loadEnv({ path: path.resolve(process.cwd(), '.env.local') })

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) fail('Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL')
  if (!serviceRoleKey) fail('Missing SUPABASE_SERVICE_ROLE_KEY')

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const now = Date.now()
  const thirtyDaysAgoIso = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString()
  const sevenDaysAgoIso = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [snapshotCount, taskProgressCount, planRowsResult, events30d, events7d] = await Promise.all([
    countRows(supabase, 'guidance_trajectory_snapshots'),
    countRows(supabase, 'guidance_task_progress'),
    loadGuidancePlanRowsFromDb(supabase, 500),
    loadInteractionEvents(supabase, thirtyDaysAgoIso),
    loadInteractionEvents(supabase, sevenDaysAgoIso),
  ])

  if (planRowsResult.missingTables) {
    fail('Dedicated guidance tables were not readable')
  }

  const allPlanRows = planRowsResult.planRows
  const internalUserIds = Array.from(
    new Set(
      allPlanRows
        .map((row) => row.user_id)
        .filter((userId) => isInternalGuidanceValidationUserId(userId)),
    ),
  )

  const summaryRealUsers = buildAdminGuidanceCohortSummary({
    planRows: allPlanRows,
    interactionEvents: events30d,
    days: 30,
    userLimit: 500,
    rolloutConfig: getAdaptiveGuidanceRolloutConfig(),
  })

  const summaryIncludingInternal = buildAdminGuidanceCohortSummary({
    planRows: allPlanRows,
    interactionEvents: events30d,
    days: 30,
    userLimit: 500,
    rolloutConfig: getAdaptiveGuidanceRolloutConfig(),
    includeInternalUsers: true,
  })

  const events30dRealUsers = events30d.filter(
    (event) => !isInternalGuidanceValidationUserId(event.user_id),
  )
  const events7dRealUsers = events7d.filter(
    (event) => !isInternalGuidanceValidationUserId(event.user_id),
  )

  const report: GuidanceReport = {
    fetchedAt: new Date().toISOString(),
    rolloutConfig: getAdaptiveGuidanceRolloutConfig(),
    substrate: {
      snapshotRows: snapshotCount,
      taskProgressRows: taskProgressCount,
      planRowsLoaded: allPlanRows.length,
      internalValidationUsers: internalUserIds,
    },
    realUsers30d: {
      totals: summaryRealUsers.totals,
      cohorts: summaryRealUsers.cohorts,
      eventRows: events30dRealUsers.length,
      eventCounts: summarizeEventCounts(events30dRealUsers),
    },
    realUsers7d: {
      eventRows: events7dRealUsers.length,
      eventCounts: summarizeEventCounts(events7dRealUsers),
    },
    includingInternal30d: {
      totals: summaryIncludingInternal.totals,
      cohorts: summaryIncludingInternal.cohorts,
      eventRows: events30d.length,
      eventCounts: summarizeEventCounts(events30d),
    },
  }

  // eslint-disable-next-line no-console
  console.log(format === 'markdown'
    ? formatReportAsMarkdown(report)
    : JSON.stringify(report, null, 2))
}

void main().catch((error) => fail(error instanceof Error ? error.message : String(error)))
