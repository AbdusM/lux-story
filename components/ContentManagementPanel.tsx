'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface StreamliningStatus {
  isRunning: boolean
  stage: string
  progress: number
  results?: {
    originalScenes: number
    keptScenes: number
    removedScenes: number
    repairedConnections: number
    success: boolean
    errors: string[]
    warnings: string[]
  }
  lastRun?: Date
}

interface ValidationStatus {
  valid: boolean
  totalScenes: number
  brokenConnections: number
  birminghamReferences: number
  errors: string[]
  warnings: string[]
  lastChecked?: Date
}

interface BackupInfo {
  totalBackups: number
  totalSizeMB: number
  latestBackup?: {
    id: string
    timestamp: Date
    description: string
  }
}

/**
 * Content Management Panel - Natural UI Integration
 * Provides one-click access to all content management tools
 */
export function ContentManagementPanel() {
  const [streamlining, setStreamlining] = useState<StreamliningStatus>({
    isRunning: false,
    stage: 'idle',
    progress: 0
  })
  const [validation, setValidation] = useState<ValidationStatus | null>(null)
  const [backups, setBackups] = useState<BackupInfo | null>(null)
  const [autoValidation, setAutoValidation] = useState(true)

  // Load initial status
  useEffect(() => {
    loadStatus()
    loadBackupInfo()

    // Auto-validate on component mount if enabled
    if (autoValidation) {
      runValidation()
    }
  }, [])

  const loadStatus = async () => {
    try {
      const response = await fetch('/api/content/status')
      const data = await response.json()
      setStreamlining(data.streamlining || streamlining)
      setValidation(data.validation || validation)
    } catch (error) {
      console.error('Failed to load status:', error)
    }
  }

  const loadBackupInfo = async () => {
    try {
      const response = await fetch('/api/content/backups')
      const data = await response.json()
      setBackups(data)
    } catch (error) {
      console.error('Failed to load backup info:', error)
    }
  }

  const runValidation = async () => {
    try {
      const response = await fetch('/api/content/validate', { method: 'POST' })
      const result = await response.json()
      setValidation({
        ...result,
        lastChecked: new Date()
      })
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const runStreamlining = async (dryRun: boolean = true) => {
    setStreamlining({
      isRunning: true,
      stage: 'initializing',
      progress: 0
    })

    try {
      const response = await fetch('/api/content/streamline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun })
      })

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response stream')

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\\n').filter(line => line.trim())

        for (const line of lines) {
          try {
            const update = JSON.parse(line)
            setStreamlining(prev => ({
              ...prev,
              stage: update.stage || prev.stage,
              progress: update.progress || prev.progress,
              results: update.results || prev.results
            }))
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }

      // Final status update
      setStreamlining(prev => ({
        ...prev,
        isRunning: false,
        stage: 'completed',
        progress: 100
      }))

      // Reload validation after streamlining
      if (!dryRun) {
        setTimeout(runValidation, 1000)
      }

    } catch (error) {
      console.error('Streamlining failed:', error)
      setStreamlining(prev => ({
        ...prev,
        isRunning: false,
        stage: 'error',
        progress: 0
      }))
    }
  }

  const generateVisualAnalysis = async () => {
    try {
      const response = await fetch('/api/content/visualize', { method: 'POST' })
      const result = await response.json()

      if (result.success && result.outputPath) {
        // Open visual analysis in new tab
        window.open(`/api/content/visual-output?path=${encodeURIComponent(result.outputPath)}`, '_blank')
      }
    } catch (error) {
      console.error('Visual analysis failed:', error)
    }
  }

  const restoreFromBackup = async (backupId: string) => {
    if (!confirm(`Restore from backup ${backupId}? This will overwrite current story data.`)) {
      return
    }

    try {
      const response = await fetch('/api/content/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupId })
      })

      const result = await response.json()
      if (result.success) {
        alert('Story restored successfully!')
        // Trigger game reload
        window.location.reload()
      } else {
        alert(`Restore failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Restore failed:', error)
      alert('Restore operation failed')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Management</h2>
          <p className="text-gray-600">Safe story streamlining and validation tools</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={autoValidation}
              onChange={(e) => setAutoValidation(e.target.checked)}
              className="rounded"
            />
            Auto-validate
          </label>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Story Validation</h3>
          <p className="text-sm text-gray-600 mb-3">Check story integrity and connections</p>
          <Button
            onClick={runValidation}
            className="w-full"
            size="sm"
          >
            Validate Now
          </Button>
          {validation && (
            <div className="mt-3 space-y-1">
              <Badge variant={validation.valid ? "default" : "destructive"}>
                {validation.valid ? "Valid" : "Issues Found"}
              </Badge>
              <div className="text-xs text-gray-500">
                {validation.totalScenes} scenes, {validation.birminghamReferences} Birmingham refs
              </div>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Story Streamlining</h3>
          <p className="text-sm text-gray-600 mb-3">Focus content on career exploration</p>
          <div className="space-y-2">
            <Button
              onClick={() => runStreamlining(true)}
              disabled={streamlining.isRunning}
              className="w-full"
              size="sm"
            >
              {streamlining.isRunning ? 'Running...' : 'Dry Run'}
            </Button>
            <Button
              onClick={() => runStreamlining(false)}
              disabled={streamlining.isRunning}
              variant="outline"
              className="w-full"
              size="sm"
            >
              Live Streamline
            </Button>
          </div>
          {streamlining.isRunning && (
            <div className="mt-3">
              <div className="text-xs text-gray-600 mb-1">{streamlining.stage}</div>
              <Progress value={streamlining.progress} className="h-2" />
            </div>
          )}
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Visual Analysis</h3>
          <p className="text-sm text-gray-600 mb-3">Generate story flow diagrams</p>
          <Button
            onClick={generateVisualAnalysis}
            className="w-full"
            size="sm"
          >
            Generate Visuals
          </Button>
        </Card>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Validation Status */}
        {validation && (
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Validation Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Overall Status</span>
                <Badge variant={validation.valid ? "default" : "destructive"}>
                  {validation.valid ? "✓ Valid" : "⚠ Issues"}
                </Badge>
              </div>
              <div className="text-sm">
                <div>Total Scenes: {validation.totalScenes}</div>
                <div>Broken Connections: {validation.brokenConnections}</div>
                <div>Birmingham References: {validation.birminghamReferences}</div>
              </div>
              {validation.errors.length > 0 && (
                <div className="text-xs text-red-600">
                  {validation.errors.length} error(s), {validation.warnings.length} warning(s)
                </div>
              )}
              {validation.lastChecked && (
                <div className="text-xs text-gray-500">
                  Last checked: {validation.lastChecked.toLocaleTimeString()}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Streamlining Results */}
        {streamlining.results && (
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Streamlining Results</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Status</span>
                <Badge variant={streamlining.results.success ? "default" : "destructive"}>
                  {streamlining.results.success ? "✓ Success" : "⚠ Failed"}
                </Badge>
              </div>
              <div className="text-sm">
                <div>Original: {streamlining.results.originalScenes} scenes</div>
                <div>Kept: {streamlining.results.keptScenes} scenes</div>
                <div>Removed: {streamlining.results.removedScenes} scenes</div>
                <div>Connections Repaired: {streamlining.results.repairedConnections}</div>
              </div>
              {streamlining.results.warnings.length > 0 && (
                <div className="text-xs text-orange-600">
                  {streamlining.results.warnings.length} warning(s)
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Backup Information */}
        {backups && (
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Backup System</h3>
            <div className="space-y-2">
              <div className="text-sm">
                <div>Total Backups: {backups.totalBackups}</div>
                <div>Storage Used: {backups.totalSizeMB.toFixed(1)} MB</div>
              </div>
              {backups.latestBackup && (
                <div className="text-xs text-gray-600">
                  Latest: {backups.latestBackup.id}
                  <br />
                  {backups.latestBackup.description}
                </div>
              )}
              <Button
                onClick={loadBackupInfo}
                variant="outline"
                size="sm"
                className="w-full"
              >
                View All Backups
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Warning Message */}
      <Card className="p-4 bg-orange-50 border-orange-200">
        <div className="flex items-start gap-2">
          <div className="text-orange-600 mt-0.5">⚠️</div>
          <div className="text-sm">
            <div className="font-medium text-orange-800">Safety Notice</div>
            <div className="text-orange-700">
              Always run "Dry Run" first to preview changes. Live streamlining will modify story data.
              Backups are created automatically, but test thoroughly before using live mode.
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}