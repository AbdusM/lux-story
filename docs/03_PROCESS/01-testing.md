# Testing and Quality Gates

Last updated: 2026-02-11

## Test Stack

- Unit/component tests: `vitest` (JSDOM + Node)
- Linting: `next lint`
- Type checking: `tsc`
- E2E: Playwright (CI is the source of truth)
- Content/graph contracts: validation scripts in `scripts/`

## Local Workflow

1. Fast pre-check: `npm run qa:quick`
2. Lint check: `npm run lint`
3. Run focused validators when touching narrative content:
   - `npm run validate-graphs`
   - `npm run validate-content`
   - `npm run verify:analytics-dict` (for telemetry changes)

## CI Gates (Required)

- Build + lint + tests
- Dialogue graph validations and ratchets
- Required-state guarding/strict checks
- Unreachable/unreferenced node ratchets
- Analytics dictionary verification
- Playwright suites (desktop/mobile) on CI runners

## Non-Playwright Local Constraint

If local Playwright browser launch fails, do not block delivery on local E2E.
Use:

- Vitest/JSDOM suites
- Content validators
- CI Playwright for final browser confidence

## Selector and Contract References

- Selector standards: `docs/testing/selector-standards.md`
- QA baselines/reports: `docs/qa/`
- Simulation dictionary validation target: `docs/reference/data-dictionary/06-simulations.md`
