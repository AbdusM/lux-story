'use client'

import { ChoiceReviewPanel } from '@/components/ChoiceReviewPanel'

/**
 * Admin Dashboard
 * Simple admin interface for managing live choices and reviewing queue
 */
export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Grand Central Terminus Admin
          </h1>
          <p className="text-gray-600">
            Live Choice Review and Management Dashboard
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <ChoiceReviewPanel />
        </div>
      </div>
    </div>
  )
}