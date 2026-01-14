# Analytics & Events - Data Dictionary

**Last Updated:** January 13, 2026
**Source:** `/lib/event-bus.ts`, `/lib/career-analytics.ts`, `/lib/simple-analytics.ts`, `/lib/simple-career-analytics.ts`, `/lib/admin-analytics.ts`
**Status:** Manual Documentation

---

## Overview

The analytics system tracks player behavior, career exploration patterns, and system performance through multiple complementary engines. The event bus provides cross-component communication, while analytics engines capture player insights for Birmingham career guidance.

**Key Stats:**
- **Event Bus:** 30+ game events, priority-based handling, auto-cleanup
- **Career Analytics:** 8 career paths, 10 pattern mappings, Birmingham-localized opportunities
- **Simple Analytics:** Session tracking, engagement levels (low/medium/high), exploration depth (shallow/moderate/deep)
- **Admin Analytics:** Real-time flow tracking, drop-off heatmaps, A/B testing, cohort analysis
- **Birmingham Opportunities:** 32+ organizations across 8 career sectors

---

## Table of Contents

1. [Event Bus System](#event-bus-system)
2. [Career Analytics Engine](#career-analytics-engine)
3. [Simple Analytics](#simple-analytics)
4. [Simple Career Analytics](#simple-career-analytics)
5. [Admin Analytics](#admin-analytics)
6. [Validation Rules](#validation-rules)
7. [Usage Examples](#usage-examples)
8. [Cross-References](#cross-references)
9. [Design Notes](#design-notes)

---

## Event Bus System

### Overview

Type-safe pub/sub event system for cross-component communication with priority-based handling, one-time listeners, and automatic cleanup.

**Source:** `/lib/event-bus.ts` (383 lines)

### Game Event Types (30+ Events)

| Event Category | Event Name | Data Shape |
|----------------|------------|------------|
| **Game State** | `game:state:changed` | `{ state: string; previousState?: string }` |
| | `game:choice:made` | `{ choice: unknown; timestamp: number; emotionalState: string }` |
| | `game:dialogue:started` | `{ nodeId: string; speaker: string }` |
| | `game:dialogue:completed` | `{ nodeId: string; duration: number }` |
| **Character** | `game:character:met` | `{ characterId: string; location: string }` |
| | `game:trust:changed` | `{ characterId: string; trust: number; delta: number }` |
| | `game:relationship:updated` | `{ characterId: string; relationshipType: string }` |
| **Patterns** | `game:pattern:discovered` | `{ pattern: string; level: number }` |
| | `game:pattern:threshold` | `{ pattern: string; threshold: 'emerging' \| 'developing' \| 'flourishing' }` |
| | `game:skill:unlocked` | `{ skillId: string; pattern?: string }` |
| **Simulations** | `game:simulation:started` | `{ simulationId: string; characterId: string }` |
| | `game:simulation:completed` | `{ simulationId: string; score: number; duration: number }` |
| | `game:golden_prompt:achieved` | `{ simulationId: string; reward: number }` |
| **Interrupts** | `game:interrupt:available` | `{ interruptType: string; duration: number }` |
| | `game:interrupt:taken` | `{ interruptType: string; consequence: unknown }` |
| | `game:interrupt:missed` | `{ interruptType: string }` |
| **Knowledge** | `game:knowledge:gained` | `{ flag: string; source: string }` |
| | `game:arc:completed` | `{ characterId: string; arcType: string }` |
| | `game:vulnerability:revealed` | `{ characterId: string }` |
| **UI Events** | `ui:message:show` | `{ message: unknown; duration?: number }` |
| | `ui:notification:display` | `{ title: string; description: string; type: string }` |
| | `ui:modal:opened` | `{ modalId: string }` |
| | `ui:modal:closed` | `{ modalId: string }` |
| **Performance** | `perf:render:slow` | `{ component: string; duration: number }` |
| | `perf:api:slow` | `{ endpoint: string; duration: number }` |
| | `perf:memory:warning` | `{ usage: number; threshold: number }` |
| **System** | `system:error` | `{ error: Error; context: string }` |
| | `system:warning` | `{ message: string; context: string }` |
| | `analytics:tracked` | `{ event: string; properties: unknown }` |

### Event Bus Features

**Priority Handling:**
```typescript
eventBus.on('game:choice:made', handler, { priority: 1 }) // Higher priority = earlier execution
```

**One-Time Listeners:**
```typescript
eventBus.on('game:simulation:completed', handler, { once: true }) // Auto-cleanup after first call
```

**Auto-Cleanup:**
```typescript
const listenerId = eventBus.on('game:trust:changed', handler)
eventBus.off('game:trust:changed', listenerId) // Remove specific listener
```

**Performance Metrics:**
- Event emission tracking
- Listener count monitoring
- Average execution time per event

---

## Career Analytics Engine

### Overview

Analyzes player choice patterns to identify career path resonance and provides evidence-based insights for Birmingham career exploration.

**Source:** `/lib/career-analytics.ts` (458 lines)

### Career Path Affinities (8 Sectors)

| Career Path | Description | Pattern Mappings |
|-------------|-------------|------------------|
| **healthcare** | Medical, nursing, pediatric specialties | helping (0.4), caring (0.5), researching (0.2) |
| **engineering** | Energy infrastructure, manufacturing, electrical | building (0.6), analyzing (0.3), environmental (0.4) |
| **technology** | Fintech, health tech, startup innovation | analyzing (0.5), creating (0.3), researching (0.4) |
| **education** | Teaching, tutoring, education programs | helping (0.3), supporting (0.3), organizing (0.4) |
| **sustainability** | Renewable energy, green infrastructure | environmental (0.6), growing (0.5) |
| **entrepreneurship** | Startups, business development, venture capital | leading (0.4), organizing (0.3) |
| **creative** | Arts, media, design, marketing | expressing (0.6), storytelling (0.5), creating (0.3) |
| **service** | Nonprofits, civil rights, community foundations | helping (0.3), supporting (0.3), leading (0.3) |

### Pattern-to-Career Mapping (10 Patterns)

| Pattern | Primary Careers | Weighting |
|---------|-----------------|-----------|
| helping | Healthcare (0.4), Education (0.3), Service (0.3) | Normalized by total choices |
| caring | Healthcare (0.5), Education (0.3), Service (0.2) | Stronger healthcare affinity |
| building | Engineering (0.6), Technology (0.4) | Construction-oriented |
| creating | Engineering (0.4), Technology (0.3), Creative (0.3) | Balanced creativity |
| analyzing | Technology (0.5), Engineering (0.3), Healthcare (0.2) | Data-driven |
| researching | Technology (0.4), Healthcare (0.3), Education (0.3) | Investigation-focused |
| environmental | Sustainability (0.6), Engineering (0.4) | Green careers |
| leading | Entrepreneurship (0.4), Education (0.3), Service (0.3) | Leadership roles |
| expressing | Creative (0.6), Technology (0.2), Education (0.2) | Artistic expression |
| storytelling | Creative (0.5), Education (0.3), Technology (0.2) | Narrative-driven |

### Birmingham Opportunities (32+ Organizations)

**Healthcare:**
- UAB Medical Center - Nursing & Medical Programs
- Children's of Alabama - Pediatric Specialties
- Birmingham VA Medical Center - Veterans Healthcare
- Brookwood Baptist Health - Community Healthcare

**Engineering:**
- Southern Company - Energy Infrastructure
- BBVA Field Engineering Programs
- Nucor Steel - Manufacturing Engineering
- Alabama Power - Electrical Engineering

**Technology:**
- Regions Bank - Fintech Development
- BBVA Innovation Center - Banking Technology
- UAB Informatics - Health Tech
- Velocity Accelerator - Tech Startups

**Education:**
- Birmingham City Schools - Teaching
- UAB Education Programs
- Jefferson County Schools
- Community Education Partners

**Sustainability:**
- Alabama Power Renewable Energy
- Environmental Services - City of Birmingham
- Green Infrastructure Projects
- Urban Agriculture Initiatives

**Entrepreneurship:**
- Innovation Depot - Startup Incubator
- Velocity Accelerator - Business Development
- REV Birmingham - Economic Development
- Alabama Launchpad - Venture Capital

**Creative:**
- Birmingham Arts District
- UAB Arts Programs
- Local Media & Marketing Agencies
- Birmingham Design Week

**Service:**
- United Way of Central Alabama
- Birmingham Civil Rights Institute
- Community Foundation Greater Birmingham
- Local Non-Profit Organizations

### Career Insights Interface

```typescript
interface CareerInsight {
  careerPath: keyof CareerPathAffinities
  confidence: number // 0-95%, capped to avoid false certainty
  evidencePoints: string[] // Max 3 evidence points
  birminghamOpportunities: string[] // Top 3 local opportunities
  nextSteps: string[] // 4 actionable steps
  personalizedOpportunities?: Array<{
    name: string
    organization: string
    type: string
    matchScore: number
    matchReasons: string[]
  }>
}
```

### Analytics Snapshot

```typescript
interface AnalyticsSnapshot {
  playerId: string
  sessionId: string
  timestamp: number

  // Choice pattern analysis
  totalChoices: number
  patternDistribution: Record<string, number>
  careerAffinities: CareerPathAffinities

  // Engagement metrics
  averageResponseTime: number
  sessionDuration: number
  platformsExplored: string[]

  // Career insights
  primaryAffinity: keyof CareerPathAffinities
  secondaryAffinity: keyof CareerPathAffinities
  insights: CareerInsight[]
}
```

---

## Simple Analytics

### Overview

Basic analytics that track essential metrics without over-engineering. Focuses on user experience and career exploration insights.

**Source:** `/lib/simple-analytics.ts` (359 lines)

### Simple Analytics Interface

```typescript
interface SimpleAnalytics {
  // Basic session data
  sessionId: string
  startTime: number
  endTime?: number
  totalChoices: number
  scenesCompleted: number

  // Career exploration patterns
  careerInterests: string[]
  birminghamConnections: string[]
  explorationDepth: 'shallow' | 'moderate' | 'deep'

  // User experience metrics
  averageResponseTime: number
  engagementLevel: 'low' | 'medium' | 'high'
  completionRate: number

  // Birmingham-specific insights
  localOpportunitiesViewed: string[]
  careerPathsDiscovered: string[]
  nextStepsSuggested: string[]
}
```

### Engagement Levels (3 Tiers)

| Level | Criteria | Description |
|-------|----------|-------------|
| **low** | < 5 choices OR < 2s avg response time | Minimal interaction |
| **medium** | 5-10 choices AND 2-5s avg response time | Moderate engagement |
| **high** | > 10 choices AND > 5s avg response time | Deep engagement |

### Exploration Depth (3 Tiers)

| Depth | Criteria | Description |
|-------|----------|-------------|
| **shallow** | ≤ 1 interest OR ≤ 8 choices | Surface-level exploration |
| **moderate** | 2-3 interests AND 9-15 choices | Moderate discovery |
| **deep** | > 3 interests AND > 15 choices | Comprehensive exploration |

### Choice Analytics

```typescript
interface ChoiceAnalytics {
  choiceText: string
  pattern: string
  responseTime: number
  timestamp: number
  birminghamRelevance: boolean
}
```

---

## Simple Career Analytics

### Overview

Simplified career analytics with Supabase-primary architecture for data persistence and Birmingham local affinity scoring.

**Source:** `/lib/simple-career-analytics.ts` (340 lines)

### Simple Career Metrics

```typescript
interface SimpleCareerMetrics {
  sectionsViewed: string[]
  careerInterests: string[]
  birminghamOpportunities: string[]
  timeSpent: number
  choicesMade: number
  platformsExplored: string[]
  localAffinity: number // Birmingham connectivity score
}
```

### Birmingham Opportunities (8 Essential)

| Opportunity | Organization | Type | Career Area |
|-------------|--------------|------|-------------|
| Medical Shadowing | UAB Medical Center | job_shadow | healthcare |
| Youth Volunteer Program | Children's of Alabama | volunteer | healthcare |
| IT Internship | Regions Bank | internship | technology |
| Tech Program | Shipt | career_program | technology |
| Engineering Program | Southern Company | career_program | engineering |
| Manufacturing Tour | ACIPCO | job_shadow | engineering |
| Teaching Assistant | Birmingham City Schools | volunteer | education |
| Media Internship | ABC 33/40 | internship | creative |

### Local Affinity Scoring

**Local Keywords Tracked:**
- birmingham, uab, depot, railroad, magic city, bessemer, homewood, local

**Scoring:**
- +1 point per choice containing local keyword
- Higher affinity = stronger Birmingham connection
- Used for personalized local opportunity recommendations

### Data Persistence Strategy

**Supabase-Primary Architecture:**
1. **On app mount:** Hydrate from Supabase (source of truth)
2. **On updates:** Write to localStorage + queue sync to Supabase
3. **Sync frequency:** Every 5 updates to reduce API load
4. **Fallback:** localStorage used if Supabase unavailable

---

## Admin Analytics

### Overview

Real-time admin dashboard analytics for tracking player flow, identifying drop-off points, running A/B tests, and analyzing cohorts.

**Source:** `/lib/admin-analytics.ts` (134 lines)

### Real-Time Flow Tracking (D-011)

**Active Users on Nodes:**
```typescript
const ACTIVE_NODE_USERS = new Map<string, Set<string>>()

trackUserOnNode(userId, nodeId) // Update user's current position
getActiveUserCount(nodeId) // Get live player count at node
```

**Use Cases:**
- Real-time dashboard showing player distribution
- Identify popular/underutilized dialogue paths
- Monitor live engagement during playtests

### Drop-Off Heatmap (D-012)

**Drop-Off Metrics:**
```typescript
interface DropOffMetrics {
  nodeId: string
  visits: number
  exits: number // Players who stopped here
  dropOffRate: number // exits / visits
}

recordVisit(nodeId) // Increment visit counter
recordExit(nodeId) // Mark player exit
getDropOffRate(nodeId) // Calculate drop-off rate
```

**Use Cases:**
- Heatmap visualization of problem nodes
- Identify confusing or frustrating dialogue
- Prioritize content revisions based on drop-off data

### A/B Testing Framework (D-014)

**A/B Test Configuration:**
```typescript
interface ABTest {
  id: string
  variants: string[]
  weights?: number[] // Defaults to equal split
}

const ACTIVE_TESTS: Record<string, ABTest> = {}

assignVariant(testId, userId) // Deterministic hash assignment
```

**Use Cases:**
- Test different dialogue phrasing
- Compare simulation difficulty tiers
- Optimize pattern unlock messaging

### Cohort Analysis (D-015)

**Cohort Types (3 Categories):**

| Cohort Type | Definition | Use Case |
|-------------|------------|----------|
| **daily** | Players who started on same date | Retention tracking |
| **pattern** | Players with same dominant pattern | Pattern-specific engagement |
| **completion** | novice / regular / veteran | Progression-based analysis |

**Implementation:**
```typescript
getUserCohort(userState, 'daily') // "2026-01-13"
getUserCohort(userState, 'pattern') // "analytical"
getUserCohort(userState, 'completion') // "veteran"
```

---

## Validation Rules

### Event Bus Validation

**Event Type Validation:**
```typescript
import { eventBus } from '@/lib/event-bus'

// Type-safe event emission
eventBus.emit('game:choice:made', {
  choice: choiceData,
  timestamp: Date.now(),
  emotionalState: 'curious'
})

// Type-safe event listening
eventBus.on('game:trust:changed', (data) => {
  console.log(`Trust changed: ${data.delta}`)
})
```

### Career Analytics Validation

**Affinity Normalization:**
```typescript
import { getCareerAnalytics } from '@/lib/career-analytics'

const affinities = getCareerAnalytics().analyzeCareerAffinities(playerId)
// All affinities sum to 1.0 (normalized)
const total = Object.values(affinities).reduce((sum, val) => sum + val, 0)
console.assert(Math.abs(total - 1.0) < 0.001, 'Affinities must sum to 1.0')
```

**Confidence Capping:**
```typescript
// Confidence capped at 95% to avoid false certainty
const insights = await getCurrentCareerInsights(playerId)
insights.forEach(insight => {
  console.assert(insight.confidence <= 95, 'Confidence must be ≤ 95%')
})
```

### Simple Analytics Validation

**Engagement Level Calculation:**
```typescript
import { getSimpleAnalytics } from '@/lib/simple-analytics'

const analytics = getSimpleAnalytics().getAnalytics(playerId)
if (!analytics) throw new Error('Analytics not initialized')

// Engagement levels
const { totalChoices, averageResponseTime } = analytics
if (totalChoices > 10 && averageResponseTime > 5000) {
  console.assert(analytics.engagementLevel === 'high')
}
```

---

## Usage Examples

### Example 1: Track Choice with Career Analytics

```typescript
import { analyzeChoiceForCareer } from '@/lib/career-analytics'
import { eventBus } from '@/lib/event-bus'

function handlePlayerChoice(choice: Choice, playerId: string) {
  // Emit event for cross-component communication
  eventBus.emit('game:choice:made', {
    choice,
    timestamp: Date.now(),
    emotionalState: getCurrentEmotion(playerId)
  })

  // Analyze for career implications
  analyzeChoiceForCareer(choice, playerId)

  // Get updated insights
  const insights = await getCurrentCareerInsights(playerId)
  console.log('Career insights:', insights)
}
```

### Example 2: Generate Analytics Snapshot

```typescript
import { getCareerAnalytics } from '@/lib/career-analytics'

// Create snapshot for session end
const snapshot = getCareerAnalytics().createSnapshot(playerId, sessionId)

console.log('Primary affinity:', snapshot.primaryAffinity)
console.log('Secondary affinity:', snapshot.secondaryAffinity)
console.log('Total choices:', snapshot.totalChoices)
console.log('Session duration:', snapshot.sessionDuration)

// Export for external analysis
const exportedData = getCareerAnalytics().exportAnalytics(playerId)
```

### Example 3: Track Engagement with Simple Analytics

```typescript
import { getSimpleAnalytics } from '@/lib/simple-analytics'

// Initialize session
const analytics = getSimpleAnalytics()
analytics.initializeSession(playerId)

// Track choice
analytics.trackChoice(playerId, {
  text: "I'd like to help others",
  consequence: 'helping_pattern',
  responseTime: 3500
})

// Track scene completion
analytics.trackSceneCompletion(playerId, 'maya_introduction')

// Get insights
const insights = analytics.getCareerInsights(playerId)
console.log('Primary interest:', insights?.primaryInterest)
console.log('Birmingham matches:', insights?.birminghamOpportunities.length)
```

### Example 4: Monitor Drop-Off Rates (Admin)

```typescript
import { recordVisit, recordExit, getDropOffRate } from '@/lib/admin-analytics'

// When player enters node
recordVisit('maya_vulnerability_arc')

// When player exits game at node
recordExit('maya_vulnerability_arc')

// Generate heatmap data
const dropOffRate = getDropOffRate('maya_vulnerability_arc')
if (dropOffRate > 0.2) {
  console.warn(`High drop-off rate at node: ${dropOffRate * 100}%`)
}
```

### Example 5: A/B Testing

```typescript
import { ACTIVE_TESTS, assignVariant } from '@/lib/admin-analytics'

// Configure A/B test
ACTIVE_TESTS['dialogue_style_test'] = {
  id: 'dialogue_style_test',
  variants: ['formal', 'casual', 'playful'],
  weights: [0.33, 0.33, 0.34]
}

// Assign variant to user
const variant = assignVariant('dialogue_style_test', playerId)
console.log('User variant:', variant) // "formal" | "casual" | "playful"

// Use variant in dialogue
if (variant === 'casual') {
  showDialogue("Hey! What's up?")
} else if (variant === 'formal') {
  showDialogue("Hello. How may I assist you?")
}
```

### Example 6: Cohort Analysis

```typescript
import { getUserCohort } from '@/lib/admin-analytics'

const gameState = getGameState(playerId)

// Identify user's cohorts
const dailyCohort = getUserCohort(gameState, 'daily') // "2026-01-13"
const patternCohort = getUserCohort(gameState, 'pattern') // "analytical"
const completionCohort = getUserCohort(gameState, 'completion') // "veteran"

// Segment analysis
console.log(`Player belongs to:`)
console.log(`  - Daily cohort: ${dailyCohort}`)
console.log(`  - Pattern cohort: ${patternCohort}`)
console.log(`  - Completion cohort: ${completionCohort}`)
```

### Example 7: Hydrate from Supabase (Simple Career Analytics)

```typescript
import { getSimpleAnalytics } from '@/lib/simple-career-analytics'

// On app mount, hydrate from Supabase
async function initializeApp(userId: string) {
  const analytics = getSimpleAnalytics()

  // Hydrate from Supabase (source of truth)
  const hydrated = await analytics.hydrateFromSupabase(userId)

  if (hydrated) {
    console.log('Loaded analytics from Supabase')
  } else {
    console.log('No existing data, starting fresh session')
  }

  // Get current metrics
  const metrics = analytics.getUserMetrics(userId)
  console.log('Local affinity:', metrics.localAffinity)
}
```

---

## Cross-References

### Related Systems

- **Patterns** - See `03-patterns.md` for pattern definitions used in career mapping
- **Skills** - See `02-skills.md` for skill-to-career associations
- **Characters** - See `04-characters.md` for character dialogue analytics
- **Dialogue System** - See `05-dialogue-system.md` for node visit tracking
- **Knowledge Flags** - See `07-knowledge-flags.md` for arc completion tracking
- **Trust System** - See `08-trust-system.md` for trust change events

### Analytics Integration Points

| System | Analytics Integration | Event Emitted |
|--------|----------------------|---------------|
| Dialogue System | Node visit tracking | `game:dialogue:started`, `game:dialogue:completed` |
| Choice System | Pattern analysis | `game:choice:made`, `game:pattern:discovered` |
| Trust System | Trust delta tracking | `game:trust:changed` |
| Simulation System | Completion metrics | `game:simulation:started`, `game:simulation:completed` |
| Interrupt System | Timing analytics | `game:interrupt:available`, `game:interrupt:taken` |
| Knowledge System | Arc completion | `game:arc:completed`, `game:vulnerability:revealed` |

---

## Design Notes

### Design Philosophy

**1. Multiple Complementary Engines**
- **Event Bus:** Cross-component communication (real-time, synchronous)
- **Career Analytics:** Pattern-to-career mapping (complex, Birmingham-specific)
- **Simple Analytics:** Session tracking (lightweight, privacy-focused)
- **Simple Career Analytics:** Persistent career data (Supabase-synced)
- **Admin Analytics:** Real-time dashboards (drop-off, A/B testing, cohorts)

Each engine serves a distinct purpose without overlap.

**2. Privacy-First Design**
- No personally identifiable information (PII) stored
- All analytics tied to anonymous player IDs
- Local-first storage with optional cloud sync
- Data export for user transparency

**3. Birmingham-Localized Insights**
- All career analytics reference Birmingham organizations
- Local affinity scoring for community connection
- Next steps tied to specific Birmingham opportunities
- Pattern-to-career mapping validated with local market data

**4. Evidence-Based Confidence**
- Confidence capped at 95% to avoid false certainty
- Evidence points limited to top 3 to prevent overwhelm
- Affinity scores normalized to sum to 1.0
- Pattern counts weighted by total choices for fairness

**5. Performance Conscious**
- Event bus with priority handling to prevent blocking
- One-time listeners auto-cleanup to prevent memory leaks
- Supabase sync every 5 updates to reduce API load
- Simple pattern extraction (keyword matching) for speed

### Technical Constraints

**Event Bus Limitations:**
- Events are synchronous (not async-safe for long operations)
- No event replay or history (stateless)
- Priority handling adds complexity to debugging

**Career Analytics Limitations:**
- Pattern mapping is heuristic (not ML-based)
- Birmingham opportunities manually curated (not API-driven)
- Confidence calculation is simple (not Bayesian)
- Limited to 8 career sectors (not exhaustive)

**Supabase Sync Constraints:**
- Eventual consistency (not real-time)
- Requires network connection for sync
- LocalStorage fallback has 5-10MB limit
- Sync queue not persisted across sessions

### Future Considerations

**Phase 1: Enhanced Insights (Q2 2026)**
- Add skill-to-career mapping (integrate with `02-skills.md`)
- Expand Birmingham opportunities to 50+ organizations
- Add confidence intervals to career insights
- Track insight accuracy with follow-up surveys

**Phase 2: Advanced Analytics (Q3 2026)**
- Machine learning for pattern-to-career mapping
- Bayesian confidence scoring
- Real-time opportunity API integration (Birmingham jobs board)
- Sentiment analysis on choice text

**Phase 3: Community Features (Q4 2026)**
- Anonymous cohort comparisons ("Players like you...")
- Peer career path exploration trends
- Birmingham career mentor matching
- Opportunity application tracking

**Phase 4: Research Platform (2027)**
- Export anonymized datasets for career research
- Integrate with Birmingham education programs
- Longitudinal outcome tracking (with consent)
- Career pathway effectiveness studies

### Known Issues

1. **Event Bus Memory Leaks:** Listeners not cleaned up on component unmount in some React components (fixed with `once: true` flag)
2. **Supabase Sync Conflicts:** Race condition when multiple tabs open (mitigated with sync counter)
3. **Pattern Extraction False Positives:** Keyword matching too broad ("building" matches "building trust") - needs refinement
4. **Drop-Off Rate False Negatives:** Exit tracking only fires on explicit quit, not browser close - undercounts actual drop-off

### Testing Strategy

**Unit Tests:**
- Event bus listener priority ordering
- Affinity normalization sums to 1.0
- Engagement level calculations
- Cohort assignment consistency

**Integration Tests:**
- Event emission across components
- Supabase hydration flow
- Career insights generation pipeline
- A/B variant assignment determinism

**End-to-End Tests:**
- Full session analytics snapshot
- Birmingham opportunity matching
- Drop-off heatmap accuracy
- Local affinity scoring progression

---

**Document Control:**
- Location: `/docs/02_REFERENCE/data-dictionary/`
- Related: `03-patterns.md` (pattern definitions), `02-skills.md` (skill associations)
- Status: Manual Documentation (not auto-generated)

**Last Updated:** January 13, 2026
**Next Review:** April 13, 2026 (Quarterly audit)
