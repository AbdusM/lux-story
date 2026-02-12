# Comprehensive Audit Findings (Read-Only)

Date: 2026-02-12  
Scope: menus, response/dialogue quality, telemetry integrity, narrative progression contracts  
Mode: audit-only (no gameplay/content/code changes made in this pass)

## 1) Evidence Collected

Commands executed (read/verify only):

- `npm run test:run -- tests/components/unified-menu.test.tsx tests/components/prism-tabs.test.tsx tests/components/game-choices-legibility.test.tsx tests/components/game-choices-disabled.test.tsx`
- `npm run verify:analytics-dict`
- `npm run report:dialogue-guidelines`
- `npm run verify:dialogue-guidelines`
- `npm run report:dialogue-external-review`
- `npm run report:character-deep-coverage`
- `npm run verify:narrative-sim`
- `npm run verify:required-state-guarding`
- `npm run verify:unreferenced-dialogue-nodes`
- `npm run verify:unreachable-dialogue-nodes`
- `npm run verify:validate-graphs-info`

## 2) Current System Status

### Passing gates

- Menu/component lane: `4` files, `5` tests passed.
- Analytics contract lane: passed (`6` interaction event types documented + validated).
- In-memory analytics misuse check: passed.
- Dialogue guideline ratchet: passed (`hard_content_issues=0`, `hard_monologue_chains=0`).
- Narrative simulation: passed (`failures=0`, `required_state_mismatches=0`).
- Required-state guarding: passed (`nodes_with_required_state=150`, `unguarded_nodes=0`).
- Unreferenced nodes: passed (`0`).
- Unreachable nodes: passed (`0`).
- Validate-graphs-info ratchet: passed (`baseline=68`, `current=0`).

### Scope + definition locks (to prevent overclaim)

- Reachability/unreferenced gates run against the graph-registry-routable corpus (`DIALOGUE_GRAPHS`, currently 28 graphs), not the entire detached/non-graph/dormant dialogue universe.
- Unreachable-node gate is **structural reachability only**:
  - roots include graph start nodes, known entry nodes, simulation entry roots, and cross-graph links from already-reachable nodes.
  - it does **not** model `requiredState`/condition satisfiability.
- This explains how `unreachable=0` can coexist with older orphan/unreachable debt findings from broader or different-scope reports.
- Dialogue guideline hard/soft labels are deterministic and word-based:
  - block hard cap: `>90` words (Samuel override `>110`), block soft cap: `>35` words.
  - monologue hard cap: `>2` nodes or `>180` words; soft cap: `>2` nodes or `>120` words.
  - sentence overflow (`>3`) is a style signal; seconds estimates are informational only.

### Quantitative quality snapshot

- Dialogue guideline report (`docs/qa/dialogue-guidelines-report.json`):
  - `hardContentIssues=0`
  - `softContentIssues=114`
  - `hardMonologueChains=0`
  - `softMonologueChains=0`
- External review report (`docs/qa/dialogue-external-review-report.json`):
  - `characters=20`
  - `hardContentIssues=0`
  - `hardMonologueChains=0`
  - `reachableHardContentIssues=0`
  - `reachableHardMonologueChains=0`
- Character deep coverage (`docs/qa/character-deep-coverage-report.json`):
  - `characters=20`
  - `riskDistribution: high=0, medium=0, low=20`

## 3) Audit Findings (What is still missing)

### A. Side menu coverage is partial, not complete

Covered now:

- Open/close behavior, unavailable states, reduce-motion toggle, volume/mute controls, route to `/profile`.
- Evidence: `/Users/abdusmuwwakkil/Development/30_lux-story/tests/components/unified-menu.test.tsx:69`, `/Users/abdusmuwwakkil/Development/30_lux-story/tests/components/unified-menu.test.tsx:112`

Not covered yet:

- Authenticated account branch (user avatar/email/role rendering).
- `Sign In` flow opening login modal path.
- `Sign Out` success + error handling path.
- `onShowReport` available-state callback path.
- Active `Clinical Audit` link branch when `playerId` exists.
- Text-size and color-mode option selection behavior + `pushNow` call confirmation.
- Accessibility collapsed-preview text variants (`default` vs customized states).

Risk:

- “Menus work” is true for baseline state, but not fully proven across auth/profile/admin variants.

### B. Prism tab coverage validates core behavior, not full game tab matrix

Covered now:

- ARIA role/tablist/tab selection and content switching.
- Evidence: `/Users/abdusmuwwakkil/Development/30_lux-story/tests/components/prism-tabs.test.tsx:52`

Not covered yet:

- Full in-game tab matrix used in product context (currently broader than the 3-tab harness and does **not** include `Ranks`).
- Keyboard traversal semantics (ArrowLeft/ArrowRight/Home/End).
- Badge rendering changes by tab state.
- Alternate variant behavior beyond `variant="top"`.

Risk:

- Regression can still occur in integrated journal configuration while generic tab primitive tests stay green.

## 3.1) Side Menu + Prism Source-of-Truth Map (for external review)

### Actual runtime surfaces

- `UnifiedMenu` sections (settings flyout): `Audio`, `Accessibility`, `Profile`, `Account`.
  - Source: `/Users/abdusmuwwakkil/Development/30_lux-story/components/UnifiedMenu.tsx:5`
- Prism tabs (`Journal`) currently include:
  - `Harmonics`, `Essence`, `Mastery`, `Careers`, `Combos`, `Opportunities`, `Mind`, `Toolkit`, `Sims`, `Cognition`, `Analysis`
  - Optional: `GOD MODE` (role/dev/query gated)
  - Source: `/Users/abdusmuwwakkil/Development/30_lux-story/components/Journal.tsx:140`
- Note: there is no current runtime `Ranks` tab label found in component source.

### Data dictionary files reviewers should include

- UI structure/metadata: `/Users/abdusmuwwakkil/Development/30_lux-story/docs/reference/data-dictionary/10-ui-metadata.md`
- Career surfaces (Career Profile/Careers tab semantics): `/Users/abdusmuwwakkil/Development/30_lux-story/docs/reference/data-dictionary/11-careers.md`
- Analytics/events (menu + choice telemetry expectations): `/Users/abdusmuwwakkil/Development/30_lux-story/docs/reference/data-dictionary/12-analytics.md`
- Dialogue/choice gating behavior (response locks and progression): `/Users/abdusmuwwakkil/Development/30_lux-story/docs/reference/data-dictionary/05-dialogue-system.md`
- Knowledge/progression flags used by tab/content visibility: `/Users/abdusmuwwakkil/Development/30_lux-story/docs/reference/data-dictionary/07-knowledge-flags.md`
- Trust dependencies affecting unlocked response/relationship behavior: `/Users/abdusmuwwakkil/Development/30_lux-story/docs/reference/data-dictionary/08-trust-system.md`
- Pattern system (Harmonics/Essence alignment + accessibility color semantics): `/Users/abdusmuwwakkil/Development/30_lux-story/docs/reference/data-dictionary/03-patterns.md`
- Character expectations for continuity and memory: `/Users/abdusmuwwakkil/Development/30_lux-story/docs/reference/data-dictionary/04-characters.md`

### Test/docs files reviewers should cross-check with the dictionaries

- `/Users/abdusmuwwakkil/Development/30_lux-story/tests/components/unified-menu.test.tsx`
- `/Users/abdusmuwwakkil/Development/30_lux-story/tests/components/prism-tabs.test.tsx`
- `/Users/abdusmuwwakkil/Development/30_lux-story/tests/components/game-choices-legibility.test.tsx`
- `/Users/abdusmuwwakkil/Development/30_lux-story/tests/components/game-choices-disabled.test.tsx`
- `/Users/abdusmuwwakkil/Development/30_lux-story/docs/testing/e2e-ci-strategy.md`
- `/Users/abdusmuwwakkil/Development/30_lux-story/docs/testing/selector-standards.md`

### C. Response/dialogue quality is contract-safe but still has soft debt

What is good:

- Hard monologue and hard overlength are eliminated in current reports.
- Reachability-weighted hard issues also zero.

What remains:

- `114` soft content issues remain, mostly sentence-overflow style issues.
- Top offenders include `maya_revisit`, `quinn`, `alex`, `rohan`, `devon_revisit`, `yaquin` nodes (from report top-offenders list).

Risk:

- Not a blocker for progression correctness, but still affects perceived naturalness and pacing.

### D. Choice-response telemetry is partially tested

Covered now:

- Disabled choice blocks selection and emits `choice_presented` payload with `is_enabled=false` and `disabled_reason`.
- Evidence: `/Users/abdusmuwwakkil/Development/30_lux-story/tests/components/game-choices-disabled.test.tsx:65`

Not covered yet:

- Broader lock-reason consistency across all lock reason codes.
- End-to-end outcome summaries tied to player-visible feedback.
- Negative-path telemetry behavior under queue/storage failures.

Risk:

- Core contract exists, but observability fidelity under edge cases is not fully proven.

### E. Local E2E constraint remains real

- Strategy is correctly documented as CI-first for Playwright with local deterministic fallback.
- Evidence: `/Users/abdusmuwwakkil/Development/30_lux-story/docs/testing/e2e-ci-strategy.md`

Risk:

- Local browser E2E cannot be relied on in this runtime; CI remains the browser truth source.

### F. Data dictionary + API + narrative Q&A alignment is partial (strong core, gaps in breadth)

What aligns well:

- Canonical telemetry sink is clearly specified and implemented:
  - Spec: `/Users/abdusmuwwakkil/Development/30_lux-story/lib/telemetry/interaction-events-spec.ts:3`
  - API ingest: `/Users/abdusmuwwakkil/Development/30_lux-story/app/api/user/interaction-events/route.ts:1`
  - Dictionary contract: `/Users/abdusmuwwakkil/Development/30_lux-story/docs/reference/data-dictionary/12-analytics.md:456`
- Narrative node/choice/gating schema is documented:
  - `/Users/abdusmuwwakkil/Development/30_lux-story/docs/reference/data-dictionary/05-dialogue-system.md:42`
  - `requiredState` condition model at `/Users/abdusmuwwakkil/Development/30_lux-story/docs/reference/data-dictionary/05-dialogue-system.md:449`
- Runtime emits `choice_presented`, `choice_selected_ui`, and `node_entered` via sync queue:
  - `/Users/abdusmuwwakkil/Development/30_lux-story/components/GameChoices.tsx:823`
  - `/Users/abdusmuwwakkil/Development/30_lux-story/components/GameChoices.tsx:897`
  - `/Users/abdusmuwwakkil/Development/30_lux-story/components/StatefulGameInterface.tsx:1178`
  - `/Users/abdusmuwwakkil/Development/30_lux-story/components/StatefulGameInterface.tsx:1997`

Important gaps:

- `choice_selected_result` is declared in spec/dictionary but no runtime emitter was found in current code scan.
  - Declared: `/Users/abdusmuwwakkil/Development/30_lux-story/lib/telemetry/interaction-events-spec.ts:6`
  - Documented: `/Users/abdusmuwwakkil/Development/30_lux-story/docs/reference/data-dictionary/12-analytics.md:499`
  - Clarification: analytics-dictionary verification currently enforces “documented + known referenced types,” but does not require a runtime emitter per declared type.
- Data dictionary coverage for APIs is narrow:
  - Only `/api/user/interaction-events` is explicitly documented in data dictionary (`12-analytics.md`).
  - Other active user APIs (`/api/user/profile`, `/api/user/relationship-progress`, `/api/user/platform-state`, `/api/user/pattern-profile`, `/api/user/skill-summaries`, `/api/user/career-analytics`, etc.) are implemented but not cataloged in the dictionary set.
- Side-menu + Prism runtime surfaces are not explicitly represented in current data dictionary docs as UI contracts.
- Reciprocity/player self-discovery Q&A schema exists in code but is not explicitly documented in the data dictionary corpus:
  - `/Users/abdusmuwwakkil/Development/30_lux-story/content/player-questions.ts:14`
- Dictionary metadata appears partially stale:
  - `12-analytics.md` still lists `/lib/admin-analytics.ts` in source header.

Risk:

- Reviewers can trust core telemetry invariants, but cannot yet use the data dictionary alone as a full API/UI/narrative contract reference.

## 3.2) API Integration Capability Snapshot (as implemented)

### Player/state + progression APIs

- `/api/user/profile` - create/get player profile
- `/api/user/platform-state` - global flags/current scene/pattern snapshots
- `/api/user/relationship-progress` - per-character trust + status progression

### Behavioral evidence + analytics APIs

- `/api/user/interaction-events` - canonical event sink (choice/node/experiment/deadlock telemetry)
- `/api/user/pattern-demonstrations` + `/api/user/pattern-profile`
- `/api/user/skill-demonstrations` + `/api/user/skill-summaries`
- `/api/user/career-analytics` + `/api/user/career-explorations`
- `/api/user/action-plan`

### Narrative generation capability

- `/api/samuel-dialogue` + client engine `/lib/samuel-dialogue-engine.ts` for skill-aware dynamic Samuel responses

## 3.3) Narrative Q&A Alignment (questions/answers)

### Structural alignment (good)

- Dialogue graph questions/answers are represented as `choices` on nodes with state gating (`requiredState`) and conditional visibility/enabling.
- Choice presentation/selection is telemetry-linked (`choice_presented` ↔ `choice_selected_ui`) with index/ordering metadata for analysis.

### Contract alignment gaps

- Reciprocity Q&A system (`questionId`, `choices`, `npcResponse`, `stateChanges`) is code-defined but not dictionary-defined as a first-class contract.
- UI contract docs do not currently formalize how side-menu/Prism sections should represent progression state for narrative Q&A outcomes.

## 3.4) Recommended New Gates (regression-first)

1. Telemetry emitter parity gate:
   - fail/warn when an event is declared+documented but has no runtime emitter in non-test app code, unless explicitly marked `planned`.
2. Prism runtime tab snapshot gate:
   - snapshot/contract test for actual runtime tab set (to avoid drift between primitive tab tests and product config).
3. Menu auth-branch smoke gate:
   - deterministic fixture matrix for guest/user/admin/playerId-present branches.
4. Soft-dialogue ratchet for target graphs:
   - no regressions first; paydown targets second.

## 4) Priority Recommendations (Review-Only, no changes applied)

1. Resolve/clarify `choice_selected_result` emitter parity and add automated parity check.
2. Expand side-menu tests to cover auth/account/profile/admin branches in `UnifiedMenu`.
3. Add integrated Prism runtime-tab matrix/snapshot test matching current game usage.
4. Add telemetry resilience tests for queue/storage failover behavior.
5. Add response-quality soft-issue ratchet by top-offender graphs (regression-only first).

## 5) Direct Answer to Current Question

Yes, we should run similar checks on side menus and responses beyond what is already present.

- Side menus: partially covered, not comprehensive yet.
- Responses/dialogue: hard-quality risks are controlled, but soft-quality and response-legibility coverage still needs expansion.
- These gates prove structural correctness and prevent hard regressions; they do not yet prove full UX completeness across all auth roles, full Prism configuration, or telemetry resilience under storage/network failures.

## 6) Note on Execution Environment

During this session, repeated warnings appeared about max unified exec processes in the tooling environment. This is an agent-runtime constraint, not an app gameplay/runtime defect.
