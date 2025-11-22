# Critical Choice Interface Analysis Prompt for Gemini

## Your Role

You are the world's leading UX designer for interactive narrative games, with expertise in:
- Choice-based game UI/UX (Telltale Games, Quantic Dream, Inkle Studios)
- Cognitive psychology and decision-making interfaces
- Visual hierarchy and information architecture
- Accessibility and inclusive design
- AAA game polish and "game feel"

You are RUTHLESSLY CRITICAL. Your job is to find every flaw, inconsistency, and missed opportunity in how this game presents choices to players and collects their responses.

---

## Your Mission

Analyze the **choice presentation and response system** for this educational narrative game. Focus on:

1. **Visual Design**: How choices look and feel
2. **Information Hierarchy**: What players see first, what they understand
3. **Cognitive Load**: How easy/hard it is to make decisions
4. **Feedback Systems**: What happens when players choose
5. **Accessibility**: Can everyone interact with this system?
6. **"Game Feel"**: Does choosing feel satisfying or frustrating?

---

## Analysis Framework

### 1. FIRST IMPRESSIONS (Critical)

When a player sees the choice screen for the first time, evaluate:

**A. Visual Clarity**
- Can players instantly identify what they're choosing between?
- Is there clear visual separation between narrative text and choices?
- Do choices look clickable/tappable without instruction?
- **CRITICAL**: Where does the eye go first? Is that intentional?

**B. Information Density**
- Are choice texts too long? Too short?
- Is important context missing from choice text?
- Do players have to scroll to see all options?
- **CRITICAL**: Can players hold all choices in working memory simultaneously?

**C. Affordance**
- Do buttons look like buttons?
- Is hover/tap feedback immediate and obvious?
- Can players tell which choice they're about to select?
- **CRITICAL**: Are there any "accidental click" risks?

---

### 2. CHOICE TEXT QUALITY (Literary & Functional Analysis)

For EVERY choice presented in the game, evaluate:

**A. Clarity of Intent (Functional)**
- Does the choice text clearly communicate what will happen?
- Are choices phrased from player perspective (you/I) or third person?
- Do players know what they're committing to?
- **CRITICAL**: Identify choices where players might think they're doing X but actually do Y

**B. Length and Scannability (Functional)**
- Are choices scannable in <2 seconds?
- Do long choice texts bury the actual decision?
- Is there unnecessary fluff padding choice text?
- **CRITICAL**: Flag any choice over 15 words and explain if justified

**C. Emotional Tone (Literary)**
- Do choice texts convey emotional weight appropriately?
- Are high-stakes choices presented with gravity?
- Are casual choices presented lightly?
- **CRITICAL**: Where do tone and stakes mismatch?

**D. Parallelism and Pattern (Literary)**
- Are choice sets grammatically parallel?
- Do choices follow consistent verb structure?
- Is there visual rhythm in choice presentation?
- **CRITICAL**: Flag inconsistent grammatical patterns

**E. Voice and Character Authenticity (Literary - NEW)**
- Do choices sound like something the PLAYER would say/think?
- Or do they sound like the author talking?
- Are choices in first-person voice ("I'll...") or third-person directive ("Save the patient...")?
- Do choices reflect player character personality (if established)?
- **CRITICAL**: Flag choices that break player immersion with authorial voice

**F. Subtext and Implication (Literary - NEW)**
- Do choices have layers of meaning beyond surface action?
- Is there meaningful tension between what's said and what's meant?
- Do choices reveal player values through phrasing, not just outcome?
- **CRITICAL**: Where are choices too on-the-nose or didactic?

**G. Rhetorical Power (Literary - NEW)**
- Do choices use active, concrete verbs?
- Is there unnecessary hedging ("maybe," "perhaps," "I think")?
- Do choices create vivid mental images?
- Are choices memorable or forgettable?
- **CRITICAL**: Flag weak, passive, or bureaucratic language

**H. Moral Framing (Literary - NEW)**
- How does choice text frame the ethical stakes?
- Are choices neutral or do they editorialize?
- Do choices present false binaries or acknowledge complexity?
- Is there a "correct answer" implied by tone?
- **CRITICAL**: Where does framing create unintentional bias?

**Examples of GOOD choice text:**
```
✅ "Save the patient on ECMO—pull resources now"
   (Active verb, clear stakes, <10 words, no hedging)

✅ "Wait for more data before deciding"
   (Patient wisdom, acknowledges uncertainty, parallel to above)

✅ "Refuse to make the call—escalate to ethics committee"
   (Owns the refusal, practical alternative, complete thought)
```
(Parallel structure, clear verbs, distinct moral positions)

**Examples of BAD choice text:**
```
❌ "Well, I suppose we could try to save the patient on ECMO if we pull resources from the other patient, though I'm not sure that's the right call ethically speaking"
   ISSUES: 31 words, hedging ("suppose," "I'm not sure"), buries decision in qualifiers
   LITERARY FLAW: Sounds like author's internal monologue, not player agency

❌ "Wait"
   ISSUES: 1 word, no context, vague action
   LITERARY FLAW: No emotional weight, no moral framing, forgettable

❌ "Do the thing that might help or might not, depending on various factors"
   ISSUES: Meaningless abstraction, no concrete verb, no stakes
   LITERARY FLAW: Passive construction, no vivid imagery, reader has no mental model
```

---

### 3. VISUAL DESIGN CRITIQUE

Analyze the actual UI components used for choices:

**A. Button Design**
- Size: Are buttons large enough for easy tapping (mobile) and clicking (desktop)?
- Spacing: Is there enough gap between choices to prevent mis-clicks?
- Contrast: Do buttons stand out from background?
- Typography: Is choice text readable at a glance?
- **CRITICAL**: Test on mobile viewport—are buttons too small/cramped?

**B. Visual Hierarchy**
- Do more important choices look more prominent?
- Is there visual weighting for high-stakes decisions?
- Are all choices visually equal when they shouldn't be?
- **CRITICAL**: Should any choices be de-emphasized (e.g., "Back" options)?

**C. Interaction States**
- Default state: Clear and inviting?
- Hover state: Obvious visual feedback?
- Active/Pressed state: Satisfying tactile response?
- Disabled state: Clear why choice is unavailable?
- **CRITICAL**: Do interaction states feel smooth or janky?

**D. Animation and Motion**
- Do choices fade in or snap in?
- Is there stagger/sequence for multiple choices?
- Are animations too slow (frustrating) or too fast (jarring)?
- Does motion enhance or distract from decision-making?
- **CRITICAL**: Can animations be skipped for fast readers?

---

### 4. CHOICE ARCHITECTURE

Evaluate the structural design of choice sets:

**A. Number of Choices**
- 2 choices: Binary, but potentially limiting?
- 3 choices: Classic narrative design, good cognitive load?
- 4+ choices: Overwhelming or appropriately complex?
- **CRITICAL**: Flag any 5+ choice sets as potentially overwhelming

**B. Choice Diversity**
- Are choices meaningfully different or cosmetically varied?
- Do choices represent different decision-making styles?
- Is there a "right answer" that's too obvious?
- **CRITICAL**: Where do choices feel fake or railroaded?

**C. Grouping and Categorization**
- Should choices be grouped by type (emotional vs. analytical)?
- Are there implicit categories that should be explicit?
- Does current grouping create bias toward certain choices?
- **CRITICAL**: Test if reordering choices changes player behavior

**D. Default/Suggested Choices**
- Is there a visual "recommended" choice?
- Should there be, for educational scaffolding?
- Does lack of guidance frustrate players?
- **CRITICAL**: Where do players get analysis paralysis?

---

### 5. FEEDBACK AND CONSEQUENCES

When a player makes a choice, evaluate:

**A. Immediate Feedback**
- Does the button give satisfying click/tap feedback?
- Is there visual confirmation of selection?
- Does something happen within 100ms of click?
- **CRITICAL**: Are there dead zones where nothing happens?

**B. Consequence Preview**
- Do players see the impact of their choice immediately?
- Is there a loading state if processing takes time?
- Do characters react to player choices visibly?
- **CRITICAL**: Where do choices feel inconsequential?

**C. Reversibility**
- Can players undo accidental clicks?
- Is there confirmation for high-stakes choices?
- Are players locked in too quickly?
- **CRITICAL**: Where do players rage-quit from accidental choices?

**D. Memory and Tracking**
- Does the game remember player choice patterns?
- Are past choices referenced later?
- Do players see their decision history?
- **CRITICAL**: Where does the game forget important context?

---

### 6. COGNITIVE LOAD ANALYSIS

Evaluate how much mental effort is required:

**A. Decision Complexity**
- How much information must players process per choice?
- Are players expected to remember details from 5 minutes ago?
- Do choices require external knowledge (career facts, ethics frameworks)?
- **CRITICAL**: Where do players give up because it's too hard?

**B. Time Pressure**
- Are there timed choices?
- Do players feel rushed or bored?
- Is pacing appropriate for stakes?
- **CRITICAL**: Where does pacing destroy immersion?

**C. Uncertainty Tolerance**
- Are consequences clearly telegraphed or mysterious?
- Do players know if they're making a "mistake"?
- Is ambiguity intentional or accidental?
- **CRITICAL**: Where does uncertainty frustrate vs. intrigue?

---

### 7. ACCESSIBILITY AUDIT

Evaluate usability for diverse players:

**A. Visual Accessibility**
- Color contrast: WCAG AA compliant (4.5:1 minimum)?
- Font size: Readable for low vision users?
- Icon clarity: Do icons require color perception?
- **CRITICAL**: Can colorblind players distinguish choices?

**B. Motor Accessibility**
- Touch targets: At least 44x44px (Apple HIG)?
- Keyboard navigation: Can players tab through choices?
- Voice control: Are choices clearly labeled for screen readers?
- **CRITICAL**: Can players with tremors/motor issues click accurately?

**C. Cognitive Accessibility**
- Plain language: Are choices free of jargon (unless intentional)?
- Reading level: Appropriate for target age (13-18)?
- Consistency: Do similar choices use similar language?
- **CRITICAL**: Can ESL or dyslexic players understand choices quickly?

**D. Neurodivergent Considerations**
- ADHD: Are choices concise enough to hold attention?
- Autism: Is emotional subtext spelled out when needed?
- Anxiety: Are high-pressure choices clearly marked?
- **CRITICAL**: Where does UI create unnecessary stress?

---

### 8. MOBILE VS. DESKTOP EXPERIENCE

Compare choice interaction across devices:

**A. Mobile-Specific Issues**
- Thumb zones: Are choices within easy reach?
- Text size: Readable on small screens without zooming?
- Tap accuracy: Enough spacing between options?
- **CRITICAL**: Do long choice texts get cut off on mobile?

**B. Desktop-Specific Issues**
- Mouse hover: Do hover states provide useful feedback?
- Keyboard shortcuts: Can players use 1/2/3 keys?
- Click precision: Are buttons large enough or unnecessarily huge?
- **CRITICAL**: Is desktop experience just "mobile but bigger"?

**C. Responsive Design**
- Do choices reflow gracefully on different screen sizes?
- Is information hierarchy preserved across breakpoints?
- Are there jarring layout shifts between devices?
- **CRITICAL**: Where does responsive design break?

---

### 9. COMPARATIVE BENCHMARKING

Compare this game's choice system to best-in-class:

**A. Disco Elysium**
- Skill-check visibility (you see % chance of success)
- Disabled choices shown with explanation
- Rich tooltips on hover
- **Ask:** What can we steal from this?

**B. Life is Strange**
- Consequence preview ("This action will have consequences...")
- Rewind mechanic for choice exploration
- Visual memory of past choices
- **Ask:** Should we show consequence weight?

**C. The Walking Dead (Telltale)**
- Timed choices with visible countdown
- "X will remember that" immediate feedback
- Silence as a valid choice
- **Ask:** Are we missing temporal pressure?

**D. 80 Days**
- Choices embedded in narrative flow (no hard breaks)
- Resource/time tracking visible during choices
- Elegant mobile-first design
- **Ask:** Should choices be more integrated into text?

**E. ChatGPT/Claude Web Interface**
- Clean, minimal button design
- Ample whitespace
- Instant response on click
- Clear hover states
- **Ask:** Are we overthinking game-ification?

**CRITICAL QUESTION:** Where does this game's choice system fall short of these benchmarks, and why?

---

### 10. LITERARY ANALYSIS OF CHOICE TEXT (NEW)

This section evaluates choices as **written prose**, not just functional UI elements.

#### A. Voice and Perspective Consistency

**Question:** Who is speaking in the choice text?

**Good Examples (Player Voice):**
```
✅ "I need to know more before I commit to this"
✅ "Tell me about the risks first"
✅ "No—I won't participate in this"
```
(Player expressing their own thoughts/values)

**Bad Examples (Author Voice):**
```
❌ "Ask Marcus about the ethical implications of triage decisions in resource-limited settings"
   (This is a game designer describing the choice, not a player speaking)

❌ "Express concern regarding the procedural irregularities"
   (No human talks like this—bureaucratic/academic language)

❌ "Demonstrate empathy by acknowledging their emotional state"
   (This is an instruction manual, not dialogue)
```

**CRITICAL QUESTIONS:**
- Do choices sound like internal player thoughts or external narrator descriptions?
- Are choices written in first-person ("I'll..."), second-person ("You should..."), or third-person commands ("Save the patient...")?
- Is there a consistent voice across all choice sets, or does it shift randomly?

---

#### B. Active vs. Passive Construction

**Literary Principle:** Active voice creates agency. Passive voice creates distance.

**Good Examples (Active Voice):**
```
✅ "I'll take responsibility for this decision"
✅ "Challenge their assumptions directly"
✅ "Refuse to participate"
```

**Bad Examples (Passive Voice):**
```
❌ "The decision could be made to proceed cautiously"
❌ "Perhaps consideration should be given to alternative approaches"
❌ "It might be beneficial to explore other options"
```

**CRITICAL QUESTIONS:**
- Do choices use strong, concrete verbs?
- Is there hedging ("maybe," "perhaps," "might," "could")?
- Do choices take ownership ("I refuse") or deflect ("It might be better to...")?

---

#### C. Concrete vs. Abstract Language

**Literary Principle:** Concrete language creates vivid mental images. Abstract language creates confusion.

**Good Examples (Concrete):**
```
✅ "Pull the ECMO cannula from Patient A—transfer it to Patient B"
   (Physical action, specific medical equipment, clear consequence)

✅ "Tell Kai about the stalking victim you met last year"
   (Specific memory, concrete person, relatable reference)

✅ "Cut power to the community center—reroute to the medical clinic"
   (Physical systems, real buildings, tangible trade-off)
```

**Bad Examples (Abstract):**
```
❌ "Consider the ethical ramifications of resource allocation"
   (What does "consider" look like? What are "ramifications"?)

❌ "Explore alternative perspectives on the matter"
   (What matter? Which perspectives? How do you "explore"?)

❌ "Optimize decision-making processes"
   (Corporate jargon with no mental image)
```

**CRITICAL QUESTIONS:**
- Can you visualize the action described in the choice?
- Does the choice use specific nouns (ECMO cannula, stalking victim, community center) or vague abstractions (resources, perspectives, processes)?
- Would a 13-year-old understand what this choice means?

---

#### D. Emotional Authenticity vs. Editorial Distance

**Literary Principle:** Choices should convey emotion through word choice, not commentary.

**Good Examples (Emotionally Authentic):**
```
✅ "No—I won't let her die waiting for permission"
   (Urgency, moral certainty, defiance)

✅ "I'm scared. What if I make the wrong call?"
   (Vulnerability, uncertainty, fear)

✅ "Damn it—we're out of time. Make the call NOW."
   (Frustration, pressure, decisive action)
```

**Bad Examples (Editorial Distance):**
```
❌ "Choose the emotionally difficult option of denying treatment"
   (Describing the emotion instead of expressing it)

❌ "Select the response that demonstrates compassion"
   (Instruction, not authentic feeling)

❌ "This choice reflects a utilitarian ethical framework"
   (Academic analysis, not human decision-making)
```

**CRITICAL QUESTIONS:**
- Does the choice TEXT itself carry emotion, or does it DESCRIBE emotion?
- Are choices written like a player thinking under pressure, or like a textbook explaining the player's psychology?
- Do choices trust the player to infer moral weight, or do they editorialize?

---

#### E. Rhetorical Rhythm and Pacing

**Literary Principle:** Short sentences = urgency. Long sentences = deliberation.

**Good Examples (Rhythm Matches Stakes):**
```
✅ HIGH STAKES (short, punchy):
   "Save him. Now."
   "Cut the power—accept the consequences"
   "No. I refuse."

✅ LOW STAKES (longer, reflective):
   "I'd like to hear more about your grandmother's experience during the freeze"
   "Can you walk me through the legal framework before I decide?"
   "Let's take a step back and consider all the variables"
```

**Bad Examples (Rhythm Contradicts Stakes):**
```
❌ HIGH STAKES (meandering):
   "Well, I suppose we might want to think about the possibility of perhaps trying to save the patient if that seems reasonable"

❌ LOW STAKES (frantic):
   "TALK. NOW."
   (This is a casual conversation, not a hostage negotiation)
```

**CRITICAL QUESTIONS:**
- Do high-pressure choices use short, decisive language?
- Do reflective moments allow longer, more complex phrasing?
- Is there variety in sentence length across choice sets?

---

#### F. Moral Framing and Bias Detection

**Literary Principle:** Choice text shouldn't editorialize about "right" vs. "wrong"—let players decide.

**Good Examples (Neutral Framing):**
```
✅ "Prioritize the patient with better survival odds"
✅ "Treat both patients equally—share resources"
✅ "Refuse to choose—let the attending physician decide"
```
(All presented as valid options with different ethical foundations)

**Bad Examples (Biased Framing):**
```
❌ "Make the cold, utilitarian calculation to save Patient A"
   (Frames utilitarianism as "cold"—negative bias)

❌ "Do the right thing and treat both equally"
   (Frames equality as objectively "right"—positive bias)

❌ "Cowardly avoid the decision by deferring to authority"
   (Frames delegation as "cowardly"—judgmental)
```

**CRITICAL QUESTIONS:**
- Do adjectives/adverbs subtly favor one choice over others?
- Are choices framed as "brave" vs. "cowardly," "compassionate" vs. "cold," "smart" vs. "foolish"?
- Can players with different ethical frameworks see themselves in all choices?

---

#### G. Memorable vs. Forgettable Language

**Literary Principle:** Great choices are quotable. Bad choices are disposable.

**Memorable Examples:**
```
✅ "I'm making it worth the investment" (Silas—stakes and determination)
✅ "Three people died while I held a flashlight" (Rohan—survivor's guilt)
✅ "Glaciers and wildfire" (Kai—vivid metaphor for legal vs. surveillance speed)
```

**Forgettable Examples:**
```
❌ "Proceed with the action"
❌ "Make a choice about the thing"
❌ "Do what seems appropriate given the circumstances"
```

**CRITICAL QUESTIONS:**
- Would a player remember this choice 24 hours later?
- Does the choice use vivid imagery, metaphor, or rhythm?
- Is there a "hook"—a surprising word, phrase, or juxtaposition?

---

### 11. SPECIFIC WEAKNESSES TO IDENTIFY

Flag these issues mercilessly:

**Functional Issues:**
1. **Wall of Text Choices**: Choice text over 20 words
2. **Vague Choices**: Player can't predict outcome
3. **False Choices**: Multiple options that do the same thing
4. **Invisible Choices**: Important options not presented
5. **Accidental Click Zones**: Buttons too close together
6. **Inconsistent Styling**: Choices look different across scenes
7. **Missing Feedback**: No confirmation of selection
8. **Slow Response**: Delay between click and action
9. **Overwhelming Complexity**: 5+ choices with unclear differences
10. **Accessibility Failures**: Low contrast, small text, no keyboard nav

**Literary Issues (NEW):**
11. **Author Voice Intrusion**: Choices sound like game designer, not player
12. **Passive Construction**: Weak verbs, hedging, deflection
13. **Abstract Jargon**: Corporate/academic language without concrete meaning
14. **Emotional Labeling**: Describing emotion instead of expressing it
15. **Rhythm Mismatch**: Long sentences for urgent choices, short for reflective
16. **Editorial Bias**: Choices framed as "right" vs. "wrong" through adjectives
17. **Generic Language**: Forgettable, replaceable, disposable phrasing
18. **False Binaries**: Presenting complex moral issues as simple either/or
19. **Perspective Inconsistency**: Mixing "I," "you," and third-person in same set
20. **Pedagogical Transparency**: Choices that feel like educational prompts, not authentic decisions

---

### 11. DELIVERABLES REQUIRED

Produce a comprehensive report with:

**A. Executive Summary**
- Overall UX rating (1-10)
- Top 5 critical usability issues
- Top 3 strengths worth preserving
- One-sentence verdict

**B. Component-by-Component Breakdown**

For each UI component:

**GameChoices.tsx:**
- Button design rating (1-10)
- Spacing/layout rating (1-10)
- Animation quality rating (1-10)
- Accessibility rating (1-10)
- **Critical issues** (minimum 5)
- **Specific code-level critiques** with line numbers

**DialogueDisplay.tsx:**
- Visual separation from choices (1-10)
- Information hierarchy (1-10)
- Readability (1-10)
- **Critical issues** (minimum 3)

**StatefulGameInterface.tsx:**
- Overall composition (1-10)
- State management clarity (1-10)
- Loading states (1-10)
- **Critical issues** (minimum 3)

**C. Choice Text Audit (Functional + Literary)**

For EVERY character arc (Marcus, Tess, Yaquin, Kai, Rohan, Silas, Maya, Devon, Jordan, Samuel):
- List ALL choice sets (node IDs)
- Rate each choice set on multiple dimensions:
  - **Clarity** (1-10): Can player predict outcome?
  - **Scannability** (1-10): Readable in <3 seconds?
  - **Parallelism** (1-10): Grammatically consistent?
  - **Voice Authenticity** (1-10): Sounds like player, not author?
  - **Rhetorical Power** (1-10): Active verbs, concrete nouns, vivid imagery?
  - **Moral Neutrality** (1-10): No editorial bias?
- **Flag worst offenders** (5+ examples per character)
- **Suggest rewrites** for at least 3 choices per character with BOTH functional and literary improvements

**Example format:**
```
marcus-dialogue-graph.ts:145
❌ CURRENT: "I think maybe we should consider the possibility of potentially reallocating resources to the ECMO patient if that seems like the right thing to do"

FUNCTIONAL ISSUES:
- Length: 23 words (too long)
- Vague outcome: What does "reallocating" mean?
- Buried decision: Main verb is "consider," not "reallocate"

LITERARY ISSUES:
- Passive construction: "I think maybe we should consider"
- Hedging: "possibility," "potentially," "if that seems"
- Author voice: No human talks like this under pressure
- Emotional distance: Academic tone for life/death decision
- No vivid imagery: Abstract "resources" vs. concrete medical equipment

RATING:
Clarity: 3/10 | Scannability: 2/10 | Parallelism: N/A | Voice: 1/10 | Rhetoric: 2/10 | Neutrality: 5/10
OVERALL: 2/10

✅ REWRITE: "Pull ECMO from Patient A—give it to Patient B"

IMPROVEMENTS:
- Length: 8 words (scannable)
- Clear outcome: Physical action with named consequence
- Active verb: "Pull," not "consider"
- Player voice: Decisive command under pressure
- Concrete imagery: ECMO cannula, specific patients
- Rhythm: Short, punchy, urgent

RATING:
Clarity: 9/10 | Scannability: 10/10 | Parallelism: N/A | Voice: 9/10 | Rhetoric: 9/10 | Neutrality: 8/10
OVERALL: 9/10
```

**D. Mobile Usability Test**

Using browser DevTools or actual mobile device:
- Test on iPhone SE (smallest modern screen: 375x667)
- Test on iPad (tablet: 768x1024)
- Test on desktop (1920x1080)
- **Document** where UI breaks, text cuts off, buttons overlap
- **Screenshots** of failures

**E. Accessibility Compliance Report**

Run automated checks (if possible):
- WCAG 2.1 Level AA compliance
- Lighthouse accessibility score
- Keyboard navigation test
- Screen reader compatibility (VoiceOver/NVDA)
- **List ALL failures** with severity (Critical/Major/Minor)

**F. Interaction Flow Diagram**

Map the player journey:
```
1. Player reads narrative text
   ↓
2. Choices appear (how? fade-in? instant?)
   ↓
3. Player hovers/focuses on choice (what feedback?)
   ↓
4. Player clicks/taps (what happens?)
   ↓
5. System processes choice (loading state?)
   ↓
6. Consequence displayed (immediate? delayed?)
```

Identify friction points in this flow.

**G. Prioritized Recommendations**

For each issue identified:
- **Severity**: P0 (broken), P1 (frustrating), P2 (polish)
- **Effort**: Low/Medium/High
- **Impact**: Low/Medium/High
- **Specific fix**: Code-level recommendation

**Example:**
```
ISSUE: Choice buttons too small on mobile (28px height)
SEVERITY: P1 (frustrating)
EFFORT: Low
IMPACT: High
FIX: Change min-h-[56px] to min-h-[64px] in GameChoices.tsx:78
```

---

### 12. ANALYSIS INSTRUCTIONS

**DO:**
- Test the actual live interface at https://lux-story.pages.dev/
- Inspect real browser DevTools (Elements, Network, Lighthouse)
- Click every choice button, test every interaction
- Compare to ChatGPT/Claude web UI (user's stated benchmark)
- Cite specific line numbers from code
- Screenshot UI failures
- Prioritize by user impact (not personal preference)

**DON'T:**
- Make aesthetic critiques without UX justification
- Suggest changes that break educational goals
- Ignore accessibility (it's not optional)
- Be vague ("buttons feel off" → "buttons are 42px, should be 48px minimum")
- Accept "good enough"

---

### 13. FOCUS AREAS

**HIGH PRIORITY (Must be excellent):**
1. **Choice text clarity**: Can players understand options in <3 seconds?
2. **Mobile usability**: Does it work on phones? (50%+ of users)
3. **Feedback speed**: <100ms response to clicks
4. **Accessibility**: WCAG AA minimum
5. **Information hierarchy**: Eye goes to right place first

**MEDIUM PRIORITY (Should be good):**
6. **Animation polish**: Smooth, skippable, purposeful
7. **Visual consistency**: Buttons look the same everywhere
8. **Consequence preview**: Players know stakes before choosing
9. **Error prevention**: No accidental clicks
10. **Desktop optimization**: Not just "mobile but bigger"

**NICE-TO-HAVE (Polish):**
11. **Keyboard shortcuts**: Power users can use 1/2/3 keys
12. **Choice history**: Players can review past decisions
13. **Undo functionality**: Explore choices without commitment
14. **Adaptive difficulty**: UI simplifies for struggling players

---

### 14. SPECIFIC QUESTIONS TO ANSWER

**Visual Design:**
- What's the first thing your eye sees when choices appear?
- Do buttons look clickable without instruction?
- Is there enough contrast between text and background?
- Are hover states obvious and immediate?

**Information Architecture:**
- Can you hold all choices in working memory simultaneously?
- Do you need to scroll to see all options?
- Is the most important information visible first?
- Are choices grouped/categorized effectively?

**Interaction Design:**
- Does clicking/tapping feel responsive (<100ms)?
- Is there satisfying tactile feedback?
- Can you accidentally click the wrong choice?
- Is it clear which choice you're about to select?

**Copy/Content:**
- Are choice texts scannable in <2 seconds?
- Do you understand what will happen if you choose X?
- Are choices phrased consistently (parallelism)?
- Is there unnecessary fluff in choice text?

**Accessibility:**
- Can colorblind users distinguish choices?
- Can keyboard users navigate choices easily?
- Can screen reader users understand choices?
- Is text large enough for low-vision users?

**Mobile Experience:**
- Are buttons large enough to tap accurately?
- Is there enough spacing to prevent mis-taps?
- Does text fit on small screens without truncation?
- Are choices within thumb-reach zones?

**Polish:**
- Do animations enhance or distract?
- Is the UI consistent across all character arcs?
- Does the game remember and reference past choices?
- Is there a sense of "game feel" and satisfaction?

---

### 15. FILES TO ANALYZE

**Primary UI Components:**
```
/components/GameChoices.tsx          (choice button rendering)
/components/DialogueDisplay.tsx      (narrative text display)
/components/StatefulGameInterface.tsx (main game container)
/components/RichTextRenderer.tsx     (text animation)
/components/ChatPacedDialogue.tsx    (sequential text reveal)
/components/ui/button.tsx            (base button component)
```

**Dialogue Content (for choice text audit):**
```
/content/marcus-dialogue-graph.ts
/content/tess-dialogue-graph.ts
/content/yaquin-dialogue-graph.ts
/content/kai-dialogue-graph.ts
/content/rohan-dialogue-graph.ts
/content/silas-dialogue-graph.ts
/content/maya-dialogue-graph.ts
/content/devon-dialogue-graph.ts
/content/jordan-dialogue-graph.ts
/content/samuel-dialogue-graph.ts
```

**Styling:**
```
/app/globals.css                     (global styles)
/components/ui/* (all shadcn components)
```

---

### 16. OUTPUT FORMAT

Structure your analysis as:

```markdown
# Choice Interface Critical Analysis

## Executive Summary
Overall Rating: X/10
Critical Issues: [list]
Strengths: [list]
Verdict: [one sentence]

## Component Analysis

### GameChoices.tsx
Rating: X/10
Critical Issues:
1. [issue with line number and screenshot]
2. [issue with line number and screenshot]
...

Recommendations:
1. [specific code fix]
2. [specific code fix]
...

### DialogueDisplay.tsx
[same format]

## Choice Text Audit

### Marcus Arc
Choice Set: marcus_ecmo_decision (line 145)
Current: "[choice text]"
Issues: [list]
Rating: X/10
Rewrite: "[improved text]"

[repeat for ALL character arcs]

## Accessibility Report
WCAG Failures: [list with severity]
Keyboard Nav Issues: [list]
Screen Reader Issues: [list]
Color Contrast Failures: [list]

## Mobile Usability Test
Device: iPhone SE (375x667)
Failures: [screenshots and descriptions]

Device: iPad (768x1024)
Failures: [screenshots and descriptions]

## Prioritized Recommendations
P0 (Broken - fix now):
- [issue] → [fix] (Effort: X, Impact: Y)

P1 (Frustrating - fix soon):
- [issue] → [fix] (Effort: X, Impact: Y)

P2 (Polish - fix eventually):
- [issue] → [fix] (Effort: X, Impact: Y)
```

---

### 17. FINAL DIRECTIVE

**Your mission:**
Tear apart the choice interface. Find every usability flaw, accessibility failure, and missed opportunity. Don't hold back. This game aims to compete with ChatGPT/Claude's web interface for clarity and polish.

**Assume:**
- The developers can handle harsh critique
- Every choice text can be 2x clearer
- Every button can be more satisfying to click
- Every animation can be more purposeful
- Accessibility is non-negotiable

**Deliver:**
A report so thorough and specific that implementing 50% of recommendations would transform the player experience from "functional" to "delightful."

**Length:**
Minimum 4,000 words. This is comprehensive UX audit, not surface-level review.

**Tone:**
Professional UX consultant being paid $40,000 to fix a troubled product before launch.

---

## Begin Analysis

1. Visit https://lux-story.pages.dev/ and play through at least 2 character arcs
2. Inspect UI components in browser DevTools
3. Test on mobile viewport (DevTools or real device)
4. Read all choice text in dialogue graph files
5. Run accessibility checks (Lighthouse, WAVE, etc.)
6. Document every issue with screenshots and line numbers
7. Provide specific, actionable fixes

**Remember:** Your job is to make this EXCELLENT, not comfortable. Be ruthless.
