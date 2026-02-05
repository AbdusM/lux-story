# QA Completion Plan: Remaining Items

**Date:** January 22, 2026
**Status:** Ready for Implementation
**Estimated Effort:** 8-12 hours total

---

## Overview

This plan addresses the remaining lower-priority items from the QA audit:

| Category | Items | Effort | Priority |
|----------|-------|--------|----------|
| Orphan Dialogue Nodes | 50+ nodes | 4-6 hours | Medium |
| Dead Code Cleanup | ~15 locations | 1-2 hours | Low |
| Page Metadata (SEO) | 20+ pages | 2-3 hours | Medium |
| Type Safety Improvements | 50+ casts | 2-3 hours | Medium |

---

## Phase 1: Orphan Dialogue Nodes (4-6 hours)

### Problem
50+ dialogue nodes are unreachable from any choice path:
- Maya: 24 orphan nodes
- Grace: 8 orphan nodes
- Isaiah: 9 orphan nodes (entire simulation unreachable)
- Others: ~10 nodes

### Solution: Create Node Reachability Audit Script

#### Step 1.1: Create Analysis Script

**File:** `scripts/audit-dialogue-reachability.ts`

```typescript
/**
 * Dialogue Node Reachability Audit
 *
 * Analyzes all dialogue graphs to find:
 * 1. Orphan nodes (no incoming edges)
 * 2. Dead-end nodes (no outgoing edges, not marked as terminal)
 * 3. Invalid references (nextNodeId pointing to non-existent nodes)
 */

import * as fs from 'fs'
import * as path from 'path'

interface NodeInfo {
  nodeId: string
  file: string
  line: number
  hasChoices: boolean
  incomingRefs: string[]
  outgoingRefs: string[]
}

interface AuditResult {
  totalNodes: number
  orphanNodes: NodeInfo[]
  deadEndNodes: NodeInfo[]
  invalidRefs: { from: string, to: string, file: string }[]
}

// Implementation:
// 1. Parse all *-dialogue-graph.ts files
// 2. Extract nodeId and nextNodeId references
// 3. Build adjacency map
// 4. Find nodes with no incoming edges (orphans)
// 5. Find nodes with no outgoing edges (dead ends)
// 6. Validate all nextNodeId references exist
```

#### Step 1.2: Run Audit and Categorize

Run script to generate report:
```bash
npx ts-node scripts/audit-dialogue-reachability.ts > docs/audit/dialogue-reachability-report.md
```

Expected output categories:
1. **Entry Points** (intentional orphans) - `*_introduction` nodes
2. **Interrupt Targets** (conditional orphans) - only reachable via interrupt
3. **True Orphans** (bugs) - nodes that should be connected
4. **Terminal Nodes** (intentional dead ends) - loyalty triggers, exits
5. **Broken Dead Ends** (bugs) - nodes missing choices

#### Step 1.3: Fix Categories

| Category | Action |
|----------|--------|
| Entry Points | Document as intentional, add `isEntryPoint: true` flag |
| Interrupt Targets | Add `isInterruptTarget: true` flag for documentation |
| True Orphans | Connect to appropriate parent nodes via new choices |
| Terminal Nodes | Add `isTerminal: true` flag and document purpose |
| Broken Dead Ends | Add missing choices or mark as terminal |

#### Step 1.4: Priority Fixes by Character

**High Priority (Core Characters):**
1. Maya (24 orphans) - vulnerability arc, career paths unreachable
2. Isaiah (9 orphans) - entire 3-phase simulation unreachable
3. Grace (8 orphans) - vulnerability arc unreachable

**Medium Priority:**
4. Alex, Lira, others

#### Step 1.5: Validation

After fixes:
```bash
npm test  # Ensure no regressions
npx ts-node scripts/audit-dialogue-reachability.ts  # Verify orphan count reduced
```

---

## Phase 2: Dead Code Cleanup (1-2 hours)

### Problem
~15 locations with commented-out code, duplicate comments, or unused code.

### Identified Locations

| File | Line | Type | Action |
|------|------|------|--------|
| `lib/character-state.ts` | 135-136 | Duplicate comment (3x D-061) | Remove duplicates |
| `lib/unlock-effects.ts` | 238-241 | Commented patience unlock | Remove or restore |
| `lib/character-check-ins.ts` | 58 | FIX comment | Resolve or remove |
| `lib/character-tiers.ts` | 216 | Unused `generateTierReport()` | Remove export or use |
| `lib/pattern-unlocks.ts` | 314 | Unused `orbCountToFillPercent()` | Verify usage, remove if unused |

### Step 2.1: Audit Unused Exports

```bash
# Find all exports
grep -r "export function\|export const" lib/ --include="*.ts" | wc -l

# For each export, verify it's imported somewhere
grep -r "generateTierReport" --include="*.ts" --include="*.tsx" | grep -v "export"
```

### Step 2.2: Remove Dead Code

For each identified location:
1. Read surrounding context
2. If commented code is outdated, delete it
3. If unused export, either:
   - Delete if truly unused
   - Remove `export` keyword if only used internally
   - Add usage if it should be used

### Step 2.3: Fix Duplicate Comments

```typescript
// Before (character-state.ts:135-136)
// D-061: Story Arcs - multi-session narrative threads
// D-061: Story Arcs - multi-session narrative threads
// D-061: Story Arcs - multi-session narrative threads

// After
// D-061: Story Arcs - multi-session narrative threads
```

---

## Phase 3: Page Metadata (SEO) (2-3 hours)

### Problem
20+ pages without page-specific metadata. Only root layout has metadata.

### Pages Needing Metadata

| Route | Type | Priority |
|-------|------|----------|
| `/admin` | Static | Low (internal) |
| `/admin/login` | Static | Low |
| `/admin/users` | Static | Low |
| `/admin/diagnostics` | Static | Low |
| `/admin/skills` | Dynamic | Low |
| `/admin/preview` | Static | Low |
| `/admin/[userId]` | Dynamic | Low |
| `/profile` | Static | Medium |
| `/student/insights` | Static | Medium |
| `/welcome` | Static | High |
| `/test-*` (all) | Static | Skip (dev only) |

### Step 3.1: Create Metadata Template

**File:** `lib/metadata.ts`

```typescript
import { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lux-story.com'

export const baseMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: '%s | Grand Central Terminus',
    default: 'Grand Central Terminus',
  },
  description: 'A magical realist career exploration game',
}

export function createPageMetadata(
  title: string,
  description?: string,
  options?: Partial<Metadata>
): Metadata {
  return {
    title,
    description: description || baseMetadata.description,
    ...options,
  }
}
```

### Step 3.2: Add Metadata to Priority Pages

**`/welcome/page.tsx`:**
```typescript
import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata(
  'Welcome',
  'Begin your journey through Grand Central Terminus'
)
```

**`/profile/page.tsx`:**
```typescript
export const metadata = createPageMetadata(
  'Your Profile',
  'View your journey progress and pattern development'
)
```

### Step 3.3: Add Dynamic Metadata for Admin

**`/admin/[userId]/page.tsx`:**
```typescript
import { Metadata } from 'next'

export async function generateMetadata({
  params
}: {
  params: { userId: string }
}): Promise<Metadata> {
  return {
    title: `Student ${params.userId.slice(0, 8)}... | Admin`,
    robots: { index: false, follow: false }, // Don't index admin pages
  }
}
```

### Step 3.4: Validation

```bash
# Check all pages have metadata
grep -r "export const metadata\|export.*generateMetadata" app/ --include="*.tsx"
```

---

## Phase 4: Type Safety Improvements (2-3 hours)

### Problem
50+ unsafe type casts (`as unknown as`) suppress TypeScript safety.

### High-Risk Casts to Fix

| File | Line | Current | Fix |
|------|------|---------|-----|
| `lib/character-state.ts` | 448 | `patterns as unknown as Record<string, number>` | Add type guard |
| `lib/character-state.ts` | 455 | Same pattern | Add type guard |
| `lib/game-store.ts` | 1156 | Same pattern | Add type guard |
| `lib/choice-adapter.ts` | 77 | `req.pattern as PatternType` | Validate first |

### Step 4.1: Create Type Guards

**Add to `lib/patterns.ts`:**
```typescript
/**
 * Type guard for pattern record access
 * Safely access pattern values with validation
 */
export function getPatternValue(
  patterns: Record<string, number> | PlayerPatterns,
  pattern: string
): number {
  if (!isValidPattern(pattern)) {
    console.warn(`[Patterns] Invalid pattern: ${pattern}`)
    return 0
  }
  return patterns[pattern as PatternType] ?? 0
}

/**
 * Type-safe pattern record
 */
export function asPatternRecord(
  patterns: unknown
): Record<PatternType, number> | null {
  if (!patterns || typeof patterns !== 'object') return null

  const record = patterns as Record<string, unknown>
  const result: Partial<Record<PatternType, number>> = {}

  for (const pattern of PATTERN_TYPES) {
    const value = record[pattern]
    result[pattern] = typeof value === 'number' ? value : 0
  }

  return result as Record<PatternType, number>
}
```

### Step 4.2: Replace Unsafe Casts

**Before (`lib/character-state.ts:448`):**
```typescript
const patterns = state.patterns as unknown as Record<string, number>
const value = patterns[pattern]
```

**After:**
```typescript
import { getPatternValue } from './patterns'
const value = getPatternValue(state.patterns, pattern)
```

### Step 4.3: Fix Pattern Access in Game Store

**Before (`lib/game-store.ts:1156`):**
```typescript
return (state.coreGameState.patterns as unknown as Record<string, number>)[pattern] || 0
```

**After:**
```typescript
return getPatternValue(state.coreGameState.patterns, pattern)
```

### Step 4.4: Validation Wrappers for Choice Adapter

**`lib/choice-adapter.ts`:**
```typescript
// Before
const currentLevel = orbFillLevels[req.pattern as PatternType] ?? 0

// After
if (!isValidPattern(req.pattern)) {
  console.warn(`[ChoiceAdapter] Invalid pattern in requirement: ${req.pattern}`)
  return { isLocked: false, reason: null }
}
const currentLevel = orbFillLevels[req.pattern] ?? 0
```

### Step 4.5: Audit Remaining Casts

After fixing high-risk casts, audit remaining:
```bash
grep -r "as unknown as\|as any" lib/ --include="*.ts" | wc -l
```

Categorize remaining casts:
1. **Necessary** - Browser API compatibility, external libraries
2. **Fixable** - Can add type guards
3. **Low Risk** - In test/mock code only

---

## Implementation Order

### Sprint 1 (4 hours)
1. Create dialogue reachability script
2. Run audit, categorize orphans
3. Fix Maya orphan nodes (highest count)

### Sprint 2 (3 hours)
4. Fix Isaiah orphan nodes (simulation unreachable)
5. Fix Grace orphan nodes
6. Dead code cleanup

### Sprint 3 (3 hours)
7. Create metadata utilities
8. Add metadata to priority pages
9. Type safety improvements (high-risk casts)

### Sprint 4 (2 hours)
10. Remaining orphan node fixes
11. Remaining type safety fixes
12. Final validation and documentation

---

## Validation Checklist

After all fixes:

- [ ] `npm run build` passes
- [ ] `npm test` - all 1181+ tests pass
- [ ] Dialogue reachability script shows reduced orphan count
- [ ] `grep "as unknown as" lib/` shows reduced count
- [ ] All priority pages have metadata
- [ ] No duplicate comments in lib/

---

## Files to Create

| File | Purpose |
|------|---------|
| `scripts/audit-dialogue-reachability.ts` | Node reachability analysis |
| `lib/metadata.ts` | SEO metadata utilities |
| Type guards in `lib/patterns.ts` | Safe pattern access |

## Files to Modify

| File | Changes |
|------|---------|
| `lib/character-state.ts` | Remove duplicates, add type guards |
| `lib/unlock-effects.ts` | Remove dead code |
| `lib/game-store.ts` | Use type-safe pattern access |
| `lib/choice-adapter.ts` | Add validation |
| 20+ `app/**/page.tsx` | Add metadata exports |
| 5+ `content/*-dialogue-graph.ts` | Connect orphan nodes |

---

## Success Metrics

| Metric | Before | Target |
|--------|--------|--------|
| Orphan nodes | 50+ | <10 (intentional only) |
| Dead code locations | ~15 | 0 |
| Pages with metadata | ~5 | 25+ |
| Unsafe type casts | 50+ | <20 (necessary only) |

---

## Risk Assessment

**Low Risk:**
- Dead code cleanup - no behavioral changes
- Page metadata - additive only
- Type guards - same runtime behavior with better safety

**Medium Risk:**
- Orphan node fixes - could affect game flow if connected incorrectly
- Mitigation: Test each character's dialogue flow after changes

---

## Notes

- Skip `/test-*` pages for metadata (dev-only)
- Admin pages get `robots: noindex` metadata
- Preserve intentional orphans (entry points, interrupt targets)
- Document any remaining `as unknown as` casts that are necessary
