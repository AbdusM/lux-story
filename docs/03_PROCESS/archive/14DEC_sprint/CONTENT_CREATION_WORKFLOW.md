# Content Creation Workflow - How to Add Scenes

**Date:** December 14, 2024
**Question:** After removing scene-skill-mappings.ts, can we still add new scenes?

---

## TL;DR

✅ **YES - Content creation workflow is UNCHANGED and SIMPLER**

- We deleted the **duplicate mapping layer** (scene-skill-mappings.ts)
- The **source of truth** (content/*-dialogue-graph.ts) remains fully intact
- Adding new scenes is now **easier** (one file instead of two)

---

## What We Deleted vs What We Kept

### ❌ DELETED: scene-skill-mappings.ts (Duplicate Layer)
```typescript
// This was a SEPARATE file duplicating data from dialogue graphs
export const SCENE_SKILL_MAPPINGS = {
  'maya_introduction': {
    sceneId: 'maya_introduction',
    characterArc: 'maya',
    sceneDescription: 'First encounter with Maya',
    choiceMappings: {
      'intro_studies': {
        skillsDemonstrated: ['criticalThinking', 'communication'],
        context: 'Manual description here...'
      }
    }
  }
}
```
**Problem:** Had to maintain TWO places for same data (dialogue graph + mappings)

### ✅ KEPT: content/maya-dialogue-graph.ts (Source of Truth)
```typescript
// This is where scenes actually live - UNCHANGED
export const mayaDialogueNodes: DialogueNode[] = [
  {
    nodeId: 'maya_introduction',
    speaker: 'Maya Chen',
    content: [{ text: "...", emotion: 'anxious_scattered' }],
    choices: [
      {
        choiceId: 'intro_studies',
        text: "Pre-med and robotics? That's an interesting combination.",
        nextNodeId: 'maya_studies_response',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'], // ← Skills defined here!
        consequence: { characterId: 'maya', trustChange: 1 }
      }
    ]
  }
]
```
**This file is untouched.** All 433 nodes still work perfectly.

---

## Current Content Inventory

### By Character (Nodes / Skill Definitions)

| Character | Nodes | Skill Definitions | Status |
|-----------|-------|------------------|---------|
| Samuel | 153 | 260 | ✅ Complete |
| Devon | 36 | 64 | ✅ Good |
| Maya | 30 | 64 | ✅ Good |
| Marcus | 30 | 62 | ✅ Good |
| Kai | 30 | 52 | ✅ Good |
| Silas | 32 | 41 | ✅ Good |
| Jordan | 25 | 53 | ✅ Good |
| Rohan | 26 | 48 | ✅ Good |
| Yaquin | 30 | 53 | ✅ Good |
| Tess | 25 | 52 | ✅ Good |
| Alex | 16 | 21 | 🟡 Smaller |

**Total:** 433 nodes, 770 skill definitions

---

## How to Add New Scenes (Step-by-Step)

### Before Cleanup (OLD - Had to update 2 files)
```bash
# Step 1: Add dialogue node to content/maya-dialogue-graph.ts
# Step 2: Add skill mapping to lib/scene-skill-mappings.ts (manual duplicate!)
# Step 3: Hope they stay in sync (they often didn't)
```

### After Cleanup (NEW - One file, automatic)
```bash
# Step 1: Add dialogue node to content/maya-dialogue-graph.ts
# Done! Context auto-generates from dialogue data
```

---

## Adding a New Scene - Example

### Scenario: Add "Maya Lab Visit" Scene

**File:** `content/maya-dialogue-graph.ts`

```typescript
export const mayaDialogueNodes: DialogueNode[] = [
  // ... existing nodes ...

  // NEW NODE - Just add it!
  {
    nodeId: 'maya_lab_visit',
    speaker: 'Maya Chen',
    content: [{
      text: "Welcome to the bioengineering lab. This is where I'm trying to merge medicine and robotics.",
      emotion: 'proud_nervous'
    }],
    choices: [
      {
        choiceId: 'lab_ask_project',
        text: "What are you working on?",
        nextNodeId: 'maya_project_explanation',
        pattern: 'analytical',
        skills: ['criticalThinking', 'communication'],
        // ↑ Skills defined here - that's it!
      },
      {
        choiceId: 'lab_encourage',
        text: "This is incredible. You're really doing it.",
        nextNodeId: 'maya_confidence_boost',
        pattern: 'helping',
        skills: ['emotionalIntelligence', 'communication'],
        consequence: {
          characterId: 'maya',
          trustChange: 2
        }
      },
      {
        choiceId: 'lab_observe',
        text: "[Look around quietly, taking it all in.]",
        nextNodeId: 'maya_shows_equipment',
        pattern: 'patience',
        skills: ['observation', 'adaptability']
      }
    ],
    // Optional: Session boundary marker
    metadata: {
      sessionBoundary: false // Set to true if this is a natural pause point
    },
    tags: ['maya_arc', 'bioengineering', 'lab_scene']
  }
]
```

**That's it!** The system automatically:
- ✅ Generates rich context from the dialogue data
- ✅ Tracks skills when choices are selected
- ✅ Stores demonstrations in database
- ✅ Shows up in admin dashboard
- ✅ Feeds into career matching
- ✅ Appears in journey narratives

### What Gets Auto-Generated

When player chooses "What are you working on?", the system creates:

```typescript
{
  scene: 'maya_lab_visit',
  sceneDescription: 'Maya lab visit',
  choice: 'What are you working on?',
  skillsDemonstrated: ['criticalThinking', 'communication'],
  context: "In conversation with Maya Chen, the player chose 'What are you working on?'
           (analytical pattern), demonstrating criticalThinking, communication.
           This aligns with their emerging analytical identity. [maya_lab_visit]",
  timestamp: Date.now()
}
```

**No manual mapping needed!** Context is generated from:
- Speaker name: "Maya Chen"
- Choice text: "What are you working on?"
- Pattern: "analytical"
- Skills: ['criticalThinking', 'communication']
- Player's dominant pattern (if >= 5)
- Node ID: maya_lab_visit

---

## Adding Session Boundaries

To mark natural pause points (every ~10 nodes):

```typescript
{
  nodeId: 'maya_crossroads_moment',
  speaker: 'Maya Chen',
  content: [{ text: "..." }],
  choices: [...],
  metadata: {
    sessionBoundary: true  // ← Marks this as a pause point
  }
}
```

When player reaches this node:
1. Counter increments: `gameState.sessionBoundariesCrossed++`
2. Atmospheric announcement displays
3. Player can naturally pause or continue

---

## Bulk Content Creation Workflow

### Adding 10 New Nodes to Maya's Arc

```bash
# 1. Open the dialogue graph file
code content/maya-dialogue-graph.ts

# 2. Add nodes in sequence
export const mayaDialogueNodes: DialogueNode[] = [
  // ... existing nodes ...

  // NEW: Medical School Decision Arc (10 nodes)
  { nodeId: 'maya_mcat_anxiety', ... },
  { nodeId: 'maya_application_stress', ... },
  { nodeId: 'maya_interview_prep', ... },
  { nodeId: 'maya_acceptance_letter', ... },
  { nodeId: 'maya_financial_reality', ... },
  { nodeId: 'maya_scholarship_hope', ... },
  { nodeId: 'maya_family_pressure', ... },
  { nodeId: 'maya_mentor_advice', ... },
  { nodeId: 'maya_decision_crossroads', metadata: { sessionBoundary: true } },
  { nodeId: 'maya_commitment_moment', ... }
]

# 3. Test in dev
npm run dev

# 4. Navigate to Maya's arc and verify flow

# 5. Commit
git add content/maya-dialogue-graph.ts
git commit -m "feat(maya): add medical school decision arc (10 nodes)"
```

**No other files to update!** Skills, patterns, and metadata are all inline.

---

## Character Arc Expansion Guide

### Recommended Node Counts per Arc Stage

| Stage | Nodes | Purpose |
|-------|-------|---------|
| Introduction | 5-8 | Establish character, create connection |
| Conflict/Challenge | 8-12 | Explore core struggle, build trust |
| Crossroads | 3-5 | Major decision point, pattern alignment |
| Resolution | 5-8 | Commitment, growth, transformation |
| **Total** | **21-33** | Complete character arc |

### Session Boundary Placement

Place `sessionBoundary: true` at:
- End of Introduction (node ~8)
- Mid-Conflict (node ~15-18)
- After Crossroads (node ~25)
- After Resolution (if arc extends beyond 30 nodes)

**Pattern:** Every ~10 nodes for mobile sessions (10-15 minutes)

---

## Content Creation Best Practices

### 1. Skills Assignment
```typescript
// Good: 2-3 skills per choice
skills: ['emotionalIntelligence', 'communication']

// Too few: Underutilizes tracking
skills: ['communication']

// Too many: Dilutes meaning
skills: ['emotionalIntelligence', 'communication', 'leadership', 'criticalThinking']
```

### 2. Pattern Variety
```typescript
// Good: Offer 3-4 patterns per node
choices: [
  { pattern: 'analytical', ... },
  { pattern: 'helping', ... },
  { pattern: 'exploring', ... },
  { pattern: 'patience', ... }  // Optional 4th
]

// Bad: All same pattern
choices: [
  { pattern: 'analytical', ... },
  { pattern: 'analytical', ... },
  { pattern: 'analytical', ... }
]
```

### 3. Choice Text Quality
```typescript
// Good: Specific, character-driven
text: "That sounds overwhelming. What would help right now?"

// Bad: Generic, could be anywhere
text: "Tell me more."
```

### 4. Consequence Layering
```typescript
// Good: Multiple effects
consequence: {
  characterId: 'maya',
  trustChange: 2,
  addKnowledgeFlags: ['knows_maya_fears'],
  addGlobalFlags: ['medical_path_unlocked']
}

// Minimal but okay
consequence: {
  characterId: 'maya',
  trustChange: 1
}
```

---

## AI-Assisted Content Generation

### Using Claude/GPT for Bulk Creation

**Prompt Template:**
```
Create 10 dialogue nodes for Maya Chen's medical school arc in Grand Central Terminus.

Context:
- Maya is torn between pre-med (family pressure) and robotics (personal passion)
- Player helps her navigate this identity conflict
- Each node should have 3-4 choices demonstrating different patterns

Format each node as TypeScript following this structure:
[Paste DialogueNode interface]

Ensure:
- Skills are realistic (2-3 per choice)
- Patterns vary (analytical, helping, building, patience, exploring)
- Consequences track trust and knowledge flags
- Place sessionBoundary: true at node 10
```

**Review Checklist:**
- [ ] All `nodeId` values are unique
- [ ] All `nextNodeId` values point to existing/planned nodes
- [ ] Skills are from valid FutureSkills list
- [ ] Patterns are valid (analytical, helping, building, patience, exploring)
- [ ] Consequences reference correct characterId
- [ ] Session boundary placed every ~10 nodes
- [ ] Node IDs follow naming convention: `{character}_{arc}_{stage}`

---

## Migration from Old System

### If You Have Old Manual Mappings

**Before (scene-skill-mappings.ts):**
```typescript
'maya_lab_visit': {
  sceneId: 'maya_lab_visit',
  choiceMappings: {
    'lab_ask_project': {
      skillsDemonstrated: ['criticalThinking', 'communication'],
      context: 'Asked about the bioengineering project...'
    }
  }
}
```

**After (content/maya-dialogue-graph.ts):**
```typescript
{
  nodeId: 'maya_lab_visit',
  choices: [
    {
      choiceId: 'lab_ask_project',
      skills: ['criticalThinking', 'communication']
      // Context auto-generates from dialogue data!
    }
  ]
}
```

**Migration:** Just ensure `skills` array is populated in dialogue nodes. Delete mappings file.

---

## Quality Assurance

### Testing New Nodes

```bash
# 1. Start dev server
npm run dev

# 2. Navigate to character arc
# Visit: http://localhost:3000

# 3. Play through new nodes
# - Verify all choices appear
# - Check nextNodeId connections work
# - Confirm skills are tracked (check admin dashboard)
# - Test session boundaries display announcements

# 4. Check admin dashboard
# Visit: http://localhost:3000/admin/{userId}/skills
# Verify skill demonstrations show with rich context
```

### Build Verification

```bash
# Ensure TypeScript compiles
npm run build

# Check for errors in dialogue graphs
# Common issues:
# - Missing nextNodeId
# - Invalid skill names
# - Duplicate nodeId values
```

---

## Common Questions

### Q: Do I need to update multiple files when adding a scene?
**A:** No! Just add to `content/{character}-dialogue-graph.ts`. Context auto-generates.

### Q: How do I ensure rich context like the old manual mappings?
**A:** The system generates context from dialogue data automatically. It includes:
- Speaker name
- Exact choice text
- Pattern demonstrated
- Skills list
- Player's emerging pattern identity
- Node reference ID

This is often MORE detailed than manual mappings.

### Q: What if I want custom narrative descriptions?
**A:** Add them to the choice text itself:
```typescript
text: "Ask about the bioengineering project she's been working on"
// This exact text appears in the context
```

### Q: Can I still add intensity ratings (high/medium/low)?
**A:** Not currently, but we can add this as metadata if needed:
```typescript
metadata: {
  sessionBoundary: false,
  intensity: 'high'  // Optional custom field
}
```

### Q: How many nodes should each character have?
**A:** Target 25-35 nodes per character for a complete arc. See inventory above.

---

## Roadmap: Content Expansion

### Phase 1: Character Depth (Current)
- ✅ 11 characters with 16-153 nodes each
- ✅ 433 total nodes
- ✅ 770 skill definitions

### Phase 2: Arc Completion (Next 2 Months)
- 🎯 Bring all characters to 30+ nodes
- 🎯 Add 3-5 intersection scenes (character crossovers)
- 🎯 Target: 500+ total nodes

### Phase 3: Replayability (Month 3-4)
- 🎯 Add content variations (same node, different text)
- 🎯 Pattern-reflective NPC responses
- 🎯 New Game+ exclusive content

---

## Conclusion

**Content creation is SIMPLER now, not harder:**

✅ One file per character (not two)
✅ Skills defined inline with choices
✅ Context auto-generates from dialogue data
✅ Session boundaries just a metadata flag
✅ No duplicate data to maintain
✅ No manual mapping updates needed

**To add 10 new scenes:**
1. Edit `content/{character}-dialogue-graph.ts`
2. Add 10 DialogueNode objects
3. Commit
4. Done

**The system handles:**
- Context generation
- Skill tracking
- Pattern alignment
- Admin dashboard display
- Career matching
- Journey narratives

**You focus on:** Writing great dialogue and designing meaningful choices.
