# Grand Central Terminus — UI/UX Modernization

Software Development Plan (SDP) based on `analysis/reviewer-assets/panels/gct-ui-modernization-prd-v2.md`

**Date:** March 3, 2026  
**Repo:** `lux-story`  
**Primary goal:** Make panels/overlays deterministic, accessible, and input-safe without losing the existing visual mood.  
**Non-scope:** Narrative/content rewrites, AI/back-end feature work, broad design-system refactors outside gameplay + overlay surfaces.

---

## 0) Executive Summary

The PRD’s direction is correct: the biggest UX issues are structural (overlay state fragmentation + keyboard leakage + inconsistent a11y + stacking drift), not aesthetic.

This SDP makes the PRD shippable and safer by:
- tightening requirements into metadata-driven overlay behavior (dismiss rules, blocking rules, exclusivity rules),
- correcting risky prescriptions (choice Motion gestures, nested scroll by default, focus-return snippet, “stack length = blocking”),
- explicitly addressing keyboard conflicts/duplication (multiple global listeners, `j` conflict, number-key duplication, Tab hijack risk),
- scoping “unify motion/z-index/tokens” enforcement to overlay + gameplay surfaces first to avoid churn.

The plan is phased so each phase can ship independently, reducing regression risk.

---

## 1) Evidence-Based Baseline (Verified From Repo)

Source bundle + counts live in:
- `analysis/reviewer-assets/panels/findings-and-back-and-forth.md`
- `analysis/reviewer-assets/panels/panel-architecture-answers.md`
- `analysis/reviewer-assets/panels/overlay-manager-scope.md`

High-signal facts:
- 13 overlay/panel surfaces exist (Journal, Constellation, Settings, Report, JourneySummary, IdentityCeremony, JourneyComplete, BottomSheet, ShortcutsHelp, IdleWarning, LoginModal, DetailModal, Error overlay).
- Overlay open state is fragmented (parent-owned booleans in `components/StatefulGameInterface.tsx` plus local state in `components/UnifiedMenu.tsx`, `components/IdleWarningModal.tsx`, `components/constellation/ConstellationPanel.tsx`).
- Keyboard handling is duplicated and global:
  - `hooks/useKeyboardShortcuts.ts` adds a global `window` keydown listener.
  - `components/GameChoices.tsx` also adds a global `window` keydown listener for number keys + arrows + `j/k`.
- Confirmed bugs tied to this fragmentation:
  - numeric choice keys can commit a choice while the settings menu is open (no overlay/menu scoping),
  - `data-choice-index` is duplicated on wrapper and button; shortcut handlers query `[data-choice-index="N"]` and can target the wrapper,
  - “blocking overlay” gates don’t include settings/menu state,
  - Escape close precedence is partial and not deterministic when multiple surfaces overlap.

---

## 2) PRD Errata / Clarifications (Resolve Before Implementation)

### 2.1 Focus return snippet in PRD is not reliable

The PRD’s focus-return pseudo-code uses cleanup semantics that can miss close events in practice.

**Decision:** Implement focus restore as an explicit, tested pattern:
- store `document.activeElement` on open,
- focus first focusable inside overlay (or overlay container),
- on close, restore focus to saved element (if still connected).

### 2.2 Do not reintroduce `whileTap/whileHover` on choice buttons

`components/GameChoices.tsx` explicitly removed Motion gestures due to touch-scroll interference.

**Decision:** Use CSS/Tailwind `:active` feedback for choice buttons; only use Motion gestures where known safe (non-scroll containers, `pointer:fine`, etc.).

### 2.3 Backdrop dismissal is not universal

“Backdrop click pops top” is unsafe for critical or cinematic overlays (IdleWarning, Error, IdentityCeremony).

**Decision:** Dismissal is per-overlay metadata:
- `dismissOnBackdrop`
- `dismissOnEscape`
- close button always closes (explicit action), even if backdrop/escape don’t.

### 2.4 Avoid nested scroll by default for narrative container

Internal narrative scroll (`max-height` + `overflow-y`) can create nested-scroll regressions on mobile (momentum scroll, scroll chaining, “stuck” scroll).

**Decision:** Provide two implementations and choose during Phase 5 based on mobile testing:
- Option A (preferred): single scroll surface; reduce large fixed/min heights that push choices below fold.
- Option B (fallback): internal narrative scroll only for long content, with clear affordance and mobile-only gating.

### 2.5 “Blocking overlay = stack length” is too coarse

Some overlays should block gameplay input, but not all should necessarily block global shortcuts (and vice versa).

**Decision:** Overlay config defines:
- `blocksGameplayInput`
- `blocksGlobalShortcuts`

### 2.6 Keyboard conflicts/duplication must be resolved explicitly

Current conflicts that need a policy (not “just guard more”):
- `j` is both “Toggle Journal” globally and “ArrowDown” (vim) inside `GameChoices`.
- number keys are handled in both `GameChoices` and global shortcuts (`selectChoiceN` in `StatefulGameInterface`).
- global shortcut `focusChoices` bound to raw `Tab` can break keyboard navigation and accessibility expectations.

**Decision:** Establish one canonical owner per key path (see Section 4.4).

### 2.7 Settings is an anchored popover on desktop

An “anchored” surface can’t be rendered like a full-screen modal/drawer without handling anchor positioning.

**Decision:** Treat Settings as:
- desktop: anchored overlay (Radix Popover recommended),
- mobile: half-height bottom sheet (reuse the BottomSheet surface pattern),
while still using centralized overlay state for “open/close” and “blocking”.

### 2.8 Scope sanity: standardize overlays first, not the whole app

PRD acceptance criteria like “no inline z-index anywhere” and “no inline motion anywhere” are too broad for a safe sprint.

**Decision:** Enforce tokenized z-index + shared motion variants for gameplay + the 13 overlay surfaces first; expand later only if it’s cheap and stable.

### 2.9 Phase 0 Decisions (Locked Defaults)

These defaults remove the Phase 0 “stall risk” and let implementation start immediately:
- Settings on mobile: **half-screen bottom sheet**.
- Narrative scroll: **Option A (single scroll surface)** unless mobile testing proves it cannot meet the fold requirement.
- Numeric choice keys: **global shortcut system** is the canonical owner (`selectChoiceN`); remove numeric handling from `components/GameChoices.tsx`.
- `j/k` vim navigation in choices: **remove** (arrow keys only) so `j` can remain “Toggle Journal”.
- `focusChoices`: **remove the shortcut entirely**; keep Tab’s native behavior (and rely on arrow keys + normal focus order).

---

## 3) Improvement Strategy (Execution Principles)

- Ship in slices: each phase lands in prod without depending on later phases.
- Make overlay behavior data-driven: central “what happens on Escape/backdrop, what blocks input, what’s exclusive” lives in config.
- Minimize global listeners: prefer one global keyboard dispatcher; avoid per-component `window.addEventListener` unless there is a strong reason.
- A11y baseline is non-negotiable for overlays: `role="dialog"`, `aria-modal` where appropriate, focus trap (or equivalent), focus restore, mobile scroll lock when needed.
- Prefer boring geometry: z-index and stacking are deterministic via a small number of layers and DOM order, not ad-hoc `z-[101]`.

---

## 4) Target Architecture

### 4.1 Overlay Store (stack + metadata)

Implement a stack with config-driven behavior.

Recommended location:
- If we want minimal change: add a slice to `lib/game-store.ts` (ensure it is not persisted via `partialize`).
- If we want isolation: create `lib/overlay-store.ts` (no persistence) and keep gameplay store unchanged.

Core types:
- `OverlayId`
- `OverlayEntry { id, data?, openedAt }`
- `OverlayConfig { tier, intent, exclusiveGroup?, dismissOnEscape, dismissOnBackdrop, blocksGameplayInput, blocksGlobalShortcuts, allowedShortcutsWhenBlocked, lockBodyScroll, focusTrap, zLayer, renderMode, closeAffordance }`
- `DismissReason = 'escape' | 'backdrop' | 'closeButton' | 'programmatic'`

Policy contracts (to prevent drift):
- Prefer named `intent` values (`panel` | `modal` | `cinematic` | `critical`) and derive `tier` from intent (tier is an ordering mechanism, intent is the meaning).
- Make dangerous config fields non-optional (no implicit defaults) so TypeScript forces decisions for new overlays.
- Add runtime validation (Zod is already in the repo) for the overlay config to prevent silent misconfiguration in production builds.
- Declare that overlay store is for blocking/stacking surfaces; lightweight anchored UI (tooltips, non-blocking menus) stays local state unless it must block gameplay input.

Core actions:
- `pushOverlay(id, data?)`
  - enforce `exclusiveGroup` replacement for Tier-1 surfaces (Settings/Journal/Constellation/BottomSheet).
  - allow stacking for Tier-2+ (DetailModal on Constellation; LoginModal from Settings).
- `popOverlay({ reason })`
  - only pops if top entry is dismissible for the given reason.
- `closeOverlay(id, { reason })` and `closeAll({ reason })`

Derived selectors:
- `isOverlayOpen(id)`
- `topOverlayId`
- `blocksGameplayInput` (any open overlay where config blocks gameplay)
- `blocksGlobalShortcuts` (any open overlay where config blocks shortcuts)

### 4.2 Rendering Strategy (Host + Anchored)

Use two rendering patterns:

1) **OverlayHost (single stacking context)** for: drawers, bottom sheets, full-screen overlays, and center modals.
- Renders stack entries that are `renderMode: 'host'`.
- Owns the shared backdrop and Escape/backdrop dismissal plumbing.

2) **Anchored overlays** for: Settings popover (desktop).
- Render near the trigger using Radix Popover (or similar), but drive `open` from overlay state (single source of truth).
- Still participate in “blocking” via overlay metadata.

For Settings on mobile, use the host-rendered bottom sheet variant so tap targets and scrolling remain ergonomic.

This keeps anchored positioning correct without adding “anchorRect measurement” complexity to the overlay host, while still providing a mobile-appropriate presentation.

Portal policy (avoid z-index nondeterminism during migration):
- Prefer rendering `OverlayHost` in-tree (as the last child in `StatefulGameInterface`) until all overlays are migrated.
- If portals are introduced, all overlays must share the same portal root and no legacy overlays may render outside host/popover.

Render-mode parity contract (Settings):
- One `OverlayId: settings`, one config, one source of truth for open/close.
- Implement a single `SettingsOverlay` component that renders as Popover (desktop) or Sheet (mobile) based on media query, and shares:
  - focus capture/trap + restore behavior,
  - dismissal gating (Escape/outside click),
  - blocking flags and instrumentation,
  - close affordances (no breakpoint-specific “extra X” surprises).
- Verification case: open Settings, Tab-cycle, Escape, click outside, then resize across breakpoint while open; no stuck focus, no orphan overlay state.

### 4.3 Shared Overlay Primitives

Create shared primitives so migrated overlays don’t each reinvent:
- `OverlayBackdrop` (animation + z-layer + click behavior)
- `OverlaySurface` (glass tokens + border radius + max sizes + safe area paddings)
- `useOverlayFocus` (capture, focus-first, restore)
- `useBodyScrollLock` (iOS-safe lock; reuse BottomSheet’s proven approach)

Accessibility contract tightening:
- For `intent: panel` and `intent: modal` when `blocksGameplayInput = true`: must have `role="dialog"` + `aria-modal="true"` and must trap focus (Radix Dialog primitives are preferred to avoid custom trap bugs).
- For `intent: critical`: same as modal, plus no backdrop dismissal by default.
- For `intent: cinematic`: no focus trap required by default (unless it contains interactive controls), but must block gameplay input and must not expose an “X close” affordance by default.

Scroll-lock + scroll-container policy:
- When `lockBodyScroll` is active, prevent background scroll and avoid scroll chaining:
  - lock body scroll using the same proven mechanism across overlays,
  - internal scroll regions use `overscroll-behavior: contain` where applicable,
  - test iOS rubber-banding and “scroll behind overlay” cases explicitly (Section 7).

### 4.4 Keyboard & Input Architecture (Unification Plan)

Goals:
- No accidental choice commits while interacting with overlay UI.
- No double-handling (same key path handled by multiple listeners).
- No keymap collisions (`j` journal vs vim down).
- No accessibility regressions (avoid hijacking raw `Tab`).

Decisions:
- **Single global shortcut listener**: keep `hooks/useKeyboardShortcuts.ts` as the canonical global listener.
- Update the global listener to immediately return if `event.defaultPrevented` (prevents double-trigger when a local handler already handled the key).
- Gate shortcuts using overlay selectors + explicit allowlist:
  - if `blocksGlobalShortcuts` is true, ignore shortcuts except those explicitly allowlisted (default: Escape only, routed to overlay pop if dismissible).
- Input safety gates (must be implemented before any overlay migration):
  - ignore when `event.isComposing === true` or `event.keyCode === 229` (IME),
  - ignore when target is editable (`input`, `textarea`, `select`, `contentEditable`, or role-equivalent),
  - do not intercept browser-native navigation keys (Tab/Shift+Tab, etc.).

PreventDefault ownership contract:
- The canonical global dispatcher calls `preventDefault()` only for shortcuts it actually consumes.
- Local key handlers should be rare; when used they must `preventDefault()` for keys they consume so the global dispatcher can respect `event.defaultPrevented`.

Choice key handling (pick one canonical owner):
- Locked decision: remove number-key direct selection from `components/GameChoices.tsx` and use the global shortcut actions (`selectChoiceN`) as the only numeric path.
  - Keeps choice keys customizable via the existing shortcut UI.
  - Requires `data-choice-index` selector fix (Phase 1) to be reliable.

Resolve `j/k` conflict:
- Locked decision: remove vim `j/k` navigation in `GameChoices` (keep arrow keys) so `j` remains “Toggle Journal”.

Tab hijack (`focusChoices`):
- Locked decision: do not bind focus behavior to raw `Tab`.
  - Additionally: remove `focusChoices` shortcut entirely unless a proven power-user need emerges.

### 4.5 Layout Strategy (Narrative + Answer/Choice Containers)

Layout success criteria:
- Mobile: narrative plus choices visible without scrolling on short narrative.
- Mobile: long narrative remains readable without creating scroll-jank.
- Desktop: remove “mobile-only padding hacks” that waste viewport.

Implementation approach:
- Prefer reducing fixed/min heights that cause dead space.
- Prefer one scroll container; only add nested narrative scroll as a validated fallback.

### 4.6 Motion/Z-Index/Tokens Standardization (Scoped)

- Motion: extend `lib/animations.ts` (already used by panels). Avoid introducing a second “motion config” file unless there’s clear duplication.
- Z-index: keep `lib/ui-constants.ts` as the canonical scale; tighten usage for overlay surfaces first (avoid an all-codebase “hunt everything” refactor).
- Tokens: apply glass tokens and consistent radii to overlay surfaces and gameplay containers first.

---

## 5) Overlay Inventory + Initial Config (Decision Table)

This table is the “no guessing” execution contract.

Legend:
- `tier`: 1 (panels/popovers/bottom sheet), 2 (modals), 3 (cinematic), 4 (critical)
- `exclusiveGroup`: only one open at a time within the group
- `lockBodyScroll`: `never` | `mobile` | `always`
- `renderMode`: `host` | `anchored`
- `closeAffordance`: `x` | `explicit` | `none`

| OverlayId | Component | tier | intent | exclusiveGroup | dismissOnEscape | dismissOnBackdrop | blocksGameplayInput | blocksGlobalShortcuts | lockBodyScroll | renderMode | closeAffordance |
|---|---|---:|---|---|---:|---:|---:|---:|---|---|---|
| `journal` | `components/Journal.tsx` | 1 | panel | `primaryPanel` | true | true | true | true | mobile | host | x |
| `constellation` | `components/constellation/ConstellationPanel.tsx` | 1 | panel | `primaryPanel` | true | true | true | true | mobile | host | x |
| `settings` | `components/UnifiedMenu.tsx` | 1 | panel | `primaryPanel` | true | true | true | true | mobile | anchored (desktop), host (mobile) | explicit |
| `bottomSheet` | `components/ui/BottomSheet.tsx` | 1 | panel | `primaryPanel` | true | true | true | true | mobile | host | explicit |
| `report` | `components/career/StrategyReport.tsx` | 2 | modal |  | true | false | true | true | mobile | host | explicit |
| `journeySummary` | `components/JourneySummary.tsx` | 2 | modal |  | true | true | true | true | mobile | host | x |
| `shortcutsHelp` | `components/KeyboardShortcutsHelp.tsx` | 2 | modal |  | true | true | true | true | never | host | x |
| `loginModal` | `components/auth/LoginModal.tsx` | 2 | modal |  | true | true | true | true | never | host | x |
| `detailModal` | `components/constellation/DetailModal.tsx` | 2 | modal |  | true | true | true | true | mobile | host | explicit |
| `identityCeremony` | `components/IdentityCeremony.tsx` | 3 | cinematic | `cinematic` | false | false | true | true | always | host | explicit |
| `journeyComplete` | `components/JourneyComplete.tsx` | 3 | cinematic | `cinematic` | false | false | true | true | always | host | explicit |
| `idleWarning` | `components/IdleWarningModal.tsx` | 4 | critical | `critical` | false | false | true | true | never | host | explicit |
| `error` | inline in `components/StatefulGameInterface.tsx` | 4 | critical | `critical` | false | false | true | true | never | host | explicit |

Notes:
- Backdrop dismiss defaults to false for critical/cinematic surfaces; only explicit controls end them.
- Report backdrop dismiss is set false here intentionally (avoid accidental loss of context).
- Unless explicitly needed, set `allowedShortcutsWhenBlocked = ['escape']` for all overlays to keep shortcut behavior predictable while blocked.

---

## 6) Work Plan (Phased, Shippable)

### Phase 0 — Decision Lock + PRD Delta (0.5 day)

Deliverables:
- Finalize overlay config table (Section 5) with product sign-off for critical dismissal rules.
- Apply locked defaults in Section 2.9 (or document any intentional deviation).
- Patch PRD to reflect the corrected requirements (focus return, choice motion, dismissal rules, keyboard ownership).

Exit criteria:
- No remaining “policy ambiguity” that would cause rework mid-implementation.

### Phase 1 — Quick Wins (1 day)

Deliverables:
- Fix `data-choice-index` duplication and update selectors to `button[data-choice-index="N"]`.
- Remove conflicting/duplicated choice key handling:
  - remove numeric selection handling from `components/GameChoices.tsx` (canonical owner becomes global shortcuts),
  - remove `j/k` choice navigation (arrow keys only).
- Fix keyboard scoping guard for choice commits (overlay-aware + target-aware).
- Add editable-target + IME gating to the global shortcut dispatcher (`event.isComposing`, keyCode 229, editable targets, etc.).
- Reduce desktop viewport waste from unconditional bottom padding (`max(64px, ...)`).
- Add `event.defaultPrevented` check to the global shortcut dispatcher to prevent double-firing.
- Remove the `focusChoices` shortcut entirely (or bind to `g` if retained) and keep Tab’s native behavior.
  - Locked default: remove it.

Exit criteria:
- Settings open + press `1-9` never commits a choice.
- `selectChoiceN` always targets a button element.

### Phase 2 — Overlay Manager Foundation (1–2 days)

Deliverables:
- Add overlay store slice (or standalone store) + config metadata.
- Add `OverlayHost` that renders host-managed overlays from the stack.
- Implement single, deterministic Escape/backdrop behavior:
  - Escape/backdrop pop only if allowed by config and `reason`.
- Add shared focus + scroll-lock primitives (reuse BottomSheet patterns).
- Add/confirm overlay-surface motion + z-index primitives used by `OverlayHost`:
  - shared overlay motion variants (extend `lib/animations.ts`),
  - overlay z-index layer contract (extend/tighten `lib/ui-constants.ts` for overlay surfaces).
- Remove any legacy “overlay rendered outside host/popover” patterns that would break stacking determinism once host rendering exists (start with the inline error overlay).

Exit criteria:
- Overlay stack push/pop invariants pass unit tests.
- Escape always closes topmost dismissible overlay (deterministic).

### Phase 3 — Tier 1 Migration (3–5 days)

Order:
1. Settings (`UnifiedMenu`) open state driven by overlay store (desktop anchored; mobile half-sheet), migrated together with its child overlays that can be launched from Settings (e.g., LoginModal, Report) to avoid mixed rendering.
2. Constellation migrated together with `DetailModal` to preserve stacking determinism.
3. Journal migrated.
4. BottomSheet migrated.

Deliverables:
- Remove local `isOpen` in Settings (and remove per-component Escape listener).
- Replace `StatefulGameInterface` boolean flags for Tier-1 surfaces with overlay selectors.
- Replace manual `hasBlockingOverlay` with config-driven selectors.

Exit criteria:
- Only one Tier-1 surface open at a time (exclusive group behavior).
- No keyboard leakage during any Tier-1 overlay.

### Phase 4 — Tier 2/3 + A11y Baseline (3–5 days)

Deliverables:
- Migrate Tier-2/3/4 overlays to overlay store:
  - JourneySummary, ShortcutsHelp, IdentityCeremony, JourneyComplete, IdleWarning, Error overlay.
- Standardize overlay semantics:
  - `role="dialog"`, `aria-modal` where appropriate,
  - focus trap + focus restore,
  - scroll lock per config.

Exit criteria:
- Keyboard-only navigation works across all overlays (Tab stays within overlays where appropriate; focus returns on close).
- All overlays follow the dismissal rules in the config table.

### Phase 5 — Layout Polish (1–2 days)

Deliverables:
- Implement chosen narrative/choices layout strategy (Option A preferred).
- Fix choice visual consistency (resting/focus/active states) without reintroducing touch regressions.
- Remove or gate “YOUR RESPONSE” label.

Exit criteria:
- iPhone 14: short narrative shows choices without scrolling.
- Desktop: no wasted bottom padding.

### Phase 6 — Tests, Perf, Cross-Browser (1–3 days)

Deliverables:
- Vitest:
  - overlay store invariants,
  - overlay host dismissal rules,
  - keyboard leakage prevention (settings open + number keys).
- Playwright:
  - desktop + mobile overlay flows,
  - stacked close ordering (Constellation -> DetailModal).
- Performance pass: blur layers and overlay animations on mid-range devices (CPU throttle check).

Exit criteria:
- CI green (unit + e2e).
- No leaked listeners (sanity check in devtools / code review).

---

## 7) Testing / QA Checklist

Manual QA matrix (minimum):
- iPhone Safari (safe area + scroll lock)
- Android Chrome (URL bar + bottom nav)
- Desktop Chrome + Firefox (keyboard navigation)

Regression checklist:
- Open Settings, interact with sliders/selects, press `1`/`2`/`j`, verify no gameplay state changes.
- Open Journal, open Constellation, ensure exclusivity for Tier-1 surfaces.
- Open Constellation, open DetailModal, Escape closes detail first.
- Verify focus restore returns to the trigger (settings icon, journal icon, constellation icon).

---

## 8) Metrics for “Modernized and Stable”

Track (informally via code search / review, formally via tests):
- Global keydown listeners reduced to 1 (or a strictly-controlled small number).
- Overlay open/close ownership consolidated (remove scattered `useState` booleans for overlays).
- Open-state checks reduced materially (target: from ~78 to < 20 for gameplay surfaces).
- “Blocking overlay” logic is config-derived (no manual boolean lists that can miss a surface).

---

## 9) Rollout / Backout Strategy

Default plan: incremental migration without a big feature flag.
- Overlay store/host lands first with no behavior changes (no overlays migrated yet).
- Each overlay migrates one-by-one, deleting its old state ownership at the same time (prevents dual-source-of-truth).

Guardrail invariant:
- Never have both the legacy state path and the overlay manager controlling the same overlay simultaneously. If an overlay migrates, the PR removes the old booleans/listeners/handlers in the same change.

Optional safety valve:
- A runtime flag (env or localStorage) that forces legacy overlay paths can be added if the team expects high risk. Only add if actually needed (it adds complexity).

---

## 10) Risk Register (Top)

- Touch regressions from Motion gestures in scrollable containers.
  - Mitigation: keep choice interactions CSS-driven; audit Motion usage on mobile.
- Nested scroll regressions from internal narrative scroll.
  - Mitigation: Option A single-scroll by default; Option B only as fallback.
- Incorrect dismissal rules for critical overlays.
  - Mitigation: config defaults + unit tests for dismissal by reason.
- Anchored Settings positioning regressions if not using a proper popover primitive.
  - Mitigation: use Radix Popover; keep anchor rendering local to header.
- Keyboard conflicts remain if not resolved early.
  - Mitigation: Phase 0 policy lock; Phase 1 `defaultPrevented` gating + keymap cleanup.

---

## 11) Open Questions (Optional, Not Blocking Execution)

None currently. If product wants a different behavior, it should be recorded as a deliberate deviation from Sections 2.9 and 5.
