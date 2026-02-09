/**
 * Reserved Choice IDs Verifier
 *
 * AAA intent:
 * - Prevent content authors from accidentally using engine-reserved choice IDs.
 * - Keep recovery/virtual routing mechanisms single-sourced in code.
 */

import fs from 'node:fs/promises'
import path from 'node:path'

const REPO_ROOT = process.cwd()
const CONTENT_DIR = path.join(REPO_ROOT, 'content')

const RESERVED_CHOICE_IDS = [
  '__deadlock_recovery__',
] as const

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      yield* walk(full)
      continue
    }
    if (!e.isFile()) continue
    const ext = path.extname(e.name)
    if (!['.ts', '.tsx', '.js', '.mjs', '.cjs'].includes(ext)) continue
    yield full
  }
}

function formatRel(p: string): string {
  return path.relative(REPO_ROOT, p)
}

async function main() {
  const problems: Array<{ file: string; reservedId: string; lines: string[] }> = []

  for await (const filePath of walk(CONTENT_DIR)) {
    const text = await fs.readFile(filePath, 'utf8')
    const hits: string[] = []

    for (const reservedId of RESERVED_CHOICE_IDS) {
      // Keep this strict: this is a content contract, not a generic grep.
      // We only care about object literals with `choiceId: '...'`.
      const re = new RegExp(String.raw`\\bchoiceId\\s*:\\s*['"]${reservedId}['"]`, 'g')
      if (re.test(text)) {
        const matchingLines = text
          .split('\n')
          .filter((l) => l.includes(reservedId) && l.includes('choiceId'))
          .slice(0, 8)
          .map((l) => l.trim())
        hits.push(...matchingLines)
      }
    }

    if (hits.length > 0) {
      for (const reservedId of RESERVED_CHOICE_IDS) {
        if (hits.some((l) => l.includes(reservedId))) {
          problems.push({ file: formatRel(filePath), reservedId, lines: hits })
        }
      }
    }
  }

  if (problems.length > 0) {
    console.error('[verify-reserved-choice-ids] FAILED')
    for (const p of problems) {
      console.error(`- ${p.file}: reserved choiceId "${p.reservedId}"`)
      for (const l of p.lines) console.error(`  ${l}`)
    }
    process.exit(1)
  }

  console.log('[verify-reserved-choice-ids] OK')
  console.log(`- Reserved IDs checked: ${RESERVED_CHOICE_IDS.length}`)
}

main().catch((err) => {
  console.error('[verify-reserved-choice-ids] ERROR', err)
  process.exit(1)
})

