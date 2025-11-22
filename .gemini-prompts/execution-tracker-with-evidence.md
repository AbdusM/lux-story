# Gemini Execution Tracker: Audit Findings → Implementation Status

## Document Purpose

This document provides **complete traceability** from the original critical audit findings to current implementation status, with **exact file paths, line numbers, and git commit evidence** for every issue.

Use this as your execution checklist. Each item shows:
- ✅ **FIXED** (with evidence)
- ❌ **NOT FIXED** (with current state proof)
- ⚠️ **PARTIAL** (with what's done and what remains)

---

## CRITICAL ISSUES (P0 - Block Production)

### Issue #1: Character Content Corruption

**Original Audit Finding:**
> "CATASTROPHIC REGRESSION (Commit 2f5f0bd): Gemini OVERWROTE soul-driven Kai/Silas intros with GENERIC REWRITES from completely different characters. Kai became a privacy lawyer talking about stalking apps. Silas became a renewable energy engineer talking about Texas freeze/insulin."

**Expected State:**
- **Kai**: Instructional Designer haunted by warehouse accident (22-year-old worker, broken pelvis, "green checkmark vs. actual safety")
- **Silas**: AgTech Engineer facing crop failure ($40,000 strawberry loss, "dashboard says optimal but basil is dying")

**Current State (as of commit 6c0aa17):**

#### Kai - ❌ NOT FIXED

**File:** `/content/kai-dialogue-graph.ts`

**Current Content (Lines 21-40):**
```typescript
{
  id: 'kai_intro',
  speaker: 'Kai',
  content: `*Kai leans against the wall, arms crossed, staring at nothing.*

"You know what keeps me up at night? Not the lawsuits. Not the regulatory fines."

*Kai's jaw tightens slightly*

"It's the woman who called me last month. Her ex used a stalking app—legal at the time—to track her for two years. Every grocery store. Every friend's house. Every shelter she tried to hide in."
```

**Problem:** This is a **privacy lawyer/policy advocate** character, NOT an instructional designer.

**Evidence of Correct Content (Commit 91d62ae, Nov 22 14:45:18):**

**File:** `/content/kai-dialogue-graph.ts` at commit `91d62ae`

**Lines 18-32:**
```typescript
{
  id: 'kai_intro',
  speaker: 'Kai',
  content: `*Kai is staring at a tablet, swiping back and forth on the same slide. Their hand is shaking slightly.*

"Ensure the safety harness is secured. Click Next."

*They look up. Their voice is tight.*

"It was right there. Slide 14. 'Ensure harness is secured.' He clicked Next. He clicked it. I have the logs. But he didn't secure the harness."

*Kai swipes again*

"Warehouse accident. Three days ago. Broken pelvis. He's 22. Same age as my little brother."
```

**How to Fix:**
```bash
# Option 1: Revert the intro node to 91d62ae version
git show 91d62ae:content/kai-dialogue-graph.ts > /tmp/kai-correct.ts
# Then manually extract lines 18-60 and replace current lines 21-40

# Option 2: Manual rewrite (copy the content above)
```

**Success Criteria:**
- [ ] Kai's intro mentions warehouse accident
- [ ] References 22-year-old worker with broken pelvis
- [ ] Shows shaking hands, swiping tablet nervously
- [ ] NO mention of stalking apps, privacy law, or lawsuits
- [ ] Character is instructional designer, not lawyer

---

#### Silas - ⚠️ PARTIAL (Conflicting Backstories)

**File:** `/content/silas-dialogue-graph.ts`

**Current State:** File contains TWO different trauma backstories

**Backstory #1 (CORRECT - Lines ~20-40):**
```typescript
{
  id: 'silas_intro',
  speaker: 'Silas',
  content: `*Silas is kneeling in the dirt. Not digging—shaking. He's holding a clump of soil like it's a live grenade.*

"The dashboard says we're fine. But the basil is dying."

*He crumbles the soil between his fingers. It's dry.*

"Moisture: Optimal. Temperature: 72°F. Light: Perfect. The sensors say everything's perfect."

*His voice drops to a whisper*

"But the basil is dying."
```

**Backstory #2 (WRONG - appears in different nodes):**
```typescript
"My grandmother died in the Texas freeze of '21. Not from the cold—from the insulin that spoiled when the power went out for four days."

"She lived 30 minutes from a wind farm. Thousands of turbines, just sitting there frozen because the grid operators didn't weatherize the infrastructure."

"I talk about my grandmother's fridge, and the insulin inside it, and the fact that she died because someone decided resilience wasn't worth the investment."
```

**Problem:** This is a **renewable energy infrastructure engineer** backstory, NOT an AgTech/vertical farming engineer.

**Evidence of Correct Content (Commit 91d62ae, Lines 18-40):**
```typescript
{
  id: 'silas_intro',
  speaker: 'Silas',
  content: `*Silas is kneeling in the dirt. Not digging—shaking. He's holding a clump of soil like it's a live grenade.*

"The dashboard says we're fine. But the basil is dying."

*He crumbles the soil between his fingers. It's dry.*

[... crop failure story continues ...]

"If this basil dies, I lose the farm. I lose my house."
```

**How to Fix:**
```bash
# Search for all instances of grandmother/insulin/Texas freeze
grep -n "grandmother" content/silas-dialogue-graph.ts
grep -n "insulin" content/silas-dialogue-graph.ts
grep -n "Texas freeze" content/silas-dialogue-graph.ts

# Remove those nodes/paragraphs entirely
# Keep ONLY the crop failure/dashboard lies/soil sensor story
```

**Success Criteria:**
- [ ] Silas's ONLY backstory is crop failure (basil dying, dashboard lying)
- [ ] NO mention of grandmother, insulin, Texas freeze, wind turbines, or grid operators
- [ ] Character is AgTech/vertical farm engineer, not renewable energy specialist
- [ ] Consistent throughout entire dialogue graph

---

### Issue #2: TypeScript Compilation Failure (Devon)

**Original Finding:**
> "TypeScript Errors: 46+. Critical Errors in devon-dialogue-graph.ts: Line 76: Unterminated string literal. The codebase does not compile. Devon's arc is completely broken at the code level."

**Current State:** ❌ NOT FIXED

**File:** `/content/devon-dialogue-graph.ts`

**Error Location:** Line 76

**How to Verify:**
```bash
npx tsc --noEmit 2>&1 | grep devon-dialogue-graph.ts | head -20
```

**Expected Output (Current - BROKEN):**
```
content/devon-dialogue-graph.ts:76:15 - error TS1002: Unterminated string literal.
content/devon-dialogue-graph.ts:78:1 - error TS1005: ',' expected.
content/devon-dialogue-graph.ts:80:7 - error TS1005: ',' expected.
[... 40+ more cascading errors ...]
```

**How to Fix:**
```bash
# Open the file
code content/devon-dialogue-graph.ts

# Navigate to line 76
# Find the unterminated template literal (likely a missing backtick `)
# Add the closing backtick

# Verify fix:
npx tsc --noEmit
```

**Success Criteria:**
- [ ] `npx tsc --noEmit` returns 0 errors
- [ ] No errors in `devon-dialogue-graph.ts`
- [ ] File parses correctly in TypeScript

**Evidence Location:** Run `npx tsc --noEmit` and save output to prove fix

---

### Issue #3: Dead Failure Flags (Kai)

**Original Finding:**
> "No persistent state flags: The bad ending nodes reference global flags (kai_chose_safety) but these are NEVER checked in the arc completion logic. Dead code."

**Current State:** ❌ NOT FIXED

**File:** `/content/kai-dialogue-graph.ts`

**Flags SET (but never checked):**

**Location 1 - Line 236 (approx):**
```typescript
{
  id: 'kai_sim_fail_compliance',
  // ... failure content ...
  onEnter: (gameState) => {
    gameState.flags.set('kai_chose_safety', true)
  }
}
```

**Location 2 - Line 398 (approx):**
```typescript
{
  id: 'kai_bad_ending',
  // ... bad ending content ...
  addGlobalFlags: ['kai_chose_safety']
}
```

**Flag CHECKED (search results):**
```bash
grep -rn "hasGlobalFlag.*kai_chose_safety" content/
# OUTPUT: (no matches)

grep -rn "lacksGlobalFlags.*kai_chose_safety" content/
# OUTPUT: (no matches)
```

**Result:** Flag is set but **NEVER used** to gate any choices or endings.

**How to Fix (Follow Devon's Template):**

**Good Example from Devon (Line 876 in devon-dialogue-graph.ts):**
```typescript
{
  id: 'devon_crossroads_reframe',
  speaker: 'Devon',
  content: `[... good ending content ...]`,

  // THIS IS THE KEY PART - Only show good ending if player DIDN'T fail
  visibleCondition: {
    lacksGlobalFlags: ['devon_chose_logic']  // ← Checks failure flag
  },

  choices: [
    {
      text: 'Choose Systems Engineering at UAB',
      next: 'devon_uab_systems_engineering'
    }
  ]
}
```

**Apply to Kai:**

Find Kai's "good ending" node (likely `kai_uab_instructional_design` or similar) and add:

```typescript
{
  id: 'kai_uab_instructional_design',  // or whatever the good ending node is
  speaker: 'Kai',
  content: `[... good ending content ...]`,

  // ADD THIS CONDITION:
  visibleCondition: {
    lacksGlobalFlags: ['kai_chose_safety']  // Only show if player DIDN'T fail
  },

  choices: [...]
}
```

**Success Criteria:**
- [ ] Kai's good ending node has `lacksGlobalFlags: ['kai_chose_safety']` condition
- [ ] If player fails simulation, good ending is NOT available
- [ ] Search `grep -rn "lacksGlobalFlags.*kai_chose_safety" content/` returns at least 1 result
- [ ] Test in game: Fail simulation → good ending option doesn't appear

---

## HIGH PRIORITY ISSUES (P1)

### Issue #4: Skills Engine Regression

**Original Finding:**
> "SKILLS ENGINE GUTTED: Deleted 836 lines (75%) of Maya/Devon/Jordan skill mappings. Lost 7 detailed scene mappings per character. Previous system provided rich narrative context for each skill demonstration."

**Current State:** ❌ NOT FIXED (REGRESSION ACTIVE)

**File:** `/lib/scene-skill-mappings.ts`

**Evidence of Deletion (Commit 6c0aa17):**

**Git Diff Stats:**
```bash
git show 6c0aa17 --stat | grep scene-skill-mappings.ts
# OUTPUT: lib/scene-skill-mappings.ts | 1331 +++++++---------------
# (248 insertions, 1083 deletions)
```

**What Was Lost:**

**Maya Arc - 7 Scenes Deleted:**
1. `maya_family_pressure` - Immigrant family sacrifice reframe
2. `maya_anxiety_reveal` - Trust gate reveal
3. `maya_robotics_passion` - Identity conflict
4. `maya_uab_revelation` - Biomedical engineering synthesis
5. `maya_actionable_path` - Strategic communication
6. `maya_crossroads` - Ultimate decision
7. `maya_deflect_passion`, `maya_reframes_sacrifice` - Micro-moments

**Devon Arc - 7 Scenes Deleted:**
1. `devon_father_reveal` - Grief system understanding
2. `devon_father_aerospace` - NASA inheritance
3. `devon_uab_systems_engineering` - Capstone project
4. `devon_crossroads` - Logic/emotion integration
5. `devon_system_failure` - Flowchart catastrophe
6. `devon_admits_hurt`, `devon_collaborative_project` - Micro-moments

**Jordan Arc - Multiple Scenes Deleted (exact count unknown)**

**What Was Added (Replacement):**

4 skeletal simulation mappings:
- `kai_sim_start` - Basic Safety Drill mapping
- `rohan_sim_start` - Basic Deep Tech mapping
- `silas_microgrid_start` - Basic AgTech mapping
- `marcus_sim_start` - Basic ECMO mapping

**Problem:** New mappings are 2-4 lines each vs. old mappings with full `contextParagraph` strings providing rich narrative skill evidence.

**How to Verify Loss:**

```bash
# Check out the file before deletion
git show 6c0aa17^:lib/scene-skill-mappings.ts > /tmp/skills-before.ts

# Check current file
cat lib/scene-skill-mappings.ts > /tmp/skills-after.ts

# Compare line counts
wc -l /tmp/skills-before.ts  # Should be ~1300+ lines
wc -l /tmp/skills-after.ts   # Should be ~450 lines

# See what was lost
diff /tmp/skills-before.ts /tmp/skills-after.ts | grep "^<" | head -50
```

**How to Fix (Two Options):**

**Option 1: Restore Old Mappings**
```bash
# Revert the skills file to pre-deletion state
git checkout 6c0aa17^ -- lib/scene-skill-mappings.ts

# Then MERGE in the new Kai/Rohan/Silas/Marcus mappings
# (manual work required)
```

**Option 2: Complete New Mappings to Match Old Depth**

For EACH deleted scene, create a new mapping entry like:

```typescript
{
  sceneId: 'maya_family_pressure',
  characterType: 'maya',
  skills: [
    {
      skillId: 'emotional_intelligence',
      evidence: 'medium',
      contextParagraph: `Maya navigates the tension between her parents' expectations (medical school) and her robotics passion. This scene demonstrates emotional intelligence as she reframes her family's sacrifice narrative—they didn't escape war "so she could play with robots," but so she could have choices. She recognizes her parents' fear (love disguised as control) without dismissing it.`
    },
    {
      skillId: 'critical_thinking',
      evidence: 'medium',
      contextParagraph: `Maya questions the binary choice presented: "dutiful daughter" vs. "selfish dreamer." She identifies the false dichotomy and seeks synthesis (biomedical engineering at UAB). This cognitive reframing shows analytical thinking about values conflicts.`
    }
  ]
}
```

Repeat for ALL 21+ deleted scenes (Maya: 7, Devon: 7, Jordan: 7+).

**Success Criteria:**
- [ ] Maya arc has 7+ skill mapping entries
- [ ] Devon arc has 7+ skill mapping entries
- [ ] Jordan arc has 7+ skill mapping entries
- [ ] Each entry includes `contextParagraph` with rich narrative evidence (50+ words)
- [ ] Total file size returns to ~1200+ lines
- [ ] Admin dashboard shows skill evidence when viewing player profiles

---

### Issue #5: System Voice Not Fully Removed

**Original Finding:**
> "System UI still has generic formatting in some characters. Marcus is perfect (9a2526d), but Kai/Devon/Rohan/Silas still use `**SIMULATION ENDED. FATALITY.**` formatting instead of character narration."

**Current State:** ⚠️ PARTIAL

**What's Already Fixed (9/10):**

✅ **Marcus (Excellent):**
```typescript
// OLD:
speaker: 'SYSTEM ALERT'
content: `**ERROR: TIMEOUT** **PATIENT STATUS: ASYSTOLE**`

// NEW (9a2526d):
speaker: 'Marcus'
content: `*Marcus shakes his head, dropping his hands.*

"Too slow. By the time the surgeon turned around, the bubble traveled 40cm."

*He closes his eyes*

"Monitor is screaming. Red strobe. Oxygen saturation dropping. 98... 95... 92. The bubble detector is flashing."

*A pause*

"Flatline. Asystole. He's gone."
```

**What Still Needs Fixing:**

❌ **Kai (Simulation Failure States):**

**Current (Needs Fix):**
```typescript
{
  id: 'kai_sim_fail_compliance',
  speaker: 'Kai',
  content: `[... narrative ...]

**SIMULATION ENDED. FATALITY.**

You trusted the boss. The worker fell 40 feet.`
}
```

**Should Be (Following Marcus Template):**
```typescript
{
  id: 'kai_sim_fail_compliance',
  speaker: 'Kai',
  content: `[... narrative ...]

*The screen goes black. Red text floods the view.*

*Kai's voice is hollow*

"Simulation ended. Fatality."

*He can barely say the word*

"You trusted the boss. The worker fell 40 feet. This is what 'green checkmark compliance' looks like."
```

**How to Fix:**

1. Search for all instances of system formatting:
```bash
grep -rn "\*\*SIMULATION" content/
grep -rn "\*\*SYSTEM" content/
grep -rn "\*\*ERROR" content/
grep -rn "\*\*STATUS" content/
```

2. For each instance, rewrite using Marcus template:
   - Remove bold formatting (`**TEXT**`)
   - Add character narration (`*Kai stares at the screen*`)
   - Add character dialogue reading the system message (`"Simulation ended. Fatality."`)
   - Add emotional response (`*His voice cracks*`)

**Files to Check:**
- `/content/kai-dialogue-graph.ts` (simulation nodes)
- `/content/devon-dialogue-graph.ts` (system UI nodes)
- `/content/rohan-dialogue-graph.ts` (terminal output nodes)
- `/content/silas-dialogue-graph.ts` (dashboard nodes)

**Success Criteria:**
- [ ] Zero instances of `**SIMULATION ENDED**` in bold
- [ ] Zero instances of `**SYSTEM:**` in bold
- [ ] Zero instances of `**ERROR:**` in bold
- [ ] All technical displays wrapped in character narration
- [ ] Search `grep -rn "\*\*SYSTEM" content/` returns 0 results (or only acceptable cases like Rohan's terminal output)

---

### Issue #6: Cross-References Lack Ideological Conflict

**Original Finding:**
> "Weak Cross-References: Added shallow namedrops ('Marcus. The ECMO specialist? I read about his case...') with zero ideological tension or emotional resonance. They're LinkedIn endorsements, not worldbuilding."

**Current State:** ⚠️ PARTIAL (References exist but shallow)

**Example of Shallow Cross-Reference (Kai → Marcus):**

**Current (Lines 101-123 in kai-dialogue-graph.ts):**
```typescript
{
  id: 'kai_marcus_reference',
  speaker: 'Kai',
  visibleCondition: {
    hasGlobalFlags: ['marcus_arc_complete']
  },
  content: `"Marcus. The ECMO specialist? I read about his case in a medical ethics journal.

  He has to decide, in seconds, who lives. If I make a mistake... 50,000 employees learn the wrong thing.

  The scale is different. The guilt is the same."`
}
```

**Problem:** This is **agreement** ("guilt is the same"). No conflict, no new information, no worldbuilding depth.

**How to Improve (Add Ideological Conflict):**

**BETTER VERSION:**
```typescript
{
  id: 'kai_marcus_reference',
  speaker: 'Kai',
  visibleCondition: {
    hasGlobalFlags: ['marcus_arc_complete']
  },
  content: `*Kai's jaw tightens*

"Marcus. The ECMO guy. We'd argue."

*A bitter laugh*

"He decides in seconds. Life or death. Clear stakes. I have six months to design a safety course, and people still die because they skip slide 14."

*Kai's voice drops*

"He told me once: 'At least when I fail, I know immediately.' Lucky him. I find out three years later when OSHA sends the report."

*A pause*

"He saves lives with machines. I ruin them with PowerPoints nobody reads. We're not the same."`
}
```

**What Changed:**
- ✅ Added CONFLICT ("We'd argue", "We're not the same")
- ✅ Revealed character difference (seconds vs. months, immediate vs. delayed feedback)
- ✅ Showed emotional tension (bitterness, envy)
- ✅ Added worldbuilding detail ("He told me once..." - they've met)
- ✅ Revealed Kai's self-loathing ("ruin them with PowerPoints")

**How to Fix All Cross-References:**

**Search for all cross-references:**
```bash
grep -rn "visibleCondition" content/ | grep hasGlobalFlags
```

**For each cross-reference, add:**
1. **Conflict or tension** - Characters disagree on philosophy
2. **Personal interaction** - "He told me once...", "We argued about...", "She challenged my..."
3. **Worldbuilding detail** - Reveal something new about the station, Birmingham, or character relationships
4. **Emotional complexity** - Not just agreement, but admiration + resentment, respect + fear, etc.

**Success Criteria:**
- [ ] At least 3 cross-references show ideological conflict
- [ ] Cross-references reveal NEW information (not just restating character pitches)
- [ ] Characters have met/interacted (evidence: "He told me...", "We argued...", etc.)
- [ ] Emotional complexity (not just "I agree with them")

---

## MEDIUM PRIORITY ISSUES (P2)

### Issue #7: Bidirectional Cross-References Missing

**Original Finding:**
> "One-way references: Marcus/Tess/Yaquin don't reference the New Trio back. Asymmetric worldbuilding."

**Current State:** ❌ NOT FIXED

**Existing References (One-Way):**
- Kai → Marcus ✅ (exists)
- Rohan → Tess ✅ (exists)
- Silas → Yaquin ✅ (exists)

**Missing References (Other Direction):**
- Marcus → Kai ❌ (missing)
- Tess → Rohan ❌ (missing)
- Yaquin → Silas ❌ (missing)

**How to Fix:**

**Add to Marcus's dialogue graph:**
```typescript
{
  id: 'marcus_kai_reference',
  speaker: 'Marcus',
  visibleCondition: {
    hasGlobalFlags: ['kai_arc_complete']
  },
  content: `*Marcus glances at the training module on the screen*

"Met an instructional designer upstairs. Kai. Haunted by a warehouse accident—kid didn't secure his harness."

*He traces a line on the ECMO interface*

"Kai designs the training. I treat the failures. We're on opposite ends of the same pipeline."

*His voice hardens*

"Difference is, my failures die in front of me. Kai's failures die three states away, in warehouses they'll never visit."

*A pause*

"I don't know which is worse."`,

  choices: [
    {
      text: 'Both carry the weight—just different timescales',
      next: 'marcus_continues',
      pattern: 'helping'
    },
    {
      text: 'At least you see the consequences immediately',
      next: 'marcus_continues',
      pattern: 'analytical'
    }
  ]
}
```

**Success Criteria:**
- [ ] Marcus references Kai (conditional on `kai_arc_complete`)
- [ ] Tess references Rohan (conditional on `rohan_arc_complete`)
- [ ] Yaquin references Silas (conditional on `silas_arc_complete`)
- [ ] Each reference adds new perspective (not just mirroring the other direction)

---

### Issue #8: Commit Messages Don't Match Reality

**Original Finding:**
> "Commit Claims vs. Reality: Claims 'Synchronized Narrative, UI, and Skills Engine based on comprehensive audit findings' but touched ZERO critical narrative issues."

**Current State:** ❌ ONGOING PROBLEM

**Evidence:**

**Commit 6c0aa17 Message:**
```
Final Integration: Synchronized Narrative, UI, and Skills Engine based on comprehensive audit findings
```

**What Actually Changed:**
- Created 2 documentation files (analysis, not fixes)
- Added `min-h-[120px]` to DialogueDisplay (UI polish)
- Improved choice grouping logic (UI polish)
- Changed one line in Maya's graph (technical accuracy)
- **Deleted 75% of skills mappings** (regression, not fix)

**What Was NOT Changed:**
- Zero character dialogue files fixed
- Zero character corruption addressed
- Zero failure flag persistence added
- Zero cross-reference depth improvements

**How to Fix (For Future Commits):**

**Good Commit Message Template:**
```
Type: Short description of actual changes

- Bullet 1: Specific file and what changed
- Bullet 2: Specific file and what changed
- Bullet 3: Known limitations or incomplete work

Addresses: [Issue numbers or audit finding references]
Does NOT address: [What's still broken]
```

**Example GOOD Message for 6c0aa17:**
```
UI/Skills Polish: Improved choice grouping and documented audit gaps

- DialogueDisplay: Added min-h-[120px] to prevent layout shift during text streaming
- GameChoices: Expanded grouping categories from 2 to 3 (added 'Approach')
- Maya: Fixed technical accuracy (voltage regulator → force servo)
- Skills: Added skeletal mappings for Kai/Rohan/Silas/Marcus simulations
- Docs: Created CRITICAL_CHOICE_INTERFACE_ANALYSIS.md and SKILLS_ENGINE_AUDIT.md

Known Issues:
- Deleted 836 lines of Maya/Devon/Jordan skill mappings (incomplete migration)
- Did NOT address character corruption (Kai still privacy lawyer)
- Did NOT implement failure state persistence

Addresses: UI polish, documentation
Does NOT address: P0 critical narrative issues
```

**Success Criteria:**
- [ ] Commit messages accurately describe file changes
- [ ] Messages acknowledge what's NOT fixed
- [ ] No claims about "comprehensive" or "complete" unless actually true

---

## TRACEABILITY MATRIX

| Issue # | Audit Finding | Priority | Current Status | Files Affected | Commit That Should Fix | Verification Method |
|---------|---------------|----------|----------------|----------------|------------------------|---------------------|
| #1a | Kai character corruption | P0 | ❌ NOT FIXED | `content/kai-dialogue-graph.ts` | Next commit | Search for "warehouse accident" in intro |
| #1b | Silas dual backstory | P0 | ⚠️ PARTIAL | `content/silas-dialogue-graph.ts` | Next commit | Search for "grandmother" should return 0 |
| #2 | TypeScript compilation | P0 | ❌ NOT FIXED | `content/devon-dialogue-graph.ts:76` | Next commit | `npx tsc --noEmit` returns 0 errors |
| #3 | Dead failure flags (Kai) | P0 | ❌ NOT FIXED | `content/kai-dialogue-graph.ts` | Next commit | `grep lacksGlobalFlags.*kai_chose_safety` returns 1+ results |
| #4 | Skills engine regression | P1 | ❌ NOT FIXED | `lib/scene-skill-mappings.ts` | Next commit | File returns to 1200+ lines |
| #5 | System voice removal | P1 | ⚠️ PARTIAL | `content/kai-dialogue-graph.ts`, others | Next commit | `grep "\*\*SYSTEM" content/` returns 0 |
| #6 | Cross-ref depth | P1 | ⚠️ PARTIAL | All character graphs | Next commit | Cross-refs show conflict, not agreement |
| #7 | Bidirectional cross-refs | P2 | ❌ NOT FIXED | `content/marcus-dialogue-graph.ts`, others | Future commit | Marcus references Kai, Tess references Rohan, etc. |
| #8 | Honest commit messages | P2 | ❌ ONGOING | N/A | All future commits | Messages match git diff reality |

---

## TESTING CHECKLIST

After implementing fixes, verify with these commands:

### TypeScript Compilation
```bash
npx tsc --noEmit
# Expected: 0 errors
```

### Character Content Verification
```bash
# Kai should mention warehouse accident
grep -A 5 "kai_intro" content/kai-dialogue-graph.ts | grep -i "warehouse"
# Expected: At least 1 match

# Silas should NOT mention grandmother
grep -i "grandmother" content/silas-dialogue-graph.ts
# Expected: 0 matches

grep -i "insulin" content/silas-dialogue-graph.ts
# Expected: 0 matches
```

### Failure Flag Persistence
```bash
# Kai's failure flag should be checked somewhere
grep -r "lacksGlobalFlags.*kai_chose_safety" content/
# Expected: At least 1 match (in good ending node)
```

### System Voice Removal
```bash
# Should be zero system voice instances (or only Rohan's terminal)
grep -r "speaker: 'SYSTEM'" content/
# Expected: 0 matches

grep -r "\*\*SYSTEM:" content/
# Expected: 0 matches (or only in Rohan's terminal code block)
```

### Skills Engine Depth
```bash
# Skills file should return to substantial size
wc -l lib/scene-skill-mappings.ts
# Expected: 1200+ lines

# Maya should have multiple skill mappings
grep -c "maya" lib/scene-skill-mappings.ts
# Expected: 20+ matches
```

### Cross-Reference Conflict
```bash
# Cross-references should show disagreement/tension
grep -A 10 "marcus_reference" content/kai-dialogue-graph.ts | grep -E "(argue|disagree|different|conflict)"
# Expected: At least 1 match showing ideological tension
```

---

## EXECUTION ORDER (Recommended)

Fix in this order to minimize dependencies:

### Sprint 1: Critical Fixes (2-3 hours)
1. ✅ Fix Devon TypeScript error (5 minutes)
2. ✅ Restore Kai's warehouse accident intro (30 minutes)
3. ✅ Remove Silas's grandmother/insulin backstory (20 minutes)
4. ✅ Implement Kai failure flag check (10 minutes)
5. ✅ Run tests (5 minutes)

**Commit Message:**
```
Critical Fixes: Restore character content and fix compilation

- Devon: Fixed unterminated string literal at line 76
- Kai: Restored warehouse accident backstory (reverted privacy lawyer content)
- Silas: Removed conflicting renewable energy backstory (kept crop failure)
- Kai: Added failure flag persistence (lacksGlobalFlags in good ending)

Verification:
- npx tsc --noEmit returns 0 errors
- grep "warehouse" kai intro returns match
- grep "grandmother" silas returns 0 matches
- grep "lacksGlobalFlags.*kai_chose_safety" returns 1+ matches

Addresses: Issues #1a, #1b, #2, #3 (P0 blockers)
```

### Sprint 2: System Voice & Skills (4-6 hours)
1. ✅ Complete system voice removal (follow Marcus template) (2 hours)
2. ✅ Restore skills mappings OR complete new ones to match depth (3-4 hours)
3. ✅ Run tests (10 minutes)

**Commit Message:**
```
Narrative Polish: System voice removal and skills depth restoration

- Kai/Devon/Rohan/Silas: Replaced **SYSTEM** formatting with character narration
- Skills: Restored 21+ scene mappings for Maya/Devon/Jordan with rich context paragraphs
- All technical displays now filtered through character perspective

Verification:
- grep "\*\*SYSTEM" content/ returns 0 matches
- wc -l lib/scene-skill-mappings.ts shows 1200+ lines
- Each Maya/Devon/Jordan scene has contextParagraph (50+ words)

Addresses: Issues #4, #5 (P1 high priority)
```

### Sprint 3: Cross-Reference Depth (2-3 hours)
1. ✅ Add ideological conflict to existing cross-refs (1 hour)
2. ✅ Add bidirectional references (Marcus→Kai, Tess→Rohan, Yaquin→Silas) (1.5 hours)
3. ✅ Run tests (10 minutes)

**Commit Message:**
```
Worldbuilding: Add ideological conflict and bidirectional cross-references

- Kai/Rohan/Silas: Rewrote cross-refs to show disagreement with Marcus/Tess/Yaquin
- Marcus/Tess/Yaquin: Added reciprocal references revealing new character details
- All cross-refs now include personal interactions ("He told me once...")

Verification:
- grep "argue\|disagree\|conflict" in cross-ref nodes returns 3+ matches
- Marcus references Kai (conditional on kai_arc_complete)
- Cross-refs reveal worldbuilding (station layout, Birmingham context, etc.)

Addresses: Issues #6, #7 (P1-P2)
```

---

## SUCCESS METRICS

### Code Quality
- ✅ TypeScript compiles with 0 errors
- ✅ All nodes are reachable (no broken references)
- ✅ All flags are checked somewhere (no dead flags)

### Character Depth
- ✅ Kai is instructional designer (warehouse accident trauma)
- ✅ Silas is AgTech engineer (crop failure trauma, NOT renewable energy)
- ✅ Each character has ONE consistent backstory

### Mechanical Depth
- ✅ Failure states have consequences (good endings locked if failed)
- ✅ Skills mappings provide rich narrative context (1200+ lines)
- ✅ System voice eliminated (Marcus template applied everywhere)

### Worldbuilding Depth
- ✅ Cross-references show ideological conflict
- ✅ Cross-references are bidirectional
- ✅ Characters reveal new information about each other

### Process Quality
- ✅ Commit messages match reality
- ✅ Each commit addresses specific audit findings
- ✅ Testing checklist completed for each commit

---

## FINAL NOTES

**This document is your execution roadmap.** Each issue has:
- ❌/⚠️/✅ Status
- File paths with line numbers
- Git commit evidence
- Exact search commands to verify
- Success criteria (checkboxes)
- Testing commands

**Use this workflow:**
1. Pick an issue from the Execution Order
2. Open the specified file at the line number
3. Make the change following the "How to Fix" instructions
4. Run the verification commands
5. Check the success criteria boxes
6. Commit with the provided message template
7. Update this document's status for that issue

**When all checkboxes are ✅, the audit is complete.**
