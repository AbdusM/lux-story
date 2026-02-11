# Terminus Gameplay + UI Gap Analysis (AAA)

Date: 2026-02-11

This document is a decision-support gap analysis for improving the player-facing gameplay experience (Terminus) while keeping AAA-style guardrails: deterministic seams, contract-validated telemetry, and debt-controlled CI gates.

## Executive Summary

The engine already persists meaningful NPC memory and player progression (trust, flags, conversation history, knowledge flags, pending check-ins), and the UI already exposes several strong “progress feedback” primitives (OutcomeCard, RewardFeed, Objective Pin, Prism deep-links, locked/disabled choice legibility).

The biggest reason the game can still feel like NPCs “forget you” or the world feels repetitive is *content reachability*: the dialogue graphs currently produce a large number of orphan/unreachable nodes. Those nodes represent “promised variety” that never actually shows up at runtime.

AAA recommendation:

1. Keep the current “core path is playable” gate (critical-path sim) and strengthen a second gate: “no new unreachable content debt.”
2. Add one small, always-on UI continuity seam: show a compact relationship recap and “return hook” prompt, grounded in existing state (conversationHistory, lastInteractionTimestamp, pendingCheckIns, waiting system).

## Evidence (Current Repo Outputs)

### How To Reproduce (Commands)

```bash
# Inventory: flags, telemetry contracts, dictionaries, localStorage keys
npm run report:features

# Static graph validation + warnings report (writes docs/qa/dialogue-graph-warnings.report.json)
npm run report:graph-warnings

# Behavioral reachability report (writes docs/qa/reachability.report.json)
# Complements ORPHAN_NODE by showing what is reachable under fixture trajectories.
npm run report:reachability

# Author-friendly orphan triage (writes docs/qa/orphan-triage.report.{json,md})
npm run report:orphan-triage

# Deterministic critical path simulation (writes docs/qa/critical-path-violations.report.json)
npm run report:critical-path

# Fast QA bundle (typecheck + vitest)
npm run qa:quick
```

### Feature/Contract Inventory (Flags, Telemetry, Storage, Dictionaries)

- Human: `docs/reference/FEATURE_INVENTORY.md`
- JSON: `docs/qa/feature-inventory.report.json`
- Generator: `scripts/report-feature-inventory.ts` (`npm run report:features`)

### Dialogue Graph Validation (Static)

- Command: `npm run report:graph-warnings`
- Output: `docs/qa/dialogue-graph-warnings.report.json`
- Debt-controlled baseline: `docs/qa/dialogue-graph-warnings.baseline.json` (enforced by `tests/content/dialogue-graph-warnings-contract.test.ts`)
- Current totals (2026-02-11):
  - errors: 0
  - warnings: 307
  - warning codes (top):
    - `ORPHAN_NODE`: 249
    - `TRUST_DELTA_LARGE`: 49
    - `PATTERN_IMBALANCE`: 7
    - `FAKE_CHOICE`: 2
  - most-warning graphs:
    - `samuel`: 60
    - `devon`: 49
    - `maya`: 33

Interpretation:

- “0 errors” means the graphs are structurally valid (no broken references, required fields).
- “many warnings” means large content surface area is not reachable in actual play (or has balance smells).
- This is the primary “feel” gap: content exists, but the player does not experience it.

### Critical Path Simulation (Headless, Deterministic)

- Command: `npm run report:critical-path`
- Config: `docs/qa/critical-path-contracts.config.json`
- Output: `docs/qa/critical-path-violations.report.json`
- Current result (2026-02-11): `violation_count=0`

Interpretation:

- “menus work / game doesn’t soft-deadlock on the declared entry/hub nodes” is currently green under `baseline_early_game_v1`.
- This gate protects the first minutes of play, but does not guarantee breadth content reachability.

### Content Scale Snapshot

Authoritative content contract summary (from `tests/content/content-contracts.test.ts`, printed during `npm run qa:quick`):

- Total graphs: 28
- Total nodes: 1897
- Total choices: 3564
- Choices with skills: 2594 (72.8%)
- Choices with patterns: 3416 (95.8%)
- Unique skills used: 79/84

Additional quick scan across `content/*dialogue-graph.ts` (20 graph files matched by that glob):

- `requiredState:` occurrences: 270
- `hasGlobalFlags:` occurrences: 76
- `addGlobalFlags: [..met_..]` occurrences: 36

Interpretation:

- There is plenty of authored gating; the issue isn’t “missing gates,” it’s “unreachable branches and weak continuity surfacing.”

## What Is Already “Real” (So We Don’t Rebuild It)

### Persistence + State Model (NPC Memory)

Authoritative state:

- `lib/character-state.ts`
  - `CharacterState`: `trust`, `relationshipStatus`, `knowledgeFlags`, `conversationHistory`, `lastInteractionTimestamp`, `trustTimeline`, etc.
  - `GameState`: `globalFlags`, `pendingCheckIns`, `patterns`, `orbs`, `skillLevels`, etc.
- Persistence:
  - `lib/game-state-manager.ts` saves to `lux_story_v2_game_save` with backup.
  - Zustand store persists separately (but `coreGameState` is intended as the single source of truth).

NPC “remembering you” is already possible because:

- Graph logic gates on:
  - global flags (e.g. `met_maya`, `maya_arc_complete`)
  - per-character `knowledgeFlags`
  - per-character `trust` / relationship status
  - conversation history (used as a heuristic for “met” and for content selection)
- `TextProcessor` supports inline conditionals in text:
  - `lib/text-processor.ts` syntax: `{{met_maya:Text If True|Text If False}}`

### First-Meet vs Re-Meet Mechanics (Exists, Needs Surfacing)

Content selection already supports conditional content:

- `lib/dialogue-graph.ts` `DialogueGraphNavigator.selectContent(...)` chooses:
  - first conditional content match (`content.condition`)
  - otherwise rotates among non-conditional variations (seeded random)

Conversation history is updated on node entry:

- `hooks/game/useChoiceHandler.ts` appends `nextNode.nodeId` to `conversationHistory` and updates `lastInteractionTimestamp`.
- `hooks/game/useReturnToStation.ts` also ensures conversation history contains the returned-to node.

So the gap is not “we can’t know”; the gap is:

- we do not present continuity cues consistently in UI,
- and we have a large unreachable content debt, so authored continuity often never triggers.

### Return Hooks + “They’re Waiting” (Exists, Has a Bug)

Check-ins:

- `lib/character-check-ins.ts` maintains `pendingCheckIns` and adds flags like `CheckInReady_maya` and `has_new_messages`.

“They’re waiting”:

- `lib/character-waiting.ts` provides returning-player detection and waiting messages.

Important issue:

- `detectReturningPlayer()` currently builds `currentSessionCharacters` using `conversationHistory.length > 0` as a proxy, which is “ever met” not “met this session.”
- You already store `lastInteractionTimestamp` per character; use that to compute “visited this session” deterministically.

This bug matters directly to the player-facing experience: it can make the station feel static (waiting messages don’t reflect actual return cadence).

### Progress Feedback UI (Already Good Primitives)

Footer:

- `components/game/GameFooter.tsx`
  - `OutcomeCard` (big deltas)
  - `RewardFeed` (small deltas, rate-limited)
  - Objective Pin + deep link into Prism tab
  - Choice list (with optional compact mode flag)

Choice legibility:

- `components/GameChoices.tsx`
  - deterministic ordering + telemetry (`choice_presented`, `choice_selected_ui`, `choice_compact_toggled`)
  - locked choice reason model via `requiredOrbFill` and `deriveOrbFillGateReason`
  - disabled choice reason model via `StateConditionEvaluator` `reason_details` (why/how/progress)

Header + Prism:

- `components/game/GameHeader.tsx` shows attention halos for Prism/Constellation and includes `UnifiedMenu`.
- `components/Journal.tsx` (Prism) supports deep-linking from OutcomeCard and has tab badges.

## Primary Gaps (Player-Facing)

### Gap 1: Unreachable Content Debt (Variety + Continuity Kill-Switch)

Static validation reports 249 orphan nodes and 307 total warnings.

Why it matters:

- Unreachable nodes are “silent content loss.” Players can’t experience authored re-meet callbacks, late-arc depth, or station life hooks.
- It creates repetition because the reachable set is smaller than the authored set.

AAA contract lock to add:

- This is already debt-controlled (baseline + regression-only gate):
  - Baseline: `docs/qa/dialogue-graph-warnings.baseline.json` tracks `ORPHAN_NODE`, `FAKE_CHOICE`, and `DEAD_END`.
  - Gate: `tests/content/dialogue-graph-warnings-contract.test.ts` fails CI if tracked warning IDs or counts increase.

What’s missing is the “paydown path”:

- We need an intentional reduction plan for the top offender graphs so the reachable set expands over time (otherwise the baseline just freezes a large unreachable surface).

### Gap 2: Continuity Is Not a First-Class UI Seam

Continuity exists in state + content, but UI doesn’t explicitly show:

- “You’ve met this person before” vs “first time”
- last interaction recency
- current relationship status
- check-in readiness (“they asked to see you again”)

AAA fix:

- Add a small “Continuity Strip” in the header (or above choices) that reads from:
  - `conversationHistory.length`
  - `trust` / `relationshipStatus`
  - `pendingCheckIns` (if the current character is ready)
  - `lastInteractionTimestamp` (if present)

### Gap 3: “Many Choices” UX Isn’t Completed

You have:

- `CHOICE_COMPACT_MODE` flag that limits displayed choices and allows expand.

You don’t yet have:

- a dedicated “choice overflow” interaction that is optimized for mobile (bottom sheet / full-screen list with search or grouping).

AAA fix:

- Implement a deterministic overflow panel (no animations that break scroll/taps) and keep all telemetry exactly as-is.

### Gap 4: “They’re Waiting” Loop Is Not Deterministic Enough

As noted, `detectReturningPlayer()` uses an approximate proxy that doesn’t mean “this session,” and waiting messages use random selection (fine) without an explicit “was away” vs “was active” classification for the UI.

AAA fix:

- Use `sessionStartTime` + per-character `lastInteractionTimestamp` to compute:
  - visited_this_session: boolean
  - hours_since_last_interaction: number
- Then the waiting loop becomes reproducible and debuggable.

## Player-Facing Target (10 User Stories)

These are written to be implementable and testable without Playwright, and to map cleanly onto existing deterministic seams + telemetry.

1. As a returning player, I can immediately see “what changed since last time” (new check-ins, new unlocks, updated objectives) so I don’t feel lost.
   - Acceptance: header/footer surfaces at least one deterministic “return hook” when `hoursSinceLastSession >= MIN_HOURS_FOR_WAITING`.
   - Evidence: `node_entered` + `choice_presented` continue to emit; optional UI-only event is not required.
2. As a player, NPCs do not re-introduce themselves after we’ve met; they acknowledge prior contact so the world feels persistent.
   - Acceptance: if `globalFlags` contains `met_<character>` (or `conversationHistory.length>0`), show a compact “re-meet” cue in UI and prefer conditional content variants when authored.
3. As a player, I can always understand why a choice is locked/disabled and what to do next to unlock it.
   - Acceptance: locked (orb-fill) and disabled (state-condition) choices render `why` + `how` (and `progress` when available), and a JSDOM test asserts the structured format.
4. As a player, after I make a choice, I see a consistent “Outcome” summary of what changed (trust/patterns/unlocks) so progress feels tangible.
   - Acceptance: `OutcomeCard` shows at least one line even for “no visible changes” (explicitly states story progressed).
5. As a player, I never hit a soft-deadlock on the critical path during early game.
   - Acceptance: `npm run report:critical-path` stays green under `baseline_early_game_v1` and continues as a CI gate.
6. As a player on mobile, I can handle “many choices” without losing context; I can expand to see the full list deterministically.
   - Acceptance: a deterministic overflow UI exists (panel/sheet) and `choice_presented` reflects what was actually shown.
7. As a player, when someone is “waiting,” I can tell who, why, and how long, and jump directly to that character.
   - Acceptance: waiting UI uses `hoursSinceLastInteraction` (not “ever met”) and is stable across reloads.
8. As a player, I can explore the station/constellation and see availability reflect my progress (met flags, arc state, check-ins).
   - Acceptance: constellation indicators correlate with `pendingCheckIns` / arc flags and do not regress under QA.
9. As a player, accessibility settings (reduced motion, text size, keyboard hints) are easy to find and persist reliably.
   - Acceptance: `UnifiedMenu` component tests cover toggles + persistence keys (already tracked in feature inventory).
10. As a player, my progress is durable: reloads do not erase history, relationship progress, or unlocks.
   - Acceptance: `lib/game-state-manager.ts` continues to save/restore `lux_story_v2_game_save` and QA includes at least one state round-trip test (unit/integration).

## Front-End UI Gap Analysis (Prioritized Backlog)

This is ordered by highest “player feel” delta per engineering hour, and assumes CI-only Playwright (local browser launch is unreliable in this runtime).

### P0: Continuity Strip (Always-On)

Problem:
- The state system supports continuity, but the UI doesn’t consistently *surface* it.

Change:
- Add a compact “Continuity Strip” near the header or above choices that includes:
- Relationship status + trust trend (if available).
- Last interaction recency (e.g. “2h ago”, “3d ago”).
- Check-in readiness (“New message”) when `pendingCheckIns` indicates readiness.
- A single deep-link CTA (“Open Prism” or “Go to Messages”).

Where:
- Likely `components/game/GameHeader.tsx` or `components/StatefulGameInterface.tsx` (to keep it close to the choice loop).

Tests:
- JSDOM: renders re-meet/recency correctly from a fixture `GameState`.

### P0: Fix Waiting Determinism (Correctness Bug)

Problem:
- `lib/character-waiting.ts` treats “ever met” as “visited this session,” which weakens the return-hook loop.

Change:
- `detectReturningPlayer()` should compute `currentSessionCharacters` from:
  - `charState.lastInteractionTimestamp >= gameState.sessionStartTime`
  - and only fall back to `conversationHistory.length > 0` when timestamps are missing (legacy saves).

Tests:
- Unit test with fixed timestamps.

### P1: Many-Choices Overflow UX

Problem:
- `CHOICE_COMPACT_MODE` exists but does not fully solve mobile “choice overload.”

Change:
- Add a deterministic overflow panel (sheet or full-screen list).
- Preserve ordering.
- Include locked/disabled reason rendering.
- Optionally group by “available now” vs “locked” (stable grouping only).

Tests:
- JSDOM: compact mode shows N choices + “Show all”; overflow shows the full list.

### P1: Outcome Card “No Visible Changes” Copy

Problem:
- When the outcome has no visible deltas, the UI can feel like “nothing happened.”

Change:
- Ensure `OutcomeCard` always shows a minimal line when `deltas.length===0`.

Tests:
- JSDOM: outcome renders the fallback line for a fixture result.

### P2: Content Reachability Paydown UI Support

Problem:
- Unreachable content debt is the #1 variety killer; fixing it is mostly content wiring, but UI can help validate breadth.

Change:
- Add a dev-only “content debug” drawer (flagged) that shows:
  - current node id
  - graph id
  - content variation id (if applicable)
  - last N node ids (trace)

Tests:
- Unit test for the trace reducer (no UI snapshot required).

## Recommended Roadmap (Highest ROI First)

### Phase A (0-2 weeks): Make “Continuity + Variety” Real Without Content Rewrites

1. Add a “Continuity Strip” UI component (always on).
2. Fix `detectReturningPlayer()` semantics to use `lastInteractionTimestamp`.
3. Add a debt-controlled CI gate for reachability warnings:
   - baseline file committed
   - fail on regression only

Acceptance:

- Player can tell when a character is a re-meet.
- “They’re waiting” loop triggers only on true returns (hours away), not just after any history exists.
- CI blocks new orphan debt.

### Phase B (2-6 weeks): Convert Unreachable Content Into Reachable Content

Target: reduce orphans in the top 3 offender graphs (`samuel`, `devon`, `maya`) and any graph on the critical path.

Rule:

- Prefer fixing by adding references (wiring nodes) rather than deleting nodes, unless the node is truly obsolete.

Acceptance:

- Reachable node count increases meaningfully for target graphs.
- No new soft deadlocks (critical path sim remains green).

### Phase C (6-12 weeks): “Worldbuilding OS” UI (PRD-aligned)

Align with `docs/03_PROCESS/archive/DEC2024/COMPREHENSIVE_AAA_PRD.md`:

- “Worldbuilding OS / Side Menu / Satellite OS” becomes the Prism + UnifiedMenu experience:
  - better “what changed since last time” markers per tab
  - better deep links from OutcomeCard + Objective
  - surfaced check-ins / return hooks as “messages” in the station metaphor

Acceptance:

- Players do not need to remember to open the Prism; the game teaches it via outcomes and clear “new” signals.

## Notes (Design Constraints)

- Local Playwright browser runs are unreliable in this agent runtime. Prefer:
  - JSDOM component tests (Vitest + Testing Library)
  - headless content sims/validators (scripts in `scripts/` and `lib/validators/`)
- Telemetry contract rule:
  - Any new interaction event must be added to:
    - `lib/telemetry/interaction-events-spec.ts`
    - `docs/reference/data-dictionary/12-analytics.md`
    - validated by `scripts/verify-analytics-dictionary.ts`

## Appendix: Key Files

- State + persistence:
  - `lib/character-state.ts`
  - `lib/game-state-manager.ts`
  - `lib/game-store.ts`
- Choice handling + sync:
  - `hooks/game/useChoiceHandler.ts`
  - `app/api/user/relationship-progress/route.ts`
- Continuity mechanics:
  - `lib/text-processor.ts`
  - `lib/dialogue-graph.ts` (`selectContent`, `StateConditionEvaluator`)
  - `lib/character-check-ins.ts`
  - `lib/character-waiting.ts`
- UI surfaces:
  - `components/game/GameHeader.tsx`
  - `components/game/GameFooter.tsx`
  - `components/GameChoices.tsx`
  - `components/Journal.tsx`
- Validators:
  - `scripts/validate-dialogue-graphs.ts`
  - `scripts/report-critical-path-violations.ts`
  - `lib/validators/critical-path-sim.ts`
