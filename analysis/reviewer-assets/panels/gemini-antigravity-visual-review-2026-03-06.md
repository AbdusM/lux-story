# Gemini Antigravity Visual Review Prompt (March 6, 2026)

## Target
- Production alias: `https://lux-story.vercel.app`
- Exact deployment URL: `https://lux-story-jjk0q1mbv-link-dap.vercel.app`
- Exact candidate SHA: `ede228e`
- Context: follow-up visual-QA candidate after simulation-copy, settings-wrap, return-hook, mobile choice-sheet, session-fallback, review-target preflight, and final profile/sim polish fixes
- Ignore stale preview target `https://lux-story-kuqxzvegj-link-dap.vercel.app`; that preview environment is missing `USER_API_SESSION_SECRET` and is not a valid review surface

## Review Intent
Run a true visual/product review of the candidate build. Interact with the site like a player and evaluate what is actually rendered on screen.

This is not a code review. It is a visual, UX, and polish critique of the production surface.

## Required Viewports
- Desktop: `1440x900`
- Mobile: `iPhone 14`
- Mobile small: `iPhone SE`

## Evidence Pack
Fresh browser screenshots for the live production candidate are attached in:
- `analysis/reviewer-assets/panels/evidence/visual-review-2026-03-06/screenshots/`

Use those screenshots as baseline evidence, but prefer live interaction findings if the live build differs.

## What To Inspect
At minimum, inspect:
- landing / first impression
- main gameplay shell
- returning-player re-entry prompt
- settings surface
- simulation shell
- profile / research-consent surface
- mobile choice-sheet experience

## Main Questions
1. Does the gameplay surface now feel spatially stable and immersive?
2. Does the UI avoid breaking fiction with raw system language, taxonomy, or dashboard-style leakage?
3. Do menu and profile/settings surfaces feel intentional, polished, and clearly separated from active play?
4. Do simulation interfaces feel visually coherent with the Lux Story world, or do they still feel like a detached productivity dashboard?
5. Are there remaining cross-device issues in spacing, clipping, hierarchy, tap targets, or readability?

## Focus Areas
- first impression and above-the-fold clarity
- typography, spacing, alignment, contrast, and hierarchy
- button affordance and tap targets
- clipping, overflow, awkward wrapping, dead space, and z-index issues
- transitions, loading states, animation quality, and visual stability
- consistency across landing, gameplay, simulations, profile, and settings
- whether the experience feels authored and polished versus brittle or mixed-language

## Special Attention
### Gameplay Shell
- narrative surface should feel steady, not reflowing or drifting between nodes
- response controls should feel anchored and legible
- non-diegetic status/score labels should not intrude on the story lane

### Returning-Player Re-entry
- prompt must feel like part of the story lane, not a foreign banner jammed into the shell
- copy should read as fiction-facing, not system-admin language

### Simulations
- should feel self-contained and legible under time pressure
- should not expose machine-facing taxonomy or obvious placeholder/dashboard chrome
- footer dialogue controls should not appear under timed simulations

### Menu / Profile
- settings should feel like clean system controls, not an accidental dumping ground
- profile/research settings should feel trustworthy, clear, and visually intentional

## Output Requirements
- report only evidence-backed findings you can actually observe
- rank findings by severity using these buckets:
  - `Contract-Critical`
  - `Major`
  - `Minor`
- for each finding include:
  - route or screen
  - viewport/device
  - what you observed
  - why it matters
  - exact fix recommendation in plain English
- include screenshots for each meaningful issue

## Close With
- top 5 highest-leverage visual improvements
- overall visual ship / no-ship verdict
- areas you could not fully assess

## Style Constraints
- be direct and specific
- do not pad the answer
- do not speculate beyond visible evidence
- separate structural UX issues from polish-only issues
