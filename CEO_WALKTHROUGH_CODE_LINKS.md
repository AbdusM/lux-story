# CEO Walkthrough - Code Pages

Quick reference guide to key code files demonstrating the platform's underlying mechanics.

---

## 🎯 Walkthrough Order

### 1. The Experience (Play First)
**What to show:** Play through Maya's introduction scene
- Demonstrate dialogue and choices
- Show ChatPacedDialogue in action
- Make a choice and see the story branch

**Talking Point:** "This is what students experience - narrative-driven career exploration"

---

### 2. Choice → Skills Mapping
**File:** [`content/maya-dialogue-graph.ts`](./content/maya-dialogue-graph.ts#L29-L60)

**Lines to show:** 29-60

**Key Code:**
```typescript
choices: [
  {
    text: "You're trying to be two things at once.",
    pattern: 'helping',
    skills: ['emotional_intelligence', 'communication'],
    consequence: {
      characterId: 'maya',
      trustChange: 1
    }
  }
]
```

**Talking Point:** *"Every choice is annotated with real skills. This supportive response is aligned with emotional intelligence and communication - we track that automatically."*

---

### 3. The Data Structure
**File:** [`lib/dialogue-graph.ts`](./lib/dialogue-graph.ts#L74-L115)

**Lines to show:** 74-115

**Key Code:**
```typescript
export interface ConditionalChoice {
  text: string
  pattern?: 'analytical' | 'helping' | 'building' | 'patience' | 'exploring'
  skills?: Array<'criticalThinking' | 'emotionalIntelligence' | ...>
  consequence?: StateChange  // Updates trust, unlocks new paths
}
```

**Talking Point:** *"This is the structure that drives everything. Each choice has skills metadata, behavior patterns, and story consequences."*

---

### 4. Real-Time Skill Tracking
**File:** [`components/StatefulGameInterface.tsx`](./components/StatefulGameInterface.tsx#L490-L529)

**Lines to show:** 490-529

**Key Code:**
```typescript
// Record skills aligned with this choice (not actual skill demonstration)
if (skillTrackerRef.current && state.currentNode) {
  skillTrackerRef.current.recordSkillDemonstration(
    state.currentNode.nodeId,
    choice.choice.choiceId,
    choiceMapping.skillsDemonstrated,
    choiceMapping.context
  )
}
```

**Talking Point:** *"When they click a choice, we immediately record which skills their choice is aligned with. This happens in real-time, building their profile automatically."*

---

### 5. The Tracking Engine
**File:** [`lib/skill-tracker.ts`](./lib/skill-tracker.ts#L91-L121)

**Lines to show:** 91-121

**Key Code:**
```typescript
recordChoice(choice, scene, gameState): void {
  // 1. Extract skills aligned with this choice
  const demonstrations = this.extractDemonstrations(choice, scene, gameState)
  
  // 2. Record evidence
  this.demonstrations.push(...demonstrations)
  
  // 3. Update internal skill levels
  // 4. Persist to storage
}
```

**Talking Point:** *"This is the engine that builds their profile. Every choice becomes evidence of skills aligned with their choices. No surveys, no self-reporting - pure behavioral tracking."*

---

### 6. Admin Dashboard (The Output)
**Architecture:** Next.js App Router with modular sections

**Main Entry Point:**
- [`app/admin/page.tsx`](./app/admin/page.tsx) - Student list overview
- [`components/admin/SharedDashboardLayout.tsx`](./components/admin/SharedDashboardLayout.tsx) - Shared layout with navigation

**Section Components (Individual Routes):**
- **Urgency:** [`app/admin/[userId]/urgency/page.tsx`](./app/admin/[userId]/urgency/page.tsx) → [`components/admin/sections/UrgencySection.tsx`](./components/admin/sections/UrgencySection.tsx)
- **Skills:** [`app/admin/[userId]/skills/page.tsx`](./app/admin/[userId]/skills/page.tsx) → [`components/admin/sections/SkillsSection.tsx`](./components/admin/sections/SkillsSection.tsx)
- **Careers:** [`app/admin/[userId]/careers/page.tsx`](./app/admin/[userId]/careers/page.tsx) → [`components/admin/sections/CareersSection.tsx`](./components/admin/sections/CareersSection.tsx)
- **Evidence:** [`app/admin/[userId]/evidence/page.tsx`](./app/admin/[userId]/evidence/page.tsx) → [`components/admin/sections/EvidenceSection.tsx`](./components/admin/sections/EvidenceSection.tsx)
- **Gaps:** [`app/admin/[userId]/gaps/page.tsx`](./app/admin/[userId]/gaps/page.tsx) → [`components/admin/sections/GapsSection.tsx`](./components/admin/sections/GapsSection.tsx)
- **Action:** [`app/admin/[userId]/action/page.tsx`](./app/admin/[userId]/action/page.tsx) → [`components/admin/sections/ActionSection.tsx`](./components/admin/sections/ActionSection.tsx)

**What to show:** 
1. Start at `/admin` - show the student list with character relationships and choice patterns
2. Click into a student → `/admin/[userId]/urgency` - default landing section
3. Navigate between sections using the button-based navigation
4. Show the "Family" vs "Analysis" view mode toggle

**Key Features:**
- **Modular Architecture:** Each section is a standalone component (200-400 lines vs old 2,545-line monolith)
- **Deep Linking:** Shareable URLs to specific sections (`/admin/user123/careers`)
- **Context Sharing:** `AdminDashboardContext` provides profile and viewMode to all sections
- **Performance:** Only loads active section, not all tabs

**Talking Point:** *"This is what counselors see. Real-time insights on each student - their skills, career matches, and where they need support. We've built this as a modular Next.js App Router architecture so each section can be independently maintained and optimized. Actionable data, not just reports."*

---

## 📋 Quick Reference

| Topic | File | Lines | Key Insight |
|-------|------|-------|-------------|
| **Choice Definition** | `content/maya-dialogue-graph.ts` | 29-60 | Choices are annotated with skills |
| **Data Structure** | `lib/dialogue-graph.ts` | 74-115 | Type-safe interfaces for everything |
| **Real-Time Tracking** | `components/StatefulGameInterface.tsx` | 490-529 | Tracking happens on every choice |
| **Profile Building** | `lib/skill-tracker.ts` | 91-121 | Engine that accumulates evidence |
| **Admin Overview** | `app/admin/page.tsx` | Various | Student list with insights |
| **Dashboard Layout** | `components/admin/SharedDashboardLayout.tsx` | Various | Shared navigation & context |
| **Dashboard Sections** | `components/admin/sections/*.tsx` | Various | Modular section components |

---

## 🎤 Suggested Script

**Opening (30 sec):**
> "We're solving the skills gap problem differently - through narrative, not assessments. Let me show you how it works."

**Show Experience (2 min):**
> "This is what a student sees. Let's play through Maya's story..."

**Show Code - Choice Mapping (1 min):**
> "Under the hood, every choice is structured data. Here's how we define choices with skills metadata..."

**Show Code - Tracking (1 min):**
> "When they make a choice, we immediately track it. This happens in real-time..."

**Show Admin Dashboard (2 min):**
> "And this is what counselors see. We start at the student list showing character relationships and choice patterns. When you click into a student, you get a modular dashboard with 6 sections - Urgency, Skills, Careers, Evidence, Gaps, and Action. Each section is its own route, so you can deep-link to specific insights. Real-time data, career matches, actionable recommendations..."

**Vision (1 min):**
> "The power is scale - we can do this for hundreds of students, providing personalized insights at scale..."

---

## 💡 Key Talking Points

- **"Narrative-driven, not quiz-based"** - Students explore through story, not assessments
- **"Behavioral tracking, not self-reporting"** - We observe skills through choices
- **"Real-time insights"** - Counselors see data as students play
- **"Birmingham-specific"** - Career paths tied to local opportunities
- **"WEF 2030 Skills"** - Tracking the skills that matter for future workforce
- **"Scalable solution"** - Can handle hundreds/thousands of students

---

## 🚫 What NOT to Show

- Database schemas or API routes (too technical)
- CSS/styling files (not core mechanics)
- Complex state management (implementation detail)
- Error handling code (edge cases)

---

## ✅ Success Criteria

After showing these files, CEO should understand:
1. ✅ Choices map directly to skills
2. ✅ Tracking is automatic and real-time
3. ✅ Profile builds from every interaction
4. ✅ Insights are actionable for counselors
5. ✅ System is structured and scalable

---

---

## 📐 Admin Dashboard Architecture (Nov 2025)

### Refactored Structure
The admin dashboard was refactored from a 2,545-line monolithic component into a modular Next.js App Router architecture:

**Before:**
- `SingleUserDashboard.tsx` (2,545 lines) - Tab-based monolith

**After:**
- **Layout:** `SharedDashboardLayout.tsx` - Provides navigation, context, and shared UI
- **Sections:** 6 independent section components (200-400 lines each)
- **Routes:** Individual Next.js pages per section (`/admin/[userId]/[section]`)

### Navigation Flow
1. `/admin` → Student list overview
2. Click student → `/admin/[userId]/urgency` (default section)
3. Navigate via button-based nav → `/admin/[userId]/careers`, `/gaps`, etc.
4. URL-based deep linking supported

### Benefits
- ✅ **Separation of Concerns** - Each section independently maintained
- ✅ **Performance** - Only loads active section
- ✅ **Deep Linking** - Shareable URLs to specific sections
- ✅ **Maintainability** - 200-400 line files vs 2,500+ line monolith
- ✅ **No Empty Tabs** - Users navigate intentionally to specific sections
- ✅ **Shared State** - `AdminDashboardContext` provides profile and viewMode

---

## 🌍 WEF 2030 Skills Framework Context

### What Are WEF 2030 Skills?

The **World Economic Forum's 2030 Skills Framework** (WEF, 2023) represents the most comprehensive analysis of future workforce needs, based on:
- **803 million job postings** analyzed
- **11,000 tasks** across 673 occupations
- **803 companies** surveyed across 27 industry clusters

**Key Insight**: 50% of all employees will need reskilling by 2025, with analytical thinking, creative thinking, and resilience topping employer priority lists.

### The 12 WEF 2030 Skills We Track

| Skill | What It Means | Why It Matters |
|-------|---------------|----------------|
| **Critical Thinking** | Analyzing, evaluating, identifying patterns | Most valued skill by employers; essential for problem-solving |
| **Communication** | Expressing ideas clearly, asking powerful questions | #2 most sought-after skill; needed across all industries |
| **Emotional Intelligence** | Reading emotions, empathy, self-awareness | Critical for leadership and team collaboration |
| **Creativity** | Novel connections, reframing problems | Drives innovation and adaptability |
| **Problem Solving** | Finding solutions, systematic thinking | Core competency for all technical and non-technical roles |
| **Leadership** | Guiding others, inspiring action | Essential for advancement and impact |
| **Adaptability** | Flexibility, handling uncertainty | Critical as job roles rapidly evolve |
| **Collaboration** | Working effectively with others | Required for modern workplace dynamics |
| **Digital Literacy** | Tech fluency, digital tool mastery | Increasingly mandatory across all sectors |
| **Cultural Competence** | Cross-cultural understanding | Essential in diverse, globalized workforce |
| **Time Management** | Prioritization, pacing, efficiency | Foundation for productivity and career growth |
| **Financial Literacy** | Economic decisions, resource management | Critical for personal and professional success |

### How We Track These Skills

**File:** [`lib/dialogue-graph.ts`](./lib/dialogue-graph.ts#L90-L92)

**Code Structure:**
```typescript
skills?: Array<
  'criticalThinking' | 'creativity' | 'communication' | 'collaboration' |
  'adaptability' | 'leadership' | 'digitalLiteracy' | 'emotionalIntelligence' |
  'culturalCompetence' | 'problemSolving' | 'timeManagement' | 'financialLiteracy'
>
```

**Talking Point:** *"Every choice a student makes is automatically tagged with the WEF 2030 skills they're aligned with. For example, when a student chooses to help Maya work through her robotics decision, that choice is aligned with emotional intelligence, communication, and collaboration - three critical 2030 skills that employers are actively seeking."*

### Skill-to-Career Matching

**File:** [`lib/2030-skills-system.ts`](./lib/2030-skills-system.ts)

The system matches skills indicated by user choices to Birmingham-specific career pathways:
- **Healthcare Technology Specialist** requires: digital literacy, communication, problem solving, emotional intelligence
- **Sustainable Construction Manager** requires: leadership, problem solving, adaptability, communication
- **Community Data Analyst** requires: critical thinking, digital literacy, communication, cultural competence

**Talking Point:** *"We don't just track skills - we connect them to actual Birmingham career opportunities. When a student's choices show alignment with emotional intelligence and problem solving, we show them healthcare technology roles at UAB, Children's Hospital, or Innovation Depot. The skills framework isn't theoretical - it's tied directly to local jobs."*

### Research Foundation

**File:** [`docs/RESEARCH_FOUNDATION.md`](./docs/RESEARCH_FOUNDATION.md#L9-L17)

The WEF 2030 framework is the primary research foundation, combined with:
- **Holland's RIASEC Career Theory** (personality-career fit)
- **Erikson's Identity Development** (adolescent career identity formation)
- **Social Cognitive Career Theory** (self-efficacy building)
- **Evidence-Based Assessment** (performance vs. self-report)

**Talking Point:** *"This isn't just a game - it's grounded in peer-reviewed research. The World Economic Forum's framework tells us what skills matter. Erikson's theory explains why career identity exploration is critical for adolescents. And our evidence-based approach tracks choices aligned with skills, not just what students say about themselves."*

---

## 🔍 Beyond Skills: Other Critical Underlying Aspects

While WEF 2030 skills are the foundation, the platform tracks **six additional evidence frameworks** and multiple behavioral dimensions that provide a holistic view of each student's journey.

### 1. Choice Patterns (Personality Indicators)

**File:** [`lib/character-state.ts`](./lib/character-state.ts#L40-L46) → [`lib/skill-tracker.ts`](./lib/skill-tracker.ts#L340-L346)

**Five Core Patterns:**
- **Helping** → Demonstrates emotional intelligence, collaboration, communication
- **Analytical** → Demonstrates critical thinking, problem solving, digital literacy
- **Building** → Demonstrates creativity, problem solving, leadership
- **Patience** → Demonstrates time management, adaptability, emotional intelligence
- **Exploring** → Demonstrates adaptability, creativity, critical thinking

**How It Works:** Every choice has a `pattern` field that maps to personality traits. Patterns connect to RIASEC theory (Holland 1997) for career matching.

**Example:**
```typescript
{
  text: "Let me help you think through this",
  pattern: 'helping',
  skills: ['emotionalIntelligence', 'collaboration']
}
```

**Talking Point:** *"We don't just track what skills they show - we track how they show them. Are they naturally helping-oriented? Analytical? Patient? These patterns reveal their personality type, which we then match to careers using Holland's RIASEC theory."*

---

### 2. Character Relationships (Social-Emotional Learning)

**File:** [`lib/character-state.ts`](./lib/character-state.ts#L13-L19) → [`lib/student-insights-parser.ts`](./lib/student-insights-parser.ts#L83-L153)

**What's Tracked:**
- **Trust Levels** (0-10 scale): How much each character trusts the student
- **Relationship Status**: stranger → acquaintance → confidant
- **Knowledge Flags**: What the character knows about the student
- **Key Moments**: Vulnerability sharing, decision support, mutual recognition

**Characters:**
- **Maya Chen**: Medical school vs robotics passion (identity conflict)
- **Devon Kumar**: Technical introvert working through grief
- **Jordan Packard**: Impostor syndrome, multiple job changes
- **Samuel**: Station guide, wise mentor figure

**Talking Point:** *"Trust is earned through consistent choices. When a student helps Maya navigate her robotics decision empathetically, Maya's trust goes from 0 to 6, unlocking deeper conversations. This mirrors real workplace relationship building and demonstrates emotional intelligence."*

---

### 3. Career Matching System (RIASEC + Local Context)

**File:** [`lib/2030-skills-system.ts`](./lib/2030-skills-system.ts#L70-L100) → [`lib/simple-career-analytics.ts`](./lib/simple-career-analytics.ts)

**Matching Factors:**
- **Skills Indicated by Choices**: Which WEF 2030 skills are most aligned with their choices
- **Choice Patterns**: Personality alignment (RIASEC theory)
- **Birmingham Opportunities**: Local employers (UAB, Children's Hospital, Innovation Depot)
- **Readiness Score**: near_ready (80%+) | developing (40-79%) | exploring (<40%)

**Example Career Paths:**
- Healthcare Technology Specialist (digital literacy + communication + problem solving)
- Sustainable Construction Manager (leadership + problem solving + adaptability)
- Community Data Analyst (critical thinking + digital literacy + cultural competence)

**Talking Point:** *"We don't just match skills to careers - we match to actual Birmingham jobs. When a student shows strong emotional intelligence and problem solving, we show them healthcare technology roles at UAB Hospital, which is walkable from many neighborhoods. Local = actionable."*

---

### 4. The Six Evidence Frameworks

**File:** [`app/api/admin/evidence/[userId]/route.ts`](./app/api/admin/evidence/[userId]/route.ts#L89-L172)

The Evidence section in the admin dashboard shows six research-backed frameworks:

#### Framework 1: Skill Development Evidence
- Total choices aligned with skills tracked
- Unique skills indicated by choices
- Skill breakdown by type
- **Purpose**: Concrete evidence of capability development

#### Framework 2: Career Readiness
- Career matches explored
- Readiness levels (near_ready/developing/exploring)
- Birmingham opportunity alignment
- **Purpose**: Career pathway discovery and readiness assessment

#### Framework 3: Decision Patterns
- Pattern consistency (how steady choices are)
- Behavioral trends over time
- Skill progression tracking
- **Purpose**: Understanding decision-making style and reliability

#### Framework 4: Engagement Journey
- Days active in platform
- Average demonstrations per day
- Consistency score (engagement regularity)
- **Purpose**: Measuring sustained engagement and commitment

#### Framework 5: Relationships Framework
- Character trust levels (Maya, Devon, Jordan)
- Relationship depth (stranger/acquaintance/confidant)
- Key interaction moments
- **Purpose**: Social-emotional learning assessment

#### Framework 6: Learning Style (Behavioral Consistency)
- Top 3 skills by frequency
- Focus score vs exploration score
- Platform alignment (warmth, accessibility preferences)
- **Purpose**: Understanding learning and engagement preferences

**Talking Point:** *"This isn't just one framework - it's six interlocking evidence systems. Skills show capability. Patterns show personality. Relationships show social-emotional development. Engagement shows commitment. Together, they paint a complete picture of who this student is and where they're headed."*

---

### 5. Breakthrough Moments

**File:** [`lib/student-insights-parser.ts`](./lib/student-insights-parser.ts#L158-L213)

**Three Types:**
- **Vulnerability Moments**: When characters share personal struggles
- **Decision Moments**: When students help characters make critical choices
- **Mutual Recognition**: When trust is fully established (confidant level)

**Example:**
```typescript
{
  type: 'vulnerability',
  characterName: 'Maya Chen',
  quote: "I... I build robots. My parents think I should be a doctor.",
  scene: 'maya-robotics-passion',
  timestamp: Date.now()
}
```

**Talking Point:** *"We track the breakthrough moments - when Maya admits her robotics passion conflicts with family expectations, when Devon shares his flowchart for talking to his dad. These aren't just story beats - they're evidence of emotional intelligence, trust-building, and authentic relationship development."*

---

### 6. Player Persona & Behavioral Profile

**File:** [`lib/player-persona.ts`](./lib/player-persona.ts)

**What's Tracked:**
- **Dominant Choice Pattern**: Helping (40%), Analytical (30%), etc.
- **Skill Progression**: How skills develop over time
- **Engagement Quality**: Deep engagement vs surface exploration
- **Learning Preferences**: Visual, auditory, kinesthetic indicators

**Integration:** Persona data feeds into career matching, skill gap analysis, and personalized recommendations.

---

### Why These Aspects Matter

**For Students:**
- Self-awareness: "I'm naturally helping-oriented, which matches healthcare careers"
- Validation: "My emotional intelligence is recognized through real evidence"
- Direction: "Birmingham has these specific opportunities that match my skills"

**For Counselors:**
- Holistic view: Not just skills, but personality, relationships, engagement
- Actionable insights: "This student has strong analytical patterns but low trust with characters - they may need social-emotional support"
- Evidence-based: Multiple frameworks validate each insight

**For Grant Writers:**
- Research-backed: All frameworks tied to peer-reviewed theory
- Measurable outcomes: Concrete metrics for each framework
- Local impact: Birmingham-specific career connections

**Talking Point:** *"We're not building a skills tracker - we're building a complete portrait. Skills tell us what they can do. Patterns tell us who they are. Relationships tell us how they connect. Engagement tells us how committed they are. Together, these create a holistic view that counselors can use to provide truly personalized support."*

---

*Last updated: November 2025 - Post Admin Dashboard Refactor*

