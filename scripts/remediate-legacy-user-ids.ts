import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

import { config as loadEnv } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

type TargetTable = {
  table: string
  column: string
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const PAGE_SIZE = Number(process.env.UUID_AUDIT_PAGE_SIZE || 1000)
const USER_ID_NAMESPACE = 'lux-story:user-id-remediation:v1'

const TARGET_TABLES: TargetTable[] = [
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

const args = new Set(process.argv.slice(2))
const execute = args.has('--execute')

function fail(message: string): never {
  // eslint-disable-next-line no-console
  console.error(`[remediate-legacy-user-ids] ${message}`)
  process.exit(1)
}

function stableUuidFromLegacyId(legacyId: string): string {
  const hash = createHash('sha256').update(`${USER_ID_NAMESPACE}:${legacyId}`).digest()
  const bytes = Buffer.from(hash.subarray(0, 16))

  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  const hex = bytes.toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
}

async function fetchAllPlayerProfiles(supabase: ReturnType<typeof createClient>): Promise<Array<Record<string, unknown>>> {
  const allRows: Array<Record<string, unknown>> = []
  let offset = 0

  while (true) {
    const { data, error } = await supabase
      .from('player_profiles')
      .select('*')
      .order('user_id', { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1)

    if (error) fail(`Failed reading player_profiles: ${error.message}`)
    if (!data || data.length === 0) break

    allRows.push(...(data as Array<Record<string, unknown>>))
    offset += data.length
    if (data.length < PAGE_SIZE) break
  }

  return allRows
}

async function tableRowCountForIds(
  supabase: ReturnType<typeof createClient>,
  target: TargetTable,
  ids: string[],
): Promise<number> {
  if (ids.length === 0) return 0

  const { count, error } = await supabase
    .from(target.table)
    .select('*', { count: 'exact', head: true })
    .in(target.column, ids)

  if (error) fail(`Failed counting ${target.table}.${target.column}: ${error.message}`)
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

  const allProfiles = await fetchAllPlayerProfiles(supabase)
  const uuidProfiles = new Set<string>()
  const legacyProfiles = new Map<string, Record<string, unknown>>()

  for (const row of allProfiles) {
    const userId = String(row.user_id ?? '')
    if (UUID_REGEX.test(userId)) uuidProfiles.add(userId)
    else legacyProfiles.set(userId, row)
  }

  const legacyIds = [...legacyProfiles.keys()].sort()
  const mapping = new Map<string, string>()
  const allTargetIds = new Set<string>(uuidProfiles)

  for (const oldId of legacyIds) {
    let newId = stableUuidFromLegacyId(oldId)
    let guard = 0
    while (allTargetIds.has(newId)) {
      guard += 1
      newId = stableUuidFromLegacyId(`${oldId}:${guard}`)
      if (guard > 50) fail(`Could not derive collision-free UUID for ${oldId}`)
    }
    mapping.set(oldId, newId)
    allTargetIds.add(newId)
  }

  const childCounts: Record<string, number> = {}
  for (const target of TARGET_TABLES) {
    // eslint-disable-next-line no-await-in-loop
    childCounts[`${target.table}.${target.column}`] = await tableRowCountForIds(supabase, target, legacyIds)
  }

  const backupPayload = {
    generated_at: new Date().toISOString(),
    project_ref: supabaseUrl.split('//')[1]?.split('.')[0] ?? 'unknown',
    legacy_profile_count: legacyIds.length,
    mapping: Object.fromEntries(mapping),
    child_counts: childCounts,
  }

  const backupPath = path.join('/tmp', `lux-story-user-id-remediation-backup-${Date.now()}.json`)
  fs.writeFileSync(backupPath, `${JSON.stringify(backupPayload, null, 2)}\n`, 'utf8')

  // eslint-disable-next-line no-console
  console.log(`[remediate-legacy-user-ids] backup: ${backupPath}`)
  // eslint-disable-next-line no-console
  console.log(`[remediate-legacy-user-ids] legacy profiles: ${legacyIds.length}`)
  // eslint-disable-next-line no-console
  console.log(`[remediate-legacy-user-ids] mode: ${execute ? 'EXECUTE' : 'DRY-RUN'}`)

  if (!execute) {
    // eslint-disable-next-line no-console
    console.log('[remediate-legacy-user-ids] dry-run complete. Re-run with --execute to apply changes.')
    return
  }

  let migratedProfiles = 0

  for (const oldId of legacyIds) {
    const sourceProfile = legacyProfiles.get(oldId)
    const newId = mapping.get(oldId)
    if (!sourceProfile || !newId) continue

    const { data: existingNew, error: existingNewError } = await supabase
      .from('player_profiles')
      .select('user_id')
      .eq('user_id', newId)
      .maybeSingle()
    if (existingNewError) fail(`Failed checking new profile for ${oldId}: ${existingNewError.message}`)

    if (!existingNew) {
      const clonePayload: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(sourceProfile)) {
        if (key === 'id' || key === 'user_id') continue
        clonePayload[key] = value
      }
      clonePayload.user_id = newId

      const { error: insertError } = await supabase.from('player_profiles').insert(clonePayload)
      if (insertError) fail(`Failed cloning profile ${oldId} -> ${newId}: ${insertError.message}`)
    }

    for (const target of TARGET_TABLES) {
      const payload = { [target.column]: newId }
      const { error: updateError } = await supabase
        .from(target.table)
        .update(payload)
        .eq(target.column, oldId)
      if (updateError) {
        fail(`Failed updating ${target.table}.${target.column} for ${oldId}: ${updateError.message}`)
      }
    }

    const { error: deleteError } = await supabase
      .from('player_profiles')
      .delete()
      .eq('user_id', oldId)
    if (deleteError) fail(`Failed deleting legacy profile ${oldId}: ${deleteError.message}`)

    migratedProfiles += 1
  }

  // eslint-disable-next-line no-console
  console.log(`[remediate-legacy-user-ids] migrated profiles: ${migratedProfiles}`)
}

main().catch((error) => fail(error instanceof Error ? error.message : String(error)))

