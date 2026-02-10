#!/usr/bin/env tsx
/**
 * Feature Inventory (AAA)
 *
 * Generates an inventory of feature flags + experiments, including:
 * - defaults (on/off)
 * - usage counts + references in code
 * - unused flags (declared but never referenced)
 * - unknown flag usage (referenced in code but not declared)
 *
 * Outputs:
 * - docs/qa/feature-inventory.report.json
 * - docs/reference/FEATURE_INVENTORY.md
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

import { listFlags } from '@/lib/feature-flags'
import { ACTIVE_TESTS } from '@/lib/experiments'

type FlagType = 'boolean' | 'enum'

type FlagInventoryRow = {
  name: string
  type: FlagType
  default: boolean | string
  values?: readonly string[]
  off_by_default: boolean
  usage_count: number
  usage_count_runtime: number
  usage_count_tests: number
  usage_count_scripts: number
  usage_files: string[]
}

type ExperimentInventoryRow = {
  id: string
  variants: readonly string[]
  weights?: readonly number[]
  assignment_version: string
  usage_count: number
  usage_count_runtime: number
  usage_count_tests: number
  usage_count_scripts: number
  usage_files: string[]
}

type InventoryReport = {
  generated_at: string
  git_commit?: string
  flags: {
    total: number
    booleans: number
    enums: number
    off_by_default: number
    unused: number
    unknown_usages: number
    rows: FlagInventoryRow[]
    unused_flags: string[]
    unknown_flag_usages: Array<{ name: string; count: number; files: string[] }>
  }
  experiments: {
    active_total: number
    rows: ExperimentInventoryRow[]
  }
}

const REPO_ROOT = process.cwd()

const SCAN_DIRS = [
  'app',
  'components',
  'content',
  'hooks',
  'lib',
  'scripts',
  'tests',
] as const

const SKIP_DIRS = new Set([
  'node_modules',
  '.next',
  'out',
  'dist',
  'coverage',
  '.git',
] as const)

const CODE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'] as const)

function rel(p: string): string {
  return path.relative(REPO_ROOT, p)
}

function safeRead(filePath: string): string | null {
  try {
    return readFileSync(filePath, 'utf8')
  } catch {
    return null
  }
}

function walkFiles(dirAbs: string, out: string[]) {
  // Manual traversal to avoid adding deps.
  const entries = safeReadDir(dirAbs)
  if (!entries) return
  for (const ent of entries) {
    const abs = path.join(dirAbs, ent.name)
    if (ent.isDirectory) {
      if (SKIP_DIRS.has(ent.name as any)) continue
      walkFiles(abs, out)
      continue
    }
    const ext = path.extname(ent.name)
    if (!CODE_EXTS.has(ext as any)) continue
    out.push(abs)
  }
}

function safeReadDir(dirAbs: string): Array<{ name: string; isDirectory: boolean }> | null {
  try {
    return readdirSync(dirAbs, { withFileTypes: true }).map((d) => ({
      name: d.name,
      isDirectory: d.isDirectory(),
    }))
  } catch {
    return null
  }
}

function addUsage(map: Map<string, { count: number; files: Map<string, number> }>, name: string, file: string) {
  const prev = map.get(name)
  if (!prev) {
    map.set(name, { count: 1, files: new Map([[file, 1]]) })
    return
  }
  prev.count++
  prev.files.set(file, (prev.files.get(file) ?? 0) + 1)
}

function usageBucket(fileRel: string): 'runtime' | 'tests' | 'scripts' {
  if (fileRel.startsWith('tests/')) return 'tests'
  if (fileRel.startsWith('scripts/')) return 'scripts'
  return 'runtime'
}

function usageDist(u: { files: Map<string, number> }): {
  runtime: number
  tests: number
  scripts: number
} {
  let runtime = 0
  let tests = 0
  let scripts = 0
  for (const [file, count] of u.files.entries()) {
    const b = usageBucket(file)
    if (b === 'runtime') runtime += count
    else if (b === 'tests') tests += count
    else scripts += count
  }
  return { runtime, tests, scripts }
}

function countMatches(content: string, re: RegExp, onMatch: (name: string) => void) {
  // Ensure global regex.
  const r = new RegExp(re.source, re.flags.includes('g') ? re.flags : `${re.flags}g`)
  let m: RegExpExecArray | null = null
  while ((m = r.exec(content)) !== null) {
    const name = m[1]
    if (!name) continue
    onMatch(name)
  }
}

function getGitCommit(): string | undefined {
  try {
    const out = execSync('git rev-parse HEAD', { cwd: REPO_ROOT, stdio: ['ignore', 'pipe', 'ignore'] })
    return String(out).trim()
  } catch {
    return undefined
  }
}

function markdownEscape(s: string): string {
  return s.replace(/\|/g, '\\|')
}

function formatMdTable(rows: Array<Record<string, string>>, columns: string[]): string {
  const header = `| ${columns.join(' | ')} |`
  const sep = `| ${columns.map(() => '---').join(' | ')} |`
  const body = rows.map(r => `| ${columns.map(c => r[c] ?? '').join(' | ')} |`).join('\n')
  return [header, sep, body].filter(Boolean).join('\n')
}

function main() {
  const generatedAt = new Date().toISOString()
  const gitCommit = getGitCommit()

  const files: string[] = []
  for (const d of SCAN_DIRS) {
    const abs = path.join(REPO_ROOT, d)
    if (!existsSync(abs)) continue
    walkFiles(abs, files)
  }

  const flagUsage = new Map<string, { count: number; files: Map<string, number> }>()
  const expUsage = new Map<string, { count: number; files: Map<string, number> }>()

  // Match: isEnabled('<FLAG_NAME>'), getFlag("<FLAG_NAME>"), setFlag('<FLAG_NAME>')
  const FLAG_CALL_RE = /\b(?:isEnabled|getFlag|setFlag)\(\s*['"]([A-Z0-9_]+)['"]\s*[,)]/g
  // Match: featureFlags.set('<FLAG_NAME>') etc (dev console usage)
  const FLAG_CONSOLE_RE = /\bfeatureFlags\.(?:set|get|reset)\(\s*['"]([A-Z0-9_]+)['"]\s*[,)]/g

  // Experiments: assignVariant('TEST'), assignVariantAndTrack({ testId: 'TEST' ... })
  const EXP_ASSIGN_RE = /\bassignVariant\(\s*['"]([A-Za-z0-9._-]+)['"]\s*[,)]/g
  const EXP_TRACK_RE = /\bassignVariantAndTrack\(\s*\{\s*[^}]*?\btestId\s*:\s*['"]([A-Za-z0-9._-]+)['"]/g

  for (const f of files) {
    const content = safeRead(f)
    if (!content) continue

    countMatches(content, FLAG_CALL_RE, (name) => addUsage(flagUsage, name, rel(f)))
    countMatches(content, FLAG_CONSOLE_RE, (name) => addUsage(flagUsage, name, rel(f)))
    countMatches(content, EXP_ASSIGN_RE, (id) => addUsage(expUsage, id, rel(f)))
    countMatches(content, EXP_TRACK_RE, (id) => addUsage(expUsage, id, rel(f)))
  }

  const declaredFlags = listFlags()
  const declaredFlagNames = new Set<string>(declaredFlags.map(f => String(f.name)))

  const unknownFlagUsages: Array<{ name: string; count: number; files: string[] }> = []
  for (const [name, u] of flagUsage.entries()) {
    if (declaredFlagNames.has(name)) continue
    unknownFlagUsages.push({ name, count: u.count, files: Array.from(u.files.keys()).sort() })
  }
  unknownFlagUsages.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

  const rows: FlagInventoryRow[] = declaredFlags.map((def) => {
    const name = String(def.name)
    const usage = flagUsage.get(name)
    const offByDefault = def.type === 'boolean'
      ? def.default === false
      : false // enums are always "on" but default variant is still informative

    const usageFiles = usage ? Array.from(usage.files.keys()).sort() : []
    const usageCount = usage?.count ?? 0
    const dist = usage ? usageDist(usage) : { runtime: 0, tests: 0, scripts: 0 }

    return {
      name,
      type: def.type,
      default: def.default,
      values: def.values,
      off_by_default: offByDefault,
      usage_count: usageCount,
      usage_count_runtime: dist.runtime,
      usage_count_tests: dist.tests,
      usage_count_scripts: dist.scripts,
      usage_files: usageFiles,
    }
  }).sort((a, b) => {
    // off-by-default first, then alphabetical
    if (a.off_by_default !== b.off_by_default) return a.off_by_default ? -1 : 1
    return a.name.localeCompare(b.name)
  })

  const unusedFlags = rows.filter(r => r.usage_count === 0).map(r => r.name).sort()

  // Experiments
  const experimentRows: ExperimentInventoryRow[] = Object.values(ACTIVE_TESTS).map((t) => {
    const usage = expUsage.get(t.id)
    const usageFiles = usage ? Array.from(usage.files.keys()).sort() : []
    const usageCount = usage?.count ?? 0
    const dist = usage ? usageDist(usage) : { runtime: 0, tests: 0, scripts: 0 }
    return {
      id: t.id,
      variants: t.variants,
      weights: t.weights,
      assignment_version: t.assignmentVersion,
      usage_count: usageCount,
      usage_count_runtime: dist.runtime,
      usage_count_tests: dist.tests,
      usage_count_scripts: dist.scripts,
      usage_files: usageFiles,
    }
  }).sort((a, b) => a.id.localeCompare(b.id))

  const report: InventoryReport = {
    generated_at: generatedAt,
    git_commit: gitCommit,
    flags: {
      total: rows.length,
      booleans: rows.filter(r => r.type === 'boolean').length,
      enums: rows.filter(r => r.type === 'enum').length,
      off_by_default: rows.filter(r => r.off_by_default).length,
      unused: unusedFlags.length,
      unknown_usages: unknownFlagUsages.length,
      rows,
      unused_flags: unusedFlags,
      unknown_flag_usages: unknownFlagUsages,
    },
    experiments: {
      active_total: experimentRows.length,
      rows: experimentRows,
    },
  }

  // Ensure output dirs.
  const qaDir = path.join(REPO_ROOT, 'docs/qa')
  const refDir = path.join(REPO_ROOT, 'docs/reference')
  mkdirSync(qaDir, { recursive: true })
  mkdirSync(refDir, { recursive: true })

  const jsonPath = path.join(qaDir, 'feature-inventory.report.json')
  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  // Markdown index
  const mdPath = path.join(refDir, 'FEATURE_INVENTORY.md')
  const mdLines: string[] = []
  mdLines.push('# Feature Inventory')
  mdLines.push('')
  mdLines.push(`Generated: \`${generatedAt}\`${gitCommit ? ` (commit \`${gitCommit.slice(0, 12)}\`)` : ''}`)
  mdLines.push('')
  mdLines.push('This document is generated by `npm run report:features`.')
  mdLines.push('')

  mdLines.push('## Feature Flags')
  mdLines.push('')
  mdLines.push(`Total: **${report.flags.total}** (booleans: **${report.flags.booleans}**, enums: **${report.flags.enums}**)`)
  mdLines.push(`Off by default: **${report.flags.off_by_default}**`)
  mdLines.push(`Unused (declared but not referenced): **${report.flags.unused}**`)
  mdLines.push(`Unknown usages (referenced but not declared): **${report.flags.unknown_usages}**`)
  mdLines.push('')

  const flagTable = formatMdTable(
    rows.map(r => ({
      Flag: `\`${r.name}\``,
      Type: r.type,
      Default: `\`${String(r.default)}\``,
      Status: r.type === 'boolean'
        ? (r.off_by_default ? 'OFF (default)' : 'ON (default)')
        : `default=\`${String(r.default)}\``,
      Used: r.usage_count ? `**${r.usage_count}**` : '0',
      Runtime: r.usage_count_runtime ? `**${r.usage_count_runtime}**` : '0',
      References: r.usage_files.length ? r.usage_files.slice(0, 4).map(f => `\`${f}\``).join(', ') + (r.usage_files.length > 4 ? ` (+${r.usage_files.length - 4})` : '') : '',
    })),
    ['Flag', 'Type', 'Default', 'Status', 'Used', 'Runtime', 'References']
  )
  mdLines.push(flagTable)
  mdLines.push('')

  mdLines.push('### Dev Overrides (Safe)')
  mdLines.push('')
  mdLines.push('- Query param (dev only): `?ff_ENFORCE_REQUIRED_STATE=true`')
  mdLines.push('- localStorage (dev only): `localStorage.setItem(\"ff_ENFORCE_REQUIRED_STATE\", \"true\")`')
  mdLines.push('- Dev console (dev only): `featureFlags.set(\"ENFORCE_REQUIRED_STATE\", true)`')
  mdLines.push('- Build/runtime env: `NEXT_PUBLIC_FF_ENFORCE_REQUIRED_STATE=true`')
  mdLines.push('')

  if (unusedFlags.length) {
    mdLines.push('### Unused Flags (Debt)')
    mdLines.push('')
    mdLines.push(unusedFlags.map(f => `- \`${f}\``).join('\n'))
    mdLines.push('')
  }

  if (unknownFlagUsages.length) {
    mdLines.push('### Unknown Flag Usages (Bug)')
    mdLines.push('')
    mdLines.push('These are string-literal flag names found in code that are not present in `FEATURE_FLAGS`.')
    mdLines.push('')
    for (const u of unknownFlagUsages.slice(0, 30)) {
      mdLines.push(`- \`${u.name}\` (${u.count}): ${u.files.slice(0, 6).map(f => `\`${f}\``).join(', ')}${u.files.length > 6 ? ` (+${u.files.length - 6})` : ''}`)
    }
    if (unknownFlagUsages.length > 30) {
      mdLines.push(`- …and ${unknownFlagUsages.length - 30} more`)
    }
    mdLines.push('')
  }

  mdLines.push('## Experiments')
  mdLines.push('')
  if (!experimentRows.length) {
    mdLines.push('No active experiments registered in `ACTIVE_TESTS`.')
    mdLines.push('')
  } else {
    const expTable = formatMdTable(
      experimentRows.map(r => ({
        Test: `\`${markdownEscape(r.id)}\``,
        Variants: r.variants.map(v => `\`${markdownEscape(v)}\``).join(', '),
        Version: `\`${markdownEscape(r.assignment_version)}\``,
        Used: r.usage_count ? `**${r.usage_count}**` : '0',
        References: r.usage_files.length ? r.usage_files.slice(0, 4).map(f => `\`${f}\``).join(', ') + (r.usage_files.length > 4 ? ` (+${r.usage_files.length - 4})` : '') : '',
      })),
      ['Test', 'Variants', 'Version', 'Used', 'References']
    )
    mdLines.push(expTable)
    mdLines.push('')
  }

  writeFileSync(mdPath, `${mdLines.join('\n')}\n`, 'utf8')

  // Small console summary for CI logs.
  // eslint-disable-next-line no-console
  console.log('[report-feature-inventory] OK', {
    flags_total: report.flags.total,
    flags_off_by_default: report.flags.off_by_default,
    flags_unused: report.flags.unused,
    flags_unknown_usages: report.flags.unknown_usages,
    experiments_active: report.experiments.active_total,
    json: rel(jsonPath),
    md: rel(mdPath),
  })
}

main()
