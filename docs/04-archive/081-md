# Skills System Validation Guide

## Overview

The Skills Tracking System is a critical component of the Grand Central Terminus career exploration platform. This validation suite ensures data integrity, type safety, and correct functionality across all system components.

## Quick Start

```bash
# Run all validation tests
npm run validate-skills

# Expected output: 16/16 tests passing (100%)
```

## What Gets Validated

### 1. **Core Functionality Tests**

#### SkillTracker.recordSkillDemonstration()
- ✅ Records skill demonstrations with complete metadata
- ✅ Validates demonstration structure (scene, choice, skills, context, timestamp)
- ✅ Verifies skills array integrity
- ✅ Confirms timestamp accuracy

**Test Coverage:**
- Skill demonstration recording
- Field validation
- Data structure integrity
- In-memory storage functionality

---

#### Scene Mapping Lookup Logic
- ✅ Validates all 44 scene mappings have correct structure
- ✅ Verifies character arc assignments (maya, devon, jordan, samuel)
- ✅ Checks choice mappings completeness
- ✅ Validates intensity levels (high, medium, low)

**Test Coverage:**
- 44 scenes across 4 character arcs
- 86 total choice mappings
- Scene lookup by character helper function
- High intensity moments retrieval

---

### 2. **Type Safety & Data Integrity**

#### Skill Type Safety
- ✅ All 315 skill references use valid 2030 Skills
- ✅ No invalid skill names in scene mappings
- ✅ Skill distribution analysis

**Valid 2030 Skills:**
- criticalThinking
- communication
- collaboration
- creativity
- adaptability
- leadership
- digitalLiteracy
- emotionalIntelligence
- culturalCompetence
- financialLiteracy
- timeManagement
- problemSolving

**Skill Distribution (Top 5):**
1. emotionalIntelligence: 75 demonstrations
2. communication: 66 demonstrations
3. criticalThinking: 54 demonstrations
4. adaptability: 30 demonstrations
5. problemSolving: 25 demonstrations

---

### 3. **Scene Mapping Coverage**

#### Character Arc Balance
- Maya: 7 scenes
- Devon: 11 scenes
- Jordan: 12 scenes
- Samuel: 14 scenes

#### Intensity Distribution
- High: 60 choices (70%)
- Medium: 23 choices (27%)
- Low: 3 choices (3%)

**Validation:** Coverage is reasonably balanced across arcs (ratio < 3:1)

---

### 4. **localStorage Persistence**

**Node.js Environment Behavior:**
- ✅ Graceful degradation when localStorage unavailable
- ✅ In-memory storage works correctly
- ✅ No thrown errors in server-side rendering
- ✅ safeStorage wrapper handles all edge cases

**Browser Environment (Manual Test):**
1. Open browser console on game page
2. Make several choices
3. Reload page
4. Data should persist across page loads

---

### 5. **Admin Dashboard Data Loading**

#### Profile Export Structure
- ✅ skillDemonstrations (grouped by skill)
- ✅ milestones (journey checkpoints)
- ✅ careerMatches (Birmingham career paths)
- ✅ totalDemonstrations (count)
- ✅ journeyStarted (timestamp)

#### Dashboard Compatibility
All required fields present for:
- SingleUserDashboard component
- Evidence-based skill profile rendering
- Career match visualization
- Export functionality

---

### 6. **Context Quality Validation**

**Metrics:**
- Average context length: 343 characters
- 86 contexts with good quality (≥ 50 chars)
- 0 contexts too short (< 50 chars)

**Quality Standards:**
- Minimum 50 characters for meaningful context
- Rich evidence statements (100-150 words optimal)
- Describes skill demonstration clearly
- Connects to character arc narrative

---

### 7. **Scene Description Quality**

**Validation:**
- ✅ All 44 scenes have descriptions ≥ 30 characters
- ✅ Descriptions are meaningful and contextual
- ✅ Clear connection to character arc
- ✅ Identifies trust-gate moments and breakthroughs

**Example Quality Scene Description:**
> "Maya reveals tension between 20 years of immigrant family sacrifice and her authentic passion for robotics"

---

### 8. **Skill Demonstration Count**

**Realistic Range Validation:**
- ✅ 86 choices have 2-6 skills (realistic)
- ❌ 0 choices have < 2 skills (unrealistic)
- ❌ 0 choices have > 6 skills (unrealistic)

**Rationale:**
- Choices demonstrating 1 skill are too narrow
- Choices demonstrating 7+ skills are implausible
- 2-6 skills per choice = evidence-based realism

---

### 9. **Full Journey Simulation**

**Integration Test:**
1. ✅ 6 demonstrations across multiple character arcs
2. ✅ 2 milestone checkpoints recorded
3. ✅ Skill grouping by type works correctly
4. ✅ emotionalIntelligence tracked across 4+ demonstrations
5. ✅ Profile export generates complete structure

**Simulated Journey:**
- Maya family pressure → Devon father reveal → Jordan impostor syndrome → Samuel backstory
- Tests complete data flow from recording to export

---

## Expected Output

### All Tests Passing (100%)

```
============================================================
   SKILLS SYSTEM VALIDATION TEST SUITE
============================================================

→ Testing: SkillTracker.recordSkillDemonstration()
  ✅ PASS: Record skill demonstration
     Successfully recorded and validated demonstration structure

→ Testing: Scene Mapping Lookup Logic
  ✅ PASS: Scene mapping structure validation
     All 44 scenes have valid structure
  ✅ PASS: Scene lookup by character
     Found 7 Maya scenes
  ✅ PASS: High intensity moments lookup
     Found 60 high intensity moments

→ Testing: Skill Type Safety
  ✅ PASS: Skill type safety
     All 315 skill references use valid 2030 Skills
  ✅ PASS: Skill distribution analysis
     Top skills: emotionalIntelligence: 75, communication: 66, criticalThinking: 54

→ Testing: Scene Mapping Coverage
  ✅ PASS: Scene mapping coverage
     44 scenes with 86 total choices
  ✅ PASS: Character arc distribution
     Maya: 7, Devon: 11, Jordan: 12, Samuel: 14
  ✅ PASS: Intensity distribution
     High: 60, Medium: 23, Low: 3
  ✅ PASS: Character arc balance
     Coverage reasonably balanced across arcs

→ Testing: localStorage Persistence (graceful degradation)
  ✅ PASS: localStorage graceful degradation
     In-memory storage works; localStorage gracefully unavailable in Node.js

→ Testing: Admin Dashboard Data Loading
  ✅ PASS: Admin dashboard data loading
     Profile export structure valid for dashboard rendering

→ Testing: Context Quality Validation
  ✅ PASS: Context quality
     Average context length: 343 chars, 86 good contexts, 0 short

→ Testing: Scene Description Quality
  ✅ PASS: Scene description quality
     All 44 scenes have meaningful descriptions

→ Testing: Skill Demonstration Count per Scene
  ✅ PASS: Skill count validation
     86 choices have 2-6 skills (realistic range)

→ Testing: Full Journey Simulation
  ✅ PASS: Full journey simulation
     Successfully simulated and validated complete user journey

============================================================
   TEST SUMMARY
============================================================

Total Tests: 16
✅ Passed: 16
❌ Failed: 0
Success Rate: 100%

============================================================
```

---

## Interpreting Failures

### Common Failure Scenarios

#### ❌ Missing skill demonstrations field
**Meaning:** Profile export structure is incomplete  
**Fix:** Check SkillTracker.exportSkillProfile() implementation

#### ❌ Invalid skill references
**Meaning:** Scene mapping uses skill not in 2030 Skills system  
**Fix:** Update /lib/scene-skill-mappings.ts with valid skill name

#### ❌ Scene mapping structure invalid
**Meaning:** Missing required fields (sceneId, characterArc, choiceMappings)  
**Fix:** Add missing fields to scene mapping definition

#### ❌ Imbalanced character arc coverage
**Meaning:** One character has 3x+ more scenes than another  
**Fix:** Add more scenes to underrepresented character arcs

#### ❌ Too many short contexts
**Meaning:** > 10% of contexts have < 50 characters  
**Fix:** Enrich context strings with meaningful skill evidence

---

## Manual Browser Testing

Since localStorage validation requires browser environment, perform these manual tests:

### Test 1: Skill Tracking Persistence
1. Start game: http://localhost:3000
2. Make 5-10 choices
3. Open DevTools → Application → Local Storage
4. Verify `skill_tracker_[userId]` key exists
5. Refresh page
6. Verify choices persist (check console logs)

### Test 2: Admin Dashboard Loading
1. Navigate to: http://localhost:3000/admin
2. Find test user in list
3. Click "View Skills" link
4. Verify SingleUserDashboard renders
5. Check all 5 tabs load correctly:
   - Skills (evidence cards)
   - Careers (Birmingham paths)
   - Evidence (frameworks)
   - Gaps (skill development)
   - Action (next steps)

### Test 3: Export Functionality
1. On admin dashboard, click "Export Profile"
2. Verify PDF downloads
3. Open PDF, confirm:
   - User metadata present
   - Skill demonstrations listed
   - Career matches included
   - Evidence sections complete

---

## Adding New Scene Mappings

When adding new narrative content, follow this validation workflow:

### 1. Create Scene Mapping
```typescript
// /lib/scene-skill-mappings.ts
'new_scene_id': {
  sceneId: 'new_scene_id',
  characterArc: 'maya', // or devon, jordan, samuel
  sceneDescription: 'Clear description of scene (≥30 chars)',
  
  choiceMappings: {
    'choice_id': {
      skillsDemonstrated: ['emotionalIntelligence', 'communication'], // 2-6 skills
      context: 'Rich evidence statement explaining skill demonstration (100-150 words)', // ≥50 chars
      intensity: 'high' // or medium, low
    }
  }
}
```

### 2. Run Validation
```bash
npm run validate-skills
```

### 3. Fix Any Failures
- Invalid skill name → Use valid 2030 Skill
- Short context → Expand to ≥50 characters
- Missing fields → Add required structure
- Invalid character arc → Use maya/devon/jordan/samuel

### 4. Verify Coverage
Check that:
- Character arc balance maintained
- Skill distribution reasonable
- High intensity moments well-distributed

---

## Integration with CI/CD

### Add to GitHub Actions

```yaml
# .github/workflows/test.yml
name: Validate Skills System

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run validate-skills
```

### Pre-commit Hook

```bash
# Add to package.json scripts
"precommit": "npm run validate-skills && npm run lint"
```

---

## Troubleshooting

### Issue: "localStorage not available"
**Cause:** Tests run in Node.js environment  
**Solution:** This is expected. safeStorage handles gracefully.

### Issue: "Scene not found in mappings"
**Cause:** SkillTracker references scene not in SCENE_SKILL_MAPPINGS  
**Solution:** Add scene mapping or update scene ID

### Issue: "Skill demonstrations array empty"
**Cause:** No valid skills detected in choice  
**Solution:** Add pattern metadata or scene mapping for choice

### Issue: "Profile export returns undefined"
**Cause:** SkillTracker initialization failed  
**Solution:** Check userId format and constructor parameters

---

## Architecture Notes

### Why 44 scenes?
These represent the top 30 impactful narrative moments plus 14 additional high-value scenes. Coverage: 44 of 151 total scenes (29%).

### Why evidence-based design?
Grant funding requires measurable outcomes. Skills system provides:
- Quantifiable skill development (0-1 scale)
- Evidence statements (not just scores)
- Scientific framework backing (5+ validated models)
- Exportable reports for stakeholders

### Why localStorage?
- Simple, no backend required
- Works offline
- Instant persistence
- Easy to export/import for admin tools

### Future: Supabase Migration
When moving to database (Phase 3+):
1. Keep SkillTracker API unchanged
2. Swap safeStorage for Supabase client
3. Add sync logic for offline → online
4. Maintain evidence-first structure

---

## Key Files

- **/lib/skill-tracker.ts** - Core tracking logic
- **/lib/scene-skill-mappings.ts** - 44 scene definitions
- **/lib/2030-skills-system.ts** - Valid skill types
- **/lib/safe-storage.ts** - localStorage wrapper
- **/lib/skill-profile-adapter.ts** - Dashboard data loader
- **/app/admin/skills/page.tsx** - Admin dashboard page
- **/components/admin/SingleUserDashboard.tsx** - Evidence-based UI
- **/scripts/validate-skills-system.ts** - This validation suite

---

## Success Metrics

✅ **100% test pass rate** (16/16 tests)  
✅ **44 scenes** mapped with rich context  
✅ **86 choice mappings** validated  
✅ **315 skill demonstrations** across 12 2030 Skills  
✅ **343 character average** context quality  
✅ **Balanced coverage** across 4 character arcs  
✅ **Graceful degradation** in all environments  

---

*Last Updated: December 2025*  
*Validation Suite Version: 1.0.0*
