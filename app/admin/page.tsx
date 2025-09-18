'use client'

import { ChoiceReviewTrigger } from '@/components/ChoiceReviewPanel'
import { ContentManagementPanel } from '@/components/ContentManagementPanel'

/**
 * Admin Dashboard
 * Complete admin interface for managing live choices and content
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
            Live Choice Review and Content Management Dashboard
          </p>
        </div>

        {/* Content Management Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <ContentManagementPanel />
        </div>

        {/* Choice Review Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Live Choice Review</h2>
          <ChoiceReviewTrigger />
        </div>
      </div>
    </div>
  )
}