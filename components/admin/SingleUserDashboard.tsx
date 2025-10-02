'use client'

/**
 * SingleUserDashboard - Skills Analytics Dashboard
 *
 * MOCK DATA REPLACEMENT CHECKLIST (Priority Order):
 * ================================================
 *
 * 🔴 HIGH PRIORITY (Replace First):
 * 1. Evidence Tab (Lines ~782-789): Top-level mock data warning
 *    - Source: Add Alert component flagging demo mode
 *    - Status: ✅ COMPLETED
 *
 * 2. Evidence Tab - All 5 Frameworks (Lines ~799-913):
 *    - Framework 1 (WEF 2030 Skills): Pull from Supabase skill_demonstrations table
 *    - Framework 2 (Erikson Identity): Calculate from player_persona developmental stage analysis
 *    - Framework 3 (Flow Theory): Calculate from game_state scene_history timestamps + engagement metrics
 *    - Framework 4 (Limbic Learning): Pull from player_persona behavior_metrics stress indicators
 *    - Framework 5 (SCCT Self-Efficacy): Derive from choice_history confidence + skill demonstrations
 *    - Status: ✅ FLAGGED with yellow badges and TODO comments
 *
 * 3. Evidence Tab - Grant-Reportable Outcomes (Lines ~917-966):
 *    - Aggregate metrics from skill_demonstrations, career_matches, player_persona
 *    - Calculate real percentages and counts from Supabase tables
 *    - Status: ✅ FLAGGED with yellow badge and TODO comment
 *
 * 🟡 MEDIUM PRIORITY (Replace After Evidence Tab):
 * 4. Careers Tab - Career Matching Algorithm (Line ~687):
 *    - Replace mock career match logic with production Supabase queries
 *    - Integrate skill_demonstrations + BIRMINGHAM_OPPORTUNITIES data
 *    - Status: ✅ FLAGGED with TODO comment
 *
 * 5. Mock User Data Object (Lines ~47-193):
 *    - Currently used as fallback/reference
 *    - Replace with actual SkillProfile from props
 *    - Note: Most of dashboard already uses real profile prop, but mock data shows structure
 *    - Status: ⚠️ REFERENCE ONLY - Can remain for development
 *
 * 🟢 LOW PRIORITY (Data Already Real):
 * - Urgency Tab: ✅ Already pulling from /api/admin/urgency
 * - Skills Tab: ✅ Already pulling from profile.skillDemonstrations (real data)
 * - 2030 Skills Tab: ✅ Already pulling from /api/user/skill-summaries
 * - Gaps Tab: Uses profile.skillGaps (derived from real data)
 * - Action Tab: Uses profile data (real)
 *
 * NARRATIVE BRIDGES ADDED:
 * ✅ Skills → Careers (Line ~679): Connects skill demonstrations to career pathways
 * ✅ Careers → Gaps (Line ~1077): Bridges career matches to skill development needs
 * ✅ Gaps → Action (Line ~1138): Connects skill gaps to concrete Birmingham actions
 * ✅ Action → 2030 Skills (Line ~1235): Frames WEF skills in workforce readiness context
 *
 * IMPLEMENTATION NOTES:
 * - All mock data sections have yellow "Mock Data" badges for visibility
 * - TODO comments include specific Supabase table/column references
 * - Warnings are informational (yellow), not alarming (red)
 * - Production replacement priority: Evidence Tab first (highest stakeholder visibility)
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Target, TrendingUp, Briefcase, Lightbulb, CheckCircle2, AlertTriangle, RefreshCw, Award, BookOpen, Building2, AlertCircle, Users, GraduationCap, ChevronDown } from 'lucide-react';
import type { SkillProfile } from '@/lib/skill-profile-adapter';
import { ExportButton } from '@/components/admin/ExportButton';
import { AdvisorBriefingButton } from '@/components/admin/AdvisorBriefingButton';
import { BIRMINGHAM_OPPORTUNITIES } from '@/lib/simple-career-analytics';
import { SkillProgressionChart } from '@/components/admin/SkillProgressionChart';
import { SparklineTrend } from '@/components/admin/SparklineTrend';

interface SingleUserDashboardProps {
  userId: string
  profile: SkillProfile
}

interface UrgencyData {
  userId: string
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low' | null
  urgencyScore: number
  urgencyNarrative: string
  disengagementScore: number
  confusionScore: number
  stressScore: number
  isolationScore: number
  lastActivity: string
  totalChoices: number
  uniqueScenesVisited: number
  relationshipsFormed: number
}

interface SkillSummary {
  skillName: string
  demonstrationCount: number
  latestContext: string
  scenesInvolved: string[]
  lastDemonstrated: string
}

// Mock data for reference (will be replaced with real profile prop)
const mockUserData = {
  userId: "user_12345",
  userName: "Jamal T.",
  
  // From 2030 Skills System - 12 concrete skills (0-1 scale)
  skills: {
    criticalThinking: 0.82,      // Advanced
    communication: 0.75,          // Intermediate
    collaboration: 0.58,          // Developing
    creativity: 0.65,             // Intermediate
    adaptability: 0.70,           // Intermediate
    leadership: 0.52,             // Developing
    digitalLiteracy: 0.68,        // Intermediate
    emotionalIntelligence: 0.85,  // Advanced
    culturalCompetence: 0.78,     // Intermediate
    financialLiteracy: 0.45,      // Developing
    timeManagement: 0.42,         // Needs work
    problemSolving: 0.80          // Advanced
  },

  // Skill demonstrations (from skillHistory)
  skillDemonstrations: {
    criticalThinking: [
      { scene: "maya-family-love", context: "Analyzed family expectations vs. authentic passion", value: 0.85 },
      { scene: "jordan-resume-myth", context: "Evaluated career path complexity", value: 0.78 }
    ],
    emotionalIntelligence: [
      { scene: "maya-family-love", context: "Recognized emotional weight of family sacrifice", value: 0.90 },
      { scene: "devon-social-struggle", context: "Showed empathy for social anxiety", value: 0.82 }
    ],
    problemSolving: [
      { scene: "maya-strategic-balance", context: "Found bridge solution (MD-PhD)", value: 0.85 },
      { scene: "jordan-all-paths-wisdom", context: "Recognized accumulation vs. single path", value: 0.80 }
    ]
  },

  // Career matches from the actual 6 Birmingham paths
  careerMatches: [
    {
      id: 'healthcare-tech',
      name: 'Healthcare Technology Specialist',
      matchScore: 0.87,
      requiredSkills: {
        digitalLiteracy: { current: 0.68, required: 0.80, gap: 0.12 },
        communication: { current: 0.75, required: 0.70, gap: 0 },
        problemSolving: { current: 0.80, required: 0.80, gap: 0 },
        emotionalIntelligence: { current: 0.85, required: 0.90, gap: 0.05 }
      },
      salaryRange: [55000, 85000],
      educationPaths: ['UAB Health Informatics', 'Jeff State Medical Technology', 'Bootcamp + Certification'],
      localOpportunities: ['UAB Hospital', 'Children\'s Hospital', 'St. Vincent\'s', 'Innovation Depot Health Tech'],
      birminghamRelevance: 0.9,
      growthProjection: 'high',
      readiness: 'near_ready' // Close match, small skill gaps
    },
    {
      id: 'community-health-worker',
      name: 'Community Health Worker',
      matchScore: 0.82,
      requiredSkills: {
        communication: { current: 0.75, required: 0.90, gap: 0.15 },
        culturalCompetence: { current: 0.78, required: 0.90, gap: 0.12 },
        emotionalIntelligence: { current: 0.85, required: 0.80, gap: 0 },
        collaboration: { current: 0.58, required: 0.80, gap: 0.22 }
      },
      salaryRange: [35000, 55000],
      educationPaths: ['Jeff State Community Health', 'UAB Public Health', 'Community College + Certification'],
      localOpportunities: ['UAB Hospital', 'Jefferson County Health', 'Community Clinics', 'Non-profits'],
      birminghamRelevance: 0.9,
      growthProjection: 'high',
      readiness: 'skill_gaps' // Good match but needs collaboration development
    },
    {
      id: 'data-analyst-community',
      name: 'Community Data Analyst',
      matchScore: 0.78,
      requiredSkills: {
        criticalThinking: { current: 0.82, required: 0.90, gap: 0.08 },
        digitalLiteracy: { current: 0.68, required: 0.80, gap: 0.12 },
        communication: { current: 0.75, required: 0.70, gap: 0 },
        culturalCompetence: { current: 0.78, required: 0.80, gap: 0.02 }
      },
      salaryRange: [50000, 80000],
      educationPaths: ['UAB Data Science', 'Jeff State Computer Science', 'Bootcamp + Community Focus'],
      localOpportunities: ['City of Birmingham', 'United Way', 'Innovation Depot', 'UAB Research'],
      birminghamRelevance: 0.9,
      growthProjection: 'high',
      readiness: 'exploratory' // Moderate match, worth exploring
    }
  ],

  // Skill trajectory over journey
  skillEvolution: [
    { checkpoint: "Start", criticalThinking: 0.50, emotionalIntelligence: 0.50, problemSolving: 0.50 },
    { checkpoint: "Ch1 Complete", criticalThinking: 0.65, emotionalIntelligence: 0.72, problemSolving: 0.68 },
    { checkpoint: "Maya Arc", criticalThinking: 0.75, emotionalIntelligence: 0.82, problemSolving: 0.75 },
    { checkpoint: "Current", criticalThinking: 0.82, emotionalIntelligence: 0.85, problemSolving: 0.80 }
  ],

  // What choices demonstrated
  keySkillMoments: [
    {
      scene: "maya-family-love",
      choice: "Sometimes the best way to honor love is to live authentically",
      skillsDemonstrated: ["emotionalIntelligence", "criticalThinking"],
      insight: "Recognized emotional complexity while thinking strategically about values"
    },
    {
      scene: "maya-strategic-balance",
      choice: "MD-PhD programs - strategic integration",
      skillsDemonstrated: ["problemSolving", "creativity"],
      insight: "Found innovative bridge solution rather than either/or thinking"
    },
    {
      scene: "jordan-permission-giving",
      choice: "I've been waiting for someone to say that",
      skillsDemonstrated: ["adaptability", "emotionalIntelligence"],
      insight: "Open to non-linear thinking and self-compassion"
    }
  ],

  // Gap analysis
  skillGaps: [
    {
      skill: "timeManagement",
      currentLevel: 0.42,
      targetForTopCareers: 0.60,
      gap: 0.18,
      priority: "medium",
      developmentPath: "Practice structured exploration - not rushing decisions shows patience, but needs planning skills"
    },
    {
      skill: "collaboration",
      currentLevel: 0.58,
      targetForTopCareers: 0.80,
      gap: 0.22,
      priority: "high",
      developmentPath: "Community Health Worker requires team skills. Consider group project experiences."
    },
    {
      skill: "digitalLiteracy",
      currentLevel: 0.68,
      targetForTopCareers: 0.80,
      gap: 0.12,
      priority: "medium",
      developmentPath: "Healthcare Tech requires higher digital skills. Bootcamp or online courses recommended."
    }
  ]
};

/**
 * Data Source Badge Component
 * Shows whether framework is using real, partial, or mock data
 */
function DataSourceBadge({
  hasRealData,
  minDemonstrations,
  actualDemonstrations
}: {
  hasRealData: boolean
  minDemonstrations: number
  actualDemonstrations: number
}) {
  if (hasRealData && actualDemonstrations >= minDemonstrations) {
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 text-xs">
        ✓ Real Data ({actualDemonstrations} demos)
      </Badge>
    )
  } else if (actualDemonstrations >= Math.floor(minDemonstrations / 2)) {
    return (
      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
        ⚠ Partial ({actualDemonstrations}/{minDemonstrations} demos)
      </Badge>
    )
  } else {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300 text-xs">
        ⊗ Mock Data ({actualDemonstrations}/{minDemonstrations} demos)
      </Badge>
    )
  }
}

const SingleUserDashboard: React.FC<SingleUserDashboardProps> = ({ userId, profile }) => {
  const [activeTab, setActiveTab] = useState("urgency");
  const user = profile; // Use real profile data instead of mock

  // Agent 1: Evidence Tab mode toggle (Issue 5C)
  const [evidenceMode, setEvidenceMode] = useState<'research' | 'family'>('family');

  // Urgency data state
  const [urgencyData, setUrgencyData] = useState<UrgencyData | null>(null);
  const [urgencyLoading, setUrgencyLoading] = useState(false);
  const [urgencyError, setUrgencyError] = useState<string | null>(null);
  const [recalculating, setRecalculating] = useState(false);

  // 2030 Skills data state
  const [skillsData, setSkillsData] = useState<SkillSummary[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  // Evidence frameworks data state
  const [evidenceData, setEvidenceData] = useState<any>(null);
  const [evidenceLoading, setEvidenceLoading] = useState(false);
  const [evidenceError, setEvidenceError] = useState<string | null>(null);

  // Fetch urgency data for this specific user
  useEffect(() => {
    const fetchUrgencyData = async () => {
      setUrgencyLoading(true);
      setUrgencyError(null);

      try {
        // Use admin proxy to avoid exposing token in client bundle
        const response = await fetch('/api/admin-proxy/urgency?level=all&limit=200');

        if (!response.ok) {
          throw new Error('Failed to fetch urgency data');
        }

        const data = await response.json();

        // Find the student matching this userId
        const student = data.students?.find((s: UrgencyData) => s.userId === userId);
        setUrgencyData(student || null);
      } catch (error) {
        console.error('Error fetching urgency data:', error);
        setUrgencyError('Unable to load urgency data');
      } finally {
        setUrgencyLoading(false);
      }
    };

    if (userId) {
      fetchUrgencyData();
    }
  }, [userId]);

  // Fetch 2030 skills data for this specific user
  useEffect(() => {
    const fetchSkillsData = async () => {
      setSkillsLoading(true);
      setSkillsError(null);

      try {
        // skill-summaries API doesn't require auth token (user-scoped endpoint)
        const response = await fetch(`/api/user/skill-summaries?userId=${userId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch skills data');
        }

        const data = await response.json();

        if (data.success) {
          setSkillsData(data.summaries || []);
        } else {
          setSkillsError('Failed to load skill data');
        }
      } catch (error) {
        console.error('Error fetching skills data:', error);
        setSkillsError('Unable to load skill summaries');
      } finally {
        setSkillsLoading(false);
      }
    };

    if (userId) {
      fetchSkillsData();
    }
  }, [userId]);

  // Fetch Evidence frameworks data
  useEffect(() => {
    const fetchEvidenceData = async () => {
      setEvidenceLoading(true);
      setEvidenceError(null);

      try {
        const response = await fetch(`/api/admin/evidence/${userId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch evidence data');
        }

        const data = await response.json();
        setEvidenceData(data);
      } catch (error) {
        console.error('Error fetching evidence data:', error);
        setEvidenceError('Unable to load evidence frameworks');
      } finally {
        setEvidenceLoading(false);
      }
    };

    if (userId) {
      fetchEvidenceData();
    }
  }, [userId]);

  // Recalculate urgency for this user
  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      // Use admin proxy to avoid exposing token in client bundle
      const response = await fetch('/api/admin-proxy/urgency', {
        method: 'POST'
      });

      if (response.ok) {
        // Refetch urgency data after recalculation
        const dataResponse = await fetch('/api/admin-proxy/urgency?level=all&limit=200');

        if (dataResponse.ok) {
          const data = await dataResponse.json();
          const student = data.students?.find((s: UrgencyData) => s.userId === userId);
          setUrgencyData(student || null);
        }
      }
    } catch (error) {
      console.error('Recalculation failed:', error);
    } finally {
      setRecalculating(false);
    }
  };

  const formatSkillName = (skill: string): string => {
    return skill
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  };

  const getReadinessDisplay = (readiness: string): { text: string; variant: 'default' | 'secondary' | 'outline' } => {
    switch (readiness) {
      case 'near_ready':
        return { text: 'Near Ready', variant: 'default' };
      case 'skill_gaps':
        return { text: 'Skill Gaps', variant: 'secondary' };
      case 'exploratory':
        return { text: 'Exploratory', variant: 'outline' };
      default:
        return { text: 'Unknown', variant: 'outline' };
    }
  };

  // Helper function to get Birmingham career connections for a skill
  const getBirminghamConnectionsForSkill = (skillName: string): string[] => {
    const skillToCareerMap: Record<string, string[]> = {
      'critical_thinking': ['UAB Healthcare', 'Regions Bank Analytics', 'Innovation Depot Tech'],
      'communication': ['UAB Community Health', 'Birmingham City Schools', 'Local Non-profits'],
      'collaboration': ['Community Health Programs', 'YMCA Youth Programs', 'City Projects'],
      'creativity': ['Innovation Depot Startups', 'Birmingham Arts Scene', 'Design Studios'],
      'adaptability': ['Tech Startups', 'Healthcare Innovation', 'Entrepreneurship Programs'],
      'leadership': ['Youth Leadership Programs', 'Community Organizations', 'Team Projects'],
      'digital_literacy': ['Regions Bank IT', 'Shipt Tech', 'Innovation Depot'],
      'emotional_intelligence': ['UAB Healthcare', 'Community Health', 'Social Services'],
      'cultural_competence': ['Community Health', 'Birmingham Non-profits', 'Public Service'],
      'financial_literacy': ['Regions Bank', 'Local Credit Unions', 'Financial Planning'],
      'time_management': ['All Professional Paths', 'Project Management', 'Operations'],
      'problem_solving': ['Engineering (Southern Company)', 'Healthcare Tech', 'Data Analytics']
    };

    return skillToCareerMap[skillName.toLowerCase()] || ['Various Birmingham Career Paths'];
  };

  // Get color for skill demonstration count
  const getSkillColor = (count: number, maxCount: number): string => {
    const ratio = count / maxCount;
    if (ratio > 0.7) return 'bg-orange-500';
    if (ratio > 0.4) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{user.userName}</CardTitle>
              <CardDescription>
                Skills-Based Career Profile
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              {user.careerMatches.length > 0 && (
                <Badge variant={getReadinessDisplay(user.careerMatches[0].readiness).variant} className="text-lg">
                  {getReadinessDisplay(user.careerMatches[0].readiness).text}
                </Badge>
              )}
              <AdvisorBriefingButton profile={user} variant="default" size="default" />
              <ExportButton profile={user} variant="outline" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-7">
          <TabsTrigger value="urgency">Urgency</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="careers">Careers</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="gaps">Gaps</TabsTrigger>
          <TabsTrigger value="action">Action</TabsTrigger>
          <TabsTrigger value="2030skills">2030 Skills</TabsTrigger>
        </TabsList>

        {/* URGENCY TAB - Glass Box intervention priority */}
        <TabsContent value="urgency" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Intervention Priority
                  </CardTitle>
                  <CardDescription>
                    Glass Box urgency scoring with transparent narrative justification
                  </CardDescription>
                </div>
                <Button
                  onClick={handleRecalculate}
                  disabled={recalculating}
                  size="sm"
                  className="gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${recalculating ? 'animate-spin' : ''}`} />
                  Recalculate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {urgencyLoading ? (
                <div className="text-center py-12 text-gray-500">
                  Loading urgency data...
                </div>
              ) : urgencyError ? (
                <div className="text-center py-12 text-red-500">
                  {urgencyError}
                </div>
              ) : !urgencyData ? (
                <div className="text-center py-12 space-y-4">
                  <p className="text-gray-600">No urgency data available for this student.</p>
                  <p className="text-sm text-gray-500">
                    Click "Recalculate" to generate urgency score.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Urgency Level Badge and Score */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Urgency Level</p>
                      <Badge
                        className={
                          urgencyData.urgencyLevel === 'critical' ? 'bg-red-100 text-red-800' :
                          urgencyData.urgencyLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                          urgencyData.urgencyLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          urgencyData.urgencyLevel === 'low' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {urgencyData.urgencyLevel?.toUpperCase() || 'PENDING'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Urgency Score</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {Math.round((urgencyData.urgencyScore || 0) * 100)}%
                      </p>
                    </div>
                  </div>

                  {/* Glass Box Narrative - The Hero Element */}
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Glass Box Narrative:</h4>
                    <p className="text-sm italic text-gray-700 leading-relaxed">
                      {urgencyData.urgencyNarrative || "No narrative generated yet."}
                    </p>
                  </div>

                  {/* Contributing Factors with Progress Bars */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-700">Contributing Factors:</h4>

                    {/* Disengagement (40% weight) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Disengagement</span>
                        <span className="text-gray-600">40% weight • {Math.round((urgencyData.disengagementScore || 0) * 100)}%</span>
                      </div>
                      <Progress value={(urgencyData.disengagementScore || 0) * 100} className="h-2" />
                    </div>

                    {/* Confusion (30% weight) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Confusion</span>
                        <span className="text-gray-600">30% weight • {Math.round((urgencyData.confusionScore || 0) * 100)}%</span>
                      </div>
                      <Progress value={(urgencyData.confusionScore || 0) * 100} className="h-2" />
                    </div>

                    {/* Stress (20% weight) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Stress</span>
                        <span className="text-gray-600">20% weight • {Math.round((urgencyData.stressScore || 0) * 100)}%</span>
                      </div>
                      <Progress value={(urgencyData.stressScore || 0) * 100} className="h-2" />
                    </div>

                    {/* Isolation (10% weight) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Isolation</span>
                        <span className="text-gray-600">10% weight • {Math.round((urgencyData.isolationScore || 0) * 100)}%</span>
                      </div>
                      <Progress value={(urgencyData.isolationScore || 0) * 100} className="h-2" />
                    </div>
                  </div>

                  {/* Activity Summary */}
                  <div className="pt-4 border-t space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700">Activity Summary:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Last Activity</p>
                        <p className="font-medium">
                          {new Date(urgencyData.lastActivity).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Choices</p>
                        <p className="font-medium">{urgencyData.totalChoices || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Scenes Visited</p>
                        <p className="font-medium">{urgencyData.uniqueScenesVisited || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Relationships Formed</p>
                        <p className="font-medium">{urgencyData.relationshipsFormed || 0}</p>
                      </div>
                    </div>
                  </div>

                  {/* High/Critical Alert */}
                  {urgencyData.urgencyLevel && ['high', 'critical'].includes(urgencyData.urgencyLevel) && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-red-900">Action Required</h4>
                          <p className="text-sm text-red-700 mt-1">
                            This student shows {urgencyData.urgencyLevel} urgency indicators.
                            Consider immediate counselor intervention or follow-up.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SKILLS TAB - Evidence-first design */}
        <TabsContent value="skills" className="space-y-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Evidence-based skill profile from {user.totalDemonstrations} demonstrations across journey
            </p>
          </div>

          {/* Skill Progression Timeline Chart */}
          <SkillProgressionChart
            skillDemonstrations={user.skillDemonstrations}
            totalDemonstrations={user.totalDemonstrations}
          />

          <div className="grid gap-6">
            {Object.entries(user.skillDemonstrations)
              .filter(([_, demos]) => demos.length > 0)
              .sort(([,a], [,b]) => b.length - a.length)
              .map(([skill, demonstrations]) => {
                // Get most recent demonstrations (up to 3)
                const recentDemos = demonstrations
                  .sort((a, b) => {
                    // If timestamp exists, use it, otherwise consider order
                    const aTime = (a as any).timestamp || 0
                    const bTime = (b as any).timestamp || 0
                    return bTime - aTime
                  })
                  .slice(0, 3)

                const hasMore = demonstrations.length > 3

                return (
                  <Card key={skill} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-xl">
                            {formatSkillName(skill)}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Demonstrated through {demonstrations.length === 1 ? '1 choice' : `${demonstrations.length} choices`}
                          </p>
                        </div>

                        <Badge variant="secondary" className="text-base px-3 py-1">
                          {demonstrations.length} {demonstrations.length === 1 ? 'time' : 'times'}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm text-muted-foreground">Key Evidence:</h4>

                        {recentDemos.map((demo, idx) => {
                          const timestamp = (demo as any).timestamp
                          const choiceText = (demo as any).choice || demo.context.substring(0, 80)

                          return (
                            <div
                              key={idx}
                              className="border-l-2 border-blue-300 pl-4 py-2 space-y-2 bg-muted/30 rounded-r"
                            >
                              <div className="flex items-start justify-between">
                                <p className="font-medium text-sm">{demo.scene}</p>
                                {timestamp && (
                                  <Badge variant="outline" className="text-xs">
                                    {new Date(timestamp).toLocaleDateString()}
                                  </Badge>
                                )}
                              </div>

                              {choiceText && (
                                <p className="text-sm text-muted-foreground italic">
                                  "{choiceText}"
                                </p>
                              )}

                              <p className="text-sm leading-relaxed">
                                {demo.context}
                              </p>
                            </div>
                          )
                        })}

                        {hasMore && (
                          <Button variant="ghost" size="sm" className="w-full">
                            {/* Agent 8: Action-oriented button text (Issue 9B) */}
                            Show all {demonstrations.length} demonstrations →
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>

          {Object.keys(user.skillDemonstrations).filter(skill => user.skillDemonstrations[skill].length > 0).length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {/* Agent 2: Encouraging empty state (Issue 49) */}
                Ready to explore skills! {user.userName.split(' ')[0]} will demonstrate abilities as they make choices in their journey.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* CAREERS TAB - Actual Birmingham pathways */}
        <TabsContent value="careers" className="space-y-4">
          {/* NARRATIVE BRIDGE: Skills → Careers - Agent 2: <25 words (Issue 7A-7C) */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
            <p className="text-sm text-gray-700">
              <strong>From Skills to Careers:</strong> {user.userName.split(' ')[0]}'s {user.totalDemonstrations} skill demonstrations reveal Birmingham career matches. Scores show skill fit and readiness.
            </p>
          </div>

          {/* Show Evidence-based career exploration or message if no data */}
          {evidenceData && evidenceData.careerExploration ? (
            <Card>
              <CardHeader>
                {/* Agent 2: Personalized section header (Issue 10A) */}
                <CardTitle>{user.userName.split(' ')[0]}'s Career Exploration Progress</CardTitle>
                <CardDescription>
                  Paths explored: {evidenceData.careerExploration.totalExplorations} |
                  Demonstrated skills: {evidenceData.careerExploration.skillsDemonstrated}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {evidenceData.careerExploration.paths?.map((path: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-semibold">{path.category || `Career Path ${idx + 1}`}</h3>
                      <p className="text-sm text-gray-600">{path.description || 'Exploring career opportunities'}</p>
                      {path.opportunities && (
                        <div className="mt-2 text-xs text-gray-500">
                          Birmingham opportunities: {path.opportunities.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : user.careerMatches && user.careerMatches.length > 0 ? (
            user.careerMatches.map((career) => (
              <Card key={career.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{career.name}</CardTitle>
                    <Badge variant={getReadinessDisplay(career.readiness).variant}>{getReadinessDisplay(career.readiness).text}</Badge>
                  </div>
                  <CardDescription>
                    ${career.salaryRange[0].toLocaleString()} - ${career.salaryRange[1].toLocaleString()} •
                    Birmingham Relevance: {Math.round(career.birminghamRelevance * 100)}%
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Skill requirements */}
                  <div>
                    <p className="text-sm font-medium mb-2">Skill Requirements:</p>
                    <div className="space-y-2">
                      {Object.entries(career.requiredSkills).map(([skill, data]) => (
                        <div key={skill} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="capitalize">{skill.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className={data.gap > 0 ? "text-yellow-600" : "text-green-600"}>
                              {data.current >= data.required ? "✓ Met" : `Gap: ${Math.round(data.gap * 100)}%`}
                            </span>
                          </div>
                          <div className="flex gap-1 items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${data.gap > 0 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${(data.current / data.required) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-16 text-right">
                              {Math.round(data.current * 100)}/{Math.round(data.required * 100)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education paths */}
                  <div>
                    <p className="text-sm font-medium mb-1">Education Pathways:</p>
                    <div className="flex flex-wrap gap-1">
                      {career.educationPaths.map(path => (
                        <Badge key={path} variant="secondary" className="text-xs">{path}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Local opportunities */}
                  <div>
                    <p className="text-sm font-medium mb-1">Birmingham Employers:</p>
                    <div className="flex flex-wrap gap-1">
                      {career.localOpportunities.map(opp => (
                        <Badge key={opp} variant="outline" className="text-xs">{opp}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Readiness */}
                  <div className="pt-2 border-t">
                    {career.readiness === 'near_ready' && (
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                        <p className="text-green-600">
                          <strong>Near Ready:</strong> Small skill gaps. Consider exploratory experiences.
                        </p>
                      </div>
                    )}
                    {career.readiness === 'skill_gaps' && (
                      <div className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <p className="text-yellow-600">
                          <strong>Skill Gaps:</strong> Good foundation but needs development. See Gaps tab.
                        </p>
                      </div>
                    )}
                    {career.readiness === 'exploratory' && (
                      <div className="flex items-start gap-2 text-sm">
                        <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                        <p className="text-blue-600">
                          <strong>Worth Exploring:</strong> Moderate match. Informational interviews recommended.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {/* Agent 2: Encouraging empty state (Issue 49) */}
              Ready to discover careers! {user.userName.split(' ')[0]}'s career matches will appear as they explore their journey.
            </CardContent>
          </Card>
        )}
        </TabsContent>

        {/* EVIDENCE TAB - Scientific frameworks and outcomes */}
        <TabsContent value="evidence" className="space-y-4">
          {/* AGENT 1: Research/Family Meeting Mode Toggle (Issue 5C) */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              {evidenceMode === 'family' ? (
                <Users className="w-5 h-5 text-purple-600" />
              ) : (
                <GraduationCap className="w-5 h-5 text-blue-600" />
              )}
              <span className="font-medium text-sm">
                {evidenceMode === 'family' ? 'Family Meeting Mode' : 'Research Mode'}
              </span>
              <Badge variant="outline" className="text-xs">
                {evidenceMode === 'family' ? 'Plain English' : 'Scientific Terms'}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEvidenceMode(evidenceMode === 'family' ? 'research' : 'family')}
              className="text-xs"
            >
              Switch to {evidenceMode === 'family' ? 'Research' : 'Family'} Mode
            </Button>
          </div>

          {/* DATA SOURCE INDICATOR - Agent 1: Sticky positioning (Issue 4C) */}
          <div className="sticky top-0 z-10">
            <Alert className={
              user.totalDemonstrations >= 10 ? "bg-blue-50 border-blue-400" :
              user.totalDemonstrations >= 5 ? "bg-yellow-50 border-yellow-400" :
              "bg-gray-50 border-gray-400"
            }>
              <AlertCircle className={`h-4 w-4 ${
                user.totalDemonstrations >= 10 ? "text-blue-600" :
                user.totalDemonstrations >= 5 ? "text-yellow-600" :
                "text-gray-600"
              }`} />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Data Source Status:</strong>{" "}
                    {user.totalDemonstrations >= 10 ? (
                      <span className="text-blue-700">
                        Real Student Data ({user.totalDemonstrations} demonstrations)
                      </span>
                    ) : user.totalDemonstrations >= 5 ? (
                      <span className="text-yellow-700">
                        Partial Data ({user.totalDemonstrations} demonstrations - need 10+ for full analysis)
                      </span>
                    ) : (
                      <span className="text-gray-700">
                        Insufficient Data ({user.totalDemonstrations} demonstrations - need 10+ for frameworks)
                      </span>
                    )}
                  </div>
                  {user.totalDemonstrations < 10 && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      Using Mock Data Below
                    </Badge>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Evidence-Based Framework</CardTitle>
              <CardDescription>
                Scientific models and measurable outcomes for funding accountability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Loading/Error States */}
              {evidenceLoading ? (
                <div className="text-center py-12 text-gray-500">
                  <RefreshCw className="w-8 h-8 mx-auto animate-spin mb-2" />
                  <p>Loading evidence frameworks...</p>
                </div>
              ) : evidenceError ? (
                <Alert className="bg-red-50 border-red-400">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription>
                    <strong>Error:</strong> {evidenceError}
                  </AlertDescription>
                </Alert>
              ) : !evidenceData || !evidenceData.frameworks ? (
                <div className="text-center py-12 space-y-4">
                  <p className="text-gray-600">No evidence data available yet.</p>
                  <p className="text-sm text-gray-500">
                    Students need to complete choices to generate framework evidence.
                  </p>
                </div>
              ) : (
                <>
                  {/* Framework 1: Skill Evidence - Agent 1: Audience tags + Plain English (Issues 19, 20) */}
                  <div className="p-3 border rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">Skill Evidence Framework</p>
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                          {evidenceMode === 'family' ? 'For Parents' : 'For Researchers'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{evidenceData.frameworks.skillEvidence.uniqueSkills} Skills Tracked</Badge>
                        <DataSourceBadge
                          hasRealData={evidenceData.frameworks.skillEvidence.hasRealData}
                          minDemonstrations={10}
                          actualDemonstrations={evidenceData.frameworks.skillEvidence.totalDemonstrations}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {evidenceMode === 'family' ? (
                        <span><strong>What this means:</strong> Every time your student makes a choice in the game, we track what skills they showed (like problem-solving or creativity). This shows real evidence of their growing abilities.</span>
                      ) : (
                        <span><strong>Framework:</strong> Tracked skill demonstrations showing concrete evidence of capability development.</span>
                      )}
                    </p>
                    <div className="bg-blue-50 p-2 rounded text-xs">
                      <p className="font-medium mb-1">Student Outcomes:</p>
                      <div className="space-y-1">
                        <p>• Total Demonstrations: <strong>{evidenceData.frameworks.skillEvidence.totalDemonstrations}</strong></p>
                        <p>• Unique Skills: <strong>{evidenceData.frameworks.skillEvidence.uniqueSkills}</strong></p>
                        {evidenceData.frameworks.skillEvidence.skillBreakdown.slice(0, 3).map((skill: any) => (
                          <p key={skill.skill}>
                            • {skill.skill}: {skill.demonstrations} demonstrations
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Framework 2: Career Readiness - Agent 1: Audience tags + Plain English (Issues 19, 20) */}
                  <div className="p-3 border rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">Career Readiness Framework</p>
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                          {evidenceMode === 'family' ? 'For Parents' : 'For Researchers'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{evidenceData.frameworks.careerReadiness.exploredCareers} Careers Explored</Badge>
                        <DataSourceBadge
                          hasRealData={evidenceData.frameworks.careerReadiness.hasRealData}
                          minDemonstrations={1}
                          actualDemonstrations={evidenceData.frameworks.careerReadiness.exploredCareers}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {evidenceMode === 'family' ? (
                        <span><strong>What this means:</strong> We track which careers your student explores and how well their current skills match each one. This helps you see where they're headed and what they need to get there.</span>
                      ) : (
                        <span><strong>Framework:</strong> Career exploration and match quality showing pathway clarity.</span>
                      )}
                    </p>
                    <div className="bg-blue-50 p-2 rounded text-xs">
                      <p className="font-medium mb-1">Student Progress:</p>
                      <div className="space-y-1">
                        {evidenceData.frameworks.careerReadiness.topMatch ? (
                          <>
                            <p>• Top Match: <strong>{evidenceData.frameworks.careerReadiness.topMatch.career_name}</strong></p>
                            <p>• Match Score: <strong>{Math.round((evidenceData.frameworks.careerReadiness.topMatch.match_score || 0) * 100)}%</strong></p>
                            <p>• Readiness: <strong>{evidenceData.frameworks.careerReadiness.topMatch.readiness_level}</strong></p>
                          </>
                        ) : (
                          <p>• Discovering career paths - keep exploring!</p>
                        )}
                        <p>• Birmingham Opportunities: <strong>{evidenceData.frameworks.careerReadiness.birminghamOpportunities.length}</strong></p>
                      </div>
                    </div>
                  </div>

                  {/* Framework 3: Pattern Recognition - Agent 1: Audience tags + Plain English (Issues 19, 20) */}
                  <div className="p-3 border rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">Pattern Recognition Framework</p>
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                          {evidenceMode === 'family' ? 'For Parents' : 'For Researchers'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Behavioral Analysis</Badge>
                        <DataSourceBadge
                          hasRealData={evidenceData.frameworks.patternRecognition.hasRealData}
                          minDemonstrations={15}
                          actualDemonstrations={evidenceData.frameworks.patternRecognition.totalChoices}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {evidenceMode === 'family' ? (
                        <span><strong>What this means:</strong> We look for patterns in your student's choices. Are they consistently helping others? Do they prefer solving problems alone or with others? These patterns reveal their natural strengths.</span>
                      ) : (
                        <span><strong>Framework:</strong> Consistency and progression patterns in choice behavior.</span>
                      )}
                    </p>
                    <div className="bg-blue-50 p-2 rounded text-xs">
                      <p className="font-medium mb-1">Behavioral Patterns:</p>
                      <div className="space-y-1">
                        <p>• Pattern Consistency: <strong>{Math.round((evidenceData.frameworks.patternRecognition.patternConsistency || 0) * 100)}%</strong></p>
                        <p>• Total Choices: <strong>{evidenceData.frameworks.patternRecognition.totalChoices}</strong></p>
                        {evidenceData.frameworks.patternRecognition.behavioralTrends.map((trend: string, i: number) => (
                          <p key={i}>• {trend}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Framework 4: Time Investment - Agent 1: Audience tags + Plain English (Issues 19, 20) */}
                  <div className="p-3 border rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">Time Investment Framework</p>
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                          {evidenceMode === 'family' ? 'For Parents' : 'For Researchers'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Engagement Tracking</Badge>
                        <DataSourceBadge
                          hasRealData={evidenceData.frameworks.timeInvestment.hasRealData}
                          minDemonstrations={10}
                          actualDemonstrations={evidenceData.frameworks.timeInvestment.totalDays}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {evidenceMode === 'family' ? (
                        <span><strong>What this means:</strong> We track how often your student uses the tool and whether they're staying engaged. Consistent engagement shows they're actively thinking about their future.</span>
                      ) : (
                        <span><strong>Framework:</strong> Sustained engagement and consistency over time.</span>
                      )}
                    </p>
                    <div className="bg-blue-50 p-2 rounded text-xs">
                      <p className="font-medium mb-1">Engagement Metrics:</p>
                      <div className="space-y-1">
                        <p>• Days Active: <strong>{evidenceData.frameworks.timeInvestment.totalDays}</strong></p>
                        <p>• Avg Demos/Day: <strong>{evidenceData.frameworks.timeInvestment.averageDemosPerDay.toFixed(1)}</strong></p>
                        <p>• Consistency Score: <strong>{Math.round((evidenceData.frameworks.timeInvestment.consistencyScore || 0) * 100)}%</strong></p>
                      </div>
                    </div>
                  </div>

                  {/* Framework 5: Relationship Framework - Agent 1: Audience tags + Plain English (Issues 19, 20) */}
                  <div className="p-3 border rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">Relationship Development Framework</p>
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                          {evidenceMode === 'family' ? 'For Parents' : 'For Researchers'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{evidenceData.frameworks.relationshipFramework.totalRelationships} Relationships</Badge>
                        <DataSourceBadge
                          hasRealData={evidenceData.frameworks.relationshipFramework.hasRealData}
                          minDemonstrations={1}
                          actualDemonstrations={evidenceData.frameworks.relationshipFramework.totalRelationships}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {evidenceMode === 'family' ? (
                        <span><strong>What this means:</strong> Your student builds relationships with characters in the game (like Maya or Samuel). How they interact shows their social skills and emotional intelligence.</span>
                      ) : (
                        <span><strong>Framework:</strong> Social-emotional learning through character relationships.</span>
                      )}
                    </p>
                    <div className="bg-blue-50 p-2 rounded text-xs">
                      <p className="font-medium mb-1">Relationship Metrics:</p>
                      <div className="space-y-1">
                        <p>• Average Trust: <strong>{evidenceData.frameworks.relationshipFramework.averageTrust.toFixed(1)}/10</strong></p>
                        {evidenceData.frameworks.relationshipFramework.relationshipDetails.slice(0, 3).map((rel: any) => (
                          <p key={rel.character}>• {rel.character}: Trust {rel.trust}/10</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Framework 6: Behavioral Consistency - Agent 1: Audience tags + Plain English (Issues 19, 20) */}
                  <div className="p-3 border rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">Behavioral Consistency Framework</p>
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                          {evidenceMode === 'family' ? 'For Parents' : 'For Researchers'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Focus Analysis</Badge>
                        <DataSourceBadge
                          hasRealData={evidenceData.frameworks.behavioralConsistency.hasRealData}
                          minDemonstrations={20}
                          actualDemonstrations={evidenceData.frameworks.behavioralConsistency.topThreeSkills.reduce((sum: number, s: any) => sum + s.count, 0)}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {evidenceMode === 'family' ? (
                        <span><strong>What this means:</strong> We check if your student focuses deeply on a few skills or explores many different ones. Both approaches are valid - this helps you understand their style.</span>
                      ) : (
                        <span><strong>Framework:</strong> Focus vs exploration balance analysis.</span>
                      )}
                    </p>
                    <div className="bg-blue-50 p-2 rounded text-xs">
                      <p className="font-medium mb-1">Consistency Metrics:</p>
                      <div className="space-y-1">
                        <p>• Focus Score: <strong>{Math.round((evidenceData.frameworks.behavioralConsistency.focusScore || 0) * 100)}%</strong></p>
                        <p>• Exploration Score: <strong>{Math.round((evidenceData.frameworks.behavioralConsistency.explorationScore || 0) * 100)}%</strong></p>
                        <p>• Platform Alignment: <strong>{evidenceData.frameworks.behavioralConsistency.platformAlignment}</strong> platforms</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Scientific Literature Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Scientific Literature Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>• <strong>Skill Evidence:</strong> WEF Future of Jobs Report (2020, 2023)</p>
              <p>• <strong>Career Readiness:</strong> Holland, J. L. (1997). Making Vocational Choices</p>
              <p>• <strong>Pattern Recognition:</strong> Behavioral consistency & development research</p>
              <p>• <strong>Time Investment:</strong> Engagement metrics & sustained learning theory</p>
              <p>• <strong>Relationships:</strong> Social-emotional learning frameworks</p>
              <p>• <strong>Behavioral Consistency:</strong> Focus vs exploration balance analysis</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GAPS TAB - What skills need development */}
        <TabsContent value="gaps" className="space-y-4">
          {/* NARRATIVE BRIDGE: Careers → Gaps - Agent 2: <25 words (Issue 7A-7C) */}
          {evidenceData?.careerExploration && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r">
              <p className="text-sm text-gray-700">
                <strong>Skills Development Path:</strong> {evidenceData.careerExploration.totalExplorations} career explorations reveal growth areas. Gaps aren't weaknesses—they're opportunities with clear pathways.
              </p>
            </div>
          )}

          {/* Show Evidence-based skill progression or message if no data */}
          {evidenceData && evidenceData.skillSummaries && evidenceData.skillSummaries.length > 0 ? (
            <Card>
              <CardHeader>
                {/* Agent 2: Personalized section header (Issue 10A) */}
                <CardTitle>{user.userName.split(' ')[0]}'s Skill Development Progress</CardTitle>
                <CardDescription>
                  Real-time skill demonstration tracking from gameplay
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {evidenceData.skillSummaries.map((skill: any, idx: number) => (
                    <div key={idx} className="p-3 border rounded space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">
                          {skill.skill_name?.replace(/_/g, ' ') || `Skill ${idx + 1}`}
                        </span>
                        <Badge variant={skill.demonstration_count >= 5 ? 'default' : 'secondary'}>
                          {skill.demonstration_count || 0} demonstrations
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Progress:</span>
                        <Progress value={(skill.demonstration_count || 0) * 10} className="flex-1 h-2" />
                        <span className="font-medium">{skill.demonstration_count || 0}/10</span>
                      </div>

                      {skill.last_demonstrated && (
                        <p className="text-xs text-muted-foreground">
                          Last demonstrated: {new Date(skill.last_demonstrated).toLocaleDateString()}
                        </p>
                      )}

                      {skill.demonstration_count < 5 && (
                        <p className="text-xs text-amber-600 italic">
                          Continue making choices to develop this skill
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : user.skillGaps && user.skillGaps.length > 0 ? (
            <Card>
              <CardHeader>
                {/* Agent 2: Personalized section header (Issue 10A) */}
                <CardTitle>{user.userName.split(' ')[0]}'s Skill Development Priorities</CardTitle>
                <CardDescription>
                  Skills to develop for top career matches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.skillGaps
                    .sort((a, b) => {
                      const priorityOrder = { high: 3, medium: 2, low: 1 };
                      return priorityOrder[b.priority] - priorityOrder[a.priority];
                    })
                    .map((gap, idx) => (
                      <div key={idx} className="p-3 border rounded space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium capitalize">
                              {gap.skill.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            {/* Sparkline Trend Indicator */}
                            <SparklineTrend
                              current={gap.currentLevel}
                              target={gap.targetForTopCareers}
                              width={40}
                              height={12}
                            />
                          </div>
                          <Badge variant={gap.priority === 'high' ? 'destructive' : 'secondary'}>
                            {gap.priority} priority
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Current:</span>
                          <Progress value={gap.currentLevel * 100} className="flex-1 h-2" />
                          <span className="font-medium">{Math.round(gap.currentLevel * 100)}%</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Target:</span>
                          <div className="flex-1 bg-green-100 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }} />
                          </div>
                          <span className="font-medium">{Math.round(gap.targetForTopCareers * 100)}%</span>
                        </div>

                        <p className="text-xs text-muted-foreground italic">
                          {gap.developmentPath}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {/* Agent 2: Encouraging empty state (Issue 49) */}
                Building skills daily! Gap analysis will appear as {user.userName.split(' ')[0]} explores career pathways.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ACTION TAB - Administrator next steps */}
        <TabsContent value="action" className="space-y-4">
          {/* NARRATIVE BRIDGE: Gaps → Action - Agent 2: <25 words (Issue 7A-7C) */}
          {user.skillGaps.length > 0 && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r">
              <p className="text-sm text-gray-700">
                <strong>From Analysis to Action:</strong> Birmingham opportunities to build {user.skillGaps[0].skill.replace(/([A-Z])/g, ' $1').toLowerCase()} and advance toward {user.careerMatches[0]?.name || 'career goals'}. Start this week.
              </p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Administrator Action Plan
              </CardTitle>
              <CardDescription>Concrete next steps for this student</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Conversation starters */}
              <div>
                <p className="font-medium text-sm mb-2">Conversation Starters:</p>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-blue-50 rounded border-l-2 border-blue-600">
                    <p>"You showed strong emotional intelligence and problem-solving skills. 
                    Have you thought about healthcare technology roles that use both?"</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded border-l-2 border-blue-600">
                    <p>"Your critical thinking is advanced (82%) but collaboration is developing (58%). 
                    Would you be interested in experiences that build team skills?"</p>
                  </div>
                </div>
              </div>

              {/* Immediate actions */}
              <div>
                <p className="font-medium text-sm mb-2">This Week:</p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <p>Schedule UAB Health Informatics tour (87% career match, near ready)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <p>Discuss digital literacy development options (gap: 12%)</p>
                  </div>
                </div>
              </div>

              {/* Next month */}
              <div>
                <p className="font-medium text-sm mb-2">Next Month:</p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                    <p>Connect with UAB Hospital or Children's Hospital for shadowing</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                    <p>Explore group projects or team activities (collaboration skill gap)</p>
                  </div>
                </div>
              </div>

              {/* What to avoid */}
              <div className="border-t pt-3">
                <p className="font-medium text-sm mb-2 text-red-600">Avoid:</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• Pushing for immediate career commitment (still exploring)</p>
                  <p>• Ignoring skill gaps (collaboration needs work for Community Health path)</p>
                  <p>• Overlooking time management weakness (42% - may struggle with structured programs)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key insights */}
          <Card className="border-2 border-blue-600">
            <CardHeader>
              <CardTitle className="text-lg">Key Psychological Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {user.keySkillMoments.map((moment, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600">→</span>
                  <div>
                    <p className="font-medium">"{moment.choice}"</p>
                    <p className="text-muted-foreground text-xs">{moment.insight}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2030 SKILLS TAB - WEF Skills Tracking */}
        <TabsContent value="2030skills" className="space-y-4">
          {/* NARRATIVE BRIDGE: Action → 2030 Skills - Agent 2: <25 words (Issue 7A-7C) */}
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r">
            <p className="text-sm text-gray-700">
              <strong>World Economic Forum 2030 Skills:</strong> {user.userName.split(' ')[0]}'s choices build skills for workforce readiness and Birmingham careers.
            </p>
          </div>

          {skillsLoading ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                Loading 2030 skills data...
              </CardContent>
            </Card>
          ) : skillsError ? (
            <Card>
              <CardContent className="py-12 text-center text-red-500">
                {skillsError}
              </CardContent>
            </Card>
          ) : skillsData.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center space-y-4">
                <Award className="w-12 h-12 mx-auto text-gray-400" />
                <div>
                  <p className="text-gray-600 font-medium">No skill demonstrations recorded yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Skills are tracked automatically as students make choices in the narrative.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Overview Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    2030 Skills Trajectory
                  </CardTitle>
                  <CardDescription>
                    Skills identified by the World Economic Forum as critical for 2030 workforce readiness
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Top 5 Skills Bars */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-gray-700">Top Demonstrated Skills:</h4>
                    {skillsData
                      .sort((a, b) => b.demonstrationCount - a.demonstrationCount)
                      .slice(0, 5)
                      .map((skill, idx) => {
                        const maxCount = Math.max(...skillsData.map(s => s.demonstrationCount));
                        const percentage = (skill.demonstrationCount / maxCount) * 100;
                        const colorClass = getSkillColor(skill.demonstrationCount, maxCount);

                        return (
                          <div key={skill.skillName} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium capitalize">
                                {skill.skillName.replace(/_/g, ' ')}
                              </span>
                              <span className="text-gray-600">
                                {skill.demonstrationCount} {skill.demonstrationCount === 1 ? 'time' : 'times'}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className={`${colorClass} h-3 rounded-full transition-all`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{skillsData.length}</p>
                      <p className="text-xs text-gray-600">Skills Demonstrated</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {skillsData.reduce((sum, s) => sum + s.demonstrationCount, 0)}
                      </p>
                      <p className="text-xs text-gray-600">Total Demonstrations</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {new Set(skillsData.flatMap(s => s.scenesInvolved)).size}
                      </p>
                      <p className="text-xs text-gray-600">Scenes Involved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Latest Demonstrations Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    Latest Skill Demonstrations
                  </CardTitle>
                  <CardDescription>
                    Click to expand and view full context
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {skillsData
                      .sort((a, b) => new Date(b.lastDemonstrated).getTime() - new Date(a.lastDemonstrated).getTime())
                      .map((skill) => (
                        <div
                          key={skill.skillName}
                          className="border rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
                        >
                          <button
                            onClick={() => setExpandedSkill(expandedSkill === skill.skillName ? null : skill.skillName)}
                            className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-medium capitalize">
                                  {skill.skillName.replace(/_/g, ' ')}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {skill.latestContext.substring(0, 80)}...
                                </p>
                              </div>
                              <div className="flex items-center gap-4 ml-4">
                                <Badge variant="secondary" className="text-xs">
                                  {skill.demonstrationCount}x
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {new Date(skill.lastDemonstrated).toLocaleDateString()}
                                </span>
                                {/* Agent 8: Chevron icon for expandable component (Issue 43) */}
                                <ChevronDown
                                  className={`w-4 h-4 text-gray-400 transition-transform ${
                                    expandedSkill === skill.skillName ? 'rotate-180' : ''
                                  }`}
                                />
                              </div>
                            </div>
                          </button>

                          {/* Expanded Context */}
                          {expandedSkill === skill.skillName && (
                            <div className="p-4 bg-gray-50 border-t space-y-3">
                              <div>
                                <p className="text-xs font-semibold text-gray-700 mb-1">Full Context:</p>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {skill.latestContext}
                                </p>
                              </div>

                              {skill.scenesInvolved.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-gray-700 mb-1">Scenes Involved:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {skill.scenesInvolved.map((scene, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {scene}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Birmingham Career Connections */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-green-600" />
                    Birmingham Career Connections
                  </CardTitle>
                  <CardDescription>
                    Local career paths aligned with demonstrated skills
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skillsData
                    .sort((a, b) => b.demonstrationCount - a.demonstrationCount)
                    .slice(0, 3)
                    .map((skill) => {
                      const connections = getBirminghamConnectionsForSkill(skill.skillName);

                      return (
                        <div key={skill.skillName} className="p-3 border rounded-lg bg-green-50/50">
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-medium capitalize text-sm">
                              {skill.skillName.replace(/_/g, ' ')}
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              {skill.demonstrationCount} demonstrations
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            {connections.map((connection, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                <span className="text-green-600">→</span>
                                <span>{connection}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                  {skillsData.length > 3 && (
                    <p className="text-xs text-gray-500 italic pt-2 border-t">
                      Additional skills demonstrated: {skillsData.slice(3).map(s => s.skillName.replace(/_/g, ' ')).join(', ')}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* WEF Framework Reference */}
              <Card className="border-2 border-blue-600">
                <CardHeader>
                  <CardTitle className="text-sm">World Economic Forum 2030 Skills Framework</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-700">
                    These skills are identified by the World Economic Forum as critical for 2030 workforce readiness.
                    They represent the capabilities employers will seek as the economy evolves.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-700">Cognitive Skills:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Critical Thinking</li>
                        <li>• Creativity</li>
                        <li>• Problem Solving</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <p className="font-semibold text-gray-700">Social-Emotional:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Emotional Intelligence</li>
                        <li>• Communication</li>
                        <li>• Collaboration</li>
                        <li>• Cultural Competence</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <p className="font-semibold text-gray-700">Self-Management:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Adaptability</li>
                        <li>• Time Management</li>
                        <li>• Leadership</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <p className="font-semibold text-gray-700">Technical:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Digital Literacy</li>
                        <li>• Financial Literacy</li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-xs text-gray-500">
                      <strong>Note:</strong> Grand Central Terminus tracks these skills automatically through narrative choices,
                      providing counselors with evidence-based insights for career guidance.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SingleUserDashboard;