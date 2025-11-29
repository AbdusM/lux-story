# Scene-Skill Mappings Code Review Checklist

## For Gemini AI Review of `lib/scene-skill-mappings.ts`

---

## 1. STRUCTURAL INTEGRITY CHECKS

### 1.1 TypeScript Compilation
```bash
npx tsc --noEmit lib/scene-skill-mappings.ts
```
**PASS CRITERIA**: Zero errors. All skill names must be valid `keyof FutureSkills`.

### 1.2 No Duplicate Scene IDs
```bash
grep -oP "'\w+_\w+':\s*\{" lib/scene-skill-mappings.ts | sort | uniq -d
```
**PASS CRITERIA**: Empty output. Each scene ID must be unique.

### 1.3 No Duplicate Choice IDs Within Scene
For each scene, verify no duplicate `choiceId` keys in `choiceMappings`.

---

## 2. SKILL TAXONOMY VALIDATION

### 2.1 Valid Skill Names Only
All skills in `skillsDemonstrated` arrays MUST be from this canonical list:

**Mind (Cognitive):**
- criticalThinking, problemSolving, systemsThinking
- digitalLiteracy, technicalLiteracy, informationLiteracy
- strategicThinking, creativity, curiosity, deepWork

**Heart (Emotional):**
- emotionalIntelligence, empathy, patience
- culturalCompetence, mentorship, encouragement, respect

**Voice (Communication):**
- communication, collaboration, leadership, marketing

**Hands (Action):**
- actionOrientation, crisisManagement, triage
- courage, resilience, riskManagement, urgency

**Compass (Values):**
- adaptability, learningAgility, humility, fairness
- pragmatism, integrity, accountability, wisdom

**Craft (Professional):**
- timeManagement, financialLiteracy, curriculumDesign
- entrepreneurship, observation

### 2.2 Skill Count Per Choice
**GUIDELINE**: Each choice should demonstrate 1-4 skills. More than 4 is suspicious overloading.

---

## 3. DIALOGUE GRAPH ALIGNMENT

### 3.1 Scene ID Existence
Every `sceneId` in mappings MUST correspond to a `nodeId` in the character's dialogue graph:
- `content/kai-dialogue-graph.ts`
- `content/rohan-dialogue-graph.ts`
- `content/silas-dialogue-graph.ts`
- `content/marcus-dialogue-graph.ts`
- `content/tess-dialogue-graph.ts`
- `content/yaquin-dialogue-graph.ts`
- `content/maya-dialogue-graph.ts`
- `content/devon-dialogue-graph.ts`
- `content/jordan-dialogue-graph.ts`
- `content/samuel-dialogue-graph.ts`

### 3.2 Choice ID Existence
Every `choiceId` in mappings MUST correspond to a choice in the referenced dialogue node.

### 3.3 Character Arc Accuracy
The `characterArc` field MUST match the character whose dialogue graph contains the scene.

---

## 4. CONTENT QUALITY CHECKS

### 4.1 Context Descriptions
Each `context` string should:
- Be 1-3 sentences explaining WHY this choice demonstrates the listed skills
- Reference specific player actions or decisions
- NOT be generic/boilerplate text

**RED FLAGS:**
- Context shorter than 20 characters
- Context that doesn't mention the specific skills
- Copy-pasted identical contexts across choices

### 4.2 Intensity Appropriateness
- `'high'`: Major decision points, trust gates, breakthrough moments
- `'medium'`: Standard good choices, moderate skill application
- `'low'`: Suboptimal choices that still demonstrate some skill

---

## 5. DEPTH METRICS VALIDATION

### 5.1 Minimum Coverage Per Character
Run the scoring script and verify:
```bash
node /tmp/scoring-rubric.js
```

**PASS CRITERIA**: All characters score 70+ on the rubric:
- Scene Coverage: scenes / 10 × 25 (max 25)
- Choice Depth: choices / 20 × 25 (max 25)
- Skill Breadth: unique skills / 15 × 25 (max 25)
- Deep Skills: skills with 3+ demos / 8 × 25 (max 25)

### 5.2 Skill Depth Distribution
Every skill in the taxonomy should have 3+ demonstrations across all characters.

---

## 6. CROSS-REFERENCE CHECKS

### 6.1 SKILL_CHARACTER_HINTS Alignment
Verify `SkillsView.tsx` SKILL_CHARACTER_HINTS matches actual skill distribution:
```typescript
// Example: If SKILL_CHARACTER_HINTS says leadership: ['Maya', 'Samuel']
// Then Maya and Samuel should have leadership in their mappings
```

### 6.2 No Orphaned Mappings
All mapped scenes should be reachable in gameplay (not orphaned nodes).

---

## 7. AUTOMATED VALIDATION SCRIPT

```javascript
// Run this to validate all mappings
const fs = require('fs');

// 1. Load mappings
const mappingsPath = 'lib/scene-skill-mappings.ts';
const mappingsContent = fs.readFileSync(mappingsPath, 'utf8');

// 2. Extract all sceneIds
const sceneIds = mappingsContent.match(/'(\w+)':\s*\{[\s\S]*?sceneId:\s*'\1'/g);

// 3. Verify each against dialogue graphs
const dialogueGraphs = [
  'kai', 'rohan', 'silas', 'marcus', 'tess',
  'yaquin', 'maya', 'devon', 'jordan', 'samuel'
].map(c => `content/${c}-dialogue-graph.ts`);

let errors = [];

dialogueGraphs.forEach(graphPath => {
  const graphContent = fs.readFileSync(graphPath, 'utf8');
  // Extract nodeIds from graph
  const nodeIds = [...graphContent.matchAll(/nodeId:\s*'(\w+)'/g)].map(m => m[1]);
  // Check mappings reference valid nodes
  // ... validation logic
});

console.log(errors.length ? `FAILED: ${errors.join('\n')}` : 'PASSED');
```

---

## 8. MANUAL SPOT CHECKS (Sample 10%)

Randomly select 10% of scenes and manually verify:

1. Open the dialogue graph file
2. Find the scene node
3. Verify all mapped choices exist
4. Verify skill assignments are narratively appropriate
5. Verify intensity matches the narrative weight

---

## 9. REGRESSION PREVENTION

After any changes to scene-skill-mappings.ts:

1. Run TypeScript compilation check
2. Run depth scoring script
3. Run E2E tests for constellation display
4. Verify no new ESLint warnings

---

## REVIEW SUMMARY TEMPLATE

```
## Scene-Skill Mappings Review - [DATE]

### Structural Checks
- [ ] TypeScript compiles without errors
- [ ] No duplicate scene IDs
- [ ] No duplicate choice IDs within scenes

### Taxonomy Validation
- [ ] All skills are from canonical list
- [ ] No choice has >4 skills

### Dialogue Alignment
- [ ] All scene IDs exist in dialogue graphs
- [ ] All choice IDs exist in referenced scenes
- [ ] Character arcs correctly assigned

### Content Quality
- [ ] Context descriptions are meaningful
- [ ] Intensity levels appropriate

### Depth Metrics
- [ ] All characters score 70+
- [ ] All skills have 3+ demonstrations

### Cross-References
- [ ] SKILL_CHARACTER_HINTS accurate
- [ ] No orphaned mappings

### VERDICT: [PASS/FAIL]
### ISSUES FOUND: [List any issues]
### RECOMMENDATIONS: [List any improvements]
```

---

## EXECUTION INSTRUCTIONS FOR GEMINI

1. Read the entire `lib/scene-skill-mappings.ts` file
2. Read all 10 dialogue graph files for cross-reference
3. Execute each check section above
4. Fill out the Review Summary Template
5. Flag any violations with specific line numbers
6. Suggest fixes for any issues found
