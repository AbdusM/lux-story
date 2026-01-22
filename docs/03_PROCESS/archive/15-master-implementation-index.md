# Lux Story: Master Implementation Index
**Date**: 2026-01-04
**Status**: ACTIVE
**Source of Truth**: Codebase Analysis (Verified vs `lib/*`)

## 1. The Reality Check (Code vs Plan)
Our deep scan revealed the codebase is **significantly more advanced** than the old plans suggested.

| System | Plan Status | Code Reality | Action |
| :--- | :--- | :--- | :--- |
| **Constants** | "Missing" | ✅ **Complete**. `lib/constants.ts` exists and covers all systems. | None. |
| **Echoes** | "Missing (3/8)" | ✅ **Advanced (16/16)**. `lib/consequence-echoes.ts` covers ALL 16 characters, including `soundCue` support! | ✅ **Done**. UI connected in `StatefulGameInterface.tsx`. |
| **Identity** | "Unsafe" | ✅ **Safe**. `lib/identity-system.ts` has full null checking. | None. |
| **State** | "Duplicated" | ⚠️ **Bridge Mode**. `game-store.ts` intentionally syncs `coreGameState` for compat. | **DO NOT DELETE**. Valid "Version 2" architecture. |
| **Orbs** | "Vestigial" | ✅ **Complete**. `lib/orbs.ts` cleaned. Only "Earned" logic remains. | None. |

---

## 2. Active Implementation Tasks (The "Must Build")
These are the ONLY items that truly need work.

### A. Progression System UI ("The Mirror")
*   **Context**: The backend tracks "Tiers" (Nascent -> Mastered) correctly in `lib/orbs.ts`. The UI is the gap.
*   **Status**: ✅ **COMPLETE**.
*   **Implementation**: `OrbDetailPanel.tsx` created, `HarmonicsView.tsx` and `Journal.tsx` updated.

### B. Immersion Audio ("The Sound of Trust")
*   **Context**: `lib/consequence-echoes.ts` data includes `soundCue` (e.g., `'echo-kai'`), but the frontend doesn't play it yet.
*   **Status**: ✅ **COMPLETE**.
*   **Implementation**: `StatefulGameInterface.tsx` triggers `playSound` on `consequenceEcho` update.

### C. Cleanup (Low Priority)
*   **Task**: Move `lib/archive/orb-allocation-design.ts` logic out of the main `orbs.ts` file to strictly enforce "Earned Only" model.
*   **Status**: ✅ **Initial Cleanup Complete**. Deleted `ExperienceSummary.tsx` and `ChatPacedDialogue.DISABLED.tsx`.

### D. Content Injection (Worldbuilding)
*   **Context**: The world needed depth.
*   **Status**: ✅ **COMPLETE**.
*   **Implementation**:
    *   **Market**: Added "Secret Trades" (Blueprints, Locations).
    *   **Deep Station**: Added "Logic Cascade" and "New Game+" endings.
    *   **Voices**: Populated `pattern-voice-library.ts` for all 16 characters.

### E. Comprehensive Polish Sprint (Systemic)
*   **Context**: A targeted sprint to unify visuals, depth, and stability.
*   **Status**: ✅ **COMPLETE**.
*   **Implementation**:
    *   **Verification**: Strictly typed key components.
    *   **Atmosphere**: Implemented `AtmosphericGameBackground` (Generative Scenery).
    *   **Overdensity**: ✅ **COMPLETE**. `ovderdensity-system.ts` connected to Simulation Loop. `market-graph` includes dynamic "Crowd Surge" events.
    *   **Deep Station Glitch**: ✅ **COMPLETE**. Implemented "Logic Cascade" routing from high-density Market surges into the Deep Station.

## 3. Vision Hooks (The "Infinite Interface")
*   **Atmosphere**: `ISP_UI_VISION.md` proposes "Generative Scenery" (Shader backgrounds linked to Emotion State).
*   **Action**: Keep as a "North Star" for the Immersion System (`B`), but do not block current UI work.

---

## 3. Architecture constraints (The "Do Not Touch")
*   **Bridge State**: `lib/game-store.ts` duplicates `characterTrust`. **This is intentional**. It bridges the React UI (Zustand) with the Narrative Engine (CoreGameState). Removing it breaks the UI.
*   **16-Character Roster**: We have 16 active characters with echoes. Do not revert to the "8 character" plan.

## 4. Deprecated Documents (Ignore These)
*   ❌ `docs/03_PROCESS/POLISH_SPRINT_PLAN.md` (Superseded by this Index)
*   ❌ `docs/00_CORE/critique/BLOAT_AUDIT.md` ( addressed)
*   ❌ `docs/00_CORE/critique/CHOICE_CONSEQUENCE_PHILOSOPHY.md` (Addressed by Identity System)
