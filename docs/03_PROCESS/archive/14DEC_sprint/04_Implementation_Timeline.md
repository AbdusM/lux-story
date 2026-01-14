# Implementation Timeline - 12 Month Content Beast Roadmap

**Date:** December 14, 2024
**Strategic Direction:** Path A - Content Beast Mode
**Timeline:** December 2024 - December 2025
**Goal:** Scale Lux Story from 1 station (11 characters) to 5 stations (55 characters) with transmedia expansion

---

## Timeline Overview

**Month 1 (December 2024):** Core Systems Foundation
- ✅ Week 1-2: Identity Agency System, Pattern Visibility
- 🔄 Week 3: Session Boundaries (IN PROGRESS)
- ⏳ Week 4: Failure Entertainment Paths

**Month 2 (January 2025):** Character Content Multiplication
- Week 5-6: Bring all 11 characters to 35 nodes each
- Week 7: Intersection scenes (proof of concept)
- Week 8: Urban Chamber pilot prep

**Month 3 (February 2025):** Urban Chamber Pilot
- Week 9-10: Run pilot with 16 graduates
- Week 11-12: Data analysis and validation

**Month 4 (March 2025):** Decision Point & Expansion Prep
- Week 13-14: Build based on pilot feedback
- Week 15-16: Station 2 character selection

**Q2 2025 (Apr-Jun):** Station 2 Launch - Innovation Hub
**Q3 2025 (Jul-Sep):** Podcast + Content Ecosystem
**Q4 2025 (Oct-Dec):** Creator Platform + B2B Expansion

---

## Month 1: Core Systems Foundation

### ✅ Week 1-2: Identity Agency System (COMPLETE)

**Delivered:**
- `lib/identity-system.ts` (200 lines)
- `content/samuel-identity-nodes.ts` (650 lines)
- Pattern gain integration (+20% bonus for internalized patterns)
- Build successful, no errors

**Status:** COMPLETE (December 14, 2024)

---

### 🔄 Week 3: Session Boundaries (December 16-22, 2024)

**Goal:** Create natural pause points for mobile UX every 8-12 nodes

#### Tasks

**1. Session Structure Module** (4 hours)
```typescript
// lib/session-structure.ts
export interface SessionBoundary {
  nodeId: string
  sessionNumber: number
  platformAnnouncement: string
  savePrompt: boolean
  durationSinceLastBoundary: number
}

export function identifySessionBoundaries(
  characterId: string,
  dialogueGraph: DialogueNode[]
): SessionBoundary[] {
  // Mark every 10th node as session boundary
  // Generate platform announcements
  // Return boundary configuration
}
```

**2. Platform Announcements** (6 hours)
Write 21 atmospheric station announcements:
- 7 time-based: "The 7:15 to Crossroads Station..."
- 7 weather-based: "Fog advisories in effect for Platform 3..."
- 7 poetic: "All paths lead somewhere. Not all somewheres lead home."

**3. Mark Boundary Nodes** (4 hours)
Update all 11 character dialogue graphs:
```typescript
// Example: samuel-dialogue-graph.ts
{
  nodeId: 'samuel_intro_10',
  speaker: 'Samuel Washington',
  content: [...],
  choices: [...],
  metadata: {
    sessionBoundary: true,
    platformAnnouncement: "The 7:15 to Crossroads Station will depart shortly."
  }
}
```

**4. UI Integration** (2 hours)
```typescript
// components/PlatformAnnouncement.tsx
export function PlatformAnnouncement({ announcement }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-muted/50 border-l-4 border-primary p-4 mb-6"
    >
      <p className="text-sm text-muted-foreground italic">
        {announcement}
      </p>
    </motion.div>
  )
}
```

**5. Auto-Save on Boundary** (2 hours)
```typescript
// In StatefulGameInterface.tsx
useEffect(() => {
  const currentNode = getCurrentNode()
  if (currentNode.metadata?.sessionBoundary) {
    saveGameState(gameState)
    trackSessionBoundary(currentNode.nodeId, sessionDuration)
  }
}, [gameState.currentNodeId])
```

**6. Mobile Testing** (2 hours)
- Test on iPhone 12/13/14
- Verify session boundaries appear correctly
- Check auto-save works
- Measure session durations (target: 10-15 min per boundary)

**Deliverable:** Session boundaries system live, 21 platform announcements, all characters marked

**Time Budget:** 20 hours (2.5 days)

---

### ⏳ Week 4: Failure Entertainment Paths (December 23-29, 2024)

**Goal:** Ensure no player hits locked content; low-pattern players get alternative branches

#### Tasks

**1. Audit Gated Choices** (8 hours)
```bash
# Find all trust/pattern-gated choices across 11 characters
grep -r "requiredTrust" content/*-dialogue-graph.ts
grep -r "requiredPattern" content/*-dialogue-graph.ts

# Expected: ~30-40 gated choices across all characters
```

**Output:** Spreadsheet of all gated content:
| Character | Node ID | Gate Type | Requirement | Alternative Exists? |
|-----------|---------|-----------|-------------|---------------------|
| Maya | maya_crossroads_5 | trust ≥5 | Continue arc | ❌ NEEDS ALT |
| Devon | devon_challenge_3 | analytical ≥4 | Deep tech talk | ✅ Has alt |

**2. Design Alternative Branches** (12 hours)
For top 20 gated choices, create alternative paths:

**Example: Maya's Trust Gate (Node 20)**
```typescript
// BEFORE: Dead end if trust <5
{
  nodeId: 'maya_crossroads_5',
  choices: [
    {
      text: 'Tell me about the hardest decision you ever made',
      requiredTrust: 5,
      nextNodeId: 'maya_challenge_1'
    }
  ]
}

// AFTER: Alternative branch if trust <5
{
  nodeId: 'maya_crossroads_5',
  choices: [
    {
      text: 'Tell me about the hardest decision you ever made',
      requiredTrust: 5,
      nextNodeId: 'maya_challenge_1'
    },
    {
      text: '[Say nothing, let her think]',
      requiredTrust: 0,  // Always available
      nextNodeId: 'maya_low_trust_branch_1',
      pattern: 'patience'
    }
  ]
}

// New low-trust branch (5 nodes)
{
  nodeId: 'maya_low_trust_branch_1',
  speaker: 'Maya Chen',
  content: [{
    text: "You know what? I don't really know you that well yet. Maybe another time."
  }],
  choices: [{
    text: 'That's fair. Want to talk about something else?',
    nextNodeId: 'maya_surface_topic_1',
    trustChange: 1  // Build trust through patience
  }]
}
```

**3. Implement Alternative Nodes** (8 hours)
- Write 5-8 nodes per alternative branch
- Focus on building trust through alternative path
- Eventually loops back to main arc

**4. Testing Low-Pattern Playthrough** (4 hours)
- Create test gameState with all patterns at 1
- Verify player can progress through each character
- Check that no "dead ends" exist

**Deliverable:** Top 20 gated choices have entertaining alternatives; no player hits locked content

**Time Budget:** 32 hours (4 days)

---

## Month 2: Character Content Multiplication (January 2025)

### Week 5-6: Character Content Expansion (January 6-19, 2025)

**Goal:** Bring all 11 characters from current state to 35 nodes each

**Current State:**
- Samuel: 270 nodes (DONE)
- Maya: 45 nodes → Need 0 (complete arc exists)
- Devon: 38 nodes → Need 0 (complete arc exists)
- Marcus: 25 nodes → Need 10
- Rohan: 22 nodes → Need 13
- Yaquin: 20 nodes → Need 15
- Jordan: 15 nodes → Need 20
- Kai: 12 nodes → Need 23
- Lira: 8 nodes → Need 27
- Asha: 8 nodes → Need 27
- Zara: 7 nodes → Need 28

**Total Nodes to Create: 163 nodes**

#### AI-Assisted Pipeline Schedule

**Week 5 (January 6-12):**

**Monday-Tuesday: Marcus (10 nodes)**
- Interview Birmingham healthcare administrator
- AI extraction + human review
- Focus: Healthcare systems, making care accessible

**Wednesday-Thursday: Rohan (13 nodes)**
- Interview philosopher or counselor
- AI extraction + human review
- Focus: Introspection, meaning-making

**Friday: Yaquin (15 nodes - start)**
- Interview gentle professional (librarian, archivist, conservationist)
- AI extraction
- Human review carries to weekend

**Time Budget:** 40 hours (1 week)

**Week 6 (January 13-19):**

**Monday: Yaquin (15 nodes - finish)**
- Complete human review
- Integration testing

**Tuesday-Wednesday: Jordan (20 nodes)**
- Interview community organizer
- AI extraction + human review
- Focus: Grassroots organizing, collective action

**Thursday-Friday: Kai (23 nodes - start)**
- Interview industrial/manufacturing professional
- AI extraction
- Human review

**Weekend carryover: Kai finish**

**Time Budget:** 40 hours (1 week)

**Remaining Characters (Lira, Asha, Zara):**
- Complete in Week 7 if time allows
- OR defer to Month 2 Week 2 if pilot prep takes priority

---

### Week 7: Intersection Scenes (January 20-26, 2025)

**Goal:** Build 2-3 intersection scenes as proof of concept for character crossovers

#### Intersection Candidates

**1. Maya + Devon: Biomedical Engineering** (8 nodes)
- Trigger: Trust ≥5 with both
- Devon shows Maya his surgical robot prototype
- Maya provides medical perspective
- Career insight: Health tech, biomedical engineering

**2. Marcus + Maya: Healthcare Systems** (8 nodes)
- Trigger: Trust ≥5 with both
- Marcus talks about healthcare administration
- Maya sees "doctor" isn't the only way to help patients
- Career insight: Healthcare policy, administration

**3. Jordan + Rohan: Philosophy in Action** (8 nodes)
- Trigger: Trust ≥5 with both
- Jordan's organizing work meets Rohan's philosophy
- Discussion: Theory vs practice
- Career insight: Applied ethics, social philosophy

**Implementation:**
```typescript
// lib/intersection-system.ts
export function checkIntersectionTriggers(gameState: GameState): string | null {
  const mayaTrust = getCharacterTrust(gameState, 'maya')
  const devonTrust = getCharacterTrust(gameState, 'devon')

  if (mayaTrust >= 5 && devonTrust >= 5 && !hasSeenIntersection(gameState, 'maya_devon')) {
    return 'intersection_maya_devon_1'
  }

  // Check other intersection triggers...

  return null
}
```

**Deliverable:** 3 intersection scenes live, tested, integrated

**Time Budget:** 20 hours (2.5 days)

---

### Week 8: Urban Chamber Pilot Prep (January 27 - February 2, 2025)

**Goal:** Polish game for professional validation, prepare admin dashboard

#### Tasks

**1. Career Framing Layer** (8 hours)
```typescript
// lib/career-insights.ts
export interface CareerCluster {
  name: string
  careers: string[]
  matchScore: number  // 0-100
  dominantPatterns: PatternType[]
}

export function generateCareerClusters(patterns: PlayerPatterns): CareerCluster[] {
  // Algorithm:
  // - Identify top 2 dominant patterns
  // - Map to career clusters
  // - Return ranked list

  if (patterns.helping > 5 && patterns.patience > 4) {
    return [{
      name: 'Healthcare & Caring Professions',
      careers: ['Nursing', 'Therapy', 'Social Work', 'Teaching'],
      matchScore: 85,
      dominantPatterns: ['helping', 'patience']
    }]
  }

  // ... more mappings
}
```

**2. Journey Summary Enhancement** (6 hours)
```typescript
// components/JourneySummary.tsx
export function JourneySummary({ gameState }: Props) {
  const careerClusters = generateCareerClusters(gameState.patterns)

  return (
    <div className="space-y-6">
      <PatternDistribution patterns={gameState.patterns} />

      <section>
        <h3>Career Paths to Explore</h3>
        {careerClusters.map(cluster => (
          <CareerClusterCard key={cluster.name} cluster={cluster} />
        ))}
      </section>

      <ShareButton gameState={gameState} />
    </div>
  )
}
```

**3. Admin Dashboard (Minimal)** (12 hours)
```typescript
// app/admin/cohorts/[cohortId]/page.tsx
export default function CohortDashboard({ params }: Props) {
  const students = useCohortStudents(params.cohortId)

  return (
    <div className="p-8">
      <h1>Urban Chamber Cohort - February 2025</h1>

      <MetricCard label="Completion Rate" value="73%" />
      <MetricCard label="Avg Session Duration" value="12 min" />

      <PatternDistributionChart data={students} />

      <StudentTable students={students} />

      <ExportCSVButton cohortId={params.cohortId} />
    </div>
  )
}
```

**4. Mobile Polish** (6 hours)
- Performance audit (Lighthouse score 90+)
- Touch target sizes (min 44px)
- Loading skeletons for dialogue
- Offline capability verification

**5. Beta Testing** (8 hours)
- Recruit 3 beta testers
- Have them complete 1 full character arc
- Gather feedback on clarity, engagement, mobile UX
- Fix critical issues

**Deliverable:** Game ready for Urban Chamber pilot, minimal admin dashboard

**Time Budget:** 40 hours (1 week)

---

## Month 3: Urban Chamber Pilot (February 2025)

### Week 9-10: Run Pilot (February 3-16, 2025)

**Goal:** 16 Birmingham Urban Chamber graduates play Lux Story, gather data

#### Week 9: Launch & Monitor

**Monday (Feb 3): Kickoff**
- Email Anthony: Send access links to 16 students
- Brief intro video (2 min): "What is Lux Story, how to play"
- Slack channel for questions/feedback

**Tuesday-Friday: Monitor**
- PostHog dashboard: Track engagement
- Daily check-ins: Any blockers?
- Fix critical bugs within 24 hours

**Key Metrics to Watch:**
- Start rate (target: >80%)
- First session completion (target: >70%)
- Return rate day 2-3 (target: >50%)

#### Week 10: Support & Gather Feedback

**Monday-Wednesday: Continued Monitoring**
- Students should be in Act 2-3 by now
- Watch for drop-off points
- Note which characters are most popular

**Thursday: Mid-Pilot Survey** (Optional)
```
Quick 3-minute survey:
1. How's your experience so far? (1-5 stars)
2. Which character are you connecting with most?
3. Are you discovering career insights?
4. Any bugs or confusion?
```

**Friday: Final Push**
- Remind students to complete at least 1 character arc
- Offer incentive: "First 10 to complete get early access to Station 2"

**Deliverable:** Pilot running smoothly, initial data collected

**Time Budget:** Monitoring (2 hours/day × 10 days = 20 hours)

---

### Week 11-12: Data Analysis & Decision (February 17 - March 2, 2025)

**Goal:** Analyze pilot data, decide if career framing resonates

#### Week 11: Quantitative Analysis

**Metrics to Analyze:**

**Engagement:**
```sql
-- PostHog queries
SELECT
  user_id,
  COUNT(DISTINCT session_id) as session_count,
  AVG(session_duration_minutes) as avg_session,
  MAX(node_count) as furthest_node,
  CASE WHEN MAX(node_count) >= 35 THEN 1 ELSE 0 END as completed_arc
FROM lux_story_events
WHERE cohort_id = 'urban_chamber_feb_2025'
GROUP BY user_id
```

**Expected Results:**
- Completion rate: 70%+ complete at least 1 arc
- Avg session duration: 10-15 minutes
- Return rate: 60%+ return for session 2

**Pattern Distribution:**
```sql
-- Are all 5 patterns being earned?
SELECT
  pattern_type,
  AVG(pattern_level) as avg_level,
  COUNT(DISTINCT user_id) as users_with_pattern
FROM pattern_events
WHERE cohort_id = 'urban_chamber_feb_2025'
GROUP BY pattern_type
```

**Character Popularity:**
```sql
-- Which characters resonated most?
SELECT
  character_id,
  COUNT(DISTINCT user_id) as users_engaged,
  AVG(trust_level) as avg_trust,
  COUNT(CASE WHEN arc_completed THEN 1 END) as completions
FROM character_interactions
WHERE cohort_id = 'urban_chamber_feb_2025'
GROUP BY character_id
ORDER BY users_engaged DESC
```

#### Week 12: Qualitative Analysis

**Exit Interviews** (8 students, 30 min each = 4 hours)

**Questions:**
1. Did this help you explore career paths?
2. Which character resonated most? Why?
3. Did you discover any career interests you didn't have before?
4. Would you recommend this to other students?
5. What would make this more useful for career exploration?

**Analysis:**
- Transcribe interviews
- Look for patterns in responses
- Identify career clusters that resonated
- Note character arcs that landed vs fell flat

**Decision Framework:**

**If 70%+ say "yes, this helped career exploration":**
→ **Dual positioning** (game + career tool)
→ Build B2B package (Month 4)
→ Pursue more Urban Chamber partnerships

**If 40-69% say "yes":**
→ **Game-first, career-secondary**
→ Keep career framing but don't over-invest in B2B
→ Focus on game launch (Steam, itch.io)

**If <40% say "yes":**
→ **Pure game**
→ Drop career framing entirely
→ Full indie game marketing

**Deliverable:** Data-driven decision on B2B viability, detailed pilot report

**Time Budget:** 40 hours (1 week)

---

## Month 4: Decision Point & Expansion (March 2025)

### If B2B Validated (Path 4A): Build B2B Package

**Week 13-14: B2B Infrastructure** (March 3-16, 2025)

**1. Admin Dashboard Expansion** (16 hours)
- Cohort creation flow
- Student invitation system
- Real-time engagement dashboard
- Career cluster reporting
- CSV export for educators

**2. Educator Guide** (8 hours)
- How to use Lux Story in workforce development
- Facilitation prompts for group discussions
- Career cluster interpretation guide
- Case studies from pilot

**3. Packaging & Pricing** (8 hours)
- Create tiered pricing:
  - Pilot ($5,000 for up to 20 students)
  - Standard ($10,000 for up to 50 students)
  - Enterprise (custom pricing for 100+ students)
- Terms of service
- Data privacy agreements (FERPA compliance)

**4. Sales Materials** (8 hours)
- One-pager for workforce development orgs
- Pilot results deck
- Demo video (3 min)
- ROI calculator

**Week 15-16: Outreach & Station 2 Prep** (March 17-30, 2025)

**1. Urban Chamber Expansion** (12 hours)
- Reach out to 10 other Urban Chamber chapters
- Target cities: Atlanta, Charlotte, Nashville, Memphis, New Orleans
- Pitch: "Birmingham pilot had 73% completion, students discovered career paths"

**2. Workforce Development Orgs** (12 hours)
- YearUp, Per Scholas, NPower, etc.
- Email campaign + follow-ups
- Goal: 2-3 pilot commitments for Q2

**3. Station 2 Character Selection** (16 hours)
- Identify 11 professionals for Innovation Hub station
- Target careers: AI/ML engineer, biomedical engineer, UX designer, product manager, data scientist, etc.
- Schedule interviews for April

---

### If Pure Game (Path 4B): Polish & Launch Prep

**Week 13-14: Journey Summary 2.0** (March 3-16, 2025)

**1. Shareable Narrative Cards** (12 hours)
```typescript
// components/ShareableJourneyCard.tsx
export function ShareableJourneyCard({ gameState }: Props) {
  const dominantPattern = getDominantPattern(gameState.patterns)
  const archetype = getArchetype(gameState.patterns)

  return (
    <motion.div className="w-[600px] h-[800px] bg-gradient-to-br from-primary to-secondary p-8">
      <h1>{archetype}</h1>
      <p>"{getArchetypeQuote(archetype)}"</p>

      <PatternVisualization patterns={gameState.patterns} />

      <p className="text-sm">Created in Lux Story - Grand Central Terminus</p>
    </motion.div>
  )
}
```

**2. "The Path You Didn't Take" FOMO Hook** (8 hours)
```typescript
// Show players which choices they ALMOST made
// Example: "87% of players chose to help Maya. You chose to analyze the situation instead."
```

**3. Social Sharing** (8 hours)
- Twitter/X card meta tags
- Download as image
- "Share your journey" prompt at arc completion

**4. New Game+ Preview** (12 hours)
- After completing 3 characters, unlock NG+ teaser
- Show what changes on second playthrough
- Hint at intersection scenes

**Week 15-16: Launch Polish** (March 17-30, 2025)

**1. Performance Optimization** (12 hours)
- Code splitting by character
- Image optimization (avatars, backgrounds)
- Lighthouse score 95+

**2. Accessibility Audit** (8 hours)
- Screen reader testing
- Keyboard navigation
- Color contrast (WCAG AA)

**3. Itch.io Launch** (12 hours)
- Create itch.io page
- Free to play (build audience)
- "Pay what you want" option
- Embedded game + standalone build

**4. Steam Page Setup** (8 hours)
- Create Steam store page
- Screenshots, trailer (reuse demo video)
- Target launch: Q2 2025
- Price: $9.99

---

## Q2 2025: Station 2 Launch - Innovation Hub (April-June)

### April: Station 2 Content Creation

**Goal:** 11 new characters × 35 nodes = 385 new nodes

**Week 1-2: Interviews** (16 hours)
- Interview 11 professionals in tech/innovation careers
- Focus: Birmingham tech scene, UAB research, Southern tech orgs

**Suggested Characters:**
1. AI/ML Engineer (analytical + building)
2. Biomedical Engineer (analytical + helping)
3. UX Designer (exploring + helping)
4. Product Manager (building + exploring)
5. Data Scientist (analytical + patience)
6. Robotics Engineer (building + analytical)
7. Cybersecurity Specialist (analytical + patience)
8. Environmental Scientist (exploring + helping)
9. Game Developer (building + exploring)
10. Startup Founder (building + patience)
11. Science Communicator (exploring + helping)

**Week 3-4: AI Pipeline** (40 hours)
- Run all 11 interviews through pipeline
- Parallel processing: 2-3 arcs per day
- Human review for all 11 characters
- Integration testing

**Week 5-6: Intersection Scenes** (20 hours)
- Build 5 intersection scenes between Station 1 ↔ Station 2 characters
- Example: Devon (robotics, Station 1) + Biomedical Engineer (Station 2)

**Deliverable:** Station 2 complete with 11 characters, 385 nodes, 5 intersections

---

### May: Station 2 Launch & Marketing

**Week 1: Polish & QA** (20 hours)
- Test all 11 character arcs end-to-end
- Fix bugs
- Mobile testing
- Final accessibility check

**Week 2: Launch Prep** (20 hours)
- Create Station 2 trailer (2 min)
- Update Steam page
- Write launch announcement
- Email list: "Station 2 Innovation Hub launches May 15"

**Week 3-4: Launch & Monitor** (20 hours)
- May 15: Station 2 goes live
- Price: $9.99 DLC or bundled with Station 1 for $14.99
- Monitor engagement
- Fix critical issues within 24 hours
- Gather feedback

**Revenue Target:** 100 purchases × $9.99 = $1,000 in Month 1

---

### June: Podcast Prep

**Goal:** Launch "Lux Story: The Podcast" in Q3

**Podcast Concept:**
- Interview the REAL professionals behind the characters
- 30-45 min episodes
- Format: "You met Maya in the game. Now meet the real surgeon who inspired her."

**June Tasks:**

**Week 1-2: Podcast Setup** (20 hours)
- Audio equipment (mic, interface)
- Recording/editing software (Riverside.fm, Descript)
- Podcast hosting (Transistor.fm - $19/month)
- Artwork, intro music

**Week 3-4: Record Pilot Episodes** (20 hours)
- Record 3 pilot episodes:
  - Episode 1: Maya (surgeon)
  - Episode 2: Devon (robotics engineer)
  - Episode 3: Samuel (wisdom/mentorship)
- Edit episodes
- Create show notes

**Deliverable:** 3 podcast episodes ready for Q3 launch

---

## Q3 2025: Podcast Launch & Content Ecosystem (July-September)

### July: Podcast Launch

**Week 1: Launch Podcast** (10 hours)
- Publish first 3 episodes
- Submit to Apple Podcasts, Spotify, YouTube
- Promote on social media
- Email list announcement

**Week 2-4: Weekly Episodes** (30 hours)
- Record, edit, publish 3 more episodes
- Total: 6 episodes by end of July

**Revenue Strategy:**
- Sponsorships: Reach out to career development platforms (LinkedIn Learning, Coursera, etc.)
- Target: $2,000-5,000 per episode sponsor (start lower, scale up)

---

### August: Station 3 Content Creation

**Goal:** 11 characters × 35 nodes = 385 nodes

**Focus:** Healthcare careers (expand on Maya, Marcus)

**Suggested Characters:**
1. Surgeon (cardiothoracic)
2. Nurse Practitioner
3. Physical Therapist
4. Public Health Specialist
5. Medical Researcher
6. Hospital Administrator
7. Mental Health Counselor
8. Paramedic/EMT
9. Pharmacist
10. Health Informatics Specialist
11. Community Health Worker

**Timeline:**
- Week 1-2: Interviews (16 hours)
- Week 3-4: AI pipeline + human review (40 hours)

---

### September: Station 3 Launch

**Week 1-2: Polish & QA** (20 hours)
**Week 3: Launch** (10 hours)
- Station 3 DLC: $9.99
- Bundle: All 3 stations $24.99

**Week 4: Podcast Episodes** (10 hours)
- Continue weekly podcast (12 episodes total by end of Q3)

**Revenue Target (Q3):**
- Podcast sponsors: $5,000 × 8 episodes = $40,000
- Station 2 sales: 200 × $9.99 = $2,000
- Station 3 sales: 150 × $9.99 = $1,500
- B2B pilots: 2-3 × $5-10K = $10-30K
- **Q3 Total: $53,500-$73,500**

---

## Q4 2025: Creator Platform & B2B Expansion (October-December)

### October: Creator Platform MVP

**Goal:** Let external creators build character arcs using Lux Story Studio

**Week 1-2: Sanity Studio Setup** (40 hours)
- Configure Sanity CMS
- Custom dialogue graph editor plugin
- Creator onboarding flow

**Week 3-4: Marketplace UI** (40 hours)
- Browse creator arcs
- Purchase flow (Stripe integration)
- Revenue sharing (70/30 split)
- Quality review system

**Deliverable:** Lux Story Studio live, first 5 beta creators onboarded

---

### November: Station 4 + Creator Arcs

**Week 1-2: Station 4 Content** (Trades careers)
- Interview 11 professionals (electrician, plumber, carpenter, HVAC, etc.)
- AI pipeline + human review

**Week 3-4: Launch Station 4 + First Creator Arcs**
- Station 4 DLC: $9.99
- First 10 creator arcs available in marketplace
- Promote: "Community-created content now available"

---

### December: B2B Expansion & Year-End Push

**Goal:** 10 B2B partnerships secured

**Week 1-2: B2B Outreach**
- Urban Chamber expansion: 5 new cities
- Workforce orgs: YearUp, Per Scholas, NPower
- Community colleges: Partner with career services

**Week 3-4: Station 5 Prep + Retrospective**
- Station 5 character selection (creative industries: writer, designer, filmmaker, etc.)
- Year-end review: What worked, what didn't
- Plan for Year 2

**Revenue Target (Q4):**
- Podcast sponsors: $5,000 × 8 episodes = $40,000
- Station 4 sales: 150 × $9.99 = $1,500
- Creator marketplace: 20 arcs × $4.99 avg × 50 sales = $5,000
- B2B pilots: 5-10 × $5-10K = $25-100K
- **Q4 Total: $71,500-$146,500**

---

## Year 1 Revenue Summary

| Quarter | Revenue Streams | Low Estimate | High Estimate |
|---------|----------------|--------------|---------------|
| **Q1** | Urban Chamber pilot | $5,000 | $10,000 |
| **Q2** | Station 2 sales, B2B pilots | $10,000 | $20,000 |
| **Q3** | Podcast sponsors, Station 3, B2B | $53,500 | $73,500 |
| **Q4** | Station 4, Creator platform, B2B expansion | $71,500 | $146,500 |
| **Total** | | **$140,000** | **$250,000** |

**Infrastructure Costs:** $3,000-5,000/year

**Net Revenue:** $135,000-$245,000

---

## Success Metrics by Quarter

### Q1 2025
- ✅ Identity system live
- ✅ Session boundaries implemented
- ✅ 11 characters at 35 nodes each (385 total)
- ✅ Urban Chamber pilot: 70%+ completion rate
- ✅ Decision made: B2B viable or pure game

### Q2 2025
- Station 2 live (11 characters, 385 nodes)
- 100+ Station 2 sales
- Podcast: 3 episodes recorded
- 2-3 B2B pilots secured

### Q3 2025
- Podcast: 12 episodes published, 1+ sponsor
- Station 3 live (11 characters, 385 nodes)
- B2B: 5 active partnerships
- Revenue: $50K+

### Q4 2025
- Creator platform live
- 10+ community-created arcs
- Station 4 live (11 characters, 385 nodes)
- B2B: 10 active partnerships
- Revenue: $135K+ cumulative

---

## Risk Mitigation

### Risk 1: Urban Chamber Pilot Fails
**Likelihood:** Low (30%)
**Impact:** High (changes strategic direction)

**Mitigation:**
- Have pure game launch plan ready (Path 4B)
- Itch.io launch doesn't require B2B validation
- Pivot quickly if data shows <40% career resonance

---

### Risk 2: AI Content Quality Issues
**Likelihood:** Medium (50%)
**Impact:** Medium (delays content creation)

**Mitigation:**
- Human review is mandatory (90 min per arc)
- Quality rubric: 3+ score in all categories
- Playtesting with beta users before production

---

### Risk 3: Content Creation Burnout
**Likelihood:** Medium (40%)
**Impact:** High (delays station launches)

**Mitigation:**
- AI pipeline reduces 7 hours → 2.5 hours (64% faster)
- Hire freelance narrative designer for Station 3-5 (Q3-Q4)
- Creator platform offloads content creation (Q4)

---

### Risk 4: B2B Sales Slower Than Expected
**Likelihood:** High (60%)
**Impact:** Medium (revenue miss)

**Mitigation:**
- Dual revenue streams (B2B + game sales + podcast)
- Start podcast sponsorship outreach in Q2 (before needing revenue in Q3)
- Creator platform provides passive income (Q4)

---

## Weekly Time Budget (Months 1-4)

**Month 1:**
- Week 1-2: ✅ COMPLETE (Identity system)
- Week 3: 20 hours (Session boundaries)
- Week 4: 32 hours (Failure paths)

**Month 2:**
- Week 5-6: 40 hours each (Character content)
- Week 7: 20 hours (Intersections)
- Week 8: 40 hours (Pilot prep)

**Month 3:**
- Week 9-10: 20 hours (Monitoring pilot)
- Week 11-12: 40 hours (Analysis & decision)

**Month 4:**
- Week 13-14: 40 hours (B2B package OR game polish)
- Week 15-16: 40 hours (Outreach OR launch prep)

**Total Hours (Months 1-4): 332 hours**

**At 40 hours/week:** ~8 weeks of full-time work

**Realistic Timeline:** 16 weeks (part-time while running OrbDoc)

---

## Next Immediate Actions (This Week)

**Today (December 14):**
- [ ] Email Anthony: Confirm February pilot, secure $5-10K commitment
- [ ] Create session boundaries module (`lib/session-structure.ts`)

**This Week:**
- [ ] Write 21 platform announcements
- [ ] Mark session boundary nodes across all characters
- [ ] Test session boundaries on mobile

**Next Week:**
- [ ] Begin failure path audit (find gated choices)
- [ ] Design top 20 alternative branches

---

*"Ship fast. Gather data. Decide with evidence, not assumptions."*
