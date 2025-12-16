# Dialogue Improvement Checklist
## Phase-by-Phase Implementation Tracker

---

## Pre-Implementation Setup

- [ ] Create feature branch: `git checkout -b dialogue-improvement`
- [ ] Verify build passes: `npm run build`
- [ ] Note baseline word count: `wc -w content/*-dialogue-graph.ts`
- [ ] Open browser to http://localhost:3000 for testing

---

## Phase 1: Samuel Washington (374 → 262 nodes)

### Tutorial Redundancy Cuts (23 nodes)
- [ ] `samuel_explain_skills` - Reduce to "Watch what grows."
- [ ] `samuel_explain_journal` - Single sentence
- [ ] `samuel_explain_thoughts` - Trust discovery
- [ ] `samuel_explain_constellation` - Atmospheric only
- [ ] `samuel_explain_platforms` - Hint, not explain
- [ ] `samuel_explain_helping` - One line
- [ ] `samuel_explain_building` - One line
- [ ] `samuel_explain_exploring` - One line
- [ ] `samuel_explain_connecting` - One line
- [ ] `samuel_explain_progress` - Cut entirely or single word
- [ ] `samuel_explain_choices` - Trust player
- [ ] `samuel_explain_bonds` - Show, don't tell
- [ ] (Continue for remaining explain nodes...)

### Farewell Synthesis Cuts (12 nodes)
- [ ] `samuel_farewell_helping` - "The platforms remember."
- [ ] `samuel_farewell_building` - Action ending
- [ ] `samuel_farewell_exploring` - Single image
- [ ] `samuel_farewell_connecting` - One observation
- [ ] `samuel_farewell_growth` - Cut recap
- [ ] `samuel_farewell_balance` - No summary
- [ ] (Continue for remaining farewell variants...)

### Platform Introduction Simplification (8 nodes)
- [ ] `samuel_platform_helping_intro` - Atmospheric hint
- [ ] `samuel_platform_building_intro` - Atmospheric hint
- [ ] `samuel_platform_exploring_intro` - Atmospheric hint
- [ ] `samuel_platform_connecting_intro` - Atmospheric hint
- [ ] (Continue for remaining platform intros...)

### Silence Markers (5 high-impact moments)
- [ ] After first platform choice - Add `[pause]`
- [ ] After first skill unlock - Add silence
- [ ] After first bond formed - Breathing room
- [ ] Before farewell - Weight the moment
- [ ] After final revelation - Let it land

### Phase 1 Validation
- [ ] `npm run build` passes
- [ ] All `next` references valid (no console errors)
- [ ] Play through Samuel arc start to finish
- [ ] Commit: `git commit -m "refactor(dialogue): samuel - cut tutorial redundancy and farewell synthesis"`

---

## Phase 2: Supporting Characters

### Maya Chen (29 → 23 nodes)
- [ ] `maya_creative_insight` - "It's seeing what isn't there yet."
- [ ] `maya_deep_creativity` - Single metaphor
- [ ] `maya_art_meaning` - Cut explanation
- [ ] `maya_response_positive` - Cut validation prefix
- [ ] `maya_farewell_art` - One image
- [ ] `maya_farewell_growth` - Cut recap
- [ ] Verify all `next` references
- [ ] Test Maya conversation flow

### Devon Martinez (41 → 31 nodes)
- [ ] `devon_explain_building` - "Measure twice. You'll learn why."
- [ ] `devon_skills_list` - Show one skill
- [ ] `devon_practical_value` - Cut enumeration
- [ ] `devon_farewell_growth` - End on action
- [ ] `devon_trade_intro` - Cut catalog
- [ ] (10 more node cuts...)
- [ ] Verify all `next` references
- [ ] Test Devon conversation flow

### Jordan Kim (25 → 21 nodes)
- [ ] `jordan_advocacy_example` - "What keeps you up at night?"
- [ ] `jordan_causes_list` - Single example
- [ ] `jordan_why_advocate` - Cut motivation explanation
- [ ] `jordan_farewell_impact` - One line
- [ ] Verify all `next` references
- [ ] Test Jordan conversation flow

### Marcus Thompson (41 → 33 nodes)
- [ ] `marcus_systems_intro` - "Pull one thread. Watch what moves."
- [ ] `marcus_explain_patterns` - Concrete example only
- [ ] `marcus_analysis_value` - Cut academic tone
- [ ] `marcus_farewell_systems` - Single observation
- [ ] (8 more node edits...)
- [ ] Verify all `next` references
- [ ] Test Marcus conversation flow

### Kai Nakamura (31 → 23 nodes)
- [ ] `kai_team_dynamics` - "What do you bring when no one's asking?"
- [ ] `kai_collaboration_theory` - Story, not theory
- [ ] `kai_roles_explain` - Cut role catalog
- [ ] `kai_farewell_team` - One moment
- [ ] (8 more node edits...)
- [ ] Verify all `next` references
- [ ] Test Kai conversation flow

### Tess Okonkwo (34 → 29 nodes)
- [ ] `tess_resource_intro` - "The library on Fifth. Start there."
- [ ] `tess_resources_list` - One resource story
- [ ] `tess_how_to_find` - Cut steps
- [ ] `tess_farewell_resources` - Numbers then silence
- [ ] (5 more node edits...)
- [ ] Verify all `next` references
- [ ] Test Tess conversation flow

### Yaquin Reyes (30 → 24 nodes)
- [ ] `yaquin_community_value` - "Alone, you carry it. Together, it lifts."
- [ ] `yaquin_benefits_list` - One person's story
- [ ] `yaquin_how_to_connect` - Single invitation
- [ ] `yaquin_farewell_community` - "They remember."
- [ ] (6 more node edits...)
- [ ] Verify all `next` references
- [ ] Test Yaquin conversation flow

### Phase 2 Validation
- [ ] `npm run build` passes
- [ ] All supporting character arcs playable
- [ ] Commit: `git commit -m "refactor(dialogue): supporting characters - apply scrupulous meanness"`

---

## Phase 3: Silence Integration

### Pause Marker System
- [ ] Decide marker format: `[pause]` or `...` or line break
- [ ] Check if CSS/rendering exists for pauses
- [ ] If needed, add pause rendering to DialoguePanel

### High-Impact Silence Points
- [ ] Samuel: After "The station waits."
- [ ] Maya: After art revelation
- [ ] Devon: After skill demonstration
- [ ] Marcus: After pattern reveal
- [ ] Kai: After team moment
- [ ] Tess: After resource unlock
- [ ] Yaquin: After community story
- [ ] Jordan: After advocacy example

### Phase 3 Validation
- [ ] Pauses render correctly
- [ ] Timing feels natural (not jarring)
- [ ] Commit: `git commit -m "feat(dialogue): add strategic silence markers"`

---

## Phase 4: Coherence Audit

### Full Playthrough Test
- [ ] Start new game
- [ ] Complete Samuel introduction
- [ ] Visit all 4 platforms
- [ ] Talk to each supporting character
- [ ] Form at least one bond
- [ ] Unlock at least one skill
- [ ] Reach a farewell state
- [ ] Check Journal reflects progress
- [ ] Check Constellation shows updates
- [ ] Check Thought Cabinet functions

### Edge Cases
- [ ] Rapid platform switching
- [ ] Returning to character after farewell
- [ ] Skip dialogue via [Continue]
- [ ] All choice branches reachable

### Regression Checks
- [ ] Marquee effects still trigger on pivotal moments
- [ ] Character atmosphere colors correct
- [ ] Nav button hover effects work
- [ ] No console errors
- [ ] No 404s or broken images

### Final Validation
- [ ] Word count reduced by ~23%
- [ ] Build passes: `npm run build`
- [ ] Lighthouse performance stable
- [ ] Commit: `git commit -m "test(dialogue): complete coherence audit - all systems verified"`

---

## Post-Implementation

- [ ] Merge to main: `git checkout main && git merge dialogue-improvement`
- [ ] Tag release: `git tag v1.x.0-dialogue-refined`
- [ ] Update RECENT_CHANGES_SUMMARY.md
- [ ] Deploy and verify production

---

## Quick Recovery Commands

```bash
# If build breaks:
git diff content/CHARACTER-dialogue-graph.ts
git checkout content/CHARACTER-dialogue-graph.ts

# If need full revert:
git checkout main
git branch -D dialogue-improvement

# If need to find orphaned references:
grep -r "next: '" content/ | grep -v "next: 'END'" | sort | uniq -c | sort -rn
```

---

## Metrics Tracking

| Phase | Before | After | Reduction |
|-------|--------|-------|-----------|
| Phase 1 (Samuel) | 374 nodes | ___ | ___% |
| Phase 2 (Supporting) | 231 nodes | ___ | ___% |
| Phase 3 (Silence) | N/A | +___ markers | N/A |
| **Total** | ~605 nodes | ___ | ___% |

---

*Check off items as you complete them. Commit after each phase.*
