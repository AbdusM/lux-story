# Character Deep Coverage Audit

Last updated: 2026-02-11
Status: `ACTIVE`

## Scope

Deep coverage review across all 20 playable characters, combining:

- Dialogue graph structure and gating quality
- Narrative simulation expansion coverage
- Character depth profiles (vulnerabilities, strengths, growth arcs)
- Consequence echo + pattern voice coverage
- Multi-session story arc participation

## Verification Commands

- `npm run verify:character-coverage`
- `npm run validate-graphs -- --all --info`
- `npm run verify:unreachable-dialogue-nodes`
- `npm run verify:unreferenced-dialogue-nodes`
- `npm run verify:narrative-sim`
- `npm run verify:required-state-guarding`
- `npm run verify:required-state-strict`
- `npm run verify:arc-completion-flags`
- `npm run verify:validate-graphs-info`
- `npm run report:character-deep-coverage`
- `npm run qa:quick`

## Current Headline Results

- Characters audited: `20`
- Character nodes: `1389`
- Character choices: `2450`
- Required-state nodes: `150`
- Unguarded required-state nodes: `0`
- Narrative sim expansions: `17270`
- Unreachable nodes: `0`
- Unreferenced nodes: `0`
- Validate-graphs info items: `0`
- Risk distribution: `high=0`, `medium=0`, `low=20`

## Improvements Landed In This Pass

- Removed final pattern-balance warning in `maya_revisit` by rebalancing one choice pattern.
- Hardened `scripts/verify-validate-graphs-info-ratchet.ts` so zero-info output parses correctly.
- Added growth arcs for remaining medium-risk characters:
  - `alex`, `asha`, `elena`, `kai`, `lira`, `nadia`, `quinn`, `silas`, `zara`
- Added new multi-session arc in `content/story-arcs/index.ts`:
  - `repair_protocol` (`alex`, `nadia`, `quinn`, `silas`)
- Added growth arcs to eliminate remaining zero-growth debt:
  - `samuel`, `jordan`
- Added second multi-session arc to eliminate remaining zero-arc debt:
  - `builders_common` (`marcus`, `tess`, `yaquin`, `kai`)

## Remaining Debt (Low-Risk Only)

- Characters with `<2` vulnerabilities: `13`
- Characters with `<2` strengths: `11`
- Characters with `0` growth arcs: `0`
- Characters with `0` multi-session arc participation: `0`

## Artifacts

- Canonical deep-coverage report: `docs/qa/character-deep-coverage-report.json`
- Validate-graphs info ratchet report: `docs/qa/validate-graphs-info-report.json`
- Narrative simulation report: `docs/qa/narrative-sim-report.json`
- Arc completion report: `docs/qa/arc-completion-flags-report.json`
