"use client"

import { useState, useEffect } from 'react'

/**
 * A modern chat-style helper that encourages self-reflection about career choices
 * Appears as a subtle suggestion bubble like Perplexity/Claude/ChatGPT
 * Uses accessible language that connects to career development
 */
export function CareerReflectionHelper() {
  const [reflection, setReflection] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  // Career-focused reflection prompts in accessible language
  const careerReflections = [
    "What feels right to you right now?",
    "How does this choice make you feel?",
    "What would you tell a friend in this situation?",
    "What's your gut saying?",
    "What matters most to you here?",
    "How do you want to feel about this later?",
    "What would make you proud of this choice?",
    "What feels like the real you?"
  ]
  
  // Show helper after 15 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 15000) // 15 seconds of inactivity
    
    return () => clearTimeout(timer)
  }, [])
  
  const handleReflection = () => {
    // Pick a random reflection prompt
    const prompt = careerReflections[Math.floor(Math.random() * careerReflections.length)]
    setReflection(prompt)
    setShowSuggestions(false)
    
    // Reflection fades after a moment
    setTimeout(() => setReflection(null), 12000)
  }
  
  const handleShowSuggestions = () => {
    setShowSuggestions(true)
    setReflection(null)
  }
  
  const handleClose = () => {
    setReflection(null)
    setShowSuggestions(false)
    setIsVisible(false)
  }
  
  if (!isVisible) return null
  
  return (
    <>
      {/* Modern chat-style suggestion bubble */}
      <div className="fixed bottom-4 right-4 z-50">
        {!reflection && !showSuggestions && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Need help thinking through this choice?</span>
            </div>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={handleShowSuggestions}
                className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
              >
                Get suggestions
              </button>
              <button
                onClick={handleClose}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
        
        {/* Reflection prompt */}
        {reflection && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-xs animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm">💭</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 mb-2">{reflection}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleReflection}
                    className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    Another question
                  </button>
                  <button
                    onClick={handleClose}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Suggestions list */}
        {showSuggestions && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-xs animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-sm">💡</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-2">Reflection prompts:</p>
                <div className="space-y-1">
                  {careerReflections.slice(0, 3).map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setReflection(prompt)
                        setShowSuggestions(false)
                      }}
                      className="block w-full text-left text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={handleReflection}
                    className="text-xs bg-gray-50 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    Random question
                  </button>
                  <button
                    onClick={handleClose}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
