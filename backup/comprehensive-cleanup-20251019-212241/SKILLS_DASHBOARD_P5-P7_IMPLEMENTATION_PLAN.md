# Skills Analytics Dashboard - P5-P7 Implementation Plan
## Remaining Quality Council Optimizations

**Status**: Ready for implementation
**Prerequisites**: P1-P4 completed ✅
**Current Demo Score**: 8.5/10
**Target After P5-P7**: 9.5/10 (production-ready)

---

## Overview

P1-P4 fixed critical demo blockers and added visual impact. P5-P7 add competitive differentiation features that transform the dashboard from "impressive demo" to "production-ready platform."

---

## Priority 5: Peer Benchmarking System ⭐⭐
**Estimated Time**: 3-4 hours
**Impact**: Contextualizes individual performance, adds competitive insights
**Demo Value**: High (funders love comparative data)

### Problem
Current dashboard shows absolute skill levels (e.g., "75% Critical Thinking") but no context for whether that's exceptional, average, or concerning relative to peers.

### Solution: Cohort Comparison Layer

#### A. Data Structure (Add to SkillProfile)
```typescript
interface SkillProfile {
  // ... existing fields
  cohortContext?: {
    cohortSize: number
    percentile: number  // 0-100, where this student ranks
    cohortAverage: Record<string, number>  // Average skill levels
    topPerformer: boolean  // Top 10% flag
    growthRate: 'faster' | 'average' | 'slower'  // Compared to cohort
  }
}
```

#### B. Calculation Logic (lib/cohort-analytics.ts - NEW FILE)
```typescript
export function calculateCohortContext(
  userId: string,
  allProfiles: SkillProfile[]
): CohortContext {
  // Filter to same time period (e.g., last 30 days of student joins)
  const cohort = allProfiles.filter(p =>
    Math.abs(getUserJoinTime(p.userId) - getUserJoinTime(userId)) < 30 * 24 * 60 * 60 * 1000
  )

  // Calculate percentile for total demonstrations
  const sorted = cohort.sort((a, b) => b.totalDemonstrations - a.totalDemonstrations)
  const rank = sorted.findIndex(p => p.userId === userId)
  const percentile = ((cohort.length - rank) / cohort.length) * 100

  // Calculate cohort averages per skill
  const cohortAverage = {}
  Object.keys(SKILLS_2030).forEach(skill => {
    const levels = cohort.map(p => p.skillLevels[skill] || 0)
    cohortAverage[skill] = levels.reduce((a, b) => a + b, 0) / levels.length
  })

  // Growth rate calculation
  const studentGrowth = calculateGrowthRate(userId)
  const avgGrowth = cohort.map(calculateGrowthRate).reduce((a, b) => a + b) / cohort.length
  const growthRate = studentGrowth > avgGrowth * 1.2 ? 'faster' :
                     studentGrowth < avgGrowth * 0.8 ? 'slower' : 'average'

  return {
    cohortSize: cohort.length,
    percentile,
    cohortAverage,
    topPerformer: percentile >= 90,
    growthRate
  }
}
```

#### C. UI Integration (SingleUserDashboard.tsx)

**Location 1: Skills Tab Header** (after line 586)
```tsx
{user.cohortContext && (
  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-4">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold text-purple-900">
          Cohort Performance
        </h3>
        <p className="text-xs text-purple-700">
          Compared to {user.cohortContext.cohortSize} students who started around the same time
        </p>
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold text-purple-900">
          {Math.round(user.cohortContext.percentile)}th
        </div>
        <div className="text-xs text-purple-700">percentile</div>
        {user.cohortContext.topPerformer && (
          <Badge className="mt-1 bg-yellow-100 text-yellow-800">
            🏆 Top 10%
          </Badge>
        )}
      </div>
    </div>

    <div className="mt-3 flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          user.cohortContext.growthRate === 'faster' ? 'bg-green-500' :
          user.cohortContext.growthRate === 'slower' ? 'bg-orange-500' :
          'bg-blue-500'
        }`} />
        <span className="text-gray-700">
          Growth: {user.cohortContext.growthRate === 'faster' ? 'Above Average ↗' :
                   user.cohortContext.growthRate === 'slower' ? 'Below Average ↘' :
                   'On Track →'}
        </span>
      </div>
    </div>
  </div>
)}
```

**Location 2: Each Skill Card** (add comparison badge)
```tsx
{user.cohortContext && (
  <div className="flex items-center gap-2 mt-2 text-xs">
    <span className="text-gray-500">vs. cohort avg:</span>
    {user.skillLevels[skillKey] > user.cohortContext.cohortAverage[skillKey] ? (
      <Badge variant="outline" className="bg-green-50 text-green-700">
        +{Math.round((user.skillLevels[skillKey] - user.cohortContext.cohortAverage[skillKey]) * 100)}% above
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-orange-50 text-orange-700">
        {Math.round((user.skillLevels[skillKey] - user.cohortContext.cohortAverage[skillKey]) * 100)}% gap
      </Badge>
    )}
  </div>
)}
```

**Location 3: 2030 Skills Tab** (add cohort comparison bars)
```tsx
{/* Add second progress bar showing cohort average */}
<div className="space-y-1">
  <div className="flex items-center gap-2">
    <span className="text-xs text-gray-600">You:</span>
    <Progress value={currentValue * 100} className="flex-1 h-3" />
    <span className="text-xs font-medium">{Math.round(currentValue * 100)}%</span>
  </div>

  {user.cohortContext && (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400">Avg:</span>
      <Progress
        value={user.cohortContext.cohortAverage[skillKey] * 100}
        className="flex-1 h-2 opacity-50"
      />
      <span className="text-xs text-gray-400">
        {Math.round(user.cohortContext.cohortAverage[skillKey] * 100)}%
      </span>
    </div>
  )}
</div>
```

#### D. Privacy & Ethics Considerations
- **Anonymization**: Never show individual peer names/IDs
- **Opt-out**: Add setting to disable comparisons if student prefers
- **Positive Framing**: Use "growth opportunity" not "below average"
- **Cohort Definition**: Time-based (joined within 30 days) to ensure fairness

#### E. Testing Checklist
- [ ] Cohort calculation with 1, 5, 20, 100 students
- [ ] Edge case: Student is only member of cohort (hide comparison)
- [ ] Percentile accuracy (compare manual calculation)
- [ ] UI renders correctly with/without cohortContext
- [ ] Performance: Calculation under 100ms for 100 students

---

## Priority 6: Export & Share Functionality ⭐⭐⭐
**Estimated Time**: 2-3 hours
**Impact**: Enables student portfolio building, counselor sharing
**Demo Value**: Very High (actionability for end users)

### Problem
Admins can VIEW rich student data but cannot:
- Share insights with students themselves
- Export for college applications or job portfolios
- Print for offline counselor meetings
- Archive for grant reporting

### Solution: Multi-Format Export System

#### A. Export Formats

**Format 1: PDF Student Report** (Primary)
- Clean, printable 2-page summary
- Skills radar chart + top career matches
- QR code linking to full dashboard
- Birmingham opportunities list

**Format 2: JSON Data Export** (Secondary)
- Complete skill demonstration history
- Machine-readable for external integrations
- Timestamped for grant reporting

**Format 3: Shareable Link** (Tertiary)
- Read-only public URL (expires in 7 days)
- For sharing with counselors/family
- No login required

#### B. Implementation Plan

**Step 1: PDF Generation (lib/pdf-generator.ts - NEW FILE)**

Use `jspdf` + `html2canvas` for client-side PDF generation:

```bash
npm install jspdf html2canvas
```

```typescript
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function generateStudentReport(
  userId: string,
  profile: SkillProfile
): Promise<Blob> {
  // Create hidden container with print-optimized layout
  const container = document.createElement('div')
  container.className = 'pdf-report'
  container.style.cssText = 'position: absolute; left: -9999px; width: 8.5in;'

  container.innerHTML = `
    <div style="font-family: Arial; padding: 40px;">
      <!-- Page 1: Skills Summary -->
      <div class="page-1">
        <h1>Skills Profile: ${formatUserIdShort(userId)}</h1>
        <p style="color: #666; margin-bottom: 30px;">
          Generated ${new Date().toLocaleDateString()} • Grand Central Terminus Career Explorer
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <!-- Top Skills -->
          <div>
            <h2>Top Demonstrated Skills</h2>
            ${renderTopSkills(profile)}
          </div>

          <!-- Career Matches -->
          <div>
            <h2>Career Pathway Matches</h2>
            ${renderCareerMatches(profile.careerMatches.slice(0, 3))}
          </div>
        </div>

        <!-- WEF 2030 Skills Chart -->
        <div style="margin-top: 30px;">
          <h2>World Economic Forum 2030 Skills</h2>
          <canvas id="skills-radar" width="400" height="300"></canvas>
        </div>
      </div>

      <!-- Page 2: Birmingham Opportunities -->
      <div class="page-2" style="page-break-before: always;">
        <h2>Next Steps: Birmingham Opportunities</h2>
        ${renderBirminghamActions(profile)}

        <div style="margin-top: 40px; border-top: 2px solid #ccc; padding-top: 20px;">
          <p style="font-size: 12px; color: #666;">
            📊 View Full Interactive Dashboard:<br>
            <img src="${generateQRCode(userId)}" width="100" height="100" />
          </p>
        </div>
      </div>
    </div>
  `

  document.body.appendChild(container)

  // Render radar chart to canvas
  await renderSkillsRadar('skills-radar', profile.skillLevels)

  // Convert to PDF
  const canvas = await html2canvas(container, { scale: 2 })
  const pdf = new jsPDF('p', 'in', 'letter')

  // Page 1
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 8.5, 11)

  // Page 2
  pdf.addPage()
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, -11, 8.5, 11)

  document.body.removeChild(container)

  return pdf.output('blob')
}
```

**Step 2: Export UI (SingleUserDashboard.tsx)**

Add export button to header (after line 450):

```tsx
<div className="flex items-center gap-2">
  {/* Existing back button */}

  {/* Export Dropdown */}
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="sm" className="gap-2">
        <Download className="w-4 h-4" />
        Export
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={() => handleExportPDF(user.userId, user)}>
        <FileText className="w-4 h-4 mr-2" />
        PDF Student Report
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => handleExportJSON(user)}>
        <Code className="w-4 h-4 mr-2" />
        JSON Data Export
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => handleGenerateShareLink(user.userId)}>
        <Link className="w-4 h-4 mr-2" />
        Generate Share Link
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>
```

**Step 3: Export Handlers**

```typescript
async function handleExportPDF(userId: string, profile: SkillProfile) {
  try {
    setExporting(true)
    const blob = await generateStudentReport(userId, profile)

    // Download file
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `skills-report-${formatUserIdShort(userId)}.pdf`
    a.click()
    URL.revokeObjectURL(url)

    // Show success toast
    toast.success('PDF report downloaded successfully')
  } catch (error) {
    console.error('PDF export failed:', error)
    toast.error('Export failed. Please try again.')
  } finally {
    setExporting(false)
  }
}

function handleExportJSON(profile: SkillProfile) {
  const jsonData = {
    exportDate: new Date().toISOString(),
    userId: profile.userId,
    totalDemonstrations: profile.totalDemonstrations,
    skillLevels: profile.skillLevels,
    careerMatches: profile.careerMatches,
    milestones: profile.milestones,
    skillDemonstrations: profile.skillDemonstrations,
    cohortContext: profile.cohortContext
  }

  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `skills-data-${formatUserIdShort(profile.userId)}.json`
  a.click()
  URL.revokeObjectURL(url)

  toast.success('JSON export downloaded')
}

async function handleGenerateShareLink(userId: string) {
  // Generate shareable token (expires in 7 days)
  const token = await generateShareToken(userId, 7 * 24 * 60 * 60)
  const shareUrl = `${window.location.origin}/share/${token}`

  // Copy to clipboard
  await navigator.clipboard.writeText(shareUrl)

  // Show modal with link
  setShareLink(shareUrl)
  setShareModalOpen(true)

  toast.success('Share link copied to clipboard')
}
```

**Step 4: Share Link Route (app/share/[token]/page.tsx - NEW FILE)**

```tsx
export default async function SharedDashboardPage({
  params
}: {
  params: { token: string }
}) {
  // Validate token and get userId
  const { userId, valid, expiresAt } = await validateShareToken(params.token)

  if (!valid) {
    return <div>This share link has expired or is invalid.</div>
  }

  // Load profile (read-only)
  const profile = loadSkillProfile(userId)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Watermark banner */}
      <div className="bg-blue-50 border-b border-blue-200 p-3 mb-4">
        <p className="text-sm text-center text-blue-700">
          📊 Read-Only Skills Dashboard • Expires {new Date(expiresAt).toLocaleDateString()}
        </p>
      </div>

      {/* Render dashboard in read-only mode */}
      <SingleUserDashboard userId={userId} profile={profile} readOnly />
    </div>
  )
}
```

#### C. Testing Checklist
- [ ] PDF generation works on Chrome, Safari, Firefox
- [ ] PDF includes all sections (skills, careers, opportunities)
- [ ] JSON export includes complete data
- [ ] Share link expires correctly after 7 days
- [ ] Share link shows read-only watermark
- [ ] Export button disabled during generation
- [ ] File names include student identifier

---

## Priority 7: Evidence Tab Supabase Integration ⭐⭐⭐
**Estimated Time**: 4-6 hours
**Impact**: Removes all mock data, enables real assessment integration
**Demo Value**: Critical (blocks production deployment)

### Problem
Evidence Tab (lines 847-1064) uses hardcoded mock data:
- WEF 2030 Skills outcomes: `"85% match to Adaptive Thinking"`
- Erikson stages: `"Stage: Identity vs Role Confusion (87% resolved)"`
- Flow states: `"72% of sessions in flow state"`
- All 6 frameworks use placeholder values

When stakeholders ask "show me real student data," credibility destroyed.

### Solution: Real-Time Supabase Queries

#### A. Database Schema Requirements

**Existing Tables to Query:**
- `skill_demonstrations` - Every choice that demonstrated a skill
- `game_state` - Scene history, timestamps, current state
- `player_persona` - Behavioral patterns, stress metrics
- `choice_history` - All player choices with context

**New Materialized View: `student_evidence_summary`**

```sql
CREATE MATERIALIZED VIEW student_evidence_summary AS
SELECT
  user_id,

  -- WEF 2030 Skills Framework
  COUNT(DISTINCT CASE WHEN skill_category = 'critical_thinking' THEN demonstration_id END) as critical_thinking_count,
  COUNT(DISTINCT CASE WHEN skill_category = 'creativity' THEN demonstration_id END) as creativity_count,
  -- ... all 12 WEF skills

  -- Erikson Identity Development
  CASE
    WHEN identity_exploration_score > 0.7 THEN 'identity_achievement'
    WHEN identity_exploration_score > 0.4 THEN 'moratorium'
    ELSE 'diffusion'
  END as erikson_stage,
  identity_exploration_score,

  -- Flow Theory (Engagement)
  AVG(CASE WHEN session_duration_minutes BETWEEN 15 AND 45 THEN 1.0 ELSE 0.0 END) as flow_state_percentage,
  AVG(choices_per_minute) as engagement_rate,

  -- Limbic Learning (Stress)
  AVG(stress_indicator_score) as avg_stress,
  AVG(confusion_score) as avg_confusion,

  -- Social Cognitive Career Theory (Self-Efficacy)
  AVG(choice_confidence_score) as self_efficacy_score,
  COUNT(DISTINCT career_exploration_choice) as career_breadth,

  -- Grant Outcomes
  COUNT(DISTINCT skill_category) as unique_skills_demonstrated,
  MAX(created_at) - MIN(created_at) as total_engagement_time,
  COUNT(DISTINCT DATE(created_at)) as active_days

FROM skill_demonstrations sd
LEFT JOIN player_persona pp ON sd.user_id = pp.user_id
LEFT JOIN game_state gs ON sd.user_id = gs.user_id
GROUP BY sd.user_id;

-- Refresh every 15 minutes
CREATE INDEX idx_evidence_user ON student_evidence_summary(user_id);
```

#### B. API Route (app/api/admin/evidence/[userId]/route.ts - NEW FILE)

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const supabase = createClient()

  // Fetch evidence summary
  const { data, error } = await supabase
    .from('student_evidence_summary')
    .select('*')
    .eq('user_id', params.userId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'No evidence found' }, { status: 404 })
  }

  // Transform to framework format
  const evidence = {
    wef2030: {
      criticalThinking: {
        demonstrations: data.critical_thinking_count,
        matchScore: calculateMatchScore(data.critical_thinking_count, data.total_choices)
      },
      creativity: {
        demonstrations: data.creativity_count,
        matchScore: calculateMatchScore(data.creativity_count, data.total_choices)
      }
      // ... all 12 skills
    },

    erikson: {
      stage: data.erikson_stage,
      stageLabel: getEriksonLabel(data.erikson_stage),
      explorationScore: data.identity_exploration_score,
      resolutionPercentage: Math.round(data.identity_exploration_score * 100)
    },

    flow: {
      flowStatePercentage: Math.round(data.flow_state_percentage * 100),
      engagementRate: data.engagement_rate,
      optimalChallengeBalance: calculateFlowBalance(data)
    },

    limbic: {
      avgStress: data.avg_stress,
      avgConfusion: data.avg_confusion,
      emotionalSafety: 1 - data.avg_stress  // Inverse relationship
    },

    scct: {
      selfEfficacy: data.self_efficacy_score,
      careerBreadth: data.career_breadth,
      confidenceGrowth: calculateGrowthTrend(params.userId, 'confidence')
    },

    grantOutcomes: {
      uniqueSkills: data.unique_skills_demonstrated,
      totalEngagementHours: Math.round(data.total_engagement_time / 3600),
      activeDays: data.active_days,
      retentionRate: data.active_days / totalDaysSinceStart(params.userId)
    }
  }

  return NextResponse.json(evidence)
}
```

#### C. Frontend Integration (SingleUserDashboard.tsx)

**Replace lines 847-1064 with:**

```typescript
const [evidenceData, setEvidenceData] = useState<EvidenceFrameworks | null>(null)
const [evidenceLoading, setEvidenceLoading] = useState(true)

useEffect(() => {
  async function loadEvidence() {
    try {
      const response = await fetch(`/api/admin/evidence/${user.userId}`)
      const data = await response.json()
      setEvidenceData(data)
    } catch (error) {
      console.error('Failed to load evidence:', error)
      setEvidenceData(null)  // Fall back to "No data" state
    } finally {
      setEvidenceLoading(false)
    }
  }

  loadEvidence()
}, [user.userId])

// In render:
{evidenceLoading ? (
  <div className="text-center py-12">Loading evidence frameworks...</div>
) : !evidenceData ? (
  <Alert className="bg-yellow-50">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      Evidence data not yet available for this student.
      They need at least 10 skill demonstrations to generate framework assessments.
    </AlertDescription>
  </Alert>
) : (
  <div className="space-y-6">
    {/* Framework 1: WEF 2030 Skills */}
    <Card>
      <CardHeader>
        <CardTitle>WEF 2030 Skills Framework</CardTitle>
        {/* REMOVE MOCK DATA BADGE */}
      </CardHeader>
      <CardContent>
        {Object.entries(evidenceData.wef2030).map(([skill, data]) => (
          <div key={skill}>
            <p className="text-sm font-medium">{skill}</p>
            <p className="text-sm text-gray-600">
              {data.demonstrations} demonstrations • {Math.round(data.matchScore * 100)}% match
            </p>
          </div>
        ))}
      </CardContent>
    </Card>

    {/* Repeat for all 6 frameworks using real evidenceData */}
  </div>
)}
```

#### D. Migration Strategy

**Phase 1: Parallel Operation (Week 1)**
- Deploy new API route `/api/admin/evidence/[userId]`
- Keep mock data visible with "PROTOTYPE" badge
- Add toggle: "Show Real Data" / "Show Prototype"
- Verify real data accuracy with 5-10 test students

**Phase 2: Soft Launch (Week 2)**
- Make real data default
- Show fallback message if <10 demonstrations
- Keep prototype toggle for debugging

**Phase 3: Full Replacement (Week 3)**
- Remove all mock data code (lines 865-1064)
- Remove prototype toggle
- Update documentation

#### E. Testing Checklist
- [ ] Materialized view refreshes correctly
- [ ] API returns data for students with 10+ demonstrations
- [ ] API returns 404 for students with <10 demonstrations
- [ ] Frontend handles loading state gracefully
- [ ] Frontend handles error state (no data)
- [ ] All 6 frameworks render with real data
- [ ] Calculations match expectations (manual verification)
- [ ] Performance: API response <500ms

---

## Implementation Timeline

### Week 1: Benchmarking + Export (5-7 hours)
- **Day 1-2**: P5 Peer Benchmarking (3-4h)
  - Create `lib/cohort-analytics.ts`
  - Update SkillProfile interface
  - Add UI components to Skills/2030 tabs
  - Test with varying cohort sizes

- **Day 3**: P6 Export PDF (2-3h)
  - Install jspdf + html2canvas
  - Create `lib/pdf-generator.ts`
  - Add export button and handlers
  - Test PDF generation

### Week 2: Share Links + Evidence API (6-8 hours)
- **Day 1**: Share Link System (2h)
  - Create token generation logic
  - Build `/app/share/[token]/page.tsx`
  - Test expiration and validation

- **Day 2-3**: Evidence Tab Supabase (4-6h)
  - Create materialized view `student_evidence_summary`
  - Build `/api/admin/evidence/[userId]/route.ts`
  - Update frontend to fetch real data
  - Remove mock data code
  - Parallel testing with prototype toggle

### Week 3: Testing + Documentation (2-3 hours)
- Full end-to-end testing with real student data
- Performance optimization (caching, query tuning)
- Update Quality Council audit report
- Demo preparation guide

**Total Estimated Time**: 13-18 hours across 3 weeks

---

## Success Metrics

### Before P5-P7
- **Demo Score**: 8.5/10
- **Production Ready**: No (mock data blocker)
- **Competitive Edge**: Moderate (visual + narrative)
- **User Actionability**: Low (view-only)

### After P5-P7
- **Demo Score**: 9.5/10
- **Production Ready**: Yes (all real data)
- **Competitive Edge**: High (benchmarking + portability)
- **User Actionability**: High (export, share, context)

### Key Differentiators Unlocked
1. **Peer Benchmarking**: Only platform showing relative performance context
2. **Portfolio Export**: Students can use PDF for college/job applications
3. **Share Links**: Counselors can collaborate without admin access
4. **Real Evidence**: All frameworks backed by actual student interactions

---

## Risk Mitigation

### Technical Risks
- **PDF Generation Browser Compatibility**: Test on Safari, Chrome, Firefox, Edge
- **Supabase Query Performance**: Add indexes, use materialized views
- **Large Cohort Calculations**: Cache results, limit to 30-day windows

### UX Risks
- **Benchmarking Anxiety**: Use positive framing ("growth areas" not "behind")
- **Export Confusion**: Clear labels, preview before download
- **Evidence Complexity**: Keep language accessible, avoid jargon

### Privacy Risks
- **Peer Data Exposure**: Never show individual peer identities
- **Share Link Abuse**: 7-day expiration, read-only access, no PII in URL
- **Data Export FERPA**: Add disclaimer to PDF footer, watermark with student ID

---

## Next Steps

**Immediate (This Sprint)**
- [ ] Review plan with stakeholders
- [ ] Prioritize P5 vs P6 vs P7 based on demo timeline
- [ ] Assign developer resources (1 full-time or 2 part-time)

**Recommendation**: If only time for ONE priority, choose **P7 Evidence Supabase** - removes production blocker and demonstrates platform maturity.

**If Time for TWO**: P7 + P6 (Export) - gives students tangible takeaway for portfolios.

**Full Implementation**: All three transforms platform from prototype to production-ready product.

---

**Document Status**: Ready for implementation
**Next Review**: After P5-P7 completion or 3 weeks (whichever comes first)
**Owner**: Lead Developer + Quality Council
