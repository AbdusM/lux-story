# MVP Software Development Plan: Career Exploration Birmingham
## Lean 8-Week Sprint Plan for Grant Demo

### Project Focus
Build minimal viable demo showing implicit career exploration through narrative. Focus on storytelling over technical features.

**Timeline**: 8 weeks to demo
**Scope**: Narrative-first, minimal technical additions
**Goal**: Compelling grant demonstration

---

## Week 1-2: Zippy Character & Basic Setup

### Sprint Goal
Add Zippy (time-confused butterfly) as the subtle career guide character.

### Implementation Tasks

#### 1. Create Branch
```bash
git checkout -b career-exploration-birmingham
```

#### 2. Add Zippy to Story System
```javascript
// components/StoryMessage.tsx (minimal change)
const getCharacterEmoji = (speaker) => {
  if (speaker === 'Zippy') return '🦋'
  if (speaker === 'Lux') return '🦥'
  // existing characters...
}

// Simple CSS addition
.message-zippy {
  color: #667eea;
  font-style: italic;
}
```

#### 3. Zippy Dialogue Content
```json
// data/contemplative-story-career.json
// Add Zippy appearances to existing story
{
  "id": "2-zippy-1",
  "type": "dialogue",
  "speaker": "Zippy",
  "text": "Was I going to be... or am I already? Time confuses me."
},
{
  "id": "2-zippy-2",
  "type": "dialogue",
  "speaker": "Zippy",
  "text": "The rabbit rushes to somewhere. I forgot where I was going."
}
```

### Deliverables
- ✅ Zippy appears with butterfly emoji
- ✅ Zippy has 5-10 dialogue moments
- ✅ Time-confusion theme established

---

## Week 3-4: Forest Regions Through Narrative

### Sprint Goal
Create career sectors through story descriptions, not technical systems.

### Implementation Tasks

#### 1. Add Regional Descriptions to Story
```json
// Extend existing scenes with location context
{
  "id": "2-healing-grove-1",
  "type": "narration",
  "speaker": "narrator",
  "text": "You find yourself in a quieter part of the forest. The air here moves differently, like breathing."
},
{
  "id": "2-healing-grove-2",
  "type": "narration",
  "speaker": "narrator",
  "text": "Soft sounds, almost like beeping, blend with the rustling leaves."
}
```

#### 2. Five Implicit Career Regions
```javascript
// No technical implementation needed - just narrative

const REGION_NARRATIVES = {
  "The Quiet Grove": [  // Healthcare
    "Everything here moves at the pace of healing.",
    "A figure in soft colors tends to something unseen.",
    "The rhythm here is like a heartbeat."
  ],
  
  "Where Things Take Shape": [  // Construction
    "The sound of making fills this space.",
    "Patient hands measure twice, cut once.",
    "Foundations matter here."
  ],
  
  "The Pattern Place": [  // Finance/Tech
    "Numbers dance in the air like fireflies.",
    "Everything balances, eventually.",
    "Patterns within patterns within patterns."
  ],
  
  "The Growing Place": [  // Agriculture
    "Time moves in seasons here.",
    "Patience is measured differently.",
    "Everything has its season."
  ],
  
  "The Rhythm Section": [  // Manufacturing
    "Repetition becomes meditation.",
    "The same motion, perfectly repeated.",
    "There's comfort in the rhythm."
  ]
}
```

#### 3. Character Placement Hints
```json
{
  "id": "3-owl-location",
  "type": "narration",
  "text": "The owl prefers the Pattern Place. 'I see better in structured darkness,' it says."
},
{
  "id": "3-ant-location",
  "type": "narration",
  "text": "The ant is often found Where Things Take Shape, carrying materials."
}
```

### Deliverables
- ✅ 5 regions described through narrative
- ✅ Characters associated with regions
- ✅ No explicit career labels

---

## Week 5: Simple Pattern Tracking

### Sprint Goal
Track player choices invisibly using existing localStorage.

### Implementation Tasks

#### 1. Extend Existing Game State
```typescript
// lib/game-state.ts (minimal addition)
interface GameState {
  currentScene: string
  choices: ChoiceRecord[]
  meditationCount: number
  // NEW: Hidden pattern tracking
  patterns?: {
    regionVisits: Record<string, number>
    characterTime: Record<string, number>
    choiceThemes: string[]
  }
}

// Add to recordChoice method
recordChoice(sceneId: string, choiceText: string, consequence: string) {
  // Existing code...
  
  // NEW: Silent pattern recording
  if (!this.state.patterns) {
    this.state.patterns = {
      regionVisits: {},
      characterTime: {},
      choiceThemes: []
    }
  }
  
  // Track themes without player knowing
  const theme = this.extractTheme(consequence)
  this.state.patterns.choiceThemes.push(theme)
  
  this.saveState()
}

private extractTheme(consequence: string): string {
  // Map consequences to hidden themes
  const themes = {
    'helping': ['assistance', 'support', 'care'],
    'building': ['creation', 'making', 'construction'],
    'analyzing': ['observation', 'questioning', 'pattern'],
    'waiting': ['patience', 'stillness', 'acceptance']
  }
  
  // Find matching theme
  for (const [theme, keywords] of Object.entries(themes)) {
    if (keywords.some(k => consequence.includes(k))) {
      return theme
    }
  }
  return 'exploring'
}
```

#### 2. Narrative Revelations Based on Patterns
```typescript
// hooks/usePatternRevelation.ts (simple version)
export function usePatternRevelation() {
  const gameState = useGameState()
  
  const getSubtleHint = () => {
    const patterns = gameState?.patterns
    if (!patterns) return null
    
    // Count theme frequency
    const themeCounts = patterns.choiceThemes.reduce((acc, theme) => {
      acc[theme] = (acc[theme] || 0) + 1
      return acc
    }, {})
    
    // Find dominant theme
    const dominant = Object.entries(themeCounts)
      .sort(([,a], [,b]) => b - a)[0]
    
    if (dominant && dominant[1] > 3) {
      const hints = {
        'helping': "You often choose to help. The forest notices.",
        'building': "Your hands seem to remember making things.",
        'analyzing': "Patterns call to you.",
        'waiting': "Stillness comes naturally to you."
      }
      return hints[dominant[0]]
    }
    
    return null
  }
  
  return { getSubtleHint }
}
```

### Deliverables
- ✅ Invisible choice tracking
- ✅ Pattern detection
- ✅ Subtle narrative hints

---

## Week 6: Birmingham-Specific Content

### Sprint Goal
Add Birmingham context through story, not systems.

### Implementation Tasks

#### 1. County References in Narrative
```json
// Add to story scenes
{
  "id": "1-county-mention",
  "type": "narration",
  "text": "The forest stretches across seven regions, some busier than others."
},
{
  "id": "2-bibb-reference",
  "type": "dialogue",
  "speaker": "Lux",
  "text": "The quiet parts of the forest are still forest."
},
{
  "id": "2-jefferson-reference",
  "type": "narration",
  "text": "Where all paths cross, the forest hums with activity."
}
```

#### 2. Employer Characters (Unnamed)
```json
// Add employer-inspired characters
{
  "id": "3-pattern-keeper",
  "type": "narration",
  "text": "A figure in blue and green observes the counting stones."
},
{
  "id": "3-pattern-keeper-dialogue",
  "type": "dialogue",
  "speaker": "Pattern Keeper",
  "text": "Everything balances, given time. The numbers know this."
},
{
  "id": "3-healing-guide",
  "type": "narration",
  "text": "Someone in soft white moves through the Quiet Grove."
},
{
  "id": "3-healing-guide-dialogue",
  "type": "dialogue",
  "speaker": "Healing Guide",
  "text": "Every breath is a small healing. We just help it along."
}
```

#### 3. Local History Elements
```json
{
  "id": "4-history-1",
  "type": "narration",
  "text": "This tree remembers when walking was resistance."
},
{
  "id": "4-history-2",
  "type": "dialogue",
  "speaker": "Wise Owl",
  "text": "Some paths were walked so others could run."
}
```

### Deliverables
- ✅ 7 counties referenced subtly
- ✅ 5+ employer characters
- ✅ Historical elements woven in

---

## Week 7: Demo Preparation

### Sprint Goal
Create compelling 10-minute demo path.

### Implementation Tasks

#### 1. Demo Story Path
```json
// Create specific scene sequence for demo
{
  "demo_path": [
    "1-1",  // Forest introduction
    "1-2",  // Meet Lux
    "1-3",  // First choice (showing non-pressure)
    "2-zippy-1",  // Zippy appears (career uncertainty)
    "2-healing-grove-1",  // Healthcare region
    "3-pattern-keeper",  // Employer character
    "4-revelation-1",  // Pattern-based insight
    "5-ending-choice"  // Multiple valid paths
  ]
}
```

#### 2. Demo Highlights Script
```javascript
// demo/highlights.js
const DEMO_HIGHLIGHTS = {
  "1-1": "Notice: No pressure to 'start your career journey'",
  "1-3": "Choices without right/wrong answers",
  "2-zippy-1": "Career uncertainty normalized",
  "2-healing-grove-1": "Implicit healthcare exploration",
  "3-pattern-keeper": "Real employer (Regions Bank) as forest character",
  "4-revelation-1": "Natural career affinity emergence"
}
```

#### 3. Metrics Overlay (Simple)
```javascript
// Just console logs for demo
const DemoMetrics = {
  trackAnxiety: (scene) => {
    if (scene.includes('breath') || scene.includes('still')) {
      console.log('✓ Anxiety reduction moment')
    }
  },
  
  trackEngagement: (timeInScene) => {
    if (timeInScene > 30000) {
      console.log('✓ Deep engagement detected')
    }
  },
  
  trackPattern: (choice) => {
    console.log('✓ Pattern recorded (invisible to player)')
  }
}
```

### Deliverables
- ✅ 10-minute demo path
- ✅ Key highlights identified
- ✅ Simple metrics display

---

## Week 8: Testing & Polish

### Sprint Goal
Test with 10-20 Birmingham youth and refine.

### Implementation Tasks

#### 1. Quick Testing Protocol
```javascript
// Simple testing setup
const TESTING = {
  participants: 10,
  locations: ['Birmingham Library', 'Virtual sessions'],
  duration: '30 minutes',
  
  observations: [
    'Do they understand without instruction?',
    'Where do they spend most time?',
    'Do they notice career connections?',
    'Any anxiety indicators?',
    'Would they continue playing?'
  ]
}
```

#### 2. Rapid Fixes
Based on testing, implement only critical fixes:
- Clarify confusing narrative moments
- Adjust Zippy appearance timing
- Ensure choices feel meaningful
- Verify mobile readability

### Deliverables
- ✅ 10+ youth tested
- ✅ Critical issues fixed
- ✅ Demo ready for grant

---

## Simplified Technical Stack

### What We're Building
```javascript
// Core additions only
const MVP_SCOPE = {
  characters: ['Zippy'],  // One new character
  regions: 5,  // Through narrative only
  tracking: 'localStorage',  // Existing system
  analytics: 'console.log',  // Demo only
  offline: false,  // Not needed for demo
  database: false,  // Not needed
  auth: false  // Not needed
}
```

### File Changes Summary
```
MODIFIED:
- components/StoryMessage.tsx (5 lines for Zippy)
- lib/game-state.ts (20 lines for patterns)
- data/contemplative-story.json (expanded narrative)

NEW:
- hooks/usePatternRevelation.ts (30 lines)
- demo/highlights.js (demo script)
```

---

## Resource Requirements

### Minimal Team
- **1 Developer**: 4 weeks (part-time)
- **1 Writer**: Birmingham narrative content
- **1 Coordinator**: Youth testing

### Budget (Lean)
- Development: $5,000
- Content: $2,000
- Testing: $1,000
- **Total: $8,000**

---

## Critical Path

### Must Have (Weeks 1-6)
- ✅ Zippy character
- ✅ Career regions in narrative
- ✅ Birmingham content
- ✅ Simple pattern tracking

### Nice to Have (Week 7-8)
- ✅ Polished demo
- ✅ Youth testing
- ✅ Employer characters

### Not Needed for Grant
- ❌ PWA/Offline
- ❌ Analytics dashboard
- ❌ User accounts
- ❌ Advanced animations
- ❌ Audio system
- ❌ Backend API

---

## Success Criteria

### Demo Must Show
1. **Contemplative approach** - No pressure or achievements
2. **Career exploration** - Through narrative, not labels
3. **Birmingham specific** - Local references and characters
4. **Mental health focus** - Anxiety reduction through stillness
5. **All counties** - Mentioned in narrative
6. **Pattern emergence** - Subtle career affinity

### Demo Success Metrics
- 10 minutes to meaningful career insight
- Zero anxiety-inducing elements
- Natural engagement without gamification
- Clear Birmingham connection

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Scope creep | Strict MVP focus |
| Time constraint | Narrative over tech |
| Technical complexity | Use existing systems |
| Youth engagement | Test early, iterate |

---

## Next Immediate Actions

### Week 1 Checklist
- [ ] Create branch
- [ ] Add Zippy emoji/color
- [ ] Write 10 Zippy dialogues
- [ ] Test Zippy appears correctly

### Week 2 Checklist
- [ ] Write forest region descriptions
- [ ] Place characters in regions
- [ ] Add subtle career hints
- [ ] Review with Birmingham coordinator

---

## Conclusion

This lean 8-week plan creates a compelling demo for the Birmingham grant by focusing on narrative over technology. We're building a career exploration experience through storytelling, using our existing contemplative framework with minimal technical additions.

**Core Innovation**: Career discovery through being, not achieving.

**Total New Code**: ~100 lines
**Total New Content**: ~200 narrative segments
**Total Cost**: <$10,000
**Impact**: Revolutionary approach to career exploration