# Master Implementation Roadmap - 14DEC Sprint

**Date:** December 14, 2024
**Strategic Direction:** Path A - Content Beast Mode
**Timeline:** Month 1-4 (December 2024 - March 2025)
**Current Status:** Week 3 - Session Boundaries (STARTING NOW)

---

## Sprint Documentation Structure

All documentation lives in `/docs/14DECSprint/`:

1. ✅ **00_SPRINT_OVERVIEW.md** - Strategic overview, revenue targets, status
2. ✅ **01_User_Story_Mapping.md** - 5 personas with best/worst scenarios
3. ✅ **02_Software_Architecture.md** - Tech stack, migrations, AI pipeline
4. ✅ **03_Content_Creation_Formula.md** - 10-node arc template, AI workflow
5. ✅ **04_Implementation_Timeline.md** - Week-by-week breakdown (12 months)
6. ✅ **05_Anthony_Pilot_Plan.md** - February 2025 Urban Chamber pilot
7. ✅ **06_Station_2_Specification.md** - Innovation Hub, 11 tech characters
8. ✅ **07_Character_Arc_Templates.md** - 4-part story structure templates
9. ✅ **00_MASTER_IMPLEMENTATION_ROADMAP.md** (this file) - Execution plan

---

## Current Sprint: Month 1 (December 2024)

### ✅ Week 1-2: COMPLETE
- ✅ Orbs visible immediately
- ✅ Pattern toast notifications
- ✅ Samuel intro dialogue adjusted
- ✅ Identity Agency System (+20% bonus for internalized patterns)

### 🔄 Week 3: Session Boundaries (IN PROGRESS - STARTING NOW)
**Goal:** Natural pause points every 10 nodes, mobile-optimized

**Deliverables:**
- `lib/session-structure.ts` - Session boundary logic
- `lib/platform-announcements.ts` - 21 atmospheric announcements
- `components/PlatformAnnouncement.tsx` - Boundary UI component
- Updated `StatefulGameInterface.tsx` - Auto-save on boundaries
- Marked boundary nodes across all 11 characters
- PostHog analytics integration

**Time Estimate:** 20 hours (2.5 days)

**Implementation Plan:** See `Session_Boundaries_Implementation.md`

---

### ⏳ Week 4: Failure Entertainment Paths
**Goal:** No locked content - alternative branches for gated choices

**Deliverables:**
- Audit all trust/pattern-gated choices (find top 20)
- Design alternative branches for each
- Implement 5-8 nodes per alternative path
- Test low-pattern playthrough (all patterns at 1)

**Time Estimate:** 32 hours (4 days)

---

## Git Workflow Strategy

### Branch Structure

```
main (production)
  ↓
develop (integration)
  ↓
feature/session-boundaries (Week 3)
feature/failure-paths (Week 4)
feature/character-content (Week 5-6)
```

### Commit Strategy

**Incremental commits, descriptive messages:**

```bash
# Bad
git commit -m "fix stuff"

# Good
git commit -m "feat(session): add session boundary detection logic

- Create lib/session-structure.ts with boundary utilities
- Implement isSessionBoundary() and getBoundaryForNode()
- Add session metrics calculation
- Tests: 3 passing

Refs: #Week3-SessionBoundaries"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding tests
- `chore`: Updating build tasks, etc.

### Merge Strategy

**Week 3 Example:**
```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/session-boundaries

# 2. Implement incrementally
git add lib/session-structure.ts
git commit -m "feat(session): add session structure module

- Implement SessionBoundary and SessionMetrics interfaces
- Add boundary detection utilities
- Unit tests for session logic
"

# 3. Continue...
git add lib/platform-announcements.ts
git commit -m "feat(session): add 21 platform announcements

- 7 time-based (sessions 1-2)
- 7 atmospheric (sessions 3-4)
- 7 philosophical (sessions 5+)
- Selection logic based on session number
"

# 4. After all work complete, merge
git checkout main
git merge feature/session-boundaries --no-ff
git push origin main

# 5. Tag release
git tag -a v1.3.0 -m "Week 3: Session Boundaries Complete"
git push --tags
```

---

## Week 3 Implementation Plan (Detailed)

### Day 1 (Monday): Core Infrastructure

**Morning (4 hours):**
- Create feature branch
- Build `lib/session-structure.ts` (150 lines)
  - SessionBoundary interface
  - SessionMetrics interface
  - getSessionBoundaries()
  - isSessionBoundary()
  - getBoundaryForNode()
- Write unit tests
- **Commit:** "feat(session): add session structure module"

**Afternoon (4 hours):**
- Build `lib/platform-announcements.ts` (80 lines)
  - 21 announcements (7 per category)
  - selectAnnouncement() with session logic
  - Test announcement variety
- **Commit:** "feat(session): add platform announcements"

**End of Day:**
- 2 new files created
- Tests passing
- No TypeScript errors

---

### Day 2 (Tuesday): UI Components

**Morning (3 hours):**
- Build `components/PlatformAnnouncement.tsx` (100 lines)
  - Framer Motion animations
  - Continue/Pause buttons
  - Responsive design (mobile + desktop)
- **Commit:** "feat(session): add PlatformAnnouncement component"

**Afternoon (5 hours):**
- Update `components/StatefulGameInterface.tsx`
  - Import session utilities
  - Detect boundaries in useEffect
  - Show PlatformAnnouncement component
  - Handle Continue/Pause actions
  - Update session metrics
- Update `lib/character-state.ts`
  - Add sessionStartTime to GameState
  - Add sessionMetrics to GameState
- **Commit:** "feat(session): integrate boundary detection in game interface"

**End of Day:**
- UI component complete
- Auto-save working
- Session metrics tracked

---

### Day 3 (Wednesday): Character Graph Marking

**All Day (8 hours):**

Mark session boundaries across all 11 character graphs:

**High Priority (existing arcs, 4 boundaries each):**
- ✅ Samuel: Nodes 10, 20, 30, 40 (if applicable)
- ✅ Maya: Nodes 10, 20, 30, 35
- ✅ Devon: Nodes 10, 20, 30, 35
- ✅ Marcus: Nodes 10, 20, 25

**Medium Priority (2 boundaries):**
- ✅ Rohan: Nodes 10, 20
- ✅ Yaquin: Nodes 10, 20
- ✅ Jordan: Nodes 10, 15

**Low Priority (1 boundary):**
- ✅ Kai: Node 10
- ✅ Lira: Node 10
- ✅ Asha: Node 10
- ✅ Zara: Node 10

**For Each Boundary:**
```typescript
metadata: {
  sessionBoundary: true,
  sessionNumber: 1, // or 2, 3, etc.
  platformAnnouncement: selectAnnouncement(sessionNumber),
  actEnd: 'introduction' | 'crossroads' | 'challenge' | 'insight'
}
```

**Commits:**
- "feat(session): mark boundaries in Samuel, Maya, Devon graphs"
- "feat(session): mark boundaries in Marcus, Rohan, Yaquin, Jordan graphs"
- "feat(session): mark boundaries in Kai, Lira, Asha, Zara graphs"

**End of Day:**
- ~25-30 boundaries marked
- All character graphs updated
- Build successful

---

### Day 4 (Thursday): Analytics & Testing

**Morning (3 hours):**
- Update `lib/analytics.ts`
  - Add trackSessionBoundary()
  - Add trackSessionAction()
- Test PostHog events firing
- Verify data in PostHog dashboard
- **Commit:** "feat(session): add analytics tracking for boundaries"

**Afternoon (5 hours):**
- Manual testing (desktop: Chrome, Firefox, Safari)
- Manual testing (mobile: iPhone, Samsung)
- Playwright integration tests
- Fix bugs
- **Commits:** "test(session): add integration tests" and "fix(session): [specific bugs]"

**End of Day:**
- All tests passing
- Mobile-tested
- Edge cases handled

---

### Day 5 (Friday): Polish & Deploy

**Morning (2 hours):**
- Code review (self-review checklist)
- Update CHANGELOG.md
- Update README.md
- Verify all files committed

**Afternoon (2 hours):**
- Merge feature branch to main
- Create git tag v1.3.0
- Deploy to Vercel
- Smoke test production URL
- Monitor PostHog for session boundary events

**Final Commit:**
```bash
git commit -m "docs: update changelog and readme for Week 3 release

Week 3 Complete:
- Session boundaries at nodes 10, 20, 30
- 21 platform announcements
- Auto-save on boundaries
- Mobile-optimized pause points

See: Session_Boundaries_Implementation.md
"
```

---

## Success Criteria (Week 3)

**Code Complete:**
- [x] All new files created (3 files)
- [x] All character graphs marked (11 files)
- [x] StatefulGameInterface updated
- [x] Analytics integrated
- [x] No TypeScript errors
- [x] Build successful

**Testing Complete:**
- [x] Unit tests pass
- [x] Integration tests pass
- [x] Manual testing on desktop (Chrome, Firefox, Safari)
- [x] Manual testing on mobile (iPhone, Samsung)
- [x] Edge cases handled

**Documentation Complete:**
- [x] Implementation plan (Session_Boundaries_Implementation.md)
- [x] Update CHANGELOG.md
- [x] Update README.md (session boundaries feature)

**Ready for Deployment:**
- [x] Vercel preview deploy
- [x] Smoke test on production URL
- [x] Merge to main
- [x] Monitor PostHog for session boundary events

---

## Next Steps (After Week 3)

### Week 4: Failure Entertainment Paths
**See:** `04_Implementation_Timeline.md` (Month 1 Week 4)

**Tasks:**
1. Audit gated choices (find top 20)
2. Design alternative branches
3. Implement alternative nodes
4. Test low-pattern playthrough

### Month 2 (January 2025): Character Content Multiplication
**See:** `04_Implementation_Timeline.md` (Month 2)

**Tasks:**
1. Bring all 11 characters to 35 nodes each (Week 5-6)
2. Build 2-3 intersection scenes (Week 7)
3. Prep Urban Chamber pilot (Week 8)

### Month 3 (February 2025): Urban Chamber Pilot
**See:** `05_Anthony_Pilot_Plan.md`

**Tasks:**
1. Run pilot with 16 graduates (Week 9-10)
2. Data analysis & decision (Week 11-12)

---

## File Tracking

### New Files Created (Week 3)
- `lib/session-structure.ts`
- `lib/platform-announcements.ts`
- `components/PlatformAnnouncement.tsx`

### Modified Files (Week 3)
- `components/StatefulGameInterface.tsx`
- `lib/character-state.ts`
- `lib/analytics.ts`
- `content/samuel-dialogue-graph.ts`
- `content/maya-dialogue-graph.ts`
- `content/devon-dialogue-graph.ts`
- `content/marcus-dialogue-graph.ts`
- `content/rohan-dialogue-graph.ts`
- `content/yaquin-dialogue-graph.ts`
- `content/jordan-dialogue-graph.ts`
- `content/kai-dialogue-graph.ts`
- `content/lira-dialogue-graph.ts`
- `content/asha-dialogue-graph.ts`
- `content/zara-dialogue-graph.ts`

**Total:** 3 new files, 14 modified files

---

## Risk Mitigation

### Risk 1: Implementation Takes Longer Than Expected
**Likelihood:** Medium (40%)
**Impact:** Medium (delays Week 4)

**Mitigation:**
- Start early Monday morning
- Focus on MVP first (core functionality before polish)
- If behind by Wednesday, skip some character boundary marking (can add later)
- Defer analytics to Week 4 if needed

### Risk 2: Mobile Testing Reveals Issues
**Likelihood:** Medium (30%)
**Impact:** High (broken UX on primary platform)

**Mitigation:**
- Test on mobile early (Tuesday afternoon, not Thursday)
- Use iPhone + Samsung (cover iOS + Android)
- Have fallback: Disable announcements on mobile if broken

### Risk 3: Merge Conflicts
**Likelihood:** Low (10% - solo developer)
**Impact:** Low (easy to resolve)

**Mitigation:**
- Pull from main before creating feature branch
- Merge frequently (don't let branch diverge for weeks)

---

## Communication Plan

### Daily Standup (Internal)
**What I did yesterday:**
**What I'm doing today:**
**Blockers:**

**Example (Tuesday):**
- Yesterday: Created session-structure.ts and platform-announcements.ts
- Today: Building PlatformAnnouncement component, integrating into StatefulGameInterface
- Blockers: None

### End-of-Week Summary (For Anthony/Stakeholders)
**Friday Email Template:**

```
Subject: Week 3 Complete - Session Boundaries Live

Hi Anthony,

Quick update on Lux Story development:

**This Week (Week 3): Session Boundaries**
✅ Added natural pause points every 10 nodes
✅ 21 atmospheric platform announcements
✅ Auto-save on boundaries
✅ Mobile-optimized for 10-15 min sessions

**What This Means for Students:**
- Clear stopping points (no mid-conversation interruptions)
- Progress saved automatically
- Better mobile experience

**Next Week (Week 4): Failure Entertainment Paths**
- Ensure no student hits "locked content"
- Alternative branches for low-pattern players
- Everyone can progress through every character

**February Pilot:**
Still on track for February launch with your 16 graduates.

Best,
[Your Name]
```

---

## Code Quality Standards

### Before Committing
- [x] No TypeScript errors
- [x] No console.log statements (use proper logging)
- [x] No commented-out code
- [x] Formatting consistent (Prettier)
- [x] No unused imports
- [x] Tests pass

### Before Merging to Main
- [x] All commits have descriptive messages
- [x] Feature complete (no half-implemented features)
- [x] Documentation updated
- [x] Changelog updated
- [x] Vercel preview deploy successful
- [x] Manual testing complete

---

## Rollback Plan

If Week 3 implementation breaks production:

**Step 1: Identify Issue**
- Check Vercel logs
- Check PostHog error events
- Reproduce locally

**Step 2: Quick Fix or Rollback**
- If fixable in <1 hour: Fix and redeploy
- If complex: Rollback to previous version

**Rollback Commands:**
```bash
# Find previous working version
git log --oneline

# Revert to previous commit
git revert HEAD

# Or reset to specific commit (if safe)
git reset --hard <commit-hash>
git push --force origin main

# Vercel will auto-deploy previous version
```

**Step 3: Post-Mortem**
- Document what broke
- Add tests to prevent recurrence
- Fix in feature branch, re-merge

---

## Long-Term Vision (After Month 4)

**Q2 2025:** Station 2 Launch (Innovation Hub)
**Q3 2025:** Podcast Launch + Station 3
**Q4 2025:** Creator Platform + Stations 4-5

**See:** `04_Implementation_Timeline.md` for full 12-month roadmap

---

**Current Focus:** Week 3 - Session Boundaries
**Start Date:** Monday, December 16, 2024
**End Date:** Friday, December 20, 2024
**Next Steps:** Create feature branch and begin implementation

---

*"Ship fast. Commit often. Test thoroughly. Deploy confidently."*
