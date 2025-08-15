# Lux Story - Performance-Based Career Exploration Platform

> A contemplative storytelling experience that naturally reveals career affinities through behavioral psychology and adaptive narratives.

🌐 **Live Demo**: [https://career-exploration-birmingha.lux-story.pages.dev](https://career-exploration-birmingha.lux-story.pages.dev)

## 🎯 Vision

The world's first career exploration platform that uses performance psychology to reduce anxiety while discovering natural career affinities. Built for the Birmingham Catalyze Challenge ($250K grant opportunity).

## 🧠 The Performance Equation

```
Performance = (Alignment × Consistency) + (Learning × Patience) - (Anxiety × Rushing)
```

This equation invisibly drives the entire experience, creating adaptive narratives and visual feedback based on player behavior.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/AbdusM/lux-story.git
cd lux-story

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
# Build static export
npm run build

# Test production build locally
npx serve out
```

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15.4.6 with TypeScript
- **UI Library**: React 18 with shadcn/ui components
- **Styling**: Tailwind CSS + Custom CSS animations
- **State Management**: React Hooks + localStorage
- **Deployment**: Cloudflare Pages (static export)

### Design Philosophy
- **Contemplative Gaming**: No scores, achievements, or gamification
- **Invisible Metrics**: Performance tracked but never shown
- **Adaptive Narrative**: Story responds to player behavior
- **Natural Discovery**: Career patterns emerge through choices
- **Anxiety First**: Prioritizes calming stressed players

## 🎮 How It Works

### For Players
1. Make choices in a contemplative forest setting
2. No time pressure, no scoring, just exploration
3. System adapts to your pace and style
4. Career insights emerge naturally through patterns

### Performance Levels

#### 🟣 Struggling (Anxious)
- Detected: Quick choices, jumping between themes
- Response: More breathing prompts, calming messages, wider UI spacing

#### 🟢 Exploring (Curious)
- Detected: Moderate pace, trying different paths
- Response: Encouragement to explore, standard UI

#### 🔵 Flowing (Confident)
- Detected: Consistent themes, patient choices
- Response: Affirmation messages, smooth animations

#### ⭐ Mastering (Aligned)
- Detected: Strong patterns, high patience
- Response: Deeper insights, minimal prompts

## 📁 Project Structure

```
lux-story/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── GameInterface.tsx  # Main game container
│   ├── StoryMessage.tsx  # Message display
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
│   ├── useGameState.ts   # Game state management
│   ├── useAdaptiveNarrative.ts # Performance adaptations
│   └── usePatternRevelation.ts # Career pattern detection
├── lib/                  # Core logic
│   ├── story-engine.ts   # Story progression
│   ├── game-state.ts     # State management
│   └── performance-system.ts # Performance tracking
├── styles/              # Additional styles
│   ├── animations.css   # Custom animations
│   └── performance.css  # Performance-based styles
└── data/               # Story content
    └── story/          # Scene definitions
```

## 🎨 Design System

### Visual Themes
- **Pokemon-style** text boxes with retro game UI
- **Supergiant Games-inspired** atmospheric effects
- **Character-specific** color glows (Purple for Lux, Green for Swift, etc.)
- **Performance-based** visual states (spacing, animation speed, colors)

### Typography
- **Dialogue**: System UI fonts for clarity
- **Narration**: Serif fonts for storytelling
- **Premium feel**: Careful letter-spacing and line-height

### Animations
- Breathing cycles (4s)
- Fade-in effects
- Float/levitation
- Typewriter text
- Performance-adaptive timing

## 🧪 Testing the System

### Quick Performance Tests

```javascript
// In browser console after playing

// Check current metrics
const perf = JSON.parse(localStorage.getItem('lux-performance-metrics'))
console.table(perf)

// View choice patterns
const patterns = JSON.parse(localStorage.getItem('lux-patterns'))
console.log('Themes:', patterns.choiceThemes)

// Calculate performance score
const score = (perf.alignment * perf.consistency) + 
              (perf.learning * perf.patience) - 
              (perf.anxiety * perf.rushing)
console.log('Performance:', score)
```

### Test Scenarios
1. **Anxious Player**: Click quickly, choose "questioning" repeatedly
2. **Patient Explorer**: Wait 15+ seconds, try different regions
3. **Consistent Master**: Choose similar themes, moderate pace

## 📊 Birmingham Grant Alignment

### Key Differentiators
1. **Only platform** measuring performance through contemplation
2. **Reduces anxiety** rather than creating it
3. **Career discovery** through being, not testing
4. **Adaptive** to each youth's needs
5. **Works invisibly** - no pressure

### Impact Metrics
- Performance score → Career readiness
- Anxiety levels → Tracked and reduced
- Pattern emergence → Natural career affinity
- Engagement → Without gamification

## 🚢 Deployment

### Cloudflare Pages

```bash
# Build for production
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy out \
  --project-name=lux-story \
  --branch=career-exploration-birmingham
```

### GitHub Pages

```bash
# Configure for GitHub Pages
npm run build
# Push to gh-pages branch
git subtree push --prefix out origin gh-pages
```

## 🛠️ Development

### Environment Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Type checking
npx tsc --noEmit
```

### Key Files
- `lib/performance-system.ts` - Performance equation implementation
- `hooks/useAdaptiveNarrative.ts` - Narrative adaptations
- `hooks/usePatternRevelation.ts` - Career pattern detection
- `styles/performance.css` - Performance-based visual states

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- Birmingham Catalyze Challenge for the opportunity
- shadcn/ui for the component system
- Cloudflare Pages for hosting
- The contemplative gaming community

---

**Built with 🦥 by the Lux Story Team**

*"Career discovery through contemplation, not examination"*