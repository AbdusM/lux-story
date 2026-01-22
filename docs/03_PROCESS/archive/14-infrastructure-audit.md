# Infrastructure Audit - January 6, 2026

**Purpose:** Identify what's built vs what needs building
**Key Finding:** Many "derivative features" already have infrastructure - the gap is CONTENT and WIRING, not CODE.

---

## Executive Summary

The codebase has sophisticated infrastructure that is **underutilized**:

| Category | Built | Used | Gap |
|----------|-------|------|-----|
| Pattern-Trust Resonance | ✅ Full | ✅ Active | None |
| Voice Variations (choice text) | ✅ Full | ❌ 0 uses | Content needed |
| Required Orb Fill (locked choices) | ✅ Full | ❌ 0 uses | Content needed |
| Pattern Reflections (NPC dialogue) | ✅ Full | ⚠️ 75 uses | More content |
| Pattern Unlocks (dialogue branches) | ✅ Full | ❌ Not wired | Game loop wiring |
| Consequence Echo Intensity | ✅ Full | ✅ Active | None |
| Resonance Descriptions | ✅ Full | ⚠️ Logged only | UI display needed |

---

# SECTION A: FULLY IMPLEMENTED & ACTIVE

These systems work end-to-end.

## A1. Pattern-Trust Resonance System

**Location:** `lib/pattern-affinity.ts`, `lib/character-state.ts`

**What it does:**
- Each character has primary/secondary/neutral/friction patterns
- Trust changes are multiplied based on player's dominant pattern:
  - Primary: 1.5x (+50%)
  - Secondary: 1.25x (+25%)
  - Neutral: 1.0x
  - Friction: 0.75x (-25%)

**Characters configured:** 12/16
- maya, samuel, devon, tess, marcus, rohan, yaquin, jordan, kai, alex, silas

**Status:** ✅ ACTIVE - Called in `GameStateUtils.applyStateChange()`

**No action needed.**

---

## A2. Pattern-Based Choice Colors

**Location:** `lib/patterns.ts`, `components/game/game-choice.tsx`

**What it does:**
- Choices with `pattern` field get colored glow matching pattern
- Uses `getPatternColor()` for consistent coloring

**Status:** ✅ ACTIVE - Visible in gameplay

**No action needed.**

---

## A3. Consequence Echo Intensity

**Location:** `lib/consequence-echoes.ts`

**What it does:**
- Trust changes trigger character-specific dialogue echoes
- Intensity levels: subtle (±1), noticeable (±2), significant (±3+)
- All 16 characters have trustUp/trustDown/patternRecognition echoes

**Status:** ✅ ACTIVE - `getConsequenceEcho()` used in game loop

**No action needed.**

---

## A4. Pattern Reflections (NPC Dialogue Adaptation)

**Location:** `lib/dialogue-graph.ts` (type), content files

**What it does:**
- NPC dialogue changes based on player's dominant pattern
- Defined at `DialogueContent.patternReflection` or `DialogueNode.patternReflection`

**Current usage:** 75 occurrences across 15 dialogue files

**Status:** ✅ ACTIVE but could use MORE content

| Character | Uses | Opportunity |
|-----------|------|-------------|
| Samuel | 13 | Good coverage |
| Maya | 10 | Good coverage |
| Devon | 7 | Good coverage |
| Tess | 7 | Good coverage |
| Kai | 7 | Good coverage |
| Rohan | 6 | Good coverage |
| Jordan | 5 | Adequate |
| Elena | 5 | Adequate |
| Yaquin | 4 | Could expand |
| Silas | 3 | Could expand |
| Grace | 3 | Could expand |
| Zara | 2 | Needs expansion |
| Alex | 1 | Needs expansion |
| Lira | 1 | Needs expansion |
| Marcus | 1 | Needs expansion |
| Asha | 0 | Missing! |

---

# SECTION B: BUILT BUT UNUSED

Infrastructure exists but no content uses it.

## B1. Voice Variations (Player Choice Text Adaptation)

**Location:** `lib/dialogue-graph.ts` line 230-238

**What it does:**
- Choice text changes based on player's dominant pattern
- Same meaning, different phrasing

**Type definition:**
```typescript
voiceVariations?: Partial<Record<PatternType, string>>
// Example:
// voiceVariations: {
//   analytical: "Walk me through the details.",
//   helping: "That sounds hard. What happened?",
//   patience: "Take your time. I'm listening."
// }
```

**Current usage:** 0 occurrences in any dialogue file

**Opportunity:**
- HUGE impact with LOW effort
- Makes player feel their identity is recognized
- Add to key narrative moments (5-10 per character)

**Estimated work:** Content authoring only (no code changes)

---

## B2. Required Orb Fill (KOTOR-Style Locked Choices)

**Location:** `lib/dialogue-graph.ts` line 260-267

**What it does:**
- Choice visible but grayed out until pattern level met
- Creates aspirational choices that encourage pattern investment

**Type definition:**
```typescript
requiredOrbFill?: {
  pattern: PatternType
  threshold: number // 0-100 fill percentage
}
```

**Current usage:** 0 occurrences in any dialogue file

**Opportunity:**
- Creates meaningful "unlock" moments
- Rewards pattern investment
- Add to loyalty experiences and deep dialogue branches

**Estimated work:** Content authoring + UI verification

---

## B3. Pattern Unlocks (Dialogue Branch Unlocks)

**Location:** `lib/pattern-affinity.ts` line 36-41, 89-108

**What it does:**
- At specific pattern thresholds, unlock special dialogue nodes
- E.g., Maya invites you to workshop at Building 40%

**Configuration exists for:**
- Maya: 3 unlocks (building 40/70, analytical 50)
- Devon: 2 unlocks (analytical 40, patience 60)
- Tess: 2 unlocks (building 50, analytical 40)
- Marcus: 2 unlocks (helping 40, patience 50)
- Rohan: 2 unlocks (patience 50, exploring 60)
- Yaquin: 2 unlocks (exploring 40, patience 50)
- Jordan: 3 unlocks (exploring 40/70, helping 50)
- Kai: 3 unlocks (building 40/70, analytical 50)
- Alex: 2 unlocks (exploring 40, building 50)
- Silas: 3 unlocks (analytical 40/70, patience 50)

**Problem:** `getPatternUnlocks()` function exists but isn't called in game loop!

**Estimated work:**
- Wire up check in dialogue navigation
- Ensure target nodes exist in dialogue graphs
- Low code complexity, medium content verification

---

# SECTION C: PARTIALLY IMPLEMENTED

Some pieces exist, others don't.

## C1. Resonance Descriptions (Player Feedback)

**Location:** `lib/pattern-affinity.ts`

**What's built:**
- `calculateResonantTrustChange()` returns `resonanceDescription`
- Rich descriptions for each character-pattern pair

**What's missing:**
- Description is logged but NOT shown to player
- No UI component to display resonance feedback

**Opportunity:**
- Show subtle feedback when resonance affects trust
- "Maya sees a kindred maker spirit in you" (on trust gain with building pattern)

**Estimated work:**
- Add optional resonance display to consequence echo system
- Medium complexity (UI + game loop integration)

---

## C2. Discovery Hints (Vulnerability Foreshadowing)

**Location:** `lib/consequence-echoes.ts` line 1034-1080

**What's built:**
- `DISCOVERY_HINTS` for maya (3 vulnerabilities) and devon (1 vulnerability)
- `getDiscoveryHint()` function
- Trust-range gating (hints appear at specific trust levels)

**What's missing:**
- Only 2 characters have hints (need 14 more)
- Function may not be called in game loop

**Estimated work:**
- Content authoring for remaining characters
- Verify game loop integration

---

## C3. Resonance Echoes (Pattern-Character Moments)

**Location:** `lib/consequence-echoes.ts` line 946-1008

**What's built:**
- `RESONANCE_ECHOES` for maya, devon, samuel only
- high/secondary/friction variants

**What's missing:**
- 13 characters need resonance echoes
- `getResonanceEcho()` may not be called

**Estimated work:**
- Content authoring for remaining characters
- Verify game loop integration

---

# SECTION D: NOT IMPLEMENTED

Features that need new code.

## D1. Trust Decay Influenced by Pattern

**What's envisioned:** Patience pattern = slower trust decay

**Current state:**
- Trust decay exists (`lib/character-state.ts`)
- No pattern influence on decay rate

**Estimated work:**
- Modify decay calculation in state utils
- Low-medium complexity

---

## D2. Pattern-Gated Trust Content

**What's envisioned:** Content requires BOTH Trust 8+ AND Pattern 6+

**Current state:**
- `StateCondition` supports both `trust` and `patterns` ranges
- **Infrastructure exists!** Just needs content using it.

**Estimated work:**
- Content authoring only
- Add `requiredState: { trust: { min: 8 }, patterns: { analytical: { min: 6 } } }`

---

## D3. Pattern Voice Conflicts

**What's envisioned:** Internal voices disagree, forcing player choice

**Current state:**
- Pattern voices exist and are active
- No conflict mechanic

**Estimated work:**
- New UI component for voice conflicts
- Game logic for triggering conflicts
- Medium-high complexity

---

# PRIORITY MATRIX (Revised)

Based on audit findings, priorities shift from "build features" to "use what's built":

## Tier 1: Content Authoring (No Code Changes)

| Task | Impact | Effort | Files |
|------|--------|--------|-------|
| Add voice variations to key choices | HIGH | LOW | content/*-dialogue-graph.ts |
| Add requiredOrbFill to aspirational choices | HIGH | LOW | content/*-dialogue-graph.ts |
| Add pattern reflections to shallow characters | MEDIUM | LOW | Asha, Zara, Alex, Lira, Marcus |
| Add pattern-gated trust content | MEDIUM | LOW | content/*-dialogue-graph.ts |

## Tier 2: Wiring (Low Code, High Impact)

| Task | Impact | Effort | Files |
|------|--------|--------|-------|
| Wire up pattern unlocks in game loop | HIGH | MEDIUM | Navigation/state components |
| Show resonance descriptions in UI | MEDIUM | MEDIUM | Consequence echo components |
| Verify discovery hints are triggered | MEDIUM | LOW | Game loop integration |

## Tier 3: Content Expansion (Medium Effort)

| Task | Impact | Effort | Files |
|------|--------|--------|-------|
| Add discovery hints for 14 characters | MEDIUM | MEDIUM | lib/consequence-echoes.ts |
| Add resonance echoes for 13 characters | MEDIUM | MEDIUM | lib/consequence-echoes.ts |
| Add pattern affinities for 4 missing chars | MEDIUM | LOW | lib/pattern-affinity.ts |

## Tier 4: New Features (Higher Effort)

| Task | Impact | Effort | Files |
|------|--------|--------|-------|
| Pattern-influenced trust decay | MEDIUM | MEDIUM | lib/character-state.ts |
| Pattern voice conflicts | HIGH | HIGH | New components |
| Thought Cabinet system | HIGH | HIGH | New system |

---

# RECOMMENDED FIRST ACTIONS

## Week 1: Content Authoring Sprint

1. **Add voice variations to 50 key choices**
   - Focus on: Samuel, Maya, Devon, Jordan (deep characters)
   - 12-15 choices per character with 3-4 voice variants each

2. **Add requiredOrbFill to 20 aspirational choices**
   - Lock deep dialogue behind pattern investment
   - Focus on vulnerability arcs and loyalty experiences

3. **Expand pattern reflections in shallow characters**
   - Asha: Add 5+ pattern reflections
   - Zara, Alex, Lira, Marcus: Add 3+ each

## Week 2: Wiring Sprint

1. **Wire pattern unlocks into game loop**
   - Call `getPatternUnlocks()` during navigation
   - Verify target nodes exist

2. **Add resonance description display**
   - Show in consequence echo or as subtle toast

3. **Verify discovery hints are working**
   - Test Maya and Devon flows
   - Debug if not triggering

---

**Generated:** January 6, 2026
**Key Insight:** The gap is CONTENT and WIRING, not CODE.
