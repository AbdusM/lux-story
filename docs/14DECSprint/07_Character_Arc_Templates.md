# Character Arc Templates - Four-Part Story Structure

**Date:** December 14, 2024
**Source:** Synthesized from 30-career-paths.md + Lux Story design philosophy
**Purpose:** Reusable templates for creating compelling 35-node character arcs

---

## Overview: The Four-Part Character Arc

Every Lux Story character follows this proven structure:

1. **Introduction** (Nodes 1-10): Hook, context, surface conflict
2. **Crossroads** (Nodes 11-20): Key decision point + pressure test
3. **Challenge** (Nodes 21-30): Ethical dilemma + vulnerability
4. **Insight** (Nodes 31-35): Unexpected moment + resolution

**Why This Works:**
- Mobile-friendly pacing (10 nodes = 1 session = 10-15 min)
- Pattern revelation through choices, not exposition
- Emotional arc (curious → challenged → vulnerable → transformed)
- Replayability (different choices = different character understanding)

---

## Act 1: Introduction (Nodes 1-10)

### Purpose
Hook player, establish character voice, build initial trust, introduce surface conflict

### Node Structure

**Node 1: Hook** (Trust 0)
```typescript
{
  nodeId: 'character_intro_1',
  speaker: 'Character Name',
  content: [{
    text: "Immediate intrigue or relatable problem. Make player curious.",
    emotion: 'curious' | 'conflicted' | 'warm'
  }],
  choices: [
    { text: 'Observant choice', pattern: 'analytical', trustChange: 1 },
    { text: 'Supportive choice', pattern: 'helping', trustChange: 1 },
    { text: 'Question choice', pattern: 'exploring', trustChange: 1 },
    { text: 'Patient choice', pattern: 'patience', trustChange: 1 }
  ]
}
```

**Nodes 2-3: Context** (Trust 0-1)
- Who they are, what they do, where they are
- Show, don't tell (details reveal profession)
- Example: "You look lost." vs "I'm a doctor and I help people"

**Nodes 4-6: Surface Conflict** (Trust 1-2)
- Low-stakes problem that reveals personality
- Player helps solve or observes
- Example: Maya mixes up brachial plexus, not "my entire medical career is failing"

**Nodes 7-9: Pattern Introduction** (Trust 2-3)
- First glimpse of deeper themes
- Character hints at bigger question
- Example: "Do you think it's possible to want something and dread it?"

**Node 10: Bridge to Act 2** (Trust 3) **[SESSION BOUNDARY]**
- Question or decision that leads to crossroads
- Natural pause point
- Platform announcement: "The 7:15 to Crossroads Station will depart shortly."

---

## Act 2: Crossroads (Nodes 11-20)

### Purpose
Present meaningful decision point + reveal HOW player thinks under pressure

### Part A: Crossroads Scene (Nodes 11-14)

**Template:**
```typescript
// Node 11: The Crossroads
{
  speaker: 'Character Name',
  content: [{
    text: "I'm at a decision point. Option A vs Option B. Both valid. Both costly.",
    emotion: 'conflicted'
  }],
  // ALWAYS 4 choices (one per relevant pattern)
  choices: [
    {
      text: '"Analytical response that examines data/logic"',
      pattern: 'analytical',
      nextNodeId: 'character_crossroads_2a'
    },
    {
      text: '"Helping response that considers people/impact"',
      pattern: 'helping',
      nextNodeId: 'character_crossroads_2b'
    },
    {
      text: '"Exploring response that asks questions/seeks alternatives"',
      pattern: 'exploring',
      nextNodeId: 'character_crossroads_2c'
    },
    {
      text: '"Patience/Building response that suggests time or action"',
      pattern: 'patience' | 'building',
      nextNodeId: 'character_crossroads_2d'
    }
  ]
}
```

**Crossroads Principles:**
- No "right" answer
- Both options have merit and cost
- Choice reveals values, not competence
- Character reflects player's perspective

**Examples from 30 Career Paths:**

**Dr. Amara (AI Diagnostician):**
> "The AI flagged a shadow. 99.2% confidence: benign. But something feels off to me."
>
> Choices:
> - "Trust your gut. Order the tests." (Patience + Analytical)
> - "The AI's track record speaks for itself." (Analytical)
> - "Talk to the patient. Let them decide." (Helping)
> - "What specifically feels off?" (Exploring)

**Marcus (Geriatric Care):**
> "Mrs. Chen is 84. Her kids want assisted living. She wants to die in her house."
>
> Choices:
> - "Whose life is it?" (Exploring - autonomy)
> - "What are actual risks if she stays?" (Analytical)
> - "Can we find middle path? Modified home care?" (Building)
> - "Have they talked to each other?" (Helping)

---

### Part B: Day-in-Life Pressure Test (Nodes 15-18)

**Purpose:** Reveal HOW player prioritizes under time/resource constraints

**Template:**
```typescript
// Node 15: Pressure Test Setup
{
  speaker: 'Character Name',
  content: [
    { text: "SCENE: [Location], [Time constraint]" },
    { text: "[Crisis 1]: [Quick description]" },
    { text: "[Crisis 2]: [Quick description]" },
    { text: "[Crisis 3]: [Quick description]" },
    { text: "You can only handle one. Which do you take?" }
  ],
  choices: [
    {
      text: 'Handle Crisis 1 [reason reveals pattern]',
      pattern: 'analytical' | 'helping' | 'building',
      nextNodeId: 'character_pressure_1a'
    },
    {
      text: 'Handle Crisis 2 [reason reveals pattern]',
      pattern: 'helping' | 'patience',
      nextNodeId: 'character_pressure_1b'
    },
    {
      text: 'Handle Crisis 3 [reason reveals pattern]',
      pattern: 'exploring' | 'building',
      nextNodeId: 'character_pressure_1c'
    },
    {
      text: 'Try to handle all three (probably fail)',
      pattern: 'helping',
      nextNodeId: 'character_pressure_1d'
    }
  ]
}
```

**Pressure Test Principles:**
- Time-compressed (minutes, not days)
- Multiple simultaneous demands
- Limited resources (can't do everything)
- Each choice sacrifices something
- Pattern revealed by WHAT you prioritize

**Examples:**

**Dr. Amara (AI Diagnostician):**
> SCENE: Diagnostic Review Room, 7 cases queued
> Timer: 45 minutes until tumor board meeting
>
> Case 1: AI says pneumonia. Textbook. [CONFIRM / REVIEW]
> Case 2: AI uncertain (67% liver mass, 33% artifact). [ESCALATE / DISMISS]
> Case 3: AI missed something you caught. Report error? [REPORT / NOTE PRIVATELY]
> Case 4: Patient's 5th scan this year. AI recommends 6th. [APPROVE / PUSH BACK]

**Jordan (Mental Health Crisis):**
> SCENE: Night shift, three calls pending
>
> Call 1: Teenager threatening self-harm. Parents panicking.
> Call 2: Homeless man talking to himself. Business owner wants him gone.
> Call 3: Domestic situation, unclear if mental health or violence.
>
> You can only take one. Others get police response or wait.

**Devon (Cybersecurity):**
> SCENE: SOC dashboard, 3 AM
>
> Alert 1: Known false positive pattern. Dismiss? Or verify this time?
> Alert 2: New zero-day dropped on Twitter. Is it in your network?
> Alert 3: Executive's account accessed from unusual location. They're traveling.
>
> You're alone until 7 AM. Decision to wake people up is yours.

---

**Node 20: End of Crossroads** (Trust 5-6) **[SESSION BOUNDARY]**
- Character reflects on player's choices
- Natural pause point
- Platform announcement: "The 9:30 Express to Future Build Terminal is now boarding."

---

## Act 3: Challenge (Nodes 21-30)

### Purpose
Show character facing biggest obstacle, reveal deeper patterns, test values

### Part A: Ethical Dilemma (Nodes 21-25)

**Template:**
```typescript
// Node 21: The Dilemma
{
  speaker: 'Character Name',
  content: [{
    text: "I discovered/learned something that creates impossible choice.",
    emotion: 'conflicted' | 'troubled'
  }, {
    text: "Option A: Professionally correct, personally costly.",
    pause: 800
  }, {
    text: "Option B: Personally aligned, professionally risky.",
    pause: 800
  }, {
    text: "There's no clean answer here."
  }],
  choices: [
    // 4 choices that explore different aspects of the dilemma
    // NOT "right vs wrong" but "value A vs value B"
  ]
}
```

**Ethical Dilemma Principles:**
- No clear "correct" answer
- Professional stakes AND personal stakes
- Player's pattern affects how question is framed
- Character is genuinely uncertain

**Examples:**

**Priya (Precision Medicine):**
> "We sequenced his tumor. There's a targetable mutation.
> Off-label drug exists. $14,000/month. Insurance won't cover.
>
> I can write the prescription. But can he afford to fill it?
> Or do we try standard chemo first? Lower chance, but covered."

**Devon (Cybersecurity):**
> "I traced the intrusion. I know who did it.
> Not a nation-state. A kid. A really talented kid.
>
> If I report this, they're looking at federal charges.
> If I don't... they'll do it again.
>
> I was that kid once."

**Ingrid (Circular Economy):**
> "I traced their supply chain. 'Recycled' plastic? Shipped to Malaysia, 30% recycled, rest burned.
> They're claiming 100% circular.
>
> If I report this, they lose certification. 2,000 people employed in a town with no other jobs.
> They hired me to improve, not to burn them down."

**Elena (AI Safety):**
> "The model did something unexpected. Emergent behavior.
>
> If I publish, it advances the field. Others build on it.
> If I delay, I study it more. But someone else might find it first. And they might not be careful."

---

### Part B: Struggle & Vulnerability (Nodes 26-30)

**Template:**
```typescript
// Nodes 26-28: Character tries, struggles, fails (or nearly fails)
{
  speaker: 'Character Name',
  content: [{
    text: "I tried [their approach to the dilemma]. It didn't work.",
    emotion: 'defeated' | 'exhausted'
  }, {
    text: "[Specific consequence of their choice]",
    pause: 1000
  }, {
    text: "[Admission of fear, doubt, insecurity - REAL vulnerability]"
  }]
}

// Nodes 29-30: Player provides support or insight
// Character doesn't need solutions - needs to be heard
```

**Vulnerability Principles:**
- Character admits failure, fear, or breaking point
- Not performative - genuinely struggling
- Player's role: confidant, not fixer
- Trust reaches 8-9 (deepest relationship)

**Examples:**

**Maya (Pre-med):**
> "I failed my anatomy practical. First time I've ever failed anything.
> I studied 60 hours. I know the material. But when I stood at that cadaver, I froze.
>
> What if I'm not cut out for this? What if I'm only doing this because everyone expects it?"

**Sofia (Game Developer):**
> "I self-published. Game launched. Got review-bombed by trolls. Barely broke even.
> I'm exhausted and broke.
>
> What if art that matters will always offend someone? If nobody's uncomfortable, am I saying anything real?"

**Luis (Vertical Farm):**
> "I burned the floor. Kids didn't eat fresh greens for a month.
> But I protected the rest of the farm.
>
> Every choice has a cost. How do you know you chose right?"

---

**Node 30: End of Challenge** (Trust 8-9) **[SESSION BOUNDARY]**
- Character sits with the struggle
- No neat resolution yet
- Platform announcement: "Final call for the 10:45 to Insight Avenue."

---

## Act 4: Insight (Nodes 31-35)

### Purpose
Resolution, character growth, pattern crystallization, emotional payoff

### Part A: Unexpected Moment (Nodes 32-34)

**Purpose:** Humanize professional, show why work matters beyond money/status

**Template:**
```typescript
// Node 32: The Unexpected Moment
{
  speaker: 'Character Name' | 'Other Person',
  content: [{
    text: "[Small gesture or observation that reveals deeper meaning]"
  }, {
    text: "[Connection between professional work and human impact]",
    emotion: 'moved' | 'surprised' | 'grateful'
  }, {
    text: "[Character realizes something they didn't know they needed to hear]"
  }]
}
```

**Unexpected Moment Principles:**
- Often involves a relationship (patient, student, colleague, user)
- Small gesture, big meaning
- Connects work to life/identity
- Not preachy - just true
- Character didn't see it coming

**Examples:**

**Dr. Amara (AI Diagnostician):**
> A patient's daughter catches Amara in the hallway.
>
> "My mom says you're the one who found it early. The AI missed it."
>
> Amara: "The AI... helped narrow things down."
>
> "She says you looked at the scan for twenty minutes. That you saw her, not just the image."

**Dr. Priya (Precision Medicine):**
> A patient brings Priya a photo.
>
> "This is my granddaughter. She's three.
> You gave me two extra years with her.
> I don't need you to cure me. I needed you to give me this."

**Maya (Robotics Integration):**
> Maya finds a night shift worker talking to Robot 4.
>
> "She doesn't judge me. Doesn't care if I'm slow. Just waits."
>
> Maya: "It's... a robot."
>
> "I know. That's why."

**Aisha (Climate Data):**
> A city planner calls Aisha after the meeting.
>
> "I believe you. I've lived here 40 years. I've seen the tides change.
> But I can't sell 'abandon the waterfront' to people who've lived here their whole lives.
> Help me find a different story."

**Zara (XR Designer):**
> User testing session, memory reconstruction prototype.
> User is reliving their grandmother's kitchen (dementia care).
> They start crying. Happy? Sad? Both?
>
> After: "I haven't remembered her face that clearly in five years. Thank you."

---

### Part B: Resolution (Node 35)

**Template:**
```typescript
// Node 35: Resolution & Pattern Crystallization
{
  speaker: 'Character Name',
  content: [{
    text: "[Character synthesizes their journey - what they learned]"
  }, {
    text: "[Decision or commitment based on self-knowledge]"
  }, {
    text: "[Acknowledgment of player's role/support]",
    emotion: 'grateful' | 'resolved'
  }, {
    // META: If player has internalized relevant identity
    text: "[Character notices player's pattern and reflects it back]"
  }],
  choices: [
    {
      text: '"Thank you for sharing this with me."',
      pattern: 'helping',
      nextNodeId: 'character_epilogue_1'
    },
    {
      text: '"What happens next for you?"',
      pattern: 'exploring',
      nextNodeId: 'character_epilogue_2'
    }
  ]
}
```

**Resolution Principles:**
- Character makes choice based on journey
- Not "happily ever after" - honest about what's next
- Thanks player authentically
- If player internalized relevant pattern, character notices
- Trust reaches 10 (full confidant)

**Examples:**

**Maya (Pre-med):**
> "I talked to my anatomy professor. I'm retaking the practical.
> But more than that... I asked myself why I froze.
>
> I DO want to be a doctor. Not because of my parents.
> Because when I see someone in pain, I can't not help. That's who I am.
>
> I'm staying at UAB. Not because I'm scared of Hopkins.
> Because I want to serve my community. That's MY dream."

**Elena (AI Safety):**
> "I held the publication. Studied it for three more months.
> Found two more emergent behaviors we didn't expect.
>
> Someone else published first. But they cited my concerns.
> The field moved forward carefully because we took the time.
>
> That's the work. Not always being first. Being responsible."

**Marcus (Geriatric Care):**
> "Mrs. Chen stayed in her house. We got her home care.
> She fell last month. But she recovered at home.
> Her son thanked me. Said his mom taught him that independence matters.
>
> Not every story ends the way we want. But it can still be her story."

---

## Pattern-to-Choice Mapping

### Four-Choice Structure (Used in Crossroads Scenes)

Every crossroads should offer **4 choices**, each mapping to a different pattern or pattern combination:

| Choice Type | Pattern | Example Phrasing |
|-------------|---------|------------------|
| **Analytical** | analytical | "What does the data say?" / "Walk me through the logic" / "What are the actual numbers?" |
| **Helping** | helping | "What do they need?" / "How does this affect people?" / "Who's impacted most?" |
| **Exploring** | exploring | "What are we missing?" / "Is there another way?" / "What questions should we ask?" |
| **Building/Patience** | building or patience | "What can we build?" / "Let's take time to..." / "What's the next step?" |

### Three-Choice Structure (Used in Most Nodes)

Standard nodes can use 3 choices for pacing variety:

| Choice Type | Pattern | When to Use |
|-------------|---------|-------------|
| **Observant** | analytical | Early trust, surface questions |
| **Supportive** | helping | Mid trust, offering help |
| **Curious** | exploring | Any trust, asking questions |
| **Patient** | patience | High trust, creating space |
| **Action** | building | Mid-high trust, suggesting solutions |

---

## Quality Checklist

Before shipping any character arc, verify:

### ✅ Structure
- [ ] 35 nodes total (Introduction 10, Crossroads 10, Challenge 10, Insight 5)
- [ ] 3 session boundaries (nodes 10, 20, 30)
- [ ] Platform announcements at each boundary
- [ ] Clear act transitions

### ✅ Pattern Balance
- [ ] All 5 patterns represented across the arc
- [ ] 2-3 dominant patterns for this character (60-80% of choices)
- [ ] Crossroads scene has 4 choices (one per relevant pattern)
- [ ] No pattern appears <10% or >70%

### ✅ Trust Progression
- [ ] Node 1: Trust 0 (accessible, inviting)
- [ ] Node 10: Trust 2-3 (earned surface connection)
- [ ] Node 20: Trust 5-6 (deeper sharing unlocked)
- [ ] Node 30: Trust 8-9 (vulnerability, confidant status)
- [ ] Node 35: Trust 10 (full relationship)

### ✅ Four-Part Content
- [ ] Crossroads scene (meaningful decision, 4 choices, no right answer)
- [ ] Pressure test (time-compressed, multiple demands, reveals priorities)
- [ ] Ethical dilemma (values conflict, professional + personal stakes)
- [ ] Unexpected moment (humanizing beat, emotional resonance)

### ✅ Character Voice
- [ ] Consistent speech patterns throughout
- [ ] Uses professional's actual phrases (from interview)
- [ ] Distinct from other characters
- [ ] Readable aloud without awkwardness

### ✅ Replayability
- [ ] Different choices lead to different branches
- [ ] High-trust vs low-trust alternate paths
- [ ] Meta-commentary if player has internalized relevant identity
- [ ] Easter eggs for returning players

---

## AI Prompt Template (For Content Pipeline)

When using AI to generate character arcs from professional interviews:

```typescript
export const CHARACTER_ARC_PROMPT = `
You are a narrative designer for Lux Story.

Transform this professional interview into a 35-node character arc following this structure:

**ACT 1: INTRODUCTION (Nodes 1-10)**
- Hook (immediate intrigue)
- Context (who, what, where - show don't tell)
- Surface conflict (relatable problem)
- Pattern introduction (deeper themes)
- Bridge to Act 2

**ACT 2: CROSSROADS (Nodes 11-20)**
- Crossroads scene (nodes 11-14): Key decision, 4 choices (one per pattern), no right answer
- Pressure test (nodes 15-18): Time-compressed urgent decisions, multiple demands, reveals priorities
- Example pressure test: "You have 3 crises, 1 hour, can handle one. Which?"

**ACT 3: CHALLENGE (Nodes 21-30)**
- Ethical dilemma (nodes 21-25): Professional + personal stakes, values conflict
- Struggle (nodes 26-30): Character tries, fails, admits vulnerability

**ACT 4: INSIGHT (Nodes 31-35)**
- Unexpected moment (nodes 32-34): Small gesture reveals why work matters emotionally
- Resolution (node 35): Character decision, pattern crystallization, player acknowledgment

**REQUIREMENTS:**
1. Character voice: Use professional's actual phrases from interview
2. Four choices in crossroads: Analytical, Helping, Exploring, Building/Patience
3. Pressure test: Timed, multiple simultaneous demands, limited resources
4. Unexpected moment: Relationship-based (patient, student, colleague), not preachy
5. Pattern balance: 2-3 dominant patterns, all 5 represented
6. Trust progression: 0 → 3 → 6 → 9 → 10
7. Session boundaries: Nodes 10, 20, 30 with platform announcements

Output format: JSON matching CharacterArcData schema
`
```

---

## Examples by Career Type

### Healthcare: High Helping + Patience
- Crossroads: Medical decision (treatment A vs B, both valid)
- Pressure test: Triage (multiple patients, limited time)
- Ethical dilemma: Cost vs care, insurance vs treatment
- Unexpected moment: Patient/family gratitude for presence, not just skill

### Technology: High Analytical + Building
- Crossroads: Technical decision (ship now vs perfect later, new feature vs security)
- Pressure test: System failures (multiple alerts, solo on-call)
- Ethical dilemma: Privacy vs utility, open source vs commercial
- Unexpected moment: User finds meaning in your tool you didn't intend

### Sustainability: High Patience + Exploring
- Crossroads: Environmental decision (protect ecosystem vs community jobs)
- Pressure test: Resource allocation (grants, projects, limited funding)
- Ethical dilemma: Perfect vs practical, incremental vs transformative
- Unexpected moment: Community member validates long-term thinking

### Creative: High Building + Exploring
- Crossroads: Artistic decision (commercial success vs integrity)
- Pressure test: Deadline crunch (quality vs timeline)
- Ethical dilemma: Attribution, collaboration, AI assistance
- Unexpected moment: Audience finds personal meaning in your work

### Trades: High Building + Patience
- Crossroads: Craftsmanship decision (speed vs quality, automation vs hands-on)
- Pressure test: Job site crisis (safety vs deadline, quality vs budget)
- Ethical dilemma: Certification standards, training struggling student
- Unexpected moment: Apprentice masters skill, client uses work daily for years

---

**Next Steps:**
1. Use these templates when creating Station 2-5 characters
2. Update Content Creation Formula doc to reference these templates
3. Train AI pipeline with enhanced prompts including all 4 parts
4. Review existing Station 1 characters against this checklist

---

*"Show the work. Show the person. Show why it matters."*
