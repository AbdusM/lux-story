#!/usr/bin/env npx tsx
/**
 * Validate simulations data dictionary vs canonical ID map.
 * Ensures each SIMULATION_ID_MAP contentId is present exactly once.
 *
 * Usage:
 *   npx tsx scripts/validate-simulations-doc.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { SIMULATION_REGISTRY as CONTENT_REGISTRY } from '../content/simulation-registry'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const docPath = path.join(__dirname, '../docs/reference/data-dictionary/06-simulations.md')

function main() {
  const content = fs.readFileSync(docPath, 'utf-8')
  const idRegex = /^- \*\*ID:\*\* `([^`]+)`/gm
  const idsInDoc: string[] = []

  let match: RegExpExecArray | null
  while ((match = idRegex.exec(content)) !== null) {
    idsInDoc.push(match[1])
  }

  const expectedIds = CONTENT_REGISTRY.map(sim => sim.id)
  const missing = expectedIds.filter(id => !idsInDoc.includes(id))

  const duplicates = idsInDoc.filter((id, index) => idsInDoc.indexOf(id) !== index)
  const unexpected = idsInDoc.filter(id => !expectedIds.includes(id))

  const errors: string[] = []

  if (missing.length > 0) {
    errors.push(`Missing IDs in data dictionary: ${missing.join(', ')}`)
  }

  if (duplicates.length > 0) {
    errors.push(`Duplicate IDs in data dictionary: ${[...new Set(duplicates)].join(', ')}`)
  }

  if (unexpected.length > 0) {
    errors.push(`Unexpected IDs in data dictionary: ${[...new Set(unexpected)].join(', ')}`)
  }

  if (errors.length > 0) {
    console.error('\nSimulation data dictionary validation failed:\n')
    for (const error of errors) {
      console.error(`- ${error}`)
    }
    process.exit(1)
  }

  console.log('\nSimulation data dictionary validation passed.\n')
  console.log(`IDs found: ${idsInDoc.length}`)
  console.log(`Expected: ${expectedIds.length}`)
}

main()
