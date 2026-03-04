'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { useFocusTrap } from '@/hooks/useFocusTrap'

interface ErrorOverlayProps {
  title: string
  message: string
  onRefresh: () => void
  onDismiss: () => void
}

export function ErrorOverlay({ title, message, onRefresh, onDismiss }: ErrorOverlayProps) {
  const headingId = React.useId()
  const descId = React.useId()
  const { ref: dialogRef, onKeyDown: handleDialogKeyDown } = useFocusTrap<HTMLDivElement>()

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
      <div
        ref={dialogRef}
        tabIndex={-1}
        onKeyDown={handleDialogKeyDown}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={descId}
        data-overlay-surface
        className="mx-4 w-full max-w-md bg-slate-900 rounded-xl shadow-xl border border-red-900/50 overflow-hidden pointer-events-auto"
      >
        <div className="px-6 py-4 bg-red-950/50 border-b border-red-900/30">
          <h3 id={headingId} className="text-lg font-semibold text-red-300">
            {title}
          </h3>
        </div>
        <div className="px-6 py-4">
          <p id={descId} className="text-slate-300 mb-4">
            {message}
          </p>
          <div className="flex gap-3">
            <Button
              autoFocus
              onClick={onRefresh}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Refresh Page
            </Button>
            <Button onClick={onDismiss} variant="outline" className="flex-1">
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
