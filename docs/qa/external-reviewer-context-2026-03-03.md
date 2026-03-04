# External Reviewer Context Brief (UI/UX + Frontend)
Date: March 3, 2026
Project: `lux-story`

This document answers the full context questions in one pass for an external reviewer who does not have repo access.

## 1) Full Tech Stack
- Framework/runtime: Next.js 15 (`next` package is `^15.5.7`; local runtime currently resolves to 15.5.9).
- React: `react` 19.1.1, `react-dom` 19.1.1.
- Language: TypeScript 5.9.2 (strict type-checking enabled in build config).
- Styling: Tailwind CSS 3.4.17 + custom CSS.
- Component system: shadcn-style setup (`components.json`) with Radix primitives (`@radix-ui/*` packages).
- Animation: Framer Motion 12.23.24.
- Icons: Lucide React.
- State management: Zustand store (`lib/game-store.ts`) with `persist` + `devtools`, plus local component state.
- Persistence: localStorage-backed game/session state.
- Backend/auth/data: Supabase client + SSR helpers.
- Test stack: Vitest (+ Testing Library) and Playwright.
- Bundler/build pipeline: Next.js built-in pipeline (`next dev`, `next build`) via App Router, not Vite/CRA.

## 2) Design System / Theme Config
Yes, there are multiple design-system/token layers:
- Tailwind config: `tailwind.config.ts`
- shadcn config: `components.json`
- Global CSS variables/tokens: `app/globals.css`
- UI constants/tokens (touch targets, z-index, container heights, spacing): `lib/ui-constants.ts`
- Additional style modules: `styles/*.css` (accessibility, game effects, atmosphere, etc.)

## 3) Component Hierarchy (Root -> Game Screen)
High-level path:
- `app/layout.tsx` (root shell/providers)
  - `SVGFilterProvider`
  - `GodModeBootstrap`
  - `DevFeatureFlagsGlobal`
  - `ServiceWorkerProvider`
  - `ErrorBoundary`
  - `ToastProvider`
  - `children`
- `app/page.tsx`
  - `GameErrorBoundary` (layered boundary)
  - `StatefulGameInterface`

Main game UI inside `StatefulGameInterface`:
- `LivingAtmosphere`
  - Fixed header
    - journal button, constellation button, `UnifiedMenu`, sync indicator
  - Scrollable narrative/main content
    - dialogue card + narrative renderer
  - Sticky footer answer container
    - inline `GameChoices` (<=3 choices) or bottom-sheet trigger (>3)
  - `BottomSheet` (for expanded choice list)
  - Overlays/panels
    - `Journal`
    - `ConstellationPanel`
    - report/journey overlays

## 4) `GameChoices.tsx` Keyboard Handler (around lines ~200-260)
Current logic is a custom hook with a global listener:
- Uses `useEffect(() => window.addEventListener('keydown', handleKeyDown))` and cleanup on unmount/update.
- Key behavior:
  - `1-9`: direct-select matching choice index.
  - `ArrowDown` or `j`: move focus forward.
  - `ArrowUp` or `k`: move focus backward.
  - `Enter` or `Space`: choose currently focused item.
  - `Escape`: clear focused index.
- It also scrolls focused choice into view using `querySelectorAll('[data-choice-index]')`.

## 5) `UnifiedMenu.tsx` Open/Close State + Communication to `GameChoices`
`UnifiedMenu` manages its own open state locally:
- Internal `const [isOpen, setIsOpen] = useState(false)`.
- Opens/closes via settings trigger button, close button, backdrop click, and Escape key listener.

Current coupling to choices:
- No direct state channel from `UnifiedMenu` to `GameChoices`.
- `GameChoices` only receives `isProcessing` and overlay-derived blocking flags from `StatefulGameInterface`.
- The blocking flag currently tracks journal/constellation/report overlays, not settings-menu open state.

## 6) `data-choice-index` Duplication
Current state:
- `data-choice-index` appears on both a motion wrapper div and the actual button.

Known query usage:
- Global shortcut handlers in `StatefulGameInterface` use `document.querySelector('[data-choice-index=\"N\"]')`.
- Keyboard focus scrolling in `GameChoices` uses `containerRef.current.querySelectorAll('[data-choice-index]')`.

Why duplicated:
- No explicit documented reason found in comments/contract tests for duplicate placement.
- Practical effect: selector ambiguity is possible because wrapper and button share the same attribute.

## 7) 64px Bottom Padding Context
The footer/answer container uses:
- `paddingBottom: 'max(64px, env(safe-area-inset-bottom, 64px))'`

Documented rationale in code comments:
- Mobile Chrome bottom browser bar can be ~48-56px and is not fully represented by safe-area inset.
- Padding was added to keep choice controls clear of browser chrome and maintain tap reliability.

## 8) Current UI Screenshots (Desktop + Mobile)
Fresh screenshots were exported on March 3, 2026:
- Desktop: `/Users/abdusmuwwakkil/Development/30_lux-story/analysis/reviewer-assets/game-ui-desktop-1440x900.png`
- Mobile (iPhone 14 viewport): `/Users/abdusmuwwakkil/Development/30_lux-story/analysis/reviewer-assets/game-ui-mobile-iphone14.png`

## 9) Target Visual Mood / Aesthetic + References
Observed direction is consistent with:
- Dark, atmospheric, cinematic "Grand Central Terminus" world.
- Glassmorphism-heavy UI layers.
- Narrative-first pacing and contemplative tone.

Explicit references in project documentation/comments:
- Inspired by *Disco Elysium* and *Mass Effect* (README).
- Additional internal references include iPhone-message style patterns and readability notes inspired by narrative RPG UX research.

## 10) Primary Device Profile
Best available evidence indicates mobile-first priority:
- Product docs identify primary audience as Birmingham youth (ages 14-24), explicitly "mobile-first."
- Automated test matrix has dedicated iPhone and Android projects and substantial mobile safe-area/touch-target coverage.

Unknowns:
- Exact real-world split across school Chromebooks vs phones/tablets/desktops is not documented in the files reviewed.

## 11) Test Runner + E2E Framework
- Unit/component/integration: Vitest (`npm run test:run`) + Testing Library.
- E2E: Playwright (`npm run test:e2e`), including desktop and mobile projects.
- CI: GitHub Actions workflows for test suite and Playwright matrix runs.

## 12) Staging / Preview Deploy Pipeline vs Straight-to-Prod
What is clearly defined in-repo:
- CI workflows run tests/build on `push`/`pull_request` for `main` and `develop`.
- Deploy scripts are present for Vercel (`npm run deploy:vercel`, `vercel --prod`).
- `.vercel/project.json` maps this repo to a Vercel project/org.

What is not explicit in-repo:
- No dedicated GitHub Actions staging deployment workflow is defined.
- Preview/staging behavior may be handled by Vercel's platform integration outside repo workflows (needs verification with team).

## Notes for External Reviewer
- This brief is repo-derived and current as of March 3, 2026.
- Where direct evidence is missing (for example, true production preview policy or device adoption analytics), items are marked as unknown/needs verification.
