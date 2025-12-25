# LUX STORY - INVARIANTS LIST
## Phase 0.3 Deliverable - What Must Always Be True

**Created:** December 25, 2025
**Purpose:** Document invariants that must NEVER be violated for the game to function

---

## CRITICAL INVARIANTS

### 1. Trust Bounds
```
INVARIANT: 0 <= trust <= 10 for all characters at all times
```

**Enforcement:** `lib/character-state.ts:329-332`
```typescript
charState.trust = Math.max(MIN_TRUST, Math.min(MAX_TRUST, charState.trust + modifiedTrust))
```

**Consequences of Violation:**
- UI displays incorrect trust indicators
- Relationship status calculations break
- Conditional dialogue gating fails

---

### 2. Anxiety Derivation
```
INVARIANT: anxiety = (10 - trust) * 10
```

**Enforcement:** `lib/character-state.ts:337`

**Meaning:**
- Trust 10 → Anxiety 0 (calm)
- Trust 5 → Anxiety 50 (moderate)
- Trust 0 → Anxiety 100 (panic)

**Consequences of Violation:**
- NervousSystemState calculation incorrect
- Character reactions inconsistent

---

### 3. Map/Set Consistency
```
INVARIANT: After deserialization, characters MUST be a Map, globalFlags MUST be a Set
```

**Enforcement:** `lib/character-state.ts:576-598`

**Current Issue:** `syncDerivedState` doesn't properly hydrate Maps/Sets

**Consequences of Violation:**
- `.get()` fails silently on plain objects
- `.has()` fails on arrays
- Silent data corruption

---

### 4. Node Existence
```
INVARIANT: Every nextNodeId in a ConditionalChoice MUST exist in the dialogue graph
```

**Enforcement:** Runtime check in `DialogueGraphNavigator.getAvailableNodes`

**Fallback:** Auto-fallback shows all choices if none visible (prevents deadlock)

**Consequences of Violation:**
- Player stuck at node with no exit
- Game state corrupted

---

### 5. Single Source of Truth
```
INVARIANT: coreGameState is the ONLY source of truth for game state
```

**Current Violation:** Derived fields (`characterTrust`, `patterns`, `thoughts`) exist in Zustand store and can desync from `coreGameState`

**Consequences of Violation:**
- UI shows stale data
- State corruption
- Bug reports: "side menu shows wrong trust"

---

### 6. Character ID Validity
```
INVARIANT: currentCharacterId MUST be one of the 11 valid character IDs
```

**Valid IDs:** `'samuel' | 'maya' | 'devon' | 'jordan' | 'marcus' | 'tess' | 'yaquin' | 'kai' | 'alex' | 'rohan' | 'silas'`

**Enforcement:** `isValidCharacterId()` from `lib/graph-registry.ts`

---

### 7. Pattern Type Validity
```
INVARIANT: Pattern changes MUST only use valid pattern types
```

**Valid Types:** `'analytical' | 'patience' | 'exploring' | 'helping' | 'building'`

**Enforcement:** `isValidPattern()` from `lib/patterns.ts`
- Checked in `applyStateChange`: invalid patterns skipped with warning

---

### 8. Save Version Compatibility
```
INVARIANT: saveVersion MUST be parseable and migratable
```

**Current Version:** `"1.0.0"`

**Enforcement:** Migration function in Zustand persist middleware

---

### 9. Serialization Round-Trip
```
INVARIANT: serialize(deserialize(x)) ≈ x (structurally equivalent)
```

**Key Points:**
- Map ↔ Array conversion must be lossless
- Set ↔ Array conversion must be lossless
- Missing fields get defaults (migration support)

---

## STATE INVARIANTS

### Trust → Relationship Status Mapping
```
trust < 2  → 'stranger'
trust >= 2 → 'acquaintance' (auto or explicit)
trust >= 4 → 'friendly' (intermediate)
trust >= 6 → 'trusted' (intermediate)
trust >= 8 → 'confidant' (auto or explicit)
```

**Note:** `setRelationshipStatus` in StateChange overrides auto-update

---

### Pattern → Orb Fill Calculation
```
orbFillPercentage = (patternValue / MAX_ORB_COUNT) * 100
MAX_ORB_COUNT = 100
```

**Range:** 0% to 100% (no upper bound enforcement currently - ISSUE)

---

### Session Boundaries
```
SESSION_BOUNDARY_MIN_NODES = 8   // Don't show before 8 nodes
SESSION_BOUNDARY_MAX_NODES = 12  // Force show by 12 nodes
```

---

## DIALOGUE INVARIANTS

### Choice Visibility Fallback
```
INVARIANT: If NO choices are visible, ALL choices become visible
```

**Purpose:** Prevent deadlock from misconfigured gating

**Enforcement:** `StateConditionEvaluator.evaluateChoices` - auto-fallback safety

---

### Content Existence
```
INVARIANT: Every DialogueNode MUST have at least one DialogueContent
```

**Fallback:** Returns `{ text: '[Missing content]', variation_id: 'error' }`

---

### Speaker Validity
```
INVARIANT: speaker MUST be a valid character name or 'Narrator'
```

**Used For:** Character avatar display, voice typography

---

## UI INVARIANTS

### Choice Container Height
```
INVARIANT: Choice container MUST be at least 140px
```

**Purpose:** Prevent layout shift when choices load

---

### Avatar Size
```
INVARIANT: Character avatars are 32×32 pixels
```

---

### Touch Target Size
```
INVARIANT: Touch targets MUST be at least 44×44px (Apple HIG)
```

---

## PERSISTENCE INVARIANTS

### LocalStorage Key
```
INVARIANT: Game state persists to 'grand-central-game-store' key
```

**Format:** JSON-serialized SerializableGameState

---

### Sync Queue Durability
```
INVARIANT: Failed syncs MUST be queued and retried
```

**Behavior:** Offline-first, exponential backoff retry

---

## TIMING INVARIANTS

### Choice Handler Timeout
```
INVARIANT: Choice handler MUST complete or timeout within 10 seconds
```

**Enforcement:** `CHOICE_HANDLER_TIMEOUT_MS = 10000`

**Purpose:** Prevent infinite loading states

---

### Pattern Sensation Probability
```
INVARIANT: Pattern sensation shows with 30% probability
```

**Enforcement:** `Math.random() < PATTERN_SENSATION_PROBABILITY`

---

## SECURITY INVARIANTS

### Admin Authentication
```
INVARIANT: Admin routes MUST verify session token
```

**Current Issue:** Weak authentication (plaintext password comparison)

---

### User Data Isolation
```
INVARIANT: Users can only access their own data
```

**Current Issue:** No user authentication on `/api/user/*` routes

---

## ASSUMPTIONS THE CODE MAKES

### 1. Browser Environment
- `localStorage` is available
- `window` object exists (checked before telemetry emit)
- Modern JavaScript features supported

### 2. Network Availability
- Sync queue handles offline gracefully
- Static export mode detected and handled

### 3. Character Initialization
- All 11 characters exist in initial state
- `characters.get(id)` won't return undefined for valid IDs

### 4. Graph Completeness
- Start node exists in every graph
- No orphaned nodes (all reachable from start)

### 5. Time Progression
- Session start time is set on game start
- Episode number increments correctly

---

## INVARIANTS CURRENTLY VIOLATED

| Invariant | Violation | Impact |
|-----------|-----------|--------|
| Single Source of Truth | Dual state (coreGameState + derived fields) | State desync |
| Map/Set Hydration | syncDerivedState doesn't restore Maps/Sets | Silent failures |
| Pattern Upper Bound | No MAX_PATTERN constant enforced | Patterns can exceed 100 |
| User Data Isolation | No auth on user routes | Security vulnerability |
| Admin Auth Security | Plaintext password comparison | Security vulnerability |

---

*This document lists invariants that MUST be maintained. Violations lead to bugs, security issues, or corrupted state.*
