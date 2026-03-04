# Software Development Plan: Grand Central Terminus UI Stability + Overlay System

**Project:** `lux-story` (GCT game screen)
**Last updated:** March 4, 2026

This document is the execution plan and living contract for UI/UX modernization work on the GCT game screen.
It is referenced by `CLAUDE.md` and several code comments as the source of truth for UI stability contracts.

## Goals (What We’re Optimizing For)

- Deterministic overlay behavior (stacking, dismissal, blocking)
- Input-safe gameplay (no keyboard leakage into choices while overlays/menus are active)
- A11y baseline for every overlay surface (dialog semantics + focus trap + focus restore)
- Mobile-first stability (safe areas, `dvh`, touch targets, minimal layout thrash)
- Maintain the game’s existing visual mood (glass + cinematic dark atmosphere)

## Non-Goals (Deliberate Tradeoffs)

- Host-level **exit animations for overlay surfaces** are intentionally avoided for now.
  - Rationale: if the overlay store says “closed” while the UI is still animating out, gameplay/shortcuts can leak into the “exiting” surface.
  - Current approach: surfaces unmount immediately; only the **backdrop** may animate out safely.
- The same “no exit animations while store is closed” rule applies to **anchored** overlays (for example desktop Settings).
  - Anchored overlays may animate in, but they should unmount immediately on close to keep input blocking deterministic.

## Architecture (Current Implementation)

### Overlay Contracts

Single source of truth: **overlay store**.

- Config: [lib/overlay-config.ts](/Users/abdusmuwwakkil/Development/30_lux-story/lib/overlay-config.ts)
  - Zod-validated, no “optional defaults” for dangerous fields.
  - Encodes intent (`panel`/`modal`/`cinematic`/`critical`), dismissal rules, blocking, allowlists, scroll-lock, and render mode (`host` vs `anchored`).
- Store: [lib/overlay-store.ts](/Users/abdusmuwwakkil/Development/30_lux-story/lib/overlay-store.ts)
  - Deterministic tier ordering + exclusive groups.
  - Reason-based dismissal: `escape` | `backdrop` | `closeButton` | `programmatic`.
  - Blocking split:
    - `blocksGameplayInput` (committing choices)
    - `blocksGlobalShortcuts` (global key bindings)
  - Allowlist intersection while blocked (`allowedShortcutsWhenBlocked`).
- Host: [components/overlays/OverlayHost.tsx](/Users/abdusmuwwakkil/Development/30_lux-story/components/overlays/OverlayHost.tsx)
  - One fixed stacking context + centralized backdrop.
  - Backdrop is interactive only if the **top** host overlay allows backdrop dismissal.
  - Body scroll lock via [hooks/useBodyScrollLock.ts](/Users/abdusmuwwakkil/Development/30_lux-story/hooks/useBodyScrollLock.ts).
  - Backdrop can exit-animate; surfaces unmount immediately.

### Anchored vs Host Rendering

- Most overlays render inside `OverlayHost`.
- Some overlays are “anchored” to their trigger on desktop and “host” on mobile.
  - Example: `settings` is anchored on desktop, host-rendered on mobile.

### Keyboard/Shortcut Contracts

- Global dispatcher: [hooks/useKeyboardShortcuts.ts](/Users/abdusmuwwakkil/Development/30_lux-story/hooks/useKeyboardShortcuts.ts)
  - IME-safe (`isComposing`, `keyCode === 229`).
  - Editable-target gating (inputs/textareas/selects/contentEditable + ARIA textbox roles).
  - Overlay gating:
    - blocks gameplay input when any overlay blocks gameplay
    - blocks global shortcuts when any overlay blocks global shortcuts
    - allowlisted shortcuts may still fire (intersection across blocking overlays)
- Choice selection is canonicalized globally (numeric keys handled in one place).
  - `GameChoices` no longer owns numeric key handling.

### Focus Management (A11y Baseline)

- Shared focus trap + restore hook: [hooks/useFocusTrap.ts](/Users/abdusmuwwakkil/Development/30_lux-story/hooks/useFocusTrap.ts)
  - Traps Tab within `[data-overlay-surface]`.
  - Restores focus on close, but **only into remaining overlay surfaces** to avoid focus jumping “behind” a newly opened overlay.

## Stability Contracts (Hard Rules)

- Never have two sources of truth controlling the same overlay’s open state.
- Any overlay must be either:
  - rendered by `OverlayHost` (host mode), or
  - rendered anchored to its trigger (anchored mode) while still using overlay-store state.
- Overlay surfaces must include:
  - `role="dialog"`
  - `aria-modal="true"`
  - `data-overlay-surface`
  - `tabIndex={-1}` and the `useFocusTrap` `onKeyDown` handler
- `OverlayHost` wraps entries with `pointer-events-none`; every actual surface must use `pointer-events-auto`.

## What’s Completed (Implemented + Tested)

- Config-driven overlay stack with deterministic tiers/exclusive groups
- Centralized backdrop + body scroll lock policy
- Focus trap + guarded focus restore across overlays
- Input-safe global keyboard shortcuts with overlay gating + editable/IME protection
- Settings parity (desktop anchored, mobile host sheet) with a single overlay id (`settings`)
- Removed “Your Response” label (reclaimed vertical space)
- Fixed “inconsistent resting border” on choices by removing D-007 preview border-color mutation (glow only)
- Build hygiene: exclude `analysis/` from Next typechecking so reviewer artifacts don’t break builds

## Remaining PRD Backlog (Next)

1. Extended visual/perf pass
   - Optional: capture desktop/mobile panel snapshots for reviewer packaging.
2. Optional product refinements
   - Additional contextual surfacing copy and timing tuning based on playtest signal.

### Recently Completed (March 4, 2026)

- Radix portal z-index alignment:
  - Updated shadcn/Radix portal surfaces to use `Z_INDEX` tokens so popovers/tooltips/select menus
    don’t render behind the overlay stack.
  - Files: `components/ui/select.tsx`, `components/ui/dropdown-menu.tsx`, `components/ui/tooltip.tsx`, `components/ui/dialog.tsx`
- Settings parity e2e coverage:
  - Added `tests/e2e/user-flows/settings-parity.spec.ts` and wired it into the `core-game` Playwright project.
  - Dedicated constrained lane is green in CI (`test-settings-parity` job in Playwright workflow).
  - Local constrained run passed: `npm run test:e2e:settings-parity`.
  - Evidence: `analysis/reviewer-assets/panels/evidence/settings-parity-local-2026-03-04.txt`.
- CSP hardening + explicit exception policy lock:
  - Production CSP removes `unsafe-eval` and adds baseline directives (`object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`, `form-action 'self'`).
  - `unsafe-inline` is now an explicit, toggle-gated exception (`CSP_ALLOW_UNSAFE_INLINE_SCRIPT`, `CSP_ALLOW_UNSAFE_INLINE_STYLE`) while Next static-page inline scripts remain.
  - Release smoke now enforces scoped inline usage and hardened directives (`scripts/ci/release-smoke.mjs`).
- Overlay motion standardization (gameplay + overlay surfaces):
  - Added shared variants/transitions in `lib/animations.ts` (`panelDropDown`, `modalCenter`, `cinematicFade`, `cinematicReveal`, `tabContentSwap`, `tabContentSwapReduced`, `transitions.linearTick`).
  - Migrated overlay surfaces off ad-hoc local variants where practical (`UnifiedMenu`, `Journal`, `ConstellationPanel`, `DetailModal`, `JourneyComplete`, `SettingsMobileSheet`, `BottomSheet`, `IdleWarningModal`, `LoginModalContents`).
- Discoverability + progressive disclosure:
  - Added one-time contextual toasts for Journal/Constellation surfacing in `StatefulGameInterface`.
  - Added progressive status disclosure in `StationStatusBadge` (advanced diagnostics reveal after meaningful interaction).
- Glass/typography token alignment:
  - Added PRD v2 token aliases (`--glass-surface*`, `--accent-*`, `--font-ui`, `--font-narrative`) and utility classes in `app/globals.css`.
  - Updated `JourneySummary` narrative text to use `font-narrative` class instead of inline `Georgia` styles.
- Overlay perf benchmark lane:
  - Added isolated `overlay-perf` Playwright project + spec (`tests/e2e/user-flows/overlay-smoothness.spec.ts`).
  - Added manual CI workflow lane (`.github/workflows/overlay-perf.yml`) for stable benchmark capture.
  - Latest successful benchmark run: `Overlay Perf Benchmarks` (`22688229426`), with metrics artifact:
    `analysis/reviewer-assets/panels/evidence/overlay-perf-ci-2026-03-04.txt`.

## “Done” Definition

We consider the modernization complete when:

- Pressing keys while any overlay is open never commits gameplay choices.
- Escape/backdrop dismissal is deterministic and per-overlay-configured.
- Every overlay is keyboard operable with focus trap + proper dialog semantics.
- Mobile layout remains stable: safe areas respected; no “choices below fold” regressions.
- `npm run type-check`, `npm run test:run`, and `npm run build` stay green.
