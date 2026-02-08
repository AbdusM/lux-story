import fs from 'node:fs/promises'
import path from 'node:path'

const REPO_ROOT = process.cwd()

const CODE_DIRS = ['app', 'components', 'hooks']
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

const FORBIDDEN_IMPORT_PATTERNS: Array<{ id: string; re: RegExp }> = [
  { id: 'admin-analytics', re: /from\s+['"]@\/lib\/admin-analytics['"]/ },
  { id: 'admin-analytics', re: /require\(\s*['"]@\/lib\/admin-analytics['"]\s*\)/ },
  { id: 'dev-admin-analytics', re: /from\s+['"]@\/lib\/dev-admin-analytics['"]/ },
  { id: 'dev-admin-analytics', re: /require\(\s*['"]@\/lib\/dev-admin-analytics['"]\s*\)/ },
]

function shouldSkipFile(p: string): boolean {
  const rel = path.relative(REPO_ROOT, p).replaceAll(path.sep, '/')

  // Allow admin-only surfaces to import admin analytics.
  if (rel.startsWith('app/admin/')) return true
  if (rel.startsWith('components/admin/')) return true

  return false
}

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
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

async function main() {
  const hits: Array<{ file: string; patternId: string }> = []

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
      if (shouldSkipFile(filePath)) continue
      const text = await fs.readFile(filePath, 'utf8')

      for (const ptn of FORBIDDEN_IMPORT_PATTERNS) {
        if (ptn.re.test(text)) {
          hits.push({ file: path.relative(REPO_ROOT, filePath), patternId: ptn.id })
          break
        }
      }
    }
  }

  if (hits.length > 0) {
    console.error('[verify-no-inmemory-analytics] FAILED')
    for (const h of hits) console.error(`- Forbidden import (${h.patternId}): ${h.file}`)
    process.exit(1)
  }

  console.log('[verify-no-inmemory-analytics] OK')
}

main().catch((err) => {
  console.error('[verify-no-inmemory-analytics] ERROR', err)
  process.exit(1)
})
