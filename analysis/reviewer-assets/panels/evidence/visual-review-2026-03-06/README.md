# Visual Review Evidence Pack (March 6, 2026)

## Scope
- Preview candidate: `https://lux-story-kuqxzvegj-link-dap.vercel.app`
- Candidate SHA under review: `5401a36`
- Stable production alias for comparison: `https://lux-story.vercel.app` on `5620b96`
- Prompt artifact: `analysis/reviewer-assets/panels/gemini-antigravity-visual-review-2026-03-06.md`

## What Is Included
Fresh preview-candidate screenshots for:
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
Initial full sweep:

```bash
VISUAL_REVIEW_BASE_URL='https://lux-story-kuqxzvegj-link-dap.vercel.app' npm run test:e2e -- --config playwright.visual-review.config.ts tests/e2e/user-flows/visual-review-capture.spec.ts
```

## Final Capture Status
- target preview: complete
- desktop: complete
- iPhone 14: complete
- iPhone SE: complete

## Notes
- This repo-local lane prepares evidence for external visual review.
- The current repo Gemini runtime is text-oriented; it does not itself prove browser/visual interaction by Gemini Antigravity.
- Use the prompt artifact plus this screenshot pack together for the external review.
