# Gemini Implementation Prompt: Execute Narrative Improvements

## Your Role

You are now a **narrative surgeon**, not an architect. You have been given:
1. A ruthlessly critical analysis of your previous work (6.5/10 overall rating)
2. Specific rewrite examples demonstrating the quality standard required
3. Concrete implementation targets for 4 major improvement areas

Your job is to **execute these improvements** with surgical precision, matching the tone, depth, and craft demonstrated in the rewrite examples.

---

## Context: What Went Wrong

### Critical Analysis Summary (from previous review):

**Overall Rating: 6.5/10**

**Character Ratings:**
- Kai (Data Privacy Lawyer): 4.5/10 - Generic voice, abstract motivations
- Rohan (Cybersecurity IR): 4/10 - Action-movie stereotype, no emotional depth
- Silas (Renewable Energy): 4/10 - TED Talk voice, missing human stakes

**Critical Weaknesses Identified:**
1. **Voice Homogenization**: All characters sound identical (rhetorical questions, technical jargon, cynical tone)
2. **No Real Failure States**: All choices lead to success with cosmetic variation
3. **Generic "SYSTEM" Voice**: Technical interfaces break immersion
4. **Isolated Characters**: No cross-references, no shared universe
5. **Shallow Stakes**: Boredom vs. life/death (compared to Marcus/Tess/Yaquin)
6. **Missing Personal Wounds**: Characters have jobs, not traumas that drive them

**Benchmark Comparison:**
- Marcus (ECMO Specialist): 8.5/10 - Deep backstory, moral weight, authentic medical tension
- Tess (Crisis Manager): 8/10 - Urgent scenarios, genuine ethical dilemmas
- Yaquin (Urban Planner): 7.5/10 - Idealism vs. pragmatism conflict

**Your Task:** Bring Kai, Rohan, and Silas UP to Marcus/Tess/Yaquin quality level.

---

## Implementation Targets

You will implement **4 major improvements** for each character (Kai, Rohan, Silas):

### 1. CHARACTER DEPTH REWRITES
### 2. PROPER FAILURE STATES
### 3. PERSONALIZED SYSTEM UI
### 4. CROSS-REFERENCE DIALOGUE

Each section below provides:
- ❌ **BEFORE**: Your original generic version
- ✅ **AFTER**: The quality standard to match
- 🎯 **Implementation Instructions**: Exactly what to code

---

## PART 1: CHARACTER DEPTH REWRITES

### Target: Replace generic introductions with soul-driven backstories

---

### 🔧 **KAI (Data Privacy Lawyer)**

#### ❌ BEFORE (Generic - 4.5/10):
```typescript
{
  id: 'kai_intro',
  speaker: 'Kai',
  content: `"Privacy isn't abstract—it's about power. Who gets to watch, who gets to hide, and who decides the rules."`
}
```

**Problems:**
- LinkedIn post voice
- No personal investment
- Abstract philosophy without grounding
- No vulnerability

#### ✅ AFTER (Soul-Driven - 8/10):
```typescript
{
  id: 'kai_intro_rewrite',
  speaker: 'Kai',
  content: `"You know what keeps me up at night? Not the lawsuits. Not the regulatory fines."

*Kai's jaw tightens slightly*

"It's the woman who called me last month. Her ex used a stalking app—legal at the time—to track her for two years. Every grocery store. Every friend's house. Every shelter she tried to hide in."

*A beat of silence*

"She asked me why the law didn't protect her. And I had to tell her the truth: because we write the rules *after* the damage is done. I'm trying to change that. But legislation moves like glaciers, and surveillance moves like wildfire."`,
  choices: [
    {
      text: 'That must be incredibly frustrating',
      next: 'kai_frustration_response',
      pattern: 'helping'
    },
    {
      text: 'How do you fight a battle you\'re always losing?',
      next: 'kai_strategy_discussion',
      pattern: 'analytical'
    }
  ]
}
```

**What Changed:**
- ✅ Concrete victim (stalking app, 2 years of tracking)
- ✅ Emotional vulnerability ("keeps me up at night")
- ✅ Voice distinction (short sentences, controlled emotion)
- ✅ Real stakes (woman in shelters, not abstract privacy)
- ✅ Career authenticity (legislation vs. surveillance speed mismatch)

#### 🎯 IMPLEMENTATION INSTRUCTIONS FOR KAI:

**File:** `/content/kai-dialogue-graph.ts`

**Action:** Find the earliest introduction node where Kai explains his work. Replace generic "privacy is power" philosophy with:

1. **Opening hook**: Personal question ("You know what keeps me up at night?")
2. **Concrete case**: Stalking victim, 2-year tracking, shelters
3. **Emotional reveal**: Why the law failed her
4. **Character wound**: "We write rules after damage is done"
5. **Voice markers**: Short sentences, jaw tightening, controlled pauses

**Node ID to Replace:** `kai_intro` or similar early exposition node

**Preserve:** Any existing choice patterns (analytical, helping, building)

**Add:** Physical descriptions (`*Kai's jaw tightens*`, `*A beat of silence*`)

---

### 🔧 **ROHAN (Cybersecurity Incident Responder)**

#### ❌ BEFORE (Generic - 4/10):
```typescript
{
  id: 'rohan_intro',
  speaker: 'Rohan',
  content: `"Security isn't about prevention—it's about response. How fast can you think when everything's on fire?"`
}
```

**Problems:**
- Action-movie cliché
- Adrenaline-junkie stereotype
- No origin story
- Missing psychological toll

#### ✅ AFTER (Soul-Driven - 8/10):
```typescript
{
  id: 'rohan_intro_rewrite',
  speaker: 'Rohan',
  content: `"I used to work at a hospital. Not tech—security. The kind where you check IDs and walk night shifts."

*Rohan's fingers drum absently on the table*

"Then ransomware hit. Every screen went red. Ventilators, med pumps, patient records—all locked. And I'm standing there with a walkie-talkie and a flashlight like an idiot."

*He laughs, but it's hollow*

"Three people died waiting for transfers to other facilities. Not because doctors failed. Because some script kiddie in Eastern Europe wanted Bitcoin."

*His voice hardens*

"So yeah, I learned to code. I learned to fight back. But every time I get that 3 AM alert? I'm back in that hallway, watching the screens go dark, knowing I can't do a damn thing."

*A pause*

"Until now."`,
  choices: [
    {
      text: 'You carry that with you every day',
      next: 'rohan_survivor_guilt',
      pattern: 'helping'
    },
    {
      text: 'Is that why you\'re so aggressive in incident response?',
      next: 'rohan_methodology',
      pattern: 'analytical'
    }
  ]
}
```

**What Changed:**
- ✅ Origin story (hospital security → ransomware → career pivot)
- ✅ Survivor's guilt (3 deaths, "watching screens go dark")
- ✅ Class consciousness (walkie-talkie vs. elite hackers)
- ✅ Voice distinction (choppy sentences, dark humor, controlled rage)
- ✅ Stakes (death is real, not abstract "data loss")

#### 🎯 IMPLEMENTATION INSTRUCTIONS FOR ROHAN:

**File:** `/content/rohan-dialogue-graph.ts`

**Action:** Replace earliest introduction/motivation node with:

1. **Origin story**: Hospital security guard, ransomware attack
2. **Traumatic event**: 3 deaths from locked systems
3. **Emotional wound**: Survivor's guilt, "screens go dark"
4. **Career pivot**: Learned to code as revenge/redemption
5. **Voice markers**: Hollow laugh, fingers drumming, voice hardening

**Node ID to Replace:** `rohan_intro` or similar

**Preserve:** Technical accuracy of cybersecurity scenarios

**Add:** Physical tics (finger drumming, hollow laughs)

---

### 🔧 **SILAS (Renewable Energy Systems Designer)**

#### ❌ BEFORE (Generic - 4/10):
```typescript
{
  id: 'silas_intro',
  speaker: 'Silas',
  content: `"Renewable energy isn't just about saving the planet—it's about designing systems that actually work when the grid fails."`
}
```

**Problems:**
- TED Talk voice
- "Saving the planet" is vague and preachy
- No personal investment
- Missing human cost

#### ✅ AFTER (Soul-Driven - 8/10):
```typescript
{
  id: 'silas_intro_rewrite',
  speaker: 'Silas',
  content: `"My grandmother died in the Texas freeze of '21. Not from the cold—from the insulin that spoiled when the power went out for four days."

*Silas's voice is flat, controlled*

"She lived 30 minutes from a wind farm. Thousands of turbines, just sitting there frozen because the grid operators didn't weatherize the infrastructure. Not 'couldn't'—*didn't*. Too expensive."

*A pause*

"I'm an engineer, not an activist. I don't do protests or policy papers. But I can design microgrids that don't give up when it gets hard. Systems that keep the lights on when the 'too expensive' excuses start flying."

*He meets your eyes*

"So when people ask me why I care about renewable energy, I don't talk about carbon emissions. I talk about my grandmother's fridge, and the insulin inside it, and the fact that she died because someone decided resilience wasn't worth the investment."

*His voice drops*

"I'm making it worth the investment."`,
  choices: [
    {
      text: 'I\'m sorry for your loss',
      next: 'silas_grief_response',
      pattern: 'helping'
    },
    {
      text: 'How do you design systems that won\'t fail like that?',
      next: 'silas_technical_philosophy',
      pattern: 'analytical'
    }
  ]
}
```

**What Changed:**
- ✅ Personal tragedy (grandmother's death, Texas freeze)
- ✅ Specificity (insulin spoiling, wind turbines frozen, 4 days)
- ✅ Voice distinction (flat engineer's tone, controlled anger)
- ✅ Moral clarity (not "save planet"—save *people*)
- ✅ Career authenticity (microgrids, weatherization, resilience engineering)

#### 🎯 IMPLEMENTATION INSTRUCTIONS FOR SILAS:

**File:** `/content/silas-dialogue-graph.ts`

**Action:** Replace earliest introduction/motivation node with:

1. **Personal tragedy**: Grandmother's death, Texas freeze 2021
2. **Specific failure**: Insulin spoiled, wind turbines frozen, "too expensive"
3. **Character philosophy**: "Engineer, not activist"
4. **Emotional core**: Not carbon—grandmother's fridge
5. **Voice markers**: Flat voice, controlled pauses, meets your eyes

**Node ID to Replace:** `silas_intro` or similar

**Preserve:** Technical accuracy of renewable energy systems

**Add:** Physical stillness (engineer's controlled body language)

---

## PART 2: PROPER FAILURE STATES

### Target: Every scenario must have at least ONE path that leads to visible, consequential failure

**Current Problem:** All choices in your scenarios lead to success with cosmetic variation. This removes player agency and reduces emotional stakes.

**Solution:** Design failure states that:
1. Have VISIBLE consequences (not "you lost points")
2. Create HARDER paths forward (not game overs)
3. TEACH a skill principle through failure
4. Are REMEMBERED in later dialogue

---

### 🔧 **KAI: Data Breach Response Failure**

#### 🎯 IMPLEMENTATION INSTRUCTIONS:

**File:** `/content/kai-dialogue-graph.ts`

**Scenario:** Data breach notification decision

**Action:** Add TWO new failure path nodes:

**FAILURE PATH 1: Premature Notification**
```typescript
{
  id: 'kai_premature_notification_failure',
  speaker: 'Kai',
  content: `*Kai's expression darkens as the news alerts start rolling in*

"You sent the notification. 50,000 people just got an email saying their data 'may have been compromised' with zero specifics. No guidance. No confirmed scope."

*He pulls up Twitter on his phone*

"And now the speculation's started. Some security blogger is claiming it's Social Security numbers. A journalist is asking if credit card data was exposed. And we don't have answers because forensics isn't done."

*The notification sound won't stop*

"The CEO is furious. Legal is drafting a retraction, but you can't un-ring a bell. Class action lawyers are already circling."

**CONSEQUENCE**: Public panic, loss of executive trust
**LESSON**: Premature transparency without facts = chaos`,

  choices: [
    {
      text: 'Own the mistake—send a follow-up with what we DO know',
      next: 'kai_damage_control',
      pattern: 'helping',
      skillRevealed: 'Crisis communication under pressure'
    },
    {
      text: 'Go silent until forensics completes (might take days)',
      next: 'kai_trust_crisis',
      pattern: 'patience',
      skillRevealed: 'Strategic silence vs. transparency'
    }
  ],

  // STATE FLAGS
  onEnter: (gameState) => {
    gameState.flags.set('kai_lost_credibility', true)
    gameState.flags.set('kai_premature_notification', true)
  }
}
```

**FAILURE PATH 2: Analysis Paralysis**
```typescript
{
  id: 'kai_delayed_response_failure',
  speaker: 'Kai',
  content: `*Three days pass. Kai walks into your office with a legal notice*

"Congratulations. While you were waiting for the perfect forensic report, someone leaked it to TechCrunch."

*He drops a printout on your desk*

"'Anonymous source confirms 50,000 records breached, including Social Security numbers. Company remained silent for 72 hours.' We're now in violation of disclosure laws in California, New York, and the EU."

*His voice is ice*

"The story you wanted to control? It's being written by journalists and regulators now. And every hour we stayed silent just made it worse."

**CONSEQUENCE**: Regulatory fines, media narrative control lost
**LESSON**: Perfect information is the enemy of timely action`,

  choices: [
    {
      text: 'Issue emergency statement—apologize for delay',
      next: 'kai_apology_path',
      pattern: 'helping',
      skillRevealed: 'Damage control after regulatory failure'
    },
    {
      text: 'Lawyer up—fight the regulatory penalties',
      next: 'kai_legal_warfare',
      pattern: 'analytical',
      skillRevealed: 'Legal defense strategy'
    }
  ],

  // STATE FLAGS
  onEnter: (gameState) => {
    gameState.flags.set('kai_regulatory_violation', true)
    gameState.flags.set('kai_delayed_response', true)
  }
}
```

**Where to Insert:** After the initial breach discovery node where player chooses response strategy

**Critical:** Make sure at least ONE choice in `kai_breach_discovery` leads to these failure nodes

---

### 🔧 **ROHAN: Ransomware Incident Failure**

#### 🎯 IMPLEMENTATION INSTRUCTIONS:

**File:** `/content/rohan-dialogue-graph.ts`

**Scenario:** Ransomware system isolation

**Action:** Add failure path for wrong system isolation:

```typescript
{
  id: 'rohan_wrong_isolation_failure',
  speaker: 'Rohan',
  content: `*Alarms start blaring across the security dashboard*

"No. No no no—"

*Rohan's fingers fly across the keyboard*

"You isolated the file server. Good instinct. Except the ransomware wasn't spreading from the file server—it was spreading from the BACKUP server. And by isolating the file server, you just cut off our only clean copy of the data."

*He spins his monitor toward you*

"Encryption is at 47% and accelerating. We have maybe 10 minutes before every backup is corrupted."

*His voice drops*

"We have to pay the ransom now. There's no other option."

**CONSEQUENCE**: Data loss, ransom payment becomes ONLY choice
**LESSON**: Incident response isn't about speed—it's about accuracy`,

  choices: [
    {
      text: 'Pay the ransom—we have no other choice now',
      next: 'rohan_ransom_payment',
      pattern: 'helping',
      skillRevealed: 'Negotiating with ransomware operators'
    },
    {
      text: 'Try to manually extract data before encryption completes',
      next: 'rohan_desperate_recovery',
      pattern: 'analytical',
      skillRevealed: 'High-pressure data recovery'
    }
  ],

  // STATE FLAGS
  onEnter: (gameState) => {
    gameState.flags.set('rohan_data_loss', true)
    gameState.flags.set('rohan_wrong_isolation', true)
  }
}
```

**Where to Insert:** After initial ransomware detection, if player chooses "Isolate file server immediately"

**Critical:** The FAST choice should lead to this failure (teaches "speed without accuracy = disaster")

---

### 🔧 **SILAS: Microgrid Priority Failure**

#### 🎯 IMPLEMENTATION INSTRUCTIONS:

**File:** `/content/silas-dialogue-graph.ts`

**Scenario:** Hurricane microgrid power allocation

**Action:** Add failure path for wrong priority:

```typescript
{
  id: 'silas_microgrid_failure',
  speaker: 'Silas',
  content: `*The community center's lights flicker and die*

"The microgrid failed."

*Silas's voice is flat, emotionless—the engineer's mask firmly in place*

"You prioritized the community center because it's a shelter. Smart call on paper. Except you didn't account for the medical clinic two blocks over running on the same transformer."

*He pulls up a map*

"Dialysis machines. Oxygen concentrators. All offline. The clinic's backup generator has 30 minutes of fuel, and the roads are flooded."

*A long pause*

"This is what I meant about systems thinking. You can't just pick the 'most important' building. You have to map the dependencies."

**CONSEQUENCE**: Medical emergency, lives at risk, community trust shaken
**LESSON**: Renewable systems require NETWORK thinking, not priority lists`,

  choices: [
    {
      text: 'Reroute power from the community center to the clinic',
      next: 'silas_hard_choice',
      pattern: 'analytical',
      skillRevealed: 'Emergency load rebalancing'
    },
    {
      text: 'Send emergency responders to evacuate clinic patients',
      next: 'silas_evacuation_risk',
      pattern: 'helping',
      skillRevealed: 'Crisis coordination across systems'
    }
  ],

  // STATE FLAGS
  onEnter: (gameState) => {
    gameState.flags.set('silas_medical_crisis', true)
    gameState.flags.set('silas_priority_failure', true)
  }
}
```

**Where to Insert:** After initial power allocation decision, if player chooses "Community center first"

**Critical:** The emotionally appealing choice (shelter = people) should lead to this failure (teaches systems complexity)

---

## PART 3: PERSONALIZED SYSTEM UI

### Target: Eliminate ALL instances of generic "SYSTEM:" voice. Every technical interface must be narrated by the character.

**Current Problem:** Your scenarios use neutral "SYSTEM:" prompts for technical decisions. This breaks immersion and makes all scenarios feel identical.

**Solution:** Filter every technical display through character personality and professional formatting.

---

### 🔧 **KAI: Legal Case Management Interface**

#### ❌ BEFORE (Generic):
```
SYSTEM: Review case file
SYSTEM: Evidence analysis complete
SYSTEM: Recommendation generated
```

#### ✅ AFTER (Character-Driven):

#### 🎯 IMPLEMENTATION INSTRUCTIONS:

**File:** `/content/kai-dialogue-graph.ts`

**Action:** Replace ANY node that shows technical data with character-narrated version:

```typescript
{
  id: 'kai_breach_analysis_interface',
  speaker: 'Kai',
  content: `**CASE FILE: DataCorp v. Users (Potential Class Action)**

*Kai slides a tablet across the table*

"Here's what we're working with:"

───────────────────────────
**EXPOSED DATA (Confirmed)**
├─ 50,000 user records
├─ Email addresses (100%)
├─ Purchase history (100%)
└─ SSNs (Status: UNKNOWN - forensics pending)

**LEGAL EXPOSURE**
├─ GDPR (EU users): €20M or 4% revenue
├─ CCPA (CA users): $750 per user = $37.5M
├─ Class action (projected): $50-200M
└─ Criminal liability: TBD

**TIME REMAINING**
└─ 68 hours until mandatory disclosure
───────────────────────────

*He taps the SSN line*

"Everything hinges on this. If Social Security numbers were exposed, we're in federal territory. If not, we might contain it to civil penalties."

*His eyes narrow*

"What's your call?"`,

  choices: [
    {
      text: 'Assume worst case—treat it as SSN breach now',
      next: 'kai_conservative_strategy',
      pattern: 'analytical',
      skillRevealed: 'Risk mitigation in legal uncertainty'
    },
    {
      text: 'Wait for forensics—don\'t escalate prematurely',
      next: 'kai_measured_strategy',
      pattern: 'patience',
      skillRevealed: 'Evidence-based legal decision making'
    }
  ]
}
```

**Key Elements:**
- Legal case name format
- Kai's voice frames the data ("Here's what we're working with")
- ASCII tree structure for visual hierarchy
- Real dollar amounts and penalties
- Character actions (`*slides tablet*`, `*taps the SSN line*`)

**Find and Replace:** Search for any `SYSTEM:` in Kai's dialogue graph and rewrite with this pattern

---

### 🔧 **ROHAN: Incident Response Terminal**

#### ❌ BEFORE (Generic):
```
SYSTEM: Threat detected
SYSTEM: Choose response action
SYSTEM: Analysis in progress
```

#### ✅ AFTER (Character-Driven):

#### 🎯 IMPLEMENTATION INSTRUCTIONS:

**File:** `/content/rohan-dialogue-graph.ts`

**Action:** Replace technical displays with live terminal feed:

```typescript
{
  id: 'rohan_ransomware_terminal',
  speaker: 'Rohan',
  content: `*Rohan's screens light up red. He doesn't look away from the terminal*

"Talk to me while I work."

\`\`\`
[02:47:13] ALERT: Ransomware signature detected
[02:47:15] Source: backup-srv-02.internal
[02:47:18] Encryption: AES-256 | Spreading via SMB
[02:47:22] Affected systems:
  ├─ fileserver-01    [LOCKED]
  ├─ fileserver-02    [LOCKED]
  ├─ backup-srv-01    [ENCRYPTING - 23%]
  └─ database-prod    [VULNERABLE]

[02:47:30] Spread rate: 12% per minute
[02:47:30] Estimated time to full compromise: 6 minutes
\`\`\`

*His jaw clenches*

"We've got two plays here. Aggressive isolation—cut the network, stop the spread, but kill all active connections. Or surgical extraction—pull the database offline clean, but risk the ransomware jumping to other systems while we work."

*He finally glances at you*

"What's it gonna be? Fast and dirty, or precise and risky?"`,

  choices: [
    {
      text: 'Aggressive isolation—cut everything NOW',
      next: 'rohan_aggressive_isolation',
      pattern: 'analytical',
      skillRevealed: 'Decisive incident response under pressure'
    },
    {
      text: 'Surgical extraction—save the database first',
      next: 'rohan_surgical_extraction',
      pattern: 'patience',
      skillRevealed: 'Risk-tolerant precision in IR'
    }
  ]
}
```

**Key Elements:**
- Terminal timestamps and system names
- Real percentages and time pressure
- Rohan's clipped voice ("Talk to me while I work")
- Technical accuracy (AES-256, SMB, system names)
- Character actions (`*jaw clenches*`, `*glances at you*`)

**Find and Replace:** Search for any `SYSTEM:` in Rohan's dialogue graph and rewrite with terminal feed pattern

---

### 🔧 **SILAS: Energy Grid Monitoring Dashboard**

#### ❌ BEFORE (Generic):
```
SYSTEM: Grid status updated
SYSTEM: Power allocation required
SYSTEM: Select priority buildings
```

#### ✅ AFTER (Character-Driven):

#### 🎯 IMPLEMENTATION INSTRUCTIONS:

**File:** `/content/silas-dialogue-graph.ts`

**Action:** Replace grid displays with engineer's CAD visualization:

```typescript
{
  id: 'silas_microgrid_dashboard',
  speaker: 'Silas',
  content: `*Silas pulls up a grid visualization on the wall monitor*

"This is the microgrid we built for the coastal district. Hurricane's hitting in 3 hours. Main grid will fail—it always does."

┌─────────────────────────────────┐
│ MICROGRID STATUS: OPERATIONAL   │
├─────────────────────────────────┤
│ Solar Array:      0 kW (night)  │
│ Battery Storage:  847 kWh       │
│ Wind Turbines:    142 kW        │
│ Diesel Backup:    OFFLINE       │
├─────────────────────────────────┤
│ TOTAL CAPACITY:   142 kW        │
│ PROJECTED DEMAND: 380 kW        │
│ DEFICIT:          238 kW (63%)  │
└─────────────────────────────────┘

**CONNECTED BUILDINGS**
├─ Community Center    [120 kW] ← Shelter (200 people)
├─ Medical Clinic      [90 kW]  ← Dialysis, O2, ICU
├─ Fire Station        [45 kW]  ← Emergency response
├─ School              [80 kW]  ← Backup shelter
└─ Residential         [45 kW]  ← 43 homes

*He taps the deficit line*

"We don't have enough power for everyone. The battery will drain in 4 hours if we try. So we have to choose."

*His voice is completely flat*

"This is the part they don't put in the renewable energy brochures."`,

  choices: [
    {
      text: 'Prioritize medical clinic—lives over comfort',
      next: 'silas_medical_priority',
      pattern: 'helping',
      skillRevealed: 'Triage engineering under scarcity'
    },
    {
      text: 'Distribute power evenly—reduce load across all buildings',
      next: 'silas_shared_scarcity',
      pattern: 'analytical',
      skillRevealed: 'Systems equity vs. optimization'
    },
    {
      text: 'Rotate power in 2-hour blocks—everyone gets something',
      next: 'silas_rotation_strategy',
      pattern: 'building',
      skillRevealed: 'Dynamic load balancing'
    }
  ]
}
```

**Key Elements:**
- Engineering box diagram with kW metrics
- Silas's detached voice ("it always does")
- Real constraints (63% deficit, 4-hour battery drain)
- Moral weight embedded in technical display
- Character actions (`*taps the deficit line*`)

**Find and Replace:** Search for any `SYSTEM:` in Silas's dialogue graph and rewrite with dashboard pattern

---

## PART 4: CROSS-REFERENCE DIALOGUE

### Target: Create at least 2 cross-references per character that unlock after completing other character arcs

**Current Problem:** Characters exist in isolation. No mention of each other's work or struggles.

**Solution:** Add conditional dialogue that appears ONLY if player has completed another character's arc.

---

### 🔧 **Cross-Reference Examples**

#### 🎯 IMPLEMENTATION INSTRUCTIONS:

**Files:** `/content/kai-dialogue-graph.ts`, `/content/rohan-dialogue-graph.ts`, `/content/silas-dialogue-graph.ts`

**Action:** Add conditional nodes that reference other characters

---

**KAI → MARCUS Reference:**
```typescript
{
  id: 'kai_marcus_reference',
  speaker: 'Kai',
  conditions: [
    {
      type: 'arc_completed',
      characterId: 'marcus',
      phase: 1
    },
    {
      type: 'relationship',
      characterId: 'kai',
      minTrust: 3
    }
  ],
  content: `*Kai reviews the breach report, then pauses*

"You worked with Marcus Chen at County General, right?"

*He doesn't wait for confirmation*

"I read about that ECMO case in the medical ethics journals. The one where he had to decide whether to pull resources from a stable patient to save someone with a 12% survival chance."

*Kai's expression is unreadable*

"Data breaches are like that. Except instead of one life vs. another, it's 50,000 people's privacy vs. the company's survival. And unlike Marcus, I don't get to see the patient's face. Just numbers in a spreadsheet."

*A bitter laugh*

"At least when he makes the wrong call, the consequences are immediate. I'll be in litigation for five years before I know if I destroyed lives or saved them."`,

  choices: [
    {
      text: 'The uncertainty must be exhausting',
      next: 'kai_vulnerability_discussion',
      pattern: 'helping'
    },
    {
      text: 'But your decisions affect more people—that\'s a different kind of power',
      next: 'kai_power_discussion',
      pattern: 'analytical'
    }
  ]
}
```

**Where to Insert:** Mid-arc, after player has built some trust with Kai

**Condition Check:** Use `gameState.characters.get('marcus')?.arcProgress >= 1`

---

**ROHAN → TESS Reference:**
```typescript
{
  id: 'rohan_tess_reference',
  speaker: 'Rohan',
  conditions: [
    {
      type: 'arc_completed',
      characterId: 'tess',
      phase: 1
    }
  ],
  content: `*Rohan isolates the infected server, then sits back heavily*

"You worked with Tess during the Metro flooding, didn't you?"

*He pulls up the incident timeline*

"I was watching the news coverage. The part where she had to choose between evacuating the low-lying districts or reinforcing the levees with limited resources."

*His fingers drum on the desk*

"That's what people don't get about incident response. It's not about 'solving' the problem—it's about **triage**. Who do you save when you can't save everyone?"

*The ransomware alert flashes again*

"Tess had to choose between neighborhoods. I have to choose between systems. Same math. Different stakes."

*He meets your eyes*

"She told me once that the worst part isn't making the call. It's living with the people you couldn't save."`,

  choices: [
    {
      text: 'Is that why you do this work? To save people you couldn\'t save before?',
      next: 'rohan_origin_deeper',
      pattern: 'helping'
    },
    {
      text: 'But you CAN save everyone if you work fast enough',
      next: 'rohan_idealism_challenge',
      pattern: 'building'
    }
  ]
}
```

**Where to Insert:** During active incident response, after initial triage decision

**Condition Check:** Use `gameState.characters.get('tess')?.arcProgress >= 1`

---

**SILAS → YAQUIN Reference:**
```typescript
{
  id: 'silas_yaquin_reference',
  speaker: 'Silas',
  conditions: [
    {
      type: 'arc_completed',
      characterId: 'yaquin',
      phase: 1
    }
  ],
  content: `*Silas studies the power distribution map in silence*

"Yaquin's community design would've prevented this, you know."

*He zooms out to show the neighborhood layout*

"Mixed-use zoning. The medical clinic, the shelter, the fire station—he'd have clustered them within a single microgrid zone. Not scattered across three separate transformers like this disaster."

*A rare moment of emotion cracks through*

"I went to his presentation last year. 'Resilient Communities Through Integrated Design.' Everyone clapped. City council said it was 'too expensive to implement.'"

*His voice hardens*

"And now we're here. Making Sophie's choices about who gets power during a hurricane because the infrastructure was designed for efficiency, not survival."

*He taps the deficit calculation*

"I can engineer around bad urban planning. But I can't fix the original sin of putting the medical clinic two miles from the emergency shelter."`,

  choices: [
    {
      text: 'Could you and Yaquin collaborate on future projects?',
      next: 'silas_collaboration_hope',
      pattern: 'building'
    },
    {
      text: 'Sounds like you\'re both fighting the same broken system',
      next: 'silas_systemic_analysis',
      pattern: 'analytical'
    }
  ]
}
```

**Where to Insert:** During microgrid crisis, after power allocation failure

**Condition Check:** Use `gameState.characters.get('yaquin')?.arcProgress >= 1`

---

## IMPLEMENTATION CHECKLIST

For each character (Kai, Rohan, Silas), you must implement:

### ✅ CHARACTER DEPTH (1 node per character)
- [ ] Kai: Replace intro with stalking victim backstory
- [ ] Rohan: Replace intro with hospital ransomware origin
- [ ] Silas: Replace intro with grandmother's death story

### ✅ FAILURE STATES (2 paths per character)
- [ ] Kai: Premature notification failure + Analysis paralysis failure
- [ ] Rohan: Wrong isolation failure + (add one more)
- [ ] Silas: Priority failure + (add one more)

### ✅ PERSONALIZED SYSTEM UI (all technical nodes)
- [ ] Kai: Replace ALL "SYSTEM:" with legal case file format
- [ ] Rohan: Replace ALL "SYSTEM:" with terminal feed format
- [ ] Silas: Replace ALL "SYSTEM:" with dashboard format

### ✅ CROSS-REFERENCES (2 per character minimum)
- [ ] Kai: Add Marcus reference + (one more)
- [ ] Rohan: Add Tess reference + (one more)
- [ ] Silas: Add Yaquin reference + (one more)

---

## QUALITY STANDARDS

Your implementation will be judged against these criteria:

### Voice Authenticity (8+/10 required)
- ✅ Each character has distinct verbal patterns
- ✅ Physical descriptions match personality (Kai's jaw, Rohan's fingers, Silas's flatness)
- ✅ No rhetorical questions unless character-appropriate
- ✅ Technical jargon used naturally, not as decoration

### Emotional Depth (8+/10 required)
- ✅ Personal wounds drive career choices
- ✅ Vulnerability shown through specific details (not abstract philosophy)
- ✅ Characters allowed to be contradictory, flawed, uncertain

### Stakes Authenticity (8+/10 required)
- ✅ Real consequences (deaths, lawsuits, regulatory fines)
- ✅ Specific numbers (50,000 records, 12% per minute, 63% deficit)
- ✅ Time pressure quantified (6 minutes, 68 hours, 4-hour battery)

### Educational Integration (8+/10 required)
- ✅ Skills revealed through failure, not lectures
- ✅ Career authenticity (real tools, real constraints, real terminology)
- ✅ Scenarios based on real events (Texas freeze, hospital ransomware, stalking apps)

---

## FINAL DIRECTIVE

You have been given:
1. ❌ **Your previous work** (generic, 4-4.5/10 quality)
2. ✅ **Quality standard examples** (soul-driven, 8/10 quality)
3. 🎯 **Exact implementation instructions** (what to change, where, how)

**Your mission:**
Execute these improvements with **surgical precision**. Match the tone, depth, and craft of the examples. Do not compromise. Do not water down. Do not revert to generic voice.

**Success criteria:**
- Character depth: 8+/10 (match Marcus/Tess/Yaquin)
- Failure states: Real consequences, not cosmetic
- System UI: Zero instances of generic "SYSTEM:" voice
- Cross-references: At least 2 per character, emotionally resonant

**Commit message format:**
```
Narrative Surgery: [Character] - [Improvement Type]

Examples:
- "Narrative Surgery: Kai - Backstory rewrite (stalking victim trauma)"
- "Narrative Surgery: Rohan - Failure states (wrong isolation path)"
- "Narrative Surgery: Silas - System UI (personalized dashboard)"
- "Narrative Surgery: All - Cross-reference dialogue"
```

**Estimated commits:** 12-15 total
**Estimated time:** 2-4 hours of focused implementation

---

## Begin Implementation

Start with **CHARACTER DEPTH** for all three (Kai, Rohan, Silas) in a single commit.
Then **FAILURE STATES** for all three.
Then **SYSTEM UI** for all three.
Finally **CROSS-REFERENCES**.

This approach ensures architectural consistency and makes review easier.

**Remember:** You are not writing new content. You are **executing surgical improvements** on existing work. Precision over creativity. Quality over quantity.

Go.
