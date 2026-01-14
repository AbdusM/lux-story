# LUX STORY - COMPREHENSIVE SOFTWARE DEVELOPMENT PLAN
## Grand Central Terminus - AAA Foundation Excellence Roadmap

**Date:** December 25, 2025
**Assessment Level:** Ultra-stringent Multi-Agent Deep Audit
**Total Issues Identified:** 152+
**Estimated Resolution Effort:** 37-40 developer days
**Philosophy:** Understanding Before Generation

---

## FOUNDATIONAL PHILOSOPHY

> *"There's a difference between simple and easy. Easy means proximity—it's at hand, we don't have to think about it. Simple means no entanglement—nothing is intertwined. We consistently choose easy over simple, and we pay for it later."*
>
> — Netflix Engineering Talk on AI-Generated Code

This plan is built on the principle that **understanding must precede generation**. Before we fix anything, we must first earn deep comprehension of why the system works the way it does. Quick fixes applied without understanding create technical debt that compounds over time.

### The Three-Phase Development Cycle

Every significant change follows this cycle:

```
┌─────────────────────────────────────────────────────────────┐
│  RESEARCH → PLAN → IMPLEMENT                                │
│                                                             │
│  1. RESEARCH: Trace the system. Read the code. Understand  │
│     the history. Ask "why?" until you find the root cause. │
│                                                             │
│  2. PLAN: Design the solution on paper first. Consider     │
│     trade-offs. Identify what could go wrong. Get review.  │
│                                                             │
│  3. IMPLEMENT: Only now write code. One change at a time.  │
│     Test immediately. Document your reasoning.             │
└─────────────────────────────────────────────────────────────┘
```

### Simple vs. Easy

| Easy (Proximity)                         | Simple (No Entanglement)                  |
|------------------------------------------|-------------------------------------------|
| Patch the symptom                        | Fix the root cause                        |
| Add a sync bridge between states         | Eliminate duplicate state                 |
| Disable the failing test                 | Understand and fix the test               |
| Add try/catch to silence errors          | Make the error impossible                 |
| Copy-paste working code                  | Extract and reuse properly                |

**We choose Simple.**

---

## EXECUTIVE SUMMARY

This comprehensive resolution plan consolidates findings from 13 specialized deep audits covering every system in the codebase. The plan prioritizes comprehensive solutions over quick wins, ensuring foundational excellence for AAA game quality.

The plan begins with an **Understanding Sprint** where we earn comprehension of each system before modifying it.

### SEVERITY OVERVIEW

| Category | Critical | High | Medium | Low | Total |
|----------|----------|------|--------|-----|-------|
| Security | 5 | 9 | 6 | 2 | 22 |
| Architecture | 4 | 8 | 5 | 3 | 20 |
| Type Safety | 2 | 6 | 15 | 3 | 26 |
| Game Logic | 3 | 5 | 8 | 4 | 20 |
| Performance | 3 | 6 | 8 | 3 | 20 |
| Test Coverage | 2 | 8 | 6 | 4 | 20 |
| Audio/Haptic | 2 | 4 | 3 | 2 | 11 |
| Skills/2030 | 2 | 5 | 4 | 2 | 13 |
| **TOTAL** | **23** | **51** | **55** | **23** | **152** |

---

## PHASE 0: UNDERSTANDING SPRINT (Days 1-3)

> *"We had to earn the understanding before we could code it into our process."*

Before executing any fixes, we must earn understanding through manual exploration. This phase is **non-negotiable**. Skipping it will result in fixes that create new problems.

### 0.1 Context Compression Exercise

**Goal:** Reduce the 5M+ token codebase to essential specification documents.

**Deliverables:**

1. **Architecture Diagram** (1 page)
   - All major systems and their relationships
   - Data flow paths through the application
   - External dependencies (Supabase, Vercel, AI APIs)

2. **Critical Interfaces Document** (2-3 pages)
   - `GameState` and `SerializableGameState` contract
   - Choice → Consequence flow
   - Pattern → Skill mapping
   - Character → Trust relationship model

3. **Invariants List** (1 page)
   - What must ALWAYS be true for the game to function?
   - What assumptions does the code make?
   - What are the hard constraints?

### 0.2 Manual Trace Exercise

**Goal:** Trace ONE complete player choice through ALL systems by hand.

**Process:**
1. Pick a choice from a dialogue graph (e.g., Maya's first choice)
2. Trace by hand (no debugger, just reading code):
   - Where does the click enter the system?
   - How does it reach the state store?
   - What calculations happen?
   - How does the UI update?
   - What gets persisted and when?
3. Document every function touched
4. Note every assumption the code makes
5. Identify actual vs. intended data flow

**Output:** Written document (500-1000 words) explaining the complete flow with line references.

### 0.3 "Earn the Understanding" Migrations

**Goal:** Do ONE fix from each category manually (no AI assistance) to discover hidden constraints.

**Tasks:**
1. **State Migration (2 hours)**
   - Manually add ONE new field to `GameState`
   - Trace how it flows through serialization, hydration, and UI
   - Document the migration path

2. **Consequence Echo Addition (1 hour)**
   - Add consequence echoes for ONE missing character (Alex or Silas)
   - Manually write all variants
   - Test in-game to observe the feedback loop

3. **Test Addition (1 hour)**
   - Write ONE test for `GameLogic.processChoice` by hand
   - Discover what mocking is needed
   - Document the test setup requirements

**Output:** Notes on hidden constraints discovered during manual work. These become seeds for AI-assisted work.

### 0.4 Historical Investigation

**Goal:** Understand why the code evolved to its current state.

**Process:**
1. Read commit history for key files:
   - `git log --oneline lib/game-store.ts` (understand state evolution)
   - `git log --oneline lib/character-state.ts` (understand state split)
   - `git log --oneline components/StatefulGameInterface.tsx`
2. Read recent bug fixes:
   - `d55bc01` - force Zustand sync fix (why was this needed?)
   - `b3fb451` - disable chat pacing (what went wrong?)
   - `6dc31fb` - naming collision fix
3. Understand the design intent by reading existing documentation:
   - `CLAUDE.md` - Design philosophy
   - `lib/STATE_ARCHITECTURE.md` - State design intent

**Output:** Written summary (300-500 words) of "What was the original design intent, and where did implementation diverge?"

### 0.5 Knowledge Transfer Session

**Goal:** Externalize understanding before implementation.

**Process:**
1. Review all Phase 0 deliverables
2. Create a "Before We Start" checklist
3. Identify remaining knowledge gaps
4. Decide which fixes are now understood deeply enough to proceed

**Decision Gate:** Do NOT proceed to Phase 1 until you can answer:
- [ ] "Why does the dual state architecture exist, and what problem was it trying to solve?"
- [ ] "What are ALL the places where game state is persisted?"
- [ ] "What is the complete choice → consequence → UI update flow?"
- [ ] "What assumptions does the test suite make about mocking?"

---

## PHASE 1: SECURITY CRITICAL (Days 4-6)

> **This phase is URGENT but still follows the principle**
> - RESEARCH: Inventory all exposed credentials and vulnerable endpoints
> - PLAN: Create revocation and rotation checklist
> - IMPLEMENT: Revoke, regenerate, deploy in coordinated sequence

### 1.1 REVOKE ALL EXPOSED CREDENTIALS [CRITICAL]
**Files:** `.env.production`
**Action:** IMMEDIATE - Before any code changes

1. **Revoke API Keys (30 minutes)**
   - Anthropic: Regenerate at console.anthropic.com
   - Google Gemini: Regenerate at console.cloud.google.com
   - Supabase JWT tokens: Regenerate in Supabase dashboard

2. **Delete Secrets from Git History (2 hours)**
   ```bash
   # Install BFG Repo Cleaner
   brew install bfg

   # Clone fresh copy
   git clone --mirror git@github.com:AbdusM/lux-story.git

   # Remove .env.production from all history
   bfg --delete-files .env.production lux-story.git

   # Force push cleaned history
   cd lux-story.git
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push --force
   ```

3. **Update .gitignore (10 minutes)**
   ```gitignore
   # Add to .gitignore
   .env.production
   .env.local
   .env*.local
   ```

4. **Rotate ADMIN_API_TOKEN (20 minutes)**
   - Generate cryptographically secure token:
     ```bash
     openssl rand -base64 32
     ```
   - Update in Vercel environment variables
   - Update any dependent systems

### 1.2 FIX SSRF VULNERABILITY [CRITICAL]
**File:** `app/api/admin-proxy/urgency/route.ts`
**Lines:** 47-56

**Current Vulnerable Code:**
```typescript
const host = request.headers.get('host') || 'localhost:3003'
const apiUrl = `${protocol}://${host}/api/admin/urgency?...`
```

**Resolution:**
```typescript
// Replace dynamic host with environment-configured base URL
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3003'
const apiUrl = `${BASE_URL}/api/admin/urgency?userId=${encodeURIComponent(userId)}`

// NEVER include auth tokens in URLs constructed from user input
// Move to a dedicated internal-only API client
```

### 1.3 IMPLEMENT SECURE ADMIN AUTHENTICATION [CRITICAL]
**File:** `app/api/admin/auth/route.ts`

**Resolution Steps:**

1. **Install bcrypt (10 minutes)**
   ```bash
   npm install bcrypt @types/bcrypt
   ```

2. **Create password hash utility (30 minutes)**
   ```typescript
   // lib/auth-utils.ts
   import bcrypt from 'bcrypt'

   const SALT_ROUNDS = 12

   export async function hashPassword(password: string): Promise<string> {
     return bcrypt.hash(password, SALT_ROUNDS)
   }

   export async function verifyPassword(password: string, hash: string): Promise<boolean> {
     return bcrypt.compare(password, hash)
   }
   ```

3. **Update auth route (2 hours)**
   - Store hashed password in env (ADMIN_PASSWORD_HASH)
   - Use bcrypt.compare for verification
   - Implement JWT session tokens instead of storing password in cookie
   - Reduce session lifetime from 7 days to 4 hours
   - Add session invalidation on password change

4. **Add CSRF protection (1 hour)**
   ```typescript
   // Add csrf-token generation and validation middleware
   ```

### 1.4 REMOVE CSP UNSAFE DIRECTIVES [HIGH]
**File:** `next.config.js`
**Lines:** 92-93

**Current:**
```javascript
"script-src 'self' 'unsafe-inline' 'unsafe-eval';"
```

**Resolution:**
```javascript
// Remove unsafe-inline and unsafe-eval
// Use nonces for necessary inline scripts
"script-src 'self' 'nonce-{random}';"
"style-src 'self' 'nonce-{random}';"
```

**Implementation:**
1. Extract inline styles to external CSS files
2. Add nonce generation middleware
3. Update CSP header dynamically with nonces

### 1.5 MIGRATE SENSITIVE DATA FROM LOCALSTORAGE [CRITICAL]
**File:** `components/ExperienceSummary.tsx`
**Line:** 238

**Resolution:**
1. Move action plan storage to server-side session
2. Encrypt any necessary client-side data
3. Use httpOnly cookies for sensitive session data

---

## PHASE 2: STATE ARCHITECTURE (Days 7-10)

> **Research → Plan → Implement**
> - RESEARCH: Manual trace of state flow completed in Phase 0
> - PLAN: Architecture diagram with single source of truth
> - IMPLEMENT: One change at a time, test after each

### 2.1 UNIFY STATE SOURCE OF TRUTH [CRITICAL]
**Files:** `lib/game-store.ts`, `lib/character-state.ts`

**Current Problem:**
- `coreGameState` (SerializableGameState) - primary source
- `characterTrust`, `patterns`, `thoughts` - derived fields that can desync

**Resolution Architecture:**

1. **Eliminate Derived Fields (4 hours)**
   - Remove: `characterTrust`, `patterns`, `thoughts`, `platformWarmth` from Zustand state
   - All components read directly from `coreGameState`
   - Create selectors for derived values

2. **Create Pure Selectors (2 hours)**
   ```typescript
   // lib/state-selectors.ts
   export const selectCharacterTrust = (state: GameState) => {
     const core = state.coreGameState
     if (!core) return {}
     return Object.fromEntries(
       core.characters.map(c => [c.characterId, c.trust])
     )
   }

   export const selectPatterns = (state: GameState) => {
     return state.coreGameState?.patterns || {}
   }
   ```

3. **Remove syncDerivedState (1 hour)**
   - Delete lines 729-779 in game-store.ts
   - Remove all bidirectional sync bridges
   - Components use selectors directly

4. **Fix Set/Map Hydration (2 hours)**
   - Create proper hydration function for serialized state
   - Restore Sets and Maps after localStorage load
   - Add migration for existing saved states

### 2.2 SINGLE LOCALSTORAGE KEY [HIGH]
**Files:** Multiple persist locations

**Current Keys:**
- `grand-central-game-store` (Zustand)
- `grand-central-terminus-save` (GameStateManager)
- `grand-central-terminus-save-backup` (GameStateManager)

**Resolution:**
1. Consolidate to single Zustand persist key
2. Remove GameStateManager.saveGameState/loadGameState
3. Add migration script for existing saves
4. Implement proper backup within Zustand persist middleware

### 2.3 FIX CHOICE HANDLER RACE CONDITION [HIGH]
**File:** `components/StatefulGameInterface.tsx`
**Lines:** 564-583

**Resolution:**
```typescript
const handleChoice = async (choice: Choice) => {
  if (isProcessingChoiceRef.current) return
  isProcessingChoiceRef.current = true

  const safetyTimeout = setTimeout(() => {
    console.warn('[Safety timeout] Choice handler exceeded time limit')
    // Log but don't reset - let the handler complete
  }, CHOICE_HANDLER_TIMEOUT_MS)

  try {
    // ... choice processing
  } finally {
    clearTimeout(safetyTimeout)  // ALWAYS clear timeout
    isProcessingChoiceRef.current = false
    setState(prev => ({ ...prev, isProcessing: false }))
  }
}
```

### 2.4 IMPLEMENT IMMUTABLE STATE UPDATES [HIGH]
**File:** `lib/character-state.ts`
**Lines:** 329-332

**Current (Mutates):**
```typescript
charState.trust = Math.max(MIN_TRUST, Math.min(MAX_TRUST, charState.trust + modifiedTrust))
```

**Resolution:**
```typescript
const updatedChar = {
  ...charState,
  trust: Math.max(MIN_TRUST, Math.min(MAX_TRUST, charState.trust + modifiedTrust)),
  anxiety: (10 - newTrust) * 10,
  nervousSystemState: determineNervousSystemState(...)
}
newState.characters.set(change.characterId, updatedChar)
```

---

## PHASE 3: GAME LOGIC COMPLETION (Days 11-14)

> **Research → Plan → Implement**
> - RESEARCH: Study existing echo/affinity patterns for 9 complete characters
> - PLAN: Document exact structure needed for missing 2 characters
> - IMPLEMENT: Add one character at a time, verify with manual testing

### 3.1 ADD MISSING CONSEQUENCE ECHOES [CRITICAL]
**File:** `lib/consequence-echoes.ts`
**Missing:** `alex`, `silas`

**Resolution:**
Add complete echo definitions for both characters:

```typescript
// Add after line 453
alex: {
  trustUp: {
    low: [
      { text: "There's something here worth exploring.", emotion: "curious", timing: "immediate" }
      // Add 2-3 more variants
    ],
    medium: [...],
    high: [...]
  },
  trustDown: {
    low: [...],
    medium: [...],
    high: [...]
  },
  patternRecognition: {
    analytical: [...],
    patience: [...],
    exploring: [...],
    helping: [...],
    building: [...]
  }
},
silas: {
  // Complete structure matching other characters
}
```

### 3.2 COMPLETE PATTERN AFFINITIES [CRITICAL]
**File:** `lib/pattern-affinity.ts`
**Current:** Only Maya has affinity defined

**Resolution:**
Define affinities for all 11 characters:

```typescript
export const CHARACTER_PATTERN_AFFINITIES: Record<CharacterId, PatternAffinity> = {
  samuel: {
    highAffinity: 'patience',
    secondaryAffinity: 'exploring',
    friction: 'building'
  },
  maya: { /* existing */ },
  devon: {
    highAffinity: 'analytical',
    secondaryAffinity: 'building',
    friction: 'exploring'
  },
  // ... all 11 characters
}
```

### 3.3 COMPLETE RESONANCE ECHOES [HIGH]
**File:** `lib/consequence-echoes.ts`
**Current:** Only 3 characters (maya, devon, samuel)
**Missing:** 8 characters

Add resonance echoes for: jordan, marcus, tess, yaquin, kai, rohan, alex, silas

### 3.4 CAP PATTERN SCORES [HIGH]
**File:** `lib/game-logic.ts`

**Add to constants.ts:**
```typescript
export const MAX_PATTERN = 100
```

**Update processChoice:**
```typescript
const newPatternValue = Math.min(
  MAX_PATTERN,
  (newState.patterns[choice.pattern] || 0) + modifiedGain
)
```

### 3.5 ADD GAME LOGIC TESTS [CRITICAL]
**File:** Create `tests/lib/game-logic.test.ts`

```typescript
describe('GameLogic', () => {
  describe('processChoice', () => {
    it('applies pattern changes correctly')
    it('handles identity threshold crossing')
    it('applies trust changes within bounds')
    it('triggers pattern sensation at 30% probability')
  })

  describe('calculatePlatformResonance', () => {
    it('calculates resonance for all 6 platforms')
    it('clamps values between 0 and 10')
    it('handles missing career values gracefully')
  })

  describe('calculateEndingPath', () => {
    it('returns analytical_scholar for high analytical')
    it('returns patient_advisor for high patience')
    it('returns curious_explorer for high exploring')
    it('returns empathetic_guide for high helping')
    it('returns creative_builder for high building')
    it('returns balanced_explorer as fallback')
  })
})
```

---

## PHASE 4: SKILL SYSTEM RECONCILIATION (Days 15-17)

> **Research → Plan → Implement**
> - RESEARCH: Audit ALL skill references across codebase (57 vs 40 gap)
> - PLAN: Decide canonical skill list, document migration path
> - IMPLEMENT: Update type definitions first, then fix broken references

### 4.1 RECONCILE 57 vs 40 SKILLS [CRITICAL]
**Files:** `lib/2030-skills-system.ts`, `lib/constellation/skill-positions.ts`

**Decision Required:**
- Option A: Expand constellation to show all 57 skills
- Option B: Reduce FutureSkills interface to 40 skills
- **Recommended:** Option B - trim to 40 canonical skills

**Resolution:**
1. Audit which 17 skills are truly orphaned
2. Remove or mark as deprecated in FutureSkills
3. Update all skill references
4. Add migration for existing skill data

### 4.2 COMPLETE PATTERN-SKILL MAPPING [HIGH]
**File:** `lib/patterns.ts`
**Current:** 5 patterns × 3 skills = 15 connections
**Gap:** 25 constellation skills have no pattern source

**Resolution:**
Either:
1. Expand PATTERN_SKILL_MAP to include more skills per pattern
2. Add scene-specific skill detection for remaining 25 skills
3. Document that some skills require specific character interactions

### 4.3 ADD MISSING SKILL DEFINITIONS [HIGH]
**File:** `lib/skill-definitions.ts`
**Current:** 40 definitions
**Missing:** 17 for non-visualized skills

Add SKILL_DEFINITIONS entries for all skills, even if not in constellation.

---

## PHASE 5: TEST COVERAGE (Days 18-22)

> **Research → Plan → Implement**
> - RESEARCH: Analyze existing test patterns, understand mock setup
> - PLAN: Design test strategy with coverage targets per module
> - IMPLEMENT: Write core tests first (game-logic), then expand outward

### 5.1 CORE GAME LOGIC TESTS [CRITICAL]
Create comprehensive tests for:
- `lib/game-logic.ts` - All 5 static methods
- `lib/insights-engine.ts` - All insight generators
- `lib/choice-generator.ts` - Similarity algorithm
- `lib/character-relationships.ts` - Relationship dynamics

### 5.2 FIX FAILING TESTS [HIGH]
**File:** `tests/ensure-user-profile.test.ts`
- 2 failing tests due to mock setup issues
- Fix Supabase mock configuration

### 5.3 SEED RANDOM FOR DETERMINISM [HIGH]
**File:** `lib/game-logic.ts`
**Line:** `Math.random() < 0.3` (pattern sensation)

```typescript
// Add seeded random for testability
let randomSeed = Date.now()
function seededRandom(): number {
  randomSeed = (randomSeed * 1103515245 + 12345) & 0x7fffffff
  return randomSeed / 0x7fffffff
}

// In tests:
export function setRandomSeed(seed: number) { randomSeed = seed }
```

### 5.4 ADD COMPONENT TESTS [HIGH]
Priority components:
1. `GameChoices.tsx` - Pattern rendering, lock states
2. `ChatPacedDialogue.tsx` - Timing, accessibility
3. `StatefulGameInterface.tsx` - Error boundary (separate component)
4. `Journal.tsx` - State display
5. `ConstellationGraph.tsx` - Skill visualization

### 5.5 EXPAND E2E TESTS [MEDIUM]
Add Playwright tests for:
- Complete player journey (start → choices → consequences)
- State persistence (save → reload → verify)
- Mobile viewport testing
- Admin dashboard workflows

---

## PHASE 6: PERFORMANCE OPTIMIZATION (Days 23-25)

> **Research → Plan → Implement**
> - RESEARCH: Profile actual bundle, identify real bottlenecks
> - PLAN: Prioritize by impact/effort ratio, set measurable targets
> - IMPLEMENT: One optimization at a time, measure before/after

### 6.1 REMOVE UNUSED DEPENDENCIES [CRITICAL]
**File:** `package.json`

```bash
npm uninstall d3 d3-force recharts
```
**Savings:** ~400KB gzipped

### 6.2 REPLACE WIDTH ANIMATIONS WITH TRANSFORMS [CRITICAL]
**Files:**
- `components/orbs/OrbBalance.tsx` lines 120-126
- `components/ThoughtCabinet.tsx` lines 67-71
- `components/constellation/DetailModal.tsx` lines 150-155

**Before:**
```typescript
initial={{ width: 0 }}
animate={{ width: `${percentage}%` }}
```

**After:**
```typescript
style={{ width: '100%', transformOrigin: 'left' }}
initial={{ scaleX: 0 }}
animate={{ scaleX: percentage / 100 }}
```

### 6.3 MEMOIZE STATEFULERGAMEINTERFACE [HIGH]
Wrap with React.memo and split into smaller components:

```typescript
// Create separate memoized components
const GameHeader = React.memo(function GameHeader({ ... }) { ... })
const GameDialogue = React.memo(function GameDialogue({ ... }) { ... })
const GameChoicesContainer = React.memo(function GameChoicesContainer({ ... }) { ... })
```

### 6.4 REPLACE POLLING WITH STATE SUBSCRIPTION [HIGH]
**File:** `components/EnvironmentalEffects.tsx`

**Before (polling):**
```typescript
setInterval(() => {
  // Updates body.className every 1000ms
}, 1000)
```

**After (subscription):**
```typescript
useEffect(() => {
  const unsubscribe = useGameStore.subscribe(
    (state) => state.nervousSystemState,
    (nsState) => {
      document.body.className = getBodyClass(nsState)
    }
  )
  return unsubscribe
}, [])
```

### 6.5 ADD useCallback TO EVENT HANDLERS [MEDIUM]
**Files:**
- `components/constellation/DetailModal.tsx` - handleEscape, handleKeyDown
- `components/admin/SkillProgressionChart.tsx` - handleDataPointClick
- `components/GameChoices.tsx` - handleChoice handlers

---

## PHASE 7: HOOK MEMORY LEAKS (Days 26-27)

> **Research → Plan → Implement**
> - RESEARCH: Trace each hook's subscription lifecycle
> - PLAN: Map cleanup requirements for each hook
> - IMPLEMENT: Fix one hook at a time, verify cleanup with dev tools

### 7.1 FIX useBackgroundSync DEPENDENCY LOOP [HIGH]
**File:** `hooks/useBackgroundSync.ts`

**Issues:**
- triggerSync has empty dependency array but uses external values
- Event listeners re-registered on every render

**Resolution:**
```typescript
const triggerSync = useCallback(async () => {
  if (!enabled) return
  // ... sync logic
}, [enabled]) // Add proper dependencies

// Use stable event listener references
useEffect(() => {
  if (!syncOnFocus) return
  window.addEventListener('focus', triggerSync)
  return () => window.removeEventListener('focus', triggerSync)
}, [syncOnFocus, triggerSync])
```

### 7.2 FIX useEventBus STALE CLOSURES [HIGH]
**File:** `hooks/useEventBus.ts`

- Add proper cleanup for subscription handlers
- Validate dependency arrays
- Use refs for mutable callback tracking

### 7.3 FIX useLocalStorage HYDRATION RACE [MEDIUM]
**File:** `hooks/useLocalStorage.ts`

- Prevent writes during hydration
- Add isHydrated check before setValue
- Handle key changes gracefully

### 7.4 FIX useVirtualScrolling CONFIG RECREATION [MEDIUM]
**File:** `hooks/useVirtualScrolling.ts`

- Memoize config object in parent components
- Add proper dependency tracking for config changes

---

## PHASE 8: API SECURITY & RATE LIMITING (Days 28-30)

> **Research → Plan → Implement**
> - RESEARCH: Audit all API routes, identify auth/rate-limit gaps
> - PLAN: Design auth middleware, rate-limit strategy
> - IMPLEMENT: Add middleware to one route, test, then apply to others

### 8.1 ADD USER AUTHENTICATION TO USER ROUTES [CRITICAL]
**Files:** All `/api/user/*` routes

**Resolution:**
1. Implement JWT-based session authentication
2. Add ownership verification (user can only access their own data)
3. Create auth middleware:

```typescript
// lib/auth-middleware.ts
export async function requireAuth(request: NextRequest) {
  const token = request.cookies.get('session_token')
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await verifySessionToken(token.value)
  if (!user) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  return { user }
}
```

### 8.2 ADD RATE LIMITING TO AI ENDPOINTS [HIGH]
**Files:** `app/api/samuel-dialogue/route.ts`, `app/api/advisor-briefing/route.ts`

```typescript
import { rateLimiter } from '@/lib/rate-limit'

const aiRateLimiter = rateLimiter({
  uniqueTokensPerInterval: 100,
  interval: 60000, // 1 minute
  maxRequestsPerToken: 5
})

export async function POST(request: NextRequest) {
  const { userId } = await request.json()
  const { limited } = await aiRateLimiter.check(userId)
  if (limited) {
    return NextResponse.json({ error: 'Rate limited' }, { status: 429 })
  }
  // ... rest of handler
}
```

### 8.3 ADD TIMEOUTS TO LLM CALLS [HIGH]
```typescript
const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 30000)

try {
  const response = await fetch(geminiUrl, {
    signal: controller.signal,
    // ... options
  })
} finally {
  clearTimeout(timeout)
}
```

### 8.4 REMOVE/PROTECT TEST-ENV ENDPOINT [HIGH]
**File:** `app/api/test-env/route.ts`

Either delete entirely or add authentication:
```typescript
export async function GET(request: NextRequest) {
  const authError = requireAdminAuth(request)
  if (authError) return authError
  // ... existing logic
}
```

### 8.5 ADD PAGINATION TO ADMIN QUERIES [MEDIUM]
**Files:** `app/api/admin/user-ids/route.ts`, `app/api/admin/skill-data/route.ts`

```typescript
const page = parseInt(searchParams.get('page') || '1')
const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
const offset = (page - 1) * limit

const { data, count } = await supabase
  .from('player_profiles')
  .select('user_id', { count: 'exact' })
  .range(offset, offset + limit - 1)
  .order('last_activity', { ascending: false })

return NextResponse.json({
  profiles: data,
  pagination: { page, limit, total: count }
})
```

---

## PHASE 9: AUDIO & HAPTIC ACTIVATION (Days 31-32)

> **Research → Plan → Implement**
> - RESEARCH: Understand existing audio system design intent
> - PLAN: Decide on activation strategy (minimal, full, or remove)
> - IMPLEMENT: Wire up connections, test on mobile devices

### 9.1 ACTIVATE GENERATIVE SCORE [HIGH]
**File:** `components/StatefulGameInterface.tsx`

Add to initialization:
```typescript
useEffect(() => {
  if (audioEnabled) {
    generativeScore.start()
  }
  return () => generativeScore.stop()
}, [audioEnabled])

// Update score on state changes
useEffect(() => {
  if (gameState) {
    const currentChar = gameState.characters.get(gameState.currentCharacterId)
    if (currentChar) {
      generativeScore.update({
        anxiety: currentChar.anxiety,
        trust: currentChar.trust
      })
    }
  }
}, [gameState?.currentCharacterId])
```

### 9.2 INTEGRATE HAPTIC FEEDBACK [MEDIUM]
**File:** `components/StatefulGameInterface.tsx`

```typescript
import { hapticFeedback } from '@/lib/haptic-feedback'

// In handleChoice:
hapticFeedback.choice()

// On trust increase:
if (trustDelta > 0) hapticFeedback.success()

// On milestone:
hapticFeedback.storyProgress()
```

### 9.3 ADD AMBIENT MUSIC TRACKS [MEDIUM]
Either:
1. Add real audio files for nervous system states
2. Generate ambient audio using synth engine
3. Remove ambient music system if not needed

### 9.4 PERSIST MUTE STATE [LOW]
```typescript
// In GameMenu or settings
useEffect(() => {
  const savedMute = localStorage.getItem('audio_muted')
  if (savedMute) setMuted(savedMute === 'true')
}, [])

const handleToggleMute = () => {
  const newMuted = !isMuted
  setMuted(newMuted)
  localStorage.setItem('audio_muted', String(newMuted))
}
```

---

## PHASE 10: ACCESSIBILITY & UX POLISH (Days 33-35)

> **Research → Plan → Implement**
> - RESEARCH: Test with screen readers, keyboard nav, reduced motion
> - PLAN: Prioritize WCAG AA requirements, then enhancements
> - IMPLEMENT: One accessibility fix at a time, test with real tools

### 10.1 FIX CHAT PACING ACCESSIBILITY [HIGH]
**File:** `components/ChatPacedDialogue.tsx`

```typescript
import { useReducedMotion } from 'framer-motion'

const prefersReducedMotion = useReducedMotion()

// Skip delays if reduced motion preferred
const effectiveDelay = prefersReducedMotion ? 0 : chunkDelay
```

### 10.2 UNIFY ANIMATION SYSTEM [MEDIUM]
**Goal:** Use Framer Motion springs consistently, remove Tailwind `active:scale-*`

**Files to update:**
- `components/GameChoices.tsx` - Replace `active:scale-[0.98]` with whileTap
- `components/ClusterFilterChips.tsx` - Use springs.quick
- Remove conflicting CSS animations from `globals.css`

### 10.3 ADD LOADING TIMEOUT INDICATORS [MEDIUM]
```typescript
const [showLongWait, setShowLongWait] = useState(false)

useEffect(() => {
  if (!isLoading) {
    setShowLongWait(false)
    return
  }

  const timeout = setTimeout(() => setShowLongWait(true), 5000)
  return () => clearTimeout(timeout)
}, [isLoading])

// In render:
{isLoading && showLongWait && (
  <p className="text-muted-foreground">Taking longer than expected...</p>
)}
```

### 10.4 IMPROVE ERROR MESSAGING [MEDIUM]
Distinguish between network and data errors:

```typescript
if (error.message.includes('fetch failed')) {
  return "Unable to connect. Check your internet connection."
} else if (error.message.includes('corrupted')) {
  return "Your save data appears corrupted. Would you like to start fresh?"
}
```

---

## PHASE 11: ARCHIVED SCRIPTS INTEGRATION (Days 36-37)

> **Research → Plan → Implement**
> - RESEARCH: Evaluate each archived script for production value
> - PLAN: Decide keep/migrate/delete for each script
> - IMPLEMENT: Migrate valuable scripts with proper test coverage

### 11.1 MIGRATE CORE FRAMEWORKS [HIGH]
Move to production:
- `archived-scripts/gemini-content-framework.ts` → `lib/gemini-framework.ts`
- `archived-scripts/versioned-backup-system.ts` → `lib/backup-system.ts`

### 11.2 CREATE NPM AUDIT SCRIPTS [MEDIUM]
Add to package.json:
```json
{
  "audit:navigation": "npx tsx archived-scripts/navigation-consistency-auditor.ts",
  "audit:patterns": "npx tsx archived-scripts/choice-pattern-audit.ts",
  "audit:balance": "npx tsx archived-scripts/choice-balance-analyzer.ts",
  "audit:consequences": "npx tsx archived-scripts/consequence-consistency-auditor.ts",
  "audit:all": "npm run audit:navigation && npm run audit:patterns && npm run audit:balance && npm run audit:consequences"
}
```

### 11.3 DOCUMENT PIPELINE [LOW]
Create `docs/AUDIT_PIPELINE.md` documenting:
- Execution order
- Expected outputs
- Success criteria
- Troubleshooting

---

## PHASE 12: DOCUMENTATION & CLEANUP (Days 38-40)

> **Research → Plan → Implement**
> - RESEARCH: Review all changes made, identify documentation gaps
> - PLAN: Create documentation outline, identify dead code
> - IMPLEMENT: Write docs, remove dead code, final cleanup

### 12.1 UPDATE CLAUDE.md
- Add resolved issues to history
- Update current status
- Document new architecture decisions

### 12.2 CREATE ARCHITECTURE DECISION RECORDS
Document key decisions:
- Why unified state architecture
- Security model for user/admin
- Audio system design choices

### 12.3 REMOVE DEAD CODE
- Delete unused components identified in audit
- Remove commented-out code blocks
- Clean up deprecated utilities

---

## VERIFICATION CHECKLIST

### Security
- [ ] All API keys revoked and regenerated
- [ ] .env.production removed from git history
- [ ] Admin auth uses bcrypt
- [ ] SSRF vulnerability patched
- [ ] CSP unsafe directives removed
- [ ] User routes require authentication

### Architecture
- [ ] Single source of truth for state
- [ ] No bidirectional sync
- [ ] Proper Set/Map hydration
- [ ] No race conditions in choice handler
- [ ] Immutable state updates

### Game Logic
- [ ] All 11 characters have consequence echoes
- [ ] All 11 characters have pattern affinities
- [ ] Pattern scores capped at MAX_PATTERN
- [ ] GameLogic.ts has full test coverage

### Performance
- [ ] d3/recharts removed
- [ ] No width/height animations
- [ ] StatefulGameInterface split and memoized
- [ ] No polling (state subscriptions only)

### Audio
- [ ] Generative score activates on game start
- [ ] Haptic feedback on choices
- [ ] Mute state persisted

### Tests
- [ ] GameLogic tests pass
- [ ] All existing tests pass
- [ ] E2E tests for player journey
- [ ] Component tests for critical UI

---

## RISK MITIGATION

### Before Starting
1. Create full database backup
2. Tag current release as pre-refactor
3. Create feature branch for all changes
4. Set up staging environment

### During Implementation
1. Commit frequently with detailed messages
2. Run tests after each major change
3. Deploy to staging after each phase
4. Get user feedback on staging

### After Completion
1. Full regression testing
2. Performance benchmarking
3. Security audit by third party
4. Gradual rollout (10% → 50% → 100%)

---

## SUCCESS METRICS

| Metric | Current | Target |
|--------|---------|--------|
| Security vulnerabilities | 5 critical | 0 critical |
| Test coverage | ~40% | >80% |
| Bundle size | ~1.2MB | <800KB |
| First contentful paint | ~2.5s | <1.5s |
| Player-facing bugs (30 days) | Unknown | <5 |
| State sync errors | Multiple | 0 |

---

## THE FUNDAMENTAL QUESTION

> *"Will we still understand our own systems when AI is writing most of our code?"*

This plan ensures the answer is **yes**. By investing in Phase 0's understanding work, by following Research → Plan → Implement for every change, and by documenting our reasoning at every step, we maintain deep comprehension of our system.

The goal is not just working code—it's **understandable** working code. Every fix we make should leave the codebase easier to understand, not harder. Every abstraction we add should reduce complexity, not hide it.

### Principles for Each Phase

1. **Trace before you touch** - Never modify code you haven't manually traced
2. **One change, one commit** - Each commit should be comprehensible on its own
3. **Test what matters** - Focus tests on behavior, not implementation
4. **Document the why** - The code shows what; comments explain why
5. **Simple over clever** - The next developer might be future-you

### Estimated Timeline

| Phase | Days | Cumulative | Focus |
|-------|------|------------|-------|
| Phase 0: Understanding | 3 | 3 | Earn comprehension |
| Phase 1: Security | 3 | 6 | Fix critical vulnerabilities |
| Phase 2: State | 4 | 10 | Single source of truth |
| Phase 3: Game Logic | 4 | 14 | Complete game mechanics |
| Phase 4: Skills | 3 | 17 | Reconcile skill systems |
| Phase 5: Tests | 5 | 22 | Coverage for confidence |
| Phase 6: Performance | 3 | 25 | Optimize with data |
| Phase 7: Hooks | 2 | 27 | Fix memory leaks |
| Phase 8: API Security | 3 | 30 | Protect endpoints |
| Phase 9: Audio | 2 | 32 | Activate latent systems |
| Phase 10: Accessibility | 3 | 35 | Polish for all users |
| Phase 11: Archives | 2 | 37 | Preserve value |
| Phase 12: Cleanup | 3 | 40 | Documentation & hygiene |

**Total: 40 developer days**

---

*This plan prioritizes understanding over speed, simplicity over convenience, and comprehensive solutions over quick wins. Each phase builds on the previous, creating a foundation of comprehension that compounds throughout the project.*

*We don't just fix the code—we understand it first, then fix it properly, then document why.*
