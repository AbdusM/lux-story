# Panel Architecture Answers

Date: March 3, 2026
Project: `lux-story`

This answers the 8 architecture questions from the extraction brief using repository evidence.

## 1. Panel Inventory (component, open trigger, close trigger, mobile behavior)

| Surface | Component | Opens From | Closes Via | Mobile Form |
|---|---|---|---|---|
| Journal / Prism | `components/Journal.tsx` | Header `Open Journal` button; keyboard shortcut `j` (`toggleJournal`) | Backdrop click, close button, Escape, pull-to-dismiss drag | Inset full-height side panel (`fixed` inset with mobile drag handle) |
| Constellation / Your Journey | `components/constellation/ConstellationPanel.tsx` | Header `Open Skill Constellation` button; keyboard shortcut `c`; ReturnHook prompt CTA | Backdrop click, close button, Escape, swipe-right drag | Inset panel, near-full-screen on mobile |
| Settings menu | `components/UnifiedMenu.tsx` | Header settings icon | Backdrop click, close icon, Escape, action click | Floating popover card (not full-screen) |
| Career report overlay | `components/career/StrategyReport.tsx` | UnifiedMenu `Career Profile`; keyboard shortcut `r`; ending CTA `Export Career Profile` | Close button, global Escape handler in parent | Full-screen overlay |
| Journey summary overlay | `components/JourneySummary.tsx` | Ending CTA `See Your Journey` when journey complete | Backdrop click, X button, Escape, ceremonial close | Centered modal card |
| Pattern identity ceremony | `components/IdentityCeremony.tsx` | Programmatic trigger in state machine when pattern internalization occurs | Tap anywhere (`onComplete`) | Full-screen cinematic overlay |
| Pattern ending screen | `components/JourneyComplete.tsx` | Programmatic trigger (`showPatternEnding`) | `Return to Station Checkpoint` button | Full-screen overlay |
| Choice bottom sheet | `components/ui/BottomSheet.tsx` | Footer trigger when `preparedChoices.length > 3` | Backdrop tap, swipe-down threshold, Escape, choosing an option | True bottom sheet |
| Keyboard shortcuts help | `components/KeyboardShortcutsHelp.tsx` | Keyboard shortcut `?` (`openHelp`) | Backdrop click, close button, parent Escape handler | Centered modal |
| Idle warning modal | `components/IdleWarningModal.tsx` | Inactivity timer (5 min idle, 2 min countdown) | Continue button, auto timeout callback | Centered modal |
| Login modal (settings account path) | `components/auth/LoginModal.tsx` | UnifiedMenu account actions | Backdrop click, close button, successful auth close | Centered modal |
| Constellation detail modal | `components/constellation/DetailModal.tsx` | Constellation item detail actions | Backdrop click, Escape, close controls | Bottom-docked sheet-style modal |
| Runtime error overlay | Inline in `StatefulGameInterface` | Programmatic when `state.error` set | Refresh / Dismiss buttons | Centered blocking modal |

## 2. State Management Per Panel

- Parent-orchestrated (`StatefulGameInterface` state object): `showJournal`, `showConstellation`, `showJourneySummary`, `showReport`, `showIdentityCeremony`, `showPatternEnding`.
- Parent local booleans: `showShortcutsHelp`, `isChoicesBottomSheetOpen`.
- Local to panel component:
  - `UnifiedMenu`: `isOpen`, `showLoginModal`.
  - `IdleWarningModal`: `showWarning`.
  - `ConstellationPanel`: `detailItem` (controls nested `DetailModal`).
- Global store (Zustand) is not currently the primary open/close owner for these overlays; it primarily carries game/core state, skills, and scene navigation.

## 3. Panel Stacking and Multi-Open Behavior

- Stacking is mixed between semantic constants (`Z_INDEX` in `lib/ui-constants.ts`) and hardcoded z-index classes (`z-50`, `z-[100]`, `z-[101]`).
- `hasBlockingOverlay` in `StatefulGameInterface` only includes Journal, Constellation, JourneySummary, Report.
- Because UnifiedMenu, KeyboardShortcutsHelp, IdleWarning, and LoginModal are independently owned, simultaneous open combinations are possible unless manually closed by local logic.
- There is no centralized overlay manager enforcing strict mutual exclusivity.

## 4. Animation Approach Per Panel

- Hybrid model:
  - Shared variants/constants in `lib/animations.ts` (`springs`, `backdrop`, `panelFromRight`, etc.).
  - Per-component local variants still common (e.g., `DetailModal`, `JourneySummary`, `UnifiedMenu`).
- Net: partially standardized, not fully centralized.

## 5. Accessibility Status by Panel

- Strong:
  - `BottomSheet`: `role="dialog"`, `aria-modal`, focus trap, Escape close, body scroll lock.
  - `Journal` / `ConstellationPanel` / `DetailModal`: dialog roles + Escape close.
- Partial / gaps:
  - `UnifiedMenu`: `role="dialog"` but no `aria-modal`, no focus trap, no focus return.
  - `KeyboardShortcutsHelp`: modal/backdrop and close button, but no explicit `role="dialog"`/`aria-modal` and no focus trap.
  - `StrategyReport`: full-screen overlay without explicit dialog semantics/focus trap.
  - `JourneySummary`: closes via Escape but no explicit dialog role/focus trap.
  - `LoginModal`: modal UX present but no explicit `role="dialog"`/`aria-modal`.

## 6. Mobile Behavior Per Panel

- Full-screen/inset-full surfaces: Journal, Constellation, StrategyReport, IdentityCeremony, JourneyComplete, error overlay.
- Centered floating cards: JourneySummary, KeyboardShortcutsHelp, LoginModal, IdleWarning.
- Floating popover: UnifiedMenu (does not become full-screen on mobile).
- Bottom-docked: BottomSheet, Constellation `DetailModal`.

## 7. Panel Entry Points Beyond Header Icons

- Keyboard shortcuts:
  - `j` Journal, `c` Constellation, `r` Report, `?` Shortcuts help.
- Return-hook prompt (`ReturnHookPrompt`) can open Constellation directly (`onOpenJourney`).
- Ending screen actions:
  - `See Your Journey` opens JourneySummary.
  - `Export Career Profile` opens StrategyReport.
- Inactivity system opens IdleWarning automatically.
- Constellation item actions open DetailModal (character/skill/quest details).

## 8. Known Panel Bugs / Friction (Current)

- Numeric choice shortcuts can fire while interacting with non-game UI because `GameChoices` keydown handler is global and target-unaware.
- `data-choice-index` is duplicated on wrapper + button, making selector targeting ambiguous for shortcut handlers.
- Blocking overlay logic does not include settings menu state, so menu-open is not part of interaction guard rails.
- Footer uses fixed 64px safe-area padding pattern globally, reducing usable viewport where mobile chrome compensation is unnecessary.
- Overlay semantics and focus management are inconsistent across panels due decentralized ownership.

## Notes on Screenshots

Per latest direction, screenshot extraction was intentionally deprioritized in this pass; focus here is architecture + source-level reviewer context.
