# Backlog Cleanup Plan

**Status:** 📋 DRAFT - Awaiting Review
**Created:** 2026-02-04
**Author:** Claude Code
**Estimated Total Effort:** 5-7 days

---

## Executive Summary

Three remaining backlog items from the Deepening Implementation Plan:

| # | Item | Priority | Effort | Dependencies |
|---|------|----------|--------|--------------|
| 1 | TD-003: ESLint cleanup in SGI | P2 | 2-3 days | None |
| 2 | TD-005: localStorage consolidation | P2 | 2 days | None |
| 3 | Platform resonance UI | P2 | 4-6 hrs | TD-005 |

**Recommendation:** Execute in order (TD-003 → TD-005 → Platform) or parallelize TD-003 and TD-005.

---

## 1. TD-003: ESLint Cleanup in StatefulGameInterface

### Problem Statement

`StatefulGameInterface.tsx` has 4 file-level ESLint suppressions that mask potential issues:

```typescript
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
```

These were added during rapid development and should be removed to:
- Catch actual bugs
- Improve code quality
- Enable stricter CI checks

### Current State

**File:** `components/StatefulGameInterface.tsx`
**Lines:** ~1,200
**Complexity:** HIGH (core game orchestration component)

**Suppressed Rules:**
| Rule | Count | Risk |
|------|-------|------|
| `no-unused-vars` | ~5-10 | LOW - cleanup only |
| `no-explicit-any` | ~8-12 | MEDIUM - type safety |
| `exhaustive-deps` | ~3-5 | HIGH - potential bugs |
| `no-unsafe-assignment` | ~2-4 | MEDIUM - type safety |

### Implementation Plan

#### Phase 1: Audit (2 hours)

1. Remove suppressions temporarily
2. Run `npm run lint` to get full error list
3. Categorize errors by type and severity
4. Create prioritized fix list

**Command:**
```bash
# Temporarily remove suppressions and count errors
sed -i '' '/eslint-disable/d' components/StatefulGameInterface.tsx
npm run lint -- --format json > sgi-lint-errors.json
```

#### Phase 2: Fix Unused Variables (2 hours)

**Approach:** Remove or use each unused variable

```typescript
// BEFORE
const unusedState = useState(false)

// AFTER (if truly unused)
// Delete the line

// AFTER (if needed for future)
const _futureState = useState(false) // Prefix with underscore
```

**Checklist:**
- [ ] List all unused variables
- [ ] Determine if each is truly unused or just missing usage
- [ ] Remove or prefix with underscore
- [ ] Verify no runtime errors

#### Phase 3: Fix Explicit Any (4 hours)

**Approach:** Replace `any` with proper types

**Common Patterns:**

```typescript
// BEFORE
const handleChoice = (choice: any) => { ... }

// AFTER
import type { DialogueChoice } from '@/lib/dialogue-graph'
const handleChoice = (choice: DialogueChoice) => { ... }
```

```typescript
// BEFORE
const [state, setState] = useState<any>(null)

// AFTER
interface LocalState {
  processing: boolean
  error: string | null
}
const [state, setState] = useState<LocalState | null>(null)
```

**Known `any` Locations:**
| Location | Current Type | Suggested Type |
|----------|--------------|----------------|
| Choice handlers | `any` | `DialogueChoice` |
| State updates | `any` | `Partial<GameState>` |
| Event handlers | `any` | `React.MouseEvent` / `React.KeyboardEvent` |
| API responses | `any` | Define response interfaces |

#### Phase 4: Fix Exhaustive Deps (3 hours)

**Approach:** Add missing deps or restructure hooks

**WARNING:** This is the highest-risk phase. Each fix must be tested.

```typescript
// BEFORE (missing dep)
useEffect(() => {
  processNode(currentNodeId)
}, []) // Missing: currentNodeId, processNode

// AFTER (Option A: Add deps)
useEffect(() => {
  processNode(currentNodeId)
}, [currentNodeId, processNode])

// AFTER (Option B: useCallback for stable reference)
const processNodeStable = useCallback((nodeId: string) => {
  // ... implementation
}, [dependencies])

useEffect(() => {
  processNodeStable(currentNodeId)
}, [currentNodeId, processNodeStable])
```

**Testing Protocol:**
1. Fix one hook at a time
2. Run unit tests after each fix
3. Manual test game flow
4. Watch for infinite loops or missing updates

#### Phase 5: Fix Unsafe Assignment (2 hours)

**Approach:** Add type guards or assertions

```typescript
// BEFORE
const data = JSON.parse(response) // unsafe assignment

// AFTER
interface ExpectedResponse {
  nodeId: string
  content: string[]
}

function isExpectedResponse(data: unknown): data is ExpectedResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'nodeId' in data &&
    'content' in data
  )
}

const parsed = JSON.parse(response)
if (!isExpectedResponse(parsed)) {
  throw new Error('Invalid response format')
}
const data = parsed // Now typed correctly
```

#### Phase 6: Verification (2 hours)

1. Run full lint check: `npm run lint`
2. Run type check: `npm run type-check`
3. Run unit tests: `npm test`
4. Run build: `npm run build`
5. Manual smoke test of core game loop

### Deliverables

- [ ] All 4 ESLint suppressions removed
- [ ] Zero lint errors in SGI
- [ ] All tests passing
- [ ] No runtime regressions

### Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Infinite loop from deps fix | MEDIUM | HIGH | Test each hook individually |
| Type errors cascade | LOW | MEDIUM | Fix in small batches |
| Runtime errors | LOW | HIGH | Comprehensive manual testing |

### Estimated Effort

| Phase | Hours |
|-------|-------|
| Audit | 2 |
| Unused vars | 2 |
| Explicit any | 4 |
| Exhaustive deps | 3 |
| Unsafe assignment | 2 |
| Verification | 2 |
| **Total** | **15 hours (2-3 days)** |

---

## 2. TD-005: localStorage Consolidation

### Problem Statement

The app uses **10+ different localStorage key families**, causing:
- State drift between systems
- Difficulty debugging
- Complex migration logic
- Multi-tab sync issues

### Current State

**Key Families Identified:**

| Key Pattern | System | Data |
|-------------|--------|------|
| `lux_story_v2_game_save` (legacy: `grand-central-terminus-save`) | GameStateManager | Core game state |
| `lux_story_v2_game_store` (legacy: `grand-central-game-store`) | Zustand persist | UI state, skills |
| `skill_tracker_{userId}` | SkillTracker | Skill demonstrations |
| `lux-platforms-{playerId}` | PlatformResonance | Platform warmth/resonance |
| `lux-career-explorations` | CareerExplorer | Career exploration history |
| `lux-thoughts-{userId}` | ThoughtCabinet | Collected thoughts |
| `lux-identity-{userId}` | IdentitySystem | Identity offerings |
| `lux-pattern-history` | PatternTracker | Pattern history |
| `admin_auth_*` | AdminAuth | Admin session |
| `supabase.auth.*` | Supabase | Auth tokens |

### Target Architecture

**Option A: Single Key (Recommended)**

Consolidate all game state into one key with namespaced sections:

```typescript
interface ConsolidatedStorage {
  version: string
  lastSaved: number

  // Core game state
  game: SerializableGameState

  // Derived/UI state (reconstructed on load)
  ui: {
    skills: FutureSkills
    platforms: PlatformState
  }

  // Evidence/tracking (for Supabase sync)
  evidence: {
    skillDemonstrations: SkillDemonstration[]
    careerExplorations: CareerExploration[]
    patternHistory: PatternEvent[]
  }
}

const STORAGE_KEY = 'grand-central-terminus'
```

**Option B: Reduced Keys (Simpler)**

Keep 3 logical keys:
1. `grand-central-game` - Core state
2. `grand-central-evidence` - Analytics/tracking
3. `grand-central-ui` - UI preferences

### Implementation Plan

#### Phase 1: Audit Current Usage (2 hours)

```bash
# Find all localStorage usage
grep -r "localStorage\." lib/ components/ hooks/ --include="*.ts" --include="*.tsx" | \
  grep -v node_modules | \
  grep -v ".test." > localStorage-usage.txt

# Find all key patterns
grep -roh "localStorage\.\(get\|set\)Item(['\"][^'\"]*['\"]" lib/ components/ hooks/ | \
  sort | uniq -c | sort -rn
```

**Output:** Complete map of all localStorage keys and their consumers

#### Phase 2: Design Migration Schema (2 hours)

1. Define `ConsolidatedStorage` interface
2. Create migration function for each old key
3. Design version upgrade path

```typescript
// lib/storage/consolidated-storage.ts

export interface ConsolidatedStorage {
  version: '3.0.0'
  migratedAt: number

  game: SerializableGameState
  platforms: PlatformState
  evidence: {
    skills: SkillDemonstration[]
    careers: CareerExploration[]
  }
}

export function migrateFromLegacy(): ConsolidatedStorage {
  // Read all old keys
  const oldGame = localStorage.getItem('grand-central-terminus-save')
  const oldSkills = localStorage.getItem(`skill_tracker_${userId}`)
  const oldPlatforms = localStorage.getItem(`lux-platforms-${playerId}`)
  // ... etc

  // Merge into new format
  return {
    version: '3.0.0',
    migratedAt: Date.now(),
    game: JSON.parse(oldGame || '{}'),
    platforms: JSON.parse(oldPlatforms || '{}'),
    evidence: {
      skills: JSON.parse(oldSkills || '[]'),
      careers: []
    }
  }
}
```

#### Phase 3: Implement Storage Service (4 hours)

```typescript
// lib/storage/storage-service.ts

class StorageService {
  private static KEY = 'grand-central-terminus'
  private static VERSION = '3.0.0'

  static load(): ConsolidatedStorage | null {
    const raw = localStorage.getItem(this.KEY)
    if (!raw) return null

    const data = JSON.parse(raw)
    if (data.version !== this.VERSION) {
      return this.migrate(data)
    }
    return data
  }

  static save(data: Partial<ConsolidatedStorage>): void {
    const current = this.load() || this.createDefault()
    const updated = { ...current, ...data, lastSaved: Date.now() }
    localStorage.setItem(this.KEY, JSON.stringify(updated))
  }

  static getGame(): SerializableGameState | null {
    return this.load()?.game ?? null
  }

  static saveGame(game: SerializableGameState): void {
    this.save({ game })
  }

  // ... similar methods for platforms, evidence, etc.
}
```

#### Phase 4: Update Consumers (4 hours)

**Files to Update:**

| File | Current | New |
|------|---------|-----|
| `lib/game-state-manager.ts` | Direct localStorage | `StorageService.getGame()` |
| `lib/game-store.ts` | Zustand persist | `StorageService` adapter |
| `lib/skill-tracker.ts` | Own key | `StorageService.getEvidence()` |
| `lib/platform-resonance.ts` | Own key | `StorageService.getPlatforms()` |
| `lib/career-explorer.ts` | Own key | `StorageService.getEvidence()` |
| `hooks/useMultiTabSync.ts` | StorageEvent | Update for new key |

#### Phase 5: Migration & Cleanup (2 hours)

```typescript
// On app initialization
function initializeStorage() {
  const hasLegacyData = localStorage.getItem('grand-central-terminus-save')
  const hasNewData = localStorage.getItem('grand-central-terminus')

  if (hasLegacyData && !hasNewData) {
    // Migrate from old format
    const migrated = migrateFromLegacy()
    StorageService.save(migrated)

    // Clean up old keys (after verification)
    cleanupLegacyKeys()
  }
}

function cleanupLegacyKeys() {
  const legacyKeys = [
    'grand-central-terminus-save',
    'grand-central-game-store',
    // ... etc
  ]

  // Only remove after successful migration
  legacyKeys.forEach(key => localStorage.removeItem(key))
}
```

#### Phase 6: Testing (2 hours)

1. Unit tests for StorageService
2. Migration tests (old format → new format)
3. Multi-tab sync tests
4. Manual testing:
   - Fresh user flow
   - Existing user migration
   - Multi-tab behavior

### Deliverables

- [ ] `StorageService` class with typed methods
- [ ] Migration function for legacy data
- [ ] All consumers updated to use StorageService
- [ ] Legacy keys cleaned up
- [ ] Multi-tab sync working
- [ ] Tests passing

### Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Data loss during migration | LOW | CRITICAL | Backup before cleanup |
| Breaking existing saves | MEDIUM | HIGH | Version check, gradual rollout |
| Performance regression | LOW | MEDIUM | Benchmark read/write times |

### Estimated Effort

| Phase | Hours |
|-------|-------|
| Audit | 2 |
| Schema design | 2 |
| Storage service | 4 |
| Update consumers | 4 |
| Migration & cleanup | 2 |
| Testing | 2 |
| **Total** | **16 hours (2 days)** |

---

## 3. Platform Resonance UI

### Problem Statement

Platform resonance engine (`lib/platform-resonance.ts`, 576 lines) is complete but:
- State never changes during gameplay
- No visual indication in UI
- Blocked by TD-005 (uses separate localStorage key)

### Current State

**Engine Capabilities:**
- 6 platforms with warmth (-5 to 5) and resonance (0-10)
- `updatePlatformResonance()` function exists
- Platform state serializes correctly
- NOT connected to dialogue choices
- NOT rendered in Constellation view

### Implementation Plan (Post TD-005)

#### Phase 1: Wire to Dialogue System (2 hours)

Add `platformChanges` to StateChange interface:

```typescript
// lib/character-state.ts
interface StateChange {
  // ... existing fields
  platformChanges?: {
    platformId: string
    warmthDelta: number
    resonanceDelta: number
  }[]
}
```

Add platform triggers to dialogue nodes:

```typescript
// content/maya-dialogue-graph.ts
{
  nodeId: 'maya_tech_discussion',
  // ... existing fields
  onEnter: [{
    platformChanges: [{
      platformId: 'technology',
      warmthDelta: 1,
      resonanceDelta: 0.5
    }]
  }]
}
```

#### Phase 2: Add Visual Indicators (2 hours)

Create `PlatformIndicator` component for Constellation:

```typescript
// components/constellation/PlatformIndicator.tsx
interface PlatformIndicatorProps {
  platformId: string
  warmth: number  // -5 to 5
  resonance: number  // 0 to 10
}

export function PlatformIndicator({ platformId, warmth, resonance }: PlatformIndicatorProps) {
  // Visual: Glow intensity based on resonance
  // Color: Warm (amber) to cool (blue) based on warmth
  const glowIntensity = resonance / 10
  const hue = warmth > 0 ? 30 : 210  // Amber or blue

  return (
    <div
      className="platform-indicator"
      style={{
        boxShadow: `0 0 ${glowIntensity * 20}px hsl(${hue}, 70%, 50%)`
      }}
    >
      {/* Platform icon */}
    </div>
  )
}
```

#### Phase 3: Connect to Constellation View (2 hours)

Update `useConstellationData` to include platform state:

```typescript
// hooks/useConstellationData.ts
export function useConstellationData() {
  const platforms = useGameStore(state => state.platforms)

  return {
    // ... existing data
    platforms: Object.entries(platforms).map(([id, state]) => ({
      id,
      warmth: state.warmth,
      resonance: state.resonance,
      position: PLATFORM_POSITIONS[id]
    }))
  }
}
```

### Deliverables

- [ ] `platformChanges` in StateChange interface
- [ ] Platform triggers in 2-3 character dialogues (Maya, Devon, Marcus)
- [ ] `PlatformIndicator` component
- [ ] Platforms visible in Constellation view
- [ ] Warmth/resonance changes during gameplay

### Estimated Effort

| Phase | Hours |
|-------|-------|
| Wire to dialogue | 2 |
| Visual indicators | 2 |
| Constellation integration | 2 |
| **Total** | **6 hours** |

---

## Execution Schedule

### Option A: Sequential (Lower Risk)

| Week | Tasks | Deliverables |
|------|-------|--------------|
| Week 1 | TD-003: ESLint cleanup | Clean SGI, zero lint errors |
| Week 2 | TD-005: localStorage consolidation | StorageService, migration |
| Week 3 | Platform resonance UI | Visual indicators, gameplay integration |

### Option B: Parallel (Faster)

| Week | Track A | Track B |
|------|---------|---------|
| Week 1 | TD-003: ESLint cleanup | TD-005: localStorage audit + design |
| Week 2 | TD-003: Verification | TD-005: Implementation |
| Week 3 | Platform resonance UI | Testing + cleanup |

**Recommendation:** Option B if two developers available, otherwise Option A.

---

## Success Criteria

### TD-003 Complete When:
- [ ] Zero ESLint suppressions in SGI
- [ ] `npm run lint` passes with no errors
- [ ] All tests passing
- [ ] No runtime regressions

### TD-005 Complete When:
- [ ] Single `StorageService` class handles all persistence
- [ ] Legacy keys migrated and cleaned up
- [ ] Multi-tab sync working
- [ ] All tests passing

### Platform Resonance Complete When:
- [ ] Platforms visible in Constellation view
- [ ] At least 3 characters have platform triggers
- [ ] Warmth/resonance visually indicated
- [ ] Player actions affect platform state

---

## Appendix: File References

### TD-003 Files
- `components/StatefulGameInterface.tsx` - Main target

### TD-005 Files
- `lib/game-state-manager.ts` - Core state persistence
- `lib/game-store.ts` - Zustand store
- `lib/skill-tracker.ts` - Skill evidence
- `lib/platform-resonance.ts` - Platform state
- `lib/career-explorer.ts` - Career tracking
- `hooks/useMultiTabSync.ts` - Tab coordination

### Platform Resonance Files
- `lib/platform-resonance.ts` - Engine (576 lines)
- `lib/character-state.ts` - StateChange interface
- `hooks/useConstellationData.ts` - Data hook
- `components/constellation/ConstellationView.tsx` - Render target

---

**Next Step:** Review this plan and confirm execution approach.
