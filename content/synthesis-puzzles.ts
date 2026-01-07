/**
 * Synthesis Puzzles Data
 * Feature ID: D-083
 * 
 * Defines puzzles that require the player to synthesize knowledge from multiple sources.
 */

import { PatternType } from '../lib/patterns'

export interface SynthesisPuzzle {
    id: string
    title: string
    description: string
    requiredKnowledge: string[]  // Knowledge flags player must have
    hint: string                 // Shown when 50%+ knowledge collected
    solution: string             // Full synthesis text when complete
    reward: {
        patternBonus?: Partial<Record<PatternType, number>>
        unlockFlag?: string
        unlockNodeId?: string
    }
}

export const SYNTHESIS_PUZZLES: SynthesisPuzzle[] = [
    {
        id: 'station_origin',
        title: 'The Station\'s True Purpose',
        description: 'Piece together what the station really is.',
        requiredKnowledge: [
            'samuel_station_history',     // From Samuel
            'elena_archive_records',      // From Elena
            'rohan_deep_station_theory'   // From Rohan
        ],
        hint: 'Samuel knows the history, Elena has the records, and Rohan has a theory...',
        solution: 'The station isn\'t just a place - it\'s a manifestation of collective potential. It appears to those at crossroads, offering paths they couldn\'t see alone.',
        reward: {
            patternBonus: { exploring: 2 },
            unlockFlag: 'station_nature_understood',
            unlockNodeId: 'samuel_station_origin_reward'
        }
    },
    {
        id: 'letter_sender_identity',
        title: 'Who Sent the Invitation?',
        description: 'Discover who truly summoned you to the station.',
        requiredKnowledge: [
            'letter_handwriting_match',    // From Elena archive search
            'samuel_pocket_watch_secret',  // From Samuel high-trust trade
            'time_fold_understanding'      // From Quiet Hour arc
        ],
        hint: 'The handwriting is familiar. Time works differently here...',
        solution: 'You sent the letter yourself. From a future self who found their path, reaching back to the moment of greatest uncertainty.',
        reward: {
            patternBonus: { patience: 3 },
            unlockFlag: 'self_invitation_revealed',
            unlockNodeId: 'samuel_time_loop_dialogue'
        }
    },
    {
        id: 'birmingham_connection',
        title: 'The Birmingham Connection',
        description: 'Why here? Why this specific city?',
        requiredKnowledge: [
            'silas_engine_sound',         // From Silas trade
            'devon_utopia_plan',          // From Devon legendary trade
            'elena_history_repeats'       // From Elena trade
        ],
        hint: 'Listen to the engine with Silas, and look at Devon\'s maps.',
        solution: 'Birmingham is a city of thousand trades. The station feeds on that energy of creation. It requires a place where people make things real.',
        reward: {
            patternBonus: { helping: 2 },
            unlockFlag: 'city_connection_verified',
            unlockNodeId: 'devon_birmingham_reward'
        }
    },
    {
        id: 'repeating_patterns',
        title: 'The Repeating Patterns',
        description: 'You keep seeing the same faces. Why?',
        requiredKnowledge: [
            'devon_station_hypothesis',   // From Devon secret trade
            'marcus_fatal_error',         // From Marcus secret trade
            'elena_record_patterns'       // From Elena common trade
        ],
        hint: 'Devon counts the trains. Elena tracks the decades. The math matches.',
        solution: 'They aren\'t just passengers. They represent the archetypes of the city itself. The Healer, The Builder, The Navigator. As long as the city needs them, they return.',
        reward: {
            patternBonus: { analytical: 3 },
            unlockFlag: 'archetypes_recognized',
            unlockNodeId: 'devon_patterns_reward'
        }
    },
    {
        id: 'missing_platform',
        title: 'The Missing Platform',
        description: 'Platform Seven isn\'t on the map. Where is it?',
        requiredKnowledge: [
            'rohan_platform_mention',     // From Platform Seven Arc
            'elena_discovered_gap',       // From Platform Seven Arc
            'rohan_platform_7_truth'      // From Rohan legendary trade
        ],
        hint: 'Rohan has seen it. Elena has felt the gap in the records.',
        solution: 'Platform Seven exists inside the mind. It is the track that leads inward. Accessing it requires breaking the logic of the physical station.',
        reward: {
            patternBonus: { building: 2 },
            unlockFlag: 'platform_seven_mapped',
            unlockNodeId: 'rohan_platform_reward'
        }
    },
    {
        id: 'conductor_burden',
        title: 'The Conductor\'s Burden',
        description: 'Why does Samuel never leave?',
        requiredKnowledge: [
            'samuel_pocket_watch',        // From Samuel trade
            'elena_samuel_file',          // From Elena secret trade
            'quiet_hour_witnessed'        // From Quiet Hour Arc
        ],
        hint: 'He stopped his watch. He walks during the Quiet Hour.',
        solution: 'Samuel is the Anchor. If he leaves, time in the station starts moving forward again, and the magic collapses. He is the pin holding the map in place.',
        reward: {
            patternBonus: { patience: 3 },
            unlockFlag: 'conductor_role_understood',
            unlockNodeId: 'samuel_burden_reward'
        }
    },
    {
        id: 'archives_secret',
        title: 'The Archives Secret',
        description: 'What is Elena protecting?',
        requiredKnowledge: [
            'elena_missing_records',      // From Elena rare trade
            'zara_data_dilemma',          // From Zara trade
            'platform_records_found'      // From Platform Seven Arc
        ],
        hint: 'The gaps in the shelves aren\'t accidental.',
        solution: 'The archives record futures that didn\'t happen. Elena prunes the timelines. She isn\'t guarding history; she\'s guarding potential.',
        reward: {
            patternBonus: { analytical: 2 },
            unlockFlag: 'future_archives_unlocked',
            unlockNodeId: 'elena_archives_reward'
        }
    }
]

export function getPuzzleById(id: string): SynthesisPuzzle | undefined {
    return SYNTHESIS_PUZZLES.find(p => p.id === id)
}
