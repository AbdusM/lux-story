# PRD: Grand Central Terminus — UI/UX Modernization (v2)

**Version:** 2.0
**Date:** March 3, 2026
**Author:** Abdus Muwwakkil + External Review (Claude)
**Project:** lux-story
**Status:** Ready for execution
**Updates from v1:** Incorporates full panel audit findings, overlay manager scope assessment (10 useState calls, 78 open-state checks, 135 lines of duplicated logic, 4 documented bugs), revised overlay architecture to stack model, tiered migration plan across 13 panel surfaces, z-index unification, accessibility contract modeled on BottomSheet.

---

## 1. Context & Motivation

Grand Central Terminus is a narrative career exploration game targeting Birmingham youth ages 14-24, mobile-first. The game has a strong atmospheric foundation (dark cinematic glassmorphism, teal accent system, Disco Elysium / Mass Effect inspiration) and sophisticated underlying systems (career constellation, journal, guardian network, skill tracking).

**The core problem is structural, not aesthetic.** The visual language is correct. But:

- **13 overlay/panel surfaces** manage their own state independently, creating keyboard leaks, escape key conflicts, z-index fights, and inconsistent accessibility
- **78 places** in the codebase check "is a panel open?" via scattered flags
- **135 lines** of duplicated open/close/toggle logic across panel components
- **4 documented bugs** directly caused by independent panel state (keyboard leaking to choices during settings, ambiguous selector targeting, incomplete blocking overlay gate, non-deterministic escape close order)
- Narrative card sizing pushes primary interactions below the fold on mobile
- Motion design is partially standardized (`lib/animations.ts` exists) but not enforced

This PRD defines the work to take the UI from ~7/10 to ~9/10 by fixing structural reliability, unifying the overlay system, and polishing interaction quality.

---

## 2. Tech Stack (No Changes)

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS 3 + CSS variables/tokens
- shadcn-style components + Radix UI primitives
- Framer Motion 12
- Zustand 5 (persisted) for game state
- Supabase backend + Anthropic/Gemini AI integrations
- Sentry monitoring
- Vitest + Playwright for testing
- Vercel deploy, GitHub Actions CI

---

## 3. Design System Foundation

### 3.1 Motion System (HIGHEST PRIORITY)

The single biggest quality lever. `lib/animations.ts` already has shared springs and `panelFromRight` — but per-component local variants are still common. This section makes the shared system the **only** system.

Consolidate into `lib/motion.ts` (or extend existing `lib/animations.ts`):

```typescript
// === SPRING CONFIGS ===
export const SPRING_BASE = { type: 'spring', stiffness: 300, damping: 30 } as const;
export const SPRING_GENTLE = { type: 'spring', stiffness: 200, damping: 25 } as const;
export const SPRING_SNAPPY = { type: 'spring', stiffness: 500, damping: 35 } as const;

// === PANEL VARIANTS ===

// Informational panels from right (Journal, Constellation)
export const panelSlideRight = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1, transition: SPRING_BASE },
  exit: { x: '100%', opacity: 0, transition: { ...SPRING_BASE, damping: 40 } },
};

// Bottom sheets and mobile full-screen panels
export const panelSlideUp = {
  initial: { y: '100%', opacity: 0 },
  animate: { y: 0, opacity: 1, transition: SPRING_BASE },
  exit: { y: '100%', opacity: 0, transition: { ...SPRING_BASE, damping: 40 } },
};

// Popovers and dropdown panels (Settings)
export const panelDropDown = {
  initial: { y: -20, opacity: 0, scale: 0.95 },
  animate: { y: 0, opacity: 1, scale: 1, transition: SPRING_SNAPPY },
  exit: { y: -10, opacity: 0, scale: 0.97, transition: { duration: 0.15 } },
};

// Centered modals (Report, JourneySummary, LoginModal, etc.)
export const modalCenter = {
  initial: { opacity: 0, scale: 0.93 },
  animate: { opacity: 1, scale: 1, transition: SPRING_BASE },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.15 } },
};

// Cinematic full-screen (IdentityCeremony, JourneyComplete)
export const cinematicFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.4, ease: 'easeIn' } },
};

// Backdrop overlay (shared by all panels that dim background)
export const backdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

// === INTERACTION VARIANTS ===

export const choiceEntrance = {
  initial: { y: 12, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: SPRING_BASE },
};

export const choiceStagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export const interactiveHover = { scale: 1.015, transition: SPRING_SNAPPY };
export const interactiveTap = { scale: 0.985, transition: SPRING_SNAPPY };

export const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 0px 0px rgba(45, 212, 191, 0)',
      '0 0 12px 4px rgba(45, 212, 191, 0.3)',
      '0 0 0px 0px rgba(45, 212, 191, 0)',
    ],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
};
```

**Acceptance criteria:**
- [ ] Every `motion.div`, `AnimatePresence`, and animation in the codebase uses configs from the shared motion file
- [ ] No component defines its own `transition: { duration: 0.3, ease: 'easeInOut' }` inline
- [ ] All local animation variant definitions in panel components are removed and replaced with shared imports
- [ ] Panel open/close animations feel physically consistent — same "weight" across all surfaces
- [ ] Choice buttons enter with stagger, not all-at-once pop

### 3.2 Glassmorphism Token System

Standardize glass effect layers. Currently inconsistent across components.

Add to `app/globals.css` (or consolidate with existing CSS variables):

```css
:root {
  /* Glass layers */
  --glass-surface: rgba(15, 15, 25, 0.7);
  --glass-surface-elevated: rgba(20, 20, 35, 0.8);
  --glass-surface-overlay: rgba(10, 10, 20, 0.85);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-border-active: rgba(45, 212, 191, 0.3);
  --glass-blur: 16px;
  --glass-blur-heavy: 24px;

  /* Accent system */
  --accent-primary: rgba(45, 212, 191, 1);        /* teal — interactive */
  --accent-primary-glow: rgba(45, 212, 191, 0.3);
  --accent-secondary: rgba(212, 175, 55, 1);       /* gold — narrative/lore */
  --accent-secondary-glow: rgba(212, 175, 55, 0.3);
  --accent-danger: rgba(239, 68, 68, 1);           /* red — energy/warnings */

  /* Text hierarchy */
  --text-primary: rgba(255, 255, 255, 0.95);
  --text-secondary: rgba(255, 255, 255, 0.65);
  --text-tertiary: rgba(255, 255, 255, 0.4);
  --text-narrative: rgba(230, 220, 200, 0.9);      /* warm off-white for story text */

  /* Spacing scale */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
}
```

**Acceptance criteria:**
- [ ] Every component using glass effects references these tokens, not inline rgba values
- [ ] Changing `--glass-surface` updates every glass panel in the app
- [ ] Accent colors used consistently: teal = interactive, gold = narrative/lore, red = energy/warnings

### 3.3 Typography Scale

```css
:root {
  --font-narrative: 'your-monospace-font', ui-monospace, monospace;
  --font-ui: 'your-sans-font', system-ui, sans-serif;

  --text-narrative-size: clamp(1rem, 2.5vw, 1.125rem);
  --text-narrative-leading: 1.7;
  --text-narrative-max-width: 65ch;

  --text-ui-xs: 0.75rem;
  --text-ui-sm: 0.875rem;
  --text-ui-base: 1rem;
  --text-ui-lg: 1.125rem;

  --text-choice-size: clamp(0.9375rem, 2vw, 1.0625rem);
  --text-choice-leading: 1.5;
}
```

**Acceptance criteria:**
- [ ] Narrative text uses `--font-narrative` everywhere
- [ ] UI chrome uses `--font-ui`
- [ ] No hardcoded font-size values in component files

### 3.4 Z-Index Scale (NEW — replaces mixed system)

Current state: combination of semantic `Z_INDEX` constants in `lib/ui-constants.ts` and hardcoded values (`z-50`, `z-[100]`, `z-[101]`). This has already caused stacking regressions.

Replace with a single ordered scale in `lib/ui-constants.ts`:

```typescript
export const Z_INDEX = {
  atmosphere: 0,        // LivingAtmosphere background layers
  gameContent: 10,      // Narrative card, choices
  stickyHeader: 20,     // Fixed header bar
  stickyFooter: 20,     // Sticky choice container
  backdrop: 30,         // Panel/modal backdrop overlay
  panel: 40,            // Side panels: journal, constellation, settings
  modalBackdrop: 50,    // Modal backdrop (on top of panels)
  modal: 60,            // Stacked modals: report, journey summary, login, detail
  toast: 70,            // Toast notifications
  criticalModal: 80,    // Idle warning, error overlay — always on top
} as const;
```

The overlay manager stack determines render order within a z-level — higher stack position renders later in the DOM, so it visually sits on top without needing a unique z-index per panel.

**Acceptance criteria:**
- [ ] Zero hardcoded `z-50`, `z-[100]`, `z-[101]` etc. anywhere in the codebase
- [ ] Every component references `Z_INDEX.*` from `lib/ui-constants.ts`
- [ ] Stacking order is correct when multiple overlays are open (e.g., DetailModal on top of ConstellationPanel)

---

## 4. Overlay Manager Architecture

### 4.1 Decision: Centralize (Confirmed)

The scope assessment makes this clear:
- **10** `useState` calls managing panel visibility
- **78** places checking "is a panel open?"
- **135** lines of duplicated open/close/toggle logic
- **4** bugs directly caused by independent state
- **13** total overlay surfaces

A centralized overlay manager will eliminate the keyboard leaking bug, the escape precedence bug, the blocking overlay gap, and z-index conflicts — all as side effects of having one source of truth.

### 4.2 Overlay Stack Model

Use a **stack** (not single `activePanel`) because legitimate nested overlays exist: DetailModal opens from within ConstellationPanel, LoginModal opens from within UnifiedMenu.

Add to `lib/game-store.ts` as a Zustand slice:

```typescript
type OverlayId =
  | 'journal'
  | 'constellation'
  | 'settings'
  | 'report'
  | 'journeySummary'
  | 'identityCeremony'
  | 'journeyComplete'
  | 'bottomSheet'
  | 'shortcutsHelp'
  | 'idleWarning'
  | 'loginModal'
  | 'detailModal'
  | 'error';

interface OverlayEntry {
  id: OverlayId;
  data?: Record<string, unknown>;  // optional payload (e.g., which detail item)
}

interface OverlaySlice {
  overlayStack: OverlayEntry[];

  // Actions
  pushOverlay: (id: OverlayId, data?: Record<string, unknown>) => void;
  popOverlay: () => void;
  closeAll: () => void;
  closeOverlay: (id: OverlayId) => void;  // close a specific overlay anywhere in stack

  // Derived (implement as getters or selectors)
  // topOverlay: OverlayId | null
  // hasBlockingOverlay: boolean
  // isOverlayOpen: (id: OverlayId) => boolean
}
```

**Behavioral rules:**

1. **Escape** always pops the top of the stack (`popOverlay`)
2. **Backdrop click** pops the top of the stack
3. **`pushOverlay`** adds to stack — allows nesting (DetailModal on top of Constellation)
4. **`hasBlockingOverlay`** is derived: `overlayStack.length > 0` — replaces the manual `hasBlockingOverlay` flag in StatefulGameInterface that currently misses settings
5. **Mutual exclusion for same-tier panels:** pushing a Tier 1 panel (journal, constellation, settings) while another Tier 1 is open should replace it, not stack. Stacking is only for child modals (DetailModal on Constellation, LoginModal on Settings). Implement via a `tier` or `exclusive` flag per overlay type:

```typescript
const OVERLAY_CONFIG: Record<OverlayId, { tier: number; animation: string }> = {
  journal:           { tier: 1, animation: 'panelSlideRight' },
  constellation:     { tier: 1, animation: 'panelSlideRight' },
  settings:          { tier: 1, animation: 'panelDropDown' },
  bottomSheet:       { tier: 1, animation: 'panelSlideUp' },
  report:            { tier: 2, animation: 'modalCenter' },
  journeySummary:    { tier: 2, animation: 'modalCenter' },
  shortcutsHelp:     { tier: 2, animation: 'modalCenter' },
  loginModal:        { tier: 2, animation: 'modalCenter' },
  detailModal:       { tier: 2, animation: 'panelSlideUp' },
  identityCeremony:  { tier: 3, animation: 'cinematicFade' },
  journeyComplete:   { tier: 3, animation: 'cinematicFade' },
  idleWarning:       { tier: 4, animation: 'modalCenter' },
  error:             { tier: 4, animation: 'modalCenter' },
};

// In pushOverlay logic:
// If new overlay has same tier as current top, replace (pop then push)
// If new overlay has higher tier, push on top (stack)
// Tier 4 (critical) always pushes on top regardless
```

### 4.3 Panel Spatial Model

| Panel | Desktop | Mobile | Animation | Z-Level |
|-------|---------|--------|-----------|---------|
| Journal | Right drawer, 400px | Full-screen from right | `panelSlideRight` | `panel` (40) |
| Constellation | Right drawer, 480px | Full-screen from right | `panelSlideRight` | `panel` (40) |
| Settings | Popover anchored to gear | Bottom sheet (half) | `panelDropDown` / `panelSlideUp` | `panel` (40) |
| BottomSheet | Not used (inline choices) | Bottom sheet | `panelSlideUp` | `panel` (40) |
| StrategyReport | Centered modal, max-w-2xl | Full-screen | `modalCenter` | `modal` (60) |
| JourneySummary | Centered modal card | Full-screen | `modalCenter` | `modal` (60) |
| KeyboardShortcutsHelp | Centered modal | Centered modal | `modalCenter` | `modal` (60) |
| LoginModal | Centered modal | Centered modal | `modalCenter` | `modal` (60) |
| DetailModal | Bottom-docked sheet | Bottom-docked sheet | `panelSlideUp` | `modal` (60) |
| IdentityCeremony | Full-screen cinematic | Full-screen cinematic | `cinematicFade` | `modal` (60) |
| JourneyComplete | Full-screen | Full-screen | `cinematicFade` | `modal` (60) |
| IdleWarningModal | Centered blocking | Centered blocking | `modalCenter` | `criticalModal` (80) |
| Error overlay | Centered blocking | Centered blocking | `modalCenter` | `criticalModal` (80) |

### 4.4 Panel Component Contract

Every panel component must implement this interface after migration:

```typescript
interface PanelProps {
  isOpen: boolean;
  onClose: () => void;
  data?: Record<string, unknown>;  // optional payload from overlay stack
}
```

**Internal requirements for every panel:**
- Uses `AnimatePresence` + shared motion variants from `lib/motion.ts`
- Renders a backdrop overlay (using shared `backdrop` variant) — except for cinematic overlays which may handle differently
- Implements `role="dialog"` and `aria-modal="true"`
- Implements focus trap when open (model after BottomSheet's existing implementation)
- Returns focus to trigger element on close
- Implements body scroll lock on mobile (model after BottomSheet)
- On mobile (< 768px): renders as full-screen or bottom-sheet per spatial model table
- On desktop: renders as drawer, popover, or centered modal per spatial model table
- Uses `Z_INDEX` constants for z-index values, never hardcoded
- Does NOT manage its own open/close state — receives `isOpen` from overlay manager

**BottomSheet is the reference implementation.** It already has `aria-modal`, focus trap, Escape handling, body scroll lock. Use it as the template for migrating other panels.

### 4.5 Tiered Migration Plan

Do NOT refactor 13 surfaces at once. Migrate in tiers:

**Tier 1 — Core Gameplay (migrate first)**

| Surface | Component | Current State Mgmt | Migration Work |
|---------|-----------|-------------------|----------------|
| Journal | `Journal.tsx` | Parent `showJournal` in StatefulGameInterface state object | Move to overlay stack, remove from state object |
| Constellation | `ConstellationPanel.tsx` | Parent `showConstellation` in StatefulGameInterface state object | Move to overlay stack, remove from state object |
| Settings | `UnifiedMenu.tsx` | Local `isOpen` useState | Move to overlay stack, remove local state, add to blocking overlay awareness |
| BottomSheet | `BottomSheet.tsx` | Parent `isChoicesBottomSheetOpen` | Move to overlay stack — already has strong a11y, minimal changes |

**Why first:** These are hit every session. The keyboard leaking bug, escape precedence issue, and blocking overlay gap all live here. Fixing Tier 1 resolves all 4 documented bugs.

**Tier 2 — Endgame/Progression**

| Surface | Component | Current State Mgmt | Migration Work |
|---------|-----------|-------------------|----------------|
| StrategyReport | `StrategyReport.tsx` | Parent `showReport` | Move to overlay stack, add dialog semantics + focus trap |
| JourneySummary | `JourneySummary.tsx` | Parent `showJourneySummary` | Move to overlay stack, add dialog role + focus trap |
| IdentityCeremony | `IdentityCeremony.tsx` | Parent `showIdentityCeremony` | Move to overlay stack |
| JourneyComplete | `JourneyComplete.tsx` | Parent `showPatternEnding` | Move to overlay stack |

**Why second:** Important but triggered less frequently. Lower risk, lower urgency.

**Tier 3 — Utility**

| Surface | Component | Current State Mgmt | Migration Work |
|---------|-----------|-------------------|----------------|
| KeyboardShortcutsHelp | `KeyboardShortcutsHelp.tsx` | Parent `showShortcutsHelp` | Move to overlay stack, add dialog semantics |
| IdleWarningModal | `IdleWarningModal.tsx` | Local `showWarning` | Move to overlay stack as Tier 4 critical |
| LoginModal | `LoginModal.tsx` | Local `showLoginModal` in UnifiedMenu | Move to overlay stack, add dialog semantics |
| DetailModal | `DetailModal.tsx` | Local `detailItem` in ConstellationPanel | Move to overlay stack with data payload |
| Error overlay | Inline in StatefulGameInterface | `state.error` | Move to overlay stack as Tier 4 critical |

**Why third:** Lower traffic, lower risk. Some (IdleWarning, error) are critical-tier in z-index but rarely hit.

---

## 5. Game Screen Layout Fixes

### 5.1 Narrative Card — Content-Adaptive Height

**Current:** Fixed/large min-height creates massive dead space on short narrative text. On mobile, "The train slows down." takes ~60% of viewport while filling ~10% of the card. Choices pushed below fold.

**Target:**

```css
.narrative-container {
  min-height: 100px;
  max-height: 45vh;
  height: auto;
  overflow-y: auto;
  scroll-behavior: smooth;
}

@media (min-width: 768px) {
  .narrative-container {
    min-height: 160px;
    max-height: 55vh;
  }
}
```

When content exceeds `max-height`, card scrolls internally. Choices always remain visible below.

**Acceptance criteria:**
- [ ] iPhone 14: single-line narrative shows all 3 choices without scrolling
- [ ] iPhone 14: 10-paragraph narrative scrolls internally, choices remain pinned below
- [ ] Desktop: short narratives don't create excessive empty space
- [ ] Transition between narrative lengths uses Framer Motion layout animation

### 5.2 Choice Container — Responsive Padding

**Current:** `paddingBottom: 'max(64px, env(safe-area-inset-bottom, 64px))'` applied unconditionally.

**Target:**

```css
.choice-container {
  padding-bottom: max(var(--space-md), env(safe-area-inset-bottom));
}
```

**Acceptance criteria:**
- [ ] Desktop: no wasted bottom space
- [ ] iPhone Safari: choices clear of home indicator
- [ ] Android Chrome: choices clear of navigation bar
- [ ] Playwright visual regression tests pass on both viewports

### 5.3 Choice Button Polish

**Current:** Inconsistent teal glow borders — choices 1 and 3 have bright glow, choice 2 is muted. Reads as buggy or confusingly indicates state.

**Target:** Consistent base state, distinct hover/focus/active states.

```css
.choice-button {
  border: 1px solid var(--glass-border);
  background: var(--glass-surface);
  backdrop-filter: blur(var(--glass-blur));
}

.choice-button:hover,
.choice-button:focus-visible {
  border-color: var(--glass-border-active);
  box-shadow: 0 0 12px 2px var(--accent-primary-glow);
}

.choice-button:active {
  background: var(--glass-surface-elevated);
}
```

Plus Framer Motion:
```tsx
<motion.button
  whileHover={interactiveHover}
  whileTap={interactiveTap}
>
```

**Acceptance criteria:**
- [ ] All choices identical in resting state
- [ ] Hover/focus-visible shows glow
- [ ] Active/tap provides scale feedback
- [ ] No inconsistent glow on initial render

### 5.4 "YOUR RESPONSE" Label

Remove entirely, or gate behind a first-play flag that shows it for the first 3 choice encounters then hides permanently. Replace with a thin horizontal rule or 8px gap increase if needed for visual separation.

**Acceptance criteria:**
- [ ] Label not visible after player's 3rd choice encounter (or removed entirely)
- [ ] Visual separation between narrative and choices is maintained without label

---

## 6. Keyboard & Interaction Fixes

### 6.1 Scope Keyboard Handlers

**Current bug:** Global `window.addEventListener('keydown')` in `GameChoices.tsx` fires even when settings or other non-blocking UI is open.

**Fix:** Use the overlay manager's `hasBlockingOverlay` (which now covers ALL overlays) plus an event target guard:

```typescript
const handleKeyDown = (event: KeyboardEvent) => {
  // Guard 1: Don't fire when ANY overlay is open
  const { overlayStack } = useGameStore.getState();
  if (overlayStack.length > 0 || isProcessing) return;

  // Guard 2: Don't fire when focus is in form controls or dialogs
  const target = event.target as HTMLElement;
  const tag = target.tagName.toLowerCase();
  if (
    tag === 'input' || tag === 'select' || tag === 'textarea' ||
    tag === 'button' || target.isContentEditable ||
    target.closest('[role="dialog"]') ||
    target.closest('[data-menu-panel]')
  ) return;

  // ... existing key handling logic
};
```

**Acceptance criteria:**
- [ ] Settings open + press 1-9 → no choice committed
- [ ] Journal open + press 1-9 → no choice committed
- [ ] Constellation open + press 1-9 → no choice committed
- [ ] No overlay + press 1-3 → corresponding choice committed
- [ ] Arrow keys navigate choices only when game surface is active

### 6.2 Fix data-choice-index Targeting

**Current bug:** `data-choice-index` on both motion wrapper div and button. `querySelector` hits wrapper first.

**Fix:**
1. Remove `data-choice-index` from motion wrapper divs
2. Keep only on `<button>` elements
3. Update all selectors to `button[data-choice-index="N"]`

**Files:** `GameChoices.tsx` (~L463, ~L587), `StatefulGameInterface.tsx` (~L576)

**Acceptance criteria:**
- [ ] `document.querySelectorAll('[data-choice-index]').length` equals number of choices (not 2x)
- [ ] Keyboard shortcut `1` triggers `.click()` on the actual button element
- [ ] Focus scrolling targets buttons

### 6.3 Unified Escape Handler

**Current bug:** Parent Escape handler closes only a subset first (Journal → Constellation → Report → Shortcuts). Other overlays have their own Escape logic or none. Non-deterministic when surfaces overlap.

**Fix:** With the overlay manager, Escape handling becomes trivial:

```typescript
// Single global Escape handler in StatefulGameInterface or a provider:
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      const { overlayStack, popOverlay } = useGameStore.getState();
      if (overlayStack.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        popOverlay(); // always pops the top overlay
      }
    }
  };
  window.addEventListener('keydown', handleEscape);
  return () => window.removeEventListener('keydown', handleEscape);
}, []);
```

Remove all per-component Escape listeners from individual panel components. Escape behavior is now deterministic: always closes the topmost overlay.

**Acceptance criteria:**
- [ ] With ConstellationPanel open + DetailModal on top: Escape closes DetailModal first, second Escape closes Constellation
- [ ] With Settings open: Escape closes Settings
- [ ] No panel has its own redundant Escape listener
- [ ] Escape with no overlays open does nothing (or clears choice focus per existing behavior)

---

## 7. Accessibility Contract

### 7.1 Reference Implementation: BottomSheet

`BottomSheet.tsx` already implements the gold standard for this codebase: `role="dialog"`, `aria-modal="true"`, focus trap, Escape close, body scroll lock. Every panel must match this baseline.

### 7.2 Required A11y for Every Panel

| Requirement | Currently Strong | Currently Missing |
|---|---|---|
| `role="dialog"` | Journal, Constellation, DetailModal, UnifiedMenu | StrategyReport, JourneySummary, KeyboardShortcutsHelp, LoginModal |
| `aria-modal="true"` | BottomSheet | UnifiedMenu, StrategyReport, JourneySummary, KeyboardShortcutsHelp, LoginModal |
| Focus trap | BottomSheet | UnifiedMenu, StrategyReport, JourneySummary, KeyboardShortcutsHelp, LoginModal |
| Escape to close | Most panels (via various mechanisms) | Consistent handling needed — move to overlay manager |
| Focus return to trigger | BottomSheet | All others |
| Body scroll lock (mobile) | BottomSheet | All full-screen panels |

### 7.3 Implementation Pattern

For each panel during migration, add:

```tsx
// Focus trap — use Radix FocusTrap or manual implementation
// Model after BottomSheet's existing focus trap logic

// On open:
const previousFocus = useRef<HTMLElement | null>(null);
useEffect(() => {
  if (isOpen) {
    previousFocus.current = document.activeElement as HTMLElement;
    // Focus first focusable element in panel
  }
  return () => {
    if (!isOpen && previousFocus.current) {
      previousFocus.current.focus();
    }
  };
}, [isOpen]);

// Body scroll lock on mobile:
useEffect(() => {
  if (isOpen && isMobile) {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }
}, [isOpen, isMobile]);
```

**Acceptance criteria:**
- [ ] Every panel passes keyboard-only navigation test (Tab cycles within panel, doesn't leak behind)
- [ ] Every panel has `role="dialog"` and `aria-modal="true"`
- [ ] Focus returns to trigger element after panel closes
- [ ] Body scroll is locked when full-screen panels are open on mobile

---

## 8. Discoverability & Contextual Surfacing

### 8.1 Journal — Surface After Meaningful Moments

```tsx
if (choiceHasNarrativeWeight) {
  toast({
    icon: <BookOpen className="w-4 h-4" />,
    message: "Journal updated",
    action: { label: "View", onClick: () => pushOverlay('journal') },
    duration: 4000,
  });
}
```

### 8.2 Constellation — Pulse on Career Insight

```tsx
<motion.button
  animate={hasNewInsight ? glowPulse.animate : undefined}
  onClick={() => pushOverlay('constellation')}
>
  <Sparkles className="w-5 h-5" />
  {hasNewInsight && <span className="notification-dot" />}
</motion.button>
```

### 8.3 Progressive Header Reveal

First-time players see minimal header (title + settings). As systems become relevant, icons appear:
- Journal icon appears after first journal-worthy narrative event
- Constellation icon appears after first career insight
- Sync indicator appears after first save

```typescript
// Gate icon visibility on game progress flags from Zustand store
const hasEncounteredJournal = useGameStore(s => s.progress.journalUnlocked);
const hasEncounteredConstellation = useGameStore(s => s.progress.constellationUnlocked);
```

### 8.4 Existing Contextual Entry Points to Preserve

The audit found these non-header entry points already exist — keep them working through the overlay manager migration:
- `j` keyboard shortcut → Journal
- `c` keyboard shortcut → Constellation
- `r` keyboard shortcut → Report
- `?` keyboard shortcut → Shortcuts help
- ReturnHookPrompt CTA → Constellation
- Ending screen "See Your Journey" → JourneySummary
- Ending screen "Export Career Profile" → StrategyReport
- Inactivity timer → IdleWarning
- Constellation item actions → DetailModal

All of these should call `pushOverlay(id)` after migration.

**Acceptance criteria:**
- [ ] New players see clean, minimal header
- [ ] Each icon appears when its system becomes relevant
- [ ] Contextual toasts guide players to panels without forcing
- [ ] Badge/pulse indicators clear when player opens the relevant panel
- [ ] All existing keyboard shortcuts and contextual triggers work through overlay manager

---

## 9. Mobile-Specific Requirements

### 9.1 Touch Targets
Every interactive element: minimum 44×44px. Audit:
- Choice buttons (likely fine — full-width)
- Header icon buttons (verify — they look small in screenshots)
- Settings panel controls (toggles, selects)
- Panel close buttons
- All in-panel interactive elements

### 9.2 Safe Area Handling
Use `env(safe-area-inset-*)` consistently. No hardcoded pixel fallbacks.

### 9.3 Viewport Units
Use `dvh` instead of `vh` for full-screen calculations:
```css
.game-container { height: 100dvh; }
```

### 9.4 Mobile Panel Behavior
Per spatial model: Journal, Constellation, Report, Ceremony, JourneyComplete → full-screen on mobile. Settings → bottom sheet (half-screen). Modals → centered. BottomSheet → bottom sheet. These breakpoint behaviors must be explicit, not implied by CSS overflow.

---

## 10. Quality Benchmarks

### Visual
- [ ] Glass surfaces use tokens from Section 3.2
- [ ] Animations use configs from shared motion file
- [ ] Typography uses scale from Section 3.3
- [ ] Z-index uses `Z_INDEX` constants from Section 3.4
- [ ] Consistent border-radius: `rounded-xl` for panels, `rounded-lg` for buttons

### Interaction
- [ ] Every panel managed by overlay manager
- [ ] Every panel has focus trap, aria-modal, escape-to-close, focus return
- [ ] Every interactive element has hover, focus-visible, and active states
- [ ] Touch targets 44×44px minimum
- [ ] Keyboard navigation works end-to-end without mouse

### Performance
- [ ] Panels mount/unmount cleanly (no leaked event listeners)
- [ ] Animations at 60fps on mid-range phones (test on throttled DevTools CPU)
- [ ] `backdrop-filter: blur()` GPU-accelerated
- [ ] No layout thrashing during panel open/close

### Testing
- [ ] Every panel has Vitest component test (renders, opens, closes, traps focus)
- [ ] Playwright e2e covers panel flows on desktop + mobile viewports
- [ ] Zero React prop warnings in test output
- [ ] Escape key behavior tested for single overlay and stacked overlay scenarios

---

## 11. Execution Order

### Phase 1 — Foundation (everything else depends on this)
1. Create/consolidate shared motion configs in `lib/motion.ts`
2. Standardize CSS variable tokens (Sections 3.2, 3.3)
3. Unify z-index scale (Section 3.4)
4. Fix `data-choice-index` selector ambiguity (Section 6.2) — quick win, 30 min
5. Build overlay manager Zustand slice (Section 4.2)

### Phase 2 — Core Panel Migration (Tier 1 — biggest bug fixes)
6. Migrate Journal to overlay manager
7. Migrate Constellation to overlay manager
8. Migrate UnifiedMenu (Settings) to overlay manager
9. Migrate BottomSheet to overlay manager
10. Implement unified Escape handler (Section 6.3)
11. Update keyboard scoping to use `overlayStack.length > 0` (Section 6.1)
12. Remove old `hasBlockingOverlay` manual flag from StatefulGameInterface

### Phase 3 — Layout Fixes (biggest UX wins)
13. Narrative card content-adaptive height (Section 5.1)
14. Choice container responsive padding (Section 5.2)
15. Choice button polish (Section 5.3)
16. Remove/gate "YOUR RESPONSE" label (Section 5.4)

### Phase 4 — Remaining Panel Migration (Tier 2 + 3)
17. Migrate StrategyReport, JourneySummary, IdentityCeremony, JourneyComplete
18. Migrate KeyboardShortcutsHelp, IdleWarningModal, LoginModal, DetailModal, error overlay
19. Add missing accessibility to all migrated panels (Section 7)
20. Remove all per-component Escape listeners and local open/close state

### Phase 5 — Discoverability & Polish
21. Journal contextual toast (Section 8.1)
22. Constellation pulse indicator (Section 8.2)
23. Progressive header reveal (Section 8.3)
24. Verify all existing contextual entry points work through overlay manager (Section 8.4)

### Phase 6 — Final Quality Pass
25. Mobile audit (touch targets, safe areas, dvh) (Section 9)
26. Performance pass (60fps animations, no layout thrash)
27. Test coverage pass (Vitest + Playwright)
28. Suppress Framer Motion test prop warnings
29. Full keyboard-only navigation walkthrough
30. Cross-browser verification (Chrome, Safari, Firefox on desktop + mobile)

---

## 12. What "Done" Looks Like

When this PRD is fully executed:

1. A first-time player on iPhone sees narrative text and all choices without scrolling
2. Pressing any key while any overlay is open has zero effect on game choices
3. Escape key always closes the topmost overlay, deterministically
4. Every panel opens/closes with consistent spring-based animation from a shared config
5. Players discover journal and constellation through contextual prompts, not icon hunting
6. The entire app can change its color temperature by editing 5 CSS variables
7. Every panel is accessible via keyboard alone with proper focus management
8. Only one same-tier panel is ever open at a time; child modals stack correctly on top
9. Z-index conflicts are impossible because all values come from a single ordered scale
10. Playwright tests pass on desktop Chrome, mobile Safari, and mobile Chrome viewports
11. The game feels like a polished product built by a team of 20, not a prototype

---

## Appendix A: Full Panel Inventory Reference

| # | Surface | Component | Tier | State Source | Animation | Z-Level | A11y Status |
|---|---------|-----------|------|-------------|-----------|---------|-------------|
| 1 | Journal | `Journal.tsx` | 1 | Parent state object | `panelSlideRight` | panel (40) | Good — has role=dialog |
| 2 | Constellation | `ConstellationPanel.tsx` | 1 | Parent state object | `panelSlideRight` | panel (40) | Good — has role=dialog |
| 3 | Settings | `UnifiedMenu.tsx` | 1 | Local useState | `panelDropDown` | panel (40) | Partial — no aria-modal, no focus trap |
| 4 | BottomSheet | `BottomSheet.tsx` | 1 | Parent boolean | `panelSlideUp` | panel (40) | Strong — reference implementation |
| 5 | Report | `StrategyReport.tsx` | 2 | Parent state object | `modalCenter` | modal (60) | Missing — no dialog semantics |
| 6 | Journey Summary | `JourneySummary.tsx` | 2 | Parent state object | `modalCenter` | modal (60) | Partial — Escape works, no dialog role |
| 7 | Identity Ceremony | `IdentityCeremony.tsx` | 2 | Parent state object | `cinematicFade` | modal (60) | Minimal — tap to close only |
| 8 | Journey Complete | `JourneyComplete.tsx` | 2 | Parent state object | `cinematicFade` | modal (60) | Minimal — button to close |
| 9 | Shortcuts Help | `KeyboardShortcutsHelp.tsx` | 3 | Parent boolean | `modalCenter` | modal (60) | Partial — no dialog role, no focus trap |
| 10 | Idle Warning | `IdleWarningModal.tsx` | 3 | Local useState | `modalCenter` | critical (80) | Partial |
| 11 | Login Modal | `LoginModal.tsx` | 3 | Local in UnifiedMenu | `modalCenter` | modal (60) | Partial — no dialog role |
| 12 | Detail Modal | `DetailModal.tsx` | 3 | Local in ConstellationPanel | `panelSlideUp` | modal (60) | Good — has dialog role |
| 13 | Error Overlay | Inline in StatefulGameInterface | 3 | `state.error` | `modalCenter` | critical (80) | Minimal |

## Appendix B: Reference Apps for Quality Bar

Study for interaction patterns and motion quality:

- **Linear** — panel transitions, keyboard shortcuts, spring-based feel
- **Raycast** — command palette, micro-interactions, dark UI polish
- **Disco Elysium** — narrative UI pacing, atmospheric integration, choice presentation
- **Hades (Supergiant)** — menu transitions, information hierarchy in game UI
- **Apple Music (iOS)** — bottom sheet behavior, full-screen panel transitions

## Appendix C: Files Modified by This PRD

Comprehensive list of files expected to be touched:

**New files:**
- `lib/motion.ts` (or extend `lib/animations.ts`)
- Overlay manager slice in `lib/game-store.ts`

**Modified — Core:**
- `components/StatefulGameInterface.tsx` — remove hasBlockingOverlay manual flag, remove per-panel state from state object, connect to overlay manager, update keyboard handler, update rendering to read from overlay stack
- `components/GameChoices.tsx` — keyboard scoping guard, fix data-choice-index
- `lib/ui-constants.ts` — unified z-index scale
- `app/globals.css` — token standardization

**Modified — Panels (all 13):**
- `components/Journal.tsx`
- `components/constellation/ConstellationPanel.tsx`
- `components/constellation/DetailModal.tsx`
- `components/UnifiedMenu.tsx`
- `components/ui/BottomSheet.tsx`
- `components/career/StrategyReport.tsx`
- `components/JourneySummary.tsx`
- `components/IdentityCeremony.tsx`
- `components/JourneyComplete.tsx`
- `components/KeyboardShortcutsHelp.tsx`
- `components/IdleWarningModal.tsx`
- `components/auth/LoginModal.tsx`
- Error overlay section in `StatefulGameInterface.tsx`

**Modified — Tests:**
- New: `tests/components/keyboard-scoping.test.tsx`
- New: `tests/components/overlay-manager.test.tsx`
- New: `tests/e2e/panel-flows.spec.ts`
- Updated: existing panel component tests
