# ADRs (Architecture Decision Records)

ADRs are short, durable notes for decisions that affect future code. They are written so both humans and agents can understand "why this way" without reconstructing context.

## When An ADR Is Required

Write an ADR when a change affects:

- Telemetry contracts (event types, payload schemas, dictionary rules, validators)
- Feature flags or experiment assignment semantics
- CI quality gates / baselines / ratchets
- Core engine contracts (state model, gating rules, determinism guarantees)

## Where ADRs Live

- `docs/adr/NNN-short-title.md`
- One decision per file.
- Keep the title and filename stable.

## How To Write

Start from the template:

- `docs/adr/000-template.md`

Prefer:

- Clear context and constraints
- Concrete decision statement
- Options considered + why rejected
- Rollout and backout plan
- Test plan and contract lock(s)

