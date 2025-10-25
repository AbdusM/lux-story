/**
 * Career Discovery Card Component
 * Shows career exploration progress and Birmingham opportunities
 */

import type { CareerInsight } from '@/lib/types/student-insights'

interface CareerDiscoveryCardProps {
  career: CareerInsight
}

export function CareerDiscoveryCard({ career }: CareerDiscoveryCardProps) {
  // Only show matches with meaningful confidence (>10%)
  const showTopMatch = career.topMatch && career.topMatch.confidence > 10
  const showSecondMatch = career.secondMatch && career.secondMatch.confidence > 10
  
  return (
    <div className="space-y-4">
      {/* Top Career Matches - Only show if confidence is meaningful */}
      {(showTopMatch || showSecondMatch) ? (
        <div className="space-y-2">
          {showTopMatch && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="text-sm text-blue-600 font-medium">Emerging Career Interest</p>
                <p className="font-semibold text-gray-900 leading-relaxed">{career.topMatch.name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{career.topMatch.confidence}%</p>
                <p className="text-xs text-blue-600">match</p>
              </div>
            </div>
          )}

          {showSecondMatch && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="text-sm text-gray-600 font-medium">Also Exploring</p>
                <p className="font-semibold text-gray-900 leading-relaxed">{career.secondMatch.name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-600">{career.secondMatch.confidence}%</p>
                <p className="text-xs text-gray-600">match</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 text-center bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-base text-slate-600 leading-relaxed">
            Still exploring - career interests will emerge as they make more choices
          </p>
        </div>
      )}

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

