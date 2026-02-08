# E2E Strategy (CI-First)

## Context

In some local / agent runtimes, Playwright browser launches can fail (e.g. `SIGABRT`, sandbox/permissions issues, `kill EPERM`), including when targeting system Chrome.

When that happens:
- Treat Playwright E2E as a CI-only quality gate (Linux runners).
- Use Vitest + Testing Library (JSDOM) component tests locally for critical UI correctness ("menus work").

## What To Run

- Local (works in restricted runtimes):
  - `npm run test:run`
- CI (E2E gate):
  - `npm run test:e2e`

## Troubleshooting (Optional)

If Playwright fails on your dev machine and you want to experiment:
- Try `npm run test:e2e:local` (uses local browsers).
- Consider adding a temporary Chromium launch arg experiment (e.g. `--disable-crashpad`) in `playwright.config.ts`.

