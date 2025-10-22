import React from 'react'

interface CharacterLoadingStateProps {
  characterName: string
  context?: 'thinking' | 'transitioning' | 'initial'
}

export function CharacterLoadingState({ characterName, context = 'thinking' }: CharacterLoadingStateProps) {
  const messages = {
    thinking: {
      samuel: "The Station Keeper considers your words...",
      maya: "Maya gathers her thoughts...",
      devon: "Devon processes his emotions...",
      jordan: "Jordan reflects on her journey..."
    },
    transitioning: {
      samuel: "The Station Keeper prepares to speak...",
      maya: "Maya approaches...",
      devon: "Devon takes a breath...",
      jordan: "Jordan arrives..."
    },
    initial: {
      samuel: "The Station Keeper awaits at Platform 7...",
      maya: "Preparing your conversation with Maya...",
      devon: "Preparing your conversation with Devon...",
      jordan: "Preparing your conversation with Jordan..."
    }
  }
  
  const characterKey = characterName.toLowerCase().split(' ')[0] as 'samuel' | 'maya' | 'devon' | 'jordan'
  const message = messages[context][characterKey] || "Loading..."
  
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-4">
        {/* Character-themed spinner */}
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-200 border-t-blue-600 mx-auto" />
          {/* Pulse ring */}
          <div className="absolute inset-0 animate-ping rounded-full border-2 border-blue-400 opacity-20" />
        </div>
        
        {/* Context message */}
        <p className="text-base text-slate-600 animate-pulse">
          {message}
        </p>
      </div>
    </div>
  )
}
