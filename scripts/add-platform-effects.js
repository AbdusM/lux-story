const fs = require('fs');
const path = require('path');

// Read the story data
const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// Subtle platform influence effects - environmental responses
const platformEffects = {
  // Platform warmth responses
  "1-5a": {
    searchPattern: "Platform 3's lights shift from harsh fluorescent to warm amber",
    enhanced: "Platform 3's lights shift from harsh fluorescent to warm amber. The bench you fixed seems to hum slightly, a barely perceptible vibration of approval. Other broken things nearby - a cracked tile, a loose railing - seem less broken, as if waiting their turn to be repaired."
  },
  
  "1-5b": {
    searchPattern: "Platform 1 glows softer as you pass",
    enhanced: "Platform 1 glows softer as you pass, warming the air by degrees. The lights don't just brighten - they pulse gently, matching the rhythm of a resting heartbeat. A medical student nearby yawns and, for the first time in days, doesn't look exhausted."
  },
  
  "1-5c": {
    searchPattern: "Platform 3's lights dim to a cold industrial glare",
    enhanced: "Platform 3's lights dim to a cold industrial glare. The broken bench collapses completely with a crack like breaking ribs. But more unsettling - the temperature drops exactly where your shadow falls, as if the platform remembers your choice to rush past."
  },
  
  // Time effects based on patience/rushing
  "1-7d": {
    searchPattern: "The station... breathes",
    enhanced: "The station... breathes.\n\nThe clock's second hand stretches - you can actually see it slowing, each tick taking longer than the last. Your own breathing syncs with the station's rhythm. The coffee in a nearby traveler's cup stops steaming, frozen mid-swirl."
  },
  
  // Platform resonance effects
  "2-5a": {
    searchPattern: "Platform 1 feels different as you approach",
    enhanced: "Platform 1 feels different as you approach - the temperature rises noticeably, and you smell antiseptic mixed with the bitter aroma of hospital coffee. But there's something else: your own pulse becomes noticeable, steady, strong. The platform isn't just warm - it's synchronizing with your heartbeat, testing your capacity for sustained care."
  },
  
  // Data platform effects
  "2-7": {
    searchPattern: "The servers hum at precisely 60Hz",
    enhanced: "The servers hum at precisely 60Hz, creating a bass note you feel in your sternum. But when Jordan shows you the data streams, patterns emerge in your peripheral vision - connections you couldn't see directly but somehow understand. The numbers rearrange themselves slightly when you're not looking directly at them, becoming more truthful."
  },
  
  // Growth platform effects  
  "2-9": {
    searchPattern: "The air is humid enough to fog your glasses",
    enhanced: "The air is humid enough to fog your glasses, thick with the green smell of photosynthesis and rich soil. The plants lean toward you as you pass - not dramatically, just a subtle shift, like recognition. Seeds in Alex's pockets begin sprouting spontaneously, tiny green shoots pushing through the fabric."
  },
  
  // Platform convergence effects
  "2-15": {
    insertAfter: "2-14",
    scene: {
      id: "2-15",
      type: "narration",
      text: "Where the platforms meet, reality becomes negotiable. Coffee cups refill themselves halfway. Broken shoelaces retie. Medical textbooks flip to the exact page needed. It's not magic - it's the station responding to genuine need, to authentic purpose. The air shimmers like heat waves, but the temperature is perfect."
    }
  },
  
  // Choice consequence manifestation
  "2-16": {
    insertAfter: "2-15",
    scene: {
      id: "2-16",
      type: "narration",
      text: "Your recent choices manifest physically. If you've been helping others, your shadow casts warm light. If you've been analyzing, equations float in dust motes around you. If you've been building, tools in nearby toolboxes rattle eagerly when you pass. The station remembers everything, rewards authenticity, punishes pretense."
    }
  },
  
  // Platform rejection/acceptance
  "2-17": {
    insertAfter: "2-16",
    scene: {
      id: "2-17",
      type: "choice",
      text: "Platform 7 flickers more violently as you approach. The other platforms seem to be pulling at you - not forcefully, but like gentle magnetic fields. You feel their influence as physical sensations.",
      choices: [
        {
          text: "Let Platform 1's warmth guide you (your hands stop shaking)",
          consequence: "platform_1_pull",
          nextScene: "2-17a",
          stateChanges: {
            platforms: { p1: { warmth: 3, resonance: 5 } },
            patterns: { helping: 3 }
          }
        },
        {
          text: "Follow Platform 3's creative pulse (tools in your pockets feel heavier)",
          consequence: "platform_3_pull",
          nextScene: "2-17b",
          stateChanges: {
            platforms: { p3: { warmth: 3, resonance: 5 } },
            patterns: { building: 3 }
          }
        },
        {
          text: "Pursue Platform 7's data streams (numbers become visible in the air)",
          consequence: "platform_7_pull",
          nextScene: "2-17c",
          stateChanges: {
            platforms: { p7: { warmth: 3, resonance: 5 } },
            patterns: { analyzing: 3 }
          }
        },
        {
          text: "Resist all platforms and forge your own path",
          consequence: "platform_resistance",
          nextScene: "2-17d",
          stateChanges: {
            platforms: { forgotten: { accessible: true, warmth: 5 } },
            patterns: { independence: 5 }
          }
        }
      ]
    }
  },
  
  // Platform 1 acceptance
  "2-17a": {
    insertAfter: "2-17",
    scene: {
      id: "2-17a",
      type: "narration",
      text: "Platform 1 accepts you completely. The antiseptic smell fades, replaced by something cleaner - hope, maybe. Your reflection in the platform's glass shows you in scrubs you're not wearing. Nearby, exhausted medical students straighten slightly, as if your presence lends them strength. The platform floor warms exactly to body temperature beneath your feet."
    }
  },
  
  // Platform 3 acceptance
  "2-17b": {
    insertAfter: "2-17",
    scene: {
      id: "2-17b",
      type: "narration",
      text: "Platform 3 resonates with your creative potential. Blueprints appear on blank walls - not supernatural, just your mind finally seeing what was always possible. The broken bench you passed earlier has repaired itself, stronger than before. Tools you've never owned feel familiar in your hands. The sawdust in the air arranges itself into constellation patterns."
    }
  },
  
  // Platform 7 acceptance
  "2-17c": {
    insertAfter: "2-17",
    scene: {
      id: "2-17c",
      type: "narration",
      text: "Platform 7 stabilizes in your presence. The ERROR messages resolve into pure data streams - beautiful, logical, true. You understand the station's operating system now: every choice creates data, every person is a variable, every platform runs algorithms of purpose. The flickering stops. The sign reads simply: AUTHENTICATED."
    }
  },
  
  // Forgotten Platform creation
  "2-17d": {
    insertAfter: "2-17",
    scene: {
      id: "2-17d",
      type: "narration",
      text: "Your resistance creates something new. The Forgotten Platform materializes fully - not forgotten at all, just waiting for someone to refuse the predetermined options. The air tastes of copper pennies and possibility. Other resistant souls emerge from shadows, all building unprecedented futures. The platform doesn't warm or cool - it becomes exactly what you need it to be."
    }
  },
  
  // Environmental memory
  "3-1": {
    searchPattern: "The station has shifted overnight",
    enhanced: "The station has shifted overnight. The marble floors now have a faint red tint - Birmingham clay somehow seeping through impossible architecture. Your footprints from yesterday are still visible, glowing faintly. The station remembers your path, and where you helped someone, small flowers push through the floor cracks. Where you rushed past need, the tiles are slightly cracked."
  },
  
  // Birmingham platform fusion
  "3-2": {
    searchPattern: "The platform smells of hand sanitizer and hope",
    enhanced: "The platform smells of hand sanitizer and hope, that particular hospital combination of cleaning products and human determination. When you touch the platform railing, you feel a pulse - not electrical, but biological. The platform is alive with the accumulated compassion of every healthcare worker who ever doubted but continued anyway. Their exhaustion and dedication have soaked into the metal itself."
  },
  
  // Time crystallization around decisions
  "3-13": {
    searchPattern: "Samuel appears with forms",
    enhanced: "Samuel appears with forms that smell of fresh ink and possibility. As you reach for them, time slows perceptibly - the station giving you space to choose. Dust motes freeze mid-air. The sound of footsteps stretches into a drone. This decision matters, and the station ensures you feel its weight. The pen in your hand grows warm, eager to write futures."
  },
  
  // Final platform evolution
  "3-18": {
    searchPattern: "The final transformation brings all senses together",
    enhanced: "The final transformation brings all senses together. The station has learned you, and you've learned it. Platforms adjust their temperature as you pass. Broken things repair themselves in your peripheral vision. Time flows differently in each platform zone - faster where you're confident, slower where you need to think. You're not a passenger anymore. You're part of the station's operating system, and it responds to your intentions before you fully form them."
  }
};

// Function to add platform effects
function addPlatformEffects() {
  let enhancedCount = 0;
  let insertedCount = 0;
  
  // Track scenes to insert
  const toInsert = [];
  
  // First pass: enhance existing scenes
  storyData.chapters.forEach(chapter => {
    chapter.scenes.forEach(scene => {
      const effect = Object.values(platformEffects).find(e => 
        e.searchPattern && scene.text && scene.text.includes(e.searchPattern)
      );
      
      if (effect && effect.enhanced) {
        scene.text = effect.enhanced;
        enhancedCount++;
        console.log(`✓ Enhanced scene ${scene.id} with platform effects`);
      }
      
      // Check for scenes to insert after this one
      Object.entries(platformEffects).forEach(([key, effect]) => {
        if (effect.insertAfter === scene.id && effect.scene) {
          toInsert.push({
            chapterId: chapter.id,
            afterId: scene.id,
            scene: effect.scene
          });
        }
      });
    });
  });
  
  // Second pass: insert new scenes
  toInsert.forEach(item => {
    const chapter = storyData.chapters.find(c => c.id === item.chapterId);
    if (chapter) {
      const afterIndex = chapter.scenes.findIndex(s => s.id === item.afterId);
      if (afterIndex !== -1) {
        const exists = chapter.scenes.some(s => s.id === item.scene.id);
        if (!exists) {
          chapter.scenes.splice(afterIndex + 1, 0, item.scene);
          insertedCount++;
          console.log(`✓ Inserted platform effect scene ${item.scene.id}`);
        }
      }
    }
  });
  
  return { enhanced: enhancedCount, inserted: insertedCount };
}

// Main execution
console.log('Phase 3: Adding Subtle Platform Influence Effects...\n');

const result = addPlatformEffects();

if (result.enhanced > 0 || result.inserted > 0) {
  // Save the enhanced story
  fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));
  
  console.log(`\n✨ Phase 3 Progress:`);
  console.log(`   Enhanced ${result.enhanced} scenes with platform effects`);
  console.log(`   Inserted ${result.inserted} new effect scenes`);
  console.log('\n📊 Platform Effects Added:');
  console.log('   • Warmth/cooling based on player choices');
  console.log('   • Time dilation in decision moments');
  console.log('   • Physical synchronization (heartbeat, breathing)');
  console.log('   • Environmental memory of player actions');
  console.log('   • Platform resonance and acceptance mechanics');
  console.log('   • Subtle object responses (tools rattling, plants leaning)');
  console.log('   • Shadow and light changes based on helping/harming');
  console.log('   • Reality negotiation at platform intersections');
  console.log('\n✅ Platforms now feel alive and responsive without being overtly magical');
} else {
  console.log('\n⚠️ No changes made - checking for issues...');
}