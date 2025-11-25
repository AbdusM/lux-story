/**
 * Trust Label System
 * Maps numeric trust values (0-10) to narrative descriptions.
 * Used for the "Deep State" UI to replace progress bars with words.
 */

export type TrustLabel = {
  label: string
  description: string
  color: string
}

export function getTrustLabel(trust: number): TrustLabel {
  if (trust >= 10) return { 
    label: "Kindred Spirit", 
    description: "A bond that transcends words.", 
    color: "text-purple-600" 
  }
  
  if (trust >= 8) return { 
    label: "Confidant", 
    description: "Trusted with deep truths.", 
    color: "text-indigo-600" 
  }
  
  if (trust >= 6) return { 
    label: "Ally", 
    description: "A solid connection formed.", 
    color: "text-blue-600" 
  }
  
  if (trust >= 4) return { 
    label: "Acquaintance", 
    description: "Developing understanding.", 
    color: "text-slate-600" 
  }
  
  if (trust >= 2) return { 
    label: "Observer", 
    description: "Watching and waiting.", 
    color: "text-slate-500" 
  }
  
  return { 
    label: "Stranger", 
    description: "No connection yet.", 
    color: "text-slate-400" 
  }
}
