# Rich Text Effects - Usage Guide

## Overview

The Rich Text Renderer adds terminal-style visual effects to your dialogue interface, inspired by Claude Code CLI and advanced terminal tools. These effects provide dynamic visual feedback for different states (thinking, executing, warnings, etc.) and enhance the immersive experience.

## Quick Start

### Basic Usage

Replace your existing `DialogueDisplay` with `EnhancedDialogueDisplay`:

```tsx
import { EnhancedDialogueDisplay } from '@/components/EnhancedDialogueDisplay'

// Enable rich effects with automatic context detection
<EnhancedDialogueDisplay
  text="Samuel is **thinking** about your question..."
  characterName="Samuel"
  enableRichEffects={true}
  context="thinking"  // Automatically applies blue pulse effect
/>
```

### Direct RichTextRenderer Usage

For more control, use `RichTextRenderer` directly:

```tsx
import { RichTextRenderer } from '@/components/RichTextRenderer'

<RichTextRenderer
  text="Processing your choice... analyzing patterns..."
  effects={{
    mode: 'typewriter',
    state: 'executing',
    speed: 1.2,
    charDelay: 25,
    flashing: true
  }}
/>
```

## Context-Based Effects

The `EnhancedDialogueDisplay` component automatically selects appropriate effects based on context:

- **`thinking`**: Blue pulse with per-character color variation
- **`speaking`**: Standard typewriter with default styling
- **`action`**: Green pulse with flashing effect for active processing
- **`warning`**: Amber flash for important notifications
- **`success`**: Green fade-in for positive feedback

## Effect Modes

### Static
Displays text immediately with effects applied:

```tsx
effects={{ mode: 'static', state: 'warning', flashing: true }}
```

### Typewriter
Character-by-character reveal with effects:

```tsx
effects={{ mode: 'typewriter', charDelay: 30, state: 'thinking' }}
```

### Fade-in
Smooth fade-in animation:

```tsx
effects={{ mode: 'fade-in', state: 'success' }}
```

## Special Effects

### Rainbow Cycling
For active processing states:

```tsx
effects={{
  mode: 'typewriter',
  rainbow: true,
  highlightWords: ['exploring', 'discovering'],
  speed: 1.0
}}
```

### Flashing/Blinking
For emphasis or warnings:

```tsx
effects={{
  mode: 'fade-in',
  state: 'warning',
  flashing: true,
  highlightWords: ['Important', 'Warning']
}}
```

### Per-Character Color Variation
For thinking/processing states:

```tsx
effects={{
  mode: 'typewriter',
  state: 'thinking',
  perCharColor: true,
  charDelay: 40
}}
```

## Integration with Existing Components

### With DialogueDisplay

The `EnhancedDialogueDisplay` wraps `DialogueDisplay` and maintains full compatibility:

```tsx
// Existing code continues to work
<DialogueDisplay text="..." />

// Enhanced version with effects
<EnhancedDialogueDisplay 
  text="..." 
  enableRichEffects={true}
  context="thinking"
/>
```

### With StatefulGameInterface

You can conditionally enable effects based on game state:

```tsx
import { EnhancedDialogueDisplay } from '@/components/EnhancedDialogueDisplay'
import { useGameState } from '@/hooks/useGameState'

function GameInterface() {
  const { gameState } = useGameState()
  const isThinking = gameState?.isProcessing || false
  
  return (
    <EnhancedDialogueDisplay
      text={currentDialogue}
      characterName={currentCharacter}
      enableRichEffects={isThinking}
      context={isThinking ? 'thinking' : 'speaking'}
    />
  )
}
```

## Use Cases

### 1. Character Thinking
When a character is processing or considering:

```tsx
<EnhancedDialogueDisplay
  text="Hmm, let me think about this..."
  characterName="Samuel"
  enableRichEffects={true}
  context="thinking"
/>
```

### 2. System Processing
When the system is analyzing choices or generating content:

```tsx
<RichTextRenderer
  text="Analyzing your patterns... discovering insights..."
  effects={{
    mode: 'typewriter',
    state: 'executing',
    rainbow: true,
    speed: 1.2
  }}
/>
```

### 3. Important Warnings
For critical information:

```tsx
<EnhancedDialogueDisplay
  text="⚠️ **Warning**: This choice will affect your relationship."
  enableRichEffects={true}
  context="warning"
/>
```

### 4. Skill Demonstrations
Highlight skills as they're demonstrated:

```tsx
<RichTextRenderer
  text="You've shown **creativity** and **problem-solving** skills."
  effects={{
    mode: 'typewriter',
    state: 'success',
    highlightWords: ['creativity', 'problem-solving'],
    flashing: true,
    charDelay: 20
  }}
/>
```

## Performance Considerations

- Effects are GPU-accelerated using CSS transforms where possible
- Rainbow and flashing effects use `requestAnimationFrame` for smooth performance
- Character-level rendering only activates when effects are enabled
- Simple text without effects falls back to plain rendering

## Accessibility

All effects respect `prefers-reduced-motion`:
- Animations are disabled for users who prefer reduced motion
- Text remains readable without animations
- Color changes maintain sufficient contrast

## Examples

See `RichTextExamples.tsx` for a complete showcase of all available effects.

## Advanced Configuration

For fine-grained control, use the `RichTextEffect` interface:

```tsx
interface RichTextEffect {
  mode?: 'static' | 'typewriter' | 'fade-in' | 'wave' | 'rainbow'
  state?: 'thinking' | 'executing' | 'warning' | 'error' | 'success' | 'default'
  highlightWords?: string[]
  highlightChars?: number[]
  flashing?: boolean
  rainbow?: boolean
  speed?: number
  charDelay?: number
  perCharColor?: boolean
}
```

## Tips

1. **Use sparingly**: Rich effects should enhance, not distract. Use them for key moments.

2. **Match context**: Let the automatic context selection handle most cases.

3. **Test performance**: On slower devices, reduce `speed` or use simpler effects.

4. **Combine with existing features**: Rich effects work alongside markdown emphasis (`**bold**`, `*italic*`) and chat pacing.

5. **Progressive enhancement**: Start with `enableRichEffects={false}` and enable where it adds value.

