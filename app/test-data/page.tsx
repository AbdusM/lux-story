'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Download } from 'lucide-react'
import Link from 'next/link'

/**
 * Test Data Generator for Dashboard Testing
 * Generates a sample user with 15 skill demonstrations
 */
export default function TestDataPage() {
  const [generated, setGenerated] = useState(false)
  const [userId, setUserId] = useState('')

  const generateTestData = () => {
    if (typeof window === 'undefined') return

    const TEST_USER_ID = `test_user_${Date.now()}`
    setUserId(TEST_USER_ID)

    // Import SkillTracker dynamically
    import('@/lib/skill-tracker').then(({ SkillTracker }) => {
      const tracker = new SkillTracker(TEST_USER_ID)

      // Simulate 15 skill demonstrations
      const demos = [
        { scene: 'maya_family_pressure', choice: 'family_understanding', skills: ['emotionalIntelligence', 'culturalCompetence', 'communication', 'criticalThinking'], context: 'Reframed parental sacrifice from obligation to investment' },
        { scene: 'maya_robotics_passion', choice: 'encourage_passion', skills: ['emotionalIntelligence', 'communication'], context: 'Validated authentic passion for robotics' },
        { scene: 'devon_father_reveal', choice: 'express_sympathy', skills: ['emotionalIntelligence', 'communication'], context: 'Showed empathy for grief' },
        { scene: 'devon_uab_systems_engineering', choice: 'affirm_systems', skills: ['problemSolving', 'communication'], context: 'Recognized systems thinking framework' },
        { scene: 'jordan_mentor_context', choice: 'reframe_learning', skills: ['criticalThinking', 'communication', 'adaptability'], context: 'Reframed jobs as learning journey' },
        { scene: 'jordan_impostor_reveal', choice: 'normalize_impostor', skills: ['emotionalIntelligence', 'communication'], context: 'Normalized impostor syndrome' },
        { scene: 'samuel_backstory_revelation', choice: 'ask_why_teach', skills: ['criticalThinking', 'emotionalIntelligence'], context: 'Uncovered meaning-making purpose' },
        { scene: 'samuel_reflect_on_influence', choice: 'reflect_patterns', skills: ['criticalThinking', 'emotionalIntelligence', 'adaptability'], context: 'Recognized helping pattern' },
        { scene: 'maya_actionable_path', choice: 'uab_bridge', skills: ['problemSolving', 'communication', 'digitalLiteracy'], context: 'Suggested UAB biomedical engineering' },
        { scene: 'devon_crossroads', choice: 'crossroads_vulnerability', skills: ['leadership', 'emotionalIntelligence', 'communication'], context: 'Committed to vulnerability' },
        { scene: 'jordan_crossroads', choice: 'crossroads_internal', skills: ['leadership', 'emotionalIntelligence', 'criticalThinking', 'adaptability'], context: 'Chose internal validation' },
        { scene: 'maya_crossroads', choice: 'crossroads_robotics', skills: ['leadership', 'communication', 'adaptability'], context: 'Supported authentic passion' },
        { scene: 'samuel_teaching_witnessing', choice: 'witness_acknowledge', skills: ['emotionalIntelligence', 'adaptability', 'communication'], context: 'Embraced holding space' },
        { scene: 'jordan_chooses_birmingham', choice: 'jordan_birmingham_affirm', skills: ['communication', 'creativity', 'culturalCompetence', 'leadership'], context: 'Validated place-based identity' },
        { scene: 'samuel_pattern_observation', choice: 'accept', skills: ['emotionalIntelligence', 'collaboration'], context: 'Received observation with gratitude' }
      ]

      try {
        demos.forEach(demo => {
          tracker.recordSkillDemonstration(
            demo.scene,
            demo.choice,
            demo.skills as ('communication' | 'emotionalIntelligence' | 'creativity' | 'problemSolving' | 'criticalThinking' | 'leadership' | 'collaboration' | 'adaptability' | 'digitalLiteracy' | 'culturalCompetence')[],
            demo.context
          )
        })

        // Add milestones
        tracker.addMilestone('Completed Maya\'s arc')
        tracker.addMilestone('Completed Devon\'s arc')
        tracker.addMilestone('Completed Jordan\'s arc')
        tracker.addMilestone('Completed Samuel\'s arc')

        setGenerated(true)
      } catch (error) {
        console.error('Failed to generate test data:', error)
        alert('Error generating test data. Check console for details.')
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto pt-12 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Test Data Generator</CardTitle>
            <CardDescription>
              Generate sample skill demonstration data for dashboard testing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!generated ? (
              <>
                <p className="text-sm text-gray-600">
                  This will create a test user with 15 skill demonstrations across all 4 character arcs,
                  allowing you to preview the complete dashboard experience.
                </p>
                <Button onClick={generateTestData} className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Generate Test User Data
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Test data generated successfully!</span>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg space-y-2 text-sm">
                  <p><strong>User ID:</strong> {userId}</p>
                  <p><strong>Demonstrations:</strong> 15</p>
                  <p><strong>Skills:</strong> 10 unique skills</p>
                  <p><strong>Milestones:</strong> 4</p>
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/skills?userId=${userId}`} className="flex-1">
                    <Button className="w-full">
                      View User Dashboard
                    </Button>
                  </Link>
                  <Link href="/admin" className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Admin List
                    </Button>
                  </Link>
                </div>

                <Button
                  onClick={generateTestData}
                  variant="outline"
                  className="w-full"
                >
                  Generate Another User
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start">
                ← Back to Game
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start">
                → Admin Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
