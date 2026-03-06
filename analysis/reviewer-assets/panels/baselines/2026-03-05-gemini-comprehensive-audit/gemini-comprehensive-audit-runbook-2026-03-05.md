# Gemini Comprehensive Audit Runbook (March 5, 2026)

## Purpose
Run a deterministic, evidence-graded comprehensive audit for Grand Central Terminus using Gemini 3.1 Pro.

## Canonical Prompt
- `.ai/prompts/game-comprehensive-audit-task.md`

## Canonical Runner
- `scripts/ai/run-comprehensive-audit.mjs`

## Core Input Set
- `docs/reference/data-dictionary/00-index.md`
- `docs/reference/data-dictionary/03-patterns.md`
- `docs/reference/data-dictionary/05-dialogue-system.md`
- `docs/reference/data-dictionary/06-simulations.md`
- `docs/reference/data-dictionary/12-analytics.md`
- `docs/03_PROCESS/archive/ai_analysis/GCT_Patent_Application.md`
- `docs/qa/2026-03-01-doc-reconciliation-status.md`
- `docs/qa/2026-03-02-release-readiness-gate-status.md`
- `docs/qa/user-id-uuid-readiness-report.json`
- `docs/qa/simulation-phase-contract-report.json`
- `docs/qa/character-deep-coverage-report.json`
- `docs/qa/interaction-event-emitter-parity-report.json`
- `docs/qa/choice-dispatch-latency-report.json`
- `docs/qa/choice-processing-latency-report.json`
- `docs/03_PROCESS/RELEASE_READINESS_CHECKLIST.md`

## Source Precedence (Highest -> Lowest)
1. Current QA/release-truth artifacts in `docs/qa/`
2. Runtime/command evidence
3. Current implementation contracts (`content/`, `lib/`, `components/`)
4. Data dictionary docs
5. Patent claims (intent, not automatic proof of shipped behavior)

## Commands
Dry run:
```bash
node scripts/ai/run-comprehensive-audit.mjs --dry-run
```

Live run:
```bash
set -a; source /Users/abdusmuwwakkil/Development/recipe-app/.env; set +a
node scripts/ai/run-comprehensive-audit.mjs
```

## Current Output Artifacts
- `.ai/runs/20260305T035405Z/response.txt`
- `.ai/runs/20260305T035545Z/response.txt`
- `analysis/reviewer-assets/panels/baselines/2026-03-05-gemini-comprehensive-audit/gemini-3.1-pro-comprehensive-audit-2026-03-05.md`
- `analysis/reviewer-assets/panels/baselines/2026-03-05-gemini-comprehensive-audit/gemini-3.1-pro-comprehensive-audit-2026-03-05-v2.md`
- `analysis/reviewer-assets/panels/baselines/2026-03-05-gemini-comprehensive-audit/gemini-audit-manual-validation-2026-03-05.md`

## Pass Criteria For External Review
- Output includes E0/E1/E2 certainty discipline.
- Each score/strength/risk cites evidence paths.
- Capability table distinguishes:
  - `Shipped & Verified`,
  - `Implemented-Unverified`,
  - `Declared-Only`.
- Findings include smallest safe fix + verification method.
