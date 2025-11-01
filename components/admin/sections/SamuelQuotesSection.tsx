'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Quote } from 'lucide-react'
import type { ViewMode } from '@/lib/admin-dashboard-helpers'
import { formatAdminDateWithLabel } from '@/lib/admin-dashboard-helpers'
import type { SamuelQuote } from '@/lib/skill-tracker'

interface SamuelQuotesSectionProps {
  quotes: SamuelQuote[]
  adminViewMode: 'family' | 'research'
  userName: string
}

export function SamuelQuotesSection({ quotes, adminViewMode, userName }: SamuelQuotesSectionProps) {
  if (!quotes || quotes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <Quote className="w-5 h-5 text-purple-600" />
            Samuel's Wisdom
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {adminViewMode === 'family' 
              ? `${userName} hasn't received wisdom from Samuel yet.`
              : 'No Samuel quotes recorded yet.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {adminViewMode === 'family'
              ? "As you continue your journey and talk with Samuel, his wisdom will appear here."
              : "Samuel quotes are tracked when users interact with the station keeper character."}
          </p>
        </CardContent>
      </Card>
    )
  }

  // Sort by timestamp, most recent first
  const sortedQuotes = [...quotes].sort((a, b) => b.timestamp - a.timestamp)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Quote className="w-5 h-5 text-purple-600" />
              Samuel's Wisdom Shared with {adminViewMode === 'family' ? 'You' : userName}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {adminViewMode === 'family'
                ? `${quotes.length} ${quotes.length === 1 ? 'piece of wisdom' : 'pieces of wisdom'} Samuel has shared`
                : `${quotes.length} Samuel quotes tracked`}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs sm:text-sm">
            {quotes.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedQuotes.map((quote, idx) => (
            <div
              key={quote.quoteId || idx}
              className="border-l-4 border-purple-400 bg-purple-50 dark:bg-purple-950/20 p-4 sm:p-6 rounded-r-lg space-y-3"
            >
              {/* Quote Text */}
              <blockquote className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed italic">
                "{quote.quoteText}"
              </blockquote>

              {/* Metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                {quote.sceneDescription && (
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Scene:</span>
                    {quote.sceneDescription}
                  </span>
                )}
                {quote.timestamp && (
                  <span>
                    {formatAdminDateWithLabel(
                      new Date(quote.timestamp).toISOString(),
                      'activity',
                      adminViewMode as ViewMode,
                      adminViewMode === 'family' ? 'Shared' : 'Recorded'
                    )}
                  </span>
                )}
                {quote.emotion && (
                  <Badge variant="secondary" className="text-xs">
                    {quote.emotion}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Context Note */}
        {adminViewMode === 'research' && (
          <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <strong>Note:</strong> Samuel quotes are automatically tracked when users interact with 
              the station keeper character. These quotes represent wisdom shared during narrative interactions.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

