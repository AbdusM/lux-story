# Performance System Testing Guide

## The Equation We're Testing

```
Performance = (Alignment × Consistency) + (Learning × Patience) - (Anxiety × Rushing)
```

## How to Test the System

### 1. Start Fresh
```javascript
// Clear all data in browser console
localStorage.clear()
```

### 2. Play Different Styles

#### Test A: Anxious Player
- Click choices quickly (< 3 seconds)
- Choose "questioning" and "planning" repeatedly
- Jump between different themes
- Expected behavior:
  - More breathing invitations
  - Calming ambient messages
  - Wider spacing in UI
  - Messages like "The forest whispers: 'Questions need not be answered quickly.'"

#### Test B: Patient Explorer
- Take 15+ seconds per choice
- Try different regions and characters
- Mix various choice themes
- Expected behavior:
  - Encouragement to explore
  - Medium breathing invitations
  - Messages like "Paths appear as you walk them."

#### Test C: Consistent Master
- Take moderate time (8-12 seconds)
- Choose similar themes repeatedly (e.g., always "helping")
- Stay in similar regions
- Expected behavior:
  - Affirmation messages
  - Minimal breathing prompts
  - Messages like "Your path becomes clearer with each step."

### 3. Check Performance Metrics

```javascript
// In browser console after playing
const perf = JSON.parse(localStorage.getItem('lux-performance-metrics'))
console.table({
  alignment: perf.alignment,
  consistency: perf.consistency,
  learning: perf.learning,
  patience: perf.patience,
  anxiety: perf.anxiety,
  rushing: perf.rushing
})

// Calculate performance score
const positive = (perf.alignment * perf.consistency) + (perf.learning * perf.patience)
const negative = (perf.anxiety * perf.rushing)
const performance = Math.max(0, Math.min(1, positive - negative))
console.log('Performance Score:', performance)
```

## Observable Behaviors

### Visual Changes (Automatic)

#### Struggling (Performance < 0.3)
- Slower message animations
- More space between choices
- Gentle breathing animation on card
- Purple-tinted borders
- Frequent breathing invitations

#### Exploring (0.3 - 0.5)
- Normal animations
- Slight hover effects on choices
- Standard spacing

#### Flowing (0.5 - 0.7)
- Smooth flow-in animations
- Green-tinted elements
- Harmonious transitions

#### Mastering (0.7+)
- Quick, crisp animations
- Subtle depth effects
- Minimal prompts
- Enhanced choice indicators

### Narrative Adaptations

#### For Anxious Players
- "The forest holds space for your uncertainty."
- "Perhaps this is a moment to breathe."
- "A leaf falls. There's no rush to catch it."

#### For Patient Players
- "Your patience creates clarity."
- "The forest appreciates your stillness."
- "Time bends around your certainty."

#### For Explorers
- "Many paths remain undiscovered."
- "Each choice creates the next."
- "Discovery has its own pace."

## Testing Checklist

### Phase 1: Individual Metrics
- [ ] Rush through 5 choices → Check anxiety increases
- [ ] Wait 20+ seconds → Check patience increases
- [ ] Choose same theme 3x → Check consistency increases
- [ ] Visit 3 different regions → Check learning increases
- [ ] Mix random themes → Check alignment decreases

### Phase 2: Performance Levels
- [ ] Create high anxiety (rush + question) → See "struggling" behaviors
- [ ] Balance exploration and patience → See "exploring" behaviors
- [ ] Maintain consistency → See "flowing" behaviors
- [ ] Perfect alignment + patience → See "mastering" behaviors

### Phase 3: Adaptive Elements
- [ ] Struggling state shows more breathing prompts
- [ ] Mastering state shows deeper insights
- [ ] Visual spacing adjusts with performance
- [ ] Ambient messages match performance level

## Birmingham Career Connection

### How Performance Maps to Career Readiness

1. **High Alignment + Consistency** = Clear career interest emerging
   - Player gravitates toward specific themes
   - Natural affinity becoming apparent

2. **High Learning + Patience** = Healthy exploration phase
   - Trying different paths without pressure
   - Building broad understanding

3. **High Anxiety + Rushing** = Career pressure detected
   - System provides calming interventions
   - Reduces choice pressure

4. **Balanced Performance** = Optimal career discovery
   - Natural exploration with emerging patterns
   - No forced decisions

## Debug Commands

```javascript
// Force performance level (for testing UI)
localStorage.setItem('lux-performance-metrics', JSON.stringify({
  alignment: 0.8,
  consistency: 0.8,
  learning: 0.6,
  patience: 0.7,
  anxiety: 0.2,
  rushing: 0.1,
  // ... other fields
}))

// View current performance level
const getLevel = (score) => {
  if (score < 0.3) return 'struggling'
  if (score < 0.5) return 'exploring'
  if (score < 0.7) return 'flowing'
  return 'mastering'
}

// Monitor real-time
setInterval(() => {
  const p = JSON.parse(localStorage.getItem('lux-performance-metrics'))
  console.log('Current Performance:', getLevel(calculatePerformance(p)))
}, 5000)
```

## Expected Outcomes

### For Birmingham Demo
1. **Anxious youth** → System detects and provides calming
2. **Uncertain youth** → System encourages exploration
3. **Focused youth** → System affirms their direction
4. **All youth** → Natural career patterns emerge without pressure

### Career Discovery Through Performance
- **Struggling** → Focus on reducing anxiety first
- **Exploring** → Encourage trying different paths
- **Flowing** → Begin to see career patterns
- **Mastering** → Clear career affinity emerges

## Validation Criteria

✅ System responds to player behavior within 5-10 choices
✅ Visual changes are subtle but noticeable
✅ No explicit mention of performance or scores
✅ Career patterns emerge naturally
✅ Anxiety reduction is prioritized
✅ All adaptations feel like natural narrative