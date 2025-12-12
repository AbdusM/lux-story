const fs = require('fs');
const path = require('path');

// Read the story data
const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// Character crisis moments - relatable breaking points
const characterCrisis = {
  // Maya's medical school burnout
  "2-3a2": {
    original: "You notice the warmth too? Platform 1's been glowing differently since... whatever you did during that frozen moment.",
    enhanced: "You notice the warmth too? Platform 1's been glowing differently since... whatever you did during that frozen moment.\n\nLook, can I tell you something? I failed my anatomy exam last week. First time I've ever failed anything. My parents called it 'a minor setback.' They don't know I threw up before the test because I couldn't remember if the radial nerve runs over or under the supinator. Four years of straight A's, and suddenly I can't even hold a scalpel without my hand shaking."
  },
  
  // Maya's deeper crisis
  "2-3a3": {
    insertAfter: "2-3a2",
    type: "dialogue",
    speaker: "Maya",
    text: "The worst part? When I'm building these little robots, my hands are perfectly steady. No shaking. No doubt. Just... certainty. But that's not what my parents sacrificed everything for. They didn't work three jobs so I could play with circuits. They need me to be a doctor. Birmingham needs me to be a doctor. So why do I feel like I'm drowning every time I walk into the hospital?"
  },
  
  // Devon's impostor syndrome
  "2-3c2": {
    original: "I've been mapping the patterns. Look - everyone who helps others, their platforms warm up. The metal actually gets warmer to the touch, I've measured it. Everyone who rushes past need? Their platforms dim, and the air around them drops by exactly 3.7 degrees Celsius.",
    enhanced: "I've been mapping the patterns. Look - everyone who helps others, their platforms warm up. The metal actually gets warmer to the touch, I've measured it. Everyone who rushes past need? Their platforms dim, and the air around them drops by exactly 3.7 degrees Celsius.\n\nYou want to know something pathetic? I've been pretending to understand systems for three years. Everyone thinks I'm this brilliant process engineer, but I just... see patterns. I don't know the theory. Never finished my degree. I'm a maintenance guy who reads too much. Last week, they asked me to present at Innovation Depot, and I almost ran. Just packed everything and ran. Because eventually they'll figure out I'm just really good at pretending."
  },
  
  // Devon's fear moment
  "2-3c3": {
    insertAfter: "2-3c2",
    type: "dialogue", 
    speaker: "Devon",
    text: "But this station? It doesn't care about my degree. It responds to what I actually do, not what credentials I have. For the first time, I'm not terrified someone will ask for my qualifications. Maybe that's why I can't leave."
  },
  
  // Jordan's work-life collapse
  "2-7a2": {
    original: "Numbers don't lie. People do, markets do, but clean data? Never. That's why I trust it more than anything else.",
    enhanced: "Numbers don't lie. People do, markets do, but clean data? Never. That's why I trust it more than anything else.\n\nMy girlfriend left last month. Said I loved spreadsheets more than her. The thing is... she wasn't wrong. I missed her birthday because of a data migration. Missed Valentine's Day debugging code. Missed every dinner for six months. She said I was having an affair with SQL queries, and I actually laughed because it was technically accurate. I haven't told anyone she left. My status still says 'in a relationship' because changing it would require admitting I chose Python over a person."
  },
  
  // Jordan's realization
  "2-7a3": {
    insertAfter: "2-7a2",
    type: "dialogue",
    speaker: "Jordan",
    text: "The funny thing? The data shows that people who balance work and relationships are 47% more productive. I have the studies. I made the graphs. I just... couldn't apply it to myself. Platform 7 keeps showing me these patterns about human connection, and every algorithm I run says the same thing: I optimized for the wrong variable."
  },
  
  // Alex's funding crisis
  "2-9a": {
    original: "Everything you see here? I funded it myself. Credit cards, mostly. The banks think I'm crazy.",
    enhanced: "Everything you see here? I funded it myself. Credit cards, mostly. The banks think I'm crazy.\n\nSouthern Company rejected my proposal yesterday. Fifth rejection this month. They said renewable energy isn't 'regionally appropriate' for Alabama. Do you know how that feels? To have solutions literally growing in your hands, and have someone in a suit tell you Birmingham isn't ready? My credit score is 420. I eat ramen twice a day. My parents think I'm an intern somewhere respectable. I can't tell them I'm $47,000 in debt to grow plants that could power the city."
  },
  
  // Alex's breaking point
  "2-9a2": {
    insertAfter: "2-9a",
    type: "dialogue",
    speaker: "Alex",
    text: "Last week, I stood on the 20th Street bridge. Not to jump, just to... look at the city lights and wonder if I'm delusional. Every sustainable energy conference is in California or Amsterdam. Nobody believes Alabama can lead in green tech. Maybe they're right. Maybe I'm just too stubborn to admit I picked the wrong city for the right dream."
  },
  
  // Samuel's past failure
  "2-11": {
    insertAfter: "2-10",
    type: "narration",
    text: "Samuel appears suddenly, his conductor's watch stopped at 11:47 - the same time it always shows."
  },
  
  "2-11a": {
    insertAfter: "2-11",
    type: "dialogue",
    speaker: "Samuel",
    text: "You want to know why I'm here? Why I guide people through their crossroads? Because I stood at my own Platform 7 thirty years ago. Had a letter just like yours. Was supposed to become a surgeon. Had the hands for it, the minds for it, the acceptance letter from Johns Hopkins."
  },
  
  "2-11b": {
    insertAfter: "2-11a",
    type: "dialogue",
    speaker: "Samuel",
    text: "But I was scared. Terrified, actually. Of the responsibility. Of holding lives literally in my hands. So I got on the wrong train. Became an insurance adjuster. Safe. Predictable. No one dies if you make a mistake on a claim form. My daughter needed surgery last year. The surgeon who saved her? He was supposed to be me. That's why my watch stopped at 11:47. The moment I chose fear over purpose."
  },
  
  // Player's decision paralysis
  "2-12": {
    insertAfter: "2-11b",
    type: "choice",
    text: "The weight of Samuel's confession hangs in the air. You feel your own crisis building - every platform calls to you, but choosing one means abandoning others. The station spins slightly, or maybe that's just your vertigo.",
    choices: [
      {
        text: "\"I can't choose. Every decision feels like betraying another version of myself.\"",
        consequence: "paralysis_confession",
        nextScene: "2-12a",
        stateChanges: {
          patterns: { patience: -1, analyzing: 2 },
          mysteries: { station_nature: "understanding" }
        }
      },
      {
        text: "\"What if I'm like you? What if I choose wrong and regret it forever?\"",
        consequence: "fear_confession",
        nextScene: "2-12b",
        stateChanges: {
          patterns: { rushing: -2, patience: 1 },
          relationships: { samuel: { trust: 5 } }
        }
      },
      {
        text: "\"Maybe the platform doesn't matter. Maybe it's all the same trap.\"",
        consequence: "nihilism_confession",
        nextScene: "2-12c",
        stateChanges: {
          patterns: { independence: 3, exploring: -1 },
          platforms: { p7: { accessible: false } }
        }
      },
      {
        text: "[Break down silently, overwhelmed by the weight of potential futures]",
        consequence: "breakdown",
        nextScene: "2-12d",
        stateChanges: {
          quiet_hour: { potential: true },
          patterns: { patience: 3, helping: -1 }
        }
      }
    ]
  },
  
  // Resolution scenes
  "2-12a": {
    insertAfter: "2-12",
    type: "dialogue",
    speaker: "You",
    text: "I've been standing here for what feels like hours, and every choice feels like closing a door I'll never be able to open again. Maya's torn between medicine and robotics. Devon's terrified of being exposed. Jordan chose data over love. Alex might be delusional. And you... you chose safety over purpose. How do I know I won't make the same mistakes?"
  },
  
  "2-12a2": {
    insertAfter: "2-12a",
    type: "dialogue",
    speaker: "Samuel",
    text: "You don't. That's the terrible, beautiful truth. But you know what I've learned, watching thousands pass through here? The ones who try to keep every door open never walk through any of them. The ones who choose, even imperfectly, at least move forward. And movement, even in the wrong direction, teaches you something. Paralysis teaches you nothing."
  },
  
  "2-12b": {
    insertAfter: "2-12",
    type: "dialogue",
    speaker: "You",
    text: "Your watch stopped at 11:47. Mine might stop too. What if I get on the wrong train and spend thirty years wondering what Platform 7 would have been? What if I'm you, telling this story to someone else someday?"
  },
  
  "2-12b2": {
    insertAfter: "2-12b",
    type: "dialogue",
    speaker: "Samuel",
    text: "Then you'll be here, helping them choose better. That's not the worst fate. The worst fate is never choosing at all. Besides, look at my watch again."
  },
  
  "2-12b3": {
    insertAfter: "2-12b2",
    type: "narration",
    text: "He holds up his watch. For the first time, the second hand ticks forward. 11:48."
  },
  
  "2-12b4": {
    insertAfter: "2-12b3",
    type: "dialogue",
    speaker: "Samuel",
    text: "It started moving again when I told you the truth. Thirty years of stopped time, and honesty was all it took. Maybe Platform 7 isn't about choosing right. Maybe it's about choosing honestly."
  },
  
  "2-12c": {
    insertAfter: "2-12",
    type: "dialogue",
    speaker: "You",
    text: "What if none of this matters? What if Platform 1 and Platform 7 and the Forgotten Platform all lead to the same place - a life of wondering if you chose right? What if the station is just an elaborate way of making us think we have control when we don't?"
  },
  
  "2-12c2": {
    insertAfter: "2-12c",
    type: "narration",
    text: "The station shudders at your words. Platform signs flicker simultaneously. For a moment, all of them show the same thing: ERROR."
  },
  
  "2-12c3": {
    insertAfter: "2-12c2",
    type: "dialogue",
    speaker: "Maya",
    text: "You're right and wrong. The platforms aren't different destinations - they're different approaches to the same destination. We all end up in Birmingham, working, living, struggling. But how we get there, why we go there, who we become there... that's what the platforms are really about."
  },
  
  "2-12d": {
    insertAfter: "2-12",
    type: "narration",
    text: "You sink to the floor, back against a pillar. The tears come suddenly, unexpectedly. Not sadness exactly, but overwhelm. The weight of potential, the fear of waste, the pressure of choosing correctly - it all crashes down at once."
  },
  
  "2-12d2": {
    insertAfter: "2-12d",
    type: "narration",
    text: "One by one, they sit with you. Maya on your left, her robot chirping softly. Devon on your right, his tools quiet for once. Jordan cross-legged in front, laptop closed. Alex behind, a small plant in their hands. Samuel standing watch."
  },
  
  "2-12d3": {
    insertAfter: "2-12d2",
    type: "dialogue",
    speaker: "Maya",
    text: "We've all been where you are. That's why we're still here. Not lost - just taking our time to choose honestly."
  },
  
  "2-12d4": {
    insertAfter: "2-12d3",
    type: "narration",
    text: "The station responds to your collective vulnerability. Platform signs stop flickering. The temperature equalizes. For the first time, everything feels... possible."
  }
};

// Function to enhance scenes with character crisis moments
function addCharacterCrisis() {
  let enhancedCount = 0;
  let insertedCount = 0;
  
  // First pass: Update existing scenes
  storyData.chapters.forEach(chapter => {
    chapter.scenes.forEach((scene, index) => {
      const crisis = characterCrisis[scene.id];
      if (crisis && crisis.original) {
        if (scene.text === crisis.original || scene.text?.includes(crisis.original.substring(0, 50))) {
          scene.text = crisis.enhanced;
          enhancedCount++;
          console.log(`✓ Enhanced scene ${scene.id} with character crisis`);
        }
      }
    });
  });
  
  // Second pass: Insert new scenes
  storyData.chapters.forEach(chapter => {
    let insertions = [];
    chapter.scenes.forEach((scene, index) => {
      const crisis = characterCrisis[scene.id];
      if (crisis && crisis.insertAfter) {
        // This is a new scene to insert
        insertions.push({ afterId: scene.id, index: index + 1, crisis: crisis });
      }
    });
    
    // Insert scenes in reverse order to maintain indices
    insertions.reverse().forEach(insertion => {
      const newScene = {
        id: insertion.crisis.insertAfter === insertion.afterId ? 
            `${insertion.afterId.match(/(\d+-\d+[a-z]?)/)[1]}${insertedCount + 1}` : 
            insertion.crisis.insertAfter,
        type: insertion.crisis.type,
        speaker: insertion.crisis.speaker,
        text: insertion.crisis.text,
        choices: insertion.crisis.choices
      };
      
      // Check if scene already exists
      const exists = chapter.scenes.some(s => s.id === newScene.id);
      if (!exists) {
        chapter.scenes.splice(insertion.index, 0, newScene);
        insertedCount++;
        console.log(`✓ Inserted new crisis scene ${newScene.id}`);
      }
    });
  });
  
  return { enhanced: enhancedCount, inserted: insertedCount };
}

// Main execution
console.log('Phase 2: Adding Character Crisis Moments...\n');

const result = addCharacterCrisis();

if (result.enhanced > 0 || result.inserted > 0) {
  // Save the enhanced story
  fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));
  
  console.log(`\n✨ Phase 2 Progress:`);
  console.log(`   Enhanced ${result.enhanced} scenes with character breakdowns`);
  console.log(`   Inserted ${result.inserted} new crisis scenes`);
  console.log('\n📊 Character Crisis Coverage:');
  console.log('   • Maya: Medical school burnout, family pressure, failed exam');
  console.log('   • Devon: Impostor syndrome, no degree, fear of exposure');
  console.log('   • Jordan: Lost relationship to work, chose code over love');
  console.log('   • Alex: Funding rejections, $47K debt, regional discrimination');
  console.log('   • Samuel: Past regret, chose fear over purpose, stopped time');
  console.log('   • Player: Decision paralysis, fear of wrong choice, overwhelm');
  console.log('\n✅ Relatable human moments added to all major characters');
} else {
  console.log('\n⚠️ No scenes were updated - checking for conflicts...');
}