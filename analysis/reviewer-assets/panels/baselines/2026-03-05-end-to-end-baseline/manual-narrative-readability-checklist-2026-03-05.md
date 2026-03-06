# Manual Narrative Readability Checklist (2026-03-05)

## Purpose
- Complete the remaining subjective UX pass that automation cannot prove:
  - readability
  - pacing
  - choice salience
  - emotional continuity

## Pass Protocol
- Device lanes:
  - Desktop (`1440x900`)
  - Mobile (`iPhone 14` viewport)
- Run each lane for ~20 minutes continuous play.
- Capture every issue as: `severity`, `node/character`, `symptom`, `expected`, `owner`.

## Core Arc Sampling Set
- Samuel
- Maya
- Devon
- Marcus
- Nadia
- Yaquin
- Tess
- Rohan
- Quinn
- Zara

## Overlay/Panel Sampling Set
- Journal (open/close + tab switch)
- Constellation (network/skills/quests + detail modal)
- Settings menu (desktop anchored + mobile sheet)
- Journey summary/report overlays (if unlocked)

## Defect Rubric
- `P1`: blocks progress or creates likely mistaken choice.
- `P2`: high-friction readability/pacing problem.
- `P3`: polish/cadence issue with no progression risk.

## Logging Template
- `severity`:
- `surface`:
- `node_or_component`:
- `repro_steps`:
- `observed`:
- `expected`:
- `owner`:

## Exit Criteria
- All `P1` items triaged with fix owner.
- All `P2` items either queued or explicitly waived.
- Update:
  - `analysis/reviewer-assets/panels/manual-ux-pass-log-2026-03-05.md`
  - `analysis/reviewer-assets/panels/next-steps-execution-plan-2026-03-05.md`
