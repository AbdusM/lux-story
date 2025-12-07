# Interaction Targeting Proposal

**Issue**: Current system applies interactions to entire dialogue nodes. We need **line-specific targeting** for more strategic, impactful effects.

**Example Problem**:
```typescript
{
  text: `The real enemy? Air.|One bubble in the line.|Brain? Stroke. Heart? Death.|Instant.|Tonight... the alarm screamed.|'AIR IN LINE.'`,
  interaction: 'shake' // ❌ Applies to ALL lines, not just the alarm
}
```

**Desired Behavior**: `shake` should only apply to `'AIR IN LINE.'` - the climactic moment.

---

## Proposal: Inline Interaction Tags

### Syntax:
```typescript
text: `The real enemy? Air.|One bubble in the line.|Brain? Stroke. Heart? Death.|Instant.|Tonight... the alarm screamed.|<shake>'AIR IN LINE.'</shake>`
```

### Implementation:

1. **Parser** in `RichTextRenderer.tsx`:
```typescript
const INTERACTION_REGEX = /<(shake|jitter|nod|bloom|ripple|big|small)>(.*?)<\/\1>/g;

function parseInteractionTags(text: string) {
  const segments = [];
  let lastIndex = 0;

  text.replace(INTERACTION_REGEX, (match, interaction, content, offset) => {
    // Add text before tag
    if (offset > lastIndex) {
      segments.push({
        type: 'text',
        content: text.substring(lastIndex, offset)
      });
    }

    // Add interaction segment
    segments.push({
      type: 'interaction',
      interaction,
      content
    });

    lastIndex = offset + match.length;
    return match;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.substring(lastIndex)
    });
  }

  return segments;
}
```

2. **Renderer**:
```typescript
segments.map((segment, i) => {
  if (segment.type === 'interaction') {
    const animation = interactionAnimations[segment.interaction];
    return (
      <motion.span key={i} {...animation}>
        {segment.content}
      </motion.span>
    );
  }
  return <span key={i}>{segment.content}</span>;
});
```

---

## Strategic Usage Patterns

### Pattern 1: Climactic Line Only
**Use Case**: Alarms, sudden revelations, dramatic emphasis

**Before** (applies to whole scene):
```typescript
{
  text: `Setup line 1.|Setup line 2.|CLIMACTIC MOMENT!`,
  interaction: 'shake' // ❌ Too broad
}
```

**After** (applies to specific line):
```typescript
{
  text: `Setup line 1.|Setup line 2.|<shake>CLIMACTIC MOMENT!</shake>`
}
```

### Pattern 2: Multiple Targeted Effects
**Use Case**: Different emotions within same scene

```typescript
{
  text: `<jitter>I... I don't know if I can do this.</jitter>|<nod>You can. I've seen you handle worse.</nod>|<bloom>You're right. Let's do it.</bloom>`
}
```

### Pattern 3: Partial Line Emphasis
**Use Case**: Emphasize specific word/phrase within a line

```typescript
{
  text: `The reading is at <shake>CRITICAL</shake> levels. We need to evacuate now.`
}
```

---

## Migration Strategy

### Phase 1: Add Support (Backward Compatible)
- Implement inline interaction parser
- Keep node-level `interaction` property working
- If BOTH exist, inline tags override node-level

### Phase 2: Gradual Refactor
- Identify "whole-node" interactions that should be line-specific
- Convert strategically (e.g., Marcus `marcus_the_bubble`)
- Test each conversion

### Phase 3: Remove Node-Level Property
- Once all content uses inline tags
- Remove `interaction` from DialogueContent type
- Simplify DialogueDisplay component

---

## Benefits

✅ **Precision**: Target specific moments, not entire scenes
✅ **Flexibility**: Multiple effects per scene
✅ **Readability**: Clear visual markers in dialogue text
✅ **Strategic Impact**: Effects applied only where they matter most
✅ **Backward Compatible**: Can migrate gradually

---

## Example Refactors

### Marcus - "The Bubble"
**Current** (shake applies to all 6 lines):
```typescript
{
  id: 'marcus_the_bubble',
  text: `The real enemy? Air.|One bubble in the line.|Brain? Stroke. Heart? Death.|Instant.|Tonight... the alarm screamed.|'AIR IN LINE.'`,
  emotion: 'critical',
  interaction: 'shake' // ❌ Too broad
}
```

**Proposed** (shake applies only to alarm):
```typescript
{
  id: 'marcus_the_bubble',
  text: `The real enemy? Air.|One bubble in the line.|Brain? Stroke. Heart? Death.|Instant.|Tonight... the alarm screamed.|<shake>'AIR IN LINE.'</shake>`,
  emotion: 'critical'
}
```

**Result**: Player sees calm explanation, then BOOM - alarm shakes the screen. Much more impactful.

### Marcus - "Crisis Decision"
**Current** (jitter applies to all lines):
```typescript
{
  id: 'marcus_crisis_decision',
  text: `Protocol says clamp the line. Stop the treatment.|But his potassium's already low. If I clamp, his heart...|*Hands shaking.*|I have 10 seconds.|What do I do?`,
  interaction: 'jitter' // ❌ Too broad
}
```

**Proposed** (jitter only on the panic moment):
```typescript
{
  id: 'marcus_crisis_decision',
  text: `Protocol says clamp the line. Stop the treatment.|But his potassium's already low. If I clamp, his heart...|<jitter>*Hands shaking.*</jitter>|I have 10 seconds.|What do I do?`
}
```

### Tess - "Grant Approval"
**Current**:
```typescript
{
  id: 'tess_grant_approved',
  text: `*Opens email. Subject: 'Grant Decision'.*|*Stares.*|*Re-reads.*|*Laughs.*|It says... 'Approved.'`,
  interaction: 'bloom' // ❌ Blooms entire reading process
}
```

**Proposed** (bloom only on the realization):
```typescript
{
  id: 'tess_grant_approved',
  text: `*Opens email. Subject: 'Grant Decision'.*|*Stares.*|*Re-reads.*|*Laughs.*|<bloom>It says... 'Approved.'</bloom>`
}
```

---

## Alternative: Segment-Based Approach

If inline tags feel too HTML-like, we could use a structured approach:

```typescript
{
  text: [
    { line: `The real enemy? Air.` },
    { line: `One bubble in the line.` },
    { line: `Brain? Stroke. Heart? Death.` },
    { line: `Instant.` },
    { line: `Tonight... the alarm screamed.` },
    { line: `'AIR IN LINE.'`, interaction: 'shake' }
  ]
}
```

**Pros**: More structured, TypeScript-friendly
**Cons**: More verbose, loses readability of single string

---

## Recommendation

**Implement inline tag approach** for:
1. Better readability in dialogue graphs
2. Precision targeting without verbosity
3. Familiar syntax (like rich text emphasis `*bold*`)
4. Easy migration path (backward compatible)

**Apply strategically** to:
- Climactic moments (last line of buildup)
- Specific revelations (not entire explanation)
- Individual reactions (not whole conversation)
- Critical alerts (not entire warning)

**Target**: Reduce from 127 interactions to 30-40, but each one is **perfectly placed** for maximum emotional impact.

---

**Created**: November 23, 2025
**Status**: Proposal for future enhancement
**Priority**: High (quality improvement)
