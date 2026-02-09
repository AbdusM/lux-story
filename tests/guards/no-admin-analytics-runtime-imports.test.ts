import fs from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const REPO_ROOT = process.cwd()
const CODE_DIRS = ['components', 'hooks', 'app', 'lib']

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    if (e.name.startsWith('.')) continue
    if (e.name === 'node_modules' || e.name === '.next' || e.name === 'dist') continue
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      yield* walk(full)
    } else if (/\.(ts|tsx|js|mjs|cjs)$/.test(e.name)) {
      yield full
    }
  }
}

describe('Guards: No In-Memory Admin Analytics In Runtime', () => {
  it('does not import lib/admin-analytics from runtime code', async () => {
    const hits: string[] = []
    for (const d of CODE_DIRS) {
      const abs = path.join(REPO_ROOT, d)
      try {
        const stat = await fs.stat(abs)
        if (!stat.isDirectory()) continue
      } catch {
        continue
      }
      for await (const filePath of walk(abs)) {
        const rel = path.relative(REPO_ROOT, filePath)
        // Allow docs and tests to reference this module; this guard is runtime code only.
        if (rel.startsWith('docs/') || rel.startsWith('tests/')) continue
        const text = await fs.readFile(filePath, 'utf8')
        if (text.includes("from '@/lib/admin-analytics'")) hits.push(rel)
      }
    }

    expect(hits).toEqual([])
  })
})

