# Forensic Audit Prompt for Claude Code

Copy and paste this prompt into Claude Code to perform a comprehensive forensic audit of the codebase.

---

## PROMPT START

Perform a comprehensive forensic audit of the 30_lux-story codebase. Focus on the following areas:

### 1. LEARNING OBJECTIVES METADATA IMPLEMENTATION

**Verify:**
- [ ] Are learning objectives metadata fields (`learningObjectives` on nodes, `learningObjectiveId` on choices) properly typed in `lib/dialogue-graph.ts`?
- [ ] Does `lib/learning-objectives-tracker.ts` properly track engagement (viewed, chose, completed)?
- [ ] Are learning objectives tracked in `components/StatefulGameInterface.tsx` when:
  - Nodes are initially viewed?
  - Choices are made?
- [ ] Does `lib/skill-profile-adapter.ts` export `learningObjectivesEngagement` to SkillProfile?
- [ ] Are there any TypeScript errors or missing type definitions?
- [ ] Is localStorage persistence working correctly?

**Find:**
- Any dialogue nodes that should have learning objectives but don't
- Any inconsistencies in how objectives are tracked
- Missing error handling in the tracker

---

### 2. KOLB'S LEARNING CYCLE IMPLEMENTATION

**Verify all 4 stages are implemented:**

**Stage 1: Concrete Experience** (Base gameplay)
- [ ] Are choices being tracked correctly?
- [ ] Is game state properly persisted?

**Stage 2: Reflective Observation** (Experience Summary)
- [ ] Does `components/ExperienceSummary.tsx` appear after arc completion?
- [ ] Does `lib/arc-learning-objectives.ts` correctly detect arc completion?
- [ ] Is the summary data complete (skills, insights, trust level)?

**Stage 3: Abstract Conceptualization** (Framework Insights)
- [ ] Does `components/FrameworkInsights.tsx` properly explain research frameworks?
- [ ] Is it accessible from Experience Summary AND student dashboard?
- [ ] Are frameworks personalized to student's actual data?

**Stage 4: Active Experimentation** (Action Plan Builder)
- [ ] Does `components/ActionPlanBuilder.tsx` allow purpose statement creation?
- [ ] Can students create short-term and long-term goals?
- [ ] Is action plan data saved to localStorage?
- [ ] Are Birmingham opportunities displayed?

**Check flow:**
- Arc completion → Experience Summary → Framework Insights → Action Plan Builder
- All should be accessible and functional

---

### 3. STUDENT DASHBOARD ARCHITECTURE

**Verify:**
- [ ] Route `/student/insights` exists and loads correctly
- [ ] All section components exist:
  - `components/student/sections/YourJourneySection.tsx`
  - `components/student/sections/SkillGrowthSection.tsx`
  - `components/student/sections/CareerExplorationSection.tsx`
  - `components/student/sections/NextStepsSection.tsx`
- [ ] Framework Insights accessible from dashboard
- [ ] Action Plan Builder accessible from dashboard
- [ ] Data loads from localStorage correctly
- [ ] Error handling for missing data
- [ ] No authentication required (unlike admin dashboard)

**Check separation:**
- Student routes (`/student/*`) vs Admin routes (`/admin/*`)
- Student components (`components/student/*`) vs Admin components (`components/admin/*`)
- Different data presentation (student-friendly vs research-focused)

---

### 4. DIALOGUE GRAPH STRUCTURE

**Audit:**
- [ ] Do any existing dialogue nodes use `learningObjectives` metadata?
- [ ] Do any choices use `learningObjectiveId`?
- [ ] Are there missing metadata opportunities?
- [ ] Check at least 10 key nodes across Maya, Devon, Jordan arcs
- [ ] Verify nodes that should have learning objectives based on `lib/learning-objectives-definitions.ts`

**Identify:**
- Critical nodes missing learning objectives
- Choices that address learning objectives but aren't tagged
- Opportunities to add metadata

---

### 5. DATA FLOW VERIFICATION

**Trace complete data flow:**

1. **Student makes choice:**
   - [ ] Is choice tracked in `SkillTracker`?
   - [ ] Is skill demonstration recorded?
   - [ ] Is learning objective engagement recorded (if applicable)?
   - [ ] Is pattern tracked?
   - [ ] Is character relationship updated?

2. **Student completes arc:**
   - [ ] Is arc completion detected?
   - [ ] Is Experience Summary shown?
   - [ ] Is profile loaded for framework insights?

3. **Student views dashboard:**
   - [ ] Can they access `/student/insights`?
   - [ ] Is their profile loaded correctly?
   - [ ] Are all sections rendering?
   - [ ] Is data consistent with game state?

**Check for:**
- Data inconsistencies
- Race conditions
- Missing error handling
- localStorage conflicts

---

### 6. TYPE SAFETY & COMPILATION

**Verify:**
- [ ] Run `npm run type-check` and report ALL errors
- [ ] Check for `any` types that should be typed
- [ ] Verify all imports are correct
- [ ] Check for missing dependencies
- [ ] Verify interfaces match implementations

**Focus areas:**
- `lib/learning-objectives-tracker.ts`
- `lib/skill-profile-adapter.ts`
- `components/ExperienceSummary.tsx`
- `components/FrameworkInsights.tsx`
- `components/ActionPlanBuilder.tsx`
- `components/StatefulGameInterface.tsx`

---

### 7. INTEGRATION POINTS

**Verify integrations work:**

**Experience Summary → Framework Insights:**
- [ ] Button appears when profile is available
- [ ] Modal opens correctly
- [ ] Data passes correctly

**Experience Summary → Action Plan Builder:**
- [ ] Button appears when profile is available
- [ ] Modal opens correctly
- [ ] Plan saves correctly

**Student Dashboard → Framework Insights:**
- [ ] Button accessible
- [ ] Data loads correctly

**Student Dashboard → Action Plan Builder:**
- [ ] Button accessible
- [ ] Plan loads/saves correctly

---

### 8. MISSING IMPLEMENTATIONS

**Identify what's NOT implemented:**

- [ ] Are learning objectives actually tagged in dialogue graphs? (Check at least 20 nodes)
- [ ] Is there a UI to view learning objectives engagement in admin dashboard?
- [ ] Is there a UI to view learning objectives engagement in student dashboard?
- [ ] Are action plans displayed anywhere after creation?
- [ ] Can action plans be edited/updated?

**Document:**
- Missing features
- Incomplete implementations
- TODO comments
- Placeholder code

---

### 9. ERROR HANDLING & EDGE CASES

**Check:**
- [ ] What happens if localStorage is full?
- [ ] What happens if userId is missing?
- [ ] What happens if profile fails to load?
- [ ] What happens if arc completion is detected twice?
- [ ] What happens if learning objective tracker fails?
- [ ] Graceful degradation when Supabase is unavailable?

**Test scenarios:**
- New user (no data)
- Returning user (has data)
- User with incomplete data
- Network failures
- Browser storage disabled

---

### 10. CODE QUALITY & BEST PRACTICES

**Review:**
- [ ] Are async functions properly handled?
- [ ] Are there memory leaks (useRef, useEffect cleanup)?
- [ ] Are console.log statements excessive?
- [ ] Is code duplicated unnecessarily?
- [ ] Are magic strings/numbers replaced with constants?
- [ ] Is error handling consistent?
- [ ] Are type definitions accurate?

**Document:**
- Code smells
- Performance issues
- Maintainability concerns
- Security considerations

---

## AUDIT OUTPUT FORMAT

Provide your audit results in this format:

```markdown
# Forensic Audit Results
**Date:** [timestamp]
**Auditor:** Claude Code
**Scope:** [areas audited]

## Executive Summary
[Overall health, critical issues, recommendations]

## Detailed Findings

### 1. Learning Objectives Metadata
**Status:** ✅ PASS / ⚠️ WARNINGS / ❌ FAIL

**Findings:**
- [Specific findings]

**Issues:**
- [Issues found]

**Recommendations:**
- [Recommendations]

[Repeat for each section...]

## Critical Issues
[List any blocking issues]

## Recommendations Priority
1. High Priority: [Items]
2. Medium Priority: [Items]
3. Low Priority: [Items]

## Code Metrics
- TypeScript Errors: [count]
- Linter Errors: [count]
- Missing Implementations: [count]
- Code Coverage: [estimate]
```

---

## ADDITIONAL INVESTIGATION COMMANDS

Run these commands as part of the audit:

```bash
# Type checking
npm run type-check

# Build verification
npm run build

# Linter
npm run lint

# Find learning objectives usage
grep -r "learningObjectives" content/
grep -r "learningObjectiveId" content/

# Find TypeScript any types
grep -r ": any" lib/ components/

# Find TODO comments
grep -r "TODO" lib/ components/ app/
```

---

## END PROMPT

---

**Usage Instructions:**
1. Copy the entire prompt above (from "PROMPT START" to "END PROMPT")
2. Paste into Claude Code
3. Let Claude perform the audit
4. Review results and address critical issues first
5. Save audit results for future reference

