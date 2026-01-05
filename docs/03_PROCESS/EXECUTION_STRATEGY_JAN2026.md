# Formal Execution Strategy: The "Polish" Sprint (Jan 2026)
**Status**: ACTIVE
**References**: 
*   Target: [`MASTER_IMPLEMENTATION_INDEX.md`](./MASTER_IMPLEMENTATION_INDEX.md)
*   Baseline: [`GAME_CAPABILITIES_AUDIT.md`](../01_MECHANICS/GAME_CAPABILITIES_AUDIT.md)

## 1. Executive Summary
This document formalizes the development plan to close the final gaps between the **Code Reality** (Advanced Backend) and the **Player Experience** (Lagging UI). We are not building new systems; we are **connecting** existing systems to the UI.

## 2. Execution Phases

### Phase 1: Visual Progression ("The Mirror")
**Objective**: Surface the deep `orbs.ts` data to the player.
*   **Current State**: Journal shows extensive text but generic numbers.
*   **Target State**: Journal shows "Hades-style" progress bars for the 5 Patterns.
*   **Steps**:
    1.  **Refactor**: Modify `components/Journal/InsightsTab.tsx`.
    2.  **Integrate**: Connect to `useGameStore` pattern selectors.
    3.  **Visualize**: Implement CSS-only progress bars (using `lib/orbs.ts` colors).
    4.  **Verify**: Check that "Nascent" -> "Emerging" tiers update visually.

### Phase 2: Audio Immersion ("The Echo")
**Objective**: Surface the `consequence-echoes.ts` sound cues.
*   **Current State**: Echoes trigger text updates, but `soundCue` data is ignored.
*   **Target State**: Distinct sounds play when specific echo intensities trigger.
*   **Steps**:
    1.  **Map**: Create `SoundMap` in `lib/audio-feedback.ts` for 'trust', 'identity', 'pattern-*'.
    2.  **Hook**: Update `StatefulGameInterface.tsx` to listen for echo events.
    3.  **Verify**: Trigger a Trust Up moment with Kai and hear the cue.

### Phase 3: Vestigial Cleanup (Safety)
**Objective**: Prevent regression by removing "Ghost Code".
*   **Target**: `lib/orbs.ts` allocation logic.
*   **Step**: Deprecate/Comment out `availableToAllocate` logic to avoid confusion.

## 3. Verification Protocol
For each Phase, we must validate against the **Game Capabilities Audit**:
*   **Tech Check**: Does the code compile without lint errors?
*   **Audit Check**: Does the change align with Section 9 (Aligning with Active Roadmap)?
*   **Integration Check**: Does it break the "Version 2" State Store?

## 4. Rollback Plan
*   **Safe Mode**: If UI behaves erratically, revert `InsightsTab.tsx` to "Text Only" mode.
*   **State Safety**: All changes must respect `coreGameState` immutability.
