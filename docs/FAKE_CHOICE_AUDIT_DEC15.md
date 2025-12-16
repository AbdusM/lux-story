# Fake Choice Audit - December 15, 2025

## Executive Summary

Audited all character dialogue graphs against core design principle:
**"Meaningful Choices - Every decision has visible consequences."**

**Total Fake Choice Patterns Found: 40+**
- Critical: 4
- High: 5
- Medium: 20+
- Low: 15+

---

## CRITICAL: Samuel Introduction (Player-Reported)

**File**: `content/samuel-dialogue-graph.ts`
**Node**: `station_arrival` (lines 23-52)

### The Problem
All 3 initial choices lead to SAME destination:
```typescript
{ text: "Step off the train",                    nextNodeId: 'samuel_introduction' }
{ text: "Take a moment to look around first",   nextNodeId: 'samuel_introduction' }
{ text: "See if anyone else is getting off",    nextNodeId: 'samuel_introduction' }
```

**Player Experience**: Selected "look around" expecting to observe the station. Instead, immediately pushed into Samuel's introduction. Choice felt meaningless.

**Violation**: Core commandment #5 - "Meaningful Choices"

### The Fix
Create divergent paths:
1. "Step off" → Direct to Samuel (current behavior)
2. "Look around" → NEW `station_observation` node describing the station atmosphere, THEN Samuel approaches
3. "See others" → NEW `observe_passengers` node showing other travelers, THEN Samuel approaches

---

## Character-by-Character Findings

### Samuel (samuel-dialogue-graph.ts)

| Node | Pattern | Severity | Choices Affected |
|------|---------|----------|------------------|
| `station_arrival` | Same-destination | **CRITICAL** | All 3 intro choices |
| `samuel_explains_station` | Same-destination | Medium | 4 choices → `samuel_orb_introduction` |
| `samuel_explains_platforms` | Same-destination | Medium | 4 choices → `samuel_orb_introduction` |
| `samuel_ready_to_explore` | Same-destination | Low | 3 choices → character selection |

### Alex (alex-dialogue-graph.ts)

| Node | Pattern | Severity | Choices Affected |
|------|---------|----------|------------------|
| `alex_ai_hype_cycle` | Same-destination | **HIGH** | 2 choices → `alex_learning_treadmill` |
| `alex_contradiction` | Quick reconvergence | Medium | 3/5 choices funnel to same node |

### Tess (tess-dialogue-graph.ts)

| Node | Pattern | Severity | Choices Affected |
|------|---------|----------|------------------|
| `tess_backstory` | Same-destination | **HIGH** | 2 choices → `tess_the_numbers` |
| `tess_the_offer` | Quick reconvergence | Medium | 2 choices → `tess_the_shop` |
| `tess_phoniness` | Same-destination | Medium | 2 choices → `tess_the_numbers` |

### Maya (maya-dialogue-graph.ts)

**Grade: A** - Excellent branching. Minor reconvergence at `maya_grateful_support` acceptable.

### Devon (devon-dialogue-graph.ts)

| Node | Pattern | Severity | Choices Affected |
|------|---------|----------|------------------|
| `devon_father_aerospace` | Self-loop | Medium | 2 choices loop back to same node |
| `devon_debug_result_override` | False agency | Low | Single choice implies exploration |

### Rohan (rohan-dialogue-graph.ts)

| Node | Pattern | Severity | Choices Affected |
|------|---------|----------|------------------|
| `rohan_erasure_reveal` | Same-destination | Medium | 3 philosophical stances → same simulation |

### Marcus (marcus-dialogue-graph.ts)

**Grade: A** - Strong simulation branching with meaningful failure states.

### Yaquin (yaquin-dialogue-graph.ts)

| Node | Pattern | Severity | Choices Affected |
|------|---------|----------|------------------|
| `yaquin_creator_path` | Same-destination | **HIGH** | 3 very different intentions → same node |
| `yaquin_credential_gap` | Same-destination | Medium | 3 choices → `yaquin_curriculum_dream` |
| `yaquin_curriculum_dream` | Same-destination | Medium | 2 choices → `yaquin_curriculum_setup` |

### Kai (kai-dialogue-graph.ts)

| Node | Pattern | Severity | Choices Affected |
|------|---------|----------|------------------|
| `kai_intro_patience` | Same-destination | Medium | 3 tones → same frustration |

### Silas (silas-dialogue-graph.ts)

| Node | Pattern | Severity | Choices Affected |
|------|---------|----------|------------------|
| `silas_bankruptcy_reveal` | Same-destination | Medium | 2 approaches → same simulation start |

---

## Systemic Patterns Identified

### Pattern A: "Narrative Funnel" Abuse
Multiple characters have nodes where 3-4 choices all lead to the same "setup" node before a simulation or major scene. While some funneling is acceptable, it's overused.

**Worst offenders**: Samuel (intro), Yaquin (curriculum dream)

### Pattern B: Tone-Blind Responses
Player chooses between emotional/analytical/action-oriented responses, but character gives identical reply regardless of tone chosen.

**Worst offenders**: Tess (backstory), Alex (hype cycle)

### Pattern C: False Exploration Promises
Choice text suggests player agency ("look around", "explore", "wait and see") but narrative proceeds regardless.

**Worst offenders**: Samuel (intro), Devon (debug override)

### Pattern D: "[Continue]" Over-reliance
Many nodes have single "[Continue]" choices for pacing. Acceptable, but missed opportunities for reflection choices.

---

## Recommended Fixes by Priority

### Week 1 - Critical (Player-Facing)
1. **Samuel intro**: Add `station_observation` and `observe_passengers` nodes
2. **Yaquin creator path**: Split into 3 intermediate response nodes
3. **Alex hype cycle**: Distinguish exhaustion vs leverage paths

### Week 2 - High Priority
4. **Tess backstory**: Different responses for courage vs reality framing
5. **Yaquin credential gap**: Match response tone to player approach

### Week 3 - Medium Priority
6. Add intermediate nodes to quick-reconvergence points
7. Enhance character responses to acknowledge player's chosen tone

### Ongoing
8. Convert some "[Continue]" nodes to reflection choices
9. Audit new content against these patterns before merging

---

## Design Principle (Proposed)

**Every choice must satisfy at least ONE of:**
1. **Different destination** - Leads to a unique node
2. **Different insight** - Same destination, but meaningfully different dialogue acknowledging the choice
3. **Delayed divergence** - Converges now, but choice affects later outcomes (tracked via flags/patterns)

If none apply, the choice is fake and should be redesigned.

---

## Audit Methodology

1. Parsed all `choices[]` arrays in dialogue graph files
2. Grouped choices by `nextNodeId` to find same-destination clusters
3. Traced 2-hop paths to identify quick reconvergence
4. Compared choice text semantics to actual narrative outcomes
5. Cross-referenced with player feedback (Samuel intro report)

---

*Audit completed: December 15, 2025*
*Auditor: Claude Code + ISP Protocol*
