# Ranking Systems - Software Development Plan

**Version:** 1.1 (Revised after deep analysis)
**Created:** 2026-02-04
**Last Updated:** 2026-02-04
**PRD Source:** `docs/PRD_RANKING_SYSTEMS/` (13 files)
**Estimated Total Effort:** ~~8-12 sprints~~ **5-7 sprints** (2-week sprints)

---

## ⚠️ CRITICAL: Deep Analysis Findings

**Many PRD features ALREADY EXIST in the codebase. This significantly reduces implementation scope.**

### Already Complete Systems (DO NOT RECREATE)

| System | Location | What Exists |
|--------|----------|-------------|
| Pattern Achievements | `lib/pattern-derivatives.ts` | 14 achievements fully implemented |
| Skill Combos | `lib/skill-combos.ts` | 12 combos with detection logic |
| Milestone Celebrations | `lib/milestone-celebrations.ts` | 9 celebration types, auto-triggering |
| IdentityCeremony | `components/IdentityCeremony.tsx` | Full ceremony presentation UI |
| Meta-Achievements | `lib/achievements.ts` | 25+ achievements tracked |
| Pattern Thresholds | `lib/patterns.ts` | 3 thresholds (3/6/9) |
| Orb Tiers | `lib/orbs.ts` | 5 tiers (0/10/30/60/100) |

### Effort Reduction Summary

| Phase | Original | Revised | Reason |
|-------|----------|---------|--------|
| Phase 1 (Pattern Display) | 2 sprints | 0.5 sprint | Just add display names |
| Phase 5 (Skill Stars) | 1 sprint | 0.5 sprint | Combos exist, add star display |
| Phase 6 (Assessment) | 2 sprints | 1 sprint | Simulations exist, add questions |
| Phase 10 (Ceremonies) | 1.5 sprints | 0.5 sprint | Triggers exist, add dialogue |
| **Total Saved** | | **~4 sprints** | **~40% reduction**

---

## Executive Summary

This plan implements an anime-inspired ranking presentation layer on top of Lux Story's existing progression systems. The implementation prioritizes:

1. **Non-breaking changes** - All new code wraps existing systems
2. **Incremental value** - Each phase delivers visible features
3. **Testability** - Contract tests before UI
4. **Performance** - Sub-50ms dashboard calculation

---

## Architecture Principle

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3: UI Components (React)                             │
│  - Badges, cards, dashboards, ceremony presentation         │
├─────────────────────────────────────────────────────────────┤
│  LAYER 2: Ranking Calculators (Pure Functions)              │
│  - Pattern mastery, career expertise, merit, stars          │
│  - All deterministic, memoizable, <5ms each                 │
├─────────────────────────────────────────────────────────────┤
│  LAYER 1: Type Definitions & Contracts                      │
│  - RankCategory, RankTier, ResonanceType                    │
│  - Imports from existing: OrbTier, PatternType, etc.        │
├─────────────────────────────────────────────────────────────┤
│  EXISTING: Core Progression Systems (DO NOT MODIFY)         │
│  - lib/orbs.ts, lib/patterns.ts, lib/constants.ts           │
│  - lib/skill-combos.ts, lib/character-state.ts              │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 0: Foundation (Sprint 1)
**Goal:** Types, contracts, and test infrastructure

| Task | Files | Effort | Acceptance |
|------|-------|--------|------------|
| 0.1 Define core types | `lib/ranking/types.ts` | 2h | TypeScript compiles |
| 0.2 Import existing types | `lib/ranking/types.ts` | 1h | No duplication |
| 0.3 Create registry stub | `lib/ranking/registry.ts` | 2h | Empty tiers OK |
| 0.4 Contract tests | `tests/lib/ranking-contracts.test.ts` | 3h | 10+ invariant tests |
| 0.5 Module exports | `lib/ranking/index.ts` | 30m | Clean API |

**Deliverable:** `lib/ranking/` module with types and contracts
**Gate:** `npm run test:run -- tests/lib/ranking-contracts.test.ts` passes

---

### Phase 1: Pattern Mastery Display (Sprint 1) ✅ REDUCED SCOPE
**Goal:** Station-themed names for existing orb tiers
**Note:** Pattern achievements (14) and tier tracking ALREADY EXIST. This phase adds DISPLAY ONLY.

| Task | Files | Effort | Acceptance | Status |
|------|-------|--------|------------|--------|
| 1.1 Display name mapping | `lib/ranking/pattern-mastery-display.ts` | 1h | 5 names mapped | New |
| ~~1.2 Mastery state calculator~~ | ~~`lib/ranking/pattern-mastery-state.ts`~~ | ~~3h~~ | ~~Uses existing patterns~~ | **EXISTS: `lib/pattern-derivatives.ts`** |
| ~~1.3 Promotion detection~~ | ~~`lib/ranking/pattern-promotions.ts`~~ | ~~2h~~ | ~~Detects tier changes~~ | **EXISTS: `lib/milestone-celebrations.ts`** |
| 1.4 Rank badge component | `components/ranking/PatternRankBadge.tsx` | 2h | Visual badge | New |
| 1.5 Journal integration | `components/Journal.tsx` (edit) | 1h | Badge visible | New |
| 1.6 Unit tests | `tests/lib/pattern-mastery.test.ts` | 1h | 5+ tests | Reduced |

**Revised Effort:** ~~14h~~ → **5h** (tasks 1.2, 1.3 already exist)
**Deliverable:** "Station Rank" badge in Journal showing Traveler→Station Master
**Gate:** Badge updates when orb tier changes

---

### Phase 2: Career Expertise Tiers (Sprint 2-3)
**Goal:** Domain-specific expertise with Champion status

| Task | Files | Effort | Acceptance |
|------|-------|--------|------------|
| 2.1 Domain definitions | `lib/ranking/career-domains.ts` | 2h | 5 domains |
| 2.2 Expertise tier definitions | `lib/ranking/career-expertise.ts` | 2h | 6 tiers |
| 2.3 Expertise calculator | `lib/ranking/career-expertise-calculator.ts` | 4h | Uses trust+skills |
| 2.4 Champion logic | `lib/ranking/career-champions.ts` | 3h | Multi-requirement |
| 2.5 Expertise badge | `components/ranking/CareerExpertiseBadge.tsx` | 2h | Per-domain display |
| 2.6 Samuel champion dialogue | `content/samuel-dialogue-graph.ts` (edit) | 3h | 5 domain speeches |
| 2.7 Unit tests | `tests/lib/career-expertise.test.ts` | 3h | 20+ tests |

**Deliverable:** Career expertise shown per domain, Champion ceremonies
**Gate:** Champion status triggers Samuel dialogue

---

### Phase 3: Challenge Rating (Sprint 3)
**Goal:** Match player readiness to content difficulty

| Task | Files | Effort | Acceptance |
|------|-------|--------|------------|
| 3.1 Grade definitions | `lib/ranking/challenge-grades.ts` | 2h | 5 grades |
| 3.2 Readiness calculator | `lib/ranking/player-readiness.ts` | 3h | Aggregates systems |
| 3.3 Matching logic | `lib/ranking/challenge-matching.ts` | 2h | 5 match types |
| 3.4 Content grading | `lib/ranking/content-grading.ts` | 2h | Sample tags |
| 3.5 Grade indicator | `components/ranking/ChallengeGradeIndicator.tsx` | 2h | Pip display |
| 3.6 Mismatch warning | `components/ranking/ChallengeMismatchWarning.tsx` | 2h | Dialog |
| 3.7 Unit tests | `tests/lib/challenge-rating.test.ts` | 2h | 15+ tests |

**Deliverable:** Challenge/readiness matching with warnings
**Gate:** Overreach content shows warning dialog

---

### Phase 4: Station Billboard (Sprint 4)
**Goal:** Public recognition system with merit points

| Task | Files | Effort | Acceptance |
|------|-------|--------|------------|
| 4.1 Standing tiers | `lib/ranking/station-standing.ts` | 2h | 4 tiers |
| 4.2 Merit calculator | `lib/ranking/merit-calculator.ts` | 3h | 5 sources |
| 4.3 Billboard state | `lib/ranking/billboard-state.ts` | 2h | Aggregates |
| 4.4 Billboard component | `components/ranking/StationBillboard.tsx` | 4h | Arrivals board UI |
| 4.5 Merit breakdown | `components/ranking/MeritBreakdown.tsx` | 2h | Tooltip |
| 4.6 Standing dialogue | `lib/ranking/standing-dialogue.ts` | 2h | Samuel commentary |
| 4.7 Unit tests | `tests/lib/station-billboard.test.ts` | 2h | 15+ tests |

**Deliverable:** Station Billboard in Journal with merit breakdown
**Gate:** NPCs reference standing in dialogue

---

### Phase 5: Skill Stars (Sprint 4) ✅ REDUCED SCOPE
**Goal:** Visual recognition for skill combo achievements
**Note:** Skill combos (12) and detection logic ALREADY EXIST. This phase adds DISPLAY ONLY.

| Task | Files | Effort | Acceptance | Status |
|------|-------|--------|------------|--------|
| 5.1 Star types | `lib/ranking/skill-stars.ts` | 1h | Bronze/Silver/Gold | New (mapping only) |
| ~~5.2 Star calculator~~ | ~~`lib/ranking/skill-star-calculator.ts`~~ | ~~3h~~ | ~~Uses combos~~ | **EXISTS: `lib/skill-combo-detector.ts`** |
| 5.3 Constellation display | `components/ranking/SkillStarConstellation.tsx` | 3h | Visual map | New |
| 5.4 Star award component | `components/ranking/SkillStarAward.tsx` | 2h | Award animation | New |
| 5.5 Journal integration | `components/Journal.tsx` (edit) | 1h | Stars tab | New |
| 5.6 Unit tests | `tests/lib/skill-stars.test.ts` | 1h | 5+ tests | Reduced |

**Implementation Note:**
```typescript
// Use existing function - NO NEW TRACKING
import { detectUnlockedCombos } from '@/lib/skill-combo-detector'
const synthesisStar = detectUnlockedCombos(skills).length >= 12 ? 3 :
                      detectUnlockedCombos(skills).length >= 4 ? 2 :
                      detectUnlockedCombos(skills).length >= 1 ? 1 : 0
```

**Revised Effort:** ~~15h~~ → **8h** (task 5.2 already exists)
**Deliverable:** Skill stars visible in Journal constellation
**Gate:** Combo unlock awards appropriate star

---

### Phase 6: Assessment Arc (Sprint 5-6)
**Goal:** Structured evaluation extending simulations

| Task | Files | Effort | Acceptance |
|------|-------|--------|------------|
| 6.1 Assessment types | `lib/ranking/assessment-types.ts` | 2h | Crossing/Trial/etc |
| 6.2 Question bank | `lib/ranking/assessment-questions.ts` | 4h | Pattern questions |
| 6.3 Grading logic | `lib/ranking/assessment-grading.ts` | 3h | Dimension scores |
| 6.4 Assessment state | `lib/ranking/assessment-state.ts` | 2h | Progress tracking |
| 6.5 Assessment UI | `components/ranking/AssessmentPresentation.tsx` | 4h | Full-screen |
| 6.6 Results display | `components/ranking/AssessmentResults.tsx` | 3h | Wheel/breakdown |
| 6.7 Integration tests | `tests/lib/assessment-arc.test.ts` | 3h | 20+ tests |

**Deliverable:** First Crossing assessment playable
**Gate:** Assessment completion affects readiness level

---

### Phase 7: Elite Status (Sprint 6-7)
**Goal:** Special designations for domain mastery

| Task | Files | Effort | Acceptance |
|------|-------|--------|------------|
| 7.1 Elite definitions | `lib/ranking/elite-status.ts` | 2h | 5 designations |
| 7.2 Elite registry | `lib/ranking/elite-registry.ts` | 3h | Requirements |
| 7.3 Elite calculator | `lib/ranking/elite-calculator.ts` | 3h | Multi-check |
| 7.4 Elite badge | `components/ranking/EliteStatusBadge.tsx` | 2h | Gradient badge |
| 7.5 Progress card | `components/ranking/EliteProgressCard.tsx` | 3h | Checklist UI |
| 7.6 Samuel ceremonies | Content updates | 3h | 5 ceremonies |
| 7.7 Unit tests | `tests/lib/elite-status.test.ts` | 2h | 15+ tests |

**Deliverable:** Elite status badges on profile
**Gate:** Meeting all requirements triggers ceremony

---

### Phase 8: Visual System (Sprint 7)
**Goal:** Unified visual language for all ranks

| Task | Files | Effort | Acceptance |
|------|-------|--------|------------|
| 8.1 Visual tokens | `lib/ranking/visual-tokens.ts` | 2h | Colors, glows |
| 8.2 Badge library | `components/ranking/visual/RankBadge.tsx` | 4h | 5 variants |
| 8.3 Transition animations | `lib/ranking/visual-animations.ts` | 3h | Level-up effects |
| 8.4 Display card | `components/ranking/visual/RankDisplayCard.tsx` | 3h | Unified card |
| 8.5 Accessibility | `lib/ranking/accessibility.ts` | 2h | Screen reader |
| 8.6 Apply to all UIs | Various components | 3h | Consistency |

**Deliverable:** Consistent rank visuals across app
**Gate:** All badges use shared visual system

---

### Phase 9: Cohorts (Sprint 8)
**Goal:** Peer comparison by generation

| Task | Files | Effort | Acceptance |
|------|-------|--------|------------|
| 9.1 Cohort definitions | `lib/ranking/cohorts.ts` | 2h | Monthly cohorts |
| 9.2 Stats types | `lib/ranking/cohort-stats.ts` | 2h | Aggregates |
| 9.3 Comparison logic | `lib/ranking/cohort-comparison.ts` | 3h | Percentiles |
| 9.4 Local fallback | `lib/ranking/cohort-local.ts` | 3h | Offline mode |
| 9.5 Display component | `components/ranking/CohortStandingDisplay.tsx` | 3h | Qualitative UI |
| 9.6 Unit tests | `tests/lib/cohorts.test.ts` | 2h | 12+ tests |

**Deliverable:** "Your Generation" display in Journal
**Gate:** Cohort comparison works offline

---

### Phase 10: Samuel's Ceremonies (Sprint 8) ✅ REDUCED SCOPE
**Goal:** Memorable recognition moments
**Note:** Milestone celebrations and IdentityCeremony component ALREADY EXIST. This phase adds CONTENT ONLY.

| Task | Files | Effort | Acceptance | Status |
|------|-------|--------|------------|--------|
| 10.1 Ceremony types | `lib/ranking/ceremonies.ts` | 1h | 5 types | New (types only) |
| 10.2 Ceremony dialogue | `lib/ranking/ceremony-dialogue.ts` | 3h | All dialogue content | New (content) |
| ~~10.3 Ceremony manager~~ | ~~`lib/ranking/ceremony-manager.ts`~~ | ~~3h~~ | ~~Trigger logic~~ | **EXISTS: `lib/milestone-celebrations.ts`** |
| ~~10.4 Presentation UI~~ | ~~`components/ranking/CeremonyPresentation.tsx`~~ | ~~5h~~ | ~~Full-screen~~ | **EXISTS: `components/IdentityCeremony.tsx`** |
| 10.5 History display | `components/ranking/CeremonyHistory.tsx` | 2h | Journal view | New |
| 10.6 Integration | Extend `IdentityCeremony.tsx` | 1h | Samuel dialogue | Modify existing |
| 10.7 E2E tests | `tests/e2e/ceremonies.spec.ts` | 1h | Flow tests | Reduced |

**Implementation Note:**
```typescript
// Extend existing IdentityCeremony, DO NOT create new component
// Add Samuel dialogue to existing milestone celebration triggers
import { IdentityCeremony } from '@/components/IdentityCeremony'
import { useMilestoneCelebrations } from '@/hooks/useMilestoneCelebrations'
```

**Revised Effort:** ~~21h~~ → **8h** (tasks 10.3, 10.4 already exist)
**Deliverable:** Rank-up ceremonies with Samuel
**Gate:** Ceremony triggers at tier transitions

---

### Phase 11: Cross-System Resonance (Sprint 9-10)
**Goal:** Emergent gameplay through system interactions

| Task | Files | Effort | Acceptance |
|------|-------|--------|------------|
| 11.1 Resonance types | `lib/ranking/resonance.ts` | 2h | 8 types |
| 11.2 Resonance registry | `lib/ranking/resonance-registry.ts` | 3h | Conditions |
| 11.3 Resonance events | `lib/ranking/resonance-events.ts` | 3h | 4 events |
| 11.4 Unified dashboard | `lib/ranking/unified-dashboard.ts` | 4h | Aggregation |
| 11.5 Resonance indicator | `components/ranking/ResonanceIndicator.tsx` | 2h | Active display |
| 11.6 Progress dashboard | `components/ranking/UnifiedProgressDashboard.tsx` | 4h | Full view |
| 11.7 Integration tests | `tests/lib/resonance.test.ts` | 3h | 20+ tests |

**Deliverable:** Unified progression dashboard with resonance bonuses
**Gate:** Multiple active resonances trigger event

---

### Phase 12: Polish & Performance (Sprint 10)
**Goal:** Performance optimization and final polish

| Task | Files | Effort | Acceptance |
|------|-------|--------|------------|
| 12.1 Performance audit | All calculators | 3h | <50ms dashboard |
| 12.2 Memoization | Add useMemo/useCallback | 2h | No recalc churn |
| 12.3 Bundle analysis | Webpack analysis | 2h | <20KB new code |
| 12.4 E2E test suite | `tests/e2e/ranking/` | 4h | Full coverage |
| 12.5 Documentation | `docs/RANKING_SYSTEM.md` | 3h | User guide |
| 12.6 Feature flag | `lib/feature-flags.ts` | 2h | Gradual rollout |

**Deliverable:** Production-ready ranking system
**Gate:** `npm run verify` passes, perf budgets met

---

## Dependency Graph

```
Phase 0 (Types)
    │
    ├──► Phase 1 (Pattern Mastery)
    │        │
    │        └──► Phase 10 (Ceremonies) ◄─────────────┐
    │                                                  │
    ├──► Phase 2 (Career Expertise)                   │
    │        │                                         │
    │        ├──► Phase 3 (Challenge Rating)          │
    │        │                                         │
    │        └──► Phase 7 (Elite Status) ─────────────┤
    │                                                  │
    ├──► Phase 4 (Billboard)                          │
    │        │                                         │
    │        └──► Phase 5 (Skill Stars)               │
    │                                                  │
    ├──► Phase 6 (Assessment Arc)                     │
    │                                                  │
    └──► Phase 8 (Visual System)                      │
             │                                         │
             └──► Phase 9 (Cohorts)                   │
                      │                                │
                      └──► Phase 11 (Resonance) ◄─────┘
                               │
                               └──► Phase 12 (Polish)
```

---

## Sprint Allocation (REVISED)

| Sprint | Phases | Focus | Notes |
|--------|--------|-------|-------|
| 1 | 0, 1, 2 (start) | Foundation + Pattern Display + Career | Phase 1 reduced to display-only |
| 2 | 2 (finish), 3 | Career Expertise + Challenge | - |
| 3 | 4, 5 | Billboard + Skill Stars | Phase 5 reduced to display-only |
| 4 | 6 | Assessment Arc | Extends existing simulations |
| 5 | 7, 8 | Elite + Visual System | - |
| 6 | 9, 10 | Cohorts + Ceremonies | Phase 10 reduced to content-only |
| 7 | 11, 12 | Resonance + Polish | - |

**Original:** 10 sprints → **Revised:** 7 sprints (~30% reduction)

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Performance regression | HIGH | Budget tests in CI (<50ms dashboard) |
| Existing system breakage | HIGH | No modifications to lib/orbs.ts etc |
| UI inconsistency | MEDIUM | Shared visual-tokens.ts |
| Ceremony interruption bugs | MEDIUM | Skippable, state recovery |
| Cohort privacy leak | HIGH | Aggregated data only, no PII |
| Feature creep | MEDIUM | PRD scope locked, defer new ideas |

---

## Testing Strategy

### Unit Tests (Vitest)
- All calculators: `tests/lib/ranking/*.test.ts`
- Contract invariants: `tests/lib/ranking-contracts.test.ts`
- **Target:** 90%+ coverage on `lib/ranking/`

### Integration Tests (Playwright)
- Ceremony flow: `tests/e2e/ranking/ceremonies.spec.ts`
- Dashboard render: `tests/e2e/ranking/dashboard.spec.ts`
- **Target:** Core happy paths

### Performance Tests
- Dashboard calculation: <50ms
- Individual calculators: <5ms each
- UI render: <100ms

### Contract Tests
```typescript
// tests/lib/ranking-contracts.test.ts
describe('Ranking System Contracts', () => {
  it('all calculators are deterministic')
  it('all tiers have unique IDs')
  it('thresholds are strictly increasing')
  it('no calculator modifies game state')
  it('all resonances reference valid systems')
})
```

---

## Rollout Strategy

### Stage 1: Internal Testing
- Feature flag: `RANKING_V2=false`
- Admin-only access via `/admin/ranking-preview`

### Stage 2: Beta Users
- Feature flag: `RANKING_V2=beta`
- 10% of new users, opt-in for existing

### Stage 3: General Availability
- Feature flag: `RANKING_V2=true`
- Monitor performance, error rates

### Backout Plan
- All ranking code behind feature flag
- Existing progression unaffected
- Can disable ranking UI instantly

---

## Definition of Done

### Per-Phase
- [ ] All tasks completed
- [ ] Unit tests pass (15+ per phase)
- [ ] TypeScript compiles without errors
- [ ] Performance budget met
- [ ] Code reviewed

### Full System
- [ ] `npm run verify` passes
- [ ] E2E tests pass
- [ ] Documentation complete
- [ ] Feature flag working
- [ ] Rollout plan approved

---

## File Structure (REVISED)

```
lib/ranking/
├── index.ts                      # Module exports
├── types.ts                      # Core types
├── registry.ts                   # Tier registry
│
├── pattern-mastery-display.ts    # Phase 1 (DISPLAY ONLY)
├── # pattern-mastery-state.ts    # EXISTS: lib/pattern-derivatives.ts
├── # pattern-promotions.ts       # EXISTS: lib/milestone-celebrations.ts
│
├── career-domains.ts             # Phase 2
├── career-expertise.ts
├── career-expertise-calculator.ts
├── career-champions.ts
│
├── challenge-grades.ts           # Phase 3
├── player-readiness.ts
├── challenge-matching.ts
├── content-grading.ts
│
├── station-standing.ts           # Phase 4
├── merit-calculator.ts           # NEW: Merit points calculation
├── billboard-state.ts
├── standing-dialogue.ts
│
├── skill-stars.ts                # Phase 5 (DISPLAY ONLY)
├── # skill-star-calculator.ts    # EXISTS: lib/skill-combo-detector.ts
│
├── assessment-types.ts           # Phase 6
├── assessment-questions.ts       # NEW: Question content
├── assessment-grading.ts
├── assessment-state.ts
│
├── elite-status.ts               # Phase 7
├── elite-registry.ts
├── elite-calculator.ts
│
├── visual-tokens.ts              # Phase 8
├── visual-animations.ts
├── accessibility.ts
│
├── cohorts.ts                    # Phase 9 (NEW - no overlap)
├── cohort-stats.ts
├── cohort-comparison.ts
├── cohort-local.ts
│
├── ceremonies.ts                 # Phase 10 (CONTENT ONLY)
├── ceremony-dialogue.ts          # NEW: Samuel dialogue content
├── # ceremony-manager.ts         # EXISTS: lib/milestone-celebrations.ts
│
├── resonance.ts                  # Phase 11 (NEW - no overlap)
├── resonance-registry.ts
├── resonance-events.ts
└── unified-dashboard.ts

# Files marked with # = NOT NEEDED (already exists elsewhere)

components/ranking/
├── PatternRankBadge.tsx          # Phase 1 (DISPLAY)
├── CareerExpertiseBadge.tsx      # Phase 2
├── ChallengeGradeIndicator.tsx   # Phase 3
├── ChallengeMismatchWarning.tsx
├── StationBillboard.tsx          # Phase 4
├── MeritBreakdown.tsx
├── SkillStarConstellation.tsx    # Phase 5 (DISPLAY)
├── SkillStarAward.tsx
├── AssessmentPresentation.tsx    # Phase 6
├── AssessmentResults.tsx
├── EliteStatusBadge.tsx          # Phase 7
├── EliteProgressCard.tsx
├── visual/                       # Phase 8
│   ├── RankBadge.tsx
│   └── RankDisplayCard.tsx
├── CohortStandingDisplay.tsx     # Phase 9
├── # CeremonyPresentation.tsx    # EXISTS: components/IdentityCeremony.tsx
├── CeremonyHistory.tsx           # Phase 10 (NEW)
├── ResonanceIndicator.tsx        # Phase 11
└── UnifiedProgressDashboard.tsx

# Note: CeremonyPresentation.tsx not needed - extend IdentityCeremony.tsx instead

tests/lib/ranking/
├── ranking-contracts.test.ts     # Phase 0
├── pattern-mastery.test.ts       # Phase 1
├── career-expertise.test.ts      # Phase 2
├── challenge-rating.test.ts      # Phase 3
├── station-billboard.test.ts     # Phase 4
├── skill-stars.test.ts           # Phase 5
├── assessment-arc.test.ts        # Phase 6
├── elite-status.test.ts          # Phase 7
├── cohorts.test.ts               # Phase 9
└── resonance.test.ts             # Phase 11

tests/e2e/ranking/
├── ceremonies.spec.ts            # Phase 10
└── dashboard.spec.ts             # Phase 11
```

---

## Estimated Totals (REVISED)

| Metric | Original | Revised | Reason |
|--------|----------|---------|--------|
| New TypeScript files | ~45 | ~30 | Many calculators already exist |
| New React components | ~20 | ~15 | IdentityCeremony can be extended |
| New test files | ~15 | ~12 | Reduced scope = fewer tests |
| Lines of code (est.) | ~8,000 | ~5,000 | Display layers, not tracking |
| Total effort | 8-12 sprints | **5-7 sprints** | ~40% reduction |
| Team size | 1-2 engineers | 1 engineer | Reduced scope manageable solo |

**Key Insight:** Most "new" code is display/presentation layer mapping to EXISTING data.
No new achievement tracking, combo detection, or celebration triggering required.

---

## Quick Start (Phase 0)

```bash
# 1. Create ranking module directory
mkdir -p lib/ranking
mkdir -p components/ranking
mkdir -p tests/lib/ranking

# 2. Create initial types file
cat > lib/ranking/types.ts << 'EOF'
/**
 * Ranking System Types
 * Imports from existing systems, defines new structures
 */
import type { OrbTier } from '@/lib/orbs'
import type { PatternType } from '@/lib/patterns'

export type RankCategory =
  | 'pattern_mastery'
  | 'career_expertise'
  | 'challenge_rating'
  | 'station_standing'
  | 'skill_stars'
  | 'elite_status'

export interface RankTier {
  id: string
  category: RankCategory
  level: number
  name: string
  threshold: number
  description: string
  colorToken?: string
}

// ... rest of types
EOF

# 3. Run type check
npm run type-check
```

---

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Tech Lead | | | |
| Product | | | |
| QA | | | |
