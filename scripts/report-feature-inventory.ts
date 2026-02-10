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
import * as ts from 'typescript'

import { listFlags } from '@/lib/feature-flags'
import { ACTIVE_TESTS } from '@/lib/experiments'
import { STORAGE_KEYS, DEV_STORAGE_KEYS, LEGACY_KEY_MAP, type StorageKey } from '@/lib/persistence/storage-keys'

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

type StorageKeyCategory =
  | 'core_game_state'
  | 'user_settings'
  | 'ui_state'
  | 'player_identity'
  | 'admin'
  | 'error_recovery'
  | 'dev_tools'
  | 'legacy'
  | 'unknown'

type StorageKeyInventoryRow = {
  name: string
  value: string
  category: StorageKeyCategory
  usage_count: number
  usage_count_runtime: number
  usage_count_tests: number
  usage_count_scripts: number
  usage_files: string[]
}

type EnvVarInventoryRow = {
  name: string
  kind: 'public' | 'server'
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
  storage_keys: {
    total: number
    unused: number
    unknown_usages: number
    rows: StorageKeyInventoryRow[]
    unused_keys: string[]
    unknown_key_usages: Array<{ name: string; count: number; files: string[] }>
  }
  env_vars: {
    total: number
    public_total: number
    server_total: number
    rows: EnvVarInventoryRow[]
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

function addUsageN(
  map: Map<string, { count: number; files: Map<string, number> }>,
  name: string,
  file: string,
  n: number
) {
  if (!Number.isFinite(n) || n <= 0) return
  const prev = map.get(name)
  if (!prev) {
    map.set(name, { count: n, files: new Map([[file, n]]) })
    return
  }
  prev.count += n
  prev.files.set(file, (prev.files.get(file) ?? 0) + n)
}

function addUsage(map: Map<string, { count: number; files: Map<string, number> }>, name: string, file: string) {
  addUsageN(map, name, file, 1)
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

function storageCategoryForKey(name: string): StorageKeyCategory {
  // Keep this mapping stable and obvious; it mirrors lib/persistence/storage-keys.ts sections.
  const core = new Set<StorageKey>(['GAME_STORE', 'GAME_SAVE', 'GAME_SAVE_BACKUP', 'ACTIVE_TABS'])
  const settings = new Set<StorageKey>([
    'AUDIO_MUTED',
    'AUDIO_VOLUME',
    'REDUCED_MOTION',
    'ACCESSIBILITY_PROFILE',
    'TEXT_SIZE',
    'COLOR_BLIND_MODE',
    'COGNITIVE_LOAD_LEVEL',
    'KEYBOARD_SHORTCUTS',
  ])
  const ui = new Set<StorageKey>(['GUEST_MODE', 'LOCAL_MODE_SEEN', 'KEYBOARD_HINT_SHOWN', 'SETTINGS_DISCOVERED'])
  const identity = new Set<StorageKey>(['PLAYER_ID', 'PLAYER_PERSONAS'])
  const admin = new Set<StorageKey>(['ADMIN_VIEW_MODE'])
  const recovery = new Set<StorageKey>(['CURRENT_SCENE_ID', 'LAST_KNOWN_SCENE_ID'])

  if ((core as Set<string>).has(name)) return 'core_game_state'
  if ((settings as Set<string>).has(name)) return 'user_settings'
  if ((ui as Set<string>).has(name)) return 'ui_state'
  if ((identity as Set<string>).has(name)) return 'player_identity'
  if ((admin as Set<string>).has(name)) return 'admin'
  if ((recovery as Set<string>).has(name)) return 'error_recovery'
  return 'unknown'
}

function scriptKindForFile(fileRel: string): ts.ScriptKind {
  const ext = path.extname(fileRel).toLowerCase()
  if (ext === '.ts') return ts.ScriptKind.TS
  if (ext === '.tsx') return ts.ScriptKind.TSX
  if (ext === '.jsx') return ts.ScriptKind.JSX
  // Treat .js/.mjs/.cjs as JS.
  return ts.ScriptKind.JS
}

function stringText(expr: ts.Expression | undefined): string | null {
  if (!expr) return null
  if (ts.isStringLiteral(expr)) return expr.text
  if (ts.isNoSubstitutionTemplateLiteral(expr)) return expr.text
  return null
}

function isIdentifierNamed(expr: ts.Expression, name: string): boolean {
  return ts.isIdentifier(expr) && expr.text === name
}

function isProcessEnv(expr: ts.Expression): boolean {
  return (
    ts.isPropertyAccessExpression(expr) &&
    isIdentifierNamed(expr.expression, 'process') &&
    expr.name.text === 'env'
  )
}

function isLocalStorageExpr(expr: ts.Expression): boolean {
  if (isIdentifierNamed(expr, 'localStorage')) return true
  if (ts.isPropertyAccessExpression(expr)) {
    // window.localStorage / globalThis.localStorage
    if (expr.name.text !== 'localStorage') return false
    return isIdentifierNamed(expr.expression, 'window') || isIdentifierNamed(expr.expression, 'globalThis')
  }
  return false
}

function isSafeStorageExpr(expr: ts.Expression): boolean {
  return isIdentifierNamed(expr, 'safeStorage')
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
  const storageKeyUsage = new Map<string, { count: number; files: Map<string, number> }>()
  const envVarUsage = new Map<string, { count: number; files: Map<string, number> }>()

  const storageKeyNameByValue = new Map<string, string>()
  for (const k of Object.keys(STORAGE_KEYS) as StorageKey[]) storageKeyNameByValue.set(STORAGE_KEYS[k], k)
  for (const k of Object.keys(DEV_STORAGE_KEYS)) storageKeyNameByValue.set((DEV_STORAGE_KEYS as Record<string, string>)[k]!, `DEV:${k}`)
  for (const k of Object.keys(LEGACY_KEY_MAP)) storageKeyNameByValue.set(k, `LEGACY:${k}`)

  for (const f of files) {
    const fileRel = rel(f)
    const content = safeRead(f)
    if (!content) continue

    const sf = ts.createSourceFile(fileRel, content, ts.ScriptTarget.Latest, true, scriptKindForFile(fileRel))

    const recordFlag = (name: string) => addUsage(flagUsage, name, fileRel)
    const recordExp = (id: string) => addUsage(expUsage, id, fileRel)
    const recordStorageKey = (name: string) => addUsage(storageKeyUsage, name, fileRel)
    const recordEnv = (name: string) => addUsage(envVarUsage, name, fileRel)

    const visit = (node: ts.Node) => {
      // Feature flags
      if (ts.isCallExpression(node)) {
        const callee = node.expression
        const arg0 = node.arguments[0]

        // isEnabled/getFlag/setFlag('FLAG')
        if (ts.isIdentifier(callee)) {
          const fn = callee.text
          if (fn === 'isEnabled' || fn === 'getFlag' || fn === 'setFlag') {
            const s = stringText(arg0)
            if (s) recordFlag(s)
          }
          if (fn === 'assignVariant') {
            const s = stringText(arg0)
            if (s) recordExp(s)
          }
          if (fn === 'assignVariantAndTrack') {
            // assignVariantAndTrack({ testId: '...' })
            const obj = arg0
            if (obj && ts.isObjectLiteralExpression(obj)) {
              for (const prop of obj.properties) {
                if (!ts.isPropertyAssignment(prop)) continue
                const key = prop.name
                const keyText = ts.isIdentifier(key) ? key.text : ts.isStringLiteral(key) ? key.text : null
                if (keyText !== 'testId') continue
                const v = stringText(prop.initializer)
                if (v) recordExp(v)
              }
            }
          }
        }

        // obj.isEnabled/getFlag/setFlag('FLAG') (e.g. imported module namespace)
        if (ts.isPropertyAccessExpression(callee)) {
          const fn = callee.name.text
          if (fn === 'isEnabled' || fn === 'getFlag' || fn === 'setFlag') {
            const s = stringText(arg0)
            if (s) recordFlag(s)
          }
        }

        // featureFlags.set('FLAG')
        if (ts.isPropertyAccessExpression(callee) && ts.isIdentifier(callee.expression) && callee.expression.text === 'featureFlags') {
          const method = callee.name.text
          if (method === 'set' || method === 'get' || method === 'reset') {
            const s = stringText(arg0)
            if (s) recordFlag(s)
          }
        }

        // localStorage/safeStorage string literal key usage
        if (ts.isPropertyAccessExpression(callee)) {
          const method = callee.name.text
          if (method === 'getItem' || method === 'setItem' || method === 'removeItem') {
            const target = callee.expression
            // Avoid false-positives on unrelated getItem/setItem methods.
            // (We only inventory storage key usage through localStorage/safeStorage.)
            if (isLocalStorageExpr(target) || isSafeStorageExpr(target)) {
              const key = stringText(arg0)
              if (key) {
                const name = storageKeyNameByValue.get(key)
                if (name) recordStorageKey(name)
              }
            }
          }
        }
      }

      // Storage key registries: STORAGE_KEYS.FOO / DEV_STORAGE_KEYS.BAR
      if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.expression)) {
        if (node.expression.text === 'STORAGE_KEYS') {
          recordStorageKey(node.name.text)
        }
        if (node.expression.text === 'DEV_STORAGE_KEYS') {
          recordStorageKey(`DEV:${node.name.text}`)
        }
      }

      // Env vars: process.env.FOO / process.env['FOO']
      if (ts.isPropertyAccessExpression(node) && isProcessEnv(node.expression)) {
        recordEnv(node.name.text)
      }
      if (ts.isElementAccessExpression(node) && isProcessEnv(node.expression)) {
        const s = stringText(node.argumentExpression as ts.Expression | undefined)
        if (s) recordEnv(s)
      }
      if (ts.isVariableDeclaration(node) && node.initializer && isProcessEnv(node.initializer) && ts.isObjectBindingPattern(node.name)) {
        for (const el of node.name.elements) {
          const key = el.propertyName ?? el.name
          if (ts.isIdentifier(key)) recordEnv(key.text)
          if (ts.isStringLiteral(key)) recordEnv(key.text)
        }
      }

      ts.forEachChild(node, visit)
    }

    ts.forEachChild(sf, visit)
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

  // Storage keys (canonical + dev + legacy mapping)
  const declaredStorageKeys: StorageKeyInventoryRow[] = (Object.keys(STORAGE_KEYS) as StorageKey[]).map((k) => {
    const usage = storageKeyUsage.get(k)
    const usageFiles = usage ? Array.from(usage.files.keys()).sort() : []
    const usageCount = usage?.count ?? 0
    const dist = usage ? usageDist(usage) : { runtime: 0, tests: 0, scripts: 0 }
    return {
      name: k,
      value: STORAGE_KEYS[k],
      category: storageCategoryForKey(k),
      usage_count: usageCount,
      usage_count_runtime: dist.runtime,
      usage_count_tests: dist.tests,
      usage_count_scripts: dist.scripts,
      usage_files: usageFiles,
    }
  })

  const declaredDevStorageKeys: StorageKeyInventoryRow[] = Object.keys(DEV_STORAGE_KEYS).map((k) => {
    const name = `DEV:${k}`
    const usage = storageKeyUsage.get(name)
    const usageFiles = usage ? Array.from(usage.files.keys()).sort() : []
    const usageCount = usage?.count ?? 0
    const dist = usage ? usageDist(usage) : { runtime: 0, tests: 0, scripts: 0 }
    return {
      name,
      value: (DEV_STORAGE_KEYS as Record<string, string>)[k]!,
      category: 'dev_tools',
      usage_count: usageCount,
      usage_count_runtime: dist.runtime,
      usage_count_tests: dist.tests,
      usage_count_scripts: dist.scripts,
      usage_files: usageFiles,
    }
  })

  const legacyRows: StorageKeyInventoryRow[] = Object.keys(LEGACY_KEY_MAP).map((legacyKey) => {
    const name = `LEGACY:${legacyKey}`
    const usage = storageKeyUsage.get(name)
    const usageFiles = usage ? Array.from(usage.files.keys()).sort() : []
    const usageCount = usage?.count ?? 0
    const dist = usage ? usageDist(usage) : { runtime: 0, tests: 0, scripts: 0 }
    return {
      name,
      value: legacyKey,
      category: 'legacy',
      usage_count: usageCount,
      usage_count_runtime: dist.runtime,
      usage_count_tests: dist.tests,
      usage_count_scripts: dist.scripts,
      usage_files: usageFiles,
    }
  })

  const storageRows: StorageKeyInventoryRow[] = [
    ...declaredStorageKeys,
    ...declaredDevStorageKeys,
    ...legacyRows,
  ].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))

  const declaredStorageKeyNames = new Set<string>([
    ...Object.keys(STORAGE_KEYS),
    ...Object.keys(DEV_STORAGE_KEYS).map(k => `DEV:${k}`),
    ...Object.keys(LEGACY_KEY_MAP).map(k => `LEGACY:${k}`),
  ])

  const unknownStorageUsages: Array<{ name: string; count: number; files: string[] }> = []
  for (const [name, u] of storageKeyUsage.entries()) {
    if (declaredStorageKeyNames.has(name)) continue
    unknownStorageUsages.push({ name, count: u.count, files: Array.from(u.files.keys()).sort() })
  }
  unknownStorageUsages.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

  const unusedStorageKeys = storageRows.filter(r => r.usage_count === 0).map(r => r.name).sort()

  // Env vars (anything referenced via process.env)
  const envRows: EnvVarInventoryRow[] = Array.from(envVarUsage.entries()).map(([name, u]) => {
    const usageFiles = Array.from(u.files.keys()).sort()
    const dist = usageDist(u)
    const kind = name.startsWith('NEXT_PUBLIC_') ? 'public' : 'server'
    return {
      name,
      kind,
      usage_count: u.count,
      usage_count_runtime: dist.runtime,
      usage_count_tests: dist.tests,
      usage_count_scripts: dist.scripts,
      usage_files: usageFiles,
    }
  }).sort((a, b) => a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name))

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
    storage_keys: {
      total: storageRows.length,
      unused: unusedStorageKeys.length,
      unknown_usages: unknownStorageUsages.length,
      rows: storageRows,
      unused_keys: unusedStorageKeys,
      unknown_key_usages: unknownStorageUsages,
    },
    env_vars: {
      total: envRows.length,
      public_total: envRows.filter(e => e.kind === 'public').length,
      server_total: envRows.filter(e => e.kind === 'server').length,
      rows: envRows,
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

  mdLines.push('## localStorage Keys')
  mdLines.push('')
  mdLines.push(`Total: **${report.storage_keys.total}**`)
  mdLines.push(`Unused (declared but not referenced): **${report.storage_keys.unused}**`)
  mdLines.push(`Unknown usages (referenced but not declared): **${report.storage_keys.unknown_usages}**`)
  mdLines.push('')

  const storageTable = formatMdTable(
    report.storage_keys.rows.map(r => ({
      Key: `\`${r.name}\``,
      Category: r.category,
      Value: `\`${markdownEscape(r.value)}\``,
      Used: r.usage_count ? `**${r.usage_count}**` : '0',
      Runtime: r.usage_count_runtime ? `**${r.usage_count_runtime}**` : '0',
      References: r.usage_files.length ? r.usage_files.slice(0, 4).map(f => `\`${f}\``).join(', ') + (r.usage_files.length > 4 ? ` (+${r.usage_files.length - 4})` : '') : '',
    })),
    ['Key', 'Category', 'Value', 'Used', 'Runtime', 'References']
  )
  mdLines.push(storageTable)
  mdLines.push('')

  if (report.storage_keys.unused_keys.length) {
    mdLines.push('### Unused Keys (Debt)')
    mdLines.push('')
    mdLines.push(report.storage_keys.unused_keys.map(k => `- \`${k}\``).join('\n'))
    mdLines.push('')
  }

  if (report.storage_keys.unknown_key_usages.length) {
    mdLines.push('### Unknown Key Usages (Bug)')
    mdLines.push('')
    for (const u of report.storage_keys.unknown_key_usages.slice(0, 30)) {
      mdLines.push(`- \`${u.name}\` (${u.count}): ${u.files.slice(0, 6).map(f => `\`${f}\``).join(', ')}${u.files.length > 6 ? ` (+${u.files.length - 6})` : ''}`)
    }
    if (report.storage_keys.unknown_key_usages.length > 30) {
      mdLines.push(`- …and ${report.storage_keys.unknown_key_usages.length - 30} more`)
    }
    mdLines.push('')
  }

  mdLines.push('## Environment Variables')
  mdLines.push('')
  mdLines.push(`Total referenced via \`process.env\`: **${report.env_vars.total}** (public: **${report.env_vars.public_total}**, server: **${report.env_vars.server_total}**)`)
  mdLines.push('')

  const envTable = formatMdTable(
    report.env_vars.rows.map(r => ({
      Var: `\`${r.name}\``,
      Kind: r.kind,
      Used: r.usage_count ? `**${r.usage_count}**` : '0',
      Runtime: r.usage_count_runtime ? `**${r.usage_count_runtime}**` : '0',
      References: r.usage_files.length ? r.usage_files.slice(0, 4).map(f => `\`${f}\``).join(', ') + (r.usage_files.length > 4 ? ` (+${r.usage_files.length - 4})` : '') : '',
    })),
    ['Var', 'Kind', 'Used', 'Runtime', 'References']
  )
  mdLines.push(envTable)
  mdLines.push('')

  writeFileSync(mdPath, `${mdLines.join('\n')}\n`, 'utf8')

  // Small console summary for CI logs.
  // eslint-disable-next-line no-console
  console.log('[report-feature-inventory] OK', {
    flags_total: report.flags.total,
    flags_off_by_default: report.flags.off_by_default,
    flags_unused: report.flags.unused,
    flags_unknown_usages: report.flags.unknown_usages,
    experiments_active: report.experiments.active_total,
    storage_keys_total: report.storage_keys.total,
    env_vars_total: report.env_vars.total,
    json: rel(jsonPath),
    md: rel(mdPath),
  })
}

main()
