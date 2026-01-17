# Expanded Coverage Audit (Deep/Wide)

**Date:** 2026-01-17  
**Scope:** Characters (20 NPCs), simulations, interrupts, knowledge trades, depth system, tests, docs  
**Sources:** `content/*`, `lib/*`, `tests/*`, `docs/reference/data-dictionary/*`

---

## Executive Summary
- Full character/simulation coverage is now mapped and expanded with missing interrupts and knowledge items.
- New character depth profiles added for Quinn, Dante, Nadia, Isaiah.
- Two new E2E smoke suites added: character intros and simulation mounts via God Mode.
- Remaining risks are primarily test runtime and God Mode UI assumptions in simulations smoke.

---

## Coverage Matrix (CSV)
- `docs/03_PROCESS/17-expanded-coverage-matrix.csv`

---

## Key Changes Implemented
1) **Interrupt coverage completed** for Quinn, Dante, Nadia, Isaiah.
2) **Knowledge trade items added** for Jordan, Tess, Quinn, Dante, Nadia, Isaiah, Grace, Alex.
3) **Character depth profiles added** for Quinn, Dante, Nadia, Isaiah.
4) **E2E tests added**:
   - `tests/e2e/characters/character-smoke.spec.ts`
   - `tests/e2e/simulations/simulation-smoke.spec.ts`

---

## Remaining Risks / Follow-ups
- **Simulation smoke runtime:** 20 simulations in one loop can be slow; consider sharding or parallelizing.
- **God Mode UI assumptions:** If the God Mode tab is gated or hidden, simulation smoke will fail.
- **Doc references:** Additional data-dictionary references to `docs/02_REFERENCE` may exist outside the index.

---

## Next Actions (Recommended)
1) Run the new E2E smoke tests in CI and record runtime; split if needed.
2) Add per-character interrupt E2E coverage for 3-4 non-Maya characters.
3) Add a data-dictionary appendix for Supabase schema or link to `supabase/README.md`.

