const fs = require('fs');
const path = require('path');

// Read the story data
const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// Add missing Chapter 3 scenes that are referenced but don't exist
const missingScenes = [
  // Platform exploration branches from 3-1
  {
    id: "3-2a",
    type: "narration",
    text: "Platform 1 has transformed overnight. The antiseptic hospital smell is stronger now, mixed with coffee and exhaustion. The sign flickers between 'SERVICE & IMPACT' and real Birmingham locations:\n\nUAB Hospital - Main Campus\nChildren's of Alabama\nSt. Vincent's Birmingham\nPrinceton Baptist Medical Center\n\nMaya stands here, her medical textbooks scattered on a bench. But she's not reading them - she's sketching designs for surgical robots on their margins. The platform seems to pulse with the heartbeat of Birmingham's medical district."
  },
  {
    id: "3-2b",
    type: "narration",
    text: "Platform 3 vibrates with construction energy. Sawdust fills the air, and you hear the distant sound of hammering. The sign shifts between 'SYSTEMS & OPERATIONS' and Birmingham companies:\n\nBrasfield & Gorrie Construction\nRobins & Morton\nBarber Companies\nDunn Building Company\n\nDevon is here, surrounded by blueprints and system diagrams. 'Look,' he says, pointing to a map of Birmingham's infrastructure. 'Every building tells a story about what the city values. Medical centers cluster near UAB. Tech startups circle Innovation Depot. We're not random - we're patterns.'"
  },
  {
    id: "3-2c",
    type: "narration",
    text: "Platform 7's flickering has stabilized into data streams. Numbers flow across surfaces like digital rain. The sign alternates between 'INFORMATION & ANALYSIS' and Birmingham's data centers:\n\nRegions Financial Corporation\nProtective Life Corporation\nAlabama Power Company\nBlue Cross Blue Shield of Alabama\n\nJordan sits in the middle of multiple screens, each showing different aspects of Birmingham's economy. 'Every transaction tells a story,' they mutter. 'Shipt orders show food deserts. Regions loans map gentrification. The data doesn't lie - Birmingham is transforming block by block.'"
  },
  {
    id: "3-2d",
    type: "narration",
    text: "Platform 9 has become a full greenhouse. Humidity fogs the glass walls, and grow lights cast everything in purple. The sign reads 'EMERGING & GROWTH' and cycles through green initiatives:\n\nAlabama Environmental Council\nFreshwater Land Trust\nRed Mountain Park\nRuffner Mountain Nature Preserve\n\nAlex tends to solar panels that somehow grow like vines. 'Birmingham was built on coal and steel,' they explain. 'But iron ore runs out. Coal kills. The future is renewable, and Alabama has more sun than Silicon Valley. We just have to convince people that green can grow in red clay.'"
  },
  
  // Continue from each platform exploration
  {
    id: "3-3",
    type: "choice",
    text: "The platform you're on resonates with your presence. The characters here look at you expectantly, as if you might have answers they're seeking.",
    choices: [
      {
        text: "Talk to Maya about medical school pressure",
        consequence: "maya_conversation",
        nextScene: "3-3a",
        stateChanges: {
          relationships: { maya: { trust: 2 } },
          patterns: { helping: 1 }
        }
      },
      {
        text: "Discuss systems thinking with Devon",
        consequence: "devon_conversation",
        nextScene: "3-3b",
        stateChanges: {
          relationships: { devon: { trust: 2 } },
          patterns: { analyzing: 1 }
        }
      },
      {
        text: "Analyze data patterns with Jordan",
        consequence: "jordan_conversation",
        nextScene: "3-3c",
        stateChanges: {
          relationships: { jordan: { trust: 2 } },
          patterns: { analyzing: 1 }
        }
      },
      {
        text: "Learn about renewable energy with Alex",
        consequence: "alex_conversation",
        nextScene: "3-3d",
        stateChanges: {
          relationships: { alex: { trust: 2 } },
          patterns: { exploring: 1 }
        }
      }
    ]
  },
  
  // Continuation scenes
  {
    id: "3-3b",
    type: "dialogue",
    speaker: "Devon",
    text: "Systems are just patterns at scale. Birmingham's medical corridor didn't happen by accident - UAB attracted talent, talent needed housing, housing needed retail, retail needed infrastructure. Now look: Southside, Avondale, Parkside - all transformed because one hospital decided to grow. That's systems thinking. One change ripples everywhere."
  },
  {
    id: "3-3c",
    type: "dialogue",
    speaker: "Jordan",
    text: "The numbers show Birmingham's split personality. Tech sector: growing 15% yearly. Traditional manufacturing: declining 3%. But here's the interesting part - the successful manufacturers are the ones going digital. ACIPCO uses AI for quality control now. Steel plants run on data as much as coal. The future isn't replacing the past - it's upgrading it."
  },
  {
    id: "3-3d",
    type: "dialogue",
    speaker: "Alex",
    text: "You know what's funny? Alabama ranks 2nd in the nation for biodiversity. We have more species of plants and animals than almost anywhere else. But mention 'environment' here and people think you're attacking coal jobs. I'm not trying to kill the past - I'm trying to plant the future. Sometimes literally. These seedlings? They'll be installed on Birmingham rooftops next month."
  },
  
  // Bridge to next section
  {
    id: "3-4",
    type: "narration",
    text: "The station shudders slightly. Through the windows, Birmingham's skyline becomes clearer - no longer a distant view but immediate, pressing. The clock tower still shows 11:52 PM, but somehow you know that's not really the time anymore. This is the moment of choosing, and Birmingham is waiting for your answer."
  },
  
  // Platform convergence
  {
    id: "3-5",
    type: "choice",
    text: "All four platforms begin to pulse in unison. The characters gather, each holding applications, forms, contact information. This isn't mystical anymore - it's practical. Where do you see yourself in Birmingham's ecosystem?",
    choices: [
      {
        text: "Healthcare: Where caring becomes a career",
        consequence: "healthcare_focus",
        nextScene: "3-6a",
        stateChanges: {
          careerValues: { directImpact: 3 },
          platforms: { p1: { warmth: 5, resonance: 8 } }
        }
      },
      {
        text: "Construction/Systems: Building Birmingham's future",
        consequence: "systems_focus",
        nextScene: "3-6b",
        stateChanges: {
          careerValues: { systemsThinking: 3 },
          platforms: { p3: { warmth: 5, resonance: 8 } }
        }
      },
      {
        text: "Data/Technology: Digital transformation",
        consequence: "data_focus",
        nextScene: "3-6c",
        stateChanges: {
          careerValues: { dataInsights: 3 },
          platforms: { p7: { warmth: 5, resonance: 8 } }
        }
      },
      {
        text: "Sustainability: Green growth in red clay",
        consequence: "green_focus",
        nextScene: "3-6d",
        stateChanges: {
          careerValues: { futureBuilding: 3 },
          platforms: { p9: { warmth: 5, resonance: 8 } }
        }
      }
    ]
  },
  
  // Career path scenes
  {
    id: "3-6a",
    type: "narration",
    text: "The healthcare path crystallizes. UAB's campus map appears on the wall - from the Kirklin Clinic to the Wallace Tumor Institute. Maya hands you a co-op application. 'It's not just about becoming a doctor,' she says. 'It's about becoming part of Birmingham's transformation from Steel City to Medical City. We're not just healing bodies - we're healing a region's economy.'"
  },
  {
    id: "3-6b",
    type: "narration",
    text: "The construction/systems path solidifies. Devon shows you active project sites across Birmingham - the Protective Stadium, the Birmingham-Jefferson Convention Complex expansion, the Bus Rapid Transit system. 'We're not just building structures,' he explains. 'We're building the skeleton that Birmingham's future will grow on. Every beam, every system, every connection matters.'"
  },
  {
    id: "3-6c",
    type: "narration",
    text: "The data path illuminates. Jordan's screens show Birmingham's digital nervous system - banking transactions, medical records, utility usage, traffic patterns. 'Data is Birmingham's new steel,' they say. 'We're mining information instead of iron ore. And unlike coal, data is renewable. Every day creates more. The question is: will we use it to repeat old patterns or create new ones?'"
  },
  {
    id: "3-6d",
    type: "narration",
    text: "The sustainability path blooms. Alex shows you the map of Birmingham's green spaces - Red Mountain Park's 1,500 acres, Ruffner Mountain's trails, the planned 750-mile Red Rock Ridge and Valley Trail System. 'Birmingham has more green space per capita than Denver,' they say. 'We just don't market it. We could be the South's green tech hub, but first we have to believe it ourselves.'"
  }
];

// Add missing scenes to Chapter 3
function fixMissingScenes() {
  const chapter3 = storyData.chapters.find(c => c.id === 3);
  if (!chapter3) {
    console.log('❌ Chapter 3 not found');
    return 0;
  }
  
  let addedCount = 0;
  
  missingScenes.forEach(scene => {
    // Check if scene already exists
    const exists = chapter3.scenes.some(s => s.id === scene.id);
    if (!exists) {
      // Find appropriate position to insert
      let insertIndex = chapter3.scenes.length; // Default to end
      
      // Try to maintain scene order
      const sceneNum = parseInt(scene.id.split('-')[1]);
      for (let i = 0; i < chapter3.scenes.length; i++) {
        const currentNum = parseInt(chapter3.scenes[i].id.split('-')[1]);
        if (currentNum > sceneNum) {
          insertIndex = i;
          break;
        }
      }
      
      chapter3.scenes.splice(insertIndex, 0, scene);
      addedCount++;
      console.log(`✓ Added missing scene ${scene.id}`);
    }
  });
  
  return addedCount;
}

// Main execution
console.log('Fixing missing Chapter 3 scenes...\n');

const added = fixMissingScenes();

if (added > 0) {
  // Save the fixed story
  fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));
  
  console.log(`\n✅ Fixed Chapter 3!`);
  console.log(`   Added ${added} missing scenes`);
  console.log('\n📊 Scenes added:');
  console.log('   • 3-2a through 3-2d: Platform explorations');
  console.log('   • 3-3b through 3-3d: Character conversations');
  console.log('   • 3-4: Birmingham skyline revelation');
  console.log('   • 3-5: Career path choice');
  console.log('   • 3-6a through 3-6d: Career path details');
  console.log('\n✅ Chapter 3 navigation should now work properly');
} else {
  console.log('\n⚠️ No scenes added - they may already exist');
}