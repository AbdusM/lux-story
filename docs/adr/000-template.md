# ADR NNN: <Title>

## Status

Proposed | Accepted | Superseded

## Date

YYYY-MM-DD

## Context

What problem are we solving? Include constraints (runtime limitations, CI gates, determinism needs, performance budgets, etc).

## Decision

What we will do (one or two sentences).

## Contract Locks

Hard rules we will enforce so this stays correct over time.

- Example: "All analytics events must enqueue a validated `interaction_events` row."
- Example: "Experiment assignment is deterministic and sticky per `(test_id, assignment_version, user_id)`."

## Options Considered

- Option A: <summary> (why not)
- Option B: <summary> (why not)

## Consequences

- Positive: <what gets better>
- Negative: <what gets harder / risk>

## Rollout / Backout

- Rollout: <how we introduce safely, flags/ratchets if needed>
- Backout: <single switch or revert path>

## Telemetry Impact (If Any)

- New event types:
- Payload schema changes:
- Data dictionary updates:

## Testing / Verification

- Unit tests:
- Component tests (JSDOM):
- E2E (CI Playwright):
- Deterministic sims / validators:

