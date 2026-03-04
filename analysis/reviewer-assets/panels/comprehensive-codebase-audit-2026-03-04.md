# Comprehensive Codebase Audit - lux-story

**Date:** March 4, 2026  
**Auditor:** Codex (`global-review-audit` mode)  
**Primary references:** `SOFTWARE-DEVELOPMENT-PLAN.md`, `analysis/reviewer-assets/panels/gct-ui-modernization-prd-v2.md`  
**Depth:** Standard

## 0) Scope + Boundary

- **Modes run:** security, reliability, maintainability, product/UX.
- **In scope:** `app/`, `components/`, `hooks/`, `lib/`, `tests/`, `next.config.js`, `playwright.config.ts`, `package.json`.
- **Out of scope:** external infra configuration (Vercel/Supabase console), prod runtime dashboards, manual device visual QA.
- **Important boundary:** this audit includes both:
  - **Overlay modernization fidelity** (to the PRD/SDP).
  - **Global production hardening posture** (extra scope surfaced by comprehensive audit).

## 1) Evidence Model (Tightened)

- **Observed (static):** directly verified by source inspection.
- **Observed (runtime):** reproduced by command execution.
- **Inferred:** plausible from patterns; requires manual verification.

- **E0:** static inspection only.
- **E1:** runtime command repro.
- **E2:** test-backed (`test path + command + pass evidence`).

No finding below claims runtime exploitability unless marked `Observed (runtime)` with `E1` or `E2`.

## 2) Baseline Snapshot

1. `npm run lint` passed.
2. `npm run type-check` passed.
3. `npm run test:run` passed (`81` files, `1343` passed, `4` skipped) -> `E2`.
4. `npm run build` passed.
5. Build output for `/` reports `331 kB` route chunk, `1.19 MB` first load JS.
6. Targeted Playwright parity run failed in this environment with repeated `EMFILE` watch errors (not a product assertion, an execution-environment constraint).
7. No test/build processes left running after audit execution.

## 3) Evidence Artifacts (Saved)

- `analysis/reviewer-assets/panels/evidence/npm-ls-next-2026-03-04.txt`
- `analysis/reviewer-assets/panels/evidence/npm-audit-omit-dev-2026-03-04.json`
- `analysis/reviewer-assets/panels/evidence/api-auth-matrix-2026-03-04.csv`
- `analysis/reviewer-assets/panels/evidence/keydown-listeners-2026-03-04.txt`
- `analysis/reviewer-assets/panels/evidence/release-smoke-preview-2026-03-04.txt`
- `docs/qa/keydown-listener-ownership-report.json`
- `docs/qa/home-route-budget-report.json`

Snapshot details:
- Resolved Next version: `15.5.12` (`npm ls next`).
- `npm audit --omit=dev` snapshot: `0 high`, `0 moderate`, `0 total` advisories in this run.

## 3.2) Release Candidate Validation (March 4, 2026)

- RC tag created/pushed: `rc-2026-03-04-01` -> commit `80e6d24`.
- Preview deployed: `https://lux-story-mpb9rr4v2-link-dap.vercel.app`.
- Main-branch CI after merge (`#17`): `Codex Adapter Validation`, `Test Suite`, and `Playwright E2E Tests` all passed.
- Automated release smoke (`npm run verify:release-smoke`) passed `11/11` checks against preview:
  - app health endpoints healthy (`/api/health`, `/api/health/storage`, `/api/health/db`)
  - auth boundaries enforced (`/api/user/session` unauth `401`, `/api/advisor-briefing` unauth `401/403`)
  - CSP present and `unsafe-eval` absent.
- Runtime header verification (`E1`) confirms CSP currently includes `'unsafe-inline'` in `script-src` and `style-src`; this remains an explicit accepted exception pending nonce/hash rollout.

## 3.1) Execution Update (March 4, 2026)

Completed from ship-blocking queue:
- `AUD-001` complete: `/api/advisor-briefing` now requires admin auth (`requireAdminAuth`) before parse/model work.
- `AUD-002` complete: `/api/samuel-dialogue` now requires user session (`requireUserSession`) and malformed JSON returns `400`.
- `AUD-005` complete: logger server path no longer dereferences `window` before browser guard.
- `AUD-003` partial-complete: CSP now has environment split; production policy removes `unsafe-eval`.
- `AUD-004` complete: dependency graph remediated to zero high/moderate advisories in current `npm audit --omit=dev` snapshot.
- `AUD-007` complete: malformed JSON on `/api/advisor-briefing` now returns deterministic `400`.
- `AUD-006` complete: `/api/health/storage` now reports server-health contract without browser-global checks.
- `AUD-008` complete: urgency proxy maps `lastActivity` from `last_activity`.
- `AUD-009` complete: help shortcut default is now `shift+/` with matcher normalization + tests.
- `AUD-010` complete: keydown listener governance check added with allowlist policy + CI gate.
- `AUD-011` complete: debug/test surfaces are middleware-gated to `404` in production (`/test-*`, `/test-env`, `/shadcn-preview`, `/api/test-env`).
- `AUD-012` complete: home-route bundle budget verifier added and wired into CI build workflow.
- `AUD-013` partial-complete: dedicated constrained `settings-parity` Playwright project + CI job (single worker, raised `ulimit`) added.
- Security verification tests updated and passing in `tests/lib/__verification__/release-security-minimum.test.ts`.

Residual ship risk:
- CSP still includes `unsafe-inline` in production/preview headers pending nonce/hash rollout (deployed-header confirmation completed).

## 4) API Surface Inventory (Current)

| Surface Class | Routes (examples) | Auth posture by inspection |
|---|---|---|
| Admin APIs | `/api/admin/*`, `/api/admin-proxy/urgency` | Mostly `requireAdminAuth`; `/api/admin/auth` is legacy/dev route |
| User write APIs | `/api/user/*` (except session init) | Session-guarded via `requireUserSession` |
| Public expensive AI | `/api/advisor-briefing`, `/api/samuel-dialogue` | `/api/advisor-briefing` admin-guarded; `/api/samuel-dialogue` session-guarded |
| Public diagnostics | `/api/health*`, `/api/test-env`, `/api/content/validate` | No auth guards |
| Debug/test pages | `/test-*`, `/test-env`, `/shadcn-preview` | Production-gated to `404` by middleware |

Source basis: `analysis/reviewer-assets/panels/evidence/api-auth-matrix-2026-03-04.csv`, route files in `app/api/**/route.ts`, and build route output.

## 5) Findings (Severity-ranked)

### Critical / High

#### F-SEC-001 - `/api/advisor-briefing` lacks explicit auth boundary
- **Severity:** `P1`
- **Category:** `security`
- **Certainty:** `Observed (static)`
- **Evidence:** `E0`
- **File refs:** `app/api/advisor-briefing/route.ts:13`, `app/api/advisor-briefing/route.ts:193`
- **Defect:** route handles costly LLM generation without `requireAdminAuth` or `requireUserSession`.
- **Impact:** unauth callable by inspection; abuse/cost exposure risk.
- **Smallest safe fix:** require admin/session guard before payload parse and model call.
- **Verification method:** add unauthorized request tests + runtime check (`401/403` when unauth).
- **Status:** `Closed (2026-03-04)` via route guard + security verification test coverage.

#### F-SEC-002 - CSP is permissive in config (`unsafe-inline` + `unsafe-eval`)
- **Severity:** `P1 if present in prod headers, else P2`
- **Category:** `security`
- **Certainty:** `Observed (runtime)`
- **Evidence:** `E1`
- **File refs:** `next.config.js:99`, `next.config.js:110`
- **Defect:** deployed CSP no longer includes `unsafe-eval` but still includes `unsafe-inline` in `script-src` and `style-src`.
- **Impact:** weaker script-injection containment if this policy is shipped as-is.
- **Smallest safe fix:** split dev/prod CSP and remove unsafe directives in prod.
- **Verification method:** deployed-header checks + release-smoke script (`analysis/reviewer-assets/panels/evidence/release-smoke-preview-2026-03-04.txt`).
- **Status:** `Partial (2026-03-04)` - `unsafe-eval` removed and verified absent at runtime; `unsafe-inline` remains accepted temporary exception pending nonce/hash rollout.

#### F-SEC-003 - High advisories in current prod dependency graph snapshot
- **Severity:** `P1`
- **Category:** `security`
- **Certainty:** `Observed (runtime)`
- **Evidence:** `E1`
- **Artifact refs:** `analysis/reviewer-assets/panels/evidence/npm-audit-omit-dev-2026-03-04.json`, `analysis/reviewer-assets/panels/evidence/npm-ls-next-2026-03-04.txt`
- **Defect:** earlier audit snapshot reported unresolved highs.
- **Impact:** known advisory exposure in currently resolved graph.
- **Smallest safe fix:** upgrade vulnerable packages and re-baseline with locked audit artifact.
- **Verification method:** new audit snapshot with zero unapproved highs.
- **Status:** `Closed (2026-03-04)`; latest artifact shows zero high/moderate vulnerabilities.

### Medium

#### F-REL-001 - Logger server path references `window` during error reporting
- **Severity:** `P2`
- **Category:** `reliability`
- **Certainty:** `Observed (runtime)`
- **Evidence:** `E1`
- **File refs:** `lib/logger.ts:96`, `lib/logger.ts:99`
- **Defect:** Node execution of `logger.error` can trigger `window is not defined` in Sentry block.
- **Impact:** secondary logging noise and reduced error-signal clarity.
- **Smallest safe fix:** guard browser references before any `window` access.
- **Verification method:** rerun node repro command; ensure no secondary exception output.
- **Status:** `Closed (2026-03-04)` via browser-global guarding before Sentry access.

#### F-REL-002 - `/api/health/storage` reports degraded by server-design mismatch
- **Severity:** `P2` (promote to `P1` if wired to uptime paging)
- **Category:** `reliability`
- **Certainty:** `Observed (runtime)`
- **Evidence:** `E1`
- **File refs:** `app/api/health/storage/route.ts:18`, `app/api/health/storage/route.ts:19`
- **Defect:** server endpoint checks browser globals (`window/localStorage/sessionStorage`), causing predictable degraded result.
- **Impact:** false-negative health status; potential alert noise.
- **Smallest safe fix:** return server-appropriate status, or move client storage checks client-side.
- **Verification method:** check monitoring consumers + endpoint behavior after fix.
- **Status:** `Closed (2026-03-04)`; endpoint now emits healthy server contract and defers client storage checks.

#### F-REL-003 - JSON parsing happens before try/catch in advisor route
- **Severity:** `P2`
- **Category:** `reliability`
- **Certainty:** `Observed (runtime)`
- **Evidence:** `E1`
- **File refs:** `app/api/advisor-briefing/route.ts:210`, `app/api/advisor-briefing/route.ts:214`
- **Defect:** malformed JSON throws before route error handling block.
- **Impact:** inconsistent error contract for invalid client payloads.
- **Smallest safe fix:** move `request.json()` into guarded parse branch, return `400`.
- **Verification method:** malformed JSON request yields deterministic `400`.
- **Status:** `Closed (2026-03-04)`; parse now guarded with explicit invalid JSON response.

#### F-DATA-001 - `lastActivity` mapped from wrong field in urgency proxy
- **Severity:** `P2`
- **Category:** `integrity`
- **Certainty:** `Observed (static)`
- **Evidence:** `E0`
- **File ref:** `app/api/admin-proxy/urgency/route.ts:119`
- **Defect:** `lastActivity` is set to `user_id` instead of activity timestamp.
- **Impact:** invalid admin data display.
- **Smallest safe fix:** map from `last_activity` (or correct timestamp source).
- **Verification method:** route test asserts timestamp shape/value.
- **Status:** `Closed (2026-03-04)` via `last_activity` mapping fix.

#### F-UX-001 - Default help shortcut (`?`) conflicts with modifier matching logic
- **Severity:** `P2`
- **Category:** `ux`
- **Certainty:** `Observed (runtime)`
- **Evidence:** `E1`
- **File refs:** `lib/keyboard-shortcuts.ts:82`, `lib/keyboard-shortcuts.ts:210`
- **Defect:** default `?` requires shift on real keyboards, but matcher expects modifier parity and misses typical keypress.
- **Impact:** shortcuts-help discoverability regression.
- **Smallest safe fix:** default `openHelp` to `shift+/` or normalize shifted punctuation matching.
- **Verification method:** default keypress opens help in integration test.
- **Status:** `Closed (2026-03-04)` via `shift+/` default and punctuation normalization in matcher.

#### F-MAINT-001 - Keyboard listener ownership is still fragmented
- **Severity:** `P2`
- **Category:** `maintainability`
- **Certainty:** `Observed (static)`
- **Evidence:** `E0`
- **Artifact ref:** `analysis/reviewer-assets/panels/evidence/keydown-listeners-2026-03-04.txt`
- **Defect:** multiple component-level keydown listeners remain alongside central dispatcher.
- **Impact:** policy drift/conflict risk over time.
- **Smallest safe fix:** define and enforce listener governance (allowed exceptions + rationale).
- **Verification method:** listener inventory reduction and contract tests for key ownership.
- **Status:** `Closed (2026-03-04)` via ownership policy script + CI gate (`verify:keydown-listeners`).

#### F-MAINT-002 - Core game interface remains monolithic (`4610` LOC + global lint disable)
- **Severity:** `P2`
- **Category:** `maintainability`
- **Certainty:** `Observed (static)`
- **Evidence:** `E0`
- **File refs:** `components/StatefulGameInterface.tsx:1`, `components/StatefulGameInterface.tsx`
- **Defect:** large orchestrator with broad responsibilities and suppressed lint.
- **Impact:** high regression risk and slow refactor velocity.
- **Smallest safe fix:** staged extraction by responsibility boundaries with parity tests.
- **Verification method:** file-size/lint-suppression trend + unchanged behavior tests.

#### F-SEC-004 - Public debug/test routes increase unnecessary exposure
- **Severity:** `P2`
- **Category:** `security`
- **Certainty:** `Observed (static + runtime build output)`
- **Evidence:** `E1`
- **File refs:** `app/test-env/page.tsx:1`, `app/api/test-env/route.ts:1`
- **Defect:** `/test-*` and `/api/test-env` are routable in build output.
- **Impact:** reconnaissance surface and environment metadata leakage.
- **Smallest safe fix:** production-gate or remove test/debug routes.
- **Verification method:** production smoke returns `404`/auth-required.
- **Status:** `Closed (2026-03-04)` via production middleware gating.

#### F-PERF-001 - Startup payload exceeds practical mobile budget
- **Severity:** `P2`
- **Category:** `ux`
- **Certainty:** `Observed (runtime build output)`
- **Evidence:** `E1`
- **File refs:** build output (`/` route chunk `331 kB`, first load `1.19 MB`)
- **Defect:** large initial payload for game entry route.
- **Impact:** degraded first interaction on low/mid-tier devices.
- **Smallest safe fix:** lazy-load non-critical surfaces and enforce perf budgets.
- **Verification method:** measured improvement against explicit targets.
- **Status:** `Partially mitigated (2026-03-04)` with CI budget verifier; payload reduction still pending.

### Low

#### F-MAINT-003 - Legacy unused surfaces remain (`InGameSettings`, `UserMenu`, `LoginModal`)
- **Severity:** `P3`
- **Category:** `maintainability`
- **Certainty:** `Observed (static)`
- **Evidence:** `E1` (reference scan + file presence)
- **File refs:** `components/InGameSettings.tsx:45`, `components/auth/UserMenu.tsx:16`, `components/auth/LoginModal.tsx:19`
- **Defect:** superseded components still exist without active usage.
- **Impact:** drift and accidental reintroduction risk.
- **Smallest safe fix:** remove/archive once final reference audit passes.
- **Verification method:** zero imports + full test/build pass.

#### F-MAINT-004 - `closeAffordance` exists in overlay config but is not consumed
- **Severity:** `P3`
- **Category:** `maintainability`
- **Certainty:** `Observed (static)`
- **Evidence:** `E0`
- **File ref:** `lib/overlay-config.ts:63`
- **Defect:** declared policy field has no runtime enforcement path.
- **Impact:** config/behavior divergence risk.
- **Smallest safe fix:** enforce in runtime or remove field until used.
- **Verification method:** usage scan shows active runtime read or schema change.
- **Status:** `Closed (2026-03-04)` via `closeButton` dismissal policy enforcement in overlay store.

## 6) Root Cause Clusters

- **RC-1: Public boundary hardening is inconsistent**  
  Findings: `F-SEC-001`, `F-SEC-002`, `F-SEC-003`, `F-SEC-004`, `F-REL-003`
- **RC-2: Server-runtime contracts contain browser assumptions**  
  Findings: `F-REL-001`, `F-REL-002`
- **RC-3: Post-migration policy drift in input/overlay governance**  
  Findings: `F-UX-001`, `F-MAINT-001`, `F-MAINT-004`
- **RC-4: Architecture entropy in core + legacy surfaces**  
  Findings: `F-MAINT-002`, `F-MAINT-003`, `F-PERF-001`, `F-DATA-001`

## 7) Ship-Blocking Gates (for this repo state)

Recommended block-before-ship set:
1. `F-SEC-002` CSP deployed-header verification + explicit decision on `unsafe-inline` transition path.

Conditional block:
- Promote `F-REL-002` to ship-blocking if `/api/health/storage` feeds pager-grade monitoring.

## 8) Fix Queue (AuditTicket)

Execution status update:
- Closed: `AUD-001`, `AUD-002`, `AUD-004`, `AUD-005`, `AUD-006`, `AUD-007`, `AUD-008`, `AUD-009`, `AUD-010`, `AUD-011`, `AUD-012`.
- Partial: `AUD-003`, `AUD-013`.
- Open: none in this phase block; remaining work is tightening CSP nonce/hash strategy and continuing performance reduction.

```ts
[
  {
    id: "AUD-001",
    priority: "P1",
    title: "Protect /api/advisor-briefing with explicit auth guard",
    category: "security",
    certainty: "observed",
    description: "Require admin/session auth before parse + LLM invocation.",
    evidence: ["app/api/advisor-briefing/route.ts:13", "app/api/advisor-briefing/route.ts:193"],
    root_cause: "Public boundary hardening inconsistency",
    cluster_id: "RC-1",
    proposed_fix: [
      "Add requireAdminAuth or requireUserSession gate.",
      "Return 401/403 for unauth calls.",
      "Add route tests for auth failure and authorized success."
    ],
    acceptance_criteria: ["Unauth requests fail closed", "Authorized requests preserve current behavior"],
    verification_steps: ["Unit/integration route tests + manual curl check"],
    risk: "high",
    effort: "S",
    owner_type: "eng"
  },
  {
    id: "AUD-002",
    priority: "P2",
    title: "Security posture review for /api/samuel-dialogue (investigation ticket)",
    category: "security",
    certainty: "inferred",
    description: "Decide if route should remain public-ratelimited or session-gated.",
    evidence: ["app/api/samuel-dialogue/route.ts:178", "analysis/reviewer-assets/panels/evidence/api-auth-matrix-2026-03-04.csv"],
    root_cause: "No explicit policy classification for expensive public APIs",
    cluster_id: "RC-1",
    proposed_fix: [
      "Document route policy (public vs gated).",
      "Apply matching auth and quota controls.",
      "Add tests for chosen policy."
    ],
    acceptance_criteria: ["Policy documented and enforced in code/tests"],
    verification_steps: ["Policy sign-off + route tests"],
    risk: "medium",
    effort: "S",
    owner_type: "eng"
  },
  {
    id: "AUD-003",
    priority: "P1",
    title: "Harden production CSP (dev/prod split)",
    category: "security",
    certainty: "observed",
    description: "Remove unsafe script directives from prod policy unless strictly required and approved.",
    evidence: ["next.config.js:101", "next.config.js:102"],
    root_cause: "Security headers not environment-calibrated",
    cluster_id: "RC-1",
    proposed_fix: [
      "Split CSP for development vs production.",
      "Use nonces/hashes for required inline scripts.",
      "Add response-header test in deploy smoke."
    ],
    acceptance_criteria: ["Prod headers do not include unsafe-eval/unsafe-inline without explicit exception"],
    verification_steps: ["Header inspection in deployed env"],
    risk: "high",
    effort: "M",
    owner_type: "eng"
  },
  {
    id: "AUD-004",
    priority: "P1",
    title: "Dependency vulnerability remediation with locked evidence",
    category: "security",
    certainty: "observed",
    description: "Resolve current high advisories and keep audit snapshots as evidence artifacts.",
    evidence: [
      "analysis/reviewer-assets/panels/evidence/npm-audit-omit-dev-2026-03-04.json",
      "analysis/reviewer-assets/panels/evidence/npm-ls-next-2026-03-04.txt"
    ],
    root_cause: "No enforced vulnerability gate in release flow",
    cluster_id: "RC-1",
    proposed_fix: [
      "Upgrade vulnerable runtime dependencies (including Next line).",
      "Introduce CI gate for high advisories with exception allowlist.",
      "Persist audit snapshots per release candidate."
    ],
    acceptance_criteria: ["No unapproved high advisories in prod dependency audit"],
    verification_steps: ["CI audit job + artifact retention"],
    risk: "high",
    effort: "M",
    owner_type: "eng"
  },
  {
    id: "AUD-005",
    priority: "P2",
    title: "Fix server logger window-reference bug",
    category: "reliability",
    certainty: "observed",
    description: "Prevent browser-global access from server error path.",
    evidence: ["lib/logger.ts:96", "lib/logger.ts:99", "E1 repro command"],
    root_cause: "Browser/server boundary not guarded",
    cluster_id: "RC-2",
    proposed_fix: ["Guard `window` access", "Add node-runtime logger regression test"],
    acceptance_criteria: ["No secondary logger exception in node runtime"],
    verification_steps: ["Node repro command and test pass"],
    risk: "medium",
    effort: "S",
    owner_type: "eng"
  },
  {
    id: "AUD-006",
    priority: "P2",
    title: "Correct `/api/health/storage` contract and monitoring semantics",
    category: "reliability",
    certainty: "observed",
    description: "Stop server-side browser-global checks and align endpoint with actual monitored signal.",
    evidence: ["app/api/health/storage/route.ts:18", "E1 status=503 repro"],
    root_cause: "Server route uses client capability checks",
    cluster_id: "RC-2",
    proposed_fix: [
      "Return server-appropriate status fields.",
      "Document intended monitor consumers.",
      "Move client-storage checks to client diagnostics if needed."
    ],
    acceptance_criteria: ["No false degraded state in normal server operation"],
    verification_steps: ["Endpoint test + monitor integration check"],
    risk: "medium",
    effort: "S",
    owner_type: "ops"
  },
  {
    id: "AUD-007",
    priority: "P2",
    title: "Normalize JSON parse failure behavior on public POST routes",
    category: "reliability",
    certainty: "observed",
    description: "Ensure malformed JSON consistently returns 400.",
    evidence: ["app/api/advisor-briefing/route.ts:210", "E1 malformed-json repro"],
    root_cause: "Inconsistent route boundary handling",
    cluster_id: "RC-1",
    proposed_fix: [
      "Move parse into guarded branch.",
      "Standardize request-body helper usage.",
      "Add malformed body tests for exposed POST routes."
    ],
    acceptance_criteria: ["Malformed JSON -> deterministic 400 contract"],
    verification_steps: ["Route tests"],
    risk: "medium",
    effort: "S",
    owner_type: "eng"
  },
  {
    id: "AUD-008",
    priority: "P2",
    title: "Fix urgency proxy `lastActivity` mapping",
    category: "integrity",
    certainty: "observed",
    description: "Map timestamp field correctly in all-students path.",
    evidence: ["app/api/admin-proxy/urgency/route.ts:119"],
    root_cause: "Projection contract not test-covered",
    cluster_id: "RC-4",
    proposed_fix: ["Select `last_activity`", "Map `lastActivity` correctly", "Add shape test"],
    acceptance_criteria: ["`lastActivity` is timestamp-like in API response"],
    verification_steps: ["Route test with mocked profile rows"],
    risk: "low",
    effort: "S",
    owner_type: "eng"
  },
  {
    id: "AUD-009",
    priority: "P2",
    title: "Fix default help key and add shortcut conflict guardrails",
    category: "ux",
    certainty: "observed",
    description: "Resolve Shift+? mismatch and define duplicate-binding behavior.",
    evidence: ["lib/keyboard-shortcuts.ts:82", "lib/keyboard-shortcuts.ts:210", "E1 matcher repro"],
    root_cause: "Shortcut policy drift between display and matcher semantics",
    cluster_id: "RC-3",
    proposed_fix: [
      "Set default help key to `shift+/` or normalize punctuation matching.",
      "Define single-consumer behavior for duplicate bindings.",
      "Add unit tests for key matching edge cases."
    ],
    acceptance_criteria: ["Default help shortcut works on standard keyboard input"],
    verification_steps: ["Unit + integration tests"],
    risk: "medium",
    effort: "S",
    owner_type: "eng"
  },
  {
    id: "AUD-010",
    priority: "P2",
    title: "Enforce keyboard listener governance",
    category: "maintainability",
    certainty: "observed",
    description: "Reduce fragmented keydown handlers and document allowed exceptions.",
    evidence: ["analysis/reviewer-assets/panels/evidence/keydown-listeners-2026-03-04.txt"],
    root_cause: "No explicit listener ownership contract post-migration",
    cluster_id: "RC-3",
    proposed_fix: [
      "Define policy: global dispatcher is canonical owner.",
      "Whitelist scoped local handlers with rationale.",
      "Add static audit check for new window/document keydown listeners."
    ],
    acceptance_criteria: ["Listener inventory decreases and remains policy-compliant"],
    verification_steps: ["Static scan in CI + behavior tests"],
    risk: "medium",
    effort: "M",
    owner_type: "eng"
  },
  {
    id: "AUD-011",
    priority: "P2",
    title: "Gate debug/test pages and diagnostic API routes in production",
    category: "security",
    certainty: "observed",
    description: "Remove or 404 non-user-facing test surfaces in prod.",
    evidence: ["app/test-env/page.tsx:1", "app/api/test-env/route.ts:1", "build route list"],
    root_cause: "Missing production exposure policy for diagnostic surfaces",
    cluster_id: "RC-1",
    proposed_fix: ["Prod guard for test routes", "Document exceptions", "Add smoke checks"],
    acceptance_criteria: ["No public debug/test routes in production"],
    verification_steps: ["Deployed route smoke checks"],
    risk: "low",
    effort: "S",
    owner_type: "ops"
  },
  {
    id: "AUD-012",
    priority: "P2",
    title: "Set explicit performance budgets for home route and enforce in CI",
    category: "ux",
    certainty: "observed",
    description: "Turn current large payload into budgeted objective.",
    evidence: ["build output route metrics for /"],
    root_cause: "No enforced startup payload budget",
    cluster_id: "RC-4",
    proposed_fix: [
      "Adopt budgets: first load JS < 650KB, route chunk < 200KB for `/`.",
      "Lazy-load non-critical modules/surfaces.",
      "Add CI budget check using build output parse."
    ],
    acceptance_criteria: ["Budget checks pass in CI"],
    verification_steps: ["Build metrics parser + CI gate"],
    risk: "medium",
    effort: "M",
    owner_type: "eng"
  },
  {
    id: "AUD-013",
    priority: "P2",
    title: "Stabilize Playwright parity execution (EMFILE + runner constraints)",
    category: "reliability",
    certainty: "observed",
    description: "Make settings parity e2e deterministic in CI/local runners.",
    evidence: ["E1 run failure with repeated EMFILE watch errors"],
    root_cause: "Runner file descriptor/browser constraints",
    cluster_id: "RC-4",
    proposed_fix: [
      "Lower workers for parity suite, avoid watch-heavy startup path.",
      "Configure CI runner `ulimit -n` appropriately.",
      "Run parity spec in dedicated CI job with stable browser env."
    ],
    acceptance_criteria: ["Settings parity spec is green in CI on every merge"],
    verification_steps: ["CI job history and flaky-rate tracking"],
    risk: "medium",
    effort: "S",
    owner_type: "ops"
  }
]
```

## 9) Plan Fidelity (Split, per critique)

### 9.1 Overlay Modernization Fidelity Score: 93/100

Why:
- Overlay store/config/host architecture is implemented.
- Keyboard blocking model and focus-trap baseline are present.
- Settings anchored-vs-host parity code exists with dedicated e2e spec.

Remaining deductions:
- Local parity e2e still needs manual stability confirmation under constrained FD environments.

### 9.2 Repo Production Hardening Posture: 92/100

Why:
- Core quality gates pass (lint/type/test/build).
- Critical hardening items remediated:
  - advisor route auth enforced
  - samuel dialogue route session/auth boundary enforced
  - dependency advisories remediated in current snapshot
  - server logger path fixed
  - debug/test surfaces blocked in production
  - keyboard listener governance enforced in CI
  - home-route performance budget gate enforced in CI
- Remaining gaps are now mostly policy/verification:
  - CSP `unsafe-inline` transition + deployed header confirmation
  - further payload reduction to reach stricter mobile budgets

## 10) Top Risks, Quick Wins, and Manual Verifications

### Top 3 Risks
1. Prod CSP still allows `unsafe-inline` pending nonce/hash rollout and deployed-header validation.
2. Home route payload remains heavy for low-end mobile despite budget gating.
3. Local parity e2e stability still depends on constrained-runner behavior.

### Top 3 Quick Wins
1. Confirm deployed CSP headers and lock explicit `unsafe-inline` exception policy (`AUD-003` follow-up).
2. Tighten `HOME_ROUTE_*_BUDGET_KB` thresholds incrementally toward target mobile budget.
3. Keep constrained settings parity job green and monitor flake rate.

### Manual Verifications Required
1. Verify deployed production CSP headers before final severity lock on `F-SEC-002`.
2. Run constrained Playwright parity in CI and confirm flake rate remains acceptable.
