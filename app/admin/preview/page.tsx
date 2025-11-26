'use client'

/**
 * Dialogue Preview Mode
 *
 * Admin tool for previewing any dialogue node in isolation.
 * Useful for:
 * - Testing new content before integration
 * - Debugging display issues
 * - Reviewing node content without playing through
 * - Validating choice visibility at different trust levels
 *
 * Access: /admin/preview?graph=maya&node=maya_introduction&trust=5
 */

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DialogueDisplay } from '@/components/DialogueDisplay'
import { StateConditionEvaluator, DialogueNode } from '@/lib/dialogue-graph'
import { GameStateUtils, type GameState as _GameState } from '@/lib/character-state'

// Import all dialogue graphs
import { samuelDialogueNodes } from '@/content/samuel-dialogue-graph'
import { mayaDialogueNodes } from '@/content/maya-dialogue-graph'
import { devonDialogueNodes } from '@/content/devon-dialogue-graph'
import { jordanDialogueNodes } from '@/content/jordan-dialogue-graph'
import { kaiDialogueNodes } from '@/content/kai-dialogue-graph'
import { silasDialogueNodes } from '@/content/silas-dialogue-graph'
import { marcusDialogueNodes } from '@/content/marcus-dialogue-graph'
import { tessDialogueNodes } from '@/content/tess-dialogue-graph'
import { rohanDialogueNodes } from '@/content/rohan-dialogue-graph'
import { yaquinDialogueNodes } from '@/content/yaquin-dialogue-graph'
import { mayaRevisitNodes } from '@/content/maya-revisit-graph'
import { yaquinRevisitNodes } from '@/content/yaquin-revisit-graph'

// Graph registry
const GRAPHS: Record<string, DialogueNode[]> = {
  samuel: samuelDialogueNodes,
  maya: mayaDialogueNodes,
  'maya-revisit': mayaRevisitNodes,
  devon: devonDialogueNodes,
  jordan: jordanDialogueNodes,
  kai: kaiDialogueNodes,
  silas: silasDialogueNodes,
  marcus: marcusDialogueNodes,
  tess: tessDialogueNodes,
  rohan: rohanDialogueNodes,
  yaquin: yaquinDialogueNodes,
  'yaquin-revisit': yaquinRevisitNodes,
}

function DialoguePreviewContent() {
  const searchParams = useSearchParams()

  // URL params
  const initialGraph = searchParams.get('graph') || 'samuel'
  const initialNode = searchParams.get('node') || ''
  const initialTrust = parseInt(searchParams.get('trust') || '0', 10)

  // State
  const [selectedGraph, setSelectedGraph] = useState(initialGraph)
  const [selectedNodeId, setSelectedNodeId] = useState(initialNode)
  const [trustLevel, setTrustLevel] = useState(initialTrust)
  const [searchQuery, setSearchQuery] = useState('')

  // Build node map for selected graph
  const nodeMap = useMemo(() => {
    const nodes = GRAPHS[selectedGraph] || []
    const map = new Map<string, DialogueNode>()
    for (const node of nodes) {
      map.set(node.nodeId, node)
    }
    return map
  }, [selectedGraph])

  // Filter nodes by search
  const filteredNodes = useMemo(() => {
    const nodes = Array.from(nodeMap.values())
    if (!searchQuery) return nodes

    const query = searchQuery.toLowerCase()
    return nodes.filter(
      n =>
        n.nodeId.toLowerCase().includes(query) ||
        n.speaker.toLowerCase().includes(query) ||
        n.content.some(c => c.text.toLowerCase().includes(query))
    )
  }, [nodeMap, searchQuery])

  // Get selected node
  const selectedNode = nodeMap.get(selectedNodeId)

  // Build mock game state for condition evaluation
  const mockGameState = useMemo(() => {
    const state = GameStateUtils.createNewGameState('preview-user')

    // Add all characters with specified trust
    const characters = ['samuel', 'maya', 'devon', 'jordan', 'kai', 'silas', 'marcus', 'tess', 'rohan', 'yaquin']
    for (const charId of characters) {
      const charState = GameStateUtils.createCharacterState(charId)
      charState.trust = trustLevel
      if (trustLevel >= 8) {
        charState.relationshipStatus = 'confidant'
      } else if (trustLevel >= 4) {
        charState.relationshipStatus = 'acquaintance'
      }
      state.characters.set(charId, charState)
    }

    return state
  }, [trustLevel])

  // Evaluate choices for selected node
  const evaluatedChoices = useMemo(() => {
    if (!selectedNode) return []

    const characterId = selectedGraph.replace('-revisit', '')
    return StateConditionEvaluator.evaluateChoices(selectedNode, mockGameState, characterId)
  }, [selectedNode, mockGameState, selectedGraph])

  // Auto-select first node if none selected
  useEffect(() => {
    if (!selectedNodeId && filteredNodes.length > 0) {
      setSelectedNodeId(filteredNodes[0].nodeId)
    }
  }, [selectedNodeId, filteredNodes])

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Dialogue Preview Mode</h1>

        {/* Controls */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Graph selector */}
              <div>
                <label className="text-sm font-medium">Graph</label>
                <select
                  className="w-full p-2 border rounded mt-1"
                  value={selectedGraph}
                  onChange={e => {
                    setSelectedGraph(e.target.value)
                    setSelectedNodeId('')
                  }}
                >
                  {Object.keys(GRAPHS).map(g => (
                    <option key={g} value={g}>
                      {g} ({GRAPHS[g].length} nodes)
                    </option>
                  ))}
                </select>
              </div>

              {/* Trust slider */}
              <div>
                <label className="text-sm font-medium">Trust Level: {trustLevel}</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={trustLevel}
                  onChange={e => setTrustLevel(parseInt(e.target.value, 10))}
                  className="w-full mt-1"
                />
              </div>

              {/* Search */}
              <div>
                <label className="text-sm font-medium">Search Nodes</label>
                <Input
                  placeholder="Search by ID, speaker, or text..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Quick actions */}
              <div className="flex items-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const url = new URL(window.location.href)
                    url.searchParams.set('graph', selectedGraph)
                    url.searchParams.set('node', selectedNodeId)
                    url.searchParams.set('trust', trustLevel.toString())
                    navigator.clipboard.writeText(url.toString())
                  }}
                >
                  Copy URL
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Node List */}
          <Card className="lg:col-span-1 max-h-[600px] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-lg">
                Nodes ({filteredNodes.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredNodes.map(node => (
                  <button
                    key={node.nodeId}
                    className={`w-full text-left p-3 hover:bg-slate-100 transition ${
                      selectedNodeId === node.nodeId ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedNodeId(node.nodeId)}
                  >
                    <div className="font-mono text-sm text-slate-600 truncate">
                      {node.nodeId}
                    </div>
                    <div className="text-xs text-slate-400">
                      {node.speaker} • {node.choices.length} choices
                      {node.requiredState?.trust?.min && (
                        <span className="ml-1 text-amber-600">
                          (Trust ≥{node.requiredState.trust.min})
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedNode ? selectedNode.nodeId : 'Select a node'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedNode ? (
                <div className="space-y-4">
                  {/* Metadata */}
                  <div className="bg-slate-100 p-3 rounded text-sm">
                    <div>
                      <strong>Speaker:</strong> {selectedNode.speaker}
                    </div>
                    <div>
                      <strong>Variations:</strong> {selectedNode.content.length}
                    </div>
                    {selectedNode.tags && (
                      <div>
                        <strong>Tags:</strong> {selectedNode.tags.join(', ')}
                      </div>
                    )}
                    {selectedNode.requiredState && (
                      <div>
                        <strong>Required State:</strong>{' '}
                        <code className="bg-slate-200 px-1 rounded">
                          {JSON.stringify(selectedNode.requiredState)}
                        </code>
                      </div>
                    )}
                  </div>

                  {/* Content Preview */}
                  <div className="border rounded p-4 bg-white">
                    <div className="text-xs text-slate-400 mb-2">
                      Content Preview (variation: {selectedNode.content[0]?.variation_id})
                    </div>
                    <DialogueDisplay
                      text={selectedNode.content[0]?.text || ''}
                      characterName={selectedNode.speaker}
                      emotion={selectedNode.content[0]?.emotion}
                    />
                  </div>

                  {/* Choices */}
                  <div>
                    <div className="text-sm font-semibold mb-2">
                      Choices ({evaluatedChoices.length})
                    </div>
                    <div className="space-y-2">
                      {evaluatedChoices.map(ec => (
                        <div
                          key={ec.choice.choiceId}
                          className={`p-3 rounded border ${
                            ec.visible && ec.enabled
                              ? 'bg-green-50 border-green-200'
                              : ec.visible
                              ? 'bg-yellow-50 border-yellow-200'
                              : 'bg-red-50 border-red-200 opacity-50'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{ec.choice.text}</div>
                              <div className="text-xs text-slate-500 mt-1">
                                → {ec.choice.nextNodeId}
                                {ec.choice.pattern && (
                                  <span className="ml-2 bg-slate-200 px-1 rounded">
                                    {ec.choice.pattern}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-xs">
                              {ec.visible && ec.enabled ? (
                                <span className="text-green-600">✓ Visible</span>
                              ) : ec.visible ? (
                                <span className="text-yellow-600">⚠ Disabled</span>
                              ) : (
                                <span className="text-red-600">✗ Hidden</span>
                              )}
                            </div>
                          </div>
                          {ec.reason && (
                            <div className="text-xs text-amber-600 mt-1">
                              Reason: {ec.reason}
                            </div>
                          )}
                          {ec.choice.visibleCondition && (
                            <div className="text-xs text-slate-400 mt-1">
                              Visible if:{' '}
                              <code>{JSON.stringify(ec.choice.visibleCondition)}</code>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* All Variations */}
                  {selectedNode.content.length > 1 && (
                    <div>
                      <div className="text-sm font-semibold mb-2">
                        All Variations ({selectedNode.content.length})
                      </div>
                      <div className="space-y-2">
                        {selectedNode.content.map((content, idx) => (
                          <div key={idx} className="p-3 border rounded bg-slate-50">
                            <div className="text-xs text-slate-400 mb-1">
                              {content.variation_id}
                              {content.emotion && (
                                <span className="ml-2">({content.emotion})</span>
                              )}
                            </div>
                            <div className="text-sm whitespace-pre-wrap">
                              {content.text.slice(0, 200)}
                              {content.text.length > 200 && '...'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-slate-400 py-8">
                  Select a node from the list to preview
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function DialoguePreviewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading preview...</div>}>
      <DialoguePreviewContent />
    </Suspense>
  )
}
