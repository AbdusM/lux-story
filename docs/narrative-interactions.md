# Narrative Interaction Animations

iPhone message-style interaction animations for narrative text and answer choices. One-shot animations that enhance emphasis without looping.

## Overview

The narrative interaction system allows content authors to specify visual animations for dialogue lines and choices. These animations provide subtle visual feedback that enhances the emotional tone and emphasis of narrative moments.

## Interaction Types

### `big`
**Scale up with fade** - Emphasizes importance and significance.

- **Use for:** Important revelations, significant moments, emphasis
- **Example:** "That sounds perfect for you." (supportive choice)
- **Duration:** 400ms

### `small`
**Scale down with fade** - Subtle, quiet moments.

- **Use for:** Whispered dialogue, quiet realizations, understated moments
- **Example:** Internal thoughts, soft acknowledgments
- **Duration:** 350ms

### `shake`
**Horizontal shake** - Conveys anxiety, uncertainty, distress.

- **Use for:** Anxious dialogue, uncertainty, fear, internal conflict
- **Example:** "I don't know what I'm doing anymore." (anxious_scattered emotion)
- **Duration:** 500ms

### `nod`
**Vertical bounce** - Agreement, confirmation, acknowledgment.

- **Use for:** Supportive choices, acknowledgments, agreement
- **Example:** "You're trying to be two things at once." (supportive helping choice)
- **Duration:** 400ms

### `ripple`
**Expand from center with opacity pulse** - Impact, realization, significance.

- **Use for:** Important reveals, impactful moments, realizations
- **Example:** "But late at night, when I'm memorizing anatomy, I'm actually... doing something else." (vulnerability reveal)
- **Duration:** 600ms

### `bloom`
**Scale with rotation** - Revelation, discovery, excitement.

- **Use for:** Discoveries, exciting realizations, "aha" moments
- **Example:** "Medicine AND robotics." (excited revelation about hybrid path)
- **Duration:** 500ms

### `jitter`
**Multi-directional micro-movements** - Nervousness, tension, unease.

- **Use for:** Nervous dialogue, tension-filled moments, hesitation
- **Example:** Tense decision points, uncertain responses
- **Duration:** 400ms

## Usage

### In DialogueContent

Add the `interaction` field to any `DialogueContent` object:

```typescript
{
  text: "I don't know what I'm doing anymore.",
  emotion: 'anxious',
  variation_id: 'anxiety_v1',
  interaction: 'shake' // Shake animation for anxiety
}
```

**Important:** The interaction applies to **all chunks** from the same DialogueContent. If the text is split by `|`, all chunks will share the same animation.

### In ConditionalChoice

Add the `interaction` field to any `ConditionalChoice`:

```typescript
{
  choiceId: 'supportive_response',
  text: "I understand what you're going through.",
  nextNodeId: 'character_grateful',
  pattern: 'helping',
  interaction: 'nod' // Nod animation for supportive choice
}
```

The interaction animation plays once when the choice button appears. It does not interfere with hover/active states.

## Implementation Details

### Technical Architecture

1. **Data Model:** `interaction` field added to `DialogueContent` and `ConditionalChoice` interfaces
2. **CSS System:** Keyframe animations in `styles/narrative-interactions.css`
3. **Integration:** Components apply CSS classes based on interaction metadata

### Animation Properties

- **Type:** CSS `animation` (not `transition`) to avoid conflicts with existing `transition: 'none'` styles
- **Fill Mode:** `forwards` - Animation completes and stays in final state
- **Performance:** Uses `transform` and `opacity` only (GPU-accelerated)
- **Accessibility:** Respects `prefers-reduced-motion` (animations disabled)

### Render Flow

```
DialogueContent.interaction 
  → StatefulGameInterface.currentDialogueContent 
  → DialogueDisplay.interaction prop 
  → CSS class `narrative-interaction-${interaction}` 
  → Applied to all text chunks

ConditionalChoice.interaction 
  → StatefulGameInterface.availableChoices 
  → CSS class applied to Button 
  → Animation on mount
```

### ChatPacedDialogue

When using `useChatPacing: true`, the interaction animation is applied to each chunk as it becomes visible in the sequential reveal. The animation plays when the chunk appears, layering on top of the fade-in effect.

## Guidelines

### When to Use

1. **Emotional Tone:** Match animation to emotion (shake for anxiety, bloom for excitement)
2. **Emphasis:** Use sparingly for high-impact moments
3. **Character State:** Reflect internal state visually (jitter for nervousness)

### When NOT to Use

1. **Every Line:** Too many animations become distracting
2. **Contradictory Emotions:** Don't use `shake` for happy dialogue
3. **Overuse:** Limit to 1-2 interactions per conversation branch

### Best Practices

1. **Sparse Usage:** Use interactions on 10-20% of dialogue/choices at most
2. **Emotional Alignment:** Match animation to content emotion
3. **Test Visibility:** Ensure animations work with chat pacing and typewriter effects
4. **Performance:** Animations are GPU-accelerated, but test with multiple simultaneous animations

## Examples from Codebase

### Maya's Introduction (Anxiety)
```typescript
{
  text: "Oh. Hi. Sorry, I—were you watching me?...",
  emotion: 'anxious_scattered',
  interaction: 'shake' // Visual shake conveys anxiety
}
```

### Supportive Choice (Acknowledgment)
```typescript
{
  choiceId: 'intro_contradiction',
  text: "You're trying to be two things at once.",
  pattern: 'helping',
  interaction: 'nod' // Subtle nod indicates supportive choice
}
```

### Vulnerability Reveal (Impact)
```typescript
{
  text: "But late at night... I'm actually doing something else.",
  useChatPacing: true,
  interaction: 'ripple' // Ripple for impactful revelation
}
```

### Discovery (Excitement)
```typescript
{
  text: "Medicine AND robotics.",
  emotion: 'excited',
  interaction: 'bloom' // Bloom for exciting discovery
}
```

## Accessibility

All animations respect `prefers-reduced-motion`. When this media query is active, animations are disabled:

```css
@media (prefers-reduced-motion: reduce) {
  .narrative-interaction-* {
    animation: none !important;
  }
}
```

Animations are **visual enhancements only** and do not convey critical information. Screen readers are unaffected.

## Performance

- **GPU-Accelerated:** Uses `transform` and `opacity` only
- **No Layout Thrashing:** Animations don't affect layout
- **One-Shot:** Animations play once on mount/visibility
- **No Loops:** All animations use `forwards` fill mode

## Future Enhancements

### Per-Chunk Interactions

Currently, all chunks from a DialogueContent share the same interaction. Future enhancement could support per-chunk syntax:

```typescript
text: "Normal text |{shake} Shaking text |{big} Emphasized text"
```

### Intensity Levels

Future enhancement could add intensity variants:

```typescript
interaction: 'shake-subtle' | 'shake-normal' | 'shake-intense'
```

## Troubleshooting

### Animation Not Playing

1. Check `interaction` field is correctly typed (TypeScript)
2. Verify CSS class name matches: `narrative-interaction-${interaction}`
3. Check browser DevTools for CSS conflicts
4. Ensure `prefers-reduced-motion` is not active

### Performance Issues

1. Limit concurrent animations (max 3-4 simultaneous)
2. Check for CSS conflicts with existing styles
3. Verify `transition: 'none'` doesn't block animations (should use `animation`, not `transition`)

### Conflicts with Existing Animations

- Interaction animations layer on top of RichTextRenderer effects
- ChatPacedDialogue fade-in and interaction can both apply
- Choice button hover/active states are separate (interaction only on mount)

