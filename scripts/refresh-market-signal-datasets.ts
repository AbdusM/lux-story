import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import {
  buildMarketSignalDatasetArtifacts,
  loadMarketSignalAuthoringBundle,
} from '@/lib/labor-market/market-signal-authoring'

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
  const bundle = loadMarketSignalAuthoringBundle()
  const artifacts = buildMarketSignalDatasetArtifacts(bundle)
  const observedExposureJson = formatJson(artifacts.observedExposure)
  const entryFrictionJson = formatJson(artifacts.entryFriction)

  if (shouldCheckOnly()) {
    await ensureMatchesExpected(OBSERVED_EXPOSURE_PATH, observedExposureJson)
    await ensureMatchesExpected(ENTRY_FRICTION_PATH, entryFrictionJson)
    // eslint-disable-next-line no-console
    console.log('Market signal datasets are up to date.')
    return
  }

  await writeFile(OBSERVED_EXPOSURE_PATH, observedExposureJson, 'utf8')
  await writeFile(ENTRY_FRICTION_PATH, entryFrictionJson, 'utf8')
  // eslint-disable-next-line no-console
  console.log('Refreshed observed exposure and entry friction datasets from authoring source.')
}

void main()
