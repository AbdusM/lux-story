# CEO Walkthrough - Code Pages

Quick reference guide to key code files demonstrating the platform's underlying mechanics.

---

## 🎯 Walkthrough Order

### 1. The Experience (Play First)
**What to show:** Play through Maya's introduction scene
- Demonstrate dialogue and choices
- Show ChatPacedDialogue in action
- Make a choice and see the story branch

**Talking Point:** "This is what students experience - narrative-driven career exploration"

---

### 2. Choice → Skills Mapping
**File:** [`content/maya-dialogue-graph.ts`](./content/maya-dialogue-graph.ts#L29-L60)

**Lines to show:** 29-60

**Key Code:**
```typescript
choices: [
  {
    text: "You're trying to be two things at once.",
    pattern: 'helping',
    skills: ['emotional_intelligence', 'communication'],
    consequence: {
      characterId: 'maya',
      trustChange: 1
    }
  }
]
```

**Talking Point:** *"Every choice is annotated with real skills. This supportive response demonstrates emotional intelligence and communication - we track that automatically."*

---

### 3. The Data Structure
**File:** [`lib/dialogue-graph.ts`](./lib/dialogue-graph.ts#L74-L115)

**Lines to show:** 74-115

**Key Code:**
```typescript
export interface ConditionalChoice {
  text: string
  pattern?: 'analytical' | 'helping' | 'building' | 'patience' | 'exploring'
  skills?: Array<'criticalThinking' | 'emotionalIntelligence' | ...>
  consequence?: StateChange  // Updates trust, unlocks new paths
}
```

**Talking Point:** *"This is the structure that drives everything. Each choice has skills metadata, behavior patterns, and story consequences."*

---

### 4. Real-Time Skill Tracking
**File:** [`components/StatefulGameInterface.tsx`](./components/StatefulGameInterface.tsx#L490-L529)

**Lines to show:** 490-529

**Key Code:**
```typescript
// Record skill demonstration from this choice
if (skillTrackerRef.current && state.currentNode) {
  skillTrackerRef.current.recordSkillDemonstration(
    state.currentNode.nodeId,
    choice.choice.choiceId,
    choiceMapping.skillsDemonstrated,
    choiceMapping.context
  )
}
```

**Talking Point:** *"When they click a choice, we immediately record which skills they demonstrated. This happens in real-time, building their profile automatically."*

---

### 5. The Tracking Engine
**File:** [`lib/skill-tracker.ts`](./lib/skill-tracker.ts#L91-L121)

**Lines to show:** 91-121

**Key Code:**
```typescript
recordChoice(choice, scene, gameState): void {
  // 1. Extract skill demonstrations from choice
  const demonstrations = this.extractDemonstrations(choice, scene, gameState)
  
  // 2. Record evidence
  this.demonstrations.push(...demonstrations)
  
  // 3. Update internal skill levels
  // 4. Persist to storage
}
```

**Talking Point:** *"This is the engine that builds their profile. Every choice becomes evidence of skill development. No surveys, no self-reporting - pure behavioral tracking."*

---

### 6. Admin Dashboard (The Output)
**File:** [`components/admin/SingleUserDashboard.tsx`](./components/admin/SingleUserDashboard.tsx)

**What to show:** The dashboard sections (urgency, skills, careers, evidence)

**Talking Point:** *"This is what counselors see. Real-time insights on each student - their skills, career matches, and where they need support. Actionable data, not just reports."*

---

## 📋 Quick Reference

| Topic | File | Lines | Key Insight |
|-------|------|-------|-------------|
| **Choice Definition** | `content/maya-dialogue-graph.ts` | 29-60 | Choices are annotated with skills |
| **Data Structure** | `lib/dialogue-graph.ts` | 74-115 | Type-safe interfaces for everything |
| **Real-Time Tracking** | `components/StatefulGameInterface.tsx` | 490-529 | Tracking happens on every choice |
| **Profile Building** | `lib/skill-tracker.ts` | 91-121 | Engine that accumulates evidence |
| **Counselor View** | `components/admin/SingleUserDashboard.tsx` | Various | Insights dashboard |

---

## 🎤 Suggested Script

**Opening (30 sec):**
> "We're solving the skills gap problem differently - through narrative, not assessments. Let me show you how it works."

**Show Experience (2 min):**
> "This is what a student sees. Let's play through Maya's story..."

**Show Code - Choice Mapping (1 min):**
> "Under the hood, every choice is structured data. Here's how we define choices with skills metadata..."

**Show Code - Tracking (1 min):**
> "When they make a choice, we immediately track it. This happens in real-time..."

**Show Admin Dashboard (1 min):**
> "And this is what counselors see. Real-time insights, career matches, actionable recommendations..."

**Vision (1 min):**
> "The power is scale - we can do this for hundreds of students, providing personalized insights at scale..."

---

## 💡 Key Talking Points

- **"Narrative-driven, not quiz-based"** - Students explore through story, not assessments
- **"Behavioral tracking, not self-reporting"** - We observe skills through choices
- **"Real-time insights"** - Counselors see data as students play
- **"Birmingham-specific"** - Career paths tied to local opportunities
- **"WEF 2030 Skills"** - Tracking the skills that matter for future workforce
- **"Scalable solution"** - Can handle hundreds/thousands of students

---

## 🚫 What NOT to Show

- Database schemas or API routes (too technical)
- CSS/styling files (not core mechanics)
- Complex state management (implementation detail)
- Error handling code (edge cases)

---

## ✅ Success Criteria

After showing these files, CEO should understand:
1. ✅ Choices map directly to skills
2. ✅ Tracking is automatic and real-time
3. ✅ Profile builds from every interaction
4. ✅ Insights are actionable for counselors
5. ✅ System is structured and scalable

---

*Last updated: Current session*

