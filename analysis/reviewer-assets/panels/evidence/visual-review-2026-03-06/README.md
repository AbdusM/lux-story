# Visual Review Evidence Pack (March 6, 2026)

## Scope
- Production alias: `https://lux-story.vercel.app`
- Exact deployment URL: `https://lux-story-jjk0q1mbv-link-dap.vercel.app`
- Candidate SHA under review: `ede228e`
- Prompt artifact: `analysis/reviewer-assets/panels/gemini-antigravity-visual-review-2026-03-06.md`

## What Is Included
Fresh production screenshots for:
- desktop `1440x900`
- `iPhone 14`
- `iPhone SE`

Covered surfaces:
- landing
- gameplay shell
- returning-player prompt
- simulation shell
- settings
- profile
- profile research section
- mobile choice sheet

## Screenshot Inventory
- `screenshots/visual-desktop-1440-home.png`
- `screenshots/visual-desktop-1440-gameplay-shell.png`
- `screenshots/visual-desktop-1440-return-hook.png`
- `screenshots/visual-desktop-1440-simulation-shell.png`
- `screenshots/visual-desktop-1440-settings.png`
- `screenshots/visual-desktop-1440-profile.png`
- `screenshots/visual-desktop-1440-profile-research.png`
- `screenshots/visual-mobile-iphone-14-home.png`
- `screenshots/visual-mobile-iphone-14-gameplay-shell.png`
- `screenshots/visual-mobile-iphone-14-return-hook.png`
- `screenshots/visual-mobile-iphone-14-simulation-shell.png`
- `screenshots/visual-mobile-iphone-14-settings.png`
- `screenshots/visual-mobile-iphone-14-choice-sheet.png`
- `screenshots/visual-mobile-iphone-14-profile.png`
- `screenshots/visual-mobile-iphone-14-profile-research.png`
- `screenshots/visual-mobile-iphone-se-home.png`
- `screenshots/visual-mobile-iphone-se-gameplay-shell.png`
- `screenshots/visual-mobile-iphone-se-return-hook.png`
- `screenshots/visual-mobile-iphone-se-simulation-shell.png`
- `screenshots/visual-mobile-iphone-se-choice-sheet.png`

## Capture Commands
Preflight the review target first:

```bash
BASE_URL='https://lux-story.vercel.app' npm run verify:review-target
```

Then run the full screenshot sweep:

```bash
VISUAL_REVIEW_BASE_URL='https://lux-story.vercel.app' npm run test:e2e -- --config playwright.visual-review.config.ts tests/e2e/user-flows/visual-review-capture.spec.ts
```

## Final Capture Status
- target production alias: complete
- desktop: complete
- iPhone 14: complete
- iPhone SE: complete

## Notes
- This repo-local lane prepares evidence for external visual review.
- The current repo Gemini runtime is text-oriented; it does not itself prove browser/visual interaction by Gemini Antigravity.
- Use the prompt artifact plus this screenshot pack together for the external review.
- Do not use preview deployment `https://lux-story-kuqxzvegj-link-dap.vercel.app` for review; that environment is missing `USER_API_SESSION_SECRET` and produces false session failures.
- The capture spec now performs the same session-bootstrap preflight itself before taking screenshots.
