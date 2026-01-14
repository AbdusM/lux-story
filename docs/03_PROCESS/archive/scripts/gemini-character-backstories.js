const fs = require('fs');
const path = require('path');

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY environment variable is required')
  process.exit(1)
};
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

// BG3-Inspired Character Enhancement
// Applying: Character-driven writing with "wants vs needs", emotional depth, Birmingham integration

const CHARACTER_PROFILES = {
  Maya: {
    current: "Pre-med student facing family pressure",
    wants: "To please her parents and become a doctor",
    needs: "To integrate her analytical mind with creative passion (medical robotics)",
    backstory_moments_needed: [
      "Why she became pre-med (family pressure scene)",
      "When she first discovered robotics (childhood wonder)",
      "Her biggest fear about disappointing people (vulnerability)"
    ],
    birmingham_connections: ["UAB Medical School", "Children's Hospital", "Innovation Depot robotics labs"],
    personality: "Rabbit-like anxiety, quick movements, overthinking"
  },
  
  Samuel: {
    current: "Station Keeper, wise but mysterious",
    wants: "To guide others efficiently to their 'correct' career",
    needs: "To help people discover their authentic selves (not what looks good on paper)",
    backstory_moments_needed: [
      "Why he left his corporate job (soul-crushing realization)",
      "His first day as Station Keeper (hope and uncertainty)",
      "The moment he realized paths can't be rushed (wisdom gained)"
    ],
    birmingham_connections: ["Corporate downtown offices", "Railroad Park transformation", "Regions Bank tower"],
    personality: "Former corporate climber turned wise guide"
  },
  
  Devon: {
    current: "Engineering student, builds to avoid people",
    wants: "To solve problems through systems and avoid people",
    needs: "To realize that the best systems serve human connection",
    backstory_moments_needed: [
      "Why he retreated into building things (social trauma)",
      "A project that failed because he ignored human factors",
      "Seeing his work make someone's life genuinely better"
    ],
    birmingham_connections: ["UAB Engineering", "Protective Stadium construction", "Red Mountain infrastructure"],
    personality: "Ant-like methodology, organizing, systemizing"
  },
  
  Jordan: {
    current: "Career changer, tried multiple paths",
    wants: "To find the 'right' career and stick to it",
    needs: "To embrace adaptability as a strength, not a failure",
    backstory_moments_needed: [
      "Their first career 'failure' and the shame it brought",
      "The moment they realized expertise can transfer between fields",
      "Teaching someone else that change isn't failure (mentor awakening)"
    ],
    birmingham_connections: ["Protective Life data center", "Multiple companies across the city", "BJCC career fairs"],
    personality: "Butterfly transformation anxiety, three platforms tried"
  }
};

async function generateCharacterBackstory(characterName, profile) {
  const prompt = `You are writing emotionally resonant backstory moments for "${characterName}" in Grand Central Terminus, a career exploration game set in Birmingham, AL.

CHARACTER PROFILE:
- Current Role: ${profile.current}
- What They Want: ${profile.wants}
- What They Need: ${profile.needs}
- Personality: ${profile.personality}

WRITING STYLE: Inspired by Baldur's Gate 3's emotional depth
- Use specific Birmingham locations and sensory details
- Focus on internal conflict and emotional truth
- Each moment should reveal character vulnerability
- Include subtext - what they don't say is as important as what they do

BACKSTORY MOMENTS TO CREATE:
${profile.backstory_moments_needed.map((moment, i) => `${i + 1}. ${moment}`).join('\n')}

Birmingham Integration Points: ${profile.birmingham_connections.join(', ')}

For each backstory moment, write:
1. A compelling 2-3 paragraph scene with dialogue
2. Sensory details about Birmingham settings
3. The emotional truth this reveals about the character
4. How this connects to their "wants vs needs" conflict

Format as JSON with structure:
{
  "character": "${characterName}",
  "backstory_moments": [
    {
      "title": "moment title",
      "scene": "full scene text with dialogue",
      "emotional_core": "what this reveals about character",
      "birmingham_detail": "specific local connection",
      "internal_conflict": "wants vs needs tension shown"
    }
  ]
}`;

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
      throw new Error('No valid JSON found in response');
    }
  } catch (error) {
    console.error(`Error generating backstory for ${characterName}:`, error.message);
    return null;
  }
}

async function integrateBackstoriesIntoGame(backstories) {
  // Read current story data
  const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
  const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));
  
  // Find Chapter 1 to inject deeper character moments
  const chapter1 = storyData.chapters.find(ch => ch.id === 1);
  if (!chapter1) {
    throw new Error('Chapter 1 not found');
  }
  
  // Add backstory revelation scenes as optional deeper conversations
  backstories.forEach(backstory => {
    if (!backstory) return;
    
    backstory.backstory_moments.forEach((moment, index) => {
      const newSceneId = `${backstory.character.toLowerCase()}-backstory-${index + 1}`;
      
      // Create choice to dive deeper into character
      const backstoryChoiceScene = {
        id: `${backstory.character.toLowerCase()}-choice-deeper`,
        type: "choice",
        text: `${backstory.character} seems lost in thought, staring at something in the distance. There's a weight in their expression you haven't seen before.`,
        choices: [
          {
            text: `"${backstory.character}, what's on your mind?"`,
            nextScene: newSceneId,
            consequence: "trust_gained"
          },
          {
            text: "Give them space and continue exploring.",
            nextScene: "continue_exploration",
            consequence: "missed_opportunity"
          }
        ]
      };
      
      // Create the backstory revelation scene
      const backstoryScene = {
        id: newSceneId,
        type: "dialogue",
        speaker: backstory.character,
        text: moment.scene,
        emotional_weight: "high",
        trust_impact: 2,
        nextScene: "after_revelation_choice"
      };
      
      // Add to chapter
      chapter1.scenes.push(backstoryChoiceScene);
      chapter1.scenes.push(backstoryScene);
    });
  });
  
  // Add metadata about character depth
  storyData.metadata = storyData.metadata || {};
  storyData.metadata.character_depth_enhanced = true;
  storyData.metadata.bg3_principles_applied = [
    "character_driven_writing",
    "wants_vs_needs_conflict",
    "emotional_backstory_moments",
    "birmingham_integration"
  ];
  storyData.metadata.enhancement_date = new Date().toISOString();
  
  return storyData;
}

async function main() {
  console.log('🎭 GRAND CENTRAL TERMINUS - CHARACTER BACKSTORY ENHANCEMENT');
  console.log('📚 Applying Baldur\'s Gate 3 principles: Character-driven writing with emotional depth\n');
  
  const backstories = [];
  
  // Generate backstories for each character
  for (const [characterName, profile] of Object.entries(CHARACTER_PROFILES)) {
    console.log(`✨ Generating backstory moments for ${characterName}...`);
    const backstory = await generateCharacterBackstory(characterName, profile);
    
    if (backstory) {
      backstories.push(backstory);
      console.log(`   ✅ Created ${backstory.backstory_moments.length} emotional backstory moments`);
      
      // Log sample moment for verification
      const sample = backstory.backstory_moments[0];
      console.log(`   📖 Sample: "${sample.title}" - ${sample.emotional_core.substring(0, 80)}...`);
    } else {
      console.log(`   ❌ Failed to generate backstory for ${characterName}`);
    }
    
    // Brief pause between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Integrate into game
  console.log('\n🔧 Integrating backstories into game narrative...');
  const enhancedStoryData = await integrateBackstoriesIntoGame(backstories);
  
  // Save enhanced story
  const backupPath = path.join(__dirname, '..', 'data', `grand-central-story-backup-${Date.now()}.json`);
  const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
  
  // Create backup
  fs.writeFileSync(backupPath, fs.readFileSync(storyPath, 'utf8'));
  console.log(`💾 Backup created: ${path.basename(backupPath)}`);
  
  // Write enhanced version
  fs.writeFileSync(storyPath, JSON.stringify(enhancedStoryData, null, 2));
  console.log(`✅ Enhanced story saved to ${path.basename(storyPath)}`);
  
  // Save detailed backstories for reference
  const backstoriesPath = path.join(__dirname, '..', 'data', 'character-backstories-generated.json');
  fs.writeFileSync(backstoriesPath, JSON.stringify({
    generated_date: new Date().toISOString(),
    bg3_principles_applied: true,
    character_profiles: CHARACTER_PROFILES,
    generated_backstories: backstories
  }, null, 2));
  console.log(`📚 Character backstories saved: ${path.basename(backstoriesPath)}`);
  
  console.log('\n🎯 ENHANCEMENT COMPLETE');
  console.log('📊 Summary:');
  console.log(`   • ${backstories.length} characters enhanced`);
  console.log(`   • ${backstories.reduce((sum, b) => sum + (b?.backstory_moments?.length || 0), 0)} emotional moments added`);
  console.log('   • BG3-style wants vs. needs conflicts integrated');
  console.log('   • Birmingham locations woven into personal stories');
  console.log('   • Trust system foundation laid for deeper relationships');
  
  console.log('\n🎮 Next Steps:');
  console.log('   1. Test enhanced narrative in browser');
  console.log('   2. Run trust-system-builder.js');
  console.log('   3. Run platform-responsiveness.js');
  console.log('   4. Generate crisis moments with emotional stakes');
}

// Export for use by other scripts
module.exports = {
  generateCharacterBackstory,
  integrateBackstoriesIntoGame,
  CHARACTER_PROFILES
};

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script failed:', error.message);
    process.exit(1);
  });
}