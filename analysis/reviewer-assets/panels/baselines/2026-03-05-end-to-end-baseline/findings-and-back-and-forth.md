# Grand Central Terminus — Findings & Back-and-Forth Log

Date: March 3, 2026
Project: `lux-story`
Scope: UI/UX panel/overlay reliability review prep for external reviewer

## 1) Context Collected

- Core runtime path is `app/page.tsx -> StatefulGameInterface`.
- Panel and overlay ownership is mostly in `components/StatefulGameInterface.tsx` with additional local state in panel components.
- Frontend stack and testing/deploy context were verified from `package.json`, Next app structure, and CI workflows.

## 2) High-Signal Findings (Code-Backed)

### Finding A: Choice keyboard handling is global and not target-scoped

`GameChoices` registers a global `window` keydown listener and handles numeric keys directly:

```ts
// components/GameChoices.tsx (approx L210+)
const handleKeyDown = useCallback((e: KeyboardEvent) => {
  if (isProcessing || choices.length === 0) return

  if (e.key >= '1' && e.key <= '9') {
    const index = parseInt(e.key) - 1
    if (index < choices.length) {
      e.preventDefault()
      const choice = choices[index]
      if (choice && canSelectChoice(choice)) onChoice(choice)
    }
    return
  }
}, [choices, isProcessing, onChoice, canSelectChoice])

useEffect(() => {
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [handleKeyDown])
```

There is no `event.target` guard, no dialog/menu scoping, and no awareness of `UnifiedMenu` open state.

### Finding B: `data-choice-index` selector ambiguity exists

`data-choice-index` is assigned to both wrapper motion div and actual button:

```tsx
// components/GameChoices.tsx
<motion.div data-choice-index={index}> ...

<Button
  data-choice-index={index}
  ...
/>
```

`StatefulGameInterface` shortcut handlers query generic selector:

```ts
// components/StatefulGameInterface.tsx
const button = document.querySelector('[data-choice-index="0"]') as HTMLButtonElement
button?.click()
```

This can target non-button nodes first.

### Finding C: Blocking overlay gate does not include settings/menu state

```ts
// components/StatefulGameInterface.tsx (approx L3702+)
const hasBlockingOverlay =
  state.showJournal ||
  state.showConstellation ||
  state.showJourneySummary ||
  state.showReport
```

`UnifiedMenu` maintains its own local `isOpen` and is not part of this flag.

### Finding D: Footer padding is hardcoded for mobile concern across all breakpoints

```ts
// components/StatefulGameInterface.tsx (approx L4255)
paddingBottom: 'max(64px, env(safe-area-inset-bottom, 64px))'
```

This preserves mobile browser chrome clearance but compresses viewport on larger screens.

### Finding E: Menu/popover a11y is partial

`UnifiedMenu` has `role="dialog"` but no `aria-modal`, no focus trap, and no focus return handling. Escape close is implemented.

### Finding F: BottomSheet a11y is materially stronger than other overlays

`BottomSheet` includes `aria-modal`, focus trap logic, Escape handling, and body scroll lock. This is a candidate baseline for shared overlay behavior.

## 3) Back-and-Forth Outcome

- Initial request asked for full screenshot extraction; this was deprioritized per latest direction.
- Focus shifted to code snippets, architecture answers, and exportable source/context docs.
- Source bundle + architecture/scope docs were generated in `analysis/reviewer-assets/panels/`.

## 4) Stack Context Snapshot (Verified)

- Frontend: Next.js 15, React 19, TypeScript, Tailwind 3, Framer Motion, Radix/shadcn primitives, Zustand.
- Backend: Next.js route handlers under `app/api/*`, Supabase-backed APIs, Anthropic + Gemini integrations for AI endpoints.
- Testing: Vitest + Playwright.
- CI/CD: GitHub Actions test/build and Playwright workflows; Vercel deploy scripts in `package.json`.

## 5) Reviewer-Ready File Bundle

- `analysis/reviewer-assets/panels/source/` contains exported panel, overlay, state, styling, and animation source files.
- `analysis/reviewer-assets/panels/panel-architecture-answers.md` answers architectural questions inline.
- `analysis/reviewer-assets/panels/overlay-manager-scope.md` provides refactor-scope counts and risk notes.
