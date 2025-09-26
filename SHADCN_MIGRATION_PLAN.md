# shadcn/ui Migration Plan
## From Apple Design System to Modern shadcn Implementation

### 📋 Executive Summary
Migrate the entire Lux Story application from custom Apple Design System CSS (610 lines) to shadcn/ui components while preserving the clean, minimal aesthetic and Birmingham-themed color palette.

## 🎯 Goals
1. **Consistency**: Use shadcn/ui as the single source of truth for UI components
2. **Maintainability**: Reduce custom CSS from 610 lines to <100 lines
3. **Performance**: Leverage shadcn's optimized components and tree-shaking
4. **Accessibility**: Inherit shadcn's built-in accessibility features
5. **Theme Preservation**: Maintain Apple-inspired minimalism with Birmingham colors

## 🔍 Current State Analysis

### Components Currently Using Custom CSS
- `MinimalGameInterface.tsx` - Main game UI (100% custom)
- `GameMessages.tsx` - Message display (100% custom)
- `GameChoices.tsx` - Choice buttons (100% custom)
- `StoryMessage.tsx` - Story text display (100% custom)
- `GameControls.tsx` - Game controls (100% custom)

### Apple Design Classes to Replace
```
Primary Classes:
- .apple-container → Card
- .apple-button → Button
- .apple-text-* → Typography system
- .apple-choices-container → RadioGroup/ToggleGroup
- .apple-story-message → Card + custom styling
- .apple-header → Card header variant
- .apple-game-content → Card content with padding
```

## 📦 Required shadcn Components

### Already Installed
✅ Button
✅ Card
✅ Badge
✅ Dialog
✅ Progress
✅ Tooltip

### Need to Install
- [ ] Typography (custom implementation)
- [ ] Separator
- [ ] ScrollArea
- [ ] ToggleGroup (for choices)
- [ ] Tabs (for navigation)
- [ ] Avatar (for character portraits)
- [ ] Alert (for notifications)
- [ ] Skeleton (for loading states)

## 🎨 Theme Configuration

### 1. Update tailwind.config.ts
```typescript
theme: {
  extend: {
    colors: {
      // Birmingham-inspired palette
      primary: {
        DEFAULT: "#1d4ed8",
        light: "#3b82f6",
        dark: "#1e40af",
      },
      secondary: {
        DEFAULT: "#059669",
        light: "#10b981",
        dark: "#047857",
      },
      accent: {
        DEFAULT: "#dc2626",
        light: "#ef4444",
        dark: "#b91c1c",
      },
      // Game-specific colors
      narrator: "#6b7280",
      dialogue: "#1f2937",
      choice: {
        hover: "#f3f4f6",
        selected: "#e5e7eb",
      }
    },
    fontFamily: {
      narrative: ["Crimson Pro", "Georgia", "serif"],
      dialogue: ["Source Serif Pro", "Georgia", "serif"],
      ui: ["Inter", "system-ui", "sans-serif"],
    },
    animation: {
      "typewriter": "typewriter 2s steps(40) infinite",
      "fade-in": "fadeIn 0.5s ease-in",
      "slide-up": "slideUp 0.3s ease-out",
    }
  }
}
```

### 2. Update globals.css
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221 83% 53%; /* Birmingham Blue */
    --primary-foreground: 210 40% 98%;
    --secondary: 158 64% 51%; /* Birmingham Green */
    --secondary-foreground: 222.2 47.4% 11.2%;
    /* ... other tokens ... */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode tokens ... */
  }
}
```

## 🔄 Migration Strategy

### Phase 1: Foundation (Day 1)
1. Install missing shadcn components
2. Create custom Typography component
3. Update theme configuration
4. Create component mapping guide

### Phase 2: Core Components (Day 2-3)
1. **MinimalGameInterface.tsx**
   - Replace .apple-container with Card
   - Use ScrollArea for message area
   - Implement proper layout with shadcn primitives

2. **GameChoices.tsx**
   - Replace custom buttons with Button variants
   - Use ToggleGroup for exclusive selection
   - Add proper focus management

3. **StoryMessage.tsx**
   - Use Card for message containers
   - Implement Avatar for character portraits
   - Typography component for text hierarchy

### Phase 3: Supporting Components (Day 4)
1. **GameMessages.tsx**
   - ScrollArea for message list
   - Separator between messages
   - Proper spacing with Tailwind utilities

2. **GameControls.tsx**
   - Button group implementation
   - Consistent icon usage
   - Tooltip for help text

### Phase 4: Polish & Cleanup (Day 5)
1. Remove apple-design-system.css
2. Update all imports
3. Test all interactions
4. Verify accessibility
5. Performance optimization

## 🏗️ Component Mapping

### Button Migration
```tsx
// Before (Custom Apple)
<button className="apple-button apple-button-primary">
  Continue
</button>

// After (shadcn)
<Button variant="default" size="lg" className="w-full">
  Continue
</Button>
```

### Container Migration
```tsx
// Before (Custom Apple)
<div className="apple-container">
  <div className="apple-header">...</div>
  <div className="apple-content">...</div>
</div>

// After (shadcn)
<Card>
  <CardHeader>
    <CardTitle>...</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

### Choice Button Migration
```tsx
// Before (Custom Apple)
<div className="apple-choices-container">
  <button className="apple-choice-button">...</button>
</div>

// After (shadcn)
<ToggleGroup type="single" onValueChange={handleChoice}>
  <ToggleGroupItem value="choice1" className="w-full">
    ...
  </ToggleGroupItem>
</ToggleGroup>
```

## 📊 Success Metrics
- [ ] All components using shadcn/ui primitives
- [ ] Custom CSS reduced by >85%
- [ ] No visual regression (screenshots comparison)
- [ ] Lighthouse scores maintained or improved
- [ ] Bundle size reduced
- [ ] All accessibility tests passing

## 🚨 Risk Mitigation
1. **Create branch**: `shadcn-migration` for safe development
2. **Screenshot tests**: Before/after each component
3. **Incremental migration**: One component at a time
4. **Fallback plan**: Keep apple-design-system.css until fully migrated
5. **User testing**: Test with actual users before merging

## 📅 Timeline
- **Day 1**: Foundation & setup
- **Day 2-3**: Core component migration
- **Day 4**: Supporting components
- **Day 5**: Polish & testing
- **Day 6**: Review & deployment

## 🎯 Next Steps
1. Create migration branch
2. Install required shadcn components
3. Start with MinimalGameInterface.tsx as pilot
4. Document any custom variants needed
5. Create reusable compound components

---

**Note**: This migration will significantly improve maintainability while preserving the unique Birmingham-themed aesthetic of the application.