# Ranking System Implementation Tracker

**Created:** 2026-02-04
**Source PRDs:** `docs/PRD_RANKING_SYSTEMS/` (13 files, audit-complete)
**Target:** 5-7 sprints (2-week sprints)
**Approach:** Systematic, incremental, non-breaking

---

## Implementation Philosophy

1. **Layer 1 first** - Types and contracts before calculators
2. **Tests before UI** - Contract tests validate invariants
3. **Display over tracking** - Most features are views of existing data
4. **Incremental value** - Each phase delivers visible features
5. **No breaking changes** - New code wraps existing systems

---

## Dependency Graph

```
Phase 0 (Foundation) ─────────────────────────────────────────┐
    │                                                         │
    ├──► Phase 1 (Pattern Mastery Display)                   │
    │        │                                                │
    │        └──► Phase 10 (Ceremonies) ◄────────────────┐   │
    │                                                     │   │
    ├──► Phase 2 (Career Expertise)                      │   │
    │        │                                            │   │
    │        ├──► Phase 3 (Challenge Rating)             │   │
    │        │                                            │   │
    │        └──► Phase 7 (Elite Status) ────────────────┤   │
    │                                                     │   │
    ├──► Phase 4 (Station Billboard)                     │   │
    │        │                                            │   │
    │        └──► Phase 5 (Skill Stars)                  │   │
    │                                                     │   │
    ├──► Phase 6 (Assessment Arc)                        │   │
    │                                                     │   │
    └──► Phase 8 (Visual System)                         │   │
             │                                            │   │
             └──► Phase 9 (Cohorts)                      │   │
                      │                                   │   │
                      └──► Phase 11 (Resonance) ◄────────┘   │
                               │                              │
                               └──► Phase 12 (Polish) ◄──────┘
```

---

## Phase Tracker

### Phase 0: Foundation
**Goal:** Types, contracts, test infrastructure
**Effort:** 1 sprint (shared with Phase 1)
**Status:** NOT STARTED

| Task | File | Status | Notes |
|------|------|--------|-------|
| 0.1 Define core types | `lib/ranking/types.ts` | ⬜ | Import from existing |
| 0.2 Create registry | `lib/ranking/registry.ts` | ⬜ | Thresholds from ORB_TIERS |
| 0.3 Contract tests | `tests/lib/ranking-contracts.test.ts` | ⬜ | 10+ invariant tests |
| 0.4 Module exports | `lib/ranking/index.ts` | ⬜ | Clean API |

**Gate:** `npm run test:run -- tests/lib/ranking-contracts.test.ts` passes

---

### Phase 1: Pattern Mastery Display
**Goal:** Station-themed names for existing orb tiers
**Effort:** 0.5 sprint (reduced - display only)
**Status:** NOT STARTED
**Depends on:** Phase 0

| Task | File | Status | Notes |
|------|------|--------|-------|
| 1.1 Display name mapping | `lib/ranking/pattern-mastery-display.ts` | ⬜ | 5 names |
| 1.2 Rank badge component | `components/ranking/PatternRankBadge.tsx` | ⬜ | Visual |
| 1.3 Journal integration | `components/Journal.tsx` | ⬜ | Edit existing |
| 1.4 Unit tests | `tests/lib/ranking/pattern-mastery.test.ts` | ⬜ | 5+ tests |

**Gate:** Badge visible in Journal, updates on tier change

---

### Phase 2: Career Expertise Tiers
**Goal:** Domain-specific expertise with Champion status
**Effort:** 1.5 sprints
**Status:** NOT STARTED
**Depends on:** Phase 0

| Task | File | Status | Notes |
|------|------|--------|-------|
| 2.1 Domain definitions | `lib/ranking/career-domains.ts` | ⬜ | 5 domains, 20 chars |
| 2.2 Expertise tiers | `lib/ranking/career-expertise.ts` | ⬜ | 6 tiers |
| 2.3 Expertise calculator | `lib/ranking/career-expertise-calculator.ts` | ⬜ | Uses trust+skills |
| 2.4 Champion logic | `lib/ranking/career-champions.ts` | ⬜ | Multi-requirement |
| 2.5 Expertise badge | `components/ranking/CareerExpertiseBadge.tsx` | ⬜ | Per-domain |
| 2.6 Samuel dialogue | `content/samuel-dialogue-graph.ts` | ⬜ | 5 speeches |
| 2.7 Unit tests | `tests/lib/ranking/career-expertise.test.ts` | ⬜ | 20+ tests |

**Gate:** Champion status triggers Samuel dialogue

---

### Phase 3: Challenge Rating
**Goal:** Match player readiness to content difficulty
**Effort:** 1 sprint
**Status:** NOT STARTED
**Depends on:** Phase 2

| Task | File | Status | Notes |
|------|------|--------|-------|
| 3.1 Grade definitions | `lib/ranking/challenge-grades.ts` | ⬜ | 5 grades |
| 3.2 Readiness calculator | `lib/ranking/player-readiness.ts` | ⬜ | Aggregates |
| 3.3 Matching logic | `lib/ranking/challenge-matching.ts` | ⬜ | 5 match types |
| 3.4 Grade indicator | `components/ranking/ChallengeGradeIndicator.tsx` | ⬜ | Pip display |
| 3.5 Mismatch warning | `components/ranking/ChallengeMismatchWarning.tsx` | ⬜ | Dialog |
| 3.6 Unit tests | `tests/lib/ranking/challenge-rating.test.ts` | ⬜ | 15+ tests |

**Gate:** Overreach content shows warning

---

### Phase 4: Station Billboard
**Goal:** Public recognition with merit points
**Effort:** 1 sprint
**Status:** NOT STARTED
**Depends on:** Phase 0

| Task | File | Status | Notes |
|------|------|--------|-------|
| 4.1 Standing tiers | `lib/ranking/station-standing.ts` | ⬜ | 4 tiers |
| 4.2 Merit calculator | `lib/ranking/merit-calculator.ts` | ⬜ | 5 sources |
| 4.3 Billboard state | `lib/ranking/billboard-state.ts` | ⬜ | Aggregates |
| 4.4 Billboard component | `components/ranking/StationBillboard.tsx` | ⬜ | Arrivals board |
| 4.5 Merit breakdown | `components/ranking/MeritBreakdown.tsx` | ⬜ | Tooltip |
| 4.6 Unit tests | `tests/lib/ranking/station-billboard.test.ts` | ⬜ | 15+ tests |

**Gate:** NPCs reference standing in dialogue

---

### Phase 5: Skill Stars
**Goal:** Visual recognition for skill combos
**Effort:** 0.5 sprint (reduced - display only)
**Status:** NOT STARTED
**Depends on:** Phase 4

| Task | File | Status | Notes |
|------|------|--------|-------|
| 5.1 Star types | `lib/ranking/skill-stars.ts` | ⬜ | Bronze/Silver/Gold |
| 5.2 Constellation display | `components/ranking/SkillStarConstellation.tsx` | ⬜ | Visual map |
| 5.3 Star award | `components/ranking/SkillStarAward.tsx` | ⬜ | Animation |
| 5.4 Journal integration | `components/Journal.tsx` | ⬜ | Stars tab |
| 5.5 Unit tests | `tests/lib/ranking/skill-stars.test.ts` | ⬜ | 5+ tests |

**Gate:** Combo unlock awards star

---

### Phase 6: Assessment Arc
**Goal:** Structured evaluation extending simulations
**Effort:** 1 sprint
**Status:** NOT STARTED
**Depends on:** Phase 0

| Task | File | Status | Notes |
|------|------|--------|-------|
| 6.1 Assessment types | `lib/ranking/assessment-types.ts` | ⬜ | Crossing/Trial |
| 6.2 Question bank | `lib/ranking/assessment-questions.ts` | ⬜ | Pattern questions |
| 6.3 Grading logic | `lib/ranking/assessment-grading.ts` | ⬜ | Dimension scores |
| 6.4 Assessment state | `lib/ranking/assessment-state.ts` | ⬜ | Progress |
| 6.5 Assessment UI | `components/ranking/AssessmentPresentation.tsx` | ⬜ | Full-screen |
| 6.6 Results display | `components/ranking/AssessmentResults.tsx` | ⬜ | Wheel |
| 6.7 Integration tests | `tests/lib/ranking/assessment-arc.test.ts` | ⬜ | 20+ tests |

**Gate:** Assessment completion affects readiness

---

### Phase 7: Elite Status
**Goal:** Special designations for domain mastery
**Effort:** 1 sprint
**Status:** NOT STARTED
**Depends on:** Phase 2

| Task | File | Status | Notes |
|------|------|--------|-------|
| 7.1 Elite definitions | `lib/ranking/elite-status.ts` | ⬜ | 5 designations |
| 7.2 Elite registry | `lib/ranking/elite-registry.ts` | ⬜ | Requirements |
| 7.3 Elite calculator | `lib/ranking/elite-calculator.ts` | ⬜ | Multi-check |
| 7.4 Elite badge | `components/ranking/EliteStatusBadge.tsx` | ⬜ | Gradient |
| 7.5 Progress card | `components/ranking/EliteProgressCard.tsx` | ⬜ | Checklist |
| 7.6 Samuel ceremonies | Content updates | ⬜ | 5 ceremonies |
| 7.7 Unit tests | `tests/lib/ranking/elite-status.test.ts` | ⬜ | 15+ tests |

**Gate:** Meeting requirements triggers ceremony

---

### Phase 8: Visual System
**Goal:** Unified visual language
**Effort:** 1 sprint
**Status:** NOT STARTED
**Depends on:** Phase 0

| Task | File | Status | Notes |
|------|------|--------|-------|
| 8.1 Visual tokens | `lib/ranking/visual-tokens.ts` | ⬜ | Colors, glows |
| 8.2 Badge library | `components/ranking/visual/RankBadge.tsx` | ⬜ | 5 variants |
| 8.3 Animations | `lib/ranking/visual-animations.ts` | ⬜ | Level-up |
| 8.4 Display card | `components/ranking/visual/RankDisplayCard.tsx` | ⬜ | Unified |
| 8.5 Accessibility | `lib/ranking/accessibility.ts` | ⬜ | Screen reader |
| 8.6 Apply to all UIs | Various | ⬜ | Consistency |

**Gate:** All badges use shared visual system

---

### Phase 9: Cohorts
**Goal:** Peer comparison by generation
**Effort:** 1 sprint
**Status:** NOT STARTED
**Depends on:** Phase 8

| Task | File | Status | Notes |
|------|------|--------|-------|
| 9.1 Cohort definitions | `lib/ranking/cohorts.ts` | ⬜ | Monthly |
| 9.2 Stats types | `lib/ranking/cohort-stats.ts` | ⬜ | Aggregates |
| 9.3 Comparison logic | `lib/ranking/cohort-comparison.ts` | ⬜ | Percentiles |
| 9.4 Local fallback | `lib/ranking/cohort-local.ts` | ⬜ | Offline |
| 9.5 Display component | `components/ranking/CohortStandingDisplay.tsx` | ⬜ | Qualitative |
| 9.6 Unit tests | `tests/lib/ranking/cohorts.test.ts` | ⬜ | 12+ tests |

**Gate:** Cohort comparison works offline

---

### Phase 10: Samuel's Ceremonies
**Goal:** Memorable recognition moments
**Effort:** 0.5 sprint (reduced - content only)
**Status:** NOT STARTED
**Depends on:** Phase 1, Phase 7

| Task | File | Status | Notes |
|------|------|--------|-------|
| 10.1 Ceremony types | `lib/ranking/ceremonies.ts` | ⬜ | 5 types |
| 10.2 Ceremony dialogue | `lib/ranking/ceremony-dialogue.ts` | ⬜ | Content |
| 10.3 History display | `components/ranking/CeremonyHistory.tsx` | ⬜ | Journal |
| 10.4 Extend IdentityCeremony | `components/IdentityCeremony.tsx` | ⬜ | Modify |
| 10.5 E2E tests | `tests/e2e/ranking/ceremonies.spec.ts` | ⬜ | Flow |

**Gate:** Ceremony triggers at tier transitions

---

### Phase 11: Cross-System Resonance
**Goal:** Emergent gameplay through system interactions
**Effort:** 1 sprint
**Status:** NOT STARTED
**Depends on:** Phase 9, Phase 10

| Task | File | Status | Notes |
|------|------|--------|-------|
| 11.1 Resonance types | `lib/ranking/resonance.ts` | ⬜ | 8 types |
| 11.2 Resonance registry | `lib/ranking/resonance-registry.ts` | ⬜ | Conditions |
| 11.3 Resonance events | `lib/ranking/resonance-events.ts` | ⬜ | 4 events |
| 11.4 Unified dashboard | `lib/ranking/unified-dashboard.ts` | ⬜ | Aggregation |
| 11.5 Resonance indicator | `components/ranking/ResonanceIndicator.tsx` | ⬜ | Active |
| 11.6 Progress dashboard | `components/ranking/UnifiedProgressDashboard.tsx` | ⬜ | Full view |
| 11.7 Integration tests | `tests/lib/ranking/resonance.test.ts` | ⬜ | 20+ tests |

**Gate:** Multiple resonances trigger event

---

### Phase 12: Polish & Performance
**Goal:** Production readiness
**Effort:** 1 sprint
**Status:** NOT STARTED
**Depends on:** All phases

| Task | File | Status | Notes |
|------|------|--------|-------|
| 12.1 Performance audit | All calculators | ⬜ | <50ms |
| 12.2 Memoization | Add useMemo/useCallback | ⬜ | No churn |
| 12.3 Bundle analysis | Webpack | ⬜ | <20KB |
| 12.4 E2E test suite | `tests/e2e/ranking/` | ⬜ | Full |
| 12.5 Documentation | `docs/RANKING_SYSTEM.md` | ⬜ | User guide |
| 12.6 Feature flag | `lib/feature-flags.ts` | ⬜ | Rollout |

**Gate:** `npm run verify` passes, perf budgets met

---

## Sprint Allocation

| Sprint | Phases | Focus |
|--------|--------|-------|
| 1 | 0, 1 | Foundation + Pattern Display |
| 2 | 2 | Career Expertise |
| 3 | 3, 4 | Challenge Rating + Billboard |
| 4 | 5, 6 | Skill Stars + Assessment |
| 5 | 7, 8 | Elite + Visual System |
| 6 | 9, 10 | Cohorts + Ceremonies |
| 7 | 11, 12 | Resonance + Polish |

---

## Progress Summary

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 0: Foundation | ⬜ Not Started | 0% |
| Phase 1: Pattern Mastery | ⬜ Not Started | 0% |
| Phase 2: Career Expertise | ⬜ Not Started | 0% |
| Phase 3: Challenge Rating | ⬜ Not Started | 0% |
| Phase 4: Station Billboard | ⬜ Not Started | 0% |
| Phase 5: Skill Stars | ⬜ Not Started | 0% |
| Phase 6: Assessment Arc | ⬜ Not Started | 0% |
| Phase 7: Elite Status | ⬜ Not Started | 0% |
| Phase 8: Visual System | ⬜ Not Started | 0% |
| Phase 9: Cohorts | ⬜ Not Started | 0% |
| Phase 10: Ceremonies | ⬜ Not Started | 0% |
| Phase 11: Resonance | ⬜ Not Started | 0% |
| Phase 12: Polish | ⬜ Not Started | 0% |

**Overall:** 0/12 phases complete (0%)

---

## Session Log

| Date | Phase | Work Done | Next Steps |
|------|-------|-----------|------------|
| 2026-02-04 | PRD | Audit fixes complete | Start Phase 0 |

---

## Quick Commands

```bash
# Create ranking module structure
mkdir -p lib/ranking components/ranking tests/lib/ranking

# Run ranking tests only
npm run test:run -- tests/lib/ranking

# Type check
npm run type-check

# Verify all
npm run verify
```
