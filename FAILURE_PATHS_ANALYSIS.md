# Failure Paths Analysis
**Date:** December 15, 2024
**Status:** System Audit Complete

---

## Executive Summary

Analyzed 39 pattern-gated choices across 11 character arcs to ensure no player hits dead ends due to low pattern levels.

**Finding:** Current system uses **Enhanced + Fallback pairing** where gated choices have ungated duplicates. This prevents lockouts BUT needs verification and documentation.

---

## Pattern-Gated Choice Distribution

| Character | Gated Choices | Pattern |
|-----------|---------------|---------|
| Samuel    | 20            | Cross-character references, hub navigation |
| Maya      | 9             | Crossroads moment, career decision paths |
| Devon     | 3             | Crossroads moment |
| Jordan    | 3             | Crossroads moment |
| Marcus    | 1             | Phase 2 entry |
| Kai       | 1             | Character cross-reference |
| Rohan     | 1             | Character cross-reference |
| Yaquin    | 1             | Unknown context |
| **Total** | **39**        | - |

---

## Current Design Pattern: Enhanced + Fallback

### Example: Jordan's Crossroads (jordan-dialogue-graph.ts:1053-1114)

```typescript
choices: [
  // ENHANCED VERSION (pattern-gated)
  {
    choiceId: 'jordan_crossroads_accumulation_helping',
    text: "What if your past is exactly why you're the perfect mentor?",
    nextNodeId: 'jordan_chooses_accumulation',
    pattern: 'helping',
    preview: "Reframe seven jobs as seven kinds of wisdom to share",
    interaction: 'bloom',
    visibleCondition: {
      patterns: { helping: { min: 3 } }  // ← GATE
    }
  },

  // FALLBACK VERSION (always visible)
  {
    choiceId: 'jordan_crossroads_accumulation',
    text: "What if your past is exactly why you're the perfect mentor?",  // ← SAME TEXT
    nextNodeId: 'jordan_chooses_accumulation',  // ← SAME DESTINATION
    pattern: 'helping'
    // NO visibleCondition = always shows
  }
]
```

**Result:**
- If `helping >= 3`: Enhanced version shows (with preview + bloom animation)
- If `helping < 3`: Fallback version shows (basic, no preview)
- **Player ALWAYS has this option available**

---

## Safety Mechanism

The pairing ensures:
1. **Enhanced experience** for players who match the pattern
2. **Graceful degradation** for players who don't
3. **No dead ends** - fallback always available

### Visual Difference

**Enhanced Choice (helping >= 3):**
```
🌸 What if your past is exactly why you're the perfect mentor?
   Reframe seven jobs as seven kinds of wisdom to share
```

**Fallback Choice (helping < 3):**
```
What if your past is exactly why you're the perfect mentor?
```

Same choice, slightly less polished presentation.

---

## Verification Needed

### Question 1: Is this pattern CONSISTENT across all 39 gated choices?

Need to verify:
- Samuel's 20 gated choices (largest set)
- Maya's 9 crossroads choices
- Devon's 3 crossroads choices

### Question 2: Are there any nodes where ALL choices are gated?

This would create a hard lock if player doesn't have required patterns.

### Question 3: Character cross-references (Kai, Rohan)

```typescript
// kai-dialogue-graph.ts:212
{
  text: "I met a nurse, Marcus. He talks about...",
  nextNodeId: 'kai_marcus_reference',
  visibleCondition: {
    hasGlobalFlags: ['met_marcus']  // ← Requires having met Marcus
  }
}
```

**Question:** Does this have a fallback? Or is it optional flavor that doesn't block progression?

---

## Recommendation: Systematic Verification

### Task 1: Verify Enhanced + Fallback Pairing

For each of the 39 gated choices, confirm:
1. ✅ Enhanced version exists (with visibleCondition)
2. ✅ Fallback version exists (same text, same destination, NO condition)
3. ✅ At least one choice in the node has NO gate

### Task 2: Document the Pattern

Create `GATED_CHOICE_GUIDELINES.md` for future content authoring:

```markdown
## Pattern: Enhanced + Fallback Pairing

When creating pattern-gated choices:

1. Create ENHANCED version with gate:
   - Add `visibleCondition: { patterns: { [pattern]: { min: X } } }`
   - Add `preview` text for context
   - Add `interaction: 'bloom'` for emphasis

2. Create FALLBACK version:
   - Same `text`
   - Same `nextNodeId`
   - NO `visibleCondition`
   - NO `preview` or `interaction`

3. Test both paths:
   - Play with high pattern → see enhanced
   - Play with low pattern → see fallback
```

### Task 3: Automated Testing

Add test that verifies:
```typescript
test('Every node has at least one ungated choice', () => {
  for (const node of allNodes) {
    const ungatedChoices = node.choices.filter(c => !c.visibleCondition)
    expect(ungatedChoices.length).toBeGreaterThan(0)
  }
})
```

---

## Current Status: LIKELY SAFE

Based on Jordan's implementation (which appears to be the template), the system is likely already safe. Enhanced + Fallback pairing prevents lockouts.

**Next step:** Systematic verification of all 39 gated choices to confirm this pattern is consistent.

---

## Alternative: Auto-Fallback System

If manual pairing is error-prone, implement automatic fallback generation:

```typescript
// In dialogue-graph.ts evaluateChoices()
static evaluateChoices(node: DialogueNode, gameState: GameState): EvaluatedChoice[] {
  const evaluatedChoices = node.choices.map(choice => {
    const visible = this.evaluate(choice.visibleCondition, gameState)
    return { choice, visible, enabled: visible }
  })

  // SAFETY: If NO choices visible, show ALL choices as fallbacks
  const visibleCount = evaluatedChoices.filter(c => c.visible).length
  if (visibleCount === 0 && node.choices.length > 0) {
    console.warn(`[Fallback] No visible choices at ${node.nodeId}, showing all as fallback`)
    return node.choices.map(choice => ({
      choice,
      visible: true,
      enabled: true
    }))
  }

  return evaluatedChoices
}
```

This would catch any missed fallbacks and prevent dead ends automatically.

---

## Conclusion

Current design appears sound with Enhanced + Fallback pairing. Needs verification across all 39 instances to confirm no gaps exist.

Implementing auto-fallback safety net would make system bulletproof.
