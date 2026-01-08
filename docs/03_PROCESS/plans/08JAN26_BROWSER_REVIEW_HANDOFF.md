# Browser Review Handoff - January 8, 2026

**Created:** January 8, 2026
**Status:** READY FOR QA
**Context:** Post-Option C implementation (20/20 character coverage)

> [!WARNING]
> **Known Limitations (Jan 8 Run):**
> - **Pattern Voices:** 3/5 variations implemented per character (2 missing).
> - **Interrupt Windows:** Not yet implemented (files missing).
> - **Achievements:** Postponed to future update.
> - **Verification Focus:** Core dialogue flow, trust mechanics, and character loading.

---

## Executive Summary

This document provides a comprehensive browser testing checklist with specific game progression paths to ensure full deep coverage of all 20 characters, backend systems, and frontend UI components.

**Scope:**
- 20 characters (16 original + 4 LinkedIn 2026)
- Trust/pattern progression mechanics
- Simulations, loyalty experiences, vulnerability arcs
- UI components and mobile responsiveness

**Environments:**
- Production: https://lux-story.vercel.app
- Local: http://localhost:3000

---

## Pre-Test Setup

```
[ ] Clear localStorage: localStorage.clear()
[ ] Open DevTools Console (F12) for error monitoring
[ ] Enable Network tab for API call verification
[ ] Test on desktop viewport (1280x800+)
[ ] Test on mobile viewport (375x667)
```

---

## Core Test Paths (4 Complete Journeys)

### PATH A: Analytical Explorer (Tech/AI Cluster)

**Characters:** Maya -> Rohan -> Nadia
**Pattern Focus:** Analytical dominance
**Duration:** ~45 minutes

| Step | Action | Expected Result | Node ID |
|------|--------|-----------------|---------|
| 1 | Start game | Samuel intro | samuel_intro |
| 2 | Choose "Study the architecture" | Analytical +1 | samuel_* |
| 3 | Navigate to Maya | Maya intro loads | maya_intro |
| 4 | Choose analytical responses 3x | Trust -> 2-3 | maya_intro_* |
| 5 | Complete Maya simulation | terminal_coding UI | maya_simulation_1 |
| 6 | Return to Samuel, go to Rohan | Rohan intro | rohan_intro |
| 7 | Progress to Trust 6 | Vulnerability unlocks | rohan_vulnerability_arc |
| 8 | Navigate to Nadia | Nadia intro | nadia_intro |
| 9 | Reach Trust 8 with Maya | Loyalty available | the_demo |

**Verification Points:**
- [ ] Journal shows analytical as dominant pattern
- [ ] Constellation shows visited characters highlighted
- [ ] Trust persists after browser refresh

---

### PATH B: Helping Guide (Healthcare/Nonprofit Cluster)

**Characters:** Grace -> Asha -> Isaiah
**Pattern Focus:** Helping dominance
**Duration:** ~45 minutes

| Step | Action | Expected Result | Node ID |
|------|--------|-----------------|---------|
| 1 | Fresh start (clear localStorage) | Clean state | - |
| 2 | Choose "Help others" responses | Helping +1 | samuel_* |
| 3 | Navigate to Grace | Healthcare theme | grace_intro |
| 4 | Complete Grace to Trust 6 | Vulnerability arc | grace_vulnerability_arc |
| 5 | Navigate to Asha | Conflict resolution | asha_intro |
| 6 | Complete Asha simulation | dialogue_challenge | asha_simulation_1 |
| 7 | Navigate to Isaiah | Nonprofit theme | isaiah_intro |
| 8 | Progress to Trust 8 | Loyalty experience | the_site_visit |

**Verification Points:**
- [ ] Helping pattern reflects in NPC dialogue (patternReflection)
- [ ] Different atmosphere colors per character
- [ ] Trust isolated per character (Grace trust != Asha trust)

---

### PATH C: Building Creator (Engineering/Finance Cluster)

**Characters:** Devon -> Silas -> Quinn
**Pattern Focus:** Building dominance
**Duration:** ~45 minutes

| Step | Action | Expected Result | Node ID |
|------|--------|-----------------|---------|
| 1 | Fresh start | Clean state | - |
| 2 | Choose "Build solutions" responses | Building +1 | samuel_* |
| 3 | Navigate to Devon | Systems theme | devon_intro |
| 4 | Complete Devon simulation | dashboard_triage | devon_simulation_1 |
| 5 | Progress to Trust 6 | Vulnerability | devon_vulnerability_arc |
| 6 | Navigate to Silas | Manufacturing | silas_intro |
| 7 | Navigate to Quinn | Finance theme | quinn_intro |
| 8 | Complete Quinn simulation | visual_canvas | quinn_simulation_* |

**Verification Points:**
- [ ] Building pattern unlocks building-gated choices
- [ ] Simulation types render correctly per character
- [ ] Knowledge flags accumulate

---

### PATH D: Patient Listener (Hub/Knowledge Cluster)

**Characters:** Samuel (deep) -> Marcus -> Elena
**Pattern Focus:** Patience dominance
**Duration:** ~60 minutes

| Step | Action | Expected Result | Node ID |
|------|--------|-----------------|---------|
| 1 | Fresh start | Clean state | - |
| 2 | Explore ALL Samuel branches | Patience +multiple | samuel_* (205 nodes) |
| 3 | Linger on reflective nodes | Extra patience | samuel_reflection_* |
| 4 | Navigate to Marcus | Healthcare crisis | marcus_intro |
| 5 | Progress Marcus to Trust 6 | 11 vuln arcs | marcus_vulnerability_arc |
| 6 | Navigate to Elena | Archives theme | elena_intro |
| 7 | Complete Elena simulation | research_interface | elena_simulation_1 |
| 8 | Verify full constellation | 4+ chars visited | - |

**Verification Points:**
- [ ] Samuel hub has most dialogue depth (205 nodes)
- [ ] Marcus has most vulnerability arcs (11)
- [ ] Elena research simulation renders correctly

---

## System-Specific Test Checklists

### Trust System (All 20 Characters)

For EACH character (maya, devon, jordan, samuel, marcus, tess, rohan, kai, grace, elena, alex, yaquin, silas, asha, lira, zara, quinn, dante, nadia, isaiah):

```
[ ] Trust starts at 0 on first visit
[ ] Trust +1 on positive choice
[ ] Trust -1 on negative choice (where applicable)
[ ] Trust 3 = acquaintance threshold
[ ] Trust 5 = trusted threshold
[ ] Trust 6 = vulnerability arc unlocks
[ ] Trust 8 = loyalty experience unlocks
[ ] Trust 10 = maximum (bonded)
[ ] Trust persists after refresh
[ ] Trust isolated per character
```

---

### Pattern System (5 Patterns)

```
[ ] Analytical choices -> analytical +1
[ ] Patience choices -> patience +1
[ ] Exploring choices -> exploring +1
[ ] Helping choices -> helping +1
[ ] Building choices -> building +1
[ ] Pattern level 3 -> minor unlocks visible
[ ] Pattern level 6 -> moderate unlocks visible
[ ] Pattern level 9 -> major unlocks visible
[ ] Patterns persist after refresh
[ ] Journal displays pattern distribution correctly
[ ] patternReflection changes NPC dialogue at min levels
```

---

### Simulation Types (10 Types)

```
[ ] terminal_coding (Maya, Rohan) - Code editor UI
[ ] visual_canvas (Quinn, Zara) - Visual workspace
[ ] dashboard_triage (Devon, Alex) - Dashboard interface
[ ] dialogue_challenge (Asha, Jordan) - Conversation flow
[ ] research_interface (Elena, Yaquin) - Search/archive UI
[ ] resource_allocation (Tess, Grace) - Resource management
[ ] ethical_dilemma (Marcus, Nadia) - Decision tree
[ ] creative_workshop (Lira, Dante) - Creative tools
[ ] safety_protocol (Kai, Silas) - Protocol checklist
[ ] community_mapping (Isaiah, Samuel) - Network visualization
```

---

### Loyalty Experiences (20 Characters)

Each requires Trust >= 8 AND pattern >= 5:

```
[ ] the_demo (Maya) - analytical 5
[ ] the_outage (Devon) - building 5
[ ] the_quiet_hour (Samuel) - patience 5
[ ] the_vigil (Marcus) - helping 5
[ ] the_honest_course (Tess) - patience 5
[ ] the_inspection (Kai) - analytical 5
[ ] the_launch (Rohan) - building 5
[ ] the_pattern (Jordan) - exploring 5
[ ] the_feral_lab (Yaquin) - exploring 5
[ ] the_mural (Grace) - helping 5
[ ] the_memory_song (Lira) - patience 5
[ ] the_audit (Alex) - analytical 5
[ ] the_breach (Elena) - patience 5
[ ] the_confrontation (Silas) - building 5
[ ] the_first_class (Asha) - helping 5
[ ] the_crossroads (Zara) - exploring 5
[ ] the_portfolio (Quinn) - analytical 5
[ ] the_real_pitch (Dante) - building 5
[ ] the_whiteboard (Nadia) - analytical 5
[ ] the_site_visit (Isaiah) - helping 5
```

---

### Vulnerability Arcs (20 Characters)

Each requires Trust >= 6:

```
[ ] maya_vulnerability_arc -> maya_vulnerability_revealed flag
[ ] devon_vulnerability_arc -> devon_vulnerability_revealed flag
[ ] jordan_vulnerability_arc -> jordan_vulnerability_revealed flag
[ ] samuel_vulnerability_arc -> samuel_vulnerability_revealed flag
[ ] marcus_vulnerability_arc -> marcus_vulnerability_revealed flag (11 arcs)
[ ] tess_vulnerability_arc -> tess_vulnerability_revealed flag
[ ] rohan_vulnerability_arc -> rohan_vulnerability_revealed flag
[ ] kai_vulnerability_arc -> kai_vulnerability_revealed flag
[ ] grace_vulnerability_arc -> grace_vulnerability_revealed flag
[ ] elena_vulnerability_arc -> elena_vulnerability_revealed flag
[ ] alex_vulnerability_arc -> alex_vulnerability_revealed flag
[ ] yaquin_vulnerability_arc -> yaquin_vulnerability_revealed flag
[ ] silas_vulnerability_arc -> silas_vulnerability_revealed flag
[ ] asha_vulnerability_arc -> asha_vulnerability_revealed flag (5 arcs)
[ ] lira_vulnerability_arc -> lira_vulnerability_revealed flag
[ ] zara_vulnerability_arc -> zara_vulnerability_revealed flag
[ ] quinn_vulnerability_arc -> quinn_vulnerability_revealed flag
[ ] dante_vulnerability_arc -> dante_vulnerability_revealed flag
[ ] nadia_vulnerability_arc -> nadia_vulnerability_revealed flag
[ ] isaiah_vulnerability_arc -> isaiah_vulnerability_revealed flag
```

---

## UI Component Test Matrix

### Core Components

| Component | Location | Test | Expected |
|-----------|----------|------|----------|
| ChatPacedDialogue | Main view | Text renders | Typing animation |
| CharacterAvatar | Side panel | 32x32 pixels | Correct animal |
| Journal | Nav button | Opens panel | Stats visible |
| Constellation | Nav button | Opens panel | Web renders |
| ChoiceContainer | Bottom | 140px height | Scrolls overflow |
| RichTextRenderer | Dialogue | Bold/italic | Effects work |

### Glass Morphic Effects

| Element | Test | Expected |
|---------|------|----------|
| glass-panel | Background | 85%+ opacity |
| Marquee shimmer | Nav highlight | Localized only |
| Pattern glow | Choice hover | Pattern color |
| Atmosphere | Per character | Color shifts |

### Mobile Responsiveness

| Test | Viewport | Expected |
|------|----------|----------|
| Touch targets | 375px | 44px minimum |
| Safe area | iPhone X+ | Bottom padding |
| Avatars | Mobile | 48px (not 64px) |
| Choices | Mobile | Full width |

---

## Error Monitoring Checklist

```
[ ] Console: No errors during normal flow
[ ] Console: No React hydration mismatches
[ ] Network: No failed requests (4xx/5xx)
[ ] Network: No missing assets (404)
[ ] Storage: No quota errors
[ ] Storage: Graceful handling of cleared data
```

---

## Data Persistence Tests

```
[ ] Close browser, reopen -> state preserved
[ ] Clear localStorage -> fresh start works
[ ] Multiple characters -> each trust isolated
[ ] Pattern totals -> accumulate correctly
[ ] Knowledge flags -> persist across sessions
```

---

## Performance Benchmarks

```
[ ] Initial load < 3 seconds
[ ] Dialogue transition < 200ms
[ ] No jank during scroll
[ ] Memory stable over 30+ minutes
[ ] No layout shifts during gameplay
```

---

## Critical Files for Debugging

| System | File | Purpose |
|--------|------|---------|
| Trust | lib/character-state.ts | GameState, trust tracking |
| Patterns | lib/patterns.ts | Pattern definitions |
| Dialogue | content/*-dialogue-graph.ts | All dialogue nodes |
| Experiences | lib/loyalty-experience.ts | 20 loyalty experiences |
| Adapter | lib/loyalty-adapter.ts | Bridges old/new systems |
| Derivatives | lib/character-derivatives.ts | CHARACTER_INFLUENCES |
| Assessment | lib/assessment-derivatives.ts | SKILL_CHALLENGES |
| Arc | lib/arc-learning-objectives.ts | Learning objectives |

---

## Verification After Testing

```bash
# Verify no regressions
npm run type-check
npm test
npm run build

# Verify node counts (should see 1145+ total)
for f in content/*-dialogue-graph.ts; do
  echo "$(basename "$f" -dialogue-graph.ts): $(grep -c 'nodeId:' "$f")"
done
```

---

## Success Criteria

| Metric | Target |
|--------|--------|
| All 4 test paths complete | 100% |
| Trust system works all 20 chars | 100% |
| Pattern system works all 5 types | 100% |
| Simulations render all 10 types | 100% |
| Loyalty experiences trigger all 20 | 100% |
| Vulnerability arcs unlock all 20 | 100% |
| Console errors | 0 |
| Network failures | 0 |
| Mobile viewport issues | 0 |

---

## Character Roster Reference

| Category | Characters |
|----------|------------|
| Original 3 | Maya, Devon, Jordan |
| Core 9 | Samuel, Marcus, Tess, Rohan, Kai, Grace, Elena, Alex, Yaquin |
| Extended 4 | Silas, Asha, Lira, Zara |
| LinkedIn 2026 | Quinn, Dante, Nadia, Isaiah |

**Total:** 20 characters

---

**Last Updated:** January 8, 2026
