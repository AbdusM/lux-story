# Frontend Blindspot Audit

Date: 2026-03-06
Scope: shipped frontend state after commit `16aef5f`
Focus: remaining contract blindspots after shell/menu/simulation stabilization

## Severity Model

### Operational-Critical

Breaks functionality, safety, or core interaction in a way that makes the product operationally unshippable.

### Contract-Critical

Breaks the intended frontend experience contract even if the app remains technically functional.

### Narrative-Polish / Authored-Copy Debt

Leaves the product readable and usable, but still too machine-facing, meta, or aesthetically inconsistent for the intended fiction-first experience.

### Regression-Hygiene

Leaves future regressions too easy to reintroduce because variant paths, dead code, or smoke coverage are not governed tightly enough.

## Operational-Critical

No new operational-critical findings in the current shipped build.

## Contract-Critical

### 1. Contract-Critical: returning-player re-entry still bypasses the fixed gameplay shell contract

Files:
- `components/StatefulGameInterface.tsx`
- `components/game/ReturnHookPrompt.tsx`

Defect:
- The returning-player prompt is rendered between the fixed header and the transcript viewport instead of inside the transcript lane or a dedicated overlay lane.
- This means the primary shell can still change vertical composition for returning players even though normal dialogue nodes are now pinned.
- The prompt copy is also explicitly meta (`While you were away`, `Check-ins are ready`, `Plus N more`) rather than fiction-facing.

Evidence:
- `components/StatefulGameInterface.tsx#L4355-L4375`
- `components/StatefulGameInterface.tsx#L4380-L4397`
- `components/game/ReturnHookPrompt.tsx#L62-L123`

Suggested fix:
1. Move the re-entry surface into one of two bounded lanes:
   - transcript-first re-entry card inside the scroll viewport, or
   - a separate overlay/drawer that does not push the shell.
2. Rewrite the copy to read as world-state rather than inbox/dashboard state.
3. Add a seeded returning-player browser contract test so this path stops escaping the shell ratchet.

Evidence grade:
- `E0`

Verification:
- Seed a returning-player state with pending check-ins and assert:
  - dialogue stage top drift stays within shell thresholds,
  - response dock position stays fixed,
  - the returning-player prompt does not mount between header and transcript.

### 2. Contract-Critical: home-route performance governance still passes a nearly 1 MB first-load shell

Files:
- `app/page.tsx`
- `scripts/verify-home-route-budget.mjs`

Defect:
- The home route still mounts the full `StatefulGameInterface` directly at route entry.
- The current budget ratchet allows `1050 KB` first-load JS by default, so the gate passes even though the home route is still extremely heavy for a mobile-first narrative product.
- Current verified output still reports `/` at `203 KB` route chunk and `965 KB` first load locally, and the production deploy this turn built `/` at `187 kB` route chunk and `949 kB` first load.

Evidence:
- `app/page.tsx#L1-L10`
- `scripts/verify-home-route-budget.mjs#L10-L11`
- `npm run verify:home-route-budget` -> `route_chunk=203.00KB, first_load=965.00KB`
- `npm run deploy:vercel -- --yes` build output -> `/` `187 kB`, first load `949 kB`

Suggested fix:
1. Tighten the first-load budget materially below the current `1050 KB` ceiling.
2. Split the home route further so the initial shell does not eagerly pull the full active-play stack.
3. Add a second ratchet tied to mobile-interactive readiness, not just build-size pass/fail.

Evidence grade:
- `E1`

Verification:
- Lower `HOME_ROUTE_FIRST_LOAD_KB_BUDGET` in CI and rerun `npm run verify:home-route-budget`.
- Confirm `/` stays below the new threshold after route splitting.

## Narrative-Polish / Authored-Copy Debt

### 3. Narrative-Polish: simulation exception mode is improved, but still leaks raw system taxonomy into the fiction layer

Files:
- `components/game/SimulationRenderer.tsx`

Defect:
- The simulation shell is much better than the old `SIMULATION_CORE` frame, but it still exposes generic exercise labels and raw machine-facing type strings in the header.
- `Studio Exercise`, `Field Exercise`, `Analysis Exercise`, `Phase N`, and `simulation.type.replace(/_/g, ' ')` keep the experience partially framed as a tool environment instead of a fiction-native scenario.
- This is not an operational failure. It is authored-copy debt caused by the lack of a hard fiction-facing label policy for exception modes.

Evidence:
- `components/game/SimulationRenderer.tsx#L409-L423`
- `components/game/SimulationRenderer.tsx#L469-L472`
- `components/game/SimulationRenderer.tsx#L454-L464`

Suggested fix:
1. Replace raw `simulation.type` rendering with authored fiction-facing labels per lane.
2. Decide which parts of `phase` and `exercise` framing are player-visible versus author/runtime metadata.
3. Keep the timer and exit affordance, but reduce the shell’s remaining machine taxonomy.

Evidence grade:
- `E0`

Verification:
- Review full-screen simulation headers across 3 lane types and confirm no raw internal type strings remain visible.

### 4. Narrative-Polish: pattern voice still exposes raw pattern labels and direct dismiss UI inside the story card

Files:
- `components/game/PatternVoice.tsx`

Defect:
- The inner-voice surface still shows explicit labels like `[ANALYTICAL]` and a `click to dismiss` hint.
- That is materially lighter than the previous meta/status chrome, but it is still more system-readable than fiction-readable.
- This is likely the right direction, but it needs an authored-copy contract to stop the next pass from devolving into subjective polish debate.

Evidence:
- `components/game/PatternVoice.tsx#L93-L112`

Suggested fix:
1. Convert the visible label into tone/styling rather than bracketed taxonomy.
2. Remove the explicit dismiss hint from the visible scene layer.
3. Keep dismissibility, but make it silent or accessibility-only.

Evidence grade:
- `E0`

Verification:
- Pattern-voice scenes should remain understandable without visible bracketed pattern names or dismiss instructions.

## Regression-Hygiene

### 5. Regression-Hygiene: story-surface contract coverage still misses the re-entry and inner-voice variants

Files:
- `tests/e2e/user-flows/story-surface-contract.spec.ts`
- `tests/e2e/mobile/choice-bottom-sheet.spec.ts`
- `components/game/ReturnHookPrompt.tsx`
- `components/game/PatternVoice.tsx`

Defect:
- The current browser ratchets guard the main intro path and the mobile 4+ choice path, but they do not seed returning-player re-entry or pattern-voice states.
- The exact shell issue fixed in `16aef5f` was caught only after the broader mobile matrix failed, not by a dedicated gameplay-shell variant test.

Evidence:
- `tests/e2e/user-flows/story-surface-contract.spec.ts#L54-L91`
- `tests/e2e/mobile/choice-bottom-sheet.spec.ts#L3-L65`
- `rg -n "return-hook|ReturnHookPrompt|while you were away|Open Journey" tests components app`

Suggested fix:
1. Add a `returning-player shell contract` Playwright test with seeded check-ins.
2. Add a `pattern-voice story surface` test that asserts no raw pattern badge language or dismiss-hint leakage in the active scene.
3. Extend the mobile geometry checks beyond the single iPhone 14 constrained path when shell-affecting overlays are present.

Evidence grade:
- `E1`

Verification:
- New tests should fail if:
  - the return-hook mounts outside the transcript lane,
  - pattern-voice labels/dismiss hints reappear as raw system chrome,
  - smaller-device shell geometry drifts beyond the fixed thresholds.

### 6. Regression-Hygiene: the old mixed-IA menu still exists as dormant code and can reintroduce the regression later

Files:
- `components/GameMenu.tsx`
- `components/UnifiedMenu.tsx`

Defect:
- The repo still contains the legacy `GameMenu` component with `Career Profile` and `Clinical Audit` inside the active-play dropdown.
- `UnifiedMenu` is now the live path, but the older menu surface remains in the codebase as a ready-made regression vector.

Evidence:
- `components/GameMenu.tsx#L31-L48`
- `components/UnifiedMenu.tsx#L1-L9`
- `rg -n "<GameMenu|GameMenu\\b" components app tests lib`

Suggested fix:
1. Delete `components/GameMenu.tsx` if it is truly dead.
2. If it must remain temporarily, mark it deprecated and add a test or lint guard preventing active imports.

Evidence grade:
- `E1`

Verification:
- `rg` should show no active imports of `GameMenu`, and CI should fail on any future import of the legacy component.

### 7. Regression-Hygiene: release smoke remains operationally useful but blind to the immersive frontend contract

Files:
- `scripts/ci/release-smoke.mjs`

Defect:
- The release smoke only checks route health, auth guards, and CSP.
- It does not cover the active gameplay shell, returning-player re-entry, simulation-shell framing, or mobile layout integrity.
- That means a production deploy can still pass the official smoke while violating core narrative UI contracts.

Evidence:
- `scripts/ci/release-smoke.mjs#L57-L139`
- Live smoke this turn passed `15/15` on both deployment and production URLs without checking shell geometry or immersion-specific surfaces.

Suggested fix:
1. Keep the current release smoke as the operational layer.
2. Add a production-safe browser smoke lane for:
   - story shell geometry,
   - mobile bottom-sheet geometry,
   - one timed simulation path,
   - one returning-player re-entry path.

Evidence grade:
- `E1`

Verification:
- Production smoke should fail if the game shell drifts even when health/auth/CSP remain green.

## Blindspots And Optimization Opportunities

- No current contract test covers the returning-player shell path.
- No current contract test covers pattern-voice rendering in active play.
- The home-route budget gate is still calibrated to a permissive near-1 MB first-load ceiling.
- Simulation shell work is now bounded, but there is still no explicit authored-copy policy separating fiction-facing labels from runtime taxonomy.
- A dead legacy menu component remains in the tree and can silently bypass the new IA contract later.

## Plan Fidelity And Dropped Scope Checks

- The frontend redesign contract was largely met for the primary path:
  - normal dialogue shell is materially more stable,
  - bottom-sheet mobile regression was fixed,
  - menu IA split shipped,
  - full-screen simulation is no longer the old dashboard shell.
- The biggest plan-fidelity miss is the returning-player path:
  - it still sits outside the canonical transcript lane and can perturb the shell for a subset of sessions.
- The second miss is governance:
  - test coverage and smoke coverage still reflect the main path more than the risky variant paths.

## Top 3 Impact Fixes

1. Fold the returning-player prompt into the canonical shell contract and add a dedicated browser ratchet for it.
2. Tighten the `/` route budget from the current permissive ceiling and split more of the active-play stack off the initial route.
3. Lock a fiction-facing copy policy for simulation/pattern voice, then delete the dead legacy `GameMenu` and add import/smoke guards around the new IA contract.

## Commands Run

- `rg -n "ReturnHookPrompt|PatternVoice|Responses \\(|Research Participation|Profile & Preferences|Clinical Audit|Leave exercise|Analysis Exercise|Studio Exercise|Field Exercise|Committing your response|Journal updated|Journey updated|Press \\? for keyboard shortcuts|SIMULATION_CORE|ABORT SIMULATION" components app lib tests -g '!test-results'`
- `rg -n "return-hook|ReturnHookPrompt|while you were away|Open Journey|GameMenu|Clinical Audit" tests components app -g '!test-results'`
- `rg -n "<GameMenu|GameMenu\\b" components app tests lib -g '!test-results'`
- `npm run verify:home-route-budget`
- targeted source inspection with `sed` / `nl -ba` for:
  - `components/StatefulGameInterface.tsx`
  - `components/game/ReturnHookPrompt.tsx`
  - `components/game/PatternVoice.tsx`
  - `components/game/SimulationRenderer.tsx`
  - `components/GameMenu.tsx`
  - `components/UnifiedMenu.tsx`
  - `tests/e2e/user-flows/story-surface-contract.spec.ts`
  - `tests/e2e/mobile/choice-bottom-sheet.spec.ts`
  - `scripts/ci/release-smoke.mjs`
  - `scripts/verify-home-route-budget.mjs`
