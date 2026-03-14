# Audit Bible v2

Last updated: 2026-03-13

## Purpose

Turn messy reality into an actionable fix queue with evidence, severity, and next steps.

An audit answers four questions:

1. What's true right now?
2. What's risky?
3. What's missing?
4. What should we do next?

An audit is not:

- a vibes-based review
- a speculative rewrite of the system
- a grand redesign disguised as findings

Every audit must produce three outputs:

1. Findings
2. Evidence
3. Fix queue

If it does not produce all three, it is not an audit.

## Lux Story Amendments

These are repo-specific additions to the base framework.

- Every finding should include `issue_type` in addition to category. Use one of: `code_defect`, `runtime_config_mismatch`, `content_gap`, `data_drift`, `process_gap`, `test_gap`, `unknown`.
- Any finding that affects deployed behavior must include `prod_verification`, even if the answer is "not run".
- Hotfix mode is allowed for live incidents: patch first, then backfill the full audit artifact.
- Use `Observed` vs `Inferred` on every finding.
- Prefer evidence grading alongside certainty:
  - `E0`: static inspection of repo artifacts
  - `E1`: command output, logs, live responses, screenshots
  - `E2`: tests, builds, or automated verification

## 0. First Principles

### What an audit is

A decision-support system.

### What an audit is not

- an opinion dump
- a wish list
- a complete redesign unless the evidence forces it

### The three non-negotiables

- Findings: what is wrong, missing, or risky
- Evidence: where it lives, with concrete references
- Fix Queue: exact next actions, in order

## 1. Operating Cadence

Audits should run as a system, not as one-off reports.

| Cadence | Frequency | What | How |
| --- | --- | --- | --- |
| Weekly | Every week | Deterministic checks + drift detection | Scripts, CI gates, lightweight diff review |
| Monthly | Every month | Deep audit on changed artifacts | Diff-first LLM audit + targeted verification |
| Quarterly | Every quarter | Full surface review | Manual + LLM, fresh eyes, full sweep |

### Diff-first principle

Most audits should target change, not the entire repository.

- Code: `git diff --name-only <gitref>..HEAD`
- Docs/content: only changed docs or content bundles
- Data/reporting: only tables, routes, or outputs changed since the last audit

Quarterly audits are the exception.

### Version everything

Version:

- prompt templates
- severity taxonomies
- output schemas
- pattern libraries

If the audit system is not versioned, it cannot improve reliably.

## 2. Audit Modes

Always declare which modes are active.

| Mode | Focus | Output |
| --- | --- | --- |
| Integrity | Data consistency, schema correctness, SSOT drift, missing fields, broken contracts | Violations + corrections |
| Security | Auth gaps, secrets, logging leaks, permission errors, injection surfaces | Vulnerabilities + mitigations |
| Reliability | Retries, timeouts, idempotency, state drift, concurrency, degraded-mode behavior | Failure scenarios + guardrails |
| Maintainability | Duplicate logic, oversized files, weak boundaries, dead code, unclear ownership | Refactor candidates + test gaps |
| Product / UX | Cognitive load, funnel friction, user story to UI mismatch, alert overload | UX defects + simplifications |
| Growth / SEO | Canonicals, thin pages, schema markup, index bloat, internal linking | Hygiene fixes + cluster map |
| Compliance | PII/PHI, consent, retention, access control, redaction, sharing boundaries | High-risk fixes + policy requirements |

### Common Lux Story combinations

- `Security + Reliability`: `/api/*`, auth/session code, Supabase access, background sync
- `Maintainability + UX`: `components/`, `hooks/`, page-level state flows
- `Integrity + Product / UX`: PRDs, data dictionaries, guidance surfaces, analytics contracts
- `Compliance + Security`: consent flows, exports, telemetry, admin routes

## 3. Audit Structure

### 3.1 Scope declaration

Every audit starts by declaring:

- in-scope artifacts
- out-of-scope artifacts
- risk tolerance: `prototype`, `production`, or `regulated`
- depth: `surface`, `standard`, or `deep`
- modes in use

### 3.2 Baseline snapshot

Summarize "what exists today" in 10 bullets max.

Include only facts you can verify, such as:

- tests passing/failing
- build status
- health endpoints
- deploy status
- known error rate or smoke-check results
- current doc/script ownership

### 3.3 Findings

Each finding must be structured.

| Field | Required | Description |
| --- | --- | --- |
| `id` | Yes | Stable identifier |
| `title` | Yes | Short finding title |
| `severity` | Yes | `P0`, `P1`, `P2`, `P3` |
| `category` | Yes | Audit mode bucket |
| `issue_type` | Yes | Code defect, runtime/config mismatch, content gap, etc. |
| `certainty` | Yes | `Observed` or `Inferred` |
| `evidence_grade` | Preferred | `E0`, `E1`, `E2` |
| `impact` | Yes | Who gets hurt and how |
| `evidence` | Yes | `file:line`, URL, endpoint, command output, or sample payload |
| `root_cause` | Yes | Why it exists |
| `fix` | Yes | Smallest safe fix |
| `verification` | Yes | How to prove it is fixed |
| `prod_verification` | Required for live-impact findings | What was checked in deployed runtime |

If evidence cannot be cited, the finding must be labeled:

`Hypothesis (needs verification)`

Hypotheses do not enter the observed fix queue.

### Severity rubric

| Level | Criteria |
| --- | --- |
| `P0` | Safety breach, data loss, production outage, legal exposure |
| `P1` | Likely user harm, major workflow break, high-cost debugging |
| `P2` | Paper cuts, drift risk, scaling friction, avoidable operational load |
| `P3` | Cleanup, consistency, readability |

### 3.4 Root-cause clustering

Cluster findings before generating tickets.

Example:

- Eight route errors caused by one missing boundary validation rule should usually become one root-cause cluster.
- A live outage may still require a symptom-level hotfix even if the long-term fix is clustered.

The fix queue should primarily target root causes, not duplicate symptoms.

### 3.5 Fix queue

Use the schema in `docs/audits/AUDIT_OUTPUT_SCHEMA.json`.

Core ticket fields:

- `priority`
- `title`
- `category`
- `issue_type`
- `certainty`
- `evidence`
- `root_cause`
- `proposed_fix`
- `acceptance_criteria`
- `verification_steps`
- `owner_type`
- `dependencies`
- `rollback`

### 3.6 Hotfix mode

Use hotfix mode only for live incidents or active production regressions.

Rules:

1. Reproduce with real evidence.
2. Ship the smallest safe fix.
3. Run focused verification.
4. Deploy and smoke production.
5. Backfill the full audit artifact and history entry within 24 hours.

Hotfix mode does not waive evidence requirements. It changes sequencing.

## 4. LLM Guardrails

### 4.1 Evidence rule

Never assert without evidence.

- Code: cite `file:line`
- Content: cite slug or doc path plus excerpt
- API/system: cite route plus response/log
- Data: cite table, column, sample row or migration

If you cannot cite it, mark it as a hypothesis.

### 4.2 Two-tier certainty

- `Observed`: directly verified in artifacts or runtime
- `Inferred`: pattern-derived, needs confirmation

Observed findings should dominate the fix queue.

### 4.3 Depth calibration

Not every audit should try to find everything.

- `surface`: structure + obvious issues, 30 minutes
- `standard`: logic + edge cases + dependency review, 1-2 hours
- `deep`: line-by-line + threat model + failure modes, half day or more

Declare depth up front and stop when you reach it.

### 4.4 No perfect-plan syndrome

Prefer:

- smallest safe fix over ideal architecture
- incremental hardening over grand refactors
- explicit deferrals over silent omissions

## 5. Prompt Skeleton

```text
SYSTEM:
You are an auditor producing a fix queue.
Rules:
- Never assert without evidence. If you cannot cite it, label it as hypothesis.
- Tag every finding as Observed or Inferred.
- Prefer E0/E1/E2 evidence grading.
- Cluster shared root causes before writing tickets.
- If deployed behavior is in scope, include prod verification.
- Stop at the declared depth.

USER:
Project type: [Next.js app + API / content catalog / data pipeline / mixed]
Audit modes: [Security + Reliability / Maintainability + UX / etc.]
Depth: [surface / standard / deep]
Scope: [explicit list]
Out of scope: [explicit list]
Risk tolerance: [prototype / production / regulated]
Changed since: [git ref or date range]

[Attach files, logs, routes, docs, screenshots as needed]

REQUIRED OUTPUT:
1. Baseline snapshot (10 bullets max)
2. Findings
3. Root cause clusters
4. Fix queue
5. Summary: top 3 risks, top 3 quick wins, what needs human verification
```

## 6. Repo Storage Rules

Canonical audit system files live in `docs/audits/`.

Generated audit outputs should go here:

- `docs/qa/` for dated audit findings and report artifacts
- `docs/03_PROCESS/archive/` for superseded audit outputs that are no longer active references

Do not edit the canonical audit docs every time you run an audit. Update them only when the audit system itself changes.

## 7. Project-Type Playbooks

### Next.js app + API

Start with:

- `app/`
- `components/`
- `hooks/`
- `lib/`
- `supabase/migrations/`

Pay special attention to:

- auth/session boundaries
- service-role usage
- runtime vs local config mismatches
- retry loops and offline sync
- prod smoke coverage after deploy

### Content / narrative

Start with:

- `content/`
- `docs/reference/data-dictionary/`
- PRDs and mechanics docs

Pay special attention to:

- missing field coverage
- content contract drift
- frontend fields defined but not surfaced
- voice/style drift

### Data / guidance / telemetry

Start with:

- telemetry routes
- Supabase schema and migrations
- analytics dictionaries
- admin reporting surfaces

Pay special attention to:

- source-of-truth drift
- payload validation
- export safety
- stale dashboards

### Compliance / consent

Start with:

- consent routes
- admin export routes
- logging surfaces
- tracking scripts

Pay special attention to:

- consent state propagation
- safe logging
- access control
- retention assumptions
