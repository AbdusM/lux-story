# Tess Phase 2 Implementation Plan

## Context
**Phase 1 End State:** Tess made her decision (either went all-in on the school or chose pilot program approach). She's now actively building her wilderness education vision.

**Phase 2 Scenario:** First Student Crisis + Leadership Test

---

## Narrative Arc

### Setup (Node 1-3)
Tess is 6 weeks into her pilot wilderness program. She's leading 8 students on a 3-day Appalachian Trail section hike. The player finds her reviewing incident reports late at night.

### Rising Action (Node 4-8)
A crisis has emerged:
1. One student (DeShawn, 16, first time camping) had a panic attack on Day 2
2. Two other students want to quit and go home
3. Parents are calling, threatening to pull their kids
4. The school board is questioning the "liability" of the program
5. Tess must decide how to respond while maintaining program integrity

Student context:
- **DeShawn**: Birmingham inner-city kid, never been in woods, genuine fear
- **Riley**: Suburban kid who thought it would be "fun," now wants creature comforts
- **Jamie**: Quiet student who's thriving but parents are risk-averse

### Climax (Node 9-12)
Player helps Tess navigate:
- How to support DeShawn (push through vs. compassionate alternative)
- How to respond to quitters (adapt program vs. hold the line)
- How to communicate with parents (defend rigor vs. acknowledge concerns)
- How to present to school board (data-driven vs. values-driven)

Key choices:
- DeShawn's path: Continue with support vs. Alternative assignment vs. Send home with dignity
- Program adaptation: Modify difficulty vs. Two-track approach vs. Stay the course
- Parental communication: Transparency vs. Reassurance vs. Educational framing
- Leadership style: Collaborative vs. Visionary vs. Pragmatic

### Resolution (Node 13-16)
Tess implements her approach. The program continues. She realizes that founding a school isn't about the perfect curriculum—it's about leading through uncertainty.

Skills demonstrated across arc:
- Technical leadership (program modification)
- Crisis communication (parents, board, students)
- Adaptive thinking (when to pivot vs. hold firm)
- Emotional intelligence (DeShawn's fear is real)
- Vision vs. reality (ideal curriculum meets actual students)

---

## Node Structure (17 nodes)

### Phase 2 Entry Point
```
tess_phase2_entry → Triggered after Phase 1 complete
```

### Node Flow
1. `tess_phase2_entry` - 6 weeks later, incident reports
2. `tess_p2_crisis_reveal` - DeShawn's panic attack explained
3. `tess_p2_ripple_effect` - Other students want to quit
4. `tess_p2_parent_calls` - Parents threatening to pull kids
5. `tess_p2_deshawn_conversation` - Talk with DeShawn about fear
6. `tess_p2_deshawn_decision` - How to support him
7. `tess_p2_riley_jamie` - Handle the other two students
8. `tess_p2_program_adaptation` - Modify program or stay course?
9. `tess_p2_parent_strategy` - Communication approach
10. `tess_p2_board_prep` - Prepare for board presentation
11. `tess_p2_board_meeting` - Present to skeptical board
12. `tess_p2_leadership_moment` - Stand for vision or compromise
13. `tess_p2_resolution` - Crisis resolution, program continues
14. `tess_p2_deshawn_outcome` - DeShawn's path forward
15. `tess_p2_reflection` - What founding really means
16. `tess_p2_bridge` - Connection to Samuel or next arc
17. `tess_p2_complete` - Phase 2 completion

### Branching Points
- Node 6: DeShawn's path (continue/alternative/send home)
- Node 8: Program adaptation (modify/two-track/stay course)
- Node 9: Parent communication (transparency/reassurance/educational)
- Node 12: Leadership stance (collaborative/visionary/pragmatic)

---

## Skills Demonstrated

From `lib/learning-objectives-definitions.ts`:

**Primary:**
- `tess_entrepreneurial_spirit` (already exists)
- Technical leadership
- Adaptive thinking
- Crisis communication

**Secondary:**
- Emotional intelligence (DeShawn's fear)
- Strategic thinking (board presentation)
- Risk assessment (safety vs. rigor)
- Vision vs. pragmatism

---

## Trust Dynamics

**High Trust Path (3+):**
- Tess shares doubt and fear about program viability
- Asks player for honest assessment
- Shows vulnerability about "am I doing more harm than good?"

**Medium Trust Path (1-2):**
- Keeps it professional
- Shares situation but not personal doubt
- Focuses on problem-solving

**Low Trust Path (0 or negative):**
- Very brief, transactional
- Doesn't ask for input
- Makes decisions quickly without elaboration

---

## Pattern Recognition

**Analytical Pattern:**
- Data-driven board presentation
- Risk/benefit analysis for program modifications
- Incident metrics and safety protocols

**Helping Pattern:**
- Focus on DeShawn's emotional journey
- Compassionate parent communication
- Student-centered adaptations

**Building Pattern:**
- Design two-track program approach
- Create systematic safety protocols
- Develop scalable model

**Patience Pattern:**
- Take time with DeShawn's process
- Allow students to find their own courage
- Long-term vision over short-term wins

---

## Implementation Notes

**Voice/Tone:**
- Maintain Tess's passionate, slightly chaotic energy
- Show tension between vision and reality
- Balance idealism with leadership pragmatism

**Technical Accuracy:**
- Wilderness education best practices
- Real safety protocols and incident management
- Authentic Birmingham context (urban students → rural immersion)

**Character Continuity:**
- Reference Phase 1 decision (risk vs. pilot)
- Show growth from "visionary" to "leader"
- Connect to career bridge (scaling impact)

---

## Next Steps

1. Implement nodes in `content/tess-dialogue-graph.ts`
2. Add to `tessEntryPoints` export
3. Update `tessDialogueGraph` node count
4. Test integration with Samuel hub
5. Verify trust dynamics work correctly
6. Add unit tests for Phase 2 nodes

---

**Status:** Planning Complete - Ready for Implementation
**Estimated Node Count:** 17 nodes
**Estimated Choice Count:** ~40 choices
**Skills Covered:** 6+ learning objectives
