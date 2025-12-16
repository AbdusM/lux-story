# Choice Consequence Philosophy
## Grand Central Terminus - Design System Document

*Created: December 15, 2025*
*Status: Strategic Architecture Document*

---

## Executive Summary

Deep audit revealed **three parallel tracking systems** with vastly different levels of manifestation:

| System | Tracked | Manifests | Ratio |
|--------|---------|-----------|-------|
| **Trust** | 289 changes | Clear gates, status changes | 100% |
| **Patterns** | 1,142 choices | ~50 acknowledgments | 4% |
| **Skills** | 905 attributions | 0 gameplay impact | 0% |
| **Transform Flags** | 14 flags | 0 checks | 0% |

**Core Problem**: We're tracking far more than we're delivering. This creates "invisible value" that violates our design commandments.

---

## The Four Systems

### 1. Trust System ✅ WORKING

**What it does right:**
- Trust changes (289 instances) → visible relationship status
- Gates dialogue choices via `visibleCondition: { trust: { min: X } }`
- Unlocks character quirks progressively
- Enables arc progression and deeper conversations

**Dependencies:**
```
trustChange in choice
  → characterRelationships[character].trust updates
    → relationshipStatus recalculates ('stranger'/'acquaintance'/'confidant')
      → minTrust gates evaluate
        → content unlocks
```

**Safe to modify:** YES - each trust change has local effect, no cascading risk

---

### 2. Pattern System ⚠️ PARTIALLY WORKING

**What it does:**
- 1,142 pattern attributions across choices
- Stored in `GameState.patterns` (5 dimensions)
- Used by Journey Summary for archetype/career insights
- ~50 pattern-gated choices and NPC reflections exist

**What's missing:**
- 96% of pattern-expressing choices get zero acknowledgment
- NPCs rarely comment on player's emerging patterns
- Voice variations (pattern-specific dialogue) underutilized
- Patterns invisible until end-game summary

**Dependencies:**
```
pattern in choice
  → GameState.patterns[type] increments
    → getDominantPattern() calculates
      → Journey Summary generates archetype
      → Pattern-gated content checks (sparse)
      → Career insights generated
```

**Safe to modify:** CAREFUL - patterns affect Journey Summary. Adding more manifestation is safe. Removing patterns breaks summary.

---

### 3. Skills System ❌ NOT WORKING

**The problem:**
- 905 skill attributions in choices
- Skills are NOT stored in GameState
- No gameplay impact whatsoever
- Pure metadata for potential analytics

**What exists:**
```typescript
// In dialogue choices:
skills: ['emotionalIntelligence', 'communication']

// In GameState:
patterns: PlayerPatterns  // EXISTS
skills: ???               // DOES NOT EXIST
```

**Why this happened:**
- Skills appear to be aspirational future feature
- Framework (WEF 2030 skills) was designed but never wired up
- Choice authors added skills to choices but no system consumes them

**Safe to modify:** YES - skills are disconnected, removing them breaks nothing

---

### 4. Transformation Flags ❌ NOT WORKING

**The problem:**
- 14 granular flags defined in `character-depth.ts`
- Examples: `maya_imposter_resolved`, `devon_human_connection`
- Flags are SET but never CHECKED
- Separate from working `*_arc_complete` flags

**What exists:**
```typescript
// In character-depth.ts:
globalFlagsSet: ['maya_imposter_resolved', 'maya_growth_engineering']

// In graph-registry.ts - only checks arc completion:
gameState.globalFlags.has('maya_arc_complete')  // ✅ WORKS
gameState.globalFlags.has('maya_imposter_resolved')  // ❌ NEVER CHECKED
```

**Safe to modify:** YES - granular flags are dead code, removing them breaks nothing

---

## Dependency Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    PLAYER CHOICE                                │
│                         │                                       │
│    ┌────────────────────┼────────────────────┐                  │
│    ▼                    ▼                    ▼                  │
│ ┌──────┐          ┌──────────┐         ┌─────────┐              │
│ │TRUST │          │ PATTERN  │         │ SKILLS  │              │
│ │ +1   │          │ helping  │         │ [dead]  │              │
│ └──┬───┘          └────┬─────┘         └─────────┘              │
│    │                   │                                        │
│    ▼                   ▼                                        │
│ ┌──────────────┐  ┌────────────┐                                │
│ │ RELATIONSHIP │  │  PATTERNS  │                                │
│ │    STATUS    │  │   STATE    │                                │
│ └──────┬───────┘  └─────┬──────┘                                │
│        │                │                                       │
│   ┌────┴────┐      ┌────┴────┐                                  │
│   ▼         ▼      ▼         ▼                                  │
│ ┌─────┐ ┌──────┐ ┌──────┐ ┌─────────┐                           │
│ │GATES│ │QUIRKS│ │SUMMARY│ │CAREER   │                          │
│ │(47) │ │(40+) │ │(arch) │ │INSIGHTS │                          │
│ └─────┘ └──────┘ └──────┘ └─────────┘                           │
│                                                                 │
│  ✅ TRUST PATH: Fully connected                                 │
│  ⚠️ PATTERN PATH: Connected but underutilized mid-game          │
│  ❌ SKILLS: Disconnected completely                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## The Core Design Tension

**Philosophy A: Silent Tracking for End Revelation**
- Track patterns silently, reveal in Journey Summary
- "The magic of being understood without asking"
- Risk: Player feels manipulated, choices seem meaningless

**Philosophy B: Continuous Acknowledgment**
- NPCs constantly reflect player patterns
- "You really are a helper, aren't you?"
- Risk: Feels game-y, breaks immersion, reduces discovery

**Philosophy C: Milestone Acknowledgment (RECOMMENDED)**
- Silent tracking with periodic revelations
- Samuel (hub character) reflects patterns at trust thresholds
- Characters acknowledge patterns at arc climax moments
- Journey Summary provides comprehensive revelation
- Balance: ~20% acknowledgment rate (currently 4%)

---

## Long-Term Resolution Plan

### Phase 1: Clean the Dead Code (Safe - No Gameplay Impact)

**Actions:**
1. Remove `skills` from choice interfaces OR wire up skills system
2. Remove granular transformation flags OR implement growth tracking
3. Decision needed: Are skills a future feature or delete?

**Risk:** ZERO - these systems are disconnected

**Dependencies affected:** None

---

### Phase 2: Increase Pattern Manifestation (Safe - Additive)

**Target:** Increase from 4% to 20% acknowledgment rate

**Where to add pattern reflection:**

1. **Samuel Hub Conversations** (highest value)
   - Samuel should comment on emerging patterns every 2-3 conversations
   - "You've been asking a lot of 'why' questions. That analytical mind of yours..."
   - Add to existing Samuel nodes, don't create new ones

2. **Character Arc Midpoints** (medium value)
   - Each character's Scene 2 or 3 should acknowledge dominant pattern
   - "You're not like most people who come through here. You actually listen."
   - Add `patternReflection` arrays to key emotional moments

3. **Crossroads Decisions** (high value)
   - Pattern-aware framing of final choices
   - Different emphasis based on player's journey

**Risk:** LOW - additive changes, doesn't break existing flow

**Dependencies affected:** None (adding to existing system)

**Implementation approach:**
```typescript
// Add to key dialogue nodes:
content: [{
  text: "Base dialogue text",
  patternReflection: [
    { pattern: 'analytical', minLevel: 4, altText: "Pattern-aware variant" },
    { pattern: 'helping', minLevel: 4, altText: "Different variant" }
  ]
}]
```

---

### Phase 3: Fix Fake Choices (Medium Risk - Requires Testing)

**Target:** Reduce same-destination choices from ~40 to ~10

**Safe approach:**
1. Create new intermediate nodes (doesn't break existing paths)
2. Update choice `nextNodeId` to new nodes
3. New nodes eventually route to original destination
4. Test each change in isolation

**Risk:** MEDIUM - changing `nextNodeId` affects game flow

**Dependencies affected:**
- `getGraphForCharacter()` routing
- Save game compatibility (node IDs in saved progress)
- Test coverage may need updates

**Mitigation:**
- Never rename existing nodeIds (breaks saves)
- Only ADD new nodes, don't delete old ones
- Old nodes can remain as fallbacks

---

### Phase 4: Design Validation System (Preventive)

**Build-time validation script to catch:**

1. **Same-destination clusters**
   - Flag when 2+ choices in same node share `nextNodeId`
   - Exclude explicit `[Continue]` choices

2. **Orphaned nodes**
   - Nodes that exist but no choice routes to them

3. **Dead-end nodes**
   - Nodes with no choices that aren't marked as endings

4. **Pattern imbalance**
   - Warn if one pattern has <15% of attributions

5. **Trust gates too high**
   - Warn if content requires trust > 8 without path to reach it

**Implementation:** Add to `scripts/validate-dialogue-graphs.ts`

---

## The Choice Contract

Every choice in Grand Central Terminus makes this promise:

### What Every Choice MUST Do:
1. **Lead somewhere different** OR **Get different acknowledgment**
2. Track exactly ONE pattern (no ambiguity)
3. Have clear emotional intent (tone)

### What Choices SHOULD Do:
4. Build trust when player engages authentically
5. Demonstrate skills (if we keep skills system)
6. Feel true to player's expressed intention

### What Choices MUST NOT Do:
- Promise exploration then railroad
- Track skills/patterns that never manifest
- Set flags that are never checked
- Offer false urgency or agency

---

## Decision Points Needed

### Decision 1: Skills System
**Options:**
- A) Delete skills from all choices (simplify)
- B) Wire up skills tracking + display in Journey Summary (expand)
- C) Keep as analytics-only, remove from choice interface (hidden)

**Recommendation:** Option A (Delete) unless there's a concrete plan for skills

### Decision 2: Transformation Flags
**Options:**
- A) Delete granular flags, keep only `*_arc_complete`
- B) Implement growth tracking system that uses granular flags

**Recommendation:** Option A (Delete) - simpler system, same player value

### Decision 3: Pattern Acknowledgment Rate
**Options:**
- A) Keep at 4% (silent tracking philosophy)
- B) Increase to 20% (milestone acknowledgment)
- C) Increase to 50%+ (continuous acknowledgment)

**Recommendation:** Option B (20%) - balanced approach

---

## Implementation Priority

| Priority | Action | Risk | Effort | Value |
|----------|--------|------|--------|-------|
| 1 | Fix Samuel intro (done) | Low | Low | High |
| 2 | Add pattern reflection to Samuel | Low | Medium | High |
| 3 | Fix Yaquin creator path | Low | Low | Medium |
| 4 | Build validation script | None | Medium | High |
| 5 | Add pattern reflection to arc midpoints | Low | Medium | Medium |
| 6 | Decide on skills system | None | Low | Medium |
| 7 | Clean dead flags | None | Low | Low |

---

## Appendix: Files to Modify

### For Pattern Reflection:
- `content/samuel-dialogue-graph.ts` - Hub character, most value
- `content/maya-dialogue-graph.ts` - Scene 2/3 emotional moments
- `content/devon-dialogue-graph.ts` - Technical/emotional balance
- `content/tess-dialogue-graph.ts` - Identity reflection moments

### For Fake Choice Fixes:
- `content/yaquin-dialogue-graph.ts` - Creator path (critical)
- `content/alex-dialogue-graph.ts` - Hype cycle (high)
- `content/tess-dialogue-graph.ts` - Backstory (high)

### For Validation:
- `scripts/validate-dialogue-graphs.ts` - Add new checks
- `package.json` - Add to build process

### For Cleanup (if decided):
- All `content/*-dialogue-graph.ts` - Remove `skills` arrays
- `content/character-depth.ts` - Remove granular flags
- `lib/dialogue-graph.ts` - Update interfaces

---

*This document should be reviewed before making structural changes to the dialogue system.*
