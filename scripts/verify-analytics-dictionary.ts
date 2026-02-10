import fs from 'node:fs/promises'
import path from 'node:path'

import { INTERACTION_EVENT_TYPES } from '@/lib/telemetry/interaction-events-spec'

const REPO_ROOT = process.cwd()

const CODE_DIRS = ['app', 'components', 'hooks', 'lib']
const DOC_PATH = path.join(REPO_ROOT, 'docs/reference/data-dictionary/12-analytics.md')
const EVENT_BUS_PATH = path.join(REPO_ROOT, 'lib/event-bus.ts')
const EVENT_BUS_META_PATH = path.join(REPO_ROOT, 'lib/telemetry/event-bus-meta.ts')

const SKIP_DIR_NAMES = new Set([
  'node_modules',
  '.next',
  '.git',
  'dist',
  'coverage',
  'playwright-report',
  'test-results',
  '.playwright-mcp',
])

const CODE_EXTS = new Set(['.ts', '.tsx', '.js', '.cjs', '.mjs'])
const EVENT_TYPE_REGEX = /event_type\s*:\s*'([^']+)'/g
const EVENT_NAME_LITERAL_REGEX = /'((?:game|ui|perf|system|analytics):[^']+)'/g

function extractGameEventNamesFromEventBus(source: string): string[] {
  // Parse keys from `export interface GameEventMap { ... 'x:y': {...} ... }`.
  const start = source.indexOf('export interface GameEventMap')
  if (start < 0) return []

  const block = source.slice(start)
  const lines = block.split('\n')

  const names: string[] = []
  let inInterface = false
  let braceDepth = 0

  for (const line of lines) {
    if (!inInterface) {
      if (line.includes('export interface GameEventMap')) {
        inInterface = true
        // Brace may be on same line or next.
        braceDepth += (line.match(/{/g) || []).length
        braceDepth -= (line.match(/}/g) || []).length
      }
      continue
    }

    braceDepth += (line.match(/{/g) || []).length
    braceDepth -= (line.match(/}/g) || []).length

    const m = line.match(/^\s*'([^']+)'\s*:/)
    if (m?.[1]) names.push(m[1])

    if (braceDepth <= 0) break
  }

  return [...new Set(names)].sort()
}

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    if (e.name.startsWith('.')) {
      // Still allow .github etc, but CODE_DIRS won't include it.
      // Keep generic skip logic in SKIP_DIR_NAMES.
    }
    if (SKIP_DIR_NAMES.has(e.name)) continue

    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      yield* walk(full)
    } else {
      if (!CODE_EXTS.has(path.extname(e.name))) continue
      yield full
    }
  }
}

async function readUtf8(p: string): Promise<string> {
  return await fs.readFile(p, 'utf8')
}

async function main() {
  const declared = new Set<string>(INTERACTION_EVENT_TYPES)
  const used = new Set<string>()

  const doc = await readUtf8(DOC_PATH)

  // Event Bus contract (names + docs coverage + literal usage).
  const eventBusSource = await readUtf8(EVENT_BUS_PATH)
  const eventBusDeclared = extractGameEventNamesFromEventBus(eventBusSource)
  const eventBusDeclaredSet = new Set(eventBusDeclared)
  const eventBusUsedLiterals = new Set<string>()

  for (const d of CODE_DIRS) {
    const abs = path.join(REPO_ROOT, d)
    let stat: Awaited<ReturnType<typeof fs.stat>> | null = null
    try {
      stat = await fs.stat(abs)
    } catch {
      continue
    }
    if (!stat.isDirectory()) continue

    for await (const filePath of walk(abs)) {
      const text = await readUtf8(filePath)
      for (const match of text.matchAll(EVENT_TYPE_REGEX)) {
        const v = match[1]
        if (v) used.add(v)
      }
      // Do not count spec/registry files as "usage".
      const resolved = path.resolve(filePath)
      if (resolved !== path.resolve(EVENT_BUS_PATH) && resolved !== path.resolve(EVENT_BUS_META_PATH)) {
        for (const match of text.matchAll(EVENT_NAME_LITERAL_REGEX)) {
          const v = match[1]
          if (v) eventBusUsedLiterals.add(v)
        }
      }
    }
  }

  const unknownUsed = [...used].filter(v => !declared.has(v)).sort()
  const unusedDeclared = [...declared].filter(v => !used.has(v)).sort()
  const missingInDocs = [...declared].filter(v => !doc.includes(v)).sort()

  const problems: string[] = []
  if (unknownUsed.length > 0) {
    problems.push(`Unknown interaction event types used in code: ${unknownUsed.join(', ')}`)
  }
  if (unusedDeclared.length > 0) {
    problems.push(`Interaction event types declared but not used in code: ${unusedDeclared.join(', ')}`)
  }
  if (missingInDocs.length > 0) {
    problems.push(`Interaction event types missing from docs/reference/data-dictionary/12-analytics.md: ${missingInDocs.join(', ')}`)
  }

  const eventBusMissingInDocs = eventBusDeclared.filter(v => !doc.includes(v))
  if (eventBusMissingInDocs.length > 0) {
    problems.push(`Event bus events missing from docs/reference/data-dictionary/12-analytics.md: ${eventBusMissingInDocs.join(', ')}`)
  }

  const eventBusUnknownLiterals = [...eventBusUsedLiterals].filter(v => !eventBusDeclaredSet.has(v)).sort()
  if (eventBusUnknownLiterals.length > 0) {
    problems.push(`Unknown event bus event(s) used as string literals in code: ${eventBusUnknownLiterals.join(', ')}`)
  }

  if (problems.length > 0) {
    console.error('[verify-analytics-dictionary] FAILED')
    for (const p of problems) console.error(`- ${p}`)
    process.exit(1)
  }

  console.log('[verify-analytics-dictionary] OK')
  console.log(`- Declared: ${INTERACTION_EVENT_TYPES.length}`)
  console.log(`- Used: ${used.size}`)
  console.log(`- EventBus declared: ${eventBusDeclared.length}`)
  console.log(`- EventBus literals used: ${eventBusUsedLiterals.size}`)
}

main().catch((err) => {
  console.error('[verify-analytics-dictionary] ERROR', err)
  process.exit(1)
})
