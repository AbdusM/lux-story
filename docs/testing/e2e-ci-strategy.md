# E2E Strategy: CI-First (Playwright) + Local Deterministic Gates

This repo uses **two complementary testing lanes**:

- **Lane A (Local + CI): Deterministic unit/component gates** via Vitest (JSDOM) and headless narrative simulators.
- **Lane B (CI-only): Browser E2E** via Playwright on Linux runners.

## Why CI-First for Playwright

In some local runtimes (including certain sandboxed/agent environments), launching Chromium or system Chrome via Playwright can fail with process aborts (for example `SIGABRT`) or permission errors (for example `kill EPERM`).

Rather than blocking engineering productivity on local browser launch, we treat **Playwright as a CI-quality integration gate**, and we keep **critical UI correctness** covered by **JSDOM component tests**.

## What To Run Locally

- `npm run test:run`
  - Includes component tests for "menus work" in JSDOM:
    - `tests/components/unified-menu.test.tsx`
    - `tests/components/prism-tabs.test.tsx`
  - Includes headless narrative simulation gates:
    - `tests/content/simulated-paths.test.ts`
- `npm run verify`
  - Type-check, lint, full test run, then build.

## What Runs In CI

- `npm run test:run` (same deterministic suite as local)
- `npm run test:e2e` (Playwright on Linux)

## If You Need To Debug E2E Locally

If Playwright launches work on your machine:

- Install browsers: `npm run playwright:install`
- Run headed: `npm run test:e2e:headed`
- Debug: `npm run test:e2e:debug`

If Playwright launches do **not** work locally, rely on CI and the deterministic local gates above.

