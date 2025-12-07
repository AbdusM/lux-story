'use client'

/**
 * Journey Summary Component
 * Displays Samuel's personalized narrative of the player's complete journey
 * Based on IF audit recommendation: "Procedural Journey Summary"
 */

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  X,
  ChevronRight,
  ChevronLeft,
  Compass,
  Heart,
  Sparkles,
  BookOpen
} from 'lucide-react'
import type { JourneyNarrative } from '@/lib/journey-narrative-generator'
import { formatSkillName } from '@/lib/admin-dashboard-helpers'
import { springs } from '@/lib/animations'
import { ResizablePanel } from '@/components/ResizablePanel'

interface JourneySummaryProps {
  narrative: JourneyNarrative
  onClose: () => void
  onExportPDF?: () => void
}

/**
 * Pattern badge colors
 */
const PATTERN_COLORS: Record<string, string> = {
  analytical: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  helping: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  building: 'bg-amber-100 text-amber-800 border-amber-300',
  patience: 'bg-sky-100 text-sky-800 border-sky-300',
  exploring: 'bg-purple-100 text-purple-800 border-purple-300'
}

export function JourneySummary({ narrative, onClose }: JourneySummaryProps) {
  const [currentSection, setCurrentSection] = useState(0)

  // Sections of the narrative
  const sections = [
    { id: 'opening', title: 'The Beginning', icon: Compass },
    { id: 'patterns', title: 'Your Patterns', icon: Sparkles },
    { id: 'relationships', title: 'Connections Made', icon: Heart },
    { id: 'skills', title: 'Skills Demonstrated', icon: BookOpen },
    { id: 'closing', title: 'Samuel\'s Wisdom', icon: Compass }
  ]

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight' && currentSection < sections.length - 1) {
        setCurrentSection(prev => prev + 1)
      } else if (e.key === 'ArrowLeft' && currentSection > 0) {
        setCurrentSection(prev => prev - 1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, currentSection, sections.length])

  const goNext = useCallback(() => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1)
    }
  }, [currentSection, sections.length])

  const goPrev = useCallback(() => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1)
    }
  }, [currentSection])

  const renderSection = () => {
    switch (sections[currentSection].id) {
      case 'opening':
        return (
          <div className="space-y-6">
            <div
              className="prose prose-slate prose-lg max-w-none"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {narrative.openingParagraph.split('\n\n').map((para, idx) => (
                <p
                  key={idx}
                  className={para.startsWith('*') ? 'text-slate-500 italic' : 'text-slate-700'}
                >
                  {para.replace(/^\*|\*$/g, '')}
                </p>
              ))}
            </div>

            {/* Journey Stats Preview */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
              <Badge variant="outline" className="text-sm">
                {narrative.journeyStats.arcsCompleted} arc{narrative.journeyStats.arcsCompleted > 1 ? 's' : ''} completed
              </Badge>
              <Badge variant="outline" className="text-sm">
                {narrative.journeyStats.totalChoices} choices made
              </Badge>
              <Badge
                className={`text-sm ${PATTERN_COLORS[narrative.journeyStats.dominantPattern] || PATTERN_COLORS.helping}`}
              >
                {narrative.journeyStats.dominantPattern} pattern
              </Badge>
            </div>
          </div>
        )

      case 'patterns':
        return (
          <div className="space-y-6">
            <div
              className="prose prose-slate prose-lg max-w-none"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {narrative.patternReflection.split('\n\n').map((para, idx) => (
                <p
                  key={idx}
                  className={para.startsWith('*') ? 'text-slate-500 italic' : 'text-slate-700'}
                >
                  {para.replace(/^\*|\*$/g, '')}
                </p>
              ))}
            </div>

            {/* Pattern Breakdown */}
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                Your Pattern Profile
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge className={`${PATTERN_COLORS[narrative.journeyStats.dominantPattern]} text-sm px-3 py-1`}>
                  Primary: {narrative.journeyStats.dominantPattern}
                </Badge>
                <Badge className={`${PATTERN_COLORS[narrative.journeyStats.secondaryPattern]} text-sm px-3 py-1`}>
                  Secondary: {narrative.journeyStats.secondaryPattern}
                </Badge>
              </div>
            </div>
          </div>
        )

      case 'relationships':
        return (
          <div className="space-y-6">
            <p className="text-slate-600" style={{ fontFamily: 'Georgia, serif' }}>
              *Samuel glances at the worn photographs on his wall.*
            </p>

            {narrative.relationshipReflections.length > 0 ? (
              <div className="space-y-4">
                {narrative.relationshipReflections.map((rel, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-slate-800">{rel.characterName}</h4>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 10 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < rel.trustLevel ? 'bg-emerald-500' : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p
                      className="text-slate-600 text-sm"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {rel.narrativeText}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">
                "You kept mostly to yourself this time. That's okay—sometimes we need to observe before we engage."
              </p>
            )}
          </div>
        )

      case 'skills':
        return (
          <div className="space-y-6">
            <p className="text-slate-600" style={{ fontFamily: 'Georgia, serif' }}>
              *Samuel reaches for a worn notebook, flipping through pages.*
            </p>

            <p className="text-slate-700" style={{ fontFamily: 'Georgia, serif' }}>
              "Let me tell you what I noticed—not what some test says you could do, but what you actually did:"
            </p>

            <div className="space-y-4">
              {narrative.skillHighlights.map((skill, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-lg p-4 space-y-2"
                >
                  <Badge className="bg-slate-100 text-slate-800 border-slate-300">
                    {formatSkillName(skill.skill)}
                  </Badge>
                  <p className="text-slate-700 text-sm">{skill.demonstration}</p>
                  <p className="text-slate-500 text-sm italic">
                    "{skill.significance}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )

      case 'closing':
        return (
          <div className="space-y-6">
            <div
              className="prose prose-slate prose-lg max-w-none"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {narrative.closingWisdom.split('\n\n').map((para, idx) => (
                <p
                  key={idx}
                  className={para.startsWith('*') ? 'text-slate-500 italic' : 'text-slate-700'}
                >
                  {para.replace(/^\*|\*$/g, '')}
                </p>
              ))}
            </div>

            {/* Final Stats */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
              <h4 className="text-amber-800 font-medium mb-3">Your Journey at a Glance</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-amber-600">Arcs Completed</span>
                  <p className="text-amber-900 font-bold text-lg">{narrative.journeyStats.arcsCompleted}</p>
                </div>
                <div>
                  <span className="text-amber-600">Choices Made</span>
                  <p className="text-amber-900 font-bold text-lg">{narrative.journeyStats.totalChoices}</p>
                </div>
                <div>
                  <span className="text-amber-600">Dominant Pattern</span>
                  <p className="text-amber-900 font-bold capitalize">{narrative.journeyStats.dominantPattern}</p>
                </div>
                <div>
                  <span className="text-amber-600">Average Trust</span>
                  <p className="text-amber-900 font-bold">{narrative.journeyStats.averageTrust}/10</p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const CurrentIcon = sections[currentSection].icon

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <Card
        className="max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl bg-white rounded-xl border-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-4 sm:p-6">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <CurrentIcon className="w-6 h-6 text-amber-400" />
              <div>
                <CardTitle className="text-lg sm:text-xl">
                  {sections[currentSection].title}
                </CardTitle>
                <p className="text-slate-300 text-sm mt-1">
                  Samuel's Reflection on Your Journey
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-10 w-10 p-0 text-white hover:bg-slate-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Section Dots with animated indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {sections.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSection(idx)}
                className="relative h-2"
              >
                <div
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx < currentSection
                      ? 'bg-slate-400'
                      : 'bg-slate-600'
                  }`}
                />
                {idx === currentSection && (
                  <motion.div
                    layoutId="journey-section-indicator"
                    className="absolute inset-0 w-6 h-2 bg-amber-400 rounded-full -left-2"
                    transition={springs.snappy}
                  />
                )}
              </button>
            ))}
          </div>
        </CardHeader>

        {/* Content with smooth height + cross-fade transitions */}
        <CardContent className="p-0 overflow-y-auto max-h-[60vh]">
          <ResizablePanel
            customKey={`section-${currentSection}`}
            transition="slideLeft"
            innerClassName="p-4 sm:p-6"
          >
            {renderSection()}
          </ResizablePanel>
        </CardContent>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50">
          <Button
            variant="ghost"
            onClick={goPrev}
            disabled={currentSection === 0}
            className="min-h-[44px]"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>

          <span className="text-sm text-slate-500">
            {currentSection + 1} of {sections.length}
          </span>

          {currentSection < sections.length - 1 ? (
            <Button
              onClick={goNext}
              className="min-h-[44px] bg-slate-800 hover:bg-slate-700"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={onClose}
              className="min-h-[44px] bg-amber-600 hover:bg-amber-500"
            >
              Complete Journey
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
