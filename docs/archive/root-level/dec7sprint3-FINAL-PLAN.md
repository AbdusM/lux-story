# dec7sprint3: Final Implementation Plan

**Date**: December 7, 2025
**Status**: COMPREHENSIVE AUDIT COMPLETE
**Scope**: 397 nodes, 848 choices, 14,360 lines across 10 character graphs

---

## EXECUTIVE SUMMARY

### Critical Gaps Identified

| Category | Score | Issue |
|----------|-------|-------|
| **Voice Consistency** | 25% | Only 2/8 characters have signature tics |
| **Consequence Echoes** | 0% | Zero narrative feedback for trust changes |
| **Pattern Reflection** | 0% | NPCs never acknowledge player patterns |
| **Hub UX** | FAIL | 8 choices = quiz mode, not conversation |
| **Content Warnings** | 2/10 | Zero warnings for trauma content |
| **Choice Architecture** | FAIL | Violates 3-choice best practice |
| **Screen Reader** | 5/10 | No aria-live regions for chat pacing |

### What Works Well

| Category | Score | Status |
|----------|-------|--------|
| Keyboard Navigation | 9/10 | Vim-style + arrow keys + number keys |
| Motion Accessibility | 8/10 | Respects prefers-reduced-motion |
| Typography | 8/10 | 16px min, 65ch width, loose leading |
| Pattern Coverage | 100% | All choices have pattern assignments |
| Immersive Simulations | GOOD | Marcus ECMO, Devon debugging, Kai drill |

---

## PHASE 1: CRITICAL FIXES (Immediate)

### 1.1 Hub Redesign (8 choices → 3 conversational steps)

**Current Problem** (`samuel-dialogue-graph.ts`):
```
8 motivation choices shown at once:
- Creative outlet → Devon
- Helping others → Marcus
- Nature/outdoors → Silas
- Strategic challenges → Tess
- etc.
```

**Best Practice Violation**:
- Maximum 3 choices (BEST_CHOICE_DESIGN_SYSTEM.md)
- Empathy in position 2 (default draw)
- Age-appropriate cognitive load (10-15 seconds to parse)

**Fix**:
```typescript
// Step 1: Broad category (3 choices)
choices: [
  { text: "I'm looking for clarity", pattern: 'analytical' },
  { text: "I want to help someone", pattern: 'helping' },  // Position 2 = empathy
  { text: "I'm just exploring", pattern: 'exploring' }
]

// Step 2: Samuel responds conversationally
"There's someone you should meet. They're dealing with something similar."

// Step 3: Introduce 2-3 specific travelers based on category
```

**Files to Modify**:
- `content/samuel-dialogue-graph.ts` (hub nodes)
- `components/GameChoices.tsx` (reduce max visible)

---

### 1.2 Add 4 Missing Character Signature Tics

| Character | Expected Tic | File | Action |
|-----------|-------------|------|--------|
| Devon | "Technically speaking..." | `devon-dialogue-graph.ts` | Add to 3-5 key nodes |
| Kai | "Between us..." | `kai-dialogue-graph.ts` | Add to intro + trust gates |
| Tess | "Here's the play..." | `tess-dialogue-graph.ts` | Add to strategy nodes |
| Yaquin | "Imagine..." | `yaquin-dialogue-graph.ts` | Add to dream sequences |

**Implementation Pattern**:
```typescript
// Before
text: "I've thought about this a lot."

// After
text: "Technically speaking... I've thought about this a lot."
```

---

### 1.3 Fix Trust Condition Conflict (Maya)

**Bug Location**: `maya-dialogue-graph.ts:77-101`

```typescript
// Line 77-79: Node appears if trust <= 2
requiredState: { trust: { max: 2 } }

// Line 99-101: Choice appears if trust >= 2
visibleCondition: { trust: { min: 2 } }
```

**Conflict**: Choice only visible at exactly trust=2. Fix by aligning conditions.

---

### 1.4 Content Warning System

**Current**: Zero warnings for death, financial crisis, family rejection, medical emergencies.

**Implementation**:
```typescript
// lib/content-warnings.ts (NEW)
export const contentWarnings = {
  marcus_simulation: ['medical_emergency', 'patient_death'],
  silas_crisis: ['financial_distress', 'housing_instability'],
  devon_grief: ['family_rejection', 'grief'],
  maya_family: ['family_conflict', 'cultural_expectations']
}

// Show modal before entering arc
<ContentWarning topics={['medical_emergency']}>
  This story contains discussion of medical emergencies.
</ContentWarning>
```

---

## PHASE 2: IMMERSION ENHANCEMENT

### 2.1 Enable Consequence Echoes

**Current**: Trust changes are silent. Player doesn't know their choice mattered.

**Implementation** (already in `lib/consequence-echoes.ts`):
```typescript
// After trust +1
"Something shifts in Samuel's posture."

// After trust -1
"Devon's eyes flicker away for a moment."
```

**Files to Modify**:
- `components/StatefulGameInterface.tsx` - Enable echo rendering
- `content/*-dialogue-graph.ts` - Add echo text to StateChange objects

---

### 2.2 Populate Pattern Reflection

**Current**: `patternReflection` field exists in DialogueContent but is never used.

**Target**: NPCs acknowledge player's emerging identity.

```typescript
// When player.patterns.analytical >= 5
patternReflection: [{
  pattern: 'analytical',
  minLevel: 5,
  altText: "You think things through, don't you? I can see it in how you frame questions.",
  altEmotion: 'knowing'
}]
```

**Priority Nodes** (add reflection to these first):
- `samuel_hub_return` - Samuel sees patterns
- `maya_crossroads` - Maya acknowledges approach
- `marcus_reciprocity` - Marcus reflects player style
- `devon_breakthrough` - Devon notices analytical match

---

### 2.3 Standardize Emotion Tags

**Issue**: 9 instances of non-standard `'curious_reciprocal'` emotion.

**Files Affected**:
- `marcus-dialogue-graph.ts:1218`
- `rohan-dialogue-graph.ts:845`
- `maya-dialogue-graph.ts:855`
- `kai-dialogue-graph.ts:942, 974`
- `tess-dialogue-graph.ts:473, 1040, 1103`
- `yaquin-dialogue-graph.ts` (1 instance)

**Fix**: Replace with pattern-consistent emotions like `'curious_engaged'` or `'warm_curious'`.

---

## PHASE 3: ACCESSIBILITY COMPLIANCE

### 3.1 Screen Reader Live Regions

**Current Gap**: ChatPacedDialogue has no `aria-live` region.

**Fix** (`components/ChatPacedDialogue.tsx`):
```tsx
<div
  role="status"
  aria-live="polite"
  aria-atomic="false"
>
  {visibleChunks.map(chunk => ...)}
</div>
```

---

### 3.2 Heading Hierarchy Fix

**Current**: All choice group titles use `<h4>` regardless of context.

**Fix** (`components/GameChoices.tsx:290`):
```tsx
// Use context-aware heading level
<h3 className="text-xs font-bold text-slate-400">
  {title}
</h3>
```

---

### 3.3 Technical Jargon Glossary

**Terms needing inline explanation**:
- hemolysis → (breakdown of red blood cells)
- heparin → (blood thinner)
- hygrometer → (moisture sensor)
- CVICU → Cardiovascular ICU

**Implementation**: Add tooltip or parenthetical in dialogue text.

---

### 3.4 Visual Effect Accessibility

**Current**: `<shake>`, `<jitter>`, `<bloom>` tags have no accessible fallback.

**Fix** (`components/RichTextRenderer.tsx`):
```tsx
<span
  aria-label="Text shakes for emphasis"
  className="shake-animation"
>
  {content}
</span>
```

---

## PHASE 4: CHOICE ARCHITECTURE REFORM

### 4.1 Three-Choice Standard

**Best Practice** (BEST_CHOICE_DESIGN_SYSTEM.md):
```
Position 1: Analytical/Safe (0 trust)
Position 2: Empathetic (default draw, +1 trust)
Position 3: Patient/Alternative (+2 trust, [brackets])
```

**Current Violations**:
- Samuel hub: 8 choices
- Marcus crossroads: 6 choices
- Devon simulation: 3 technical choices (all same type)

---

### 4.2 Progressive Reward System

**Pattern**:
```typescript
choices: [
  { text: "Interesting.", consequence: { trustChange: 0 }, pattern: 'analytical' },
  { text: "That sounds hard.", consequence: { trustChange: 1 }, pattern: 'helping' },
  { text: "[Wait quietly]", consequence: { trustChange: 2 }, pattern: 'patience' }
]
```

---

### 4.3 Add "Mid-Conversation Break" Option

**Current Gap**: No escape from intense content.

**Fix**: Add to long arcs:
```typescript
{
  choiceId: 'need_break',
  text: "I need to think about this. Can we pause?",
  nextNodeId: 'breathing_room',
  pattern: 'patience'
}
```

---

## PHASE 5: CODE QUALITY

### 5.1 Verify External References

**Risk**: `samuelEntryPoints.MAYA_REFLECTION_GATEWAY` and similar may not exist.

**Action**: Grep all `samuelEntryPoints.*` references and verify targets exist.

---

### 5.2 Add Missing learningObjectives

**Current**: Only 10 nodes have learningObjectives out of 397.

**Priority**: Add to key decision nodes in each character arc.

---

### 5.3 Document TODO Comments

**Finding**: 30+ TODO comments for SFX in `marcus-dialogue-graph.ts`.

**Action**: Create `docs/AUDIO_DESIGN_SPEC.md` to track these as Phase 2 enhancement.

---

## IMPLEMENTATION PRIORITY MATRIX

| Priority | Task | Effort | Impact |
|----------|------|--------|--------|
| P0 | Hub redesign (8→3 choices) | Medium | HIGH - Fixes quiz feel |
| P0 | Fix Maya trust conflict | Low | HIGH - Prevents broken path |
| P0 | Content warning system | Medium | HIGH - Trauma-informed |
| P1 | Add 4 signature tics | Low | MEDIUM - Voice consistency |
| P1 | Enable consequence echoes | Low | HIGH - Player feedback |
| P1 | Screen reader live regions | Low | HIGH - Accessibility |
| P2 | Pattern reflection content | Medium | MEDIUM - Immersion |
| P2 | Standardize emotion tags | Low | LOW - Code quality |
| P2 | Choice architecture reform | High | HIGH - UX improvement |
| P3 | learningObjectives coverage | Medium | LOW - Analytics prep |
| P3 | Technical jargon glossary | Low | MEDIUM - Accessibility |

---

## SUCCESS METRICS

### Qualitative
- Players can identify characters by voice alone
- Players feel their choices matter (narrative feedback)
- No players confused by 8-choice hub
- Trauma-informed players feel safe

### Quantitative
- Voice consistency: 8/8 characters (currently 2/8)
- Consequence echoes: 100% of trust changes
- Pattern reflection: 20+ key nodes populated
- Choice compliance: 95% nodes ≤3 choices
- Content warnings: 100% trauma content flagged

---

## RELATED DOCUMENTS

- `docs/dec7sprint3-narrative-audit.md` - Full audit findings
- `docs/DIALOGUE_CHARACTER_BEST_PRACTICES.md` - Voice guidelines
- `docs/IMMERSION_ENHANCEMENT_PLAN.md` - Pattern reflection specs
- `backup/comprehensive-cleanup-20251019-212241/BEST_CHOICE_DESIGN_SYSTEM.md` - Choice architecture
- `lib/consequence-echoes.ts` - Echo implementation (ready to enable)

---

## NEXT ACTIONS

### Immediate (Today)
1. [ ] Fix Maya trust conflict (`maya-dialogue-graph.ts:77-101`)
2. [ ] Add content warning modal component
3. [ ] Enable aria-live on ChatPacedDialogue

### This Week
4. [ ] Redesign Samuel hub (8→3 conversational steps)
5. [ ] Add 4 missing signature tics
6. [ ] Enable consequence echo system

### Next Week
7. [ ] Populate patternReflection on 20 key nodes
8. [ ] Reform choice architecture (crossroads nodes)
9. [ ] Add mid-conversation break options

---

*Generated from comprehensive audit of 397 dialogue nodes, 848 choices, 14,360 lines of content across 10 character graphs.*
