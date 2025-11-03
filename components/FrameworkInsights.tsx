'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, GraduationCap, Lightbulb, TrendingUp, X, Award } from 'lucide-react'
import { formatSkillName } from '@/lib/admin-dashboard-helpers'
import { useEffect } from 'react'
import type { SkillProfile } from '@/lib/skill-profile-adapter'

export interface FrameworkInsight {
  frameworkName: string
  frameworkAbbreviation: string
  researcher: string
  year: string
  whatItMeans: string
  howItApplies: string
  yourConnection: string
  icon?: 'skills' | 'career' | 'development' | 'learning'
}

interface FrameworkInsightsProps {
  profile: SkillProfile
  onClose: () => void
}

export function FrameworkInsights({ profile, onClose }: FrameworkInsightsProps) {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Get top skills for WEF framework connection
  const topSkills = Object.entries(profile.skillDemonstrations || {})
    .map(([skill, demos]) => ({
      skill,
      count: Array.isArray(demos) ? demos.length : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  // Determine dominant pattern for RIASEC connection from skill demonstrations
  // Infer pattern from skill types demonstrated
  const skillPatterns: Record<string, string> = {
    emotionalIntelligence: 'helping',
    collaboration: 'helping',
    communication: 'helping',
    criticalThinking: 'analytical',
    problemSolving: 'analytical',
    digitalLiteracy: 'analytical',
    creativity: 'building',
    leadership: 'building',
    adaptability: 'exploring',
    timeManagement: 'patience'
  }
  
  const patternCounts: Record<string, number> = { helping: 0, analytical: 0, building: 0, patience: 0, exploring: 0 }
  
  Object.entries(profile.skillDemonstrations || {}).forEach(([skill, demos]) => {
    const pattern = skillPatterns[skill] || 'helping'
    const count = Array.isArray(demos) ? demos.length : 0
    patternCounts[pattern] = (patternCounts[pattern] || 0) + count
  })
  
  const dominantPattern = Object.entries(patternCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'helping'

  const patternToRIASEC: Record<string, { type: string; description: string }> = {
    helping: { type: 'Social (S)', description: 'You naturally support and help others, making you well-suited for careers in healthcare, education, counseling, and social services.' },
    analytical: { type: 'Investigative (I)', description: 'You think systematically and solve problems methodically, making you a strong fit for science, research, engineering, and technology careers.' },
    building: { type: 'Realistic (R)', description: 'You create and build things with your hands or through practical solutions, aligning with careers in construction, manufacturing, engineering, and trades.' },
    patience: { type: 'Conventional (C)', description: 'You work carefully and methodically, making you well-suited for roles in administration, finance, data analysis, and organization.' },
    exploring: { type: 'Artistic (A)', description: 'You explore new ideas and express creativity, making you a good fit for careers in arts, design, writing, and creative problem-solving.' }
  }

  const riasecMatch = patternToRIASEC[dominantPattern] || patternToRIASEC.helping

  const frameworks: FrameworkInsight[] = [
    {
      frameworkName: 'World Economic Forum 2030 Skills',
      frameworkAbbreviation: 'WEF 2030',
      researcher: 'World Economic Forum',
      year: '2023',
      whatItMeans: 'This research analyzed 803 million job postings to identify the 12 most important skills for future careers.',
      howItApplies: 'Your choices are automatically connected to these skills, showing you what employers are looking for.',
      yourConnection: topSkills.length > 0
        ? `You've shown strength in ${topSkills.map(s => formatSkillName(s.skill)).join(', ')} - these are exactly the skills employers need.`
        : 'Keep making choices to see which skills you develop!',
      icon: 'skills'
    },
    {
      frameworkName: "Holland's RIASEC Career Theory",
      frameworkAbbreviation: 'RIASEC',
      researcher: 'John Holland',
      year: '1997',
      whatItMeans: 'Research shows that people are happiest in careers that match their personality type. There are 6 types, and most people fit 2-3.',
      howItApplies: 'Your choice patterns reveal your personality type, which helps match you to careers where you\'ll thrive.',
      yourConnection: `Your pattern of ${dominantPattern} choices aligns with ${riasecMatch.type}. ${riasecMatch.description}`,
      icon: 'career'
    },
    {
      frameworkName: "Erikson's Identity Development",
      frameworkAbbreviation: 'Identity Theory',
      researcher: 'Erik Erikson',
      year: '1968',
      whatItMeans: 'During adolescence, you\'re exploring who you are and what you want to do. This is a natural and important part of growing up.',
      howItApplies: 'The platform helps you explore different career paths and build your identity through helping characters make decisions.',
      yourConnection: `By helping Maya, Devon, and Jordan navigate their career decisions, you're also building your own career identity and understanding what matters to you.`,
      icon: 'development'
    },
    {
      frameworkName: 'Social Cognitive Career Theory',
      frameworkAbbreviation: 'SCCT',
      researcher: 'Albert Bandura & Robert Lent',
      year: '1986-1994',
      whatItMeans: 'You build confidence in your abilities by actually doing things, not just thinking about them. Seeing yourself succeed builds self-efficacy.',
      howItApplies: 'Every choice you make and every skill you demonstrate builds evidence of what you can do, strengthening your confidence.',
      yourConnection: `You've made ${profile.totalDemonstrations || 0} choices that show real skills. This evidence builds your confidence that you can succeed in future careers.`,
      icon: 'learning'
    }
  ]

  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case 'skills':
        return <TrendingUp className="w-5 h-5 text-blue-600" />
      case 'career':
        return <GraduationCap className="w-5 h-5 text-purple-600" />
      case 'development':
        return <Award className="w-5 h-5 text-amber-600" />
      case 'learning':
        return <Lightbulb className="w-5 h-5 text-green-600" />
      default:
        return <BookOpen className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-blue-200 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-2xl text-blue-900">
                  How Research Explains Your Journey
                </CardTitle>
              </div>
              <CardDescription className="text-base">
                The science behind what you're learning and why it matters
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Introduction */}
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
            <p className="text-sm text-gray-700">
              Everything you do in Grand Central Terminus is connected to real research about how people learn, 
              grow, and find their career paths. Here's how four key frameworks explain your journey.
            </p>
          </div>

          {/* Framework Cards */}
          {frameworks.map((framework, idx) => (
            <Card key={idx} className="border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getIcon(framework.icon)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900 mb-1">
                        {framework.frameworkName}
                      </CardTitle>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {framework.frameworkAbbreviation}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {framework.researcher} ({framework.year})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">What it means:</p>
                  <p className="text-sm text-gray-700">{framework.whatItMeans}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">How it applies to you:</p>
                  <p className="text-sm text-gray-700">{framework.howItApplies}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 border-l-4 border-amber-400">
                  <p className="text-sm font-medium text-amber-900 mb-1">Your connection:</p>
                  <p className="text-sm text-amber-800">{framework.yourConnection}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Why This Matters */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-400">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              Why This Matters
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              These aren't just theories—they're research-backed frameworks that help explain why your choices matter 
              and how they connect to real careers. Understanding these connections helps you:
            </p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>See the real-world value of skills you're developing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Understand how your personality connects to careers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Build confidence through evidence of your abilities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Make informed decisions about your career path</span>
              </li>
            </ul>
          </div>

          {/* Close Button */}
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onClose}
            size="lg"
          >
            Got It - Continue Learning
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

