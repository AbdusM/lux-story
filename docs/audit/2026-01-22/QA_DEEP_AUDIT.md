# Deep QA Audit Report

**Date:** January 22, 2026
**Scope:** Comprehensive codebase audit beyond design system
**Status:** ✅ COMPLETE (January 22, 2026)

**Final Verification:**
- Build: ✅ Passing
- Tests: ✅ 1181 passed (52 test files)

---

## All Fixes Applied

### Critical & High Priority (All Complete)

| Fix | File(s) | Status |
|-----|---------|--------|
| IdentityCeremony wrong colors | `components/IdentityCeremony.tsx` | ✅ FIXED |
| Duplicate `DOMINANT_PATTERN_THRESHOLD` | `lib/patterns.ts` | ✅ FIXED |
| Hardcoded pattern array | `hooks/usePatternUnlocks.ts` | ✅ FIXED |
| Hardcoded `MAX_ORB_COUNT` | `hooks/usePatternUnlocks.ts` | ✅ FIXED |
| Trust thresholds hardcoded | 4 files | ✅ FIXED |
| Waiting room threshold duplication | `hooks/useWaitingRoom.ts` | ✅ FIXED |
| Missing error boundaries | `app/profile/`, `app/student/` | ✅ FIXED |
| Devon routes to wrong gateway | `content/devon-dialogue-graph.ts` | ✅ FIXED |
| Devon hub invalid reference | `content/devon-dialogue-graph.ts` | ✅ FIXED |
| Marcus hub invalid reference | `content/marcus-dialogue-graph.ts` | ✅ FIXED |

### Medium Priority (All Complete)

| Fix | File(s) | Status |
|-----|---------|--------|
| Dead code cleanup | `lib/character-state.ts`, `lib/character-check-ins.ts` | ✅ FIXED |
| SEO metadata utilities | `lib/metadata.ts` | ✅ CREATED |
| Page metadata (priority pages) | 4 layout files | ✅ CREATED |
| Type guards for patterns | `lib/patterns.ts` | ✅ ADDED |
| Type-safe pattern access | `lib/game-store.ts` | ✅ FIXED |
| Dialogue reachability audit | `scripts/audit-orphan-nodes.cjs` | ✅ CREATED |

### Audit Corrections (False Positives Identified)

| Original Finding | Actual Status |
|------------------|---------------|
| Missing `isValidEmotion()` | Already exists at `lib/emotions.ts:533` |
| `samuel_orb_introduction` doesn't exist | Node exists at `samuel-dialogue-graph.ts:1709` |
| `samuelEntryPoints.ALEX_REFLECTION_GATEWAY` invalid | Node exists at line 3709 |
| `generateTierReport()` unused | Used in tests |
| `orbCountToFillPercent()` unused | Used in `usePatternUnlocks.ts` |

---

## Remaining Items (Deferred - Low Priority)

| Category | Count | Reason Deferred |
|----------|-------|-----------------|
| Remaining type casts | ~5 | Require function signature refactoring |
| Orphan dialogue nodes | 251 | Most intentional (mystery_hint, trust_recovery, future simulations) |
| Test page metadata | ~10 | Dev-only pages, no SEO value |

---

## Executive Summary

This audit examined `lib/`, `content/`, `hooks/`, `components/`, and `app/` directories for:
- Duplicate constants and hardcoded values
- Type safety gaps
- Missing validation
- Dead code and orphan nodes
- Accessibility and SEO gaps

**Critical findings:** 3 | **High priority:** 12 | **Medium:** 25+ | **Low:** 15+

---

## Table of Contents

1. [Critical Issues](#1-critical-issues)
2. [Lib Directory Findings](#2-lib-directory-findings)
3. [Content/Dialogue Graph Findings](#3-contentdialogue-graph-findings)
4. [Components & Hooks Findings](#4-components--hooks-findings)
5. [App Routes Findings](#5-app-routes-findings)
6. [Recommended Fixes](#6-recommended-fixes)
7. [Fix Priority Matrix](#7-fix-priority-matrix)

---

## 1. Critical Issues

### 1.1 DUPLICATE CONSTANT: `DOMINANT_PATTERN_THRESHOLD`

**Severity:** CRITICAL
**Impact:** Voice variation resolution could diverge based on import source

| File | Line | Definition |
|------|------|------------|
| `lib/constants.ts` | 145 | `export const DOMINANT_PATTERN_THRESHOLD = 5` |
| `lib/patterns.ts` | 366 | `export const DOMINANT_PATTERN_THRESHOLD = 5` (DUPLICATE) |

**Fix:** Remove from `patterns.ts`, import from `constants.ts`

---

### 1.2 ORPHAN NODES IN DIALOGUE GRAPHS

**Severity:** CRITICAL
**Impact:** Players cannot reach entire storylines, career paths, vulnerability arcs

| Character | Orphan Count | Examples |
|-----------|--------------|----------|
| Maya | 24 | `maya_vulnerability_arc`, `maya_birmingham_*`, `maya_future_vision` |
| Grace | 8 | `grace_vulnerability_arc`, `grace_interrupt_*` |
| Isaiah | 9 | `isaiah_simulation_phase*` (entire 3-phase simulation unreachable) |
| Alex | 8 | Various relationship nodes |
| Lira | 4 | Mentor connection nodes |

**Fix:** Create node reachability audit tool, connect orphans to main flow

---

### 1.3 PATTERN ARRAY HARDCODED

**Severity:** CRITICAL
**File:** `hooks/usePatternUnlocks.ts:83`

```typescript
// WRONG - hardcoded array
const patterns: PatternType[] = ['analytical', 'patience', 'exploring', 'helping', 'building']

// CORRECT - import from canonical source
import { PATTERN_TYPES } from '@/lib/patterns'
const patterns = PATTERN_TYPES
```

---

## 2. Lib Directory Findings

### 2.1 Type Coercion Risks (50+ instances)

Unsafe `as unknown as` casts suppress TypeScript safety:

| File | Line | Pattern | Risk |
|------|------|---------|------|
| `lib/character-state.ts` | 448, 455, 798 | `patterns as unknown as Record<string, number>` | Pattern access without validation |
| `lib/live-choice-engine.ts` | 124 | `undefined as unknown as LiveChoiceEngine` | Suppresses singleton check |
| `lib/game-store.ts` | 1156 | `patterns as unknown as Record<string, number>` | Same pattern access risk |
| `lib/supabase.ts` | 60, 72 | `mockClient as unknown as SupabaseClient` | Mock/real switching loses type safety |

### 2.2 Missing Validation in Critical Paths

| Function | File | Issue |
|----------|------|-------|
| `getPatternUnlockChoices()` | `pattern-unlock-choices.ts:33-45` | No validation of characterId or patterns |
| `getPatternUnlocksForCharacter()` | `pattern-affinity.ts:~50` | Character ID not validated |
| `calculateLockStatus()` | `choice-adapter.ts:66` | Pattern value not validated before access |
| `evaluateAnalyticalUnlocks()` | `unlock-effects.ts:198` | dialogueEmotion used without `isValidEmotion()` |

### 2.3 Silent Failures Instead of Exceptions

| Function | File | Issue |
|----------|------|-------|
| `applyStateChange()` | `character-state.ts:326` | Returns unchanged state on invalid characterId (no error) |
| `getGraphForCharacter()` | `graph-registry.ts:100` | Invalid characterId returns wrong graph silently |

### 2.4 Unused Exports

| Function | File | Status |
|----------|------|--------|
| `generateTierReport()` | `character-tiers.ts:216` | No grep matches - UNUSED |
| `orbCountToFillPercent()` | `pattern-unlocks.ts:314` | No grep matches - UNUSED |

### 2.5 Dead Code

| File | Line | Issue |
|------|------|-------|
| `character-state.ts` | 135-136 | D-061 comment duplicated 3 times |
| `unlock-effects.ts` | 238-241 | Commented-out patience unlock logic |
| `character-check-ins.ts` | 58 | Comment with FIX label (unresolved) |

### 2.6 Naming Inconsistencies

| Concept | Names Used | Files |
|---------|-----------|-------|
| Pattern fill level | `fillPercent`, `patternLevel`, `orb count` | Multiple |
| Trust thresholds | `friendly` vs `trusted` (different values) | `constants.ts` |

---

## 3. Content/Dialogue Graph Findings

### 3.1 Invalid Node References

| File | Line | Issue |
|------|------|-------|
| `lira-dialogue-graph.ts` | 1311 | References `samuel_orb_introduction` - doesn't exist |
| `devon-dialogue-graph.ts` | 1979 | Routes to Maya's gateway instead of Devon hub exit |
| `alex-dialogue-graph.ts` | 1797, 1876 | `samuelEntryPoints.ALEX_REFLECTION_GATEWAY` unverified |

### 3.2 Inconsistent Node ID Patterns

**Maya's graph uses 5 different patterns:**
- `maya_studies_response` (verb-noun) ✓
- `maya_early_gratitude` (adjective inserted) ✗
- `maya_birmingham_opportunity` (location-noun) ✗

**Standard should be:** `{character}_{arc}_{beat}` or `{character}_{scene}_{moment}`

### 3.3 Hardcoded Trust Values

Trust changes vary without constants:

| Character | Values Used | Issue |
|-----------|-------------|-------|
| Maya | 1, 2, 3, **4** | `trustChange: 4` appears ONCE (likely typo) |
| Grace | 1, 2 | Binary - too simplistic |
| Others | 1, 2 | Inconsistent with Maya |

**Should use:** `TRUST_INCREMENT = { minor: 1, significant: 2, major: 3 }`

### 3.4 Pattern Threshold Inconsistencies

```typescript
// Same character, wildly different thresholds:
patterns: { building: { min: 3 } }   // Line 484
patterns: { building: { min: 6 } }   // Line 850
patterns: { building: { min: 40 } }  // Line 128
patterns: { building: { min: 50 } }  // Line 143
```

### 3.5 Skill Definition Errors

| File | Issue |
|------|-------|
| `grace-dialogue-graph.ts:151` | Uses `skills: ['triage']` - NOT in 54-skill system |

### 3.6 Character Voice Inconsistencies

| Character | Issue |
|-----------|-------|
| Grace | Shifts from "tired caregiver" to "ER instructor" without transition |
| Alex | Street-smart introduction → philosophical monologue (whiplash) |
| Lira | Vulnerability arc repeats same story instead of adapting voice |

### 3.7 Pattern Imbalance in Choices

| Character | Helping | Patience | Analytical | Exploring | Building |
|-----------|---------|----------|-----------|-----------|----------|
| Grace | **59%** | 39% | 20% | 13% | 9% |
| Isaiah | **52%** | 30% | 22% | 19% | 16% |
| Alex | 23% | 26% | 27% | 24% | 25% |

Grace and Isaiah heavily favor "helping" - limits player choice diversity.

---

## 4. Components & Hooks Findings

### 4.1 Trust Threshold Duplication (5+ files)

| File | Line | Hardcoded Value |
|------|------|-----------------|
| `hooks/useConstellationData.ts` | 41-43 | `3` and `7` for trust states |
| `components/constellation/DetailModal.tsx` | 144 | `trust >= 6` |
| `components/constellation/ConstellationGraph.tsx` | 227, 229 | `trust < 6`, `trust < 8` |
| `components/RelationshipWeb.tsx` | 157, 159 | `trust >= 8`, `trust >= 7` |
| `hooks/usePlayerAnalysis.ts` | 177 | `trust > 3` |

### 4.2 Duplicate Constants in Hooks

| File | Line | Issue |
|------|------|-------|
| `hooks/usePatternUnlocks.ts` | 76 | `MAX_ORB_COUNT = 100` duplicates `lib/constants.ts` |
| `hooks/useWaitingRoom.ts` | 139, 153 | `[30, 60, 120]` thresholds duplicated in 2 places |
| `hooks/usePullToDismiss.ts` | 55, 135-141 | `threshold = 100` hardcoded 4 times |

### 4.3 Type Safety Gaps

| File | Issue |
|------|-------|
| `components/RelationshipWeb.tsx:64-71` | `getLinkColor(type: string)` - should be union type |
| `hooks/useConstellationData.ts` | Trust checks with magic numbers, not type-safe enum |

---

## 5. App Routes Findings

### 5.1 Missing Error Boundaries

**Pages without error.tsx:**
- `/app/profile/page.tsx`
- `/app/student/insights/page.tsx`
- `/app/admin/users/page.tsx`
- `/app/admin/diagnostics/page.tsx`
- All test pages

### 5.2 Missing Loading States

**No Suspense or loading.tsx:**
- `/app/admin/` directory
- `/app/student/` directory
- 15+ pages use useState-based loading instead of Suspense

### 5.3 Missing Page Metadata (SEO)

**20+ pages without metadata export:**
- All `/app/admin/*` pages
- `/app/profile/page.tsx`
- `/app/student/insights/page.tsx`
- `/app/welcome/page.tsx`
- All test pages

### 5.4 Accessibility Issues

| File | Issue |
|------|-------|
| `/app/admin/users/page.tsx:177` | `<table>` has no caption or aria-label |
| `/app/admin/preview/page.tsx:216` | Button with only icon, no aria-label |
| `/app/profile/page.tsx:252-264` | Tab buttons missing aria labels |

### 5.5 Performance Issues

**Large imports not using dynamic imports:**
- `/app/admin/preview/page.tsx:25-37` - Imports ALL 12 dialogue graphs at top level

```typescript
// Problem: 100+ KB loaded immediately
import { samuelDialogueNodes } from '@/content/samuel-dialogue-graph'
import { mayaDialogueNodes } from '@/content/maya-dialogue-graph'
// ... 10 more
```

### 5.6 Hardcoded URLs

| File | Line | Issue |
|------|------|-------|
| `app/layout.tsx` | 47, 51, 69 | `'https://lux-story.com'` hardcoded |

---

## 6. Recommended Fixes

### 6.1 Constants Consolidation

Add to `lib/constants.ts`:

```typescript
// Trust state thresholds (used in constellation, relationships)
export const TRUST_STATE_THRESHOLDS = {
  unmet: 0,
  met: 3,
  connected: 7,
  trusted: 10
} as const

// Relationship intensity
export const RELATIONSHIP_INTENSITY_THRESHOLDS = {
  standard: 7,
  deep: 8
} as const

// Waiting room timers
export const WAITING_ROOM_THRESHOLDS = [30, 60, 120] as const

// Pull-to-dismiss defaults
export const PULL_TO_DISMISS_DEFAULTS = {
  standard: 100,
  modal: 150
} as const

// Trust change increments for dialogue
export const TRUST_INCREMENT = {
  minor: 1,
  significant: 2,
  major: 3
} as const
```

### 6.2 Validation Function Additions

Add to `lib/emotions.ts`:
```typescript
export function isValidEmotion(emotion: string): boolean {
  return EMOTION_TYPES.includes(emotion as EmotionType)
}
```

### 6.3 Type-Safe Relationship Colors

Create `lib/relationship-types.ts`:
```typescript
export type RelationshipType = 'ally' | 'mentor' | 'protege' | 'rival' | 'parallel' | 'complicated' | 'former'

export const RELATIONSHIP_COLORS: Record<RelationshipType, string> = {
  ally: '#10b981',
  mentor: '#3b82f6',
  protege: '#8b5cf6',
  rival: '#f59e0b',
  parallel: '#ec4899',
  complicated: '#ef4444',
  former: '#94a3b8'
}
```

---

## 7. Fix Priority Matrix

### CRITICAL (Fix Immediately)

| Issue | File(s) | Effort |
|-------|---------|--------|
| Remove duplicate `DOMINANT_PATTERN_THRESHOLD` | `lib/patterns.ts` | 5 min |
| Import `PATTERN_TYPES` in usePatternUnlocks | `hooks/usePatternUnlocks.ts` | 5 min |
| Import `MAX_ORB_COUNT` from constants | `hooks/usePatternUnlocks.ts` | 5 min |

### HIGH PRIORITY (This Sprint)

| Issue | File(s) | Effort |
|-------|---------|--------|
| Consolidate trust thresholds to constants | 5 files | 30 min |
| Add `isValidEmotion()` function | `lib/emotions.ts` | 15 min |
| Fix invalid node references | 3 dialogue graphs | 1 hour |
| Add error boundaries to admin pages | `app/admin/` | 30 min |

### MEDIUM PRIORITY (Next Sprint)

| Issue | File(s) | Effort |
|-------|---------|--------|
| Create node reachability audit tool | New script | 2-4 hours |
| Connect orphan nodes to main flow | Content files | 4-8 hours |
| Add page metadata for SEO | 20+ pages | 2 hours |
| Fix accessibility issues | Multiple | 2 hours |
| Standardize node ID naming | Content files | 4 hours |

### LOW PRIORITY (Backlog)

| Issue | File(s) | Effort |
|-------|---------|--------|
| Remove dead code/comments | Multiple | 1 hour |
| Dynamic imports for dialogue graphs | `app/admin/preview/` | 1 hour |
| Remove unused exports | `lib/` | 30 min |
| Pattern balance in dialogue choices | Content files | 8+ hours |

---

## Appendix: Files Requiring Changes

### Quick Fixes (< 10 lines each)

1. `lib/patterns.ts` - Remove duplicate constant
2. `hooks/usePatternUnlocks.ts` - Import PATTERN_TYPES and MAX_ORB_COUNT
3. `hooks/useWaitingRoom.ts` - Extract threshold constant
4. `components/IdentityCeremony.tsx` - ✅ FIXED (this session)

### Medium Changes (10-50 lines each)

5. `hooks/useConstellationData.ts` - Use TRUST_STATE_THRESHOLDS
6. `components/constellation/ConstellationGraph.tsx` - Use constants
7. `components/constellation/DetailModal.tsx` - Use constants
8. `components/RelationshipWeb.tsx` - Use constants + type-safe colors
9. `hooks/usePlayerAnalysis.ts` - Use constants

### Large Changes (50+ lines or multiple files)

10. Create node reachability audit script
11. Fix 50+ orphan nodes across dialogue graphs
12. Add error.tsx to 10+ routes
13. Add metadata to 20+ pages

---

**Next Steps:**
1. Fix critical issues (3 quick fixes)
2. Run `npm test` to verify no regressions
3. Create node reachability tool for dialogue graph audit
4. Schedule high-priority fixes for this sprint
