# Overlay Manager Scope Assessment

Date: March 3, 2026
Project: `lux-story`

This is a static, code-search-based scope estimate to help decide if a centralized overlay manager refactor is worth it.

## 1) Total lines of open/close/toggle logic across panel components

Estimated count: **135 lines**

Method used:
- Grep pattern over panel/overlay components for open/close/toggle semantics (`isOpen`, `open`, `onClose`, `setIsOpen`, `setShow*`, `toggle`, `Escape`, etc.).
- Files scanned:
  - `Journal.tsx`
  - `ConstellationPanel.tsx`
  - `UnifiedMenu.tsx`
  - `BottomSheet.tsx`
  - `JourneySummary.tsx`
  - `StrategyReport.tsx`
  - `IdentityCeremony.tsx`
  - `JourneyComplete.tsx`
  - `KeyboardShortcutsHelp.tsx`
  - `IdleWarningModal.tsx`
  - `LoginModal.tsx`
  - `DetailModal.tsx`

Interpretation:
- This is directional, not a perfect semantic AST count.
- It still indicates substantial duplicated state/close-path logic distributed across many files.

## 2) Total number of `useState` calls dedicated to panel open/close

- **Gameplay-runtime focused estimate:** **10 `useState` calls**

Breakdown:
- `StatefulGameInterface`:
  - 1 object `useState` that carries multiple panel flags (`showJournal`, `showConstellation`, `showJourneySummary`, `showReport`, `showIdentityCeremony`, `showPatternEnding`)
  - `showShortcutsHelp`
  - `isChoicesBottomSheetOpen`
- `UnifiedMenu`: `isOpen`, `showLoginModal`
- `IdleWarningModal`: `showWarning`
- Additional panel/menu surfaces in codebase (legacy/admin/auth menu paths): `showMenu`/`showModal`/`isOpen` flags (e.g., `UserMenu`, `InGameSettings`, advisor modal trigger).

Notes:
- Some local booleans in modal files are not panel-open state (e.g., `showPassword`, `showResendButton`), and were excluded from the gameplay-focused count.

## 3) Number of places where “is a panel open?” is checked

Estimated count: **78 checks** (heuristic)

Method used:
- Counted references/check points around panel open flags in orchestration + local panel files.
- Includes:
  - Global gates in `StatefulGameInterface` (`hasBlockingOverlay`, open-flag checks in handlers/effects/render guards)
  - Local `isOpen`/`open` checks in panel components (`if (!isOpen) return`, `{isOpen && ...}`, `{open && ...}`, etc.)

Interpretation:
- This amount of distributed open-state branching is high enough to justify evaluating a central overlay state contract.

## 4) Existing bugs / race conditions tied to independent state

1. Keyboard leakage to choices while non-blocking UI is open
- `GameChoices` has a global numeric key listener without target scoping.
- `hasBlockingOverlay` excludes settings menu state.
- Risk: accidental choice commits while using settings.

2. Ambiguous selector targeting for shortcuts
- `data-choice-index` duplicated on wrapper and button.
- Shortcut query uses generic `[data-choice-index="N"]` in `StatefulGameInterface`.
- Risk: click/focus can land on non-interactive wrapper nodes.

3. Escape close precedence and partial coverage
- Parent Escape handler closes only a subset first (`Journal -> Constellation -> Report -> Shortcuts`).
- Other overlays have their own Escape logic or none.
- Risk: non-deterministic close behavior when multiple surfaces overlap.

4. Mixed z-index systems
- Combination of semantic `Z_INDEX` constants and hardcoded values (`z-50`, `z-[100]`, `z-[101]`).
- Risk: stacking regressions as overlays evolve.

## 5) Refactor worth-it signal

Given the above counts and bugs, a centralized overlay manager is likely worthwhile if your goal is:
- deterministic stacking/mutual exclusion,
- consistent keyboard/focus semantics,
- and reduced per-component duplication.

A minimal first step would be shared `overlayState` + `activeOverlay` policy in one place before deeper component rewrites.
