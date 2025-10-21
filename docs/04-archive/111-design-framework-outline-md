## PART IX: RAPID REFERENCE CARDS

### Card 1: Message Length Quick Check

| Context | Words | Sentences | Lines |
|---------|-------|-----------|-------|
| **Tutorial/Onboarding** | 25-35 | 2-3 | 2-3 |
| **Story Beat** | 40-50 | 3-4 | 3-4 |
| **Choice Setup** | 8-15 | 1-2 | 1 |
| **Combat/Fast** | 15-25 | 2-3 | 2 |
| **Dramatic Moment** | 30-40 | 2-3 | 3-4 |

**Universal Rule**: If it takes >10 seconds to read, split it.

---

### Card 2: When to Break

| Use... | When... | Example |
|--------|---------|---------|
| **Line break** | Same topic, new idea | "You enter. \n\n The room is dark." |
| **New message** | New beat or reaction | Msg1: "You swing." → Msg2: "It connects." |
| **Scene break** | Location/time changes | "Three days later..." + separator |

---

### Card 3: Choice Button Checklist

✅ **Do:**
- Start with verb ("Attack," "Flee," "Negotiate")
- Show consequences ("Gain health but lose gold")
- 3-7 words maximum
- Use active voice

❌ **Don't:**
- Use vague labels ("Option A")
- Hide consequences ("Do something risky")
- Exceed 10 words
- Use passive voice ("Could be attacked")

---

### Card 4: Color Psychology Quick Guide

| Color | Use For | Psychological Effect |
|-------|---------|---------------------|
| **Green** | Primary actions, positive outcomes | "Go," safety, affirmation |
| **Red** | Dangerous choices, negative outcomes | Warning, urgency, stop |
| **Purple/Navy** | Strategic choices, neutral decisions | Contemplative, serious, no hint |
| **Orange** | Social features, highlights | Warm, community, attention |
| **Gray/Muted** | Secondary actions, back buttons | Neutral, de-emphasized |
| **Blue** | Information, tutorials | Trust, calm, learning |

---

### Card 5: Pacing Formula

**Tension Level → Message Speed**

| Tension | Typing Delay | Message Length | Frequency |
|---------|--------------|----------------|-----------|
| **Low** (exploration) | 1.5-2s | 40-50 words | Every 5-8s |
| **Medium** (story) | 1-1.5s | 30-40 words | Every 3-5s |
| **High** (combat) | 0.5-1s | 15-25 words | Every 1-2s |

---

### Card 6: The Rule of Three Everywhere

**In a message**: Setup → Development → Payoff
**Across messages**: Problem → Struggle → Solution
**In tutorials**: What → Why → How
**In choices**: Give 2-3 options (never 1, rarely 4+)

---

### Card 7: Accessibility Quick Checks

Before publishing any screen:

- [ ] Can I read this in bright sunlight?
- [ ] Are buttons 44pt+ tall?
- [ ] Is text 16px+ size?
- [ ] Does it work without color? (use icons/labels too)
- [ ] Can I tap this with my thumb easily?
- [ ] Is there 8px+ space between tap targets?

---

### Card 8: Pre-Ship Checklist for Each Story Scene

**Content:**
- [ ] Every sentence under 15 words
- [ ] Line breaks every 1-2 sentences
- [ ] Total message under 50 words
- [ ] Active voice throughout
- [ ] No jargon or complex terms

**Structure:**
- [ ] Narrative messages separated from choice buttons
- [ ] Choices are 3-7 words each
- [ ] Consequences clearly stated
- [ ] Follows hook → context → tension pattern

**Visual:**
- [ ] High contrast (4.5:1 minimum)
- [ ] Proper shadcn component usage
- [ ] Touch targets sized correctly
- [ ] Appropriate color for context

**Interaction:**
- [ ] Typing indicator timing set
- [ ] Tap-to-skip enabled
- [ ] Choice buttons disabled after selection
- [ ] Outcome clearly shown

**Accessibility:**
- [ ] Screen reader labels
- [ ] Focus indicators
- [ ] No color-only information
- [ ] Readable in all conditions

---

## PART X: COMMON MISTAKES & FIXES

### Mistake 1: Wall of Text
**Problem**: Sending 150-word messages in chat interface

**Fix**: Break into 3-4 messages of 40-50 words each
```typescript
// Bad
<Message>
  {longParagraph} // 150 words
</Message>

// Good
<Message>{intro}</Message> // 40 words
{/* typing delay */}
<Message>{development}</Message> // 35 words
{/* typing delay */}
<Message>{conclusion}</Message> // 30 words
```

---

### Mistake 2: Unclear Consequences
**Problem**: "Make a choice" with no indication of what happens

**Fix**: Always show the consequence in the button
```typescript
// Bad
<Button>Go left</Button>
<Button>Go right</Button>

// Good
<Button>Go left (safe but longer)</Button>
<Button>Go right (risky shortcut)</Button>
```

---

### Mistake 3: Too Many Choices
**Problem**: Presenting 6+ options, causing decision paralysis

**Fix**: Group or reduce to 2-4 choices maximum
```typescript
// Bad: 6 choices
<Button>Attack with sword</Button>
<Button>Attack with bow</Button>
<Button>Defend</Button>
<Button>Flee</Button>
<Button>Negotiate</Button>
<Button>Use magic</Button>

// Good: 4 grouped choices
<Button>Attack</Button>
<Button>Defend</Button>
<Button>Flee</Button>
<Button>Use ability</Button>
```

---

### Mistake 4: Monotone Pacing
**Problem**: Every message same speed, same length = boring

**Fix**: Vary rhythm based on tension
```typescript
// Combat sequence - fast
await type(500); sendMessage("You swing."); // 2 words
await type(500); sendMessage("Direct hit!"); // 2 words
await type(500); sendMessage("The enemy staggers back."); // 4 words

// Discovery - slow
await type(2000); sendMessage("You push open the ancient door..."); // 6 words
await type(2500); sendMessage("Inside, treasures beyond imagination shine in the torchlight."); // 9 words
```

---

### Mistake 5: No Visual Hierarchy
**Problem**: Everything looks the same (same color, size, weight)

**Fix**: Use shadcn variants to create hierarchy
```typescript
// Bad - everything default
<Button variant="default">Important</Button>
<Button variant="default">Less important</Button>
<Button variant="default">Optional</Button>

// Good - clear hierarchy
<Button variant="default">Continue story</Button> {/* Primary */}
<Button variant="outline">Check inventory</Button> {/* Secondary */}
<Button variant="ghost">View stats</Button> {/* Tertiary */}
```

---

### Mistake 6: Ignoring Mobile Context
**Problem**: Designing for desktop, testing on desktop only

**Fix**: Design and test thumb-first
```typescript
// Consider:
// - Can user reach this one-handed?
// - Is this readable while walking?
// - Does this work in bright sunlight?
// - Is touch target big enough?
// - Does this drain battery? (animations)
```

---

### Mistake 7: No Feedback Loop
**Problem**: User taps button, nothing happens for 2 seconds

**Fix**: Immediate feedback, then consequence
```typescript
const handleChoice = async (choice) => {
  // 1. Immediate visual feedback
  setButtonPressed(choice);
  hapticFeedback(); // optional

  // 2. Disable other choices
  setChoicesDisabled(true);

  // 3. Show processing
  await simulateTyping(1000);

  // 4. Show outcome
  sendMessage(outcome);
};
```

---

### Mistake 8: Forgetting Accessibility
**Problem**: Looks great, but 20% of users can't use it

**Fix**: Include accessibility from start, not end
```typescript
<Button
  aria-label="Increase attack by 8 percent"
  className="min-h-[44px]" // touch target
  // high contrast enforced by shadcn defaults
>
  <span aria-hidden="true">⚔️</span> {/* decorative */}
  Increase Attack by 8%
</Button>
```

---

## FINAL PRINCIPLES SUMMARY

**The North Star**: Every choice you make should **reduce cognitive load**.

**The Three Tests**:
1. **3-Second Test**: Can user understand in 3 seconds?
2. **Thumb Test**: Can they use it one-handed?
3. **Sunlight Test**: Can they read it outside?

**The Core Formula**:
```
Clear Words + Smart Structure + Good Typography + Right Emotion = Comprehensible Design
```

**When in Doubt**:
- Make it shorter
- Make it simpler
- Make it clearer
- Test it on mobile
- Cut everything else

---

*This framework is a living document. Update as you learn from user testing and analytics.*# The Complete Framework for Comprehensible Design

## Core Philosophy
**Goal**: Reduce cognitive load. Information should feel effortless, intuitive, and immediate.
**Foundational Belief**: User attention is a precious and limited resource.

---

## PART I: THE EIGHT PRINCIPLES

### Principle 1: Clarity and Conciseness (The Content)

#### A. Words and Grammar
- Use simple language (avoid jargon)
- Use active voice (Subject → Verb → Object)
- Be direct (get to the point immediately)

#### B. Sentences and Structure
- One idea per sentence
- Keep sentences 8-15 words
- Build ideas sequentially

---

### Principle 2: Managing Cognitive Load (The Structure)

#### A. Chunks of Information
- **Rule of Three**: Humans remember things in threes
- **Logical Grouping**: Link related concepts with pivot words ("but," "and")

#### B. Information Density
- **Low Density**: For onboarding/learning (teach one thing at a time)
- **High Density**: For strategic decisions (assume engagement and context)
- Match density to user's knowledge state

#### C. Line Breaks
- Use as pacing tools (force mental pauses)
- One idea per line
- Separate chunks visually

---

### Principle 2.5: Text Pacing and Scene Architecture (CRITICAL FOR CHATBOT/NARRATIVE)

#### A. The Three Levels of Breaks

**Level 1: Line Break (Within Message)**
- Creates a breath, a pause
- Separates ideas that belong together conceptually
- Visual spacing without interrupting flow

**Level 2: Message Break (New Bubble/Card)**
- Creates a full stop, a moment
- Separates distinct narrative beats
- Allows user to process before continuing
- Ideal for chatbot "typing" indicators

**Level 3: Scene Break (New Screen/Section)**
- Creates a chapter boundary
- Signals major shift in location, time, or tone
- User expects something significantly different
- Often paired with choice/decision point

#### B. When to Use Line Breaks (Micro-Pacing)

**Use a line break when:**
- Transitioning between two related ideas
- Creating dramatic pause mid-description
- Listing items that need individual attention
- Shifting from action to dialogue

**Line Break Rules:**
- 1-2 sentences per line (max 3 if very short)
- If you have 4+ sentences on one topic, break into 2 lines
- Action beats get their own line: "You swing. The blade connects."
- Dialogue always on new line after speaker tag

**Example - Poor (No breaks):**
```
The door creaks open. Inside, the room is dark and cold. You hear breathing. Something moves in the shadows. Your heart races.
```

**Example - Good (Strategic breaks):**
```
The door creaks open.

Inside, the room is dark and cold. You hear breathing.

Something moves in the shadows.
Your heart races.
```

#### C. When to Use Message Breaks (Macro-Pacing)

**Use a new message when:**
- Narrative beat is complete (action → reaction)
- Time passes ("Hours later...")
- Perspective shifts (you → the monster)
- Emotional tone changes significantly
- User needs time to process before next information

**Message Length Guidelines:**

**For Mobile Chatbot RPG:**
- **Narrative Description**: 2-4 lines, 3-6 sentences max
- **Action Sequence**: 2-3 lines per message, split multi-step actions
- **Character Dialogue**: 1-3 lines per speech, long speeches split into multiple messages
- **Choice Setup**: 1-2 lines maximum before presenting choices

**The 10-Second Rule:**
If it takes longer than 10 seconds to read on mobile, split it.

**The Scroll Rule:**
If user must scroll to see the end, it's too long for one message.

#### D. Scene Break Patterns

**Use a scene break when:**
- Location changes completely
- Significant time passes (days, weeks)
- Chapter/mission ends
- Major consequence occurs
- User makes a defining choice

**Scene Break Mechanics:**
- Visual separator (horizontal rule, chapter title)
- Brief transition text ("Three days pass...")
- Option to show stat changes, loot acquired
- Clear signal: "This phase is over, new phase begins"

#### E. The Rhythm of Narrative Pacing

**Fast Pacing (Combat, Tension):**
- Short messages (1-2 lines)
- Rapid succession of messages
- Minimal typing delay
- Sentence fragments acceptable: "You dodge. Barely."

**Medium Pacing (Exploration, Discovery):**
- 2-3 line messages
- Standard typing indicators
- Mix of description and action
- Room for player anticipation

**Slow Pacing (Story Beats, Emotion):**
- 3-4 line messages
- Longer pauses between messages
- Rich description
- Let moments breathe

#### F. The "Rule of Three" Applied to Pacing

**Within a Message (Micro):**
- 3 sentences about same thing? Use 1 line break
- 6 sentences about same thing? Use 2 line breaks (3 chunks)

**Across Messages (Macro):**
- Setup → Complication → Payoff (3 messages)
- Description → Action → Consequence (3 messages)
- Question → Journey → Answer (3 messages)

**Across Scenes (Mega):**
- Act 1 → Act 2 → Act 3
- Problem → Struggle → Resolution

#### G. Practical Chatbot-Specific Rules

**Never:**
- Send 10+ sentences in one message
- Have 5+ consecutive messages without user interaction
- Mix narrative + choice buttons in same message
- Auto-scroll past user's reading speed

**Always:**
- Show typing indicator before narrative messages
- Pause 1-2 seconds between related messages
- Let user tap to skip typing animation
- Keep choice text on screen while showing result

**Progressive Reveal Pattern:**
```
Message 1: "You enter the tavern."
[typing indicator]
Message 2: "The room falls silent. Every eye turns to you."
[typing indicator]
Message 3: "A hooded figure in the corner beckons."
[present choices: Approach / Ignore / Leave]
```

#### H. Testing Your Pacing

**Read Aloud Test:**
- Read your text out loud
- Natural pauses = line breaks
- Full stops = message breaks
- "That's a lot of info" = too long, split it

**The Breath Test:**
- Can you read one line in one breath?
- If no, it's too long for mobile

**The Boredom Test:**
- Does your eye glaze over?
- If yes, add breaks or cut content

---

### Principle 3: Typography (The Visuals)

#### A. Font Selection
- Choose legible fonts (bold, sans-serif for digital)
- Prioritize readability over decoration

#### B. Typography Application
- Size matters (never force users to strain)
- Maintain consistency across interface
- Embrace white space (let text breathe)

---

### Principle 4: Context and Framing (The Emotion)

#### A. Positive Framing
- Words like "blessing," "boon," "shrine"
- Lowers stakes, reduces decision anxiety
- Signals pure wins

#### B. Negative Framing
- Words like "sacrifice," "dark energy," warnings
- Creates tension and signals consequences
- Encourages careful consideration

#### C. Social & Narrative Framing
- Attribution to community members
- Mysterious or intriguing narratives
- Transforms tasks into experiences

---

### Principle 5: Color and Shape Psychology

#### A. Color Psychology
- **Green**: "Go," success, affirmation (low-friction action)
- **Purple**: Neutral, contemplative (strategic choices)
- **Orange**: Highlight, warmth, community (social information)
- **Color = Non-verbal information**

#### B. Shape Language
- **Standard Rectangle**: Neutral, default information
- **Ribbon Banner**: Honor, celebration, elevation
- **Hexagon**: Identity, user representation
- Shape communicates information type

#### C. Color Contrast
- High contrast ratios for accessibility
- White text on saturated backgrounds
- Test for color blindness compatibility

---

### Principle 6: Interaction, Feedback, and Timing

#### A. Microinteractions
- **Hover State**: Visual change on cursor hover
- **Click Feedback**: Immediate confirmation (sound, visual, animation)
- **State Change**: Confirm outcomes with clear visual updates

#### B. Pacing and Timing
- **Just-in-Time Information**: Deliver content when needed
- Don't overload at start
- Context-dependent information reveals

#### C. Feedback Loops
- Close every interaction loop
- Confirm user's actions registered
- Eliminate uncertainty

---

### Principle 7: Accessibility and Inclusive Design

#### A. Visual Accessibility
- High color contrast (WCAG standards)
- Consider color blindness
- Avoid relying solely on color to convey meaning

#### B. Text Alternatives
- Alt text for screen readers
- Proper semantic HTML structure
- Buttons clearly labeled in code

#### C. Cognitive Accessibility
- Simple language helps everyone
- Benefits users with cognitive disabilities, dyslexia
- Accommodates tired or distracted users

---

### Principle 8: Hierarchy Systems

#### A. Visual Hierarchy
- The order eyes notice things
- Controlled by: Color, size, placement, contrast
- Example: 1st Green Button → 2nd Orange Banner → 3rd Text

#### B. Information Hierarchy
- The logical order for comprehension
- Example: 1st Who made this? → 2nd What's the story? → 3rd How do I start?

#### C. Alignment Between Hierarchies
- Visual hierarchy should support information hierarchy
- Misalignment creates confusion
- Guide the eye in the order the brain needs

---

## PART II: ANALYTICAL FRAMEWORKS

### Behavioral Economics Lens

#### Social Proof
- Community attribution over anonymous sources
- Peer validation increases credibility
- Creates living, breathing community feel

#### Curiosity Gap
- Present incomplete information
- Create expectation vs. reality discrepancies
- Compel users to seek resolution

#### Intrinsic vs. Extrinsic Motivation
- Intrinsic: Discovery, mastery, narrative fulfillment
- Extrinsic: Rewards, coins, points
- Intrinsic motivation drives long-term retention

#### The IKEA Effect (Variant)
- Collective ownership of community content
- Pride in ecosystem participation
- Inspiration to contribute

---

### UI/UX Expert Lens

#### Clear Call to Action
- Visually prominent
- Action-oriented text
- Positive color associations
- Remove all doubt about next steps

#### Visual Language Consistency
- Cohesive design elements
- Recognizable cross-platform patterns
- Maintains predictability

#### Ludonarrative Harmony
- UI supports the story
- Design reinforces themes
- No friction between form and function

---

## PART III: THE GOLDEN RULES (Quick Reference)

1. **One Idea Per Line** - Use line breaks to force pauses
2. **Use Active Voice** - Be direct, clear, subject-driven
3. **Keep Sentences Under 15 Words** - Short = easier to parse
4. **Choose Bold, Legible, Sans-Serif Font** - Readability first
5. **Embrace White Space** - Give text room to breathe
6. **Chunk Related Information** - Group logically, use Rule of Three
7. **Frame with Emotion** - Guide perception with tone
8. **Match Density to Context** - Low for learning, high for decisions
9. **Be Unambiguous** - State numbers/outcomes clearly
10. **Edit Mercilessly** - If it's not essential, cut it

---

## PART IV: MOBILE & CONVERSATIONAL UI CONSIDERATIONS

### Principle 9: Mobile-First Design Patterns

#### A. Thumb Zones and Reachability
- **Safe Zone**: Bottom third of screen (easy one-handed reach)
- **Stretch Zone**: Middle third (requires thumb extension)
- **Danger Zone**: Top third (requires hand repositioning)
- Place primary actions in safe zone

#### B. Screen Real Estate
- Vertical scroll is natural on mobile
- Horizontal scroll is friction
- Design for portrait-first (most common orientation)
- Account for notches, home indicators, status bars

#### C. Touch Targets
- Minimum 44x44pt touch target (Apple HIG)
- Space between tappable elements
- Visual feedback on touch (not just hover)

#### D. Mobile Typography
- Larger base font sizes (16px minimum for body text)
- Account for varied lighting conditions
- Line length: 35-45 characters optimal for mobile reading
- Increased line height for readability (1.5-1.6x)

---

### Principle 10: Conversational UI Patterns

#### A. Message Structure
- **System Messages**: Neutral, informational (centered, different style)
- **Story/Narrative**: Distinct from choices (card format, immersive)
- **User Choices**: Clearly actionable (button format, not message bubbles)

#### B. Conversation Flow
- One concept per message
- Typing indicators for AI responses
- Message pacing (don't dump entire story at once)
- Allow users to scroll back and review

#### C. Choice Architecture
- Present 2-4 choices maximum per decision point
- Use cards or buttons, NOT chat bubbles for choices
- Disable choices after selection
- Confirm selection visually

#### D. Progressive Disclosure
- Reveal story in digestible chunks
- "Continue" or "..." for natural pacing
- Don't auto-scroll too aggressively
- Let users control reading pace

---

### Principle 11: Text-Based RPG Specific Patterns

#### A. Stat Display Integration
- Persistent but unobtrusive stats bar
- Animate stat changes ("+5 HP" floating indicators)
- Use color coding (red for damage, green for gains)
- Don't clutter narrative space

#### B. Inventory and Character Sheets
- Swipe-in drawer or bottom sheet
- Quick-access icon, not always visible
- Separate from story flow
- Badge notifications for new items

#### C. Decision Weight Indicators
- Visual cues for consequence level
- Timer for time-sensitive choices
- Color coding for decision types
- Clear "no going back" warnings

#### D. Save States and Progress
- Auto-save between choices
- Chapter/section markers
- Progress indicators for long stories
- Resume exactly where user left off

---

## PART VI: REFERENCE ANALYSIS - SWORD & SUPPER UI PATTERNS

### Image 1: Mission Intro Screen (Social + Narrative Hook)

**What Works (Apply to 30 Lux Story):**

**Line Break Analysis:**
- 3 sentences, 2 line breaks
- "Today is different." (Standalone for impact)
- Line 2: Two related sentences about the map
- Line 3: Existential closer, standalone
- **Pattern**: Hook → Setup → Emotional closer

**Color Psychology:**
- Orange banner: Social/community signal
- White text box: Neutral narrative space
- Green button: "Go" signal, low-friction action
- **Lesson**: Separate social context (orange) from story (white) from action (green)

**Text Pacing:**
- Total: 23 words across 3 sentences
- Average: 7.6 words per sentence
- Fits 10-second rule easily
- **Lesson**: Under 25 words for mission intros

**Framing:**
- "Today is different" - creates curiosity gap
- "mentioned nothing about monsters" - expectation vs reality
- "Maybe nothing really matters" - philosophical hook
- **Lesson**: Setup → Discrepancy → Thematic depth

**For 30 Lux Chatbot Adaptation:**
```
Message 1 (System): "Mission by @Username" [orange badge]
Message 2 (Narrative):
"Today is different.

Today you come here with map in hand. The map that pointed you here mentioned nothing about monsters.

Maybe nothing really matters."

Message 3 (Action): [Start Mission button - green]
```

---

### Image 2: Monolith Choice (High-Stakes Decision)

**What Works:**

**Choice Presentation:**
- 2 options (not overwhelming)
- Left choice: Complex trade-off (gain BUT loss)
- Right choice: Simple refusal
- White text overlay for context
- **Pattern**: Risk vs Safe

**Typography:**
- White text on dark background (overlay on scene)
- Setup text: "The monolith pulses with dark energy and requests a sacrifice. Choose wisely:"
- 14 words, fits rule
- **Lesson**: Setup in 10-15 words max

**Color Psychology:**
- Dark purple/navy buttons: Serious, contemplative
- No green (no "correct" answer implied)
- Equal visual weight for both choices
- **Lesson**: Neutral color for strategic decisions

**Stat Communication:**
- Numbers clearly stated: "+28%", "-19%"
- "but" as pivot word linking trade-off
- Unambiguous consequences
- **Lesson**: Always quantify game impacts

**Framing:**
- "dark energy," "sacrifice," "Choose wisely" - high stakes
- Creates tension and pause
- **Lesson**: Negative framing for serious choices

**For 30 Lux Chatbot Adaptation:**
```
Message 1 (Narrative):
"The monolith pulses with dark energy and requests a sacrifice.

Choose wisely:"

[Present 2 buttons in same message]
Button 1 (purple): "Increase Dodge Rate by 28% but Decrease Defense by 19%"
Button 2 (purple): "Refuse"
```

---

### Image 3: Shrine Choice (Low-Stakes Bonus)

**What Works:**

**Choice Presentation:**
- 2 options (symmetrical)
- Both are pure gains (no downsides)
- Same visual treatment (equal value)
- **Pattern**: Good vs Good

**Typography:**
- "A shrine offers a blessing. Choose a boon:"
- 8 words - extremely concise
- Colon signals choices coming
- **Lesson**: Can be even shorter for simple contexts

**Color Psychology:**
- Same dark buttons as monolith
- But framing changes everything
- "blessing," "boon" - positive language
- **Lesson**: Framing > Color for emotional tone

**Stat Communication:**
- "+8%", "+12%" - clear percentages
- Simple stat names: "Attack", "Defense"
- No trade-offs, pure gains
- **Lesson**: Simpler = faster decisions

**Framing:**
- "shrine," "blessing," "boon" - all positive
- No warning, no tension
- Feels like a gift, not a test
- **Lesson**: Positive framing reduces decision anxiety

**For 30 Lux Chatbot Adaptation:**
```
Message 1 (Narrative):
"A shrine offers a blessing.

Choose a boon:"

[Present 2 buttons]
Button 1 (neutral): "Increase Attack by 8%"
Button 2 (neutral): "Increase Defense by 12%"
```

---

### Image 4: Tutorial Screen (Rule of Three)

**What Works:**

**Information Architecture:**
- 3 distinct chunks
- Each chunk = 1 concept
- Line breaks separate chunks
- **Perfect execution of Rule of Three**

**Chunk Breakdown:**
1. **The Loop**: "In Sword & Supper each post is a mission, but your character's progress is persistent!" (17 words)
2. **The System**: "Use coins to upgrade your stats and become stronger." (10 words)
3. **The Action**: "Click one of the buttons above to level up!" (9 words)

**Typography:**
- Black text on white (maximum contrast)
- Sans-serif, bold
- Generous white space
- All text visible without scrolling
- **Lesson**: Onboarding must be scannable in 3 seconds

**Sentence Length:**
- Longest: 17 words
- Shortest: 9 words
- Average: 12 words
- **All under 15-word rule**

**For 30 Lux Chatbot Adaptation:**
```
Message 1 (System/Tutorial):
"In 30 Lux Story, each conversation shapes your journey. Your choices have lasting consequences.

Use experience to unlock new abilities and paths.

Tap a choice below to continue your story."
```

---

## PART VII: TRANSLATING DESKTOP TO MOBILE CHATBOT

### Key Differences: Desktop Popup vs Mobile Chat

| Desktop (Sword & Supper) | Mobile Chatbot (30 Lux Story) |
|--------------------------|--------------------------------|
| Static modal popups | Sequential message flow |
| All info visible at once | Progressive reveal with scrolling |
| Mouse hover states | Touch/tap only interactions |
| Landscape orientation | Portrait (9:16 ratio) |
| Buttons alongside text | Buttons below narrative |
| No message history | Scrollable chat history |
| Session-based | Persistent conversation thread |

### Adaptation Strategies

#### A. Breaking Popups into Message Sequences

**Desktop Pattern (Single Screen):**
```
[Orange Banner: User attribution]
[White Box: Narrative text]
[Green Button: Action]
```

**Mobile Pattern (Sequential Messages):**
```
Message 1: [Badge component] "Mission by @Username"
[typing indicator 1s]
Message 2: Narrative text (2-3 lines)
[typing indicator 1.5s]
Message 3: [Button component] "Start Mission"
```

**Why**: Mobile users expect conversation rhythm. Dumping everything at once feels unnatural in chat interface.

#### B. Button Placement and Sizing

**Desktop:**
- Buttons below text in same container
- 200-300px wide
- Mouse hover states

**Mobile (shadcn adaptation):**
```typescript
// Minimum touch target: 44pt height
// Full width buttons with padding
<Button
  className="w-full min-h-[44px] text-base"
  variant={isStoryChoice ? "default" : "outline"}
>
  Choice text here
</Button>

// Spacing between multiple choices
<div className="flex flex-col gap-3">
  <Button>Choice 1</Button>
  <Button>Choice 2</Button>
</div>
```

**Why**: Thumb-friendly targets, no precision required.

#### C. Text Container Styling (shadcn)

**For Narrative Messages:**
```typescript
<Card className="max-w-[85%] mx-auto">
  <CardContent className="pt-6 px-6 pb-6">
    <p className="text-base leading-relaxed">
      Story text with proper line breaks.

      Second paragraph after break.
    </p>
  </CardContent>
</Card>
```

**For System Messages:**
```typescript
<Alert className="max-w-[90%] mx-auto">
  <AlertDescription className="text-sm text-center">
    System notification or tutorial info
  </AlertDescription>
</Alert>
```

**For User Attribution (Social):**
```typescript
<Badge variant="secondary" className="bg-orange-500">
  Mission by @Username
</Badge>
```

#### D. Choice Architecture Patterns

**Pattern 1: Binary Choice (Yes/No, Accept/Refuse)**
```typescript
<div className="flex gap-3">
  <Button variant="default" className="flex-1">
    Accept
  </Button>
  <Button variant="outline" className="flex-1">
    Refuse
  </Button>
</div>
```

**Pattern 2: Strategic Choice (Multiple options, equal weight)**
```typescript
<div className="flex flex-col gap-3">
  <Button variant="secondary">
    Increase Attack by 8%
  </Button>
  <Button variant="secondary">
    Increase Defense by 12%
  </Button>
</div>
```

**Pattern 3: Tiered Choices (Risk levels)**
```typescript
<Button variant="default" className="w-full">
  Safe choice (lower reward)
</Button>
<Button variant="destructive" className="w-full mt-3">
  Risky choice (higher reward, clear danger signal)
</Button>
<Button variant="ghost" className="w-full mt-3">
  Walk away
</Button>
```

#### E. Stat Display Integration

**Desktop**: Overlays or separate panels

**Mobile Chat Pattern:**
```typescript
// Inline stat changes in message
<div className="flex items-center gap-2 text-sm">
  <Badge variant="outline" className="bg-green-50">
    +8% Attack
  </Badge>
  <Badge variant="outline" className="bg-red-50">
    -5% Defense
  </Badge>
</div>

// Floating stat change notification (toast)
toast({
  title: "Defense increased!",
  description: "+12% Defense",
  variant: "default"
})
```

#### F. Pacing with Typing Indicators

**Fast (Combat, Urgency):**
```typescript
await simulateTyping(500) // 0.5s
```

**Medium (Standard narrative):**
```typescript
await simulateTyping(1500) // 1.5s
```

**Slow (Dramatic reveals):**
```typescript
await simulateTyping(2500) // 2.5s
```

**User Control:**
```typescript
// Always allow tap-to-skip typing
<div onClick={skipTyping}>
  {isTyping ? <TypingIndicator /> : <MessageContent />}
</div>
```

#### G. Managing Conversation History

**Problem**: Desktop popups disappear. Chat history persists and can get cluttered.

**Solution - Message Grouping:**
```typescript
// Group related messages visually
<div className="space-y-2 mb-6"> {/* Scene group */}
  <Message type="narrative">Intro text</Message>
  <Message type="narrative">Development</Message>
  <Message type="choice">Choice prompt</Message>
</div>

<Separator className="my-6" /> {/* Scene break */}

<div className="space-y-2"> {/* New scene */}
  <Message type="result">Outcome of choice</Message>
</div>
```

**Solution - Collapsible Past Choices:**
```typescript
// After user selects, collapse other options
<Collapsible>
  <CollapsibleTrigger>
    <Badge>Your choice: Increased Attack</Badge>
  </CollapsibleTrigger>
  <CollapsibleContent>
    {/* Show all options that were available */}
  </CollapsibleContent>
</Collapsible>
```

---

## PART VIII: 30 LUX STORY SPECIFIC GUIDELINES

### Mobile-First Writing Rules

**For Every Story Beat:**

1. **Open with hook** (1 sentence, under 10 words)
2. **Develop context** (1-2 sentences, 20 words max total)
3. **Close with tension or question** (1 sentence)
4. **Send as ONE message** (total: 3-4 sentences, 40-50 words max)

**Example:**
```
Your torch flickers.

Something massive shifts in the darkness ahead. The ground trembles with each movement.

Do you press forward or retreat?
```

### Choice Writing Rules

**Choice Button Text:**
- 3-7 words per choice
- Active voice
- Start with verb when possible
- Make consequences clear

**Good:**
- "Attack with sword" (3 words)
- "Negotiate peacefully" (2 words)
- "Increase dodge but lose defense" (5 words)

**Bad:**
- "You could try attacking it with your sword if you want" (11 words, passive)
- "Option A" (vague)
- "Do the thing" (unclear consequence)

### Color Scheme for 30 Lux Story (shadcn)

**Narrative Messages**: Default/secondary
**System Messages**: Muted
**User Choices**: Default (primary action) or outline (secondary)
**Positive Outcomes**: Success green
**Negative Outcomes**: Destructive red
**Neutral Outcomes**: Secondary
**Social/Community**: Orange badge
**Tutorial/Help**: Info blue

### Accessibility Checklist

- [ ] All buttons min 44pt tall
- [ ] Text size 16px minimum (1rem base)
- [ ] Line height 1.5-1.6x
- [ ] High contrast (4.5:1 minimum)
- [ ] Focus indicators visible
- [ ] Screen reader labels on all interactive elements
- [ ] No color-only information (use icons + text)
- [ ] Tap targets have 8px spacing minimum

---

## PART IX: RAPID REFERENCE CARDS

### Audit Questions
For any piece of content, ask:

**Clarity**: Can this be understood in 3 seconds?
**Load**: Am I presenting too much at once?
**Typography**: Can everyone read this easily?
**Emotion**: What feeling does this create?
**Color**: What does this color communicate?
**Feedback**: Will users know their action worked?
**Access**: Can everyone use this, regardless of ability?
**Hierarchy**: Does my eye path match my information order?

### Design Process
1. **Write for clarity** (content first)
2. **Structure for comprehension** (break into chunks)
3. **Style for readability** (typography and color)
4. **Frame for emotion** (context and tone)
5. **Test for accessibility** (inclusive design)
6. **Validate with feedback** (microinteractions)

---

## Core Takeaway
Every design decision either adds to or subtracts from cognitive load. Your job is to ruthlessly subtract.
