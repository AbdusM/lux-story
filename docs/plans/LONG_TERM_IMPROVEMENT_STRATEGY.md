# Long-Term Improvement Strategy

**Date:** January 27, 2026
**Context:** Systemic analysis across performance, UX, and game design.
**Core diagnosis:** The game tracks extraordinary state but players can't feel it working.

---

## The One Problem

**Lux Story solves the hard technical problem (tracking complex state) while leaving the hard design problem unsolved (making players feel that state changing).**

| System | Internal Sophistication | Player Visibility |
|--------|------------------------|-------------------|
| Patterns | 343 voice variations, 145 reflections | Invisible until journey summary |
| Trust | Momentum, resonance, nervous system integration | Silent — echoes blend into dialogue |
| Skills | 54 tracked, evidence-based | Admin dashboard only |
| Consequences | 348 echo blocks, intensity-graded | Indistinguishable from narrative |
| Knowledge | 210 flags, iceberg system | Never surfaced |
| Simulations | 20 defined, 5 fully implemented | Optional, disconnected from narrative |

**Result:** Players experience "make dialogue choices, read dialogue, game ends." The sophisticated machinery runs behind a curtain.

---

## Three Strategic Tracks

### Track A: Make Systems Visible (Highest ROI)
Make players *feel* what the code already calculates. No new mechanics — just surface existing data.

### Track B: Performance & Architecture (Enabling)
Remove technical barriers that prevent smooth UX iteration.

### Track C: Game Feel & Polish (Retention)
Make the core loop (choice → response → next choice) satisfying at a sensory level.

---

## Track A: Make Systems Visible

### A1. Consequence Distinction
**Problem:** 348 consequence echoes are indistinguishable from regular NPC dialogue.
**Fix:** Visual/audio separation when system feedback fires.
- Consequence text gets subtle italic styling or distinct container color
- Brief label: "+Trust" or pattern icon appears alongside the echo
- Audio cue (already wired via `useAudioDirector`) confirms something happened
- **Files:** `StatefulGameInterface.tsx` (consequence display), `game-message.tsx`

### A2. Pattern Feedback Loop
**Problem:** Players don't know patterns exist until journey summary.
**Fix:** Real-time, unobtrusive pattern signals.
- When a voiceVariation fires, brief annotation: *"[Your analytical approach]"*
- Pattern threshold crossing: moment of recognition ("Worldview Shift" — code exists at line 1709, just needs visibility)
- Journal quick-view shows dominant pattern with simple bar
- **Files:** `lib/patterns.ts`, `DialogueDisplay.tsx`, `Journal.tsx`

### A3. Trust Milestone Celebration
**Problem:** Trust changes silently. Players discover trust level in journal later.
**Fix:** Micro-celebrations at trust milestones.
- Toast: "Maya now considers you a confidant" (at trust threshold crossings: 4, 6, 8)
- Character portrait subtle glow/animation on trust change
- Sound already plays (`triggerTrustSound`) — just needs visual pairing
- **Files:** `StatefulGameInterface.tsx`, `CharacterAvatar.tsx`

### A4. Skill Surfacing
**Problem:** 54 skills tracked invisibly. Admin gets evidence, player gets nothing.
**Fix:** Choice-level and milestone-level skill visibility.
- Choice buttons show skill tags: `[Communication]` `[Systems Thinking]`
- After demonstrating a skill 5+ times, brief acknowledgment from NPC (20 nodes exist via `skillReflection`)
- Journey summary already shows skills — just need earlier hints
- **Files:** `game-choice.tsx`, `skill-tracker.ts`

### A5. Knowledge Surface
**Problem:** 210 knowledge flags accumulated invisibly.
**Fix:** "What you've learned" accessible via Journal.
- Per-character section: key facts discovered
- Knowledge enables dialogue — show locked choices with hint: "Requires knowing about Maya's family"
- **Files:** `Journal.tsx`, `GameChoices.tsx` (locked choice display)

---

## Track B: Performance & Architecture

### B1. Lazy-Load Dialogue Graphs
**Problem:** All 28 graphs (3.1 MB, 74,728 lines) loaded eagerly via `graph-registry.ts`.
**Fix:** Dynamic imports. Load current character's graph on demand.
- Initial load: Samuel only (~336 KB → ~100 KB gzipped)
- Load others on navigation
- **Impact:** ~40% initial JS reduction
- **Files:** `lib/graph-registry.ts`, `next.config.js` (re-enable code splitting)

### B2. Remove State Duplication
**Problem:** `characterTrust`, `patterns`, `thoughts` exist both as top-level Zustand fields AND in `coreGameState`. Bridge setters sync them with deprecation warnings (Phase 2.1 added warnings).
**Fix:** Delete top-level duplicates. Derive 100% from `coreGameState` via selectors.
- Already partially done: selectors exist, bridge setters deprecated
- Next step: remove top-level fields, update all selector consumers
- **Files:** `lib/game-store.ts` (lines 46, 50, 68)

### B3. Granular Selectors
**Problem:** `useMessages()`, `usePerformanceMetrics()` re-render on ANY state change — no `useShallow`.
**Fix:** Add `useShallow` to all object-returning selectors. Create derived selectors for specific fields.
- `useMessageCount()` instead of `useMessages()` where only count matters
- `useCurrentCharacterTrust(id)` as primitive selector
- **Files:** `lib/game-store.ts` (lines 1130-1297)

### B4. Memoize Hydration
**Problem:** Every state change triggers full Map/Set reconstruction in `useCoreGameStateHydrated`.
**Fix:** Structural sharing or incremental hydration.
- Only reconstruct the character that changed
- Cache hydrated characters individually
- **Files:** `lib/character-state.ts` (deserialize), `lib/game-store.ts`

### B5. Reduce handleChoice Complexity
**Problem:** `handleChoice` is 890+ lines. Synthesis puzzle checks, arc detection, skill logging all run on every choice.
**Fix:** Already planned as Phase 1.2 in refactoring plan. Split into subhooks.
- `useChoiceHandler` (orchestrator)
- `useTrustCalculation` (pure patch)
- `useConsequenceEchoes` (pure patch)
- Skip expensive checks (puzzles, arcs) when irrelevant (early-exit conditions)
- **Files:** `StatefulGameInterface.tsx` (lines 1401-2291)

---

## Track C: Game Feel & Polish

### C1. Signature Choice Animation
**Problem:** Choice interaction is flat. Animation framework exists in `lib/animations.ts` (lines 257-345) but isn't wired.
**Fix:** Wire the existing animation:
- Tap scale (0.95) on press
- Non-selected choices fade out (150ms)
- Anticipation pause (300ms)
- Selected choice flies up to dialogue area (400ms)
- Haptic feedback (framework exists in `haptics.ts`)
- **Files:** `GameChoices.tsx`, `lib/animations.ts`

### C2. Thinking Indicator Between Choice and Response
**Problem:** After choosing, silence. No signal game is processing.
**Fix:** Show loading dots or typing indicator for 300-600ms between choice and next dialogue.
- `LoadingDots` component exists
- Creates "NPC is thinking" feel
- **Files:** `DialogueDisplay.tsx`, `game-message.tsx`

### C3. Re-enable Dialogue Pacing
**Problem:** `ChatPacedDialogue` disabled due to "critical rendering bugs (blank screen)." All text appears instantly — no narrative rhythm.
**Fix:** Investigate and re-enable with error boundary.
- Text reveal creates anticipation
- Staggered mode already exists in `RichTextRenderer`
- Start with opt-in flag, test on mobile
- **Files:** `ChatPacedDialogue.DISABLED.tsx`, `DialogueDisplay.tsx`

### C4. Transition States
**Problem:** Character switching is instant/jarring. No loading skeleton. On slow connections, blank gap.
**Fix:** Loading skeleton between character transitions.
- Skeleton pattern already exists (admin dashboard)
- Show during graph load + state transition
- **Files:** `StatefulGameInterface.tsx` (character switching logic)

### C5. Faster First Impression
**Problem:** 7-10 seconds before first meaningful choice. `AtmosphericIntro` has 3.5s forced animation.
**Fix:** Show all intro elements at once. Let player tap to continue.
- Removes 3.5s gate
- Respects "Respect Player Intelligence" principle
- **Files:** `AtmosphericIntro.tsx` (lines 66-87)

### C6. Mobile Polish
**Problem:** Inconsistent touch targets (some buttons 36px, standard is 44px), nested scroll in BottomSheet for >3 choices, safe area not applied to main game container.
**Fix:**
- Enforce 44px min on all interactive elements
- Increase BottomSheet max-h or use full-screen sheet for 5+ choices
- Apply safe-area padding to main game interface footer
- **Files:** `ui-constants.ts`, `BottomSheet.tsx`, `StatefulGameInterface.tsx`

---

## Execution Priority (Effort vs Impact)

```
HIGH IMPACT
    |
    |  A1 Consequence      A2 Pattern         C1 Signature
    |  Distinction          Feedback           Animation
    |  [2-3 days]          [3-4 days]         [1-2 days]
    |
    |  A3 Trust            B1 Lazy-Load       C2 Thinking
    |  Milestones          Graphs             Indicator
    |  [1-2 days]          [2-3 days]         [0.5 day]
    |
    |  C5 Faster Intro     B3 Selectors       A4 Skill
    |  [15 min]            [1-2 days]         Surfacing
    |                                          [2-3 days]
    |
    |  C6 Mobile           B2 State           C3 Dialogue
    |  Polish              Dedup              Pacing
    |  [1-2 days]          [2-3 days]         [3-5 days]
    |
LOW IMPACT ──────────────────────────────────────── HIGH EFFORT
```

### Recommended Sequence

**Sprint 1 — Quick Wins (surface existing value)**
1. C5: Faster intro (15 min)
2. C2: Thinking indicator (half day)
3. C1: Signature choice animation (1-2 days)
4. A3: Trust milestone toasts (1-2 days)

**Sprint 2 — Visibility (the strategic shift)**
5. A1: Consequence distinction (2-3 days)
6. A2: Pattern feedback loop (3-4 days)
7. A4: Skill surfacing on choices (2-3 days)

**Sprint 3 — Performance (enable iteration)**
8. B1: Lazy-load dialogue graphs (2-3 days)
9. B3: Granular selectors (1-2 days)
10. B2: State deduplication (2-3 days)

**Sprint 4 — Depth (retention)**
11. C3: Dialogue pacing re-enable (3-5 days)
12. A5: Knowledge surface (2-3 days)
13. C4: Transition states (1-2 days)
14. C6: Mobile polish (1-2 days)

---

## Success Metrics

| Metric | Current | Target | How to Measure |
|--------|---------|--------|----------------|
| Time to first choice | ~8s | <4s | AtmosphericIntro timing + load |
| Player awareness of patterns | 0% (invisible) | 80% (see feedback) | Playtest: "what patterns exist?" |
| Trust milestone recognition | 0% (silent) | 90% (toasts) | Playtest: "did trust change?" |
| Choice satisfaction ("juice") | Low (flat buttons) | High (animation + haptics) | Playtest: "how did choices feel?" |
| Initial JS payload | ~3.1 MB content | ~400 KB (lazy) | Bundle analyzer |
| Unnecessary re-renders | Unmeasured | -30% | React DevTools profiler |

---

## Cross-Cutting Concerns (from Blindspot Audit)

### Testing Gate
All Track B changes require test coverage before merge. The Phase 1.1 extraction (useAudioDirector) shipped without tests and immediately introduced a state duplication bug (isMuted existed in both component state and hook state). Every extracted hook and refactored function needs at minimum:
- Pure function unit tests (e.g., `deriveDerivedState`)
- Integration smoke test verifying the hook's contract

### Track A depends on Track B completion
Track A items (A1-A3) require modifying `StatefulGameInterface.tsx`. Phase 1.2 (choice logic extraction into 3 subhooks) must complete first, or Track A changes will conflict with the ongoing decomposition. Recommended sequence: finish B (Phases 1.2-1.4) → then A1-A3.

### State Duplication Pattern
B2 (State Dedup) is broader than Zustand fields. The isMuted duplication between component state and useAudioDirector was the same anti-pattern at a smaller scale — component-local state mirroring hook state. Any hook extraction must audit for residual component state that should be deleted.

---

## Related Documents
- [Refactoring Master Plan](REFACTORING_MASTER_PLAN_2026.md) — Phase 1.2-1.4 supports Track B
- [Derived Setter Audit](../audit/AUDIT_DERIVED_SETTERS.md) — Track B2 prerequisite (complete)
- [Repository Review](../audit/REPOSITORY_REVIEW_2026.md) — Original analysis
