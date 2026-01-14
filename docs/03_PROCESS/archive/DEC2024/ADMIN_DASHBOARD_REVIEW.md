# Admin Dashboard Review & Cohort Analytics Design
**Date:** December 14, 2024
**Purpose:** Urban Chamber Pilot B2B Requirements

---

## Current State: Individual Student Analytics

### Existing Dashboard Pages

| Page | URL | Purpose | Status |
|------|-----|---------|--------|
| Student List | `/admin` | Browse all students, filter by pattern | ✅ Working |
| Student Detail | `/admin/[userId]` | Individual student deep dive | ✅ Working |
| Urgency Analysis | `/admin/[userId]/urgency` | Student needs assessment | ✅ Working |
| Career Discovery | `/admin/[userId]/careers` | Individual career matches | ✅ Working |
| Pattern Analysis | `/admin/[userId]/patterns` | Choice pattern breakdown | ✅ Working |
| Skills Analysis | `/admin/[userId]/skills` | Skill demonstrations | ✅ Working |
| Evidence Timeline | `/admin/[userId]/evidence` | Key skill moments | ✅ Working |
| Skill Gaps | `/admin/[userId]/gaps` | Missing skill areas | ✅ Working |
| Action Recommendations | `/admin/[userId]/action` | Next steps for student | ✅ Working |

### Existing Components

| Component | File | Purpose | Status |
|-----------|------|---------|--------|
| ExportButton | `components/admin/ExportButton.tsx` | PDF export for individual student | ✅ Works (single student) |
| ChoicePatternBar | `components/admin/ChoicePatternBar.tsx` | Visual pattern distribution | ✅ Reusable for cohort |
| CharacterRelationshipCard | `components/admin/CharacterRelationshipCard.tsx` | Trust level display | ✅ Individual only |
| CareerDiscoveryCard | `components/admin/CareerDiscoveryCard.tsx` | Career matches | ✅ Individual only |
| SkillsAnalysisCard | `components/admin/SkillsAnalysisCard.tsx` | Skill profile | ✅ Individual only |
| BreakthroughTimeline | `components/admin/BreakthroughTimeline.tsx` | Key moments | ✅ Individual only |
| EvidenceTimeline | `components/admin/EvidenceTimeline.tsx` | Skill evidence | ✅ Individual only |
| SkillGapsAnalysis | `components/admin/SkillGapsAnalysis.tsx` | Gap identification | ✅ Individual only |
| AdminDashboardContext | `components/admin/AdminDashboardContext.tsx` | State management | ✅ Context provider |

---

## Data Available Per Student

From `lib/types/student-insights.ts`:

```typescript
interface StudentInsights {
  userId: string                              // Unique identifier
  lastActive: number                          // Timestamp
  currentScene: string                        // Current location in story

  choicePatterns: {
    helping: number                           // % of helping choices
    analytical: number                        // % of analytical choices
    patience: number                          // % of patience choices
    exploring: number                         // % of exploring choices
    building: number                          // % of building choices
    dominantPattern: string                   // Top pattern name
    consistency: 'consistent' | 'varied' | 'random'
    totalChoices: number                      // Total choices made
  }

  characterRelationships: Array<{
    characterName: 'Maya Chen' | 'Devon Kumar' | 'Jordan Packard'
    trustLevel: number                        // 0-10
    met: boolean
    metTimestamp?: number
    vulnerabilityShared?: string
    studentHelped?: string
    currentStatus: string
  }>

  breakthroughMoments: Array<{
    type: 'vulnerability' | 'decision' | 'personal_sharing' | 'mutual_recognition'
    characterName?: string
    quote: string
    studentResponse?: string
    timestamp: number
    scene: string
  }>

  careerDiscovery: {
    topMatch: { name: string; confidence: number }
    secondMatch?: { name: string; confidence: number }
    birminghamOpportunities: string[]         // Local career paths
    decisionStyle: string
  }

  skillGaps: SkillGap[]
  keySkillMoments: KeySkillMoment[]
  totalDemonstrations: number
  skillEvolution: SkillEvolutionPoint[]
}
```

---

## Gap Analysis: What's Missing for B2B Educators

### Critical Gap: Cohort-Level Analytics

**Problem:** Educators (like Anthony at Urban Chamber) need to:
1. See aggregate trends across all 16 graduates
2. Export cohort data for reporting to funders
3. Compare cohort performance to identify outliers
4. Understand which career paths are resonating

**Current State:** Dashboard only shows individual students. No aggregate view.

**Impact:** Cannot answer questions like:
- "What % of my cohort is 'helping' dominant?"
- "Which Birmingham careers are students exploring most?"
- "What's the average trust level with Maya across all students?"
- "How many students completed Devon's arc?"

---

### Critical Gap: CSV Export for Cohort

**Problem:** Educators need to export cohort data for:
- Quarterly reports to Urban League
- Grant applications showing impact
- Sharing insights with career counselors
- Tracking cohort trends over time

**Current State:** PDF export exists but only for individual students.

**Impact:** Anthony has to manually screenshot 16 individual profiles. Not scalable.

---

### Nice-to-Have: Cohort Comparison

**Problem:** Compare multiple cohorts (e.g., Fall 2024 vs Spring 2025) to identify:
- Which cohort engaged more deeply
- Pattern distribution differences
- Career discovery trends

**Current State:** No cohort grouping concept exists.

**Impact:** Cannot track longitudinal trends or compare pilot effectiveness.

---

## Cohort Analytics Design

### New Page: `/admin/cohort`

**Purpose:** Aggregate analytics for all students or filtered cohorts

**Key Sections:**

#### 1. Cohort Overview Card
```
┌─────────────────────────────────────────────┐
│ Cohort Overview                             │
│ ─────────────────────────────────────────── │
│ Total Students: 16                          │
│ Active (last 7 days): 12                    │
│ Avg Choices per Student: 24.5               │
│ Avg Scenes Visited: 8.2                     │
│ Character Arcs Started: Maya (16), Devon (8)│
└─────────────────────────────────────────────┘
```

**Data Sources:**
- Count of `students.length`
- Filter `lastActive` within 7 days
- Average `choicePatterns.totalChoices`
- Average unique scenes from `currentScene` and arc completion
- Character engagement from `characterRelationships.met`

---

#### 2. Pattern Distribution Chart
```
┌─────────────────────────────────────────────┐
│ Choice Pattern Distribution                 │
│ ─────────────────────────────────────────── │
│ [Pie Chart or Bar Chart]                    │
│                                             │
│ Helping:    6 students (38%)                │
│ Analytical: 5 students (31%)                │
│ Exploring:  3 students (19%)                │
│ Building:   2 students (12%)                │
│ Patience:   0 students (0%)                 │
└─────────────────────────────────────────────┘
```

**Component:** Use existing `ChoicePatternBar` but aggregate across students.

**Algorithm:**
```typescript
// For each student, identify dominant pattern
const patternCounts = students.reduce((acc, student) => {
  const patterns = [
    { name: 'helping', value: student.choicePatterns.helping },
    { name: 'analytical', value: student.choicePatterns.analytical },
    // ... etc
  ].sort((a, b) => b.value - a.value)

  const dominant = patterns[0].name
  acc[dominant] = (acc[dominant] || 0) + 1
  return acc
}, {} as Record<string, number>)
```

---

#### 3. Career Discovery Trends
```
┌─────────────────────────────────────────────┐
│ Career Paths Explored                       │
│ ─────────────────────────────────────────── │
│ Healthcare: 8 students                      │
│ Technology: 6 students                      │
│ Community Work: 4 students                  │
│ Engineering: 3 students                     │
│                                             │
│ Top Birmingham Opportunities:               │
│ 1. UAB Medical (8 students)                 │
│ 2. Innovation Depot (5 students)            │
│ 3. Children's of Alabama (4 students)       │
└─────────────────────────────────────────────┘
```

**Data Source:**
- `careerDiscovery.topMatch.name` (categorize by sector)
- `careerDiscovery.birminghamOpportunities` (aggregate occurrences)

**Algorithm:**
```typescript
// Career sectors
const careerSectors = students.map(s => s.careerDiscovery.topMatch.name)
const sectorCounts = careerSectors.reduce((acc, career) => {
  const sector = categorizeCareer(career) // "Healthcare", "Tech", etc.
  acc[sector] = (acc[sector] || 0) + 1
  return acc
}, {})

// Birmingham opportunities
const allOpportunities = students.flatMap(s => s.careerDiscovery.birminghamOpportunities)
const oppCounts = allOpportunities.reduce((acc, opp) => {
  acc[opp] = (acc[opp] || 0) + 1
  return acc
}, {})
```

---

#### 4. Character Engagement Matrix
```
┌─────────────────────────────────────────────┐
│ Character Engagement                        │
│ ─────────────────────────────────────────── │
│             Met │ Avg Trust │ Breakthroughs │
│ Maya Chen    16 │    7.2    │      12       │
│ Devon Kumar   8 │    5.4    │       3       │
│ Jordan Pack.  4 │    6.8    │       2       │
└─────────────────────────────────────────────┘
```

**Data Source:**
- `characterRelationships.met` (count)
- `characterRelationships.trustLevel` (average)
- `breakthroughMoments` filtered by `characterName`

**Algorithm:**
```typescript
const characterStats = ['Maya Chen', 'Devon Kumar', 'Jordan Packard'].map(charName => {
  const relationships = students.map(s =>
    s.characterRelationships.find(c => c.characterName === charName)
  ).filter(Boolean)

  const metCount = relationships.filter(r => r.met).length
  const avgTrust = relationships.reduce((sum, r) => sum + r.trustLevel, 0) / metCount
  const breakthroughCount = students.flatMap(s => s.breakthroughMoments)
    .filter(m => m.characterName === charName).length

  return { charName, metCount, avgTrust, breakthroughCount }
})
```

---

#### 5. Completion Metrics
```
┌─────────────────────────────────────────────┐
│ Journey Progress                            │
│ ─────────────────────────────────────────── │
│ Students with 10+ choices: 14 (88%)         │
│ Students with 20+ choices: 8 (50%)          │
│ Students with 30+ choices: 3 (19%)          │
│                                             │
│ Average journey depth: 24.5 choices         │
│ Median journey depth: 18 choices            │
└─────────────────────────────────────────────┘
```

**Data Source:** `choicePatterns.totalChoices`

---

#### 6. CSV Export Button
```
┌─────────────────────────────────────────────┐
│ Export Cohort Data                          │
│ ─────────────────────────────────────────── │
│ [Download Cohort Summary CSV]               │
│ [Download Detailed Student List CSV]        │
│                                             │
│ Exports include: Patterns, Career Matches,  │
│ Trust Levels, Birmingham Opportunities      │
└─────────────────────────────────────────────┘
```

**CSV Format (Summary):**
```csv
Metric,Value
Total Students,16
Active (Last 7 Days),12
Avg Choices per Student,24.5
Dominant Pattern (Most Common),Helping (38%)
Top Career Match,Healthcare (8 students)
Top Birmingham Opportunity,UAB Medical (8 students)
Maya Avg Trust,7.2
Devon Avg Trust,5.4
Jordan Avg Trust,6.8
```

**CSV Format (Detailed Student List):**
```csv
User ID,Last Active,Total Choices,Dominant Pattern,Top Career Match,Birmingham Opportunities,Maya Trust,Devon Trust,Jordan Trust,Breakthrough Count
Player_123,2024-12-13,32,Helping,Healthcare,"UAB Medical, Children's",8,6,0,4
Player_456,2024-12-12,18,Analytical,Technology,"Innovation Depot",5,7,0,2
...
```

---

### Implementation Plan

#### Phase 1: Cohort Aggregation Functions (2-4 hours)
**File:** `lib/cohort-analytics.ts`

```typescript
import type { StudentInsights } from './types/student-insights'

export interface CohortStats {
  totalStudents: number
  activeStudents: number // Last 7 days
  avgChoices: number
  avgScenes: number
  patternDistribution: Record<string, number>
  careerSectors: Record<string, number>
  birminghamOpportunities: Array<{ name: string; count: number }>
  characterEngagement: Array<{
    name: string
    metCount: number
    avgTrust: number
    breakthroughCount: number
  }>
  completionBrackets: {
    tenPlus: number
    twentyPlus: number
    thirtyPlus: number
  }
}

export function aggregateCohortStats(students: StudentInsights[]): CohortStats {
  // Implementation here
}

export function generateCohortCSV(students: StudentInsights[], format: 'summary' | 'detailed'): string {
  // CSV generation logic
}
```

**Dependencies:**
- `lib/types/student-insights.ts` (already exists)
- No new packages needed

---

#### Phase 2: Cohort Dashboard Page (4-6 hours)
**File:** `app/admin/cohort/page.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { getAllUserIds, loadSkillProfile } from '@/lib/skill-profile-adapter'
import { parseStudentInsights } from '@/lib/student-insights-parser'
import { aggregateCohortStats } from '@/lib/cohort-analytics'
import { CohortOverviewCard } from '@/components/admin/cohort/CohortOverviewCard'
import { PatternDistributionChart } from '@/components/admin/cohort/PatternDistributionChart'
import { CareerTrendsCard } from '@/components/admin/cohort/CareerTrendsCard'
import { CharacterEngagementMatrix } from '@/components/admin/cohort/CharacterEngagementMatrix'
import { CompletionMetricsCard } from '@/components/admin/cohort/CompletionMetricsCard'
import { CohortExportButton } from '@/components/admin/cohort/CohortExportButton'

export default function CohortDashboard() {
  // Load all students
  // Aggregate stats
  // Render sections
}
```

---

#### Phase 3: Cohort-Specific Components (6-8 hours)

**New Components:**

1. **CohortOverviewCard.tsx**
   - Total students, active count, avg metrics
   - Simple stats card layout

2. **PatternDistributionChart.tsx**
   - Bar or pie chart of pattern distribution
   - Reuses existing `ChoicePatternBar` component with aggregate data

3. **CareerTrendsCard.tsx**
   - Top career sectors
   - Birmingham opportunities leaderboard

4. **CharacterEngagementMatrix.tsx**
   - Table: Character | Met Count | Avg Trust | Breakthroughs
   - Sortable columns

5. **CompletionMetricsCard.tsx**
   - Choice count brackets
   - Avg/median journey depth

6. **CohortExportButton.tsx**
   - Two export options: Summary CSV, Detailed CSV
   - Calls `generateCohortCSV()` from `lib/cohort-analytics.ts`
   - Downloads CSV file

---

#### Phase 4: CSV Export Implementation (2-3 hours)

**File:** `lib/cohort-analytics.ts` (extend)

```typescript
export function generateCohortSummaryCSV(stats: CohortStats): string {
  const rows = [
    ['Metric', 'Value'],
    ['Total Students', stats.totalStudents.toString()],
    ['Active (Last 7 Days)', stats.activeStudents.toString()],
    // ... etc
  ]
  return rows.map(row => row.join(',')).join('\n')
}

export function generateCohortDetailedCSV(students: StudentInsights[]): string {
  const headers = [
    'User ID',
    'Last Active',
    'Total Choices',
    'Dominant Pattern',
    'Top Career Match',
    'Birmingham Opportunities',
    'Maya Trust',
    'Devon Trust',
    'Jordan Trust',
    'Breakthrough Count'
  ]

  const rows = students.map(student => [
    student.userId,
    new Date(student.lastActive).toLocaleDateString(),
    student.choicePatterns.totalChoices.toString(),
    student.choicePatterns.dominantPattern,
    student.careerDiscovery.topMatch.name,
    student.careerDiscovery.birminghamOpportunities.join('; '),
    // ... etc
  ])

  return [headers, ...rows].map(row => row.join(',')).join('\n')
}
```

**Download Logic:**
```typescript
// In CohortExportButton.tsx
const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}
```

---

## Technical Considerations

### Performance
**Concern:** Loading all student profiles at once (50+ students) could be slow.

**Solution:**
- Existing `/admin` page already handles this with batching (10 students at a time)
- Reuse same loading pattern for cohort page
- Cache aggregated stats in memory (React state)

### Data Privacy
**Concern:** CSV export contains PII (User IDs, timestamps).

**Solution:**
- User IDs are already anonymized (`player_timestamp`)
- CSV export requires admin authentication (already in place via `/admin/login`)
- Add disclaimer: "This data is confidential. Do not share publicly."

### Browser Compatibility
**Concern:** CSV download might not work in all browsers.

**Solution:**
- Blob API supported in all modern browsers
- Fallback: Display CSV in `<textarea>` for manual copy-paste

---

## Comparison to Existing Analytics

### What Exists (Individual Student Focus)
- ✅ Deep dive into one student's journey
- ✅ Character-by-character trust levels
- ✅ Choice-by-choice pattern analysis
- ✅ PDF export for individual student profiles

**Use Case:** Career counselor meeting 1-on-1 with student

---

### What's Missing (Cohort Focus)
- ❌ Aggregate pattern distribution across cohort
- ❌ Career trend analysis (which careers are popular)
- ❌ Cohort completion metrics (engagement depth)
- ❌ CSV export for reporting to funders

**Use Case:** Program manager (Anthony) reporting to Urban League

---

## Urban Chamber Pilot Requirements

### Critical for Pilot (MVP)
1. ✅ Cohort Overview Card (total students, active count)
2. ✅ Pattern Distribution Chart (visualize pattern spread)
3. ✅ Career Trends Card (top careers, Birmingham opportunities)
4. ✅ CSV Export (both summary and detailed formats)

**Rationale:** Anthony needs to show Urban League:
- "16 students participated"
- "38% are helping-dominant (community-oriented)"
- "Top career interest: Healthcare (8 students)"
- "Students exploring UAB Medical, Children's of Alabama"

### Nice-to-Have (Post-Pilot)
1. Character Engagement Matrix (trust trends)
2. Completion Metrics (journey depth analysis)
3. Cohort Comparison (Fall 2024 vs Spring 2025)
4. Time-based trends (pattern evolution over session)

**Rationale:** Valuable for longitudinal tracking but not required for initial pilot report.

---

## Recommended Approach

### Option 1: Minimal Cohort Dashboard (MVP)
**Timeline:** 8-12 hours
**Scope:**
- Create `/admin/cohort` page
- 4 sections: Overview, Patterns, Careers, Export
- CSV export (summary + detailed)
- No charting library (use simple tables/bars)

**Pros:**
- Fast to implement
- Meets critical pilot needs
- Low risk (reuses existing components)

**Cons:**
- Less visually polished
- No interactive charts

**Recommendation:** ✅ **Start here for Urban Chamber pilot**

---

### Option 2: Enhanced Cohort Dashboard (AAA)
**Timeline:** 16-24 hours
**Scope:**
- Everything in Option 1 PLUS:
- Interactive charts (Recharts or Chart.js)
- Character Engagement Matrix
- Completion Metrics
- Cohort filtering (date range, pattern)

**Pros:**
- Production-quality B2B feature
- Scalable to multiple cohorts
- Impressive for sales demos

**Cons:**
- Takes longer
- Adds charting library dependency (bundle size)

**Recommendation:** ⏸️ **Do after pilot validation**

---

### Option 3: Enhance Existing `/admin` Page
**Timeline:** 4-6 hours
**Scope:**
- Add cohort stats to top of existing `/admin` page
- "Cohort Summary" card above student list
- CSV export button in header
- No new page needed

**Pros:**
- Fastest implementation
- Educators already familiar with `/admin` URL
- No navigation changes

**Cons:**
- Clutters existing page
- Limited space for detailed analytics
- Harder to expand later

**Recommendation:** ❌ **Too constrained for B2B needs**

---

## Final Recommendation

### Implement Option 1: Minimal Cohort Dashboard

**Phase 1 (Week 2 - Dec 16-20):**
- Create `lib/cohort-analytics.ts` with aggregation functions
- Build `/admin/cohort` page with 4 sections
- Implement CSV export (summary + detailed)

**Phase 2 (Post-Pilot - January):**
- Add interactive charts (Recharts)
- Build Character Engagement Matrix
- Add cohort filtering

**Rationale:**
- Meets Urban Chamber pilot requirements
- Fast enough to complete in Week 2 (alongside mobile UI testing)
- Foundation for future B2B features

---

## Next Steps

1. ✅ Complete this dashboard review
2. → Design cohort analytics features (NEXT: Create implementation spec)
3. → Implement `/admin/cohort` page (Week 2)
4. → Test CSV export with sample data
5. → Get Anthony's feedback on cohort dashboard
6. → Polish for pilot (Dec 21-24)

---

## Questions for Anthony (Urban Chamber)

Before building, confirm with Anthony:

1. **Cohort Size:** How many students in first pilot? (Assumed 16)
2. **Reporting Frequency:** Weekly? Monthly? End-of-program only?
3. **Key Metrics:** Which stats matter most for Urban League reports?
4. **CSV Format:** Do you need specific column names/formatting?
5. **Data Access:** Should students see their own data? Or educator-only?

---

## Summary

**Current State:**
- ✅ Excellent individual student analytics
- ✅ Deep career discovery insights
- ❌ No cohort-level aggregation
- ❌ No CSV export for educators

**Gap for B2B:**
- Educators need cohort trends, not just individual profiles
- CSV export required for grant reporting
- Pattern distribution visualization helps demonstrate impact

**Solution:**
- Build `/admin/cohort` page with 4 key sections
- Implement CSV export (summary + detailed)
- Use existing components where possible
- Timeline: 8-12 hours (Week 2 realistic)

**Outcome:**
- Anthony can report: "16 students, 38% helping-dominant, top career: Healthcare, exploring UAB/Children's"
- Urban League sees quantitative impact
- Pilot success → More cohorts → B2B revenue
