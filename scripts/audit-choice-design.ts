/**
 * Choice Design Auditor
 * 
 * Audits dialogue nodes to ensure choices guide users toward deep engagement
 * Similar to narrative quality checks, but for choice design
 */

import { mayaDialogueNodes } from '../content/maya-dialogue-graph'
import { devonDialogueNodes } from '../content/devon-dialogue-graph'
import { jordanDialogueNodes } from '../content/jordan-dialogue-graph'
import { samuelDialogueNodes } from '../content/samuel-dialogue-graph'

interface ChoiceDesignIssue {
  nodeId: string
  speaker: string
  issue: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  recommendation: string
  currentChoices: string[]
}

interface ChoiceQualityScore {
  nodeId: string
  speaker: string
  score: number
  empathyOptions: number
  patienceOptions: number
  trustRewards: number
  quizMode: boolean
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
}

/**
 * Audit all dialogue nodes for choice design quality
 */
function auditChoiceDesign(): ChoiceDesignIssue[] {
  const allNodes = [
    ...mayaDialogueNodes,
    ...devonDialogueNodes,
    ...jordanDialogueNodes,
    ...samuelDialogueNodes
  ]
  
  const issues: ChoiceDesignIssue[] = []
  
  for (const node of allNodes) {
    const choices = node.choices || []
    
    // Skip nodes with no choices (pure narration)
    if (choices.length === 0) continue
    
    // Get choice texts
    const choiceTexts = choices.map(c => c.text)
    
    // ========================================
    // CRITICAL: No Empathetic Option
    // ========================================
    const hasEmpathy = choices.some(c => 
      c.pattern === 'helping' || c.pattern === 'patience'
    )
    
    if (!hasEmpathy && choices.length >= 2) {
      issues.push({
        nodeId: node.nodeId,
        speaker: node.speaker,
        issue: 'No empathetic choice available',
        severity: 'critical',
        recommendation: 'Add at least one "helping" or "patience" choice that gives +1 trust',
        currentChoices: choiceTexts
      })
    }
    
    // ========================================
    // HIGH: Analytical Rewards More Than Empathy
    // ========================================
    const empathyChoices = choices.filter(c => c.pattern === 'helping' || c.pattern === 'patience')
    const analyticalChoices = choices.filter(c => c.pattern === 'analytical')
    
    const maxEmpathyReward = Math.max(
      0,
      ...empathyChoices.map(c => c.consequence?.trustChange || 0)
    )
    
    const maxAnalyticalReward = Math.max(
      0,
      ...analyticalChoices.map(c => c.consequence?.trustChange || 0)
    )
    
    if (maxAnalyticalReward > maxEmpathyReward && empathyChoices.length > 0) {
      issues.push({
        nodeId: node.nodeId,
        speaker: node.speaker,
        issue: `Analytical choice rewards ${maxAnalyticalReward} trust, empathy only ${maxEmpathyReward}`,
        severity: 'high',
        recommendation: 'Empathy should reward equal or more trust than analytical choices',
        currentChoices: choiceTexts
      })
    }
    
    // ========================================
    // MEDIUM: All Choices Are Questions (Quiz Mode)
    // ========================================
    const allQuestions = choices.every(c => {
      const text = c.text.toLowerCase()
      return text.includes('?') || 
             text.startsWith('what ') || 
             text.startsWith('why ') || 
             text.startsWith('how ') ||
             text.startsWith('when ') ||
             text.startsWith('where ')
    })
    
    if (allQuestions && choices.length >= 2) {
      issues.push({
        nodeId: node.nodeId,
        speaker: node.speaker,
        issue: 'All choices are interrogative (quiz mode)',
        severity: 'medium',
        recommendation: 'Add at least one statement: "That sounds hard" or "[Wait]"',
        currentChoices: choiceTexts
      })
    }
    
    // ========================================
    // MEDIUM: No Patience Option at Emotional Moment
    // ========================================
    const isEmotionalMoment = node.content.some(c => 
      c.emotion && (
        c.emotion.includes('anxious') ||
        c.emotion.includes('vulnerable') ||
        c.emotion.includes('conflicted') ||
        c.emotion.includes('wounded') ||
        c.emotion.includes('crying')
      )
    )
    
    const hasPatience = choices.some(c => c.pattern === 'patience')
    
    if (isEmotionalMoment && !hasPatience && choices.length >= 2) {
      issues.push({
        nodeId: node.nodeId,
        speaker: node.speaker,
        issue: 'Emotional moment but no patience option',
        severity: 'medium',
        recommendation: 'Add "[Wait]" or "[Say nothing]" choice with +2 trust reward',
        currentChoices: choiceTexts
      })
    }
    
    // ========================================
    // LOW: Patience Not in Brackets
    // ========================================
    const patienceChoices = choices.filter(c => c.pattern === 'patience')
    const patienceWithoutBrackets = patienceChoices.filter(c => 
      !c.text.startsWith('[') || !c.text.endsWith(']')
    )
    
    if (patienceWithoutBrackets.length > 0) {
      issues.push({
        nodeId: node.nodeId,
        speaker: node.speaker,
        issue: 'Patience choice not in [brackets]',
        severity: 'low',
        recommendation: 'Format patience as "[Wait]" or "[Say nothing]" to signal special choice',
        currentChoices: patienceWithoutBrackets.map(c => c.text)
      })
    }
    
    // ========================================
    // LOW: Empathy Not in Position 2
    // ========================================
    if (choices.length === 3 && hasEmpathy) {
      const position2Choice = choices[1]
      const isEmpathetic = position2Choice.pattern === 'helping' || position2Choice.pattern === 'patience'
      
      if (!isEmpathetic) {
        issues.push({
          nodeId: node.nodeId,
          speaker: node.speaker,
          issue: 'Empathetic choice not in position 2 (default draw)',
          severity: 'low',
          recommendation: 'Reorder: Analytical | Empathetic | Patient for optimal engagement',
          currentChoices: choiceTexts
        })
      }
    }
  }
  
  return issues
}

/**
 * Score each node's choice quality (0-100)
 */
function scoreChoiceQuality(): ChoiceQualityScore[] {
  const allNodes = [
    ...mayaDialogueNodes,
    ...devonDialogueNodes,
    ...jordanDialogueNodes,
    ...samuelDialogueNodes
  ]
  
  const scores: ChoiceQualityScore[] = []
  
  for (const node of allNodes) {
    const choices = node.choices || []
    
    // Skip nodes with no choices
    if (choices.length === 0) continue
    
    let score = 50 // Start at baseline
    
    // Count empathy options (+20 per option, max +40)
    const empathyOptions = choices.filter(c => c.pattern === 'helping').length
    score += Math.min(40, empathyOptions * 20)
    
    // Count patience options (+30 per option, max +30)
    const patienceOptions = choices.filter(c => c.pattern === 'patience').length
    score += Math.min(30, patienceOptions * 30)
    
    // Trust rewards (+10 per +1 trust)
    const totalTrustReward = choices.reduce((sum, c) => 
      sum + (c.consequence?.trustChange || 0), 0
    )
    score += totalTrustReward * 10
    
    // Quiz mode penalty (-30)
    const allQuestions = choices.every(c => {
      const text = c.text.toLowerCase()
      return text.includes('?') || text.startsWith('what ') || text.startsWith('why ')
    })
    if (allQuestions && choices.length >= 2) {
      score -= 30
    }
    
    // Clamp to 0-100
    score = Math.max(0, Math.min(100, score))
    
    // Assign grade
    let grade: 'A' | 'B' | 'C' | 'D' | 'F'
    if (score >= 90) grade = 'A'
    else if (score >= 80) grade = 'B'
    else if (score >= 70) grade = 'C'
    else if (score >= 60) grade = 'D'
    else grade = 'F'
    
    scores.push({
      nodeId: node.nodeId,
      speaker: node.speaker,
      score,
      empathyOptions,
      patienceOptions,
      trustRewards: totalTrustReward,
      quizMode: allQuestions,
      grade
    })
  }
  
  return scores
}

/**
 * Generate comprehensive report
 */
function generateReport() {
  console.log('╔══════════════════════════════════════════════════════╗')
  console.log('║        CHOICE DESIGN QUALITY AUDIT                   ║')
  console.log('╚══════════════════════════════════════════════════════╝\n')
  
  const issues = auditChoiceDesign()
  const scores = scoreChoiceQuality()
  
  // Summary Statistics
  console.log('📊 SUMMARY STATISTICS')
  console.log('─'.repeat(60))
  
  const totalNodes = scores.length
  const avgScore = scores.reduce((sum, s) => sum + s.score, 0) / totalNodes
  const gradeDistribution = {
    A: scores.filter(s => s.grade === 'A').length,
    B: scores.filter(s => s.grade === 'B').length,
    C: scores.filter(s => s.grade === 'C').length,
    D: scores.filter(s => s.grade === 'D').length,
    F: scores.filter(s => s.grade === 'F').length
  }
  
  console.log(`Total Nodes with Choices: ${totalNodes}`)
  console.log(`Average Score: ${avgScore.toFixed(1)}/100`)
  console.log(`\nGrade Distribution:`)
  console.log(`  A (90-100): ${gradeDistribution.A} nodes`)
  console.log(`  B (80-89):  ${gradeDistribution.B} nodes`)
  console.log(`  C (70-79):  ${gradeDistribution.C} nodes`)
  console.log(`  D (60-69):  ${gradeDistribution.D} nodes`)
  console.log(`  F (0-59):   ${gradeDistribution.F} nodes`)
  
  // Issues by Severity
  console.log('\n\n🚨 ISSUES BY SEVERITY')
  console.log('─'.repeat(60))
  
  const bySeverity = {
    critical: issues.filter(i => i.severity === 'critical'),
    high: issues.filter(i => i.severity === 'high'),
    medium: issues.filter(i => i.severity === 'medium'),
    low: issues.filter(i => i.severity === 'low')
  }
  
  console.log(`Critical: ${bySeverity.critical.length}`)
  console.log(`High:     ${bySeverity.high.length}`)
  console.log(`Medium:   ${bySeverity.medium.length}`)
  console.log(`Low:      ${bySeverity.low.length}`)
  console.log(`Total:    ${issues.length}`)
  
  // Critical Issues Detail
  if (bySeverity.critical.length > 0) {
    console.log('\n\n🔴 CRITICAL ISSUES (Must Fix)')
    console.log('─'.repeat(60))
    
    bySeverity.critical.forEach((issue, idx) => {
      console.log(`\n${idx + 1}. ${issue.nodeId} (${issue.speaker})`)
      console.log(`   Issue: ${issue.issue}`)
      console.log(`   Fix: ${issue.recommendation}`)
      console.log(`   Current choices:`)
      issue.currentChoices.forEach(c => console.log(`     - "${c}"`))
    })
  }
  
  // High Issues Detail
  if (bySeverity.high.length > 0) {
    console.log('\n\n🟠 HIGH PRIORITY ISSUES')
    console.log('─'.repeat(60))
    
    bySeverity.high.slice(0, 5).forEach((issue, idx) => {
      console.log(`\n${idx + 1}. ${issue.nodeId} (${issue.speaker})`)
      console.log(`   Issue: ${issue.issue}`)
      console.log(`   Fix: ${issue.recommendation}`)
    })
    
    if (bySeverity.high.length > 5) {
      console.log(`\n   ... and ${bySeverity.high.length - 5} more high priority issues`)
    }
  }
  
  // Top Scoring Nodes (Examples to Follow)
  console.log('\n\n✅ TOP 10 BEST-DESIGNED CHOICES (Examples to Follow)')
  console.log('─'.repeat(60))
  
  const topScores = scores.sort((a, b) => b.score - a.score).slice(0, 10)
  topScores.forEach((score, idx) => {
    console.log(`${idx + 1}. ${score.nodeId} (${score.speaker})`)
    console.log(`   Score: ${score.score}/100 (Grade: ${score.grade})`)
    console.log(`   Empathy: ${score.empathyOptions}, Patience: ${score.patienceOptions}, Trust: +${score.trustRewards}`)
  })
  
  // Bottom Scoring Nodes (Needs Improvement)
  console.log('\n\n⚠️  BOTTOM 10 CHOICES (Needs Improvement)')
  console.log('─'.repeat(60))
  
  const bottomScores = scores.sort((a, b) => a.score - b.score).slice(0, 10)
  bottomScores.forEach((score, idx) => {
    console.log(`${idx + 1}. ${score.nodeId} (${score.speaker})`)
    console.log(`   Score: ${score.score}/100 (Grade: ${score.grade})`)
    console.log(`   Empathy: ${score.empathyOptions}, Patience: ${score.patienceOptions}, Quiz Mode: ${score.quizMode ? 'YES' : 'no'}`)
  })
  
  // Action Items
  console.log('\n\n📋 RECOMMENDED ACTION ITEMS')
  console.log('─'.repeat(60))
  console.log(`1. Fix ${bySeverity.critical.length} critical issues (no empathetic options)`)
  console.log(`2. Review ${bySeverity.high.length} high priority issues (reward structure)`)
  console.log(`3. Polish ${bottomScores.length} lowest-scoring nodes`)
  console.log(`4. Study top 10 nodes as templates for new content`)
  console.log(`5. Target: Raise average score from ${avgScore.toFixed(1)} to 85+`)
  
  // Overall Assessment
  console.log('\n\n🎯 OVERALL ASSESSMENT')
  console.log('─'.repeat(60))
  
  if (avgScore >= 85) {
    console.log('✅ EXCELLENT - Choice design is guiding users to deep engagement')
  } else if (avgScore >= 75) {
    console.log('✅ GOOD - Solid foundation, some optimization needed')
  } else if (avgScore >= 65) {
    console.log('⚠️  FAIR - Needs improvement to prevent quiz mentality')
  } else {
    console.log('🔴 NEEDS WORK - Many nodes not guiding engagement effectively')
  }
  
  console.log('\n' + '═'.repeat(60))
}

// Run the audit
generateReport()

