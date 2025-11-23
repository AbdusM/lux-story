/**
 * Audit interaction tag usage across refactored arcs
 * Goal: Identify overuse and suggest strategic reduction
 */

import { marcusDialogueGraph } from '../content/marcus-dialogue-graph'
import { tessDialogueGraph } from '../content/tess-dialogue-graph'
import { yaquinDialogueGraph } from '../content/yaquin-dialogue-graph'

interface InteractionStats {
  arcName: string
  totalNodes: number
  nodesWithInteractions: number
  interactionCounts: Record<string, number>
  recommendations: string[]
}

function auditInteractions(arcName: string, graph: any): InteractionStats {
  const nodeArray = Array.from(graph.nodes.values())
  const totalNodes = nodeArray.length
  const interactionCounts: Record<string, number> = {}
  const nodesWithInteraction: string[] = []

  nodeArray.forEach((node: any) => {
    if (node.interaction) {
      nodesWithInteraction.push(node.id)
      interactionCounts[node.interaction] = (interactionCounts[node.interaction] || 0) + 1
    }
  })

  const interactionPct = ((nodesWithInteraction.length / totalNodes) * 100).toFixed(1)
  const recommendations: string[] = []

  // Strategic recommendations
  if (parseFloat(interactionPct) > 75) {
    recommendations.push(`⚠️  ${interactionPct}% of nodes have interactions - TOO MANY`)
    recommendations.push("   Reduce to 30-50% for strategic impact")
    recommendations.push("   Keep interactions for KEY emotional/dramatic moments only")
  } else if (parseFloat(interactionPct) > 50) {
    recommendations.push(`⚠️  ${interactionPct}% of nodes have interactions - STILL HIGH`)
    recommendations.push("   Consider reducing to 30-40% for better impact")
  } else {
    recommendations.push(`✅ ${interactionPct}% of nodes have interactions - Good balance`)
  }

  // Check for overused specific interactions
  Object.entries(interactionCounts).forEach(([type, count]) => {
    const pct = ((count / totalNodes) * 100).toFixed(1)
    if (parseFloat(pct) > 30) {
      recommendations.push(`⚠️  '${type}' used ${count} times (${pct}%) - OVERUSED`)
      recommendations.push(`   Reduce to 3-5 key moments only`)
    }
  })

  return {
    arcName,
    totalNodes,
    nodesWithInteractions: nodesWithInteraction.length,
    interactionCounts,
    recommendations
  }
}

console.log('='.repeat(70))
console.log('INTERACTION TAG USAGE AUDIT')
console.log('Goal: Strategic use (30-50% of nodes, key moments only)')
console.log('='.repeat(70))

const results: InteractionStats[] = [
  auditInteractions('Marcus', marcusDialogueGraph),
  auditInteractions('Tess', tessDialogueGraph),
  auditInteractions('Yaquin', yaquinDialogueGraph)
]

results.forEach(result => {
  console.log(`\n${'='.repeat(70)}`)
  console.log(`${result.arcName} Arc (${result.totalNodes} nodes)`)
  console.log('='.repeat(70))

  const interactionPct = ((result.nodesWithInteractions / result.totalNodes) * 100).toFixed(1)
  console.log(`\n📊 Coverage: ${result.nodesWithInteractions}/${result.totalNodes} nodes (${interactionPct}%)`)

  console.log(`\n🎯 Usage by Type:`)
  Object.entries(result.interactionCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      const pct = ((count / result.totalNodes) * 100).toFixed(1)
      console.log(`   ${type.padEnd(10)} ${String(count).padStart(2)}× (${pct.padStart(5)}%)`)
    })

  console.log(`\n💡 Recommendations:`)
  result.recommendations.forEach(rec => console.log(`   ${rec}`))
})

// Summary
console.log(`\n${'='.repeat(70)}`)
console.log('STRATEGIC REDUCTION GUIDE')
console.log('='.repeat(70))

console.log(`
Interaction tags should be used SPARINGLY for maximum impact:

✅ GOOD USE CASES (3-5 per arc):
- **shake**: Critical alarms, crisis moments, urgent emphasis
- **bloom**: Major breakthrough realizations, "aha!" moments
- **small**: Vulnerability reveals, defeat/regret moments
- **big**: Triumph, major achievement, climactic success

❌ REDUCE/REMOVE:
- Routine affirmations (nod should be rare)
- Minor nervous moments (jitter should be rare)
- Every realization (bloom only for MAJOR insights)
- Generic emphasis (shake only for URGENT moments)

TARGET: 30-40% interaction coverage (not 50-70%)

Each interaction should feel SPECIAL and MEMORABLE.
If players see shake/bloom/jitter too often, they lose impact.
`)

console.log('='.repeat(70))
