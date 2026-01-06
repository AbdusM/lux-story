# Gap Analysis: Competitive Focus (Deep Audit)
**December 16, 2024 - Stringent Review of 110 Documentation Files**

---

## What We're Competing On (From CLAUDE.md)

1. **Feel Comes First** - Game feels good within 30 seconds
2. **Dialogue-Driven Immersion** - Everything stays narrative
3. **Meaningful Choices** - Every decision has visible consequences
4. **Show, Don't Tell** - Discovery through gameplay
5. **Pattern Self-Discovery** - Learn who you are through choices

---

## Documentation Reviewed

| Sprint | Files | Key Docs |
|--------|-------|----------|
| 01_Sprint1 | 45 | Historical, mostly archived |
| 00_Sprint2 | 2 | Half-Life opening, planning |
| 13DECSprint | 14 | Game design principles, Pokemon/Disco analysis |
| 14DECSprint | 12 | Master roadmap, bloat audit, implementation |
| Root docs | 37 | Design principles, audits, philosophies |

**Total: 110 markdown files, ~25,000 lines of documentation**

---

## Systems Status: What's Actually Implemented

| System | Documentation | Implementation | Gap |
|--------|--------------|----------------|-----|
| Trust | 289 changes tracked | 100% manifests | NONE |
| Patterns | 1,142 choices | 4% acknowledged | CRITICAL |
| Identity Offering | Detailed spec | ✅ IMPLEMENTED | NONE |
| Session Boundaries | Week 3 plan | ⚠️ IN PROGRESS | ACTIVE |
| Skills | 905 attributions | 0% impact | DEAD CODE |
| Transform Flags | 14 flags | 0% checked | DEAD CODE |
| Failure Paths | Week 4 plan | NOT STARTED | PLANNED |
| Orb Unlocks | Detailed spec | NOT IMPLEMENTED | CRITICAL |

---

## CRITICAL GAP #1: Pattern Acknowledgment (4% → 20%)

### What Documentation Says
- **03-critical-gaps-analysis.md**: "70% of choices have zero immediate feedback"
- **CHOICE_CONSEQUENCE_PHILOSOPHY.md**: "We're tracking far more than we're delivering"
- **Sid Meier Rule**: "The worst thing you can do is just move on"

### Current Reality
```
Tracked: 1,142 pattern-expressing choices
Acknowledged: ~50 NPC reflections
Ratio: 4%
```

### What Should Happen
```
Player makes analytical choice
    ↓
ProgressToast: "+1 Analytical" ← REMOVED (today's work)
Journal glow: Pulses ← IMPLEMENTED (today's work)
Samuel echo: "Pattern forming" ← IMPLEMENTED (firstOrb)
Character notices: "You think things through" ← 4% RATE (TOO LOW)
```

### Target
**20% acknowledgment rate** - Milestone acknowledgment, not continuous

### Implementation (From CHOICE_CONSEQUENCE_PHILOSOPHY.md)
1. Samuel Hub: Comment on patterns every 2-3 conversations
2. Character Arc Midpoints: Scene 2/3 acknowledges dominant pattern
3. Crossroads Decisions: Pattern-aware framing of final choices

**Status:** NOT DONE - needs content writing
**Effort:** 1-2 days of dialogue writing

---

## CRITICAL GAP #2: Orbs Don't Unlock Anything

### What Documentation Says
- **PROGRESSION_SYSTEM_REDESIGN.md**: "Orbs just numbers. No filling visualization. Nothing unlocks."
- **Comparison**: Diablo/Persona/Genshin all have concrete unlocks

### Current Reality
```
Player earns 50 analytical orbs
    ↓
Number goes up in Journal
    ↓
Samuel says something nice
    ↓
???
```

### What Should Happen
```
5 orbs → "Read Between Lines" ability (see subtext hints)
10 orbs → "Pattern Recognition" (spot hidden patterns)
20 orbs → "Deep Analysis" (unlock analytical dialogue options)
```

### Target
**Concrete narrative unlocks at thresholds** - Not just acknowledgment

### Implementation (From PROGRESSION_SYSTEM_REDESIGN.md)
1. Add `PatternUnlocks` type to lib/orbs.ts
2. Create unlock checking logic
3. Add Abilities tab to Journal
4. Tag dialogue choices with unlock requirements

**Status:** NOT DONE - major feature
**Effort:** 1-2 weeks

---

## CRITICAL GAP #3: Failure Entertainment

### What Documentation Says
- **03-critical-gaps-analysis.md**: "Disco Elysium's funniest moments come from FAILING"
- **00_MASTER_IMPLEMENTATION_ROADMAP.md**: "Week 4: Failure Entertainment Paths"

### Current Reality
```
[LOCKED 🔒] Requires Building 40%
"Help Maya debug her robot"

Player with Building 15%:
  → Gets LESS content
  → Feels punished
```

### What Should Happen
```
High Building (40%): Technical scene, you're competent
Low Building (15%): "Circuits were never your thing"
  → Hold components while Maya works
  → Different trust path, equally valuable
```

### Target
**Every build gets full content, different flavors**

### Implementation
1. Audit all trust/pattern-gated choices (find top 20)
2. Design alternative branches for each
3. Implement 5-8 nodes per alternative path
4. Test low-pattern playthrough

**Status:** PLANNED for Week 4
**Effort:** 32 hours (4 days)

---

## DEAD CODE: Skills System (Remove or Wire Up)

### What Documentation Says
- **CHOICE_CONSEQUENCE_PHILOSOPHY.md**: "905 skill attributions, 0% impact, pure metadata"
- **BLOAT_AUDIT.md**: "Skills appear to be aspirational future feature"

### Current Reality
```typescript
// In dialogue choices:
skills: ['emotionalIntelligence', 'communication']

// In GameState:
patterns: PlayerPatterns  // EXISTS
skills: ???               // DOES NOT EXIST
```

### Decision Needed
- **Option A:** Delete skills from all choices (simplify)
- **Option B:** Wire up skills tracking + Journey Summary (expand)
- **Option C:** Keep as analytics-only, remove from interface (hidden)

**Recommendation:** Option A (Delete) - 905 lines of dead metadata

---

## DEAD CODE: Bloat Cleanup (6,726 lines)

### From BLOAT_AUDIT.md

| File | Lines | Status |
|------|-------|--------|
| scene-skill-mappings.ts | 2,183 | DUPLICATE - delete |
| crossroads-system.ts | 1,272 | UNUSED - delete |
| character-quirks.ts | 1,394 | CONTENT - move to /content |
| character-depth.ts | 1,310 | CONTENT - move to /content |
| birmingham-opportunities.ts | 567 | DATA - move to /content |

**Total Immediate Cleanup:** 6,726 lines

### Phase 2 (Investigate)
- skill-tracker.ts (1,075 lines) - Is 1,075 lines needed?
- comprehensive-user-tracker.ts (739 lines) - Duplicates PostHog?
- engagement-quality-analyzer.ts (580 lines) - Necessary?

**Total Potential:** 8,000-10,000 lines (30-40% of /lib)

---

## WHAT'S WORKING (Don't Touch)

### From Documentation Consensus

| Feature | Status | Evidence |
|---------|--------|----------|
| Trust System | ✅ 100% | 289 changes, all manifest |
| Consequence Echoes | ✅ Working | Creates "seen" feeling |
| Dialogue Quality | ✅ A-grade | Character voice, emotional depth |
| Journey Summary | ✅ Excellent | Payoff for completers |
| Identity Offering | ✅ IMPLEMENTED | +20% bonus at threshold 5 |
| UI Consolidation | ✅ DONE TODAY | 13 → 7 active elements |
| Discovery Learning | ✅ DONE TODAY | Samuel teaches via echo |

---

## WHAT'S EXPLICITLY DEPRIORITIZED

### From Documentation

| Feature | Why Skip | Source |
|---------|----------|--------|
| Character Intersection | 2 weeks, Tier 3 | 03-critical-gaps |
| Pattern Voices (Disco) | 2 weeks, Tier 3 | 03-critical-gaps |
| Narrative Scarcity | 1 week+, wrong for career exploration | 03-critical-gaps |
| Social Features | Dilutes focus | Multiple docs |
| Full Soundtrack | 9 sounds enough | 07-pokemon-design |

---

## PRIORITY MATRIX (Updated)

### P0: This Week

| Gap | Status | Effort | Action |
|-----|--------|--------|--------|
| Session Boundaries | IN PROGRESS | Week 3 | Complete current work |
| Failure Entertainment | PLANNED | Week 4 | Start after boundaries |

### P1: This Sprint (After Week 4)

| Gap | Documentation | Effort | Action |
|-----|---------------|--------|--------|
| Pattern Acknowledgment 4%→20% | CHOICE_CONSEQUENCE | 1-2 days | Add Samuel/character reflections |
| Bloat Cleanup Phase 1 | BLOAT_AUDIT | 4 hours | Delete 3,455 lines, move 3,271 |

### P2: Next Sprint

| Gap | Documentation | Effort | Action |
|-----|---------------|--------|--------|
| Orb Unlocks (concrete rewards) | PROGRESSION_REDESIGN | 1-2 weeks | Major feature |
| Skills Decision | CHOICE_CONSEQUENCE | 2 hours | Delete or wire up |

### P3: Future (Not Now)

| Gap | Why Wait |
|-----|----------|
| Pattern Voices | Expensive, sensations sufficient |
| Character Intersection | Characters work solo |
| Narrative Scarcity | Wrong for career exploration |

---

## Documentation Cleanup Recommended

### Archive (Historical Value Only)
- All of `01_Sprint1/` - Sprint 1 complete
- `DIALOGUE_REFACTOR_PLAN.md` - Completed
- `INTERACTION_REDUCTION_PLAN.md` - Completed
- `PIXEL_AVATAR_REVISION_PLAN.md` - Completed

### Keep as Reference
- `top-gamer-brain.md` - Master research synthesis
- `07-pokemon-design-principles.md` - Implementation alignment
- `DESIGN_PRINCIPLES.md` - Active implementation guide
- `CHOICE_CONSEQUENCE_PHILOSOPHY.md` - Systems understanding
- `BLOAT_AUDIT.md` - Cleanup guide

### Consolidate (Too Many Files)
- 5 different analytics files → 1 analytics strategy doc
- Multiple sprint overview files → 1 current roadmap

---

## Corrected Assessment

### My Previous Gap Analysis Was Wrong About:
1. **Identity Offering** - IS implemented (`lib/identity-system.ts`)
2. **Session Boundaries** - IS in progress (Week 3)
3. **Failure Entertainment** - IS planned (Week 4)

### Actual Critical Gaps:
1. **Pattern Acknowledgment Rate** (4% → 20%) - Content writing needed
2. **Orbs Don't Unlock Anything** - Major feature gap
3. **6,726 lines of bloat** - Cleanup opportunity
4. **Skills System Dead** - 905 attributions doing nothing

---

## Summary: What Actually Needs Doing

### Immediate (This Week)
- Complete Session Boundaries (Week 3)
- Start Failure Entertainment (Week 4)

### Next 2 Weeks
- Pattern acknowledgment content (1-2 days)
- Bloat cleanup Phase 1 (4 hours)

### Next Month
- Orb Unlocks feature (1-2 weeks)
- Skills decision (delete recommended)

### Not Needed
- Character intersection
- Pattern voices
- Narrative scarcity
- Additional documentation

---

## Future Content Pipeline (Not Current Gap)

### 30 Career Paths Document (`30-career-paths.md`)

**Status:** Content design complete, implementation future (Station 2+)

| Industry | Careers | Example Characters |
|----------|---------|-------------------|
| Healthcare | 5 | AI Diagnostician, Crisis Responder, Bioprinting Tech |
| Technology | 5 | AI Safety Researcher, Robotics Integration, Cybersecurity |
| Green/Sustainability | 5 | Vertical Farm Manager, Carbon Capture Engineer |
| Creative & Media | 5 | Interactive Narrative Designer, AI Artist |
| Trades & Manufacturing | 3 | Advanced Mfg Tech, EV Infrastructure |
| Finance & Business | 3 | Impact Investment Analyst, FinTech Ethics |
| Education & Social | 4 | Learning Designer, Digital Equity Advocate |

### Scene Formula (Per Career)
Each career path includes 4 scene types:
1. **Crossroads Scene** - Key decision (4 choices mapping to patterns)
2. **Day-in-Life Pressure Test** - Real-time triage, multiple demands
3. **Ethical Dilemma** - Values test, no clear answer
4. **Unexpected Moment** - Humanizing beat, connection to life

### Pattern Coverage
All 5 patterns balanced across 30 careers:
- Analytical: 18 careers (primary or secondary)
- Helping: 17 careers
- Building: 19 careers
- Patience: 16 careers
- Exploring: 15 careers

### Implementation Timeline
- **Station 1 (Current):** 8 characters - Grand Central Terminus
- **Station 2 (Q2 2025):** 8 new characters - Innovation Hub
- **Stations 3-5 (Q3-Q4 2025):** Remaining careers

### Why This Isn't a Gap
- Content design is ready (1,318 lines of scenes)
- Architecture supports it (dialogue graph system)
- Just needs implementation time
- Prioritized after core gaps (failure paths, pattern acknowledgment, orb unlocks)

---

*"Kill Your Darlings" - The documentation shows we designed more than we need. Focus on what matters: patterns that manifest, choices that matter, orbs that unlock.*
