# Next Steps Execution Plan (2026-03-05)

## Current State (Verified)
- Core narrative integrity gates are green.
- Choice taxonomy coverage is `100%` (`258/258`).
- Dialogue guideline hard/soft issues are `0/0`.
- Golden-path tests pass (`21/21`).
- Worldbuilding contract validators (canon/sim-phase/iceberg/unreliable/micro-reactivity/vertical-slice) are green.
- Home route payload wave 1 completed with measured reduction:
  - route chunk: `337 kB -> 203 kB` (`-134 kB`)
  - first-load JS: `1,228.8 kB -> 965.0 kB` (`-263.8 kB`)
- External narrative debt is still present and tracked:
  - Debt totals: detached nodes `26`, dormant nodes `0`, non-graph experience choices `0`
  - All-source context (tracked separately): detached `46`, dormant `10`, non-graph `152`

Evidence:
- `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/33-manual-readiness-gate-pack-2026-03-05.txt`
- `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/34-external-debt-triage-wave-1-2026-03-05.txt`
- `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/35-manual-ux-targeted-e2e-2026-03-05.txt`
- `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/36-mobile-touch-target-cluster-chip-deterministic-2026-03-05.txt`
- `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/37-worldbuilding-expansion-wave-1-2026-03-05.txt`
- `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/38-home-route-budget-baseline-2026-03-05.txt`
- `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/39-home-route-budget-post-lazyload-2026-03-05.txt`
- `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/40-home-route-lazyload-targeted-e2e-2026-03-05.txt`
- `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/42-lazyload-constellation-journey-correct-projects-2026-03-05.txt`
- `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/43-post-tess-tag-placement-fix-2026-03-05.txt`
- `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/44-home-route-budget-tightened-thresholds-2026-03-05.txt`

## Execution Priorities (Incremental)

### Step 1 (P1): External Debt Triage
- Goal: reduce detached/dormant/non-graph narrative debt without regressions.
- Action:
  - Classify each item as `wire`, `archive`, or `delete`.
  - Wave 1 completed with disposition-aware accounting.
- Acceptance:
  - `docs/qa/dialogue-external-debt-report.json` shows:
    - detached `46 -> 26` (`-20`)
    - dormant `10 -> 0` (`-10`)
    - non-graph `152 -> 0` (`-152`)
  - `verify:narrative-sim`, required-state, unreachable/unreferenced remain green.
- Evidence:
  - `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/34-external-debt-triage-wave-1-2026-03-05.txt`

### Step 2 (P1): Manual Narrative UX Pass
- Goal: verify real player readability/choice salience quality beyond structural validators.
- Action:
  - Run guided desktop + mobile pass across core arcs and overlays.
  - Log issues with severity + file/node references.
- Acceptance:
  - New issue log created with owner + fix intent.
  - No P1 UX blockers left untriaged.
- Status: `IN PROGRESS`
- Wave 1 outcome:
  - Targeted desktop+mobile e2e UX sweep completed (`24 passed`, `1 skipped`, `0 failed`).
  - Wave 1.1 deterministic follow-up completed: skipped cluster-chip touch-target path now passes (`1 passed`).
  - Issue log: `analysis/reviewer-assets/panels/manual-ux-pass-log-2026-03-05.md`
  - Remaining work: human subjective narrative readability/pacing pass.
  - Checklist artifact prepared: `analysis/reviewer-assets/panels/manual-narrative-readability-checklist-2026-03-05.md`
  - Follow-up regression waves completed:
    - Wave 1.2: post-lazyload settings + mobile prism checks (`8/8` passed)
    - Wave 1.3: journey + constellation owner-project checks (`5 passed`, `10 skipped`, `0 failed`)
  - Outstanding for completion:
    - Human subjective readability/pacing pass across representative arcs (desktop + mobile)

### Step 3 (P2): Worldbuilding Expansion Saturation
- Goal: increase active usage of iceberg/unreliable/micro-reactivity across more arcs.
- Action:
  - Add tags and callback lines in canonical nodes where currently sparse.
  - Keep validator counts rising with no contract drift.
- Acceptance:
  - `iceberg_tag_report`, `unreliable_record_report`, and `micro_reactivity_report` trend upward.
  - All worldbuilding validators remain green.
- Status: `WAVE 1 COMPLETE`
- Wave 1 outcome:
  - Iceberg tags: `16 -> 21` (`+5`) with low-volume topic lift:
    - `burned_district: 1 -> 3`
    - `the_oxygen_tax: 1 -> 4`
  - Verify-conflict tags: `6 -> 9` (`+3`) with added non-Samuel spread.
  - Micro-reactivity coverage:
    - `unique_memory_ids: 5 -> 7`
    - `callback_characters: 5 -> 7`
  - Gate pack remained green:
    - `verify:iceberg-tags`
    - `verify:unreliable-records`
    - `verify:micro-reactivity`
    - `verify:narrative-sim`
    - `verify:required-state-strict`
    - `verify:unreachable-dialogue-nodes`
    - `verify:unreferenced-dialogue-nodes`
- Evidence:
  - `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/37-worldbuilding-expansion-wave-1-2026-03-05.txt`
  - `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/43-post-tess-tag-placement-fix-2026-03-05.txt`

### Step 4 (P2): Home Route Payload Reduction
- Goal: improve low-end mobile startup performance.
- Action:
  - Lazy-load non-critical overlay/report surfaces.
  - Re-measure `.next` build output vs budget checks.
- Acceptance:
  - `/` first-load JS and route chunk both decline from current baseline.
- Status: `WAVE 1 COMPLETE`
- Wave 1 implementation:
  - Converted non-critical UI surfaces in `components/StatefulGameInterface.tsx` to client-side dynamic imports:
    - `StrategyReport`
    - `SettingsMobileSheet`
    - `LoginModalContents`
    - `KeyboardShortcutsHelp`
    - `Journal`
    - `SessionSummary`
    - `ConstellationPanel`
    - `DetailModal`
    - `JourneySummary`
    - `IdentityCeremony`
    - `JourneyComplete`
- Measured delta:
  - Baseline (`38`): route chunk `337 kB`, first-load `1,228.8 kB`
  - Post-change (`39`): route chunk `203 kB`, first-load `965.0 kB`
  - Improvement:
    - route chunk: `-134 kB`
    - first-load: `-263.8 kB`
- Guardrail tightened:
  - `scripts/verify-home-route-budget.mjs` defaults updated:
    - route chunk budget `340 -> 260` kB
    - first-load budget `1230 -> 1050` kB
  - Current observed values remain under tightened thresholds (`203 / 965` kB).
- Regression checks:
  - Targeted overlay/mobile e2e suite passed (`8/8`) after lazy-load patch.
  - Evidence: `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/40-home-route-lazyload-targeted-e2e-2026-03-05.txt`
  - Additional owner-project regression run:
    - Journey + constellation specs (`5 passed`, `10 skipped`, `0 failed`)
    - Evidence: `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/42-lazyload-constellation-journey-correct-projects-2026-03-05.txt`
  - Tightened budget verifier:
    - `verify:home-route-budget` passes under new thresholds.
    - Evidence: `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/44-home-route-budget-tightened-thresholds-2026-03-05.txt`

## Stop/Resume Protocol
- Execute one step at a time.
- After each step:
  - Run relevant gate pack.
  - Save evidence log under `analysis/reviewer-assets/panels/evidence/`.
  - Update this file with completed status and the next step.
