# Dialogue Corpus External Review Analysis

Last updated: 2026-02-11  
Status: `ACTIVE`

## Objective

Provide an external-review-ready evaluation of:

- runtime character graph dialogue quality
- runtime answer-choice quality
- reachability-weighted risk and urgency
- explicitly out-of-scope/detached/dormant dialogue surfaces

## Scope and Method

Primary scored corpus (runtime character graphs):

- 20 character tracks (base + revisit)
- 1,389 nodes
- 1,422 content blocks
- 2,450 answer choices

Supplemental surfaces reported separately (not primary character scoring):

- Detached dialogue bundles: 46 nodes / 46 content blocks / 77 choices
- Non-graph answer bank: 7 questions / 28 choices
- Loyalty experience system: 20 experiences / 75 phases / 309 text blocks / 152 choices
- Dormant JSON dialogue artifact: 10 nodes / 42 content blocks / 17 choices

Data sources:

- `docs/qa/dialogue-guidelines-report.json`
- `docs/qa/dialogue-external-review-report.json`
- `docs/qa/unreachable-dialogue-nodes-report.json`
- `docs/qa/narrative-sim-report.json`

## Deterministic Contracts

- Content block caps: soft 35 words, hard 90 words
- Monologue-chain cap: hard if chain exceeds 2 nodes or 180 words without interaction
- Monologue-chain soft warning: >120 words without interaction
- Samuel exception: single-block hard cap 110 words (chain caps unchanged)

## Executive Summary

Primary runtime corpus:

- Hard content overruns: `123`
- Hard monologue chains: `7`
- Soft monologue chains: `7`
- Priority tiers (corpus): `high=0`, `medium=4`, `low=16`
- Priority tiers (reachability-weighted): `high=1`, `medium=3`, `low=16`

Answer-choice posture:

- Long choices (`>=16`): `75` (`3.1%`)
- Very long choices (`>=22`): `16` (`0.7%`)
- Terse non-continue (`<=2`): `77` (`3.1%`)
- Continue choices: `106` (`4.3%`)
- Question-form choices: `618` (`25.2%`)

Reachability context:

- Structural reachable nodes: `1389 / 1389`
- Reachable hard content issues: `123`
- Reachable hard chains: `7`
- Narrative sim visited state pairs: `17270`

## Priority Readout

Top corpus-priority character:

- `samuel` (`medium`, score 5): hard chains + moderate hard-content density + high fan-in complexity

Reachability-weighted top priority:

- `samuel` (`high`, weighted score 6): reachable hard chains + reachable hard-content density + high fan-in complexity

Interpretation:

- Reachability weighting produces at least one high-urgency target without inflating global severity.
- `samuel` is now the clearest player-facing cadence hotspot under deterministic chain rules.

## Key Findings

1. Overlength debt is still concentrated in a few graphs.
- Top hard-content hotspots: `zara`, `marcus`, `alex`, `kai`, `asha`.

2. Hard chain debt is no longer diffuse after deterministic normalization.
- Hard chains now primarily concentrate in `samuel` (and one additional smaller hotspot).

3. Reachability-weighted scoring is now first-class.
- Report includes reachable hard-content and chain counts per character.
- Summary includes weighted tier distribution and weighted top-priority ranking.

4. Scope clarity is now explicit and machine-readable.
- Detached/non-graph/dormant sources include runtime reachability metadata (`runtimeReachableNow`, `reachableByNavigation`, `devOnly`).

5. Save-compatibility for topology changes now has a protocol and gate.
- Redirect map + verifier added (see next section).

## Topology Migration Safety (New)

Added protocol:

- `docs/03_PROCESS/24-dialogue-topology-migration-protocol.md`

Added runtime compatibility layer:

- `lib/dialogue-node-redirects.ts`
- `lib/game-state-manager.ts` now resolves redirected node IDs during load/recovery

Added CI-quality gate:

- `npm run verify:dialogue-node-redirects`
- report output: `docs/qa/dialogue-node-redirects-report.json`

## Recommended Lane Sequence

1. Lane A: text-only compression on hard overlength hotspots.
2. Lane B: targeted interaction insertion for remaining hard chains (starting with Samuel).
3. Lane C: answer normalization + pattern-tag cleanup on touched nodes.
4. Lane D: topology refactors only behind redirect-map protocol.

## Required Gates Per Wave

- `npm run verify:dialogue-guidelines`
- `npm run report:dialogue-external-review`
- `npm run verify:narrative-sim`
- `npm run verify:unreachable-dialogue-nodes`
- `npm run verify:unreferenced-dialogue-nodes`
- `npm run verify:required-state-guarding`
- `npm run verify:dialogue-node-redirects` (for topology-touching changes)

## Artifacts

- `docs/qa/dialogue-guidelines-report.json`
- `docs/qa/dialogue-guidelines-baseline.json`
- `docs/qa/dialogue-guidelines-ratchet-report.json`
- `docs/qa/dialogue-external-review-report.json`
- `docs/qa/dialogue-node-redirects-report.json`
- `docs/qa/dialogue-remediation-samples.md`
