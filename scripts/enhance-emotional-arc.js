const fs = require('fs');
const path = require('path');

// Read the story data
const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

let enhancementsCount = 0;

// Enhanced character backstories that drive career exploration
const characterEnhancements = {
  // Maya - Healthcare path with real stakes
  "2-3a2": {
    additionalText: "\n\nMaya looks away for a moment. 'You know what's crazy? My mom cleans rooms at UAB Hospital. Sees all these nurses making good money, helping people. She's been cleaning those same rooms for 15 years. I want to be the one in scrubs, not the uniform. That's why respiratory therapy makes sense - 2 years and I'm making $60K. I could buy her a car that actually starts in winter.'"
  },
  
  // Jordan - Trades path with family pride
  "2-3c2": {
    additionalText: "\n\nJordan's voice drops. 'My dad thinks I'm wasting my brain on trades. But my uncle? HVAC certification, makes $85K, no student loans. Bought a house at 25. Has his own truck. Meanwhile my cousin with the computer science degree? Still living at home, sending out resumes. Sometimes the smart choice isn't what looks smart to others.'"
  },
  
  // Devon - Technology path with self-made struggle
  "2-3b2": {
    additionalText: "\n\nDevon shows you his laptop screen - code everywhere. 'Taught myself from YouTube and freeCodeCamp. But every job posting wants a degree I can't afford. Then I found out Innovation Depot has this 12-week bootcamp. They actually help you get hired after. That's real. That's something I can do while keeping my night job.'"
  },
  
  // Alex - Creative/Business with Birmingham transformation
  "2-3d2": {
    additionalText: "\n\nAlex gestures at the station around you. 'This city killed my grandfather's steel job. Broke him. But now? Food trucks, breweries, design studios, startups. Birmingham's becoming something new. I don't want to mourn what we lost. I want to build what's next. Even if I have to start by working at a coffee shop downtown just to be near it all.'"
  }
};

// Add emotional stakes to the opening mystery
const openingEnhancement = {
  "1-1": {
    additionalText: "\n\nAt the bottom of the letter, in smaller text: 'You have one year before everything changes. Choose wisely. - Future You'"
  }
};

// Add the future self reveal based on path
const futureRevealScenes = [
  {
    "id": "3-29",
    "type": "dialogue",
    "speaker": "Samuel",
    "text": "Want to know who sent the letter? Look at what you chose. Healthcare paths? The letter came from you in scrubs, finally able to help your family. Tech paths? From you at a desk downtown, building Birmingham's future. Trade paths? From you with your own truck, your own business, your own life.\n\nThe letter didn't come from who you were. It came from who you're becoming."
  },
  {
    "id": "3-29-1",
    "type": "narration",
    "text": "The station starts to shimmer. For just a moment, you see yourself five years from now:\n\nStanding confident. Working in Birmingham. Making real money. Helping your family. Building something that matters.\n\nThat future you? They're waiting. They sent the letter to make sure you find them.\n\nOne choice at a time."
  }
];

// Apply character enhancements
Object.entries(characterEnhancements).forEach(([sceneId, enhancement]) => {
  storyData.chapters.forEach(chapter => {
    const scene = chapter.scenes.find(s => s.id === sceneId);
    if (scene && scene.text) {
      scene.text += enhancement.additionalText;
      enhancementsCount++;
      console.log(`✓ Enhanced ${scene.speaker || 'scene'} ${sceneId} with emotional backstory`);
    }
  });
});

// Apply opening enhancement
const chapter1 = storyData.chapters.find(ch => ch.id === 1);
if (chapter1) {
  const openingScene = chapter1.scenes.find(s => s.id === '1-1');
  if (openingScene) {
    openingScene.text += openingEnhancement["1-1"].additionalText;
    enhancementsCount++;
    console.log('✓ Added future self mystery to opening');
  }
}

// Add future reveal to Chapter 3
const chapter3 = storyData.chapters.find(ch => ch.id === 3);
if (chapter3) {
  // Insert after career profile, before final ending
  const profileIndex = chapter3.scenes.findIndex(s => s.id === '3-27-1');
  if (profileIndex !== -1) {
    // Update 3-27-1 to lead to reveal
    chapter3.scenes[profileIndex].nextScene = '3-29';
    
    // Add reveal scenes
    chapter3.scenes.push(...futureRevealScenes);
    
    // Connect reveal to final ending
    futureRevealScenes[futureRevealScenes.length - 1].nextScene = '3-28';
    
    enhancementsCount++;
    console.log('✓ Added future self reveal sequence');
  }
}

// Add personal stakes throughout
const personalStakes = [
  {
    sceneId: "2-5",
    text: "\n\nRemember: You have less than a year to figure this out. Every choice matters."
  },
  {
    sceneId: "3-1", 
    text: "\n\nThe letter's warning echoes: 'One year before everything changes.' You feel time pressing."
  }
];

personalStakes.forEach(stake => {
  storyData.chapters.forEach(chapter => {
    const scene = chapter.scenes.find(s => s.id === stake.sceneId);
    if (scene && scene.text) {
      scene.text += stake.text;
      enhancementsCount++;
      console.log(`✓ Added personal stakes to scene ${stake.sceneId}`);
    }
  });
});

// Save the updated story
fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));

console.log(`\n✅ Enhanced emotional arc with ${enhancementsCount} improvements`);
console.log('🎭 Emotional enhancements that drive career discovery:');
console.log('  - Maya: Mom cleans UAB rooms, wants to wear scrubs not uniform');
console.log('  - Jordan: Uncle success in trades vs cousin struggling with CS degree');
console.log('  - Devon: Self-taught coder needs bootcamp path not 4-year degree');
console.log('  - Alex: Grandfather lost steel job, wants to build new Birmingham');
console.log('  - Mystery: Letter from future self based on career choices');
console.log('  - Stakes: One year timeline creates urgency');
console.log('\n✨ All emotional elements directly support career exploration goals');