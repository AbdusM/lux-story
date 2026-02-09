import fs from 'node:fs'
import path from 'node:path'

function fail(message: string): never {
  // eslint-disable-next-line no-console
  console.error(`\n[verify-no-inmemory-analytics] ${message}\n`)
  process.exit(1)
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue
      out.push(...walk(full, []))
    } else if (entry.isFile()) {
      if (full.endsWith('.ts') || full.endsWith('.tsx')) out.push(full)
    }
  }
  return out
}

function isAllowedImporter(filePath: string): boolean {
  // Allow admin-only code paths to use admin aggregation utilities.
  const p = filePath.replace(/\\/g, '/')
  if (p.includes('/components/admin/')) return true
  if (p.includes('/app/admin/')) return true
  if (p.includes('/app/(admin)/')) return true
  return false
}

function main() {
  const repoRoot = process.cwd()
  const targets = [
    path.join(repoRoot, 'app'),
    path.join(repoRoot, 'components'),
    path.join(repoRoot, 'hooks'),
    path.join(repoRoot, 'lib'),
  ].filter((p) => fs.existsSync(p))

  const files = targets.flatMap((d) => walk(d))

  const offenders: Array<{ file: string; import: string }> = []
  const re = /(from\s+['"]([^'"]*admin-analytics[^'"]*)['"])|(\brequire\(\s*['"]([^'"]*admin-analytics[^'"]*)['"]\s*\))/g

  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8')
    let m: RegExpExecArray | null
    while ((m = re.exec(src))) {
      const imp = m[2] || m[4] || 'admin-analytics'
      if (!isAllowedImporter(file)) offenders.push({ file, import: imp })
    }
  }

  if (offenders.length) {
    const lines = offenders
      .slice(0, 50)
      .map((o) => `- ${o.file.replace(repoRoot + path.sep, '')} imports ${o.import}`)
      .join('\n')
    fail(`Gameplay/runtime code must not import in-memory analytics modules.\n${lines}`)
  }

  // eslint-disable-next-line no-console
  console.log('[verify-no-inmemory-analytics] ok')
}

main()

