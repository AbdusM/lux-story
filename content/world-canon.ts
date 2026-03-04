/**
 * World Canon Contract
 *
 * Single machine-readable contract for world policy + timeline invariants.
 * Markdown docs can expand context, but this object defines enforceable truth.
 */

export type MagicPolicy = 'supernatural_present_never_explained'

export type WorldEraId =
  | 'arrival'
  | 'expansion_wars'
  | 'logic_cascade'
  | 'corp_state'
  | 'current_drift'

export interface WorldEraContract {
  id: WorldEraId
  title: string
  startAS: number
  endAS: number | null
}

export interface RequiredPhraseAnchor {
  id: string
  phrase: string
  docPaths: string[]
}

export interface WorldCanonContract {
  version: string
  settingMode: 'grounded_magical_realism'
  magicPolicy: MagicPolicy
  explicitMagicSystemAllowed: boolean
  canonicalDocs: string[]
  timelineDocs: string[]
  eras: WorldEraContract[]
  forbiddenPhrases: string[]
  requiredAnchors: RequiredPhraseAnchor[]
}

export const WORLD_CANON_CONTRACT: WorldCanonContract = {
  version: '1.1.0',
  settingMode: 'grounded_magical_realism',
  magicPolicy: 'supernatural_present_never_explained',
  explicitMagicSystemAllowed: false,
  canonicalDocs: [
    'docs/reference/source-documents/00-lux-story-prd-v2.md',
    'docs/00_CORE/02-living-design-document.md',
    'docs/02_WORLD/00-readme.md',
  ],
  timelineDocs: [
    'docs/02_WORLD/00_CORE_TRUTH/00-timeline-master.md',
    'docs/02_WORLD/01-station-history-bible.md',
  ],
  eras: [
    { id: 'arrival', title: 'The Arrival', startAS: 0, endAS: 500 },
    { id: 'expansion_wars', title: 'The Expansion Wars', startAS: 500, endAS: 1500 },
    { id: 'logic_cascade', title: 'The Logic Cascade', startAS: 1500, endAS: 3000 },
    { id: 'corp_state', title: 'The Corp-State', startAS: 3000, endAS: 4500 },
    { id: 'current_drift', title: 'The Current Drift', startAS: 4500, endAS: null },
  ],
  forbiddenPhrases: [
    'no magic',
  ],
  requiredAnchors: [
    {
      id: 'magic-policy-anchor',
      phrase: 'magical realism',
      docPaths: [
        'docs/reference/source-documents/00-lux-story-prd-v2.md',
        'docs/00_CORE/02-living-design-document.md',
      ],
    },
    {
      id: 'dyson-swarm-fragment-anchor',
      phrase: 'Dyson Swarm Fragment',
      docPaths: [
        'docs/02_WORLD/00_CORE_TRUTH/00-timeline-master.md',
        'docs/02_WORLD/01-station-history-bible.md',
      ],
    },
    {
      id: 'breath-tax-anchor',
      phrase: 'Breath Tax',
      docPaths: [
        'docs/02_WORLD/00_CORE_TRUTH/00-timeline-master.md',
        'docs/02_WORLD/01-station-history-bible.md',
      ],
    },
  ],
}
