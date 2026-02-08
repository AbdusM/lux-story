# PR Definition Of Done (DoD)

Every PR should be safe to merge to `main` behind flags where needed.

## Required

- `Intent`: What changed and why (1-3 sentences).
- `Risk`: What could break? Note the failure mode and impact.
- `Tests`: New/updated automated tests, or a reason why none are needed.
- `Telemetry`: If the change claims "tracking", emit a validated interaction event and document it.
- `Docs`: Update relevant docs (data dictionary, testing notes) when contracts change.
- `Rollout/Backout`: Feature flag, experiment version bump, or a clear revert plan.

## When Relevant

- `ADR`: Required when changing:
  - telemetry contracts (`interaction_events` event types/payloads)
  - feature flag registry / precedence
  - experiment assignment strategy/versioning
  - CI gates/validators
  - data model / migrations
- `CI`: Add/extend a validator script when correctness can be proven statically.

