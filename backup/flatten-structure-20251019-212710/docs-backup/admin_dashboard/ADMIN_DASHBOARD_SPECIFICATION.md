# Admin Dashboard Specification
**Grand Central Terminus - Birmingham Career Exploration**

**Document Version:** 1.0
**Last Updated:** October 2, 2025
**Status:** Production

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Pages & Navigation](#pages--navigation)
4. [Component Catalog](#component-catalog)
5. [Data Models](#data-models)
6. [API Integration](#api-integration)
7. [User Interactions](#user-interactions)
8. [Visual Design System](#visual-design-system)
9. [Feature Specifications](#feature-specifications)
10. [Screenshots Reference](#screenshots-reference)

---

## Overview

### Purpose
The Admin Dashboard provides counselors, educators, and administrators with real-time insights into student career exploration journeys through Grand Central Terminus. It combines urgency triage, skills analytics, and evidence-based career guidance into a unified interface.

### Target Users
- **School Counselors**: Monitor student progress and identify intervention needs
- **Career Advisors**: Track skill development and provide tailored guidance
- **Administrators**: Generate reports and analyze program effectiveness
- **Educators**: Understand student engagement and learning outcomes

### Core Value Proposition
- **Glass Box Transparency**: Every metric has a human-readable narrative explanation
- **Evidence-Based**: All insights derived from actual player choices, not assumptions
- **Birmingham-Focused**: Local career pathways and partnership integration
- **Actionable**: Clear next steps for each student, not just data

---

## Architecture

### Technical Stack

**Frontend:**
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React useState/useEffect

**Backend:**
- **API Routes**: Next.js API routes (`/app/api/`)
- **Database**: Supabase PostgreSQL (via REST API)
- **Storage**: localStorage (client-side caching)
- **Authentication**: Admin API token via environment variables

**Data Flow:**
```
Player Game Session
    ↓
localStorage (skill_tracker_{userId})
    ↓
Admin Dashboard (reads localStorage)
    ↓
API Proxy (/api/admin-proxy/urgency)
    ↓
Supabase Database (urgency scores, evidence)
    ↓
Dashboard UI Rendering
```

### Key Directories

```
/app/admin/
├── page.tsx                    # Main admin dashboard (3 tabs)
└── skills/
    └── page.tsx                # Single user detailed profile (7 tabs)

/components/admin/
├── SingleUserDashboard.tsx     # Full user analytics
├── ExportButton.tsx            # PDF export functionality
├── AdvisorBriefingButton.tsx   # Narrative briefing generation
├── SkillProgressionChart.tsx   # Timeline visualization
└── SparklineTrend.tsx          # Mini trend indicators

/lib/
├── skill-profile-adapter.ts    # Converts SkillTracker → Dashboard format
├── skill-tracker.ts            # Core skill tracking logic
├── simple-career-analytics.ts  # Birmingham opportunities engine
├── types/admin.ts              # TypeScript interfaces
└── format-user-id.ts           # User ID formatting utilities

/app/api/
├── admin-proxy/urgency/        # Proxy for Supabase urgency API
├── user/skill-summaries/       # WEF 2030 skills endpoint
└── advisor-briefing/           # Narrative generation endpoint
```

---

## Pages & Navigation

### Page 1: Main Admin Dashboard (`/admin`)

**Route:** `/admin/page.tsx`

**Layout:**
- Header with title and "Back to Game" button
- 3-tab navigation: Student Triage | Student Journeys | Live Choices
- Tab-specific content areas

#### Tab 1: Student Triage (Urgency)

**Purpose:** Prioritize which students need immediate counselor intervention

**Components:**
- **Filter Dropdown**: All Urgent Students | All Students | Critical Only | High + Critical
- **Recalculate Button**: Triggers POST `/api/admin-proxy/urgency` to regenerate scores
- **Student Cards**: Vertical list of urgent students, each showing:
  - Urgency level badge (Critical/High/Medium/Low)
  - Urgency score percentage (0-100%)
  - Glass Box narrative (blue highlighted box)
  - 4 contributing factor bars: Disengagement (40%), Confusion (30%), Stress (20%), Isolation (10%)
  - Activity summary: Last active, Total choices, Scenes visited, Relationships formed
  - High/Critical alert banner (red) for actionable cases

**Empty States:**
- No urgent students: "No urgent students found. Try changing filter or run recalculation."
- Loading: Spinner with "Loading urgent students..."

**Data Source:** `/api/admin-proxy/urgency?level={filter}&limit=50`

#### Tab 2: Student Journeys

**Purpose:** Browse all students with skill demonstration data

**Components:**
- **User Count Badge**: Shows total users with data
- **User List**: Clickable cards for each user showing:
  - User ID (shortened, e.g., "user_2025...")
  - Relative time (e.g., "2 hours ago")
  - Milestone badges (e.g., "3 milestones")
  - Demonstrations count
  - Most demonstrated skill
  - Top career match percentage
  - "View Journey" button with arrow

**Empty States:**
- No users: "No user journeys found yet. Users need to complete at least 5 skill demonstrations."
- Includes "Generate Test User Data" button linking to `/test-data`

**Data Source:** localStorage (`skill_tracker_{userId}`)

#### Tab 3: Live Choices

**Purpose:** Review and validate AI-generated choices before they appear in gameplay

**Components:**
- `<ChoiceReviewTrigger />` component
- Informational note: "Content validation runs automatically when players load the game"

**Data Source:** localStorage choice review queue

---

### Page 2: Single User Profile (`/admin/skills?userId={userId}`)

**Route:** `/admin/skills/page.tsx`

**Layout:**
- Back button to admin dashboard
- User header card with name, readiness badge, action buttons
- 7-tab navigation: Urgency | Skills | Careers | Evidence | Gaps | Action | 2030 Skills
- Tab-specific detailed views

**Header Card:**
- User name (e.g., "User 2025...")
- Skills-Based Career Profile subtitle
- Readiness badge (Near Ready / Skill Gaps / Exploratory)
- **Advisor Briefing Button**: Generates narrative summary
- **Export Button**: Downloads PDF profile

#### Tab 1: Urgency

**Purpose:** Detailed urgency assessment for this specific student

**Components:**
- Recalculate button (same as main dashboard)
- Urgency level badge and percentage score
- **Glass Box Narrative** (blue box, italic): Human-readable explanation
- 4 contributing factor progress bars with weights
- Activity summary grid (4 metrics)
- High/Critical alert box (red) if urgent

**Unique Features:**
- Single-student focused (vs. multi-student triage)
- Same data structure as main dashboard triage tab

#### Tab 2: Skills

**Purpose:** Evidence-based skill profile from narrative choices

**Components:**
- **Skill Progression Chart**: Timeline visualization of skill development
- **Skill Cards** (sorted by demonstration count):
  - Skill name (formatted, e.g., "Critical Thinking")
  - Demonstration count badge
  - **Key Evidence Section**:
    - Up to 3 most recent demonstrations
    - Each showing: Scene name, Date badge, Choice quote (italic), Context explanation
  - "View all X demonstrations" button if more than 3

**Design Principles:**
- Evidence-first: No skill scores, only demonstration counts
- Border-left accent (blue) for visual hierarchy
- Chronological ordering of demonstrations

#### Tab 3: Careers

**Purpose:** Birmingham career pathway matches based on demonstrated skills

**Components:**
- **Narrative Bridge Box** (blue): Connects skill demonstrations to career matches
- **Career Match Cards**:
  - Career name and readiness badge
  - Salary range and Birmingham relevance percentage
  - **Skill Requirements Section**:
    - Mini progress bars for each required skill
    - Current vs. required values
    - Gap indicator (green checkmark or yellow gap %)
  - **Education Pathways**: Badge list (e.g., "UAB Health Informatics")
  - **Birmingham Employers**: Badge list (e.g., "UAB Hospital")
  - **Readiness Indicator**:
    - Near Ready (green): Small gaps, exploratory experiences recommended
    - Skill Gaps (yellow): Good foundation, see Gaps tab
    - Worth Exploring (blue): Moderate match, informational interviews

**Data Source:** `profile.careerMatches` from skill-profile-adapter

#### Tab 4: Evidence

**Purpose:** Scientific frameworks for grant reporting and accountability

**Components:**
- **Data Source Alert** (top):
  - Blue: Real Student Data (10+ demonstrations)
  - Yellow: Partial Data (5-9 demonstrations)
  - Gray: Insufficient Data (<5 demonstrations)
  - Mock Data badge if insufficient

- **6 Framework Cards**:
  1. **Skill Evidence Framework**:
     - Badge: "{X} Skills Tracked"
     - Data source badge (Real/Partial/Mock)
     - Description and student outcomes
  2. **Career Readiness Framework**:
     - Badge: "{X} Careers Explored"
     - Top match details, Birmingham opportunities count
  3. **Pattern Recognition Framework**:
     - Badge: "Behavioral Analysis"
     - Pattern consistency percentage, total choices
  4. **Time Investment Framework**:
     - Badge: "Engagement Tracking"
     - Days active, avg demos/day, consistency score
  5. **Relationship Development Framework**:
     - Badge: "{X} Relationships"
     - Average trust level, character breakdowns
  6. **Behavioral Consistency Framework**:
     - Badge: "Focus Analysis"
     - Focus vs. exploration scores, platform alignment

- **Scientific Literature Support Card**:
  - WEF Future of Jobs Report (2020, 2023)
  - Holland's Making Vocational Choices (1997)
  - Behavioral consistency research
  - Social-emotional learning frameworks

**Data Source:** `/api/admin/evidence/{userId}`

#### Tab 5: Gaps

**Purpose:** Identify skill development needs for career readiness

**Components:**
- **Narrative Bridge Box** (amber): Connects career exploration to skill gaps
- **Skill Gap Cards** (sorted by priority):
  - Skill name with sparkline trend indicator
  - Priority badge (High/Medium/Low)
  - Current level progress bar
  - Target level progress bar (green)
  - Development path recommendation text

**Empty States:**
- No gaps: "No skill gap data available yet. Student needs to complete more of the journey."

#### Tab 6: Action

**Purpose:** Administrator next steps and conversation guides

**Components:**
- **Narrative Bridge Box** (green): Converts analysis into concrete actions

- **Conversation Starters** (blue boxes):
  - Skill-based opener (e.g., "You showed strong emotional intelligence...")
  - Gap-focused question

- **This Week Actions** (green checkmarks):
  - Immediate steps with specific Birmingham connections

- **Next Month Actions** (blue lightbulbs):
  - Medium-term planning steps

- **What to Avoid** (red warning):
  - Anti-patterns based on student profile

- **Key Psychological Insights Card** (blue border):
  - Quote from player choice
  - Insight about decision-making pattern

#### Tab 7: 2030 Skills

**Purpose:** WEF skills framework tracking and Birmingham career connections

**Components:**
- **Narrative Bridge Box** (purple): Explains WEF framework relevance

- **2030 Skills Trajectory Card**:
  - Top 5 skills bar chart (color-coded by frequency)
  - Summary stats grid: Skills Demonstrated | Total Demonstrations | Scenes Involved

- **Latest Skill Demonstrations Table**:
  - Expandable rows for each skill
  - Shows: Skill name, context snippet, demonstration count, last demonstrated date
  - Expanded view: Full context, scenes involved badges

- **Birmingham Career Connections Card** (green):
  - Top 3 skills mapped to local employers/programs
  - Arrow list format (e.g., "→ UAB Healthcare")

- **WEF Framework Reference Card** (blue border):
  - Skill categories: Cognitive, Social-Emotional, Self-Management, Technical
  - Full skill list by category
  - Note about automatic tracking

**Data Source:** `/api/user/skill-summaries?userId={userId}`

---

## Component Catalog

### Core UI Components (shadcn/ui)

**Card Components:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title Text</CardTitle>
    <CardDescription>Subtitle text</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
</Card>
```

**Tabs Components:**
```tsx
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    {/* Tab 1 content */}
  </TabsContent>
</Tabs>
```

**Badge Component:**
```tsx
<Badge variant="default | secondary | outline | destructive">
  Badge Text
</Badge>
```

**Button Component:**
```tsx
<Button
  variant="default | outline | ghost | destructive"
  size="default | sm | lg"
  onClick={handleClick}
>
  Button Text
</Button>
```

**Progress Bar:**
```tsx
<Progress value={75} className="h-2" />
```

**Alert Component:**
```tsx
<Alert variant="default | destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertDescription>
    Alert message text
  </AlertDescription>
</Alert>
```

### Custom Admin Components

**DataSourceBadge:**
- Purpose: Shows whether data is real, partial, or mock
- Props: `hasRealData: boolean`, `minDemonstrations: number`, `actualDemonstrations: number`
- Variants:
  - Green: Real Data ({count} demos)
  - Yellow: Partial ({count}/{min} demos)
  - Gray: Mock Data ({count}/{min} demos)

**SkillProgressionChart:**
- Purpose: Timeline visualization of skill development
- Props: `skillDemonstrations`, `totalDemonstrations`
- Renders: Interactive chart showing skill growth over time

**SparklineTrend:**
- Purpose: Mini trend indicator for skill gaps
- Props: `current: number`, `target: number`, `width: number`, `height: number`
- Renders: Small inline trend graph

**UrgentStudentCard:**
- Purpose: Display student urgency assessment
- Props: `student: UrgentStudent`
- Features:
  - Color-coded borders (red/orange/yellow/green)
  - Urgency icon and percentage
  - Glass Box narrative
  - Contributing factors bars
  - Activity summary

**FactorBar:**
- Purpose: Visual urgency factor representation
- Props: `label: string`, `value: number`
- Renders: Label + progress bar + percentage

**ExportButton:**
- Purpose: Download PDF skill profile
- Props: `profile: SkillProfile`, `variant`, `size`
- Action: Generates and downloads PDF

**AdvisorBriefingButton:**
- Purpose: Generate narrative briefing
- Props: `profile: SkillProfile`, `variant`, `size`
- Action: Opens modal with AI-generated briefing

---

## Data Models

### UrgentStudent Interface
```typescript
interface UrgentStudent {
  // Identity
  userId: string
  currentScene: string
  totalDemonstrations: number
  lastActivity: string

  // Urgency assessment
  urgencyScore: number                    // 0-1 scale
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical'
  urgencyNarrative: string                // Human-readable explanation

  // Contributing factors (0-1 scale)
  disengagementScore: number              // 40% weight
  confusionScore: number                  // 30% weight
  stressScore: number                     // 20% weight
  isolationScore: number                  // 10% weight

  // Activity summary
  totalChoices: number
  uniqueScenesVisited: number
  totalSceneVisits: number

  // Pattern summary
  helpingPattern: number | null
  rushingPattern: number | null
  exploringPattern: number | null

  // Relationship summary
  relationshipsFormed: number
  avgTrustLevel: number | null

  // Milestone summary
  milestonesReached: number

  // Metadata
  lastCalculated: string | null
}
```

### SkillProfile Interface
```typescript
interface SkillProfile {
  userId: string
  userName: string
  skillDemonstrations: SkillDemonstrations
  careerMatches: CareerMatch[]
  skillEvolution: SkillEvolutionPoint[]
  keySkillMoments: KeySkillMoment[]
  skillGaps: SkillGap[]
  totalDemonstrations: number
  milestones: string[]
}

interface SkillDemonstration {
  scene: string
  choice?: string               // Actual player choice text
  sceneDescription?: string     // Scene context
  context: string               // Analysis/explanation
  value: number
  timestamp?: number
}

interface CareerMatch {
  id: string
  name: string
  matchScore: number
  requiredSkills: {
    [skillKey: string]: {
      current: number
      required: number
      gap: number
    }
  }
  salaryRange: [number, number]
  educationPaths: string[]
  localOpportunities: string[]
  birminghamRelevance: number
  growthProjection: 'high' | 'medium' | 'stable'
  readiness: 'near_ready' | 'skill_gaps' | 'exploratory'
}

interface SkillGap {
  skill: string
  currentLevel: number
  targetForTopCareers: number
  gap: number
  priority: 'high' | 'medium' | 'low'
  developmentPath: string
}
```

### SkillSummary Interface (2030 Skills Tab)
```typescript
interface SkillSummary {
  skillName: string
  demonstrationCount: number
  latestContext: string
  scenesInvolved: string[]
  lastDemonstrated: string
}
```

### Birmingham Opportunities
```typescript
interface SimpleBirminghamOpportunity {
  id: string
  name: string
  organization: string
  type: 'internship' | 'job_shadow' | 'career_program' | 'volunteer'
  careerArea: 'healthcare' | 'technology' | 'engineering' | 'education' | 'nonprofit'
}

// Example opportunities:
const BIRMINGHAM_OPPORTUNITIES = [
  { id: 'uab-medical', name: 'Medical Shadowing', organization: 'UAB Medical Center', type: 'job_shadow', careerArea: 'healthcare' },
  { id: 'regions-it', name: 'IT Internship', organization: 'Regions Bank', type: 'internship', careerArea: 'technology' },
  { id: 'southern-energy', name: 'Engineering Program', organization: 'Southern Company', type: 'career_program', careerArea: 'engineering' }
  // ... 14 total opportunities
]
```

---

## API Integration

### Admin Proxy Endpoints

**GET `/api/admin-proxy/urgency`**
- **Purpose:** Fetch urgent students list (protects admin token from client)
- **Query Params:**
  - `level`: 'all' | 'critical' | 'high' | 'all-students'
  - `limit`: number (default: 50)
- **Response:**
  ```json
  {
    "students": [UrgentStudent[]],
    "count": number,
    "timestamp": string
  }
  ```
- **Special Case:** `level=all-students` returns localStorage fallback (no Supabase)
- **Auth:** Server-side `ADMIN_API_TOKEN` environment variable

**POST `/api/admin-proxy/urgency`**
- **Purpose:** Trigger urgency score recalculation for all players
- **Response:**
  ```json
  {
    "message": string,
    "playersProcessed": number,
    "timestamp": string
  }
  ```

### User Skills Endpoints

**GET `/api/user/skill-summaries`**
- **Purpose:** Fetch 2030 skills data for a user
- **Query Params:**
  - `userId`: string (required)
- **Response:**
  ```json
  {
    "success": boolean,
    "summaries": SkillSummary[]
  }
  ```
- **Auth:** No token required (user-scoped endpoint)

### Evidence Framework Endpoint

**GET `/api/admin/evidence/{userId}`**
- **Purpose:** Fetch evidence-based framework data
- **Response:**
  ```json
  {
    "frameworks": {
      "skillEvidence": { hasRealData, totalDemonstrations, uniqueSkills, skillBreakdown },
      "careerReadiness": { hasRealData, exploredCareers, topMatch, birminghamOpportunities },
      "patternRecognition": { hasRealData, totalChoices, patternConsistency, behavioralTrends },
      "timeInvestment": { hasRealData, totalDays, averageDemosPerDay, consistencyScore },
      "relationshipFramework": { hasRealData, totalRelationships, averageTrust, relationshipDetails },
      "behavioralConsistency": { hasRealData, focusScore, explorationScore, platformAlignment }
    },
    "careerExploration": { totalExplorations, skillsDemonstrated, paths },
    "skillSummaries": SkillSummary[]
  }
  ```

### Advisor Briefing Endpoint

**POST `/api/advisor-briefing`**
- **Purpose:** Generate narrative briefing for counselor use
- **Body:**
  ```json
  {
    "profile": SkillProfile
  }
  ```
- **Response:**
  ```json
  {
    "briefing": string,
    "timestamp": string
  }
  ```

---

## User Interactions

### Main Dashboard Interactions

**Student Triage Tab:**
1. **Filter Change**: Dropdown selection triggers `fetchUrgentStudents()` API call
2. **Recalculate Button**:
   - Shows spinner animation
   - POST to `/api/admin-proxy/urgency`
   - Refetches student list on success
3. **Student Card Click**: Links to `/admin/skills?userId={userId}`

**Student Journeys Tab:**
1. **User Card Hover**: Background changes to gray-50, border to blue-500
2. **Click Card**: Navigate to `/admin/skills?userId={userId}`
3. **View Journey Button**: Same navigation with hover state

**Live Choices Tab:**
1. **Review Queue Button**: Opens `<ChoiceReviewPanel>` modal
2. **Modal Interactions**:
   - Close button (X)
   - Approve button: Saves choice to approved cache
   - Reject button: Marks choice as rejected
   - Edit textarea: Inline editing of choice text

### Single User Profile Interactions

**Header Actions:**
1. **Back Button**: Navigate to `/admin`
2. **Advisor Briefing Button**:
   - Opens modal
   - Generates narrative using `/api/advisor-briefing`
   - Shows loading state
   - Displays briefing with copy button
3. **Export Button**:
   - Generates PDF using `@react-pdf/renderer`
   - Downloads as `{userName}_skill_profile.pdf`

**Tab Navigation:**
1. **Tab Click**: Updates `activeTab` state, content switches with fade
2. **Mobile**: Tabs become scrollable horizontal list

**Skills Tab:**
1. **Skill Card**: Shows top 3 demonstrations
2. **"View all X demonstrations" Button**: Expands to show all (future feature)
3. **Timeline Chart**: Hover shows tooltip with exact values

**Careers Tab:**
1. **Skill Progress Bars**: Animate on tab load
2. **Badge Hover**: Shows tooltip (future feature)

**Evidence Tab:**
1. **Framework Cards**: Display read-only metrics
2. **Data Source Badge**: Tooltip explains real/partial/mock (future feature)

**Gaps Tab:**
1. **Priority Sorting**: High → Medium → Low
2. **Sparkline Trends**: Visual current-to-target indicators

**Action Tab:**
1. **Read-only**: No interactive elements, copy-friendly text

**2030 Skills Tab:**
1. **Skill Row Click**: Expands to show full context and scenes
2. **Collapse**: Click again to hide details
3. **Bar Chart**: Animated on load

---

## Visual Design System

### Color Palette

**Urgency Colors:**
- Critical: Red (#EF4444, red-500) - Border, backgrounds, badges
- High: Orange (#F97316, orange-500)
- Medium: Yellow (#EAB308, yellow-500)
- Low: Green (#22C55E, green-500)
- Pending: Gray (#6B7280, gray-500)

**Functional Colors:**
- Primary Blue: #3B82F6 (blue-600) - Actions, links, highlights
- Success Green: #22C55E (green-600) - Checkmarks, positive states
- Warning Yellow: #EAB308 (yellow-600) - Caution, partial data
- Error Red: #DC2626 (red-600) - Alerts, critical states
- Neutral Gray: #6B7280 (gray-600) - Text, borders

**Background Colors:**
- Page Background: #F9FAFB (gray-50)
- Card Background: #FFFFFF (white)
- Narrative Box: #DBEAFE (blue-50) - Glass Box narratives
- Alert Background: #FEF2F2 (red-50), #FEF3C7 (yellow-50), etc.

### Typography

**Font Family:** System font stack (Tailwind default)
```css
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

**Font Sizes:**
- Page Title: 3xl (1.875rem)
- Card Title: xl-2xl (1.25-1.5rem)
- Section Title: lg (1.125rem)
- Body Text: base (1rem)
- Small Text: sm (0.875rem)
- Tiny Text: xs (0.75rem)

**Font Weights:**
- Bold: 700 (titles, emphasis)
- Semibold: 600 (section headers)
- Medium: 500 (labels)
- Regular: 400 (body text)

### Spacing

**Margin/Padding Scale:**
- xs: 0.25rem (1)
- sm: 0.5rem (2)
- md: 1rem (4)
- lg: 1.5rem (6)
- xl: 2rem (8)
- 2xl: 3rem (12)

**Card Spacing:**
- Padding: p-4 to p-6 (1-1.5rem)
- Gap between cards: space-y-4 (1rem)

### Borders & Shadows

**Borders:**
- Default: 1px solid #E5E7EB (gray-200)
- Accent left: 4px solid (urgency-color)
- Rounded: rounded-lg (0.5rem)

**Shadows:**
- Card: shadow-lg (0 10px 15px -3px rgba(0, 0, 0, 0.1))
- Hover: shadow-sm (0 1px 2px 0 rgba(0, 0, 0, 0.05))
- Modal: shadow-xl (0 20px 25px -5px rgba(0, 0, 0, 0.1))

### Icons

**Icon Library:** Lucide React

**Commonly Used Icons:**
- `<AlertTriangle>` - Urgency, warnings
- `<Users>` - Student journeys
- `<TrendingUp>` - Live choices, analytics
- `<Award>` - Milestones, achievements
- `<Briefcase>` - Careers, action plans
- `<Lightbulb>` - Insights, exploration
- `<CheckCircle2>` - Success, completion
- `<RefreshCw>` - Recalculate, reload
- `<ArrowRight>` - Navigation
- `<Building2>` - Birmingham opportunities
- `<BookOpen>` - Skills, learning

**Icon Sizing:**
- Small: w-4 h-4 (1rem)
- Medium: w-5 h-5 (1.25rem)
- Large: w-8 h-8 (2rem)

### Responsive Design

**Breakpoints:**
- Mobile: < 640px (sm)
- Tablet: 640px - 768px (sm-md)
- Desktop: > 768px (md+)

**Responsive Patterns:**
- Tab list: `grid-cols-2 sm:grid-cols-7` (2 cols mobile, 7 cols desktop)
- Stats grid: `grid-cols-2 md:grid-cols-4` (2 cols mobile, 4 cols desktop)
- Max width: `max-w-2xl` to `max-w-7xl` depending on page

---

## Feature Specifications

### 1. Glass Box Urgency Triage

**Concept:** Every urgency score includes a human-readable narrative explaining *why* the score was assigned.

**Implementation:**
- Urgency calculated server-side in Supabase using behavior analytics
- 4 contributing factors with weighted formula:
  - Disengagement (40%): Low choice count, abandoned sessions
  - Confusion (30%): Pattern inconsistency, rushed decisions
  - Stress (20%): Short response times, avoidance patterns
  - Isolation (10%): Low relationship formation
- Narrative generated via LLM based on factor combination

**Example Narrative:**
> "This student shows moderate disengagement (visits 3 scenes but makes minimal choices) and high confusion (pattern inconsistency across platforms). However, strong emotional intelligence demonstrations suggest receptiveness to guidance. Recommended: Scheduled check-in to address exploration barriers."

### 2. Evidence-Based Skill Tracking

**Principle:** No skill scores or self-assessments. All data derived from actual narrative choices.

**How It Works:**
1. Player makes choice in game (e.g., "Sometimes the best way to honor love is to live authentically")
2. SkillTracker records demonstration:
   ```javascript
   {
     scene: "maya-family-love",
     choice: "Sometimes the best way...",
     context: "Recognized emotional complexity while thinking strategically",
     skills: ["emotionalIntelligence", "criticalThinking"],
     timestamp: 1728394847123
   }
   ```
3. Dashboard displays demonstration with full context
4. No numerical score assigned - only demonstration count

**Benefits:**
- Counselors see actual student choices, not abstract scores
- Students can't game the system
- Evidence trail for grant reporting

### 3. Birmingham Career Integration

**Local Partnerships:**
- UAB Medical Center (healthcare shadowing, internships)
- Regions Bank (IT internships, financial literacy)
- Southern Company (engineering programs)
- Innovation Depot (tech startups, entrepreneurship)
- Birmingham City Schools (education pathways)
- Children's of Alabama (pediatric specialties)
- YMCA of Greater Birmingham (youth programs)

**Data Structure:**
```javascript
const opportunities = {
  'uab-medical': {
    name: 'Medical Shadowing',
    organization: 'UAB Medical Center',
    type: 'job_shadow',
    careerArea: 'healthcare',
    requirements: ['High school student', 'Health screening'],
    applicationMethod: 'UAB Volunteer Services application',
    website: 'https://www.uabmedicine.org/volunteer'
  }
  // ... 16 more opportunities
}
```

**Matching Logic:**
- Skills demonstrated → Career areas
- Career areas → Birmingham opportunities
- Display top 3-5 matches in Career tab

### 4. Narrative Bridges Between Tabs

**Purpose:** Help counselors understand how insights connect across different views

**Implementation:**
- Each major tab includes a colored "bridge box" at the top
- Explains relationship between previous tab and current tab

**Examples:**

**Skills → Careers:**
> "Based on 12 skill demonstrations, here are Birmingham career pathways where Jamal's strengths align best. Match scores reflect readiness across skill requirements, education access, and local opportunities."

**Careers → Gaps:**
> "Based on 3 career explorations, here are skill areas to strengthen. These gaps aren't weaknesses—they're growth areas with clear pathways forward."

**Gaps → Action:**
> "Here are Birmingham-based next steps to close the collaboration gap and advance toward Community Health Worker. These are concrete, local opportunities you can facilitate this week."

### 5. Advisor Briefing Generation

**Trigger:** Click "Advisor Briefing" button in user header

**Process:**
1. Collects full SkillProfile data
2. POST to `/api/advisor-briefing`
3. LLM generates narrative briefing:
   - Student snapshot
   - Top 3 demonstrated skills with quotes
   - Career readiness assessment
   - Psychological insights from choice patterns
   - Concrete next steps
   - Red flags (if any)
4. Displays in modal with copy button

**Format:**
```
ADVISOR BRIEFING: User 2025...
Generated: October 2, 2025

STUDENT SNAPSHOT:
Jamal has completed 12 skill demonstrations across 8 scenes...

TOP DEMONSTRATED SKILLS:
1. Emotional Intelligence (4 demonstrations)
   - "Sometimes the best way to honor love is to live authentically"
   - Context: Maya family scene - recognized emotional weight...

CAREER READINESS:
Near Ready for Healthcare Technology Specialist (87% match)...
```

### 6. PDF Export Functionality

**Trigger:** Click "Export" button in user header

**Technology:** `@react-pdf/renderer`

**Contents:**
- Header with student name and date
- Skills summary table
- Career matches with readiness
- Skill gaps prioritized
- Birmingham opportunities list
- Key skill moments quotes
- Administrator action plan

**Filename:** `{userName}_skill_profile_{timestamp}.pdf`

### 7. Live Choice Review System

**Purpose:** Quality control for AI-generated narrative choices

**Workflow:**
1. AI generates choice for player (e.g., via Gemini)
2. Choice added to review queue in localStorage
3. ChoiceReviewPanel shows pending choices
4. Writer can:
   - Approve as-is
   - Edit text before approving
   - Reject and force regeneration
5. Approved choices cached for future use

**Panel Components:**
- Scene context (what happened)
- Existing choices (for comparison)
- Generated choice text (editable textarea)
- AI confidence score badge
- AI justification explanation
- Player persona summary
- Approve/Reject buttons

**Statistics Display:**
- Total generated
- Approval rate percentage
- Pending review count
- Cached choices count

---

## Screenshots Reference

**Test User:** `test_low_active_healthy` (most complete data available)
**Screenshot Location:** `/docs/screenshots/admin/`
**Capture Date:** October 2, 2025
**Total Screenshots:** 7 captured (417KB)

### Captured Screenshots

#### 1. Main Admin Dashboard - Urgency Triage (Default View)
**File:** `01-urgency-triage-all.png` (65KB)
**URL:** `/admin`
**Description:** Main admin dashboard showing the Urgency Triage tab with default "All Urgent Students" filter. Displays student cards with urgency level badges, Glass Box narratives, contributing factor bars (Disengagement, Confusion, Stress, Isolation), and activity summaries (last active, total choices, scenes visited, relationships formed).

**Key Elements:**
- Header with "Admin Dashboard" title and "Back to Game" button
- 3-tab navigation: Student Triage (active) | Student Journeys | Live Choices
- Filter dropdown showing "All Urgent Students"
- "Recalculate Urgency Scores" button
- Student cards with urgency badges (Critical/High/Medium/Low)
- Glass Box narrative explanations in blue highlighted boxes

---

#### 2. Urgency Triage - All Students Filter
**File:** `02-urgency-triage-all-students.png` (64KB)
**URL:** `/admin` (filter: all-students)
**Description:** Same urgency triage view with "All Students" filter applied, showing expanded student list beyond just urgent cases.

**Key Elements:**
- Filter dropdown changed to "All Students"
- Potentially more student cards visible
- Same card structure and Glass Box narratives

---

#### 3. Urgency Triage - Critical Only Filter
**File:** `03-urgency-triage-critical.png` (61KB)
**URL:** `/admin` (filter: critical)
**Description:** Urgency triage filtered to show only Critical urgency level students (85-100% urgency score). Red alert banners highlight immediate intervention needs.

**Key Elements:**
- Filter dropdown set to "Critical Only"
- Only students with 85-100% urgency scores displayed
- High-priority red alert boxes
- Glass Box narratives explaining critical intervention needs

---

#### 4. Urgency Triage - High + Critical Filter
**File:** `04-urgency-triage-high.png` (61KB)
**URL:** `/admin` (filter: high)
**Description:** Combined view of High (70-84%) and Critical (85-100%) urgency students, providing counselors with a focused intervention priority list.

**Key Elements:**
- Filter dropdown set to "High + Critical"
- Students with 70-100% urgency scores
- Mix of orange (High) and red (Critical) urgency badges

---

#### 5. Student Journeys Tab - Overview
**File:** `05-student-journeys-overview.png` (63KB)
**URL:** `/admin` (Student Journeys tab)
**Description:** Browse view of all students with skill demonstration data. Shows clickable user cards with journey summaries including milestones, demonstration counts, top skills, and career matches.

**Key Elements:**
- Student Journeys tab active
- User count badge showing total users with data
- User cards displaying:
  - Shortened user ID (e.g., "user_2025...")
  - Relative time (e.g., "2 hours ago")
  - Milestone badges count
  - Total skill demonstrations
  - Most demonstrated skill
  - Top career match percentage
  - "View Journey" button with arrow

---

#### 6. Live Choices Panel
**File:** `06-live-choices-panel.png` (59KB)
**URL:** `/admin` (Live Choices tab)
**Description:** AI-generated choice review and validation interface. Shows the ChoiceReviewTrigger component with informational note about automatic content validation.

**Key Elements:**
- Live Choices tab active
- Choice review trigger button/component
- Informational note: "Content validation runs automatically when players load the game"
- localStorage choice review queue status

---

#### 7. Student Profile - Skills Tab Overview
**File:** `07-student-skills-overview.png` (44KB)
**URL:** `/admin/skills?userId=test_low_active_healthy`
**Description:** Individual student profile showing the Skills tab with detailed skill demonstration data. Includes header card with readiness badge, Advisor Briefing button, and Export button.

**Key Elements:**
- Back button to admin dashboard
- User header card:
  - User name: "test_low_active_healthy"
  - "Skills-Based Career Profile" subtitle
  - Readiness badge (Near Ready / Skill Gaps / Exploratory)
  - "Advisor Briefing" button (narrative generation)
  - "Export" button (PDF download)
- Skills tab active (7-tab navigation visible)
- Skill progression timeline/chart
- Individual skill cards with demonstration details
- Evidence quotes from gameplay choices

---

### Screenshots Not Captured

**Note:** The following student profile tabs could not be captured via automated Playwright due to tab navigation structure. These tabs exist in the `<SingleUserDashboard>` component but require manual interaction or different selectors:

- **Careers Tab:** Career matches with Birmingham employers, readiness indicators
- **Evidence Tab:** Data source alerts, framework metrics, scientific literature
- **Gaps Tab:** Skill gap analysis with sparklines and priority sorting
- **Action Tab:** Conversation starters, This Week/Next Month recommendations
- **2030 Skills Tab:** WEF 2030 skills bar chart with expandable demonstrations
- **Urgency Tab:** Individual student urgency detail view

**Recommendation:** Capture these manually via browser DevTools or update the automated script with correct tab selectors from the SingleUserDashboard component implementation.
    - Birmingham career connections

11. **Advisor Briefing Modal**
    - Full briefing text
    - Copy button interaction

12. **PDF Export Sample**
    - First page of exported PDF
    - Skills and careers sections

---

## Implementation Notes

### Performance Considerations

1. **Data Loading:**
   - Use React Suspense for async data fetching
   - Show loading spinners during API calls
   - Cache localStorage reads to avoid re-parsing

2. **Large Lists:**
   - Limit urgency query to 50 students
   - Paginate if more than 20 users in journeys list (future enhancement)
   - Lazy load skill demonstration details

3. **API Rate Limits:**
   - Debounce recalculate button (prevent spam)
   - Cache API responses for 2 minutes
   - Use proxy endpoints to protect tokens

### Accessibility

1. **Keyboard Navigation:**
   - All tabs accessible via Tab key
   - Escape closes modals
   - Enter activates buttons

2. **Screen Readers:**
   - All icons have aria-labels
   - Alert components use role="alert"
   - Tab panels have aria-labelledby

3. **Color Contrast:**
   - All text meets WCAG AA standards (4.5:1 ratio)
   - Urgency colors tested for accessibility
   - Focus indicators visible on all interactive elements

### Security

1. **Admin Token Protection:**
   - Token stored in `.env.local`, never in client bundle
   - API proxy endpoints handle token injection
   - No localStorage storage of sensitive data

2. **User Data Privacy:**
   - User IDs anonymized (e.g., "User 2025...")
   - No personally identifiable information displayed
   - Data stays in localStorage unless synced to Supabase

3. **XSS Prevention:**
   - All user-generated text sanitized
   - React escapes by default
   - No `dangerouslySetInnerHTML` usage

### Future Enhancements

1. **Real-Time Updates:**
   - WebSocket connection for live urgency scores
   - Auto-refresh when new students complete journeys
   - Notification badge for new urgent students

2. **Advanced Filtering:**
   - Multi-select career area filter
   - Date range selector for activity
   - Skill proficiency level filter

3. **Batch Actions:**
   - Select multiple students for group export
   - Bulk recalculate urgency
   - Multi-user comparison view

4. **Custom Reports:**
   - Build custom report templates
   - Schedule automated email reports
   - Export to CSV/Excel format

5. **Birmingham Partnership Dashboard:**
   - Track opportunity application rates
   - Measure program effectiveness
   - Partner feedback integration

---

## Conclusion

The Grand Central Terminus Admin Dashboard represents a comprehensive, evidence-based approach to career counseling analytics. By combining urgency triage, skills tracking, and Birmingham-specific career guidance, it provides counselors with actionable insights grounded in real student behavior.

**Key Differentiators:**
- **Glass Box Transparency**: Every metric has a narrative explanation
- **Evidence-First**: No scores, only demonstrated behaviors
- **Birmingham-Focused**: Local partnerships and pathways integrated throughout
- **Actionable**: Clear next steps, not just data visualization

**Technical Highlights:**
- Modern React architecture with TypeScript safety
- Clean separation of concerns (adapter pattern)
- Secure API proxy pattern for token protection
- Responsive design from mobile to desktop

For questions or contributions, see the main project documentation at `/CLAUDE.md`.

---

**Document Maintained By:** Development Team
**Last Review:** October 2, 2025
**Next Review:** December 2025 (Post-Phase 3 completion)
