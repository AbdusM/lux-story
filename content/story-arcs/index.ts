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
// EXPORT REGISTRY
// ═══════════════════════════════════════════════════════════════════════════
export const ALL_STORY_ARCS: StoryArc[] = [
    THE_LETTER_MYSTERY,
    PLATFORM_SEVEN,
    THE_QUIET_HOUR,
    CAREER_CROSSROADS,
    THE_SHADOW_WAR
]

export function getArcById(id: string): StoryArc | undefined {
    return ALL_STORY_ARCS.find(arc => arc.id === id)
}
