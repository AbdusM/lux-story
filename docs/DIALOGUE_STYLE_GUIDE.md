# Dialogue Style Guide - Pokémon-Style Game Writing

## Philosophy: "Every Word Earns Its Place"

Grand Central Terminus uses **Pokémon-style dialogue**: ultra-compressed, character-driven, with visual systems doing the heavy lifting. We're building a **game**, not a **novel**.

---

## Core Principles

### 1. **Show Through Systems, Not Text**
❌ **Don't write:** `*He's staring at his hands, holding them perfectly still. His breathing is shallow, controlled.*`
✅ **Do this:** Use `emotion: 'focused_tense'` + `interaction: 'shake'`
💡 **Why:** Avatar expressions and animations convey this better than text

### 2. **Cut All Descriptive Prose**
❌ **Don't write:** `*He blinks, looking at you.*`
✅ **Do this:** Skip it entirely or use `*Sharp glance*` if critical
💡 **Why:** Visual systems show eye contact and body language

### 3. **Dialogue First, Action Beats Second**
❌ **Don't write:** `*He's thinking carefully before speaking.* "I don't know."`
✅ **Do this:** `"I don't know."` with `emotion: 'uncertain'`
💡 **Why:** Players infer hesitation from tone + avatar

### 4. **Compress Technical Information**
❌ **Don't write:** `"Seventy-two beats per minute. Flow rate 4.5 liters. Pressure stable."`
✅ **Do this:** `"Seventy-two beats. Flow rate stable."`
💡 **Why:** Keep key details, cut redundancy

### 5. **Use Italics Sparingly**
- ✅ **Use for:** Critical physical actions that affect the scene
- ✅ **Use for:** Scene transitions or environmental changes
- ❌ **Don't use for:** Character emotions (use `emotion` field)
- ❌ **Don't use for:** Generic body language

---

## Writing Formula

### Standard Dialogue Node Structure
```typescript
{
  text: `[Optional action beat]

Main dialogue here. Keep it punchy.

[Optional second beat if needed]`,

  emotion: 'focused_tense',      // Let avatar show emotion
  interaction: 'shake',            // Let animation show action

  // COMMENTS: Add effects/sound ideas for later
  // TODO: [SFX] Heart monitor beeping
  // TODO: [VFX] Glowing medical readout overlay
}
```

---

## Text Compression Rules

### Rule 1: Cut Adverbs and Adjectives
❌ `"I'm really, really worried about this."`
✅ `"I'm worried."`
💡 `emotion: 'anxious'` shows the intensity

### Rule 2: Use Sentence Fragments
❌ `"I don't know what to do about this situation."`
✅ `"Don't know what to do."`
💡 Natural speech, faster pacing

### Rule 3: Remove Filler Words
❌ `"Well, I think that maybe we should probably try this."`
✅ `"Let's try this."`
💡 Every word should advance plot or character

### Rule 4: Combine Related Sentences
❌ `"The machine is running. The pressure is stable. Everything looks good."`
✅ `"Machine's running. Pressure stable."`
💡 Staccato rhythm = urgency

### Rule 5: Trust the Player
❌ `"I'm holding my hands very carefully because I'm imagining the controls."`
✅ `*Hands frozen mid-air*`
💡 Players are smart, they'll infer

---

## Action Beats Guide

### When to Use Action Beats (Italics)

✅ **USE for scene-critical actions:**
```typescript
"*Grabs your shoulder*

Listen to me."
```

✅ **USE for environmental changes:**
```typescript
"*The lights flicker*

We need to move. Now."
```

✅ **USE for props/objects:**
```typescript
"*Pulls out a circuit board*

See this? That's your future."
```

❌ **DON'T USE for emotions:**
```typescript
// Bad:
"*He looks sad*

I failed."

// Good:
"I failed."
// With: emotion: 'defeated'
```

❌ **DON'T USE for redundant actions:**
```typescript
// Bad:
"*Nods*

Yes."

// Good:
"Yes."
// With: interaction: 'nod'
```

---

## Emotion + Interaction Tags

### Emotion Field (Avatar Expression)
Use these to convey feelings without writing them:
- `focused_tense` - High concentration, stress
- `exhausted_proud` - Tired but accomplished
- `anxious` - Worried, uncertain
- `excited` - Energetic, hopeful
- `defensive` - Guarded, protective
- `vulnerable` - Open, emotionally exposed
- `playful` - Light, teasing
- `serious` - Grave, important

### Interaction Field (Visual Animation)
Use these for physical reactions:
- `shake` - Trembling, emphasis, anger
- `nod` - Agreement, understanding
- `jitter` - Nervous energy, excitement
- `bloom` - Opening up, realization
- `ripple` - Wave of emotion
- `big` - Loud, dramatic moment
- `small` - Quiet, intimate moment

---

## Example Transformations

### Example 1: Marcus Introduction

**Before (Literary - 140 words):**
```typescript
{
  text: `*He's staring at his hands, holding them perfectly still in the air. His breathing is shallow, controlled.*

Seventy-two beats per minute. Flow rate 4.5 liters. Pressure stable.

*He blinks, looking at you.*

Don't bump the table. Please.`
}
```

**After (Pokémon Style - 11 words):**
```typescript
{
  text: `Seventy-two beats. Flow rate stable.

...Don't bump the table.`,

  emotion: 'focused_tense',
  interaction: 'shake',

  // TODO: [SFX] Faint heart monitor beeping
  // TODO: [VFX] Marcus's hands glow slightly when speaking (medical viz overlay)
}
```

### Example 2: Devon's Workshop Scene

**Before (Literary - 85 words):**
```typescript
{
  text: `*Devon wipes sweat from his forehead with the back of his hand, leaving a streak of grease. He's surrounded by half-built projects - circuits, metal frames, tools scattered everywhere.*

Been working on this for weeks. Keep hitting the same wall.

*He kicks a toolbox in frustration.*

Nothing works the way it's supposed to.`
}
```

**After (Pokémon Style - 18 words):**
```typescript
{
  text: `*Surrounded by scattered tools and half-built circuits*

Been working for weeks. Keep hitting walls.

Nothing works.`,

  emotion: 'frustrated',
  interaction: 'shake',

  // TODO: [SFX] Toolbox clatter when he kicks it
  // TODO: [ENV] Visual emphasis on messy workshop environment
}
```

### Example 3: Maya's Code Breakthrough

**Before (Literary - 92 words):**
```typescript
{
  text: `*Maya's eyes light up as she looks at her laptop screen. Her fingers start moving rapidly across the keyboard, typing with sudden confidence.*

Wait. Wait, I think I see it now.

*She leans forward, completely absorbed.*

If I route the sensor data through the classifier first... then normalize the output... yes!

*She looks up at you, grinning.*

I got it. It actually works.`
}
```

**After (Pokémon Style - 21 words):**
```typescript
{
  text: `*Fingers flying across keyboard*

Wait... I see it now.

Route through classifier... normalize output...

*Looks up, grinning*

It works!`,

  emotion: 'excited',
  interaction: 'bloom',

  // TODO: [SFX] Rapid keyboard typing
  // TODO: [VFX] Code success animation (green checkmark or glow)
}
```

---

## Scene-Setting Exception

**Long text IS okay for:**
1. **Platform introductions** (first time entering an area)
2. **Major plot reveals** (critical story moments)
3. **Complex career concepts** (teaching moment)

**Example - Platform Introduction:**
```typescript
{
  text: `*You step onto Platform 4: Medical Technology*

Rows of hospital beds line the walls. Medical equipment hums quietly. The air smells like antiseptic and ozone.

This is where healing meets engineering.`,

  richEffectContext: 'thinking',

  // This is longer because it's environmental/educational
  // Once per platform = acceptable
}
```

---

## Career Concept Teaching

For **career exploration moments**, you can be slightly longer, but stay focused:

❌ **Don't do this (95 words):**
```typescript
{
  text: `ECMO stands for Extracorporeal Membrane Oxygenation. It's a really complex machine that healthcare workers use when someone's heart or lungs aren't working properly. The machine does the work of those organs temporarily. It takes blood out of the body, adds oxygen to it, removes carbon dioxide, and then pumps it back in. It's incredibly technical and requires constant monitoring and adjustment. Only specialized healthcare professionals who have extensive training can operate it safely.`
}
```

✅ **Do this instead (28 words):**
```typescript
{
  text: `ECMO. Pulls blood out, adds oxygen, pumps it back in.

Does the work when hearts fail.

*Glances at equipment*

Tech and care. Both critical.`,

  emotion: 'focused',

  // Player learns: ECMO = technical + caring skill
  // Skill demonstration: Communication (explaining complex topic simply)
}
```

---

## Writing Checklist

Before committing dialogue, ask:

- [ ] Can an avatar expression replace emotional description?
- [ ] Can an interaction animation replace an action beat?
- [ ] Are there adverbs/adjectives I can cut?
- [ ] Can I combine sentences without losing meaning?
- [ ] Is every word earning its place?
- [ ] Would a player want to read this twice?
- [ ] Have I added TODO comments for sound/visual effects?

**Target:** 10-30 words per dialogue node (except scene-setting)

---

## Comments for Future Effects

Always add TODO comments for non-text elements:

```typescript
{
  text: `Engine's failing. We need to move.`,
  emotion: 'urgent',
  interaction: 'shake',

  // TODO: [SFX] Rumbling engine sound, getting louder
  // TODO: [VFX] Screen shake effect during dialogue
  // TODO: [MUSIC] Tension track kicks in
  // TODO: [ENV] Red warning lights start flashing in background
}
```

This keeps the dialogue file as the **source of truth** for all scene details, even if we implement effects later.

---

## Quick Reference Card

| Element | Write it? | Show it how? |
|---------|-----------|--------------|
| Character emotion | ❌ No | `emotion` field |
| Physical action | ⚠️ Sometimes | `interaction` field or critical beat |
| Dialogue | ✅ Yes | Keep it punchy |
| Technical info | ✅ Yes | Compress it |
| Setting/environment | ✅ Yes | First time only |
| Sound effects | ❌ No | `// TODO: [SFX]` comment |
| Visual effects | ❌ No | `// TODO: [VFX]` comment |

---

## Further Reading

- `content/marcus-dialogue-graph.ts` - See examples in practice
- `components/CharacterAvatar.tsx` - Available emotion states
- `components/DialogueDisplay.tsx` - Interaction animations
- `docs/SKILL_DEMONSTRATION_GUIDE.md` - How dialogue maps to skills

---

**Remember:** You're writing for a **game**, not a **book**. Trust your visual systems. Every word should feel like a meaningful choice the player had to read. If you can cut it without losing story or skill demonstration, cut it.
