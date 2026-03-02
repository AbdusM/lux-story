import fs from 'node:fs'
import path from 'node:path'

import { config as loadEnv } from 'dotenv'

type TableTarget = {
  table: string
  column: string
}

type TableAudit = {
  table: string
  column: string
  total_rows: number
  uuid_rows: number
  player_prefixed_rows: number
  other_rows: number
  non_uuid_rows: number
  non_uuid_percent: number
  missing_table: boolean
}

type AuditReport = {
  generated_at: string
  project_ref: string
  rest_url: string
  pagination_limit: number
  summary: {
    total_rows: number
    uuid_rows: number
    player_prefixed_rows: number
    other_rows: number
    non_uuid_rows: number
  }
  player_profiles_gate: {
    status: 'pass' | 'fail'
    non_uuid_rows: number
    reason: string
  }
  tables: TableAudit[]
}

const TABLE_TARGETS: TableTarget[] = [
  { table: 'player_profiles', column: 'user_id' },
  { table: 'skill_demonstrations', column: 'user_id' },
  { table: 'career_explorations', column: 'user_id' },
  { table: 'relationship_progress', column: 'user_id' },
  { table: 'platform_states', column: 'user_id' },
  { table: 'career_analytics', column: 'user_id' },
  { table: 'skill_summaries', column: 'user_id' },
  { table: 'interaction_events', column: 'user_id' },
  { table: 'pattern_demonstrations', column: 'user_id' },
  { table: 'visited_scenes', column: 'player_id' },
  { table: 'choice_history', column: 'player_id' },
  { table: 'player_patterns', column: 'player_id' },
  { table: 'player_behavioral_profiles', column: 'player_id' },
  { table: 'skill_milestones', column: 'player_id' },
  { table: 'player_urgency_scores', column: 'player_id' },
]

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const PLAYER_PREFIXED_REGEX = /^player[_-]/i
const PAGE_SIZE = Number(process.env.UUID_AUDIT_PAGE_SIZE || 1000)
const REPORT_PATH = path.join(process.cwd(), 'docs/qa/user-id-uuid-readiness-report.json')

function fail(message: string): never {
  // eslint-disable-next-line no-console
  console.error(`[verify-user-id-uuid-readiness] ${message}`)
  process.exit(1)
}

function writeReport(report: AuditReport): void {
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true })
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
}

function classify(idValue: string): 'uuid' | 'player_prefixed' | 'other' {
  if (UUID_REGEX.test(idValue)) return 'uuid'
  if (PLAYER_PREFIXED_REGEX.test(idValue)) return 'player_prefixed'
  return 'other'
}

async function fetchPage(
  restBaseUrl: string,
  serviceRoleKey: string,
  target: TableTarget,
  offset: number,
): Promise<Array<Record<string, unknown>> | null> {
  const params = new URLSearchParams({
    select: target.column,
    order: `${target.column}.asc`,
    limit: String(PAGE_SIZE),
    offset: String(offset),
  })

  const response = await fetch(`${restBaseUrl}/${target.table}?${params.toString()}`, {
    method: 'GET',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Accept: 'application/json',
    },
  })

  if (response.status === 404) return null
  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Failed ${target.table}.${target.column}: ${response.status} ${errorBody}`)
  }

  return (await response.json()) as Array<Record<string, unknown>>
}

async function auditTable(restBaseUrl: string, serviceRoleKey: string, target: TableTarget): Promise<TableAudit> {
  let totalRows = 0
  let uuidRows = 0
  let prefixedRows = 0
  let otherRows = 0
  let offset = 0

  while (true) {
    const rows = await fetchPage(restBaseUrl, serviceRoleKey, target, offset)
    if (rows === null) {
      return {
        table: target.table,
        column: target.column,
        total_rows: 0,
        uuid_rows: 0,
        player_prefixed_rows: 0,
        other_rows: 0,
        non_uuid_rows: 0,
        non_uuid_percent: 0,
        missing_table: true,
      }
    }

    if (rows.length === 0) break

    for (const row of rows) {
      const rawValue = row[target.column]
      const normalized = typeof rawValue === 'string' ? rawValue : String(rawValue ?? '')
      const kind = classify(normalized)

      totalRows += 1
      if (kind === 'uuid') uuidRows += 1
      else if (kind === 'player_prefixed') prefixedRows += 1
      else otherRows += 1
    }

    offset += rows.length
    if (rows.length < PAGE_SIZE) break
  }

  const nonUuidRows = prefixedRows + otherRows
  const nonUuidPercent = totalRows > 0 ? Number(((nonUuidRows / totalRows) * 100).toFixed(2)) : 0

  return {
    table: target.table,
    column: target.column,
    total_rows: totalRows,
    uuid_rows: uuidRows,
    player_prefixed_rows: prefixedRows,
    other_rows: otherRows,
    non_uuid_rows: nonUuidRows,
    non_uuid_percent: nonUuidPercent,
    missing_table: false,
  }
}

async function main(): Promise<void> {
  loadEnv({ path: path.resolve(process.cwd(), '.env.local') })

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) fail('Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL')
  if (!serviceRoleKey) fail('Missing SUPABASE_SERVICE_ROLE_KEY')

  const restBaseUrl = `${supabaseUrl.replace(/\/$/, '')}/rest/v1`
  const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || 'unknown'

  const tableAudits: TableAudit[] = []
  for (const target of TABLE_TARGETS) {
    // eslint-disable-next-line no-await-in-loop
    const result = await auditTable(restBaseUrl, serviceRoleKey, target)
    tableAudits.push(result)
  }

  const summary = tableAudits.reduce(
    (acc, table) => {
      acc.total_rows += table.total_rows
      acc.uuid_rows += table.uuid_rows
      acc.player_prefixed_rows += table.player_prefixed_rows
      acc.other_rows += table.other_rows
      acc.non_uuid_rows += table.non_uuid_rows
      return acc
    },
    {
      total_rows: 0,
      uuid_rows: 0,
      player_prefixed_rows: 0,
      other_rows: 0,
      non_uuid_rows: 0,
    },
  )

  const profileAudit = tableAudits.find((table) => table.table === 'player_profiles')
  if (!profileAudit) fail('Internal error: player_profiles audit missing')

  const gatePassed = profileAudit.non_uuid_rows === 0
  const report: AuditReport = {
    generated_at: new Date().toISOString(),
    project_ref: projectRef,
    rest_url: restBaseUrl,
    pagination_limit: PAGE_SIZE,
    summary,
    player_profiles_gate: {
      status: gatePassed ? 'pass' : 'fail',
      non_uuid_rows: profileAudit.non_uuid_rows,
      reason: gatePassed
        ? 'All player_profiles.user_id values are UUID-format.'
        : 'Found non-UUID player_profiles.user_id values. Production UUID-only gate is not met.',
    },
    tables: tableAudits,
  }

  writeReport(report)

  // eslint-disable-next-line no-console
  console.log(`[verify-user-id-uuid-readiness] report: ${path.relative(process.cwd(), REPORT_PATH)}`)
  // eslint-disable-next-line no-console
  console.log(
    `[verify-user-id-uuid-readiness] player_profiles non_uuid_rows=${profileAudit.non_uuid_rows} (status=${report.player_profiles_gate.status})`,
  )

  if (!gatePassed) {
    fail('UUID-only gate failed for player_profiles.user_id')
  }
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : String(error))
})

