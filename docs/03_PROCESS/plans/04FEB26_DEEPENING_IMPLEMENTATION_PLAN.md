# Deepening Implementation Plan

**Status:** 🔵 READY FOR IMPLEMENTATION
**Created:** 2026-02-04
**Author:** Claude Code Analysis

---

## Executive Summary

Post-ranking system completion audit identified **4 major areas** for deepening:

| Area | Items | Priority | Impact |
|------|-------|----------|--------|
| Dormant Capabilities | 6 systems | P1-P2 | HIGH - Already built, needs surfacing |
| Technical Debt | 10 items | P0-P2 | MEDIUM - Stability/maintainability |
| Skipped Tests | 41 tests | P1 | HIGH - Quality assurance |
| Feature Backlog | 8 features | P2-P3 | MEDIUM - Enhancement |

**Key Finding:** Several systems are fully implemented but never surfaced to users. These represent the highest-value quick wins.

---

## 1. DORMANT CAPABILITIES (Highest ROI)

Systems that are **built and tested** but never activated in the UI.

### 1.1 Chemistry/Biology System (~2 hrs to surface)

**Location:** `lib/chemistry-derivatives.ts`, `lib/biology-derivatives.ts`

**What's Built:**
- Nervous system state tracking (ventral_vagal/sympathetic/dorsal_vagal)
- Chemical reactions (resonance, cold_fusion, volatility, deep_rooting, shutdown)
- Narrative gravity affecting choice ordering

**What's Missing:**
- UI visualization of nervous system state
- Chemical reaction indicators during gameplay
- Player feedback on emotional/biological state

**Implementation:**
```typescript
// Add to Journal or floating indicator
interface BiologyIndicator {
  nervousState: 'calm' | 'activated' | 'shutdown'
  lastReaction: ChemicalReaction
  narrativeGravity: number
}
```

**Effort:** SMALL (2-4 hours)
**Impact:** HIGH - Adds depth perception without new mechanics

---

### 1.2 Birmingham Opportunities Database (~8 hrs)

**Location:** `lib/birmingham-opportunities.ts`

**What's Built:**
- 50+ local opportunities (job shadowing, internships, mentorships, volunteer, courses)
- Organizations: UAB, Children's Hospital, Southern Company, Regions Bank
- `getPersonalizedOpportunities(patterns, skills)` function - never called

**What's Missing:**
- UI tab in Journal or Student Insights
- Pattern/skill-based filtering display
- Links to application processes

**Implementation:**
1. Add "Opportunities" tab to Journal (`components/Journal.tsx`)
2. Call `getPersonalizedOpportunities()` with player state
3. Display matched opportunities with organization details

**Effort:** MEDIUM (6-10 hours)
**Impact:** HIGH - Direct B2B value for Birmingham stakeholders

---

### 1.3 Mystery Progression System (~4 hrs)

**Location:** `lib/mystery-progression.ts`

**What's Built:**
- 4 mystery branches: letterSender, platformSeven, samuelsPast, stationNature
- Full state machine with progression stages
- Clue discovery mechanics

**What's Missing:**
- UI for mystery tracking
- Dialogue triggers that advance mysteries
- Player-facing mystery status

**Implementation:**
1. Add "Mysteries" section to Journal
2. Wire clue discoveries to dialogue choices
3. Add visual indicators when new clues available

**Effort:** MEDIUM (4-8 hours)
**Impact:** MEDIUM - Adds replayability and narrative depth

---

### 1.4 Career Values System (~3 hrs)

**Location:** `lib/career-values.ts`

**What's Built:**
- 5 values tracked: directImpact, systemsThinking, dataInsights, futureBuilding, independence
- Career affinity matching to 8 career paths
- Computed from player choices

**What's Missing:**
- Visualization in Journal
- Career recommendations based on values
- Connection to character interactions

**Implementation:**
1. Add "Your Values" visualization to Journal
2. Show career path affinities
3. Connect to existing career mapping UI

**Effort:** SMALL (2-4 hours)
**Impact:** MEDIUM - Enhances career exploration feedback

---

### 1.5 Identity Offering System (~6 hrs)

**Location:** `lib/identity-system.ts`

**What's Built:**
- Disco Elysium-style identity internalization
- When pattern crosses threshold 5: offer identity choice
- Internalize for +20% bonus OR discard for flexibility
- Full mechanics defined

**What's Missing:**
- UI modal for identity offering
- Integration with pattern crossing detection
- Visual feedback on internalized identities

**Implementation:**
1. Create `IdentityOfferingModal` component
2. Hook into pattern change detection
3. Display internalized identities in Journal

**Effort:** MEDIUM (4-8 hours)
**Impact:** HIGH - Meaningful player choice and differentiation

---

### 1.6 Platform Evolution System (~4 hrs)

**Location:** `lib/platform-state.ts`

**What's Built:**
- Platform warmth (-5 to 5) per platform
- Platform resonance (0-10) per platform
- `queuePlatformStateSync()` function

**What's Missing:**
- State never actually modified
- Visual platform differences based on state
- Player actions that affect platforms

**Implementation:**
1. Wire platform state changes to player actions
2. Add visual indicators in Constellation view
3. Affect available characters/paths based on platform state

**Effort:** MEDIUM (4-6 hours)
**Impact:** MEDIUM - Environmental feedback loop

---

## 2. TECHNICAL DEBT (Stability)

### P0: Pre-Release (Required)

| ID | Issue | Resolution | Effort |
|----|-------|------------|--------|
| **TD-010** | God Mode in production | Gate behind `NODE_ENV === 'development'` | 30 min |

### P1: High Priority (Within 2 weeks)

| ID | Issue | Resolution | Effort |
|----|-------|------------|--------|
| **TD-001** | Dual state (Zustand + React useState) | Eliminate useState for game state | 3-4 days |
| **TD-002** | No immutability enforcement | Add Immer or Object.freeze in dev | 1 day |
| **TD-003** | Scoped eslint-disable in SGI | Extract logic into smaller modules | 2-3 days |

### P2: Medium Priority (Within 1 month)

| ID | Issue | Resolution | Effort |
|----|-------|------------|--------|
| **TD-004** | Orbs outside GameState | Merge orb state into coreGameState | 1 day |
| **TD-005** | Fragmented localStorage namespace | Consolidate under `lux_story_v2_*` | 2 days |
| **TD-006** | Multi-tab corruption risk | Add StorageEvent listener | 4 hrs |
| **TD-007** | Non-deterministic randomness | Replace with seeded PRNG | 4 hrs |

### P3: Low Priority (Backlog)

| ID | Issue | Resolution | Effort |
|----|-------|------------|--------|
| **TD-008** | Legacy type casts in skill-zustand-bridge | Type skills interface properly | 2 hrs |
| **TD-009** | initializeGame empty dependencies | Extract into custom hook | 2 hrs |

---

## 3. SKIPPED TESTS (Quality Assurance)

41 tests currently skipped across 12 files. Priority order:

### 3.1 Journey Summary (10 tests) - P1

**File:** `tests/e2e/journey-summary.spec.ts`

**Tests to Enable:**
- Journey button appears when complete
- Modal opens/closes
- Keyboard navigation
- All sections visible
- Stats display
- Navigation dots
- Relationship reflections
- Pattern profile

**Blocker:** Journey Summary UI may not be fully wired

**Action:** Verify UI completion, then unskip tests

---

### 3.2 Admin Dashboard (6 tests) - P2

**File:** `tests/e2e/admin/`

**Tests to Enable:**
- Admin authentication
- Dashboard navigation
- Student detail pages

**Blocker:** Admin features may be in development

**Action:** Coordinate with admin feature completion

---

### 3.3 Constellation Mobile (9 tests) - P1

**File:** `tests/e2e/constellation/mobile.spec.ts`

**Tests to Enable:**
- Touch interactions
- Pan/zoom gestures
- Node selection on mobile
- Responsive layout

**Action:** Run tests, identify specific failures

---

### 3.4 Other Skipped Tests (16 tests) - P2

| Area | Count | Action |
|------|-------|--------|
| Ranking system | 5 | Review after ranking work |
| Simulation smoke | 1 | Should pass now |
| Trust derivatives | 1 | Verify test validity |
| Final QA | 2 | Review scope |
| Game engine | 1 | Browser runtime check |

---

## 4. FEATURE BACKLOG

### P2: Near-term Features

| Feature | Description | Effort | Dependency |
|---------|-------------|--------|------------|
| **Time Scrubbing** | Timeline slider to revisit conversations | MEDIUM | Conversation history tracking |
| **Constellation Smart Zoom** | Snap-to-node, auto-zoom on selection | SMALL | None |
| **Evidence Schema** | B2B value capture for stakeholders | MEDIUM | Birmingham opportunities |
| **Neural Deck Copy** | Haptic feedback on clipboard copy | SMALL | None |

### P3: Stretch Features

| Feature | Description | Effort | Risk |
|---------|-------------|--------|------|
| **Visual Cutscenes** | Orb handoff ceremony animation | MEDIUM | Animation complexity |
| **Prism Mode** | Journal as navigable 3D world | HIGH | Major architectural decision |
| **Movement/Spatial** | Physical exploration of station | HIGH | Requires design decision |

---

## 5. IMPLEMENTATION PHASES

### Phase 1: Quick Wins (Week 1)

**Goal:** Surface dormant high-value systems

| Task | Effort | Owner |
|------|--------|-------|
| TD-010: Gate God Mode | 30 min | Dev |
| Surface Chemistry/Biology UI | 2-4 hrs | Dev |
| Surface Career Values UI | 2-4 hrs | Dev |
| Run skipped simulation test | 30 min | Dev |

**Deliverables:**
- [ ] God Mode dev-only
- [ ] Biology indicator in Journal
- [ ] Career values visualization
- [ ] 1 skipped test enabled

---

### Phase 2: Opportunity System (Week 2)

**Goal:** Activate Birmingham B2B value

| Task | Effort | Owner |
|------|--------|-------|
| Birmingham Opportunities tab | 6-10 hrs | Dev |
| Connect to pattern/skill matching | 2 hrs | Dev |
| Unskip Journey Summary tests | 4 hrs | QA |

**Deliverables:**
- [ ] Opportunities tab in Journal
- [ ] Personalized opportunity matching
- [ ] 10 Journey Summary tests passing

---

### Phase 3: Depth Systems (Week 3)

**Goal:** Activate mystery and identity systems

| Task | Effort | Owner |
|------|--------|-------|
| Mystery Progression UI | 4-8 hrs | Dev |
| Identity Offering Modal | 4-8 hrs | Dev |
| Platform Evolution wiring | 4-6 hrs | Dev |
| Unskip Constellation mobile tests | 4 hrs | QA |

**Deliverables:**
- [ ] Mysteries section in Journal
- [ ] Identity offering on pattern threshold
- [ ] Platform state visible in Constellation
- [ ] 9 mobile tests passing

---

### Phase 4: Technical Debt (Week 4)

**Goal:** Stability improvements

| Task | Effort | Owner |
|------|--------|-------|
| TD-001: Eliminate dual state | 3-4 days | Dev |
| TD-002: Add immutability | 1 day | Dev |
| TD-006: Multi-tab safety | 4 hrs | Dev |

**Deliverables:**
- [ ] Single source of truth (Zustand only)
- [ ] Immutable state in dev mode
- [ ] Multi-tab coordination

---

## 6. SUCCESS METRICS

### Before Implementation

| Metric | Current |
|--------|---------|
| Dormant systems surfaced | 0/6 |
| Technical debt resolved | 0/10 |
| Skipped tests enabled | 0/41 |
| Feature backlog complete | 0/8 |

### After Phase 4

| Metric | Target |
|--------|--------|
| Dormant systems surfaced | 6/6 (100%) |
| Technical debt resolved | 5/10 (50%) |
| Skipped tests enabled | 20/41 (50%) |
| Feature backlog complete | 2/8 (25%) |

---

## 7. RISKS & MITIGATIONS

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Dormant systems have bugs | MEDIUM | LOW | Incremental activation with testing |
| TD-001 breaks game state | HIGH | HIGH | Feature flag, parallel testing |
| Skipped tests reveal bugs | MEDIUM | MEDIUM | Fix bugs before enabling tests |
| Birmingham data outdated | LOW | MEDIUM | Verify with stakeholders |

---

## 8. DEFINITION OF DONE

**Phase 1 Complete When:**
- [ ] All quick win tasks merged to main
- [ ] No new test failures
- [ ] Biology/Career visible in Journal

**Phase 2 Complete When:**
- [ ] Opportunities tab functional
- [ ] Journey Summary tests passing
- [ ] B2B demo ready for stakeholders

**Phase 3 Complete When:**
- [ ] All 6 dormant systems surfaced
- [ ] Mobile tests passing
- [ ] Identity offering triggers correctly

**Phase 4 Complete When:**
- [ ] Zustand is sole game state source
- [ ] Dev mode has immutability checks
- [ ] Multi-tab doesn't corrupt state

---

**Next Action:** Begin Phase 1 Quick Wins - Gate God Mode and surface Chemistry/Biology UI.
