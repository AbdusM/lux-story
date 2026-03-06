# Choice Taxonomy Manual Execution Playbook (2026-03-05)

## Goal
- Raise `verify:choice-taxonomy` coverage safely from `10.47%` (`27/258`) to `25%+` without narrative regressions.
- Keep all integrity gates green after every batch.

## Current Baseline
- Source: `docs/qa/choice-taxonomy-report.json`
- Coverage: `10.47%`
- Eligible nodes: `258`
- Compliant nodes: `27`
- Non-compliant nodes: `231`

Highest remaining non-compliant load:
- `samuel` (34)
- `yaquin` (17)
- `isaiah` (14)
- `quinn` (13)
- `maya` (13)
- `tess` (11)
- `dante` (11)
- `devon` (10)
- `marcus` (10)
- `kai` (10)
- `rohan` (10)
- `grace` (10)
- `asha` (10)

## Non-Negotiable Rules
1. Do not change `choiceId`, `text`, `nextNodeId`, `visibleCondition`, or consequences for taxonomy work.
2. Only add `taxonomyClass: 'accept' | 'reject' | 'deflect'`.
3. A node is compliant only when at least one visible choice is mapped to each class.
4. If a node is genuinely ambiguous, skip it for now; do not force a bad mapping.
5. Run validation gates after each batch and stop if any regression appears.

## Taxonomy Mapping Standard
- `accept`: align/commit/advance the presented frame or action.
- `reject`: challenge, resist, counter, or change direction against the frame.
- `deflect`: pause, redirect, ask context/meta, or hold ambiguity.

Quick heuristic:
- If choice says "yes/let's do it/proceed" -> `accept`
- If choice says "no/not that/push back/problem with premise" -> `reject`
- If choice says "maybe/later/tell me more/wait/other angle" -> `deflect`

## Execution Order (Manual + High Leverage)

### Wave 1 (finish partially migrated core graphs)
1. `samuel` (remaining 34)
2. `maya` (remaining 13)
3. `devon` (remaining 10)
4. `jordan` (remaining 9)
5. `nadia` (remaining 8)

### Wave 2 (largest untouched)
1. `yaquin` (17)
2. `isaiah` (14)
3. `quinn` (13)
4. `tess` (11)
5. `dante` (11)

### Wave 3 (remaining 10-node class)
1. `marcus`
2. `kai`
3. `rohan`
4. `grace`
5. `asha`

### Wave 4 (long tail)
- `alex`, `lira`, `silas`, `elena`, `zara`, revisit + environment graphs.

## Batch Size + Cadence
- Batch size: `2-3 graphs` or `~9 compliant nodes` per batch.
- After each batch, run full gate pack and capture one evidence log.
- Expected lift per batch: `+2%` to `+4%` depending on node shape.

## Gate Pack (Run Every Batch)
```bash
(npm run verify:choice-taxonomy \
  && npm run verify:narrative-sim \
  && npm run verify:required-state-strict \
  && npm run verify:unreachable-dialogue-nodes \
  && npm run verify:unreferenced-dialogue-nodes) \
  | tee analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/<batch-log>.txt
```

## Definition of Done (for this lane)
1. Coverage `>= 25%`.
2. No regressions in sim/required-state/reachability gates.
3. Updated audit note in:
   - `analysis/reviewer-assets/panels/comprehensive-codebase-audit-2026-03-04.md`
   - `analysis/reviewer-assets/panels/narrative-simulation-coverage-sweep-2026-03-04.md`
4. Evidence logs present for every executed batch.

## Codex Spark Task Packet (Copy/Paste)
```text
Task: Add taxonomyClass annotations only (accept/reject/deflect) in [GRAPH LIST].

Hard constraints:
- Do not modify choiceId/text/nextNodeId/conditions/consequences.
- Only add taxonomyClass fields.
- Skip ambiguous nodes rather than forcing bad labels.

Target:
- Make at least 9 additional nodes compliant in this batch.

Validation required:
1) npm run verify:choice-taxonomy
2) npm run verify:narrative-sim
3) npm run verify:required-state-strict
4) npm run verify:unreachable-dialogue-nodes
5) npm run verify:unreferenced-dialogue-nodes

Output:
- Coverage before/after
- Files changed
- Any skipped ambiguous nodes
- Path to tee log artifact
```

## Manual Reviewer Checklist (per PR)
1. Spot-check 5 nodes: does class assignment match narrative intent?
2. Confirm no behavior change fields were edited.
3. Confirm gate pack all green.
4. Confirm coverage increased.

