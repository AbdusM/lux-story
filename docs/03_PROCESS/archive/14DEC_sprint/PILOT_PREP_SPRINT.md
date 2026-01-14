# Pilot Prep Sprint - Option B (Conservative)
**Start Date:** December 14, 2024
**Target Ship Date:** January 3, 2025 (3 weeks)
**Goal:** Ship polished, beta-tested, pilot-ready product to Anthony

---

## Sprint Philosophy

**Conservative = Complete:**
- All gaps closed before shipping
- Beta tested with real students
- Full character roster at 30+ nodes
- Educator dashboard built
- Mobile UX validated
- Zero compromises

**Why 3 Weeks:**
- Week 1 (Dec 14-20): Critical gaps + Marcus/Kai expansion
- Week 2 (Dec 21-27): Beta testing + polish (includes holidays)
- Week 3 (Dec 28-Jan 3): Final polish + Anthony outreach

---

## Week 1: Critical Gaps + Content (Dec 14-20)

### Day 1-2: Session Boundaries (2 hours) 🔴 CRITICAL
**Task:** Mark session boundaries in 10 remaining character arcs

**Characters to mark:**
- Maya (30 nodes) → Boundaries at nodes 10, 20, 30
- Devon (36 nodes) → Boundaries at nodes 10, 20, 30
- Jordan (30 nodes) → Boundaries at nodes 10, 20, 30
- Tess (30 nodes) → Boundaries at nodes 10, 20, 30
- Alex (30 nodes) → Boundaries at nodes 10, 20, 30
- Rohan (30 nodes) → Boundaries at nodes 10, 20, 30
- Marcus (23 nodes) → Boundaries at nodes 10, 20
- Kai (18 nodes) → Boundary at node 10
- Yaquin (11 nodes) → Boundary at node 10
- Lira (8 nodes) → No boundary (too short)
- Silas (8 nodes) → No boundary (too short)

**Platform announcements rotation:**
Use existing 21 announcements, randomize per character

**Deliverable:** All playable arcs have natural pause points

---

### Day 2-3: Intersection Scene Boundaries (1 hour) 🟡
**Task:** Mark session boundaries in 3 intersection scenes

- Maya + Devon (6 nodes) → Boundary at node 3
- Tess + Rohan (7 nodes) → Boundary at node 4
- Alex + Jordan (7 nodes) → Boundary at node 4

**Deliverable:** Intersection scenes have mid-scene pause

---

### Day 3-5: Marcus Arc Expansion (6 hours) 🟡 IMPORTANT
**Current:** 23 nodes
**Target:** 30 nodes
**Gap:** +7 nodes

**Content Focus:**
- Marcus's healthcare journey (nursing → making → biodesign)
- Birmingham healthcare connections (UAB, Children's of Alabama)
- Maker/builder crossover (3D printing prosthetics, medical devices)
- Trust progression (nodes 20-30)

**New nodes:**
1. marcus_crossroads_3: Healthcare system frustrations
2. marcus_making_discovery: First time using 3D printer for medical model
3. marcus_biodesign_realization: Merge of nursing + making
4. marcus_uab_connection: Birmingham biomedical opportunity
5. marcus_patient_story: Why this work matters (emotional anchor)
6. marcus_mentorship_moment: Helping younger maker
7. marcus_arc_synthesis: Healthcare + making = unique path

**Deliverable:** Marcus at 30 nodes, healthcare career angle complete

---

### Day 5-7: Kai Arc Expansion (12 hours) 🟡 IMPORTANT
**Current:** 18 nodes
**Target:** 30 nodes
**Gap:** +12 nodes

**Content Focus:**
- Industrial/manufacturing career path (Birmingham steel, automotive)
- Systems thinking + hands-on work
- Vocational training vs college dilemma
- Birmingham manufacturing opportunities (Nucor, Mercedes-Benz U.S. International)

**New nodes:**
1. kai_intro_extended: More about factory background
2. kai_vocational_path: Why he chose trade school
3. kai_first_weld: Concrete skill moment
4. kai_systems_revelation: Seeing how factory floor connects
5. kai_college_pressure: Family wants him to get degree
6. kai_birmingham_steel: Nucor Steel opportunity
7. kai_mentorship: Learning from veteran machinist
8. kai_automation_fear: CNC machines replacing workers
9. kai_hybrid_path: Trade skills + engineering degree
10. kai_hands_on_wisdom: Value of making things
11. kai_career_synthesis: Manufacturing + innovation
12. kai_arc_complete: Confident in vocational + technical path

**Deliverable:** Kai at 30 nodes, manufacturing career angle complete

---

### Week 1 Deliverable
- ✅ All session boundaries marked (33 total across 13 arcs)
- ✅ Marcus at 30 nodes (healthcare + making)
- ✅ Kai at 30 nodes (manufacturing + innovation)
- ✅ 406 total nodes (from 379)

---

## Week 2: Beta Testing + Educator Dashboard (Dec 21-27)

### Day 8-9: Educator Dashboard (12 hours) 🟡 CRITICAL FOR B2B

**Feature 1: Pattern Distribution View**
```typescript
// /api/educator/cohort-patterns?cohortId=urban-chamber-pilot

{
  cohortId: "urban-chamber-pilot",
  studentCount: 16,
  avgCompletionRate: 0.81,
  avgTimeSpent: 42, // minutes
  patternDistribution: {
    helping: 34,      // Total helping choices across cohort
    analytical: 28,
    building: 22,
    patience: 18,
    exploring: 24
  },
  topCareers: [
    { career: "Healthcare & Service", count: 6 },
    { career: "Technology & Research", count: 4 },
    { career: "Engineering & Making", count: 3 }
  ],
  students: [
    {
      id: "student_001",
      email: "student1@example.com",
      completedArcs: ["maya", "devon"],
      dominantPattern: "helping",
      dominantCareer: "Healthcare & Service",
      timeSpent: 45,
      lastActive: "2025-02-15T14:23:00Z"
    }
    // ... 15 more students
  ]
}
```

**Feature 2: CSV Export**
```typescript
// Download button → generates CSV
// Columns: Student ID, Email, Completed Arcs, Helping, Analytical, Building, Patience, Exploring, Dominant Career, Time Spent (min)
```

**Feature 3: Simple Admin UI**
```typescript
// /admin/cohorts/urban-chamber-pilot
// - Table of students with completion status
// - Pattern distribution bar chart (simple)
// - Career cluster pie chart
// - Export CSV button
// - Filter by completion status
```

**Implementation:**
- `app/api/educator/cohort-patterns/route.ts` (100 lines)
- `app/admin/cohorts/[cohortId]/page.tsx` (200 lines)
- `lib/educator-analytics.ts` (150 lines)
- Simple charts using Recharts (already in dependencies)

**Deliverable:** Anthony can see student engagement, export pattern data

---

### Day 10-12: Beta Testing Recruitment (8 hours)

**Goal:** Find 2-3 Birmingham high school students for beta test

**Outreach Channels:**
1. **Birmingham subreddit** (r/Birmingham)
   - Post: "Beta testers wanted - Career exploration game for Birmingham students"
   - Offer: $25 Amazon gift card per tester
   - Target: 16-18 year olds

2. **Birmingham high school teachers** (if you have connections)
   - Ask for 2-3 student volunteers
   - Frame as "help test a Birmingham career tool"

3. **Urban Chamber network** (ask Anthony for beta testers before pilot)
   - "Can you recommend 2-3 students from previous cohorts?"
   - Soft intro before full pilot

**Requirements:**
- Age 16-18
- Birmingham resident
- Has smartphone (iOS or Android)
- Available Dec 21-27 for testing

**Compensation:** $25 Amazon gift card per completed test

**Deliverable:** 2-3 confirmed beta testers by Dec 20

---

### Day 13-16: Beta Testing Execution (Dec 21-24)

**Protocol:**
1. Send access links to 2-3 testers
2. Ask them to:
   - Complete at least 1 character arc (30-45 min)
   - Test on their phone (primary device)
   - Take notes on any confusion/bugs
   - Fill out exit survey

**Exit Survey Questions:**
1. Did the game work on your phone? (Yes/No + describe issues)
2. Did session boundaries feel natural? (1-5 scale)
3. Did career insights resonate? (1-5 scale)
4. What career areas did you discover interest in?
5. Would you recommend this to friends? (Yes/No)
6. What was confusing or broken?
7. What was your favorite character/moment?

**Monitoring:**
- Check daily for bugs/crashes
- Respond to tester questions within 4 hours
- Fix critical bugs immediately

**Deliverable:**
- 2-3 completed beta tests
- Bug fixes implemented
- User feedback documented

---

### Day 17-18: Mobile UX Testing (4 hours)

**Devices to Test:**
- iPhone 13/14 (iOS 17+)
- Samsung Galaxy S22/S23 (Android 13+)
- Older device (iPhone 11 or Galaxy S10) - verify performance

**Test Checklist:**
- [ ] Session boundaries display correctly
- [ ] Career insights readable on small screens
- [ ] Intersection scenes flow well
- [ ] Touch targets minimum 44px (accessibility)
- [ ] No horizontal scrolling
- [ ] Journey Summary fits on screen
- [ ] Pattern badges visible
- [ ] Birmingham opportunities list readable

**Tools:**
- Chrome DevTools mobile emulator (basic check)
- Real device testing (primary validation)
- BrowserStack (if available) for multi-device coverage

**Deliverable:**
- Mobile UX validated on 3+ devices
- Any layout issues fixed

---

### Week 2 Deliverable
- ✅ Educator dashboard built (pattern export, cohort view)
- ✅ 2-3 beta testers recruited
- ✅ Beta tests completed, feedback gathered
- ✅ Mobile UX validated on real devices
- ✅ Bug fixes implemented

---

## Week 3: Final Polish + Anthony Outreach (Dec 28-Jan 3)

### Day 19-20: Content Polish (8 hours)

**Review all expanded arcs:**
- Marcus (30 nodes) - final proofread
- Kai (30 nodes) - final proofread
- Check for typos, voice consistency
- Verify trust progression makes sense
- Ensure session boundaries feel natural

**Intersection scene polish:**
- Maya + Devon - verify biomedical theme clear
- Tess + Rohan - verify guardian theme clear
- Alex + Jordan - verify impostor theme clear

**Career insights polish:**
- Review all 5 pattern → career mappings
- Verify Birmingham org names accurate
- Check confidence percentages reasonable

**Deliverable:** All content polished, zero typos

---

### Day 21: Lighthouse Audit + Performance (4 hours)

**Run Lighthouse on production build:**
```bash
npm run build
npx lighthouse https://lux-story.vercel.app --view
```

**Target Scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

**Common fixes:**
- Image optimization (if needed)
- Bundle size reduction (if needed)
- Accessibility improvements (contrast, labels)

**Deliverable:** Lighthouse scores at target

---

### Day 22: Anthony Outreach Email (2 hours)

**Email 1: Initial Pitch** (Send: Jan 2, 2025)

**Subject:** Lux Story Pilot - Birmingham Urban Chamber Partnership

---

Hey Anthony,

Quick follow-up from our conversation about career exploration tools.

**Lux Story is ready for pilot testing in February 2025.**

I've built a narrative game where Birmingham students explore career paths through conversations with professionals—think Pokemon meets career counseling. It's character-driven, mobile-first, and students play in 15-minute sessions.

**The ask:** I'd like to run a pilot with your 16 graduating high school students in February.

**What you get:**
- Free access for all 16 students (2-3 weeks)
- Admin dashboard showing engagement, pattern distribution, career clusters
- CSV export with student data (patterns, career matches, time spent)
- Pilot results report (completion rates, career insights, student feedback)
- First look at what works for workforce development

**What I need:**
- $5,000 pilot fee (covers my time + validates market demand)
- Student email addresses (for access links)
- Your feedback on what makes this useful for educators

**What makes this different:**
- **Birmingham-specific:** Every career path maps to real Birmingham employers (UAB, Regions Bank, Innovation Depot, Southern Company, etc.)
- **Pattern-based:** No quizzes. Students discover careers through conversation choices.
- **Evidence-based:** Dashboard shows what students actually chose, not what they say they'd choose.

**Timeline:**
- January 15-20: Finalize pilot structure, send access links
- February 1-14: Students play (2 weeks, self-paced)
- February 15-21: Mid-pilot check-in
- February 28: Exit surveys
- March 7: Deliver pilot results report

**Why February?**
Students are thinking about next steps (college, career, gap year). Natural timing for career exploration. Low-pressure environment after college apps.

I can send a detailed pilot proposal, or we can hop on a call this week to discuss.

Best,
[Your Name]

P.S. I beta tested this with 3 Birmingham high school students in December. All completed at least one character arc, and 2/3 said it helped them explore career paths. Happy to share beta feedback.

---

**Follow-Up Email** (If no response in 5 days)

**Subject:** Re: Lux Story Pilot

---

Anthony,

Wanted to make sure this didn't get buried.

**TL;DR:**
- Pilot: 16 students play Lux Story for 2 weeks in February
- Cost: $5,000
- Deliverable: Data on career paths your students are drawn to (with Birmingham-specific recommendations)

If this isn't the right timing, no worries. I can also run a smaller pilot (8 students for $2,500) if that's easier to budget.

Let me know.

Best,
[Your Name]

---

**Deliverable:** Email sent to Anthony, follow-up scheduled

---

### Day 23: Pilot Prep Checklist (2 hours)

**Create pilot runbook:**
- [ ] Student onboarding email template
- [ ] Access link generation process
- [ ] Mid-pilot check-in email
- [ ] Exit survey questions
- [ ] Data export process
- [ ] Results report template

**Prepare materials:**
- [ ] 2-minute demo video (Loom recording)
- [ ] Educator guide PDF (how to use dashboard)
- [ ] Student FAQ document
- [ ] Technical support contact info

**Deliverable:** All pilot materials ready to go

---

### Week 3 Deliverable
- ✅ Content polished, zero typos
- ✅ Lighthouse scores at target (90+)
- ✅ Anthony outreach email sent
- ✅ Pilot materials prepared
- ✅ Ready to ship on confirmation

---

## Success Criteria

### Technical Metrics
- [ ] 406+ total nodes (Marcus + Kai expansions)
- [ ] 33 session boundaries marked
- [ ] 8/11 characters at 30+ nodes (73%)
- [ ] 3 intersection scenes complete
- [ ] Educator dashboard functional
- [ ] CSV export working
- [ ] Build time <10s
- [ ] Zero TypeScript errors
- [ ] Mobile UX validated on 3+ devices

### Quality Metrics
- [ ] Beta tested with 2-3 students
- [ ] User feedback incorporated
- [ ] All content proofread
- [ ] Birmingham orgs verified
- [ ] Lighthouse scores 90+

### Business Metrics
- [ ] Anthony contacted
- [ ] Pilot proposal sent
- [ ] Pricing confirmed ($5K)
- [ ] Timeline agreed (Feb 1-28)
- [ ] Access to 16 students secured

---

## Risk Mitigation

### Risk 1: Can't find beta testers in time
**Mitigation:** Offer $50 instead of $25. Post on multiple Birmingham channels. Ask friends/family for referrals.

### Risk 2: Beta testers find critical bugs
**Mitigation:** Fix immediately. Delay Anthony outreach by 1 week if needed. Week 3 has buffer.

### Risk 3: Anthony says no or ghosts
**Mitigation:** Have backup B2B prospects ready (other Urban Chambers, workforce orgs). Pivot to Option C if needed.

### Risk 4: Educator dashboard too complex
**Mitigation:** Start with MVP (CSV export only). Dashboard is nice-to-have, not must-have.

### Risk 5: Mobile UX issues unfixable in time
**Mitigation:** Focus on iPhone (most Birmingham students use iOS). Android can be "best effort."

---

## Daily Standup Questions

**Each day, ask:**
1. What did I complete yesterday?
2. What am I working on today?
3. Any blockers?
4. On track for week goal?

**Weekly review:**
- Are we hitting week deliverables?
- Do we need to adjust timeline?
- Any scope creep to cut?

---

## Buffer Time

**Built-in buffer:** 3 days (Dec 26-28)
- Holidays may slow progress
- Beta testing may take longer
- Bug fixes may be needed

**If ahead of schedule:**
- Expand Yaquin arc (11 → 20 nodes)
- Add 4th intersection scene
- Build journey card sharing feature

**If behind schedule:**
- Cut beta testing (go with internal testing)
- Cut Kai expansion (focus Marcus only)
- Ship with 8/11 characters at 30+

---

## Deliverables Checklist

### Week 1 (Dec 14-20)
- [ ] Session boundaries marked in 10 arcs (2 hrs)
- [ ] Session boundaries marked in 3 intersection scenes (1 hr)
- [ ] Marcus expanded to 30 nodes (6 hrs)
- [ ] Kai expanded to 30 nodes (12 hrs)
- [ ] Build passing, tests green

### Week 2 (Dec 21-27)
- [ ] Educator dashboard built (12 hrs)
- [ ] CSV export functional (2 hrs)
- [ ] 2-3 beta testers recruited (8 hrs)
- [ ] Beta tests completed (4 days)
- [ ] Mobile UX validated (4 hrs)
- [ ] Bug fixes implemented

### Week 3 (Dec 28-Jan 3)
- [ ] Content polish complete (8 hrs)
- [ ] Lighthouse audit passing (4 hrs)
- [ ] Anthony email sent (2 hrs)
- [ ] Pilot materials prepared (2 hrs)
- [ ] Ready to ship

---

## Next Immediate Action

**RIGHT NOW:**
Start with Day 1-2: Mark session boundaries in all character arcs (2 hours)

**Then:**
Day 3-5: Expand Marcus arc (6 hours)

**This weekend:**
Day 5-7: Expand Kai arc (12 hours)

---

**Sprint Start: NOW**
**Target Ship: January 3, 2025**
**Confidence: HIGH - Conservative timeline with buffer**
