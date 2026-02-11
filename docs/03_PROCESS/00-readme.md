# Process Hub

Last updated: 2026-02-11

## Purpose

This folder is the operational hub for implementation, QA, and release workflow.

## Day-to-Day Commands

- Start dev server: `npm run dev`
- Type check + tests (fast local gate): `npm run qa:quick`
- Full verification gate: `npm run verify`
- Graph/content validation: `npm run validate-graphs` and `npm run validate-content`
- Analytics contract validation: `npm run verify:analytics-dict`

## Release Quality Flow

1. Implement in small, mergeable commits.
2. Run `npm run qa:quick` locally.
3. Run targeted validators for touched areas.
4. Open PR and rely on CI for full suite.
5. Merge only after required checks are green.

## Canonical Process Docs

- Testing strategy: `docs/03_PROCESS/01-testing.md`
- Delivery methodology: `docs/03_PROCESS/02-methodology.md`
- Document control policy: `docs/03_PROCESS/03-document-control.md`
- Archive index: `docs/03_PROCESS/archive/00-archive-index.md`

## Notes

- Playwright browser execution may fail in constrained local runtimes.
- CI Playwright is authoritative; local confidence comes from Vitest/JSDOM + validators.
