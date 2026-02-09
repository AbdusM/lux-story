import fs from 'node:fs'
import path from 'node:path'

import { INTERACTION_EVENT_TYPES } from '@/lib/telemetry/interaction-events-spec'

function fail(message: string): never {
  // eslint-disable-next-line no-console
  console.error(`\n[verify-analytics-dictionary] ${message}\n`)
  process.exit(1)
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      // Keep this fast: only scan app/runtime code.
      if (entry.name === 'node_modules') continue
      out.push(...walk(full, []))
    } else if (entry.isFile()) {
      if (full.endsWith('.ts') || full.endsWith('.tsx')) out.push(full)
    }
  }
  return out
}

function main() {
  const repoRoot = process.cwd()
  const dictPath = path.join(repoRoot, 'docs/reference/data-dictionary/12-analytics.md')
  if (!fs.existsSync(dictPath)) fail(`Missing analytics dictionary: ${dictPath}`)

  const md = fs.readFileSync(dictPath, 'utf8')

  // 1) Every spec event type must be documented.
  const missingInDoc = INTERACTION_EVENT_TYPES.filter((t) => !md.includes('`' + t + '`'))
  if (missingInDoc.length) {
    fail(`Missing INTERACTION_EVENT_TYPES in docs/reference/data-dictionary/12-analytics.md: ${missingInDoc.join(', ')}`)
  }

  // 2) Every event_type referenced in code must exist in the spec registry.
  const allowed = new Set<string>(INTERACTION_EVENT_TYPES as readonly string[])
  const referenced = new Set<string>()

  const scanRoots = [
    path.join(repoRoot, 'app'),
    path.join(repoRoot, 'components'),
    path.join(repoRoot, 'hooks'),
    path.join(repoRoot, 'lib'),
    path.join(repoRoot, 'tests'),
  ].filter((p) => fs.existsSync(p))

  const files = scanRoots.flatMap((d) => walk(d))
  const re = /event_type\s*:\s*(['"])([^'"]+)\1/g

  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8')
    let m: RegExpExecArray | null
    while ((m = re.exec(src))) {
      referenced.add(m[2])
    }
  }

  const unknown = [...referenced].filter((t) => !allowed.has(t))
  if (unknown.length) {
    fail(
      `Found unknown interaction event_type strings in code (not in lib/telemetry/interaction-events-spec.ts): ${unknown
        .sort()
        .join(', ')}`,
    )
  }

  // eslint-disable-next-line no-console
  console.log(`[verify-analytics-dictionary] ok: ${INTERACTION_EVENT_TYPES.length} types documented + referenced types validated`)
}

main()

