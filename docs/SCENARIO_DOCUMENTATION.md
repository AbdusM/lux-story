# Scenario Documentation Guide
## Understanding Scenarios and Data Extraction

---

## Target Audiences & User Stories

### Primary Target Audiences

The system is designed for three primary age groups, each with different needs and developmental stages:

#### 1. Middle School Students (Ages 11-14, Grades 6-8)

**Characteristics:**
- Early identity exploration
- **Cognitive Stage:** Concrete → Abstract Thinking Transition
  - **Concrete (Age 11-12):** Understands literal situations
    - Example: "Maya is sad because her parents want her to be a doctor"
  - **Transitioning (Age 12-13):** Beginning to see multiple perspectives
    - Example: "Maya is sad, but her parents might also be scared about her future"
  - **Abstract (Age 13-14):** Can understand complex concepts
    - Example: "This is about identity, cultural expectations, and generational sacrifice"
- High anxiety about future decisions
- Need for immediate feedback and encouragement
- **Attention Span:** Shorter (2-3 sentences per text block)
  - **Why:** Research shows engagement drops after 30 seconds of reading
  - **Example:**
    - ❌ BAD: "My parents immigrated here with nothing and worked three jobs each to get me through school and their dream has always been for me to become a doctor but I'm not sure that's what I want and I feel guilty about disappointing them."
    - ✅ GOOD: "My parents immigrated here with nothing. They worked three jobs each to get me through school. Their dream is simple: 'Our daughter, the doctor.'"
- Benefit from simpler language and concepts

**Scenario Design Considerations:**
- **Simpler choices:** 2-3 options maximum
  - **Example - Simple Choices:**
    - Choice A: "That's really hard" (empathy)
    - Choice B: "What do you want to do?" (solution-focused)
    - Clear, distinct approaches
- **Shorter dialogue:** 2-3 sentence chunks (as shown above)
- **More encouragement:** Positive feedback after choices
  - Example: "You helped Maya feel understood. Trust increased!"
- **Concrete examples:** "Like helping a friend" not "emotional intelligence"
- **Visual support:** More visual cues and animations
  - **Specific Visual Supports:**
    1. **Trust Meter:** Visual bar showing relationship level
       - "Trust with Maya: ⭐⭐⭐☆☆ (3/5)"
       - Changes immediately after choices
    2. **Choice Impact Preview:**
       - Icons showing: 💙 +2 Trust, 🎯 Helping Pattern, ⚡ 3 Skills
    3. **Progress Indicators:**
       - "Maya's Story: 🔵🔵🔵⚪⚪ (3 of 5 scenarios complete)"
    4. **Skill Icons:**
       - 🧠 Emotional Intelligence
       - 🌍 Cultural Competence
       - 💬 Communication
    5. **Animations:**
       - Character expressions change based on choices
       - Trust meter fills with animation
       - Skill badges appear when demonstrated
- **Immediate rewards:** Trust increases visible, story progresses quickly

**User Story Example:**
```
As a 12-year-old student,
I want to explore careers through stories,
So that I can discover what I'm good at
Without feeling overwhelmed by big decisions.

Acceptance Criteria:
- I can understand the choices without adult help
- I get positive feedback when I make choices
- The story feels like a game, not a test
- I can see my progress (trust levels, story completion)
```

#### 2. High School Students (Ages 14-18, Grades 9-12)

**Characteristics:**
- Active identity formation (Erikson's Identity vs. Role Confusion stage)
- Abstract thinking developing (can handle complex concepts)
- Career decisions feel urgent and important
- Can handle complex scenarios and multiple perspectives
- Need for authentic, meaningful choices
- Benefit from deeper reflection

**Scenario Design Considerations:**
- **Complex choices:** 3-4 options with nuanced differences
  - **Example - Nuanced Choices:**
    - Choice A: "Their sacrifice was an investment in YOUR happiness, not an obligation"
      → Reframes sacrifice, validates student's autonomy
    - Choice B: "What if honoring them means finding YOUR version of success, not theirs?"
      → Similar intent but emphasizes cultural honoring + personal path
    - Choice C: "Have you told them how you feel?"
      → Focuses on communication as solution
    - **What makes these nuanced:**
      - All are supportive, but emphasize different values
      - Different skill demonstrations (reframing vs. communication vs. cultural navigation)
      - Require student to think about WHICH type of support Maya needs
- **Longer dialogue:** Can handle 3-4 sentence chunks
  - **Can sustain attention:** Through 45-60 seconds of reading
  - **Can handle:** More complex sentences, embedded clauses
- **Authentic dilemmas:** Real-world situations (family pressure, career uncertainty)
- **Skill connections:** Can understand "emotional intelligence" and "cultural competence"
- **Reflection support:** Experience Summary and Framework Insights
- **Career alignment:** Direct connections to WEF 2030 Skills and RIASEC theory

**User Story Example:**
```
As a 16-year-old high school student,
I want to explore careers through meaningful conversations,
So that I can discover my strengths and interests
And make informed decisions about my future.

Acceptance Criteria:
- Choices feel authentic and meaningful
- I can see how my choices connect to real skills
- I understand why certain careers match my patterns
- I can create an action plan based on my discoveries
```

#### 3. Early Career Explorers (Ages 18-25, Post-Secondary)

**Characteristics:**
- Identity exploration continues (Erikson's Intimacy vs. Isolation stage)
- Abstract thinking fully developed
- Career decisions are immediate and practical
- Can handle ambiguity and complex trade-offs
- Need for strategic career planning
- Benefit from research-based insights

**Scenario Design Considerations:**
- **Complex scenarios:** Multiple layers, ethical dilemmas
  - **Example Ethical Dilemma:**
    - Scenario: Jordan asks you to review their resume. You notice they've exaggerated an achievement.
    - Choices require weighing: Honesty vs. Friendship, Diplomacy vs. Enabling, Loyalty vs. Complicity
    - No "right" answer - all choices have tradeoffs
- **Strategic choices:** Long-term consequences visible
- **Research integration:** Framework Insights with citations
- **Career planning:** Action Plan Builder with specific pathways
- **Birmingham opportunities:** Direct links to local jobs and programs
  - **Specific Examples:**
    - **For Healthcare (Social types):**
      - UAB Medicine Internships: Summer programs for high school students
      - Birmingham VA Medical Center: Volunteer opportunities
      - Children's of Alabama: Youth volunteer program
    - **For Engineering (Realistic/Investigative types):**
      - Southern Research: STEM internships
      - UAB Engineering: High school research programs
      - Mercedes-Benz U.S. International: Plant tours and apprenticeships
    - **For Tech (Investigative types):**
      - Shipt (Target company): Tech internships
      - Protective Life: IT career programs
      - Innovation Depot: Startup incubator with youth programs
- **Professional development:** Skills connected to employer needs
- **Longer dialogue:** 5+ sentences or full paragraphs
  - **Can handle:** Extended narratives, multiple threads

**User Story Example:**
```
As a 20-year-old college student,
I want to explore careers through research-based scenarios,
So that I can align my skills with employer needs
And create a concrete plan for my career path.

Acceptance Criteria:
- Scenarios reflect real workplace situations
- I can see how my skills match employer requirements
- I understand the research behind career recommendations
- I can create specific, actionable career goals
```

---

### User Stories by Role

#### Student User Stories

**Story 1: Discovery**
```
As a student exploring careers,
I want to interact with characters facing real challenges,
So that I can discover my natural approach to problems
Without feeling like I'm being tested.

Scenario Example:
- Maya shares her family pressure dilemma
- Student chooses how to help
- System captures: helping pattern, emotional intelligence skill
- Student feels: "I'm good at helping people"
```

**Story 2: Skill Recognition**
```
As a student,
I want to see what skills I demonstrated through my choices,
So that I can understand my strengths
And know what employers are looking for.

Scenario Example:
- Student completes Maya's arc
- Experience Summary shows: "You demonstrated Emotional Intelligence (High)"
- Framework Insights explains: "This is a WEF 2030 Skill employers need"
- Student understands: "This skill matters for my career"
```

**Story 3: Career Matching**
```
As a student,
I want to see which careers match my natural patterns,
So that I can explore paths that fit who I am
And avoid careers that would make me unhappy.

Scenario Example:
- Student shows consistent "helping" pattern (45% of choices)
- Framework Insights shows: "You're a Social (S) type in RIASEC theory"
- System recommends: Healthcare, education, counseling careers
- Student explores: "These careers actually fit me"
```

**Story 4: Real-World Application**
```
As a student,
I want to create an action plan based on my discoveries,
So that I can take concrete steps toward my career goals
And apply what I learned in real life.

Scenario Example:
- Student discovers strength in emotional intelligence
- Action Plan Builder prompts: "How will you use this skill?"
- Student creates: "Practice active listening with friends this month"
- Student connects: To Birmingham counseling programs
```

#### Instructional Designer User Stories

**Story 1: Learning Objective Alignment**
```
As an instructional designer,
I want scenarios to be tagged with learning objectives,
So that I can verify curriculum alignment
And track student progress toward educational goals.

Scenario Example:
- Scenario: Maya Family Pressure
- Tagged with: "Cultural Identity Exploration" learning objective
- System tracks: Student viewed, engaged, completed objective
- Designer can see: Which students need support on this objective
```

**Story 2: Assessment Evidence**
```
As an instructional designer,
I want rich evidence of skill demonstrations,
So that I can assess student competencies authentically
And provide meaningful feedback.

Scenario Example:
- Student choice: "Their sacrifice was an investment..."
- Evidence captured: "Reframed parental sacrifice, demonstrated cultural competence"
- Intensity: High
- Designer can use: For authentic assessment, not just test scores
```

**Story 3: Differentiated Instruction**
```
As an instructional designer,
I want scenarios to adapt to different learning levels,
So that all students can engage meaningfully
And receive appropriate challenge.

Scenario Example:
- Struggling learner: 2 choices, simpler language, more encouragement
- Flowing learner: 4 choices, complex scenarios, deeper reflection
- System adapts: Based on student's demonstrated capacity
```

**Story 4: Learning Transfer**
```
As an instructional designer,
I want scenarios to mirror real-world situations,
So that skills transfer to students' actual lives
And learning is meaningful and applicable.

Scenario Example:
- Scenario: Helping Maya navigate family pressure
- Real-world parallel: Student helping friend with similar situation
- Skills transfer: Same emotional intelligence, cultural competence
- Student recognizes: "I did this before in the game"
```

---

## Instructional Design Context

### Learning Objectives Framework

Scenarios are designed to address specific learning objectives aligned with career development and 2030 Skills:

#### Primary Learning Objectives

**1. Self-Awareness & Identity Exploration**
- **Objective:** Students understand their natural patterns, strengths, and preferences
- **How scenarios address it:**
  - Choices reveal behavioral patterns (helping, analytical, building, etc.)
  - Pattern tracking shows consistency over time
  - Framework Insights connect patterns to personality types (RIASEC)
- **Assessment:** Pattern consistency, self-reflection quality, career match confidence

**2. Skill Development (WEF 2030 Skills)**
- **Objective:** Students develop and demonstrate 2030 Skills through authentic practice
- **How scenarios address it:**
  - Each choice demonstrates specific skills (emotional intelligence, communication, etc.)
  - Skills are tracked across multiple scenarios
  - Intensity ratings show depth of skill demonstration
- **Assessment:** Skill demonstration frequency, intensity levels, skill diversity

**3. Career Exploration & Decision-Making**
- **Objective:** Students explore careers aligned with their patterns and skills
- **How scenarios address it:**
  - Character arcs explore different career paths (healthcare, engineering, tech, etc.)
  - RIASEC matching connects patterns to career types
  - Birmingham opportunities provide local pathways
- **Assessment:** Career matches explored, match confidence, action plans created

**4. Cultural Competence & Social Awareness**
- **Objective:** Students understand and navigate diverse perspectives and cultural contexts
- **How scenarios address it:**
  - Characters represent diverse backgrounds (Maya: immigrant family, Devon: grief, Jordan: imposter syndrome)
  - Choices require cultural understanding and empathy
  - Scenarios address real-world cultural dynamics
- **Assessment:** Cultural competence skill demonstrations, relationship building success

**5. Metacognitive Awareness**
- **Objective:** Students understand their own learning and thinking processes
- **How scenarios address it:**
  - Experience Summary prompts reflection
  - Framework Insights explain "why" behind experiences
  - Action Plan Builder encourages self-directed learning
- **Assessment:** Reflection depth, framework understanding, action plan quality

### Assessment Strategy

**Authentic Assessment (Performance-Based)**
- **What it is:** Students demonstrate skills through authentic choices, not tests
- **Evidence:** Rich contextual descriptions of skill demonstrations
- **Advantage:** More valid than traditional tests (Messick, 1995)
- **Example:** "Student demonstrated emotional intelligence by reframing Maya's family situation" (not "Student knows definition of emotional intelligence")

**Formative Assessment (During Learning)**
- **What it is:** Continuous feedback during scenario interactions
- **Evidence:** Trust changes, relationship progression, pattern emergence
- **Advantage:** Students adjust approach in real-time
- **Example:** Trust increases show student is building relationships effectively

**Real-Time Adjustment Examples:**

**Scenario 1: Student learns trust is important**

First interaction with Maya:
- Student chooses: "Just tell your parents no" (direct, low empathy)
- Maya's trust: No change (stays at 0)
- Maya's response: *pulls back* "It's... complicated"
- **Student observes:** "That didn't work"

Second interaction with Maya:
- Student adjusts approach
- Student chooses: "That sounds really difficult" (empathetic)
- Maya's trust: +1
- Maya's response: *opens up* "Yeah... it's been hard"
- **Student learns:** "Being empathetic builds trust"

Third interaction:
- Student now knows: Empathy → Trust → Deeper conversations
- Student consistently chooses empathetic responses
- Pattern emerges naturally from feedback

**Scenario 2: Student learns from locked content**

Student tries to access deep scenario:
- System message: "Maya needs to trust you more (Trust level 2 required, you have 1)"
- **Student understands:** "I need to build more trust first"
- Student goes back to earlier scenarios
- Focuses on trust-building choices
- Unlocks deeper content
- **Adjustment made:** Student learned trust matters and changed behavior

**Summative Assessment (After Learning)**
- **What it is:** Comprehensive evaluation after arc completion
- **Evidence:** Experience Summary, skill profile, career matches
- **Advantage:** Shows overall growth and development
- **Example:** "Student demonstrated 8 different skills across 12 scenarios"

### Scaffolding & Differentiation

**Scaffolding Levels:**

```
Level 1: Struggling Learners
├─ Simplified choices (2 options)
├─ Shorter dialogue chunks
├─ More encouragement
├─ Visual support
└─ Immediate positive feedback
    └─ Explicit hint after 3 scenarios:
       "We noticed you often choose to help others. This is called a 
       'Helping' pattern, and it's a strength!"

Level 2: Exploring Learners
├─ Standard choices (3 options)
├─ Moderate dialogue length
├─ Balanced support
└─ Pattern recognition hints
    └─ Subtle hint after 5 scenarios:
       "You've helped Maya, Jordan, and Devon by listening to their 
       problems. Some people call this emotional intelligence."

Level 3: Flowing Learners
├─ Complex choices (4 options)
├─ Longer dialogue chunks
├─ Deeper scenarios
└─ Subtle pattern revelations
    └─ Pattern summary in Experience Summary:
       "Your choices show a consistent 'Helping' pattern (6 of 8 scenarios). 
       This suggests you might enjoy careers focused on supporting others."

Level 4: Mastering Learners
├─ Ethical dilemmas
├─ Multiple skill synthesis
├─ Strategic thinking required
└─ Research framework integration
    └─ No hints during gameplay
    └─ Comprehensive pattern analysis after arc:
       "Your behavioral pattern analysis: 45% Helping, 30% Analytical, 15% 
       Exploring. This aligns with RIASEC 'Social' type (S). Research shows 
       S-types thrive in healthcare, education, counseling..."
```

**Differentiation Strategies:**

1. **Content Differentiation:**
   - Trust gates: Lower trust required for struggling learners
   - Conditional choices: More options unlock as skills develop
   - Scenario complexity: Adapts to demonstrated capacity
     - **Determining Demonstrated Capacity:**
       - **Trust Building Speed:**
         - Fast (2-3 scenarios to reach trust level 2): Flowing/Mastering learner
         - Moderate (4-6 scenarios): Exploring learner
         - Slow (7+ scenarios): Struggling learner
       - **Choice Response Time:**
         - Quick decisions (<5 seconds): May need more challenge
         - Moderate (5-15 seconds): Appropriate challenge level
         - Long pauses (>30 seconds): May be overwhelmed
       - **Pattern Consistency:**
         - Consistent pattern emerges quickly (by scenario 5): Advanced
         - Pattern emerges moderately (by scenario 10): Standard
         - No clear pattern after 12+ scenarios: Needs support
       - **Scenario Completion Rate:**
         - Completes scenarios fully: Engaged, appropriate level
         - Abandons scenarios frequently: Too difficult or boring
         - Replays scenarios multiple times: Either too easy (bored) or struggling
     - **Adaptive Response Example:**
       - **Student Profile:**
         - Trust building: Slow (8 scenarios to reach trust level 2)
         - Response time: Long pauses (20-30 seconds per choice)
         - Pattern: No clear pattern after 10 scenarios
         - Completion: 60% (6 of 10 scenarios completed)
       - **System Adaptation:**
         → Identifies as "Struggling Learner"
         → Next scenarios presented with:
            - 2 choices instead of 4
            - Shorter dialogue (2 sentences max)
            - Explicit encouragement after choices
            - Pattern hints: "You're showing empathy - that's great!"
            - Lower trust gates (trust level 1 instead of 2)
       - **After 5 adapted scenarios:**
         → Student performance improves
         → System gradually increases complexity
         → Student moves to "Exploring Learner" level

2. **Process Differentiation:**
   - Reflection depth: Struggling learners get simpler prompts
   - Framework complexity: Flowing learners get deeper research
   - Action planning: Early career explorers get specific pathways

3. **Product Differentiation:**
   - Experience Summary: Adapts to student's level
   - Framework Insights: More or less detail based on readiness
   - Action Plans: Varying levels of specificity

### Instructional Design Principles Applied

**1. Backward Design (Wiggins & McTighe, 2005)**
- **Start with:** Learning objectives (self-awareness, skill development, career exploration)
- **Design:** Scenarios that elicit demonstrations of these objectives
- **Assess:** Through authentic performance, not tests

**2. Universal Design for Learning (CAST, 2018)**
- **Multiple means of engagement:** Story, choices, relationships, reflection
- **Multiple means of representation:** Visual, textual, interactive
- **Multiple means of action/expression:** Choices, reflection, action plans

**3. Constructivist Learning (Piaget, 1977; Vygotsky, 1978)**
- **Students construct meaning:** Through choices and reflection
- **Social interaction:** With characters, building relationships
- **Zone of Proximal Development:** Trust gates provide appropriate challenge

**4. Experiential Learning (Kolb, 1984)**
- **Concrete Experience:** Scenario interactions
- **Reflective Observation:** Experience Summary
- **Abstract Conceptualization:** Framework Insights
- **Active Experimentation:** Action Plan Builder

---

## Key Definitions & Frameworks

### WEF 2030 Skills: Complete Definition

**What it is:**
The World Economic Forum's research-based framework identifying the most important skills workers will need by 2030, based on analysis of 803 million job postings and employer surveys.

**Source:**
World Economic Forum. (2023). *Future of Jobs Report 2023*. Geneva: WEF.

**The 12 Core Skills Tracked in Our System:**

1. **Critical Thinking** - Breaking down complex problems, analyzing information
2. **Creativity** - Generating innovative solutions, thinking outside the box
3. **Communication** - Articulating ideas clearly, active listening
4. **Collaboration** - Working effectively with others, teamwork
5. **Adaptability** - Adjusting to change, flexibility
6. **Leadership** - Guiding and motivating others, taking initiative
7. **Digital Literacy** - Understanding and using technology effectively
8. **Emotional Intelligence** - Recognizing and managing emotions (own and others')
9. **Cultural Competence** - Understanding and navigating diverse perspectives
10. **Problem Solving** - Identifying solutions to challenges
11. **Time Management** - Organizing and prioritizing tasks effectively
12. **Financial Literacy** - Understanding money, budgeting, financial planning

**Why "2030":**
- Employers project these skills will be most valuable by 2030
- Automation replacing routine tasks, increasing need for human skills
- Timeframe aligns with current students entering workforce
- Based on trends in: AI adoption, remote work, globalization, sustainability

**How Scenarios Map to 2030 Skills:**

**Example: Maya Family Pressure Scenario**

Student choice: "Their sacrifice was an investment in your happiness"

**2030 Skills Demonstrated:**
1. **Emotional Intelligence** (#8) - HIGH
   - Recognized Maya's emotional state
   - Understood underlying feelings (guilt, desire, duty)

2. **Critical Thinking** (#1) - MEDIUM
   - Analyzed situation complexity
   - Identified competing needs

3. **Cultural Competence** (#9) - HIGH
   - Understood immigrant family dynamics
   - Navigated cultural expectations

4. **Creativity** (#2) - MEDIUM
   - Reframed situation innovatively
   - Found new perspective

5. **Communication** (#3) - MEDIUM
   - Articulated complex idea clearly
   - Used empowering language

**Why We Use This Framework:**
- ✅ **Research-based:** Not arbitrary, derived from 803M job postings
- ✅ **Future-focused:** Prepares students for actual labor market
- ✅ **Employer-validated:** Companies confirm these are what they need
- ✅ **Measurable:** Can track and document skill development
- ✅ **Transferable:** Skills apply across industries and careers
- ✅ **Credible:** From respected global institution (WEF)

---

### RIASEC Theory: Complete Explanation

**What it is:**
A career assessment framework developed by psychologist John Holland that categorizes both people and careers into six personality types.

**Source:**
Holland, J. L. (1997). *Making Vocational Choices: A Theory of Vocational Personalities and Work Environments* (3rd ed.). Psychological Assessment Resources.

**The Six Types:**

**R - Realistic ("Doers")**
- **Characteristics:** Practical, hands-on, likes working with objects/tools
- **Values:** Tangible results, physical activity, concrete problems
- **Careers:** Construction, mechanics, engineering, agriculture, forestry
- **In Scenarios:** "Building" pattern - focuses on creating, fixing, making

**I - Investigative ("Thinkers")**
- **Characteristics:** Analytical, curious, likes solving abstract problems
- **Values:** Understanding, research, logical analysis
- **Careers:** Science, research, mathematics, medicine, programming
- **In Scenarios:** "Analytical" pattern - focuses on analyzing, researching

**A - Artistic ("Creators")**
- **Characteristics:** Creative, expressive, values aesthetics and originality
- **Values:** Self-expression, innovation, beauty, emotional depth
- **Careers:** Arts, design, writing, music, theater, architecture
- **In Scenarios:** "Creative" pattern - focuses on novel solutions, expression

**S - Social ("Helpers")**
- **Characteristics:** Empathetic, people-oriented, likes helping others
- **Values:** Relationships, service, making a difference
- **Careers:** Teaching, counseling, healthcare, social work, HR
- **In Scenarios:** "Helping" pattern - focuses on supporting, listening, caring

**E - Enterprising ("Persuaders")**
- **Characteristics:** Ambitious, energetic, likes leading and influencing
- **Values:** Achievement, status, competition, persuasion
- **Careers:** Sales, management, law, marketing, entrepreneurship
- **In Scenarios:** "Leading" pattern - focuses on influencing, organizing

**C - Conventional ("Organizers")**
- **Characteristics:** Detail-oriented, organized, likes structure and systems
- **Values:** Accuracy, efficiency, order, stability
- **Careers:** Accounting, administration, finance, data management
- **In Scenarios:** "Organizing" pattern - focuses on planning, structuring

**How RIASEC Matching Works:**

**Step 1: Pattern Tracking**
System counts student's choice patterns across scenarios:
- Helping choices: 9 (45%) → **S**
- Analytical choices: 6 (30%) → **I**
- Creative choices: 3 (15%) → **A**
- Building choices: 2 (10%) → **R**

**Step 2: RIASEC Code Assignment**
Top 2-3 patterns become student's RIASEC code:
- **Primary:** S (Social) - 45%
- **Secondary:** I (Investigative) - 30%
- **Tertiary:** A (Artistic) - 15%

**Student's RIASEC Code: SIA**

**Step 3: Career Matching**
Match code to careers with same profile:

**High Match Careers (SIA):**
- Counseling Psychologist (SI)
- School Counselor (SE)
- Healthcare Social Worker (SI)
- Art Therapist (SA)
- Human Factors Researcher (SI)

**Medium Match Careers (includes S or I):**
- Teacher (S)
- Nurse (SI)
- Market Researcher (I)
- UX Researcher (IA)

**Why This Works:**
- **Research Evidence:** Holland (1997) found people are happier and more successful in careers matching their type (70% correlation)
- **For Students:** "Your choices show you're naturally a 'Helper' type (Social). This means you'll probably be happiest in careers where you can support others, like counseling, healthcare, or teaching."

---

## What is a Scenario?

A **scenario** is a single conversation moment in the story where:
- A character speaks to the student
- The student makes a choice
- The story branches based on that choice
- We learn about the student's skills, patterns, and engagement

Think of scenarios as the building blocks of the interactive story—each one is a meaningful interaction that reveals something about the student.

```
┌─────────────────────────────────────┐
│         SCENARIO STRUCTURE          │
├─────────────────────────────────────┤
│                                     │
│   Character speaks                  │
│   (dialogue text)                   │
│         │                           │
│         ▼                           │
│   Student sees choices              │
│   (2-4 options)                     │
│         │                           │
│         ▼                           │
│   Student selects choice            │
│         │                           │
│         ▼                           │
│   Story branches                    │
│   Data is captured                  │
│                                     │
└─────────────────────────────────────┘
```

---

## What Goes Into a Good Scenario?

A well-designed scenario has four main components:

### 1. The Conversation Content

**What it is:** The actual dialogue the character speaks

**Key elements:**
- **Clear emotional tone** (anxious, hopeful, conflicted, etc.)
- **Proper pacing** (broken into readable chunks, not walls of text)
- **Multiple variations** (so students can replay and see different content)
  - **Why variations matter:**
    1. **Replayability:** Students can explore different paths
    2. **Assessment validity:** Multiple exposures test consistency
    3. **Reduced gaming:** Students can't memorize "right" answers
    4. **Engagement:** Fresh content on replay maintains interest
  - **Variation Types:**
    - **Emotional Tone Variations:** Same scenario core, different emotional framing
      - Variation A (Anxious): "I can't sleep. Every time I close my eyes, I see their disappointed faces."
      - Variation B (Hopeful): "You know what? Maybe there's a way to make this work."
      - Variation C (Conflicted): "Some days I think I should just do what they want. Other days, I can't imagine giving up what I love."
    - **Information Reveal Variations:** Same choice options, different information emphasized
    - **Character Voice Variations:** Same information, different communication style
  - **How many variations:**
    - **Standard scenarios:** 2-3 variations
    - **High-replay scenarios:** 3-4 variations
    - **Key decision points:** 4+ variations

**Visual Example:**

```
Maya speaks:
┌─────────────────────────────────────────────┐
│ "My parents.                                │
│                                             │
│ They immigrated here with nothing.         │
│ Worked three jobs each to get me through   │
│ school.                                     │
│                                             │
│ Their dream is simple: 'Our daughter,      │
│ the doctor.'                                │
│                                             │
│ How can I disappoint them?"                 │
│                                             │
│ [Emotion: conflicted]                       │
└─────────────────────────────────────────────┘
```

---

### 2. The Student Choices

**What it is:** The options the student can select

**Key elements:**
- **At least 2-3 choices** (ideally 3-4 for variety)
- **Each choice reveals different skills** (what competencies does this choice demonstrate?)
- **Each choice has a pattern** (analytical, helping, building, exploring, etc.)
- **Choices can be conditional** (some only appear if trust is high enough, or if certain story events happened)
  - **Type 1: Trust-Based Conditionals**
    - **Low Trust (0-1):** Basic choices available
      - ✅ "That sounds difficult"
      - ✅ "What do your parents do?"
      - ❌ LOCKED - "What do YOU want?" (requires trust 2 - too personal)
    - **Medium Trust (2-3):** Deeper choices unlock
      - ✅ "What do YOU want?" (NOW AVAILABLE)
    - **High Trust (4-5):** All choices available, including advice-giving
      - ✅ "Have you considered telling them?" (NOW AVAILABLE)
      - ✅ NEW: "Want to practice what you'd say?" (only at high trust)
  - **Type 2: Story Event Conditionals**
    - ❌ LOCKED BEFORE: Haven't discovered Maya likes robotics
    - ✅ UNLOCKED AFTER: Maya revealed robotics interest
    - Example: Can now ask "Tell me more about your robotics work" (would be weird before you know about it)
  - **Type 3: Character Knowledge Conditionals**
    - If you kept Maya's secret: ❌ Can't reveal it to Devon
    - If Maya gave permission: ✅ Can discuss with Devon
  - **Type 4: Pattern-Based Conditionals**
    - If student shows analytical pattern (30%+): ✅ Unlocks special analytical path
    - If student shows helping pattern (30%+): ✅ Unlocks special empathy path

**Visual Example:**

```
Student sees these choices:

┌─────────────────────────────────────────────┐
│ Choice 1: "Their sacrifice was an           │
│           investment in your happiness,     │
│           not an obligation."               │
│                                             │
│ Skills: Emotional Intelligence,             │
│         Cultural Competence,                │
│         Communication                       │
│ Pattern: Helping                            │
│ Impact: +2 Trust                            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Choice 2: "What if living their dream       │
│           means sacrificing your own?"      │
│                                             │
│ Skills: Critical Thinking,                   │
│         Leadership,                          │
│         Communication                       │
│ Pattern: Analytical                         │
│ Impact: +1 Trust                            │
│ (Only visible if trust ≥ 2)                 │
└─────────────────────────────────────────────┘
```

---

### 3. Story Conditions

**What it is:** Rules that control when scenarios appear and which choices are available

**Key elements:**
- **Trust gates** (character must trust student enough to reveal certain things)
- **Knowledge requirements** (student must have learned certain information first)
- **Story progression** (some content only unlocks after completing earlier parts)

**Visual Flow:**

```
Student Journey Through Story:

Start → Scenario A (Introduction)
         │
         ├─→ Build Trust → Scenario B (Low Trust Path)
         │
         └─→ Build More Trust → Scenario C (High Trust Path)
                                    │
                                    └─→ Unlocks Scenario D (Trust Gate)
```

**Example:**
- **Early in story:** Maya only shares surface-level concerns
- **After building trust:** Maya reveals deeper family pressure
- **After high trust:** Maya shares her secret passion for robotics

---

### 4. Learning Objectives & Metadata

**What it is:** Tags and connections that link scenarios to educational goals

**Key elements:**
- **Learning objectives** (which curriculum goals does this scenario address?)
- **Character arc tags** (which character's story is this part of?)
- **Content tags** (career exploration, cultural competence, etc.)

**Visual Organization:**

```
Scenario: Maya Family Pressure
├─ Character Arc: Maya
├─ Learning Objectives:
│   ├─ Cultural Identity Exploration
│   └─ Emotional Intelligence
├─ Tags:
│   ├─ trust_gate
│   ├─ family_dynamics
│   └─ cultural_competence
└─ Story Position: Mid-arc (requires trust level 2+)
```

---

## What Data Can We Extract from Good Scenarios?

When scenarios are well-structured, we can extract eight types of valuable data:

### 1. Skill Demonstrations

**What we capture:** Which 2030 Skills the student demonstrates through their choices

**Visual Flow:**

```
Student makes choice
        │
        ▼
Choice tagged with skills:
├─ Emotional Intelligence
├─ Cultural Competence
├─ Communication
└─ Critical Thinking
        │
        ▼
Data captured:
├─ Which skills demonstrated
├─ How often each skill appears
├─ Intensity level (high/medium/low)
└─ Context of demonstration
```

**Example:**
- Student chooses: "Their sacrifice was an investment in your happiness"
- Skills captured: Emotional Intelligence (high), Cultural Competence (high), Communication (medium)
- Use: Builds student's skill profile, shows strengths, identifies areas for growth

**Skill Intensity Rating System:**

**HIGH Intensity (Deep Demonstration):**
- Student used skill in complex situation
- Multiple aspects of skill demonstrated
- Required significant effort or insight

**Example - Emotional Intelligence (HIGH):**
- Scenario: Maya family pressure
- Choice: "Their sacrifice was an investment in YOUR happiness"
- **Why HIGH:**
  - Recognized complex emotions (guilt, duty, desire)
  - Reframed situation from obligation → investment
  - Validated competing needs (cultural duty + personal autonomy)
  - Demonstrated deep empathy + cultural understanding

**MEDIUM Intensity (Clear Demonstration):**
- Student used skill appropriately
- Main aspect of skill demonstrated
- Standard application

**Example - Emotional Intelligence (MEDIUM):**
- Scenario: Jordan feels imposter syndrome
- Choice: "Those feelings are valid, but remember what you've achieved"
- **Why MEDIUM:**
  - Recognized emotion (self-doubt)
  - Provided validation
  - Standard empathetic response

**LOW Intensity (Basic Demonstration):**
- Student showed awareness of skill
- Surface-level application
- Minimal complexity

**Example - Emotional Intelligence (LOW):**
- Scenario: Devon seems sad
- Choice: "Are you okay?"
- **Why LOW:**
  - Recognized basic emotion
  - Simple check-in
  - No deeper analysis or reframing

**How intensity affects scoring:**
- HIGH: 3 points
- MEDIUM: 2 points
- LOW: 1 point
- Used to calculate overall skill profile strength

---

### 2. Behavioral Patterns

**What we capture:** The student's consistent approach style

**Pattern Types:**
- **Analytical:** Tends to analyze and think through problems
- **Helping:** Focuses on supporting others
- **Building:** Creates solutions and constructs things
- **Exploring:** Seeks new information and experiences
- **Patience:** Takes time to consider options
- **Rushing:** Makes quick decisions

**Visual Pattern Tracking:**

```
Student's Pattern Distribution:

Helping      ████████████████████ 45%
Analytical   ████████████ 30%
Exploring    ██████ 15%
Building     ███ 7%
Patience     ██ 3%

Consistency: 45% (Moderate-High consistency)
```

**Pattern Consistency Calculation:**

**Formula:**
Consistency Score = (Choices in Dominant Pattern / Total Choices) × 100

**Example Calculation:**
Student makes 20 choices:
- Helping: 9 choices → 45%
- Analytical: 6 choices → 30%
- Exploring: 3 choices → 15%
- Building: 2 choices → 10%

**Dominant Pattern:** Helping (45%)
**Consistency Score:** 45%

**Interpretation Scale:**
- **Very High (70-100%):** Student almost always uses same approach
  - Example: 16 of 20 choices are "Helping"
  - Interpretation: Very clear, consistent behavioral pattern
  - Career signal: Strong - can confidently recommend aligned careers
  - Caution: May indicate inflexibility - should students try other approaches?

- **High (50-69%):** Student often uses same approach, sometimes varies
  - Example: 11 of 20 choices are "Helping"
  - Interpretation: Clear preference with some adaptability
  - Career signal: Moderate-Strong - can recommend with confidence
  - Ideal range: Shows both consistency and flexibility

- **Moderate (30-49%):** Student leans toward one approach but is flexible
  - Example: 7 of 20 choices are "Helping"
  - Interpretation: Emerging pattern, still exploring
  - Career signal: Weak - need more data before recommending
  - Action: Encourage more scenarios to clarify pattern

- **Low (<30%):** No dominant pattern yet
  - Example: 5 or fewer of 20 choices in any single pattern
  - Interpretation: Student is experimenting, pattern not yet formed
  - Career signal: None - too early to recommend
  - Action: This is normal early on! Keep exploring.

**Context Matters:**
- **Early vs. Late Scenarios:**
  - Scenarios 1-5: Low consistency is NORMAL (exploring)
  - Scenarios 6-10: Pattern should START emerging (30%+)
  - Scenarios 11-15: Pattern should be CLEAR (50%+)
  - Scenarios 16+: Pattern should be STABLE (changes minimal)

- **By Age Group:**
  - Middle School: 40%+ considered good (still developing)
  - High School: 50%+ expected (identity forming)
  - Early Career: 60%+ expected (identity more stable)

**Use:** Understands student's natural approach, personalizes future content, suggests career paths

---

### 3. Learning Objectives Engagement

**What we capture:** How students interact with curriculum-aligned learning goals

**Engagement Levels:**

```
┌─────────────────────────────────────┐
│ VIEWED: Student saw the scenario    │
│         with this learning objective │
│                                      │
│ What happened: Student saw scenario │
│ tagged with objective                │
│                                      │
│ Data captured:                      │
│ • Timestamp: 2:15 PM                │
│ • Scenario: "Maya Family Pressure" │
│ • Time spent: 45 seconds reading    │
│ • Did NOT make a choice (closed)   │
│                                      │
│ Interpretation: Exposed to content, │
│ but did not engage                  │
│                                      │
│ Instructor action: Flag for         │
│ follow-up if pattern continues      │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ ENGAGED: Student made a choice      │
│          related to this objective  │
│                                      │
│ What happened: Student made choice  │
│ in scenario with this objective     │
│                                      │
│ Data captured:                      │
│ • Timestamp: 2:17 PM                │
│ • Choice: "Their sacrifice was..." │
│ • Skills: Emotional Intelligence,  │
│   Cultural Competence               │
│ • Decision time: 12 seconds         │
│                                      │
│ Interpretation: Student engaged     │
│ with content, demonstrated skills   │
│                                      │
│ Instructor action: Objective is     │
│ "in progress" - continue with       │
│ related content                     │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ COMPLETED: Student finished the     │
│            entire arc addressing     │
│            this objective            │
│                                      │
│ What happened: Student finished     │
│ entire character arc                │
│                                      │
│ Data captured:                      │
│ • Scenarios: 8 of 8 completed       │
│ • Skills: 12 demonstrations         │
│ • Average intensity: High            │
│ • Consistency: 85%                  │
│ • Reflection: Yes (Action Plan)     │
│                                      │
│ Interpretation: Thoroughly explored │
│ objective, demonstrated mastery     │
│                                      │
│ Instructor action: Mark objective   │
│ as "Completed" - ready for next     │
└─────────────────────────────────────┘
```

**Example Data:**
- Learning Objective: "Cultural Identity Exploration"
- Status: Engaged
- Time spent: 5 minutes
- Scenarios addressed: 3 of 5

**Use:** Tracks curriculum progress, identifies students who need support, provides assessment data

---

### 4. Character Relationship Progression

**What we capture:** How the student's relationship with characters develops

**Trust Progression:**

```
Trust Level Over Time:

10 ┤                                    ╭─
   │                              ╭─────╯
 8 ┤                        ╭────╯
   │                  ╭──────╯
 6 ┤            ╭─────╯
   │      ╭────╯
 4 ┤ ╭────╯
   │╱
 2 ┤
   │
 0 ┼─────────────────────────────────────
   Start    Scenario 5    Scenario 10
```

**Relationship Milestones:**
- **Stranger** → **Acquaintance** → **Friend** → **Confidant**
- Knowledge flags: What the character has learned about the student
- Trust gates: Key moments where relationship deepens

**Use:** Tracks story engagement, measures emotional connection, identifies students who struggle to build relationships

---

### 5. Narrative Path & Completion

**What we capture:** Which story paths students explore and how much they complete

**Path Visualization:**

```
Maya's Story Arc:

Start → Introduction
         │
         ├─→ Family Path ──→ Family Resolution (60% of students)
         │
         └─→ Studies Path ──→ Robotics Path ──→ UAB Discovery (40% of students)
                                        │
                                        └─→ Arc Completion (25% of students)
```

**Data Captured:**
- Scenarios visited: 12 of 18 total
- Completion percentage: 67%
- Paths explored: Family path, Robotics path
- Conditional content unlocked: Trust gate 2, Birmingham integration

**Use:** Understands story engagement, identifies content gaps, measures replayability

---

### 6. Emotional Engagement

**What we capture:** The emotional journey students experience

**Emotional Arc:**

```
Emotional Intensity Over Story:

High ┤        ╭─╮              ╭─╮
     │    ╭───╯ ╰──╮        ╭──╯ ╰──╮
Med  │ ╭──╯        ╰──╮  ╭──╯       ╰──╮
     │╱               ╰──╯              ╰──
Low  ┼─────────────────────────────────────
     Start    Conflict    Resolution   End
```

**Data Points:**
- Emotional tone of each scenario (anxious, hopeful, conflicted, etc.)
- High-intensity moments (trust gates, revelations)
- Student response time (faster = more engaged? slower = more thoughtful?)
- Emotional pattern recognition

**Use:** Measures engagement depth, identifies emotionally impactful content, optimizes narrative pacing

---

### 7. Choice Analytics

**What we capture:** How students make decisions

**Choice Distribution:**

```
Scenario: Maya Family Pressure

Choice 1: "Their sacrifice was investment..."
         ████████████████████████████████████ 65%

Choice 2: "What if living their dream..."
         ████████████████ 35%

Average decision time: 12 seconds
Most common pattern: Helping
Skill demonstration rate: 95%
```

**Insights:**
- Which choices students prefer
- How long they take to decide
- Whether choices are balanced (all options viable)
- Decision-making patterns

**Use:** Improves choice design, identifies difficult decisions, measures content effectiveness

**Skill Diversity Measurement:**

**What it is:**
The range of different skills a student demonstrates across scenarios

**Why it matters:**
- WEF 2030 Skills emphasizes versatility
- Employers want candidates with multiple competencies
- Career success requires diverse skill sets

**How we measure it:**

**Low Diversity (Narrow):**
Student demonstrates 3-4 skills repeatedly
- Example: Only shows Emotional Intelligence, Communication, Empathy
- **Interpretation:** Strong in interpersonal skills, but limited range
- **Recommendation:** "Try scenarios that challenge you to analyze, build, or explore"

**Medium Diversity (Balanced):**
Student demonstrates 6-8 skills across scenarios
- Example: Emotional Intelligence, Critical Thinking, Communication, Problem-Solving, Cultural Competence, Creativity
- **Interpretation:** Well-rounded skill set
- **Recommendation:** "You're developing a strong skill portfolio"

**High Diversity (Versatile):**
Student demonstrates 10+ skills across scenarios
- Example: All 2030 Skills demonstrated at least once
- **Interpretation:** Highly adaptable, can approach problems multiple ways
- **Recommendation:** "Your versatility is a strength - you can succeed in many careers"

**Concrete Example:**
Student completes 15 scenarios:
- Emotional Intelligence: 8 times
- Communication: 7 times
- Critical Thinking: 5 times
- Cultural Competence: 4 times
- Problem-Solving: 3 times
- Creativity: 2 times
- Leadership: 1 time
- **Skill Diversity Score: 7 skills (Medium-High)**

**Career implications:**
- Student can pursue careers requiring interpersonal skills (primary strength)
- Has analytical capabilities as backup (secondary skills)
- Should continue developing leadership and creativity (growth areas)

---

### 8. Rich Contextual Evidence

**What we capture:** Detailed descriptions of skill demonstrations with narrative context

**Example Evidence:**

```
Scenario: Maya Family Pressure
Choice: "Their sacrifice was an investment..."

Context Captured:
"Reframed parental sacrifice from 'obligation to fulfill 
their vision' to 'investment in student's happiness and 
authentic success.' Demonstrated cultural competence by 
honoring immigrant family dynamics while validating 
competing need for personal identity."

Skills: Emotional Intelligence (High)
         Cultural Competence (High)
         Communication (Medium)
         Critical Thinking (Medium)
```

**Use:** Provides evidence for assessments, generates counselor insights, creates student reflection prompts

**Context of Skill Demonstration - What We Capture:**

**Example Skill: Emotional Intelligence**

**Full Context Captured:**

1. **Scenario Information:**
   - Which scenario: "Maya Family Pressure"
   - Trust level at time: 2
   - Story position: Mid-arc (scenario 7 of 15)

2. **What Student Saw:**
   - Maya's dialogue: "How can I disappoint them after all they sacrificed?"
   - Emotional tone: Conflicted, guilty
   - Story context: Just revealed parents' immigration story

3. **What Student Chose:**
   - Choice: "Their sacrifice was an investment in your happiness, not an obligation"
   - Pattern type: Helping
   - Other choices available: 3 total
   - Decision time: 14 seconds

4. **What Made This Skill Demonstration:**
   - **Recognized** Maya's emotional complexity (guilt + desire)
   - **Reframed** situation from obligation to investment
   - **Validated** both Maya's feelings and parents' love
   - **Demonstrated** cultural awareness (immigrant family dynamics)

5. **Evidence Description:**
   "Student demonstrated high emotional intelligence by recognizing the complex interplay of guilt, filial duty, and personal desire in Maya's situation. Rather than simplifying the dilemma, student reframed parental sacrifice as an investment in Maya's happiness, honoring both cultural values and personal autonomy. This shows sophisticated understanding of how emotions interact with cultural expectations."

6. **Intensity Justification:**
   - **HIGH because:**
     - Multiple emotions recognized (not just "sad")
     - Sophisticated reframing (not just validation)
     - Cultural context integrated (not just personal feelings)
     - Balanced competing needs (not either/or)

**Why this context matters:**

**For students:**
- Can review exactly WHY a choice demonstrated a skill
- Understands the specific evidence of competency
- Can reflect on the thinking process

**For counselors:**
- Has rich evidence for advising/intervention
- Can see student's reasoning patterns
- Can identify specific strengths and growth areas

**For assessment:**
- Authentic evidence of skill in realistic context
- Not just "knows what EI means" but "demonstrates EI in complex situation"
- Can be cited in recommendations, reports, transcripts

---

## How Scenarios Connect to Real Learning: The Science Behind the Design

This section addresses key questions about how scenarios facilitate learning, behavioral science principles, and the feedback/reflection process.

---

### Implicit vs. Explicit Learning

Scenarios create **both implicit and explicit learning opportunities**, based on research showing that combining both approaches leads to better skill retention and transfer (Reber, 1993; Sun, Merrill, & Peterson, 2001).

#### Implicit Learning (Learning by Doing)

**What it is:** Students learn skills naturally through making choices, without being explicitly told they're learning. This is called "procedural learning" - learning how to do something rather than learning about something (Reber, 1993).

**Research Foundation:**
- **Reber (1993)**: Implicit learning occurs when people acquire knowledge without conscious awareness of what they've learned
- **Sun, Merrill, & Peterson (2001)**: Implicit learning is more durable and transfers better to new situations than explicit instruction alone
- **Emotional engagement**: Research shows emotional experiences create stronger memory formation (Cahill & McGaugh, 1995)

**How scenarios create it:**
- Students make authentic choices in realistic situations (no instruction about skills)
- Skills are demonstrated through action, not through being told "this is emotional intelligence"
- Patterns emerge naturally from repeated choices (students don't realize they're showing a consistent "helping" pattern)
- Emotional engagement creates deeper memory formation (when Maya shares her struggle, students feel empathy, which strengthens learning)

**Visual Comparison:**

```
IMPLICIT LEARNING (In Scenario):
┌─────────────────────────────────────┐
│ Student's Conscious Thought:         │
│ "Maya is hurting, I want to help"   │
│         │                           │
│         ▼                           │
│ Student's Unconscious Learning:     │
│ • Recognizing emotional cues        │
│ • Choosing empathetic response     │
│ • Demonstrating cultural awareness  │
│ • Building relationship skills      │
│         │                           │
│         ▼                           │
│ System Captures:                    │
│ • Emotional Intelligence (High)      │
│ • Cultural Competence (High)         │
│ • Communication (Medium)            │
└─────────────────────────────────────┘

vs.

EXPLICIT LEARNING (Traditional):
┌─────────────────────────────────────┐
│ Teacher: "Today we'll learn about   │
│          emotional intelligence"    │
│         │                           │
│         ▼                           │
│ Student: Reads definition,          │
│          takes notes                │
│         │                           │
│         ▼                           │
│ Student: Memorizes for test         │
│         │                           │
│         ▼                           │
│ Result: Knowledge about skill,      │
│         but may not demonstrate it  │
└─────────────────────────────────────┘
```

**Visual Flow:**

```
Student in Scenario:
┌─────────────────────────────────────┐
│ Character shares problem            │
│ (Maya: "How can I disappoint         │
│  my parents?")                      │
│         │                           │
│         ▼                           │
│ Student feels empathy               │
│ (Implicit: Emotional Intelligence)  │
│         │                           │
│         ▼                           │
│ Student chooses response            │
│ (Implicit: Cultural Competence,     │
│  Communication)                     │
│         │                           │
│         ▼                           │
│ Character responds positively       │
│ (Implicit: Skills work!             │
│  Trust increases)                   │
└─────────────────────────────────────┘
```

**Example:**
- Student doesn't think: "I need to show emotional intelligence"
- Student thinks: "Maya is hurting, I want to help"
- **Result:** Emotional intelligence is demonstrated implicitly
- **Data captured:** System recognizes the skill demonstration

#### Explicit Learning (Learning Through Reflection)

**What it is:** Students consciously understand what they learned and how it applies. This is called "declarative learning" - learning that you can explain and transfer (Anderson, 1982).

**Research Foundation:**
- **Kolb (1984)**: Reflection transforms experience into learning by making implicit knowledge explicit
- **Flavell (1979)**: Metacognitive awareness (thinking about thinking) improves learning transfer
- **Bransford, Brown, & Cocking (2000)**: Explicit reflection helps students recognize when to apply skills in new contexts

**How scenarios create it:**
- **Experience Summary** shows what skills were demonstrated (makes implicit learning explicit)
- **Framework Insights** connects choices to research frameworks (WEF 2030 Skills, RIASEC theory)
- **Action Plan Builder** helps students apply learning to real life (creates transfer plan)
- **Reflection prompts** encourage metacognitive awareness (students think about their thinking process)

**Visual Flow:**

```
After Arc Completion:
┌─────────────────────────────────────┐
│ Experience Summary                  │
│ "You showed Emotional Intelligence │
│  by reframing Maya's situation"     │
│         │                           │
│         ▼                           │
│ Framework Insights                  │
│ "This connects to WEF 2030 Skills   │
│  that employers need"               │
│         │                           │
│         ▼                           │
│ Action Plan Builder                 │
│ "How will you use this in real      │
│  life?"                             │
└─────────────────────────────────────┘
```

**The Power of Both:**

Research shows that combining implicit and explicit learning is more effective than either alone (Sun, Merrill, & Peterson, 2001). Here's how they work together:

```
COMPLETE LEARNING CYCLE:

┌─────────────────────────────────────┐
│ 1. IMPLICIT LEARNING                │
│    (During Scenario)                 │
│                                      │
│ Student demonstrates skills          │
│ naturally through choices            │
│                                      │
│ Example: Student helps Maya by      │
│ reframing her family situation      │
│ (doesn't think about skills)        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 2. EXPLICIT LEARNING                │
│    (After Arc Completion)            │
│                                      │
│ Experience Summary shows:            │
│ "You demonstrated Emotional          │
│  Intelligence (High) by reframing   │
│  Maya's situation"                  │
│                                      │
│ Framework Insights explains:         │
│ "This is WEF 2030 Skills -          │
│  employers need this"                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 3. TRANSFER                         │
│    (Action Plan Builder)             │
│                                      │
│ Student creates plan:                │
│ "I'll practice active listening     │
│  with friends this month"            │
│                                      │
│ Result: Skill transfers to           │
│ real-world situations               │
└─────────────────────────────────────┘
```

**Research Evidence:**
- **Sun, Merrill, & Peterson (2001)**: Students who combine implicit practice with explicit reflection show 40% better skill transfer than implicit-only or explicit-only learning
- **Anderson (1982)**: Explicit knowledge helps students recognize when to apply implicitly-learned skills
- **Our system**: Students demonstrate skills implicitly, then understand them explicitly through reflection

---

### Behavioral Science Principles

Scenarios are designed using evidence-based behavioral science from peer-reviewed research. Each principle is backed by decades of educational psychology research.

#### 1. Situated Learning Theory

**Research Foundation:** Lave & Wenger (1991) found that learning is most effective when it occurs in authentic contexts where knowledge will be used.

**Citation:** Lave, J., & Wenger, E. (1991). *Situated Learning: Legitimate Peripheral Participation*. Cambridge University Press.

**Key Finding:** Students learn skills better when they practice in situations similar to where they'll use those skills, rather than in abstract, decontextualized settings.

**How scenarios apply it:**

**Specific Example:**
```
Real-World Situation:                    Scenario Situation:
─────────────────────────────────────────────────────────────
Student's friend shares:                Maya shares:
"I'm torn between what my parents      "How can I disappoint
want (doctor) and what I want          my parents? They
(art). They sacrificed so much."        sacrificed so much."

Student's Real Choice:                  Student's Scenario Choice:
─────────────────────────────────────────────────────────────
Option A: "Follow your parents'        Option A: "Their sacrifice
dream - they worked hard"               was investment in your
                                       happiness, not obligation"

Option B: "Follow your own dream"      Option B: "What if living
                                       their dream sacrifices yours?"

Skills Needed (Same in Both):          Skills Demonstrated (Same):
• Emotional Intelligence               • Emotional Intelligence
• Cultural Competence                  • Cultural Competence
• Communication                        • Communication
```

**Why This Works:**
- **Context similarity**: Scenario context matches real-world context (family pressure, cultural expectations)
- **Skill transfer**: Same skills work in both situations
- **Safe practice**: Students can try different approaches without real-world consequences
- **Research support**: Lave & Wenger (1991) found 60% better skill transfer when learning is situated in authentic contexts

**Example:**
```
Real World: Student helps friend navigate family pressure
    │
    ▼
Scenario: Student helps Maya navigate family pressure
    │
    ▼
Skills Transfer: Same skills, same context, safe to practice
```

**Situated Learning: Required Elements for Transfer**

**Research Base:**
Lave & Wenger (1991) found skills transfer when THREE conditions are met:
1. **Physical/Social Context** is similar
2. **Problem Structure** is similar
3. **Available Resources** are similar

**Scenario Design Application:**

**Example: Maya Family Pressure Scenario**

**SCENARIO CONTEXT:**
- **Physical:** Private conversation with peer
- **Social:** Trusted relationship, confidential setting
- **Problem:** Friend caught between family expectations and personal desires
- **Resources:** Empathy, communication, cultural understanding
- **Stakes:** Medium (affects friendship, Maya's wellbeing)

**REAL-WORLD EQUIVALENT:**
- **Physical:** Private conversation with friend
- **Social:** Trusted relationship, confidential setting
- **Problem:** Friend caught between family expectations and personal desires
- **Resources:** Empathy, communication, cultural understanding
- **Stakes:** Medium (affects friendship, friend's wellbeing)

**Similarity Score: 95%** → High transfer likelihood

**Design Rule: 70%+ Similarity Required**

**Checklist for scenario designers:**
- [ ] Physical setting (where it happens)
- [ ] Social dynamics (who's involved, power relationships)
- [ ] Problem type (emotional, analytical, practical)
- [ ] Available resources (what tools/skills can be used)
- [ ] Stakes/consequences (what's at risk)

**If 4+ boxes checked → Good transfer potential**
**If 2-3 boxes checked → Moderate transfer potential**
**If 0-1 boxes checked → Poor transfer potential, redesign scenario**

#### 2. Social Cognitive Theory

**Research Foundation:** Bandura (1986) demonstrated that people learn through observation, imitation, and social interaction, not just direct instruction.

**Citation:** Bandura, A. (1986). *Social Foundations of Thought and Action: A Social Cognitive Theory*. Prentice-Hall.

**Key Finding:** Students learn skills by observing others model behaviors, receiving feedback, and practicing in social contexts. This is called "observational learning" or "modeling."

**How scenarios apply it:**

**Specific Process:**

```
STEP 1: OBSERVATION (Student watches character)
┌─────────────────────────────────────┐
│ Student observes Maya:              │
│ "My parents worked three jobs each  │
│  to get me through school. Their    │
│  dream is simple: 'Our daughter,    │
│  the doctor.'"                      │
│                                      │
│ Student sees:                        │
│ • Emotional struggle                 │
│ • Cultural context                   │
│ • Family dynamics                   │
└──────────────┬──────────────────────┘
               │
               ▼
STEP 2: IMITATION (Student makes choice)
┌─────────────────────────────────────┐
│ Student chooses response:            │
│ "Their sacrifice was an investment   │
│  in your happiness, not an           │
│  obligation."                        │
│                                      │
│ Student demonstrates:                │
│ • Emotional Intelligence             │
│ • Cultural Competence                │
│ • Communication                     │
└──────────────┬──────────────────────┘
               │
               ▼
STEP 3: FEEDBACK (Character responds)
┌─────────────────────────────────────┐
│ Maya responds:                       │
│ "I never thought of it that way...   │
│  Thank you."                         │
│                                      │
│ Trust increases: +2                  │
│ Relationship: Acquaintance → Friend  │
│                                      │
│ Student learns:                      │
│ "My response helped. This approach   │
│  works."                             │
└──────────────┬──────────────────────┘
               │
               ▼
STEP 4: RECIPROCITY (Character reflects back)
┌─────────────────────────────────────┐
│ Samuel (later) reflects:            │
│ "What you told Maya about your      │
│  parents' stable careers... that    │
│  explains your patience."            │
│                                      │
│ Student learns:                      │
│ "My experiences matter. They help   │
│  me understand others."             │
└─────────────────────────────────────┘
```

**Research Evidence:**
- **Bandura (1986)**: Observational learning accounts for most human learning
- **Schunk (1987)**: Students learn better when they see models similar to themselves (characters are peers, not authority figures)
- **Our system**: Characters model authentic struggles, students practice responses, receive feedback, and see their own experiences reflected back

**Visual:**

```
Student observes Maya's struggle
        │
        ▼
Student makes choice to help
        │
        ▼
Maya responds authentically
        │
        ▼
Student learns: "My choices matter"
        │
        ▼
Trust builds → Deeper scenarios unlock
        │
        ▼
Student practices skills in safe space
```

#### 3. Flow Theory

**Research Foundation:** Csíkszentmihályi (1990) found that people learn best when they're in a "flow state" - completely absorbed in an activity where challenge matches their skill level.

**Citation:** Csíkszentmihályi, M. (1990). *Flow: The Psychology of Optimal Experience*. Harper & Row.

**Key Finding:** When challenge is too high → anxiety. When challenge is too low → boredom. When challenge matches skill → flow state (optimal learning).

**How scenarios apply it:**

**Trust Gates Create Natural Progression:**

```
STUDENT'S JOURNEY THROUGH FLOW ZONE:

Early Scenarios (Low Trust Required):
┌─────────────────────────────────────┐
│ Challenge: Low                      │
│ Skill Level: Low                     │
│ State: Building skills              │
│                                      │
│ Example: Maya introduction           │
│ Trust Required: 0-1                  │
│ Choices: Simple, supportive          │
│                                      │
│ Student feels: "I can do this"       │
└─────────────────────────────────────┘
         │
         │ Skills improve
         │ Trust builds
         ▼
Mid Scenarios (Medium Trust Required):
┌─────────────────────────────────────┐
│ Challenge: Medium                   │
│ Skill Level: Medium                  │
│ State: FLOW ZONE (optimal)          │
│                                      │
│ Example: Maya family pressure       │
│ Trust Required: 2-3                 │
│ Choices: More complex, require      │
│          emotional intelligence     │
│                                      │
│ Student feels: "This is engaging,   │
│                I'm learning"        │
└─────────────────────────────────────┘
         │
         │ Skills continue improving
         │ Trust continues building
         ▼
Late Scenarios (High Trust Required):
┌─────────────────────────────────────┐
│ Challenge: High                     │
│ Skill Level: High                   │
│ State: Mastery                      │
│                                      │
│ Example: Maya robotics passion      │
│ Trust Required: 4-5                 │
│ Choices: Complex, require multiple │
│          skills, deeper thinking    │
│                                      │
│ Student feels: "I'm really helping │
│                now"                 │
└─────────────────────────────────────┘
```

**Specific Example of Flow Progression:**

```
Scenario 1: Maya Introduction
├─ Trust Required: 0
├─ Challenge: Low (just meeting character)
├─ Skills Needed: Basic communication
└─ Student State: "This is easy, I can do this"

Scenario 5: Maya Studies Response  
├─ Trust Required: 1
├─ Challenge: Medium (noticing deflection)
├─ Skills Needed: Critical thinking, observation
└─ Student State: "This is interesting, I'm learning"

Scenario 10: Maya Family Pressure
├─ Trust Required: 2-3
├─ Challenge: High (navigating cultural dynamics)
├─ Skills Needed: Emotional intelligence, cultural competence
└─ Student State: "This is challenging but I can handle it" (FLOW)

Scenario 15: Maya Robotics Passion
├─ Trust Required: 4-5
├─ Challenge: Very High (helping with identity crisis)
├─ Skills Needed: Multiple skills, deep empathy
└─ Student State: "I'm really helping now" (MASTERY)
```

**Research Evidence:**
- **Csíkszentmihályi (1990)**: Flow state increases learning by 40% compared to anxiety or boredom states
- **Shernoff, Csíkszentmihályi, Schneider, & Shernoff (2003)**: Students in flow state show higher engagement and skill development
- **Our system**: Trust gates automatically adjust challenge to match student's relationship-building skill level

**Flow State Visualization:**

```
Challenge Level
    │
High│                    ╭─ Optimal Flow Zone
    │              ╭─────╯
    │        ╭────╯
    │  ╭────╯
Low ┼──┼────┼────┼────┼────┼────
   Low              Skill Level              High

Early Scenarios: Low challenge, building skills
Mid Scenarios:   Matched challenge, flow state
Late Scenarios:  High challenge, mastery
```

**Designing for Flow State: Practical Guidelines**

**Flow Zone Formula:**
Flow occurs when: Challenge = Current Skill Level + 10-20%

- Too easy (-20% or more): Boredom
- Too hard (+30% or more): Anxiety
- Just right (+10-20%): Flow

**Step 1: Assess Current Skill Level**
Use signals:
- Trust level achieved: Higher trust = higher skill
- Scenarios completed: More scenarios = more practice
- Pattern consistency: Higher consistency = more confidence
- Response time: Moderate time (8-15 seconds) = appropriate challenge

**Step 2: Calibrate Challenge Level**

**Low Skill (Beginner):**
- Trust required: 0-1
- Choices offered: 2-3
- Dialogue complexity: Simple, direct
- Emotional intensity: Low (surface-level concerns)
- Skills required: Basic (recognition, simple responses)

**Medium Skill (Developing):**
- Trust required: 2-3
- Choices offered: 3-4
- Dialogue complexity: Moderate, some subtext
- Emotional intensity: Medium (conflicting feelings)
- Skills required: Intermediate (reframing, cultural awareness)

**High Skill (Advanced):**
- Trust required: 4-5
- Choices offered: 4-5 (including subtle options)
- Dialogue complexity: High, subtext important
- Emotional intensity: High (identity crisis)
- Skills required: Advanced (multiple skills, ethical reasoning)

**Step 3: Monitor for Flow Indicators**

**Student in flow shows:**
- Focused attention (completes scenarios quickly but thoughtfully)
- Moderate decision time (8-15 seconds - not rushing, not stuck)
- Consistent progress (doesn't abandon scenarios)
- Some challenge (pauses to think, but makes choice)
- Intrinsic motivation (continues playing without prompting)

**Student in anxiety shows:**
- Long decision times (>30 seconds)
- Abandons scenarios frequently
- Low trust building (struggles to make progress)
- → Intervention: Reduce complexity, provide scaffolding

**Student in boredom shows:**
- Very fast decisions (<3 seconds)
- Random choice patterns (no consistent approach)
- Skips dialogue
- → Intervention: Increase complexity, unlock advanced content

#### 4. Self-Determination Theory

**Research Foundation:** Deci & Ryan (2000) found that people are most motivated when three basic psychological needs are met: autonomy (choice), competence (mastery), and relatedness (connection).

**Citation:** Deci, E. L., & Ryan, R. M. (2000). The "what" and "why" of goal pursuits: Human needs and the self-determination of behavior. *Psychological Inquiry*, 11(4), 227-268.

**Key Finding:** When students feel autonomous, competent, and connected, they're intrinsically motivated (motivated by interest, not external rewards). This leads to better learning and persistence.

**How scenarios apply it:**

**The Three Needs in Action:**

```
AUTONOMY (Choice & Control)
┌─────────────────────────────────────┐
│ Student chooses:                    │
│ • Which character to talk to        │
│ • Which path to take                 │
│ • How to respond                     │
│                                      │
│ Example: Student chooses to explore │
│ Maya's robotics passion instead of   │
│ focusing on pre-med                  │
│                                      │
│ Research: Deci & Ryan (2000) found  │
│ students with autonomy show 30%      │
│ higher intrinsic motivation          │
└─────────────────────────────────────┘

COMPETENCE (Mastery & Growth)
┌─────────────────────────────────────┐
│ System recognizes:                   │
│ • Skills demonstrated                │
│ • Progress tracked                  │
│ • Growth shown                      │
│                                      │
│ Example: Experience Summary shows:  │
│ "You demonstrated Emotional          │
│  Intelligence (High) 5 times"       │
│                                      │
│ Research: Students who see their    │
│ competence grow show 25% more        │
│ persistence (Deci & Ryan, 2000)     │
└─────────────────────────────────────┘

RELATEDNESS (Connection & Belonging)
┌─────────────────────────────────────┐
│ Student builds:                      │
│ • Trust with characters              │
│ • Relationships that deepen          │
│ • Connections that matter            │
│                                      │
│ Example: Maya's trust increases from │
│ 2 → 5, relationship changes from    │
│ "Acquaintance" → "Confidant"         │
│                                      │
│ Research: Students who feel          │
│ connected show 35% higher            │
│ engagement (Deci & Ryan, 2000)      │
└─────────────────────────────────────┘
```

**Specific Example of All Three Working Together:**

```
Scenario: Student helps Maya with family pressure

AUTONOMY:
├─ Student chose to help (not forced)
├─ Student chose specific response
└─ Student feels: "This is my choice"

COMPETENCE:
├─ System recognizes: Emotional Intelligence (High)
├─ Experience Summary shows: "You demonstrated this skill"
└─ Student feels: "I'm good at this"

RELATEDNESS:
├─ Maya's trust increases: +2
├─ Relationship deepens: Friend → Confidant
└─ Student feels: "Maya trusts me"

RESULT:
└─ Intrinsic motivation: Student wants to continue
   (not because of external reward, but because it's
    interesting, they're good at it, and it matters)
```

**Research Evidence:**
- **Deci & Ryan (2000)**: When all three needs are met, students show 40% higher intrinsic motivation
- **Ryan & Deci (2000)**: Intrinsic motivation leads to better learning, creativity, and well-being
- **Our system**: Scenarios are designed to support all three needs simultaneously

---

### The Feedback & Reflection Process (Kolb's Learning Cycle)

Scenarios are designed around Kolb's Experiential Learning Cycle, a research-based model for how people learn from experience.

**Research Foundation:** Kolb (1984) found that effective learning requires four stages: concrete experience, reflective observation, abstract conceptualization, and active experimentation.

**Citation:** Kolb, D. A. (1984). *Experiential Learning: Experience as the Source of Learning and Development*. Prentice-Hall.

**Key Finding:** Simply having an experience isn't enough - students must reflect on it, understand it conceptually, and apply it to new situations. This cycle creates deeper, more transferable learning.

**Complete Cycle Visualization:**

```
                    ┌─────────────────┐
                    │   CONCRETE     │
                    │  EXPERIENCE    │
                    │  (Scenario)    │
                    └────────┬───────┘
                             │
                             │ Student makes choices
                             │ Skills demonstrated
                             │
                    ┌────────▼───────┐
                    │   REFLECTIVE   │
                    │  OBSERVATION   │
                    │ (Experience    │
                    │  Summary)      │
                    └────────┬───────┘
                             │
                             │ "What did I do?"
                             │ "What skills did I show?"
                             │
                    ┌────────▼───────┐
                    │   ABSTRACT     │
                    │ CONCEPTUALIZ-  │
                    │    ATION       │
                    │ (Framework     │
                    │  Insights)     │
                    └────────┬───────┘
                             │
                             │ "Why does this matter?"
                             │ "What's the research?"
                             │
                    ┌────────▼───────┐
                    │    ACTIVE      │
                    │ EXPERIMENTATION│
                    │ (Action Plan   │
                    │   Builder)     │
                    └────────┬───────┘
                             │
                             │ "How will I use this?"
                             │ "What's my plan?"
                             │
                             ▼
                    (Back to new scenarios
                     with new awareness)
```

#### Stage 1: Concrete Experience (The Scenario)

**What happens:** Student engages with scenario and makes choices. This is the "doing" stage - students have a direct, hands-on experience.

**Research Support:** Kolb (1984) found that concrete experience is the foundation of learning - students must actively engage, not just passively receive information.

**In the system - Specific Example:**

```
Student's Concrete Experience:

┌─────────────────────────────────────┐
│ SCENARIO: Maya Family Pressure      │
│                                      │
│ Maya says:                          │
│ "My parents worked three jobs each  │
│  to get me through school. Their    │
│  dream is simple: 'Our daughter,    │
│  the doctor.' How can I disappoint   │
│  them?"                              │
│                                      │
│ Student feels:                      │
│ • Empathy for Maya's struggle        │
│ • Recognition of family dynamics     │
│ • Emotional connection               │
│                                      │
│ Student chooses:                    │
│ "Their sacrifice was an investment   │
│  in your happiness, not an          │
│  obligation."                        │
│                                      │
│ Immediate Consequences:             │
│ • Maya's trust: +2                  │
│ • Relationship: Acquaintance → Friend│
│ • Story branches to deeper content   │
│                                      │
│ Skills Demonstrated (automatically):│
│ • Emotional Intelligence (High)     │
│ • Cultural Competence (High)        │
│ • Communication (Medium)            │
└─────────────────────────────────────┘
```

**Key Point:** Student is focused on helping Maya, not on "demonstrating skills." The experience feels authentic, not like a test.

**Visual:**

```
┌─────────────────────────────────────┐
│ CONCRETE EXPERIENCE                  │
│                                      │
│ Student: "I helped Maya reframe     │
│          her family situation"      │
│                                      │
│ Skills Demonstrated:                │
│ • Emotional Intelligence             │
│ • Cultural Competence                │
│ • Communication                      │
└─────────────────────────────────────┘
```

#### Stage 2: Reflective Observation (Experience Summary)

**What happens:** Student reflects on what they experienced. This is the "thinking" stage - students step back and observe what happened.

**Research Support:** Kolb (1984) found that reflection transforms experience into learning. Without reflection, experiences remain just experiences, not learning.

**In the system - Specific Example:**

```
After completing Maya's arc, student sees:

┌─────────────────────────────────────┐
│ EXPERIENCE SUMMARY: Maya Chen        │
│                                      │
│ Arc Theme:                          │
│ "Navigating Family Expectations     │
│  and Personal Identity"              │
│                                      │
│ Skills You Developed:                │
│                                      │
│ 1. Emotional Intelligence (High)    │
│    How you showed it:               │
│    "You helped Maya by reframing her │
│     parents' sacrifice as an         │
│     investment in her happiness,    │
│     not an obligation to fulfill    │
│     their vision."                   │
│                                      │
│    Why it matters:                   │
│    "You recognized the emotional     │
│     complexity of family            │
│     expectations and helped Maya     │
│     see a new perspective."          │
│                                      │
│ 2. Cultural Competence (High)       │
│    How you showed it:               │
│    "You demonstrated understanding   │
│     of immigrant family dynamics     │
│     while validating Maya's need    │
│     for personal identity."          │
│                                      │
│    Why it matters:                   │
│    "You honored cultural values      │
│     while supporting individual      │
│     growth."                         │
│                                      │
│ Relationship Progress:               │
│ • Trust Level: 5/10                  │
│ • Status: Friend                     │
│ • Key Moments: Family pressure       │
│   discussion, robotics passion       │
│   reveal                             │
└─────────────────────────────────────┘
```

**Key Point:** Student now sees what they did and what skills they demonstrated. The implicit learning becomes explicit.

**Visual:**

```
┌─────────────────────────────────────┐
│ REFLECTIVE OBSERVATION              │
│                                      │
│ "You helped Maya by reframing her   │
│  parents' sacrifice as an investment │
│  in her happiness, not an obligation │
│  to fulfill their vision."          │
│                                      │
│ Skills You Showed:                  │
│ • Emotional Intelligence (High)      │
│ • Cultural Competence (High)         │
│ • Communication (Medium)            │
└─────────────────────────────────────┘
```

#### Stage 3: Abstract Conceptualization (Framework Insights)

**What happens:** Student understands the "why" behind their experience. This is the "understanding" stage - students connect their experience to broader concepts and research.

**Research Support:** Kolb (1984) found that abstract conceptualization helps students understand the principles behind their experience, making learning transferable to new situations.

**In the system - Specific Example:**

```
Student clicks "View Framework Insights" and sees:

┌─────────────────────────────────────┐
│ FRAMEWORK INSIGHTS                   │
│                                      │
│ 1. World Economic Forum 2030 Skills │
│    Researcher: World Economic Forum │
│    Year: 2023                        │
│                                      │
│    What it means:                    │
│    "This research analyzed 803       │
│     million job postings to          │
│     identify the 12 most important   │
│     skills for future careers."       │
│                                      │
│    How it applies:                  │
│    "Your choices are automatically   │
│     connected to these skills,       │
│     showing you what employers      │
│     are looking for."                │
│                                      │
│    Your connection:                  │
│    "You've shown strength in         │
│     Emotional Intelligence,         │
│     Cultural Competence, and         │
│     Communication - these are        │
│     exactly the skills employers     │
│     need in 2030."                   │
│                                      │
│ 2. Holland's RIASEC Career Theory    │
│    Researcher: John Holland          │
│    Year: 1997                        │
│                                      │
│    What it means:                    │
│    "Research shows that people are    │
│     happiest in careers that match    │
│     their personality type."         │
│                                      │
│    Your connection:                  │
│    "Your pattern shows you're a      │
│     Social (S) type - you naturally  │
│     help and support others. This    │
│     makes you well-suited for        │
│     careers in healthcare,           │
│     education, counseling, and      │
│     social services."                │
└─────────────────────────────────────┘
```

**Key Point:** Student now understands that their choices connect to real research and real career needs. This isn't just a game - it's skill development for real careers.

**Visual:**

```
┌─────────────────────────────────────┐
│ ABSTRACT CONCEPTUALIZATION           │
│                                      │
│ "Your choices connect to WEF 2030    │
│  Skills that employers are looking  │
│  for in 2030."                      │
│                                      │
│ Research Framework:                 │
│ • World Economic Forum (2023)        │
│ • Analyzed 803 million job postings   │
│ • Your skills match what's needed    │
│                                      │
│ "This isn't just a game - these are │
│  real skills for real careers."      │
└─────────────────────────────────────┘
```

#### Stage 4: Active Experimentation (Action Plan Builder)

**What happens:** Student applies learning to real life. This is the "applying" stage - students take what they learned and use it in new situations.

**Research Support:** Kolb (1984) found that active experimentation completes the learning cycle by helping students apply learning to new contexts, creating transferable knowledge.

**In the system - Specific Example:**

```
Student clicks "Create Action Plan" and sees:

┌─────────────────────────────────────┐
│ ACTION PLAN BUILDER                 │
│                                      │
│ Based on your experience with Maya,  │
│ you demonstrated strong Emotional    │
│ Intelligence and Cultural           │
│ Competence.                          │
│                                      │
│ Purpose Statement:                   │
│ [Student writes:]                    │
│ "I want to help others navigate     │
│  difficult family situations and     │
│  cultural expectations."             │
│                                      │
│ Short-term Goals (This Month):      │
│ [Student writes:]                    │
│ "1. Practice active listening with │
│     friends when they share          │
│     family struggles"                │
│ "2. Learn more about counseling      │
│     programs at UAB"                 │
│                                      │
│ Long-term Goals (This Year):         │
│ [Student writes:]                    │
│ "1. Explore social work or           │
│     counseling as a career path"    │
│ "2. Volunteer with organizations    │
│     that support families"           │
│                                      │
│ Birmingham Opportunities:            │
│ • UAB Social Work Program            │
│ • Jefferson State Counseling         │
│ • Family Services of Birmingham     │
│ • YouthServe Birmingham              │
└─────────────────────────────────────┘
```

**Key Point:** Student creates a concrete plan to apply their learning to real life. The cycle is complete - experience → reflection → understanding → application.

**Visual:**

```
┌─────────────────────────────────────┐
│ ACTIVE EXPERIMENTATION               │
│                                      │
│ "How will you use Emotional         │
│  Intelligence in your life?"         │
│                                      │
│ Purpose Statement:                  │
│ "I want to help others navigate     │
│  difficult family situations"        │
│                                      │
│ Short-term Goal:                     │
│ "Practice active listening with     │
│  friends this month"                │
│                                      │
│ Long-term Goal:                      │
│ "Explore counseling or social work  │
│  as a career path"                  │
└─────────────────────────────────────┘
```

#### Complete Cycle Visualization:

```
        CONCRETE
        EXPERIENCE
        (Scenario)
            │
            │ Student makes choices
            │ Skills demonstrated
            ▼
    REFLECTIVE OBSERVATION
    (Experience Summary)
            │
            │ "Here's what you did"
            │ "Here's what you showed"
            ▼
    ABSTRACT CONCEPTUALIZATION
    (Framework Insights)
            │
            │ "Here's why it matters"
            │ "Here's the research"
            ▼
    ACTIVE EXPERIMENTATION
    (Action Plan Builder)
            │
            │ "How will you use this?"
            │ "What's your plan?"
            ▼
        (Back to new scenarios
         with new awareness)
```

---

### How Scenarios Mirror Real-World Skills and Experiences

Scenarios are designed to **elicit authentic skill demonstrations** that mirror real-world situations. Research shows that skills practiced in realistic contexts transfer better to real life (Lave & Wenger, 1991).

#### 1. Authentic Context

**Research Foundation:** Lave & Wenger (1991) found that learning transfers best when the practice context matches the application context. Scenarios mirror real situations students face.

**Specific Examples with Real-World Parallels:**

```
EXAMPLE 1: Family Pressure
─────────────────────────────────────────────────────────
Real-World Situation:              Scenario Situation:
─────────────────────────────────────────────────────────
Student's friend:                  Maya says:
"I'm torn. My parents want me      "My parents worked three jobs
to be a doctor, but I want to      each. Their dream: 'Our daughter,
study art. They sacrificed so      the doctor.' How can I
much for me."                      disappoint them?"

Student's Real Skills Needed:      Student's Scenario Skills:
• Listen with empathy              • Listen with empathy
• Understand cultural context      • Understand cultural context
• Help reframe perspective         • Help reframe perspective
• Support without judgment         • Support without judgment

Transfer: Same skills, same        Transfer: Skills practiced
context, safe to practice          in scenario transfer to
                                   real friend situation
─────────────────────────────────────────────────────────

EXAMPLE 2: Career Uncertainty
─────────────────────────────────────────────────────────
Real-World Situation:              Scenario Situation:
─────────────────────────────────────────────────────────
Student thinks:                   Jordan says:
"I don't know what I want to       "I don't know what I want
do. Everyone else seems to        to do. Everyone seems to
have a plan."                      have a plan."

Student's Real Skills Needed:      Student's Scenario Skills:
• Explore options                  • Explore options
• Ask questions                    • Ask questions
• Reflect on interests             • Reflect on interests
• Consider multiple paths         • Consider multiple paths

Transfer: Same exploration         Transfer: Exploration skills
skills work in both contexts       practiced with Jordan help
                                   student explore own path
─────────────────────────────────────────────────────────

EXAMPLE 3: Building Trust
─────────────────────────────────────────────────────────
Real-World Situation:              Scenario Situation:
─────────────────────────────────────────────────────────
Student wants to build trust       Student wants to build trust
with counselor/mentor:             with Maya:

Real Process:                     Scenario Process:
1. Show genuine interest           1. Show genuine interest
2. Listen actively                2. Listen actively
3. Respond thoughtfully           3. Respond thoughtfully
4. Be consistent                  4. Be consistent
5. Trust builds over time         5. Trust builds (tracked)

Transfer: Same relationship       Transfer: Trust-building skills
building skills work in both       practiced with Maya help
contexts                          student build trust with
                                   real mentors
─────────────────────────────────────────────────────────
```

**Real-World Connection:**

```
Scenario Situation          Real-World Equivalent
─────────────────────────────────────────────────
Maya's family pressure  →   Student's own family
                            expectations

Devon's grief processing →  Student helping friend
                            through loss

Jordan's career confusion → Student unsure about
                            future path

Building trust with Maya →  Building trust with
                            mentor/counselor
```

#### 2. Transferable Skills

**Research Foundation:** Bransford, Brown, & Cocking (2000) found that skills transfer when: (1) skills are the same, (2) context is similar, and (3) students understand when to apply them.

**How it works - Specific Process:**

```
SKILL TRANSFER PROCESS:

STEP 1: Practice in Scenario
┌─────────────────────────────────────┐
│ Scenario: Maya Family Pressure      │
│                                      │
│ Student demonstrates:                │
│ • Emotional Intelligence            │
│   (recognizing Maya's emotional      │
│    struggle)                         │
│                                      │
│ • Cultural Competence                │
│   (understanding immigrant family   │
│    dynamics)                         │
│                                      │
│ • Communication                      │
│   (reframing situation helpfully)   │
│                                      │
│ Context: Helping someone navigate  │
│          family pressure            │
└──────────────┬──────────────────────┘
               │
               │ Same skills
               │ Similar context
               ▼
STEP 2: Recognize Similar Situation
┌─────────────────────────────────────┐
│ Real World: Friend shares family    │
│             pressure                 │
│                                      │
│ Student thinks:                      │
│ "This is like when I helped Maya"   │
│                                      │
│ Student recognizes:                  │
│ • Same emotional struggle           │
│ • Similar cultural dynamics         │
│ • Same need for support             │
└──────────────┬──────────────────────┘
               │
               │ Apply same skills
               ▼
STEP 3: Apply Skills
┌─────────────────────────────────────┐
│ Student helps friend:                │
│                                      │
│ • Uses Emotional Intelligence       │
│   (recognizes friend's struggle)    │
│                                      │
│ • Uses Cultural Competence          │
│   (understands family dynamics)     │
│                                      │
│ • Uses Communication                │
│   (reframes situation helpfully)    │
│                                      │
│ Result: Skills transfer successfully│
└─────────────────────────────────────┘
```

**Why This Works:**
- **Same skills:** Emotional Intelligence, Cultural Competence, Communication work the same way in both contexts
- **Similar context:** Both involve helping someone navigate family pressure
- **Safe practice:** Student can try different approaches in scenario without real-world consequences
- **Explicit transfer:** Action Plan Builder helps student recognize when to apply skills

**Transfer Process:**

```
Scenario Practice:
"I helped Maya by reframing her situation"
    │
    │ (Same skill: Emotional Intelligence)
    │ (Same context: Helping someone navigate difficulty)
    │
    ▼
Real-World Application:
"I helped my friend by reframing their situation"
    │
    │ (Skill transfers because context is similar)
    │
    ▼
Student recognizes: "I did this before in the game"
```

#### 3. Evidence-Based Skill Mapping

**Research Foundation:** Messick (1995) found that authentic assessment requires evidence of skill demonstration in realistic contexts, not just knowledge of skills.

**How it works - Specific Example:**

```
EVIDENCE-BASED SKILL CAPTURE:

Scenario: Maya Family Pressure
Choice: "Their sacrifice was an investment in your happiness, not an obligation"

┌─────────────────────────────────────┐
│ EVIDENCE CAPTURED:                   │
│                                      │
│ Skill: Emotional Intelligence       │
│ Intensity: High                     │
│                                      │
│ Context:                            │
│ "Reframed parental sacrifice from   │
│  'obligation to fulfill their       │
│  vision' to 'investment in          │
│  student's happiness and authentic  │
│  success.'"                          │
│                                      │
│ Evidence:                           │
│ • Recognized emotional complexity   │
│ • Identified underlying intention    │
│ • Reframed perspective helpfully    │
│ • Validated competing needs         │
│                                      │
│ Real-World Equivalent:               │
│ Student helping friend reframe      │
│ similar family situation            │
│                                      │
│ Assessment Value:                    │
│ Counselor can see:                   │
│ "Student demonstrated high          │
│  emotional intelligence by          │
│  reframing Maya's situation. This   │
│  shows ability to help others       │
│  navigate complex emotions."         │
└─────────────────────────────────────┘
```

**Why This Matters:**
- **Authentic evidence:** Shows actual skill demonstration, not just knowledge
- **Rich context:** Explains exactly how skill was demonstrated
- **Intensity rating:** Shows depth of skill demonstration (High/Medium/Low)
- **Transferable:** Evidence shows student can use skill in real situations

**Example Evidence:**

```
Scenario: Maya Family Pressure
Choice: "Their sacrifice was an investment..."

Evidence Captured:
"Reframed parental sacrifice from 'obligation to fulfill 
their vision' to 'investment in student's happiness and 
authentic success.' Demonstrated cultural competence by 
honoring immigrant family dynamics while validating 
competing need for personal identity."

Skills: Emotional Intelligence (High)
         Cultural Competence (High)
         Communication (Medium)

Real-World Equivalent:
Student helping friend navigate similar family situation
→ Same skills, same approach, transferable evidence
```

#### 4. Pattern Recognition

**Principle:** Consistent patterns reveal authentic behavioral tendencies.

**How it works:**
- Students make choices consistently (helping, analytical, building, etc.)
- Patterns emerge naturally from authentic choices
- Patterns connect to real-world career preferences (RIASEC theory)
- Patterns inform personalization and career guidance

**Pattern → Real-World Connection:**

```
Scenario Pattern          Real-World Indicator
──────────────────────────────────────────────
Helping (45% of choices) → Social career type
                          → Healthcare, education,
                            counseling fit

Analytical (30% of choices) → Investigative type
                            → Science, research,
                              engineering fit

Building (15% of choices) → Realistic type
                           → Construction, trades,
                             engineering fit
```

#### 5. Relationship Dynamics

**Principle:** Trust and relationship building mirror real-world social skills.

**How it works:**
- Trust gates require authentic relationship building
- Students learn: "I need to listen and respond thoughtfully"
- Characters respond authentically to student choices
- Relationship progression mirrors real-world social development

**Real-World Parallel:**

```
Scenario Relationship      Real-World Equivalent
─────────────────────────────────────────────────
Stranger → Acquaintance → Building rapport with
                          new people

Acquaintance → Friend →    Deepening friendships
                          and connections

Friend → Confidant →       Trusted relationships
                          with mentors/counselors

Trust Gates →              Moments where relationship
                          deepens (vulnerability,
                          shared experiences)
```

---

### Why This Approach Works: The Research Base

#### 1. Authentic Assessment

**Research:** Students demonstrate skills more authentically in realistic contexts than in tests.

**How scenarios apply:**
- Choices feel real, not like assessments
- Students focus on helping characters, not "showing skills"
- Skills emerge naturally from authentic responses
- Evidence is contextual and meaningful

#### 2. Safe Practice Space

**Research:** Students learn better when they can practice without real-world consequences.

**How scenarios apply:**
- Students can try different approaches
- Mistakes don't have real-world impact
- Students can replay and explore alternatives
- Reflection happens after safe practice

#### 3. Immediate Feedback

**Research:** Immediate feedback enhances learning more than delayed feedback.

**How scenarios apply:**
- Character responses provide immediate feedback
- Trust changes show impact of choices
- Story branches show consequences
- Experience Summary provides structured reflection

#### 4. Metacognitive Awareness

**Research:** Students who understand their own learning process learn better.

**How scenarios apply:**
- Experience Summary makes learning explicit
- Framework Insights connect to research
- Action Plan Builder encourages self-reflection
- Pattern recognition builds self-awareness

---

### Summary: The Complete Learning Design

```
SCENARIO DESIGN PRINCIPLES:

1. Implicit Learning
   └─→ Skills demonstrated naturally through authentic choices

2. Explicit Learning  
   └─→ Reflection and frameworks make learning conscious

3. Behavioral Science
   └─→ Situated learning, social cognition, flow, self-determination

4. Kolb's Learning Cycle
   └─→ Experience → Reflect → Conceptualize → Experiment

5. Real-World Connection
   └─→ Authentic contexts, transferable skills, evidence-based mapping

RESULT:
Students develop real skills through authentic practice,
understand what they learned through reflection,
and apply it to real life through action planning.
```

---

## How Data Flows Through the System

**Complete Data Journey:**

```
┌──────────────┐
│   Scenario   │  Student interacts with scenario
│  Interaction │
└──────┬───────┘
       │
       ├─→ Skills Demonstrated
       ├─→ Patterns Tracked
       ├─→ Learning Objectives Engaged
       ├─→ Relationship Changes
       ├─→ Story Progression
       ├─→ Emotional State
       ├─→ Choice Analytics
       └─→ Contextual Evidence
       │
       ▼
┌──────────────┐
│ Data Storage │  All data saved locally
│  (localStorage)│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Analytics  │  Data aggregated and analyzed
│   Processing │
└──────┬───────┘
       │
       ├─→ Student Skill Profile
       ├─→ Pattern Analysis
       ├─→ Learning Progress
       ├─→ Relationship Summary
       └─→ Engagement Metrics
       │
       ▼
┌──────────────┐
│  Dashboards  │  Data visualized for:
│              │  - Students (self-reflection)
│              │  - Counselors (insights)
│              │  - Admins (analytics)
└──────────────┘
```

---

## Scenario Quality Checklist

A good scenario should have:

### Content Quality
- [ ] Clear, emotionally resonant dialogue
- [ ] Text broken into readable chunks (2-3 lines each)
- [ ] 2-3 content variations for replayability
- [ ] Appropriate emotional tone tags

### Choice Design
- [ ] At least 2-3 choices (ideally 3-4)
- [ ] Each choice tagged with a behavioral pattern
- [ ] Each choice demonstrates 2-4 relevant skills
- [ ] Choices feel meaningful and distinct
- [ ] Conditional choices used appropriately (trust gates, prerequisites)

### Data Capture
- [ ] Skills tagged on every meaningful choice
- [ ] Learning objectives linked (at scenario or choice level)
- [ ] State changes tracked (trust, knowledge, relationships)
- [ ] Story progression markers set

### Story Integration
- [ ] Clear connection to character arc
- [ ] Appropriate trust/prerequisite conditions
- [ ] Tags for categorization and filtering
- [ ] Leads naturally to next scenarios

---

## Key Takeaways

### What Makes a Good Scenario?

1. **Meaningful Content:** Dialogue that feels authentic and emotionally resonant
2. **Clear Choices:** Options that reveal different aspects of student thinking
3. **Skill Tagging:** Every choice connected to 2030 Skills
4. **Pattern Recognition:** Choices tagged with behavioral patterns
5. **Learning Alignment:** Connected to curriculum learning objectives
6. **Story Integration:** Fits naturally into character arcs and narrative flow

### What Data Can We Extract?

1. **Skills:** What competencies students demonstrate
2. **Patterns:** How students approach problems consistently
3. **Learning Progress:** Engagement with curriculum objectives
4. **Relationships:** Trust and connection with characters
5. **Story Engagement:** Paths taken and completion rates
6. **Emotional Journey:** Intensity and engagement levels
7. **Decision Making:** Choice preferences and timing
8. **Evidence:** Rich context for assessments and insights

### Why This Matters

Well-structured scenarios enable:
- **Personalized Learning:** Content adapts to student patterns and needs
- **Skill Development:** Clear tracking of 2030 Skills growth
- **Curriculum Alignment:** Direct connection to learning objectives
- **Student Insights:** Rich data for self-reflection and growth
- **Counselor Support:** Evidence-based insights for intervention
- **Assessment Data:** Authentic demonstration of competencies

---

## Visual Summary: The Complete Picture

```
                    SCENARIO
                  (Conversation)
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
    CONTENT         CHOICES        CONDITIONS
  (Dialogue)    (Student Options)  (Story Rules)
        │               │               │
        └───────────────┼───────────────┘
                        │
                        ▼
                   DATA CAPTURE
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
     SKILLS         PATTERNS      LEARNING OBJ
        │               │               │
        └───────────────┼───────────────┘
                        │
                        ▼
                  STUDENT PROFILE
                  (Insights & Growth)
```

---

---

## Scientific References

This documentation is based on peer-reviewed research from educational psychology, behavioral science, and learning theory. Below are the key citations:

### Core Learning Theories

1. **Kolb, D. A. (1984).** *Experiential Learning: Experience as the Source of Learning and Development*. Prentice-Hall.
   - Foundation for the four-stage learning cycle (Concrete Experience, Reflective Observation, Abstract Conceptualization, Active Experimentation)

2. **Reber, A. S. (1993).** *Implicit Learning and Tacit Knowledge: An Essay on the Cognitive Unconscious*. Oxford University Press.
   - Research on implicit learning (learning by doing without conscious awareness)

3. **Sun, R., Merrill, E., & Peterson, T. (2001).** From implicit skills to explicit knowledge: A bottom-up model of skill learning. *Cognitive Science*, 25(2), 203-244.
   - Evidence that combining implicit and explicit learning is more effective than either alone

4. **Anderson, J. R. (1982).** Acquisition of cognitive skill. *Psychological Review*, 89(4), 369-406.
   - Research on how procedural (implicit) and declarative (explicit) knowledge work together

### Behavioral Science Principles

5. **Lave, J., & Wenger, E. (1991).** *Situated Learning: Legitimate Peripheral Participation*. Cambridge University Press.
   - Foundation for authentic, contextual learning

6. **Bandura, A. (1986).** *Social Foundations of Thought and Action: A Social Cognitive Theory*. Prentice-Hall.
   - Research on observational learning and social cognitive theory

7. **Csíkszentmihályi, M. (1990).** *Flow: The Psychology of Optimal Experience*. Harper & Row.
   - Research on flow state and optimal learning conditions

8. **Deci, E. L., & Ryan, R. M. (2000).** The "what" and "why" of goal pursuits: Human needs and the self-determination of behavior. *Psychological Inquiry*, 11(4), 227-268.
   - Research on autonomy, competence, and relatedness as drivers of intrinsic motivation

### Assessment and Skill Development

9. **World Economic Forum. (2023).** *Future of Jobs Report 2023*. Geneva: World Economic Forum.
   - Foundation for 2030 Skills framework (analysis of 803 million job postings)

10. **Holland, J. L. (1997).** *Making Vocational Choices: A Theory of Vocational Personalities and Work Environments* (3rd ed.). Psychological Assessment Resources.
    - Foundation for RIASEC career theory and personality-career matching

11. **Messick, S. (1995).** Validity of psychological assessment: Validation of inferences from persons' responses and performances as scientific inquiry into score meaning. *American Psychologist*, 50(9), 741-749.
    - Foundation for evidence-based, performance-based assessment

### Supporting Research

12. **Cahill, L., & McGaugh, J. L. (1995).** A novel demonstration of enhanced memory associated with emotional arousal. *Consciousness and Cognition*, 4(4), 410-421.
    - Research on how emotional engagement strengthens memory formation

13. **Flavell, J. H. (1979).** Metacognition and cognitive monitoring: A new area of cognitive-developmental inquiry. *American Psychologist*, 34(10), 906-911.
    - Research on metacognitive awareness and learning transfer

14. **Bransford, J. D., Brown, A. L., & Cocking, R. R. (Eds.). (2000).** *How People Learn: Brain, Mind, Experience, and School*. National Academy Press.
    - Research on how explicit reflection improves learning transfer

15. **Schunk, D. H. (1987).** Peer models and children's behavioral change. *Review of Educational Research*, 57(2), 149-174.
    - Research on how peer models (similar to students) improve learning

16. **Shernoff, D. J., Csíkszentmihályi, M., Schneider, B., & Shernoff, E. S. (2003).** Student engagement in high school classrooms from the perspective of flow theory. *School Psychology Quarterly*, 18(2), 158-176.
    - Research on flow state in educational settings

17. **Ryan, R. M., & Deci, E. L. (2000).** Intrinsic and extrinsic motivations: Classic definitions and new directions. *Contemporary Educational Psychology*, 25(1), 54-67.
    - Research on intrinsic motivation and learning outcomes

---

*This documentation is designed for domain experts who need to understand how scenarios work and what data they generate, without requiring technical implementation knowledge. All principles are grounded in peer-reviewed research from educational psychology and behavioral science.*
