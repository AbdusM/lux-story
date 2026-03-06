# Release Candidate PR Split (March 4, 2026)

## Purpose
Create two focused PRs from a dirty working tree without pulling in unrelated files.

## PR-1: Security & Runtime Policy

### Scope
- Enforce API auth/session boundaries.
- Remove unsafe runtime behavior.
- Enforce production route exposure policy.
- Enforce overlay close-affordance runtime policy.

### Files
- `app/api/advisor-briefing/route.ts`
- `app/api/samuel-dialogue/route.ts`
- `app/api/admin-proxy/urgency/route.ts`
- `app/api/health/storage/route.ts`
- `lib/logger.ts`
- `lib/keyboard-shortcuts.ts`
- `lib/overlay-store.ts`
- `middleware.ts`
- `next.config.js`
- `tests/lib/__verification__/release-security-minimum.test.ts`
- `tests/lib/keyboard-shortcuts.test.ts`
- `tests/lib/overlay-store.test.ts`

### Suggested commit command
```bash
git add \
  app/api/advisor-briefing/route.ts \
  app/api/samuel-dialogue/route.ts \
  app/api/admin-proxy/urgency/route.ts \
  app/api/health/storage/route.ts \
  lib/logger.ts \
  lib/keyboard-shortcuts.ts \
  lib/overlay-store.ts \
  middleware.ts \
  next.config.js \
  tests/lib/__verification__/release-security-minimum.test.ts \
  tests/lib/keyboard-shortcuts.test.ts \
  tests/lib/overlay-store.test.ts

git commit -m "security: enforce api auth boundaries and production/runtime policies"
```

## PR-2: CI, Governance, and Performance Guardrails

### Scope
- Add keydown ownership governance check.
- Add home-route budget verifier and CI enforcement.
- Harden Playwright parity execution path.
- Update dependency graph for resolved advisories.

### Files
- `.github/workflows/test.yml`
- `.github/workflows/playwright.yml`
- `playwright.config.ts`
- `scripts/verify-keydown-listener-ownership.ts`
- `scripts/verify-home-route-budget.mjs`
- `package.json`
- `package-lock.json`
- `vitest.config.ts`
- `docs/qa/keydown-listener-ownership-report.json`
- `docs/qa/home-route-budget-report.json`

### Suggested commit command
```bash
git add \
  .github/workflows/test.yml \
  .github/workflows/playwright.yml \
  playwright.config.ts \
  scripts/verify-keydown-listener-ownership.ts \
  scripts/verify-home-route-budget.mjs \
  package.json \
  package-lock.json \
  vitest.config.ts \
  docs/qa/keydown-listener-ownership-report.json \
  docs/qa/home-route-budget-report.json

git commit -m "ci: add keyboard ownership and home-route budget gates"
```

## Full Gate Status (this workspace state)
- `npm run test:run` -> pass (`82` files, `1354` tests passed, `4` skipped)
- `npm run build` -> pass
- `npm run verify:keydown-listeners` -> pass
- `npm run verify:home-route-budget` -> pass

## Known Environment Notes
- Local build shows repeated SWC native-load warning and falls back successfully; build still completes.
- Sentry/Webpack critical-dependency warnings persist (non-blocking in current gate).
