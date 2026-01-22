# Ideas Backlog

Running log of future feature ideas and creative concepts. Not scheduled - captured for exploration.

**Philosophy Check:** All ideas must pass through the Ten Commandments before implementation:
1. Feel Comes First (30-second satisfaction)
2. Friction is Failure (no confusion)
3. Never Break What Works (stable foundation)
4. Show, Don't Tell (visual > text)
5. Emotion Over Mechanics (feelings > actions)
6. Kill Your Darlings (serves core loop?)
7. Honest Architecture (no over-engineering)

---

## IDEA 001: Visual Cutscenes / Orb Handoff Experience

**Date:** January 8, 2026
**Category:** Visual Polish / Immersion
**Risk Tier:** 2-3 (Medium-High)

### Concept
When handing orb to player, show visual "cutscene" before gameplay - a moment of ceremony/reverence.

### Options Explored
1. **Command-line Interface Style** - Star Wars terminal aesthetic, text-based scene
2. **Orb Visual in Markup** - ASCII art or markdown-rendered orb graphic
3. **Actual 3D Sphere** - Like Jarvis orb from OrbVoiceServices, animated sphere visual

### Philosophy Alignment

| Commandment | Alignment | Notes |
|-------------|-----------|-------|
| Feel Comes First | **Strong** | Creates ceremony, weight to the moment |
| Show Don't Tell | **Strong** | Visual > explaining what orb means |
| Emotion Over Mechanics | **Strong** | Reverence feeling before skill tracking |
| Juice is Not Optional | **Strong** | Feedback for significant moment |
| Friction is Failure | **Caution** | Must not slow down re-engagement |
| Honest Architecture | **Caution** | May require new rendering system |
| Kill Your Darlings | **Question** | Does it serve core loop? |

### Considerations
- **Trojan Horse Philosophy**: The orb IS the invisible skill tracking. Showing it visually could break the "contemplation not examination" principle... OR enhance it by making it feel earned.
- **First-time vs Returning**: Should show on first handoff, maybe skip on subsequent?
- **Reference**: OrbVoiceServices has sphere implementation that could be adapted
- **Option 1 (CLI)**: Lowest risk, fits "station terminal" aesthetic
- **Option 3 (3D)**: Highest impact but highest risk

### Decision Framework
- If orb is a REWARD → Visual ceremony makes sense
- If orb is just a TRACKER → Visual may over-emphasize mechanics

**Priority:** Future / Nice-to-have
**Effort:** Medium (CLI) to High (3D)

---

## IDEA 002: Movement and Gameplay Expansion

**Date:** January 8, 2026
**Category:** Core Experience / Major Evolution
**Risk Tier:** 3 (High)

### Concept
Evolve beyond pure dialogue-driven experience to include spatial movement and traditional gameplay elements.

### Current State
- **Now**: Dialogue-driven (Pokemon/Disco Elysium style)
- **Now**: Characters drive everything + player response/agency
- **Now**: Choices have visible consequences
- **Now**: Pattern revelation through action, not statistics

### Options Explored
1. **Station Exploration** - Move through train station platforms, discover characters
2. **Simulation Gameplay** - Interactive challenges within character contexts (already partial)
3. **Full Spatial Experience** - WASD/touch movement through 2D/3D station

### Philosophy Alignment

| Commandment | Alignment | Notes |
|-------------|-----------|-------|
| Feel Comes First | **Critical** | Movement must feel as good as dialogue |
| Friction is Failure | **Critical** | Navigation can't confuse |
| Show Don't Tell | **Strong** | World exploration IS narrative |
| Never Break What Works | **WARNING** | Dialogue system is stable foundation |
| Emotion Over Mechanics | **Question** | Does movement enhance or distract? |
| Honest Architecture | **WARNING** | Major new system required |

### Risk Analysis

**What Works Now (Don't Break):**
- Dialogue engine (983+ nodes)
- Trust mechanics (20 characters)
- Pattern system (5 types)
- State persistence

**What Movement Would Require:**
- Spatial mapping system
- Character positioning
- Movement controls
- Camera/viewport management
- Potential performance concerns (mobile-first)

### Considered Approaches

**A. Minimal: Constellation as Navigation**
- Already have constellation view
- Click character = go to character
- No true "movement" - just selection
- Risk: Low | Effort: Low

**B. Medium: Platform Selection**
- Visual station with platforms
- Click platform = go to platform/character
- Some spatial metaphor, no continuous movement
- Risk: Medium | Effort: Medium

**C. Full: Spatial Exploration**
- WASD/touch movement
- Character discovery through exploration
- Complete gameplay paradigm shift
- Risk: High | Effort: High

### Decision Framework
- **Current audience**: Birmingham youth 14-24
- **Current device**: Mobile-first
- **Current strength**: Dialogue depth, character relationships
- **Question**: Does movement make the FEELING better, or just add mechanics?

### Recommendation
Start with **Option A** (Constellation as Navigation) - it already exists and provides spatial metaphor without breaking what works. Evaluate if players WANT more movement before building it.

**Priority:** Future / Major Decision
**Effort:** Low (A) to Very High (C)
**Prerequisite:** User research on desired interaction model

---

## ISP EXPANSION: Navigation Ideas (January 8, 2026)

*Generated using Infinite Solutions Protocol - combining existing systems in novel ways*

### ISP Clusters Identified

| Cluster | Theme | Key Insight |
|---------|-------|-------------|
| A | Spatial Metaphor Deepening | Deepen existing metaphor, no new engine |
| B | Time as Navigation | Movement through time, not space |
| C | Accessibility | Alternative input modalities |
| D | Social/Collective | Multiplayer layer on existing systems |
| E | Panel-as-World | Side menus BECOME exploration space |

---

## IDEA 003: Star Walking Navigation

**Date:** January 8, 2026
**Category:** Navigation / UX Enhancement
**Risk Tier:** 1 (Low)
**ISP Cluster:** E (Panel-as-World)
**Status:** ✅ COMPLETED (January 22, 2026)

### Concept
Constellation IS the navigation system. Click a star (character) = travel directly there. No separate "select character" - the visual map becomes the control.

### Implementation
- Single-click selects, double-click travels
- Haptic feedback (heavyThud) on travel initiation
- Works for both met and unmet characters (Star Walking allows discovery)

**Priority:** DONE
**Effort:** Low (animation + click handler change)

---

## IDEA 004: Pattern Resonance Paths

**Date:** January 8, 2026
**Category:** Replayability / Pattern System
**Risk Tier:** 2 (Medium)
**ISP Cluster:** A (Spatial Metaphor Deepening)
**Status:** ✅ COMPLETED (January 22, 2026)

### Concept
Your dominant pattern reveals hidden connections on the constellation. Analytical players see different character relationship lines than Helping players. Creates natural replayability through pattern-divergent discovery.

### Implementation
- 15 resonance paths across all 5 patterns (3 per pattern at thresholds 6, 7, 8)
- Paths render as glowing dashed lines with pattern-specific colors
- Only visible when both characters have been met AND pattern threshold reached
- Examples:
  - Analytical 6+: Maya → Rohan ("Both approach problems through systematic analysis")
  - Helping 7+: Grace → Asha ("Operations and mediation - both smooth the path for others")
  - Building 8+: Devon → Maya ("Hardware and software - different materials, same builder spirit")

**Files:**
- `lib/constellation/pattern-resonance-paths.ts` - Path definitions and utilities
- `components/constellation/ConstellationGraph.tsx` - Rendering integration

**Priority:** DONE
**Effort:** Medium (new constellation lines + gating logic)

---

## IDEA 005: The Waiting Room (Patience Mechanic)

**Date:** January 8, 2026
**Category:** Pattern Integration / Hidden Content
**Risk Tier:** 1-2 (Low-Medium)
**ISP Cluster:** Combining Opposites (Movement + Stillness)
**Status:** ✅ COMPLETED (January 22, 2026)

### Concept
Lingering at locations unlocks hidden content. Rewards patience pattern organically. Contradicts assumption that "movement = progress" - stillness has power.

### Implementation
- Timer-based content unlocks at 30s, 60s, 120s thresholds
- Content types: ambient, memory, whisper, insight
- Each reveal grants patience pattern XP (0.5, 1.0, 1.5)
- Visual indicator: Breathing glow when approaching threshold
- Content for Samuel hub, Maya, Devon, Marcus, Rohan, Tess, Jordan
- Some reveals are one-shot (play once per session)
- Some add knowledge flags for deeper integration

**Files:**
- `lib/waiting-room-content.ts` - Content definitions
- `hooks/useWaitingRoom.ts` - Timer and reveal logic
- `components/ui/WaitingRoomIndicator.tsx` - Visual feedback

**Priority:** DONE
**Effort:** Low-Medium (timer logic + hidden content nodes)

---

## IDEA 006: Time Scrubbing

**Date:** January 8, 2026
**Category:** Accessibility / Review System
**Risk Tier:** 2 (Medium)
**ISP Cluster:** B (Time as Navigation)

### Concept
Timeline slider to revisit past conversations. Uses existing dialogue data. Navigate through TIME, not space. Every player gets a complete "session recording" they can scrub through.

### Philosophy Alignment

| Commandment | Alignment | Notes |
|-------------|-----------|-------|
| Feel Comes First | **Strong** | Powerful feeling of control over history |
| Friction is Failure | **Strong** | Easy review without restart |
| Show Don't Tell | **Medium** | Visual timeline, but still text-based |
| Never Break What Works | **Strong** | Read-only layer on existing data |
| Honest Architecture | **Strong** | Uses existing dialogue log |
| Respect Player Intelligence | **Strong** | Trust players to explore history |

### Considerations
- **Data exists**: All dialogue choices already logged
- **UI**: Horizontal timeline with character markers
- **Playback**: Read-only replay with skip/scan
- **Use cases**: "What did Maya say about Devon?", reviewing for assessment
- **Risk**: Could feel clinical - needs warm visual design

### Decision Framework
- High value for educators/researchers using admin dashboard
- Medium value for players wanting to review
- Prerequisite: Clean dialogue history storage (exists via Supabase)

**Priority:** Future
**Effort:** Medium (new UI component + history playback)

---

## IDEA 007: Prism Mode (Journal as World)

**Date:** January 8, 2026
**Category:** Immersion / Alternative Experience
**Risk Tier:** 3 (High)
**ISP Cluster:** E (Panel-as-World)

### Concept
Full-screen Journal becomes navigable internal space. Thoughts, skills, patterns as explorable areas. Internal journey parallels external character journey. The "mind palace" of the player.

### Philosophy Alignment

| Commandment | Alignment | Notes |
|-------------|-----------|-------|
| Feel Comes First | **Strong** | Immersive internal exploration |
| Show Don't Tell | **Strong** | Visualize internal growth |
| Emotion Over Mechanics | **Strong** | Feelings made spatial |
| Honest Architecture | **WARNING** | Major new system |
| Never Break What Works | **Caution** | Could confuse core loop |
| Kill Your Darlings | **Question** | Nice-to-have vs essential? |

### Considerations
- **Vision**: 7 Journal tabs become 7 "rooms" in player's mind
- **Navigation**: Walk through Harmonics room (orbs floating), Essence room (skill trees)
- **Risk**: High effort, unclear value add over current tab interface
- **Reference**: Psychonauts mental worlds, Disco Elysium Thought Cabinet
- **Compromise**: Start with one room (Harmonics/Pattern visualization)

### Decision Framework
- Only if players express desire for more immersive self-reflection
- Consider as "premium" or "special mode" unlocked after completion
- Test single room before committing to full system

**Priority:** Moonshot / Future
**Effort:** High (3D/2D spatial system for internal world)

---

## IDEA 008: Pattern Voice 5/5 Coverage Fix

**Date:** January 8, 2026
**Category:** Content Completion / QA Fix
**Risk Tier:** 1 (Low)
**Status:** COMPLETED

### Context

**Issue Source:** Anti Gravity Verification Report (`08JAN26_VERIFICATION_RESULTS.md`)
> "Pattern Voices: 3/5 variations implemented per character (2 missing)"

### Problem Discovered

The actual coverage was worse than reported:
- 5 characters at 3/5 (LinkedIn 2026 + alex)
- 10 characters at 2/5 (secondary characters)
- 5 characters at 1/5 (core characters: devon, rohan, maya, marcus, elena)

### Solution Implemented

Added **60 new pattern voice entries** to `content/pattern-voice-library.ts`:

| Phase | Characters | Entries Added |
|-------|------------|---------------|
| Phase 1 | devon, rohan, maya, marcus, elena | +20 |
| Phase 2 | grace, kai, tess, asha, silas, lira, zara, yaquin, samuel, jordan | +30 |
| Phase 3 | quinn, dante, nadia, isaiah, alex | +10 |

### Philosophy Alignment

| Commandment | Alignment | Notes |
|-------------|-----------|-------|
| Feel Comes First | **Strong** | Pattern voices enhance immersion |
| Never Break What Works | **Strong** | Content-only change, no system mods |
| Honest Architecture | **Strong** | Follows existing patterns exactly |
| Juice is Not Optional | **Strong** | More feedback for pattern play |
| Kill Your Darlings | **Strong** | Serves core pattern system |

### Result

All 20 characters now have **5/5 pattern coverage**:
- 5 patterns × 20 characters = 100 character-pattern combinations
- Each with unique, character-appropriate voices

**Priority:** DONE
**Effort:** Low (~1.5 hours)

---

## Template for Future Ideas

```markdown
## IDEA XXX: [Title]

**Date:** [Date]
**Category:** [Visual/Core/Polish/etc]
**Risk Tier:** [1-3]

### Concept
[One paragraph description]

### Philosophy Alignment
[Table checking against commandments]

### Considerations
[Risks, trade-offs, references]

### Decision Framework
[How to decide if/when to build]

**Priority:** [Now/Soon/Future/Never]
**Effort:** [Low/Medium/High]
```

---

**Last Updated:** January 22, 2026
