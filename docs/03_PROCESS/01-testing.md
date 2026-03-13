# Testing and Quality Gates

Last updated: 2026-03-13

## Test Stack

- Unit/component tests: `vitest` (JSDOM + Node)
- Linting: `eslint` via `npm run lint`
  Current enforced source scope: `app`, `components`, `hooks`, `lib`, `src`
  Current enforced core test scope: `tests/api`, `tests/hooks`, `tests/lib` via `npm run lint:tests:core`
  Current enforced E2E test scope: `tests/e2e` via `npm run lint:tests:e2e`
- Type checking: `tsc`
- E2E: Playwright (CI is the source of truth)
- Content/graph contracts: validation scripts in `scripts/`

## Local Workflow

1. Fast pre-check: `npm run qa:quick`
2. Lint check: `npm run lint`
3. Core test lint: `npm run lint:tests:core`
4. E2E test lint: `npm run lint:tests:e2e`
5. Run focused validators when touching narrative content:
   - `npm run validate-graphs`
   - `npm run validate-content`
   - `npm run verify:analytics-dict` (for telemetry changes)
6. If local build or Playwright dev-server startup logs `Attempted to load @next/swc-*`, run `npm run repair:swc-local`

## Local Notes

- `npm run test:e2e` now runs through a repo-local Playwright wrapper so local Playwright behavior is standardized in one place. Playwright `1.58.2` still forces `FORCE_COLOR=1` for workers and the web server, so `NO_COLOR` warnings may still appear in this terminal until upstream behavior changes.
- `npm run repair:swc-local` verifies the installed native `@next/swc-*` package for the current platform and repairs it from the npm tarball only when the local binary is broken.

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
