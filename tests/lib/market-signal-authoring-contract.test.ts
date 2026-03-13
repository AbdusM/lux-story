import entryFrictionDataset from '@/lib/labor-market/data/entry-friction-v1.json' with { type: 'json' }
import observedExposureDataset from '@/lib/labor-market/data/observed-exposure-v1.json' with { type: 'json' }
import {
  buildMarketSignalDatasetArtifacts,
  loadMarketSignalAuthoringBundle,
} from '@/lib/labor-market/market-signal-authoring'
import { describe, expect, it } from 'vitest'

describe('market signal authoring bundle', () => {
  it('materializes the checked-in observed exposure dataset exactly', () => {
    const artifacts = buildMarketSignalDatasetArtifacts(loadMarketSignalAuthoringBundle())

    expect(artifacts.observedExposure).toEqual(observedExposureDataset)
  })

  it('materializes the checked-in entry friction dataset exactly', () => {
    const artifacts = buildMarketSignalDatasetArtifacts(loadMarketSignalAuthoringBundle())

    expect(artifacts.entryFriction).toEqual(entryFrictionDataset)
  })
})
