# P0 Critical Fixes Handoff Document

**Status:** 🚨 READY FOR EXECUTION
**Date:** January 10, 2026
**Audited By:** Claude Code (Opus 4.5)
**Executing Agent:** Gemini
**Priority:** P0 - CRITICAL BLOCKERS

---

## Executive Summary

Two critical P0 blockers must be fixed before any feature expansion. These violate the `.cursorrules` policy and could cause runtime crashes.

**Estimated Effort:** 3-4 hours total
**Success Criteria:** `npm run type-check` passes with zero `any` usage in simulation code

---

## P0-1: Simulation Type Safety Gap

### Problem
`content/simulation-registry.ts` line 25 has `initialContext: any` which violates `.cursorrules`:
> "No `any` unless absolutely necessary (and commented with justification)"

### Files to Modify

1. **`content/simulation-registry.ts`** - Main fix location
2. **`components/game/simulations/types.ts`** - Enhance type definitions

### Solution: Create Discriminated Union

**Step 1: Create simulation context types in `components/game/simulations/types.ts`**

Add these interfaces after line 61:

```typescript
// ============================================================================
// DISCRIMINATED UNION FOR SIMULATION CONTEXTS (P0 Type Safety Fix)
// ============================================================================

import { SynesthesiaTarget } from '@/lib/visualizers/synesthesia-types'
import { BotanyTarget } from '@/lib/visualizers/botany-types'

/**
 * Base context for all simulations
 */
interface BaseContext {
  label?: string
  content?: string
  displayStyle?: 'text' | 'code' | 'visual'
}

/**
 * Context for audio_studio and news_feed (Synesthesia-based)
 */
export interface SynesthesiaContext extends BaseContext {
  target: SynesthesiaTarget
}

/**
 * Context for botany_grid
 */
export interface BotanyContext extends BaseContext {
  target: BotanyTarget
}

/**
 * Context for dashboard_triage (medical, logistics, etc.)
 */
export interface TriageContext extends BaseContext {
  items?: DataItem[]
}

/**
 * Context for visual_canvas, architect_3d
 */
export interface CanvasContext extends BaseContext {
  variant?: 'blueprint' | 'art' | 'navigation'
}

/**
 * Context for chat_negotiation, conversation_tree
 */
export interface NegotiationContext extends BaseContext {
  variant?: 'diplomacy' | 'sales' | 'therapy'
}

/**
 * Context for system_architecture
 */
export interface SystemArchitectureContext extends BaseContext {
  // Servo debugger, PID tuning
}

/**
 * Context for conductor_interface
 */
export interface ConductorContext extends BaseContext {
  // Station operations
}

/**
 * Context for secure_terminal
 */
export interface SecureTerminalContext extends BaseContext {
  // Secure operations
}

/**
 * Context for data_audit, data_ticker
 */
export interface DataContext extends BaseContext {
  // Data analysis
}

/**
 * Context for historical_timeline
 */
export interface TimelineContext extends BaseContext {
  // Historical archive
}

/**
 * Context for creative_direction (pitch decks)
 */
export interface CreativeContext extends BaseContext {
  // Pitch building
}

/**
 * Context for market_visualizer
 */
export interface MarketContext extends BaseContext {
  // Market flow
}

/**
 * Discriminated union of all simulation default contexts
 */
export type SimulationDefaultContext = {
  taskDescription: string
  successFeedback: string
  initialContext:
    | (BaseContext & { type?: 'system_architecture' })
    | (SynesthesiaContext & { type?: 'audio_studio' | 'news_feed' })
    | (BotanyContext & { type?: 'botany_grid' })
    | (TriageContext & { type?: 'dashboard_triage' })
    | (CanvasContext & { type?: 'visual_canvas' | 'architect_3d' })
    | (NegotiationContext & { type?: 'chat_negotiation' | 'conversation_tree' })
    | (ConductorContext & { type?: 'conductor_interface' })
    | (SecureTerminalContext & { type?: 'secure_terminal' })
    | (DataContext & { type?: 'data_audit' | 'data_ticker' })
    | (TimelineContext & { type?: 'historical_timeline' })
    | (CreativeContext & { type?: 'creative_direction' })
    | (MarketContext & { type?: 'market_visualizer' })
}
```

**Step 2: Update `content/simulation-registry.ts`**

Change line 23-28 from:

```typescript
// The default context used when loaded via God Mode
defaultContext: {
    taskDescription: string
    initialContext: any  // ❌ VIOLATION
    successFeedback: string
}
```

To:

```typescript
import { SimulationDefaultContext } from '@/components/game/simulations/types'

// The default context used when loaded via God Mode
defaultContext: SimulationDefaultContext
```

**Step 3: Fix each simulation entry to match its type**

Most entries already conform. The `any` was just lazy typing. Verify each of the 20 entries matches its expected context shape.

---

## P0-2: Error Boundary Not Applied

### Problem
`GameErrorBoundary.tsx` exists but is not wrapped around `SimulationRenderer` in `StatefulGameInterface.tsx`.

### Files to Modify

1. **`components/StatefulGameInterface.tsx`** - Wrap SimulationRenderer

### Solution: Wrap SimulationRenderer

**Step 1: Find all SimulationRenderer usages**

Search in `StatefulGameInterface.tsx` for `<SimulationRenderer`. Expected at lines ~3195, 3412, 3454.

**Step 2: Wrap each usage**

Change from:
```tsx
<SimulationRenderer
  config={simConfig}
  onSuccess={handleSimulationSuccess}
/>
```

To:
```tsx
<GameErrorBoundary
  fallback={
    <div className="p-4 text-center text-slate-400">
      <div className="text-amber-400 mb-2">Simulation Offline</div>
      <div className="text-sm">Contact Devon for assistance.</div>
    </div>
  }
>
  <SimulationRenderer
    config={simConfig}
    onSuccess={handleSimulationSuccess}
  />
</GameErrorBoundary>
```

**Step 3: Import GameErrorBoundary**

At top of file, add:
```tsx
import { GameErrorBoundary } from './GameErrorBoundary'
```

---

## Verification Protocol

### After P0-1 Fix

```bash
# Type check - must pass
npm run type-check

# Grep for any remaining 'any' in simulation files
grep -r ": any" content/simulation-registry.ts
# Should return nothing

# Run tests
npm test
```

### After P0-2 Fix

**Manual Test:**
1. Temporarily break a simulation by adding `throw new Error('test')` to any visualizer
2. Play the game and trigger that simulation
3. Verify: Error boundary catches it, game continues, fallback UI shows
4. Remove the test error

---

## Files Reference

| File | Purpose | Changes Required |
|------|---------|-----------------|
| `content/simulation-registry.ts` | Simulation definitions | Replace `any` with typed context |
| `components/game/simulations/types.ts` | Type definitions | Add discriminated union |
| `components/StatefulGameInterface.tsx` | Main game component | Wrap SimulationRenderer in ErrorBoundary |
| `components/GameErrorBoundary.tsx` | Error boundary (EXISTS) | No changes needed |
| `lib/visualizers/synesthesia-types.ts` | Synesthesia types (EXISTS) | Import, don't modify |
| `lib/visualizers/botany-types.ts` | Botany types (EXISTS) | Import, don't modify |

---

## Context: Why This Matters

### Third-Party Audit (72/100)
> "Safety Rating: Passable but Fragile"
> "NOT ready for logic expansion until critical safety rails are installed"

### .cursorrules Violations
1. **No `any`**: Currently violated at line 25
2. **No silent failures**: Currently violated (no error boundary on sims)

### Patent Protection
The GCT Patent Application claims sophisticated simulation systems. Type safety ensures the implementation matches the claims. Runtime crashes undermine patent defensibility.

---

## Acceptance Criteria

- [ ] `npm run type-check` passes with zero errors
- [ ] `grep -r ": any" content/simulation-registry.ts` returns nothing
- [ ] All 20 simulation entries typecheck against their expected context
- [ ] SimulationRenderer wrapped in ErrorBoundary in all 3 locations
- [ ] Manual test: Breaking simulation shows fallback UI, game survives
- [ ] `npm test` passes (all 1,025 tests)

---

## Post-Fix: Update Documentation

After fixes are verified, update:
1. `docs/ai_context/DEEP_SCAN_QA_AUDIT_REPORT.md` - Mark P0s as resolved
2. `docs/ai_context/SUPER_COMPREHENSIVE_QA_PLAN.md` - Update status
3. `docs/ai_context/THIRD_PARTY_AUDIT_REPORT.md` - Note safety rating improvement

---

**End of Handoff Document**
