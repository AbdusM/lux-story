'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Award, ChevronDown, ArrowRight } from 'lucide-react'
import { analyzeSkillPatterns, sortSkillPatterns, type SortMode } from '@/lib/admin-pattern-recognition'
import { PatternRecognitionCard } from '@/components/admin/PatternRecognitionCard'
import { formatSkillName, getRecencyIndicator } from '@/lib/admin-dashboard-helpers'
import { formatAdminDate, type ViewMode } from '@/lib/admin-date-formatting'
import { springs } from '@/lib/animations'
import type { SkillProfile } from '@/lib/skill-profile-adapter'
import { GameErrorBoundary } from '@/components/GameErrorBoundary'

interface SkillsSectionProps {
  userId: string
  profile: SkillProfile
  adminViewMode: 'family' | 'research'
}

interface SkillSummary {
  skillName: string
  demonstrationCount: number
  latestContext: string
  scenesInvolved: string[]
  lastDemonstrated: string
}

export function SkillsSection({ userId, profile, adminViewMode }: SkillsSectionProps) {
  const [expandedCoreSkill, setExpandedCoreSkill] = useState<string | null>(null)
  const [skillSortMode, setSkillSortMode] = useState<SortMode>('by_count')
  const [skillsToShow, setSkillsToShow] = useState<number>(15) // Show first 15 skills initially

  // Derive skill summaries from profile data instead of making separate API call
  const skillsData: SkillSummary[] = useMemo(() => {
    const summaries: SkillSummary[] = []
    
    if (profile.skillDemonstrations) {
      Object.entries(profile.skillDemonstrations).forEach(([skillName, demonstrations]) => {
        if (demonstrations && demonstrations.length > 0) {
          // Get the most recent demonstration for latest context
          const sorted = [...demonstrations].sort((a, b) => {
            const aTime = a.timestamp || 0
            const bTime = b.timestamp || 0
            return bTime - aTime
          })
          const latest = sorted[0]
          
          // Get unique scenes involved
          const sceneValues = demonstrations.map(d => d.scene || d.sceneDescription || 'unknown')
          const scenes = Array.from(new Set(sceneValues))
          
          summaries.push({
            skillName,
            demonstrationCount: demonstrations.length,
            latestContext: latest?.context || `${skillName} indicated through narrative choices`,
            scenesInvolved: scenes,
            lastDemonstrated: latest && latest.timestamp 
              ? new Date(latest.timestamp).toISOString() 
              : new Date().toISOString()
          })
        }
      })
    }
    
    return summaries.sort((a, b) => b.demonstrationCount - a.demonstrationCount)
  }, [profile.skillDemonstrations])
  
  const skillsLoading = false
  const skillsError = null

  const getSkillColor = (count: number, maxCount: number): string => {
    if (maxCount === 0) return 'bg-gray-300'
    const ratio = count / maxCount
    if (ratio > 0.7) return 'bg-orange-500'
    if (ratio > 0.4) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const patterns = analyzeSkillPatterns(profile.skillDemonstrations || {})
  const sortedPatterns = sortSkillPatterns(patterns, skillSortMode)
  const visiblePatterns = sortedPatterns.slice(0, skillsToShow)

  return (
    <GameErrorBoundary componentName="SkillsSection">
    <div className="space-y-4">
      {/* Narrative Bridge */}
      <div className="bg-purple-50 border-l-4 border-purple-400 p-4 sm:p-6 rounded-r">
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          {adminViewMode === 'family' ? (
            <>Let's see what skills their choices align with through their journey.</>
          ) : (
            <>Skills indicated by choices analysis follows urgency factors.</>
          )}
        </p>
      </div>

      {/* Pattern Recognition Card */}
      <PatternRecognitionCard
        skillDemonstrations={profile.skillDemonstrations || {}}
        adminViewMode={adminViewMode}
      />

      {/* Core Skills Demonstrated */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-baseline gap-3 mb-2">
                <CardTitle className="text-lg sm:text-xl">Your Core Skills (Indicated by Choices)</CardTitle>
                {profile.totalDemonstrations > 0 && (
                  <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                    {profile.totalDemonstrations}
                  </span>
                )}
              </div>
              <CardDescription className="text-sm">
                Skills shown through your choices and interactions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Select value={skillSortMode} onValueChange={(value) => setSkillSortMode(value as SortMode)}>
                      <SelectTrigger className="w-full sm:w-[180px] min-h-[44px]">
                        <SelectValue placeholder="Sort skills" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="by_count">By Count</SelectItem>
                        <SelectItem value="alphabetical">Alphabetical</SelectItem>
                        <SelectItem value="by_recency">By Recency</SelectItem>
                        <SelectItem value="by_scene_type">By Scene Type</SelectItem>
                      </SelectContent>
                    </Select>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Choose how to sort your skills</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 min-h-[300px]">
          {sortedPatterns.length === 0 ? (
            <div className="text-center py-12">
              {adminViewMode === 'family' ? (
                <div className="space-y-3">
                  <p className="text-2xl">🎯</p>
                  <p className="text-lg font-medium text-gray-700">
                    Ready to explore skills!
                  </p>
                  <p className="text-sm text-gray-600">
                    Skill tracking starts after making choices in the story.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    Skills alignment tracking initialized
                  </p>
                  <p className="text-xs text-gray-600">
                    Data population requires user interaction with narrative scenarios.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              {visiblePatterns.map((pattern) => {
                const demonstrations = profile.skillDemonstrations[pattern.skillName] || []
                const isExpanded = expandedCoreSkill === pattern.skillName
                const recentDemos = demonstrations
                  .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
                  .slice(0, 3)
                const recency = getRecencyIndicator(pattern.lastDemonstrated ? new Date(pattern.lastDemonstrated).getTime() : undefined)

                return (
                  <div
                    key={pattern.skillName}
                    id={`skill-${pattern.skillName.toLowerCase().replace(/\s+/g, '-')}`}
                    className="border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <button
                      onClick={() => setExpandedCoreSkill(isExpanded ? null : pattern.skillName)}
                      className="w-full p-4 text-left min-h-[60px] touch-manipulation"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <span className="inline-flex items-center gap-1.5 mt-0.5" aria-label="Recent activity">
                            <span className={`w-2.5 h-2.5 rounded-full ${recency.color} flex-shrink-0`} title={recency.label} />
                            {adminViewMode === 'family' && recency.familyLabel && (
                              <span className={`text-xs ${recency.color === 'bg-green-500' ? 'text-green-700' : 'text-yellow-700'}`}>
                                {recency.familyLabel}
                              </span>
                            )}
                          </span>
                          <span className="font-bold text-sm sm:text-base line-clamp-2">
                            {formatSkillName(pattern.skillName)}
                          </span>
                          <span className="hidden sm:block text-xs text-muted-foreground truncate">
                            {pattern.strengthContext}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="secondary" className="text-sm sm:text-base px-3 py-1 font-semibold">
                            {pattern.totalDemonstrations}x
                          </Badge>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-600 transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={springs.smooth}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-3 border-t bg-gray-50">
                            <p className="text-sm font-semibold text-gray-600 mt-3">Evidence:</p>
                            {recentDemos.map((demo, idx) => {
                              const timestamp = demo.timestamp
                              const choiceText = demo.choice || demo.context.substring(0, 60)
                              return (
                                <div key={idx} className="text-sm space-y-2 pl-4 border-l-2 border-blue-300">
                                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                                    <span className="font-medium text-gray-800">{demo.scene}</span>
                                    {timestamp && (
                                      <span className="text-gray-600 text-xs">
                                        {formatAdminDate(timestamp, 'activity', adminViewMode as ViewMode)}
                                      </span>
                                    )}
                                  </div>
                                  {choiceText && (
                                    <p className="text-gray-600 italic text-sm">"{choiceText}"</p>
                                  )}
                                  <p className="text-gray-700 text-sm leading-relaxed">{demo.context}</p>
                                </div>
                              )
                            })}
                            {demonstrations.length > 3 && (
                              <p className="text-sm text-gray-500 italic pt-2">
                                + {demonstrations.length - 3} more demonstrations
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}

              {/* Show more button */}
              {sortedPatterns.length > skillsToShow && (
                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setSkillsToShow(sortedPatterns.length)}
                    className="w-full"
                  >
                    Show {sortedPatterns.length - skillsToShow} more skills
                  </Button>
                </div>
              )}

              {/* Show less button */}
              {skillsToShow >= sortedPatterns.length && sortedPatterns.length > 15 && (
                <div className="pt-4 border-t">
                  <Button
                    variant="ghost"
                    onClick={() => setSkillsToShow(15)}
                    className="w-full"
                  >
                    Show less
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* WEF 2030 Skills Framework */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            WEF 2030 Skills Framework
          </CardTitle>
          <CardDescription>
            Your future-ready skills tracked through your narrative choices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {skillsLoading ? (
            <div className="text-center py-8 text-gray-500">Loading 2030 skills data...</div>
          ) : skillsError ? (
            <div className="text-center py-8 text-red-500">{skillsError}</div>
          ) : skillsData.length === 0 ? (
            <div className="text-center py-12">
              {adminViewMode === 'family' ? (
                <div className="space-y-3">
                  <p className="text-2xl">🎯</p>
                  <p className="text-lg font-medium text-gray-700">
                    Ready to explore skills!
                  </p>
                  <p className="text-sm text-gray-600">
                    Skill tracking starts after making choices in the story.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    Skills alignment tracking initialized
                  </p>
                  <p className="text-xs text-gray-600">
                    Data population requires user interaction with narrative scenarios.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {skillsData
                  .sort((a, b) => b.demonstrationCount - a.demonstrationCount)
                  .slice(0, 5)
                  .map((skill, index) => {
                    const maxCount = Math.max(...skillsData.map(s => s.demonstrationCount))
                    const percentage = maxCount > 0 ? (skill.demonstrationCount / maxCount) * 100 : 0
                    const colorClass = getSkillColor(skill.demonstrationCount, maxCount)
                    const rank = index + 1

                    return (
                      <div key={skill.skillName} className="space-y-2 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-purple-600">#{rank}</span>
                            <span className="font-semibold text-sm capitalize">
                              {skill.skillName.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {skill.demonstrationCount} {skill.demonstrationCount === 1 ? 'demonstration' : 'demonstrations'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`${colorClass} h-3 rounded-full transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          {percentage.toFixed(0)}% of your most demonstrated skill
                        </div>
                      </div>
                    )
                  })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Navigation suggestion */}
      <Link href={`/admin/${userId}/careers`}>
        <Button variant="ghost" className="w-full justify-center gap-2 mt-6">
          Next: View Career Matches
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
    </GameErrorBoundary>
  )
}

