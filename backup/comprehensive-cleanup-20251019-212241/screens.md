# Grand Central Terminus Skills Dashboard - Screen Specifications

**Purpose**: Comprehensive reference for screenshot-based advisor analysis
**Date**: September 30, 2025
**Status**: Post Phase 2 Fixes (Careers & Gaps tabs now populated)

---

## Screen 1: Admin Dashboard Home

**Route**: `/admin`
**Component**: `app/admin/page.tsx`

### Purpose
Central hub for managing all user journeys and reviewing AI-generated choices

### Key UI Elements
1. **Header Section**
   - Title: "Grand Central Terminus Admin"
   - Subtitle: "Live Choice Review and Skills Analytics Dashboard"
   - "Back to Game" button (top-right)

2. **User Journeys Card**
   - Badge showing total user count
   - List of users with:
     - User ID (truncated to 12 chars)
     - Total demonstrations count
     - Milestones count badge
     - Most demonstrated skill with count
     - Top career match score (%)
     - "View Journey" button

3. **Live Choice Management Card**
   - ChoiceReviewTrigger component
   - For reviewing/validating AI-generated choices

4. **System Status Footer**
   - Green indicator showing content validation runs automatically

### Expected Data Output
```json
{
  "userIds": ["player_1759274143456", "player_1759264957278"],
  "userStats": {
    "player_1759274143456": {
      "totalDemonstrations": 3,
      "topSkill": ["emotionalIntelligence", [/* 2 demo objects */]],
      "topCareer": { "name": "Healthcare Technology Specialist", "matchScore": 0.045 },
      "milestones": 0
    }
  }
}
```

### User Value
**Administrator sees**: Overview of all student journeys at-a-glance
**Decision enabled**: Which students to deep-dive on based on engagement/progress

### Success Criteria
- [ ] User list displays with real data (not "No user journeys found yet")
- [ ] User IDs are clickable and navigate to individual dashboard
- [ ] Top skill shows actual skill name (not boilerplate)
- [ ] Career match score displays as percentage
- [ ] "View Journey" button navigates correctly

---

## Screen 2: Single User Dashboard - Header

**Route**: `/admin/skills?userId=player_XXXX`
**Component**: `components/admin/SingleUserDashboard.tsx`

### Purpose
User profile overview and navigation hub for 5 analytical tabs

### Key UI Elements
1. **Profile Header Card**
   - Username: `player_XXXX` (from profile.userName or userId)
   - Subtitle: "Skills-Based Career Profile"
   - Readiness badge (Near Ready / Skill Gaps / Exploratory)
   - Export Button (JSON download)

2. **Tab Navigation**
   - 5 tabs: Skills, Careers, Evidence, Gaps, Action
   - Grid layout responsive (2 cols mobile, 5 cols desktop)

### Expected Data Output
```json
{
  "userName": "User: player_1759274143456",
  "careerMatches": [
    { "name": "Healthcare Technology Specialist", "readiness": "exploring" }
  ]
}
```

### User Value
**Administrator sees**: Student identity and readiness level immediately
**Decision enabled**: Whether to export data, which tab to investigate first

### Success Criteria
- [ ] Username displays correctly
- [ ] Readiness badge reflects top career match readiness
- [ ] Export button downloads valid JSON
- [ ] All 5 tabs are clickable and load content

---

## Screen 3: Skills Tab - Evidence-First Design

**Component**: `SingleUserDashboard.tsx` - TabsContent "skills"

### Purpose
Display concrete evidence of skill demonstrations through actual choices made

### Key UI Elements
1. **Summary Line**
   - "Evidence-based skill profile from X demonstrations across journey"

2. **Skill Cards** (sorted by demonstration count, descending)
   - Left border color: Blue (skill highlighted)
   - Skill name (formatted from camelCase)
   - Demonstration count badge
   - **Key Evidence Section**:
     - Up to 3 most recent demonstrations
     - Each demo shows:
       - Scene name
       - Timestamp badge
       - Choice text (italic quote)
       - Context description
     - "View all X demonstrations" button if > 3 demos

### Expected Data Output (Example)
```json
{
  "skillDemonstrations": {
    "emotionalIntelligence": [
      {
        "scene": "maya_uab_revelation",
        "sceneDescription": "Maya discovers UAB biomedical program",
        "choice": "validate her feeling",
        "skillsDemonstrated": ["emotionalIntelligence", "communication", "creativity", "problemSolving"],
        "context": "Recognized and named moment of synthesis...",
        "timestamp": 1759274150691
      }
    ]
  },
  "totalDemonstrations": 3
}
```

### User Value
**Administrator sees**: WHAT student did (actual choices) that demonstrate skills
**Evidence-based**: Not just scores, but real narrative moments
**Pattern recognition**: Repeated skills across multiple scenes

### Success Criteria
- [ ] Skills display in order of demonstration count (most → least)
- [ ] Each skill card shows at least 1 demonstration
- [ ] Context is meaningful (not boilerplate like "User demonstrated X")
- [ ] Scene names are human-readable
- [ ] Timestamps format correctly
- [ ] "View all" button appears only if > 3 demos

### Rationale
**Why evidence-first?** Grant funders and educators need proof of skill development, not arbitrary percentages. Showing "Student chose 'Sometimes the best way to honor love is to live authentically' during family pressure scene" proves emotional intelligence more than "EQ: 85%"

---

## Screen 4: Careers Tab - Birmingham Pathways

**Component**: `SingleUserDashboard.tsx` - TabsContent "careers"

### Purpose
Show career matches with Birmingham-specific opportunities and skill requirements

### Key UI Elements
**Career Match Cards** (up to 5, sorted by matchScore)

Each card contains:
1. **Header**
   - Career name (e.g., "Healthcare Technology Specialist")
   - Readiness badge
   - Salary range
   - Birmingham relevance percentage

2. **Skill Requirements Section**
   - For each required skill:
     - Skill name
     - Current vs Required comparison
     - Progress bar (green if met, yellow if gap)
     - Gap percentage or "✓ Met"

3. **Education Pathways**
   - Badge list of education paths
   - Example: "UAB Health Informatics", "Jeff State Medical Technology"

4. **Birmingham Employers**
   - Badge list of local opportunities
   - Example: "UAB Hospital", "Children's Hospital"

5. **Readiness Footer**
   - Icon + message based on readiness level
   - Near Ready: Green checkmark
   - Skill Gaps: Yellow warning
   - Exploratory: Blue lightbulb

### Expected Data Output
```json
{
  "careerMatches": [
    {
      "name": "Healthcare Technology Specialist",
      "matchScore": 0.045,
      "readiness": "exploring",
      "salaryRange": [55000, 85000],
      "birminghamRelevance": 0.9,
      "requiredSkills": {
        "digitalLiteracy": { "current": 0.5, "required": 0.7, "gap": 0.2 },
        "communication": { "current": 0.5, "required": 0.7, "gap": 0.2 }
      },
      "educationPaths": ["UAB Health Informatics", "Jeff State Medical Technology"],
      "localOpportunities": ["UAB Hospital", "Children's Hospital"]
    }
  ]
}
```

### User Value
**Administrator sees**: Which careers align with student skills
**Actionable**: Specific Birmingham employers and education paths
**Gap awareness**: Clear visual of what skills need development

### Success Criteria (POST-FIX)
- [x] Career cards display (not empty array)
- [x] requiredSkills object exists with current/required/gap
- [ ] Skill progress bars render correctly
- [ ] Gap calculations accurate (gap = max(0, required - current))
- [ ] Birmingham relevance ≥ 80% for all careers
- [ ] Education paths are Birmingham-specific
- [ ] Local opportunities are real Birmingham employers

### Rationale
**Why Birmingham-specific?** Generic career advice fails youth. "UAB Hospital" is walkable from many neighborhoods; "Boston Children's Hospital" is not. Local paths = actionable paths.

---

## Screen 5: Evidence Tab - Scientific Frameworks

**Component**: `SingleUserDashboard.tsx` - TabsContent "evidence"

### Purpose
Demonstrate scientific rigor and measurable outcomes for grant funders

### Key UI Elements
1. **Framework Cards** (5 total)
   - World Economic Forum - 2030 Skills
   - Erikson's Identity Development Theory
   - Csikszentmihalyi's Flow Theory
   - Limbic System Learning Integration
   - Social Cognitive Career Theory

   Each card shows:
   - Framework name + badge
   - Framework description
   - Student outcomes box (blue background)
   - Specific metrics/progress

2. **Grant-Reportable Outcomes Card** (green border)
   - 4 large metric tiles:
     - Career Match Score (%)
     - Identity Clarity (%)
     - Advanced-Level Skills (#)
     - Birmingham Pathways Explored (#)
   - Funder-specific metrics list
   - Evidence-based validation

3. **Scientific Literature Support**
   - Citations for each framework

### Expected Data Output
Synthesized from:
- Total demonstrations count
- Top 3 skills by level
- Career match scores
- Journey duration/engagement

### User Value
**Grant writers see**: Validated scientific methodology
**Funders see**: Measurable outcomes tied to research
**Administrators see**: Academic legitimacy of the tool

### Success Criteria
- [ ] All 5 frameworks display
- [ ] Student outcome metrics are real (not hardcoded mock data)
- [ ] Grant metrics show actual student progress
- [ ] Citations are accurate
- [ ] Skill improvement percentages calculated correctly

### Rationale
**Why evidence-based frameworks?** Federal grants (DOL, NSF, ED) require research-backed methods. Showing "We use Erikson's identity development model and here are the measurable outcomes" unlocks funding. Vibes-based career tools don't.

---

## Screen 6: Gaps Tab - Skill Development Priorities

**Component**: `SingleUserDashboard.tsx` - TabsContent "gaps"

### Purpose
Identify specific skills student needs to develop for top career matches

### Key UI Elements
**Skill Gap Cards** (sorted by priority: high → medium → low)

Each card shows:
1. **Header**
   - Skill name (formatted)
   - Priority badge (high: red, medium/low: gray)

2. **Current Progress Bar**
   - Label: "Current"
   - Progress bar showing current skill level
   - Percentage (e.g., "58%")

3. **Target Progress Bar**
   - Label: "Target"
   - Full green bar (100%)
   - Target percentage (e.g., "80%")

4. **Development Path**
   - Italic text with actionable guidance
   - Example: "Community Health Worker requires team skills. Consider group project experiences."

### Expected Data Output (POST-FIX)
```json
{
  "skillGaps": [
    {
      "skill": "collaboration",
      "currentLevel": 0.58,
      "targetForTopCareers": 0.80,
      "gap": 0.22,
      "priority": "high",
      "developmentPath": "Community Health Worker requires team skills. Consider group project experiences."
    }
  ]
}
```

### User Value
**Administrator sees**: Exactly which skills block top career readiness
**Actionable**: Prioritized by importance (high/medium/low)
**Guidance**: Development path suggestions for each gap

### Success Criteria (POST-FIX)
- [x] skillGaps array exists (was empty pre-fix)
- [x] requiredSkills object in careerMatches provides gap data
- [ ] Gaps display sorted by priority
- [ ] Current vs Target bars render correctly
- [ ] Gap = max(0, target - current)
- [ ] Development path text is meaningful (not boilerplate)
- [ ] Only gaps > 0 display (don't show met skills)

### Rationale
**Why gaps over strengths?** Student has 85% emotional intelligence - great! But if Healthcare Tech needs 80% digital literacy and they have 68%, that 12% gap is the BLOCKER. Gaps = actionable focus areas.

### Implementation Fix Applied
In `/lib/skill-tracker.ts:385-408`:
```typescript
// Build requiredSkills object for gap analysis
const requiredSkillsObj: Record<string, { current: number; required: number; gap: number }> = {}
const requiredSkills = match.requiredSkills || []

requiredSkills.forEach((skillKey: string) => {
  const required = match.skillLevels?.[skillKey] || 0.7
  const current = internalSkills[skillKey] || 0.5
  const gap = Math.max(0, required - current)

  requiredSkillsObj[skillKey] = { current, required, gap }
})
```

This object is then used by `/lib/skill-profile-adapter.ts:calculateSkillGaps()` to populate the Gaps tab.

---

## Screen 7: Action Tab - Administrator Guidance

**Component**: `SingleUserDashboard.tsx` - TabsContent "action"

### Purpose
Provide concrete next steps for administrator working with this student

### Key UI Elements
1. **Conversation Starters**
   - 2-3 blue boxes with example dialogue
   - Based on student's actual skill profile
   - Example: "You showed strong emotional intelligence and problem-solving skills. Have you thought about healthcare technology roles that use both?"

2. **This Week** (Immediate Actions)
   - Checkmark icon + action item
   - Example: "Schedule UAB Health Informatics tour (87% career match, near ready)"

3. **Next Month** (Mid-term Actions)
   - Lightbulb icon + action item
   - Example: "Connect with UAB Hospital for shadowing"

4. **Avoid Section** (red heading)
   - What NOT to do based on student profile
   - Example: "• Pushing for immediate career commitment (still exploring)"

5. **Key Psychological Insights Card** (blue border)
   - Quotes from student's actual choices
   - Insight/analysis below each quote
   - Shows deeper meaning behind decisions

### Expected Data Output
Synthesized from:
- Top career match + readiness
- Skill gaps (high priority)
- Choice history and patterns
- Profile.keySkillMoments (if available)

### User Value
**Administrator gets**: Copy-paste conversation starters
**Time-saving**: No need to synthesize profile themselves
**Tailored**: Actions specific to THIS student's journey
**Psychological**: Insights reveal deeper motivations

### Success Criteria
- [ ] Conversation starters reference actual demonstrated skills
- [ ] "This Week" includes specific Birmingham location (UAB, etc.)
- [ ] Immediate actions align with "near_ready" careers
- [ ] "Avoid" section warns against mismatches (e.g., don't push commitment if still exploring)
- [ ] Key insights use real choice quotes (if available)

### Rationale
**Why administrator-focused?** The goal isn't student self-service - it's empowering counselors/teachers who work with 50+ students. They need: "Here's what to say, here's where to send them, here's what NOT to do."

---

## Cross-Screen Validation Tests

### Data Flow Integrity
1. **Admin Home → Skills Dashboard**
   - User ID from home page should load correct profile in skills page
   - Stats on home page should match totals in skills dashboard

2. **Skills Tab → Careers Tab**
   - Skills demonstrated in Skills tab should match required skills in Careers tab
   - Total demonstration count should be consistent

3. **Careers Tab → Gaps Tab**
   - Skill gaps should only show for skills required by top careers
   - Gap calculations (current vs required) should match Careers tab progress bars

4. **Evidence Tab Metrics**
   - "X demonstrations" should match totalDemonstrations
   - "Advanced-Level Skills" should count skills with high demonstration frequency
   - Career match score should match top career in Careers tab

5. **Action Tab Recommendations**
   - "Schedule [Location]" should reference educationPaths or localOpportunities from Careers tab
   - "Develop [Skill]" should match high-priority gaps from Gaps tab

### Birmingham Integration Validation
Every screen should show Birmingham-specific content:
- **Careers Tab**: UAB, Jeff State, Innovation Depot, Children's Hospital
- **Action Tab**: "Schedule UAB Health Informatics tour", not "Research careers online"
- **Evidence Tab**: "Birmingham Career Pathways Explored" metric

### Empty State Handling
Test these scenarios:
- **0 demonstrations**: Should show "No skill demonstrations recorded yet"
- **0 career matches**: Should not happen post-fix (always returns top 6)
- **0 skill gaps**: Should show "No significant gaps" (all skills meet requirements)

---

## Screenshot Capture Checklist

For advisor analysis, capture:

1. **Admin Home**
   - [ ] With 2+ users visible
   - [ ] Showing real demonstration counts (not 0)

2. **Skills Tab**
   - [ ] At least 2 skill cards expanded
   - [ ] Demonstration context visible (not truncated)

3. **Careers Tab**
   - [ ] Top career card fully visible
   - [ ] Skill requirement section expanded
   - [ ] Birmingham employers visible

4. **Evidence Tab**
   - [ ] 2-3 framework cards visible
   - [ ] Grant-reportable outcomes card visible

5. **Gaps Tab**
   - [ ] At least 1 high-priority gap visible
   - [ ] Current vs Target bars visible
   - [ ] Development path text visible

6. **Action Tab**
   - [ ] Conversation starters visible
   - [ ] "This Week" section visible
   - [ ] "Avoid" section visible

---

## Advisor Analysis Prompts

When sharing screenshots with advisor/Gemini, use these prompts:

### Prompt 1: Evidence Quality
> "Analyze the Skills tab screenshot. Is the 'context' field providing meaningful evidence of skill demonstration, or is it boilerplate text? Rate 1-10."

### Prompt 2: Birmingham Integration
> "Review the Careers tab. Are the education paths and local opportunities specific to Birmingham, Alabama? List any generic or placeholder content."

### Prompt 3: Actionability
> "Examine the Action tab. Are the 'This Week' recommendations concrete and time-bound? Can an administrator execute them without additional research?"

### Prompt 4: Grant-Readiness
> "Assess the Evidence tab. Would this satisfy a federal grant requirement for 'research-backed methodology' and 'measurable outcomes'? What's missing?"

### Prompt 5: Gap Utility
> "Study the Gaps tab. Do the skill gaps shown actually block progress toward the top career matches? Is the priority ranking (high/medium/low) logical?"

---

## Known Issues & Limitations (Pre-Advisor Review)

1. **Mock Data in SingleUserDashboard.tsx**
   - Lines 20-168 contain hardcoded `mockUserData`
   - Risk: If `profile` prop doesn't contain all fields, UI may fall back to mock
   - Validation needed: Confirm all fields come from real `SkillProfile` type

2. **Evidence Tab Outcomes**
   - Grant metrics may still reference hardcoded values (82%, 85%, etc.)
   - Need to confirm dynamic calculation from actual demonstrations

3. **Action Tab Insights**
   - `profile.keySkillMoments` may not exist in actual SkillProfile type
   - May need to synthesize from skillDemonstrations

4. **Export Button**
   - Need to verify JSON export includes ALL data shown in UI
   - Should match AFTER.json format from Phase 2 fix validation

---

## Success Definition

This dashboard is PRODUCTION-READY when:

✅ **Data Integrity**: All tabs show real data from skill tracker (not mock/placeholder)
✅ **Birmingham Focus**: Every career recommendation includes ≥3 local opportunities
✅ **Evidence-Based**: Skills tab shows concrete choice quotes, not "User demonstrated X"
✅ **Actionable**: Action tab recommendations are executable this week with zero research
✅ **Grant-Ready**: Evidence tab metrics calculate dynamically from student journey
✅ **Gap-Driven**: Gaps tab only shows skills that block top 3 career matches

Administrator should be able to:
1. View dashboard
2. Have 3-minute conversation with student using "Conversation Starters"
3. Schedule 1 Birmingham appointment from "This Week" section
4. Export JSON for parent/guidance counselor meeting

Total time: **5 minutes** per student. If it takes longer, UX failed.
