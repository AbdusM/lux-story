# AAA Game Development: Strategic Framework & Decision-Making Guide

## Executive Summary

This document provides strategic frameworks for making informed decisions about AAA game scope, architecture, and resource allocation. It connects the quantitative benchmarks (content volumes) with implementation patterns (technical systems) through strategic lenses that help teams navigate the complexity of modern game production.

**Core Premise**: AAA game development is fundamentally about intelligent constraint management within an iron triangle of Scope, Time, and Resources.

---

## THE IRON TRIANGLE: AAA's Fundamental Trade-Offs

### Understanding the Constraint Model

```
        SCOPE
         /\
        /  \
       /    \
      /      \
     /   Q    \
    /  (Quality)\
   /______________\
TIME            BUDGET
(Schedule)     (Resources)
```

**The Iron Law**: You cannot change one constraint without affecting the others.

### AAA-Specific Formulation

**Traditional AAA (Waterfall-ish):**
- Scope is relatively FIXED (the game vision)
- Time and Budget are VARIABLES (extend schedule, add staff)
- Result: Games slip 6-12 months, budgets balloon

**Modern AAA (Hybrid Agile):**
- Time and Budget are FIXED (publisher deadlines, investment rounds)
- Scope is VARIABLE (cut features, simplify systems)
- Result: "Minimum AAA Product" at launch, post-launch content

### Strategic Implications by Development Phase

**Pre-Production (Year 1):**
```
Priority: Prove the scope is achievable
- Prototype core mechanics
- Validate technical feasibility
- Estimate content production rates
- Adjust scope BEFORE full production

DECISION POINT: "Can we build what we've designed in 3-4 years with 200-600 people?"
If NO → Scope must change NOW
```

**Production (Years 2-4):**
```
Priority: Protect the core experience
- Classify features: Core (must-have), Desired (important), Polish (nice-to-have)
- Monthly scope reviews: What's behind schedule?
- Strategic cuts: Remove Desired features to save Core

DECISION POINT: "Are we on track to hit Alpha with core features complete?"
If NO → Cut now or delay launch
```

**Polish (Final 6-12 months):**
```
Priority: Ship quality
- Content lock (no new features)
- Bug fixing, optimization
- Balance tuning

DECISION POINT: "Can we ship in 6 months at acceptable quality?"
If NO → Delay OR reduce scope to shippable subset
```

---

## STRATEGIC CONTENT ALLOCATION: The 70/20/10 Rule

### Applying Pareto to Content Investment

**70% - Core Gameplay Loop** (The Player's First 10 Hours)
- Critical path missions/quests
- Core combat/traversal mechanics
- Essential progression systems
- Main narrative

**Why**: Reviews, refund windows, and player retention decisions happen here.

**Benchmarks:**
- 15-25 main story quests (10-30 hours)
- 5-10 core mechanics fully polished
- Primary gameplay loop refined to satisfaction
- First 3 progression tiers tuned

**20% - Breadth Content** (Hours 10-40)
- Side quests and secondary content
- Exploration rewards
- Character customization depth
- Optional challenges

**Why**: Differentiates "good game" from "great game" in reviews. Creates word-of-mouth.

**Benchmarks:**
- 50-100 side quests
- 20-40 discoverable locations
- Secondary progression systems
- Repeatable activities

**10% - Long-Tail Content** (Hours 40+)
- Collectibles and completionist content
- Post-game challenges
- Secret areas
- Achievement hunting

**Why**: Keeps engaged players active longer, drives social media content.

**Benchmarks:**
- 100-300 collectibles
- Hard mode/NG+
- Hidden bosses/areas
- Mastery challenges

### Anti-Pattern Warning: The "Inverted Pyramid"

**Common Failure Mode:**
```
Team spends:
- 20% on core loop → feels shallow
- 40% on breadth content → lacks depth
- 40% on long-tail → nobody reaches it

Result: Game feels "mile wide, inch deep"
Reviews cite: "Repetitive core gameplay"
```

**Example: Assassin's Creed Unity (Launch)**
- 200+ side activities
- Core assassination gameplay felt repetitive
- Result: Mixed reviews despite massive content volume

**Correct Approach (Assassin's Creed Origins):**
- Refined core combat system (more depth)
- 100+ quests but better paced
- Result: Franchise revitalization

---

## CROSS-SYSTEM INTEGRATION MAP

### The Six Core Systems & Their Dependencies

```
1. PROGRESSION (XP, Levels, Skills)
   ├─> FEEDS: Combat (damage scaling)
   ├─> FEEDS: Quest System (level requirements)
   └─> FEEDS: Loot System (item level tiers)

2. COMBAT / CORE GAMEPLAY
   ├─> REQUIRES: Animation System (move execution)
   ├─> REQUIRES: Progression (player power scaling)
   └─> FEEDS: Quest System (combat objectives)

3. QUEST SYSTEM
   ├─> REQUIRES: Dialogue System (quest givers)
   ├─> REQUIRES: World State (tracking completion)
   ├─> FEEDS: Progression (XP rewards)
   └─> FEEDS: Loot (item rewards)

4. DIALOGUE SYSTEM
   ├─> REQUIRES: Quest System (dialogue conditions)
   ├─> REQUIRES: World State (NPC reactions)
   └─> FEEDS: Quest System (trigger quests)

5. INVENTORY / LOOT
   ├─> REQUIRES: Progression (item level gates)
   ├─> REQUIRES: Quest System (quest item handling)
   └─> FEEDS: Combat (equipment stats)

6. WORLD / CONTENT POPULATION
   ├─> CONTAINS: Quest givers (Dialogue)
   ├─> CONTAINS: Enemy spawns (Combat)
   └─> CONTAINS: Loot locations (Inventory)
```

### Critical Dependency Insight: "Cannot Build in Isolation"

**Common Mistake:**
```
Timeline:
Month 1-3: Build dialogue system (complete!)
Month 4-6: Build quest system (wait, quests need dialogue integration...)
Month 7-9: Build progression (wait, quests and combat need XP rewards...)

Result: 9 months of rework integrating systems
```

**Correct Approach: Vertical Slice**
```
Month 1-3: Build ONE quest end-to-end
- Dialogue system (minimal, just enough for this quest)
- Quest tracking (minimal, just for this quest)
- Combat encounter (one enemy type)
- Loot drop (one item)
- Progression reward (XP + level up)

Result: Proves integration, validates architecture
Month 4+: Expand each system horizontally
```

### Integration Complexity: The N² Problem

```
Systems Integration Complexity:

2 Systems: 1 integration point
3 Systems: 3 integration points
6 Systems: 15 integration points
10 Systems: 45 integration points

Formula: (N × (N-1)) / 2

LESSON: Every new system exponentially increases integration burden
```

**Strategic Implication:**
- Evaluate new features by integration cost, not just development cost
- Example: "Add fishing minigame" seems simple
  - Must integrate with: Inventory, World, UI, Animation, Quest System
  - True cost: 3-5× base feature implementation

---

## QUALITY VS. QUANTITY STRATEGIC MATRIX

### The Four Quadrants

```
            HIGH QUANTITY
                 |
    C            |            D
  "Sprawling"    |       "AAA Sweet Spot"
  (Assassin's    |       (Witcher 3, RDR2,
   Creed style)  |        Elden Ring)
                 |
LOW QUALITY ─────┼───── HIGH QUALITY
                 |
    A            |            B
  "Unfinished"   |        "Focused"
  (Launch        |        (God of War 2018,
   failures)     |         Last of Us)
                 |
            LOW QUANTITY
```

**Quadrant Analysis:**

**A - Low Quality, Low Quantity** (Avoid)
- Examples: No Man's Sky (launch), Anthem, Fallout 76 (launch)
- Lessons: Insufficient content AND poor polish = disaster
- Recovery Path: Months/years of post-launch fixes

**B - High Quality, Low Quantity** (Viable AAA Strategy)
- Examples: God of War (2018), The Last of Us, Uncharted series
- Advantages: 
  - 20-30 hour campaigns, highly polished
  - Budget: $100-200M
  - Team: 200-300 people
  - Dev Time: 3-4 years
- Disadvantages:
  - Lower replay value
  - Must be perfect (no "content carries it")

**C - Low Quality, High Quantity** (High Risk)
- Examples: Some Assassin's Creed entries, generic open-world games
- Advantages:
  - "Value" perception (100+ hours)
  - Can survive mediocre reviews
- Disadvantages:
  - "Quantity over quality" criticism
  - Player fatigue
  - Rarely wins GOTY

**D - High Quality, High Quantity** (AAA Peak, Expensive)
- Examples: Witcher 3, RDR2, BG3, Elden Ring, Skyrim
- Requirements:
  - 100-200 hours of content
  - High production values throughout
  - Budget: $200-400M
  - Team: 400-1,600 people
  - Dev Time: 4-7 years
- Risk: Any quality slips are magnified by content volume

### Strategic Positioning Questions

**For Your Project:**

1. **"What's our target playtime?"**
   - 20-30 hours → Quadrant B (Focused)
   - 60-100 hours → Quadrant D (Sprawling/Sweet Spot border)
   - Choose deliberately

2. **"What's our budget ceiling?"**
   - <$150M → Quadrant B strongly recommended
   - $150-300M → Can attempt Quadrant D
   - >$300M → Required for Quadrant D at AAA quality

3. **"What's our competitive advantage?"**
   - Strong narrative/polish → Quadrant B
   - Innovative systems → Quadrant B or D
   - Massive scope → Must be Quadrant D

---

## PLAYER PSYCHOLOGY & RETENTION ARCHITECTURE

### The Engagement Pyramid

```
        [Mastery]
      (Hours 100+)
    ──────────────
     [Achievement]
    (Hours 40-100)
   ─────────────────
    [Progression]
   (Hours 10-40)
  ──────────────────
   [Core Fun Loop]
  (First 10 hours)
 ────────────────────

Layer 1 (Foundation): Core Fun Loop
- Is the moment-to-moment gameplay satisfying?
- Combat feel, movement responsiveness, controls
- MUST be fun without progression systems

Layer 2: Progression Systems
- XP, levels, skill trees
- "I'm getting stronger" feeling
- Unlocking new abilities

Layer 3: Achievement & Collection
- Side quests, exploration rewards
- "I'm discovering new things"
- Optional challenges

Layer 4 (Peak): Mastery
- Competitive modes, hard difficulties
- "I'm one of the best players"
- Prestige systems
```

**Critical Principle**: Each layer requires the foundation below it.

**Common Failure**:
```
Weak Layer 1 (core gameplay isn't fun)
+ Strong Layer 2 (great progression)
= Game that feels like "work" after progression ends

Example: Many live-service games at launch
```

### Psychological Hooks: The Retention Toolbox

**1. Variable Ratio Rewards (Most Powerful)**
```
Definition: Random rewards on unpredictable schedule
Example: Loot drops, chest contents
Psychological Basis: Same mechanism as slot machines
Power: Extremely effective, potentially manipulative

AAA Application:
- Loot tables with rare drops
- Critical hits in combat
- Random world events

Ethical Boundary: Don't gate progression behind pure RNG
```

**2. Scheduled Rewards (Daily Engagement)**
```
Definition: Predictable rewards for routine actions
Example: Daily login bonuses, weekly challenges
Power: Creates habitual play patterns

AAA Application:
- Daily quests (MMOs, live service)
- Weekly dungeons/raids
- Battle pass progression

Warning: Can feel like "obligation" rather than fun
```

**3. Progression Curve (Long-Term Hook)**
```
Definition: Constant sense of advancement
Example: XP bars, skill trees, power increases
Power: Creates "just one more level" motivation

AAA Application:
- Character leveling (RPGs)
- Gear tier systems
- Mastery/prestige ranks

Design Principle: Early levels fast, later levels slower (logarithmic)
```

**4. Completion Drive (Psychological Closure)**
```
Definition: Discomfort with incomplete sets
Example: Collectibles, achievements, map completion
Power: Compels 100% completion attempts

AAA Application:
- Collectibles (Assassin's Creed)
- Achievements/Trophies
- Quest log completion
- Map "fog of war" reveal

Pitfall: Too many collectibles = tedious, not fun
Sweet Spot: 100-300 collectibles for 60+ hour game
```

**5. Social Comparison (Competitive Drive)**
```
Definition: Desire to rank above peers
Example: Leaderboards, achievements, PvP ranks
Power: Motivates competitive players

AAA Application:
- Leaderboards (speedruns, scores)
- PvP rankings
- Public achievements
- Twitch/YouTube-worthy moments

Caution: Alienates non-competitive players if overused
```

**6. Narrative Investment (Emotional Hook)**
```
Definition: Care about characters and story outcomes
Example: Story-driven games, character relationships
Power: Creates emotional attachment beyond mechanics

AAA Application:
- Well-written main story
- Romanceable companions
- Player choice consequences
- Character arcs

Gold Standard: The Last of Us, Red Dead Redemption 2
```

### Retention Timeline: The 3-30-90 Model

**Day 3 Retention** (Critical)
```
Question: "Is this game fun?"
Hook Required: Core gameplay loop must be satisfying
Dropout Point: Tutorial/early game
Fix: Polish first 3 hours relentlessly

Industry Benchmark:
- Great: 40-60% retention
- Average: 20-30%
- Poor: <15%
```

**Day 30 Retention** (Important)
```
Question: "Is there enough content to keep me engaged?"
Hook Required: Progression systems + breadth content
Dropout Point: Post-campaign, mid-game plateau
Fix: Ensure content variety, progression doesn't stall

Industry Benchmark:
- Great: 15-25%
- Average: 5-10%
- Poor: <5%
```

**Day 90 Retention** (Long-Tail)
```
Question: "Am I still discovering new things?"
Hook Required: Mastery systems, replayability, secrets
Dropout Point: "Beaten the game"
Fix: Endgame content, NG+, challenges

Industry Benchmark:
- Great: 5-10%
- Average: 2-5%
- Poor: <2%
```

---

## SCOPE PRIORITIZATION FRAMEWORKS

### The MoSCoW Method (Adapted for Games)

**Must Have (60% of effort)**
- Core gameplay loop functional and polished
- Critical path quests completable
- Game boots, saves, loads reliably
- Minimum viable content for reviews

**Should Have (25% of effort)**
- Majority of side content
- Secondary progression systems
- Most character customization
- Quality of life features

**Could Have (10% of effort)**
- Extra polish, particle effects
- Additional customization options
- Bonus challenges
- Easter eggs

**Won't Have (5% reserved)**
- "Dream features" deferred
- Post-launch content candidate
- Sequel features

### The "Walk-Away Test"

**Framework for Cut Decisions:**

When feature X is threatened:
1. **If we cut this, will players notice?**
   - Yes, immediately → Must Have
   - Yes, after 10 hours → Should Have
   - Maybe, after 40 hours → Could Have
   - Probably not → Won't Have

2. **Does this feature support our core pillar?**
   - Directly → Must/Should Have
   - Tangentially → Could Have
   - Unrelated → Won't Have

3. **Can reviewers play without it?**
   - No → Must Have
   - Yes, but they'd complain → Should Have
   - They wouldn't notice → Could/Won't Have

**Example Application:**

Feature: "Horse customization (8 coat colors)"
1. Will players notice? Yes, but after choosing once
2. Supports core pillar? Only if exploration is core
3. Can reviewers play without it? Yes
→ Verdict: **Could Have** (cut if behind schedule)

Feature: "Save system"
1. Will players notice? Immediately
2. Supports core pillar? Enables all gameplay
3. Can reviewers play without it? No
→ Verdict: **Must Have** (never cut)

---

## TEAM STRUCTURE & RESOURCE ALLOCATION

### The Content Creation Bottleneck

**AAA Content Production Rates (Industry Averages):**

```
3D Character Artist:
- 1 hero character (fully rigged): 3-6 months
- 1 enemy type: 1-2 months
- 1 NPC background: 1-2 weeks

Environment Artist:
- 1 major location: 2-4 months
- 1 dungeon: 1-2 months
- Props/clutter: continuous

Animator:
- 1 combat animation: 1-3 days
- 1 cinematic: 1-3 weeks
- Full character set (50+ anims): 2-3 months

Quest Designer:
- 1 main quest (1 hour gameplay): 2-4 weeks
- 1 side quest (15-30 min): 1 week
- 100 quests → 1 designer = 2 years

Writer:
- 10,000 words of dialogue: 1-2 weeks
- 50,000 lines total → 1 writer = 2+ years
```

**Strategic Insight: Writers & Designers Are Always the Bottleneck**

```
Common Team Imbalance:

Engineers: 30-40% of team
Artists: 40-50% of team
Designers/Writers: 10-20% of team

Result: Art backlog clears, but content pipeline stalls

Example (200-person team):
- 80 engineers (many idle after systems complete)
- 90 artists (waiting for design direction)
- 30 designers (overwhelmed with content)

Better Allocation:
- 60 engineers
- 80 artists
- 50 designers + writers
- 10 QA/producers
```

### The Production Team Scaling Curve

```
Year 1 (Pre-Production): 20-50 people
- Core engineers building tech
- Concept artists
- Designers prototyping

Year 2-3 (Production): 200-600 people
- Full art team creating assets
- Designers creating content
- Engineers supporting tools

Year 4 (Polish): 150-400 people
- Ramp down art (most assets complete)
- Ramp up QA
- Designers balancing/tuning

Post-Launch: 50-200 people
- Live ops team
- DLC production
- Maintenance
```

**Budget Implication:**
```
Average AAA Salary: $80-120K/year

200-person team for 4 years:
200 people × $100K × 4 years = $80M (salaries only)

Add overhead (office, tools, benefits):
$80M × 1.5-2.0 = $120-160M total team cost

This is BEFORE:
- Marketing ($50-100M for AAA)
- Voice acting ($5-10M)
- Music/audio ($2-5M)
- Mocap ($1-3M)
- Outsourcing ($10-30M)

Total Budget: $200-300M typical for AAA
```

---

## TECHNICAL DEBT & ARCHITECTURE DECISIONS

### When to Build vs. Buy

**Decision Matrix:**

```
                Custom Build  |  License/Buy
-------------------------------------------------
GAME ENGINE        Rare         ✓ (Unreal/Unity)
PHYSICS            Never        ✓ (Havok/PhysX)
AUDIO MIDDLEWARE   Rare         ✓ (FMOD/Wwise)
ANIMATION SYSTEM   Sometimes    ✓ (Engine-provided)
DIALOGUE SYSTEM    Often        Situational
QUEST SYSTEM       Usually      Rare (too custom)
INVENTORY SYSTEM   Usually      Sometimes
UI FRAMEWORK       Sometimes    ✓ (Coherent/Scaleform)
```

**Build When:**
1. Your needs are highly custom (quest systems, core gameplay)
2. It's a competitive differentiator
3. You have engineers who WANT to build it
4. Long-term maintenance is manageable

**Buy When:**
1. It's commodity functionality (physics, audio)
2. Community support is valuable
3. Time-to-market matters
4. Maintenance burden would be high

**Anti-Pattern: "Not Invented Here" Syndrome**
```
Team spends 18 months building custom engine
When Unreal Engine would've worked

Cost:
- 5 engineers × 18 months × $120K = $900K
- Opportunity cost: Features not built
- Result: Inferior to commercial engines anyway

Better Choice:
- License Unreal: $0 upfront (5% royalty)
- 5 engineers build game features instead
```

### Technical Debt: The Hidden Schedule Killer

**Definition**: Design/code shortcuts that save time now but cost time later

**Common Sources:**

1. **"Temporary" Hacks That Become Permanent**
```
Example: "We'll just hardcode the tutorial for now"
3 years later: Tutorial is still hardcoded, breaks every update
```

2. **Skipped Refactoring**
```
Month 6: "This code works but it's messy, we'll clean it later"
Month 18: Code is now 10× messier, nobody understands it
Month 24: Entire system rewrite required
```

3. **Poor Tool Development**
```
Year 1: "Designers can just manually edit JSON files"
Year 3: 30 designers editing JSON, constant errors, productivity 50%
Should have built: Visual editor tool
```

**Strategic Principle: Pay Down Debt in Pre-Alpha**

```
Alpha Milestone (12 months before ship):
- FEATURE FREEZE
- Spend 2-3 months on:
  - Code refactoring
  - Tool improvements
  - Performance optimization
  - Tech debt paydown

Result:
- Final 9 months are smoother
- Fewer bugs
- Faster iteration
```

---

## GENRE-SPECIFIC STRATEGIC CONSIDERATIONS

### Open-World RPG (Skyrim, Witcher 3 model)

**Content Requirements:**
- 50+ hours main story
- 100+ side quests
- 200+ locations
- 50 km² playable space

**Critical Success Factors:**
1. Strong exploration loop (reward discovery)
2. Environmental storytelling (world feels lived-in)
3. Emergent gameplay (systems interact)

**Major Risks:**
- Content pipeline bottleneck (need 30+ content designers)
- Performance (large open world)
- "Empty world" syndrome if density too low

**Budget/Team:**
- $150-300M
- 400-1,000 people
- 4-6 years

### Action-Adventure (God of War, Uncharted model)

**Content Requirements:**
- 15-25 hours main story
- 30-50 hours completionist
- 20-40 setpiece moments
- 5-10 major locations

**Critical Success Factors:**
1. Polished core combat (must feel great)
2. Strong narrative (carries shorter length)
3. Memorable setpieces (wow moments)

**Major Risks:**
- Combat repetition (less content to hide it)
- Linearity criticism (if too on-rails)
- Replayability (shorter = less value perception)

**Budget/Team:**
- $100-200M
- 200-400 people
- 3-5 years

### Live Service / Games-as-Service

**Content Requirements (Launch):**
- 20-40 hours campaign
- Repeatable endgame loop
- Social/competitive features
- Content roadmap (12+ months)

**Critical Success Factors:**
1. Endgame is FUN (not just grind)
2. Regular content updates (monthly)
3. Fair monetization (no pay-to-win)
4. Community management

**Major Risks:**
- Burn out from content treadmill
- Monetization backlash
- "Not enough content" at launch
- Live ops budget (ongoing)

**Budget/Team:**
- $100-200M launch
- +$20-50M/year live ops
- 400-600 people initially
- Scales to 200-400 sustain team

---

## FINANCIAL MODELS & ROI CONSIDERATIONS

### The Profitability Equation

```
Profit = (Units Sold × Price) - (Development + Marketing + Platform Fees)

Example (Successful AAA):
- Units: 5 million
- Price: $60 (average after discounts)
- Gross Revenue: $300M

Costs:
- Development: $200M
- Marketing: $100M
- Platform Fees (30%): $90M
Total Cost: $390M

Result: -$90M LOSS

Break-Even: 6.5 million units

This is why DLC/MTX matter:
Additional $50M in DLC revenue → Now profitable
```

### The Time-Value of Money Problem

**AAA Development is High-Risk Investment:**

```
Year 0: Invest $50M (team ramp-up)
Year 1: Invest $70M
Year 2: Invest $80M
Year 3: Invest $100M
Year 4: Game ships, revenue starts

Total Capital At Risk: $300M for 4 years
Opportunity Cost: Could invest in 10 smaller games

If game fails: Lose entire $300M
If game succeeds: Need 5-7M sales to break even
```

**Strategic Implication: Publishers Want Franchises**

```
Single Game:
- Investment: $300M
- Return: Maybe 2× if successful (not guaranteed)
- Risk: Total loss possible

Franchise (3 Games over 9 years):
- Investment: $900M total
- Return: Sequels cheaper to make, IP value builds
- Risk: Distributed across titles

This is why publishers pressure for sequels/annualization
```

### Alternative Funding Models

**1. Publisher Traditional**
- Publisher funds 100%
- Developer gets salary + maybe royalties after recoup
- Risk: All on publisher
- Downside: Developer doesn't own IP

**2. Publisher + Developer Co-Funding**
- Publisher: $150M, Developer: $50M
- Revenue split 75%/25%
- Risk: Shared
- Benefit: Developer retains partial IP

**3. Self-Funded (Rare for AAA)**
- Examples: CD Projekt Red (Witcher 3), Valve
- Developer takes all risk
- Developer keeps all profit
- Requires: Strong prior success or wealth

**4. Platform Exclusive Deal**
- Sony/Microsoft pays for exclusivity
- Example: $50-100M exclusivity payment
- Reduces financial risk
- Trade-off: Smaller potential audience

---

## MARKET TIMING & COMPETITIVE POSITIONING

### Release Window Strategy

**Holiday Season (Oct-Dec):**
- Pros: Highest sales volume (gifts), consumer spending
- Cons: Maximum competition (every AAA competes)
- Best For: Established franchises (CoD, FIFA, AC)

**Q1 (Jan-Mar):**
- Pros: Less competition, "New Year" spending
- Cons: Post-holiday budget fatigue
- Best For: Story-driven single-player (Horizon, Persona)

**Summer (Jun-Aug):**
- Pros: Students on break, moderate competition
- Cons: Lower overall game sales vs. holidays
- Best For: Multiplayer/service games

**Early Fall (Sep-Oct):**
- Pros: Pre-holiday hype building, decent sales
- Cons: Crowded (everyone wants October)
- Best For: Games targeting hardcore audience

### Competitive Analysis Framework

**Before Setting Scope, Answer:**

1. **"What are the 3 closest competitors?"**
   - Match or exceed their content volume
   - Example: If Assassin's Creed has 100 hours, yours needs 80-120

2. **"What's our 'reason to exist'?"**
   - Innovation: Unique mechanic (Portal, Outer Wilds)
   - Execution: Best-in-class polish (God of War)
   - Scope: Biggest world (RDR2, BG3)
   - IP: Established franchise (Spider-Man)

3. **"Can we win on Metacritic?"**
   - AAA games <80 score often fail commercially
   - 85-90+ drives outsized sales
   - Quality threshold is BINARY: Must be "good" or fail

### The "Top 5 or Don't Bother" Reality

**Market Saturation Insight:**
```
Steam releases 12,000+ games/year
PlayStation/Xbox: 500+ games/year
Players have LIMITED time/budget

Result: Only top ~5 games in genre per year get major attention

Implications:
- 6th-10th place: Struggle for visibility
- 11th+: Commercially irrelevant (niche exceptions)

Strategic Question: "Can we be Top 5 in our genre this year?"
If uncertain → Consider delaying to better year
```

---

## CRISIS MANAGEMENT: WHEN THINGS GO WRONG

### The 3 Common AAA Disasters

**1. Feature Creep (Scope Explosion)**

**Warning Signs:**
- Monthly scope additions
- "It's just a small feature..."
- Schedule slipping but scope isn't cut

**Response:**
```
Month 18 Check: Are we on track for content complete by Month 30?
If NO:
- Emergency scope review
- Classify: Must/Should/Could/Won't
- Cut 20-30% of Could/Won't immediately
- Reset schedule based on new scope
```

**2. Technical Catastrophe (Engine/Tool Failure)**

**Warning Signs:**
- Build times >30 minutes
- Frequent crashes
- Tools don't work for designers

**Response:**
```
Tools are PRODUCTION MULTIPLIERS
- 1 engineer fixing tools can 10× designer productivity
- Dedicate 20% of engineering to tools ALWAYS

If builds are slow:
- Stop feature work
- Assign 3-5 engineers to build pipeline
- Fix BEFORE continuing content
```

**3. Quality Crisis (Game Isn't Fun)**

**Warning Signs:**
- Playtesters not engaged
- Team members don't play on their own time
- "It'll be fun once we add more content"

**Response:**
```
STOP ADDING CONTENT
- Core gameplay loop must be fun FIRST
- Back to prototyping
- Polish one 10-minute loop until it's great
- THEN scale

Skyrim/Bethesda Rule: "If dungeon #1 isn't fun, dungeon #100 won't save it"
```

### The "Cut the Legs" Strategy

**When Behind Schedule:**

Traditional Approach (BAD):
```
Cut 10% from every system
Result: Every system feels incomplete
Player experience: Mediocre across the board
```

Better Approach (GOOD):
```
Cut entire features
- Remove fishing minigame (100%)
- Remove crafting system (100%)
- Keep combat, quests, exploration (100%)

Result: Fewer systems, but polished
Player experience: "I wish it had more, but what's here is great"
```

**Principle: Players prefer 8/10 quality with 70% of features vs. 6/10 quality with 100% of features**

---

## POST-LAUNCH STRATEGY

### The Content Roadmap Decision

**Option 1: Complete at Launch**
- Pros: Reviews reflect full game, no "cut content" accusations
- Cons: Long dev time, no post-launch revenue stream
- Best For: Single-player, story-focused games

**Option 2: Live Service Model**
- Pros: Revenue stream, can iterate based on feedback
- Cons: "Incomplete at launch" risk, ongoing costs
- Best For: Multiplayer, service games

**Option 3: Traditional DLC**
- Pros: Extends game life, additional revenue
- Cons: Team turnover (people leave post-launch)
- Best For: Successful single-player games

### The Sequel Question

**Greenlight Sequel When:**
1. First game sells >3M units (proves audience)
2. Metacritic >80 (proves concept works)
3. Team wants to continue (avoid burnout)
4. Tech/tools are reusable (don't rebuild from scratch)

**Sequel Advantages:**
```
Game 1: $250M, 5 years
Game 2: $180M, 3.5 years (30% faster/cheaper)

Why:
- Engine/tools exist
- Team experienced
- Art pipelines established
- Core systems proven

Examples:
- Uncharted 1→2→3: Dramatic quality increases, faster dev
- Witcher 1→2→3: Each better and faster than predecessor
```

---

## CONCLUSION: STRATEGIC DECISION CHECKLIST

**Before Starting Production:**

☐ Have we defined our core pillar? (The ONE thing that must be great)
☐ Is our scope achievable in our timeline with our team?
☐ Which quadrant are we in? (Quality vs. Quantity matrix)
☐ Have we built a vertical slice proving integration?
☐ Do we have the right team balance? (Enough designers/writers)
☐ What's our competition, and why will players choose us?
☐ Can we be Top 5 in our genre this year?

**At Alpha (12 months from ship):**

☐ Is the core loop fun without progression systems?
☐ Are we on track for content complete in 6 months?
☐ If not, what gets cut? (Emergency MoSCoW triage)
☐ Is our quality bar high enough to hit Metacritic 85+?
☐ Have we paid down major technical debt?

**At Beta (6 months from ship):**

☐ Feature freeze enforced?
☐ Bug count declining week-over-week?
☐ Is marketing ready for our launch date?
☐ Have we identified our release window competitors?
☐ Post-launch plan defined? (Patches, DLC, sequel)

---

## FINAL THOUGHTS: WISDOM FROM SHIPPED GAMES

**Quotes from AAA Directors:**

"Scope is never the problem. Executing on scope is the problem." 
— Neil Druckmann, Naughty Dog

"If your game isn't fun in the first 10 minutes, it won't be fun in 100 hours."
— Todd Howard, Bethesda

"The first 90% of development takes 90% of the time. The last 10% takes the other 90%."
— Valve's Development Truism

"Players will forgive a lack of content if the core is great. They won't forgive great content with a mediocre core."
— Cory Barlog, God of War

---

**The Central Truth of AAA Development:**

You will NEVER have enough time, budget, or people to build everything you want.

Success comes from choosing the RIGHT things to build, building them well, and ruthlessly cutting the rest.

The benchmarks tell you WHAT AAA games contain.
The implementation guide tells you HOW to build those systems.
This framework helps you decide WHICH to build, WHEN, and WHY.
