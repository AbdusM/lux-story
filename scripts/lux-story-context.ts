// @ts-expect-error - Legacy import from removed hooks
/**
 * LuxStoryContext - Centralized Context System
 *
 * Single source of truth for all story data, configuration, and state
 * Used by all content management scripts to ensure consistency
 */

import fs from 'fs'
import path from 'path'
// import { CharacterRelationships, PlayerPatterns, BirminghamKnowledge } from '../hooks/useSimpleGame'

// Core data structure interfaces
export interface StoryData {
  title: string
  author: string
  version: string
  chapters: Chapter[]
}

export interface Chapter {
  id: number | string
  title: string
  scenes: Scene[]
}

export interface Scene {
  id: string
  type: string
  text: string
  speaker?: string
  nextScene?: string
  choices?: Choice[]
  stateChanges?: Record<string, any>
}

export interface Choice {
  text: string
  consequence?: string
  nextScene?: string
  pattern?: string
  stateChanges?: Record<string, any>
}

export interface SceneConnection {
  fromScene: string
  toScene: string
  choiceText: string
  confidence: number
  validated: boolean
}

export interface CharacterProfile {
  id: string
  name: string
  description: string
  relationships: CharacterRelationships[keyof CharacterRelationships]
  scenes: string[]
  birminghamConnections: string[]
}

export interface BirminghamCareerData {
  employers: {
    healthcare: { name: string; opportunities: string[]; website: string }[]
    technology: { name: string; opportunities: string[]; website: string }[]
    finance: { name: string; opportunities: string[]; website: string }[]
    manufacturing: { name: string; opportunities: string[]; website: string }[]
    education: { name: string; opportunities: string[]; website: string }[]
  }
  programs: {
    uab: { name: string; type: string; duration: string; link: string }[]
    communityCollege: { name: string; type: string; duration: string }[]
    workforce: { name: string; type: string; provider: string }[]
  }
  salaryData: {
    [industry: string]: {
      entry: number
      experienced: number
      senior: number
      lastUpdated: Date
    }
  }
  validation: {
    lastUpdated: Date
    sources: string[]
    verificationLevel: 'high' | 'medium' | 'low'
  }
}

export interface GlobalConfig {
  streamlining: {
    careerKeywords: {
      general: string[]
      birmingham: string[]
      weights: Record<string, number>
    }
    thresholds: {
      careerRelevance: number
      mysticalContent: number
      minimumScenes: number
    }
    essentialScenes: {
      autoDetect: boolean
      manualList: string[]
    }
  }
  connectionRepair: {
    autoApproveThreshold: number
    humanReviewThreshold: number
    rejectThreshold: number
    maxAlternatives: number
  }
  validation: {
    enableSchemaValidation: boolean
    enableNarrativeValidation: boolean
    enableBirminghamValidation: boolean
  }
  safety: {
    enableBackups: boolean
    maxBackupFiles: number
    dryRunByDefault: boolean
  }
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  summary: {
    totalScenes: number
    essentialScenesFound: number
    brokenConnections: number
    birminghamReferences: number
  }
}

export interface SceneConnectionGraph {
  nodes: Map<string, Scene>
  edges: Map<string, SceneConnection[]>
  deadEnds: string[]
  unreachableScenes: string[]
  characterArcs: Map<string, string[]>
}

/**
 * Centralized context system for Lux Story content management
 * Implements singleton pattern to ensure single source of truth
 */
export class LuxStoryContext {
  private static instance: LuxStoryContext | null = null
  private initialized = false

  // Core data
  public storyData: StoryData | null = null
  public characterProfiles: CharacterProfile[] = []
  public birminghamData: BirminghamCareerData | null = null
  public sceneGraph: SceneConnectionGraph | null = null
  public configuration: GlobalConfig | null = null

  // File paths
  private readonly paths = {
    storyData: path.join(process.cwd(), 'data', 'grand-central-story.json'),
    storyBackup: path.join(process.cwd(), 'data', 'grand-central-story-full-backup.json'),
    streamlined: path.join(process.cwd(), 'data', 'grand-central-story-streamlined.json'),
    birminghamData: path.join(process.cwd(), 'data', 'birmingham-career-data.json'),
    config: path.join(process.cwd(), 'scripts', 'lux-story-config.json'),
    backupDir: path.join(process.cwd(), 'backups')
  }

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get singleton instance of LuxStoryContext
   */
  static getInstance(): LuxStoryContext {
    if (!LuxStoryContext.instance) {
      LuxStoryContext.instance = new LuxStoryContext()
    }
    return LuxStoryContext.instance
  }

  /**
   * Initialize the context with all required data
   */
  async initialize(configPath?: string): Promise<void> {
    console.log('🚀 Initializing LuxStoryContext...')

    try {
      // Load configuration first
      await this.loadConfiguration(configPath)

      // Load story data
      await this.loadStoryData()

      // Load Birmingham data
      await this.loadBirminghamData()

      // Build scene connection graph
      await this.buildSceneGraph()

      // Extract character profiles
      await this.extractCharacterProfiles()

      this.initialized = true
      console.log('✅ LuxStoryContext initialized successfully')

    } catch (error: any) {
      console.error('❌ Failed to initialize LuxStoryContext:', error.message)
      throw error
    }
  }

  /**
   * Reload all data from files
   */
  async reload(): Promise<void> {
    console.log('🔄 Reloading LuxStoryContext...')
    this.initialized = false
    await this.initialize()
  }

  /**
   * Validate all loaded data
   */
  validate(): ValidationResult {
    if (!this.initialized) {
      throw new Error('Context not initialized. Call initialize() first.')
    }

    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      summary: {
        totalScenes: 0,
        essentialScenesFound: 0,
        brokenConnections: 0,
        birminghamReferences: 0
      }
    }

    // Validate story data
    if (!this.storyData) {
      result.errors.push('Story data not loaded')
      result.valid = false
    } else {
      this.validateStoryStructure(result)
      this.validateSceneConnections(result)
      this.validateBirminghamReferences(result)
    }

    // Validate configuration
    if (!this.configuration) {
      result.errors.push('Configuration not loaded')
      result.valid = false
    }

    return result
  }

  /**
   * Get scene by ID with validation
   */
  getScene(sceneId: string): Scene | null {
    if (!this.storyData) return null

    for (const chapter of this.storyData.chapters) {
      const scene = chapter.scenes.find(s => s.id === sceneId)
      if (scene) return scene
    }
    return null
  }

  /**
   * Get all scenes in the story
   */
  getAllScenes(): Scene[] {
    if (!this.storyData) return []

    return this.storyData.chapters.flatMap(chapter => chapter.scenes)
  }

  /**
   * Get scenes by character
   */
  getScenesByCharacter(characterName: string): Scene[] {
    const profile = this.characterProfiles.find(p =>
      p.name.toLowerCase().includes(characterName.toLowerCase())
    )

    if (!profile) return []

    return profile.scenes.map(sceneId => this.getScene(sceneId)).filter(Boolean) as Scene[]
  }

  /**
   * Check if scene is essential based on configuration
   */
  isEssentialScene(sceneId: string): boolean {
    if (!this.configuration) return false

    return this.configuration.streamlining.essentialScenes.manualList.includes(sceneId)
  }

  /**
   * Get Birmingham references in a scene
   */
  getBirminghamReferences(scene: Scene): string[] {
    if (!this.configuration) return []

    const birminghamKeywords = this.configuration.streamlining.careerKeywords.birmingham
    const text = scene.text.toLowerCase()

    return birminghamKeywords.filter(keyword => text.includes(keyword.toLowerCase()))
  }

  // Private methods for data loading and processing

  private async loadConfiguration(configPath?: string): Promise<void> {
    const path = configPath || this.paths.config

    if (fs.existsSync(path)) {
      const configData = JSON.parse(fs.readFileSync(path, 'utf-8'))
      this.configuration = configData
    } else {
      // Create default configuration
      this.configuration = this.createDefaultConfiguration()
      fs.writeFileSync(this.paths.config, JSON.stringify(this.configuration, null, 2))
      console.log('📝 Created default configuration file')
    }
  }

  private async loadStoryData(): Promise<void> {
    if (!fs.existsSync(this.paths.storyData)) {
      throw new Error(`Story data file not found: ${this.paths.storyData}`)
    }

    const storyJson = fs.readFileSync(this.paths.storyData, 'utf-8')
    this.storyData = JSON.parse(storyJson)
  }

  private async loadBirminghamData(): Promise<void> {
    if (fs.existsSync(this.paths.birminghamData)) {
      const birminghamJson = fs.readFileSync(this.paths.birminghamData, 'utf-8')
      this.birminghamData = JSON.parse(birminghamJson)
    } else {
      // Create default Birmingham data
      this.birminghamData = this.createDefaultBirminghamData()
      fs.writeFileSync(this.paths.birminghamData, JSON.stringify(this.birminghamData, null, 2))
      console.log('📝 Created default Birmingham data file')
    }
  }

  private async buildSceneGraph(): Promise<void> {
    if (!this.storyData) throw new Error('Story data not loaded')

    const nodes = new Map<string, Scene>()
    const edges = new Map<string, SceneConnection[]>()

    // Build nodes
    for (const chapter of this.storyData.chapters) {
      for (const scene of chapter.scenes) {
        nodes.set(scene.id, scene)
      }
    }

    // Build edges
    for (const [sceneId, scene] of nodes) {
      const connections: SceneConnection[] = []

      if (scene.choices) {
        for (const choice of scene.choices) {
          if (choice.nextScene) {
            connections.push({
              fromScene: sceneId,
              toScene: choice.nextScene,
              choiceText: choice.text,
              confidence: 1.0, // Will be calculated by connection repair system
              validated: nodes.has(choice.nextScene)
            })
          }
        }
      }

      if (scene.nextScene) {
        connections.push({
          fromScene: sceneId,
          toScene: scene.nextScene,
          choiceText: '',
          confidence: 1.0,
          validated: nodes.has(scene.nextScene)
        })
      }

      edges.set(sceneId, connections)
    }

    // Find dead ends and unreachable scenes
    const deadEnds = this.findDeadEnds(nodes, edges)
    const unreachableScenes = this.findUnreachableScenes(nodes, edges)

    this.sceneGraph = {
      nodes,
      edges,
      deadEnds,
      unreachableScenes,
      characterArcs: new Map()
    }
  }

  private async extractCharacterProfiles(): Promise<void> {
    if (!this.storyData) return

    const characters = new Map<string, CharacterProfile>()

    for (const chapter of this.storyData.chapters) {
      for (const scene of chapter.scenes) {
        if (scene.speaker && scene.speaker !== 'Narrator') {
          const speakerName = scene.speaker.split('(')[0].trim()

          if (!characters.has(speakerName)) {
            characters.set(speakerName, {
              id: speakerName.toLowerCase().replace(/\s+/g, '-'),
              name: speakerName,
              description: scene.speaker,
              relationships: {} as any,
              scenes: [],
              birminghamConnections: []
            })
          }

          const profile = characters.get(speakerName)!
          profile.scenes.push(scene.id)

          // Extract Birmingham connections
          const birminghamRefs = this.getBirminghamReferences(scene)
          profile.birminghamConnections.push(...birminghamRefs)
        }
      }
    }

    this.characterProfiles = Array.from(characters.values())
  }

  private validateStoryStructure(result: ValidationResult): void {
    if (!this.storyData) return

    let totalScenes = 0
    let essentialScenesFound = 0

    for (const chapter of this.storyData.chapters) {
      totalScenes += chapter.scenes.length

      for (const scene of chapter.scenes) {
        if (this.isEssentialScene(scene.id)) {
          essentialScenesFound++
        }

        if (!scene.id) {
          result.errors.push(`Scene missing ID in chapter ${chapter.id}`)
        }

        if (!scene.text) {
          result.warnings.push(`Scene ${scene.id} has empty text`)
        }
      }
    }

    result.summary.totalScenes = totalScenes
    result.summary.essentialScenesFound = essentialScenesFound
  }

  private validateSceneConnections(result: ValidationResult): void {
    if (!this.sceneGraph) return

    let brokenConnections = 0

    for (const [sceneId, connections] of this.sceneGraph.edges) {
      for (const connection of connections) {
        if (!connection.validated) {
          brokenConnections++
          result.warnings.push(`Broken connection: ${sceneId} -> ${connection.toScene}`)
        }
      }
    }

    result.summary.brokenConnections = brokenConnections
  }

  private validateBirminghamReferences(result: ValidationResult): void {
    if (!this.storyData || !this.configuration) return

    let birminghamReferences = 0

    for (const chapter of this.storyData.chapters) {
      for (const scene of chapter.scenes) {
        const refs = this.getBirminghamReferences(scene)
        birminghamReferences += refs.length
      }
    }

    result.summary.birminghamReferences = birminghamReferences
  }

  private findDeadEnds(nodes: Map<string, Scene>, edges: Map<string, SceneConnection[]>): string[] {
    const deadEnds: string[] = []

    for (const [sceneId, connections] of edges) {
      if (connections.length === 0) {
        deadEnds.push(sceneId)
      }
    }

    return deadEnds
  }

  private findUnreachableScenes(nodes: Map<string, Scene>, edges: Map<string, SceneConnection[]>): string[] {
    const reachable = new Set<string>()
    const visited = new Set<string>()

    // Start from first scene (assuming it's always reachable)
    const firstScene = Array.from(nodes.keys())[0]
    if (firstScene) {
      this.dfsTraversal(firstScene, edges, reachable, visited)
    }

    const unreachable: string[] = []
    for (const sceneId of nodes.keys()) {
      if (!reachable.has(sceneId)) {
        unreachable.push(sceneId)
      }
    }

    return unreachable
  }

  private dfsTraversal(sceneId: string, edges: Map<string, SceneConnection[]>, reachable: Set<string>, visited: Set<string>): void {
    if (visited.has(sceneId)) return

    visited.add(sceneId)
    reachable.add(sceneId)

    const connections = edges.get(sceneId) || []
    for (const connection of connections) {
      this.dfsTraversal(connection.toScene, edges, reachable, visited)
    }
  }

  private createDefaultConfiguration(): GlobalConfig {
    return {
      streamlining: {
        careerKeywords: {
          general: [
            'career', 'job', 'work', 'skill', 'salary', 'wage', 'training', 'program',
            'interview', 'hire', 'application', 'opportunity', 'future', 'path',
            'diploma', 'certificate', 'education', 'learning'
          ],
          birmingham: [
            'Birmingham', 'UAB', 'Innovation Depot', 'Regions Bank', 'Alabama',
            'Magic City', 'Vulcan', 'Railroad Park', 'Civil Rights District'
          ],
          weights: {
            'Birmingham': 2.0,
            'UAB': 2.0,
            'Innovation Depot': 1.5,
            'career': 1.0,
            'job': 1.0
          }
        },
        thresholds: {
          careerRelevance: 0.3,
          mysticalContent: 2,
          minimumScenes: 20
        },
        essentialScenes: {
          autoDetect: false,
          manualList: [
            '1-1', '1-2', '1-3b', '1-8', '2-1', '2-3a2', '2-5', '2-8', '2-12',
            '3-1', '3-2a', '3-2b', '3-2c', '3-2d', '3-5', '3-8', '3-11', '3-17', '3-20'
          ]
        }
      },
      connectionRepair: {
        autoApproveThreshold: 0.9,
        humanReviewThreshold: 0.7,
        rejectThreshold: 0.5,
        maxAlternatives: 3
      },
      validation: {
        enableSchemaValidation: true,
        enableNarrativeValidation: true,
        enableBirminghamValidation: true
      },
      safety: {
        enableBackups: true,
        maxBackupFiles: 10,
        dryRunByDefault: true
      }
    }
  }

  private createDefaultBirminghamData(): BirminghamCareerData {
    return {
      employers: {
        healthcare: [
          { name: 'UAB Medicine', opportunities: ['Nursing', 'Medical Technology', 'Healthcare Administration'], website: 'https://www.uabmedicine.org' },
          { name: "Children's of Alabama", opportunities: ['Pediatric Care', 'Child Life Services', 'Medical Research'], website: 'https://www.childrensal.org' }
        ],
        technology: [
          { name: 'Innovation Depot', opportunities: ['Software Development', 'Startup Incubation', 'Tech Entrepreneurship'], website: 'https://innovationdepot.org' },
          { name: 'Shipt', opportunities: ['Software Engineering', 'Data Science', 'Product Management'], website: 'https://www.shipt.com' }
        ],
        finance: [
          { name: 'Regions Bank', opportunities: ['Banking', 'Financial Analysis', 'Customer Service'], website: 'https://www.regions.com' },
          { name: 'BBVA USA', opportunities: ['Commercial Banking', 'Investment Services', 'Risk Management'], website: 'https://www.bbva.com' }
        ],
        manufacturing: [
          { name: 'Mercedes-Benz US International', opportunities: ['Manufacturing Engineering', 'Quality Control', 'Logistics'], website: 'https://www.mbusi.com' },
          { name: 'Alabama Power', opportunities: ['Electrical Engineering', 'Environmental Services', 'Energy Management'], website: 'https://www.alabamapower.com' }
        ],
        education: [
          { name: 'University of Alabama at Birmingham', opportunities: ['Research', 'Education', 'Administration'], website: 'https://www.uab.edu' },
          { name: 'Jefferson County Schools', opportunities: ['Teaching', 'Educational Support', 'Administration'], website: 'https://www.jefcoed.com' }
        ]
      },
      programs: {
        uab: [
          { name: 'Biomedical Engineering', type: 'degree', duration: '4 years', link: 'https://www.uab.edu/engineering/bme/' },
          { name: 'Computer Science', type: 'degree', duration: '4 years', link: 'https://www.uab.edu/cas/computerscience/' }
        ],
        communityCollege: [
          { name: 'Jefferson State Community College - Healthcare Programs', type: 'certificate', duration: '6-24 months' },
          { name: 'Lawson State Community College - Technical Programs', type: 'associate', duration: '2 years' }
        ],
        workforce: [
          { name: 'Alabama Career Center - Job Training', type: 'skills training', provider: 'Alabama Department of Labor' },
          { name: 'TechHire Birmingham - Coding Bootcamp', type: 'intensive training', provider: 'Innovation Depot' }
        ]
      },
      salaryData: {
        healthcare: { entry: 35000, experienced: 55000, senior: 75000, lastUpdated: new Date() },
        technology: { entry: 45000, experienced: 70000, senior: 95000, lastUpdated: new Date() },
        finance: { entry: 40000, experienced: 60000, senior: 85000, lastUpdated: new Date() },
        manufacturing: { entry: 35000, experienced: 55000, senior: 75000, lastUpdated: new Date() },
        education: { entry: 30000, experienced: 45000, senior: 65000, lastUpdated: new Date() }
      },
      validation: {
        lastUpdated: new Date(),
        sources: ['Alabama Department of Labor', 'UAB Career Services', 'Birmingham Business Journal'],
        verificationLevel: 'medium'
      }
    }
  }
}

// Export singleton instance getter for convenience
export const getLuxStoryContext = () => LuxStoryContext.getInstance()