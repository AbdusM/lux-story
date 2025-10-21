# Message Type Presentation Rules

## Core Principle: 7±2 Cognitive Chunks

**Most content should appear instantly** - people can process bite-sized information (phone number length) immediately. Typewriter should be **extremely rare** and only for specific reading experiences.

## Typewriter Effect Usage (RARE)

### ✅ USE TYPEWRITER ONLY FOR:

#### **Pure Letter/Note Content** (Document Reading Simulation)
- **Rule**: >85% of text is quoted letter content AND >20 characters
- **Example**: `"Your future awaits at Platform 7. Midnight. Don't be late."`
- **Why**: Simulates the physical act of reading a document
- **Frequency**: Very rare - only for actual document content

### ❌ INSTANT DISPLAY FOR EVERYTHING ELSE:

#### **All Descriptions** (Context & Environment)
- **Rule**: Any descriptive text, including around letters
- **Example**: `"At the bottom of the letter, in smaller text:"`
- **Why**: Context should be immediate, cognitive load is manageable

#### **All Dialogue** (Natural Conversation)
- **Rule**: All character speech, regardless of length
- **Example**: Character conversations, backstories, reveals
- **Why**: People read dialogue naturally at their own pace

#### **All Narration** (Scene Setting)
- **Rule**: Environmental descriptions, scene transitions
- **Example**: `"You found a letter under your door this morning."`
- **Why**: Scene setting should be immediate for flow

#### **All User Choices** (Immediate Feedback)
- **Rule**: Player choice confirmations and selections
- **Why**: User actions need instant response

## Message Types by Category

### **`narration`** - Environmental & Scene Description
- **Speakers**: `narrator`
- **Typewriter**: Only for long passages (>150 chars) or letter content (>60% quoted)
- **Styling**: Center-aligned, italic, neutral colors

### **`dialogue`** - Character Speech  
- **Speakers**: Samuel, Maya, Jordan, etc.
- **Typewriter**: Only for very long emotional speeches (>200 chars)
- **Styling**: Character-specific colors, emoji avatars, Pokemon boxes

### **`choice`** - Interactive Decision Points
- **Speakers**: System-generated choice text
- **Typewriter**: Never (choices need immediate presentation)
- **Styling**: Multiple button layout, choice-specific button text

### **`whisper`** - Subtle/Internal (Unused Currently)
- **Purpose**: Internal thoughts, environmental cues
- **Typewriter**: Never (subtle content shouldn't demand attention)
- **Styling**: Reduced opacity, smaller font

### **`sensation`** - Physical/Emotional (Unused Currently)  
- **Purpose**: Physical sensations, body awareness
- **Typewriter**: Never (immediate physical feedback)
- **Styling**: Red highlighting, italic text

## Implementation Logic

```typescript
const shouldUseTypewriter = (text: string, type: string, speaker: string) => {
  // Letter/note content being read
  if (text.includes('"') && type === 'narration') {
    const quotedPart = text.match(/"([^"]*)"/)?.[1] || '';
    return quotedPart.length > text.length * 0.6; // >60% quoted content
  }
  
  // Long contemplative passages (no quotes)
  if (text.length > 150 && type === 'narration' && !text.includes('"')) return true;
  
  // Deep character emotional reveals
  if (type === 'dialogue' && text.length > 200) return true;
  
  return false; // Default to instant
}
```

## Examples from Current Story

### Typewriter Examples:
- `"Your future awaits at Platform 7. Midnight. Don't be late."` ✅ (Letter content)
- Long environmental descriptions >150 chars ✅ (Contemplative)

### Instant Examples:
- `"You found a letter under your door this morning."` ❌ (Scene description)
- `"At the bottom of the letter, in smaller text:"` ❌ (Context, not content)
- Most character dialogue ❌ (Conversation flow)
- All user choices ❌ (Immediate feedback)

## Design Philosophy

**Typewriter = Reading Experience**: Use when simulating the act of reading something (letters, documents) or when forcing contemplation (long descriptions, emotional reveals).

**Instant = Natural Flow**: Use for everything else to maintain narrative momentum and natural conversation pacing.