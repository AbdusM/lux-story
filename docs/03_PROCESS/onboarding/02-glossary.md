# Lux Story Glossary

**Last Updated:** January 2026
**Purpose:** Game terminology for non-technical team members

---

## Core Game Concepts

### Grand Central Terminus
The magical realist train station that appears between who you were and who you're becoming. The central hub where all career exploration begins.

### Dialogue-Driven Gameplay
The game plays like a conversation—similar to games like Pokemon or Disco Elysium. Everything happens through text choices, not action buttons. Characters drive the experience.

---

## Player Progression Systems

### Patterns (5 types)
Behavioral patterns tracked through your choices. Think of them as "how you think" rather than personality types.

1. **Analytical** - Logic, data-driven decisions, systematic thinking
2. **Patience** - Taking time, careful consideration, long-term focus
3. **Exploring** - Curiosity, discovery-oriented, trying new things
4. **Helping** - Supporting others, empathy, service-focused
5. **Building** - Creating, constructive action, making things

**How they work:**
- Every choice you make reinforces one or more patterns
- Patterns unlock dialogue options when you reach certain levels
- Characters respond differently based on your pattern strengths

### Trust System (0-10 scale)
Measures your relationship with each character. Higher trust unlocks deeper conversations.

- **Trust 0-2**: Surface-level professional conversation
- **Trust 3-5**: Character begins to open up about their work
- **Trust 6**: Vulnerability arc unlocks (character shares deeper struggles)
- **Trust 7-10**: Deep mentorship, co-creation, genuine partnership

**How it changes:**
- Making thoughtful choices increases trust
- Choosing patterns that align with the character's values increases trust
- Rushing or surface-level engagement may slow trust growth

### Knowledge Flags
Internal markers that track what you've learned in the game. Think of them as "the game remembers what you know."

Examples:
- `maya_workshop_attended` - You participated in Maya's technical workshop
- `samuel_train_metaphor_explained` - Samuel explained the deeper meaning of trains
- `quinn_vulnerability_revealed` - Quinn opened up about past guilt

**Why they matter:**
- Characters reference things you've learned together
- Creates continuity and memory in conversations
- Prevents repeating information you already know

---

## Character Systems

### Loyalty Experience
A special deep-dive simulation unlocked at high trust with a character. Think of it as their "personal quest."

**Structure:**
- Only available at Trust 8+
- Multi-phase scenario that explores character's core struggle
- Your choices shape how the character resolves their challenge
- Rewards: Deepest insights, co-creation opportunities

### Consequence Echoes
When you make significant choices with one character, other characters may reference it later. The game world responds to your actions.

**Example:**
If you help Maya with a technical challenge, Devon might say: "I heard you helped Maya debug that system. That's the kind of thinking we need."

### Simulation Scenarios
Hands-on experiences where you practice career skills with a character mentor.

**Examples:**
- Quinn's "Ethical Loan" simulation - Practice financial decision-making
- Dante's "Authentic Pitch" - Learn to read audiences and adapt messaging
- Marcus's healthcare triage scenario - Balance urgency with care

**How they work:**
- Character guides you through realistic career challenge
- Your pattern strengths influence available approaches
- Immediate feedback shows consequences of choices

### Interrupt Windows
Brief moments when you can jump into another character's thought process or offer support unexpectedly.

**Types:**
- `connection` - Offering understanding
- `challenge` - Pushing back respectfully
- `silence` - Giving space to think
- `comfort` - Providing reassurance
- `grounding` - Bringing back to reality
- `encouragement` - Boosting confidence

**Why they matter:**
- Build trust faster than standard dialogue
- Show you're actively listening
- Create memorable moments of connection

---

## Content Structure

### Dialogue Nodes
Individual conversation moments. Each node has:
- Speaker (who's talking)
- Content (what they say)
- Emotion (how they feel)
- Choices (what you can respond)

**Total in game:** 1,775 dialogue nodes across 20 characters

### Pattern Reflections
Alternative dialogue text that appears when you have high levels in specific patterns.

**Example:**
- **Standard text**: "This is a complex problem."
- **Analytical reflection** (Analytical 5+): "This is a complex problem. You process things systematically—I can see it in how you approached this."

**Why they exist:**
Makes the game feel personalized to your thinking style.

### Vulnerability Arcs
Special dialogue sequences (unlocked at Trust 6+) where characters share deeper struggles and fears.

**Structure:**
- Gates behind trust threshold
- Reveals character's "ghost" (past trauma) or "lie they believe"
- Offers choices for how to respond supportively
- Permanently changes relationship dynamic

---

## Game Design Terms

### ISP (Infinite Story Possibilities)
Design philosophy that the game should feel endless and responsive, even with finite content.

**How achieved:**
- Pattern reflections create personalized dialogue
- Consequence echoes make world feel alive
- Simulation scenarios adapt to player strengths
- 572 cataloged features create depth

### PRD (Product Requirements Document)
The master vision document for what the game should be and do.

**Location:** `docs/03_PROCESS/50-isp-comprehensive-prd.md`

### God Mode
Developer tool for testing and verifying game systems. Not a player-facing feature.

**Purpose:**
- Jump to any character/trust level
- Test dialogue flows
- Verify pattern calculations
- Quality assurance

---

## Meta-Cognitive Systems

### Skills (54 total)
Specific career competencies that emerge from gameplay. More granular than patterns.

**Examples:**
- `active_listening` - Paying attention to what others really mean
- `systems_thinking` - Seeing how parts connect to wholes
- `conflict_resolution` - Navigating disagreements constructively
- `data_literacy` - Understanding and using data effectively

**How they work:**
- Tracked invisibly based on your choices
- Used by admin dashboard for career recommendations
- Not displayed to players during gameplay (no gamification)

### Emotions (59 total)
How characters feel during dialogue. Adds depth and subtext to conversations.

**Examples:**
- `wry` - Dry humor
- `vulnerable` - Opening up despite risk
- `knowing` - Wisdom from experience
- `conflicted` - Internal struggle

**Why they matter:**
- Guide voice actors for future audio
- Help writers maintain character consistency
- Create emotional variety in dialogue

---

## Technical Terms (For Context)

### Dialogue Graph
The structure of all conversations with a character. Think of it as a choose-your-own-adventure flowchart.

**Location:** `content/[character]-dialogue-graph.ts`

### Character State
What the game remembers about your relationship with each character.

**Includes:**
- Current trust level
- Pattern levels from interactions
- Knowledge flags unlocked
- Dialogue nodes visited

### Immutable State
Things that cannot change during gameplay (e.g., character definitions, pattern types, game rules).

### Derivative
Calculated information based on other data. Not stored directly, but computed when needed.

**Example:**
- Your "identity threshold" for a pattern is derived from your pattern level
- Career recommendations are derived from your skills and choices

---

## Common Abbreviations

- **NPC** - Non-Player Character (the 20 characters you interact with)
- **UI** - User Interface (how the game looks and responds)
- **UX** - User Experience (how the game feels to play)
- **QA** - Quality Assurance (testing to find bugs)
- **AAA** - Industry term for highest quality games

---

## Question: Pattern vs. Skill - What's the Difference?

**Patterns** = HOW you think (5 broad approaches)
- Visible to player
- Unlocks dialogue options
- Shapes how characters respond to you

**Skills** = WHAT you can do (54 specific competencies)
- Invisible during gameplay
- Used for career recommendations
- Emerges from accumulated choices

**Example:**
- Having high **Analytical pattern** means you approach problems logically
- Having high **data_literacy skill** means you're specifically good with data
- You might be analytical without being data-focused, or vice versa

---

## Question: What's a "Tier" for Characters?

Characters are organized by narrative priority:

- **Hub** - Samuel (always available, central guide)
- **Core** - Maya, Marcus, Kai, Rohan (primary career paths, deep content)
- **Secondary** - Devon, Tess, Yaquin, Grace, Elena, Alex, Jordan, Quinn, Nadia (additional depth)
- **Extended** - Silas, Asha, Lira, Zara, Dante, Isaiah (specialized paths, optional encounters)

**Tiers determine:**
- Number of dialogue nodes (Hub has most)
- Complexity of simulation scenarios
- When you encounter them in game

---

**Document Control**
- Created: January 2026
- Purpose: Game terminology for team onboarding
- Maintainer: Update when new systems or terminology added
