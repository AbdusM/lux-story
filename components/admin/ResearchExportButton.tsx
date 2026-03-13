'use client'

import { useState } from 'react'
import { AlertCircle, Download, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type ExportMode = 'cohort' | 'individual' | 'longitudinal'

interface ResearchExportButtonProps {
  userId: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const MODE_CONFIG: Array<{
  mode: ExportMode
  label: string
  description: string
}> = [
  {
    mode: 'cohort',
    label: 'Cohort Snapshot',
    description: 'Download a pseudonymized export for all participants.',
  },
  {
    mode: 'individual',
    label: 'Identified Export',
    description: 'Download this learner\'s consent-gated identified export.',
  },
  {
    mode: 'longitudinal',
    label: 'Longitudinal Export',
    description: 'Download this learner\'s timeline export when full research consent is granted.',
  },
]

function buildFilename(mode: ExportMode, userId: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  if (mode === 'cohort') {
    return `research-export-cohort-${timestamp}.json`
  }

  return `research-export-${mode}-${userId.slice(0, 8)}-${timestamp}.json`
}

export function ResearchExportButton({
  userId,
  variant = 'outline',
  size = 'default',
}: ResearchExportButtonProps) {
  const [open, setOpen] = useState(false)
  const [loadingMode, setLoadingMode] = useState<ExportMode | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async (mode: ExportMode) => {
    setLoadingMode(mode)
    setError(null)

    try {
      const searchParams = new URLSearchParams({ mode })
      if (mode !== 'cohort') {
        searchParams.set('userId', userId)
      }

      const response = await fetch(`/api/admin/research-export?${searchParams.toString()}`, {
        credentials: 'include',
      })
      const body = await response.json()

      if (!response.ok) {
        throw new Error(typeof body?.error === 'string' ? body.error : 'Unable to export research data.')
      }

      const blob = new Blob([JSON.stringify(body, null, 2)], {
        type: 'application/json',
      })
      const downloadUrl = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = downloadUrl
      anchor.download = buildFilename(mode, userId)
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.URL.revokeObjectURL(downloadUrl)
      setOpen(false)
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : 'Unable to export research data.')
    } finally {
      setLoadingMode(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Download className="h-4 w-4" />
          Research Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Research Export</DialogTitle>
          <DialogDescription>
            Download the consent-aware research payload for this learner or the full cohort.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {MODE_CONFIG.map((option) => {
            const isLoading = loadingMode === option.mode

            return (
              <button
                key={option.mode}
                type="button"
                onClick={() => handleExport(option.mode)}
                disabled={loadingMode !== null}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                    <p className="text-sm text-slate-600">{option.description}</p>
                  </div>
                  {isLoading ? (
                    <Loader2 className="mt-0.5 h-4 w-4 animate-spin text-slate-500" />
                  ) : (
                    <Download className="mt-0.5 h-4 w-4 text-slate-500" />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <DialogFooter>
          <p className="text-xs text-slate-500">
            Identified and longitudinal exports require granted research consent and guardian verification when applicable.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
