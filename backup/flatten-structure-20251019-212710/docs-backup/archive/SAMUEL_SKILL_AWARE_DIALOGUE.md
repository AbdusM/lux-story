# Samuel Skill-Aware Dialogue System

## Overview

Samuel Washington, the Station Keeper, now "notices" player skill demonstrations through eerily observant wisdom. This system generates personalized dialogue based on the player's actual skill demonstrations, making Samuel feel genuinely attentive to each player's unique journey.

## Architecture

```
Player makes choice with skills metadata
         ↓
PlayerPersona tracks skill demonstrations
         ↓
Samuel dialogue node reached
         ↓
useSimpleGame calls getSamuelDialogueEngine()
         ↓
Client-side samuel-dialogue-engine.ts
         ↓
/api/samuel-dialogue (Gemini 1.5 Flash)
         ↓
Skill-aware dialogue returned
         ↓
Displayed in chat interface
```

## Key Files

1. **`/app/api/samuel-dialogue/route.ts`**
   - Next.js API route
   - Calls Gemini 1.5 Flash with skill-aware prompts
   - Validates dialogue quality (no gamification language)
   - Returns personalized Samuel wisdom

2. **`/lib/samuel-dialogue-engine.ts`**
   - Client-side service
   - Handles caching and request deduplication
   - Provides fallback dialogue if API fails
   - Supports preloading common nodes

3. **`/lib/player-persona.ts`** (Enhanced)
   - Now tracks skill demonstrations with rich context
   - `topSkills`: Top 5 skills by count and percentage
   - `recentSkills`: Last 5 unique skills demonstrated
   - `skillDemonstrations`: Detailed context for each skill

4. **`/content/samuel-dialogue-graph.ts`** (Enhanced)
   - Choices now have `skills` metadata array
   - Example: `skills: ['emotional_intelligence', 'communication']`

## Samuel's Voice Principles

### ✅ DO:
- **Show observation through natural wisdom**
  - "I watched how you helped Maya see bridges where others see walls."

- **Connect skills to career paths naturally**
  - "That kind of thinking - finding integration instead of either/or - it's what makes Platform 7½ appear for some travelers."

- **Reference specific player contexts**
  - "Five different approaches to the same festival planning challenge. Most travelers pick one path and stick to it."

- **Maintain warm, patient tone**
  - "Time moves differently for those who know why they're here."

### ❌ DON'T:
- **Explicitly name skills** ("your emotional intelligence is high")
- **Use gamification language** ("you scored", "level up", "points")
- **Report statistics** ("you demonstrated X skill 5 times")
- **Break Samuel's character** (no technical jargon)

## Integration Guide

### Step 1: Ensure PlayerPersona is Updated

```typescript
import { getPersonaTracker } from '@/lib/player-persona'

// After each choice with skills metadata
const persona = personaTracker.addSkillDemonstration(
  playerId,
  choice.skills || [], // ['emotional_intelligence', 'communication']
  choiceContext, // Rich 100-150 word description of what happened
  sceneId
)
```

### Step 2: Generate Samuel Dialogue

```typescript
import { getSamuelDialogueEngine } from '@/lib/samuel-dialogue-engine'

const samuelEngine = getSamuelDialogueEngine()

const dialogue = await samuelEngine.generateDialogue(
  'samuel_hub_initial', // Node ID
  playerPersona, // Current persona with skill data
  {
    platformsVisited: ['Platform 1', 'Platform 3'],
    samuelTrust: 5,
    currentLocation: 'hub'
  }
)

console.log(dialogue.dialogue) // Skill-aware wisdom
console.log(dialogue.emotion)  // 'warm' | 'knowing' | 'reflective' | 'gentle'
```

### Step 3: Display in Chat Interface

```typescript
// Add to messages array
setMessages(prev => [...prev, {
  id: generateMessageId(),
  text: dialogue.dialogue,
  speaker: 'Samuel Washington',
  type: 'story',
  emotion: dialogue.emotion
}])
```

## Example Skill-Aware Responses

### Profile 1: High Emotional Intelligence + Communication

**Skills:**
- `emotional_intelligence`: 5 demonstrations
- `communication`: 3 demonstrations
- Latest: "Validated Maya's family pressure without rushing to fix it"

**Samuel's Response:**
> "I watched how you helped Maya see bridges where others see walls. That kind of thinking - finding integration instead of either/or - it's what makes Platform 7½ appear for some travelers. You're seeing what people need before they ask for it. Devon needed confidence in his systems thinking. Maya needed permission to dream differently. Healthcare? Teaching? Both need that."

**Emotion:** knowing
**Connects to:** Healthcare, Teaching careers

---

### Profile 2: High Critical Thinking + Problem Solving

**Skills:**
- `critical_thinking`: 6 demonstrations
- `problem_solving`: 4 demonstrations
- Latest: "Identified false binary in Devon's 'logic OR emotion' thinking"

**Samuel's Response:**
> "Five different approaches to the same festival planning challenge. Most travelers pick one path and stick to it. You're mapping possibilities. Data analysis roles reward that - seeing patterns across systems most people keep separate. Birmingham's Innovation Depot needs people who can see beyond the obvious solutions."

**Emotion:** reflective
**Connects to:** Data analysis, Systems thinking careers

---

### Profile 3: High Creativity + Adaptability

**Skills:**
- `creativity`: 5 demonstrations
- `adaptability`: 4 demonstrations
- Latest: "Suggested Platform 7½ - unexpected career combinations"

**Samuel's Response:**
> "Three platforms in one night. Some travelers call that indecision. I call it thorough exploration. The best career paths often emerge from unexpected combinations. UAB's Innovation Lab? They're looking for people who can bridge technical and creative systems. That's your pattern emerging."

**Emotion:** warm
**Connects to:** Innovation, Interdisciplinary careers

## Performance Optimization

### Caching Strategy

The engine automatically caches responses based on:
- `nodeId` + `topSkills` combination
- Same node with different skills = different cache key
- Prevents repetitive API calls for same skill profile

```typescript
// Cache key format:
`${nodeId}__${topSkills.join('_')}`

// Example:
'samuel_hub_initial__emotional_intelligence:5_communication:3_adaptability:2'
```

### Preloading Common Nodes

```typescript
// During loading screen or platform transitions
await samuelEngine.preloadCommonNodes(playerPersona, gameContext)

// Preloads:
// - samuel_hub_initial
// - samuel_wisdom_validation
// - samuel_pattern_observation
```

### Error Handling

Fallback dialogue is automatically provided if:
- Gemini API fails
- Network error occurs
- Response quality is poor

```typescript
{
  dialogue: "The station has a way of showing us what we need to see...",
  emotion: 'warm',
  confidence: 0.5,
  error: 'API timeout'
}
```

## Testing

### Manual Testing

```typescript
import { testSamuelDialogue } from '@/lib/samuel-dialogue-engine'

// Run test suite with 3 different skill profiles
await testSamuelDialogue()
```

Output:
```
=== TESTING SAMUEL SKILL-AWARE DIALOGUE ===

--- Testing Helper (Emotional Intelligence) Profile ---

Samuel's Response:
"I watched how you helped Maya see bridges where others see walls..."

Emotion: knowing
Confidence: 0.95

--- Testing Analyzer (Critical Thinking) Profile ---

Samuel's Response:
"Five different approaches to the same challenge..."

Emotion: reflective
Confidence: 0.93

=== TEST COMPLETE ===
```

### Integration Testing

```typescript
// In useSimpleGame.ts or similar

// 1. Track skill demonstration
personaTracker.addSkillDemonstration(
  userId,
  ['emotional_intelligence', 'communication'],
  'Player validated Maya\'s emotions without rushing to fix',
  'maya_family_love'
)

// 2. Generate dialogue
const dialogue = await samuelEngine.generateDialogue(
  'samuel_maya_reflection_gateway',
  persona,
  gameContext
)

// 3. Verify dialogue references skill context
expect(dialogue.dialogue).toContain('Maya') // References context
expect(dialogue.dialogue).not.toContain('emotional intelligence') // No explicit skill naming
expect(dialogue.emotion).toBe('knowing') // Appropriate emotion
```

## API Configuration

### Environment Variables

```bash
# .env.local
GEMINI_API_KEY=your_gemini_api_key_here
```

### Gemini Model Settings

```typescript
model: 'gemini-1.5-flash',
generationConfig: {
  temperature: 0.8,      // Slightly creative for natural variation
  maxOutputTokens: 150,  // Keep Samuel concise (2-4 sentences)
  topP: 0.9
}
```

## Monitoring

### Cache Statistics

```typescript
const stats = samuelEngine.getCacheStats()

console.log(stats)
// { cachedResponses: 12, activeRequests: 0 }
```

### Quality Validation

The API automatically validates:
- Minimum length: 20 characters
- Maximum length: 500 characters (Samuel should be concise)
- Forbidden patterns: "you demonstrated", "you scored", "level up", etc.

Warnings logged to console:
```
[SamuelDialogue] Warning: Dialogue contains forbidden pattern: /your.*skill.*is/i
```

## Future Enhancements

### Phase 3 Ideas:
1. **Multi-turn Skill Awareness**
   - Samuel references skills from previous conversations
   - "Last time we talked, you showed me how you..."

2. **Skill Development Tracking**
   - Samuel notices when skills improve
   - "You're asking deeper questions than when we first met"

3. **Birmingham Integration**
   - Connect skills to specific local opportunities
   - "That critical thinking? UAB's research programs need exactly that"

4. **Adaptive Difficulty**
   - Adjust dialogue complexity based on player engagement
   - Higher trust = deeper psychological insights

## Success Metrics

### Player Experience:
- ✅ Samuel feels genuinely observant (not robotic)
- ✅ Dialogue reflects THEIR specific journey
- ✅ Career connections feel personalized
- ✅ No breaking of character immersion

### Technical:
- ✅ 95%+ confidence scores from Gemini
- ✅ <2 second response time (with caching)
- ✅ <1% fallback rate under normal conditions
- ✅ Zero forbidden patterns in production

## Troubleshooting

### Issue: Generic Dialogue

**Symptoms:** Samuel's responses feel generic, not skill-specific

**Causes:**
1. PlayerPersona not updated with skill demonstrations
2. Empty `topSkills` array
3. No skill context available

**Fix:**
```typescript
// Verify persona has skill data
console.log(playerPersona.topSkills) // Should have data
console.log(playerPersona.skillDemonstrations) // Should have contexts

// Verify choices have skills metadata
console.log(choice.skills) // Should be array like ['emotional_intelligence']
```

### Issue: API Timeout

**Symptoms:** Fallback dialogue always shown

**Causes:**
1. Gemini API key not configured
2. Network issues
3. Rate limiting

**Fix:**
```typescript
// Check API key
console.log(process.env.GEMINI_API_KEY ? 'Configured' : 'Missing')

// Check response time
const start = Date.now()
await samuelEngine.generateDialogue(...)
console.log(`Time: ${Date.now() - start}ms`)
```

### Issue: Skill Naming in Dialogue

**Symptoms:** Samuel says "your emotional intelligence" explicitly

**Causes:**
1. Gemini not following system prompt constraints
2. Temperature too high
3. Need to regenerate with better prompt

**Fix:**
```typescript
// The API logs warnings for this automatically
// If it happens consistently, adjust temperature in route.ts:
generationConfig: {
  temperature: 0.7, // Lower = more adherence to constraints
}
```

## Contact

For questions about this system:
- See: `/docs/TECHNICAL_ARCHITECTURE.md`
- Check: `/app/api/samuel-dialogue/route.ts` for API details
- Review: `/lib/samuel-dialogue-engine.ts` for client-side logic

---

**Last Updated:** Week 2 Day 2 (Skill-Aware Personalization Sprint)
**Status:** Production Ready ✅
