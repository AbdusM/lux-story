# Comprehensive Software Development Roadmap
**December 16, 2024 - All Improvements & Gaps**

---

## Summary Matrix

| Priority | Count | Effort | Timeline |
|----------|-------|--------|----------|
| P0: Critical | 3 | 1 week | Immediate |
| P1: High | 12 | 2 weeks | This sprint |
| P2: Medium | 15 | 1-2 months | Next sprint |
| P3: Future | 20+ | Ongoing | Q2+ 2025 |

---

## P0: CRITICAL (Fix Immediately)

### P0.1: Orbs Don't Unlock Anything
**Severity:** CRITICAL - Core feature invisible
**File:** `lib/orbs.ts`, `lib/pattern-unlocks.ts`

**Current State:**
```
Player earns 50 analytical orbs → Number in Journal → Nothing happens
```

**Required State:**
```
5 orbs → "Read Between Lines" ability
10 orbs → "Pattern Recognition"
20 orbs → Unlock analytical dialogue options
```

**Implementation:**
1. Add `PatternUnlocks` type to `lib/orbs.ts`
2. Create unlock checking logic in dialogue engine
3. Add "Abilities" tab to Journal
4. Tag dialogue choices with unlock requirements

**Effort:** 1-2 weeks
**Philosophy Check:** ✅ Serves "Meaningful Choices" + "Accessible Depth"

---

### P0.2: Pattern Acknowledgment Only 4%
**Severity:** HIGH - Invisible value
**Files:** All dialogue graphs

**Current:** 1,142 pattern choices → 50 acknowledgments (4%)
**Target:** 20% acknowledgment rate

**Where to Add:**
1. **Samuel Hub** - Comment every 2-3 conversations
2. **Character Arc Midpoints** - Scene 2/3 acknowledges dominant pattern
3. **Crossroads Decisions** - Pattern-aware framing

**Example Addition:**
```typescript
patternReflection: [
  { pattern: 'analytical', minLevel: 4,
    altText: "You think things through, don't you?" },
  { pattern: 'helping', minLevel: 4,
    altText: "You're always looking out for others." }
]
```

**Effort:** 1-2 days dialogue writing
**Philosophy Check:** ✅ Serves "Emotion Over Mechanics" + "Show Don't Tell"

---

### P0.3: Update Orbs Comment (Developer Confusion)
**Severity:** Low (dev-only)
**File:** `lib/orbs.ts` line 6

**Current (misleading):**
```typescript
* and can allocate them to unlock career insights and dialogue options.
```

**Fixed:**
```typescript
* Orb fill levels track progress and trigger milestone messages from Samuel.
* Note: Orbs are earned-only. No allocation/spending mechanism exists.
```

**Effort:** 5 minutes
**Philosophy Check:** ✅ Code clarity

---

## P1: HIGH PRIORITY (Next 2 Weeks)

### P1.1: Failure Entertainment Paths
**Severity:** HIGH - Gating punishes players
**Files:** All dialogue graphs

**Problem:** Low-pattern players get LESS content, not DIFFERENT content.

**Current:**
```
[LOCKED 🔒] Requires Building 40%
Player with Building 15% → No content
```

**Required:**
```
High Building (40%): Technical scene, competent
Low Building (15%): "Circuits were never your thing"
  → Hold components while Maya works
  → Different trust path, equally valuable
```

**Work Required:**
1. Audit top 20 pattern-gated choices
2. Design alternative branches
3. Implement 5-8 nodes per alternative

**Effort:** 4-5 days
**Philosophy Check:** ✅ "No obvious right answers—only trade-offs"

---

### P1.2: Emotion Coverage (26% → 50%)
**Severity:** HIGH - Unlock system feels broken
**Files:** All dialogue graphs

**Current Coverage:**
- Total variations: 1,465
- With emotions: 386 (26%)
- Jordan: 8%, Yaquin: 9%

**Target:** 50% minimum

**Effort:** 1-2 days tagging
**Philosophy Check:** ✅ "Emotion Over Mechanics"

---

### P1.3: Session Boundary Refinement
**Severity:** MEDIUM - Breaks immersion
**File:** `components/SessionBoundaryAnnouncement.tsx`

**Problem:** Interrupts vulnerable narrative moments every 8-12 nodes.

**Options:**
1. Only at ACTUAL ending nodes
2. More subtle (corner notification)
3. Adjust frequency (15-20 nodes)

**Effort:** 2-3 hours
**Philosophy Check:** ✅ Serves "Dialogue-Driven Immersion"

---

### P1.4: Bloat Cleanup Phase 1
**Files to Delete/Move:**

| File | Lines | Action |
|------|-------|--------|
| `scene-skill-mappings.ts` | 2,183 | DELETE (duplicate) |
| `crossroads-system.ts` | 1,272 | DELETE (unused) |
| `character-quirks.ts` | 1,394 | MOVE to `/content` |
| `character-depth.ts` | 1,310 | MOVE to `/content` |
| `birmingham-opportunities.ts` | 567 | MOVE to `/content` |

**Total:** 6,726 lines cleaned

**Effort:** 4 hours
**Philosophy Check:** ✅ "Kill Your Darlings"

---

### P1.5: Skills System Decision
**Severity:** MEDIUM - Dead code
**Current:** 905 skill attributions → 0% gameplay impact

**Options:**
| Option | Effort | Result |
|--------|--------|--------|
| A: Delete | 2 hours | Remove 905 lines |
| B: Wire up | 1 week | Skills affect gameplay |
| C: Keep hidden | 0 | Analytics only |

**Recommendation:** Option A (Delete)
**Philosophy Check:** ✅ "Feature Graveyard" red flag

---

### P1.6: Transformation Flags Cleanup
**Severity:** LOW - Dead code
**File:** `lib/character-depth.ts`

**Current:** 14 granular flags SET but never CHECKED
```typescript
globalFlagsSet: ['maya_imposter_resolved'] // SET
gameState.globalFlags.has('maya_imposter_resolved') // NEVER CHECKED
```

**Recommendation:** Delete granular flags, keep only `*_arc_complete`
**Effort:** 1 hour

---

### P1.7: Console Log Cleanup (Optional)
**Count:** 145 console.log statements
**Action:** Keep (useful for debugging) OR wrap in dev check

---

### P1.8: TODO Comments Audit
**Count:** 13 in code, 70+ for SFX/VFX in dialogue
**Action:** Keep as roadmap (not blocking)

---

### P1.9: Trust-Based Subtext Expansion
**File:** `components/unlock-enhancements/Subtext.tsx`
**Issue:** Only ~10% of dialogue has subtext
**Action:** Add to 30+ high-value nodes

**Effort:** 1-2 days
**Philosophy Check:** ✅ "Accessible Depth"

---

### P1.10: ESLint Warning Cleanup
**Count:** 10 warnings
**Issues:** 1 `@ts-ignore`, 9 unused caught errors
**Effort:** 15 minutes

---

### P1.11: Documentation Organization
**Current:** 88 .md files in root
**Action:** Organize into `docs/audits/`, `docs/implementation/`, etc.
**Effort:** 30 minutes

---

### P1.12: CSS Consolidation
**Current:** 4 CSS files, 3 unused
**Action:** Delete backups or consolidate
**Effort:** 15 minutes

---

## P2: MEDIUM PRIORITY (1-2 Months)

### P2.1: Pattern Evolution Chart
**File:** `components/PatternInsightsSection.tsx`
**Need:** Weekly stacked bar chart showing pattern distribution
**Effort:** 3-4 hours

---

### P2.2: Pattern-Based Dialogue Branching
**Status:** Infrastructure exists, content missing
**Need:** 20+ pattern-gated nodes across 4 characters
**Effort:** 2-3 days

---

### P2.3: Character Content Phase 2
**Current:** 3/11 characters have Phase 2 (Marcus, Tess, Yaquin)
**Need:** Maya, Devon, Jordan, 5 others
**Effort:** 1-2 weeks

---

### P2.4: E2E Test Coverage
**Current:** 9/10 passing
**Need:** Full character arc coverage
**Effort:** 1-2 hours

---

### P2.5: Visual Regression Testing
**Tool:** Playwright screenshots or Percy
**Effort:** 2-3 hours setup

---

### P2.6: Accessibility Audit
**Scope:** WCAG 2.1 AA compliance
**Focus:** Keyboard nav, screen readers, contrast
**Effort:** 4-6 hours

---

### P2.7: Performance Optimization
**Opportunities:**
- Code splitting for dialogue graphs
- Lazy loading character arcs
- Asset optimization

**Effort:** 3-4 hours

---

### P2.8: Admin Dashboard Pattern Section
**Need:** Pattern distribution charts, evidence cards, filters
**Effort:** 3-4 hours

---

### P2.9: Samuel Hub Cross-Character Reflections
**Need:** 10-15 nodes showing character connections
**Effort:** 2-3 hours

---

### P2.10: Journey Narrative Enhancement
**Status:** Core works, prose needs polish
**Effort:** 2-3 hours

---

### P2.11-15: Additional Items
- Phase 5 Advanced Pattern Features
- Phase 6 Testing & Refinement
- Backup/Archive Organization
- Admin Analytics Export
- Mobile Touch Optimization

---

## P3: FUTURE (Q2+ 2025)

### P3.1: Station 2 (Innovation Hub)
**Scope:** 11 new tech characters
**Effort:** 4-6 weeks
**Timeline:** Q2 2025

---

### P3.2: Stations 3-5
**Timeline:** Q3-Q4 2025

---

### P3.3: 30 Career Paths Content
**Status:** Design complete (1,318 lines)
**Scope:** Full implementation across stations

---

### P3.4: B2B Expansion
**Target:** 5-10 career exploration programs
**Revenue:** $25-100K Q4 2025

---

### P3.5: Podcast Launch
**Potential:** $40K Q3 2025

---

### P3.6-20: Additional Future Items
- Creator Platform for Custom Paths
- Transmedia Expansion (iOS/Android)
- Multi-language Support
- Advanced Theme Customization
- Social Features
- PDF Report Generation

---

## Implementation Schedule

### Week of Dec 16 (Current)
- [ ] P0.3: Fix orbs comment (5 min)
- [ ] P1.10: ESLint cleanup (15 min)
- [ ] P1.11: Doc organization (30 min)
- [ ] Start P0.1: Orb unlocks design

### Week of Dec 23
- [ ] Continue P0.1: Orb unlocks implementation
- [ ] P0.2: Pattern acknowledgment content
- [ ] P1.3: Session boundary refinement

### Week of Dec 30
- [ ] P1.1: Failure paths design
- [ ] P1.2: Emotion coverage (50%)
- [ ] P1.4: Bloat cleanup

### January 2025
- [ ] P1.1: Failure paths implementation
- [ ] P2.2: Pattern dialogue branching
- [ ] P2.3: Character Phase 2 content
- [ ] Urban Chamber pilot prep

### February 2025
- [ ] Urban Chamber pilot launch
- [ ] Gather validation data
- [ ] P2 items based on feedback

---

## Validation Checklist

Before implementing ANY item, verify:

| Check | Question |
|-------|----------|
| Philosophy | Does it serve the 10 Commandments? |
| Red Flags | Am I building a red flag? |
| Immersion | Does it stay dialogue-driven? |
| Feel | Would it feel good in 30 seconds? |
| Intelligence | Does it respect player intelligence? |

---

## Quick Reference: File Locations

| System | Primary File |
|--------|--------------|
| Patterns | `lib/patterns.ts` |
| Orbs | `lib/orbs.ts` |
| Identity | `lib/identity-system.ts` |
| Trust | `lib/trust-labels.ts` |
| Echoes | `lib/consequence-echoes.ts` |
| Dialogue | `lib/dialogue-graph.ts` |
| State | `lib/character-state.ts` |
| Store | `lib/game-store.ts` |

---

*This roadmap supersedes previous sprint planning documents.*
