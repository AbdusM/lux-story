# Reciprocity Agency Fix Plan
**Critical Issue**: New mutual recognition nodes lack user choice/agency

## Problem Statement 🚨

### Current State (BROKEN)
Each mutual recognition node has **ONLY ONE CHOICE** - essentially an automatic "(Continue)" button:

```typescript
choices: [
  {
    text: "I'm glad we found each other tonight.",
    nextNodeId: 'maya_farewell_robotics'
  }
]
```

**This removes all user agency at the MOST EMOTIONALLY IMPORTANT moment.**

### Impact
- User feels like a passive observer during mutual recognition
- No way to express their authentic response to the connection
- Violates core principle: "User at the center of control"
- Makes the reciprocity moment feel scripted, not earned

---

## Solution Architecture 🎯

### **The Three-Choice Pattern for Recognition Moments**

Every mutual recognition node should offer **3 distinct response types**:

1. **Empathetic/Warm Response** (Pattern: `helping`)
   - Expresses emotional connection directly
   - Validates the mutual understanding
   - Skills: `emotional_intelligence`, `communication`

2. **Reflective/Analytical Response** (Pattern: `analytical`)
   - Acknowledges the insight gained
   - Processes the connection intellectually
   - Skills: `critical_thinking`, `communication`

3. **Quiet/Patient Response** (Pattern: `patience`)
   - Non-verbal or minimal verbal acknowledgment
   - Lets the moment speak for itself
   - Skills: `emotional_intelligence`, `adaptability`

**All three choices lead to the same next node** (the farewell), but reflect HOW the user engages with recognition.

---

## Implementation Plan 📋

### **Scope**
- **Maya**: 4 mutual recognition nodes → 12 new choices (3 each)
- **Devon**: 4 shared insight nodes → 12 new choices (3 each)
- **Total**: 8 nodes, 24 new choices

### **Quality Standards**
Each choice must:
1. ✅ Be authentically different (not just rephrased)
2. ✅ Reflect a distinct emotional register
3. ✅ Feel natural to say/think
4. ✅ Tag appropriate WEF 2030 skills
5. ✅ Include trust consequences when appropriate
6. ✅ Use proper pattern classification

---

## Detailed Implementation 🔧

### **MAYA - Mutual Recognition Nodes (4 nodes)**

#### **1. maya_mutual_recognition_stable**
**Context**: "We balance each other out - you had solid ground, I had unstable ground"

**Current (1 choice)**:
- "I'm glad we found each other tonight."

**Fixed (3 choices)**:
```typescript
choices: [
  {
    choiceId: 'stable_warm',
    text: "I'm glad we found each other tonight.",
    nextNodeId: 'maya_farewell_robotics',
    pattern: 'helping',
    skills: ['emotional_intelligence', 'communication'],
    consequence: {
      characterId: 'maya',
      trustChange: 1,
      addKnowledgeFlags: ['mutual_recognition_achieved']
    }
  },
  {
    choiceId: 'stable_reflective',
    text: "Different foundations, same understanding.",
    nextNodeId: 'maya_farewell_robotics',
    pattern: 'analytical',
    skills: ['critical_thinking', 'communication'],
    consequence: {
      characterId: 'maya',
      trustChange: 1,
      addKnowledgeFlags: ['mutual_recognition_achieved']
    }
  },
  {
    choiceId: 'stable_quiet',
    text: "[Nod with quiet recognition]",
    nextNodeId: 'maya_farewell_robotics',
    pattern: 'patience',
    skills: ['emotional_intelligence'],
    consequence: {
      characterId: 'maya',
      addKnowledgeFlags: ['mutual_recognition_achieved']
    }
  }
]
```

---

#### **2. maya_mutual_recognition_entrepreneur**
**Context**: "Risk as inheritance - your parents gave permission to leap, mine gave weight"

**Current (1 choice)**:
- "That's exactly it. Your version."

**Fixed (3 choices)**:
```typescript
choices: [
  {
    choiceId: 'entrepreneur_affirm',
    text: "That's exactly it. Your version.",
    nextNodeId: 'maya_farewell_robotics',
    pattern: 'helping',
    skills: ['emotional_intelligence', 'communication'],
    consequence: {
      characterId: 'maya',
      trustChange: 1,
      addKnowledgeFlags: ['mutual_recognition_achieved']
    }
  },
  {
    choiceId: 'entrepreneur_connect',
    text: "Both of us carrying what we were given forward.",
    nextNodeId: 'maya_farewell_robotics',
    pattern: 'analytical',
    skills: ['critical_thinking', 'communication'],
    consequence: {
      characterId: 'maya',
      trustChange: 1,
      addKnowledgeFlags: ['mutual_recognition_achieved']
    }
  },
  {
    choiceId: 'entrepreneur_honor',
    text: "Your parents would be proud of that realization.",
    nextNodeId: 'maya_farewell_robotics',
    pattern: 'helping',
    skills: ['emotional_intelligence', 'communication'],
    consequence: {
      characterId: 'maya',
      trustChange: 1,
      addKnowledgeFlags: ['mutual_recognition_achieved', 'honored_parental_legacy']
    }
  }
]
```

---

#### **3. maya_mutual_recognition_struggling**
**Context**: "Being seen without having to explain - deepest vulnerability shared"

**Current (1 choice)**:
- "[Nod quietly in understanding]"

**Fixed (3 choices)**:
```typescript
choices: [
  {
    choiceId: 'struggling_silent',
    text: "[Nod quietly in understanding]",
    nextNodeId: 'maya_farewell_robotics',
    pattern: 'patience',
    skills: ['emotional_intelligence'],
    consequence: {
      characterId: 'maya',
      trustChange: 1,
      addKnowledgeFlags: ['mutual_recognition_achieved', 'deepest_bond_formed']
    }
  },
  {
    choiceId: 'struggling_seen',
    text: "Thank you for seeing me too.",
    nextNodeId: 'maya_farewell_robotics',
    pattern: 'helping',
    skills: ['emotional_intelligence', 'communication'],
    consequence: {
      characterId: 'maya',
      trustChange: 2,
      addKnowledgeFlags: ['mutual_recognition_achieved', 'deepest_bond_formed']
    }
  },
  {
    choiceId: 'struggling_gift',
    text: "That's what tonight was about. Mutual recognition.",
    nextNodeId: 'maya_farewell_robotics',
    pattern: 'analytical',
    skills: ['emotional_intelligence', 'critical_thinking'],
    consequence: {
      characterId: 'maya',
      trustChange: 1,
      addKnowledgeFlags: ['mutual_recognition_achieved', 'deepest_bond_formed']
    }
  }
]
```

---

#### **4. maya_mutual_recognition_absent**
**Context**: "Choosing presence over achievement - shared lesson about absence"

**Current (1 choice)**:
- "That's exactly what tonight was about."

**Fixed (3 choices)**:
```typescript
choices: [
  {
    choiceId: 'absent_affirm',
    text: "That's exactly what tonight was about.",
    nextNodeId: 'maya_farewell_robotics',
    pattern: 'helping',
    skills: ['emotional_intelligence', 'communication'],
    consequence: {
      characterId: 'maya',
      trustChange: 1,
      addKnowledgeFlags: ['mutual_recognition_achieved']
    }
  },
  {
    choiceId: 'absent_presence',
    text: "Being here, fully present, with each other.",
    nextNodeId: 'maya_farewell_robotics',
    pattern: 'patience',
    skills: ['emotional_intelligence', 'adaptability'],
    consequence: {
      characterId: 'maya',
      trustChange: 1,
      addKnowledgeFlags: ['mutual_recognition_achieved']
    }
  },
  {
    choiceId: 'absent_break_cycle',
    text: "We both just broke the cycle. That matters.",
    nextNodeId: 'maya_farewell_robotics',
    pattern: 'analytical',
    skills: ['critical_thinking', 'emotional_intelligence'],
    consequence: {
      characterId: 'maya',
      trustChange: 1,
      addKnowledgeFlags: ['mutual_recognition_achieved', 'cycle_broken']
    }
  }
]
```

---

### **DEVON - Shared Insight Nodes (4 nodes)**

#### **1. devon_shared_insight_logic**
**Context**: "Talking to you without any system felt more real than optimized paths"

**Current (1 choice)**:
- "That's the bravest thing you could do."

**Fixed (3 choices)**:
```typescript
choices: [
  {
    choiceId: 'logic_brave',
    text: "That's the bravest thing you could do.",
    nextNodeId: 'devon_farewell_integration',
    pattern: 'helping',
    skills: ['emotional_intelligence', 'communication'],
    consequence: {
      characterId: 'devon',
      trustChange: 1,
      addKnowledgeFlags: ['mutual_recognition_achieved']
    }
  },
  {
    choiceId: 'logic_real',
    text: "Real connection doesn't optimize well.",
    nextNodeId: 'devon_farewell_integration',
    pattern: 'analytical',
    skills: ['critical_thinking', 'communication'],
    consequence: {
      characterId: 'devon',
      trustChange: 1,
      addKnowledgeFlags: ['mutual_recognition_achieved']
    }
  },
  {
    choiceId: 'logic_honor',
    text: "Your dad will feel the difference.",
    nextNodeId: 'devon_farewell_integration',
    pattern: 'helping',
    skills: ['emotional_intelligence', 'communication'],
    consequence: {
      characterId: 'devon',
      trustChange: 1,
      addKnowledgeFlags: ['mutual_recognition_achieved']
    }
  }
]
```

---

#### **2. devon_shared_insight_emotion**
**Context**: "We approach things differently but understood each other"

**Current (1 choice)**:
- "Different approaches, same humanity."

**Fixed (3 choices)**:
```typescript
choices: [
  {
    choiceId: 'emotion_humanity',
    text: "Different approaches, same humanity.",
    nextNodeId: 'devon_farewell_integration',
    pattern: 'analytical',
    skills: ['emotional_intelligence', 'communication'],
    consequence: {
      characterId: 'devon',
      trustChange: 1,
      addKnowledgeFlags: ['mutual_recognition_achieved']
    }
  },
  {
    choiceId: 'emotion_complement',
    text: "Maybe that's why it worked. We complement each other.",
    nextNodeId: 'devon_farewell_integration',
    pattern: 'helping',
    skills: ['emotional_intelligence', 'communication'],
    consequence: {
      characterId: 'devon',
      trustChange: 1,
      addKnowledgeFlags: ['mutual_recognition_achieved']
    }
  },
  {
    choiceId: 'emotion_authentic',
    text: "Both showing up authentically. That's all it takes.",
    nextNodeId: 'devon_farewell_integration',
    pattern: 'patience',
    skills: ['emotional_intelligence'],
    consequence: {
      characterId: 'devon',
      addKnowledgeFlags: ['mutual_recognition_achieved']
    }
  }
]
```

---

#### **3. devon_shared_insight_both**
**Context**: "Commitment to both sides over perfect integration"

**Current (1 choice)**:
- "Commitment over perfection."

**Fixed (3 choices)**:
```typescript
choices: [
  {
    choiceId: 'both_commitment',
    text: "Commitment over perfection.",
    nextNodeId: 'devon_farewell_integration',
    pattern: 'helping',
    skills: ['emotional_intelligence', 'critical_thinking'],
    consequence: {
      characterId: 'devon',
      trustChange: 1,
      addKnowledgeFlags: ['mutual_recognition_achieved']
    }
  },
  {
    choiceId: 'both_messy',
    text: "Messy and real beats optimized and empty.",
    nextNodeId: 'devon_farewell_integration',
    pattern: 'analytical',
    skills: ['critical_thinking', 'communication'],
    consequence: {
      characterId: 'devon',
      trustChange: 1,
      addKnowledgeFlags: ['mutual_recognition_achieved']
    }
  },
  {
    choiceId: 'both_both',
    text: "Engineer AND son. Both at once.",
    nextNodeId: 'devon_farewell_integration',
    pattern: 'helping',
    skills: ['emotional_intelligence', 'communication'],
    consequence: {
      characterId: 'devon',
      trustChange: 1,
      addKnowledgeFlags: ['mutual_recognition_achieved', 'integration_understood']
    }
  }
]
```

---

#### **4. devon_shared_insight_learning**
**Context**: "Shared uncertainty is its own kind of connection"

**Current (1 choice)**:
- "Shared uncertainty is its own kind of connection."

**Fixed (3 choices)**:
```typescript
choices: [
  {
    choiceId: 'learning_connection',
    text: "Shared uncertainty is its own kind of connection.",
    nextNodeId: 'devon_farewell_integration',
    pattern: 'helping',
    skills: ['emotional_intelligence', 'communication'],
    consequence: {
      characterId: 'devon',
      trustChange: 1,
      addKnowledgeFlags: ['mutual_recognition_achieved']
    }
  },
  {
    choiceId: 'learning_debug',
    text: "We're all debugging ourselves as we go.",
    nextNodeId: 'devon_farewell_integration',
    pattern: 'analytical',
    skills: ['critical_thinking', 'adaptability'],
    consequence: {
      characterId: 'devon',
      trustChange: 1,
      addKnowledgeFlags: ['mutual_recognition_achieved']
    }
  },
  {
    choiceId: 'learning_honest',
    text: "Being honest about not knowing—that's the real variable.",
    nextNodeId: 'devon_farewell_integration',
    pattern: 'helping',
    skills: ['emotional_intelligence', 'communication'],
    consequence: {
      characterId: 'devon',
      trustChange: 1,
      addKnowledgeFlags: ['mutual_recognition_achieved']
    }
  }
]
```

---

## Validation Checklist ✅

For each of the 8 nodes, verify:

- [ ] Has exactly 3 meaningful choices
- [ ] Choices represent distinct emotional registers
- [ ] All choices tagged with appropriate skills
- [ ] Trust consequences appropriate to choice depth
- [ ] Pattern tags correct (`helping`, `analytical`, `patience`)
- [ ] Choice text sounds natural and authentic
- [ ] Each choice feels like something a real person would say
- [ ] No two choices are just rephrased versions of each other

---

## Testing Strategy 🧪

After implementation:

1. **Flow Test**: Play through all 8 reciprocity paths
2. **Agency Test**: Does each choice feel meaningfully different?
3. **Consequence Test**: Do trust changes reflect choice depth?
4. **Voice Test**: Does each choice sound natural?
5. **Pattern Test**: Are patterns correctly classified?

---

## Timeline ⏱️

**Estimated Time**: 1.5-2 hours
- Writing 24 authentic choices: 60-75 minutes
- Testing and refinement: 30-45 minutes

---

## Success Criteria 🎯

**Before**: 
- Single "(Continue)" button at recognition moment
- No user agency at emotional peak
- Feels scripted and automatic

**After**:
- 3 meaningful response options
- User can express authentic reaction
- Agency restored at critical moment
- Choices reflect WEF 2030 skills
- Trust consequences appropriate

---

## Next Steps 🚀

1. Get approval for plan
2. Implement 24 new choices across 8 nodes
3. Test all paths
4. Verify build
5. Commit and deploy

**Ready to execute?**

