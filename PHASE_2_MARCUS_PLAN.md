# Marcus Phase 2 Implementation Plan

## Context
**Phase 1 End State:** Marcus successfully completed ECMO simulation, patient survived, thinking about designing medical equipment

**Phase 2 Scenario:** Equipment Crisis + Mentoring Challenge

---

## Narrative Arc

### Setup (Node 1-3)
Marcus is back on shift, 3 days later. He's been asked to train Jordan, a nervous new ICU specialist, on ECMO basics. As they're walking through the setup, an alert comes through: Critical equipment shortage - 3 ECMO machines available, but 5 patients need them within the next 6 hours.

### Rising Action (Node 4-8)
Marcus must simultaneously:
1. Keep Jordan calm and focused (mentorship)
2. Review the 5 patient cases (triage/prioritization)
3. Communicate with the attending physician
4. Make recommendations on who gets machines

Patient cases (brief):
- Patient A: 45yo, heart failure, transplant candidate, stable for now
- Patient B: 28yo, motorcycle accident, lung damage, deteriorating fast
- Patient C: 67yo, post-surgery complications, high mortality risk
- Patient D: 52yo, COVID complications, improving slightly
- Patient E: 19yo, sudden cardiac event, unknown cause, unstable

### Climax (Node 9-12)
Jordan asks Marcus how to choose. Player helps Marcus think through the decision-making framework while also coaching Jordan on the technical and ethical dimensions.

Key choices:
- Prioritize by survival probability vs. years of life remaining
- Involve ethics committee vs. make call based on medical criteria
- Be transparent with families vs. protect them from harsh reality
- Train Jordan directive-style vs. Socratic method

### Resolution (Node 13-16)
Marcus makes recommendations, machines are allocated. Jordan learns the reality of ICU work. Marcus reflects on the balance between technical expertise and human judgment.

Skill demonstrations across arc:
- Crisis management
- Mentorship/teaching
- Ethical reasoning
- Communication under pressure
- Technical decision-making

---

## Node Structure (17 nodes)

### Phase 2 Entry Point
```
marcus_phase2_entry → Triggered after Phase 1 complete
```

### Node Flow
1. `marcus_p2_entry` - Back on shift, meets Jordan
2. `marcus_p2_jordan_intro` - Jordan is nervous, asks about ECMO
3. `marcus_p2_alert` - Critical equipment shortage alert
4. `marcus_p2_cases_review` - Must review 5 patient cases
5. `marcus_p2_jordan_panic` - Jordan panics, Marcus must decide how to handle
6. `marcus_p2_triage_start` - Begin reviewing cases with player input
7. `marcus_p2_patient_a_discuss` - Discuss Patient A criteria
8. `marcus_p2_patient_b_discuss` - Discuss Patient B (time-critical)
9. `marcus_p2_framework` - Develop decision framework
10. `marcus_p2_jordan_question` - Jordan asks "How do you choose?"
11. `marcus_p2_ethics_choice` - Involve ethics committee or proceed?
12. `marcus_p2_communication` - How to communicate with families?
13. `marcus_p2_allocation` - Final allocation decision
14. `marcus_p2_jordan_reflection` - Jordan processes the weight
15. `marcus_p2_teaching_moment` - Marcus reflects on mentorship
16. `marcus_p2_bridge` - Connection to Samuel or next arc
17. `marcus_p2_complete` - Phase 2 completion

### Branching Points
- Node 5: How Marcus handles Jordan's panic (directive vs. supportive vs. challenge)
- Node 9: Decision framework (medical only vs. holistic vs. probability-based)
- Node 11: Ethics committee involvement (yes/no)
- Node 12: Family communication approach (full transparency vs. gentle framing)

---

## Skills Demonstrated

From `lib/learning-objectives-definitions.ts`:

**Primary:**
- `marcus_crisis_management` (already exists)
- Mentorship (teaching/coaching)
- Ethical reasoning
- Communication under pressure

**Secondary:**
- Leadership
- Critical thinking
- Emotional intelligence
- Adaptability

---

## Trust Dynamics

**High Trust Path (3+):**
- Marcus shares personal stories of difficult decisions
- Asks player for input on framework
- Shows vulnerability about the weight of choices

**Medium Trust Path (1-2):**
- Keeps it professional
- Shares some context but stays clinical
- Focuses on technical criteria

**Low Trust Path (0 or negative):**
- Very brief, procedural
- Doesn't ask for input
- Makes decisions quickly without elaboration

---

## Pattern Recognition

**Analytical Pattern:**
- More data-driven case discussions
- Probability calculations
- Evidence-based frameworks

**Helping Pattern:**
- Focus on patient/family perspectives
- Emotional support for Jordan
- Holistic decision-making

**Building Pattern:**
- Create systematic triage framework
- Document process for future
- Focus on improving system

**Patience Pattern:**
- Take time to coach Jordan through each step
- Allow space for difficult questions
- Reflective rather than reactive

---

## Implementation Notes

**Voice/Tone:**
- Maintain Marcus's clinical precision
- Show weight of responsibility
- Balance technical expertise with humanity

**Technical Accuracy:**
- ECMO allocation criteria are realistic
- Medical terminology consistent with Phase 1
- Ethical frameworks align with healthcare practice

**Character Continuity:**
- Reference Phase 1 air bubble experience
- Show growth from "operator" to "mentor/leader"
- Connect to career bridge (designing systems)

---

## Next Steps

1. Implement nodes in `content/marcus-dialogue-graph.ts`
2. Add to `marcusEntryPoints` export
3. Update `marcusDialogueGraph` node count
4. Test integration with Samuel hub
5. Verify trust dynamics work correctly
6. Add unit tests for Phase 2 nodes

---

**Status:** Planning Complete - Ready for Implementation
**Estimated Node Count:** 17 nodes
**Estimated Choice Count:** ~40 choices
**Skills Covered:** 6+ learning objectives
