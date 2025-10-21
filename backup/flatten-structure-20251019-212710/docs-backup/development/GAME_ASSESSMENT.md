# Game Assessment Framework - Lux Story

## Current Implementation Status

### 1. NARRATIVE STRUCTURE
- **Total scenes implemented:** 126 scenes
- **Average choices per scene:** 3.2 choices (15 choice scenes total)
- **Branching depth:** Shallow/Medium (mostly linear with choice variations)
- **Current story arc:** Day-cycle (Morning → Afternoon → Evening → Night → Dawn)
- **Main conflict/tension:** Internal struggle between productivity anxiety and mindful presence

### 2. CHARACTER DETAILS

#### Active Characters (11 total):
- **Lux** (Purple glow #9370DB): Meditative sloth protagonist, wisdom-giver, patient observer
- **Swift** (Green glow #4CAF50): Not implemented in current story data
- **Sage** (Orange glow #FF9800): Not implemented in current story data
- **Buzz** (Cyan glow #00BCD4): Not implemented in current story data
- **Rushing Rabbit**: Anxious about notifications, represents digital overwhelm
- **Anxious Ant**: Worried about productivity, represents work pressure
- **Wise Owl**: Philosophical observer, provides deeper insights
- **Zippy**: Time-confused butterfly (Birmingham addition)
- **Dream Voice**: Appears in dream sequences
- **Healing Guide**: Character in the Quiet Grove
- **Foundation Builder**: Character in Where Things Take Shape
- **Pattern Keeper**: Character in The Pattern Place

#### Character Interaction Model:
- Characters appear separately in dedicated scenes
- No direct character conflicts, more philosophical differences
- Each character represents different life approaches/anxieties

### 3. CAREER PATTERN SYSTEM

Current careers discovered through patterns:
```
Mapped themes → Implicit careers (never explicitly stated):
- 'helping' → Healthcare, Education, Social Work
- 'patience' → Counseling, Research, Meditation Teacher
- 'questioning' → Science, Philosophy, Journalism
- 'analyzing' → Data Science, Research, Finance
- 'building' → Engineering, Construction, Development
- 'exploring' → Innovation, Travel, Discovery
- 'listening' → Therapy, Music, Communications
- 'thinking' → Academia, Writing, Strategy
- 'experiencing' → Arts, Performance, Travel
- 'harmony' → Mediation, Design, Environmental Work
```

**Total unique career themes:** 10 primary patterns
**Average playtime to career reveal:** 5-10 choices (pattern needs 3+ occurrences)
**Can players discover multiple careers per playthrough?** Yes, patterns evolve as choices change

### 4. PERFORMANCE METRICS

What exactly tracks these states:
- **struggling** (<0.3): Triggered by rapid clicking (<3s), jumping themes, high anxiety
- **exploring** (0.3-0.5): Default state, trying different paths, moderate pace
- **flowing** (0.5-0.7): Achieved through consistent themes, patient choices (8-12s)
- **mastering** (>0.7): Strong alignment, high consistency, multiple similar choices

Performance equation:
```
Performance = (Alignment × Consistency) + (Learning × Patience) - (Anxiety × Rushing)
```

### 5. MESSAGE FLOW

Current message types:
- Story messages (narration)
- Character dialogue (11 characters)
- Narrative descriptions (scene setting)
- Breathing invitations (40% struggling, 20% exploring, 10% flowing, 5% mastering)
- Ambient messages (performance-based)
- Pattern revelations (every 5 minutes after 5+ choices)

**Average messages per scene:** 1-3 messages
**Reading pace assumption:** 5-10 seconds per message

### 6. SCENE TRANSITION LOGIC

- **Total scenes:** 126
- **Structure:** Linear progression within chapters, branching at choice points
- **Can players revisit scenes?** No, forward-only progression
- **Save points:** Automatic after every scene (localStorage)
- **Scene unlock conditions:** Previous scene completion or specific choice

Chapter breakdown:
- Chapter 1 (Morning): 30 scenes
- Chapter 2 (Afternoon): 45 scenes
- Chapter 3 (Evening): 26 scenes
- Chapter 4 (Night): 15 scenes
- Chapter 5 (Dawn): 32 scenes

### 7. CORE GAMEPLAY LOOP

Current player journey:
```
1. Start → Character intro (Lux introduction)
2. Morning → Meeting anxious forest creatures
3. Afternoon → Deeper exploration of themes
4. Evening → Reflection and pattern emergence
5. Night → Dream sequences and introspection
6. Dawn → New understanding and career hints
```

**Session length target:** 15-30 minutes
**Total content hours:** 1-2 hours for full exploration
**Replayability factors:** Different choice paths, multiple career discoveries, performance levels

### 8. PLAYER RETENTION HOOKS

Currently implemented:
- [ ] Daily content changes
- [x] Mystery elements (pattern revelations)
- [x] Unfinished storylines (cyclical day structure)
- [x] Hidden content (performance-based messages)
- [x] Pattern mastery goals
- [ ] Character relationship building
- [x] World lore discovery (forest wisdom)
- [x] Adaptive difficulty (performance system)

### 9. PAIN POINTS

What needs fixing:
- **Player confusion points:** Career discovery too subtle, no explicit feedback
- **Drop-off moments:** Between chapters, long narration sequences
- **Technical limitations:** localStorage only, no cloud sync
- **Content bottlenecks:** Limited to 126 scenes total
- **Pacing issues:** Chapter 2 too long (45 scenes), Chapter 4 too short (15 scenes)

### 10. SUCCESS METRICS

How we measure success:
- Completion rate: Reaching Dawn chapter
- Return player rate: Continuing saved game
- Average session time: 15+ minutes ideal
- Career discovery rate: Pattern revelations triggered
- Performance improvement: Moving from struggling → flowing

## STRATEGIC QUESTIONS

### Core Identity
**In one sentence, what emotional experience should players have?**
"A calming journey of self-discovery where career paths emerge naturally through contemplative choices, not tests."

### Unique Selling Point
**What makes this different from Lifeline, Reigns, or other text adventures?**
- Performance-based adaptive narrative (invisible)
- Career discovery without explicit career content
- Anti-gamification philosophy (no scores/achievements)
- Anxiety reduction as primary goal
- Contemplative pacing with breathing mechanics

### Target Audience
- Age range: 16-25 (Birmingham youth focus)
- Gaming experience level: Casual/Non-gamers
- Interests/themes: Mindfulness, career anxiety, self-discovery
- Platform: Web-first (mobile responsive)

### Monetization Plans
- No monetization (grant-funded)
- Potential future: Institutional licensing for schools
- Never ads or in-app purchases (breaks contemplative experience)

### Content Pipeline
- New scene creation: ~30 minutes per scene
- No procedural generation (hand-crafted narrative)
- Community content: Not planned (quality control)
- Modding: Not supported (narrative integrity)

## NEXT SPRINT PRIORITIES

1. **Add more character interactions** - Bring Swift, Sage, Buzz into the story
2. **Balance chapter lengths** - Redistribute scenes for better pacing
3. **Make career patterns clearer** - Add more obvious pattern revelations
4. **Mobile optimization** - Touch interactions, larger text
5. **Analytics integration** - Track actual player behavior

## INSPIRATION REFERENCES

Games that inspire specific elements:
- **Narrative style:** A Short Hike (contemplative exploration)
- **Choice mechanics:** Reigns (simple binary/ternary choices)
- **Visual presentation:** Monument Valley (minimalist, calming)
- **Emotional tone:** Journey (wordless emotional communication)
- **Career exploration:** None (we're pioneering this approach)

## TECHNICAL CONSTRAINTS

- **Build size limits:** Currently 126KB (excellent)
- **localStorage limits:** Using ~10KB of 5MB limit
- **Performance issues on mobile:** None detected
- **Accessibility compliance:** Needs screen reader optimization

## CONTENT SAMPLES

### Typical Scene Structure:
```json
{
  "id": "2-5",
  "type": "choice",
  "text": "The rabbit's breathing slows slightly...",
  "choices": [
    {
      "text": "Maybe you don't need to catch up",
      "consequence": "acceptance",
      "nextScene": "2-6"
    },
    {
      "text": "Let me help you organize",
      "consequence": "helping",
      "nextScene": "2-7"
    }
  ]
}
```

### Choice → Consequence Example:
- Choice: "Maybe you don't need to catch up"
- Consequence: "acceptance"
- Tracked theme: "patience"
- Performance impact: +patience, -anxiety
- Career hint: Counseling, meditation teaching

### Pattern Detection Logic:
After 5+ choices, if "helping" appears 3+ times:
"Your hands seem drawn to lifting others." (subtle career hint toward care professions)

---

## Key Strengths:
1. **Unique performance equation** driving everything
2. **Truly contemplative** - no pressure mechanics
3. **Innovative career discovery** - emerges from behavior
4. **Strong thematic coherence** - mindfulness throughout
5. **Technical excellence** - small, fast, responsive

## Growth Opportunities:
1. **Content volume** - Need 3-5x more scenes
2. **Character development** - Underutilized character roster
3. **Clearer feedback** - Players may not understand the system
4. **Social features** - Share career discoveries
5. **Progression system** - Long-term goals beyond single session

*This assessment based on current implementation as of January 2025*