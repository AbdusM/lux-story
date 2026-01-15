# API Hammering Fixes - Implementation Plan

## Problem Summary
God Mode (and normal gameplay) triggers hundreds of unnecessary API calls:
- Relationship progress synced EVERY choice (even when unchanged)
- Platform state synced EVERY choice (even when unchanged)
- Skill demonstrations queue without batching
- No deduplication in sync queue

## Fix #1: Add Deduplication to Sync Queue ⭐ CRITICAL

**File**: `lib/sync-queue.ts`
**Lines**: 85-102 (modify `addToQueue()`)

**Current code**:
```typescript
static addToQueue(action: Omit<QueuedAction, 'retries'>): void {
  const queue = this.getQueue()

  // Prevent unbounded growth - drop oldest if at limit
  if (queue.length >= MAX_QUEUE_SIZE) {
    console.warn(`[SyncQueue] Queue at max size (${MAX_QUEUE_SIZE}), dropping oldest action`)
    queue.shift()
  }

  // Add new action with retry counter
  queue.push({
    ...action,
    retries: 0
  })

  // Save back to localStorage
  safeStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue))
}
```

**PROPOSED FIX**:
```typescript
static addToQueue(action: Omit<QueuedAction, 'retries'>): void {
  const queue = this.getQueue()

  // DEDUPLICATION: For relationship/platform state, check if identical action exists
  if (action.type === 'relationship_progress' || action.type === 'platform_state') {
    // Find existing action for same character/platform
    const existingIndex = queue.findIndex(q => {
      if (q.type !== action.type) return false

      if (action.type === 'relationship_progress') {
        return q.data?.character_name === action.data?.character_name &&
               q.data?.user_id === action.data?.user_id
      }

      if (action.type === 'platform_state') {
        return q.data?.user_id === action.data?.user_id
      }

      return false
    })

    // If identical action exists, UPDATE it instead of adding duplicate
    if (existingIndex !== -1) {
      queue[existingIndex] = {
        ...queue[existingIndex],
        data: action.data, // Update with latest data
        timestamp: Date.now() // Refresh timestamp
      }
      safeStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue))
      return // Don't add duplicate
    }
  }

  // Prevent unbounded growth - drop oldest if at limit
  if (queue.length >= MAX_QUEUE_SIZE) {
    console.warn(`[SyncQueue] Queue at max size (${MAX_QUEUE_SIZE}), dropping oldest action`)
    queue.shift()
  }

  // Add new action with retry counter
  queue.push({
    ...action,
    retries: 0
  })

  // Save back to localStorage
  safeStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue))
}
```

**Impact**:
- ✅ Reduces 24 relationship_progress calls → 1 per character (only when changed)
- ✅ Reduces N platform_state calls → 1 (only when patterns/flags change)
- ✅ Estimated 80-90% reduction in queued actions

---

## Fix #2: Increase Debounce Time ⭐

**File**: `hooks/useBackgroundSync.ts`
**Line**: 21

**Current**:
```typescript
const SYNC_DEBOUNCE_MS = 2000 // Wait 2s for actions to accumulate
```

**PROPOSED**:
```typescript
const SYNC_DEBOUNCE_MS = 5000 // Wait 5s for actions to accumulate (reduced hammering)
```

**Impact**:
- ✅ Gives more time for actions to batch/deduplicate
- ✅ Reduces API call frequency by 2.5x

---

## Fix #3: Add Rate Limiting Between Sequential Requests ⭐

**File**: `lib/sync-queue.ts`
**Lines**: 144-680 (in `processQueue()`)

Add delay between sequential API calls to prevent burst traffic:

```typescript
// Inside processQueue() loop (around line 216)
for (const action of queue) {
  // ... existing sync logic ...

  // RATE LIMITING: Wait 100ms between requests to avoid burst
  if (i < queue.length - 1) {
    await new Promise(resolve => setTimeout(resolve, 100))
  }
}
```

**Impact**:
- ✅ Spreads API calls over time (100 requests → 10 seconds instead of instant burst)
- ✅ Reduces database connection pool exhaustion

---

## Fix #4: God Mode Bypass Flag (SIMPLEST) ⭐⭐⭐

**File**: `lib/sync-queue.ts`
**Lines**: 85 (top of `addToQueue()`)

Add check at the very top:

```typescript
static addToQueue(action: Omit<QueuedAction, 'retries'>): void {
  // BYPASS: Skip sync queue during God Mode operations
  if (typeof window !== 'undefined' && (window as any).__GOD_MODE_ACTIVE) {
    return // Don't queue actions when God Mode is manipulating state
  }

  const queue = this.getQueue()
  // ... rest of existing code ...
}
```

**File**: `lib/dev-tools/god-mode-api.ts`
**Add at start of each method**:

```typescript
// Set flag before bulk operations
setTrust(characterId: string, value: number): boolean {
  (window as any).__GOD_MODE_ACTIVE = true
  // ... existing code ...
  (window as any).__GOD_MODE_ACTIVE = false
  return true
}
```

**Impact**:
- ✅ ZERO API calls during God Mode operations
- ✅ Keeps God Mode simple (just add/remove flag)
- ✅ Fixes the visual test issue immediately

---

## Fix #5: Only Sync Relationship When Trust Actually Changes

**File**: `components/StatefulGameInterface.tsx`
**Lines**: 2721-2731

**Current**:
```typescript
// Sync relationship progress
if (isSupabaseConfigured()) {
  const character = newGameState.characters.find(c => c.characterId === targetCharacterId)
  if (character) {
    queueRelationshipSync({
      user_id: newGameState.playerId,
      character_name: targetCharacterId,
      trust_level: character.trust,
      relationship_status: character.relationshipStatus,
      interaction_count: character.conversationHistory.length
    })
  }
}
```

**PROPOSED**:
```typescript
// Sync relationship progress ONLY if trust changed
if (isSupabaseConfigured()) {
  const character = newGameState.characters.find(c => c.characterId === targetCharacterId)
  const oldCharacter = state.gameState?.characters.find(c => c.characterId === targetCharacterId)

  if (character && oldCharacter && character.trust !== oldCharacter.trust) {
    queueRelationshipSync({
      user_id: newGameState.playerId,
      character_name: targetCharacterId,
      trust_level: character.trust,
      relationship_status: character.relationshipStatus,
      interaction_count: character.conversationHistory.length
    })
  }
}
```

**Impact**:
- ✅ Only syncs when trust actually changes (not every single choice)
- ✅ Reduces relationship_progress calls by ~70-80%

---

## Implementation Priority

**Immediate (Do Now)**:
1. ✅ **Fix #4** - God Mode Bypass Flag (5 minutes, fixes visual tests)
2. ✅ **Fix #1** - Deduplication (15 minutes, biggest impact)
3. ✅ **Fix #2** - Increase debounce (1 minute)

**Short-term (This Week)**:
4. ✅ **Fix #5** - Only sync when trust changes (10 minutes)
5. ✅ **Fix #3** - Rate limiting (10 minutes)

**Estimated Total Time**: ~40 minutes
**Estimated Impact**: 90%+ reduction in API calls

---

## Testing Plan

1. **Before fixes**: Count API calls when making 5 choices
2. **After Fix #4**: Verify God Mode generates ZERO API calls
3. **After Fix #1**: Verify only 1 relationship_progress per character (not per choice)
4. **After all fixes**: Repeat 5-choice test, expect <10 API calls total

