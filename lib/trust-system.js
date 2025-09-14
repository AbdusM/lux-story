
// Trust System Implementation for Grand Central Terminus
// Based on Baldur's Gate 3 approval mechanics

class TrustSystem {
  constructor() {
    this.characterTrust = {
      Samuel: 0,
      Maya: 0, 
      Devon: 0,
      Jordan: 0
    };
    
    this.platformStates = {
      healthcare: 'neutral',
      engineering: 'neutral', 
      data: 'neutral',
      sustainability: 'neutral'
    };
    
    this.trustHistory = [];
  }
  
  // BG3-style: "Maya approves" / "Samuel disapproves" messages
  modifyTrust(character, change, reason) {
    const oldTrust = this.characterTrust[character];
    this.characterTrust[character] = Math.max(0, Math.min(10, oldTrust + change));
    
    this.trustHistory.push({
      character,
      change,
      reason,
      newLevel: this.characterTrust[character],
      timestamp: Date.now()
    });
    
    // Show approval/disapproval message like BG3
    const message = change > 0 ? 
      `${character} approves (+${change})` : 
      `${character} disapproves (${change})`;
    
    this.showTrustMessage(message);
    this.updatePlatformStates();
    return this.characterTrust[character];
  }
  
  // Calculate platform warmth based on character trust and player choices
  updatePlatformStates() {
    // Healthcare platform influenced by Maya's trust
    if (this.characterTrust.Maya >= 7) {
      this.platformStates.healthcare = 'resonant';
    } else if (this.characterTrust.Maya >= 4) {
      this.platformStates.healthcare = 'warm';
    } else if (this.characterTrust.Maya <= 2) {
      this.platformStates.healthcare = 'cold';
    }
    
    // Engineering platform influenced by Devon's trust
    if (this.characterTrust.Devon >= 7) {
      this.platformStates.engineering = 'resonant';
    } else if (this.characterTrust.Devon >= 4) {
      this.platformStates.engineering = 'warm';
    } else if (this.characterTrust.Devon <= 2) {
      this.platformStates.engineering = 'cold';
    }
    
    // Similar logic for other platforms...
  }
  
  // Get available dialogue options based on trust level
  getDialogueOptions(character, baseOptions) {
    const trust = this.characterTrust[character];
    const availableOptions = [...baseOptions];
    
    // Higher trust unlocks deeper conversation options
    if (trust >= 6) {
      availableOptions.push({
        text: "Tell me more about your past...",
        type: "deep_conversation",
        trust_required: 6
      });
    }
    
    if (trust >= 8) {
      availableOptions.push({
        text: "I'm worried about you. What's really going on?",
        type: "vulnerable_support", 
        trust_required: 8
      });
    }
    
    return availableOptions;
  }
  
  showTrustMessage(message) {
    // Display trust change message to player
    const messageElement = document.createElement('div');
    messageElement.className = 'trust-message';
    messageElement.textContent = message;
    document.body.appendChild(messageElement);
    
    setTimeout(() => messageElement.remove(), 3000);
  }
}

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TrustSystem;
} else {
  window.TrustSystem = TrustSystem;
}
