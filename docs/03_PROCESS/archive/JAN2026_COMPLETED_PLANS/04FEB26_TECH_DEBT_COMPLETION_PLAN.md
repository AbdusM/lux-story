# Technical Debt Completion Plan

**Status:** IN PROGRESS
**Created:** 2026-02-04
**Estimated Effort:** ~12 hours
**Commit:** `67cd928`

---

## Executive Summary

Sprint audit revealed **7 of 10 technical debt items already resolved**. Remaining 3 items (all medium risk) require ~12 hours total.

### Current State: 7/10 Resolved

| ID | Issue | Status |
|---|---|---|
| TD-001 | Dual Source of Truth | ✅ Zustand is single source |
| TD-002 | No Immutability Enforcement | ✅ `devFreeze()` wrapper |
| TD-003 | ESLint suppressions in SGI | ✅ Fixed underlying issues |
| TD-006 | Multi-Tab Corruption | ✅ `useMultiTabSync` hook |
| TD-008 | Legacy Type Casts | ✅ `SkillRecord` helper |
| TD-009 | initializeGame deps | ✅ `useGameInitializer` hook |
| TD-010 | God Mode in production | ✅ Multi-layer protection |

### Remaining: 3 Items

| ID | Issue | Effort | Trigger |
|---|---|---|---|
| TD-004 | Orbs Outside GameState | ~4h | Before save slots |
| TD-005 | Fragmented localStorage | ~4h | Before namespace consolidation |
| TD-007 | Non-Deterministic Randomness | ~4h | Before deterministic replay |

---

# Phase 1: TD-004 - Orb Integration (~4 hours)

## Problem Statement

The orb system uses 5 independent localStorage keys:
- `lux-orb-balance` - Current orb counts by pattern
- `lux-orb-milestones` - Reached milestones
- `lux-orb-last-viewed` - Timestamp of last view
- `lux-orb-last-viewed-balance` - Balance at last view
- `lux-orb-acknowledged` - Acknowledged milestones

**Impact:** Save/load cannot capture orbs atomically with game state.

## Implementation Steps

### Step 1: Extend SerializableGameState (~1h)

**File:** `lib/character-state.ts`

```typescript
// Add to SerializableGameState interface
export interface SerializableGameState {
  // ... existing fields ...

  // TD-004: Orb economy (moved from standalone localStorage)
  orbs: {
    balance: Record<PatternType, number>
    milestones: string[]
    lastViewed: number
    lastViewedBalance: Record<PatternType, number>
    acknowledged: string[]
  }
}

// Add default orbs to createNewGameState()
orbs: {
  balance: { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 },
  milestones: [],
  lastViewed: 0,
  lastViewedBalance: { analytical: 0, patience: 0, exploring: 0, helping: 0, building: 0 },
  acknowledged: []
}
```

### Step 2: Create Migration Helper (~30m)

**File:** `lib/migrations/orb-migration.ts` (new)

```typescript
import type { SerializableGameState } from '@/lib/character-state'

export function migrateOrbsToGameState(): Partial<SerializableGameState['orbs']> | null {
  // Check for legacy orb keys
  const legacyBalance = localStorage.getItem('lux-orb-balance')
  if (!legacyBalance) return null

  // Read all legacy keys
  const orbs = {
    balance: JSON.parse(legacyBalance),
    milestones: JSON.parse(localStorage.getItem('lux-orb-milestones') || '[]'),
    lastViewed: parseInt(localStorage.getItem('lux-orb-last-viewed') || '0'),
    lastViewedBalance: JSON.parse(localStorage.getItem('lux-orb-last-viewed-balance') || '{}'),
    acknowledged: JSON.parse(localStorage.getItem('lux-orb-acknowledged') || '[]')
  }

  // Remove legacy keys after successful read
  localStorage.removeItem('lux-orb-balance')
  localStorage.removeItem('lux-orb-milestones')
  localStorage.removeItem('lux-orb-last-viewed')
  localStorage.removeItem('lux-orb-last-viewed-balance')
  localStorage.removeItem('lux-orb-acknowledged')

  return orbs
}
```

### Step 3: Update useOrbs Hook (~1.5h)

**File:** `hooks/useOrbs.ts`

```typescript
// BEFORE: Direct localStorage access
const [balance, setBalance] = useLocalStorage('lux-orb-balance', defaultBalance)

// AFTER: Read/write through Zustand
const orbState = useGameSelectors.useOrbs()
const { updateOrbs } = useGameStore.getState()

// Update all orb operations to use Zustand actions
function earnOrb(pattern: PatternType, count: number = 1) {
  updateOrbs(state => ({
    ...state,
    balance: {
      ...state.balance,
      [pattern]: state.balance[pattern] + count
    }
  }))
}
```

### Step 4: Add Zustand Orb Actions (~30m)

**File:** `lib/game-store.ts`

```typescript
// Add to store interface
updateOrbs: (updater: (orbs: OrbState) => OrbState) => void

// Add selector
useOrbs: () => useGameStore(s => s.coreGameState?.orbs)
```

### Step 5: Run Migration on Init (~30m)

**File:** `hooks/game/useGameInitializer.ts`

```typescript
// After loading game state
const migratedOrbs = migrateOrbsToGameState()
if (migratedOrbs) {
  gameState.orbs = { ...gameState.orbs, ...migratedOrbs }
  logger.info('Migrated orb state from legacy localStorage')
}
```

## Verification

```bash
# 1. Type-check passes
npm run type-check

# 2. Tests pass
npm test -- --run

# 3. Manual test
# - Fresh browser: Earn orbs, verify in Journal
# - Existing save with orbs: Load, verify migration works
# - Save/load: Export state, verify orbs included
```

---

# Phase 2: TD-005 - localStorage Consolidation (~4 hours)

## Problem Statement

10+ key families across prefixes:
- `grand-central-terminus-save` - Main game state (via Zustand persist)
- `grand-central-game-store` - Zustand store
- `lux-orb-*` - Orb economy (5 keys) → Migrated in Phase 1
- `lux_guest_mode` - Guest mode flag
- `lux_audio_muted`, `lux_audio_volume` - Audio settings
- `lux-player-id`, `playerId`, `gameUserId` - Player identifiers
- `lux-local-mode-seen` - Local mode notice
- `godMode_*` - Dev tool settings
- `action_plan_*` - Action plans (per user)

**Impact:** No unified namespace makes auditing and cleanup difficult.

## Implementation Steps

### Step 1: Define Unified Key Registry (~30m)

**File:** `lib/persistence/storage-keys.ts` (new)

```typescript
export const STORAGE_PREFIX = 'lux_story_v2_'

export const STORAGE_KEYS = {
  // Core game state (Zustand)
  GAME_STORE: `${STORAGE_PREFIX}game_store`,

  // User settings
  AUDIO_MUTED: `${STORAGE_PREFIX}audio_muted`,
  AUDIO_VOLUME: `${STORAGE_PREFIX}audio_volume`,
  GUEST_MODE: `${STORAGE_PREFIX}guest_mode`,
  LOCAL_MODE_SEEN: `${STORAGE_PREFIX}local_mode_seen`,

  // Player identity
  PLAYER_ID: `${STORAGE_PREFIX}player_id`,

  // Dev tools (keep separate namespace)
  // godMode_* keys stay as-is (dev only)
} as const

// Legacy key mapping for migration
export const LEGACY_KEYS: Record<string, keyof typeof STORAGE_KEYS> = {
  'grand-central-game-store': 'GAME_STORE',
  'grand-central-terminus-save': 'GAME_STORE',
  'lux_audio_muted': 'AUDIO_MUTED',
  'lux_audio_volume': 'AUDIO_VOLUME',
  'lux_guest_mode': 'GUEST_MODE',
  'lux-local-mode-seen': 'LOCAL_MODE_SEEN',
  'lux-player-id': 'PLAYER_ID',
  'playerId': 'PLAYER_ID',
  'gameUserId': 'PLAYER_ID',
}
```

### Step 2: Create Migration Function (~1h)

**File:** `lib/persistence/storage-migration.ts` (new)

```typescript
import { STORAGE_KEYS, LEGACY_KEYS } from './storage-keys'

export function migrateLocalStorageKeys(): { migrated: string[], skipped: string[] } {
  const migrated: string[] = []
  const skipped: string[] = []

  for (const [legacyKey, newKeyName] of Object.entries(LEGACY_KEYS)) {
    const legacyValue = localStorage.getItem(legacyKey)
    if (!legacyValue) continue

    const newKey = STORAGE_KEYS[newKeyName]
    const existingValue = localStorage.getItem(newKey)

    if (existingValue) {
      // New key already has data, skip migration
      skipped.push(legacyKey)
      continue
    }

    // Migrate value to new key
    localStorage.setItem(newKey, legacyValue)
    localStorage.removeItem(legacyKey)
    migrated.push(legacyKey)
  }

  return { migrated, skipped }
}
```

### Step 3: Update Zustand Persist Key (~30m)

**File:** `lib/game-store.ts`

```typescript
import { STORAGE_KEYS } from './persistence/storage-keys'

// Update persist config
persist(
  // ... store definition ...
  {
    name: STORAGE_KEYS.GAME_STORE, // Was: 'grand-central-game-store'
    // ...
  }
)
```

### Step 4: Update All Direct localStorage Access (~1.5h)

Files to update:
- `app/profile/page.tsx` - Audio settings
- `app/welcome/page.tsx` - Guest mode
- `hooks/game/useGameInitializer.ts` - Local mode seen
- `lib/safe-storage.ts` - Player ID
- `app/student/insights/page.tsx` - Player ID lookup

```typescript
// BEFORE
localStorage.getItem('lux_audio_muted')

// AFTER
import { STORAGE_KEYS } from '@/lib/persistence/storage-keys'
localStorage.getItem(STORAGE_KEYS.AUDIO_MUTED)
```

### Step 5: Run Migration on App Init (~30m)

**File:** `components/StorageMigration.tsx` (new client component)

```typescript
'use client'

import { useEffect } from 'react'
import { migrateLocalStorageKeys } from '@/lib/persistence/storage-migration'

export function StorageMigration() {
  useEffect(() => {
    const { migrated, skipped } = migrateLocalStorageKeys()
    if (migrated.length > 0) {
      console.log('[Storage] Migrated keys:', migrated)
    }
  }, [])

  return null
}
```

## Verification

```bash
# 1. Type-check passes
npm run type-check

# 2. Tests pass (update fixtures if needed)
npm test -- --run

# 3. Manual test
# - Fresh browser: Verify new keys used
# - Existing save: Verify migration works
# - Check no orphaned legacy keys remain

# 4. Audit command (in browser console)
for(let i=0;i<localStorage.length;i++){console.log(localStorage.key(i))}
```

---

# Phase 3: TD-007 - SeededRandom Migration (~4 hours)

## Problem Statement

- 73 `Math.random()` calls across 40 files
- `SeededRandom` infrastructure exists in `lib/seeded-random.ts`
- Most calls are cosmetic (message selection)
- Some are gameplay-affecting (probability checks)

**Impact:** Makes deterministic replay and testing harder.

## Prioritized Migration

### Tier 1: Gameplay-Affecting (Must Fix) (~2h)

| File | Lines | Usage | Priority |
|------|-------|-------|----------|
| `lib/game-logic.ts` | 260 | Pattern reward probability | HIGH |
| `lib/choice-generator.ts` | 307,398,421,422,478,487,488 | Choice augmentation | HIGH |
| `lib/evaluators/tier2-evaluators.ts` | 58,116 | Evaluation probability | HIGH |
| `lib/overdensity-system.ts` | 34,53 | Density calculations | MEDIUM |
| `lib/pattern-voices.ts` | 255 | Voice trigger probability | MEDIUM |
| `lib/ambient-events.ts` | 167,185 | Event selection | LOW |

### Tier 2: Content Variation (Nice to Have) (~1h)

These affect display but not gameplay outcomes:
- Message selection in ranking modules
- Voice/template selection
- Shuffle operations

### Tier 3: Skip (Cosmetic Only)

- ID generation (Date.now() + random suffix)
- Session IDs
- Audio/animation timing

## Implementation Steps

### Step 1: Update Gameplay-Affecting Calls (~2h)

**File:** `lib/game-logic.ts`

```typescript
// BEFORE (line 260)
if (isValidPattern(choice.pattern) && Math.random() < 0.3) {

// AFTER
import { random } from '@/lib/seeded-random'
if (isValidPattern(choice.pattern) && random() < 0.3) {
```

**File:** `lib/choice-generator.ts`

```typescript
// BEFORE
const shouldTrigger = Math.random() < augmentationChance
const targetPattern = underrepresentedPatterns[Math.floor(Math.random() * underrepresentedPatterns.length)]

// AFTER
import { random, randomPick } from '@/lib/seeded-random'
const shouldTrigger = random() < augmentationChance
const targetPattern = randomPick(underrepresentedPatterns)
```

**File:** `lib/evaluators/tier2-evaluators.ts`

```typescript
// BEFORE
if (Math.random() >= 0.15) { return null }

// AFTER
import { random } from '@/lib/seeded-random'
if (random() >= 0.15) { return null }
```

### Step 2: Update Content Variation (~1h)

Use `randomPick()` for array selection:

```typescript
// BEFORE
return messages[Math.floor(Math.random() * messages.length)]

// AFTER
import { randomPick } from '@/lib/seeded-random'
return randomPick(messages)
```

Files to update:
- `lib/ranking/*.ts` - Message selection
- `lib/consequence-echoes.ts` - Echo selection
- `lib/pattern-voices.ts` - Voice selection
- `lib/narrative-derivatives.ts` - Descriptor selection

### Step 3: Add Determinism Tests (~1h)

**File:** `tests/lib/seeded-determinism.test.ts` (new)

```typescript
import { SeededRandom } from '@/lib/seeded-random'
import { generateChoices } from '@/lib/choice-generator'

describe('Deterministic Gameplay', () => {
  beforeEach(() => {
    SeededRandom.seed(12345)
  })

  afterEach(() => {
    SeededRandom.reset()
  })

  it('choice generation is deterministic with same seed', () => {
    const result1 = generateChoices(fixtureNode, fixtureState)

    SeededRandom.seed(12345) // Re-seed
    const result2 = generateChoices(fixtureNode, fixtureState)

    expect(result1).toEqual(result2)
  })

  it('different seeds produce different results', () => {
    const result1 = generateChoices(fixtureNode, fixtureState)

    SeededRandom.seed(99999)
    const result2 = generateChoices(fixtureNode, fixtureState)

    expect(result1).not.toEqual(result2)
  })
})
```

## Verification

```bash
# 1. Type-check passes
npm run type-check

# 2. Tests pass
npm test -- --run

# 3. Determinism test
npm test -- tests/lib/seeded-determinism.test.ts

# 4. Count remaining Math.random() calls (should be ~30-40 cosmetic only)
grep -r "Math.random()" lib/ --include="*.ts" | wc -l
```

---

# Execution Schedule

## Day 1: Phase 1 - Orb Integration (~4h)

| Task | Time | Status |
|------|------|--------|
| Extend SerializableGameState | 1h | ⬜ |
| Create migration helper | 30m | ⬜ |
| Update useOrbs hook | 1.5h | ⬜ |
| Add Zustand actions | 30m | ⬜ |
| Run migration on init | 30m | ⬜ |
| QA & commit | 30m | ⬜ |

## Day 2: Phase 2 - localStorage Consolidation (~4h)

| Task | Time | Status |
|------|------|--------|
| Define unified key registry | 30m | ⬜ |
| Create migration function | 1h | ⬜ |
| Update Zustand persist key | 30m | ⬜ |
| Update direct localStorage access | 1.5h | ⬜ |
| Run migration on init | 30m | ⬜ |
| QA & commit | 30m | ⬜ |

## Day 3: Phase 3 - SeededRandom Migration (~4h)

| Task | Time | Status |
|------|------|--------|
| Update gameplay-affecting calls | 2h | ⬜ |
| Update content variation | 1h | ⬜ |
| Add determinism tests | 1h | ⬜ |
| QA & commit | 30m | ⬜ |

---

# Definition of Done

- [ ] TD-004: Orbs stored in `coreGameState.orbs`
- [ ] TD-004: Legacy `lux-orb-*` keys migrated and removed
- [ ] TD-004: `useOrbs` reads/writes through Zustand
- [ ] TD-005: All keys use `lux_story_v2_*` prefix
- [ ] TD-005: Legacy keys migrated automatically
- [ ] TD-005: No orphaned localStorage keys
- [ ] TD-007: Gameplay-affecting random uses `SeededRandom`
- [ ] TD-007: Determinism tests pass
- [ ] All tests pass (1962+)
- [ ] Build succeeds

---

# Final State After Completion

**Technical Debt Register:** 10/10 items resolved

| ID | Issue | Resolution |
|---|---|---|
| TD-001 | Dual Source of Truth | ✅ Zustand is single source |
| TD-002 | No Immutability | ✅ `devFreeze()` |
| TD-003 | ESLint suppressions | ✅ Fixed |
| TD-004 | Orbs Outside GameState | ✅ Integrated |
| TD-005 | Fragmented localStorage | ✅ Consolidated |
| TD-006 | Multi-Tab Corruption | ✅ `useMultiTabSync` |
| TD-007 | Non-Deterministic Random | ✅ `SeededRandom` |
| TD-008 | Legacy Type Casts | ✅ `SkillRecord` |
| TD-009 | initializeGame deps | ✅ `useGameInitializer` |
| TD-010 | God Mode in production | ✅ Role-gated |

**Unlocks:** Multi-device sync, save slots, deterministic replay
