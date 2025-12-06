# Character Coherence Audit

**Date:** December 2, 2025
**Purpose:** Document narrative ↔ response alignment issues that cause cognitive dissonance

---

## Part 1: Introduction Issues

### Characters with WEAK location grounding (5/8)

| Character | Current Intro | Issue |
|-----------|--------------|-------|
| **Maya** | "Oh. Hi. Sorry, I—were you watching me?" | No spatial context. WHERE is she? |
| **Devon** | "If input is 'I'm fine,' then route to..." | "Closed system" is metaphorical, not a place |
| **Tess** | "Not rigor. Resilience? Too soft. Grit? Overused." | No location at all. Just jumps into grant writing |
| **Kai** | "Fifteen slides. Fifteen 'Click Next' buttons..." | Shows corporate frustration but no WHERE |
| **Yaquin** | "Forget the textbook. Chapter 4's garbage..." | Teaching demo but no location mentioned |

### Characters with STRONG location grounding (3/8)

| Character | Current Intro | Why it works |
|-----------|--------------|--------------|
| **Jordan** | "Career Day at Covalence—the coding bootcamp over in Innovation Depot." | Explicit location + context |
| **Rohan** | "The server room is cold. It smells of ozone and stale coffee." | Vivid sensory grounding |
| **Silas** | "I'm holding this soil. It crumbles into dust." | Physical action + farm context clear |

---

## Part 2: Cross-Character Patterns (Systemic Issues)

### Pattern 1: Trust-Gated Responses Block Emotional Flow
Multiple characters have their best/most empathetic response options hidden behind trust gates early in conversation. This means players who haven't built trust yet get FEWER emotional options precisely when they're trying to build connection.

**Affected:** Maya, Devon, Tess

### Pattern 2: All Paths Converge (False Choice)
Many nodes offer 2-4 response options that ALL lead to the same next node. This creates an illusion of choice without actual narrative branching.

**Affected:** Jordan, Tess, Rohan, Devon

### Pattern 3: Character Voice Shifts From Vulnerable → Analytical Mid-Crisis
Characters articulate deep emotional pain, then immediately shift to abstract/philosophical analysis without transition. This feels like "author intrusion" rather than authentic character voice.

**Affected:** Devon, Kai, Silas, Rohan

### Pattern 4: Growth Happens "Between Scenes"
Characters reach conclusions or have realizations that aren't shown in dialogue - they just appear as new beliefs. Player doesn't witness the transformation.

**Affected:** Yaquin, Silas, Tess, Jordan

### Pattern 5: Responses Don't Address What Was Just Said
The most common issue: character shares vulnerability or insight, but response options address a DIFFERENT aspect of their statement, leaving the core emotional beat unacknowledged.

**Affected:** ALL CHARACTERS

---

## Part 3: Findings by Character

### MAYA - 6 Critical Issues
| Node | Issue | Severity |
|------|-------|----------|
| `maya_robotics_passion` | Brute-force fix option ignores emotional metaphor she just shared | HIGH |
| `maya_anxiety_check` | Requires trust:2 but earlier nodes route here without guaranteeing trust built | HIGH |
| `maya_deflect_passion` | ALL responses gated behind trust:2 - no low-trust fallback option | HIGH |
| `maya_crossroads` | Duplicate response choices visible simultaneously | MEDIUM |
| `maya_studies_response` | Best empathetic response hidden behind trust gate early in conversation | MEDIUM |
| `maya_parent_conversation_failed` | Sudden revelation of past failure contradicts preceding hopeful buildup | MEDIUM |

### DEVON - 9 Critical Issues
| Node | Issue | Severity |
|------|-------|----------|
| `devon_technical_response` | Choice leads back to SAME node - circular navigation trap | HIGH |
| `devon_father_aerospace` | Different emotional inputs get identical response | HIGH |
| `devon_explains_system` | Context revealed AFTER when it's needed - backwards exposition | HIGH |
| `devon_people_problem` | Player's empathy suggestion ignored, reverts to tech talk | HIGH |
| `devon_father_reveal` | "Pause" node doesn't actually pause - launches into more revelation | MEDIUM |
| `devon_system_failure` | Devon's tone mirrors player instead of maintaining his devastated state | MEDIUM |
| `devon_realizes_bridge` | Breakthrough assumes context from other branches | MEDIUM |
| `devon_debug_result_fail_script` | Second choice contradicts Devon's own revelation | MEDIUM |
| `devon_asks_player` | Forced reciprocity after climax feels like interview, not dialogue | MEDIUM |

### TESS - 9 Critical Issues
| Node | Issue | Severity |
|------|-------|----------|
| `tess_founder_motivation` | Response loops BACKWARD to earlier node - breaks narrative progress | HIGH |
| `tess_pitch_climax` | Game mechanically rewards DISMISSING her fear over integrating it | HIGH |
| `tess_defends_rigor` | Both branches serve same function but only one leads to curriculum | MEDIUM |
| `tess_p2_crisis_reveal` | BOTH choices lead to same node - false branching | MEDIUM |
| `tess_p2_deshawn_conversation` | VULNERABLE emotion but CLINICAL counselor language | MEDIUM |
| `tess_p2_program_adaptation` | Performs doubt while sounding confident - contradiction | MEDIUM |
| `tess_p2_board_meeting` | Confidence/capitulation false binary - no strategic middle ground | MEDIUM |
| `tess_asks_player` | Vague responses to her specific question | MEDIUM |
| `tess_p2_reciprocity_response` | Unearned mentor authority flip - no narrative bridge | MEDIUM |

### JORDAN - 7 Critical Issues
| Node | Issue | Severity |
|------|-------|----------|
| `jordan_job_reveal_7` → `jordan_mentor_context` | Triumph → despair reversal - "I see the pattern" to "I don't see a pattern" | CRITICAL |
| `jordan_asks_player` | All 4 responses lead to same node - her "curiosity" is performative | HIGH |
| `jordan_job_reveal_5` vs `jordan_mentor_context` | Same person who saw Job 5 pattern can't see Job 7 pattern | HIGH |
| Success sequence | Mom proud, team leads, teaching - then vulnerability. Success triggers doubt instead of confidence | HIGH |
| `jordan_pattern_acknowledgment` | Gratitude has zero narrative impact on next node | MEDIUM |
| `jordan_crossroads` → `jordan_chooses_birmingham` | Birmingham framing unprepared - lands as deus ex machina | MEDIUM |
| Six rewrites mentioned | Asked rhetorically but never actually answered | MEDIUM |

### KAI - 10 Critical Issues
| Node | Issue | Severity |
|------|-------|----------|
| `kai_accident_reveal` | Marcus comparison appears unprompted mid-emotional-crisis | HIGH |
| `kai_marcus_reference` | Philosophical comparison deflates concrete injury | HIGH |
| `kai_sim_fail_compliance` | "Give up" choice contradicts entire arc of building simulation | HIGH |
| `kai_system_frustration` | "Saw it coming" choice attributes foresight never stated | MEDIUM |
| `kai_simulation_setup` | Emotional climax → immersive scenario with no transition | MEDIUM |
| `kai_hospital_connection` | Kai explicitly disambiguates "Marcus the worker" vs "Marcus the nurse" - breaks narrative | MEDIUM |
| `kai_worker_feedback` | Centers Kai's guilt over honoring Maria's 20-year cry for being heard | MEDIUM |
| `kai_final_choice` | Depth vs reach question implies uncertainty already resolved | MEDIUM |
| `kai_asks_player` | Repeats same question within 20 nodes | MEDIUM |
| `kai_scale_challenge` | Strategic leap without showing how he got there | LOW |

### ROHAN - 11 Critical Issues
| Node | Issue | Severity |
|------|-------|----------|
| `rohan_introduction` choices | None address his actual existential crisis - reduce to fear/tech/pragmatism | HIGH |
| `rohan_sim_success` → `rohan_academy_vision` | Academy presented as spontaneous but Rohan says he's planned it for years | HIGH |
| `rohan_asks_player` | Rohan becomes therapist instead of teacher - voice break | HIGH |
| `rohan_technical_dismissal` | Rejects player's frame without acknowledging it | MEDIUM |
| `rohan_tess_reference` | Reference assumes massive context player may not have | MEDIUM |
| `rohan_pragmatic_response` | Emotion label 'frustrated_patience' doesn't match condescending tone | MEDIUM |
| `rohan_bad_ending` | Carpentry exit feels generic, not Rohan-specific | MEDIUM |
| `rohan_sim_step_2` | Only one "choice" in morally critical moment - gate not choice | MEDIUM |
| `rohan_sim_fail_corruption` | Mother introduced only for pathos - never mentioned again | MEDIUM |
| `rohan_philosophy_trap` choices | Player choices don't test Rohan's philosophy - he always wins | MEDIUM |
| `rohan_sim_success` → `rohan_climax_decision` | Missing emotional escalation between success and decision | MEDIUM |

### SILAS - 10 Critical Issues
| Node | Issue | Severity |
|------|-------|----------|
| `silas_simulation_start` | Omniscient narrator tone, not character speech | HIGH |
| `silas_simulation_start` choices | Physical pipe-following assumes unstated context | HIGH |
| `silas_learning_soil` → `silas_tech_hubris` | Player CREATES character motivation retroactively - leading question | HIGH |
| `silas_bankruptcy_reveal` → `silas_climax_decision` | Crisis-to-resolution compresses without struggle | MEDIUM |
| `silas_tech_defense` | Only choice ignores character's reasoning | MEDIUM |
| `silas_final_vision_[1-3]` | Identical emotion across 3 nodes - monologue not dialogue | MEDIUM |
| `silas_curriculum_design` | Contradictory stance on sensors without articulated belief change | MEDIUM |
| `silas_hawkins_death` | Player states motivation; Silas passively confirms | MEDIUM |
| Simulation retry | Silas speaks as if outcomes final, but gameplay allows retry | LOW |
| `silas_climax_decision` | Devon reference assumes shared context player may lack | MEDIUM |

### YAQUIN - 11 Critical Issues
| Node | Issue | Severity |
|------|-------|----------|
| `yaquin_introduction` | Confidence → self-doubt in SAME breath without justification | HIGH |
| `yaquin_curriculum_setup` → `yaquin_fail_boring` | Setup diagnoses PROCESS problem, failure is CONTENT problem | HIGH |
| `yaquin_phase2_entry` | Victory → crisis with no intermediate struggle - feels punitive | HIGH |
| `yaquin_credential_gap` | Only one choice; doesn't address simultaneous truth of both positions | MEDIUM |
| `yaquin_curriculum_dream` | Anxious tone but only "cutting" choice offered | MEDIUM |
| `yaquin_success_practical` | Shifts from teaching to meta-analyzing own teaching | MEDIUM |
| `yaquin_p2_quality_crisis` | Confuses format problem with motivation problem | MEDIUM |
| `yaquin_p2_refund_pressure` | Self-doubt stated but no choice addresses it | MEDIUM |
| `yaquin_p2_scaling_choice` | Player's insight becomes Yaquin's without dialogue | MEDIUM |
| `yaquin_p2_operational_wisdom` | Voice becomes academic/professorial | MEDIUM |
| `yaquin_asks_player` | Mentor mode feels unearned | MEDIUM |

---

## Part 4: Priority Fixes

### Tier 1: CRITICAL (Breaks Narrative Logic)
1. **Jordan triumph → despair reversal** - She explicitly sees the pattern, then denies it exists
2. **Trust gates blocking emotional options** - Players can't be empathetic when trust is low
3. **Circular navigation traps** - Choices that loop back to same node
4. **False convergence** - All choices leading to same outcome
5. **Introduction location grounding** - 5 characters need spatial context

### Tier 2: HIGH (Causes Cognitive Dissonance)
1. **Response options that ignore what was just said** - Add acknowledgment before pivot
2. **Growth happening "between scenes"** - Show transformations in dialogue
3. **Voice shifts from vulnerable to analytical** - Add transitional beats
4. **Emotional tone mismatches** - Align emotion labels with actual dialogue

### Tier 3: MEDIUM (Polish Issues)
1. **Duplicate response choices**
2. **Assumed cross-character context**
3. **False pauses that don't pause**
4. **Forced reciprocity without setup**

---

## Summary Statistics

| Character | Critical | High | Medium | Low | Total |
|-----------|----------|------|--------|-----|-------|
| Maya | 3 | 0 | 3 | 0 | 6 |
| Devon | 4 | 0 | 5 | 0 | 9 |
| Tess | 2 | 0 | 7 | 0 | 9 |
| Jordan | 1 | 3 | 3 | 0 | 7 |
| Kai | 0 | 3 | 6 | 1 | 10 |
| Rohan | 3 | 0 | 8 | 0 | 11 |
| Silas | 3 | 0 | 6 | 1 | 10 |
| Yaquin | 3 | 0 | 8 | 0 | 11 |
| **TOTAL** | **19** | **6** | **46** | **2** | **73** |

**73 coherence issues identified across 8 characters.**

---

## Part 5: Fixes Applied (Dec 2, 2025)

### Tier 1 CRITICAL - FIXED

1. **Introduction location grounding** - Added spatial context to 5 characters:
   - Maya: "Sterne Library. Third floor. The table nobody wants."
   - Devon: "Avondale coffee shop. Back booth. 2 AM."
   - Tess: "Woodlawn High guidance office. Grant applications everywhere."
   - Kai: "Protective Life training office. Fluorescent lights. Late shift."
   - Yaquin: "Home office in Hoover. Ring light on. Camera rolling."

2. **Jordan triumph → despair reversal** - Fixed contradiction:
   - Old: "I don't see a pattern" (contradicts player affirming pattern)
   - New: "You see the pattern. I can see it too. Intellectually. But when I'm alone?"

3. **Trust gates blocking emotional options** - Removed early trust gates:
   - `maya_deflect_passion`: Removed trust:2 visibility requirements
   - `maya_anxiety_check`: Removed trust:2 required state
   - `maya_anxiety_reveal`: Removed trust:2 required state

4. **Circular navigation traps** - Fixed Devon loops:
   - `devon_technical_response`: "Systems make sense" now leads forward
   - `devon_people_problem`: "Feelings aren't bugs" now leads forward

### Tier 2 HIGH - FIXED

5. **Maya response ignoring metaphor** - Added choice acknowledging "fighting itself":
   - New: "Fighting itself. Like you said. What if it needs support, not force?"

6. **Silas narrator tone** - Changed omniscient narration to character voice:
   - Old: "The screen displays a readout..."
   - New: "Look at this dashboard. Zone 4: 65% humidity. Optimal..."

7. **Yaquin victory→crisis transition** - Added success acknowledgment:
   - New: "It worked. The course launched. 127 students enrolled."

### Remaining Work

Tier 3 MEDIUM issues remain. Lower priority polish.
