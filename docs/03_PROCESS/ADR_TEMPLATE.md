# ADR Template

**Date:** YYYY-MM-DD  
**Status:** Proposed | Accepted | Rejected | Superseded  
**Owners:** @handle(s)  

## Context

What problem are we solving? What constraints matter (runtime, CI, privacy, determinism)?

## Decision

What are we doing? Be specific about:
- Public APIs (functions/modules)
- Data contracts (schemas, event names, payload shape)
- Rollout mechanism (feature flag / experiment / staged rollout)

## Telemetry

If this change affects analytics/telemetry:
- Interaction event type(s):
- Payload contract (required keys + types):
- Where it is emitted (single truthy point):
- Where it is documented (data dictionary section):

## Testing

What automated checks prove this works?
- Unit tests:
- Component tests (JSDOM):
- E2E (CI-only if needed):
- Validation scripts / CI gates:

## Alternatives Considered

List 1-3 alternatives and why we didn't pick them.

## Consequences

What changes for developers, users, and operations? Include:
- Migration/backfill (if any)
- Backout plan
- Follow-ups / TODOs

