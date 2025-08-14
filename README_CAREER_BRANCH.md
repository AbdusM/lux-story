# Lux Career Exploration - Birmingham Branch

## Live Demo
Visit the site and play through the story. The career exploration happens automatically through your choices.

## How It Works

### For Players (Including Judges)
1. **Start the game** - No pressure, no "career journey" language
2. **Make choices** - Each choice you make is silently tracked
3. **Explore regions** - Five forest areas represent career sectors (unnamed)
4. **Meet characters** - Including Birmingham employer representatives
5. **Receive whispers** - After 5+ choices, subtle pattern observations appear

### Pattern Tracking (Invisible)
- Every choice has a theme (helping, questioning, patience, etc.)
- Themes accumulate invisibly in localStorage
- After patterns emerge, poetic hints appear:
  - "You often choose to help. The forest notices."
  - "Questions bloom from you like morning flowers."
  - "Stillness comes naturally to you."

### Career Mapping (Never Shown to Players)
- `helping` → Healthcare/Social Services
- `building` → Construction/Engineering  
- `questioning` → Innovation/Consulting
- `patience` → Education/Agriculture
- `analyzing` → Finance/Technology
- `exploring` → Research/Discovery

## Birmingham Elements

### Seven Territories
"The forest stretches across seven territories" - representing Birmingham's 7 counties

### Forest Regions (Career Sectors)
- **The Quiet Grove** - Healthcare (soft beeping, breathing rhythms)
- **Where Things Take Shape** - Construction (patient hammering)
- **The Pattern Place** - Finance/Tech (numbers like fireflies)
- **The Growing Place** - Agriculture (time in seasons)
- **The Rhythm Section** - Manufacturing (meditative repetition)

### Employer Characters (Unnamed)
- **Pattern Keeper** - Blue and green figure (Regions Bank colors)
- **Healing Guide** - White and green figure (UAB Health colors)
- **Foundation Builder** - Construction sector representative

### Historical Elements
- "This tree remembers when walking was resistance"
- References to paths walked so others could run

## Key Features

### Zippy the Time-Confused Butterfly
- Represents career uncertainty as natural
- "Was I going to be? Or am I already?"
- Normalizes not knowing your path

### No Gamification
- No scores or achievements
- No progress bars
- No right/wrong answers
- No visible metrics

### Mental Health Focus
- Stillness and breathing mechanics
- Anxiety reduction through narrative
- Non-competitive environment
- Self-paced exploration

## For Grant Judges

### Viewing Pattern Data (Console)
While playing, open browser console (F12) and type:
```javascript
// See your choice patterns
JSON.parse(localStorage.getItem('lux-patterns'))

// See your choice history  
JSON.parse(localStorage.getItem('lux-game-state'))
```

### What to Notice
1. **No pressure** - Never asked "What's your career?"
2. **Natural discovery** - Patterns emerge from choices
3. **Subtle revelations** - Whispers appear after strong patterns
4. **Birmingham specific** - Seven territories, local employer colors
5. **Anxiety-free** - No timers, scores, or achievements

### Impact Demonstration
- Play for 10 minutes
- Make 5-10 choices naturally
- Watch for subtle pattern whispers
- Check console to see invisible tracking
- Notice complete absence of career pressure

## Technical Implementation

### Pattern Tracking
```javascript
// Every choice records a theme
gameState.recordChoiceWithTheme(sceneId, choiceText, consequence, theme)

// After 5+ choices with patterns, whispers appear
"You often choose to help. The forest notices."
```

### No External Dependencies
- Everything in localStorage
- Works offline
- No database needed
- No user accounts

### Privacy First
- All data local
- No personal information
- Anonymous patterns only
- User owns their data

## Success Metrics

### For Birmingham
- Serves all 7 counties equally
- Works offline for rural areas
- Reduces career anxiety
- Natural pathway discovery
- Real employer connections

### For Players
- No test anxiety
- Self-paced exploration
- Meaningful choices
- Poetic insights
- Contemplative experience

## Deployment

### Current Status
- Branch: `career-exploration-birmingham`
- URL: [Your deployment URL]
- Ready for grant demonstration

### Testing Checklist
- [ ] Play through 5 chapters
- [ ] Make varied choices
- [ ] Observe pattern whispers
- [ ] Check console for tracking
- [ ] Verify no achievements/scores

## Grant Alignment

✅ Mental health focus (anxiety reduction)
✅ All 7 counties served
✅ Employer partnerships (implicit)
✅ Youth engagement without pressure
✅ Measurable outcomes (pattern tracking)
✅ Birmingham-specific content

---

**The only career exploration platform that reduces anxiety rather than creating it.**