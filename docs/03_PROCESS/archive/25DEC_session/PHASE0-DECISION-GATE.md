# LUX STORY - DECISION GATE
## Phase 0.6 Deliverable - Understanding Verification

**Created:** December 25, 2025
**Purpose:** Verify we have earned enough understanding to proceed to Phase 1

---

## DECISION GATE CHECKLIST

### Question 1: "Why does the dual state architecture exist, and what problem was it trying to solve?"

**ANSWER: VERIFIED**

**Original Intent:**
The dual architecture was NOT the original design. Commit `04214bb` shows the intent was "Unify state management with Zustand as single source of truth."

**How It Emerged:**
1. `coreGameState` (SerializableGameState) was created as the single source
2. Derived fields (`characterTrust`, `patterns`, `thoughts`) were added for convenience
3. `syncDerivedState()` was added to keep them in sync
4. The sync can fail, causing the issues we see today

**The Problem It Was Trying to Solve:**
- Easier access: `state.characterTrust['maya']` vs `state.coreGameState.characters[index].trust`
- Direct Zustand selectors for simple fields
- Avoiding Map/Set handling in components

**Why It Failed:**
- Two sources of truth that can desync
- `syncDerivedState()` doesn't properly hydrate Maps/Sets
- Components read from different sources

**Confidence: HIGH**

---

### Question 2: "What are ALL the places where game state is persisted?"

**ANSWER: VERIFIED**

| Location | Key | Content |
|----------|-----|---------|
| **Zustand persist** | `grand-central-game-store` | Full game state (partialize filtered) |
| **SyncQueue** | `grand-central-sync-queue` | Pending API actions |
| **Skill Tracker** | API calls to Supabase | `skill_demonstrations` table |
| **Choice Tracker** | API calls to Supabase | `pattern_demonstrations` table |
| **Player Profile** | API calls to Supabase | `player_profiles` table |
| **Action Plan** | localStorage + Supabase | User action plans |

**Code Locations:**
- `lib/game-store.ts:1033` - Zustand persist config
- `lib/sync-queue.ts` - Queue persistence
- `lib/skill-tracker.ts` - Skill demonstration persistence
- `components/ExperienceSummary.tsx:238` - Action plan localStorage

**Confidence: HIGH**

---

### Question 3: "What is the complete choice → consequence → UI update flow?"

**ANSWER: VERIFIED**

Complete flow documented in `PHASE0-MANUAL-TRACE.md`:

```
1. Player Click → handleChoice (lock acquired)
2. GameLogic.processChoice() → Calculate new state
3. GameStateUtils.applyStateChange() → Mutate state
4. Render Updates → Audio, orbs, echoes
5. Sync to Zustand → setCoreGameState()
6. Navigate to Next Node → Find graph, apply onEnter
7. Evaluate New Choices → Filter by conditions
8. Skill Tracking → SyncQueue to Supabase
9. Final setState → Update UI
10. Unlock → Clear timeout, reset ref
```

**Key Issues Found:**
- Race condition in timeout (can reset lock while running)
- Direct mutation of charState.trust
- Direct mutation of conversationHistory array
- Bidirectional sync in syncDerivedState()

**Confidence: HIGH**

---

### Question 4: "What assumptions does the test suite make about mocking?"

**ANSWER: PARTIALLY VERIFIED**

**Current Test Setup:**
- Vitest for unit tests
- Playwright for E2E tests
- Testing Library for component tests (minimal usage)

**Mocking Requirements Identified:**
1. **Supabase**: Mocked via `lib/supabase.ts` - returns mock client if env vars missing
2. **Audio**: Not tested, would need Web Audio API mock
3. **LocalStorage**: Vitest provides via jsdom
4. **Window Object**: Checked with `typeof window !== 'undefined'`

**Gaps Found:**
- `lib/game-logic.ts` has ZERO tests
- No mocking documentation
- Test file `tests/ensure-user-profile.test.ts` has 2 failing tests (mock setup issues)

**What Mocking Would Be Needed for GameLogic Tests:**
```typescript
// Mock for GameStateUtils
vi.mock('./character-state', () => ({
  GameStateUtils: {
    applyStateChange: vi.fn((state, change) => ({ ...state, ...change }))
  }
}))

// Mock for pattern validation
vi.mock('./patterns', () => ({
  isValidPattern: vi.fn(() => true),
  getPatternSensation: vi.fn(() => 'Test sensation')
}))
```

**Confidence: MEDIUM** (need to write actual tests to verify)

---

## PHASE 0 DELIVERABLES SUMMARY

| Deliverable | File | Status |
|-------------|------|--------|
| Architecture Diagram | `PHASE0-ARCHITECTURE-DIAGRAM.md` | Complete |
| Critical Interfaces | `PHASE0-CRITICAL-INTERFACES.md` | Complete |
| Invariants List | `PHASE0-INVARIANTS-LIST.md` | Complete |
| Manual Trace | `PHASE0-MANUAL-TRACE.md` | Complete |
| Historical Investigation | `PHASE0-HISTORICAL-INVESTIGATION.md` | Complete |
| Decision Gate | `PHASE0-DECISION-GATE.md` | Complete (this file) |

---

## PHASE 0 COMPLETION CERTIFICATE

### Understanding Earned

- [x] Can explain why dual state architecture emerged
- [x] Know all persistence locations
- [x] Traced complete choice flow with line numbers
- [x] Understand git history and design evolution
- [x] Identified 5 critical issues during manual trace
- [x] Know invariants that must be maintained

### Ready to Proceed?

**YES** - We have earned sufficient understanding to proceed to Phase 1: Security Critical.

### Key Insights to Carry Forward

1. **The original design was good** - Single source of truth was the intent
2. **Derived fields are the problem** - They create sync issues
3. **Workarounds accumulated** - `d55bc01`, `b3fb451` are symptoms, not fixes
4. **Large components need splitting** - 1775 LOC is too much

---

## PHASE 1 READINESS

### Immediate Actions (Security Critical)

1. **Revoke Exposed Credentials**
   - Location: `.env.production` (committed to git)
   - Keys: Anthropic, Gemini, Supabase JWT
   - Action: Revoke at console, regenerate, delete from git history

2. **Fix SSRF Vulnerability**
   - Location: `app/api/admin-proxy/urgency/route.ts:47-56`
   - Issue: Dynamic URL from untrusted `host` header
   - Action: Hardcode base URL or use environment variable

3. **Implement Secure Admin Auth**
   - Location: `app/api/admin/auth/route.ts`
   - Issue: Plaintext password comparison
   - Action: bcrypt hashing, JWT sessions, shorter lifetime

### What We Now Understand

Before making these changes, we understand:
- The auth flow
- How admin sessions work
- Where credentials are used
- Impact of changes

---

## SIGN-OFF

**Phase 0 Understanding Sprint: COMPLETE**

Proceeding to Phase 1: Security Critical with full understanding of:
- System architecture
- Interface contracts
- Invariants to maintain
- Historical context
- Known issues to fix

---

*"We have earned the understanding before we can code it into our process."*
