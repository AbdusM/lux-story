# LUX STORY - MANUAL TRACE
## Phase 0.4 Deliverable - Choice Flow Through All Systems

**Created:** December 25, 2025
**Purpose:** Trace one complete player choice through ALL systems by hand

---

> NOTE (Feb 9, 2026): This archived trace may reference the old "AUTO-FALLBACK" behavior. That behavior has been removed and replaced with a single safe **Deadlock Recovery** choice (no gated-content reveal). Current contract docs: `docs/reference/data-dictionary/05-dialogue-system.md`.

## TRACE: Player Clicks a Choice

We trace: Player clicks Maya's first choice in `maya-dialogue-graph.ts`

---

## STEP 1: CLICK ENTERS SYSTEM

**File:** `components/StatefulGameInterface.tsx`
**Line:** 564

```typescript
const handleChoice = useCallback(async (choice: EvaluatedChoice) => {
```

**What happens:**
1. `initializeAudio()` called - first user interaction enables audio on mobile
2. Race condition check: `if (isProcessingChoiceRef.current) return`
3. State validation: `if (!state.gameState || !choice.enabled) return`

---

## STEP 2: LOCK ACQUIRED

**File:** `components/StatefulGameInterface.tsx`
**Lines:** 572-583

```typescript
// LOCK: Immediate ref lock + UI state update
isProcessingChoiceRef.current = true
setState(prev => ({ ...prev, isProcessing: true }))

// Safety timeout: auto-reset lock if handler crashes or hangs
const safetyTimeout = setTimeout(() => {
  if (isProcessingChoiceRef.current) {
    isProcessingChoiceRef.current = false  // [RACE CONDITION ISSUE]
    setState(prev => ({ ...prev, isProcessing: false }))
  }
}, CHOICE_HANDLER_TIMEOUT_MS)  // 10 seconds
```

**ISSUE FOUND:** Safety timeout can reset lock while handler is still running.
The timeout should log a warning but NOT reset the lock.

---

## STEP 3: GAME LOGIC PROCESSES CHOICE

**File:** `components/StatefulGameInterface.tsx`
**Line:** 591

```typescript
const result = GameLogic.processChoice(state.gameState, choice)
```

**Flow into:** `lib/game-logic.ts:198-247`

```typescript
static processChoice(state: GameState, evaluatedChoice: EvaluatedChoice): ChoiceProcessingResult {
    const choice = evaluatedChoice.choice
    let newState = state

    // 1. Apply explicit consequences (from dialogue graph JSON)
    if (choice.consequence) {
        newState = GameStateUtils.applyStateChange(newState, choice.consequence)
    }

    // 2. Apply Pattern Changes (with identity bonus math)
    if (choice.pattern) {
        const baseGain = 1
        const modifiedGain = calculatePatternGain(baseGain, choice.pattern, newState)
        newState = GameStateUtils.applyStateChange(newState, {
            patternChanges: { [choice.pattern]: modifiedGain }
        })

        // 30% chance of sensation
        if (isValidPattern(choice.pattern) && Math.random() < 0.3) {
            patternSensation = getPatternSensation(choice.pattern)
        }
    }

    // 3. Calculate Trust Delta
    const trustBefore = state.characters.get(currentCharacterId)?.trust ?? 0
    const trustAfter = newState.characters.get(currentCharacterId)?.trust ?? 0
    const trustDelta = trustAfter - trustBefore

    // 4. Determine Side Effects/Events
    // - earnOrb
    // - playSound
    // - checkIdentityThreshold
    // - updateSkills
}
```

---

## STEP 4: STATE MUTATION (applyStateChange)

**File:** `lib/character-state.ts`
**Lines:** 229-401

```typescript
static applyStateChange(gameState: GameState, change: StateChange): GameState {
    // 1. Validate characterId
    if (change.characterId && !isValidCharacterId(change.characterId)) {
        return gameState  // Unchanged
    }

    // 2. Validate pattern changes
    if (change.patternChanges) {
        for (const pattern of Object.keys(change.patternChanges)) {
            if (!isValidPattern(pattern)) {
                delete change.patternChanges[pattern]  // Skip invalid
            }
        }
    }

    // 3. Deep clone the game state
    const newState = this.cloneGameState(gameState)

    // 4. Apply global flag changes
    if (change.addGlobalFlags) {
        change.addGlobalFlags.forEach(flag => newState.globalFlags.add(flag))
    }

    // 5. Apply pattern changes
    if (change.patternChanges) {
        Object.entries(change.patternChanges).forEach(([pattern, value]) => {
            newState.patterns[pattern] += value
        })
    }

    // 6. Handle character-specific changes
    if (change.characterId) {
        const charState = newState.characters.get(change.characterId)

        // Trust with resonance calculation
        if (change.trustChange !== undefined) {
            const { modifiedTrust } = calculateResonantTrustChange(...)

            // [MUTATION ISSUE] Direct assignment instead of immutable update
            charState.trust = Math.max(MIN_TRUST, Math.min(MAX_TRUST,
                charState.trust + modifiedTrust))

            // Derived calculations
            charState.anxiety = (10 - charState.trust) * 10
            charState.nervousSystemState = determineNervousSystemState(...)
            charState.lastReaction = calculateReaction(...)

            // Telemetry emit
            if (typeof window !== 'undefined') {
                import('@/lib/telemetry/dashboard-feed').then(...)
            }
        }
    }

    return newState
}
```

**ISSUE FOUND:** `charState.trust = ...` directly mutates the cloned state object.
While the parent object is cloned, the nested CharacterState is mutated in place.
Should be: `newState.characters.set(id, { ...charState, trust: newTrust })`

---

## STEP 5: RENDER UPDATES

**File:** `components/StatefulGameInterface.tsx`
**Lines:** 600-712

1. **Process Orb Events** (lines 601-614)
   - Call `earnOrb(result.events.earnOrb)`
   - Check for identity threshold crossing
   - Play identity sound if threshold crossed

2. **Process Audio Events** (lines 617-621)
   - Play pattern sounds via `playPatternSound(id)`

3. **Process Skill Updates** (lines 624-637)
   - Calculate skill increments
   - Call `useGameStore.getState().updateSkills(skillUpdates)`

4. **Generate Visual Feedback** (lines 639-672)
   - Pattern sensation text
   - Consequence echoes for trust changes
   - Pattern recognition echoes at thresholds
   - Orb milestone echoes (Samuel only)

5. **Check Transformation Eligibility** (lines 676-712)
   - Cross-reference trust + flags + patterns
   - Mark transformation as witnessed
   - Apply transformation consequences

---

## STEP 6: SYNC TO ZUSTAND

**File:** `components/StatefulGameInterface.tsx`
**Line:** 716

```typescript
useGameStore.getState().setCoreGameState(GameStateUtils.serialize(newGameState))
```

**What happens:**
1. `GameStateUtils.serialize()` converts Map/Set to arrays
2. `setCoreGameState()` updates Zustand store
3. Zustand `persist` middleware writes to localStorage
4. Key: `grand-central-game-store`

**ISSUE FOUND:** This triggers `syncDerivedState()` which creates bidirectional sync.
The derived fields (`characterTrust`, `patterns`, `thoughts`) are redundant.

---

## STEP 7: NAVIGATE TO NEXT NODE

**File:** `components/StatefulGameInterface.tsx`
**Lines:** 721-754

```typescript
const searchResult = findCharacterForNode(choice.choice.nextNodeId, newGameState)
// Error handling if node not found...

const nextNode = searchResult.graph.nodes.get(choice.choice.nextNodeId)
// Error handling if node not in graph...
```

**Flow into:** `lib/graph-registry.ts`
- Searches all 11 character graphs
- Returns `{ graph, characterId }` or null

---

## STEP 8: APPLY onEnter CHANGES

**File:** `components/StatefulGameInterface.tsx`
**Lines:** 762-774

```typescript
if (nextNode.onEnter) {
    for (const change of nextNode.onEnter) {
        newGameState = GameStateUtils.applyStateChange(newGameState, change)

        // Detect identity internalization for ceremony
        if (change.internalizeThought && change.thoughtId?.startsWith('identity-')) {
            identityCeremonyPattern = patternName
        }
    }
}
```

---

## STEP 9: UPDATE CONVERSATION HISTORY

**File:** `components/StatefulGameInterface.tsx`
**Lines:** 776-779

```typescript
const targetCharacter = newGameState.characters.get(targetCharacterId)!
targetCharacter.conversationHistory.push(nextNode.nodeId)  // [MUTATION]
newGameState.currentNodeId = nextNode.nodeId
newGameState.currentCharacterId = targetCharacterId
```

**ISSUE FOUND:** Direct mutation of `conversationHistory` array.

---

## STEP 10: EVALUATE NEW CHOICES

**File:** `components/StatefulGameInterface.tsx`
**Lines:** 793-794

```typescript
const content = DialogueGraphNavigator.selectContent(nextNode, ...)
const newChoices = StateConditionEvaluator.evaluateChoices(nextNode, newGameState, targetCharacterId)
    .filter(c => c.visible)
```

**Flow into:** `lib/dialogue-graph.ts:349-402`

```typescript
static evaluateChoices(node, gameState, characterId): EvaluatedChoice[] {
    const evaluated = node.choices.map(choice => {
        const visible = this.evaluate(choice.visibleCondition, gameState, characterId)
        const enabled = visible && this.evaluate(choice.enabledCondition, gameState, characterId)
        // ...
    })

    // SAFETY NET: If NO choices visible, show ALL
    if (visibleCount === 0 && node.choices.length > 0) {
        console.warn('[AUTO-FALLBACK] No visible choices...')
        return node.choices.map(c => ({ ...c, visible: true, enabled: true }))
    }
}
```

---

## STEP 11: SKILL TRACKING

**File:** `components/StatefulGameInterface.tsx`
**Lines:** 816-850

```typescript
if (skillTrackerRef.current && choice.choice.skills) {
    demonstratedSkills = choice.choice.skills

    // Build context string
    let context = `In conversation with ${speaker}, ...`

    skillTrackerRef.current.recordSkillDemonstration(
        state.currentNode.nodeId,
        choice.choice.choiceId,
        demonstratedSkills,
        context
    )
}
```

**Flow into:** SyncQueue for Supabase persistence

---

## STEP 12: FINAL STATE UPDATE

```typescript
setState(prev => ({
    ...prev,
    gameState: newGameState,
    currentNode: nextNode,
    currentCharacterId: targetCharacterId,
    availableChoices: newChoices,
    currentContent: reflected.text,
    // ...
}))
```

---

## STEP 13: UNLOCK

```typescript
clearTimeout(safetyTimeout)
isProcessingChoiceRef.current = false
setState(prev => ({ ...prev, isProcessing: false }))
```

---

## COMPLETE FLOW DIAGRAM

```
Player Click
    │
    ▼
handleChoice (lock acquired)
    │
    ▼
GameLogic.processChoice()
    │
    ├─► Apply consequences (GameStateUtils.applyStateChange)
    │       ├─► Clone state
    │       ├─► Apply global flags
    │       ├─► Apply patterns
    │       └─► Apply trust/anxiety/nervous state
    │
    ├─► Calculate trust delta
    │
    └─► Generate events (orb, sound, skills)
    │
    ▼
Render Updates
    ├─► earnOrb()
    ├─► playPatternSound()
    ├─► updateSkills()
    ├─► Consequence echoes
    └─► Transformation check
    │
    ▼
Sync to Zustand
    ├─► setCoreGameState(serialize(newState))
    ├─► persist middleware → localStorage
    └─► [ISSUE] syncDerivedState() creates duplicate
    │
    ▼
Navigate to Next Node
    ├─► findCharacterForNode()
    ├─► Apply onEnter changes
    ├─► Update conversation history
    └─► Evaluate new choices
    │
    ▼
Skill Tracking
    └─► SyncQueue → Supabase
    │
    ▼
Final setState
    │
    ▼
Unlock (clearTimeout, reset ref)
```

---

## ISSUES DISCOVERED

| Issue | Location | Impact |
|-------|----------|--------|
| Race condition in timeout | StatefulGameInterface.tsx:576-582 | Lock reset while running |
| Direct mutation of charState | character-state.ts:329 | Partial immutability |
| Direct mutation of conversationHistory | StatefulGameInterface.tsx:777 | Array mutation |
| Bidirectional sync | game-store.ts syncDerivedState | State desync |
| Missing clearTimeout in error paths | StatefulGameInterface.tsx | Memory leak |

---

*This trace documents the complete flow of a player choice through all systems. Issues found will be addressed in Phase 2.*
