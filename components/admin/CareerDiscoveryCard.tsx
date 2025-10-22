/**
 * Career Discovery Card Component
 * Shows career exploration progress and Birmingham opportunities
 */

import type { CareerInsight } from '@/lib/types/student-insights'

interface CareerDiscoveryCardProps {
  career: CareerInsight
}

export function CareerDiscoveryCard({ career }: CareerDiscoveryCardProps) {
  return (
    <div className="space-y-4">
      {/* Top Career Matches */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <p className="text-sm text-blue-600 font-medium">Top Match</p>
            <p className="font-semibold text-gray-900">{career.topMatch.name}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{career.topMatch.confidence}%</p>
            <p className="text-xs text-blue-600">confidence</p>
          </div>
        </div>

        {career.secondMatch && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <p className="text-sm text-gray-600 font-medium">2nd Match</p>
              <p className="font-semibold text-gray-900">{career.secondMatch.name}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-600">{career.secondMatch.confidence}%</p>
              <p className="text-xs text-gray-600">confidence</p>
            </div>
          </div>
        )}
      </div>

      {/* Birmingham Opportunities */}
      {career.birminghamOpportunities.length > 0 && (
        <div className="pt-3 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Birmingham Opportunities</h4>
          <ul className="space-y-1">
            {career.birminghamOpportunities.map((opportunity, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>{opportunity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Decision Style */}
      <div className="pt-3 border-t">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Decision Style:</span>{' '}
          {career.decisionStyle}
        </p>
      </div>
    </div>
  )
}

