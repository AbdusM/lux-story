# UI/UX Audit Findings (Containers, Shifts, Delay, Side Menus)

Date: 2026-02-13  
Scope: runtime UI/UX (layout stability, perceived performance, menu reliability)  
Evidence set: `docs/qa/screenshots-2026-02-12/` (24 screenshots)

This document is intentionally **implementation-facing**: each finding points to **evidence + likely root cause + recommended direction**.

## 1) Executive Summary (What’s Actually Wrong)

### P0: Click → next scene delay is largely *intentional* (and currently too slow)

There is a built-in “signature choice” animation sequence that delays executing the choice handler by ~**1.75s** in normal motion mode.

- Root cause: `hooks/useChoiceCommitment.ts` defers `onComplete()` until after multiple timed sleeps.
- Impact: players interpret this as lag, UI bug, or broken click, especially on mobile.

### P0: Side menus can “not show” or appear to “flicker/close” during choice processing

The choice handler finishes with a **full state replacement** `setState({...})` that preserves menu flags using **stale closure state** (`showJournal: state.showJournal`, etc). If the player opens a side menu while a choice is processing/animating, the final `setState({...})` can overwrite that interaction and effectively close the menu.

- Root cause: `components/StatefulGameInterface.tsx` final `setState({...})` is not functional/merge-based.
- Impact: intermittent “menu didn’t open” or “menu closed itself” reports.

### P1: Container nesting reads as “weird outlines”

The UI simultaneously renders:

1. A full-screen “Station frame” border (LivingAtmosphere)
2. A centered app container with its own border + shadow (StatefulGameInterface wrapper)
3. Inner glass panels/cards with borders/shadows (glass-panel + Card)

This creates a stacked, double-border look that can read as accidental nesting rather than intentional framing.

### P1: “Answer area keeps shifting” is mostly layout + strategy switching

Across nodes, the footer layout strategy changes:

- 1–3 choices: single column
- 4+ choices: 2-column grid
- 7+ choices: grouped mode with capped height + internal scroll

Because the footer is in the main flex layout, its height changes cause the dialogue area to reflow (and can feel like the dialogue container jumps).

## 2) Evidence (Screenshots)

These screenshots are the canonical UI evidence set:

- `docs/qa/screenshots-2026-02-12/01_samuel_intro_5_choices.webp` (5-choice intro layout)
- `docs/qa/screenshots-2026-02-12/02_samuel_theme_changing_world.webp` (theme beat screen)
- `docs/qa/screenshots-2026-02-12/03_samuel_orb_gift_prompt.webp` (gift moment)
- `docs/qa/screenshots-2026-02-12/04_samuel_patterns_five_list.webp` (patterns list)
- `docs/qa/screenshots-2026-02-12/05_prism_menu_tabs.webp` (Prism side menu nav)
- `docs/qa/screenshots-2026-02-12/06_journey_network_graph.webp` (Journey constellation graph)
- `docs/qa/screenshots-2026-02-12/15_settings_audio_accessibility.webp` (UnifiedMenu open over choices)
- `docs/qa/screenshots-2026-02-12/17_tess_choice_cards_contrast_issue.webp` (choice contrast regression evidence)
- `docs/qa/screenshots-2026-02-12/24_systemic_calibration_start.webp` (calibration start screen)

## 3) Findings (Detailed)

### F-UI-001 (P0): Click-to-Next Delay Is Dominated by Signature Choice Timing

**What you see:** click a response → pause/dim/fade/fly-up → only later the next node content appears. Many players read this as “it didn’t register” or “it’s laggy.”

**Likely root cause:**

- `hooks/useChoiceCommitment.ts` delays actual dispatch until after:
  - 100ms + 150ms + 300ms + 200ms + 400ms + 600ms ≈ **1750ms**
- Timing values are defined in `lib/animations.ts` (`signatureChoice.timing`).
- Only after that does the handler in `components/StatefulGameInterface.tsx` run, which then does additional work before rendering next content.

**Code pointers:**

- `hooks/useChoiceCommitment.ts:63` (delayed `onComplete()`)
- `lib/animations.ts:276` (timing constants)
- `components/GameChoices.tsx:776` (commitChoice wraps the real callback)

**Recommendation direction:**

- Decide whether the signature animation is a “premium feel” requirement or a “soft optional.”
- If we keep it, reduce total pre-dispatch delay to ~250–500ms, or dispatch immediately and let animation play concurrently.
- If we keep the full sequence, explicitly show a “processing” affordance (typing indicator or microcopy) so it reads as intentional, not lag.

---

### F-UI-002 (P0): Side Menus Can Be Clobbered During Choice Processing

**What you see:** you click a response, then quickly tap Journal/Journey/Settings; sometimes the panel doesn’t open, or opens then closes once the next node loads.

**Likely root cause:**

`handleChoice()` ends with a **non-functional** setState replacement:

- `setState({ ... })` sets `showJournal: state.showJournal`, `showConstellation: state.showConstellation`, etc.
- Because `handleChoice()` is async and does multiple awaits (dynamic imports, arc checks), `state.*` here can be stale relative to user interactions that happened during processing.

**Code pointers:**

- `components/StatefulGameInterface.tsx:2939` (full state replacement)
- `components/StatefulGameInterface.tsx:2959` (menu flags preserved from closure state)

**Recommendation direction:**

- Convert the final update to `setState(prev => ({ ...prev, ...updates }))` and preserve menu flags from `prev`, not the closure.
- Add a small unit test that simulates “open journal while choice is processing” and asserts it stays open.

---

### F-UI-003 (P1): “Weird Outline Containers” Is Real and Comes From Double Framing

**What you see:** multiple stacked borders/frames: an outer colored frame + inner container border + inner card borders. It can read like accidental nesting.

**Likely root cause:**

1. LivingAtmosphere renders a “station frame”:
   - `components/LivingAtmosphere.tsx` uses `motion.div` frame with `absolute inset-2 sm:inset-4` and a colored border/box-shadow.
2. StatefulGameInterface renders its own container border:
   - wrapper has `shadow-2xl border-x border-white/5 bg-black/10` etc.
3. glass-panels add borders + inset highlights:
   - `.glass-panel` adds borders + inset highlights + noise overlay.

**Evidence:** visible in most screenshots, especially:

- `01_samuel_intro_5_choices.webp`
- `15_settings_audio_accessibility.webp`
- `24_systemic_calibration_start.webp`

**Code pointers:**

- `components/LivingAtmosphere.tsx:357` (frame border + boxShadow)
- `components/StatefulGameInterface.tsx:3668` (inner app container border/shadow)
- `app/globals.css:669` (glass-panel borders + highlights)

**Recommendation direction:**

- Pick one canonical “frame”:
  - Either keep LivingAtmosphere frame and reduce/remove the app container border-x/shadow, or vice versa.
- Ensure overlays (Journal/Constellation) share the same framing rule so it feels intentional.

---

### F-UI-004 (P1): Dialogue/Answer Area “Shifting” Comes from Footer Strategy Switching

**What you see:** the dialogue card appears to move up/down between nodes, especially when the number of response choices changes.

**Likely root cause:**

- Footer is a sticky element inside the main flex column and its height changes per node.
- `components/GameChoices.tsx` changes layout mode based on choice count:
  - 1–3: single column
  - 4+: 2-column grid
  - 7+: grouped mode with internal scroll + max height caps (CHOICE_CONTAINER_HEIGHT)

**Code pointers:**

- `components/GameChoices.tsx:745` (grid switch at 4+)
- `components/GameChoices.tsx:746` (grouping switch at >6)
- `components/StatefulGameInterface.tsx:4081` (footer is sticky and inside layout)
- `lib/ui-constants.ts:171` (choice container max heights)

**Recommendation direction:**

- Implement the planned “bottom sheet for >3 choices” (already referenced in comments) so footer height is more stable.
- Or: enforce a consistent max height for the choices area and allow scroll, even when not grouped.

---

### F-UI-005 (P2): Choice Border Effects Risk Clipping/Artifacts

**What you see:** subtle “boxed” feel and occasional odd edges, especially when hovering/focusing choices.

**Likely root cause:**

- `.marquee-border` forces `overflow: hidden` + `isolation: isolate` on most choice buttons.
- This can clip shadows/glows and create a layered outline look.

**Code pointers:**

- `app/globals.css:404` (`.marquee-border`)
- `components/GameChoices.tsx:609` (applied broadly to patterned choices)

**Recommendation direction:**

- Restrict marquee-border to truly pivotal moments (not every patterned choice).
- Avoid `overflow: hidden` unless the effect absolutely needs it (or move effect to a sibling wrapper).

---

### F-UI-006 (P2): Background/Atmosphere Can Contribute to Perceived Jank

**What you see:** occasional sluggishness, especially on lower-end devices.

**Likely root cause:**

- LivingAtmosphere runs:
  - Canvas particulate loop (requestAnimationFrame)
  - Motion blobs (Framer Motion)
  - Optional gyroscope star field transforms

This is fine on modern devices but can amplify any foreground work (choice handler, dynamic imports).

**Code pointers:**

- `components/LivingAtmosphere.tsx:51` (ParticulateOverlay animation loop)
- `components/LivingAtmosphere.tsx:285` (gyroscope star field)

**Recommendation direction:**

- Add a performance profile flag: reduce particles or disable canvas at low FPS (or behind reduce-motion / simplified-ui).

---

### F-UI-007 (P2): Choice Contrast Regression Evidence Exists (Needs Guard)

**What you see:** in `17_tess_choice_cards_contrast_issue.webp` the choice cards appear bright/washed-out with low text contrast.

**Likely root cause:** historically, the choice button variant fell back to light-mode outline styling in the dark UI, causing low contrast. In current code, `StatefulGameInterface` forces `glass={true}` when rendering `GameChoices`, which should prevent this regression.

**Evidence:** `docs/qa/screenshots-2026-02-12/17_tess_choice_cards_contrast_issue.webp`

**Code pointers:**

- `components/StatefulGameInterface.tsx:4147` (forces glass mode)
- `components/GameChoices.tsx:576` (variant glass vs outline)

**Recommendation direction:**

- Keep the forced glass mode and add a small JSDOM visual contract test:
  - choice buttons must not use light background classes when `glass=true`.

## 4) Suggested Fix Order (If/When We Act)

1. **Reduce pre-dispatch delay** in `useChoiceCommitment` (or dispatch immediately and animate concurrently).
2. **Fix state clobbering** by converting final `setState({ ... })` to functional merge and preserving menu flags from `prev`.
3. **Choose one frame system** (LivingAtmosphere vs app container border) and simplify double outlines.
4. **Stabilize footer height** (bottom sheet or consistent max height).
5. Restrict marquee-border to pivotal moments.

## 5) “Done When” Acceptance Criteria (UX)

- Clicking a choice updates to the next node within **<400ms p95** (excluding intentional typing effects).
- Opening Journal/Journey/Settings never closes due to a pending choice resolution.
- Dialogue card position changes are minimal between nodes (no “jumping” when choice count changes).
- Choice buttons maintain AA contrast in dark theme (no bright washed-out cards).

## 6) Applied Fixes (2026-02-13, Iteration B)

- Reduced pre-dispatch delay in `hooks/useChoiceCommitment.ts` (dispatch now occurs earlier in the animation sequence, with shorter intermediate waits).
- Stabilized choice-sheet behavior by enabling capped mode at **3+ choices** (previously 4+), reducing abrupt footer geometry changes between common node transitions.
- Added baseline min-height for non-capped (`1-2 choice`) response states in `components/StatefulGameInterface.tsx` to reduce vertical “snap” when moving between nodes.
- Stabilized `GameChoices` remount keying to `orderingSeed` rather than choice-text concatenation to avoid unnecessary remounts/jitter from cosmetic content changes.
- Updated regression contracts/tests:
  - `tests/components/game-choices-sheet-mode.test.tsx`
  - `tests/components/ui-layout-stability-contract.test.ts`
