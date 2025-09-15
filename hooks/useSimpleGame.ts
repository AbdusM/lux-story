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
    speaker: 'Samuel (Station Keeper)',
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
  'tech-intro': {
    id: 'tech-intro',
    text: "Platform 7: The Data Stream.\n\nPurple light shimmers across multiple screens displaying elegant code. You see a young man hunched over a laptop, completely absorbed.\n\nHe's muttering to himself about algorithms while simultaneously organizing his cables with mathematical precision.",
    speaker: 'Devon Williams (UAB Engineering Student)',
    choices: [
      { text: "That's beautiful code. What are you building?", next: 'devon-technical-passion', consequence: 'devon_technical_sharing+', pattern: 'building' },
      { text: "You ever notice how everyone says 'networking' like it's easy?", next: 'devon-social-struggle', consequence: 'devon_social_comfort', pattern: 'helping' },
      { text: "What Birmingham tech opportunities have you found?", next: 'devon-birmingham-tech-community', consequence: 'birmingham_tech', pattern: 'analytical' },
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
    text: "Platform 3: The Builder's Track. Warm orange light illuminates workbenches scattered with prototypes, blueprints, and tools. You notice someone around 35 examining different projects with a knowing smile - they've clearly seen many iterations of innovation. Their presence feels calm, unhurried.",
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
      { text: "Where would you find those people in Birmingham?", next: 'devon-birmingham-tech-community', consequence: 'birmingham_tech_community', pattern: 'building' },
      { text: "Your grandmother sounds wise. What else did she teach you?", next: 'devon-family-wisdom', consequence: 'devon_family_connection', pattern: 'helping' },
      { text: "Have you considered that explaining your work IS networking?", next: 'devon-teaching-realization', consequence: 'devon_communication_strength', pattern: 'analytical' },
      { text: "What would it feel like to stop apologizing for your passion?", next: 'devon-authentic-confidence', consequence: 'devon_self_acceptance', pattern: 'patience' }
    ]
  },

  'devon-birmingham-tech-community': {
    id: 'devon-birmingham-tech-community',
    text: "Devon pulls up a map on his laptop.\n\n\"Actually, there's the Innovation Depot downtown - they have hardware labs and maker spaces. UAB has environmental engineering groups working on exactly the kind of problems I'm solving.\n\nAnd there's a water quality monitoring meetup that meets at the Civil Rights Institute.\n\nPeople who understand that clean water is both a technical and social justice issue.\"",
    speaker: 'Devon Williams (UAB Engineering Student)',
    choices: [
      { text: "That sounds like your community. Have you connected with them?", next: 'southern-company-partnership', consequence: 'devon_social_growth', pattern: 'helping' },
      { text: "How does your technical work serve social justice?", next: 'birmingham-neighborhood-context', consequence: 'devon_purpose_connection', pattern: 'analytical' },
      { text: "Want help preparing for that meetup?", next: 'birmingham-partnership-opportunities', consequence: 'devon_practical_help', pattern: 'building' },
      { text: "Let's explore more career opportunities together.", next: 'insights-integration', consequence: 'devon_holistic_understanding', pattern: 'patience' }
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

  const handleChoice = useCallback((choice: any) => {
    setGameState(prev => ({ ...prev, isProcessing: true }))

    // Track the choice
    trackUserChoice(gameState.userId, choice)

    // Save progress
    const newChoiceHistory = [...gameState.choiceHistory, choice.text]
    saveProgress({
      currentScene: choice.next || gameState.currentScene,
      choiceHistory: newChoiceHistory
    })

    // Move to next scene with character and pattern updates
    setTimeout(() => {
      setGameState(prev => {
        const newState = { ...prev }

        // Update player patterns based on choice
        if (choice.pattern && choice.pattern in prev.playerPatterns) {
          newState.playerPatterns = {
            ...prev.playerPatterns,
            [choice.pattern as keyof PlayerPatterns]: prev.playerPatterns[choice.pattern as keyof PlayerPatterns] + 1
          }
        }

        // Update character relationships based on consequences
        if (choice.consequence) {
          const updates = updateCharacterRelationships(prev, choice.consequence)
          newState.characterRelationships = updates.characterRelationships
          newState.birminghamKnowledge = updates.birminghamKnowledge
        }

        return {
          ...newState,
          currentScene: choice.next || prev.currentScene,
          choiceHistory: newChoiceHistory,
          isProcessing: false
        }
      })
    }, 1000)
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