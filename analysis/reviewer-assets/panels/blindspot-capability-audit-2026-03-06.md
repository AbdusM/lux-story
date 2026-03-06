# Blindspot Capability Audit

Date: 2026-03-06
Scope: codebase capability audit against shipped runtime behavior, data dictionary claims, and patent-claim surfaces.

## Execution Update

Status after implementation pass on 2026-03-06:
- Finding 1 remediated in the verification lane:
  - `tests/content/pilot-readiness.test.ts` now reports shipped graph counts from `DIALOGUE_GRAPHS`.
  - `tests/content/vulnerability-arcs.test.ts` now distinguishes raw authoring coverage from shipped high-trust runtime coverage.
  - `tests/content/shipped-runtime-coverage.test.ts` now asserts quarantined nodes stay out of shipped graphs and runtime-routed simulation setup nodes remain present.
  - `scripts/verify-quarantine-list.ts` now excludes the 10 phase-2/3 setup nodes that are entered through runtime simulation routing.
- Finding 2 remediated for the dashboard/report visualization lane:
  - canonical helper added at `lib/canonical-career-analysis.ts`
  - dashboard/report/network surfaces now use canonical 2030-skill matching instead of cross-schema legacy casts
  - direct coverage added in `tests/lib/canonical-career-analysis.test.ts`
- Finding 3 materially remediated at the export layer:
  - `app/api/admin/research-export/route.ts` now reads from the normalized analytics schema instead of the stale mock-only `player_profiles` shape
  - cohort, individual, and longitudinal export modes now have explicit contracts
  - identified individual exports now fail closed unless `research_participant_consents` grants the required consent scope
  - identified longitudinal exports now require `full_research` consent rather than the weaker single-user export grant
  - persisted consent support added in `supabase/migrations/022_research_participant_consents.sql`
  - `app/api/user/research-consent/route.ts` now gives players a session-scoped consent read/write path and bootstraps missing `player_profiles` records before save
  - `app/profile/page.tsx` and `components/settings/SettingsMenuContents.tsx` now expose a user-facing research participation workflow
  - direct route coverage expanded in `tests/api/admin-research-export.test.ts`
  - direct user-route coverage added in `tests/api/user-research-consent.test.ts`
- Finding 4 remains open. Thought internalization still needs a larger typed/model pass.

## Findings

### 1. High: Release-facing content verification still overstates shipped narrative capability

Evidence:
- Shipped graphs exclude quarantined draft nodes by default in `content/drafts/draft-filter.ts`.
- Content tests still validate raw `*DialogueNodes` arrays rather than shipped filtered maps.
- Fresh raw-graph reachability reported `417` unreachable nodes after running `NEXT_PUBLIC_INCLUDE_DRAFT_CONTENT=true npm run verify:unreachable-dialogue-nodes`.
- The committed quarantine snapshot currently excludes `407` nodes, including many reflection/vulnerability slices.
- `npm run test:run -- tests/content/vulnerability-arcs.test.ts tests/content/pilot-readiness.test.ts` still passed `65/65`, and the pilot test reported `819` nodes across 7 characters.
- After regenerating the raw unreachable report, `scripts/verify-quarantine-list.ts` still failed on 10 missing setup nodes (`dante/devon/isaiah/jordan/nadia` phase 2/3 setup nodes), which indicates the reachability model does not fully understand shipped simulation routing.

Impact:
- CI can report strong content readiness while shipped builds still exclude large capability slices.
- Manual pilot/readiness conclusions can be materially more optimistic than production runtime behavior.
- Data-dictionary and patent-adjacent claims about trust depth, reflections, and simulation progression are not cleanly enforced by the current verification lane.

Primary references:
- `content/drafts/draft-filter.ts`
- `content/drafts/quarantined-node-ids.ts`
- `tests/content/vulnerability-arcs.test.ts`
- `tests/content/pilot-readiness.test.ts`
- `docs/qa/unreachable-dialogue-nodes-report.json`

Recommended fix:
1. Add shipped-runtime parity tests that exercise `DIALOGUE_GRAPHS` or `buildDialogueNodesMap(...)`, not raw node arrays.
2. Split verification into two explicit lanes:
   - raw-authoring completeness
   - shipped-runtime reachability
3. Patch the unreachable-node verifier so simulation setup routing is modeled correctly before using it as quarantine truth.

Evidence grade: E2

### 2. High: Career analysis is fragmented across incompatible skill/career schemas

Evidence:
- The live game store exposes a small camelCase skill surface in `lib/game-store.ts`.
- `lib/assessment-derivatives.ts` defines a different snake_case skill registry and career model.
- `components/dashboard/CareerForecast.tsx` and `components/career/StrategyReport.tsx` cast live game-store skills directly into the legacy assessment engine with `skills as unknown as Record<string, number>`.
- `components/journal/CareerRecommendationsView.tsx` uses the separate `2030-skills-system` path as the "single source of truth".
- Static key comparison run during this audit found:
  - game-store skill keys: `20`
  - legacy assessment skills: `58`
  - unique legacy required-career skill refs: `21`
  - overlap between live store keys and legacy required-career keys: `1`

Impact:
- Different surfaces can present different career matches, gap analysis, and transfer visualizations for the same player state.
- Legacy components using `assessment-derivatives` are effectively operating on partially unmapped skill data.
- This weakens patent defensibility around consistent skill-to-career inference and undermines stakeholder trust in "career analysis" outputs.

Primary references:
- `lib/game-store.ts`
- `lib/assessment-derivatives.ts`
- `lib/2030-skills-system.ts`
- `lib/skill-definitions.ts`
- `components/dashboard/CareerForecast.tsx`
- `components/dashboard/SkillGapVisualizer.tsx`
- `components/visualizations/SkillTransferGraph.tsx`
- `components/journal/CareerRecommendationsView.tsx`
- `components/career/StrategyReport.tsx`

Recommended fix:
1. Pick one canonical skill schema and one canonical career-recommendation engine.
2. Add a typed adapter if legacy views must remain temporarily.
3. Add a parity test that asserts identical top-career output across dashboard, journal, and report surfaces for the same player state.

Evidence grade: E2

### 3. Medium: Research export exists, but it is not patent-grade or data-dictionary-grade yet

Evidence:
- The patent claims anonymized cohort analysis, consented individual export, longitudinal tracking, and career readiness indicators.
- The analytics data dictionary still frames anonymized export and longitudinal tracking with consent as the research-platform target.
- `lib/cognitive-domain-calculator.ts` already contains a richer `createResearchExport(...)` path with domain scores, evidence counts, engagement, and pattern correlations.
- `app/api/admin/research-export/route.ts` does not use that canonical export. Instead it:
  - returns raw `playerId`
  - exports psychometric-like fields directly
  - reconstructs engagement level from `total_choices`
  - has no visible consent gate
  - does not produce anonymized cohort output

Impact:
- The system has a research-export endpoint, but not one that cleanly matches the patent framing or analytics roadmap.
- This is a capability gap for institutional/research positioning, not just a documentation gap.

Primary references:
- `docs/03_PROCESS/archive/ai_analysis/GCT_Patent_Application.md`
- `docs/reference/data-dictionary/12-analytics.md`
- `lib/cognitive-domain-calculator.ts`
- `app/api/admin/research-export/route.ts`

Recommended fix:
1. Route research export through canonical cognitive/skill export builders.
2. Add pseudonymization/anonymization modes.
3. Require explicit consent state for individual-level export.
4. Expose cohort and longitudinal export separately from raw per-user admin export.

Evidence grade: E1

### 4. Medium: Thought internalization is still a partial shell relative to the patent claim

Evidence:
- The patent describes thought exposure counts, reflection counts, percentage internalization, transformed descriptions after internalization, and gameplay bonuses.
- `content/thoughts.ts` defines thoughts with only a description, progress, and a simple pattern unlock condition.
- `lib/thought-system.ts` only unlocks thoughts from pattern thresholds and explicitly notes "Add more conditions here later".
- `lib/game-store.ts` internalizes a thought by immediately setting `status='internalized'` and `progress=100`.
- `components/ThoughtCabinet.tsx` renders `thought.internalizedText` and `thought.bonuses`, but the underlying thought model does not type those fields and the component consumes `thought` as `any`.
- The only clearly implemented bonus path is the identity subsystem's `+20%` pattern gain modifier for identity thoughts.

Impact:
- The Thought Cabinet exists, but it does not yet behave like a generalized cognitive reinforcement system.
- Patent-aligned language about learning reinforcement is ahead of the implemented system depth.

Primary references:
- `docs/03_PROCESS/archive/ai_analysis/GCT_Patent_Application.md`
- `content/thoughts.ts`
- `lib/thought-system.ts`
- `lib/game-store.ts`
- `components/ThoughtCabinet.tsx`
- `lib/identity-system.ts`

Recommended fix:
1. Extend `ThoughtDefinition` with typed `internalizedText`, `bonuses`, and exposure/reflection counters.
2. Drive progress from repeated encounters/reflections instead of immediate 0/100 flips.
3. Add non-identity bonuses so internalization is a broader capability, not a mostly identity-only mechanic.

Evidence grade: E1

## Strong Areas

- `npm run validate-simulations-doc` passed.
- `npm run verify:analytics-dict` passed.
- `npm run verify:simulation-phase-contract` passed.
- `npm run verify:character-coverage` passed for all 20 characters.
- `npm run test:run -- tests/lib/cognitive-domains.test.ts` passed `56/56`, so the DSM-inspired domain layer is substantially better grounded than the surrounding research-export surface.

## Commands Run

- `npm run validate-simulations-doc`
- `npm run verify:analytics-dict`
- `NEXT_PUBLIC_INCLUDE_DRAFT_CONTENT=true npm run verify:unreachable-dialogue-nodes`
- `node --loader ./scripts/ts-loader.mjs scripts/verify-quarantine-list.ts`
- `npm run verify:simulation-phase-contract`
- `npm run verify:character-coverage`
- `npm run test:run -- tests/content/vulnerability-arcs.test.ts tests/content/pilot-readiness.test.ts`
- `npm run test:run -- tests/lib/cognitive-domains.test.ts`

## Top 3 Actions

1. Unify the skill/career analysis stack and remove cross-schema casts.
2. Add shipped-runtime graph tests and fix the unreachable/quarantine verifier for simulation setup routing.
3. Rebuild research export around canonical domain/skill evidence with anonymization and consent controls.
