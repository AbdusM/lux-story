# Implementation Plan: Satellite OS (Phase 1 & 2)

**Feature:** Star Walking & Visual OS Upgrade
**User Story:** "As a player, I want the side menus to feel like immersive worlds, and I want to travel to characters by clicking their stars."

---

## 1. Technical Context

Currently, `ConstellationPanel` and `Journal` are standard React side-sheets (`fixed right-0`, `max-w-lg`). Navigation is strictly handled by the `GameView` choices.

**Goal:**
1.  **Star Walking:** Allow navigation from the `ConstellationGraph`.
2.  **OS Feel:** Differentiate the panels visually (Holographic "Windows" rather than off-canvas menus).

---

## 2. Proposed Changes

### A. Core Navigation (`useGameSelectors` / `GameStore`)
-   **Action:** Verify `navigateToNode` action exists in the store.
-   **Integration:** Expose this action to `ConstellationPanel`.

### B. Constellation Graph (`ConstellationGraph.tsx`)
-   **Props:** Add `onTravel: (characterId: string) => void`.
-   **Interaction:**
    -   Keep Single Click = Select (show info).
    -   Add **"Travel to [Name]"** Button (or Double Click) for `hasMet` characters.
    -   *Constraint:* Can only travel if the character is "Unlocked" or "Available" (logic needed? or just `hasMet` implies revisitability?).
    -   **Refinement:** "Star Walking" implies moving to the *location*.

### C. Constellation Panel (`ConstellationPanel.tsx`)
-   **Logic:**
    -   Inject `navigateToNode` from store.
    -   Pass `handleTravel` to `PeopleView` -> `ConstellationGraph`.
    -   `handleTravel` should:
        1.  Close the panel.
        2.  Trigger Game Store navigation to `[character]_hub` or `[character]_intro`.

### D. Visual Polish (OS Feel)
-   **CSS/Tailwind:**
    -   Desktop: Ensure panels float slightly (margin? rounded corners on all sides?) to feel like specific "Devices" rather than app drawers.
    -   Mobile: Keep full width for usability, but ensure "Safe Area" padding is perfect.

---

## 3. Verification Plan

### Automated Tests
-   Jest/Vitest: Test `ConstellationGraph` interaction callbacks.

### Manual Verification (Browser)
1.  **Setup:** Load safe save (Sector 0 complete).
2.  **Action:** Open Constellation.
3.  **Action:** Click "Maya" (unlocked).
4.  **Observe:** "Travel" prompt appears.
5.  **Action:** Click "Travel".
6.  **Result:** Panel closes, Game Main View transitions to Maya's dialogue.

---

## 4. Dependencies
-   `lib/game-store` (Navigation logic)
-   `components/constellation/*`
