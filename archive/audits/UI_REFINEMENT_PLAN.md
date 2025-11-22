# UI/UX Refinement Plan: Addressing "Kinks" & Imperfections

**Goal:** Polish the newly implemented "Living Terminal" UI to eliminate interaction bugs, standardize animations, and ensure accessibility compliance.

**Target:** `components/GameChoices.tsx` and `components/RichTextRenderer.tsx`

---

## 1. Fix Broken Feedback Animations ("The Kink")
**Issue:** In `GameChoices.tsx`, the `animate` prop logic is flawed. It merges strings inappropriately (`animate={feedbackAnimate ? "animate" : "animate"}`), causing `shake` and `glow` variants to be ignored entirely.
**Fix:** Use the variant name directly or pass the definition object correctly.
*   [ ] **Update `ChoiceButton` in `GameChoices.tsx`:**
    *   Correctly switch between "animate" (standard entry) and "shake"/"glow" variants.
    *   Ensure `initial="initial"` doesn't override the feedback state.

## 2. Standardize Animation Physics ("The Feel")
**Issue:** `RichTextRenderer` uses `easeOut` (linear-ish) while `GameChoices` uses implicit defaults (spring). This creates a disjointed feel—text "slides" but buttons "bounce."
**Fix:** Adopt a unified "Snappy Spring" physics model for all interactive elements.
*   [ ] **Define Global Spring Config:**
    *   `{ type: "spring", stiffness: 400, damping: 30 }` (Fast, minimal bounce).
    *   Apply this to both text stagger and button entry.

## 3. Accessibility & Polish ("The Safety")
**Issue:** Animations play regardless of user preference, and rapid text skipping might feel jarring.
**Fix:** Respect `prefers-reduced-motion` and improve skip logic.
*   [ ] **RichTextRenderer Refinements:**
    *   Add `layout` prop to `motion.div` to prevent layout thrashing during stagger.
    *   Use `useReducedMotion()` hook to disable stagger effects if requested.
*   [ ] **GameChoices Refinements:**
    *   Ensure focus states (`focus-visible`) match the new "Juice" styles (scale/border).

---

## Execution
1.  **Patch `GameChoices.tsx`** (High Priority - Bug Fix).
2.  **Tune `RichTextRenderer.tsx`** (Polish - Animation consistency).
