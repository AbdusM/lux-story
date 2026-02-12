import fs from 'node:fs'
import path from 'node:path'

import { INTERACTION_EVENT_TYPES } from '@/lib/telemetry/interaction-events-spec'

type EmitterHit = {
  file: string
  line: number
}

type Report = {
  generated_at: string
  declared_types: string[]
  emitted_types: string[]
  planned_types: string[]
  missing_types: string[]
  unknown_emitted_types: string[]
  emitters: Record<string, EmitterHit[]>
}

const REPO_ROOT = process.cwd()
const REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/interaction-event-emitter-parity-report.json')

// Explicitly mark intentionally not-yet-emitted event types here.
const PLANNED_INTERACTION_EVENT_TYPES: readonly string[] = []

function fail(message: string): never {
  // eslint-disable-next-line no-console
  console.error(`\n[verify-interaction-event-emitters] ${message}\n`)
  process.exit(1)
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'tests' || entry.name === '__tests__') continue
      out.push(...walk(full, []))
      continue
    }
    if (!entry.isFile()) continue
    if (full.endsWith('.ts') || full.endsWith('.tsx')) out.push(full)
  }
  return out
}

function lineAt(src: string, index: number): number {
  return src.slice(0, index).split('\n').length
}

function writeReport(report: Report): void {
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true })
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2))
}

function main(): void {
  const scanRoots = [
    path.join(REPO_ROOT, 'components'),
    path.join(REPO_ROOT, 'hooks'),
    path.join(REPO_ROOT, 'lib'),
  ].filter((p) => fs.existsSync(p))

  const files = scanRoots.flatMap((root) => walk(root))
  const emitters: Record<string, EmitterHit[]> = {}
  const emitted = new Set<string>()

  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8')
    if (!src.includes('queueInteractionEventSync')) continue

    const eventTypeRegex = /event_type\s*:\s*(['"])([^'"]+)\1/g
    let match: RegExpExecArray | null
    while ((match = eventTypeRegex.exec(src))) {
      const eventType = match[2]
      emitted.add(eventType)
      if (!emitters[eventType]) emitters[eventType] = []
      emitters[eventType].push({
        file: path.relative(REPO_ROOT, file),
        line: lineAt(src, match.index),
      })
    }
  }

  const declared = [...INTERACTION_EVENT_TYPES]
  const planned = [...PLANNED_INTERACTION_EVENT_TYPES]

  const invalidPlanned = planned.filter((t) => !declared.includes(t as any))
  if (invalidPlanned.length > 0) {
    fail(`PLANNED_INTERACTION_EVENT_TYPES contains unknown types: ${invalidPlanned.join(', ')}`)
  }

  const unknownEmitted = [...emitted].filter((t) => !declared.includes(t as any)).sort()
  const missingTypes = declared
    .filter((t) => !emitted.has(t))
    .filter((t) => !planned.includes(t))
    .sort()

  const report: Report = {
    generated_at: new Date().toISOString(),
    declared_types: declared,
    emitted_types: [...emitted].sort(),
    planned_types: planned.sort(),
    missing_types: missingTypes,
    unknown_emitted_types: unknownEmitted,
    emitters,
  }

  writeReport(report)

  if (unknownEmitted.length > 0) {
    fail(`Unknown emitted interaction event types (not in spec): ${unknownEmitted.join(', ')}`)
  }

  if (missingTypes.length > 0) {
    fail(
      `Missing runtime emitters for declared interaction event types: ${missingTypes.join(
        ', ',
      )}. Report: ${path.relative(REPO_ROOT, REPORT_PATH)}`,
    )
  }

  // eslint-disable-next-line no-console
  console.log(
    `[verify-interaction-event-emitters] ok: ${declared.length} declared, ${report.emitted_types.length} emitted. Report: ${path.relative(
      REPO_ROOT,
      REPORT_PATH,
    )}`,
  )
}

main()

