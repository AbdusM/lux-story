/**
 * Story Arc Registry
 * Feature ID: D-061
 * 
 * Central registry for all multi-session story arcs.
 */

import { StoryArc } from '../../lib/story-arcs'

// ═══════════════════════════════════════════════════════════════════════════
// ARC 1: THE LETTER MYSTERY
// ═══════════════════════════════════════════════════════════════════════════
const THE_LETTER_MYSTERY: StoryArc = {
    id: 'the_letter_mystery',
    title: 'The Letter Mystery',
    description: 'Who sent the invitation that brought you here?',
    requiredCharacters: ['samuel', 'elena'],
    chapters: [
        {
            id: 'chapter_1_arrival',
            title: 'The Invitation',
            description: 'Ask Samuel about the letter marked with the Station\'s seal.',
            nodeIds: ['samuel_letter_inquiry', 'samuel_letter_deflection'],
            completionFlag: 'letter_mystery_started'
        },
        {
            id: 'chapter_2_archives',
            title: 'Paper Trail',
            description: 'Search the archives with Elena for matching handwriting.',
            nodeIds: ['elena_archive_search', 'elena_found_match'],
            completionFlag: 'letter_author_identified',
            nextChapterTrigger: 'discovered_samuel_handwriting'
        },
        {
            id: 'chapter_3_confrontation',
            title: 'The Confrontation',
            description: 'Confront Samuel with the evidence of his interference.',
            nodeIds: ['samuel_letter_confrontation', 'samuel_admission'],
            completionFlag: 'letter_mystery_solved'
        }
    ],
    unlockCondition: {
        requiredFlags: ['letter_summons_you']
    }
}


// ═══════════════════════════════════════════════════════════════════════════
// ARC 2: PLATFORM SEVEN
// ═══════════════════════════════════════════════════════════════════════════
const PLATFORM_SEVEN: StoryArc = {
    id: 'platform_seven',
    title: 'Platform Seven',
    description: 'What lies beyond the flickering platform that nobody visits?',
    requiredCharacters: ['rohan', 'samuel', 'elena'],
    chapters: [
        {
            id: 'p7_ch1_rumors',
            title: 'Whispered Warnings',
            description: 'Rohan mentions Platform Seven. Samuel changes the subject.',
            nodeIds: ['rohan_platform_mention', 'samuel_platform_deflect'],
            completionFlag: 'platform_seven_discovered'
        },
        {
            id: 'p7_ch2_archives',
            title: 'The Missing Records',
            description: 'Elena\'s archives have a gap. Something was erased.',
            nodeIds: ['elena_missing_pages', 'elena_discovered_gap'],
            completionFlag: 'platform_records_found',
            nextChapterTrigger: 'elena_trust_7'
        },
        {
            id: 'p7_ch3_journey',
            title: 'The Descent',
            description: 'With enough trust, someone will take you there.',
            nodeIds: ['rohan_platform_journey', 'platform_seven_arrival'],
            completionFlag: 'platform_seven_visited'
        },
        {
            id: 'p7_ch4_truth',
            title: 'What Was Lost',
            description: 'Platform Seven holds the station\'s greatest secret.',
            nodeIds: ['platform_revelation', 'samuel_final_truth'],
            completionFlag: 'platform_mystery_solved'
        }
    ],
    unlockCondition: {
        minTrust: { rohan: 3 },
        minPatterns: { exploring: 3 }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ARC 3: THE QUIET HOUR
// ═══════════════════════════════════════════════════════════════════════════
const THE_QUIET_HOUR: StoryArc = {
    id: 'quiet_hour',
    title: 'The Quiet Hour',
    description: 'At midnight, time stops. Only some can move.',
    requiredCharacters: ['samuel', 'lira', 'asha'],
    chapters: [
        {
            id: 'qh_ch1_silence',
            title: 'The Silence Falls',
            description: 'You notice the station goes impossibly quiet at 11:59 PM.',
            nodeIds: ['lira_silence_comment', 'asha_stillness_observation'],
            completionFlag: 'quiet_hour_witnessed'
        },
        {
            id: 'qh_ch2_walkers',
            title: 'The Night Walkers',
            description: 'Samuel and Lira move freely when everything else is frozen.',
            nodeIds: ['samuel_frozen_time', 'lira_static_navigation'],
            completionFlag: 'quiet_hour_entered',
            nextChapterTrigger: 'patience_pattern_5'
        },
        {
            id: 'qh_ch3_heartbeat',
            title: 'The Station Heartbeat',
            description: 'In the silence, you can hear what powers the station.',
            nodeIds: ['station_core_sound', 'asha_heartbeat_sync'],
            completionFlag: 'station_heartbeat_heard'
        }
    ],
    unlockCondition: {
        minPatterns: { patience: 5 }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ARC 4: CAREER CROSSROADS
// ═══════════════════════════════════════════════════════════════════════════
const CAREER_CROSSROADS: StoryArc = {
    id: 'career_crossroads',
    title: 'Career Crossroads',
    description: 'A series of character-specific deep dives into life decisions.',
    requiredCharacters: ['jordan', 'maya', 'devon'],
    chapters: [
        {
            id: 'cc_ch1_doubt',
            title: 'The Seed of Doubt',
            description: 'Jordan questions if you are on the right path.',
            nodeIds: ['jordan_career_query', 'maya_work_doubt'],
            completionFlag: 'career_doubt_sown'
        },
        {
            id: 'cc_ch2_options',
            title: 'Infinite Paths',
            description: 'Devon shows you the probability map of your potential futures.',
            nodeIds: ['devon_probability_map', 'jordan_alternative_lives'],
            completionFlag: 'career_options_viewed'
        },
        {
            id: 'cc_ch3_decision',
            title: 'The Choice',
            description: 'You must commit to a direction, or accept being lost.',
            nodeIds: ['final_career_choice', 'station_acceptance'],
            completionFlag: 'career_path_chosen'
        }
    ],
    unlockCondition: {
        requiredFlags: ['completed_three_character_arcs']
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ARC 5: THE SHADOW WAR
// ═══════════════════════════════════════════════════════════════════════════
const THE_SHADOW_WAR: StoryArc = {
    id: 'shadow_war',
    title: 'The Shadow War',
    description: 'A covert conflict for control of the station\'s information flow.',
    requiredCharacters: ['zara', 'rohan'],
    chapters: [
        {
            id: 'sw_ch1_breach',
            title: 'The Signal Breach',
            description: 'Zara detects a transmission that violates station protocol.',
            nodeIds: ['zara_signal_discovery', 'zara_encryption_break'],
            completionFlag: 'shadow_war_started'
        },
        {
            id: 'sw_ch2_broker',
            title: 'The Broker',
            description: 'Unmask the entity trading passenger secrets.',
            nodeIds: ['zara_broker_trap', 'shadow_broker_confrontation'],
            completionFlag: 'shadow_broker_exposed'
        }
    ],
    unlockCondition: {
        minTrust: { zara: 4 }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ARC 6: CARE AND CONVICTION
// ═══════════════════════════════════════════════════════════════════════════
const CARE_AND_CONVICTION: StoryArc = {
    id: 'care_and_conviction',
    title: 'Care and Conviction',
    description: 'Three caretakers confront the cost of helping without losing themselves.',
    requiredCharacters: ['dante', 'grace', 'isaiah'],
    chapters: [
        {
            id: 'ccv_ch1_cracks',
            title: 'Cracks In The Armor',
            description: 'Dante and Grace both name the hidden cost of constant performance.',
            nodeIds: ['dante_vulnerability_arc', 'grace_vulnerability_arc'],
            completionFlag: 'care_conviction_started'
        },
        {
            id: 'ccv_ch2_weight',
            title: 'The Weight They Carry',
            description: 'Isaiah and Grace reveal what care has asked them to endure.',
            nodeIds: ['isaiah_vulnerability_arc', 'grace_vulnerability_daughter'],
            completionFlag: 'care_conviction_deepened'
        },
        {
            id: 'ccv_ch3_sustainable',
            title: 'Sustainable Service',
            description: 'Isaiah and Dante choose practices that preserve care over time.',
            nodeIds: ['isaiah_kept_going', 'dante_habit_insight'],
            completionFlag: 'care_conviction_integrated'
        }
    ],
    unlockCondition: {
        requiredFlags: ['dante_arc_complete', 'grace_arc_complete', 'isaiah_arc_complete']
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ARC 7: REPAIR PROTOCOL
// ═══════════════════════════════════════════════════════════════════════════
const REPAIR_PROTOCOL: StoryArc = {
    id: 'repair_protocol',
    title: 'Repair Protocol',
    description: 'Four realists learn how accountability, care, and systems repair can coexist.',
    requiredCharacters: ['alex', 'nadia', 'quinn', 'silas'],
    chapters: [
        {
            id: 'rp_ch1_fracture',
            title: 'Where It Broke',
            description: 'Alex and Silas name the pressure points where performance became survival.',
            nodeIds: ['alex_moral_injury', 'silas_burnout_story'],
            completionFlag: 'repair_protocol_started'
        },
        {
            id: 'rp_ch2_reckoning',
            title: 'Cost Accounting',
            description: 'Nadia and Quinn confront the human cost behind professional success metrics.',
            nodeIds: ['nadia_vulnerability_arc', 'quinn_vulnerability_arc'],
            completionFlag: 'repair_protocol_reckoning'
        },
        {
            id: 'rp_ch3_rebuild',
            title: 'Build What Lasts',
            description: 'Each of them chooses sustainable practices over performative perfection.',
            nodeIds: ['alex_learning_now', 'silas_learning_soil', 'nadia_haunted_change', 'quinn_self_forgiveness'],
            completionFlag: 'repair_protocol_integrated'
        }
    ],
    unlockCondition: {
        requiredFlags: ['alex_arc_complete', 'nadia_arc_complete', 'quinn_arc_complete', 'silas_arc_complete']
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ARC 8: BUILDERS COMMON
// ═══════════════════════════════════════════════════════════════════════════
const BUILDERS_COMMON: StoryArc = {
    id: 'builders_common',
    title: 'Builders Common',
    description: 'Four builders align craft, ethics, and community impact into a shared practice.',
    requiredCharacters: ['marcus', 'tess', 'yaquin', 'kai'],
    chapters: [
        {
            id: 'bc_ch1_frictions',
            title: 'Productive Friction',
            description: 'Marcus and Tess frame the tension between mission and market realities.',
            nodeIds: ['marcus_ethics_scale', 'tess_the_numbers'],
            completionFlag: 'builders_common_started'
        },
        {
            id: 'bc_ch2_voices',
            title: 'Voices In Public',
            description: 'Yaquin and Kai move from private skill to public contribution.',
            nodeIds: ['yaquin_launched', 'kai_deep_dive_success'],
            completionFlag: 'builders_common_public'
        },
        {
            id: 'bc_ch3_alignment',
            title: 'Aligned Craft',
            description: 'The group commits to building systems that are useful, teachable, and humane.',
            nodeIds: ['marcus_layer_four_personal', 'tess_p2_complete', 'yaquin_vulnerability_arc', 'kai_career_synthesis'],
            completionFlag: 'builders_common_integrated'
        }
    ],
    unlockCondition: {
        requiredFlags: ['marcus_arc_complete', 'tess_arc_complete', 'yaquin_arc_complete', 'kai_arc_complete']
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT REGISTRY
// ═══════════════════════════════════════════════════════════════════════════
export const ALL_STORY_ARCS: StoryArc[] = [
    THE_LETTER_MYSTERY,
    PLATFORM_SEVEN,
    THE_QUIET_HOUR,
    CAREER_CROSSROADS,
    THE_SHADOW_WAR,
    CARE_AND_CONVICTION,
    REPAIR_PROTOCOL,
    BUILDERS_COMMON
]

export function getArcById(id: string): StoryArc | undefined {
    return ALL_STORY_ARCS.find(arc => arc.id === id)
}
