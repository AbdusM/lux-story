#!/usr/bin/env npx tsx
/**
 * Character Voice Auditor
 * 
 * Part of the "Critic" Model (Phase 8).
 * Analyzes dialogue across all characters to ensure distinct voices.
 * 
 * Metrics:
 * - Vocabulary Richness (Unique words / Total words)
 * - Avg Sentence Length
 * - Question Frequency
 * - Exclamation Frequency
 * - "Voiceprint" Keywords
 */

import { DialogueNode } from '../lib/dialogue-graph'
import { samuelDialogueNodes } from '../content/samuel-dialogue-graph'
import { mayaDialogueNodes } from '../content/maya-dialogue-graph'
import { devonDialogueNodes } from '../content/devon-dialogue-graph'
import { jordanDialogueNodes } from '../content/jordan-dialogue-graph'
import { kaiDialogueNodes } from '../content/kai-dialogue-graph'
import { silasDialogueNodes } from '../content/silas-dialogue-graph'
import { marcusDialogueNodes } from '../content/marcus-dialogue-graph'
import { tessDialogueNodes } from '../content/tess-dialogue-graph'
import { rohanDialogueNodes } from '../content/rohan-dialogue-graph'
import { yaquinDialogueNodes } from '../content/yaquin-dialogue-graph'
import { alexDialogueNodes } from '../content/alex-dialogue-graph'
import { liraDialogueNodes } from '../content/lira-dialogue-graph'
import { zaraDialogueNodes } from '../content/zara-dialogue-graph'
import { ashaDialogueNodes } from '../content/asha-dialogue-graph'
import { elenaDialogueNodes } from '../content/elena-dialogue-graph'

// Types
interface VoiceStats {
    name: string
    nodeCount: number
    totalWords: number
    uniqueWords: number
    avgWordsPerNode: number
    vocabularyRichness: number // 0-1
    questionRatio: number // Questions / Total Sentences
    exclamationRatio: number // Exclamations / Total Sentences
    topWords: string[]
}

const CHARACTERS = [
    { name: 'Samuel', nodes: samuelDialogueNodes },
    { name: 'Maya', nodes: mayaDialogueNodes },
    { name: 'Devon', nodes: devonDialogueNodes },
    { name: 'Jordan', nodes: jordanDialogueNodes },
    { name: 'Kai', nodes: kaiDialogueNodes },
    { name: 'Silas', nodes: silasDialogueNodes },
    { name: 'Marcus', nodes: marcusDialogueNodes },
    { name: 'Tess', nodes: tessDialogueNodes },
    { name: 'Rohan', nodes: rohanDialogueNodes },
    { name: 'Yaquin', nodes: yaquinDialogueNodes },
    { name: 'Alex', nodes: alexDialogueNodes },
    { name: 'Lira', nodes: liraDialogueNodes || [] }, // Fallback if not exported
    { name: 'Zara', nodes: zaraDialogueNodes || [] },
    { name: 'Asha', nodes: ashaDialogueNodes || [] },
    { name: 'Elena', nodes: elenaDialogueNodes || [] }
]

function cleanText(text: string): string {
    return text
        .replace(/<[^>]+>/g, '')  // Remove HTML-like tags
        .replace(/\{\{[^}]+\}\}/g, '')  // Remove conditional blocks
        .replace(/\*[^*]+\*/g, '')  // Remove stage directions
        .trim()
}

function analyzeCharacter(name: string, nodes: DialogueNode[]): VoiceStats {
    let totalWords = 0
    const wordMap = new Map<string, number>()
    let sentenceCount = 0
    let questionCount = 0
    let exclamationCount = 0

    if (!nodes || nodes.length === 0) {
        return {
            name, nodeCount: 0, totalWords: 0, uniqueWords: 0,
            avgWordsPerNode: 0, vocabularyRichness: 0,
            questionRatio: 0, exclamationRatio: 0, topWords: []
        }
    }

    for (const node of nodes) {
        for (const content of node.content || []) {
            const text = cleanText(content.text)
            const tokens = text.toLowerCase().match(/\b\w+\b/g) || []

            totalWords += tokens.length
            tokens.forEach(t => wordMap.set(t, (wordMap.get(t) || 0) + 1))

            // Sentence analysis
            const sentences = text.split(/[.!?]+/)
            sentenceCount += sentences.length
            questionCount += (text.match(/\?/g) || []).length
            exclamationCount += (text.match(/!/g) || []).length
        }
    }

    const uniqueWords = wordMap.size
    const sortedWords = [...wordMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .filter(w => w[0].length > 3) // Ignore "the", "and", etc.
        .slice(0, 5)
        .map(w => w[0])

    return {
        name,
        nodeCount: nodes.length,
        totalWords,
        uniqueWords,
        avgWordsPerNode: totalWords / nodes.length,
        vocabularyRichness: totalWords > 0 ? uniqueWords / totalWords : 0,
        questionRatio: sentenceCount > 0 ? questionCount / sentenceCount : 0,
        exclamationRatio: sentenceCount > 0 ? exclamationCount / sentenceCount : 0,
        topWords: sortedWords
    }
}

async function main() {
    console.log('\n🎙️  Character Voice Audit')
    console.log('═'.repeat(100))
    console.log(`${'Name'.padEnd(10)} | ${'Nodes'.padStart(5)} | ${'Richness'.padStart(8)} | ${'Avg Len'.padStart(7)} | ${'Q Ratio'.padStart(7)} | ${'! Ratio'.padStart(7)} | Top Words`)
    console.log('─'.repeat(100))

    const stats: VoiceStats[] = []

    for (const char of CHARACTERS) {
        // @ts-expect-error - Some imports might be incomplete
        const result = analyzeCharacter(char.name, char.nodes)
        stats.push(result)

        if (result.nodeCount > 0) {
            console.log(
                `${char.name.padEnd(10)} | ` +
                `${result.nodeCount.toString().padStart(5)} | ` +
                `${result.vocabularyRichness.toFixed(2).padStart(8)} | ` +
                `${result.avgWordsPerNode.toFixed(1).padStart(7)} | ` +
                `${result.questionRatio.toFixed(2).padStart(7)} | ` +
                `${result.exclamationRatio.toFixed(2).padStart(7)} | ` +
                `${result.topWords.join(', ')}`
            )
        }
    }
    console.log('─'.repeat(100))
    console.log('GUIDE:')
    console.log('• Richness < 0.30: Repetitive/Simple (Good for Robots)')
    console.log('• Richness > 0.50: Complex/Literary (Good for Philosophers)')
    console.log('• Q Ratio > 0.30: Inquisitive/Uncertain (Rohan?)')
    console.log('• ! Ratio > 0.20: Emotional/Aggressive (Jordan?)')
    console.log('')
}

main()
