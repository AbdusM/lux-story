# Ranking Systems PRD Index

**Source Document:** `docs/Comprehensive Ranking Systems in Anime and Manga.md`
**Created:** 2026-02-04
**Updated:** 2026-02-04 (Integration Erratum)
**Framework:** Global AI Architect v7 (Ship Fast + Determinism + Perf + ISP Flex)

---

## CRITICAL: Read Integration Erratum First

**See:** `00_ERRATUM_INTEGRATION.md` for conflicts with existing systems.

The PRDs define a **presentation layer** on top of existing progression systems:
- **Existing:** Orb tiers, Pattern thresholds, Trust tiers, Skill combos
- **New:** Anime-inspired display names, ceremonies, resonance bonuses

---

## Executive Summary

This PRD series adapts proven ranking/progression systems from anime and manga for Lux Story's career exploration game. Each phase maps a specific anime mechanic to the Grand Central Terminus context while **building on top of** existing codebase systems.

**Design Philosophy:** Invisible progression → Narrative emergence → Player discovery

**Integration Principle:** New PRDs add display/ceremony layers, NOT new tracking systems

---

## Phase Overview

| Phase | PRD | Inspiration | Target System | Commits | Status |
|-------|-----|-------------|---------------|---------|--------|
| 1 | Core Types & Contracts | All | Foundation schemas | 3-5 | Pending |
| 2 | Pattern Mastery Ranks | Claymore | Visible pattern tiers | 4-6 | Pending |
| 3 | Career Expertise Tiers | Demon Slayer Hashira | Skill mastery levels | 5-7 | Pending |
| 4 | Challenge Rating System | Jujutsu Kaisen | Career-challenge matching | 4-6 | Pending |
| 5 | Station Billboard | One Punch Man | Public recognition | 3-5 | Pending |
| 6 | Skill Star Recognition | Hunter x Hunter | Contribution honors | 4-5 | Pending |
| 7 | Assessment Arc | Naruto Chunin Exam | Structured evaluation | 6-8 | Pending |
| 8 | Elite Status Unlocks | Bleach Captains | Special designations | 3-5 | Pending |
| 9 | Visual Rank Indicators | Kill la Kill | UI/UX elements | 4-6 | Pending |
| 10 | Generational Cohorts | Claymore | Peer comparison | 3-4 | Pending |
| 11 | Samuel's Ceremonies | Original | Recognition moments | 3-4 | Pending |
| 12 | Cross-System Resonance | All | Integration layer | 4-6 | Pending |

---

## Mapping: Anime Systems → Lux Story

| Anime System | Key Mechanic | Lux Story Adaptation |
|--------------|--------------|---------------------|
| **Claymore No. 1-47** | Static generational ranks, numeric clarity | Pattern mastery tiers, cohort comparison |
| **Naruto Genin→Kage** | Exam-based advancement, multi-phase tests | Assessment arcs, skill demonstrations |
| **Bleach Gotei 13** | Division structure, Bankai prerequisite | Career expertise gates, mastery requirements |
| **One Punch Man Classes** | Public rankings, merit points, satire | Station Billboard, point accumulation |
| **Demon Slayer Corps** | Traditional naming, Hashira elite tier | Career mastery naming, elite recognition |
| **Jujutsu Kaisen Grades** | Parallel hero/threat grades, formal process | Challenge-career matching, bureaucratic feel |
| **Hunter x Hunter Stars** | Contribution-based honors, mentorship | Skill star system, teaching recognition |
| **Kill la Kill Uniforms** | Visual power indicators, social stratification | UI rank badges, visual progression |
| **Code Geass Knights** | Elite numbered order, special privileges | Station Knights, special access unlocks |

---

## Existing Systems Integration (CRITICAL)

**PRDs add DISPLAY LAYER on top of existing systems. Do NOT replace them.**

| Existing System | Location | Data Used By PRDs |
|-----------------|----------|-------------------|
| **Orb System** | `lib/orbs.ts` | `OrbTier`, `totalEarned`, `OrbBalance` |
| **Orb Tiers** | nascent(0)→mastered(100) | Pattern Mastery display names |
| **Pattern Thresholds** | EMERGING=3, DEVELOPING=6, FLOURISHING=9 | Ceremony trigger points |
| **Pattern Unlocks** | 15 at 10%/50%/85% fill | Visual rank indicators |
| **Trust Tiers** | stranger(0)→bonded(10) | Elite Status requirements |
| **Voice Tones** | whisper/speak/urge/command | Ceremony intensity |
| **Skill Combos** | 12 combos (Tier 1/2) | Skill Stars completion |
| **Character Tiers** | 1-4 with content targets | Elite requirements vary |
| **Info Value Tiers** | common→legendary | Discovery tracking |
| **Readiness Levels** | exploratory→ready | Challenge Rating mapping |
| **Simulations** | 3-phase (5/20 complete) | Assessment extension |
| **Loyalty Experiences** | 20/20 defined | Elite unlock gates |

**Key Files:**
- `lib/orbs.ts` - Orb earning and tiers
- `lib/patterns.ts` - Pattern definitions and thresholds
- `lib/constants.ts` - Trust thresholds
- `lib/skill-combos.ts` - Skill combination definitions
- `lib/character-tiers.ts` - Character tier assignments

---

## Implementation Principles

1. **Ship Fast:** Each phase is 3-7 commits, independently deployable
2. **Determinism:** Explicit thresholds, no RNG in advancement
3. **Performance:** <16ms render, <50ms state updates
4. **Contracts:** Typed schemas, version-controlled, test-gated
5. **Two-Lane:** Stable lane (production), Experimental (feature-flagged)

---

## Performance Budgets (All Phases)

| Metric | Budget |
|--------|--------|
| Rank calculation | <5ms |
| UI rank display | <16ms/frame |
| Rank change animation | <300ms |
| Storage per user | <50KB ranking data |
| API payload (if any) | <5KB |

---

## File Structure

```
docs/PRD_RANKING_SYSTEMS/
├── 00_INDEX.md                    (this file)
├── 00_ERRATUM_INTEGRATION.md      (CRITICAL: read before implementing)
├── 01_CORE_TYPES_CONTRACTS.md
├── 02_PATTERN_MASTERY_RANKS.md
├── 03_CAREER_EXPERTISE_TIERS.md
├── 04_CHALLENGE_RATING_SYSTEM.md
├── 05_STATION_BILLBOARD.md
├── 06_SKILL_STAR_RECOGNITION.md
├── 07_ASSESSMENT_ARC.md
├── 08_ELITE_STATUS_UNLOCKS.md
├── 09_VISUAL_RANK_INDICATORS.md
├── 10_GENERATIONAL_COHORTS.md
├── 11_SAMUELS_CEREMONIES.md
└── 12_CROSS_SYSTEM_RESONANCE.md
```

---

## Quick Start

1. **READ `00_ERRATUM_INTEGRATION.md` FIRST** (existing system conflicts)
2. Read `01_CORE_TYPES_CONTRACTS.md` (foundation)
3. Phase 2-6 can be developed in parallel (independent display systems)
4. Phase 7-8 require Phase 2-6 completion
5. Phase 9-12 are polish/integration layers

**IMPORTANT:** These PRDs add display/ceremony layers. All tracking uses existing systems.

---

## Revision History

| Date | Change | Author |
|------|--------|--------|
| 2026-02-04 | Initial creation, all 12 phases outlined | Claude |
| 2026-02-04 | Added ERRATUM: Existing systems integration reconciliation | Claude |
