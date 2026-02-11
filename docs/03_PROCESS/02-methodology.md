# Delivery Methodology (AAA)

Last updated: 2026-02-11

## Core Principles

- Determinism over manual guesswork.
- Contract-first systems (flags, telemetry, content schemas).
- Small, mergeable changes with CI-enforced quality gates.
- No fake analytics: tracked behavior must map to validated contracts.

## Implementation Loop

1. Define scope and acceptance criteria.
2. Guard risky behavior behind typed feature flags when needed.
3. Implement smallest viable slice.
4. Add/update tests and validators.
5. Update docs + dictionary/contracts in same change.
6. Run local quality gates; ship through CI.

## Content and Gameplay Rules

- Treat content as code: validate graph integrity continuously.
- Protect critical path from deadlocks.
- Prefer deterministic simulators/JSDOM over ad-hoc manual walkthroughs.
- Maintain debt-controlled baselines to prevent silent regressions.

## Operational Contracts

- Feature flags: typed, owned, sunset-aware.
- Experiments: deterministic assignment, versioned stickiness.
- Telemetry: dictionary + schema + verifier must stay aligned.
- Superseded docs: archive, index, and clearly identify canonical replacement.
