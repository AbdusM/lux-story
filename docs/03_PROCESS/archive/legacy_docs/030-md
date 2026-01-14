# Educator Dashboard & Analytics Plan

## Phase 1: Simple Career Profile (In-Game) - IMMEDIATE
Add to existing chat interface at journey end

### Career Profile Card (Scene 3-26)
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 YOUR BIRMINGHAM CAREER PATH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You explored:
✓ Healthcare (70% of choices)
✓ Technology (20% of choices)
✓ Trades (10% of choices)

Your work style:
• Take time with decisions (patience: high)
• Care about helping others (service: 8/10)
• Want financial stability (mentioned 5 times)

Birmingham programs that fit YOU:
1. UAB Respiratory Therapy - 2 years, $60K start
2. Jeff State Dental Hygiene - 2 years, $58K start
3. Lawson State Surgical Tech - 18 months, $48K start

Your next 3 steps:
□ Apply for FAFSA by Feb 15
□ Visit Jeff State campus (Ms. Patricia: 205-555-0100)
□ Shadow a respiratory therapist (contact UAB career center)

[Take a screenshot of this card]
Share with: Parent | Counselor | Yourself

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: [date] | Grand Central Terminus
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Phase 2: Analytics Dashboard - NEXT SPRINT

### Core Analytics to Track (Invisible to Students)
```typescript
interface SessionAnalytics {
  // Engagement Metrics
  sessionId: string
  startTime: Date
  endTime: Date
  totalDuration: number
  completionStatus: 'abandoned' | 'partial' | 'complete'
  dropOffPoint?: string  // Which scene they left at
  
  // Career Path Metrics
  platformsVisited: {
    healthcare: number
    technology: number
    trades: number
    business: number
    creative: number
  }
  
  // Decision Patterns
  averageDecisionTime: number
  rushingIndicators: number  // Quick clicks
  patientChoices: number     // Thoughtful decisions
  backButtonUses: number
  
  // Value Indicators
  mentionedMoney: number
  mentionedFamily: number
  mentionedImpact: number
  mentionedCreativity: number
  
  // Action Metrics (Most Important!)
  viewedResources: boolean
  screenshotPrompted: boolean
  reachedEnding: boolean
  choseNextSteps: boolean
}
```

### Simple Educator View
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BIRMINGHAM YOUTH CAREER EXPLORER
Analytics Dashboard (Last 30 Days)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ENGAGEMENT
• Sessions started: 847
• Completed journeys: 312 (37%)
• Average time: 18 minutes
• Most common drop-off: Chapter 2 (values exploration)

🎯 CAREER INTERESTS
1. Healthcare: 45% of youth
2. Technology: 28% of youth  
3. Trades: 18% of youth
4. Business: 7% of youth
5. Creative: 2% of youth

💡 KEY INSIGHTS
• 73% mention financial stability as primary concern
• 61% explore multiple career paths before deciding
• Youth who see Maya's story complete 2x more often
• Average 3.2 career paths explored per session

🚨 AREAS NEEDING ATTENTION
• Only 23% reach final resources
• Technology path underexplored (add more examples?)
• Drop-off high at values section (simplify?)

📈 GRANT METRICS
• Total youth served: 847
• Career paths identified: 312
• Resources accessed: 194
• Cost per completion: $0.80
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Implementation Priority:
1. **NOW**: Add career profile to game (no backend needed)
2. **NEXT**: Add anonymous analytics collection
3. **LATER**: Build educator dashboard
4. **FUTURE**: Individual student tracking (with consent)

## Phase 3: Enhanced Emotional Arc (Integrated)

### Character Backstory Reveals (Drives Career Exploration)
Add these to existing character interactions:

#### Maya's Full Story (Healthcare Path)
"My mom came here from Mexico when I was 5. She cleans rooms at UAB Hospital - sees all these nurses and doctors but can't afford to get sick herself. That's why I'm looking at respiratory therapy. Good money, only 2 years of school, and I could actually help people like her."

#### Jordan's Reality (Trades Path)  
"Everyone thinks trades are for people who can't do college. But my uncle makes $85K doing HVAC. No student loans. Bought a house at 25. I'm not dumb - I'm practical."

#### Devon's Struggle (Technology Path)
"I taught myself to code from YouTube. But every tech job wants a degree I can't afford. Innovation Depot has this bootcamp though - 12 weeks, they help you get hired. That's more realistic than 4 years of debt."

#### Alex's Journey (Creative/Business Path)
"Birmingham killed my dad's steel job. But now there's all these food trucks, breweries, design firms. The city's changing. I want to be part of building something new, not mourning what's gone."

### Emotional Stakes That Drive Career Discovery:
- **Opening Mystery**: The letter is from your future self (reveal at end based on choices)
- **Time Pressure**: "You have one year before [family situation] forces a decision"
- **Personal Cost**: Each path means giving up something else (show tradeoffs)
- **Community Impact**: Your choice affects others (Maya needs study partner, Jordan needs business partner)

### Keep Career Focus Central:
Every emotional beat must connect to career exploration:
- Character struggles → Show different career paths
- Personal stakes → Urgency to find direction  
- Community connections → Birmingham opportunities
- Future self mystery → You become who you choose to be

## Success Metrics:

### Student Success:
- Completion rate > 40%
- Career profile screenshots > 30%
- Resource clicks > 20%
- Return visits > 15%

### Grant Success:
- Cost per student < $5
- Career paths identified > 500/month
- Counselor adoption > 10 schools
- Student satisfaction > 4/5

### Birmingham Success:
- Local program applications increase
- Youth stay in Birmingham for careers
- Workforce development goals met
- Success stories for next grant cycle