# Claude Chat Review Prompt for Admin Dashboard

**Location:** `docs/admin_dashboard/`

Copy and paste this prompt into Claude.ai chat, then attach the following files:
- `ADMIN_DASHBOARD_SPECIFICATION.md` (73KB specification)
- `USER_DATA_ANALYSIS.md` (user analysis)
- All 29 screenshots:
  - `automated_captures/*.png` (7 main dashboard screenshots)
  - `Skills Tab/*.png` (10 screenshots)
  - `Careers Tab/*.png` (6 screenshots)
  - `GAPS/*.png` (2 screenshots)
  - `Action/*.png` (2 screenshots)
  - `evidence.png` (1 screenshot)
  - `2030 Skills.png` (1 screenshot)

---

## Prompt:

You are a senior UX/product designer and educator with 15+ years of experience building data-heavy dashboards for K-12 counselors and career advisors. You've shipped products at Khan Academy, ClassDojo, and Naviance. You have a critical eye for:

1. **Cognitive Load**: Counselors manage 300+ students - every pixel counts
2. **Mobile-First**: 60% of counselor dashboard access happens on tablets/phones in hallways between classes
3. **Actionability**: Data without clear next steps creates analysis paralysis
4. **Trust & Transparency**: Educators are skeptical of "black box" AI systems
5. **Real-World Constraints**: 5-minute conversations in crowded hallways, not 30-minute deep dives

**Your Mission:**
Review the attached Admin Dashboard specification and screenshots with a **brutally honest, critical eye**. I need you to tear this apart and find what's broken, confusing, or missing.

---

## Context: Grand Central Terminus

**What It Is:** Birmingham youth career exploration system disguised as a magical train station narrative game. Students make choices, demonstrate skills, explore career paths.

**Target Users for Admin Dashboard:**
- High school counselors (300+ student caseloads)
- Career advisors (60-80 active students)
- Birmingham partnership coordinators (UAB, BCS, Regions Bank, etc.)

**Current Status:**
- 73KB specification document created
- 7 screenshots captured (main dashboard views)
- 0 TypeScript errors, production-ready codebase
- **Mobile implementation:** NOT STARTED (currently desktop-only)

**Technical Stack:**
- Next.js 14 (App Router)
- TypeScript, Tailwind CSS, shadcn/ui
- Supabase backend
- Can deploy responsive/mobile-first easily

---

## Review Questions

### 1. **Mobile-First Critique**
The dashboard is currently desktop-only. Looking at the screenshots and spec:
- What will completely break on mobile?
- Which features need mobile-specific redesigns (not just responsive scaling)?
- What should we CUT for mobile vs. show differently?
- Are there any mobile-first patterns we're missing? (swipe gestures, bottom sheets, etc.)

### 2. **Cognitive Load Assessment**
- Where will counselors get overwhelmed or lost?
- What information is presented but not actionable?
- Which tabs/views should be combined or eliminated?
- Rate each screen: "Glanceable" vs. "Requires Deep Focus" - do we have the balance right?

### 3. **Real-World Usability**
Imagine scenarios:
- **Scenario A:** Counselor has 4 minutes between classes, needs to check on a struggling student
- **Scenario B:** Meeting with parent tomorrow, needs to print/export student profile
- **Scenario C:** Principal asks "Which students need intervention this week?"

Where does the dashboard fail these real-world needs?

### 4. **Glass Box Transparency**
We claim "Glass Box" transparency (human-readable explanations for all metrics). Review the urgency scoring narratives:
- Are they actually helpful or just verbose?
- Do they build trust or create skepticism?
- What's missing from the explanations?

### 5. **Visual Hierarchy**
Looking at screenshots:
- What grabs attention first? Is that the RIGHT thing?
- Where does your eye get stuck or confused?
- Any unnecessary visual clutter or "chart junk"?

### 6. **Data Density vs. Clarity**
- Are we showing too much? Too little?
- Which metrics matter most and are they prominent enough?
- What data should be hidden behind "Show More" interactions?

### 7. **Birmingham Integration**
We have UAB Medical, Regions Bank, Innovation Depot, Southern Company partnerships:
- Is the local connection clear and compelling?
- Does it feel like generic edtech or authentic Birmingham?
- What opportunities are we missing?

### 8. **Accessibility Red Flags**
- Color contrast issues?
- Missing labels or keyboard navigation concerns?
- Screen reader nightmares?

---

## What I Need From You

**Format your feedback as:**

### 🚨 CRITICAL ISSUES (Must Fix Before Launch)
- [Numbered list of dealbreakers]

### ⚠️ MAJOR CONCERNS (Strong Recommendations)
- [Issues that will hurt adoption/usability]

### 💡 OPTIMIZATION OPPORTUNITIES
- [Nice-to-haves that would significantly improve UX]

### 📱 MOBILE-SPECIFIC RECOMMENDATIONS
- [What to build, what to cut, what to redesign for mobile]

### ✅ WHAT'S WORKING WELL
- [Rare positive feedback - what should we preserve/amplify?]

---

## Constraints to Keep in Mind

1. **We're a 2-person team** (not Google) - prioritize ruthlessly
2. **Timeline:** Need mobile version in 2-3 weeks
3. **Technical:** Next.js/Tailwind means responsive is easy, but mobile-specific features need more thought
4. **Users:** Real Birmingham counselors, not tech-savvy early adopters
5. **Stakes:** This affects real student intervention decisions - wrong data presentation = real harm

---

## Final Note

**Don't be nice.** I need brutal honesty. If something is confusing, say "this is confusing." If the mobile experience will be terrible, say "this will be terrible on mobile." If we're solving the wrong problem, tell me.

The best review is one that makes me uncomfortable but prevents us from shipping something broken.

Ready? Be ruthless. 🔪
