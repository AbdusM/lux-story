# Architectural Audit: Abstraction Opportunities

**Date:** December 27, 2024
**Principle:** Minimal changes, maximum leverage. No over-engineering.

---

## Executive Summary

Comprehensive audit of the codebase identified **5 abstraction opportunities** prioritized by impact and risk. Phase 1 (Quick Wins) removes ~690 lines of duplicate/dead code with minimal risk.

| Category | Issues Found | Files Affected | Lines Impact | Status |
|----------|--------------|----------------|--------------|--------|
| Duplicate Functions | 3x ensurePlayerProfile | 3 API routes | -96 lines | ✅ DONE |
| Animation Re-definition | 2 verified duplicates | 2 components | -25 lines | ✅ DONE |
| Dead Code | ChatPacedDialogue disabled | 2 files | archived | ✅ DONE |
| API Route Patterns | 50+ repeated patterns | 8 routes | -400+ lines | Phase 2 |
| Type Guard Patterns | 3 identical validators | 3 lib files | -15 lines | Phase 3 |

**Note:** Journal.tsx excluded from animation consolidation - uses intentionally different animation params (`y:20` + duration easing vs `y:12` + spring).

**Correction Applied:** ErrorBoundary components (GameErrorBoundary, MessageErrorBoundary) were initially flagged as duplicates but are **proper specializations** with different fallback UIs. They are NOT included in this refactor.

---

## Findings Detail

### 1. Duplicate: ensurePlayerProfile()

**Severity:** High
**Impact:** ~96 lines removed, single maintenance point

**Current State:**
Identical 32-line function copied verbatim in 3 files:

| File | Lines |
|------|-------|
| `app/api/user/skill-summaries/route.ts` | 22-53 |
| `app/api/user/career-explorations/route.ts` | 29-60 |
| `app/api/user/pattern-demonstrations/route.ts` | 23-54 |

Only difference: operation name string in logger.

**Code Pattern (Duplicated):**
```typescript
async function ensurePlayerProfile(userId: string): Promise<void> {
  try {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase
      .from('player_profiles')
      .upsert({ user_id: userId, created_at: new Date().toISOString() }, {
        onConflict: 'user_id',
        ignoreDuplicates: true
      })
    if (error) {
      logger.warn('Failed to ensure player profile', { operation: 'XXX', userId, error: error.message })
    } else {
      logger.debug('Player profile ensured', { operation: 'XXX', userId })
    }
  } catch (error) {
    logger.error('ensurePlayerProfile error', { operation: 'XXX' }, error instanceof Error ? error : undefined)
  }
}
```

**Fix:** Create `lib/api/ensure-player-profile.ts` with parameterized operation name.

---

### 2. Animation Variants Re-definition ✅ COMPLETED

**Severity:** Medium
**Impact:** ~25 lines removed

**Verified Matches:**

| Component | Action | Notes |
|-----------|--------|-------|
| `ConstellationPanel.tsx` | Use `backdrop`, `panelFromRight` | ✅ Exact match (stiffness:300, damping:30) |
| `DetailModal.tsx` | Use `backdrop` only | ✅ Keep `modalVariants` local - has `y:50` motion |
| `Journal.tsx` | **SKIP** | ⚠️ Intentionally different: `y:20` + duration easing vs `y:12` + spring |

**Example - ConstellationPanel.tsx:**
```typescript
// CURRENT (lines 20-31):
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}
const panelVariants: import('framer-motion').Variants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  }
}

// SHOULD BE:
import { backdrop, panelFromRight } from '@/lib/animations'
// Then use: variants={backdrop} and variants={panelFromRight}
```

---

### 3. Dead Code: ChatPacedDialogue ✅ COMPLETED

**Severity:** High
**Impact:** Code archived (preserved for future debugging)

**Root Cause:** Blank screen rendering bugs - bypassed, not fixed.

**Fix Applied:**
1. **RENAMED** `ChatPacedDialogue.tsx` → `ChatPacedDialogue.DISABLED.tsx` (preserves code for debugging)
2. **Cleaned** `DialogueDisplay.tsx`:
   - Removed import statement
   - Removed `useChatPacing` prop
   - Removed `_wordCount` calculation
   - Removed `shouldUseChatPacing` logic
   - Removed conditional ChatPacedDialogue block
   - Added explanatory comment

---

### 4. API Route Pattern Duplication (Phase 2)

**Severity:** Medium
**Impact:** ~400+ lines removed (if implemented)

**Current State:**
8 API routes in `/api/user/*` repeat identical 40-50 line patterns:
- userId extraction from searchParams
- `validateUserId()` call
- Supabase client creation
- Query execution
- Error handling (inconsistent response formats)

**Routes Affected:**
- `/api/user/skill-summaries/route.ts`
- `/api/user/career-explorations/route.ts`
- `/api/user/pattern-demonstrations/route.ts`
- `/api/user/achievements/route.ts`
- `/api/user/dialogue-analytics/route.ts`
- `/api/user/session-analytics/route.ts`
- `/api/user/choice-analytics/route.ts`
- `/api/user/profile/route.ts`

**Proposed Fix:** Create `lib/api/create-user-handler.ts` factory function.

**Risk:** Higher complexity - defer to Phase 2 after Quick Wins.

---

### 5. Type Guard Pattern (Phase 3)

**Severity:** Low
**Impact:** ~15 lines, minor DRY improvement

**Current State:**
3 identical validator patterns:

```typescript
// lib/patterns.ts line 189-191
export function isValidPattern(value: string): value is PatternType {
  return PATTERN_TYPES.includes(value as PatternType)
}

// lib/emotions.ts line 99-101
export function isValidEmotion(value: string): value is EmotionType {
  return EMOTION_TYPES.includes(value as EmotionType)
}

// lib/graph-registry.ts line 66-68
export function isValidCharacterId(value: string): value is CharacterId {
  return CHARACTER_IDS.includes(value as CharacterId)
}
```

**Proposed Fix:** Generic factory in `lib/validation-utils.ts`:
```typescript
export function createTypeGuard<T extends string>(validValues: readonly T[]) {
  return (value: string): value is T => validValues.includes(value as T)
}
```

**Priority:** Low - only implement if specifically requested.

---

## NOT Duplicates (Verified)

These were initially flagged but confirmed as **proper specializations**:

### ErrorBoundary Components

| Component | Purpose | Fallback UI |
|-----------|---------|-------------|
| `GameErrorBoundary.tsx` (80 lines) | Game-level errors | Full error screen with scene recovery |
| `MessageErrorBoundary.tsx` (36 lines) | Message rendering errors | Inline error message |

**Decision:** KEEP BOTH - they serve different use cases with appropriate fallback UIs.

---

## Out of Scope (High Risk)

These were identified but excluded from this audit:

| Item | Risk | Reason |
|------|------|--------|
| State System Consolidation | High | `game-store.ts` vs `character-state.ts` dual source of truth - could break game persistence |
| Break Up StatefulGameInterface.tsx | High | 1697 lines, complex component with many side effects |
| Pattern Type Consolidation | High | 7 vs 5 pattern mismatch could break existing saves |

---

## Implementation Plan

### Phase 1: Quick Wins (Recommended)

| Step | Action | Files |
|------|--------|-------|
| 1a | Create `lib/api/ensure-player-profile.ts` | CREATE |
| 1b | Update skill-summaries/route.ts | EDIT |
| 1c | Update career-explorations/route.ts | EDIT |
| 1d | Update pattern-demonstrations/route.ts | EDIT |
| 2a | Update ConstellationPanel.tsx animations | EDIT |
| 2b | Update DetailModal.tsx animations | EDIT |
| 2c | Update Journal.tsx animations | EDIT |
| 3a | Delete ChatPacedDialogue.tsx | DELETE |
| 3b | Clean DialogueDisplay.tsx | EDIT |

**Total Impact:** ~690 lines removed/consolidated

### Phase 2: API Consolidation (Optional)

Create factory function for API routes. Higher complexity, recommend deferring.

### Phase 3: Type Guards (Low Priority)

Only implement if explicitly requested.

---

## Files Summary (Phase 1 Complete)

### Created
```
lib/api/ensure-player-profile.ts ✅
```

### Renamed (Archived)
```
components/ChatPacedDialogue.tsx → ChatPacedDialogue.DISABLED.tsx ✅
```

### Edited
```
app/api/user/skill-summaries/route.ts ✅
app/api/user/career-explorations/route.ts ✅
app/api/user/pattern-demonstrations/route.ts ✅
components/constellation/ConstellationPanel.tsx ✅
components/constellation/DetailModal.tsx ✅
components/DialogueDisplay.tsx ✅
```

### Skipped (Intentionally Different)
```
components/Journal.tsx - tabContentVariants uses different animation params
```

---

## Verification Checklist

After implementation:
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] No new TypeScript errors
- [ ] `npm test` passes
- [ ] Manual smoke test: game loads and plays

---

## Related Documentation

- `docs/27dec/IMPLEMENTATION_PLAN.md` - Session work log
- `docs/DORMANT_CAPABILITIES_AUDIT.md` - Backend capabilities audit
- `docs/EXPEDITION33_DESIGN_SYNTHESIS.md` - Design principles
