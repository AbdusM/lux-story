# Admin Dashboard Testing Guide
**Grand Central Terminus - Birmingham Career Exploration**

**Created:** October 4, 2025
**Purpose:** Comprehensive testing strategy for admin dashboard accessibility and plain language improvements
**Scope:** Weeks 1-3 of ADMIN_DASHBOARD_ACCESSIBILITY_PLAN.md

---

## TABLE OF CONTENTS
1. [Testing Overview](#testing-overview)
2. [Manual Testing Scenarios](#manual-testing-scenarios)
3. [Accessibility Testing](#accessibility-testing)
4. [User Acceptance Testing](#user-acceptance-testing)
5. [Regression Testing](#regression-testing)
6. [Performance Benchmarks](#performance-benchmarks)
7. [Browser Compatibility](#browser-compatibility)

---

## TESTING OVERVIEW

### Scope of Changes
**Week 1: Core Language Improvements**
- Global Family/Research mode toggle
- Narrative bridge rewrites (<25 words)
- Glass Box urgency narrative improvements (severity-calibrated)
- Empty state improvements (positive, encouraging)

**Week 2: Chart & Visual Accessibility**
- Interactive tooltips on all charts
- WCAG AA color contrast compliance
- Recency indicators on skills
- Pattern recognition visualizations
- Cross-tab navigation and breadcrumbs

**Week 3: Polish & Testing**
- Inline context for all metrics
- Date formatting consistency
- Cross-browser testing
- User acceptance testing
- Production readiness validation

### Testing Objectives
1. **Usability**: Counselors can navigate dashboard efficiently and explain findings to parents/students
2. **Accessibility**: WCAG 2.1 Level AA compliance (keyboard, screen reader, contrast, focus)
3. **Comprehension**: Family Mode understandable by 6th-8th grade reading level, Research Mode scientifically accurate
4. **Performance**: No degradation in load times, smooth animations, responsive interactions
5. **Reliability**: No regressions, all existing functionality preserved

### Target Audiences
- **Counselors**: Primary users, need efficiency and clarity
- **Parents**: Secondary users (via counselor presentation), need plain English
- **Students**: Occasional users (self-review), need encouragement
- **Researchers**: Advanced users, need technical accuracy and methodology transparency

---

## MANUAL TESTING SCENARIOS

### Scenario 1: Counselor Using Family Mode
**Objective:** Verify counselors can efficiently review student data and prepare for parent meetings

**Steps:**
1. **Login and Navigation**
   - Navigate to admin dashboard
   - Verify breadcrumbs show: "All Students > [Student Name] > [Tab Name]"
   - Confirm active tab has visual highlighting (blue-50 background, blue-600 border)

2. **Toggle to Family Mode**
   - Click global mode toggle in header
   - Verify toggle changes to "Your Personal View" / family icon
   - Confirm preference saves to localStorage (`admin_view_preference: 'family'`)
   - Refresh page - mode should persist

3. **Review Urgency Tab**
   - Check urgency narrative is <25 words, active voice, severity-calibrated:
     - Critical (15-20 words): "🚨 [Name] [PROBLEM]. [Hypothesis]. Action: [Directive with timeframe]."
     - High (20-25 words)
     - Medium (25-30 words)
     - Low (30-40 words)
   - Verify urgency percentage has context: "Attention needed: High (78%)"
   - Confirm color consistency: badge color, border-left accent, percentage color match
   - Check last active time: "Last active: 2 hours ago" (not just "2 hours ago")

4. **Navigate Skills Tab**
   - Click "Next: View skills demonstrated" button at bottom of Urgency tab
   - Verify smooth transition, breadcrumb updates
   - Check narrative bridge from Urgency → Skills is <25 words
   - Confirm recency indicators on all skills:
     - Green dot + "New!" (<3 days)
     - Yellow dot + "This week" (3-7 days)
     - Gray dot (>7 days)
   - Expand skill demonstration - verify scene names, dates, context visible
   - Check pattern recognition card shows: "🔍 Patterns We Noticed" with plain English insights

5. **Navigate Careers Tab**
   - Click cross-tab link from Skills or use "Next: Explore matching careers" button
   - Verify narrative bridge Skills → Careers is <25 words
   - Check match scores have context: "87% fit based on 12 skills"
   - Confirm Birmingham relevance includes employer count: "85% of jobs in Birmingham (12 of 14 employers)"
   - Click skill name in requirements - should jump to Skills tab with highlight

6. **Navigate Gaps Tab**
   - Click "Next: See what to work on next" from Careers tab
   - Verify narrative bridge Careers → Gaps is <25 words
   - Check gap prioritization is clear (impact × proficiency × time to develop)
   - Confirm development pathways use plain English: "How to Get There"

7. **Navigate Action Tab**
   - Click "Next: Get concrete next steps" from Gaps tab
   - Verify narrative bridge Gaps → Action is <25 words
   - Check Birmingham opportunities are specific (addresses, schedules, contact info)
   - Confirm conversation starters are evidence-based with actual student quotes

8. **Print/Export Workflow**
   - Print Action tab for parent meeting
   - Verify printed version is clean, no debug UI visible
   - Check all context retained in printed format

**Expected Results:**
- ✅ All narrative text <25 words, conversational, personalized
- ✅ No orphan percentages (all have context)
- ✅ Cross-tab navigation smooth and intuitive
- ✅ Counselor can explain findings to parents without consulting documentation

**Failure Criteria:**
- ❌ Jargon present in Family Mode
- ❌ Academic tone or passive voice
- ❌ Metrics without context
- ❌ Broken cross-tab links

---

### Scenario 2: Researcher Using Research Mode
**Objective:** Verify researchers can access technical data and methodology details

**Steps:**
1. **Toggle to Research Mode**
   - Click global mode toggle
   - Verify toggle changes to "Detailed Analysis" / microscope icon
   - Confirm preference saves to localStorage

2. **Review Evidence Tab**
   - Check all 6 frameworks visible
   - Verify plain English translations available (inline text, not tooltips)
   - Confirm data quality badges sticky with z-index positioning
   - Check audience tags: "For Researchers" visible on framework cards

3. **Analyze Skill Progression Chart**
   - Hover over data points - verify tooltip shows:
     - Skill name
     - Demonstration count
     - Full timestamp (not relative time)
     - "Click to view demonstrations →" link
   - Click data point - should scroll to demonstration details
   - Verify chart has SVG `<desc>` tag for accessibility

4. **Review Pattern Recognition**
   - Check pattern analysis card shows:
     - Scene type distribution (progress bars)
     - Character interaction analysis (progress bars)
     - Technical metrics, not plain English
   - Verify data matches raw demonstration logs

5. **Cross-Reference Metrics**
   - Check urgency calculation factors are detailed and accurate
   - Verify match algorithm breakdown: "skills (40%), education access (30%), local demand (30%)"
   - Confirm gap analysis shows methodology: "Priority ranking: impact × proficiency × time to develop"

6. **Export Data**
   - Export raw demonstration data
   - Verify CSV/JSON includes all technical fields
   - Confirm timestamps are ISO 8601 format

**Expected Results:**
- ✅ Technical accuracy maintained
- ✅ Methodology transparent and auditable
- ✅ Plain English available when needed (not forced)
- ✅ Data export preserves all information

**Failure Criteria:**
- ❌ Methodology not explained
- ❌ Data inconsistencies across tabs
- ❌ Missing technical details

---

### Scenario 3: Parent Viewing Student Dashboard
**Objective:** Verify parents can understand dashboard when counselor presents in Family Mode

**Steps:**
1. **Counselor Setup**
   - Counselor sets dashboard to Family Mode
   - Opens student profile in presentation mode

2. **Parent Reviews Urgency**
   - Counselor shows urgency card
   - Parent should understand:
     - What the issue is (from narrative)
     - Why it's flagged (contributing factors in plain English)
     - What to do next (action directive with timeframe)
   - No jargon present

3. **Parent Reviews Skills**
   - Counselor shows Skills tab
   - Parent should understand:
     - What skills student has demonstrated
     - When they were shown (recency indicators)
     - Where these skills lead (career connections)
   - Pattern insights should be clear: "Communication shows up most in family scenes (5 times)"

4. **Parent Reviews Careers**
   - Counselor shows Careers tab
   - Parent should understand:
     - Which careers match student's skills
     - What's still needed (gaps in plain English)
     - How realistic these careers are (Birmingham relevance with employer count)

5. **Parent Reviews Action Items**
   - Counselor shows Action tab
   - Parent should understand:
     - What student should work on next
     - How to support at home (conversation starters)
     - Local opportunities (Birmingham resources with contact info)

**Expected Results:**
- ✅ Parent comprehends all content without asking for clarification
- ✅ Parent can explain student's strengths and gaps in own words
- ✅ Parent feels informed and empowered (not overwhelmed or defensive)
- ✅ Reading level appropriate (6th-8th grade)

**Failure Criteria:**
- ❌ Parent confused by terminology
- ❌ Parent asks "What does [term] mean?"
- ❌ Content feels judgmental or negative

---

### Scenario 4: Student Self-Review
**Objective:** Verify students can understand their own profiles in Family Mode

**Steps:**
1. **Student Accesses Dashboard**
   - Student logs in (if self-access enabled)
   - Dashboard defaults to Family Mode

2. **Student Reviews Skills**
   - Student can identify:
     - Skills they've demonstrated
     - When they showed them (recency)
     - Patterns in their choices
   - Tone is positive and encouraging

3. **Student Reviews Careers**
   - Student can understand:
     - Which careers match their interests
     - What they're good at already
     - What they need to learn next
   - No careers presented as "off limits"

4. **Student Reviews Gaps**
   - Student sees gaps as "growth areas," not failures
   - Development pathways feel achievable
   - Birmingham opportunities feel relevant

5. **Student Takes Action**
   - Student identifies 1-2 specific next steps
   - Feels motivated (not discouraged)

**Expected Results:**
- ✅ Student understands content without adult help
- ✅ Student identifies personal strengths accurately
- ✅ Student sees gaps as opportunities, not problems
- ✅ Student takes at least one action (explores career, contacts resource)

**Failure Criteria:**
- ❌ Student feels discouraged or judged
- ❌ Student can't identify own strengths
- ❌ Content feels "for adults only"

---

## ACCESSIBILITY TESTING

### WCAG 2.1 Level AA Compliance

#### 1.4.3 Contrast (Minimum) - 4.5:1 Ratio
**Test Method:** Use WebAIM Contrast Checker or browser DevTools

**Elements to Test:**
- [ ] Blue narrative box text on `bg-blue-50` → must use `text-gray-800` (not `text-gray-600`)
- [ ] Badge text on colored backgrounds → must use `text-gray-700` (not `text-gray-500`)
- [ ] Urgency percentage on card background → must match urgency badge color (red-600, orange-600, yellow-600, green-600)
- [ ] Scene names → must use `text-gray-600` (not `text-gray-400`)
- [ ] Link text on white background → must use `text-blue-600` or darker
- [ ] Chart axis labels → must use `text-gray-700` or darker

**Tools:**
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Chrome DevTools: Lighthouse > Accessibility audit
- axe DevTools browser extension

**Expected Results:**
- ✅ All text meets 4.5:1 minimum contrast ratio
- ✅ Large text (≥18pt or ≥14pt bold) meets 3:1 minimum
- ✅ No contrast warnings in axe DevTools

---

#### 2.1.1 Keyboard - All Functionality Accessible
**Test Method:** Navigate entire dashboard using only keyboard

**Keyboard Navigation:**
1. **Tab Order**
   - Press `Tab` to move through interactive elements
   - Verify order follows visual layout (top to bottom, left to right)
   - Breadcrumbs → Mode toggle → Tab navigation → Cards → Buttons → Links

2. **Tab Navigation**
   - Use `Arrow Left/Right` to navigate tabs (if implemented)
   - Press `Enter` to activate tab
   - Verify active tab receives focus ring

3. **Chart Interactions**
   - Tab to chart container
   - Use `Arrow keys` to navigate data points
   - Press `Enter` to activate data point (scroll to demonstration)
   - Verify tooltip shows on focus (not just hover)

4. **Expandable Sections**
   - Tab to expandable header
   - Press `Enter` or `Space` to toggle
   - Verify chevron icon rotates
   - Verify expanded content receives focus

5. **Cross-Tab Links**
   - Tab to skill name link in Careers tab
   - Press `Enter` to jump to Skills tab
   - Verify focus moves to highlighted skill

**Expected Results:**
- ✅ All functionality accessible via keyboard
- ✅ Tab order logical and predictable
- ✅ Focus indicators visible on all interactive elements
- ✅ No keyboard traps (can always navigate away)

**Failure Criteria:**
- ❌ Interactive elements not reachable by keyboard
- ❌ Tab order confusing or broken
- ❌ Focus indicators missing or invisible
- ❌ Keyboard trap (stuck in modal or component)

---

#### 2.4.7 Focus Visible - Indicators Present
**Test Method:** Navigate with keyboard and verify focus rings

**Elements to Test:**
- [ ] Mode toggle button - should have visible focus ring
- [ ] Tab navigation buttons - should have focus ring on active tab
- [ ] "Next Tab" buttons - should have focus ring
- [ ] Cross-tab links (skill names, career names) - should have focus ring
- [ ] Chart data points - should have focus ring or highlight
- [ ] Expandable headers - should have focus ring
- [ ] Breadcrumb links - should have focus ring

**Focus Ring Requirements:**
- Minimum 2px solid outline
- High contrast color (blue-600 or similar)
- Offset from element (2-4px)
- Visible against all background colors

**Expected Results:**
- ✅ Focus ring visible on all interactive elements
- ✅ Focus ring meets 3:1 contrast ratio against background
- ✅ Focus ring does not obscure content

---

#### 3.1.5 Reading Level - Family Mode 6th-8th Grade
**Test Method:** Use Flesch-Kincaid readability tools

**Tools:**
- Hemingway Editor: http://www.hemingwayapp.com/
- Readable: https://readable.com/
- Microsoft Word: Review > Spelling & Grammar > Readability Statistics

**Test All Family Mode Text:**
- [ ] Urgency narratives (all severity levels)
- [ ] Narrative bridges (Urgency → Skills, Skills → Careers, etc.)
- [ ] Section headers
- [ ] Empty states
- [ ] Pattern insights
- [ ] Career match explanations
- [ ] Development pathways
- [ ] Conversation starters

**Target Metrics:**
- Flesch-Kincaid Grade Level: 6.0 - 8.0
- Flesch Reading Ease: 60 - 80 (Plain English)
- Average sentence length: 15-20 words
- Complex words: <10%

**Expected Results:**
- ✅ All Family Mode text scores 6th-8th grade
- ✅ Research Mode can score higher (technical accuracy prioritized)
- ✅ No unexplained jargon in Family Mode

---

#### 4.1.2 Name, Role, Value - ARIA Labels Correct
**Test Method:** Use screen reader to verify element labels

**Screen Readers:**
- Windows: NVDA (free) or JAWS
- macOS: VoiceOver (built-in)
- Linux: Orca

**Elements to Test:**
1. **Mode Toggle**
   - Should announce: "Toggle view mode. Current mode: Your Personal View. Button. Press to switch to Detailed Analysis."
   - Should have `aria-label` or `aria-describedby`

2. **Tab Navigation**
   - Should announce: "Skills tab. Button. Selected." (when active)
   - Should have `role="tablist"` on container, `role="tab"` on buttons

3. **Charts**
   - Should have `<desc>` tag: "Skill demonstration timeline showing growth over time"
   - Data points should have `aria-label`: "Critical Thinking - 5 demonstrations on October 3, 2025"

4. **Expandable Sections**
   - Should announce: "Skill demonstrations. Collapsed. Button. Press to expand."
   - Should have `aria-expanded="false"` when collapsed, `"true"` when expanded

5. **Recency Indicators**
   - Should announce: "Critical Thinking. Recent activity. 5 demonstrations."
   - Colored dots should have `aria-label`: "Recent activity" (not decorative)

6. **Cross-Tab Links**
   - Should announce: "Critical Thinking. Link. Navigate to Skills tab and highlight this skill."
   - Should have descriptive `aria-label`

**Testing Steps:**
1. Turn on screen reader
2. Navigate dashboard with keyboard only
3. Listen to announcements for each interactive element
4. Verify announcements are clear, concise, and accurate

**Expected Results:**
- ✅ All interactive elements have accessible names
- ✅ Roles correctly identified (button, link, tab, etc.)
- ✅ State changes announced (expanded/collapsed, selected/not selected)
- ✅ No "unlabeled button" or "clickable" announcements

---

### Keyboard Navigation Full Test

**Complete Keyboard Flow:**
1. **Tab** to skip-to-main link → Press **Enter** → Focus jumps to main content
2. **Tab** to mode toggle → Press **Enter** → Mode switches, announcement confirms
3. **Tab** to breadcrumb "All Students" → Press **Enter** → Navigate to student list
4. **Tab** to "Skills" tab → Press **Enter** → Skills tab activates
5. **Tab** through skill cards → Press **Enter** on expandable header → Demonstrations expand
6. **Tab** to skill progression chart → **Arrow keys** to navigate data points → **Enter** to view details
7. **Tab** to "Critical Thinking" link → Press **Enter** → Jump to highlighted skill
8. **Tab** to "Next: Explore careers" button → Press **Enter** → Navigate to Careers tab
9. **Shift+Tab** to navigate backwards → Verify reverse order works

**Expected Results:**
- ✅ Entire dashboard navigable via keyboard
- ✅ No dead ends or keyboard traps
- ✅ Focus indicators always visible
- ✅ Tab order logical and efficient

---

### Screen Reader Testing

**NVDA (Windows) Test Script:**
```
1. Open dashboard in Firefox or Chrome
2. Start NVDA (Insert+N)
3. Navigate to dashboard
4. Use Down Arrow to read page sequentially
5. Use Tab to jump between interactive elements
6. Use Insert+F7 to list all links
7. Use Insert+F5 to list all form fields
8. Verify all content announced correctly
```

**VoiceOver (macOS) Test Script:**
```
1. Open dashboard in Safari
2. Start VoiceOver (Cmd+F5)
3. Navigate to dashboard
4. Use VO+A to read all content
5. Use VO+Right Arrow to navigate elements
6. Use Tab to jump between interactive elements
7. Use VO+U to open rotor, navigate by headings/links
8. Verify all content announced correctly
```

**Expected Announcements:**
- Mode toggle: "Toggle view mode. Your Personal View. Button."
- Tab: "Skills tab. 2 of 6. Selected."
- Skill card: "Critical Thinking. Heading level 3. 5 demonstrations. Recent activity."
- Chart: "Chart. Skill demonstration timeline showing growth over time."
- Link: "View careers requiring Critical Thinking. Link."

---

## USER ACCEPTANCE TESTING

### UAT Goals
1. Verify counselors find dashboard intuitive and actionable
2. Confirm parents comprehend Family Mode without explanation
3. Validate students see dashboard as encouraging (not punitive)
4. Ensure researchers find data accurate and methodology transparent

---

### UAT Participant Roles

**Counselor (Primary User)**
- High school guidance counselor
- Experience with career exploration tools
- Comfortable with technology
- Works with diverse student populations
- Tasks: Review student profiles, prepare for parent meetings, identify urgent students

**Parent (Secondary User)**
- Parent of high school student
- May have limited technical background
- Needs plain English explanations
- Tasks: Understand student's strengths/gaps, support at home, connect with resources

**Student (Occasional User)**
- High school student (grades 9-12)
- Comfortable with technology
- May have limited career knowledge
- Tasks: Self-review, explore careers, identify next steps

**Researcher (Advanced User)**
- Education researcher or program evaluator
- Requires technical accuracy
- Needs methodology transparency
- Tasks: Analyze data, validate algorithms, export raw data

---

### UAT Testing Protocol

#### Pre-Test Survey
Collect baseline data:
- How familiar are you with career exploration tools? (1-5 scale)
- How comfortable are you reading data visualizations? (1-5 scale)
- What is your primary goal when reviewing student career data?

#### Task-Based Testing
Each participant completes 5-10 tasks relevant to their role:

**Counselor Tasks:**
1. Identify which students need urgent attention
2. Review a specific student's skill strengths
3. Explain to a "parent" (tester) why student needs support
4. Find Birmingham opportunities for a student
5. Print action items for parent meeting
6. Navigate from Urgency → Skills → Careers → Gaps → Action

**Parent Tasks:**
1. Understand why your child was flagged for urgency
2. Identify your child's top 3 strengths
3. Explain what skills your child needs to develop
4. Find one local opportunity to support your child
5. Read conversation starters and identify one to try

**Student Tasks:**
1. Find your top demonstrated skills
2. Identify 2-3 careers that match your interests
3. Understand what you need to work on next
4. Find one Birmingham opportunity to explore
5. Decide on one action to take this week

**Researcher Tasks:**
1. Verify urgency calculation methodology
2. Export raw skill demonstration data
3. Validate match algorithm accuracy
4. Review evidence for specific framework (e.g., Erikson stages)
5. Cross-reference metrics across tabs for consistency

#### Think-Aloud Protocol
Participants narrate thoughts while completing tasks:
- "I'm looking for..."
- "I expect this to..."
- "I'm confused by..."
- "I would click here because..."

#### Post-Task Questionnaire
After each task:
- How easy was this task? (1-5 scale)
- How confident are you in the result? (1-5 scale)
- What was confusing or unclear?
- What would make this easier?

#### Post-Test Survey
Overall impressions:
- How would you rate the dashboard's usability? (1-10 scale)
- How accurate do you feel the data is? (1-10 scale)
- How likely are you to use this dashboard regularly? (1-10 scale)
- What's the most valuable feature?
- What's the biggest pain point?
- Would you recommend this dashboard to colleagues?

---

### UAT Success Criteria

**Quantitative Metrics:**
- Task completion rate: ≥90% (participants complete tasks without assistance)
- Time on task: ≤2 minutes per task (efficient navigation)
- Error rate: ≤10% (participants make wrong conclusions from data)
- Satisfaction: ≥8/10 average rating

**Qualitative Metrics:**
- Counselors use Family Mode when presenting to parents (observed behavior)
- Parents ask clarifying questions <2 times per session
- Students express positive reactions ("This is cool," "I didn't know I was good at that")
- Researchers validate data accuracy with zero discrepancies

**Critical Issues (Must Fix Before Launch):**
- Any participant unable to complete core task (e.g., counselor can't identify urgent student)
- Any jargon that confuses ≥2 participants
- Any contrast/accessibility issue that prevents task completion
- Any data inconsistency across tabs

**Nice-to-Have Improvements (Post-Launch):**
- Requests for additional features (e.g., export to PDF)
- Suggestions for alternative visualizations
- Requests for more Birmingham resources

---

### UAT Feedback Collection Template

**Participant:** [Name/Role]
**Date:** [Date]
**Mode Tested:** Family / Research
**Duration:** [Minutes]

**Tasks Completed:**
- [ ] Task 1: [Description] - ✅ Success / ⚠️ Struggled / ❌ Failed
- [ ] Task 2: [Description] - ✅ Success / ⚠️ Struggled / ❌ Failed
- [ ] Task 3: [Description] - ✅ Success / ⚠️ Struggled / ❌ Failed

**Observations:**
- What went well:
- What was confusing:
- What was surprising:
- What would improve experience:

**Quotes:**
- "[Participant exact words about feature X]"
- "[Participant reaction to data Y]"

**Usability Issues:**
1. [Issue description] - Severity: Critical / High / Medium / Low
2. [Issue description] - Severity: Critical / High / Medium / Low

**Recommendations:**
- [ ] Fix critical issues before launch
- [ ] Consider improvements for v2
- [ ] No changes needed

---

## REGRESSION TESTING

### Regression Test Suite
Verify no existing functionality broken by accessibility improvements.

#### Core Functionality Tests

**1. Student Profile Loading**
- [ ] Dashboard loads for existing student
- [ ] All tabs populate with correct data
- [ ] No console errors on page load
- [ ] No missing data or "undefined" values

**2. Mode Toggle Persistence**
- [ ] Mode selection saves to localStorage
- [ ] Mode persists across page refreshes
- [ ] Mode persists across different student profiles
- [ ] Mode resets if localStorage cleared

**3. Tab Navigation**
- [ ] All 6 tabs clickable and functional
- [ ] Active tab visually distinct
- [ ] Tab content loads correctly
- [ ] No tab content overlap or clipping

**4. Data Accuracy**
- [ ] Skill counts match raw demonstration data
- [ ] Match scores calculated correctly
- [ ] Urgency percentages accurate
- [ ] Birmingham employer counts correct
- [ ] Date/time stamps accurate

**5. Cross-Tab References**
- [ ] Clicking skill name in Careers jumps to Skills tab
- [ ] Highlighting works (background color change)
- [ ] Highlight clears after 3 seconds
- [ ] Scroll position correct after jump

**6. Chart Rendering**
- [ ] Skill progression chart displays correctly
- [ ] Data points plot accurately
- [ ] Axes labeled correctly
- [ ] Chart responsive to window resize

**7. Empty States**
- [ ] Empty state shows when no data exists
- [ ] Encouraging message displays
- [ ] No "undefined" or error messages
- [ ] "Next action" suggestion present

#### Build & Deploy Tests

**1. TypeScript Compilation**
```bash
npm run type-check
```
- [ ] Zero TypeScript errors
- [ ] Zero TypeScript warnings
- [ ] Build succeeds in <30 seconds

**2. ESLint**
```bash
npm run lint
```
- [ ] Zero ESLint errors
- [ ] No new ESLint warnings
- [ ] Code style consistent

**3. Production Build**
```bash
npm run build
```
- [ ] Build succeeds
- [ ] No missing dependencies
- [ ] Bundle size within limits (<500KB for admin dashboard)
- [ ] No critical warnings in output

**4. Development Server**
```bash
npm run dev
```
- [ ] Server starts without errors
- [ ] Hot reload works
- [ ] No port conflicts
- [ ] Console clean (no warnings)

---

### Regression Testing Checklist

**Before Starting Accessibility Work:**
1. Run full regression test suite
2. Document baseline metrics (load time, bundle size)
3. Take screenshots of all tabs in current state
4. Export sample data for validation

**After Each Week of Changes:**
1. Re-run regression test suite
2. Compare metrics to baseline
3. Verify no new console errors
4. Test on clean browser (no cache)

**Before Deployment:**
1. Full regression test on production build
2. Test on multiple browsers (Chrome, Firefox, Safari, Edge)
3. Test on mobile devices (iOS, Android)
4. Verify all accessibility improvements functional
5. Confirm no existing functionality broken

---

## PERFORMANCE BENCHMARKS

### Performance Metrics

**Initial Load Time**
- **Target:** <2 seconds on broadband, <5 seconds on 3G
- **Test:** Chrome DevTools Network tab (throttle to "Fast 3G")
- **Measurement:** Time from navigation to "First Contentful Paint"

**Tab Switching Speed**
- **Target:** <300ms transition between tabs
- **Test:** Click tab, measure time to content visible
- **Measurement:** Use Chrome DevTools Performance profiling

**Chart Rendering Time**
- **Target:** <500ms for skill progression chart
- **Test:** Load Skills tab, measure chart render
- **Measurement:** Console.time() around chart component

**Cross-Tab Navigation**
- **Target:** <200ms to jump and highlight skill
- **Test:** Click skill name in Careers, measure to Skills tab visible
- **Measurement:** Performance.now() timestamps

**Animation Smoothness**
- **Target:** 60 FPS (16.7ms per frame)
- **Test:** Expand skill demonstrations, monitor frame rate
- **Measurement:** Chrome DevTools Performance > FPS meter

---

### Performance Testing Protocol

**Baseline Measurements (Before Changes):**
```javascript
// In browser console
console.time('Initial Load');
window.addEventListener('load', () => console.timeEnd('Initial Load'));

console.time('Tab Switch');
// Click tab
console.timeEnd('Tab Switch');

console.time('Chart Render');
// Chart component mount
console.timeEnd('Chart Render');
```

**After Accessibility Changes:**
- Re-run all performance measurements
- Compare to baseline
- Investigate any regressions >10%

**Performance Budget:**
- Initial load: <2000ms
- Tab switch: <300ms
- Chart render: <500ms
- Cross-tab navigation: <200ms
- Animation frame time: <16.7ms

**If Budget Exceeded:**
1. Profile with Chrome DevTools Performance
2. Identify bottlenecks (JavaScript execution, rendering, layout)
3. Optimize (lazy load, memoize, debounce)
4. Re-test until within budget

---

## BROWSER COMPATIBILITY

### Browser Compatibility Matrix

| Browser | Version | Platform | Priority | Status |
|---------|---------|----------|----------|--------|
| Chrome | Latest (119+) | Windows, macOS, Linux | Critical | ✅ |
| Firefox | Latest (119+) | Windows, macOS, Linux | Critical | ✅ |
| Safari | Latest (17+) | macOS, iOS | Critical | ✅ |
| Edge | Latest (119+) | Windows | High | ✅ |
| Mobile Safari | iOS 15+ | iPhone, iPad | High | ✅ |
| Mobile Chrome | Latest | Android | High | ✅ |
| Chrome | 100-118 | All platforms | Medium | ⚠️ |
| Firefox | 100-118 | All platforms | Medium | ⚠️ |
| Safari | 15-16 | macOS, iOS | Medium | ⚠️ |

### Browser-Specific Testing

**Chrome (Latest)**
- [ ] All features functional
- [ ] Charts render correctly
- [ ] Focus indicators visible
- [ ] Smooth animations
- [ ] DevTools Lighthouse score ≥90

**Firefox (Latest)**
- [ ] All features functional
- [ ] Charts render correctly
- [ ] Focus indicators visible (Firefox uses dotted outline by default)
- [ ] CSS Grid layout correct
- [ ] No flexbox bugs

**Safari (macOS)**
- [ ] All features functional
- [ ] Charts render correctly (Safari can have SVG quirks)
- [ ] Focus indicators visible
- [ ] Date formatting correct (Safari date parsing strict)
- [ ] No webkit-specific bugs

**Safari (iOS)**
- [ ] Touch targets ≥44px
- [ ] Horizontal scroll smooth (tabs)
- [ ] Charts responsive to orientation change
- [ ] No zoom on input focus
- [ ] Sticky positioning works (quality badges)

**Edge (Latest)**
- [ ] All features functional (Edge is Chromium-based, should match Chrome)
- [ ] Enterprise features compatible (if applicable)
- [ ] Print functionality works

**Mobile Chrome (Android)**
- [ ] Touch targets ≥44px
- [ ] Charts render correctly
- [ ] Horizontal scroll smooth
- [ ] No Android-specific layout bugs

### Known Browser Issues & Workarounds

**Safari Date Parsing:**
- Issue: Safari strict about date formats
- Workaround: Use `new Date('2025-10-03T22:59:00')` (ISO 8601), not `new Date('10/3/2025')`

**Firefox Focus Outline:**
- Issue: Firefox uses dotted outline (not solid like Chrome)
- Workaround: Add custom focus styles: `outline: 2px solid #3b82f6; outline-offset: 2px;`

**iOS Safari Zoom on Input:**
- Issue: iOS zooms when input font-size <16px
- Workaround: Set all input font-size to 16px minimum

**Safari Sticky Positioning:**
- Issue: Safari requires `-webkit-sticky` prefix (older versions)
- Workaround: Use both `position: -webkit-sticky; position: sticky;`

### Cross-Browser Testing Tools

**BrowserStack** (Recommended)
- Test on real devices and browsers
- Automated screenshot testing
- Interactive debugging
- https://www.browserstack.com/

**LambdaTest**
- Real-time cross-browser testing
- Automated Lighthouse audits
- https://www.lambdatest.com/

**Manual Testing (Free)**
- Chrome DevTools Device Mode (mobile simulation)
- Firefox Responsive Design Mode
- Safari Technology Preview (beta features)
- Physical devices (if available)

---

## TESTING TIMELINE

### Week 1: Core Language Testing
**Day 1-2: Mode Toggle & Persistence**
- Test global toggle functionality
- Verify localStorage persistence
- Test mode switching across tabs

**Day 3: Narrative Bridges**
- Validate all bridges <25 words
- Test Family vs Research versions
- Verify tone and personalization

**Day 4: Glass Box Urgency**
- Test severity calibration (15-20, 20-25, 25-30, 30-40 words)
- Verify active voice and directive format
- Check color consistency

**Day 5: Empty States**
- Test all empty state scenarios
- Verify positive, encouraging tone
- Check Family vs Research versions

### Week 2: Chart & Visual Testing
**Day 1-2: Chart Interactivity**
- Test tooltips on hover and focus
- Test click handlers
- Test keyboard navigation (arrow keys)

**Day 2-3: Color Contrast**
- Run WCAG AA contrast checks
- Fix any failures
- Re-test with axe DevTools

**Day 3-4: Cross-Tab Navigation**
- Test all cross-tab links
- Verify highlighting works
- Check breadcrumb updates

**Day 4-5: Pattern Recognition & Recency**
- Test pattern analysis card
- Verify recency indicators
- Check date formatting

### Week 3: UAT & Regression
**Day 1-2: User Acceptance Testing**
- Recruit 4-8 participants (counselors, parents, students, researchers)
- Conduct task-based testing
- Collect feedback

**Day 3: Regression Testing**
- Run full regression suite
- Fix critical issues
- Re-test

**Day 4: Cross-Browser Testing**
- Test on Chrome, Firefox, Safari, Edge
- Test on iOS and Android
- Fix browser-specific bugs

**Day 5: Performance & Polish**
- Run performance benchmarks
- Optimize if needed
- Final accessibility audit

---

## TESTING SIGN-OFF CHECKLIST

Before launching to production, verify:

**Functionality:**
- [ ] All 6 tabs functional
- [ ] Mode toggle works and persists
- [ ] All narrative bridges <25 words
- [ ] All urgency narratives severity-calibrated
- [ ] All empty states positive and encouraging
- [ ] Charts interactive (tooltips, clicks, keyboard)
- [ ] Cross-tab navigation functional
- [ ] Breadcrumbs accurate

**Accessibility:**
- [ ] WCAG AA contrast: 100% compliant
- [ ] Keyboard navigation: 100% functional
- [ ] Screen reader: All elements labeled
- [ ] Focus indicators: All visible
- [ ] Reading level: Family Mode 6th-8th grade

**Performance:**
- [ ] Initial load: <2 seconds
- [ ] Tab switch: <300ms
- [ ] Chart render: <500ms
- [ ] Animations: 60 FPS

**Browser Compatibility:**
- [ ] Chrome (latest): ✅
- [ ] Firefox (latest): ✅
- [ ] Safari (latest): ✅
- [ ] Edge (latest): ✅
- [ ] Mobile Safari: ✅
- [ ] Mobile Chrome: ✅

**User Acceptance:**
- [ ] Counselor task completion: ≥90%
- [ ] Parent comprehension: ≥90%
- [ ] Student satisfaction: ≥8/10
- [ ] Researcher accuracy validation: 100%

**Regression:**
- [ ] Zero TypeScript errors
- [ ] Zero critical bugs
- [ ] All existing functionality preserved
- [ ] Build succeeds

---

## APPENDIX: TESTING TOOLS & RESOURCES

### Accessibility Tools
- **axe DevTools**: https://www.deque.com/axe/devtools/
- **WAVE**: https://wave.webaim.org/
- **Lighthouse**: Chrome DevTools > Lighthouse
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **NVDA Screen Reader**: https://www.nvaccess.org/download/
- **VoiceOver**: Built into macOS/iOS

### Readability Tools
- **Hemingway Editor**: http://www.hemingwayapp.com/
- **Readable**: https://readable.com/
- **WebFX Readability Test**: https://www.webfx.com/tools/read-able/

### Performance Tools
- **Chrome DevTools Performance**: Chrome > DevTools > Performance
- **WebPageTest**: https://www.webpagetest.org/
- **GTmetrix**: https://gtmetrix.com/

### Browser Testing
- **BrowserStack**: https://www.browserstack.com/
- **LambdaTest**: https://www.lambdatest.com/
- **Chrome DevTools Device Mode**: Chrome > DevTools > Toggle device toolbar

### Automated Testing
- **Playwright**: https://playwright.dev/ (for end-to-end testing)
- **Jest**: https://jestjs.io/ (for unit testing)
- **React Testing Library**: https://testing-library.com/react (for component testing)

---

**Last Updated:** October 4, 2025
**Version:** 1.0
**Maintained By:** Testing & QA Team
