# Worldbuilding Expansion Opportunities (Execution Plan)

## Purpose
Turn the worldbuilding principles into shippable systems with measurable gates, not just documentation.

## Verified Baseline (Post-Implementation)
- `npm run verify:iceberg-tags` reports `Total tags: 16`, `Tagged characters: 6` (`docs/qa/iceberg-tag-report.json`).
- `UNRELIABLE_RECORD_VALIDATOR_MODE=enforce npm run verify:unreliable-records` passes with `Record tags: 6`, `Verify tags: 2`, `Tagged characters: 3` (`docs/qa/unreliable-record-report.json`).
- Targeted tests pass:
  - `tests/lib/unreliable-narrator-system.test.ts`
  - `tests/lib/knowledge-derivatives.test.ts`
- `npm run type-check` and `npm run lint` pass.

## What Was Activated In This Increment
1. Iceberg expansion topics added:
   - `the_oxygen_tax`, `burned_district`, `silent_shift`
2. New content tags wired into active dialogue nodes:
   - New `iceberg:*` mentions in Maya/Nadia/Devon arcs
   - New `record:*` and `verify-conflict:*` tags across Elena/Rohan/Samuel arcs
3. Runtime unreliable narrator loop integrated:
   - Record collection from dialogue tags
   - Conflict readiness detection
   - Truth verification flow (`verify-conflict:*`)
4. CI/verification lane added:
   - `scripts/verify-unreliable-records.ts`
   - `npm run verify:unreliable-records`
   - Workflow integration in `.github/workflows/test.yml`
   - Vertical-slice checklist integration in `scripts/verify-vertical-slice-checklist.ts`

## Expansion Opportunities (Next Execution Queue)

### P1-A: Canon Compiler (Docs -> Runtime Contract)
- Goal: One canonical world contract consumed by runtime and generated docs.
- Why: Avoid drift between `docs/02_WORLD/**`, PRD claims, and runtime behavior.
- Deliverables:
  - `content/world-canon.ts` (or JSON schema) as compiled source
  - generator script for markdown sync
  - contradiction rule checks (magic policy, station history claims)
- Acceptance:
  - runtime reads canonical contract, not ad-hoc doc strings
  - CI fails on canon contradiction

### P1-B: ARD Policy Guardrail (Accept/Reject/Deflect)
- Goal: Keep choice language agency-consistent across new arcs.
- Deliverables:
  - validator script for ARD distribution by graph
  - warn/enforce mode and waiver file for intentional deviations
- Acceptance:
  - weekly report includes ARD coverage per graph
  - no silent drift in choice taxonomy

### P1-C: Unreliable Narrator Depth Pass
- Goal: Move from minimum viable conflict verification to rich contradiction arcs.
- Deliverables:
  - +3 conflict clusters
  - at least 2 source records per conflict side
  - journal/report surfacing for unresolved vs resolved conflicts
- Acceptance:
  - validator thresholds increased (records, verify tags, characters)
  - playthrough can resolve at least 2 conflicts end-to-end

### P2-A: Faction Leitmotif Runtime Mapping
- Goal: Bind faction ideology to sound design triggers.
- Deliverables:
  - faction->audio cue mapping table
  - trigger points from node tags/context
  - fallback behavior for missing cues
- Acceptance:
  - snapshot tests verify cue selection by faction context

### P2-B: Micro-Reactivity Memory Layer
- Goal: Persist and callback small player choices later.
- Deliverables:
  - low-cost memory flag schema (`micro:*`)
  - delayed callback lines in at least 5 arcs
  - anti-spam frequency cap for callback echoes
- Acceptance:
  - narrative sim shows callback reachability
  - no duplicate callback spam in single session

## Recommended Execution Order
1. `P1-A` Canon Compiler
2. `P1-B` ARD Guardrail
3. `P1-C` Unreliable Narrator Depth Pass
4. `P2-A` Faction Leitmotifs
5. `P2-B` Micro-Reactivity Layer

## Delivery Rules (to prevent drift)
- No new narrative mechanic without:
  - validator script
  - threshold in CI
  - at least one runtime test
- No dual source of truth:
  - docs are authoring/reference
  - compiled contract is runtime truth
- New content merges only when it improves or maintains validator budgets.

## Next Milestone Definition
Milestone is complete when:
- Canon compiler is live with CI contradiction checks.
- ARD validator is merged and enforced in warn->enforce rollout.
- Unreliable narrator thresholds are raised and still green in CI.
