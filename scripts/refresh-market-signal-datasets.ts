import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import {
  buildMarketSignalDatasetArtifacts,
} from '@/lib/labor-market/market-signal-authoring'
import {
  buildMarketSignalAuthoringBundleFromSnapshot,
  loadMarketSignalSourceSnapshot,
} from '@/lib/labor-market/market-signal-import'

const AUTHORING_BUNDLE_PATH = path.join(
  process.cwd(),
  'lib/labor-market/data/market-signal-authoring-v1.json',
)
const OBSERVED_EXPOSURE_PATH = path.join(
  process.cwd(),
  'lib/labor-market/data/observed-exposure-v1.json',
)
const ENTRY_FRICTION_PATH = path.join(
  process.cwd(),
  'lib/labor-market/data/entry-friction-v1.json',
)

function fail(message: string): never {
  // eslint-disable-next-line no-console
  console.error(`[refresh-market-signal-datasets] ${message}`)
  process.exit(1)
}

function formatJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`
}

function shouldCheckOnly(): boolean {
  return process.argv.includes('--check')
}

async function ensureMatchesExpected(filePath: string, expected: string): Promise<void> {
  const current = await readFile(filePath, 'utf8')
  if (current !== expected) {
    fail(`Generated output is stale for ${path.relative(process.cwd(), filePath)}. Run npm run refresh:market-signals.`)
  }
}

async function main(): Promise<void> {
  const snapshot = loadMarketSignalSourceSnapshot()
  const bundle = buildMarketSignalAuthoringBundleFromSnapshot(snapshot)
  const artifacts = buildMarketSignalDatasetArtifacts(bundle)
  const authoringJson = formatJson(bundle)
  const observedExposureJson = formatJson(artifacts.observedExposure)
  const entryFrictionJson = formatJson(artifacts.entryFriction)

  if (shouldCheckOnly()) {
    await ensureMatchesExpected(AUTHORING_BUNDLE_PATH, authoringJson)
    await ensureMatchesExpected(OBSERVED_EXPOSURE_PATH, observedExposureJson)
    await ensureMatchesExpected(ENTRY_FRICTION_PATH, entryFrictionJson)
    // eslint-disable-next-line no-console
    console.log('Market signal snapshot, authoring bundle, and datasets are up to date.')
    return
  }

  await writeFile(AUTHORING_BUNDLE_PATH, authoringJson, 'utf8')
  await writeFile(OBSERVED_EXPOSURE_PATH, observedExposureJson, 'utf8')
  await writeFile(ENTRY_FRICTION_PATH, entryFrictionJson, 'utf8')
  // eslint-disable-next-line no-console
  console.log('Refreshed labor-signal authoring bundle and shipped datasets from source snapshot.')
}

void main()
