# Worldbuilding Expansion Wave 1 Backlog (2026-03-05)

## Execution Status
- `COMPLETED` (Wave 1 targets met with clean gate pack).
- Evidence:
  - `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/37-worldbuilding-expansion-wave-1-2026-03-05.txt`
- Outcome deltas:
  - Iceberg tags: `16 -> 21` (`+5`, target `+4`)
  - Verify-conflict tags: `6 -> 9` (`+3`, target `+3`)
  - Micro callback characters: `5 -> 7` (`+2`, target `7+`)
  - Unique micro memory IDs: `5 -> 7`

## Baseline (from current reports)
- Iceberg tags: `16` total, `6` characters.
- Under-weighted iceberg topics:
  - `burned_district`: `1`
  - `the_oxygen_tax`: `1`
- Unreliable records:
  - `14` record tags, `6` verify tags, `5` tagged characters.
  - Verify tags are concentrated in Samuel/Nadia flow.
- Micro-reactivity:
  - `5` memory IDs, `5` callback characters.

## Wave 1 Goal
- Raise narrative-system saturation while preserving all current green gates.

Target deltas:
- Iceberg tags: `+4` minimum (focus on low-coverage topics).
- Verify-conflict tags: `+3` minimum across non-Samuel characters.
- Micro-reactivity callback characters: `5 -> 7+`.

## Task Queue (File/Node Scoped)

1. Iceberg topic balancing (`burned_district`, `the_oxygen_tax`)
- Files:
  - `content/rohan-dialogue-graph.ts`
  - `content/elena-dialogue-graph.ts`
  - `content/samuel-dialogue-graph.ts`
  - `content/nadia-dialogue-graph.ts`
- Node candidates (existing lore-heavy nodes):
  - `rohan_erasure_reveal`
  - `elena_mystery_hint`
  - `samuel_station_truth`
  - `nadia_mystery_response`
- Action:
  - Add/adjust `iceberg:*` tags to spread low-volume topics.

2. Unreliable narrator verification spread
- Files:
  - `content/elena-dialogue-graph.ts`
  - `content/maya-dialogue-graph.ts`
  - `content/rohan-dialogue-graph.ts`
- Node candidates:
  - `elena_station_seven_detail`
  - `maya_mystery_response_1`
  - `rohan_erasure_reveal`
- Action:
  - Add `verify-conflict:*` tags to reduce Samuel-centric concentration and widen verification entry points.

3. Micro-reactivity expansion (callbacks)
- Files:
  - `content/quinn-dialogue-graph.ts`
  - `content/tess-dialogue-graph.ts`
  - `content/isaiah-dialogue-graph.ts`
- Action:
  - Add one `micro:set:*` and one corresponding `micro:callback:*` per selected character.
- Wave 1 implemented:
  - `content/quinn-dialogue-graph.ts` + `lib/micro-reactivity.ts`
  - `content/tess-dialogue-graph.ts` + `lib/micro-reactivity.ts`
- Deferred to Wave 2:
  - `content/isaiah-dialogue-graph.ts` (optional, non-blocking after target hit)

## Required Gate Pack (after each micro-batch)
- `npm run verify:iceberg-tags`
- `npm run verify:unreliable-records`
- `npm run verify:micro-reactivity`
- `npm run verify:narrative-sim`
- `npm run verify:required-state-strict`
- `npm run verify:unreachable-dialogue-nodes`
- `npm run verify:unreferenced-dialogue-nodes`

## Definition of Done
- All gate pack checks green.
- Wave target deltas met or exceeded.
- Evidence log written under:
  - `analysis/reviewer-assets/panels/evidence/2026-03-04-final-narrative-sweep/`
- Addendum appended to:
  - `analysis/reviewer-assets/panels/narrative-simulation-coverage-sweep-2026-03-04.md`
