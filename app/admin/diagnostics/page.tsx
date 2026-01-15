'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, RefreshCw, Database, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConsistencyIssue {
  type: 'orphaned_profile' | 'orphaned_player_profile' | 'missing_profile' | 'missing_player_profile' | 'text_fk_mismatch'
  userId: string
  details: string
  autoFixable: boolean
  fixed?: boolean
}

interface ConsistencyReport {
  timestamp: string
  totalUsers: number
  totalProfiles: number
  totalPlayerProfiles: number
  issues: ConsistencyIssue[]
  fixesApplied: number
  healthy: boolean
}

const ISSUE_TYPE_LABELS: Record<ConsistencyIssue['type'], string> = {
  'orphaned_profile': 'Orphaned Profile',
  'orphaned_player_profile': 'Orphaned Player Profile',
  'missing_profile': 'Missing Profile',
  'missing_player_profile': 'Missing Player Profile',
  'text_fk_mismatch': 'TEXT FK Guest User'
}

const ISSUE_TYPE_SEVERITY: Record<ConsistencyIssue['type'], 'error' | 'warning' | 'info'> = {
  'orphaned_profile': 'error',
  'orphaned_player_profile': 'error',
  'missing_profile': 'error',
  'missing_player_profile': 'info',
  'text_fk_mismatch': 'info' // Intentional for multi-tenant
}

export default function AdminDiagnosticsPage() {
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<ConsistencyReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runConsistencyCheck = async (autoFix: boolean = false) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/consistency-check?autoFix=${autoFix}`)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to run consistency check')
      }

      const data: ConsistencyReport = await response.json()
      setReport(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setReport(null)
    } finally {
      setLoading(false)
    }
  }

  const errorIssues = report?.issues.filter(i => ISSUE_TYPE_SEVERITY[i.type] === 'error') || []
  const warningIssues = report?.issues.filter(i => ISSUE_TYPE_SEVERITY[i.type] === 'warning') || []
  const infoIssues = report?.issues.filter(i => ISSUE_TYPE_SEVERITY[i.type] === 'info') || []

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Diagnostics</h1>
            <p className="text-gray-600 mt-1">Database consistency checks and system health monitoring</p>
          </div>
          <Database className="w-12 h-12 text-blue-600" />
        </div>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Data Consistency Check</CardTitle>
            <CardDescription>
              Validates relationships between auth.users, profiles, and player_profiles tables.
              Detects orphaned records, missing links, and data drift.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button
                onClick={() => runConsistencyCheck(false)}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    Run Check (Read-Only)
                  </>
                )}
              </Button>

              <Button
                onClick={() => runConsistencyCheck(true)}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Run Check + Auto-Fix
                  </>
                )}
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {report && (
          <>
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {report.healthy ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  )}
                  {report.healthy ? 'System Healthy' : 'Issues Detected'}
                </CardTitle>
                <CardDescription>
                  Last checked: {new Date(report.timestamp).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium">Auth Users</p>
                    <p className="text-2xl font-bold text-blue-900">{report.totalUsers}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-700 font-medium">Profiles</p>
                    <p className="text-2xl font-bold text-purple-900">{report.totalProfiles}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 font-medium">Player Profiles</p>
                    <p className="text-2xl font-bold text-green-900">{report.totalPlayerProfiles}</p>
                  </div>
                  <div className={cn(
                    "p-4 rounded-lg border",
                    report.fixesApplied > 0
                      ? "bg-amber-50 border-amber-200"
                      : "bg-gray-50 border-gray-200"
                  )}>
                    <p className={cn(
                      "text-sm font-medium",
                      report.fixesApplied > 0 ? "text-amber-700" : "text-gray-700"
                    )}>
                      Auto-Fixes Applied
                    </p>
                    <p className={cn(
                      "text-2xl font-bold",
                      report.fixesApplied > 0 ? "text-amber-900" : "text-gray-900"
                    )}>
                      {report.fixesApplied}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Issues */}
            {report.issues.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Detected Issues ({report.issues.length})</CardTitle>
                  <CardDescription>
                    {errorIssues.length > 0 && `${errorIssues.length} critical, `}
                    {warningIssues.length > 0 && `${warningIssues.length} warnings, `}
                    {infoIssues.length > 0 && `${infoIssues.length} informational`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {report.issues.map((issue, index) => {
                      const severity = ISSUE_TYPE_SEVERITY[issue.type]
                      const Icon = severity === 'error' ? AlertCircle :
                        severity === 'warning' ? AlertTriangle :
                          Database

                      const colorClasses = {
                        error: 'bg-red-50 border-red-200 text-red-900',
                        warning: 'bg-amber-50 border-amber-200 text-amber-900',
                        info: 'bg-blue-50 border-blue-200 text-blue-900'
                      }

                      const iconColorClasses = {
                        error: 'text-red-600',
                        warning: 'text-amber-600',
                        info: 'text-blue-600'
                      }

                      return (
                        <div
                          key={index}
                          className={cn(
                            "p-4 rounded-lg border flex items-start gap-3",
                            colorClasses[severity]
                          )}
                        >
                          <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", iconColorClasses[severity])} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold">{ISSUE_TYPE_LABELS[issue.type]}</p>
                              {issue.autoFixable && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                  Auto-fixable
                                </span>
                              )}
                              {issue.fixed && (
                                <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-medium rounded-full">
                                  Fixed
                                </span>
                              )}
                            </div>
                            <p className="text-sm opacity-90 mb-1">{issue.details}</p>
                            <p className="text-xs font-mono opacity-70">User ID: {issue.userId}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">All Clear!</h3>
                  <p className="text-gray-600">
                    No data consistency issues detected. All relationships are healthy.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
