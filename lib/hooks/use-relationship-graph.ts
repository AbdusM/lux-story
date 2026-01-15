/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react'
import { useGameStore } from '@/lib/game-store'
import {
    CHARACTER_RELATIONSHIP_WEB,
    RelationshipType
} from '@/lib/character-relationships'

export interface GraphNode {
    id: string
    name: string
    trust: number
    relationshipStatus: string
    // D3 simulation properties
    x?: number
    y?: number
    fx?: number | null
    fy?: number | null
}

export interface GraphLink {
    id: string
    source: string // ID for D3 (will be replaced by object reference by D3)
    target: string // ID for D3
    type: RelationshipType
    intensity: number
    sentiment: 'positive' | 'neutral' | 'negative' | 'conflicted'
    publicOpinion: string
    privateOpinion: string
}

export const useRelationshipGraph = () => {
    // Use core state (Single Source of Truth)

    // Wait, useGameStore().characters is from GameState which is a Map in Hydrated state?
    // Let's check how useGameStore is initialized.

    // Actually, useGameStore().characters is defined in GameState interface as Map<string, CharacterState>
    // BUT... persist middleware serializes Maps to objects/arrays usually unless custom storage is used.
    // lib/game-store.ts implies it handles serialization manually via setCoreGameState logic, 
    // but the top level 'characters' is defined as Map.
    // HOWEVER, zustand persist usually doesn't handle Map without custom storage.
    // Let's assume for now we should use 'coreGameState' if available for reliability, or check runtime.

    // Safe access using coreGameState (Single Source of Truth)
    const coreGameState = useGameStore(state => state.coreGameState)

    return useMemo(() => {
        // 1. Identify met characters (Nodes)
        const nodes: GraphNode[] = []
        const metCharacterIds = new Set<string>()
        const links: GraphLink[] = []

        // Pre-compute flag set
        const globalFlagsSet = new Set(coreGameState?.globalFlags || [])

        // Add Player Node (Center)
        // nodes.push({ id: 'player', name: 'You', trust: 10, relationshipStatus: 'self' })
        // OR just show NPCs. Let's show NPCs for the "Web" style.

        if (coreGameState) {
            // Use core state (SerializableGameState) -> characters is Array
            coreGameState.characters.forEach(char => {
                // Check if met: 'met_[name]' flag OR conversation history > 0
                // A simpler way: if they have any trust change or history


                // Actually, let's use the explicit 'met_[name]' flags if they exist, 
                // OR rely on conversationHistory.
                // Let's assume conversationHistory > 0 means they are "on the board".

                if (char.conversationHistory.length > 0) {
                    metCharacterIds.add(char.characterId)
                    nodes.push({
                        id: char.characterId,
                        name: char.characterId.charAt(0).toUpperCase() + char.characterId.slice(1),
                        trust: char.trust,
                        relationshipStatus: char.relationshipStatus
                    })
                }
            })
        }

        CHARACTER_RELATIONSHIP_WEB.forEach((edge, index) => {
            // CRITICAL FIX: Only add links if both nodes exist
            if (!metCharacterIds.has(edge.fromCharacterId) || !metCharacterIds.has(edge.toCharacterId)) {
                return // Skip this link if either character hasn't been met
            }

            // Check reveal conditions
            if (edge.revealConditions) {
                // Trust check (from the 'from' character's perspective)
                const fromChar = coreGameState?.characters.find(c => c.characterId === edge.fromCharacterId)
                if (edge.revealConditions.trustMin && fromChar) {
                    if (fromChar.trust < edge.revealConditions.trustMin) return
                }

                // Characters Met check
                if (edge.revealConditions.charactersMet) {
                    const allMet = edge.revealConditions.charactersMet.every(id => metCharacterIds.has(id))
                    if (!allMet) return
                }

                // Flags check
                if (edge.revealConditions.requiredFlags && coreGameState) {
                    const hasFlags = edge.revealConditions.requiredFlags.every(flag => globalFlagsSet.has(flag))
                    if (!hasFlags) return
                }
            }

            // Calculate Dynamic State
            let currentType = edge.type
            let currentIntensity = edge.intensity
            let currentPublicOpinion = edge.opinions.publicOpinion
            let currentPrivateOpinion = edge.opinions.privateOpinion
            const currentSentiment = edge.opinions.sentiment

            // Apply Dynamic Rules
            if (edge.dynamicRules) {
                edge.dynamicRules.forEach(rule => {
                    const allFlagsMet = rule.triggerFlags.every(f => globalFlagsSet.has(f))
                    if (allFlagsMet) {
                        currentType = rule.newType
                        currentIntensity = rule.newIntensity
                        if (rule.newPublicOpinion) currentPublicOpinion = rule.newPublicOpinion
                        if (rule.newPrivateOpinion) currentPrivateOpinion = rule.newPrivateOpinion
                    }
                })
            }

            links.push({
                id: `link-${index}`, // Unique ID for D3
                source: edge.fromCharacterId,
                target: edge.toCharacterId,
                type: currentType,
                intensity: currentIntensity,
                sentiment: currentSentiment,
                publicOpinion: currentPublicOpinion,
                privateOpinion: currentPrivateOpinion
            })
        })

        return { nodes, links }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coreGameState])
}
