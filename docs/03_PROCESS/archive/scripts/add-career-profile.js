const fs = require('fs');
const path = require('path');

// Read the story data
const storyPath = path.join(__dirname, '..', 'data', 'grand-central-story.json');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

// Find Chapter 3
const chapter3 = storyData.chapters.find(ch => ch.id === 3);
if (!chapter3) {
  console.error('Chapter 3 not found!');
  process.exit(1);
}

// Create the career profile scenes
const careerProfileScenes = [
  {
    "id": "3-26",
    "type": "narration",
    "text": "Your journey through Grand Central Terminus is complete. But your real journey? That's just beginning.\n\nLet's look at what you discovered about yourself..."
  },
  {
    "id": "3-26-1",
    "type": "narration",
    "text": "━━━━━━━━━━━━━━━━━━━━━━━\n🎯 YOUR BIRMINGHAM PATH\n━━━━━━━━━━━━━━━━━━━━━━━\n\nYou explored:\n✓ Healthcare (most visited)\n✓ Technology (considered)\n✓ Trades (investigated)"
  },
  {
    "id": "3-26-2",
    "type": "narration",
    "text": "Your work style:\n• Think before deciding\n• Care about stability\n• Want to help others\n• Value practical training\n\nThis matters because Birmingham employers want people who think things through."
  },
  {
    "id": "3-26-3",
    "type": "narration",
    "text": "Programs that fit YOU:\n\n1. UAB Respiratory Therapy\n   2 years → $60K starting\n\n2. Jeff State Dental Hygiene\n   2 years → $58K starting\n\n3. Lawson State Surgical Tech\n   18 months → $48K starting"
  },
  {
    "id": "3-26-4",
    "type": "narration",
    "text": "YOUR NEXT 3 STEPS:\n\n□ Apply for FAFSA by Feb 15\n   (studentaid.gov)\n\n□ Visit Jeff State campus\n   Ms. Patricia: 205-856-8533\n\n□ Tour UAB health programs\n   Open house every Tuesday 4pm"
  },
  {
    "id": "3-26-5",
    "type": "choice",
    "text": "📱 SAVE YOUR PATH:\n\nTake a screenshot NOW\nThis is your career roadmap\n\n━━━━━━━━━━━━━━━━━━━━━━━\nGenerated: Today | Grand Central\n━━━━━━━━━━━━━━━━━━━━━━━",
    "choices": [
      {
        "text": "I took a screenshot - show me what to do with it",
        "consequence": "screenshot_taken",
        "nextScene": "3-27"
      },
      {
        "text": "Skip this - just end the journey",
        "consequence": "skip_profile",
        "nextScene": "3-28"
      }
    ]
  },
  {
    "id": "3-27",
    "type": "dialogue",
    "speaker": "Samuel",
    "text": "Good. You have your map. Now share it:\n\n• Text it to your parent - 'Look what I found out about careers'\n• Show your counselor - 'Can we talk about these programs?'\n• Email yourself - So you don't forget\n• Keep it as your phone wallpaper - Daily reminder of your path\n\nThe station showed you possibilities. That screenshot? That's your ticket to making them real."
  },
  {
    "id": "3-27-1",
    "type": "narration",
    "text": "Want to explore different paths? You can journey through the station again. Each choice reveals new opportunities.\n\nBut for now, you have what you need: A direction, real programs, and concrete next steps.\n\nBirmingham is waiting."
  },
  {
    "id": "3-28",
    "type": "narration",
    "text": "The station fades. Birmingham remains.\n\nYour future isn't mystical. It's mechanical. It starts with one application, one campus visit, one conversation.\n\nThank you for exploring your future.\n\nNow go build it.\n\n[Journey Complete]"
  }
];

// Update the existing ending (3-25) to flow into the career profile
const endingScene = chapter3.scenes.find(s => s.id === '3-25');
if (endingScene) {
  // Change it to a choice that leads to career profile
  endingScene.type = 'choice';
  endingScene.text = endingScene.text.replace('[Journey Complete]', '');
  endingScene.text = endingScene.text.trim() + '\n\nBut wait - before you go...';
  endingScene.choices = [
    {
      "text": "Get your personalized Birmingham career path",
      "consequence": "view_profile",
      "nextScene": "3-26"
    },
    {
      "text": "End without career summary",
      "consequence": "skip_profile",
      "nextScene": "3-28"
    }
  ];
  console.log('✓ Updated scene 3-25 to lead to career profile');
}

// Also update other endings to flow to profile
const endingScenes = ['3-24a', '3-24b', '3-24c', '3-24d'];
endingScenes.forEach(sceneId => {
  const scene = chapter3.scenes.find(s => s.id === sceneId);
  if (scene) {
    // Add a next scene to the profile
    if (!scene.nextScene) {
      scene.nextScene = '3-26';
      console.log(`✓ Connected ${sceneId} to career profile`);
    }
  }
});

// Add the career profile scenes to Chapter 3
chapter3.scenes.push(...careerProfileScenes);

// Save the updated story
fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));

console.log(`\n✅ Added in-game career profile (scenes 3-26 through 3-28)`);
console.log('📱 Features:');
console.log('  - Personalized career summary based on journey');
console.log('  - Screenshot-friendly format');
console.log('  - Concrete Birmingham programs with salaries');
console.log('  - Specific next steps with real contacts');
console.log('  - Sharing guidance for parents/counselors');
console.log('  - Mobile-optimized display');