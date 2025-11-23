# Yaquin Phase 2 Implementation Plan

## Context
**Phase 1 End State:** Yaquin launched his dental assistant training course (either full launch or audience-building approach). He's now a practicing creator educator.

**Phase 2 Scenario:** Course Launch Aftermath + Scaling Challenge

---

## Narrative Arc

### Setup (Node 1-3)
Yaquin is 8 weeks post-launch. His course has 127 students. He's drowning in student questions, technical issues, and refund requests. The player finds him surrounded by laptops, looking exhausted.

### Rising Action (Node 4-8)
Multiple challenges converge:
1. **Quality Crisis**: 15 students say the "self-paced" format doesn't work—they need live instruction
2. **Technical Debt**: The platform he chose has poor video quality, students complaining
3. **Refund Pressure**: 12 refund requests citing "not what I expected"
4. **Scaling Dilemma**: Dental offices reaching out wanting to license the course for bulk training
5. **Imposter Syndrome**: A DDS (Doctor of Dental Surgery) left a comment: "This is amateur hour"

Student context:
- **Cohort Mix**: Half are career-switchers (like Yaquin was), half are dental office employees sent by bosses
- **Engagement Gap**: Self-motivated students thriving, boss-mandated students struggling
- **Time Zone Issues**: International students asking for live sessions

### Climax (Node 9-12)
Player helps Yaquin navigate:
- How to handle quality issues (pivot to cohort-based vs. improve self-paced vs. refund unsatisfied)
- How to respond to the DDS comment (ignore vs. engage vs. use as learning)
- How to manage scale (stick with direct teaching vs. license to offices vs. hire teaching assistants)
- How to restructure course (add live elements vs. better async support vs. two-tier model)

Key choices:
- Course format: Cohort-based (fewer students, higher touch) vs. Self-paced 2.0 (better async) vs. Hybrid model
- Credibility response: Ignore critics vs. Engage professionally vs. Add credentialed advisors
- Scaling strategy: Stay boutique vs. License B2B vs. Build teaching team
- Student support: Office hours vs. Community forums vs. 1-on-1 coaching add-on

### Resolution (Node 13-16)
Yaquin implements changes. Some students stay, some leave. He realizes that running a course business isn't just about teaching—it's about operations, customer service, and strategic execution.

Skills demonstrated across arc:
- Strategic execution (course restructuring)
- Operational thinking (managing 127 students)
- Customer communication (refunds, complaints)
- Product iteration (v1 → v2)
- Resilience (imposter syndrome + criticism)

---

## Node Structure (17 nodes)

### Phase 2 Entry Point
```
yaquin_phase2_entry → Triggered after Phase 1 complete
```

### Node Flow
1. `yaquin_phase2_entry` - 8 weeks later, drowning in support tickets
2. `yaquin_p2_quality_crisis` - 15 students need live instruction
3. `yaquin_p2_refund_pressure` - 12 refund requests piling up
4. `yaquin_p2_dds_comment` - The "amateur hour" critique
5. `yaquin_p2_scaling_offer` - Dental offices want to license course
6. `yaquin_p2_overwhelm_moment` - Yaquin questions if he can do this
7. `yaquin_p2_format_decision` - How to restructure the course
8. `yaquin_p2_credibility_response` - How to handle the DDS comment
9. `yaquin_p2_refund_policy` - How to handle dissatisfied students
10. `yaquin_p2_scaling_choice` - Boutique vs. license vs. team
11. `yaquin_p2_implementation` - Execute the chosen strategy
12. `yaquin_p2_student_reactions` - Some stay, some leave
13. `yaquin_p2_dds_outcome` - Resolution of credibility question
14. `yaquin_p2_operational_wisdom` - Teaching vs. running a business
15. `yaquin_p2_reflection` - What it means to be an educator-entrepreneur
16. `yaquin_p2_bridge` - Connection to Samuel or next arc
17. `yaquin_p2_complete` - Phase 2 completion

### Branching Points
- Node 7: Course format (cohort/self-paced 2.0/hybrid)
- Node 8: Credibility response (ignore/engage/add advisors)
- Node 9: Refund approach (generous/firm/case-by-case)
- Node 10: Scaling strategy (boutique/license/team)

---

## Skills Demonstrated

From `lib/learning-objectives-definitions.ts`:

**Primary:**
- `yaquin_edtech_entrepreneurship` (already exists)
- Strategic execution
- Operational thinking
- Customer communication

**Secondary:**
- Product iteration (v1 → v2)
- Resilience (handling criticism)
- Strategic thinking (scaling decisions)
- Instructional design (format improvements)

---

## Trust Dynamics

**High Trust Path (3+):**
- Yaquin admits feeling like a fraud
- Shares fear that the DDS might be right
- Asks player "Am I actually qualified to do this?"

**Medium Trust Path (1-2):**
- Professional discussion of challenges
- Focuses on tactical solutions
- Shares situation but not self-doubt

**Low Trust Path (0 or negative):**
- Brief, transactional
- Doesn't elaborate on struggles
- Makes decisions quickly

---

## Pattern Recognition

**Analytical Pattern:**
- Data-driven course analysis (completion rates, engagement metrics)
- A/B test different formats
- ROI analysis for scaling options

**Helping Pattern:**
- Focus on struggling students
- Generous refund policy
- Add personal coaching hours

**Building Pattern:**
- Design hybrid course model
- Build student community infrastructure
- Create systematic support processes

**Patience Pattern:**
- Take time to improve course quality
- Gradual scaling over rapid expansion
- Long-term brand building

---

## Implementation Notes

**Voice/Tone:**
- Maintain Yaquin's practical, hands-on personality
- Show tension between "dental assistant" and "course creator"
- Balance excitement with overwhelm

**Technical Accuracy:**
- Realistic online course challenges (refunds, support load, platform issues)
- Creator economy dynamics (cohort-based vs. self-paced economics)
- Authentic Birmingham creator context

**Character Continuity:**
- Reference Phase 1 launch decision
- Show growth from "teacher" to "educator-entrepreneur"
- Connect to career bridge (sustainable creator business)

---

## Next Steps

1. Implement nodes in `content/yaquin-dialogue-graph.ts`
2. Add to `yaquinEntryPoints` export
3. Update `yaquinDialogueGraph` node count
4. Test integration with Samuel hub
5. Verify trust dynamics work correctly
6. Add unit tests for Phase 2 nodes

---

**Status:** Planning Complete - Ready for Implementation
**Estimated Node Count:** 17 nodes
**Estimated Choice Count:** ~40 choices
**Skills Covered:** 6+ learning objectives
