# Software Development Plan: "The Living Text" (Lean Enhancement)
**Date:** November 25, 2025
**Philosophy:** "Maximum Depth, Minimal Interface."
**Focus:** Enhancing the core chat/CLI experience without over-complicating visuals or adding audio.

## Phase 1: Foundation Integrity (The "Clean" Core)
*Goal: Ensure the current engine is rock-solid and properly integrated before adding depth.*

1.  **Codebase Consolidation:**
    *   **Audit `lib/`:** Remove "Ghost Systems" (`neuroscience-system.ts`, `crisis-system.js`) that are not currently hooked up to the main loop. Reduce noise.
    *   **Type Safety:** Strict audit of `GameInterfaceState` and `DialogueNode` to ensure no runtime errors in the state machine.
    *   **Test Coverage:** Add unit tests for `StateConditionEvaluator` (logic engine) and `SkillTracker` (RPG engine) to guarantee 100% reliability of choices.

2.  **Data Pipeline Verification:**
    *   **Save/Load:** Verify `GameStateManager` handles edge cases (corrupt saves, version migration) perfectly.
    *   **Sync:** Ensure Supabase background sync is robust (retries, offline support).

## Phase 2: The "Deep" Chat UI (Enhancement)
*Goal: Make the simple chat interface feel like a "AAA" terminal.*

1.  **"Voice" Distinction (Subtle):**
    *   Instead of wild fonts, use *subtle* typography shifts (e.g., Samuel uses a slightly heavier serif mono, Maya uses a clean sans mono).
    *   **Pacing:** Refine the "Chat Pacing" algorithm to match the *character's* personality (Samuel types slow/measured; Devon types fast/bursty).

2.  **The "Thought" Channel:**
    *   Add a secondary "Internal Monologue" stream in the UI (distinct from spoken dialogue).
    *   *Example:* [System]: "You hesitate. Samuel notices." (Narrative feedback integrated into the stream).

3.  **Trust Visualization (Lean):**
    *   Instead of a progress bar, use *textual* cues in the UI header.
    *   *Change:* "Trust: 6/10" -> "Status: Guarded" -> "Status: Confidant".

## Phase 3: Psychological Mechanics (The "Brain")
*Goal: Deepen the simulation without changing the UI.*

1.  **The "Trust = Discovery" Engine:**
    *   Implement the logic where high Trust *unlocks* entire conversation branches (not just choices).
    *   Feedback loop: "Because you listened, Maya shares a secret."

2.  **Pattern Recognition Upgrade:**
    *   Track "Player Archetype" (e.g., "The Listener", "The Fixer") based on *types* of choices made.
    *   Reflect this back in the "Experience Summary" at the end.

## Execution Roadmap

| Sprint | Focus | Key Deliverable |
| :--- | :--- | :--- |
| **Sprint 1 (Now)** | **Cleanup & Stability** | Clean `lib/`, robust Tests, unified `game-state-manager`. |
| **Sprint 2** | **Chat Polish** | Character-specific typing speeds, Internal Monologue UI. |
| **Sprint 3** | **Deep Logic** | "Trust" branching logic, Archetype tracking. |

---

## Integration Checklist (Alignment)
- [ ] **Data:** Does `skill-tracker` feed correctly into `student-insights`?
- [ ] **Narrative:** Does `dialogue-graph` respect `GameState` flags consistently?
- [ ] **UI:** Does `StatefulGameInterface` render *all* state changes (including hidden ones)?

*This plan keeps us focused on the "Text/CLI" strength while adding the depth you requested.*
