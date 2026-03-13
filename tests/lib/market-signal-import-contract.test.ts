import marketSignalAuthoringBundle from '@/lib/labor-market/data/market-signal-authoring-v1.json' with { type: 'json' }
import {
  buildMarketSignalAuthoringBundleFromSnapshot,
  loadMarketSignalSourceSnapshot,
} from '@/lib/labor-market/market-signal-import'
import { describe, expect, it } from 'vitest'

describe('market signal source snapshot', () => {
  it('materializes the checked-in authoring bundle exactly', () => {
    const authoringBundle = buildMarketSignalAuthoringBundleFromSnapshot(
      loadMarketSignalSourceSnapshot(),
    )

    expect(authoringBundle).toEqual(marketSignalAuthoringBundle)
  })
})
