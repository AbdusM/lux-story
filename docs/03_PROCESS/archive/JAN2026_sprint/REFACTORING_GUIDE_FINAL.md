# Lux Story Refactoring Guide & Development Plan
**Verified Best Practices from OrbVoice**

**Created:** January 7, 2026
**Version:** 2.1 (With Development Plan)
**Status:** Production-ready with sprint breakdown

---

## Software Development Plan

### Sprint Overview

| Sprint | Focus | Duration | Effort |
|--------|-------|----------|--------|
| **Sprint 1** | Content Validation & Error Handling | 1 week | 5-7h |
| **Sprint 2** | StatefulGameInterface Assessment | 1-2 weeks | 6-15h |
| **Sprint 3** | Performance & Documentation | 1 week | 4-6h |

**Total: 15-28 hours across 3-4 weeks**

---

## Sprint 1: Foundation (5-7 hours)

### Goal
Establish safety nets before any refactoring work.

### Task 1.1: Enhanced Content Validation
**Effort:** 3-4h | **Priority:** P0

**Deliverable:** `scripts/validate-dialogue-graphs-enhanced.ts`

**Acceptance Criteria:**
- [ ] Detects duplicate nodeIds across all 16 characters
- [ ] Catches broken nextNodeId references
- [ ] Warns on orphaned (unreachable) nodes
- [ ] Validates trust changes are within [-2, 2] range
- [ ] Reports node/choice/interrupt counts per character
- [ ] Exits with code 1 on errors (blocks CI)
- [ ] Add to package.json as `validate-graphs:enhanced`

**Test Command:**
```bash
npm run validate-graphs:enhanced
# Expected: ✅ for all 16 characters, 983 nodes validated
```

---

### Task 1.2: Layered Error Boundaries
**Effort:** 2-3h | **Priority:** P0

**Deliverable:** Updated `components/ErrorBoundary.tsx`

**Acceptance Criteria:**
- [ ] Three levels: `page`, `game`, `section`
- [ ] Sentry integration with error context
- [ ] Custom fallback support per boundary
- [ ] Reset handler that doesn't lose game state
- [ ] Dev mode shows stack trace
- [ ] Wrap StatefulGameInterface with `game` level
- [ ] Wrap Journal with `section` level

**Test Scenarios:**
```
1. Throw error in Journal → Journal shows fallback, game continues
2. Throw error in game → Game shows restart option, page intact
3. Throw error in page → Full reload option
```

---

### Sprint 1 Definition of Done
- [ ] `npm run validate-graphs:enhanced` passes
- [ ] Error boundaries tested with intentional throws
- [ ] No regressions in `npm test`
- [ ] PR merged to main

---

## Sprint 2: StatefulGameInterface Assessment (6-15 hours)

### Goal
Understand and document the largest component. Split ONLY if criteria met.

### Task 2.1: Structure Analysis
**Effort:** 2-3h | **Priority:** P1

**Deliverable:** Section map comment at top of file

**Actions:**
```bash
# Generate line-by-line function map
grep -n "function\|const.*=.*=>\|export" components/StatefulGameInterface.tsx > analysis.txt
```

**Acceptance Criteria:**
- [ ] Document sections with line ranges
- [ ] Identify distinct responsibilities
- [ ] List all hooks used
- [ ] Count re-render triggers
- [ ] Add header comment with section guide

---

### Task 2.2: Split Decision
**Effort:** 1h | **Priority:** P1

**Decision Matrix:**

| Criteria | Threshold | Action if Met |
|----------|-----------|---------------|
| 3+ distinct responsibilities | Yes | Consider splitting |
| Any function >200 LOC | Yes | Extract to hook |
| Repeated patterns | Yes | Create shared component |
| Test coverage <80% | Yes | Add tests before split |

**If NO criteria met:** Document and close task. File is fine as-is.

---

### Task 2.3: Extraction (IF WARRANTED)
**Effort:** 8-12h | **Priority:** P1 (conditional)

**Potential Extractions:**
```
hooks/
├── useGameFlow.ts         # Scene/dialogue progression
├── useGameEffects.ts      # Side effects
└── useGamePersistence.ts  # Save/load

components/game/
├── DialoguePane.tsx       # Message display
├── ChoicesPane.tsx        # Choice container
└── GameHeader.tsx         # Top nav/status
```

**Per-Extraction Checklist:**
- [ ] Create new file with extracted code
- [ ] Update imports in StatefulGameInterface
- [ ] Verify no circular dependencies
- [ ] Run `npm test` - all passing
- [ ] Run `npm run dev` - visual verification
- [ ] Commit extraction in isolation

---

### Sprint 2 Definition of Done
- [ ] StatefulGameInterface has header documentation
- [ ] Split decision documented (yes/no with rationale)
- [ ] If split: each extraction tested and verified
- [ ] If no split: file documented, task closed
- [ ] No test regressions

---

## Sprint 3: Performance & Polish (4-6 hours)

### Task 3.1: Bundle Analysis Setup
**Effort:** 1h | **Priority:** P2

**Deliverable:** Bundle analyzer configured

**Actions:**
```bash
npm install --save-dev @next/bundle-analyzer
```

**Acceptance Criteria:**
- [ ] `npm run analyze` opens bundle visualization
- [ ] Document top 5 largest dependencies
- [ ] Identify lazy-load candidates

---

### Task 3.2: Lazy Load Admin Dependencies
**Effort:** 1-2h | **Priority:** P2

**Target:** Admin-only heavy dependencies

**Candidates:**
- `@react-pdf/renderer` (~300KB)
- `recharts` (~200KB)
- Large admin dashboard sections

**Acceptance Criteria:**
- [ ] PDFReport loaded dynamically
- [ ] Admin charts loaded dynamically
- [ ] Main game bundle reduced by identified amount
- [ ] No admin functionality broken

---

### Task 3.3: Architecture Documentation
**Effort:** 2-3h | **Priority:** P2

**Deliverables:**
1. `docs/adr/001-derivative-system.md`
2. `docs/adr/002-state-management.md`
3. Header comments for files >1000 LOC

**Acceptance Criteria:**
- [ ] ADR template established
- [ ] Derivative system decision documented
- [ ] State management decision documented
- [ ] loyalty-experience.ts has section map
- [ ] game-store.ts has section map

---

### Sprint 3 Definition of Done
- [ ] Bundle analysis report generated
- [ ] Lazy loading implemented for admin deps
- [ ] 2+ ADRs written
- [ ] Large files documented
- [ ] Knowledge transfer complete

---

## Quick Start Commands

```bash
# Sprint 1: Validation
npm run validate-graphs:enhanced  # After creating script

# Sprint 2: Analysis
wc -l components/StatefulGameInterface.tsx
grep -n "function\|const.*=>" components/StatefulGameInterface.tsx | head -50

# Sprint 3: Bundle
npm run analyze
```

---

## Progress Tracking

### Sprint 1 Checklist
- [ ] Task 1.1: Enhanced validation script
- [ ] Task 1.2: Error boundaries
- [ ] Sprint 1 DoD complete

### Sprint 2 Checklist
- [ ] Task 2.1: Structure analysis
- [ ] Task 2.2: Split decision made
- [ ] Task 2.3: Extraction (if applicable)
- [ ] Sprint 2 DoD complete

### Sprint 3 Checklist
- [ ] Task 3.1: Bundle analyzer setup
- [ ] Task 3.2: Lazy loading implemented
- [ ] Task 3.3: ADRs written
- [ ] Sprint 3 DoD complete

---

## Executive Summary

This guide applies **proven OrbVoice patterns** to lux-story, with all claims verified against actual codebase metrics.

### Verified Codebase Metrics

| Metric | Actual Value | Source |
|--------|--------------|--------|
| **Largest Component** | `StatefulGameInterface.tsx` (3,363 LOC) | `wc -l` |
| **Largest Lib File** | `loyalty-experience.ts` (2,677 LOC) | `wc -l` |
| **Total Components** | 69 files (24,734 LOC combined) | `find` |
| **Total Lib Files** | 162 files (53,939 LOC combined) | `find` |
| **Dialogue Nodes** | 983 across 16 characters | Content audit |
| **Tests Passing** | 739 | `npm test` |

### What's Worth Doing (17-29h total)

| Priority | Task | Effort | Impact |
|----------|------|--------|--------|
| 1 | Review `StatefulGameInterface.tsx` | 6-15h | Maintainability of largest file |
| 2 | Enhance content validation | 3-4h | Catch errors at build time |
| 3 | Add layered error boundaries | 2-3h | Graceful degradation |
| 4 | Profile & optimize bundle | 2h | Data-driven performance |
| 5 | Document architecture | 2-3h | Easier onboarding |

### What's Already Good (Don't Change)

| Area | Why It's Fine |
|------|---------------|
| `GameChoices.tsx` (699 LOC) | Reasonable size, well-structured |
| `Journal.tsx` (389 LOC) | Compact, focused |
| Derivative modules (7 files) | Clean separation, 239 tests |
| `ui-constants.ts` (220 LOC) | Well-organized tokens |
| State management | Zustand + coreGameState works |

---

## Priority 1: StatefulGameInterface.tsx Review

**File:** `components/StatefulGameInterface.tsx`
**Size:** 3,363 LOC (largest component)

### Assessment Approach

```bash
# Understand the structure
head -100 components/StatefulGameInterface.tsx
grep -n "function\|const.*=.*=>" components/StatefulGameInterface.tsx | head -30
```

### When to Split (Criteria)

Split **only if** you find:
- [ ] 3+ distinct responsibilities in one file
- [ ] Functions >200 LOC that could be hooks
- [ ] Repeated patterns across sections
- [ ] Difficulty writing focused tests

### Potential Extractions (If Warranted)

```
components/game/
├── StatefulGameInterface.tsx  # Main container (target: <1500 LOC)
├── DialoguePane.tsx           # Message display logic
├── ChoicesPane.tsx            # Choice container (uses GameChoices)
├── GameHeader.tsx             # Top navigation/status
└── hooks/
    ├── useGameFlow.ts         # Scene/dialogue progression
    ├── useGameEffects.ts      # Side effects handling
    └── useGamePersistence.ts  # Save/load logic
```

### Don't Over-Engineer

If the file is organized with clear sections and comments, **large doesn't mean bad**. Game interfaces are inherently complex. Document and move on.

**Estimated Effort:** 6h assessment, 10-15h if splitting is warranted

---

## Priority 2: Content Validation Enhancement

**Current:** `npm run validate-graphs` exists
**Enhancement:** Add more comprehensive checks

### Enhanced Validation Script

```typescript
// File: scripts/validate-dialogue-graphs-enhanced.ts
import { CHARACTER_IDS } from '@/lib/graph-registry'

interface ValidationResult {
  character: string
  errors: string[]
  warnings: string[]
  stats: {
    nodeCount: number
    choiceCount: number
    interruptCount: number
    vulnerabilityArcs: number
  }
}

async function validateAllGraphs(): Promise<ValidationResult[]> {
  const results: ValidationResult[] = []

  for (const characterId of CHARACTER_IDS) {
    const graph = await import(`@/content/${characterId}-dialogue-graph`)
    const result = validateGraph(characterId, graph)
    results.push(result)
  }

  return results
}

function validateGraph(characterId: string, graph: any): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const nodeIds = new Set<string>()
  const referencedIds = new Set<string>()

  // Collect all node IDs
  for (const node of graph.nodes || []) {
    if (nodeIds.has(node.nodeId)) {
      errors.push(`Duplicate nodeId: ${node.nodeId}`)
    }
    nodeIds.add(node.nodeId)

    // Collect referenced IDs from choices
    for (const choice of node.choices || []) {
      referencedIds.add(choice.nextNodeId)

      // Validate trust changes are bounded
      for (const effect of choice.effects || []) {
        if (effect.type === 'applyTrust') {
          if (effect.value < -2 || effect.value > 2) {
            warnings.push(`${node.nodeId}: Trust change ${effect.value} outside typical range [-2, 2]`)
          }
        }
      }
    }

    // Validate content exists
    if (!node.content || node.content.length === 0) {
      errors.push(`${node.nodeId}: Missing content`)
    }

    // Validate choices exist (except terminal nodes)
    if ((!node.choices || node.choices.length === 0) && !node.nodeId.includes('_end')) {
      warnings.push(`${node.nodeId}: No choices (terminal node?)`)
    }
  }

  // Check for broken references
  for (const refId of referencedIds) {
    if (!nodeIds.has(refId) && !refId.startsWith('external_')) {
      errors.push(`Broken reference: "${refId}" does not exist`)
    }
  }

  // Check for orphaned nodes (unreachable)
  const introNode = Array.from(nodeIds).find(id => id.includes('introduction'))
  if (introNode) {
    for (const nodeId of nodeIds) {
      if (nodeId !== introNode && !referencedIds.has(nodeId)) {
        warnings.push(`Potentially orphaned: ${nodeId}`)
      }
    }
  }

  return {
    character: characterId,
    errors,
    warnings,
    stats: {
      nodeCount: nodeIds.size,
      choiceCount: Array.from(graph.nodes || []).reduce(
        (sum: number, n: any) => sum + (n.choices?.length || 0), 0
      ),
      interruptCount: Array.from(graph.nodes || []).filter(
        (n: any) => n.interrupt
      ).length,
      vulnerabilityArcs: Array.from(graph.nodes || []).filter(
        (n: any) => n.nodeId.includes('vulnerability')
      ).length
    }
  }
}

// Run validation
async function main() {
  console.log('🔍 Validating dialogue graphs...\n')

  const results = await validateAllGraphs()
  let hasErrors = false

  for (const result of results) {
    const status = result.errors.length === 0 ? '✅' : '❌'
    console.log(`${status} ${result.character}`)
    console.log(`   Nodes: ${result.stats.nodeCount}, Choices: ${result.stats.choiceCount}`)
    console.log(`   Interrupts: ${result.stats.interruptCount}, Vulnerability Arcs: ${result.stats.vulnerabilityArcs}`)

    if (result.errors.length > 0) {
      hasErrors = true
      console.log('   ERRORS:')
      result.errors.forEach(e => console.log(`     ❌ ${e}`))
    }

    if (result.warnings.length > 0) {
      console.log('   Warnings:')
      result.warnings.slice(0, 5).forEach(w => console.log(`     ⚠️ ${w}`))
      if (result.warnings.length > 5) {
        console.log(`     ... and ${result.warnings.length - 5} more`)
      }
    }
    console.log()
  }

  // Summary
  const totalNodes = results.reduce((sum, r) => sum + r.stats.nodeCount, 0)
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0)
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0)

  console.log('━'.repeat(50))
  console.log(`Total: ${totalNodes} nodes across ${results.length} characters`)
  console.log(`Errors: ${totalErrors}, Warnings: ${totalWarnings}`)

  if (hasErrors) {
    console.error('\n🚨 Validation failed!')
    process.exit(1)
  }

  console.log('\n✨ All dialogue graphs valid!')
}

main()
```

**Add to package.json:**
```json
"validate-graphs:enhanced": "npx tsx scripts/validate-dialogue-graphs-enhanced.ts"
```

**Estimated Effort:** 3-4 hours

---

## Priority 3: Layered Error Boundaries

**OrbVoice Pattern:** Multiple error boundary levels prevent cascading failures.

### Implementation

```typescript
// File: components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import * as Sentry from '@sentry/nextjs'

type ErrorLevel = 'page' | 'game' | 'section'

interface Props {
  children: ReactNode
  level: ErrorLevel
  fallback?: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
}

const ERROR_MESSAGES: Record<ErrorLevel, { title: string; action: string }> = {
  page: { title: 'Page Error', action: 'Reload Page' },
  game: { title: 'Game Error', action: 'Restart Game' },
  section: { title: 'Section Error', action: 'Try Again' }
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to Sentry with context
    Sentry.withScope(scope => {
      scope.setTag('errorBoundary', this.props.level)
      scope.setExtra('componentStack', errorInfo.componentStack)
      Sentry.captureException(error)
    })

    console.error(`[ErrorBoundary:${this.props.level}]`, error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()

    if (this.props.level === 'page') {
      window.location.reload()
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    if (this.props.fallback) {
      return this.props.fallback
    }

    const { title, action } = ERROR_MESSAGES[this.props.level]

    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[200px]">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4 text-center max-w-md">
          {this.state.error?.message || 'Something unexpected happened'}
        </p>
        <Button onClick={this.handleReset} variant="outline">
          {action}
        </Button>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-4 p-4 bg-red-50 text-red-800 text-xs overflow-auto max-w-full">
            {this.state.error?.stack}
          </pre>
        )}
      </div>
    )
  }
}
```

### Usage Pattern

```tsx
// File: app/layout.tsx
export default function RootLayout({ children }: Props) {
  return (
    <html>
      <body>
        <ErrorBoundary level="page">
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}

// File: components/StatefulGameInterface.tsx
export function StatefulGameInterface() {
  return (
    <ErrorBoundary level="game" onReset={() => resetGameState()}>
      <div className="game-container">
        <ErrorBoundary level="section">
          <DialoguePane />
        </ErrorBoundary>
        <ErrorBoundary level="section">
          <ChoicesPane />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  )
}

// File: components/Journal.tsx
export function Journal() {
  return (
    <ErrorBoundary level="section" fallback={<JournalFallback />}>
      {/* Journal content */}
    </ErrorBoundary>
  )
}
```

**Estimated Effort:** 2-3 hours

---

## Priority 4: Bundle Analysis

**Before optimizing, measure.**

### Setup Bundle Analyzer

```bash
npm install --save-dev @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // existing config
})
```

```json
// package.json
"analyze": "ANALYZE=true npm run build"
```

### Run Analysis

```bash
npm run analyze
# Opens browser with bundle visualization
```

### What to Look For

| Issue | Solution |
|-------|----------|
| Large npm packages | Consider alternatives or tree-shaking |
| Duplicate dependencies | Check for version conflicts |
| Unused exports | Enable `sideEffects: false` in package.json |
| Large page bundles | Code split with dynamic imports |

### Likely Findings for lux-story

Based on your dependencies:
- `d3` (full library) → Consider `d3-force` only if not using other d3 features
- `framer-motion` (~50KB) → Already tree-shakeable, ensure proper imports
- `recharts` → Lazy load admin charts
- `@react-pdf/renderer` → Definitely lazy load (only admin uses it)

```typescript
// Lazy load heavy admin dependencies
const PDFReport = dynamic(() => import('@/components/admin/PDFReport'), {
  loading: () => <Spinner />,
  ssr: false
})
```

**Estimated Effort:** 2 hours

---

## Priority 5: Architecture Documentation

Your `CLAUDE.md` is excellent. Enhance with:

### Add Architecture Decision Records (ADRs)

```markdown
<!-- File: docs/adr/001-derivative-system.md -->
# ADR 001: Derivative System Architecture

## Status
Accepted

## Context
Game state requires computed properties (trust momentum, pattern balance, etc.)
that depend on multiple state fields.

## Decision
Split into 7 focused derivative modules:
- trust-derivatives.ts (834 LOC)
- pattern-derivatives.ts (1,055 LOC)
- character-derivatives.ts (1,104 LOC)
- narrative-derivatives.ts (982 LOC)
- knowledge-derivatives.ts (629 LOC)
- interrupt-derivatives.ts
- assessment-derivatives.ts (1,012 LOC)

## Consequences
- ✅ Each module testable independently (239 tests)
- ✅ Clear ownership of computations
- ✅ Easy to add new derivatives
- ⚠️ Some cross-module dependencies (acceptable)

## Alternatives Considered
1. **Single derivatives file** - Rejected (too large)
2. **Class-based engine** - Rejected (over-engineering for current needs)
```

### Document Large Files

```markdown
<!-- Add to top of StatefulGameInterface.tsx -->
/**
 * StatefulGameInterface - Main Game Container
 *
 * SIZE: ~3,300 LOC (largest component)
 *
 * SECTIONS:
 * - Lines 1-100: Imports and types
 * - Lines 100-400: State management hooks
 * - Lines 400-800: Game flow logic
 * - Lines 800-1200: Effect handlers
 * - Lines 1200-2000: Dialogue rendering
 * - Lines 2000-2800: Choice handling
 * - Lines 2800-3363: UI composition
 *
 * FUTURE CONSIDERATIONS:
 * - If adding new major features, consider extracting to hooks
 * - Dialogue rendering could become DialoguePane component
 * - Choice handling could become ChoicesPane component
 *
 * LAST REVIEWED: January 2026
 */
```

**Estimated Effort:** 2-3 hours

---

## OrbVoice Patterns That DO Apply

### Pattern 1: Defensive Null Handling

```typescript
// ❌ Risky
const trust = gameState.characters.get('maya').trust

// ✅ Safe
const trust = gameState.characters.get('maya')?.trust ?? 0
```

**Apply to:** Any component accessing nested state

### Pattern 2: Type-Safe Selectors

```typescript
// File: lib/game-store-selectors.ts
import { useGameStore } from './game-store'
import { type CharacterId } from './graph-registry'

export const useCharacterTrust = (characterId: CharacterId) =>
  useGameStore(state =>
    state.coreGameState?.characters.get(characterId)?.trust ?? 0
  )

export const useDominantPattern = () =>
  useGameStore(state => {
    const patterns = state.coreGameState?.patterns
    if (!patterns) return null

    return Object.entries(patterns).reduce(
      (max, [pattern, score]) =>
        score > (max.score || 0) ? { pattern, score } : max,
      { pattern: null as string | null, score: 0 }
    ).pattern
  })
```

**Apply to:** Components that read from game store

### Pattern 3: Non-Blocking Persistence

```typescript
// File: lib/database-service.ts (enhancement)

// ❌ Risky: Await DB before continuing
async function saveAndContinue(data: GameState) {
  await supabase.from('profiles').upsert(data) // Blocks on failure
  return data
}

// ✅ Safe: Fire-and-forget with queue
async function saveAndContinue(data: GameState) {
  // Save to localStorage immediately (source of truth)
  localStorage.setItem('gameState', JSON.stringify(data))

  // Queue Supabase sync (non-blocking)
  syncQueue.add({ type: 'saveProfile', data })

  return data // Return immediately
}
```

**You already do this** with `sync-queue.ts` - this pattern is validated.

### Pattern 4: Semantic Color Usage

Your pattern colors already have semantic meaning:
```typescript
// Already in GameChoices.tsx - this is good!
const PATTERN_HOVER_STYLES = {
  analytical: { /* blue */ },   // Logic, data
  patience: { /* green */ },    // Calm, timing
  exploring: { /* purple */ },  // Discovery
  helping: { /* pink */ },      // Empathy
  building: { /* amber */ }     // Creation
}
```

---

## What NOT to Do (Verified)

| Don't | Why |
|-------|-----|
| Split `GameChoices.tsx` | 699 LOC is fine |
| Split `Journal.tsx` | 389 LOC is fine |
| Add Zod schemas | TypeScript + existing scripts sufficient |
| Create "Derivatives Engine" class | Current modules are well-designed |
| "Consolidate" design tokens | Already properly organized |
| "Fix" state duplication | May be intentional optimization |

---

## Quick Reference: File Sizes

### Components (Actual)
```
StatefulGameInterface.tsx   3,363 LOC  ← Review this one
GameChoices.tsx               699 LOC  ✓ Fine
EvidenceSection.tsx           552 LOC  ✓ Fine
JourneySummary.tsx            523 LOC  ✓ Fine
DetailModal.tsx               500 LOC  ✓ Fine
Journal.tsx                   389 LOC  ✓ Fine
```

### Lib (Actual)
```
loyalty-experience.ts       2,677 LOC  ← Consider documenting
game-store.ts               1,192 LOC  ✓ Reasonable for central store
character-relationships.ts  1,170 LOC  ✓ Complex domain
consequence-echoes.ts       1,156 LOC  ✓ Complex domain
character-derivatives.ts    1,104 LOC  ✓ Fine
pattern-derivatives.ts      1,055 LOC  ✓ Fine
```

---

## Verification Commands

```bash
# Verify any file size claim
wc -l path/to/file.tsx

# Find actual largest files
find components -name "*.tsx" -exec wc -l {} + | sort -n | tail -10
find lib -name "*.ts" -exec wc -l {} + | sort -n | tail -10

# Run existing validation
npm run validate-graphs
npm run validate-skills

# Check test coverage
npm run test:coverage

# Analyze bundle (after setup)
npm run analyze
```

---

## Summary

### Do These (17-29h total)
1. **Review StatefulGameInterface.tsx** - 6-15h
2. **Enhance validation scripts** - 3-4h
3. **Add error boundaries** - 2-3h
4. **Profile bundle** - 2h
5. **Document architecture** - 2-3h

### Skip These
- Component splitting (files are reasonable size)
- Design token migration (already organized)
- Zod schema addition (TypeScript is sufficient)
- Derivatives engine wrapper (already well-designed)

### Your Codebase is Good
- 739 tests passing
- 7 well-structured derivative modules
- Comprehensive CLAUDE.md documentation
- Clean separation of concerns
- Solid state management pattern

**Focus energy on StatefulGameInterface.tsx review and content validation. Everything else is refinement.**

---

**Version:** 2.0 (Verified & Corrected)
**Last Updated:** January 7, 2026
