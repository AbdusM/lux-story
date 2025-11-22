"use client"

/**
 * RichTextExamples - Demo component showing various rich text effects
 * 
 * This component demonstrates how to use RichTextRenderer with different effects
 * for various contexts in the game (thinking, executing, warnings, etc.)
 */

import { RichTextRenderer, RichTextEffect } from './RichTextRenderer'
import { EnhancedDialogueDisplay } from './EnhancedDialogueDisplay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RichTextExamples() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Rich Text Effects Examples</h1>
      
      {/* Thinking State */}
      <Card>
        <CardHeader>
          <CardTitle>Thinking State (Blue Pulse)</CardTitle>
        </CardHeader>
        <CardContent>
          <RichTextRenderer
            text="Hmm, let me think about this carefully..."
            effects={{
              mode: 'typewriter',
              state: 'thinking',
              speed: 0.8,
            }}
            className="text-lg"
          />
        </CardContent>
      </Card>
      
      {/* Executing State */}
      <Card>
        <CardHeader>
          <CardTitle>Executing State (Green Pulse)</CardTitle>
        </CardHeader>
        <CardContent>
          <RichTextRenderer
            text="Processing your choice... analyzing patterns..."
            effects={{
              mode: 'typewriter',
              state: 'executing',
              speed: 1.2,
              flashing: true
            }}
            className="text-lg"
          />
        </CardContent>
      </Card>
      
      {/* Warning State */}
      <Card>
        <CardHeader>
          <CardTitle>Warning State (Amber Flash)</CardTitle>
        </CardHeader>
        <CardContent>
          <RichTextRenderer
            text="⚠️ **Important**: This choice will affect your relationship with Samuel"
            effects={{
              mode: 'fade-in',
              state: 'warning',
              flashing: true,
              highlightWords: ['Important', 'affect']
            }}
            className="text-lg"
          />
        </CardContent>
      </Card>
      
      {/* Rainbow Effect */}
      <Card>
        <CardHeader>
          <CardTitle>Rainbow Effect (Active Processing)</CardTitle>
        </CardHeader>
        <CardContent>
          <RichTextRenderer
            text="Exploring possibilities... discovering new paths..."
            effects={{
              mode: 'typewriter',
              rainbow: true,
              highlightWords: ['possibilities', 'discovering'],
              speed: 1.0,
            }}
            className="text-lg"
          />
        </CardContent>
      </Card>
      
      {/* Highlighted Words */}
      <Card>
        <CardHeader>
          <CardTitle>Highlighted Words with Flashing</CardTitle>
        </CardHeader>
        <CardContent>
          <RichTextRenderer
            text="You've shown **creativity** and **problem-solving** skills. Your **leadership** potential is emerging."
            effects={{
              mode: 'typewriter',
              state: 'success',
              highlightWords: ['creativity', 'problem-solving', 'leadership'],
              flashing: true,
            }}
            className="text-lg"
          />
        </CardContent>
      </Card>
      
      {/* Enhanced Dialogue Display Example */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Dialogue Display</CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedDialogueDisplay
            text="Samuel is **thinking** about your question. He considers the **stations** carefully before responding."
            characterName="Samuel"
            enableRichEffects={true}
            context="thinking"
            className="space-y-2"
          />
        </CardContent>
      </Card>
      
      {/* Syntax-Style Code Display */}
      <Card>
        <CardHeader>
          <CardTitle>Code/Syntax Style (For Technical Dialogue)</CardTitle>
        </CardHeader>
        <CardContent>
          <RichTextRenderer
            text="Your **performance** metrics: alignment=0.85, consistency=0.92, learning=0.78"
            effects={{
              mode: 'typewriter',
              state: 'default',
              highlightWords: ['performance', 'alignment', 'consistency', 'learning'],
            }}
            className="text-lg font-mono"
          />
        </CardContent>
      </Card>
    </div>
  )
}
