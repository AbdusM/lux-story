# PRD Erratum: Existing Systems Integration

**Created:** 2026-02-04
**Purpose:** Document conflicts between initial PRDs and existing codebase systems, with reconciliation strategy

---

## Critical Discovery: Existing Progression Infrastructure

The initial PRDs were created without full awareness of the existing progression systems. This document corrects those gaps and provides proper integration guidance.

---

## Existing Systems Inventory

### 1. Orb System (ALREADY EXISTS)
**Location:** `lib/orbs.ts`, `lib/pattern-unlocks.ts`

**Existing Tiers:**
```typescript
// lib/orbs.ts - ACTUAL thresholds
OrbTier = 'nascent' | 'emerging' | 'developing' | 'flourishing' | 'mastered'

ORB_TIERS = {
  nascent: { minOrbs: 0 },
  emerging: { minOrbs: 10 },
  developing: { minOrbs: 30 },
  flourishing: { minOrbs: 60 },
  mastered: { minOrbs: 100 }
}
```

**PRD Conflict:** Phase 2 defined different tiers (Traveler→Station Master with 0, 5, 15, 30, 50)
**Resolution:** PRDs should BUILD ON existing orb tiers, not replace them. Rename anime-inspired tiers to be display/narrative names.

---

### 2. Pattern Thresholds (ALREADY EXISTS)
**Location:** `lib/patterns.ts`

**Existing Thresholds:**
```typescript
PATTERN_THRESHOLDS = {
  EMERGING: 3,    // Voice whispers, basic options unlock
  DEVELOPING: 6,  // Voice urges, standard options unlock
  FLOURISHING: 9  // Voice commands, mastery options unlock
}
```

**Also:** Pattern unlocks at 10%, 50%, 85% fill (per-pattern)
**Also:** Orb fill tiers at 25%, 50%, 75%, 100%

**PRD Conflict:** Phase 2 implied different thresholds
**Resolution:** Use existing thresholds. Anime-inspired ceremony triggers at existing milestones.

---

### 3. Trust System (ALREADY EXISTS)
**Location:** `lib/constants.ts`

**Existing Tiers:**
```typescript
TRUST_THRESHOLDS = {
  stranger: 0,
  acquaintance: 2,
  friendly: 4,
  trusted: 6,
  close: 8,
  bonded: 10
}
```

**Voice Tones by Trust:**
```typescript
VoiceTone = 'whisper' | 'speak' | 'urge' | 'command'
// Trust 0-3: whisper, 4-5: speak, 6-9: urge, 10: command
```

**PRD Conflict:** Phase 3 didn't reference these
**Resolution:** Career Expertise should use trust tiers as prerequisite checks.

---

### 4. Skill Combo System (ALREADY EXISTS)
**Location:** `lib/skill-combos.ts`, `lib/skill-combo-detector.ts`

**Existing Structure:**
- 12 defined combos (Tier 1: 2-skill, Tier 2: 3-skill)
- Each requires skills at minLevels (4-5)
- Unlocks: careers, dialogue, achievements, abilities

**PRD Conflict:** Phase 6 defined new star system ignoring combos
**Resolution:** Skill Stars should WRAP the existing combo system, not replace it.

---

### 5. Character Tiers (ALREADY EXISTS)
**Location:** `lib/character-tiers.ts`

**Existing Structure:**
```typescript
CharacterTier = 1 | 2 | 3 | 4

Tier 1 (Core): Samuel, Maya, Devon - 80 nodes, 15 voice variations
Tier 2 (Primary): Marcus, Tess, Rohan, Kai, Quinn, Nadia - 50 nodes
Tier 3 (Secondary): Grace, Elena, Alex, Yaquin, Dante, Isaiah - 35 nodes
Tier 4 (Extended): Silas, Asha, Lira, Zara, Jordan - 25 nodes
```

**PRD Conflict:** PRDs treated characters uniformly
**Resolution:** Elite Status should respect character tiers for requirement design.

---

### 6. Readiness Levels (ALREADY EXISTS)
**Location:** `lib/schemas/player-data.ts`

**Existing Levels:**
```typescript
ReadinessLevel = 'exploratory' | 'emerging' | 'near_ready' | 'ready'
```

**PRD Conflict:** Phase 4 defined 5 challenge grades
**Resolution:** Challenge grades should MAP TO existing readiness levels.

---

### 7. Simulations (ALREADY EXISTS)
**Location:** Dialogue graphs, 5/20 characters complete

**Existing Structure:**
- Phase 1: Introduction (trust 0-2)
- Phase 2: Application (trust 5+)
- Phase 3: Mastery (trust 8+, 95% success)

**PRD Conflict:** Phase 7 defined new assessment structure
**Resolution:** Assessment Arc should EXTEND simulations, not replace them.

---

### 8. Loyalty Experiences (ALREADY EXISTS)
**Location:** `lib/loyalty-experience.ts`

**Existing:** 20/20 characters have loyalty experience definitions

**PRD Conflict:** Not referenced in any PRD
**Resolution:** Elite Status requirements should include loyalty experience completion.

---

### 9. Info Value Tiers (ALREADY EXISTS)
**Location:** `lib/trust-derivatives.ts`

**Existing Tiers:**
```typescript
InfoValueTier = 'common' | 'uncommon' | 'rare' | 'secret' | 'legendary'

INFO_TIER_TRUST_REQUIREMENTS = {
  common: 0,
  uncommon: 2,
  rare: 4,
  secret: 6,
  legendary: 8
}
```

**PRD Conflict:** Phase 6 discovery star didn't reference this
**Resolution:** Discovery tracking should use info tiers.

---

## Reconciliation Strategy

### Layer Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  NEW: Anime-Inspired Presentation Layer (PRDs)                  │
│  - Samuel's Ceremonies (display names, dialogue)                │
│  - Visual rank indicators (badges, glows)                       │
│  - Cross-system resonance (emergent bonuses)                    │
├─────────────────────────────────────────────────────────────────┤
│  EXISTING: Core Progression Systems                             │
│  - Orb System (5 tiers, earning mechanics)                      │
│  - Pattern System (3 thresholds, 5 patterns)                    │
│  - Trust System (6 tiers, 0-10 scale)                           │
│  - Skill System (54+ skills, combos)                            │
│  - Character Tiers (1-4, content allocation)                    │
└─────────────────────────────────────────────────────────────────┘
```

### Mapping Table: PRD → Existing System

| PRD System | Maps To | Integration Strategy |
|------------|---------|---------------------|
| Pattern Mastery Ranks | Orb Tiers + Pattern Thresholds | Display names overlay |
| Career Expertise | Trust Tiers + Skill Combos | Domain aggregation |
| Challenge Rating | Readiness Levels | 4-level mapping |
| Station Standing | Orb totalEarned + Merit | New merit calculation |
| Skill Stars | Skill Combos + Info Tiers | Star = combo completion |
| Assessment Arc | Simulations (existing) | Extension, not replacement |
| Elite Status | Trust 8+ + Loyalty + Combos | Multi-system gate |
| Visual Indicators | Existing colors + new glows | Additive styling |
| Cohorts | New (no conflict) | Standalone addition |
| Ceremonies | Samuel dialogue triggers | Trigger at existing milestones |
| Resonance | New (no conflict) | Cross-system bonuses |

---

## Required PRD Updates

### Phase 1: Core Types
- ADD: Import existing types (`OrbTier`, `TrustThreshold`, `SkillCombo`)
- MODIFY: `RankCategory` to reference existing enums
- ADD: Mapping functions from existing to display tiers

### Phase 2: Pattern Mastery
- MODIFY: Use existing orb tiers as data source
- ADD: Display name mapping (nascent→Traveler, etc.)
- KEEP: Samuel promotion dialogue (triggers at existing thresholds)

### Phase 3: Career Expertise
- MODIFY: Use existing trust tiers as character requirements
- ADD: Reference existing skill combos for domain expertise
- KEEP: Champion status logic

### Phase 4: Challenge Rating
- MODIFY: Map 5 grades to 4 readiness levels + "beyond ready"
- ADD: Reference existing `StateCondition` for gates

### Phase 5: Station Billboard
- KEEP: Merit calculation (this is new)
- ADD: Use existing `totalEarned` from orb balance

### Phase 6: Skill Stars
- MODIFY: Stars = combo unlocks + info tier discoveries
- ADD: Reference existing `SKILL_COMBOS` and `InfoValueTier`

### Phase 7: Assessment Arc
- MODIFY: Extend existing simulation system
- ADD: Reference simulation phases 1/2/3
- KEEP: Assessment questions (additive content)

### Phase 8: Elite Status
- MODIFY: Requirements use existing trust tiers
- ADD: Loyalty experience completion requirement
- ADD: Character tier awareness

### Phase 9: Visual Indicators
- KEEP: New glow/badge system (additive)
- ADD: Use existing colors from `PATTERN_METADATA`

### Phase 10-12: No conflicts (new systems)

---

## Key Files to Reference

| System | Primary File | Secondary Files |
|--------|-------------|-----------------|
| Orbs | `lib/orbs.ts` | `lib/pattern-unlocks.ts`, `hooks/useOrbs.ts` |
| Patterns | `lib/patterns.ts` | `lib/pattern-derivatives.ts` |
| Trust | `lib/constants.ts` | `lib/trust-derivatives.ts`, `lib/trust-labels.ts` |
| Skills | `lib/skill-combos.ts` | `lib/skill-combo-detector.ts`, `lib/2030-skills-system.ts` |
| Characters | `lib/character-tiers.ts` | `lib/graph-registry.ts` |
| State | `lib/character-state.ts` | `lib/game-store.ts` |
| Loyalty | `lib/loyalty-experience.ts` | Content dialogue graphs |
| Simulations | Content dialogue graphs | `lib/dialogue-graph.ts` |

---

## Summary of Corrections

1. **DO NOT** create new tier systems that conflict with existing ones
2. **DO** create display/narrative layers on top of existing data
3. **DO** use existing thresholds as trigger points for ceremonies
4. **DO** reference existing type definitions in new code
5. **DO NOT** duplicate calculation logic that already exists
6. **DO** add resonance/synergy bonuses as a new layer
7. **DO** respect character tiers in requirement design

---

## Integration Status (Updated 2026-02-04)

All PRD files have been updated with `INTEGRATION NOTE` sections:

| PRD | Status | Key Integration |
|-----|--------|-----------------|
| 01_CORE_TYPES_CONTRACTS | ✅ Updated | Imports from `OrbTier`, `PatternType`, `ReadinessLevel` |
| 02_PATTERN_MASTERY_RANKS | ✅ Updated | Display layer over `OrbTier` (not new tracking) |
| 03_CAREER_EXPERTISE_TIERS | ✅ Updated | Uses `TRUST_THRESHOLDS` as data source |
| 04_CHALLENGE_RATING_SYSTEM | ✅ Updated | Maps to existing `ReadinessLevel` |
| 05_STATION_BILLBOARD | ✅ Updated | Aggregates `OrbBalance.totalEarned`, trust, patterns |
| 06_SKILL_STAR_RECOGNITION | ✅ Updated | References existing `SkillCombo` system |
| 07_ASSESSMENT_ARC | ✅ Updated | Extends existing 3-phase simulations |
| 08_ELITE_STATUS_UNLOCKS | ✅ Updated | Uses loyalty experiences, trust thresholds |
| 09_VISUAL_RANK_INDICATORS | ✅ Updated | Uses `lib/animations.ts`, existing color tokens |
| 10_GENERATIONAL_COHORTS | ✅ Updated | Reads from existing state (privacy-preserving) |
| 11_SAMUELS_CEREMONIES | ✅ Updated | Triggers at existing tier thresholds |
| 12_CROSS_SYSTEM_RESONANCE | ✅ Updated | Aggregates all systems (integration layer) |

**Implementation Ready:** All PRDs now properly reference existing codebase systems.
No schema conflicts. New code should import from existing modules.

---

## Deep Analysis Addendum (2026-02-04)

**Second-pass analysis revealed additional overlaps that significantly reduce implementation scope.**

### 10. Pattern Achievements (ALREADY EXISTS - COMPLETE)
**Location:** `lib/pattern-derivatives.ts`

**14 Pattern Achievements FULLY IMPLEMENTED:**
```typescript
// Single Pattern Mastery (5 achievements)
weaver_awakened      // Analytical pattern
anchor_set           // Patience pattern
voyager_path         // Exploring pattern
harmonic_resonance   // Helping pattern
architect_vision     // Building pattern

// Diversity Achievements (4)
balanced_approach    // 2 patterns at threshold
versatile_mind       // 3 patterns at threshold
renaissance_soul     // 4 patterns at threshold
transcendent_mind    // All 5 at threshold

// Contrast Achievements (3)
analyst_and_helper   // Analytical + Helping
patient_explorer     // Patience + Exploring
thoughtful_maker     // Patience + Building
```

**PRD Impact:** Phase 2 (Pattern Mastery) proposes tracking achievements that ALREADY EXIST.
**Resolution:** PRD 02 adds DISPLAY NAMES only. Achievement tracking is 100% complete.

---

### 11. Milestone Celebrations (ALREADY EXISTS - COMPLETE)
**Location:** `lib/milestone-celebrations.ts`

**9 Celebration Types FULLY IMPLEMENTED:**
```typescript
CelebrationType =
  | 'first_meeting'      // First character interaction
  | 'trust_milestone'    // Trust reaches 5 or 10
  | 'pattern_emerging'   // Pattern hits EMERGING (3)
  | 'pattern_developing' // Pattern hits DEVELOPING (6)
  | 'pattern_flourishing'// Pattern hits FLOURISHING (9)
  | 'arc_complete'       // Story arc completion
  | 'achievement'        // Meta-achievement earned
  | 'full_trust'         // Trust reaches 10
  | 'identity_formed'    // Pattern internalization
```

**PRD Impact:** Phase 11 (Samuel's Ceremonies) proposes ceremony triggers that ALREADY FIRE.
**Resolution:** PRD 11 adds SAMUEL DIALOGUE content only. Trigger infrastructure exists.

---

### 12. IdentityCeremony Component (ALREADY EXISTS)
**Location:** `components/IdentityCeremony.tsx`

**Existing Features:**
- Full-screen ceremony presentation
- Pattern internalization dialogue
- Particle effects and animations
- Player response tracking

**PRD Impact:** Phase 11 proposes `CeremonyPresentation.tsx` component that duplicates this.
**Resolution:** PRD 11 should EXTEND `IdentityCeremony`, not create new component.

---

### 13. Skill Combo System (ALREADY EXISTS - COMPLETE)
**Location:** `lib/skill-combos.ts`, `lib/skill-combo-detector.ts`

**12 Combos FULLY IMPLEMENTED with Detection:**
```typescript
// Tier 1 (2-skill combos) - 5 total
strategic_empathy, technical_storyteller, ethical_analyst,
resilient_leader, community_architect

// Tier 2 (3-skill combos) - 5 total
innovation_catalyst, data_storyteller, cultural_bridge,
financial_mentor, adaptive_creator

// Tier 3 (4+ skill combos) - 2 total
holistic_systems_thinker, birmingham_champion
```

**Existing Functions:**
- `detectUnlockedCombos(skills)` - Returns unlocked combos
- `getComboProgress(skills, comboId)` - Progress toward combo
- `SKILL_COMBOS` - Full combo registry with requirements

**PRD Impact:** Phase 6 "Synthesis Star" (Bronze=1 combo, Gold=12 combos) tracks THE SAME DATA.
**Resolution:** Synthesis Star is pure DISPLAY LAYER. No new tracking needed.

---

### 14. Meta-Achievements (ALREADY EXISTS)
**Location:** `lib/achievements.ts`

**25+ Achievements FULLY IMPLEMENTED:**
- Pattern mastery achievements
- Relationship achievements
- Discovery achievements
- Persistence achievements

**PRD Impact:** Skill Stars "depth/breadth" criteria overlap with existing achievements.
**Resolution:** Stars should query existing achievement state, not duplicate tracking.

---

## Revised Effort Estimates

Based on deep analysis, many PRD features require DISPLAY LAYER ONLY:

| PRD | Original Estimate | Revised Estimate | Reason |
|-----|-------------------|------------------|--------|
| Phase 2 (Pattern Mastery) | 2 sprints | 0.5 sprint | Achievements exist, add display names |
| Phase 5 (Skill Stars) | 1 sprint | 0.5 sprint | Combos exist, add star display |
| Phase 6 (Assessment Arc) | 2 sprints | 1 sprint | Simulations exist, add questions |
| Phase 10 (Ceremonies) | 1.5 sprints | 0.5 sprint | Triggers exist, add Samuel dialogue |
| **Total** | 8-12 sprints | **5-7 sprints** | ~40% reduction |

---

## What's Actually NEW (Not Overlapping)

These PRD features have NO existing equivalent:

1. **Station-themed display names** (Traveler, Passenger, etc.)
2. **Samuel spoken dialogue** for ceremonies
3. **Merit point calculation** (Station Billboard)
4. **Generational cohorts** (peer comparison)
5. **Cross-system resonance** (bonus multipliers)
6. **Visual rank badges** (UI components)
7. **Unified progression dashboard**

---

## Critical Implementation Notes

1. **DO NOT create new tracking systems** - Use existing achievement/combo/celebration detection
2. **DO NOT create new ceremony components** - Extend IdentityCeremony
3. **DO create display layer modules** - Map existing data to narrative names
4. **DO create Samuel dialogue content** - Rich ceremony scripts
5. **DO create visual badge components** - New UI, existing data

---

## Deep Audit Fixes (2026-02-04)

**Source:** Deep Audit + Blindspots Fixes (v2)

### Fixes Applied

| Issue ID | Severity | Description | Fix Applied |
|----------|----------|-------------|-------------|
| P0.1 | CRITICAL | Threshold drift (0/3/6/9/15 vs 0/10/30/60/100) | Fixed: 01_CORE_TYPES_CONTRACTS.md now uses ORB_TIERS thresholds (0, 10, 30, 60, 100) with station-themed names |
| P0.2 | CRITICAL | Points storage violates computed-view principle | Fixed: Removed `points` and `lastUpdated` from PlayerRank interface, added `getRankPoints()` accessor |
| P0.3 | CRITICAL | Date.now() breaks determinism (14 instances) | Fixed: All functions now accept `now` parameter with default for production |
| P0.4 | HIGH | Character-domain mapping incomplete | Fixed: All 20 characters assigned to domains (Silas→technology, Yaquin→creative, Asha→social_impact) |
| P1.1 | HIGH | Trust threshold mismatch (6 vs 7) | Fixed: Uses `TRUST_THRESHOLDS.trusted` (6) for points, `TRUST_THRESHOLDS.close` (8) for Champion |
| P1.2 | HIGH | Career expertise math broken (max 36 < 40 threshold) | Fixed: Reduced Champion threshold from 40 to 35 |

### Files Modified

| File | Changes |
|------|---------|
| `01_CORE_TYPES_CONTRACTS.md` | Thresholds aligned to ORB_TIERS (0/10/30/60/100), PlayerRank.points removed, `now` parameter added |
| `03_CAREER_EXPERTISE_TIERS.md` | Complete character-domain mapping, trust thresholds use constants, Champion threshold reduced to 35 |
| `05_STATION_BILLBOARD.md` | `now` parameter added to `generateBillboardState()` |
| `07_ASSESSMENT_ARC.md` | `now` parameter added to `calculatePhaseScore()` |
| `10_GENERATIONAL_COHORTS.md` | Require `createdAt` (no fallback), `now` parameter added |
| `11_SAMUELS_CEREMONIES.md` | `now` parameter added to ceremony functions |
| `12_CROSS_SYSTEM_RESONANCE.md` | `now` parameter threaded through all calculations |

### Character-Domain Assignments (Complete)

| Domain | Characters (20 total) |
|--------|----------------------|
| technology (5) | maya, devon, rohan, nadia, silas |
| healthcare (3) | marcus, grace, kai |
| business (3) | quinn, dante, alex |
| creative (3) | lira, zara, yaquin |
| social_impact (6) | tess, isaiah, jordan, elena, asha |

**Excluded:** samuel (hub NPC), station_entry, grand_hall, market, deep_station (locations)

### Determinism Contract

All ranking calculations now support deterministic testing:

```typescript
// Production usage (default timestamp)
const ranks = calculateRanks(gameState)

// Test usage (fixed timestamp for reproducibility)
const fixedTime = 1700000000000
const ranks = calculateRanks(gameState, fixedTime)

// Determinism test
const result1 = calculateRanks(gameState, fixedTime)
const result2 = calculateRanks(gameState, fixedTime)
expect(result1).toEqual(result2)  // Always passes
```

### Computed View Principle

Rankings are **views** of GameState, not stored separately:

```typescript
// OLD (wrong) - stored points drift from source
interface PlayerRank {
  points: number  // ← DO NOT STORE
}

// NEW (correct) - compute on demand
function getRankPoints(gameState: GameState, category: RankCategory): number {
  // Compute from source of truth
}
```

---

## Verification Checklist

After implementation, verify:

- [ ] `npm run type-check` passes
- [ ] `npm run test:run` passes
- [ ] Pattern mastery thresholds match ORB_TIERS (0, 10, 30, 60, 100)
- [ ] All 20 characters mapped to exactly one career domain
- [ ] Trust thresholds use `TRUST_THRESHOLDS.*` constants
- [ ] Champion threshold is 35 (achievable with realistic gameplay)
- [ ] All ranking calculations accept optional `now` parameter
- [ ] No Date.now() calls in core calculation functions
