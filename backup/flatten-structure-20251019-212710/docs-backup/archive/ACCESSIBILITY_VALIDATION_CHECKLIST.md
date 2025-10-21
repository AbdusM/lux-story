# Accessibility Validation Checklist
**Grand Central Terminus - Birmingham Career Exploration**

**Created:** October 4, 2025
**Purpose:** Comprehensive validation checklist for admin dashboard accessibility improvements
**Scope:** WCAG 2.1 Level AA compliance and usability validation

---

## TABLE OF CONTENTS
1. [Week 1: Core Language Improvements](#week-1-core-language-improvements)
2. [Week 2: Chart & Visual Accessibility](#week-2-chart--visual-accessibility)
3. [Week 3: Polish & Testing](#week-3-polish--testing)
4. [WCAG 2.1 Level AA Compliance](#wcag-21-level-aa-compliance)
5. [Cross-Browser Testing](#cross-browser-testing)
6. [Performance Validation](#performance-validation)
7. [Final Launch Checklist](#final-launch-checklist)

---

## WEEK 1: CORE LANGUAGE IMPROVEMENTS ✅

### 1.1 Global Family/Research Mode Toggle
- [ ] **Toggle component visible** in dashboard header
- [ ] **Toggle icon changes** based on mode:
  - Family Mode: Users icon or "Your Personal View"
  - Research Mode: GraduationCap icon or "Detailed Analysis"
- [ ] **Click handler functional** - mode switches on click
- [ ] **Preference persists** in localStorage:
  - Key: `admin_view_preference`
  - Value: `'family'` or `'research'`
- [ ] **Preference loads on page refresh** - mode remembered across sessions
- [ ] **Preference applies to all tabs** - not just Evidence tab
- [ ] **Visual feedback** on toggle (highlight, animation)
- [ ] **Accessible label** - `aria-label="Toggle view mode"`

**Test Cases:**
1. Toggle to Family Mode → Refresh page → Verify still in Family Mode
2. Toggle to Research Mode → Refresh page → Verify still in Research Mode
3. Clear localStorage → Verify defaults to Family Mode
4. Switch between student profiles → Verify mode persists

---

### 1.2 Narrative Bridge Improvements
All bridges must be <25 words, personalized, and action-oriented.

#### Skills → Careers Bridge
- [ ] **Family Mode version** <25 words
  - Example: "Jamal's shown 12 skills—here's where they lead in Birmingham. Focus on 'Near Ready' careers first."
  - Word count: ___/25
- [ ] **Research Mode version** <25 words
  - Example: "12 skill demonstrations analyzed against Birmingham labor market data. Match algorithm: skills (40%), education access (30%), local demand (30%)."
  - Word count: ___/25
- [ ] **Personalized** - uses student name
- [ ] **Action-oriented** - tells user what to do next
- [ ] **Contextual** - references skill count

#### Careers → Gaps Bridge
- [ ] **Family Mode version** <25 words
  - Example: "Looking at 3 careers Jordan's interested in, here's what to unlock next. Think: new opportunities, not problems."
  - Word count: ___/25
- [ ] **Research Mode version** <25 words
  - Example: "Gap analysis for 3 career targets. Priority ranking: impact on career access × current proficiency × time to develop."
  - Word count: ___/25
- [ ] **Personalized** - uses student name
- [ ] **Positive framing** - "unlock" not "fix"

#### Gaps → Action Bridge
- [ ] **Family Mode version** <25 words
  - Example: "Here's how to build these skills. Focus on Birmingham opportunities you can start this week."
  - Word count: ___/25
- [ ] **Research Mode version** <25 words
  - Example: "Recommended development pathways with local implementation strategies. Priority-ranked by impact and feasibility."
  - Word count: ___/25
- [ ] **Actionable** - "start this week"
- [ ] **Localized** - references Birmingham

#### Action → Evidence Bridge
- [ ] **Family Mode version** <25 words
  - Example: "See the data behind these recommendations. All based on choices Jordan made in the story."
  - Word count: ___/25
- [ ] **Research Mode version** <25 words
  - Example: "Evidence-based framework analysis. View raw data, methodology, and research validation."
  - Word count: ___/25
- [ ] **Transparent** - explains data source

---

### 1.3 Glass Box Urgency Narratives
Severity-calibrated word counts: Critical (15-20), High (20-25), Medium (25-30), Low (30-40).

#### Critical Urgency (15-20 words)
- [ ] **Format correct**: [Emoji] [Name] [PROBLEM]. [Hypothesis]. **Action:** [Directive with timeframe].
- [ ] **Word count**: 15-20 words
  - Example: "🚨 Jordan stopped playing 5 days ago after a strong start (8 choices). Might be stuck. **Action:** Reach out today."
  - Word count: ___/20 (target: 18)
- [ ] **Active voice** - no passive constructions
- [ ] **Directive clear** - "Reach out today" (not "Consider reaching out")
- [ ] **Emoji present** - 🚨 for critical
- [ ] **Buried lede avoided** - problem stated upfront
- [ ] **Timeframe specific** - "today" not "soon"

#### High Urgency (20-25 words)
- [ ] **Format correct**: [Emoji] [Name] [PROBLEM]. [Hypothesis]. **Action:** [Directive with timeframe].
- [ ] **Word count**: 20-25 words
  - Example: "🟠 Maya's choices show anxiety patterns (4 family conflict scenes). She might need support navigating parent pressure. **Action:** Check in this week."
  - Word count: ___/25 (target: 22)
- [ ] **Active voice**
- [ ] **Directive clear** - "Check in this week"
- [ ] **Emoji present** - 🟠 for high
- [ ] **Evidence cited** - "4 family conflict scenes"

#### Medium Urgency (25-30 words)
- [ ] **Format correct**: [Emoji] [Name] [PROBLEM]. [Hypothesis]. **Action:** [Directive with timeframe].
- [ ] **Word count**: 25-30 words
  - Example: "🟡 Devon hasn't explored new careers in 2 weeks. Comfortable with engineering but might benefit from broader options. **Action:** Gentle nudge within 2 weeks."
  - Word count: ___/30 (target: 27)
- [ ] **Active voice**
- [ ] **Directive clear** - "Gentle nudge within 2 weeks"
- [ ] **Emoji present** - 🟡 for medium
- [ ] **Balanced tone** - acknowledges comfort + growth opportunity

#### Low Urgency (30-40 words)
- [ ] **Format correct**: [Emoji] [Name] [POSITIVE]. [Details]. **Action:** [Supportive directive].
- [ ] **Word count**: 30-40 words
  - Example: "✅ Samuel's doing great! Balanced exploration across 4 careers, consistent engagement (daily logins), asking thoughtful questions. **Action:** Monthly check-in to celebrate progress and discuss next steps."
  - Word count: ___/40 (target: 35)
- [ ] **Positive tone** - celebrates success
- [ ] **Detailed** - more words allowed for low urgency
- [ ] **Emoji present** - ✅ for low/positive
- [ ] **Action supportive** - "celebrate progress"

---

### 1.4 Section Header Personalization
All tabs must use personalized headers in Family Mode.

#### Skills Tab
- [ ] **Generic header removed**: "Key Evidence"
- [ ] **Family Mode header**: "Jordan's Strongest Moments"
- [ ] **Research Mode header**: "Top Skill Demonstrations (by strength)"
- [ ] **Personalized** - uses student name in Family Mode

#### Careers Tab
- [ ] **Generic header removed**: "Career Matches"
- [ ] **Family Mode header**: "Where Jordan's Skills Lead"
- [ ] **Research Mode header**: "Labor Market Alignment Analysis"
- [ ] **Personalized** - uses student name in Family Mode

#### Gaps Tab
- [ ] **Generic header removed**: "Skill Requirements"
- [ ] **Family Mode header**: "What's Needed for This Career"
- [ ] **Research Mode header**: "Required Competencies & Gap Analysis"
- [ ] **Clear** - plain English in Family Mode

#### Urgency Tab
- [ ] **Generic header removed**: "Contributing Factors"
- [ ] **Family Mode header**: "Why Jordan Needs Attention"
- [ ] **Research Mode header**: "Urgency Calculation Factors"
- [ ] **Personalized** - uses student name in Family Mode

#### Action Tab
- [ ] **Generic header removed**: "Development Pathways"
- [ ] **Family Mode header**: "How to Get There"
- [ ] **Research Mode header**: "Recommended Skill Acquisition Sequence"
- [ ] **Clear** - plain English in Family Mode

#### Action Tab (Birmingham Section)
- [ ] **Generic header removed**: "Birmingham Opportunities"
- [ ] **Family Mode header**: "Local Ways to Explore This"
- [ ] **Research Mode header**: "Regional Employer Partnerships"
- [ ] **Actionable** - "Local Ways" not "Opportunities"

---

### 1.5 Empty State Improvements
All empty states must be positive, encouraging, and provide next steps.

#### Skills Tab Empty State
- [ ] **Negative state removed**: "No skill data available"
- [ ] **Improved state**: "🎯 Ready to explore skills! Skill tracking starts after making choices in the story."
- [ ] **Emoji present** - 🎯
- [ ] **Positive tone** - "Ready to explore"
- [ ] **Next action clear** - "making choices in the story"
- [ ] **Dual-mode support** - Family and Research versions if needed

#### Careers Tab Empty State
- [ ] **Negative state removed**: "No career explorations yet"
- [ ] **Improved state**: "✨ Career possibilities ahead! Careers appear as you explore different story paths."
- [ ] **Emoji present** - ✨
- [ ] **Positive tone** - "possibilities ahead"
- [ ] **Next action clear** - "explore different story paths"

#### Urgency Tab Empty State
- [ ] **Negative state removed**: "No urgent students found"
- [ ] **Improved state**: "✅ Great news - no urgent students! Check back after more activity, or view 'All Students'."
- [ ] **Emoji present** - ✅
- [ ] **Positive tone** - "Great news"
- [ ] **Next action clear** - "Check back after more activity"

#### Gaps Tab Empty State
- [ ] **Negative state removed**: "No gaps identified"
- [ ] **Improved state**: "🎉 Looking strong! No major skill gaps detected for top career matches."
- [ ] **Emoji present** - 🎉
- [ ] **Positive tone** - "Looking strong"
- [ ] **Contextual** - "for top career matches"

#### Action Tab Empty State
- [ ] **Negative state removed**: "No action items"
- [ ] **Improved state**: "👍 All set! No immediate actions needed. Check back weekly for updates."
- [ ] **Emoji present** - 👍
- [ ] **Positive tone** - "All set"
- [ ] **Next action clear** - "Check back weekly"

---

## WEEK 2: CHART & VISUAL ACCESSIBILITY ✅

### 2.1 Skill Progression Chart Enhancements

#### Tooltips
- [ ] **Tooltips visible on hover** - shows skill details
- [ ] **Tooltips visible on focus** - keyboard accessible
- [ ] **Tooltip content complete**:
  - [ ] Skill name (bold)
  - [ ] Demonstration count (Family Mode: "Shown 5 times")
  - [ ] Date (Family Mode: "October 3, 2025" | Research Mode: "2025-10-03T22:59:00")
  - [ ] Click prompt (Research Mode only): "Click to view demonstrations →"
- [ ] **Tooltips styled**:
  - [ ] White background
  - [ ] Border and shadow for depth
  - [ ] Readable font size (≥14px)
  - [ ] Adequate padding (12px)
- [ ] **Tooltips dual-mode** - Family and Research versions

#### Click Handlers
- [ ] **Data points clickable** - cursor changes to pointer
- [ ] **Click scrolls to demonstration** - smooth scroll behavior
- [ ] **Highlight applied** - demonstration card background changes
- [ ] **Highlight clears** - after 3 seconds

#### Keyboard Navigation
- [ ] **Chart container focusable** - `tabindex="0"`
- [ ] **Arrow keys navigate data points**:
  - [ ] Left/Right: previous/next data point
  - [ ] Up/Down: previous/next skill (if multiple lines)
- [ ] **Enter key activates** - scrolls to demonstration
- [ ] **Focus indicator visible** - ring or outline on active data point

#### Accessibility
- [ ] **SVG has `<desc>` tag** - "Skill demonstration timeline showing growth over time"
- [ ] **Data points have `aria-label`** - "Critical Thinking - 5 demonstrations on October 3, 2025"
- [ ] **Role attribute** - `role="img"` on SVG container
- [ ] **Keyboard instructions** - visually hidden text explains arrow key navigation

---

### 2.2 Sparkline Trend Charts
- [ ] **Tooltips on hover/focus** - shows trend data
- [ ] **Accessible labels** - `aria-label` on SVG
- [ ] **Dual-mode tooltips** - Family and Research versions
- [ ] **Small but readable** - adequate size for touch targets if interactive

---

### 2.3 Pattern Recognition Card
- [ ] **Card visible** on Skills tab
- [ ] **Header correct**:
  - [ ] Family Mode: "🔍 Patterns We Noticed"
  - [ ] Research Mode: "Pattern Analysis: Scene Type Distribution"
- [ ] **Content dual-mode**:
  - [ ] Family Mode: Bullet list with plain English insights
    - Example: "💬 Communication shows up most in family scenes (5 times)"
  - [ ] Research Mode: Progress bars with percentages
- [ ] **Data accurate** - matches raw demonstration logs
- [ ] **Accessible** - screen reader can parse insights

---

### 2.4 WCAG AA Color Contrast (4.5:1 Minimum)

#### Text on Colored Backgrounds
- [ ] **Blue narrative box**: `text-gray-800` on `bg-blue-50`
  - Contrast ratio: ___:1 (must be ≥4.5:1)
  - Test URL: https://webaim.org/resources/contrastchecker/
- [ ] **Badge text**: `text-gray-700` on badge background
  - Contrast ratio: ___:1 (must be ≥4.5:1)
- [ ] **Scene names**: `text-gray-600` on white
  - Contrast ratio: ___:1 (must be ≥4.5:1)
- [ ] **Link text**: `text-blue-600` on white
  - Contrast ratio: ___:1 (must be ≥4.5:1)
- [ ] **Chart axis labels**: `text-gray-700` or darker
  - Contrast ratio: ___:1 (must be ≥4.5:1)

#### Urgency Color Consistency
All urgency levels must have matching colors across badge, border, percentage, and background.

**Critical Urgency:**
- [ ] **Badge color**: `bg-red-100 text-red-800 border-red-300`
- [ ] **Border-left accent**: `border-l-4 border-red-600`
- [ ] **Percentage color**: `text-red-600 font-semibold`
- [ ] **Background tint**: `bg-red-50/50` (50% opacity)
- [ ] **Contrast verified**: All text meets 4.5:1 ratio

**High Urgency:**
- [ ] **Badge color**: `bg-orange-100 text-orange-800 border-orange-300`
- [ ] **Border-left accent**: `border-l-4 border-orange-600`
- [ ] **Percentage color**: `text-orange-600 font-semibold`
- [ ] **Background tint**: `bg-orange-50/50`
- [ ] **Contrast verified**: All text meets 4.5:1 ratio

**Medium Urgency:**
- [ ] **Badge color**: `bg-yellow-100 text-yellow-800 border-yellow-300`
- [ ] **Border-left accent**: `border-l-4 border-yellow-600`
- [ ] **Percentage color**: `text-yellow-600 font-semibold`
- [ ] **Background tint**: `bg-yellow-50/50`
- [ ] **Contrast verified**: All text meets 4.5:1 ratio

**Low Urgency:**
- [ ] **Badge color**: `bg-green-100 text-green-800 border-green-300`
- [ ] **Border-left accent**: `border-l-4 border-green-600`
- [ ] **Percentage color**: `text-green-600 font-semibold`
- [ ] **Background tint**: `bg-green-50/50`
- [ ] **Contrast verified**: All text meets 4.5:1 ratio

---

### 2.5 Recency Indicators
All skills must show recency with color-coded dots and labels.

**Recent (<3 days):**
- [ ] **Green dot visible**: `bg-green-500 w-2 h-2 rounded-full`
- [ ] **Family Mode label**: "New!" in `text-green-700`
- [ ] **Research Mode label**: "<3 days" in `text-gray-600`
- [ ] **Accessible label**: `aria-label="Recent activity"`
- [ ] **Tooltip on hover**: "Last demonstrated 2 days ago"

**This Week (3-7 days):**
- [ ] **Yellow dot visible**: `bg-yellow-500 w-2 h-2 rounded-full`
- [ ] **Family Mode label**: "This week" in `text-yellow-700`
- [ ] **Research Mode label**: "3-7 days" in `text-gray-600`
- [ ] **Accessible label**: `aria-label="Recent activity"`
- [ ] **Tooltip on hover**: "Last demonstrated 5 days ago"

**Older (>7 days):**
- [ ] **Gray dot visible**: `bg-gray-400 w-2 h-2 rounded-full`
- [ ] **No label in Family Mode** - dot only
- [ ] **Research Mode label**: ">7 days" in `text-gray-600`
- [ ] **Accessible label**: `aria-label="Older activity"`
- [ ] **Tooltip on hover**: "Last demonstrated 12 days ago"

---

### 2.6 Cross-Tab Navigation

#### Breadcrumbs
- [ ] **Breadcrumbs visible** at top of dashboard
- [ ] **Format correct**: "All Students > Jordan Davis > Skills Tab"
- [ ] **Links functional**:
  - [ ] "All Students" navigates to student list
  - [ ] "Jordan Davis" navigates to student overview
  - [ ] Current tab is text only (not clickable)
- [ ] **Icons present**: ChevronRight between segments
- [ ] **Accessible**: Proper `<nav>` and `aria-label="Breadcrumb"`
- [ ] **Dynamic**: Updates when tab changes

#### Active Tab Visual State
- [ ] **Active tab background**: `bg-blue-50`
- [ ] **Active tab border**: `border-t-2 border-blue-600`
- [ ] **Active tab font**: `font-semibold`
- [ ] **Inactive tabs**: Normal background, no border, regular font
- [ ] **Hover state**: `hover:bg-gray-100` on inactive tabs
- [ ] **Focus state**: Visible focus ring on all tabs

#### Cross-Tab Links
- [ ] **Skills → Careers link** functional
  - Click skill name in Careers tab → Jump to Skills tab
  - [ ] Skill card highlighted (background change)
  - [ ] Scroll position correct (skill visible)
  - [ ] Highlight clears after 3 seconds
- [ ] **Careers → Skills link** functional
  - Click skill requirement name → Jump to Skills tab
  - [ ] Skill highlighted
  - [ ] Scroll position correct
- [ ] **Link styling**: `text-blue-600 hover:underline cursor-pointer`
- [ ] **Accessible**: Proper `<a>` or `<button>` with descriptive label

#### "Next Tab" Suggestions
- [ ] **Suggestion visible** at bottom of each tab
- [ ] **Button functional** - navigates to suggested tab
- [ ] **Icon present**: ArrowRight with hover animation (`group-hover:translate-x-1`)
- [ ] **Content contextual**:
  - [ ] Urgency tab: "See what skills they've shown" → Skills
  - [ ] Skills tab: "Explore matching careers" → Careers
  - [ ] Careers tab: "See what to work on next" → Gaps
  - [ ] Gaps tab: "Get concrete next steps" → Action
- [ ] **Dual-mode text**: Family and Research versions

---

## WEEK 3: POLISH & TESTING

### 3.1 Inline Context for All Metrics
No orphan percentages or numbers without explanation.

#### Match Scores
- [ ] **Orphan removed**: "45% match"
- [ ] **Family Mode context**: "45% fit based on 8 skills"
- [ ] **Research Mode context**: "45% career match (skills: 40%, education: 30%, local: 30%)"
- [ ] **Explanation visible** inline (not tooltip)

#### Urgency Percentages
- [ ] **Orphan removed**: "78% urgency"
- [ ] **Family Mode context**: "Attention needed: High (78%)"
- [ ] **Research Mode context**: "78% urgency score (disengagement risk)"
- [ ] **Color matches urgency level** (orange-600 for high)

#### Birmingham Relevance
- [ ] **Orphan removed**: "85% Birmingham relevance"
- [ ] **Family Mode context**: "85% of jobs are in Birmingham (12 of 14 employers)"
- [ ] **Research Mode context**: "85% regional concentration (12/14 Birmingham employers)"
- [ ] **Employer count included**

#### Demonstration Counts
- [ ] **Orphan removed**: "24 demonstrations"
- [ ] **Family Mode context**: "Shown 24 times"
- [ ] **Research Mode context**: "24 skill demonstrations across 12 scenes"
- [ ] **Scene count included** in Research Mode

---

### 3.2 Date Formatting Consistency

#### Urgency Tab: Always Relative Time
- [ ] **Format**: "2 hours ago" (not "2h" or "2 hours")
- [ ] **Label included**: "Last active: 2 hours ago"
- [ ] **Recent examples**:
  - [ ] <1 hour: "45 minutes ago"
  - [ ] 1-24 hours: "5 hours ago"
  - [ ] 1-7 days: "3 days ago"
  - [ ] 7-30 days: "2 weeks ago"
  - [ ] >30 days: "1 month ago"

#### Evidence Tab: Always Full Dates
- [ ] **Format**: "October 3, 2025 at 10:59 PM"
- [ ] **ISO 8601 compatible**: Works in Safari
- [ ] **Timezone considered**: Uses local timezone or specifies UTC
- [ ] **Label included**: "Demonstrated on October 3, 2025 at 10:59 PM"

#### Activity Summaries: Hybrid Approach
- [ ] **Recent (<7 days)**: "2 hours ago"
- [ ] **Older (≥7 days)**: "October 1, 2025"
- [ ] **Label included**: "Last active: [date]"
- [ ] **Consistent across tabs**

---

### 3.3 Empty States Final Validation
- [ ] **All empty states tested** with zero data
- [ ] **All positive and encouraging** - no negative language
- [ ] **All dual-mode** - Family and Research versions
- [ ] **All actionable** - suggest next steps
- [ ] **No "undefined" or errors** - graceful handling

---

## WCAG 2.1 LEVEL AA COMPLIANCE

### 1.4.3 Contrast (Minimum)
- [ ] **All text meets 4.5:1 ratio** against background
- [ ] **Large text (≥18pt/14pt bold) meets 3:1 ratio**
- [ ] **Tested with WebAIM Contrast Checker**
- [ ] **No contrast warnings in axe DevTools**
- [ ] **Documented**: All color combinations and ratios in style guide

---

### 2.1.1 Keyboard
- [ ] **All functionality keyboard accessible** - no mouse required
- [ ] **Tab order logical** - follows visual layout
- [ ] **Focus indicators visible** - all interactive elements
- [ ] **No keyboard traps** - can always navigate away
- [ ] **Shortcuts documented** (if applicable)

**Full Keyboard Flow Test:**
1. [ ] Tab to mode toggle → Press Enter → Mode switches
2. [ ] Tab to breadcrumb links → Press Enter → Navigate correctly
3. [ ] Tab to tab navigation → Press Enter → Tab switches
4. [ ] Tab to chart → Arrow keys navigate → Enter activates
5. [ ] Tab to cross-tab links → Press Enter → Jump to correct tab
6. [ ] Tab to expandable headers → Enter/Space toggles
7. [ ] Tab to "Next Tab" button → Press Enter → Navigate to next tab
8. [ ] Shift+Tab reverses order correctly

---

### 2.4.7 Focus Visible
- [ ] **Focus ring visible** on all interactive elements
- [ ] **Focus ring meets 3:1 contrast** against background
- [ ] **Focus ring does not obscure content**
- [ ] **Focus ring consistent** - same style across dashboard
- [ ] **Tested on all browsers** (Chrome, Firefox, Safari focus styles may differ)

**Focus Ring Styling:**
- [ ] Minimum 2px solid outline
- [ ] Color: `ring-blue-600` or equivalent
- [ ] Offset: 2px from element
- [ ] Visible on white and colored backgrounds

---

### 3.1.5 Reading Level
- [ ] **Family Mode: 6th-8th grade** (Flesch-Kincaid 6.0-8.0)
- [ ] **Tested with Hemingway Editor** or Readable
- [ ] **All narrative text scored** (bridges, urgency narratives, headers)
- [ ] **Complex terms explained** or avoided in Family Mode
- [ ] **Research Mode: Accurate, not simplified** - technical terms allowed

**Readability Scores:**
- [ ] Urgency narratives: ___/8.0 (Flesch-Kincaid Grade)
- [ ] Narrative bridges: ___/8.0
- [ ] Section headers: ___/8.0
- [ ] Empty states: ___/8.0

---

### 4.1.2 Name, Role, Value
- [ ] **All interactive elements labeled** - no "unlabeled button"
- [ ] **ARIA roles correct** - button, link, tab, tabpanel, etc.
- [ ] **State changes announced** - expanded/collapsed, selected/not selected
- [ ] **Tested with screen reader** (NVDA, JAWS, VoiceOver)

**Screen Reader Announcements:**
- [ ] Mode toggle: "Toggle view mode. Current mode: Your Personal View. Button."
- [ ] Tab: "Skills tab. 2 of 6. Selected."
- [ ] Chart: "Chart. Skill demonstration timeline showing growth over time."
- [ ] Recency dot: "Critical Thinking. Recent activity. 5 demonstrations."
- [ ] Cross-tab link: "Critical Thinking. Link. Navigate to Skills tab."
- [ ] Expandable header: "Skill demonstrations. Collapsed. Button. Press to expand."

---

## CROSS-BROWSER TESTING

### Chrome (Latest)
- [ ] All features functional
- [ ] Charts render correctly
- [ ] Focus indicators visible
- [ ] Smooth animations (≥60 FPS)
- [ ] DevTools Lighthouse score ≥90
- [ ] No console errors
- [ ] localStorage works

### Firefox (Latest)
- [ ] All features functional
- [ ] Charts render correctly (no SVG quirks)
- [ ] Focus indicators visible (dotted outline acceptable)
- [ ] CSS Grid layout correct
- [ ] Flexbox works (no Firefox-specific bugs)
- [ ] No console errors
- [ ] localStorage works

### Safari (macOS)
- [ ] All features functional
- [ ] Charts render correctly (test SVG rendering)
- [ ] Focus indicators visible
- [ ] Date formatting works (Safari strict about formats)
- [ ] Sticky positioning works (data quality badges)
- [ ] No webkit-specific bugs
- [ ] localStorage works

### Safari (iOS)
- [ ] Touch targets ≥44px
- [ ] Horizontal scroll smooth (tab navigation)
- [ ] Charts responsive to orientation change
- [ ] No zoom on input focus (font-size ≥16px)
- [ ] Sticky positioning works
- [ ] No iOS-specific layout bugs
- [ ] localStorage works

### Edge (Latest)
- [ ] All features functional (should match Chrome - Chromium-based)
- [ ] No Edge-specific bugs
- [ ] Print functionality works
- [ ] localStorage works

### Mobile Chrome (Android)
- [ ] Touch targets ≥44px
- [ ] Charts render correctly
- [ ] Horizontal scroll smooth
- [ ] No Android-specific layout bugs
- [ ] localStorage works

---

## PERFORMANCE VALIDATION

### Initial Load Time
- [ ] **Target: <2 seconds** on broadband
- [ ] **Measured**: ___ seconds (Chrome DevTools Network tab)
- [ ] **Target: <5 seconds** on 3G
- [ ] **Measured**: ___ seconds (throttle to "Fast 3G")
- [ ] **First Contentful Paint**: ___ ms
- [ ] **Largest Contentful Paint**: ___ ms

### Tab Switching Speed
- [ ] **Target: <300ms** transition
- [ ] **Measured**: ___ ms (Chrome DevTools Performance)
- [ ] **Smooth animation** - no janky frames
- [ ] **Content loads immediately** - no delay

### Chart Rendering Time
- [ ] **Target: <500ms** for skill progression chart
- [ ] **Measured**: ___ ms (console.time() around chart component)
- [ ] **Responsive to resize** - re-renders smoothly

### Cross-Tab Navigation Speed
- [ ] **Target: <200ms** to jump and highlight
- [ ] **Measured**: ___ ms (Performance.now() timestamps)
- [ ] **Smooth scroll** - no janky behavior
- [ ] **Highlight visible** immediately

### Animation Smoothness
- [ ] **Target: 60 FPS** (16.7ms per frame)
- [ ] **Measured**: ___ FPS (Chrome DevTools Performance > FPS meter)
- [ ] **Expandable sections smooth** - no lag
- [ ] **Hover effects smooth** - no stutter

### Bundle Size
- [ ] **Target: <500KB** for admin dashboard
- [ ] **Measured**: ___ KB (production build)
- [ ] **No large dependencies** added
- [ ] **Tree-shaking enabled**

---

## FINAL LAUNCH CHECKLIST

### Functionality ✅
- [ ] All 6 tabs functional (Urgency, Skills, Careers, Gaps, Action, Evidence)
- [ ] Mode toggle works and persists
- [ ] All narrative bridges <25 words
- [ ] All urgency narratives severity-calibrated (15-20, 20-25, 25-30, 30-40)
- [ ] All empty states positive and encouraging
- [ ] Charts interactive (tooltips, clicks, keyboard)
- [ ] Cross-tab navigation functional
- [ ] Breadcrumbs accurate and dynamic
- [ ] Recency indicators on all skills
- [ ] Pattern recognition card visible and accurate

### Accessibility ✅
- [ ] WCAG AA contrast: 100% compliant (all text ≥4.5:1)
- [ ] Keyboard navigation: 100% functional (no mouse required)
- [ ] Screen reader: All elements labeled correctly
- [ ] Focus indicators: All visible and meet 3:1 contrast
- [ ] Reading level: Family Mode 6th-8th grade (Flesch-Kincaid ≤8.0)
- [ ] ARIA labels: Correct roles, names, and values

### Performance ✅
- [ ] Initial load: <2 seconds (broadband), <5 seconds (3G)
- [ ] Tab switch: <300ms
- [ ] Chart render: <500ms
- [ ] Cross-tab navigation: <200ms
- [ ] Animations: 60 FPS (16.7ms per frame)
- [ ] Bundle size: <500KB

### Browser Compatibility ✅
- [ ] Chrome (latest): ✅ All features work
- [ ] Firefox (latest): ✅ All features work
- [ ] Safari (latest): ✅ All features work, no SVG quirks
- [ ] Edge (latest): ✅ All features work
- [ ] Mobile Safari: ✅ Touch targets ≥44px, no zoom bugs
- [ ] Mobile Chrome: ✅ All features work

### User Acceptance ✅
- [ ] Counselor task completion: ≥90%
- [ ] Parent comprehension: ≥90% (no jargon confusion)
- [ ] Student satisfaction: ≥8/10
- [ ] Researcher accuracy validation: 100% (data correct)
- [ ] Feedback collected and analyzed
- [ ] Critical issues fixed

### Regression ✅
- [ ] Zero TypeScript errors (`npm run type-check`)
- [ ] Zero ESLint errors (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Zero critical bugs in production
- [ ] All existing functionality preserved
- [ ] No console errors on page load

### Documentation ✅
- [ ] Testing guide complete
- [ ] Accessibility checklist complete
- [ ] Style guide updated with new patterns
- [ ] Readability scores documented
- [ ] Contrast ratios documented
- [ ] Browser compatibility matrix complete

---

## SIGN-OFF

**Tested By:** ___________________
**Date:** ___________________
**Build Version:** ___________________
**All Critical Items Verified:** [ ] Yes [ ] No

**Notes:**
___________________________________________________________________________
___________________________________________________________________________
___________________________________________________________________________

**Approved for Production:** [ ] Yes [ ] No

**Approver Name:** ___________________
**Approver Signature:** ___________________
**Date:** ___________________

---

**Last Updated:** October 4, 2025
**Version:** 1.0
**Maintained By:** Testing & QA Team
