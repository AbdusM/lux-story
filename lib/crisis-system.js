
// Crisis Moment System for Grand Central Terminus
// Based on BG3's high-stakes character choice scenes

class CrisisSystem {
  constructor(trustSystem) {
    this.trustSystem = trustSystem;
    this.activeCrises = [];
    this.resolvedCrises = [];
    this.timeSystem = null; // To be integrated with time mechanics
  }
  
  // Trigger crisis based on story progression and trust levels
  triggerCrisis(characterName, crisisType, storyContext) {
    const crisis = {
      id: `crisis_${characterName.toLowerCase()}_${Date.now()}`,
      character: characterName,
      type: crisisType,
      triggered_at: Date.now(),
      trust_level_when_triggered: this.trustSystem.characterTrust[characterName],
      context: storyContext,
      resolved: false
    };
    
    this.activeCrises.push(crisis);
    return crisis;
  }
  
  // Present crisis choice to player with BG3-style emotional weight
  presentCrisisChoices(crisis) {
    return {
      scene_type: 'crisis_choice',
      character: crisis.character,
      emotional_weight: 'maximum',
      time_pressure: true,
      choices: this.getContextualChoices(crisis),
      environmental_state: 'tense'
    };
  }
  
  // Get available choices based on trust level and previous actions
  getContextualChoices(crisis) {
    const baseLevelChoices = [
      { text: "I believe in you. Follow your heart.", trust_required: 0, approach: "supportive" },
      { text: "This is your decision to make.", trust_required: 0, approach: "neutral" }
    ];
    
    const trustLevel = this.trustSystem.characterTrust[crisis.character];
    
    // Higher trust unlocks more intimate/helpful options
    if (trustLevel >= 6) {
      baseLevelChoices.push({
        text: "Remember what you told me about your dreams?",
        trust_required: 6,
        approach: "personal_history"
      });
    }
    
    if (trustLevel >= 8) {
      baseLevelChoices.push({
        text: "I'll support whatever you choose, but I think you already know what you need to do.",
        trust_required: 8, 
        approach: "deep_trust"
      });
    }
    
    return baseLevelChoices;
  }
  
  // Resolve crisis based on player choice
  resolveCrisis(crisisId, playerChoice) {
    const crisis = this.activeCrises.find(c => c.id === crisisId);
    if (!crisis) return null;
    
    // Calculate outcome based on choice approach and trust level
    const outcome = this.calculateOutcome(crisis, playerChoice);
    
    // Update character state
    this.updateCharacterAfterCrisis(crisis.character, outcome);
    
    // Update platform states
    this.updatePlatformsAfterCrisis(crisis.character, outcome);
    
    // Move to resolved
    crisis.resolved = true;
    crisis.resolution = outcome;
    this.resolvedCrises.push(crisis);
    this.activeCrises = this.activeCrises.filter(c => c.id !== crisisId);
    
    return outcome;
  }
  
  calculateOutcome(crisis, choice) {
    const trustLevel = this.trustSystem.characterTrust[crisis.character];
    
    // Outcomes depend on both choice and relationship depth
    const outcomes = {
      supportive: trustLevel >= 6 ? 'empowered_authentic_choice' : 'supported_but_uncertain',
      neutral: 'character_self_determines',
      personal_history: 'breakthrough_moment', 
      deep_trust: 'transformative_growth'
    };
    
    return {
      type: outcomes[choice.approach] || 'standard_resolution',
      character_growth: choice.approach === 'deep_trust' ? 'major' : 'moderate',
      relationship_impact: choice.trust_required > 0 ? 'deepened' : 'maintained',
      platform_effect: this.getPlatformEffect(crisis.character, choice.approach),
      story_branches_unlocked: this.getUnlockedBranches(crisis.character, choice.approach)
    };
  }
  
  updateCharacterAfterCrisis(character, outcome) {
    // Characters grow/change based on how crisis was handled
    const characterGrowth = {
      Maya: outcome.type.includes('authentic') ? 'gains_courage' : 'remains_conflicted',
      Samuel: outcome.type.includes('transformative') ? 'renewed_purpose' : 'continues_guiding',
      Devon: outcome.type.includes('breakthrough') ? 'opens_to_collaboration' : 'stays_isolated',
      Jordan: outcome.type.includes('empowered') ? 'becomes_confident_mentor' : 'offers_cautious_advice'
    };
    
    return characterGrowth[character];
  }
  
  updatePlatformsAfterCrisis(_character, _outcome) {
    // Platform states shift based on character growth
    // Maya's growth affects healthcare platform
    // Devon's growth affects engineering platform, etc.
  }
  
  getUnlockedBranches(character, approach) {
    // Deep trust approaches unlock special story branches
    if (approach === 'deep_trust') {
      return ['platform_7_half_discovery', 'mentor_ending_path'];
    }
    return ['standard_continuation'];
  }
}

// Export for integration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CrisisSystem;
} else {
  window.CrisisSystem = CrisisSystem;
}
