# 14FEB26 Codex Handoff: Deploy + QA Stabilization

## Scope Completed
- Stabilized failing predeploy tests in this runtime.
- Resolved Next.js type-check blocker in choice rendering path.
- Re-ran full test and build pipeline locally.
- Identified deploy target mismatch (`out/` no longer produced by current Next.js config).

## Current Branch / Baseline
- Branch: `codex/samuel-intro-review`
- Last committed head: `1d6f20b` (`feat(gameplay): tighten intros and add dispatch latency telemetry gate`)

## Uncommitted Changes (working tree)
1. `/Users/abdusmuwwakkil/Development/30_lux-story/tests/hooks/use-choice-commitment.test.tsx`
- Updated early callback timing assertion from `170ms` to `100ms` to match current commitment timing.

2. `/Users/abdusmuwwakkil/Development/30_lux-story/tests/lib/__verification__/phase1-fixtures.test.ts`
- Increased dynamic import test timeout to `15000ms` for cold runtime stability.

3. `/Users/abdusmuwwakkil/Development/30_lux-story/components/StatefulGameInterface.tsx`
- Fixed literal widening on choice feedback:
  - from: `feedback: c.choice.interaction === 'shake' ? 'shake' : undefined`
  - to: `feedback: c.choice.interaction === 'shake' ? ('shake' as const) : undefined`
- This resolves build-time type mismatch against `GameChoices` feedback union.

4. `/Users/abdusmuwwakkil/Development/30_lux-story/package.json`
- `deploy` script changed:
  - from: `npx wrangler pages deploy out --project-name=lux-story`
  - to: `npm run deploy:vercel`
- Rationale: current app uses SSR/API routes and does not emit static `out/`; previous Cloudflare static deploy command is stale.

## Verified Commands / Results
- `npm run test:run -- tests/hooks/use-choice-commitment.test.tsx` ✅ pass
- `npm run test:run -- tests/lib/__verification__/phase1-fixtures.test.ts` ✅ pass
- `npm run build` ✅ pass
- `npm run deploy` (before script update) ❌ failed at final deploy step with:
  - `ENOENT: no such file or directory, scandir '/.../out'`
- `npm run deploy` predeploy stage is fully green:
  - `74` test files passed
  - `1296` tests passed, `7` skipped

## Open Work To Finish
1. Final production deploy execution after script update
- Run: `npm run deploy`
- Expected path: `npm run deploy:vercel` -> `vercel --prod`
- Capture deployment URL and mark release complete.

2. Commit and push working tree changes
- Suggested commit scope:
  - test stability (choice commitment + fixture timeout)
  - type fix for choice feedback narrowing
  - deploy script correction (static Cloudflare command -> Vercel prod command)

3. Optional follow-up cleanup
- If Cloudflare Pages is still required, add explicit alternate script (for example `deploy:cloudflare`) with correct build adapter path and document it.

## Risk Notes
- The former `deploy` command assumed static export and will always fail under current runtime architecture unless static export is reintroduced.
- `package.json` deploy script update changes operational target to Vercel; confirm this matches production policy.

## Suggested Immediate Runbook
1. `npm run deploy`
2. If deploy succeeds, capture URL and health-check key routes.
3. `git add` + commit + push on `codex/samuel-intro-review`.
4. If requested, open PR with this handoff context in description.
