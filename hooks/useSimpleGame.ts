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
  jordan: { mentorshipUnlocked: boolean; pathsDiscussed: string[]; wisdomShared: number,

  'samuel-economic-transformation': {
    text: ""That's the heart of it, young traveler. Birmingham, like many cities built on industry, faced a choice: stagnate or adapt. The transition wasn't seamless, mind you. Many folks, like my father, struggled to find their footing in this new landscape. But we had a foundation – a strong work ethic, a resilient spirit, and a growing understanding of what the future demanded. UAB, in particular, became a beacon, drawing talent and investment, spinning off companies, and creating a ripple effect of innovation. Tech followed, recognizing the potential of a skilled workforce and a lower cost of living compared to, say, Silicon Valley." He pauses, looking thoughtful. "Now, the question is, how can *you* contribute to this ongoing story?"",
    choices: [
      { text: ""What kind of tech jobs are thriving here now?"", next: 'samuel-thriving-tech', consequence: 'birmingham_tech_jobs', pattern: 'analytical' },
      { text: ""How did Birmingham retrain its workforce for these new industries?"", next: 'samuel-workforce-retraining', consequence: 'birmingham_workforce_development', pattern: 'helping' },
      { text: ""It sounds like UAB was key. Are there research opportunities for students?"", next: 'maya-uab-research', consequence: 'uab_research_opportunities', pattern: 'building' },
      { text: ""Is this transformation still happening? What are the next challenges?"", next: 'samuel-transformation-future', consequence: 'birmingham_future_challenges', pattern: 'patience' }
    ]
  },

  'samuel-adaptation-wisdom': {
    text: ""Precisely! You’ve got a keen eye, young traveler. It wasn't just luck, it was grit. When those furnaces went cold, folks here didn't just sit around. They realized their skills were transferable, and learned new ones. Welders became robotics technicians, machinists became software engineers, all right here in the Magic City. Even my own grandmother, who used to sort coal, ended up teaching coding to kids at the Birmingham Public Library!"",
    choices: [
      { text: ""So, even old skills can be valuable in new careers?"", next: ''samuel-transferable-skills'', consequence: ''transferable_skills_importance'', pattern: ''analytical'' },
      { text: ""That's incredible! What kind of support was available for this transition?"", next: ''samuel-workforce-development'', consequence: ''birmingham_workforce_programs'', pattern: ''helping'' },
      { text: ""Did people resist the change, or was everyone on board?"", next: ''samuel-resistance-change'', consequence: ''change_management'', pattern: ''patience'' },
      { text: ""I still don't see how an industrial city becomes a medical and tech hub."", next: ''samuel-building-infrastructure'', consequence: ''birmingham_infrastructure_growth'', pattern: ''building'' }
    ]
  },

  'samuel-generational-change': {
    text: ""Exactly, young traveler. Time and patience. Change takes generations. It wasn't easy. My father, bless his soul, struggled to understand the rise of these…'silicon boxes', as he called them. He couldn’t fathom a future where steel wasn’t king. He saw the furnaces closing as a personal failure. But *we*, the next generation, had to see it as an opportunity. We had to adapt, to learn new skills, to build something new on the foundations he and others laid. Now, UAB is a national leader in research and healthcare, and tech companies are discovering Birmingham's potential. That takes time, and a willingness to embrace the future while respecting the past. What kind of future do *you* envision, standing here, in this station of possibilities?"",
    choices: [
      { text: ""A future where technology helps healthcare reach underserved communities."", next: 'future-healthcare-tech', consequence: 'interest_healthcare_technology', pattern: 'helping' },
      { text: ""A future where Birmingham becomes a hub for sustainable engineering solutions."", next: 'birmingham-sustainable-engineering', consequence: 'interest_sustainable_engineering', pattern: 'building' },
      { text: ""A future where skills are valued over degrees, and everyone has access to learning."", next: 'skills-future-of-work', consequence: 'interest_skills_gap', pattern: 'analytical' },
      { text: ""Honestly, I'm still trying to figure out what future I want."", next: 'self-discovery-reflection', consequence: 'career_exploration_open', pattern: 'patience' }
    ]
  },

  'samuel-personal-journey': {
    text: ""Samuel smiles, a network of wrinkles deepening around his eyes. \\n\\\"Secret, perhaps, is too dramatic. Let's call them... *unconventional*. They require more of you, more creativity, more hustle. But they exist. The key is understanding where the demand is, and crafting your skills to meet it, even if the signposts aren't brightly lit.\\n\\nThe traditional route is to aim directly for the established companies - UAB, Regions, Alabama Power. Solid institutions, certainly. But what about the smaller stops along the way? The growing startups downtown, the community organizations tackling real problems, the individual entrepreneurs forging their own paths?\\\" He pauses, tapping a finger against his temple. \\n\\\"Let's consider. The healthcare sector in Birmingham is booming, beyond just UAB. Are you aware of the biotech companies emerging from the Innovation Depot, specializing in personalized medicine? Or the nonprofits training community health workers to address disparities in underserved neighborhoods? Each requires a different skillset, a different approach.\\\""",
    choices: [
      { text: ""Tell me more about those community health worker roles."", next: 'community-health-worker-roles', consequence: 'interest_community_health, helping_pattern', pattern: 'helping' },
      { text: ""What startups should I be looking at in the Innovation Depot?"", next: 'innovation-depot-startups', consequence: 'interest_innovation_depot, analytical_pattern', pattern: 'analytical' },
      { text: ""So, bypass the big companies entirely? Isn't that risky?"", next: 'large-vs-small-companies', consequence: 'questioning_conventional, analytical_pattern', pattern: 'analytical' },
      { text: ""Actually, I'm more interested in how your own career path led you here. What was *your* unconventional route?"", next: 'samuel-personal-history', consequence: 'relationship_building, patience_pattern', pattern: 'patience' }
    ]
  },

  'samuel-systemic-critique': {
    text: ""A valid question, young traveler. It's not like the Birmingham Business Alliance prints up brochures on opportunities for underrepresented communities, now is it? These routes aren't advertised on the departure boards. They're whispered in breakrooms, discovered through late-night research, and sometimes, forged through sheer grit and determination. I've learned them through years of observation, through conversations with those who've navigated similar paths, and yes, sometimes, by stumbling and falling myself. I've also seen the city shifting, slowly, reluctantly, but shifting nonetheless. Programs are emerging, initiatives are starting. Are you interested in the sources, the whisperers, or the builders of these new paths?"",
    choices: [
      { text: ""Tell me about the whisperers – the folks sharing tips in the breakrooms."", next: 'samuel-whisperers', consequence: 'birmingham_informal_networks', pattern: 'helping' },
      { text: ""I want to see the blueprints – the organizations building new pathways."", next: 'samuel-blueprints', consequence: 'birmingham_pipeline_programs', pattern: 'building' },
      { text: ""Show me your research, the data that proves these routes are real."", next: 'samuel-data', consequence: 'birmingham_opportunity_analysis', pattern: 'analytical' },
      { text: ""Tell me about your stumbles. Sometimes learning what *doesn't* work is just as valuable."", next: 'samuel-mistakes', consequence: 'birmingham_realistic_expectations', pattern: 'patience' }
    ]
  },

  'samuel-systemic-change': {
    text: ""That's the question, isn't it?" Samuel responds, a flicker of something like hope in his eyes. "Are we building bridges that everyone can cross, or just extending ramps for a select few? These 'secret routes' I mentioned are not just about individual success, they're about challenging the very tracks we're running on. Sustainable change requires more than just exceptions; it demands systemic evolution, a complete overhaul of the engine driving opportunity. What aspects of this are you most curious about?"",
    choices: [
      { text: ""Tell me more about the power structures influencing career access in Birmingham."", next: 'samuel-power-structures', consequence: 'birmingham_power_dynamics', pattern: 'analytical' },
      { text: ""What resources exist to support underrepresented groups navigating these career paths?"", next: 'samuel-resource-navigation', consequence: 'birmingham_support_networks', pattern: 'helping' },
      { text: ""I'm interested in building these new routes. How can I contribute to a more equitable system?"", next: 'samuel-contributing-equity', consequence: 'agent_of_change_initiated', pattern: 'building' },
      { text: ""This is all overwhelming. Can we just focus on practical steps for me right now?"", next: 'samuel-practical-steps', consequence: 'refocused_personal_path', pattern: 'patience' }
    ]
  },

  'samuel-purpose-fulfillment': {
    text: ""Samuel nods slowly, stroking his beard. \"A potent question indeed. When moments fade into a seamless tapestry of focused energy, we often glimpse the threads of our true purpose. Tell me, young traveler, where does time seem to vanish for you?\"\n\nHe gestures toward a worn map of Birmingham, a finger tracing the outline of UAB Hospital and Red Mountain Park. \"Perhaps the answer lies somewhere in this city's heart...or in its future.\""",
    choices: [
      { text: ""I lose track of time when I'm explaining a complex idea to someone who's struggling."", next: ''samuel-teaching-gift'', consequence: ''samuel_mentoring_potential'', pattern: ''helping'' },
      { text: ""I lose track of time when I'm tinkering with a machine, trying to get it to work better."", next: ''samuel-problem-solver'', consequence: ''samuel_tinkerer_instinct'', pattern: ''building'' },
      { text: ""I lose track of time when I'm organizing data, looking for trends and connections."", next: ''samuel-data-insights'', consequence: ''samuel_information_affinity'', pattern: ''analytical'' },
      { text: ""I lose track of time when I'm patiently guiding a plant to grow or training an animal."", next: ''samuel-cultivation-strength'', consequence: ''samuel_nurturing_talent'', pattern: ''patience'' }
    ]
  },

  'path-commitment': {
    text: ""Ah, the sweet resonance of conviction! To choose a direction is to choose the wind that fills your sails. Tell me then, traveler, what future Birmingham horizon calls to you most strongly now? Though paths may diverge, all worthy endeavors contribute to the symphony of our city."",
    choices: [
      { text: ""I think I'm ready to dedicate myself to medicine and helping people directly. I want to see what opportunities are out there to gain experience."", next: 'medicine-commitment', consequence: 'committed_to_medicine', pattern: 'helping' },
      { text: ""I want to build something tangible, maybe a new tech startup. I'm ready to explore the local engineering and entrepreneurial ecosystem."", next: 'build-something', consequence: 'committed_to_building', pattern: 'building' },
      { text: ""I feel drawn to problem-solving, but I need to better understand how analytical skills can contribute to Birmingham's progress."", next: 'analytical-commitment', consequence: 'committed_to_problem_solving', pattern: 'analytical' },
      { text: ""Hold on a moment, Station Keeper. I need to remember what Maya, Devon, and Jordan had to say about their fields. Can we review their insights again?"", next: 'character-insights', consequence: 'gather_information', pattern: 'patience' }
    ]
  },

  'mentor-selection': {
    text: ""Wonderful! Decisiveness is a powerful engine, young traveler. Committing to a direction doesn't mean you can't change tracks later, mind you, but it focuses your energy. Now, to truly get you rolling, we need a conductor who knows that particular line well. \n\nI have a few experienced mentors waiting to guide you. Each one understands the landscape of Birmingham in their own way. But first, tell me, what kind of guide are you looking for? What qualities are most important to you in a mentor?"",
    choices: [
      { text: ""Someone who can push me beyond my comfort zone, challenge my assumptions."", next: 'mentor-challenge', consequence: '"mentor_preference_challenge"', pattern: 'analytical' },
      { text: ""Someone who's walked the path I'm considering, someone with practical, hands-on experience."", next: 'mentor-practical', consequence: '"mentor_preference_practical"', pattern: 'building' },
      { text: ""Someone who genuinely cares about helping others succeed, someone supportive and encouraging."", next: 'mentor-supportive', consequence: '"mentor_preference_supportive"', pattern: 'helping' },
      { text: ""I'm still not entirely sure what I need. Can you tell me more about the mentors available?"", next: 'mentor-profiles', consequence: '"mentor_clarification"', pattern: 'patience' }
    ]
  },

  'contemplation-space': {
    text: ""The whirlwind of possibilities can be overwhelming, I understand. Take a seat here, by this forgotten platform. Let the echoes of Birmingham’s past and the whispers of its future settle within you.\n\nSometimes, the greatest discoveries are made not in the frantic search, but in the quiet reflection. What is truly stirring in your heart, young traveler?"",
    choices: [
      { text: ""I'm drawn to Maya's passion for medicine and robotics. Can you tell me more about that intersection in Birmingham?"", next: 'medicine-robotics-exploration', consequence: 'medical_robotics_interest', pattern: 'analytical' },
      { text: ""Devon seemed so sure of his engineering path. What makes engineering so appealing in this city?"", next: 'engineering-opportunities', consequence: 'engineering_interest', pattern: 'building' },
      { text: ""Jordan's story resonated deeply. Is it really possible to make such a big career shift in Birmingham?"", next: 'career-change-success', consequence: 'career_change_interest', pattern: 'helping' },
      { text: ""Maybe I need to slow down and think about what *I* truly value. What kind of impact do I want to have?"", next: 'values-clarification', consequence: 'values_reflection', pattern: 'patience' }
    ],

  'samuel-economic-transformation': {
    text: ""That's the heart of it, young traveler. Birmingham learned to heal and innovate. The shift wasn't overnight, mind you. It was a slow burn, fueled by visionaries who saw the potential beyond the blast furnaces. UAB's growth into a world-class medical center was pivotal. Then came the tech boom, nurtured by places like Innovation Depot and now even the emergence of FinTech companies. But the soul of industry still pulses here, too. It just looks different now... advanced manufacturing, robotics, things your friend Maya might be interested in. Even engineering roles have adapted and expanded beyond what Devon might initially imagine. It’s about taking what we learned from the past and building a future with it. What intrigues you most about that evolution?"",
    choices: [
      { text: ""So, what kind of companies are driving this new Birmingham?"", next: 'samuel-companies-driving-change', consequence: 'birmingham_company_examples', pattern: 'analytical' },
      { text: ""What was the biggest challenge during that transition?"", next: 'samuel-transition-challenges', consequence: 'birmingham_transition_obstacles', pattern: 'patience' },
      { text: ""What role did education play in this transformation?"", next: 'samuel-education-transformation', consequence: 'birmingham_education_impact', pattern: 'helping' },
      { text: ""How can I contribute to Birmingham's future?"", next: 'samuel-contribute-future', consequence: 'birmingham_contribution_ideas', pattern: 'building' }
    ]
  },

  'samuel-adaptation-wisdom': {
    text: ""Precisely! The spirit of Birmingham never broke, just...re-forged itself. People saw the writing on the wall and didn't just lament the loss. They rolled up their sleeves and learned new trades, took risks on new ventures. My own aunt worked at Sloss, checking for impurities in the iron. When it closed, she went back to school at Lawson State Community College and became a licensed practical nurse. Now she works at St. Vincent's, helping folks heal. It's about finding new ways to use your inherent skills, see? What do you think made her succeed?"",
    choices: [
      { text: ""Hard work, plain and simple."", next: 'samuel-hard-work', consequence: 'birmingham_grit', pattern: 'patience' },
      { text: ""The support of the community, maybe programs to help people retrain?"", next: 'samuel-community-support', consequence: 'birmingham_community', pattern: 'helping' },
      { text: ""Identifying transferable skills – like attention to detail and problem-solving."", next: 'samuel-transferable-skills', consequence: 'skill_identification', pattern: 'analytical' },
      { text: ""She had an underlying passion for helping others, no matter the field."", next: 'samuel-underlying-passion', consequence: 'career_values', pattern: 'building' }
    ]
  },

  'samuel-generational-change': {
    text: ""That's right, young one. Change, true change, is like the slow burn of those furnaces – it takes time, commitment, and more importantly, understanding. My father didn't just build steel; he built a legacy. And now, it's up to the next generation to build on that. To take the lessons of the past and forge a new path, a path that includes everyone. But how do we ensure the future includes even those left behind? That's the real question." Samuel pauses, his eyes filled with a gentle, persistent hope.",
    choices: [
      { text: ""How can we help those whose skills don't immediately translate to the new economy?"", next: 'samuel-skills-gap', consequence: 'birmingham_skills_gap |', pattern: 'helping' },
      { text: ""What's the biggest obstacle to embracing change in Birmingham?"", next: 'samuel-obstacles', consequence: 'birmingham_challenges |', pattern: 'analytical' },
      { text: ""Should we be building on the industrial past, or creating something entirely new?"", next: 'samuel-industrial-future', consequence: 'birmingham_innovation |', pattern: 'building' },
      { text: ""It sounds like you're suggesting a lot of patience. But how do we accelerate progress?"", next: 'samuel-accelerating-progress', consequence: 'birmingham_future_pace |', pattern: 'patience' }
    ]
  },

  'samuel-systemic-critique': {
    text: ""An astute question. It's not like these routes are advertised, young traveler. One doesn't simply find them on the digital bulletin boards or career brochures.\n\nI've spent years here, observing the flow of people, the types of skills that truly open doors, and the systemic barriers that block others. I've spoken to countless souls who arrived here lost and overwhelmed, some who managed to navigate the maze, and others who unfortunately didn't.\n\nIt's a combination of empirical observation, historical awareness of Birmingham's economic landscape, and a deep understanding of how power and opportunity are often distributed unevenly. Some call it a critical eye, others simply lived experience. But that's how I've identified these less traveled routes. Now, are you curious about the details?"",
    choices: [
      { text: ""Tell me more about how Birmingham's history shapes these routes."", next: 'samuel-birmingham-history', consequence: 'understanding_birmingham_history', pattern: 'analytical' },
      { text: ""What systemic barriers have you observed firsthand?"", next: 'samuel-systemic-barriers', consequence: 'awareness_systemic_barriers', pattern: 'helping' },
      { text: ""Can you give me a specific example of a hidden opportunity?"", next: 'samuel-hidden-opportunity-example', consequence: 'specific_opportunity_awareness', pattern: 'building' },
      { text: ""I'm still not sure I believe you. This sounds like conspiracy."", next: 'samuel-doubt', consequence: 'none', pattern: 'patience' }
    ]
  },

  'samuel-systemic-change': {
    text: ""Samuel sighs, a faint sound like steam escaping an old engine. \"An excellent question, young traveler, and one that keeps me up at night. These pathways, while real, can sometimes feel…precarious. Sustainable? Perhaps not in their current form. But that's where *you* come in. Are they exceptions? I hope not. I believe the goal is to move them from exception to expectation, from hidden route to well-traveled platform.",
    choices: [
      { text: ""I want to analyze the data and understand what makes these programs successful."", next: 'samuel-data-driven-solutions', consequence: 'analytical_program_evaluation', pattern: 'analytical' },
      { text: ""I want to help others access these opportunities; mentor those who need guidance."", next: 'samuel-mentorship-matters', consequence: 'advocate_access_equity', pattern: 'helping' },
      { text: ""I want to design new programs, build the infrastructure for a more equitable future."", next: 'samuel-designing-equity', consequence: 'systemic_innovation', pattern: 'building' },
      { text: ""This all sounds overwhelming. Maybe I should just focus on my own path."", next: 'samuel-focus-on-self', consequence: 'reduced_systemic_impact', pattern: 'patience' }
    ]
  },

  'samuel-purpose-fulfillment': {
    text: ""Samuel nods thoughtfully, his gaze drifting towards the arched ceiling of the station. \"Ah, a vital question. The river of time is a powerful indicator. Tell me, traveler, what activities absorb you so completely that the clock seems to vanish? When are you truly present, lost in the task at hand?\""",
    choices: [
      { text: ""I love helping others learn new things."", next: ''samuel-knowledge-transfer'', consequence: ''samuel_kindred_spirit'', pattern: 'helping' },
      { text: ""I get fixated on taking things apart and seeing how they work."", next: ''samuel-anatomy-revelation'', consequence: ''samuel_mechanical_curiosity'', pattern: 'analytical' },
      { text: ""I enjoy building things with my hands, from furniture to complex robots."", next: ''samuel-creation-impulse'', consequence: ''samuel_tangible_creation'', pattern: 'building' },
      { text: ""I find peace in carefully crafting a single piece of art, perfecting every detail."", next: ''samuel-artistic-precision'', consequence: ''samuel_deliberate_hand'', pattern: 'patience' }
    ]
  },

  'path-commitment': {
    text: ""Ah, a firm hand on the throttle! Excellent. Tell me, young traveler, what direction calls to you most strongly? Remember the echoes of Birmingham, the opportunities you sensed in the air. Lay out your intention, and we'll see if the rails are truly aligned."",
    choices: [
      { text: ""I'm drawn to healthcare, like Maya. I want to explore opportunities at UAB or maybe even start my own clinic someday."", next: 'healthcare-commitment', consequence: 'healthcare_commitment', pattern: 'helping' },
      { text: ""Engineering resonates with me, especially after hearing Devon's experience. I want to contribute to Birmingham's growing tech sector."", next: 'engineering-commitment', consequence: 'engineering_commitment', pattern: 'building' },
      { text: ""Jordan's journey of career change inspired me. I'm thinking of exploring entrepreneurship and starting a business here in Birmingham."", next: 'entrepreneurship-commitment', consequence: 'entrepreneurship_commitment', pattern: 'building' },
      { text: ""I want to focus on giving back to the community. There are so many non-profits here in Birmingham that seem to be doing important work."", next: 'community-commitment', consequence: 'community_commitment', pattern: 'helping' }
    ]
  },

  'mentor-selection': {
    text: ""A wonderful decision! Committing is the first step to arrival. Now, every journey needs a guide, especially in a city brimming with opportunities like Birmingham. I can connect you with a mentor who understands the unique tracks ahead. Let's find the right person to help you navigate. Think about what kind of guidance you need..."",
    choices: [
      { text: ""I need someone who can dissect problems and help me build a solid plan, like an engineer."", next: 'mentor-engineering', consequence: 'mentor_type_engineering', pattern: 'analytical' },
      { text: ""I want a mentor who's passionate about helping others, someone focused on making a difference in Birmingham."", next: 'mentor-helping', consequence: 'mentor_type_helping', pattern: 'helping' },
      { text: ""I'm looking for someone who's a true builder, someone who understands the ins and outs of growing a business from the ground up here in Birmingham."", next: 'mentor-building', consequence: 'mentor_type_building', pattern: 'building' },
      { text: ""I need someone with unwavering patience, who can help me stay the course even when things get tough."", next: 'mentor-patience', consequence: 'mentor_type_patience', pattern: 'patience' }
    ]
  },

  'contemplation-space': {
    text: ""The hum of Grand Central is indeed a powerful lullaby, isn't it? Take your time, young traveler. The tracks leading to your future aren't going anywhere.\n\nSometimes, the loudest signals are the ones we almost miss in the station's din. Let's carve out a moment of quiet. Tell me, where does your mind wander when it's free from the timetable?"",
    choices: [
      { text: ""I'm still unsure how my skills could really *help* people in Birmingham."", next: 'help_in_birmingham', consequence: 'helping_focus', pattern: 'helping' },
      { text: ""Maybe I need to understand the *building* blocks of Birmingham's industries better - like a blueprint."", next: 'blueprint_birmingham', consequence: 'building_understanding', pattern: 'building' },
      { text: ""I think I need to be *patient* and explore outside my 'dream' field before I decide."", next: 'patience_path', consequence: 'broaden_horizons', pattern: 'patience' },
      { text: ""Actually, now I'm more confused than ever. Let's go back to what those conductors said."", next: 'career-exploration', consequence: 'reset_contemplation', pattern: 'analytical' }
    ],

  'samuel-economic-transformation': {
    text: ""That's right, young traveler. The spirit of innovation, it's always been here. We just needed to redirect it. When those furnaces closed, there was pain, real pain. But Birmingham had a secret weapon: UAB. The university became our anchor, expanding its medical reach and fostering research. That research, in turn, fueled the tech sector. Now we have thriving cybersecurity firms downtown and startups blossoming out of Innovation Depot. It wasn't easy, and the journey continues, but the seeds of a new economy have taken root."",
    choices: [
      { text: ""So UAB was the key? How did they manage that?"", next: 'samuel-uab-impact', consequence: 'uab_importance', pattern: 'analytical' },
      { text: ""What kind of tech jobs are actually *available* here now?"", next: 'birmingham-tech-jobs', consequence: 'birmingham_tech_opportunities', pattern: 'building' },
      { text: ""It sounds like a tough transition for the people who worked at Sloss Furnaces."", next: 'samuel-furnace-workers', consequence: 'birmingham_workforce_transition', pattern: 'helping' },
      { text: ""I still don't see how it all connects. Furnaces to hospitals and apps?"", next: 'samuel-economic-complexity', consequence: 'birmingham_economic_overview', pattern: 'patience' }
    ]
  },

  'samuel-adaptation-wisdom': {
    text: ""That's right, young one. The spirit of Birmingham lies not in steel alone, but in the grit to reinvent. People *did* adapt. Doctors became researchers, welders learned coding, and teachers like my sister took on helping small business owners to reach out to potential clients in the digital world. My neighbor even went from working at the plant to designing robots that are working on building new structures in space. It wasn't always easy, mind you, but the will was there. What kind of learning interests you?"",
    choices: [
      { text: ""I want to find people who can train me."", next: 'samuel-training-resources', consequence: 'training_opportunities |', pattern: 'helping' },
      { text: ""How did the city make it easier for people to learn new skills?"", next: 'samuel-city-support', consequence: 'city_programs |', pattern: 'analytical' },
      { text: ""I enjoy figuring things out on my own and creating things."", next: 'samuel-building-skills', consequence: 'self_learning_resources |', pattern: 'building' },
      { text: ""Can you tell me more about your sister and how she helps small businesses?"", next: 'samuel-sister-business', consequence: 'small_business_insights', pattern: 'patience' }
    ]
  },

  'samuel-generational-change': {
    text: ""Exactly. Time and patience. Change isn't a sprint, it's a marathon passed down through generations. My father built steel. I manage this station, guiding young folks like yourself toward their own furnaces of innovation. It’s about seeing the long game, understanding that each generation builds upon the last. Birmingham wasn’t *destroyed* when the mills closed. It *transformed*. The spirit remained, just…reimagined." He gestures towards a poster advertising UAB's biomedical engineering program. "It's still in our blood, that drive. Just now we’re forging…new tools, new medicines, new technologies. What will *you* forge, traveler?"",
    choices: [
      { text: ""How can I ensure *my* work makes a lasting difference, like your father's?"", next: 'samuel-lasting-impact', consequence: 'personal_legacy |', pattern: 'helping' },
      { text: ""So, what's the *next* big industry Birmingham is betting on?"", next: 'samuel-next-big-thing', consequence: 'birmingham_future_industries |', pattern: 'analytical' },
      { text: ""I want to build something tangible, like Sloss Furnaces, but for the 21st century."", next: 'devon-innovation-engineer', consequence: 'advanced_manufacturing_interest |', pattern: 'building' },
      { text: ""It's inspiring, but the change feels…slow. Is Birmingham really keeping up?"", next: 'samuel-birmingham-pace', consequence: 'birmingham_challenges |', pattern: 'patience' }
    ]
  },

  'samuel-personal-journey': {
    text: ""Samuel's eyes twinkle with a knowing light. \\n\\\"The map to success isn't always printed in bold letters, my friend. Sometimes, it's etched in the whispers of the city, in the connections you forge, and the grit you're willing to show.\\\" He gestures towards a faded map of Birmingham, subtly highlighting certain areas.\\n\\\"First, understand the power of apprenticeship and co-op programs, especially in fields like advanced manufacturing and automotive. Companies like Mercedes-Benz U.S. International and Honda Manufacturing of Alabama are constantly seeking bright minds. These programs aren't just stepping stones; they are fast tracks.\\n\\nSecond, leverage the resources available through organizations like Innovate Birmingham and the Birmingham Business Resource Center. They offer mentorship, funding opportunities, and networking events tailored to underserved communities. Learn to navigate grant applications, pitch competitions, and incubator programs. These can provide crucial resources to launch a venture, even without traditional financial backing.\\n\\nFinally, never underestimate the power of community. Organizations like Tech Birmingham work hard to create connections. Attend workshops, volunteer at events, and build relationships with professionals in your field. A kind word, a shared meal, a helping hand can often open doors you never knew existed.\\n\\nWhich of these routes most intrigues you right now? Where does your gut tell you to begin?\"",",
    choices: [
      { text: ""Tell me more about the manufacturing apprenticeship opportunities."", next: ''manufacturing-apprenticeship'', consequence: ''manufacturing_focused'', pattern: ''analytical'' },
      { text: ""I'm interested in learning how to navigate the Birmingham Business Resource Center."", next: ''business-resource-center'', consequence: ''business_resources'', pattern: ''helping'' },
      { text: ""Networking seems crucial. How can I effectively build connections in Birmingham's tech scene?"", next: ''birmingham-networking'', consequence: ''networking_tips'', pattern: ''building'' },
      { text: ""Actually, I need some time to digest all of this. Can we revisit this later?"", next: ''grand-central-main'', consequence: ''grand_central_main'', pattern: ''patience'' }
    ]
  },

  'samuel-systemic-critique': {
    text: ""An excellent question, one I've wrestled with myself for decades. These routes aren't advertised on any timetable, you see. They aren't spoken about in polished recruitment brochures. Their existence is... systemic, woven into the fabric of the city, but often obscured by prejudice and assumptions.\n\nI've gathered this knowledge through years of listening, observing, and sometimes, unfortunately, experiencing the barriers firsthand. I've spoken to folks who climbed from apprenticeship programs at Southern Research to leading innovative projects. I've learned of mentorship opportunities at UAB hidden within specific departments. I've even seen individuals leverage community college programs in advanced manufacturing to leap into robotics roles at local automotive plants. These paths are real, but require digging.\n\nSome information is passed through word-of-mouth, within specific communities or professional circles. Some are revealed through relentless research and networking. Others emerge from a willingness to forge your own way, pushing past preconceived notions and institutional roadblocks. Which aspect of this knowledge intrigues you most?"",
    choices: [
      { text: ""Tell me more about the role of apprenticeships. How can they be a starting point?"", next: 'samuel-apprenticeships', consequence: 'increased_apprenticeship_awareness', pattern: 'building' },
      { text: ""What are some effective strategies for uncovering these hidden opportunities yourself?"", next: 'samuel-self-advocacy', consequence: 'improved_research_skills', pattern: 'analytical' },
      { text: ""You mentioned overcoming prejudice. What kind of barriers are we talking about, specifically in Birmingham?"", next: 'samuel-birmingham-barriers', consequence: 'understanding_equity_challenges', pattern: 'helping' },
      { text: ""It sounds exhausting. Is there any central place where this information is gathered?"", next: 'samuel-information-hub', consequence: 'knowledge_resource_limitations', pattern: 'patience' }
    ]
  },

  'samuel-systemic-change': {
    text: ""That's the vital question, isn't it? Sustainability. Are we talking about a few fortunate souls finding loopholes, or a genuine shift? The truth, as with any grand project, is somewhere in between. Some of these routes are new initiatives, deliberately designed to create more access. Others are clever adaptations, born out of necessity and resilience. Think of the Lawson State Community College programs retraining workers for the burgeoning green energy sector, or the initiatives to connect Birmingham's underserved neighborhoods with tech bootcamps. \n\nIt's not perfect, not by a long shot. But the foundation is being laid. The question now becomes, will we build upon it, or let it crumble? What say you, traveler? Are you ready to examine the structures themselves?"",
    choices: [
      { text: ""How can I get involved in building these structures?"", next: 'samuel-building-structures', consequence: 'building_activism_awareness', pattern: 'building' },
      { text: ""What are the biggest obstacles to making these routes truly accessible?"", next: 'samuel-systemic-obstacles', consequence: 'analytical_inequity_awareness', pattern: 'analytical' },
      { text: ""I'm more interested in immediate opportunities for myself, not grand schemes."", next: 'samuel-back-immediate-opportunities', consequence: 'none', pattern: 'none' },
      { text: ""What organizations are leading the charge in creating these opportunities?"", next: 'samuel-leading-organizations', consequence: 'helping_community_awareness', pattern: 'helping' }
    ]
  },

  'samuel-purpose-fulfillment': {
    text: ""Ah, a most insightful question, young traveler. Where does time melt away, like snow in the Alabama sun? Let's delve deeper. Consider the activities that absorb you entirely, where effort feels less like labor and more like… well, like breathing. What pulls you in so completely that you forget the world outside these walls?"",
    choices: [
      { text: ""I love fixing things that are broken."", next: ''samuel-repair-instinct'', consequence: ''samuel_handson_aptitude'', pattern: ''building'' },
      { text: ""I enjoy helping others understand complex topics."", next: ''samuel-teaching-inclination'', consequence: ''samuel_communication_gifts'', pattern: ''helping'' },
      { text: ""I'm fascinated by designing and planning intricate systems."", next: ''samuel-planning-blueprint'', consequence: ''samuel_systems_thinking'', pattern: ''analytical'' },
      { text: ""I find joy in creating beautiful things, even if they're not useful."", next: ''samuel-aesthetic-drive'', consequence: ''samuel_artistic_sensitivity'', pattern: ''patience'' }
    ]
  },

  'path-commitment': {
    text: ""Ah, the sweet sound of a decision taking root. A fine feeling, like a train finally finding its track. Tell me then, young traveler, what direction feels strongest now? What kind of Birmingham journey calls to your soul?"",
    choices: [
      { text: ""I'm drawn to the idea of building things. Maybe construction or manufacturing?"", next: 'building-opportunities', consequence: '"interest_building"', pattern: 'building' },
      { text: ""I want to use my skills to help people. Maybe healthcare or social services?"", next: 'helping-opportunities', consequence: '"interest_helping"', pattern: 'helping' },
      { text: ""I'm interested in analyzing data and creating strategies. Maybe finance or tech?"", next: 'analytical-opportunities', consequence: '"interest_analytical"', pattern: 'analytical' },
      { text: ""Actually, I think I rushed this. I want to explore other routes still."", next: 'career-exploration', consequence: '"reduced_certainty"', pattern: 'patience' }
    ]
  },

  'mentor-selection': {
    text: ""Ah, a conductor's decision! Committing to a direction is no small feat, young traveler. It shows focus and a willingness to learn from someone who's already navigated that track. In Birmingham, we have many wise individuals eager to share their experiences. But before I connect you, tell me, what kind of guidance are you looking for? Which type of conductor resonates most with your chosen path?"",
    choices: [
      { text: ""I want someone who can break down complex problems and strategize with me. I need an analytical mind."", next: 'analytical-mentor', consequence: 'seeking_analytical_mentor', pattern: 'analytical' },
      { text: ""I need someone who's built something from the ground up in Birmingham. Someone who knows the ins and outs of creating."", next: 'building-mentor', consequence: 'seeking_building_mentor', pattern: 'building' },
      { text: ""I'm looking for someone compassionate and community-focused. Someone who uses their career to make a real difference."", next: 'helping-mentor', consequence: 'seeking_helping_mentor', pattern: 'helping' },
      { text: ""I want someone who's weathered storms and stayed the course. Someone with the patience and wisdom to guide me through the inevitable challenges."", next: 'patience-mentor', consequence: 'seeking_patience_mentor', pattern: 'patience' }
    ]
  },

  'contemplation-space': {
    text: ""The echoes of Grand Central hold more than just transit schedules, young one. They hold the quiet spaces where dreams take shape, where confusion clarifies. Take a moment here, by this forgotten clock tower. Its hands may be still, but time itself... that's always flowing, presenting new possibilities. The key is understanding which direction to step. Use this space to let the echoes of your experience settle in your heart. What feels most resonant?"",
    choices: [
      { text: ""I need to revisit Devon's work. The idea of building the future resonates, but I need to understand the 'how'."", next: ''devon-revisit'', consequence: ''revised_understanding_devon'', pattern: ''building'' },
      { text: ""Maybe helping people is the true path... I want to reconsider Maya's experiences in healthcare. Is there room for my own skills?"", next: ''maya-revisit'', consequence: ''revised_understanding_maya'', pattern: ''helping'' },
      { text: ""Jordan showed such a clear path for re-skilling... I need to see what resources are out there for me, specifically in Birmingham."", next: ''birmingham-resources'', consequence: ''birmingham_resource_investigation'', pattern: ''analytical'' },
      { text: ""This all feels so overwhelming. Maybe I'm not ready to leave my current platform. I need to take a break and re-center."", next: ''back-to-start'', consequence: ''reset_exploration'', pattern: ''patience'' }
    ],

  'samuel-economic-transformation': {
    text: ""That's part of it, young traveler. The world changed, and Birmingham had to change with it. But it wasn't just *shifting* like gears in a machine. It was more like… reincarnation. The spirit of innovation that forged iron and steel found a new body in medicine and technology. We learned from our past, adapted to the present, and built a future. Look closely. The framework for a strong work ethic was already here. Can you feel the same pulse in those new towers that you see in the old mills?"",
    choices: [
      { text: ""What were some of the challenges in making that transition?"", next: ''samuel-challenges-transition'', consequence: ''birmingham_challenges'', pattern: ''analytical'' },
      { text: ""So, how did Birmingham attract these new industries?"", next: ''samuel-attract-industries'', consequence: ''birmingham_growth_factors'', pattern: ''building'' },
      { text: ""My skills are in [player.skill]. How can I find my place in that reincarnation?"", next: ''samuel-personal-application'', consequence: ''personalized_advice'', pattern: ''helping'' },
      { text: ""It sounds like a tough time for the workers. What support was there?"", next: ''samuel-worker-support'', consequence: ''birmingham_social_programs'', pattern: ''patience'' }
    ]
  },

  'samuel-adaptation-wisdom': {
    text: ""Indeed, they did. Life is a river, constantly changing course. My father, a steel man through and through, always said, 'Learn something new every day, or get left behind.' Some of his colleagues took classes at Lawson State, retraining for new roles. Others moved into different sectors entirely. It wasn't easy, mind you. Painful, even. But Birmingham learned to build on its strengths, to value education and innovation. We didn’t forget the grit and determination forged in those furnaces, we just channeled it differently. Think about what it takes for a hospital to work. Or even a company like Shipt. They are all built on technology and helping others. It takes many people. What do you think it took for them to be successful?"",
    choices: [
      { text: ""So, Birmingham learned to build on its existing skills?"", next: 'samuel-building-birmingham', consequence: 'birmingham_skill_reuse', pattern: 'building' },
      { text: ""What specific new skills were most valuable during that transition?"", next: 'samuel-valuable-skills', consequence: 'birmingham_transition_skills', pattern: 'analytical' },
      { text: ""Was there help available for those who needed to retrain?"", next: 'samuel-retraining-help', consequence: 'birmingham_retraining_programs', pattern: 'helping' },
      { text: ""I bet some people were resistant to change."", next: 'samuel-resistance-change', consequence: 'birmingham_change_resistance', pattern: 'patience' }
    ]
  },

  'samuel-generational-change': {
    text: ""You're right, young traveler. Change doesn't happen overnight. My father saw the slow burn of progress, the gradual shift from the roar of the furnace to the hum of microchips. It takes time, patience, and the willingness of each generation to build upon the foundation laid by the last. Birmingham isn't just steel anymore, but it still carries the spirit of innovation. Now, the next generation is building apps instead of bridges, designing robots instead of railroads, and engineering biotech instead of blast furnaces. It takes guts, grit, and a whole lot of grace. We must remember where we come from, or we lose the path to where we are going."",
    choices: [
      { text: ""So, the key is to respect the past while embracing the future?"", next: 'samuel-legacy-innovation', consequence: 'birmingham_cultural_heritage', pattern: 'analytical' },
      { text: ""But what if the past was... flawed? What if those foundations were built on injustice?"", next: 'samuel-facing-the-past', consequence: 'birmingham_civil_rights', pattern: 'helping' },
      { text: ""If it takes so long, is there really any point in trying to make a difference *now*?"", next: 'samuel-individual-impact', consequence: 'self_doubt', pattern: 'patience' },
      { text: ""I just want to find a fulfilling career, not solve the world's problems."", next: 'samuel-practical-career', consequence: 'career_focus', pattern: 'building' }
    ]
  },

  'samuel-systemic-critique': {
    text: ""A fair question indeed. These routes aren't published in any timetable, nor are they announced over the loudspeaker. I've seen the system from the inside, young traveler, and from the outside. Years spent navigating the labyrinthine hiring practices of companies in Birmingham, both grand and modest, leave an imprint on the mind. I've witnessed the biases, the assumptions, the missed connections. I've seen talented people, bursting with potential, stranded because they didn't 'fit' the mold. My insights come from them, too, from listening to their stories and piecing together the gaps. It's a patchwork quilt of observation, experience, and a healthy dose of skepticism."",
    choices: [
      { text: ""So it's about understanding the hidden game being played?"", next: 'samuel-hidden-game', consequence: 'understanding_bias', pattern: 'analytical' },
      { text: ""Can you give me an example of a 'hidden' route?"", next: 'samuel-hidden-route-example', consequence: 'hidden_route_example_given', pattern: 'building' },
      { text: ""What can *I* do to help change this system?"", next: 'samuel-change-the-system', consequence: 'civic_responsibility', pattern: 'helping' },
      { text: ""This feels unfair. Why even bother if the system is rigged?"", next: 'samuel-system-discouraged', consequence: 'challenged_by_inequity', pattern: 'patience' }
    ]
  },

  'samuel-systemic-change': {
    text: ""Samuel sighs, a puff of air that seems to echo the anxieties of countless travelers passing through the station. \"A critical question, indeed. Too often, what appears as progress is merely a localized flourish, a temporary bloom in a field that remains largely barren. These 'routes' I speak of, the opportunities for those traditionally excluded, are they structurally sound, or merely fragile scaffolding? It's a question I grapple with daily.\n\nConsider this: Birmingham's burgeoning tech scene offers incredible potential, but are coding bootcamps enough to truly level the playing field? Or do we need systemic change in education, access to capital, and mentorship to ensure genuine equity?\n\nWe can't mistake a single successful journey for a guarantee of safe passage for all. The work requires more than individual initiative; it demands a collective commitment to building a truly equitable system. Which aspect of this challenge most resonates with you?\""",
    choices: [
      { text: ""What systemic changes are *actually* happening in Birmingham?"", next: 'samuel-systemic-change-details', consequence: 'birmingham_systemic_changes', pattern: 'analytical' },
      { text: ""How can I, as an individual, contribute to this change?"", next: 'samuel-individual-action', consequence: 'individual_impact', pattern: 'helping' },
      { text: ""Let's focus on those coding bootcamps. Are they truly effective?"", next: 'samuel-coding-bootcamps', consequence: 'bootcamp_effectiveness', pattern: 'building' },
      { text: ""This feels overwhelming. Where do I even begin to understand the problem?"", next: 'samuel-overwhelmed', consequence: 'understanding_system', pattern: 'patience' }
    ]
  },

  'samuel-purpose-fulfillment': {
    text: ""Ah, the sweet oblivion of purpose! Tell me more. When does the world fade away, and only the task remains? Is it in meticulous detail, or in the act of lending a hand? Perhaps it lies in the gradual shaping of something new, or the quiet comfort of consistent care?\n\nThink carefully. The answers are whispers on the wind, but echoes of your true calling."",
    choices: [
      { text: ""I lose track of time when I'm helping someone understand a difficult concept."", next: ''samuel-empathy-exploration'', consequence: ''samuel_compassionate_heart'', pattern: 'helping' },
      { text: ""I lose track of time when I'm meticulously planning and organizing a complex project."", next: ''samuel-planning-proficiencies'', consequence: ''samuel_structural_mind'', pattern: 'analytical' },
      { text: ""I lose track of time when I'm building something with my hands, piece by piece."", next: ''samuel-creation-contemplation'', consequence: ''samuel_maker_spirit'', pattern: 'building' },
      { text: ""I lose track of time when I'm patiently tending to something that needs careful attention over a long period."", next: ''samuel-patience-pursuit'', consequence: ''samuel_steadfast_soul'', pattern: 'patience' }
    ]
  },

  'path-commitment': {
    text: ""Ah, the chimes of commitment are a welcome sound! So, tell me, which platform feels like home? What direction calls to your heart and mind most strongly?\n\nRemember, commitment isn't a cage, it's a compass. It points you true, but doesn't prevent course corrections along the way."",
    choices: [
      { text: ""I'm drawn to healthcare innovation! Building medical devices, improving patient outcomes...that feels right."", next: 'healthcare-innovation-focus', consequence: ''healthcare_innovation_interest'', pattern: 'building' },
      { text: ""I want to help people directly. Maybe social work, or connecting Birmingham residents with vital resources."", next: 'community-impact-focus', consequence: ''community_impact_interest'', pattern: 'helping' },
      { text: ""I love the idea of designing and constructing things! Civil engineering, architecture... leaving a lasting mark on Birmingham's skyline."", next: 'design-construction-focus', consequence: ''design_construction_interest'', pattern: 'building' },
      { text: ""Actually, I feel like I need a moment to refine my direction. Maybe something more subtle, that connects all the paths I have explored."", next: 'explore-intersection', consequence: ''exploration_refined'', pattern: 'analytical' }
    ]
  },

  'mentor-selection': {
    text: ""That's excellent to hear, young traveler! Committing to a direction doesn't mean closing doors, but rather focusing your energy. Now, the trick is finding the right guide for this stage of your journey. In Birmingham, we have folks who've charted similar courses, ready to share their wisdom. Tell me, what kind of support feels right to you right now?"",
    choices: [
      { text: ""I need someone who can show me the ropes, day-to-day realities. A practical guide."", next: 'mentor-practical', consequence: 'practical_mentor', pattern: 'building' },
      { text: ""I'm looking for someone who can connect me to the right people and opportunities."", next: 'mentor-connector', consequence: 'connector_mentor', pattern: 'helping' },
      { text: ""I need someone who can help me think critically and strategically about my goals."", next: 'mentor-strategist', consequence: 'strategist_mentor', pattern: 'analytical' },
      { text: ""Actually, I'm feeling overwhelmed again. Can we revisit those self-reflection exercises?"", next: 'insights-integration', consequence: 'self_reflection_review', pattern: 'patience' }
    ]
  },

  'contemplation-space': {
    text: ""Ah, the quiet strength of the waiting room. A space for echoes, for reflections... wise choice. Let the voices mingle in your mind, young traveler. Take a seat, breathe deep. Sometimes, the clearest path reveals itself in the stillness. \n\nAre there any particular echoes rattling around that you want to examine? Perhaps I can offer a quiet lantern to illuminate them a bit further?"",
    choices: [
      { text: ""I'm still confused about how my love for building things fits with my desire to help people."", next: 'building-helping-dilemma', consequence: 'building_vs_helping', pattern: 'analytical' },
      { text: ""I'm feeling drawn to Birmingham, but I don't know if it's the right place for the kind of ambitious career I want."", next: 'birmingham-ambition', consequence: 'birmingham_ambition_doubt', pattern: 'analytical' },
      { text: ""I'm having trouble seeing the practical steps to get from where I am now to where I want to be."", next: 'practical-pathways', consequence: 'practical_steps_needed', pattern: 'building' },
      { text: ""Actually, just being here in silence is helping. Maybe I'll revisit everything later."", next: 'insights-integration', consequence: 'self_reflection', pattern: 'patience' }
    ]
  }
  }
  }
  } }
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
  currentDialogueIndex: number
  isShowingDialogue: boolean
  dialogueChunks: Array<{ text: string; type: string }>
}

// Enhanced scene data with character depth and Birmingham integration
const SIMPLE_SCENES = {
  'intro': {
    id: 'intro',
    text: "\"Seek methodical solutions to complex problems.\" or \"Develop a step-by-step plan to address the challenge.\"",
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
    text: "You find a man in his fifties adjusting an old mechanical clock, his movements precise and patient.\n\nHe looks up with kind eyes that have seen many travelers pass through.\n\n\"Welcome to Grand Central. It seems your train has yet to arrive on the platform. That's quite alright, young traveler.\"\n\n\"Indeed, it seems every soul who finds themselves here is looking for the right track, the right destination on the great journey.",
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
    text: "Platform 1: The Care Line.\n\nSoft blue light bathes everything in warmth.\n\nYou notice a young woman studying at a table covered with both anatomy books and what looks like robotics components.\n\nShe looks up, anxiety flickering across her face.",
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
    text: "\"Biomedical engineering blends analytical problem-solving with hands-on design and creation of medical solutions.  It might be a good fit.\"",
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
    text: "\"Two decades of dedication deserves recognition.\" or \"The consistent effort over twenty years shows deep commitment.\"",
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
    text: "Maya's eyes brighten for the first time in the conversation.\n\n\"I've been building medical robots since sophomore year. Tiny surgical assistants that could reduce human error, prosthetics that respond to thought patterns, diagnostic systems that never get tired.\"\n\n\"My parents see them as 'hobbies' - expensive distractions from 'real medicine.' But what if engineering IS real medicine?\"",
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
    text: "Maya wipes tears from her eyes.\n\n\"Twenty years. Mom learning English while Dad studied for board exams.\"\n\n\"They'd quiz each other at 2 AM after their shifts.\"\n\n\"Every dollar saved, every birthday they worked through, every dream they deferred - all so I could be 'successful.'\"\n\n\"Their love feels like golden handcuffs. How do I honor their sacrifice without sacrificing myself?\"",
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
    text: "Maya's voice cracks.\n\n\"Dad tells everyone about 'my future daughter the doctor.' Mom already picked out my specialty - cardiology, like Dr. Chen who helped Dad get his residency.\"\n\n\"They've planned my entire life: med school, residency, fellowship, marriage to another doctor, grandchildren they can brag about.\"\n\n\"I feel like a character in their American Dream screenplay.\"",
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
    text: "Maya pulls up her laptop, showing dual spreadsheets.\n\n\"I've actually calculated this. MD-PhD programs take longer but offer research funding.\"\n\n\"I could develop medical robotics while getting the credentials my parents respect.\"\n\n\"Seven years instead of four, but I'd emerge as both doctor and engineer. It's not compromise - it's strategic integration.\"",
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
    text: "Platform 7: The Data Stream.\n\nPurple light shimmers across multiple screens displaying elegant code.\n\nYou see a young man hunched over a laptop, completely absorbed.\n\nHe's muttering to himself about algorithms while simultaneously organizing his cables with mathematical precision.",
    speaker: 'Devon Kumar (UAB Engineering Student)',
    choices: [
      { text: "That's beautiful code. What are you building?", next: 'devon-technical-passion', consequence: 'devon_technical_sharing+', pattern: 'building' },
      { text: "You ever notice how everyone says 'networking' like it's easy?", next: 'devon-social-struggle', consequence: 'devon_social_comfort', pattern: 'helping' },
      { text: "What Birmingham tech opportunities have you found?", next: 'devon-tech-ecosystem-research', consequence: 'birmingham_tech', pattern: 'analytical' },
      { text: "Mind if I sit? You look like you understand systems.", next: 'devon-systems-thinking', consequence: 'devon_trust+', pattern: 'patience' }
    ]
  },

  'devon-technical-passion': {
    id: 'devon-technical-passion',
    text: "Devon's whole demeanor changes. He straightens up, eyes bright.\n\n\"It's a water filtration monitoring system for Birmingham's Village Creek. Particulate sensors feeding real-time data to environmental engineers.\"\n\n\"But the beautiful part is the cascading cleanup algorithm - each sensor learns from upstream patterns.\"\n\nHe pauses, suddenly self-conscious. \"Sorry, I get excited about systems.\"",
    speaker: 'Devon Kumar (UAB Engineering Student)',
    choices: [
      { text: "Don't apologize! Your passion makes it fascinating.", next: 'devon-confidence-building', consequence: 'devon_confidence+', pattern: 'helping' },
      { text: "How does this help Birmingham's environmental challenges?", next: 'devon-community-impact', consequence: 'devon_impact_awareness', pattern: 'analytical' },
      { text: "Have you thought about teaching or technical training?", next: 'devon-teaching-realization', consequence: 'devon_career_path', pattern: 'patience' },
      { text: "Could you demo this at the Innovation Depot?", next: 'devon-innovation-depot', consequence: 'birmingham_innovation_depot', pattern: 'building' }
    ]
  },

  'devon-social-struggle': {
    id: 'devon-social-struggle',
    text: "Devon looks up, making brief eye contact before looking away.\n\n\"Exactly! Like it's as simple as solving a differential equation. At least equations have right answers.\"\n\n\"You talk to people and you never know if you said the right thing until it's too late to fix it.\"\n\n\"I made flowcharts for small talk once, but people don't follow scripts.\"",
    speaker: 'Devon Kumar (UAB Engineering Student)',
    choices: [
      { text: "I feel the same way. People are complicated.", next: 'devon-shared-understanding', consequence: 'devon_social_comfort+', pattern: 'helping' },
      { text: "Maybe you need jobs that work with your communication style?", next: 'devon-accommodation-discussion', consequence: 'devon_self_advocacy', pattern: 'analytical' },
      { text: "What happened when people didn't follow your flowcharts?", next: 'devon-failure-learning', consequence: 'devon_growth_mindset', pattern: 'patience' },
      { text: "Have you found any Birmingham tech spaces that feel comfortable?", next: 'devon-safe-spaces', consequence: 'birmingham_tech_community', pattern: 'building' }
    ]
  },
  'engineering-intro': {
    id: 'engineering-intro',
    text: "Platform 3: The Builder's Track.\n\nWarm orange light illuminates workbenches scattered with prototypes, blueprints, and tools.\n\nYou notice someone around 35 examining different projects with a knowing smile.\n\nThey've clearly seen many iterations of innovation. Their presence feels calm, unhurried.",
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
    text: "Jordan chuckles warmly.\n\n\"Seven different careers, to be precise. Started in computer science at Alabama A&M, dropped out to join a startup.\"\n\n\"Sold phones at the Galleria while learning graphic design. Marketing firm, personal trainer, Uber driver while learning to code.\"\n\n\"Now I'm a UX designer for a Birmingham health tech company and teach coding bootcamps.\"\n\nThey pause.\n\n\"Everyone else will tell you their straight path to success. I'm here to tell you about the scenic route.\"",
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
    text: "Jordan sets down the prototype they were examining.\n\n\"Here's my advice, and it's not what your parents want to hear:\n\nStop trying to choose the right path.\n\nStart trying to choose the next interesting problem.\"\n\n\"Birmingham's got problems to solve - healthcare accessibility, education gaps, urban renewal, tech inequality.\"\n\n\"Pick one that makes you curious.\"",
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
    text: "Samuel's expression softens.\\n\\n\\\"I've seen many young travelers pass through this station, each with their own map and compass. More than I can count, really.\\n\\nAnd I've observed, those who believe their path is already laid, often find themselves on a train heading in a direction they didn't foresee.\\n\\nRecognizing the unknown ahead? That's not a stumble, young traveler, but the very ground on which wisdom grows. \\n\\nCome, let me share a view from a different platform.\\\"",
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
    text: "Samuel nods knowingly.\\n\\n\\\"Ah, the family compass... I imagine its needle points toward a destination that feels… different from the one in your heart?\\\"\\n\\nHe leans against the wall.\\n\\n\\\"Many young travelers arrive at this platform, carrying a similar weight. They feel the pull of a family's journey, a journey paved with sacrifice, and find themselves yearning for a different track.\\n\\nThe important thing, young traveler, is to remember that their train may not be *your* train. And that's alright.\\\"",
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
    text: "Samuel's eyes soften with understanding.\\n\\n\\\"That's the language of the rails – the need to keep the engine running, the lamps lit. A worthy pursuit.\\\"\\n\\nHe opens a well-worn notebook.\\n\\n\\\"Birmingham holds many platforms, young traveler. Let's consider what each journey truly offers: the starting wage, the long-term benefits, which tracks allow for further travel and which, sadly, lead to a siding.\\\"",
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
    text: "Samuel chuckles softly.\\n\\n\\\"Young traveler, Birmingham reinvented its tracks more than twice in my own seasons. To say there are no paths here is to only see what lies directly under one's feet.\\\"\\n\\nHe gestures toward the platforms.\\n\\n\\\"Those trains heading to UAB Medical Center, Innovation Depot, Regions Bank, Southern Company... they carry opportunities birthed right here. The journey often begins where one least expects.\\\"",
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
    text: "Samuel walks you to a window overlooking the city.\\n\\n\\\"See that picture there, young traveler? Sloss Furnaces, 1975. My father's spirit rests somewhere in that frame, covered in the dust of his labor, his heart brimming with purpose.\\n\\nWhen the great mills fell silent, many believed this city's journey had reached its end.\\n\\nBut look out upon the horizon now - UAB Medical Center, Innovation Depot, Protective Life, each a new tower reaching for its own sky. What do you think allowed the train to stay on the tracks?\\\"",
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
    text: "Samuel nods, his gaze thoughtful.\\n\\n\\\"You speak a truth, young traveler. This new Birmingham, like a train pulling some cars but not all, hasn't carried every soul to the same destination. Perhaps that is why this station called to me.\\n\\nFor those from paths like ours, it's important to understand this: the journey to those gleaming towers isn't solely for those born on a privileged platform. \\n\\nThere are less-traveled routes, hidden platforms, waiting to be discovered. Would you like me to share what I've learned of them?\\\"",
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
    text: "Samuel leans in conspiratorially.\n\n\"UAB Medical Center? They need more than doctors. Biomedical equipment technicians make $65K starting, with a two-year degree from Jeff State.\n\nAmazon facility in Bessemer? Robotics maintenance folks pull in $70K, and they'll train you.\n\nDowntown banks? Desperate for cybersecurity people - you can learn that online for free if you know where to look.\"",
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
    text: "Samuel sets down his tools and gives you his full attention.\n\n\"My method, young traveler? It's less about pointing the way, and more about helping you find the map within yourself.\n\nMany arrive at this platform seeking answers already etched in stone, but the true treasure lies in crafting the right questions to illuminate your path.\n\nPerhaps ponder this: What landscapes naturally draw your eye? What grand structure would rise if time held no sway? And upon what task does time itself seem to lose its hurried pace?",
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
    text: "Young traveler, I see you've been walking many platforms, listening to the voices of experienced conductors.\n\nThe air here feels different now, doesn't it? Not so much a clamor, but a gentle meeting of paths.\n\nTell me, what songs do you hear calling to you?",
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
    text: "Samuel adjusts his pocket watch and smiles. He pulls out a worn, leather-bound journal.\n\n\\\"The tracks of your journey through the station tell a tale... a tale of careful consideration. It seems you gather information like a seasoned surveyor charting new lands, offer a steady hand to those whose train has momentarily stalled, and possess the vision to build where the path ahead is unclear. And perhaps most importantly, young traveler, you understand the virtue of patience when the signals are uncertain.\n\nBirmingham, as it happens, offers platforms well-suited to these very qualities.\\\"",
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
    text: "Samuel sets down his tools and looks directly at you.\n\n\\\"Fifteen years ago, I found myself charting circuits at Southern Company. The rails there gleamed with opportunity, prestige, a certain kind of shine.\n\nBut my journey often crossed paths with young travelers from Ensley, Fairfield – echoes of where my own track began. They seemed unaware that such a route was even possible.\n\nOne Sunday, after the hymns had faded, a young man asked me, 'How does someone like us find a platform like yours?'\n\nThat simple question... it rearranged the entire journey ahead.\\\"",
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
    text: "Samuel chuckles.\n\n\"I took a 40% pay cut to run a mentorship program at the Birmingham Public Library. My wife thought I'd lost my mind.\n\nBut when the city created Grand Central Terminus as a career exploration center, they needed someone who understood both where Birmingham had been and where it was going.\n\nSomeone who could speak to kids from Ensley and Mountain Brook alike.\"",
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
    text: "Maya's hands shake slightly.\n\n\"My parents came here with nothing in 1995. Dad did his residency at UAB while Mom worked double shifts as a nurse getting her credentials recognized.\n\nEvery sacrifice, every missed dinner, every time they chose work over family time - it was all so I could have this 'better life.'\n\nHow do I tell them their dream for me feels like a prison?\"",
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
    text: "Maya's eyes widen.\n\n\"UAB does have an MD-PhD program in biomedical engineering.\"\n\n\"It's seven years instead of four, but...\"\n\nShe pulls up the program on her laptop.\n\n\"Look at this - they're developing robotic surgical systems, AI diagnostic tools, prosthetics research.\"\n\n\"My parents would see the MD, but I'd be building the future of medicine.\"",
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
    text: "Maya takes a deep breath, her shoulders relaxing for the first time. \"You know what? I think I've been so focused on avoiding disappointment that I forgot to pursue fulfillment.\n\nMy parents sacrificed everything so I could have choices.\n\nMaybe the greatest way to honor that sacrifice is to actually make those choices - authentically.\n\nThank you for helping me see that gratitude and authenticity aren't opposites.\"",
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
    text: "Maya slowly nods, wiping away tears.\n\n\"You're right.\n\nTheir love gave me opportunities, not obligations.\"\n\n\"They came to America so I could choose my own path, not follow theirs.\"\n\n\"I think... I think they'd be prouder of me for building something meaningful than for just following their plan.\"\n\n\"Their sacrifice was about opening doors, not closing them.\"",
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
    text: "Maya's eyes light up with possibility.\n\n\"Excellence. Yes.\"\n\n\"What if I showed them that excellence isn't just about following their path, but about mastering my own?\"\n\n\"My robotics work has won three engineering competitions.\"\n\n\"My research proposal got accepted to UAB's summer program.\"\n\n\"I'm not failing their dreams - I'm excelling at my own.\"",
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
    text: "Maya pulls out her phone, scrolling through videos.\n\n\"I could show them my surgical robot prototype.\n\nIt performed a simulated appendectomy with 99.7% precision - better than the average resident.\n\nOr this prosthetic hand that responds to muscle signals.\"\n\n\"I've been hiding my best work because I was afraid they'd see it as distraction from 'real medicine.'\n\nBut this IS real medicine.\"",
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
    text: "Maya introduces you to Dr. James Thompson, who works at UAB.\n\n\"I was a cardiac surgeon for ten years,\" he says, \"then founded a medical device company.\"\n\n\"Now my artificial hearts save more lives than I ever could in the OR.\"\n\n\"The best doctors heal one patient at a time.\"\n\n\"The best engineers heal thousands.\"",
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
    text: "Devon's posture changes completely.\n\n\"You know, my grandmother always said 'Baby, you don't need to be everybody's friend. You just need to find your people - the ones who speak your language.'\"\n\n\"Maybe that's what I've been missing.\"\n\n\"I've been trying to network with everyone instead of finding the people who get excited about water filtration algorithms.\"",
    speaker: 'Devon Kumar (UAB Engineering Student)',
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
    text: "Samuel opens a detailed Birmingham map.\n\n\"Let's talk reality. If you're working downtown - UAB, Innovation Depot, the banks - you've got options.\n\nLive in Five Points South for the young professional scene, $1,200 for a one-bedroom. Avondale's got character and breweries, $900 apartments.\n\nForest Park if you want suburban feel but can't afford Mountain Brook yet. Each choice shapes your daily life and career network.\"",
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
    text: "Samuel nods thoughtfully. \"$35K in Birmingham goes further than Atlanta or Nashville.\n\nRent should be max $875 - that's 30% of your income. You can find decent places in Woodlawn, Crestwood North, parts of Southside for $700-800.\n\nKeep $200 for utilities, $300 for food, $150 for transportation.\n\nLeaves you $1,000 for savings, student loans, and actually having a life. It's doable here.\"",
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
    text: "Samuel gently slides a folder marked 'Partnership Programs' across the table.\\n\\n\\\"These aren't mere destinations, young traveler, but rather potential platforms along your journey.\\n\\nUAB offers opportunities to learn your craft whilst earning passage. Birmingham City Schools seeks guides for young minds in tech and learning - a chance to cultivate empathy and understanding. \\n\\nRegions Bank has a path to apprenticeship in financial services. And Southern Company... their engineering co-ops can often lead to a long and steady route onward.\\\"",
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
    text: "Samuel leans forward.\\n\\n\\\"Regions offers a journey into Financial Services, an apprenticeship lasting eighteen months. It's a unique platform, combining the classroom with the practical experience of the rails.\\n\\nYou'll find yourself rotating through different stations along the route: personal banking, business lending, investment services, and the vital area of risk management.\\n\\nThe starting fare is around $42,000, with scheduled increases along the way. Many who embark on this apprenticeship find themselves as full-time analysts or relationship managers within three years, earning between $55,000 and $65,000.\\\"",
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
    text: "\"They rotate co-ops through every engineering discipline,\" Samuel explains. \"Electrical engineers work on grid modernization and smart meters.\n\nMechanical engineers focus on power plant operations and efficiency improvements.\n\nEnvironmental engineers handle air quality and renewable energy integration.\n\nThere's also nuclear engineering at Plant Farley, chemical engineering for emissions control, and computer engineering for cybersecurity.\n\nThe beauty is, you discover what energizes you - literally.\"",
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
    text: "Samuel leans back, a distant smile crossing his face.\n\n\"My journey began on a different track, young traveler. I studied how to bring power to the people, designing the very rails upon which clean energy could travel. Back then, around 2015, the sun and the wind were just beginning to show their strength.\n\nFor five years, I helped build those pathways for Alabama’s solar farms, connecting forgotten communities to a brighter future.\n\nBut I came to realize that my true calling wasn't just in optimizing the flow of power, but in guiding others to discover their own destinations.\n\nThat time taught me a valuable lesson: that the most meaningful work arises when skill and compassion meet upon the same platform.",
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
    text: "Jordan smiles warmly.\n\n\"That's the thing - they were ALL the right one.\n\nThe customer service job at the Galleria taught me empathy and how to read what people actually need. Uber taught me Birmingham's geography and how different communities live.\n\nPersonal training taught me how to motivate people and see their potential. Graphic design taught me visual thinking.\n\nNow I use ALL of that in UX design for healthcare apps. Your career isn't a destination - it's an accumulation.\"",
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
    text: "Samuel nods thoughtfully.\n\n\"Family depending on you - that's real weight, real responsibility. I respect that.\n\nLet me tell you about stability in Birmingham. UAB employs 23,000 people. Regions Bank has been here 150 years through depressions and recessions. Amazon isn't going anywhere.\n\nBut here's the thing - stability isn't just about the company. It's about building skills that transfer.\n\nWhich would you rather have: one company needs you, or five companies could use you?\"",
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
    text: "Jordan laughs, a hint of disbelief in it.\\n\\n\\\"Yeah, I used to think it was a problem, all this... *stuff*. But then, something shifted. Employers in Birmingham started seeing my circuitous route as, get this, an *advantage*.\\\"\\n\\n\\\"Like when Innovation Depot hired me for UX. They were like:\\n\\n'Look:\\n• You get customer service from your Galleria days.\\n• Logistics from Uber.\\n• Motivation from personal training. \\n• And visual communication from graphic design.\\n\\nIt's not a mess – it's everything. It all *transfers*.'\\\"",
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
    text: "Jordan gestures toward the windows.\n\n\"Birmingham is perfect for multi-path careers because we're a city that reinvented itself.\"\n\n\"UAB needs people who understand both medicine and technology.\"\n\n\"Innovation Depot loves entrepreneurs with diverse backgrounds.\"\n\n\"Even Regions Bank hired former teachers to improve customer experience.\"\n\n\"This city rewards adaptability because adaptability is how we survived and thrived.\"",
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
    text: "Jordan's expression grows thoughtful.\n\n\"Each time I changed direction, I felt like I was failing.\"\n\n\"But here's what kept me going: Birmingham has a culture of 'next.'\n\nNext opportunity, next skill, next chance to contribute.\"\n\n\"When one door closed, I'd think 'What did this teach me?' instead of 'Why did I waste time?'\"\n\n\"Every experience became part of my toolkit, not a detour from my 'real' path.\"",
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
    text: "Jordan reaches across and gently touches your arm.\n\n\"Listen to me: You don't need permission to explore.\n\nYou don't need to justify your curiosity.\n\nYou don't need to apologize for taking time to figure things out.\"\n\n\"Birmingham grew from iron and steel to medicine and technology because people had permission to imagine something different.\"\n\n\"Give yourself that same permission.\"",
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
    text: "Jordan shakes their head emphatically.\n\n\"There's no such thing as wasted time if you're paying attention.\"\n\n\"My customer service years? That's why I understand user frustration.\"\n\n\"Uber driving? That's why I know Birmingham's communities.\"\n\n\"Personal training? That's why I can motivate people through difficult changes.\"\n\n\"Graphic design? That's why my apps are beautiful AND functional.\"\n\n\"Every 'detour' was actually essential.\"",
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
    text: "Jordan's eyes light up.\n\n\"Right now I'm obsessed with healthcare accessibility.\"\n\n\"Birmingham has world-class medical facilities at UAB,\n\nbut transportation and technology barriers keep people from accessing care.\"\n\n\"I'm designing apps that connect patients with rides, translate medical information, and simplify appointment scheduling.\"\n\n\"It uses everything I've learned - logistics, motivation, design, and human psychology.\"",
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
    text: "Jordan grins.\n\n\"Specialists know everything about one thing.\n\nGeneralists know something about everything.\n\nIn Birmingham's innovation economy, both are valuable.\n\nBut generalists are the ones who see connections others miss, who can translate between different fields, who can adapt when industries shift.\n\nWe're not jack-of-all-trades, master-of-none.\n\nWe're master-of-connections.\"",
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
    text: "Jordan's voice becomes gentle and reassuring.\n\n\"Take a breath. Everyone around you who seems certain? Half of them are pretending, and the other half will change directions in five years.\n\nYour uncertainty isn't weakness - it's honesty. Birmingham didn't become the Magic City by playing it safe. Neither will you.\n\nThe pressure you feel to choose perfectly is imaginary. The need to keep growing and contributing? That's real.\"",
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
    text: "Devon's shoulders relax visibly.\n\n\"Exactly! I'll spend hours perfecting a system that makes perfect sense to me.\"\n\n\"Then people ignore it completely.\"\n\n\"Or they ask questions that seem obvious from the documentation.\"\n\n\"Sometimes I wonder if I should just work with computers and skip the human part entirely.\"",
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
    text: "Devon perks up.\n\n\"You know, I never thought about it that way.\"\n\n\"I always assumed people should adapt to my systems, not the other way around.\"\n\nThey pause, considering.\n\n\"But what if I designed systems that worked with how people actually think?\"\n\n\"UAB's engineering program taught us about human factors.\"\n\n\"But I thought that was just for interfaces, not for... everything.\"",
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
    text: "Devon nods enthusiastically.\n\n\"Actually, yes! There's a maker space near UAB where people just... build things.\"\n\n\"No small talk, no networking pressure. Everyone's focused on their projects.\"\n\n\"And there's this Discord server for Birmingham developers where all communication is asynchronous and documented.\"\n\n\"It's like social interaction designed for people like me.\"",
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
    text: "Devon smiles softly.\n\n\"My grandmother always said 'Dil mein jo hai, woh hamesha rasta dhundh leta hai'\"\n\n\"What's in the heart always finds a way.\"\n\nDevon's voice grows warm with memory.\n\n\"She was a software engineer in the 1980s in Mumbai, way before it was common for women.\"\n\n\"She said the technical skills were the easy part.\"\n\n\"The hard part was learning to translate between human needs and computer logic.\"",
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
    text: "Devon's eyes widen.\n\n\"Wait. When I explain my code to you, I'm... I'm teaching.\"\n\n\"And you're actually understanding it because I'm breaking it down step by step.\"\n\nThe realization builds.\n\n\"I do this all the time in study groups, but I never thought of it as a skill.\"\n\n\"What if there are jobs where the main requirement is explaining complex technical concepts clearly?\"",
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
    text: "Devon pulls out their laptop, showing you several browser tabs.\n\n\"I've been mapping Birmingham's tech ecosystem:\n\n• UAB Research Park\n• Innovation Depot\n• TechBirmingham meetups\n• Southern Company innovation lab\"\n\nThey lean forward, excited.\n\n\"What's interesting is how many companies are looking for engineers who can bridge technical and human needs.\"\n\n\"Especially in healthcare tech and civic innovation.\"",
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
    text: "Devon laughs ruefully.\n\n\"Oh, that was a disaster. I made this beautiful workflow for my group project, with clear steps and deadlines.\"\n\n\"Everyone ignored it completely.\"\n\nThey shake their head.\n\n\"I got so frustrated I basically did the whole project myself.\"\n\n\"But afterward, when I asked what went wrong, I learned something important.\"\n\n\"My system was perfect for me, but it didn't account for how they actually work.\"",
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
    text: "Samuel draws a mind map on a napkin.\n\n\"Look - customer service at Regions teaches you banking regulations AND communication.\"\n\n\"That transfers to UAB patient relations, Amazon logistics coordination, or Innovation Depot startup support.\"\n\n\"Every Birmingham company needs people who can translate between technical systems and human needs.\"\n\n\"These aren't separate careers - they're connected pathways.\"",
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
    text: "Samuel pulls up a calculator. \"$35K in Birmingham goes further than $50K in Atlanta or Nashville.\n\nAverage rent for a decent one-bedroom is $800-1000. Utilities run about $150. Food costs are reasonable.\n\nPlus, shorter commutes mean lower transportation costs.\n\nThe real advantage? Birmingham companies know local salaries and often include benefits that offset the difference - health insurance, retirement matching, education assistance.\"",
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
    text: "Samuel spreads out a hand-drawn map of Birmingham partnerships.\n\n\"Here are the key collaborations:\n\n• UAB partners with Protective Life for actuarial science\n• UAB works with Southern Company for engineering research\n• UAB connects with Birmingham City Schools for education pathways\n• Regions Bank collaborates with Innovation Depot on fintech\n• Amazon works with Jefferson State on logistics training\"\n\n\"These aren't just jobs - they're integrated career ecosystems where skills and relationships transfer.\"",
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
  },

  // Generated scenes to fix navigation issues
  'maya-birmingham-medical': {
    text: "Oh, Birmingham!  It's surprisingly rich in medical opportunities, beyond just UAB. I've been researching quite a bit.  There's the Children's of Alabama, of course – a huge teaching hospital with a strong robotics program in surgery, which relates to my project here.  But I've also been looking at smaller, specialized clinics, focusing on areas like regenerative medicine, which is exploding right now.  And then there's the research side – UAB has several cutting-edge labs.  She gestures to her notes, a slight blush rising on her cheeks. It's a lot to take in!",
    choices: [
      { text: "Tell me more about the robotics program at Children's of Alabama.", next: 'maya-childrens-robotics', consequence: 'maya_confidence+', pattern: 'analytical' },
      { text: "Regenerative medicine sounds fascinating. What kind of clinics are you looking at?", next: 'maya-regenerative-medicine', consequence: 'maya_patience+', pattern: 'helping' },
      { text: "UAB research labs?  What areas are they focusing on?", next: 'maya-uab-research', consequence: 'maya_knowledge+', pattern: 'analytical' },
      { text: "This is overwhelming. Maybe we should focus on just one area to start?", next: 'maya-focus-strategy', consequence: 'maya_confidence-', pattern: 'patience' }
    ]
  },

  'maya-inner-conflict': {
    text: "Oh, uh, hi.  Yeah, I guess I am a little conflicted.  It's... everything feels so overwhelming.  Pre-med is supposed to be my path, my family expects it.  But this robotics stuff... it's where I feel truly alive.  I'm working on a prosthetic hand design, actually, incorporating some bio-feedback sensors.  But is it realistic to combine both?  Can I even make a living doing that in Birmingham?",
    choices: [
      { text: "Birmingham has a surprising number of medical device companies. Have you looked into their internship programs?", next: 'maya-birmingham-opportunities', consequence: 'maya_confidence+', pattern: 'helping' },
      { text: "Let's break it down. What are your biggest concerns about combining pre-med and robotics?", next: 'maya-problem-solving', consequence: 'maya_confidence++', pattern: 'analytical' },
      { text: "Don't worry about the 'realistic' part. Just focus on building your skills in both. That passion will open doors.", next: 'maya-passion-focus', consequence: 'maya_confidence+', pattern: 'patience' },
      { text: "Have you considered reaching out to the robotics club at UAB? They might have some insights.", next: 'maya-uab-connection', consequence: 'maya_network+', pattern: 'building' }
    ]
  },

  'maya-confidence-building': {
    text: "Thanks!  It's still early days, but the potential is huge.  I'm working on a prototype for a surgical simulator using haptic feedback – think realistic, responsive tissue simulation for surgical training.  Birmingham's got some amazing medical tech companies, and I'm hoping to connect with some of them through the UAB Innovation Depot.",
    choices: [
      { text: "That's incredible!  Have you considered applying for internships at those companies?  UAB has a strong placement program.", next: 'maya-internship-search', consequence: 'maya_internship_considered', pattern: 'helping' },
      { text: "The haptic feedback is key!  What challenges are you facing in developing the system?  Perhaps I could help – I have some experience with sensor integration.", next: 'devon-collaboration-offer', consequence: 'devon_offers_help', pattern: 'building' },
      { text: "This is a long-term project. What's your plan for handling setbacks and unexpected technical issues?", next: 'maya-problem-solving', consequence: 'maya_problem_solving_discussed', pattern: 'analytical' },
      { text: "Birmingham's medical scene is definitely developing.  It'll take time to see this technology widely adopted. Be patient with the process.", next: 'maya-patience-reminder', consequence: 'maya_patience_emphasized', pattern: 'patience' }
    ]
  },

  'maya-strategic-thinking': {
    text: "That's a great point!  Thinking strategically, how could we frame this robotics project to highlight its applications in a medical setting?  We need to appeal to residency programs and potential grant funders in Birmingham.  What's the strongest angle?",
    choices: [
      { text: "Focus on the precision and dexterity improvements – robotic surgery assistance, minimally invasive procedures.", next: 'maya-surgical-robotics', consequence: 'surgical_focus', pattern: 'analytical' },
      { text: "Highlight the potential for remote patient monitoring and diagnostics – imagine telehealth advancements in underserved rural Alabama communities.", next: 'maya-telehealth-impact', consequence: 'rural_health_focus', pattern: 'helping' },
      { text: "Emphasize the cost-effectiveness and efficiency gains – reduced hospital stays, faster recovery times, leading to lower healthcare costs.", next: 'maya-cost-efficiency', consequence: 'economic_focus', pattern: 'building' },
      { text: "Let's present it as a platform for ongoing research and development, securing long-term funding and collaborations with UAB or Children's of Alabama.", next: 'maya-research-collaboration', consequence: 'research_focus', pattern: 'patience' }
    ]
  },

  'devon-systems-thinking': {
    text: "Yeah, sure, have a seat.  It's... intense right now. I'm trying to optimize a traffic flow algorithm for the city.  Birmingham's expanding rapidly, and the current system is... well, let's just say it has room for improvement. He gestures vaguely at the screens, highlighting a particularly chaotic section of the visualization. See this bottleneck near the UAB campus?  It's a nightmare.",
    choices: [
      { text: "Could you explain the algorithm to me? I'm fascinated by this kind of thing.", next: 'devon-algorithm-deepdive', consequence: 'devon_analytical_sharing+', pattern: 'analytical' },
      { text: "I'm more interested in the practical application. How does this impact real people?", next: 'devon-real-world-impact', consequence: 'devon_helping_focus+', pattern: 'helping' },
      { text: "Wow, that sounds like a massive undertaking.  Have you thought about presenting this to the city?", next: 'devon-city-proposal', consequence: 'devon_building_ambition+', pattern: 'building' },
      { text: "I'm thinking about a career change.  Your focus seems intense.  How do you stay motivated on something this big?", next: 'devon-motivation', consequence: 'devon_patience_inspiration+', pattern: 'patience' }
    ]
  },

  'devon-community-impact': {
    text: "Devon beams. That's the core of it! Cleaner water means healthier communities, fewer waterborne illnesses, and less strain on the city's resources.  Think about the impact on local businesses reliant on clean water, or the improved quality of life for families living near Village Creek. The data we collect also helps the city allocate resources more effectively for future infrastructure projects.",
    choices: [
      { text: "So, it's not just about the technology, but the people it affects?", next: 'devon-broader-impact', consequence: 'devon_empathy+', pattern: 'helping' },
      { text: "What kind of engineering jobs are involved in a project like this?", next: 'devon-career-paths', consequence: 'devon_career_clarity+', pattern: 'analytical' },
      { text: "How does the city fund something this ambitious?", next: 'devon-funding-models', consequence: 'devon_realism+', pattern: 'building' },
      { text: "This sounds really complex.  What if the system fails?", next: 'devon-risk-assessment', consequence: 'devon_problem_solving+', pattern: 'patience' }
    ]
  },

  'devon-innovation-depot': {
    text: "The Innovation Depot?  That's... actually a great idea! They're always looking for innovative solutions for Birmingham's environmental challenges.  I could showcase the real-time data visualization and maybe even get feedback from some of the mentors there.  It's a bit nerve-wracking to present it to a larger audience, but the potential exposure...  It's exciting! Devon fidgets slightly, a hint of his earlier enthusiasm returning. What do you think the best approach would be?",
    choices: [
      { text: "Let's focus on the algorithm's efficiency; that's your strongest point.", next: 'devon-algorithm-focus', consequence: 'devon_analytical+', pattern: 'analytical' },
      { text: "Prepare a short, engaging presentation highlighting the community impact.", next: 'devon-community-impact', consequence: 'devon_confidence+', pattern: 'helping' },
      { text: "We should build a small-scale demo to show at the Depot, something visually impressive.", next: 'devon-build-demo', consequence: 'devon_practical+', pattern: 'building' },
      { text: "Maybe start with a smaller, less intimidating setting to build your confidence before the Depot.", next: 'devon-smaller-audience', consequence: 'devon_confidence+', pattern: 'patience' }
    ]
  },

  'jordan-birmingham-building': {
    text: "Ah, Birmingham's building boom!  It's exciting to see so much growth.  From revitalizing historic structures to pioneering new designs, there's a lot to be passionate about here. What particularly catches your eye?",
    choices: [
      { text: "The redevelopment of the historic downtown area – I'm fascinated by adaptive reuse projects.", next: 'jordan-adaptive-reuse', consequence: 'jordan_building_passion', pattern: 'building' },
      { text: "The innovation around sustainable building practices –  green infrastructure and energy efficiency are key to the future.", next: 'jordan-sustainable-building', consequence: 'jordan_sustainability_focus', pattern: 'helping' },
      { text: "I'm interested in the large-scale infrastructure projects, like the improvements to the interstate system or the airport expansion.", next: 'jordan-infrastructure', consequence: 'jordan_infrastructure_knowledge', pattern: 'analytical' },
      { text: "Honestly, I'm still exploring.  I'm keen to learn more about the different types of projects before making a decision.", next: 'jordan-birmingham-overview', consequence: 'jordan_exploration_mode', pattern: 'patience' }
    ]
  },

  'jordan-non-traditional': {
    text: "You're right, Maya.  A lot of what you see here is traditional civil and mechanical engineering –  bridge design, material science, that sort of thing. But Birmingham's undergoing a huge tech boom, and that's opening doors to less traditional engineering roles.  Think about it:  we're talking advanced manufacturing, AI-driven logistics for the port, even sustainable infrastructure projects powered by renewable energy.  What piques your interest more?",
    choices: [
      { text: "Tell me more about the AI and logistics side.  Sounds fascinating.", next: 'jordan-ai-logistics', consequence: 'ai_interest', pattern: 'analytical' },
      { text: "Sustainable infrastructure –  how does Birmingham factor into that?", next: 'jordan-sustainable-infra', consequence: 'sustainability_focus', pattern: 'helping' },
      { text: "I'm still intrigued by the traditional aspects, but maybe with a modern twist.", next: 'jordan-modern-civil', consequence: 'traditional_modern', pattern: 'building' },
      { text: "Can you give me some examples of people who've made unconventional career paths in engineering here?", next: 'jordan-unconventional-paths', consequence: 'career_path_exploration', pattern: 'patience' }
    ]
  },

  'samuel-patterns-wisdom': {
    text: "Three thousand travelers...a vast sea of faces, yet currents run beneath.  I see patterns, child, in the choices they make. Some cling fiercely to a single destination, their tickets clutched tight, refusing detours. Others, more like the wind, shift with every gust of opportunity, never settling.  And then there are those who, like the river, carve their own path, adapting to the terrain, finding strength in the unexpected bends.  Which current resonates with you?",
    choices: [
      { text: "Tell me more about those who carve their own path.", next: 'samuel-entrepreneurship-birmingham', consequence: 'samuel_pathfinding_advice', pattern: 'building' },
      { text: "What about the ones who are always changing direction?  Is that a bad thing?", next: 'samuel-adaptability-challenges', consequence: 'samuel_adaptability_perspective', pattern: 'analytical' },
      { text: "I think I'm like the ones who hold tight to their plans.  Is that wrong?", next: 'samuel-commitment-risks', consequence: 'samuel_commitment_reflection', pattern: 'patience' },
      { text: "Can you give me examples of Birmingham careers that fit these patterns?", next: 'samuel-birmingham-examples', consequence: 'samuel_birmingham_insights', pattern: 'helping' }
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
      },
      currentDialogueIndex: 0,
      isShowingDialogue: false,
      dialogueChunks: []
    }
  })

  // Helper function to parse text into dialogue chunks
  const parseTextIntoChunks = useCallback((text: string): Array<{ text: string; type: string }> => {
    // Split by double line breaks to create major sections
    const sections = text.split('\n\n').filter(section => section.trim())

    return sections.map((section, index) => {
      const trimmedSection = section.trim()

      // Detect scene headings (INT./EXT. format)
      if (trimmedSection.match(/^(INT\.|EXT\.)/i)) {
        return { text: trimmedSection, type: 'scene-heading' }
      }

      // Detect direct dialogue (quoted text)
      if (trimmedSection.startsWith('"') && trimmedSection.endsWith('"')) {
        return { text: trimmedSection, type: 'dialogue' }
      }

      // Detect parentheticals (tone indicators)
      if (trimmedSection.startsWith('*(') && trimmedSection.endsWith(')*')) {
        return { text: trimmedSection.slice(2, -2), type: 'parenthetical' }
      }

      // Default to action lines for other content
      return { text: trimmedSection, type: 'action' }
    })
  }, [])

  // Load current scene
  useEffect(() => {
    if (gameState.hasStarted) {
      const scene = SIMPLE_SCENES[gameState.currentScene as keyof typeof SIMPLE_SCENES]
      if (scene) {
        const chunks = parseTextIntoChunks(scene.text)
        const isMultiChunk = chunks.length > 1

        setGameState(prev => ({
          ...prev,
          messages: [{
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: scene.text,
            speaker: scene.speaker,
            type: 'narrative'
          }],
          choices: scene.choices,
          dialogueChunks: chunks,
          isShowingDialogue: isMultiChunk,
          currentDialogueIndex: 0
        }))
      }
    }
  }, [gameState.currentScene, gameState.hasStarted, parseTextIntoChunks])

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

  // New function to handle dialogue progression
  const handleContinueDialogue = useCallback(() => {
    setGameState(prev => {
      const nextIndex = prev.currentDialogueIndex + 1

      // If we've reached the end of dialogue chunks, show choices
      if (nextIndex >= prev.dialogueChunks.length) {
        return {
          ...prev,
          isShowingDialogue: false,
          currentDialogueIndex: 0
        }
      }

      // Otherwise, show next dialogue chunk
      return {
        ...prev,
        currentDialogueIndex: nextIndex
      }
    })
  }, [])

  const handleContinue = useCallback(() => {
    // Simple continue logic for non-dialogue contexts
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
    handleContinueDialogue,
    handleShare,
    getInsights,
    getBirminghamOpportunities
  }
}