# Dialogue Style Guardrails

Last updated: 2026-02-11
Status: `ACTIVE`

## Purpose

Keep dialogue interactive and human by reducing:

- overlong speeches
- robotic, fully-complete paragraphs
- choice starvation (too much passive reading)

This document defines the authoring contract and the automated report used to enforce it.

## Prime Rule

Dialogue is action. Every line should do at least one:

- get something (information, trust, leverage, permission)
- hide something (fear, guilt, motive, knowledge)
- test something (boundaries, loyalty, confidence)

If a line only explains, cut or move it to optional content.

## Scene Cadence Contract

- Default exchange shape: 2 beats.
- Optional third beat only when the scene turns (reveal, decision, threat).
- At beat 4+, assume monologue risk and insert a player move.

## Word and Sentence Budgets

- Ambient bark: 1-2 lines, 5-12 words each.
- Standard node: soft cap 35 words, 1-3 sentences.
- Important node: hard cap 90 words (must break with interruption or choice).
- Lore dump: never uninterrupted spoken text; split into optional nodes/codex/action beats.
- Deterministic chain cap: no continue-chain over 2 nodes or 180 words without interaction.

Character exception:

- Samuel (`samuel` graph): single-block hard cap 110 words (mentor voice allowance), chain caps unchanged.

## Interruption and Subtext Rules

- Add interruptions, corrections, unfinished thoughts, and dodges.
- Each line should carry subtext (surface meaning != hidden meaning).
- Use conflict/question pressure to stop speech drift.

## Voice Card Contract (per character)

Lock these 4 sliders so characters do not blur:

1. directness (blunt <-> evasive)
2. warmth (tender <-> cold)
3. tempo (fast <-> deliberate)
4. status posture (dominant <-> deferential)

## Interaction Cadence Rule

Mainline dialogue should give the player an action quickly, enforced by deterministic word/node caps:

- explicit choice
- interruption window
- short action beat
- objective/map/item interaction update

## Automated Report

Use:

- `npm run report:dialogue-guidelines`

Generated artifact:

- `docs/qa/dialogue-guidelines-report.json`
- Scope: `DIALOGUE_GRAPHS` only (graph-registry-routable corpus). Supplemental detached/non-graph sources are tracked in `docs/qa/dialogue-external-review-report.json`.

Current checks:

- node text soft/hard word caps
- sentence-overflow detection
- monologue-chain detection across unconditional `[Continue]`-style paths
- chain gating is word/node-based; estimated reading seconds are informational only

Strict verification command:

- `npm run verify:dialogue-guidelines`

Verification uses a ratchet baseline:

- fails only if hard-content or hard-monologue metrics increase
- baseline file: `docs/qa/dialogue-guidelines-baseline.json`
- ratchet report: `docs/qa/dialogue-guidelines-ratchet-report.json`

## Rewrite Tools

- Cut 30% pass: remove weakest explanation first.
- Explanation-to-conflict swap: argument, lie, warning, or stake.
- One image rule: include one concrete object/place/sensation in longer lines.

## Usage Notes

- Keep mandatory exposition in present-tense stakes.
- Move optional depth into codex / "tell me more" / inspectables.
- Do not block critical path on long passive dialogue.
