# Document Control Policy

Last updated: 2026-02-11

## Objectives

- Keep documentation discoverable and current.
- Prevent duplicate/conflicting "source of truth" documents.
- Make superseded material easy to find but clearly non-canonical.

## Classification

- `ACTIVE`: Canonical, maintained, referenced by current workflow.
- `SUPERSEDED`: Replaced by a newer canonical doc.
- `ARCHIVED`: Historical context; not maintained.
- `GENERATED`: Machine output (QA reports, baselines).

## Canonical Locations

- Product/design foundations: `docs/00_CORE/`
- Mechanics/specs: `docs/01_MECHANICS/`
- World content docs: `docs/02_WORLD/`
- Process and execution docs: `docs/03_PROCESS/`
- Historical/superseded docs: `docs/03_PROCESS/archive/`

Compatibility roots (script-bound):
- `docs/reference/`, `docs/testing/`, `docs/qa/`, `docs/adr/`

## Naming and Depth

- Prefer numbered prefixes for ordered docs (`00-`, `01-`, `02-`, `03-`).
- Keep active docs at depth <= 3 where practical.
- Archive may exceed depth due historical imports.

## Superseding Procedure

1. Archive old doc under `docs/03_PROCESS/archive/` with `superseded` in filename.
2. Update or create the new canonical doc.
3. Add/update links in `docs/README.md` and relevant local index.
4. Ensure scripts/tests/docs references point to the canonical location.

## 2026-02-11 Supersession Record

- `docs/03_PROCESS/00-readme.md` replaced legacy setup/deploy placeholders.
- `docs/03_PROCESS/01-testing.md` replaced outdated fixed test-count reporting.
- `docs/03_PROCESS/02-methodology.md` replaced legacy 2025 narrative sprint plan.
- Legacy versions preserved in `docs/03_PROCESS/archive/95-97-superseded-*.md`.
