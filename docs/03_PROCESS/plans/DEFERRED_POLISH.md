# Deferred Polish Items

Items intentionally deferred per AAA 70/20/10 principle (core first, polish later).

---

## Character State Greeting Integration

**System:** `lib/character-states.ts` (COMPLETE)
**Tests:** `tests/lib/character-states.test.ts` (40 tests passing)

**What's Built:**
- Trust-based demeanor system (guarded → warming → open → vulnerable)
- Greeting prefixes for all 16 characters
- Helper functions: `getCharacterState()`, `getGreetingPrefix()`, `getToneShift()`

**What's Deferred:**
- Integration into character dialogue graphs
- Trust-gated greeting router nodes for Maya, Devon, Marcus (Tier 1/2)

**Pattern to Implement Later:**
```typescript
// Add to each character's dialogue graph:
{
  nodeId: 'maya_greeting_router',
  speaker: 'Narrator',
  content: [{ text: '', variation_id: 'router' }],
  choices: [
    {
      choiceId: 'route_vulnerable',
      text: '',
      nextNodeId: 'maya_greeting_vulnerable',
      visibleCondition: { trust: { min: 6 } }
    },
    {
      choiceId: 'route_open',
      text: '',
      nextNodeId: 'maya_greeting_open',
      visibleCondition: { trust: { min: 4 } }
    },
    // ... warming, guarded
  ]
}

// Then 4 greeting nodes per character using prefixes from character-states.ts
```

**Estimated Work:** ~12 nodes per character × 3 characters = 36 nodes

**When to Implement:**
- During Tier-based content expansion sprint
- When dialogue depth targets require more variation
- Natural fit alongside voice variation expansion

---

## Why Deferred

Per AAA Strategic Framework:
- Core loop > Polish
- "Walk-Away Test": Players won't notice greeting variations immediately
- System is built and tested - integration is refinement
- Better to validate pipeline first to catch issues as content grows

---

**Created:** January 6, 2026
**Phase:** Post-Phase 2
