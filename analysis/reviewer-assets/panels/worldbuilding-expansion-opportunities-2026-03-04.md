# Worldbuilding Expansion Opportunities (Execution Plan)

## Purpose
Turn the worldbuilding principles into shippable systems with measurable gates, not just documentation.

## Status
- `P1-A Canon Compiler`: Completed on 2026-03-04 (typed contract + timeline invariants + source snapshot + CI enforce mode).
- `P1-B ARD Guardrail`: Completed previously (`verify:choice-taxonomy` ratchet lane + CI enforce mode).
- `P1-C Unreliable Narrator Depth Pass`: Substantially completed on 2026-03-04 (5 conflict clusters, perspective-depth contract, Journal+Report surfacing; playthrough validation still recommended).
- `P2-A Faction Leitmotif Runtime Mapping`: Completed on 2026-03-04 (faction->cue contract, runtime trigger integration, consequence-source cue mapping, fallback inference helpers, test coverage).
- `P2-B Micro-Reactivity Memory Layer`: Completed on 2026-03-04 (tag contract + anti-spam runtime callbacks + validator + 5-arc callback coverage).

## Verified Baseline (Post-Implementation)
- `npm run verify:iceberg-tags` reports `Total tags: 16`, `Tagged characters: 6` (`docs/qa/iceberg-tag-report.json`).
- `UNRELIABLE_RECORD_VALIDATOR_MODE=enforce npm run verify:unreliable-records` passes with `Record tags: 14`, `Verify tags: 6`, `Tagged characters: 5` (`docs/qa/unreliable-record-report.json`).
- `MICRO_REACTIVITY_VALIDATOR_MODE=enforce npm run verify:micro-reactivity` passes with `unique_memory_ids: 5`, `callback_characters: 5` (`docs/qa/micro-reactivity-report.json`).
- Targeted tests pass:
  - `tests/lib/unreliable-narrator-system.test.ts`
  - `tests/lib/knowledge-derivatives.test.ts`
  - `tests/lib/faction-audio.test.ts`
  - `tests/lib/micro-reactivity.test.ts`
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
- Status: Completed
- Goal: One canonical world contract consumed by runtime and generated docs.
- Why: Avoid drift between `docs/02_WORLD/**`, PRD claims, and runtime behavior.
- Deliverables:
  - `content/world-canon.ts` as compiled source (with timeline + anchor contract)
  - `scripts/verify-world-canon-contract.ts` generates:
    - `docs/qa/world-canon-contract-report.json`
    - `docs/qa/world-canon-source-snapshot.json`
  - contradiction checks for magic policy + station history era invariants
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
- Status: Substantially completed
- Goal: Move from minimum viable conflict verification to rich contradiction arcs.
- Deliverables:
  - +3 conflict clusters (now 5 total clusters)
  - at least 2 source records per conflict side (enforced by validator perspective rules)
  - journal/report surfacing for unresolved vs resolved conflicts (added)
- Acceptance:
  - validator thresholds increased (records, verify tags, characters, cluster count, perspective depth)
  - playthrough can resolve at least 2 conflicts end-to-end (manual verification recommended)

### P2-A: Faction Leitmotif Runtime Mapping
- Status: Completed
- Goal: Bind faction ideology to sound design triggers.
- Deliverables:
  - faction->audio cue mapping table
  - trigger points from node tags/context
  - fallback behavior for missing cues
- Acceptance:
  - snapshot tests verify cue selection by faction context

### P2-B: Micro-Reactivity Memory Layer
- Status: Completed
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
