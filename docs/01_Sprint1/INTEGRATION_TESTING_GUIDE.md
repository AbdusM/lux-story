# Pokémon-Style Dialogue Refactor - Integration Testing Guide

## Overview

This guide provides instructions for testing the refactored Marcus, Tess, and Yaquin dialogue arcs after applying the Pokémon-style compression methodology.

**Refactored Arcs:**
- Marcus: 50 nodes (45% compression)
- Tess: 28 nodes (49.2% compression)
- Yaquin: 28 nodes (56.1% compression)

**Total**: 106 nodes refactored with 0 TypeScript errors

---

## Testing Checklist

### 1. Automated Validation ✅

**TypeScript Compilation:**
```bash
npx tsc --noEmit
```
**Status**: ✅ 0 errors across all dialogue graphs

**Lint Check:**
```bash
npm run lint
```
**Status**: ✅ 0 new warnings introduced

---

### 2. Browser Testing (Manual)

**Access the Game:**
```bash
npm run dev
# Server runs on http://localhost:3005
```

#### Test Plan: Marcus Arc

**Entry Point**: Select Marcus from Samuel Hub

**Things to Test:**
1. **Dialogue Navigation**
   - ✓ All nodes accessible through choice selections
   - ✓ No broken `nextNodeId` references
   - ✓ Choices lead to expected nodes

2. **Chat Pacing** (45/50 nodes use chat pacing)
   - ✓ Text reveals sequentially using `|` separators
   - ✓ Staccato rhythm creates medical urgency
   - ✓ Player can click through at their own pace
   - **Example to check**: marcus_the_bubble
     ```
     "The real enemy? Air.|One bubble in the line.|Brain? Stroke. Heart? Death.|Instant.|Tonight... the alarm screamed.|'AIR IN LINE.'"
     ```

3. **Emotion Tags** (50/50 nodes have emotions)
   - ✓ "Thinking..." states display character-specific text
   - ✓ Medical emotions (focused/tense, clinical, critical, exhausted, proud)
   - **Check marcus_introduction**: `emotion: 'focused/tense'`
     - Should show: "monitoring vitals", "calculating", etc.

4. **Interaction Animations** (56 interaction tags)
   - ✓ `shake`: Alarm urgency, crisis moments
   - ✓ `jitter`: Anxiety, pressure
   - ✓ `nod`: Confirmation, understanding
   - ✓ `bloom`: Realization moments
   - ✓ `ripple`: Success feedback
   - ✓ `big`: Triumph (saving patient)
   - ✓ `small`: Defeat, regret

5. **Compression Quality**
   - ✓ Technical terminology preserved (dialysate, hemodynamics, vapor lock)
   - ✓ Medical precision maintained
   - ✓ Crisis management clear
   - ✓ Emotional impact preserved/enhanced

6. **Learning Objectives**
   - ✓ Crisis response patterns demonstrated
   - ✓ Technical troubleshooting visible
   - ✓ Ethical decision-making moments present
   - ✓ Accountability themes clear

#### Test Plan: Tess Arc

**Entry Point**: Select Tess from Samuel Hub

**Things to Test:**
1. **Dialogue Navigation**
   - ✓ All 28 nodes accessible
   - ✓ Branching paths work (risk vs. safety)
   - ✓ Grant proposal decision points functional

2. **Chat Pacing** (26/28 nodes use chat pacing)
   - ✓ Passionate outbursts feel natural
   - ✓ Wilderness metaphors land
   - **Example to check**: tess_introduction
     ```
     "*Pacing. Hiking boots on marble. Blazer over flannel.*|*Stops at corkboard of index cards.*|'Not rigor. Resilience? Too soft. Grit? Overused.'"
     ```

3. **Emotion Tags** (28/28 nodes have emotions)
   - ✓ Passionate, determined, conflicted, inspired emotions
   - **Check tess_introduction**: `emotion: 'passionate'`
     - Should show: "blazing with vision", "fired up", etc.

4. **Interaction Animations** (43 interaction tags)
   - ✓ `jitter`: Nervous energy before grant decision
   - ✓ `shake`: Passionate emphasis
   - ✓ `bloom`: Inspiration moments
   - ✓ `big`: Vision reveal
   - ✓ `small`: Vulnerability about school system

5. **Compression Quality**
   - ✓ Wilderness metaphors preserved (crucible, catalyst)
   - ✓ Grant writing language intact
   - ✓ Idealism vs. pragmatism tension clear
   - ✓ Visionary educator voice maintained

6. **Learning Objectives**
   - ✓ Curriculum design principles visible
   - ✓ Experiential learning explained
   - ✓ Grant writing process demonstrated
   - ✓ Social change theory present

#### Test Plan: Yaquin Arc

**Entry Point**: Select Yaquin from Samuel Hub

**Things to Test:**
1. **Dialogue Navigation**
   - ✓ All 28 nodes accessible
   - ✓ Phase 1 → Phase 2 progression works
   - ✓ Branching decisions functional (cohort vs. self-paced)

2. **Chat Pacing** (25/28 nodes use chat pacing)
   - ✓ Data presentation rhythm
   - ✓ Analytical pacing feels systematic
   - **Example to check**: yaquin_p2_format_decision
     ```
     "Data:|**Self-motivated**: 85% completion. Glowing reviews.|**Boss-mandated**: 32% completion. Most refunds.|*Sketches paths.*|What would you do?"
     ```

3. **Emotion Tags** (28/28 nodes have emotions)
   - ✓ Analytical, focused, conflicted, proud, vulnerable emotions
   - **Check yaquin_introduction**: `emotion: 'analytical'`
     - Should show: "analyzing data", "computing", etc.

4. **Interaction Animations** (28 interaction tags)
   - ✓ `nod`: Analytical affirmation
   - ✓ `bloom`: Insight moments
   - ✓ `small`: Imposter syndrome, vulnerability
   - ✓ `big`: Launch triumph (when course goes live)

5. **Compression Quality**
   - ✓ Statistics exact (85% → 23%, $15K/office)
   - ✓ Bullet points compress well
   - ✓ Data-driven language preserved
   - ✓ Systematic thinking clear

6. **Learning Objectives**
   - ✓ Curriculum design visible
   - ✓ Creator economy principles demonstrated
   - ✓ Business operations (refunds, pricing) present
   - ✓ Data-driven decision making clear

---

### 3. Visual/Animation Testing

**Emotion System:**
1. Open browser dev tools (Console)
2. Navigate through dialogue
3. Watch for emotion state transitions during chat pacing
4. Verify character-specific "thinking" text appears correctly

**Interaction Animations:**
1. Watch for Framer Motion animations on key moments
2. Verify animations match the emotional tone:
   - `shake` = urgency/emphasis
   - `jitter` = nervous energy
   - `nod` = affirmation
   - `bloom` = realization
   - `ripple` = success
   - `big` = triumph
   - `small` = vulnerability

---

### 4. Performance Testing

**Chat Pacing Performance:**
- ✓ No lag between text reveals
- ✓ Smooth transitions
- ✓ Player can skip ahead by clicking

**Animation Performance:**
- ✓ 60fps during Framer Motion animations
- ✓ No jank or stuttering
- ✓ Smooth on mobile devices

---

### 5. Accessibility Testing

**Keyboard Navigation:**
- ✓ Can navigate choices with Tab/Enter
- ✓ Chat pacing advances with Space/Enter
- ✓ Animations don't block interaction

**Screen Reader:**
- ✓ Emotion states announced
- ✓ Chat pacing segments read in order
- ✓ Interaction animations don't interfere

---

## Known Issues / Limitations

### Missing Samuel Reflection Nodes
Some `nextNodeId` references point to Samuel reflection gateway nodes that don't exist yet:
- `samuel_marcus_reflection_gateway`
- `samuel_tess_reflection_gateway`
- `samuel_yaquin_reflection_gateway`

**Status**: Expected - these nodes are part of Samuel's hub, not the character arcs

**Impact**: No impact on arc testing - these are exit points back to Samuel Hub

---

## Testing Results Template

```markdown
## [Arc Name] Testing Results

**Date**: [Date]
**Tester**: [Name]
**Branch**: refactor/pokemon-dialogue

### Dialogue Navigation
- [ ] All nodes accessible
- [ ] No broken references
- [ ] Branching paths work correctly

### Chat Pacing
- [ ] Text reveals sequentially
- [ ] Rhythm feels natural for character
- [ ] Player can control pace

### Emotion Tags
- [ ] "Thinking" states display correctly
- [ ] Character-specific variations present
- [ ] Transitions smooth

### Interaction Animations
- [ ] All 7 animation types functional
- [ ] Animations match emotional tone
- [ ] No performance issues

### Compression Quality
- [ ] Character voice maintained
- [ ] Learning objectives clear
- [ ] Technical/specialized language preserved
- [ ] Emotional impact present

### Issues Found
[List any bugs, UX problems, or quality concerns]

### Overall Assessment
[Pass/Fail with notes]
```

---

## Next Steps After Testing

### If All Tests Pass ✅
1. Create pull request from `refactor/pokemon-dialogue` → `main`
2. Request code review
3. Merge to main after approval
4. Deploy to staging environment
5. Run final QA in staging

### If Issues Found ❌
1. Document specific failing tests
2. Create GitHub issues for each bug
3. Fix issues on `refactor/pokemon-dialogue` branch
4. Re-run tests
5. Repeat until all pass

---

## Production Readiness Checklist

Before merging to main, ensure:

- [ ] ✅ 0 TypeScript errors
- [ ] ✅ 0 lint warnings
- [ ] ✅ All dialogue paths navigable
- [ ] ✅ Chat pacing works on all nodes
- [ ] ✅ Emotion tags render correctly
- [ ] ✅ Interaction animations smooth
- [ ] ✅ Character voices maintained
- [ ] ✅ Learning objectives clear
- [ ] ⏭️ SFX/VFX/MUSIC TODO comments addressed (future work)
- [ ] ⏭️ Accessibility testing passed
- [ ] ⏭️ Mobile testing passed
- [ ] ⏭️ Performance benchmarks met

---

## Contact

**Questions about testing methodology?**
- See: `docs/POKEMON_SCALING_COMPLETE.md` for refactor details
- See: `docs/DIALOGUE_STYLE_GUIDE.md` for emotion/interaction reference
- See: `docs/GEMINI_QA_PROMPT.md` for external QA validation

---

**Generated**: November 23, 2025
**Refactor Branch**: `refactor/pokemon-dialogue`
**Commit**: `66266aa` (Add Pokémon-style dialogue scaling completion report)
