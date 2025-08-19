const fs = require('fs');
const path = require('path');

// Read the story data
const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// New platform effect scenes to insert
const newPlatformScenes = [
  // Platform convergence effects
  {
    afterId: "2-14",
    scene: {
      id: "2-15",
      type: "narration",
      text: "Where the platforms meet, reality becomes negotiable. Coffee cups refill themselves halfway. Broken shoelaces retie. Medical textbooks flip to the exact page needed. It's not magic - it's the station responding to genuine need, to authentic purpose. The air shimmers like heat waves, but the temperature is perfect."
    }
  },
  
  // Choice consequence manifestation
  {
    afterId: "2-15",
    scene: {
      id: "2-16",
      type: "narration",
      text: "Your recent choices manifest physically. If you've been helping others, your shadow casts warm light. If you've been analyzing, equations float in dust motes around you. If you've been building, tools in nearby toolboxes rattle eagerly when you pass. The station remembers everything, rewards authenticity, punishes pretense."
    }
  },
  
  // Platform acceptance scenes already inserted as 2-17, add the branches
  {
    afterId: "2-17",
    scene: {
      id: "2-17a",
      type: "narration",
      text: "Platform 1 accepts you completely. The antiseptic smell fades, replaced by something cleaner - hope, maybe. Your reflection in the platform's glass shows you in scrubs you're not wearing. Nearby, exhausted medical students straighten slightly, as if your presence lends them strength. The platform floor warms exactly to body temperature beneath your feet."
    }
  },
  
  {
    afterId: "2-17a",
    scene: {
      id: "2-17b",
      type: "narration",
      text: "Platform 3 resonates with your creative potential. Blueprints appear on blank walls - not supernatural, just your mind finally seeing what was always possible. The broken bench you passed earlier has repaired itself, stronger than before. Tools you've never owned feel familiar in your hands. The sawdust in the air arranges itself into constellation patterns."
    }
  },
  
  {
    afterId: "2-17b",
    scene: {
      id: "2-17c",
      type: "narration",
      text: "Platform 7 stabilizes in your presence. The ERROR messages resolve into pure data streams - beautiful, logical, true. You understand the station's operating system now: every choice creates data, every person is a variable, every platform runs algorithms of purpose. The flickering stops. The sign reads simply: AUTHENTICATED."
    }
  },
  
  {
    afterId: "2-17c",
    scene: {
      id: "2-17d",
      type: "narration",
      text: "Your resistance creates something new. The Forgotten Platform materializes fully - not forgotten at all, just waiting for someone to refuse the predetermined options. The air tastes of copper pennies and possibility. Other resistant souls emerge from shadows, all building unprecedented futures. The platform doesn't warm or cool - it becomes exactly what you need it to be."
    }
  },
  
  // Time crystallization effects
  {
    afterId: "2-12d4",
    scene: {
      id: "2-18",
      type: "narration",
      text: "The station's response to vulnerability is immediate and physical. The platforms stop competing for your attention. Instead, they harmonize - each one glowing at its own frequency, creating a chord that makes your bones hum. Time flows like honey, giving you all the space you need to be uncertain."
    }
  },
  
  // Environmental memory in Chapter 3
  {
    afterId: "3-1",
    scene: {
      id: "3-1a",
      type: "narration",
      text: "Your footprints from yesterday still glow faintly on the marble. Where you helped someone, tiny cracks in the floor have filled with something that looks like gold. Where you rushed past need, the tiles remain slightly cold to the touch. The station has perfect memory, and it's teaching you through physical feedback."
    }
  },
  
  // Platform breathing effect
  {
    afterId: "3-5",
    scene: {
      id: "3-5a",
      type: "narration",
      text: "The data center's servers adjust their frequency when you enter - not dramatically, just enough that the vibration stops making your teeth ache. Jordan notices immediately. 'They've never done that before. Usually, newcomers need earplugs. But the machines... they recognize something in you.'"
    }
  },
  
  // Plant response effect
  {
    afterId: "3-9",
    scene: {
      id: "3-9a",
      type: "narration",
      text: "Alex's plants respond to your emotional state. When you express doubt, they droop slightly. When you show interest, new shoots appear. It's subtle - so subtle Alex hasn't noticed yet. But the greenhouse knows you're trying to grow something too, even if you don't know what yet."
    }
  },
  
  // Final integration effect
  {
    afterId: "3-18",
    scene: {
      id: "3-18a",
      type: "narration",
      text: "You place your hand on Platform 7's railing one last time. It's neither warm nor cold now - it's exactly your temperature, as if you and the platform have reached equilibrium. The station isn't mysterious anymore. It's just a place that responds to authentic intention. And you? You're someone who finally knows their own temperature."
    }
  }
];

// Enhanced descriptions for existing scenes
const enhancedEffects = {
  "1-5a": {
    searchFor: "Platform 3's lights shift from harsh fluorescent to warm amber. Other travelers begin gravitating toward your bench",
    replaceWith: "Platform 3's lights shift from harsh fluorescent to warm amber. The bench you fixed seems to hum slightly, a barely perceptible vibration of approval. Other travelers begin gravitating toward your bench, as if it's become a safe harbor. Small things nearby - a loose tile, a flickering light - stabilize in your presence."
  },
  
  "1-5c": {
    searchFor: "cold industrial glare. The elderly man's bags split",
    replaceWith: "cold industrial glare. The temperature drops exactly where your shadow falls, as if the platform remembers your choice to rush past. The elderly man's bags split"
  },
  
  "1-7d": {
    searchFor: "The station... breathes.",
    replaceWith: "The station... breathes.\n\nYou feel it as a physical sensation - the walls expanding and contracting so slowly you'd miss it if you weren't sitting still. The clock's second hand visibly slows, each tick stretching longer than the last."
  },
  
  "1-8-quiet": {
    searchFor: "absolute silence except for your own heartbeat",
    replaceWith: "absolute silence except for your own heartbeat, which seems to echo from the station walls themselves, as if the building has adopted your rhythm"
  },
  
  "1-10c": {
    searchFor: "she grabs the threads to Platforms 1 and 3",
    replaceWith: "she grabs the threads to Platforms 1 and 3 - they feel like warm wire in her hands, pulsing with possibility"
  },
  
  "1-11": {
    searchFor: "Platform 7½ (if created) draws curious crowds",
    replaceWith: "Platform 7½ (if created) draws curious crowds. The new platform seems to shimmer, not quite solid yet, waiting for more architects to make it permanent"
  }
};

// Function to implement platform effects
function completePlatformEffects() {
  let insertedCount = 0;
  let enhancedCount = 0;
  
  // Insert new scenes
  newPlatformScenes.forEach(item => {
    const chapter = storyData.chapters.find(c => 
      c.scenes.some(s => s.id === item.afterId)
    );
    
    if (chapter) {
      const afterIndex = chapter.scenes.findIndex(s => s.id === item.afterId);
      if (afterIndex !== -1) {
        const exists = chapter.scenes.some(s => s.id === item.scene.id);
        if (!exists) {
          chapter.scenes.splice(afterIndex + 1, 0, item.scene);
          insertedCount++;
          console.log(`✓ Inserted ${item.scene.id} after ${item.afterId}`);
        }
      }
    }
  });
  
  // Enhance existing scenes
  storyData.chapters.forEach(chapter => {
    chapter.scenes.forEach(scene => {
      Object.entries(enhancedEffects).forEach(([sceneId, effect]) => {
        if (scene.text && scene.text.includes(effect.searchFor)) {
          scene.text = scene.text.replace(effect.searchFor, effect.replaceWith);
          enhancedCount++;
          console.log(`✓ Enhanced scene with platform effects`);
        }
      });
    });
  });
  
  return { inserted: insertedCount, enhanced: enhancedCount };
}

// Main execution
console.log('Phase 3: Completing Platform Influence Effects...\n');

const result = completePlatformEffects();

if (result.inserted > 0 || result.enhanced > 0) {
  // Save the enhanced story
  fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));
  
  console.log(`\n✨ Phase 3 Complete!`);
  console.log(`   Inserted ${result.inserted} new platform effect scenes`);
  console.log(`   Enhanced ${result.enhanced} existing scenes`);
  console.log('\n📊 Subtle Platform Effects Implemented:');
  console.log('   • Platforms warm/cool based on authentic choices');
  console.log('   • Time dilation during important decisions');
  console.log('   • Objects respond to player presence (tools rattle, plants lean)');
  console.log('   • Environmental memory (golden cracks where you helped)');
  console.log('   • Physical synchronization (heartbeat matching, breathing)');
  console.log('   • Reality negotiation at platform intersections');
  console.log('   • Shadow/light changes based on helping patterns');
  console.log('   • Platform acceptance creates physical sensations');
  console.log('\n✅ Effects are subtle, grounded, and reinforce player agency');
} else {
  console.log('\n⚠️ No changes made');
}