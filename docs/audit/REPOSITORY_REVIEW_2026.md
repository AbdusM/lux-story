# Lux Story - Repository Code Review (January 2026)

**Date:** January 27, 2026
**Version:** 2.2.0
**Scope:** Full codebase analysis with focus on narrative design, state management, and architecture.

---

## 1. Executive Summary

Lux Story is a sophisticated **Interactive Fiction / RPG** built on Next.js 15, employing a custom graph-based narrative engine. It distinguishes itself by prioritizing psychological modeling ("patterns", "nervous system state") over traditional RPG statistics.

The system is architecturally ambitious, featuring a "living" narrative engine that reacts to the player's psychometric profile. However, the core orchestration logic has accumulated significant complexity, particularly in `StatefulGameInterface.tsx`, creating a risk of fragility.

---

## 2. Architecture & Components

### 2.1 Core Engine
*   **`components/StatefulGameInterface.tsx` (Monolith)**
    *   **Role:** The central nervous system of the application.
    *   **Scale:** ~4,200 lines.
    *   **Responsibilities:** Renders the game loop, handles user choices, manages audio/visual effects, processes interrupts, and acts as the bridge between UI and logic.
    *   **Assessment:** Effectively acts as the "Main" function but is overloaded. It tightly couples UI rendering with complex game logic.

### 2.2 Narrative Engine
*   **`lib/dialogue-graph.ts`**
    *   **Structure:** Graph-based node system where every node (`DialogueNode`) and choice (`ConditionalChoice`) is conditional.
    *   **Gravity:** Implements "Narrative Gravity," where choices have "weight" based on player patterns (Analytical, Helping, etc.), subtly pulling the story in thematic directions.

### 2.3 State Management (Hybrid)
*   **`lib/game-store.ts` (Zustand)**: Handles reactive UI state (messages, animations, ephemeral flags).
*   **`lib/game-state-manager.ts` (Persistence)**: Manages the `GameState` object, handling LocalStorage persistence, version migration, and backup/restore.
*   **Sync:** Data flows from `GameState` -> `StateConditionEvaluator` -> `DialogueGraphNavigator` -> UI.
*   **Note:** Recent migrations (v1->v2) established `coreGameState` as the "Single Source of Truth," but legacy getters/setters remain in Zustand to bridge the gap.

### 2.4 Interactive Modules
*   **`content/simulation-registry.ts`**: Defines "Simulations" (interactive mini-games) via a registry pattern.
*   **Phases:** Supports a 3-phase difficulty system (Intro -> Application -> Mastery).
*   **Integration:** Allows specific narrative nodes to trigger rich UI experiences (e.g., "Servo Debugger", "Mural Design").

---

## 3. Narrative Design Analysis

The narrative design is state-of-the-art for interactive fiction, leveraging a **state-driven ecosystem** rather than simple branching trees.

### 3.1 Polyvagal Theory Integration
*   The `nervousSystemState` (ventral_vagal, sympathetic, dorsal_vagal) is a first-class citizen.
*   It drives audio mixing (`LivingAtmosphere`) and text descriptions (`AmbientDescription`), creating a "Limbic Connection" where the game's atmosphere mirrors the character's biological state.

### 3.2 Pattern Voices
*   **Source:** `lib/pattern-voices.ts`
*   **Concept:** Inspired by *Disco Elysium*. As players develop patterns (e.g., Analytical), those patterns gain "Voices" that interject in the dialogue.
*   **Dynamic Tone:** Trust levels modulate these voices—low trust results in whispers, high trust in commands. This creates a feedback loop where the player's choices shape their internal monologue.

### 3.3 Character Depth
*   **Source:** `content/character-depth.ts`
*   **Mechanic:** Explicit tracking of "Vulnerabilities" and "Strengths."
*   **Growth Arcs:** Vulnerabilities are not just lore; they are gameplay triggers. Discovering a vulnerability and navigating it correctly transforms it into a Strength, altering the character's utility to the player.

---

## 4. Data Dictionary Analysis

The project uses a structured, albeit complex, data model.

### 4.1 `GameState` (The Core)
*   **Defined in:** `lib/character-state.ts`
*   **Key Fields:**
    *   `characters`: `Map<CharacterId, CharacterState>` (Trust, Anxiety, Knowledge Flags).
    *   `globalFlags`: `Set<string>` (World state).
    *   `patterns`: `Record<PatternType, number>` (The psychometric stats).
    *   `thoughts`: `ActiveThought[]` (Quest log / Internalization system).
    *   `mysteries`: Tracks investigation progress.

### 4.2 `DialogueNode`
*   **Defined in:** `lib/dialogue-graph.ts`
*   **Key Fields:**
    *   `content`: Array of text variations.
    *   `choices`: Array of `ConditionalChoice`.
    *   `onEnter` / `onExit`: `StateChange` arrays for side effects.

### 4.3 `SimulationDefinition`
*   **Defined in:** `content/simulation-registry.ts`
*   **Key Fields:**
    *   `defaultContext`: Initial state for the mini-game.
    *   `unlockRequirements`: Trust/Pattern gates.

**Critical Finding:** The `GameStore` (Zustand) acts as a wrapper. While `coreGameState` is the intended source of truth, `syncDerivedState` in `game-store.ts` manually recalculates derived values (like `visitedScenes`). This manual sync is a potential failure point.

---

## 5. Code Smells & Technical Debt

### 5.1 The "God Component"
*   **File:** `components/StatefulGameInterface.tsx`
*   **Issue:** Handles too many concerns. It calculates consequences, plays audio, renders UI, handles interrupts, and manages navigation.
*   **Risk:** High. Refactoring audio logic carries a risk of breaking dialogue flow because they are intertwined in the same 1,400-line `handleChoice` function.

### 5.2 State Synchronization
*   **File:** `lib/game-store.ts`
*   **Issue:** `syncDerivedState` must be called explicitly after state updates.
*   **Risk:** If a developer updates `coreGameState` but forgets to call sync, the UI (which reads derived values) will lag behind the logic.

### 5.3 Content Type Safety
*   **Issue:** Content is defined in massive TypeScript objects (`content/*.ts`).
*   **Risk:** While TypeSafe, there is no compile-time check that a `nextNodeId: 'maya_node_5'` actually exists. Broken links are only caught at runtime or via specific audit scripts.

---

## 6. Recommendations & Refactoring Plan

### 6.1 Immediate: Extract Logic Hooks
Break down `StatefulGameInterface.tsx` into specialized hooks:
*   `useChoiceHandler`: Extract the 1,400-line choice logic.
*   `useAudioDirector`: Centralize all `play*` and `synthEngine` calls.
*   `useNarrativeNavigator`: Encapsulate graph traversal logic.

### 6.2 Short-term: Solidify State Sync
*   Refactor `game-store.ts` to make `applyCoreStateChange` the **only** public way to modify state.
*   Ensure `applyCoreStateChange` automatically calls `syncDerivedState` internally, preventing developer error.

### 6.3 Long-term: Content Tooling
*   Implement a strict CI script (`scripts/validate-content-links.ts`) that verifies every `nextNodeId` in the content files resolves to a valid node ID in the registry.
*   This addresses the "broken link" risk without needing a full CMS.

### 6.4 Security
*   Current state is entirely local (`localStorage`).
*   **Action:** If "Leaderboards" or verified completion certificates are planned, the Supabase Auth integration (currently in progress) must extend to cloud saves to prevent trivial state editing.
