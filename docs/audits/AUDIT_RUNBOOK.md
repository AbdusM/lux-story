# Audit Runbook

Last updated: 2026-03-13

## Purpose

This runbook defines how Lux Story audits should be executed, stored, and repeated.

Use it with:

- `docs/audits/AUDIT_BIBLE.md`
- `docs/audits/AUDIT_OUTPUT_SCHEMA.json`
- `docs/audits/AUDIT_HISTORY.md`

## Storage Rules

- Canonical audit system docs live in `docs/audits/`.
- Generated audit outputs go in `docs/qa/` with a date prefix.
- Superseded or one-off audit outputs move to `docs/03_PROCESS/archive/`.

## Standard Audit Flow

1. Declare scope, modes, depth, and risk tolerance.
2. Collect a baseline snapshot.
3. Audit the diff first unless this is a quarterly full sweep.
4. Record findings with evidence and certainty.
5. Cluster shared root causes.
6. Build the fix queue in schema-compatible form.
7. Verify the highest-risk items with commands, tests, or prod smoke.

## Weekly Cadence

Goal: deterministic drift detection.

Suggested commands:

```bash
git status --short
npm run audit-config
npm run release:security:minimum
npm run test:run
npm run validate-content
```

Check for:

- auth/session regressions
- schema/config drift
- route breakage
- content contract breakage
- test or validator failures

Expected output:

- short audit note or no-op entry in `docs/qa/` if something changed materially

## Monthly Cadence

Goal: standard audit on changed artifacts only.

Suggested commands:

```bash
git diff --name-only <gitref>..HEAD
git diff --stat <gitref>..HEAD
rg -n "TODO|FIXME|@ts-ignore|eslint-disable" $(git diff --name-only <gitref>..HEAD)
npm run verify:review-target
```

Mode recommendations:

- `Security + Reliability` for `app/api/`, auth, sync, Supabase code
- `Maintainability + UX` for page, component, and hook changes
- `Integrity + Product / UX` for docs, PRDs, guidance, and analytics dictionary changes

Expected output:

- one dated audit report in `docs/qa/`
- fix queue ordered by root cause

## Quarterly Cadence

Goal: full surface review with fresh eyes.

Suggested commands:

```bash
npm run release:gate
npm run report:dialogue-guidelines
npm run guidance:report:live:markdown
rg --files app components hooks lib supabase docs
```

Review surfaces:

- application/runtime
- content and narrative systems
- analytics and telemetry
- admin and export routes
- compliance-sensitive flows
- documentation drift

Expected output:

- one full audit report in `docs/qa/`
- updates to `docs/audits/AUDIT_HISTORY.md` only if the audit system itself changes

## Production Verification Rules

If a finding affects deployed behavior, add live verification.

Suggested checks:

```bash
curl https://lux-story.vercel.app/api/health
curl https://lux-story.vercel.app/api/health/db
```

For user-flow incidents, verify the smallest real path that proves behavior:

- session bootstrap
- route write/read
- admin auth rejection
- export access control

Do not rely on local evidence alone for live-incident closure.

## Hotfix Mode

Use only when there is a live production incident.

Sequence:

1. Capture evidence from prod.
2. Patch the smallest safe change.
3. Run focused local verification.
4. Push and deploy.
5. Run prod smoke.
6. Backfill the full audit artifact and history note.

Required output even in hotfix mode:

- root cause
- evidence
- rollback plan
- prod verification result

## Suggested Mode-to-Surface Map

| Surface | Default modes |
| --- | --- |
| `app/api/`, auth, Supabase, sync queue | Security + Reliability |
| `components/`, `hooks/`, `app/*/page.tsx` | Maintainability + UX |
| `content/`, PRDs, dictionaries, mechanics docs | Integrity + Product / UX |
| exports, consent, telemetry, admin routes | Compliance + Security |

## Ticket Handling

Preferred owner mapping:

- `eng`: code, tests, migrations, runtime hardening
- `content`: docs, dictionaries, narrative content, editorial cleanup
- `ops`: env, deploy, production verification, release coordination
- `design`: UI clarity, interaction simplification, accessibility clarity

Keep tickets root-cause first. Split only when:

- a symptom needs an immediate hotfix
- ownership differs
- rollout risk differs

## Minimal Report Template

Store dated outputs under `docs/qa/` using:

`YYYY-MM-DD-<scope>-audit-findings.md`

Every report should include:

1. Scope declaration
2. Baseline snapshot
3. Findings
4. Root cause clusters
5. Fix queue
6. Summary: top 3 risks, top 3 quick wins, human verification needed
