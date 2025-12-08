# Lux Story - Grand Central Terminus

## Game Design Philosophy

### Core Commandments

1. **Feel Comes First** - The game must feel good within first 30 seconds. Controls intuitive, actions satisfying.

2. **Respect Player Intelligence** - Don't overexplain. Let players discover. Failure teaches, not punishes.

3. **Every Element Serves Multiple Purposes** - Visuals both beautiful and functional. Mechanics reinforce narrative themes. UI informs without interrupting.

4. **Accessible Depth** - Easy to learn, difficult to master. Surface simplicity hiding strategic depth.

5. **Meaningful Choices** - Every decision has visible consequences. No obvious "right" answers—only trade-offs. Choices reflect player identity.

6. **Friction is Failure** - Every moment of confusion is a design failure. Never blame the player. If it needs explanation, redesign it.

7. **Emotion Over Mechanics** - Mechanics serve emotional experience. What players feel matters more than what they do.

8. **Show, Don't Tell** - World communicates narrative. Reduce text/tutorials through visual design.

9. **Juice is Not Optional** - Feedback for every action. Make simple actions feel powerful.

10. **Kill Your Darlings** - Remove features that don't serve core loop. Complexity without value is bloat.

### Red Flags to Avoid

- **The Iceberg Game** - 90% of features hidden. Core value invisible until late game.
- **Developer's Delight** - Features that excite devs but confuse players.
- **Progressive Paralysis** - Hiding features to "reduce overwhelm" but looking broken.
- **Invisible Value Prop** - Players don't understand uniqueness.
- **Tutorial Crutch** - Design by instruction rather than intuition.
- **Feature Graveyard** - Systems nobody uses.

---

## Project Overview

**Grand Central Terminus** - A magical realist career exploration game where a mysterious train station appears between who you were and who you're becoming. Players explore platforms representing career paths through dialogue-driven choices that reveal their patterns.

### Target Audience
- Birmingham youth exploring career paths
- Ages 14-24
- Mobile-first experience

### Core Experience
- Dialogue-driven like a video game (Pokemon, Disco Elysium)
- Characters drive everything + player response and agency
- Choices have visible consequences
- Pattern revelation through action, not statistics

---

## Architecture

### Stack
- Next.js 15 with App Router
- TypeScript strict mode
- Framer Motion for animations
- Tailwind CSS
- Vercel deployment

### Key Files
```
components/
├── StatefulGameInterface.tsx   # Main game container
├── ChatPacedDialogue.tsx       # Dialogue display with thinking indicators
├── CharacterAvatar.tsx         # Character pixel art (32×32)
├── PixelAvatar.tsx             # SVG pixel sprite renderer
├── Journal.tsx                 # Player stats side panel
└── RichTextRenderer.tsx        # Text effects and formatting

lib/
├── patterns.ts                 # 5 pattern types: analytical, patience, exploring, helping, building
├── character-typing.ts         # Per-character typing speeds
├── voice-utils.ts              # Character voice typography
└── interaction-parser.ts       # Visual feedback animations

hooks/
├── useInsights.ts              # Player pattern analysis
├── useConstellationData.ts     # Character relationships
└── useGameState.ts             # Core game state management
```

### Characters (8 Main)
| Character | Animal | Role |
|-----------|--------|------|
| Samuel | Owl | Station keeper, wise mentor |
| Maya | Cat | Pre-med student, family pressure |
| Tess | Fox | Warm guide |
| Devon | Deer | Engineering student, systems thinker |
| Marcus | Bear | Healthcare, nurturing |
| Rohan | Raven | Mysterious, introspective |
| Yaquin | Rabbit | Gentle, curious |
| Lira | Butterfly | Ethereal, transformative |

### Pattern System
5 behavioral patterns tracked through choices:
- **Analytical** - Logic, data-driven decisions
- **Patience** - Taking time, careful consideration
- **Exploring** - Curiosity, discovery-oriented
- **Helping** - Supporting others, empathy
- **Building** - Creating, constructive action

---

## UX Principles

### Dialogue-Driven Immersion
- Text/dialogue historically and consistently shows in narrative container
- Everything stays dialogue-driven like a video game
- Characters drive everything + response and user agency
- Non-dialogue elements in narrative container break immersion

### Less is More
- Thinking indicators: Show once at message start, then let dialogue flow
- Avatars: Only in side menu (Journal), not main screen header
- Choice container: Fixed height (140px) with scroll, no layout shifts

### Visual Feedback
- 32×32 pixel art avatars (Zootopia-style animals)
- Interaction animations (shake, nod, bloom, etc.)
- Voice typography per character

---

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint check
vercel --prod        # Deploy to production
```

### Testing
- Playwright for browser automation
- Test page: `/test-pixels` for avatar verification

---

## Current Status (December 2024)

### Recently Completed
- 32×32 pixel avatar upgrade for all 8 characters
- Player avatar in Journal panel
- Fixed choice container height
- Reduced thinking indicator frequency
- Pattern choice rebalancing (HELPING → BUILDING/EXPLORING)

### Production
- URL: https://lux-story.vercel.app
- Deployment: Vercel (auto-deploy on push to main)

---

## Design Reviews

When analyzing the game, use Five Lenses:

1. **Player's Lens** - What do players actually experience vs. what was designed?
2. **Systems Lens** - Which features are visible vs. buried?
3. **Business Lens** - Is value proposition clear in 30 seconds?
4. **Emotion Lens** - Where does frustration replace fun?
5. **Time Lens** - What's visible at minute 1, 5, 30, 60?

### Key Questions
- Can someone have fun just moving through the game?
- Remove all tutorials—can players still figure it out?
- Would two players make different choices?
- Watch someone play silently—where do they hesitate?
- What will players remember a year from now?
