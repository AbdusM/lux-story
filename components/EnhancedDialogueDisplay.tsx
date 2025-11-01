"use client"

/**
 * EnhancedDialogueDisplay
 * 
 * Wraps DialogueDisplay with RichTextRenderer capabilities
 * Provides terminal-style effects while maintaining existing dialogue functionality
 */

import { DialogueDisplay } from './DialogueDisplay'
import { RichTextRenderer, RichTextEffect } from './RichTextRenderer'
import { CharacterAvatar, shouldShowAvatar } from './CharacterAvatar'
import { cn } from '@/lib/utils'
import { autoChunkDialogue } from '@/lib/auto-chunk-dialogue'

interface EnhancedDialogueDisplayProps {
  text: string
  className?: string
  useChatPacing?: boolean
  characterName?: string
  showAvatar?: boolean
  isContinuedSpeaker?: boolean
  
  /** Enable rich text effects (terminal-style animations) */
  enableRichEffects?: boolean
  
  /** Rich text effect configuration */
  richEffects?: RichTextEffect
  
  /** Context for automatic effect selection */
  context?: 'thinking' | 'speaking' | 'action' | 'warning' | 'success'
}

/**
 * EnhancedDialogueDisplay - Dialogue with optional terminal-style effects
 * 
 * Features:
 * - All standard DialogueDisplay functionality
 * - Optional rich text effects (rainbow, flashing, color cycling)
 * - Automatic effect selection based on context
 * - Maintains compatibility with existing dialogue system
 */
export function EnhancedDialogueDisplay({
  text,
  className,
  useChatPacing,
  characterName,
  showAvatar = true,
  isContinuedSpeaker = false,
  enableRichEffects = false,
  richEffects,
  context = 'speaking'
}: EnhancedDialogueDisplayProps) {
  
  // Auto-determine effects from context if not provided
  const effects: RichTextEffect = richEffects || (() => {
    if (!enableRichEffects) return {}
    
    switch (context) {
      case 'thinking':
        return {
          mode: 'typewriter',
          state: 'thinking',
          speed: 0.8,
          charDelay: 40,
          perCharColor: true
        }
      case 'action':
        return {
          mode: 'typewriter',
          state: 'executing',
          speed: 1.2,
          charDelay: 20,
          flashing: true
        }
      case 'warning':
        return {
          mode: 'fade-in',
          state: 'warning',
          flashing: true,
          speed: 1.0
        }
      case 'success':
        return {
          mode: 'fade-in',
          state: 'success',
          speed: 0.8
        }
      case 'speaking':
      default:
        return {
          mode: 'typewriter',
          state: 'default',
          speed: 1.0,
          charDelay: 30
        }
    }
  })()
  
  // If rich effects are disabled, use standard DialogueDisplay
  if (!enableRichEffects) {
    return (
      <DialogueDisplay
        text={text}
        className={className}
        useChatPacing={useChatPacing}
        characterName={characterName}
        showAvatar={showAvatar}
        isContinuedSpeaker={isContinuedSpeaker}
      />
    )
  }
  
  // Auto-chunk long text for chat pacing
  const chunkedText = autoChunkDialogue(text, { 
    activationThreshold: 200,
    maxChunkLength: 100
  })
  
  // Determine if avatar should be displayed
  const displayAvatar = showAvatar && shouldShowAvatar(characterName, isContinuedSpeaker, false)
  
  // If chat pacing is enabled, use ChatPacedDialogue wrapper
  if (useChatPacing && characterName) {
    // TODO: Integrate ChatPacedDialogue with RichTextRenderer
    // For now, fall back to standard chat pacing
    return (
      <DialogueDisplay
        text={chunkedText}
        className={className}
        useChatPacing={true}
        characterName={characterName}
        showAvatar={displayAvatar}
        isContinuedSpeaker={isContinuedSpeaker}
      />
    )
  }
  
  // Use RichTextRenderer with standard layout
  const chunks = chunkedText.split('|').map(chunk => chunk.trim()).filter(chunk => chunk.length > 0)
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Character Avatar */}
      {displayAvatar && characterName && (
        <div className="flex items-center gap-3 mb-4">
          <CharacterAvatar characterName={characterName} size="md" />
        </div>
      )}
      
      {/* Rich Text Content */}
      {chunks.map((chunk, index) => (
        <div key={index} className="dialogue-chunk">
          <RichTextRenderer
            text={chunk}
            effects={effects}
            className="text-base text-slate-800 leading-relaxed"
          />
        </div>
      ))}
    </div>
  )
}
