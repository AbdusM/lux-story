# Gameplay Improvement Plan (AAA, Terminus)

Last updated: 2026-02-11

## Why This Exists

We are past “backend is complete” and into “player trust is earned.” This plan
keeps gameplay improvements player-facing, while enforcing AAA-style guardrails
so we can ship without manual playthroughs.

Key constraints:
- Local Playwright browser launches can fail in some runtimes. CI Playwright is
  authoritative; local correctness comes from headless sims + JSDOM component
  tests + contract validators.
- Content is large and growing. We must prevent drift (new broken states) while
  paying down existing reachability debt.

## Player Experience Goals (What “Better Gameplay” Means)

1. The station remembers the player.
   - NPCs acknowledge recency and past interactions (no “who are you again?” loops).
2. Choices are legible.
   - If a choice is locked, the UI explains why and how to unlock.
3. Progress always feels real.
   - After a choice, the game shows what changed (trust/orbs/unlocks) without spam.
4. No flow breakers.
   - The player cannot get stuck with “choices exist but none are usable” on the
     critical path.
5. Exploration expands content, not confusion.
   - Train-station navigation exposes new people and systems intentionally (not randomly).

## What We Have Now (Foundational Systems)

AAA rails already in-repo:
- Typed feature flags with dev-only overrides (`lib/feature-flags.ts`).
- Experiments with deterministic assignment and telemetry tracking (`lib/experiments.ts`).
- “No fake analytics” contract enforcement (interaction_events + dictionary tooling).
- Headless content validation:
  - graph warnings (orphans, fake choices, pattern imbalance)
  - critical-path sim contracts and debt-controlled baselines
- UI seam improvements:
  - return hook prompt + continuity strip
  - outcome card + reward feed components

## Big Gap: Content Reachability vs Content Existence

Today, many nodes are present but not reachable from graph starts. This is not
just “lint debt”; it is “gameplay is thinner than the content implies.”

We treat this as two distinct problems:
1. Engine correctness: never deadlock, deterministic rules, contract-checked state.
2. Content wiring: making authored content reachable in intentional ways.

The plan below does both, in the right order.

## Roadmap (Phased, Mergeable)

### Phase 1 (Now): Flow Breakers + Contract Locks

Objective: prevent regressions and make bugs reproducible.

Work:
- Critical-path contract (baseline fixture) must stay green.
- Required-state strict mode exists (flagged) for dev/test validation.
- Graph warnings remain debt-controlled (no new ORPHAN/FAKE_CHOICE/DEAD_END).

Acceptance:
- CI fails on new critical-path deadlocks with minimal reproduction trace.
- CI fails on new tracked warning_ids vs baseline.

### Phase 2: Choice Legibility (Canonical Lock Reasons)

Objective: eliminate “I don’t know what to do” moments.

Work:
- Introduce a typed `LockReason` model (code + why + how + optional progress).
- Gating/resolve layer emits structured reasons, UI renders them consistently.
- Add JSDOM tests for:
  - locked choice renders reason + hint
  - compact mode presentation metadata matches UI

Acceptance:
- Any disabled/hidden choice that is shown as locked has a structured reason.
- No ad-hoc strings in UI for lock logic.

### Phase 3: Progress Feedback (Outcome Card + Reward Cadence)

Objective: make progress visible without spamming the player.

Work:
- Outcome card v1 after every choice:
  - trust delta, orb delta, unlocks, “story progressed” fallback
  - deep links to Prism tabs when relevant
- Reward feed is rate-limited and collapses duplicates.
- Telemetry records exactly what was presented (presentation_mode, hidden_count).

Acceptance:
- Players always see “something happened” after choosing.
- Feed does not exceed N items per minute and collapses duplicates.

### Phase 4: Station Continuity + NPC Memory Echoes (World Feels Alive)

Objective: NPCs “learn” the player in a deterministic, testable way.

Work:
- Persist and surface:
  - last interaction timestamps per character
  - session start/end markers
- Optional: gossip propagation processor (behind flag), producing “echo” state.
- Add headless sim scenarios to confirm:
  - returning player sees the right recap cues
  - echo flags influence node routing deterministically

Acceptance:
- Returning player sees correct recency/callback cues.
- NPC greeting routers change based on persisted state, not randomness.

### Phase 5: Content Reachability Paydown (Make the Game Bigger on Purpose)

Objective: convert existing “orphan” content into reachable gameplay.

Work:
- Add reports:
  - structural orphans (no inbound edges)
  - behavioral unreachables (never reached under realistic trajectories)
- Pick top graphs (samuel/maya/devon):
  - wire N orphan nodes per sprint into hubs as optional topics
  - add explicit gating rules to avoid overwhelming early game
- Track paydown:
  - CI remains regression-only globally
  - sprint target for selected graphs is a ratchet (“must improve”)

Acceptance:
- ReachableNodes increases for target graphs across sprints.
- No new orphan debt is introduced.

## 10 User Stories (Handoff-Ready)

1. As a returning player, I see a single “While you were away…” cue once per session.
2. As a player, when I re-open a character, I see when we last spoke and what changed.
3. As a player, if a choice is locked, I can see why it’s locked.
4. As a player, if a choice is locked, I can see how to unlock it (actionable hint).
5. As a player, after I pick a choice, I always see an outcome summary (even if minimal).
6. As a player, I can deep-link from outcomes to the relevant Prism tab to understand my growth.
7. As a player, I never hit a state where the game presents no usable choices on the critical path.
8. As a player, exploring the station consistently introduces new NPCs or new conversation topics.
9. As a player, completing simulations produces predictable rewards and doesn’t explode relationship trust.
10. As a player, characters don’t “forget” flags/knowledge I’ve established in prior conversations.

## QA Strategy (CI-Grade, No Manual Playthrough Required)

Minimum gates:
- Headless sim:
  - critical path: no soft-deadlocks under `baseline_early_game_v1`
- Content validation:
  - no new tracked dialogue-graph warning_ids vs baseline
- JSDOM UI tests:
  - locked choice reason rendering
  - outcome card rendering
- CI Playwright (CI only):
  - one golden path (load game, make choice, open menu, open key panels)

## Decision Locks (Prevents Regressions/Drift)

- Any new telemetry event type requires:
  - spec (`lib/telemetry/*`)
  - dictionary entry (`docs/reference/data-dictionary/12-analytics.md`)
  - verifier passes (`npm run verify:analytics-dict`)
- Any change to flags/experiments/required-state enforcement requires:
  - ADR + explicit rollout/backout plan
- Any gameplay feature behind a flag must include:
  - owner + sunset date in the flag registry

