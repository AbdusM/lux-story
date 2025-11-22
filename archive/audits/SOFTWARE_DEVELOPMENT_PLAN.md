# Software Development Plan: UI/UX Polish & System Hardening

**Goal:** Implement the UI/UX enhancements defined in `DESIGN_AUDIT_REPORT.md` and resolve persistent type safety issues to ensure a robust, production-ready application.

**Timeline:** 3-4 Days (Estimated)

---

## Phase 1: Core Experience Upgrade (High Impact)

### 1. "KILL THE TYPEWRITER" (Text Rendering Engine)
**Objective:** Replace character-by-character typing with cognitive-friendly "Staggered Fade-In".
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

### 2. Layout Architecture (Desktop vs. Mobile)
**Objective:** Optimize screen real estate usage and solve "Choice Paralysis".
*   [ ] **Implement Grid Layout (Desktop):**
    *   Update `StatefulGameInterface.tsx` to use a CSS Grid / Flex row layout on `md:` breakpoints.
    *   **Left Col (Main):** Dialogue & Choices (65% width).
    *   **Right Col (Context):** Trust Meter, Recent Skills, Admin Tools (35% width).
    *   Ensure mobile stays single-column (Stack).
*   [ ] **Refine Choice Layout (`GameChoices.tsx`):**
    *   **Desktop:** Switch from vertical stack (`space-y-3`) to a 2-column grid (`grid-cols-2 gap-4`) for choices when > 4 options exist.
    *   **Mobile:** Keep vertical stack but ensure tap targets are min 48px height.

### 3. "Juice" & Interaction Feedback
**Objective:** Provide immediate physical response to input.
*   [ ] **Enhance `GameChoices.tsx` Buttons:**
    *   Add `framer-motion` `whileTap={{ scale: 0.98 }}`.
    *   Implement **"Semantic Feedback"** props:
        *   `shake` prop for failure states (Marcus simulation).
        *   `glow` / `pulse` prop for high-trust/success moments.
*   [ ] **Ambient Backgrounds:**
    *   In `StatefulGameInterface.tsx`, add a subtle, blurred background layer that shifts color based on the character (e.g., Sterile Blue for Marcus, Warm Amber for Samuel).

---

## Phase 2: System Hardening & Security (Production Readiness)

### 4. Type Safety Remediation
**Objective:** Eliminate `ignoreBuildErrors: true` by resolving the 160+ persistent type errors.
*   [ ] **Admin Component Types:** Fix `profile` prop mismatches in `app/admin/[userId]/skills/page.tsx` and `SkillsAnalysisCard.tsx`.
*   [ ] **Prop Drilling Fixes:** Resolve `showConfigWarning` missing in state updates within `StatefulGameInterface.tsx`.
*   [ ] **Character ID Strictness:** Ensure `CharacterId` type definition is consistent across `lib/character-state.ts`, `lib/graph-registry.ts`, and `StatefulGameInterface.tsx` (specifically adding 'tess' and 'yaquin' everywhere).
*   [ ] **Skills System Types:** Resolve `keyof FutureSkills` mismatches in `scene-skill-mappings.ts` and `2030-skills-system.ts`.

### 5. Security & Data Integrity
**Objective:** Lock down the database and ensure data persistence.
*   [ ] **Row Level Security (RLS):**
    *   Create RLS policies for `player_profiles`, `skill_demonstrations`, `choice_history`.
    *   Ensure users can only read/write their own data.
    *   Create specific policies for Admin access.
*   [ ] **Database Migrations:**
    *   Verify all 11 migration files in `supabase/migrations/` are applied to production.
    *   Add specific indexes for high-traffic queries (e.g., `skill_demonstrations` by `user_id`).

### 6. Final Polish
*   [ ] **Navigation:** Move secondary actions (`Admin`, `Reset`) to a "Hamburger" menu on mobile.
*   [ ] **Typography Audit:** Verify `html { font-size: 16px; }` to prevent iOS zoom.
*   [ ] **Interruptibility Test:** Stress test all new animations to ensure they never block user input.

---

## Execution Strategy
1.  **Security First:** Implement RLS policies immediately to protect any new production data.
2.  **Type Safety:** Fix the build errors to enable strict CI/CD checks.
3.  **UX Upgrade:** Implement the "Kill the Typewriter" and Layout changes.
4.  **Polish:** Add the "Juice" and ambient effects last.