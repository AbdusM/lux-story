# **LUX STORY PRD**

Addendum: Product Extensions

*Competitive Analysis, Extended Character Roster, Design Systems, Implementation Status*

# **1\. Competitive Analysis**

LUX Story operates at the intersection of two markets: workforce assessment tools and narrative games. This creates both competitive challenges and unique positioning opportunities.

## **1.1 Workforce Assessment Competitors**

### **Pymetrics (now Harver)**

Neuroscience-based games measuring cognitive and emotional traits for hiring decisions.

* Strengths: Strong enterprise adoption, validated algorithms, bias-reduction claims  
* Weaknesses: Clinical feel, lacks narrative engagement, employer-facing (not career discovery)  
* LUX Story Advantage: Career discovery focus, narrative immersion, youth-friendly design

### **Traitify (Paradox)**

Visual-based personality assessment using image selection for quick profiling.

* Strengths: Fast completion (90 seconds), mobile-first, high completion rates  
* Weaknesses: Shallow assessment, obvious methodology, no narrative context  
* LUX Story Advantage: Deeper pattern revelation through extended engagement, hidden assessment layer

### **PathSource**

Career exploration app with assessments, job matching, and educational pathway recommendations.

* Strengths: Comprehensive career database, educational integration, free tier  
* Weaknesses: Traditional assessment format, low engagement, feels like homework  
* LUX Story Advantage: Entertainment-first approach, patterns emerge through play not questionnaires

## **1.2 Narrative Game Competitors**

### **Episode / Choices / Chapters**

Interactive story platforms with romance/drama focus and microtransaction monetization.

* Strengths: Proven mobile-first narrative engagement, massive user bases, established monetization  
* Weaknesses: Shallow choice consequences, pay-to-progress friction, no meaningful pattern tracking  
* LUX Story Advantage: Choices matter systemically, real-world career translation, educational partnerships

### **Disco Elysium (ZA/UM)**

Award-winning narrative RPG with skill-based internal dialogue and consequence-heavy storytelling.

* Strengths: Critical acclaim, innovative internal voice system (Thought Cabinet), deep player psychology  
* Weaknesses: PC-focused, 40+ hour experience, mature themes limit youth audience  
* LUX Story Advantage: Mobile-first accessibility, 5-7 min sessions, age-appropriate, B2B model

## **1.3 Competitive Positioning Matrix**

| Product | Assessment Depth | Engagement | Mobile-First | B2B Model |
| ----- | ----- | ----- | ----- | ----- |
| **LUX Story** | Deep (50+ skills) | High (narrative) | Yes | Yes |
| Pymetrics | Deep | Low (clinical) | Yes | Yes |
| Traitify | Shallow | Medium | Yes | Yes |
| PathSource | Medium | Low | Yes | Freemium |
| Episode/Choices | None | High | Yes | No (B2C) |
| Disco Elysium | None (implicit) | Very High | No | No (B2C) |

## **1.4 Key Differentiators Summary**

1. Hidden Assessment Layer: Unlike Pymetrics/Traitify, players don't realize they're being evaluated  
2. Narrative Quality: Disco Elysium-inspired depth in mobile-friendly 5-7 minute sessions  
3. Career Translation: Patterns map to real Birmingham career pathways with local employer connections  
4. Dual Revenue Model: B2B workforce partnerships \+ B2C premium features

# **2\. Extended Character Roster**

The full cast includes 15 characters across three tiers: Core Cast (fully implemented), Secondary Cast (partial implementation), and Extended Cast (defined, pending implementation).

## **2.1 Core Cast (5 Characters — Full Implementation)**

| Character | Archetype | Career Path | Gameplay Mechanic | Status |
| ----- | ----- | ----- | ----- | ----- |
| **Samuel** | The Conductor | Learning Experience Architect | The Limbic Store (Feedback & Guidance) | ✅ Locked |
| **Marcus** | The System | Cybersecurity Specialist | The Triage (Resource Allocation) | ✅ Locked |
| **Kai** | The Inspector | Sustainable Construction | The Blueprint (Risk Assessment) | ✅ Locked |
| **Rohan** | The Skeptic | Community Data Analyst | The Debate (Source Verification) | ✅ Locked |
| **Maya** | The Engineer | Healthcare Tech / Robotics | The Demo (Iterative Design) | ✅ Locked |

## **2.2 Secondary Cast (6 Characters — Partial Implementation)**

| Character | Archetype | Career Path | Current Gap | Status |
| ----- | ----- | ----- | ----- | ----- |
| **Devon** | The Builder | Software Engineering | Pattern Voices implemented | 🟡 Partial |
| **Tess** | The Merchant | Creative Entrepreneur / FinTech | Missing Pattern Voices | 🟡 Partial |
| **Yaquin** | The Scholar | Research / Academia | Missing Pattern Voices | 🟡 Partial |
| **Grace** | The Doctor | Healthcare Operations | Missing Consequence Echoes | 🟡 Partial |
| **Elena** | The Historian | Information Science / Archivist | Missing Consequence Echoes | 🟡 Partial |
| **Alex** | The Rat | Supply Chain & Logistics | Missing from skills system | 🟡 Partial |

## **2.3 Extended Cast (4 Characters — Defined, Not Implemented)**

| Character | Archetype | Career Path | Implementation Need | Status |
| ----- | ----- | ----- | ----- | ----- |
| **Silas** | The Mechanic | Advanced Manufacturing | Full dialogue tree, skill mapping | ❌ Pending |
| **Zara** | The Artist | Digital Media / Creative | Full dialogue tree, skill mapping | ❌ Pending |
| **Lira** | The Voice | Communications Strategy / PR | Full dialogue tree, skill mapping | ❌ Pending |
| **Asha** | The Mediator | Conflict Resolution / HR | Full dialogue tree, skill mapping | ❌ Pending |

## **2.4 Career Coverage Gaps**

Current character roster is missing two key career pillars:

* Advanced Manufacturing & Logistics (Alex/Silas): Skills in systems thinking, triage, technical literacy — "How things move and how to fix them"  
* Strategic Communications (Lira/Asha): Skills in storytelling, cultural competence, media literacy — "How to shape the narrative"

# **3\. Living Design Document Concepts**

These architectural patterns define how LUX Story's narrative systems function. They form the "DNA" of the gameplay experience.

## **3.1 The Accept/Reject/Deflect Pattern**

Every choice node follows a three-response taxonomy inspired by Inkle's narrative design framework. This avoids complex branching trees while maintaining meaningful player agency.

| Response Type | Stance | Example |
| ----- | ----- | ----- |
| **Accept** | Cooperative | "I understand. Tell me more about what happened." |
| **Reject** | Confrontational | "That doesn't sound right. Are you sure about this?" |
| **Deflect** | Evasive/Chaotic | "Interesting... but what about the trains?" |

**Pattern Implications:** Accept choices trend toward Helping/Patience patterns. Reject choices reveal Analytical/Building patterns. Deflect choices indicate Exploring patterns.

## **3.2 The Interrupt System**

"Moment-to-Moment Agency" — breaks the text wall with timed opportunities to act during NPC dialogue.

* Mechanism: A subtle button appears during NPC emotional moments (e.g., "Reach out" while character is crying)  
* Rule: These are rare, high-impact moments — missing them is a valid choice (Silence as meaningful response)  
* Technical: Interrupts tied to specific dialogue nodes with canInterrupt flag and interruptWindow (ms)  
* Pattern Impact: Acting on interrupts reveals Helping patterns; observing without acting may reveal Patience patterns

## **3.3 Loyalty Experiences (Deep Dives)**

"Every Interaction is a Story." Each major character has one signature Loyalty Experience that represents the culmination of their arc.

| Character | Experience Name | Description |
| ----- | ----- | ----- |
| **Maya** | "The Demo" | Help her present her robotics project to skeptical investors |
| **Devon** | "The Outage" | Triage a critical system failure under time pressure |
| **Samuel** | "The Quiet Hour" | Sit in contemplative silence; choose when (or if) to speak |
| **Marcus** | "The Breach" | Navigate a security incident with competing priorities |
| **Rohan** | "The Confrontation" | Challenge a popular narrative with uncomfortable data |

## **3.4 The Iceberg Architecture**

90% of the world is never explained — it is implied. This creates depth without exposition dumps.

* The Casual Mention: Characters reference "The Oxygen Tax" or "The Burned District" without explanation  
* Station Evolution: The environment physically changes based on relationships (help the Engineer → lights stop flickering)  
* Cross-Character Echoes: "Maya mentioned you. Said you didn't try to fix her." — references cascade across arcs

## **3.5 Pattern Voices (Thought Cabinet)**

Inspired by Disco Elysium's internal skill dialogue. Your 5 Patterns become internal voices that interrupt the conversation.

| Pattern | Voice Name | Example Interjection |
| ----- | ----- | ----- |
| **Analytical** | The Weaver | \[WEAVER\]: Those numbers don't add up. Press them on the timeline. |
| **Patience** | The Anchor | \[ANCHOR\]: Wait. There's something they're not saying. Let the silence work. |
| **Exploring** | The Voyager | \[VOYAGER\]: This path is too obvious. What's behind that door they keep avoiding? |
| **Helping** | The Harmonic | \[HARMONIC\]: They're hurting. Forget the question — ask how they're doing. |
| **Building** | The Architect | \[ARCHITECT\]: This is fixable. Let's break it into components. |

**Unlock Mechanism:** Pattern Voices appear when pattern level reaches DEVELOPING (6+). They unlock new dialogue options and reveal hidden information.

## **3.6 The Consequence Web**

Characters reference your interactions with others, creating a living social network.

* Delayed Gifts: Choices pay off 2-5 interactions later (advice in Chapter 1 → stranger thanks you in Chapter 3\)  
* Relationship Web UI: Visualizes connections as a constellation, highlighting unlocked "Private Opinions" at high trust  
* The Yojimbo Dynamic: No faction is "Right" — each has valid points and fatal flaws; player is moral arbiter

# **4\. System Coverage Matrix**

Implementation status of key narrative systems across the character roster. This matrix drives sprint planning and identifies gaps.

## **4.1 Feature Implementation Status**

| Character | Consequence Echoes | Pattern Voices | Sensory Pillars | Relationship Web | Vulnerability Hints |
| ----- | :---: | :---: | :---: | :---: | :---: |
| **Samuel** | ✅ | ❌ | ✅ | ✅ | ❌ |
| **Maya** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Devon** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Kai** | ✅ | ❌ | ✅ | ✅ | ❌ |
| **Rohan** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Tess** | ✅ | ❌ | ✅ | ✅ | ❌ |
| **Yaquin** | ✅ | ❌ | ✅ | ✅ | ❌ |
| **Marcus** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Elena** | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Grace** | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Alex** | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Asha** | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Silas** | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Lira** | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Zara** | ❌ | ❌ | ✅ | ❌ | ❌ |

## **4.2 Coverage Summary**

| System | Implemented | Missing | Coverage |
| ----- | ----- | ----- | ----- |
| **Consequence Echoes** | 8 characters | 7 characters | 53% |
| **Pattern Voices** | 6 characters | 9 characters | 40% |
| **Sensory Pillars** | 15 characters | 0 characters | 100% |
| **Relationship Web** | 8 characters | 7 characters | 53% |
| **Vulnerability Hints** | 2 characters | 13 characters | 13% |

## **4.3 Priority Action Plan**

Based on coverage gaps, the following implementation priorities are recommended:

### **Priority 1: Vulnerability Hints (13% → 50%)**

Only Maya and Devon have vulnerability arcs. Define at least one "Vulnerability Arc" for each Core Cast character.

1. Samuel: What he lost to become the Conductor  
2. Marcus: The breach he couldn't prevent  
3. Kai: The project that failed inspection  
4. Rohan: The truth that cost him relationships

### **Priority 2: Pattern Voices (40% → 70%)**

Add Pattern Voice triggers to PATTERN\_VOICE\_LIBRARY for remaining characters.

* Characters needing Pattern Voices: Samuel, Kai, Tess, Yaquin, Alex, Asha, Silas, Lira, Zara  
* Focus on Core Cast first (Samuel, Kai) before Secondary Cast

### **Priority 3: Consequence Echoes (53% → 80%)**

Create trustUp, trustDown, and patternRecognition template arrays for remaining characters.

* Characters needing Consequence Echoes: Elena, Grace, Alex, Asha, Silas, Lira, Zara

### **Priority 4: Relationship Web (53% → 80%)**

Ensure RelationshipWeb.tsx has node definitions for extended cast.

* Add constellation positions for: Elena, Grace, Alex, Asha, Silas, Lira, Zara  
* Define cross-character relationships and Private Opinion unlock thresholds

## **4.4 Skills System Gaps**

The 2030-skills-system.ts file is missing career path mappings for:

| Character | Missing Career Path | Required Skills to Add |
| ----- | ----- | ----- |
| **Alex** | Advanced Logistics Specialist | Systems Thinking, Triage, Technical Literacy |
| **Silas** | Advanced Manufacturing | Technical Literacy, Problem Solving, Quality Assurance |
| **Lira** | Strategic Communications | Storytelling, Cultural Competence, Media Literacy |
| **Asha** | Conflict Resolution / HR | Emotional Intelligence, Active Listening, Negotiation |

*— End of Addendum —*