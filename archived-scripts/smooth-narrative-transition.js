const fs = require('fs');
const path = require('path');

// Read the story data
const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// Find scenes that need smoothing
let changesCount = 0;

// Update the jarring transition in Chapter 3
const chapter3 = storyData.chapters.find(ch => ch.id === 3);
if (chapter3) {
  // Find scene 3-18 (the "Clock in" harsh reality scene)
  const scene318 = chapter3.scenes.find(s => s.id === '3-18');
  if (scene318 && scene318.text.includes("The station? It was never magic.")) {
    scene318.text = scene318.text.replace(
      "The station? It was never magic. It was Birmingham showing you what was always here: multiple paths, real choices, a city rebuilding itself one person at a time.",
      "The station? Maybe it was magic, maybe it wasn't. Doesn't matter. What matters is it showed you what Birmingham always had: multiple paths, real choices, a city rebuilding itself one person at a time. The magic was you taking time to see it."
    );
    changesCount++;
    console.log('✓ Softened scene 3-18 transition');
  }

  // Add a bridging scene before the harsh reality check
  const bridgeScene = {
    "id": "3-17b",
    "type": "dialogue",
    "speaker": "Samuel",
    "text": "You're wondering if any of this was real, aren't you? The station appearing overnight, me knowing your future, the platforms that shouldn't exist.\n\nHere's the truth: Birmingham has always been a place of transformation. From iron to medicine, from segregation to innovation. The station? It's been here all along - in every career center, every mentor, every program waiting for someone to walk through the door.\n\nI'm just a conductor. But Birmingham? Birmingham is the real magic. It transforms people who are ready to transform themselves."
  };

  // Insert the bridge scene after 3-17
  const scene317Index = chapter3.scenes.findIndex(s => s.id === '3-17');
  if (scene317Index !== -1) {
    // Update 3-17 to lead to the bridge
    const scene317 = chapter3.scenes[scene317Index];
    if (scene317.choices) {
      scene317.choices.forEach(choice => {
        if (choice.nextScene === '3-18') {
          choice.nextScene = '3-17b';
        }
      });
    }
    
    // Insert bridge scene
    chapter3.scenes.splice(scene317Index + 1, 0, bridgeScene);
    
    // Make bridge lead to 3-18
    bridgeScene.nextScene = '3-18';
    
    changesCount++;
    console.log('✓ Added bridging scene 3-17b with Samuel');
  }

  // Smooth the transition from Chapter 2 to Chapter 3
  const chapter2 = storyData.chapters.find(ch => ch.id === 2);
  if (chapter2) {
    const lastScene2 = chapter2.scenes[chapter2.scenes.length - 1];
    if (lastScene2 && lastScene2.text && lastScene2.text.includes("Your midnight has arrived")) {
      lastScene2.text = lastScene2.text.replace(
        "Time resumes. Your midnight has arrived - not as an ending, but as a beginning.",
        "Time shifts. The station begins to feel less mystical, more familiar. Like you're starting to see Birmingham underneath the magic. Your midnight has arrived - not as an ending, but as a morning shift beginning."
      );
      changesCount++;
      console.log('✓ Smoothed Chapter 2 to 3 transition');
    }
  }

  // Update Maya's practical transition
  const mayaTransition = chapter3.scenes.find(s => s.speaker === 'Maya' && s.id === '3-21');
  if (mayaTransition) {
    const originalStart = "Listen, I've been where you are. Here's the real talk:";
    const smootherStart = "Listen, I know this whole station thing feels weird. But forget the magic stuff for a second. Here's the real talk about real programs:";
    
    mayaTransition.text = mayaTransition.text.replace(originalStart, smootherStart);
    changesCount++;
    console.log('✓ Smoothed Maya\'s reality check');
  }

  // Add a transition in Samuel's final practical advice
  const samuelFinal = chapter3.scenes.find(s => s.speaker === 'Samuel' && s.id === '3-20');
  if (samuelFinal) {
    const originalStart = "Alright, let's get practical. No more mystical station stuff.";
    const smootherStart = "Alright, the station showed you possibilities. Now let's talk about how to make them real. The mystical part? That was just to get you to pay attention. The practical part? That's your actual life.";
    
    samuelFinal.text = samuelFinal.text.replace(originalStart, smootherStart);
    changesCount++;
    console.log('✓ Smoothed Samuel\'s final transition');
  }

  // Update the text message scene to feel less jarring
  const textScene = chapter3.scenes.find(s => s.id === '3-22');
  if (textScene) {
    const original = "Your phone buzzes. A text appears - somehow from the station itself:";
    const smoother = "Your phone buzzes. Maybe it's the station, maybe it's just good timing. Doesn't matter. The information is real:";
    
    textScene.text = textScene.text.replace(original, smoother);
    changesCount++;
    console.log('✓ Smoothed phone notification transition');
  }

  // Add a reflection moment in the early Chapter 3
  const reflectionScene = {
    "id": "3-0b",
    "type": "narration",
    "text": "The station feels different in Chapter 3. Less mystical, more... Birmingham. The brass still gleams, but now you notice it's the same brass as the doorknobs at City Hall. The platforms still stretch impossibly far, but they end at familiar streets: 20th, University, Richard Arrington.\n\nMaybe the magic was always just Birmingham seen through fresh eyes. Or maybe Birmingham itself is the magic - a city that refuses to be what others expect."
  };

  // Find the first scene of Chapter 3 and add this after
  const firstScene3Index = chapter3.scenes.findIndex(s => s.id === '3-1');
  if (firstScene3Index !== -1) {
    chapter3.scenes.splice(firstScene3Index + 1, 0, reflectionScene);
    changesCount++;
    console.log('✓ Added reflection scene in early Chapter 3');
  }
}

// Save the updated story
fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));

console.log(`\n✅ Smoothed ${changesCount} narrative transitions`);
console.log('🌉 Changes made:');
console.log('  - Added Samuel bridge explaining station/Birmingham connection');
console.log('  - Softened "never magic" to "maybe magic, doesn\'t matter"');
console.log('  - Connected mystical opening to practical ending through reflection');
console.log('  - Made characters acknowledge the shift explicitly');
console.log('  - Maintained Birmingham focus while respecting the journey');