# Admin Dashboard Accessibility & Plain Language Improvement Plan
**Grand Central Terminus - Birmingham Career Exploration**

**Created:** October 4, 2025
**Source:** `/Users/abdusmuwwakkil/Development/10_orbdoc_website/docs/333_admin_dashboard_audit.md`
**Goal:** Make admin dashboard accessible, human-readable, and counselor-friendly across ALL tabs

---

## EXECUTIVE SUMMARY

**Current State:**
- ✅ Evidence tab has Research/Family mode toggle with plain English
- ❌ Skills, Careers, Urgency, Gaps, Action tabs still use technical jargon
- ❌ Charts lack interactivity and accessibility
- ❌ Narrative bridges too academic
- ❌ Empty states too negative
- ❌ Metrics lack context

**Target State:**
- All tabs have accessible, plain English explanations
- Interactive charts with tooltips and keyboard navigation
- Conversational, personalized language throughout
- Positive, encouraging tone
- Context for every metric and percentage

---

## PHASE 1: LANGUAGE & TONE IMPROVEMENTS (Priority: HIGH)

### **1.1 Global Mode Toggle**

**What:** Extend Evidence tab's "Your Personal View" / "Detailed Analysis" to ALL tabs

**Implementation:**
- Add global state: `adminViewMode: 'family' | 'research'`
- Persist in localStorage: `admin_view_preference`
- Add toggle in dashboard header (applies to all tabs)
- Each tab conditionally renders based on mode

**Plain English Translations:**

| Technical Term | Family-Friendly Version |
|----------------|------------------------|
| "Career explorations" | "Careers you're interested in" |
| "Skill demonstrations" | "Times you showed this skill" |
| "Focus Score 0.85" | "Deep dive preference: High (85%)" |
| "Exploration Score 0.42" | "Breadth exploration: Moderate (42%)" |
| "Match score" | "How well you fit" |
| "Readiness level" | "How close you are to being ready" |
| "Contributing factors" | "What's driving this" |
| "Development pathways" | "How to get there" |
| "Urgency score 78%" | "Attention needed: High (78%)" |
| "Skill gap analysis" | "What to work on next" |
| "Birmingham relevance" | "Local job opportunities" |

---

### **1.2 Narrative Bridge Improvements**

**Current Problem:** Bridges are 40-50 words, academic tone, state the obvious

**Solution:** Rewrite ALL bridges to be <25 words, personalized, action-oriented

**Examples:**

#### Skills → Careers Bridge
**Before:**
> "Based on 12 skill demonstrations, here are Birmingham career pathways where Jamal's strengths align best. Match scores reflect readiness across skill requirements, education access, and local opportunities."

**After (Family Mode):**
> "Jamal's shown 12 skills—here's where they lead in Birmingham. Focus on 'Near Ready' careers first."

**After (Research Mode):**
> "12 skill demonstrations analyzed against Birmingham labor market data. Match algorithm: skills (40%), education access (30%), local demand (30%)."

#### Careers → Gaps Bridge
**Before:**
> "Based on 3 career explorations, here are skill areas to strengthen. These gaps aren't weaknesses—they're growth areas with clear pathways forward."

**After (Family Mode):**
> "Looking at 3 careers Jordan's interested in, here's what to unlock next. Think: new opportunities, not problems."

**After (Research Mode):**
> "Gap analysis for 3 career targets. Priority ranking: impact on career access × current proficiency × time to develop."

---

### **1.3 Glass Box Urgency Narrative Improvements**

**Current Problem:** 40-50 word narratives, passive voice, buried lede

**Solution:** 15-25 words, active voice, severity-calibrated

**Formula:**
```
[Emoji] [Student name] [PROBLEM]. [Hypothesis]. **Action:** [Directive with timeframe].
```

**Examples:**

#### Critical Urgency (15-20 words)
**Before:**
> "Jordan is showing 78% urgency primarily due to disengagement patterns. They've visited only 2 scenes in the last 5 days despite making 8 choices in their first session. The gap between initial engagement and recent activity suggests they may be stuck or uncertain about next steps."

**After:**
> "🚨 Jordan stopped playing 5 days ago after a strong start (8 choices). Might be stuck. **Action:** Reach out today."

#### High Urgency (20-25 words)
**After:**
> "🟠 Maya's choices show anxiety patterns (4 family conflict scenes). She might need support navigating parent pressure. **Action:** Check in this week."

#### Medium Urgency (25-30 words)
**After:**
> "🟡 Devon hasn't explored new careers in 2 weeks. Comfortable with engineering but might benefit from broader options. **Action:** Gentle nudge within 2 weeks."

#### Low Urgency (30-40 words - more detail is fine)
**After:**
> "✅ Samuel's doing great! Balanced exploration across 4 careers, consistent engagement (daily logins), asking thoughtful questions. **Action:** Monthly check-in to celebrate progress and discuss next steps."

---

### **1.4 Section Header Personalization**

**Apply to ALL tabs:**

| Generic Header | Personalized Version (Family Mode) | Research Version |
|----------------|-----------------------------------|------------------|
| "Key Evidence" | "Jordan's Strongest Moments" | "Top Skill Demonstrations (by strength)" |
| "Skill Requirements" | "What's Needed for This Career" | "Required Competencies & Gap Analysis" |
| "Contributing Factors" | "Why Jordan Needs Attention" | "Urgency Calculation Factors" |
| "Career Matches" | "Where Jordan's Skills Lead" | "Labor Market Alignment Analysis" |
| "Development Pathways" | "How to Get There" | "Recommended Skill Acquisition Sequence" |
| "Birmingham Opportunities" | "Local Ways to Explore This" | "Regional Employer Partnerships" |

---

### **1.5 Empty State Improvements**

**Make ALL empty states positive and encouraging:**

| Tab | Current | Improved (Family Mode) |
|-----|---------|----------------------|
| Skills | "No skill data available" | "🎯 Ready to explore skills! Skill tracking starts after making choices in the story." |
| Careers | "No career explorations yet" | "✨ Career possibilities ahead! Careers appear as you explore different story paths." |
| Urgency | "No urgent students found" | "✅ Great news - no urgent students! Check back after more activity, or view 'All Students'." |
| Gaps | "No gaps identified" | "🎉 Looking strong! No major skill gaps detected for top career matches." |
| Action | "No action items" | "👍 All set! No immediate actions needed. Check back weekly for updates." |

---

## PHASE 2: CHART & VISUAL ACCESSIBILITY (Priority: HIGH)

### **2.1 Skill Progression Chart Enhancements**

**Current Issues:**
- No hover tooltips
- Can't click data points
- No keyboard navigation
- Colors may not be distinguishable

**Improvements:**

```typescript
// Add to SkillProgressionChart component:
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={skillData}>
    {/* Accessibility */}
    <desc>Skill demonstration timeline showing growth over time</desc>

    {/* Interactive tooltips */}
    <Tooltip
      content={<CustomTooltip />}
      cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
    />

    {/* Keyboard accessible data points */}
    <Line
      type="monotone"
      dataKey="demonstrations"
      stroke="#3b82f6"
      strokeWidth={2}
      dot={{
        r: 6,
        fill: '#3b82f6',
        role: 'button',
        'aria-label': (entry) => `${entry.skill} - ${entry.count} demonstrations on ${entry.date}`
      }}
      onClick={(data) => scrollToDemonstration(data.id)}
      activeDot={{ r: 8, cursor: 'pointer' }}
    />
  </LineChart>
</ResponsiveContainer>
```

**Custom Tooltip (Plain English):**
```typescript
function CustomTooltip({ active, payload, viewMode }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        {viewMode === 'family' ? (
          <>
            <p className="font-semibold">{data.skill}</p>
            <p className="text-sm text-gray-600">
              Shown {data.count} {data.count === 1 ? 'time' : 'times'}
            </p>
            <p className="text-xs text-gray-500">{data.date}</p>
          </>
        ) : (
          <>
            <p className="font-semibold">{data.skill}</p>
            <p className="text-sm">Demonstrations: {data.count}</p>
            <p className="text-xs text-gray-500">
              Timestamp: {data.timestamp}
            </p>
            <p className="text-xs text-blue-600 cursor-pointer">
              Click to view demonstrations →
            </p>
          </>
        )}
      </div>
    );
  }
  return null;
}
```

---

### **2.2 Color Accessibility Improvements**

**WCAG AA Compliance:**

All text on colored backgrounds must meet 4.5:1 contrast ratio:

| Element | Current | WCAG AA Fix |
|---------|---------|-------------|
| Blue narrative box text | `text-gray-600` on `bg-blue-50` | `text-gray-800` on `bg-blue-50` |
| Badge text | `text-gray-500` | `text-gray-700` |
| Urgency percentage | Inherits body color | Match urgency badge color (orange-600, red-600, etc.) |
| Scene names | `text-gray-400` | `text-gray-600` |

**Color Coding Consistency:**

Urgency levels must be consistent across:
1. Badge color
2. Left border accent
3. Percentage number color
4. Card background tint (5-10% opacity)

```css
/* Critical Urgency */
.urgency-critical {
  border-left: 4px solid rgb(220, 38, 38); /* red-600 */
  background: rgb(254, 242, 242, 0.5); /* red-50 at 50% */
}
.urgency-critical .urgency-percentage {
  color: rgb(220, 38, 38); /* red-600 */
  font-weight: 600;
}

/* High Urgency */
.urgency-high {
  border-left: 4px solid rgb(234, 88, 12); /* orange-600 */
  background: rgb(255, 247, 237, 0.5); /* orange-50 at 50% */
}
.urgency-high .urgency-percentage {
  color: rgb(234, 88, 12); /* orange-600 */
  font-weight: 600;
}
```

---

### **2.3 Pattern Recognition Visualizations**

**Add to Skills Tab:**

```typescript
// Automatic pattern detection
const patterns = analyzeSkillPatterns(demonstrations);

<Card className="p-4 bg-purple-50 border-purple-200 mb-4">
  <CardHeader>
    <h3 className="font-semibold">
      {viewMode === 'family'
        ? "🔍 Patterns We Noticed"
        : "Pattern Analysis: Scene Type Distribution"}
    </h3>
  </CardHeader>
  <CardContent>
    {viewMode === 'family' ? (
      <ul className="space-y-2">
        <li>💬 <strong>Communication</strong> shows up most in family scenes (5 times)</li>
        <li>🤝 <strong>Collaboration</strong> strongest with Maya (4 of 6 demonstrations)</li>
        <li>📈 <strong>Growing fast</strong> in Problem Solving (3 demonstrations this week)</li>
      </ul>
    ) : (
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium">Scene Type Distribution:</p>
          <ProgressBar data={patterns.sceneTypes} />
        </div>
        <div>
          <p className="text-sm font-medium">Character Interaction Analysis:</p>
          <ProgressBar data={patterns.characters} />
        </div>
      </div>
    )}
  </CardContent>
</Card>
```

---

## PHASE 3: CONTEXT FOR METRICS (Priority: MEDIUM)

### **3.1 Inline Context for All Percentages**

**Rule:** No orphan percentages - every number needs context

**Examples:**

| Orphan Metric | With Context (Family Mode) | With Context (Research Mode) |
|---------------|---------------------------|------------------------------|
| "78% urgency" | "Attention needed: High (78%)" | "78% urgency score (disengagement risk)" |
| "45% match" | "45% fit based on 8 skills" | "45% career match (skills: 40%, education: 30%, local: 30%)" |
| "85% Birmingham relevance" | "85% of jobs are in Birmingham (12 of 14 employers)" | "85% regional concentration (12/14 Birmingham employers)" |
| "24 demonstrations" | "Shown 24 times" | "24 skill demonstrations across 12 scenes" |

---

### **3.2 Skill Recency Indicators**

**Add color-coded dots to ALL skill cards:**

```typescript
function RecencyDot({ lastDemonstrated, viewMode }) {
  const daysAgo = daysSince(lastDemonstrated);

  if (daysAgo <= 3) {
    return (
      <span className="inline-flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-green-500"
              aria-label="Recent activity" />
        {viewMode === 'family' && <span className="text-xs text-green-700">New!</span>}
        {viewMode === 'research' && <span className="text-xs text-gray-600">&lt;3 days</span>}
      </span>
    );
  } else if (daysAgo <= 7) {
    return (
      <span className="inline-flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-yellow-500"
              aria-label="Recent activity" />
        {viewMode === 'family' && <span className="text-xs text-yellow-700">This week</span>}
        {viewMode === 'research' && <span className="text-xs text-gray-600">3-7 days</span>}
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-gray-400"
              aria-label="Older activity" />
        {viewMode === 'research' && <span className="text-xs text-gray-600">&gt;7 days</span>}
      </span>
    );
  }
}
```

---

### **3.3 Date Formatting Consistency**

**Rules:**

1. **Urgency Tab:** Always relative time
   - "2 hours ago" (not just "2 hours")
   - "5 days ago" (not "5d")

2. **Evidence Tab:** Always full dates for scientific accuracy
   - "October 3, 2025 at 10:59 PM"

3. **Activity Summaries:** Hybrid approach
   - Recent (<7 days): "2 hours ago"
   - Older (≥7 days): "October 1, 2025"

4. **Always include label:**
   - "Last active: 2 hours ago" (not just "2 hours ago")

---

## PHASE 4: INTERACTIVE IMPROVEMENTS (Priority: MEDIUM)

### **4.1 Cross-Tab Navigation**

**Skills → Careers Linking:**

```typescript
// In Skills Tab - add career preview
<div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
  <h4 className="font-semibold mb-2">
    {viewMode === 'family'
      ? "🎯 Where This Skill Leads"
      : "Careers Requiring This Skill"}
  </h4>
  <div className="space-y-2">
    {careersUsingSkill.map(career => (
      <Link
        href={`/admin/skills?userId=${userId}&tab=careers&highlight=${career.id}`}
        className="block p-2 hover:bg-blue-100 rounded transition"
      >
        <p className="font-medium">{career.name}</p>
        <p className="text-sm text-gray-600">
          {viewMode === 'family'
            ? `${Math.round(career.matchScore * 100)}% fit`
            : `Match: ${Math.round(career.matchScore * 100)}%`}
        </p>
      </Link>
    ))}
  </div>
</div>
```

**Careers → Skills Linking:**

```typescript
// Make skill names in requirements clickable
<button
  onClick={() => jumpToTab('skills', skillName)}
  className="text-blue-600 hover:underline"
>
  {skillName}
</button>
```

---

### **4.2 Breadcrumb Navigation**

**Add to ALL tabs:**

```typescript
<nav className="text-sm text-gray-600 mb-4">
  <Link href="/admin" className="hover:text-blue-600">All Students</Link>
  <ChevronRight className="inline w-4 h-4 mx-1" />
  <Link href={`/admin/skills?userId=${userId}`} className="hover:text-blue-600">
    {userName}
  </Link>
  <ChevronRight className="inline w-4 h-4 mx-1" />
  <span className="font-semibold text-gray-900">{currentTab}</span>
</nav>
```

---

### **4.3 "Next Tab" Suggestions**

**Add to bottom of each tab:**

```typescript
<div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
  <p className="text-sm text-gray-700 mb-3">
    {viewMode === 'family'
      ? "What to explore next:"
      : "Recommended next view:"}
  </p>
  <Button
    onClick={() => setActiveTab(nextTab)}
    variant="outline"
    className="w-full group"
  >
    <span>
      {nextTabSuggestions[currentTab].title}
    </span>
    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
  </Button>
</div>

// Tab flow suggestions
const nextTabSuggestions = {
  urgency: {
    tab: 'skills',
    title: {
      family: "See what skills they've shown",
      research: "View skill demonstration data"
    }
  },
  skills: {
    tab: 'careers',
    title: {
      family: "Explore matching careers",
      research: "Analyze career alignment"
    }
  },
  careers: {
    tab: 'gaps',
    title: {
      family: "See what to work on next",
      research: "View skill gap analysis"
    }
  },
  gaps: {
    tab: 'action',
    title: {
      family: "Get concrete next steps",
      research: "View development pathways"
    }
  },
};
```

---

## IMPLEMENTATION ROADMAP

### **Week 1: Core Language Improvements**
- Day 1-2: Implement global Family/Research mode toggle
- Day 3: Rewrite all narrative bridges (<25 words)
- Day 4: Rewrite Glass Box urgency narratives (severity-calibrated)
- Day 5: Test and iterate

### **Week 2: Chart & Visual Accessibility**
- Day 1: Add tooltips and click handlers to charts
- Day 2: Implement WCAG AA color contrast fixes
- Day 3: Add recency indicators and pattern insights
- Day 4-5: Cross-tab navigation and breadcrumbs

### **Week 3: Polish & Testing**
- Day 1-2: Add context to all metrics
- Day 3: Improve empty states
- Day 4: User testing with counselors
- Day 5: Iterate based on feedback

---

## SUCCESS METRICS

**Quantitative:**
- WCAG AA compliance: 100% (all text meets 4.5:1 contrast)
- Readability: All Family Mode text at 6th-8th grade reading level
- Brevity: All narrative bridges <25 words
- Context: 0 orphan percentages or metrics

**Qualitative:**
- Counselors can explain dashboard to parents without jargon
- Students can understand their own profiles in Family Mode
- Admins find data actionable, not overwhelming
- Positive, encouraging tone throughout

---

## MAINTENANCE GUIDELINES

**For all new features:**

1. **Always provide two versions:**
   - Family Mode: Plain English, conversational, encouraging
   - Research Mode: Technical, precise, data-focused

2. **Writing rules:**
   - Use student names (not "this student" or "the user")
   - Active voice only
   - <25 words for bridges
   - Always include context for metrics
   - Celebrate successes, frame challenges as opportunities

3. **Visual rules:**
   - All charts must have tooltips
   - All data points should be clickable
   - All colors must meet WCAG AA
   - All interactions must be keyboard-accessible

---

**Next Steps:** Review and approve this plan, then begin Week 1 implementation with global mode toggle.
