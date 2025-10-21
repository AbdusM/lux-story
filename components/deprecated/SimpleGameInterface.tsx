/**
 * ⚠️ DEPRECATED - DO NOT USE ⚠️
 * 
 * **Use instead**: StatefulGameInterface.tsx
 * **Deprecation Date**: October 17, 2025
 * **Reason**: Simplified prototype, not feature-complete
 * 
 * See: components/_GAME_INTERFACE_STATUS.md for details
 * 
 * @deprecated Use StatefulGameInterface instead
 * 
 * ---
 * 
 * Original: Simplified Game Interface
 * Uses simplified hooks and analytics - much cleaner than the complex version
 */

"use client"

import { useState, useCallback } from 'react'
import { useSimpleGame } from '@/hooks/useSimpleGame'
import { GameErrorBoundary } from './GameErrorBoundary'
import { GameMessages } from './GameMessages'
import { GameChoices } from './GameChoices'
import { CharacterIntro } from './CharacterIntro'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
// Apple Design System removed - using shadcn components

export function SimpleGameInterface() {
  const game = useSimpleGame()
  const [showInsights, setShowInsights] = useState(false)

  const handleInsightsToggle = useCallback(() => {
    setShowInsights(!showInsights)
  }, [showInsights])

  // Show intro screen if not started
  if (!game.hasStarted) {
    return (
      <GameErrorBoundary componentName="SimpleGameInterface">
        <div className="apple-container">
          <CharacterIntro onStart={game.handleStartGame} />
        </div>
      </GameErrorBoundary>
    )
  }

  return (
    <GameErrorBoundary componentName="SimpleGameInterface">
      <div className="apple-game-container">
        <header className="apple-header">
          <div className="apple-text-headline">Grand Central Terminus</div>
          <div className="apple-text-caption">Birmingham Career Exploration</div>

          {/* Simple insights toggle */}
          <Button
            onClick={handleInsightsToggle}
            variant="ghost"
            size="sm"
            className="ml-auto"
          >
            {showInsights ? 'Hide' : 'Show'} Insights
          </Button>
        </header>

        <main className="apple-game-content">
          <GameMessages messages={game.messages || []} />

          <GameChoices
            choices={game.currentScene?.choices || []}
            isProcessing={game.isProcessing}
            onChoice={game.handleChoice}
          />

          {/* Simple insights display */}
          {showInsights && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Your Career Exploration</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleInsightsDisplay
                  insights={game.getInsights()}
                  birminghamOpportunities={game.getBirminghamOpportunities()}
                />
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </GameErrorBoundary>
  )
}

// Simple insights component
interface SimpleInsights {
  primaryInterest?: string
  engagementLevel: string
  platformsCount?: number
  nextSteps?: string[]
}

interface BirminghamOpportunity {
  id: string
  name: string
  organization: string
}

function SimpleInsightsDisplay({ insights, birminghamOpportunities }: {
  insights: SimpleInsights
  birminghamOpportunities: BirminghamOpportunity[]
}) {
  return (
    <div className="simple-insights">
      <div className="apple-text-body">
        <strong>Primary Interest:</strong> {insights.primaryInterest || 'Still exploring'}
      </div>

      <div className="apple-text-body">
        <strong>Engagement:</strong> {insights.engagementLevel} level
      </div>

      <div className="apple-text-body">
        <strong>Platforms Explored:</strong> {insights.platformsCount || 0}
      </div>

      {birminghamOpportunities.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div className="apple-text-body"><strong>Birmingham Opportunities:</strong></div>
          {birminghamOpportunities.slice(0, 3).map(opp => (
            <div key={opp.id} className="apple-text-caption" style={{ marginLeft: '1rem' }}>
              • {opp.name} at {opp.organization}
            </div>
          ))}
        </div>
      )}

      {insights.nextSteps && insights.nextSteps.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div className="apple-text-body"><strong>Suggested Next Steps:</strong></div>
          {insights.nextSteps.map((step: string, idx: number) => (
            <div key={idx} className="apple-text-caption" style={{ marginLeft: '1rem' }}>
              • {step}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SimpleGameInterface