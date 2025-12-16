# Lux Story: Narrative Features Guide
*A comprehensive manual for writers and designers on using the "Ultrathink" engine.*

## 1. Visual Effects (The "Juice")
Make the text feel alive without leaving the chat interface.

### **Typography Voices**
The system automatically applies fonts based on `speaker`.
- **Samuel:** Serif (Warm, Storybook)
- **Maya:** Sans (Clean, Modern)
- **Devon:** Slab (Solid, Engineered)
- **System:** Mono (Terminal, Glitchy)

### **Inline Animations**
Use XML-style tags to animate specific words.
*   `<shake>TEXT</shake>`: Shakes vigorously (Fear, Earthquake).
*   `<jitter>TEXT</jitter>`: Subtle vibration (Cold, Nervous).
*   `<glitch>TEXT</glitch>`: Cyberpunk distortion (System Error, Corruption).
*   `<bloom>TEXT</bloom>`: Glowing pulse (Magic, Epiphany).

**Example:**
> "The system is <glitch>FAILING</glitch>. I'm <shake>terrified</shake>."

---

## 2. Dynamic Text Injection (Contextual Memory)
Reference past choices naturally within a sentence.

**Syntax:** `{{condition:Text If True|Text If False}}`

*   **Flag Check:** `{{met_maya:Since you know Maya,|You should meet Maya.}}`
*   **Trust Check:** `{{trust>5:I trust you with this.|I'm not sure yet.}}`
*   **Knowledge Check:** `{{knows_secret:Now that you know the truth...|I can't say more.}}`
*   **Pattern Check:** `{{analytical>=3:*Your pattern-recognition catches something.*|}}`
*   **Dominant Pattern:** `{{dominant_helping:*Your empathic instincts fire.*|}}`

### **Pattern Voice (Disco Elysium-style "Skills as Voice")**
Let the player's accumulated patterns "speak" at threshold moments:

```
"My parents are so proud.{{analytical>=3:

*Something catches your attention—she said 'my parents are proud,' not 'I am proud.'*|}}"
```

Available patterns: `analytical`, `helping`, `building`, `patience`, `exploring`
Supported operators: `>`, `>=`, `<`, `<=`, `=`, `==`

**Best Practice:**
Keep injections short. Use them for *texture* (acknowledgment), not for major plot branches. Use the Dialogue Graph for major branches.

### **Revisit Callbacks (Deep Memory)**
In revisit graphs, reference specific moments from the original arc to show characters remember *how* you helped them, not just *that* you helped:

```javascript
{
  nodeId: 'maya_revisit_welcome',
  speaker: 'Maya Chen',
  content: [{
    text: `Hey! It's so good to see you again.

I've been thinking about our conversation a lot.{{noticed_contradiction: You saw right through me that day—when I said my parents were proud, and you caught the thing I wasn't saying.|}}{{player_gave_space: The way you gave me room to breathe instead of pushing... that meant more than you know.|}}{{shared_parent_failure: When you opened up about your own family stuff, I realized I wasn't as alone as I thought.|}}`
  }]
}
```

**Available Knowledge Flags for Callbacks:**
*   Maya: `noticed_contradiction`, `player_gave_space`, `shared_parent_failure`, `challenged_expectations`, `knows_anxiety`, `knows_robotics`, `tried_parent_conversation`, `knows_biomedical_engineering`
*   Yaquin: `generous_refunds`, `credentialed_advisor`, `chose_cohort`, `chose_licensing`
*   Global: `yaquin_chose_practical`, `yaquin_chose_psych`, `yaquin_chose_course`, `yaquin_chose_membership`, `yaquin_chose_sponsorship`

**Best Practice:**
Use callbacks sparingly—one or two per revisit node maximum. The goal is a *moment of recognition*, not a recap of everything.

---

## 3. The Thought Cabinet (Internal State)
Reward players for consistent roleplaying with "Internalized Thoughts."

### **How it Works**
1.  **Trigger:** Add `thoughtId: 'thought-id'` to a node's `onEnter` property.
2.  **UI:** The player sees a "New Thought" notification.
3.  **Effect:** The thought appears in their slide-over cabinet.

### **Available Thoughts (Registry)**
*   `industrial-legacy`: "The Weight of Iron" (Respecting history/industry).
*   `green-frontier`: "The Green Frontier" (Nature/Growth).
*   `analytical-eye`: "Analytical Eye" (Systems thinking).
*   `community-heart`: "Community Heart" (People/Connection).

**Adding New Thoughts:**
Edit `content/thoughts.ts`. You must define a Title, Description, Icon, and Color.

---

## 4. Reactive Portraits
Avatars change expression based on `emotion` and `trust`.

**Usage:**
In dialogue nodes, set the `emotion` property:
```javascript
{
  text: "I can't believe it!",
  emotion: "surprised" // triggers 'surprised' avatar
}
```

**Supported Emotions:**
*   `happy`, `excited` (Smile)
*   `concerned`, `sad` (Frown/Worry)
*   `angry` (Serious/Scowl)
*   `surprised` (Wide eyes)
*   `neutral` (Default)

**Trust Override:**
If no emotion is set:
*   High Trust (>7) = Smiling default.
*   Low Trust (<3) = Frowning/Guarded default.

---

## 5. Workflow Example (Putting it all together)

**Scenario:** Samuel reveals a secret map.

**Node Definition:**
```javascript
{
  nodeId: "samuel_secret_map",
  speaker: "Samuel",
  content: [
    {
      text: "{{trust>7:Because you're family now|Because you helped Maya}}, I'll show you this.\n\nIt's the <bloom>Original Blueprint</bloom>.",
      emotion: "vulnerable"
    }
  ],
  onEnter: [
    { thoughtId: "industrial-legacy" } // Unlock thought
  ]
}
```

**Result:**
*   **Text:** If trust > 7: "Because you're family now..."
*   **Visual:** "Original Blueprint" glows.
*   **Avatar:** Samuel looks vulnerable (soft expression).
*   **Reward:** Player unlocks "The Weight of Iron" thought.

---

## 6. Floating Modules (State-Gated Interludes)
Narrative interludes that appear when state conditions are met, adding texture without modifying main graphs.

### **How it Works**
1.  **Define Module:** Create in `content/floating-modules.ts`
2.  **Trigger Condition:** State conditions (patterns, flags, trust)
3.  **Insert Point:** When to show (arc_transition, hub_return, pattern_threshold)
4.  **oneShot:** If true, only shows once per playthrough

### **Example Module:**
```javascript
{
  moduleId: 'analytical_awakening',
  speaker: 'Narrator',
  content: [{
    text: `*A quiet shift. You've started noticing the patterns between patterns.*

Not just what people say—but why. Not just the words—but the gaps between them.

Something in you has sharpened.`
  }],
  triggerCondition: { patterns: { analytical: { min: 8 } } },
  insertAfter: 'pattern_threshold',
  oneShot: true,
  priority: 10
}
```

### **Insert Points:**
*   `pattern_threshold`: When a pattern crosses a threshold value
*   `hub_return`: When returning to Samuel's hub
*   `arc_transition`: When transitioning between character arcs

### **Available Modules:**
*   Pattern awakening modules: `analytical_awakening`, `helper_recognition`, `builder_instinct`, `patient_wisdom`, `explorer_spirit`
*   Milestone modules: `first_arc_complete`, `three_arcs_complete`
*   Reflection modules: `maya_arc_reflection`, `high_trust_contrast`
