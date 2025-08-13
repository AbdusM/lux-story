"use client"

import { useState } from 'react'

/**
 * A companion that exists but doesn't interrupt
 * Only speaks when asked, and then only asks questions
 */
export function SilentCompanion() {
  const [inquiry, setInquiry] = useState<string | null>(null)
  
  const questions = [
    "What do you notice?",
    "How does this feel?",
    "What remains unseen?",
    "Is this familiar?",
    "What changes when you're still?",
    "What doesn't need to be said?",
    "Where does your attention go?",
    "What arrives without invitation?"
  ]
  
  const handleInquiry = () => {
    // Pick a random question, never advice
    const question = questions[Math.floor(Math.random() * questions.length)]
    setInquiry(question)
    
    // Question fades after a moment
    setTimeout(() => setInquiry(null), 8000)
  }
  
  return (
    <>
      {/* Small, unobtrusive presence */}
      <button
        onClick={handleInquiry}
        className="fixed bottom-4 right-4 w-8 h-8 rounded-full bg-muted/50 hover:bg-muted transition-colors flex items-center justify-center text-xs text-muted-foreground"
        title="A companion"
      >
        ·
      </button>
      
      {/* Question appears briefly when asked */}
      {inquiry && (
        <div className="fixed bottom-16 right-4 max-w-xs text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2">
          {inquiry}
        </div>
      )}
    </>
  )
}