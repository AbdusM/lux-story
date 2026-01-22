# UX Transformation Implementation Plan

## DECISION: Hybrid Alpha-Delta

**Date:** January 22, 2026
**Status:** APPROVED FOR EXECUTION
**Strategy:** "Ship the functional architecture of a premium app (Delta), but frame every interaction as a relationship with a living system (Alpha)."

---

## The UX Verdict

**We are killing the "Kiosk." We are building a Cinematic Chat Interface.**

| Element | Old (Kiosk) | New (Cinematic Chat) |
|---------|-------------|----------------------|
| Frame | Container for text | Container for the *world*. It breathes. |
| Scroll | Nested bars, document feel | One surface, transcript flow |
| Jargon | Unexplained terms | Dual-labeled: "Orbs (Channeling Capacity)" |
| Locks | "REQ: ANALYTICAL 3" | "Samuel doesn't trust your logic yet." |

---

## Sprint 1 Tickets (Ready for Execution)

### 🎫 TICKET-001: The Single Surface Refactor (Critical Path)

**Goal:** Remove nested scrolling.

**Pre-Requisite:** Manual migration first. Lead dev must manually refactor scroll container in `StatefulGameInterface.tsx` before any AI generation. Feel the pain of CSS overflow stacking contexts and iOS safe-area collisions. Output: 10-line text file describing exactly which DOM nodes changed.

**Specs:**
- Remove `overflow-y` from `DialogueCard`
- Apply `flex: 1` and `overflow-y: auto` to main `Page` container
- Implement scroll-to-bottom logic that respects user scroll intent
- Handle iOS safe-area collisions

**Files:**
- `components/StatefulGameInterface.tsx`
- `components/ChatPacedDialogue.tsx`
- `app/globals.css`

**Success State:** You can scroll from header to footer in one fluid motion on iPhone.

---

### 🎫 TICKET-002: The Bottom Sheet Primitive

**Goal:** Handle >3 choices without clutter.

**Specs:**
- Create `ActionSheet` component (using `Vaul` or `framer-motion`)
- Trigger: "More Options" button in sticky footer
- Content: Scrollable list of choices
- Close: Swipe down, tap backdrop, or select choice

**Files:**
- `components/ui/BottomSheet.tsx` (new)
- `components/game/GameChoices.tsx`

**Success State:** Tapping "More Options" slides sheet up. Tapping backdrop closes it.

---

### 🎫 TICKET-003: The "Relationship" Lock UI

**Goal:** Reframe gates as narrative.

**Specs:**
- Update `ChoiceButton` to accept `lockReason` prop
- Visuals: Dimmed, grayscale, padlock icon
- Interaction: Tap triggers Toast/Tooltip with narrative reason + path
- Copy pattern: "Requires [Skill]. Try running the 'Patient Comfort' simulation first."

**Files:**
- `components/game/GameChoices.tsx`
- `lib/choice-adapter.ts`

**Success State:** User knows WHY locked and WHERE to go.

---

### 🎫 TICKET-004: Evidence Schema Definition

**Goal:** Ensure data capture for B2B value prop.

**Specs:**
- Define `EvidenceEntry` TypeScript interface
- Implement `logEvidence(action)` hook
- No UI needed yet—log to console/local state
- Every meaningful choice logs JSON with `skill_tags` and `rubric_score`

**Files:**
- `lib/evidence-schema.ts` (new)
- `hooks/useEvidence.ts` (new)

**Success State:** Every meaningful choice logs structured evidence.

---

## Engineering Directives

### Directive A: Manual Migration First

Before ANY AI generation:
1. Manually refactor scroll container in `StatefulGameInterface.tsx`
2. Feel the CSS `overflow` stacking contexts
3. Document which DOM nodes changed
4. THEN generate the rest

### Directive B: The Signature Moment (30% Budget)

We spend 30% of engineering budget on **The Choice Commitment Animation**:
1. User taps choice
2. Haptic "Thud"
3. Choice card morphs into User Message bubble
4. Flies up into transcript
5. Station pauses (thinking dots)

**Why:** If this feels good, user forgives lack of other polish.

### Directive C: Context Compression

**FORBIDDEN:** Pasting entire codebase into LLM context.

**ALLOWED:** Only specific component interface definitions (`UserMessage`, `GameState`) and specific CSS module being touched.

---

## The Big 5 (Highest Impact, Most Differentiated)

### 1. Single Scroll Surface + Choice → Transcript Animation
**Impact:** Eliminates the #1 UX friction (nested scroll) and creates the "ChatGPT feel"
**Differentiation:** Choice animation makes it feel like a game, not just a chat

### 2. The Living Station Frame
**Impact:** Turns a UX problem (bordered containers) into a narrative feature
**Differentiation:** No other app has UI that behaves as a character

### 3. Pull-to-Dismiss + Bottom Sheet Navigation
**Impact:** Thumb zone ergonomics for modern large phones
**Differentiation:** Premium mobile-native feel

### 4. Lock Explanation as Relationship
**Impact:** Transforms frustration into anticipation
**Differentiation:** "Maya won't share until she trusts you" vs "REQ: HELPING 4"

### 5. The Signature Choice Moment
**Impact:** One perfect interaction that defines the entire experience
**Differentiation:** The moment players remember

---

## Sprint 1: Core Feel (Single Scroll + Signature Moment)

### 1.1 Single Scroll Surface

**Problem:** Nested scroll inside bordered container feels like 2010 web.

**Solution:**
```
┌─────────────────────────────────┐
│ HEADER (sticky, safe-area-top)  │
├─────────────────────────────────┤
│ TRANSCRIPT (flex-1, overflow-y) │
│   └─ MessageCard per dialogue   │
│   └─ MessageCard per user choice│
│   └─ TypingIndicator            │
├─────────────────────────────────┤
│ CHOICES (sticky, safe-area-bot) │
└─────────────────────────────────┘
```

**Files to Modify:**
- `components/StatefulGameInterface.tsx` — Restructure render
- `components/ChatPacedDialogue.tsx` — MessageCard per message
- `app/globals.css` — Single scroll CSS

**Scroll Anchoring Rules:**
- User at bottom (within 80px) → auto-scroll during streaming
- User scrolls up → show "Jump to latest" pill
- Scroll intent flag (user vs system driven)

**Critical CSS:**
```css
.transcript {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}
.message-card {
  overflow: visible; /* NO inner scroll */
}
```

---

### 1.2 The Signature Choice Animation

**This is the ONE interaction we make PERFECT.**

**Sequence:**
1. User taps choice
2. Choice card scales to 0.95 + light haptic
3. Other choices fade out (opacity 0, 150ms)
4. Screen dims slightly (5% darker)
5. 300ms pause (anticipation)
6. Heavy haptic
7. Selected choice animates up into transcript:
   - translateY to insertion point
   - backgroundColor morphs to user-message color
   - Trail effect (afterimage)
8. Silence (2 beats)
9. Typing indicator appears
10. NPC response streams in

**Files to Modify:**
- `components/game/GameChoices.tsx` — Animation logic
- `lib/animations.ts` — Add signature spring config
- `lib/ui-constants.ts` — Timing values

**Haptic Spec:**
```typescript
// Light tap on selection
navigator.vibrate?.(10)

// Heavy thud on commit
navigator.vibrate?.([0, 50, 100])
```

---

### 1.3 Bottom Sheet for >3 Choices

**Problem:** Scrollbar inside choice panel = nested scroll.

**Solution:**
- ≤3 choices: Inline chips/buttons
- >3 choices: "More options" opens bottom sheet

**Bottom Sheet Spec:**
| Property | Value |
|----------|-------|
| Max height | 60% viewport |
| Backdrop | Blur + 50% opacity |
| Close triggers | Swipe down, tap scrim, select |
| Tap target | 52-60px height minimum |
| Accessibility | Focus trap, aria labels |

**Files to Create:**
- `components/ui/BottomSheet.tsx` — New primitive

---

## Sprint 2: Thumb Zone + Living Station

### 2.1 Pull-to-Dismiss Physics

**Problem:** X button in top-right is hardest touch target.

**Solution:** All modals/overlays support pull-down to dismiss.

**Implementation:**
```typescript
// Use framer-motion drag
<motion.div
  drag="y"
  dragConstraints={{ top: 0, bottom: 0 }}
  dragElastic={{ top: 0, bottom: 0.5 }}
  onDragEnd={(_, info) => {
    if (info.offset.y > 100) onClose()
  }}
>
```

**Files to Modify:**
- `components/Journal.tsx`
- `components/constellation/ConstellationView.tsx`
- Any modal/overlay component

---

### 2.2 Bottom Tab Navigation (Inside Modals)

**Problem:** Tabs at top require grip shimmy on large phones.

**Solution:** Move Harmonics/Essence/Mastery tabs to bottom of modal.

**Alternative:** Implement swipe gestures between tabs.

**Files to Modify:**
- `components/Journal.tsx` — Tab position
- Add swipe gesture handling

---

### 2.3 Living Station Frame (Progressive)

**Concept:** The UI frame IS The Station. Frame behavior reflects game state.

**Phase 1 (Sprint 2):**
- Frame "breathes" (subtle scale pulse) when patience > 7
- Frame border color shifts based on dominant pattern
- Frame opacity increases with trust (more "solid" = more trust)

**Phase 2 (Future):**
- Frame dissolves as player masters the system
- Frame reacts to emotional content
- Frame is Samuel's "presence"

**Files to Modify:**
- `components/LivingAtmosphere.tsx`
- `app/globals.css` — Frame animation CSS

---

## Sprint 3: Relationship Locks + Juice

### 3.1 Lock Explanation as Relationship

**Problem:** "REQ: HELPING 4" feels mechanical.

**Solution:** Every lock shows:
1. **Narrative reason:** "Maya won't share this until she trusts you"
2. **Progress:** "Helping 2/4"
3. **Action:** Deep link to relevant simulation

**Files to Modify:**
- `components/game/GameChoices.tsx` — Lock UI
- `lib/choice-adapter.ts` — Lock reason generation

**Copy Pattern:**
```
Before: "🔒 REQ: HELPING 4"
After:  "🔒 Maya needs to trust you more
        Helping ██░░ 2/4
        [Run Patient Comfort sim →]"
```

---

### 3.2 Progress Bar Animation

**Problem:** Static progress bars miss opportunity for "juice."

**Solution:** Bars animate from 0% to current on screen entry.

**Files to Modify:**
- Any component with progress visualization
- Use Framer Motion `initial={{ width: 0 }}` → `animate={{ width: value }}`

---

### 3.3 Orb Spending Animation

**Problem:** Orbs just subtract—no satisfaction.

**Solution:** Orbs physically fly from counter to skill slot.

**Implementation:**
```typescript
// Spawn orb particles at counter position
// Animate along bezier curve to skill position
// Play sound on arrival
// Then update counter
```

**Files to Modify:**
- Skill tree component
- Add particle animation system

---

## Sprint 4: Polish + Accessibility

### 4.1 Text Readability

**Actions:**
- Increase side margins for narrative text (target 30-34 chars/line)
- Ensure grey text is WCAG AA (#B0B0B0 minimum)
- Add "Reader mode" toggle (mono → sans-serif)

**Files to Modify:**
- `components/RichTextRenderer.tsx`
- `app/globals.css`

---

### 4.2 Empty States (Narrative)

**Problem:** "No Dossiers" breaks immersion.

**Solution:**
- "Scanning for signals..." with animation
- "No active traces detected."
- Keep user in the fiction

**Files to Modify:**
- Any component with empty state

---

### 4.3 Constellation Usability

**Problem:** Fat finger problem on node maps.

**Solutions:**
- Smart zoom: Tap near cluster → auto-zoom
- Snap-to-node: Magnetic selection with haptic bumps
- List view fallback: Toggle for accessibility

**Files to Modify:**
- `components/constellation/ConstellationView.tsx`

---

## Future: Differentiation Features

### Parallax Background (Gyroscope)
Stars/grid shift based on phone tilt. "Window into another world."

### Radar Chart Ghost Overlay
When viewing job opportunity, overlay ghost of required stats.

### Active Thoughts Real-Time Fill
Internalization bar fills visibly as choices align. Flies to profile on 100%.

### Neural Deck Copy UX
- One-tap copy button
- Haptic "Copied!" confirmation
- Fill-in-the-blank form for brackets

---

## Engineering Approach

### Before ANY Code Generation:

1. **Read the actual files** being modified
2. **Understand why** current architecture exists
3. **Identify essential vs accidental** complexity
4. **Write specification** so clear a junior dev can follow
5. **Do ONE component by hand** first to learn the seams

### The Manual Migration Principle:

Before generating single-scroll refactor:
1. Manually trace every `overflow` property in StatefulGameInterface
2. Make ONE message scroll correctly by hand
3. Document what breaks
4. Feed that PR as seed for AI research

### Pre-Flight Checklist:

- [ ] Have I read the actual code?
- [ ] Can I explain why current architecture exists?
- [ ] Do I have a spec a junior dev could follow?
- [ ] Will I understand generated code at 3am debug session?

---

## Critical Files

| File | Sprint | Changes |
|------|--------|---------|
| `StatefulGameInterface.tsx` | 1 | Single scroll restructure |
| `GameChoices.tsx` | 1, 3 | Signature animation, lock UI |
| `ChatPacedDialogue.tsx` | 1 | MessageCard per message |
| `components/ui/BottomSheet.tsx` | 1 | New component |
| `Journal.tsx` | 2 | Pull-to-dismiss, bottom tabs |
| `LivingAtmosphere.tsx` | 2 | Frame breathing |
| `lib/animations.ts` | 1 | Signature spring |
| `lib/ui-constants.ts` | 1 | Timing values |
| `app/globals.css` | 1, 4 | Scroll CSS, readability |

---

## Verification

### After Each Sprint:

```bash
npm test
npm run build
npm run lint
```

### Manual QA Checklist:

- [ ] Single scroll: No nested scrollbars anywhere
- [ ] Choice animation: Feels premium, consistent timing
- [ ] Bottom sheet: Opens/closes smoothly, respects safe area
- [ ] Pull-to-dismiss: Works on all modals
- [ ] Lock explanation: Shows narrative + progress + action
- [ ] Accessibility: Reduced motion respected, contrast passes

### Device Testing:

- [ ] iPhone SE (small screen)
- [ ] iPhone Pro Max (large screen, thumb zone)
- [ ] Android mid-range (performance)
- [ ] Tablet (if supported)

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Nested scrollbars | 0 |
| Choice animation duration | 500-700ms total |
| Tap target size | ≥44px everywhere |
| Text contrast | WCAG AA |
| Time to first meaningful interaction | < 3 seconds |

---

## Simple vs Easy Sanity Check

**Are we choosing "Easy"?**
- ❌ Easy: Adding a "Glossary" tab and leaving jargon alone
- ❌ Easy: Keeping nested scroll and hiding scrollbar with CSS

**Are we choosing "Simple"?**
- ✅ Simple: Refactoring DOM so scroll behavior is native
- ✅ Simple: Dual-labels so no glossary needed
- ✅ Simple: One perfect animation (choice commit) instead of polish everywhere

**Verdict:** The plan is **SIMPLE**. Requires upfront architectural surgery (scroll refactor), but removes accidental complexity (glossary, nested UI hacks) forever.

---

## Reference Documents

- `docs/03_PROCESS/UX_ANALYSIS_JAN2026.md` — Full friction analysis (34KB)
- `docs/03_PROCESS/UX_ISP_SYNTHESIS.md` — Possibilities + engineering principles (28KB)

---

## Execution Order

```
1. TICKET-001: Single Surface Refactor (CRITICAL PATH)
   └─ Manual migration first
   └─ Then AI-assisted completion

2. TICKET-004: Evidence Schema (Can parallel with #1)
   └─ No UI, just types + logging

3. TICKET-002: Bottom Sheet Primitive
   └─ Depends on #1 (needs scroll context)

4. TICKET-003: Relationship Lock UI
   └─ Depends on #2 (uses sheet for explanations)
```

**EXECUTE.**
