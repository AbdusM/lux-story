# shadcn/ui Migration Plan v2 - Realistic Approach
## Pragmatic Migration from Apple Design to shadcn

### 🎯 Revised Goals
1. **Incremental Migration**: Component by component over 4-6 weeks
2. **Preserve Functionality**: No breaking changes to game flow
3. **Maintain Performance**: Stay under 200KB bundle target
4. **Keep Fallbacks**: Apple CSS remains until fully tested

## 📊 Realistic Scope Assessment

### Actual Complexity
- **1,383 lines** of Apple Design CSS (not 610)
- **13+ components** using apple- classes
- **222 lines** of mobile-specific optimizations
- **Character-specific** theming and animations
- **Game-specific** interactions and states

### Revised Timeline: 4-6 Weeks
- **Week 1**: Foundation & Custom Components
- **Week 2-3**: Core Game Components
- **Week 4**: Supporting Components
- **Week 5**: Testing & Bug Fixes
- **Week 6**: Performance Optimization & Deployment

## 🏗️ Phase 1: Foundation (Week 1)

### Day 1-2: Install & Configure
```bash
# Install missing shadcn components
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add toggle
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add select
npx shadcn-ui@latest add radio-group
```

### Day 3-4: Build Custom Typography Component
Since shadcn doesn't have Typography, we need to build it:

```tsx
// components/ui/typography.tsx
import { cn } from "@/lib/utils"
import { VariantProps, cva } from "class-variance-authority"

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "text-4xl font-bold tracking-tight",
      h2: "text-3xl font-semibold tracking-tight",
      h3: "text-2xl font-semibold tracking-tight",
      h4: "text-xl font-semibold tracking-tight",
      body: "text-base",
      narrator: "text-base italic text-muted-foreground font-narrative",
      dialogue: "text-base font-dialogue",
      caption: "text-sm text-muted-foreground",
    },
    font: {
      narrative: "font-narrative",
      dialogue: "font-dialogue",
      ui: "font-ui",
      system: "font-sans",
    }
  },
  defaultVariants: {
    variant: "body",
    font: "ui",
  },
})

export interface TypographyProps extends
  React.HTMLAttributes<HTMLParagraphElement>,
  VariantProps<typeof typographyVariants> {
  as?: React.ElementType
}

export function Typography({
  className,
  variant,
  font,
  as: Component = "p",
  ...props
}: TypographyProps) {
  return (
    <Component
      className={cn(typographyVariants({ variant, font, className }))}
      {...props}
    />
  )
}
```

### Day 5: Create Game-Specific shadcn Variants

#### Custom Button Variants for Game Choices
```tsx
// Extend button.tsx with game variants
const buttonVariants = cva(
  "...", // existing base styles
  {
    variants: {
      variant: {
        // ... existing variants
        gameChoice: "w-full justify-start text-left p-4 h-auto hover:bg-accent/10 border-2 border-transparent hover:border-primary transition-all",
        gamePrimary: "w-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all",
        narrator: "text-muted-foreground italic hover:text-foreground",
      },
      // Add Birmingham theme colors
      theme: {
        birmingham: "bg-[#1d4ed8] hover:bg-[#1e40af]",
        healthcare: "bg-[#059669] hover:bg-[#047857]",
        technology: "bg-[#9333ea] hover:bg-[#7c22ce]",
      }
    }
  }
)
```

## 🏗️ Phase 2: Core Components (Week 2-3)

### Create Compound Game Components

#### 1. GameCard Component (Replaces apple-container)
```tsx
// components/game/game-card.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function GameCard({
  children,
  className,
  platform,
  character,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  platform?: string
  character?: string
}) {
  return (
    <Card
      className={cn(
        "border-2 shadow-lg",
        platform === "healthcare" && "border-green-500/20 bg-green-50/5",
        platform === "technology" && "border-purple-500/20 bg-purple-50/5",
        character === "samuel" && "border-amber-500/20",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  )
}
```

#### 2. GameChoice Component (Replaces apple-choice-button)
```tsx
// components/game/game-choice.tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GameChoiceProps {
  choice: {
    text: string
    pattern?: string
    consequence?: string
  }
  onSelect: () => void
  isSelected?: boolean
  index: number
}

export function GameChoice({
  choice,
  onSelect,
  isSelected,
  index
}: GameChoiceProps) {
  const getIcon = () => {
    switch(choice.pattern) {
      case 'helping': return '❤️'
      case 'analytical': return '🧠'
      case 'building': return '🔨'
      case 'patience': return '⏳'
      default: return `${index + 1}.`
    }
  }

  return (
    <Button
      variant="gameChoice"
      onClick={onSelect}
      className={cn(
        "group relative",
        isSelected && "border-primary bg-primary/5"
      )}
    >
      <span className="absolute left-4 text-muted-foreground group-hover:text-primary">
        {getIcon()}
      </span>
      <span className="ml-8">{choice.text}</span>
    </Button>
  )
}
```

#### 3. GameMessage Component (Replaces StoryMessage)
```tsx
// components/game/game-message.tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

interface GameMessageProps {
  speaker: string
  text: string
  type?: 'narration' | 'dialogue' | 'whisper'
  isTypewriting?: boolean
}

const speakerEmojis: Record<string, string> = {
  'narrator': '📖',
  'You': '👤',
  'Samuel': '🚂',
  'Maya': '🔬',
  'Devon': '🔧',
  'Jordan': '💼',
}

export function GameMessage({
  speaker,
  text,
  type = 'dialogue',
  isTypewriting
}: GameMessageProps) {
  const isNarrator = speaker.toLowerCase() === 'narrator'

  if (isNarrator) {
    return (
      <div className="text-center py-6">
        <Typography variant="narrator" className="max-w-2xl mx-auto">
          {text}
        </Typography>
      </div>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto mb-4">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Avatar>
            <AvatarFallback>
              {speakerEmojis[speaker] || '💬'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Typography variant="h4" className="mb-2">
              {speaker}
            </Typography>
            <Typography
              variant={type === 'whisper' ? 'caption' : 'dialogue'}
              className={cn(
                type === 'whisper' && 'italic opacity-75',
                isTypewriting && "typewriter-text"
              )}
            >
              {text}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

## 🏗️ Phase 3: Migration Strategy (Week 3-4)

### Incremental Component Replacement

#### Step 1: Create New Components Alongside Old
```tsx
// Keep both versions temporarily
import { StoryMessage } from './StoryMessage' // old
import { GameMessage } from './game/game-message' // new

// Use feature flag to switch
const MessageComponent = process.env.NEXT_PUBLIC_USE_SHADCN
  ? GameMessage
  : StoryMessage
```

#### Step 2: Migrate One Component at a Time
1. Start with `GameChoices.tsx` → `GameChoice` component
2. Then `StoryMessage.tsx` → `GameMessage` component
3. Then `MinimalGameInterface.tsx` containers → `GameCard`
4. Finally, remaining UI elements

#### Step 3: Preserve Critical Game Logic
```tsx
// Keep game logic separate from UI components
// hooks/useGameLogic.ts - DON'T CHANGE
// Only change presentation components
```

## 🏗️ Phase 4: Theme Configuration

### Update tailwind.config.ts
```typescript
import { fontFamily } from "tailwindcss/defaultTheme"

export default {
  // ... existing config
  theme: {
    extend: {
      colors: {
        // Preserve Birmingham palette
        birmingham: {
          blue: "#1d4ed8",
          green: "#059669",
          red: "#dc2626",
        },
        // Map to shadcn semantic colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... other shadcn colors
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        narrative: ["Crimson Pro", "Georgia", "serif"],
        dialogue: ["Source Serif Pro", "Georgia", "serif"],
        ui: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' }
        }
      },
      animation: {
        typewriter: 'typewriter 2s steps(40, end)',
      }
    },
  },
}
```

### Update globals.css
```css
@layer base {
  :root {
    /* Birmingham Blue as Primary */
    --primary: 221 83% 53%;
    --primary-foreground: 0 0% 100%;

    /* Keep existing game animations */
    --typewriter-speed: 40ms;
    --choice-transition: 200ms;
  }
}

/* Preserve critical game-specific styles */
@layer utilities {
  .typewriter-text {
    overflow: hidden;
    white-space: nowrap;
    animation: typewriter 2s steps(40, end);
  }

  /* Character glow effects - keep these */
  .lux-glow {
    text-shadow: 0 0 10px rgba(147, 51, 234, 0.5);
  }
}
```

## 📊 Testing Strategy

### Week 5: Comprehensive Testing

1. **Visual Regression Testing**
```bash
# Take screenshots before migration
npm run screenshot:baseline

# After each component migration
npm run screenshot:compare
```

2. **Game Flow Testing**
```typescript
// tests/game-flow.test.ts
describe('Game Flow', () => {
  it('should handle choice selection', () => {
    // Test that game logic still works
  })

  it('should preserve typewriter effect', () => {
    // Test animations still work
  })
})
```

3. **Performance Testing**
```bash
# Monitor bundle size after each component
npm run build
# Target: Stay under 200KB
```

## ⚠️ Risk Management

### Rollback Strategy
1. Keep `apple-design-system.css` until Week 6
2. Use feature flags for gradual rollout
3. Maintain git branch `apple-design-backup`

### Known Challenges & Solutions
- **Typewriter effect**: Create custom animation utilities
- **Character glows**: Keep as utility classes
- **Mobile optimization**: Test on real devices weekly
- **Bundle size**: Use dynamic imports for heavy components

## ✅ Success Criteria
- [ ] All components using shadcn primitives
- [ ] Bundle size < 200KB
- [ ] No visual regressions in game flow
- [ ] Mobile experience preserved
- [ ] Typewriter animations working
- [ ] Character-specific theming intact

## 🚀 Week 6: Optimization & Deployment

1. Remove `apple-design-system.css`
2. Tree-shake unused shadcn components
3. Optimize bundle with next/dynamic
4. Deploy to staging for user testing
5. Monitor performance metrics
6. Full deployment after QA sign-off

---

**This realistic plan acknowledges the complexity while providing a path forward that preserves your game's unique characteristics within the shadcn ecosystem.**