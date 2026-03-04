#!/usr/bin/env npx tsx

import fs from 'node:fs'
import path from 'node:path'

type ListenerHit = {
  file: string
  line: number
  source: string
}

const REPO_ROOT = process.cwd()
const SEARCH_ROOTS = ['app', 'components', 'hooks', 'lib']
const REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/keydown-listener-ownership-report.json')

// Canonical ownership policy:
// - Global shortcuts belong to hooks/useKeyboardShortcuts.ts
// - Component-local listeners are explicitly allowlisted and must remain scoped.
const ALLOWED_KEYDOWN_LISTENERS: Record<string, string> = {
  'hooks/useKeyboardShortcuts.ts': 'Canonical global keyboard dispatcher',
  'components/GameChoices.tsx': 'Gameplay-local navigation and choice focus controls',
  'components/Journal.tsx': 'Panel-local keyboard navigation',
  'components/KeyboardShortcutsHelp.tsx': 'Shortcut recorder/help modal capture phase',
  'components/JourneySummary.tsx': 'Summary modal keyboard affordances',
  'components/UnifiedMenu.tsx': 'Legacy settings menu escape handler (remove after overlay manager migration)',
  'components/InGameSettings.tsx': 'Legacy settings surface (allowlisted until removal)',
  'components/ui/BottomSheet.tsx': 'Sheet-local escape handling',
  'components/constellation/ConstellationPanel.tsx': 'Panel-local keyboard navigation',
  'components/constellation/ConstellationGraph.tsx': 'Graph-local keyboard navigation',
  'components/constellation/DetailModal.tsx': 'Detail modal escape handling',
  'components/game/InterruptButton.tsx': 'Interrupt interaction keyboard support',
}

const KEYDOWN_PATTERN = /(window|document)\.addEventListener\(\s*['"]keydown['"]/

function fail(message: string): never {
  // eslint-disable-next-line no-console
  console.error(`\n[verify-keydown-listener-ownership] ${message}\n`)
  process.exit(1)
}

function walk(dirPath: string, files: string[] = []): string[] {
  if (!fs.existsSync(dirPath)) return files
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name.startsWith('.')) continue
    const absolute = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      walk(absolute, files)
      continue
    }
    if (entry.isFile() && (absolute.endsWith('.ts') || absolute.endsWith('.tsx'))) {
      files.push(absolute)
    }
  }
  return files
}

function findKeydownListeners(): ListenerHit[] {
  const hits: ListenerHit[] = []
  const files = SEARCH_ROOTS.flatMap((root) => walk(path.join(REPO_ROOT, root)))

  for (const file of files) {
    const relative = path.relative(REPO_ROOT, file)
    const content = fs.readFileSync(file, 'utf8')
    const lines = content.split('\n')
    lines.forEach((line, idx) => {
      if (!KEYDOWN_PATTERN.test(line)) return
      hits.push({
        file: relative,
        line: idx + 1,
        source: line.trim(),
      })
    })
  }

  return hits
}

function writeReport(payload: unknown): void {
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true })
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
}

function main(): void {
  const hits = findKeydownListeners()
  const unknown = hits.filter((hit) => !Object.hasOwn(ALLOWED_KEYDOWN_LISTENERS, hit.file))
  const observedFiles = [...new Set(hits.map((hit) => hit.file))]
  const staleAllowlist = Object.keys(ALLOWED_KEYDOWN_LISTENERS).filter((file) => !observedFiles.includes(file))

  writeReport({
    generated_at: new Date().toISOString(),
    policy: {
      canonical_owner: 'hooks/useKeyboardShortcuts.ts',
      allowlisted_component_files: ALLOWED_KEYDOWN_LISTENERS,
    },
    listeners_found: hits,
    unknown_listeners: unknown,
    stale_allowlist_entries: staleAllowlist,
  })

  if (unknown.length > 0) {
    fail(
      `Found keydown listeners outside allowlist:\n${unknown
        .map((hit) => `- ${hit.file}:${hit.line}`)
        .join('\n')}\nReport: ${path.relative(REPO_ROOT, REPORT_PATH)}`,
    )
  }

  // eslint-disable-next-line no-console
  console.log(
    `[verify-keydown-listener-ownership] OK: ${hits.length} listener registrations across ${observedFiles.length} files. ` +
    `Report: ${path.relative(REPO_ROOT, REPORT_PATH)}`,
  )
}

main()
