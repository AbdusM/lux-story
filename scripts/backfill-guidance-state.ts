import path from 'node:path'

import { config as loadEnv } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

import {
  classifyGuidancePlan,
  isMissingColumnError,
  summarizeGuidanceCandidates,
  type GuidanceBackfillCandidate,
  type GuidanceBackfillCandidateSource,
} from '@/lib/guidance/backfill'
import { loadGuidanceStateForUser, persistGuidanceStateForUser } from '@/lib/guidance/db-store'
import {
  extractRemoteGuidanceRecord,
  extractRemoteGuidanceSnapshot,
} from '@/lib/guidance/storage'

const PAGE_SIZE = Number(process.env.GUIDANCE_BACKFILL_PAGE_SIZE || 500)
const args = new Set(process.argv.slice(2))
const execute = args.has('--execute')

function fail(message: string): never {
  // eslint-disable-next-line no-console
  console.error(`[backfill-guidance-state] ${message}`)
  process.exit(1)
}

async function scanTable(
  supabase: ReturnType<typeof createClient>,
  params: {
    table: string
    column: string
    source: GuidanceBackfillCandidateSource
    tolerateMissingColumn?: boolean
  },
): Promise<{
  totalRows: number
  candidates: GuidanceBackfillCandidate[]
  skippedMissingColumn: boolean
}> {
  const candidates: GuidanceBackfillCandidate[] = []
  let offset = 0
  let totalRows = 0

  for (;;) {
    const { data, error } = await supabase
      .from(params.table)
      .select(`user_id, ${params.column}`)
      .range(offset, offset + PAGE_SIZE - 1)

    if (error) {
      if (params.tolerateMissingColumn && isMissingColumnError(error)) {
        return {
          totalRows,
          candidates,
          skippedMissingColumn: true,
        }
      }

      fail(`Failed reading ${params.table}.${params.column}: ${error.message}`)
    }

    if (!data || data.length === 0) break

    totalRows += data.length
    for (const row of data as Array<Record<string, unknown>>) {
      const userId = typeof row.user_id === 'string' ? row.user_id : ''
      if (!userId) continue

      const candidate = classifyGuidancePlan({
        userId,
        source: params.source,
        plan: row[params.column],
      })

      if (candidate) {
        candidates.push(candidate)
      }
    }

    if (data.length < PAGE_SIZE) break
    offset += data.length
  }

  return {
    totalRows,
    candidates,
    skippedMissingColumn: false,
  }
}

async function countRows(
  supabase: ReturnType<typeof createClient>,
  table: string,
): Promise<number> {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })

  if (error) fail(`Failed counting ${table}: ${error.message}`)
  return count ?? 0
}

async function main(): Promise<void> {
  loadEnv({ path: path.resolve(process.cwd(), '.env.local') })

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) fail('Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL')
  if (!serviceRoleKey) fail('Missing SUPABASE_SERVICE_ROLE_KEY')

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const [actionPlanScan, profileFallbackScan, snapshotCountBefore, taskCountBefore] =
    await Promise.all([
      scanTable(supabase, {
        table: 'user_action_plans',
        column: 'plan_data',
        source: 'user_action_plans',
      }),
      scanTable(supabase, {
        table: 'player_profiles',
        column: 'last_action_plan',
        source: 'player_profiles.last_action_plan',
        tolerateMissingColumn: true,
      }),
      countRows(supabase, 'guidance_trajectory_snapshots'),
      countRows(supabase, 'guidance_task_progress'),
    ])

  const candidates = [...actionPlanScan.candidates, ...profileFallbackScan.candidates]
  const candidateSummary = summarizeGuidanceCandidates(candidates)
  const validCandidates = candidates.filter((candidate) => candidate.valid)

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({
    mode: execute ? 'EXECUTE' : 'DRY_RUN',
    pageSize: PAGE_SIZE,
    sources: {
      userActionPlans: {
        rowsScanned: actionPlanScan.totalRows,
        candidates: actionPlanScan.candidates.length,
      },
      playerProfilesFallback: {
        rowsScanned: profileFallbackScan.totalRows,
        candidates: profileFallbackScan.candidates.length,
        skippedMissingColumn: profileFallbackScan.skippedMissingColumn,
      },
    },
    candidates: candidateSummary,
    targetTablesBefore: {
      guidanceTrajectorySnapshots: snapshotCountBefore,
      guidanceTaskProgress: taskCountBefore,
    },
  }, null, 2))

  if (!execute) {
    // eslint-disable-next-line no-console
    console.log('[backfill-guidance-state] dry-run complete. Re-run with --execute to persist valid candidates.')
    return
  }

  let migrated = 0
  for (const candidate of validCandidates) {
    const record = extractRemoteGuidanceRecord(candidate.plan)
    const snapshot = extractRemoteGuidanceSnapshot(candidate.plan)
    if (!record || !snapshot) continue

    const existingGuidanceState = await loadGuidanceStateForUser(supabase, candidate.userId)

    await persistGuidanceStateForUser({
      supabase,
      userId: candidate.userId,
      state: { record, snapshot },
      existingTaskIds: Object.keys(existingGuidanceState.state?.record.taskProgress ?? {}),
    })

    migrated += 1
  }

  const [snapshotCountAfter, taskCountAfter] = await Promise.all([
    countRows(supabase, 'guidance_trajectory_snapshots'),
    countRows(supabase, 'guidance_task_progress'),
  ])

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({
    migratedCandidates: migrated,
    targetTablesAfter: {
      guidanceTrajectorySnapshots: snapshotCountAfter,
      guidanceTaskProgress: taskCountAfter,
    },
  }, null, 2))
}

void main().catch((error) => fail(error instanceof Error ? error.message : String(error)))
