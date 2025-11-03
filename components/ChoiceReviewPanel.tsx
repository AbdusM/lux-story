/**
 * Choice Review Panel
 *
 * Admin interface for reviewing AI-generated choices
 * Allows writers to approve, edit, or reject choices in the review queue
 */

"use client"

import { useState, useEffect, useCallback } from 'react'
import { getLiveChoiceEngine, type ReviewQueueEntry } from '@/lib/live-choice-engine'

interface Statistics {
  totalGenerated: number
  totalApproved?: number
  totalRejected?: number
  averageConfidence?: number
  approvalRate: number
  pending?: number
  cachedChoices?: number
}

interface ChoiceReviewPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function ChoiceReviewPanel({ isOpen, onClose }: ChoiceReviewPanelProps) {
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueEntry[]>([])
  const [statistics, setStatistics] = useState<Statistics>({ totalGenerated: 0, approvalRate: 0 })
  const [editingText, setEditingText] = useState<Record<string, string>>({})

  const liveEngine = getLiveChoiceEngine()

  const loadReviewQueue = useCallback(() => {
    const pending = liveEngine.getPendingReviews()
    const stats = liveEngine.getStatistics()
    setReviewQueue(pending)
    setStatistics(stats)
  }, [liveEngine])

  useEffect(() => {
    if (isOpen) {
      loadReviewQueue()
    }
  }, [isOpen, loadReviewQueue])

  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleApprove = (entryId: string) => {
    const editedText = editingText[entryId]
    liveEngine.approveChoice(entryId, editedText)
    loadReviewQueue()
    setEditingText(prev => ({ ...prev, [entryId]: '' }))
  }

  const handleReject = (entryId: string) => {
    liveEngine.rejectChoice(entryId)
    loadReviewQueue()
  }

  const handleEditChange = (entryId: string, text: string) => {
    setEditingText(prev => ({ ...prev, [entryId]: text }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Live Choice Review Queue</h2>
            <p className="text-blue-100 text-sm">
              {statistics.totalGenerated} generated • {statistics.pending ?? 0} pending •
              {Math.round((statistics.approvalRate ?? 0) * 100)}% approval rate
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {reviewQueue.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">🎉</div>
              <p className="text-gray-600">No choices pending review!</p>
              <p className="text-gray-500 text-sm mt-2">
                Live-generated choices will appear here for your approval.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviewQueue.map(entry => (
                <div key={entry.id} className="border rounded-lg p-4 bg-gray-50">
                  {/* Scene Context */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Scene {entry.sceneId} • Pattern: {entry.request.pattern}
                    </h3>
                    <div className="bg-white p-3 rounded border text-sm text-gray-700">
                      "{entry.request.sceneContext}"
                    </div>
                  </div>

                  {/* Existing Choices */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Existing Choices:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {entry.request.existingChoices.map((choice, i) => (
                        <div key={i} className="bg-white px-3 py-2 rounded border text-sm">
                          {choice}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Generated Choice */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-700">Generated Choice:</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Confidence: {Math.round(entry.response.confidenceScore * 100)}%
                      </span>
                    </div>

                    <textarea
                      value={editingText[entry.id] ?? entry.response.text}
                      onChange={(e) => handleEditChange(entry.id, e.target.value)}
                      className="w-full p-3 border rounded resize-none"
                      rows={2}
                      placeholder="Edit the choice text..."
                    />

                    {editingText[entry.id] && editingText[entry.id] !== entry.response.text && (
                      <p className="text-sm text-orange-600 mt-1">
                        ✏️ Text has been edited
                      </p>
                    )}
                  </div>

                  {/* AI Justification */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">AI Justification:</h4>
                    <div className="bg-white p-3 rounded border text-sm text-gray-600 italic">
                      {entry.response.justification}
                    </div>
                  </div>

                  {/* Player Persona */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Player Persona:</h4>
                    <div className="bg-white p-3 rounded border text-sm text-gray-600">
                      {entry.request.playerPersona}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(entry.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                    >
                      ✅ {editingText[entry.id] ? 'Approve with Edits' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(entry.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                    >
                      ❌ Reject
                    </button>
                  </div>

                  {/* Metadata */}
                  <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                    Generated: {new Date(entry.response.generatedAt).toLocaleString()} •
                    Entry ID: {entry.id}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Statistics Footer */}
          {statistics.totalGenerated > 0 && (
            <div className="mt-8 pt-6 border-t bg-gray-50 -mx-6 px-6 py-4">
              <h3 className="font-semibold text-gray-800 mb-3">System Statistics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-600">Total Generated</div>
                  <div className="text-2xl font-bold text-blue-600">{statistics.totalGenerated}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">Approval Rate</div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((statistics.approvalRate ?? 0) * 100)}%
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">Cached Choices</div>
                  <div className="text-2xl font-bold text-purple-600">{statistics.cachedChoices ?? 0}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">Pending Review</div>
                  <div className="text-2xl font-bold text-orange-600">{statistics.pending ?? 0}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Debug Panel Trigger
 * Shows review panel button in development
 */
export function ChoiceReviewTrigger() {
  const [isOpen, setIsOpen] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const liveEngine = getLiveChoiceEngine()
      const pending = liveEngine.getPendingReviews()
      setPendingCount(pending.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 z-40 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
          pendingCount > 0
            ? 'bg-orange-600 hover:bg-orange-700 animate-pulse'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        🔍 Review Queue {pendingCount > 0 && `(${pendingCount})`}
      </button>

      <ChoiceReviewPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}