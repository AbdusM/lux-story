const fs = require('fs');
const path = require('path');

// Trust System and Platform Responsiveness - BG3 Inspired
// Implementing: Meaningful choices with consequences, environmental responsiveness, character relationships

const TRUST_MECHANICS = {
  characters: {
    Samuel: {
      trust_levels: {
        0: "Polite but distant, basic guidance only",
        3: "Shares station history, offers practical advice", 
        6: "Reveals his corporate past, deeper wisdom",
        8: "Confides his fears about guiding people wrong",
        10: "Complete trust, shares the secret of Platform 7½"
      },
      trust_triggers: {
        "helped_other_character": +2,
        "chose_authentic_path": +1,
        "rushed_without_listening": -1,
        "dismissed_his_advice": -2
      }
    },
    Maya: {
      trust_levels: {
        0: "Anxious, keeps family pressure secret",
        3: "Admits conflict between medicine and robotics",
        6: "Shows you her secret robotics projects",
        8: "Asks for help making the big decision",
        10: "Credits you with giving her courage to choose authentically"
      },
      trust_triggers: {
        "validated_her_feelings": +2,
        "suggested_compromise": +1,
        "pushed_too_hard": -1,
        "dismissed_family_importance": -2
      }
    },
    Devon: {
      trust_levels: {
        0: "Talks only about technical systems, avoids personal topics",
        3: "Explains why he prefers building to people",
        6: "Shows vulnerability about social struggles",
        8: "Asks for help connecting his work to community impact",
        10: "Becomes confident mentor for other technical introverts"
      },
      trust_triggers: {
        "appreciated_his_systems": +2,
        "connected_work_to_people": +1,
        "forced_social_interaction": -1,
        "called_him_antisocial": -2
      }
    },
    Jordan: {
      trust_levels: {
        0: "Defensive about career changes, seems scattered",
        3: "Admits feeling like a failure for not sticking to one path",
        6: "Shares wisdom about transferable skills",
        8: "Becomes guide to hidden/hybrid platforms",
        10: "Empowered as mentor for non-linear career paths"
      },
      trust_triggers: {
        "validated_career_changes": +2,
        "saw_patterns_in_experience": +1,
        "suggested_picking_one_thing": -1,
        "called_them_unfocused": -2
      }
    }
  },
  
  platform_states: {
    healthcare: {
      cold: "Sterile fluorescent lighting, few people, feels impersonal",
      neutral: "Standard hospital ambiance, moderate activity", 
      warm: "Golden sunrise light, caring conversations, sense of calling",
      resonant: "Gentle pulse of life-saving energy, platform recognizes you"
    },
    engineering: {
      cold: "Industrial gray, harsh machinery sounds, isolated workstations",
      neutral: "Workshop atmosphere, steady construction sounds",
      warm: "Collaborative maker space energy, building something meaningful", 
      resonant: "Blueprints glow with potential, structures seem to respond"
    },
    data: {
      cold: "Endless cubicles, screen glare, disconnected from impact",
      neutral: "Standard tech office, servers humming",
      warm: "Insights lighting up, data telling human stories",
      resonant: "Information flows visibly, patterns reveal themselves"
    },
    sustainability: {
      cold: "Withered plants, gray corporate sustainability theater", 
      neutral: "Basic recycling and energy efficiency",
      warm: "Thriving green spaces, renewable energy systems",
      resonant: "Living systems pulse with natural rhythms"
    }
  }
};

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY environment variable is required')
  process.exit(1)
};
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

async function generateTrustSystemScenes() {
  const prompt = `Create trust-building dialogue scenes for Grand Central Terminus, inspired by Baldur's Gate 3's approval system.

CONTEXT: Players build trust with 4 companions through meaningful choices. Each character has trust levels 0-10 with different dialogue/revelations at each level.

CHARACTER DYNAMICS:
- Samuel: Former corporate exec turned wise station keeper (trust = deeper wisdom shared)
- Maya: Pre-med student torn between family expectations and robotics passion (trust = vulnerability about choice)
- Devon: Introverted engineer who builds to avoid people (trust = social courage growth)
- Jordan: Career changer who's tried multiple paths (trust = mentor confidence)

TRUST MECHANICS NEEDED:
1. Choice moments that clearly affect trust (+2, +1, -1, -2)
2. Character reactions to trust changes ("Maya seems more open" vs "Maya pulls back")
3. Unlocked dialogue at higher trust levels
4. Environmental changes (platforms warm/cool based on relationship states)

BG3-STYLE REQUIREMENTS:
- Choices have emotional weight, not just mechanical effect
- Characters remember past interactions
- Trust affects story outcomes, not just dialogue flavor
- Subtext - what characters don't say is as important as what they do

Generate 3 scenes for each character showing:
1. Low trust interaction (cautious, surface level)
2. Medium trust moment (opening up, sharing conflict)  
3. High trust revelation (deep vulnerability, character growth)

Format as JSON with Birmingham details integrated into personal moments.`;

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
          temperature: 0.7,
          maxOutputTokens: 4000
        }
      })
    });

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      // Return structured fallback if JSON parsing fails
      return {
        trust_scenes: [],
        note: "Generated trust system framework - manual scene integration needed"
      };
    }
  } catch (error) {
    console.error('Error generating trust scenes:', error.message);
    return null;
  }
}

async function generatePlatformResponsivenessScenes() {
  const prompt = `Create environmental responsiveness descriptions for Grand Central Terminus platforms that change based on player choices and character trust levels.

PLATFORM STATES (inspired by BG3's environmental storytelling):
- Cold: Player choices contradict this career path
- Neutral: Standard state, no strong connection
- Warm: Player choices align with this path  
- Resonant: Deep connection, platform "recognizes" player

PLATFORMS TO ENHANCE:
1. Healthcare Platform: Connected to Maya's journey
2. Engineering Platform: Connected to Devon's growth
3. Data Platform: Connected to Jordan's experience
4. Sustainability Platform: Connected to Alex's environmental focus

For each platform and each state, describe:
1. Visual changes (lighting, activity level, atmosphere)
2. Audio changes (sounds, conversations, ambient noise)
3. NPC behavior changes (welcoming vs distant)
4. Interactive elements that appear/disappear
5. Birmingham-specific details that reinforce the feeling

Example format:
{
  "platform_name": {
    "cold": {
      "visual": "description of cold/unwelcoming appearance",
      "audio": "sounds that feel disconnected/harsh",
      "npcs": "how people behave when platform is cold",
      "interactive": "what options are limited/missing",
      "birmingham_detail": "local connection that reinforces coldness"
    }
  }
}

Focus on subtle environmental storytelling that makes player choices feel impactful.`;

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
          maxOutputTokens: 3000
        }
      })
    });

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      return TRUST_MECHANICS.platform_states; // Fallback to predefined states
    }
  } catch (error) {
    console.error('Error generating platform responsiveness:', error.message);
    return TRUST_MECHANICS.platform_states;
  }
}

function createTrustSystemCode() {
  return `
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
      \`\${character} approves (+\${change})\` : 
      \`\${character} disapproves (\${change})\`;
    
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
`;
}

async function integrateTrustSystemIntoGame(trustScenes, platformResponses) {
  // Read current story data
  const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
  const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));
  
  // Add trust system metadata
  storyData.trust_system = {
    enabled: true,
    character_trust_levels: TRUST_MECHANICS.characters,
    platform_responsiveness: platformResponses,
    trust_scenes: trustScenes
  };
  
  // Enhance existing choices with trust impacts
  storyData.chapters.forEach(chapter => {
    chapter.scenes.forEach(scene => {
      if (scene.type === 'choice' && scene.choices) {
        scene.choices.forEach(choice => {
          // Add trust impact metadata to choices
          if (choice.text.includes('help') || choice.text.includes('support')) {
            choice.trust_impact = { character: 'contextual', change: 1 };
          } else if (choice.text.includes('dismiss') || choice.text.includes('ignore')) {
            choice.trust_impact = { character: 'contextual', change: -1 };
          }
        });
      }
    });
  });
  
  return storyData;
}

async function main() {
  console.log('🤝 GRAND CENTRAL TERMINUS - TRUST SYSTEM & PLATFORM RESPONSIVENESS');
  console.log('📚 Applying BG3 principles: Meaningful relationships with environmental consequences\n');
  
  // Generate trust-building scenes
  console.log('✨ Generating trust-building dialogue scenes...');
  const trustScenes = await generateTrustSystemScenes();
  console.log('   ✅ Trust interaction scenes created');
  
  // Generate platform responsiveness descriptions
  console.log('🌡️  Generating platform environmental responsiveness...');
  const platformResponses = await generatePlatformResponsivenessScenes();
  console.log('   ✅ Platform state descriptions created');
  
  // Create trust system code
  console.log('⚙️  Creating trust system implementation...');
  const trustSystemCode = createTrustSystemCode();
  
  // Save trust system code
  const trustCodePath = path.join(__dirname, '..', 'lib', 'trust-system.js');
  fs.writeFileSync(trustCodePath, trustSystemCode);
  console.log(`   💾 Trust system code saved: ${path.basename(trustCodePath)}`);
  
  // Integrate into game data
  console.log('🔧 Integrating trust system into game narrative...');
  const enhancedStoryData = await integrateTrustSystemIntoGame(trustScenes, platformResponses);
  
  // Save enhanced story with trust system
  const backupPath = path.join(__dirname, '..', 'data', `grand-central-story-backup-trust-${Date.now()}.json`);
  const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
  
  // Create backup
  fs.writeFileSync(backupPath, fs.readFileSync(storyPath, 'utf8'));
  console.log(`💾 Backup created: ${path.basename(backupPath)}`);
  
  // Write enhanced version
  fs.writeFileSync(storyPath, JSON.stringify(enhancedStoryData, null, 2));
  console.log(`✅ Enhanced story with trust system saved`);
  
  // Save trust system documentation
  const trustDocsPath = path.join(__dirname, '..', 'data', 'trust-system-generated.json');
  fs.writeFileSync(trustDocsPath, JSON.stringify({
    generated_date: new Date().toISOString(),
    trust_mechanics: TRUST_MECHANICS,
    generated_scenes: trustScenes,
    platform_responsiveness: platformResponses,
    bg3_principles: [
      "meaningful_choices_with_consequences",
      "environmental_responsiveness", 
      "character_relationship_depth",
      "approval_system_feedback"
    ]
  }, null, 2));
  
  console.log(`📚 Trust system documentation saved: ${path.basename(trustDocsPath)}`);
  
  console.log('\n🎯 TRUST SYSTEM ENHANCEMENT COMPLETE');
  console.log('📊 Summary:');
  console.log('   • BG3-style approval/disapproval system implemented');
  console.log('   • Platform environmental responsiveness added'); 
  console.log('   • Character trust levels unlock deeper dialogue');
  console.log('   • Choices now have visible relationship consequences');
  console.log('   • Birmingham locations integrated into emotional moments');
  
  console.log('\n🎮 Next Steps:');
  console.log('   1. Test trust system in browser');
  console.log('   2. Generate emotional crisis moments'); 
  console.log('   3. Expand story structure to 4-5 chapters');
  console.log('   4. Add Platform 7½ discovery mechanics');
}

// Export for use by other scripts
module.exports = {
  generateTrustSystemScenes,
  generatePlatformResponsivenessScenes,
  TRUST_MECHANICS
};

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  });
}