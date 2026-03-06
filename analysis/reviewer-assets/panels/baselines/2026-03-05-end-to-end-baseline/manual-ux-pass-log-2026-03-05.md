# Manual UX Pass Log (Wave 1, 2026-03-05)

## Scope
- Targeted UX regression suite across desktop + mobile:
  - `tests/e2e/user-flows/settings-parity.spec.ts`
  - `tests/e2e/user-flows/overlay-smoothness.spec.ts`
  - `tests/e2e/mobile/game-flow.spec.ts`
  - `tests/e2e/mobile/prism-menu.spec.ts`
  - `tests/e2e/mobile/choice-bottom-sheet.spec.ts`
  - `tests/e2e/mobile/touch-targets.spec.ts`
  - `tests/e2e/mobile/safe-areas.spec.ts`
- Projects executed:
  - `settings-parity`
  - `overlay-perf`
  - `mobile-iphone-14`

## Evidence
- `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/35-manual-ux-targeted-e2e-2026-03-05.txt`

## Result Summary
- Passed: `24`
- Skipped: `1`
- Failed: `0`
- Runtime: `~5.2m`

Overlay performance sample (CPU throttle `4x`):
- Desktop: open `373ms`, close `116ms`, open FPS `20`, close FPS `30`
- Mobile: open `311ms`, close `114ms`, open FPS `38.6`, close FPS `60`

## Findings (Severity-ranked)

1. Cluster filter chip touch-target assertion skipped in seeded state.
- Severity: `P3`
- Evidence: `tests/e2e/mobile/touch-targets.spec.ts:185` (skip when chips not rendered), run log in evidence file above.
- Impact: one touch-target assertion path is not continuously validated in this seed flow.
- Action: add deterministic fixture that guarantees cluster chips are rendered, then unskip this path.

## Follow-up Fix (Wave 1.1)

- Deterministic fix applied:
  - Scoped chip locators to constellation dialog group (`aria-label="Filter skills by cluster"`) to avoid false matches against unrelated "All ..." buttons.
  - Removed runtime skip path for this assertion.
  - File: `tests/e2e/mobile/touch-targets.spec.ts`
- Verification:
  - `PLAYWRIGHT_CONSTRAINED=true npx playwright test --project=mobile-iphone-14 --workers=1 tests/e2e/mobile/touch-targets.spec.ts --grep "Cluster filter chips meet 44px minimum"`
  - Result: `1 passed`
  - Evidence: `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/36-mobile-touch-target-cluster-chip-deterministic-2026-03-05.txt`

## Follow-up Validation (Wave 1.2)

- Trigger:
  - Home-route payload optimization moved multiple panel/overlay components to dynamic imports in `StatefulGameInterface`.
- Targeted regression suite:
  - `tests/e2e/user-flows/settings-parity.spec.ts`
  - `tests/e2e/mobile/prism-menu.spec.ts`
- Projects:
  - `settings-parity`
  - `mobile-iphone-14`
- Result:
  - Passed: `8`
  - Failed: `0`
  - Runtime: `~1.8m`
- Evidence:
  - `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/40-home-route-lazyload-targeted-e2e-2026-03-05.txt`

## Follow-up Validation (Wave 1.3)

- Trigger:
  - Confirm dynamic-loaded `JourneySummary` and `ConstellationPanel` surfaces still behave in their owning Playwright projects.
- Project-scoped suite:
  - `core-game` + `ui-components`
  - Specs:
    - `tests/e2e/journey-summary.spec.ts`
    - `tests/e2e/constellation/constellation-mobile.spec.ts`
- Result:
  - Passed: `5`
  - Skipped: `10`
  - Failed: `0`
  - Runtime: `~38.5s`
- Note:
  - Skips are test-defined conditions in journey-summary scenarios and are unchanged by this patch.
- Evidence:
  - `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/42-lazyload-constellation-journey-correct-projects-2026-03-05.txt`

## Open Manual Checks (Not covered by this wave)
- Full narrative readability/pacing pass across representative arcs (human subjective review).
- Cross-device visual mood checks beyond iPhone 14 profile (tablet + low-end Android).
- Long-session fatigue checks (20+ minute continuous play with panel switching).
