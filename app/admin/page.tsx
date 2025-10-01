'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChoiceReviewTrigger } from '@/components/ChoiceReviewPanel'
import { getAllUserIds, loadSkillProfile } from '@/lib/skill-profile-adapter'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, TrendingUp, Award, ArrowRight } from 'lucide-react'

/**
 * Admin Dashboard
 * Simple admin interface for managing live choices and reviewing queue
 */
export default function AdminPage() {
  const [userIds, setUserIds] = useState<string[]>([])
  const [userStats, setUserStats] = useState<Map<string, any>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Find all users with skill data
    const ids = getAllUserIds()
    setUserIds(ids)

    // Load basic stats for each user
    const stats = new Map()
    ids.forEach(userId => {
      const profile = loadSkillProfile(userId)
      if (profile) {
        // Calculate top skill by demonstration count (not scores)
        const topSkill = Object.entries(profile.skillDemonstrations)
          .sort(([, a], [, b]) => b.length - a.length)[0] || ['none', []]

        stats.set(userId, {
          totalDemonstrations: profile.totalDemonstrations,
          topSkill,
          topCareer: profile.careerMatches[0],
          milestones: profile.milestones.length
        })
      }
    })
    setUserStats(stats)
    setLoading(false)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Grand Central Terminus Admin
              </h1>
              <p className="text-gray-600">
                Live Choice Review and Skills Analytics Dashboard
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                ← Back to Game
              </Button>
            </Link>
          </div>
        </div>

        {/* User Journeys Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Skill Journeys
                </CardTitle>
                <CardDescription>
                  Evidence-based career exploration analytics
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-lg">
                {userIds.length} {userIds.length === 1 ? 'User' : 'Users'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading user data...
              </div>
            ) : userIds.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <p className="text-gray-600">No user journeys found yet.</p>
                <p className="text-sm text-gray-500">
                  Users need to complete at least 5 skill demonstrations for data to appear here.
                </p>
                <Link href="/test-data">
                  <Button className="mt-4">
                    Generate Test User Data
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {userIds.map(userId => {
                  const stats = userStats.get(userId)
                  return (
                    <Link key={userId} href={`/admin/skills?userId=${userId}`}>
                      <div className="block p-4 border rounded-lg hover:bg-gray-50 hover:border-blue-500 transition group">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">
                                User: {userId.slice(0, 12)}...
                              </h3>
                              {stats && (
                                <Badge variant="outline" className="gap-1">
                                  <Award className="w-3 h-3" />
                                  {stats.milestones} milestones
                                </Badge>
                              )}
                            </div>

                            {stats && (
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Demonstrations</p>
                                  <p className="font-medium text-blue-600">
                                    {stats.totalDemonstrations}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Most Demonstrated</p>
                                  <p className="font-medium capitalize">
                                    {stats.topSkill[0].replace(/([A-Z])/g, ' $1').trim()} ({stats.topSkill[1].length}x)
                                  </p>
                                </div>
                                {stats.topCareer && (
                                  <div>
                                    <p className="text-gray-500">Top Career Match</p>
                                    <p className="font-medium text-green-600">
                                      {Math.round(stats.topCareer.matchScore * 100)}%
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 group-hover:bg-blue-50"
                          >
                            View Journey
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Choice Management */}
        <Card>
          <CardHeader>
            <CardTitle>Live Choice Management</CardTitle>
            <CardDescription>
              Review and validate AI-generated choices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChoiceReviewTrigger />
          </CardContent>
        </Card>

        {/* System Status */}
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-green-600 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Content validation runs automatically when players load the game
          </p>
        </div>
      </div>
    </div>
  )
}