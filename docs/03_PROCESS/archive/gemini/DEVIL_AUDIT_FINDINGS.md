# 👿 Devil's Advocate Audit: Findings

**To:** Gemini (The Architect)
**From:** Gemini (The Investigator)
**Date:** 2025-11-24
**Status:** ⚠️ VULNERABILITIES FOUND

---

## 🚨 Executive Summary
The audit has identified **2 confirmed vulnerabilities** and **1 theoretical risk**.
The most critical issue is a **Race Condition** in the input handler that allows double-submission of choices, leading to state corruption (duplicate skill tracking) and potential narrative instability.

---

## ⚔️ Findings Detail

### 1. 🔴 The "Speedrunner" Attack (Race Condition)
**Severity:** **HIGH**
**Location:** `components/StatefulGameInterface.tsx` -> `handleChoice`

**The Exploit:**
The `handleChoice` function is `async` but lacks a synchronous lock.
1.  Player clicks "Option A".
2.  `handleChoice` begins execution. It reads `state.gameState`.
3.  Player clicks "Option A" again (or "Option B") within ~50ms.
4.  The second `handleChoice` execution begins. Because React's `setState` is asynchronous and hasn't fired/completed yet, `state.gameState` is **identical** to step 2.
5.  **Result:** Both clicks process.
    *   Skill points are awarded twice.
    *   Analytics events are fired twice.
    *   If the choices branch differently, the *last* one to finish `setState` wins the UI, but the *first* one's side effects (e.g., external analytics calls) still happened.

**The Fix:**
Introduce a `useRef` lock (e.g., `isProcessingRef`) that is checked and set *synchronously* at the start of `handleChoice`.

```typescript
const isProcessingRef = useRef(false)

const handleChoice = useCallback(async (choice) => {
  if (isProcessingRef.current) return
  isProcessingRef.current = true
  
  // ... logic ...
  
  // On completion/error:
  isProcessingRef.current = false
}, [])
```

---

### 2. 🟠 The "State Poisoning" Attack
**Severity:** **MODERATE**
**Location:** `lib/character-state.ts` -> `StateValidation`

**The Exploit:**
The validation logic checks `typeof value === 'number'` but does not reject `NaN` or `Infinity`.
1.  Attacker modifies `localStorage` to set `trust: NaN`.
2.  Game loads successfully.
3.  **Result:**
    *   Progress bars width becomes `NaN%`, potentially crashing the rendering engine or showing broken UI.
    *   Calculations like `trust + 1` result in `NaN`, permanently corrupting the save file.
    *   `currentNodeId` is checked for string type but not existence in registry. Loading a save with `currentNodeId: "non_existent"` will load the game but render a blank/broken interface.

**The Fix:**
Update `StateValidation` to explicitly check `!isNaN(value)` and `isFinite(value)`. Add a registry check for `currentNodeId` during load.

---

### 3. 🟡 The "Softlock" Attack (Theoretical)
**Severity:** **LOW**
**Location:** `content/samuel-dialogue-graph.ts`

**The Risk:**
The `StateConditionEvaluator` safely returns `false` for conflicting conditions (e.g., requiring both Flag A and No-Flag A).
However, if a node has **only** conditional choices, and those conditions become mutually exclusive or impossible (e.g., requiring higher trust than possible at that stage), the player will be presented with **zero choices**.

**Status:**
Audit of `samuel_hub_after_maya` shows the `meet_devon` choice has **no** conditions. This is a good pattern (Safety Valve).
**Recommendation:** Enforce a linting rule or test that ensures every node has at least one unconditional "fallback" choice, OR mathematically prove coverage of conditional sets.

---

## ✅ Passed Checks

*   **Null Pointer Attack:** `lib/graph-registry.ts` safely returns `null` for missing nodes, and the UI handles this gracefully (no crash).
*   **Data Integrity:** Revisit graphs are correctly prioritized in the registry logic.

---

## 🚀 Next Steps
1.  **IMMEDIATE:** Patch `StatefulGameInterface.tsx` to fix the Race Condition.
2.  **HIGH:** Hardening `StateValidation` in `lib/character-state.ts`.
3.  **LOW:** Run a "Softlock Scanner" script on all content files.
