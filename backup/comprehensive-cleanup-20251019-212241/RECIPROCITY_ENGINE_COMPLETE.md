# The Reciprocity Engine: Complete Implementation Guide

## Executive Summary

The Reciprocity Engine transforms Grand Central Terminus from a one-way empathy simulator into a genuine engine for mutual self-discovery. By allowing high-trust NPCs to ask the player personal questions, we create moments of shared vulnerability that directly update the PlayerPatterns profile used in Samuel's final reflective loop.

**Critical Innovation**: This is not a new system. It's a careful extension of existing dialogue nodes that maintains architectural integrity while creating profound human moments.

## The Three Mandates (Human-Centered Design)

### Mandate 1: Every Question Requires a Meaningful Reaction
**Problem Solved**: Prevents the "Quiz Show Effect" where NPCs suddenly become survey proctors.
**Implementation**: After each player answer, the NPC provides a unique, contextual response that demonstrates they were truly listening and connects their story to the player's revelation.

### Mandate 2: Every Ask Requires a Graceful Decline Path
**Problem Solved**: Prevents the "Vulnerability Tax" where players feel manipulated into sharing.
**Implementation**: Declining to answer is rewarded with increased trust (+1) and special dialogue acknowledging the beauty of boundaries.

### Mandate 3: Every Answer Requires a Samuel Reflection
**Problem Solved**: Prevents the "Silent Judgment" where patterns change invisibly in the background.
**Implementation**: Samuel later references what the player shared, explicitly connecting it to their patterns and making the system's understanding visible.

## File Structure

```
content/
├── player-questions.ts          # 7 universal self-discovery questions
├── reciprocity-engine-v2.ts     # Human-centered reaction & decline nodes
├── maya-reciprocity-example.ts  # Example integration for Maya
└── [character]-dialogue-graph.ts # Modified to include reciprocity nodes
```

## The Seven Questions

### 1. Parental Work Legacy
**Theme**: Relationship with stability, risk, and work ethic
**Impact**: patience +2/building +1 (stable) OR exploring +2/analytical +1 (entrepreneur)
**Trigger**: After helping character with career choice

### 2. Success Definition
**Theme**: Core values and life philosophy
**Impact**: helping +3 (service) OR building +3 (creation) OR exploring +2 (freedom)
**Trigger**: After helping with impostor syndrome

### 3. The Proving Ground
**Theme**: External validation vs internal motivation
**Impact**: analytical +2/building +2 (proving to others) OR patience +2/exploring +2 (proving to self)
**Trigger**: After breaking through emotional systems

### 4. Unlimited Resources
**Theme**: Authentic desires vs practical constraints
**Impact**: building +3 (create) OR exploring +3 (explore) OR helping +3 (teach)
**Trigger**: After career breakthrough moment

### 5. The Only One
**Theme**: Identity, resilience, and belonging
**Impact**: helping +3 (advocate) OR analytical +2/building +2 (prove) OR patience +3 (observe)
**Trigger**: After witnessing struggle with belonging

### 6. Running From or Toward
**Theme**: Fear-based vs aspiration-based motivation
**Impact**: exploring +2/building +1 (toward) OR analytical +2 (from) OR patience +2 (both)
**Trigger**: After emotional breakthrough

### 7. Ten Years Hence
**Theme**: Long-term vision and priorities
**Impact**: analytical +2/building +2 (leading) OR helping +3 (nurturing) OR exploring +3 (discovering)
**Trigger**: Final reflection with Samuel

## Implementation Flow

### Phase 1: Trust Building (Existing Gameplay)
```
Player → Helps NPC → Trust increases to 6+
NPC reveals vulnerability → Player responds with empathy
Knowledge flags set: ['helped_with_choice', 'knows_family_pressure']
```

### Phase 2: Reciprocity Invitation
```typescript
// The Ask Node
{
  nodeId: 'maya_reciprocity_ask',
  speaker: 'Maya Chen',
  content: [{
    text: "Can I ask you something personal? | About your own path?"
  }],
  requiredState: {
    trust: { min: 6 },
    hasKnowledgeFlags: ['helped_with_choice']
  },
  choices: [
    { text: "Of course. After everything you've shared...", nextNodeId: 'maya_reciprocity_question' },
    { text: "I'd rather not talk about that, if it's okay.", nextNodeId: 'maya_graceful_decline' }
  ]
}
```

### Phase 3A: Graceful Decline Path (Trust +1)
```typescript
// Declining builds MORE trust
{
  nodeId: 'maya_graceful_decline',
  content: [{
    text: "Of course. Thank you for being honest with me. | The fact that you feel safe enough to say 'no' means more than any answer."
  }],
  consequence: {
    trustChange: 1, // REWARD for boundaries
    addKnowledgeFlags: ['respected_boundaries']
  }
}
```

### Phase 3B: Question & Answer
```typescript
// Player answers question
PlayerPatterns updated based on choice
NPC provides meaningful, contextual reaction
Knowledge flag set: 'player_revealed_[topic]'
```

### Phase 4: Samuel's Reflection (Later Scene)
```typescript
{
  nodeId: 'samuel_reflects_stable_parents',
  content: [{
    text: "I was thinking about what you told Maya. About your parents and their stable careers. | It helps me understand your patience - it comes from solid foundation."
  }],
  requiredState: {
    hasGlobalFlags: ['player_revealed_stable_parents']
  }
}
```

## Integration Checklist

### For Each Character Graph:

- [ ] **Maya** (Trust 6+)
  - [ ] Add reciprocity_ask after career choice
  - [ ] Add parental_work_legacy question
  - [ ] Add unlimited_resources question (Trust 7+)
  - [ ] Add graceful decline path
  - [ ] Add 4 enhanced reaction nodes
  - [ ] Test all paths lead to farewell

- [ ] **Devon** (Trust 7+)
  - [ ] Add reciprocity_ask after emotional breakthrough
  - [ ] Add proving_ground question
  - [ ] Add running_from_or_toward question
  - [ ] Add graceful decline path
  - [ ] Add enhanced reaction nodes
  - [ ] Verify systems metaphor consistency

- [ ] **Jordan** (Trust 6+)
  - [ ] Add reciprocity_ask after impostor syndrome help
  - [ ] Add success_definition question
  - [ ] Add the_only_one question
  - [ ] Add graceful decline path
  - [ ] Add enhanced reaction nodes
  - [ ] Connect to mentorship themes

- [ ] **Samuel** (Trust 8+)
  - [ ] Add reflection nodes for ALL possible revelations
  - [ ] Add ten_years_hence as final question
  - [ ] Add boundary respect reflection
  - [ ] Ensure pattern analysis incorporates revelations
  - [ ] Create synthesis moment

## Testing Protocol

### 1. Narrative Coherence Test
```
- Play through to reciprocity moment
- Choose to decline
- Verify trust INCREASES
- Verify graceful response
- Continue to Samuel
- Verify he acknowledges boundary-setting
```

### 2. Pattern Update Test
```
- Note initial PlayerPatterns
- Answer reciprocity question
- Verify patterns update correctly
- Verify NPC reaction references answer
- Reach Samuel reflection
- Verify he explains pattern connection
```

### 3. Edge Case Tests
```
- Trust exactly at threshold (6)
- Missing knowledge flags
- Multiple reciprocity questions in sequence
- Save/load during reciprocity
- Network interruption during question
```

## Success Metrics

### Technical Success
- No console errors
- Patterns update correctly
- State persists across saves
- All paths reach proper endpoints

### Human Experience Success
- Players report feeling "seen" not "interrogated"
- Decline path feels empowering, not punishing
- NPC reactions feel genuine and contextual
- Samuel's reflection creates "aha" moment
- Overall experience feels reciprocal, not extractive

## Philosophy

The Reciprocity Engine completes the philosophical loop of Grand Central Terminus:

1. **Act 1**: Player as witness (listening to NPCs)
2. **Act 2**: Player as catalyst (helping NPCs breakthrough)
3. **Act 3**: Player as participant (sharing own story)
4. **Act 4**: Player as understood (Samuel reflects patterns)

This transforms the experience from:
**"I helped them"** → **"We helped each other"**

## Warning Signs (What NOT to Do)

❌ Don't make questions mandatory for progression
❌ Don't punish players for declining
❌ Don't use generic NPC responses
❌ Don't change patterns silently
❌ Don't ask multiple questions in a row
❌ Don't break character voice for questions
❌ Don't make it feel like data collection

## Final Note

The Reciprocity Engine is not about extracting player data. It's about creating genuine moments of mutual vulnerability that mirror real human connection. When implemented correctly, players won't feel surveyed - they'll feel seen.

The magic happens when Maya says: "That's why you were so patient with me. You understand the weight of expectations."

And later, when Samuel says: "The station shows patterns. Your patience isn't just a trait - it's an inheritance."

That's when the player realizes: This game understands me as much as I understand it.