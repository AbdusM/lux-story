# Frontend Redesign Contract & Execution Plan

Last updated: 2026-03-06
Status: `implementation in progress`
Scope: gameplay shell, diegesis policy, menu IA, simulation exception rules

## Purpose

Turn the current frontend critique into a decision-complete implementation contract.

This document exists because the repo already has strong immersion principles, but the runtime UI has drifted away from them at the shell, information architecture, and surface-language level. The next lane is not patch-level polish. It is a bounded frontend redesign against explicit contracts.

## Source Precedence

When this plan conflicts with existing implementation, use this precedence:

1. `docs/00_CORE/01-design-principles.md`
2. `docs/00_CORE/02-living-design-document.md`
3. `docs/reference/source-documents/00-lux-story-prd-v2.md`
4. this plan
5. current runtime implementation

## Problem Statement

The current frontend failure is `structural contract drift`, not isolated component polish.

Three failures must be treated as contract-critical:

1. Gameplay shell geometry is not invariant enough across normal dialogue play.
2. Non-diegetic status/progress UI has leaked back into the core narrative surface.
3. Player-facing menu IA is mixed with facilitator/admin/system destinations.

The result is a product that still works, but no longer reliably presents the intended play experience: immersive narrative first, assessment second, system state mostly implicit.

## Severity Model For This Lane

### Contract-Critical

Breaks the intended play experience even if the app remains technically functional.

### Operational-Critical

Causes broken interaction, unsafe behavior, or major accessibility failure.

This redesign is primarily about `contract-critical` issues. Engineers should not dismiss the work because "nothing is crashing."

## Scope

In scope:

- gameplay shell geometry in `components/StatefulGameInterface.tsx`
- response presentation in `components/GameChoices.tsx`
- header/status chrome and story-surface leakage
- menu information architecture in `components/UnifiedMenu.tsx` and `components/settings/SettingsMenuContents.tsx`
- continuity/progress UI that appears inside core play
- simulation shell rules in `components/game/SimulationRenderer.tsx`
- UI contract tests and visual ratchets

Out of scope for this pass:

- backend analytics or research export logic
- career inference algorithm changes
- new worldbuilding content beyond copy required for UI contract compliance
- fully bespoke per-character simulation UIs
- admin dashboard redesign

## Required Design Contracts To Lock Before Implementation

### 1. Gameplay Shell Contract

Normal dialogue play uses one canonical shell.

Definition of `normal dialogue play`:

- not in ending state
- not in full-screen simulation
- not in loyalty-event/experience mode
- not in admin/profile flow

Rules:

1. Header is fixed in place.
2. Response dock is fixed in place.
3. Transcript viewport is the only scrollable region during normal dialogue play.
4. The transcript viewport begins below the header and ends above the response dock.
5. Response dock height must remain visually stable across normal dialogue nodes.
6. Large choice sets must not grow the dock indefinitely; they must overflow into a controlled secondary affordance.
7. Normal dialogue nodes may not introduce extra boxed sub-shells inside the primary story surface unless they are explicitly marked as exception modes.

Implementation decision:

- Keep a single transcript scroll surface.
- Keep the response dock present for normal dialogue.
- Use a secondary chooser for larger choice sets instead of allowing large dock-height swings.

Acceptance thresholds:

- dialogue stage top Y drift across representative 2-choice, 4-choice, and 7-choice normal nodes: `<= 16px` per viewport
- response dock height drift across those same nodes: `<= 24px`
- no nested scroll region inside the normal dialogue surface

### 2. Diegetic vs Non-Diegetic Surface Contract

The core story surface must preserve immersion by separating fiction-facing signals from system-facing diagnostics.

Allowed on the core story surface:

- speaker identity
- dialogue/narration
- fiction-facing simulation controls
- character reactions and narrative echoes
- subtle ambient cues that read as world state, not dashboards

Forbidden on the core story surface:

- raw trust deltas
- raw pattern/resonance counters
- reward chips
- "saved", "syncing", "pending", "waiting" labels
- dominant-pattern badge language
- admin/facilitator terminology
- hidden-count summaries like `+2 more updates`

Placement rules:

- story meaning belongs in the transcript
- progress interpretation belongs in Prism/Journey/Profile
- account/accessibility/system utilities belong in non-story chrome
- facilitator/admin tools belong outside immersive play

Copy rule:

- if text reads like a dashboard, checklist, export tool, or behavioral label, it does not belong in the core scene

### 3. Player Menu vs Facilitator/System IA Contract

Header chrome must separate player-world tools from non-immersive system destinations.

Player-world header tools:

- Prism / Journal
- Journey / constellation
- system menu trigger

System menu scope:

- audio
- accessibility
- account/session
- research participation

Explicit exclusions from the system menu:

- Clinical Audit
- facilitator/admin routes
- player analytics dashboards
- career export/report destinations that are better housed in Profile or end-state flows

Placement decision:

- `Clinical Audit` moves out of the gameplay menu
- facilitator/admin access lives on dedicated admin/profile routes, not inside the immersive gameplay shell
- player profile and report surfaces should be reachable from `Profile` or end-of-journey flows, not as a mixed settings item inside active story play

### 4. Exception Mode Contract

The shell can intentionally change only in named exception modes.

Allowed exception modes:

1. full-screen simulation
2. inline simulation
3. loyalty event / experience mode
4. ending / journey summary
5. admin/profile routes

Rules:

- exception modes must be explicit in code and tests
- exception modes may replace or suppress the normal response dock
- exception modes may have their own layout, but may not inject raw analytics/status UI into the story layer
- full-screen simulations may use a shared shell in v1, but that shell must feel native to Lux Story rather than like a detached dashboard OS

Bounded v1 simulation decision:

- do not build bespoke per-character simulation shells yet
- keep one shared simulation shell
- reduce generic operating-system chrome
- support lane-specific visual theming and context framing inside the shared shell

## Current Runtime Violations To Resolve

1. Header chrome currently contains narrative-adjacent diagnostic surfaces such as `StationStatusBadge`, `HeroBadge`, and `SyncStatusIndicator`.
2. Core transcript currently renders explicit outcome cards and reward chips.
3. Response presentation still changes too much by choice-count strategy.
4. Settings menu currently mixes player utilities with `Clinical Audit` and other non-immersive destinations.
5. Simulation shell currently reads as a detached "system UI" rather than a bounded exception mode within the same product language.

## Implementation Plan

### Commit 1: `feat(ui): lock gameplay shell geometry`

Target files:

- `components/StatefulGameInterface.tsx`
- `components/GameChoices.tsx`
- `lib/ui-constants.ts`

Changes:

- define explicit shell constants for header, transcript, and response dock behavior
- normalize response dock behavior across normal dialogue nodes
- keep transcript as the only scroll region in normal dialogue play
- reduce internal boxed-shell nesting in the story lane

### Commit 2: `feat(ui): restore diegetic core play surface`

Target files:

- `components/StatefulGameInterface.tsx`
- `components/StationStatusBadge.tsx`
- `components/SyncStatusIndicator.tsx`
- `components/HeroBadge.tsx`
- `components/game/ContinuityStrip.tsx`
- `lib/choice-outcome-presentation.ts`

Changes:

- remove or relocate non-diegetic status from active story play
- convert progress feedback to fiction-facing narrative reactions where needed
- keep analytics/progress interpretation in non-story surfaces only

### Commit 3: `feat(ui): split player and facilitator menu architecture`

Target files:

- `components/UnifiedMenu.tsx`
- `components/settings/SettingsMenuContents.tsx`
- `app/profile/page.tsx`
- any routes/components needed for relocated player/facilitator entrypoints

Changes:

- reduce the gameplay menu to true system utilities
- remove `Clinical Audit` from active-play menu
- move player profile/report access to profile or end-state paths
- keep facilitator/admin access outside the immersive shell

### Commit 4: `feat(ui): bound simulation shell exceptions`

Target files:

- `components/game/SimulationRenderer.tsx`
- lane-specific simulation subcomponents as needed

Changes:

- keep the shared simulation shell for v1
- reduce detached dashboard feel
- align simulation framing with the main Lux Story visual language
- preserve the existing timed-sim behavioral contract while changing presentation

### Commit 5: `test(ui): ratchet shell and IA contracts`

Target files:

- new or expanded Playwright specs under `tests/e2e/`
- targeted component tests where geometry or gating can be checked deterministically

Required test categories:

1. shell geometry ratchet
2. forbidden-label ratchet for normal dialogue surfaces
3. player vs facilitator menu path coverage
4. exception-mode coverage for simulations and ending flows

## Test Contract

Required measurable assertions:

1. transcript viewport top Y remains within threshold across representative normal dialogue nodes
2. response dock height remains within threshold across representative 2-choice, 4-choice, and 7-choice nodes
3. normal dialogue screens do not render forbidden labels:
   - `Trust +`
   - `resonance +`
   - `Sync:`
   - `pending`
   - `Saved`
   - `Clinical Audit`
4. gameplay settings menu contains only player/system utilities
5. facilitator/admin destinations remain accessible outside the immersive shell
6. timed simulations suppress the normal response dock and use only simulation-native controls

## Acceptance Criteria

The redesign lane is complete only when all of the following are true:

- normal dialogue play uses one stable shell with invariant header/response placement
- core story surface contains no raw meta-progress or diagnostic copy
- gameplay menu no longer mixes player utilities with facilitator/admin tools
- simulation presentation feels like a bounded Lux Story exception mode rather than a detached dashboard
- UI contract tests pass locally and in CI

## Rollout

Recommended order:

1. land shell constants and geometry tests
2. land diegetic cleanup
3. land menu IA split
4. land simulation shell cleanup
5. run focused browser QA before any broader visual polish pass or external model review

## Backout

If the redesign destabilizes flow:

1. revert the most recent frontend shell commit only
2. keep new tests if they still express the correct contract
3. do not reintroduce removed non-diegetic UI as a quick fix
4. if necessary, temporarily gate the new shell behind a local feature flag until parity is restored

## Assumptions

- The current critique is based on repo inspection and prior audit artifacts, not a fresh visual browser session in this document.
- Existing functional behavior for timed simulations, accessibility, and overlay parity must be preserved while presentation changes.
- Player-facing report/profile access is still required; only its placement is changing.

## Needs Verification

- exact shell thresholds may need one adjustment after the first browser implementation pass
- final destination for player-facing report entrypoint may need product confirmation between `Profile` and `Journey`
- simulation shared-shell theming rules should be validated against at least one analytical sim and one creative sim

## Immediate Next Step

Do not run external visual-model review yet.

First produce:

1. shell wireframes for normal dialogue, large-choice dialogue, full-screen simulation, and settings/profile routes
2. a file-by-file implementation checklist from this contract
3. geometry and forbidden-label tests before visual polish iterations

## Execution Progress

- `2026-03-06`: Commit 1 gameplay shell geometry work landed locally with shell constants, stable response dock behavior, and geometry ratchet coverage.
- `2026-03-06`: Commit 3 menu IA split landed locally by moving report/facilitator access out of the immersive gameplay menu and into profile/admin surfaces.
- `2026-03-06`: Commit 2 diegetic cleanup landed locally by removing passive gameplay toasts and expanding browser assertions to catch dashboard-style labels in active play.
- `2026-03-06`: Commit 4 shared simulation shell cleanup landed locally with integrated exercise briefing, Lux Story-aligned framing, lane-tinted styling, and targeted simulation contract coverage.
- `2026-03-06`: Commit 5 ratchets are partially landed locally via shell-geometry assertions, forbidden-label checks, and simulation shell regression tests.
