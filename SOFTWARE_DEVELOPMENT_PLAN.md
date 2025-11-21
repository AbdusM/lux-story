# Software Development Plan: UI/UX Polish Phase
## "The Living Terminal" Upgrade

**Goal:** Transform the current functional interface into a responsive, tactile, and cognitively efficient "Living Terminal" that respects the user's time and attention.

**Timeline:** 3-4 Days (Estimated)

---

## 1. "KILL THE TYPEWRITER" (Text Rendering Engine)
**Status:** 🔴 Critical Discrepancy. Currently rendering char-by-char in `RichTextRenderer.tsx` & `StreamingMessage.tsx`.
**Objective:** Replace with "Staggered Fade-In" (Word/Block reveal).

### Tasks:
*   [ ] **Refactor `RichTextRenderer.tsx`:**
    *   Remove `charDelay` logic.
    *   Implement `framer-motion` based rendering.
    *   Split content by paragraphs (`

`) or sentences.
    *   Apply `opacity: 0 -> 1` animation with staggered delays (e.g., `delay: index * 0.15`).
    *   **Constraint:** Must support "Instant Skip" (tap to show all).
*   [ ] **Deprecate `StreamingMessage.tsx`:**
    *   Replace usages with the new `RichTextRenderer` mode.
    *   Ensure "Thinking..." states use a pulsing block cursor or subtle fade, not a typing animation.

---

## 2. Layout Architecture (Desktop vs. Mobile)
**Status:** 🟡 Major Gap. Single column used everywhere. No "Context Sidebar."
**Objective:** Optimize screen real estate usage.

### Tasks:
*   [ ] **Implement Grid Layout (Desktop):**
    *   Update `StatefulGameInterface.tsx` to use a CSS Grid / Flex row layout on `md:` breakpoints.
    *   **Left Col (Main):** Dialogue & Choices (65% width).
    *   **Right Col (Context):** Trust Meter, Recent Skills, Admin Tools (35% width).
    *   Ensure mobile stays single-column (Stack).
*   [ ] **Refine Choice Layout (`GameChoices.tsx`):**
    *   **Desktop:** Switch from vertical stack (`space-y-3`) to a 2-column grid (`grid-cols-2 gap-4`) for choices when > 4 options exist.
    *   **Mobile:** Keep vertical stack but ensure tap targets are min 48px height.

---

## 3. "Juice" & Interaction Feedback
**Status:** 🔴 Missing. No tactile feedback on decisions.
**Objective:** Provide immediate physical response to input.

### Tasks:
*   [ ] **Enhance `GameChoices.tsx` Buttons:**
    *   Add `framer-motion` `whileTap={{ scale: 0.98 }}`.
    *   Implement **"Semantic Feedback"** props:
        *   `shake` prop for failure states (Marcus simulation).
        *   `glow` / `pulse` prop for high-trust/success moments.
*   [ ] **Ambient Backgrounds:**
    *   In `StatefulGameInterface.tsx`, add a subtle, blurred background layer that shifts color based on the character (e.g., Sterile Blue for Marcus, Warm Amber for Samuel).

---

## 4. Navigation & Chrome
**Status:** 🟡 Cluttered header on mobile.
**Objective:** "Cinema View" (Focus on content).

### Tasks:
*   [ ] **Dynamic Header (Mobile):**
    *   Implement "Scroll-away" logic for the top utility bar (`Admin`, `Reset`).
    *   Keep Character Name/Avatar sticky but minimal (small font) when scrolling down.
*   [ ] **"Hamburger" Menu:**
    *   Move secondary actions (`Admin`, `Reset`, `Export`) into a `DropdownMenu` (shadcn/ui) to declutter the visual field.

---

## 5. Cleanup & Optimization
**Status:** 🟢 Routine.
**Objective:** Ensure performance.

### Tasks:
*   [ ] **Audit Font Sizes:** Ensure `globals.css` sets `html { font-size: 16px; }` to prevent iOS zoom on inputs.
*   [ ] **Verify Interruptibility:** Stress test the "Tap to Skip" functionality on all new animations.

---

## Execution Order
1.  **Core Engine:** Fix Text Rendering (High Impact, High Risk).
2.  **Layout:** Implement Desktop Grid (High Visibility).
3.  **Interaction:** Add Button "Juice" (High Delight).
4.  **Chrome:** Polish Header/Menu (Low Risk).
