# StatefulGameInterface.tsx Structure Analysis

**Date:** January 7, 2026
**File Size:** 3,363 LOC
**Purpose:** Assess splitting feasibility per Sprint 2 refactoring plan

---

## Structure Breakdown

| Section | Lines | LOC | Description |
|---------|-------|-----|-------------|
| Imports | 1-145 | 145 | 80+ imports from lib, content, components |
| Types | 147-203 | 56 | GameInterfaceState interface |
| Helpers | 204-248 | 44 | shouldShowInterrupt, AmbientDescriptionDisplay |
| Component Start | 249-317 | 68 | Refs, initial state, memos |
| State Declarations | 318-408 | 90 | useState hooks (12 state variables) |
| Memos | 409-455 | 46 | currentEmotion, getDominantPattern |
| Idle Timer | 456-532 | 76 | resetIdleTimer, ambient events |
| Init & Reset | 533-840 | 307 | handleAtmosphericIntroStart, initializeGame, emergencyReset |
| **handleChoice** | **841-2291** | **1,450** | **Main choice handler - MASSIVE** |
| Node Effects | 2292-2346 | 54 | useEffect for node changes |
| Interrupt Handlers | 2347-2535 | 188 | handleInterruptTrigger, handleInterruptTimeout |
| Return Handler | 2536-2767 | 231 | handleReturnToStation |
| Experience Handler | 2768-2792 | 24 | handleExperienceChoice |
| **Render** | **2793-3363** | **570** | **JSX render block** |

---

## State Variables (12 total)

```typescript
// Core game state
const [state, setState] = useState<GameInterfaceState>({...})

// UI state
const [hasSaveFile, setHasSaveFile] = useState(false)
const [_saveIsComplete, setSaveIsComplete] = useState(false)

// (Identified via grep - full list in component)
```

---

## Critical Finding: handleChoice is 1,450 Lines

The `handleChoice` callback (lines 841-2291) is **43% of the entire file**.

### What handleChoice Does:

1. **State updates** - Trust changes, pattern changes, knowledge flags
2. **Audio feedback** - Pattern sounds, trust sounds, identity sounds
3. **Consequence echoes** - Pattern recognition, milestone echoes
4. **Derivative calculations** - Trust, pattern, character, narrative derivatives
5. **Story arc progression** - Arc unlocks, chapter completion
6. **Cross-character memory** - Echo queues, check-ins
7. **Achievement checking** - Meta-achievements, pattern achievements
8. **Telemetry** - Dashboard feed, analytics
9. **Navigation** - Node transitions, graph navigation

### Extraction Candidates from handleChoice:

| Subsystem | Est. Lines | Extractable? |
|-----------|-----------|--------------|
| Consequence processing | ~200 | ✅ Yes - ConsequenceProcessor |
| Echo generation | ~150 | ✅ Yes - EchoManager |
| Derivative calculations | ~250 | ✅ Yes - Already in lib/derivatives |
| Achievement checking | ~100 | ✅ Yes - AchievementChecker |
| Audio feedback | ~80 | ✅ Yes - AudioFeedbackManager |
| Story arc updates | ~100 | ✅ Yes - StoryArcManager |
| State updates | ~300 | ⚠️ Partial - Core logic must stay |
| Navigation | ~200 | ⚠️ Partial - Tightly coupled to state |

---

## Render Section Analysis (570 lines)

The render section includes:

1. **Intro screens** (~50 lines) - AtmosphericIntro
2. **Journey complete screen** (~100 lines) - JourneySummary, IdentityCeremony
3. **Loading states** (~30 lines)
4. **Main game UI** (~390 lines):
   - Game header with character info
   - Dialogue display
   - Interrupt buttons
   - Choice buttons
   - Journal/Constellation panels

### Render Extraction Candidates:

| Component | Est. Lines | Extractable? |
|-----------|-----------|--------------|
| GameHeader | ~60 | ✅ Yes |
| DialogueSection | ~100 | ✅ Yes |
| ChoiceSection | ~80 | ⚠️ Tightly coupled to handlers |
| SidePanel (Journal/Constellation) | ~80 | ✅ Already separate components |

---

## Split Decision Criteria

### Do We Split?

**Criteria from Refactoring Guide:**
1. ❌ >3 distinct responsibilities? **YES** (10+ responsibilities identified)
2. ❌ >2 developers editing simultaneously? **Unknown** (solo project)
3. ❌ Test difficulties? **Moderate** (1450-line callback is hard to test)

### Recommendation: **PARTIAL EXTRACTION**

Full split is risky for a solo project. Instead:

1. **Extract handleChoice subsystems** into separate hooks:
   - `useConsequenceProcessor` - Echo and consequence logic
   - `useGameAudio` - All audio feedback (already have synthEngine)
   - `useStoryArcProgress` - Story arc management
   - `useAchievements` - Achievement checking

2. **Keep core state management in place** - Too risky to restructure

3. **Document with section comments** - Add clear section markers

---

## Recommended Refactoring (If Proceeding)

### Phase 1: Documentation (2 hours)
- Add section header comments with line ranges
- Add JSDoc to handleChoice explaining subsystems

### Phase 2: Hook Extraction (8-12 hours)
Extract these as custom hooks:

```typescript
// hooks/useConsequenceProcessor.ts
export function useConsequenceProcessor(gameState: GameState) {
  // Move echo generation, consequence application
}

// hooks/useGameAudio.ts
export function useGameAudio() {
  // Move audio feedback logic
}

// hooks/useStoryArcProgress.ts
export function useStoryArcProgress(gameState: GameState) {
  // Move story arc management
}
```

### Phase 3: Test Coverage (4 hours)
- Add tests for extracted hooks
- Verify game still works end-to-end

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Breaking game flow | High | Extensive E2E testing |
| State sync issues | Medium | Keep state in main component |
| Performance regression | Low | Hooks are memoized |
| Increased complexity | Medium | Clear documentation |

---

## Conclusion

**Verdict: DOCUMENT FIRST, EXTRACT SELECTIVELY**

The file is large but functional. Given this is a solo project:

1. ✅ Add section documentation now (low risk, 2 hours)
2. ⚠️ Extract hooks incrementally as needed
3. ❌ Don't do full split unless pain points emerge

The handleChoice callback is the main issue. It could benefit from extraction, but the risk/reward ratio suggests documenting it well first, then extracting only if testing or maintenance becomes problematic.

---

## Quick Commands for Future Analysis

```bash
# Count lines in handleChoice
sed -n '841,2291p' components/StatefulGameInterface.tsx | wc -l

# Find all state updates in handleChoice
sed -n '841,2291p' components/StatefulGameInterface.tsx | grep -c "setState"

# Find all derivative calls
sed -n '841,2291p' components/StatefulGameInterface.tsx | grep -E "calculate|Derivative"
```

---

**Status:** Analysis Complete
**Recommendation:** Document sections, defer splitting
