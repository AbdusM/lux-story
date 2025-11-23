# Gemini QA Prompt: Pokémon-Style Dialogue Refactor Validation

## Context

We've implemented a Pokémon-style dialogue system for Grand Central Terminus, a career exploration game. The goal is to compress text by 60-70% while maintaining emotional impact through visual systems (emotions + animations).

**What we built:**
1. **13 emotion handlers** that control "thinking" states during chat pacing
2. **7 interaction animations** using Framer Motion (shake, jitter, nod, bloom, ripple, big, small)
3. **Pokémon-style dialogue refactor** of the first 4 Marcus nodes (58% average compression)

## Your Task: Comprehensive QA Review

Please review the implementation and provide feedback on:

### 1. Technical Validation

**Files to Review:**
- `components/ChatPacedDialogue.tsx` (lines 106-221) - Emotion handlers
- `components/DialogueDisplay.tsx` (lines 58-105, 183-238) - Interaction animations
- `content/marcus-dialogue-graph.ts` (lines 17-165) - Refactored dialogue nodes
- `docs/DIALOGUE_STYLE_GUIDE.md` - Complete style guide

**Check for:**
- [ ] TypeScript type safety maintained
- [ ] React best practices followed
- [ ] No performance issues (animations smooth)
- [ ] Proper error handling
- [ ] Code organization and clarity
- [ ] Accessibility considerations

### 2. Content Quality Review

**Before vs After Comparison:**

#### Node 1: marcus_introduction
**BEFORE (35 words):**
```
*He's staring at his hands, holding them perfectly still in the air. His breathing is shallow, controlled.*

Seventy-two beats per minute. Flow rate 4.5 liters. Pressure stable.

*He blinks, looking at you.*

Don't bump the table. Please.
```

**AFTER (11 words):**
```
Seventy-two beats. Flow rate stable.

...Don't bump the table.
```
- Emotion: `focused_tense`
- Interaction: `shake`

#### Node 2: marcus_visualizes_machine
**BEFORE (49 words):**
```
I'm holding a life. Well, the machine that holds the life.

ECMO. Extracorporeal Membrane Oxygenation. It pulls blood out, oxygenates it, warms it, and pumps it back in.

For the last twelve hours, I was the only thing keeping a 40-year-old father alive while his heart waited for a transplant.
```

**AFTER (21 words):**
```
I'm holding a life. The machine that holds the life.

ECMO. Pulls blood out, adds oxygen, pumps it back in.

Twelve hours. Just me and the machine. Keeping a father alive.
```
- Emotion: `exhausted`
- Interaction: `small`

#### Node 3: marcus_technical_pride
**BEFORE (59 words):**
```
Me and the machine. We're a loop. I watch the flow dynamics, the hemolysis numbers, the clot risks.

People think nursing is just... comforting. And it is. But in the CVICU (Cardiovascular Intensive Care Unit), it's engineering. Fluid dynamics. Pressure regulation.

If I calculate the heparin drip wrong, he bleeds out. If I miss a clot, he strokes out.
```

**AFTER (25 words):**
```
Me and the machine. We're a loop.

Flow dynamics. Hemolysis. Clot risks.

CVICU isn't just comfort. It's engineering.

Wrong heparin calc? He bleeds. Missed clot? Stroke.
```
- Emotion: `proud`
- Interaction: `nod`

#### Node 4: marcus_the_bubble
**BEFORE (38 words):**
```
But the real enemy? Air.

One bubble. One tiny pocket of air in the return line. If it hits his brain? Stroke. If it hits his heart? Vapor lock. Death.

Instant.

Tonight... the alarm screamed. 'AIR IN LINE.'
```

**AFTER (19 words, with chat pacing):**
```
The real enemy? Air.|One bubble in the line.|Brain? Stroke. Heart? Death.|Instant.|Tonight... the alarm screamed.|'AIR IN LINE.'
```
- Emotion: `critical`
- Interaction: `shake`
- Uses chat pacing (reveals one chunk at a time)

### Questions to Answer:

#### A. Content Effectiveness
1. Does the compressed text maintain the **emotional impact** of the original?
2. Is Marcus's character voice still distinct and authentic?
3. Are the **key story beats** preserved (medical precision, high stakes, technical mastery)?
4. Does the dialogue feel "game-like" rather than "novel-like"?
5. Is critical information retained (ECMO explanation, bubble danger, etc.)?

#### B. Compression Quality
1. Is the 58% average compression appropriate, or should we go further/less?
2. Are there any instances where we cut **too much** (losing clarity)?
3. Are there any instances where we could cut **more** (still wordy)?
4. Does the staccato rhythm work for dramatic tension?

#### C. Visual Systems Integration
1. Are the emotion tags appropriate for each scene?
   - `focused_tense` for introduction?
   - `exhausted` for after 12-hour shift?
   - `proud` for technical expertise?
   - `critical` for the alarm moment?

2. Are the interaction animations fitting?
   - `shake` for tension/urgency?
   - `small` for quiet exhaustion?
   - `nod` for affirmation/pride?

3. Does chat pacing enhance the bubble scene's drama?

#### D. Learning Objectives
Marcus's arc teaches about:
- **ECMO technology** (medical device)
- **Cardiovascular ICU nursing** (career)
- **Crisis management** (skill)
- **Technical precision** (skill)

Are these learning objectives still clear in the compressed text?

#### E. Player Experience
1. Would a 14-17 year old find this engaging?
2. Is the pacing fast enough to maintain attention?
3. Are technical terms explained adequately?
4. Does the dialogue invite emotional connection with Marcus?

### 3. Style Guide Validation

**Review:** `docs/DIALOGUE_STYLE_GUIDE.md`

**Check:**
- [ ] Are the compression rules clear and actionable?
- [ ] Are all 13 emotions documented with examples?
- [ ] Are all 7 interactions documented with use cases?
- [ ] Is the "Quick Reference Card" accurate?
- [ ] Are the example transformations helpful?

### 4. Recommendations

Please provide:

1. **Critical Issues** (must fix before proceeding)
2. **Suggested Improvements** (nice to have)
3. **Validation** (what works well)
4. **Compression Adjustments** (per-node feedback)
5. **Next Steps** (proceed with full refactor? iterate on pilot?)

### 5. Specific Concerns to Address

1. **Technical Accuracy**: Does the ECMO description remain medically accurate after compression?
2. **Emotional Authenticity**: Does Marcus still feel like a real person under pressure?
3. **Player Agency**: Do the choices still make sense given the compressed dialogue?
4. **Educational Value**: Can players still learn about the career/technology?
5. **Cultural Sensitivity**: Is the portrayal of nursing as technical work respectful?

## Output Format

Please structure your response as:

```markdown
# QA Report: Pokémon-Style Dialogue Refactor

## Executive Summary
[Overall assessment: Ready to proceed? Need changes?]

## Technical Validation
### Code Quality: ✅/⚠️/❌
[Findings...]

### Performance: ✅/⚠️/❌
[Findings...]

### Type Safety: ✅/⚠️/❌
[Findings...]

## Content Quality Review
### Node-by-Node Analysis

#### marcus_introduction
- Compression effectiveness: [1-5 scale]
- Emotional impact preserved: [Yes/Partial/No]
- Suggested edits: [If any]

[Repeat for all 4 nodes]

## Visual Systems Evaluation
### Emotion Tags: ✅/⚠️/❌
[Assessment of emotion choices]

### Interaction Animations: ✅/⚠️/❌
[Assessment of animation choices]

### Chat Pacing: ✅/⚠️/❌
[Assessment of pacing usage]

## Learning Objectives Check
- [ ] ECMO technology explanation clear
- [ ] CVICU nursing career attractive
- [ ] Crisis management demonstrated
- [ ] Technical precision valued

## Critical Issues
1. [Issue 1]
2. [Issue 2]

## Suggested Improvements
1. [Improvement 1]
2. [Improvement 2]

## What Works Well
1. [Strength 1]
2. [Strength 2]

## Compression Recommendations
- Overall target: [Keep 60-70%? Adjust to X%?]
- Per-node adjustments: [Specific feedback]

## Final Recommendation
[ ] ✅ Proceed with full Marcus refactor (46 more nodes)
[ ] ⚠️ Iterate on pilot first (make these changes...)
[ ] ❌ Reconsider approach (major issues found)

## Next Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]
```

## Additional Context

**Target Audience:** 14-17 year olds exploring career options
**Genre:** Visual novel / career exploration game
**Inspiration:** Pokémon dialogue (ultra-minimal), Fire Emblem (character voice), Persona (stylish)
**Platform:** Web (desktop + mobile)
**Goal:** Fast-paced, replayable, emotionally engaging career education

**Success Criteria:**
- Text compression: 60-70% ✅ (58% achieved)
- Emotional impact: Maintained through visual systems
- Learning objectives: Clear and engaging
- Player engagement: Fast pacing, no boredom
- Lint warnings: 0 new ✅

## Files to Access

All files are in the codebase at:
- `/Users/abdusmuwwakkil/Development/30_lux-story/`

Key files:
- `components/ChatPacedDialogue.tsx`
- `components/DialogueDisplay.tsx`
- `content/marcus-dialogue-graph.ts`
- `docs/DIALOGUE_STYLE_GUIDE.md`
- `docs/PHASE1_AUDIT_REPORT.md`
- `app/test-emotions-interactions/page.tsx`

---

**Thank you for your thorough review!** Your feedback will help us validate this approach before applying it to 130+ dialogue nodes across 3 character arcs.
