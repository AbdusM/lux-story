"use client"

import { useState, useEffect, useRef } from 'react'

/**
 * True patience through presence
 * No timers, no rewards, just natural revelation
 */
export function usePresence() {
  const [timePresent, setTimePresent] = useState(0)
  const [revelation, setRevelation] = useState<string | null>(null)
  const startTime = useRef<number | null>(null)
  
  // Natural revelations at different moments of presence
  const revelations = [
    { after: 15000, text: "A bird you hadn't noticed has been here all along." },
    { after: 30000, text: "The light has shifted slightly. Time continues." },
    { after: 60000, text: "Your breathing has found its own rhythm without your guidance." },
    { after: 120000, text: "The distinction between waiting and being dissolves." },
    { after: 300000, text: "You are neither waiting nor not waiting. You simply are." }
  ]
  
  const beginPresence = () => {
    if (!startTime.current) {
      startTime.current = Date.now()
    }
  }
  
  const checkPresence = () => {
    if (!startTime.current) return null
    
    const now = Date.now()
    const elapsed = now - startTime.current
    setTimePresent(elapsed)
    
    // Find the latest revelation that should appear
    const currentRevelation = revelations
      .filter(r => elapsed >= r.after)
      .pop()
    
    if (currentRevelation && currentRevelation.text !== revelation) {
      setRevelation(currentRevelation.text)
      return currentRevelation.text
    }
    
    return null
  }
  
  const resetPresence = () => {
    startTime.current = null
    setTimePresent(0)
    setRevelation(null)
  }
  
  // No automatic checking - the component decides when to check
  // This removes the performance pressure of constant timers
  
  return {
    beginPresence,
    checkPresence,
    resetPresence,
    timePresent,
    currentRevelation: revelation
  }
}