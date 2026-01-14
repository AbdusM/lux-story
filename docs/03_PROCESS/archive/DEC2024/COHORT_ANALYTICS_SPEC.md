# Cohort Analytics Implementation Specification
**Date:** December 14, 2024
**Priority:** Critical for Urban Chamber Pilot
**Timeline:** 8-12 hours (Week 2 - Dec 16-20)

---

## Overview

Build `/admin/cohort` page to provide B2B educators (like Anthony at Urban Chamber) with aggregate analytics across all students in a cohort. Includes pattern distribution, career trends, and CSV export for grant reporting.

---

## File Structure

```
lib/
├── cohort-analytics.ts              # NEW: Aggregation functions + CSV generation
└── types/
    └── cohort-analytics.ts          # NEW: TypeScript interfaces

app/admin/
├── cohort/
│   └── page.tsx                     # NEW: Main cohort dashboard page

components/admin/cohort/             # NEW: Cohort-specific components
├── CohortOverviewCard.tsx           # Total students, active count, avg metrics
├── PatternDistributionChart.tsx     # Pattern breakdown (reuses ChoicePatternBar)
├── CareerTrendsCard.tsx             # Top careers + Birmingham opportunities
├── CharacterEngagementMatrix.tsx    # Character trust/engagement table
├── CompletionMetricsCard.tsx        # Journey depth brackets
└── CohortExportButton.tsx           # CSV export button
```

---

## Phase 1: Type Definitions

**File:** `lib/types/cohort-analytics.ts`

```typescript
/**
 * Cohort Analytics Type Definitions
 * For aggregate analysis across multiple students
 */

export interface CohortStats {
  // Overview metrics
  totalStudents: number
  activeStudents: number              // Active in last 7 days
  avgChoices: number
  avgScenes: number                   // Approximate from currentScene

  // Pattern distribution
  patternDistribution: Record<string, number>  // { "helping": 6, "analytical": 5, ... }
  patternPercentages: Record<string, number>   // { "helping": 37.5, "analytical": 31.25, ... }

  // Career trends
  careerSectors: Record<string, number>        // { "Healthcare": 8, "Technology": 6, ... }
  birminghamOpportunities: Array<{
    name: string
    count: number                     // How many students exploring this
    percentage: number
  }>

  // Character engagement
  characterEngagement: Array<{
    name: string                      // "Maya Chen", "Devon Kumar", "Jordan Packard"
    metCount: number                  // Students who met this character
    avgTrust: number                  // Average trust level (0-10)
    breakthroughCount: number         // Total breakthrough moments
  }>

  // Completion metrics
  completionBrackets: {
    tenPlus: number                   // Students with 10+ choices
    twentyPlus: number                // Students with 20+ choices
    thirtyPlus: number                // Students with 30+ choices
  }
  avgJourneyDepth: number             // Mean choices
  medianJourneyDepth: number          // Median choices
}

export interface CohortFilter {
  startDate?: Date                    // Filter by lastActive >= startDate
  endDate?: Date                      // Filter by lastActive <= endDate
  minChoices?: number                 // Filter students with >= N choices
  dominantPattern?: string            // Filter by dominant pattern
}
```

---

## Phase 2: Aggregation Functions

**File:** `lib/cohort-analytics.ts`

```typescript
import type { StudentInsights } from './types/student-insights'
import type { CohortStats, CohortFilter } from './types/cohort-analytics'

/**
 * Aggregate stats across all students in cohort
 */
export function aggregateCohortStats(
  students: StudentInsights[],
  filter?: CohortFilter
): CohortStats {
  // Apply filters if provided
  let filteredStudents = students

  if (filter?.startDate) {
    filteredStudents = filteredStudents.filter(
      s => s.lastActive >= filter.startDate!.getTime()
    )
  }

  if (filter?.endDate) {
    filteredStudents = filteredStudents.filter(
      s => s.lastActive <= filter.endDate!.getTime()
    )
  }

  if (filter?.minChoices) {
    filteredStudents = filteredStudents.filter(
      s => s.choicePatterns.totalChoices >= filter.minChoices!
    )
  }

  if (filter?.dominantPattern) {
    filteredStudents = filteredStudents.filter(
      s => s.choicePatterns.dominantPattern === filter.dominantPattern
    )
  }

  const totalStudents = filteredStudents.length

  // 1. Overview metrics
  const now = Date.now()
  const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000)
  const activeStudents = filteredStudents.filter(
    s => s.lastActive >= sevenDaysAgo
  ).length

  const totalChoices = filteredStudents.reduce(
    (sum, s) => sum + s.choicePatterns.totalChoices,
    0
  )
  const avgChoices = totalStudents > 0 ? totalChoices / totalStudents : 0

  // Approximate scenes from character arc completion
  // Heuristic: Each character arc ~10 scenes, + Samuel intro (3 scenes)
  const avgScenes = filteredStudents.reduce((sum, s) => {
    const arcsStarted = s.characterRelationships.filter(c => c.met).length
    return sum + (arcsStarted * 10) + 3  // Rough estimate
  }, 0) / totalStudents

  // 2. Pattern distribution
  const patternCounts: Record<string, number> = {
    helping: 0,
    analytical: 0,
    patience: 0,
    exploring: 0,
    building: 0
  }

  filteredStudents.forEach(student => {
    const patterns = [
      { name: 'helping', value: student.choicePatterns.helping },
      { name: 'analytical', value: student.choicePatterns.analytical },
      { name: 'patience', value: student.choicePatterns.patience },
      { name: 'exploring', value: student.choicePatterns.exploring },
      { name: 'building', value: student.choicePatterns.building }
    ].filter(p => p.value > 0).sort((a, b) => b.value - a.value)

    const dominant = patterns[0]?.name
    if (dominant && patternCounts[dominant] !== undefined) {
      patternCounts[dominant]++
    }
  })

  const patternPercentages: Record<string, number> = {}
  Object.keys(patternCounts).forEach(pattern => {
    patternPercentages[pattern] = totalStudents > 0
      ? (patternCounts[pattern] / totalStudents) * 100
      : 0
  })

  // 3. Career trends
  const careerSectorMap: Record<string, string> = {
    // Map career names to sectors
    'Healthcare Professional': 'Healthcare',
    'Medical Device Designer': 'Healthcare',
    'Biomedical Engineer': 'Healthcare',
    'Community Organizer': 'Community Work',
    'Nonprofit Leader': 'Community Work',
    'Software Engineer': 'Technology',
    'AI Researcher': 'Technology',
    'Robotics Engineer': 'Engineering',
    'Mechanical Engineer': 'Engineering',
    // Add more mappings as needed
  }

  const careerSectors: Record<string, number> = {}
  filteredStudents.forEach(student => {
    const careerName = student.careerDiscovery.topMatch.name
    const sector = careerSectorMap[careerName] || 'Other'
    careerSectors[sector] = (careerSectors[sector] || 0) + 1
  })

  // Birmingham opportunities
  const opportunityMap: Record<string, number> = {}
  filteredStudents.forEach(student => {
    student.careerDiscovery.birminghamOpportunities.forEach(opp => {
      opportunityMap[opp] = (opportunityMap[opp] || 0) + 1
    })
  })

  const birminghamOpportunities = Object.entries(opportunityMap)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalStudents > 0 ? (count / totalStudents) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)  // Top 10

  // 4. Character engagement
  const characters = ['Maya Chen', 'Devon Kumar', 'Jordan Packard']
  const characterEngagement = characters.map(charName => {
    const relationships = filteredStudents
      .map(s => s.characterRelationships.find(c => c.characterName === charName))
      .filter(Boolean) as NonNullable<StudentInsights['characterRelationships'][0]>[]

    const metCount = relationships.filter(r => r.met).length
    const totalTrust = relationships
      .filter(r => r.met)
      .reduce((sum, r) => sum + r.trustLevel, 0)
    const avgTrust = metCount > 0 ? totalTrust / metCount : 0

    const breakthroughCount = filteredStudents
      .flatMap(s => s.breakthroughMoments)
      .filter(m => m.characterName === charName).length

    return { name: charName, metCount, avgTrust, breakthroughCount }
  })

  // 5. Completion metrics
  const choiceCounts = filteredStudents.map(s => s.choicePatterns.totalChoices)
  const completionBrackets = {
    tenPlus: choiceCounts.filter(c => c >= 10).length,
    twentyPlus: choiceCounts.filter(c => c >= 20).length,
    thirtyPlus: choiceCounts.filter(c => c >= 30).length
  }

  const sortedChoices = [...choiceCounts].sort((a, b) => a - b)
  const medianJourneyDepth = totalStudents > 0
    ? sortedChoices[Math.floor(totalStudents / 2)]
    : 0

  return {
    totalStudents,
    activeStudents,
    avgChoices,
    avgScenes,
    patternDistribution: patternCounts,
    patternPercentages,
    careerSectors,
    birminghamOpportunities,
    characterEngagement,
    completionBrackets,
    avgJourneyDepth: avgChoices,
    medianJourneyDepth
  }
}

/**
 * Generate CSV export (Summary format)
 */
export function generateCohortSummaryCSV(stats: CohortStats): string {
  const rows = [
    ['Metric', 'Value'],
    ['Total Students', stats.totalStudents.toString()],
    ['Active (Last 7 Days)', stats.activeStudents.toString()],
    ['Avg Choices per Student', stats.avgChoices.toFixed(1)],
    ['Median Choices per Student', stats.medianJourneyDepth.toString()],
    ['Students with 10+ Choices', `${stats.completionBrackets.tenPlus} (${((stats.completionBrackets.tenPlus / stats.totalStudents) * 100).toFixed(1)}%)`],
    ['Students with 20+ Choices', `${stats.completionBrackets.twentyPlus} (${((stats.completionBrackets.twentyPlus / stats.totalStudents) * 100).toFixed(1)}%)`],
    ['Students with 30+ Choices', `${stats.completionBrackets.thirtyPlus} (${((stats.completionBrackets.thirtyPlus / stats.totalStudents) * 100).toFixed(1)}%)`],
    ['', ''],  // Blank row
    ['PATTERN DISTRIBUTION', ''],
    ...Object.entries(stats.patternDistribution)
      .sort(([, a], [, b]) => b - a)
      .map(([pattern, count]) => [
        `${pattern} Pattern`,
        `${count} students (${stats.patternPercentages[pattern].toFixed(1)}%)`
      ]),
    ['', ''],  // Blank row
    ['CAREER SECTORS', ''],
    ...Object.entries(stats.careerSectors)
      .sort(([, a], [, b]) => b - a)
      .map(([sector, count]) => [sector, `${count} students`]),
    ['', ''],  // Blank row
    ['TOP BIRMINGHAM OPPORTUNITIES', ''],
    ...stats.birminghamOpportunities.map(opp => [
      opp.name,
      `${opp.count} students (${opp.percentage.toFixed(1)}%)`
    ]),
    ['', ''],  // Blank row
    ['CHARACTER ENGAGEMENT', ''],
    ...stats.characterEngagement.map(char => [
      char.name,
      `Met: ${char.metCount}, Avg Trust: ${char.avgTrust.toFixed(1)}, Breakthroughs: ${char.breakthroughCount}`
    ])
  ]

  return rows.map(row => row.join(',')).join('\n')
}

/**
 * Generate CSV export (Detailed student list format)
 */
export function generateCohortDetailedCSV(students: StudentInsights[]): string {
  const headers = [
    'User ID',
    'Last Active',
    'Total Choices',
    'Dominant Pattern',
    'Pattern Consistency',
    'Top Career Match',
    'Career Confidence',
    'Birmingham Opportunities',
    'Maya Trust',
    'Devon Trust',
    'Jordan Trust',
    'Breakthrough Count',
    'Total Skill Demonstrations'
  ]

  const rows = students.map(student => {
    const mayaTrust = student.characterRelationships.find(c => c.characterName === 'Maya Chen')?.trustLevel || 0
    const devonTrust = student.characterRelationships.find(c => c.characterName === 'Devon Kumar')?.trustLevel || 0
    const jordanTrust = student.characterRelationships.find(c => c.characterName === 'Jordan Packard')?.trustLevel || 0

    return [
      student.userId,
      new Date(student.lastActive).toLocaleDateString(),
      student.choicePatterns.totalChoices.toString(),
      student.choicePatterns.dominantPattern,
      student.choicePatterns.consistency,
      student.careerDiscovery.topMatch.name,
      `${student.careerDiscovery.topMatch.confidence}%`,
      `"${student.careerDiscovery.birminghamOpportunities.join('; ')}"`,  // Quoted for CSV
      mayaTrust.toString(),
      devonTrust.toString(),
      jordanTrust.toString(),
      student.breakthroughMoments.length.toString(),
      student.totalDemonstrations.toString()
    ]
  })

  return [headers, ...rows].map(row => row.join(',')).join('\n')
}

/**
 * Trigger CSV download in browser
 */
export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
```

---

## Phase 3: Cohort Dashboard Page

**File:** `app/admin/cohort/page.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllUserIds, loadSkillProfile } from '@/lib/skill-profile-adapter'
import { parseStudentInsights } from '@/lib/student-insights-parser'
import { aggregateCohortStats } from '@/lib/cohort-analytics'
import type { StudentInsights } from '@/lib/types/student-insights'
import type { CohortStats } from '@/lib/types/cohort-analytics'
import { Button } from '@/components/ui/button'
import { CohortOverviewCard } from '@/components/admin/cohort/CohortOverviewCard'
import { PatternDistributionChart } from '@/components/admin/cohort/PatternDistributionChart'
import { CareerTrendsCard } from '@/components/admin/cohort/CareerTrendsCard'
import { CohortExportButton } from '@/components/admin/cohort/CohortExportButton'

export default function CohortDashboard() {
  const [students, setStudents] = useState<StudentInsights[]>([])
  const [cohortStats, setCohortStats] = useState<CohortStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCohortData = async () => {
      try {
        setError(null)

        // Get all user IDs
        const ids = await getAllUserIds()

        // Sort by recency
        const sortedIds = ids.sort((a, b) => {
          const timestampA = a.match(/player_(\d+)/)?.[1] || '0'
          const timestampB = b.match(/player_(\d+)/)?.[1] || '0'
          return parseInt(timestampB) - parseInt(timestampA)
        })

        // Load all student profiles (limit to 100 for performance)
        const batchSize = 10
        const insights: StudentInsights[] = []

        for (let i = 0; i < Math.min(sortedIds.length, 100); i += batchSize) {
          const batch = sortedIds.slice(i, i + batchSize)
          const profiles = await Promise.all(
            batch.map(id => loadSkillProfile(id))
          )

          const batchInsights = profiles
            .filter(profile => profile !== null)
            .map(profile => parseStudentInsights(profile!))

          insights.push(...batchInsights)

          // Update UI progressively
          setStudents([...insights])
        }

        setStudents(insights)

        // Aggregate stats
        const stats = aggregateCohortStats(insights)
        setCohortStats(stats)
      } catch (error: unknown) {
        console.error('Failed to load cohort data:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to load cohort data'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    loadCohortData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-2 border-slate-200 border-t-blue-600 mx-auto" />
            <div className="absolute inset-0 animate-ping rounded-full border-2 border-blue-400 opacity-20" />
          </div>
          <div>
            <p className="text-lg font-medium text-slate-900 mb-2">Loading Cohort Data</p>
            <p className="text-base text-slate-600">
              Aggregating patterns, careers, and engagement across all students...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !cohortStats) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-red-900 mb-2">Error Loading Cohort Data</h3>
            <p className="text-base text-red-700 mb-6">{error || 'Failed to load data'}</p>
            <Link href="/admin">
              <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                Back to Student List
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Cohort Analytics</h1>
            <p className="text-lg text-slate-600">
              Aggregate insights across {cohortStats.totalStudents} students
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin">
              <Button variant="outline">View Individual Students</Button>
            </Link>
            <CohortExportButton students={students} stats={cohortStats} />
          </div>
        </div>

        {/* Overview Section */}
        <CohortOverviewCard stats={cohortStats} />

        {/* Pattern Distribution */}
        <PatternDistributionChart stats={cohortStats} />

        {/* Career Trends */}
        <CareerTrendsCard stats={cohortStats} />

        {/* Link to individual students */}
        <div className="bg-slate-100 rounded-lg p-6 text-center">
          <p className="text-slate-700 mb-4">
            For detailed individual student analysis, visit the Student List
          </p>
          <Link href="/admin">
            <Button variant="outline">Browse Students</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
```

---

## Phase 4: Cohort Components

### 4.1 CohortOverviewCard

**File:** `components/admin/cohort/CohortOverviewCard.tsx`

```typescript
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Users, Activity, Sparkles } from 'lucide-react'
import type { CohortStats } from '@/lib/types/cohort-analytics'

interface CohortOverviewCardProps {
  stats: CohortStats
}

export function CohortOverviewCard({ stats }: CohortOverviewCardProps) {
  const activePercentage = stats.totalStudents > 0
    ? (stats.activeStudents / stats.totalStudents) * 100
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cohort Overview</CardTitle>
        <CardDescription>High-level engagement metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Total Students */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Students</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalStudents}</p>
            </div>
          </div>

          {/* Active Students */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Active (Last 7 Days)</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.activeStudents}
                <span className="text-base text-slate-500 ml-2">
                  ({activePercentage.toFixed(0)}%)
                </span>
              </p>
            </div>
          </div>

          {/* Avg Choices */}
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Avg Choices per Student</p>
              <p className="text-2xl font-bold text-slate-900">{stats.avgChoices.toFixed(1)}</p>
              <p className="text-xs text-slate-500">Median: {stats.medianJourneyDepth}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

---

### 4.2 PatternDistributionChart

**File:** `components/admin/cohort/PatternDistributionChart.tsx`

```typescript
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { CohortStats } from '@/lib/types/cohort-analytics'
import { formatPatternName, getPatternBgClass } from '@/lib/patterns'

interface PatternDistributionChartProps {
  stats: CohortStats
}

export function PatternDistributionChart({ stats }: PatternDistributionChartProps) {
  const patterns = Object.entries(stats.patternDistribution)
    .map(([name, count]) => ({
      name,
      count,
      percentage: stats.patternPercentages[name]
    }))
    .sort((a, b) => b.count - a.count)

  const maxCount = Math.max(...patterns.map(p => p.count), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choice Pattern Distribution</CardTitle>
        <CardDescription>
          How students approach decisions across the cohort
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {patterns.map(pattern => (
            <div key={pattern.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={getPatternBgClass(pattern.name)}>
                    {formatPatternName(pattern.name)}
                  </Badge>
                  <span className="text-sm text-slate-600">
                    {pattern.count} students
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {pattern.percentage.toFixed(1)}%
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(pattern.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

---

### 4.3 CareerTrendsCard

**File:** `components/admin/cohort/CareerTrendsCard.tsx`

```typescript
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Briefcase, MapPin } from 'lucide-react'
import type { CohortStats } from '@/lib/types/cohort-analytics'

interface CareerTrendsCardProps {
  stats: CohortStats
}

export function CareerTrendsCard({ stats }: CareerTrendsCardProps) {
  const topCareerSectors = Object.entries(stats.careerSectors)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const topOpportunities = stats.birminghamOpportunities.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Career Discovery Trends</CardTitle>
        <CardDescription>
          Top career paths and Birmingham opportunities explored by students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Career Sectors */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <Briefcase className="w-5 h-5" />
              <h4>Top Career Sectors</h4>
            </div>
            <div className="space-y-3">
              {topCareerSectors.map(sector => (
                <div key={sector.name} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{sector.name}</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {sector.count} student{sector.count > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Birmingham Opportunities */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <MapPin className="w-5 h-5" />
              <h4>Birmingham Opportunities</h4>
            </div>
            <div className="space-y-3">
              {topOpportunities.map(opp => (
                <div key={opp.name} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{opp.name}</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {opp.count} ({opp.percentage.toFixed(0)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

---

### 4.4 CohortExportButton

**File:** `components/admin/cohort/CohortExportButton.tsx`

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  generateCohortSummaryCSV,
  generateCohortDetailedCSV,
  downloadCSV
} from '@/lib/cohort-analytics'
import type { StudentInsights } from '@/lib/types/student-insights'
import type { CohortStats } from '@/lib/types/cohort-analytics'

interface CohortExportButtonProps {
  students: StudentInsights[]
  stats: CohortStats
}

export function CohortExportButton({ students, stats }: CohortExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportSummary = () => {
    try {
      setIsExporting(true)
      const csv = generateCohortSummaryCSV(stats)
      const timestamp = new Date().toISOString().split('T')[0]
      downloadCSV(csv, `cohort-summary-${timestamp}.csv`)
    } catch (error) {
      console.error('CSV export failed:', error)
      alert('Failed to generate CSV. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportDetailed = () => {
    try {
      setIsExporting(true)
      const csv = generateCohortDetailedCSV(students)
      const timestamp = new Date().toISOString().split('T')[0]
      downloadCSV(csv, `cohort-detailed-${timestamp}.csv`)
    } catch (error) {
      console.error('CSV export failed:', error)
      alert('Failed to generate CSV. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isExporting} className="gap-2">
          <Download className="h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export CSV'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportSummary}>
          Cohort Summary CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportDetailed}>
          Detailed Student List CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## Testing Checklist

### Unit Tests (Optional but Recommended)
- [ ] `aggregateCohortStats()` with 0 students
- [ ] `aggregateCohortStats()` with 1 student
- [ ] `aggregateCohortStats()` with 10 students
- [ ] `aggregateCohortStats()` with filters
- [ ] `generateCohortSummaryCSV()` output format
- [ ] `generateCohortDetailedCSV()` output format

### Manual Testing
- [ ] Load `/admin/cohort` with 0 students (empty state)
- [ ] Load `/admin/cohort` with 1 student
- [ ] Load `/admin/cohort` with 10+ students
- [ ] Verify pattern distribution percentages add to 100%
- [ ] Verify career trends show correct counts
- [ ] Export Summary CSV → open in Excel/Sheets
- [ ] Export Detailed CSV → verify all columns present
- [ ] Mobile responsive layout

---

## Performance Considerations

### Optimization Strategies
1. **Batch Loading:** Reuse existing batching logic from `/admin` (10 students at a time)
2. **Memoization:** Cache `cohortStats` in React state (don't recalculate on every render)
3. **Lazy Loading:** Load `/admin/cohort` page on-demand (not eagerly)
4. **CSV Generation:** Client-side (no server round-trip)

### Expected Performance
- **Load Time (16 students):** ~2-3 seconds (same as `/admin` page)
- **Load Time (50 students):** ~5-6 seconds
- **CSV Export:** <500ms (client-side string manipulation)

---

## Future Enhancements (Post-Pilot)

1. **Interactive Charts:** Replace simple bars with Recharts/Chart.js pie/bar charts
2. **Cohort Filtering:** Date range picker, pattern filter, min choices slider
3. **Character Engagement Matrix:** Sortable table with trust trends over time
4. **Completion Metrics Card:** Journey depth distribution histogram
5. **Cohort Comparison:** Compare Fall 2024 vs Spring 2025 cohorts
6. **Real-Time Updates:** WebSocket updates when students make choices (overkill for pilot)

---

## Success Criteria

### MVP Complete When:
- ✅ `/admin/cohort` page loads with 4 sections
- ✅ Pattern distribution shows percentages
- ✅ Career trends show top sectors + Birmingham opportunities
- ✅ CSV export (Summary) downloads correctly
- ✅ CSV export (Detailed) downloads correctly
- ✅ Mobile responsive (no horizontal scroll)
- ✅ Anthony can answer: "What % of my cohort is helping-dominant?"
- ✅ Anthony can export data for Urban League grant report

---

## Deployment Notes

1. **No Database Changes:** Uses existing SkillProfile data
2. **No New Dependencies:** Pure TypeScript (no charting libs yet)
3. **No API Routes:** Client-side aggregation
4. **Deployment:** Standard Next.js build → Vercel deploy

---

## Questions for Review

Before implementing, confirm:
1. Is CSV format acceptable for Urban League reports?
2. Should "active" threshold be 7 days or 14 days?
3. Do we need cohort filtering (date range) for MVP?
4. Should we add Character Engagement Matrix to MVP or defer?

---

## Summary

**What We're Building:**
- `/admin/cohort` page with 4 key sections
- Aggregate analytics across all students
- CSV export (Summary + Detailed formats)
- Mobile-friendly responsive design

**Timeline:** 8-12 hours (Week 2)

**Impact:** Anthony can report cohort trends to Urban League, demonstrate program impact, secure future cohorts.
