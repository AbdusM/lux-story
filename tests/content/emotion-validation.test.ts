import { describe, it, expect } from 'vitest'
import { isValidEmotion } from '../../lib/emotions'
import { samuelDialogueGraph } from '../../content/samuel-dialogue-graph'
import { mayaDialogueGraph } from '../../content/maya-dialogue-graph'
import { marcusDialogueGraph } from '../../content/marcus-dialogue-graph'
import { rohanDialogueGraph } from '../../content/rohan-dialogue-graph'
import { kaiDialogueGraph } from '../../content/kai-dialogue-graph'
import { devonDialogueGraph } from '../../content/devon-dialogue-graph'
import { tessDialogueGraph } from '../../content/tess-dialogue-graph'
import { yaquinDialogueGraph } from '../../content/yaquin-dialogue-graph'
import { graceDialogueGraph } from '../../content/grace-dialogue-graph'
import { elenaDialogueGraph } from '../../content/elena-dialogue-graph'
import { alexDialogueGraph } from '../../content/alex-dialogue-graph'
import { jordanDialogueGraph } from '../../content/jordan-dialogue-graph'
import { silasDialogueGraph } from '../../content/silas-dialogue-graph'
import { ashaDialogueGraph } from '../../content/asha-dialogue-graph'
import { liraDialogueGraph } from '../../content/lira-dialogue-graph'
import { zaraDialogueGraph } from '../../content/zara-dialogue-graph'
import { quinnDialogueGraph } from '../../content/quinn-dialogue-graph'
import { danteDialogueGraph } from '../../content/dante-dialogue-graph'
import { nadiaDialogueGraph } from '../../content/nadia-dialogue-graph'
import { isaiahDialogueGraph } from '../../content/isaiah-dialogue-graph'

describe('Content Emotion Validation', () => {
  const graphs = [
    { name: 'Samuel', graph: samuelDialogueGraph },
    { name: 'Maya', graph: mayaDialogueGraph },
    { name: 'Marcus', graph: marcusDialogueGraph },
    { name: 'Rohan', graph: rohanDialogueGraph },
    { name: 'Kai', graph: kaiDialogueGraph },
    { name: 'Devon', graph: devonDialogueGraph },
    { name: 'Tess', graph: tessDialogueGraph },
    { name: 'Yaquin', graph: yaquinDialogueGraph },
    { name: 'Grace', graph: graceDialogueGraph },
    { name: 'Elena', graph: elenaDialogueGraph },
    { name: 'Alex', graph: alexDialogueGraph },
    { name: 'Jordan', graph: jordanDialogueGraph },
    { name: 'Silas', graph: silasDialogueGraph },
    { name: 'Asha', graph: ashaDialogueGraph },
    { name: 'Lira', graph: liraDialogueGraph },
    { name: 'Zara', graph: zaraDialogueGraph },
    { name: 'Quinn', graph: quinnDialogueGraph },
    { name: 'Dante', graph: danteDialogueGraph },
    { name: 'Nadia', graph: nadiaDialogueGraph },
    { name: 'Isaiah', graph: isaiahDialogueGraph }
  ]

  graphs.forEach(({ name, graph }) => {
    it(`${name}: All emotions should be valid`, () => {
      const invalidEmotions: Array<{ nodeId: string, emotion: string }> = []

      graph.nodes.forEach((node, nodeId) => {
        node.content.forEach((content, index) => {
          if (content.emotion && !isValidEmotion(content.emotion)) {
            invalidEmotions.push({ nodeId, emotion: content.emotion })
          }
        })
      })

      if (invalidEmotions.length > 0) {
        console.log(`\n${name} invalid emotions:`)
        invalidEmotions.forEach(({ nodeId, emotion }) => {
          console.log(`  - ${nodeId}: "${emotion}"`)
        })
      }

      expect(invalidEmotions).toEqual([])
    })
  })

  it('Summary: All dialogue graphs have valid emotions', () => {
    let totalNodes = 0
    let totalContent = 0
    let totalEmotions = 0

    graphs.forEach(({ graph }) => {
      graph.nodes.forEach((node) => {
        totalNodes++
        node.content.forEach((content) => {
          totalContent++
          if (content.emotion) totalEmotions++
        })
      })
    })

    console.log(`\nEmotion Validation Summary:`)
    console.log(`  Total nodes: ${totalNodes}`)
    console.log(`  Total content blocks: ${totalContent}`)
    console.log(`  Total emotion references: ${totalEmotions}`)
  })
})
