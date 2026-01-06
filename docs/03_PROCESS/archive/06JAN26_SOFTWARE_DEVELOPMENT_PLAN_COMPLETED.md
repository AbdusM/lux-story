# Software Development Plan - January 6, 2026

**Sprint Goal:** Connect built infrastructure with content to maximize player experience
**Philosophy:** High impact, low effort first. Content > Code changes.

---

## Executive Summary

The codebase has **sophisticated infrastructure that is underutilized**. The gap is CONTENT and WIRING, not CODE.

| Priority | Category | Effort | Impact | Items |
|----------|----------|--------|--------|-------|
| **P0** | Voice Variations | Low | Very High | 12 characters |
| **P0** | Pattern Reflections | Low | High | 6 characters need expansion |
| **P1** | Skill System Cleanup | Low | Medium | 13 undefined, 7 unused |
| **P1** | requiredOrbFill | Low | High | Only 4 uses currently |
| **P2** | Discovery Hints | Medium | High | 14 characters need hints |
| **P2** | Resonance Display | Medium | Medium | UI component needed |
| **P3** | Shallow Character Expansion | High | Medium | Grace, Jordan, Rohan |

---

## P0: CRITICAL PATH (This Sprint)

### P0.1: Voice Variations (12 Characters)

**Status:** Built but unused for 12/16 characters
**Impact:** Makes player feel their identity is recognized
**Effort:** Content authoring only

Characters needing voice variations:
| Character | Current | Target | Priority |
|-----------|---------|--------|----------|
| Marcus | 0 | 8 | Core character |
| Tess | 0 | 6 | Secondary |
| Yaquin | 0 | 6 | Secondary |
| Grace | 0 | 6 | Secondary |
| Elena | 0 | 6 | Secondary |
| Alex | 0 | 6 | Secondary |
| Silas | 0 | 6 | Extended |
| Asha | 0 | 6 | Extended |
| Lira | 0 | 6 | Extended |
| Zara | 0 | 6 | Extended |
| Kai | 0 | 6 | Core |
| Rohan | 0 | 6 | Core |

**Implementation Pattern:**
```typescript
// In choices array, add voiceVariations to key moments
{
  choiceId: 'ask_about_work',
  text: 'Tell me about your work.',
  voiceVariations: {
    analytical: 'Walk me through the technical details.',
    helping: 'What drew you to helping people this way?',
    building: 'Show me what you\'ve built.',
    exploring: 'What\'s the most unexpected thing you\'ve discovered?',
    patience: 'Take your time. I\'m curious about your journey.'
  },
  nextNodeId: 'work_explanation',
  pattern: 'exploring'
}
```

---

### P0.2: Pattern Reflection Expansion (6 Characters)

**Status:** 91 total, but 6 characters critically low
**Impact:** NPCs feel like they "see" the player
**Effort:** Content authoring only

| Character | Current | Target | Gap |
|-----------|---------|--------|-----|
| Alex | 1 | 6 | +5 |
| Grace | 3 | 6 | +3 |
| Silas | 3 | 6 | +3 |
| Yaquin | 4 | 6 | +2 |
| Zara | 5 | 7 | +2 |
| Marcus | 5 | 7 | +2 |

**Implementation Pattern:**
```typescript
// In content array, add patternReflection
{
  text: 'I see something in you...',
  emotion: 'knowing',
  patternReflection: {
    analytical: 'You untangle things. See the threads others miss.',
    helping: 'You lean toward people when they hurt. That\'s rare.',
    building: 'Your hands know what your mind hasn\'t caught up to yet.',
    exploring: 'You ask the questions most people are afraid to.',
    patience: 'You wait. You watch. You understand the value of stillness.'
  }
}
```

---

## P1: HIGH PRIORITY (This Sprint)

### P1.1: Skill System Cleanup

**Status:** 13 undefined skills in use, 7 defined but unused
**Impact:** Data integrity and WEF 2030 alignment
**Effort:** Code changes to lib/skill-definitions.ts

**A) Add missing skill definitions:**
```typescript
// Add to lib/skill-definitions.ts
visionaryThinking: {
  id: 'visionaryThinking',
  title: 'Visionary Thinking',
  superpowerName: 'Future Sight',
  definition: 'Imagining what doesn\'t exist yet.',
  manifesto: 'You see the horizon before others know there\'s a view.'
},
sustainability: { ... },
entrepreneurship: { ... },
instructionalDesign: { ... },
promptEngineering: { ... },
psychology: { ... },
pedagogy: { ... },
humor: { ... }
```

**B) Rename/consolidate:**
- `strategy` → `strategicThinking`
- `groundedness` → `groundedResearch`
- `grounding` → remove or use `groundedResearch`
- `branding` → `marketing`
- `coding` → `technicalLiteracy`

**C) Integrate unused WEF 2030 skills in content:**
| Skill | Character | Node |
|-------|-----------|------|
| agenticCoding | Maya, Rohan | intro, simulation |
| aiLiteracy | Maya, Zara | technology discussions |
| dataDemocratization | Zara, Elena | ethics discussions |
| groundedResearch | Elena, Rohan | research dialogues |
| multimodalCreation | Lira | sound/media discussions |
| riskManagement | Kai, Grace | safety/healthcare |
| workflowOrchestration | Alex, Devon | operations discussions |

---

### P1.2: requiredOrbFill Expansion

**Status:** Only 4 uses currently
**Impact:** Creates aspirational "locked" choices that reward pattern investment
**Effort:** Content identification + attribute addition

**Target:** Add 20 more requiredOrbFill choices (2-3 per character)

**Implementation Pattern:**
```typescript
{
  choiceId: 'deep_builder_insight',
  text: '[Architect\'s Vision] I could help you redesign the entire system.',
  requiredOrbFill: {
    pattern: 'building',
    threshold: 50  // 50% orb fill required
  },
  nextNodeId: 'system_redesign',
  pattern: 'building',
  skills: ['creativity', 'systemsThinking']
}
```

**Best placement:** Key narrative moments, loyalty experience entries, vulnerability arcs

---

## P2: MEDIUM PRIORITY (Next Sprint)

### P2.1: Discovery Hints (14 Characters)

**Status:** Only Maya (3) and Devon (1) have hints
**Impact:** Foreshadows vulnerability reveals, increases engagement
**Effort:** Content authoring + game loop verification

**Structure:**
```typescript
// Add to lib/consequence-echoes.ts DISCOVERY_HINTS
characterId: {
  vulnerabilityKey: {
    hint: 'Text shown to player',
    trustRange: { min: 3, max: 5 },  // When hint appears
    frequency: 0.3  // 30% chance per interaction
  }
}
```

---

### P2.2: Resonance Display UI

**Status:** Calculated but not shown to player
**Impact:** Player understands why trust changes differently
**Effort:** UI component + game loop integration

**Proposed implementation:**
- Add subtle toast/notification: "Maya sees a kindred maker spirit in you"
- Show only on notable resonance (primary pattern matches)
- Respect reduced-motion preferences

---

## P3: FUTURE PRIORITY

### P3.1: Shallow Character Expansion
- Grace: 35 → 50 nodes
- Jordan: 36 → 50 nodes
- Rohan: 38 → 50 nodes

### P3.2: Pattern Unlock Node Completion
- Verify all 35 defined unlock targets exist
- Wire remaining pattern unlock checks

---

## Execution Order

### Sprint 1 (Today - P0)
1. ✅ Voice Variations for Marcus
2. ✅ Voice Variations for Tess
3. ✅ Voice Variations for Yaquin
4. ✅ Pattern Reflections for Alex (+5)
5. ✅ Pattern Reflections for Grace (+3)
6. ✅ Pattern Reflections for Silas (+3)

### Sprint 2 (P0 continued)
7. Voice Variations for remaining 9 characters
8. Pattern Reflections for remaining 3 characters

### Sprint 3 (P1)
9. Skill definitions cleanup
10. requiredOrbFill expansion

### Sprint 4 (P2)
11. Discovery Hints for 14 characters
12. Resonance Display UI

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Voice Variations | 75 (4 chars) | 200+ (16 chars) |
| Pattern Reflections | 91 | 150+ |
| requiredOrbFill | 4 | 24+ |
| Undefined Skills | 13 | 0 |
| Unused WEF Skills | 7 | 0 |

---

## Technical Notes

### Voice Variations Type
```typescript
interface DialogueChoice {
  voiceVariations?: Partial<Record<PatternType, string>>
}
```

### Pattern Reflection Type
```typescript
interface DialogueContent {
  patternReflection?: Partial<Record<PatternType, string>>
}
```

### requiredOrbFill Type
```typescript
interface DialogueChoice {
  requiredOrbFill?: {
    pattern: PatternType
    threshold: number  // 0-100
  }
}
```

---

**Created:** January 6, 2026
**Author:** Claude Code
**Status:** Active - Executing Sprint 1
