# Lux Story Documentation

Last updated: 2026-02-11

## Canonical Structure

This repository uses four primary documentation domains:

- `docs/00_CORE/` - Product philosophy, design principles, and templates.
- `docs/01_MECHANICS/` - Engine/system specs and gameplay mechanics.
- `docs/02_WORLD/` - World, factions, locations, and character lore.
- `docs/03_PROCESS/` - Delivery process, testing workflow, plans, and archives.

## Operational Roots (Compatibility)

The following paths remain top-level because scripts and CI reference them directly:

- `docs/reference/` - Data dictionary, source docs, and research references.
- `docs/testing/` - Selector standards and E2E testing guidance.
- `docs/qa/` - Baselines and generated QA reports.
- `docs/adr/` - Architecture Decision Record templates.

Do not relocate these paths without updating all script references.

## Quick Start

1. Process and workflow hub: `docs/03_PROCESS/00-readme.md`
2. Test strategy and gates: `docs/03_PROCESS/01-testing.md`
3. Delivery methodology (AAA): `docs/03_PROCESS/02-methodology.md`
4. Document governance and superseding rules: `docs/03_PROCESS/03-document-control.md`
5. Character deep coverage audit: `docs/03_PROCESS/21-character-deep-coverage-audit.md`
6. Dialogue style guardrails: `docs/03_PROCESS/22-dialogue-guidelines.md`
7. Dialogue external review analysis: `docs/03_PROCESS/23-dialogue-external-review-analysis.md`
8. Dialogue topology migration protocol: `docs/03_PROCESS/24-dialogue-topology-migration-protocol.md`

Primary product directives:
- `docs/00_PRD.01 - AAA.md`
- `docs/00_PRD.01 - Game Dev.md`

## Document Control Rules

- New active docs should go under `00_CORE`, `01_MECHANICS`, `02_WORLD`, or `03_PROCESS`.
- Keep active docs at depth <= 3 when practical.
- Archive historical material under `docs/03_PROCESS/archive/`.
- Generated QA artifacts belong in `docs/qa/`.
- When replacing docs, archive old versions and mark the new canonical path.

## Archive

Historical and superseded materials are in `docs/03_PROCESS/archive/`.
Use `docs/03_PROCESS/archive/00-archive-index.md` as the entry point.
