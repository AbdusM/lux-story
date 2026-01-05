# Reciprocity Engine Verification Checklist

## Implementation Verification

### 1. File Structure Verification
- [x] `content/player-questions.ts` created with 7 reciprocity questions
- [ ] Maya dialogue graph updated with reciprocity nodes
- [ ] Devon dialogue graph updated with reciprocity nodes
- [ ] Jordan dialogue graph updated with reciprocity nodes
- [ ] Samuel dialogue graph updated with reciprocity nodes (final reflective loop)

### 2. Data Structure Verification

#### A. Question Structure
```typescript
// Verify each question has:
- questionId: string
- questionText: string (with | separators for pacing)
- askedBy: character identifier
- minTrust: number (6+ for deep questions)
- requiredFlags: string[] (vulnerability must be established)
- choices: Array with 3-4 options
- stateChanges: StateChange[] for each choice
- npcResponse: string for each choice
```

#### B. State Changes
```typescript
// Verify state changes follow existing pattern:
{
  type: 'pattern',
  pattern: 'helping' | 'exploring' | 'analytical' | 'building' | 'patience',
  delta: number // typically 1-3
}
```

### 3. Integration Points Verification

#### A. Trust Gating
- [ ] Reciprocity nodes only appear at trust level 6+
- [ ] Second questions only appear at trust level 7+
- [ ] Verify trust checking works: `requiredState: { trust: { min: 6 } }`

#### B. Knowledge Flags
- [ ] Each question requires appropriate flags:
  - Maya: `['knows_family_pressure', 'helped_with_choice']`
  - Devon: `['broke_through_systems', 'devon_vulnerable']`
  - Jordan: `['helped_with_impostor_syndrome']`
  - Samuel: `['completed_reflection_loop', 'high_trust_established']`

#### C. Node Flow
- [ ] Ask node → Question node → Response node → Continue/Farewell
- [ ] Player can decline questions (leads to normal farewell)
- [ ] All paths eventually reach farewell nodes

### 4. State Management Verification

#### A. PlayerPatterns Updates
```typescript
// Test that patterns update correctly:
1. Start game with baseline patterns
2. Reach reciprocity question
3. Choose answer
4. Verify pattern changes in GameState:
   - patience increased/decreased as expected
   - helping increased/decreased as expected
   - etc.
```

#### B. Knowledge Flag Updates
- [ ] `player_opened_up` flag added when accepting question
- [ ] `learned_player_background` flag added after answering
- [ ] `deep_mutual_understanding` flag for 7+ trust interactions

### 5. Narrative Coherence Verification

#### A. Character Voice
- [ ] Maya's questions feel anxious but curious
- [ ] Devon's questions feel analytical but vulnerable
- [ ] Jordan's questions feel practical but searching
- [ ] Samuel's questions feel wise but probing

#### B. Response Authenticity
- [ ] NPC responses directly reference player's answer
- [ ] Responses feel emotionally appropriate
- [ ] Connection between answer and response is clear

### 6. Technical Testing Checklist

#### A. Basic Functionality
```bash
# Test sequence:
1. npm run dev
2. Start new game
3. Navigate to Maya
4. Build trust to level 6
5. Help Maya make choice
6. Verify reciprocity ask node appears
7. Accept question
8. Answer question
9. Verify PlayerPatterns update
10. Verify Maya responds appropriately
```

#### B. Edge Cases
- [ ] Declining first question skips to farewell
- [ ] Trust below 6 doesn't show reciprocity
- [ ] Missing knowledge flags doesn't show reciprocity
- [ ] All 4 answer paths work correctly
- [ ] State persists across scene transitions

#### C. Pattern Impact Verification
```javascript
// Before answering:
console.log(gameState.playerPatterns)
// Example: { helping: 3, exploring: 2, patience: 1, building: 1, analytical: 2 }

// After choosing "stable career parent":
console.log(gameState.playerPatterns)
// Expected: { helping: 3, exploring: 1, patience: 3, building: 2, analytical: 2 }
// (patience +2, building +1, exploring -1)
```

### 7. Integration with Existing Systems

#### A. Reflective Loop Integration
- [ ] Samuel references player's answers in final reflection
- [ ] Pattern changes affect Samuel's assessment
- [ ] Player answers create new dialogue variations

#### B. Save System Compatibility
- [ ] Player answers persist in saved games
- [ ] Reciprocity flags saved correctly
- [ ] Pattern changes saved correctly

### 8. User Experience Verification

#### A. Player Agency
- [ ] Clear option to decline personal questions
- [ ] Questions feel earned, not forced
- [ ] Answers feel meaningful, not performative

#### B. Emotional Reciprocity
- [ ] Mutual vulnerability feels balanced
- [ ] Player isn't just therapist anymore
- [ ] True two-way connection established

### 9. Birmingham Integration
- [ ] Questions can surface Birmingham-specific experiences
- [ ] Answers can reference local context (UAB, Innovation Depot)
- [ ] Pattern changes align with career exploration themes

### 10. Performance Verification
- [ ] No console errors when loading reciprocity nodes
- [ ] State updates happen synchronously
- [ ] No lag when processing pattern changes
- [ ] Memory usage remains stable

## Implementation Priority

1. **Phase 1**: Maya reciprocity (most developed character)
2. **Phase 2**: Devon reciprocity (systems/emotion bridge)
3. **Phase 3**: Jordan reciprocity (impostor syndrome connection)
4. **Phase 4**: Samuel reciprocity (final reflective synthesis)

## Success Criteria

The Reciprocity Engine is successful when:
1. Players report feeling "seen" not just "helpful"
2. Pattern profiles become more nuanced and accurate
3. Samuel's final reflection incorporates player's revealed values
4. The experience transforms from one-way empathy to mutual discovery
5. No existing functionality is broken

## Testing Commands

```bash
# Run development server
npm run dev

# Check for TypeScript errors
npx tsc --noEmit

# Verify state management
# In browser console during play:
window.gameState.playerPatterns
window.gameState.knowledgeFlags

# Test pattern updates
# Before reciprocity: Log patterns
# After answering: Verify changes match expected deltas
```

## Notes

- The Reciprocity Engine is NOT a new system - it's a careful extension of existing dialogue nodes
- All state changes use existing StateChange interface
- No new UI components needed - uses existing choice system
- Pattern updates are the PRIMARY purpose - not just flavor text
- This completes the philosophical loop: helper → helped → mutual understanding