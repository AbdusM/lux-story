#!/usr/bin/env npx tsx

import fs from 'node:fs'
import path from 'node:path'
import { WORLD_CANON_CONTRACT } from '../content/world-canon-contract'

const REPO_ROOT = process.cwd()
const REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/world-canon-contract-report.json')

function readFileSafe(filePath: string): string | null {
  try {
    return fs.readFileSync(path.join(REPO_ROOT, filePath), 'utf8')
  } catch {
    return null
  }
}

function main(): void {
  const issues: string[] = []
  const checks: Array<{ id: string; passed: boolean; details: string }> = []

  const contractChecksPass =
    WORLD_CANON_CONTRACT.settingMode === 'grounded_magical_realism' &&
    WORLD_CANON_CONTRACT.magicPolicy === 'supernatural_present_never_explained' &&
    WORLD_CANON_CONTRACT.explicitMagicSystemAllowed === false

  checks.push({
    id: 'contract-shape',
    passed: contractChecksPass,
    details: `settingMode=${WORLD_CANON_CONTRACT.settingMode}, magicPolicy=${WORLD_CANON_CONTRACT.magicPolicy}, explicitMagicSystemAllowed=${WORLD_CANON_CONTRACT.explicitMagicSystemAllowed}`,
  })
  if (!contractChecksPass) {
    issues.push('World canon contract contains unexpected policy values.')
  }

  const canonicalDocs = WORLD_CANON_CONTRACT.canonicalDocs
  const missingDocs = canonicalDocs.filter((docPath) => !readFileSafe(docPath))
  checks.push({
    id: 'canonical-docs-exist',
    passed: missingDocs.length === 0,
    details: missingDocs.length === 0 ? `count=${canonicalDocs.length}` : `missing=${missingDocs.join(', ')}`,
  })
  if (missingDocs.length > 0) {
    issues.push(`Missing canonical docs: ${missingDocs.join(', ')}`)
  }

  const forbiddenRegex = /\bno magic\b/i
  const forbiddenHits: Array<{ doc: string; excerpt: string }> = []
  const magicalRealismHits: Array<{ doc: string; excerpt: string }> = []

  for (const docPath of canonicalDocs) {
    const content = readFileSafe(docPath)
    if (!content) continue

    const lower = content.toLowerCase()
    const magicalIdx = lower.indexOf('magical realism')
    if (magicalIdx >= 0) {
      magicalRealismHits.push({
        doc: docPath,
        excerpt: content.slice(Math.max(0, magicalIdx - 40), Math.min(content.length, magicalIdx + 120)).replace(/\s+/g, ' ').trim(),
      })
    }

    const forbiddenMatch = content.match(forbiddenRegex)
    if (forbiddenMatch && forbiddenMatch.index !== undefined) {
      const idx = forbiddenMatch.index
      forbiddenHits.push({
        doc: docPath,
        excerpt: content.slice(Math.max(0, idx - 40), Math.min(content.length, idx + 120)).replace(/\s+/g, ' ').trim(),
      })
    }
  }

  checks.push({
    id: 'magic-policy-forbidden-phrases',
    passed: forbiddenHits.length === 0,
    details: forbiddenHits.length === 0 ? 'no forbidden "no magic" phrase in canonical docs' : `hits=${forbiddenHits.length}`,
  })
  if (forbiddenHits.length > 0) {
    issues.push('Canonical docs contain forbidden phrase "no magic".')
  }

  checks.push({
    id: 'magic-policy-anchor-phrase',
    passed: magicalRealismHits.length > 0,
    details: magicalRealismHits.length > 0 ? `hits=${magicalRealismHits.length}` : 'missing "magical realism" anchor phrase in canonical docs',
  })
  if (magicalRealismHits.length === 0) {
    issues.push('Canonical docs are missing a "magical realism" anchor phrase.')
  }

  const loreSystemPath = path.join(REPO_ROOT, 'lib/lore-system.ts')
  const loreSystem = readFileSafe('lib/lore-system.ts') ?? ''
  const runtimeBinding = loreSystem.includes('WORLD_CANON_CONTRACT') && loreSystem.includes('export const WORLD_CANON')
  checks.push({
    id: 'runtime-binding',
    passed: runtimeBinding,
    details: runtimeBinding ? 'WORLD_CANON exported from lib/lore-system.ts' : `missing runtime binding in ${path.relative(REPO_ROOT, loreSystemPath)}`,
  })
  if (!runtimeBinding) {
    issues.push('Runtime binding to world canon contract was not found in lib/lore-system.ts.')
  }

  const valid = issues.length === 0
  const report = {
    generated_at: new Date().toISOString(),
    valid,
    contract: WORLD_CANON_CONTRACT,
    checks,
    magical_realism_hits: magicalRealismHits,
    forbidden_phrase_hits: forbiddenHits,
    issues,
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true })
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  if (!valid) {
    console.error('[verify-world-canon-contract] FAILED')
    for (const issue of issues) {
      console.error(`- ${issue}`)
    }
    console.error(`- Report: ${path.relative(REPO_ROOT, REPORT_PATH)}`)
    process.exit(1)
  }

  console.log('[verify-world-canon-contract] OK')
  console.log(`- Canonical docs: ${canonicalDocs.length}`)
  console.log(`- Magical realism anchors: ${magicalRealismHits.length}`)
  console.log(`- Report: ${path.relative(REPO_ROOT, REPORT_PATH)}`)
}

main()
