# Intro Pacing Pass (Tess + Maya)

Date: 2026-02-13  
Scope: first-contact dialogue pacing for early-game readability and agency.

## Changes Applied

### Tess
- File: `content/tess-dialogue-graph.ts`
- Node: `tess_introduction`
- Change:
  - Reduced initial choice count from 4 to 3 by removing `tess_intro_business`.
  - Preserved business/system pressure downstream through existing `tess_the_numbers` path.
- Copy polish:
  - `tess_the_shop` opening line changed to: "Started this place twelve years ago. Just me. Two crates."

### Maya
- File: `content/maya-dialogue-graph.ts`
- Node: `maya_introduction`
- Change:
  - Reduced baseline first-contact choices by removing:
    - `intro_contradiction`
    - `intro_patience`
  - Kept 3 primary intents:
    - `intro_studies` (character anchor)
    - `intro_place` (world/station anchor)
    - `maya_intro_show_work` (immediate action/simulation anchor)
  - Preserved advanced/earned intros:
    - `intro_workshop_unlock`
    - `intro_technical_unlock`

## Validation

- `npm run validate-graphs`
- `npm run verify:unreachable-dialogue-nodes`
- `npm run verify:unreferenced-dialogue-nodes`
- `npm run verify:dialogue-node-redirects`

All checks passed after this pass.

