# Text Chunking Analysis & Guidelines

## Current State Assessment

### ✅ What's Working Well (8/10 Desktop)

1. **Clear Visual Separation**
   - Grey border for narrative text
   - Purple/colored borders for character dialogue
   - Character icons and labels provide instant recognition
   - This visual hierarchy aids cognitive processing

2. **Appropriate Desktop Paragraph Length**
   - Story blocks: ~80 words (5 sentences) - readable without overwhelming
   - Dialogue blocks: ~75 words - natural conversational flow
   - Not creating walls of text

3. **Natural Reading Flow**
   - Scene setting → Character introduction → Dialogue
   - Follows standard narrative structure
   - Logical progression through content

### 📊 Current Performance
- **Desktop:** 8/10 - Good chunking, clear hierarchy
- **Mobile:** 6/10 - Could benefit from more breaks

## Recommended Improvements

### 1. Dialogue Breaking Strategy
**Current Issue:** Maya's long dialogue block combines multiple thoughts

**Before:**
```
"You notice the warmth too? Platform 1's been glowing differently since... whatever you did during that frozen moment. Look, can I tell you something? My mom cleans rooms at UAB Hospital..."
```

**Improved:**
```
Para 1: "You notice the warmth too? Platform 1's been glowing differently since... whatever you did during that frozen moment."

[Visual break/pause]

Para 2: Maya looks away for a moment. "You know what's crazy? My mom cleans rooms at UAB Hospital..."
```

### 2. Opening Narrative Density
**Current:** Dense with sensory details in one block
**Better:** Break after "The pages smell of highlighter and desperation"

### 3. Mobile-Specific Chunking Rules

We've already implemented aggressive mobile chunking (2-3 sentences max), which might be too aggressive. Consider:

**Desktop (max per chunk):**
- Narrative: 5 sentences / 100 words
- Dialogue: 4 sentences / 80 words
- Total before interaction: 150 words

**Mobile (max per chunk):**
- Narrative: 3 sentences / 50 words
- Dialogue: 2-3 sentences / 40 words
- Total before interaction: 100 words

## Visual Hierarchy System (Keep This!)

The border system is excellent and should be maintained:

```css
/* Narrative blocks */
.story-narration {
  border: 2px solid #e5e5e7; /* Grey */
  background: rgba(0, 0, 0, 0.02);
}

/* Character dialogue */
.story-dialogue {
  border: 2px solid [character-color];
  background: rgba([character-color], 0.05);
}

/* Character labels */
.speaker-label {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

## Implementation Status

### Already Implemented:
- ✅ Mobile text splitting (117 scenes split into smaller chunks)
- ✅ Visual hierarchy with borders and colors
- ✅ Character icons and labels
- ✅ Responsive font sizing

### Potential Over-Corrections:
- Might have split TOO aggressively for mobile
- Some 2-sentence chunks might feel choppy
- Natural dialogue flow possibly disrupted

### Balance Needed:
- Desktop users get fuller paragraphs (current is good)
- Mobile gets reasonable chunks (not too choppy)
- Maintain narrative flow while ensuring readability

## Guidelines Going Forward

### Text Chunking Rules:

1. **Natural Breaks Over Arbitrary Limits**
   - Break at topic shifts
   - Break at emotional beats
   - Break at scene transitions

2. **Character Dialogue**
   - Break when character pauses
   - Break when shifting topics
   - Keep related thoughts together

3. **Narrative Description**
   - One sensory detail set per chunk
   - Action separate from description
   - Internal thoughts separate from external

### Visual Presentation:

1. **Maintain Border System** - It's working excellently
2. **Keep Character Icons** - Instant recognition
3. **Preserve Color Coding** - Different characters, different colors
4. **Use Spacing** - Let content breathe

## Conclusion

The current implementation is strong (8/10 desktop, 6/10 mobile). The visual hierarchy is excellent and should be preserved. Minor adjustments to dialogue breaking and slightly less aggressive mobile chunking would push both scores higher.

The key insight: **Visual separation (borders, colors, icons) is doing heavy lifting for readability** - this is more important than aggressive text splitting.