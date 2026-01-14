# 👿 Devil's Advocate Audit: "Break the Engine"

**To:** Claude Code (The Adversary)
**From:** Gemini (The Architect)
**Objective:** Stress-test the `lux-story` narrative engine by assuming the role of a malicious or chaotic actor. Do not look for what *works*. Look for what *breaks*.

---

## 🎯 Mission Profile
We have verified the "Happy Path" (Samuel -> Maya -> Success). Now we need to verify the "Chaos Path".
Your goal is to identify fragility in the State Management, Graph Logic, and Persistence layers.

## ⚔️ Attack Vectors

### 1. The "State Poisoning" Attack
**Target:** `lib/character-state.ts` & `lib/game-state-manager.ts`
**Hypothesis:** The system blindly trusts loaded JSON data, allowing invalid states to crash the UI.

**Investigation Tasks:**
1.  Analyze `StateValidation.isValidGameState`:
    *   Does it check for `NaN` or `Infinity` in numeric fields (trust/patterns)?
    *   Does it validate that `currentNodeId` actually exists in the registry?
    *   Does it verify `characterId` is one of the valid literal types, or does it accept any string?
2.  **Scenario:** If I manually edit `localStorage` and set `trust: 9999` or `trust: "high"`, does `GameStateManager.loadGameState()` catch it, or does the app crash when it tries to render a progress bar?

### 2. The "Logical Paradox" Attack
**Target:** `lib/state-condition-evaluator.ts`
**Hypothesis:** The Condition Evaluator assumes a linear progression and fails when flags conflict.

**Investigation Tasks:**
1.  Check `evaluateVisibleCondition`:
    *   What happens if a condition requires `trust: { min: 5 }` AND `relationshipStatus: 'stranger'`? (Impossible in normal gameplay, but possible via bugs).
    *   Does it fail safe (hide option) or fail open (show option)?
2.  **Scenario:** If a user has the global flag `maya_arc_complete` but is missing `met_maya`, does the `samuel-dialogue-graph` route them correctly, or does it hit a logic hole where no nodes match?

### 3. The "Softlock" Attack (Graph Integrity)
**Target:** `content/*.ts` (Dialogue Graphs)
**Hypothesis:** There are "Island Nodes" or "Dead Ends" where a player can get stuck with zero available choices.

**Investigation Tasks:**
1.  Scan the `choices` arrays in `samuel-dialogue-graph.ts` and `maya-dialogue-graph.ts`.
2.  **Crucial Check:** Are there any nodes (besides explicit endings) that have `choices: []`?
3.  **Condition Trap:** Are there nodes where *all* choices are conditional?
    *   *Example:* Choice A requires `trust > 5`. Choice B requires `trust < 3`.
    *   *Result:* If `trust == 4`, the player has 0 choices and the game softlocks.
    *   *Action:* Search for nodes with extensive `visibleCondition` usage and verify coverage.

### 4. The "Race Condition" Attack
**Target:** `components/StatefulGameInterface.tsx` -> `handleChoice`
**Hypothesis:** The engine does not handle rapid-fire inputs or async state updates correctly.

**Investigation Tasks:**
1.  Analyze `handleChoice` function:
    *   Is there an `isProcessing` lock that *actually* prevents a second click while the first is resolving?
    *   Does the state update rely on `prev` state correctly?
2.  **Scenario:** If a user clicks "Option A" and "Option B" within 50ms (double tap), does the engine process both?
    *   Could this trigger double skill points?
    *   Could this push two nodes into history but only render one?

### 5. The "Null Pointer" Attack (Data Integrity)
**Target:** `lib/graph-registry.ts` -> `findCharacterForNode`
**Hypothesis:** The system assumes every node ID is unique across all files, but collisions or missing IDs will cause silent failures.

**Investigation Tasks:**
1.  Search for cross-graph links (e.g., Samuel linking to `maya_introduction`).
2.  Verify `getGraphForCharacter`: What happens if `state.currentCharacterId` is valid, but the `currentNodeId` actually belongs to a *different* character?
    *   (e.g., Current Char: 'samuel', Node: 'maya_intro').
    *   Does the registry resolve the graph dynamically, or does it look for 'maya_intro' inside Samuel's graph and return `undefined`?

---

## 📝 Deliverables

Produce a report titled `DEVIL_AUDIT_FINDINGS.md` with:

1.  **Vulnerability Severity:** (Critical / Moderate / Low / Theoretical)
2.  **The Exploit:** "If I do X, Y happens."
3.  **The Fix:** "Add a check for Z in file A."

**Go hunt.**
