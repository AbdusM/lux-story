#!/usr/bin/env npx tsx

import fs from 'node:fs'
import path from 'node:path'
import { WORLD_CANON_CONTRACT, type WorldEraContract } from '../content/world-canon'

const REPO_ROOT = process.cwd()
const REPORT_PATH = path.join(REPO_ROOT, 'docs/qa/world-canon-contract-report.json')
const SNAPSHOT_PATH = path.join(REPO_ROOT, 'docs/qa/world-canon-source-snapshot.json')

type ValidatorMode = 'warn' | 'enforce'

type VerificationIssue = {
  type: string
  severity: 'error' | 'warning'
  message: string
}

type EraHeading = {
  eraNumber: number
  title: string
  startAS: number
  endAS: number | null
  line: string
}

function readFileSafe(filePath: string): string | null {
  try {
    return fs.readFileSync(path.join(REPO_ROOT, filePath), 'utf8')
  } catch {
    return null
  }
}

function readMode(): ValidatorMode {
  const raw = (process.env.WORLD_CANON_VALIDATOR_MODE ?? 'warn').trim().toLowerCase()
  return raw === 'enforce' ? 'enforce' : 'warn'
}

function normalizeLabel(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function parseEraHeadings(markdown: string): EraHeading[] {
  const regex = /^###\s+Era\s+(\d+):\s+(.+?)\s+\((\d+)\s*-\s*(\d+|Present)(?:\s*AS)?\)/gim
  const eras: EraHeading[] = []
  let match = regex.exec(markdown)
  while (match) {
    const [, eraNumberRaw, titleRaw, startRaw, endRaw] = match
    eras.push({
      eraNumber: Number(eraNumberRaw),
      title: titleRaw.trim(),
      startAS: Number(startRaw),
      endAS: endRaw.toLowerCase() === 'present' ? null : Number(endRaw),
      line: match[0],
    })
    match = regex.exec(markdown)
  }
  return eras
}

function compareEra(expected: WorldEraContract, actual: EraHeading): boolean {
  return (
    normalizeLabel(expected.title) === normalizeLabel(actual.title) &&
    expected.startAS === actual.startAS &&
    expected.endAS === actual.endAS
  )
}

function maybeEscalate(mode: ValidatorMode): 'error' | 'warning' {
  return mode === 'enforce' ? 'error' : 'warning'
}

function main(): void {
  const mode = readMode()
  const issues: VerificationIssue[] = []
  const checks: Array<{ id: string; passed: boolean; details: string }> = []

  const contractChecksPass =
    WORLD_CANON_CONTRACT.settingMode === 'grounded_magical_realism' &&
    WORLD_CANON_CONTRACT.magicPolicy === 'supernatural_present_never_explained' &&
    WORLD_CANON_CONTRACT.explicitMagicSystemAllowed === false &&
    WORLD_CANON_CONTRACT.eras.length > 0

  checks.push({
    id: 'contract-shape',
    passed: contractChecksPass,
    details: `settingMode=${WORLD_CANON_CONTRACT.settingMode}, magicPolicy=${WORLD_CANON_CONTRACT.magicPolicy}, explicitMagicSystemAllowed=${WORLD_CANON_CONTRACT.explicitMagicSystemAllowed}, eras=${WORLD_CANON_CONTRACT.eras.length}`,
  })
  if (!contractChecksPass) {
    issues.push({
      type: 'contract-shape',
      severity: 'error',
      message: 'World canon contract contains unexpected policy values.',
    })
  }

  const canonicalDocs = WORLD_CANON_CONTRACT.canonicalDocs
  const missingDocs = canonicalDocs.filter((docPath) => !readFileSafe(docPath))
  checks.push({
    id: 'canonical-docs-exist',
    passed: missingDocs.length === 0,
    details: missingDocs.length === 0 ? `count=${canonicalDocs.length}` : `missing=${missingDocs.join(', ')}`,
  })
  if (missingDocs.length > 0) {
    issues.push({
      type: 'canonical-docs-missing',
      severity: 'error',
      message: `Missing canonical docs: ${missingDocs.join(', ')}`,
    })
  }

  const timelineDocs = WORLD_CANON_CONTRACT.timelineDocs
  const missingTimelineDocs = timelineDocs.filter((docPath) => !readFileSafe(docPath))
  checks.push({
    id: 'timeline-docs-exist',
    passed: missingTimelineDocs.length === 0,
    details: missingTimelineDocs.length === 0 ? `count=${timelineDocs.length}` : `missing=${missingTimelineDocs.join(', ')}`,
  })
  if (missingTimelineDocs.length > 0) {
    issues.push({
      type: 'timeline-docs-missing',
      severity: 'error',
      message: `Missing timeline docs: ${missingTimelineDocs.join(', ')}`,
    })
  }

  const allScannedDocs = Array.from(new Set([...canonicalDocs, ...timelineDocs]))
  const forbiddenHits: Array<{ doc: string; phrase: string; excerpt: string }> = []
  const anchorHits: Array<{ anchorId: string; phrase: string; doc: string; excerpt: string }> = []
  const anchorMisses: Array<{ anchorId: string; phrase: string; doc: string }> = []
  const timelineParsed: Array<{ doc: string; eras: EraHeading[] }> = []

  for (const docPath of allScannedDocs) {
    const content = readFileSafe(docPath)
    if (!content) continue

    for (const phrase of WORLD_CANON_CONTRACT.forbiddenPhrases) {
      const regex = new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'i')
      const hit = regex.exec(content)
      if (hit && hit.index !== undefined) {
        const idx = hit.index
        forbiddenHits.push({
          doc: docPath,
          phrase,
          excerpt: content.slice(Math.max(0, idx - 40), Math.min(content.length, idx + 120)).replace(/\s+/g, ' ').trim(),
        })
      }
    }

    if (timelineDocs.includes(docPath)) {
      timelineParsed.push({
        doc: docPath,
        eras: parseEraHeadings(content),
      })
    }
  }

  for (const anchor of WORLD_CANON_CONTRACT.requiredAnchors) {
    const regex = new RegExp(escapeRegex(anchor.phrase), 'i')
    for (const docPath of anchor.docPaths) {
      const content = readFileSafe(docPath)
      if (!content) {
        anchorMisses.push({ anchorId: anchor.id, phrase: anchor.phrase, doc: docPath })
        continue
      }
      const match = regex.exec(content)
      if (!match || match.index === undefined) {
        anchorMisses.push({ anchorId: anchor.id, phrase: anchor.phrase, doc: docPath })
        continue
      }
      const idx = match.index
      anchorHits.push({
        anchorId: anchor.id,
        phrase: anchor.phrase,
        doc: docPath,
        excerpt: content.slice(Math.max(0, idx - 40), Math.min(content.length, idx + 120)).replace(/\s+/g, ' ').trim(),
      })
    }
  }

  checks.push({
    id: 'magic-policy-forbidden-phrases',
    passed: forbiddenHits.length === 0,
    details: forbiddenHits.length === 0 ? 'no forbidden phrase hits in canonical/timeline docs' : `hits=${forbiddenHits.length}`,
  })
  if (forbiddenHits.length > 0) {
    issues.push({
      type: 'forbidden-phrases',
      severity: maybeEscalate(mode),
      message: `Forbidden world phrase detected in docs (${forbiddenHits.length} hit(s)).`,
    })
  }

  checks.push({
    id: 'required-anchors',
    passed: anchorMisses.length === 0,
    details: anchorMisses.length === 0 ? `hits=${anchorHits.length}` : `missing=${anchorMisses.length}`,
  })
  if (anchorMisses.length > 0) {
    issues.push({
      type: 'required-anchors-missing',
      severity: maybeEscalate(mode),
      message: `Required anchor phrase missing (${anchorMisses.length} miss(es)).`,
    })
  }

  const timelineMismatches: string[] = []
  for (const timelineDoc of timelineParsed) {
    if (timelineDoc.eras.length !== WORLD_CANON_CONTRACT.eras.length) {
      timelineMismatches.push(
        `${timelineDoc.doc}: expected ${WORLD_CANON_CONTRACT.eras.length} eras, found ${timelineDoc.eras.length}`,
      )
      continue
    }

    for (let i = 0; i < WORLD_CANON_CONTRACT.eras.length; i += 1) {
      const expected = WORLD_CANON_CONTRACT.eras[i]
      const actual = timelineDoc.eras[i]
      if (!compareEra(expected, actual)) {
        timelineMismatches.push(
          `${timelineDoc.doc}: era ${i + 1} mismatch expected=${expected.title}(${expected.startAS}-${expected.endAS ?? 'Present'}) actual=${actual.title}(${actual.startAS}-${actual.endAS ?? 'Present'})`,
        )
      }
      if (actual.eraNumber !== i + 1) {
        timelineMismatches.push(
          `${timelineDoc.doc}: expected era number ${i + 1}, found ${actual.eraNumber}`,
        )
      }
    }

    for (let i = 0; i < timelineDoc.eras.length - 1; i += 1) {
      const current = timelineDoc.eras[i]
      const next = timelineDoc.eras[i + 1]
      if (current.endAS === null || current.endAS !== next.startAS) {
        timelineMismatches.push(
          `${timelineDoc.doc}: non-contiguous era boundary between "${current.title}" and "${next.title}"`,
        )
      }
    }
  }

  checks.push({
    id: 'timeline-era-contract',
    passed: timelineMismatches.length === 0,
    details: timelineMismatches.length === 0 ? `validated_docs=${timelineParsed.length}` : `mismatches=${timelineMismatches.length}`,
  })
  if (timelineMismatches.length > 0) {
    issues.push({
      type: 'timeline-era-contract',
      severity: maybeEscalate(mode),
      message: `Timeline era mismatch detected (${timelineMismatches.length} mismatch(es)).`,
    })
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
    issues.push({
      type: 'runtime-binding',
      severity: 'error',
      message: 'Runtime binding to world canon contract was not found in lib/lore-system.ts.',
    })
  }

  const snapshot = {
    generated_at: new Date().toISOString(),
    mode,
    contract_version: WORLD_CANON_CONTRACT.version,
    docs: {
      canonical: canonicalDocs,
      timeline: timelineDocs,
    },
    parsed_timeline_docs: timelineParsed,
    required_anchor_hits: anchorHits,
    required_anchor_misses: anchorMisses,
    forbidden_phrase_hits: forbiddenHits,
    timeline_mismatches: timelineMismatches,
  }

  const hasErrors = issues.some((issue) => issue.severity === 'error')
  const valid = !hasErrors
  const report = {
    generated_at: new Date().toISOString(),
    mode,
    valid,
    contract: WORLD_CANON_CONTRACT,
    checks,
    required_anchor_hits: anchorHits,
    required_anchor_misses: anchorMisses,
    forbidden_phrase_hits: forbiddenHits,
    timeline_mismatches: timelineMismatches,
    issues,
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true })
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  fs.mkdirSync(path.dirname(SNAPSHOT_PATH), { recursive: true })
  fs.writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8')

  if (!valid) {
    console.error('[verify-world-canon-contract] FAILED')
    for (const issue of issues) {
      if (issue.severity === 'error') {
        console.error(`- [${issue.type}] ${issue.message}`)
      } else {
        console.warn(`- [${issue.type}] ${issue.message}`)
      }
    }
    console.error(`- Report: ${path.relative(REPO_ROOT, REPORT_PATH)}`)
    console.error(`- Snapshot: ${path.relative(REPO_ROOT, SNAPSHOT_PATH)}`)
    process.exit(1)
  }

  console.log('[verify-world-canon-contract] OK')
  console.log(`- Mode: ${mode}`)
  console.log(`- Canonical docs: ${canonicalDocs.length}`)
  console.log(`- Required anchor hits: ${anchorHits.length}`)
  console.log(`- Timeline docs validated: ${timelineParsed.length}`)
  console.log(`- Report: ${path.relative(REPO_ROOT, REPORT_PATH)}`)
  console.log(`- Snapshot: ${path.relative(REPO_ROOT, SNAPSHOT_PATH)}`)
  for (const issue of issues) {
    if (issue.severity === 'warning') {
      console.warn(`- [${issue.type}] ${issue.message}`)
    }
  }
}

main()
