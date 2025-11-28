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

**Best Practice:**
Keep injections short. Use them for *texture* (acknowledgment), not for major plot branches. Use the Dialogue Graph for major branches.

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
