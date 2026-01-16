# Progressive Skill Revelation System - Implementation Plan

**Date:** January 15, 2026
**Status:** LAYERS 1-3 COMPLETE, LAYERS 4-5 READY FOR EXECUTION
**Context:** Phase 4 of Comprehensive Dialogue Reform Plan

---

## EXECUTIVE SUMMARY

The Progressive Skill Revelation system makes the game's skill tracking VISIBLE to players. Instead of silent measurement (905+ skill attributions with 0 impact), skills now drive meaningful gameplay feedback.

| Layer | Status | Description | Effort |
|-------|--------|-------------|--------|
| 1 | ✅ COMPLETE | Invisible Tracking | Existed |
| 2 | ✅ COMPLETE | NPC Skill Acknowledgment | 8-12 hrs (done) |
| 3 | ✅ COMPLETE | Journey Summary Display | Existed |
| 4 | ✅ COMPLETE | Career Mapping UI | 15-20 hrs (done) |
| 5 | 🔲 READY | Skill Combos & Unlocks | 20-30 hrs |

**Total Remaining:** 20-30 hours (Layer 5 only)

---

## LAYER STATUS DETAILS

### Layer 1: Invisible Tracking ✅ COMPLETE

**Implementation:**
- `GameState.skillLevels: Record<string, number>` - Stores skill levels (0-1 scale)
- `GameState.skillUsage: Map<string, SkillUsageRecord>` - Detailed usage tracking
- `SkillTracker` class in `lib/skill-tracker.ts` - Evidence-first tracking
- `skill-zustand-bridge.ts` - Syncs localStorage to Zustand for UI

**Coverage:**
- 54 WEF 2030 skills defined
- 905+ skill attributions in dialogue choices
- Automatic skill detection from patterns (PATTERN_SKILL_MAP)

---

### Layer 2: NPC Skill Acknowledgment ✅ COMPLETE (This Session)

**Implementation:**
- Added `skillReflection` arrays to 20 teaching nodes across all character tiers
- `applySkillReflection()` in `lib/consequence-echoes.ts` (lines 1569-1586)
- Called from `StatefulGameInterface.tsx` line 1129

**Nodes Modified:**
| Tier | Character | Node | Skills Acknowledged |
|------|-----------|------|---------------------|
| 1 | Devon | devon_process | systemsThinking, criticalThinking |
| 1 | Marcus | marcus_translation_lesson | communication, criticalThinking |
| 1 | Marcus | marcus_systems_blindspot | emotionalIntelligence, systemsThinking |
| 1 | Maya | maya_introduction | emotionalIntelligence, creativity |
| 1 | Maya | maya_crossroads | emotionalIntelligence, problemSolving |
| 2 | Rohan | rohan_david_lesson | technicalLiteracy, criticalThinking |
| 2 | Nadia | nadia_career_path | systemsThinking, leadership |
| 2 | Nadia | nadia_tradeoffs | criticalThinking, adaptability |
| 2 | Grace | grace_invisible_skill | emotionalIntelligence, communication |
| 2 | Tess | tess_career_reflection_educator | emotionalIntelligence, instructionalDesign |
| 2 | Quinn | quinn_grandma_lesson | financialLiteracy, emotionalIntelligence |
| 3 | Alex | alex_credential_wisdom | strategicThinking, adaptability |
| 3 | Elena | elena_synthesis_lesson | informationLiteracy, observation |
| 3 | Isaiah | isaiah_fundraising_mechanics | leadership, communication |
| 4 | Silas | silas_integration_lesson | technicalLiteracy, observation |
| 4 | Asha | asha_mediation_philosophy | emotionalIntelligence, communication |
| 4 | Lira | lira_skeleton_demo | creativity, contentCreation |
| 4 | Zara | zara_audit_methodology | dataLiteracy, ethicalReasoning |
| 4 | Dante | dante_ethics_deep | integrity, negotiation |
| 4 | Jordan | jordan_career_reflection_counselor | mentorship, emotionalIntelligence |

**Commit:** `3f00a05`

---

### Layer 3: Journey Summary Display ✅ COMPLETE

**Implementation:**
- `EssenceSigil` component - Hexagonal radar showing 6 skill clusters
- `DetailModal` - Click on skill shows:
  - Demonstration count (0-10 scale)
  - Progress bar toward mastery
  - State labels (Dormant → Awakening → Developing → Strong → Mastered)
  - Next level requirements
- Located in Journal "Essence" tab

**Files:**
- `components/EssenceSigil.tsx` (lines 1-323)
- `components/constellation/DetailModal.tsx` (lines 420-520)
- `lib/constellation/skill-positions.ts` - 40 skills in constellation layout

---

## LAYER 4: CAREER MAPPING UI ✅ COMPLETE (This Session)

### Implementation Summary
- Created `CareerRecommendationsView.tsx` - Main container with empty/loading states
- Created `CareerCard.tsx` - Expandable career match card with readiness badges
- Created `SkillGapBar.tsx` - Visual skill gap indicator with progress bars
- Added "Careers" tab to Journal between Mastery and Opportunities

### Files Created
| File | Description |
|------|-------------|
| `components/journal/CareerRecommendationsView.tsx` | Main career recommendations UI with stats |
| `components/journal/CareerCard.tsx` | Individual career match card with evidence |
| `components/journal/SkillGapBar.tsx` | Skill gap visualization component |

### Files Modified
| File | Changes |
|------|---------|
| `components/Journal.tsx` | Added careers tab, badge logic, render case |

### Features Implemented
- Top 5 career matches with match score (ring visualization)
- Readiness badges: Near Ready (green), Developing (amber), Exploring (blue)
- Evidence-based "Why You Match" section
- Skill gap analysis with progress bars
- Education pathway chips
- Birmingham employer tags
- Expandable card details

### Original Objective
Show players how their demonstrated skills map to Birmingham career pathways with evidence-based recommendations.

### Backend Status: 80% COMPLETE
- `FutureSkillsSystem.getMatchingCareerPaths()` - Returns top career matches
- `SkillTracker.getCareerMatches()` - Generates evidence-based recommendations
- `CareerMatch` interface with: matchScore, evidenceForMatch, requiredSkills, salaryRange, educationPaths, localOpportunities, readiness

### Frontend: TO BE BUILT

#### Step 1: Create CareerRecommendationsView Component

**File:** `components/journal/CareerRecommendationsView.tsx`

```typescript
interface CareerCardProps {
  career: {
    name: string
    matchScore: number
    evidenceForMatch: string[]
    requiredSkills: Record<string, { current: number; required: number; gap: number }>
    salaryRange: [number, number]
    educationPaths: string[]
    localOpportunities: string[]
    readiness: 'near_ready' | 'developing' | 'exploring'
  }
}

// Features:
// 1. Top 3-5 career matches sorted by score
// 2. Match score visualization (progress ring or bar)
// 3. "Why You Match" section with evidence bullets
// 4. Skill gap analysis with progress bars
// 5. Birmingham employers/pathways
// 6. Salary range display
// 7. Education path options
```

#### Step 2: Integrate with SkillTracker

```typescript
// In CareerRecommendationsView:
const skillTracker = useMemo(() => createSkillTracker(userId), [userId])
const profile = skillTracker.exportSkillProfile()
const careerMatches = profile.careerMatches
```

#### Step 3: Add to Journal Tabs

```typescript
// In Journal.tsx, add new tab:
{activeTab === 'careers' && <CareerRecommendationsView />}
```

#### Step 4: Design System

- Readiness badges: `near_ready` = green, `developing` = amber, `exploring` = blue
- Skill gap bars: current (solid) vs required (dashed outline)
- Evidence bullets with scene references
- Birmingham employers as tags/chips

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `components/journal/CareerRecommendationsView.tsx` | CREATE | Main career recommendations UI |
| `components/journal/CareerCard.tsx` | CREATE | Individual career match card |
| `components/journal/SkillGapBar.tsx` | CREATE | Skill gap visualization |
| `components/Journal.tsx` | MODIFY | Add careers tab |
| `lib/skill-tracker.ts` | VERIFY | Ensure getCareerMatches works |

### Acceptance Criteria

- [ ] Career recommendations visible in Journal
- [ ] Top 3-5 matches displayed with scores
- [ ] Evidence statements explain why each career matches
- [ ] Skill gaps clearly shown with progress
- [ ] Birmingham-specific employers/pathways displayed
- [ ] Readiness levels color-coded

---

## LAYER 5: SKILL COMBOS & UNLOCKS - IMPLEMENTATION PLAN

### Objective
Create emergent gameplay where skill combinations unlock special content, dialogue branches, and hybrid career paths.

### Backend: TO BE BUILT

#### Step 1: Define Skill Combination Registry

**File:** `lib/skill-combos.ts`

```typescript
export interface SkillCombo {
  id: string
  name: string
  description: string
  skills: string[]        // Required skills
  minLevels: number[]     // Minimum level for each skill (0-10 scale)
  unlocks: {
    type: 'dialogue' | 'career' | 'achievement' | 'ability'
    id: string
    description: string
  }[]
  characterHint?: string  // Character who can help develop this combo
}

export const SKILL_COMBOS: SkillCombo[] = [
  {
    id: 'strategic_empathy',
    name: 'Strategic Empathy',
    description: 'The ability to understand systems AND the people within them',
    skills: ['systemsThinking', 'emotionalIntelligence'],
    minLevels: [5, 5],
    unlocks: [
      { type: 'career', id: 'change_management', description: 'Organizational Change Manager' },
      { type: 'dialogue', id: 'devon_deep_insight', description: 'Devon shares advanced systems wisdom' }
    ],
    characterHint: 'Devon + Grace'
  },
  {
    id: 'technical_storyteller',
    name: 'Technical Storyteller',
    description: 'Translating complex concepts into human understanding',
    skills: ['technicalLiteracy', 'communication', 'creativity'],
    minLevels: [4, 5, 4],
    unlocks: [
      { type: 'career', id: 'tech_education', description: 'Technical Educator / Content Creator' },
      { type: 'dialogue', id: 'marcus_translation_master', description: 'Marcus recognizes your translation skills' }
    ],
    characterHint: 'Marcus + Lira'
  },
  {
    id: 'ethical_analyst',
    name: 'Ethical Analyst',
    description: 'Combining data rigor with moral reasoning',
    skills: ['dataLiteracy', 'criticalThinking', 'ethicalReasoning'],
    minLevels: [4, 5, 4],
    unlocks: [
      { type: 'career', id: 'ai_ethics', description: 'AI Ethics Specialist' },
      { type: 'dialogue', id: 'zara_nadia_crossover', description: 'Zara and Nadia reference your ethical analysis' }
    ],
    characterHint: 'Zara + Nadia'
  },
  {
    id: 'resilient_leader',
    name: 'Resilient Leader',
    description: 'Leading through crisis with composure',
    skills: ['leadership', 'resilience', 'crisisManagement'],
    minLevels: [5, 4, 4],
    unlocks: [
      { type: 'career', id: 'emergency_director', description: 'Emergency Management Director' },
      { type: 'achievement', id: 'crisis_navigator', description: 'Crisis Navigator badge' }
    ],
    characterHint: 'Kai + Samuel'
  },
  {
    id: 'community_architect',
    name: 'Community Architect',
    description: 'Building systems that serve people',
    skills: ['collaboration', 'systemsThinking', 'culturalCompetence'],
    minLevels: [5, 4, 5],
    unlocks: [
      { type: 'career', id: 'community_development', description: 'Community Development Director' },
      { type: 'dialogue', id: 'isaiah_tess_crossover', description: 'Isaiah and Tess recognize your community vision' }
    ],
    characterHint: 'Isaiah + Tess'
  }
]
```

#### Step 2: Create Combo Detection System

**File:** `lib/skill-combo-detector.ts`

```typescript
export function detectUnlockedCombos(skillLevels: Record<string, number>): SkillCombo[] {
  return SKILL_COMBOS.filter(combo => {
    return combo.skills.every((skill, index) => {
      const playerLevel = (skillLevels[skill] || 0) * 10 // Convert 0-1 to 0-10
      return playerLevel >= combo.minLevels[index]
    })
  })
}

export function getComboProgress(combo: SkillCombo, skillLevels: Record<string, number>): {
  overall: number
  bySkill: Record<string, { current: number; required: number; progress: number }>
} {
  const bySkill: Record<string, { current: number; required: number; progress: number }> = {}

  combo.skills.forEach((skill, index) => {
    const current = (skillLevels[skill] || 0) * 10
    const required = combo.minLevels[index]
    bySkill[skill] = {
      current,
      required,
      progress: Math.min(100, (current / required) * 100)
    }
  })

  const overallProgress = Object.values(bySkill).reduce((sum, s) => sum + s.progress, 0) / combo.skills.length

  return { overall: overallProgress, bySkill }
}
```

#### Step 3: Create Combo UI Component

**File:** `components/journal/SkillCombosView.tsx`

Features:
- Grid of combo cards (locked/unlocked states)
- Progress indicators for each skill in combo
- Character hints for developing combos
- Unlock celebrations when combo achieved
- Links to unlocked content (career paths, dialogues)

#### Step 4: Wire Combo-Gated Dialogue

Add `requiredCombos` to DialogueNode interface:

```typescript
// In lib/dialogue-graph.ts
interface DialogueNode {
  // ... existing fields
  requiredCombos?: string[]  // Combo IDs that must be unlocked
}

// In content/*-dialogue-graph.ts
{
  nodeId: 'devon_deep_insight',
  requiredCombos: ['strategic_empathy'],
  content: [{
    text: "You see it now, don't you? The systems AND the people within them...",
    emotion: 'profound'
  }]
}
```

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `lib/skill-combos.ts` | CREATE | Combo definitions and registry |
| `lib/skill-combo-detector.ts` | CREATE | Detection and progress logic |
| `components/journal/SkillCombosView.tsx` | CREATE | Combo display UI |
| `components/journal/ComboCard.tsx` | CREATE | Individual combo card |
| `lib/dialogue-graph.ts` | MODIFY | Add requiredCombos to interface |
| `components/StatefulGameInterface.tsx` | MODIFY | Check combo requirements |
| `content/*-dialogue-graph.ts` | MODIFY | Add combo-gated nodes (5-10 per tier) |

### Acceptance Criteria

- [ ] 5+ skill combos defined with meaningful unlocks
- [ ] Combo detection works based on skill levels
- [ ] UI shows combo progress in Journal
- [ ] Locked combos show requirements and hints
- [ ] Unlocked combos celebrate and show rewards
- [ ] At least 5 dialogue nodes gated by combos
- [ ] Career paths reference relevant combos

---

## EXECUTION ORDER

### Phase 1: Layer 4 (15-20 hours)
1. Create `CareerRecommendationsView.tsx` (4 hrs)
2. Create `CareerCard.tsx` with match visualization (3 hrs)
3. Create `SkillGapBar.tsx` component (2 hrs)
4. Integrate with SkillTracker (3 hrs)
5. Add to Journal tabs (1 hr)
6. Test and polish (3-4 hrs)

### Phase 2: Layer 5 (20-30 hours)
1. Define SKILL_COMBOS registry (3 hrs)
2. Create combo detection system (3 hrs)
3. Create SkillCombosView UI (5 hrs)
4. Modify dialogue-graph.ts interface (1 hr)
5. Add requiredCombos to StatefulGameInterface (2 hrs)
6. Author combo-gated dialogue nodes (8 hrs)
7. Test and polish (3-5 hrs)

---

## VERIFICATION CHECKLIST

### Layer 4 Complete When:
- [ ] Career matches displayed in Journal
- [ ] Top 5 careers shown with evidence
- [ ] Skill gaps visualized
- [ ] Birmingham employers listed
- [ ] Readiness levels color-coded
- [ ] All tests pass

### Layer 5 Complete When:
- [ ] 5+ combos defined
- [ ] Combo detection working
- [ ] UI displays combo progress
- [ ] 5+ combo-gated dialogues authored
- [ ] Unlock celebrations implemented
- [ ] All tests pass

---

## RELATED DOCUMENTATION

- Master Plan: `docs/03_PROCESS/plans/15JAN26_COMPREHENSIVE_DIALOGUE_REFORM.md`
- Session Plan: `~/.claude/plans/humble-shimmying-hellman.md`
- Skills Data Dictionary: `docs/reference/data-dictionary/02-skills.md`
- Careers Data Dictionary: `docs/reference/data-dictionary/11-careers.md`

---

*Plan created January 15, 2026. Ready for execution.*
