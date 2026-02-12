# Dialogue Remediation Samples (Appendix)

Last updated: 2026-02-11
Status: `REVIEW_DRAFT`

Purpose:

- Provide concrete before/after examples for external reviewers.
- Show style direction without changing runtime behavior yet.
- Keep examples tied to exact node/choice IDs for easy implementation.

## Scope

- 3 text-compression examples (Lane A)
- 2 chain-break interaction examples (Lane B)
- 3 answer-normalization examples (Lane C)

## A) Text Compression Examples

### A1) Zara advice block (high-density overlength)

Source:

- `content/zara-dialogue-graph.ts` (`nodeId: zara_advice`, `variation_id: advice_v1`)

Before (excerpt):

```text
Learn the technical stuff. Really learn it. You can't audit what you don't understand.
...
The industry will try to make you comfortable with harm. Small compromises.
"Just this once." "It's not that bad."
...
Ask every day: can I look the affected person in the eye?
If the answer is no, that's your sign.
```

After (proposal):

```text
Learn the craft first. You can't audit what you don't understand.

Then pick your line before pressure picks it for you.
The system will offer small compromises and call them practical.

Don't normalize harm. Not once.
If you can't look the affected person in the eye, walk.
```

Why this works:

- Keeps Zara's voice and ethics stance.
- Cuts exposition loops and repetition.
- Preserves one concrete image/action test.

### A2) Alex simulation success explanation

Source:

- `content/alex-dialogue-graph.ts` (`nodeId: alex_sim3_success`, `variation_id: sim3_success_v1`)

Before (excerpt):

```text
Micro-credentials. Yes.
Here's how it works:
Week 1-2...
Week 3...
Example...
The magic...
Best of both worlds...
You just proved it's AND.
```

After (proposal):

```text
Yes. Micro-credentials.

Students build real projects first.
Then they prove one skill from that project with evidence.

Badge = demonstrated capability in context.
Portfolio + badge gives employers proof and students keep curiosity.

That's the pattern: learning through making, credentials as evidence.
You solved the false either/or.
```

Why this works:

- Retains the design pattern and payoff.
- Removes tutorial-style verbosity.
- Keeps the emotional close.

### A3) Kai simulation success explanation

Source:

- `content/kai-dialogue-graph.ts` (`nodeId: kai_sim3_success`, `variation_id: sim3_success_v1`)

Before (excerpt):

```text
Peer training. Yes.
Month 1...
Month 6...
Why? Because...
Compliance training teaches facts. Peer training teaches survival instincts.
...
You just designed something that actually works.
```

After (proposal):

```text
Peer training. Exactly.

New hires learn on the real floor, from people who've seen near-misses.
Context makes danger legible; trust makes it stick.

That's why incidents drop: behavior changes, not quiz scores.
Compliance checks boxes. Peer training builds survival instincts.

This design works in the real world.
```

Why this works:

- Keeps operational logic and stakes.
- Cuts list-heavy explanation.
- Lands on behavior change, not compliance theater.

## B) Chain-Break Interaction Examples

### B1) Samuel 3-node continue chain -> interaction seam

Source chain:

- `content/samuel-dialogue-graph.ts`
- `samuel_jordan_mirror_response -> samuel_beat_after_jordan_mirror -> samuel_hub_after_devon`

Before:

- `[Continue]` then `(Continue)` before returning to hub choices.

After (proposal):

Add one meaningful player move at `samuel_jordan_mirror_response`:

```text
Choice A: "How do I know when reflection becomes pressure?"
-> samuel_reflection_boundary (new short node)

Choice B: "I want to carry that forward."
-> samuel_hub_after_devon
```

Why this works:

- Breaks passive chain without filler.
- Preserves Samuel mentor voice.
- Creates actionable reflection beat.

### B2) Silas final vision 3-node chain -> 2-beat + choice

Source chain:

- `content/silas-dialogue-graph.ts`
- `silas_final_vision -> silas_final_vision_2 -> silas_final_vision_3`

Before:

- Two `[Continue]` transitions before player agency.

After (proposal):

Keep `silas_final_vision` and insert a player turn immediately:

```text
Choice A: "How do we teach this without rejecting technology?"
-> silas_final_vision_2 (condensed)

Choice B: "What would 'ground truth' look like in my field?"
-> silas_ground_truth_transfer (new short node)
```

Why this works:

- Preserves thematic ending.
- Restores interaction cadence.
- Converts abstract monologue into transferable insight.

## C) Answer Normalization Examples

### C1) Devon reciprocity answer tightening

Source:

- `content/devon-dialogue-graph.ts`
- `nodeId: devon_asks_player`, `choiceId: player_analyze_patterns`

Before:

```text
I look for patterns. What's worked before? What hasn't? I treat it like a problem to solve,
even though I know emotions don't work that way.
```

After (proposal):

```text
I look for patterns first, even when feelings don't fit the model.
```

Why this works:

- Keeps meaning and pattern alignment.
- Reduces cognitive load in a multi-option node.

### C2) Maya reciprocity answer tightening

Source:

- `content/maya-dialogue-graph.ts`
- `nodeId: maya_reciprocity_ask`, `choiceId: player_ask_others`

Before:

```text
I talk to people I trust. See what they think. But I'm learning that ultimately,
I have to choose for myself, not for them.
```

After (proposal):

```text
I ask trusted people, then make the call myself.
```

Why this works:

- Preserves introspective intent.
- Makes the option faster to parse against peers.

### C3) Kai philosophical answer tightening

Source:

- `content/kai-dialogue-graph.ts`
- `nodeId: kai_final_choice`, `choiceId: kai_choose_both`

Before:

```text
Both. Start deep, then find ways to scale what works. But honestly? I struggle with that balance.
I want to do both and end up doing neither well.
```

After (proposal):

```text
Both. Go deep first, then scale what proves out. I still struggle to balance that.
```

Why this works:

- Keeps vulnerability and strategic framing.
- Removes redundant phrasing while retaining tone.

## Reviewer Checklist

1. Voice preserved per character?
2. Meaning preserved (no semantic drift)?
3. Interaction cadence improved where chains existed?
4. Choice scan-time reduced for long options?
5. No ID/route changes implied unless explicitly noted?

## Implementation Note

These are editorial proposals only. No runtime graph mutations are included in this appendix.
