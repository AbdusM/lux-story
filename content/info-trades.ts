/**
 * Information Trading Data
 * Feature ID: D-057
 * 
 * Defines the trade offers available from each character.
 */

import { InfoTradeOffer } from '../lib/trust-derivatives'

// ═══════════════════════════════════════════════════════════════════════════
// MAYA (The Maker)
// ═══════════════════════════════════════════════════════════════════════════
export const MAYA_INFO_TRADES: InfoTradeOffer[] = [
    {
        id: 'maya_family_pressure',
        characterId: 'maya',
        infoId: 'maya_why_station',
        tier: 'uncommon',
        trustRequired: 3,
        trustCost: 1,
        description: 'Why Maya really came to the station',
        preview: 'There\'s more to Maya\'s story than she lets on...',
        fullContent: 'Maya reveals that her family\'s expectations nearly crushed her. The station appeared the night she considered giving up on her own dreams entirely.'
    },
    {
        id: 'maya_robot_prototype',
        characterId: 'maya',
        infoId: 'maya_secret_project',
        tier: 'rare',
        trustRequired: 5,
        trustCost: 2,
        description: 'The secret project in Maya\'s workshop',
        preview: 'She\'s building something that shouldn\'t be possible.',
        fullContent: 'Maya shows you a prototype that mimics human empathy. "It\'s not for efficiency," she admits. "It\'s for loneliness. For people who can\'t connect."'
    },
    {
        id: 'maya_design_philosophy',
        characterId: 'maya',
        infoId: 'maya_wabi_sabi',
        tier: 'common',
        trustRequired: 0,
        trustCost: 0,
        description: 'Her view on perfection',
        preview: 'She leaves the weld marks visible.',
        fullContent: '"Perfect is boring," Maya says, tracing a rough seam. "I like things that show how they were made. Scars are just proof of existence. Robots should have scars too."'
    },
    {
        id: 'maya_first_bot',
        characterId: 'maya',
        infoId: 'maya_childhood_bot',
        tier: 'uncommon',
        trustRequired: 2,
        trustCost: 1,
        description: 'Her first invention',
        preview: 'It was a toaster that walked.',
        fullContent: '"I was six," Maya laughs. "I wanted my toast to come to me. It walked off the table and set the rug on fire. My dad was furious. My mom was delighted."'
    },
    {
        id: 'maya_station_dream',
        characterId: 'maya',
        infoId: 'maya_legendary_dream',
        tier: 'legendary',
        trustRequired: 9,
        trustCost: 4,
        description: 'What she dreams the station is',
        preview: 'It\'s not a machine to her.',
        fullContent: '"I had a dream," Maya whispers. "The station wasn\'t metal. It was a giant, sleeping god. And we\'re not passengers. We\'re the dreams it\'s having to keep itself asleep."'
    }
]

// ═══════════════════════════════════════════════════════════════════════════
// SAMUEL (The Conductor)
// ═══════════════════════════════════════════════════════════════════════════
export const SAMUEL_INFO_TRADES: InfoTradeOffer[] = [
    {
        id: 'samuel_station_age',
        characterId: 'samuel',
        infoId: 'station_age_hint',
        tier: 'common',
        trustRequired: 0,
        trustCost: 0,
        description: 'How long the station has been here',
        preview: 'Samuel casually mentions the timeline.',
        fullContent: '"Time folds on itself here," Samuel says. "I have seen the steam engines, and I have seen the solar sails. They often arrive on the same Tuesday."'
    },
    {
        id: 'samuel_pocket_watch',
        characterId: 'samuel',
        infoId: 'samuel_timepiece_origin',
        tier: 'secret',
        trustRequired: 7,
        trustCost: 3,
        description: 'The origin of Samuel\'s pocket watch',
        preview: 'He never lets anyone touch that watch. Why?',
        fullContent: 'Samuel hands you the watch. It\'s stopped. "It didn\'t break," he whispers. "I stopped it. The moment I decided to stay, I stopped time for myself."'
    },
    {
        id: 'samuel_lost_passenger',
        characterId: 'samuel',
        infoId: 'samuel_regret_passenger',
        tier: 'rare',
        trustRequired: 5,
        trustCost: 2,
        description: 'The passenger he couldn\'t help',
        preview: 'Samuel remembers everyone. Especially the ones who left too soon.',
        fullContent: '"She got on the wrong train," Samuel says, staring at the tracks. "I saw her hesitate. I didn\'t step in. I thought she needed to learn. She didn\'t learn. She just got lost."'
    },
    {
        id: 'samuel_route_map',
        characterId: 'samuel',
        infoId: 'samuel_impossible_routes',
        tier: 'uncommon',
        trustRequired: 3,
        trustCost: 1,
        description: 'The impossible train routes',
        preview: 'There are tracks that go nowhere.',
        fullContent: '"See that switch?" Samuel points. "It hasn\'t moved in fifty years. But I hear trains on it every night. Ghost trains. Carrying cargo that doesn\'t exist yet."'
    },
    {
        id: 'samuel_conductor_burden',
        characterId: 'samuel',
        infoId: 'samuel_anchor_role',
        tier: 'legendary',
        trustRequired: 9,
        trustCost: 4,
        description: 'The true burden of the Conductor',
        preview: 'He isn\'t just punching tickets.',
        fullContent: '"I don\'t drive the trains," Samuel confesses. "I hold the station together. My belief... my memory... it keeps the walls solid. If I forget for even a second, this whole place dissolves into potential."'
    }
]

// ═══════════════════════════════════════════════════════════════════════════
// DEVON (Systems Thinker)
// ═══════════════════════════════════════════════════════════════════════════
export const DEVON_INFO_TRADES: InfoTradeOffer[] = [
    {
        id: 'devon_process_obsession',
        characterId: 'devon',
        infoId: 'devon_why_systems',
        tier: 'common',
        trustRequired: 0,
        trustCost: 0,
        description: 'Why Devon obsesses over processes',
        preview: 'Devon seems to find comfort in systems...',
        fullContent: '"Chaos terrifies me," Devon admits. "When my parents divorced, nothing made sense. Systems gave me control when everything else was falling apart."'
    },
    {
        id: 'devon_first_failure',
        characterId: 'devon',
        infoId: 'devon_failed_project',
        tier: 'uncommon',
        trustRequired: 3,
        trustCost: 1,
        description: 'Devon\'s first major failure',
        preview: 'Every system has a breaking point, and Devon found his early.',
        fullContent: 'He shows you a corrupted drive. "My first startup. I optimized the humanity out of it. We were efficient, profitable, and completely miserable. It imploded in six months."'
    },
    {
        id: 'devon_hidden_creative',
        characterId: 'devon',
        infoId: 'devon_secret_art',
        tier: 'rare',
        trustRequired: 5,
        trustCost: 2,
        description: 'What Devon does when offline',
        preview: 'Even the most logical mind needs an outlet.',
        fullContent: 'Devon unlocks a hidden folder. It\'s full of digital abstract art. "Chaos isn\'t always bad," he murmurs. "Sometimes, without the grid, I can finally breathe."'
    },
    {
        id: 'devon_station_theory',
        characterId: 'devon',
        infoId: 'devon_station_hypothesis',
        tier: 'secret',
        trustRequired: 7,
        trustCost: 3,
        description: 'Devon\'s theory about the station',
        preview: 'He\'s been analyzing the train schedules. They don\'t make sense.',
        fullContent: '"The arrivals follow a Fibonacci sequence," Devon whispers, eyes wide. "This isn\'t a transportation hub. It\'s a sorting algorithm. And it\'s optimizing for... us."'
    },
    {
        id: 'devon_final_blueprint',
        characterId: 'devon',
        infoId: 'devon_utopia_plan',
        tier: 'legendary',
        trustRequired: 9,
        trustCost: 4,
        description: 'The blueprint Devon hides from everyone',
        preview: 'The ultimate system he\'s been designing his whole life.',
        fullContent: 'He unrolls a physical blueprint. It\'s a city designed for human connection, not just traffic. "I\'m not here to fix the trains," he says. "I\'m here to learn how to build a world that doesn\'t need escaping."'
    }
]

// ═══════════════════════════════════════════════════════════════════════════
// MARCUS (Medical Tech)
// ═══════════════════════════════════════════════════════════════════════════
export const MARCUS_INFO_TRADES: InfoTradeOffer[] = [
    {
        id: 'marcus_career_choice',
        characterId: 'marcus',
        infoId: 'marcus_why_medicine',
        tier: 'common',
        trustRequired: 0,
        trustCost: 0,
        description: 'Why Marcus chose medicine',
        preview: 'It wasn\'t just about helping people.',
        fullContent: '"I wanted to know how things work," Marcus says, tapping his temple. "Machines you can fix with a wrench. People? We\'re fragile. I wanted to be the mechanic for the most complex machine on earth."'
    },
    {
        id: 'marcus_lost_patient',
        characterId: 'marcus',
        infoId: 'marcus_first_loss',
        tier: 'uncommon',
        trustRequired: 3,
        trustCost: 1,
        description: 'The patient he couldn\'t save',
        preview: 'His hands still shake when he talks about his residency.',
        fullContent: '"She was seven," Marcus says, looking away. "We did everything right. The protocol was perfect. She died anyway. That\'s when I learned that medicine isn\'t math. Sometimes 2 plus 2 equals zero."'
    },
    {
        id: 'marcus_emotional_distance',
        characterId: 'marcus',
        infoId: 'marcus_detachment',
        tier: 'rare',
        trustRequired: 5,
        trustCost: 2,
        description: 'Why he keeps people at arm\'s length',
        preview: 'His humor is a shield.',
        fullContent: '"If I care too much, I hesitate," Marcus admits. "And hesitation kills. So I verify, I diagnose, I treat. But I don\'t... I try not to feel. It\'s safer for them. And for me."'
    },
    {
        id: 'marcus_haunting_mistake',
        characterId: 'marcus',
        infoId: 'marcus_fatal_error',
        tier: 'secret',
        trustRequired: 7,
        trustCost: 3,
        description: 'The mistake that haunts him',
        preview: 'It wasn\'t the ones he couldn\'t save. It was the one he failed.',
        fullContent: '"I was tired. Double shift. I missed the allergy warning. Just one line of text." He closes his eyes. "He survived, but... the damage. I see his face every time I close my eyes. I\'m here to forgive myself. I haven\'t yet."'
    },
    {
        id: 'marcus_new_oath',
        characterId: 'marcus',
        infoId: 'marcus_healthcare_vision',
        tier: 'legendary',
        trustRequired: 9,
        trustCost: 4,
        description: 'What he would change about healthcare',
        preview: 'Marcus has a radical idea for a new Hippocratic Oath.',
        fullContent: '"We treat the body and ignore the life," Marcus says passionately. "I want to build a clinic where we prescribe rent money, or a conversation, or a walk in the woods. Where health isn\'t just the absence of pain, but the presence of hope."'
    }
]

// ═══════════════════════════════════════════════════════════════════════════
// TESS (Education Founder)
// ═══════════════════════════════════════════════════════════════════════════
export const TESS_INFO_TRADES: InfoTradeOffer[] = [
    {
        id: 'tess_teaching_philosophy',
        characterId: 'tess',
        infoId: 'tess_why_teach',
        tier: 'common',
        trustRequired: 0,
        trustCost: 0,
        description: 'Her teaching philosophy',
        preview: 'Tess doesn\'t believe in grades.',
        fullContent: '"A grade is a measurement of conformity," Tess says, sharpening a pencil. "I teach curiosity. You can\'t measure that on a scantron. I want students to ask questions that terrify me."'
    },
    {
        id: 'tess_changed_student',
        characterId: 'tess',
        infoId: 'tess_student_story',
        tier: 'uncommon',
        trustRequired: 3,
        trustCost: 1,
        description: 'The student who changed her',
        preview: 'One student taught her more than she taught them.',
        fullContent: '"Leo. He failed every test. But he could build radios from scrap." Tess smiles. "He made me realize I was testing a fish on its ability to climb a tree. I quit the district the day he dropped out."'
    },
    {
        id: 'tess_leaving_tradition',
        characterId: 'tess',
        infoId: 'tess_system_break',
        tier: 'rare',
        trustRequired: 5,
        trustCost: 2,
        description: 'Why she left traditional education',
        preview: 'It wasn\'t just about Leo. It was about the factory.',
        fullContent: '"Schools were designed to make factory workers," Tess says bitterly. "Bells, rows, silence. I\'m not building workers. I\'m trying to build thinkers. And the factory doesn\'t like that."'
    },
    {
        id: 'tess_learning_struggle',
        characterId: 'tess',
        infoId: 'tess_dyslexia',
        tier: 'secret',
        trustRequired: 7,
        trustCost: 3,
        description: 'Her own learning struggles',
        preview: 'Tess holds books differently than most.',
        fullContent: '"I couldn\'t read until I was ten," Tess whispers. "Letters jumped around. They called me slow. Stupid. I\'m not fighting the system for the kids. I\'m fighting it for the little girl who cried in the library."'
    },
    {
        id: 'tess_dream_school',
        characterId: 'tess',
        infoId: 'tess_radical_vision',
        tier: 'legendary',
        trustRequired: 9,
        trustCost: 4,
        description: 'The system she wishes existed',
        preview: 'A school without walls.',
        fullContent: '"Imagine a city that is the school," Tess says, eyes shining. "Mechanics teaching physics. Poets teaching history. No bells. Just the world, and us, learning to live in it. That\'s what I\'m going to build."'
    }
]

// ═══════════════════════════════════════════════════════════════════════════
// KAI (Safety Specialist)
// ═══════════════════════════════════════════════════════════════════════════
export const KAI_INFO_TRADES: InfoTradeOffer[] = [
    {
        id: 'kai_safety_focus',
        characterId: 'kai',
        infoId: 'kai_why_protect',
        tier: 'common',
        trustRequired: 0,
        trustCost: 0,
        description: 'Why safety matters to him',
        preview: 'Kai scans every room he enters.',
        fullContent: '"Danger is quiet," Kai says, checking the exit signs. "It waits for you to get comfortable. I don\'t get comfortable. That\'s how I keep people alive."'
    },
    {
        id: 'kai_witnessed_accident',
        characterId: 'kai',
        infoId: 'kai_accident_memory',
        tier: 'uncommon',
        trustRequired: 3,
        trustCost: 1,
        description: 'The accident he witnessed',
        preview: 'He worked on an oil rig once.',
        fullContent: '"The cable snapped," Kai says flatly. "It sounded like a gunshot. I saw it happen in slow motion. If I had checked the tension... just one more time. I always check one more time now."'
    },
    {
        id: 'kai_responsibility_fear',
        characterId: 'kai',
        infoId: 'kai_burden',
        tier: 'rare',
        trustRequired: 5,
        trustCost: 2,
        description: 'His fear of being responsible',
        preview: 'Leadership weighs heavy on him.',
        fullContent: '"If I\'m in charge, and someone gets hurt, that\'s on me," Kai admits. "I\'d rather be the guy checking the bolts than the guy planning the bridge. The architect sleeps at night. The inspector doesn\'t."'
    },
    {
        id: 'kai_unprotected',
        characterId: 'kai',
        infoId: 'kai_loss',
        tier: 'secret',
        trustRequired: 7,
        trustCost: 3,
        description: 'Someone he couldn\'t protect',
        preview: 'It wasn\'t a workplace accident.',
        fullContent: '"My brother," Kai whispers. "He... it wasn\'t something physical. I couldn\'t put a hard hat on his depression. I fixed every loose railing in his house, but I couldn\'t fix the sadness. I still check the railings, though. It\'s all I can do."'
    },
    {
        id: 'kai_true_safety',
        characterId: 'kai',
        infoId: 'kai_philosophy',
        tier: 'legendary',
        trustRequired: 9,
        trustCost: 4,
        description: 'What true safety means',
        preview: 'It\'s not about avoiding danger.',
        fullContent: '"Safety isn\'t walls," Kai realizes. "It\'s trust. It\'s knowing that if you fall, someone will catch you. I\'ve been building walls my whole life. Maybe it\'s time I built a net."'
    }
]

// ═══════════════════════════════════════════════════════════════════════════
// ROHAN (Deep Tech)
// ═══════════════════════════════════════════════════════════════════════════
export const ROHAN_INFO_TRADES: InfoTradeOffer[] = [
    {
        id: 'rohan_depth_fascination',
        characterId: 'rohan',
        infoId: 'rohan_why_deep',
        tier: 'common',
        trustRequired: 0,
        trustCost: 0,
        description: 'His fascination with depth',
        preview: 'Rohan stares into the dark tunnels.',
        fullContent: '"Surface level is noise," Rohan says. "The truth is always underneath. Under the city, under the code, under the polite conversation. I like the dark. The dark is honest."'
    },
    {
        id: 'rohan_surface_avoidance',
        characterId: 'rohan',
        infoId: 'rohan_social_anxiety',
        tier: 'uncommon',
        trustRequired: 3,
        trustCost: 1,
        description: 'Why he avoids surface conversations',
        preview: 'Small talk pains him physically.',
        fullContent: '"Asking about the weather is a lie," Rohan sneers. "We\'re all dying, we\'re all scared, and we talk about rain? I don\'t have time for the weather. Tell me what keeps you awake at 3 AM."'
    },
    {
        id: 'rohan_loneliness',
        characterId: 'rohan',
        infoId: 'rohan_isolation',
        tier: 'rare',
        trustRequired: 5,
        trustCost: 2,
        description: 'The loneliness of understanding',
        preview: 'Being deep means being alone.',
        fullContent: '"When you see the patterns," Rohan says quietly, "you realize how robotic everyone else is. They follow scripts. I broke my script. But now... now I have no one to talk to who understands the language."'
    },
    {
        id: 'rohan_station_discovery',
        characterId: 'rohan',
        infoId: 'rohan_station_secret',
        tier: 'secret',
        trustRequired: 7,
        trustCost: 3,
        description: 'What he discovered about the station',
        preview: 'He found a maintenance hatch that shouldn\'t exist.',
        fullContent: '"I went down to level -4," Rohan confides. "There are no tracks there. Just... cabling. Biological cabling. Like giant nerves. This station isn\'t built. It\'s grown."'
    },
    {
        id: 'rohan_platform_seven',
        characterId: 'rohan',
        infoId: 'rohan_platform_7_truth',
        tier: 'legendary',
        trustRequired: 9,
        trustCost: 4,
        description: 'The truth about Platform Seven',
        preview: 'It\'s not a myth.',
        fullContent: '"Platform Seven is the brain stem," Rohan says, shaking. "I saw it. It doesn\'t lead to a city. It leads... in. Into the collective unconscious of Birmingham. The trains are thoughts. And we are the neurons."'
    }
]


// ═══════════════════════════════════════════════════════════════════════════
// TIER 2 CHARACTERS (Secondary)
// ═══════════════════════════════════════════════════════════════════════════

// YAQUIN (EdTech Creator)
export const YAQUIN_INFO_TRADES: InfoTradeOffer[] = [
    {
        id: 'yaquin_creative_process',
        characterId: 'yaquin',
        infoId: 'yaquin_inspiration',
        tier: 'common',
        trustRequired: 0,
        trustCost: 0,
        description: 'How Yaquin comes up with ideas',
        preview: 'It involves a lot of noise.',
        fullContent: '"I don\'t think in lines," Yaquin says, tapping a colorful tablet. "I think in clouds. It\'s messy. Systems people like Devon hate it. But the world is messy, isn\'t it?"'
    },
    {
        id: 'yaquin_youth_perspective',
        characterId: 'yaquin',
        infoId: 'yaquin_gen_z_view',
        tier: 'uncommon',
        trustRequired: 3,
        trustCost: 1,
        description: 'What the younger generation needs',
        preview: 'They aren\'t asking for what the elders are building.',
        fullContent: '"You guys build ladders," Yaquin laughs. "We want wings. We don\'t want to climb your corporate structures. We want to fly over them and build something weird in the clouds."'
    },
    {
        id: 'yaquin_accessibility',
        characterId: 'yaquin',
        infoId: 'yaquin_inclusive_design',
        tier: 'rare',
        trustRequired: 5,
        trustCost: 2,
        description: 'Why accessibility is personal',
        preview: 'It\'s about his sister.',
        fullContent: '"My sister can\'t use a keyboard," Yaquin says quietly. "If the future isn\'t voice-activated, she\'s locked out. I\'m not building tech. I\'m building keys for the people you forgot to make doors for."'
    },
    {
        id: 'yaquin_secret_fear',
        characterId: 'yaquin',
        infoId: 'yaquin_fraud_syndrome',
        tier: 'secret',
        trustRequired: 7,
        trustCost: 3,
        description: 'Yaquin\'s secret fear',
        preview: 'Behind the confidence, there\'s doubt.',
        fullContent: '"Sometimes I think I\'m just making noise," Yaquin admits. "That I\'m just a kid playing with expensive toys while the world burns. What if colors and shapes aren\'t enough to save anyone?"'
    }
]

// JORDAN (Career Navigator)
export const JORDAN_INFO_TRADES: InfoTradeOffer[] = [
    {
        id: 'jordan_pathfinding',
        characterId: 'jordan',
        infoId: 'jordan_career_view',
        tier: 'common',
        trustRequired: 0,
        trustCost: 0,
        description: 'How Jordan sees careers',
        preview: 'It\'s not a ladder.',
        fullContent: '"It\'s a jungle gym," Jordan explains. "You go sideways, you go down, you swing. The people who go straight up usually fall the hardest."'
    },
    {
        id: 'jordan_own_uncertainty',
        characterId: 'jordan',
        infoId: 'jordan_lost_feeling',
        tier: 'uncommon',
        trustRequired: 3,
        trustCost: 1,
        description: 'Jordan\'s own uncertainty',
        preview: 'The navigator doesn\'t always have a map.',
        fullContent: '"I help people find their way," Jordan says, staring at a blank screen. "But half the time, I\'m just guessing. I\'m holding the flashlight, but I don\'t know where the cave ends."'
    },
    {
        id: 'jordan_regret',
        characterId: 'jordan',
        infoId: 'jordan_missed_chance',
        tier: 'rare',
        trustRequired: 5,
        trustCost: 2,
        description: 'The path Jordan didn\'t take',
        preview: 'He almost became a musician.',
        fullContent: '"I was good," Jordan smiles sadly. "Cello. But my dad said art doesn\'t pay the rent. So I got a degree in HR. Now I help people follow their dreams while I sit in an office."'
    },
    {
        id: 'jordan_station_purpose',
        characterId: 'jordan',
        infoId: 'jordan_station_theory',
        tier: 'secret',
        trustRequired: 7,
        trustCost: 3,
        description: 'What Jordan thinks the station is',
        preview: 'It\'s the ultimate career counseling center.',
        fullContent: '"This place strips away the resume," Jordan realizes. "It asks you who you are when you\'re not your job title. That\'s terrifying. That\'s why people leave."'
    }
]

// ALEX (Supply Chain)
export const ALEX_INFO_TRADES: InfoTradeOffer[] = [
    {
        id: 'alex_efficiency',
        characterId: 'alex',
        infoId: 'alex_optimization_view',
        tier: 'common',
        trustRequired: 0,
        trustCost: 0,
        description: 'Alex on efficiency',
        preview: 'Waste is a sin.',
        fullContent: '"Time is the only resource you can\'t recycle," Alex says, checking a watch. "If you\'re waiting, you\'re losing. I treat seconds like gold coins."'
    },
    {
        id: 'alex_human_cost',
        characterId: 'alex',
        infoId: 'alex_burnout_guilt',
        tier: 'uncommon',
        trustRequired: 3,
        trustCost: 1,
        description: 'The human cost of optimization',
        preview: 'Alex pushed a team too hard once.',
        fullContent: '"We hit the deadline," Alex says grimly. "But two people quit and one ended up in the hospital with exhaustion. I got a bonus. I donated it. It felt like blood money."'
    },
    {
        id: 'alex_chaos_theory',
        characterId: 'alex',
        infoId: 'alex_control_illusion',
        tier: 'rare',
        trustRequired: 5,
        trustCost: 2,
        description: 'When the system fails',
        preview: 'Alex learned you can\'t control everything.',
        fullContent: '"The pandemic taught me that," Alex admits. "You can have the perfect supply chain, and one virus breaks it all. We\'re building castles on sand and calling it engineering."'
    },
    {
        id: 'alex_station_logistics',
        characterId: 'alex',
        infoId: 'alex_impossible_shipping',
        tier: 'secret',
        trustRequired: 7,
        trustCost: 3,
        description: 'The station\'s impossible logistics',
        preview: 'Supplies arrive without trains.',
        fullContent: '"The coffee shop is always stocked," Alex whispers. "But I\'ve watched the loading docks for three days. Nothing comes in. The station... manifests what we need. It\'s not logistics. It\'s magic."'
    }
]

// SILAS (Manufacturing)
export const SILAS_INFO_TRADES: InfoTradeOffer[] = [
    {
        id: 'silas_hands_on',
        characterId: 'silas',
        infoId: 'silas_craft_value',
        tier: 'common',
        trustRequired: 0,
        trustCost: 0,
        description: 'The value of hands-on work',
        preview: 'Silas looks at his calloused hands.',
        fullContent: '"You can\'t code a chair," Silas grunts. "At the end of the day, someone has to touch the material. Someone has to bleed a little. The digital world is a ghost. This? This is real."'
    },
    {
        id: 'silas_automation_fear',
        characterId: 'silas',
        infoId: 'silas_obolescence',
        tier: 'uncommon',
        trustRequired: 3,
        trustCost: 1,
        description: 'His fear of automation',
        preview: 'The robots are coming.',
        fullContent: '"I\'m training the machine that will replace me," Silas says, wiping grease from a wrench. "It\'s faster. It doesn\'t get tired. But it doesn\'t care. And I think that matters. I have to believe that matters."'
    },
    {
        id: 'silas_lost_art',
        characterId: 'silas',
        infoId: 'silas_legacy_skill',
        tier: 'rare',
        trustRequired: 5,
        trustCost: 2,
        description: 'A skill no one wants anymore',
        preview: 'He can fix things that are thrown away.',
        fullContent: '"I can rewind a motor by hand," Silas says proudly. "Cheaper to buy a new one now. We\'ve become a disposable society. People throw away toasters. They throw away people too."'
    },
    {
        id: 'silas_station_heart',
        characterId: 'silas',
        infoId: 'silas_engine_sound',
        tier: 'secret',
        trustRequired: 7,
        trustCost: 3,
        description: 'What Silas hears in the walls',
        preview: 'The station has a heartbeat.',
        fullContent: '"Put your hand here," Silas presses your palm to a cold pipe. "Feel that rhythm? That\'s not a pump. It\'s too... organic. It speeds up when the trains arrive. The station gets excited."'
    }
]

// ═══════════════════════════════════════════════════════════════════════════
// TIER 3 CHARACTERS (Extended)
// ═══════════════════════════════════════════════════════════════════════════

// ELENA (Archivist)
export const ELENA_INFO_TRADES: InfoTradeOffer[] = [
    {
        id: 'elena_record_patterns',
        characterId: 'elena',
        infoId: 'elena_history_repeats',
        tier: 'common',
        trustRequired: 0,
        trustCost: 0,
        description: 'Patterns in the archives',
        preview: 'Everything has happened before.',
        fullContent: '"The names change," Elena says, dusting a file. "The dilemmas stay the same. Love vs Duty. Safety vs Adventure. We are just re-enacting plays written a thousand years ago."'
    },
    {
        id: 'elena_missing_records',
        characterId: 'elena',
        infoId: 'elena_gaps',
        tier: 'rare',
        trustRequired: 5,
        trustCost: 2,
        description: 'The gaps in the history',
        preview: 'Some years are empty.',
        fullContent: '"The 1920s, the 1970s... whole decades are gone," Elena whispers. "Or verified false. Someone scrubbed the station\'s history. Someone wants us to think it\'s always been a train station."'
    },
    {
        id: 'elena_samuel_file',
        characterId: 'elena',
        infoId: 'elena_conductor_secret',
        tier: 'secret',
        trustRequired: 7,
        trustCost: 3,
        description: 'What she found about Samuel',
        preview: 'His file is the thickest.',
        fullContent: '"His employment start date is blank," Elena shows you the card. "And his photo... here\'s one from 1890. It\'s him. He hasn\'t aged a day. He\'s not the Conductor. He\'s the Anchor."'
    },
    {
        id: 'elena_filing_system',
        characterId: 'elena',
        infoId: 'elena_chaos_filing',
        tier: 'uncommon',
        trustRequired: 2,
        trustCost: 1,
        description: 'Her unique filing system',
        preview: 'It\'s not alphabetical.',
        fullContent: '"Alphabetical is arbitrary," Elena sniffs. "I file by emotional resonance. \'Regret\' is next to \'Rain\'. \'Hope\' is filed with \'Sunrise\'. It makes finding things harder, but understanding them easier."'
    },
    {
        id: 'elena_first_day',
        characterId: 'elena',
        infoId: 'elena_arrival_memory',
        tier: 'rare',
        trustRequired: 4,
        trustCost: 2,
        description: 'Her first day at the archives',
        preview: 'The archives tried to eat her.',
        fullContent: '"The door locked behind me," Elena shudders. "The lights went out. And the books... they started whispering. I didn\'t scream. I started reading to them. That\'s when the lights came back on."'
    }
]

// GRACE (Healthcare Ops)
export const GRACE_INFO_TRADES: InfoTradeOffer[] = [
    {
        id: 'grace_empathy_drain',
        characterId: 'grace',
        infoId: 'grace_burnout',
        tier: 'uncommon',
        trustRequired: 3,
        trustCost: 1,
        description: 'The cost of caring',
        preview: 'Grace looks exhausted.',
        fullContent: '"You pour yourself out until you\'re empty," Grace sighs. "And they still need more. I hide in the supply closet sometimes just to be alone. Is that awful? Caring for people makes me want to run away from them."'
    },
    {
        id: 'grace_resilience',
        characterId: 'grace',
        infoId: 'grace_coping',
        tier: 'rare',
        trustRequired: 5,
        trustCost: 2,
        description: 'How she keeps going',
        preview: 'It\'s about the small wins.',
        fullContent: '"I keep a folder of \'Thank You\' cards," Grace smiles. "When the bureaucracy is crushing me, I read the one from Mrs. Higgins. She called me her angel. I\'m not an angel. I\'m just tired. But for her, I can be an angel for five minutes."'
    },
    {
        id: 'grace_admin_war',
        characterId: 'grace',
        infoId: 'grace_paperwork_battles',
        tier: 'common',
        trustRequired: 0,
        trustCost: 0,
        description: 'Her war on paperwork',
        preview: 'Grace hates forms.',
        fullContent: '"Triplicate forms for a bandage?" Grace rolls her eyes. "I once filled out a requisition for \'Common Sense\'. It was denied. Reason: \'Not in inventory\'."'
    },
    {
        id: 'grace_secret_stash',
        characterId: 'grace',
        infoId: 'grace_hidden_supplies',
        tier: 'secret',
        trustRequired: 7,
        trustCost: 3,
        description: 'What she keeps for emergencies',
        preview: 'She hoards more than bandages.',
        fullContent: '"Chocolate," Grace opens a locked drawer. "Good chocolate. And gin. When the world ends, or the shift ends, whichever comes first... we\'ll be ready."'
    },
    {
        id: 'grace_legendary_care',
        characterId: 'grace',
        infoId: 'grace_radical_healing',
        tier: 'legendary',
        trustRequired: 9,
        trustCost: 4,
        description: 'Her definition of healing',
        preview: 'It\'s not about curing.',
        fullContent: '"You can\'t fix everyone," Grace says softly. "But you can witness them. Sometimes, just holding someone\'s hand while they fall apart... that\'s the medicine. That\'s the holy work."'
    }
]

// ASHA (Mediator)
export const ASHA_INFO_TRADES: InfoTradeOffer[] = [
    {
        id: 'asha_conflict_view',
        characterId: 'asha',
        infoId: 'asha_art_of_war',
        tier: 'common',
        trustRequired: 0,
        trustCost: 0,
        description: 'Conflict as art',
        preview: 'Asha doesn\'t mind arguments.',
        fullContent: '"Friction creates heat," Asha says, arranging flowers. "Heat creates change. People are so afraid of fighting. I say, fight. But fight beautifully. Fight to understand, not to win."'
    },
    {
        id: 'asha_station_mood',
        characterId: 'asha',
        infoId: 'asha_vibes',
        tier: 'rare',
        trustRequired: 5,
        trustCost: 2,
        description: 'The mood of the station',
        preview: 'The station has feelings.',
        fullContent: '"It\'s anxious today," Asha murmurs, looking at the flickering lights. "Too many people rushing. The station likes it when you stop. When you breathe. It breathes with you."'
    },
    {
        id: 'asha_silent_treatment',
        characterId: 'asha',
        infoId: 'asha_mediation_tactic',
        tier: 'uncommon',
        trustRequired: 3,
        trustCost: 1,
        description: 'Her best mediation tactic',
        preview: 'Silence speaks louder.',
        fullContent: '"When two people are screaming," Asha says, "I just sit down on the floor. It confuses them. They stop to look at me. And in that pause... that\'s where the peace starts."'
    },
    {
        id: 'asha_family_secret',
        characterId: 'asha',
        infoId: 'asha_runaway',
        tier: 'secret',
        trustRequired: 7,
        trustCost: 3,
        description: 'Why she became a mediator',
        preview: 'Her own family never stopped fighting.',
        fullContent: '"My parents fought for thirty years," Asha admits. "A thirty-year war in a suburban kitchen. I mediated every dinner. I couldn\'t save their marriage. So I\'m trying to save everyone else\'s."'
    },
    {
        id: 'asha_legendary_harmony',
        characterId: 'asha',
        infoId: 'asha_universal_chord',
        tier: 'legendary',
        trustRequired: 9,
        trustCost: 4,
        description: ' The Universal Chord',
        preview: 'She believes the station sings.',
        fullContent: '"If we all spoke at once," Asha dreams, "not in anger, but in truth... it would be a chord. A perfect, dissonant, beautiful chord. The station is trying to teach us that song."'
    }
]

// LIRA (Communications)
export const LIRA_INFO_TRADES: InfoTradeOffer[] = [
    {
        id: 'lira_deep_listening',
        characterId: 'lira',
        infoId: 'lira_sound_layer',
        tier: 'common',
        trustRequired: 0,
        trustCost: 0,
        description: 'What Lira hears',
        preview: 'She hears more than words.',
        fullContent: '"People say \'I\'m fine\'," Lira says, adjusting her headphones. "But their voice says \'Help me\'. The pitch drops. The tempo drags. I listen to the music, not the lyrics."'
    },
    {
        id: 'lira_signal_noise',
        characterId: 'lira',
        infoId: 'lira_station_frequency',
        tier: 'secret',
        trustRequired: 7,
        trustCost: 3,
        description: 'The signal in the noise',
        preview: 'There\'s a pattern in the static.',
        fullContent: '"Between the announcements," Lira whispers. "In the white noise. It\'s not random. It\'s a code. Just numbers. Coordinates? Or... dates. I think it\'s counting down."'
    },
    {
        id: 'lira_lost_voices',
        characterId: 'lira',
        infoId: 'lira_ghost_signals',
        tier: 'rare',
        trustRequired: 5,
        trustCost: 2,
        description: 'The voices that aren\'t there',
        preview: 'Sometimes the radio picks up... memories.',
        fullContent: '"I recorded an empty platform," Lira plays a tape. "Listen. Underlying the hiss. It sounds like a children\'s choir. But there were no children. Just echoes sticking to the walls."'
    },
    {
        id: 'lira_music_theory',
        characterId: 'lira',
        infoId: 'lira_harmony_math',
        tier: 'uncommon',
        trustRequired: 3,
        trustCost: 1,
        description: 'Her theory on music and math',
        preview: 'They are the same language.',
        fullContent: '"Music is just math with feelings," Lira grins. "A frequency is a number, but a minor third is a heartbreak. I translate between them. It helps me quantify my own sadness."'
    },
    {
        id: 'lira_legendary_broadcast',
        characterId: 'lira',
        infoId: 'lira_universal_broadcast',
        tier: 'legendary',
        trustRequired: 9,
        trustCost: 4,
        description: 'The broadcast she wants to send',
        preview: 'One signal to reach everyone.',
        fullContent: '"I want to build an amplifier," Lira says, eyes wide. "Big enough to broadcast one message to every timeline. \'You are not alone.\' Just that. Imagine how many people need to hear it."'
    }
]

// ZARA (Data Ethics)
export const ZARA_INFO_TRADES: InfoTradeOffer[] = [
    {
        id: 'zara_data_dilemma',
        characterId: 'zara',
        infoId: 'zara_privacy_fear',
        tier: 'uncommon',
        trustRequired: 3,
        trustCost: 1,
        description: 'The cost of knowledge',
        preview: 'Zara doesn\'t trust the screens.',
        fullContent: '"We traded privacy for convenience," Zara says, covering her phone camera. "Now the algorithms know us better than we know ourselves. That\'s not convenient. That\'s slavery."'
    },
    {
        id: 'zara_station_surveillance',
        characterId: 'zara',
        infoId: 'zara_watching_eyes',
        tier: 'secret',
        trustRequired: 7,
        trustCost: 3,
        description: 'Who is watching?',
        preview: 'The station has eyes.',
        fullContent: '"There are no cameras here," Zara points out. "But I feel watched. Retinal tracking? No. It\'s deeper. The station reads your intent. It knows why you\'re here before you do."'
    },
    {
        id: 'zara_digital_ghost',
        characterId: 'zara',
        infoId: 'zara_deleted_profile',
        tier: 'rare',
        trustRequired: 5,
        trustCost: 2,
        description: 'When she erased herself',
        preview: 'She tried to disappear once.',
        fullContent: '"I deleted my entire digital footprint," Zara says. "Bank accounts, social media, birth certificate. For three days, I didn\'t exist. It was the most peaceful time of my life. Then the system auto-restored me."'
    },
    {
        id: 'zara_algorithm_bias',
        characterId: 'zara',
        infoId: 'zara_bias_rant',
        tier: 'common',
        trustRequired: 0,
        trustCost: 0,
        description: 'Why algorithms are racist',
        preview: 'Code isn\'t neutral.',
        fullContent: '"A face recognition AI thinks I\'m a man if I wear a hat," Zara scoffs. "It thinks I\'m criminal if I frown. We encoded our prejudices into silicon and called it objective. It\'s not objective. It\'s just efficiently bigoted."'
    },
    {
        id: 'zara_legendary_hack',
        characterId: 'zara',
        infoId: 'zara_god_mode',
        tier: 'legendary',
        trustRequired: 9,
        trustCost: 4,
        description: 'The ultimate hack',
        preview: 'She wants to crack the station\'s code.',
        fullContent: '"This station runs on an OS," Zara insists. "Maybe it\'s biological, potential-based code. But it has a root directory. If I find it... I can rewrite the rules. No more waiting. No more lost passengers."'
    }
]

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRY
// ═══════════════════════════════════════════════════════════════════════════
export const ALL_INFO_TRADES: InfoTradeOffer[] = [
    ...MAYA_INFO_TRADES,
    ...SAMUEL_INFO_TRADES,
    ...DEVON_INFO_TRADES,
    ...MARCUS_INFO_TRADES,
    ...TESS_INFO_TRADES,
    ...KAI_INFO_TRADES,
    ...ROHAN_INFO_TRADES,
    // Tier 2
    ...YAQUIN_INFO_TRADES,
    ...JORDAN_INFO_TRADES,
    ...ALEX_INFO_TRADES,
    ...SILAS_INFO_TRADES,
    // Tier 3
    ...ELENA_INFO_TRADES,
    ...GRACE_INFO_TRADES,
    ...ASHA_INFO_TRADES,
    ...LIRA_INFO_TRADES,
    ...ZARA_INFO_TRADES
]
