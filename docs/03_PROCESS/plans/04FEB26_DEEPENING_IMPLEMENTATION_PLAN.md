# Deepening Implementation Plan (v2 - Verified)

**Status:** 🔵 READY FOR IMPLEMENTATION
**Created:** 2026-02-04
**Last Updated:** 2026-02-04 (Post-Audit)
**Author:** Claude Code Analysis

---

## Executive Summary

Deep audit with blindspot verification identified **4 major areas** for improvement:

| Area | Items | Priority | Actual Status |
|------|-------|----------|---------------|
| Dormant Capabilities | 4 systems (not 6) | P1-P2 | Some already surfaced |
| Technical Debt | 8 items (2 resolved) | P1-P2 | TD-001, TD-010 DONE |
| Skipped Tests | ~25 actionable | P1 | Many intentional |
| Code Cleanup | 4 items | P2-P3 | Orphaned code found |

### Key Corrections from Audit:
- ✅ **Identity System** is FULLY ACTIVE (IdentityCeremony.tsx renders)
- ✅ **Birmingham Opportunities** has OpportunitiesView.tsx (18 records, not 50+)
- ✅ **TD-001** (Dual State) RESOLVED via commitGameState abstraction
- ✅ **TD-010** (God Mode) RESOLVED via authorization gates
- ✅ **Simulations** now 20/20 (100%) complete
- ✅ **PRD Ranking System** ALL 12 PHASES fully implemented

---

## 1. DORMANT CAPABILITIES (Verified Status)

### 1.1 ✅ ALREADY ACTIVE - Identity Offering System
**Status:** FULLY IMPLEMENTED AND SURFACED

**Evidence:**
- `lib/identity-system.ts` (258 lines) - Complete mechanics
- `components/IdentityCeremony.tsx` - Renders ceremony UI
- Triggers at pattern level 5, player can internalize (+20% bonus) or discard

**Action:** None needed - working as designed

---

### 1.2 ✅ PARTIALLY ACTIVE - Birmingham Opportunities
**Status:** UI EXISTS, may need visibility improvements

**Evidence:**
- `content/birmingham-opportunities.ts` (591 lines, 18 records - NOT 50+)
- `components/journal/OpportunitiesView.tsx` - Already renders in Journal

**Correction:** Documentation claimed "50+ records" but only 18 exist.

**Action:**
- Verify OpportunitiesView is accessible in Journal tabs
- Consider adding more opportunities if stakeholders need them
- **Effort:** SMALL (verification only)

---

### 1.3 ⚠️ TRULY DORMANT - Mystery Progression System
**Status:** State machine defined, NO TRIGGERS

**Evidence:**
- `lib/character-state.ts` lines 61-68 - MysteryState interface
- 4 branches: letterSender, platformSeven, samuelsPast, stationNature
- `GameState.mysteries` field serializes correctly
- **BUT:** No dialogue node triggers mystery state changes

**What's Missing:**
- Dialogue choices that call `mysteryChanges` in StateChange
- UI to display mystery progress
- Clue discovery mechanics wired to content

**Action:**
1. Wire mystery triggers to Samuel/location dialogue nodes
2. Add "Mysteries" section to Journal
3. Create clue discovery feedback UI

**Effort:** MEDIUM (4-8 hours)
**Impact:** HIGH - Adds replayability and narrative depth

---

### 1.4 ⚠️ TRULY DORMANT - Chemistry/Biology Display
**Status:** COMPUTED, NEVER DISPLAYED

**Evidence:**
- `lib/chemistry.ts` (83 lines) - calculateReaction() works
- `lib/emotions.ts` lines 717-804 - Nervous system computed
- `GameState.lastReaction` stores chemical reactions
- `GameState.nervousSystemState` tracks ventral_vagal/sympathetic/dorsal_vagal

**What's Missing:**
- UI visualization of nervous system state
- Chemical reaction indicators during gameplay

**Action:**
1. Add BiologyIndicator component to game interface
2. Show nervous state transitions during emotional moments

**Effort:** SMALL (2-4 hours)
**Impact:** MEDIUM - Adds depth perception

---

### 1.5 ⚠️ TRULY DORMANT - Career Values Display
**Status:** COMPUTED, NEVER DISPLAYED

**Evidence:**
- `lib/character-state.ts` lines 52-58 - CareerValues interface
- 5 values: directImpact, systemsThinking, dataInsights, futureBuilding, independence
- Tracked in `GameState.careerValues`
- Referenced in career analytics but not rendered

**Action:**
1. Add "Your Values" visualization to Journal
2. Connect to career recommendations

**Effort:** SMALL (2-4 hours)
**Impact:** MEDIUM - Enhances career feedback

---

### 1.6 ⚠️ PARTIALLY DORMANT - Platform Evolution
**Status:** ENGINE COMPLETE, STATE NEVER MODIFIED

**Evidence:**
- `lib/platform-resonance.ts` (576 lines) - Full engine
- 6 platforms with warmth (-5 to 5) and resonance (0-10)
- `updatePlatformResonance()` exists but state never changes
- NOT rendered in UI

**Action:**
1. Wire platform state changes to player actions
2. Add visual indicators in Constellation view

**Effort:** MEDIUM (4-6 hours)
**Impact:** MEDIUM - Environmental feedback

---

### 1.7 ⚠️ PARTIAL - Pattern-Character Affinity
**Status:** Only Maya fully configured

**Evidence:**
- `lib/pattern-affinity.ts` - CHARACTER_PATTERN_AFFINITIES
- Maya: complete (building +50%, analytical +25%, helping -25%)
- **10 other characters missing affinity data**

**Action:**
1. Define affinity bonuses for remaining 19 characters
2. Each character needs pattern bonuses/penalties

**Effort:** MEDIUM (2-4 hours for data entry)
**Impact:** HIGH - Affects trust calculations

---

## 2. TECHNICAL DEBT (Verified Status)

### ✅ RESOLVED Items

| ID | Issue | Status | Evidence |
|----|-------|--------|----------|
| **TD-001** | Dual State (Zustand + React) | **RESOLVED** | commitGameState abstraction, 5 commits |
| **TD-010** | God Mode in Production | **RESOLVED** | Gated behind authorization + lazy-loaded |

### ⚠️ OUTSTANDING Items

| ID | Issue | Status | Effort | Priority |
|----|-------|--------|--------|----------|
| **TD-002** | No Immutability Enforcement | Convention only | 1 day | P1 |
| **TD-003** | ESLint disables in SGI | 4 file-level suppressions | 2-3 days | P2 |
| **TD-004** | Orbs Outside GameState | By design (cosmetic) | 1 day | P3 |
| **TD-005** | Fragmented localStorage | 10+ key families | 2 days | P2 |
| **TD-006** | Multi-Tab Corruption | No StorageEvent listener | 4 hrs | P2 |
| **TD-007** | Non-Deterministic Randomness | 11+ Math.random() locations | 4 hrs | P2 |
| **TD-008** | Legacy Type Casts | 3 locations in skill bridge | 2 hrs | P3 |
| **TD-009** | initializeGame Dependencies | Intentional disable, documented | N/A | Mitigated |

### Priority Actions:

**P1 (This Week):**
- TD-002: Add Immer or Object.freeze in dev builds

**P2 (This Sprint):**
- TD-006: Add StorageEvent listener for multi-tab safety
- TD-007: Replace Math.random() with seeded PRNG in gameplay code

**P3 (Backlog):**
- TD-003: SGI eslint cleanup (large refactor)
- TD-004/005: localStorage consolidation (migration needed)

---

## 3. SKIPPED TESTS (Verified Analysis)

### Summary
- **Total Skipped:** ~43 tests
- **Intentional/Defensive:** ~18 tests (working as designed)
- **Actionable:** ~25 tests

### 3.1 🔴 HIGH PRIORITY - Journey Summary (10 tests)

**File:** `tests/e2e/journey-summary.spec.ts`

**Root Cause:** Complex state seeding - tests need completed journey state

**Action:** Create `seedCompletedGameState()` fixture helper

**Effort:** 2-3 hours

---

### 3.2 🔴 HIGH PRIORITY - Admin Auth (10+ tests)

**File:** `tests/e2e/admin/admin-auth.spec.ts`

**Root Cause:** Auth mechanism refactored from password-based to role-based

**Action:** Rewrite tests for new auth flow (TODO documented in code)

**Effort:** 2-3 hours

---

### 3.3 🟡 MEDIUM PRIORITY - God Mode Test Environment (1 test)

**File:** `tests/e2e/simulations/simulation-smoke.spec.ts`

**Root Cause:** NODE_ENV check may not work in Playwright context

**Action:** Debug environment variable detection in test runner

**Effort:** 1-2 hours

---

### 3.4 🟡 MEDIUM PRIORITY - Content Spoiler Detection (4 tests)

**File:** `tests/content-spoiler-detection.test.ts`

**Root Cause:** Referenced files don't exist (AtmosphericIntro.tsx)

**Action:** Update file paths or remove obsolete checks

**Effort:** 30 minutes

---

### 3.5 ✅ NO ACTION NEEDED - Defensive Mobile Tests (~16 tests)

**Files:** constellation-mobile.spec.ts, ranking/*.spec.ts

**Status:** These use conditional `test.skip()` when UI elements unavailable

**Finding:** Working as designed - graceful degradation, not bugs

---

## 4. CODE CLEANUP (New Findings)

### 4.1 Unused Hook: `useVirtualScrolling`

**Location:** `/hooks/useVirtualScrolling.ts` (119 lines)

**Status:** 0 imports found in codebase

**Action:**
- Document intended use case, OR
- Delete if virtual scrolling no longer needed

**Effort:** 15 minutes

---

### 4.2 Orphaned File: `reciprocity-engine-v2.ts`

**Location:** `/content/reciprocity-engine-v2.ts` (~200 lines)

**Status:** Zero imports, appears to be design exploration

**Action:**
- Check if superseded by current dialogue system
- Archive or delete

**Effort:** 30 minutes investigation

---

### 4.3 STUB Nodes in New Characters

**Location:** Nadia, Quinn, Isaiah dialogue graphs

**Status:** Multiple "STUB NODES" marked with incomplete navigation

**Action:**
- Run dialogue graph validation tests
- Verify nextNodeId references are valid

**Effort:** 1 hour verification

---

### 4.4 Test Coverage Gap

**Finding:** 104 files in `/lib/` have NO corresponding test files

**High Priority Missing Tests:**
| Module | Lines | Criticality |
|--------|-------|-------------|
| `2030-skills-system.ts` | 788 | HIGH |
| `character-relationships.ts` | 1620 | HIGH |
| `character-transformations.ts` | ~400 | MEDIUM |

**Action:** Add unit tests for core systems

**Effort:** 1-2 days for high-priority files

---

## 5. WHAT'S ALREADY COMPLETE (No Action)

### Ranking System - FULLY IMPLEMENTED ✅
- All 12 PRD phases implemented
- 269 exports, 6,637 lines in lib/ranking/
- 8 badge components + RankingDashboard
- 12 test files with 100+ test cases
- 4 E2E test files

### Simulations - 20/20 COMPLETE ✅
- All 20 characters have 3-phase simulations
- Phase 1 (trust 0-2), Phase 2 (trust 5+), Phase 3 (trust 8+)

### Core Systems - 100% ✅
- Interrupt Windows: 20/20
- Vulnerability Arcs: 20/20
- Consequence Echoes: 20/20
- Loyalty Experiences: 20/20
- Character Relationships: 68 edges

---

## 6. IMPLEMENTATION PHASES (Revised)

### Phase 1: Quick Wins (2-3 days)

| Task | Effort | Impact |
|------|--------|--------|
| Verify OpportunitiesView accessibility | 1 hr | Confirm B2B value visible |
| Add Chemistry/Biology UI indicator | 2-4 hrs | Surface computed state |
| Add Career Values visualization | 2-4 hrs | Enhance career feedback |
| Delete/document useVirtualScrolling | 15 min | Code cleanup |
| Verify STUB node navigation | 1 hr | Content integrity |

**Deliverables:**
- [ ] Biology indicator in game interface
- [ ] Career values in Journal
- [ ] Unused code documented/removed

---

### Phase 2: Mystery & Platform Systems (1 week)

| Task | Effort | Impact |
|------|--------|--------|
| Wire mystery triggers to dialogue | 4-6 hrs | Narrative depth |
| Add Mysteries section to Journal | 2-4 hrs | Player visibility |
| Wire platform state changes | 4-6 hrs | Environmental feedback |
| Add platform visualization to Constellation | 2-4 hrs | Visual feedback |

**Deliverables:**
- [ ] Mystery progression triggers work
- [ ] Mysteries visible in Journal
- [ ] Platform warmth affects visuals

---

### Phase 3: Test Coverage (1 week)

| Task | Effort | Impact |
|------|--------|--------|
| Create seedCompletedGameState() fixture | 2 hrs | Enable Journey tests |
| Enable 10 Journey Summary tests | 2 hrs | Feature coverage |
| Rewrite Admin auth tests | 2-3 hrs | Admin coverage |
| Add tests for 2030-skills-system.ts | 4-6 hrs | Core system coverage |
| Add tests for character-relationships.ts | 4-6 hrs | Graph integrity |

**Deliverables:**
- [ ] 20+ previously skipped tests enabled
- [ ] Core lib files have test coverage

---

### Phase 4: Technical Debt (1 week)

| Task | Effort | Impact |
|------|--------|--------|
| TD-002: Add Immer/Object.freeze | 1 day | Mutation safety |
| TD-006: Add StorageEvent listener | 4 hrs | Multi-tab safety |
| TD-007: Seeded PRNG for gameplay | 4 hrs | Deterministic testing |
| Define pattern affinity for 19 chars | 2-4 hrs | Trust calculations |

**Deliverables:**
- [ ] Immutability in dev mode
- [ ] Multi-tab coordination
- [ ] All characters have pattern affinities

---

## 7. SUCCESS METRICS

### Current State (Feb 4, 2026)

| Metric | Value |
|--------|-------|
| Dormant systems surfaced | 2/6 (Identity, Opportunities) |
| Technical debt resolved | 2/10 (TD-001, TD-010) |
| Skipped tests (actionable) | ~25 |
| Test coverage (lib files) | ~25% |
| Simulations complete | 20/20 (100%) ✅ |
| Ranking PRD implemented | 12/12 (100%) ✅ |

### Target After Phase 4

| Metric | Target |
|--------|--------|
| Dormant systems surfaced | 6/6 (100%) |
| Technical debt resolved | 5/10 (50%) |
| Skipped tests enabled | 15/25 (60%) |
| Test coverage (priority files) | +3 core files |

---

## 8. RISKS & MITIGATIONS

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Mystery triggers break dialogue flow | MEDIUM | MEDIUM | Test in isolation first |
| Pattern affinity data unbalanced | LOW | LOW | Review with game design |
| Multi-tab fix causes race conditions | LOW | HIGH | Feature flag for rollback |

---

## 9. DEFINITION OF DONE

**Phase 1 Complete When:**
- [ ] Chemistry/Biology UI visible during gameplay
- [ ] Career values shown in Journal
- [ ] No unused hooks remaining
- [ ] STUB nodes verified or fixed

**Phase 2 Complete When:**
- [ ] Player can discover and track mysteries
- [ ] Platform warmth visually indicated
- [ ] At least 1 mystery branch progressible

**Phase 3 Complete When:**
- [ ] Journey Summary tests passing
- [ ] Admin auth tests rewritten
- [ ] 2030-skills-system.ts has test coverage

**Phase 4 Complete When:**
- [ ] Dev mode has Object.freeze protection
- [ ] Multi-tab doesn't corrupt state
- [ ] All 20 characters have pattern affinities

---

## Appendix: Files Referenced

### Dormant Systems
- `lib/chemistry.ts` (83 lines)
- `lib/emotions.ts` lines 717-804
- `lib/character-state.ts` lines 52-68
- `lib/platform-resonance.ts` (576 lines)
- `lib/identity-system.ts` (258 lines) ✅ ACTIVE
- `content/birmingham-opportunities.ts` (591 lines, 18 records)
- `components/journal/OpportunitiesView.tsx` ✅ EXISTS
- `components/IdentityCeremony.tsx` ✅ ACTIVE

### Technical Debt
- `components/StatefulGameInterface.tsx` - TD-001 resolved, TD-003 pending
- `lib/game-store.ts` - commitGameState abstraction
- `lib/dev-tools/god-mode-api.ts` - TD-010 resolved
- `lib/skill-zustand-bridge.ts` - TD-008 pending

### Code Cleanup
- `hooks/useVirtualScrolling.ts` - Unused
- `content/reciprocity-engine-v2.ts` - Orphaned
- `content/{nadia,quinn,isaiah}-dialogue-graph.ts` - STUB nodes

### Missing Tests
- `lib/2030-skills-system.ts` (788 lines)
- `lib/character-relationships.ts` (1620 lines)

---

**Next Action:** Begin Phase 1 Quick Wins - Surface Chemistry/Biology UI and verify existing features.
