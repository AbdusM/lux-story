# Frontend Blindspot Audit (Post-Production Follow-up, March 6, 2026)

Scope:
- Production alias: `https://lux-story.vercel.app`
- Exact deployment URL validated in this pass: `https://lux-story-jjk0q1mbv-link-dap.vercel.app`
- Runtime SHA under review: `ede228e`
- Evidence/package head: `ede228e` with refreshed screenshots

Evidence grading:
- `E0`: read-only inference
- `E1`: reproduced with explicit command / screenshot evidence
- `E2`: backed by passing test command

## Critical

No critical findings.

## High

No high findings.

## Medium

No medium findings.

## Low

No low findings.

## Blindspots and Optimization Opportunities

- `E2`: the review-target guard is now enforced in two places:
  - `BASE_URL='https://lux-story.vercel.app' npm run verify:review-target`
  - `tests/e2e/user-flows/visual-review-capture.spec.ts` now fails before screenshot capture if `/api/user/session` cannot mint a signed cookie.
- `E2`: session-failure cooldown behavior is now covered by `tests/lib/user-api-session.test.ts`.
- Remaining non-blocking reality: a manually chosen, misconfigured preview deployment can still exist, but it is now explicitly called out in the prompt/runbook and rejected by the guarded capture flow.

## Plan Fidelity / Dropped Scope Check

- Production session bootstrap is healthy.
- The iPhone SE bottom-sheet containment issue remains resolved.
- The profile surface no longer exposes the raw player UUID by default.
- The mobile simulation case-file heading no longer truncates in the refreshed evidence pack.
- The Gemini handoff now points at the correct production alias and exact deployment URL.

## Top 3 Impact Fixes Landed

1. Added review-target preflight (`verify:review-target`) and enforced it in the screenshot capture lane.
2. Hid the raw player UUID behind an optional technical disclosure on the profile surface.
3. Relaxed mobile simulation case-file layout so authored titles wrap instead of truncating.

## Commands / Checks Used

- `npm run type-check`
- `npm run test:run -- tests/lib/user-api-session.test.ts tests/components/simulation-renderer-data-analysis.test.tsx tests/components/simulation-renderer-timeout.test.tsx`
- `PLAYWRIGHT_CONSTRAINED=true npm run test:e2e -- --project=mobile-iphone-14 --workers=1 tests/e2e/mobile/choice-bottom-sheet.spec.ts`
- `PLAYWRIGHT_CONSTRAINED=true npm run test:e2e -- --project=mobile-iphone-se --workers=1 tests/e2e/mobile/choice-bottom-sheet.spec.ts`
- `npm run build`
- `BASE_URL='https://lux-story.vercel.app' npm run verify:review-target`
- `BASE_URL='https://lux-story.vercel.app' node scripts/ci/release-smoke.mjs`
- `npm run test:e2e -- --config playwright.visual-review.config.ts tests/e2e/user-flows/visual-review-capture.spec.ts`
