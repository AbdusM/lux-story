"use client"

/**
 * DEPRECATED: Use RichTextRenderer instead
 * 
 * This component is kept as a compatibility wrapper around RichTextRenderer
 * to support existing code that hasn't been migrated yet.
 * It maps the old prop structure to the new RichTextRenderer props.
 */

import React from 'react'
import { RichTextRenderer } from './RichTextRenderer'

interface StreamingMessageProps {
  speaker: string
  textChunks: string[] // Array of text chunks to stream
  type?: 'narration' | 'dialogue' | 'whisper' | 'sensation'
  messageWeight?: 'primary' | 'aside' | 'critical'
  className?: string
  onComplete?: () => void // Called when all chunks are complete
  onChunkComplete?: (chunkIndex: number) => void // Called when each chunk completes
  chunkDelays?: number[] // Custom delays between chunks (ms)
  enableClickToComplete?: boolean
}

export function StreamingMessage({
  speaker,
  textChunks,
  className,
  onComplete,
}: StreamingMessageProps) {
  // Flatten chunks into single string with double newlines
  const fullText = textChunks.join('\n\n')

  // Determine if this is narration based on speaker
  const isNarration = speaker === 'Narrator' || speaker === 'System'

  return (
    <div className={className}>
      {/* Render speaker name if not narration */}      {!isNarration && speaker !== 'You' && (
        <div className="font-bold text-slate-700 mb-2">{speaker}</div>
      )}

      <RichTextRenderer
        text={fullText}
        effects={{
          mode: 'staggered'
        }}
        onComplete={onComplete}
      />
    </div>
  )
}
