const fs = require('fs');
const path = require('path');

// Emotional Crisis Moments - BG3 Inspired
// Implementing: High-stakes emotional choices, character agency, meaningful consequences

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY environment variable is required')
  process.exit(1)
};
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

const CRISIS_MOMENTS = {
  Maya: {
    title: "The Dual Acceptance Crisis",
    setup: "Maya receives acceptance calls from both UAB Medical School and a prestigious robotics engineering program while talking to the player. She has 2 minutes to decide before scholarships expire. Her parents arrive at the station.",
    emotional_stakes: "Family approval vs. personal authenticity, security vs. passion, tradition vs. innovation",
    bg3_parallel: "Shadowheart's Nightsong choice - wants vs. needs in ultimate conflict",
    birmingham_details: ["UAB Medical School", "Southern Research Institute", "Innovation Depot"],
    time_pressure: "11:58 PM - Train platforms closing soon"
  },
  
  Samuel: {
    title: "The Guide's Doubt",
    setup: "Samuel reveals he's been offered his old corporate job back at twice the salary. His ex-wife calls - their daughter needs expensive medical treatment. He could afford it if he returned to corporate life, but it would mean abandoning the station and everyone depending on him.",
    emotional_stakes: "Personal family obligation vs. service to others, financial security vs. meaningful work",
    bg3_parallel: "Wyll's devil pact renewal - sacrifice personal needs for greater good",
    birmingham_details: ["Regions Bank executive position", "Children's Hospital bills", "Corporate downtown offices"],
    time_pressure: "Decision needed by midnight - when his shift ends"
  },
  
  Devon: {
    title: "The Human Factor Failure", 
    setup: "Devon's automated system design has a critical flaw that could endanger people at a Birmingham construction site. He can fix it by admitting his mistake and working with a team, or he can try to patch it alone and risk catastrophic failure.",
    emotional_stakes: "Pride vs. safety, isolation vs. collaboration, perfectionism vs. human fallibility",
    bg3_parallel: "Gale's orb crisis - personal flaw that could harm others",
    birmingham_details: ["Protective Stadium construction", "UAB Hospital expansion", "BJCC renovation"],
    time_pressure: "Construction crew starts tomorrow - fix needed tonight"
  },
  
  Jordan: {
    title: "The Mentor's Test",
    setup: "A young person approaches Jordan at the station, desperate and suicidal after their third career 'failure'. Jordan sees their younger self in this person. They can either share their own painful story of multiple 'failures' and risk re-opening old wounds, or stay safe and offer generic advice.",
    emotional_stakes: "Vulnerability vs. safety, mentorship vs. self-protection, sharing trauma to heal others",
    bg3_parallel: "Karlach's choice to help despite personal cost",
    birmingham_details: ["Career transition support groups", "Downtown Birmingham career centers", "Local job displacement stories"],
    time_pressure: "The person is about to leave the station forever"
  }
};

async function generateCrisisMoment(characterName, crisisData) {
  const prompt = `Create a high-stakes emotional crisis moment for "${characterName}" in Grand Central Terminus, inspired by Baldur's Gate 3's most dramatic character choice scenes.

CHARACTER CRISIS: ${crisisData.title}
SETUP: ${crisisData.setup}
EMOTIONAL STAKES: ${crisisData.emotional_stakes}
BG3 PARALLEL: ${crisisData.bg3_parallel}
BIRMINGHAM DETAILS: ${crisisData.birmingham_details.join(', ')}
TIME PRESSURE: ${crisisData.time_pressure}

BG3-STYLE REQUIREMENTS:
- Choices have no "correct" answer - all options are emotionally valid
- Consequences are meaningful but not punitive 
- Player feels genuine stakes and emotional investment
- Character's "wants vs needs" central to the conflict
- Dialogue includes subtext and emotional depth
- Environmental details reflect emotional state

CREATE:
1. A dramatic setup scene (2-3 paragraphs) with sensory Birmingham details
2. ${characterName}'s internal monologue revealing the stakes
3. 3-4 player choice options that represent different values/approaches
4. Immediate consequence descriptions for each choice
5. How this affects the character's growth arc
6. How this impacts platform states and other relationships

WRITING STYLE:
- Emotional authenticity over melodrama
- Show vulnerability without weakness
- Include physical details that convey emotional state
- Use Birmingham locations as emotional anchors
- Create moments that players will remember and discuss

Format as JSON with scene text, choices, and consequences.`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 4000
        }
      })
    });

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    // Clean and parse JSON response
    let jsonContent = content;
    
    // Extract JSON if it's wrapped in code blocks
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1] || jsonMatch[0];
    }
    
    try {
      return JSON.parse(jsonContent);
    } catch (parseError) {
      // If JSON parsing fails, create structured fallback
      console.log(`   ⚠️  JSON parsing failed for ${characterName}, creating manual structure`);
      return {
        character: characterName,
        crisis_title: crisisData.title,
        setup_scene: `A dramatic crisis moment for ${characterName} involving ${crisisData.emotional_stakes}`,
        choices: [
          { text: "Support their authentic choice", consequence: "Character gains courage but faces consequences" },
          { text: "Suggest compromise solution", consequence: "Character finds middle path with mixed results" },
          { text: "Advise caution and safety", consequence: "Character plays it safe but may have regrets" }
        ],
        emotional_weight: "high",
        birmingham_integration: crisisData.birmingham_details,
        bg3_inspiration: crisisData.bg3_parallel
      };
    }
  } catch (error) {
    console.error(`Error generating crisis for ${characterName}:`, error.message);
    return null;
  }
}

function createCrisisSystemCode() {
  return `
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
      id: \`crisis_\${characterName.toLowerCase()}_\${Date.now()}\`,
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
  
  updatePlatformsAfterCrisis(character, outcome) {
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
`;
}

async function integrateCrisisMomentsIntoGame(crisisMoments) {
  // Read current story data
  const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
  const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));
  
  // Add crisis moments as high-stakes scenes
  const crisisChapter = {
    id: 2,
    title: "Crisis at the Crossroads",
    description: "High-stakes emotional moments where characters face their deepest conflicts",
    scenes: []
  };
  
  // Convert crisis moments to game scenes
  crisisMoments.forEach((crisis, index) => {
    if (!crisis) return;
    
    const crisisScene = {
      id: `crisis_${crisis.character.toLowerCase()}_${index + 1}`,
      type: "crisis_choice",
      character: crisis.character,
      text: crisis.setup_scene || `A critical moment for ${crisis.character}...`,
      choices: crisis.choices || [],
      emotional_weight: "maximum",
      time_pressure: true,
      trust_impact_multiplier: 2, // Crisis choices have double trust impact
      nextScene: `crisis_${crisis.character.toLowerCase()}_resolution_${index + 1}`
    };
    
    // Add resolution scene
    const resolutionScene = {
      id: `crisis_${crisis.character.toLowerCase()}_resolution_${index + 1}`,
      type: "narration", 
      text: `The consequences of your choice ripple through ${crisis.character}'s life...`,
      character_growth: true,
      platform_state_change: true
    };
    
    crisisChapter.scenes.push(crisisScene, resolutionScene);
  });
  
  // Insert crisis chapter
  if (storyData.chapters.length < 3) {
    storyData.chapters.push(crisisChapter);
  }
  
  // Add crisis system metadata
  storyData.crisis_system = {
    enabled: true,
    high_stakes_moments: crisisMoments.length,
    bg3_principles_applied: [
      "meaningful_choices_no_wrong_answers",
      "emotional_stakes_over_mechanical",
      "character_wants_vs_needs_conflict", 
      "trust_level_affects_options",
      "consequences_shape_growth"
    ]
  };
  
  return storyData;
}

async function main() {
  console.log('⚡ GRAND CENTRAL TERMINUS - EMOTIONAL CRISIS MOMENTS');
  console.log('📚 Applying BG3 principles: High-stakes character choices with meaningful consequences\n');
  
  const crisisMoments = [];
  
  // Generate crisis moments for each character
  for (const [characterName, crisisData] of Object.entries(CRISIS_MOMENTS)) {
    console.log(`💔 Generating crisis moment for ${characterName}: "${crisisData.title}"...`);
    const crisis = await generateCrisisMoment(characterName, crisisData);
    
    if (crisis) {
      crisisMoments.push(crisis);
      console.log(`   ✅ High-stakes emotional scene created`);
      console.log(`   🎭 Stakes: ${crisisData.emotional_stakes.substring(0, 60)}...`);
    } else {
      console.log(`   ❌ Failed to generate crisis for ${characterName}`);
    }
    
    // Brief pause between requests
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  // Create crisis system code
  console.log('\n⚙️  Creating crisis moment system implementation...');
  const crisisSystemCode = createCrisisSystemCode();
  
  // Save crisis system code
  const crisisCodePath = path.join(__dirname, '..', 'lib', 'crisis-system.js');
  fs.writeFileSync(crisisCodePath, crisisSystemCode);
  console.log(`   💾 Crisis system code saved: ${path.basename(crisisCodePath)}`);
  
  // Integrate into game
  console.log('🔧 Integrating crisis moments into game narrative...');
  const enhancedStoryData = await integrateCrisisMomentsIntoGame(crisisMoments);
  
  // Save enhanced story
  const backupPath = path.join(__dirname, '..', 'data', `grand-central-story-backup-crisis-${Date.now()}.json`);
  const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
  
  // Create backup
  fs.writeFileSync(backupPath, fs.readFileSync(storyPath, 'utf8'));
  console.log(`💾 Backup created: ${path.basename(backupPath)}`);
  
  // Write enhanced version
  fs.writeFileSync(storyPath, JSON.stringify(enhancedStoryData, null, 2));
  console.log(`✅ Enhanced story with crisis moments saved`);
  
  // Save crisis documentation  
  const crisisDocsPath = path.join(__dirname, '..', 'data', 'crisis-moments-generated.json');
  fs.writeFileSync(crisisDocsPath, JSON.stringify({
    generated_date: new Date().toISOString(),
    crisis_moments: CRISIS_MOMENTS,
    generated_scenes: crisisMoments,
    bg3_principles: [
      "high_stakes_emotional_choices",
      "no_correct_answer_philosophy", 
      "trust_affects_available_options",
      "meaningful_consequences_for_growth",
      "vulnerability_creates_connection"
    ]
  }, null, 2));
  
  console.log(`📚 Crisis moments documentation saved: ${path.basename(crisisDocsPath)}`);
  
  console.log('\n🎯 CRISIS MOMENTS ENHANCEMENT COMPLETE');
  console.log('📊 Summary:');
  console.log(`   • ${crisisMoments.length} high-stakes emotional moments created`);
  console.log('   • BG3-style "no wrong answer" choice philosophy applied');
  console.log('   • Trust levels determine available dialogue options');
  console.log('   • Character growth arcs integrated with player choices');  
  console.log('   • Birmingham locations anchor emotional conflicts');
  
  console.log('\n🎮 Next Steps:');
  console.log('   1. Test crisis moments in browser');
  console.log('   2. Expand story structure to full 4-5 chapters');
  console.log('   3. Add Platform 7½ discovery mechanics');
  console.log('   4. Create "Quiet Hours" contemplative moments');
}

// Export for use by other scripts
module.exports = {
  generateCrisisMoment,
  CRISIS_MOMENTS
};

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  });
}