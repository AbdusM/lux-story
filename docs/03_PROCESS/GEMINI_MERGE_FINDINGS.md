# Gemini Merge Findings

**Date:** January 21, 2026
**Branch:** `review/gemini-merge`
**Reviewed By:** Claude Code

---

## Executive Summary

Investigation of Gemini's changes revealed **1 BREAKING change**, **1 MODERATE RISK change**, and several low-risk improvements. The breaking change will cause visual atmospheric effects to stop working entirely.

**Verdict:** Do NOT merge without fixing EnvironmentalEffects issue first.

---

## BREAKING CHANGES

### 1. EnvironmentalEffects Removed from Layout ❌

**Severity:** HIGH - VISUAL FEATURES BROKEN
**Files:** `app/layout.tsx`, `components/EnvironmentalEffects.tsx`

**What Gemini did:**

1. Removed the component from `layout.tsx`:
```diff
- import { EnvironmentalEffects } from '@/components/EnvironmentalEffects'
...
- <EnvironmentalEffects />
```

2. Changed the component signature from self-contained to requiring a prop:
```typescript
// OLD (self-contained, polled localStorage)
export function EnvironmentalEffects() { ... }

// NEW (requires gameState prop)
export function EnvironmentalEffects({ gameState }: { gameState: GameState | null }) { ... }
```

**Impact - CSS classes never applied to `<body>`:**

| CSS Class | Purpose | Where Defined |
|-----------|---------|---------------|
| `helping-environment` | Warm aura effect | environmental-response.css:62 |
| `building-environment` | Ground glow | environmental-response.css:82 |
| `analyzing-environment` | Data stream effect | environmental-response.css:103 |
| `shadow-warm` | Drop shadow on characters | environmental-response.css:115 |
| `station-breathing` | Station pulse animation | environmental-response.css:249 |
| `particles-helping` | Star field particles | environmental-response.css:266 |
| `particles-building` | Building particles | environmental-response.css:283 |
| `objects-responsive` | Interactive objects | environmental-response.css:230 |
| `character-{name}` | Character-specific atmosphere | EnvironmentalEffects.tsx:59 |

**User-visible symptoms:**
- No atmospheric color shifts based on player patterns
- No character-specific visual theming
- No station breathing animation for high patience players
- No particle effects for helping/building patterns
- Missing Fox Theatre twinkling star field

**FIX REQUIRED - Option A (Recommended):**

Move component to `StatefulGameInterface.tsx` where `gameState` is available:

```typescript
// In StatefulGameInterface.tsx imports:
import { EnvironmentalEffects } from '@/components/EnvironmentalEffects'

// In render, near other global components:
<EnvironmentalEffects gameState={state.gameState} />
```

**FIX REQUIRED - Option B:**

Revert both changes (restore old self-contained component + layout import).

---

## MODERATE RISK CHANGES

### 2. ExperienceRenderer Refactored ⚠️

**File:** `components/game/ExperienceRenderer.tsx`
**Risk:** Adapter mapping must be correct

**What Gemini did:** Replaced custom Button rendering with `GameChoices` component using the new adapter pattern.

**Before:**
```tsx
{step.choices?.map(choice => (
  <Button onClick={() => onChoice(choice.id)}>
    {choice.text}
  </Button>
))}
```

**After:**
```tsx
<GameChoices
  choices={(step.choices || []).map(c => adaptExperienceChoiceToUIChoice(c, gameState.patterns))}
  onChoice={(choice) => onChoice(choice.id || choice.next || '')}
/>
```

**Analysis:**
- New adapter `adaptExperienceChoiceToUIChoice` in `lib/choice-adapter.ts`
- Falls back to `choice.next` if `choice.id` is missing
- Added `id?: string` to `GameChoices.Choice` interface

**Testing Required:**
- [ ] Run through Maya loyalty experience
- [ ] Run through Devon loyalty experience
- [ ] Verify choices appear correctly styled
- [ ] Verify choice selection triggers correct transitions

---

## LOW RISK CHANGES (Safe to Accept)

### 3. RichTextRenderer Timing ✅

**File:** `components/RichTextRenderer.tsx` (line 157)

```diff
- const delay = Math.max(calculatedDelay, 350)
+ const delay = Math.max(calculatedDelay, 100)
```

**Impact:** Text chunks reveal faster (100ms floor vs 350ms). This was changed per user feedback requesting a "snappier feel."

**Risk:** None - purely cosmetic timing adjustment.

### 4. HarmonicsView Memoization ✅

**File:** `components/HarmonicsView.tsx` (lines 199-367)

Added `React.memo` with custom equality check to `HarmonicOrb` component.

```typescript
const areOrbsEqual = (prev: { orb: OrbState }, next: { orb: OrbState }) => {
    return prev.orb.pattern === next.orb.pattern &&
        prev.orb.fillPercent === next.orb.fillPercent &&
        prev.orb.hasNewGrowth === next.orb.hasNewGrowth &&
        prev.orb.pointsToNext === next.orb.pointsToNext &&
        prev.orb.orbCount === next.orb.orbCount
}

const HarmonicOrb = React.memo(function HarmonicOrb(...) { ... }, areOrbsEqual)
```

**Impact:** Performance optimization to prevent unnecessary re-renders.

**Risk:** None - only prevents re-renders when orb data hasn't changed.

### 5. Samuel Dialogue Typo Fix ✅

**File:** `content/samuel-dialogue-graph.ts`

```diff
- "That's good.means you're payin' attention."
+ "That's good. Means you're payin' attention."
```

**Risk:** None - simple typo fix (added missing space).

---

## SAFE CHANGES - Zod Validation (Diamond Safe Pattern)

These add runtime validation to localStorage reads - defensive improvements:

| File | Change | Risk |
|------|--------|------|
| `lib/safe-storage.ts` | Added `getValidatedItem()` helper | None |
| `lib/cross-character-memory.ts` | Zod schemas for echo queue | None |
| `lib/performance-system.ts` | Zod schema for metrics | None |
| `lib/learning-objectives-tracker.ts` | Zod schema for engagements | None |
| `lib/simple-career-analytics.ts` | Zod schema for analytics | None |
| `lib/live-choice-engine.ts` | Zod schemas + singleton refactor | None |

**Pattern Applied:**
```typescript
const validatedData = safeStorage.getValidatedItem(key, ZodSchema)
if (validatedData) {
  // Use validated data
} else {
  // Handle invalid/missing data gracefully
}
```

---

## ALREADY FIXED BY REVIEW COMMITS

These issues were identified and fixed during the review process:

| Issue | Fix | Commit |
|-------|-----|--------|
| LiveChoiceEngine no test isolation | Added `resetInstance()` | `56133bc` |
| `setupPlayTimeTracking()` never called | Wired in StatefulGameInterface | `56133bc` |
| Deferred saves lost on page close | Added `pagehide` flush | `56133bc` |
| `any` types in choice-adapter | Added proper interfaces | `0c9338f` |
| Unused imports causing lint warnings | Removed | `e57976b` |

---

## FILES DELETED (Incomplete Mobile Stack UI)

These files were removed as they were incomplete/unused:

| File | Reason |
|------|--------|
| `components/game/MobileStackRenderer.tsx` | Imported but never rendered |
| `components/CarouselPrototype.tsx` | Unused prototype |
| `lib/stack-adapter.ts` | No consumers |
| `app/carousel-test/` | Test route for removed feature |

---

## Verification Checklist

### Pre-Merge (Required)
- [ ] **FIX: EnvironmentalEffects** - Add to StatefulGameInterface.tsx
- [ ] **TEST: Loyalty experiences** - Maya and Devon flows work
- [ ] **TEST: Body classes** - Verify classes appear on `<body>` element

### Post-Merge (Manual QA)
- [ ] Pattern-based visual effects (warm aura for helping, etc.)
- [ ] Character atmosphere switching
- [ ] Station breathing animation (patience > 7)
- [ ] Particle effects (helping/building > 6)
- [ ] Side panels open correctly (Journal, Constellation)
- [ ] Dialogue flow works normally
- [ ] Choice selection works in all contexts

---

## Recommendation

1. **Fix EnvironmentalEffects FIRST** - This is confirmed broken
2. **Add component to StatefulGameInterface.tsx** (Option A is cleaner)
3. **Run manual QA** - Intro sequence + one character conversation
4. **Then merge** - If QA passes

---

## Branch Status

```
Current: review/gemini-merge

Commits:
56133bc feat: add runtime hardening and save durability
0c9338f refactor: add UIChoice abstraction and fix types
e57976b chore: clean up unused imports and lint warnings
2683fff chore: clean up unused code

Tests: 1,129 passing
Build: Successful
Lint: 0 warnings
```
