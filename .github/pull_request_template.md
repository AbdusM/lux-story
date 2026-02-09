## Intent

What changed and why?

## Risk

What could break? What’s the failure mode + impact?

## Tests

- [ ] Unit tests / validators updated
- [ ] Component tests (JSDOM) updated for UI behavior
- [ ] E2E (CI) updated if integration behavior changed

## Telemetry (If Applicable)

- [ ] Emits validated `interaction_events` telemetry (no in-memory analytics)
- [ ] Event type + payload shape added to:
  - `lib/telemetry/interaction-events-spec.ts`
  - `docs/reference/data-dictionary/12-analytics.md`

## Flags / Experiments (If Applicable)

- [ ] Feature flag in `lib/feature-flags.ts` (dev overrides are dev-only)
- [ ] Experiment assignment uses `assignment_version` (sticky + deterministic)

## ADR (If Applicable)

Required when changing flags/experiments/telemetry contracts/CI gates.

- [ ] ADR added using `docs/adr/000-template.md`

## Definition Of Done

- [ ] Small + mergeable (change is scoped; easy rollback)
- [ ] Deterministic (no RNG without seed; stable ordering where required)
- [ ] Validation gates updated (baselines/ratchets only when justified)
- [ ] Docs updated (contracts, dictionary, testing notes as needed)
