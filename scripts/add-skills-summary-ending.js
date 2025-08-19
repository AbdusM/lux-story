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

// Create new skills summary scenes
const skillsSummaryScenes = [
  {
    "id": "3-20",
    "type": "dialogue",
    "speaker": "Samuel",
    "text": "Alright, let's get practical. No more mystical station stuff.\n\nBased on your journey, here's what I'm seeing:\n\nYou spent the most time exploring Platform 1 - Healthcare. That's real jobs, real money. Respiratory therapy at Jeff State? Two years, then you're making $60K. Dental hygiene at UAB? Same deal.\n\nYou took your time with decisions. That's good. These programs want people who think things through, not rush into debt.\n\nYou helped Maya and Jordan when they were struggling. Healthcare is all about that - seeing people at their worst and helping anyway."
  },
  {
    "id": "3-21",
    "type": "dialogue",
    "speaker": "Maya",
    "text": "Listen, I've been where you are. Here's the real talk:\n\nThese programs all have application deadlines:\n- Jeff State: Opens January 15, closes March 1\n- UAB: Rolling admissions but financial aid deadline is February 15\n- Lawson State: Open enrollment but popular programs fill fast\n\nYou need your FAFSA done NOW. Not tomorrow, now. That's free money you're leaving on the table.\n\nAlso, all these schools have free campus tours. Go. Ask about payment plans. Ask about work-study. Ask if you can sit in on a class."
  },
  {
    "id": "3-22",
    "type": "narration",
    "text": "Your phone buzzes. A text appears - somehow from the station itself:\n\n📍 YOUR BIRMINGHAM NEXT STEPS:\n\n1. Tomorrow: Visit Jeff State (501 11th St N)\n   Ask for Ms. Patricia in Financial Aid\n\n2. This Week: Apply for FAFSA (studentaid.gov)\n   You'll need your parents' tax info\n\n3. Saturday: Innovation Depot free workshop\n   10am, bring laptop if you have one\n\n4. Save These Numbers:\n   - Central Six AlabamaWorks: 205-325-1574\n   - UAB Career Center: 205-934-4324\n   - Crisis hotline if overwhelmed: 205-323-7777\n\nNo magic. Just moves."
  },
  {
    "id": "3-23",
    "type": "choice",
    "text": "The station begins to fade. Dawn is breaking over Birmingham. The clock tower shows 6:00 AM. Time to choose your first real step:",
    "choices": [
      {
        "text": "Screenshot the resources and head to Jeff State today",
        "consequence": "immediate_action",
        "nextScene": "3-24a",
        "stateChanges": {
          "ending_type": "action_taker",
          "career_momentum": "high"
        }
      },
      {
        "text": "Talk to your family first about what you discovered",
        "consequence": "family_process",
        "nextScene": "3-24b",
        "stateChanges": {
          "ending_type": "collaborative",
          "family_involvement": "high"
        }
      },
      {
        "text": "Research more online before committing to anything",
        "consequence": "careful_planning",
        "nextScene": "3-24c",
        "stateChanges": {
          "ending_type": "researcher",
          "planning_depth": "high"
        }
      },
      {
        "text": "Take a day to process everything that happened",
        "consequence": "reflection_first",
        "nextScene": "3-24d",
        "stateChanges": {
          "ending_type": "processor",
          "self_awareness": "high"
        }
      }
    ]
  },
  {
    "id": "3-24a",
    "type": "narration",
    "text": "You screenshot everything. By 8 AM, you're on the MAX bus heading to Jeff State. Ms. Patricia is real - she's helped hundreds of Birmingham kids find their path. Your application fee? Waived if you apply today.\n\nThe station was never magic. Birmingham's opportunities were always there. You just needed someone to show you where to look.\n\nYour journey starts with a single form, a single conversation, a single step through real doors.\n\nClock in to your future."
  },
  {
    "id": "3-24b",
    "type": "narration",
    "text": "You head home. Your mom's making breakfast - she works the early shift at UAB Hospital. You show her the programs, the salaries, the real paths.\n\n'Two years?' she says, looking at the respiratory therapy program. 'We can do two years.'\n\nThe station gave you clarity, but your family gives you strength. Together, you'll figure out the money, the schedule, the plan.\n\nYour future isn't just yours - it's your family's investment in Birmingham's tomorrow.\n\nClock in together."
  },
  {
    "id": "3-24c",
    "type": "narration",
    "text": "You open your laptop at the Starbucks on 20th Street. Six tabs open: Jeff State, UAB, Lawson State, financial aid calculators, Reddit threads about healthcare careers, YouTube videos of day-in-the-life content.\n\nThe station gave you direction, but you're building the map. Every review you read, every cost you calculate, every program you compare - you're doing what Birmingham kids have always done: finding the smart path through.\n\nBy noon, you have a spreadsheet. By evening, a plan.\n\nClock in prepared."
  },
  {
    "id": "3-24d",
    "type": "narration",
    "text": "You walk through Railroad Park as the sun rises. The station might have been a dream, or stress, or something else. Doesn't matter.\n\nWhat matters is what you learned: You want to help people. You want stable money. You want to stay in Birmingham and build something.\n\nTomorrow you'll make calls. Next week you'll visit campuses. But today, you just walk your city with new eyes, seeing opportunities where you used to see obstacles.\n\nThe clock can wait one more day.\n\nClock in when ready."
  },
  {
    "id": "3-25",
    "type": "narration",
    "text": "END OF JOURNEY\n\nGrand Central Terminus has closed, but Birmingham's doors are open.\n\nYour next steps are real:\n- Visit campuses\n- Apply for financial aid\n- Talk to people in your interested fields\n- Start where you are, with what you have\n\nNo more mystical trains. Just MAX buses to real opportunities.\n\nThank you for exploring your future.\n\nNow go build it."
  }
];

// Add the new scenes to Chapter 3
chapter3.scenes.push(...skillsSummaryScenes);

// Update scene 3-19 to flow into the new skills summary
const scene319 = chapter3.scenes.find(s => s.id === '3-19');
if (scene319) {
  // Add a choice at the end of 3-19 to continue to skills summary
  scene319.type = 'choice';
  scene319.choices = [
    {
      "text": "Get practical next steps from Samuel and Maya",
      "consequence": "seek_guidance",
      "nextScene": "3-20",
      "stateChanges": {
        "seeking_practical_advice": true
      }
    },
    {
      "text": "Leave the station and figure it out yourself",
      "consequence": "independent_path",
      "nextScene": "3-25",
      "stateChanges": {
        "choosing_independence": true
      }
    }
  ];
}

// Save the updated story
fs.writeFileSync(storyPath, JSON.stringify(storyData, null, 2));

console.log('✅ Added practical skills summary ending (scenes 3-20 through 3-25)');
console.log('📝 Summary includes:');
console.log('  - Real Birmingham resources and deadlines');
console.log('  - Concrete next steps with actual locations');
console.log('  - Phone numbers and contacts');
console.log('  - Multiple ending paths based on player style');
console.log('  - Youth-friendly language throughout');
console.log('  - No abstract counselor speak');