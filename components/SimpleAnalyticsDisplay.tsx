"use client"

import { memo, useState, useEffect } from 'react'
import { getSimpleAnalytics, type SimpleAnalytics } from '@/lib/simple-analytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, MapPin, Clock, Target } from 'lucide-react'

interface SimpleAnalyticsDisplayProps {
  playerId: string
  isVisible?: boolean
  onToggle?: () => void
}

/**
 * Simple Analytics Display Component
 * Shows essential career exploration insights without overwhelming complexity
 */
export const SimpleAnalyticsDisplay = memo(({ 
  playerId, 
  isVisible = false, 
  onToggle 
}: SimpleAnalyticsDisplayProps) => {
  const [analytics, setAnalytics] = useState<SimpleAnalytics | null>(null)
  const [insights, setInsights] = useState<any>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // Load analytics data
  useEffect(() => {
    const analyticsEngine = getSimpleAnalytics()
    const currentAnalytics = analyticsEngine.getAnalytics(playerId)
    const careerInsights = analyticsEngine.getCareerInsights(playerId)
    
    setAnalytics(currentAnalytics)
    setInsights(careerInsights)
  }, [playerId])

  if (!analytics || !isVisible) {
    return null
  }

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
    onToggle?.()
  }

  return (
    <Card className="apple-analytics-card">
      <CardHeader 
        className="cursor-pointer select-none"
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="apple-text-title flex items-center gap-2">
            <Target className="w-5 h-5" />
            Your Career Journey
          </CardTitle>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Progress Overview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="apple-text-body font-medium">Exploration Progress</span>
              <Badge variant="secondary" className="apple-badge">
                {analytics.explorationDepth}
              </Badge>
            </div>
            <Progress 
              value={(analytics.scenesCompleted / 20) * 100} 
              className="h-2"
            />
            <p className="apple-text-caption text-muted-foreground">
              {analytics.scenesCompleted} scenes completed • {analytics.totalChoices} choices made
            </p>
          </div>

          {/* Career Interests */}
          {analytics.careerInterests.length > 0 && (
            <div className="space-y-3">
              <h4 className="apple-text-body font-medium flex items-center gap-2">
                <Target className="w-4 h-4" />
                Career Interests
              </h4>
              <div className="flex flex-wrap gap-2">
                {analytics.careerInterests.map((interest, index) => (
                  <Badge key={index} variant="outline" className="apple-badge">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Birmingham Connections */}
          {analytics.birminghamConnections.length > 0 && (
            <div className="space-y-3">
              <h4 className="apple-text-body font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Birmingham Connections
              </h4>
              <p className="apple-text-caption text-muted-foreground">
                You've discovered {analytics.birminghamConnections.length} local opportunities
              </p>
            </div>
          )}

          {/* Career Insights */}
          {insights && (
            <div className="space-y-3">
              <h4 className="apple-text-body font-medium">Career Insights</h4>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <p className="apple-text-body">
                    <strong>Primary Interest:</strong> {insights.primaryInterest}
                  </p>
                  <p className="apple-text-caption text-muted-foreground">
                    Confidence: {Math.round(insights.confidence * 100)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Engagement Level */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="apple-text-body font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Engagement Level
              </span>
              <Badge 
                variant={analytics.engagementLevel === 'high' ? 'default' : 
                       analytics.engagementLevel === 'medium' ? 'secondary' : 'outline'}
                className="apple-badge"
              >
                {analytics.engagementLevel}
              </Badge>
            </div>
            <p className="apple-text-caption text-muted-foreground">
              Average response time: {Math.round(analytics.averageResponseTime / 1000)}s
            </p>
          </div>

          {/* Next Steps */}
          {insights?.nextSteps && (
            <div className="space-y-3">
              <h4 className="apple-text-body font-medium">Suggested Next Steps</h4>
              <ul className="space-y-2">
                {insights.nextSteps.slice(0, 3).map((step: string, index: number) => (
                  <li key={index} className="apple-text-caption text-muted-foreground flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Birmingham Opportunities */}
          {insights?.birminghamOpportunities && (
            <div className="space-y-3">
              <h4 className="apple-text-body font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Local Opportunities
              </h4>
              <div className="space-y-2">
                {insights.birminghamOpportunities.slice(0, 3).map((opportunity: string, index: number) => (
                  <div key={index} className="p-3 bg-muted/30 rounded-md">
                    <p className="apple-text-caption font-medium">{opportunity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
})

SimpleAnalyticsDisplay.displayName = 'SimpleAnalyticsDisplay'
