/**
 * World Canon Contract
 *
 * Canonical machine-readable constraints for narrative world rules.
 * Markdown docs can elaborate tone and examples, but this contract
 * is the executable source for hard policy checks.
 */

export type MagicPolicy = 'supernatural_present_never_explained'

export interface WorldCanonContract {
  version: string
  settingMode: 'grounded_magical_realism'
  magicPolicy: MagicPolicy
  explicitMagicSystemAllowed: boolean
  canonicalDocs: string[]
}

export const WORLD_CANON_CONTRACT: WorldCanonContract = {
  version: '1.0.0',
  settingMode: 'grounded_magical_realism',
  magicPolicy: 'supernatural_present_never_explained',
  explicitMagicSystemAllowed: false,
  canonicalDocs: [
    'docs/reference/source-documents/00-lux-story-prd-v2.md',
    'docs/00_CORE/02-living-design-document.md',
    'docs/02_WORLD/00-readme.md',
  ],
}
