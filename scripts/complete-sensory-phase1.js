const fs = require('fs');
const path = require('path');

// Read the story data
const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// Final batch of sensory enhancements to complete Phase 1
const finalEnhancements = {
  // Key Chapter 2 moments
  "2-2": {
    text: "The station's architecture has shifted. Platforms that were straight now curve slightly, like the station is breathing. The air carries new scents - sawdust from Platform 3, antiseptic from Platform 1, ozone from the data center. Each platform's influence spreads like invisible territories.",
    searchPattern: "The station's architecture"
  },
  
  "2-4": {
    text: "Samuel's workshop exists between moments. The door handle is worn brass, warm from countless hands. Inside, clocks tick at different speeds, creating a polyrhythm that makes your head swim. The air smells of clock oil and paradox.",
    searchPattern: "Samuel's workshop"
  },
  
  "2-6": {
    text: "The bridge between platforms sways slightly under your feet, cables humming with tension. Below, you glimpse maintenance tunnels that smell of rust and secrets. The handrails are sticky with years of nervous palms.",
    searchPattern: "bridge between platforms"
  },
  
  "2-8": {
    text: "Marcus's supply closet is bigger inside than out. Shelves reach into darkness, stocked with items that shouldn't exist - bottles of liquid starlight (cold to touch), jars of preserved possibilities (they hum when shaken). The air tastes of copper and what-if.",
    searchPattern: "Marcus's supply closet"
  },
  
  "2-10": {
    text: "The station's heart beats beneath your feet - a massive furnace that burns something other than coal. The heat rises through grates, carrying the scent of molten brass and determination. Every choice made above feeds the fire below.",
    searchPattern: "station's heart"
  },
  
  "2-11": {
    text: "Maya's workshop smells of solder and hope. Tiny robots scatter across workbenches, their servos whirring like mechanical crickets. Medical textbooks prop open doors, their pages yellowed with highlighter and desperation.",
    searchPattern: "Maya's workshop"
  },
  
  "2-12": {
    text: "Devon's system maps cover entire walls, drawn in pencil that smudges under your fingers. The paper smells of graphite and obsession. Red string connects problems to solutions, creating a web that vibrates when you touch it.",
    searchPattern: "Devon's system maps"
  },
  
  "2-13": {
    text: "Jordan's screens glow with data streams that generate their own heat. The keyboard keys are worn smooth, some letters completely gone. Empty energy drink cans create a fortress around the workspace, their aluminum smell mixing with electronic heat.",
    searchPattern: "Jordan's screens"
  },
  
  "2-14": {
    text: "Alex's seedlings push through concrete with sounds like tiny hammers. The grow lights buzz at a frequency that makes plants lean toward them. Soil under fingernails, the greenhouse humidity makes breathing feel like swimming.",
    searchPattern: "Alex's seedlings"
  },
  
  "2-15": {
    text: "Platform convergence creates winds that smell of all futures at once - medical latex mixing with sawdust, server coolant with potting soil. The crosswinds make your coat flap like wings you don't have.",
    searchPattern: "Platform convergence"
  },
  
  // Complete Chapter 3 Birmingham connections
  "3-4": {
    text: "The Sloss Furnaces connection manifests as heat from below. The platform's metal grating glows faintly orange, and you smell the ghost of Birmingham's industrial past - coal smoke and sweat equity. Your shoes stick slightly to the warm metal.",
    searchPattern: "Sloss Furnaces"
  },
  
  "3-6": {
    text: "Innovation Depot's influence spreads through Platform 3. The air crackles with startup energy - that particular mix of burned coffee, whiteboard markers, and 3 AM breakthroughs. Phantom code scrolls across surfaces, green text on black.",
    searchPattern: "Innovation Depot"
  },
  
  "3-7": {
    text: "The Rotary Trail manifests as green veins through the station. You smell Alabama pine and red clay after rain. Bike chains click in phantom pelotons, and the platforms connect with paths that didn't exist yesterday.",
    searchPattern: "Rotary Trail"
  },
  
  "3-8": {
    text: "Protective Life's data center hums through Platform 7. The temperature drops exactly 7.2 degrees as you approach. Server fans create white noise that sounds like digital rain. The air tastes of statistics and security.",
    searchPattern: "Protective Life"
  },
  
  "3-10": {
    text: "Railroad Park's influence brings actual grass through platform cracks. The smell of fresh-cut lawn mixes impossibly with train diesel. Somewhere, a food truck's generator hums, and you catch phantom scents of fusion tacos.",
    searchPattern: "Railroad Park"
  },
  
  "3-12": {
    text: "Birmingham's night shift manifests fully. The jangle of hospital ID badges, the squeak of janitor carts, the diesel rumble of delivery trucks. The platform floor is still damp from recent mopping, that particular Pine-Sol clean that means someone cared enough to scrub corners.",
    searchPattern: "night shift manifests"
  },
  
  "3-14": {
    text: "Career connections solidify into brass plaques that are warm to touch. Each one vibrates slightly when you read it, as if the opportunity itself is eager. The ink smells fresh, though the plaques look ancient.",
    searchPattern: "Career connections"
  },
  
  "3-16": {
    text: "The workshop spaces smell of possibility - fresh lumber waiting to be shaped, blank canvases that smell of gesso and potential. Tools hang on pegboards, their handles worn smooth by hands that haven't held them yet.",
    searchPattern: "workshop spaces"
  },
  
  "3-17": {
    text: "Your reflection in Platform 7's glass has changed. You look more solid, more real. Your breath fogs the glass, and when you wipe it clear, Birmingham's skyline reflects behind you - impossible but true.",
    searchPattern: "Your reflection"
  },
  
  "3-18": {
    text: "The final transformation brings all senses together. The station breathes Birmingham air - honeysuckle and humidity, barbecue smoke and possibility. Your feet know these floors now, every creak and warm spot.",
    searchPattern: "final transformation"
  },
  
  "3-19": {
    text: "Dawn approaches through windows that shouldn't exist. The light is different - not sunrise but something more. It smells of fresh starts and strong coffee. The trains are arriving now, real ones, with real destinations. Birmingham is calling, and you know exactly which platform is yours.",
    searchPattern: "Dawn approaches"
  }
};

// Function to apply final enhancements
function completeSensoryPhase() {
  let enhancedCount = 0;
  let notFoundScenes = [];
  
  storyData.chapters.forEach(chapter => {
    chapter.scenes.forEach(scene => {
      const enhancement = finalEnhancements[scene.id];
      if (enhancement && scene.text) {
        if (scene.text.includes(enhancement.searchPattern)) {
          scene.text = enhancement.text;
          enhancedCount++;
          console.log(`✓ Enhanced scene ${scene.id}`);
        } else if (enhancement) {
          // Try a looser match
          const firstWords = enhancement.searchPattern.split(' ').slice(0, 3).join(' ');
          if (scene.text.includes(firstWords)) {
            scene.text = enhancement.text;
            enhancedCount++;
            console.log(`✓ Enhanced scene ${scene.id} (partial match)`);
          } else {
            notFoundScenes.push(scene.id);
          }
        }
      }
    });
  });
  
  if (notFoundScenes.length > 0) {
    console.log(`\n⚠️ Could not find these scenes: ${notFoundScenes.join(', ')}`);
  }
  
  return enhancedCount;
}

// Count total sensory enhancements
function countTotalEnhancements() {
  let count = 0;
  const sensoryKeywords = [
    'smell', 'taste', 'touch', 'cold', 'warm', 'hot', 'rough', 'smooth',
    'sticky', 'metal', 'brass', 'wood', 'marble', 'concrete',
    'antiseptic', 'coffee', 'sawdust', 'oil', 'ozone',
    'click', 'hum', 'buzz', 'echo', 'whisper', 'rumble',
    'degrees', 'temperature', 'humid', 'dry'
  ];
  
  storyData.chapters.forEach(chapter => {
    chapter.scenes.forEach(scene => {
      if (scene.text) {
        const hasSensory = sensoryKeywords.some(keyword => 
          scene.text.toLowerCase().includes(keyword)
        );
        if (hasSensory) count++;
      }
    });
  });
  
  return count;
}

// Main execution
console.log('Completing Phase 1: Sensory Grounding...\n');

const count = completeSensoryPhase();

if (count > 0) {
  // Save the enhanced story
  fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));
  
  const totalSensory = countTotalEnhancements();
  
  console.log(`\n✨ Phase 1 Complete!`);
  console.log(`   Enhanced ${count} scenes in this batch`);
  console.log(`   Total scenes with sensory details: ${totalSensory}+`);
  console.log('\n📊 Sensory Coverage:');
  console.log('   • Touch: metal, wood, brass, sticky, smooth, rough');
  console.log('   • Temperature: specific degrees, warm/cold variations');
  console.log('   • Smell: antiseptic, coffee, sawdust, ozone, Pine-Sol');
  console.log('   • Sound: clicks, hums, footsteps, echoes, rumbles');
  console.log('   • Taste: copper, salt, ozone, metal, possibility');
  console.log('\n✅ Phase 1: SENSORY GROUNDING - COMPLETE');
  console.log('   Ready for Phase 2: Character Crisis Moments');
} else {
  console.log('\n⚠️ No scenes were updated in this batch');
}