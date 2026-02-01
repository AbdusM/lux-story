#!/usr/bin/env node
/* eslint-disable no-console */
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const migrationsDir = join(process.cwd(), 'supabase', 'migrations')
const sqlFiles = readdirSync(migrationsDir).filter((file) => file.endsWith('.sql'))
const sql = sqlFiles.map((file) => readFileSync(join(migrationsDir, file), 'utf8')).join('\n')

const checks = [
  {
    name: 'platform_states core sync fields',
    table: 'platform_states',
    columns: ['current_scene', 'global_flags', 'patterns']
  },
  {
    name: 'career_analytics ui engagement fields',
    table: 'career_analytics',
    columns: ['choices_made', 'time_spent_seconds', 'sections_viewed', 'birmingham_opportunities']
  },
  {
    name: 'user_action_plans table',
    table: 'user_action_plans',
    columns: ['user_id', 'plan_data']
  },
  {
    name: 'player_patterns legacy + canonical names',
    table: 'player_patterns',
    columns: ['analytical', 'analyzing']
  }
]

const failures = []

const hasColumn = (table, column) => {
  const tableRegex = new RegExp(`\\b${table}\\b`, 'i')
  if (!tableRegex.test(sql)) return false
  const columnRegex = new RegExp(`\\b${column}\\b`, 'i')
  return columnRegex.test(sql)
}

for (const check of checks) {
  for (const column of check.columns) {
    if (!hasColumn(check.table, column)) {
      failures.push(`${check.name}: missing "${column}" in "${check.table}"`)
    }
  }
}

if (failures.length > 0) {
  console.error('Core gameplay contract checks failed:')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exit(1)
}

console.log('Core gameplay contract checks passed.')
