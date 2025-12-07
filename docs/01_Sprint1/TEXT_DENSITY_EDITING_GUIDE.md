# Text Density Editing Guide

**Goal:** Reduce text density to 30-80 words per node, remove all stage directions/actions, use pure dialogue only.

---

## Core Principles

### 1. Pure Dialogue Only
- **NO stage directions:** Remove all italic text (`*text*`), underscore italic (`_text_`)
- **NO actions:** Remove all behavioral descriptions ("A pause", "His voice breaks", "Studies you")
- **NO show-don't-tell:** Remove all "Not judgment. Understanding." type descriptions
- **Everything through dialogue:** Emotion, subtext, character must come from what they SAY

### 2. Word Count Target
- **Target:** 30-80 words per node (currently 150-200+)
- **Split long nodes:** Break nodes >80 words into 2-3 sequential nodes
- **One idea per node:** Each node should have one clear purpose

### 3. Dialogue Patterns for Emotion
Since we can't use stage directions, use dialogue patterns:
- **Ellipses for hesitation:** "I... I don't know."
- **Fragments for anxiety:** "Pre-med. Second year. It's going great. Really great."
- **Repetition for emphasis:** "Good. That's what this place is for. Good."
- **Short sentences for weight:** "I've been here a long time. Longer than I expected."

### 4. Concrete Over Abstract
- Replace abstract phrases: "discover about yourself" → Cut entirely
- Replace flowery language: "bronze-tinged rays" → "morning light"
- Use familiar contexts: "houseplant wilting" vs "water scarcity"

---

## Step-by-Step Editing Process

### Step 1: Identify Target Nodes
```bash
npm run analyze-text-density --character=samuel
```

This will show:
- Nodes >80 words (priority targets)
- Nodes with stage directions (must remove)
- Nodes with abstract language (should replace)

### Step 2: Plan the Split
For a node with 200 words:
1. Read the full text
2. Identify natural break points (sentences, paragraphs, ideas)
3. Plan 2-3 new nodes (target: 30-50 words each)
4. Plan where choices will appear

### Step 3: Remove Stage Directions
**Find and remove:**
- `*text*` (italic stage directions)
- `_text_` (underscore italic)
- "A pause"
- "His voice breaks" / "Her voice breaks"
- "Studies you"
- "Not judgment. Understanding."
- "This isn't just a job."
- "Something settles in you"
- "carries weight" / "voice carries"

**Replace with dialogue patterns:**
- "A pause" → Use ellipses: "I've been here... a long time."
- "His voice carries weight" → Use repetition: "A long time. Longer than I expected."

### Step 4: Split the Node

**Example transformation:**

**Before (200 words, has stage directions):**
```typescript
{
  nodeId: 'samuel_introduction',
  content: [{
    text: "Welcome. I'm Samuel Washington. I've been helping people find their way in Birmingham for a long time.\n\nYou're here to figure some things out. Good. That's what this place is for.\n\nYou'll meet some folks, hear their stories, and make some choices. No tests, no grades. Just real conversations.{{patience>=3:\n\n*Something settles in you—finally, a place where you can take your time.*|}}\n\nWhat you discover about yourself? It helps us help the next person who walks through that door.",
    variation_id: 'intro_v1'
  }],
  choices: [...]
}
```

**After (3 nodes, 20-40 words each, pure dialogue):**
```typescript
{
  nodeId: 'samuel_introduction_1',
  content: [{
    text: "Welcome. I'm Samuel Washington.",
    variation_id: 'intro_v1_part1'
  }],
  choices: [
    { text: "Who are you?", nextNodeId: 'samuel_introduction_2' },
    { text: "What is this place?", nextNodeId: 'samuel_explains_station' },
    { text: "I'm looking for help.", nextNodeId: 'samuel_introduction_2' }
  ]
},
{
  nodeId: 'samuel_introduction_2',
  content: [{
    text: "I've been helping people find their way in Birmingham for a long time. Longer than I expected.",
    variation_id: 'intro_v1_part2'
  }],
  choices: [
    { text: "How long?", nextNodeId: 'samuel_introduction_3' },
    { text: "What kind of help?", nextNodeId: 'samuel_explains_station' },
    { text: "Why Birmingham?", nextNodeId: 'samuel_introduction_3' }
  ]
},
{
  nodeId: 'samuel_introduction_3',
  content: [{
    text: "You're here to figure some things out. Good. That's what this place is for. No tests, no grades. Just real conversations.",
    variation_id: 'intro_v1_part3'
  }],
  choices: [
    { text: "What is this place?", nextNodeId: 'samuel_explains_station' },
    { text: "I'm ready to explore.", nextNodeId: 'samuel_hub_initial' }
  ]
}
```

**Key changes:**
- Removed: `*Something settles in you—finally, a place where you can take your time.*` (stage direction)
- Removed: "What you discover about yourself? It helps us help the next person" (abstract, cut)
- Split: 200 words → 3 nodes (20, 25, 30 words)
- Added: Dialogue pattern "Longer than I expected." (shows weight through dialogue)
- Choices: Appear after each short node

### Step 5: Update Node References

**Critical:** When you split a node, update ALL references:

1. **Update choices pointing to original node:**
   - Find all `nextNodeId: 'samuel_introduction'`
   - Change to `nextNodeId: 'samuel_introduction_1'`

2. **Update cross-character references:**
   - Check if other characters reference this node
   - Update those references too

3. **Update floating modules:**
   - Check `content/floating-modules.ts`
   - Update any triggers that reference the original node

### Step 6: Handle State

When splitting nodes, decide where state changes go:

- **`onEnter`:** Usually on first new node
- **`onExit`:** Usually on last new node
- **`requiredState`:** Usually on first new node (or distribute if needed)

### Step 7: Test

After editing:
```bash
npm run validate-graphs  # Check node references
npm run test-all-arcs    # Test narrative flow
npm run analyze-text-density --character=samuel  # Verify word counts
```

---

## Common Patterns to Remove

### Stage Directions
- `*text*` - Italic stage directions
- `_text_` - Underscore italic
- "A pause"
- "His voice breaks" / "Her voice breaks"
- "Studies you"
- "Not judgment. Understanding."
- "This isn't just a job."
- "Something settles in you"
- "carries weight"
- "voice carries"

### Actions/Behavioral Descriptions
- "Not judgment. Understanding."
- "This isn't just a job."
- "He was waiting for..."
- "You showed him..."
- Any description of how character acts/reacts

### Abstract Language
- "discover about yourself"
- "find your path"
- "figure things out"
- "what you discover"
- "meaningful change"
- "purpose"
- "journey" (when used abstractly)
- "transformation" (when used abstractly)

---

## Dialogue Patterns for Emotion

Since we can't use stage directions, convey emotion through dialogue:

### Hesitation/Uncertainty
- Use ellipses: "I... I don't know."
- Use fragments: "Pre-med. Second year. It's going great. Really great."

### Weight/Importance
- Use repetition: "Good. That's what this place is for. Good."
- Use short sentences: "I've been here a long time. Longer than I expected."

### Anxiety/Stress
- Use fragments: "Biochemistry notes. Robotics parts. Everywhere."
- Use repetition: "It's going great. Really great."

### Warmth/Comfort
- Use complete sentences: "Welcome. I'm Samuel Washington."
- Use measured pace: Longer, thoughtful sentences

---

## Validation Checklist

After editing each character:
- [ ] All nodes <80 words
- [ ] No stage directions (italic text removed)
- [ ] No actions/behavioral descriptions
- [ ] All `nextNodeId` references valid
- [ ] Narrative flow still works (test full arc)
- [ ] Character voice maintained (check reference sheet)
- [ ] Cross-character references still work
- [ ] Floating modules still trigger (if applicable)

---

## Example: Complete Transformation

### Before
```typescript
{
  nodeId: 'samuel_introduction',
  content: [{
    text: "Welcome. I'm Samuel Washington. I've been helping people find their way in Birmingham for a long time.\n\nYou're here to figure some things out. Good. That's what this place is for.\n\nYou'll meet some folks, hear their stories, and make some choices. No tests, no grades. Just real conversations.{{patience>=3:\n\n*Something settles in you—finally, a place where you can take your time.*|}}\n\nWhat you discover about yourself? It helps us help the next person who walks through that door.",
  }]
}
```
**Issues:**
- 200+ words
- Stage direction: `*Something settles in you...*`
- Abstract: "What you discover about yourself?"
- Abstract: "It helps us help the next person"

### After
```typescript
{
  nodeId: 'samuel_introduction_1',
  content: [{
    text: "Welcome. I'm Samuel Washington.",
  }],
  choices: [
    { text: "Who are you?", nextNodeId: 'samuel_introduction_2' },
    { text: "What is this place?", nextNodeId: 'samuel_explains_station' }
  ]
},
{
  nodeId: 'samuel_introduction_2',
  content: [{
    text: "I've been helping people find their way in Birmingham for a long time. Longer than I expected.",
  }],
  choices: [
    { text: "How long?", nextNodeId: 'samuel_introduction_3' },
    { text: "What kind of help?", nextNodeId: 'samuel_explains_station' }
  ]
},
{
  nodeId: 'samuel_introduction_3',
  content: [{
    text: "You're here to figure some things out. Good. That's what this place is for. No tests, no grades. Just real conversations.",
  }],
  choices: [
    { text: "What is this place?", nextNodeId: 'samuel_explains_station' },
    { text: "I'm ready to explore.", nextNodeId: 'samuel_hub_initial' }
  ]
}
```
**Improvements:**
- 200 words → 70 words total (65% reduction)
- Removed all stage directions
- Removed abstract language
- Added dialogue pattern: "Longer than I expected." (shows weight)
- Choices appear after short text
- Pure dialogue only

---

*This guide should be your reference for every node edit.*
