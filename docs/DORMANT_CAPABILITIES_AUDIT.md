# Dormant Capabilities Audit

**Date:** December 2024
**Purpose:** Backend capabilities that exist but haven't been surfaced to the UI

---

## HIGH-VALUE DORMANT SYSTEMS

### 1. Chemistry/Biology System (Ready to Surface)
**Location:** `lib/emotions.ts`, `lib/chemistry.ts`, `lib/character-state.ts`

| Capability | Status | Value |
|------------|--------|-------|
| Nervous system state (ventral_vagal/sympathetic/dorsal_vagal) | Computed, never shown | HIGH |
| Chemical reactions (resonance, cold_fusion, volatility, deep_rooting, shutdown) | Stored in `lastReaction`, never displayed | HIGH |
| Narrative gravity (choices attract/repel based on biology) | Affects order internally, not visualized | MEDIUM |

**Quick Win:** Display `lastReaction` as visual feedback in dialogue (~2hrs)

---

### 2. Platform Evolution System (Never Activated)
**Location:** `lib/character-state.ts:26-33`, `lib/platform-resonance.ts`

| Capability | Status | Value |
|------------|--------|-------|
| Platform warmth (-5 to 5) | Defined, never updated | HIGH |
| Platform resonance (0-10) | Defined, never updated | HIGH |
| Platform discovery tracking | Defined, never triggered | MEDIUM |
| Birmingham platform connections | Defined, never shown | HIGH |

**Issue:** `queuePlatformStateSync()` called but state never modified

---

### 3. Birmingham Opportunities Database (50+ Records, Zero UI)
**Location:** `content/birmingham-opportunities.ts`

Complete database of real Birmingham opportunities:
- Job shadowing, internships, mentorships, volunteer, courses
- Organizations: UAB, Children's, Southern Company, Regions Bank
- Includes age ranges, time commitments, compensation, websites
- `getPersonalizedOpportunities()` function exists but never called

**Quick Win:** Add opportunities tab in student insights (~8hrs)

---

### 4. Mystery Progression System (4 Branches, Never Shown)
**Location:** `lib/character-state.ts:49-54`

| Mystery | States | Status |
|---------|--------|--------|
| letterSender | unknown → investigating → trusted/rejected → samuel_knows → self_revealed | Never progressed |
| platformSeven | stable → flickering → error → denied → revealed | Never progressed |
| samuelsPast | hidden → hinted → revealed | Never progressed |
| stationNature | unknown → sensing → understanding → mastered | Never progressed |

**Issue:** Full mystery state machine defined but no code path modifies it

---

### 5. Career Values System (Computed, Never Displayed)
**Location:** `lib/character-state.ts:38-44`, `lib/game-logic.ts`

5 career values tracked:
- directImpact, systemsThinking, dataInsights, futureBuilding, independence

Career affinity matching to 8 paths exists but never shown to player.

---

### 6. Identity Offering System (Disco Elysium Pattern)
**Location:** `lib/identity-system.ts`

Infrastructure ready for:
- Offer identity choice when pattern crosses threshold 5
- Internalize for +20% bonus OR discard for flexibility
- Track `InternalizedIdentity` objects

**Issue:** No UI to present offering; no code checks threshold

---

### 7. Unlock Effects System (80% Complete)
**Location:** `lib/unlock-effects.ts`

| Feature | Status |
|---------|--------|
| Emotion tag display | Commented out in DialogueDisplay |
| Trust level inline display | Commented out |
| Subtext hints | Defined but not rendered |
| Birmingham tooltips | Defined but not rendered |
| Pattern-aware choice highlighting | Defined but not rendered |

---

### 8. Pattern-Character Affinity (Only Maya Configured)
**Location:** `lib/pattern-affinity.ts`

Maya has complete affinity configuration:
- Primary: building (+50% trust)
- Secondary: analytical (+25% trust)
- Friction: helping (-25% trust)
- Pattern unlocks at thresholds

**Issue:** 10 other characters missing affinity data entirely

---

## UNUSED CODE (Candidates for Deletion)

### Unused Library Files (~1,100+ lines)

| File | Lines | Reason |
|------|-------|--------|
| `lib/middle-grade-adaptation-system.ts` | 412 | Target audience changed (was 9-13, now 14-24) |
| `lib/performance-monitor.ts` | 387 | Replaced by `performance-check.ts` |
| `lib/narrative-bridge.ts` | 197 | AI bridge text never integrated |
| `lib/content-warnings.ts` | 143 | Trauma warning system unused |
| `lib/state-selectors.ts` | ~100 | Never imported |

### Unused Components (~1,500+ lines)

| Component | Purpose | Status |
|-----------|---------|--------|
| `NarrativeAnalysisDisplay.tsx` | Analytics viz | Never rendered |
| `SimpleAnalyticsDisplay.tsx` | Simple analytics | Never rendered |
| `ChoiceReviewPanel.tsx` | Admin review | Never integrated |
| `FutureSkillsSupport.tsx` | Career support | Never rendered |
| `ActionPlanBuilder.tsx` | Action planning | Type imported, component never used |
| `SilentCompanion.tsx` | UI companion | Only in disabled file |
| `CharacterIntro.tsx` | Char intro | Only in tests |
| `GameMenu.tsx` | Game menu | Only in docs |

---

## PRIORITY SURFACING RECOMMENDATIONS

### Tier 1: Quick Wins (2-4 hours each)

1. **Display Chemistry Reactions** - Show `lastReaction` as dialogue feedback
2. **Mystery Progress Indicator** - Simple progress dots in Journal
3. **Activate Unlock Effects** - Uncomment emotion tags + subtext hints

### Tier 2: Medium Effort (4-8 hours each)

4. **Platform Status View** - Add platform warmth/resonance to constellation
5. **Career Values Display** - Show 5 values in student insights
6. **Complete Pattern Affinity** - Configure remaining 10 characters

### Tier 3: Larger Features (8+ hours)

7. **Birmingham Opportunities Integration** - Career-matched recommendations
8. **Identity Offering UI** - Present choice when pattern hits threshold
9. **Mystery Progression System** - Trigger mystery state changes in dialogue

---

## CLEANUP RECOMMENDATIONS

1. **Delete unused files** (~2,000 lines of dead code)
2. **Archive disabled files** properly with timestamps
3. **Consolidate duplicates** (performance monitoring, analytics systems)
4. **Complete or remove** partial TODOs in career-analytics.ts

---

## VALUE ASSESSMENT

| System | Lines of Code | UI Effort | Player Value |
|--------|---------------|-----------|--------------|
| Chemistry/Biology | ~500 | 2-4 hrs | HIGH - emotional feedback |
| Birmingham Opportunities | ~800 | 8 hrs | HIGH - actionable career info |
| Mystery Progression | ~200 | 4-6 hrs | HIGH - narrative engagement |
| Platform Evolution | ~400 | 4-6 hrs | MEDIUM - spatial progression |
| Identity Offering | ~300 | 4 hrs | MEDIUM - Disco Elysium depth |
| Career Values | ~200 | 2 hrs | MEDIUM - self-insight |

**Total dormant backend code:** ~2,400 lines representing 6+ months of development
**Estimated UI surfacing effort:** 30-40 hours to activate all systems
