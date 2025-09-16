/**
 * Simplified Game Hook
 * Replaces complex useGame with essential functionality only
 */

import { useState, useCallback, useEffect } from 'react'
import { generateUserId, safeStorage, saveProgress, loadProgress } from '@/lib/safe-storage'
import { trackUserChoice, getUserInsights, getBirminghamMatches } from '@/lib/simple-career-analytics'

// Character relationships and player patterns
export interface CharacterRelationships {
  samuel: { trust: number; backstoryRevealed: string[]; lastInteraction: string }
  maya: { confidence: number; familyPressure: number; roboticsRevealed: boolean }
  devon: { socialComfort: number; technicalSharing: number; groupProgress: boolean }
  jordan: { mentorshipUnlocked: boolean; pathsDiscussed: string[]; wisdomShared: number }
}

export interface PlayerPatterns {
  analytical: number    // Logic-based, data-driven choices
  helping: number      // People-focused, supportive choices
  building: number     // Creative, hands-on choices
  patience: number     // Thoughtful, long-term choices
}

export interface BirminghamKnowledge {
  companiesKnown: string[]
  opportunitiesUnlocked: string[]
  localReferencesRecognized: string[]
  salaryDataRevealed: string[]
}

// Enhanced game state with character depth
export interface SimpleGameState {
  hasStarted: boolean
  currentScene: string
  messages: Array<{ id: string; text: string; speaker: string; type: string }>
  choices: Array<{ text: string; next?: string; consequence?: string; pattern?: keyof PlayerPatterns | string }>
  isProcessing: boolean
  userId: string
  choiceHistory: string[]
  characterRelationships: CharacterRelationships
  playerPatterns: PlayerPatterns
  birminghamKnowledge: BirminghamKnowledge
}

// Enhanced scene data with character depth and Birmingham integration
const SIMPLE_SCENES = {
  'intro': {
    id: 'intro',
    text: "Grand Central Terminus isn't on any map, but here you are. The letter in your hand reads: \"Platform 7, Midnight. Your future awaits.\" Around you, platforms stretch into the distance, each humming with different energy.",
    speaker: 'Narrator',
    choices: [
      { text: "Explore Platform 1: The Care Line", next: 'healthcare-intro', consequence: 'healthcare', pattern: 'helping' },
      { text: "Visit Platform 7: The Data Stream", next: 'tech-intro', consequence: 'technology', pattern: 'analytical' },
      { text: "Check Platform 3: The Builder's Track", next: 'engineering-intro', consequence: 'engineering', pattern: 'building' },
      { text: "Find the Station Keeper for guidance", next: 'samuel-first-meeting', consequence: 'exploring', pattern: 'patience' }
    ]
  },

  'samuel-first-meeting': {
    id: 'samuel-first-meeting',
    text: "You find a man in his fifties adjusting an old mechanical clock, his movements precise and patient. He looks up with kind eyes that have seen many lost travelers. \"Welcome to Grand Central. You look a little lost - that's normal. Everyone who comes through here is trying to figure out where they're headed.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "I don't feel brave. I feel like everyone else knows what they're doing except me.", next: 'samuel-wisdom-validation', consequence: 'samuel_trust+', pattern: 'patience' },
      { text: "My parents sent me here. They think I need direction.", next: 'samuel-parent-pressure', consequence: 'samuel_backstory', pattern: 'helping' },
      { text: "I heard you help people find careers. I need something that actually pays.", next: 'samuel-practical-reality', consequence: 'samuel_practical', pattern: 'analytical' },
      { text: "Birmingham doesn't have opportunities for someone like me.", next: 'samuel-birmingham-transformation', consequence: 'samuel_history', pattern: 'building' }
    ]
  },
  'healthcare-intro': {
    id: 'healthcare-intro',
    text: "Platform 1: The Care Line. Soft blue light bathes everything in warmth. You notice a young woman studying at a table covered with both anatomy books and what looks like robotics components. She looks up, anxiety flickering across her face.",
    speaker: 'Maya Chen (Pre-med Student)',
    choices: [
      { text: "Those robotics parts are interesting. Are you building something medical?", next: 'maya-robotics-reveal', consequence: 'maya_confidence+', pattern: 'building' },
      { text: "Medical school is tough. How are you handling the pressure?", next: 'maya-pressure-discussion', consequence: 'maya_family_pressure', pattern: 'helping' },
      { text: "What Birmingham medical opportunities have you discovered?", next: 'maya-birmingham-medical', consequence: 'birmingham_healthcare', pattern: 'analytical' },
      { text: "You seem conflicted about something. Want to talk?", next: 'maya-inner-conflict', consequence: 'maya_trust+', pattern: 'patience' }
    ]
  },

  'maya-robotics-reveal': {
    id: 'maya-robotics-reveal',
    text: "Maya's eyes light up for the first time. \"You noticed! It's a haptic feedback system for remote surgery training. Surgeons in Birmingham could train doctors in rural Alabama, or even globally. My robotics professor wants to patent it with me.\" Then her expression darkens. \"But if my parents find out I've been spending time on this instead of MCAT prep...\"",
    speaker: 'Maya Chen (Pre-med Student)',
    choices: [
      { text: "This could revolutionize medical training. You're brilliant.", next: 'maya-confidence-building', consequence: 'maya_robotics_revealed', pattern: 'helping' },
      { text: "Could you present this as enhancing your medical career?", next: 'maya-strategic-thinking', consequence: 'maya_family_strategy', pattern: 'analytical' },
      { text: "What would happen if you showed this to your parents?", next: 'maya-family-revelation', consequence: 'maya_family_deep', pattern: 'patience' },
      { text: "UAB has biomedical engineering. Maybe that's your bridge?", next: 'maya-uab-bridge', consequence: 'birmingham_uab', pattern: 'building' }
    ]
  },

  'maya-pressure-discussion': {
    id: 'maya-pressure-discussion',
    text: "Maya sets down her pencil with shaking hands. \"You want to know the worst part? I'm actually good at the pre-med stuff. Organic chemistry, anatomy, I ace it all. My parents say that means it's my calling. But being good at something and being called to it - those aren't the same thing, are they?\"",
    speaker: 'Maya Chen (Pre-med Student)',
    choices: [
      { text: "No, they're not. What does call to you?", next: 'maya-true-passion', consequence: 'maya_authenticity', pattern: 'helping' },
      { text: "Twenty years of their sacrifice is a lot of love to honor.", next: 'maya-family-love', consequence: 'maya_family_understanding', pattern: 'patience' },
      { text: "What specific expectations are weighing on you?", next: 'maya-expectation-details', consequence: 'maya_family_pressure_deep', pattern: 'analytical' },
      { text: "Maybe excellence in one area can fund passion in another?", next: 'maya-strategic-balance', consequence: 'maya_balance_strategy', pattern: 'building' }
    ]
  },

  'maya-true-passion': {
    id: 'maya-true-passion',
    text: "Maya's eyes brighten for the first time in the conversation. \"I've been building medical robots since sophomore year. Tiny surgical assistants that could reduce human error, prosthetics that respond to thought patterns, diagnostic systems that never get tired. My parents see them as 'hobbies' - expensive distractions from 'real medicine.' But what if engineering IS real medicine?\"",
    speaker: 'Maya Chen (Pre-med Student)',
    choices: [
      { text: "Engineering saves more lives than surgery ever could.", next: 'maya-robotics-reveal', consequence: 'maya_confidence_building', pattern: 'building' },
      { text: "How could you show them engineering's medical impact?", next: 'maya-family-revelation', consequence: 'maya_strategic_thinking', pattern: 'analytical' },
      { text: "UAB has an MD-PhD program in biomedical engineering.", next: 'maya-uab-bridge', consequence: 'birmingham_uab', pattern: 'building' },
      { text: "What would it feel like to pursue this path fully?", next: 'maya-authentic-gratitude', consequence: 'maya_self_acceptance', pattern: 'patience' }
    ]
  },

  'maya-family-love': {
    id: 'maya-family-love',
    text: "Maya wipes tears from her eyes. \"Twenty years. Mom learning English while Dad studied for board exams. They'd quiz each other at 2 AM after their shifts. Every dollar saved, every birthday they worked through, every dream they deferred - all so I could be 'successful.' Their love feels like golden handcuffs. How do I honor their sacrifice without sacrificing myself?\"",
    speaker: 'Maya Chen (Pre-med Student)',
    choices: [
      { text: "Love that demands self-betrayal isn't really love.", next: 'maya-family-revelation', consequence: 'maya_boundary_setting', pattern: 'challenging' },
      { text: "What if success means being true to who you are?", next: 'maya-true-passion', consequence: 'maya_authenticity', pattern: 'helping' },
      { text: "They sacrificed so you could have choices they never had.", next: 'maya-strategic-balance', consequence: 'maya_perspective_shift', pattern: 'analytical' },
      { text: "Sometimes the best way to honor love is to live authentically.", next: 'maya-authentic-gratitude', consequence: 'maya_self_acceptance', pattern: 'patience' }
    ]
  },

  'maya-expectation-details': {
    id: 'maya-expectation-details',
    text: "Maya's voice cracks. \"Dad tells everyone about 'my future daughter the doctor.' Mom already picked out my specialty - cardiology, like Dr. Chen who helped Dad get his residency. They've planned my entire life: med school, residency, fellowship, marriage to another doctor, grandchildren they can brag about. I feel like a character in their American Dream screenplay.\"",
    speaker: 'Maya Chen (Pre-med Student)',
    choices: [
      { text: "Whose life are you actually living?", next: 'maya-true-passion', consequence: 'maya_self_realization', pattern: 'challenging' },
      { text: "What would happen if you rewrote the script?", next: 'maya-strategic-balance', consequence: 'maya_creative_thinking', pattern: 'building' },
      { text: "How do their expectations make you feel about yourself?", next: 'maya-family-love', consequence: 'maya_emotional_processing', pattern: 'helping' },
      { text: "Every generation gets to define success differently.", next: 'maya-family-revelation', consequence: 'maya_generational_wisdom', pattern: 'patience' }
    ]
  },

  'maya-strategic-balance': {
    id: 'maya-strategic-balance',
    text: "Maya pulls up her laptop, showing dual spreadsheets. \"I've actually calculated this. MD-PhD programs take longer but offer research funding. I could develop medical robotics while getting the credentials my parents respect. Seven years instead of four, but I'd emerge as both doctor and engineer. It's not compromise - it's strategic integration.\"",
    speaker: 'Maya Chen (Pre-med Student)',
    choices: [
      { text: "Brilliant. How would you pitch this to your parents?", next: 'maya-family-revelation', consequence: 'maya_communication_strategy', pattern: 'analytical' },
      { text: "UAB has exactly that program you're describing.", next: 'maya-uab-bridge', consequence: 'birmingham_uab', pattern: 'building' },
      { text: "You've found a way to honor everyone's dreams.", next: 'maya-authentic-gratitude', consequence: 'maya_harmony_achieved', pattern: 'helping' },
      { text: "This isn't compromise - this is leadership.", next: 'maya-robotics-reveal', consequence: 'maya_confidence_building', pattern: 'patience' }
    ]
  },

  'tech-intro': {
    id: 'tech-intro',
    text: "Platform 7: The Data Stream.\n\nPurple light shimmers across multiple screens displaying elegant code. You see a young man hunched over a laptop, completely absorbed.\n\nHe's muttering to himself about algorithms while simultaneously organizing his cables with mathematical precision.",
    speaker: 'Devon Williams (UAB Engineering Student)',
    choices: [
      { text: "That's beautiful code. What are you building?", next: 'devon-technical-passion', consequence: 'devon_technical_sharing+', pattern: 'building' },
      { text: "You ever notice how everyone says 'networking' like it's easy?", next: 'devon-social-struggle', consequence: 'devon_social_comfort', pattern: 'helping' },
      { text: "What Birmingham tech opportunities have you found?", next: 'devon-tech-ecosystem-research', consequence: 'birmingham_tech', pattern: 'analytical' },
      { text: "Mind if I sit? You look like you understand systems.", next: 'devon-systems-thinking', consequence: 'devon_trust+', pattern: 'patience' }
    ]
  },

  'devon-technical-passion': {
    id: 'devon-technical-passion',
    text: "Devon's whole demeanor changes. He straightens up, eyes bright. \"It's a water filtration monitoring system for Birmingham's Village Creek. Particulate sensors feeding real-time data to environmental engineers. But the beautiful part is the cascading cleanup algorithm - each sensor learns from upstream patterns.\" He pauses, suddenly self-conscious. \"Sorry, I get excited about systems.\"",
    speaker: 'Devon Williams (UAB Engineering Student)',
    choices: [
      { text: "Don't apologize! Your passion makes it fascinating.", next: 'devon-confidence-building', consequence: 'devon_confidence+', pattern: 'helping' },
      { text: "How does this help Birmingham's environmental challenges?", next: 'devon-community-impact', consequence: 'devon_impact_awareness', pattern: 'analytical' },
      { text: "Have you thought about teaching or technical training?", next: 'devon-teaching-realization', consequence: 'devon_career_path', pattern: 'patience' },
      { text: "Could you demo this at the Innovation Depot?", next: 'devon-innovation-depot', consequence: 'birmingham_innovation_depot', pattern: 'building' }
    ]
  },

  'devon-social-struggle': {
    id: 'devon-social-struggle',
    text: "Devon looks up, making brief eye contact before looking away. \"Exactly! Like it's as simple as solving a differential equation. At least equations have right answers. You talk to people and you never know if you said the right thing until it's too late to fix it. I made flowcharts for small talk once, but people don't follow scripts.\"",
    speaker: 'Devon Williams (UAB Engineering Student)',
    choices: [
      { text: "I feel the same way. People are complicated.", next: 'devon-shared-understanding', consequence: 'devon_social_comfort+', pattern: 'helping' },
      { text: "Maybe you need jobs that work with your communication style?", next: 'devon-accommodation-discussion', consequence: 'devon_self_advocacy', pattern: 'analytical' },
      { text: "What happened when people didn't follow your flowcharts?", next: 'devon-failure-learning', consequence: 'devon_growth_mindset', pattern: 'patience' },
      { text: "Have you found any Birmingham tech spaces that feel comfortable?", next: 'devon-safe-spaces', consequence: 'birmingham_tech_community', pattern: 'building' }
    ]
  },
  'engineering-intro': {
    id: 'engineering-intro',
    text: "Platform 3: The Builder's Track.\n\nWarm orange light illuminates workbenches scattered with prototypes, blueprints, and tools.\n\nYou notice someone around 35 examining different projects with a knowing smile - they've clearly seen many iterations of innovation.\n\nTheir presence feels calm, unhurried.",
    speaker: 'Jordan Packard (Multi-Path Mentor)',
    choices: [
      { text: "You look like someone who's built many different things.", next: 'jordan-multi-path-intro', consequence: 'jordan_mentorship', pattern: 'patience' },
      { text: "What Birmingham engineering projects excite you most?", next: 'jordan-birmingham-building', consequence: 'birmingham_engineering', pattern: 'building' },
      { text: "I'm trying to figure out my career path. Any advice?", next: 'jordan-career-wisdom', consequence: 'jordan_wisdom', pattern: 'helping' },
      { text: "This seems like traditional engineering, but something's different here.", next: 'jordan-non-traditional', consequence: 'jordan_perspective', pattern: 'analytical' }
    ]
  },

  'jordan-multi-path-intro': {
    id: 'jordan-multi-path-intro',
    text: "Jordan chuckles warmly.\n\n\"Seven different careers, to be precise. Started in computer science at Alabama A&M, dropped out to join a startup.\n\nSold phones at the Galleria while learning graphic design. Marketing firm, personal trainer, Uber driver while learning to code.\n\nNow I'm a UX designer for a Birmingham health tech company and teach coding bootcamps.\"\n\nThey pause.\n\n\"Everyone else will tell you their straight path to success. I'm here to tell you about the scenic route.\"",
    speaker: 'Jordan Packard (Multi-Path Mentor)',
    choices: [
      { text: "Doesn't jumping around hurt your resume?", next: 'jordan-resume-myth', consequence: 'jordan_career_strategy', pattern: 'analytical' },
      { text: "How did you not give up when things kept changing?", next: 'jordan-resilience-wisdom', consequence: 'jordan_resilience', pattern: 'helping' },
      { text: "Which career was the right one?", next: 'jordan-all-paths-wisdom', consequence: 'jordan_integration', pattern: 'patience' },
      { text: "Birmingham seems perfect for career experimentation.", next: 'jordan-birmingham-flexibility', consequence: 'birmingham_career_culture', pattern: 'building' }
    ]
  },

  'jordan-career-wisdom': {
    id: 'jordan-career-wisdom',
    text: "Jordan sets down the prototype they were examining. \"Here's my advice, and it's not what your parents want to hear: Stop trying to choose the right path. Start trying to choose the next interesting problem. Birmingham's got problems to solve - healthcare accessibility, education gaps, urban renewal, tech inequality. Pick one that makes you curious.\"",
    speaker: 'Jordan Packard (Multi-Path Mentor)',
    choices: [
      { text: "But how do you know when to stick versus move on?", next: 'jordan-timing-wisdom', consequence: 'jordan_decision_making', pattern: 'analytical' },
      { text: "What if I waste years on the wrong problem?", next: 'jordan-no-waste-philosophy', consequence: 'jordan_growth_mindset', pattern: 'helping' },
      { text: "Which Birmingham problems call to you now?", next: 'jordan-current-passion', consequence: 'birmingham_problems', pattern: 'building' },
      { text: "This sounds like permission to explore without guilt.", next: 'jordan-permission-giving', consequence: 'jordan_validation', pattern: 'patience' }
    ]
  },

  // Samuel wisdom scenes
  'samuel-wisdom-validation': {
    id: 'samuel-wisdom-validation',
    text: "Samuel's expression softens. \"Let me tell you something - I've guided maybe three thousand young folks through this station. The ones who pretend they have it all figured out? They're the ones who end up on the wrong train. You knowing you don't know? That's wisdom, not weakness. Come, let me show you something.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "What do you want to show me?", next: 'samuel-sloss-furnaces-story', consequence: 'samuel_backstory', pattern: 'patience' },
      { text: "How do you help people figure it out?", next: 'samuel-guidance-method', consequence: 'samuel_trust+', pattern: 'helping' },
      { text: "You mentioned three thousand people. What patterns do you see?", next: 'samuel-patterns-wisdom', consequence: 'samuel_analytics', pattern: 'analytical' },
      { text: "Were you lost once too?", next: 'samuel-personal-story', consequence: 'samuel_vulnerability', pattern: 'building' }
    ]
  },

  'samuel-parent-pressure': {
    id: 'samuel-parent-pressure',
    text: "Samuel nods knowingly. \"Ah, the family compass. Let me guess - they've been pointing you in directions that feel right to them but wrong to you?\" He leans against the wall. \"I've seen this story before. Parents who sacrificed everything, kids who feel guilty about wanting something different. The thing is, sometimes the path they want for you isn't wrong - it's just not yours.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "They want me to be a doctor, but I'm more interested in building things.", next: 'samuel-practical-reality', consequence: 'samuel_understanding', pattern: 'building' },
      { text: "How do I honor their sacrifice without sacrificing myself?", next: 'samuel-wisdom-validation', consequence: 'samuel_trust+', pattern: 'helping' },
      { text: "What did you do when your family had expectations?", next: 'samuel-personal-story', consequence: 'samuel_vulnerability', pattern: 'patience' },
      { text: "Maybe they're right. Maybe I should just follow their plan.", next: 'samuel-guidance-method', consequence: 'samuel_intervention', pattern: 'analytical' }
    ]
  },

  'samuel-practical-reality': {
    id: 'samuel-practical-reality',
    text: "Samuel's eyes sharpen with respect. \"Now that's honest talk. You need something that puts food on the table and keeps the lights on. I appreciate that.\" He pulls out a worn notebook. \"Birmingham's got opportunities, but let me tell you what's real: entry-level wages, what benefits actually look like, which paths have upward mobility and which ones keep you stuck.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "What are the real starting salaries in Birmingham?", next: 'birmingham-salary-data', consequence: 'birmingham_salary_reality', pattern: 'analytical' },
      { text: "Which careers actually have room for advancement?", next: 'samuel-career-transition', consequence: 'samuel_career_wisdom', pattern: 'building' },
      { text: "I need something stable. My family depends on me.", next: 'samuel-family-support', consequence: 'samuel_responsibility_wisdom', pattern: 'helping' },
      { text: "Show me opportunities that don't require a four-year degree.", next: 'samuel-secret-routes', consequence: 'samuel_alternative_paths', pattern: 'patience' }
    ]
  },

  'samuel-birmingham-transformation': {
    id: 'samuel-birmingham-transformation',
    text: "Samuel chuckles, but not unkindly. \"Birmingham doesn't have opportunities? Child, you're standing in a city that reinvented itself twice in my lifetime. See, that's the story people tell when they don't know where to look.\" He gestures toward the platforms. \"You think UAB Medical Center, Innovation Depot, Regions Bank, Southern Company - you think they're hiring from Atlanta? They're right here, looking for local talent.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "What specific opportunities are you talking about?", next: 'birmingham-partnership-opportunities', consequence: 'birmingham_opportunity_awareness', pattern: 'analytical' },
      { text: "How do I access these opportunities?", next: 'samuel-secret-routes', consequence: 'samuel_pathway_guidance', pattern: 'building' },
      { text: "I don't have the right connections or background.", next: 'samuel-economic-justice', consequence: 'samuel_equity_wisdom', pattern: 'helping' },
      { text: "Tell me more about Birmingham's transformation.", next: 'samuel-sloss-furnaces-story', consequence: 'birmingham_history', pattern: 'patience' }
    ]
  },

  'samuel-sloss-furnaces-story': {
    id: 'samuel-sloss-furnaces-story',
    text: "Samuel walks you to a window overlooking the city. \"See that old photo on the wall? That's Sloss Furnaces, 1975. My daddy's in that picture somewhere, covered in soot, proud as could be. When the mills closed, people said Birmingham was finished. But look out there now - UAB Medical Center, Innovation Depot, Protective Life reaching for the sky. You know what changed?\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "The economy shifted from industrial to medical and tech?", next: 'samuel-economic-transformation', consequence: 'birmingham_economic_history', pattern: 'analytical' },
      { text: "I don't know, but my family still struggles like they did then.", next: 'samuel-economic-justice', consequence: 'samuel_social_awareness', pattern: 'helping' },
      { text: "People adapted and learned new skills?", next: 'samuel-adaptation-wisdom', consequence: 'samuel_resilience', pattern: 'building' },
      { text: "Time and patience. Change takes generations.", next: 'samuel-generational-change', consequence: 'samuel_patience_wisdom', pattern: 'patience' }
    ]
  },

  'samuel-economic-justice': {
    id: 'samuel-economic-justice',
    text: "Samuel nods seriously. \"You're right to say that. The new Birmingham hasn't lifted everybody up equally. That's exactly why I'm here. Because kids from families like yours and mine need to know - there are ways into those glass towers that don't require you to be born on the right side of Red Mountain. But you've got to know the secret routes. Want me to show you?\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "Yes, show me the secret routes.", next: 'samuel-secret-routes', consequence: 'birmingham_hidden_opportunities', pattern: 'building' },
      { text: "How do you know these routes exist?", next: 'samuel-personal-journey', consequence: 'samuel_backstory_deep', pattern: 'analytical' },
      { text: "Why don't schools teach these routes?", next: 'samuel-systemic-critique', consequence: 'samuel_education_reform', pattern: 'helping' },
      { text: "Are these routes sustainable or just exceptions?", next: 'samuel-systemic-change', consequence: 'samuel_long_term_thinking', pattern: 'patience' }
    ]
  },

  'samuel-secret-routes': {
    id: 'samuel-secret-routes',
    text: "Samuel leans in conspiratorially. \"UAB Medical Center? They need more than doctors. Biomedical equipment technicians make $65K starting, with a two-year degree from Jeff State. Amazon facility in Bessemer? Robotics maintenance folks pull in $70K, and they'll train you. Downtown banks? Desperate for cybersecurity people - you can learn that online for free if you know where to look.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "Can you connect me with people in these fields?", next: 'birmingham-partnership-opportunities', consequence: 'birmingham_professional_network', pattern: 'building' },
      { text: "What's the catch? Why doesn't everyone know this?", next: 'samuel-personal-story', consequence: 'samuel_systemic_insight', pattern: 'analytical' },
      { text: "How do I prepare for these opportunities?", next: 'uab-partnership-details', consequence: 'samuel_mentorship_deep', pattern: 'patience' },
      { text: "I want to review what I've learned and make a decision.", next: 'insights-integration', consequence: 'samuel_assessment', pattern: 'helping' }
    ]
  },

  'samuel-guidance-method': {
    id: 'samuel-guidance-method',
    text: "Samuel sets down his tools and gives you his full attention. \"My method? I don't give directions - I help people discover their own compass. See, everyone comes here thinking they need answers, but what they really need is better questions. Questions like: What problems do you naturally notice? What would you build if no one was watching? When do you lose track of time?\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "What problems do I naturally notice?", next: 'samuel-patterns-wisdom', consequence: 'samuel_deep_insight', pattern: 'analytical' },
      { text: "I lose track of time when I'm helping people solve things.", next: 'samuel-purpose-fulfillment', consequence: 'samuel_purpose_clarity', pattern: 'helping' },
      { text: "I'd build things that make people's lives easier.", next: 'samuel-birmingham-transformation', consequence: 'samuel_practical_vision', pattern: 'building' },
      { text: "Why don't people ask themselves these questions?", next: 'samuel-wisdom-validation', consequence: 'samuel_meta_reflection', pattern: 'patience' }
    ]
  },

  // Integration scenes
  'career-exploration': {
    id: 'career-exploration',
    text: "You've been exploring different platforms and talking with various mentors. The station feels different now - less overwhelming, more like a place where possibilities converge. What draws your attention?",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "I want to review what I've learned about myself and Birmingham", next: 'insights-integration', consequence: 'self_reflection', pattern: 'analytical' },
      { text: "I feel ready to commit to a direction", next: 'path-commitment', consequence: 'decision_making', pattern: 'building' },
      { text: "I want to explore deeper with one of the mentors", next: 'mentor-selection', consequence: 'relationship_deepening', pattern: 'helping' },
      { text: "I need more time to process everything", next: 'contemplation-space', consequence: 'quiet_reflection', pattern: 'patience' }
    ]
  },

  'insights-integration': {
    id: 'insights-integration',
    text: "Samuel adjusts his pocket watch and smiles. \"Let's see what the station has revealed about you.\" He pulls out a leather journal. \"Your choices show a pattern - you tend toward analytical thinking when gathering information, helping when people are struggling, building when you see practical solutions, and patience when facing uncertainty. Birmingham has opportunities that match these strengths.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "Which Birmingham opportunities match my patterns?", next: 'birmingham-partnership-opportunities', consequence: 'birmingham_matching', pattern: 'analytical' },
      { text: "How can I develop the patterns I'm weaker in?", next: 'birmingham-entry-level-economics', consequence: 'skill_development', pattern: 'building' },
      { text: "Can I talk to people who've taken these paths?", next: 'birmingham-professional-story-healthcare', consequence: 'professional_networking', pattern: 'helping' },
      { text: "I feel ready to take action on my career path.", next: 'path-commitment', consequence: 'concrete_planning', pattern: 'patience' }
    ]
  },

  // Samuel's Personal Story Scenes
  'samuel-personal-story': {
    id: 'samuel-personal-story',
    text: "Samuel sets down his tools and looks directly at you. \"Fifteen years ago, I was designing power grid systems at Southern Company. Good money, respect, engineering prestige. But I kept meeting young people from Ensley, Fairfield, places like where I grew up. They had no idea paths like mine existed. One Sunday after church, a kid asked me, 'How did someone like us become someone like you?' That question changed everything.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "What did you do after that conversation?", next: 'samuel-career-transition', consequence: 'samuel_backstory_deep', pattern: 'helping' },
      { text: "Did you regret leaving engineering?", next: 'samuel-no-regrets', consequence: 'samuel_wisdom_deep', pattern: 'analytical' },
      { text: "How did your family react to the career change?", next: 'samuel-family-support', consequence: 'samuel_personal_cost', pattern: 'patience' },
      { text: "That's exactly why I'm here now.", next: 'samuel-connection-moment', consequence: 'samuel_trust_deep', pattern: 'building' }
    ]
  },

  'samuel-career-transition': {
    id: 'samuel-career-transition',
    text: "Samuel chuckles. \"I took a 40% pay cut to run a mentorship program at the Birmingham Public Library. My wife thought I'd lost my mind. But when the city created Grand Central Terminus as a career exploration center, they needed someone who understood both where Birmingham had been and where it was going. Someone who could speak to kids from Ensley and Mountain Brook alike.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "Do you miss the engineering work?", next: 'samuel-engineering-vs-mentorship', consequence: 'samuel_career_wisdom', pattern: 'analytical' },
      { text: "How did you convince your wife this was right?", next: 'samuel-family-dynamics', consequence: 'samuel_personal_relationships', pattern: 'helping' },
      { text: "What's the most rewarding part of this work?", next: 'samuel-purpose-fulfillment', consequence: 'samuel_meaning', pattern: 'patience' },
      { text: "You're building careers instead of power grids now.", next: 'samuel-metaphor-connection', consequence: 'samuel_poetry', pattern: 'building' }
    ]
  },

  // Maya Family Dynamics Deep Dive
  'maya-family-revelation': {
    id: 'maya-family-revelation',
    text: "Maya's hands shake slightly. \"My parents came here with nothing in 1995. Dad did his residency at UAB while Mom worked double shifts as a nurse getting her credentials recognized. Every sacrifice, every missed dinner, every time they chose work over family time - it was all so I could have this 'better life.' How do I tell them their dream for me feels like a prison?\"",
    speaker: 'Maya Chen (Pre-med Student)',
    choices: [
      { text: "Their love created opportunities, not obligations.", next: 'maya-reframing-love', consequence: 'maya_family_healing', pattern: 'helping' },
      { text: "What if you honored their sacrifice by pursuing excellence your way?", next: 'maya-alternative-excellence', consequence: 'maya_strategic_thinking', pattern: 'analytical' },
      { text: "Have you considered showing them your robotics work?", next: 'maya-demonstration-approach', consequence: 'maya_action_plan', pattern: 'building' },
      { text: "Sometimes the greatest honor is becoming who we're meant to be.", next: 'maya-authentic-gratitude', consequence: 'maya_self_acceptance', pattern: 'patience' }
    ]
  },

  'maya-uab-bridge': {
    id: 'maya-uab-bridge',
    text: "Maya's eyes widen. \"UAB does have an MD-PhD program in biomedical engineering. It's seven years instead of four, but...\" She pulls up the program on her laptop. \"Look at this - they're developing robotic surgical systems, AI diagnostic tools, prosthetics research. My parents would see the MD, but I'd be building the future of medicine.\"",
    speaker: 'Maya Chen (Pre-med Student)',
    choices: [
      { text: "This could be your perfect compromise.", next: 'uab-partnership-details', consequence: 'uab_biomedical_pathway', pattern: 'building' },
      { text: "How would you present this to your parents?", next: 'maya-family-revelation', consequence: 'maya_communication_plan', pattern: 'analytical' },
      { text: "You'd be pioneering a new kind of healing.", next: 'birmingham-professional-story-healthcare', consequence: 'maya_confidence_boost', pattern: 'helping' },
      { text: "Let's explore more Birmingham opportunities.", next: 'insights-integration', consequence: 'maya_long_term_thinking', pattern: 'patience' }
    ]
  },

  'maya-authentic-gratitude': {
    id: 'maya-authentic-gratitude',
    text: "Maya takes a deep breath, her shoulders relaxing for the first time.\n\n\"You know what? I think I've been so focused on avoiding disappointment that I forgot to pursue fulfillment.\"\n\n\"My parents sacrificed everything so I could have choices.\"\n\n\"Maybe the greatest way to honor that sacrifice is to actually make those choices - authentically.\"\n\n\"Thank you for helping me see that gratitude and authenticity aren't opposites.\"",
    speaker: 'Maya Chen (Pre-med Student)',
    choices: [
      { text: "What's your next step in honoring both yourself and them?", next: 'maya-uab-bridge', consequence: 'maya_action_planning', pattern: 'building' },
      { text: "How do you feel about having this conversation with your parents?", next: 'maya-family-revelation', consequence: 'maya_communication_courage', pattern: 'analytical' },
      { text: "You've found your path. Let's explore Birmingham opportunities.", next: 'insights-integration', consequence: 'maya_forward_momentum', pattern: 'patience' },
      { text: "This is what courage looks like.", next: 'maya-robotics-reveal', consequence: 'maya_confidence_building', pattern: 'helping' }
    ]
  },

  'maya-reframing-love': {
    id: 'maya-reframing-love',
    text: "Maya slowly nods, wiping away tears. \"You're right. Their love gave me opportunities, not obligations. They came to America so I could choose my own path, not follow theirs. I think... I think they'd be prouder of me for building something meaningful than for just following their plan. Their sacrifice was about opening doors, not closing them.\"",
    speaker: 'Maya Chen (Pre-med Student)',
    choices: [
      { text: "How would you explain your robotics passion to them?", next: 'maya-demonstration-approach', consequence: 'maya_communication_strategy', pattern: 'building' },
      { text: "What if you showed them you're still excellent, just in your own way?", next: 'maya-alternative-excellence', consequence: 'maya_redefined_success', pattern: 'analytical' },
      { text: "Their story of sacrifice becomes your story of purpose.", next: 'maya-authentic-gratitude', consequence: 'maya_narrative_healing', pattern: 'helping' },
      { text: "Let's find ways to honor their journey through your choices.", next: 'maya-uab-bridge', consequence: 'maya_integration_path', pattern: 'patience' }
    ]
  },

  'maya-alternative-excellence': {
    id: 'maya-alternative-excellence',
    text: "Maya's eyes light up with possibility. \"Excellence. Yes. What if I showed them that excellence isn't just about following their path, but about mastering my own? My robotics work has won three engineering competitions. My research proposal got accepted to UAB's summer program. I'm not failing their dreams - I'm excelling at my own.\"",
    speaker: 'Maya Chen (Pre-med Student)',
    choices: [
      { text: "Those achievements are incredible. How would you present them?", next: 'maya-demonstration-approach', consequence: 'maya_evidence_building', pattern: 'building' },
      { text: "Excellence in service of your purpose is still excellence.", next: 'maya-authentic-gratitude', consequence: 'maya_values_alignment', pattern: 'helping' },
      { text: "What would an MD-PhD in biomedical engineering represent to them?", next: 'maya-uab-bridge', consequence: 'maya_strategic_presentation', pattern: 'analytical' },
      { text: "Your excellence is honoring their sacrifice in a new way.", next: 'maya-strategic-balance', consequence: 'maya_perspective_integration', pattern: 'patience' }
    ]
  },

  'maya-demonstration-approach': {
    id: 'maya-demonstration-approach',
    text: "Maya pulls out her phone, scrolling through videos. \"I could show them my surgical robot prototype. It performed a simulated appendectomy with 99.7% precision - better than the average resident. Or this prosthetic hand that responds to muscle signals. I've been hiding my best work because I was afraid they'd see it as distraction from 'real medicine.' But this IS real medicine.\"",
    speaker: 'Maya Chen (Pre-med Student)',
    choices: [
      { text: "That surgical robot could save thousands of lives.", next: 'maya-authentic-gratitude', consequence: 'maya_impact_realization', pattern: 'helping' },
      { text: "How would you frame this as the future of medicine?", next: 'maya-alternative-excellence', consequence: 'maya_vision_articulation', pattern: 'analytical' },
      { text: "UAB would be the perfect place to develop this further.", next: 'maya-uab-bridge', consequence: 'birmingham_connection', pattern: 'building' },
      { text: "You're not abandoning medicine - you're revolutionizing it.", next: 'maya-strategic-balance', consequence: 'maya_reframe_success', pattern: 'patience' }
    ]
  },

  // Birmingham Professional Integration
  'birmingham-professional-story-healthcare': {
    id: 'birmingham-professional-story-healthcare',
    text: "Maya introduces you to Dr. James Thompson, who works at UAB. \"I was a cardiac surgeon for ten years,\" he says, \"then founded a medical device company. Now my artificial hearts save more lives than I ever could in the OR. The best doctors heal one patient at a time. The best engineers heal thousands.\"",
    speaker: 'Dr. James Thompson (Medical Device Entrepreneur)',
    choices: [
      { text: "How did you make the transition from surgeon to entrepreneur?", next: 'healthcare-entrepreneur-journey', consequence: 'birmingham_healthcare_innovation', pattern: 'analytical' },
      { text: "What Birmingham resources helped you start your company?", next: 'birmingham-startup-resources', consequence: 'birmingham_business_ecosystem', pattern: 'building' },
      { text: "Do you ever regret leaving surgery?", next: 'healthcare-purpose-evolution', consequence: 'career_transition_wisdom', pattern: 'helping' },
      { text: "What advice would you give to someone torn between medicine and engineering?", next: 'healthcare-engineering-advice', consequence: 'interdisciplinary_wisdom', pattern: 'patience' }
    ]
  },

  // Devon Breakthrough Scenes
  'devon-confidence-building': {
    id: 'devon-confidence-building',
    text: "Devon's posture changes completely. \"You know, my grandmother always said 'Baby, you don't need to be everybody's friend. You just need to find your people - the ones who speak your language.' Maybe that's what I've been missing. I've been trying to network with everyone instead of finding the people who get excited about water filtration algorithms.\"",
    speaker: 'Devon Williams (UAB Engineering Student)',
    choices: [
      { text: "Where would you find those people in Birmingham?", next: 'devon-tech-ecosystem-research', consequence: 'birmingham_tech_community', pattern: 'building' },
      { text: "Your grandmother sounds wise. What else did she teach you?", next: 'devon-family-wisdom', consequence: 'devon_family_connection', pattern: 'helping' },
      { text: "Have you considered that explaining your work IS networking?", next: 'devon-teaching-realization', consequence: 'devon_communication_strength', pattern: 'analytical' },
      { text: "What would it feel like to stop apologizing for your passion?", next: 'devon-authentic-confidence', consequence: 'devon_self_acceptance', pattern: 'patience' }
    ]
  },


  // Geographic and Economic Context
  'birmingham-neighborhood-context': {
    id: 'birmingham-neighborhood-context',
    text: "Samuel opens a detailed Birmingham map. \"Let's talk reality. If you're working downtown - UAB, Innovation Depot, the banks - you've got options. Live in Five Points South for the young professional scene, $1,200 for a one-bedroom. Avondale's got character and breweries, $900 apartments. Forest Park if you want suburban feel but can't afford Mountain Brook yet. Each choice shapes your daily life and career network.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "What about transportation? I don't have a car yet.", next: 'birmingham-transportation-reality', consequence: 'birmingham_transportation', pattern: 'analytical' },
      { text: "How do different neighborhoods affect career networking?", next: 'birmingham-networking-geography', consequence: 'birmingham_social_capital', pattern: 'building' },
      { text: "What's realistic for someone starting at $35K?", next: 'birmingham-entry-level-economics', consequence: 'birmingham_cost_of_living', pattern: 'helping' },
      { text: "Where would you recommend I start?", next: 'birmingham-personalized-recommendation', consequence: 'birmingham_tailored_advice', pattern: 'patience' }
    ]
  },

  'birmingham-entry-level-economics': {
    id: 'birmingham-entry-level-economics',
    text: "Samuel nods thoughtfully. \"$35K in Birmingham goes further than Atlanta or Nashville. Rent should be max $875 - that's 30% of your income. You can find decent places in Woodlawn, Crestwood North, parts of Southside for $700-800. Keep $200 for utilities, $300 for food, $150 for transportation. Leaves you $1,000 for savings, student loans, and actually having a life. It's doable here.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "What career paths can get me above $35K quickly?", next: 'birmingham-salary-progression', consequence: 'birmingham_career_advancement', pattern: 'analytical' },
      { text: "Are there programs to help with housing costs?", next: 'birmingham-housing-assistance', consequence: 'birmingham_support_resources', pattern: 'helping' },
      { text: "How do I budget for professional development?", next: 'birmingham-professional-investment', consequence: 'career_development_strategy', pattern: 'building' },
      { text: "This feels more manageable than I thought.", next: 'birmingham-hope-building', consequence: 'confidence_boost', pattern: 'patience' }
    ]
  },

  // Partnership Integration - UAB, BCS, Regions Bank, Southern Company
  'birmingham-partnership-opportunities': {
    id: 'birmingham-partnership-opportunities',
    text: "Samuel pulls out a folder marked 'Partnership Programs.' \"These aren't just job listings - these are pathways. UAB has work-study positions that let you earn while learning. Birmingham City Schools needs tech support and tutoring - great for building people skills. Regions Bank has a financial services apprenticeship program. Southern Company offers engineering co-ops that often lead to full-time offers.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "Tell me more about the UAB work-study opportunities.", next: 'uab-partnership-details', consequence: 'uab_partnership', pattern: 'analytical' },
      { text: "How do I apply for the Birmingham City Schools positions?", next: 'bcs-partnership-details', consequence: 'bcs_partnership', pattern: 'helping' },
      { text: "What's the Regions Bank apprenticeship like?", next: 'regions-partnership-details', consequence: 'regions_partnership', pattern: 'building' },
      { text: "I'm interested in the Southern Company engineering program.", next: 'southern-company-partnership', consequence: 'southern_company_partnership', pattern: 'patience' }
    ]
  },

  'uab-partnership-details': {
    id: 'uab-partnership-details',
    text: "Samuel opens a UAB brochure.\n\n\"Work-study at UAB isn't just filing papers. You could assist with biomedical research, help manage the hospital's technology systems, or support the Innovation Hub's startup incubator.\n\n$15-18/hour, flexible scheduling around classes, and real networking opportunities.\n\nPlus, if you decide on grad school, you'll already have connections with professors and researchers.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "How competitive are these positions?", next: 'uab-application-reality', consequence: 'uab_application_process', pattern: 'analytical' },
      { text: "What skills do they look for in applicants?", next: 'uab-skills-requirements', consequence: 'uab_preparation_needs', pattern: 'building' },
      { text: "Can you connect me with someone who's done this?", next: 'uab-networking-connection', consequence: 'uab_professional_network', pattern: 'helping' },
      { text: "When should I start preparing my application?", next: 'uab-timeline-planning', consequence: 'uab_strategic_planning', pattern: 'patience' }
    ]
  },

  'regions-partnership-details': {
    id: 'regions-partnership-details',
    text: "Samuel leans forward. \"Regions has a Financial Services Apprenticeship - 18 months combining classroom learning with on-the-job experience. You rotate through different departments: personal banking, business lending, investment services, risk management. Starting salary around $42K, with guaranteed raises. Many apprentices become full-time analysts or relationship managers earning $55-65K within three years.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "What background do they expect for applicants?", next: 'regions-requirements', consequence: 'regions_preparation', pattern: 'analytical' },
      { text: "How does this compare to a traditional finance degree?", next: 'regions-vs-college', consequence: 'alternative_pathway_wisdom', pattern: 'building' },
      { text: "Are there opportunities for advancement beyond analyst?", next: 'regions-career-progression', consequence: 'regions_long_term_growth', pattern: 'patience' },
      { text: "This sounds like it could lead to real financial stability.", next: 'regions-stability-discussion', consequence: 'financial_security_planning', pattern: 'helping' }
    ]
  },

  'southern-company-partnership': {
    id: 'southern-company-partnership',
    text: "Samuel's eyes light up - his old employer.\n\n\"Southern Company's co-op program is how I got my start. Six-month rotations through different engineering divisions: power generation, transmission, renewable energy, grid modernization.\n\nYou're not just observing - you're contributing to real projects that keep the lights on for millions of people.\n\n$22/hour as a co-op, and about 80% get full-time offers starting around $70K.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "What engineering disciplines do they hire for co-ops?", next: 'southern-company-disciplines', consequence: 'southern_company_technical_paths', pattern: 'analytical' },
      { text: "How did the co-op program change your career trajectory?", next: 'samuel-southern-company-story', consequence: 'samuel_career_origin', pattern: 'helping' },
      { text: "What kind of projects would I work on as a co-op?", next: 'southern-company-projects', consequence: 'southern_company_experience', pattern: 'building' },
      { text: "This feels like the kind of stable career my family would understand.", next: 'southern-company-family-approval', consequence: 'family_career_validation', pattern: 'patience' }
    ]
  },

  // Southern Company Career Path Deep Dive - Missing Scenes
  'southern-company-disciplines': {
    id: 'southern-company-disciplines',
    text: "\"They rotate co-ops through every engineering discipline,\" Samuel explains.\n\n\"Electrical engineers work on grid modernization and smart meters.\"\n\n\"Mechanical engineers focus on power plant operations and efficiency improvements.\"\n\n\"Environmental engineers handle air quality and renewable energy integration.\"\n\n\"There's also nuclear engineering at Plant Farley, chemical engineering for emissions control, and computer engineering for cybersecurity.\"\n\n\"The beauty is, you discover what energizes you - literally.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "Which discipline has the most growth potential?", next: 'birmingham-partnership-opportunities', consequence: 'southern_company_career_planning', pattern: 'analytical' },
      { text: "How do you choose which rotation to pursue long-term?", next: 'samuel-southern-company-story', consequence: 'samuel_career_wisdom', pattern: 'helping' },
      { text: "What Birmingham impact do these disciplines have?", next: 'birmingham-neighborhood-context', consequence: 'birmingham_utility_awareness', pattern: 'patience' },
      { text: "I want to explore other career paths too.", next: 'insights-integration', consequence: 'career_exploration_continuation', pattern: 'building' }
    ]
  },

  'samuel-southern-company-story': {
    id: 'samuel-southern-company-story',
    text: "Samuel leans back, a distant smile crossing his face. \"I started in electrical engineering, fell in love with renewable energy integration during my third rotation. This was 2015 - solar and wind were just becoming economically competitive.\n\nI spent five years designing grid connections for Alabama solar farms. Helped bring clean energy to rural communities that had been forgotten. But I realized I was more passionate about helping people find their paths than I was about optimizing power flows.\n\nThat job taught me that meaningful work happens at the intersection of technical skill and human impact.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "Do you miss the technical engineering work?", next: 'samuel-engineering-vs-mentorship', consequence: 'samuel_career_reflection', pattern: 'analytical' },
      { text: "How did you know it was time to leave?", next: 'samuel-career-transition', consequence: 'career_transition_insight', pattern: 'helping' },
      { text: "What would you tell someone considering the same path?", next: 'insights-integration', consequence: 'southern_company_recommendation', pattern: 'patience' },
      { text: "Let's explore more Birmingham opportunities.", next: 'insights-integration', consequence: 'career_exploration_expansion', pattern: 'building' }
    ]
  },

  'southern-company-projects': {
    id: 'southern-company-projects',
    text: "\"The projects are what made it real for me,\" Samuel says enthusiastically. \"As a co-op, I worked on Hurricane Irma power restoration - coordinating crews across Alabama to get hospitals and schools back online first.\n\nI helped design the smart grid pilot program in Huntsville, where customers can see real-time energy usage and sell solar power back to the grid. One rotation had me analyzing wind patterns for potential wind farms in North Alabama.\n\nYou're not filing papers or getting coffee. You're solving actual problems that affect real communities.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "How much responsibility do co-ops actually get?", next: 'uab-partnership-details', consequence: 'southern_company_expectations', pattern: 'analytical' },
      { text: "Working on disaster recovery sounds incredibly meaningful.", next: 'birmingham-neighborhood-context', consequence: 'southern_company_purpose', pattern: 'helping' },
      { text: "What technical skills did these projects teach you?", next: 'devon-technical-passion', consequence: 'southern_company_learning', pattern: 'building' },
      { text: "This sounds like work that actually matters.", next: 'southern-company-family-approval', consequence: 'career_meaning_recognition', pattern: 'patience' }
    ]
  },

  'southern-company-family-approval': {
    id: 'southern-company-family-approval',
    text: "Samuel nods knowingly. \"That's exactly what my grandmother said when I got the co-op offer. 'Now that's a job that serves people, Samuel.' \n\nUtility work has this reputation for stability that older generations understand and respect. It's essential work - keeping lights on, businesses running, hospitals powered. There's dignity in that.\n\nPlus, the career progression is clear: co-op to engineer to senior engineer to management. Your family can see the path, the security, the contribution to society. It translates across generations.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "How do I apply for the Southern Company co-op program?", next: 'birmingham-partnership-opportunities', consequence: 'southern_company_actionable_steps', pattern: 'building' },
      { text: "What if I'm not sure engineering is right for me?", next: 'jordan-career-wisdom', consequence: 'southern_company_flexibility', pattern: 'analytical' },
      { text: "This feels like a path I could be proud of.", next: 'insights-integration', consequence: 'career_confidence_building', pattern: 'patience' },
      { text: "I want to compare this with other Birmingham opportunities.", next: 'insights-integration', consequence: 'comprehensive_career_analysis', pattern: 'helping' }
    ]
  },

  // Jordan's Multi-Path Wisdom Completion
  'jordan-all-paths-wisdom': {
    id: 'jordan-all-paths-wisdom',
    text: "Jordan smiles warmly. \"That's the thing - they were ALL the right one. The customer service job at the Galleria taught me empathy and how to read what people actually need. Uber taught me Birmingham's geography and how different communities live. Personal training taught me how to motivate people and see their potential. Graphic design taught me visual thinking. Now I use ALL of that in UX design for healthcare apps. Your career isn't a destination - it's an accumulation.\"",
    speaker: 'Jordan Packard (Multi-Path Mentor)',
    choices: [
      { text: "How do you explain that journey to employers?", next: 'jordan-storytelling-skills', consequence: 'jordan_interview_wisdom', pattern: 'analytical' },
      { text: "Do you ever worry about not being an expert in one thing?", next: 'jordan-generalist-confidence', consequence: 'jordan_expertise_perspective', pattern: 'helping' },
      { text: "Birmingham seems to reward that kind of flexibility.", next: 'jordan-birmingham-flexibility', consequence: 'birmingham_career_culture', pattern: 'building' },
      { text: "Your story makes me feel less pressure to choose perfectly.", next: 'jordan-pressure-relief', consequence: 'jordan_validation', pattern: 'patience' }
    ]
  },

  'samuel-family-support': {
    id: 'samuel-family-support',
    text: "Samuel nods thoughtfully. \"Family depending on you - that's real weight, real responsibility. I respect that. Let me tell you about stability in Birmingham. UAB employs 23,000 people. Regions Bank has been here 150 years through depressions and recessions. Amazon isn't going anywhere. But here's the thing - stability isn't just about the company. It's about building skills that transfer. Which would you rather have: one company needs you, or five companies could use you?\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "What skills transfer between Birmingham companies?", next: 'birmingham-transferable-skills', consequence: 'birmingham_skill_mapping', pattern: 'analytical' },
      { text: "I need specific salary numbers to make family decisions.", next: 'birmingham-salary-data', consequence: 'samuel_practical_guidance', pattern: 'helping' },
      { text: "How do I build multiple skills while supporting family?", next: 'samuel-adaptation-wisdom', consequence: 'samuel_growth_strategy', pattern: 'building' },
      { text: "Tell me more about these companies that have stayed strong.", next: 'birmingham-partnership-opportunities', consequence: 'birmingham_stability_evidence', pattern: 'patience' }
    ]
  },

  'jordan-resume-myth': {
    id: 'jordan-resume-myth',
    text: "Jordan laughs warmly. \"That's exactly what I thought too! But here's what actually happened: employers in Birmingham started seeing my diverse background as an asset. When Innovation Depot hired me for UX design, they said 'You understand customer service from the Galleria, logistics from Uber, motivation from personal training, and visual communication from graphic design. You're not scattered - you're comprehensive.'\"",
    speaker: 'Jordan Packard (Multi-Path Mentor)',
    choices: [
      { text: "How do you frame that story in job interviews?", next: 'jordan-storytelling-skills', consequence: 'jordan_interview_strategy', pattern: 'analytical' },
      { text: "What if employers think I can't commit to anything?", next: 'jordan-commitment-myth', consequence: 'jordan_employer_perspective', pattern: 'helping' },
      { text: "Birmingham employers actually value diverse experience?", next: 'jordan-birmingham-flexibility', consequence: 'birmingham_hiring_culture', pattern: 'building' },
      { text: "This makes me feel less guilty about my meandering path.", next: 'jordan-permission-giving', consequence: 'jordan_validation', pattern: 'patience' }
    ]
  },

  'jordan-storytelling-skills': {
    id: 'jordan-storytelling-skills',
    text: "Jordan leans forward enthusiastically. \"I learned to tell my story as a thread, not scattered chapters.\n\n'I started in customer service because I wanted to understand what people really need. That led me to Uber to see how systems work. Personal training taught me motivation psychology. Graphic design gave me visual communication skills.\n\nNow I use ALL of that to design healthcare apps that actually help people.'\n\nSee? It's not random - it's intentional.\"",
    speaker: 'Jordan Packard (Multi-Path Mentor)',
    choices: [
      { text: "That's a powerful way to frame career exploration.", next: 'jordan-permission-giving', consequence: 'jordan_narrative_wisdom', pattern: 'patience' },
      { text: "How do you convince skeptical interviewers?", next: 'jordan-generalist-confidence', consequence: 'jordan_interview_tactics', pattern: 'analytical' },
      { text: "Birmingham companies respond well to this approach?", next: 'jordan-birmingham-flexibility', consequence: 'birmingham_storytelling_culture', pattern: 'building' },
      { text: "I need help crafting my own thread story.", next: 'jordan-current-passion', consequence: 'jordan_personal_coaching', pattern: 'helping' }
    ]
  },

  'jordan-birmingham-flexibility': {
    id: 'jordan-birmingham-flexibility',
    text: "Jordan gestures toward the windows. \"Birmingham is perfect for multi-path careers because we're a city that reinvented itself. UAB needs people who understand both medicine and technology. Innovation Depot loves entrepreneurs with diverse backgrounds. Even Regions Bank hired former teachers to improve customer experience. This city rewards adaptability because adaptability is how we survived and thrived.\"",
    speaker: 'Jordan Packard (Multi-Path Mentor)',
    choices: [
      { text: "Which Birmingham companies specifically embrace this?", next: 'jordan-current-passion', consequence: 'birmingham_multi_path_employers', pattern: 'analytical' },
      { text: "How do I find these flexible opportunities?", next: 'jordan-no-waste-philosophy', consequence: 'birmingham_opportunity_strategy', pattern: 'building' },
      { text: "This gives me hope about my unconventional background.", next: 'jordan-permission-giving', consequence: 'birmingham_validation', pattern: 'patience' },
      { text: "What if I'm still figuring out what I want?", next: 'jordan-timing-wisdom', consequence: 'jordan_exploration_guidance', pattern: 'helping' }
    ]
  },

  'jordan-resilience-wisdom': {
    id: 'jordan-resilience-wisdom',
    text: "Jordan's expression grows thoughtful. \"Each time I changed direction, I felt like I was failing. But here's what kept me going: Birmingham has a culture of 'next.' Next opportunity, next skill, next chance to contribute. When one door closed, I'd think 'What did this teach me?' instead of 'Why did I waste time?' Every experience became part of my toolkit, not a detour from my 'real' path.\"",
    speaker: 'Jordan Packard (Multi-Path Mentor)',
    choices: [
      { text: "How do you reframe failure as learning?", next: 'jordan-no-waste-philosophy', consequence: 'jordan_mindset_shift', pattern: 'analytical' },
      { text: "Birmingham really supports career exploration?", next: 'jordan-birmingham-flexibility', consequence: 'birmingham_support_culture', pattern: 'building' },
      { text: "I'm dealing with that 'failure' feeling right now.", next: 'jordan-permission-giving', consequence: 'jordan_emotional_support', pattern: 'helping' },
      { text: "What does 'toolkit thinking' look like practically?", next: 'jordan-generalist-confidence', consequence: 'jordan_practical_wisdom', pattern: 'patience' }
    ]
  },

  'jordan-permission-giving': {
    id: 'jordan-permission-giving',
    text: "Jordan reaches across and gently touches your arm. \"Listen to me: You don't need permission to explore. You don't need to justify your curiosity. You don't need to apologize for taking time to figure things out. Birmingham grew from iron and steel to medicine and technology because people had permission to imagine something different. Give yourself that same permission.\"",
    speaker: 'Jordan Packard (Multi-Path Mentor)',
    choices: [
      { text: "I've been waiting for someone to say that.", next: 'jordan-pressure-relief', consequence: 'jordan_emotional_release', pattern: 'patience' },
      { text: "How do I explain this exploration to family?", next: 'jordan-storytelling-skills', consequence: 'jordan_family_communication', pattern: 'helping' },
      { text: "What if I discover I want something unconventional?", next: 'jordan-current-passion', consequence: 'jordan_unconventional_support', pattern: 'building' },
      { text: "Birmingham really embraces this exploration mindset?", next: 'jordan-birmingham-flexibility', consequence: 'birmingham_exploration_culture', pattern: 'analytical' }
    ]
  },

  'jordan-no-waste-philosophy': {
    id: 'jordan-no-waste-philosophy',
    text: "Jordan shakes their head emphatically. \"There's no such thing as wasted time if you're paying attention. My customer service years? That's why I understand user frustration. Uber driving? That's why I know Birmingham's communities. Personal training? That's why I can motivate people through difficult changes. Graphic design? That's why my apps are beautiful AND functional. Every 'detour' was actually essential.\"",
    speaker: 'Jordan Packard (Multi-Path Mentor)',
    choices: [
      { text: "How do you identify the lessons in each experience?", next: 'jordan-generalist-confidence', consequence: 'jordan_reflection_method', pattern: 'analytical' },
      { text: "I'm afraid I'm already behind everyone else.", next: 'jordan-pressure-relief', consequence: 'jordan_timeline_wisdom', pattern: 'helping' },
      { text: "Birmingham values this kind of diverse experience?", next: 'jordan-current-passion', consequence: 'birmingham_experience_value', pattern: 'building' },
      { text: "This perspective is exactly what I needed to hear.", next: 'jordan-permission-giving', consequence: 'jordan_validation', pattern: 'patience' }
    ]
  },

  'jordan-timing-wisdom': {
    id: 'jordan-timing-wisdom',
    text: "Jordan considers this carefully. \"I learned to recognize two signals: energy and growth. If I was energized and still learning, I stayed. If I felt drained and stagnant, that was my cue to explore. But here's the key - I always stayed long enough to add real value and learn transferable skills. Six months minimum, usually a year or more. Quality over quantity.\"",
    speaker: 'Jordan Packard (Multi-Path Mentor)',
    choices: [
      { text: "How do you know when you've learned enough?", next: 'jordan-generalist-confidence', consequence: 'jordan_learning_assessment', pattern: 'analytical' },
      { text: "What if staying longer means missing other opportunities?", next: 'jordan-no-waste-philosophy', consequence: 'jordan_opportunity_cost', pattern: 'helping' },
      { text: "Birmingham offers enough variety for this approach?", next: 'jordan-current-passion', consequence: 'birmingham_opportunity_diversity', pattern: 'building' },
      { text: "I need to trust my own timing more.", next: 'jordan-pressure-relief', consequence: 'jordan_self_trust', pattern: 'patience' }
    ]
  },

  'jordan-current-passion': {
    id: 'jordan-current-passion',
    text: "Jordan's eyes light up. \"Right now I'm obsessed with healthcare accessibility. Birmingham has world-class medical facilities at UAB, but transportation and technology barriers keep people from accessing care. I'm designing apps that connect patients with rides, translate medical information, and simplify appointment scheduling. It uses everything I've learned - logistics, motivation, design, and human psychology.\"",
    speaker: 'Jordan Packard (Multi-Path Mentor)',
    choices: [
      { text: "That perfectly combines all your previous experiences.", next: 'jordan-generalist-confidence', consequence: 'jordan_integration_recognition', pattern: 'analytical' },
      { text: "How did you identify this specific need?", next: 'jordan-timing-wisdom', consequence: 'jordan_problem_identification', pattern: 'helping' },
      { text: "Are there Birmingham organizations working on this?", next: 'insights-integration', consequence: 'birmingham_healthcare_connections', pattern: 'building' },
      { text: "Your story gives me hope about finding my own calling.", next: 'jordan-pressure-relief', consequence: 'jordan_inspiration', pattern: 'patience' }
    ]
  },

  'jordan-generalist-confidence': {
    id: 'jordan-generalist-confidence',
    text: "Jordan grins. \"Specialists know everything about one thing. Generalists know something about everything. In Birmingham's innovation economy, both are valuable. But generalists are the ones who see connections others miss, who can translate between different fields, who can adapt when industries shift. We're not jack-of-all-trades, master-of-none. We're master-of-connections.\"",
    speaker: 'Jordan Packard (Multi-Path Mentor)',
    choices: [
      { text: "How do I frame this as a strength to employers?", next: 'jordan-storytelling-skills', consequence: 'jordan_strength_positioning', pattern: 'analytical' },
      { text: "What if I never develop deep expertise in anything?", next: 'jordan-pressure-relief', consequence: 'jordan_expertise_wisdom', pattern: 'helping' },
      { text: "Birmingham companies specifically value this?", next: 'insights-integration', consequence: 'birmingham_generalist_value', pattern: 'building' },
      { text: "I feel more confident about my diverse interests now.", next: 'jordan-permission-giving', consequence: 'jordan_confidence_boost', pattern: 'patience' }
    ]
  },

  'jordan-pressure-relief': {
    id: 'jordan-pressure-relief',
    text: "Jordan's voice becomes gentle and reassuring. \"Take a breath. Everyone around you who seems certain? Half of them are pretending, and the other half will change directions in five years. Your uncertainty isn't weakness - it's honesty. Birmingham didn't become the Magic City by playing it safe. Neither will you. The pressure you feel to choose perfectly is imaginary. The need to keep growing and contributing? That's real.\"",
    speaker: 'Jordan Packard (Multi-Path Mentor)',
    choices: [
      { text: "I needed to hear that. Thank you.", next: 'insights-integration', consequence: 'jordan_emotional_healing', pattern: 'patience' },
      { text: "How do I maintain this perspective when pressure builds?", next: 'jordan-permission-giving', consequence: 'jordan_pressure_management', pattern: 'helping' },
      { text: "What's my next practical step in Birmingham?", next: 'insights-integration', consequence: 'jordan_action_orientation', pattern: 'building' },
      { text: "Your journey gives me hope about my own path.", next: 'jordan-current-passion', consequence: 'jordan_inspiration_complete', pattern: 'analytical' }
    ]
  },

  'devon-shared-understanding': {
    id: 'devon-shared-understanding',
    text: "Devon's shoulders relax visibly. \"Exactly! I'll spend hours perfecting a system that makes perfect sense to me, then people ignore it completely. Or they ask questions that seem obvious from the documentation. Sometimes I wonder if I should just work with computers and skip the human part entirely.\"",
    speaker: 'Devon Kumar (Engineering Student)',
    choices: [
      { text: "Maybe the documentation needs pictures or examples?", next: 'devon-accommodation-discussion', consequence: 'devon_design_thinking', pattern: 'building' },
      { text: "Have you found any Birmingham communities that get this?", next: 'devon-safe-spaces', consequence: 'devon_community_seeking', pattern: 'helping' },
      { text: "What if the human part is actually your superpower?", next: 'devon-teaching-realization', consequence: 'devon_perspective_shift', pattern: 'analytical' },
      { text: "Working with just computers sounds peaceful.", next: 'devon-family-wisdom', consequence: 'devon_isolation_temptation', pattern: 'patience' }
    ]
  },

  'devon-accommodation-discussion': {
    id: 'devon-accommodation-discussion',
    text: "Devon perks up. \"You know, I never thought about it that way. I always assumed people should adapt to my systems, not the other way around. But what if I designed systems that worked with how people actually think? UAB's engineering program taught us about human factors, but I thought that was just for interfaces, not for... everything.\"",
    speaker: 'Devon Kumar (Engineering Student)',
    choices: [
      { text: "Human factors engineering IS about everything.", next: 'devon-teaching-realization', consequence: 'devon_career_epiphany', pattern: 'analytical' },
      { text: "Birmingham needs engineers who think this way.", next: 'devon-community-impact', consequence: 'birmingham_inclusive_design', pattern: 'building' },
      { text: "How would you redesign your current systems?", next: 'devon-confidence-building', consequence: 'devon_practical_application', pattern: 'helping' },
      { text: "This could be your specialty - accessible systems design.", next: 'devon-authentic-confidence', consequence: 'devon_unique_strength', pattern: 'patience' }
    ]
  },

  'devon-safe-spaces': {
    id: 'devon-safe-spaces',
    text: "Devon nods enthusiastically. \"Actually, yes! There's a maker space near UAB where people just... build things. No small talk, no networking pressure. Everyone's focused on their projects. And there's this Discord server for Birmingham developers where all communication is asynchronous and documented. It's like social interaction designed for people like me.\"",
    speaker: 'Devon Kumar (Engineering Student)',
    choices: [
      { text: "That sounds perfect for building technical confidence.", next: 'devon-confidence-building', consequence: 'devon_community_validation', pattern: 'helping' },
      { text: "Are there job opportunities in those communities?", next: 'devon-tech-ecosystem-research', consequence: 'birmingham_tech_networking', pattern: 'analytical' },
      { text: "What projects are you working on there?", next: 'devon-innovation-depot', consequence: 'devon_project_sharing', pattern: 'building' },
      { text: "You found your people. That matters more than traditional networking.", next: 'devon-authentic-confidence', consequence: 'devon_social_validation', pattern: 'patience' }
    ]
  },

  'devon-family-wisdom': {
    id: 'devon-family-wisdom',
    text: "Devon smiles softly. \"My grandmother always said 'Dil mein jo hai, woh hamesha rasta dhundh leta hai' - what's in the heart always finds a way. She was a software engineer in the 1980s in Mumbai, way before it was common for women. She said the technical skills were the easy part. The hard part was learning to translate between human needs and computer logic.\"",
    speaker: 'Devon Kumar (Engineering Student)',
    choices: [
      { text: "Your grandmother sounds like a pioneer.", next: 'devon-authentic-confidence', consequence: 'devon_family_pride', pattern: 'patience' },
      { text: "Translation between humans and computers - that's exactly what you do.", next: 'devon-teaching-realization', consequence: 'devon_skill_recognition', pattern: 'analytical' },
      { text: "Are there Birmingham opportunities for that kind of translation work?", next: 'devon-community-impact', consequence: 'birmingham_bridge_building', pattern: 'building' },
      { text: "How did she learn to make that translation?", next: 'devon-shared-understanding', consequence: 'devon_learning_curiosity', pattern: 'helping' }
    ]
  },

  'devon-teaching-realization': {
    id: 'devon-teaching-realization',
    text: "Devon's eyes widen. \"Wait. When I explain my code to you, I'm... I'm teaching. And you're actually understanding it because I'm breaking it down step by step. I do this all the time in study groups, but I never thought of it as a skill. What if there are jobs where the main requirement is explaining complex technical concepts clearly?\"",
    speaker: 'Devon Kumar (Engineering Student)',
    choices: [
      { text: "Technical writing, training, documentation - Birmingham companies need this.", next: 'devon-tech-ecosystem-research', consequence: 'birmingham_technical_communication', pattern: 'analytical' },
      { text: "You could teach at UAB or Jefferson State.", next: 'devon-community-impact', consequence: 'devon_education_path', pattern: 'helping' },
      { text: "Developer advocacy, technical sales, systems training...", next: 'devon-confidence-building', consequence: 'devon_career_options', pattern: 'building' },
      { text: "Your superpower isn't just coding - it's making coding accessible.", next: 'devon-authentic-confidence', consequence: 'devon_unique_value', pattern: 'patience' }
    ]
  },

  'devon-authentic-confidence': {
    id: 'devon-authentic-confidence',
    text: "Devon straightens up, speaking without their usual hesitation.\n\n\"You know what? I'm tired of apologizing for being thorough.\"\n\n\"For caring about documentation. For wanting systems to make sense.\"\n\n\"Maybe the problem isn't that I'm too methodical.\"\n\n\"Maybe it's that not enough people are.\"\n\n\"Birmingham needs engineers who think about the human impact of technical decisions.\"",
    speaker: 'Devon Kumar (Engineering Student)',
    choices: [
      { text: "That confidence looks good on you.", next: 'devon-community-impact', consequence: 'devon_self_acceptance', pattern: 'patience' },
      { text: "Birmingham companies would be lucky to have that perspective.", next: 'devon-tech-ecosystem-research', consequence: 'devon_market_value', pattern: 'analytical' },
      { text: "How do you want to use these strengths?", next: 'devon-innovation-depot', consequence: 'devon_action_orientation', pattern: 'building' },
      { text: "You've found your voice. Don't let anyone talk you out of it.", next: 'insights-integration', consequence: 'devon_empowerment', pattern: 'helping' }
    ]
  },

  'devon-tech-ecosystem-research': {
    id: 'devon-tech-ecosystem-research',
    text: "Devon pulls out their laptop, showing you several browser tabs.\n\n\"I've been mapping Birmingham's tech ecosystem.\"\n\n\"UAB Research Park, Innovation Depot, TechBirmingham meetups, the Southern Company innovation lab.\"\n\n\"What's interesting is how many companies are looking for engineers who can bridge technical and human needs.\"\n\n\"Especially in healthcare tech and civic innovation.\"",
    speaker: 'Devon Kumar (Engineering Student)',
    choices: [
      { text: "This research shows your analytical skills in action.", next: 'devon-confidence-building', consequence: 'devon_skill_validation', pattern: 'analytical' },
      { text: "Which of these opportunities excites you most?", next: 'devon-innovation-depot', consequence: 'devon_interest_focus', pattern: 'building' },
      { text: "Have you connected with anyone from these organizations?", next: 'devon-safe-spaces', consequence: 'devon_networking_reality', pattern: 'helping' },
      { text: "You've done more career research than most people ever do.", next: 'devon-authentic-confidence', consequence: 'devon_preparation_recognition', pattern: 'patience' }
    ]
  },

  'devon-failure-learning': {
    id: 'devon-failure-learning',
    text: "Devon laughs ruefully. \"Oh, that was a disaster. I made this beautiful workflow for my group project, with clear steps and deadlines. Everyone ignored it completely. I got so frustrated I basically did the whole project myself. But afterward, when I asked what went wrong, I learned something important: my system was perfect for me, but it didn't account for how they actually work.\"",
    speaker: 'Devon Kumar (Engineering Student)',
    choices: [
      { text: "That's not failure - that's user research.", next: 'devon-accommodation-discussion', consequence: 'devon_reframe_failure', pattern: 'analytical' },
      { text: "How did you adapt your approach after that?", next: 'devon-shared-understanding', consequence: 'devon_growth_demonstration', pattern: 'helping' },
      { text: "Birmingham needs engineers who learn from user feedback.", next: 'devon-community-impact', consequence: 'birmingham_user_centered_design', pattern: 'building' },
      { text: "The fact that you asked what went wrong shows wisdom.", next: 'devon-authentic-confidence', consequence: 'devon_reflection_strength', pattern: 'patience' }
    ]
  },

  'birmingham-salary-data': {
    id: 'birmingham-salary-data',
    text: "Samuel pulls out a well-worn folder of local salary data. \"Here's the reality: UAB research positions start at $38-42K. Jefferson State tech programs lead to $45-55K roles. Regions Bank customer service starts at $35K but moves to $50K+ with certifications. Amazon warehouse begins at $17/hour but leads to logistics management at $65K. The key isn't the starting point - it's the trajectory.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "What's realistic for someone starting at $35K in Birmingham?", next: 'birmingham-entry-level-economics', consequence: 'birmingham_financial_planning', pattern: 'analytical' },
      { text: "How do you move up from these starting positions?", next: 'birmingham-transferable-skills', consequence: 'birmingham_advancement_strategy', pattern: 'building' },
      { text: "Which of these paths has the most stability?", next: 'uab-comprehensive-overview', consequence: 'birmingham_stability_analysis', pattern: 'helping' },
      { text: "This gives me hope. These numbers are doable.", next: 'insights-integration', consequence: 'birmingham_optimism', pattern: 'patience' }
    ]
  },

  'birmingham-transferable-skills': {
    id: 'birmingham-transferable-skills',
    text: "Samuel draws a mind map on a napkin. \"Look - customer service at Regions teaches you banking regulations AND communication. That transfers to UAB patient relations, Amazon logistics coordination, or Innovation Depot startup support. Every Birmingham company needs people who can translate between technical systems and human needs. These aren't separate careers - they're connected pathways.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "How do I identify which skills transfer where?", next: 'regions-bank-pathway', consequence: 'birmingham_skill_mapping', pattern: 'analytical' },
      { text: "What Birmingham companies specifically value these connections?", next: 'uab-comprehensive-overview', consequence: 'birmingham_connector_roles', pattern: 'building' },
      { text: "This makes career changes feel less risky.", next: 'jordan-permission-giving', consequence: 'birmingham_flexibility_confidence', pattern: 'helping' },
      { text: "You're describing a Birmingham career ecosystem.", next: 'insights-integration', consequence: 'birmingham_ecosystem_understanding', pattern: 'patience' }
    ]
  },

  'uab-comprehensive-overview': {
    id: 'uab-comprehensive-overview',
    text: "Samuel's eyes light up. \"UAB isn't just a hospital - it's Birmingham's largest employer with 23,000 jobs. Work-study in biomedical engineering, research assistant positions that pay tuition, clinical data analysis roles, medical device testing. Plus, UAB partners with Jefferson State for medical technician training. You can literally earn while you learn, then transition to full-time with benefits and advancement tracks.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "How do I apply for UAB work-study positions?", next: 'uab-application-process', consequence: 'uab_actionable_steps', pattern: 'building' },
      { text: "What other Birmingham companies partner with UAB?", next: 'birmingham-partnership-ecosystem', consequence: 'birmingham_partnership_network', pattern: 'analytical' },
      { text: "This sounds like a perfect path for someone supporting family.", next: 'regions-bank-pathway', consequence: 'uab_family_friendly', pattern: 'helping' },
      { text: "UAB's size means stability and growth opportunities.", next: 'insights-integration', consequence: 'uab_confidence', pattern: 'patience' }
    ]
  },

  'regions-bank-pathway': {
    id: 'regions-bank-pathway',
    text: "Samuel nods approvingly. \"Regions has been in Birmingham 150 years - survived the Great Depression, bank consolidations, everything. They start customer service reps at $35K, but here's the secret: they promote internally first. Financial advisor certification gets you to $55K. Branch management is $75K+. And they pay for your continuing education. Plus, understanding banking opens doors at other Birmingham financial companies.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "What certifications do they pay for?", next: 'birmingham-certification-pathways', consequence: 'regions_education_benefits', pattern: 'analytical' },
      { text: "How long does it typically take to advance?", next: 'birmingham-timeline-expectations', consequence: 'regions_advancement_timeline', pattern: 'building' },
      { text: "Banking feels stable for supporting family.", next: 'insights-integration', consequence: 'regions_family_security', pattern: 'helping' },
      { text: "150 years of stability is reassuring.", next: 'birmingham-partnership-ecosystem', consequence: 'birmingham_institutional_strength', pattern: 'patience' }
    ]
  },

  'birmingham-cost-of-living-reality': {
    id: 'birmingham-cost-of-living-reality',
    text: "Samuel pulls up a calculator.\n\n\"$35K in Birmingham goes further than $50K in Atlanta or Nashville.\"\n\n\"Average rent for a decent one-bedroom is $800-1000. Utilities run about $150. Food costs are reasonable.\"\n\n\"Plus, shorter commutes mean lower transportation costs.\"\n\n\"The real advantage? Birmingham companies know local salaries and often include benefits that offset the difference - health insurance, retirement matching, education assistance.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "What neighborhoods are safe and affordable?", next: 'birmingham-neighborhood-guide', consequence: 'birmingham_living_strategy', pattern: 'analytical' },
      { text: "How do benefits packages compare across Birmingham companies?", next: 'birmingham-benefits-comparison', consequence: 'birmingham_total_compensation', pattern: 'building' },
      { text: "This makes Birmingham feel more achievable.", next: 'insights-integration', consequence: 'birmingham_affordability_confidence', pattern: 'helping' },
      { text: "Lower cost of living means more flexibility to explore careers.", next: 'jordan-birmingham-flexibility', consequence: 'birmingham_exploration_advantage', pattern: 'patience' }
    ]
  },

  'uab-application-process': {
    id: 'uab-application-process',
    text: "Samuel pulls out his phone and shows you the UAB Student Employment website. \"First, create your UAB BlazerNet account. Then check both Student Employment and UAB Research for openings. Key tip: apply early in the semester - positions fill fast. They prefer students who can commit 15-20 hours per week. And here's the secret: many work-study jobs turn into full-time offers after graduation.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "What types of work-study positions are available?", next: 'uab-work-study-varieties', consequence: 'uab_opportunity_breadth', pattern: 'analytical' },
      { text: "How do I stand out in the application process?", next: 'birmingham-application-strategy', consequence: 'uab_competitive_advantage', pattern: 'building' },
      { text: "This feels like a concrete next step I can take.", next: 'insights-integration', consequence: 'uab_action_confidence', pattern: 'helping' },
      { text: "The full-time pathway makes this even more valuable.", next: 'birmingham-partnership-ecosystem', consequence: 'uab_career_pipeline', pattern: 'patience' }
    ]
  },

  'birmingham-partnership-ecosystem': {
    id: 'birmingham-partnership-ecosystem',
    text: "Samuel spreads out a hand-drawn map of Birmingham partnerships. \"UAB partners with Protective Life for actuarial science, with Southern Company for engineering research, with Birmingham City Schools for education pathways. Regions Bank collaborates with Innovation Depot on fintech. Amazon works with Jefferson State on logistics training. These aren't just jobs - they're integrated career ecosystems where skills and relationships transfer.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "How do I tap into these partnership networks?", next: 'birmingham-networking-strategy', consequence: 'birmingham_ecosystem_access', pattern: 'analytical' },
      { text: "Which partnerships have the strongest career pipelines?", next: 'birmingham-career-pipeline-analysis', consequence: 'birmingham_strategic_pathways', pattern: 'building' },
      { text: "This makes Birmingham feel like a real career destination.", next: 'insights-integration', consequence: 'birmingham_ecosystem_confidence', pattern: 'helping' },
      { text: "The interconnected nature is exactly what I was looking for.", next: 'jordan-current-passion', consequence: 'birmingham_system_appreciation', pattern: 'patience' }
    ]
  },

  'birmingham-certification-pathways': {
    id: 'birmingham-certification-pathways',
    text: "Samuel lists certifications on his fingers. \"Regions pays for Series 6 and 7 for financial advisors, Project Management Professional (PMP), Certified Financial Planner (CFP). UAB covers medical certifications, research ethics training, clinical data management. Southern Company funds engineering Professional Engineer licenses, safety certifications. The key? These certifications are portable - valuable at any Birmingham company.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "Which certifications offer the best return on investment?", next: 'birmingham-certification-roi', consequence: 'birmingham_education_strategy', pattern: 'analytical' },
      { text: "How do I choose the right certification path?", next: 'birmingham-career-assessment', consequence: 'birmingham_personalized_planning', pattern: 'building' },
      { text: "This feels like a smart way to build skills while working.", next: 'insights-integration', consequence: 'birmingham_education_confidence', pattern: 'helping' },
      { text: "Portable certifications reduce career risk.", next: 'jordan-no-waste-philosophy', consequence: 'birmingham_skill_security', pattern: 'patience' }
    ]
  },

  'birmingham-timeline-expectations': {
    id: 'birmingham-timeline-expectations',
    text: "Samuel checks his notes. \"Regions typically promotes customer service reps to personal bankers within 18-24 months with good performance. Personal banker to financial advisor takes another 2-3 years. UAB research assistants often become full-time researchers or lab managers within 2-4 years. The advantage of Birmingham? Companies invest in developing local talent because turnover is lower than big cities.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "What factors speed up advancement?", next: 'birmingham-advancement-accelerators', consequence: 'birmingham_growth_strategy', pattern: 'analytical' },
      { text: "How do I track my progress along these timelines?", next: 'birmingham-progress-metrics', consequence: 'birmingham_career_tracking', pattern: 'building' },
      { text: "These timelines feel realistic and encouraging.", next: 'insights-integration', consequence: 'birmingham_timeline_confidence', pattern: 'helping' },
      { text: "Lower turnover means stronger mentorship opportunities.", next: 'samuel-wisdom-validation', consequence: 'birmingham_mentorship_culture', pattern: 'patience' }
    ]
  },

  'bcs-partnership-details': {
    id: 'bcs-partnership-details',
    text: "Samuel pulls out a Birmingham City Schools partnership brochure. \"BCS needs IT support, tutoring coordinators, data analysts, and educational technology specialists. They partner with UAB Education, Innovation Depot for edtech development, and local nonprofits for community programs. Starting salary is $40-45K, but you're directly impacting Birmingham's future while building skills in education technology, data analysis, and community engagement.\"",
    speaker: 'Samuel Washington (Station Keeper)',
    choices: [
      { text: "What specific roles are available with BCS?", next: 'bcs-role-exploration', consequence: 'bcs_opportunity_details', pattern: 'analytical' },
      { text: "How do BCS skills transfer to other Birmingham sectors?", next: 'birmingham-transferable-skills', consequence: 'bcs_skill_portability', pattern: 'building' },
      { text: "Working in education feels meaningful and stable.", next: 'insights-integration', consequence: 'bcs_mission_alignment', pattern: 'helping' },
      { text: "Community impact work appeals to me.", next: 'devon-community-impact', consequence: 'bcs_community_connection', pattern: 'patience' }
    ]
  }




}

export function useSimpleGame() {
  const [gameState, setGameState] = useState<SimpleGameState>(() => {
    const userId = generateUserId()
    const savedProgress = loadProgress()

    return {
      hasStarted: false,
      currentScene: 'intro',
      messages: [],
      choices: [],
      isProcessing: false,
      userId,
      choiceHistory: savedProgress?.choiceHistory || [],
      characterRelationships: {
        samuel: { trust: 0, backstoryRevealed: [], lastInteraction: '' },
        maya: { confidence: 0, familyPressure: 5, roboticsRevealed: false },
        devon: { socialComfort: 0, technicalSharing: 0, groupProgress: false },
        jordan: { mentorshipUnlocked: false, pathsDiscussed: [], wisdomShared: 0 }
      },
      playerPatterns: {
        analytical: 0,
        helping: 0,
        building: 0,
        patience: 0
      },
      birminghamKnowledge: {
        companiesKnown: [],
        opportunitiesUnlocked: [],
        localReferencesRecognized: [],
        salaryDataRevealed: []
      }
    }
  })

  // Load current scene
  useEffect(() => {
    if (gameState.hasStarted) {
      const scene = SIMPLE_SCENES[gameState.currentScene as keyof typeof SIMPLE_SCENES]
      if (scene) {
        setGameState(prev => ({
          ...prev,
          messages: [{
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: scene.text,
            speaker: scene.speaker,
            type: 'narrative'
          }],
          choices: scene.choices
        }))
      }
    }
  }, [gameState.currentScene, gameState.hasStarted])

  const handleStartGame = useCallback(() => {
    setGameState(prev => ({ ...prev, hasStarted: true }))
  }, [])

  // Get contextual fallback based on source scene for intelligent emergency navigation
  const getContextualFallback = useCallback((sourceScene?: string): string => {
    if (!sourceScene) return 'maya-intro'

    // Character-specific fallbacks (maintain narrative coherence)
    if (sourceScene.startsWith('samuel-')) return 'samuel-wisdom-validation'
    if (sourceScene.startsWith('jordan-')) return 'jordan-permission-giving'
    if (sourceScene.startsWith('devon-')) return 'devon-collaboration-growth'
    if (sourceScene.startsWith('maya-')) return 'maya-intro'

    // Birmingham content fallbacks (keep local context)
    if (sourceScene.includes('birmingham') || sourceScene.includes('uab') || sourceScene.includes('regions')) return 'insights-integration'
    if (sourceScene.includes('southern-company')) return 'uab-comprehensive-overview'

    // Platform-specific fallbacks
    if (sourceScene.includes('platform')) return 'platform-discovery'

    // Default fallback
    return 'maya-intro'
  }, [])

  // Validate choice targets and provide contextual emergency fallback
  const validateChoice = useCallback((choice: any, sourceScene?: string) => {
    if (!choice?.next) {
      const fallback = getContextualFallback(sourceScene)
      console.warn(`[Navigation Validation] Choice missing .next property from scene "${sourceScene}". Using contextual fallback: "${fallback}"`, choice)
      return { ...choice, next: fallback }
    }

    if (!SIMPLE_SCENES[choice.next as keyof typeof SIMPLE_SCENES]) {
      const fallback = getContextualFallback(sourceScene)
      console.warn(`[Navigation Validation] Invalid choice target "${choice.next}" from scene "${sourceScene}". Using contextual fallback: "${fallback}". Available scenes:`, Object.keys(SIMPLE_SCENES).sort())
      return { ...choice, next: fallback }
    }

    return choice
  }, [getContextualFallback])

  const handleChoice = useCallback((choice: any) => {
    // Validate choice target first
    const validatedChoice = validateChoice(choice, gameState.currentScene)

    setGameState(prev => ({ ...prev, isProcessing: true }))

    // Track the choice
    trackUserChoice(gameState.userId, validatedChoice)

    // Save progress
    const newChoiceHistory = [...gameState.choiceHistory, validatedChoice.text]
    saveProgress({
      currentScene: validatedChoice.next || gameState.currentScene,
      choiceHistory: newChoiceHistory
    })

    // Move to next scene with character and pattern updates - IMMEDIATE processing
      setGameState(prev => {
        const newState = { ...prev }

        // Update player patterns based on choice
      if (validatedChoice.pattern && validatedChoice.pattern in prev.playerPatterns) {
          newState.playerPatterns = {
            ...prev.playerPatterns,
          [validatedChoice.pattern as keyof PlayerPatterns]: prev.playerPatterns[validatedChoice.pattern as keyof PlayerPatterns] + 1
          }
        }

        // Update character relationships based on consequences
      if (validatedChoice.consequence) {
        const updates = updateCharacterRelationships(prev, validatedChoice.consequence)
          newState.characterRelationships = updates.characterRelationships
          newState.birminghamKnowledge = updates.birminghamKnowledge
        }

        return {
          ...newState,
        currentScene: validatedChoice.next || prev.currentScene,
          choiceHistory: newChoiceHistory,
          isProcessing: false
        }
      })
  }, [gameState.userId, gameState.choiceHistory, gameState.currentScene])

  // Helper function to update character relationships
  const updateCharacterRelationships = (state: SimpleGameState, consequence: string) => {
    const newRelationships = { ...state.characterRelationships }
    const newBirminghamKnowledge = { ...state.birminghamKnowledge }

    // Samuel relationship updates
    if (consequence === 'samuel_trust+') {
      newRelationships.samuel.trust = Math.min(10, newRelationships.samuel.trust + 1)
      newRelationships.samuel.lastInteraction = 'trust_building'
    }
    if (consequence === 'samuel_backstory') {
      newRelationships.samuel.backstoryRevealed.push('engineering_background')
    }
    if (consequence === 'samuel_social_awareness') {
      newRelationships.samuel.trust = Math.min(10, newRelationships.samuel.trust + 2)
      newRelationships.samuel.backstoryRevealed.push('social_justice_awareness')
    }

    // Maya relationship updates
    if (consequence === 'maya_confidence+') {
      newRelationships.maya.confidence = Math.min(10, newRelationships.maya.confidence + 1)
    }
    if (consequence === 'maya_robotics_revealed') {
      newRelationships.maya.roboticsRevealed = true
      newBirminghamKnowledge.opportunitiesUnlocked.push('UAB Biomedical Engineering')
    }
    if (consequence === 'maya_family_pressure') {
      newRelationships.maya.familyPressure = Math.max(0, newRelationships.maya.familyPressure - 1)
    }

    // Devon relationship updates
    if (consequence === 'devon_technical_sharing+') {
      newRelationships.devon.technicalSharing = Math.min(10, newRelationships.devon.technicalSharing + 1)
    }
    if (consequence === 'devon_social_comfort+') {
      newRelationships.devon.socialComfort = Math.min(10, newRelationships.devon.socialComfort + 1)
    }
    if (consequence === 'devon_confidence+') {
      newRelationships.devon.socialComfort = Math.min(10, newRelationships.devon.socialComfort + 1)
      newRelationships.devon.technicalSharing = Math.min(10, newRelationships.devon.technicalSharing + 1)
    }

    // Jordan relationship updates
    if (consequence === 'jordan_mentorship') {
      newRelationships.jordan.mentorshipUnlocked = true
    }
    if (consequence === 'jordan_wisdom') {
      newRelationships.jordan.wisdomShared = Math.min(10, newRelationships.jordan.wisdomShared + 1)
    }

    // Birmingham knowledge updates - Major companies and institutions
    if (consequence === 'birmingham_uab') {
      newBirminghamKnowledge.companiesKnown.push('UAB Medical Center')
      newBirminghamKnowledge.localReferencesRecognized.push('UAB')
    }
    if (consequence === 'birmingham_innovation_depot') {
      newBirminghamKnowledge.companiesKnown.push('Innovation Depot')
      newBirminghamKnowledge.localReferencesRecognized.push('Innovation Depot')
    }
    if (consequence === 'birmingham_economic_history') {
      newBirminghamKnowledge.localReferencesRecognized.push('Sloss Furnaces', 'Red Mountain', 'Steel Industry Heritage')
    }
    if (consequence === 'birmingham_hidden_opportunities') {
      newBirminghamKnowledge.opportunitiesUnlocked.push('UAB Biomedical Technician', 'Amazon Robotics Maintenance', 'Cybersecurity Training')
      newBirminghamKnowledge.salaryDataRevealed.push('$65K Biomedical Tech', '$70K Robotics Maintenance')
    }
    if (consequence === 'birmingham_professional_network') {
      newBirminghamKnowledge.companiesKnown.push('Jeff State Community College', 'Amazon Bessemer', 'Downtown Banks')
    }

    // Career field specific knowledge
    if (consequence === 'birmingham_healthcare') {
      newBirminghamKnowledge.opportunitiesUnlocked.push('UAB Medical Center Careers', 'Children\'s Hospital', 'Healthcare Technology')
    }
    if (consequence === 'birmingham_tech') {
      newBirminghamKnowledge.opportunitiesUnlocked.push('Birmingham Tech Scene', 'Software Development', 'Data Analysis')
    }
    if (consequence === 'birmingham_engineering') {
      newBirminghamKnowledge.opportunitiesUnlocked.push('Southern Company Engineering', 'Manufacturing', 'Environmental Engineering')
    }

    return { characterRelationships: newRelationships, birminghamKnowledge: newBirminghamKnowledge }
  }

  const handleContinue = useCallback(() => {
    // Simple continue logic
    setGameState(prev => ({ ...prev, currentScene: 'intro' }))
  }, [])

  const handleShare = useCallback(() => {
    const insights = getUserInsights(gameState.userId)
    const birminghamMatches = getBirminghamMatches(gameState.userId)

    const shareText = `I've been exploring career paths in Birmingham!
Primary interest: ${insights.primaryInterest}
Birmingham opportunities found: ${birminghamMatches.length}
Check out this career exploration tool!`

    if (navigator.share) {
      navigator.share({
        title: 'My Birmingham Career Exploration',
        text: shareText,
        url: window.location.href
      }).catch(console.error)
    } else {
      navigator.clipboard?.writeText(shareText)
    }
  }, [gameState.userId])

  // Simple insights for analytics display
  const getInsights = useCallback(() => {
    return getUserInsights(gameState.userId)
  }, [gameState.userId])

  const getBirminghamOpportunities = useCallback(() => {
    return getBirminghamMatches(gameState.userId)
  }, [gameState.userId])

  return {
    ...gameState,
    currentScene: gameState.hasStarted ? SIMPLE_SCENES[gameState.currentScene as keyof typeof SIMPLE_SCENES] : null,
    handleStartGame,
    handleChoice,
    handleContinue,
    handleShare,
    getInsights,
    getBirminghamOpportunities
  }
}