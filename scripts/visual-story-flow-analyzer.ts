/**
 * VisualStoryFlowAnalyzer - Graphviz-based Story Flow Visualization
 *
 * Essential debugging tool for immediate identification of narrative issues
 * Generates DOT files and visual graphs to spot broken connections, dead ends,
 * Birmingham career path coverage, and character arc continuity
 */

import fs from 'fs'
import path from 'path'
import { StoryData, Scene, Choice, getLuxStoryContext } from './lux-story-context'

export interface StorySubgraph {
  nodes: Map<string, Scene>
  edges: Map<string, FlowEdge[]>
  metadata: {
    title: string
    filter: string
    nodeCount: number
    edgeCount: number
  }
}

export interface FlowEdge {
  from: string
  to: string
  label: string
  type: 'choice' | 'nextScene' | 'broken'
  confidence?: number
  pattern?: string
  weight: number
}

export interface DeadEndReport {
  sceneId: string
  sceneName: string
  chapterTitle: string
  hasChoices: boolean
  hasNextScene: boolean
  isEndingScene: boolean
  recommendation: string
}

export interface LoopReport {
  path: string[]
  loopType: 'infinite' | 'choice-cycle' | 'narrative-cycle'
  severity: 'critical' | 'warning' | 'info'
  description: string
}

export interface ArcValidationReport {
  character: string
  scenes: string[]
  firstAppearance: string
  lastAppearance: string
  developmentPoints: number
  issues: string[]
  recommendations: string[]
}

export interface BirminghamPathMap {
  platforms: Map<string, string[]>
  connections: Map<string, string[]>
  coverage: {
    totalPlatforms: number
    connectedPlatforms: number
    birminghamScenes: number
    careerProgression: string[]
  }
}

/**
 * Visual story flow analysis and debugging system
 */
export class VisualStoryFlowAnalyzer {
  private context = getLuxStoryContext()
  private outputDir: string

  constructor(outputDir: string = path.join(process.cwd(), 'visual-output')) {
    this.outputDir = outputDir
    this.ensureOutputDir()
  }

  /**
   * Generate complete DOT file for story visualization
   */
  generateDotFile(story?: StoryData): string {
    const storyData = story || this.context.storyData
    if (!storyData) {
      throw new Error('No story data available for visualization')
    }

    console.log('🎨 Generating complete story flow DOT file...')

    const dotContent = this.buildDotContent(storyData, {
      includeChoiceLabels: true,
      includePatterns: true,
      includeBirminghamHighlights: true,
      includeCharacterInfo: true,
      clusterByChapter: true
    })

    const dotPath = path.join(this.outputDir, 'story-flow-complete.dot')
    fs.writeFileSync(dotPath, dotContent, 'utf-8')
    console.log(`📄 DOT file generated: ${dotPath}`)

    return dotContent
  }

  /**
   * Generate visual representation of story connections
   */
  async visualizeConnections(outputPath?: string): Promise<void> {
    const dotContent = this.generateDotFile()
    const finalOutputPath = outputPath || path.join(this.outputDir, 'story-flow.svg')

    // Check if Graphviz is available
    try {
      const { execSync } = require('child_process')
      const dotPath = path.join(this.outputDir, 'story-flow-complete.dot')

      console.log('🖼️ Generating visual representation...')
      execSync(`dot -Tsvg "${dotPath}" -o "${finalOutputPath}"`, { stdio: 'inherit' })
      console.log(`✅ Visual graph generated: ${finalOutputPath}`)
    } catch (error) {
      console.log('⚠️ Graphviz not available. DOT file generated but SVG creation skipped.')
      console.log('   Install Graphviz to enable visual generation: brew install graphviz')
    }
  }

  /**
   * Detect narrative dead ends
   */
  detectDeadEnds(story?: StoryData): DeadEndReport[] {
    const storyData = story || this.context.storyData
    if (!storyData) return []

    console.log('🔍 Detecting narrative dead ends...')

    const deadEnds: DeadEndReport[] = []

    for (const chapter of storyData.chapters) {
      if (!chapter.scenes) continue

      for (const scene of chapter.scenes) {
        const hasChoices = scene.choices && scene.choices.length > 0
        const hasNextScene = !!scene.nextScene
        const isEndingScene = scene.type === 'ending'

        if (!hasChoices && !hasNextScene && !isEndingScene) {
          let recommendation = 'Add a nextScene property or choices to continue the story'

          if (scene.type === 'narrative') {
            recommendation = 'Consider marking as ending scene or adding story continuation'
          } else if (scene.type === 'choice') {
            recommendation = 'Add choice options with nextScene properties'
          }

          deadEnds.push({
            sceneId: scene.id,
            sceneName: scene.text?.substring(0, 50) + '...' || 'No text',
            chapterTitle: chapter.title,
            hasChoices,
            hasNextScene,
            isEndingScene,
            recommendation
          })
        }
      }
    }

    console.log(`📊 Found ${deadEnds.length} potential dead ends`)
    return deadEnds
  }

  /**
   * Find narrative loops and cycles
   */
  findNarrativeLoops(story?: StoryData): LoopReport[] {
    const storyData = story || this.context.storyData
    if (!storyData) return []

    console.log('🔄 Analyzing narrative loops...')

    const visited = new Set<string>()
    const recursionStack = new Set<string>()
    const loops: LoopReport[] = []

    // Build adjacency list
    const connections = this.buildConnectionMap(storyData)

    // DFS to detect cycles
    const detectCycles = (sceneId: string, path: string[]) => {
      if (recursionStack.has(sceneId)) {
        // Found a cycle
        const cycleStart = path.indexOf(sceneId)
        const cyclePath = path.slice(cycleStart)

        loops.push({
          path: [...cyclePath, sceneId],
          loopType: this.categorizeLoop(cyclePath, connections),
          severity: cyclePath.length > 5 ? 'critical' : 'warning',
          description: `Cycle detected: ${cyclePath.join(' → ')} → ${sceneId}`
        })
        return
      }

      if (visited.has(sceneId)) return

      visited.add(sceneId)
      recursionStack.add(sceneId)

      const sceneConnections = connections.get(sceneId) || []
      for (const connection of sceneConnections) {
        detectCycles(connection.to, [...path, sceneId])
      }

      recursionStack.delete(sceneId)
    }

    // Start DFS from all unvisited scenes
    for (const chapter of storyData.chapters) {
      if (!chapter.scenes) continue
      for (const scene of chapter.scenes) {
        if (!visited.has(scene.id)) {
          detectCycles(scene.id, [])
        }
      }
    }

    console.log(`🔄 Found ${loops.length} narrative loops`)
    return loops
  }

  /**
   * Validate character arcs throughout the story
   */
  validateCharacterArcs(story?: StoryData): ArcValidationReport[] {
    const storyData = story || this.context.storyData
    if (!storyData) return []

    console.log('👥 Validating character arcs...')

    const characterMap = new Map<string, {
      scenes: string[]
      chapters: Set<string>
      relationships: string[]
      birminghamConnections: string[]
    }>()

    // Collect character appearances
    for (const chapter of storyData.chapters) {
      if (!chapter.scenes) continue

      for (const scene of chapter.scenes) {
        if (scene.speaker && scene.speaker !== 'Narrator') {
          const speakerName = scene.speaker.split('(')[0].trim()

          if (!characterMap.has(speakerName)) {
            characterMap.set(speakerName, {
              scenes: [],
              chapters: new Set(),
              relationships: [],
              birminghamConnections: []
            })
          }

          const charData = characterMap.get(speakerName)!
          charData.scenes.push(scene.id)
          charData.chapters.add(chapter.title)

          // Check for Birmingham connections
          if (this.context.configuration) {
            const birminghamRefs = this.context.getBirminghamReferences(scene)
            charData.birminghamConnections.push(...birminghamRefs)
          }
        }
      }
    }

    // Generate validation reports
    const reports: ArcValidationReport[] = []
    for (const [character, data] of characterMap) {
      const issues: string[] = []
      const recommendations: string[] = []

      // Check for single-scene characters
      if (data.scenes.length === 1) {
        issues.push('Character appears in only one scene')
        recommendations.push('Consider developing this character across multiple scenes for better impact')
      }

      // Check for chapter distribution
      if (data.chapters.size === 1 && storyData.chapters.length > 1) {
        issues.push('Character appears in only one chapter')
        recommendations.push('Consider having character appear in multiple chapters for story continuity')
      }

      // Check Birmingham connections for career relevance
      if (data.birminghamConnections.length === 0) {
        recommendations.push('Consider adding Birmingham career connections for local relevance')
      }

      reports.push({
        character,
        scenes: data.scenes,
        firstAppearance: data.scenes[0],
        lastAppearance: data.scenes[data.scenes.length - 1],
        developmentPoints: data.scenes.length,
        issues,
        recommendations
      })
    }

    console.log(`👥 Analyzed ${reports.length} character arcs`)
    return reports
  }

  /**
   * Show Birmingham career connection paths
   */
  showBirminghamConnections(story?: StoryData): BirminghamPathMap {
    const storyData = story || this.context.storyData
    if (!storyData) {
      return {
        platforms: new Map(),
        connections: new Map(),
        coverage: { totalPlatforms: 0, connectedPlatforms: 0, birminghamScenes: 0, careerProgression: [] }
      }
    }

    console.log('🏙️ Mapping Birmingham career connections...')

    const platforms = new Map<string, string[]>()
    const connections = new Map<string, string[]>()
    let birminghamScenes = 0
    const careerProgression: string[] = []

    // Identify platform scenes and Birmingham connections
    for (const chapter of storyData.chapters) {
      if (!chapter.scenes) continue

      for (const scene of chapter.scenes) {
        const lowerText = scene.text?.toLowerCase() || ''

        // Check for Birmingham references
        if (this.context.configuration) {
          const birminghamRefs = this.context.getBirminghamReferences(scene)
          if (birminghamRefs.length > 0) {
            birminghamScenes++
          }
        }

        // Identify career platforms
        if (lowerText.includes('platform')) {
          if (lowerText.includes('care') || lowerText.includes('healthcare')) {
            this.addToPlatform(platforms, 'healthcare', scene.id)
          }
          if (lowerText.includes('data') || lowerText.includes('tech')) {
            this.addToPlatform(platforms, 'technology', scene.id)
          }
          if (lowerText.includes('build') || lowerText.includes('engineer')) {
            this.addToPlatform(platforms, 'engineering', scene.id)
          }
          if (lowerText.includes('grow') || lowerText.includes('environment')) {
            this.addToPlatform(platforms, 'sustainability', scene.id)
          }
        }

        // Track career progression
        if (lowerText.includes('uab') || lowerText.includes('program') || lowerText.includes('training')) {
          careerProgression.push(scene.id)
        }
      }
    }

    return {
      platforms,
      connections,
      coverage: {
        totalPlatforms: platforms.size,
        connectedPlatforms: platforms.size, // All identified platforms are connected by definition
        birminghamScenes,
        careerProgression
      }
    }
  }

  /**
   * Highlight specific path between scenes
   */
  highlightPath(fromScene: string, toScene: string, story?: StoryData): string {
    const storyData = story || this.context.storyData
    if (!storyData) return ''

    console.log(`🎯 Finding path from ${fromScene} to ${toScene}...`)

    const path = this.findShortestPath(fromScene, toScene, storyData)
    if (!path) {
      console.log('❌ No path found between scenes')
      return ''
    }

    console.log(`✅ Path found: ${path.join(' → ')}`)

    // Generate DOT with highlighted path
    const dotContent = this.buildDotContent(storyData, {
      highlightPath: path,
      includeChoiceLabels: true,
      includePatterns: false,
      includeBirminghamHighlights: false,
      includeCharacterInfo: false,
      clusterByChapter: false
    })

    const dotPath = path.join(this.outputDir, `path-${fromScene}-to-${toScene}.dot`)
    fs.writeFileSync(dotPath, dotContent, 'utf-8')
    console.log(`📄 Path highlight DOT generated: ${dotPath}`)

    return dotContent
  }

  /**
   * Filter story by pattern type
   */
  filterByPattern(pattern: string, story?: StoryData): StorySubgraph {
    const storyData = story || this.context.storyData
    if (!storyData) {
      return {
        nodes: new Map(),
        edges: new Map(),
        metadata: { title: 'Empty', filter: pattern, nodeCount: 0, edgeCount: 0 }
      }
    }

    console.log(`🔍 Filtering story by pattern: ${pattern}`)

    const nodes = new Map<string, Scene>()
    const edges = new Map<string, FlowEdge[]>()

    for (const chapter of storyData.chapters) {
      if (!chapter.scenes) continue

      for (const scene of chapter.scenes) {
        if (scene.choices) {
          const hasPatternChoice = scene.choices.some(choice => choice.pattern === pattern)
          if (hasPatternChoice) {
            nodes.set(scene.id, scene)

            const sceneEdges: FlowEdge[] = []
            for (const choice of scene.choices) {
              if (choice.pattern === pattern && choice.nextScene) {
                sceneEdges.push({
                  from: scene.id,
                  to: choice.nextScene,
                  label: choice.text.substring(0, 30) + '...',
                  type: 'choice',
                  pattern: choice.pattern,
                  weight: 2
                })
              }
            }
            edges.set(scene.id, sceneEdges)
          }
        }
      }
    }

    const edgeCount = Array.from(edges.values()).reduce((sum, edgeList) => sum + edgeList.length, 0)

    return {
      nodes,
      edges,
      metadata: {
        title: `Pattern: ${pattern}`,
        filter: pattern,
        nodeCount: nodes.size,
        edgeCount
      }
    }
  }

  // Private helper methods

  private ensureOutputDir(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true })
      console.log(`📁 Created output directory: ${this.outputDir}`)
    }
  }

  private buildDotContent(story: StoryData, options: {
    includeChoiceLabels?: boolean
    includePatterns?: boolean
    includeBirminghamHighlights?: boolean
    includeCharacterInfo?: boolean
    clusterByChapter?: boolean
    highlightPath?: string[]
  }): string {
    const {
      includeChoiceLabels = true,
      includePatterns = false,
      includeBirminghamHighlights = true,
      includeCharacterInfo = false,
      clusterByChapter = false,
      highlightPath = []
    } = options

    let dot = 'digraph StoryFlow {\n'
    dot += '  rankdir=LR;\n'
    dot += '  node [shape=box, style=filled, fillcolor=lightblue];\n'
    dot += '  edge [color=gray];\n\n'

    // Add title
    dot += `  labelloc="t";\n`
    dot += `  label="${story.title} - Flow Analysis";\n\n`

    const highlightSet = new Set(highlightPath)

    for (let chapterIndex = 0; chapterIndex < story.chapters.length; chapterIndex++) {
      const chapter = story.chapters[chapterIndex]
      if (!chapter.scenes) continue

      if (clusterByChapter) {
        dot += `  subgraph cluster_${chapterIndex} {\n`
        dot += `    label="${chapter.title}";\n`
        dot += `    style=filled;\n`
        dot += `    fillcolor=lightgray;\n\n`
      }

      for (const scene of chapter.scenes) {
        // Node styling based on properties
        let nodeColor = 'lightblue'
        let nodeStyle = 'filled'

        // Essential scenes in blue
        if (this.context.isEssentialScene(scene.id)) {
          nodeColor = 'lightsteelblue'
        }

        // Career-relevant scenes in green
        if (this.isCareerRelevant(scene)) {
          nodeColor = 'lightgreen'
        }

        // Birmingham scenes in gold
        if (includeBirminghamHighlights && this.context.getBirminghamReferences(scene).length > 0) {
          nodeColor = 'gold'
        }

        // Highlighted path in red
        if (highlightSet.has(scene.id)) {
          nodeColor = 'lightcoral'
          nodeStyle = 'filled,bold'
        }

        // Character scenes with special shape
        const shape = scene.speaker && scene.speaker !== 'Narrator' ? 'ellipse' : 'box'

        dot += `    "${scene.id}" [fillcolor=${nodeColor}, style="${nodeStyle}", shape=${shape}`

        // Add character info if requested
        if (includeCharacterInfo && scene.speaker && scene.speaker !== 'Narrator') {
          const speaker = scene.speaker.split('(')[0].trim()
          dot += `, xlabel="${speaker}"`
        }

        dot += `];\n`

        // Add connections
        if (scene.nextScene) {
          const edgeColor = highlightSet.has(scene.id) && highlightSet.has(scene.nextScene) ? 'red' : 'gray'
          dot += `    "${scene.id}" -> "${scene.nextScene}" [color=${edgeColor}];\n`
        }

        if (scene.choices) {
          for (const choice of scene.choices) {
            if (choice.nextScene) {
              let edgeLabel = ''
              let edgeColor = 'gray'
              let edgeStyle = ''

              if (includeChoiceLabels) {
                edgeLabel = choice.text.substring(0, 20).replace(/"/g, '\\"')
                if (edgeLabel.length < choice.text.length) edgeLabel += '...'
              }

              if (includePatterns && choice.pattern) {
                edgeLabel += ` [${choice.pattern}]`

                // Color by pattern
                switch (choice.pattern) {
                  case 'analytical': edgeColor = 'blue'; break
                  case 'helping': edgeColor = 'green'; break
                  case 'building': edgeColor = 'orange'; break
                  case 'patience': edgeColor = 'purple'; break
                  default: edgeColor = 'gray'
                }
              }

              if (highlightSet.has(scene.id) && highlightSet.has(choice.nextScene)) {
                edgeColor = 'red'
                edgeStyle = ', style=bold'
              }

              dot += `    "${scene.id}" -> "${choice.nextScene}" [label="${edgeLabel}", color=${edgeColor}${edgeStyle}];\n`
            }
          }
        }
      }

      if (clusterByChapter) {
        dot += '  }\n\n'
      }
    }

    // Add legend
    if (includeBirminghamHighlights || includePatterns) {
      dot += '  subgraph cluster_legend {\n'
      dot += '    label="Legend";\n'
      dot += '    style=filled;\n'
      dot += '    fillcolor=white;\n'

      if (includeBirminghamHighlights) {
        dot += '    legend_essential [label="Essential Scene", fillcolor=lightsteelblue, style=filled];\n'
        dot += '    legend_career [label="Career Scene", fillcolor=lightgreen, style=filled];\n'
        dot += '    legend_birmingham [label="Birmingham Scene", fillcolor=gold, style=filled];\n'
      }

      dot += '  }\n\n'
    }

    dot += '}\n'
    return dot
  }

  private buildConnectionMap(story: StoryData): Map<string, FlowEdge[]> {
    const connections = new Map<string, FlowEdge[]>()

    for (const chapter of story.chapters) {
      if (!chapter.scenes) continue

      for (const scene of chapter.scenes) {
        const edges: FlowEdge[] = []

        if (scene.nextScene) {
          edges.push({
            from: scene.id,
            to: scene.nextScene,
            label: '',
            type: 'nextScene',
            weight: 1
          })
        }

        if (scene.choices) {
          for (const choice of scene.choices) {
            if (choice.nextScene) {
              edges.push({
                from: scene.id,
                to: choice.nextScene,
                label: choice.text,
                type: 'choice',
                pattern: choice.pattern,
                weight: 1
              })
            }
          }
        }

        connections.set(scene.id, edges)
      }
    }

    return connections
  }

  private categorizeLoop(path: string[], connections: Map<string, FlowEdge[]>): 'infinite' | 'choice-cycle' | 'narrative-cycle' {
    if (path.length === 2) return 'infinite'

    // Check if loop involves choices
    for (const sceneId of path) {
      const sceneConnections = connections.get(sceneId) || []
      if (sceneConnections.some(edge => edge.type === 'choice')) {
        return 'choice-cycle'
      }
    }

    return 'narrative-cycle'
  }

  private findShortestPath(fromScene: string, toScene: string, story: StoryData): string[] | null {
    const connections = this.buildConnectionMap(story)
    const queue: { scene: string; path: string[] }[] = [{ scene: fromScene, path: [fromScene] }]
    const visited = new Set<string>()

    while (queue.length > 0) {
      const { scene, path } = queue.shift()!

      if (scene === toScene) {
        return path
      }

      if (visited.has(scene)) continue
      visited.add(scene)

      const sceneConnections = connections.get(scene) || []
      for (const edge of sceneConnections) {
        if (!visited.has(edge.to)) {
          queue.push({ scene: edge.to, path: [...path, edge.to] })
        }
      }
    }

    return null
  }

  private isCareerRelevant(scene: Scene): boolean {
    if (!this.context.configuration) return false

    const careerKeywords = [
      ...this.context.configuration.streamlining.careerKeywords.general,
      ...this.context.configuration.streamlining.careerKeywords.birmingham
    ]

    const text = scene.text?.toLowerCase() || ''
    return careerKeywords.some(keyword => text.includes(keyword.toLowerCase()))
  }

  private addToPlatform(platforms: Map<string, string[]>, platform: string, sceneId: string): void {
    if (!platforms.has(platform)) {
      platforms.set(platform, [])
    }
    platforms.get(platform)!.push(sceneId)
  }
}

// Export convenience function
export const createVisualAnalyzer = (outputDir?: string) => new VisualStoryFlowAnalyzer(outputDir)